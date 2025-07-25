# Pinecone Setup Instructions

## 1. Create a Pinecone Account
1. Go to [Pinecone](https://www.pinecone.io/)
2. Sign up for a free account
3. Verify your email address

## 2. Get Your API Key
1. Log into your Pinecone dashboard
2. Go to "API Keys" section
3. Create a new API key or copy the existing one
4. Copy the API key value

## 3. Update Environment Variables
1. Open the `.env` file in the Backend folder
2. Replace `your_pinecone_api_key_here` with your actual Pinecone API key:
   ```
   PINECONE_API_KEY=your_actual_api_key_here
   ```

## 4. Index Configuration
The application will automatically create a Pinecone index named `pdf-documents` with:
- **Dimension**: 768 (for all-mpnet-base-v2 embeddings)
- **Metric**: Cosine similarity
- **Cloud**: AWS (us-east-1 region)
- **Plan**: Serverless (free tier)

## 5. Benefits of Pinecone over ChromaDB
- **Scalability**: Better handling of large document collections
- **Performance**: Faster similarity search
- **Cloud-native**: No need to run local database server
- **Reliability**: Managed service with high availability
- **Cost-effective**: Free tier available

## 6. Usage
Once configured, the application will:
1. Create embeddings using the Xenova/all-mpnet-base-v2 model
2. Store document chunks in Pinecone with metadata
3. Perform semantic search using vector similarity
4. Maintain compatibility with existing chat interface

## Troubleshooting
- Make sure your API key is correct and has necessary permissions
- Ensure you're on a supported Pinecone plan (free tier works fine)
- Check network connectivity if index creation fails
