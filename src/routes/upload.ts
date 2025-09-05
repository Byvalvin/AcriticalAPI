import express, { Request, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Multer config: 2MB limit, accept all images
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// POST /upload-avatar
router.post('/upload-avatar', upload.single('avatar'), (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File;

  if (!file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'avatars',
      resource_type: 'image',
      transformation: [
        { width: 300, height: 300, crop: 'limit' },
        { quality: 'auto' },
      ],
    },
    (error: any, result: any) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: error.message || 'Upload failed' });
      }

      return res.status(200).json({ url: result?.secure_url });
    }
  );

  file.stream.pipe(uploadStream);
});

export default router;
