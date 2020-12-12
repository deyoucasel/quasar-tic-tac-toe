import config from './config'
import Firebase from 'firebase'
import 'firebase/firestore'

const firebase = Firebase.initializeApp(config)
// const auth = firebase.auth()
function setName (name) {
  const user = firebase.auth().currentUser
  if (user) {
    user.updateProfile({
      displayName: name
    })
  }
  console.log('user', user)
  return firebase.auth().currentUser
}
class ApiService {
  createSession (name) {
    return firebase.auth().signInAnonymously()
      .then(async (resp) => {
        return await setName(name)
      })
      .catch((error) => {
        console.log(error)
      // ...
      })
  }

  checkSession (name) {
    setName(name)
  }
}

export default new ApiService()
