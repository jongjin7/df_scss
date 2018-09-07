<template>
  <div class="hello">
    <!--<component-navi></component-navi>-->
    <navi></navi>
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
import Navi from './Navi.vue'

export default {
  name: 'Main',
  data () {
    return {
      msg: '메인페이지',
      title: ''
    }
  },
  components: {
    navi:Navi,
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
a {
  color: #42b983;
}
</style>
