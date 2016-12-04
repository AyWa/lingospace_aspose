//will make some test here !
const request = require('request');
const host  = "http://localhost:4200";
const assert = require('assert');

function testGet(){
  let path = '/api/document/Sample.doc';
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
    .json({file_url: "Sample.doc", sentences:{origin_sentence:"Created in the cloud",replace_sentence:"yoyo l'asticot"}})
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

function testpostUpload(){
  console.log('test postUpload todo later');
}

//just to wait the loading of the server
setTimeout(()=>{
  testGet();
  testpostUpload();
  testpost();
}, 5000);
