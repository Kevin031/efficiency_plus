import Taro, { Component, Config } from '@tarojs/taro'
import Index from './pages/index'
import { setupRootStore } from './store/setup'
import 'weapp-cookie/dist/weapp-cookie'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/index/index',
      'pages/plan-edit/plan-edit',
      'pages/day-plans/day-plans',
      'pages/dashboard/dashboard'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '绝对效率+',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      color: '#999999',
      selectedColor: '#F2A62A',
      list: [
        {
          pagePath: 'pages/index/index',
          text: '进行中',
          iconPath: './images/bulb.png',
          selectedIconPath: './images/bulb-fill.png'
        },
        // {
        //   pagePath: 'pages/day-plans/day-plans',
        //   text: '计划列表',
        //   iconPath: './images/calendar-check.png',
        //   selectedIconPath: './images/calendar-check-fill.png'
        // },
        {
          pagePath: 'pages/dashboard/dashboard',
          text: '个人中心',
          iconPath: './images/user.png',
          selectedIconPath: './images/user-fill.png'
        }
      ]
    }
  }

 async componentWillMount () {
    const app = setupRootStore()
    await app.userStore.getUserInfo()
    await app.planStore.initData()
    // app.planStore.addPlan({ title: '刷leetcode', plannedTime: 30 * 60 * 1000 })
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
