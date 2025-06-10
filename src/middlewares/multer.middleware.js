import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/temp');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

export const upload = multer({
    storage,
})






// Multer is a middleware or library package for Node.js that simplifies the process of handling
//  file uploads and storing them on the server





// what happens bts->

// 1. When a user uploads a file (e.g., image), Multer saves it to the ./public/temp directory on your local server.
// 2. Takes the file saved by Multer (path: ./public/temp/...) and uploads it to Cloudinary.
// 3. After successful upload, Cloudinary returns a secure URL (public file link).
// 4. If something goes wrong, the code deletes the local file










