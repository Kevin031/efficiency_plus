import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { observer } from '@tarojs/mobx'
import PlanCard from '@/components/plan-card/plan-card'
import { useStore } from '@/store/hooks'
import { PlanStoreType } from '@/store/plan-store'

import './index.scss'

interface Index {}

@observer
class Index extends Component {
  config: Config = {
    navigationBarTitleText: '今日计划',
    navigationBarBackgroundColor: '#DCE7F3',
    backgroundColor: '#DCE7F3'
  }

  planStore: PlanStoreType = useStore().planStore

  render () {
    const { plans } = this.planStore
    return (
      <View className='page-wrapper'>
        <View className='task-wrapper'>
          {
            plans.map(plan => (
              <View className='task-item' key={plan.id}>
                <PlanCard model={plan} />
              </View>
            ))
          }
          <View className='task-item'>
            <PlanCard type='create' onTap={() => Taro.navigateTo({ url: '/pages/plan-edit/plan-edit?id=new' })} />
          </View>
        </View>
      </View>
    )
  }
}

export default Index  as ComponentType
