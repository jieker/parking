<template>
	<!-- 遮罩层,用于解决active视频遮挡页面问题,在弹窗打开之前先显示此遮罩,弹窗关闭之后隐藏此遮罩 -->
	<iframe  :class="containerDirection" v-show="isIframeShow" src="about:blank" frameBorder="0" marginHeight="0" marginWidth="0"
		style="position: absolute; height: 90%; display: none; visibility: inherit; z-index: 10;" :style="iframeStyle"
	></iframe>			
</template>

<script>
	
	export default {
        name: 'Shade',	
        props: {
			//控制弹窗的显示隐藏
			visible: {
				type: Boolean,
				default: false
			},	
			//靠左还是靠右
			direction: {
				type: String,
				default: 'center'
			},
			//距离顶部的距离,单位px
			top: {
				type: String,
				default: '0'
			},

		},        
		data() {
			return {
				 containerDirection: {
					 'container-left': this.direction === 'left',
					 'container-right': this.direction === 'right',
					 'container-center': this.direction === 'center',
				 },
				
				 isIframeShow: this.visible,
				 iframeStyle:{
					 top: `${this.top}px`
				}
				
			}
		},
		watch: {
			visible(newVal,oldVal){
				// console.log(newVal)
				if (newVal) {
					this.isIframeShow = newVal
					this.$emit('open')
				}else{
					this.isIframeShow = newVal
					this.$emit('close')
				}

			},
			direction(newVal,oldVal){
				this.containerDirection = {
					 'container-left': newVal === 'left',
					 'container-right': newVal === 'right',
					 'container-center': newVal === 'center',
				 }
			},	
		},
		methods: {

			//打开弹窗触发
			openDialog(){
						
			},
			//关闭弹窗触发
			closeDialog(){
				this.$emit('update:visible', false)
			},	
			
		},
		
	}

</script>

<style lang="scss" scoped>
	.container-center{
		left:0px;
		// top: 80px;
		width: 100%;
	}
	.container-left{
		left:0px;
		// top: 80px;
		width: 50%;
	}	
	.container-right{
		right:0px;
		// top: 80px;
		width: 50%;
	}

</style>
   
