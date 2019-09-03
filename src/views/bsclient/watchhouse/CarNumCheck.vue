<!--无进场记录弹窗-->
<template>
    <div>
	    <sm-dialog title="无进场记录" class="sm-dialog aaaa" @open="listenOpenDialog" @close="listenCloseDialog"  :visible.sync="isShowCarNumCheckDialog" :direction="direction" :width="width" :showClose="false" >
            <div class="img-box ">
                <div class="box-top clearfix">
                    <div class="img float-left">
                        <p class="img-top text-justify">
                            <span>进场图片</span>
                            <span>{{inCarInfo.inGateName}}</span>
                        </p>
                        <el-tooltip content="单击切换图片,双击查看大图" placement="bottom">
                            <img class="img-responsive cursor-pointer" :src="inCarImgSrc" :onerror="imgOnerror" alt="图片路径未找到图片" @click="changeInImg"  @dblclick="openBigImg(inCarImgSrc)">                                
                        </el-tooltip>                              
                        
                    </div>
                    <div class="img float-right">
                        <p class="img-top text-justify">
                            <span>出场图片</span>
                            <span>{{carNumCheckProp.outGateName}}</span>
                        </p>
                        <el-tooltip content="单击切换图片,双击查看大图" placement="bottom">
                            <img  class="img-responsive cursor-pointer" :src="outCarImgSrc" :onerror="imgOnerror" alt="图片路径未找到图片" @click="changeOutImg"  @dblclick="openBigImg(outCarImgSrc)">                                
                        </el-tooltip>                             
                    </div>				
                </div>
                <hr style="margin:0px;">
                <div class="box-bottom clearfix" >
                    <div  class="bottom-left">

                        <el-table :data="array" ref="singleTable" highlight-current-row v-loading="listLoading" @row-click="rowClick"  height="430" stripe >
                            <el-table-column prop="inCarNum1" label="车牌1" min-width="100" >
                                <template slot-scope="scope" >
                                    <span>{{scope.row.inCarNum1 | transformNoting}}</span>
                                </template>                                
                            </el-table-column>
                            <el-table-column prop="inCarNum2" label="车牌2" min-width="100" >
                                <template slot-scope="scope" >
                                    <span>{{scope.row.inCarNum2 | transformNoting}}</span>
                                </template>                                 
                            </el-table-column>                            
                            <el-table-column prop="inTime" label="进场时间" min-width="150"  >
                                <template slot-scope="scope">
                                    <span>{{scope.row.inTime | transformTime}}</span>
                                </template>                        
                            </el-table-column>
                            <el-table-column prop="inCarType1" label="车辆类型" min-width="100" >
                                <template slot-scope="scope">
                                    <span>{{scope.row.inCarType1 | transformCarType}}</span>
                                </template>
                            </el-table-column> 
                            <el-table-column prop="userType" label="用户类型" min-width="115" >
                                <template slot-scope="scope">
                                    <span>{{scope.row.userType | transformUserType}}</span>
                                </template>                         
                            </el-table-column>                    									
                            <el-table-column prop="gateInfo.gateName" label="进场岗亭" min-width="100"  >
                            </el-table-column>
                            <!-- <el-table-column prop="payment[0]" label="缴费时间" min-width="130" show-overflow-tooltip :formatter="formatPayTime" >
                            </el-table-column> 	 -->
                            <el-table-column prop="inRemark" label="备注信息" min-width="115" show-overflow-tooltip >
                            </el-table-column>                     					
                        </el-table>                         
                    </div>
                    <div class="bottom-right">
                        <div class="right-head">
                            <keyboard v-model="searchCarNum" @keyup.enter.native ="getOutSearchCar()" placeholder="请输入车牌"></keyboard>  
                            <el-button type="primary" size="small" @click="getOutSearchCar()">查询</el-button>
                        </div>                        
                        <h4>选择的进场记录车牌号:</h4>
                        <div class="right-head">
                            <keyboard v-model="inCarInfo.carNum" placeholder='请选择左侧车辆' ></keyboard>   
                            <p></p>
                        </div>  
                        <div>
                            <el-select class="width-150" v-model="inCarInfo.carType" placeholder="请选择">
                                <el-option v-for="item in carTypeList" :key="item.mark" :label="item.typeName" :value="item.mark">
                                </el-option>
                            </el-select>                            
                            <el-button type="primary" @click="carInfoModify" size="small" :disabled="inCarInfo.carNum ===''">校正</el-button>
                            <p></p>                            
                        </div>
                        <el-button type="primary" size="mini" @click="manualOut" :disabled="inCarInfo.carNum ===''">以车牌号"{{inCarInfo.carNum}}"手动出场</el-button>
                        <hr >     
                        <h4>当前出场识别的车牌号:</h4>
                        <p class="outCar-p text-orange">
                            <span>{{carNumCheckProp.carNum1}}&nbsp&nbsp</span>
                            <span>{{carNumCheckProp.carType1 | transformCarType}}</span>
                        </p>     
                        <h4>左侧未找到进场记录:</h4>
                        <div>
                            <span><b>进场时间:</b></span>
                            <el-date-picker class="width-180" v-model="chargeFormData.inTime"  type="datetime" placeholder="选择进场时间" :picker-options="pickerOptions">
                            </el-date-picker>                                
                        </div>
                        <p></p>   
                        <div>
                            <span><b>收费金额:</b></span>
                            <el-input-number v-model="chargeFormData.money" :precision="2" :step="1" :min="0" :max="9999"></el-input-number>                               
                        </div> 
                        <p></p>
                        <div>
                            <el-button type="primary" @click="cancelCharge" size="small" >取消收费</el-button>
                            <el-button type="primary" @click="cashChargeSubmit" size="small" v-loading="chargeLoading" >现金收费{{chargeFormData.money}}元</el-button>
                        </div>                        

                    </div>
                </div>
            
            </div>	    
        </sm-dialog>
        <!-- 弹窗-大图 -->
        <big-img  ref="bigImg"></big-img>      
		<!-- 弹窗-取消收费 -->
		<sm-dialog title="取消收费" class="sm-dialog"  :visible.sync="cancelChargeVisible" :direction="direction" width="80%" >
			<div class="scanpay-box">
				<el-form label-position="left" label-width="100px" :model="cancelChargeFormData"  >
					<el-form-item  label="取消收费类型:" prop="cancelType">
						<el-select class="width-150" v-model="cancelChargeFormData.cancelType" placeholder="选择车辆类型" >
							<el-option  label="特殊车辆" :value="1"></el-option>
							<el-option  label="取消收费车辆" :value="0"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item  label="取消收费原因:" prop="remark">
						<el-input  v-model="cancelChargeFormData.remark" placeholder="在此输入取消收费原因"></el-input>
					</el-form-item>

				</el-form>
				<div class="scanpay-footer text-center">
					<el-button @click="cancelChargeVisible=false">取消</el-button>
					<el-button @click="cancelChargeSubmit" type="primary">确定</el-button>
				</div>
			</div>
		</sm-dialog>   
	    <shade  :visible.sync="isShowIframeCenter"></shade>

    </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
    ip, updateOnsite,getOnsiteOutList,inCarRecordSyncCloud,getOutSearchCar,noRecordcashPayOutPark,addCancelChargeRecord
} from "@/api/api";
import carimgnot from "@/assets/img/carimgnot.png"
import notimg from "@/assets/img/notimg.png"
import notfindimg from "@/assets/img/notfindimg.png"

export default {
    // props: ['carNumCheckProp'],
    props: {
        carNumCheckProp: {
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
    data() {
        return {
			isShowIframeCenter: false,				        //是否显示iframe遮罩层
            inClickTimeId: null,                            //存储点击图片的定时器
            outClickTimeId: null,                           //存储点击图片的定时器
            inCarImgSrc: carimgnot,
            outCarImgSrc: carimgnot,


            imgOnerror: 'this.src="' + notfindimg + '"',
            isShowCarNumCheckDialog: false,
            listLoading: false,
            chargeLoading:false,
            rowClickCarInfo:'',

            searchCarNum: '',          //车牌查找

            inCarInfo:{         //选中的单个车辆信息
                carNum: '',
                id:'',
                carType:'',
                inGateName: '',
            },
            array: [],
            chargeFormData: {
                inTime:new Date(),
                money:0
            },
            cancelChargeVisible: false,
            //取消收费表单数据
            cancelChargeFormData:{
                cancelType: 0,
                remark: '',
            },   
            chargeCarInfo:{
                carNum: "",
                carType: "",
                inGateName: "",
                inImagePath1: null,
                inTime: "",
            },    
            pickerOptions: {
                disabledDate: time => {
                    return time.getTime() > new Date(JSON.parse(sessionStorage.getItem('commonTime')))
                }
            },                

        };
    },
  
    computed: {
        ...mapGetters({
            carTypeList: 'getCarTypeList',	
        }),
    }, 
    watch:{
        searchCarNum(newVal,oldVal){
            this.getOutSearchCar()
        },     
        visible(newVal,oldVal){
            // if (newVal) {
                this.isShowCarNumCheckDialog = newVal
            // }
        },     
        isShowCarNumCheckDialog(newVal,oldVal){
            if (!newVal) {
                // console.log(newVal)
			    this.$emit('update:visible', false)
            }
        },              
    },
    
    methods: {
        //手动出场
        manualOut(){
           let carInfo = {
                carNum: this.inCarInfo.carNum,
                carType: this.inCarInfo.carType,
            }
            this.$emit('manual-out',carInfo)
            this.isShowCarNumCheckDialog = false
        },    
        //监听窗口打开    
        listenOpenDialog(){
            console.log('打开无进场记录弹窗');

            // console.log(this.carNumCheckProp);
            this.chargeFormData.inTime = new Date(JSON.parse(sessionStorage.getItem('commonTime')))
            this.chargeFormData.money = 0
            this.chargeCarInfo = this.Util.deepCopy(this.carNumCheckProp)
            this.chargeCarInfo.carNum = this.carNumCheckProp.carNum1 || this.carNumCheckProp.carNum2
            this.chargeCarInfo.carType = this.carNumCheckProp.carType2 || this.carNumCheckProp.carType2
            this.isShowCarNumCheckDialog = true
            this.searchCarNum = this.chargeCarInfo.carNum

            if (this.carNumCheckProp.outImagePath1) {
            	this.outCarImgSrc = `http://${ip}/images/${this.carNumCheckProp.outImagePath1}`
            }else if(this.carNumCheckProp.outImagePath2){
            	this.outCarImgSrc = `http://${ip}/images/${this.carNumCheckProp.outImagePath2}`
            }else{
            	this.outCarImgSrc = notimg
            }

            this.getOutSearchCar()
            // console.log(this.isShowCarNumCheckDialog);
            // this.$refs.InRecord.getOutSearchCar(true,this.inOutRecordProp.carNum)
        },
        //监听窗口关闭     
        listenCloseDialog(){
            console.log('关闭无进场记录弹窗');
            this.isShowCarNumCheckDialog = false
            this.$emit('chargeCarInfo', null)
        },        
               
        // 缴费时间转换
        formatPayTime(row) {
            if (row.payment && row.payment.length) {
                let isPay = false
                for (let i = 0; i < row.payment.length; i++) {
                    if (row.payment[i].isPaid === 1) {
                        isPay = true
                        return this.Util.formatDate.format(new Date(row.payment[0].payTime), "yy/MM/dd hh:mm:ss")
                    } else {
                        isPay = false
                    }                    
                }
                if (!isPay) {
                    return ''
                }


            } else {
                return "";
            }
        },
     
        //车辆信息校正
        carInfoModify(){
            //校正车牌
            if (this.inCarInfo.carNum) {
               if (!this.Util.ruleCarNum(this.inCarInfo.carNum)) {
                   this.$message.error('车牌格式不正确')
                    return
                }               
            }else{
                this.$message.error('车牌不能为空')
                return
            } 
            let tempString = `您确定要把车牌校正为" ${this.inCarInfo.carNum} "吗?`
            this.$confirm(tempString, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                let param = {
                    id: this.inCarInfo.id,
                    inCarNum: this.inCarInfo.carNum,
                    inCarType: this.inCarInfo.carType,
                    operatorId: this.Util.userInfo.id
                }
                updateOnsite(param).then(data => {
                    // console.log(data)
                    if (data.code === "SUCCESS") {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        })
                        this.getOnsiteList(true)
                    } else {
                        this.$message.error(data.msg);
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消校正操作'
                });          
            });
        },
        //查场内车辆
        getOutSearchCar() {
            let param = {
                carNum: this.searchCarNum,
                parkId: this.carNumCheckProp.parkId ,
                operatorId: this.Util.userInfo.id,
            }
            getOutSearchCar(param).then(data => {
                // console.log(data)
                if (data.data.code === "SUCCESS") {
                    this.array = data.data.data
                    //数据初始化
                    this.inCarInfo.id = ''
                    this.inCarInfo.carNum = ''
                    this.inCarInfo.carType = ''

                    this.inCarImgSrc = carimgnot

                } else {
                    this.$message.error(data.data.msg);
                }
            });
        },
   
        //单击行
        rowClick(val) {
            this.rowClickCarInfo = JSON.parse(JSON.stringify(val))
            // console.log(this.rowClickCarInfo);
            this.inCarInfo.id = this.rowClickCarInfo.id
            this.inCarInfo.carNum = this.rowClickCarInfo.inCarNum1 || this.rowClickCarInfo.inCarNum2
            this.inCarInfo.carType = this.rowClickCarInfo.inCarType1 || this.rowClickCarInfo.inCarType2

            if (this.rowClickCarInfo.inImagePath1) {
                this.inCarImgSrc =`http://${ip}/images/${this.rowClickCarInfo.inImagePath1}`  
            }else if(this.rowClickCarInfo.inImagePath2){
                this.inCarImgSrc =`http://${ip}/images/${this.rowClickCarInfo.inImagePath2}`
            }else{
                this.inCarImgSrc = notimg
            }
            // this.inCarInfo.inGateName = this.rowClickCarInfo.gateInfo.gateName

        },
        //单击切换进场图片
        changeInImg(){
            // 取消上次延时未执行的方法
            clearTimeout(this.inClickTimeId)
            //执行延时
            this.inClickTimeId = setTimeout(() => {
                if (this.rowClickCarInfo) {
                    if (this.rowClickCarInfo.inImagePath1 === null && this.rowClickCarInfo.inImagePath2 === null) {
                        this.inCarImgSrc = notimg
                        this.$message({
                            type: 'info',
                            message: '暂无图片',
                        })                            
                        return
                    }

                    let inCarImgSrc1 = `http://${ip}/images/${this.rowClickCarInfo.inImagePath1}` 
                    let inCarImgSrc2 = `http://${ip}/images/${this.rowClickCarInfo.inImagePath2}` 

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
                if (this.carNumCheckProp) {
                    if (this.carNumCheckProp.outImagePath1 === null && this.carNumCheckProp.outImagePath1 === null) {
                        this.outCarImgSrc = notimg
                        this.$message({
                            type: 'info',
                            message: '暂无图片',
                        })                            
                        return
                    }                        
                    let outCarImgSrc1 = `http://${ip}/images/${this.carNumCheckProp.outImagePath1}` 
                    let outCarImgSrc2 = `http://${ip}/images/${this.carNumCheckProp.outImagePath2}` 

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
        //打开大图
        openBigImg(src){
            clearTimeout(this.inClickTimeId)
            clearTimeout(this.outClickTimeId)                
            this.$refs.bigImg.openDialog(src)
        },  
        //现金收费提交
        cashChargeSubmit(){
            this.isShowIframeCenter = true
            console.log(this.carNumCheckProp)
            this.$confirm('请确定收费信息无误后点击确定', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.isShowIframeCenter = false

                let param = {
                    "discountedPay": this.chargeFormData.money*100,
                    "carNum": this.chargeCarInfo.carNum,
                    "carNum1": this.chargeCarInfo.carNum1,
                    "carNum2": this.chargeCarInfo.carNum2,
                    "carType1": this.chargeCarInfo.carType1,
                    "carType2": this.chargeCarInfo.carType2,                    
                    "freePay": 0,
                    "discountTime": 0,
                    "operatorId": this.Util.userInfo.id,
                    "orderId":'',
                    "parkId": this.carNumCheckProp.parkId || JSON.parse(sessionStorage.getItem('parkInfo')).id,
                    "parkRecordId": '',
                    "billingTime": this.Util.computerTimeBetween(new Date(this.chargeFormData.inTime),new Date(JSON.parse(sessionStorage.getItem('commonTime')))),
                    "billingStartTime": this.Util.formatDate.format(new Date(this.chargeFormData.inTime),'yyyy-MM-dd hh:mm:ss'),
                    "payMethod": "现金支付",
                    "remarks": '无进场记录人工收费',
                    "startTime": this.Util.formatDate.format(new Date(this.chargeFormData.inTime),'yyyy-MM-dd hh:mm:ss'),
                    "stopTime": this.Util.formatDate.format(new Date(JSON.parse(sessionStorage.getItem('commonTime'))),'yyyy-MM-dd hh:mm:ss'),
                    "totalPay": this.chargeFormData.money*100,
                    "gateId": this.carNumCheckProp.gateId,
                    "localChargeFlag": false,
                    "couponTypeIds":[],
                    "userType": this.carNumCheckProp.userType,
                    "outImagePath1":this.carNumCheckProp.outImagePath1,
                    "outImagePath2":this.carNumCheckProp.outImagePath2,

                }
                // return
                this.chargeLoading = true
                noRecordcashPayOutPark(param)
                    .then((data) => {
                        this.chargeLoading = false

                        if(data.code === 'SUCCESS'){
                            this.isShowCarNumCheckDialog = false

                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            })
                            this.chargeCarInfo = data.data
                            this.chargeCarInfo.payInfo = '已缴费'
                            this.chargeCarInfo.payMethod = data.data.payMethod
                            
                            //返回收费信息给父组件
                            this.$emit('chargeCarInfo', this.chargeCarInfo)


                        }else{
                            this.chargeCarInfo.payInfo = '缴费失败,请重新确认收费'
                            this.chargeCarInfo.payMethod = ''
                            this.$message.error(data.msg);
                        }
                    })
                    .catch(err=>{
                        this.chargeLoading = false
                        this.chargeCarInfo.payInfo = '缴费失败,请重新确认收费'
                        this.chargeCarInfo.payMethod = ''
                    })

            }).catch(() => {
                this.isShowIframeCenter = false

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
            // console.log(this.carNumCheckProp);
            let params = {
                "cancelType": this.cancelChargeFormData.cancelType,
                "carNum": this.chargeCarInfo.carNum,
                "carType":  this.chargeCarInfo.carType,
                "inGateId": this.carNumCheckProp.gateId,
                "inGateName": this.carNumCheckProp.outGateName,
                "inImagePath": '',
                "inTime": this.Util.formatDate.format(this.chargeFormData.inTime,'yyyy-MM-dd hh:mm:ss'),
                "outGateId": this.carNumCheckProp.gateId,
                "outGateName": this.carNumCheckProp.outGateName,
                "outImagePath": '',
                "outTime": this.Util.formatDate.format(new Date(JSON.parse(sessionStorage.getItem('commonTime'))),'yyyy-MM-dd hh:mm:ss'),
                "payMoney": 0,
                "remark": this.cancelChargeFormData.remark,
                "position":this.carNumCheckProp.position,
            }
            addCancelChargeRecord(params)
                .then((data) => {
                    if(data.code === 'SUCCESS'){
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.cancelChargeVisible = false
                        this.isShowCarNumCheckDialog = false
                            // this.chargeCarInfo.carNum = this.chargeCarInfo.carNum1
                            // this.chargeCarInfo.carType = this.chargeCarInfo.carType1
                        if (this.cancelChargeFormData.cancelType === 1) {
                            this.chargeCarInfo.remarks = `特殊车辆`
                            this.chargeCarInfo.payMethod = ''
                        }
                        if (this.cancelChargeFormData.cancelType === 0) {
                            this.chargeCarInfo.remarks = `无进场记录车辆取消收费`
                            this.chargeCarInfo.payMethod = ''
                        }
                        // console.log(this.chargeCarInfo);
                        //返回信息给父组件
                        this.chargeCarInfo.remarks =`<span class="text-danger">${this.chargeCarInfo.remarks}</span>`                            
                        this.$emit('chargeCarInfo', this.chargeCarInfo)

                    }else{
                        this.$message.error(data.msg);
                    }
                })
        }               

    },
   
};
</script>

<style lang="scss" scoped>
.sm-dialog{
    .img-box{
        .box-top{
            .img{
                width: 49%;
                .img-top{
                    margin: 0px;
                    font-weight: bold;
                    padding: 10px 5px;
                    border-bottom: 1px solid $color-gray2;
                    span{
                        display: inline-block;
                        width: 49%;
                    }
                }
                img{
                    min-height: 160px;
                    cursor: pointer;
                }
                margin-bottom: 5px;
                border: 1px solid $color-gray;					
            }
                        
        }
        .box-bottom{
            background: $color-gray;
            .bottom-left{
                float: left;
                width: 50%;
                // padding: 5px;
            }	
            .bottom-right{
                padding: 5px;
                float: right;
                width: 50%;
                box-sizing: border-box;
                background: $color-gray;
                h4{
                    margin: 6px 0px;
                }
                .right-head{
                    // padding:5px;
                    background: $color-gray;
                }    
                .outCar-p{
                    margin: 0px;
                    padding: 0px 0px 6px 0px;
                    font-size: 20px;
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

<style >
/* table行背景及字体颜色 */
.el-table .danger-row {
  background: #ebcbcb;
}

.el-table .success-row {
  background: #deefd8;
}

.el-table .danger-text {
  color: #F56C6C;
}
</style>

