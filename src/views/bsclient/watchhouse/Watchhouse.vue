<!-- 岗亭端	 -->
<template>
<div class="imageWrapper" ref="imageWrapper" >
	<el-row class="content"  v-loading="loading" element-loading-text="请求处理中,请稍等....">
		<el-col :span="24" class="content-head text-right">
			<span v-if="sentryBoxName"><b>岗亭名称:</b>{{this.userLoginList.position}}</span>    
			<div v-else style="display:inline-block;">
				<span><b>岗亭切换:</b></span>
				<el-select size="mini" v-model="gateId"  placeholder="岗亭切换" class="width-150" @change="gateChange" @visible-change="visibleGateChange">
					<el-option v-for="item in gateList" :key="item.id" :label="item.gateName" :value="item.id">
					</el-option>
				</el-select>
			</div>
			<div  style="display:inline-block;">
				<span><b>视频播放方式:</b></span>
				<el-radio-group v-model="videoConnectType" @change="videoConnectTypeChange">
					<el-radio label="rtmp">flash播放器</el-radio>
					<el-radio label="active">active控件(仅限IE打开)</el-radio>
				</el-radio-group>				

			</div>			
			
			<!-- <el-button size="mini" @click="openInOutRecordDialog">无进场记录</el-button> -->

		</el-col>
		
		<div class="clearfix">
			<!-- 入口	 -->
			<div class="content-body" :class="inDirection">
				<div class="content-box">
					<div class="monitor text-center">
						<div class="screen" v-for="item in inShowListCamera" :key="item.id" >
							<p class="screen-title">
								{{inShowListCamera[0].deviceName}}
								<el-tooltip  effect="dark" content="重连摄像头" placement="top" v-show="inShowListCamera[0].deviceName!=='摄像头未配置或未启用'">
									<a href="javaScript:;" class="text-orange " @click="manualReconectCamer('in')">重连<i class="font-size-16 el-icon-refresh"></i></a>
								</el-tooltip>	
								<el-tooltip  effect="dark" content="切换摄像头" placement="top" v-show="inShowListCamera[0].deviceName!=='摄像头未配置或未启用'">
									<a href="javaScript:;" class="text-orange " @click="manualChangeCamer('in')">切换<i class="font-size-16 fa fa-exchange"></i></a>
								</el-tooltip>													
							</p>
							<div v-if="videoConnectType==='rtmp'">
								<img  class="screen-img img-responsive" src="../../../assets/img/notconnect.png" alt="未连接"  v-if="inShowListCamera[0].deviceName==='摄像头未配置或未启用'" />
									
								<div v-else>
									<player ref="player" :videoid="item.id" width="100%" height="374" :videosrc="item.videoPath"  ></player>
								</div>							
							</div>	
							<div  v-if="videoConnectType==='active'" >
								<div class="obj-reset" v-if="inShowListCamera[0].device.name==='臻识R2'">
									<object id="zhenShi1" class="screen-img" classid="clsid:3B62E31C-B08C-4FED-83BC-6CEC8F7C1FB8" >
									
									</object>
								</div>
								<div class="obj-reset" v-if="inShowListCamera[0].device.name==='华夏'" >
									<object id="huaXia1" class="screen-img clearfix" classid="clsid:5D0BE7DE-4BC2-4F92-A3BA-F977F62BB15C" >
										<param name="_Version" value="65536" valuetype="data"/>
										<param name="_ExtentX" value="2646" valuetype="data"/>
										<param name="_ExtentY" value="1323" valuetype="data"/>
										<param name="_StockProps" value="0" valuetype="data"/>										
									</object>
								</div>
							</div>											

						</div>
					
					</div>
					<div class="car-info">
						<h2 class="info-h2">车辆入场</h2>
						<div class="info-box">
							<div class="info-head">
								<span class="info-carnum"><span>{{inCarInfo.carNum1 | transformNoting }}</span></span>
								<span class="info-carnum"><span>{{inCarInfo.carNum2 | transformNoting }}</span></span>
								<span class="text-center">{{inCarInfo.carType1 | transformCarType}}</span>
								<span class="info-usertype">{{inCarInfo.showType}}</span>
							</div>
							<p><span >入场时间：<span class="text-success">{{inCarInfo.strTime}}</span></span></p>
							<p><span >其它信息：<span v-html="inCarInfo.remark"></span></span></p>

						</div>
					</div>
					<div class="menu text-justify">
						<div class="menu-item1 text-left">
							<el-button type="primary" v-loading="inOpenGateloading" @click="openGate('in')">开闸</el-button>
							<el-button type="primary" v-loading="inCloseGateloading" @click="closeGate('in')">关闸</el-button>
						</div>
						<div class="menu-item2 text-right">
							<el-button type="primary" @click="manualIn" v-if="markWatchhouseManualIn">手动入场</el-button>
						</div>
					</div>
				</div>
			</div>
			<!-- 出口 -->
			<div class="content-body" :class="outDirection">
				<div class="content-box">
					<div class="monitor text-center">
						<div class="screen"  v-for="item in outShowListCamera" :key="item.id">
							<p class="screen-title">
								{{outShowListCamera[0].deviceName}}
								<el-tooltip  effect="dark" content="重连摄像头" placement="top" v-show="outShowListCamera[0].deviceName!=='摄像头未配置或未启用'">
									<a href="javaScript:;" class="text-orange " @click="manualReconectCamer('out')">重连<i class="font-size-16 el-icon-refresh"></i></a>
								</el-tooltip>	
								<el-tooltip  effect="dark" content="切换摄像头" placement="top" v-show="outShowListCamera[0].deviceName!=='摄像头未配置或未启用'">
									<a href="javaScript:;" class="text-orange " @click="manualChangeCamer('out')">切换<i class="font-size-16 fa fa-exchange"></i></a>
								</el-tooltip>													
							</p>
							<div v-if="videoConnectType==='rtmp'">
								<img  class="screen-img img-responsive" src="../../../assets/img/notconnect.png" alt="未连接"  v-if="outShowListCamera[0].deviceName==='摄像头未配置或未启用'" />
								<div v-else>
									<player ref="player" :videoid="item.id" width="100%" height="374" :videosrc="item.videoPath"  ></player>
								</div>							
							</div>
							<div  v-if="videoConnectType==='active'" >
								<div class="obj-reset" v-if="outShowListCamera[0].device.name==='臻识R2'">
									<object id="zhenShi2" class="screen-img" classid="clsid:3B62E31C-B08C-4FED-83BC-6CEC8F7C1FB8" >
																	
									</object>
								</div>
								<div class="obj-reset" v-if="outShowListCamera[0].device.name==='华夏'">
									<object id="huaXia2" class="screen-img" classid="clsid:5D0BE7DE-4BC2-4F92-A3BA-F977F62BB15C" >
										<param name="_Version" value="65536" valuetype="data"/>
										<param name="_ExtentX" value="2646" valuetype="data"/>
										<param name="_ExtentY" value="1323" valuetype="data"/>
										<param name="_StockProps" value="0" valuetype="data"/>										
									</object>
								</div>

							</div>						

						</div>
					</div>
					<div class="car-info">
						<h2 class="info-h2">车辆出场</h2>
						<div class="info-box clearfix">
							<div class="info-head">
								<span class="info-carnum"><span>{{outCarInfo.carNum | transformNoting }}</span></span>
								<span class="info-carnum"><span></span></span>
								<span class="text-center">{{outCarInfo.carType | transformCarType}}</span>
								<span class="info-usertype">{{outCarInfo.userType | transformUserType}}</span>
							</div>
							<div class="info-body-left">
								<p>
									<span >应收金额：<span class="text-success">{{outCarInfo.totalPay | transformMoney}}元</span></span>
								</p>
								<p>
									<span >实收金额：<span class="text-success">{{outCarInfo.discountedPay | transformMoney}}元</span></span>
								</p>
								<p>
									<span >优惠金额：<span class="text-success">{{outCarInfo.freePay | transformMoney}}元</span></span>
								</p>
								<p>
									<span >优惠时间：<span class="text-success">{{outCarInfo.discountTime | transformMinutes}}</span></span>
								</p>
								<p v-show="outCarInfo.payMethod">
									<span >支付方式：<span class="text-success">{{outCarInfo.payMethod | transformNull }}</span></span>
								</p>																					
							</div>
							<div class="info-body-right">
								<p>
									<span >入场时间：<span class="text-success">{{outCarInfo.inTime | transformNoting}}</span></span>
								</p>
								<p>
									<span >出场时间：<span class="text-success">{{outCarInfo.outTime | transformNoting}}</span></span>
								</p>
								<p>
									<span >停车时长：<span class="text-success">{{outCarInfo.parkingTime | transformSeconds}}</span></span>
								</p>
								<p>
									<span >其它信息：<span class="text-success" v-html="outCarInfo.remarks"></span></span>
								</p>							
							</div>						

							
						</div>
					</div>
					<div class="menu text-justify">
						<div class="menu-item1 text-left">
							<el-button type="primary" v-loading="outOpenGateloading" @click="openGate('out')">开闸</el-button>
							<el-button type="primary" v-loading="outCloseGateloading" @click="closeGate('out')">关闸</el-button>
						</div>
						<div class="menu-item2 text-right">
							<el-button type="primary" @click="manualOut(false)" v-if="markWatchhouseManualOut">手动出场</el-button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 弹窗-弹窗询问是否可以进场 -->
		<sm-dialog title="弹窗" class="sm-dialog"  @open="listenOpenIsAskInParkDialog" @close="listenCloseIsAskInParkDialog"  :visible.sync="isAskInParkVisible" :direction="inDialogDirection" width="90%" :showClose="false">
			<div class="dialog-box">
				<h2 class="margin-0 text-center">
						<span>{{inCarInfo.carNum1}}</span>
						<span>{{inCarInfo.carNum2}}</span>
						<span>{{inCarInfo.showType}}</span>
				</h2>
				<p></p>
				<div class="text-center">
					<label ><b>车类型:</b></label>
					<el-select class="width-150" v-model="askCarType" placeholder="请选择">
						<el-option v-for="item in carTypeList" :key="item.mark" :label="item.typeName" :value="item.mark">
						</el-option>
					</el-select>					
				</div>	
				<p></p>
				<h2 class="margin-0 text-danger text-center">系统识别到该车辆禁止入场,是否允许其进场?</h2>
				<p class="text-center"><span class="text-orange">{{isAskInParkTimeOut}}</span>秒后将自动关闭弹窗并<b>阻止进场</b></p>

			</div>
			<div  class="dialog-footer text-center">
				<el-button @click="notAllowInPark">不允许</el-button>
				<el-button type="primary" @click="allowInPark">允许</el-button>

			</div>
		</sm-dialog>
		<!-- 弹窗-手动进出场 -->
		<d-in-park :manual-in-props="manualInProps" :direction="inDialogDirection" width="100%" ref="dInPark" @openIsAskInParkDialog="openIsAskInParkDialog"></d-in-park>
		<d-out-park :visible.sync="chargeDialogVisible" :manual-out-props="manualOutProps" :direction="outDialogDirection" width="100%" ref="dOutPark" @chargeCarInfo="chargeCarInfo" ></d-out-park>
		<!-- 无进场记录确认 -->			
		<car-num-check :visible.sync="carNumCheckDialogVisible" :car-num-check-prop="carNumCheckProp" :direction="outDialogDirection" width="100%" ref="carNumCheck" @manual-out="manualOut" @chargeCarInfo="chargeCarInfo"></car-num-check>		
		<!-- 车位信息 -->
		<park-info ref="parkInfo" :regionId="regionId"></park-info>
		<!-- 用于华夏相机active控件的视频连接 -->
		<object height="0px" width="0px" style="display:none;" id="hvactivex2" classid="clsid:29794D47-1BF1-4E45-9A0C-6ACE2CA58760">
  		</object>
	</el-row>

	<shade  :visible.sync="inIsShowIframe" :direction="inDialogDirection"></shade>
	<shade  :visible.sync="outIsShowIframe" :direction="outDialogDirection"></shade>
	<shade  :visible.sync="isShowIframeCenter"></shade>

</div>
</template>

<script >
	import { mapGetters,mapActions} from 'vuex'
	import {ip,base,getParkCenterListByGateId,manualAddParkRecord,commGateOutPark,manualRefusePark,manualInPark,manualPermitPark,downloadActive } from '@/api/api'
	import notimg from "@/assets/img/notimg.png"
	import notconnect from "@/assets/img/notconnect.png"
	import ReconnectingWebSocket from 'reconnecting-websocket'
	import WebsocketHeartbeatJs from 'websocket-heartbeat-js'
	import html2canvas from 'html2canvas'	

	export default {
		components: {
			'CarNumCheck': () => import('./CarNumCheck.vue'),
			'parkInfo': () => import('./parkInfo.vue'),
		},
		data() {
			return {
				inDialogDirection: 'left',			//进口相关弹窗偏移方向
				outDialogDirection: 'right',		//出口相关弹窗偏移方向

				inDirection: {
					 'float-left': this.inDialogDirection === 'left',
					 'float-right': this.inDialogDirection === 'right',
				 },	
				outDirection: {
					 'float-left': this.outDialogDirection === 'left',
					 'float-right': this.outDialogDirection === 'right',
				 },				 			

				inIsShowIframe: false,				//是否显示iframe遮罩层
				outIsShowIframe: false,				//是否显示iframe遮罩层
				isShowIframeCenter: false,				//是否显示iframe遮罩层

				videoConnectType:'rtmp',			//视频连接方式
				askCarType:'',						//进场弹窗车类型
				carNumCheckDialogVisible: false,	//控制无进场记录弹窗显示隐藏
				chargeDialogVisible: false,			//控制收费弹窗显示隐藏
                sentryBoxName:'',   				//岗亭名称
				userLoginList:'',  					//用户登录信息
				
				loading:false,						//岗亭配置loading加载提示
				inOpenGateloading:false,			//进场开闸loading
				inCloseGateloading:false,			//进场关闸loading
				outOpenGateloading:false,
				outCloseGateloading:false,

				gateId: '',				//选择的岗亭
				regionId: '',			//选择的岗亭对应的区域
				manualInProps:{			//手动进场props数据
					gateId:'',			//岗亭id
					isGate:true,		//岗亭下拉选disabled属性,新增时传false	
					isTime:true,		//时间disabled属性,新增时传false
					position:'',		//车道
				},
				manualOutProps:{		//手动出场props数据
					gateId:'',			//岗亭id
					position:'',		//车道
					isCharge: true,		//用于判断是否能收费
				},
				//无进场记录props
				carNumCheckProp:{
					visible:false,
					carNum1: '',
					carNum2: '',
					carType1: '',
					carType2: '',
				},
				listCamera:[],		//摄像头列表
				inListCamera:[{gateName: '未配置',deviceName: '摄像头未配置或未启用',device: {name:''} },],					//进口摄像头列表
				outListCamera:[{gateName: '未配置',deviceName: '摄像头未配置或未启用',device: {name:''} },],				//出口摄像头列表
				inShowListCamera:[{gateName: '未配置',deviceName: '摄像头未配置或未启用',device: {name:''} },],				//进口摄像头展示列表
				outShowListCamera:[{gateName: '未配置',deviceName: '摄像头未配置或未启用',device: {name:''} },],			//出口摄像头展示列表
				listSluice:[],		//闸口列表
				inListSluice:[],	//进口闸口列表
				outListSluice:[],	//出口闸口列表
				//进场展示信息	
				inCarInfo:{
					"carNum1": "",
					"carNum2": "",
					"carType1": "",
					"gateId": "",
					"identityType": '',
					"strTime": '',
					"parkId": "",
					"payMoney": '',
					"remark": "",
					"userType": ''
				},
				//出场展示信息
				outCarInfo:{
					"carNum": "",		//计费车牌
					"carNum1": "",
					"carNum2": "",
					"carType": "",
					"carType1": "",
					"carType2": "",
					"discountedPay": 0,
					"discountTime": 0,
					"freePay": 0,
					"outType": 1,
					"parkId": "",
					"parkRecordId": "",
					"parkingTime": 0,
					"payMethod": "",
					"remark": "",
					"startTime": "",
					"status": 0,
					"stopTime": "",
					"totalPay": 0,
					"userType": '',
					"spaceNum":'',

				},

				isAskInParkVisible: false,	//控制进场弹窗询问窗口的显示隐藏
				isAskInParkInterval:null,	//存储进场弹窗倒计时定时器
				isAskInParkTimeOut:60,		//倒时器时长	

				outCarWebsocket:null,		//存储出场websocket连接
				inCarWebsocket:null,		//存储进场场websocket连接

				markWatchhouseManualIn: false,
				markWatchhouseManualOut: false,

				websocketHeartbeatJs:null,
			}
		},
		computed: {
			...mapGetters({
				gateList: 'getGateList',
				ParkGlobalSetStore: 'getParkGlobalSet',
	            carTypeList: 'getCarTypeList',	
			}),

        },
		mounted(){
			this.inDirection = {
				'float-left': this.inDialogDirection === 'left',
				'float-right': this.inDialogDirection === 'right',
			},	
			this.outDirection = {
				'float-left': this.outDialogDirection === 'left',
				'float-right': this.outDialogDirection === 'right',
			},

			this.markWatchhouseManualIn = this.Util.isPermission('markWatchhouseManualIn')
			this.markWatchhouseManualOut = this.Util.isPermission('markWatchhouseManualOut')	
			
			this.userLoginList =  JSON.parse(sessionStorage.getItem("userInfo"))
			// console.log(this.userLoginList);
			if(this.userLoginList.positionId === null){
                window.setTimeout(() =>{
                    if(this.gateList && this.gateList.length){
						this.gateId = this.gateList[0].id	//岗亭切换默认选择第一个岗亭
						// console.log(this.gateId);
                        this.gateChange()
                    }
                }, 500)
			}else{
                this.sentryBoxName = true
                this.gateId = this.userLoginList.positionId
				this.gateChange()
			}

			let isIE = this.Util.isBrowerIE()
			if (isIE) {
				this.videoConnectType = 'active'
				this.videoConnectTypeChange()
			}

		},
		beforeUpdate(){
			try {
				let menuNode = document.getElementsByClassName('menu-active')
				menuNode[0].classList.remove('menu-active')  
			} catch (error) {}			
			document.getElementById("menu-box-2").classList.add("menu-active")
		},
		//页面跳转时关闭websocket连接
		beforeDestroy(){
			try {
				this.outCarWebsocket.close()
				this.inCarWebsocket.close()
			} catch (error) {}
		},
		watch:{
			inDialogDirection(newVal,oldVal){
				this.inDirection = {
					 'float-left': newVal === 'left',
					 'float-right': newVal === 'right',
				 }
			},     
			outDialogDirection(newVal,oldVal){
				this.outDirection = {
					 'float-left': newVal === 'left',
					 'float-right': newVal === 'right',
				 }
			},

		},			
		methods: {
			//岗亭切换
			gateChange(){

				let param = {
					current:'',
					length:'',
				}

				this.loading = true
				getParkCenterListByGateId(param,this.gateId)
                    .then((data) => {
						this.loading = false

                        if(data.data.code === 'SUCCESS'){
							//存储区域id
							this.regionId = data.data.data.content[0].regionId

							//赋值新数据
							this.listCamera = data.data.data.content[0].listCamera
							this.listSluice = data.data.data.content[0].listSluice

							//区分出进出口设备
							this.inListCamera = this.listCamera.filter( (item) =>{	//进口摄像头
								return item.direction === 1
							})
							this.outListCamera = this.listCamera.filter( (item) =>{	//出口摄像头
								return item.direction === 0
							})
							this.inListSluice = this.listSluice.filter( (item) =>{	//进口闸口
								return item.direction === 1
							})
							this.outListSluice = this.listSluice.filter( (item) =>{	//出口闸口
								return item.direction === 0
							})

							this.inShowListCamera = []
							this.outShowListCamera = []
							//取第一个摄像头作为展示
							if (this.inListCamera && this.inListCamera.length) {
								this.inShowListCamera.push(this.inListCamera[0]) 
								//根据车道判断进出口在左还是右
								if (this.inShowListCamera[0].position === 1) {
									this.inDialogDirection = 'left'
								}else if(this.inShowListCamera[0].position === 2){
									this.inDialogDirection = 'right'
								}else{
									//如果是单车道,默认左
									this.inDialogDirection = 'left'
								}
							}else{
									//填充数据,使进出场摄像头配置至少1个占位
									let tempObj = {
										gateName: '未配置',
										deviceName: '摄像头未配置或未启用',
										device: {name: ''}
									}
									this.inShowListCamera.push(tempObj)								
							}
							//取第一个摄像头作为展示
							if (this.outListCamera && this.outListCamera.length) {
								this.outShowListCamera.push(this.outListCamera[0]) 
								//根据车道判断进出口在左还是右
								if (this.outShowListCamera[0].position === 1) {
									this.outDialogDirection = 'left'
								}else if(this.outDialogDirection[0].position === 2){
									this.outDialogDirection = 'right'
								}else{
									//如果是单车道,默认左
									this.outDialogDirection = 'right'
								}								 
							}else{
									//填充数据,使进出场摄像头配置至少1个占位
									let tempObj = {
										gateName: '未配置',
										deviceName: '摄像头未配置或未启用',
										device: {name: ''}
									}
									this.outShowListCamera.push(tempObj)								
							}			
							//控件方式连接
							if (this.videoConnectType === 'active') {
								if (this.inShowListCamera[0].device.name === '臻识R2') {
									this.zhenShiActive('zhenShi1',this.inShowListCamera[0].deviceIp)
								}
								if (this.inShowListCamera[0].device.name === '华夏') {
									this.huaXiaActive('huaXia1',this.inShowListCamera[0].deviceIp)
								}
								//出口	
								if (this.outShowListCamera[0].device.name === '臻识R2') {
									this.zhenShiActive('zhenShi2',this.outShowListCamera[0].deviceIp)
								}
								if (this.outShowListCamera[0].device.name === '华夏') {
									this.huaXiaActive('huaXia2',this.outShowListCamera[0].deviceIp)
								}																						
							}

							
                        }else{
                            this.$message.error(data.data.msg);
                        }
				})
				//建立进出口websocket连接
				this.openInCarWebsocket()
				this.openOutCarWebsocket()


			},
			//下拉框出现/隐藏时触发
			visibleGateChange(val){
				this.isShowIframeCenter = val
			},
			//重连接收进场车牌识别结果websocket连接
			openInCarWebsocket(number){
				//关闭已有连接
				try {
					this.inCarWebsocket.close()
				} catch (error) {}

				//新键接收车牌识别结果连接
				let uuid = this.Util.createUUID()

				this.inCarWebsocket = new WebsocketHeartbeatJs({
					url: `ws://${ip}/websocket/${this.gateId}/1/${uuid}`
				})		
				// this.inCarWebsocket = new ReconnectingWebSocket(`ws://${ip}/websocket/${this.gateId}/1/${uuid}`);
				// this.inCarWebsocket = new WebSocket(`ws://${ip}/websocket/${this.gateId}/1`);

				//配置客户端连接成功的回调方法
				this.inCarWebsocket.onopen = (event) => {
					console.log("成功打开进场推送websocket连接");
				};
				//配置客户端关闭成功的回调方法
				this.inCarWebsocket.onclose = (event) => {
					console.warn("关闭进场推送websocket连接");
				};

				//配置客户端处理消息的回调方法
				this.inCarWebsocket.onmessage = (event) => {
					// console.log(event)
					if(event.data.substring(event.data.length-2) !== '加入'){	//不是首次连接
						//心跳检测消息
						if (event.data === "heartbeat") {
							// console.log(event.data);
							return
						}
						//如果弹窗已打开,不处理后续数据
						if (this.isAskInParkVisible) {
							return
						}
						let eventData = JSON.parse(event.data)

						console.log('进场推送数据:');
						console.log(eventData);
						// this.inCarInfo = eventData.message.data
						this.openIsAskInParkDialog(eventData)
					}

				};	
				//配置客户端重连的回调方法
				this.inCarWebsocket.onreconnect = (event) => {
					console.log('重连进场...');
				};							
			},
			//重连接收出场场车牌识别结果websocket连接
			openOutCarWebsocket(number){
				//关闭已有连接
				try {
					this.outCarWebsocket.close()
				} catch (error) {}

				//新键接收车牌识别结果连接
				let uuid = this.Util.createUUID()
				this.outCarWebsocket = new WebsocketHeartbeatJs({
					url: `ws://${ip}/websocket/${this.gateId}/0/${uuid}`
				})
					
				// this.outCarWebsocket = new ReconnectingWebSocket(`ws://${ip}/websocket/${this.gateId}/0/${uuid}`)
				// this.outCarWebsocket = new WebSocket(`ws://${ip}/websocket/${this.gateId}/0`);

				//配置客户端连接成功的回调方法
				this.outCarWebsocket.onopen = (event) => {
					console.log("成功打开出场推送websocket连接");
				};
				//配置客户端关闭成功的回调方法
				this.outCarWebsocket.onclose = (event) => {
					console.warn("关闭出场推送websocket连接");
				};

				//配置客户端处理消息的回调方法
				this.outCarWebsocket.onmessage = (event) => {
					// console.log(event)
					if (event.data) {
						if(event.data.substring(event.data.length-2) !== '加入'){	//如果不是首次连接消息
							//心跳检测消息
							if (event.data === "heartbeat") {
								return
							}
							if (JSON.parse(event.data)) {
								this.outCarInfo = JSON.parse(event.data)
								console.log('出场推送数据:');
								console.log(this.outCarInfo);

								// 判断是否能打开收费弹窗或无进场记录弹窗,只要其中任何一个弹窗未关闭都不处理推送信息
								if (this.carNumCheckDialogVisible === true ||  this.chargeDialogVisible === true) {
									console.log('等待弹窗关闭...');
									return
								}	

								this.outCarInfo.carNum = this.outCarInfo.carNum || this.outCarInfo.carNum1 || this.outCarInfo.carNum1
								this.outCarInfo.carType = this.outCarInfo.carType1 || this.outCarInfo.carType2

								if(this.outCarInfo.errorFlag){		//计费失败
									this.outCarInfo.remarks =`<span class="text-danger">${this.outCarInfo.remarks}</span>`
									return
								}
								if(this.outCarInfo.status === -1){		//未缴费
									this.openChargeDialog()
								}else if(this.outCarInfo.status === 2){	//无进场记录
									this.openInOutRecordDialog()
								}
								else{
									this.$message({
										message:`${this.inCarInfo.carNum1}出场成功`,
										type:'success'
									})
								}								
							}

						}
					}


				};
				//配置客户端出错的回调方法
				this.outCarWebsocket.onerror = (event) => {
					console.warn("出场推送websocket连接error");
				};
				//配置客户端关闭的回调方法
				this.outCarWebsocket.onreconnect = (event) => {
					console.log('重连出场...');
				};				

			},			
			//手动进场
			manualIn(){
				this.inIsShowIframe = true

				let isSetCarmera = false
				for(let i = 0, len = this.inListCamera.length; i < len; i++){
					//未配置摄像头
					if (this.inListCamera[i].deviceName !== '摄像头未配置或未启用' && this.inListCamera[i].deviceName !== '') {
						isSetCarmera = true
						break
					}
				}	
				this.manualInProps.gateId = this.gateId

				if (isSetCarmera) {
					this.manualInProps.position = this.inListCamera[0].position	
					this.$refs.dInPark.openDialog()
				}else{
					this.$confirm('该岗亭未配置摄像头,您确定要手动进场吗？')
					.then( () => {
						this.$refs.dInPark.openDialog()
						this.manualInProps.position = 0
					})
					.catch(() => {})					
				}			

			},
			//手动出场
			//carInfo 直接计费时传,eg:无进场记录点车牌直接计费时,其它情况传false			
			manualOut(carInfo){
				this.outIsShowIframe = true

				let isSetCarmera = false	//用于判断是否配置摄像头
				for(let i = 0, len = this.outListCamera.length; i < len; i++){
					//摄像头未配置或未启用摄像头
					if (this.outListCamera[i].deviceName !== '摄像头未配置或未启用' && this.outListCamera[i].deviceName !== '') {
						isSetCarmera = true
						break
					}
				}	
				this.manualOutProps.isCharge = true
				this.manualOutProps.gateId = this.gateId
				this.manualOutProps.carNum = ''
				this.manualOutProps.carType = ''				
				if (isSetCarmera) {
					this.manualOutProps.position = this.outListCamera[0].position
					//如果已经有计费车牌,直接调计费接口
					if (carInfo) {
						this.manualOutProps.carNum = carInfo.carNum
						this.manualOutProps.carType = carInfo.carType

						let params = {
							carNum: carInfo.carNum ,
							carType: carInfo.carType ,
							deviceNo: '',
							gateId: this.gateId,
							operatorId: this.Util.userInfo.id,
							discountTime:0,
							freePay:0,
						}
						this.$refs.dOutPark.manualOutParkApi(params)

					}else{
						this.$refs.dOutPark.openDialog()
					}
				}else{
					this.$confirm('该岗亭未配置摄像头,您确定要手动出场吗？')
					.then(() => {
						this.manualOutProps.position = 0
						this.$refs.dOutPark.openDialog()
					})
					.catch(() => {});					
				}

			},
			 /**
			 * 开闸
			 * @param {String} gateType 用于区分进口,进口传"in",出口传"out"
			 */			
			openGate(gateType){
				if (gateType === 'in') {
					if (this.inListSluice.length < 1) {
						this.$message({
							type:'warning',
							message:`该岗亭未配置进口闸机`
						})	
						return				
					}					
				}else{
					if (this.outListSluice.length < 1) {
						this.$message({
							type:'warning',
							message:`该岗亭未配置出口闸机`
						})	
						return				
					}					
				}				
				this.isShowIframeCenter = true
				this.$confirm('您确定要手动开闸吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
						this.isShowIframeCenter = false
						this.loading = true
						let params = {
							type: 'gate',				//用于区分是岗亭开闸还是监控中心开闸,"center":监控中心,"gate":岗亭监控
							gateId: this.gateId,
							orderType: '',
							direction: '',
							operatorId: this.Util.userInfo.id,
							operatorName: this.Util.userInfo.realName,
							operateAddress: this.Util.getGateNameById(this.gateId,this.gateList),
							imagePath:'',
							position: ''
						}

						if (gateType === 'in') {
							this.inOpenGateloading = true
							params.orderType =  '0'
							params.direction =  '1'
							params.position =  this.inShowListCamera[0].position
						}else{
							this.outOpenGateloading = true
							params.orderType =  '0'
							params.direction =  '0'
							params.position =  this.outShowListCamera[0].position

						}					
					//截图
					html2canvas(this.$refs.imageWrapper,{
						backgroundColor: null,
					}).then((canvas) => {
						let imgBase64 = canvas.toDataURL("image/jpeg");

						params.imagePath = imgBase64
						// console.log(imgBase64);
						commGateOutPark(params)
						.then((data) => {
							this.inOpenGateloading = false
							this.outOpenGateloading = false
							this.loading = false

							if(data.code === 'SUCCESS'){
								this.$message({
									message: '操作成功',
									type: 'success'
								});

							}else{
								this.$message.error(data.msg);
							}
						})						

					});					

				}).catch(() => {
					this.isShowIframeCenter = false
					this.$message({
						type: 'info',
						message: '已取消开闸'
					});          
				});

			},
			 /**
			 * 关闸
			 * @param {String} gateType 用于区分进口,进口传"in",出口传"out"
			 */
			closeGate(gateType){
				
				let params = {
					type: 'gate',				//用于区分是岗亭开闸还是监控中心开闸,"center":监控中心,"gate":岗亭监控
					gateId: this.gateId,
					orderType: '',
					direction: '',
					operatorId:this.Util.userInfo.id,
					operatorName:this.Util.userInfo.realName,
					operateAddress:this.Util.getGateNameById(this.gateId,this.gateList),
				}

				if (gateType === 'in') {
					if (this.inListSluice.length < 1) {
						this.$message({
							type:'warning',
							message:`该岗亭未配置进口闸机`
						})	
						return				
					}					
					this.inCloseGateloading = true
					params.orderType =  '1'
					params.direction =  '1'
				}else{
					if (this.outListSluice.length < 1) {
						this.$message({
							type:'warning',
							message:`该岗亭未配置出口闸机`
						})	
						return				
					}					
					this.outCloseGateloading = true
					params.orderType =  '1'
					params.direction =  '0'
				}

				commGateOutPark(params)
				.then((data) => {
					this.inCloseGateloading = false
					this.outCloseGateloading = false
					if(data.code === 'SUCCESS'){
						this.$message({
							message: '操作成功',
							type: 'success'
						});

					}else{
						this.$message.error(data.msg);
					}
				})

			},
			//自动识别弹窗收费
			openChargeDialog(){
				this.manualOutProps = this.outCarInfo
				this.manualOutProps.gateId = this.gateId
				this.manualOutProps.isCharge = true

				this.$refs.dOutPark.autoOpenChargeDialog(this.manualOutProps)

			},
			//出口弹窗回传
			chargeCarInfo(chargeCarInfo){
				this.outIsShowIframe = false
				if (!chargeCarInfo) {
					return
				}
				console.log("出场弹窗回传数据:");
				console.log(chargeCarInfo);
				this.outCarInfo = this.Util.deepCopy(chargeCarInfo)
				this.outCarInfo.carNum = this.outCarInfo.carNum || this.outCarInfo.carNum1 || this.outCarInfo.carNum1
				this.outCarInfo.carType = chargeCarInfo.carType || chargeCarInfo.carType1 || chargeCarInfo.carType2
				this.outCarInfo.inTime = chargeCarInfo.inTime  
				this.outCarInfo.parkingTime = chargeCarInfo.parkingTime || 0
			},
			 /**
			 * 打开进场询问弹窗
			 * @param {object} eventData 进场车辆信息回传
			 */
			openIsAskInParkDialog(eventData){
				this.inIsShowIframe = false
				if (!eventData) {
					return
				}
				// console.log(eventData);
				this.inCarInfo = eventData.message.data
				if(eventData.message.code === 'SUCCESS'){		//进场成功
					this.isAskInParkVisible = false
					this.inCarInfo.remark = `<span class="text-success">进场成功</span>`

					this.$message({
						message: '进场成功',
						type:'success'
					})
				}else if(eventData.message.code ==='ALLOW_PARKIN'){		//弹窗询问
					this.inIsShowIframe = true
					this.isAskInParkVisible = true
					this.inCarInfo.remark = `<span class="text-danger">限制进场,等待处理</span>`
				}else{													//进场失败
					this.inCarInfo.remark = `<span class="text-danger">进场失败,${eventData.message.msg}</span>`
					this.$message.error(eventData.message.msg)
				}
				
			},
			//监听进场弹窗询问打开	
			listenOpenIsAskInParkDialog(){
				// let tempTime = this.isAskInParkTimeOut
					this.askCarType = this.inCarInfo.carType1
					this.isAskInParkTimeOut = 30
               		this.isAskInParkInterval =  window.setInterval(() =>{
						this.isAskInParkTimeOut --
						if (this.isAskInParkTimeOut === 0) {
							this.isAskInParkVisible = false
							this.notAllowInPark()
						}
                	}, 1000);
			},
			listenCloseIsAskInParkDialog(){
				window.clearInterval(this.isAskInParkInterval)
				this.inIsShowIframe = false
			},
			//允许弹窗询问车辆进场
			allowInPark(){
					let param = {
						"carNum1": this.inCarInfo.carNum1,
						"carNum2": this.inCarInfo.carNum2,
						"carType1": this.askCarType,
						"carType2": this.askCarType,
						"gateId": this.gateId,
						"imgPath1": this.inCarInfo.imgPath1,
						"imgPath2": this.inCarInfo.imgPath2,
						"inRemark": "弹窗询问允许进场",
						"operatorId": this.Util.userInfo.id,
						"position": this.inListCamera[0].position,						
					}
					manualPermitPark(param)
					.then((data) => {
						if(data.code === 'SUCCESS'){
							this.$message({
								message: '进场成功',
								type: 'success'
							});
							this.inCarInfo.carType1 = this.askCarType

							this.inCarInfo.remark = `<span class="text-success">进场成功</span>` 
							this.isAskInParkVisible = false
						}else{
							this.inCarInfo.remark = `<span class="text-danger">进场失败,${data.msg}</span>`
							this.$message.error(data.msg);                           
						}
					})

			},
			// 阻止进场
			notAllowInPark(){
				this.isAskInParkVisible = false
				this.inCarInfo.remark = `<span class="text-danger">进场失败,阻止进场</span>`

					let param = {
						carNum: this.inCarInfo.carNum1,
						carType: this.inCarInfo.carType1,
						imgPath: this.inCarInfo.imgPath1 || this.inCarInfo.imgPath2,
						inTime:  this.Util.formatDate.format(new Date(this.inCarInfo.inTime),'yyyy-MM-dd hh:mm:ss'),
						gateId: this.gateId,
						reasonCode: this.inCarInfo.limitCode,
						position:this.inListCamera[0].position,
						userType:this.inCarInfo.userType,
					}		
					manualRefusePark(param)
					.then((data) => {
						if(data.code === 'SUCCESS'){
						
						}else{
							this.$message.error(data.msg);
						}
					})
			},
			//无进场记录弹窗
			openInOutRecordDialog(){

				this.outIsShowIframe = true

				this.carNumCheckDialogVisible = true
				this.carNumCheckProp = this.Util.deepCopy(this.outCarInfo) 
				this.carNumCheckProp.gateId = 	this.gateId
				this.carNumCheckProp.outGateName = this.Util.getGateNameById(this.gateId,this.gateList) 
				this.carNumCheckProp.position = this.inListCamera[0].position
				this.carNumCheckProp.parkId = this.outCarInfo.parkId || JSON.parse(sessionStorage.getItem('parkInfo')).id
			},			
		
			 /**
			 * rtmp方式重连摄像头
			 * @param {String} videoid player绑定的id属性值
			 */			
			camerConnectByRtmp(videoid){
				// 通过id匹配对应的组件
				for (let i = 0; i < this.$refs.player.length; i++) {
					if (videoid === this.$refs.player[i].videoid) {
						this.$refs.player[i].connect()
						return
					}
				}
			},
			//更换视频连接方式
			videoConnectTypeChange(){
			    if(this.videoConnectType === 'active'){
					let isIE = this.Util.isBrowerIE()
					if (!isIE) {
						// this.videoConnectType = 'rtmp'
			            alert("该方式需要使用active控件，请使用IE浏览器打开！");
						return
					}

					if (this.inShowListCamera[0].device.name === '臻识R2') {
						this.zhenShiActive('zhenShi1',this.inShowListCamera[0].deviceIp)
					}
					if (this.inShowListCamera[0].device.name === '华夏') {
						this.huaXiaActive('huaXia1',this.inShowListCamera[0].deviceIp)
					}
					//出口	
					if (this.outShowListCamera[0].device.name === '臻识R2') {
						this.zhenShiActive('zhenShi2',this.outShowListCamera[0].deviceIp)
					}
					if (this.outShowListCamera[0].device.name === '华夏') {
						this.huaXiaActive('huaXia2',this.outShowListCamera[0].deviceIp)
					}					
							
				}
			},
			//手动重连摄像头
			manualReconectCamer(type){

				if (this.videoConnectType === 'active') {
					if (type === 'in') {
						if (this.inShowListCamera[0].device.name === '臻识R2') {
							this.zhenShiActive('zhenShi1',this.inShowListCamera[0].deviceIp)
						}
						if (this.inShowListCamera[0].device.name === '华夏') {
							this.huaXiaActive('huaXia1',this.inShowListCamera[0].deviceIp)
						}						
					}else{	//出口
						if (this.outShowListCamera[0].device.name === '臻识R2') {
							this.zhenShiActive('zhenShi2',this.outShowListCamera[0].deviceIp)
						}
						if (this.outShowListCamera[0].device.name === '华夏') {
							this.huaXiaActive('huaXia2',this.outShowListCamera[0].deviceIp)
						}
					}					
				}else if(this.videoConnectType === 'rtmp'){
					if (type === 'in') {
						this.camerConnectByRtmp(this.inShowListCamera[0].id)
					}else{
						this.camerConnectByRtmp(this.outShowListCamera[0].id)
					}					
				}			
			},	
			//手动切换摄像头
			manualChangeCamer(type){
				if (type === 'in') {
					if (this.inListCamera.length < 2) {
						this.$message.error('只配置了当前摄像头')
						return
					}
					for (let i = 0; i < this.inListCamera.length; i++) {	
						if (this.inListCamera[i].id !== this.inShowListCamera[0].id) {
							this.inShowListCamera = []
							this.inShowListCamera.push(this.inListCamera[i])
							break
						}
					}					
					if (this.videoConnectType === 'active') {
						if (this.inShowListCamera[0].device.name === '臻识R2') {
							this.zhenShiActive('zhenShi1',this.inShowListCamera[0].deviceIp)
						}
						if (this.inShowListCamera[0].device.name === '华夏') {
							this.huaXiaActive('huaXia1',this.inShowListCamera[0].deviceIp)
						}
					}

				}else{	//出口
					if (this.outListCamera.length < 2) {
						this.$message.error('只配置了当前摄像头')
						return
					}
					for (let i = 0; i < this.outListCamera.length; i++) {	
						if (this.outListCamera[i].id !== this.outShowListCamera[0].id) {
							this.outShowListCamera = []
							this.outShowListCamera.push(this.outListCamera[i])
							break
						}
					}
					if (this.videoConnectType === 'active') {
						if (this.outShowListCamera[0].device.name === '臻识R2') {
							this.zhenShiActive('zhenShi2',this.outShowListCamera[0].deviceIp)
						}
						if (this.outShowListCamera[0].device.name === '华夏') {
							this.huaXiaActive('huaXia2',this.outShowListCamera[0].deviceIp)
						}						
					}					
				}				
			},
			//根据控件连摄像头(臻识)
			zhenShiActive(id,ip){
                window.setTimeout(() =>{
					console.log(id+'--'+ip);
					try {
						let rtsp = `rtsp://${ip}:8557/h264`
						let ax = this.Util.getAX(id);
						if(ax){
							ax.StreamClient_StartPlay(rtsp);
						}
					} catch (error) {
						if(confirm("检测到没有安装臻识active控件,请点击下载并按指示安装")){
							let URLStr = `${downloadActive}/streamocx.msi`
							this.Util.ieExportExcel(URLStr)				
						}
					 }
                }, 500)				
				
			},	
			//根据控件连摄像头(华夏)
			huaXiaActive(id,ip){

                window.setTimeout(() =>{
					console.log(id+'--'+ip);
					
					try {
						let ax = this.Util.getAX(id);
						window.hSDK = 0;
						window.hSDK = hvactivex2.ICE_IPCSDK_Open(ip, 0);	
						ax.ipstr = ip;	
					} catch (error) {
						console.log(error);
						if(confirm("检测到没有安装华夏active控件,请点击下载并按指示安装")){
							// let URLStr = `${downloadActive}/ax_huaxia.zip`
							let URLStr = `${downloadActive}/axvdc_setup_1.0.0.78_32.exe`
							this.Util.ieExportExcel(URLStr) 
						}						
					}					

                }, 500)					
												
			},													

		},

	}

</script>

<style lang="scss" scoped>	
	.content{
		.content-head{
			padding: 6px 22px;
			.region-space-info{
				span{
					font-size: 18px;
				}
			}
		}
		.content-body{
			width: 50%;
			.content-box{
				margin: 0 10px;
				padding: 6px 0px ;
				background: $color-gray;
				box-shadow:0px 1px 5px #908f8f;			
				.monitor{
					.screen{
						margin: -1px;
						box-sizing: border-box;
						display: inline-table;
						width: 100%;
						min-width: 412px;
						max-width: 610px;
						height: 412px;
						max-height: 412px;
						.screen-title{
							box-sizing: border-box;
							margin: 0;
							padding: 2px;
						}
						.screen-img{
							box-sizing: border-box;
							border: 1px solid $color-blue;
							background: #fff;
							min-width: 100%;	
							min-height: 374px;
							max-height: 374px;
						}
					}
				}
				.car-info{
					.info-h2{
						margin: 0;
						color: $color-orange;
					}
					.info-box{
						margin: 10px;
						padding: 10px;
						border-radius: 10px;
						box-sizing:border-box; 
						background: #fff;
						min-height: 245px;
						.info-head{
							span{
								display: inline-block;
								width:24%;
								font-size: 26px;
								font-weight: bold;
							}
							.info-carnum{
								color: #fff;
								text-align: left;
								span{
									display: inline;
									border-radius:6px; 
									background: $color-orange;
								}
							}
							.info-usertype{
								color: $color-orange;
								text-align: right;
							}												
						}
						.info-body-left{
							float: left;
							width: 50%;
						}
						.info-body-right{
							float: right;
							width: 50%;
						}	
						p{
							margin: 10px 0px;
							font-size: 20px;
						}									

					}
				}	
				.menu{
					.menu-item1{
						display: inline-block;
						width: 49%;
						box-sizing: border-box;
						padding: 10px;
					}
					.menu-item2{
						display: inline-block;
						width: 50%;
						box-sizing: border-box;
						padding:10px;
					}				
				}
			}			
		}

		.sm-dialog{
			.dialog-box{
				.scanpay-input {
					width:80%;
					margin: 20px 0px;
				}			

			}
			.dialog-footer{
				padding: 20px;
				text-align: center;
				.footer-btn{
					font-weight: bold;
					// width:120px;
				}
			}
		}
			
	}
	.jw-reset {
		color: inherit;
		background-color: transparent;
		padding: 0;
		margin: 0;
		float: none;
		font-family: Arial,Helvetica,sans-serif;
		font-size: 1em;
		line-height: 1em;
		list-style: none;
		text-align: left;
		text-transform: none;
		vertical-align: baseline;
		border: 0;
		direction: ltr;
		font-variant: inherit;
		font-stretch: inherit;
		-webkit-tap-highlight-color: rgba(255,255,255,0);
	}	


	
</style>
