<template>
  <div>
    <h5>Crear Partida</h5>
    id:{{
      id
    }}
    <br>
    sg:{{showGameId
    }}<br>
    store:
    {{$store.state.game.playing}}
    <input type="text" v-if="invited" v-model="gameId" placeholder="gameid" readonly>
    <input type="text" v-model="name" placeholder="nombre">
    <button @click="createSession">{{ (invited) ? 'Unirse a la partida' : 'Crear partida'}}</button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import services from '../_services'
export default {
  name: 'Session',
  props: {
    id: {
      type: String,
      default: ''
    },
    invited: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      gameId: this.id,
      name: '',
      showGameId: false
    }
  },
  methods: {
    ...mapMutations('game', ['starPlay']),
    createSession () {
      services.createSession(this.name).then((resp) => {
        console.log('final', resp.uid)
        console.log(this.$route.path)
        if (this.$route.path === '/new') {
          const creator = {
            author: resp.uid,
            finished: false,
            winner: null
          }
          const player = {
            uid: resp.uid,
            player: 1,
            name: resp.displayName,
            positions: []
          }
          console.log('users', creator)
          services.newGame(creator, player).then((id) => {
            console.log('idGame', id)
            this.starPlay()
            this.$router.push({ path: 'play/' + id })
          })
        } else {
          const idGame = this.gameId
          const player = {
            uid: resp.uid,
            player: 2,
            name: resp.displayName,
            positions: []
          }
          console.log('idGame', idGame)
          services.joinGame(idGame, player).then((id) => {
            console.log('idGame', id)
            this.starPlay()
            this.$router.push({ path: '/play/' + id })
          })
        }
      })
    }
  },
  created () {
    // eslint-disable-next-line eqeqeq
    if (this.id == '' && this.$route.path === '/join') {
      this.showGameId = true
    }
  }
}
</script>
