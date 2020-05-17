import { getRoot } from 'mobx-state-tree'

export const withRootStore = (self) => ({
  views: {
    get rootStore () {
      return getRoot(self)
    }
  }
})
