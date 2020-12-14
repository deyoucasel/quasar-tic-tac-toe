<template>
  <div class="WAL position-relative" :style="style" style="background: #0F2027;  /* fallback for old browsers */
background: -webkit-linear-gradient(to right, #2C5364, #203A43, #0F2027);  /* Chrome 10-25, Safari 5.1-6 */
background: linear-gradient(to right, #2C5364, #203A43, #0F2027); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
">
    <q-layout view="lHh Lpr lFf" class="WAL__layout shadow-3" container>
      <q-page-container class="bg-grey-2">
        <router-view />
      </q-page-container>
    </q-layout>
    <div class="cube"></div>
    <div class="cube"></div>
    <div class="cube"></div>
    <div class="cube"></div>
    <div class="cube"></div>
  </div>
</template>

<script>
export default {
  name: 'WhatsappLayout',

  data () {
    return {
      names: ['Tic Tac Toe', 'La Vieja', 'Tres en Raya', 'Ceros y Cruces', 'Triqui']
    }
  },

  computed: {
    currentConversation () {
      return this.conversations[this.currentConversationIndex]
    },

    style () {
      return {
        height: this.$q.screen.height + 'px'
      }
    }
  }
}
</script>
<style lang="sass">

.WAL
  width: 100%
  height: 100%
  padding-top: 20px
  padding-bottom: 20px

  &__layout
    margin: 0 auto
    z-index: 4000
    height: 100%
    width: 90%
    max-width: 950px
    border-radius: 5px

  &__field.q-field--outlined .q-field__control:before
    border: none

  .q-drawer--standard
    .WAL__drawer-close
      display: none

@media (max-width: 850px)
  .WAL
    padding: 0
    &__layout
      width: 100%
      border-radius: 0

@media (min-width: 691px)
  .WAL
    &__drawer-open
      display: none

.conversation__summary
  margin-top: 4px

.conversation__more
  margin-top: 0!important
  font-size: 1.4rem
</style>
