import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Set up Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async(localFilePath) => {
    try {
        const response = await cloudinary.uploader.upload(
            localFilePath,
            {
                resource_type:"auto"
            }
        );
        console.log("file uploaded on cloudinry. File src : " , response.url);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.log(error)
        return null;
    }
};

const deleteFromCloudinary = async(localFilePath) => {
    try {
        const publicId = path.basename(localFilePath, path.extname(localFilePath));
        await cloudinary.uploader.destroy(publicId);
        console.log("file deleted from cloudinry. Public id : " , publicId);
    } catch (error) {
        console.log(error);
    }
}


export default uploadOnCloudinary;
export {deleteFromCloudinary};
