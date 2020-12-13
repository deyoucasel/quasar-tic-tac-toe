<template>
  <q-page padding>
    <!-- content -->
    <div class="q-col-gutter-md">
      <q-dialog
        v-model="finished"
        persistent
        transition-show="flip-down"
        transition-hide="flip-up"
      >
        <q-card class="bg-teal text-white">
          <q-card-section>

            <div class="text-h6">El juego ha finalizado</div>
          </q-card-section>

          <q-card-section class="q-pt-none"> Que desea hacer? </q-card-section>

          <q-card-actions align="right" class="bg-white">
            <q-btn
              v-close-popup
              flat
              color="black"
              label="Reiniciar la Partida"
              @click="resetAll()"
            />
            <q-btn v-close-popup flat color="primary" to="/" label="Ir al menu" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <div class="row q-col-gutter-md">
        <div
          class="col-12 col-sm-6 col-md-6"
          v-for="player in players"
          :key="player.id"
        >
          <div class="q-pa-md items-start q-gutter-md">
            <q-card :class="(turno == player.uid) ? 'bg-positive text-white':''">
              <q-card-section>
                <div class="text-h6">{{ player.name }} {{(turno == player.uid) ? '(Tu turno)':''}}</div>
                <div class="text-subtitle2">Jugador {{ player.player }} ({{(player.player == 1) ? 'X':'Y'}})</div>
              </q-card-section>
              <q-card-actions v-if="players && players.length < 2">
                <q-btn flat icon="share" label="Compartir Link" @click="shareLink()"></q-btn>
                <q-btn flat icon="content_copy" label="Copiar Link" @click="copyLink()"></q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-md-5" v-if="players && players.length < 2">
          <br>
          <div class="text-h6">Ayuda</div>
          <div class="text-subtitle2">Para jugar necestas enviar la invitacion a la sala a tus amigos, puedes copiar el link o enviarselo a tus amigos con el boton compartir</div>
        </div>
      </div>
      <div class="row">
        <div class="col col-xs-1"></div>
        <div class="col-6 col-xs-12">
            <div class="row">
                       <div
            class="col-4"
            v-for="(square, idx) in square.data"
            :key="square.id"
            @click="setMove(square.player, idx)"
          >
            <div :class="'square ' + square.class">
              <template v-if="square.player == 1"> X </template>
              <template v-else-if="square.player == 2"> O </template>
            </div>
          </div>
            </div>
        </div>
        <div class="col  col-xs-1"></div>
      </div>
    </div>
  </q-page>
</template>

<script>
import services, { firebase } from '../_services'
import { copyToClipboard } from 'quasar'
import { mapMutations, mapState, mapActions, mapGetters } from 'vuex'
export default {
  created () {
    this.getStatusUser()
    this.db
      .collection('partidas')
      .doc(this.$route.params.id)
      .onSnapshot((doc) => {
        // console.log('Current data: ', doc.data())
        this.partida = doc.data()
        this.finished = this.partida.finished
        this.turno = this.partida.turno
        this.owner = this.partida.author
      })
    this.db
      .collection('partidas')
      .doc(this.$route.params.id)
      .collection('players')
      .onSnapshot((querySnapshot) => {
        var players = []
        querySnapshot.forEach(function (doc) {
          players.push(doc.data())
        })
        this.players = players
        this.generateSquare()
        this.findWinner()
      })
  },
  name: 'Play',
  props: ['id'],
  data () {
    return {
      square: { slot: 9, data: null },
      db: firebase.firestore(),
      partida: null,
      owner: null,
      finished: false,
      players: null,
      turno: null,
      counter: null,
      pattenToWin: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
      ]
    }
  },
  computed: {
    ...mapState('game', ['user'])
  },
  methods: {
    ...mapGetters('game', ['getUser']),
    ...mapActions('game', ['getStatusUser']),
    ...mapMutations('game', ['setUser']),
    copyLink () {
      copyToClipboard('http://' + window.location.host + '/#/join/' + this.$route.params.id)
    },
    shareLink () {
      if (navigator.share) {
        navigator.share({
          url: window.location.host + '/#/join/' + this.$route.params.id,
          text: 'ID manual para ingresar ' + this.$route.params.id,
          title: 'Invitacion para jugar Tic Tac Toe'
        }).then(() => console.log('Successful share'))
          .catch(error => console.log('Error sharing:', error))
      }
    },
    resetAll () {
      let userId = null
      for (const player of this.players) {
        services.resetPositions(this.$route.params.id, player.uid)
        userId = player.uid
      }
      services.resetGame(this.$route.params.id, userId)
    },
    generateSquare () {
      this.counter = 0
      // eslint-disable-next-line eqeqeq
      if (this.players != null) {
        const list = []
        for (var i = 0; i < this.square.slot; i++) {
          const item = {
            position: i,
            player: null,
            clase: null
          }
          if (this.players[0].positions.includes(i)) {
            item.player = this.players[0].player
          } else if (this.players.length > 1 && this.players[1].positions.includes(i)) {
            item.player = this.players[1].player
          } else {
            this.counter++
          }
          list.push(item)
        }
        this.square.data = list
        // eslint-disable-next-line eqeqeq
        if (this.counter < 1) {
          console.log(this.counter)
          services.setWinner(this.$route.params.id, null)
        }
      }
    },
    setMove (player, idx) {
      // eslint-disable-next-line eqeqeq
      if (player == null && this.players && this.players.length == 2 && !this.partida.finished) {
        const user = this.getUser()
        console.log(this.partida.turno, user.uid)
        // eslint-disable-next-line eqeqeq
        if (user.uid == this.partida.turno) {
          let positions = []
          for (player of this.players) {
            // eslint-disable-next-line eqeqeq
            if (player.uid == user.uid) {
              positions = player.positions
            // eslint-disable-next-line eqeqeq
            } else {
              this.turno = player.uid
            }
          }
          console.log('idx', idx)
          services.setMove(this.$route.params.id, idx, positions, user.uid)
          services.setTurno(this.$route.params.id, this.turno)
        } else {
          alert('No es tu turno')
        }
      } else {
        alert('Espera que un usuario ingrese a la sala')
      }
    },
    findWinner () {
      this.players.forEach((play) => {
        this.pattenToWin.forEach((item) => {
          if (this.compare(item, play.positions)) {
            console.log('square.data', this.square)
            for (var i = 0; i < item.length; i++) {
              this.square.data[item[i]].class = 'bg-positive'
            }
            services.setWinner(this.$route.params.id, play.uid)
          }
        })
      })
    },
    compare (source, compare) {
      const containsAll = (needles, haystack) =>
        needles.every(Set.prototype.has, new Set(haystack))
      return containsAll(source, compare)
    }
  }
}
</script>
<style lang="css">
.board {
  margin: 0 auto;
  color: #fff;
}
.square {
  min-height: 90px;
  border-radius: 14px;
  font-family: Helvetica;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  font-size: 4em;
  background: #b3b3b3;
  margin: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
