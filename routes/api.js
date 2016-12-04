const express                     = require('express');
const router                      = express.Router();
const path                        = require('path');
const data_path                   = __dirname + '/../public_data/';
//multer is a middleware for handling multipart/form-data upload files
const {upload}                    = require('../config/multer_config');
// get the config of asposes:apikey etc
const {wordsApi,slidesApi,pdfApi} = require('../config/asposes');
const fs                          = require('fs');
const wordsRegex                  = /doc|docx/;
const slideRegex                  = /ppt|pptx/;
const pdfRegex                    = /pdf/;
//exemple: `http://localhost:4200/api/document/d041b0836d7804a4b40cb137a5bdfddftest1.pptx`
//get all the text from the document
//we get the extention thanks to path.extname(name) and test it to the regex.
//then calling the right api
router.get('/document/:name',(req,res) => {
  let name=req.params.name;
  if ( wordsRegex.test(path.extname(name))) {
    wordsApi.GetDocumentTextItems(name, null, null, (responseMessage) => {
      if(responseMessage.code===200) res.json(responseMessage.body.TextItems);
      else res.status(responseMessage.code).send(responseMessage);
    });
  }else if (slideRegex.test(path.extname(name))) {
    slidesApi.GetSlidesPresentationTextItems(name, null, null, null, (responseMessage) => {
      if(responseMessage.code===200) res.json(responseMessage.body.TextItems);
      else res.status(responseMessage.code).send(responseMessage);
    });
  }else if (pdfRegex.test(path.extname(name))) {
    pdfApi.GetTextItems(name, null, null, null, (responseMessage) => {
      if(responseMessage.code===200) res.json(responseMessage.body.TextItems);
      else res.status(responseMessage.code).send(responseMessage);
    });
  }
  else res.status(404).send("not matching extension");
});
//download files
//original(append original): `http://localhost:4200/api/download/originald041b0836d7804a4b40cb137a5bdfddftest1.pptx`
//modified (normal name): `http://localhost:4200/api/download/d041b0836d7804a4b40cb137a5bdfddftest1.pptx`
router.get('/download/:name',(req,res) => {
  let name=req.params.name;
  //first we download the file from the api
  storageApi.GetDownload(name, null, null, (responseMessage) => {
    //then we save it
    //when we finished to copied we send to the user with res.download
    fs.writeFile(data_path + 'tmp' + name,responseMessage.body,()=>res.download(data_path + 'tmp' + name,null,(err)=>{
      if(err) console.log(err);
      //deleting files
      else fs.unlink(data_path + 'tmp' + name,(err)=>{
        console.log(err);
      });
    }));

  })
})
//we upload 2 times the file we get from the middleware multer.
//(one for original one for modified)
router.post('/upload',upload.single('userDoc'),(req,res) => {
  //PUT THE FILENAME IN THE BDD OF THE USERS
  console.log('maybe you should add these file name to the user BDD');
  console.log('the file name is ' + req.file.filename);
  console.log('the original file name is ' + 'original'+req.file.filename);
  storageApi.PutCreate(req.file.filename, null, null, file= data_path + req.file.filename , (responseMessage) => {
    if(responseMessage.code===200){
      storageApi.PutCreate('original'+req.file.filename, null, null, file= data_path + req.file.filename , (responseMessage) => {
         if(responseMessage.code===200){
           fs.unlink(data_path + req.file.filename,(err)=>{
             console.log(err);
           });
           res.json({success: true});
         }
         else res.status(responseMessage.code).send(responseMessage);
      })
    }
    else res.status(responseMessage.code).send(responseMessage);
  });
});
//`localhost:4200/api/replace-sentences`
//with body
//```json
//{
//	"sentences":{
//		"origin_sentence": "Hellow",
//		"replace_sentence": "Bonjour"
//	},
//	"file_url": "9c6b5623708db2bb7a6adf00b6c095d7test1.pdf"
//}
//```
router.post('/replace-sentences',(req,res) => {
  //test is field existing
  if(req.body.file_url && req.body.sentences && req.body.sentences.origin_sentence && req.body.sentences.replace_sentence) {
    let name=req.body.file_url;
    let replaceTextRequestBody = {
      'OldValue' : req.body.sentences.origin_sentence,
      'NewValue' : req.body.sentences.replace_sentence
    };
    if ( wordsRegex.test(path.extname(name))) {
      wordsApi.PostReplaceText(name, null, null, null, replaceTextRequestBody, (responseMessage) =>  {
        if(responseMessage.code===200) res.status(responseMessage.code).send("Document has been updated successfully");
        else res.status(responseMessage.code).send(responseMessage);
      });
    }else if (slideRegex.test(path.extname(name))) {
      slidesApi.PostSlidesPresentationReplaceText(name, replaceTextRequestBody.OldValue, replaceTextRequestBody.NewValue, true, null, null, (responseMessage) => {
        if(responseMessage.code===200) res.status(responseMessage.code).send("Document has been updated successfully");
        else res.status(responseMessage.code).send(responseMessage);
      });
    }else if (pdfRegex.test(path.extname(name))) {
      pdfApi.PostDocumentReplaceText(name, null, null, replaceTextRequestBody, (responseMessage) => {
        if(responseMessage.code===200) res.status(responseMessage.code).send("Document has been updated successfully");
        else res.status(responseMessage.code).send(responseMessage);
      });
    }else res.status(404).send("not matching extension");
  }
  else res.status(404).send("missing field");
});

module.exports = router;
