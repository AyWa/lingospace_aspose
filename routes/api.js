const express     = require('express');
const router      = express.Router();
//Asposes
const StorageApi  = require("asposestoragecloud");
const WordsApi    = require("asposewordscloud");
// get the config of asposes:apikey etc
const config      = require('../config/asposes');
const data_path   = __dirname + '/../public_data/';
//multer is a middleware for handling multipart/form-data upload files
const multer      = require('multer');
const crypto      = require('crypto');
//kind of middleware for storage: can generate a random id or take an user id etc + add the filename
const storage = multer.diskStorage({
  destination: data_path,
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)
      cb(null, raw.toString('hex') + file.originalname)
    })
  }
});
const upload = multer({ storage: storage });
try{
  //Instantiate Aspose Storage API SDK
  var storageApi = new StorageApi(config);
  //Instantiate Aspose Words API SDK
  var wordsApi = new WordsApi(config);
} catch(e){
  console.log("exception in Instantiate");
  process.exit(-1);
}

//res "result": [\'text\', \'http://localhost:port/images/some-image.png\', \'other text\']
router.get('/document/:name',(req,res) =>{
  let name=req.params.name;
  wordsApi.GetDocumentTextItems(name, null, null, (responseMessage) => {
    if(responseMessage.code===200) res.json(responseMessage);
    else res.status(responseMessage.code).send(responseMessage.body.Message);
	});
});
//req:(name, storage, etc options)
//res {origin_file_url: \'http://uploaded-file-url.origin.ppt\', file_url: \'http://uploaded-file-url.ppt\'}
router.post('/upload',upload.single('userDoc'),(req,res)=>{
  storageApi.PutCreate(req.file.filename, null, null, file= data_path + req.file.filename , (responseMessage) =>  {
    if(responseMessage.code===200) res.json({success: true});
    else res.status(responseMessage.code).send(responseMessage.body.Message);
  });
});
//req:(file_url, sentences [{origin_sentence: \'some sentence\', replace_sentence: \'replaced sentence\'}])
//res {"meta": {"status": 200, "message": "Ok"}}
router.put('/replace-sentences',(req,res) => {
  //test is field existing
  if(req.body.file_url && req.body.sentences && req.body.sentences.origin_sentence && req.body.sentences.replace_sentence){
    let name=req.body.file_url;
    let replaceTextRequestBody = {
      'OldValue' : req.body.sentences.origin_sentence,
      'NewValue' : req.body.sentences.replace_sentence
    };
    wordsApi.PostReplaceText(name, null, null, null, replaceTextRequestBody, (responseMessage) =>  {
      if(responseMessage.code===200) res.status(responseMessage.code).send("Document has been updated successfully");
      else res.status(responseMessage.code).send(responseMessage.body.Message);
    });
  }
  else res.status(404).send("missing field");
});

module.exports = router;
