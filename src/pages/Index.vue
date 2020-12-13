<template>
  <q-page padding>
    <!-- content -->
    <div class="q-col-gutter-md">
      <br />
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-6">
          <q-card :class="'my-card bg-' + random_colors() + ' text-white'">
            <q-card-section>
              <div class="text-h6">Singleplayer</div>
              <div class="text-subtitle2">
                Crea una partida y envia la invitacion a un amigo para jugar
              </div>
            </q-card-section>
            <q-card-section></q-card-section>
            <q-separator dark />
            <q-card-actions>
              <q-btn to="/new" flat>Nueva Partida</q-btn>
            </q-card-actions>
          </q-card>
        </div>
        <div class="col-12 col-sm-6 col-md-6">
          <q-card :class="'my-card bg-' + random_colors() + ' text-white'">
            <q-card-section>
              <div class="text-h6">Multiplayer</div>
              <div class="text-subtitle2">
                Accede a una partida a traves de un id proporcionado por tus
                amigos
              </div>
            </q-card-section>
            <q-separator dark />
            <q-card-actions>
              <q-btn to="/join" flat>Unirse a una partida</q-btn>
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  data () {
    return {
      colors: [
        'deep-orange',
        'red',
        'purple',
        'pink',
        'deep-purple',
        'light-blue',
        'teal'
      ]
    }
  },
  methods: {
    random_colors () {
      const index = Math.floor(Math.random() * this.colors.length)
      const color = '' + this.colors[index]
      console.log('index:' + index, 'color: ' + color)
      return color
    }
  }
}
</script>
