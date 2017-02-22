const assert  = require('assert');
const request = require('request');
const fs      = require('fs');
const host    = "http://localhost:4200";
const {doc_text, doc_text_modify} = require('./test_text')

// test cases WordsAPI
//the upload test and delete test are done in before after
describe('LingoSpace Aspose API', function(){
  describe('Words API', function(){
    let UploadDocName;
    before(function(done) {
      //test upload file
      this.timeout(15000);
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
    after(function() {
      //test delete
      this.timeout(15000);
      const path = '/api/document/';
      request.delete(host + path + UploadDocName)
        .on('response', (response) => {
          assert.equal(response.statusCode, 200);
        })
      request.delete(host + path + 'original' + UploadDocName)
          .on('response', (response) => {
            assert.equal(response.statusCode, 200);
          })
    });
    it('Get text', function(done){
      this.timeout(10000);
      const path = `${host}/api/document/${UploadDocName}`;
      request.get(path,(err, httpResponse, body) =>{
        let answ = JSON.parse(body);
        while(answ.List[0].Text=== "Created in the cloud with Aspose.Words for Cloud. http://www.aspose.com/products/words/cloud") answ.List.splice(0, 1);
        assert.deepStrictEqual(JSON.stringify(answ.List), JSON.stringify(doc_text), 'text send is not same with the testDoc');
        assert.equal(httpResponse.statusCode, 200);
        done();
      })
    })
    it('replace-sentences test', function(done){
      this.timeout(10000);
      const path = `${host}/api/replace-sentences`;
      const path2 = `${host}/api/document/${UploadDocName}`;
      const formData = {
        "sentences":{
          "origin_sentence": "고마워요, 잘자요",
          "replace_sentence": "merci beaucoup, bonne nuit"
        },
        "file_url": UploadDocName
      };
      request.post({url:path, body: formData, json: true},(err, httpResponse, body) => {
        assert.equal(httpResponse.statusCode, 200);
        const path = `${host}/api/document/${UploadDocName}`;
        request.get(path2,(err, httpResponse, body) =>{
          let answ = JSON.parse(body);
          while(answ.List[0].Text=== "Created in the cloud with Aspose.Words for Cloud. http://www.aspose.com/products/words/cloud") answ.List.splice(0, 1);
          assert.deepStrictEqual(JSON.stringify(answ.List), JSON.stringify(doc_text_modify), 'text send is not same with the testDoc');
          assert.equal(httpResponse.statusCode, 200);
          done();
        })
      })
    })
    it('download test', function(done){
      this.timeout(20000);
      const path = `${host}/api/download/original${UploadDocName}`;
      request.get(path,(err, httpResponse, body) =>{
        let testDOC = fs.readFileSync(__dirname + '/TestDOC.docx');
        assert.equal(testDOC.toString(), body.toString(),'doc are not same !');
        assert.equal(httpResponse.statusCode, 200);
        done();
      })
    })
    it('download append test', function(done){
      this.timeout(20000);
      const path = `${host}/api/download/append/${UploadDocName}`;
      request.get(path,(err, httpResponse, body) =>{
        //let testDOC = fs.readFileSync(__dirname + '/AppendDOC.docx');
        console.log('to do better test');
        //assert.equal(testDOC.toString(), body.toString(),'doc are not same !');
        assert.equal(httpResponse.statusCode, 200);
        done();
      })
    })
  })
  describe('PDF API', function(){
    let UploadDocName;
    before(function(done) {
      //test upload file
      this.timeout(15000);
      const formData = {
        userDoc: fs.createReadStream(__dirname + '/TestPDF.pdf')
      };
      const path = '/api/upload';
      request.post({url:host + path, formData: formData},(err, httpResponse, body) =>{
        assert.equal(httpResponse.statusCode, 200);
        UploadDocName = JSON.parse(body).filename;
        done();
      })
    });
    after(function() {
      //test delete
      this.timeout(15000);
      const path = '/api/document/';
      request.delete(host + path + UploadDocName)
        .on('response', (response) => {
          assert.equal(response.statusCode, 200);
        })
      request.delete(host + path + 'original' + UploadDocName)
          .on('response', (response) => {
            assert.equal(response.statusCode, 200);
          })
    });
    it('Get text', function(done){
      this.timeout(10000);
      const path = `${host}/api/document/${UploadDocName}`;
      request.get(path,(err, httpResponse, body) =>{
        assert.equal(httpResponse.statusCode, 200);
        done();
      })
    })
    it('replace-sentences test', function(done){
      this.timeout(10000);
      const path = `${host}/api/replace-sentences`;
      const formData = {
        "sentences":{
          "origin_sentence": "고마워요, 잘자요",
          "replace_sentence": "merci beaucoup, bonne nuit"
        },
        "file_url": UploadDocName
      };
      request.post({url:path, body: formData, json: true},(err, httpResponse, body) => {
        assert.equal(httpResponse.statusCode, 200);
        done();
      })
    })
    it('download test', function(done){
      this.timeout(20000);
      const path = `${host}/api/download/original${UploadDocName}`;
      request.get(path,(err, httpResponse, body) =>{
        let testPDF = fs.readFileSync(__dirname + '/TestPDF.pdf');
        assert.equal(testPDF.toString(), body.toString(),'pdf are not same !');
        assert.equal(httpResponse.statusCode, 200);
        done();
      })
    })
    it('download append test', function(done){
      this.timeout(20000);
      const path = `${host}/api/download/append/${UploadDocName}`;
      request.get(path,(err, httpResponse, body) =>{
        //let testPDF = fs.readFileSync(__dirname + '/AppendPDF.pdf');
        console.log('to do better test');
        //assert.equal(testPDF.toString(), body.toString(),'pdf are not same !');
        assert.equal(httpResponse.statusCode, 200);
        done();
      })
    })
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
