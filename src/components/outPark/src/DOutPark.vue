<!-- 手动出场/收费相关组件, -->
<template>
	<div>
		<!-- 弹窗-手动出场 -->
		<sm-dialog title="手动出场" class="sm-dialog" @open="listenOpenDialog" @close="listenCloseDialog"  :visible.sync="outParkVisible" :direction="direction" :width="width" :showClose="false" >
			<div class="container-body clearfix">
				<div class="box-left">
					<el-form label-position="left" label-width="84px" :model="formData" :rules="formDataRules" ref="formData" >
						<el-form-item class="form-item-notice" label="车牌号码:" prop="carNum">
							<el-input class="width-120" id="outCarNum" v-model.trim="formData.carNum" clearable placeholder="请输入车牌" maxlength=7 ref="mark">
							</el-input>
							<el-button type="primary" size="mini" @click="getOutSearchCar" v-popover:popover1>搜索</el-button>
							<el-popover placement="bottom" v-model="popoverVisible" width="162" trigger="click" ref="popover1" :offset='-200'>
								<!--列表-->
								<el-table :data="array" ref="singleTable" highlight-current-row v-loading="listLoading" @row-click="rowClick"  height="240" max-height="250" >
									<el-table-column prop="inCarNum1" label="请选择以下在场车牌" min-width="105" >
									</el-table-column>
								</el-table>
							</el-popover>
						</el-form-item>
						<el-form-item class="form-item-notice" label="车辆类型:" prop="carType">
							<el-select class="width-150" v-model="formData.carType" placeholder="选择车辆类型" >
								<el-option v-for="item in carTypeList" :key="item.mark" :label="item.typeName" :value="item.mark">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item class="form-item-notice" label="岗亭名称:" prop="gateId">
							<el-select class="width-150" v-model="formData.gateId"  placeholder="未选择" :disabled="manualOutProps.isGate">
								<el-option v-for="(item,index) in gateList" :key="index" :label="item.gateName" :value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
						<p class="form-item-title"></p>
					</el-form>
				</div>
				<div class="box-right" id="softKeyBoard" @mousedown.prevent="preventHandFocus()">
					<div class="key-row  un-select" v-for="(item, index) in keyArray" :key="index" @click="handFocus()">
						<span class="key-col" @mousedown.prevent="keyButton(val)" v-for="(val,index) in item" :key="index">{{val}}</span>
					</div>
					<div class="key-row un-select">
						<span class="key-col key-col2" @mousedown.prevent="keyButton('警')">警</span>
						<span class="key-col key-col2" @mousedown.prevent="keyButton('使')">使</span>
						<span class="key-col key-col2" @mousedown.prevent="keyButton('领')">领</span>
						<span class="key-col key-col2" @mousedown.prevent="keyButton('挂')">挂</span>
						<span class="key-col key-col2" @mousedown.prevent="keyButton('临')">临</span>
						<span class="key-col key-col2" @mousedown.prevent="keyButton('Z')">Z</span>
						<span class="key-col key-col3" @mousedown.prevent="clear" >清空</span>
						<span class="key-col key-col3" @mousedown.prevent="back">退格</span>
					</div>
				</div>
			</div>
			<div  class="container-footer">
				<el-button class="footer-btn" @click.native="cancelOutPark">取消</el-button>
				<el-button class="footer-btn" type="primary" @click="submit('formData')" v-loading="inCarBillingLoading" >确认</el-button>
			</div>
		</sm-dialog>
		<!-- 弹窗-收费 -->
		<sm-dialog title="收取费用" class="sm-dialog" @open="listenOpenChargeDialog" @close="listenCloseChargeDialog"  :visible.sync="chargeDialogVisible" :direction="direction" :width="width" :showClose="false"  >
			<div class="charge-box ">
				<div class="box-top clearfix">
					<div class="img-in">
						<p class="img-top text-justify">
							<span>进场图片</span>
							<span>{{chargeCarInfo.inGateName}}</span>
						</p>
						<el-tooltip content="单击切换图片,双击查看大图" placement="bottom">
							<img id="inCarImg" :src="inCarImgSrc" alt="图片路径未找到图片" :onerror="imgOnerror" class="img-responsive cursor-pointer" @click="changeInImg"  @dblclick="openBigImg(inCarImgSrc)">
						</el-tooltip>
					</div>
					<div class="img-out" v-loading="outImgLoading" element-loading-text="图片加载中,请稍等....">
						<p class="img-top text-justify">
							<span>出场图片</span>
							<span>{{chargeCarInfo.outGateName}}</span>
						</p>
						<el-tooltip content="单击切换图片,双击查看大图" placement="bottom">
							<img id="outCarImg" :src="outCarImgSrc" alt="图片路径未找到图片" :onerror="imgOnerror" class="img-responsive cursor-pointer" @click="changeOutImg" @dblclick="openBigImg(outCarImgSrc)">
						</el-tooltip>
					</div>
				</div>
				<div class="box-bottom">
					<div class="right-carinfo">
						<div class="right-top text-justify">
							<span>{{chargeCarInfo.carNum}}</span>
							<span>{{chargeCarInfo.carType | transformCarType}}</span>
							<span>{{chargeCarInfo.userType | transformUserType}}</span>
						</div>
						<div class="carinfo-p" ><span class="text-danger">提示：</span><span class="text-warning">{{chargeCarInfo.remarks}}</span></div>

						<div class="carinfo-p">进场时间：<i class="text-success">{{chargeCarInfo.inTime }}</i></div>
						<div class="carinfo-p">出场时间：<i class="text-success">{{chargeCarInfo.outTime }}</i></div>
						<div class="carinfo-p">停车时长：<i class="text-success">{{chargeCarInfo.parkingTime | transformSeconds}}</i></div>
						<div class="carinfo-p">应收金额：<i class="text-success">{{chargeCarInfo.totalPay | transformMoney}}元</i></div>
						<div class="carinfo-p">优惠金额：<i class="text-success">{{chargeCarInfo.freePay | transformMoney}}元</i>
						</div>
						<div class="carinfo-p">优惠时间：<i class="text-success">{{chargeCarInfo.discountTime | transformMinutes}}</i></div>
						<div class="carinfo-p">实收金额：<i class="text-success">{{chargeCarInfo.discountedPay | transformMoney}}元</i></div>
						<div class="carinfo-p">备注：
							<el-input size="mini" class="carinfo-p-input" v-model.trim="chargeCarInfo.chargeRemarks"></el-input>
						</div>
						<div class="right-bottom text-center">
							<el-button type="primary" size="small" @click="openMembersInfoDialog">会员信息</el-button>
							<el-button type="primary" size="small" @click="openChargeInfoDialog">24小时收费记录</el-button>   
							<el-button type="primary" size="small" v-show="manualOutProps.isCharge" @click="cancelCharge">取消收费</el-button>
							<el-button type="primary" size="small" v-show="manualOutProps.isCharge" :disabled="chargeCarInfo.payInfo ==='已缴费'" @click="cashChargeSubmit"  v-loading="chargeLoading">
								现金收费<span ><b>{{chargeCarInfo.discountedPay | transformMoney}}</b>元</span>
							</el-button>
							<el-button type="primary" size="small" v-show="manualOutProps.isCharge===false" @click="notifyCharge">关闭</el-button>   
						</div>

					</div>
				</div>

			</div>
		</sm-dialog>
		<!-- 弹窗-扫码支付 -->
		<sm-dialog title="扫码支付" class="sm-dialog"  :visible.sync="scanPayVisible" :direction="direction" width="60%" >
			<div class="scanpay-box">
				<h3 class="margin-0">请扫客户支付码收款</h3>
				<el-input class="scanpay-input"></el-input>
				<div class="scanpay-footer text-center">
					<el-button @click="scanPayVisible=false">取消</el-button>
					<el-button type="primary">确定</el-button>
				</div>
			</div>
		</sm-dialog>
		<!-- 弹窗-取消收费 -->
		<sm-dialog title="取消收费" class="sm-dialog"  :visible.sync="cancelChargeVisible" :direction="direction" width="80%" >
			<div class="scanpay-box">
				<el-form label-position="left" label-width="100px" :model="cancelChargeformData"  >
					<el-form-item  label="取消收费类型:" prop="cancelType">
						<el-select class="width-150" v-model="cancelChargeformData.cancelType" placeholder="选择车辆类型" >
							<el-option  label="特殊车辆" :value="1"></el-option>
							<el-option  label="取消收费车辆" :value="0"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item  label="取消收费原因:" prop="remark">
						<el-input  v-model="cancelChargeformData.remark" placeholder="在此输入取消收费原因"></el-input>
					</el-form-item>

				</el-form>
				<div class="scanpay-footer text-center">
					<el-button @click="cancelChargeVisible=false">取消</el-button>
					<el-button @click="cancelChargeSubmit" type="primary">确定</el-button>
				</div>
			</div>
		</sm-dialog>
		<!-- 会员信息 -->
		<d-members-info :members-info-prop="membersInfoProp" @listenCloseMainDialog="listenCloseMainDialog"></d-members-info>
		<!-- 收费信息 -->
		<d-charge-info :charge-info-prop="chargeInfoProp" @listenCloseMainDialog="listenCloseMainDialog"></d-charge-info>
		<!-- 弹窗-大图 -->
		<big-img  ref="bigImg"></big-img>

		<shade :visible.sync="isShowIframe" ></shade>
	</div>

</template>
<script>
    import { mapGetters} from 'vuex'
    import {ip,base,manualOutPark,cashPayOutPark,getOutSearchCar,getCouponTypeAllList,addCancelChargeRecord} from '@/api/api'
    import notimg from "@/assets/img/notimg.png"
    import notfindimg from "@/assets/img/notfindimg.png"

    export default {
        name: 'DOutPark',
        props: {
            manualOutProps: {
                type: Object,
                default: null
            },
            direction: String,
			width: String,
			visible: {
				type: Boolean,
				default: false
			}, 			
        },
        components:{
            'DMembersInfo': () => import('@/views/bsclient/membersInfo/MembersInfo.vue'),
            'DChargeInfo': () => import('@/views/bsclient/chargeInfo/ChargeInfo.vue'),
		},
		watch:{
			visible(newVal,oldVal){
				if (newVal) {
					this.chargeDialogVisible = newVal
				}
			},     
			chargeDialogVisible(newVal,oldVal){
				this.$emit('update:visible', newVal)
			},              
		},		
        data() {
            return {
                outImgLoading: false,
                inClickTimeId: null,                            //存储点击图片的定时器
                outClickTimeId: null,                           //存储点击图片的定时器

                isShowIframe: false,
                imgOnerror: 'this.src="' + notfindimg + '"',
                carNumFocus:false,
                inCarBillingLoading:false,
                chargeLoading:false,
                outParkVisible: false,
                chargeDialogVisible: false,
                cancelChargeVisible: false,
                listLoading:false,
                popoverVisible:false,
                inCarImgSrc:'',
                outCarImgSrc:'',
                membersInfoProp:{
                    visible:false
                },
                chargeInfoProp:{
                    visible:false,
                    carNum:'',
                    date:''
                },
                array: [],
                //表单数据
                formData:{
                    carNum: '粤B',
                    carType: 'small',
                    gateId: '',
                    position:'',
                },
                //表单数据验证
                formDataRules:{
                    carNum: [
                        { required: true, message: '请输入车牌', trigger: 'change' },
                    ],
                    carType: [
                        { required: true, message: '请选择车类型', trigger: 'change' },
                    ],
                    gateId: [
                        { required: true, message: '请选择出场岗亭', trigger: 'change' },
                    ],                    
                },
                //取消收费表单数据
                cancelChargeformData:{
                    cancelType: 0,
                    remark: '',
                },
                //虚拟键盘键值
                keyArray: [
                    ['京','津','冀','晋','蒙','1','2','3','4','5',],
                    ['辽','吉','黑','沪','苏','6','7','8','9','0',],
                    ['浙','皖','闽','赣','鲁','A','B','C','D','E',],
                    ['云','豫','鄂','湘','粤','桂','F','G','H','J',],
                    ['新','琼','渝','川','贵','云','K','L','M','N',],
                    ['藏','陕','甘','宁','青','P','Q','R','S','T',],
                    ['新','港','澳','台','学','U','V','W','X','Y',],
                    // ['警','使','领','挂','临','Z',],
                ],
                chargeVisible:false,
                
                chargeCarInfo:{
                    carNum: "",
                    carType: "",
                    discountTime: 0,
                    discountedPay: 0,
                    freePay: 0,
                    gateId: "",
                    inGateName: "",
                    inImagePath1: null,
                    inTime: "",
                    orderId: "",
                    outCarNum1: '',
                    outGateName: "",
                    outTime: "",
                    parkId: "",
                    parkRecordId: "",
                    parkingTime: '',
                    remarks: "",
                    totalPay: 0,
                    userType: 0,
                    payInfo:'',
                    chargeRemarks:'',
                    payMethod:''
                },
                paperDiscountsSelect: [],
                paperDiscountsSelectId: '',
                paperDiscountsArry: [],
                scanPayVisible:false,
                membersInfoVisible:false,
            }
        },
        computed: {
            ...mapGetters({
                carTypeList: 'getCarTypeList',
                gateList: 'getGateList',
            })
        },
        methods: {
            //打开手动出场弹窗触发,父组件调用
            openDialog(){
                this.outParkVisible = true
                this.carNumFocus = true
           
                //表单数据初始化
                this.formData.gateId = this.manualOutProps.gateId
                this.formData.carNum = this.manualOutProps.carNum || '粤B'
                this.formData.carType =  this.manualOutProps.carType || 'small'
                this.formData.position = this.manualOutProps.position
            },            
			listenOpenDialog(){
                this.$nextTick(() => {
                    this.$refs['mark'].focus()
                })
            },
            //关闭手动出场弹窗触发
            listenCloseDialog(){
                this.outParkVisible = false
            },            
            //打开大图
            openBigImg(src){
                clearTimeout(this.inClickTimeId)
                clearTimeout(this.outClickTimeId)                
                this.$refs.bigImg.openDialog(src)
            },
            //单击切换进场图片
            changeInImg(){
                // 取消上次延时未执行的方法
                clearTimeout(this.inClickTimeId)
                //执行延时
                this.inClickTimeId = setTimeout(() => {
                    if (this.chargeCarInfo) {
                        if (this.chargeCarInfo.inImagePath1 === null && this.chargeCarInfo.inImagePath2 === null) {
                            this.inCarImgSrc = notimg
                            this.$message({
                                type: 'info',
                                message: '暂无图片',
                            })                            
                            return
                        }

                        let inCarImgSrc1 = `http://${ip}/images/${this.chargeCarInfo.inImagePath1}` 
                        let inCarImgSrc2 = `http://${ip}/images/${this.chargeCarInfo.inImagePath2}` 

                        if (this.inCarImgSrc !== inCarImgSrc1) {
                            this.inCarImgSrc = inCarImgSrc1
                            this.$message({
                                type: 'success',
                                message: '切换到图片1',
                            })
                        }else if(this.inCarImgSrc !== inCarImgSrc2){
                            this.inCarImgSrc = inCarImgSrc2
                            this.$message({
                                type: 'success',
                                message: '切换到图片2',
                            })                        
                        }
                    }else{
                        this.$message({
                            type: 'warning',
                            message: '请先选中一辆车'
                        })
                    }
                }, 350)            

            },   
            //单击切换出场图片
            changeOutImg(){
                // 取消上次延时未执行的方法
                clearTimeout(this.outClickTimeId)
                //执行延时
                this.outClickTimeId = setTimeout(() => {
                    if (this.chargeCarInfo) {
                        if (this.chargeCarInfo.outImagePath1 === null && this.chargeCarInfo.outImagePath1 === null) {
                            this.outCarImgSrc = notimg
                            this.$message({
                                type: 'info',
                                message: '暂无图片',
                            })                            
                            return
                        }                        
                        let outCarImgSrc1 = `http://${ip}/images/${this.chargeCarInfo.outImagePath1}` 
                        let outCarImgSrc2 = `http://${ip}/images/${this.chargeCarInfo.outImagePath2}` 

                        if (this.outCarImgSrc !== outCarImgSrc1) {
                            this.outCarImgSrc = outCarImgSrc1
                            this.$message({
                                type: 'success',
                                message: '切换到图片1',
                            })
                        }else if(this.outCarImgSrc !== outCarImgSrc2){
                            this.outCarImgSrc = outCarImgSrc2
                            this.$message({
                                type: 'success',
                                message: '切换到图片2',
                            })                        
                        }
                    }else{
                        this.$message({
                            type: 'warning',
                            message: '请先选中一辆车'
                        })
                    }
                }, 350)            

            },            
            //取消手动出场
            cancelOutPark(){
                this.outParkVisible= false
                this.carNumFocus = false 
                //返回收费信息给父组件
                this.$emit('chargeCarInfo', null)                               
            },  
            //查场内车辆
            getOutSearchCar() {
                this.$nextTick(() => {
                    this.$refs['mark'].focus()
                })
                let parkInfo = JSON.parse(sessionStorage.getItem('parkInfo'))
                let param = {
                    carNum: this.formData.carNum,
                    parkId: parkInfo.id,
                    operatorId: this.Util.userInfo.id,
                };
                getOutSearchCar(param).then(data => {
                    // console.log(data)
                    if (data.data.code === "SUCCESS") {
                        this.array = data.data.data
                    } else {
                        this.$message.error(data.data.msg)
                    }
                });
            },
            //单击行
            rowClick(val) {
                let tempVal = JSON.parse(JSON.stringify(val))
                this.popoverVisible = false
                this.formData.carNum = tempVal.inCarNum1
                this.formData.carType = tempVal.inCarType1
            },
            // 计费提交
            submit(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let param = {
                            carNum: this.formData.carNum,
                            carType:this.formData.carType,
                            deviceNo: '',
                            gateId: this.formData.gateId,
                            operatorId: this.Util.userInfo.id,
                            discountTime:0,
                            freePay:0,
                            position:this.manualOutProps.position,

                        }
                        this.inCarBillingLoading = true
                        this.manualOutParkApi(param)

                    } else {
                        return false;
                    }
                });

            },  
            //计费api
            manualOutParkApi(param){
                manualOutPark(param)
                    .then((data) => {
                        this.inCarBillingLoading = false

                        // console.log(data)
                        if(data.code === 'SUCCESS'){
                            this.chargeCarInfo = data.data
                            this.outParkVisible = false
                            if(this.chargeCarInfo.remarks === 'null'){
                                this.chargeCarInfo.remarks = ''
                            }
                            this.chargeCarInfo.chargeRemarks = '岗亭'

                            // payStatus ：-1未缴费,1已缴费,2月卡用户,3免费
                            //未缴费,打开收费弹窗
                            if (this.chargeCarInfo.payStatus === -1) {
                                this.chargeCarInfo.carType = this.chargeCarInfo.carType1 || this.chargeCarInfo.carType2                                         
                                this.chargeDialogVisible = true

                                //监控中心不能收费,提醒收费
                                if (this.manualOutProps.isCharge===false) {
                                    this.chargeCarInfo.remarks = `${this.chargeCarInfo.remarks}，请提醒车主先缴费`
                                }
                            }else{
                                this.$message({
                                    type:'success',
                                    message:`${this.chargeCarInfo.remarks},出场成功`
                                })
                                //返回收费信息给父组件
                                this.$emit('chargeCarInfo', this.chargeCarInfo)
                            }
                                
                            if (this.chargeCarInfo.inImagePath1) {
                                this.inCarImgSrc = `http://${ip}/images/${this.chargeCarInfo.inImagePath1}`
                            }else if (this.chargeCarInfo.inImagePath2) {
                                this.inCarImgSrc = `http://${ip}/images/${this.chargeCarInfo.inImagePath2}`
                            }else{
                                this.inCarImgSrc = notimg
                            }
                            this.outImgLoading = true
                            window.setTimeout(() =>{
                                this.outImgLoading = false

                                if (this.chargeCarInfo.outImagePath1) {
                                    this.outCarImgSrc = `http://${ip}/images/${this.chargeCarInfo.outImagePath1}`
                                }else if (this.chargeCarInfo.outImagePath2) {
                                    this.outCarImgSrc = `http://${ip}/images/${this.chargeCarInfo.outImagePath2}`
                                }else{
                                    this.outCarImgSrc = notimg
                                }					

                            }, 3500)

                        }else{
                            this.$message.error(data.msg);
                        }
                }) 
            },

            //自动识别打开收费弹窗
            autoOpenChargeDialog(param){
                this.chargeCarInfo = param   
                this.chargeCarInfo.carType = this.chargeCarInfo.carType1 || this.chargeCarInfo.carType2 
                this.chargeDialogVisible = true


                if (this.chargeCarInfo.inImagePath1) {
                    this.inCarImgSrc = `http://${ip}/images/${this.chargeCarInfo.inImagePath1}`
                }else if (this.chargeCarInfo.inImagePath2) {
                    this.inCarImgSrc = `http://${ip}/images/${this.chargeCarInfo.inImagePath2}`
                }else{
                    this.inCarImgSrc = notimg
                }
                if (this.chargeCarInfo.outImagePath1) {
                    this.outCarImgSrc = `http://${ip}/images/${this.chargeCarInfo.outImagePath1}`
                }else if (this.chargeCarInfo.outImagePath2) {
                    this.outCarImgSrc = `http://${ip}/images/${this.chargeCarInfo.outImagePath2}`
                }else{
                    this.outCarImgSrc = notimg
                }
            },  
            // 自动识别关闭收费弹窗
            autoCloseChargeDialog(){
                console.log('自动识别关闭收费弹窗');
                this.chargeDialogVisible = false
            },
            //打开收费弹窗触发
            listenOpenChargeDialog(){
                console.log('打开收费弹窗');

                this.outParkVisible = false
            },
            //关闭收费弹窗触发
            listenCloseChargeDialog(){
                console.log('关闭收费弹窗');
                this.chargeDialogVisible = false
                this.inCarImgSrc = ''
                this.outCarImgSrc = ''
                this.$emit('chargeCarInfo', null)
            },
            //现金收费提交
            cashChargeSubmit(){
                console.log(this.chargeCarInfo)
                this.isShowIframe = true
                this.$confirm('请确定收费信息无误后点击确定', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.chargeDialogVisible = false
                    this.isShowIframe = false                    
                    let param = {
                        "discountedPay": this.chargeCarInfo.discountedPay,
                        "carNum": this.chargeCarInfo.carNum,
                        "carNum1": this.chargeCarInfo.carNum1,
                        "carNum2": this.chargeCarInfo.carNum2,
                        "carType1": this.chargeCarInfo.carType1,
                        "carType2": this.chargeCarInfo.carType2,
                        "freePay": this.chargeCarInfo.freePay,
                        "discountTime": this.chargeCarInfo.discountTime,
                        "operatorId": this.Util.userInfo.id,
                        "orderId": this.chargeCarInfo.orderId,
                        "parkId": this.chargeCarInfo.parkId,
                        "parkRecordId": this.chargeCarInfo.parkRecordId,
                        "billingTime": this.chargeCarInfo.billingTime,
                        "billingStartTime": this.chargeCarInfo.billingStartTime,
                        "payMethod": "现金支付",
                        "remarks": this.chargeCarInfo.chargeRemarks,
                        "startTime": this.chargeCarInfo.inTime,
                        "stopTime": this.chargeCarInfo.outTime,
                        "totalPay": this.chargeCarInfo.totalPay,
                        "gateId": this.chargeCarInfo.gateId,
                        "localChargeFlag": this.chargeCarInfo.localChargeFlag,
                        "couponTypeIds":[],
                        "outImagePath1":this.chargeCarInfo.outImagePath1,
                        "outImagePath2":this.chargeCarInfo.outImagePath2,
                    }
                    // return
                    this.chargeLoading = true
                    cashPayOutPark(param)
                        .then((data) => {
                            this.chargeLoading = false
                            this.outParkVisible = false

                            if(data.code === 'SUCCESS'){
								this.chargeCarInfo.payInfo = '已缴费'
								this.chargeCarInfo.remarks = data.data.remarks
                                this.chargeCarInfo.payMethod = data.data.payMethod
								
                                //返回收费信息给父组件
                                this.chargeCarInfo.remarks =`<span class="text-success">${this.chargeCarInfo.remarks}</span>`
                                this.$emit('chargeCarInfo', this.chargeCarInfo)

                            }else{
                                this.chargeCarInfo.payInfo = '缴费失败,请重新手动出场'
                                this.chargeCarInfo.remarks =`<span class="text-danger">${this.chargeCarInfo.remarks}</span>`
                                this.chargeCarInfo.payMethod = ''
                                this.$message.error(data.msg);
                            }
                        })
                        .catch(err=>{
                            this.chargeLoading = false
                            this.chargeCarInfo.payInfo = '缴费失败,请重新手动出场'
                            this.chargeCarInfo.remarks =`<span class="text-danger">${this.chargeCarInfo.remarks}</span>`
                            this.chargeCarInfo.payMethod = ''
                        })

                }).catch(() => {
                    this.isShowIframe = false

                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            },
            //打开取消收费
            cancelCharge(){
                this.cancelChargeVisible = true
            },
            //取消收费表单提交
            cancelChargeSubmit(){
                let params = {
                    "cancelType": this.cancelChargeformData.cancelType,
                    "carNum": this.chargeCarInfo.carNum,
                    "carType": this.chargeCarInfo.carType,
                    "inGateId": this.chargeCarInfo.gateId,
                    "inGateName": this.chargeCarInfo.inGateName,
                    "inImagePath": this.chargeCarInfo.inImagePath1,
                    "inTime": this.chargeCarInfo.inTime,
                    "outGateId": this.manualOutProps.gateId,
                    "outGateName": this.chargeCarInfo.outGateName,
                    "outImagePath": this.chargeCarInfo.outImagePath1,
                    "outTime": this.chargeCarInfo.outTime,
                    "payMoney": this.chargeCarInfo.discountedPay,
                    "remark": this.cancelChargeformData.remark,
                    "position":this.manualOutProps.position,
                }
                addCancelChargeRecord(params)
                    .then((data) => {
                        if(data.code === 'SUCCESS'){
                            this.cancelChargeVisible = false
                            this.chargeDialogVisible = false
                            this.outParkVisible = false
                            if (this.cancelChargeformData.cancelType === 1) {
                                this.chargeCarInfo.remarks = `特殊车辆`
                                this.chargeCarInfo.payMethod = ''
                            }
                            if (this.cancelChargeformData.cancelType === 0) {
                                this.chargeCarInfo.remarks = `取消收费车辆`
                                this.chargeCarInfo.payMethod = ''
                            }
                            //返回信息给父组件
                            this.chargeCarInfo.remarks =`<span class="text-danger">${this.chargeCarInfo.remarks}</span>`                            
                            this.$emit('chargeCarInfo', this.chargeCarInfo)

                        }else{
                            this.$message.error(data.msg);
                        }
                    })
            },
            //关闭
            notifyCharge(){
                this.chargeDialogVisible = false
            },
            //关闭iframe遮罩
            listenCloseMainDialog(){
                this.isShowIframe = false
            },
            //打开24小时收费记录弹窗触发
            openChargeInfoDialog(){
                this.isShowIframe = true
                this.chargeInfoProp.visible = true
                this.chargeInfoProp.carNum = this.chargeCarInfo.carNum

                let serverCurrentTime = JSON.parse(sessionStorage.getItem('commonTime'))

                let yesterdayTime = serverCurrentTime - 86400000					//当前前24小时时间戳
                this.chargeInfoProp.startTime = new Date(yesterdayTime)
                this.chargeInfoProp.endTime = new Date(serverCurrentTime)
            },
            //打开会员信息
            openMembersInfoDialog(){
                this.isShowIframe = true

                this.membersInfoProp.visible = true                
                this.membersInfoProp.carNum = this.chargeCarInfo.carNum                
            },            
            // 阻止失去焦点
            preventHandFocus(){
                document.getElementById("softKeyBoard").onmousedown=function(e){
                    if ( e && e.preventDefault )
                        e.preventDefault();
                    //IE阻止默认事件
                    else
                        window.event.returnValue = false;
                    return false;
                }
            },
            /**
             * 虚拟键盘按钮点击事件
             * @param {string} val 键值
             */            
            keyButton(val){
                this.$refs['mark'].focus()
                // let inputs = this.$refs.mark.$el.querySelector('input');
                let inputs = this.$refs['mark'].$el.getElementsByTagName('input')[0]
                if(inputs.value.length < 8){
                    var rangeStart = inputs.selectionStart;
                    var rangeEnd = inputs.selectionEnd;
                    var tempStr1 = inputs.value.substring(0, rangeStart);
                    var tempStr2 = inputs.value.substring(rangeEnd);
                    var newStart = rangeStart + val.length;
                    inputs.value = tempStr1 + val + tempStr2;
                    inputs.selectionStart = newStart;
                    inputs.selectionEnd = newStart;
                    this.formData.carNum = tempStr1 + val + tempStr2
                }
            },
            // 清空
            clear(){
                this.formData.carNum = ''
            },            
            // 退格
            back(){
                let inputs = this.$refs['mark'].$el.getElementsByTagName('input')[0]
                // console.log(inputs.value)
                var rangeStart = inputs.selectionStart;
                var rangeEnd = inputs.selectionEnd;
                var tempStr1 = inputs.value.substring(0, rangeStart);
                var tempStr2 = inputs.value.substring(rangeEnd);
                var tempStr1Length = tempStr1.substr(0, tempStr1.length - 1)
                var newStart =   tempStr1Length.length;
                inputs.value = tempStr1Length  + tempStr2;
                inputs.selectionStart = newStart;
                inputs.selectionEnd = newStart;
                this.formData.carNum = tempStr1Length  + tempStr2
            },
            //获取焦点
            handFocus(){
                var list =document.querySelectorAll(".key-row");
                list.onmousedown=function(e){
                    if ( e && e.preventDefault )
                        e.preventDefault();
                    //IE阻止默认事件
                    else
                        window.event.returnValue = false;
                    return false;
                }

                this.$emit('focus')
            },
            //失去焦点
            handBlur(){
                this.$emit('carNumVerification',this.inputVal)
            },            
        },

    }

</script>

<style lang="scss" scoped>
.sm-dialog{
	.container-body{
		.box-left{
			margin-top: 12px; 
			float: left;
			width: 46%;
			.form-item-notice{
				margin-top: 20px;
				padding-left:5px;
				font-weight: bold;
			}	
						
		}
		.box-right{
			margin-top: 20px;
			float: right;
			width:54%;
			background:$color-gray;
			padding: 8px 0;
			.key-row{
				height: 30px;
				line-height: 30px;
				text-align: center;
				font-size: 20px;
				.key-col{
					margin: 2px;
					display: inline-block;
					width: 26px;
					height: 26px;
					border: 1px solid #b1afaf;
					background: #fff;
					cursor: pointer;
					border-radius:3px; 
				}
				.key-col:hover{
					border: 1px solid $color-blue;
					color: $color-blue;
				}
				.key-col2{
					margin: 2px 0px;
				}
				.key-col3{
					margin: 2px 0px;
					width: 52px;
				}
			}
		}
		.scanpay-input {
			margin: 20px 0px;
		}
	}
	.container-footer{
		padding: 20px;
		text-align: center;
		.footer-btn{
			font-weight: bold;
		}
	}		
	.charge-box{
		.box-top{
			.img-in{
				float: left;
				width: 49%;
				.img-top{
                    margin: 0px;
					font-weight: bold;
					padding: 5px;
					border-bottom: 1px solid $color-gray; 
					span{
						display: inline-block;
						width: 49%;
					}
				}
				img{
                    height: 227px;
				}
				margin-bottom: 5px;
				border: 1px solid $color-gray;					
			}
			.img-out{
				float: right;
				width: 49%;					
				.img-top{
                    margin: 0px;
					font-weight: bold;
					padding: 5px;
					border-bottom: 1px solid $color-gray; 
					span{
						display: inline-block;
						width: 49%;
					}
				}
				img{
                    height: 227px;
				}
				margin-bottom: 5px;
				border: 1px solid $color-gray;					
				
			}	
						
		}
		.box-bottom{
			.right-carinfo{
				// background:#fff;
				.right-top {
					padding: 8px;
					span{
						display: inline-block;
						width: 32%;
						font-weight: bold;
						font-size: 18px;
					}
				}	
				.carinfo-p {
					margin: 6px ;
					font-size: 18px;
					display: flex;
					align-items: center;
					.carinfo-p-input{
						width: 72%;
					}
				}	
				.right-bottom{
					padding: 10px 0px 15px 0px;
				}				
			}				
		}			
	}
	.scanpay-box{
		padding: 10px;		
		.scanpay-input {
			margin: 20px 0px;
		}	
		.scanpay-footer{
			padding: 15px;				
		}		
	}
}	
</style>
   
