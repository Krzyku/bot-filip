const facebook = require('../facebook')
const helpers = require('../helpers')
const slack = require('../slackBlock')

module.exports = (function() {
  let _data = null
  let _context = null

  const scrape = async function() {
    const posts = await facebook('niezlykociol')

    const presentMenu = posts.find(post => (
      helpers.isToday(new Date(post.date)) &&
      post.content.some(line => line.match(/menu/i))
    ))

    if (presentMenu) {
      // Remove lines with word "menu" and date
      _data = presentMenu.content.filter(line => (
        !line.match(/menu/i) && !line.match(/\d{4}/)
      ))

      _context = `Mają też kebab, pizze i sushi. <${presentMenu.directLink}|Menu na fb>`
    }

    return this
  }

  const createMessageBlock = function() {
    return [slack.section(`>>>${_data.join('\n')}`)]
  }

  return {
    get title() {return 'Niezły Kocioł'},
    get text() {return _data},
    get context() {return _context},
    scrape,
    createMessageBlock,
  }
})()