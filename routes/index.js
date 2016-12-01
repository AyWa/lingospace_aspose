var express     = require('express');
var router      = express.Router();
var assert      = require('assert');
var fs          = require('fs');
//Asposes
var StorageApi  = require("asposestoragecloud");
var WordsApi    = require("asposewordscloud");
// get the config of asposes:apikey etc
var config      = require('../config/asposes');
var data_path   = '../public_data/';

try{
  //Instantiate Aspose Storage API SDK
  var storageApi = new StorageApi(config);
  //Instantiate Aspose Words API SDK
  var wordsApi = new WordsApi(config);
}catch(e){
  console.log("exception in Instantiate");
  console.log(e);
  process.exit(-1);
}

router.get('/document/:name',function(req,res){
  //res "result": [\'text\', \'http://localhost:port/images/some-image.png\', \'other text\']
  var name=req.params.name;
  wordsApi.GetDocumentTextItems(name, null, null, function(responseMessage) {
  	assert.equal(responseMessage.status, 'OK');
    res.json(responseMessage);
	});
});
router.put('/upload',function(req,res){
  //req:(name, storage, etc options)
  //res {origin_file_url: \'http://uploaded-file-url.origin.ppt\', file_url: \'http://uploaded-file-url.ppt\'}
});
router.post('/upload',function(req,res){
  //req:(name, storage, etc options)
  //res {origin_file_url: \'http://uploaded-file-url.origin.ppt\', file_url: \'http://uploaded-file-url.ppt\'}
});
router.put('/replace-sentences',function(req,res){
  //req:(file_url, sentences [{origin_sentence: \'some sentence\', replace_sentence: \'replaced sentence\'}])
  //res {"meta": {"status": 200, "message": "Ok"}}
  var name=req.body.file_url;
  var replaceTextRequestBody = {
		'OldValue' : req.body.sentences.origin_sentence,
		'NewValue' : req.body.sentences.replace_sentence
		};
  wordsApi.PostReplaceText(name, null, null, null, replaceTextRequestBody, function(responseMessage) {
    assert.equal(responseMessage.status, 'OK');
    console.log("Document has been updated successfully");
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
