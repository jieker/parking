
import {ip,getIncomeDetail,getGateListSimple} from '@/api/api'
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
                chargeTime:'',
                carType:'',
                payWay:'',
                userType:3,
                charge:''
            },
            boxDatas:'',

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
    methods:{
        　// 导出excel文件
        exportExcel(){
            require.ensure([], () => {
                const { export_json_to_excel } = require('@/assets/js/excel/Export2Excel')
                const tHeader = ['订单号', '车牌号', '收费人','收费处','用户类型','车辆类型','进场时间','收费时间','停车时长','应收（元）','实收（元）','电子优惠','纸质优惠','其他优惠','支付方式','备注']
                const filterVal = ['orderId', 'carNum', 'chargeMan','payAddress','userType','carType','inTime','payTime','parkLength','totalPay','discountedPay','electronicFree','paperFree','otherFree','payType','remark']
                const list = this.Util.deepCopy(this.array)
                const data = this.Util.formatJson(filterVal, list)
                let excelFileName = '停车收入明细表'
                export_json_to_excel(tHeader, data, excelFileName)
                        
            })
        },
        // 获取图片
        getPhoto(row){
           this.inImagePath = `http://${ip}/images/`+row.inImagePath;
           this.outImagePath = `http://${ip}/images/`+row.outImagePath;
        },
        // formatType: function (row, column) {
        //     return row.type == 0? '地面月卡' : row.type == 1 ? '内部人员' :row.type == 2 ? '地库月卡' :row.type == 3 ? 'vip会员':'未知';
        // },
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
            let chargeTime = this.filters.chargeTime;
            let obj = {};
            obj[condition] = what;
            let params={
                operatorId:this.Util.userInfo.id,
                carType:this.filters.carType,
                payType:this.filters.payWay,
                payAddress:this.filters.charge
            }
            if(chargeTime){
                params.chargeTimeUpp = this.Util.formatDate.format(chargeTime[0],'yyyy-MM-dd hh:mm:ss')
                params.chargeTimeLow = this.Util.formatDate.format(chargeTime[1],'yyyy-MM-dd hh:mm:ss')
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
                // console.log(this.boxDatas)
            }).catch(err=>{
                console.log(err)
            })
        },
        
        //模糊查询
        find(){
            let condition = this.filters.condition;
            let conditionTime = this.filters.conditionTime;
            let what = this.filters.what;
            let whatTime = this.filters.whatTime;
            let obj = {};
            let arr=[]
            if(condition||conditionTime){
                if(!conditionTime&&condition){
                    obj[condition] = what;
                }else if(conditionTime&&!condition){
                    arr=this.tranTime(whatTime);
                    if(arr){
                        obj[conditionTime] = arr;
                    }else{
                        this.$message({
                            'type':'warning',
                            message:'请选择时间!'
                        })
                    }
                }else{
                    arr=this.tranTime(whatTime);
                    if(arr){
                        obj[conditionTime] = arr;
                    }else{
                        this.$message({
                            'type':'warning',
                            message:'请选择时间!'
                        })
                    }
                    obj[condition] = what;
                }
            }else{
                obj=null;
            }
        },

    }
}