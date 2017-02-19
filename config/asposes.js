//Asposes
const StorageApi  = require("asposestoragecloud");
const WordsApi    = require("asposewordscloud");
const SlidesApi   = require("asposeslidescloud");
const PdfApi      = require("asposepdfcloud");
const crypto      = require("crypto");
const appSid      = '3cfe4a6c-2116-4665-806c-c72ebba2a0f8';
const apiKey      = '57221714d4555f55f11fca5c83463652';
const asposeUrl   = 'http://api.aspose.cloud/v1.1'
//Instantiate Aspose Storage API SDK
const storageApi = new StorageApi({appSid,apiKey});
//Instantiate Aspose Words API SDK
const wordsApi = new WordsApi({appSid,apiKey});
//Instantiate Aspose Slides API SDK
const slidesApi = new SlidesApi({appSid,apiKey});
//Instantiate Aspose PDF API SDK
const pdfApi = new PdfApi({appSid,apiKey});
//we need to sign the url for our own call to the aspose cloud api.
signAsposeUrl = function(unsignedUrl) {
  var signature = crypto.createHmac('sha1', apiKey)
    .update(unsignedUrl)
    .digest('base64')
    .replace('=', '')
  return signature;
};

module.exports = {
  wordsApi,
  slidesApi,
  pdfApi,
  storageApi,
  signAsposeUrl,
  asposeUrl,
  appSid
};
