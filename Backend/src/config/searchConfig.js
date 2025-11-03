// Search and retrieval configuration

export const SEARCH_CONFIG = {
    SIMILARITY_THRESHOLD: 0.3,
    
    // Number of chunks to retrieve from vector store
    DEFAULT_TOP_K: 7,
    
    // Maximum number of chunks to send to LLM after filtering
    MAX_CONTEXT_CHUNKS: 5
};

// Similarity score guide:
// 0.7+ : Highly relevant (exact or near-exact match)
// 0.5-0.7 : Moderately relevant (similar topic)
// 0.3-0.5 : Somewhat relevant (related concepts)
// <0.3 : Likely not relevant
