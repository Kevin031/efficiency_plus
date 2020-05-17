const http = require('../services/http')
const Database = require('../services/connectDB')
const { secret, appid } = require('../config')
const emoji = require('node-emoji')

class UserController {
  /**
   * 处理微信登录
   * @param {*} ctx 
   */
  static async wxLogin (ctx) {
    let body = ctx.request.body
    let code = body.code
    if (!code) throw new Error('code is required')

    const res = await http.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`)
    if (!res.openid) throw new Error(res)

    // 保存到数据库
    const database = new Database()
    try {
      // 判断用户是否存在
      let [ user ] = await database.query(`SELECT * FROM users WHERE openid='${res.openid}'`)
      if (!user) {
        // 创建用户
        user = {
          openid: res.openid,
          name: emoji.replace(body.userInfo.nickName, emoji => `emoji:${emoji.key}:`),
          avatar: body.userInfo.avatarUrl,
          gender: body.userInfo.gender
        }
        // 写入数据库
        const { insertId } = await database.query(`INSERT INTO users (openid, name, avatar, gender) VALUES(?,?,?,?)`, [...Object.values(user)])
        user.uid = insertId
      }
      ctx.session.is_login = true
      ctx.session.uid = user.uid
      ctx.body = {
        errCode: 0,
        data: {
          ...user,
          name: user.name.replace(/emoji:\w+:/g, str => emoji.get(str.split(':')[1]))
        }
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  /**
   * 获取session和登录状态
   * @param {*} ctx 
   */
  static async session (ctx) {
    console.log(ctx.session)
    if (!ctx.session.is_login) {
      ctx.session.is_login = false
      ctx.body = false
      return
    }
    try {
      const database = new Database()
      const [ record ] = await database.query(`SELECT * FROM users WHERE uid=${ctx.session.uid}`)
      ctx.body = {
        errCode: 0,
        data: {
          ...record,
          name: record.name.replace(/emoji:\w+:/g, str => emoji.get(str.split(':')[1]))
        }
      }
    } catch (err) {
      throw new Error(err)
    }
  }
}

module.exports = UserController
