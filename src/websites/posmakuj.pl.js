const scrapeWebsite = require('../scrapeWebsite')

module.exports = (function() {
  const URI = 'https://posmakuj.pl/menu'

  let _data = null
  let _context = `<${URI}|Menu> świątyni rozczarowania`

  const scrape = async function() {
    const $ = await scrapeWebsite('https://posmakuj.pl/menu')

    const pricePattern = /\s+\d{1,2},\d{2} zł$/

    const flatMapItems = (acc, item) => {
      acc.push(...item.split('\n'))
      return acc
    }

    _data = $('.tabs li.active .tab__content p')
      .filter((i, el) => i > 0 && i < 7) // Ommit few sections
      .map((i, el) => $(el).text())
      .toArray()
      .reduce(flatMapItems, [])
      .map(line => line.trim().replace(pricePattern, ''))
      .filter(Boolean)

    return this
  }

  const createMessageBlock = function() {
    const partition = Math.floor(_data.length / 2)

    const fields = [_data.slice(0, partition), _data.slice(partition)]
      .map(column => ({
        type: 'mrkdwn',
        text: '>>>' + column.join('\n\n')
      }))

    return [{
      type: 'section',
      fields
    }]
  }

  return {
    get title() {return 'Posmakuj'},
    get text() {return _data},
    get context() {return _context},
    scrape,
    createMessageBlock,
  }
})()
