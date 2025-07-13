import express from 'express';
const router = express.Router();
import {uploadPdf} from '../controllers/pdfController.js';
import upload from '../middleware/upload.js';

// Route for uploading PDF files
router.post('/upload', upload.single('pdf'), uploadPdf);

// Route for processing the uploaded PDF
// router.post('/process', pdfController.processPdf);

export default router;