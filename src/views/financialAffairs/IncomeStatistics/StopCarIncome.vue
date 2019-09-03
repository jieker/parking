<template>
   <section id="SCIncome">
        <div class="FA-warpper">
            <!--工具条-->
            <el-col :span="24" class="FA-toolbar " >
                <el-form :inline="true" :model="filters">
                    <el-form-item class="selQuery">
                        <el-select v-model="filters.condition" placeholder="选择查询条件" clearable>
                            <el-option label="车牌号" value="carNum"></el-option>
                            <el-option label="订单号" value="orderId"></el-option>
                            <el-option label="收费人" value="chargeMan"></el-option>
                        </el-select>
                        <el-input v-model="filters.what" placeholder="请输入查询关键字" clearable></el-input>
                    </el-form-item>
                    <el-form-item class="chargeTime">
                        <span>开始时间：</span>
                        <el-date-picker type="datetime"  v-model="filters.startTime" :picker-options="pickerOptionsStart"></el-date-picker>
                        <span>结束时间：</span>
                        <el-date-picker type="datetime"  v-model="filters.endTime" :picker-options="pickerOptionsEnd"></el-date-picker>
                        <el-button type="primary" @click="find" style="margin-left:10px">查询</el-button>
                    </el-form-item>
                    <el-form-item class="selControl">
                        <el-select v-model="filters.carType" placeholder="选择查询条件" @change="getIncomeDetail()" clearable>
                            <el-option label="全部车型" value=""></el-option>
                            <el-option v-for="item in carTypeList" :key="item.mark" :label="item.typeName" :value="item.mark"></el-option>
                            <!--<el-option label="小型车" value="small"></el-option>-->
                            <!--<el-option label="大型车" value="large"></el-option>-->
                            <!--<el-option label="超大型车" value="superLarge"></el-option>-->
                        </el-select>
                    </el-form-item> 
                    <el-form-item class="selControl">
                        <el-select v-model="filters.payWay" placeholder="选择查询条件" @change="getIncomeDetail()" clearable>
                            <el-option label="全部支付方式" value=""></el-option>
                            <el-option label="现金支付" value="现金支付"></el-option>
                            <el-option label="微信支付" value="微信支付"></el-option>
                            <el-option label="小猫支付" value="小猫支付"></el-option>
                            <el-option label="无需支付" value="无需支付"></el-option>
                        </el-select>
                    </el-form-item> 
                    <!--<el-form-item class="selControl">-->
                        <!--<el-select v-model="filters.userType" placeholder="选择查询条件" clearable>-->
                            <!--<el-option label="全部用户类型" :value="3"></el-option>-->
                            <!--<el-option label="临时用户" :value="0"></el-option>-->
                            <!--<el-option label="小猫用户" :value="1"></el-option>-->
                            <!--<el-option label="月卡用户" :value="2"></el-option>-->
                        <!--</el-select>-->
                    <!--</el-form-item> -->
                    <el-form-item class="selControl">
                        <el-select v-model="filters.charge" placeholder="选择查询条件" @change="getIncomeDetail()" clearable>
                            <el-option label="全部收费处" value=""></el-option>
                            <el-option label="收费中心" value="收费中心"></el-option>
                            <el-option v-for="item in boxDatas" :label="item.gateName" :value="item.gateName" :key="item.id"></el-option>
                            <!--<el-option label="岗亭2" :value="2"></el-option>-->
                        </el-select>
                    </el-form-item> 
                    <el-form-item >
                        <el-button type="primary" @click="whitelistExcelExport()">导出</el-button>
                        <!-- <el-button type="primary" @click="find">对账单</el-button>
                        <el-button type="primary" @click="exportExcel()">导出</el-button>
                        <el-button type="primary" @click="find">打印</el-button> -->
                        <!--<el-button type="primary" @click="$router.push('/ChartFigure')" >收入统计图</el-button>-->
                        <!-- <el-button type="primary" @click="ChartFormVisible.visible = true" >收入统计图</el-button> -->
                    </el-form-item> 
                </el-form>
                <div class="elCol clearfix">
                    <div class="colTd">
                        <h2>{{gather.sumTotalPay}}</h2>
                        <p>应收总金额（元)</p>
                    </div>
                    <div class="colTd">
                        <h2>{{gather.sumDiscountedPay}}</h2>
                        <p>实收总金额（元)</p>
                    </div>
                    <div class="colTd">
                        <h2>{{gather.sumElectronicFree}}</h2>
                        <p>电子优惠总额（元)</p>
                    </div>
                    <div class="colTd">
                        <h2>{{gather.sumPaperFree}}</h2>
                        <p>纸质优惠总额（元)</p>
                    </div>
                    <div class="colTd">
                        <h2>{{gather.sumOtherFree}}</h2>
                        <p>其他优惠总额（元)</p>
                    </div>
                </div>
            </el-col>
            <!--列表-->
            <el-table :data="array" highlight-current-row :header-cell-style="{'text-align':'center'}" v-loading="listLoading" style="width: 100%;">
                <el-table-column type="index" :index="indexMethod" label="序号" width="55" align="center">
                </el-table-column>
                <el-table-column prop="carNum" label="车牌号" min-width="110" align="center">
                </el-table-column>
                <el-table-column prop="chargeMan" label="收费人" align="center">
                </el-table-column>
                <el-table-column prop="payAddress" label="收费处" align="center">
                </el-table-column>
                <!--<el-table-column prop="userType" label="用户类型"  min-width="80" align="center" :formatter="formatType">-->
                <!--</el-table-column>-->
                <el-table-column prop="carType" label="车辆类型"  min-width="90" align="center" :formatter="formatCarType">
                </el-table-column>
                <el-table-column prop="chargeTime" label="计费时间" min-width="100" align="center"  sortable>
                    <template slot-scope="scope">
                        <span>{{scope.row.chargeTime | transformTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="payTime" label="收费时间"  min-width="100" align="center" sortable>
                    <template slot-scope="scope">
                        <span>{{scope.row.payTime | transformTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="parkLength" label="计费时长"  min-width="100" align="center">
                    <!--<template slot-scope="scope">-->
                        <!--<span>{{scope.row.parkLength | transformTime}}</span>-->
                    <!--</template>-->
                </el-table-column>
                <el-table-column prop="totalPay" label="应收(元)"  min-width="80" align="center">
                </el-table-column>
                <el-table-column prop="discountedPay" label="实收(元)"  min-width="80" align="center">
                </el-table-column>
                <el-table-column prop="electronicFree" label="电子优惠(元)" min-width="100" align="center" >
                </el-table-column>
                <el-table-column prop="paperFree" label="纸质优惠(元)"  min-width="100" align="center">
                </el-table-column>
                <el-table-column prop="otherFree" label="其他优惠(元)"  min-width="100" align="center">
                </el-table-column>
                <el-table-column prop="payType" label="支付方式"  min-width="100" align="center">
                </el-table-column>
                <el-table-column prop="orderId" label="订单号" min-width="130">
                </el-table-column>
                <el-table-column prop="remark" label="备注"  min-width="100" align="center" >
                </el-table-column>
                <el-table-column label="操作" min-width="100" align="center" fixed="right">
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

            <chart-figure :chart-form-visible="ChartFormVisible"></chart-figure>    

            <el-dialog
                title="进出场图片"
                :visible.sync="dialogPhotoVisible"
                 width="80%"
                :close-on-click-modal="false"

                 >
                　<div class="photoDialog">
                    <div class="appearanceImg">
                        <p>进场图片</p>
                        <img :src="this.inImagePath" alt="暂无图片" />
                    </div>
                    <div class="appearanceImg">
                        <p>出场图片</p>
                        <img :src="this.outImagePath" alt="暂无图片" />
                    </div>
                  </div>
            </el-dialog>

        </div>
    </section>
</template>

<script>
    import { mapGetters } from "vuex";
    import notimg from "@/assets/img/notimg.png"
    import {ip,getIncomeDetail,getGateListSimple,exportIncomeDetail} from '@/api/api'
    import ChartFigure from '@/views/financialAffairs/IncomeStatistics/ChartFigure.vue'

    export default {
        components: {
            'ChartFigure': ChartFigure,
        },
        data(){
            return {
                dialogPhotoVisible:false,  //进出场图片
                inImagePath:'',
                outImagePath:'',

                ChartFormVisible: {
                    visible:false
                },　　　　//统计图

                // 查询信息
                filters: {
                    condition: 'carNum',
                    // conditionTime:'valid_time',
                    what:'',
                    startTime:new Date(new Date(new Date().toLocaleDateString()).getTime()),
                    endTime:new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1),
                    // chargeTime:[new Date(new Date(new Date().toLocaleDateString()).getTime()),new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)],
                    carType:'',
                    payWay:'',
                    userType:3,
                    charge:''
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
                boxDatas:[],

                // 列表信息
                array: [],
                gather: '',
                currentPage:1,
                total: 0,
                pageSize: 10,
                listLoading: false,
                sels: [],//列表选中列
            }
        },
        mounted(){
            this.getIncomeDetail();
            this.getGateListSimple();
        },
        computed: {
            ...mapGetters({
                gateList: 'getGateList',
                carTypeList: 'getCarTypeList',
            }),
        },
        methods:{
            // 导出excel文件
            whitelistExcelExport(){
                let condition = this.filters.condition;
                let what = this.filters.what;
                let obj = {};
                obj[condition] = what;
                let params={
                    operatorId:this.Util.userInfo.id,
                    carType:this.filters.carType,
                    payType:this.filters.payWay,
                    payAddress:this.filters.charge,
                    chargeTimeLow :this.Util.formatDate.format(this.filters.startTime, 'yyyy-MM-dd hh:mm:ss'),
                    chargeTimeUpp : this.Util.formatDate.format(this.filters.endTime, 'yyyy-MM-dd hh:mm:ss')
                }
                let para=Object.assign(params,obj)

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
                    url:exportIncomeDetail,
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
            // 获取图片
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
            formatCarType: function (row, column) {
                return row.carType === "small"? '小型车' : row.carType === "large" ? '大型车' :row.carType == "superLarge" ? '超大型车':'特殊车辆';
            },
            //size-change和current-change事件来处理页码大小和当前页变动时候触发的事件。
            handleSizeChange(val) {
                this.pageSize =  val ;
                this.getIncomeDetail();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getIncomeDetail();
            },
            // 自定义序号
            indexMethod(index){
                return index +this.pageSize*(this.currentPage-1)+1;
            },
            // 收入统计图
            inComeChart()　{
                this.inComeChartFormVisible = true;
                // alert(1)
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
            //获取列表
            getIncomeDetail(isAgm) {
                let condition = this.filters.condition;
                let what = this.filters.what;
                let obj = {};
                obj[condition] = what;
                let params={
                    operatorId:this.Util.userInfo.id,
                    carType:this.filters.carType,
                    payType:this.filters.payWay,
                    payAddress:this.filters.charge,
                    chargeTimeLow :this.Util.formatDate.format(this.filters.startTime, 'yyyy-MM-dd hh:mm:ss'),
                    chargeTimeUpp : this.Util.formatDate.format(this.filters.endTime, 'yyyy-MM-dd hh:mm:ss')
                }
                if(isAgm){
                    params.current=0
                }else{
                    params.current=this.currentPage-1
                }
                params.length=this.pageSize
                // console.log(params)
                let para=Object.assign(params,obj)
                // console.log(para)
                getIncomeDetail(para).then( res => {
                    // console.log(res.data.data.totalElements)
                    this.array=res.data.data.content.incomeDetails;
                    this.gather = res.data.data.content;
                    this.total=res.data.data.totalElements;
                }).catch(err=>{
                    console.log(err)
                })
            },
            // 获取该停车场所有岗亭
            getGateListSimple() {
                let params={
                    operatorId:this.Util.userInfo.id,
                }
                getGateListSimple(params).then( res => {
                    this.boxDatas = res.data.data
                    console.log(this.boxDatas)
                }).catch(err=>{
                    console.log(err)
                })
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
                        this.getIncomeDetail()
                    }else if(startTime.getTime()===endTime.getTime()){
                        this.getIncomeDetail()
                    }else{
                        this.$message({
                            message: '开始时间大于结束时间',
                            type: 'warning'
                        });
                    }
                }
            },

        }
    }
</script>

<style lang="scss" scoped>
    #SCIncome{
        width: inherit;
        .FA-warpper{
            .selControl{
                width: 130px;
                margin-right:5px;
                .el-input--suffix .el-input__inner{
                    padding-left: 8px;
                }
            }
            .selQuery{
                width: 21%;
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
            .chargeTime{
                width: 750px;
                margin-top: -5px;
                .el-form-item__content{
                    width: 85%;
                    .el-range-editor.el-input__inner{
                        width: 80%;
                    }
                }
            }
            .photoDialog{
                display:flex;
                .approachImg{
                    width: 50%;
                    height: 700px;
                }
                .appearanceImg{
                    width: 49%;
                    height: 500px;
                    img{
                        width: 99%;
                        /*height: 500px;*/
                    }
                }
            }
        }
        .el-col{
            width: 100%;
            box-sizing: border-box;
            margin-bottom: 15px;
            /*padding-left:4%;*/
            .colTd{
                width: 19%;
                height: 100px;
                text-align: center;
                line-height: 1;
                border: 1px solid #999;
                float: left;
                margin-left: -1px;
                // position: relative;
                // left: -1px;
                h2{
                    padding-top: 15px;
                    font-size: 20px;
                    font-weight: bold;
                }
            }
        }
    }
</style>
