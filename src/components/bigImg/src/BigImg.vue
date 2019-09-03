<!-- 
     自定义查看大图弹窗组件,
	 适用场景:需要弹窗打开大图的时候 
	 父组件调openDialog方法打开
-->

<template>
    <div>
        <el-dialog  width="70%" title="大图" :visible.sync="bigImgVisible" @open="openDialog(imgSrc)" @close="closeDialog" :append-to-body="true" >
            <div class="big-img">
                <img class="img-responsive" :src="imgSrc" :onerror="imgOnerror" alt="图片路径未找到图片">
            </div>	
        </el-dialog>  	
    	<shade  :visible.sync="isShowIframeCenter"></shade>

    </div>
</template>
 <script>
    import notfindimg from "@/assets/img/notfindimg.png"
	
	export default {
        name: 'BigImg',	
		data() {
            return{
                isShowIframeCenter: false,
                bigImgVisible: false,
                imgSrc: '',                
                imgOnerror: 'this.src="' + notfindimg + '"',     //图片路径找不到图片/出错时的占位图
            }
        },
		methods:{
            //父组件调此方法打开并把图片地址imgSrc传过来
            openDialog(imgSrc){
                this.imgSrc = imgSrc
                this.isShowIframeCenter = true
                this.bigImgVisible = true
            },
            closeDialog(){
                this.imgSrc = ''
                this.bigImgVisible = false
                this.isShowIframeCenter = false
            },            
        }
		
	}

</script>

<style lang="scss" scoped>
	.big-img{
        text-align: center;
        img{
            width: 100%;
            height: 100%;
        }
    }
</style>
   
