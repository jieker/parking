<template>
    <el-row id="SumAbnormalMonth">
        <el-col :span="15" class="leftData">
            <div class="FA-warpper">
                <el-form :model="SumTop"  label-width="80px" ref="renewForm" class="clear sumTop">
                    <el-form-item label="操作处" class="slotSelect">
                        <el-select v-model="SumTop.slot" placeholder="请选择续费单位">
                            <el-option label="全部" :value="3"></el-option>
                            <el-option label="监控中心" :value="0"></el-option>
                            <el-option label="收费中心" :value="1"></el-option>
                            <el-option label="岗亭01" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="统计月份" class="IptQuery">
                        <el-input v-model="SumTop.year" placeholder="请输入查询关键字" clearable></el-input>
                        <span class="sp">年</span>
                        <el-input v-model="SumTop.month" placeholder="请输入查询关键字" clearable></el-input>
                        <span class="sp">月</span>
                        <el-button type="primary" @click.native="find" >查询</el-button>
                        <el-button type="primary" @click.native="find" >导出</el-button>
                        <el-button type="primary" @click.native="find" >打印</el-button>
                    </el-form-item>
                </el-form>
                <el-table :data="array" :header-cell-style="{'text-align':'center'}" show-summary highlight-current-row v-loading="listLoading"  style="width: 90%;margin-bottom:10px;">
                    <el-table-column prop="valid" label="日期" width="50">
                    </el-table-column> 
                    <el-table-column prop="howLong" label="进场异常" >
                    </el-table-column> 
                    <el-table-column prop="howLong" label="出场异常" >
                    </el-table-column> 
                    <el-table-column prop="howLong" label="手动开闸" >
                    </el-table-column> 
                    <el-table-column prop="howLong" label="手动进场" >
                    </el-table-column> 
                    <el-table-column prop="howLong" label="手动出场" >
                    </el-table-column> 
                    <el-table-column prop="howLong" label="修改车牌" >
                    </el-table-column> 
                </el-table>
                <!-- <div class="elPag clearfix">
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
                </div> -->
            </div>
        </el-col>
        <el-col :span="9">
            <div id="monthSumLine" class="chart" ></div>
            <!-- <div id="monthSumPie" class="chart" ></div> -->
        </el-col>
    </el-row>
</template>
<script src="@/assets/js/dataAndSum/sumAbnormalMonth.js"></script>
<style lang="scss">
    #SumAbnormalMonth{
        .leftData{
            padding:20px;
            .sumTop{
                .el-form-item{
                    display: inline-block;
                }
                .slotSelect{
                    width: 200px;
                }
                .IptQuery{
                    width: 600px;
                    .el-input{
                        width: 20%;
                    }
                    .sp{
                        padding:0 5px;
                    }
                }
                // .el-select{
                //     width: 20%;
                // }
            }
        }
        .chart{
            width: 100%;
            height: 420px;
            margin-top: 90px;
        }
    }
</style>
