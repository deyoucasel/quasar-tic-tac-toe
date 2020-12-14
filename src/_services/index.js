import config from './config'
import Firebase from 'firebase'
export const firebase = Firebase.initializeApp(config)
export const db = firebase.database()
export const firestore = firebase.firestore()
const gamee = firestore.collection('partidas')
/**
 * establece el nombre al usuario logueado
 *  @param {String} name Contiene el nombre que asigno el jugador a su usuario
 */
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
  /**
   * retorna la sesion actual (si existe)
   */
  currentUser () {
    return firebase.auth().currentUser
  }

  /**
 * asigna el turno al usuario correspondiente al moento de terminar el turno
 * @param {String} idGame Contiene el id de la coleccion de la partida
 * @param {String} idUser Contiene el id de del usuario que va a jugar
 */
  setTurno (idGame, idUser) {
    return gamee.doc(idGame).update({
      turno: idUser
    })
  }

  /**
 * Establece el movimiento del jugador una vez finalizadas las validaciones
 * @param {String} idGame Contiene el id de la coleccion de la partida
 * @param {Integer} newPosition Contiene la nueva posicion seleccionado por el jugador
 * @param {Array} positions Contiene la lista de posiciones ya asignadas
 * @param {String} user Contiene el id de del usuario que esta moviendo
 */
  setMove (idGame, newPosition, positions, user) {
    positions = (positions != null) ? positions : []
    positions.push(newPosition)
    console.log('tested', idGame, newPosition)
    console.log('posi', positions, user)
    return gamee.doc(idGame).collection('players').doc(user).update({
      positions
    })
  }

  /**
 * permite reiniciar una partida ya existente para no crear una partida nueva
 * @param {String} idGame Contiene el id de la coleccion de la partida
 * @param {String} idUser Contiene el id de del usuario que va a jugar
 */
  resetGame (idGame, idUser) {
    return gamee.doc(idGame).update({
      finished: false,
      winner: null,
      turno: idUser
    })
  }

  /**
 * permite reiniciar las pocisiones de cara jugador de una partida previamente reiniciada
 * @param {String} idGame Contiene el id de la coleccion de la partida
 * @param {String} idUser Contiene el id de del usuario que va a jugar
 */
  resetPositions (idGame, idUser) {
    return gamee.doc(idGame).collection('players').doc(idUser).update({
      positions: []
    })
  }

  /**
 * Guarda el estado del ganador en firestore una vez determinado si cumple con los patrones de victoria
 * @param {String} idGame Contiene el id de la coleccion de la partida
 * @param {String} idWinner Contiene el id de del usuario que gano
 */
  setWinner (idGame, idWinner) {
    return gamee.doc(idGame).update({
      finished: true,
      winner: idWinner
    })
  }

  /**
 * Crea una sesion de forma anonima para poder jugar
 * @param {String} name Contiene el nombre que el jugador asigno a su usuario
 */
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
  /**
 * Crea una sesion de forma anonima para poder jugar
 * @param {String} name Contiene el nombre que el jugador asigno a su usuario
 */

  checkSession (name) {
    setName(name)
  }

  /**
 * @param {String} idGame Contiene el id de la coleccion de la partida
 */
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

  /**
 * Crea en base de datos una nueva partida
* @param {String} creador Contiene el id de la coleccion de la partida
 *@param {String} idGame Contiene el id de la coleccion de la partida
 * */
  newGame (creator, player) {
    return gamee.add(creator).then((resp) => {
      console.log('insertando colleccion')
      gamee.doc(resp.id).collection('players').doc(creator.author).set(player)
      const id = resp.id
      console.log('gamee', id)
      return id
    })
  }

  /**
 * Permite unirse a una partida ya existente mediante
* @param {String} idCreator Contiene el id de la coleccion que contiene la partida
 *@param {String} player Contiene un objeto del jugador que se une a la partida
 * */
  joinGame (idCreator, player) {
    return gamee.doc(idCreator).collection('players').doc(player.uid).set(player).then((resp) => {
      const id = idCreator
      console.log('gamee', id)
      return id
    })
  }
}

export default new ApiService()
