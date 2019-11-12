const scrapeWebsite = require('../scrapeWebsite')
const slack = require('../slackBlock')

module.exports = (function() {
  let _data = null
  let _context = null

  const scrape = async function() {
    const $ = await scrapeWebsite('https://kuchniazasciana.pl/dzisiejsze-menu/')

    const dateInfo = $('.cp_main__subpage__menu__date').text()
    _context = `${dateInfo} <https://kuchniazasciana.pl/dzisiejsze-menu/|kuchniazasciana.pl/dzisiejsze-menu>`

    _data = $('.cp_main__subpage__menu__todaydish > div')
      .map((i, el) => $(el).text().trim())
      .toArray()

    return this
  }

  const createMessageBlock = function() {
    return [slack.section(`>>>${_data.join('\n')}`)]
  }

  return {
    get title() {return 'Kuchnia za ścianą'},
    get emoji() {return '🥣'},
    get text() {return _data},
    get context() {return _context},
    scrape,
    createMessageBlock,
  }
})()
