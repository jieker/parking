<template>
    <el-dialog  title="费用变更" :visible.sync="ChartFormVisible.visible" width="79%">
     <div id="charts">
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
            <el-tab-pane label="收入统计" name="first" >
                <div class="sel">
                    <el-select v-model="selYear" placeholder="选择查询条件" @change="selHandleClick('first')">
                        <el-option label="2018年" :value="2018"></el-option>
                        <el-option label="2017年" :value="2017"></el-option>
                        <el-option label="2016年" :value="2016"></el-option>
                        <el-option label="2015年" :value="2015"></el-option>
                        <el-option label="2014年" :value="2014"></el-option>
                    </el-select>
                    <el-select v-model="selMonth" placeholder="选择查询条件" @change="selHandleClick('first')">
                        <el-option label="一月" :value="1"></el-option>
                        <el-option label="二月" :value="2"></el-option>
                        <el-option label="三月" :value="3"></el-option>
                        <el-option label="四月" :value="4"></el-option>
                        <el-option label="五月" :value="5"></el-option>
                    </el-select>
                </div>
                <div id="chartMonth" class="chartBar"></div>
                <div id="chartDay" class="chartBar" ></div>
            </el-tab-pane>
            <el-tab-pane label="支付方式统计" name="second">
                <div class="sel">
                    <el-select v-model="selYear" placeholder="选择查询条件" @change="selHandleClick('second')">
                        <el-option label="2018年" :value="2018"></el-option>
                        <el-option label="2017年" :value="2017"></el-option>
                        <el-option label="2016年" :value="2016"></el-option>
                        <el-option label="2015年" :value="2015"></el-option>
                        <el-option label="2014年" :value="2014"></el-option>
                    </el-select>
                    <el-select v-model="selMonth" placeholder="选择查询条件" @change="selHandleClick('second')">
                        <el-option label="一月" :value="1"></el-option>
                        <el-option label="二月" :value="2"></el-option>
                        <el-option label="三月" :value="3"></el-option>
                        <el-option label="四月" :value="4"></el-option>
                        <el-option label="五月" :value="5"></el-option>
                    </el-select>
                </div>
                <div id="yearPay"  class="chartBar" ></div>
                <div id="monthPay"  class="chartBar"></div>
            </el-tab-pane>
            <el-tab-pane label="收费处操作员收费统计" name="third">
                <div class="sel">
                    <el-select v-model="selYear" placeholder="选择查询条件" @change="selHandleClick('third')">
                        <el-option label="2018年" :value="2018"></el-option>
                        <el-option label="2017年" :value="2017"></el-option>
                        <el-option label="2016年" :value="2016"></el-option>
                        <el-option label="2015年" :value="2015"></el-option>
                        <el-option label="2014年" :value="2014"></el-option>
                    </el-select>
                    <el-select v-model="selMonth" placeholder="选择查询条件" @change="selHandleClick('third')">
                        <el-option label="一月" :value="1"></el-option>
                        <el-option label="二月" :value="2"></el-option>
                        <el-option label="三月" :value="3"></el-option>
                        <el-option label="四月" :value="4"></el-option>
                        <el-option label="五月" :value="5"></el-option>
                    </el-select>
                </div>
                <div id="proChargeYear" class="chartBar" ></div>
                <div id="proChargeMonth" class="chartBar"></div>
            </el-tab-pane>
            <el-tab-pane label="收费处收费情况统计" name="fourth">
                <div class="sel">
                    <el-select v-model="selYear" placeholder="选择查询条件" @change="selHandleClick('fourth')">
                        <el-option label="2018年" :value="2018"></el-option>
                        <el-option label="2017年" :value="2017"></el-option>
                        <el-option label="2016年" :value="2016"></el-option>
                        <el-option label="2015年" :value="2015"></el-option>
                        <el-option label="2014年" :value="2014"></el-option>
                    </el-select>
                    <el-select v-model="selMonth" placeholder="选择查询条件" @change="selHandleClick('fourth')">
                        <el-option label="一月" :value="1"></el-option>
                        <el-option label="二月" :value="2"></el-option>
                        <el-option label="三月" :value="3"></el-option>
                        <el-option label="四月" :value="4"></el-option>
                        <el-option label="五月" :value="5"></el-option>
                    </el-select>
                </div>
                <div id="ChargeYear" class="chartBar" ></div>
                <div id="ChargeMonth" class="chartBar"></div>
            </el-tab-pane>
            <el-tab-pane label="历年收入统计" name="five">
                <div class="sel">
                    <span>选择年份</span>
                    <el-select v-model="selYearStart" placeholder="选择查询条件" @change="yearIncome">
                        <el-option label="2018年" :value="2018"></el-option>
                        <el-option label="2017年" :value="2017"></el-option>
                        <el-option label="2016年" :value="2016"></el-option>
                        <el-option label="2015年" :value="2015"></el-option>
                        <el-option label="2014年" :value="2014"></el-option>
                    </el-select>
                    <span>--</span>
                    <el-select v-model="selYearEnd" placeholder="选择查询条件" @change="yearIncome">
                        <el-option label="2018年" :value="2018"></el-option>
                        <el-option label="2017年" :value="2017"></el-option>
                        <el-option label="2016年" :value="2016"></el-option>
                        <el-option label="2015年" :value="2015"></el-option>
                        <el-option label="2014年" :value="2014"></el-option>
                    </el-select>
                </div>
                <div id="Years" class="chartBar" ></div>

            </el-tab-pane>
        </el-tabs>
        <!-- <div class="tabs">
            <ul class="clear">
                <li @click="activeName=0">收入统计</li>
                <li @click="activeName=1">支付方式统计</li>
                <li @click="activeName=2" >收费处操作员收费统计</li>
                <li @click="activeName=3">收费处收费情况统计</li>
                <li @click="activeName=4">历年收入统计</li>
            </ul>
            <div class="tabs-content">
                <div class="sel">
                    <el-select v-model="selYear" placeholder="选择查询条件" clearable>
                        <el-option label="2018" :value="2018"></el-option>
                        <el-option label="2017" :value="2017"></el-option>
                        <el-option label="2016" :value="2016"></el-option>
                        <el-option label="2015" :value="2015"></el-option>
                        <el-option label="2014" :value="2014"></el-option>
                    </el-select>
                    <el-select v-model="selMonth" placeholder="选择查询条件" clearable>
                        <el-option label="一月" :value="1"></el-option>
                        <el-option label="二月" :value="2"></el-option>
                        <el-option label="三月" :value="3"></el-option>
                        <el-option label="四月" :value="4"></el-option>
                        <el-option label="五月" :value="5"></el-option>
                    </el-select>
                </div>
                <div v-if="activeName==0" id="chartDay" class="chartBar" ></div>
                <div v-if="activeName==0" id="chartMonth" class="chartBar"></div>
                <div v-if="activeName==1" id="yearPay" class="chartBar" ></div>
                <div v-if="activeName==1" id="monthPay" class="chartBar"></div>
                <div v-if="activeName==2" id="proChargeYear" class="chartBar" ></div>
                <div v-if="activeName==2" id="proChargeMonth" class="chartBar"></div>

            </div>
        </div> -->
    </div>
    </el-dialog>
</template>
<script src="@/assets/js/financialAffairs/IncomeStatistics/chartFigure.js"></script>

<style lang="scss">
    #charts{
        background-color: white;
        padding: 20px;
        .chartBar{
            height:500px;
            // width: 620px;
            width: 45%;
            display: inline-block;
        }
        .sel{
            padding-bottom: 20px;
            padding-left: 20px;
        }
        // .tabs{
        //     width: 100%;
        //     ul{
        //         width: inherit;
        //         li{
        //             float: left;
        //             padding: 10px;
        //             // width: 32%;
        //             text-align: center;
        //             border: 1px solid #ccc;
        //             margin-left: -1px;
        //             position: relative;
        //         }
        //     }
        //     .tabs-content{
        //         width: inherit;
        //         .sel{
        //             padding: 20px;
        //         }

        //     }
        // }
    }
</style>
