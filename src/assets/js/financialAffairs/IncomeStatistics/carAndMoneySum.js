
import {getFlowAmount} from '@/api/api'

export default {
    data(){
        return {
            // 查询信息
            filters: {
                condition: 0,
                what:'',
                chargeTime:'',
                carType:0,
                payWay:0,
                userType:0,
                charge:0
            },
            chargeSum:{
                Pack:'',
                name:'',
                timeY:'',
                timeN:'',
            },
            // 列表信息
            array: [],
            currentPage:1,
            total: 0,
            pageSize: 10,
            listLoading: false,
            sels: [],//列表选中列
            
            sumFormVisible: false,//汇总界面是否显示
        }
    },
    mounted(){
        this.getFlowAmount();
    },
    methods:{
        // 导出excel文件
        exportExcel(){
            require.ensure([], () => {
                const { export_json_to_excel } = require('@/assets/js/excel/Export2Excel')
                const tHeader = ['收费人','现金支付(元)','支付宝支付(元)','微信支付(元)','银联支付(元)','无需支付(元)','优惠券支付(元)','小猫支付(元)','电子优惠(元)','纸质优惠(元)','其他优惠(元)']
                const filterVal = ['chargeMan','cashPay','aliPay','weChatPay','unionPay','noNeedPay','couponPay','smallPay','electronicFree','paperFree','otherFree']
                const list = this.Util.deepCopy(this.array)
                const data = this.Util.formatJson(filterVal, list)
                let excelFileName = '车流量金额汇总表'
                export_json_to_excel(tHeader, data, excelFileName)

            })
        },
        formatType: function (row, column) {
            return row.type == 0? '地面月卡' : row.type == 1 ? '内部人员' :row.type == 2 ? '地库月卡' :row.type == 3 ? 'vip会员':'未知';
        },
        //size-change和current-change事件来处理页码大小和当前页变动时候触发的事件。
        handleSizeChange(val) {
            this.pageSize =  val ;
            this.getFlowAmount();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getFlowAmount();
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
        getFlowAmount() {
            let params={
                operatorId:this.Util.userInfo.id,
            }
            let chargeTime = this.filters.chargeTime;
            if(chargeTime) {
                params.startTime = this.Util.formatDate.format(chargeTime[0], 'yyyy-MM-dd hh:mm:ss')
                params.endTime = this.Util.formatDate.format(chargeTime[1], 'yyyy-MM-dd hh:mm:ss')
            }

            // console.log(para)
            getFlowAmount(params).then( res => {
                console.log(res.data.data)
                this.array=res.data.data;
                // this.total=res.totalNum;
              }).catch(err=>{
                  console.log(err)
              })              
        },

        // 查看汇总
        lookSum(index,row){
            // console.log(index);
            this.sumFormVisible = true;
            this.chargeSum.Pack=row.Pack
            this.chargeSum.name=row.name
            this.chargeSum.timeY=row.timeY
            this.chargeSum.timeN=row.timeN
            // this.$router.push(type)
        },
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