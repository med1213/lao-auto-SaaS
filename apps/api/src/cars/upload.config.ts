import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

export const UPLOADS_DIR = join(process.cwd(), 'uploads', 'cars');

export const carImageStorage = diskStorage({
  destination: UPLOADS_DIR,
  filename: (_req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    cb(null, `${randomUUID()}${ext}`);
  }
});

export const imageFileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void
) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const ext = extname(file.originalname).toLowerCase();
  if (!allowed.includes(ext)) {
    return cb(new BadRequestException(`Only image files are allowed: ${allowed.join(', ')}`), false);
  }
  cb(null, true);
};
