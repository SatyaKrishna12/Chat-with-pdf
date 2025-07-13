import { getPdfText, getPdfMetadata } from '../services/pdfService.js';
import getTextChunks  from '../services/textSplitter.js';
import { createVectorStore} from '../services/vectorStore.js';

export const uploadPdf = async (req, res) => {
    try {
        const pdfFile = req.file; // Single file upload
        
        if (!pdfFile) {
            // return res.status(400).json({ error: "No PDF file provided." });
            return res.render('index', { 
                error: "No PDF file provided." 
            });
        }

        console.log('📄 Processing PDF...');
        
        // Extract text from PDF
        const rawText = await getPdfText([pdfFile]);
        
        // Get PDF metadata
        const pdfMetadata = await getPdfMetadata(pdfFile.buffer);
        
        // Create text chunks
        const textChunks = await getTextChunks(rawText);
        
        // Create metadata for each chunk using PDF metadata
        const metadata = textChunks.map((chunk, index) => ({
            source: pdfFile.originalname,
            chunk_index: index,
            timestamp: new Date().toISOString(),
            file_type: 'pdf',
            // Add PDF-specific metadata
            pdf_pages: pdfMetadata?.pages || 'unknown',
            pdf_title: pdfMetadata?.info?.Title || pdfFile.originalname,
            pdf_author: pdfMetadata?.info?.Author || 'unknown',
            pdf_subject: pdfMetadata?.info?.Subject || 'unknown',
            pdf_creator: pdfMetadata?.info?.Creator || 'unknown',
            pdf_version: pdfMetadata?.version || 'unknown'
        }));

        // Create vector store with ChromaDB
        await createVectorStore(textChunks, metadata);
        
        // res.status(200).json({ 
        //     message: "PDF processed successfully.",
        //     chunks_created: textChunks.length,
        //     filename: pdfFile.originalname,
        //     pdf_info: {
        //         pages: pdfMetadata?.pages,
        //         title: pdfMetadata?.info?.Title,
        //         author: pdfMetadata?.info?.Author,
        //         subject: pdfMetadata?.info?.Subject
        //     }
        // });

        res.render('index', { 
            success: true,
            message: "PDF processed successfully.",
            chunks_created: textChunks.length,
            filename: pdfFile.originalname,
            pdf_info: {
                pages: pdfMetadata?.pages,
                title: pdfMetadata?.info?.Title,
                author: pdfMetadata?.info?.Author,
                subject: pdfMetadata?.info?.Subject
            }
        });

    } catch (error) {
        console.error('Error processing PDF:', error);
        // res.status(500).json({ error: 'Failed to process PDF' });
        res.render('index', { 
            error: 'Failed to process PDF',
            details: error.message 
        });
    }
};

// export const askQuestion = async (req, res) => {
//     try {
//         const userQuestion = req.body.question;
        
//         if (!userQuestion) {
//             return res.status(400).json({ error: 'Question is required' });
//         }

//         // Search for relevant chunks
//         const searchResults = await searchVectorStore(userQuestion, 3);
        
//         if (!searchResults.documents || searchResults.documents.length === 0) {
//             return res.status(404).json({ 
//                 error: 'No information found. Please upload a PDF first.' 
//             });
//         }

//         // Generate response
//         const contextText = searchResults.documents.join('\n\n');
//         const response = await generateResponse(userQuestion, contextText);

//         res.status(200).json({ 
//             answer: response
//         });

//     } catch (error) {
//         console.error('Error answering question:', error);
//         res.status(500).json({ error: 'Failed to get answer' });
//     }
// };