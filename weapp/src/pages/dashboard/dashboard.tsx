import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text, Image } from '@tarojs/components'
import Api from '@/apis/user'
import statApi from '@/apis/stat'
import { useStore } from '@/store/hooks'
import { observer } from '@tarojs/mobx'

import './dashboard.scss'

@observer
class Dashboard extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '个人中心'
  }

  state = {
    statData: {}
  }

  userStore = useStore().userStore

  componentDidMount () {
    this.fetchUserStat()
  }

  async fetchUserStat () {
    if (this.userStore.uid) {
      const statData = await statApi.getUserStat()
      this.setState({ statData })
      return true
    }
  }

  async login () {
    await this.userStore.login()
    this.fetchUserStat()
  }

  render () {
    if (!this.userStore.uid) {
      return <View style="padding: 30px;">
        <Button onGetUserInfo={this.login} openType='getUserInfo'>登录</Button>
      </View>
    }
    return <View className='dashboard'>
      <View className='header'>
        <View className='user-info'>
          <Image className='avatar' src={this.userStore.avatar} />
          <View>
            <Text className='name'>{this.userStore.name}</Text>
          </View>
        </View>
      </View>
      <View className='stat'>
        <View className='stat-item'>
          <Text className='label'>已创建计划</Text>
          <Text className='value'>{this.state.statData.plans_num || 0}</Text>
        </View>
        <View className='split' />
        <View className='stat-item'>
          <Text className='label'>已使用天数</Text>
          <Text className='value'>{this.state.statData.used_days || 0}</Text>
        </View>
      </View>
    </View>
  }
}

export default Dashboard as ComponentType
