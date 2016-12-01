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
function testput(){
  let path = '/api/replace-sentences';
  request.put(host + path)
    .json({file_url: "Sample.doc", sentences:{origin_sentence:"hey",replace_sentence:"yo"}})
    .on('response',(response)=>{
      assert.equal(response.statusCode, 200);
      console.log("Put Modify document success: TEST OK");
    })
  request.put(host + path)
    .json({file_url: "rand.doc", sentences:{origin_sentence:"hey",replace_sentence:"yo"}})
    .on('response',(response)=>{
      assert.equal(response.statusCode, 404);
      console.log("Put Modify no existing document fail: TEST OK");
    })
  request.put(host + path)
    .json({file_url: "rand.doc"})
    .on('response',(response)=>{
      assert.equal(response.statusCode, 404);
      console.log("Put Modify missing request: file_url or sentences etc : TEST OK");
    })
}

function testpost(){
  console.log('test post todo later');
}

//just to wait the loading of the server
setTimeout(()=>{
  testGet();
  testput();
  testpost();
}, 5000);
