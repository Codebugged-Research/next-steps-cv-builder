import AWS from 'aws-sdk';
import multe from 'multer';
import multerS3 from 'multer-s3';
import { v4 as uuidv4 } from 'uuid';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const uploadPhoto = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME,
        key: function (req, file, cb) {
            const fileName = `photos/${uuidv4()}-${file.originalname}`;
            cb(null, fileName);
        },
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, {
                fieldName: file.fieldname,
                userId: req.user._id.toString(),
                uploadDate: new Date().toISOString()
            });
        }
    }),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

export { uploadPhoto, s3 };



