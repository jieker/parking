

 // 引入基本模板
var echarts = require('echarts/lib/echarts');
import {vipList,vipAdd,vipDelete,vipPause,vipBatchDelete,listMemberRateSim,feeChange,feeRenewals,infoUpdate,vipTypeCount } from '@/api/api'
export default {
    computed:{
        // expireTime(){
        //     return vip_INFO.effectTime
        // }
    },
    data(){
        return {
            // 导入表格
            excelImportShow:false,
            // 查询信息
            filters: {
                condition: 'carNum',
                conditionTime:'valid_time',
                what:'',
                whatTime:null,
                containExpire:true,
                showOtherPark:true,
            },
            payTypeList:this.Util.payTypeList,
            vip_INFO:{
                carNum:'',      
                memberName:'',
                applyUnit:'月',
                payType:'现金支付',
                returnFee:false,
                payTime:new Date(),
                idCard:'',
                phoneNum:'',
                company:'',
                applyLength:1,
                memberRateIndex:'',
                memberRateId:'',
                memberRatesId:'',
                memberType:'',
                effectTime:new Date(),
                effTime:'',
                expireTime:'',
                expTime:'',
                payMoney:0,
                vipId:'',
                remark:''
            },
            isEffectTime:false,     //控制生效时间是否可修改
            //办理单位
            applyUnitList:[],
            // 标准列表
            RateList:[],
            sels: [],//列表选中列
            // 列表信息
            array: [],
            currentPage:1,
            total: 0,
            pageSize: 10,
            listLoading: false,
            editTimelength:0,

            isUserType:false,           //用户类型统计图
            isHandle:false,
            handleFormVisible: false,//办理会员界面是否显示
            innerVisible:false,
            handleLoading: false,
            handleFormRules: {
                carNum: [
                    { required: true, message: '请输入车牌', trigger: 'blur' },
                    { required: true, validator: this.Check.ruleCarNum, trigger: 'blur' }
                ],
                // memberRateIndex: [
                //     { required: true, message: '请选择办理类型', trigger: 'blur' },
                // ],      
                // applyUnit: [
                //     { required: true, message: '请选择办理单位', trigger: 'blur' },
                // ],         
                // applyLength: [
                //     { required: true, message: '请选择办理时长', trigger: 'blur' },
                // ],     
                // effectTime: [
                //     { required: true, message: '请选择生效时间', trigger: 'blur' },
                // ],                                               
            },
            pickerOptions: {
                disabledDate:(time)=>{
                    // console.log(this.vip_INFO.effTime)
                    if(!this.isHandle){
                        return time.getTime() >  new Date().getTime();

                    }
                },
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                    picker.$emit('pick', new Date());
                    }
                },]
            },
            renewLoading: false,
            renewVisible:false,
            
            costChangeFormVisible: false,//费用变更界面是否显示
            costChangeLoading: false,

            editFormVisible: false,
            editLoading: false,
            editFormRules: {
                carNum: [
                    { required: true, message: '请输入companyid', trigger: 'blur' }
                ]
            },
            hangUpLoading: false,
        }
    },
    mounted(){
        this.getVipList(false);
        // this.chartUserSum({});
        // this.timeAndMoney();
        this.getListMemberRate();
    },
    beforeUpdate(){
        document.getElementById("menu-box-6").classList.add("menu-active")				
    },     
    methods:{
            // 导出excel文件
        exportExcel(){
            require.ensure([], () => {
                const { export_json_to_excel } = require('@/assets/js/excel/Export2Excel')
                const tHeader = ['车牌号', '生效时间', '失效时间','会员类型','办理时间','收费停车场','车主姓名','状态','挂起时间','备注']
                const filterVal = ['carNum', 'startTime', 'stopTime','memberType','createTime','parkName','owner','memberStatus','lockTime','remark']
                const list = this.Util.deepCopy(this.array)
                const data = this.Util.formatJson(filterVal, list)
                let excelFileName = '会员信息'
                export_json_to_excel(tHeader, data, excelFileName)
                                    
            })
        },

        // // 导出excel文件
        // exportExcel(){
        //     require.ensure([], () => {
        //         const { export_json_to_excel } = require('@/assets/js/excel/Export2Excel')
        //         const tHeader = ['车牌号', '生效时间', '失效时间','会员类型','办理时间','收费停车场','车主姓名','状态','挂起时间','备注']
        //         const filterVal = ['carNum', 'startTime', 'stopTime','memberType','createTime','parkName','memberStatus','memberStatus','lockTime','remark']
        //         const list = this.Util.deepCopy(this.array)

        //         for (let i = 0; i < list.length; i++) {
                     
        //                 //转换卡状态
        //                 if(list[i].memberStatus === 0){
        //                     list[i].allowType = '未生效'
        //                 }else if(list[i].memberStatus === 1){
        //                     list[i].allowType = '已生效'
        //                 }else if(list[i].memberStatus === 2){
        //                     list[i].allowType = '已失效'
        //                 }else if(list[i].memberStatus === 3){
        //                     list[i].allowType = '挂起'
        //                 }else if(list[i].memberStatus === 4){
        //                     list[i].allowType = '解挂'
        //                 }else {
        //                     list[i].allowType = '未知'
        //                 }
                                            

        //                 list[i].startTime =  this.Util.formatTime(list[i].startTime)
        //                 list[i].stopTime =  this.Util.formatTime(list[i].stopTime)
        //                 list[i].createTime =  this.Util.formatTime(list[i].createTime)
        //                 list[i].lockTime =  this.Util.formatTime(list[i].lockTime)
                    
        //         }
        //         const data = this.Util.formatJson(filterVal, list)
        //         let excelFileName = `会员信息${this.Util.formatDate.format(new Date(),'yyyy-MM-dd')}`
        //         export_json_to_excel(tHeader, data, excelFileName)
            
        //     })
        // },        
        //新增会员选择会员标准
        memberRateChange(){
            // console.log(11)
            let memberRate = this.RateList[this.vip_INFO.memberRateIndex] 
            this.vip_INFO.memberRateId = memberRate.id
            this.applyUnitList = []

            if(memberRate.dayMoney){
                this.applyUnitList.push('天')
            }
            if(memberRate.monthMoney){
                this.applyUnitList.push('月')
            }
            if(memberRate.yearMoney){
                this.applyUnitList.push('年')
            }
            this.vip_INFO.applyUnit = this.applyUnitList[0]
            this.timeAndMoney()
            // console.log(memberRate)
            // console.log(this.vip_INFO.applyUnit)

        },
        //关闭办理会员/续费弹窗
        closeMemberDialog(){
            // this.$nextTick(()=>{
            //     this.$refs['vip_INFO'].resetFields()            
            //  })            
        },
        //转换卡状态
        // formatMemberStatus (row, column) {
        //     return row.memberStatus == 0? '未生效' : row.memberStatus == 1 ? '已生效' :row.memberStatus == 2 ? '已失效' :row.memberStatus == 3 ? '挂起':row.memberStatus == 4 ? '解挂':'未知';
        //     // -0,未生效；1,已生效；2,已失效；3,挂起；4,解挂
        // },
        // 给table设定指定样式
        styleSpecial(style){
            // console.log(style)
            if(style.row.memberStatus==0){
                return {color:'#F56C6C'}
            }else if(style.row.memberStatus==1){
                return {color:'#1e00ff'}
            }
        },
        //size-change和current-change事件来处理页码大小和当前页变动时候触发的事件。
        handleSizeChange(val) {
            this.pageSize =  val;
            this.getVipList(false);
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            // this.page =  val;
            this.getVipList(false);
        },
        handleSelectionChange(val) {
            this.sels = val;
        },
        // 自定义序号
        indexMethod(index){
            return index +this.pageSize*(this.currentPage-1);
        },
        //获取列表
         getVipList(isAgm) {
            let condition = this.filters.condition;
            let conditionTime = this.filters.conditionTime;
            let what = this.filters.what;
            let whatTime = this.filters.whatTime;
            // let checkList = this.filters.checkList;
            let obj = {};
            obj[condition] = what;
            let params={
                operatorId:this.Util.userInfo.id,
                containExpire:true,
                showOtherPark:true,
            }
            // console.log(whatTime)
            if(whatTime){
                // let effTime=whatTime[0].toString()
                // let expTime=whatTime[1].toString()
                if(conditionTime=='valid_time'){
                    // params.effectUpTime=effTime.substring(0,effTime.length-7);
                    // params.effectLowTime=expTime.substring(0,effTime.length-7);
                    params.effectLowTime = this.Util.formatDate.format(whatTime[0],'yyyy-MM-dd')                    
                    params.effectUpTime = this.Util.formatDate.format(whatTime[1],'yyyy-MM-dd')
                }else{  //按办理时间查找
                    let applyLowTime = whatTime[0].getTime()
                    let applyUpTime = whatTime[1].getTime()
                    //如果是当天,上限改为23:59:59
                    if(applyLowTime === applyUpTime){   
                        applyUpTime += 24*3600000-1
                    }
                    params.applyLowTime = this.Util.formatDate.format(new Date(applyLowTime),'yyyy-MM-dd hh:mm:ss')                     
                    params.applyUpTime = this.Util.formatDate.format(new Date(applyUpTime),'yyyy-MM-dd hh:mm:ss')

                    // params.applyLowTime = this.Util.formatDate.format(whatTime[0],'yyyy-MM-dd hh:mm:ss')                     
                    // params.applyUpTime = this.Util.formatDate.format(whatTime[1],'yyyy-MM-dd hh:mm:ss')
                    
                    // params.applyUpTime=effTime.substring(0,effTime.length-8);
                    // params.applyLowTime=expTime.substring(0,effTime.length-8);
                }
            }
            params.length=this.pageSize
            params.containExpire=this.filters.containExpire
            params.showOtherPark=this.filters.showOtherPark
            if(isAgm){
                params.current=0
            }else{
                params.current=this.currentPage-1
            }
            let para=Object.assign(params,obj)
            // console.log(para)
            vipList(para).then( res => {
                // console.log(res)
                if(res.data.code=='SUCCESS'){
                    this.array=res.data.data.content;
                    this.array.forEach(item => {
                        if(item.memberStatus === 0) {
                            item.memberStatus = '未生效'
                        }else if(item.memberStatus === 1) {
                            item.memberStatus = '生效'
                        }else if(item.memberStatus === 2) {
                            item.memberStatus = '失效'
                        }else if(item.memberStatus === 3) {
                            item.memberStatus = '挂起'
                        }else {
                            item.memberStatus = '解挂'
                        }
                    });
                    this.total=res.data.data.totalElements;
                }else{
                    this.$message.error(res.data.msg)
                }
              })             
        },
        // 获取收费标准简单列表
        getListMemberRate(){
            let para={
                operatorId:this.Util.userInfo.id
            }
            listMemberRateSim(para).then(res=>{
                // console.log(res);
                if(res.data.code=='SUCCESS'){
                    this.RateList=res.data.data;
                    // console.log(this.RateList)
                    // this.vip_INFO.memberRateId=this.RateList.length?this.RateList[0].id:null
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        // 会员办理
        handleIVP(){
            this.isEffectTime = false

            // this.$refs['vip_INFO'].resetFields()            

            // this.handleFormRules.carNum[0].require=true;
            // let strTime=this.Util.formatDate.format(new Date(),'yy/MM/dd')
            // let currentTime=this.Util.formatDate.parse(strTime,'yy/MM/dd')

            this.handleFormVisible = true
            this.isHandle = true

            this.vip_INFO.carNum = ''
            this.vip_INFO.memberName = ''
            this.vip_INFO.applyUnit ='月'
            this.vip_INFO.payType = '现金支付'
            this.vip_INFO.returnFee = false
            this.vip_INFO.payTime = new Date()
            this.vip_INFO.idCard = ''
            this.vip_INFO.phoneNum = ''
            this.vip_INFO.company = ''
            this.vip_INFO.applyLength = 1
            this.vip_INFO.memberRateIndex = ''
            this.vip_INFO.memberRateId = ''
            this.vip_INFO.memberRatesId = ''
            this.vip_INFO.memberType = ''
            this.vip_INFO.effectTime = new Date()
            this.vip_INFO.effTime = ''
            this.vip_INFO.expireTime = ''
            this.vip_INFO.expTime = ''
            this.vip_INFO.payMoney = ''
            this.vip_INFO.vipId = ''
            this.vip_INFO.remark = ''

            // this.timeAndMoney()
        },
        // 会员续费
        handleRenew(index,row){
            // this.$refs['vip_INFO'].resetFields()            

            // console.log(this.handleFormRules);
            // this.handleFormRules.carNum[0].require=false
            this.vip_INFO.carNum=row.carNum
            this.vip_INFO.memberType=row.memberType
            this.vip_INFO.memberName=row.owner
            this.vip_INFO.idCard=row.idcard
            this.vip_INFO.phoneNum=row.telephone
            this.vip_INFO.company=row.company
            this.vip_INFO.memberRateId=row.memberRatesId
            this.vip_INFO.vipId=row.id;
            this.vip_INFO.remark=row.remark;
            this.vip_INFO.applyUnit=row.applyUnit;
            this.isHandle=false;

            this.applyUnitList = []

            for(let i=0;i<this.RateList.length;i++){
                if(this.vip_INFO.memberRateId==this.RateList[i].id){
                    let memberRate = this.RateList[i] 

                    if(memberRate.dayMoney){
                        this.applyUnitList.push('天')
                    }
                    if(memberRate.monthMoney){
                        this.applyUnitList.push('月')
                    }
                    if(memberRate.yearMoney){
                        this.applyUnitList.push('年')
                    }                  
                }
            }

            // let newTime=new Date(this.Util.formatDate.format((new Date),'yy/MM/dd')).getTime();
            let newTime=new Date().getTime();
            let stopTime=new Date(row.stopTime).getTime();

            if(newTime<=stopTime){
                this.$confirm('月卡未到期, 是否继续续费?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    this.handleFormVisible = true;
                    this.vip_INFO.effectTime=new Date(row.stopTime);
                    this.vip_INFO.effTime=row.stopTime;
                    this.isEffectTime = true
                    this.timeAndMoney();
                }).catch((err) => {
                    // console.log(err)
                    // this.handleFormVisible = false;

                });
            }else{
                this.isEffectTime = false
                this.vip_INFO.effectTime=new Date();
                this.handleFormVisible = true;
            }
        },
        // 费用变更
        handleChange(index,row){
            // let start=row.startTime
            this.costChangeFormVisible = true;
            this.vip_INFO.carNum=row.carNum;
            this.vip_INFO.effTime=row.startTime?this.Util.formatDate.format(new Date(row.startTime),'yy-MM-dd'):'';
            this.vip_INFO.expTime=row.stopTime?this.Util.formatDate.format(new Date(row.stopTime),'yy-MM-dd'):'';
            this.vip_INFO.memberType=row.memberType;
            this.vip_INFO.vipId=row.id;
        },
        // 会员信息修改
        handleEdit(index,row){
            let start=new Date(row.startTime).getTime()
            let end=new Date(row.stopTime).getTime()
            // console.log(row.startTime)
            // console.log(row.stopTime)
            
            this.editTimelength=end-start;
            this.editFormVisible = true;
            this.vip_INFO.carNum=row.carNum;
            this.vip_INFO.effectTime=new Date(row.startTime);
            this.vip_INFO.expTime=row.stopTime?this.Util.formatDate.format(new Date(row.stopTime),'yy-MM-dd'):'';
            this.vip_INFO.expireTime=new Date(row.stopTime);
            // this.vip_INFO.effTime=new Date();
            this.vip_INFO.memberType=row.memberType;
            this.vip_INFO.memberName=row.owner;
            this.vip_INFO.memberRateId=row.memberRatesId;
            this.vip_INFO.idCard=row.idcard;
            this.vip_INFO.phoneNum=row.telephone;
            this.vip_INFO.company=row.company;
            this.vip_INFO.vipId=row.id;
        },
       
        openMemberChart(){
            this.isUserType=true
            let params = {
                operatorId:this.Util.userInfo.id,
            }
            
            vipTypeCount(params).then( res => {
                // console.log(res.data.data)
                if(res.data.code=='SUCCESS'){
                    this.chartUserSum(res.data.data)

                }else{
                    this.$message.error(res.data.msg)
                }
              })             

        },
        // 用户类型统计图
        chartUserSum(data){
            // console.log(data)

            let userArr = []
            let userArrCount = []
            let userArrSum = 0
            for(let i = 0,len = data.length; i < len; i++){
                userArr.push(data[i].memberType)
                userArrCount.push(data[i].number)
                userArrSum += data[i].number
            }
            // let userArr=['地面月卡','地库月卡','公务用车','内部人员','超级vip'];

            let cWidth=document.getElementById('userTypeBar');
            // cWidth.style.width=window.innerWidth/2.5+'px';
            let chartUS = echarts.init(cWidth)
            let option = {
                title: {
                    text: '会员信息统计表 总计:'+userArrSum,
                    // subtext: '纯属虚构'
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                grid: {
                    right: '20%',
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow',
                            label: {
                                show: true,
                                formatter: function (params) {
                                    return params.value.replace('\n', '');
                                }
                            }
                        }
                    }
                },
                toolbox: {
                    feature: {
                        dataView: {show: true, readOnly: false},
                        // restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                xAxis: [
                    {
                        type: 'category',
                        data: userArr
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '',
                        // min: 0,
                        // max: 25,
                        axisLabel: {
                            formatter: '{value} '
                        }
                    },
                ],
                series: [
                    {
                        name:'',
                        type:'bar',
                        // data:[5,8,45,8,4],
                        data:userArrCount,
                        itemStyle: {   
                            //通常情况下：
                            normal:{  
            　　　　　　　　　　　　//每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                                color: function (params){
                                    var colorList = [ 
                                        '#C33531','#EFE42A','#64BD3D','#EE9201','#29AAE3', '#B74AE5','#0AAF9F','#E89589' 
                                        ]; 
                                    return colorList[params.dataIndex];
                                }
                            },
                            //鼠标悬停时：
                            emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        barWidth : 30,//柱图宽度
                    },
                ]
            };
            chartUS.setOption(option);
        },
        //提交校验会员办理or会员续费信息
        handleSubmit() {
            let _this=this;
            this.$refs.handleForm.validate((valid) => {
                // this.innerVisible = false;
                if (valid) {
                    // let vipInfo=this.vip_INFO;
                    let params = this.Util.deepCopy(this.vip_INFO)
                    params.operatorId = this.Util.userInfo.id
                    // let valId={
                    //     operatorId:this.Util.userInfo.id
                    // }
                    // console.log(_this.vip_INFO)

                    params.expireTime=_this.vip_INFO.expTime;
                    params.effectTime= this.Util.formatDate.format(_this.vip_INFO.effectTime,'yyyy-MM-dd')
                    params.payTime= this.Util.formatDate.format(_this.vip_INFO.payTime,'yyyy-MM-dd hh:mm:ss')
                    // let para=Object.assign(vipInfo,valId)
                    // console.log(para)
                    if(this.isHandle){
                        this.memberAdd(params);
                    }else{
                        // console.log(params)
                        // params.id=vipInfo.vipId;
                        this.memberRenewals(params);
                    }
                 }
              })
        },
        // 会员办理
        memberAdd(para){
            // console.log(para)
            vipAdd(para).then(res=>{
                // console.log(res);
                if(res.code=='SUCCESS'){
                    this.$message({
                        type:'success',
                        message:res.msg
                    })
                    this.handleFormVisible = false
                    this.innerVisible = false
                    this.handleLoading = false
                    this.getVipList(false)
                }else{
                    this.$message.error(res.msg)
                }
            })
        },
        // 会员续费
        memberRenewals(params){
            // console.log(params)
            let para={
                applyLength:params.applyLength,
                applyUnit:params.applyUnit,
                expireTime:params.expireTime,
                effectTime:params.effectTime,
                operatorId:params.operatorId,
                payMoney:Number(params.payMoney),
                payType:params.payType,
                payTime:params.payTime,
                remark:params.remark,
                id:params.vipId,
            }
            // console.log(para)
            feeRenewals(para).then(res=>{
                // console.log(res)
                if(res.code=='SUCCESS'){
                    this.$message({
                        type:'success',
                        message:res.msg
                    })
                    this.innerVisible = false
                    this.handleFormVisible = false;
                    this.handleLoading = false;
                    this.getVipList(false);
                    
                }else{
                    this.$message.error(res.msg)
                }
            })
        },
        //费用变更
        costChangeSubmit(){
            this.$refs.costChangeForm.validate((valid) => {
                if (valid) {
                        this.costChangeLoading = false;
                        var para={
                            operatorId:this.Util.userInfo.id,
                            payMoney:Number(this.vip_INFO.payMoney),
                            payType:this.vip_INFO.payType,
                            remark:this.vip_INFO.remark,
                            returnFee:this.vip_INFO.returnFee,
                            id:this.vip_INFO.vipId,
                        };
                        // console.log(para)
                        feeChange(para).then(res=>{
                            // console.log(res)
                            if(res.code=='SUCCESS'){
                                this.$message({
                                    type:'success',
                                    message:res.msg
                                })
                                // this.handleFormVisible = false;
                                this.costChangeFormVisible = false;
                                this.getVipList(false);

                            }else{
                                this.$message({
                                    type:'warning',
                                    message:res.msg
                                })
                            }
            
                        }).catch(err=>{
                            console.log(err)
                        })
                 }

              })
        },
        //修改信息
        editSubmit(){
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    this.editLoading = false;
                    this.editFormVisible = false;
                    console.log(this.vip_INFO)
                    var para={
                        carNum:this.vip_INFO.carNum,
                        company:this.vip_INFO.company,
                        idCard:this.vip_INFO.idCard,
                        memberName:this.vip_INFO.memberName,
                        expireTime:this.Util.formatDate.format(this.vip_INFO.expireTime,'yyyy-MM-dd'),
                        effectTime:this.Util.formatDate.format(this.vip_INFO.effectTime,'yyyy-MM-dd'),
                        memberRateId:this.vip_INFO.memberRateId,
                        operatorId:this.Util.userInfo.id,
                        phoneNum:this.vip_INFO.phoneNum,
                        remark:this.vip_INFO.remark,
                        id:this.vip_INFO.vipId,
                    };
                    // console.log(para)
                    infoUpdate(para).then(res=>{
                        // console.log(res)
                        if(res.code=='SUCCESS'){
                            this.$message({
                                type:"success",
                                message:res.msg
                            })
                            this.getVipList(false);
                        }else{
                            this.$message.error(res.msg)
                        }
                    })
                 }

              })
        },
        //会员删除
        handleDelete(index, row) {
            // console.log(row)
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
                }).then(() => {
                    let params={
                        operatorId:this.Util.userInfo.id,
                        id:row.id
                    };
                    vipDelete(params).then(res=>{
                        // console.log(res)
                        if(res.code=='SUCCESS'){
                            this.getVipList(false)
                            this.$message({
                                type:'success',
                                message:res.msg
                            })
                        }else{
                            this.$message.error(res.msg)
                        }
                    })
                // this.listLoading = true;
            });
        },
        // 会员挂起
        handleHangUp(index,row){
            let para={
                operatorId:this.Util.userInfo.id,
                id:row.id,
            }
            let lockOrUnLock = '挂起'
            row.lockTime ? lockOrUnLock = '解挂' : lockOrUnLock = '挂起'
            row.lockTime ? para.lockOption = false : para.lockOption = true
          
            // new Promise((resolve,reject)=>{
                this.$confirm(`是否要将车牌号为${row.carNum}的月卡${lockOrUnLock}?`, '提示', {
                    type: 'warning',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    }).then(() => {
                        vipPause(para).then(res=>{
                            // console.log(res)
                            if(res.code=='SUCCESS'){
                                this.$message({
                                    type:'success',
                                    message:res.msg
                                })
                                this.getVipList(false);
                            }else{
                                this.$message.error(res.msg)
                            }
                        })                        
                        // para.lockOption=true
                        // resolve(para);
                }).catch(()=>{
                    // para.lockOption=false
                    // resolve(para);
                });
            // }).then(para=>{

            // })
        },
        // 批量删除
        batchDelete(){
            this.$confirm('确认删除选中的记录吗?', '提示', {
                type: 'warning'
                }).then(() => {
                    let selectID=[];
                    for(let i in this.sels){
                        selectID.push(this.sels[i].id);
                    };
                    let params ={
                        idList:selectID,
                        operatorId:this.Util.userInfo.id
                    }
                    // console.log(para)
                    vipBatchDelete(params).then(res=>{
                        // console.log(res)
                        if(res.code=='SUCCESS'){
                            this.getVipList(false)
                            this.$message({
                                type:'success',
                                message:res.msg,
                            })
                            this.getVipList(false);
                        }else{
                            this.$message.error(res.msg)
                        }
                    })                    
                });


        },
        // 修改失效时间
        timeChange(){
            let end=new Date(this.vip_INFO.effectTime).getTime()+this.editTimelength;
            this.vip_INFO.expTime=this.Util.formatDate.format(new Date(end),'yy-MM-dd')
            this.vip_INFO.expireTime=new Date(end);
        },

        // 修改失效时间和缴纳金额
        timeAndMoney(){

            // let strTime = this.vip_INFO.effectTime ? this.Util.formatDate.format(this.vip_INFO.effectTime,'yy/MM/dd') : ""
            // let start = strTime ? new Date(strTime):'';
            // this.vip_INFO.effectTime=start;
            let start = this.vip_INFO.effectTime

            let days= this.vip_INFO.applyUnit;
            let rateId= this.vip_INFO.memberRateId;
            let timeLong=Number(this.vip_INFO.applyLength);
            // console.log(days)
            if(days==='天'){
                this.vip_INFO.expTime=start?Mtime(start,timeLong,'0'):'';
                this.vip_INFO.payMoney=this.MMoney(rateId,'0',timeLong);
            }else if(days==='月'){
                this.vip_INFO.expTime=start?Mtime(start,timeLong,'1'):'';
                this.vip_INFO.payMoney=this.MMoney(rateId,'1',timeLong);

            }else{
                this.vip_INFO.expTime=start?Mtime(start,timeLong,'2'):'';
                this.vip_INFO.payMoney=this.MMoney(rateId,'2',timeLong);
            }
        },
        // 转换时间字符串
        changeTimeStr(time){
           return time?this.Util.formatDate.format(time,'yy-MM-dd'):''
        },
      
        
/**
 * 功能:计算缴费金额
 * id:会员标准ID   
 * timeLong:时间长度 number
 * state:状态 0:天 1:月 2:年
 * */
    MMoney(id,state,timeLong){
        let price=this.getPrice(id,state)
        // console.log(state)
        return price*Number(timeLong)
    },
    // 查找标准价格
    getPrice(id,state){
        // console.log(state)

        let listRateSim=this.RateList;
        for(let i=0;i<listRateSim.length;i++){
            if(id==listRateSim[i].id){
                if(state==='0'){
                    return listRateSim[i].dayMoney;
                }else if(state==='1'){
                    return listRateSim[i].monthMoney;
                }else{
                    return listRateSim[i].yearMoney;
                }
            }
        }
        return 0;
    }

    }
}

/**
 * 功能:计算失效时间
 * startTime:起始时间   new Date()
 * timeLong:时间长度 number
 * state:状态 0:天 1:月 2:年
 * */ 
function  Mtime(startTime,timeLong,state){
    // console.log(startTime)
    // console.log(timeLong)
    let timeStamp=startTime.getTime();
    // let timeStamp=Date.parse(new Date(startTime));

    if(state=='0'){
        let dates=(timeLong-1)*24*3600*1000;
        return fmtDate(timeStamp+dates);    
        // d = (Number(d)+timeLong)-1
        // let tempStr = `${y}-${m}-${d}`
        // return   tempStr
    }else if(state=='1'){
        let y = 1900+startTime.getYear();
        let m = (startTime.getMonth()+1);

        let stamp=null;
        // for(let i=0;i<timeLong;i++){
        //     stamp += (mGetDate(y,m++)-1)*24*3600*1000;
        // }
        for(let i=0;i<timeLong;i++){
            stamp += (mGetDate(y,m++));
        }        
        return fmtDate(timeStamp+(stamp-1)*24*3600*1000);  
    }else{
        let y = 1900+startTime.getYear();
        // let dates=(timeLong*365)-1;
        let dates=0;

        for(let i=0;i<timeLong;i++){
            y = y+1
            if(isLeapYear(y)){
                dates += 366
            }else{
                dates += 365

            }
        }
        return fmtDate(timeStamp+((dates-1)*24*3600*1000));      
    }
    // return timeStamp+timeLong
}
// 日期转换
function fmtDate(obj){
    var date =  new Date(obj);
    var y = 1900+date.getYear();
    var M = "0"+(date.getMonth()+1);
    var d = "0"+date.getDate();
    var h = "0"+date.getHours();
    var m = "0"+date.getMinutes();
    return y+"-"+M.substring(M.length-2,M.length)+"-"+d.substring(d.length-2,d.length);
}

//获取当年月份的天数
function mGetDate(year, month){
    var d = new Date(year, month, 0);
    // console.log(`${year}:${month}:${d}`)
    return d.getDate();
}
//判断是否是润年
function isLeapYear(year) { 
     return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)
 }