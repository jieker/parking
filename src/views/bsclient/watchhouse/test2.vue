<template>	
    <div class="carInfo clearfix" >

        <el-col :span="12">
            <span>连接个数(华夏):</span>
            <el-input-number v-model="num1" @change="handleChange" :min="0" :max="100" label="连接个数"></el-input-number>   
            <div  v-for="(item,index) in array" :key="index">
                <video  width="450px" height="350px"  autoplay="autoplay" >
                    <source type="video/mp4"  src="../../../assets/video/testvideo.mp4" >
                </video>
            </div>		
        </el-col>      
        <el-col :span="12">
            <span>连接个数(臻识):</span>
            <el-input-number v-model="num2" @change="handleChange2" :min="0" :max="100" label="连接个数"></el-input-number>   
            <!-- <el-button @click="openZhenShi">open</el-button> -->
            <div >
                <object classid="clsid:3B62E31C-B08C-4FED-83BC-6CEC8F7C1FB8" width="450px" height="350px" id="zhenshi0">
                </object>
                <object classid="clsid:3B62E31C-B08C-4FED-83BC-6CEC8F7C1FB8" width="450px" height="350px" id="zhenshi1">
                </object>
                <object classid="clsid:3B62E31C-B08C-4FED-83BC-6CEC8F7C1FB8" width="450px" height="350px" id="zhenshi2">
                </object>    
                <object classid="clsid:3B62E31C-B08C-4FED-83BC-6CEC8F7C1FB8" width="450px" height="350px" id="zhenshi3">
                </object>     
                <object classid="clsid:3B62E31C-B08C-4FED-83BC-6CEC8F7C1FB8" width="450px" height="350px" id="zhenshi4">
                </object> 
                <object classid="clsid:3B62E31C-B08C-4FED-83BC-6CEC8F7C1FB8" width="450px" height="350px" id="zhenshi5">
                </object> 
                <object classid="clsid:3B62E31C-B08C-4FED-83BC-6CEC8F7C1FB8" width="450px" height="350px" id="zhenshi6">
                </object>                                                                                           
            </div>            
        </el-col>          

    </div>
</template>

<script>
    // import testvideo form "@assets/video/testvideo.mp4"
    
	export default {
		data() {
			return {
                num1: 0	,
                array:[],
                num2: 0	,
                array2:[] ,
                // videoSrc: testvideo             
			}
		},
		computed: {

        },		
		watch:{
        },	
        mounted(){
            this.handleChange2()
        },        	
		methods: {
            handleChange() {
                this.array = []
                for (let i = 0; i < this.num1; i++) {
                    this.array.push(1)
                }
            },
            handleChange2() {
                for (let i = 0; i < this.num2; i++) {
                
                    let id = `zhenshi${i}`
               

                    var ax = this.GetAX(id);
                    if(ax)
                    {
                     var ret = ax.StreamClient_StartPlay("rtsp://192.168.1.200:8557/h264");
                    }
                }
            },  
            openZhenShi(){
                let ax = this.GetAX('zhenshi1');
                if(ax)
                {
                    let ret = ax.StreamClient_StartPlay("rtsp://192.168.1.200:8557/h264");
                }                
            },   
            GetAX(name)
                {
                    if (window.document[name])
                    {
                        return window.document[name];
                    }
                    if (navigator.appName.indexOf("Microsoft Internet")==-1)
                    {
                        if (document.embeds && document.embeds[name])
                            return document.embeds[name];
                    }
                    else // if (navigator.appName.indexOf("Microsoft Internet")!=-1)
                    {
                        return document.getElementById(name);
                    }
                }                   
                 
		},
	}

</script>

<style lang="scss" scoped>
	.imageWrapper{
        width: 500px;
        height: 400px;
        background: #FC813B;
    }
	
</style>
