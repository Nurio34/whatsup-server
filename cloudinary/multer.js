const multer = require("multer");

// Set up Multer storage (you can configure this to specify file types, size, etc.)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Destination folder for file uploads
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Custom filename to avoid conflicts
    },
});

// Set up Multer with storage configuration
const upload = multer({ storage });

module.exports = upload;
