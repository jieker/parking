
import { setVIPHandle } from '@/api/api';
export default {
    data() {
        return {
            filters:{
                what:'',
                condition:0
            },

            // 列表信息
            array: [],
            currentPage:1,
            total: 0,
            pageSize: 10,
            listLoading: false,
            
        }
    },
    mounted() {
        // 获取table数据
        this.getTableList();
    },
    beforeUpdate(){
        document.getElementById("menu-box-7").classList.add("menu-active")				
    },     
    methods: {
        // 每页数据大小
        handleSizeChange(val) {
            this.pageSize =  val ;
            // this.getTableList();
        },
        // 当前页
        handleCurrentChange(val) {
            this.currentPage = val;
            // this.getTableList();               
        },
        // 业务类型
        formatType: function (row, column) {
            return row.valid == 1? '修改月卡类别' : row.valid == 2 ? '修改月卡信息' : row.valid == 3 ? '修改车牌信息': row.valid == 4 ? '修改月卡起止时间': row.valid == 5 ? '删除月卡': row.valid == 6 ? '修改月卡类型': row.valid == 7 ? '挂起': row.valid == 8 ? '解挂':'未知';
        },
        // 会员类型
        vipType: function (row, column) {
            return row.type == 0? '地面月卡' : row.type == 1 ? '内部人员' :row.type == 2 ? '地库月卡' :row.type == 3 ? 'vip会员':'未知';
        },
        // 自定义序号
        indexMethod(index){
            return index +this.pageSize*(this.currentPage-1);
        },

        //模糊查询
        find(){
            let condition = this.filters.condition;
            let what = this.filters.what;
            let obj = {};
            // let arr=[]
            // if(condition||conditionTime){
            //     if(!conditionTime&&condition){
            //         obj[condition] = what;
            //     }else if(conditionTime&&!condition){
            //         arr=this.tranTime(whatTime);
            //         if(arr){
            //             obj[conditionTime] = arr;
            //         }else{
            //             this.$message({
            //                 'type':'warning',
            //                 message:'请选择时间!'
            //             })
            //         }
            //     }else{
            //         arr=this.tranTime(whatTime);
            //         if(arr){
            //             obj[conditionTime] = arr;
            //         }else{
            //             this.$message({
            //                 'type':'warning',
            //                 message:'请选择时间!'
            //             })
            //         }
            //         obj[condition] = what;
            //     }
            // }else{
            //     obj=null;
            // }
        },
        // 获取table数据
        getTableList(){
            setVIPHandle().then(res=>{
                this.total=res.totalNum;
                this.array=res.arr;
                // console.log(res)
            }).catch(err=>{
                console.log(err)
            })
        },
    },
}
