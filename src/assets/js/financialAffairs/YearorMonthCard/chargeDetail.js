
    import { listMemberRateSim,changeList,changeCount} from '@/api/api';
export default {
    data() {
        return {
            carNum:'',
            applyTime:'',
            memberRateId:'',
            payType:'',
            monthCardList:[],           //年/月卡类型
            payTypeList:this.Util.payTypeList,
            totalMoney:0,

            // 列表信息
            array: [],
            changeCountArray:[],
            tableTitleList:[],
            currentPage:1,
            total: 0,
            pageSize: 10,
            listLoading: false,
            
            chargeSumVisible:false,
        }
    },
    mounted() {
        this.getTableList()
        this.listMemberRateSim()
    },
    beforeUpdate(){
        document.getElementById("menu-box-6").classList.add("menu-active")				
    },     
    methods: {
        // 导出excel文件
        exportExcel(){
            require.ensure([], () => {
                const { export_json_to_excel } = require('@/assets/js/excel/Export2Excel')
                const tHeader = ['车牌号', '车主姓名', '会员类型','业务类型','办理时长','缴纳金额(元)','缴纳方式','办理时间','管理员','生效时间','失效时间','备注']
                const filterVal = ['carNum', 'owner', 'memberType','operatorType','applyLen','payMoney','payType','payTime','operatorName','startTime','stopTime','remark']
                const list = this.Util.deepCopy(this.array)
                const data = this.Util.formatJson(filterVal, list)
                let excelFileName = '会员收费明细'
                export_json_to_excel(tHeader, data, excelFileName)

            })
        },
        //查可配置的进场规则
        listMemberRateSim(){
            listMemberRateSim({operatorId: this.Util.userInfo.id})
                .then( (data) => {
                        console.log(data)
                    if(data.data.data){
                        // this.monthCardList = []
                        this.monthCardList = data.data.data
                    }else{
                        this.$message.error(data.data.msg);                             
                    }                                              
            })            
        },        
        // 每页大小
        handleSizeChange(val) {
            this.pageSize =  val
            this.getTableList(false) 
        },
        // 当前页
        handleCurrentChange(val) {
            this.currentPage = val
            this.getTableList(false)              
        },
        // 业务类型
        formatOperatorType(row, column) {
            return row.operatorType == 0? '办理' : row.operatorType == 1 ? '续费' : row.operatorType == 2 ? '退还':row.operatorType == 3 ? '补交':'未知' ;
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
                memberRateId:this.memberRateId,
                payType:this.payType,
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
            changeList(params).then(res=>{
                if(res.data.code=='SUCCESS'){
                    this.array=res.data.data.pageData.content
                    this.array.forEach(item => {
                        item.carNum = item.card.carNum
                        item.owner = item.card.owner
                        item.memberType = item.card.memberType
                        item.startTime = item.card.startTime
                        item.stopTime = item.card.stopTime
                        if(item.operatorType == 0){
                            item.operatorType = '办理'
                        }else if(item.operatorType == 1) {
                            item.operatorType = '续费'
                        }else if(item.operatorType == 2) {
                            item.operatorType = '退还'
                        }else if(item.operatorType == 3) {
                            item.operatorType = '补交'
                        }else {
                            item.operatorType = '未知'
                        }
                    });
                    // console.log(this.array)
                    this.total=res.data.data.pageData.totalElements
                    this.totalMoney = res.data.data.totalMoney
                   
                }else{
                    this.$message.error(res.data.msg)
                }                
                
                // console.log(res)
            })
        },
         //打开收费统计弹窗
         openChangeCountDialog(){
            this.changeCount()
         },
         // 获取收费统计
         changeCount(){
            let params = {
                operatorId:this.Util.userInfo.id,
                applyLowTime:'',
                applyUpTime:'',
                carNum:this.carNum,
                memberRateId:this.memberRateId,
                payType:this.payType,
            }             
            changeCount(params).then(res=>{
                if(res.data.code=='SUCCESS'){
                    this.tableTitleList = []
                    this.changeCountArray=res.data.data
                    let tempList = this.changeCountArray[0].managerCounts
                    for(let i = 0,len = tempList.length; i<len; i++){
                        let tempObj = {
                            prop:'count',
                            label:tempList[i].manager,
                        }
                        this.tableTitleList.push(tempObj)
                    }
                    console.log(this.tableTitleList)

                }else{
                    this.$message.error(res.data.msg)
                }                
                
                // console.log(res)
            })
        },   
        getSummaries(param){
            // console.log(param)
            //没有收费记录
            if(param.columns.length <3){
                return ['合计',0]
            }
            //第一列
            let sum = [];
            sum[0] = '合计'

            let tempLen = param.data[0].managerCounts.length
            for(let k = 0; k<tempLen; k++){
                let tempVal = 0

                for(let j = 0,len = param.data.length; j<len; j++){
                    tempVal += param.data[j].managerCounts[k].count
                }
                sum[k+1] = tempVal
            }
            //最后一列统计
            let countMoney = 0
            let countMoneyLen = param.columns.length-1
            for(let j = 0,len = param.data.length; j<len; j++){
                countMoney += param.data[j].countMoney*100
                // console.log(countMoney)
            }
            sum[countMoneyLen] = countMoney/100
            // console.log(sum)
            
            return sum
        }     
        
    },
}
