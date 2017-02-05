//will make some test here !
const request   = require('request');
const host      = "http://localhost:4200";
const assert    = require('assert');
const fs        = require('fs');


function testGet(){
  let path = '/api/document/9c6b5623708db2bb7a6adf00b6c095d7test1.pdf';
  request.get(host + path)
    .on('response',function(response){
      assert.equal(response.statusCode, 200);
      console.log("Get document success: TEST OK");
    })
  path='/api/document/randomnotexist';
  request.get(host + path)
    .on('response',function(response){
      assert.equal(response.statusCode, 404);
      console.log("Get no existing document fail: TEST OK");
    })
}
function testpost(){
  let path = '/api/replace-sentences';
  request.post(host + path)
    .json({file_url: "9c6b5623708db2bb7a6adf00b6c095d7test1.pdf", sentences:{origin_sentence:"Created in the cloud",replace_sentence:"ㅋㅋㅋㅋ"}})
    .on('response',(response)=>{
      assert.equal(response.statusCode, 200);
      console.log("POST Modify document success: TEST OK");
    })
  request.post(host + path)
    .json({file_url: "rand.doc", sentences:{origin_sentence:"hey",replace_sentence:"yo"}})
    .on('response',(response)=>{
      assert.equal(response.statusCode, 404);
      console.log("POST Modify no existing document fail: TEST OK");
    })
  request.post(host + path)
    .json({file_url: "rand.doc"})
    .on('response',(response)=>{
      assert.equal(response.statusCode, 404);
      console.log("POST Modify missing request: file_url or sentences etc : TEST OK");
    })
}
const formData = {
  // Pass data via Streams
  userDoc: fs.createReadStream(__dirname + '/TestAspose.docx'),
};
function testpostUpload(){
  let path = '/api/upload';
  request.post({url:host + path, formData: formData},(err, httpResponse, body) =>{
    assert.equal(httpResponse.statusCode, 200);
    console.log("POST upload docx TEST OK");
    const filename= JSON.parse(body).filename;
    path = '/api/document/';
    request.delete(host + '/api/document/' + filename)
      .on('response', (response) => {
        assert.equal(response.statusCode, 200);
        console.log("DELETE FILE TEST OK");
      })
   request.delete(host + path + 'original' + filename)
      .on('response', (response) => {
        assert.equal(response.statusCode, 200);
        console.log("DELETE ORIGINAL FILE TEST OK");
      })
  })
}
//just to wait the loading of the server
setTimeout( () => {
  const formData = {
	  "OldValue": "ㅋㅋㅋㅋㅋㅋㅋㅋ",
	  "NewValue": "Coucou",
	  "IsMatchCase": true,
	  "IsMatchWholeWord": true,
	  "IsOldValueRegex": true
  }
  const url='http://api.aspose.cloud/v1.1/words/b729b47c35e6120afc63392fff3d15c2TestAspose.docx/replaceText?appsid=3cfe4a6c-2116-4665-806c-c72ebba2a0f8&signature=2prQmK0jjqSGdYrFnG4Vq1EeG9s';
  request.post(url)
  .json(formData)
  .on('response',function(response,b){
    console.log(response.statusCode);
  }).on('data', function(data) {
    // decompressed data as it is received
    console.log('decoded chunk: ' + data)
  })
  //testGet();
  //testpostUpload();
  //testpost();
}, 5);
