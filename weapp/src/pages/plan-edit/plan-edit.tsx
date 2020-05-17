import Taro from '@tarojs/taro'
import { View, Text, Input, Picker } from '@tarojs/components'
import cx from 'classnames'
import { observer } from '@tarojs/mobx'
import { useStore } from '@/store/hooks'

import './plan-edit.scss'

interface PlanEdit {
  state: {
    title: string
    plannedTime: number
    remark: string
  }
}

@observer
export default class PlanEdit extends Taro.Component {
  config: Taro.Config = {
    navigationBarTitleText: '任务管理'
  }

  state = {
    title: '',
    plannedTime: 0,
    remark: '',
    errors: []
  }

  planStore: PlanStoreType = useStore().planStore

  componentDidMount () {
    const { id = 'new' } = this.$router.params
    if (id === 'new') {
      Taro.setNavigationBarTitle({ title: '创建任务' })
    }
  }

  changePlannedTime (e) {
    this.setState({
      plannedTime: (parseInt(e.detail.value) + 1) * 60 * 1000,
      errors: this.state.errors.filter(code => code !== 1)
    })
  }

  validate (value, errCode) {
    if (!value) {
      const errors = this.state.errors.includes(errCode)
        ? this.state.errors
        : this.state.errors.concat([errCode])
      this.setState({
        errors
      })
      return false
    }
    return true
  }

  submit () {
    const { title, plannedTime, remark } = this.state

    if (this.validate(title, 0) && this.validate(plannedTime, 1)) {
      this.planStore.addPlan({ title, plannedTime, remark })
      Taro.navigateBack({ delta: 1 })
    }
  }

  get timeplannedTime () {
    return this.state.plannedTime / 1000 / 60 + '分钟'
  }

  render () {
    return <View class='page-wrapper'>
      <View className='form-control'>
        <View className={cx('block', { 'error': this.state.errors.includes(0) })}>
          <Input
            placeholder='我计划...'
            placeholderStyle='color: #999;'
            value={this.state.title}
            onInput={e => this.setState({ title: e.detail.value })}
            onFocus={() => this.setState({ errors: this.state.errors.filter(code => code !== 0) })}
          />
        </View>
      </View>
      <View className='form-control'>
        <Picker
          mode='selector'
          range={[...Array(119)].map((_, idx) => idx + 1 + '分钟')}
          onChange={this.changePlannedTime}
        >
          <View className={cx('block', { 'error': this.state.errors.includes(1) })}>
            {
              this.state.plannedTime
                ? <Text className='value'>{this.timeplannedTime}</Text>
                : <Text>将花费...</Text>
            }
          </View>
        </Picker>
      </View>
      <View className='form-control'>
        <View className='block'>
          <Input
            placeholder='PS：...'
            placeholderStyle='color: #999;'
            value={this.state.remark}
            onInput={e => this.setState({ remark: e.detail.value })}
          />
        </View>
      </View>
      <View className='form-control'>
        <View className='submit' onTap={this.submit}>
          <Text>完成</Text>
        </View>
      </View>
    </View>
  }
}
