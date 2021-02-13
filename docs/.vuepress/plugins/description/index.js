const path = require('path')
const spawn = require('cross-spawn')
const markdownIt = require('markdown-it')

module.exports = (options = {}, context) => ({
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
