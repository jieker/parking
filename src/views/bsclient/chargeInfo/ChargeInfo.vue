<!--收费情况-->
<template>
    <div>
        <el-dialog class="form-dialog" title="收费情况"  width="90%" :visible.sync="chargeInfoProp.visible" @open="openChargeInfoDialog" @closed="closeDialog">
            <div class="content-body">
                <div class="body-top clearfix">
                    <div class="body-top-left">
                        <el-select v-model="currentUserId"  placeholder="请选择用户" class="width-120" @change="userChange">
                            <el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item.id">
                            </el-option>
                        </el-select>  
                        <el-date-picker class="width-200" v-model="startTime" type="datetime"  placeholder="开始时间" :picker-options="pickerOptionsStart">
                        </el-date-picker>     
                        至                   
                        <el-date-picker class="width-200"  v-model="endTime" type="datetime"  placeholder="结束时间" :picker-options="pickerOptionsEnd">
                        </el-date-picker>                                                
         
                        <keyboard v-model.trim="carNumSearch" @keyup.enter.native ="getPaymentList(true)" placeholder="请输入车牌" width="120"></keyboard>  
                        <el-button type="primary" size="small" @click="getPaymentList(true)">查询</el-button> 

                    </div>
                    <div class="body-top-right text-right">
                        <el-button type="primary" size="small" @click="exportOnsitePaymentList()">导出</el-button>
                        <el-button type="primary" size="small" @click="openChargeStatisticalDialog">收费统计</el-button>
                        <el-button type="primary" size="small" @click="openDiscountConunt">优惠信息汇总</el-button>
                    </div>                    

                </div>
                <div class="body-table">
                    <!--列表-->
                    <el-table :data="array" highlight-current-row v-loading="listLoading"  height="550" >
                        <el-table-column prop="operatorName" label="收费人" min-width="100" sortable>
                        </el-table-column>                            
                        <el-table-column prop="carNum" label="车牌号" min-width="100" sortable>
                        </el-table-column>
                        <el-table-column prop="carType" label="车辆类型" min-width="100" sortable>
                            <template slot-scope="scope">
                                <span>{{scope.row.carType | transformCarType}}</span>
                            </template>                        
                        </el-table-column>
                        <el-table-column prop="startTime" label="计费开始时间" min-width="160" sortable>
                        </el-table-column>                                                                      
                        <el-table-column prop="payTime" label="缴费时间" min-width="160"  sortable>
                        </el-table-column>
                        <el-table-column prop="billingTime" label="计费时长" min-width="130"  sortable>
                            <template slot-scope="scope">
                                <span>{{scope.row.billingTime | transformSeconds}}</span>
                            </template>                        
                        </el-table-column> 
                        <el-table-column prop="totalPay" label="应收(元)" min-width="115" sortable>
                            <template slot-scope="scope">
                                <span>{{scope.row.totalPay | transformMoney}}</span>
                            </template>
                        </el-table-column>                    									
                        <el-table-column prop="discountedPay" label="实收(元)" min-width="107" sortable >
                            <template slot-scope="scope">
                                <span>{{scope.row.discountedPay | transformMoney}}</span>
                            </template>                        
                        </el-table-column>
                        <el-table-column prop="freePay" label="总优惠(元)" min-width="115" sortable>
                            <template slot-scope="scope">
                                <span>{{scope.row.freePay | transformMoney}}</span>
                                <el-popover placement="right" width="300" trigger="click" v-show="scope.row.freePay !==0">
                                    <el-row>
                                        <el-col :span="12">
                                            <b>电子优惠券</b> 
                                        </el-col>
                                        <el-col :span="12">
                                            <b>券额</b>
                                        </el-col>                                                
                                    </el-row>
                                    <div v-for="item in eleDiscountDetails" :key="item.couponName">
                                        <el-row>
                                            <el-col :span="12">
                                                <p>{{item.couponName}}</p>
                                            </el-col>
                                            <el-col :span="12" class="text-success">
                                                <p>{{item.value}}</p>
                                            </el-col> 
                                        </el-row>
                                            <hr>
                                    </div>
                                    
                                    <div v-for="item in paperDiscountDetails" :key="item.couponName">
                                        <el-row>
                                            <el-col :span="12">
                                                <p>纸质优惠券</p>
                                                <p>金额(元)</p>
                                            </el-col>
                                            <el-col :span="12" class="text-success">
                                                <p>{{item.couponName}}</p>
                                                <p>{{item.couponActualValue | transformMoney}}</p>
                                            </el-col>
                                        </el-row>
                                        <hr>
                                    </div>
                                    <el-button slot="reference" type="text" size="mini" class="text-blue"  style="margin:0;padding:0;" @click="getOnsiteCouponList(scope.row)">详情</el-button>
                                </el-popover>  
                            </template>                        
                        </el-table-column> 	
                        <el-table-column prop="payType" label="支付方式" min-width="115" sortable>
                        </el-table-column>  
                        <el-table-column prop="remark" label="备注信息" min-width="180" show-overflow-tooltip sortable>
                        </el-table-column>                                        					
                    </el-table> 
                </div>
                <div class="body-paging text-center elPag">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="pageSize"
                        layout="total,sizes,prev, pager, next, jumper"
                        :total="dataTotal">
                    </el-pagination>
                    <el-button type="primary" class="PagGo">GO</el-button>
                </div>
            </div>
        </el-dialog> 
        
        <!-- 弹窗-优惠信息汇总 -->
        <d-discounts :discountsPropData="discountsPropData"></d-discounts>
        <!-- 弹窗-收费统计 -->
        <el-dialog class="form-dialog" title="收费统计"   :visible.sync="chargeStatisticalVisible" >
            <div class="table-box">
                <el-table :data="chargeStatisticalArry" highlight-current-row   style="background:#f3f3f3;">
                    <el-table-column prop="payType" label="收费方式"  min-width="105" >
                        <template slot-scope="scope">
                            <span>{{scope.row.payType }}</span>
                        </template>                                       
                    </el-table-column>
                    <el-table-column prop="totalPay" label="汇总" min-width="115" >
                        <template slot-scope="scope">
                            <span>{{scope.row.totalPay | transformMoney}}</span>
                        </template>                         
                    </el-table-column>
                    <el-table-column prop="freePay" label="优惠" min-width="100"  >
                        <template slot-scope="scope">
                            <span>{{scope.row.freePay | transformMoney}}</span>
                        </template> 
                    </el-table-column> 
                    <el-table-column prop="discountedPay" label="实收" min-width="115" >
                        <template slot-scope="scope">
                            <span>{{scope.row.discountedPay | transformMoney}}</span>
                        </template>
                    </el-table-column>                    									
                </el-table>
            </div>
        </el-dialog>        
    </div>
</template>

<script>
import {getOnsitePaymentList,getStatistList,getOnsiteCouponList,listUser,exportOnsitePaymentList} from '@/api/api'

export default {
    components:{
        'DDiscounts':() => import('./DDiscounts.vue'),
    },
    props: [ 'chargeInfoProp' ],

    mounted(){
        
    },    
    data(){
        return {
            listLoading:false,
            pageSize:10,
            dataTotal:0,
            currentPage:1,

            carNumSearch:this.chargeInfoProp.carNum,

            chargeStatisticalDateSearch:null,

            discountsPropData:{
                visible:false,
            },            
            chargeStatisticalVisible:false,
            array:[],
            chargeStatisticalArry:[],
            eleDiscountDetails:[],      //电子优惠券详情
            paperDiscountDetails:[],    //纸质优惠券详情
            discountDetailsTotal:0,
            userList:null,
            currentUserId:this.Util.userInfo.id,

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
            
        }
    },
    
    methods:{
        closeDialog(){
            this.$emit('listenCloseMainDialog') 									
        },        
        // 导出excel文件
        exportOnsitePaymentList() {
            let params={
                operatorId:this.currentUserId,
                carNum:this.carNumSearch,
                startTime:this.Util.formatDate.format(this.startTime,'yyyy-MM-dd hh:mm:ss'),
                endTime:this.Util.formatDate.format(this.endTime,'yyyy-MM-dd hh:mm:ss'),
                current:this.currentPage,
                length:this.pageSize,
            }
            if (this.Util.isBrowerIE()) {
                console.log(333);
                let URLStr = `${exportOnsitePaymentList}?operatorId=${params.operatorId}&carNum=${params.carNum}&startTime=${params.startTime}&endTime=${params.endTime}&current=${params.current}&length=${params.length}`
                this.Util.ieExportExcel(URLStr)                
            }else{
                this.$axios({
                    url:exportOnsitePaymentList,
                    method: 'get',
                    params: params,
                    responseType: 'blob', //二进制流
                })
                .then( (res) => {
                    // this.listLoading = false
                    // console.log(res)
                    if (res.headers.code === 'SUCCESS') {
                        this.Util.exportExcel(res)
                    }else{
                        this.$message.error(decodeURI(res.headers.msg))
                    }
                })
            }            
            // console.log(para)

        },
        //用户改变
        userChange(){
            console.log(this.currentUserId);
            
            this.getPaymentList(true)
        },
        //打开优惠汇总
        openDiscountConunt(){
            if (this.startTime && this.endTime) {
                if (this.startTime >= this.endTime) {
                    this.$message.error('开始时间不能小于等于结束时间')
                    return
                }else{
                    // console.log(this.currentUserId);
                    this.discountsPropData.visible = true
                    this.discountsPropData.startTime = this.startTime
                    this.discountsPropData.endTime = this.endTime
                    this.discountsPropData.carNumSearch = this.carNumSearch
                    this.discountsPropData.operatorId = this.currentUserId
                }                
            }else {
                    if (!this.startTime === true && !this.endTime === true) {
                            this.$message.error('查询开始时间和结束时间不能为空')
                            return                        
                    }else if (!this.startTime === true  && !this.endTime === false) {
                            this.$message.error('请选择开始时间')
                            return
                    }else if(!this.startTime === false  && !this.endTime === true){
                            this.$message.error('请选择结束时间')
                            return
                    }
            }            
        },
        // 优惠详情
        getOnsiteCouponList(value){
            let params = {
                paymentId:value.id
            }
            getOnsiteCouponList(params).then(res=>{
                this.eleDiscountDetails = []
                this.paperDiscountDetails = []
                this.discountDetailsTotal = 0
                if(res.data.code=='SUCCESS'){
                    let tempList = res.data.data
                    for (let i = 0; i < tempList.length; i++) {
                        this.discountDetailsTotal += tempList[i].couponActualValue
                        if (tempList[i].couponOrigin === 1) {               //电子优惠券
                            if (tempList[i].type === 0) {
                                tempList[i].couponName = '全免券'
                            }else if (tempList[i].type === 1) {
                                tempList[i].value = this.Util.formatMinutes(tempList[i].value)
                                tempList[i].couponName = `免时长${tempList[i].value }`
                            }else if (tempList[i].type === 2) {
                                tempList[i].value = this.Util.formatMoney(tempList[i].value)

                                tempList[i].couponName = `免金额${tempList[i].value}元`
                            }
                            this.eleDiscountDetails.push(tempList[i])
                        }else if(tempList[i].couponOrigin === 0){
                            this.paperDiscountDetails.push(tempList[i])     //纸质优惠券
                        }
                    }
                }
                else{
                    this.$message.error(res.data.msg)
                }                
            
            }) 
        },
        // 用户列表
        getListUser(){
            let para={
                length:1000,
                current:1
            }
            listUser(para).then(res=>{
                // console.log(res)
                if (res.data.code === "SUCCESS") {
                    this.userList=res.data.data.content
                } else {
                    this.$message.error(res.data.msg)
                }                

            })
        },        
       //打开收费情况弹窗
        openChargeInfoDialog(){
            // console.log(this.chargeInfoProp)
            this.carNumSearch = this.chargeInfoProp.carNum
            this.currentUserId = this.Util.userInfo.id
            let loginTime = this.Util.userInfo.createTime

            this.startTime = this.chargeInfoProp.startTime || new Date(loginTime.replace( /-/g,"/"))
            this.endTime = this.chargeInfoProp.endTime || new Date(JSON.parse(sessionStorage.getItem('commonTime')))

            this.getPaymentList(true)
            this.getListUser()
        },        
           
        //页码改变
        handleSizeChange(val) {
            this.pageSize = val
            this.getPaymentList(false)
        },
        //页改变
        handleCurrentChange(val) {
            this.getPaymentList(false)
        },    
        //查询收费情况
        getPaymentList(isGlobal){

            let params={
                operatorId:this.currentUserId,
                carNum:this.carNumSearch,
                startTime:'',
                endTime:'',
                current:this.currentPage,
                length:this.pageSize,
            }
            if (isGlobal) {
                params.current = 1 
            }
            if (this.startTime && this.endTime) {
                if (this.startTime >= this.endTime) {
                    this.$message.error('开始时间不能小于等于结束时间')
                    return
                }else{
                    params.startTime = this.Util.formatDate.format(this.startTime,'yyyy-MM-dd hh:mm:ss')
                    params.endTime = this.Util.formatDate.format(this.endTime,'yyyy-MM-dd hh:mm:ss')                             
                }                
            }else {
                    if (!this.startTime === true && !this.endTime === true) {
                            this.$message.error('查询开始时间和结束时间不能为空')
                            return                        
                    }else if (!this.startTime === true  && !this.endTime === false) {
                            this.$message.error('请选择开始时间')
                            return
                    }else if(!this.startTime === false  && !this.endTime === true){
                            this.$message.error('请选择结束时间')
                            return
                    }
            }             
            this.listLoading = true
            getOnsitePaymentList(params).then(res=>{
                this.listLoading = false
                if(res.data.code=='SUCCESS'){
                    this.array = []
                    this.array=res.data.data.content;
                    this.dataTotal=res.data.data.totalElements;
                }
                else{
                    this.$message.error(`${res.data.msg}`)
                }                
            
            }).catch(err=>{
                this.listLoading = false
            }) 
        },
        //打开收费统计弹窗
        openChargeStatisticalDialog(){
            if (this.startTime && this.endTime) {
                if (this.startTime >= this.endTime) {
                    this.$message.error('开始时间不能小于等于结束时间')
                    return
                }else{
                    this.chargeStatisticalVisible = true 
                    this.getStatistList()
                }                
            }else {
                    if (!this.startTime === true && !this.endTime === true) {
                            this.$message.error('查询开始时间和结束时间不能为空')
                            return                        
                    }else if (!this.startTime === true  && !this.endTime === false) {
                            this.$message.error('请选择开始时间')
                            return
                    }else if(!this.startTime === false  && !this.endTime === true){
                            this.$message.error('请选择结束时间')
                            return
                    }
            }            
        },
        //查询收费统计
        getStatistList(){
            let params = {
                operatorId: this.currentUserId,
                startTime:'',
                endTime:'',
                carNum:this.carNumSearch
            }
            if (this.startTime && this.endTime) {
                if (this.startTime >= this.endTime) {
                    this.$message.error('开始时间不能小于等于结束时间')
                    return
                }else{
                    params.startTime = this.Util.formatDate.format(this.startTime,'yyyy-MM-dd hh:mm:ss')
                    params.endTime = this.Util.formatDate.format(this.endTime,'yyyy-MM-dd hh:mm:ss')                             
                }                
            }else {
                    if (!this.startTime === true && !this.endTime === true) {
                            this.$message.error('查询开始时间和结束时间不能为空')
                            return                        
                    }else if (!this.startTime === true  && !this.endTime === false) {
                            this.$message.error('请选择开始时间')
                            return
                    }else if(!this.startTime === false  && !this.endTime === true){
                            this.$message.error('请选择结束时间')
                            return
                    }
            }              
            getStatistList(params).then(res=>{
                // console.log(res.data)
                if(res.data.code=='SUCCESS'){
                    this.chargeStatisticalArry=res.data.data;
                    this.dataTotal=res.data.data.totalElements;
                }
                else{
                    this.$message.error(`${res.data.msg}`)
                }
            })
        },
    }
}
</script>

<style lang="scss" scoped>

     
    .content-head{
        h2{
            padding:0px 8px;
            color: $color-orange;
        }
        hr{
            border: 1px solid #999;
        }
    }
    .content-body{
            background: $color-gray;
            padding:0px 10px;
            .body-top{
                padding: 10px 0px;
                 .body-top-left{
                     float: left;
                     width: 69%;
                 }
                 .body-top-right{
                     float: right;
                     width: 29%;
                 }                
            }
           .body-table{
                background: #fff;
            }            
            .body-paging{
                padding: 20px 0px;
            }
    }

    .form-dialog{
        .table-box{
            border-top:1px solid $color-gray2; 
            border-left:1px solid $color-gray2; 
            border-right:1px solid $color-gray2; 
        }
    }
</style>
