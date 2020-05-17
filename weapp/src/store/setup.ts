import { types, Instance } from 'mobx-state-tree'
import { PlanStore } from './plan-store'
import { UserStore } from './user'
import { setStoreRef } from './hooks'

const RootStore = types.model({
  planStore: types.optional(PlanStore, {}),
  userStore: types.optional(UserStore, {})
})

type RootStoreType = Instance<typeof RootStore>

export const setupRootStore: () => RootStoreType = () => {
  const store = RootStore.create({
    planStore: PlanStore.create({}),
    userStore: UserStore.create({})
  })
  setStoreRef(store)
  return store
}
