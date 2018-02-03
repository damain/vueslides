var p = require('./slides.json')
var Vue = require('vue')

var efs = require('fs');

function writefile() {
  var obj = {
    table: []
 }
 obj.table.push({id: 1, square:2});
 var json = JSON.stringify(obj);
 var fs = require('fs');
  fs.writeFile('myjsonfile.json', json, 'utf8', callback);
}



var wh = 0
var ww = 0

Vue.component('slide',{
  template:`
  <section class="slide">
    <div class="headerContainer">
      <header class="title">{{item.title}}</header>
      <header class="subtitle" v-if="item.subtitle">{{item.subtitle}}</header>
    </div>
    <div class="contentContainer">
      <div class="content">{{item.content}}</div>
      <div class="imgContainer">
        <img :src="item.image"/>
      </div>
    </div>
  </section>
  `,
  data(){
    return{
      isLoaded: false
    }
  },
  mounted(){
    //console.log(this)
    var that = this
    locateSlide()
      wh = window.innerHeight
      ww = window.innerWidth
      window.addEventListener('resize', function(e){
        //console.log(window.innerWidth)
        wh = window.innerHeight
        ww = window.innerWidth
        locateSlide()
    })
    function locateSlide(){
      that.$el.style.top = ( wh * that.index ) * -1
      that.$el.style.left = ( ww * that.index )
    }

  },
  props:['item', 'type', 'index'],
})


app = new Vue({
  el:"#app",
  data(){
    return{
      index: 0,
      slides: p.slides
    }
  },
  mounted(){
    var that = this
    this.$refs.slideContainer.style.height = wh
    window.addEventListener('keyup',function(e){
      //console.log(e.which)
      if(e.which == 39){
        that.nextSlide()
      }else if(e.which == 37){
        that.previousSlide()
      }
    })
  },
  computed:{
    currentSlide : function () {
      return p.slides[this.index]
    }
  },
  methods:{
    nextSlide: function(){
      if(this.index < p.slides.length-1 ){
        this.index++
        console.log("switching to slide: "+ (this.index+1))
        scrollTo(document.body,(this.index*ww),750)
      }else{
        console.log("end of slides")
      
      } 
    } ,
    previousSlide: function(){
      if(this.index > 0  ){
        this.index--
        console.log("switching to slide: "+ (this.index+1))
        scrollTo(document.body,(this.index*ww),500)
      }else{
        console.log("At the start")
      
      } 
    },
    writefile: function () {
      var obj = {
        table: []
      }
      obj.table.push({id: 1, square:2});
      var json = JSON.stringify(obj);
      var fs = require('fs');
      console.log(fs)
      //fs.writeFile('myjsonfile.json', json, 'utf8', callback);

      function callback(e){
        console.log(e)
      }
    } 
  }
})

   
function scrollTo(element, to, duration) {
   var start = element.scrollLeft,
       change = to - start,
       currentTime = 0,
       increment = 20;
       
   var animateScroll = function(){        
       currentTime += increment;
       var val = Math.easeInOutQuad(currentTime, start, change, duration);
       element.scrollLeft = val;
       if(currentTime < duration) {
           setTimeout(animateScroll, increment);
       }
   };
   animateScroll();
}

//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = function (t, b, c, d) {
 t /= d/2;
 if (t < 1) return c/2*t*t + b;
 t--;
 return -c/2 * (t*(t-2) - 1) + b;
};