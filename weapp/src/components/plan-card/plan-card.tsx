import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { PlanModelType } from '@/store/plan-store'
import cx from 'classnames'
import { observer } from '@tarojs/mobx'
import { useStore } from '@/store/hooks'

import '@/styles/iconfont.scss'
import './plan-card.scss'

interface PlanCardProp {
  type?: string
  model?: PlanModelType
}

interface PlanCard {
  props: PlanCardProp
}

@observer
export default class PlanCard extends Taro.Component {
  showMenu () {
    let tasks = []
    switch (this.props.model.status) {
      case 0:
        tasks = [
          { label: '开始', action: () => this.planStore.startPlan(this.props.model.id) },
          { label: '删除', action: () => this.deletePlan() }
        ]
        break
      case 1:
        tasks = [
          { label: '停止', action: () => this.showStopMenu() }
        ]
        break
      case 2:
      case 3:
        tasks = [
          { label: '删除', action: () => this.deletePlan() }
        ]
        break
    }
    return Taro.showActionSheet({
      itemList: tasks.map(task => task.label),
      success: ({ tapIndex }) => tasks[tapIndex].action(),
      fail: () => {}
    })
  }

  showStopMenu () {
    return Taro.showActionSheet({
      itemList: ['暂停计划', '完成计划'],
      success: ({ tapIndex }) => {
        switch (tapIndex) {
          case 0:
            this.props.model.stop()
            break
          case 1:
            this.props.model.finish()
            break
        }
      }
    })
  }

  deletePlan () {
    Taro.showModal({
      title: '确认删除计划？',
      content: '此操作不可恢复',
      success: (res) => {
        if (res.confirm) {
          this.planStore.deletePlan(this.props.model.id)
        }
      }
    })
  }

  planStore: PlanStoreType = useStore().planStore

  render () {
    const { type = 'default' } = this.props

    if (type === 'create') {
      return <View className='plan-card create' onTap={this.props.onTap}>
        <View className="content">
          <View className='head'>
            <View className='settings'>
              <View className='icon icon-plus-light' />
            </View>
          </View>
          <Text className='title'>创建任务</Text>
        </View>
      </View>
    }

    const { model } = this.props
    if (!model) return null

    const getStatus = () => {
      switch (model.status) {
        case 0:
          return Boolean(model.spent) ? model.formattedSpent : '未开始'
        case 1:
          return model.formattedSpent
        case 2:
          return '已结束'
        case 3:
          return '已过期'
      }
    }
    
    const progress = Math.floor(model.spent / model.planned_time  * 1000) / 10

    return <View className={cx('plan-card', `color-${model.color_class}`, `status-${model.status}`)} onTap={this.props.onTap || (() => {})}>
      {
        model.status < 2 && <View className='progress' style={`width: ${progress}%;`} />
      }
      <View className='content'>
        <View className='head'>
          <Text className='time'>
            { getStatus() }
          </Text>
          <View className='settings' onTap={this.showMenu}>
              <View className='icon icon-ellipsis-light' />
          </View>
        </View>
        <Text className='title'>{model.title}</Text>
      </View>
    </View>
  }
}
