const Router = require('koa-router')
const controller = require('../controllers/stat')
const router = new Router({ prefix: '/api/stat' })

router.get('/user', controller.getUserStat)

module.exports = router
