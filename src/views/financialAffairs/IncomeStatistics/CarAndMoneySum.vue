<template>
   <section id="charge">
        <div class="FA-warpper">
            <!--工具条-->
            <el-col :span="24" class="FA-toolbar " >
                <el-form :inline="true" :model="filters">
                    <el-form-item class="chargeTime" >
                        <span>开始时间：</span>
                        <el-date-picker type="datetime"  v-model="filters.startTime" placeholder="请输入查询时间" :picker-options="pickerOptionsStart"></el-date-picker>
                        <span>结束时间：</span>
                        <el-date-picker type="datetime"  v-model="filters.endTime" placeholder="请输入查询时间" :picker-options="pickerOptionsEnd"></el-date-picker>
                        <!--<el-date-picker type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="filters.chargeTime" clearable></el-date-picker>-->
                        <!--<el-date-picker type="datetimerange"  v-model="filters.chargeTime"></el-date-picker>-->
                        <!-- <el-button type="primary" v-on:click="find">查询</el-button> -->
                    </el-form-item>
                    <el-form-item >
                        <el-button type="primary" @click="find()">查询</el-button>
                        <el-button type="primary" @click="exportFlowAmount()">导出</el-button>
                        <!--<el-button type="primary" @click="Print">打印</el-button>-->
                    </el-form-item>
                </el-form>
            </el-col>
            <!--列表-->
            <el-table :data="array" show-summary  highlight-current-row :header-cell-style="{'text-align':'center'}" v-loading="listLoading" style="width: 100%;">
                <el-table-column prop="chargeMan" label="收费人" align="center">
                </el-table-column>
                <!-- <el-table-column type="index" width="50" :index="indexMethod" label="序号">
                </el-table-column> -->
                <el-table-column prop="cashPay" label="现金支付(元)"  min-width="100" align="center">
                </el-table-column>
                <el-table-column prop="aliPay" label="支付宝支付(元)"  min-width="100" align="center">
                </el-table-column>
                <el-table-column prop="weChatPay" label="微信支付(元)"  min-width="100" align="center">
                </el-table-column>
                <el-table-column prop="unionPay" label="银联支付(元)"  min-width="100" align="center">
                </el-table-column>
                <el-table-column prop="noNeedPay" label="无需支付(元)"  min-width="100" align="center">
                </el-table-column>
                <el-table-column prop="couponPay" label="优惠券支付(元)"  min-width="100" align="center">
                </el-table-column>
                <el-table-column prop="otherPay" label="其他支付(元)"  min-width="100" align="center">
                </el-table-column>
                <el-table-column prop="smallPay" label="小猫支付(元)"  min-width="100" align="center">
                </el-table-column>
                 <el-table-column prop="electronicFree" label="电子优惠(元)" min-width="100" align="center">
                </el-table-column>
                <el-table-column prop="paperFree" label="纸质优惠(元)"  min-width="100" align="center">
                </el-table-column>
                <el-table-column prop="otherFree" label="其他优惠(元)"  min-width="100" align="center">
                </el-table-column>
                <!--<el-table-column  label="操作"  min-width="150" >-->
                    <!--<template slot-scope="scope">-->
                        <!--<a href="javascript:;" style="text-decoration:none" @click="lookStn(scope.$index,scope.row)">查看明细</a>-->
                        <!--<a href="javascript:;" style="margin-left:10px;text-decoration:none" @click="lookSum(scope.$index,scope.row)">查看汇总</a>-->
                    <!--</template>-->
                <!--</el-table-column>-->
            </el-table>
            <!--<div class="elPag clearfix">-->
                <!--<el-pagination-->
                    <!--@size-change="handleSizeChange"-->
                    <!--@current-change="handleCurrentChange"-->
                    <!--:current-page="currentPage"-->
                    <!--:page-sizes="[10, 40, 80, 200]"-->
                    <!--:page-size="pageSize"-->
                    <!--layout="total, sizes, prev, pager, next, jumper"-->
                    <!--:total="total" >-->
                <!--</el-pagination>-->
                <!--<el-button type="primary" class="PagGo">GO</el-button>-->
            <!--</div>-->
        </div>
        <!--纸质优惠券使用情况汇总  -->
        <el-dialog  title="纸质优惠券使用情况汇总" :visible.sync="sumFormVisible">
            <el-row>
                <el-col :span="24" class="InfoTop">
                    <div>
                        <section><h5>收费处：</h5><span>{{chargeSum.Pack}}</span></section>
                        <section><h5>收费人：</h5><span>{{chargeSum.name}}</span></section>
                        <section><h5>{{chargeSum.timeY}}</h5><span>班次明细</span></section>
                    </div>
                    <div>
                        <section><h5>上班时间：</h5><span>{{chargeSum.timeY}}</span></section>
                        <section><h5>下班时间：</h5><span>{{chargeSum.timeN}}</span></section>
                    </div>
                </el-col>
                <el-table :data="array" :header-cell-style="{'text-align':'center'}" highlight-current-row style="width: 100%;" border>
                    <el-table-column prop="cname" label="支付方式"  min-width="100" >
                    </el-table-column>
                    <el-table-column prop="howLong" label="应收"  min-width="100" >
                    </el-table-column>
                    <el-table-column prop="howLong" label="实收"  min-width="100" >
                    </el-table-column>
                    <el-table-column prop="howLong" label="电子优惠"  min-width="100" >
                    </el-table-column>
                    <el-table-column prop="howLong" label="纸质优惠"  min-width="100" >
                    </el-table-column>
                    <el-table-column prop="howLong" label="其他优惠"  min-width="100" >
                    </el-table-column>
                </el-table>
            </el-row>
        </el-dialog> 

    </section>
</template>
<!--<script src="@/assets/js/financialAffairs/IncomeStatistics/carAndMoneySum.js"></script>-->
<script>

    import {getFlowAmount,exportFlowAmount} from '@/api/api'

    export default {
        data(){
            return {
                // 查询信息
                filters: {
                    condition: 0,
                    what:'',
                    startTime:new Date(new Date(new Date().toLocaleDateString()).getTime()),
                    endTime:new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1),
                    carType:0,
                    payWay:0,
                    userType:0,
                    charge:0
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
                chargeSum:{
                    Pack:'',
                    name:'',
                    timeY:'',
                    timeN:'',
                },
                // 列表信息
                array: [],
                currentPage:1,
                total: 0,
                pageSize: 10,
                listLoading: false,
                sels: [],//列表选中列

                sumFormVisible: false,//汇总界面是否显示
            }
        },
        mounted(){
            this.getFlowAmount();
        },
        methods:{
            // 导出excel文件
            exportFlowAmount() {
                let params={
                    operatorId:this.Util.userInfo.id,
                    startTime :this.Util.formatDate.format(this.filters.startTime, 'yyyy-MM-dd hh:mm:ss'),
                    endTime : this.Util.formatDate.format(this.filters.endTime, 'yyyy-MM-dd hh:mm:ss')
                }
                 console.log(params)
                this.$axios({
                    url:exportFlowAmount,
                    method: 'get',
                    params: params,
                    responseType: 'blob', //二进制流
                })
                    .then( (res) => {
                        // this.listLoading = false
                        console.log(res)
                        if (res.headers.code === 'SUCCESS') {
                            this.Util.exportExcel(res)
                        }else{
                            this.$message.error(decodeURI(res.headers.msg))
                        }
                    })
            },
            formatType: function (row, column) {
                return row.type == 0? '地面月卡' : row.type == 1 ? '内部人员' :row.type == 2 ? '地库月卡' :row.type == 3 ? 'vip会员':'未知';
            },
            //size-change和current-change事件来处理页码大小和当前页变动时候触发的事件。
            handleSizeChange(val) {
                this.pageSize =  val ;
                this.getFlowAmount();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getFlowAmount();
            },
            // 打印
            Print(){
                // bdhtml=window.document.body.innerHTML;
                // sprnstr="<!--startprint-->";
                // eprnstr="<!--endprint-->";
                // prnhtml=bdhtml.substr(bdhtml.indexOf(sprnstr)+17);
                // prnhtml=prnhtml.substring(0,prnhtml.indexOf(eprnstr));
                // window.document.body.innerHTML=prnhtml;
                // window.print();
            },
            //查询
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
                        this.getFlowAmount()
                    }else if(startTime.getTime()===endTime.getTime()){
                        this.getFlowAmount()
                    }else{
                        this.$message({
                            message: '开始时间大于结束时间',
                            type: 'warning'
                        });
                    }
                }
            },
            //获取列表
            getFlowAmount() {
                let params={
                    operatorId:this.Util.userInfo.id,
                    startTime :this.Util.formatDate.format(this.filters.startTime, 'yyyy-MM-dd hh:mm:ss'),
                    endTime : this.Util.formatDate.format(this.filters.endTime, 'yyyy-MM-dd hh:mm:ss')
                }
                // console.log(para)
                getFlowAmount(params).then( res => {
                    console.log(res.data.data)
                    this.array=res.data.data;
                    // this.total=res.totalNum;
                }).catch(err=>{
                    console.log(err)
                })
            },

            // 查看汇总
            lookSum(index,row){
                // console.log(index);
                this.sumFormVisible = true;
                this.chargeSum.Pack=row.Pack
                this.chargeSum.name=row.name
                this.chargeSum.timeY=row.timeY
                this.chargeSum.timeN=row.timeN
                // this.$router.push(type)
            },
            // 查看明细
            lookStn(index,row){
                // console.log(index)
                this.$router.push({
                    path:'/ClassChargeSta',
                    query:row
                });
            },
            // 自定义序号
            indexMethod(index){
                return index +this.pageSize*(this.currentPage-1);
            },

        }
    }
</script>
<style lang="scss">
    #charge{
        width: inherit;
        .toolbar{
            .selControl{
                width: 10%;
            }
            .selQuery{
                width: 20%;
                .el-select{
                    width: 40%;
                    .el-input{
                        width: 100%;
                    }
                }
                .el-input{
                    width: 58%;
                }
            }
        }
        .InfoTop{
            margin-left: 0;
            text-align: center;
            section{
                display: inline-block;
                font-size: 18px;
                padding: 5px 10px;
                h5{
                    display: inline-block;
                    font-size: 16px;
                    margin: 0;
                }
            }
        }
    }
</style>
