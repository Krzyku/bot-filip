const superagent = require('superagent')
const cheerio = require('cheerio')

module.exports = (uri, headers) => (
  superagent
    .get(uri)
    .then(({text}) => cheerio.load(text))
    .catch((err) => {
      console.error(err)
      return cheerio.load('')
    })
)
