const assert  = require('assert');
const request = require('request');
const fs      = require('fs');
const host    = "http://localhost:4200";


// test cases WordsAPI
describe('LingoSpace Aspose API', function(){
  describe('Words API', function(){
    let UploadDocName;
    before(function(done) {
      //test upload file
      const formData = {
        userDoc: fs.createReadStream(__dirname + '/TestDOC.docx')
      };
      const path = '/api/upload';
      request.post({url:host + path, formData: formData},(err, httpResponse, body) =>{
        assert.equal(httpResponse.statusCode, 200);
        UploadDocName = JSON.parse(body).filename;
        done();
      })
    });
    after(function(done) {
      //test delete
      const path = '/api/document/';
      request.delete(host + path + UploadDocName)
        .on('response', (response) => {
          assert.equal(response.statusCode, 200);
        })
      request.delete(host + path + 'original' + UploadDocName)
          .on('response', (response) => {
            assert.equal(response.statusCode, 200);
            done();
          })
    });
    it('Download file', function(){
      console.log(UploadDocName);
      assert.ok(true);
    })
    it('Get text', function(){
      console.log(UploadDocName);
      assert.ok(true);
    })
    it('edit text', function(){
      console.log(UploadDocName);
      assert.ok(true);
    })
    it('Append file', function(){
      console.log(UploadDocName);
      assert.ok(true);
    })
  })
  describe('PDF API', function(){
    before(function() {
      // runs before all tests in this block
      //test upload
    });
    after(function() {
      // runs after all tests in this block
      //test delete
    });
    it('birds should fly', function(){ assert.ok(true);})
  })
  describe('SLIDES API', function(){
    before(function() {
      // runs before all tests in this block
      //test upload
    });
    after(function() {
      // runs after all tests in this block
      //test delete
    });
    it('birds should fly', function(){ assert.ok(true);})
  })
})
