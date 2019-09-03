<!--收费中心推送的进出场信息-->
<template>	
    <div class="carInfo clearfix" >
        <div class="carInfo-left" v-show="isShowCarInfo">
            <div class="box-head text-center clearfix">
                <div class="head-content float-left">
                    <div class="head-title">进场信息</div>
                </div>
                <div class="head-content float-right">
                    <el-button  type="text" class="text-orange" size="mini" icon="el-icon-delete" @click="inCarInfoList=[]">清空</el-button>
                </div>
            </div>
            <div class="carInfo-box carInfo-in" id="carInfoIn">
                <div class="box-body clearfix" v-for="(item,index) in inCarInfoList" :key="item.sendTime" :class="{active: !index }">
                    <div class="box-body-item float-left"  style="width:100%">
                        <p class="left-p"><span class="left-p-title">推送时间：</span><span class="left-p-content">{{item.sendTime}}</span></p>
                        <p class="left-p"><span class="left-p-title">岗亭名称：</span><span class="left-p-content">{{item.gateName}}</span></p>
                    </div>                    
                    <div class="box-body-item float-left">
                        <p class="left-p"><span class="left-p-title">车牌1：</span><span class="left-p-content">{{item.carNum1 | transformNoting}}</span></p>
                    </div>
                    <div class="box-body-item float-right">
                        <p class="left-p"><span class="left-p-title">车牌2：</span><span class="left-p-content">{{item.carNum2 | transformNoting}}</span></p>
                    </div>
                    <div class="box-body-item float-left"  style="width:100%">
                        <p class="left-p"><span class="left-p-title">进场时间：</span><span class="left-p-content">{{item.strTime}}</span></p>
                        <p class="left-p"><span class="left-p-title">其它信息：</span><span v-html="item.remark"></span></p> 
                        <div class="item-border"></div>                    
                    </div>
                </div>
                <p v-show="!inCarInfoList || !inCarInfoList.length" class="text-center">暂无数据</p>
            </div>
            <div class="carInfo-hr">
                <hr>
            </div>

            <div class="box-head text-center clearfix">
                <div class="head-content float-left">
                    <div class="head-title">出场信息</div>
                </div>
                <div class="head-content float-right">
                    <el-button  type="text" class="text-orange" size="mini" icon="el-icon-delete" @click="outCarInfoList=[]">清空</el-button>
                </div>
            </div>            
            <div class="carInfo-box carInfo-out" id="carInfoOut">
                <div class="box-body clearfix" v-for="(item,index) in outCarInfoList" :key="item.sendTime" :class="{active: !index }">
                    <div class="box-body-item float-left"  style="width:100%">
                        <p class="left-p"><span class="left-p-title">推送时间：</span><span class="left-p-content">{{item.sendTime}}</span></p>
                    </div>       
                    <div class="box-body-item float-left">
                        <p class="left-p"><span class="left-p-title">岗亭名称：</span><span class="left-p-content">{{item.gateName}}</span></p>
                    </div>
                    <div class="box-body-item float-right">
                        <p class="left-p"><span class="left-p-title">车牌：</span><span class="left-p-content">{{item.carNum}}</span></p>
                    </div>
                    <div class="box-body-item float-left"  style="width:100%">
                        <p class="left-p"><span class="left-p-title">进场时间：</span><span class="left-p-content">{{item.inTime | transformNoting}}</span></p>
                        <p class="left-p"><span class="left-p-title">出场时间：</span><span class="left-p-content">{{item.outTime}}</span></p>
                        <p class="left-p"><span class="left-p-title">其它信息：</span><span v-html="item.notice"></span></p> 
                        <div class="item-border"></div>                    
                    </div>
                </div>
                <p v-show="!outCarInfoList || !outCarInfoList.length" class="text-center">暂无数据</p>

            </div>

        </div> 
        <div class="carInfo-right">
            <div class="carInfo-right-button" @click="trgerCarInfo">
                <i class="el-icon-d-arrow-right"></i>
            </div>
        </div>	
       
    </div>
</template>

<script>
    import { mapGetters,mapActions} from 'vuex'
	import WebsocketHeartbeatJs from 'websocket-heartbeat-js'
	import ReconnectingWebSocket from 'reconnecting-websocket'
    
	import {ip} from '@/api/api'
	
	export default {
		data() {
			return {
                isShowCarInfo:true,
                inCarInfoList:[],
                outCarInfoList:[],
				
			}
		},
		computed: {
			...mapGetters({
				gateList: 'getGateList',
            }),
        },	
		mounted(){
            this.openCarWebsocket()
		},
		
		//路由跳转时关闭摄像头连接
		beforeDestroy(){
				//关闭已有连接
				try {
					this.carWebSocket.close()
				} catch (error) {}			
		},		
		methods: {
            //进场推送数据加入展示列表
			addInCarInfoList(eventData){
                let inCarInfo = this.Util.deepCopy(eventData.message.data)
                inCarInfo.sendTime = this.Util.formatDate.format(new Date(JSON.parse(sessionStorage.getItem('commonTime'))),'yyyy-MM-dd hh:mm:ss')
                inCarInfo.gateName = this.Util.getGateNameById(inCarInfo.gateId,this.gateList)

                if(eventData.message.code === 'SUCCESS'){		//进场不成功
                    inCarInfo.remark = `<span class="text-success">进场成功</span>`
                }else if(eventData.message.code ==='ALLOW_PARKIN'){
                     inCarInfo.remark = `<span class="text-danger">限制进场,等待处理</span>`
                }else{
                     inCarInfo.remark = `<span class="text-danger">进场失败,${eventData.message.msg}</span>`

                }

                this.inCarInfoList.unshift(inCarInfo)

                document.getElementById('carInfoIn').scrollTop = 0
            },
            //出场推送数据加入展示列表
			addOutCarInfoList(eventData){
                let outCarInfo = this.Util.deepCopy(eventData)
                outCarInfo.sendTime = this.Util.formatDate.format(new Date(JSON.parse(sessionStorage.getItem('commonTime'))),'yyyy-MM-dd hh:mm:ss')
                outCarInfo.gateName = this.Util.getGateNameById(outCarInfo.gateId,this.gateList)                

                if(eventData.status === -1){
                   outCarInfo.notice = `<span class="text-danger">${outCarInfo.remarks}</span>`
                }else if(eventData.status === 2){
                   outCarInfo.notice = `<span class="text-danger">出场失败,${outCarInfo.remarks}</span>`
                }
                else{
                   let discountedPay = this.Util.formatMoney(outCarInfo.discountedPay)
                   outCarInfo.notice = `<span class="text-success">出场成功,${outCarInfo.remarks}</span>`
                }                
                this.outCarInfoList.unshift(outCarInfo)

                document.getElementById('carInfoOut').scrollTop = 0
                
            },            
			//重连接收车牌识别结果websocket连接
			openCarWebsocket(number){
				//关闭已有连接
				try {
					this.carWebSocket.close()
				} catch (error) {}
                //新键接收车牌识别结果连接
                let uuid = this.Util.createUUID()
				// this.carWebSocket = new WebsocketHeartbeatJs({
				// 	url: `ws://${ip}/websocket/-1/-1`
				// })                
				this.carWebSocket = new ReconnectingWebSocket(`ws://${ip}/websocket/-1/-1/${uuid}`);
                // this.carWebSocket = new WebSocket(`ws://${ip}/websocket/-1/-1`);
                
				//配置客户端连接成功的回调方法
				this.carWebSocket.onopen = (event) => {
					console.log("打开监控中心websocket连接...");
				};
				//配置客户端关闭成功的回调方法
				this.carWebSocket.onclose = (event) => {
					console.log("关闭监控中心websocket连接...");
				};

				//配置客户端处理消息的回调方法
				this.carWebSocket.onmessage = (event) => {
					console.log('推送数据:');
					// console.log(event.data)
                    if(event.data.substring(event.data.length-2) !== '加入'){	//不是首次连接
						if (event.data === "heartbeat") {
							console.log(event.data);
							return
						}                    
                        let eventData = JSON.parse(event.data) 
                        console.log(eventData)
                        if (eventData.topic === 'parkin') {
                            this.addInCarInfoList(eventData)
                        }else{
                            this.addOutCarInfoList(eventData)
                        }
					
					}

                };  
				//配置客户端关闭出错的回调方法
				this.carWebSocket.onreconnect = (event) => {
					console.log('重连...');
				};                              
			},			
					
            //显示隐藏推送信息切换			
			trgerCarInfo(){
				this.isShowCarInfo = !this.isShowCarInfo
            },
					
		},
	}

</script>

<style lang="scss" scoped>
    .carInfo{
        position:fixed;
        left: 0px;	
        top:80px;
        min-width: 350px;
        width: 25%;
        height: 857px;
        // min-height: 860px;
        z-index: 9;					
        .carInfo-left{
            float: left;
            width: 90%;
            // height: 100%;
            background: rgba(0,0,0,.5);
            color: #fff;
            .box-head{
                 width: 100%;
                .head-content{
                    width: 49%;
                    .head-title{
                        font-size: 16px;
                        font-weight: bold;
                        line-height: 35px;
                        // color: $color-orange;
                    }
                }
            }
            .carInfo-box{
                overflow: auto;
                width: 100%;
                .box-body{
                    .box-body-item{
                        width: 50%;
                        .left-p{
                            margin: 0px;
                            padding: 0px 8px;
                            // font-size: 16px;
                            .left-p-title{
                                width: 100px;
                                color: $color-warning;
                            }
                            .left-p-content{
                                width: 100px;
                                color: #fff;
                            }                            
                        }
                        .item-border{
                            border-bottom: 1px dashed $color-blue;
                            margin:2px;
                        }
                    }
                }
                .box-body:hover{
                    background: rgba(118, 195, 214, 0.2);
                }
            }
            /*滚动条样式*/
            .carInfo-box::-webkit-scrollbar {/*滚动条整体样式*/
              width: 8px; 
              background: rgba(0,0,0,.2);
            }            
            .carInfo-in{
                height: 375px;
            }
            .carInfo-hr{
                padding: 7px 0px;
                background: rgba(0,0,0,0.3);
                hr{
                    margin: 0px;
                }
            }
            .carInfo-out{
                 height: 420px;
            }

        }
        .carInfo-right{
            float: left;
            width: 30px;
            height: 100%;
            line-height: 100%;
            background: rgba(0,0,0,0.0);
            .carInfo-right-button{
                margin-top: 385px;
                height: 60px;
                background: rgba(0,0,0,.6);
                // background: $color-orange;
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
    .active{
        background: rgba(118, 195, 214, 0.2);
    }
	
</style>
