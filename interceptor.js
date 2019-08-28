const AWS = require('aws-sdk')
const lambda = new AWS.Lambda()

exports.handler = async (event) => {
  const searchParams = new URLSearchParams(event.body);
  const params = {}

  searchParams.forEach((value, key) => {
      params[key] = value
  })

  console.info('params', params)

  await lambda
    .invoke({
      FunctionName: 'filip-scrape',
      InvocationType: 'Event',
      Payload: JSON.stringify(params)
    })
    .promise()

  return {
    statusCode: 200,
    body: 'Filip sprawdza co zjeść :loading:'
  }
}
