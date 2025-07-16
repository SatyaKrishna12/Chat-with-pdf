import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

const getTextChunks = async (text) => {
    const textSplitter = new RecursiveCharacterTextSplitter({
        // chunkSize: 1500,
        // chunkOverlap: 300,
        chunkSize: 10000,
        chunkOverlap: 1000,
    });
    return await textSplitter.splitText(text);
};

export default getTextChunks;