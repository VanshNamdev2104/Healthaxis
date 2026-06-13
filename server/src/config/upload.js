import multer from "multer";

// Use memory storage so files are available as buffers for ImageKit upload
const storage = multer.memoryStorage();

// File filter to allow only image files
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/svg+xml",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image files (JPEG, PNG, WebP, GIF, SVG) are allowed"), false);
    }
};

// File filter to allow images and PDF files (for medical reports / prescriptions)
const documentFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf"
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only images (JPEG, PNG, WebP) and PDF files are allowed"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
    },
});

export const uploadDocument = multer({
    storage,
    fileFilter: documentFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max file size for PDFs/reports
    }
});

export default upload;
