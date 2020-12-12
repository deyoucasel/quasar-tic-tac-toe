<template>
  <div>Session
    <input type="text" v-if="id" v-model="gameId" placeholder="gameid" readonly>
    <input type="text" v-model="name" placeholder="nombre">
    <button @click="createSession">Unirse a partida</button>
  </div>
</template>

<script>
import services from '../_services'
import game from '../_services/game'
export default {
  name: 'Session',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      gameId: this.id,
      name: ''
    }
  },
  methods: {
    createSession () {
      services.createSession(this.name).then((resp) => {
        console.log('final', resp.uid)
        const user = {
          author: resp.uid,
          player1: {
            uid: resp.uid,
            name: resp.displayName,
            positions: []
          },
          player2: {
            uid: null,
            name: '',
            positions: []
          },
          finished: false,
          winner: ''
        }
        console.log('users', user)

        game.newGame(user)
      })
    }
  },
  created () {
    if (this.id === '') {

    }
  }
}
</script>
