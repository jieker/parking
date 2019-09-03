<template>
   <section id="charge">
        <div class="FA-warpper">
            <!--工具条-->
            <el-col :span="24" class="FA-toolbar " >
                <el-form :inline="true" :model="filters">
                    <el-form-item class="chargeTime" >
                        <span>开始时间：</span>
                        <el-date-picker type="date"  v-model="filters.startTime" placeholder="请输入查询时间" :picker-options="pickerOptionsStart"></el-date-picker>
                        <span>结束时间：</span>
                        <el-date-picker type="date"  v-model="filters.endTime" placeholder="请输入查询时间" :picker-options="pickerOptionsEnd"></el-date-picker>
                         <el-button type="primary" @click="find()">查询</el-button>
                    </el-form-item>
                    <el-form-item >
                        <!--<el-input type="text" ></el-input>-->
                        <el-button type="primary" @click="whitelistExcelExport()">导出</el-button>
                        <!--<el-button type="primary" @click="Print">打印</el-button>-->
                    </el-form-item>
                </el-form>
            </el-col>
            <!--列表-->
            <el-table :data="array" highlight-current-row :header-cell-style="{'text-align':'center'}" v-loading="listLoading" style="width: 100%;">
                <el-table-column
                        v-for="col in cols"
                        :prop="col.prop"
                        :label="col.label"
                        align="center"
                >
                </el-table-column>
                <el-table-column  label="操作"  min-width="120" align="center">
                    <template slot-scope="scope">
                        <!--<a href="javascript:;" style="text-decoration:none" @click="lookStn(scope.$index,scope.row)">查看明细</a>-->
                        <template v-if="!scope.row.isTotal">
                            <a  href="javascript:;" style="text-decoration:none" @click="ChargeStaProp.visible = true,checkDetail(scope.row)">查看明细</a>
                            <a href="javascript:;" style="margin-left:10px;text-decoration:none" @click="getShiftChargeCount(scope.$index,scope.row)">查看汇总</a>
                        </template>
                    </template>
                </el-table-column>
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

       <!-- 个人班次收费明细 -->
       <Class-Charge-Sta :charge-sta-prop="ChargeStaProp" :PostData="PostData" :selectInpput="filters.chargeTime"></Class-Charge-Sta>

        <!--班次收费汇总  -->
        <el-dialog  title="班次收费汇总" :visible.sync="sumFormVisible">
            <el-row>
                <el-col :span="24" class="InfoTop">
                    <div>
                        <section>
                            <h5>收费处：</h5>
                            <span>
                                {{payAddress}}
                            </span>
                        </section>
                        <section><h5>收费人：</h5><span>{{chargeMan}}</span></section>
                        <section><h5>{{chargeSum.timeY}}</h5><span>班次明细</span></section>
                    </div>
                    <div>
                        <section><h5>值班时间：</h5><span>{{this.personalSummary.loginTime}}至{{this.personalSummary.logoutTime}}</span></section>
                    </div>
                </el-col>
                <el-table :data="ChargeCount" :header-cell-style="{'text-align':'center'}" highlight-current-row style="width: 100%;" border>
                    <el-table-column prop="payType" label="支付方式"  min-width="100" align="center">
                    </el-table-column>
                    <el-table-column prop="sumTotalPay" label="应收(元)"  min-width="100" align="center">
                    </el-table-column>
                    <el-table-column prop="sumDiscountedPay" label="实收(元)"  min-width="100" align="center">
                    </el-table-column>
                    <el-table-column prop="sumElectronicFree" label="电子优惠(元)"  min-width="100" align="center">
                    </el-table-column>
                    <el-table-column prop="sumPaperFree" label="纸质优惠(元)"  min-width="100" align="center">
                    </el-table-column>
                    <el-table-column prop="sumOtherFree" label="其他优惠(元)"  min-width="100" align="center">
                    </el-table-column>
                </el-table>
            </el-row>
        </el-dialog> 

    </section>
</template>

<script>

    import {getShiftCharge,getShiftChargeCount,exportShiftCharge} from '@/api/api'

    import ClassChargeSta from '@/views/financialAffairs/IncomeStatistics/ClassChargeSta.vue'

    export default {
        components: {
            'ClassChargeSta': ClassChargeSta,
        },
        data(){
            return {
                ChargeStaProp: {
                    visible:false
                },
                // 查询信息
                filters: {
                    condition: 0,
                    what:'',
                    startTime:new Date(),
                    endTime:new Date(),
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
                cols:[],
                currentPage:1,
                total: 0,
                pageSize: 10,
                listLoading: false,
                sels: [],//列表选中列

                sumFormVisible: false,//汇总界面是否显示
                PostData:{},
                ChargeCount: [],　// 个人各项收费数据
                payAddress: '',  //收费处
                chargeMan: '', //收费人
                personalSummary:''
            }
        },
        mounted(){
            this.getShiftCharge();
        },
        methods:{
            whitelistExcelExport(){
                let para={
                    operatorId:this.Util.userInfo.id,
                }
                let startTime = this.filters.startTime;
                let endTime = this.filters.endTime;
                para.startTime = this.Util.formatDate.format(startTime,'yyyy-MM-dd');
                para.endTime = this.Util.formatDate.format(endTime,'yyyy-MM-dd');

                // if(this.searchType === '车牌号'){
                //     param.carNum = this.searchValue
                //
                // }else if( this.searchType === '管理员'){
                //     param.operatorName = this.searchValue
                // }else if( this.searchType === '备注'){
                //     param.remark = this.searchValue
                // }
                // this.listLoading = true
                // // console.log(param);
                // whitelistExcelExport(param,{responseType: 'blob'})


                this.$axios({
                    url:exportShiftCharge,
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
            checkDetail(data) {
                this.PostData = data
                // console.log(typeof(this.PostData))
            },

            formatType: function (row, column) {
                return row.type == 0? '地面月卡' : row.type == 1 ? '内部人员' :row.type == 2 ? '地库月卡' :row.type == 3 ? 'vip会员':'未知';
            },
            //size-change和current-change事件来处理页码大小和当前页变动时候触发的事件。
            handleSizeChange(val) {
                this.pageSize =  val ;
                this.getShiftCharge();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getShiftCharge();
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
                        this.getShiftCharge()
                    }else if(startTime.getTime()===endTime.getTime()){
                        this.getShiftCharge()
                    }else{
                        this.$message({
                            message: '开始时间大于结束时间',
                            type: 'warning'
                        });
                    }
                }
            },
            //获取列表
            getShiftCharge(isAgm) {
                let para={
                    operatorId:this.Util.userInfo.id,
                }
                let startTime = this.filters.startTime;
                let endTime = this.filters.endTime;
                para.startTime = this.Util.formatDate.format(startTime,'yyyy-MM-dd')
                para.endTime = this.Util.formatDate.format(endTime,'yyyy-MM-dd')
                if(isAgm){
                    para.current=0
                }else{
                    para.current=this.currentPage-1
                }
                para.length=this.pageSize
                // console.log(para)
                getShiftCharge(para).then( res => {
                    // console.log(res)
                    this.cols = res.data.data.cols;
                    this.array=res.data.data.tableData;
                    this.total=res.data.data.totalElements;
                }).catch(err=>{
                    console.log(err)
                })
            },

            //获取个人各项收费汇总列表
            getShiftChargeCount(index,row,isAgm) {
                this.payAddress = row.payAddress;
                this.chargeMan = row.chargeMan;
                this.personalSummary = row;
                this.sumFormVisible = true;
                let para={
                    operatorId:this.Util.userInfo.id,
                    payAddress: row.payAddress,
                    chargeManId: row.chargeManId,
                    chargeMan: row.chargeMan,
                    startTime: row.loginTime,
                    endTime:row.logoutTime
                }
                if(isAgm){
                    para.current=0
                }else{
                    para.current=this.currentPage-1
                }
                para.length=this.pageSize
                // console.log(para)
                getShiftChargeCount(para).then( res => {
                    // // console.log(res)
                    this.ChargeCount=res.data.data;
                    // this.total=res.data.data.totalElements;
                }).catch(err=>{
                    console.log(err)
                })
            },

            // 查看汇总
            // lookSum(index,row){
            //     console.log(row);
            //     this.sumFormVisible = true;
            //     // this.chargeSum.Pack=row.Pack
            //     // this.chargeSum.name=row.name
            //     // this.chargeSum.timeY=row.timeY
            //     // this.chargeSum.timeN=row.timeN
            //     // this.$router.push(type)
            // },
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
