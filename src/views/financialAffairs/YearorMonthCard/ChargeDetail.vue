
  <template>
    <section id="ch_detail">
        <div class="FA-warpper">
            <!--工具条-->
            <el-col :span="24" class="FA-toolbar " >
                <el-form :inline="true">
                    <el-form-item label="车牌号" >
                        <el-input v-model.trim="carNum" class="width-180" @keyup.enter.native ="getTableList(true)" placeholder="请输入查询关键字" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <span>开始时间：</span>
                        <el-date-picker type="datetime"  v-model="startTime" placeholder="请输入查询时间" :picker-options="pickerOptionsStart"></el-date-picker>
                        <span>结束时间：</span>
                        <el-date-picker type="datetime"  v-model="endTime" placeholder="请输入查询时间" :picker-options="pickerOptionsEnd"></el-date-picker>
                        <!--<el-date-picker type="datetimerange" @change="getTableList(true)" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="applyTime">-->
                        <!--</el-date-picker>-->
                    </el-form-item>
                    <el-form-item label="会员类型" >
                        <el-select v-model="memberRateId" class="width-150" placeholder="请选择会员类型" @change="find()" clearable>
                            <el-option label="全部类型" value=""></el-option>
                            <el-option v-for="item in monthCardList" :key="item.id" :label="item.memberType" :value="item.id">
                            </el-option>                             
                        </el-select>
                    </el-form-item>
                    <el-form-item label="缴费方式">
                        <el-select v-model="payType" class="width-150" placeholder="请选择缴费方式" @change="find()" clearable>
                            <el-option label="全部方式" value=""></el-option>
                            <el-option v-for="item in payTypeList" :key="item.id" :label="item.payTypeName" :value="item.payTypeName">
                            </el-option>                             
                        </el-select>
                        <el-button type="primary" @click="find()">查询</el-button>
                    </el-form-item>
                    <el-form-item label="总金额:" style="font-weight: bold;margin-left:5px">
                        <span style="font-size:16px">{{totalMoney}}</span>元
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="chargeSumVisible=true">收费统计信息</el-button>
                        <el-button type="primary" @click="exportOrderList()" >导出</el-button>
                    </el-form-item> 
                </el-form>
            </el-col>
            <!--列表-->
            <el-table :data="array" height="540" v-loading="listLoading" style="width: 100%;" >
                <el-table-column type="index" :index="indexMethod" label="序号" width="55">
                </el-table-column>
                <el-table-column prop="carNum" label="车牌号"  min-width="100" sortable align="center">
                </el-table-column>
                <el-table-column prop="owner" label="车主姓名"  min-width="100" sortable align="center">
                </el-table-column>
                <el-table-column prop="memberType" label="会员类型"  min-width="100" sortable align="center">
                </el-table-column>
                <el-table-column prop="operatorType" label="业务类型"  min-width="100"  show-overflow-tooltip sortable align="center">
                </el-table-column>
                <el-table-column prop="applyLen" label="办理时长"  min-width="100" sortable align="center">
                </el-table-column>
                <el-table-column prop="payMoney" label="缴纳金额(元)"  min-width="100" align="center">
                </el-table-column>
                <el-table-column prop="payType" label="缴纳方式"  min-width="100" sortable align="center">
                </el-table-column>
                <el-table-column prop="payTime" label="办理时间"  min-width="150" show-overflow-tooltip  sortable align="center">
                    <!-- <template slot-scope="scope">
                        <span>{{scope.row.payTime | transformTime}}</span>
                    </template>                      -->
                </el-table-column>
                <el-table-column prop="operatorName" label="管理员"  min-width="110" sortable align="center">
                </el-table-column>
                <el-table-column prop="startTime" label="生效时间"  min-width="150" show-overflow-tooltip sortable align="center">
                    <!-- <template slot-scope="scope">
                        <span>{{scope.row.card.startTime | transformTime2}}</span>
                    </template>                      -->
                </el-table-column>
                <el-table-column prop="stopTime" label="失效时间"  min-width="150" show-overflow-tooltip sortable　align="center">
                    <!-- <template slot-scope="scope">
                        <span>{{scope.row.card.stopTime | transformTime2}}</span>
                    </template>                      -->
                </el-table-column>
                <el-table-column prop="remark" label="备注"  min-width="100" show-overflow-tooltip align="center">
                </el-table-column>
            </el-table>
            <div class="elPag clearfix">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total" >
                </el-pagination>
                <el-button type="primary" class="PagGo">GO</el-button>
            </div>
        </div>

        <!--收费汇总  -->
        <el-dialog  title="收费信息汇总" :visible.sync="chargeSumVisible" @open="openChangeCountDialog">
            <div class="dialog-box">
                <el-table :data="changeCountArray"  style="width: 100%;" show-summary :summary-method="getSummaries">
                    <el-table-column prop="memberType" label="会员类型"  min-width="120" >
                    </el-table-column>
                    <!-- <el-table-column prop="managerCounts.count" label="操作次数"  min-width="420" >
                        <template slot-scope="scope">
                            <span v-for="item in scope.row.managerCounts" :key="item.manager">{{item.manager}}:{{item.count}}次,</span>
                        </template> 
                    </el-table-column> -->
                        <el-table-column v-for="(item,index)  in tableTitleList" :prop="item.prop" :label="item.label" :key="index">
                            <template  slot-scope="scope">
                                <span>{{scope.row.managerCounts[index].count}}</span>
                            </template> 
                        </el-table-column>
                    <el-table-column prop="countMoney" label="总金额(元)"  min-width="100" >
                    </el-table-column>                            
                </el-table>
            </div>
        </el-dialog> 
    </section>
</template>

<script>

    import { listMemberRateSim,changeList,changeCount,exportOrderList} from '@/api/api';
    export default {
        data() {
            return {
                carNum:'',
                startTime:new Date(new Date(new Date().toLocaleDateString()).getTime()),
                endTime:new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1),
                pickerOptionsStart: {
                    disabledDate: time => {
                        let endDateVal = this.endTime
                        if (endDateVal) {
                            return time.getTime() > new Date(endDateVal).getTime();
                        }
                    }
                },
                pickerOptionsEnd: {
                    disabledDate: time => {
                        let beginDateVal = this.startTime
                        if (beginDateVal) {
                            return (
                                time.getTime() < new Date(beginDateVal).getTime()
                            );
                        }
                    }
                },
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
            try {
                let menuNode = document.getElementsByClassName('menu-active')
                menuNode[0].classList.remove('menu-active')  
            } catch (error) {}            
            document.getElementById("menu-box-6").classList.add("menu-active")
        },
        methods: {
            // 导出excel文件
            exportOrderList(isGlobal){
                let params = {
                    operatorId:this.Util.userInfo.id,
                    applyLowTime:this.Util.formatDate.format(this.startTime,'yyyy-MM-dd hh:mm:ss'),
                    applyUpTime:this.Util.formatDate.format(this.endTime,'yyyy-MM-dd hh:mm:ss'),
                    carNum:this.carNum,
                    memberRateId:this.memberRateId,
                    payType:this.payType
                }
                this.$axios({
                    url:exportOrderList,
                    method: 'get',
                    params: params,
                    responseType: 'blob', //二进制流
                })
                    .then( (res) => {
                        // this.listLoading = false
                        // console.log(res)
                        if (res.headers.code === 'SUCCESS') {
                            this.Util.exportExcel(res)
                        }else{
                            this.$message.error(decodeURI(res.headers.msg))
                        }
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
            // // 业务类型
            // formatOperatorType(row, column) {
            //     console.log(row.operatorType)
            //     return row.operatorType == 0? '办理' : row.operatorType == 1 ? '续费' : row.operatorType == 2 ? '退还': '补交' ;
            // },

            // 自定义序号
            indexMethod(index){
                return index +this.pageSize*(this.currentPage-1)+1;
            },

            //模糊查询
            find(){
                let startTime = this.startTime
                let endTime = this.endTime;
                if(this.startTime===null ||this.endTime=== null){
                    this.$message({
                        message: '开始时间或结束时间不能为空',
                        type: 'warning'
                    });
                }else if(this.startTime && this.endTime){
                    if(startTime.getTime()<endTime.getTime()){
                        this.getTableList()
                    }else if(startTime.getTime()===endTime.getTime()){
                        this.getTableList()
                    }else{
                        this.$message({
                            message: '开始时间大于结束时间',
                            type: 'warning'
                        });
                    }
                }
            },

            // 获取table数据
            getTableList(isGlobal){
                let params = {
                    operatorId:this.Util.userInfo.id,
                    applyLowTime:this.Util.formatDate.format(this.startTime,'yyyy-MM-dd hh:mm:ss'),
                    applyUpTime:this.Util.formatDate.format(this.endTime,'yyyy-MM-dd hh:mm:ss'),
                    carNum:this.carNum,
                    memberRateId:this.memberRateId,
                    payType:this.payType,
                    current:this.currentPage-1,
                    length:this.pageSize,
                }
                if(isGlobal){
                    params.current = 0
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
                    applyLowTime:this.Util.formatDate.format(this.startTime,'yyyy-MM-dd hh:mm:ss'),
                    applyUpTime:this.Util.formatDate.format(this.endTime,'yyyy-MM-dd hh:mm:ss'),
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

</script>

<style lang="scss">
    #ch_detail{
        .el-form-item{
            margin-right:0;
        }
        .selput{
            width: 16%;
            .el-form-item__content{
                width: 65%;
                .el-select{
                    width: 100%;
                }
            }
            .el-input{
                width: 100%;
            }
        }
        .IptCarNum{
            .el-form-item__content{
                width: 72%;
            }
        }
        .handleTime{
            width: 33%;
            .el-form-item__content{
                width: 82%;
                .el-range-editor.el-input__inner{
                    width: 100%;
                    padding-right: 0;
                    .el-date-editor .el-range-input{
                        padding-left: 5px;
                        width: 40%;
                    }
                }
            }
        }
        .dialog-box{
            border-top: 1px solid $color-gray2;
            border-left: 1px solid $color-gray2;
            border-right: 1px solid $color-gray2;
        }        
    }
</style>

