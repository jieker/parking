
    import { setVIPHandle } from '@/api/api';
export default {
    data() {
        return {
            filters:{
                what:'',
                condition:'cName',
                whatTime:[
                    new Date(),
                    new Date()+1,
                ]
            },
            CostStn:{
                cname:'',
                Type:'',
                Area:0,
                remark:'',
                timeFW:'',
                money:''
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
        // 优惠类型转换
        formatType: function (row, column) {
            return row.type == 1? '减免金额' : row.type == 2 ? '免费时长' : row.type == 3 ? '金额全免': '未知';
        },
        // 自定义序号
        indexMethod(index){
            return index +this.pageSize*(this.currentPage-1);
        },
        // 新增显示
        addDC(){
            this.DCVisible=true;
            this.CostStn.Area=0;
            this.CostStn.cname='';
            this.CostStn.remark='';
        },
        // 修改显示
        DCEdit(index,row){
            this.DCVisible=true;
            this.CostStn.Area=0;
            this.CostStn.cname=row.cname;
            // this.CostStn.money=row.Type;
            this.CostStn.remark=row.note;

        },
        //删除
        DCDelete: function (index, row) {
            // console.log(index)
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
                }).then(() => {
                // this.listLoading = true;
            });
        },
        // 提交
        DCSubmit() {
            this.$refs.DCForm.validate((valid) => {
                if (valid) {
                    let para=this.CostStn;
                    // console.log(para);
                    this.DCVisible=false
                //     setVIPHandle(para).then(res=>{
                //         // console.log(res)
                //     }).catch(err=>{
                //         console.log(err)
                //     })
                // } else {
                //   console.log('error submit!!');
                //   return false;
                }
              });
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
