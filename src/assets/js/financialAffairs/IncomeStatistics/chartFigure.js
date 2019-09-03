
 // 引入基本模板
 let echarts = require('echarts/lib/echarts');
export default {
    props: [ 'ChartFormVisible' ],
    data(){
        return {
            // inComeChartFormVisible: false,//费用变更界面是否显示
            msg:'统计图',
            activeName:'first',
            selYear:2018,
            selMonth:1,
            selYearStart:2015,
            selYearEnd:2018
        }
    },
    mounted(){
        // this.charYearPay();
        // this.charMonthPay();
        // this.chartDay();
        // this.chartMonth();

},
    methods:{
        handleClick(tab, event) {
            if(tab.name=='first'){
                this.chartDay();
                this.chartMonth();
            }else if(tab.name=='second'){
                this.charYearPay();
                this.charMonthPay();
            }else if(tab.name=='third'){
                this.proChargeYear();
                this.proChargeMonth();
            }else if(tab.name=='fourth'){
                this.ChargeYear();
                this.ChargeMonth();
            }else {
                this.yearIncome();
            }
        },
        selHandleClick(NAME) {
            if(NAME=='first'){
                this.chartDay();
                this.chartMonth();
            }else if(NAME=='second'){
                this.charYearPay();
                this.charMonthPay();
            }else if(NAME=='third'){
                this.proChargeYear();
                this.proChargeMonth();
            }else if(NAME=='fourth'){
                this.ChargeYear();
                this.ChargeMonth();
            }else {
                this.yearIncome();
            }
        },
        // 当年每月收入统计
        chartMonth(){
            let cWidth=document.getElementById('chartMonth');
            cWidth.style.width=window.innerWidth/2.5+'px';
            let chartDayFg = echarts.init(cWidth)
            let option = {
                // color: colors,
                title: {
                    text: this.selYear+'年每月收入统计',
                    // subtext: '纯属虚构'
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                grid: {
                    right: '20%',
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow',
                            label: {
                                show: true,
                                formatter: function (params) {
                                    return params.value.replace('\n', '');
                                }
                            }
                        }
                    }
                },
                // toolbox: {
                //     feature: {
                //         dataView: {show: true, readOnly: false},
                //         restore: {show: true},
                //         saveAsImage: {show: true}
                //     }
                // },
                xAxis: [
                    {
                        type: 'category',
                        data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '月收入',
                        min: 0,
                        max: 25,
                        axisLabel: {
                            formatter: '{value} 元'
                        }
                    },
                ],
                series: [
                    {
                        name:'月收入',
                        type:'bar',
                        data:[2.0, 4.9, 7.0, 23.2, 5.6, 7.7, 13.6, 16.2, 3.6, 20.0, 6.4, 3.3]
                    },
                ]
            };
            chartDayFg.setOption(option);
            window.addEventListener("resize", function () {
                chartDayFg.resize();
              });
            // window.onresize = chartDayFg.resize

        },
        // 当月每天收入统计
        chartDay(){
            let cWidth=document.getElementById('chartDay');
            cWidth.style.width=window.innerWidth/2.5+'px';

            let chartMonthFg = echarts.init(cWidth)
            let option = {
                // color: colors,
                title: {
                    text: this.selYear+'年'+this.selMonth+'月每日收入统计',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                grid: {
                    right: '20%'
                },
                // toolbox: {
                //     feature: {
                //         dataView: {show: true, readOnly: false},
                //         // restore: {show: true},
                //         saveAsImage: {show: true}
                //     }
                // },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: false
                        },
                        'axisLabel':{'interval':0},
                        data: ['1日','\n2日','3日','\n4日','5日','\n6日','7日','\n8日','9日','\n10日',
                        '11日','\n12日','13日','\n14日','15日','\n16日','17日','\n18日','19日','\n20日',
                        '21日','\n22日','23日','\n24日','25日','\n26日','27日','\n28日','29日','\n30日'],
                        // splitLine: {show: false}
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '日收入',
                        min: 0,
                        max: 25,
                        axisLabel: {
                            formatter: '{value} 元'
                        }
                    },
                ],
                series: [
                    {
                        name:'日收入',
                        type:'bar',
                        data:[2.0, 4.9, 7.0, 23.2, 5.6, 7.7, 13.6, 16.2, 3.6, 20.0, 6.4, 3.3,
                            2.0, 4.9, 7.0, 23.2, 5.6, 7.7, 13.6, 16.2, 3.6, 20.0, 6.4, 3.3,
                            2.0, 4.9, 7.0, 23.2, 5.6, 7.7, ]
                    },
                ]
            };
            chartMonthFg.setOption(option);
            window.addEventListener("resize", function () {
                chartMonthFg.resize();
              });
            window.onresize = chartMonthFg.resize


        },
        // 年支付方式收入统计
        charYearPay(){
            let cWidth=document.getElementById('yearPay');
            cWidth.style.width=window.innerWidth/2.5+'px';

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
        // 月支付方式收入统计
        charMonthPay(){
            let cWidth=document.getElementById('monthPay');
            cWidth.style.width=window.innerWidth/2.5+'px';
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
        // 年岗亭操作员收入统计
        proChargeYear(){
            let cWidth=document.getElementById('proChargeYear');
            cWidth.style.width=window.innerWidth/2.5+'px';
            let proCY = echarts.init(cWidth)
            let option = {
                // color: colors,
                title: {
                    text: this.selYear+'年岗亭操作员收费统计 年总收入:'+this.selYearStart+'元',
                    // subtext: '纯属虚构'
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                grid: {
                    right: '20%',
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow',
                            label: {
                                show: true,
                                formatter: function (params) {
                                    return params.value.replace('\n', '');
                                }
                            }
                        }
                    }
                },
                // toolbox: {
                //     feature: {
                //         dataView: {show: true, readOnly: false},
                //         restore: {show: true},
                //         saveAsImage: {show: true}
                //     }
                // },
                xAxis: [
                    {
                        type: 'category',
                        data: ['岗亭1','岗亭2','岗亭3']
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '年收入',
                        min: 0,
                        max: 25,
                        axisLabel: {
                            formatter: '{value} 元'
                        }
                    },
                ],
                series: [
                    {
                        name:'月收入',
                        type:'bar',
                        data:[2.0, 4.9, 7.0,]
                    },
                ]
            };
            proCY.setOption(option);
        },
        //月岗亭操作员收入统计
        proChargeMonth(){
            let cWidth=document.getElementById('proChargeMonth');
            cWidth.style.width=window.innerWidth/2.5+'px';
            let chartMonthFg = echarts.init(cWidth)
            let option = {
                // color: colors,
                title: {
                    text: this.selYear+'年'+this.selMonth+'月岗亭操作员收费统计 月总收入:'+this.selYearStart+'元',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                grid: {
                    right: '20%'
                },
                // toolbox: {
                //     feature: {
                //         dataView: {show: true, readOnly: false},
                //         // restore: {show: true},
                //         saveAsImage: {show: true}
                //     }
                // },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: false
                        },
                        'axisLabel':{'interval':0},
                        data: ['财务'],
                        // splitLine: {show: false}
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '当月总收入',
                        min: 0,
                        max: 25,
                        axisLabel: {
                            formatter: '{value} 元'
                        }
                    },
                ],
                series: [
                    {
                        name:'月收入',
                        type:'bar',
                        data:[20]
                    },
                ]
            };
            chartMonthFg.setOption(option);
        },
        //收费处年收入统计
        ChargeYear(){
            let cWidth=document.getElementById('ChargeYear');
            cWidth.style.width=window.innerWidth/2.5+'px';
            let proCY = echarts.init(cWidth)
            let option = {
                // color: colors,
                title: {
                    // text: '2018年岗亭收费处收费统计',
                    text: this.selYear+'年岗亭收费处收费统计 年总收入:'+this.selYearStart+'元',

                    // subtext: '纯属虚构'
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                grid: {
                    right: '20%',
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow',
                            label: {
                                show: true,
                                formatter: function (params) {
                                    return params.value.replace('\n', '');
                                }
                            }
                        }
                    }
                },
                // toolbox: {
                //     feature: {
                //         dataView: {show: true, readOnly: false},
                //         restore: {show: true},
                //         saveAsImage: {show: true}
                //     }
                // },
                xAxis: [
                    {
                        type: 'category',
                        data: ['岗亭1','岗亭2','岗亭3']
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '年收入',
                        min: 0,
                        max: 25,
                        axisLabel: {
                            formatter: '{value} 元'
                        }
                    },
                ],
                series: [
                    {
                        name:'月收入',
                        type:'bar',
                        data:[2.0, 4.9, 7.0,]
                    },
                ]
            };
            proCY.setOption(option);
        },
        //收费处年收入统计
        ChargeMonth(){
            let cWidth=document.getElementById('ChargeMonth');
            cWidth.style.width=window.innerWidth/2.5+'px';
            let chartMonthFg = echarts.init(cWidth)
            let option = {
                // color: colors,
                title: {
                    // text: '2018年8月收费处收费统计',
                    text: this.selYear+'年'+this.selMonth+'月岗亭收费处收费统计 月总收入:'+this.selYearStart+'元',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                grid: {
                    right: '20%'
                },
                // toolbox: {
                //     feature: {
                //         dataView: {show: true, readOnly: false},
                //         // restore: {show: true},
                //         saveAsImage: {show: true}
                //     }
                // },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: false
                        },
                        'axisLabel':{'interval':0},
                        data: ['财务'],
                        // splitLine: {show: false}
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '当月总收入',
                        min: 0,
                        max: 25,
                        axisLabel: {
                            formatter: '{value} 元'
                        }
                    },
                ],
                series: [
                    {
                        name:'月收入',
                        type:'bar',
                        data:[20]
                    },
                ]
            };
            chartMonthFg.setOption(option);
        },
        // 历年收入统计
        yearIncome(){
            let cWidth=document.getElementById('Years');
            cWidth.style.width=window.innerWidth/1.5+'px';
            let chartMonthFg = echarts.init(cWidth)
            let option = {
                // color: colors,
                title: {
                    text:this.selYearStart+'年至'+this.selYearEnd+'年收入统计',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                grid: {
                    right: '20%'
                },
                // toolbox: {
                //     feature: {
                //         dataView: {show: true, readOnly: false},
                //         // restore: {show: true},
                //         saveAsImage: {show: true}
                //     }
                // },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: false
                        },
                        'axisLabel':{'interval':0},
                        data: ['2015','2016','2017','2018'],
                        // splitLine: {show: false}
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '年总收入',
                        min: 0,
                        max: 25,
                        axisLabel: {
                            formatter: '{value} 元'
                        }
                    },
                ],
                series: [
                    {
                        name:'年收入',
                        type:'bar',
                        data:[20,15,10,16]
                    },
                ]
            };
            chartMonthFg.setOption(option);
        },

    }
}