import Taro from '@tarojs/taro'

const baseURL = 'http://localhost:20228'

export default {
  baseURL,
  get (url) {
    return new Promise((resolve, reject) => {
      return Taro.request({
        url: baseURL + url,
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          resolve(res.data)
        }
      })
    })
  },
  post (url, data) {
    return new Promise((resolve, reject) => {
      return Taro.request({
        url: baseURL + url,
        method: 'POST',
        header: {
          'content': 'application/json'
        },
        data, 
        success: res => {
          resolve(res.data)
        }
      })
    })
  }
}
