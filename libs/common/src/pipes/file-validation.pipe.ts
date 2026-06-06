import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import sharp from 'sharp';
import { CustomErrorsMessagesType } from '../filters/types/custom-errors-messages.types';
import { FileConstraintsDto } from './file-constraints/file-constraints.dto';
import { FileUploadDto } from '../../../../apps/backend/src/features/blogger-blogs/dto/file-upload.dto';
import { ErrorMessages } from '../filters/custom-errors-messages';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private readonly constraintsKey: FileConstraintsDto) {}

  async transform(
    value: any,
    _metadata: ArgumentMetadata,
  ): Promise<FileUploadDto> {
    const constraints: FileConstraintsDto = this.constraintsKey;

    if (!constraints) {
      throw new HttpException(
        { message: 'Constraints not found for the specified key' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const errorMessage: CustomErrorsMessagesType[] = [];

    await Promise.all([
      this.checkFileNotProvided(value),
      this.checkFileSize(value, constraints, errorMessage),
      this.checkFileExtension(value, constraints, errorMessage),
      this.checkImageDimensions(value, constraints, errorMessage),
    ]);

    if (errorMessage.length > 0) {
      throw new HttpException(
        { message: errorMessage },
        HttpStatus.BAD_REQUEST,
      );
    }

    return value;
  }

  private async checkFileNotProvided(value: any): Promise<void> {
    if (!value) {
      throw new HttpException(
        { message: ErrorMessages.file.notProvided },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async checkFileSize(
    value: any,
    constraints: any,
    errorMessage: CustomErrorsMessagesType[],
  ): Promise<void> {
    if (value.size > constraints.maxSize) {
      errorMessage.push(ErrorMessages.file.sizeLimit);
    }
  }

  private async checkFileExtension(
    value: any,
    constraints: any,
    errorMessage: CustomErrorsMessagesType[],
  ): Promise<void> {
    const fileExtension = this.getFileExtension(value.mimetype);
    if (!constraints.allowedExtensions.includes(fileExtension)) {
      errorMessage.push(ErrorMessages.file.invalidFileExtension);
    }
  }

  private getFileExtension(mimetype: string): string {
    const parts = mimetype.split('/');
    return parts.length === 2 ? '.' + parts[1] : '';
  }

  private async checkImageDimensions(
    value: any,
    constraints: FileConstraintsDto,
    errorMessage: CustomErrorsMessagesType[],
  ): Promise<void> {
    try {
      const metadata = await sharp(value.buffer).metadata();
      if (
        !metadata.width ||
        metadata.width !== constraints.width ||
        !metadata.height ||
        metadata.height !== constraints.height
      ) {
        errorMessage.push({
          message: `Invalid dimensions: width should be within ${constraints.width} and height within ${constraints.height}.`,
          file: 'file.dimensions',
        });
      }
    } catch {
      throw new HttpException(
        { message: 'Error reading image metadata' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
