import { ChromaClient } from 'chromadb';
import { DefaultEmbeddingFunction } from '@chroma-core/default-embed';
import { pipeline } from '@xenova/transformers';

const collectionName = 'pdf_documents';
let embedder = null;
let chromaClient = null;

// Initialize the embedding model
const initializeEmbedder = async () => {
    if (!embedder) {
        console.log('🚀 Initializing embedding model...');
        embedder = await pipeline('feature-extraction', 'Xenova/all-mpnet-base-v2');
        console.log('✅ Embedding model initialized!');
    }
    return embedder;
};

// Initialize ChromaDB client
const initializeChromaClient = async () => {
    if (!chromaClient) {
        chromaClient = new ChromaClient({
            path: "http://localhost:8000" // Default ChromaDB server
        });
    }
    return chromaClient;
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

export const createVectorStore = async (textChunks, metadata = []) => {
    try {
        console.log('📊 Creating vector store with Chroma...');
        
        const client = await initializeChromaClient();
        
        // Delete existing collection if it exists
        try {
            await client.deleteCollection({ name: collectionName });
            console.log('🗑️ Deleted existing collection');
        } catch (error) {
            // Collection doesn't exist, that's fine
        }
        
        // Create new collection with default embedding function
        const embeddingFunction = new DefaultEmbeddingFunction();
        
        const collection = await client.createCollection({
            name: collectionName,
            metadata: { "hnsw:space": "cosine" },
            embeddingFunction: embeddingFunction
        });
        
        console.log('� Adding documents to collection...');
        
        // Prepare documents for insertion (ChromaDB will handle embeddings)
        const ids = textChunks.map((_, index) => `doc_${index}`);
        const metadatas = textChunks.map((_, index) => 
            metadata[index] || { index, timestamp: new Date().toISOString() }
        );
        
        // Add documents to collection
        await collection.add({
            ids: ids,
            documents: textChunks,
            metadatas: metadatas
        });
        
        console.log(`✅ Vector store created with ${textChunks.length} documents`);
        return collection;
        
    } catch (error) {
        console.error('❌ Error creating vector store:', error);
        throw error;
    }
};

export const loadVectorStore = async () => {
    try {
        const client = await initializeChromaClient();
        
        // Get existing collection with default embedding function
        const embeddingFunction = new DefaultEmbeddingFunction();
        const collection = await client.getCollection({ 
            name: collectionName,
            embeddingFunction: embeddingFunction
        });
        
        console.log('✅ Vector store loaded successfully');
        return collection;
        
    } catch (error) {
        console.error('❌ Error loading vector store:', error);
        throw new Error('Vector store not found. Please create it first.');
    }
};

export const searchVectorStore = async (query, topK = 5) => {
    try {
        const collection = await loadVectorStore();
        
        // Search in collection using query text (ChromaDB will handle embedding)
        const results = await collection.query({
            queryTexts: [query],
            nResults: topK,
            include: ['documents', 'metadatas', 'distances']
        });
        
        return {
            documents: results.documents[0],
            metadatas: results.metadatas[0],
            distances: results.distances[0]
        };
        
    } catch (error) {
        console.error('❌ Error searching vector store:', error);
        throw error;
    }
};


export const deleteVectorStore = async () => {
    try {
        const client = await initializeChromaClient();
        await client.deleteCollection({ name: collectionName });
        console.log('🗑️ Vector store deleted successfully');
    } catch (error) {
        console.error('❌ Error deleting vector store:', error);
        throw error;
    }
};

export const getVectorStoreInfo = async () => {
    try {
        const collection = await loadVectorStore();
        const count = await collection.count();
        
        return {
            name: collectionName,
            count,
            embedding_model: 'ChromaDB Default Embedding Function'
        };
        
    } catch (error) {
        console.error('❌ Error getting vector store info:', error);
        throw error;
    }
};