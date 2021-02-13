const markdownIt = require('markdown-it')

module.exports = (options = {}, context) => ({
  name: 'description',
  extendPageData ($page) {
    let content = $page._strippedContent
    content = content.split('<!--more-->')[0]
    const md = markdownIt({
      breaks: true,
      linkify: true,
    })
    var result = md.render(content)
    $page.description = result
  }
})
