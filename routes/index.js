var express     = require('express');
var router      = express.Router();
var config      = require('./config/asposes'); // get the config of asposes:apikey etc

router.get('/document/:name',function(req,res){
  //res "result": [\'text\', \'http://localhost:port/images/some-image.png\', \'other text\']
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
