const express                                 = require('express');
const router                                  = express.Router();
const path                                    = require('path');
const data_path                               = __dirname + '/../public_data/';
//multer is a middleware for handling multipart/form-data upload files
const {upload}                                = require('../config/multer_config');
// get the config of asposes:apikey etc
const {wordsApi,slidesApi,pdfApi,storageApi}  = require('../config/asposes');
const fs                                      = require('fs');
const wordsRegex                              = /doc|docx/;
const slideRegex                              = /ppt|pptx/;
const pdfRegex                                = /pdf/;
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

router.delete('/document/:name',(req,res) => {
  let name=req.params.name;
  storageApi.DeleteFile(name, null, null,  (responseMessage) => {
    res.status(responseMessage.code).send(responseMessage);
  })
})
//download files
//original(append original): `http://localhost:4200/api/download/originald041b0836d7804a4b40cb137a5bdfddftest1.pptx`
//modified (normal name): `http://localhost:4200/api/download/d041b0836d7804a4b40cb137a5bdfddftest1.pptx`
router.get('/download/:name',(req,res) => {
  let name = req.params.name;
  //first we download the file from the api
  storageApi.GetDownload(name, null, null, (responseMessage) => {
    //then we save it
    //when we finished to copied we send to the user with res.download
    fs.writeFile(data_path + 'tmp' + name,responseMessage.body,()=>res.download(data_path + 'tmp' + name,null,(err)=>{
      if(err) console.log(err);
      //deleting files
      else fs.unlink(data_path + 'tmp' + name,(err)=>{
        if(err) console.log('err delete file in public_data');
      });
    }));
  })
})
//download append files original + modified in the same doc
//exemple localhost:4200/api/download/append/0252de03877bb27df92276a2787ee3abmarctest.docx
//don't put original before the file name
router.get('/download/append/:name', (req,res) => {
  const name = `original${req.params.name}`; //the file we will copy
  const tmpname= `append${req.params.name}`; //the name of the final file
  if(req.params.name.substring(0,8) === 'original') res.status(404).send('use without original in file name');
  if ( wordsRegex.test(path.extname(name)) || pdfRegex.test(path.extname(name))) {
    //we copy the original file
    storageApi.PutCopy(name, tmpname, null, null, null, null,(responseMessage) => {
      if(responseMessage.code===200){
        //we append to the copy the modified doc
        if(wordsRegex.test(path.extname(name)))
        {
          const documentEntryList =  {
            'DocumentEntries' : [{
              'Href' : `${req.params.name}`,
              'ImportFormatMode' : 'KeepSourceFormatting'
            }
          ]};
          wordsApi.PostAppendDocument(tmpname, null, null, null, documentEntryList, (responseMessage) => {
            if(responseMessage.code===200){
              //we download the append doc
              storageApi.GetDownload(tmpname, null, null, (responseMessage) => {
                //we send the doc then delete it from cloud + public data
                fs.writeFile(data_path + 'append' + name,responseMessage.body,()=>res.download(data_path + 'append' + name,null,(err)=>{
                  storageApi.DeleteFile(tmpname, null, null, (responseMessage) => {
                    if(responseMessage.code===200) console.log('deleted');
                    else console.log('error not deleted file '+tmpname);
                  })
                  if(err) console.log(err);
                  else fs.unlink(data_path + 'append' + name,(err)=>{
                    if(err) console.log('err delete file in public_data');
                  });
                }));
              })
            }else res.status(responseMessage.code).send(responseMessage);
          });
        } else {
          const appendDocumentBody = {
          		'Document' : `${req.params.name}`,
          		'StartPage' : null,
          		'EndPage' : null
          };
          pdfApi.PostAppendDocument(tmpname, null, null, null, null, null, appendDocumentBody, (responseMessage) => {
            if(responseMessage.code===200){
              //we download the append doc
              storageApi.GetDownload(tmpname, null, null, (responseMessage) => {
                //we send the doc then delete it from cloud + public data
                fs.writeFile(data_path + 'append' + name,responseMessage.body,()=>res.download(data_path + 'append' + name,null,(err)=>{
                  storageApi.DeleteFile(tmpname, null, null, (responseMessage) => {
                    if(responseMessage.code===200) console.log('deleted');
                    else console.log('error not deleted file '+tmpname);
                  })
                  if(err) console.log(err);
                  else fs.unlink(data_path + 'append' + name,(err)=>{
                    if(err) console.log('err delete file in public_data');
                  });
                }));
              })
            }else res.status(responseMessage.code).send(responseMessage);
          });
        }
      } else res.status(responseMessage.code).send(responseMessage);
    })
  } else res.status(404).send("not matching extension: only pdf or word doc");
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
           res.json({success: true,filename:req.file.filename});
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
    console.log(replaceTextRequestBody);
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
