import { UploaderProps, UploaderProvider } from "@/common/domain/providers/upload-provider";
import { env } from "process";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

console.log("CLOUDFLARE_R2_URL:", env.CLOUDFLARE_R2_URL);
console.log("AWS_ACCESS_KEY_ID:", env.AWS_ACCESS_KEY_ID);
console.log("AWS_SECRET_ACCESS_KEY:", env.AWS_SECRET_ACCESS_KEY);
console.log("CLOUDFLARE_R2_BUCKET_NAME:", env.CLOUDFLARE_R2_BUCKET_NAME);

export class R2Uploader implements UploaderProvider {
  private readonly client: S3Client

  constructor(){
    this.client = new S3Client({
      endpoint: `${env.CLOUDFLARE_R2_URL}`,
      region: 'auto',
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY
      }
    })
  }

  async upload({ filename, filetype, body }: UploaderProps): Promise<string> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: filename,
        ContentType: filetype,
        Body: body,
      })
    )
    return filename
  }
}
