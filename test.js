const os = require('os')
const main = require('./index').main

main({
  user_name: os.userInfo().username,
  text: '',
  response_url: null
})
