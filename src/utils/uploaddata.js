import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_NAME,
  secure: process.env.CLOUDINARY_SECURE === "true",
});

const uploader = async (StreamData) => {
  try {
    const response = await cloudinary.uploader.upload(StreamData, {
      resource_type: "auto",
    });

    return { publicId: response.public_id, url: response.secure_url };
  } catch (error) {
    console.error("Error while uploading image:", error);
    throw new Error("Image upload failed");
  }
};
export { uploader };
