//Asposes
const StorageApi  = require("asposestoragecloud");
const WordsApi    = require("asposewordscloud");
const SlidesApi   = require("asposeslidescloud");
const PdfApi      = require("asposepdfcloud");
const appSid      = '3cfe4a6c-2116-4665-806c-c72ebba2a0f8';
const apiKey      = '57221714d4555f55f11fca5c83463652';
//Instantiate Aspose Storage API SDK
const storageApi = new StorageApi({appSid,apiKey});
//Instantiate Aspose Words API SDK
const wordsApi = new WordsApi({appSid,apiKey});
const slidesApi = new SlidesApi({appSid,apiKey});
const pdfApi = new PdfApi({appSid,apiKey});
module.exports = {
  wordsApi,
  slidesApi,
  pdfApi,
  storageApi
};
