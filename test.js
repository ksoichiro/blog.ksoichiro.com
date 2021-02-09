const path = require('path')
const spawn = require('cross-spawn')

function defaultTransformer (timestamp, lang, dateOptions) {
  return new Date(timestamp).toLocaleString(lang, dateOptions)
}

function getGitLastUpdatedTimeStamp (filePath) {
  let lastUpdated
  try {
    lastUpdated = parseInt(spawn.sync(
      'git',
      ['log', '-1', '--format=%at', path.basename(filePath)],
      { cwd: path.dirname(filePath) }
    ).stdout.toString('utf-8')) * 1000
  } catch (e) { /* do not handle for now */ }
  return lastUpdated
}

console.log(defaultTransformer(getGitLastUpdatedTimeStamp('./docs/README.md'), 'ja'))
