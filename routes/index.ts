import express from 'express';
import path from "path";
import fileUpload from 'express-fileupload';
import glob from 'glob';
const router = express.Router();

let config: any = {};
const NOT_EXISTS_CODE = 404;

// /files/* is accessed via req.params[0]
// but here we name it :file
router.get('/files/:file(*)', (req, res, next) => {
  const filePath = path.join(config.workspaceDir, req.params.file);

  res.download(filePath, (err: any) => {
    if (!err) return; // file sent
    if (err.status !== NOT_EXISTS_CODE) return next(err); // non-404 error
    // file for download not found
    res.statusCode = NOT_EXISTS_CODE;
    res.send('Cant find that file, sorry!');
  });
});

router.get('/list', (req, res, next) => {
  const ext = req.query.filter ? req.query.filter : '.*';
  const pattern = `*${ext}`;
  glob(pattern, {cwd: config.workspaceDir, mark: true, dot: true}, (err: any, files: string[]) => {
    if (err) {
      res.statusCode = NOT_EXISTS_CODE;
      res.send(JSON.stringify({err: err.message}))
    }
    res.send(JSON.stringify(files))
  })
});

router.post('/upload', (req, res) => {
  let uploadFile: fileUpload.UploadedFile;
  let uploadPath: string;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  uploadFile = Array.isArray(req.files.file) ? req.files.file[0] : req.files.file;
  uploadPath = path.join(config.workspaceDir, uploadFile.name);

  // Use the mv() method to place the file somewhere on your server
  uploadFile.mv(uploadPath, (err: any) => {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
});

const createRouter = (options: any) => {
  config = options;
  return router
}

export default createRouter;
