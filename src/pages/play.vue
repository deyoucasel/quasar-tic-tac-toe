<template>
  <div>Pantalla de juego
    <div class="">
      {{partida}}
      <pre>{{players}}</pre>
    </div>
  </div>
</template>

<script>
import { firebase } from '../_services'
export default {
  mounted () {
    this.db.collection('partidas').doc(this.$route.params.id).onSnapshot((doc) => {
      console.log('Current data: ', doc.data())
      this.partida = doc.data()
    })
    this.db.collection('partidas').doc(this.$route.params.id).collection('players').onSnapshot((querySnapshot) => {
      var players = []
      querySnapshot.forEach(function (doc) {
        players.push(doc.data())
      })
      this.players = players
    })
  },
  name: 'Play',
  props: ['id'],
  data () {
    return {
      db: firebase.firestore(),
      partida: null,
      players: null
    }
  }
}
</script>
