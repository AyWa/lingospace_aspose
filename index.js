var express     = require('express');
var app         = express();
var path        = require('path');
var bodyParser  = require('body-parser');

var StorageApi =require("asposestoragecloud")
var WordsApi =require("asposewordscloud")
var AppSID = '3cfe4a6c-2116-4665-806c-c72ebba2a0f8'; //sepcify App SID
var AppKey = '57221714d4555f55f11fca5c83463652'; //sepcify App Key
var config = {'appSid':AppSID,'apiKey':AppKey};

var port 	      = process.env.PORT || 4200; //you can change port of server

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'dist'))); //name of dist


var routes = require('./routes/index');
app.use('/api/',routes);

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname,'dist','index.html'));
});
// Start the server
app.listen(port);
console.log(':) watch out our app :): http://localhost:' + port);
