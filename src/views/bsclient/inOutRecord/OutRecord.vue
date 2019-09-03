<template>
    <!-- 出场记录 -->
    <div class="dialog-box clearfix">
        <el-col :span="16" >
            <div class="box-left">
                <div class="right-top">
                    <el-col :span="20" class="left-top-input">
                        <el-date-picker class="width-200" v-model="startTime" type="datetime"  placeholder="开始时间" :picker-options="pickerOptionsStart">
                        </el-date-picker>     
                        至                   
                        <el-date-picker class="width-200"  v-model="endTime" type="datetime"  placeholder="结束时间" :picker-options="pickerOptionsEnd">
                        </el-date-picker>                         
                        <keyboard v-model="carNumVal" width="150" @keyup.enter.native ="getOnsiteOutList(true)"></keyboard> 
                        <el-button type="primary" size="mini" @click="getOnsiteOutList(true)" >查询</el-button>
                        
                    </el-col>   
                    <el-col :span="4" class="left-top-button font-size-16">
                         <el-button type="text" size="mini" icon="el-icon-refresh" @click="getOnsiteOutList(true)">刷新</el-button>
                    </el-col>                     

                </div>
                <div class="right-body">
                    <!--列表-->
                    <el-table :data="array" ref="singleTable" highlight-current-row v-loading="listLoading" @row-click="rowClick" height="528" max-height="630" >
                        <el-table-column prop="outCarNum1" label="车牌1" min-width="105" >
                            <template slot-scope="scope" >
                                <span>{{scope.row.outCarNum1 | transformNoting}}</span>
                            </template>                             
                        </el-table-column>
                        <el-table-column prop="outCarNum2" label="车牌2" min-width="105" >
                            <template slot-scope="scope" >
                                <span>{{scope.row.outCarNum2 | transformNoting}}</span>
                            </template>                            
                        </el-table-column>                        
                        <el-table-column prop="inTime" label="进场时间" min-width="160" >
                        </el-table-column>
                        <el-table-column prop="outTime" label="出场时间" min-width="160" >
                        </el-table-column>
                        <el-table-column prop="payment" label="实收金额(元)" min-width="105"  :formatter="formatTotalPay">
                            <!-- <template slot-scope="scope">
                                <span>{{scope.row.discountedPay | transformMoney}}</span>
                            </template>                             -->
                        </el-table-column>
                        <el-table-column prop="payment" label="支付方式" min-width="105"  :formatter="formatPayType">
                        </el-table-column>
                        <el-table-column prop="inCarType1" label="车辆类型" min-width="100"  >
                            <template slot-scope="scope">
                                <span>{{scope.row.inCarType1 | transformCarType}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="userType" label="用户类型" min-width="115" >
                            <template slot-scope="scope">
                                <span>{{scope.row.userType | transformUserType}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="inNmae" label="进场岗亭" min-width="150" >
                        </el-table-column>
                        <el-table-column prop="outNmae" label="出场岗亭" min-width="150" >
                        </el-table-column>
                        <!-- <el-table-column prop="inRemark" label="备注信息" min-width="115" >
                        </el-table-column>                     					 -->
                    </el-table>
                </div>
                <div class="right-bottom text-center elPag">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page.sync="currentPage"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="dataTotal">
                    </el-pagination>
                    <el-button type="primary" class="PagGo">GO</el-button>
                </div>
            </div>
        </el-col>
        <el-col :span="8" >
            <div class="box-right text-center">
                <div class="left-top"></div>
                <h3>进场图片</h3>
                <el-tooltip content="单击切换图片,双击查看大图" placement="bottom">
                    <img id="inCarImg" :src="inCarImgSrc" alt="图片路径未找到图片" :onerror="imgOnerror" class="img-responsive cursor-pointer left-top-img" @click="changeInImg" @dblclick="openBigImg(inCarImgSrc)">
                </el-tooltip>

                <h3>出场图片</h3>
                <el-tooltip content="单击切换图片,双击查看大图" placement="bottom">
                    <img id="outCarImg" :src="outCarImgSrc" alt="图片路径未找到图片" :onerror="imgOnerror" class="img-responsive cursor-pointer left-top-img" @click="changeOutImg" @dblclick="openBigImg(outCarImgSrc)">
                </el-tooltip>

            </div>
        </el-col>


        <!-- 弹窗-大图 -->
        <big-img  ref="bigImg"></big-img>
    </div>
</template>

<script>
    import {ip,getOnsiteOutList} from '@/api/api'
    import carimgnot from "@/assets/img/carimgnot.png"
    import notimg from "@/assets/img/notimg.png"
    import notfindimg from "@/assets/img/notfindimg.png"

    export default {
        data(){
            return {
                rowClickCarInfo: null,                          //存储选中行的数据
                inClickTimeId: null,                            //存储点击图片的定时器
                outClickTimeId: null,                           //存储点击图片的定时器

                imgOnerror: 'this.src="' + notfindimg + '"',
                listLoading:false,
                pageSize:10,
                dataTotal:0,
                currentPage:1,
                carNumVal:'',
                inCarImgSrc:carimgnot,
                outCarImgSrc:carimgnot,

                array:[],
                startTime:new Date().getTime() - 86400000,
                endTime:new Date().getTime() + 3600000,  
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
        watch:{

        },         
        methods:{
            initialSearchValue(){
                let serverCurrentTime = JSON.parse(sessionStorage.getItem('commonTime'))

                this.startTime = new Date(serverCurrentTime - 86400000)
                this.endTime = new Date(serverCurrentTime)
                this.carNumVal = ''               
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
                    if (this.rowClickCarInfo) {
                        if (this.rowClickCarInfo.outImagePath1 === null && this.rowClickCarInfo.outImagePath1 === null) {
                            this.outCarImgSrc = notimg
                            this.$message({
                                type: 'info',
                                message: '暂无图片',
                            })                            
                            return
                        }                        
                        let outCarImgSrc1 = `http://${ip}/images/${this.rowClickCarInfo.outImagePath1}` 
                        let outCarImgSrc2 = `http://${ip}/images/${this.rowClickCarInfo.outImagePath2}` 

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
            //单击行
            rowClick(val) {
                let tempVal = JSON.parse(JSON.stringify(val))
                this.rowClickCarInfo = tempVal
                // console.log(JSON.parse(JSON.stringify(val)));
                if (tempVal.inImagePath1) {
                    this.inCarImgSrc = `http://${ip}/images/${tempVal.inImagePath1}`
                }else if(tempVal.inImagePath2){
                    this.inCarImgSrc = `http://${ip}/images/${tempVal.inImagePath2}`
                }else{
                    this.inCarImgSrc= notimg
                }

                if (tempVal.outImagePath1) {
                    this.outCarImgSrc = `http://${ip}/images/${tempVal.outImagePath1}`
                }else if(tempVal.outImagePath2){
                    this.inCarImgSrc = `http://${ip}/images/${tempVal.outImagePath2}`
                }else{
                    this.outCarImgSrc= notimg
                }

            },
            // 缴费金额
            formatTotalPay(row) {
                if (row.payment && row.payment.length ) {
                   return (row.payment[0].discountedPay/100).toFixed(2)
                } else {
                    return '0.00';
                }
            },
            // 转换支付类型
            formatPayType(row) {
                if (row.payment && row.payment.length) {
                   return row.payment[0].payType
                } else {
                    return "";
                }
            },
           
            getOnsiteOutList(isGlobal){
                let param = {
                    carNum: this.carNumVal,
                    startTime: '',
                    endTime: '',
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
                        param.startTime = this.Util.formatDate.format(new Date(this.startTime),'yyyy-MM-dd hh:mm:ss')
                        param.endTime = this.Util.formatDate.format(new Date(this.endTime),'yyyy-MM-dd hh:mm:ss')                             
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

                getOnsiteOutList(param).then(data => {
                    this.listLoading = false

                    // console.log(data)
                    if (data.data.code === "SUCCESS") {
                        this.array = data.data.data.content;
                        this.dataTotal = data.data.data.totalElements

                        this.inCarImgSrc = carimgnot
                        this.outCarImgSrc = carimgnot

                    } else {
                        this.$message.error(data.data.msg);
                    }
                }).catch(err=>{
                    this.listLoading = false
                })
            },
            //页码改变
            handleSizeChange(val) {
                this.pageSize = val
                this.getOnsiteOutList(false)
            },
            //页改变
            handleCurrentChange(val) {
                this.getOnsiteOutList(false)
            },
        }
    }
</script>

<style lang="scss" scoped>
    .dialog-box{
        padding: 0px 8px 8px 8px;
        background-color:$color-gray;

        .box-left{
            .right-top{
                background-color:$color-gray;
                border: 1px solid $color-gray;
                    .left-top-button {
                        padding: 8px 20px;
                        text-align: right;
                        .data-total{
                            padding: 0 10px;
                        }
                    }
                    .left-top-input {
                        padding: 8px;
                    }        
            }
            .right-body{
                border-left: 1px solid $color-gray;
                border-right: 1px solid $color-gray;
            }
            .right-bottom{
                margin-top: 20px;
            }
        }
        .box-right{
            padding: 0px 8px;
            background-color:$color-gray;
            h3{
                margin: 0px;
                background-color:#fff;
            }
            .left-top{
                height: 56px;
            }
            .left-top-img{
                width: 100%;
                height: 240px;
                background-color:#fff;
            }
        }
    }
</style>


