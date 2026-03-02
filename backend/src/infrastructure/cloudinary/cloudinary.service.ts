import { Inject, Injectable } from '@nestjs/common';
import { CLOUDINARY } from './cloudinary.provider';

@Injectable()
export class CloudinaryService {
  constructor(@Inject(CLOUDINARY) private cloudinary: any) {}

  async saveImage(
    files: Express.Multer.File[],
    folder: string,
  ): Promise<string[]> {
    const upload = files.map((file) => {
      return new Promise<string>((resovle, reject) => {
        const stream = this.cloudinary.uploader.upload_stream(
          { folder: folder },
          (error, result) => {
            if (error) return reject(error);
            return resovle(result.url);
          },
        );
        stream.end(file.buffer);
      });
    });

    return await Promise.all(upload);
  }
}
