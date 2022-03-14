module.exports = function (injectedStore, injectedCache) {
  let store = injectedStore
  let cache = injectedCache
  if (!store) store = require('@store/dummy')
  if (!cache) cache = require('@store/dummy')

  async function test() {
    return 'Testing the API! is fine!'
  }

  return {
    test
  }
}
