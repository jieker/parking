
    import { setVIPHandle } from '@/api/api';
export default {
    data() {
        return {
            filters:{
                what:'',
                condition:0,
                whatTime:[
                    new Date(),
                    new Date()+1,
                ]
            },
            formHandle:{
                carNum:'',
                handleType:'',
                handleUnit:'',
                howLong:'',
                validTime:'',
                payCostWay:'',
                payTime:'',
                remark:'',
                carName:'',
                IDCard:'',
                phoneNum:'',
                conpanyName:''
            },
            DCVisible: false,
            DCLoading: false,

            // 列表信息
            array: [],
            currentPage:1,
            total: 0,
            pageSize: 10,
            listLoading: false,
            
        }
    },
    mounted() {
        this.getTableList();
    },
    methods: {
        handleSizeChange(val) {
            this.page =  val ;
            this.getTableList();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getTableList();               
        },
        formatType: function (row, column) {
            return row.opType == 1? '修改月卡类别' : row.opType == 2 ? '修改月卡信息' : row.opType == 3 ? '修改车牌信息': row.opType == 4 ? '修改月卡起止时间': row.opType == 5 ? '删除月卡': row.opType == 6 ? '修改月卡类型': row.opType == 7 ? '挂起': row.opType == 8 ? '解挂':'未知';
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
        //删除
        handleDelete: function (index, row) {
            // console.log(index)
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
                }).then(() => {
                // this.listLoading = true;
            });
        },
        // 汇总
        summary(){
            this.DCVisible=true;
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
