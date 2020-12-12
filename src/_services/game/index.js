import config from '../config'
import Firebase from 'firebase'

const firebase = Firebase.initializeApp(config)
const db = firebase.ref('/partidas')
class GameDataService {
  getAll () {
    return db
  }

  newGame (data) {
    console.log('creating game', data)
    return db.push(data)
  }
}

export default new GameDataService()
