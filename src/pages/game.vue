<template>
  <q-page padding>
    <template v-if="show">
      inicializando partida {{playing}}
    <session :id="gameId" :invited="invited"/>
    </template>
  </q-page>
</template>

<script>
import services from '../_services'
import Session from 'components/session'
import { mapState } from 'vuex'
export default {
  components: {
    Session
  },
  data () {
    return {
      show: false,
      gameId: this.$route.params.id,
      invited: false,
      user: null
    }
  },
  computed: {
    ...mapState('game', ['playing'])
  },
  created () {
    if (this.$route.params.id) {
      this.user = services.currentUser()
      console.log('currentUser', this.user)
      services.checkAvailability(this.$route.params.id).then((r) => {
        console.log('resp', r)
        // eslint-disable-next-line eqeqeq
        if (r.owner == true) {
          this.$router.push({ path: '/play/' + this.$route.params.id })
        } else if (r.number === false) {
          console.log('esta lleno')
          this.$router.push({ path: '/expired' })
        // eslint-disable-next-line eqeqeq
        } else {
          this.show = true
        }
      })
      this.invited = true
    }
  }
}
</script>
