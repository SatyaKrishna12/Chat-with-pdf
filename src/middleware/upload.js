import multer from 'multer';
import path from 'path';

// Use memory storage to keep files in memory as buffers
const storage = multer.memoryStorage();

// Initialize upload middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Error: Only PDF files are allowed!'));
    }
});

export default upload;