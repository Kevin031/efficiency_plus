import http from './http'

export default {
  update (data) {
    return http.post('/api/plans/update', data)
  },

  getPlans ({ date }) {
    return http.get(`/api/plans?date=${date}`)
  },

  deletePlan (id) {
    return http.delete(`/api/plans/${id}`)
  }
}
