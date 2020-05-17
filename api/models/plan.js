const Database = require('../services/connectDB')

class PlanModel {
  constructor () {
    this.database = new Database()
  }

  async get (id) {
    const [ record ] = await this.database.query(`SELECT * FROM plans WHERE id='${id}'`)
    return record
  }

  async update (id, data) {
    let children = []
    Object.keys(data).forEach(key => {
      children.push(`${key}='${data[key]}'`)
    })
    await this.database.query(`UPDATE plans SET ${children.join(', ')} WHERE id='${id}'`)
    return true
  }

  async create (data) {
    await this.database.query(`INSERT INTO plans (${Object.keys(data).join(',')}) VALUES (${Array(Object.keys(data).length).fill('?').join(',')})`, Object.values(data))
  }
}

module.exports = PlanModel
