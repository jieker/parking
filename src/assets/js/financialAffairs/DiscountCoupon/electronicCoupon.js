
import { getElectCouponsList } from '@/api/api';
export default {
    data() {
        return {
            filters:{
                what:'',
                condition:'carNum',
                isEmploy:2
            },
            CostStn:{
                cname:'',
                Type:'',
                Area:'',
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
                // 导出excel文件
        exportExcel(){
            require.ensure([], () => {
                const { export_json_to_excel } = require('@/assets/js/excel/Export2Excel')
                const tHeader = ['车牌号', '商家名称', '优惠券类型','免费时长(h)','免费金额(￥)','创建时间','有效期至','使用时间','挂起时间','使用状态']
                const filterVal = ['carNum', 'merchantName', 'type','value','howLong','createTime','endTime','lockTime','status']
                const list = this.Util.deepCopy(this.array)
        
                for (let i = 0; i < list.length; i++) {
                             
                    //转换卡状态
                    if(list[i].memberStatus === 0){
                        list[i].allowType = '未生效'
                    }else if(list[i].memberStatus === 1){
                                    list[i].allowType = '已生效'
                                }else if(list[i].memberStatus === 2){
                                    list[i].allowType = '已失效'
                                }else if(list[i].memberStatus === 3){
                                    list[i].allowType = '挂起'
                                }else if(list[i].memberStatus === 4){
                                    list[i].allowType = '解挂'
                                }else {
                                    list[i].allowType = '未知'
                                }
                                                    
        
                                list[i].startTime =  this.Util.formatTime(list[i].startTime)
                                list[i].stopTime =  this.Util.formatTime(list[i].stopTime)
                                list[i].createTime =  this.Util.formatTime(list[i].createTime)
                                list[i].lockTime =  this.Util.formatTime(list[i].lockTime)
                            
                        }
                        const data = this.Util.formatJson(filterVal, list)
                        let excelFileName = `会员信息${this.Util.formatDate.format(new Date(),'yyyy-MM-dd')}`
                        export_json_to_excel(tHeader, data, excelFileName)
                    
                    })
                }, 
        handleSizeChange(val) {
            this.pageSize =  val;
            this.getTableList();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getTableList();               
        },
        // 优惠类型转换
        formatType: function (row, column) {
            return row.type === 1? '减免时间' : row.type === 2 ? '减免金额' : row.type === 0 ? '金额全免': '未知';
        },
        // 使用状态转换
        formatSate: function (row, column) {
            return row.status === 1? '已使用' : row.status === 0 ? '未使用': '未知';
        },
        // 自定义序号
        indexMethod(index){
            return index +this.pageSize*(this.currentPage-1);
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
        // 新增显示
        addDC(){
            this.DCVisible=true;
            this.CostStn.Area='';
            this.CostStn.cname='';
            this.CostStn.remark='';
        },
        // 修改显示
        DCEdit(index,row){
            this.DCVisible=true;
            this.CostStn.Area=row.Type;
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
                    console.log(para);
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
        // 获取table数据
        getTableList(isAgm){
            let condition = this.filters.condition;
            let what = this.filters.what;
            let whatTime = this.filters.whatTime;
            let obj = {};
            obj[condition] = what;
            let params = {
                status: this.filters.isEmploy
            }
            if(whatTime){
                params.beginDate = this.Util.formatDate.format(whatTime[0],'yyyy-MM-dd hh:mm:ss')
                params.endDate = this.Util.formatDate.format(whatTime[1],'yyyy-MM-dd hh:mm:ss')
            }
            params.current=this.currentPage-1
            params.length=this.pageSize
            let para=Object.assign(params,obj)
            getElectCouponsList(para).then(res=>{
                this.total=res.data.totalCount;
                this.array=res.data.data;
                // console.log(res)
            }).catch(err=>{
                console.log(err)
            })
        },
    },
}
