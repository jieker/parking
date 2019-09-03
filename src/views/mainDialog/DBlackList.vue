<template>
<div>
    <!-- 弹窗-黑名单 -->
    <el-dialog class="form-dialog" title="黑名单"  width="88%" :visible.sync="blacklistProp.visible" @open="listenOpenBlacklistDialog"  @closed="listenClosedBlacklistDialog" :close-on-click-modal="false">
        <el-row class="content">
            <el-col :span="24" class="content-body">
                <div class="body-top clearfix">
                    <div class="body-top-left">
                        <el-select class="width-120" v-model="searchType" placeholder="请选择" @change="searchValue = ''">
                            <el-option label="车牌号" value="车牌号"></el-option>
                            <el-option label="管理员" value="管理员"></el-option>
                        </el-select>                    
                        <el-input class="width-180" v-model.trim="searchValue" @keyup.enter.native ="getBlacklist(true)" placeholder="请输入查询关键字" clearable ></el-input>
                        <el-button type="primary" size="mini" @click="getBlacklist(true)">查询</el-button>
                    </div>
                    <div class="body-top-right text-right">
                        <el-upload  action=""  :limit="1" :file-list="fileList" :before-upload="beforeUpload" :show-file-list="false" style="display:inline-block;">
                            <el-button slot="trigger" type="primary" size="mini" style="margin-right:10px;" v-if="markSettingBlackListImport">导入</el-button>
                        </el-upload>                         
                        <el-button type="primary" size="mini" @click="blacklistExcelExport" v-if="markSettingBlackListExport">导出</el-button>
                        <!-- <el-button type="primary" size="mini" v-print="'#printBlackList'" >打印</el-button>                         -->
                        <el-button type="primary" size="mini" @click="openAddDialog" v-if="markSettingBlackListAdd">新增</el-button>
                    </div>
                </div>
                <div class="body-table" id="printBlackList">
                        <!--列表-->
                        <el-table :data="array"  v-loading="listLoading" sortable height="539" >
                            <el-table-column type="index"  min-width="80" >
                            </el-table-column>                            
                            <el-table-column prop="carNum" label="车牌号" min-width="90" sortable >
                            </el-table-column>
                            <el-table-column prop="carType" label="车类型" min-width="80" sortable >
                                <template slot-scope="scope">
                                    <span>{{scope.row.carType | transformCarType}}</span>
                                </template>                                
                            </el-table-column>                            
                            <el-table-column prop="operator" label="管理员" min-width="80" sortable >
                            </el-table-column>
                            <el-table-column prop="createTime" label="添加时间" min-width=160 sortable >
                            </el-table-column> 
                            <el-table-column prop="blackReason" label="备注" min-width="130" sortable show-overflow-tooltip >
                            </el-table-column>    
                            <el-table-column label="操作" min-width="80"  >
                                <template slot-scope="scope">
                                    <a href="javaScript:;" class="text-danger" @click="deleteBlacklist(scope.row)" v-if="markSettingBlackListDelete"><i class="el-icon-delete"></i>删除</a>
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
    <el-dialog class="form-dialog" title="新增" width="30%" @close="listenCloseAddDialog" :visible.sync="addVisible" :close-on-click-modal="false">
        <div class="dialog-box">
            <el-form label-position="left" label-width="86px" :model="formData" :rules="formDataRules" ref="formData" >
                <el-form-item  label="车牌号码:" prop="carNum">
                    <keyboard v-model="formData.carNum" placeholder='请输入车牌号码'></keyboard>  
                </el-form-item>                     
                <el-form-item  label="车辆类型:" prop="carType">
                    <el-select class="width-180" v-model="formData.carType" placeholder="选择车辆类型" >
                        <el-option v-for="item in carTypeList" :key="item.mark" :label="item.typeName" :value="item.mark">
                        </el-option> 
                    </el-select>
                </el-form-item>
                <el-form-item  label="备注:">
                    <el-input v-model.trim="formData.blackReason" clearable placeholder="请输入备注" >
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
import {base,getBlacklist,addBlacklist,deleteBlacklist,blacklistExcelImport,blacklistExcelExport} from '@/api/api' ;

export default {
    props: [ 'blacklistProp' ],
    data(){
        return {
            listLoading: false,
            pageSize:10,
            dataTotal:0,
            currentPage:1,

            fileList:[],
            fileName:null,      //导入的文件名
            file:null,          //导入的文件            

            searchType:'车牌号', //查询类型
            searchValue:'',     //查询值

            array:[],
            addVisible:false,
            formData:{
                carNum:'',
                carType:'small',
                blackReason:'',
            },
            //表单数据验证
            formDataRules:{
                carNum: [
                        { required: true, message: '请输入车牌', trigger: 'change' },
                        { required: true, validator: this.Check.ruleCarNum, trigger: 'blur' }
                ],
                carType: [
                        { required: true, message: '请选择车类型', trigger: 'change' },
                ]
            },   
            
            markSettingBlackListAdd: false,
            markSettingBlackListUpdate: false,
            markSettingBlackListDelete: false,
            markSettingBlackListImport: false,
            markSettingBlackListExport: false,
        }
    },
    mounted(){
        this.markSettingBlackListAdd = this.Util.isPermission('markSettingBlackListAdd')
        this.markSettingBlackListUpdate = this.Util.isPermission('markSettingBlackListUpdate')
        this.markSettingBlackListDelete = this.Util.isPermission('markSettingBlackListDelete')
        this.markSettingBlackListImport = this.Util.isPermission('markSettingBlackListImport')
        this.markSettingBlackListExport = this.Util.isPermission('markSettingBlackListExport')
    },    
    computed: {
        ...mapGetters({
            carTypeList: 'getCarTypeList',	
        }),
    },    
    methods:{
        //监听打开弹窗
        listenOpenBlacklistDialog(){
            this.getBlacklist(true)
        },
        //监听关闭弹窗
        listenClosedBlacklistDialog(){
            this.$emit('listenCloseMainDialog') 									
        },         
        //打开新增弹窗
        openAddDialog(){
            this.addVisible = true
        },
        //监听关闭新增弹窗
        listenCloseAddDialog(){
            this.$refs['formData'].resetFields()
        },        
        //新增
        addSubmit(formName){

            this.$refs[formName].validate((valid) => {
					if (valid) {
                        this.formData.operator = this.Util.userInfo.realName
                        
                        addBlacklist(this.formData)
                            .then((data) => {
                                if(data.code === 'SUCCESS'){
                                    this.$message({
                                        message: '操作成功',
                                        type: 'success'
                                    });
                                    this.addVisible = false
                                    this.getBlacklist(true)
                                }else{
                                    this.$message.error(data.msg);                           
                                }
                        })                      
					} else {
						return false;
					}
			}); 
        }, 
        // 删除    
        deleteBlacklist(row){
            let tempString = `您确定要删除车牌" ${row.carNum} "吗?`

            this.$confirm(tempString, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                deleteBlacklist({id:row.id})
                    .then((data) => {
                        if(data.code === 'SUCCESS'){
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            this.getBlacklist(true)
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
                url:blacklistExcelImport,
                method: 'post',
                data: fileFormData,
                responseType: 'blob', //二进制流
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            })
            .then( (res) => {
                    // console.log(res)
                    if (res.headers.code === 'SUCCESS') {
                        this.getBlacklist()
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
                        
                    }else{
                        this.$message.error(decodeURI(res.headers.msg))
                    }
                   
            }) 

        },  
        //导出Excel
        blacklistExcelExport(){
            let param = {
                carNum:'',
                operator: '',
            }            

            if(this.searchType === '车牌号'){
                param.carNum = this.searchValue

            }else if( this.searchType === '管理员'){
                param.operator = this.searchValue
            }
            if (this.Util.isBrowerIE()) {
                // console.log(1111);
                let URLStr = `${blacklistExcelExport}?operator=${param.operator}&carNum=${param.carNum}`
                this.Util.ieExportExcel(URLStr)                
            }else{
                this.$axios({
                    url:blacklistExcelExport,
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
            }

        },                
          
        /**
         * 查询
         * @param {booleal} isGlobal 是否是全局搜索,true表示是,当前页要置为1
         */         
        getBlacklist(isGlobal) {
            if(isGlobal){
                this.currentPage = 1
            }

            let param = {
                carNum:'',
                operator: '',
                current:this.currentPage-1,     //前端第一页为1,后端第一页为0
                length:this.pageSize,
            }            

            if(this.searchType === '车牌号'){
                param.carNum = this.searchValue

            }else if( this.searchType === '管理员'){
                param.operator = this.searchValue
            }

            this.listLoading = true

            getBlacklist(param).then(data => {
                this.listLoading = false

                // console.log(data)
                if (data.data.code === "SUCCESS") {
                    this.array = data.data.data
                    this.dataTotal = data.data.totalCount

                }
               else {
                    this.$message.error(data.data.msg)
                }
            }).catch(err=>{
                this.listLoading = false
            })
        },       
        //页码改变
        handleSizeChange(val) {
            this.pageSize = val
            this.getBlacklist(false)
        },
        //页改变
        handleCurrentChange(val) {
            this.getBlacklist(false)
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



