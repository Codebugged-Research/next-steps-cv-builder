import multer from 'multer';
import path from 'path';
import { ApiError } from '../utils/ApiError';

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(path.resolve(),"uploads"));
    },
    filename:function(req,file,cb){
        const uniqueSuffix=Date.now()+"-"+Math.round(Math.random()*1E9);
        cb(null, req.user._id + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Allow only PDF, DOC, DOCX files
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new ApiError(400, "Only PDF, DOC, and DOCX files are allowed"));
    }
};

const upload = multer({ storage, fileFilter });

export { upload };