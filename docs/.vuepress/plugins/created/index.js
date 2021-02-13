const path = require('path')
const spawn = require('cross-spawn')

module.exports = (options = {}, context) => ({
  name: 'created',
  extendPageData ($page) {
    const { transformer, dateOptions } = options
    const timestamp = getGitCreatedTimeStamp($page._filePath)
    const $lang = $page._computed.$lang
    if (timestamp) {
      const created = typeof transformer === 'function'
        ? transformer(timestamp, $lang)
        : defaultTransformer(timestamp, $lang, dateOptions)
      $page.created = created
    }
  }
})

function defaultTransformer (timestamp, lang, dateOptions) {
  return new Date(timestamp).toLocaleString(lang, dateOptions)
}

function getGitCreatedTimeStamp (filePath) {
  let created
  try {
    created = parseInt(spawn.sync(
      'git',
      ['log', '-1', '--format=%at', '--follow', '--diff-filter=A', path.basename(filePath)],
      { cwd: path.dirname(filePath) }
    ).stdout.toString('utf-8')) * 1000
  } catch (e) { /* do not handle for now */ }
  return created
}
