<template>
    <div id="sumCars">
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
            <el-tab-pane label="日车辆统计" name="first" >
                <div class="sel">
                    <span class="sp">统计日期：</span>
                    <el-date-picker
                            v-model="YearMonthDay"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>
                    <span class="sp">进出场状态：</span>
                    <el-select v-model="sentryType" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.sentryType"
                                :label="item.label"
                                :value="item.sentryType">
                        </el-option>
                    </el-select>
                    <el-button type="primary" @click.native="getDayCarCount" >查询</el-button>
                    <el-button type="primary" @click.native="exportChardeDataDay()" >导出</el-button>
                    <el-button type="primary" @click.native="find" >打印</el-button>
                </div>
                <!-- <div class="chars">
                    <div id="chartDayInLine" class="chartCarsDay"></div>
                    <div id="chartDayInPay" class="chartCarsDay" ></div>
                    <div id="chartDayOutLine" class="chartCarsDay"></div>
                    <div id="chartDayOutPay" class="chartCarsDay" ></div>
                </div> -->
                <div class="tableData">
                    <el-table :data="tableData" style="width: 90%" border>
                        <el-table-column
                                v-for="col in cols"
                                :prop="col.prop"
                                :label="col.label"
                                align="center"
                        >
                        </el-table-column>
                    </el-table>

                </div>
            </el-tab-pane>
            <el-tab-pane label="月车辆统计" name="second">
                <div class="sel">
                    <span class="sp">统计日期</span>
                    <el-date-picker
                            v-model="yearMonth"
                            type="month"
                            placeholder="选择月">
                    </el-date-picker>
                    <el-button type="primary" @click.native="getMonthCarCount" >查询</el-button>
                    <el-button type="primary" @click.native="exportChardeDataMonth()" >导出</el-button>
                    <el-button type="primary" @click.native="find" >打印</el-button>
                </div>
                <div class="tableChart">
                    <div class="tableData">
                        <el-table border :data="monthArray" :header-cell-style="{'text-align':'center'}"  highlight-current-row   style="width: 100%;margin-bottom:10px;">
                            <el-table-column prop="date" label="日期" width="200" align="center">
                            </el-table-column>
                            <el-table-column prop="inNum" label="进场车辆统计(辆)" align="center">
                            </el-table-column>
                            <el-table-column prop="outNum" label="出场车辆统计(辆)" align="center">
                            </el-table-column>
                        </el-table>
                    </div>
                    <div id="monthLine"></div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="年车辆统计" name="third">
                <div class="sel">
                    <span class="sp">统计日期</span>
                    <el-date-picker
                            v-model="year"
                            type="year"
                            placeholder="选择年">
                    </el-date-picker>
                    <el-button type="primary" @click.native="getYearCarCount" >查询</el-button>
                    <el-button type="primary" @click="exportChardeDataYear()" >导出</el-button>
                    <el-button type="primary" @click.native="find" >打印</el-button>
                </div>
                <div class="tableChart">
                    <div class="tableData">
                        <el-table border :data="yearArray" :header-cell-style="{'text-align':'center'}"  highlight-current-row   style="width: 100%;margin-bottom:10px;">
                            <el-table-column prop="date" label="日期" width="200" align="center">
                            </el-table-column>
                            <el-table-column prop="inNum" label="进场车辆统计(辆)" align="center">
                            </el-table-column>
                            <el-table-column prop="outNum" label="出场车辆统计(辆)" align="center">
                            </el-table-column>
                        </el-table>
                    </div>
                    <div id="yearLine"></div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
     // 引入基本模板
 let echarts = require('echarts/lib/echarts');
import {dayCarCount,monthCarCount,yearCarCount,exportChardeDataYear,exportChardeDataMonth,exportChardeDataDay} from '@/api/api'
export default {
    data(){
        return {
            tableData: [],
            cols: [],
            YearMonthDay:new Date(),  //日统计列表
            yearMonth:new Date(),     //月统计列表
            year:new Date(),　　　　　　//年统计列表
            options: [{
                sentryType: 'true',
                label: '进场'
            }, {
                sentryType: 'false',
                label: '出场'
            }],
            sentryType: 'true',

            msg:'统计图',
            activeName:'first',
            selYear:2018,
            selMonth:1,
            selDays:1,
            monthArray:[],
            yearArray:[],
            selYearEnd:2018
        }
    },
    mounted(){
        this.getDayCarCount();
        // this.SumDayInPay();
        // this.SumDayInLine();
        // this.SumDayOutLine();
        // this.SumDayOutPay();
    },
    beforeUpdate(){
        try {
            let menuNode = document.getElementsByClassName('menu-active')
            menuNode[0].classList.remove('menu-active')  
        } catch (error) {}         
        document.getElementById("menu-box-7").classList.add("menu-active")
    },
    methods:{
        //导出日统计列表
        exportChardeDataDay() {
            if(this.YearMonthDay===null){
                this.YearMonthDay = new Date()
            }
            let para={
                date:this.Util.formatDate.format(this.YearMonthDay,'yyyy-MM-dd'),
                sumParkIn: this.sentryType
            }
            this.$axios({
                url:exportChardeDataDay,
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
        //获取日车辆统计列表
        getDayCarCount() {
            if(this.YearMonthDay===null){
                this.YearMonthDay = new Date()
            }
            let para={
                date:this.Util.formatDate.format(this.YearMonthDay,'yyyy-MM-dd'),
                sumParkIn: this.sentryType
            }
            // console.log(para)
            dayCarCount(para).then( res => {
                this.tableData = res.data.data.tableData;
                this.cols = res.data.data.cols;
                }).catch(err=>{
                    console.log(err)
                })              
        },
        //导出月统计列表
        exportChardeDataMonth() {
            if(this.yearMonth===null){
                this.yearMonth = new Date()
            }
            let para={
                date:this.Util.formatDate.format(this.yearMonth,'yyyy-MM'),
            }
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
        //获取月车辆统计列表
        getMonthCarCount() {
            if(this.yearMonth===null){
                this.yearMonth = new Date()
            }
            let para={
                date:this.Util.formatDate.format(this.yearMonth,'yyyy-MM'),
            }
            // console.log(para)
            monthCarCount(para).then( res => {
                if(res.data.data===null){
                    this.monthArray = [];
                }else{
                    this.monthArray = res.data.data.carSummarys;
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        //导出年统计列表
        exportChardeDataYear() {
            if(this.year===null){
                this.year = new Date()
            }
            let para={
                date:this.Util.formatDate.format(this.year,'yyyy'),
            }
            this.$axios({
                url:exportChardeDataYear,
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
        //获取年车辆统计列表
        getYearCarCount() {
            if(this.year===null){
                this.year = new Date()
            }
            let para={
                date:this.Util.formatDate.format(this.year,'yyyy'),
            }
            // console.log(para)
            yearCarCount(para).then( res => {
                if(res.data.data===null){
                    this.yearArray = [];
                }else{
                    this.yearArray = res.data.data.carSummarys;
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        handleClick(tab, event) {
            if(tab.name=='first'){
                this.getDayCarCount()
                // this.SumDayInPay();
                // this.SumDayInLine();
                // this.SumDayOutLine();
                // this.SumDayOutPay();
            }else if(tab.name=='second'){
                this.getMonthCarCount()
                // this.SumMonthInOutLine();
            }else if(tab.name=='third'){
                this.getYearCarCount()
                // this.SumYearInOutLine();
            }
        },
        selHandleClick(NAME) {
            if(NAME=='first'){
                this.SumDayInPay();
                this.SumDayInLine();
                this.SumDayOutLine();
                this.SumDayOutPay();
            }else if(NAME=='second'){
                this.SumMonthInOutLine();
            }else if(NAME=='third'){
                this.SumYearInOutLine();
            }
        },
        // 日进场车辆统计
        SumDayInLine(){
            let cWidth=document.getElementById('chartDayInLine');
            cWidth.style.width=window.innerWidth/5+'px';
            let chartRainfall = echarts.init(cWidth)
            var colors = ['#5793f3', '#d14a61', '#675bba'];
            let option = {
                color: colors,
                title:{
                    text:'2018年收入统计图',
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
                    data:['微信支付', '小猫支付','现金支付'],
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
                        data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
                },
                yAxis: {
                        type: 'value',
                        name: '月收入',
                        min: 0,
                        max: 250,
                        axisLabel: {
                            formatter: '{value} 元'
                        }

                    },
                series: [
                    {
                        name:'微信支付',
                        type:'line',
                        // xAxisIndex: 1,
                        smooth: true,
                        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                    },
                    {
                        name:'小猫支付',
                        type:'line',
                        smooth: true,
                        data: [3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7]
                    },
                    {
                        name:'现金支付',
                        type:'line',
                        smooth: true,
                        data: [39, 59, 111, 187, 4.3, 9.2, 21.6, 6.6, 5.4, 8.4, 101.3, 10.7]
                    }
                ]
            };
            chartRainfall.setOption(option);

        },
        SumDayInPay(){
            let cWidth=document.getElementById('chartDayInPay');
            cWidth.style.width=window.innerWidth/5+'px';
            let YearPay = echarts.init(cWidth)
            let option={
                 title: {
                    text: this.selYear+'年支付情况统计 年总收入:'+this.selYearStart+'元',
                    left: 'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    // orient: 'vertical',
                    // top: 'middle',
                    bottom: 10,
                    left: 'center',
                    data: ['西凉', '益州','兖州','荆州','幽州']
                },
                series : [
                    {
                        type: 'pie',
                        radius : '65%',
                        center: ['50%', '50%'],
                        selectedMode: 'single',
                        data:[
                            {value:1548,name: '幽州'},
                            {value:535, name: '荆州'},
                            {value:510, name: '兖州'},
                            {value:634, name: '益州'},
                            {value:735, name: '西凉'}
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
            YearPay.setOption(option);
            // window.addEventListener("resize", function () {
            //     YearPay.resize();
            //   });
            // window.onresize = YearPay.resize

        },
        // 日出场车辆统计
        SumDayOutLine(){
            let cWidth=document.getElementById('chartDayOutLine');
            cWidth.style.width=window.innerWidth/5+'px';
            let chartRainfall = echarts.init(cWidth)
            var colors = ['#5793f3', '#d14a61', '#675bba'];
            let option = {
                color: colors,
                title:{
                    text:'2018年收入统计图',
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
                    data:['微信支付', '小猫支付','现金支付'],
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
                        data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
                },
                yAxis: {
                        type: 'value',
                        name: '月收入',
                        min: 0,
                        max: 250,
                        axisLabel: {
                            formatter: '{value} 元'
                        }

                    },
                series: [
                    {
                        name:'微信支付',
                        type:'line',
                        // xAxisIndex: 1,
                        smooth: true,
                        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                    },
                    {
                        name:'小猫支付',
                        type:'line',
                        smooth: true,
                        data: [3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7]
                    },
                    {
                        name:'现金支付',
                        type:'line',
                        smooth: true,
                        data: [39, 59, 111, 187, 4.3, 9.2, 21.6, 6.6, 5.4, 8.4, 101.3, 10.7]
                    }
                ]
            };
            chartRainfall.setOption(option);

        },
        SumDayOutPay(){
            let cWidth=document.getElementById('chartDayOutPay');
            cWidth.style.width=window.innerWidth/5+'px';
            let MonthPay = echarts.init(cWidth)
            let option={
                 title: {
                    text: this.selYear+'年'+this.selMonth+'月支付情况统计 月总收入:'+this.selYearStart+'元',
                    left: 'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    // orient: 'vertical',
                    // top: 'middle',
                    bottom: 10,
                    left: 'center',
                    data: ['西凉', '益州','兖州','荆州','幽州']
                },
                series : [
                    {
                        type: 'pie',
                        radius : '65%',
                        center: ['50%', '50%'],
                        selectedMode: 'single',
                        data:[
                            {value:1548,name: '幽州'},
                            {value:535, name: '荆州'},
                            {value:510, name: '兖州'},
                            {value:634, name: '益州'},
                            {value:735, name: '西凉'}
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
            window.addEventListener("resize", function () {
                MonthPay.resize();
              });
            window.onresize = MonthPay.resize

        },
        // 月进出场车辆统计
        SumMonthInOutLine(){
            let cWidth=document.getElementById('monthLine');
            cWidth.style.width=window.innerWidth/2.5+'px';
            let chartRainfall = echarts.init(cWidth)
            var colors = ['#5793f3', '#d14a61', '#675bba'];
            let option = {
                color: colors,
                title:{
                    text:'2018年收入统计图',
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
                    data:['微信支付', '小猫支付','现金支付'],
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
                        data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
                },
                yAxis: {
                        type: 'value',
                        name: '月收入',
                        min: 0,
                        max: 250,
                        axisLabel: {
                            formatter: '{value} 元'
                        }

                    },
                series: [
                    {
                        name:'微信支付',
                        type:'line',
                        // xAxisIndex: 1,
                        smooth: true,
                        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                    },
                    {
                        name:'小猫支付',
                        type:'line',
                        smooth: true,
                        data: [3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7]
                    },
                    {
                        name:'现金支付',
                        type:'line',
                        smooth: true,
                        data: [39, 59, 111, 187, 4.3, 9.2, 21.6, 6.6, 5.4, 8.4, 101.3, 10.7]
                    }
                ]
            };
            chartRainfall.setOption(option);
        },
        // 年进出场车辆统计
        SumYearInOutLine(){
            let cWidth=document.getElementById('yearLine');
            cWidth.style.width=window.innerWidth/2.5+'px';
            let chartRainfall = echarts.init(cWidth)
            var colors = ['#5793f3', '#d14a61', '#675bba'];
            let option = {
                color: colors,
                title:{
                    text:'2018年收入统计图',
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
                    data:['微信支付', '小猫支付','现金支付'],
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
                        data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
                },
                yAxis: {
                        type: 'value',
                        name: '月收入',
                        min: 0,
                        max: 250,
                        axisLabel: {
                            formatter: '{value} 元'
                        }

                    },
                series: [
                    {
                        name:'微信支付',
                        type:'line',
                        // xAxisIndex: 1,
                        smooth: true,
                        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                    },
                    {
                        name:'小猫支付',
                        type:'line',
                        smooth: true,
                        data: [3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7]
                    },
                    {
                        name:'现金支付',
                        type:'line',
                        smooth: true,
                        data: [39, 59, 111, 187, 4.3, 9.2, 21.6, 6.6, 5.4, 8.4, 101.3, 10.7]
                    }
                ]
            };
            chartRainfall.setOption(option);

        },

    }
}
</script>


<style lang="scss">
    #sumCars{
        background-color: white;
        padding: 20px;
        .chartBar{
            height:500px;
            width: 45%;
            display: inline-block;
        }
        .chartCarsDay{
            height:260px;
            width: 280px;
            display: inline-block;
        }
        .sel{
            padding-top: 30px;
            padding-bottom: 20px;
            padding-left: 20px;
            /*.el-input{*/
                /*width: 10%;*/
                /*.el-input__inner{*/
                    /*width: 160px;*/
                /*}*/
            /*}*/
            .sp{
                padding: 0 10px;
            }
        }
        .tableData {
            margin: 5px;
        }
        .tableChart{
            width: 100%;
            display: flex;
            .tableData{
                margin: 5px;
                width: 45%;
            }
            #monthLine,#yearLine{
                display: inline-block;
                height: 400px;
                width: 48%;
            }
        }
    }
</style>
