const Database = require('../services/connectDB')

class StatController {
  static async getUserStat (ctx) {
    let uid = ctx.session.uid
    if (!uid) throw new Error('user is not login')

    try {
      const database = new Database()
      let user_records = await database.query(`SELECT * FROM plans WHERE uid='${ctx.session.uid}'`)
      let used_days = new Set(user_records.map(item => item.date)).size
      ctx.body = {
        used_days,
        plans_num: user_records.length
      }
    } catch (err) {
      throw new Error(err)
    }
  }
}

module.exports = StatController
