<template>
    <el-row id="sumStopLong">
        <el-col :span="16" class="leftData">
            <div class="FA-warpper">
                <el-form :model="filters"  label-width="80px" ref="renewForm" class="clear sumTop">
                    <el-form-item label="起始时间">
                        <!-- <el-date-picker type="datetime" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="filters.whatTime"></el-date-picker> -->
                        <el-date-picker v-model="filters.statTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间">
                        <el-date-picker v-model="filters.endTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item class="keyBtn">
                        <el-button type="primary" @click.native="find" >查询</el-button>
                        <el-button type="primary" @click.native="find" >导入</el-button>
                        <el-button type="primary" @click.native="find" >导出</el-button>
                    </el-form-item>
                </el-form>
                <el-table :data="array" :header-cell-style="{'text-align':'center'}" show-summary highlight-current-row v-loading="listLoading"  style="width: 100%;margin-bottom:10px;">
                    <el-table-column prop="valid" label="时长" width="55">
                    </el-table-column> 
                    <el-table-column prop="howLong" label="车流量" >
                    </el-table-column> 
                    <el-table-column prop="howLong" label="纸质优惠(元)" >
                    </el-table-column> 
                    <el-table-column prop="howLong" label="其他优惠(元)" >
                    </el-table-column> 
                    <el-table-column prop="howLong" label="现金支付(元)" >
                    </el-table-column> 
                    <el-table-column prop="howLong" label="微信支付(元)" >
                    </el-table-column> 
                    <el-table-column prop="howLong" label="小猫支付(元)" >
                    </el-table-column> 
                    <el-table-column prop="howLong" label="实收(元)" >
                    </el-table-column> 
                    <el-table-column prop="howLong" label="应收(元)" >
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
        </el-col>
        <el-col :span="8">
            <div id="monthSumLine" class="chart" ></div>
            <div id="monthSumPie" class="chart" ></div>
        </el-col>
    </el-row>
</template>
<script src="@/assets/js/dataAndSum/sumStopLong.js"></script>
<style lang="scss">
    #sumStopLong{
        .leftData{
            padding:20px;
            .sumTop{
                .el-form-item{
                    display: inline-block;
                    width: 35%;
                    .el-date-editor.el-input, .el-date-editor.el-input__inner{
                        width: 100%;
                    }
                }
                .keyBtn{
                    width: 27%;
                    .el-form-item__content{
                        margin-left: 2px !important;
                        .el-button{
                            padding: 11px 15px;
                            margin-left: 5px;
                        }
                    }

                }
            }
        }
        .chart{
            width: 100%;
            height: 400px;
        }
    }
</style>
