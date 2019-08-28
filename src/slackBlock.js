const section = text => ({
  type: 'section',
  text: {
    type: 'mrkdwn',
    text
  }
})

const image = ({title, url, alt}) => ({
  type: 'image',
  ...(title ? {title: {type: 'plain_text', title, emoji: true}} : {}),
  image_url: url,
  alt_text: alt
})

const blockWithImage = ({text, image_url, alt_text}) => ({
  type: 'section',
  text: {
    type: 'mrkdwn',
    text
  },
  accessory: {
    type: 'image',
    image_url,
    alt_text
  }
})

const fields = ({text, fields}) => {
  const result = {type: 'section'}

  if (text) {
    result.text = {
      type: 'mrkdwn',
      text
    }
  }

  result.fields = fields.map(field => ({
    type: 'mrkdwn',
    text: field
  }))

  return result
}

const context = text => ({
  type: "context",
  elements: [
    {
      type: "mrkdwn",
      text
    }
  ]
})

const divider = () => ({type: 'divider'})

module.exports = {
  section,
  image,
  blockWithImage,
  fields,
  context,
  divider
}