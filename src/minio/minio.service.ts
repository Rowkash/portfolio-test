import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

import { MINIO_CLIENT } from '@/minio/minio.provider';
import { IMinioConfig } from '@/configs/minio.config';

export interface IUploadImage {
  file: Express.Multer.File;
}

@Injectable()
export class MinioService {
  private readonly bucketName: string;

  constructor(
    @Inject(MINIO_CLIENT)
    private readonly minioClient: S3Client,
    private readonly configService: ConfigService<IMinioConfig, true>,
  ) {
    this.bucketName = this.configService.get<string>('minio.bucketName', {
      infer: true,
    });
  }

  async uploadFile(payload: IUploadImage) {
    const key = uuidv4();
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: payload.file.buffer,
      ContentType: payload.file.mimetype,
    });
    await this.minioClient.send(command);
    return key;
  }

  async deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    await this.minioClient.send(command);
  }
}
