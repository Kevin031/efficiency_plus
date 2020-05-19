const http = require('../services/http')
const Database = require('../services/connectDB')
const PlanModel = require('../models/plan')

class PlanController {
  static async update (ctx) {
    let uid = ctx.session.uid
    if (!uid) throw new Error('user is not login')
    let data = ctx.request.body
    let model = new PlanModel()

    try {
      for (let item of data) {
        let record = await model.get(item.id)
        if (record) {
          await model.update(item.id, item)
        } else {
          await model.create({
            ...item,
            uid,
            update_time: new Date().getTime()
          })
        }
      }
      ctx.body = {
        errCode: 0,
        data
      }
      return true
    } catch (err) {
      throw new Error(err)
    }
  }

  static async getPlans (ctx) {
    let date = ctx.query.date
    if (!date) throw new Error('date query is required')

    let uid = ctx.session.uid
    if (!uid) throw new Error('user is not login')

    let database = new Database()
    try {
      let records = await database.query(`SELECT * FROM plans WHERE uid='${uid}' AND date='${date}'`)
      ctx.body = {
        errCode: 0,
        data: {
          plans: records,
          last_updated: records.length ? Math.min(...records.map(item => item.update_time)) : 0
        }
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  static async delete (ctx) {
    let uid = ctx.session.uid
    if (!uid) throw new Error('user is not login')

    let database = new Database()
    try {
      await database.query(`DELETE FROM plans WHERE id='${ctx.params.id}'`)
      ctx.body = {
        errCode: 0,
        data: {}
      }
      return true
    } catch (err) {
      throw new Error(err)
    }
  }
}

module.exports = PlanController
