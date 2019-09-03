import {listMemberRate,addMemberRate,updateMemberRate,deleteMemberRate,getRegionAllSimpleInfo } from '@/api/api';
export default {
    data() {
        return {
            listLoading: false,
            pageSize:10,
            dataTotal:0,
            currentPage:1,            
            CostStn:{
                cloudPayFlag:false,
                timeLimitFlag:false,
                rangeDateValue:[new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 12, 0)],
                memberType:'',
                remark:'',
                operatorId:'',
                standarId:'',
                regionArr:[],
                chargeStn:{
                    dayMoney:0,
                    monthMoney:0,
                    yearMoney:0,
                },
                chargeStandardUnit:'月',
                chargeStandardNum:0,
            },
            regionArray:[],
            // 列表信息
            array: [],
            isUpdate:false,
            costStnVisible: false,
            costStnTitle:'新增标准',
            addCostStnLoading: false,
            addCostStnFormRules: {
                chargeStn: [
                //   { required: true, validator: $t.validatePass, trigger: 'blur' },
                ],
                memberType: [
                  { required: true, message: '请输入会员类型', trigger: 'blur' },
                ],
                chargeStandardNum: [
                    { required: true, message: '请输入收费标准', trigger: 'change' },
                ],
                regionArr: [
                  {  type: 'array', required: true, message: '至少选择一个有效区域', trigger: 'change' },
                ],
            },

        }
    },
    mounted() {
        this.getTableList();
    },
    beforeUpdate(){
        document.getElementById("menu-box-6").classList.add("menu-active")				
    },     
    methods: {
        handleSizeChange(val) {
            this.pageSize =  val;
            this.getTableList();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getTableList();               
        },
      
        // 有效区信息
        formatRegion(row, column) {
            let regionNameStr = '';
            let ragionInfoArray = row.regionInfos;
            for(let i in ragionInfoArray){
                regionNameStr += ragionInfoArray[i].regionName+','
            }
            return regionNameStr.substring(0,regionNameStr.length-1)
        },
        // 表头样式
        tbHeader(cell){
            if(cell.column.label=='1'){
                return {display:'none'}
            }
            return {'text-align':'center'}
        },
        // 自定义序号
        indexMethod(index){
            return index +this.pageSize*(this.currentPage-1);
        },
        //区域ID转换
        regionChange(regionNameArray){
            let regionId='';
            // console.log(this.regionArray)

            for(let i=0;i<regionNameArray.length;i++){
                for(let j in this.regionArray){
                    if(regionNameArray[i]==this.regionArray[j].regionName){
                        regionId+=this.regionArray[j].id+','
                    }
                }
            } 
            return regionId.substring(0,regionId.length-1)
        },
        // 添加标准
        addCsotStn(){
            this.costStnTitle = '新增标准'

            this.costStnVisible=true
            this.isUpdate=false
            this.getRegion()

            this.CostStn.memberType=''
            this.CostStn.chargeStn.dayMoney=''
            this.CostStn.chargeStn.monthMoney=''
            this.CostStn.chargeStn.yearMoney='' 
            this.CostStn.remark=''
            this.CostStn.regionArr=[]
            this.CostStn.cloudPayFlag=false
            this.CostStn.timeLimitFlag=false
            this.CostStn.chargeStandardUnit='月'
            this.CostStn.chargeStandardNum=0
        },
        // 修改标准
        editCostStn(index,row){
            console.log(row)
            if(row.startTime !== '' && row.endTime !== ''){
                let beginTime = row.startTime.split(':')
                let endTime = row.endTime.split(':')
                this.CostStn.rangeDateValue = [new Date(2016, 9, 10, beginTime[0], beginTime[1]), new Date(2016, 9, 10, endTime[0], endTime[1])]
            }else{
                this.CostStn.rangeDateValue = [new Date(2016, 9, 10, 0, 0),new Date(2016, 9, 10, 0, 0)]

            }

            this.costStnVisible=true
            this.costStnTitle = '修改标准'
            this.isUpdate=true
            this.CostStn.regionArr=[]
            this.getRegion()

            // console.log(row)
            for(let i=0;i<row.regionInfos.length;i++){
                this.CostStn.regionArr.push(row.regionInfos[i].regionName)
            }
            this.CostStn.memberType=row.memberType
            this.CostStn.chargeStn.dayMoney=''
            this.CostStn.chargeStn.monthMoney=''
            this.CostStn.chargeStn.yearMoney=''
            this.CostStn.remark=row.remark
            this.CostStn.standarId=row.id
            this.CostStn.cloudPayFlag=row.cloudPayFlag
            this.CostStn.timeLimitFlag=row.timeLimitFlag

            if(row.dayMoney){
                this.CostStn.chargeStandardUnit='天'
                this.CostStn.chargeStandardNum=row.dayMoney
            }else if(row.monthMoney){
                this.CostStn.chargeStandardUnit='月'
                this.CostStn.chargeStandardNum=row.monthMoney
            }else if(row.yearMoney){
                this.CostStn.chargeStandardUnit='年'
                this.CostStn.chargeStandardNum=row.yearMoney
            }
        },
        // 提交
        CostStnSubmit() {
            let startTime='',endTime='',regionId='';
            let regionArr=this.CostStn.regionArr;

            this.$refs.CostStnForm.validate((valid) => {
                if (valid) {
                    if(this.CostStn.timeLimitFlag){
                        startTime=this.Util.formatDate.format(this.CostStn.rangeDateValue[0],'hh:mm')
                        endTime=this.Util.formatDate.format(this.CostStn.rangeDateValue[1],'hh:mm')
                    }
                    if(regionArr.length){
                        regionId=this.regionChange(regionArr);
                    }
                    if (this.CostStn.chargeStandardUnit === '天') {
                        this.CostStn.chargeStn.dayMoney = this.CostStn.chargeStandardNum
                    }else if(this.CostStn.chargeStandardUnit === '月'){
                        this.CostStn.chargeStn.monthMoney = this.CostStn.chargeStandardNum
                    }else if(this.CostStn.chargeStandardUnit === '年'){
                        this.CostStn.chargeStn.yearMoney = this.CostStn.chargeStandardNum
                    }
                    
                    let params={
                        operatorId:this.Util.userInfo.id,
                        memberType:this.CostStn.memberType,
                        dayMoney:this.CostStn.chargeStn.dayMoney,
                        monthMoney:this.CostStn.chargeStn.monthMoney,
                        yearMoney:this.CostStn.chargeStn.yearMoney,
                        regionId:regionId,
                        remark:this.CostStn.remark,
                        cloudPayFlag:this.CostStn.cloudPayFlag,
                        timeLimitFlag:this.CostStn.timeLimitFlag,
                        startTime:startTime,
                        endTime:endTime
                    };
                    console.log(params);
                    if(this.isUpdate){
                        params.id=this.CostStn.standarId;
                        updateMemberRate(params).then(res=>{
                            // console.log(res)
                            if(res.code=="SUCCESS"){
                                this.costStnVisible=false;
                                this.getTableList();
                                this.$message({
                                    type:'success',
                                    message:res.msg
                                })
                            }else{
                                this.$message.error(res.msg)
                            }
                        })
                    }else{
                        addMemberRate(params).then(res=>{
                            // console.log(res);
                            if(res.code=='SUCCESS'){
                                this.costStnVisible=false;
                                this.getTableList();
                                this.$message({
                                    type:'success',
                                    message:res.msg
                                })
                            }else{
                                this.$message.error(res.msg)
                            }
                        })
                    }
                } else {
                  console.log('error submit!!');
                //   return false;
                }
              });
        },
        //删除
        handleDelete(index, row) {
            this.$confirm('确认删除该记录吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                // this.listLoading = true;
                let params={
                    operatorId:this.Util.userInfo.id,
                    id:row.id
                }
                deleteMemberRate(params).then(res=>{
                    // console.log(res)
                    if(res.code=='SUCCESS'){
                        this.costStnVisible=false;
                        this.getTableList();
                        this.$message({
                            type:'success',
                            message:res.msg
                        })
                    }else{
                        this.$message.error(res.msg)
                    }                    

                })
            });
        },
        // 获取table数据
        getTableList(){
            let params={
                operatorId:this.Util.userInfo.id,
                current:this.currentPage-1,
                length:this.pageSize
            }
            this.listLoading = true
            // console.log(params)
            listMemberRate(params).then(res=>{
                this.listLoading = false
                // console.log(res)
                if (res.data.code === "SUCCESS") {
                    this.array=res.data.data.content
                    this.dataTotal=res.data.data.totalElements

                } else {
                    this.$message.error(res.data.msg)
                }

            })
        },
        // 获取区域信息
        getRegion(){
            let params={
                operatorId:this.Util.userInfo.id
            }
            getRegionAllSimpleInfo(params).then(res=>{
                // console.log(res)
                if (res.data.code === "SUCCESS") {
                    this.regionArray=res.data.data
                } else {
                    this.$message.error(res.data.msg)
                }
            })

        }
    },
}
