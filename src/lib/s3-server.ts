import { S3 } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import { Readable } from "stream";

export async function downloadFromS3(file_key: string): Promise<string | null> {
  try {
    const s3 = new S3({
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
      },
      region: 'eu-north-1',
    });

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
    };

    const obj = await s3.getObject(params);

    // Ensure the directory exists
    const folderPath = './tmp';
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const file_name = path.join(folderPath, `pdf-${Date.now().toString()}.pdf`);

    if (obj.Body instanceof Readable) {
      const file = fs.createWriteStream(file_name);
      obj.Body.pipe(file);

      return new Promise((resolve, reject) => {
        file.on("finish", () => resolve(file_name));  // Fixed event name to 'finish'
        file.on("error", reject);  // Handle any errors during writing
      });
    } else {
      throw new Error("Failed to download file: obj.Body is not a Readable stream.");
    }
  } catch (error) {
    console.error("Error downloading from S3:", error);
    return null;
  }
}
