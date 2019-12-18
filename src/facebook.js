const superagent = require('superagent')
const cheerio = require('cheerio')

const FB = 'https://www.facebook.com'

module.exports = async pageId => {
  const $ = await superagent
    .get(`https://www.facebook.com/${pageId}/posts/`)
    .set('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36')
    .then(({text}) => cheerio.load(text))
    .catch((err) => {
      console.error(err)
      return cheerio.load('')
    })

  return $('[data-fte]')
    .map((i, el) => {
      const utime = $(el).find('abbr[data-utime]').data('utime') * 1000
      const userContent = $(el).find('.userContent')

      const images = $(el).find('a[data-ploi]').map((i, el) => $(el).data('ploi')).toArray()

      $(el).find('.text_exposed_hide').remove()

      const directLink = FB + $(el).find('.timestampContent').closest('a').attr('href')

      const p = userContent.find('p')
      let content = []

      if (p.length) {
        content = p
          .map((i, el) => {
            $(el).find('br').replaceWith('\n')

            return $(el)
              .text()
              .split('\n')
          })
          .toArray()
      } else {
        content = userContent.text().split('\n')
      }

      content = content.map(line => line.trim())

      return {
        date: new Date(utime),
        content,
        images,
        title: $(el).find('h5').text(),
        directLink
      }
    })
    .toArray()
}
