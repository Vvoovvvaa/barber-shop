import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PhotoValidationPipe implements PipeTransform {
  transform(files: Express.Multer.File) {
    if (!files) {
      throw new BadRequestException('No files uploaded');
    }

    const MAX_SIZE = 10 * 1024 * 1024;
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
    const arr = Array.isArray(files) ? files : [files];

    for (const file of arr) {
      if (file.size > MAX_SIZE) {
        throw new BadRequestException(
          `File ${file.originalname} exceeds allowed size 5MB`
        );
      }

      if (!ALLOWED_TYPES.includes(file.mimetype)) {
        throw new BadRequestException(
          `File ${file.originalname} has an invalid format`
        );
      }
    }

    return files;
  }
}