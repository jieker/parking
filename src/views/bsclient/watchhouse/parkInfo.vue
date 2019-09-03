<!--侧边栏停车场车位信息-->
<template>	
    <div>
        <div class="carInfo clearfix" >
            <div class="carInfo-left" v-if="isIframeShow">
                <div class="left-top text-right">
                    <span>{{refreshTime}}秒后自动</span>
                    <el-button class="font-size-16" type="primary" size="mini" icon="el-icon-refresh" @click="getRegionSpaceByRegionId(regionId)">刷新</el-button>
                </div>
                <p>停车场总车位:<span class="text-blue">{{regionSpaceInfo.totalNum}}</span></p>
                <p>停车场在场总车辆数:<span class="text-orange">{{regionSpaceInfo.currentTotalNum}}</span></p>
                <p>停车场剩余车位:<span class="text-success">{{regionSpaceInfo.restParkNum}}</span></p>
                <hr>
                <p>{{regionName}}总车位:<span class="text-blue">{{regionSpaceInfo.regionTotalNum}}</span></p>
                <p>{{regionName}}在场总车辆数:<span class="text-orange">{{regionSpaceInfo.currentRegionNum}}</span></p>
                <p>{{regionName}}剩余车位:<span class="text-success">{{regionSpaceInfo.restRegionNum}}</span></p>
                <hr>
                <p>临时车是否有上限:<span class="text-orange">{{regionSpaceInfo.limitTempCar?'有上限':'无上限'}}</span></p>
                <p class="text-orange" v-show="regionSpaceInfo.limitTempCar">上限数量<span class="text-blue">{{regionSpaceInfo.limitTempCarNum}}</span></p>                
                <p v-show="regionSpaceInfo.limitTempCar">临时车车位:<span class="text-orange">{{regionSpaceInfo.limitTempCarNum}}</span></p>
                <p>在场临时车数:<span class="text-orange" >{{regionSpaceInfo.curentTempNum}}</span></p>
                <p v-show="regionSpaceInfo.limitTempCar">临时车剩余车位:<span class="text-success">{{regionSpaceInfo.restTempNum}}</span></p>

            </div>
            <div class="carInfo-right">
                <div class="carInfo-right-button" @click="trgerCarInfo">
                    <i class="el-icon-d-arrow-right"></i>
                </div>
            </div>			
        </div>
        <!-- 遮罩层,用于解决active视频遮挡页面问题,在弹窗打开直接先显示此遮罩 -->
        <iframe  v-show="isIframeShow" src="about:blank" frameBorder="0" marginHeight="0" marginWidth="0"
            style="position: absolute;top:0px; height: 700px;width:280px; display: none; visibility: inherit; z-index: 10;" 
        ></iframe>            
    </div>

</template>

<script>
	import {ip,getRegionSpaceByRegionId} from '@/api/api'
	
	export default {
		props: {
			regionId: String,		
		},        
		data() {
			return {
                isIframeShow: false,
                spaceThetimer:null,		//存储获取车位的定时器
                regionName:'',
                refreshTime:'',         //刷新时间
                refreshThetimer:null,     //存储获取刷新时间定时器
				regionSpaceInfo:{
					"currentTotalNum": 0,
					"curentTempNum": 0,
					"totalNum": 0,
					"currentRegionNum": 0,
					"regionTotalNum": 0,
					"limitTempCar": false,
					"limitTempCarNum": 0,
					"restRegionNum": 0,
					"restParkNum": 0,
					"restTempNum": 0
				},                
				
			}
		},
		computed: {

        },		
		mounted(){
			//启动获取车位数定时器
			this.spaceThetimer = window.setInterval(() =>{
				this.getRegionSpaceByRegionId(this.regionId)
            }, 60000)
        },
		//页面跳转时销毁定时器
		beforeDestroy(){
			//清除获取车位定时器
			window.clearInterval(this.spaceThetimer)
			window.clearInterval(this.refreshThetimer)
		},        
		watch:{
			regionId(newVal,oldVal){
                // console.log(`区域id：${newVal}`)
                this.getRegionSpaceByRegionId(newVal)
			},     
			
		},		
		methods: {
			trgerCarInfo(){
				this.isIframeShow=!this.isIframeShow
            },
			//获取车位数
			getRegionSpaceByRegionId(regionId){
				// console.log(this.regionId);
				getRegionSpaceByRegionId({},regionId).then(data => {
					// console.log(data)
					if (data.data.code === "SUCCESS") {
                        this.regionSpaceInfo = data.data.data
                         this.regionName = this.getRegionNameById(this.regionId)
                         this.refreshTime = 60

			             window.clearInterval(this.refreshThetimer)
                         this.refreshThetimer = window.setInterval(() =>{
                            this.refreshTime -= 1
                         }, 1000)   

					} else {
						this.$message.error(data.data.msg)
					}
				});
            },  
            /**
             * 根据Id获取区域名,返回区域名称
             * @param {String} id 区域id
             * return String
            */    
            getRegionNameById(id){
                let regionList = JSON.parse(sessionStorage.getItem('parkInfo')).regions
                for (let i = 0; i < regionList.length; i++) {
                    if (id === regionList[i].id) {
                        return regionList[i].regionName
                    }
                }
            },                      								
					
		},
	}

</script>

<style lang="scss" scoped>
    .carInfo{
        position:fixed;
        top: 120px;
        left: 0px;	
        height: 700px;
        z-index: 11;					
        .carInfo-left{
            float: left;
            width: 250px;
            height: 100%;
            background: rgba(0,0,0,.5);
            color: #fff;
            .left-top{
                padding: 10px;
            }            
            p{
                padding: 0px 10px;
                font-size: 18px;
                font-weight: bold;
            }

        }
        .carInfo-right{
            float: right;
            width: 30px;
            height: 100%;
            background: rgba(0,0,0,0.0);
            .carInfo-right-button{
                margin-top: 315px;
                height: 60px;
                background: rgba(0,0,0,.5);
                cursor: pointer;
                i{
                    margin-top: 20px;
                    font-size: 26px;
                    font-weight: bold;
                    color: #fff;
                }						
            }
            .carInfo-right-button:hover{
                background: $color-orange;
            }				

        }			
    }
	
</style>
