<template>
    <div>
        <!-- 弹窗-临时车 -->
        <el-dialog class="form-dialog" title="常进临时车/预约车"  width="96%" :visible.sync="tempCarProp.visible" @open="listenOpentempCarDialog" @closed="listenClosedtempCarDialog" :close-on-click-modal="false">
            <el-row class="content">
                <el-col :span="24" class="content-body">
                    <div class="body-top clearfix">
                        <div class="body-top-left">
                            <el-select class="width-150" v-model="inParkType" placeholder="请选择" @change="getWhitelist(true)">
                                <el-option label="全部进场方式" value="2"></el-option>
                                <el-option label="直接进场" value="1"></el-option>
                                <el-option label="询问后进场" value="0"></el-option>
                            </el-select>                            
                            <el-select class="width-120" v-model="searchType" placeholder="请选择" @change="searchValue = ''">
                                <el-option label="车牌号" value="车牌号"></el-option>
                                <el-option label="管理员" value="管理员"></el-option>
                                <el-option label="备注" value="备注"></el-option>
                            </el-select>                    
                            <el-input class="width-180" v-model.trim="searchValue" @keyup.enter.native ="getWhitelist(true)" placeholder="请输入查询关键字" clearable ></el-input>
                            <el-button type="primary" size="mini" @click="getWhitelist(true)">查询</el-button>
                        
                        </div>
                        <div class="body-top-right text-right">
                            <el-upload  action=""  :limit="1" :file-list="fileList" :before-upload="beforeUpload" :show-file-list="false" style="display:inline-block;" v-if="markSettingTempCarImport">
                                <el-button slot="trigger" type="primary" size="mini" style="margin-right:10px;" >导入</el-button>
                            </el-upload> 
                            <el-button type="primary" size="mini" @click="whitelistExcelExport" v-if="markSettingTempCarExport">导出</el-button>
                            <!-- <el-button type="primary" size="mini" v-print="'#printTempCar'" >打印</el-button> -->
                            <el-button type="primary" size="mini" @click="openEditDialog('新增')" v-if="markSettingTempCarAdd">新增</el-button>
                        </div>
                    </div>
                    <div class="body-table" id="printTempCar">
                        <!--列表-->
                        <el-table :data="array"  v-loading="listLoading" sortable height="539" >
                            <el-table-column type="index"  min-width="80" >
                            </el-table-column>                            
                            <el-table-column prop="carNum" label="车牌号" min-width="100" sortable >
                            </el-table-column>
                            <el-table-column prop="carType" label="车类型" min-width="90" sortable >
                                <template slot-scope="scope">
                                    <span>{{scope.row.carType | transformCarType}}</span>
                                </template>                                
                            </el-table-column>          
                            <el-table-column prop="allowType" label="常进类型" min-width="100" sortable >
                                <template slot-scope="scope">
                                    <span>{{scope.row.allowType | transformAllowType}}</span>
                                </template>                                
                            </el-table-column>
                            <el-table-column prop="beginTime" label="预约开始时间" min-width=160 sortable  >
                            </el-table-column> 
                            <el-table-column prop="endTime" label="预约结束时间" min-width=160 sortable  >
                            </el-table-column>                                                         
                            <el-table-column prop="operatorName" label="管理员" min-width="90" sortable >
                            </el-table-column>
                            <el-table-column prop="createTime" label="添加时间" min-width=160 sortable  >
                            </el-table-column> 
                            <el-table-column prop="isAuto" label="进场方式" min-width=100 sortable >
                                <template slot-scope="scope">
                                    <span>{{scope.row.isAuto | transformIsAuto}}</span>
                                </template>                                
                            </el-table-column>                            
                            <el-table-column prop="remark" label="备注" min-width="110" sortable show-overflow-tooltip >
                            </el-table-column>    
                            <el-table-column label="操作" min-width="120"  >
                                <template slot-scope="scope">
                                    <a href="javaScript:;" class="text-blue" @click="openEditDialog('修改',scope.row)" v-if="markSettingTempCarUpdate"><i class="el-icon-edit"></i>修改&nbsp&nbsp</a>
                                    <a href="javaScript:;" class="text-danger" @click="deleteWhitelist(scope.row)" v-if="markSettingTempCarDelete"><i class="el-icon-delete"></i>删除</a>
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
        </el-dialog> 
        <!-- 弹窗-新增 -->
        <el-dialog class="form-dialog" :title="editTitle" width="30%" @close="listenCloseEditDialog" :visible.sync="addVisible" :close-on-click-modal="false">
            <div class="dialog-box">
                <el-form label-position="left" label-width="86px" :model="formData" :rules="formDataRules" ref="formData" >
                    <el-form-item  label="车牌号码:" prop="carNum">
                        <keyboard v-model.trim="formData.carNum" placeholder='请输入车牌号码' ></keyboard>   
                    </el-form-item>						
                    <el-form-item  label="车辆类型:" prop="carType">
                        <el-select class="width-150" v-model="formData.carType" placeholder="选择车辆类型" >
                            <el-option v-for="item in carTypeList" :key="item.mark" :label="item.typeName" :value="item.mark">
                            </el-option> 
                        </el-select>
                    </el-form-item>
                    <el-form-item  label="常进类型:" prop="allowType">
                        <el-radio v-model="formData.allowType" :label="1" >常进</el-radio>
                        <el-radio v-model="formData.allowType" :label="0" >预约</el-radio>
                    </el-form-item>       
                    <el-form-item  label="进场方式:" prop="isAuto">
                        <el-radio v-model="formData.isAuto" :label="1">直接进场</el-radio>
                        <el-radio v-model="formData.isAuto" :label="0">询问进场</el-radio>

                    </el-form-item> 
                    <el-form-item  label="开始时间:" prop="beginTime" v-if="formData.allowType===0">
                        <el-date-picker v-model="formData.beginTime" type="datetime" placeholder="选择日期时间" :disabled="formData.allowType===1" :picker-options="pickerOptionsStart">
                        </el-date-picker>
                    </el-form-item>        
                    <el-form-item  label="结束时间:" prop="endTime" v-if="formData.allowType===0">
                        <el-date-picker v-model="formData.endTime" type="datetime" placeholder="选择日期时间" :disabled="formData.allowType===1" :picker-options="pickerOptionsEnd">
                        </el-date-picker>
                    </el-form-item>                                                  
                    <el-form-item  label="备注:">
                        <el-input v-model.trim="formData.remark" clearable placeholder="请输入备注" >
                        </el-input>
                    </el-form-item>	
                </el-form>
                <div  class="dialog-footer text-right">
                    <el-button class="footer-btn" @click="addVisible = false">取消</el-button>
                    <el-button class="footer-btn" type="primary" @click="addSubmit('formData')" >确认</el-button>
                </div>					
            </div>	
        </el-dialog>  
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import {base,getWhitelist,addWhitelist,deleteWhitelist,updateWhitelist,whitelistExcelImport,whitelistExcelExport} from '@/api/api' ;

export default {
    props: [ 'tempCarProp' ],
    data(){
            
			let checkEndTime = (rule, value, callback) => {
				if (!value) {
					return callback(new Error('请选择预约结束时间'))
				}else{
					if (this.formData.endTime.getTime() < sessionStorage.getItem('commonTime')) {
						return callback(new Error('预约结束时间不能小于当前时间'))
					}else if (this.formData.beginTime.getTime() > this.formData.endTime.getTime()) {
						return callback(new Error('预约结束时间不能小于预约开始时间'))
					}else{
						callback()
					}
				}
			}            

        return {
            listLoading: false,
            pageSize:10,
            dataTotal:0,
            currentPage:1,

            fileList:[],
            fileName:null,      //导入的文件名
            file:null,          //导入的文件 
            
            searchType:'车牌号',      //查询类型
            searchValue:'',     //查询值
            inParkType:'2',      //进场方式

            array:[],
            addVisible:false,
            editTitle:'新增',
            //表单数据
            formData:{
                carNum:'',
                carType:'small',
                allowType:1,
                isAuto:0,
                beginTime:'',
                endTime:'',
                remark:'',
            },
            //表单数据验证
            formDataRules:{
                carNum: [
                        { required: true, message: '请输入车牌', trigger: 'blur' },
                        { required: true, validator: this.Check.ruleCarNum, trigger: 'blur' }
                ],
                carType: [
                        { required: true, message: '请选择车类型', trigger: 'change' },
                ],
                beginTime: [
                        { required: true, message: '请选择预约开始时间', trigger: 'change' },
                ],
                endTime: [
                        { required: true, message: '请选择预约结束时间', trigger: 'change' },
                        { required: true, validator: checkEndTime, trigger: 'blur' }

                ],                                
            },    
            pickerOptionsStart: {
                disabledDate: time => {
                   return time.getTime() < new Date().getTime();
                }
            },
            pickerOptionsEnd: {
                disabledDate: time => {
                    return time.getTime() < new Date().getTime();
                }
            },            
            markSettingTempCarAdd:false,
            markSettingTempCarUpdate:false,
            markSettingTempCarDelete:false,
            markSettingTempCarImport:false,
            markSettingTempCarExport:false,

            
        }
    },
    computed: {
        ...mapGetters({
            carTypeList: 'getCarTypeList',	
        }),
    },    
    filters:{
        transformAllowType(value){
            return value === 0 ? '预约' : '常进'
        },
        transformIsAuto(value){
            return value === 0 ? '询问后进场' : '直接进场'
        },        
    },
    mounted(){
        this.markSettingTempCarAdd = this.Util.isPermission('markSettingTempCarAdd')
        this.markSettingTempCarUpdate = this.Util.isPermission('markSettingTempCarUpdate')
        this.markSettingTempCarDelete = this.Util.isPermission('markSettingTempCarDelete')
        this.markSettingTempCarImport = this.Util.isPermission('markSettingTempCarImport')
        this.markSettingTempCarExport = this.Util.isPermission('markSettingTempCarExport')
    },    
    methods:{
        //监听打开弹窗
        listenOpentempCarDialog(){
            this.getWhitelist(true)
        },
        //监听关闭弹窗
        listenClosedtempCarDialog(){
            this.$emit('listenCloseMainDialog') 									
        },        
        //打开编辑弹窗
        openEditDialog(title,item){
            this.addVisible = true
            this.editTitle = title

            if( this.editTitle === '新增'){
               this.formData = {
                carNum:'',
                carType:'small',
                allowType:1,
                isAuto:1,
                beginTime:'',
                endTime:'',
                remark:'',                   
               }
            }else if(this.editTitle === '修改'){
                this.formData = this.Util.deepCopy(item)
                if (this.formData.beginTime) {
                    this.formData.beginTime = new Date(this.formData.beginTime)
                }
                if (this.formData.endTime) {
                    this.formData.endTime = new Date(this.formData.endTime)
                }                
               
            }
        },
        //监听关闭编辑弹窗
        listenCloseEditDialog(){
            this.$refs['formData'].resetFields()
            // this.addVisible = true
        },
        //编辑表单提交
        addSubmit(formName){
            this.$refs[formName].validate((valid) => {
					if (valid) {
                        this.formData.operatorName = this.Util.userInfo.realName    
                              if(this.editTitle === '新增'){
                                  this.addWhitelist()
                              }else if(this.editTitle === '修改'){
                                  this.updateWhitelist()
                              }           

					} else {
						return false;
					}
			}); 
        }, 
        //新增
        addWhitelist(){
            //预约车
           if (this.formData.allowType === 0) {
               if (!this.formData.beginTime) {
                   this.$message.error('请选择预约开始时间')
                   return
               }
               if (!this.formData.endTime) {
                   this.$message.error('请选择预约结束时间')
                    return
               }               
           }            
            this.formData.operatorName = this.Util.userInfo.realName    
            console.log(this.formData);

            let params = {
                carNum:this.formData.carNum,
                carType:this.formData.carType,
                allowType:this.formData.allowType,
                isAuto:this.formData.isAuto,
                beginTime:this.Util.formatDate.format(this.formData.beginTime,'yyyy-MM-dd hh:mm:ss'),
                endTime:this.Util.formatDate.format(this.formData.endTime,'yyyy-MM-dd hh:mm:ss'),
                remark:this.formData.remark, 
                operatorName:this.Util.userInfo.realName               
            }
        
            addWhitelist(params)
                .then((data) => {
                    if(data.code === 'SUCCESS'){
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.addVisible = false
                        this.getWhitelist(true)
                    }else{
                        this.$message.error(data.msg);                           
                    }
            })  

		 
        },        
        //修改
        updateWhitelist(){
            let params = this.Util.deepCopy(this.formData)
            //预约车
            if (this.formData.allowType === 0) {
                params.beginTime = this.Util.formatDate.format(this.formData.beginTime,'yyyy-MM-dd hh:mm:ss')
                params.endTime = this.Util.formatDate.format(this.formData.endTime,'yyyy-MM-dd hh:mm:ss')
            }else{
                params.beginTime = ''
                params.endTime = ''
            }
            updateWhitelist(params)
                .then((data) => {
                    if(data.code === 'SUCCESS'){
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.addVisible = false
                        this.getWhitelist(true)
                    }else{
                        this.$message.error(data.msg);                           
                    }
            })  
        },        
        // 删除    
        deleteWhitelist(row){
            let tempString = `您确定要删除临时车/预约车" ${row.carNum} "吗?`

            this.$confirm(tempString, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                deleteWhitelist({id:row.id})
                    .then((data) => {
                        if(data.code === 'SUCCESS'){
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.getWhitelist(true)
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
        // 导入表格,提交前
        beforeUpload(file){
            this.files = file
            this.fileName = file.name;

            const extension = file.name.split('.')[1] === 'xls'
            const extension2 = file.name.split('.')[1] === 'xlsx'

            if (!extension && !extension2) {
                this.fileName = ''
                this.files = null                
                this.$message.warning('上传文档只能是 xls、xlsx格式!')
                return
            }
            this.submitUpload()
            return false // 返回false不会自动上传

        },
         // 导入表格,提交
        submitUpload() {

            let fileFormData = new FormData()

            fileFormData.append('file', this.files)//filename是键，file是值，就是要传的文件，
            fileFormData.append('operatorName', this.Util.userInfo.realName)

            this.$axios({
                url:whitelistExcelImport,
                method: 'post',
                data: fileFormData,
                responseType: 'blob', //二进制流
                headers:{
                    'Content-Type':'multipart/form-data'
                }

            })
            .then( (res) => {
                    // console.log(res)
                    if(res.headers.code === 'SUCCESS'){
                        this.getWhitelist()
                        if (res.headers.errornum != 0) {
                            this.$confirm(`导入成功数量${res.headers.successnum}条,失败数量${res.headers.errornum}条,点击确定下载失败数据`, '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.Util.exportExcel(res)
                            }).catch(() => {
                            })                            
                            
                        }else{
                            this.$message({
                                message: `全部导入成功`,
                                type: 'success'
                            })
                        }
                    }
                    else {
                        this.$message.error(res.data.msg);
                        
                    }
            }) 

        },  
        //导出Excel
        whitelistExcelExport(){
            let param = {
                isAuto:this.inParkType,  
                carNum:'',
                remark: '',
                operatorName: '',
            }            

            if(this.searchType === '车牌号'){
                param.carNum = this.searchValue

            }else if( this.searchType === '管理员'){
                param.operatorName = this.searchValue
            }else if( this.searchType === '备注'){
                param.remark = this.searchValue
            }
            if (this.Util.isBrowerIE()) {
                let URLStr = `${whitelistExcelExport}?isAuto=${param.isAuto}&carNum=${param.carNum}&remark=${param.remark}&operatorName=${param.operatorName}`
                this.Util.ieExportExcel(URLStr)                
            }else{
                try {
                    this.$axios({
                        url:whitelistExcelExport,
                        method: 'get',
                        params: param,
                        responseType: 'blob', //二进制流   
                    })
                    .then( (res) => {
                            // console.log(res)
                        if (res.headers.code === 'SUCCESS') {
                            this.Util.exportExcel(res)
                        }else{
                            this.$message.error(decodeURI(res.headers.msg))
                        } 
                    })                
                } catch (error) {
                // console.log(error); 
                }
            }

        }, 
        /**
         * 查询
         * @param {booleal} isGlobal 是否是全局搜索,true表示是,当前页要置为1
         */         
        getWhitelist(isGlobal) {
            
            if(isGlobal){
                this.currentPage = 1
            }

            let param = {
                isAuto:this.inParkType,  
                carNum:'',
                remark: '',
                operatorName: '',
                current:this.currentPage-1,     //前端第一页为1,后端第一页为0
                length:this.pageSize,
            }            

            if(this.searchType === '车牌号'){
                param.carNum = this.searchValue

            }else if( this.searchType === '管理员'){
                param.operatorName = this.searchValue
            }else if( this.searchType === '备注'){
                param.remark = this.searchValue
            }
            this.listLoading = true
            getWhitelist(param).then(data => {
                // console.log(data)
                this.listLoading = false
                if (data.data.code === "SUCCESS") {
                    // this.$message({
                    //     type:'success',
                    //     message:'success',
                    // })
                    this.array = data.data.data
                    this.dataTotal = data.data.totalCount

                } else {
                    this.$message.error(data.data.msg)
                }
            }).catch(err=>{
                    this.listLoading = false
            })
        },       
        //页码改变
        handleSizeChange(val) {
            this.pageSize = val
            this.getWhitelist(false)
        },
        //页改变
        handleCurrentChange(val) {
            this.getWhitelist(false)
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
}
 
</style>



