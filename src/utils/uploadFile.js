import cloudinary from 'cloudinary';
import { config } from 'dotenv';
config({ path: 'config.env' });

const Cloudinary = cloudinary.v2;

Cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});

export const fileUpload = async (buffer, folderName) => {
  return await new Promise((resolve, reject) => {
    return Cloudinary.uploader
      .upload_stream({ folder: `/YouTube-Clone/${folderName}` }, (err, res) => {
        if (err) {
          reject(err.message);
        }
        resolve(res.secure_url);
      })
      .end(buffer);
  });
};
