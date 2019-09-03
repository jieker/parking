<template>
 <div>
     <h1>直播间</h1>
     <video id="example" class="video-js" controls preload="auto" data-setup="{}">
        <source src="rtmp://192.168.1.48:1935/mylive/test2" type="rtmp/flv">
     </video>
     <el-button @click="open">open</el-button>
 </div>
</template>

<script>
import 'video.js/dist/video-js.css'
import videojs from 'video.js'
	// import notconnect from "@/assets/img/notconnect.png"
  

export default {
  
  name: 'live',
  data() {
    return {

    }
  },
  computed: {
    
  },
  mounted(){
    this.open()
  },
  methods: {
    open(){
      var options = {
        controls:false,
      };

      var player = videojs('example', options, function onPlayerReady() {
        videojs.log('播放器已经准备好了!');

        this.play();

        // How about an event listener?<br>  // 如何使用事件监听？
        this.on('ended', function() {
        videojs.log('播放结束了!');
        });
      });
    }
  }
}
</script>

<style scoped>

</style>
