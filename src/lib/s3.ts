import * as AWS from "aws-sdk";

export async function uploadToS3(file: File) {
    try {
        // Update AWS config
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID || "",
            secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY || "",
            region: "eu-north-1",
        });

        // Initialize S3 object
        const s3 = new AWS.S3();

        // Generate file key
        const file_key = "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

        // Prepare parameters for upload
        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME || "",
            Key: file_key,
            Body: file,
        };

        // Upload the file
        const upload = s3
            .putObject(params)
            .on("httpUploadProgress", (evt) => {
                console.log("Uploading to S3...", parseInt(((evt.loaded * 100) / evt.total).toString()));
            })
            .promise();

        // Wait for the upload to finish
        await upload.then(() => {
            console.log("Successfully uploaded!", file_key);
        });

        // Return the file key and file name
        return Promise.resolve({ file_key, file_name: file.name });
    } catch (error) {
        console.error("Error uploading file to S3:", error);
        return Promise.reject(error);
    }
}

// Generate a public S3 URL for accessing the uploaded file
export function getS3Url(file_key: string) {
    const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${file_key}`;
    return url;
}
