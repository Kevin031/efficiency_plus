import http from './http'

export default {
  login (data) {
    return http.post(`/api/user/login`, data)
  },

  initSession () {
    return http.get(`/api/user/session`)
  }
}
