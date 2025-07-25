import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Simple token estimation (rough approximation: 1 token ≈ 4 characters)
const estimateTokens = (text) => {
    return Math.ceil(text.length / 4);
};

// Truncate context to fit within token limits
const truncateContext = (context, question, maxContextTokens = 4000) => {
    const systemPromptTokens = 200; // Approximate tokens for system prompt
    const questionTokens = estimateTokens(question);
    const availableTokens = maxContextTokens - systemPromptTokens - questionTokens - 100; // Buffer
    
    if (estimateTokens(context) <= availableTokens) {
        return context;
    }
    
    // Truncate context to fit available tokens
    const maxChars = availableTokens * 4; // Convert back to characters
    return context.substring(0, maxChars) + "\n\n[Context truncated due to length...]";
};

export const generateResponse = async (question, context) => {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    
    if (!GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY not set in environment variables');
    }
    
    try {
        console.log('🤖 Generating response using Groq API...');
        
        // Truncate context if it's too long
        const truncatedContext = truncateContext(context, question);
        const contextTokens = estimateTokens(truncatedContext);
        const questionTokens = estimateTokens(question);
        
        console.log(`📊 Token usage - Context: ${contextTokens}, Question: ${questionTokens}`);
        
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'llama3-8b-8192', // Keeping original model with better token management
                messages: [
                    {
                        role: 'system',
                        content: `You are a helpful AI assistant made by Satya Krishna that answers questions based on the provided context from PDF documents. 
                        
                        Guidelines:
                        - Use the context to answer questions accurately and comprehensively
                        - If the context doesn't contain enough information to answer the question, say so clearly
                        - Be concise but thorough in your answers
                        - Always base your answers on the provided context
                        - If you're unsure about something, mention it
                        - Format your response clearly using:
                          * **Bold text** for important points or headings
                          * Numbered lists (1. 2. 3.) for steps or ordered information
                          * Bullet points (- or •) for unordered lists
                          * Clear paragraphs separated by line breaks
                        - Make your response easy to read and well-structured`
                    },
                    {
                        role: 'user',
                        content: `Context from PDF document:
                        
                        ${truncatedContext}
                        
                        Question: ${question}
                        
                        Please answer the question based on the context provided above.`
                    }
                ],
                max_tokens: 1000,
                temperature: 0.7,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0
            },
            {
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000 // 30 seconds timeout
            }
        );
        
        const generatedResponse = response.data.choices[0].message.content;
        console.log('✅ Response generated successfully');
        
        return generatedResponse;
        
    } catch (error) {
        console.error('❌ Error calling Groq API:', error.response?.data || error.message);
        
        if (error.response?.status === 401) {
            throw new Error('Invalid API key. Please check your GROQ_API_KEY.');
        } else if (error.response?.status === 429) {
            throw new Error('Rate limit exceeded. Please try again later.');
        } else if (error.response?.status === 413 || error.response?.data?.error?.code === 'rate_limit_exceeded') {
            throw new Error('Request too large. The document content is too long. Please try asking a more specific question.');
        } else if (error.code === 'ECONNABORTED') {
            throw new Error('Request timeout. Please try again.');
        } else {
            throw new Error(`Failed to generate response: ${error.message}`);
        }
    }
};

