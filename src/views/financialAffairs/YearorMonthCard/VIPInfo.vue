
  <template>
    <section id="vipInfo">
        <div class="FA-warpper">
            <!--工具条-->
            <el-col :span="24" class="FA-toolbar ">
                <el-form :inline="true" :model="filters">
                    <el-form-item class="selControlTime">
                        <el-select v-model="filters.conditionTime" placeholder="选择查询条件">
                            <el-option label="有效期限" value="valid_time"></el-option>
                            <el-option label="办理时间" value="handle_time"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item >
                        <span>开始时间：</span>
                        <el-date-picker type="datetime"  v-model="filters.startTime" placeholder="请输入查询时间" :picker-options="pickerOptionsStart"></el-date-picker>
                        <span>结束时间：</span>
                        <el-date-picker type="datetime"  v-model="filters.endTime" placeholder="请输入查询时间" :picker-options="pickerOptionsEnd"></el-date-picker>
                        <!--<el-date-picker v-model="filters.whatTime" type="daterange" @change="getVipList(true)" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" >-->
                        <!--</el-date-picker>-->
                    </el-form-item>
                    <el-form-item class="selControl">
                        <el-select v-model="filters.condition" placeholder="选择查询条件">
                            <el-option label="按车牌号查询" value="carNum"></el-option>
                            <el-option label="按车主姓名查询" value="owner"></el-option>
                            <el-option label="按公司名称查询" value="company"></el-option>
                            <el-option label="按手机号查询" value="phoneNum"></el-option>
                            <el-option label="按管理员查询" value="operatorName"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="selCondition">
                        <el-input v-model="filters.what" placeholder="请输入查询关键字" @keyup.enter.native ="getVipList(true)" clearable></el-input>
                    </el-form-item>
                    <el-button type="primary" @click="find()" style="margin-right:10px" v-if="markVIPInfoQuery">查询</el-button>

                    <el-form-item class="selCheckbox">
                            <el-checkbox  v-model="filters.containExpire" @change="getVipList(true)">包含失效卡</el-checkbox>
                            <el-checkbox v-model="filters.showOtherPark" @change="getVipList(true)" >只看本停车场</el-checkbox>
                   </el-form-item>
                    <el-form-item class="text-right">
                        <el-button type="primary" @click="excelImportShow=true" v-if="markVIPInfoImport">导入</el-button>
                        <el-button type="primary" @click="exportVIPList" v-if="markVIPInfoExport">导出</el-button>
                        <!-- <el-button type="primary" v-print="'#printVIPInfo'" >打印</el-button> -->
                        <el-button type="primary" @click="openMemberChart" class="define-btn">查看统计图</el-button>
                        <el-button type="primary" @click="handleIVP" class="define-btn" v-if="markVIPInfoAdd">办理会员</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <div  id="printVIPInfo">
                <!--列表-->
                <el-table :data="array" highlight-current-row　@selection-change="getTickedData"  v-loading="listLoading" :header-cell-style="{'text-align':'center'}" :cell-style="styleSpecial" height="540"  style="width: 100%;" :row-class-name="tableRowClassName">
                    <el-table-column type="selection" width="30">
                    </el-table-column>
                    <el-table-column type="index" :index="indexMethod" label="序号" width="50" fixed>
                    </el-table-column>
                    <el-table-column prop="carNum" label="车牌号"  min-width="100" align="center">
                    </el-table-column>
                    <el-table-column prop="startTime" label="生效时间" min-width="120" align="center" show-overflow-tooltip sortable >
                            <template slot-scope="scope">
                                <span>{{scope.row.startTime | transformTime2}}</span>
                            </template>
                    </el-table-column>
                    <el-table-column prop="stopTime" label="失效时间"  min-width="120" align="center" show-overflow-tooltip sortable >
                            <template slot-scope="scope">
                                <span>{{scope.row.stopTime | transformTime2}}</span>
                            </template>
                    </el-table-column>
                    <el-table-column prop="memberType" label="会员类型"  min-width="100" align="center" >
                    </el-table-column>
                    <el-table-column prop="createTime" label="办理时间"  min-width="150" show-overflow-tooltip  sortable align="center">
                            <template slot-scope="scope">
                                <span>{{scope.row.createTime | transformTime}}</span>
                            </template>
                    </el-table-column>
                    <el-table-column prop="owner" label="车主姓名"  min-width="80" align="center" show-overflow-tooltip >
                    </el-table-column>
                    <el-table-column prop="idcard" label="身份证"  min-width="120" align="center" show-overflow-tooltip >
                    </el-table-column>
                    <el-table-column prop="telephone" label="电话号码"  min-width="110" align="center" show-overflow-tooltip >
                    </el-table-column>
                    <el-table-column prop="company" label="公司"  min-width="80" align="center" show-overflow-tooltip >
                    </el-table-column>
                    <el-table-column prop="parkName" label="收费停车场"  min-width="110" align="center" show-overflow-tooltip >
                    </el-table-column>
                    <el-table-column prop="memberStatus" label="状态"  min-width="80" align="center">
                    </el-table-column>
                    <!--<el-table-column prop="memberStatus" label="状态"  min-width="80" align="center" :formatter="formatMemberStatus" >-->
                    <!--</el-table-column>-->
                    <!--<el-table-column prop="lockTime" label="挂起时间"  min-width="100" align="center" show-overflow-tooltip sortable >-->
                            <!--<template slot-scope="scope">-->
                                <!--<span>{{scope.row.lockTime | transformTime}}</span>-->
                            <!--</template>-->
                    <!--</el-table-column>-->
                    <el-table-column prop="remark" label="备注"  min-width="200" align="center" show-overflow-tooltip >
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" align="center">
                        <template slot-scope="scope">
                            <el-popover placement="left" trigger="click">
                                <div class="handleTran" style="text-align:center;border-bottom: 1px solid #eee; cursor: pointer;color: #333;padding: 5px 0;" @click="handleRenew(scope.$index,scope.row)" v-if="markVIPInfoRenewal">会员续费</div>
                                <div class="handleTran" style="text-align:center;border-bottom: 1px solid #eee; cursor: pointer;color: #333;padding: 5px 0;" @click="handleChange(scope.$index,scope.row)" v-if="markVIPInfoChange">费用变更</div>
                                <div class="handleTran" style="text-align:center;border-bottom: 1px solid #eee; cursor: pointer;color: #333;padding: 5px 0;" @click="handleEdit(scope.$index,scope.row)" v-if="markVIPInfoUpdate">修改信息</div>
                                <!-- <div class="handleTran" style="text-align:center;border-bottom: 1px solid #eee; cursor: pointer;color: #333;padding: 5px 0;" @click="handleHangUp(scope.$index,scope.row)">挂起解挂</div> -->
                                <div class="handleTran" style="text-align:center;border-bottom: 1px solid #eee; cursor: pointer;color: #333;padding: 5px 0;" @click="handleDelete(scope.$index,scope.row)" v-if="markVIPInfoDelete">会员删除</div>
                                <div class="handleTran" style="text-align:center;border-bottom: 1px solid #eee; cursor: pointer;color: #333;padding: 5px 0;" @click="syncCloud(scope.$index,scope.row)" v-if="markVIPInfoCloud">同步云端</div>
                                <div slot="reference" >...</div>
                            </el-popover>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="elPag clearfix">
                <el-button type="primary" @click="batchDelete" style="float:left;margin-right:20px">批量删除</el-button>
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
            <div class="Description">
                <span class="pay-notice bg-danger"></span>
                <span>月卡失效</span>
            </div>
        </div>

        <!--挂起弹框-->
        <!-- <el-dialog title="挂起时间" :visible.sync="suspendTimeShow">
            <div class="block">
                <span class="demonstration">带快捷选项</span>
                <el-date-picker
                    v-model="suspendTime"
                    align="right"
                    type="date"
                    placeholder="选择日期"
                    :picker-options="pickerOptions1">
                </el-date-picker>
            </div>
            <div slot="footer" class="dialog-footer">

               <el-button type="primary" @click.native="errorImport()">确定</el-button>

             </div>   
        </el-dialog> -->

        <!--导入文件-->
        <el-dialog title="导入文件" :visible.sync="excelImportShow">
                    <el-upload action="" class="upload-demo" :limit="1" :file-list="fileList" :before-upload="beforeUpload">

                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>

                        <div slot="tip" class="el-upload__tip">只能上传excel文件</div>

            <!--            <a href="/financial-admin/exportInOutBusiClass-excel" rel="external nofollow" download="模板">-->

            <!--            <el-button size="small" type="success">下载模板</el-button></a>-->

                        <div slot="tip" class="el-upload-list__item-name">{{fileName}}</div>

                    </el-upload>

                    <div slot="footer" class="dialog-footer">

                        <el-button @click.native="excelImportShow = false">取消</el-button>

                        <el-button type="primary" @click.native="submitUpload()">提交</el-button>

                    </div>
        </el-dialog>
        <!--导入结果-->
        <el-dialog title="导入结果" :visible.sync="resultDerivedShow">
            <div>
                <p>成功导入月卡条数：{{this.importNum}}</p>
                <p>失败导入月卡条数：{{this.failureNum}}</p>
            </div>
            <div>
                <h1>失败原因请点击下载查看</h1>
            </div>
            <div slot="footer" class="dialog-footer">

               <el-button type="primary" @click.native="errorImport()">下载</el-button>

             </div>   
        </el-dialog>

        <!--办理会员-->
          <el-dialog  :title="isHandle?'办理会员':'会员续费'" :visible.sync="handleFormVisible" @close="closeMemberDialog">
            <!-- <el-form :model="vip_INFO" label-width="100px" :rules="handleFormRules" ref="vip_INFO" class="clearfix">   -->
            <el-form :model="vip_INFO" label-width="100px" ref="vip_INFO" class="clearfix">
                <el-row :gutter="20">
                    <el-col :span="11">
                        <h2>月卡信息</h2>
                        <div class="grid-content bg-purple">
                            <el-form-item label="车牌号码"  prop="carNum">
                                <div class="key-board">
                                    <!--<el-input v-model="vip_INFO.carNum" placeholder="请输入车牌号" v-show="isHandle" clearable　@blur="carNumVerification"></el-input>-->
                                    <keyboard ref="autotext" @input="getKeyboardVal" v-show="isHandle" width="200px" @carNumVerification="carNumVerification"></keyboard>
                                </div>
                                <span v-show="!isHandle">{{vip_INFO.carNum}}</span>
                            </el-form-item>
                            <el-form-item label="办理类型" v-show="isHandle" prop="memberRateIndex">
                                <el-select v-model="vip_INFO.memberRateIndex" placeholder="请选择办理类型" @change="memberRateChange">
                                    <el-option v-for="(item,index) in RateList" :label="item.memberType" :value="index" :key="item.id"></el-option>
                                </el-select>
                            </el-form-item >
                            <el-form-item label="会员类型" v-show="!isHandle">
                                <!--<el-input v-model="this.vip_INFO.memberRateId"></el-input>-->
                                <el-select v-model="this.vip_INFO.memberType"   placeholder="请选择办理类型" disabled>
                                    <el-option :label="this.vip_INFO.memberType" :value="this.vip_INFO.memberRateId"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="isHandle?'办理单位':'续费单位'" prop="applyUnit">
                                <el-input v-model="vip_INFO.applyUnit" disabled></el-input>
                                <!--<el-select v-model="vip_INFO.applyUnit" placeholder="请选择办理单位" @change='timeAndMoney'>-->
                                    <!--<el-option v-for="item in applyUnitList" :label="item" :value="item" :key="item"></el-option>-->
                                <!--</el-select>-->
                            </el-form-item>
                            <!-- <el-form-item label="办理时长" v-show="isHandle" prop="applyLength">
                                <el-input v-model="vip_INFO.applyLength" clearable @blur="timeAndMoney"></el-input>
                                <span>{{vip_INFO.applyUnit=='月'?'个'+vip_INFO.applyUnit:vip_INFO.applyUnit}}</span>
                            </el-form-item> -->
                            <el-form-item :label="isHandle?'办理时长':'续费时长'"  prop="applyLength">
                                <el-input-number v-model="vip_INFO.applyLength" label="续费数量" @blur="getExpireTime" @change="getExpireTime" :min="1" :max="999">
                                </el-input-number>
                            </el-form-item>
                            <el-form-item label="生效时间" prop="effectTime">
                                <el-date-picker v-model="vip_INFO.effectTime"  type="date" :disabled="isEffectTime" :picker-options="pickerOptions" placeholder="选择日期时间" @change="getExpireTime">
                                </el-date-picker>
                                <!-- <span v-show="!isHandle">{{vip_INFO.effectTime}}</span> -->
                            </el-form-item>
                            <el-form-item label="失效时间" >
                                <span>{{vip_INFO.expTime}}</span>
                            </el-form-item>
                            <el-form-item label="缴纳金额" >
                                <span>{{vip_INFO.payMoney+'元'}}</span>
                            </el-form-item>
                            <el-form-item label="缴费方式" >
                                <el-select v-model="vip_INFO.payType" placeholder="请选择缴费方式">
                                    <el-option v-for="item in payTypeList" :key="item.id" :label="item.payTypeName" :value="item.payTypeName">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="缴费时间">
                            <el-date-picker v-model="vip_INFO.payTime" type="date" placeholder="选择日期时间"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="备      注" >
                                <el-input v-model="vip_INFO.remark" clearable></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="11" style="margin-left:10px;">
                        <h2>车主信息</h2>
                        <div class="grid-content bg-purple">
                            <el-form-item label="车主姓名">
                                <el-input v-model="vip_INFO.memberName" v-show="isHandle" placeholder="请输入车主姓名" clearable></el-input>
                                <span v-show="!isHandle">{{vip_INFO.memberName}}</span>
                            </el-form-item>
                            <el-form-item label="身份证号">
                                <el-input v-model="vip_INFO.idCard" v-show="isHandle" placeholder="请输入身份证号" clearable></el-input>
                                <span v-show="!isHandle">{{vip_INFO.idCard}}</span>
                            </el-form-item>
                            <el-form-item label="电话号码">
                                <el-input v-model="vip_INFO.phoneNum" v-show="isHandle" placeholder="请输入电话号码" clearable></el-input>
                                <span v-show="!isHandle">{{vip_INFO.phoneNum}}</span>
                            </el-form-item>
                            <el-form-item label="公司名称">
                                <el-input v-model="vip_INFO.company" v-show="isHandle" placeholder="请输入公司名称" clearable></el-input>
                                <span v-show="!isHandle">{{vip_INFO.company}}</span>
                            </el-form-item>
                            <el-form-item label="提示" v-show="prompt">
                                <span style="color:#FC813B;font-size: 19px">该车在：{{this.inTime}}进场,</span>
                                <span style="color:#FC813B;font-size: 19px">请注意审核</span>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
            <el-dialog width="30%" :title="isHandle?'确认办理信息':'确认缴费信息'" :visible.sync="innerVisible" append-to-body class="isHandle">
                <el-form :model="vip_INFO" label-width="80px" style="width:100%;text-align:center" ref="vip_INFO" >
                    <el-form-item label="车牌号码"  class="magn_bmt">
                        <span>{{vip_INFO.carNum}}</span>
                    </el-form-item>
                    <el-form-item :label="isHandle?'办理时限':'续费数量'" class="magn_bmt">
                        <span>{{vip_INFO.applyLength}}{{vip_INFO.applyUnit=='月'?'个'+vip_INFO.applyUnit:vip_INFO.applyUnit}}</span>
                    </el-form-item>
                    <el-form-item label="生效日期" class="magn_bmt">
                        <span>{{ changeTimeStr(vip_INFO.effectTime)}}</span>
                    </el-form-item>
                    <el-form-item label="失效日期"  class="magn_bmt">
                        <span>{{vip_INFO.expTime}}</span>
                    </el-form-item>
                    <el-form-item label="缴纳金额"  class="magn_bmt">
                        <span>{{vip_INFO.payMoney+'元'}}</span>
                    </el-form-item>
                    <el-form-item label="缴费方式"  class="magn_bmt">
                        <span>{{vip_INFO.payType}}</span>
                    </el-form-item>
                    <el-form-item label="缴费时间"  class="magn_bmt">
                        <span>{{changeTimeStr(vip_INFO.payTime)}}</span>
                    </el-form-item>
                </el-form>
                <div class="clearfix" style="margin-top:10px">
                    <el-button @click="innerVisible = false" style="float: right;margin-left:10px">取消</el-button>
                    <el-button type="primary" @click="handleSubmit('vip_INFO')" :loading="handleLoading" style="float: right;">确认</el-button>
                </div>
            </el-dialog>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="innerVisible=true,prompt=false" :loading="handleLoading">确认</el-button>
                <el-button @click.native="handleFormVisible = false,prompt=false">取消</el-button>
            </div>
        </el-dialog>
        <!--费用变更-->
        <el-dialog  title="费用变更" :visible.sync="costChangeFormVisible">
            <el-form class="clearfix" :model="vip_INFO" label-width="100px"  ref="vip_INFO">
                <el-col :span="16">
                    <div class="grid-content bg-purple">
                        <el-form-item label="车牌号码"  prop="carNum">
                            <span>{{vip_INFO.carNum}}</span>
                        </el-form-item>
                        <el-form-item label="会员类型">
                            <span>{{vip_INFO.memberType}}</span>
                        </el-form-item>
                        <el-form-item label="生效时间">
                            <span>{{vip_INFO.effTime}}</span>
                        </el-form-item>
                        <el-form-item label="失效时间">
                            <span>{{vip_INFO.expTime}}</span>
                        </el-form-item>
                        <el-form-item label="缴费方式">
                            <el-select v-model="vip_INFO.returnFee" placeholder="请选择办理单位">
                                <el-option label="补交费用" :value="false"></el-option>
                                <el-option label="退还费用" :value="true"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="费      用">
                             <el-input v-model="vip_INFO.payMoney"></el-input>
                            <span>元</span>
                        </el-form-item>
                        <el-form-item label="备      注">
                            <el-input v-model="vip_INFO.remark"></el-input>
                        </el-form-item>
                    </div>
                </el-col>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="costChangeSubmit('vip_INFO')" :loading="costChangeLoading">提交</el-button>
                <el-button @click.native="costChangeFormVisible = false">取消</el-button>
            </div>
        </el-dialog>

        <!--修改信息 -->
        <el-dialog  title="修改信息" :visible.sync="editFormVisible">
            <el-form class="clearfix" :model="vip_INFO" label-width="100px" :rules="editFormRules" ref="vip_INFO">
                <el-col :span="12">
                    <h2>月卡信息</h2>
                    <div class="grid-content bg-purple">
                        <el-form-item label="车牌号码"  prop="carNum">
                            <el-input v-model="vip_INFO.carNum" ></el-input>
                        </el-form-item>
                        <el-form-item label="办理类型">
                            <el-select v-model="vip_INFO.memberRateId" placeholder="请选择办理类型">
                                <el-option v-for="item in RateList" :label="item.memberType" :value="item.id" :key="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生效时间" >
                            <el-date-picker v-model="vip_INFO.effectTime" type="date"  placeholder="选择日期时间" :picker-options="pickerOptionsStartTime"></el-date-picker>
                            <!--<el-date-picker v-model="vip_INFO.effectTime" type="date"  placeholder="选择日期时间" @change="timeChange"></el-date-picker>-->
                        </el-form-item>
                        <el-form-item label="失效时间" >
                            <el-date-picker v-model="vip_INFO.expireTime" type="date"  placeholder="选择日期时间" :picker-options="pickerOptionsEndTime"></el-date-picker>
                            <!--<span>{{vip_INFO.expTime}}</span>-->
                        </el-form-item>
                        <el-form-item label="备      注">
                            <el-input v-model="vip_INFO.remark"></el-input>
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="12">
                    <h2>车主信息</h2>
                    <div class="grid-content bg-purple">
                        <el-form-item label="车主姓名">
                            <el-input v-model="vip_INFO.memberName"></el-input>
                        </el-form-item>
                        <el-form-item label="身份证号">
                            <el-input v-model="vip_INFO.idCard"></el-input>
                        </el-form-item>
                        <el-form-item label="电话号码">
                            <el-input v-model="vip_INFO.phoneNum"></el-input>
                        </el-form-item>
                        <el-form-item label="公司名称">
                            <el-input v-model="vip_INFO.company"></el-input>
                        </el-form-item>
                    </div>
                </el-col>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="editSubmit('vip_INFO')" :loading="editLoading">确认</el-button>
                <el-button @click.native="editFormVisible = false">取消</el-button>
            </div>
        </el-dialog>
        <el-dialog  title="会员信息统计表" :visible.sync="isUserType">
            <div id="userTypeBar" style="height:400px"></div>
        </el-dialog>

    </section>
</template>
<script>
 // 引入基本模板
var echarts = require('echarts/lib/echarts');
import {exportVIPList,vipimport,syncCloudInfo,vipCarInfo,carInfo,vipList,vipAdd,vipDelete,vipPause,vipBatchDelete,listMemberRateSim,feeChange,feeRenewals,infoUpdate,vipTypeCount,importBdDeptdoc,getExpireTime } from '@/api/api'
export default {
    data(){
        return {
            errorsData:'',
            //用于按钮权限的控制
            markVIPInfoQuery:false,
            markVIPInfoImport:false,
            markVIPInfoExport:false,
            markVIPInfoAdd:false,
            markVIPInfoRenewal:false,
            markVIPInfoChange:false,
            markVIPInfoUpdate:false,
            markVIPInfoDelete:false,
            markVIPInfoCloud:false,
        //     pickerOptions1: {
        //   disabledDate(time) {
        //     return time.getTime() < Date.now();
        //   },
        //   shortcuts: [{
        //     text: '今天',
        //     onClick(picker) {
        //       picker.$emit('pick', new Date());
        //     }
        //   }]
        // },
            failureTime:'',   //后台返回的失效时间
            suspendTime:'',     //挂起时间
            suspendTimeShow:false,  //挂起时间弹窗
            inTime:'',
            prompt:false,
            PresenceRecord:'',  //车辆在场记录
            vipMonthInfo:'',    //月卡用户信息
            tickedData:[],
            // 导入表格
            fileList:[],
            fileName:'',
            files:'',
            excelImportShow:false,  //导入表格弹窗
            failureData:'',
            failureNum:'',
            importNum:'',
            totalNum:'',
            resultDerivedShow:false,　　//下载导入错误数据弹窗
            // 查询信息
            filters: {
                condition: 'carNum',
                conditionTime:'valid_time',
                what:'',
                startTime:"",
                endTime:"",
                whatTime:null,
                containExpire:true,
                showOtherPark:true,
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
            pickerOptionsStartTime: {
                disabledDate: time => {
                    let endDateVal = this.vip_INFO.expireTime
                    if (endDateVal) {
                        return time.getTime() > new Date(endDateVal).getTime();
                    }
                }
            },
            pickerOptionsEndTime: {
                disabledDate: time => {
                    let beginDateVal = this.filters.effectTime
                    if (beginDateVal) {
                        return (
                            time.getTime() < new Date(beginDateVal).getTime()
                        );
                    }
                }
            },
            payTypeList:this.Util.payTypeList,
            vip_INFO:{
                carNum:'',
                memberName:'',
                applyUnit:'月',
                payType:'现金支付',
                returnFee:false,
                payTime:new Date(),
                idCard:'',
                phoneNum:'',
                company:'',
                applyLength:1,
                memberRateIndex:'',
                memberRateId:'',
                memberRatesId:'',
                memberType:'',
                effectTime:new Date(),
                effTime:'',
                expireTime:'',
                expTime:'',
                payMoney:0,
                vipId:'',
                remark:''
            },
            isEffectTime:false,     //控制生效时间是否可修改
            //办理单位
            applyUnitList:[],
            // 标准列表
            RateList:[],
            sels: [],//列表选中列
            // 列表信息
            array: [],
            currentPage:1,
            total: 0,
            pageSize: 10,
            listLoading: false,
            editTimelength:0,

            isUserType:false,           //用户类型统计图
            isHandle:false,
            handleFormVisible: false,//办理会员界面是否显示
            innerVisible:false,
            handleLoading: false,
            // handleFormRules: {
            //     carNum: [
            //         { required: true, message: '请输入车牌', trigger: 'blur' },
            //         { required: true, validator: this.Check.ruleCarNum, trigger: 'blur' }
            //     ],
            // },
            pickerOptions: {
                disabledDate:(time)=>{
                    // console.log(this.vip_INFO.effTime)
                    if(!this.isHandle){
                        return time.getTime() >  new Date().getTime();

                    }
                },
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                    picker.$emit('pick', new Date());
                    }
                },]
            },
            renewLoading: false,
            renewVisible:false,

            costChangeFormVisible: false,//费用变更界面是否显示
            costChangeLoading: false,

            editFormVisible: false,
            editLoading: false,
            editFormRules: {
                carNum: [
                    { required: true, message: '请输入companyid', trigger: 'blur' }
                ]
            },
            hangUpLoading: false,
        }
    },
    mounted(){
        this.getVipList(false);
        this.getListMemberRate();
        this.markVIPInfoQuery = this.Util.isPermission('markVIPInfoQuery');
        this.markVIPInfoImport = this.Util.isPermission('markVIPInfoImport');
        this.markVIPInfoExport = this.Util.isPermission('markVIPInfoExport');
        this.markVIPInfoAdd = this.Util.isPermission('markVIPInfoAdd');
        this.markVIPInfoRenewal = this.Util.isPermission('markVIPInfoRenewal');
        this.markVIPInfoChange = this.Util.isPermission('markVIPInfoChange');
        this.markVIPInfoUpdate = this.Util.isPermission('markVIPInfoUpdate');
        this.markVIPInfoDelete = this.Util.isPermission('markVIPInfoDelete');
        this.markVIPInfoCloud = this.Util.isPermission('markVIPInfoCloud');

    },
    beforeUpdate(){
        try {
            let menuNode = document.getElementsByClassName('menu-active')
            menuNode[0].classList.remove('menu-active')  
        } catch (error) {}        
        document.getElementById("menu-box-6").classList.add("menu-active")
    },
    methods:{
        //根据是否缴费增加背景颜色
        tableRowClassName({ row, rowIndex }) {
            if(row.memberStatus === "已失效"){
                return "danger-row";
            }

        },
        getKeyboardVal(val) {
            this.vip_INFO.carNumcarNumVal = val;
        },
        // 验证车牌
        carNumVerification(data){
            this.vip_INFO.carNum = data

            this.CarNum(this.vip_INFO.carNum)
            //  console.log(this.vip_INFO.carNum)
            // if(this.inputVal.length>1){
            //     this.vip_INFO.carNum = this.inputVal
            //     this.carInfo(this.vip_INFO.carNum)
            // }else{
            //     this.carInfo(this.vip_INFO.carNum)　　//查询是否在场内
            // }
            // console.log(this.$refs.autotext.inputVal)
            if(this.vip_INFO.carNum ===''){
                this.CarNum(this.vip_INFO.carNum)
            }else{
                this.carInfo(this.vip_INFO.carNum)　　//查询是否在场内
            }
            //  this.vipCarInfo()
        },
        //   车牌号校验
        CarNum(num){
            // console.log(num)
            var carNumber = num
            var express = /[A-Za-z]{1}[A-Za-z0-9]{4}[A-Za-z0-9港澳学领]{1}$|[A-Za-z]{1}[A-Za-z0-9]{5}[港澳学领]{1}$/;
            if (carNumber === '') {
                this.$message({
                    message: '您还未输入车牌号码',
                    type: 'warning'
                }) ;
                // alert("您还未输入车牌号码");
                return false;
            } else if (!express.test(carNumber)) {
                // alert("车牌号格式有误，请重新输入");
                this.$message({
                    message: '车牌号格式有误，请重新输入',
                    type: 'warning'
                });
                return false;
            } else if (express.test(carNumber)){
                return true;
            }

        },
        // 获取在场车辆记录
        carInfo(row){
            // console.log(this.vip_INFO.carNum)
        let carNumber = this.vip_INFO.carNum!==""?this.vip_INFO.carNum:row.carNum
        // let carNumber = this.$refs.autotext.inputVal
          let para = {
              operatorId:this.Util.userInfo.id,
              carNum:carNumber
            }
            carInfo(para).then(res=>{
                // console.log(res.data.data)
                this.PresenceRecord = res.data.data
                console.log(this.PresenceRecord)
                if(this.PresenceRecord!=null){
                    this.inTime = this.PresenceRecord.inTime
                    var str =this.inTime;
                    str = str.replace(/-/g,"/");
                    var date = new Date(str );
                    this.vip_INFO.effectTime = date
                    this.prompt=true
                }else{
                    this.vip_INFO.effectTime = new Date()
                    this.prompt=false
                }
            }).catch(err=>{
                this.prompt=false
                console.log(err)
            })
        },
        // 获取vip用户信息
        vipCarInfo(){
          let para = {
              operatorId:this.Util.userInfo.id,
              carNum:this.vip_INFO.carNum
            }
          vipCarInfo(para).then(res=>{
            //   console.log(res.data.data)
              this.vipMonthInfo = res.data.data
            //   console.log(this.vip_INFO.memberRateId)
            //   this.isHandle = false
            //   this.vip_INFO.expTime = this.vipMonthInfo.stopTime
            //   this.vip_INFO.memberRateId=this.vipMonthInfo.memberRateId
            //   this.vip_INFO.memberName=this.vipMonthInfo.owner
            //   this.vip_INFO.idCard=this.vipMonthInfo.idcard
            //   this.vip_INFO.phoneNum=this.vipMonthInfo.telephone
            //   this.vip_INFO.company=this.vipMonthInfo.company
            //   console.log(this.vip_INFO.memberRateId)
          }).catch(err=>{
                console.log(err)
          })
        },
        // 获取勾选的数据
        getTickedData(data){
            this.tickedData = data
        },
        // 导入表格
        beforeUpload(file){

            // console.log(file,'文件');

            this.files = file;

            const extension = file.name.split('.')[1] === 'xls'

            const extension2 = file.name.split('.')[1] === 'xlsx'

            // const isLt2M = file.size / 1024 / 1024 < 5(校验上传文件的大小)

            if (!extension && !extension2) {

                this.$message.warning('上传文档只能是 xls、xlsx格式!')

                return

            }

            // if (!isLt2M) {

            //  this.$message.warning('上传模板大小不能超过 5MB!')

            //  return

            // }

            this.fileName = file.name;

            return false // 返回false不会自动上传

        },

        submitUpload() {
            // console.log(1)
            // console.log(vipimport)
            if(this.fileName === ""){

                this.$message.warning('请选择要上传的文件！')

                return false

            }

            let fileFormData = new FormData();

            fileFormData.append('file', this.files);//filename是键，file是值，就是要传的文件，test.zip是要传的文件名
            fileFormData.append('operatorId', this.Util.userInfo.id);
            // console.log(fileFormData)

            this.$axios({
                // url:'http://192.168.1.66:9021/v2/park/vip/excel/import/fail/down',
                url:vipimport,
                method: 'post',
                data: fileFormData,
                responseType: 'blob',
                headers:{
                    'Content-Type':'multipart/form-data'
                }

            })
                .then(respanse=> {
                    // console.log(respanse.headers);
                    // this.Util.exportExcel(respanse)
                    // this.getVipList()
                   //  console.log(respanse);
                   //  this.getVipList();
                    this.errorsData = respanse
                    this.failureNum = respanse.headers.failurenum
                    this.importNum = respanse.headers.successnum
                   //  this.totalNum = respanse.data.data.totalNum
                   if(this.failureNum != '0'){
                       this.excelImportShow = false;
                       this.resultDerivedShow = true;
                   }else{
                       this.excelImportShow = false;
                       this.$message({
                           message: '全部导入成功',
                           type: 'success'
                       });
                   }

                })

        },
            // 下载导出失败的excel文件
        errorImport(){
            this.resultDerivedShow = false;
            this.Util.exportExcel(this.errorsData)
            // require.ensure([], () => {
            //     const { export_json_to_excel } = require('@/assets/js/excel/Export2Excel')
            //     const tHeader = ['车牌', '车主', '电话','会员卡名称','身份证','公司','开始时间（年-月-日）','失效时间（年-月-日）','挂起时间（年-月-日 时:分：秒）','失败原因']
            //     const filterVal = ['carNum','owner','telephone','memberType','idcard', 'company','startTime', 'stopTime','lockTime','reason']
            //     const list = this.Util.deepCopy(this.failureData)
            //     const data = this.Util.formatJson(filterVal, list)
            //     let excelFileName = `导入失败会员信息`
            //     export_json_to_excel(tHeader, data, excelFileName)
            //
            // })
        },
        // 导出excel文件
        exportVIPList() {
            let condition = this.filters.condition;
            let conditionTime = this.filters.conditionTime;
            let what = this.filters.what;
            // let whatTime = this.filters.whatTime;
            // let checkList = this.filters.checkList;
            let obj = {};
            obj[condition] = what;
            let params={
                operatorId:this.Util.userInfo.id,
                containExpire:true,
                showOtherPark:true,
            }
            if(this.filters.startTime){
                if(conditionTime=='valid_time'){
                    params.effectLowTime = this.Util.formatDate.format(this.filters.startTime, 'yyyy-MM-dd hh:mm:ss'),
                        params.effectUpTime = this.Util.formatDate.format(this.filters.endTime, 'yyyy-MM-dd hh:mm:ss')
                }else{  //按办理时间查找
                    let applyLowTime = this.Util.formatDate.format(this.filters.startTime, 'yyyy-MM-dd hh:mm:ss')
                    let applyUpTime = this.Util.formatDate.format(this.filters.endTime, 'yyyy-MM-dd hh:mm:ss')
                    params.applyLowTime = this.Util.formatDate.format(new Date(applyLowTime),'yyyy-MM-dd hh:mm:ss')
                    params.applyUpTime = this.Util.formatDate.format(new Date(applyUpTime),'yyyy-MM-dd hh:mm:ss')
                }
            }
            params.containExpire=this.filters.containExpire
            params.showOtherPark=this.filters.showOtherPark
            let para=Object.assign(params,obj)
            // console.log(para)
            this.$axios({
                url:exportVIPList,
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
        //新增会员选择会员标准
        memberRateChange(){
            let memberRate = this.RateList[this.vip_INFO.memberRateIndex]
            this.vip_INFO.memberRateId = memberRate.id
            // console.log(memberRate)
            this.applyUnitList = ''
            if(memberRate.dayMoney||memberRate.dayMoney===0){
                this.applyUnitList='天'
                this.getExpireTime()
            }
            if(memberRate.monthMoney||memberRate.monthMoney===0){
                this.applyUnitList='月'
                this.getExpireTime()
            }
            if(memberRate.yearMoney||memberRate.yearMoney===0){
                this.applyUnitList='年'
                this.getExpireTime()
            }
            this.vip_INFO.applyUnit = this.applyUnitList[0]
            // this.vip_INFO.applyUnit = unit
            this.timeAndMoney()

        },
        //关闭办理会员/续费弹窗
        closeMemberDialog(){
            this.prompt=false
            this.$refs.autotext.inputVal = ''
            this.$nextTick(()=>{
                this.$refs['vip_INFO'].resetFields()
             })
        },
        //转换卡状态
        formatMemberStatus (row, column) {
            // -0,未生效；1,已生效；2,已失效；3,挂起；4,解挂
            return row.memberStatus == 0? '未生效' : row.memberStatus == 1 ? '已生效' :row.memberStatus == 2 ? '已失效' :row.memberStatus == 3 ? '挂起':row.memberStatus == 4 ? '解挂':'';
        },
        // 给table行设定指定样式
        styleSpecial(style){
            // console.log(style)
            if(style.row.memberStatus==0){
                return {color:'#F56C6C'}
            }else if(style.row.memberStatus==1){
                return {color:'#1e00ff'}
            }
        },
        handleSizeChange(val) {
            this.pageSize =  val;
            this.getVipList(false);
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getVipList(false);
        },
        handleSelectionChange(val) {
            this.sels = val;
            // console.log(this.sels)
        },
        // 自定义序号
        indexMethod(index){
            return index +this.pageSize*(this.currentPage-1)+1;
        },
        //获取列表
         getVipList(isAgm) {
            let condition = this.filters.condition;
            let conditionTime = this.filters.conditionTime;
            let what = this.filters.what;
            // let whatTime = this.filters.whatTime;
            // let checkList = this.filters.checkList;
            let obj = {};
            obj[condition] = what;
            let params={
                operatorId:this.Util.userInfo.id,
                containExpire:true,
                showOtherPark:true,
            }
            // if(this.filters.startTime){
                if(conditionTime=='valid_time'){
                        params.effectLowTime = this.Util.formatDate.format(this.filters.startTime, 'yyyy-MM-dd hh:mm:ss'),
                        params.effectUpTime = this.Util.formatDate.format(this.filters.endTime, 'yyyy-MM-dd hh:mm:ss')
                }else{  //按办理时间查找
                    let applyLowTime = this.Util.formatDate.format(this.filters.startTime, 'yyyy-MM-dd hh:mm:ss')
                    let applyUpTime = this.Util.formatDate.format(this.filters.endTime, 'yyyy-MM-dd hh:mm:ss')
                    params.applyLowTime = this.Util.formatDate.format(new Date(applyLowTime),'yyyy-MM-dd hh:mm:ss')
                    params.applyUpTime = this.Util.formatDate.format(new Date(applyUpTime),'yyyy-MM-dd hh:mm:ss')
                }
            // }
            // if(whatTime){
            //     if(conditionTime=='valid_time'){
            //         params.effectLowTime = this.Util.formatDate.format(whatTime[0],'yyyy-MM-dd')
            //         params.effectUpTime = this.Util.formatDate.format(whatTime[1],'yyyy-MM-dd')
            //     }else{  //按办理时间查找
            //         let applyLowTime = whatTime[0].getTime()
            //         let applyUpTime = whatTime[1].getTime()
            //         //如果是当天,上限改为23:59:59
            //         if(applyLowTime === applyUpTime){
            //             applyUpTime += 24*3600000-1
            //         }
            //         params.applyLowTime = this.Util.formatDate.format(new Date(applyLowTime),'yyyy-MM-dd hh:mm:ss')
            //         params.applyUpTime = this.Util.formatDate.format(new Date(applyUpTime),'yyyy-MM-dd hh:mm:ss')
            //     }
            // }
            params.length=this.pageSize
            params.containExpire=this.filters.containExpire
            params.showOtherPark=this.filters.showOtherPark
            if(isAgm){
                params.current=0
            }else{
                params.current=this.currentPage-1
            }
            let para=Object.assign(params,obj)
            // console.log(para)
            vipList(para).then( res => {
                // console.log(res)
                if(res.data.code=='SUCCESS'){
                    this.array=res.data.data.content;
                    this.array.forEach(item =>{
                        if(item.memberStatus === 0){
                           item.memberStatus = '未生效'
                        }else if(item.memberStatus === 1){
                            item.memberStatus = '已生效'
                        }else if(item.memberStatus === 2){
                            item.memberStatus = '已失效'
                        }else if(item.memberStatus === 3){
                            item.memberStatus = '挂起'
                        }else if(item.memberStatus === 4){
                            item.memberStatus = '解挂'
                        }else{

                        }
                    })
                    this.total=res.data.data.totalElements;
                }else{
                    this.$message.error(res.data.msg)
                }
              })
        },
        //模糊查询
        find(){
            let startTime = this.filters.startTime
            let endTime = this.filters.endTime;
            if(!this.filters.startTime && !this.filters.endTime){
                this.getVipList()
            } else if(!this.filters.startTime || !this.filters.endTime){
                this.$message({
                    message: '开始时间或结束时间不能为空',
                    type: 'warning'
                });
            }else if(this.filters.startTime && this.filters.endTime){
                if(startTime.getTime()<endTime.getTime()){
                    this.getVipList()
                }else if(startTime.getTime()===endTime.getTime()){
                    this.getVipList()
                }else{
                    this.$message({
                        message: '开始时间大于结束时间',
                        type: 'warning'
                    });
                }
            }else{
                this.getVipList()
            }
        },
        // 获取收费标准简单列表
        getListMemberRate(){
            let para={
                operatorId:1
            }
            listMemberRateSim(para).then(res=>{
                // console.log(res);
                if(res.data.code=='SUCCESS'){
                    this.RateList=res.data.data;
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        // 会员办理
        handleIVP(){
            this.isEffectTime = false

            // this.$refs['vip_INFO'].resetFields()

            this.handleFormVisible = true
            this.isHandle = true

            this.vip_INFO.carNum = ''
            this.vip_INFO.memberName = ''
            this.vip_INFO.applyUnit ='月'
            this.vip_INFO.payType = '现金支付'
            this.vip_INFO.returnFee = false
            this.vip_INFO.payTime = new Date()
            this.vip_INFO.idCard = ''
            this.vip_INFO.phoneNum = ''
            this.vip_INFO.company = ''
            this.vip_INFO.applyLength = 1
            this.vip_INFO.memberRateIndex = ''
            this.vip_INFO.memberRateId = ''
            this.vip_INFO.memberRatesId = ''
            this.vip_INFO.memberType = ''
            this.vip_INFO.effectTime = new Date()
            this.vip_INFO.effTime = ''
            this.vip_INFO.expireTime = ''
            this.vip_INFO.expTime = ''
            this.vip_INFO.payMoney = ''
            this.vip_INFO.vipId = ''
            this.vip_INFO.remark = ''
            // if(this.vip_INFO.carNum == ''){
            //     this.$refs.autotext.inputVal = ''
            // }

        },
        // 会员续费
        handleRenew(index,row){
            // console.log(row)
            // this.$refs['vip_INFO'].resetFields()

            // console.log(this.handleFormRules);
            // this.handleFormRules.carNum[0].require=false
            this.vip_INFO.applyLength = "1"
            this.vip_INFO.carNum=row.carNum
            this.vip_INFO.memberType=row.memberType
            this.vip_INFO.memberName=row.owner
            this.vip_INFO.idCard=row.idcard
            this.vip_INFO.phoneNum=row.telephone
            this.vip_INFO.company=row.company
            this.vip_INFO.memberRateId=row.memberRatesId
            this.vip_INFO.expireTime=row.stopTime
            // console.log(this.vip_INFO.memberRateId)
            this.vip_INFO.vipId=row.id;
            this.vip_INFO.remark=row.remark;
            // this.vip_INFO.applyUnit=row.applyUnit;
            this.vip_INFO.applyUnit = row.unit  //续费单位
            this.isHandle=false;
            // console.log(row)
            // this.applyUnitList = []

            // for(let i=0;i<this.RateList.length;i++){
            //     if(this.vip_INFO.memberRateId==this.RateList[i].id){
            //         let memberRate = this.RateList[i]

            //         if(memberRate.dayMoney){
            //             this.applyUnitList.push('天')
            //         }
            //         if(memberRate.monthMoney){
            //             this.applyUnitList.push('月')
            //         }
            //         if(memberRate.yearMoney){
            //             this.applyUnitList.push('年')
            //         }
            //     }
            // }

            // let newTime=new Date(this.Util.formatDate.format((new Date),'yy/MM/dd')).getTime();
            let newTime=new Date().getTime();
            let stopTime=new Date(row.stopTime).getTime();
            if(newTime<=stopTime){
                this.$confirm('月卡未到期, 是否继续续费?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    this.handleFormVisible = true;
                    this.vip_INFO.effectTime=new Date(row.startTime);
                    this.vip_INFO.effTime=row.startTime;
                    this.getExpireTime();
                    // this.vip_INFO.expireTime=new Date(row.stopTime);
                    this.vip_INFO.expTime=row.stopTime
                    this.vip_INFO.memberType = row.memberType;
                    this.vip_INFO.memberRateId = row.memberRatesId;
                    this.isEffectTime = true
                }).catch((err) => {
                    // console.log(err)
                    // this.handleFormVisible = false;

                });
            }else{
                this.carInfo(row)    //查询是否在场
                this.getExpireTime();
                this.isEffectTime = false
                this.vip_INFO.effectTime=new Date(row.startTime);
                // this.vip_INFO.expireTime=new Date(row.stopTime);
                this.vip_INFO.expTime=row.stopTime
                // this.vip_INFO.expTime=row.stopTime.substring(0,10);
                // this.vip_INFO.expireTime=new Date(row.stopTime);
                // this.vip_INFO.effectTime=new Date();
                this.handleFormVisible = true;
                this.isEffectTime = true
            }
        },
        // 费用变更
        handleChange(index,row){
            // let start=row.startTime
            this.costChangeFormVisible = true;
            this.vip_INFO.carNum=row.carNum;
            this.vip_INFO.effTime=row.startTime?this.Util.formatDate.format(new Date(row.startTime),'yy-MM-dd'):'';
            this.vip_INFO.expTime=row.stopTime?this.Util.formatDate.format(new Date(row.stopTime),'yy-MM-dd'):'';
            this.vip_INFO.memberType=row.memberType;
            this.vip_INFO.vipId=row.id;
        },
        // 会员信息修改
        handleEdit(index,row){
            let start=new Date(row.startTime).getTime()
            let end=new Date(row.stopTime).getTime()
            // console.log(row.startTime)
            // console.log(row.stopTime)

            this.editTimelength=end-start;
            this.editFormVisible = true;
            this.vip_INFO.carNum=row.carNum;
            this.vip_INFO.effectTime=new Date(row.startTime);
            this.vip_INFO.expTime=row.stopTime?this.Util.formatDate.format(new Date(row.stopTime),'yy-MM-dd'):'';
            this.vip_INFO.expireTime=new Date(row.stopTime);
            // this.vip_INFO.effTime=new Date();
            this.vip_INFO.memberType=row.memberType;
            this.vip_INFO.memberName=row.owner;
            this.vip_INFO.memberRateId=row.memberRatesId;
            this.vip_INFO.idCard=row.idcard;
            this.vip_INFO.phoneNum=row.telephone;
            this.vip_INFO.company=row.company;
            this.vip_INFO.vipId=row.id;
        },

        openMemberChart(){
            this.isUserType=true
            let params = {
                operatorId:this.Util.userInfo.id,
            }

            vipTypeCount(params).then( res => {
                // console.log(res.data.data)
                if(res.data.code=='SUCCESS'){
                    this.chartUserSum(res.data.data)

                }else{
                    this.$message.error(res.data.msg)
                }
              })

        },
        // 用户类型统计图
        chartUserSum(data){
            // console.log(data)

            let userArr = []
            let userArrCount = []
            let userArrSum = 0
            for(let i = 0,len = data.length; i < len; i++){
                userArr.push(data[i].memberType)
                userArrCount.push(data[i].number)
                userArrSum += data[i].number
            }
            // let userArr=['地面月卡','地库月卡','公务用车','内部人员','超级vip'];

            let cWidth=document.getElementById('userTypeBar');
            // cWidth.style.width=window.innerWidth/2.5+'px';
            let chartUS = echarts.init(cWidth)
            let option = {
                title: {
                    text: '会员信息统计表 总计:'+userArrSum,
                    // subtext: '纯属虚构'
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                grid: {
                    right: '20%',
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow',
                            label: {
                                show: true,
                                formatter: function (params) {
                                    return params.value.replace('\n', '');
                                }
                            }
                        }
                    }
                },
                toolbox: {
                    feature: {
                        // dataView: {show: true, readOnly: false},
                        // restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                xAxis: [
                    {
                        type: 'category',
                        data: userArr
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '',
                        // min: 0,
                        // max: 25,
                        axisLabel: {
                            formatter: '{value} '
                        }
                    },
                ],
                series: [
                    {
                        name:'',
                        type:'bar',
                        // data:[5,8,45,8,4],
                        data:userArrCount,
                        itemStyle: {
                            //通常情况下：
                            normal:{
            　　　　　　　　　　　　//每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                                // color: function (params){
                                //     var colorList = [
                                //         '#C33531','#EFE42A','#64BD3D','#EE9201','#29AAE3', '#B74AE5','#0AAF9F','#E89589'
                                //         ];
                                //     return colorList[params.dataIndex];
                                // }
                                color:function(d){return "#"+Math.floor(Math.random()*(256*256*256-1)).toString(16);}
                            },
                            //鼠标悬停时：
                            emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        barWidth : 30,//柱图宽度
                    },
                ]
            };
            chartUS.setOption(option);
        },
        //提交校验会员办理or会员续费信息
        handleSubmit(formName) {
            let _this=this;
            this.$refs[formName].validate((valid) => {
                // this.innerVisible = false;
                if (valid) {
                    // let vipInfo=this.vip_INFO;
                    let params = this.Util.deepCopy(this.vip_INFO)
                    params.operatorId = this.Util.userInfo.id
                    // let valId={
                    //     operatorId:this.Util.userInfo.id
                    // }
                    // console.log(_this.vip_INFO)

                    params.expireTime=_this.vip_INFO.expTime;
                    params.effectTime= this.Util.formatDate.format(_this.vip_INFO.effectTime,'yyyy-MM-dd')
                    params.payTime= this.Util.formatDate.format(_this.vip_INFO.payTime,'yyyy-MM-dd hh:mm:ss')
                    // let para=Object.assign(vipInfo,valId)
                    // console.log(para)
                    if(this.isHandle){
                        this.memberAdd(params);
                    }else{
                        // console.log(params)
                        // params.id=vipInfo.vipId;
                        this.memberRenewals(params);
                    }
                 }
              })
        },
        // 会员办理
        memberAdd(para){
            // console.log(para)
            let isCommitted = false;//表单是否已经提交标识，默认为false
            if(isCommitted == false) {
                vipAdd(para).then(res=>{
                    // console.log(res);
                    if(res.code=='SUCCESS'){
                        isCommitted = true;
                        this.$message({
                            type:'success',
                            message:res.msg
                        })
                        this.handleFormVisible = false;
                        this.innerVisible = false;
                        this.handleLoading = false;
                        this.$refs.autotext.inputVal = ''
                        this.getVipList(false);
                        return true;
                    }else{
                        this.$message.error(res.msg)
                    }
                })
            }else {
                return false;
            }
        },
        //根据开始时间查询结束时间
        getExpireTime(){
            let _this = this;
            var params;
            if(!this.isHandle){
                params = {
                    expireTime:this.vip_INFO.expireTime.substring(0,10),
                    applyUnit:this.vip_INFO.applyUnit,
                    applyLength:this.vip_INFO.applyLength
                }
            }else{
                params = {
                    effectTime:this.Util.formatDate.format(_this.vip_INFO.effectTime,'yyyy-MM-dd'),
                    applyUnit:this.applyUnitList,
                    applyLength:this.vip_INFO.applyLength
                }
            }
            getExpireTime(params).then(res=>{
                console.log(res.data)
                if(res.data.code==='SUCCESS'){
                    this.timeAndMoney()
                    this.vip_INFO.expTime = res.data.data.substring(0,10)
                    console.log(res.data.data)
                }else{
                    this.$message.error(res.data.msg)
                }
            })

        },
        // 会员续费
        memberRenewals(params){
            // console.log(params)
            let para={
                applyLength:params.applyLength,
                applyUnit:params.applyUnit,
                expireTime:params.expireTime,
                effectTime:params.effectTime,
                operatorId:params.operatorId,
                payMoney:Number(params.payMoney),
                payType:params.payType,
                payTime:params.payTime,
                remark:params.remark,
                id:params.vipId,
            }
            let isCommitted = false;//表单是否已经提交标识，默认为false
            // console.log(para)
            if(isCommitted == false) {
                feeRenewals(para).then(res=>{
                    // console.log(res)
                    if(res.code=='SUCCESS'){
                        isCommitted = true;
                        this.$message({
                            type:'success',
                            message:res.msg
                        })
                        this.innerVisible = false
                        this.handleFormVisible = false;
                        this.handleLoading = false;
                        this.getVipList(false);
                        return true;
                    }else{
                        this.$message.error(res.msg)
                    }
                })
            } else {
                return false;
            }
        },
        //费用变更
        costChangeSubmit(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                        this.costChangeLoading = false;
                        var para={
                            operatorId:this.Util.userInfo.id,
                            payMoney:Number(this.vip_INFO.payMoney),
                            payType:this.vip_INFO.payType,
                            remark:this.vip_INFO.remark,
                            returnFee:this.vip_INFO.returnFee,
                            id:this.vip_INFO.vipId,
                        };
                        // console.log(para)
                        feeChange(para).then(res=>{
                            // console.log(res)
                            if(res.code=='SUCCESS'){
                                this.$message({
                                    type:'success',
                                    message:res.msg
                                })
                                // this.handleFormVisible = false;
                                this.costChangeFormVisible = false;
                                this.getVipList(false);

                            }else{
                                this.$message({
                                    type:'warning',
                                    message:res.msg
                                })
                            }

                        }).catch(err=>{
                            console.log(err)
                        })
                 }

              })
        },
        //修改信息
        editSubmit(formName){
            let _this=this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.editLoading = false;
                    this.editFormVisible = false;
                    // console.log(this.vip_INFO)
                    // console.log(this.Util.formatDate.format(_this.vip_INFO.expireTime,'yyyy-MM-dd'))
                    var para={
                        carNum:this.vip_INFO.carNum,
                        company:this.vip_INFO.company,
                        idCard:this.vip_INFO.idCard,
                        memberName:this.vip_INFO.memberName,
                        // expTime:this.vip_INFO.expTime,
                        expireTime:this.Util.formatDate.format(_this.vip_INFO.expireTime,'yyyy-MM-dd'),
                        effectTime:this.Util.formatDate.format(_this.vip_INFO.effectTime,'yyyy-MM-dd'),
                        memberRateId:this.vip_INFO.memberRateId,
                        operatorId:this.Util.userInfo.id,
                        phoneNum:this.vip_INFO.phoneNum,
                        remark:this.vip_INFO.remark,
                        id:this.vip_INFO.vipId,
                    };
                    // console.log(para)
                    infoUpdate(para).then(res=>{
                        // console.log(res)
                        if(res.code=='SUCCESS'){
                            this.$message({
                                type:"success",
                                message:res.msg
                            })
                            this.getVipList(false);
                        }else{
                            this.$message.error(res.msg)
                        }
                    })
                 }

              })
        },
        //会员删除
        handleDelete(index, row) {
            // console.log(row)
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
                }).then(() => {
                    let params={
                        operatorId:this.Util.userInfo.id,
                        id:row.id
                    };
                    vipDelete(params).then(res=>{
                        // console.log(res)
                        if(res.code=='SUCCESS'){
                            this.getVipList(false)
                            this.$message({
                                type:'success',
                                message:res.msg
                            })
                        }else{
                            this.$message.error(res.msg)
                        }
                    })
                // this.listLoading = true;
            });
        },
        //同步云端
        syncCloud(index, row) {
            // console.log(row)
            this.$confirm('确认同步该记录吗?', '提示', {
                type: 'warning'
                }).then(() => {
                    let params={
                        id:row.id
                    };
                    syncCloudInfo(params).then(res=>{
                        // console.log(res)
                        if(res.data.code=='SUCCESS'){
                            this.getVipList()
                            this.$message({
                                type:'success',
                                message:res.data.msg
                            })
                        }else{
                            this.$message.error(res.data.msg)
                        }
                    })
                // this.listLoading = true;
            });
        },
        // 会员挂起
        handleHangUp(index,row){
            let para={
                operatorId:this.Util.userInfo.id,
                id:row.id,
            }
            let lockOrUnLock = '挂起'
            row.lockTime ? lockOrUnLock = '解挂' : lockOrUnLock = '挂起'
            row.lockTime ? para.lockOption = false : para.lockOption = true

            // new Promise((resolve,reject)=>{
                this.$confirm(`是否要将车牌号为${row.carNum}的月卡${lockOrUnLock}?`, '提示', {
                    type: 'warning',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    }).then(() => {
                        vipPause(para).then(res=>{
                            // console.log(res)
                            if(res.code=='SUCCESS'){
                                this.$message({
                                    type:'success',
                                    message:res.msg
                                })
                                this.getVipList(false);
                            }else{
                                this.$message.error(res.msg)
                            }
                        })
                }).catch(()=>{

                });
        },
        // 批量删除
        batchDelete(){
            this.$confirm('确认删除选中的记录吗?', '提示', {
                type: 'warning'
                }).then(() => {
                    let selectID=[];
                    for(let i in this.tickedData){
                        selectID.push(this.tickedData[i].id);
                    };
                    let params ={
                        idList:selectID,
                        operatorId:this.Util.userInfo.id
                    }
                    // console.log(para)
                    vipBatchDelete(params).then(res=>{
                        // console.log(res)
                        if(res.code=='SUCCESS'){
                            this.getVipList(false)
                            this.$message({
                                type:'success',
                                message:res.msg,
                            })
                            this.getVipList(false);
                        }else{
                            this.$message.error(res.msg)
                        }
                    })
                });


        },
        // 修改失效时间
        timeChange(){
            let end=new Date(this.vip_INFO.effectTime).getTime()+this.editTimelength;
            this.vip_INFO.expTime=this.Util.formatDate.format(new Date(end),'yy-MM-dd')
            this.vip_INFO.expireTime=new Date(end);
        },

        // 计算失效时间和缴纳金额
        timeAndMoney(expireTime){
            let days= this.vip_INFO.applyUnit;
            let rateId= this.vip_INFO.memberRateId;
            let timeLong=Number(this.vip_INFO.applyLength);
            // console.log(start)
            // console.log(days)
            // console.log(rateId)
            // console.log(timeLong)
            if(days === '天'){
                this.vip_INFO.payMoney=this.computeFeesMoney(rateId,'0',timeLong);
            }else if(days === '月'){
                this.vip_INFO.payMoney = this.computeFeesMoney(rateId,'1',timeLong);

            }else{
                // this.vip_INFO.expTime = start?this.computeFailureTime(start,timeLong,'2') : '';
                this.vip_INFO.payMoney = this.computeFeesMoney(rateId,'2',timeLong);
            }

        },
        // 转换时间字符串
        changeTimeStr(time){
           return time?this.Util.formatDate.format(time,'yy-MM-dd'):''
        },
        /**
         * 功能:计算缴费金额
         * id:会员标准ID
         * state:办理单位 0:天 1:月 2:年
         * timeLong:办理时长 number
         * */
        computeFeesMoney(id,state,timeLong){
            // console.log(id)
            // console.log(state)
            // console.log(timeLong)
            //根据会员标准id获取会员标准收费
            let price = 0
            for(let i=0;i<this.RateList.length;i++){
                if(id==this.RateList[i].id){
                    if(state==='0'){
                        price = this.RateList[i].dayMoney;
                    }else if(state==='1'){
                         price = this.RateList[i].monthMoney;
                    }else{
                         price = this.RateList[i].yearMoney;
                    }
                }
            }
            // console.log(price)
            return price*Number(timeLong)
        },
        /**
         * 功能:计算失效时间
         * startTime:起始时间   new Date()
         * timeLong:时间长度 number
         * state:业务办理单位 0:天 1:月 2:年
         * */
        computeFailureTime(startTime,timeLong,state){
            console.log(this.Util.formatDate.format(startTime,'yyyy-MM-dd') )
            console.log(timeLong)
            console.log(state)
            let timeStamp = startTime.getTime();

            if(state=='0'){
                let dates = 0
                if(this.isHandle){
                    dates = (timeLong-1)*24*3600*1000;
                }else{
                     dates = (timeLong)*24*3600*1000;
                }
                return this.fmtDate(timeStamp+dates);
            }else if(state=='1'){
                Date.isLeapYear = function (year) {
                    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
                };

                Date.getDaysInMonth = function (year, month) {
                    return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
                };

                Date.prototype.isLeapYear = function () {
                    return Date.isLeapYear(this.getFullYear());
                };

                Date.prototype.getDaysInMonth = function () {
                    return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
                };
                Date.prototype.addMonths = function (value) {
                    var n = this.getDate();
                    this.setDate(1);
                    this.setMonth(this.getMonth() + value);
                    this.setDate(Math.min(n, this.getDaysInMonth()));
                    return this;
                };
                var InitialValue = this.Util.formatDate.format(startTime,'yyyy-MM-dd');
                var myDate = new Date(InitialValue);
                // var result1 = myDate.addMonths(1);
                var result1;
                var dateTime;
                // if(timeLong==="1"){
                //     alert(1)
                //     result1 = myDate.addMonths(1);
                // }else{
                //     alert(2)
                //     result1 = myDate.addMonths(timeLong);
                // }
                result1 = myDate.addMonths(timeLong);


                if(this.isHandle){
                    dateTime = result1.setDate(result1.getDate()-1);
                    return this.Util.formatDate.format(result1,'yyyy-MM-dd');
                }else{
                    dateTime = result1.setDate(result1.getDate());
                    return this.Util.formatDate.format(result1,'yyyy-MM-dd');
                }
                // let y = 1900+startTime.getYear();
                // let m = (startTime.getMonth()+1);
                //
                // let stamp=null;
                // for(let i=0;i<timeLong;i++){
                //     stamp += (this.mGetDate(y,m++));
                // }
                // if(this.isHandle){
                //     console.log(this.fmtDate(timeStamp+(stamp-1)*24*3600*1000))
                //     return this.fmtDate(timeStamp+(stamp-1)*24*3600*1000);
                // }else{
                //      return this.fmtDate(timeStamp+(stamp)*24*3600*1000);
                // }
                // return this.fmtDate(timeStamp+(stamp-1)*24*3600*1000);
            }else{
                let y = 1900+startTime.getYear();
                let m = new Date(startTime).getMonth()+1<10 ? '0' + (new Date(startTime).getMonth()+1) : (new Date(startTime).getMonth()+1);
                let d = new Date(startTime).getDate()<10 ? '0' + (new Date(startTime).getDate()) : (new Date(startTime).getDate());
                for (let i=0;i<timeLong;i++){
                    y = y+1
                }
                // return y+'-'+m+'-'+d
                // let dates=0;
                // console.log(this.fmtDate(timeStamp+((dates-1)*24*3600*1000)))
                // return this.fmtDate(timeStamp+((dates-1)*24*3600*1000));
                // let dates=0;
                //
                // for(let i=0;i<timeLong;i++){
                //     y = y+1
                //     if(this.isLeapYear(y)){
                //         dates += 366
                //     }else{
                //         dates += 365
                //
                //     }
                // }
                if(this.isHandle){
                    return y+'-'+m+'-'+(d-1)
                }else{
                    return y+'-'+m+'-'+d
                }
                // return this.fmtDate(timeStamp+((dates-1)*24*3600*1000));
            }
        },

        /**
         * 功能: 时间戳转'yyyy-MM-dd'格式时间
         * time: 时间戳
         * return String
         * */
        fmtDate(time){
            var date =  new Date(time);
            var y = 1900+date.getYear();
            var M = "0"+(date.getMonth()+1);
            var d = "0"+date.getDate();
            return y+"-"+M.substring(M.length-2,M.length)+"-"+d.substring(d.length-2,d.length);
        },

        //获取当年月份的天数
        mGetDate(year, month){
            var d = new Date(year, month, 0);
            // console.log(`${year}:${month}:${d}`)
            return d.getDate();
        },
        //判断是否是润年
        isLeapYear(year) {
            return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)
        },

    }
}


</script>

<style lang="scss" scoped>
#vipInfo{
    width: inherit;
    .lookBar{
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        background-color:white;
        border: 1px solid #ccc;
        z-index: 100;
        // padding-top: 20px;
        .BarTitle{
            padding: 5px 20px;
            background-color: black;
            position: relative;
            color: white;

        }
        .BarTitle-ii{
            position: absolute;
            right: 20px;
            top: 5px;
            // display: inline-block;
            color: white;
            // width: 20px;
            // height: 20px;
            &:hover{
                color: red;
                cursor: pointer;
            }
        }
    }
    .Description{
        margin-top:10px;
        .pay-notice {
            display: inline-block;
            width: 20px;
            height: 20px;
        }
        .bg-danger {
            background-color: $color-danger;
        }
    }
    .FA-toolbar{
        .el-form{
            width: inherit;
            .selControlTime{
                width: 9%;
            }
            .selControl{
                width: 11%;
            }
            .effectTime{
                width: 260px;
                .el-form-item__content{
                    width: 100%;
                    .el-range-editor.el-input__inner{
                        width: 100%;
                    }
                    .el-date-editor .el-range-separator{
                        width: 10%;
                    }
                    .el-date-editor .el-range__close-icon{
                        display: none;
                    }
                }
            }
            .selCondition{
                width: 160px;
            }
            .selCheckbox{
                min-width: 220px;
                .el-checkbox-group{
                    display: inline-block;
                }
                .el-checkbox+.el-checkbox{
                    margin-left: 15px;
                }
            }
        }
    }
    .grid-content {
        .el-input{
            width: 219px;
        }
        .el-input-number{
            width: 219px;
        }
        .el-input--suffix .el-input__inner {
            /*width: 214px;*/
        }
    }
    .key-board {
        .el-input{
                width: 214px;
            }
        .el-popover__reference {
            font-size: 12px;
        }
        .el-input-number{
                width: 214px;
                font-size: 12px;
            }
    }
    .printVIPInfo{
        .el-popover__reference{
        // width: 214px;
            font-size: 24px;
            font-weight: bold;
        &:hover{
             cursor: pointer;
         }
        }
    }

    .el-popover {
      .el-button{
          display: block;
          background: red;
        }
    }

    .handleTran{
        text-align: center;
        padding: 5px 0;
        border-bottom: 1px solid #eee;
        color: #333;
        cursor: pointer;
        &:hover{
            background-color: #C0DBFB !important;
            color: #363636;
        }
    }
}
</style>

  <style>
      .handleTran:hover{
          background-color: #FC813B !important;
          color: #363636;
      }
      /* table行背景及字体颜色 */
      .el-table .danger-row {
          background: #ebcbcb;
      }

      .el-table .success-row {
          background: #deefd8;
      }

      .el-table .danger-text {
          color: #F56C6C;
      }

      .current-row > td {
          background: #FFA54F !important;
          cursor: pointer;
      }
  </style>

