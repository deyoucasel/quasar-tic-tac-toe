// import state from './state'
const state = {
  playing: false
}

import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

export const game = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
