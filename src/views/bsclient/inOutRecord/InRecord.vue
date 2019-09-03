<!--在场车辆记录-->
<template>
    <div class="container-in" >
        <el-row class="content">
            
            <el-col :span="16" class="content-left">
                <div class="left-top">
                    <el-col :span="24" class="left-top-input">
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
                                      
                        <keyboard v-model="carNumVal" width="120" placeholder="请输入车牌"></keyboard>   
                        
                        <div class="left-top-right">
                            <span class="data-total font-size-16"><b>当前在场车辆数：{{dataTotal}}</b></span>
                            <el-button type="text" size="mini" icon="el-icon-refresh" @click="getOnsiteList(false)">刷新</el-button>  
                        </div>                        
                      
                    </el-col>   
                
                </div>
                <div class="left-body">
                    <!--列表-->
                    <el-table :data="array" ref="singleTable" highlight-current-row v-loading="listLoading" @row-click="rowClick" height="539" max-height="630" :row-class-name="tableRowClassName">
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
                            <!-- <template slot-scope="scope">
                                <span>{{scope.row.inTime | transformTime}}</span>
                            </template>                         -->
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
                        <el-table-column prop="payment[0]" label="缴费时间" min-width="150" show-overflow-tooltip :formatter="formatPayTime" sortable>
                        </el-table-column> 	
                        <el-table-column prop="inRemark" label="备注信息" min-width="180" show-overflow-tooltip sortable >
                        </el-table-column>
                        <el-table-column prop="inRemark" label="操作" min-width="115" >
                            <template slot-scope="scope">
                                <a href="javascript:;" class="text-blue"  @click="inCarRecordSyncCloud(scope.row)" v-if="markInCarRecordCloud">提交到云端</a>
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
                        </div> -->

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
                    <keyboard v-model="checkCarInfo.carNum"  placeholder="请选择车辆"></keyboard>    
                    <el-select class="width-120" v-model="checkCarInfo.carType" placeholder="请选择" >
                        <el-option v-for="item in carTypeList" :key="item.mark" :label="item.typeName" :value="item.mark">
                        </el-option>
                    </el-select>                            
                    <el-button type="primary" size="mini" @click="carInfoModify" :disabled="!this.checkCarInfo.id" v-if="markInCarRecordCorrection">校正</el-button>
                </div>
                <div class="right-carimg text-center">
                    <el-tooltip content="单击切换图片,双击查看大图" placement="bottom">
                        <img  id="rightCarimg" class="cursor-pointer img-responsive" :src="inCarImgSrc" :onerror="imgOnerror" alt="图片路径未找到图片" @click="changeImg" @dblclick="openBigImg" >
                    </el-tooltip>                     
                </div>
                
            </el-col>
            
        </el-row>
        <!-- 弹窗-大图 -->
        <big-img  ref="bigImg"></big-img>   

    </div>   
    
</template>

<script>
import { mapGetters } from "vuex";
import {
    ip,getOnsiteList, updateOnsite,getOnsiteOutList,inCarRecordSyncCloud
} from "@/api/api";
import carimgnot from "@/assets/img/carimgnot.png"
import notimg from "@/assets/img/notimg.png"
import notfindimg from "@/assets/img/notfindimg.png"


export default {
    props: [ 'inRecordProp' ],

    data() {
        return {
            clickTimeId:null,                            //存储点击图片的定时器
            imgOnerror: 'this.src="' + notfindimg + '"',     //图片路径找不到图片/出错时的占位图 
            inCarImgSrc:carimgnot,                       //无图片路径占位图

            listLoading: false,                          //在场车辆查询loading
            pageSize:10,
            dataTotal:0,
            currentPage:1,
            carNumVal: '',          //车牌查找
            gateName: '',
            checkCarInfo:{         //车牌校正信息
                id:'',
                carType:'',
                carNum:'',
            },
            array: [],
            rowClickCarInfo:null,     
            manualInProps:{		//手动进场props数据
                visible:false,
                gateId:'',
                sluiceName:'',
                isGate:false,
                issluice:false,
                isTime:false,
                getList:null,
            },   

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
            
            markInCarRecordCorrection:false,
            markInCarRecordCloud:false,
        };
    },
    watch:{
        carNumVal(){
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
        this.markInCarRecordCorrection = this.Util.isPermission('markInCarRecordCorrection')
        this.markInCarRecordCloud = this.Util.isPermission('markInCarRecordCloud')
    },     
    methods: {
        //同步到云端
        inCarRecordSyncCloud(row){
            // console.log(this.checkCarInfo);
            this.checkCarInfo.id = row.id;
            inCarRecordSyncCloud({id: this.checkCarInfo.id}).then(data => {
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
                    if (row.payment[i].isPaid === 1) {
                        isPay = true
                        return row.payment[i].payTime
                    }else if(row.payment[i].isPaid === -1){
                        return row.payment[i].payTime
                    }
                     else {
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
        //初始化查询条件
        initialSearchValue(){
            this.gateName = ''
            this.startTime = ''
            this.endTime = ''            
            this.carNumVal = ''               
        },             
        //查场内车辆
        getOnsiteList(isGlobal,carNum) {
            if (carNum) {
                this.carNumVal = carNum               
            }

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
                    this.checkCarInfo.id = ''
                    this.checkCarInfo.carType = ''
                    this.checkCarInfo.carNum = ''
                    this.isCharge = true
                    this.changeNotice = '请点击左侧车辆查看计费情况'

                    this.inCarImgSrc = carimgnot

                } else {
                    this.$message.error(data.data.msg);
                }
            }).catch(err=>{
                this.listLoading = false
            });
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
            if (type === 1) {
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
            }else if(type === 2){
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
            }else{
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

            this.isCharge = true

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
        //打开大图
        openBigImg(){
            clearTimeout(this.clickTimeId)
            this.$refs.bigImg.openDialog(this.inCarImgSrc)
        },        
  
    },
   
};
</script>

<style lang="scss" scoped>
.container-in{
    .content {
        background: $color-gray;
        max-width:100%;
        .content-left {
            border-right: 2px solid #bbbbbb; 
            background: $color-gray;
            .left-top {
                .left-top-button {
                    padding: 8px 20px;
                    text-align: right;

                }
                .left-top-input {
                    .left-top-right{
                        display: inline-block;
                        .data-total{
                                padding: 0 10px;
                            } 
                    }
                    
                    padding: 8px;
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
            .right-carimg {
                overflow: hidden;
                #rightCarimg{
                    background: #fff;
                    height: 300px;
                    width: 96%;
                }
            }
            .right-top {
                padding: 8px 10px;
            }
        
        
        }
    }
    
}

</style>

<style>
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

.current-row > td {
    background: #FFA54F !important;
}
</style>

