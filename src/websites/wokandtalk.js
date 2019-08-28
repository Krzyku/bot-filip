const facebook = require('../facebook')
const helpers = require('../helpers')
const slack = require('../slackBlock')

module.exports = (function() {
  const URI = 'https://www.facebook.com/pg/wokandtalk/posts/?ref=page_internal'

  let _data = null
  let _context = `<${URI}|Pełne menu>`

  const scrape = async function() {
    const posts = await facebook('wokandtalk')

    const presentMenu = posts.find(post => (
      helpers.isToday(new Date(post.date)) &&
      post.content.some(line => line.match(/lunch/i))
    ))

    if (presentMenu) {
      _data = presentMenu.content.filter(line => (
        !line.match(/lunch/i) && !line.match(/\d{4}/)
      ))
    }

    return this
  }

  const createMessageBlock = function() {
    return [slack.section(`>>>${_data.join('\n')}`)]
  }

  return {
    get title() {return 'Wok & Talk'},
    get text() {return _data},
    get context() {return _context},
    scrape,
    createMessageBlock,
  }
})()