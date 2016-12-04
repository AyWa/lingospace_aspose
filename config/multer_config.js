const multer      = require('multer');
const crypto      = require('crypto');
const path        = require('path');
const data_path   = __dirname + '/../public_data/';
//  kind of middleware for storage.
//  I add a random name + the normal name
const storage = multer.diskStorage({
  destination: data_path,
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)
      //randome name + originalname(whithoutspace because aspose doesn't support space)
      cb(null, raw.toString('hex') + file.originalname.replace(/\s+/g,"_"))
    })
  }
});
//filter file
const fileFilter = function fileFilter(req, file, cb) {
  const filetypes = /doc|docx|ppt|pptx|pdf|application\/msword|application\/vnd\.ms-powerpoint|application\/pdf/;
  //checking mimetype
  const mimetype = filetypes.test(file.mimetype);
  //checking real extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  //if they are both same we can upload else send error message
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb("Error: File upload only supports the following filetypes - " + filetypes);
};
const upload = multer({ storage, fileFilter })
module.exports={upload};
