var express     = require('express');
var app         = express();
var path        = require('path');
var bodyParser  = require('body-parser');
var assert      = require('assert');
var fs          = require('fs');
//Asposes
var StorageApi  = require("asposestoragecloud")
var WordsApi    = require("asposewordscloud")
var AppSID      = '3cfe4a6c-2116-4665-806c-c72ebba2a0f8'; //sepcify App SID
var AppKey      = '57221714d4555f55f11fca5c83463652'; //sepcify App Key
var config      = {'appSid':AppSID,'apiKey':AppKey};
var data_path   = './public_data/';
//port server
var port 	      = process.env.PORT || 4200; //you can change port of server
/*
todo:
user upload
get the file on nodejs
send the file to the Asposes
get the text and image
get the modified text and replace in the document(copyof)
download the newfile
*/

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'dist'))); //name of dist


var routes = require('./routes/index');
app.use('/api',routes);

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname,'dist','index.html'));
});
// Start the server
app.listen(port);
console.log(':) watch out our app :): http://localhost:' + port);

try {
  //Instantiate Aspose.Storage API SDK
  var storageApi = new StorageApi(config);
  //Instantiate Aspose.Words API SDK
  var wordsApi = new WordsApi(config);

  //set input file name
  var filename = "Sample";
  var name = filename + ".doc";
  var format = "pdf";

  wordsApi.GetDocumentTextItems(name,null,null,function(responseMessage){
    assert.equal(responseMessage.status, 'OK');
    responseMessage.body.TextItems.List.forEach(function(textItem) {
      console.log(textItem.Text);
    });
    console.log('************');
    console.log(responseMessage.body.TextItems.List);
  });
  //upload file to aspose cloud storage
  /*
  storageApi.PutCreate(name, null, null, file= data_path + name , function(responseMessage) {
      assert.equal(responseMessage.status, 'OK');
      //invoke Aspose.Words Cloud SDK API to convert words document to required format
      wordsApi.GetDocumentWithFormat(name, format, null, null, null, function(responseMessage) {
            assert.equal(responseMessage.status, 'OK');
            //download output document from response
            var outfilename = filename + '.' + format;
            var writeStream = fs.createWriteStream('./public_data/' + outfilename);
            writeStream.write(responseMessage.body);
          });
      });
  */
  }catch (e) {
    console.log("exception in example");
    console.log(e);
}
