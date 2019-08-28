const isToday = (a, b = new Date()) => (
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()
)

const isTodayPost = post => isToday(new Date(post.date))

module.exports = {
  isToday,
  isTodayPost
}