let _debounceTimer = null

export const debounce: (callback: () => any, time?: number) => void = (callback, time = 2000) => {
  clearTimeout(_debounceTimer)
  _debounceTimer = setTimeout(() => {
    callback()
  }, time)
}
