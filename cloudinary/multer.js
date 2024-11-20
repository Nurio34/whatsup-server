// // const multer = require("multer");

// // // Set up Multer storage (you can configure this to specify file types, size, etc.)
// // const storage = multer.diskStorage({
// //     destination: (req, file, cb) => {
// //         cb(null, "uploads/"); // Destination folder for file uploads
// //     },
// //     filename: (req, file, cb) => {
// //         cb(null, `${Date.now()}-${file.originalname}`); // Custom filename to avoid conflicts
// //     },
// // });

// // // Set up Multer with storage configuration
// // const upload = multer({ storage });

// // module.exports = upload;

const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Ensure the "uploads" directory exists
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Creates the directory if it doesn't exist
}

// Set up Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Use the uploads directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Custom filename
    },
});

// Set up Multer with storage configuration
const upload = multer({ storage });

module.exports = upload;
