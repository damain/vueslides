var p = require('./slides.json') // holds the data for the slides
var Vue = require('vue')
//TODO: create config element that holds a list of presentations
//... these presentations will be required and pushed into a presentations object.
//... this will be used to create a list of selectable presentations that can be switched 
//... between by pressing the s key

//Declaring global variables
var wh = 0 //for window height
var ww = 0 // for window width

// Slide component to display a single slide
// <slide />
Vue.component('paragraphs', {
  template:`
  <div>
    <p v-for="para in paragraphs">
      {{para}}
    <p/>
  </div>
  `,
  props: ['text'],
  computed:{
    paragraphs: function () {
      return this.text.split('/n')
    }
  }
})
Vue.component('slide',{
  template:`
  <section class="slide" >
    <transition name="fade">
      <div v-if="blank" class="blank"></div>
    </transition>
    <transition name="fade">
      <div v-if="overview || showNumber" class="slideNumber" @click="emitIndex">{{index+1}}</div>
    </transition>
    
    <div class="headerContainer">
      <header class="title">{{item.title}}</header>
      <header class="subtitle" v-if="item.subtitle">{{item.subtitle}}</header>
    </div>
    <div class="contentContainer">
      <div v-if="item.content || item.list" class="content" :class="{half: item.image || item.pen || item.youtube}">
        <paragraphs v-if="item.content" :text="item.content"></paragraphs>
        <ul v-for="listItem in item.list">
          <li>{{listItem.li}}</li>
        </ul>
      </div>
      <div v-if="item.image || item.pen || item.youtube" class="imgContainer" ref="imageContainer" :class="{imageHalf: item.content || item.list }">
        <img v-if="item.image" :src="item.image"/>
        <p v-if="item.pen"  data-theme-id="0" :data-slug-hash="item.pen.hash" data-default-tab="html,result" :data-user="item.pen.user" data-embed-version="2" :data-pen-title="item.pen.title" data-preview="true" class="codepen">See the Pen <a :href="'https://codepen.io/'+item.pen.user+'/pen/'+item.pen.hash+'/'">{{item.pen.title}}</a> by Damain Joseph (<a :href="'https://codepen.io/'+item.pen.user">@{{item.pen.user}}</a>) on <a href="https://codepen.io">CodePen</a>.</p>
        <div class="videoWrapper"  v-if="item.youtube">
          <iframe :width="imgWidth" :height="imgHeight" :src="'https://www.youtube.com/embed/'+item.youtube+'?rel=0'" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        </div>
      </div>
    </div>
  </section>
  `,
  data(){
    return{
      isLoaded: false,
      imgHeight: '',
      imgWidth: ''
    }
  },
  mounted(){
    // console.log(this)
    var that = this
    if (this.$refs.imageContainer){
      console.log(this.$refs.imageContainer.clientHeight)
      this.imgHeight = this.$refs.imageContainer.clientHeight -85
      this.imgWidth = this.$refs.imageContainer.clientWidth
    }
    // this sets the slide into its horizontal position
    setTimeout(locateSlide, 500)

    // set the color of the slide
    this.$el.style.background = this.item.background

    // get window dimensions
    wh = window.innerHeight
    ww = window.innerWidth

    // gets new window dimensions on resizing the browser 
    // and recalculates the positoon of the sides
    window.addEventListener('resize', function(e){
      //console.log(window.innerWidth)
      wh = window.innerHeight
      ww = window.innerWidth
      locateSlide()
    })
    function locateSlide(){
      console.log('locating slide')
      // setting top and left of each slide to have them placed horizontally
      if(that.$refs.imageContainer ) {
        that.imgHeight = that.$refs.imageContainer.clientHeight -85
        that.imgWidth = that.$refs.imageContainer.clientWidth
      }
      that.$el.style.top = ( wh * that.index ) * -1
      that.$el.style.left = ( ww * that.index )
      that.$el.style.height = wh
      that.$el.style.width = ww
    }
  },
  props:['item', 'type', 'index', 'overview', 'showNumber', 'blank'],
  methods:{
    emitIndex: function (e){
      //emiting 'select-slide' when slide number clicked in overview mode
      this.$emit('select-slide', this.index)
    }
  },
  computed: {
    
  }
})


app = new Vue({
  el:"#app",
  data(){
    return{
      index: 0, // index of the current slide
      resizeId: '', //used to hold a setTimeout when resizing the window to refocus on the current slize after resize
      showNumber: false, // this is toggled to enable the slide number to be displayed
      blank: false, // toggle this to show a blank slide
      slides: p.slides, //holds the slides array
      transitionTime: 500, // holds the duration of transitions
      overview: false, // used to activate overview class to scale the view so all screens can be viewed
      goto: {status:false, slide: 0} // model for the goto form
    }
  },
  mounted(){
    // to maintain the "this" scope in inner functions
    var that = this
    // setting the height of the slide container to the height of the window
    this.$refs.slideContainer.style.height = wh
    // disabling scroll so that users must use the controls to navigate 
    disableScroll()
    // setting the index acording to the placement of the current slide being displayed
    // valuable to solve bug on reloading the screen
    this.index = Math.ceil((window.scrollX + window.innerWidth) / window.innerWidth)-1
    
    //assign Full screen button to variable
    var fs = document.getElementById("fs")

    fs.addEventListener('click', () => {
      // event listenter
      var a  = document.getElementById("app")
      a.webkitRequestFullscreen()
      //a.requestFullscreen()
    })

    document.addEventListener('keydown', function (e) {
      console.log(e.which)
      // if n is pressed it shows the slide number
      if (e.which === 78){
        that.showNumber = true
      }
    })
    window.addEventListener('resize', function () {
      // clears any previous resize timeouts set
      clearTimeout(that.resizeId)

      that.resizeId = setTimeout(function (){
        that.goToSlide();
      }, 500)
    })
    window.addEventListener('keyup',function(e){
      console.log(e.which)
      if(e.which == 39 && that.overview == false){
        //navigates to the next slide when right arrow key pressed
        that.nextSlide()
      }else if(e.which == 37 && that.overview == false){
        //navigates to the previous slide when left arrow key pressed
        that.previousSlide()
      }else if(e.which == 79){
        // toggles overview mode when o is pressed
        that.toggleOverview()
      }else if(e.which == 71){
        // toggles goTo when g is pressed
        that.toggleGoto()
      }else if(e.which == 27){
        // toggles escapes stuff
        if (that.overview){
          that.toggleOverview()
        }
        if(that.goto.status){
          that.toggleGoto()
        }
        
        
      }else if(e.which == 13){
        // does stuff when enter is pressed
        if(that.goto.status){
          that.changeSlide()
        }
      }else if(e.which === 78){
        // if n is pressed
        that.showNumber = false
      } else if (e.which === 66){
        //if b is pressed
        that.blank = !that.blank
      }else if (e.which ===70){
        //if f is pressed
        
      } 
    })
  },
  
  methods:{
    nextSlide: function(){
      //switches to next slide if not at the last slide
      if(this.index < p.slides.length-1 ){
        this.index++
        console.log("switching to slide: "+ (this.index+1))
        this.goToSlide()
      }else{
        console.log("end of slides")
      } 
    } ,
    previousSlide: function(){
      //switches to the previous slide if not at the first slide
      if(this.index > 0  ){
        this.index--
        console.log("switching to slide: "+ (this.index+1))
        this.goToSlide()
      }else{
        console.log("At the start")
      } 
    },
    fullScreen:(e)=>{

      // testing fullscreen
      console.log(e.webkitRequestFullscreen)
      var el = document.getElementById("app")
      el.requestFullscreen()
    },
    goToSlide: function () {
      // uses the scrollTo function at the bottom of this file to animate 
      // the navigation to the slide
      scrollTo(document.body,(this.index*ww),this.transitionTime)
    },
    determineIndex: function () {
      // gets the current index based on the slide position on the x axis
      return (window.scrollX + window.innerWidth) / window.innerWidth
    },
    toggleOverview: function(){
      // toggles overview mode if o or Esc is pressed
      var that = this
      this.overview = !this.overview
      if(!this.overview){
        setTimeout(function(){that.goToSlide()},1000)
      }

      //Enables scrolling only if in overview mode
      if (this.overview){
        enableScroll()
      }else {
        disableScroll()
      }
    },
    toggleGoto: function(){
      // When g is pressed this function is fired to display the go to form 
      // which allows you to jump to a slide based on the number entered
      // this only toggles the form on an off ** changeSlides actually changes the slide
      var that = this
      this.goto.status = !this.goto.status
      if(this.goto.status){
        setTimeout(function () {that.$refs.goto.focus()}, 100)
      }
    },
    changeSlide: function (){
      // changes the slide based on the number entered on the goto form
      console.log("changing slide")
      //setting index
      this.index = parseInt(this.goto.slide) - 1
      //go to new index
      this.goto.status = false
      this.goToSlide()
    },
    selectedFromOverview: function(e) {
      // goes to a selected slide when the slide number is clicked in 
      // overview mode
      console.log(e)
      this.index = e
      this.toggleOverview();
    }
  }
})



//Utility functions that will be hoisted when this file is executed are included below.
   
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


// preventing scrolling
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
  if (window.addEventListener) // older FF
      window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove  = preventDefault; // mobile
  document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null; 
    window.onwheel = null; 
    window.ontouchmove = null;  
    document.onkeydown = null;  
}