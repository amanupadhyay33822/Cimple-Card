import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from "cloudinary";

export const uploadImageToCloudinary = async (
    file: { tempFilePath: string },
    folder: string,
    height?: number,
    quality?: string | number
): Promise<UploadApiResponse> => {
    const options: UploadApiOptions = {
        folder,
        resource_type: "auto",
    };

    if (height) {
        options.height = height;
    }
    
    if (quality) {
        options.quality = quality;
    }

    return await cloudinary.uploader.upload(file.tempFilePath, options);
};
