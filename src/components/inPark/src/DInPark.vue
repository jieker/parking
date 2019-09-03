<!--手动进场，手动新增弹窗 -->
 
<template>
	<div>
		<!-- 弹窗-手动进场 -->
		<sm-dialog :title="manualInProps.isTime?'手动进场':'手动新增'" class="sm-dialog" 
			@open="listenOpenDialog" @close="listenCloseDialog"  :visible.sync="isShowInPark" 
			:direction="direction" :width="width" :showClose="false" 
		>
			<div class="dialog-box clearfix" >
				<div class="box-left">
					<el-form label-position="left" label-width="84px" :model="formData" :rules="formDataRules" ref="formData" >
						<el-form-item class="form-item-notice" label="车牌号码:" prop="carNum">
							<el-input class="width-180" v-model.trim="formData.carNum" id="outCarNum" clearable placeholder="请输入车牌号码" maxlength=8 ref="mark">
							</el-input>
						</el-form-item>
						<el-form-item class="form-item-notice" label="车辆类型:" prop="carType">
							<el-select class="width-180" v-model="formData.carType" placeholder="选择车辆类型" >
								<el-option v-for="item in carTypeList" :key="item.mark" :label="item.typeName" :value="item.mark">
								</el-option> 
							</el-select>
						</el-form-item>
						<el-form-item class="form-item-notice" label="岗亭名称:" prop="gateId">
							<el-select class="width-180" v-model="formData.gateId"  placeholder="未选择" >
								<el-option v-for="(item,index) in gateList" :key="index" :label="item.gateName" :value="item.id">
								</el-option> 
							</el-select>
						</el-form-item>						
						<el-form-item class="form-item-notice" label="入场时间:" v-show="!manualInProps.isTime" prop="inTime">
							<el-date-picker class="width-200" v-model="formData.inTime" :disabled="manualInProps.isTime" type="datetime" placeholder="选择日期时间" :picker-options="pickerOptions">
							</el-date-picker>                        
						</el-form-item>	
					</el-form>
				</div>
				<div class="box-right" id="softKeyBoard" @mousedown.prevent="preventHandFocus()">
					<div class="key-row  un-select" v-for="(item, index) in array" :key="index" @click="handFocus()">
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
			<div  class="dialog-footer">
				<el-button class="footer-btn" @click.native="isShowInPark = false">取消</el-button>
				<el-button class="footer-btn" type="primary" @click.native="submit('formData')" >确认</el-button>
			</div>		
		</sm-dialog>		
	</div>
    
</template>
 <script>
	import { mapGetters} from 'vuex'
	import {base,manualInPark,manualAddParkRecord} from '@/api/api'
	
	export default {
        name: 'DInPark',	
		props: {
			manualInProps: {	//手动进场,新增相关数据
				type: Object,
				default: null
			},	
			direction: String,	//方向(必传)	
			width: String,		//宽度
		},   
		data() {
			let checkInTime = (rule, value, callback) => {
				if (!value) {
					return callback(new Error('进场时间不能为空'))
				}else{
					if (this.formData.inTime.getTime() > sessionStorage.getItem('commonTime')) {
						return callback(new Error('进场时间不能大于当前时间'))
					}else{
						callback()
					}
				}
			}	

			return {
				isShowInPark:false,
				//表单数据
				formData:{
					carNum: '',
					carType: '',
					gateId: '',
					sluiceName:'',
					inTime:'',
					position:'',
				},
				//表单数据验证
				formDataRules:{
					carNum: [
						 { required: true, message: '请输入车牌', trigger: 'change' },
                         { required: true, validator: this.Check.ruleCarNum, trigger: 'blur' }
					],
					carType: [
						 { required: true, message: '请选择车类型', trigger: 'change' },
					],
					gateId: [
						 { required: true, message: '请选择进场岗亭', trigger: 'change' },
					],					
					inTime: [
						 { required: true, message: '请选择进场时间', trigger: 'change' },
                         { required: true, validator: checkInTime, trigger: 'blur' }

					]					
				},
				//虚拟键盘键值
				array: [
					['京','津','冀','晋','蒙','1','2','3','4','5',],
					['辽','吉','黑','沪','苏','6','7','8','9','0',],
					['浙','皖','闽','赣','鲁','A','B','C','D','E',],
					['云','豫','鄂','湘','粤','桂','F','G','H','J',],
					['新','琼','渝','川','贵','云','K','L','M','N',],
					['藏','陕','甘','宁','青','P','Q','R','S','T',],
					['新','港','澳','台','学','U','V','W','X','Y',],
					// ['警','使','领','挂','临','Z',],
				],
				pickerOptions: {
					disabledDate(time) {
						return time.getTime() > Date.now()
					}
				}, 							
			}
		},
		watch: {
			isShowInPark(newVal,oldVal){
				// console.log(newVal)
			},			
		},
		computed: {
			...mapGetters({
				carTypeList: 'getCarTypeList',
				gateList: 'getGateList',	
			})
        },
		methods: {
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
            keyButton(val){
                this.$refs['mark'].focus()
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
            // 退格
            back(){
                let inputs = this.$refs['mark'].$el.getElementsByTagName('input')[0]
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
                // console.log(this.inputVal)
                this.$emit('carNumVerification',this.inputVal)
            },
			//打开弹窗
			openDialog(){
				this.isShowInPark = true	
			},
			//监听弹窗打开
			listenOpenDialog(){
                this.$nextTick(() => {
                    this.$refs['mark'].focus()
				})
				// console.log(new Date(JSON.parse(sessionStorage.getItem('commonTime'))));
				this.formData.gateId = this.manualInProps.gateId  || this.gateList[0].id	
				this.formData.position = this.manualInProps.position
				this.formData.sluiceName = this.manualInProps.sluiceName
				this.formData.inTime = new Date(JSON.parse(sessionStorage.getItem('commonTime')))
				this.formData.carNum = this.manualInProps.carNum || '粤B'
				this.formData.carType = this.manualInProps.carType ||'small'				
			},
			//监听弹窗关闭
			listenCloseDialog(){
				this.isShowInPark = false
				this.$emit('openIsAskInParkDialog',null) 									
				for(let key in this.formData) {
					this.formData[key] = ''
				}
			},
			// 清空
			clear(){
				this.formData.carNum = ''
			},
			// 表单提交						
			submit(formName){
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let param = {
							carNum: this.formData.carNum,
							carType:this.formData.carType,
							checkFlag: true,
							gateId: this.formData.gateId,
							inRemark: "手动",
							inTime: this.Util.formatDate.format(this.formData.inTime,'yyyy-MM-dd hh:mm:ss'),
							operatorId: this.Util.userInfo.id,
							position:this.formData.position,
						}
						if(this.manualInProps.isTime){		//手动进场
							param.inRemark = '手动进场'
							manualInPark(param)
							.then((data) => {
								
								if(data.code === 'SUCCESS'){
									let eventData = {
										message: {
											data: data.data,
											code: data.code,
											msg: data.msg,
										}
									}
									this.$emit('openIsAskInParkDialog',eventData) 									
									this.$message({
										message: '进场成功',
										type: 'success'
									})
                      
									this.isShowInPark = false
								}else if(data.code === 'ALLOW_PARKIN'){
									let eventData = {
										message: {
											data: data.data,
											code: data.code,
											msg: data.msg,
										}
									}
									this.$emit('openIsAskInParkDialog',eventData)									
									this.isShowInPark = false
								}else{
									// console.log(data);
									let eventData = {
										message: {
											data: data.data,
											code: data.code,
											msg: data.msg,
										}
									}
									this.$message.error(`进场失败,${data.msg}`);                           
								}
							})
						}else{
							param.inRemark = '手动新增'

							manualAddParkRecord(param)
							.then((data) => {
								if(data.code === 'SUCCESS'){
									this.$message({
										message: '操作成功',
										type: 'success'
									});
									this.$emit('getlist')		//调用父组件方法刷新页面数据
									this.isShowInPark = false
								}else{
									this.$message.error(data.msg);   
								}
							})							
						}

					} else {
						return false;
					}
				});							
				
			},
			
		},
		
	}

</script>

<style lang="scss" scoped>
.sm-dialog{
	.dialog-box{
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
					// width: 40px;
				}
				.key-col3{
					margin: 2px 0px;
					width: 52px;
				}
			}
		}

	}
	.dialog-footer{
		padding: 20px;
		text-align: center;
		.footer-btn{
			font-weight: bold;
		}
	}
}

</style>
   
