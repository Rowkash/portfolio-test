import * as path from 'path';
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class FilesService {
  async saveFile(file: Express.Multer.File) {
    try {
      const extension = path.extname(file.originalname).toLowerCase();
      const fileName = uuidv4() + extension;
      const filePath = path.resolve('static');
      await fs.mkdir(filePath, { recursive: true });
      await fs.writeFile(path.join(filePath, fileName), file.buffer);

      return fileName;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while saving file',
      );
    }
  }

  async deleteFile(fileName: string) {
    try {
      const filePath = path.resolve('static');
      await fs.unlink(path.join(filePath, fileName));
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while deleting file',
      );
    }
  }
}
