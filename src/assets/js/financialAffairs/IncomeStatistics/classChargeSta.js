
import {getShiftDetail} from '@/api/api'

export default {
    // props: [ 'ChargeStaProp','PostData' ],
    props: {
        ChargeStaProp:{
            type: Object,
            default: {

            }
        },
        PostData:{
            type: Object
        },
        selectInpput:[String, Number, Date, Array]
    },
    computed:{
        TOPINFO:function(){
        return this.$route.query;
        }
    },
    data(){
        return {
            totalRevenue: '',
            // 列表信息
            array: [],
            currentPage:1,
            total: 0,
            pageSize: 10,
            listLoading: false,
            sels: [],//列表选中列,
        }
    },
    mounted(){
        // console.log(typeof(this.PostData))
        // console.log(this.PostData)
        // this.getShiftDetail();
    },
    methods:{

        formatType: function (row, column) {
            return row.type == 0? '地面月卡' : row.type == 1 ? '内部人员' :row.type == 2 ? '地库月卡' :row.type == 3 ? 'vip会员':'未知';
        },
        //size-change和current-change事件来处理页码大小和当前页变动时候触发的事件。
        handleSizeChange(val) {
            this.pageSize =  val;
            this.getShiftDetail();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
             this.getShiftDetail();
        },
        // 自定义序号
        indexMethod(index){
            return index +this.pageSize*(this.currentPage-1);
        },
        //获取列表
        getShiftDetail(isAgm) {
             // console.log(typeof(this.PostData))
            let para={
                operatorId:this.Util.userInfo.id,
                date:this.Util.formatDate.format(this.selectInpput,'yyyy-MM-dd'),
                payAddress:this.PostData.payAddress,
                chargeManId: this.PostData.chargeManId,
                chargeMan: this.PostData.chargeMan,

            }
            if(isAgm){
                para.current=0
            }else{
                para.current=this.currentPage-1
            }
            para.length=this.pageSize
            // console.log(para)
            getShiftDetail(para).then( res => {
                // console.log(res.data.data.content)
                this.array=res.data.data.content.shiftChargeDetails;
                this.totalRevenue=res.data.data.content;
                this.total=res.data.data.totalElements;
              }).catch(err=>{
                  console.log(err)
              })              
        },
    }
}