<!--权限管理-->
<template>
    <section >
        <div class="content">
            <!--工具条-->
            <el-col :span="24" class="content-body" >
                <div class="body-top clearfix">
                    <div class="body-top-left">
                    </div>
                    <div class="body-top-right text-right">
                        <el-button  type="primary" size="small" style="margin-bottom:10px" @click="openAddPermissionDialogByBtn" v-if="markManagePermissionAdd">增加一级菜单</el-button>
                        <el-button  type="primary" size="small" style="margin-bottom:10px" @click="getTableList" >刷新</el-button>
                    </div>
                </div>
                <div style="padding:5px 25px;background:#eeeeee;">
                    <span class="custom-tree-node text-center">
                        <span>权限名</span>
                        <span>权限标识</span>
                        <span>权限代码</span>
                        <span>权限类型</span>
                        <span>页面路径</span>
                        <span>操作</span>
                    </span>
                </div>                
            </el-col>            
            <div class="content-tree">

                <el-tree
                    :data="permissionData"
                    node-key="id"
                    :props="defaultProps"
                    :highlight-current="true"
                    default-expand-all
                    :expand-on-click-node="false"
                    >
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ data.name }}</span>
                        <span>{{ data.mark }}</span>
                        <span>{{ data.code }}</span>
                        <span>{{ data.type | transformPermissionType }}</span>
                        <span>{{ data.path }}</span>
                        <span>
                            <a src="javascript:;" class="text-blue" @click="append(data)" v-if="markManagePermissionAdd">增加子菜单</a>
                            <a src="javascript:;" class="text-blue" 
                                @click="edit(data)"
                                v-if="markManagePermissionUpdate"
                            >&nbsp&nbsp<i class="el-icon-edit"></i>修改&nbsp&nbsp</a>
                            <a src="javascript:;" 
                                class="text-danger" @click="remove(node, data)"
                                v-if="markManagePermissionDelete"
                            ><i class="el-icon-delete"></i>删除</a>
                        </span>
                    </span>                   
                </el-tree> 
            </div>                

        </div>
        <!--新增权限  -->
        <el-dialog  :title="dialogTitle" :visible.sync="addPermissionVisible" @open="listenOpenAddPermissionDialog" @close="listenCloseAddPermissionDialog">
            <el-form  :model="addPermissionFormData" label-width="160px" :rules="addPermissionFormRules" ref="addPermissionFormData">
                    <el-form-item label="权限名"  prop="name" >
                            <el-input v-model="addPermissionFormData.name" placeholder="请输入权限名" clearable maxlength="50"></el-input>
                    </el-form-item>
                    <el-form-item label="权限标识"  prop="mark" >
                            <el-input v-model="addPermissionFormData.mark" placeholder="请输入权限标识" clearable maxlength="50"></el-input>
                    </el-form-item>     
                    <el-form-item label="权限代码"  prop="code" >
                            <el-input v-model="addPermissionFormData.code" placeholder="请输入权限代码" clearable maxlength="50"></el-input>
                    </el-form-item>   
                    <el-form-item label="排序顺序"  prop="orderNum" >
                            <el-input-number v-model="addPermissionFormData.orderNum" clearable :min="1" :max="1000" placeholder="请输入当前级的排序顺序" label="请输入当前级的排序顺序"></el-input-number>                        
                            <!-- <el-input v-model="addPermissionFormData.orderNum" placeholder="请输入当前级的排序顺序" clearable maxlength="50"></el-input> -->
                    </el-form-item>                                                      
                    <el-form-item label="权限类型"  prop="type" placeholder="请选择权限类型">
                            <el-select v-model="addPermissionFormData.type">
                                <el-option :value="0" label="目录"></el-option>
                                <el-option :value="1" label="菜单"></el-option>
                                <el-option :value="2" label="按钮"></el-option>
                            </el-select>
                    </el-form-item>      
                    <el-form-item label="页面路径"  prop="path" >
                            <el-input v-model="addPermissionFormData.path" placeholder="/url" clearable></el-input>
                    </el-form-item>  
                    <el-form-item label="页面资源文件路径"  prop="component" >
                            <el-input v-model="addPermissionFormData.component" placeholder="filename/filename/filename" clearable></el-input>
                    </el-form-item>           
                    <el-form-item label="目录图标"  prop="icon" >
                            <el-input v-model="addPermissionFormData.icon" placeholder="fa fa-credit-card" clearable></el-input>
                    </el-form-item>                                                               
                    <el-form-item label="是否是财务端目录菜单"  prop="finAff" >
                            <el-select v-model="addPermissionFormData.finAff">
                                <el-option :value="0" label="否"></el-option>
                                <el-option :value="1" label="是"></el-option>
                            </el-select>
                    </el-form-item> 
                    <el-form-item label="启用状态"  prop="enabledFlag" >
                            <el-select v-model="addPermissionFormData.enabledFlag">
                                <el-option :value="1" label="启用"></el-option>
                                <el-option :value="0" label="关闭"></el-option>
                            </el-select>
                    </el-form-item>                    

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addPermissionSubmit('addPermissionFormData')" >提交</el-button>
                <el-button @click.native="addPermissionVisible = false">取消</el-button>
            </div>
        </el-dialog> 

    </section>
</template>

<script>
import { addMenu,deleteMenu,updateMenu,enableMenu,getMenuList } from '@/api/api';
export default {
    data() {
        return {
            defaultProps: {
                children: 'children',
                label: 'label'
            },   
            dialogTitle:'新增权限',         
            // 列表信息
            listLoading: false,
            addPermissionVisible: false,
            addPermissionLoading: false,
            addPermissionFormData:{
                "component": "",
                "enabledFlag": 1,
                "finAff": 0,
                "icon": "",
                "id": "",
                "name": "",
                "mark": "",
                "code": "1",
                "operatorId":'',
                "orderNum": null,
                "parentId": "",
                "path": "",
                "type": 2 
            },            
            addPermissionFormRules: {
                name: [
                  { required: true, message: '请输入权限名', trigger: 'blur' },
                ],
                mark: [
                  { required: true, message: '请输入权限标识', trigger: 'blur' },
                ], 
                code: [
                  { required: true, message: '请输入权限标识', trigger: 'blur' },
                ],   
                orderNum: [
                  { required: true, message: '请输入当前级的排序顺序', trigger: 'change' },
                ],                                             
            },
            permissionData:[],

            markManagePermissionAdd: false,
            markManagePermissionUpdate: false,
            markManagePermissionDelete: false,            
        }
    },
    mounted() {
        this.markManagePermissionAdd = this.Util.isPermission('markManagePermissionAdd')
        this.markManagePermissionUpdate = this.Util.isPermission('markManagePermissionUpdate')        
        this.markManagePermissionDelete = this.Util.isPermission('markManagePermissionDelete')

        this.getTableList()
         
    },
    beforeUpdate(){
        try {
            let menuNode = document.getElementsByClassName('menu-active')
            menuNode[0].classList.remove('menu-active')  
        } catch (error) {}        
        document.getElementById("menu-box-7").classList.add("menu-active")				
    },     
    filters:{
        transformPermissionType(value){
            return value === 0 ? '目录' : value === 1 ? '菜单' : value === 2 ? '按钮' : '未知'
        }
    },
    methods: {
        //新增一级菜单
        openAddPermissionDialogByBtn(){
            this.dialogTitle = '新增权限'
            this.addPermissionVisible=true

        },
        //监听弹窗打开
        listenOpenAddPermissionDialog(){
            this.addPermissionFormData
        },
        // 监听弹窗关闭
        listenCloseAddPermissionDialog(){
            for(let item in this.addPermissionFormData){
                this.addPermissionFormData[item] = null
            }            
            this.addPermissionFormData.finAff = 0
            this.addPermissionFormData.type = 2
            this.addPermissionFormData.code = '1'
            this.addPermissionFormData.enabledFlag = 1
        },        
      
        //表单提交
        addPermissionSubmit(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                        this.addPermissionFormData.operatorId = this.Util.userInfo.id
                        if(this.dialogTitle === '新增权限'){
                            addMenu(this.addPermissionFormData)
                                .then((data) => {
                                    if(data.code === 'SUCCESS'){
                                        this.$message({
                                            message: '操作成功',
                                            type: 'success'
                                        });
                                        this.addPermissionVisible = false
                                        this.getTableList(true)
                                    }else{
                                        this.$message.error(data.msg);                           
                                    }
                            })                             
                        }else if(this.dialogTitle === '修改权限'){
                            updateMenu(this.addPermissionFormData)
                                .then((data) => {
                                    if(data.code === 'SUCCESS'){
                                        this.$message({
                                            message: '操作成功',
                                            type: 'success'
                                        });
                                        this.addPermissionVisible = false
                                        this.getTableList(true)
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
     
        // 获取table数据
        getTableList(){
            let params = {
                name:'',
                current:1,
                length:1000,
            }
            getMenuList(params).then(res=>{
                    // console.log(res);
                if(res.data.code === 'SUCCESS'){
                       this.permissionData =  res.data.data   
                    //    console.dir(this.permissionData);            
                }else{
                    this.message.error(res.data.msg)
                }

            })
        
        },
        //节点上增加权限
        append(data) {
            // console.log(data);
            this.dialogTitle = '新增权限'
            this.addPermissionVisible = true
            this.addPermissionFormData.parentId = data.id 
           
        },
        //节点上修改权限
        edit(data) {
            // console.log(data);
            this.dialogTitle = '修改权限'
            this.addPermissionVisible = true
            this.addPermissionFormData = this.Util.deepCopy(data)
            this.addPermissionFormData.operatorId = this.Util.userInfo.id
            delete this.addPermissionFormData.createTime
            delete this.addPermissionFormData.updateTime

        },        

        remove(node, data) {
            this.$confirm('该删除为永久删除,您确认删除该记录吗?', '提示', {
                type: 'warning'
                }).then(() => {
                    deleteMenu({},data.id)
                        .then((data) => {
                            // console.log(data);
                            if(data.code === 'SUCCESS'){
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
                                this.addPermissionVisible = false
                                this.getTableList(true)
                            }else{
                                this.$message.error(data.msg);                           
                            }
                    }) 
            })
        },        
    },
}

</script>

<style lang="scss" scoped>
    .content{
        margin: 8px;
        padding:8px;
        background: $color-gray; 
        border-radius:10px;

        .content-body{
            // padding:0px 10px;
            background: $color-gray; 
            .body-top{
                //  padding: 10px 0px;
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
        .content-tree{
            width: 100%;
            height: 670px;  
            overflow-y: auto;            
        }
    } 
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
        span{
            // display: inline-block;
            // min-width:200px;
            // border-left:1px solid $color-gray; 
            // border-right:1px solid $color-gray; 
        }
    }
   
</style>

