<template>
<div>
    <el-row class="content">
        <el-col :span="24" class="content-body">
            <div class="body-top clearfix">
                <div class="body-top-left">
                    <span>开始时间：</span>
                    <el-date-picker type="datetime"  v-model="startTime" placeholder="请输入查询时间" :picker-options="pickerOptionsStart"></el-date-picker>
                    <span>结束时间：</span>
                    <el-date-picker type="datetime"  v-model="endTime" placeholder="请输入查询时间" :picker-options="pickerOptionsEnd"></el-date-picker>
                    <!--<label >使用日期</label>-->
                    <!--<el-date-picker type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="getTableList(true)" v-model="searchDate"></el-date-picker>-->
                    <el-select class="width-120" v-model="searchType" placeholder="请选择" @change="searchValue = ''">
                        <el-option label="订单号" value="订单号"></el-option>
                        <el-option label="商家名称" value="商家名称"></el-option>
                        <el-option label="操作员" value="操作员"></el-option>
                    </el-select>                    
                    <el-input class="width-180" v-model.trim="searchValue" placeholder="请输入查询关键字" clearable ></el-input>
                    <el-button type="primary" size="mini" @click="find()">查询</el-button>
                                            
                </div>
                <div class="body-top-right text-right">
                    <el-button type="primary" size="mini" @click="openEditDialog()">汇总</el-button>
                </div>
            </div>
            <div class="body-table" id="printContent">
                <!--列表-->
                <el-table :data="array"  v-loading="listLoading"  height="539" >
                    <el-table-column type="index"  min-width="80" >
                    </el-table-column>   
                    <el-table-column prop="carNum" label="车牌号" min-width="80" sortable >
                    </el-table-column>
                    <el-table-column prop="order_id" label="订单号" min-width="120" sortable show-overflow-tooltip>
                    </el-table-column> 
                    <el-table-column prop="merchantName" label="发放商家" min-width="100" sortable >
                    </el-table-column>                                                                                    
                    <el-table-column prop="couponName" label="优惠券名称" min-width="120" sortable show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="couponType" label="优惠券类型" min-width="100" sortable >
                        <template slot-scope="scope">
                            <span>{{scope.row.couponType | transformCouponType}}</span>
                        </template>                                
                    </el-table-column>    
                    <el-table-column prop="actualValue" label="实际金额" min-width="90" sortable >
                    </el-table-column>                          
                   <el-table-column prop="createTime" label="使用时间" min-width=120 sortable show-overflow-tooltip >
                        <template slot-scope="scope">
                            <span>{{scope.row.createTime | transformTime}}</span>
                        </template>                                
                    </el-table-column> 
                    <el-table-column prop="operatorName" label="操作员" min-width="100" sortable show-overflow-tooltip>
                    </el-table-column>                    
 
                    <el-table-column prop="remarks" label="备注" min-width="110" sortable show-overflow-tooltip >
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
        </el-col>
    </el-row>    	
    <!-- 弹窗-汇总 -->
    <el-dialog class="form-dialog" title="汇总" width="50%"  :visible.sync="addVisible" :close-on-click-modal="false">
        <div class="dialog-box">
            <el-table :data="countArray"  v-loading="listLoading"  key="countArrayTable" show-summary >
                <!-- <el-table-column type="index"  min-width="80" >
                </el-table-column>    -->
                                                                                            
                <el-table-column prop="couponName" label="优惠券名称" min-width="90"  >
                </el-table-column>
                <!-- <el-table-column prop="couponType" label="优惠券类型" min-width="90"  >
                    <template slot-scope="scope">
                        <span>{{scope.row.couponType | transformCouponType}}</span>
                    </template>                                
                </el-table-column>     -->
                <!-- <el-table-column prop="actualValue" label="优惠券额度" min-width="90"  >
                </el-table-column>                           -->
               
                <el-table-column prop="totalUse" label="使用张数" min-width="100"  >
                </el-table-column>                    

                <el-table-column prop="totalValue" label="总金额" min-width="110"  >
                </el-table-column>    
            </el-table>             					
        </div>	
    
    </el-dialog>  
</div>

</template>

<script>
import { mapGetters } from "vuex";
import {getCouponUsedList,getCouponUsedCount} from '@/api/api' ;

export default {
    data(){
        return {
            listLoading: false,
            pageSize:10,
            dataTotal:0,
            currentPage:1,

            searchType:'商家名称',      //查询类型
            searchValue:'',            //查询值
            // searchDate:[new Date(new Date(new Date().toLocaleDateString()).getTime()),new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)],           //查询日期
            startTime:new Date(new Date(new Date().toLocaleDateString()).getTime()),
            endTime:new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1),
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
            array:[],
            countArray:[],
            addVisible:false,
            editTitle:'新增',
            //表单数据
            formData:{
                couponName:'',
                merchantName:'',
                couponType:'1',
                couponValue:'',
                couponMoney:1,
                couponTime:30,
                couponFree:'',
                remark:'',
        },
            //表单数据验证
            formDataRules:{
                couponName: [
                        { required: true, message: '请输入优惠券名称', trigger: 'blur' },
                ],
                merchantName: [
                        { required: true, message: '请输入发放商家', trigger: 'blur' },
                ],                
               
            },            
        }
    },
    
    mounted(){
        this.getTableList(true)
    },
    methods:{
        //打开编辑弹窗
        openEditDialog(){
            this.addVisible = true
            this.getCountList()
        },


        //模糊查询
        find(){
            let startTime = this.startTime
            let endTime = this.endTime;
            if(this.startTime===null ||this.endTime=== null){
                this.$message({
                    message: '开始时间或结束时间不能为空',
                    type: 'warning'
                });
            }else if(this.startTime && this.endTime){
                if(startTime.getTime()<endTime.getTime()){
                    this.getTableList()
                }else if(startTime.getTime()===endTime.getTime()){
                    this.getTableList()
                }else{
                    this.$message({
                        message: '开始时间大于结束时间',
                        type: 'warning'
                    });
                }
            }
        },
        /**
         * 查询
         * @param {booleal} isGlobal 是否是全局搜索,true表示是,当前页要置为1
         */         
        getTableList(isGlobal) {
            if(isGlobal){
                this.currentPage = 1
            }

            let param = {
                beginDate:'',  
                endDate:'',
                operatorName: '',
                merchantName: '',
                orderId:'',
                current:this.currentPage-1,     //前端第一页为1,后端第一页为0
                length:this.pageSize,
                beginDate : this.Util.formatDate.format(this.startTime,'yyyy-MM-dd hh:mm:ss'),
                endDate : this.Util.formatDate.format(this.endTime,'yyyy-MM-dd hh:mm:ss'),
            }           
            
            // if(this.searchDate){
            //     param.beginDate = this.Util.formatDate.format(this.searchDate[0],'yyyy-MM-dd hh:mm:ss')
            //     param.endDate = this.Util.formatDate.format(this.searchDate[1],'yyyy-MM-dd hh:mm:ss')
            // }

            if(this.searchType === '商家名称'){
                param.merchantName = this.searchValue

            }else if( this.searchType === '操作员'){
                param.operatorName = this.searchValue
            }
            else if( this.searchType === '订单号'){
                param.orderId = this.searchValue
            }            

            getCouponUsedList(param).then(data => {
                // console.log(data)
                if (data.data.code === "SUCCESS") {
                    this.array = data.data.data
                    this.dataTotal = data.data.totalCount

                } else {
                    this.$message.error(data.data.msg)
                }
            });
        },   
        /**
         * 汇总查询
         */         
        getCountList() {

            getCouponUsedCount().then(data => {
                // console.log(data)
                if (data.data.code === "SUCCESS") {
                    this.countArray = data.data.data

                } else {
                    this.$message.error(data.data.msg)
                }
            });
        },             
        //页码改变
        handleSizeChange(val) {
            this.pageSize = val
            this.getTableList(false)
        },
        //页改变
        handleCurrentChange(val) {
            this.getTableList(false)
        }, 
     
    }
}
</script>

<style lang="scss" scoped>

.content{
    background: $color-gray; 
    border-radius:10px;  
    .content-body{
        padding:0px 10px;
        .body-top{
                padding: 10px 0px;
                .body-top-left{
                    float: left;
                    width: 79%;
                }
                .body-top-right{
                    float: right;
                    width: 19%;
                }                 
        }
        .body-paging{
            padding: 20px 0px;
        }
    }

}
.form-dialog{
    .dialog-box{
        border-top: 1px solid $color-gray2;
        border-left: 1px solid $color-gray2;
        border-right: 1px solid $color-gray2;
    }
   
}
 
</style>



