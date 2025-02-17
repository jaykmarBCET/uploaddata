import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_NAME,
  secure: process.env.CLOUDINARY_SECURE === "true",
});

const deleter = async (publicId: string): Promise<boolean> => {
  try {
    const response = await cloudinary.uploader.destroy(publicId);
    return response.result === "ok"; 
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Image deletion failed");
  }
};

export { deleter };
