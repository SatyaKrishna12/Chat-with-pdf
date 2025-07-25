import { createRequire } from 'module';
import fs from 'fs';

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

export const getPdfText = async (pdfDocs) => {
    let allText = "";
    
    try {
        console.log(`📚 Starting to process ${pdfDocs.length} PDF document(s)...`);
        
        for (const pdfDoc of pdfDocs) {
            console.log(`📖 Reading PDF: ${pdfDoc.originalname}`);
            console.log(`📏 File size: ${(pdfDoc.size / 1024 / 1024).toFixed(2)} MB`);
            
            let pdfBuffer;
            
            // Handle different input types
            if (pdfDoc.buffer) {
                // If PDF is in memory (multer memoryStorage)
                pdfBuffer = pdfDoc.buffer;
            } else if (pdfDoc.path) {
                // If PDF is saved to disk (multer diskStorage)
                pdfBuffer = fs.readFileSync(pdfDoc.path);
            } else {
                throw new Error('Invalid PDF file format');
            }
            
            console.log('🔍 Parsing PDF content...');
            // Parse PDF - use default import
            const data = await pdf(pdfBuffer);
            
            console.log(`📊 PDF contains ${data.numpages} pages`);
            
            // Extract text with better formatting
            const text = data.text
                .replace(/\n\s*\n/g, '\n\n') // Clean up multiple newlines
                .replace(/\s+/g, ' ') // Replace multiple spaces with single space
                .trim();
            
            allText += text + '\n\n';
            
            console.log(`✅ Extracted ${text.length} characters from ${pdfDoc.originalname}`);
            console.log(`📄 Total pages processed: ${data.numpages}`);
        }
        
        console.log(`🎉 PDF processing complete! Total text length: ${allText.length} characters`);
        return allText.trim();
        
    } catch (error) {
        console.error('❌ Error reading PDF:', error);
        throw new Error(`Failed to read PDF: ${error.message}`);
    }
};

export const getPdfMetadata = async (pdfBuffer) => {
    try {
        const data = await pdf(pdfBuffer);
        return {
            pages: data.numpages,
            info: data.info,
            metadata: data.metadata,
            version: data.version
        };
    } catch (error) {
        console.error('Error getting PDF metadata:', error);
        return null;
    }
};

