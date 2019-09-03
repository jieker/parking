<!--收费中心-->
<template>
    <div class="container-c" >
        <el-row class="content" v-loading="computerLoading" element-loading-text="计算费用中,请稍等....">
            <el-col :span="24" class="content-head">
                <h2>场内车辆</h2>
                <hr>
            </el-col>
            <el-col :span="16" class="content-left">
                <div class="left-top">
                    <el-col :span="24" class="left-top-time ">
                        <el-select v-model="gateName" class="width-120" placeholder="未选择"  @change="gateChange">
                            <el-option  label="全部岗亭" value="">
                            </el-option>                            
                            <el-option v-for="item in gateList" :key="item.id" :label="item.gateName" :value="item.gateName">
                            </el-option>
                        </el-select>                        
                        <el-date-picker class="width-200" v-model="startTime" type="datetime"  placeholder="开始时间" :picker-options="pickerOptionsStart">
                        </el-date-picker>     
                        至                   
                        <el-date-picker class="width-200"  v-model="endTime" type="datetime"  placeholder="结束时间" :picker-options="pickerOptionsEnd">
                        </el-date-picker> 
                        <el-button type="primary" size="mini" @click="getOnsiteList(false)" >查询</el-button>

                        <keyboard v-model="carNumVal" width="120"></keyboard>   

                        <div class="left-top-right">
                            <el-upload  action=""  :limit="1" :file-list="fileList" :before-upload="beforeUpload" :show-file-list="false" style="display:inline-block;">
                                <el-button slot="trigger" type="primary" size="mini" style="margin-right:10px;" v-if="markInCarInfoImport">导入</el-button>
                            </el-upload> 
                            <!-- <el-button type="primary" size="mini" @click="inCarRecordExcelExport" v-if="markInCarInfoImport">导出</el-button> -->

                            <el-button type="primary" size="mini" @click="addInRecord" v-if="markInRecordAdd">新增</el-button>                             
                            <span class="data-total font-size-16">
                                <b>当前在场车辆数：{{dataTotal}}</b>
                            </span>
                            <el-button class="font-size-16" type="text" size="mini" icon="el-icon-refresh" @click="refreshInCarInfo">刷新</el-button>                                         
                        </div>

                    </el-col>                     
                    
                </div>
                <div class="left-body" >
                    <!--列表-->
                    <el-table :data="array"  highlight-current-row v-loading="listLoading" @row-click="rowClick"  height="539" max-height="630" :row-class-name="tableRowClassName">
                        <el-table-column prop="inCarNum1" label="车牌1" min-width="100" sortable>
                            <template slot-scope="scope" >
                                <a href="javascript:;" class="text-blue"  @click.stop="clickCarNum(scope.row,1)">{{scope.row.inCarNum1 | transformNoting}}</a>
                            </template>                             
                        </el-table-column>
                        <el-table-column prop="inCarNum2" label="车牌2" min-width="100" sortable>
                            <template slot-scope="scope">
                                <a href="javascript:;" class="text-blue"  @click.stop="clickCarNum(scope.row,2)">{{scope.row.inCarNum2 | transformNoting}}</a>
                            </template>                            
                        </el-table-column>                        
                        <el-table-column prop="inTime" label="进场时间" min-width="160"  sortable>
                        </el-table-column>
                        <el-table-column prop="inCarType1" label="车辆类型" min-width="100" sortable>
                            <template slot-scope="scope">
                                <span>{{scope.row.inCarType1 | transformCarType}}</span>
                            </template>
                        </el-table-column> 
                        <el-table-column prop="userType" label="用户类型" min-width="115" sortable>
                            <template slot-scope="scope">
                                <span>{{scope.row.userType | transformUserType}}</span>
                            </template>                         
                        </el-table-column>                    									
                        <el-table-column prop="gateInfo.gateName" label="进场岗亭" min-width="100" sortable >
                        </el-table-column>
                        <el-table-column prop="payment[0]" label="缴费时间" min-width="150" :formatter="formatPayTime" sortable>
                        </el-table-column> 	
                        <el-table-column prop="inRemark" label="备注信息" min-width="200" show-overflow-tooltip sortable >
                        </el-table-column>    
                        <el-table-column prop="" label="操作" min-width="138" >
                            <template slot-scope="scope">
                                <a href="javascript:;" class="text-blue"  @click.stop="inCarRecordSyncCloud(scope.row)" v-if="markInCarInfoCloud">提交到云端</a>
                                <a href="javaScript:;" class="text-danger" @click.stop="deleteInRecord(scope.row)" v-if="markInCarInfoDelete"><i class="el-icon-delete"></i>删除</a>
                            </template>                             
                        </el-table-column>                          

                    </el-table> 
                </div>
                <div class="left-footer">
                    <div  class="left-footer-notice">
                        <div class="notice-item">
                            <span class="pay-notice bg-success"></span>
                            <span>已缴费,未超时</span>
                            <span class="pay-notice bg-danger"></span>
                            <span>缴费超时</span>
                        </div>
                        <div class="notice-item">
                            <span class="not-small"><span >注:</span><span class="text-danger">红色字体</span>为非小车,注意核实</span>                    
                        </div>
                        <!-- <div class="notice-item float-right">
                            <span >当前在场车辆数：<span class="text-orange">{{dataTotal}}</span>&nbsp&nbsp&nbsp&nbsp</span>
                        </div>                         -->
                    </div>
                    <div class="left-footer-paging text-right ">
                        <el-button type="primary" size="mini" class="paging-go">GO</el-button>
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page.sync="currentPage"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="dataTotal">
                        </el-pagination>        
                    </div>                 
                </div>  
            </el-col>
        
            <el-col :span="8" class="content-right" >
                <div class="right-top">
                    <keyboard v-model="checkCarInfo.carNum" placeholder='请选择一辆车' ></keyboard>   
                    <el-select class="width-120" v-model="checkCarInfo.carType" placeholder="请选择">
                        <el-option v-for="item in carTypeList" :key="item.mark" :label="item.typeName" :value="item.mark">
                        </el-option>
                    </el-select>                            
                    <el-button type="primary" size="mini" @click="carInfoModify" :disabled="!this.checkCarInfo.id" v-if="markInCarInfoCorrection">校正</el-button>
                </div>
                <div class="right-carimg text-center">
                    <el-tooltip content="单击切换图片,双击查看大图" placement="bottom">
                        <img  id="rightCarimg" class="cursor-pointer img-responsive" :src="inCarImgSrc" :onerror="imgOnerror" alt="图片路径未找到图片" @click="changeImg" @dblclick="openBigImg">
                    </el-tooltip>                    
                </div>
                <div class="right-carinfo">
                        <div class="carinfo-p" ><span class="text-danger">提示：</span><span class="text-warning" v-html="this.changeNotice"></span></div>

                        <div class="carinfo-p">计费开始时间：<span class="text-success">{{chargeCarInfo.billingStartTime}}</span></div>
                        <div class="carinfo-p">计费时长：<span class="text-success">{{chargeCarInfo.billingTime | transformSeconds}}</span></div>
                        <div class="carinfo-p">应收金额：<span class="text-success">{{chargeCarInfo.totalPay | transformMoney}}元</span></div>
                        <div class="carinfo-p">优惠金额：<span class="text-success">{{chargeCarInfo.freePay | transformMoney}}元</span>
                            <!-- <span>&nbsp&nbsp</span> 
						    <el-button type="primary" size="mini" style="font-size:14px;padding:2px;" icon="el-icon-refresh" >同步微信和优惠券</el-button> -->
                        </div>
                        <!-- <div class="carinfo-p">纸质优惠：
                            <el-select size="mini"  class="width-150" v-model="paperDiscountsId" placeholder="请选择" @change="paperDiscountsChange" :disabled="isCharge">
                                <el-option v-for="item in paperDiscountsArry" :key="item.id" :label="item.couponName" :value="item.id">
                                </el-option>
                            </el-select>                             
                            <span>&nbsp&nbsp</span>   
                            <el-button type="primary" size="mini" style="font-size:14px;padding:2px;" @click="addPaperDiscount" >增加</el-button>
                        </div> -->
                        <!-- <div v-for="(paper,index) in paperDiscountsAdd" :key="index" class="carinfo-p">纸质优惠：
                            <el-select size="mini" v-model="paperDiscountsAdd[index]" class="width-150"  placeholder="未选择" @change="paperDiscountsChange" :disabled="isCharge">
                                <el-option v-for="(item,index)  in paperDiscountsArry" :key="item.id" :label="item.couponName" :value="index"></el-option>
                            </el-select>      
                            <span>&nbsp&nbsp</span>   
                            <el-button type="primary" size="mini" style="font-size:14px;padding:2px;" @click="deletePaperDiscount" >删除</el-button>
                        </div>                         -->
                        <div class="carinfo-p">优惠时间：<span class="text-success">{{chargeCarInfo.discountTime | transformMinutes}}</span></div>
                        <div class="carinfo-p">实收金额：<span class="text-success">{{chargeCarInfo.discountedPay | transformMoney}}元</span></div>
                        <div class="carinfo-p" v-show="chargeCarInfo.payMethod&&chargeCarInfo.payMethod!=='null'">支付方式：<span class="text-success">{{chargeCarInfo.payMethod | transformNull}}</span></div>
                        <div class="carinfo-p">备注：
                            <el-input size="mini" class="carinfo-p-input" v-model="chargeCarInfo.chargeRemarks" clearable="" placeholder="点此输入备注"></el-input>
                        </div>
                </div>
                <div class="right-button">
                    <el-button type="primary" class="button-style" @click="confimCharge" :disabled="isCharge" v-if="markInCarInfoCharge">现金收费{{chargeCarInfo.discountedPay | transformMoney}}元</el-button>
                    <!-- <el-button type="primary" class="button-style" @click="scanCharge" :disabled="isCharge" v-if="markInCarInfoCharge">扫码付款</el-button> -->
                </div>
            </el-col>
            <!-- 弹窗-手动新增 -->
		    <d-in-park :manual-in-props="manualInProps" @getlist="getOnsiteList" direction="center" width="50%" ref="dInPark"></d-in-park>
            <!-- 弹窗-扫码支付 -->
            <el-dialog class="form-dialog" title="扫码支付"  width="35%" :visible.sync="scanPayVisible" :close-on-click-modal="false">
                <div class="dialog-box">
                    <h3 class="margin-0">请扫客户支付码收款</h3>
                    <el-input class="scanpay-input" ref="customerInput" ></el-input>
                    <div class="text-center">
                        <el-button >取消</el-button>
                        <el-button type="primary">确定</el-button>
                    </div>
                </div>	
            </el-dialog>    
            <!-- 弹窗-大图 -->
            <big-img  ref="bigImg"></big-img>
        </el-row>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

import {
    ip,base,getOnsiteList, getOnsiteOutList, getOnsitePaymentList, updateOnsite,getGateList,  
    inCarBilling,inCarCharge, getCouponTypeAllList,inCarRecordSyncCloud,inCarRecordExcelImport,inCarRecordExcelExport,deleteInRecord
} from "@/api/api";
import carimgnot from "@/assets/img/carimgnot.png"
import notimg from "@/assets/img/notimg.png"
import notfindimg from "@/assets/img/notfindimg.png"

export default {

    data() {
        return {
            clickTimeId:null,                             //存储点击图片的定时器
            imgOnerror: 'this.src="' + notfindimg + '"',  //图片路径找不到图片/出错时的占位图
            inCarImgSrc: carimgnot,                       //无图片路径占位图

            scanPayVisible: false,                        //控制扫码支付弹窗的开关 

            paperIndex: 0,                                //纸质优惠券所选项在列表中的索引
            listLoading: false,                           //在场车辆查询loading
            computerLoading:false,                        //计费loading
            pageSize:10,
            dataTotal:0,
            currentPage:1,

            fileList:[],        //导入文件
            fileName:null,      //导入的文件名
            file:null,          //导入的文件            

            carNumVal: '',          //车牌查找
            gateName: '',           //岗亭类型查找

            checkCarInfo:{         //车牌校正信息
                id:'',
                carType:'',
                carNum:'',
            },
            isCharge:true,         //控制是否能点击收费按钮,不能点击的情况,1.未选中车牌,2.已缴费,3.计费异常
            changeNotice:'请点击左侧车辆查看计费情况',
            //手动新增props数据
            manualInProps:{		
                isGate:false,       //岗亭下拉选disabled属性,新增时传false
                isTime:false,       //时间disabled属性,新增时传false
            },
            paperDiscountsAdd:[],
            paperDiscountsSelect: '',
            paperDiscountsId: '',
            paperDiscountsSelectId: [],
            array: [],
            paperDiscountsArry: [], 
            
            rowClickCarInfo:null,     //存储选中行车辆信息
            //存储计费收费信息
            chargeCarInfo:{
                carNum: "",
                carType: "",
                discountTime: 0,
                discountedPay: 0,
                freePay: 0,
                inGateName: "",
                inImagePath1: null,
                inTime: "",
                orderId: "",
                outCarNum1: '',
                outGateName: "",
                outTime: "",
                parkId: "",
                parkRecordId: "",
                billingTime: '',
                remarks: "",
                totalPay: 0,
                userType: 0,
                payInfo:'',
                payMethod:'',
                chargeRemarks:'',
                payStatus:'',        //-1未缴费,1已缴费,2月卡用户,3免费                
            }, 
            //时间范围查找
            startTime:'',
            endTime:'',
            pickerOptionsStart: {
                disabledDate: time => {
                    let endDateVal = this.endTime
                    if (endDateVal) {
                        return time.getTime() > new Date(endDateVal).getTime();
                    }
                }
            },
            pickerOptionsEnd: {
                disabledDate: time => {
                    let beginDateVal = this.startTime
                    if (beginDateVal) {
                        return (
                            time.getTime() < new Date(beginDateVal).getTime()
                        );
                    }
                }
            },


            //用于权限控制显示隐藏				
            markInRecordAdd:false,									
            markInCarInfoImport:false,									
            markInCarInfoDelete:false,	
            markInCarInfoCloud:false,									
            markInCarInfoCorrection:false,                       
            markInCarInfoCharge:false,									
        };
    },
    watch:{
        carNumVal(newVal,oldVal){
            // console.log(newVal)
            this.getOnsiteList(true)
        },  
    },
    computed: {
        ...mapGetters({
            gateList: 'getGateList',	
            carTypeList: 'getCarTypeList',	
        }),
    },  
    mounted() {
        
        this.markInRecordAdd = this.Util.isPermission('markInRecordAdd')
        this.markInCarInfoImport = this.Util.isPermission('markInCarInfoImport')
        this.markInCarInfoDelete = this.Util.isPermission('markInCarInfoDelete')

        this.markInCarInfoCharge = this.Util.isPermission('markInCarInfoCharge')
        this.markInCarInfoCloud = this.Util.isPermission('markInCarInfoCloud')
        this.markInCarInfoCorrection = this.Util.isPermission('markInCarInfoCorrection')     
        
        this.getOnsiteList(false)
        this.getCouponTypeAllList()        
    },
    beforeUpdate(){
        try {
            let menuNode = document.getElementsByClassName('menu-active')
            menuNode[0].classList.remove('menu-active')  
        } catch (error) {}
       
        document.getElementById("menu-box-0").classList.add("menu-active")				
    },
    methods: {
        // 导入表格,提交前
        beforeUpload(file){
            this.files = file
            this.fileName = file.name;

            const extension = file.name.split('.')[1] === 'xls'
            const extension2 = file.name.split('.')[1] === 'xlsx'

            if (!extension && !extension2) {
                this.fileName = ''
                this.files = null                
                this.$message.warning('上传文档只能是 xls、xlsx格式!')
                return
            }
            this.submitUpload()
            return false // 返回false不会自动上传

        },
         // 导入表格,提交
        submitUpload() {
            let fileFormData = new FormData()

            fileFormData.append('file', this.files)//filename是键，file是值，就是要传的文件，
            fileFormData.append('operatorName', this.Util.userInfo.realName)

            this.$axios({
                url:inCarRecordExcelImport,
                method: 'post',
                data: fileFormData,
                headers:{
                    'Content-Type':'multipart/form-data'
                }

            })
            .then( (res) => {
                    // console.log(res)
                    if(res.data.code === 'SUCCESS'){
                        this.getOnsiteList(false)
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        })
                    }else if(res.data.code === 'FAILURE'){
                        this.$notify.error({
                            title: '提示',
                            message: `导入未完成,表格第${res.data.rowNum}行${res.data.columnNum}列"${res.data.errorData}",请修改后重新选择文件再次导入`,
                            duration: 0,
                            offset: 60
                        });                            
                    }
                    else {
                        this.$message.error(res.data.msg);
                        
                    }
            }) 

        },   
        addPaperDiscount(){
            this.paperIndex += 1
            let paper = `paper${this.paperIndex}`
            paperDiscountsAdd.push(paper)
        },
        //同步到云端
        inCarRecordSyncCloud(row){
            inCarRecordSyncCloud({id: row.id}).then(data => {
                // console.log(data)
                if (data.code === "SUCCESS") {
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    })
                } else {
                    this.$message.error(data.msg);
                }
            });             
        },
        // 缴费时间转换
        formatPayTime(row) {
            if (row.payment && row.payment.length) {
                let isPay = false
                for (let i = 0; i < row.payment.length; i++) {
                    if (row.payment[i].isPaid === 1) {          //缴费未超时
                        isPay = true
                        return row.payment[i].payTime
                    }else if(row.payment[i].isPaid === -1){     //缴费超时
                        return row.payment[i].payTime
                    }
                    else {                                      //未缴费
                        isPay = false
                    }                    
                }
                if (!isPay) {
                    return ''
                }

            } else {
                return ""
            }
        },
        //车牌校正
        carInfoModify(){
            if (this.checkCarInfo.carNum) {
               if (!this.Util.ruleCarNum(this.checkCarInfo.carNum)) {
                   this.$message.error('车牌格式不正确')
                    return
                }               
            }else{
                this.$message.error('车牌不能为空')
                return
            } 
            let tempString = `您确定要把车牌校正为" ${this.checkCarInfo.carNum} "吗?`
            this.$confirm(tempString, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                let param = {
                    id: this.checkCarInfo.id,
                    inCarNum: this.checkCarInfo.carNum,
                    inCarType: this.checkCarInfo.carType,
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
            
        //岗亭切换
        gateChange(){
            this.getOnsiteList(true)
        },        
        //查场内车辆
        getOnsiteList(isGlobal) {
            let param = {
                carNum: this.carNumVal,
                gateName: this.gateName,
                current: this.currentPage,
                length: this.pageSize,
            }
            if(isGlobal){
                param.current = 1
            }

            if (this.startTime && this.endTime) {
                 if (this.startTime >= this.endTime) {
                    this.$message.error('开始时间不能小于等于结束时间')
                    return
                }else{
                    param.startTime = this.Util.formatDate.format(this.startTime,'yyyy-MM-dd hh:mm:ss')
                    param.endTime = this.Util.formatDate.format(this.endTime,'yyyy-MM-dd hh:mm:ss')                             
                }                
            }else {
                if (!this.startTime === true  && !this.endTime === false) {
                        this.$message.error('请选择开始时间')
                        return
                }else if(!this.startTime === false  && !this.endTime === true){
                        this.$message.error('请选择结束时间')
                        return
                }
            }


            this.listLoading = true
            getOnsiteList(param).then(data => {
                this.listLoading = false

                // console.log(data)
                if (data.data.code === "SUCCESS") {

                    this.array = data.data.data.content;
                    this.dataTotal = data.data.data.totalElements
                    //数据初始化
                    this.rowClickCarInfo = null
                    this.checkCarInfo.id = ''
                    this.inCarImgSrc = carimgnot

                } else {
                    this.$message.error(data.data.msg);
                }
            }).catch(err=>{
                this.listLoading = false
            })
        },
        //刷新
        refreshInCarInfo(){
            //数据初始化
            this.checkCarInfo.id = ''
            this.checkCarInfo.carType = ''
            this.checkCarInfo.carNum = ''
            this.getOnsiteList(false)
            this.isCharge = true
        },
        //查优惠券
        getCouponTypeAllList() {
            getCouponTypeAllList().then(data => {
                // console.log(data)
                if (data.data.code === "SUCCESS") {
                    this.paperDiscountsArry = data.data.data
                } else {
                    this.$message.error(data.data.msg)
                }
            });
        },
        //纸质优惠券改变 
        paperDiscountsChange(list){
            // console.log(list)
            this.paperDiscountsSelectId = []
            if(list.length > 0){
                let discountMoney = 0
                let discountTime = 0
                for(let i = 0,len = list.length; i<len; i++){
                    let index = list[i]
                    let paperDiscount = this.paperDiscountsArry[index]
                    this.paperDiscountsSelectId.push(paperDiscount.id)
                    // console.log(paperDiscount)
                    if(paperDiscount.couponType === 0){
                        discountMoney += this.chargeCarInfo.totalPay
                    }else  if(paperDiscount.couponType === 1){
                        discountMoney += paperDiscount.couponValue
                    }else  if(paperDiscount.couponType === 2){
                        discountTime += paperDiscount.couponValue
                    }else{
                        return
                    }
                }

                let param = {
                    carNum: this.rowClickCarInfo.inCarNum1,
                    carType:this.rowClickCarInfo.inCarType1,
                    deviceNo: '',
                    gateId: this.rowClickCarInfo.inGate,
                    operatorId: this.Util.userInfo.id,
                    discountTime:this.chargeCarInfo.discountTime + discountTime,
                    freePay:this.chargeCarInfo.freePay + discountMoney*100,
                }
                this.inCarBilling(param)
            }else{
                let param = {
                    carNum: this.rowClickCarInfo.inCarNum1,
                    carType:this.rowClickCarInfo.inCarType1,
                    deviceNo: '',
                    gateId: this.rowClickCarInfo.inGate,
                    operatorId: this.Util.userInfo.id,
                    discountTime:0,
                    freePay:0,
                }
                this.computerLoading = true
                this.inCarBilling(param)                
            }

        },      
        //根据是否缴费增加背景颜色 
        tableRowClassName({ row, rowIndex }) {
            if (row.payment && row.payment.length) { 

                let isPay = false

                for (let i = 0; i < row.payment.length; i++) {
                    if (row.payment[i].isPaid === 1) {          //如果已经缴费
                        isPay = true
                        return row.inCarType1 === "success-row" ? "" : "success-row"
                    }else if(row.payment[i].isPaid === -1){     //如果缴费超时
                        return row.inCarType1 === "small" ? "danger-row" : "danger-row danger-text"
                    }
                    else{
                        isPay = false
                    }
                }  
                //未缴费 
                if (!isPay) {
                    return row.inCarType1 === "small" ? "" : "danger-text"
                }         

            } else {  //未缴费
                return row.inCarType1 === "small" ? "" : "danger-text"
            }
        },
        //页码改变
        handleSizeChange(val) {
            this.pageSize = val
            this.getOnsiteList(false)
        },
        //页改变
        handleCurrentChange(val) {
            this.getOnsiteList(false)
        },
        //单击行
        rowClick(val){
            this.clickCarNum(val,0)
        },
        /**
         * 点击车牌
         * @param {object} val 行信息对象
         * @param {number} type 当点击行时传0,点击车牌1时传1,点击车牌2时传2
         */        
        clickCarNum(val,type){

            if (type === 1) {       //点击车牌1
                if (val.inCarNum1) {
                    this.checkCarInfo.carNum = val.inCarNum1
                    this.checkCarInfo.carType = val.inCarType1                     
                }else{
                    //车牌无,不执行
                    return
                }
                this.rowClickCarInfo = this.Util.deepCopy(val)
                this.checkCarInfo.id = this.rowClickCarInfo.id     

                if (this.rowClickCarInfo.inImagePath1) {
                    this.inCarImgSrc = `http://${ip}/images/${this.rowClickCarInfo.inImagePath1}`
                }else{
                    this.inCarImgSrc = notimg
                }
            }else if(type === 2){   //点击车牌2
                if (val.inCarNum2) {
                    this.checkCarInfo.carNum = val.inCarNum2
                    this.checkCarInfo.carType = val.inCarType2                     
                }else{
                    //车牌无,不执行
                    return
                }
                this.rowClickCarInfo = this.Util.deepCopy(val)
                this.checkCarInfo.id = this.rowClickCarInfo.id 
                
                if (this.rowClickCarInfo.inImagePath2) {
                    this.inCarImgSrc = `http://${ip}/images/${this.rowClickCarInfo.inImagePath2}`
                }else{
                    this.inCarImgSrc = notimg
                }                
            }else{                  //点击行
                this.rowClickCarInfo = this.Util.deepCopy(val)
                this.checkCarInfo.id = this.rowClickCarInfo.id 

                this.checkCarInfo.carNum = this.rowClickCarInfo.inCarNum1 || this.rowClickCarInfo.inCarNum2
                this.checkCarInfo.carType = this.rowClickCarInfo.inCarType1 || this.rowClickCarInfo.inCarType2      

                if (this.rowClickCarInfo.inImagePath1) {
                    this.inCarImgSrc = `http://${ip}/images/${this.rowClickCarInfo.inImagePath1}`
                }else if(this.rowClickCarInfo.inImagePath2){
                    this.inCarImgSrc = `http://${ip}/images/${this.rowClickCarInfo.inImagePath2}`
                }else{
                    this.inCarImgSrc = notimg
                }                
            }

            //计费信息初始化
            for(let key in this.chargeCarInfo) {
                this.chargeCarInfo[key] = ''
            }            
            this.paperDiscountsSelect = []
            this.isCharge = true

            let param = {
                carNum: this.checkCarInfo.carNum,
                carType:this.checkCarInfo.carType,
                deviceNo: '',
                gateId: this.rowClickCarInfo.inGate,
                operatorId: this.Util.userInfo.id,
                discountTime:0,
                freePay:0,
            }
            this.computerLoading = true   
            this.inCarBilling(param)
                              
        },
        //计费
        inCarBilling(param){
            this.computerLoading = true
            inCarBilling(param)
                .then((data) => {
                this.computerLoading = false

                    // console.log(data)
                    if(data.code === 'SUCCESS'){
                        this.chargeCarInfo = data.data  

                        this.changeNotice = this.chargeCarInfo.remarks
                        //备注为收费中心缴费
                        this.chargeCarInfo.chargeRemarks = '收费中心'
                        //根据是否缴费判断缴费按钮是否可点击
                        this.chargeCarInfo.payStatus  === -1 ? this.isCharge = false : this.isCharge = true
                        //计费出错
                        if (this.chargeCarInfo.errorFlag) {
                            this.changeNotice =`<span class="text-danger">${this.chargeCarInfo.remarks}</span>` 
                            this.$message.error(this.chargeCarInfo.remarks)
                        }                        
                      
                    }else{
                        this.$message.error(this.chargeCarInfo.remarks)
                        this.changeNotice =`<span class="text-danger">${this.chargeCarInfo.remarks}</span>` 

                        // this.changeNotice = `计费异常`                        
                    }
                })
                .catch(err=>{
                        this.computerLoading = false
                        this.changeNotice = '网络断开或服务器错误,未完成计费'
                })
        },
        //确认收费  
        confimCharge() {
            this.$confirm("请确认信息无误后点击确认操作!", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    let param = {
                        "discountedPay": this.chargeCarInfo.discountedPay ,
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
                        "startTime": this.Util.formatDate.format(new Date(this.chargeCarInfo.inTime),'yyyy-MM-dd hh:mm:ss'),
                        "stopTime": this.Util.formatDate.format(new Date(this.chargeCarInfo.outTime),'yyyy-MM-dd hh:mm:ss'),
                        "totalPay": this.chargeCarInfo.totalPay,
                        "gateId": this.chargeCarInfo.gateId,
                        "localChargeFlag": this.chargeCarInfo.localChargeFlag,
                        "couponTypeIds":this.paperDiscountsSelectId,
                    }
                    inCarCharge(param)
                        .then((data) => {
                            // console.log(data)
                            if(data.code === 'SUCCESS'){
                                this.$message({
                                    message: '缴费成功',
                                    type: 'success'
                                });
                                this.isCharge = true                                    //按钮设为不可点击
                                this.changeNotice = '支付成功'                          //提示改为支付成功       
                                this.chargeCarInfo.payMethod =  data.data.payMethod                          
                                this.getOnsiteList()
                            }else{
                                this.changeNotice = '缴费失败,请重新确认收费'                               
                                this.chargeCarInfo.payMethod = ''                                
                                this.$message.error(data.msg);                           
                            }
                        })
                        .catch(err=>{
                                this.chargeCarInfo.payMethod = '' 
                        })
                })
            .catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消操作"
                });
            });
        },
        //扫码支付
        scanCharge() {
            this.scanPayVisible = true;
            this.$nextTick(function () {
            this.$refs.customerInput.$el.querySelector('input').focus();
            });            
        },
        //新增进场记录
        addInRecord() {
            this.$refs.dInPark.openDialog()
        },
        //单击切换图片
        changeImg(){
            // 取消上次延时未执行的方法
            clearTimeout(this.clickTimeId)
            //执行延时
            this.clickTimeId = setTimeout(() => {
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
        //双击打开大图
        openBigImg(){
            clearTimeout(this.clickTimeId)
            this.$refs.bigImg.openDialog(this.inCarImgSrc)
        },
        // 删除    
        deleteInRecord(row){
            let carNum = row.inCarNum1 || row.inCarNum2
            let tempString = `您确定要删除" ${carNum} "的在场记录吗?`
            let params = {
                id:row.id,
                operatorId:this.Util.userInfo.id
            }
            this.$confirm(tempString, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                deleteInRecord(params,row.id)
                    .then((data) => {
                        if(data.code === 'SUCCESS'){
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getOnsiteList(false)
                        }else{
                            this.$message.error(data.msg);                           
                        }
                })   

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },        
        
    },
   
};
</script>

<style lang="scss" scoped>
.container-c{
    .content {
    background: $color-gray;
    margin: 8px;
    border-radius: 10px;
    max-width:100%;
    .content-head {
        h2 {
            margin:  0px;
            padding: 8px 8px;
            color: $color-orange;
        }
        hr {
            margin:  0px;
            border: 1px solid #bbbbbb;
        }
    }
    .content-left {
        // border-right: 2px solid #bbbbbb; 
        background: $color-gray;
        .left-top {
            .left-top-time {
                padding: 10px;
                .left-top-right{
                    display:inline-block;
                    padding-left:10px;
                    padding-top:6px;
                    .data-total{
                        padding: 0 10px;
                    }                    
                }
            
            }
        }
        .left-body {
            padding: 5px 8px;
        }
        .left-footer {
            .left-footer-notice {
                padding: 6px 10px;
                .notice-item{
                    display: inline-block;
                    .pay-notice {
                        display: inline-block;
                        width: 20px;
                        height: 20px;
                    }
                    .not-small {
                        margin-left: 20px;
                        display: inline-block;
                    }
                    .notice-item-space{
                        font-size:16px;
                    }
                    .bg-success {
                        background-color: $color-success;
                    }
                    .bg-danger {
                        background-color: $color-danger;
                    }                        
                }
            }
            .left-footer-paging {
                padding: 0px 10px ;
                height: 48px;
                .el-pagination{
                    float: right;
                }
                .paging-go{
                    margin: 0px;
                    float: right;
                    padding: 4px 5px !important;
                    margin-top: 3px;
                }        
            }
        }
    }
    .content-right {
        background: $color-gray;
        padding-left: 8px;
        padding-right: 8px;
        border-left: 2px solid #bbbbbb; 

        .right-carimg {
            overflow: hidden;
            #rightCarimg{
                width: 100%;
                height: 320px;
                cursor: pointer;
                background: #fff;
            }
        }
        .right-top {
            padding: 10px 10px;
        }
        .right-carinfo {
            .carinfo-p {
                margin: 8px 0px;
                font-size: 20px;
                display: flex;
                align-items: center;
                .carinfo-p-input{
                    width:82%;
                }
            }
        }
        .right-button {
            margin: 15px 0px;
            text-align: center;
            .button-style {
                padding: 10px 15px;
                font-size: 18px;
                font-weight: bold;
            }
        }
    }
    }
    .form-dialog {
        .dialog-box {
            .scanpay-input {
            margin: 20px 0px;
            }
        }
        .dialog-img{
            min-width: 600px;
            min-height: 450px;
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

