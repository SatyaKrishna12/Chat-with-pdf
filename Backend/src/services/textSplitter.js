import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

const getTextChunks = async (text) => {
    console.log('✂️ Starting text chunking process...');
    console.log(`📝 Input text length: ${text.length} characters`);
    
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1500,
        chunkOverlap: 300,
        // chunkSize: 10000,
        // chunkOverlap: 1000,
    });
    
    console.log('🔄 Splitting text into chunks...');
    const chunks = await textSplitter.splitText(text);
    
    console.log(`✅ Text splitting complete! Created ${chunks.length} chunks`);
    console.log(`📊 Average chunk size: ${Math.round(text.length / chunks.length)} characters`);
    
    return chunks;
};

export default getTextChunks;