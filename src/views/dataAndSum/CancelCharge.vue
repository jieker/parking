
<template>
    <section id="cancelCharge">
        <div class="FA-warpper">
            <!--工具条-->
            <el-col :span="24" class="FA-toolbar " >
                <el-form :inline="true" :model="filters">
                    <el-form-item  class="outTime">
                        <span>开始时间：</span>
                        <el-date-picker type="datetime"  v-model="filters.startTime" :picker-options="pickerOptionsStart"></el-date-picker>
                        <span>结束时间：</span>
                        <el-date-picker type="datetime"  v-model="filters.endTime" :picker-options="pickerOptionsEnd"></el-date-picker>
                        <!--<el-date-picker type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="filters.whatTime"></el-date-picker>-->
                    </el-form-item>
                    <el-form-item label="原因类型" class="cancelTyle">
                        <el-select v-model="filters.cancelType" placeholder="选择查询条件">
                            <el-option label="全部类型" value=""></el-option>
                            <el-option label="取消消费" value="0"></el-option>
                            <el-option label="特殊车辆" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="总金额:" class="moneySum">
                        <span>{{this.totalMoney}}元</span>
                    </el-form-item>
                    <el-form-item class="keyQuery">
                        <el-select v-model="filters.condition" placeholder="选择查询条件">
                            <el-option label="车牌号" value="carNum"></el-option>
                            <el-option label="管理员" value="managerName"></el-option>
                        </el-select>
                        <el-input v-model="filters.what" placeholder="请输入查询关键字" clearable></el-input>
                        <el-button type="primary" @click="find()" style="margin-left:10px;">查询</el-button>
                        <el-button type="primary" @click="exportCancelCharge()" style="margin-left:10px;">导出</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <!--列表-->
            <el-table :data="array" highlight-current-row :header-cell-style="{'text-align':'center'}" v-loading="listLoading" style="width: 100%;">
                <el-table-column type="index" label="序号" :index="indexMethod" width="55" align="center">
                </el-table-column>
                <el-table-column prop="operatorName" label="管理员"  min-width="100" align="center">
                </el-table-column>
                <el-table-column prop="carNum" label="车牌号"  min-width="100" align="center">
                </el-table-column>
                <el-table-column prop="carType" label="车辆类型"  min-width="100" align="center" :formatter="formatCarType">
                </el-table-column>
                <el-table-column prop="inTime" label="进场时间"  min-width="120" show-overflow-tooltip sortable align="center">
                </el-table-column>
                <el-table-column prop="outTime" label="出场时间"  min-width="120" show-overflow-tooltip sortable align="center">
                </el-table-column>
                <el-table-column prop="inGateName" label="进场闸口"  min-width="100" align="center">
                </el-table-column>
                <el-table-column prop="outGateName" label="出场闸口"  min-width="100" align="center">
                </el-table-column>
                <el-table-column prop="totalPay" label="消费金额(元)"  min-width="100" align="center">
                </el-table-column>
                <el-table-column prop="valid" label="原因类型"  min-width="100" :formatter="formatType" align="center">
                </el-table-column>
                <el-table-column prop="remark" label="备注"  min-width="150" show-overflow-tooltip align="center">
                </el-table-column>
                <el-table-column label="操作">
                        <template slot-scope="scope">
                            <div @click="getPhoto(scope.row),dialogPhotoVisible = true">
                                <a href="javascript:;">进出场图</a>
                            </div>
                        </template>
                </el-table-column>
            </el-table>
            <div class="elPag clearfix">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 40, 80, 200]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total" >
                </el-pagination>
                <el-button type="primary" class="PagGo">GO</el-button>
            </div>


            <el-dialog
                    title="进出场图片"
                    :visible.sync="dialogPhotoVisible"
                    width="80%"
                    :close-on-click-modal="false"

            >
                　<div class="photoDialog">
                <div class="appearanceImg">
                    <p>进场图片</p>
                    <img :src="this.inImagePath" />
                </div>
                <div class="appearanceImg">
                    <p>出场图片</p>
                    <img :src="this.outImagePath" />
                </div>
            </div>
            </el-dialog>
        </div>
    </section>
</template>


<script>

    import { ip,cancelCharge,exportCancelCharge } from '@/api/api';
    import notimg from "@/assets/img/notimg.png"
    export default {
        data() {
            return {
                dialogPhotoVisible:false,  //进出场图片
                inImagePath:'',
                outImagePath:'',
                totalMoney:'',   //总金额
                filters:{
                    startTime:new Date(new Date(new Date().toLocaleDateString()).getTime()),
                    endTime:new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1),
                    what:'',
                    condition:'carNum',
                    cancelType:''
                },
                pickerOptionsStart: {
                    disabledDate: time => {
                        let endDateVal = this.filters.endTime
                        if (endDateVal) {
                            return time.getTime() > new Date(endDateVal).getTime();
                        }
                    }
                },
                pickerOptionsEnd: {
                    disabledDate: time => {
                        let beginDateVal = this.filters.startTime
                        if (beginDateVal) {
                            return (
                                time.getTime() < new Date(beginDateVal).getTime()
                            );
                        }
                    }
                },
                // 列表信息
                array: [],
                currentPage:1,
                total: 0,
                pageSize: 10,
                listLoading: false,

            }
        },
        mounted() {
            // 获取table数据
            this.getCancelChargeList();
        },
        beforeUpdate(){
            try {
                let menuNode = document.getElementsByClassName('menu-active')
                menuNode[0].classList.remove('menu-active')  
            } catch (error) {}            
            document.getElementById("menu-box-7").classList.add("menu-active")				
        },         
        methods: {
            // 导出excel文件
            exportCancelCharge(){
                let condition = this.filters.condition;
                let conditionTime = this.filters.conditionTime;
                let what = this.filters.what;
                // let whatTime = this.filters.whatTime;
                // let checkList = this.filters.checkList;
                let obj = {};
                obj[condition] = what;
                let para = {
                    cancelType:this.filters.cancelType,
                    start : this.Util.formatDate.format(this.filters.startTime,'yyyy-MM-dd hh:mm:ss'),
                    end : this.Util.formatDate.format(this.filters.endTime,'yyyy-MM-dd hh:mm:ss'),
                }
                this.$axios({
                    url:exportCancelCharge,
                    method: 'get',
                    params: para,
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
            },
            //获取图片
            getPhoto(row){
                this.inImagePath = row.inImagePath;
                this.outImagePath = row.outImagePath;
                if(this.inImagePath){
                    this.inImagePath =  `http://${ip}/images/`+this.inImagePath
                }else{
                    this.inImagePath = notimg
                }

                if(this.outImagePath){
                    this.outImagePath =  `http://${ip}/images/`+this.outImagePath
                }else{
                    this.outImagePath = notimg
                }
            },
            // 每页数据大小
            handleSizeChange(val) {
                this.pageSize =  val ;
                this.getCancelChargeList();
            },
            // 当前页
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getCancelChargeList();
            },
            formatCarType: function (row, column) {
                return row.carType === "small"? '小型车' : row.carType === "large" ? '大型车' :row.carType == "superLarge" ? '超大型车':'特殊车辆';
            },
            // 业务类型
            formatType: function (row, column) {
                return row.operateType == 0? '取消收费' : row.operateType == 1 ? '特殊车辆':'';
            },
            // 自定义序号
            indexMethod(index){
                return index +this.pageSize*(this.currentPage-1);
            },

            //模糊查询
            find(){
                let startTime = this.filters.startTime
                let endTime = this.filters.endTime;
                if(this.filters.startTime===null ||this.filters.endTime=== null){
                    this.$message({
                        message: '开始时间或结束时间不能为空',
                        type: 'warning'
                    });
                }else if(this.filters.startTime && this.filters.endTime){
                    if(startTime.getTime()<endTime.getTime()){
                        this.getCancelChargeList()
                    }else if(startTime.getTime()===endTime.getTime()){
                        this.getCancelChargeList()
                    }else{
                        this.$message({
                            message: '开始时间大于结束时间',
                            type: 'warning'
                        });
                    }
                }
            },
            // 获取table数据
            getCancelChargeList(isAgm){
                let condition = this.filters.condition;
                let conditionTime = this.filters.conditionTime;
                let what = this.filters.what;
                // let whatTime = this.filters.whatTime;
                // let checkList = this.filters.checkList;
                let obj = {};
                obj[condition] = what;
                let para = {
                    length:this.pageSize,
                    cancelType:this.filters.cancelType,
                    start : this.Util.formatDate.format(this.filters.startTime,'yyyy-MM-dd hh:mm:ss'),
                    end : this.Util.formatDate.format(this.filters.endTime,'yyyy-MM-dd hh:mm:ss'),
                }
                // if(whatTime){
                //     //按办理时间查找
                //     let start = whatTime[0].getTime()
                //     let end = whatTime[1].getTime()
                //     //如果是当天,上限改为23:59:59
                //     if(start === end){
                //         end += 24*3600000-1
                //     }
                //     para.start = this.Util.formatDate.format(new Date(start),'yyyy-MM-dd hh:mm:ss')
                //     para.end = this.Util.formatDate.format(new Date(end),'yyyy-MM-dd hh:mm:ss')
                //     // if(conditionTime=='carNum'){
                //     //     para.start = this.Util.formatDate.format(whatTime[0],'yyyy-MM-dd')
                //     //     para.end = this.Util.formatDate.format(whatTime[1],'yyyy-MM-dd')
                //     // }else{
                //     //     //按办理时间查找
                //     //     let start = whatTime[0].getTime()
                //     //     let end = whatTime[1].getTime()
                //     //     //如果是当天,上限改为23:59:59
                //     //     if(start === end){
                //     //         end += 24*3600000-1
                //     //     }
                //     //     para.start = this.Util.formatDate.format(new Date(applyLowTime),'yyyy-MM-dd hh:mm:ss')
                //     //     para.end = this.Util.formatDate.format(new Date(applyUpTime),'yyyy-MM-dd hh:mm:ss')
                //     // }
                // }
                if(isAgm){
                    para.current=0
                }else{
                    para.current=this.currentPage-1
                }
                let params=Object.assign(para,obj)
                cancelCharge(params).then(res=>{
                    this.array = res.data.data.pageData.content;
                    this.total = res.data.data.pageData.totalElements;
                    this.totalMoney = res.data.data.totalMoney;
                    // console.log(res)
                }).catch(err=>{
                    console.log(err)
                })
            },
        },
    }

</script>
<style lang="scss" scoped>
    #cancelCharge{
        .photoDialog{
            display:flex;
            .approachImg{
                width: 50%;
                height: 700px;
            }
            .appearanceImg{
                width: 50%;
                height: 700px;
                img{
                    width: 99%;
                    height: 500px;
                }
            }
        }
        .el-form-item{
            width: 32%;
        }
        .keyQuery{
            width: 40% !important;
            .el-select{
                width: 25%;
                .el-input{
                    width: 100%;
                }
            }
            .el-input{
                width: 45%;
            }
        }
        .outTime{
            width: 600px;
            /*.el-form-item__content{*/
                /*width: 82%;*/
                /*.el-input__inner{*/
                    /*width: 100%;*/
                /*}*/
            /*}*/
        }
        .cancelTyle{
            width: 30%;
            .el-form-item__content{
                width: 69%;
            }
        }
        .moneySum{
            width: 7%;

        }
    }
</style>

