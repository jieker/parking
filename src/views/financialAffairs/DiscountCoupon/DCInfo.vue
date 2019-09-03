
  <template>
    <section id="dcInfo">
        <div class="FA-warpper">
            <!--工具条-->
            <el-col :span="24" class="FA-toolbar " >
                <el-form :inline="true" :model="filters">
                    <el-form-item label="新增日期">
                        <el-date-picker type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="filters.whatTime"></el-date-picker>
                    </el-form-item>
                    <el-form-item class="queryCarNum">
                        <el-select v-model="filters.condition" placeholder="选择查询条件" clearable>
                            <el-option label="商家名称" value="cName"></el-option>
                            <el-option label="操作员" value="UserName"></el-option>
                        </el-select>
                        <el-input v-model="filters.what" placeholder="请输入查询关键字" clearable></el-input>
                        <el-button type="primary" @click="find">查询</el-button>
                    </el-form-item>
                    <el-form-item class="Fright">
                        <el-button type="primary" @click="addDC">新增</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <!--列表-->
            <el-table :data="array"  :header-cell-style="{'text-align':'center'}" highlight-current-row v-loading="listLoading" style="width: 100%;">
                <el-table-column type="index" :index="indexMethod" label="序号" width="55" align='center'>
                </el-table-column>
                <el-table-column prop="carNum" label="优惠券名称" align='center' >
                </el-table-column>
                <el-table-column prop="type" label="优惠券类型" align='center' min-width="100" :formatter="formatType">
                </el-table-column>
                <el-table-column prop="cname" label="发放商家" align='center' min-width="100" >
                </el-table-column>
                <el-table-column prop="name" label="操作员" align='center' min-width="100" >
                </el-table-column>
                <el-table-column prop="timeH" label="新增时间" align='center' min-width="120" show-overflow-tooltip sortable>
                </el-table-column>
                <el-table-column prop="note" label="备注" align='center' min-width="100" show-overflow-tooltip >
                </el-table-column>
                <el-table-column label="操作" min-width="120" align='center'>
                    <template slot-scope="scope">
                        <el-button type="primary" @click="DCEdit(scope.$index,scope.row)">修改</el-button>
                        <!-- <el-button type="primary" @click="DCEdit(scope.$index,scope.row)">修改</el-button> -->
                        <el-button type="primary" @click="DCDelete(scope.$index,scope.row)">删除</el-button>
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
        <!--添加纸质优惠券  -->
        <el-dialog  title="添加纸质优惠券" :visible.sync="DCVisible">
            <el-form class="clearfix" :model="CostStn" label-width="100px"  ref="DCForm">
                <el-col :span="20">
                    <div class="grid-content bg-purple">
                        <el-form-item label="发放商家" class="carNumber" prop="idCard">
                             <el-input v-model="CostStn.cname"></el-input>
                        </el-form-item>
                        <el-form-item label="优惠类型">
                           <el-select v-model="CostStn.Area">
                                <el-option label="减免金额" :value="0"></el-option>
                                <el-option label="免费时长" :value="1"></el-option>
                                <el-option label="金额全免" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="优惠金额" >
                            <el-input  v-model="CostStn.money"></el-input>
                            <span>元</span>
                        </el-form-item>
                        <el-form-item label="备      注" >
                            <el-input type="textarea" v-model="CostStn.remark" style="width:82%"></el-input>
                        </el-form-item>
                    </div>
                </el-col>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="DCSubmit" :loading="DCLoading">提交</el-button>
                <el-button @click.native="DCVisible = false">取消</el-button>
            </div>
        </el-dialog> 

    </section>
</template>
<script src="@/assets/js/financialAffairs/DiscountCoupon/DCInfo.js"></script>
<style lang="scss">
    #dcInfo{
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

