import path from "path";
import fs from "fs";
import multer from "multer";

const imagesDir = path.resolve(__dirname, "../../images");

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// const fileFilter = (
//   req: Express.Request,
//   file: Express.Multer.File,
//   cb: multer.FileFilterCallback
// ) => {
//   const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Solo se permiten archivos JPG, JPEG y PNG"));
//   }
// };

export const upload = multer({
  storage: storage,
  // fileFilter: fileFilter
});
