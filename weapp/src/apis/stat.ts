import http from './http'

export default {
  getUserStat () {
    return http.get('/api/stat/user')
  }
}
