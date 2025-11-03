import { 
    searchVectorStore, 
    getVectorStoreInfo 
} from '../services/vectorStore.js';
import { generateResponse } from '../services/llmService.js';
import { SEARCH_CONFIG } from '../config/searchConfig.js'; 

// Helper function to format LLM response
const formatLLMResponse = (response) => {
    if (!response) return response;
    
    let formatted = response;
    
    // Convert **text** to <strong>text</strong> for bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert *text* to <em>text</em> for italic
    formatted = formatted.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
    
    // Convert numbered lists (1. text) to proper HTML lists
    const numberedListRegex = /^(\d+\.\s+.+)(?:\n(\d+\.\s+.+))*$/gm;
    formatted = formatted.replace(/(\n|^)(\d+\.\s+.+(?:\n\d+\.\s+.+)*)/g, (match, prefix, listContent) => {
        const items = listContent.split('\n').map(item => {
            const cleaned = item.replace(/^\d+\.\s+/, '');
            return `<li>${cleaned}</li>`;
        }).join('');
        return `${prefix}<ol>${items}</ol>`;
    });
    
    // Convert bullet points (- text or • text) to proper HTML lists
    const bulletListRegex = /(\n|^)([-•]\s+.+(?:\n[-•]\s+.+)*)/g;
    formatted = formatted.replace(bulletListRegex, (match, prefix, listContent) => {
        const items = listContent.split('\n').map(item => {
            const cleaned = item.replace(/^[-•]\s+/, '');
            return cleaned ? `<li>${cleaned}</li>` : '';
        }).filter(item => item).join('');
        return items ? `${prefix}<ul>${items}</ul>` : match;
    });
    
    // Convert line breaks to <br> tags
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Clean up extra <br> tags around lists
    formatted = formatted.replace(/<br><ol>/g, '<ol>');
    formatted = formatted.replace(/<\/ol><br>/g, '</ol>');
    formatted = formatted.replace(/<br><ul>/g, '<ul>');
    formatted = formatted.replace(/<\/ul><br>/g, '</ul>');
    
    return formatted;
}; 

export const handleChat = async (req, res) => {
    try {
        const userQuestion = req.body.question;
        if (userQuestion) {
            // Handle user question
            console.log('💬 Processing user question...');
            
            try {
                // Search for relevant chunks
                const searchResults = await searchVectorStore(userQuestion, SEARCH_CONFIG.DEFAULT_TOP_K);
                
                if (!searchResults.documents || searchResults.documents.length === 0) {
                    // return res.status(404).json({ 
                    //     error: "No relevant information found. Please upload a PDF first." 
                    // });
                    return res.render('chat', { 
                        error: "No relevant information found. Please upload a PDF first.",
                        question: userQuestion,
                        context_used: [],
                    });
                }

                // Prepare context from search results
                const allContext = searchResults.documents.map((doc, index) => ({
                    text: doc,
                    similarity: 1 - searchResults.distances[index], // Convert distance to similarity
                    metadata: searchResults.metadatas[index]
                }));

                // Filter out low-relevance chunks
                const context = allContext.filter(item => item.similarity >= SEARCH_CONFIG.SIMILARITY_THRESHOLD);

                // Check if we have any relevant context after filtering
                if (context.length === 0) {
                    return res.render('chat', { 
                        error: "No relevant information found in the PDF for your question. Please try rephrasing or ask something related to the document content.",
                        question: userQuestion,
                        context_used: [],
                    });
                }

                // Generate response using LLM
                const contextText = context.map(item => item.text).join('\n\n');
                const response = await generateResponse(userQuestion, contextText);
                
                // Format the response for better display
                const formattedResponse = formatLLMResponse(response);

                res.render('chat', {
                    answer: formattedResponse,
                    question: userQuestion,
                    context_used: context.map(item => ({
                        text: item.text.substring(0, 150) + '...',
                        similarity: item.similarity.toFixed(3),
                        source: item.metadata?.source || 'unknown'
                    })),
                    total_chunks_used: context.length,
                    success: true
                });

            } catch (vectorError) {
                console.error('Vector search error:', vectorError);
                // res.status(500).json({ 
                //     error: "No documents found. Please upload a PDF first.",
                //     details: vectorError.message
                // });
                res.render('chat', { 
                    error: "No documents found. Please upload a PDF first.",
                    details: vectorError.message,
                    question: userQuestion 
                });
            }

        } else {
            // res.status(400).json({ error: "No question or PDF files provided." });
            res.render('chat', { 
                error: "No question or PDF files provided." 
            });
        }

    } catch (error) {
        console.error('Chat controller error:', error);
        // res.status(500).json({ 
        //     error: "Internal server error",
        //     details: error.message
        // });
        res.render('chat', { 
            error: "Internal server error",
            details: error.message 
        });
    }
};




export const getVectorStoreStatus = async (req, res) => {
    try {
        const info = await getVectorStoreInfo();
        // res.status(200).json(info);
        res.render('chat', { 
            vectorStoreInfo: info,
            success: true 
        });
    } catch (error) {
        console.error('Vector store info error:', error);
        // res.status(500).json({ 
        //     error: "Failed to get vector store information",
        //     details: error.message
        // });
        res.render('chat', { 
            error: "Failed to get vector store information",
            details: error.message 
        });
    }
};

export const searchDocuments = async (req, res) => {
    try {
        const { query, topK = SEARCH_CONFIG.DEFAULT_TOP_K } = req.body;
        if (!query) {
            // return res.status(400).json({ error: "Search query is required." });
            return res.render('chat', { 
                error: "Search query is required." 
            });
        }

        const searchResults = await searchVectorStore(query, topK);
        
        const allResults = searchResults.documents.map((doc, index) => ({
            text: doc,
            similarity: (1 - searchResults.distances[index]).toFixed(3),
            metadata: searchResults.metadatas[index]
        }));

        // Filter by similarity threshold
        const results = allResults.filter(item => parseFloat(item.similarity) >= SEARCH_CONFIG.SIMILARITY_THRESHOLD);

        if (results.length === 0) {
            return res.render('chat', {
                searchQuery: query,
                error: "No relevant documents found for your search query.",
                total_results: 0
            });
        }

        // res.status(200).json({
        //     query,
        //     results,
        //     total_results: results.length
        // });

        res.render('chat', {
            searchQuery: query,
            searchResults: results,
            total_results: results.length,
            success: true
        });

    } catch (error) {
        console.error('Search error:', error);
        // res.status(500).json({ 
        //     error: "Failed to search documents",
        //     details: error.message
        // });
        res.render('chat', { 
            error: "Failed to search documents",
            details: error.message 
        });
    }
};