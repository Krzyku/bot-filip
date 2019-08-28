const superagent = require('superagent')

module.exports = response_url => blocks => {
  if (!response_url) return

  return superagent
    .post(response_url)
    .set('Content-Type', 'application/json')
    .send({
      response_type: 'in_channel',
      response_url,
      blocks
    })
    .then(() => {
      console.log('MESAGE_SEND')
    })
    .catch(err => {
      console.error(err)
    })
}