const slack = require('../slackBlock')
const scrapeWebsite = require('../scrapeWebsite')

module.exports = (function() {
  const URI = 'https://www.lifemotiv.com.pl/menu'

  let _data = null
  let _context = `<${URI}|Pełne menu>`

  const scrape = async function() {
    const $ = await scrapeWebsite(URI)

    _data = $('._product-group-name')
      .filter((i, el) => $(el).text().match(/lunch/i))
      .parent()
      .next()
      .find('.theme-product-name')
      .toArray()
      .map(el => '• ' + $(el).text().trim())

    return this
  }

  const createMessageBlock = function() {
    return [slack.section('>>>' + _data.join('\n'))]
  }

  return {
    get title() {return 'lifemotiv'},
    get emoji() {return '🍃'},
    get text() {return _data},
    get context() {return _context},
    scrape,
    createMessageBlock,
  }
})()
