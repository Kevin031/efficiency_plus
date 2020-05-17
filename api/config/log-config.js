const path = require('path')

//日志根目录
var baseLogPath = path.resolve(__dirname, '../logs')

// 错误日志
const errorPath = '/error'
const errorFileName = 'error'
const errorLogPath = baseLogPath + errorPath + '/' + errorFileName

// 响应日志
const responsePath = '/response'
const responseFileName = 'response'
const responseLogPath = baseLogPath + responsePath + '/' + responseFileName

module.exports = {
  appenders: {
    // 错误日志
    errorLogger: {
      type: 'dateFile',                   //日志类型
      filename: errorLogPath,             //日志输出位置
      alwaysIncludePattern: true,         //是否总是有后缀名
      pattern: '-yyyy-MM-dd-hh.log'       //后缀，每小时创建一个新的日志文件
    },
    // 响应日志
    resLogger: {
      type: 'dateFile',                   //日志类型
      filename: responseLogPath,          //日志输出位置
      alwaysIncludePattern: true,         //是否总是有后缀名
      pattern: '-yyyy-MM-dd-hh.log'       //后缀，每小时创建一个新的日志文件
    }
  },
  categories: {
    default: {
      appenders: ['errorLogger', 'resLogger'],
      level: 'debug'
    }
  }
}
