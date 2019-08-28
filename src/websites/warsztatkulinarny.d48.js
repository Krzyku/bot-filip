const facebook = require('../facebook')
const helpers = require('../helpers')
const slack = require('../slackBlock')

module.exports = (function() {
  let _data = null
  let _context = null

  async function scrape() {
    const posts = await facebook('warsztatkulinarny.d48')
    const presentMenu = posts.find(helpers.isTodayPost)

    if (presentMenu) {
      _data = presentMenu
      _context = `<${presentMenu.directLink}|${[presentMenu.content.join('\n')]}>`
    }

    return this
  }

  function createMessageBlock() {
    return [slack.image({
      alt: 'menu warsztat kulinarny',
      url: _data.images[0],
    })]
  }

  return {
    get title() {return 'Warsztat kulinarny D48'},
    get emoji() {return '🛠'},
    get text() {return _data},
    get context() {return _context},
    scrape,
    createMessageBlock,
  }
})()
