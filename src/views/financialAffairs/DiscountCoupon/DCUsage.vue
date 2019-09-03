
  <template>
    <section id="dcUsage">
        <div class="FA-warpper">
            <!--工具条-->
            <el-col :span="24" class="FA-toolbar " >
                <el-form :inline="true" :model="filters">
                    <el-form-item label="使用日期">
                        <el-date-picker type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="filters.whatTime"></el-date-picker>
                    </el-form-item>
                    <el-form-item class="queryCarNum">
                        <el-select v-model="filters.condition" placeholder="选择查询条件" clearable>
                            <el-option label="订单号" :value="0"></el-option>
                            <el-option label="商家名称" :value="1"></el-option>
                            <el-option label="操作员" :value="2"></el-option>
                        </el-select>
                        <el-input v-model="filters.what" placeholder="请输入查询关键字" clearable></el-input>
                        <el-button type="primary" @click="find">查询</el-button>
                    </el-form-item>
                    <el-form-item class="Fright">
                        <el-button type="primary"  @click="summary">汇总</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <!--列表-->
            <el-table :data="array" :header-cell-style="{'text-align':'center'}" highlight-current-row v-loading="listLoading" style="width: 100%;">
                <el-table-column type="index" :index="indexMethod" label="序号" width="55">
                </el-table-column>
                <el-table-column prop="carNum" label="车牌号"  >
                </el-table-column>
                <el-table-column prop="type" label="订单号"  min-width="100">
                </el-table-column>
                <el-table-column prop="cname" label="发放商家"  min-width="100" >
                </el-table-column>
                <el-table-column prop="cname" label="优惠券名称"  min-width="120" >
                </el-table-column>
                <el-table-column prop="howLong" label="实际金额"  min-width="100" >
                </el-table-column>
                <el-table-column prop="timeY" label="使用时间"  min-width="120" >
                </el-table-column>
                <el-table-column prop="name" label="操作员"  min-width="100" >
                </el-table-column>
                <el-table-column prop="note" label="备注"  min-width="200" show-overflow-tooltip >
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
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
        </div>
        <!--纸质优惠券使用情况汇总  -->
        <el-dialog  title="纸质优惠券使用情况汇总" :visible.sync="DCVisible">
            <el-table :data="array" :header-cell-style="{'text-align':'center'}" highlight-current-row style="width: 100%;">
                <el-table-column prop="cname" label="优惠券名称"  min-width="120" >
                </el-table-column>
                <el-table-column prop="howLong" label="使用张数"  min-width="120" >
                </el-table-column>
                <el-table-column prop="howLong" label="实际金额(元)"  min-width="100" >
                </el-table-column>
            </el-table>
        </el-dialog> 
    </section>
</template>
<script src="@/assets/js/financialAffairs/DiscountCoupon/DCUsage.js"></script>
<style lang="scss">
    #dcUsage{
        .queryCarNum{
            .el-select{
                width: 40%;
                .el-input{
                    width: 100%;
                }
                margin-right: 10px;

            }
            .el-input{
                width: 40%;
                margin-right: 10px;

            }
        }
    }
</style>

