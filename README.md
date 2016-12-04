# lingospace word & ppt
#INSTALLATION
##DEV
I used nodeJs > 6.0    
##Install
git pull   
in the root folder:  
`npm install`  
#Start the APP  
in the root folder:  
`npm start`  
#TEST
to test   
`npm start`   
`node test.js`   
or   
`npm test`
#API
get API:   
'/api/document/:name'   
for download:   
'/api/download/:name'   
post API:   
'/api/upload'   
post API:   
'/api/replace-sentences'   
#example
##get the text of a file   
`http://localhost:4200/api/document/d041b0836d7804a4b40cb137a5bdfddftest1.pptx`   
##download modified file   
`http://localhost:4200/api/download/d041b0836d7804a4b40cb137a5bdfddftest1.pptx`   
##download original (append original to the name)   
`http://localhost:4200/api/download/originald041b0836d7804a4b40cb137a5bdfddftest1.pptx`   
##replace (post)   
`localhost:4200/api/replace-sentences`   
with body   
```json
{
	"sentences":{
		"origin_sentence": "Hellow",
		"replace_sentence": "Bonjour"
	},
	"file_url": "9c6b5623708db2bb7a6adf00b6c095d7test1.pdf"
}
```
#CODE
#MODULE
multer -> middleware to get file for express   
request && assert  to test    
asposewordscloud
