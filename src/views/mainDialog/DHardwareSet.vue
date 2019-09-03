<template>
    <section>
        <!-- 弹窗-岗亭硬件设置 -->
        <el-dialog class="form-dialog" title="硬件设置"  width="96%" :visible.sync="hardwareSetProp.visible" @open="listenOpenDialog" @closed="listenCloseDialog" :close-on-click-modal="false">
            <div class="dialog-box">
                <el-tabs @tab-click="tabClick" type="border-card">
                    <el-tab-pane label="岗亭硬件设置" v-if="markDevice" >
                        <el-row style="padding-top:10px;">
                            <el-col :span="24">
                                <div class="gateBtn">
                                    <el-button :class="item.id==gateIDPrimary?'elPrimary':''" v-for="item in gateList" :key="item.id" @click="getGateInfo(item.id)">{{item.gateName}}</el-button>
                                    <p class="text-center text-warning" v-show="!gateList">请先在停车场设置处配置岗亭</p>
                                </div>
                                <div class="gateInfo">
                                    <el-button type="primary" style="float:right" size="small" @click="openHardwareDialog('增加硬件')" v-if="markDeviceAdd">增加硬件</el-button>
                                    <div class="body-table">
                                        <h4 class="text-left">摄像头</h4>
                                        <el-table :data="cameraList" highlight-current-row border>
                                            <el-table-column type="index" width="50" >
                                            </el-table-column>
                                            <el-table-column prop="deviceName" label="设备名称" min-width="100">
                                            </el-table-column>
                                            <el-table-column prop="position" label="所属车道" min-width="80" :formatter="formatPosition">
                                            </el-table-column>
                                            <el-table-column prop="direction" label="出入口类型" min-width="100"  :formatter="formatDirection">
                                            </el-table-column> 
                                            <el-table-column prop="openFlag" label="设备状态" min-width="80"  :formatter="formatOpenFlag">
                                            </el-table-column> 
                                            <el-table-column prop="deviceAccount" label="链接用户名" min-width="100" >
                                            </el-table-column>                    									
                                            <el-table-column prop="deviceIp" label="IP地址" min-width="120"  >
                                            </el-table-column>
                                            <el-table-column prop="devicePort" label="端口" min-width="80" >
                                            </el-table-column> 	
                                            <el-table-column prop="deviceNo" label="设备编号" min-width="120" >
                                            </el-table-column> 
                                            <el-table-column prop="name" label="设备型号" min-width="120" >
                                            </el-table-column> 
                                            <el-table-column prop="videoPath" label="rtmp地址" min-width="150" >
                                            </el-table-column>     
                                            <el-table-column prop="videoPath2" label="rtsp地址" min-width="150" >
                                            </el-table-column>                                                                                     
                                            <el-table-column prop="note" label="操作" min-width="120" >
                                                <template slot-scope="scope">
                                                    <a href="javaScript:;" class="text-blue" @click="openHardwareDialog('修改硬件',scope.$index, scope.row)" v-if="markDeviceUpdate"><i class="el-icon-edit"></i>修改&nbsp&nbsp</a>
                                                    <a href="javaScript:;" class="text-danger" @click="handleDel(scope.$index, scope.row)" v-if="markDeviceDelete"><i class="el-icon-delete"></i>删除</a>    
                                                </template>                                
                                            </el-table-column>                                                  					
                                        </el-table> 
                                    </div>                          
                                    <div class="body-table">
                                        <h4 class="text-left">闸机</h4>
                                        <el-table :data="sluiceList" highlight-current-row border>
                                            <el-table-column type="index" width="50" >
                                            </el-table-column>
                                            <el-table-column prop="deviceName" label="设备名称" min-width="100" >
                                            </el-table-column>
                                            <el-table-column prop="position" label="所属车道" min-width="80" :formatter="formatPosition">
                                            </el-table-column>
                                            <el-table-column prop="direction" label="出入口类型" min-width="100" :formatter="formatDirection" >
                                            </el-table-column> 
                                            <el-table-column prop="openFlag" label="设备状态" min-width="80"  :formatter="formatOpenFlag">
                                            </el-table-column> 
                                            <el-table-column prop="deviceIp" label="IP地址" min-width="120"  >
                                            </el-table-column>
                                            <el-table-column prop="devicePort" label="端口" min-width="80" >
                                            </el-table-column> 	
                                            <el-table-column prop="openCommand" label="开闸命令" min-width="100" >
                                            </el-table-column> 
                                            <el-table-column prop="openCommand2" label="开闸命令2" min-width="100" >
                                            </el-table-column>                                             
                                            <el-table-column prop="closeCommand" label="关闸命令" min-width="100" >
                                            </el-table-column> 
                                           <el-table-column prop="closeCommand2" label="关闸命令2" min-width="100" >
                                            </el-table-column>                                            
                                            <el-table-column prop="deviceNo" label="设备编号" min-width="120" >
                                            </el-table-column> 
                                            <el-table-column prop="name" label="设备型号" min-width="120" >
                                            </el-table-column> 
                                            <el-table-column prop="note" label="操作" min-width="120" >
                                                <template slot-scope="scope">
                                                    <a href="javaScript:;" class="text-blue" @click="openHardwareDialog('修改硬件',scope.$index, scope.row)" v-if="markDeviceUpdate"><i class="el-icon-edit"></i>修改&nbsp&nbsp</a>
                                                    <a href="javaScript:;" class="text-danger" @click="handleDel(scope.$index, scope.row)" v-if="markDeviceDelete"><i class="el-icon-delete"></i>删除</a> 
                                                </template>                                
                                            </el-table-column>                                                  					
                                        </el-table> 
                                    </div>                          
                                    <div class="body-table">
                                        <h4 class="text-left">LED屏</h4>
                                        <el-table :data="gateLedList" highlight-current-row border>
                                            <el-table-column type="index" width="50" >
                                            </el-table-column>
                                            <el-table-column prop="deviceName" label="设备名称" min-width="100" >
                                            </el-table-column>
                                            <el-table-column prop="position" label="所属车道" min-width="80" :formatter="formatPosition">
                                            </el-table-column>
                                            <el-table-column prop="direction" label="出入口类型" min-width="100" :formatter="formatDirection" >
                                            </el-table-column> 
                                            <el-table-column prop="openFlag" label="设备状态" min-width="80"  :formatter="formatOpenFlag">
                                            </el-table-column> 
                                            <el-table-column prop="deviceIp" label="IP地址" min-width="120"  >
                                            </el-table-column>
                                            <el-table-column prop="devicePort" label="端口" min-width="80" >
                                            </el-table-column>                                
                                            <el-table-column prop="name" label="设备型号" min-width="120" >
                                            </el-table-column> 
                                            <el-table-column prop="displayInfo" label="展示信息1" min-width="120" >
                                            </el-table-column> 
                                            <el-table-column prop="displayInfo2" label="展示信息2" min-width="120" >
                                            </el-table-column>                                             
                                            <el-table-column prop="note" label="操作" min-width="120" >
                                                <template slot-scope="scope">
                                                    <a href="javaScript:;" class="text-blue" @click="openHardwareDialog('修改硬件',scope.$index, scope.row)" v-if="markDeviceUpdate"><i class="el-icon-edit"></i>修改&nbsp&nbsp</a>
                                                    <a href="javaScript:;" class="text-danger" @click="handleDel(scope.$index, scope.row)" v-if="markDeviceDelete"><i class="el-icon-delete"></i>删除</a>                                         
                                                </template>                                
                                            </el-table-column>                                                  					
                                        </el-table> 
                                    </div>                          
                                </div>
                            </el-col>
                        </el-row>                         
                    </el-tab-pane>
                    <el-tab-pane label="硬件型号管理" v-if="markDeviceType" >
                        <el-row class="content">
                            <el-col :span="24" class="content-body">
                                <div class="body-top clearfix">
                                    <div class="body-top-left">
                                        <el-select class="width-120" v-model="searchType" placeholder="请选择" @change="getDeviceTypeList(true)">
                                            <el-option label="全部类型" value=""></el-option>
                                            <el-option label="摄像头" :value="1"></el-option>
                                            <el-option label="闸机" :value="2"></el-option>
                                            <el-option label="LED" :value="3"></el-option>
                                        </el-select>                    
                                        <el-input class="width-200" v-model.trim="searchValue" @keyup.enter.native ="getDeviceTypeList(true)" placeholder="请输入设备型号关键字" clearable ></el-input>
                                        <el-button type="primary" size="mini" @click="getDeviceTypeList(true)" >查询</el-button>
                                    </div>
                                    <div class="body-top-right text-right">
                                        <el-button type="primary" size="mini" @click="openDevicesTypeDialog('新增')" v-if="markDeviceTypeAdd">新增</el-button>
                                    </div>
                                </div>
                                <div class="body-table" >
                                        <!--列表-->
                                        <el-table :data="devicesTypeList"  sortable height="539" >
                                            <el-table-column type="index"  min-width="80" >
                                            </el-table-column>  
                                            <el-table-column prop="type" label="设备类型" min-width="80" sortable >
                                                <template slot-scope="scope">
                                                    <span>{{scope.row.type | transformDeviceType}}</span>
                                                </template>                                
                                            </el-table-column>                                                       
                                            <el-table-column prop="name" label="设备型号" min-width="90" sortable >
                                            </el-table-column>
                                            <el-table-column prop="company" label="设备厂家" min-width="90" sortable >
                                            </el-table-column>    
                                            <el-table-column prop="telephone" label="厂商联系方式" min-width="90" sortable >
                                            </el-table-column>                                                      
                                            <el-table-column prop="createTime" label="添加时间" min-width=110 sortable show-overflow-tooltip >
                                                <template slot-scope="scope">
                                                    <span>{{scope.row.createTime | transformTime}}</span>
                                                </template>                                
                                            </el-table-column> 
                                            
                                            <el-table-column prop="remark" label="备注" min-width="130" sortable show-overflow-tooltip >
                                            </el-table-column>    
                                            <el-table-column label="操作" min-width="120"  >
                                                <template slot-scope="scope">
                                                    <a href="javaScript:;" class="text-blue" @click="openDevicesTypeDialog('修改',scope.row)" v-if="markDeviceTypeUpdate"><i class="el-icon-edit"></i>修改</a>
                                                    <a href="javaScript:;" class="text-danger" @click="deleteDeviceType(scope.row)" v-if="markDeviceTypeDelete"><i class="el-icon-delete"></i>删除</a>
                                                </template>                                
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
                    </el-tab-pane>
                </el-tabs>          
            </div>            
   	
        </el-dialog> 
        <!-- 弹窗-增加/修改硬件 -->
        <el-dialog class="form-dialog" :title="hardwareDialogTitle" width="50%" :visible.sync="hardwareVisible"  @close="listenCloseHardwareDialog"  >
            <el-form :model="hardwareFormData" :rules="rulesHardwareFormData" class="form-padding" ref="hardwareFormData">
                <el-form-item label="设备类型" :label-width="formLabelWidth" >
                    <el-radio-group v-model="hardwareFormData.deviceType" @change="deviceTypeChange">
                        <el-radio :label="0" :disabled="hardwareDialogTitle==='修改硬件'">摄像头</el-radio>
                        <el-radio :label="1" :disabled="hardwareDialogTitle==='修改硬件'">闸机</el-radio>
                        <el-radio :label="2" :disabled="hardwareDialogTitle==='修改硬件'">LED屏</el-radio>
                    </el-radio-group>
                </el-form-item>                
                <el-form-item label="出入口类型" :label-width="formLabelWidth" >
                    <el-select v-model="hardwareFormData.direction" placeholder="请选择">
                        <el-option label="入口" :value="1"></el-option>
                        <el-option label="出口" :value="0"></el-option>
                    </el-select>
                </el-form-item>                           
                <el-form-item label="所属车道" :label-width="formLabelWidth" >
                    <el-select v-model="hardwareFormData.position" placeholder="请选择">
                        <el-option label="单车道" :value="0"></el-option>
                        <el-option label="左车道" :value="1"></el-option>
                        <el-option label="右车道" :value="2"></el-option>
                    </el-select>
                </el-form-item>                           
                <el-form-item label="设备状态" :label-width="formLabelWidth" >
                    <el-select v-model="hardwareFormData.openFlag" placeholder="请选择">
                        <el-option label="开启" :value="1"></el-option>
                        <el-option label="关闭" :value="0"></el-option>
                    </el-select>
                </el-form-item>   
                <el-form-item label="设备名称" :label-width="formLabelWidth" prop="deviceName">
                    <el-select v-model="hardwareFormData.deviceName" placeholder="请选择" v-if="hardwareFormData.deviceType === 0">
                        <el-option label="摄像头1" value="摄像头1"></el-option>
                        <el-option label="摄像头2" value="摄像头2"></el-option>
                        <el-option label="摄像头3" value="摄像头3"></el-option>
                        <el-option label="摄像头4" value="摄像头4"></el-option>
                    </el-select>     
                    <el-select v-model="hardwareFormData.deviceName" placeholder="请选择" v-if="hardwareFormData.deviceType === 1">
                        <el-option label="闸机1" value="闸机1"></el-option>
                        <el-option label="闸机2" value="闸机2"></el-option>
                    </el-select>    
                    <el-select v-model="hardwareFormData.deviceName" placeholder="请选择" v-if="hardwareFormData.deviceType === 2">
                        <el-option label="LED1" value="LED1"></el-option>
                        <el-option label="LED2" value="LED2"></el-option>
                    </el-select>                                                    
                </el-form-item>                                         
                <el-form-item label="设备型号" :label-width="formLabelWidth" prop="deviceTypeId">
                    <el-select v-model="hardwareFormData.deviceTypeId" placeholder="请选择" v-if="hardwareFormData.deviceType === 0">
                        <el-option v-for="item in cameraDeviceTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>     
                    <el-select v-model="hardwareFormData.deviceTypeId" placeholder="请选择" v-if="hardwareFormData.deviceType === 1">
                        <el-option v-for="item in sluiceDeviceTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>    
                    <el-select v-model="hardwareFormData.deviceTypeId" placeholder="请选择" v-if="hardwareFormData.deviceType === 2">
                        <el-option v-for="item in ledDeviceTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>                     
                </el-form-item>
                <el-form-item label="设备编号" v-show="hardwareFormData.deviceType!=2" :label-width="formLabelWidth"  maxlength="20">
                    <el-input v-model.trim="hardwareFormData.deviceNo" class="width-230" clearable auto-complete="off" maxlength="20" placeholder="在此输入设备编号"></el-input>
                </el-form-item>   
                <el-form-item label="设备IP" :label-width="formLabelWidth" prop="deviceIp">
                    <el-input v-model.trim="hardwareFormData.deviceIp" class="width-230" clearable auto-complete="off" placeholder="请输入设备IP"></el-input>
                </el-form-item> 
                <el-form-item label="设备端口"  :label-width="formLabelWidth" prop="devicePort">
                    <el-input v-model.trim="hardwareFormData.devicePort" class="width-230" clearable auto-complete="off" placeholder="请输入设备端口"></el-input>
                </el-form-item> 
                <el-form-item label="登录名" v-show="hardwareFormData.deviceType==0" :label-width="formLabelWidth" prop="deviceAccount">
                    <el-input v-model.trim="hardwareFormData.deviceAccount" class="width-230" clearable auto-complete="off" placeholder="请输入设备登录名"></el-input>
                </el-form-item> 
                <el-form-item label="登录密码" v-show="hardwareFormData.deviceType==0" :label-width="formLabelWidth" prop="devicePassword">
                    <el-input v-model.trim="hardwareFormData.devicePassword" class="width-230" clearable auto-complete="off" placeholder="请输入设备登录密码"></el-input>
                </el-form-item>    
                <el-form-item label="rtmp地址" v-show="hardwareFormData.deviceType==0" :label-width="formLabelWidth" prop="videoPath">
                    <el-input v-model.trim="hardwareFormData.videoPath"  clearable auto-complete="off" placeholder="请输入rtmp地址"></el-input>
                </el-form-item>    
                <el-form-item label="rtsp地址" v-show="hardwareFormData.deviceType==0" :label-width="formLabelWidth" prop="videoPath2">
                    <el-input v-model.trim="hardwareFormData.videoPath2"  clearable auto-complete="off" placeholder="请输入rtsp地址"></el-input>
                </el-form-item>                  
                                       
                <el-form-item label="开闸命令1" v-show="hardwareFormData.deviceType==1" :label-width="formLabelWidth" prop="openCommand">
                    <el-input v-model.trim="hardwareFormData.openCommand" class="width-230" clearable auto-complete="off" placeholder="请输入开闸命令1"></el-input>
                    <a class="text-orange" href="javaScript:;" @click="testOpenSluice(0,hardwareFormData.openCommand)">&nbsp&nbsp<i class="el-icon-refresh"></i>测试开闸</a>
                </el-form-item> 
                <el-form-item label="开闸命令2" v-show="hardwareFormData.deviceType==1" :label-width="formLabelWidth" prop="openCommand2">
                    <el-input v-model.trim="hardwareFormData.openCommand2" class="width-230" clearable auto-complete="off" placeholder="请输入开闸命令2"></el-input>
                    <a class="text-orange" href="javaScript:;" @click="testOpenSluice(0,hardwareFormData.openCommand2)">&nbsp&nbsp<i class="el-icon-refresh"></i>测试开闸</a>
                </el-form-item>                 
                <el-form-item label="关闸命令1" v-show="hardwareFormData.deviceType==1" :label-width="formLabelWidth" prop="closeCommand">
                    <el-input v-model.trim="hardwareFormData.closeCommand" class="width-230" clearable auto-complete="off" placeholder="请输入关闸命令1"></el-input>
                    <a class="text-orange" href="javaScript:;" @click="testOpenSluice(1,hardwareFormData.closeCommand)">&nbsp&nbsp<i class="el-icon-refresh"></i>测试关闸</a>
                </el-form-item>        
                <el-form-item label="关闸命令2" v-show="hardwareFormData.deviceType==1" :label-width="formLabelWidth" prop="closeCommand2">
                    <el-input v-model.trim="hardwareFormData.closeCommand2" class="width-230" clearable auto-complete="off" placeholder="请输入关闸命令2"></el-input>
                    <a class="text-orange" href="javaScript:;" @click="testOpenSluice(1,hardwareFormData.closeCommand2)">&nbsp&nbsp<i class="el-icon-refresh"></i>测试关闸</a>
                </el-form-item>                        
                <el-form-item label="展示信息1" v-show="hardwareFormData.deviceType==2" :label-width="formLabelWidth" prop="displayInfo">
                    <el-input v-model.trim="hardwareFormData.displayInfo" class="width-230" clearable auto-complete="off" placeholder="请输入LED展示信息1"></el-input>
                    <a class="text-orange" href="javaScript:;" @click="testOpenLed(hardwareFormData.displayInfo)">&nbsp&nbsp<i class="el-icon-refresh"></i>测试展示</a>
                </el-form-item> 
                <el-form-item label="展示信息2" v-show="hardwareFormData.deviceType==2" :label-width="formLabelWidth" prop="displayInfo2">
                    <el-input v-model.trim="hardwareFormData.displayInfo2" class="width-230" clearable auto-complete="off" placeholder="请输入LED展示信息2"></el-input>
                    <a class="text-orange" href="javaScript:;" @click="testOpenLed(hardwareFormData.displayInfo2)">&nbsp&nbsp<i class="el-icon-refresh"></i>测试展示</a>
                </el-form-item>                                 
            </el-form>
            <div slot="footer" >
                <el-button @click="hardwareVisible = false">取 消</el-button>
                <el-button type="primary" @click="deviceInfonSubmit">确 定</el-button>
            </div>            
        </el-dialog>
        <!-- 弹窗-新增/修改设备型号 -->
        <el-dialog :title="devicesTypeDialogTitle" width="40%" @close="listenCloseDevicesTypeDialog" :visible.sync="devicesTypeAddVisible" :close-on-click-modal="false">
            <div>
                <el-form label-position="left" label-width="100px" :model="formData" :rules="formDataRules" ref="formData" >
                    <el-form-item  label="设备类型:" prop="type">
                        <el-select class="width-120" v-model="formData.type" placeholder="请选择设备类型" @change="searchValue = ''">
                            <el-option label="摄像头" :value="1"></el-option>
                            <el-option label="闸机" :value="2"></el-option>
                            <el-option label="LED" :value="3"></el-option>
                        </el-select>                                            
                    </el-form-item>		
                    <el-form-item  label="设备型号:" prop="name">
                        <el-input class="width-180" v-model.trim="formData.name" clearable placeholder="请输入设备型号" ></el-input>
                    </el-form-item>	      
                    <el-form-item  label="设备厂家:" prop="company">
                        <el-input class="width-180" v-model.trim="formData.company" clearable placeholder="请输入设备厂家" ></el-input>
                    </el-form-item>	                                  				
                    <el-form-item  label="厂商联系方式:" prop="telephone">
                        <el-input class="width-180" v-model.trim="formData.telephone" clearable placeholder="请输入厂商联系方式" ></el-input>
                    </el-form-item>	            
                    <el-form-item  label="备注:" prop="remark">
                        <el-input v-model.trim="formData.remark" clearable placeholder="请输入备注" >
                        </el-input>
                    </el-form-item>	
                </el-form>
                <div  class="dialog-footer text-right">
                    <el-button class="footer-btn" @click="devicesTypeAddVisible = false">取消</el-button>
                    <el-button class="footer-btn" type="primary" @click="devicesTypeSubmit('formData')" >确认</el-button>
                </div>					
            </div>	
        
        </el-dialog>        
    </section>
</template>

<script>
	import { mapGetters} from 'vuex'
    import {base,addCamera,addGateLed,addSluice,updateCamera,updateSluice,updateLed,deleteDevice,listDeviceInfo,
            addDeviceType,deleteDeviceType,updateDeviceType,openDeviceType,getDeviceTypeList,sluiceDeviceTest,ledDeviceTest
    } from '@/api/api'
    
export default {
    props: [ 'hardwareSetProp' ],
    data(){
        return {
            pageSize:10,
            dataTotal:0,
            currentPage:1,                

            searchType:'',                  //查询类型
            searchValue:'',                 //查询值

            formLabelWidth: '120px',
            hardwareVisible:false,          //控制弹窗显示隐藏
            hardwareDialogTitle:'增加硬件',  //增加/修改硬件标题
            gateIDPrimary:'',               //当前选中的岗亭
            cameraList:[],                  //摄像头列表
            sluiceList:[],                  //闸机列表
            gateLedList:[],                 //LED凛列表
            cameraDeviceTypeList:[],        //摄像头型号列表
            sluiceDeviceTypeList:[],        //闸机型号列表
            ledDeviceTypeList:[],           //LED型号列表

            hardwareFormData:{
                gateId:'',
                deviceType:0,
                direction:0,
                position:0,
                openFlag:1,
                deviceName:'摄像头1',
                deviceTypeId:'',
                deviceNo:'',
                deviceIp:'192.168.1.200',
                devicePort:'80',
                deviceAccount:'admin',
                devicePassword:'admin',
                displayInfo:'',
                displayInfo2:'',
                openCommand:'',
                openCommand2:'',
                closeCommand:'',
                closeCommand2:'',
                videoPath:'',
                videoPath2:'',
            },
            rulesHardwareFormData:{
                deviceName: [
                    { required: true, message: '请输入设备名称', trigger: 'blur' },
                ],
                deviceTypeId: [
                    { required: true, message: '请输入设备型号', trigger: 'blur' },
                ],
                deviceIp: [
                    { required: true, message: '请输入设备IP', trigger: 'blur' },
                ],
                devicePort: [
                    { required: true, message: '请输入设备端口', trigger: 'blur' },
                ],
                deviceAccount: [
                    { required: true, message: '请输入登录名', trigger: 'blur' },
                ],
                devicePassword: [
                    { required: true, message: '请输入登录密码', trigger: 'blur' },
                ],
                openCommand: [
                    { required: true, message: '请输入开闸命令', trigger: 'blur' },
                ],
                closeCommand: [
                    { required: true, message: '请输入关闸命令', trigger: 'blur' },
                ],
                displayInfo: [
                    { required: true, message: '请输入展示信息', trigger: 'blur' },
                ],
                videoPath: [
                    { required: true, message: '请输入视频播放地址', trigger: 'blur' },
                ],  
                videoPath2: [
                    { required: true, message: '请输rtsp地址', trigger: 'blur' },
                ],                              
                
            },

            devicesTypeList:[],
            devicesTypeAddVisible:false,
            devicesTypeDialogTitle:'新增',
            formData:{
                "company": "",
                "name": "",
                "openFlag": "",
                "operatorId": "",
                "remark": "",
                "telephone": "",
                "type": ""
            },
            //表单数据验证
            formDataRules:{
                name: [
                        { required: true, message: '请输入设备型号', trigger: 'blur' },
                ],
                company: [
                        { required: true, message: '设备厂商', trigger: 'blur' },
                ]
            },
            
            markDevice:false,
            markDeviceAdd:false,
            markDeviceUpdate:false,
            markDeviceDelete:false,
            markDeviceType:false,
            markDeviceTypeAdd:false,
            markDeviceTypeUpdate:false,
            markDeviceTypeDelete:false,

        }
    },
    computed: {
        ...mapGetters({
            gateList: 'getGateList',	
        })
    },    
    filters:{
        transformDeviceType(value){
            return value === 1 ? '摄像头' :  value === 2 ? '闸机' : value === 3 ? 'LED' : '未知'
        }
    },
    mounted(){
        this.markDevice = this.Util.isPermission('markDevice')
        this.markDeviceAdd = this.Util.isPermission('markDeviceAdd')
        this.markDeviceUpdate = this.Util.isPermission('markDeviceUpdate')
        this.markDeviceDelete = this.Util.isPermission('markDeviceDelete')
        this.markDeviceType = this.Util.isPermission('markDeviceType')
        this.markDeviceTypeAdd = this.Util.isPermission('markDeviceTypeAdd')
        this.markDeviceTypeUpdate = this.Util.isPermission('markDeviceTypeUpdate')
        this.markDeviceTypeDelete = this.Util.isPermission('markDeviceTypeDelete')
    },    
    methods:{
        //监听打开弹窗
        listenOpenDialog(){
            this.hardwareFormData.gateId=this.hardwareSetProp.gateId
            this.getGateInfo(this.hardwareSetProp.gateId)           								
        },        
        //监听关闭弹窗
        listenCloseDialog(){
            this.$emit('listenCloseMainDialog') 									
        },  
        //转换车道
        formatPosition(row){
            return row.position === 0 ? '单车道'  :row.position === 1 ? '左车道' : row.position === 2 ? '右车道':'单车道'
        },
        //转换车进出口
        formatDirection(row){
            return row.direction === 0 ? '出口' : '入口'
        },
        // 转换设备状态
        formatOpenFlag(row){
            return row.openFlag === 0 ? '关闭' : '开启'
        },
        /**
         * 打开硬件增加/修改弹窗
         * @param {String} title 弹窗标题(必传),只能传"增加硬件"和"修改硬件",用于判断打开的弹窗类型
         * @param {String} index 行索引(修改时传),
         * @param {Object} row 行对象(修改时传),
         * return object
         */        
        openHardwareDialog(title,index,row){
            this.hardwareVisible = true;
            //数据初始化
            this.hardwareDialogTitle = title;
            this.hardwareFormData.deviceType = 0;
            this.hardwareFormData.direction = 0
            this.hardwareFormData.position = 0
            this.hardwareFormData.openFlag = 1
            this.hardwareFormData.deviceName = '摄像头1'
            this.hardwareFormData.deviceIp = '192.168.1.200'
            this.hardwareFormData.devicePort = '80'
            this.hardwareFormData.deviceAccount = 'admin'
            this.hardwareFormData.devicePassword = 'admin'
            this.hardwareFormData.deviceTypeId = ''
            //获取设备类型并分类
            let param = {
                name:'',
                type: '',
                current:1,     
                length:10000,
            }
            getDeviceTypeList(param).then(data => {
                // console.log(data)
                if (data.data.code === "SUCCESS") {
                    let tempList =data.data.data.content
                    this.cameraDeviceTypeList = []
                    this.sluiceDeviceTypeList = []
                    this.ledDeviceTypeList = []
                    for(let i = 0,len = tempList.length; i<len; i++){
                        if(tempList[i].type === 1){
                            this.cameraDeviceTypeList.push(tempList[i])
                        }else if(tempList[i].type === 2){
                            this.sluiceDeviceTypeList.push(tempList[i])
                        }else if(tempList[i].type === 3){
                            this.ledDeviceTypeList.push(tempList[i])
                        }
                    }
                    this.hardwareFormData.deviceTypeId = this.cameraDeviceTypeList[0].id


                }
            });    

            // console.log(this.hardwareFormData.gateId)
            if(title === '修改硬件'){
                this.hardwareFormData = this.Util.deepCopy(row)
            }
        }, 
        //监听关闭硬件增加/修改弹窗
        listenCloseHardwareDialog(){
            this.$refs['hardwareFormData'].resetFields()            
            this.hardwareFormData=this.Util.emptyData(this.hardwareFormData)
        },
        //新增时设备类型改变
        deviceTypeChange(){
            if (this.hardwareFormData.deviceType === 0) {
                this.hardwareFormData.deviceName = '摄像头1'
                this.hardwareFormData.deviceTypeId = this.cameraDeviceTypeList[0].id
            }else if(this.hardwareFormData.deviceType === 1){
                this.hardwareFormData.deviceName = '闸机1'
                this.hardwareFormData.deviceTypeId = this.sluiceDeviceTypeList[0].id
            }else if(this.hardwareFormData.deviceType === 2){
                this.hardwareFormData.deviceName = 'LED1'
                this.hardwareFormData.deviceTypeId = this.ledDeviceTypeList[0].id
            }
        },        
        // 通过岗亭id查岗亭硬件配置 
        getGateInfo(gateID){
            // console.log(gateID);
            this.gateIDPrimary = gateID;
            let params={
					gateId:gateID
				}
            listDeviceInfo(params).then(res => {
                    // console.log(res.data)
                    if(res.data.code=='SUCCESS'){
                        this.cameraList=res.data.data.cameraList
                        this.gateLedList=res.data.data.gateLedList
                        this.sluiceList=res.data.data.sluiceList
                    }  else{
                        this.$message.error(res.data.msg)
                    }              

            })
        },
        //删除
        handleDel(index,row){
            let tempString = `您确定要删除" ${row.deviceName} "吗?`

            this.$confirm(tempString, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params={
                    id:row.id,
                    operatorId:this.Util.userInfo.id,
                }
                deleteDevice(params).then(res=>{
                    // console.log(res)
                    if(res.code=='SUCCESS'){
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getGateInfo(this.gateIDPrimary)
                    }  else{
                        this.$message.error(res.msg)
                    }                    

                })
               
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });            
        }, 
        //设备信息提交
        deviceInfonSubmit(){
            //根据设备类型判断调用新增的接口
            let addInfo = this.hardwareFormData.deviceType === 0 ? addCamera : this.hardwareFormData.deviceType === 1 ? addSluice : addGateLed
            //根据设备类型判断调用修改的接口
            let updateInfo = this.hardwareFormData.deviceType === 0 ? updateCamera : this.hardwareFormData.deviceType === 1 ?updateSluice : updateLed
            let params = this.Util.deepCopy(this.hardwareFormData) 

            params.operatorId = this.Util.userInfo.id

            if(this.hardwareDialogTitle === '增加硬件'){
                params.gateId=this.gateIDPrimary;
                addInfo(params).then(res=>{
                    // console.log(res)
                    if(res.code=='SUCCESS'){
                        this.$message({
                            type:'success',
                            message:'增加成功,请刷新监控中心和岗亭端页面更新配置',
                        })
                        this.hardwareVisible = false
                        this.getGateInfo(this.gateIDPrimary)
                    }else{
                        this.$message.error(res.msg)
                    }                    
                })
            }else{
                updateInfo(params).then(res=>{
                    // console.log(res)
                    if(res.code=='SUCCESS'){
                        this.$message({
                            type:'success',
                            message:'修改成功,请刷新监控中心和岗亭端页面更新配置'
                        })
                        this.hardwareVisible = false
                        this.getGateInfo(this.gateIDPrimary)                        
                    }else{
                        this.$message.error(res.msg)
                    }
                })
            }

        },
        //切换岗亭硬件设置和硬件型号管理      
        tabClick(value){
            if(value.label === '岗亭硬件设置'){
                this.getGateInfo(this.hardwareSetProp.gateId)           								

                // this.initGateId()
            }else if(value.label === '硬件型号管理'){
                this.getDeviceTypeList(true)
            }
        },   
        /**
         * 测试闸机
         * @param {Number} type 取值"0"和"1",分别表示开闸和关闸
         * @param {String} command 开关闸命令
        */         
        testOpenSluice(type,command){
            if (!command) {
                this.$message({
                    type:'warning',
                    message:'命令不能为空'
                })
                return
            }
            let params = {
                orderType: type,
                deviceIp: this.hardwareFormData.deviceIp,
                devicePort: this.hardwareFormData.devicePort,
                command:command,
            }
            sluiceDeviceTest(params).then(data => {
                if (data.data.code === "SUCCESS") {
                    this.$message({
                        type: 'success',
                        message: data.data.msg
                    })
                }else{
                    this.$message.error(data.data.msg)
                }
            }); 
        },   
        /**
         * 测试LED
         * @param {String} displayInfo 开关闸命令
        */        
        testOpenLed(displayInfo){
            if (!displayInfo) {
                this.$message({
                    type:'warning',
                    message:'展示信息不能为空'
                })
                return
            }
            let params = {
                deviceIp: this.hardwareFormData.deviceIp,
                devicePort: this.hardwareFormData.devicePort,
                displayInfo: this.hardwareFormData.displayInfo,
                displayInfo2: this.hardwareFormData.displayInfo2,
                ledTypeName:this.findDeviceTypeNameById(this.hardwareFormData.deviceTypeId),
            }
            ledDeviceTest(params).then(data => {
                // console.log(data)
                if (data.data.code === "SUCCESS") {
                    this.$message({
                        type: 'success',
                        message: data.data.msg
                    })
                }else{
                    this.$message.error(data.data.msg)
                }
            }); 
        },  
        //根据id找设备类型名字
        findDeviceTypeNameById(deviceTypeId){
            for(let v  of this.ledDeviceTypeList){
                if (v.id === deviceTypeId) {
                    return v.name
                }
            }
        },
        //打开设备类型弹窗
        openDevicesTypeDialog(devicesTypeDialogTitle,row){
            this.devicesTypeDialogTitle = devicesTypeDialogTitle
            this.devicesTypeAddVisible = true
            if(this.devicesTypeDialogTitle === '新增'){
                this.formData.type = 1
            }else if(this.devicesTypeDialogTitle === '修改'){
                this.formData = this.Util.deepCopy(row)
            }

        },
        //监听关闭设备类型弹窗
        listenCloseDevicesTypeDialog(){
            this.$refs['formData'].resetFields()
            for(let k in this.formData){
                this.formData[k] = ''
            }
        },        
        //新增设备类型
        devicesTypeSubmit(formName){
            this.$refs[formName].validate((valid) => {
					if (valid) {
                        this.formData.operatorId = this.Util.userInfo.id
                        if (this.devicesTypeDialogTitle === '新增') {
                            addDeviceType(this.formData)
                                .then((data) => {
                                    if(data.code === 'SUCCESS'){
                                        this.$message({
                                            message: '操作成功',
                                            type: 'success'
                                        });
                                        this.devicesTypeAddVisible = false
                                        this.getDeviceTypeList(true)
                                    }else{
                                        this.$message.error(data.msg);                           
                                    }
                            })                             
                        }else if(this.devicesTypeDialogTitle === '修改'){
                            updateDeviceType(this.formData)
                                .then((data) => {
                                    if(data.code === 'SUCCESS'){
                                        this.$message({
                                            message: '操作成功',
                                            type: 'success'
                                        });
                                        this.devicesTypeAddVisible = false
                                        this.getDeviceTypeList(true)
                                    }else{
                                        this.$message.error(data.msg);                           
                                    }
                            })
                        }                        
                        
                     
					} else {
						return false;
					}
			}); 
        }, 
        // 删除设备类型    
        deleteDeviceType(row){
            this.$confirm('您确定要删除该记录吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = {
                    id:row.id,
                    operatorId:this.Util.userInfo.id
                }
                deleteDeviceType(params,row.id)
                    .then((data) => {
                        if(data.code === 'SUCCESS'){
                            this.$message({
                                message: '删除成功,请刷新监控中心和岗亭端页面更新配置',
                                type: 'success'
                            });
                            this.getDeviceTypeList(true)
                        }else{
                            this.$message.error(data.msg);                           
                        }
                })   

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },   
          
        /**
         * 查询
         * @param {booleal} isGlobal 是否是全局搜索,true表示是,当前页要置为1
         */         
        getDeviceTypeList(isGlobal) {
            if(isGlobal){
                this.currentPage = 1
            }

            let param = {
                name:this.searchValue,
                type: this.searchType,
                current:this.currentPage,     
                length:this.pageSize,
            }            

           

            getDeviceTypeList(param).then(data => {
                // console.log(data)
                if (data.data.code === "SUCCESS") {
                    this.devicesTypeList = data.data.data.content
                    this.dataTotal = data.data.data.totalElements

                }
               else {
                    this.$message.error(data.data.msg)
                }
            });
        },       
        //页码改变
        handleSizeChange(val) {
            this.pageSize = val
            this.getDeviceTypeList(false)
        },
        //页改变
        handleCurrentChange(val) {
            this.getDeviceTypeList(false)
        },    
            
    }
}
</script>

<style lang="scss" scoped>
    .form-dialog{
        .gateBtn{
            .el-button{
                padding: 5px 15px;
                border-radius: 0px;
                margin: 0;
                border: 1px solid #eee;
            }
            .elPrimary{
                color: #fff;
                background-color: #FC813B;
                border-color: #FC813B; 
            }
        }
        .gateInfo{
            padding: 10px;
            border: 1px solid #eee;
        }
        .form-padding{
            padding: 0 10%;
        }       
    }
    .content{
        background: $color-gray; 
        .content-body{
            padding:0px 10px;
            .body-top{
                 padding: 10px 0px;
                 .body-top-left{
                     float: left;
                     width: 49%;
                 }
                 .body-top-right{
                     float: right;
                     width: 49%;
                 }                 
            }
            .body-paging{
                padding: 20px 0px;
            }
        }
    }    
 
</style>




