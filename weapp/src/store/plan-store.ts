import { types, flow, Instance, onPatch, getRoot } from 'mobx-state-tree'
import Taro from '@tarojs/taro'
import { toJS } from 'mobx'
import uniqid from 'uniqid'
import day from 'dayjs'
import Api from '@/apis/plan'
import { debounce } from '@/utils/tools'
import { withRootStore } from './with-root-store'

const colors = ['yellow', 'green', 'orange', 'red']

let timer = null

const STATUS_CODE = {
  PENDING: 0,
  DOING: 1,
  FINISHED: 2,
  EXPIRE: 3
}

export const PlanModel = types.model('Plan')
  .props({
    id: types.identifier,
    title: types.string,
    remark: types.maybeNull(types.string),
    planned_time: types.number,
    color_class: types.union(...colors.map(types.literal)),
    anchor_time: types.maybeNull(types.number),
    start_time: types.maybeNull(types.number),
    end_time: types.maybeNull(types.number),
    spent: types.optional(types.number, 0),
    status: types.optional(types.integer, STATUS_CODE.PENDING) // 计划状态: 0待执行 1进行中 2已结束 3已过期
  })
  .views(self => ({
    get formattedSpent () {
      return day(self.spent).format('mm:ss')
    }
  }))
  .actions(self => ({
    updateSpent () {
      self.spent = Date.now() - self.anchor_time
    },
    runInterval () {
      timer = setInterval(() => self.updateSpent(), 1000)
    },
    killInterval () {
      clearInterval(timer)
    }
    start () {
      self.status = STATUS_CODE.DOING
      let current = Date.now()
      if (self.start_time) {
        // 之前暂停过
        self.anchor_time = current - self.spent
      } else {
        self.start_time = current
        self.anchor_time = current
      }
      self.runInterval()
    },
    stop () {
      clearInterval(timer)
      timer = null
      self.status = STATUS_CODE.PENDING
    },
    finish () {
      clearInterval(timer)
      timer = null
      self.status = STATUS_CODE.FINISHED
    }
  }))

export const PlanStore = types.model('PlanStore')
  .props({
    plans: types.array(PlanModel),
    date: types.optional(types.string, day().format('YYYY-MM-DD'))
  })
  .views(self => ({
    get doingPlan () {
      return self.plans.find(({ status }) => status === STATUS_CODE.DOING)
    }
  }))
  .extend(withRootStore)
  .actions(self => ({
    /**
     * 监听数据包变化
     */
    initPatchListener () {
      onPatch(self, patch => {
        if (/^\/plans/.test(patch.path)) {
          if (/\/spent$/.test(patch.path)) {
            return
          }
          debounce(self.uploadData, 2000)
        }
      })
    }
    /**
     * 创建计划
     * @param data { title, remark, spend }
     */
    addPlan (data) {
      const model = PlanModel.create({
        ...data,
        id: data.id || uniqid(),
        color_class: data.color_class || colors[Math.floor(Math.random() * colors.length)],
        planned_time: parseInt(data.planned_time),
        start_time: parseInt(data.start_time),
        end_time: parseInt(data.end_time),
        anchor_time: parseInt(data.anchor_time),
        spent: parseInt(data.spent)
      })
      if (model.status === 1) {
        model.updateSpent(Date.now() - model.anchor_time)
        model.runInterval()
      }
      self.plans.push(model)
    },
    /**
     * 删除计划
     * @param id 计划id
     */
    deletePlan (id) {
      self.plans = self.plans.filter(plan => plan.id !== id)
    },
    /**
     * 获取计划
     * @param id 计划id
     */
    getPlan (id) {
      return self.plans.find(plan => plan.id === id)
    },
    /**
     * 开始计划
     * @param id 计划id
     */
    startPlan (id) {
      if (self.doingPlan) {
        self.doingPlan.stop()
      }
      self.getPlan(id).start()
    },
    /**
     * 上传数据 localStorage/Server
     */
    uploadData: flow(function * () {
      const data = {
        plans: toJS(self.plans).map(item => ({ ...item, date: self.date })),
        last_updated: Date.now()
      }
      Taro.setStorage({
        key: self.date,
        data
      })
      // 同步至服务器
      Taro.showNavigationBarLoading()
      yield Api.update(data.plans)
      Taro.hideNavigationBarLoading()
    }),
    /**
     * 加载数据 localStorage/Server
     */
    initData: flow(function * () {
      const isLogin = Boolean(self.rootStore.userStore.uid)
      try {
        const localData = Taro.getStorageSync(self.date)
        const { data: serverData } = isLogin ? yield Api.getPlans({ date: self.date }) : { data: { plans: [] } }
        // 比对数据
        let data = localData.plans
        serverData.plans.forEach(item => {
          let localItem = data.find(child => child.id === item.id)
          if (localItem && localData.last_updated < item.update_time) {
            localItem = item
          }
          if (!localItem) {
            data.push(item)
          }
        })
        if (data) {
          data.forEach(self.addPlan)
        }
      } catch (err) {
        console.error(err)
      }
      self.initPatchListener()
      return true
    })
  }))

export type PlanModelType = Instance<typeof PlanModel>
export type PlanStoreType = Instance<typeof PlanStore>
