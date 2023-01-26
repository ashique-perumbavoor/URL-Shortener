const randomstring = require('randomstring');
const db = require('../connections/mongodb');
const { urlCollection } = require('../connections/collections').collections
const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/

module.exports ={
  createURL: async function(req, res){
      let longURL = req.body.longURL;
      if(
        longURL.startsWith('http://') || 
        longURL.startsWith('https://') || 
        longURL.includes('www.') || 
        longURL.endsWith('/')
      ) {
        longURL = longURL.replace('http://', '').replace('https://', '').replace('www.', '')
        longURL = longURL.substring(0, longURL.length - 1)
      }
      if(urlRegex.test(longURL)) {
        let dbResult = await db.getDB().collection(urlCollection).findOne({longURL: {$exists: true, $eq: longURL}})
        if(dbResult === null) {
          let shortURL = randomstring.generate({length: 5, charset: 'alphanumeric'})
          db.getDB().collection(urlCollection).insertOne({longURL: longURL, shortURL: shortURL})
          res.send({shortURL: shortURL})
        } else { res.status(409).send({shortURL: dbResult.shortURL}) }
      } else {
        res.status(400).send()
      }
  },

  redirectToURL: async function(req, res) {
    let dbResult = await db.getDB().collection(urlCollection).findOne({shortURL: req.params.id})
    let longURL = dbResult?.longURL
    if(longURL != null || longURL != undefined) {
      if(!longURL.startsWith('http://') && !longURL.startsWith('https://')) {
        longURL = 'http://' + longURL
      }
      res.redirect(longURL)
    }
  }
}