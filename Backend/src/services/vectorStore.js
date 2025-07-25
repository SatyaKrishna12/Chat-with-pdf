import { Pinecone } from '@pinecone-database/pinecone';
import { pipeline } from '@xenova/transformers';
import dotenv from 'dotenv';

dotenv.config();

const indexName = 'pdf-documents';
let embedder = null;
let pineconeClient = null;

// Initialize the embedding model
const initializeEmbedder = async () => {
    if (!embedder) {
        console.log('🚀 Initializing embedding model...');
        embedder = await pipeline('feature-extraction', 'Xenova/all-mpnet-base-v2');
        console.log('✅ Embedding model initialized!');
    }
    return embedder;
};

// Initialize Pinecone client
const initializePineconeClient = async () => {
    if (!pineconeClient) {
        const apiKey = process.env.PINECONE_API_KEY;
        if (!apiKey) {
            throw new Error('PINECONE_API_KEY not found in environment variables');
        }
        
        pineconeClient = new Pinecone({
            apiKey: apiKey
        });
        
        console.log('✅ Pinecone client initialized');
    }
    return pineconeClient;
};

// Generate embeddings using Xenova
const generateEmbeddings = async (texts) => {
    const embedder = await initializeEmbedder();
    const embeddings = [];
    
    for (const text of texts) {
        const output = await embedder(text, {
            pooling: 'mean',
            normalize: true
        });
        embeddings.push(Array.from(output.data));
    }
    
    return embeddings;
};

// Helper function to ensure index exists and is ready
const ensureIndexExists = async (client) => {
    console.log('🔍 Checking if index exists...');
    
    try {
        const indexList = await client.listIndexes();
        const indexExists = indexList.indexes?.some(idx => idx.name === indexName);
        
        if (indexExists) {
            console.log('📍 Index already exists');
            const index = client.index(indexName);
            
            // Clear existing data
            console.log('🧹 Clearing existing data...');
            try {
                await index.deleteAll();
            } catch (clearError) {
                console.log('ℹ️ Could not clear existing data (index might be empty)');
            }
            
            return index;
        } else {
            console.log('🔧 Creating new Pinecone index...');
            await client.createIndex({
                name:  indexName,
                dimension: 768, // Dimension for all-mpnet-base-v2 model
                metric: 'cosine',
                spec: {
                    serverless: {
                        cloud: 'aws',
                        region: 'us-east-1'
                    }
                }
            });
            
            // Wait for index to be ready with proper retry logic
            console.log('⏳ Waiting for index to be ready...');
            let retries = 0;
            const maxRetries = 30; // 5 minutes max wait time
            
            while (retries < maxRetries) {
                try {
                    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
                    const index = client.index(indexName);
                    
                    // Test if index is ready by checking stats
                    await index.describeIndexStats();
                    console.log('✅ Index is ready!');
                    return index;
                } catch (error) {
                    retries++;
                    console.log(`⏳ Index not ready yet, retrying... (${retries}/${maxRetries})`);
                    if (retries >= maxRetries) {
                        throw new Error('Index creation timeout. Please try again later.');
                    }
                }
            }
        }
    } catch (error) {
        console.error('❌ Error managing index:', error);
        throw error;
    }
};

export const createVectorStore = async (textChunks, metadata = []) => {
    try {
        console.log('📊 Creating vector store with Pinecone...');
        
        const client = await initializePineconeClient();
        await initializeEmbedder();
        
        // Ensure index exists and is ready
        const index = await ensureIndexExists(client);
        
        console.log('🔄 Generating embeddings...');
        
        // Generate embeddings for all text chunks with progress
        const embeddings = [];
        const totalChunks = textChunks.length;
        
        console.log(`📊 Starting embedding generation for ${totalChunks} chunks...`);
        
        for (let i = 0; i < textChunks.length; i++) {
            const text = textChunks[i];
            const output = await embedder(text, {
                pooling: 'mean',
                normalize: true
            });
            embeddings.push(Array.from(output.data));
            
            // Log progress every 5 chunks or at the end
            if ((i + 1) % 5 === 0 || i === textChunks.length - 1) {
                const percentage = Math.round(((i + 1) / totalChunks) * 100);
                console.log(`🔄 Embedding progress: ${i + 1}/${totalChunks} (${percentage}%)`);
            }
        }
        
        console.log('✅ All embeddings generated successfully!');
        console.log('📝 Preparing to upload documents to Pinecone...');
        
        // Prepare vectors for Pinecone
        const vectors = textChunks.map((text, i) => ({
            id: `doc_${i}`,
            values: embeddings[i],
            metadata: {
                text: text,
                source: metadata[i]?.source || 'unknown',
                chunk_index: i,
                timestamp: new Date().toISOString(),
                ...metadata[i]
            }
        }));
        
        // Upsert vectors to Pinecone (batch size of 100) with progress
        const batchSize = 100;
        const totalBatches = Math.ceil(vectors.length / batchSize);
        
        console.log(`📤 Starting upload of ${vectors.length} vectors in ${totalBatches} batches...`);
        
        for (let i = 0; i < vectors.length; i += batchSize) {
            const batch = vectors.slice(i, i + batchSize);
            const currentBatch = Math.floor(i / batchSize) + 1;
            const uploadPercentage = Math.round((currentBatch / totalBatches) * 100);
            
            console.log(`📤 Uploading batch ${currentBatch}/${totalBatches} (${batch.length} vectors) - ${uploadPercentage}%`);
            
            try {
                await index.upsert(batch);
                console.log(`✅ Batch ${currentBatch} uploaded successfully`);
            } catch (error) {
                console.error(`❌ Error uploading batch ${currentBatch}:`, error);
                throw error;
            }
            
            // Small delay between batches to prevent rate limiting
            if (i + batchSize < vectors.length) {
                console.log('⏳ Waiting 500ms before next batch...');
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        
        console.log(`✅ Vector store created with ${textChunks.length} documents`);
        return index;
        
    } catch (error) {
        console.error('❌ Error creating vector store:', error);
        throw error;
    }
};


export const loadVectorStore = async () => {
    try {
        const client = await initializePineconeClient();
        const index = client.index(indexName);
        
        // Check if index exists by getting stats
        const stats = await index.describeIndexStats();
        
        if (stats.totalVectorCount === 0) {
            throw new Error('No documents found in vector store. Please upload a PDF first.');
        }
        
        console.log('✅ Vector store loaded successfully');
        return index;
        
    } catch (error) {
        console.error('❌ Error loading vector store:', error);
        throw new Error('Vector store not found. Please create it first.');
    }
};

export const searchVectorStore = async (query, topK = 5) => {
    try {
        const index = await loadVectorStore();
        
        // Generate embedding for the query
        await initializeEmbedder();
        const queryEmbedding = await generateEmbeddings([query]);
        
        // Search in Pinecone
        const searchResults = await index.query({
            vector: queryEmbedding[0],
            topK: topK,
            includeMetadata: true,
            includeValues: false
        });
        
        // Format results to match ChromaDB format for compatibility
        const documents = searchResults.matches.map(match => match.metadata.text);
        const metadatas = searchResults.matches.map(match => {
            const { text, ...metadata } = match.metadata;
            return metadata;
        });
        const distances = searchResults.matches.map(match => 1 - match.score); // Convert similarity to distance
        
        return {
            documents,
            metadatas,
            distances
        };
        
    } catch (error) {
        console.error('❌ Error searching vector store:', error);
        throw error;
    }
};

export const deleteVectorStore = async () => {
    try {
        const client = await initializePineconeClient();
        await client.deleteIndex(indexName);
        console.log('🗑️ Vector store deleted successfully');
    } catch (error) {
        console.error('❌ Error deleting vector store:', error);
        throw error;
    }
};

export const getVectorStoreInfo = async () => {
    try {
        const index = await loadVectorStore();
        const stats = await index.describeIndexStats();
        
        return {
            name: indexName,
            count: stats.totalVectorCount || 0,
            embedding_model: 'Xenova/all-mpnet-base-v2',
            dimension: stats.dimension || 768,
            index_fullness: stats.indexFullness || 0
        };
        
    } catch (error) {
        console.error('❌ Error getting vector store info:', error);
        throw error;
    }
};
