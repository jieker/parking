<!--监控中心-->
<template>	
	<div class="imageWrapper" ref="imageWrapper">
		<el-row class="content"  v-loading="loading" >
		
			<!-- 岗亭循环 -->
			<el-col :span="12" v-for="item1 in gateSettingsList" :key="item1.id">
				<!-- 入口	 -->
				<el-col :span="12" >
					<div class="content-border">
						<div class="content-box" >
							<div class="monitor text-center">
								<p class="monitor-gatename text-left"><b>岗亭名称：</b>{{item1.gateName}}</p>
								<div class="screen" v-for="item2 in item1.inShowListCamera" :key="item2.id">
									<div class="monitor-gatename text-right">
										<span>{{item2.deviceName}}</span>
										<el-tooltip  effect="dark" content="重连摄像头" placement="bottom">
											<a href="javaScript:;" class="text-orange " @click="camerConnect(item2.id)">重连<i class="font-size-16 el-icon-refresh"></i></a>
										</el-tooltip>	
										<el-tooltip  effect="dark" content="切换摄像头" placement="bottom">
											<a href="javaScript:;" class="text-orange " @click="camerChange('in',item1,item2)">切换<i class="font-size-16 fa fa-exchange"></i></a>
										</el-tooltip>																									
									</div>
									<player ref="player" :videoid="item2.id" width="100%" height="310"  :videosrc="item2.videoPath"></player>
								</div>
								<div class="screen not-screen" v-show="item1.inListCamera.length < 1">该岗亭下没有入口摄像头配置</div>
							</div>
							<div class="menu ">
								<div class="menu-box clearfix">
									<div class="menu-item1 float-left text-left">
										<el-button type="primary" size="mini" @click="openGate('in',item1)">开闸</el-button>
										<el-button type="primary" size="mini" @click="closeGate('in',item1)">关闸</el-button>								
									</div>
									<div class="menu-item2 float-right text-right">
										<el-button type="primary" size="mini" @click="manualIn(item1)" v-if="markMonitorCenterManualIn">手动入场</el-button>
									</div>
								</div>					
							</div>
						</div>
						<p class="text-center" v-show="gateSettingsList.length<1">暂无数据,请先配置停车场信息</p>
					</div>
				</el-col>
				<!-- 出口	 -->
				<el-col :span="12" >
					<div class="content-border">
						<div class="content-box" >
							<div class="monitor text-center">
								<p class="monitor-gatename text-left"><b>岗亭名称：</b>{{item1.gateName}}</p>
								<div class="screen" v-for="item2 in item1.outShowListCamera" :key="item2.id">
									<div class="monitor-gatename text-right">
										<span>{{item2.deviceName}}</span>
										<el-tooltip  effect="dark" content="重连摄像头" placement="bottom">
											<a href="javaScript:;" class="text-orange " @click="camerConnect(item2.id)">重连<i class="font-size-16 el-icon-refresh"></i></a>
										</el-tooltip>	
										<el-tooltip  effect="dark" content="切换摄像头" placement="bottom">
											<a href="javaScript:;" class="text-orange " @click="camerChange('out',item1,item2)">切换<i class="font-size-16 fa fa-exchange"></i></a>
										</el-tooltip>																									
									</div>	
									<player ref="player"  :videoid="item2.id" width="100%" height="310" :videosrc="item2.videoPath"></player>
								</div>
								<div class="screen not-screen" v-show="item1.outListCamera.length < 1">摄像头未配置或未启用</div>
							</div>
							<div class="menu text-left">
								<div class="menu-box clearfix">
									<div class="menu-item1 float-left text-left">
										<el-button type="primary" size="mini" @click="openGate('out',item1)">开闸</el-button>
										<el-button type="primary" size="mini" @click="closeGate('out',item1)">关闸</el-button>
									</div>
									<div class="menu-item2 float-right text-right">

										<el-button type="primary" size="mini" @click="manualOut(item1)" v-if="markMonitorCenterManualOut">手动出场</el-button>
									</div>
								</div>					
							</div>
						</div>
						<p class="text-center" v-show="gateSettingsList.length<1">暂无数据,请先配置停车场信息</p>
					</div>	
				</el-col>
			</el-col>
			<el-col :span="24" v-show="gateSettingsList.length<1">
				<p class="text-center">请先在停车场设置处配置岗亭</p>		
			</el-col>
			<el-col :span="24" class="content-paging">
				<div class="body-paging text-center elPag">
					<el-pagination
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						:current-page.sync="currentPage"
						:page-sizes="[2, 4, 6, 8]"
						:page-size="4"
						layout="total,sizes,prev, pager, next, jumper"
						:total="dataTotal">
					</el-pagination>
					<el-button type="primary" class="PagGo">GO</el-button>
				</div>
			</el-col>
			<!-- 弹窗-手动进出场 -->
			<d-in-park :manual-in-props="manualInProps" direction="center" width="50%" ref="dInPark" @openIsAskInParkDialog="openIsAskInParkDialog"></d-in-park>
			<d-out-park :manual-out-props="manualOutProps" direction="center" width="50%" ref="dOutPark" ></d-out-park>		
			<!-- 进出场推送信息 -->
			<in-and-out-car-info></in-and-out-car-info>
		</el-row>
			
	</div>
</template>

<script>
	import { mapGetters,mapActions} from 'vuex'
	import {ip,getParkCenterList,commGateOutPark,manualAddParkRecord} from '@/api/api'
	import html2canvas from 'html2canvas'
	

	export default {
		components: {
			'InAndOutCarInfo': () => import('./InAndOutCarInfo.vue'),
		},		
		data() {
			return {

				loading:false,
				pageSize:4,
				dataTotal:0,
				currentPage:1,	

				gateSettingsList:[],		//所有岗亭配置列表

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

				markMonitorCenterManualIn: false,
				markMonitorCenterManualOut: false,
				
			}
		},
		computed: {
			...mapGetters({
				gateList: 'getGateList',
			}),
        },		
		mounted(){
			this.markMonitorCenterManualIn = this.Util.isPermission('markMonitorCenterManualIn')
			this.markMonitorCenterManualOut = this.Util.isPermission('markMonitorCenterManualOut')

			this.getParkCenterList()
		},
		beforeUpdate(){
			try {
				let menuNode = document.getElementsByClassName('menu-active')
				menuNode[0].classList.remove('menu-active')  
			} catch (error) {}			
			document.getElementById("menu-box-1").classList.add("menu-active")				
		},		
		methods: {
			//查岗亭硬件配置
			//@param {booleal} isGlobal 是否是全局搜索,true表示是,当前页要置为1
			getParkCenterList(isGlobal){
				if(isGlobal){
					this.currentPage = 1
				}				
				this.loading = true
				let params = {
					current:this.currentPage,     
					length:this.pageSize,
				}
				getParkCenterList(params)
					.then( (data) => {
						if(data.data.code === 'SUCCESS'){
						
							//赋值新数据
							let parkCenterList = data.data.data.content
							this.dataTotal = data.data.data.totalElements
							for(let i = 0, len = parkCenterList.length; i < len; i++){
								let listCamera = parkCenterList[i].listCamera
								let listSluice = parkCenterList[i].listSluice

								let inListCamera = listCamera.filter( (item) =>{	//进口摄像头
									return item.direction === 1
								})
								let outListCamera = listCamera.filter( (item) =>{	//出口摄像头
									return item.direction === 0
								})
								let inListSluice = listSluice.filter( (item) =>{	//进口闸口
									return item.direction === 1
								})
								let outListSluice = listSluice.filter( (item) =>{	//出口闸口
									return item.direction === 0
								})

								parkCenterList[i].inListCamera = inListCamera		//总配置的进口摄像头
								parkCenterList[i].inShowListCamera = []				//显示的进口摄像头
								if (inListCamera && inListCamera.length) {
									parkCenterList[i].inShowListCamera.push(inListCamera[0])		//默认显示第一个					
								}				

								parkCenterList[i].outListCamera = outListCamera		//总配置的出口摄像头
								parkCenterList[i].outShowListCamera = []				//显示的出口摄像头
								if (outListCamera && outListCamera.length) {
									parkCenterList[i].outShowListCamera.push(outListCamera[0])		//默认显示第一个					
								}		

								parkCenterList[i].inListSluice = inListSluice						
								parkCenterList[i].outListSluice = outListSluice	
                   

							}

							this.gateSettingsList = parkCenterList
							this.loading = false						

						}else{
							this.$message.error(data.data.msg);                        
						}
				}).catch(err => {
					this.loading = false
				}) 				
			},	
			//手动进场		
			manualIn(item){
				// console.log(item);
				if (item.inListCamera && item.inListCamera.length) {
					this.manualInProps.gateId = item.id					
					this.manualInProps.position = item.inShowListCamera[0].position					
					this.$refs.dInPark.openDialog()
				}else{
					this.$confirm('该岗亭未配置摄像头,您确定要手动进场吗？')
					.then( () => {
						this.manualInProps.gateId = item.id					
						this.manualInProps.position = 0						
						this.$refs.dInPark.openDialog()
					})
					.catch(() => {})					
				}

			},
			//手动出场		
			manualOut(item){
				this.manualOutProps.gateId = item.id				
				this.manualOutProps.isCharge = false
				this.manualOutProps.carNum = ''
				this.manualOutProps.carType = ''				

				if (item.outListCamera && item.outListCamera.length) {
					this.manualOutProps.position = item.outShowListCamera[0].position
					this.$refs.dOutPark.openDialog()
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
			 * @param {String} gateType 进口还是出口,"in","out"
			 * @param {object} item1 闸口信息
			 */			
			openGate(gateType,item1){
				if (gateType === 'in') {
					if (item1.inListSluice.length < 1) {
						this.$message({
							type:'warning',
							message:`该岗亭未配置进口闸机`
						})	
						return				
					}					
									
				}else{
					if (item1.outListSluice.length < 1) {
						this.$message({
							type:'warning',
							message:`该岗亭未配置出口闸机`
						})	
						return				
					}					
				}
				this.$confirm('您确定要手动开闸吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = {
						type: 'center',				//用于区分是岗亭开闸还是监控中心开闸,"center":监控中心,"gate":岗亭监控
						gateId: item1.id,
						orderType: '',
						direction: '',
						operatorId: this.Util.userInfo.id,
						operatorName: this.Util.userInfo.realName,
						operateAddress: this.Util.getGateNameById(this.gateId,this.gateList),
						imagePath:'',	
						position: ''					
					}

					if (gateType === 'in') {
						params.orderType =  '0'
						params.direction =  '1'	
						params.position =  item1.inListSluice[0].position	
										
					}else{
						params.orderType =  '0'
						params.direction =  '0'	
						params.position =  item1.outListSluice[0].position	

					}

					//截图
					html2canvas(this.$refs.imageWrapper,{
						backgroundColor: null,
					}).then((canvas) => {
						let imgBase64 = canvas.toDataURL("image/jpeg");

						params.imagePath = imgBase64
						console.log(imgBase64);
						commGateOutPark(params)
						.then((data) => {
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
					this.$message({
						type: 'info',
						message: '已取消开闸'
					});          
				});

			},	
			/**
			 * 关闸
			 * @param {String} gateType 进口还是出口,"in","out"
			 * @param {object} item1 闸口信息
			 */	
			closeGate(gateType,item1){
				// console.log(item1)
				let params = {
					type: 'center',				//用于区分是岗亭开闸还是监控中心开闸,"center":监控中心,"gate":岗亭监控
					gateId: item1.id,
					orderType: '',
					direction: '',
				}

				if (gateType === 'in') {
					if (item1.inListSluice.length < 1) {
						this.$message({
							type:'warning',
							message:`该岗亭未配置进口闸机`
						})	
						return				
					}					
					params.orderType =  '1'
					params.direction =  '1'
				}else{
					if (item1.outListSluice.length < 1) {
						this.$message({
							type:'warning',
							message:`该岗亭未配置出口闸机`
						})	
						return				
					}					
					params.orderType =  '1'		
					params.direction =  '0'					
				}

				commGateOutPark(params)
				.then((data) => {
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
			// 手动进场回传数据
			openIsAskInParkDialog(eventData){
				console.log(eventData);
			},
			//切换摄像头
			camerChange(type,item1,item2){
				if (type === 'in') {
					if (item1.inListCamera.length < 2) {
						this.$message.error('只配置了当前摄像头')
						return
					}
					for (let i = 0; i < item1.inListCamera.length; i++) {	
						if (item1.inListCamera[i].id !== item2.id) {
							item1.inShowListCamera = []
							item1.inShowListCamera.push(item1.inListCamera[i])
						}
					}
				}else{
					if (item1.outListCamera.length < 2) {
						this.$message.error('只配置了当前摄像头')
						return
					}
					for (let i = 0; i < item1.outListCamera.length; i++) {	
						if (item1.outListCamera[i].id !== item2.id) {
							item1.outShowListCamera = []
							item1.outShowListCamera.push(item1.outListCamera[i])
						}
					}
				}

			},
			//重连摄像头
			camerConnect(videoid){
				console.log(this.$refs.player);
				//根据id匹配,然后重连
				for (let i = 0; i < this.$refs.player.length; i++) {
					if (videoid === this.$refs.player[i].videoid) {
						this.$refs.player[i].connect()
						return
					}
				}
			},
			//页码改变
			handleSizeChange(val) {
				this.pageSize = val
				this.getParkCenterList(false)
			},
			//页改变
			handleCurrentChange(val) {
				this.getParkCenterList(false)
			},									
					
		},
	}

</script>

<style lang="scss" scoped>
.imageWrapper{
	.content{
		margin:6px 6px;
		padding-bottom: 8px;
		background-color: $color-gray;
		box-shadow:0px 1px 5px #908f8f;			
		.content-head{
			padding: 6px 22px;
			background-color: #fff;
		}			
		.content-border{
			.content-box{
				.monitor{
					.monitor-gatename{
						margin: 2px;
					}
					.screen{
						box-sizing: border-box;
						display: inline-table;
						width: 100%;
						height: 333px;
						.screen-title{
							box-sizing: border-box;
							margin: 0;
							padding: 0px 8px 8px 8px;
						}
					}
					.not-screen{
						color: #fff;
						background-color: $color-black;
					}
				}	
				.menu{
					padding: 3px 0px;
					margin:0 5px;
					background-color: #fff;
					.menu-box{
						padding: 0 8px;
						box-sizing: border-box;
						.menu-item1{
							width: 49%;
						}
						.menu-item2{
							width: 49%;
						}
					}
					
				}
			}

		}			
	}
}

</style>
