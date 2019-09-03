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
                    <!--<label >新增日期</label>-->
                    <!--<el-date-picker type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="getTableList(true)" v-model="searchDate">-->
                    <!--</el-date-picker>-->
                    <el-select class="width-120" v-model="searchType" placeholder="请选择" @change="searchValue = ''">
                        <el-option label="商家名称" value="商家名称"></el-option>
                        <el-option label="操作员" value="操作员"></el-option>
                    </el-select>                    
                    <el-input class="width-180" v-model.trim="searchValue" @keyup.enter.native ="getTableList(true)" placeholder="请输入查询关键字" clearable ></el-input>
                    <el-button type="primary" size="mini" @click="find()">查询</el-button>

                                            
                </div>
                <div class="body-top-right text-right">
                    <el-button type="primary" size="mini" @click="openEditDialog('新增')" v-if="markCouponInfoAdd">新增</el-button>
                </div>
            </div>
            <div class="body-table" id="printContent">
                <!--列表-->
                <el-table :data="array"  v-loading="listLoading" sortable height="539" >
                    <el-table-column type="index"  min-width="80" >
                    </el-table-column>                            
                    <el-table-column prop="couponName" label="优惠券名称" min-width="100" sortable show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="couponType" label="优惠券类型" min-width="80" sortable >
                        <template slot-scope="scope">
                            <span>{{scope.row.couponType | transformCouponType}}</span>
                        </template>                                
                    </el-table-column>    
                    <el-table-column prop="couponValue" label="优惠券额度" min-width="90" sortable >
                    </el-table-column>                          
                    <el-table-column prop="merchantName" label="发放商家" min-width="100" sortable >
                    </el-table-column>
                    <el-table-column prop="operatorName" label="操作员" min-width="100" sortable >
                    </el-table-column>                    
                    <el-table-column prop="createTime" label="新增时间" min-width=120 sortable show-overflow-tooltip >
                        <template slot-scope="scope">
                            <span>{{scope.row.createTime | transformTime}}</span>
                        </template>                                
                    </el-table-column> 
                    <el-table-column prop="remarks" label="备注" min-width="110" sortable show-overflow-tooltip >
                    </el-table-column>    
                    <el-table-column label="操作" min-width="100"  >
                        <template slot-scope="scope">
                            <a href="javaScript:;" class="text-blue" @click="openEditDialog('修改',scope.row)" v-if="markCouponInfoUpdate">修改&nbsp&nbsp</a>
                            <a href="javaScript:;" class="text-danger" @click="deleteTableData(scope.row.id)" v-if="markCouponInfoDelete">删除</a>
                        </template>                                
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
    <!-- 弹窗-新增 -->
    <el-dialog class="form-dialog" :title="editTitle" width="50%" @close="closeEditDialog" :visible.sync="addVisible" :close-on-click-modal="false">
        <div class="dialog-box">
            <el-form label-position="left" label-width="100px" :model="formData" :rules="formDataRules" ref="formData" >
                <el-form-item  label="优惠券名称:" prop="couponName">
                    <el-input class="width-180" v-model.trim="formData.couponName" clearable placeholder="请输入优惠券名称" maxlength=20 ></el-input>
                </el-form-item>						
                <el-form-item  label="发放商家:" prop="merchantName">
                    <el-input class="width-180" v-model.trim="formData.merchantName" clearable placeholder="请输入发放商家" maxlength=20 ></el-input>
                    </el-form-item>						
                <el-form-item  label="优惠类型:" prop="couponType">
                    <el-select class="width-180" v-model="formData.couponType" placeholder="选择优惠类型" >
                        <el-option label="减免金额" :value="1"></el-option> 
                        <el-option label="减免时间" :value="2"></el-option> 
                        <el-option label="全免" :value="0"></el-option> 
                    </el-select>
                </el-form-item>
                <el-form-item  label="优惠额度:" prop="couponMoney" v-show="formData.couponType === 1" key="couponMoney">
                    <el-input-number class="width-180"  v-model.trim="formData.couponMoney" :precision="2" :step="1" :min="0" :max="1000">
                    </el-input-number><span>&nbsp&nbsp元</span>                    
                </el-form-item>     
                <el-form-item  label="优惠额度:" prop="couponTime" v-show="formData.couponType === 2" key="couponTime">
                    <el-input-number class="width-180"  v-model.trim="formData.couponTime"  :step="30" :min="0" :max="6000">
                    </el-input-number><span>&nbsp&nbsp分钟</span>                    
                </el-form-item>                  
                 <el-form-item  label="优惠额度:" prop="couponFree" v-show="formData.couponType === 0" key="couponFree">
                    <el-input class="width-180" v-model.trim="formData.couponFree" disabled placeholder="全免" maxlength=8 >
                    </el-input>
                </el-form-item>              
                <el-form-item  label="备注:">
                    <el-input v-model.trim="formData.remarks" clearable placeholder="请输入备注" >
                    </el-input>
                </el-form-item>	
            </el-form>
            <div  class="dialog-footer text-center">
                <el-button class="footer-btn" @click="addVisible = false">取消</el-button>
                <el-button class="footer-btn" type="primary" @click="addSubmit('formData')" >确认</el-button>
            </div>					
        </div>	
    
    </el-dialog>  
</div>

</template>

<script>
import { mapGetters } from "vuex";
import {getCouponTypeList,addCouponType,updateCouponType,deleteCouponType} from '@/api/api' ;

export default {
    data(){
        return {
            //用于权限控制显示隐藏
            markCouponInfoAdd:false,
            markCouponInfoUpdate:false,
            markCouponInfoDelete:false,

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
            addVisible:false,
            editTitle:'新增',
            //表单数据
            formData:{
                couponName:'',
                merchantName:'',
                couponType:1,
                couponValue:'',
                couponMoney:1,
                couponTime:30,
                couponFree:'',
                remarks:'',
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
        this.markCouponInfoAdd = this.Util.isPermission('markCouponInfoAdd')
        this.markCouponInfoUpdate = this.Util.isPermission('markCouponInfoUpdate')
        this.markCouponInfoDelete = this.Util.isPermission('markCouponInfoDelete')
        this.getTableList(true)
    },
    methods:{
        //打开编辑弹窗
        openEditDialog(title,item){
            this.addVisible = true
            this.editTitle = title

            if( this.editTitle === '新增'){
               this.formData.couponName = '' 
               this.formData.merchantName = '' 
               this.formData.couponType = 1 
               this.formData.couponValue = '' 
               this.formData.couponMoney = 1 
               this.formData.couponTime = 30 
               this.formData.couponFree = '' 
               this.formData.remarks = '' 
          
            }else if(this.editTitle === '修改'){
                // console.log(item)
               this.formData.couponName = item.couponName  
               this.formData.merchantName = item.merchantName  
               this.formData.couponType = item.couponType  
               this.formData.couponValue = '' 
               this.formData.couponMoney = 1 
               this.formData.couponTime = 30 
               this.formData.couponFree = '' 
               this.formData.remarks = item.remarks 
               this.formData.id = item.id 


                // this.formData = this.Util.deepCopy(item)
                // this.formData.couponMoney = 1
                // this.formData.couponTime = 30
                // this.formData.couponFree = ''
                // this.formData.id = item.id 

                if(this.formData.couponType === 0){
                    this.formData.couponFree = item.couponValue 
                }else if(this.formData.couponType === 1){
                    this.formData.couponMoney = item.couponValue 
                }else if(this.formData.couponType === 2){
                    this.formData.couponTime = item.couponValue 
                }
                // console.log(this.formData)

            }
        },
        //关闭编辑弹窗
        closeEditDialog(){
            this.$refs['formData'].resetFields()
            // this.addVisible = true
        },
        //编辑表单提交
        addSubmit(formName){
            this.$refs[formName].validate((valid) => {
					if (valid) {
                        let params = {
                            "couponName":  this.formData.couponName,
                            "couponType":  this.formData.couponType,
                            "couponValue": '',
                            "merchantName":  this.formData.merchantName,
                            "operatorName":  this.Util.userInfo.realName,
                            "remarks":  this.formData.remarks
                        }    
                        if(this.formData.couponType === 0){
                            params.couponValue = this.formData.couponFree
                        }else if(this.formData.couponType === 1){
                            params.couponValue = this.formData.couponMoney
                        }else if(this.formData.couponType === 2){
                            params.couponValue = this.formData.couponTime
                        }    

                        if(this.editTitle === '新增'){
                            // console.log(params)
                            this.addTableData(params)
                        }else if(this.editTitle === '修改'){
                            params.id = this.formData.id
                            this.updateTableData(params)
                        }           

					} else {
						return false;
					}
			}); 
        }, 
        //新增
        addTableData(params){

            addCouponType(params)
                .then((data) => {
                    if(data.code === 'SUCCESS'){
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.addVisible = false
                        this.getTableList(true)
                    }else{
                        this.$message.error(data.msg);                           
                    }
            })  

		 
        },        
        //修改
        updateTableData(params){
            updateCouponType(params)
                .then((data) => {
                    if(data.code === 'SUCCESS'){
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.addVisible = false
                        this.getTableList(true)
                    }else{
                        this.$message.error(data.msg);                           
                    }
            })  
        },        
        // 删除    
        deleteTableData(id){
            this.$confirm('您确定要执行此操作吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                deleteCouponType({id:id})
                    .then((data) => {
                        if(data.code === 'SUCCESS'){
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.getTableList(true)
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
                beginDate : this.Util.formatDate.format(this.startTime,'yyyy-MM-dd hh:mm:ss'),
                endDate : this.Util.formatDate.format(this.endTime,'yyyy-MM-dd hh:mm:ss'),
                current:this.currentPage-1,     //前端第一页为1,后端第一页为0
                length:this.pageSize,
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

            getCouponTypeList(param).then(data => {
                // console.log(data)
                if (data.data.code === "SUCCESS") {
                    this.array = data.data.data
                    this.dataTotal = data.data.totalCount

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
.dialog-footer{
    margin-bottom: 20px;
}
 
</style>



