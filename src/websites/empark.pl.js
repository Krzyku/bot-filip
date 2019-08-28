const scrapeWebsite = require('../scrapeWebsite')
const slack = require('../slackBlock')

module.exports = (function() {
  let _data = null
  let _context = null

  const scrape = async function() {
    const $ = await scrapeWebsite('http://empark.pl/foodtruck/')

    const titles = $('.foodtruck--item .text strong')
      .map((i, el) => $(el).text())
      .toArray()

    const images = $('.foodtruck--item img')
      .map((i, el) => $(el).attr('src'))
      .toArray()

    const descriptions = $('.foodtruck--item .text p')
      .map((i, el) => $(el).text())
      .toArray()
      .map((line, i) => '>>>' + line.trim().replace(titles[i], `*${titles[i]}*`))

    const dateInfo = $('.foodtruck--page strong').eq(0).text()

    _context = `${dateInfo} <http://empark.pl/foodtruck/|empark.pl/foodtruck>`

    _data = titles.map((title, i) => ({
      image_url: images[i],
      alt_text: title,
      text: descriptions[i]
    }))

    return this
  }

  const createMessageBlock = function() {
    return _data.map(slack.blockWithImage)
  }

  return {
    get title() {return 'Empark foodtruck'},
    get emoji() {return '🚚'},
    get text() {return _data},
    get context() {return _context},
    scrape,
    createMessageBlock,
  }
})()
