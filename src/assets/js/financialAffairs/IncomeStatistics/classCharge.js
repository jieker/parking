
import {getShiftCharge,getShiftChargeCount} from '@/api/api'

import ClassChargeSta from '@/views/financialAffairs/IncomeStatistics/ClassChargeSta.vue'

export default {
    components: {
        'ClassChargeSta': ClassChargeSta,
    },
    data(){
        return {
            ChargeStaProp: {
                visible:false
            },
            // 查询信息
            filters: {
                condition: 0,
                what:'',
                chargeTime:new Date(),
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
            PostData:{},
            ChargeCount: [],　// 个人各项收费数据
            payAddress: '',  //收费处
            chargeMan: '', //收费人
        }
    },
    mounted(){
        this.getShiftCharge();
    },
    methods:{

        checkDetail(data) {
            this.PostData = data
            // console.log(typeof(this.PostData))
        },

        formatType: function (row, column) {
            return row.type == 0? '地面月卡' : row.type == 1 ? '内部人员' :row.type == 2 ? '地库月卡' :row.type == 3 ? 'vip会员':'未知';
        },
        //size-change和current-change事件来处理页码大小和当前页变动时候触发的事件。
        handleSizeChange(val) {
            this.pageSize =  val ;
            this.getShiftCharge();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getShiftCharge();
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
        getShiftCharge(isAgm) {
            let para={
                operatorId:this.Util.userInfo.id,
            }
            let chargeTime = this.filters.chargeTime;
            para.date = this.Util.formatDate.format(chargeTime,'yyyy-MM-dd')
            if(isAgm){
                alert(isAgm)
                para.current=0
            }else{
                para.current=this.currentPage-1
            }
            para.length=this.pageSize
            // console.log(para)
            getShiftCharge(para).then( res => {
                // console.log(res)
                this.array=res.data.data.content;
                this.total=res.data.data.totalElements;
              }).catch(err=>{
                  console.log(err)
              })              
        },

        //获取个人各项收费汇总列表
        getShiftChargeCount(index,row,isAgm) {
            this.payAddress = row.payAddress;
            this.chargeMan = row.chargeMan;
            this.sumFormVisible = true;
            let para={
                operatorId:this.Util.userInfo.id,
                payAddress: row.payAddress,
                chargeManId: row.chargeManId,
                chargeMan: row.chargeMan
            }
            let chargeTime = this.filters.chargeTime;
            para.date = this.Util.formatDate.format(chargeTime,'yyyy-MM-dd')
            if(isAgm){
                para.current=0
            }else{
                para.current=this.currentPage-1
            }
            para.length=this.pageSize
            // console.log(para)
            getShiftChargeCount(para).then( res => {
                // // console.log(res)
                this.ChargeCount=res.data.data;
                // this.total=res.data.data.totalElements;
            }).catch(err=>{
                console.log(err)
            })
        },

        // 查看汇总
        // lookSum(index,row){
        //     console.log(row);
        //     this.sumFormVisible = true;
        //     // this.chargeSum.Pack=row.Pack
        //     // this.chargeSum.name=row.name
        //     // this.chargeSum.timeY=row.timeY
        //     // this.chargeSum.timeN=row.timeN
        //     // this.$router.push(type)
        // },
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