<template>	
    <div class="carInfo clearfix" >

        <el-col :span="12">
            <span>连接个数(华夏):</span>
            <el-input-number v-model="num1" @change="handleChange" :min="0" :max="100" label="连接个数"></el-input-number>   
            <div  v-for="(item,index) in array" :key="index">
                <img class="imageWrapper" src="http://192.168.1.223:8000/cgi-bin/preview.cgi"/>
                <img class="imageWrapper" src="http://192.168.1.224:8000/cgi-bin/preview.cgi"/>
            </div>		
        </el-col>      
        <el-col :span="12">
            <span>连接个数(臻识):</span>
            <el-input-number v-model="num2" @change="handleChange2" :min="0" :max="100" label="连接个数"></el-input-number>   
            <div  v-for="item in array2" :key="item.id">
                <img class="imageWrapper" :id="item.id" />
            </div>		
        </el-col>          

    </div>
</template>

<script>
	
	export default {
		data() {
			return {
                num1: 0	,
                array:[],
                num2: 0	,
                array2:[]                
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
						//关闭已有连接
						try {
							this.array2[i].close()
                        } catch (error) {}
                                            
						//创建新连接
                        let tempObj = new WebSocket(`ws://192.168.1.200:9080/ws`)
                        let id = `test${i}`
						//绑定img id,用于关闭连接时清空图像,可在关闭事件srcElement属性中获取
                        tempObj.id = id
                        this.array2[i] = (tempObj)
						//打开摄像头
						this.Util.configCamer3(tempObj,id)
                }
            },            
                 
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
