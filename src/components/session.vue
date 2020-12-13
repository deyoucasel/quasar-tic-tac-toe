<template>
  <div>
    <h5>{{invited ? 'Unirse a la partida' : 'Crear partida'}}</h5>
    <div class="row q-col-gutter-md"  >
      <div v-if="invited" class="col-12 col-sm-6 col-md-6">
        <q-input outlined v-model="gameId" label="Id de partida" />
      </div>
      <div class="col-12 col-sm-6 col-md-6">
        <q-input outlined v-model="name" label="Tu nombre" />
      </div>
      <div class="col-12 col-sm-6 col-md-6">
        <q-btn
          @click="createSession"
          color="primary"
          class="full-width"
          :disabled="(name == '') ? true: false"
          :label="invited ? 'Unirse a la partida' : 'Crear partida'"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from 'vuex'
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
    ...mapGetters('game', ['getUser']),
    ...mapMutations('game', ['starPlay']),
    ...mapActions('game', ['getStatusUser']),
    createSession () {
      services.createSession(this.name).then((resp) => {
        // this.getStatusUser(this.name)

        console.log('mutation', resp)
        console.log(this.$route.path)
        if (this.$route.path === '/new') {
          const creator = {
            author: resp.uid,
            finished: false,
            winner: null,
            turno: resp.uid
          }
          this.getStatusUser(this.name)
          console.log('finale', resp)
          const player = {
            uid: resp.uid,
            player: 1,
            name: this.name,
            positions: []
          }
          console.log('users', player)
          services.newGame(creator, player).then((id) => {
            console.log('idGame', id)
            // this.starPlay()
            this.$router.push({ path: 'play/' + id })
          })
        } else {
          const idGame = this.gameId
          const player = {
            uid: resp.uid,
            player: 2,
            name: this.name,
            positions: []
          }
          console.log('idGame', idGame)
          services.joinGame(idGame, player).then((id) => {
            console.log('idGame', id)
            // this.starPlay()
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
