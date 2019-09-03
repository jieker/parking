
import { applyRecord } from '@/api/api';
export default {
    data() {
        return {
            carNum:'',          
            businessType: '',
            applyTime:null,

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
        this.getTableList(true)
    },
    beforeUpdate(){
        document.getElementById("menu-box-6").classList.add("menu-active")				
    },     
    methods: {
            // 导出excel文件
        exportExcel(){
            require.ensure([], () => {
                const { export_json_to_excel } = require('@/assets/js/excel/Export2Excel')
                const tHeader = ['车牌号', '车主姓名', '会员类型','业务类型','办理时间','操作员','备注']
                const filterVal = ['carNum', 'owner', 'memberType','businessType','createTime','operatorName','remark']
                const list = this.Util.deepCopy(this.array)
                const data = this.Util.formatJson(filterVal, list)
                let excelFileName = '会员办理记录'
                export_json_to_excel(tHeader, data, excelFileName)
                                
            })
        }, 
        // 每页数据大小
        handleSizeChange(val) {
            this.pageSize =  val 
            this.getTableList(false)
        },
        // 当前页
        handleCurrentChange(val) {
            this.currentPage = val
            this.getTableList(false)
        },
    
        // 自定义序号
        indexMethod(index){
            return index +this.pageSize*(this.currentPage-1)+1;
        },
       
        // 获取table数据
        getTableList(isGlobal){
            let params = {
                operatorId:this.Util.userInfo.id,
                applyLowTime:'',
                applyUpTime:'',
                carNum:this.carNum,
                businessType:this.businessType,
                current:this.currentPage-1,
                length:this.pageSize,
            }
            if(isGlobal){
                params.current = 0
            }
            if(this.applyTime){
                params.applyLowTime = this.Util.formatDate.format(this.applyTime[0],'yyyy-MM-dd hh:mm:ss')
                params.applyUpTime = this.Util.formatDate.format(this.applyTime[1],'yyyy-MM-dd hh:mm:ss')
            }
            applyRecord(params).then(res=>{
                if(res.data.code=='SUCCESS'){
                    this.array=res.data.data.content;
                    this.total=res.data.data.totalElements;
                }else{
                    this.$message.error(res.data.msg)
                }                
                
            })
        },
    },
}
