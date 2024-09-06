import multer from "multer";
import path from 'node:path';

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.resolve("src", "tmp"));
    },
    filename: function(req, file, cb){
        console.log(file);
        cb(null, 'file.txt');
    }
});

export const upload = multer({storage});
