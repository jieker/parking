
 // 引入基本模板
 let echarts = require('echarts/lib/echarts');

import { getChargeCountYear } from '@/api/api';

export default {
    data(){
        return{
            year: new Date(),
            SumTop:{
                month:1,
                year:2018,
                sumState:0
            },
            yearData:'',
            // 列表信息
            array: [],
            currentPage:1,
            total: 0,
            pageSize: 10,
            listLoading: false,

        }
    },
    mounted(){
        this.getTableList()
        this.drawLine()
        // this.charMonthPay()
    },
    methods:{
        // 导出excel文件
         exportExcel(){
            require.ensure([], () => {
                const { export_json_to_excel } = require('@/assets/js/excel/Export2Excel')
                const tHeader = ['日期', '电子优惠（元）', '纸质优惠（元）','其他优惠（元）','现金支付（元）','微信支付（元）','小猫支付（元）','实收（元）','应收（元）']
                const filterVal = ['dateStr', 'electronicFree', 'paperFree','otherFree','cashPay','weChatPay','smallPay','sumDiscountedPay','sumTotalPay']
                const list = this.Util.deepCopy(this.array)
                const data = this.Util.formatJson(filterVal, list)
                let excelFileName = '年汇总表'
                export_json_to_excel(tHeader, data, excelFileName)
                        
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
            let year = this.year;
            this.yearData = this.Util.formatDate.format(year,'yyyy')
            para.date = this.Util.formatDate.format(year,'yyyy')
            getChargeCountYear(para).then(res=>{
                // this.total=res.totalNum;
                this.array=res.data.data.countByMoneys;
                this.array=res.data.data.countByMoneys;
                this.aliPayArr=res.data.data.aliPayArr;
                this.cashPayArr=res.data.data.cashPayArr;
                this.otherPayArr=res.data.data.otherPayArr;
                this.pieMoneyArr=res.data.data.pieMoneyArr;
                this.dayArr=res.data.data.dayArr;
                this.pieTypeArr=res.data.data.pieTypeArr;
                this.smallPayArr=res.data.data.smallPayArr;
                this.unionPayArr=res.data.data.unionPayArr;
                this.weChatPayArr=res.data.data.weChatPayArr;
                this.drawLine();  // 折线图
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
                    text:this.yearData+'月收入统计图',
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
                    // min: 0,
                    // max: 1000,
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
                    text: '2018年收入统计图',
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