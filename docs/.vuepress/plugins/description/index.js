const markdownIt = require('markdown-it')

module.exports = (options = {}, context) => ({
  name: 'description',
  extendPageData ($page) {
    let content = $page._strippedContent
    if (!content) {
      // 404.html does not contain _strippedContent
      return
    }
    content = content.split('<!--more-->')[0]

    // Make headers' level lower
    let edited = []
    for (let line of content.split('\n')) {
      edited.push(line.replace(/^## /, '### '))
    }

    const md = markdownIt({
      breaks: true,
      linkify: true,
    })
    var result = md.render(edited.join('\n'))
    $page.description = result
  }
})
