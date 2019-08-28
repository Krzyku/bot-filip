// Usage: node demo.js src/websites/empark.pl.js

const path = require('path')

const filePath = process.argv[2]
const restaurant = require(path.join(__dirname, filePath))

restaurant
  .scrape()
  .then(data => {
    console.log(data.text)

    const block = data.createMessageBlock()
    const stringBlock = JSON.stringify(block, null, 2)
    console.log(stringBlock)
  })
