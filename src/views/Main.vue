<template>
    <section>
		<el-row class="container">
			<!-- 头部 -->
			<el-col :span="24" class="header">
				<el-col :span="3" class="logo">
					<img class="logo-img" src="../assets/img/mallparking_logo.png" alt="小猫停车">
				</el-col>
				<el-col :span="4" class="user">
					<div class="user-name">
						 <i class="fa fa-user-circle" aria-hidden="true"></i>{{sysUserName}}
						<el-button size="mini" type="warning" @click="Handover" v-show="Util.userInfo.positionType ==='岗亭' || Util.userInfo.positionType ==='收费中心'">交班</el-button>
					</div>
					<div class="login-time">登录时间:{{loginTime}}</div>
				</el-col>
				<el-col :span="2" class="time">
					<p class="time-clock">{{time_ymd}}</p>
					<p class="time-clock">{{time_hsm}}</p>					
				</el-col>				
				<el-col :span="15" class="menu clearfix">
					<div>
						<div class="menu-page text-center">
							<el-tooltip class="item" effect="light"  content="全屏" placement="bottom">
								<i class="fa fa-arrows-alt" @click='fullScreen'></i>
							</el-tooltip>						
						</div>					
						<div class="menu-box" id="menu-box-7" @mousemove.stop="showSetingMenu" @mouseout.stop="hideSetingMenu" v-if="markSetting">
							<p class="menu-inoc"><i class="icon-03" aria-hidden="true"></i></p>
							<p class="menu-text un-select">设置</p>
							<el-collapse-transition>
								<ul v-show="isSetingMenuShow" class="setting-menu" @mousemove.stop="showSetingMenu" @mouseout.stop="hideSetingMenu">
									<li class="setting-menu-li" @click="openMainDialog('parkingSetProp')" v-if="markSettingPark">
										停车场设置
									</li>
									<li class="setting-menu-li" @click="openMainDialog('hardwareSetProp')" v-if="markSettingHardware">
										硬件设置
									</li>
									<li class="setting-menu-li" @click="openMainDialog('approachRulesProp')" v-if="markSettingRule">
										进场规则
									</li>
									<li class="setting-menu-li" @click="openMainDialog('feesListProp')" v-if="markSettingFees">
										收费标准
									</li>
									<li class="setting-menu-li" @click="openMainDialog('tempCarProp')" v-if="markSettingTempCar">
										常进临时车
									</li>
									<li class="setting-menu-li" @click="openMainDialog('blacklistProp')" v-if="markSettingBlackList">
										黑名单
									</li>
									<li class="setting-menu-li" @click="openMainDialog('systemLogProp')" v-if="markSettingSystemLogQuery">
										系统日志
									</li>
									<li class="setting-menu-li" @click.stop="menuActive($event,'ManageUser',true)" v-if="markManageUser">
										用户管理
									</li>
									<li class="setting-menu-li" @click.stop="menuActive($event,'ManageRole',true)" v-if="markManageRole">
										角色管理
									</li>
									<li class="setting-menu-li" @click.stop="menuActive($event,'ManagePermission',true)" v-if="markManagePermission">
										权限管理
									</li>
									<li class="setting-menu-li" @click.stop="menuActive($event,'CancelCharge',true)" v-if="markSettingDataSum">
										数据与统计
									</li>
									<li class="setting-menu-li" @click="openMainDialog('modifyPasswordProp')">修改密码</li>
									<li class="setting-menu-li" @click="logout" >退出登录</li>
								</ul>
							</el-collapse-transition>							
						</div>
						<div class="menu-box" id="menu-box-6" @click.stop="menuActive($event,'VIPInfo',false)" v-if="markFinancialBtn">
							<p class="menu-inoc"><i class="icon-04" aria-hidden="true"></i></p>
							<p class="menu-text un-select">财务端</p>
						</div>
						<div class="menu-box" id="menu-box-5" @click.stop="openMainDialog('chargeInfoProp')" v-if="markChargeInfoQuery">
							<p class="menu-inoc"><i class="icon-05" aria-hidden="true"></i></p>
							<p class="menu-text un-select">收费情况</p>
						</div>	
						<div class="menu-box" id="menu-box-4" @click.stop="openMainDialog('membersInfoProp')" v-if="markMemberInfoQuery">
							<p class="menu-inoc"><i class="icon-07" aria-hidden="true"></i></p>
							<p class="menu-text un-select">会员信息</p>
						</div>
						<div class="menu-box" id="menu-box-3" @click.stop="openMainDialog('inOutRecordProp')" v-if="markInAndOutRecord">
							<p class="menu-inoc"><i class="icon-02" aria-hidden="true"></i></p>
							<p class="menu-text un-select">进出场记录</p>
						</div>
						<div class="menu-box" id="menu-box-2" @click.stop="menuActive($event,'Watchhouse',false)" v-if="markWatchhouse">
							<p class="menu-inoc"><i class="icon-06" aria-hidden="true"></i></p>
							<p class="menu-text un-select">岗亭监控</p>
						</div>
						<div class="menu-box" id="menu-box-1" @click.stop="menuActive($event,'MonitorCenter',false)" v-if="markMonitorCenter">
							<p class="menu-inoc"><i class="icon-01" aria-hidden="true"></i></p>
							<p class="menu-text un-select">监控中心</p>
						</div>	
						<div class="menu-box" id="menu-box-0" @click.stop="menuActive($event,'InCarInfo',false)" v-if="markInCarInfo">
							<p class="menu-inoc"><i class="icon-00" aria-hidden="true"></i></p>
							<p class="menu-text un-select">收费中心</p>
						</div>	
			
					</div>
				</el-col>
			</el-col>

			<!-- 内容 -->
			<el-col :span="24" class="main">
				<router-view></router-view>
			</el-col>

			<!-- 弹窗-设置 -->
			<el-col :span="24">
				<!-- 停车场设置 -->
				<d-parking-set :parking-set-prop="parkingSetProp" @listenCloseMainDialog="listenCloseMainDialog"></d-parking-set>	
				<!-- 硬件设置 -->
				<d-hardware-set :hardware-set-prop="hardwareSetProp"  ref="hardwareSet" @listenCloseMainDialog="listenCloseMainDialog"></d-hardware-set>							
				<!-- 临时车 -->
				<d-temp-car :temp-car-prop="tempCarProp" @listenCloseMainDialog="listenCloseMainDialog"></d-temp-car>
				<!-- 收费标准 -->
				<d-fees-list :fees-list-prop="feesListProp" @listenCloseMainDialog="listenCloseMainDialog"></d-fees-list>
				<!-- 系统日志 -->
				<d-system-log :system-log-prop="systemLogProp" @listenCloseMainDialog="listenCloseMainDialog"></d-system-log>
				<!-- 进场规则 -->
				<d-approach-rules :approach-rules-prop="approachRulesProp" @listenCloseMainDialog="listenCloseMainDialog"></d-approach-rules>
				<!-- 黑名单 -->
				<d-black-list :blacklist-prop="blacklistProp" @listenCloseMainDialog="listenCloseMainDialog"></d-black-list>	
				<!-- 修改密码 -->
				<d-modify-password :modify-password-prop="modifyPasswordProp" @listenCloseMainDialog="listenCloseMainDialog"></d-modify-password>	

				<!-- 会员信息 -->
				<d-members-info :members-info-prop="membersInfoProp" @listenCloseMainDialog="listenCloseMainDialog"></d-members-info>	
				<!-- 收费情况 -->			
				<d-charge-info :charge-info-prop="chargeInfoProp" @listenCloseMainDialog="listenCloseMainDialog"></d-charge-info>		
				<!-- 进出场记录 -->			
				<d-in-out-record :in-out-record-prop="inOutRecordProp" @listenCloseMainDialog="listenCloseMainDialog"></d-in-out-record>
			</el-col>

		</el-row>	
		<!-- 遮罩,弹窗使用 -->
		<shade :visible.sync="isShowIframe" ></shade>
		<!-- 遮罩,系统设置下拉选使用 -->
		<shade :visible.sync="isShowIframe2" top="80"></shade>
    </section>
</template>
<script>
	import { mapGetters,mapActions,mapMutations} from 'vuex'
	import {ip,logoutAPI,listDeviceInfo,getParkCenterList,Handover,getParkAllInfo,commonTime} from '@/api/api'
	import screenfull from 'screenfull'
	
	export default {	
		components: {
			'DHardwareSet': () => import('./mainDialog/DHardwareSet.vue'),
            'DSystemLog': () => import('./mainDialog/DSystemLog.vue'),
			'DParkingSet': () => import('./mainDialog/DParkingSet.vue'),
			'DTempCar': () => import('./mainDialog/DTempCar.vue'),
			'DBlackList': () => import('./mainDialog/DBlackList.vue'),
            'DFeesList': () => import('./mainDialog/DFeesList.vue'),
			'DApproachRules': () => import('./mainDialog/DApproachRules.vue'),
			'DModifyPassword': () => import('./mainDialog/DModifyPassword.vue'),
			
			'DMembersInfo': () => import('@/views/bsclient/membersInfo/MembersInfo.vue'),
			'DChargeInfo': () => import('@/views/bsclient/chargeInfo/ChargeInfo.vue'),
			'DInOutRecord': () => import('@/views/bsclient/inOutRecord/InOutRecord.vue'),
		},
		data() {
			return {
				sysUserName: '未登录',			//登录用户名
				loginTime: '',					//登录时间
				time_ymd: '2018-01-01',			//时钟-yyyy/MM/dd
				time_hsm: '00:00:01',			//时钟-hh/mm/sss
				isSetingMenuShow: false,		//控制下拉选的显示与隐藏
				isShowIframe: false,			//是否显示iframe遮罩层
				isShowIframe2: false,			//是否显示iframe遮罩层

				modifyPasswordProp: {
					visible:false
				},
				hardwareSetProp: {
					visible:false,
					gateId:''
				},
				parkingSetProp: {
					visible:false
				},
                systemLogProp: {
                    visible:false
                },
				tempCarProp: {
					visible:false
				},
                feesListProp: {
                    visible:false
                },
                approachRulesProp: {
                    visible:false
                },
                blacklistProp: {
					visible:false
				},
				membersInfoProp:{
					visible:false
				},	
				chargeInfoProp:{
					visible:false
				},
				inOutRecordProp:{
					visible:false
				},	
				
				//用于权限控制显示隐藏
				markInCarInfo:false,	
				markMonitorCenter:false,									
				markWatchhouse:false,	
				markInAndOutRecord:false,								
				markMemberInfoQuery:false,									
				markChargeInfoQuery:false,									
				markFinancialBtn:false,									
				markSetting:false,	

				markSettingSystemLogQuery:false,
				markSettingPark:false,									
				markSettingHardware:false,									
				markSettingRule:false,									
				markSettingFees:false,									
				markSettingTempCar:false,									
				markSettingBlackList:false,									
				markManageUser:false,									
				markManageRole:false,									
				markManagePermission:false,	
				markSettingDataSum:false,

			}
		},
		computed: {
			...mapGetters({
				gateList: 'getGateList',	
			}),
		},		
		
		mounted(){
			this.markInCarInfo = this.Util.isPermission('markInCarInfo')
			this.markMonitorCenter = this.Util.isPermission('markMonitorCenter')
			this.markWatchhouse = this.Util.isPermission('markWatchhouse')
			this.markInAndOutRecord = this.Util.isPermission('markInAndOutRecord')
			this.markMemberInfoQuery = this.Util.isPermission('markMemberInfoQuery')
			this.markChargeInfoQuery = this.Util.isPermission('markChargeInfoQuery')
			this.markFinancialBtn = this.Util.isPermission('markFinancialBtn')
			this.markSetting = this.Util.isPermission('markSetting')

			this.markSettingPark = this.Util.isPermission('markSettingPark')
            this.markSettingSystemLogQuery = this.Util.isPermission('markSettingSystemLogQuery')
			this.markSettingHardware = this.Util.isPermission('markSettingHardware')
			this.markSettingRule = this.Util.isPermission('markSettingRule')
			this.markSettingFees = this.Util.isPermission('markSettingFees')
			this.markSettingTempCar = this.Util.isPermission('markSettingTempCar')
			this.markSettingBlackList = this.Util.isPermission('markSettingBlackList')
			this.markManageUser = this.Util.isPermission('markManageUser')
			this.markManageRole = this.Util.isPermission('markManageRole')
			this.markManagePermission = this.Util.isPermission('markManagePermission')
			this.markSettingDataSum = this.Util.isPermission('markSettingDataSum')

			this.sysUserName = this.Util.userInfo.realName
			this.loginTime = this.Util.userInfo.createTime

			this.commonTime()
			this.getParkAllInfo()
			//初始化store里岗亭和停车场全局配置
			this.setGateList({operatorId: this.Util.userInfo.id})
			this.setParkGlobalSet({operatorId: this.Util.userInfo.id})			

		},		
		methods: {
			...mapActions(['setGateList','setParkGlobalSet',]),	

			//打开弹窗
			//type {String} 打开的弹窗对应的prop名
			openMainDialog(type){
				this.isShowIframe = true
				switch (type) {
					case 'inOutRecordProp':
						this.inOutRecordProp.visible = true
						break;
					case 'membersInfoProp':
						this.membersInfoProp.visible = true
						break;
					case 'chargeInfoProp':
						this.chargeInfoProp.visible = true
						this.chargeInfoProp.carNum = ''
						this.chargeInfoProp.date = null
						break;
					case 'parkingSetProp':
						this.parkingSetProp.visible = true
						break;
					case 'hardwareSetProp':
						this.hardwareSetProp.visible = true
						this.hardwareSetProp.gateId = this.gateList.length ? this.gateList[0].id : ''
						break;
					case 'approachRulesProp':
						this.approachRulesProp.visible = true
						break;
					case 'feesListProp':
						this.feesListProp.visible = true
						break;
					case 'tempCarProp':
						this.tempCarProp.visible = true
						break;
					case 'blacklistProp':
						this.blacklistProp.visible = true
						break;
					case 'systemLogProp':
						this.systemLogProp.visible = true
						break;
					case 'modifyPasswordProp':
						this.modifyPasswordProp.visible = true
						break;
					default:
						break;
				}
			},
			//监听关闭main弹窗,用于子组件emit的回调
			listenCloseMainDialog(){
				this.isShowIframe = false
			},
			//显示设置下拉菜单
			showSetingMenu(){
				this.isShowIframe2 = true 			
				this.isSetingMenuShow = true 
			},
			//显示设置下拉菜单
			hideSetingMenu(){
				this.isSetingMenuShow = false 
				this.isShowIframe2 = false				
			},			

			//全屏切换
			fullScreen() {
				if (!screenfull.enabled) {
					this.$message({
						message: '你的浏览器不能正常工作',
						type: 'warning'
					})
					return false
				}
				screenfull.toggle()
			},		
		
			/**
			 * 头部菜单点击事件
			 * @param {event} event 事件
			 * @param {String} router 要跳转的路由
			 * @param {boolean} isSetting 是否是设置下拉菜单
			 */			
			menuActive(event,router,isSetting){
				let menuNode = document.getElementsByClassName('menu-active')
				menuNode[0].classList.remove('menu-active')

				if (isSetting) {
					event.currentTarget.parentElement.parentElement.classList.add('menu-active')
				}else{
					event.currentTarget.classList.add('menu-active')
				}
				this.$router.push(router)
			},
			//退出系统
			logout(){
				this.isShowIframe = true
				this.$confirm('您确定要退出登录吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.isShowIframe = false
					logoutAPI({}).then(res=>{
						// console.log(res)
						if(res.code === 'SUCCESS'){
							//清除session
							sessionStorage.removeItem('userInfo')
							sessionStorage.removeItem('userPermission')
							sessionStorage.removeItem('userPermissionMarkList')
							sessionStorage.removeItem('commonTime')
							sessionStorage.removeItem('parkInfo')							
							//跳转到登录页
							this.$router.push('/')											
						}else {
							this.$message.error(res.msg)
						}
						}).catch(err=>{
							this.loading = false
						})					

				}).catch(() => {
					this.isShowIframe = false

					this.$message({
						type: 'info',
						message: '已取消操作'
					});          
				});				
			},
            //交接班
            Handover(){
				this.isShowIframe = true

                this.$confirm('您确定要交接班吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
					this.isShowIframe = false

                    Handover({}).then(res=>{
                        console.log(res)
                        if(res.code === 'SUCCESS'){
                            this.$message({
                                type: 'success',
                                message: '交接班成功!'
                            });

                            //跳转到登录页
                            this.$router.push('/')
                        }else {
                            this.$message.error(res.msg)
                        }
                    }).catch(err=>{
                        this.loading = false
                    })

                }).catch(() => {
					this.isShowIframe = false

                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
			},
			//查停车场及区域信息
			getParkAllInfo(){
				getParkAllInfo({operatorId: this.Util.userInfo.id})
					.then( (data) => {
						if(data.data.code === 'SUCCESS'){
							if(data.data.data ){
								sessionStorage.setItem('parkInfo',JSON.stringify(data.data.data[0]))   
							}
						
						}else{
							this.$message.error(data.data.msg);                             
						}                                              
					})            
			},
			//查找系统时间并生成时钟
            commonTime(){
                commonTime()
					.then( (data) => {
					    if(data.code === "SUCCESS"){
							let serverTime = data.data

							let interval = setInterval( ()=> {
								let temp = this.Util.formatDate.format(new Date(serverTime),'yyyy/MM/dd hh:mm:ss').split(' ')
								this.time_ymd = temp[0]
								this.time_hsm = temp[1]
								serverTime += 1000
								sessionStorage.setItem('commonTime',JSON.stringify(serverTime))
							},1000)							
                            
                        }
					})
			},
					
		},

	}

</script>

<style scoped lang="scss">
	section{
		height:100%;
		background: #fff;
		overflow-y: auto;
		.container{
			height: inherit;
			.header{
				height: 80px;
				min-width: 1260px;
				background: $color-black;
				color:#fff;	
				.logo {
					padding-left:1%;
					line-height: 80px;
					.logo-img{
						margin: 6px 0;
						float: left;
						height:68px;
					}
				}
				.user{
					padding: 15px 8px;
					.el-button{
						font-size: 40%;
					}
					.user-name{
						font-weight: bold;
						font-size: 18px;
						color: #fff;
						.select-gate{
							width: 80px;
						}
					}
					.login-time{
						font-size: 14px;
					}
				}	
				.time{
					padding: 10px;
					.time-clock{
						margin:5px 0;
						font-weight: bold;
						font-size: 20px;
						text-align: center;
					}
				}
				.menu{
					text-align: right;
					.menu-box{
						float: right;
						margin: 10px 0;
						width: 88px;
						height: 60px;
						box-sizing: border-box;
						cursor: pointer;
						border-right: 1px solid #767676;
						p{
							margin: 0;
							text-align: center;
						}
						.menu-inoc{
							font-size: 30px;
						}
						.menu-text{
							font-weight: bold;
						}
						.setting-menu{
							position: relative;
							top: 16px;
							right:16px;
							padding: 0;
							margin: 0px;
							width: 130px;
							display: block;
							list-style-type: none;
							background: #343434;
							border-radius:4px; 
							z-index: 999;
							.setting-menu-li{
								padding: 10px 0px;
								text-align: center;
								font-size: 18px;
								border-bottom: 1px solid #767676;
								cursor: pointer;
								color: #fff;
							}
							.setting-menu-li:hover{
								color: $color-orange;
							}
						}						
					} 
					.menu-page{
						float: right;
						margin: 10px 0;
						width: 40px;
						height: 60px;
						line-height: 60px;
						box-sizing: border-box;
						i{
							font-size:20px;
							cursor: pointer;
						}
						i:hover{
							color: $color-blue;
						}						
					}
					.menu-box:hover{
						border-bottom: 2px solid $color-orange;
					}

				}						
			}
			.main{
				height: calc(100% - 80px);
				min-width: 1260px;
				max-width:100%;					
			}
		}		
	}
	/* 顶部菜单激活样式 */
	.menu-active{
		color: $color-orange;
	}	
</style>
<style lang="scss">
/* 更改element-UI弹窗头部背景和字体颜色 */
.el-dialog__header{
     background: $color-black;
}
.el-dialog__title{
    color: $color-orange;
}
.el-dialog__headerbtn .el-dialog__close {
    color: #fff;
}

</style>
