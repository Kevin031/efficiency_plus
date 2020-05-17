const fs = require('fs')
const logConfig = require('../config/log-config')

const confirmPath = function (pathStr) {
  if (fs.existsSync(pathStr)) {
    fs.mkdirSync(pathStr)
    console.log('createPath:' + pathStr)
  }
}

const initLogPath = function () {
  if (logConfig.baseLogPath) {
    confirmPath(logConfig.baseLogPath)
    for (let i = 0, len = logConfig.appenders.length; i < len; i++) {
      if (logConfig.appenders[i].path) {
        confirmPath(logConfig.baseLogPath + logConfig.appenders[i].path)
      }
    }
  }
}

initLogPath()
