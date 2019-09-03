
  <template>
    <section id="handleRecord">
        <div class="FA-warpper">
            <!--工具条-->
            <el-col :span="24" class="FA-toolbar " >
                <el-form :inline="true" >
                    <el-form-item label="车牌号" class="queryCarNum">
                        <el-input v-model.trim="carNum" @keyup.enter.native ="getTableList(true)" placeholder="请输入查询关键字" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <span>开始时间：</span>
                        <el-date-picker type="datetime"  v-model="startTime" placeholder="请输入查询时间" :picker-options="pickerOptionsStart"></el-date-picker>
                        <span>结束时间：</span>
                        <el-date-picker type="datetime"  v-model="endTime" placeholder="请输入查询时间" :picker-options="pickerOptionsEnd"></el-date-picker>
                        <!--<el-date-picker type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="getTableList(true)" v-model="applyTime">-->
                        <!--</el-date-picker>-->
                    </el-form-item>
                    <el-form-item label="业务类型">
                        <el-select v-model="businessType" placeholder="选择查询条件" clearable>
                            <el-option label="全部业务" value=""></el-option>
                            <el-option label="月卡办理" value="办理"></el-option>
                            <el-option label="月卡续费" value="续费"></el-option>
                            <el-option label="月卡导入" value="导入"></el-option>
                            <el-option label="月卡修改" value="修改"></el-option>
                            <!--<el-option label="月卡挂起" value="挂起"></el-option>-->
                            <!--<el-option label="月卡恢复" value="恢复"></el-option>-->
                            <el-option label="月卡删除" value="删除"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="find()" >查询</el-button>
                        <!-- <el-button type="primary" @click="find">导入</el-button> -->
                        <el-button type="primary" @click="exportOperationList()">导出</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <!--列表-->
            <el-table :data="array" v-loading="listLoading" height="541" style="width: 100%;">
                <el-table-column type="index" label="序号" :index="indexMethod" min-width="120">
                </el-table-column>
                <el-table-column prop="carNum" label="车牌号" min-width="100"  sortable align="center">
                </el-table-column>
                <el-table-column prop="owner" label="车主姓名"  min-width="100" sortable align="center">
                </el-table-column>
                <el-table-column prop="memberType" label="会员类型"  min-width="100" sortable align="center">
                </el-table-column>
                <el-table-column prop="startTime" label="生效时间"  min-width="120" show-overflow-tooltip sortable align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.startTime | transformTime2}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="stopTime" label="失效时间"  min-width="120" show-overflow-tooltip sortable align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.stopTime | transformTime2}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="businessType" label="业务类型"  min-width="100" sortable align="center">
                </el-table-column>
                <el-table-column prop="createTime" label="办理时间"  min-width="120" show-overflow-tooltip sortable align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime | transformTime}}</span>
                    </template>                     
                </el-table-column>
                <el-table-column prop="operatorName" label="操作员"  min-width="100" sortable align="center">
                </el-table-column>
                <el-table-column prop="remark" label="备注"  min-width="260" show-overflow-tooltip align="center">
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
    </section>
</template>

<script>

    import { applyRecord,exportOperationList } from '@/api/api';
    export default {
        data() {
            return {
                carNum:'',
                businessType: '',
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
            try {
                let menuNode = document.getElementsByClassName('menu-active')
                menuNode[0].classList.remove('menu-active')  
            } catch (error) {}            
            document.getElementById("menu-box-6").classList.add("menu-active")
        },
        methods: {
            // 导出excel文件
            exportOperationList(isGlobal){
                let params = {
                    operatorId:this.Util.userInfo.id,
                    applyLowTime:this.Util.formatDate.format(this.startTime,'yyyy-MM-dd hh:mm:ss'),
                    applyUpTime:this.Util.formatDate.format(this.endTime,'yyyy-MM-dd hh:mm:ss'),
                    carNum:this.carNum,
                    businessType:this.businessType
                }
                this.$axios({
                    url:exportOperationList,
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
                    businessType:this.businessType,
                    current:this.currentPage-1,
                    length:this.pageSize,
                }
                if(isGlobal){
                    params.current = 0
                }
                // if(this.applyTime){
                //     params.applyLowTime = this.Util.formatDate.format(this.applyTime[0],'yyyy-MM-dd hh:mm:ss')
                //     params.applyUpTime = this.Util.formatDate.format(this.applyTime[1],'yyyy-MM-dd hh:mm:ss')
                // }
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

</script>


<style lang="scss">
    #handleRecord{
        .queryCarNum{
            .el-input{
                width: 75%;
            }
        }
    }
</style>

