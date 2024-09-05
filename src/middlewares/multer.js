import multer from "multer";
import path from 'node:path';
// import { TEMP_UPLOAD_DIR } from '../constants/index.js';

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.resolve("src", "tmp"));
    },
    filename: function(req, file, cb){
        console.log(file);
        cb(null, 'file.txt');
    }
});
  export const upload = multer({ storage });

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, TEMP_UPLOAD_DIR);
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now();
//       cb(null, `${uniqueSuffix}_${file.originalname}`);
//     },
//   });
  
//   export const upload = multer({ storage });