
  <template>
    <section id="cancelCharge">
        <div class="FA-warpper">
            <!--工具条-->
            <el-col :span="24" class="FA-toolbar " >
                <el-form :inline="true" :model="filters">
                    <el-form-item  class="outTime">
                        <span>开始时间：</span>
                        <el-date-picker type="datetime"  v-model="filters.startTime" :picker-options="pickerOptionsStart"></el-date-picker>
                        <span>结束时间：</span>
                        <el-date-picker type="datetime"  v-model="filters.endTime" :picker-options="pickerOptionsEnd"></el-date-picker>
                        <!--<el-date-picker type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="filters.whatTime"></el-date-picker>-->
                    </el-form-item>
                    <el-form-item class="keyQuery">
                        <el-select v-model="filters.condition" placeholder="选择查询条件">
                            <el-option label="车牌号" value="carNum"></el-option>
                            <el-option label="管理员" value="operatorId"></el-option>
                        </el-select>
                        <el-input v-model="filters.what" placeholder="请输入查询关键字" clearable></el-input>
                    </el-form-item>
                    <el-form-item class="cancelTyle">
                    <el-select v-model="filters.operationType" placeholder="选择查询条件">
                    <el-option label="全部操作类型" value=""></el-option>
                    <el-option label="手动进场" value="5"></el-option>
                    <el-option label="手动出场" value="6"></el-option>
                    <el-option label="手动开闸" value="7"></el-option>
                    <el-option label="修改车牌" value="8"></el-option>
                    <el-option label="阻止进场" value="9"></el-option>
                    </el-select>
                    </el-form-item>
                    <el-button type="primary" @click="find" >查询</el-button>
                    <el-button type="primary" @click="exportAbnormalList" >导出</el-button>
                    <!--<el-form-item label="开始时间：">-->
                        <!--&lt;!&ndash;<span>开始时间：</span>&ndash;&gt;-->
                        <!--<el-date-picker type="datetime"  v-model="filters.startTime"></el-date-picker>-->
                        <!--&lt;!&ndash;<el-date-picker type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="filters.whatTime"></el-date-picker>&ndash;&gt;-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="结束时间：">-->
                        <!--<el-date-picker type="datetime"  v-model="filters.endTime"></el-date-picker>-->
                        <!--&lt;!&ndash;<el-date-picker type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="filters.whatTime"></el-date-picker>&ndash;&gt;-->
                    <!--</el-form-item>-->
                    <!--<el-form-item class="whatTyle">-->
                        <!--<el-select v-model="filters.condition" placeholder="选择查询条件">-->
                            <!--<el-option label="车牌号" value="carNum"></el-option>-->
                            <!--<el-option label="操作员" value="operatorId"></el-option>-->
                        <!--</el-select>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item class="nums">-->
                        <!--<el-input v-model="filters.what" placeholder="请输入车牌号" clearable></el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item>-->
                        <!--<el-select v-model="filters.operationType" placeholder="选择查询条件">-->
                            <!--<el-option label="全部操作类型" value=""></el-option>-->
                            <!--<el-option label="手动进场" value="5"></el-option>-->
                            <!--<el-option label="手动出场" value="6"></el-option>-->
                            <!--<el-option label="手动开闸" value="7"></el-option>-->
                            <!--<el-option label="修改车牌" value="8"></el-option>-->
                            <!--<el-option label="阻止进场" value="9"></el-option>-->
                        <!--</el-select>-->
                        <!--<el-button type="primary" @click="find" >查询</el-button>-->
                    <!--</el-form-item>-->
                </el-form>
            </el-col>
            <!--列表-->
            <el-table :data="array" highlight-current-row :header-cell-style="{'text-align':'center'}" v-loading="listLoading" style="width: 100%;">
                <!-- <el-table-column type="index" label="序号" :index="indexMethod" width="55">
                </el-table-column> -->
                <el-table-column prop="operatorName" label="操作员"  min-width="100"　align="center">
                </el-table-column>
                <el-table-column prop="operateAddress" label="操作处"  min-width="100" align="center">
                </el-table-column>
                <el-table-column prop="operateType" label="操作类型"  min-width="100" :formatter="formatType" align="center">
                </el-table-column>
                <el-table-column prop="entryFlag" label="进出场类型"  min-width="100" :formatter="entryType" align="center">
                </el-table-column>
                <el-table-column prop="originalCarNum" label="旧车牌号"  min-width="120" align="center">
                </el-table-column>
                <el-table-column prop="carNum" label="车牌号码"  min-width="120" align="center">
                </el-table-column>
                <el-table-column prop="createTime" label="操作时间"  min-width="120" show-overflow-tooltip sortable align="center">
                </el-table-column>
                <el-table-column prop="remark" label="备注"  min-width="150" show-overflow-tooltip  align="center">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <div @click="getPhoto(scope.row),dialogPhotoVisible = true">
                            <a href="javascript:;">进出场图</a>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="elPag clearfix">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 40, 80, 200]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total" >
                </el-pagination>
                <el-button type="primary" class="PagGo">GO</el-button>
            </div>

            <el-dialog
                    title="进出场图片"
                    :visible.sync="dialogPhotoVisible"
                    width="80%"
                    :close-on-click-modal="false"

            >
                　<div class="photoDialog">
                <div class="appearanceImg">
                    <img :src="this.inImagePath"/>
                </div>
            </div>
            </el-dialog>
        </div>
    </section>
</template>
<script>

    import { abnormalList,exportAbnormalList,ip } from '@/api/api';
    import notimg from "@/assets/img/notimg.png"
    export default {
        data() {
            return {
                dialogPhotoVisible:false,  //进出场图片
                inImagePath:'',
                outImagePath:'',
                totalMoney:'',   //总金额
                filters:{
                    startTime:new Date(new Date(new Date().toLocaleDateString()).getTime()),
                    endTime:new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1),
                    what:'',
                    condition:'carNum',
                    cancelType:'',
                    operationType:'',    //操作类型
                },
                pickerOptionsStart: {
                    disabledDate: time => {
                        let endDateVal = this.filters.endTime
                        if (endDateVal) {
                            return time.getTime() > new Date(endDateVal).getTime();
                        }
                    }
                },
                pickerOptionsEnd: {
                    disabledDate: time => {
                        let beginDateVal = this.filters.startTime
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
            this.getAbnormalList();
        },
        beforeUpdate(){
            try {
                let menuNode = document.getElementsByClassName('menu-active')
                menuNode[0].classList.remove('menu-active')  
            } catch (error) {}            
            document.getElementById("menu-box-7").classList.add("menu-active")				
        },         
        methods: {
            //获取图片
            getPhoto(row){
                this.inImagePath = row.imagePath;
                if(this.inImagePath){
                    this.inImagePath =  `http://${ip}/images/`+this.inImagePath
                }else{
                    this.inImagePath = notimg
                }
            },
            // 每页数据大小
            handleSizeChange(val) {
                this.pageSize =  val ;
                this.getAbnormalList();
            },
            // 当前页
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getAbnormalList();
            },
            // 操作类型
            formatType: function (row, column) {
                return row.operateType == 5? '手动进场' : row.operateType == 6 ? '手动出场' : row.operateType == 7 ? '手动开闸': row.operateType == 8 ? '修改车牌':row.operateType == 9 ? '阻止进场':'';
            },
            // 进出场类型
            entryType: function (row, column) {
                return row.entryFlag == 0? '出场' : row.entryFlag == 1 ? '进场':'';
            },
            // 自定义序号
            indexMethod(index){
                return index +this.pageSize*(this.currentPage-1)+1;
            },
            //模糊查询
            find(){
                let startTime = this.filters.startTime
                let endTime = this.filters.endTime;
                if(this.filters.startTime===null ||this.filters.endTime=== null){
                    this.$message({
                        message: '开始时间或结束时间不能为空',
                        type: 'warning'
                    });
                }else if(this.filters.startTime && this.filters.endTime){
                    if(startTime.getTime()<endTime.getTime()){
                        this.getAbnormalList()
                    }else if(startTime.getTime()===endTime.getTime()){
                        this.getAbnormalList()
                    }else{
                        this.$message({
                            message: '开始时间大于结束时间',
                            type: 'warning'
                        });
                    }
                }
            },
            // 导出table数据
            exportAbnormalList(){
                let condition = this.filters.condition;
                let conditionTime = this.filters.conditionTime;
                let what = this.filters.what;
                // let whatTime = this.filters.whatTime;
                // let checkList = this.filters.checkList;
                let obj = {};
                obj[condition] = what;
                let para = {
                    length:this.pageSize,
                    operateType:this.filters.operationType,
                    start : this.Util.formatDate.format(this.filters.startTime,'yyyy-MM-dd hh:mm:ss'),
                    end : this.Util.formatDate.format(this.filters.endTime,'yyyy-MM-dd hh:mm:ss'),
                }
                this.$axios({
                    url:exportAbnormalList,
                    method: 'get',
                    params: para,
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
            // 获取table数据
            getAbnormalList(isAgm){
                let condition = this.filters.condition;
                let conditionTime = this.filters.conditionTime;
                let what = this.filters.what;
                // let whatTime = this.filters.whatTime;
                // let checkList = this.filters.checkList;
                let obj = {};
                obj[condition] = what;
                let para = {
                    length:this.pageSize,
                    operateType:this.filters.operationType,
                    start : this.Util.formatDate.format(this.filters.startTime,'yyyy-MM-dd hh:mm:ss'),
                    end : this.Util.formatDate.format(this.filters.endTime,'yyyy-MM-dd hh:mm:ss'),
                }
                if(isAgm){
                    para.current=0
                }else{
                    para.current=this.currentPage-1
                }
                let params=Object.assign(para,obj)
                abnormalList(params).then(res=>{
                    this.array = res.data.data.content;
                    this.total = res.data.data.totalElements
                    // console.log(res)
                }).catch(err=>{
                    console.log(err)
                })
            },
        },
    }

</script>
<style lang="scss" scoped>
    #cancelCharge{
        .photoDialog{
            display:flex;
            .approachImg{
                width: 50%;
                height: 700px;
            }
            .appearanceImg{
                width: 50%;
                height: 700px;
                img{
                    width: 100%;
                    height: 500px;
                }
            }
        }
        .outTime{
            width: 600px;
            /*.el-form-item__content{*/
            /*width: 82%;*/
            /*.el-input__inner{*/
            /*width: 100%;*/
            /*}*/
            /*}*/
        }
        .keyQuery{
            width: 25%;
            .el-select{
                width: 25%;
            .el-input{
                width: 100%;
            }
            }
            .el-input{
                width: 45%;
            }
        }
        .cancelTyle{
            width: 15%;
            .el-form-item__content{
                width: 69%;
            }
        }
        /*.inquireTime{*/
            /*width: 620px;*/
            /*!*.el-form-item__content{*!*/
                /*!*width: 610px;*!*/
            /*!*}*!*/
        /*}*/
        /*.whatTyle{*/
            /*width: 18%;*/
            /*.el-form-item__content{*/
                /*width: 69%;*/
            /*}*/

        /*}*/
        /*.nums{*/
            /*width: 8%;*/
            /*.el-form-item__content{*/
                /*width: 69%;*/
            /*}*/
        /*}*/
    }
</style>

