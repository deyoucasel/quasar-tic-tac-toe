import { firebase } from '../../_services'
export function getStatusUser ({ commit }, name) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      console.log('la session existe')
      commit('setUser', user)
    } else {
      console.log('creado sesion')
      firebase.auth().signInAnonymously()
      const user = firebase.auth().currentUser
      if (user) {
        user.updateProfile({
          displayName: name
        })
      }
      commit('setUser', user)
    }
  })
}
