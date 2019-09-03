<!-- 
	 自定义弹窗组件,
	 适用场景:岗亭等需要支持同时打开左右两个弹窗 
	 根据direction判断靠左,右还是占整个屏幕
-->

<template>
	<transition name="el-fade-in">
		<div class="container" :class="containerDirection" v-show="showDialog" >
			<div class="container-box" :style="widthStyle">
				<div class="container-head clearfix" >
					<div class="container-head-left ">
						<span class="container-head-title">{{title}}</span>
					</div>
					<div class="container-head-right ">
						<span class="el-icon-close container-head-icon" @click="closeDialog" v-show="showClose"></span>
					</div>
				</div>
				<slot></slot>
			</div>
		</div>
    </transition>    
</template>

<script>
	
	export default {
        name: 'SmDialog',	
        props: {
			//控制弹窗的显示隐藏(必传)
			visible: {
				type: Boolean,
				default: false
			},
			//弹窗标题
			title: {
				type: String,
				default: ''
			},				
			//是否显示黑色遮罩
			modal: {
				type: Boolean,
				default: true
			},			
			//是否显示关闭按钮
			showClose: {
				type: Boolean,
				default: true
			},
			//宽度占比
			width: {
				type: String,
				default: '50%'
			},			
			//靠左还是靠右,可选值:left,right,center
			direction: {
				type: String,
				default: 'center'
			},

		},        
		data() {
			return {
				 containerDirection: {
					 'container-left': this.direction === 'left',
					 'container-right': this.direction === 'right',
					 'container-center': this.direction === 'center',
					 'container-bg': this.modal,					 
				 },
				 widthStyle: {
					width: this.width, 
				 },
				 showDialog: this.visible,
			}
		},
		watch: {
			visible(newVal,oldVal){
				// console.log(newVal)
				if (newVal) {
					this.showDialog = newVal					
					this.$emit('open')
				}else{
					this.showDialog = newVal					
					this.$emit('close')
				}

			},
			modal(newVal,oldVal){
				// console.log(newVal);
				this.containerDirection = {
					 'container-left': newVal === 'left',
					 'container-right': newVal === 'right',
					 'container-center': newVal === 'center',
					 'container-bg': this.modal,					 
				 }
			},			
			direction(newVal,oldVal){
				this.containerDirection = {
					 'container-left': newVal === 'left',
					 'container-right': newVal === 'right',
					 'container-center': newVal === 'center',
					 'container-bg': this.modal,					 
				 }
			},	
			width(newVal,oldVal){
				this.widthStyle = {
					width: newVal, 
				 }
			},					
		},
		methods: {
			//打开弹窗触发
			openDialog(){

			},
			//关闭弹窗触发
			closeDialog(){
				this.showDialog = false
				this.$emit('update:visible', false)
			},	
			
		},
		
	}

</script>

<style lang="scss" scoped>

	.container-bg{
		background: rgba(0,0,0,0.5);
	}
	.container{
		// background: rgba(0,0,0,0.5);
		width: 50%;
		height: 100%;
		min-height: 415px;
		padding: 0px 8px;
		box-sizing: border-box;
		z-index: 99;					
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);	
		overflow-y: auto;
		.container-box{
			margin:auto;
			margin-top: 120px;
			margin-bottom: 80px;
			width: 100%;		
			box-shadow:0px 1px 5px #908f8f;
			background: #fff;
			.container-head{
				padding: 15px;
				height: 24px;
				background: $color-black;
				.container-head-left{
					float: left;
					text-align: left;
					width: 50%;
					.container-head-title{
						color: $color-orange;
						font-size: 18px;
					}					
				}
				.container-head-right{
					float: right;
					text-align: right;					
					width: 50%;
					.container-head-icon{
						color: #fff;
						font-size: 18px;
						cursor: pointer;
					}
					.container-head-icon:hover{
						color: $color-orange;
					}					
				}				
		
			}
		}
	}
	.container-center{
		position:fixed;
		left:0px;
		top:0px;
		width: 100%;
	}
	.container-left{
		position: fixed;
		left:0px;
		top:0px;
	}	
	.container-right{
		position:fixed;
		right:0px;
		top:0px;
	}

</style>
   
