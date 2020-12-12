<template>
  <q-page padding>
    inicializando partida
    <session :id="gameId" :invited="invited"/>
  </q-page>
</template>

<script>
import Session from 'components/session'
export default {
  components: {
    Session
  },
  data () {
    return {
      gameId: this.$route.params.id,
      invited: false
    }
  },
  created () {
    if (this.$route.params.id) {
      this.invited = true
    }
  }
}
</script>
