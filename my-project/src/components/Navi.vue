<template>
  <div>
    <div class='left'>
      <h1 id='logo'>
        <div><span>Site Logo</span></div>
      </h1>
      <ul>
        <li><a href="">- 메인 페이지</a></li>
        <li><a href="">- 서브 페이지</a></li>
        <li><a href="">- 다른 페이지</a></li>
        <li><a href="">- 또다른 페이지</a></li>
      </ul>
      <div id='company'>
        <div>Welcomt to DF</div>
        <div>@copyright jongjin 2018</div>
      </div>
    </div>
    <button id='left_btn' @click='toggle'><img  src='../assets/logo.png'></button>
  </div>
</template>

<script>
export default {
  name: 'Navi',
  data () {
    return {
      toggle: this.enter
    }
  },
  methods:{
    enter: function (el, done) {
      console.log('enter');
      this.toggle = this.leave
      var left = (250 - (parseInt($('#left_btn').css('width')) / 2)) + 'px'
      $('.left').stop().animate({left: '-250px'}, 800)
      $('#left_btn').css({transform: 'rotate(-90deg)'})
    },
    leave: function (el, done) {
      console.log('leave');
      this.toggle = this.enter
      var left = (0 - (parseInt($('#left_btn').css('width')) / 2)) + 'px'
      $('.left').stop().animate({left: '0'}, 800)
      $('#left_btn').css({transform: 'rotate(90deg)'})
    },
    resize: function () {
      $(window).resize(function () {
        var height = (window.innerHeight / 2) + 'px'
        $('#left_btn').css({'top': height})
      })
    }
  },
  created(){
    this.resize();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #logo{

  }
  #logo span{
    display: block;
    font-size: 20px; line-height:2;
    font-weight: bold;
    background: black;
    color:#fff;
  }
  img{
    display: block;
    width:100%;

  }
  a{color:lightgoldenrodyellow; text-decoration:none;}
  a:hover{color:rgb(255,100,0);}
  .left{
    position:fixed;
    top:0px;
    left:0px;
    width:250px;
    height:1000px;
    background: rgba(0,0,0,0.85);
    padding:40px 0;
    overflow: hidden
  }
  .left ul {padding: 0 30px;
    text-align: left;}
  .left ul li { font-size:25px; padding:10px 0; list-style:none;}
  .left ul li#company {font-size:12px; margin-top:150px; color:#000; }
  #left_btn {position:fixed; top:495px; transform:rotate(90deg); transition:transform 1s; padding:0; left:0;  cursor:pointer; border:1px solid red;}
  #left_btn img{ width:40px; }
</style>
