var express     = require('express');
var app         = express();
var path        = require('path');
var bodyParser  = require('body-parser');
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


var routes = require('./routes/api');
app.use('/api',routes);

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname,'dist','index.html'));
});
// Start the server
app.listen(port);
console.log(':) watch out our app :): http://localhost:' + port);
