const facebook = require('../facebook')
const helpers = require('../helpers')
const slack = require('../slackBlock')

module.exports = (function() {
  let _data = null
  let _context = null

  async function scrape() {
    const posts = await facebook('FalconBarCafe')
    const datePattern = /\d{1,2}\.\d{1,2}\.\d{4}/
    const presentMenu = posts
      .find(post => {
        const content = post.content.join('\n')
        const dateString = (content.match(datePattern) || [])[0]

        if (!dateString) return false

        const date = new Date(dateString.split('.').reverse().join('-'))

        return /menu/i.test(content) && helpers.isToday(date)
      })

    if (!presentMenu) {
      return this
    }

    const {content, directLink} = presentMenu
    const indexStart = content.findIndex(line => line.toUpperCase() === line)
    const indexEnd = content.findIndex(line => line.startsWith('DODATKI'))

    _data = content
      .slice(indexStart, indexEnd)
      .filter(line => line.startsWith('-'))
      .map(line => line.replace(/^-/, '• '))

    _context = `<${directLink}|menu na fb>`

    return this
  }

  function createMessageBlock() {
    return [slack.section('>>>' + _data.join('\n'))]
  }

  return {
    get title() {return 'Falcon Bar&Cafe Konstruktorska'},
    get emoji() {return ':fork_and_knife:'},
    get text() {return _data},
    get context() {return _context},
    scrape,
    createMessageBlock,
  }
})()
