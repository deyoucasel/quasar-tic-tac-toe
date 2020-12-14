<template>
   <q-page padding>
    <!-- content -->
    <div class="q-col-gutter-md">
      <br />
      <template v-if="show">
      <session :id="gameId"/>
      </template>
    </div>
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
      show: true,
      gameId: this.$route.params.id,
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
        console.log('status', r)
        // eslint-disable-next-line eqeqeq
        if (r.owner == true) {
          this.$router.push({ path: '/play/' + this.$route.params.id })
        // eslint-disable-next-line eqeqeq
        } else if (r.number == true) {
          console.log('esta lleno')
          console.log('expired')
          this.$router.push({ path: '/expired' })
        } else {
          this.show = true
        }
      })
      this.invited = true
    }
  }
}
</script>
