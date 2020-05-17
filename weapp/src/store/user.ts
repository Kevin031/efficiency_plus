import { types, flow } from 'mobx-state-tree'
import Taro from '@tarojs/taro'
import Api from '@/apis/user'
import { withRootStore } from './with-root-store'

export const UserStore = types.model('UserStore')
  .props({
    uid: types.maybeNull(types.integer),
    name: types.maybeNull(types.string),
    avatar: types.maybeNull(types.string)
  })
  .extend(withRootStore)
  .actions(self => ({
    /**
     * 初始化会话信息
     */
    getUserInfo: flow(function * () {
      const session = yield Api.initSession()

      // 用户未登录
      if (!session) return true 

      // 初始化用户信息
      self.setUserInfo(session.data)

      return true
    }),
    /**
     * 登录
     */
    login () {
      return new Promise(resolve => {
        Taro.showLoading({ title: '登录中' })
        Taro.login({
          success: ({ code }) => {
            if (code) {
              Taro.getUserInfo({
                success: ({ userInfo }) => {
                  Api.login({ code, userInfo }).then(res => {
                    if (!res.errCode) {
                      const { session_key, ...info } = res.data
                      self.setUserInfo(info)
                    }
                    Taro.hideLoading()
                    self.rootStore.planStore.uploadData()
                    resolve()
                  })
                }
              })
            }
          }
        })
      })
    },
    /**
     * 设置用户信息
     * @param info 
     */
    setUserInfo (info) {
      self.uid = info.uid
      self.name = info.name
      self.avatar = info.avatar
    }
  }))
