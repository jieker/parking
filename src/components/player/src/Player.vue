<template>
   <div class="prism-player" :id="videoid"></div>
</template>
<script>

	/* rtmp视频流播放器
	采用百度web播放器
	API:https://cloud.baidu.com/doc/MCT/WebSDKAPI.html
	*/
	export default {
        name: 'Player',	
        props: {
			videoid: String,	//id,(必填)
			videosrc: String,	//rtmp地址,(必填)
			width: String,		//宽度,具体px值或占比,eg:'400'或'100%',(必填)
			height: String,		//高度,具体px值或占比,eg:'400'或'100%',(必填)
		},        
		data() {
			return {
				player:null,
			}
		},
		mounted(){
			this.videoPlayer()
		},
		beforeDestroy(){
			this.player.remove()
		},	
		watch: {
					
		},
		methods: {
			//创建播放器
			videoPlayer(){
				this.player = cyberplayer(this.videoid).setup({
					width: this.width,
					height: this.height,
					file: this.videosrc, // <—rtmp直播地址
					minBufferLength: 30,
					type: "rtmp",
					autostart: true,
					stretching: "uniform",
					volume: 0,
					controls: true,
					image: '',
					controlbar: {
						barLogo: false,

					},
					stretching:'exactfit',
					rtmp: {
						reconnecttime: 5, // rtmp直播的重连相隔秒数
						bufferlength: 0 // 缓冲多少秒之后开始播放 默认1秒
					},
					ak: "b251231d6bfb4f689a659594cef81c09" // 公有云平台注册即可获得accessKey
				});
				//出错重连
				this.player.onError((event)=>{ 
					console.log(event.message);
					this.connect()
				});				
			},
			//重连
			connect(){
				this.player.remove()
				this.videoPlayer()
				console.log('重连成功');
			},	
				
		},
		
	}

</script>

<style scoped>

</style>
   
