const {signAsposeUrl, asposeUrl, appSid}  = require('../config/asposes');
const request                             = require('request');

//our own api to make call to aspose cloud
replaceSentences = function (formData, fileName) {
  formData.IsMatchCase = true;
  formData.IsMatchWholeWord = true;
  formData.IsOldValueRegex = true;
  let url = `${asposeUrl}/words/${fileName}/replaceText?appsid=${appSid}`
  const signature = signAsposeUrl(url);
  url = `${url}&signature=${signature}`
  let promise = new Promise ((resolve, reject)=>{
    request.post(url)
      .json(formData)
      .on('response', responseM => {
        resolve(responseM);
      })
  })
  return promise;
}

module.exports = {
  replaceSentences
}
