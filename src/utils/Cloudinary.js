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

    fs.unlinkSync(localfilePath);

    return result.secure_url;
  } catch (error) {
    if (fs.existsSync(localfilePath)) fs.unlinkSync(localfilePath);
    console.error("Upload Error:", error);
    return null;
  }
};


export {
  uploadoncloudinary
};
