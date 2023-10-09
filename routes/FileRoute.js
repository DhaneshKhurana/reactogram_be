import multer from "multer";
import express from "express";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const moduleURL = import.meta.url;
const modulePath = fileURLToPath(moduleURL);
const baseDirectoryName = dirname(modulePath)

export const fRouter = express.Router();

const diskStorage = multer.diskStorage({
  destination: "./uploads/img/",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: diskStorage,
  limits: {
    fileSize: 1024 * 1024 * 1,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "img/jpg" ||
      file.mimetype == "img/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

fRouter.post("/upload/img", upload.single('file'), (req, res)=>{
    res.json({"fileName": req.file.filename, "baseDir":baseDirectoryName , "uploadFolder":"/uploads/img"});
})

const downloadFile = (req, res) => {
  const fileName = req.params.filename;
  //const filePath = "../uploads/img/" + fileName;
  const filePath = path.join(process.cwd(), "uploads", "img", fileName);
  console.log("FleRoute: trying to adownooad file::", filePath);

  res.download(filePath, (error) => {
      if (error) {
          res.status(500).send({ meassge: "File cannot be downloaded " + error })
      }
  })
}

fRouter.get("/download/:filename", downloadFile);

