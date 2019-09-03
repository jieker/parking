<template>
    <div>
        <!-- 弹窗-系统日志 -->
        <el-dialog class="form-dialog" title="系统日志"  width="96%" :visible.sync="systemLogProp.visible" @open="getLogList"  @closed="closeDialog" :close-on-click-modal="false">
            <el-row class="content">
                <el-col :span="24" class="content-body">
                    <el-form :inline="true" >
                        <el-form-item label="操作员">
                            <el-input v-model.trim="operatorName"  placeholder="请输入查询关键字" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="操作时间">
                            <el-date-picker type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"  v-model="applyTime">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="getLogList(true)" size="small">查询</el-button>
                        </el-form-item>
                        <el-form-item label="重要性">
                            <el-select v-model="levelType" placeholder="选择查询条件" @change="getTableList(true)" clearable>
                                <el-option label="全部" value=""></el-option>
                                <el-option label="重要" value="1"></el-option>
                                <el-option label="普通" value="2"></el-option>
                                <el-option label="可关注" value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="exportWhitelist()" size="small">导出</el-button>
                        </el-form-item>
                    </el-form>
                    <div class="body-table" id="printTempCar">
                        <!--列表-->
                        <el-table :data="array"  sortable height="539" >
                            <el-table-column type="index"  min-width="80" align="center">
                            </el-table-column>
                            <el-table-column prop="operatorName" label="操作员" min-width="90" sortable align="center" >
                            </el-table-column>
                            <el-table-column prop="operateAddress" label="操作位置" min-width="80" sortable align="center">
                            </el-table-column>
                            <el-table-column prop="updateTime" label="操作时间" min-width="100" sortable align="center">
                            </el-table-column>
                            <el-table-column prop="level" label="操作重要性" min-width=120 sortable show-overflow-tooltip align="center">
                            </el-table-column>
                            <el-table-column prop="action" label="操作内容" min-width=120 sortable show-overflow-tooltip align="center">
                            </el-table-column>
                            <el-table-column prop="content" label="具体信息" min-width="80" sortable align="center">
                            </el-table-column>
                            <el-table-column prop="remark" label="备注" min-width=110 sortable show-overflow-tooltip align="center">
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="body-paging text-center elPag">
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
                </el-col>
            </el-row>
        </el-dialog>
    </div>

</template>

<script>
    import { mapGetters } from "vuex";
    import {getLogList} from '@/api/api' ;
    // import { export_json_to_excel } from '@/assets/js/excel/Export2Excel'

    export default {
        props: [ 'systemLogProp' ],
        data(){
            return {
                pageSize:10,
                dataTotal:0,
                currentPage:1,

                array:[],
                //表单数据
                carNum:'',
                levelType:'',
                applyTime:'',
                operatorName:''

            }
        },
        computed: {
            ...mapGetters({
                carTypeList: 'getCarTypeList',
            }),
        },
        methods:{
            // 导出excel文件
            exportWhitelist(){
                require.ensure([], () => {
                    const { export_json_to_excel } = require('@/assets/js/excel/Export2Excel')
                    const tHeader = ['操作员', '操作位置', '操作时间','操作重要性','操作内容','具体信息','备注']
                    const filterVal = ['operatorName', 'operateAddress', 'updateTime','level','action','content','remark']
                    const list = this.Util.deepCopy(this.array)

                    for (let i = 0; i < list.length; i++) {
                        //    转换车类型
                        if(list[i].level === '1'){
                            list[i].carType = '重要'
                        }else if(list[i].level === '2'){
                            list[i].carType = '普通'
                        }else{
                            list[i].carType = '可关注'
                        }
                    }
                    const data = this.Util.formatJson(filterVal, list)
                    // console.log(data)
                    let excelFileName = `系统日志${this.Util.formatDate.format(new Date(),'yyyy-MM-dd')}`

                    export_json_to_excel(tHeader, data, excelFileName)

                })
            },

            /**
             * 查询
             * @param {booleal} isGlobal 是否是全局搜索,true表示是,当前页要置为1
             */
            getLogList(isGlobal) {
                if(isGlobal){
                    this.currentPage = 1
                }

                let param = {
                    managerName:this.operatorName,
                    level: this.levelType,
                    current:this.currentPage-1,     //前端第一页为1,后端第一页为0
                    length:this.pageSize,
                }
                if(this.applyTime){
                    param.start = this.Util.formatDate.format(this.applyTime[0],'yyyy-MM-dd hh:mm:ss')
                    param.end = this.Util.formatDate.format(this.applyTime[1],'yyyy-MM-dd hh:mm:ss')
                }
                getLogList(param).then(data => {
                    this.listLoading = false
                    if (data.data.code === "SUCCESS") {
                        this.array = data.data.data.content
                        this.array.forEach(item =>{
                            if(item.level === 1){
                                item.level = '重要'
                            }else if(item.level === 2){
                                item.level = '普通'
                            }else{
                                item.level = '可关注'
                            }
                        })
                        this.dataTotal = data.data.data.totalElements

                    } else {
                        this.$message.error(data.data.msg)
                    }
                });
            },
            //页码改变
            handleSizeChange(val) {
                this.pageSize = val
                this.getLogList(false)
            },
            //页改变
            handleCurrentChange(val) {
                this.getLogList(false)
            },
            closeDialog(){
                this.$emit('listenCloseMainDialog') 									
            },             

        }
    }
</script>

<style lang="scss" scoped>

    .form-dialog{
        .content{
            background: $color-gray;
            border-radius:10px;
            .content-body{
                padding:10px 10px;
            }
        }
    }

</style>



