import { v2 as cloudinary } from 'cloudinary'; 
import fs from 'fs';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '<your_cloud_name>', 
  api_key: process.env.CLOUDINARY_API_KEY || '<your_api_key>', 
  api_secret: process.env.CLOUDINARY_API_SECRET || '<your_api_secret>',
});

const uploadoncloudinary = async (localfilePath) => {
  try {
    if (!localfilePath) {
      throw new Error('No file path exists');
    }

    const result = await cloudinary.uploader.upload(localfilePath, {
      resource_type: 'auto',
    });

    return result.url;
  } catch (error) {
    fs.unlinkSync(localfilePath);
    return null;
  }
};

const extractPublicIdFromUrl = async (url) => {
  try {
    const parts = url.split('/');
    const index = parts.findIndex(part => part === 'upload');
    const publicIdWithExtension = parts.slice(index + 1).join('/');
    const lastDot = publicIdWithExtension.lastIndexOf('.');
    const publicId = publicIdWithExtension.substring(0, lastDot);

    return publicId;
  } catch (err) {
    console.error("Failed to extract public_id from URL:", err);
    return null;
  }
};

const deleteFromCloudinary = async (publicId, resource_type = 'auto') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resource_type,
    });

    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return null;
  }
};


export {
  uploadoncloudinary,
  extractPublicIdFromUrl,
  deleteFromCloudinary
};
