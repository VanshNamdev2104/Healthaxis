import ImageKit from "imagekit";
import env from "../config/dotenv.js";

const imagekit = new ImageKit({
    publicKey: env.IMAGEKIT_PUBLIC_KEY,
    privateKey: env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: env.IMAGEKIT_URL_ENDPOINT,
});

/**
 * Upload a file buffer to ImageKit.
 * @param {Buffer} fileBuffer - The file buffer from multer
 * @param {string} fileName - Original filename
 * @param {string} folder - ImageKit folder path (e.g., "/avatars", "/diseases")
 * @returns {Promise<{url: string, fileId: string, thumbnailUrl: string}>}
 */
export const uploadToImageKit = async (fileBuffer, fileName, folder = "/uploads") => {
    try {
        const result = await imagekit.upload({
            file: fileBuffer,
            fileName: fileName,
            folder: folder,
        });
        return {
            url: result.url,
            fileId: result.fileId,
            thumbnailUrl: result.thumbnailUrl,
        };
    } catch (error) {
        console.error("ImageKit upload error:", error.message);
        throw new Error("File upload failed.");
    }
};

/**
 * Upload multiple file buffers to ImageKit.
 * @param {Array<{buffer: Buffer, originalname: string}>} files - Multer file array
 * @param {string} folder - ImageKit folder path
 * @returns {Promise<Array<{url: string, fileId: string, thumbnailUrl: string}>>}
 */
export const uploadMultipleToImageKit = async (files, folder = "/uploads") => {
    const uploadPromises = files.map((file) =>
        uploadToImageKit(file.buffer, `${Date.now()}_${file.originalname}`, folder)
    );
    return Promise.all(uploadPromises);
};

/**
 * Delete a file from ImageKit by its fileId.
 * @param {string} fileId - ImageKit file ID
 */
export const deleteFromImageKit = async (fileId) => {
    try {
        await imagekit.deleteFile(fileId);
    } catch (error) {
        console.error("ImageKit delete error:", error.message);
    }
};

/**
 * Delete multiple files from ImageKit by their fileIds.
 * @param {Array<string>} fileIds - Array of ImageKit file IDs
 */
export const deleteMultipleFromImageKit = async (fileIds) => {
    const deletePromises = fileIds
        .filter((id) => id) // skip empty/null fileIds
        .map((fileId) => deleteFromImageKit(fileId));
    return Promise.all(deletePromises);
};

export default imagekit;