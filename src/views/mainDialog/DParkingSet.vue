<template>  
    <div>
        <!-- 弹窗-停车场设置 -->
        <el-dialog class="form-dialog" title="停车场设置"  width="90%" :visible.sync="parkingSetProp.visible" :close-on-click-modal="false" @open="listenOpenParkSetDialog" @closed="listenCloseParkSetDialog">
            <!--暂时不考虑多停车场模式 
                <el-row >
                <el-col :span="4">
                    <h4 class="text-left">停车场模式</h4>
                </el-col>
                <el-col :span="20" class="parking-model">
                    <el-radio v-model="parkGlobalSet.parkMode" label="simple" :disabled="isSelectSimple">普通场</el-radio>
                    <el-radio v-model="parkGlobalSet.parkMode" label="complex">场中场</el-radio>
                </el-col>            
            </el-row> -->
            <el-row class="content">
                <el-collapse v-model="activeName">
                    <el-collapse-item v-for="(item,index) in parkingList" :key="item.id" :name="index">
                        <template slot="title">
                            <div class="bg-info">
                                <div class=" title-1"><b>停车场信息</b></div>
                                <div class=" title-1">{{item.parkName}}</div>
                                <div class=" title-1">车位总数:{{item.spaceNum}}</div>
                                <div class=" title-4 text-center">
                                    <span class="padd">停车场ID:</span>
                                    <el-input class="width-200" v-model="item.id" disabled  placeholder="点击右侧添加停车场"></el-input>
                                    <!-- 当停车场id不为空时显示 -->
                                    <el-button type="primary" size="mini" @click.stop="updateParkId(item.id)" v-show="item.id !== ''" v-if="markSettingParkUpdate">修改ID</el-button>                                
                                    <!-- 暂时不考虑多区域模式,不能添加删除区域  -->
                                        <!-- <el-button type="primary" size="mini" @click.stop="listenOpenAreaDialog('添加区域',item)" v-show="item.id !== ''" v-if="markSettingParkAddRegion">添加区域</el-button>  -->
                                    <!-- 当没添加停车场或场中场模式可添加停车场 -->
                                    <el-button type="primary" size="mini" @click.stop="addPark" v-show=" parkGlobalSet.parkMode === 'complex' || item.id===''" v-if="markSettingParkAdd">添加停车场</el-button> 
                                    <!-- 当有停车场或场中场模式可删除停车场  -->
                                    <!-- <el-button type="primary" size="mini" @click.stop="deletePark(item)" v-show="parkGlobalSet.parkMode === 'complex' || item.id!==''">删除停车场</el-button>                                 -->
                                </div>
                            </div>
                        </template>
                        <el-tabs type="border-card" @tab-click="handleTabClick">  
                            <el-tab-pane label="区域信息" >
                                <el-collapse accordion>
                                    <el-collapse-item v-for="(item2,index2) in item.regions" :key="index2" >
                                        <template slot="title" >
                                            <div @click="getGateListByRegionId(item2.id)">
                                                <div class=" title-1">{{item2.regionName}}</div>
                                                <div class=" title-1">车位数量:{{item2.spaceNum}}</div>
                                                <div class=" title-2 text-center">
                                                    <el-button type="primary" size="mini" @click.stop="listenOpenGateDialog('添加岗亭',item2)" v-if="markSettingParkAddGate">添加岗亭</el-button>                                
                                                    <el-button type="primary" size="mini" @click.stop="listenOpenAreaDialog('修改区域',item2)" v-if="markSettingParkUpdateRegion">修改区域</el-button>                                
                                                    <!-- <el-button type="primary" size="mini" @click.stop="deleteArea(item2)" v-if="markSettingParkdeleteRegion">删除区域</el-button>                                 -->
                                                </div>
                                            </div>
                                        </template>
                                        <div style="padding:10px;" >
                                            <div class="text-left bg-info">
                                                <div class=" title-1"><b>岗亭信息</b></div>
                                                <div class=" title-1"><b>岗亭名称</b></div>
                                                <!-- <div class=" title-3"><b>关联区域</b></div> -->
                                                <div class=" title-2"><b>进场规则</b></div>
                                                <div class=" title-1 text-center"><b>操作</b></div> 
                                            </div>
                                            <div v-for="(item3,index3) in gateRegionList" :key="index3" class="bg-info">
                                                <div class=" title-1"></div>
                                                <div class=" title-1">{{item3.gateName}}</div>
                                                <!-- <div class=" title-3">
                                                    <div>{{item3.inLinkShow}}</div>
                                                    <div>{{item3.outLinkShow}}</div>
                                                </div> -->
                                                <div class=" title-2">{{item3.ruleShow}}</div>
                                                <div class=" title-1 text-center">
                                                    <el-button type="text" class="text-blue" size="small" icon="el-icon-edit" @click="listenOpenGateDialog('修改岗亭',item2,item3)" v-if="markSettingParkUpdateGate">修改</el-button>                                
                                                    <el-button type="text" class="text-danger" size="small" icon="el-icon-delete" @click="deleteGate(item3,item2.id)" v-if="markSettingParkDeleteGate">删除</el-button>                                
                                                </div>                                    
                                            </div>
                                            <div v-show="!gateRegionList" class="text-center text-warning bg-info">暂无数据</div>
                                        </div>                                        
                                    </el-collapse-item>
                                    <div v-if="!item.regions" class="text-center text-warning">暂无数据</div>
                                </el-collapse> 
                            </el-tab-pane>                                         
                            <el-tab-pane label="收费中心" >
                                <div style="padding:10px;">
                                    <div class="text-right" style="padding:0px 10px 10px 10px;">
                                        <el-button type="primary" size="mini" @click.stop="listenOpenCenterDialog('添加收费中心')">添加收费中心</el-button>                                
                                    </div>                                            
                                    <div class="text-left">
                                        <div class=" title-1"><b>收费中心名称</b></div>
                                        <div class=" title-2 text-center"><b>操作</b></div> 
                                    </div>
                                    <div v-for="(item3,index3) in centerRegionList" :key="index3">
                                        <div class=" title-1">{{item3.name}}</div>
                                        <div class=" title-2 text-center">
                                            <el-button type="text" class="text-blue" size="small" icon="el-icon-edit" @click="listenOpenCenterDialog('修改收费中心',item3)">修改</el-button>                                
                                            <el-button type="text" class="text-danger" size="small" icon="el-icon-delete" @click="deleteCenter(item3)">删除</el-button>                                
                                        </div>                                    
                                    </div>
                                    <div v-show="!centerRegionList" class="text-center text-warning bg-info">暂无数据</div>
                                </div>                                        
                            </el-tab-pane>                        
                        </el-tabs>

                    </el-collapse-item>
                </el-collapse>                
            </el-row>
            <el-row class="content2">
                <div class="content2-row">
                    <div class="content2-item1">禁入车辆自动识别后是否弹窗询问</div>
                    <div class="content2-item2">
                        <el-switch v-model="parkGlobalSet.askFlag"  active-text="询问" inactive-text="不询问" active-color="#13ce66" inactive-color="#ff4949">
                        </el-switch>
                    </div>
                    <div class="content2-item1">是否区分大型车和超大型车</div>
                    <div class="content2-item2">
                        <el-switch v-model="parkGlobalSet.showHugeCar"  active-text="区分" inactive-text="不区分" active-color="#13ce66" inactive-color="#ff4949">
                        </el-switch>
                    </div>
                </div>
                <div class="content2-row">
                    <div class="content2-item1">车位已满是否允许车辆进场</div>
                    <div class="content2-item2">
                        <el-switch v-model="parkGlobalSet.forbidNoSpace" active-text="允许" inactive-text="不允许" active-color="#13ce66" inactive-color="#ff4949">
                        </el-switch>
                    </div>
                    <div class="content2-item1">临时用户是否有上限</div>
                    <div class="content2-item2">
                        <el-switch v-model="parkGlobalSet.limitTempCar"  active-text="有" inactive-text="没上限" active-color="#13ce66" inactive-color="#ff4949">
                        </el-switch>
                        <span>上限数量</span>
                        <el-input-number 
                            v-model="parkGlobalSet.limitTempCarNum" 
                            :step="100" 
                            :min="0" 
                            :max="999999"
                            size="small"
                            :disabled="!parkGlobalSet.limitTempCar" 
                            placeholder="上限数量"
                            >
                        </el-input-number>
                    </div>
                </div>
                <div class="content2-row">
                    <div class="content2-item1">是否启用一卡多车</div>
                    <div class="content2-item2">
                        <el-switch v-model="parkGlobalSet.vipToManyCar" active-text="启用" inactive-text="不启用" active-color="#13ce66" inactive-color="#ff4949">
                        </el-switch>
                    </div>
                    <div class="content2-item1">免费车辆是否自动放行</div>
                    <div class="content2-item2">
                        <el-switch v-model="parkGlobalSet.freeCarPassAuto"  active-text="是" inactive-text="否" active-color="#13ce66" inactive-color="#ff4949">
                        </el-switch>
                    </div>
                </div>
                <div class="content2-button text-center">
                    <el-button size="small" @click="cancelModify" v-if="markSettingParkGlobalUpdate">取消修改</el-button>
                    <el-button type="primary" size="small" @click="updateParkGlobalSet" v-if="markSettingParkGlobalUpdate">保存修改</el-button>
                </div>
            </el-row> 
                           	
        </el-dialog> 
        <!-- 弹窗-区域 -->
        <el-dialog :title="areaDialogTitle"  width="40%" :visible.sync="areaVisible" :close-on-click-modal="false" @close="listenCloseAreaDialog">
            <el-form :model="areaFormData" :rules="areaFormDataRules" ref="areaFormData"  status-icon>
                <el-form-item label="区域名称"  prop="regionName">
                    <el-input class="width-200" v-model.trim="areaFormData.regionName" clearable placeholder="请输入区域名称" maxlength="20">
                    </el-input>
                </el-form-item>
                <el-form-item label="车位数量"  prop="spaceNum">
                    <el-input-number class="width-200" v-model.trim="areaFormData.spaceNum" :min="1" :max="9999999" clearable label="车位数量">
                    </el-input-number>                    
                </el-form-item>      
                        
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="areaVisible = false">取 消</el-button>
                <el-button type="primary" @click="areaFormDataSumbmit('areaFormData')">确 定</el-button>
            </div> 
        </el-dialog>        
        <!-- 弹窗-岗亭 -->
        <el-dialog id="gateDialog" :title="gateDialogTitle"  width="60%" :visible.sync="gateVisible" :close-on-click-modal="false" @close="listenCloseGateDialog">
            <el-form :model="gateFormData" :rules="gateFormDataRules" ref="gateFormData" class="form-padding" status-icon>
                <el-form-item label="岗亭名称" :label-width="formLabelWidth" prop="gateName">
                    <el-input class="width-180" v-model.trim="gateFormData.gateName" placeholder="岗亭名称" maxlength="20" clearable ></el-input>
                </el-form-item>
                <el-form-item  label="所属区域" :label-width="formLabelWidth">
                     <el-input class="width-180" v-model="gateFormData.regionName" disabled placeholder="所属区域" auto-complete="off"></el-input>
                </el-form-item> 
                <!-- <el-form-item label="入口关联区域" :label-width="formLabelWidth" >
                    <el-select v-model="gateFormData.inRegionId" clearable>
                        <el-option v-for="item in regionAllSimpleInfoList" :key="item.id" :label="item.regionName" :value="item.id" ></el-option>
                    </el-select>
                </el-form-item>    
                <el-form-item label="出口关联区域" :label-width="formLabelWidth" >
                    <el-select v-model="gateFormData.outRegionId" clearable placeholder="无">
                        <el-option v-for="item in regionAllSimpleInfoList" :key="item.id" :label="item.regionName" :value="item.id" ></el-option>
                    </el-select>
                </el-form-item>                                  -->
                <el-form-item label="进场规则" :label-width="formLabelWidth">
                    <div class="checkbox-height" v-for="(rule,index) in gateFormData.rules" :key="index">
                        <div class="rule-title">
                            <el-checkbox  v-model="rule.openFlag">{{rule.memberType}}</el-checkbox>
                        </div>
                        <div class="rule-range">
                            <el-time-picker class="width-120" v-model="rule.beginTime" format="HH:mm" placeholder="开始时间">
                            </el-time-picker> 
                            至                          
                            <el-time-picker class="width-120" v-model="rule.endTime" format="HH:mm" placeholder="结束时间">
                            </el-time-picker>                                                      
                        </div>
                    </div>                    
                </el-form-item>                                     
                        
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="gateVisible = false">取 消</el-button>
                <el-button type="primary" @click="gateFormDataSumbmit('gateFormData')" >确 定</el-button>
            </div> 
        </el-dialog>   
        <!-- 弹窗-收费中心 -->
        <el-dialog  :title="centerDialogTitle"  width="40%" :visible.sync="centerVisible" :close-on-click-modal="false" @close="listenCloseCenterDialog">
            <el-form :model="centerFormData" :rules="centerFormDataRules" ref="centerFormData" class="form-padding" status-icon>
                <el-form-item label="收费中心名称" :label-width="formLabelWidth" prop="name">
                    <el-input class="width-180" v-model.trim="centerFormData.name" placeholder="收费中心名称" maxlength="20" clearable ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="centerVisible = false">取 消</el-button>
                <el-button type="primary" @click="centerFormDataSumbmit('centerFormData')" >确 定</el-button>
            </div> 
        </el-dialog>            
    </div>    
</template>

<script>
import { mapGetters,mapActions } from 'vuex'
import {
        addPark,deletePark,getParkAllInfo,updateParkGlobalSet,updateParkId,
        addRegion,deleteRegion,updateRegion,getRegionAllSimpleInfo,
        addGate,deleteGate,updateGate,getGateRules,getGateListAll,getGateListByRegionId,
        addToll,deleteToll,updateToll,getTollListByRegionId
} from '@/api/api'

export default {
    props: [ 'parkingSetProp' ],
    computed: {
        ...mapGetters({
            ParkGlobalSetStore: 'getParkGlobalSet',	
        })
    },    

    data(){
        return {
            activeName:[0],             //区域折叠面板展开项,默认第一项
            formLabelWidth:'120px',     //表单项名字长度
            isSelectSimple:false,       //用于控制是否能选择普通场
            regionId: '',               //区域id
            //停车场数据,当未配置停车场用于渲染页面
            parkingList:[{id: "", parkName: "", spaceNum: 0,} ],            
            
            regionAllSimpleInfoList:[],   //区域简单数据,用于渲染下拉选
            //停车场全局配置
            parkGlobalSet:{
                parkMode:'simple',      //停车场模式
                askFlag:false,            //禁入车辆自动识别后是否弹窗询问
                showHugeCar:true,       //是否区分大型车和超大型车
                forbidNoSpace:true,     //车位已满是否允许车辆进场
                limitTempCar:true,      //临时用户是否有上限
                limitTempCarNum: 0,     //上限数量
                vipToManyCar:true,      //是否启用一卡多车
                freeCarPassAuto:true,   //免费车辆是否自动放行
            }, 

            areaVisible:false,          //控制区域弹窗关闭
            areaDialogTitle:'增加区域',  //区域弹窗标题
            areaFormData:{              //区域表单数据
                id:'',
                parkId:'',
                regionName:'',
                remark:'手动',
                spaceNum:'',
            },
            areaFormDataRules:{         //区域表单数据验证
                regionName: [
                    { required: true, message: '请输入区域名称', trigger: 'blur' },
                ],
                spaceNum: [
                    { required: true, message: '请输入车辆数量', trigger: 'blur' },
                ],                
            },

            monthCardList:[],           //年/月卡类型
            gateRegionList:[],          //区域下对应的岗亭信息            
            gateVisible:false,          //控制岗亭弹窗关闭
            gateDialogTitle:'增加岗亭',  //岗亭弹窗标题
            //岗亭表单数据
            gateFormData:{              
                operatorId:this.Util.userInfo.id,
                gateName:'',
                inRegionId:'',
                outRegionId:'',
                regionId:'',
                regionName:'',
                rules:'',
            },    
            gateFormDataRules:{         //岗亭表单数据验证
                gateName: [
                    { required: true, message: '请输入岗亭名称', trigger: 'blur' },
                ],
            },    

            centerRegionList: [],             //收费中心列表  
            centerVisible:false,              //控制收费中心弹窗关闭
            centerDialogTitle:'增加收费中心',  //收费中心弹窗标题
            centerFormData:{                  //收费中心表单数据
                operatorId:this.Util.userInfo.id,
                name:'',
            },    
            centerFormDataRules:{         //收费中心表单数据验证
                name: [
                    { required: true, message: '请输入收费中心', trigger: 'blur' },
                ],
            }, 
            
            markSettingParkAdd:false,
            markSettingParkUpdate:false,
            markSettingParkDelete:false,
            markSettingParkGlobalUpdate:false,
            markSettingParkAddRegion:false,
            markSettingParkUpdateRegion:false,
            markSettingParkdeleteRegion:false,
            markSettingParkAddGate:false,
            markSettingParkUpdateGate:false,
            markSettingParkDeleteGate:false,
        }
    },
    mounted() {
        this.markSettingParkAdd = this.Util.isPermission('markSettingParkAdd')
        this.markSettingParkUpdate = this.Util.isPermission('markSettingParkUpdate')
        this.markSettingParkDelete = this.Util.isPermission('markSettingParkDelete')
        this.markSettingParkGlobalUpdate = this.Util.isPermission('markSettingParkGlobalUpdate')
        this.markSettingParkAddRegion = this.Util.isPermission('markSettingParkAddRegion')
        this.markSettingParkUpdateRegion = this.Util.isPermission('markSettingParkUpdateRegion')        
        this.markSettingParkdeleteRegion = this.Util.isPermission('markSettingParkdeleteRegion')        
        this.markSettingParkAddGate = this.Util.isPermission('markSettingParkAddGate')        
        this.markSettingParkUpdateGate = this.Util.isPermission('markSettingParkUpdateGate')        
        this.markSettingParkDeleteGate = this.Util.isPermission('markSettingParkDeleteGate')        
    },    
    methods:{
        ...mapActions([
            'setGateList',
            'setParkGlobalSet',
        ]),
        //监听打开停车场设置弹窗
        listenOpenParkSetDialog(){
            //从store中获取停车场全局设置
            this.parkGlobalSet = this.Util.deepCopy(this.ParkGlobalSetStore)

            //加载停车场及区域数据
            this.getParkAllInfo()
            //加载可配置进场规则       
            this.getGateRules()         
        },   
        //监听打开停车场设置弹窗
        listenCloseParkSetDialog(){
            this.$emit('listenCloseMainDialog') 									
        },    
        //查停车场及区域信息
        getParkAllInfo(){
            getParkAllInfo({operatorId: this.Util.userInfo.id})
                .then( (data) => {
                    if(data.data.code === 'SUCCESS'){
                        if(data.data.data ){
                            this.parkingList = data.data.data
                            this.judgeParkMode()
                        }else{
                           this.parkingList = [{id: "", parkName: "", spaceNum: 0,} ]
                        }
                      
                    }else{
                        this.$message.error(data.data.msg);                             
                    }                                              
                })            
        },            
        //区域和收费中心tab切换
        handleTabClick(value){
            if (value.label === '收费中心') {
                this.getTollListByRegionId()
            }
        },        
        //根据停车场个数判断是否能选择普通场
        judgeParkMode(){
            if(this.parkingList.length > 1){    //如果停车场数量大于1
                this.isSelectSimple = true
                if(this.parkGlobalSet.parkMode !== 'complex'){  //并且不是场中场,强制转成场中场,并且不能切换到普通场
                    this.parkGlobalSet.parkMode = 'complex'
                    this.updateParkGlobalSetApi()
                }
            }else{
                this.isSelectSimple = false
            }
        },        
        //增加停车场id    
        addPark(){
            this.$prompt('请输入停车场ID', '停车场设置', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            }).then(({ value }) => {
                let parkId = value.replace(/(^\s*)|(\s*$)/g, "")
                addPark({parkId : parkId,operatorId: this.Util.userInfo.id})
                    .then( (data) => {
                        if(data.data){
                            this.getParkAllInfo()
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                        }else{
                            this.$message.error(data.msg);                             
                        }
                      
                })
            })            
        },  
        //删除停车场id
        deletePark(item){
            let parkId = item.id
            let tempString = `您确定要删除停车场"${item.parkName}"吗?`

            this.$confirm(tempString, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = {operatorId:this.Util.userInfo.id}
                deletePark( params, parkId )
                    .then((data) => {
                        // console.log(data)
                        if(data.code === 'SUCCESS'){
                            this.getParkAllInfo()
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
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
        //修改停车场id
        updateParkId(parkIdOld){
            this.$prompt('请输入停车场ID', '修改停车场', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            showInput:true,
            inputValue:parkIdOld,
            }).then(({ value }) => {
                let params = {
                    parkId : value,
                    parkIdOld:parkIdOld,
                    operatorId: this.Util.userInfo.id
                }
                updateParkId(params)
                    .then( (data) => {
                        if(data.code === 'SUCCESS'){
                            this.getParkAllInfo()
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                        }else{
                            this.$message.error(data.msg);                             
                        }
                      
                    })
            })             
        },             
        //修改停车场全局配置
        updateParkGlobalSet(){
            this.$confirm('您确定要修改停车场配置吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                updateParkGlobalSet(this.parkGlobalSet)
                .then((data) => {
                        // console.log(data)
                        if(data.code === 'SUCCESS'){
                            //停车场配置修改成功后更新到store中
                            this.setParkGlobalSet({operatorId: this.Util.userInfo.id})
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                        }else{
                            this.$message.error(data.msg);                           
                        }
                }) 
            })
        },   
        //取消修改
        cancelModify(){
            this.parkGlobalSet = this.Util.deepCopy(this.ParkGlobalSetStore)
        },
        //监听打开区域弹窗
        listenOpenAreaDialog(type,item){
            this.areaVisible = true
            this.areaDialogTitle = type

            if(type === '修改区域'){
                this.areaFormData = this.Util.deepCopy(item)
            }else if(type === '添加区域'){
                this.areaFormData.parkId = item.id
            }
        }, 
        //监听关闭区域弹窗
        listenCloseAreaDialog(){
            //验证初始化
            this.$refs['areaFormData'].resetFields()            
            //初始化表单数据
            for(let key in this.areaFormData) {
                this.areaFormData[key] = ''
            }
        }, 
        //增加/修改区域表单提交
        areaFormDataSumbmit(formName){
            this.$refs[formName].validate((valid) => {
					if (valid) {
                        if(this.areaDialogTitle === '修改区域'){
                            this.updateArea()
                        }else if(this.areaDialogTitle === '添加区域'){
                            this.addArea()
                        }
					} else {
						return false;
					}
				});                        
        },
        //增加区域
        addArea(){
            this.areaFormData.operatorId = this.Util.userInfo.id
            addRegion(this.areaFormData)
                .then((data) => {
                    if(data.code === 'SUCCESS'){
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.areaVisible = false
                        this.getParkAllInfo()
                    }else{
                    this.$message.error(data.msg);                           
                    }
            })
        },        
        //修改区域
        updateArea(){
            this.areaFormData.operatorId = this.Util.userInfo.id
            updateRegion(this.areaFormData,this.areaFormData.id)
                .then((data) => {
                    if(data.code === 'SUCCESS'){
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.areaVisible = false
                        this.getParkAllInfo()
                    }else{
                        this.$message.error(data.msg);                           
                    }
            })
        },        
        //删除区域
        deleteArea(item){
            let regionId = item.id
            let tempString = `您确定要删除区域" ${item.regionName} "吗?`            
            this.$confirm(tempString, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteRegion( {operatorId:this.Util.userInfo.id}, regionId)
                    .then((data) => {
                        if(data.code === 'SUCCESS'){
                            this.getParkAllInfo()
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
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
         * 监听打开岗亭弹窗
         * @param {String} type 用于判断是修改还是增加,只要两个值"修改岗亭"和"添加岗亭"
         * @param {object} row 停车场及岗亭相关信息
        */ 
        listenOpenGateDialog(type,region,gate){
            this.gateVisible = true
            this.gateDialogTitle = type

            this.getRegionAllSimpleInfo()

            if(type === '修改岗亭'){
                this.gateFormData = this.Util.deepCopy(gate)
                this.gateFormData.regionName = region.regionName
                this.gateFormData.rules = []

                for(let i = 0,len = gate.rules.length; i<len; i++){
                    let tempObj = this.Util.deepCopy(gate.rules[i])
                    if(gate.rules[i].openFlag === true){  //已选中的规则
                        let beginTime = gate.rules[i].beginTime.split(':')
                        let endTime = gate.rules[i].endTime.split(':') 
                        tempObj.beginTime = new Date(2016, 9, 10, beginTime[0], beginTime[1])                   
                        tempObj.endTime = new Date(2016, 9, 10, endTime[0], endTime[1])                   
                    }else{
                        tempObj.beginTime = new Date(2016, 9, 10, 0, 0)                   
                        tempObj.endTime = new Date(2016, 9, 10, 23, 59)                         
                    }    
                    this.gateFormData.rules.push(tempObj)
                }

            }else if(type === '添加岗亭'){
                //初始化表单
                this.gateFormData.regionId = region.id
                this.gateFormData.regionName = region.regionName
                this.gateFormData.rules = []
                // console.log(this.gateFormData.rules)
                for(let i = 0,len = this.monthCardList.length; i<len; i++){
                    let tempObj = this.Util.deepCopy(this.monthCardList[i])
                    //默认选择规则
                    tempObj.openFlag = true
                    //为规则添加时间范围属性,用于绑定数据
                    tempObj.beginTime = new Date(2016, 9, 10, 0, 0)
                    tempObj.endTime = new Date(2016, 9, 10, 23, 59)
                    this.gateFormData.rules.push(tempObj)
                }
                // this.getGateRules()
            }
        }, 
        //关闭岗亭弹窗
        listenCloseGateDialog(){
            //初始化表单
            this.$refs['gateFormData'].resetFields()            
            for(let key in this.gateFormData) {
                this.gateFormData[key] = ''
            }
        },
        //查区域简单信息
        getRegionAllSimpleInfo(){
            getRegionAllSimpleInfo({operatorId: this.Util.userInfo.id})
                .then( (data) => {
                    if(data.data.data){
                        this.regionAllSimpleInfoList = data.data.data
                    }else{
                        this.$message.error(data.data.msg);                             
                    }                                              
                })            
        },               
        /**
         * 打开增加修改区域弹窗
         * @param {String} type 用于判断是修改还是增加,只要两个值"修改区域"和"添加区域"
         * @param {object} item 停车场及区域相关信息
        */        
        //增加/修改岗亭表单提交
        gateFormDataSumbmit(formName){
            this.$refs[formName].validate((valid) => {
					if (valid) {
                        //转成后台接收的数据格式
                        // console.log(this.gateFormData.rules);
                        for(let i = 0,len = this.gateFormData.rules.length; i<len; i++){  
                            this.gateFormData.rules[i].beginTime = this.Util.formatDate.format(this.gateFormData.rules[i].beginTime,'hh:mm') 
                            this.gateFormData.rules[i].endTime = this.Util.formatDate.format(this.gateFormData.rules[i].endTime,'hh:mm') 
                        }
                        if(this.gateDialogTitle === '修改岗亭'){
                            this.updateGate()
                        }else if(this.gateDialogTitle === '添加岗亭'){
                            this.addGate()
                        }
					} else {
						return false;
					}
				});                        
        },
        //增加岗亭
        addGate(){
            this.gateFormData.operatorId = this.Util.userInfo.id
            addGate(this.gateFormData)
                .then((data) => {
                    if(data.code === 'SUCCESS'){
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.gateVisible = false
                        this.getGateListByRegionId(this.gateFormData.regionId)
                        this.setGateList({operatorId: this.Util.userInfo.id})  //更新state里的gateList
                    }else{
                    this.$message.error(data.msg);                           
                    }
            })
        },        
        //修改岗亭
        updateGate(){
            this.gateFormData.operatorId = this.Util.userInfo.id
            updateGate(this.gateFormData,this.gateFormData.rules[0].gateId)
                .then((data) => {
                    // console.log(data)
                    if(data.code === 'SUCCESS'){
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.gateVisible = false
                        this.getGateListByRegionId(this.gateFormData.regionId)
                        this.setGateList({operatorId: this.Util.userInfo.id})  //更新state里的gateList
                    }else{
                        this.$message.error(data.msg);                           
                    }
            })
        },        
        //删除岗亭
        deleteGate(item,regionId){
            let gateId = item.id
            let tempString = `您确定要删除岗亭" ${item.gateName} "吗?`             
            
            this.$confirm(tempString, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                deleteGate({operatorId:this.Util.userInfo.id},gateId)
                    .then((data) => {
                        if(data.code === 'SUCCESS'){
                            this.getGateListByRegionId(regionId)
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.setGateList({operatorId: this.Util.userInfo.id})  //更新state里的gateList
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
        //查可配置的进场规则
        getGateRules(){
            getGateRules({operatorId: this.Util.userInfo.id})
                .then( (data) => {
                        // console.log(data)
                    if(data.data.code === 'SUCCESS'){
                        // this.monthCardList = []
                        this.monthCardList = data.data.data
                    }else{
                        this.$message.error(data.data.msg);                             
                    }                                              
            })            
        },  
        //根据区域id查区域下的岗亭
        getGateListByRegionId(regionId){
            this.regionId = regionId
                getGateListByRegionId( {operatorId:this.Util.userInfo.id}, regionId )
                    .then((data) => {
                        // console.log(data)
                        if(data.data.code === 'SUCCESS'){
                            this.gateRegionList = data.data.data
                        }else{
                            this.$message.error(data.data.msg);                             
                        }
                })            
        },
        /**
         * 打开增加修改收费中心弹窗
         * @param {String} type 用于判断是修改还是增加,只要两个值"修改收费中心"和"添加收费中心"
         * @param {object} row 停车场及收费中心相关信息
        */ 
        listenOpenCenterDialog(type,center){
            this.centerVisible = true
            this.centerDialogTitle = type

            if(type === '修改收费中心'){
                this.centerFormData = this.Util.deepCopy(center)

            }else if(type === '添加收费中心'){
                //初始化表单
                // this.centerFormData.regionId = region.id
            }
        }, 
        //关闭收费中心弹窗
        listenCloseCenterDialog(){
            //初始化表单
            this.$refs['centerFormData'].resetFields()            
            for(let key in this.centerFormData) {
                this.centerFormData[key] = ''
            }
        },
        //增加/修改收费中心表单提交
        centerFormDataSumbmit(formName){
            this.$refs[formName].validate((valid) => {
					if (valid) {
                        if(this.centerDialogTitle === '修改收费中心'){
                            this.updateCenter()
                        }else if(this.centerDialogTitle === '添加收费中心'){
                            this.addCenter()
                        }
					} else {
						return false;
					}
				});                        
        },
        //增加收费中心
        addCenter(){
            this.centerFormData.operatorId = this.Util.userInfo.id
            addToll(this.centerFormData)
                .then((data) => {
                    if(data.code === 'SUCCESS'){
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.centerVisible = false
                        this.getTollListByRegionId()
                    }else{
                        this.$message.error(data.msg);                           
                    }
            })
        },        
        //修改收费中心
        updateCenter(){
            this.centerFormData.operatorId = this.Util.userInfo.id
            updateToll(this.centerFormData)
                .then((data) => {
                    // console.log(data)
                    if(data.code === 'SUCCESS'){
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.centerVisible = false
                        this.getTollListByRegionId()
                    }else{
                        this.$message.error(data.msg);                           
                    }
            })
        },        
        //删除收费中心
        deleteCenter(item){
            let centerId = item.id
            let tempString = `您确定要删除收费中心" ${item.name} "吗?` 

            this.$confirm(tempString, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                deleteToll(centerId)
                    .then((data) => {
                        if(data.code === 'SUCCESS'){
                            this.getTollListByRegionId()
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
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
        //根据区域id查区域下的收费中心
        getTollListByRegionId(){
                getTollListByRegionId()
                    .then((data) => {
                        // console.log(data)
                        if(data.data.code === 'SUCCESS'){
                            this.centerRegionList = data.data.data
                        }else{
                            this.$message.error(data.data.msg);                             
                        }
                })            
        },                                   
       
    },
}
</script>

<style lang="scss" scoped>

.form-dialog{
    .parking-model{
        margin: 20px 0;
    }
    .content{
        background: $color-gray; 
        .title-1{
            text-indent: 10px;
            display: inline-block;
            width: 12%;
        }
        .title-2{
            display: inline-block;
            width: 46%;
        }   
        .title-3{
            display: inline-block;
            width: 16%;            
        } 
        .title-4{
            display: inline-block;
            width: 56%;            
        }          
        padding: 10px;
    } 
    .content2{
        padding: 10px 0;
        .content2-row{
            padding: 2px 10px;
            background: $color-gray;
            .content2-item1{
                display: inline-block;
                margin: 10px 0;
                width:16%;
            }
            .content2-item2{
                display: inline-block;
                margin: 10px 0;
                width:32%;
            }
        }
        .content2-button{
            padding: 10px;
            background: $color-gray; 
        }
        
    }

}
#gateDialog{
    .checkbox-height{
        height: 42px;
        line-height: 42px;
        .rule-title{
            display: inline-block;
            width: 20%;
        }
        .rule-range{
            display: inline-block;
            width: 78%;
            // text-align: right;
        }        

    }
}
 
</style>
<style scoped>
.el-button--mini{
    padding: 4px;
}
</style>


