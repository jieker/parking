<template>
   <section id="abnormal">
        <div class="FA-warpper">
            <!--工具条-->
            <el-col :span="24" class="FA-toolbar " >
                <el-form :inline="true" :model="filters">
                    <el-form-item label="起始时间" class="chargeTime" >
                        <el-date-picker type="datetime"  v-model="filters.stateTime"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" class="chargeTime" >
                        <el-date-picker type="datetime"  v-model="filters.endTime"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="异常车辆">
                        <el-select v-model="filters.condition" placeholder="选择查询条件" clearable>
                            <el-option label="无需收费记录" :value="1"></el-option>
                            <el-option label="无进场记录车辆" :value="0"></el-option>
                        </el-select>
                        <el-button type="primary" @click="find">查询</el-button>
                        <el-button type="primary" @click="find">导出</el-button>
                        <el-button type="primary" @click="Print">打印</el-button>
                        <el-checkbox v-model="filters.what">无任何优惠的</el-checkbox>

                    </el-form-item>
                </el-form>
            </el-col>
            <!--列表-->
            <el-table :data="array" highlight-current-row :header-cell-style="{'text-align':'center'}" v-loading="listLoading" style="width: 100%;">
                <!-- <el-table-column type="index" width="50" :index="indexMethod" label="序号">
                </el-table-column> -->
                <el-table-column prop="carNum" label="车牌号" min-width="100" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="timeY" label="进场时间" min-width="120"  sortable>
                </el-table-column>
                <el-table-column prop="timeN" label="出场时间"  min-width="120" sortable>
                </el-table-column>
                <el-table-column prop="name" label="用户类型"  show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="type" label="车辆类型" show-overflow-tooltip >
                </el-table-column>
                <el-table-column prop="howLong" label="电子优惠" min-width="100"  show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="howLong" label="纸质优惠"  min-width="100" show-overflow-tooltip >
                </el-table-column>
                <el-table-column prop="howLong" label="其他优惠"  min-width="100" show-overflow-tooltip >
                </el-table-column>
                <el-table-column prop="howLong" label="应收"  min-width="100" show-overflow-tooltip >
                </el-table-column>
                <el-table-column prop="howLong" label="实收"  min-width="100" show-overflow-tooltip >
                </el-table-column>
                <el-table-column prop="howLong" label="支付方式"  min-width="100" show-overflow-tooltip >
                </el-table-column>
                <el-table-column prop="Pack" label="备注"  min-width="100" show-overflow-tooltip >
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
        </div>
        <!--纸质优惠券使用情况汇总  -->
        <el-dialog  title="纸质优惠券使用情况汇总" :visible.sync="sumFormVisible">
            <el-row>
                <el-table :data="array" :header-cell-style="{'text-align':'center'}" highlight-current-row style="width: 100%;" border>
                    <el-table-column prop="cname" label="支付方式"  min-width="100" >
                    </el-table-column>
                    <el-table-column prop="howLong" label="应收"  min-width="100" >
                    </el-table-column>
                    <el-table-column prop="howLong" label="实收"  min-width="100" >
                    </el-table-column>
                    <el-table-column prop="howLong" label="电子优惠"  min-width="100" >
                    </el-table-column>
                    <el-table-column prop="howLong" label="纸质优惠"  min-width="100" >
                    </el-table-column>
                    <el-table-column prop="howLong" label="其他优惠"  min-width="100" >
                    </el-table-column>
                </el-table>
            </el-row>
        </el-dialog> 

    </section>
</template>
<script src="@/assets/js/dataAndSum/abnormalData.js"></script>
<style lang="scss">
    #abnormal{
        width: inherit;
        .chargeTime{
            width: 23%;
            .el-form-item__content{
                width: 70%;

            }
        }
        // .toolbar{
        //     .selControl{
        //         width: 10%;
        //     }
        //     .selQuery{
        //         width: 20%;
        //         .el-select{
        //             width: 40%;
        //             .el-input{
        //                 width: 100%;
        //             }
        //         }
        //         .el-input{
        //             width: 58%;
        //         }
        //     }
        // }
        // .InfoTop{
        //     margin-left: 0;
        //     text-align: center;
        //     section{
        //         display: inline-block;
        //         font-size: 18px;
        //         padding: 5px 10px;
        //         h5{
        //             display: inline-block;
        //             font-size: 16px;
        //             margin: 0;
        //         }
        //     }
        // }
    }
</style>
