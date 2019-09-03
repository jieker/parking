<template>
  <!-- 弹窗-收费标准查看 -->
  <el-dialog  title="班次个人收入明细"  width="96%" :visible.sync="ChargeStaProp.visible" @open="getShiftDetail()"  :close-on-click-modal="false">
     <section id="classCSta">
        <el-col :span="24" class="InfoTop">
            <section><h5>收费处：</h5><span>{{this.totalRevenue.payAddress}}</span></section>
            <section><h5>收费人：</h5><span>{{this.totalRevenue.chargeMan}}</span></section>
            <div>
                <section><h5>值班时间：</h5><span>{{this.PostData.loginTime}}至{{this.PostData.logoutTime}}</span></section>
            </div>
            <!--<section><h5>{{TOPINFO.timeY}}</h5><span>班次明细</span></section>-->
            <!--<section><h5>上班时间：</h5><span>{{TOPINFO.timeY}}</span></section>-->
            <!--<section><h5>下班时间：</h5><span>{{TOPINFO.timeN}}</span></section>-->
        </el-col>

        <div class="FA-warpper">
            <!--工具条-->
            <el-col :span="24" class="FA-toolbar " >
                <div class="elCol clearfix">
                    <div class="colTd">
                        <h2>{{this.totalRevenue.sumTotalPay}}</h2>
                        <p>应收总金额（元)</p>
                    </div>
                    <div class="colTd">
                        <h2>{{this.totalRevenue.sumDiscountedPay}}</h2>
                        <p>实收总金额（元)</p>
                    </div>
                    <div class="colTd">
                        <h2>{{this.totalRevenue.sumElectronicFree}}</h2>
                        <p>电子优惠总额（元)</p>
                    </div>
                    <div class="colTd">
                        <h2>{{this.totalRevenue.sumPaperFree}}</h2>
                        <p>纸质优惠总额（元)</p>
                    </div>
                    <div class="colTd">
                        <h2>{{this.totalRevenue.sumOtherFree}}</h2>
                        <p>其他优惠总额（元)</p>
                    </div>
                </div>
            </el-col>
            <!--列表-->
            <el-table :data="array" highlight-current-row :header-cell-style="{'text-align':'center'}" v-loading="listLoading" style="width: 100%;">
                <el-table-column type="index" width="50" :index="indexMethod" label="序号">
                </el-table-column>
                <el-table-column prop="orderId" label="订单号" min-width="120">
                </el-table-column>
                <el-table-column prop="carNum" label="车牌号"  min-width="100"  align="center" >
                </el-table-column>
                <el-table-column prop="userType" label="用户类型"  min-width="100" align="center">
                </el-table-column>
                <el-table-column prop="carType" label="车辆类型"  min-width="100"  align="center" :formatter="formatCarType">
                </el-table-column>
                <el-table-column prop="inTime" label="计费时间" min-width="95"  sortable align="center">
                </el-table-column>
                <el-table-column prop="payTime" label="收费时间"  min-width="95" sortable align="center">
                </el-table-column>
                <el-table-column prop="parkLength" label="计费时长"  min-width="100"  align="center">
                </el-table-column>
                <!--<el-table-column prop="outTime" label="出场时间"  min-width="100" show-overflow-tooltip align="center">-->
                <!--</el-table-column>-->
                <el-table-column prop="totalPay" label="应收(元)"  min-width="80" show-overflow-tooltip align="center">
                </el-table-column>
                <el-table-column prop="discountedPay" label="实收(元)"  min-width="80" align="center">
                </el-table-column>
                <el-table-column prop="electronicFree" label="电子优惠(元)" min-width="100" align="center" >
                </el-table-column>
                <el-table-column prop="paperFree" label="纸质优惠(元)"  min-width="100" align="center">
                </el-table-column>
                <el-table-column prop="otherFree" label="其他优惠(元)"  min-width="100" align="center">
                </el-table-column>
                <el-table-column prop="payType" label="支付方式"  min-width="100"  align="center">
                </el-table-column>
                <el-table-column prop="remark" label="备注"  min-width="100" show-overflow-tooltip align="center">
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
        </div>
    </section>
  </el-dialog>
</template>

<script>

    import {getShiftDetail} from '@/api/api'

    export default {
        // props: [ 'ChargeStaProp','PostData' ],
        props: {
            ChargeStaProp:{
                type: Object,
                default: {

                }
            },
            PostData:{
                type: Object
            },
            selectInpput:[String, Number, Date, Array]
        },
        computed:{
            TOPINFO:function(){
                return this.$route.query;
            }
        },
        data(){
            return {
                totalRevenue: '',
                // 列表信息
                array: [],
                currentPage:1,
                total: 0,
                pageSize: 10,
                listLoading: false,
                sels: [],//列表选中列,
            }
        },
        mounted(){
            // console.log(typeof(this.PostData))
            // console.log(this.PostData)
            // this.getShiftDetail();
        },
        methods:{
            // 车牌字段转换
            formatCarType: function (row, column) {
                return row.carType === "small"? '小型车' : row.carType === "large" ? '大型车' :row.carType == "superLarge" ? '超大型车':'特殊车辆';
            },
            //size-change和current-change事件来处理页码大小和当前页变动时候触发的事件。
            handleSizeChange(val) {
                this.pageSize =  val;
                this.getShiftDetail();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getShiftDetail();
            },
            // 自定义序号
            indexMethod(index){
                return index +this.pageSize*(this.currentPage-1);
            },
            //获取列表
            getShiftDetail(isAgm) {
                // console.log(typeof(this.PostData))
                let para={
                    operatorId:this.Util.userInfo.id,
                    startTime:this.PostData.loginTime,
                    endTime:this.PostData.logoutTime,
                    payAddress:this.PostData.payAddress,
                    chargeManId: this.PostData.chargeManId,
                    chargeMan: this.PostData.chargeMan,

                }
                if(isAgm){
                    para.current=0
                }else{
                    para.current=this.currentPage-1
                }
                para.length=this.pageSize
                // console.log(para)
                getShiftDetail(para).then( res => {
                    // console.log(res.data.data.content)
                    this.array=res.data.data.content.shiftChargeDetails;
                    this.totalRevenue=res.data.data.content;
                    this.total=res.data.data.totalElements;
                }).catch(err=>{
                    console.log(err)
                })
            },
        }
    }
</script>

<style lang="scss">
    #classCSta{
        width: inherit;
        .FA-toolbar{
            margin-bottom: 15px;
            .selControl{
                width: 8%;
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
        .elCol{
            width: 100%;
            padding-left:4%;
            box-sizing: border-box;
            .colTd{
                width: 19%;
                height: 100px;
                text-align: center;
                line-height: 1;
                border: 1px solid #999;
                float: left;
                position: relative;
                margin-left: -1px;
                h2{
                    padding-top: 15px;
                    font-size: 20px;
                    font-weight: bold;
                }
            }
        }
        .InfoTop{
            // margin-left: 0;
            margin: 10px 0;
            text-align: center;
            section{
                display: inline-block;
                font-size: 18px;
                padding: 5px 10px;
                h5{
                    display: inline-block;
                    font-size: 16px;
                    margin: 0

                }
            }

        }

    }
</style>
