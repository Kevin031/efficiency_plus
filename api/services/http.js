const axios = require('axios')
const config = require('../config')

axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.withCredentials = true

function parseQuery (str) {
  let params = {}
  if (query) {
    if (query.split('?').length === 0) {
      return params
    }
    let strArr = query.split('?')[1].split('&')
    strArr.forEach(child => {
      params[child.split('=')[0]] = child.split('=')[1]
    })
  }
  return params
}

function buildQuery (params) {
  let q = []
  for (let k in params) {
    // console.log(k, params[k])
    q.push(`${k}=${params[k]}`)
  }
  return encodeURI(q.join('&'))
}

const get = (url, config = {}) => axios.get(url, config).then(res => res.data)

module.exports = {
  get,
  buildQuery
}
