import config from './config'
import Firebase from 'firebase'
export const firebase = Firebase.initializeApp(config)
export const db = firebase.database()
export const firestore = firebase.firestore()
const gamee = firestore.collection('partidas')
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
  currentUser () {
    return firebase.auth().currentUser
  }

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

  getCollection (name) {
    return db.ref('/' + name)
  }

  checkSession (name) {
    setName(name)
  }

  checkAvailability (idGame) {
    const user = firebase.auth().currentUser
    console.log('use', user)
    return gamee.doc(idGame).collection('players').get().then((resp) => {
      var players = []
      var owner = false
      resp.forEach(function (doc) {
        const temp = doc.data()
        console.log('temp.uid', temp.uid)
        // eslint-disable-next-line eqeqeq
        if (user != null && temp.uid == user.uid) {
          owner = true
        }
        players.push(doc.data())
      })
      console.log('players', players)
      if (players.length < 2) {
        return { owner, number: false }
      } else {
        return { owner, number: true }
      }
    })
  }

  newGame (creator, player) {
    console.log('creating game', creator)
    return gamee.add(creator).then((resp) => {
      gamee.doc(resp.id).collection('players').doc(creator.author).set(player)
      const id = resp.id
      console.log('gamee', id)
      return id
    })
  }

  joinGame (idCreator, player) {
    return gamee.doc(idCreator).collection('players').doc(player.uid).set(player).then((resp) => {
      const id = idCreator
      console.log('gamee', id)
      return id
    })
  }
}

export default new ApiService()
