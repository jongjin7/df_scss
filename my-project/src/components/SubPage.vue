<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>중간제목입니다.</h2>
  </div>
</template>

<script>
export default {
  name: 'SubPage',
  data () {
    return {
      msg: '서브페이지 입니다.'
    }
  }
}
</script>
