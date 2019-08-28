const fs = require('fs')
const paths = fs.readdirSync(__dirname + '/src/websites')
const replay = require('./src/replay')
const slack = require('./src/slackBlock')

const createSection = website => {
  const content = website.createMessageBlock() || []

  const emoji = website.emoji || ':food:'

  content.unshift(slack.section(`*${emoji} ${website.title}*`))

  content.push(slack.context(website.context))

  content.push(slack.divider())

  return content
}

const blank = ({title}) => ([
  slack.section(`Brak menu dla ${title} :disappointed:`),
  slack.divider()
])

exports.main = async (params) => {
  const sendMessage = replay(params.response_url)

  const websitesPromises = paths
    .map(path => require('./src/websites/' + path))
    .filter(website => website.title.toLowerCase().match(params.text.toLowerCase()))
    .map(website => {
      console.log('SCRAPE ' + website.title)

      return website
        .scrape()
        .then(() => {
          console.log('CREATE_MESSAGE ' + website.title)

          return website.text ? createSection(website) : blank(website)
        })
    })

  sendMessage([slack.section(`@${params.user_name} co chcesz zjeść?`)])

  await Promise
    .all(websitesPromises)
    .then(messages => [].concat(...messages).filter(Boolean))
    .then(message => JSON.stringify(message))
    .then(blocks => {
      if (!params.response_url) {
        console.log(blocks)
      }

      return sendMessage(blocks)
    })

  return {
    statusCode: 200,
    body: 'Dzięki filip!'
  }
}
