import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';

dotenv.config();

async function testPineconeConnection() {
    try {
        console.log('🔌 Testing Pinecone connection...');
        
        const apiKey = process.env.PINECONE_API_KEY;
        if (!apiKey || apiKey === 'your_pinecone_api_key_here') {
            console.error('❌ Please set your PINECONE_API_KEY in the .env file');
            return;
        }
        
        const pinecone = new Pinecone({ apiKey });
        
        // List existing indexes
        const indexes = await pinecone.listIndexes();
        console.log('📋 Existing indexes:', indexes.indexes?.map(idx => idx.name) || []);
        
        console.log('✅ Pinecone connection successful!');
        
    } catch (error) {
        console.error('❌ Pinecone connection failed:', error.message);
    }
}

testPineconeConnection();
