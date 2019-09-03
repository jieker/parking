
<template>
    <section id="ch_stand">
        <div class="FA-warpper">
            <!--工具条-->
            <el-col :span="24" class="FA-toolbar " >
                <el-button class="Fright" type="primary" style="margin-bottom:10px" @click="addCsotStn" v-if="markChargeStandardAdd">添加</el-button>
                <el-button class="Fright" type="primary" style="margin-bottom:10px;margin-right:10px;" @click="getTableList">刷新</el-button>
            </el-col>
            <!--列表 :span-method="arraySpanMethod"-->
            <el-table :data="array"  :header-cell-style="tbHeader" highlight-current-row  v-loading="listLoading" height="539" style="width: 100%;">
                <el-table-column type="index" :index="indexMethod" label="序号" width="55">
                </el-table-column>
                <el-table-column prop="memberType" label="会员类型"  min-width="100">
                </el-table-column>
                <el-table-column  label="收费标准"  >
                    <el-table-column prop="dayMoney" label="元/天" width="100" align='center'>
                    </el-table-column>
                    <el-table-column prop="monthMoney" label="元/月" width="100" align='center'>
                    </el-table-column>
                    <el-table-column prop="yearMoney" label="元/年" width="100" align='center'>
                    </el-table-column>
                </el-table-column>
                <el-table-column prop="cloudPayFlag" label="允许云端续费"  min-width="110" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.cloudPayFlag | transformBoolean}}</span>
                    </template>
                </el-table-column>
                <!--<el-table-column prop="timeLimitFlag" label="是否限时"  min-width="100" align="center">-->
                    <!--<template slot-scope="scope">-->
                        <!--<span>{{scope.row.timeLimitFlag | transformBoolean}}</span>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column  label="限时时段"  >-->
                    <!--<el-table-column prop="startTime" label="起始时间" width="100" align='center'>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column prop="endTime" label="结束时间" width="100" align='center'>-->
                    <!--</el-table-column>-->
                <!--</el-table-column>-->
                <el-table-column prop="createTime" label="添加时间"  min-width="150" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime | transformTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="regionInfos" label="有效区域"  min-width="110"  :formatter="formatRegion" align="center">
                </el-table-column>
                <el-table-column prop="remark" label="备注"  min-width="100" show-overflow-tooltip >
                </el-table-column>
                <el-table-column label="操作" min-width="110"  fixed="right" align="center">
                    <template slot-scope="scope">
                        <a href="javaScript:;" class="text-blue" @click="editCostStn(scope.$index,scope.row)" v-if="markChargeStandardUpdate"><i class="el-icon-edit"></i>修改&nbsp&nbsp</a>
                        <a href="javaScript:;" class="text-danger" @click="handleDelete(scope.$index,scope.row)" v-if="markChargeStandardDelete"><i class="el-icon-delete"></i>删除</a>
                    </template>
                </el-table-column>
            </el-table>
            <div class="elPag clearfix">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="pageSize"
                        layout="total,sizes,prev, pager, next, jumper"
                        :total="dataTotal">
                </el-pagination>
                <el-button type="primary" class="PagGo">GO</el-button>
            </div>
        </div>
        <!--添加收费标准  -->
        <el-dialog  :title="costStnTitle" :visible.sync="costStnVisible" @open="Charges()">
            <el-form class="clearfix" :model="CostStn" label-width="100px" :rules="addCostStnFormRules" ref="CostStnForm">
                <el-col :span="20">
                    <div >
                        <el-form-item label="会员类型"  prop="memberType" >
                            <el-input v-model="CostStn.memberType" class="width-200" placeholder="请输入会员类型名称" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="收费单位" >
                            <el-select v-model="CostStn.chargeStandardUnit" class="width-200">
                                <el-option label="天" value="天"></el-option>
                                <el-option label="月" value="月"></el-option>
                                <el-option label="年" value="年"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="收费标准" prop="chargeStandardNum" >
                            <el-input-number v-model="CostStn.chargeStandardNum" class="width-200" :precision="2" :step="10" :min="0" :max="99999" @change="Charges"></el-input-number>
                        </el-form-item>
                        <el-form-item label="有效区域" prop="regionArr" style="margin-bottom:15px;">
                            <el-checkbox-group v-model="CostStn.regionArr"  >
                                <el-checkbox v-for="item in regionArray" :label="item.regionName" :key="item.id" name="regionArr"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="备      注" class="remarkContent">
                            <el-input v-model="CostStn.remark" clearable></el-input>
                            <div>
                                <el-checkbox v-model="CostStn.cloudPayFlag" :disabled="cloudCharge">是否允许云端续费</el-checkbox>
                                <!--<el-checkbox v-model="CostStn.cloudPayFlag" v-else>是否允许云端续费</el-checkbox>-->
                            </div>
                            <!--<div class="isLimit">-->
                                <!--<el-checkbox v-model="CostStn.timeLimitFlag">-->
                                    <!--<span>是否限时</span>-->

                                    <!--<div class="checkTime" v-show="CostStn.timeLimitFlag">-->
                                        <!--<el-time-picker is-range format="HH:mm" v-model="CostStn.rangeDateValue" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">-->
                                        <!--</el-time-picker>-->
                                    <!--</div>-->
                                <!--</el-checkbox>-->
                                <!--<span v-show="CostStn.timeLimitFlag" class="prompt">提示：开启后，此月卡车辆在时间段外时间停车按照临时停车计费</span>-->
                            <!--</div>-->
                        </el-form-item>
                    </div>
                </el-col>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="CostStnSubmit" :loading="addCostStnLoading">提交</el-button>
                <el-button @click.native="costStnVisible = false">取消</el-button>
            </div>
        </el-dialog>

    </section>
</template>
<script >
    import {listMemberRate,addMemberRate,updateMemberRate,deleteMemberRate,getRegionAllSimpleInfo } from '@/api/api';
    export default {
        data() {
            return {
                //权限按钮控制
                markChargeStandardAdd:false,
                markChargeStandardUpdate:false,
                markChargeStandardDelete:false,

                cloudCharge:'',
                listLoading: false,
                pageSize:10,
                dataTotal:0,
                currentPage:1,
                CostStn:{
                    cloudPayFlag:true,
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
            this.markChargeStandardAdd = this.Util.isPermission('markChargeStandardAdd');
            this.markChargeStandardUpdate = this.Util.isPermission('markChargeStandardUpdate');
            this.markChargeStandardDelete = this.Util.isPermission('markChargeStandardDelete');
        },
        beforeUpdate(){
            try {
                let menuNode = document.getElementsByClassName('menu-active')
                menuNode[0].classList.remove('menu-active')  
            } catch (error) {}            
            document.getElementById("menu-box-6").classList.add("menu-active")
        },
        methods: {
            Charges(){
                if(this.CostStn.chargeStandardNum ===0){
                    this.cloudCharge = "disabled"
                    this.CostStn.cloudPayFlag = false
                }else{
                    this.cloudCharge = false
                    this.CostStn.cloudPayFlag = true
                }
            },
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
                let regionNameStr = ''
                let ragionInfoArray = row.regionInfos
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
                return index + this.pageSize*(this.currentPage-1)+1;
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
            //获取区域名称
            regionNames(regionNameArray){
                let regionName='';
                console.log(this.regionArray)

                for(let i=0;i<regionNameArray.length;i++){
                    for(let j in this.regionArray){
                        if(regionNameArray[i]==this.regionArray[j].regionName){
                            regionName+=this.regionArray[j].regionName+','
                        }
                    }
                }
                return regionName.substring(0,regionName.length-1)
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
                let startTime='',endTime='',regionId='',regionName='';
                let regionArr=this.CostStn.regionArr;
                let isCommitted = false;//表单是否已经提交标识，默认为false

                this.$refs.CostStnForm.validate((valid) => {
                    if(isCommitted===false){
                        if (valid) {
                            if(this.CostStn.timeLimitFlag){
                                startTime=this.Util.formatDate.format(this.CostStn.rangeDateValue[0],'hh:mm')
                                endTime=this.Util.formatDate.format(this.CostStn.rangeDateValue[1],'hh:mm')
                            }
                            if(regionArr.length){
                                regionId=this.regionChange(regionArr);
                                regionName=this.regionNames(regionArr);
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
                                regionNames:regionName,
                                remark:this.CostStn.remark,
                                cloudPayFlag:this.CostStn.cloudPayFlag,
                                timeLimitFlag:this.CostStn.timeLimitFlag,
                                startTime:startTime,
                                endTime:endTime
                            };
                            // console.log(params);
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
                                        isCommitted = true;//提交表单后，将表单是否已经提交标识设置为true
                                        return true;//返回true让表单正常提交
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
                    }else {
                        return false;//返回false那么表单将不提交
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
                        // operatorId:this.Util.userInfo.id,
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
</script>
<style lang="scss">
    #ch_stand{
    .el-table thead.is-group th{
        padding: 0;
    }
    .remarkContent{
    .isLimit{
        height: 80px;
    .prompt{
        color: red;
        font-size: 16px;
        display:block;
    }
    }
    }
    .checkTime{
        display: inline-block;
    .el-input{
        width: 45px;
    .el-input__inner{
        padding: 0;
        text-align: center;
    }
    }

    }
    }
</style>

