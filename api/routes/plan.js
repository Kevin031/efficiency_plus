const Router = require('koa-router')
const controller = require('../controllers/plan')
const router = new Router({ prefix: '/api/plans' })

router.get('/', controller.getPlans)
router.post('/update', controller.update)
router.delete('/:id', controller.delete)

module.exports = router
