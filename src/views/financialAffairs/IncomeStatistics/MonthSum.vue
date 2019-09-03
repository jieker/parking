<template>
    <el-row id="monthSum">
        <el-col :span="16" class="leftData">
            <div class="FA-warpper">
                <el-form :model="SumTop"  label-width="100px" ref="renewForm" class="clear sumTop">
                    <el-form-item label="统计月份">
                        <el-date-picker
                                v-model="yearMonth"
                                type="month"
                                placeholder="选择月">
                        </el-date-picker>
                        <el-select v-model="SumTop.sumState" placeholder="请选择续费单位" @change="getTableList()">
                            <el-option label="按金额统计" :value="0"></el-option>
                            <el-option label="按支付笔数统计" :value="1"></el-option>
                        </el-select>
                        <el-button type="primary" @click="getTableList()" >查询</el-button>
                        <!-- <el-button type="primary" @click.native="find" >导入</el-button> -->
                        <el-button type="primary" @click.native="exportChardeDataMonth()" >导出</el-button>
                    </el-form-item>
                </el-form>
                <el-table :data="array" :header-cell-style="{'text-align':'center'}" v-if="this.SumTop.sumState=='0'" show-summary highlight-current-row v-loading="listLoading"  style="width: 100%;margin-bottom:10px;">
                    <el-table-column prop="dateStr" label="日期" width="55" align='center'>
                    </el-table-column> 
                    <el-table-column prop="electronicFree" label="电子优惠(元)" align='center' >
                    </el-table-column> 
                    <el-table-column prop="paperFree" label="纸质优惠(元)" align='center' >
                    </el-table-column> 
                    <el-table-column prop="otherFree" label="其他优惠(元)" align='center' >
                    </el-table-column> 
                    <el-table-column prop="cashPay" label="现金支付(元)" align='center' >
                    </el-table-column> 
                    <el-table-column prop="weChatPay" label="微信支付(元)" align='center' >
                    </el-table-column>
                    <el-table-column prop="aliPay" label="支付(元)" align='center' >
                    </el-table-column>
                    <el-table-column prop="aliPay" label="支付宝支付(元)" align='center'>
                    </el-table-column>
                    <el-table-column prop="smallPay" label="小猫支付(元)" align='center' >
                    </el-table-column>
                    <el-table-column prop="otherPay" label="其他支付(元)" align='center' >
                    </el-table-column>
                    <el-table-column prop="sumDiscountedPay" label="实收(元)" align='center' >
                    </el-table-column> 
                    <el-table-column prop="sumTotalPay" label="应收(元)" align='center' >
                    </el-table-column> 
                </el-table>
                <el-table :data="arrayNums" :header-cell-style="{'text-align':'center'}" v-else show-summary highlight-current-row v-loading="listLoading"  style="width: 100%;margin-bottom:10px;">
                    <el-table-column prop="dateStr" label="日期" width="55">
                    </el-table-column>
                    <el-table-column prop="noNeedPayNum" label="无需支付(笔)" align='center'>
                    </el-table-column>
                    <el-table-column prop="cashPayNum" label="现金支付(笔)" align='center'>
                    </el-table-column>
                    <el-table-column prop="weChatPayNum" label="微信支付(笔)" align='center'>
                    </el-table-column>
                    <el-table-column prop="smallPayNum" label="小猫支付(笔)" align='center'>
                    </el-table-column>
                    <el-table-column prop="otherPayNum" label="其他支付(笔)" align='center'>
                    </el-table-column>
                    <el-table-column prop="totalNum" label="总数(笔)" align='center'>
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
        </el-col>
        <el-col :span="8">
            <!--<div id="monthSumLine" class="chart" ></div>-->
            <!-- <div id="monthSumPie" class="chart" ></div> -->
        </el-col>
    </el-row>
</template>
<!--<script src="@/assets/js/financialAffairs/IncomeStatistics/monthSum.js"></script>-->

<script>

    // 引入基本模板
    let echarts = require('echarts/lib/echarts');

    import { getChargeCountMonth,exportChardeDataMonth } from '@/api/api';

    export default {
        data(){
            return{
                yearMonth: new Date(),
                SumTop:{
                    month:1,
                    year:2018,
                    sumState:0
                },
                aliPayArr:[],
                cashPayArr:[],
                otherPayAr:[],
                pieMoneyArr:[],
                dayArr:[],
                pieTypeArr:[],
                smallPayArr:[],
                unionPayArr:[],
                weChatPayArr:[],
                yearMonthData:'',
                dateStr: [],
                totalMoney: [],

                // 列表信息
                array: [],
                arrayNums:[],
                currentPage:1,
                total: 0,
                pageSize:10,
                listLoading: false,

            }
        },
        mounted(){
            this.getTableList()
            // this.drawLine()
            // this.charMonthPay()
        },
        methods:{
            // 导出excel文件
            exportChardeDataMonth(){
                let para = {
                    operatorId:this.Util.userInfo.id,
                    date:this.yearMonth,
                    option:this.SumTop.sumState
                }
                let yearMonth = this.yearMonth;
                this.yearMonthData = this.Util.formatDate.format(yearMonth,'yyyy-MM')
                para.date = this.Util.formatDate.format(yearMonth,'yyyy-MM')
                this.$axios({
                    url:exportChardeDataMonth,
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
            handleSizeChange(val) {
                this.page =  val -1;
                // this.getTDevCompany();
            },
            handleCurrentChange(val) {
                this.currentPage1 = val;
                this.page =  val -1;
                // this.getTDevCompany();
            },

            find(){},
            getTableList(){
                let para = {
                    operatorId:this.Util.userInfo.id,
                    date:this.yearMonth,
                    option:this.SumTop.sumState
                }
                let yearMonth = this.yearMonth;
                this.yearMonthData = this.Util.formatDate.format(yearMonth,'yyyy-MM')
                para.date = this.Util.formatDate.format(yearMonth,'yyyy-MM')
                getChargeCountMonth(para).then(res=>{
                    // this.total=res.totalNum;
                    this.array=res.data.data.countByMoneys;
                    this.arrayNums=res.data.data.countByPayNums;
                    this.aliPayArr=res.data.data.aliPayArr;
                    this.cashPayArr=res.data.data.cashPayArr;
                    this.otherPayArr=res.data.data.otherPayArr;
                    this.pieMoneyArr=res.data.data.pieMoneyArr;
                    this.dayArr=res.data.data.dayArr;
                    this.pieTypeArr=res.data.data.pieTypeArr;
                    this.smallPayArr=res.data.data.smallPayArr;
                    this.unionPayArr=res.data.data.unionPayArr;
                    this.weChatPayArr=res.data.data.weChatPayArr;
                    if(this.array){
                        this.array.forEach(e => {
                            this.dateStr.push(e.dateStr)
                        });
                    }
                    this.drawLine();  // 折线图
                    // this.charMonthPay()　　//饼状图
                    // console.log(res)
                }).catch(err=>{
                    console.log(err)
                })
            },
            // 月支付方式线性收入统计
            drawLine(){
                let chartRainfall = echarts.init(document.getElementById('monthSumLine'))
                var colors = ['#C33531','#EFE42A','#64BD3D','#EE9201','#29AAE3', '#B74AE5','#0AAF9F'];
                let option = {
                    color: colors,
                    title:{
                        text:this.yearMonthData.substring(0,4)+'年'+this.yearMonthData.substring(5,7)+'月收入统计图',
                        left:'center'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        }
                    },
                    // toolbox: {
                    //     feature: {
                    //         saveAsImage: {}
                    //     }
                    // },
                    legend: {
                        data:this.pieTypeArr,
                        // data:['微信支付', '小猫支付','现金支付','银联支付','支付宝支付','其他支付','现金支付'],
                        bottom:40
                    },
                    grid: {
                        top: 70,
                        bottom: 100,
                        containLabel: true

                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.dayArr
                    },
                    yAxis: {
                        type: 'value',
                        name: '月收入',
                        min: 0,
                        max: 1000,
                        axisLabel: {
                            formatter: '{value} 元'
                        }

                    },
                    series: [
                        {
                            name:'微信支付',
                            type:'line',
                            smooth: true,
                            data: this.weChatPayArr
                        },
                        {
                            name:'小猫支付',
                            type:'line',
                            smooth: true,
                            data: this.smallPayArr
                        },
                        {
                            name:'现金支付',
                            type:'line',
                            smooth: true,
                            data :this.cashPayArr
                            // data: [39, 59, 111, 187, 4.3, 50, 21.6, 6.6, 5.4, 8.4, 180, 10.7]
                        },
                        {
                            name:'银联支付',
                            type:'line',
                            smooth: true,
                            data: this.unionPayArr
                        },
                        {
                            name:'支付宝支付',
                            type:'line',
                            smooth: true,
                            data: this.aliPayArr
                        },
                        {
                            name:'其他支付',
                            type:'line',
                            smooth: true,
                            data: this.otherPayArr
                        }
                    ]
                };
                chartRainfall.setOption(option);

            },
            // 月支付方式饼图收入统计
            charMonthPay(){
                let cWidth=document.getElementById('monthSumPie');
                let MonthPay = echarts.init(cWidth)
                let option={
                    title: {
                        text: this.yearMonthData.substring(0,4)+'年'+this.yearMonthData.substring(5,7)+'月收入统计图',
                        left: 'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{b} : {c}元 ({d}%)"
                    },
                    legend: {
                        // orient: 'vertical',
                        // top: 'middle',
                        bottom: 10,
                        left: 'center',
                        data:['微信支付', '小猫支付','现金支付','电子优惠','纸质优惠'],
                    },
                    series : [
                        {
                            type: 'pie',
                            radius : '65%',
                            center: ['50%', '50%'],
                            // selectedMode: 'single',
                            // data:[123,345,345,654,456],
                            data:[
                                {value:1548,name: '微信支付'},
                                {value:535, name: '小猫支付'},
                                {value:510, name: '现金支付'},
                                {value:634, name: '纸质优惠'},
                                {value:735, name: '电子优惠'}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                }
                MonthPay.setOption(option);

            },

        }
    }
</script>

<style lang="scss">
    #monthSum{
        width:100%;
        .leftData{
            padding:20px;
            .sumTop{
                .el-select{
                    width: 20%;
                }
            }
        }
        .chart{
            width: 100%;
            height: 400px;
        }
    }
</style>
