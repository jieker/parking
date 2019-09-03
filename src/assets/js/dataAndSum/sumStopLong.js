
 // 引入基本模板
 let echarts = require('echarts/lib/echarts');

import { setVIPHandle } from '@/api/api';

export default {
    data(){
        return{
            filters:{
                statTime:'',
                endTime:'',
                sumState:0
            },

            // 列表信息
            array: [],
            currentPage:1,
            total: 0,
            pageSize:10,
            listLoading: false,

        }
    },
    mounted(){
        this.getTableList()
        this.drawLine()
        this.charMonthPay()
    },
    beforeUpdate(){
        document.getElementById("menu-box-7").classList.add("menu-active")				
    },     
    methods:{
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
            setVIPHandle().then(res=>{
                this.total=res.totalNum;
                this.array=res.arr;
                // console.log(res)
            }).catch(err=>{
                console.log(err)
            })
        },
        // 月支付方式线性收入统计
        drawLine(){
            let chartRainfall = echarts.init(document.getElementById('monthSumLine'))
            var colors = ['#5793f3', '#d14a61', '#675bba'];
            let option = {
                color: colors,
                title:{
                    text:'2018年7月收入统计图',
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
        // 月支付方式饼图收入统计
        charMonthPay(){
            let cWidth=document.getElementById('monthSumPie');
            let MonthPay = echarts.init(cWidth)
            let option={
                 title: {
                    text: '2018年7月收入统计图',
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