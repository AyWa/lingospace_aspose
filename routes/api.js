const express     = require('express');
const router      = express.Router();
const assert      = require('assert');
const fs          = require('fs');
//Asposes
const StorageApi  = require("asposestoragecloud");
const WordsApi    = require("asposewordscloud");
// get the config of asposes:apikey etc
const config      = require('../config/asposes');
const data_path   = __dirname + '/../public_data/';
//multer is a middleware for handling multipart/form-data upload files
const multer      = require('multer');
const crypto      = require('crypto');
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
  console.log(e);
  process.exit(-1);
}

router.get('/document/:name',function(req,res){
  //res "result": [\'text\', \'http://localhost:port/images/some-image.png\', \'other text\']
  let name=req.params.name;
  wordsApi.GetDocumentTextItems(name, null, null, function(responseMessage) {
  	assert.equal(responseMessage.status, 'OK');
    res.json(responseMessage);
	});
});
router.post('/upload',upload.single('userDoc'),function(req,res){
  //req:(name, storage, etc options)
  //res {origin_file_url: \'http://uploaded-file-url.origin.ppt\', file_url: \'http://uploaded-file-url.ppt\'}
  storageApi.PutCreate(req.file.filename, null, null, file= data_path + req.file.filename , function(responseMessage) {
    assert.equal(responseMessage.status, 'OK');
    res.json({success: true});
  });
});
router.put('/replace-sentences',function(req,res){
  //req:(file_url, sentences [{origin_sentence: \'some sentence\', replace_sentence: \'replaced sentence\'}])
  //res {"meta": {"status": 200, "message": "Ok"}}
  let name=req.body.file_url;
  let replaceTextRequestBody = {
	  'OldValue' : req.body.sentences.origin_sentence,
	  'NewValue' : req.body.sentences.replace_sentence
	};
  wordsApi.PostReplaceText(name, null, null, null, replaceTextRequestBody, function(responseMessage) {
    assert.equal(responseMessage.status, 'OK');
    console.log("Document has been updated successfully");
    res.json({success: true});
  });
});

module.exports = router;
/*
[ { Text: 'Created in the cloud with Aspose.Words for Cloud. http://www.aspose.com/cloud/word-api.aspx',
    link: null },
  { Text: 'eg. method | end-point | form | response', link: null },
  { Text: 'PUT | /api/upload | (name, storage, etc options) | {"meta": {"status": 200, "message": "Ok"}, "result": {origin_file_url: \'http://uploaded-file-url.origin.ppt\', file_url: \'http://uploaded-file-url.ppt\'}}',
    link: null },
  { Text: 'GET | /api/document | (file_url) | {"meta": {"status": 200, "message": "Ok"}, "result": [\'text\', \'http://localhost:port/images/some-image.png\', \'other text\']}',
    link: null },
  { Text: 'PUT | /api/replace-sentences | (file_url, sentences [{origin_sentence: \'some sentence\', replace_sentence: \'replaced sentence\'}]) | {"meta": {"status": 200, "message": "Ok"}}',
    link: null } ]
*/
