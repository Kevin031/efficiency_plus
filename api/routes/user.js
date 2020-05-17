const Router = require('koa-router')
const controller = require('../controllers/user')
const router = new Router({ prefix: '/api/user' })

router.post('/login', controller.wxLogin)
router.get('/session', controller.session)

module.exports = router
