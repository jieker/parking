
 // 引入基本模板
 let echarts = require('echarts/lib/echarts');
import {getVIPInfo} from '@/api/api'
export default {
    data(){
        return {
            msg:'统计图',
            activeName:'first',
            selYear:2018,
            selMonth:1,
            selDays:1,
            array:[],
            selYearEnd:2018
        }
    },
    mounted(){
        this.getTDevCompany();
        this.SumDayInPay();
        this.SumDayInLine();
        this.SumDayOutLine();
        this.SumDayOutPay();
    },
    beforeUpdate(){
        document.getElementById("menu-box-7").classList.add("menu-active")				
    },     
    methods:{
        //获取列表
        getTDevCompany() {
            let para={}
            // console.log(para)
            getVIPInfo(para).then( res => {
                // console.log(res)
                this.array=res.arr;
                this.total=res.totalNum;
                }).catch(err=>{
                    console.log(err)
                })              
        },
        handleClick(tab, event) {
            if(tab.name=='first'){
                this.SumDayInPay();
                this.SumDayInLine();
                this.SumDayOutLine();
                this.SumDayOutPay();
            }else if(tab.name=='second'){
                this.SumMonthInOutLine();
            }else if(tab.name=='third'){
                this.SumYearInOutLine();
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