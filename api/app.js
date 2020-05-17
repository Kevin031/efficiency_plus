const Koa = require('koa')
const Router = require('koa-router')
const path = require('path')
const fs = require('fs')
const cors = require('@koa/cors')
const Logger = require('koa-logger')
const day = require('dayjs')
const logUtil = require('./utils/logger')
const config = require('./config')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')

const app = new Koa()
const logger = new Logger(str => {
  console.log(day().format('YYYY-MM-DD HH:mm:ss') + str)
})

const PORT = 20228

app.use(cors({ origin: '*' }))
app.use(logger)
app.use(bodyParser())

app.keys = ['efficiency_plus']
app.use(session({
  key: 'USER_SID',
  maxAge: 86400000 * 7
}, app))

// 记录响应时间
app.use(async (ctx, next) => {
  const start = Date.now()
  try {
    await next()
    const rt = Date.now() - start
  } catch (error) {
    ctx.status = error.status || 400
    ctx.body = {
      errCode: 1,
      msg: error.message
    }
    const rt = Date.now() - start
    logUtil.logError(ctx, rt)
  }
})

// 挂载路由
const route_modules = fs.readdirSync(path.join(__dirname, './routes'))
route_modules.forEach(name => {
  const router = require(path.join(__dirname, `./routes/${name.split('.')[0]}`))
  app.use(router.routes())
})

// 端口监听
app.listen(PORT)

console.log('service is runing in', PORT)
