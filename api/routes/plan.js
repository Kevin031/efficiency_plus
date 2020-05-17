const Router = require('koa-router')
const controller = require('../controllers/plan')
const router = new Router({ prefix: '/api/plans' })

router.get('/', controller.getPlans)
router.post('/update', controller.update)

module.exports = router
