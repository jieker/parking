
 <!--角色管理-->
 <template>
    <section >
        <div  class="content">
            <!--工具条-->
            <el-col :span="24" class="content-body" >
                <div class="body-top clearfix">
                    <div class="body-top-left">
                        <el-input class="width-180" v-model.trim="searchValue" @keyup.enter.native ="getTableList(true)" placeholder="请输入查询关键字" clearable ></el-input>
                        <el-button type="primary" size="small" @click="getTableList(true)">查询</el-button>
                    </div>
                    <div class="body-top-right text-right">
                        <el-button size="small" type="primary"  @click="editRole('新增角色',null)" v-if="markManageRoleAdd">添加</el-button>
                    </div>
                </div>
            </el-col>
            <!--列表-->
            <el-table :data="array"  v-loading="listLoading" sortable height="539">
                <el-table-column type="index"  label="序号" width="55">
                </el-table-column>
                <el-table-column prop="roleName" label="角色名"  min-width="100" >
                </el-table-column>
                <el-table-column prop="remark" label="角色说明"  min-width="150" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="createTime" label="添加时间"  min-width="160"   sortable>
                </el-table-column>
                <el-table-column label="操作" min-width="100">
                    <template slot-scope="scope">
                        <a href="javascript:;" class="text-blue" 
                            @click="editRole('修改角色',scope.row)" v-show="scope.row.roleName!=='超级管理员'"
                            v-if="markManageRoleUpdate"
                        ><i class="el-icon-edit"></i>修改&nbsp&nbsp</a>
                        <a href="javascript:;" class="text-danger" 
                            @click="handleDelete(scope.row)" v-show="scope.row.roleName!=='超级管理员'"
                            v-if="markManageRoleDelete"
                        ><i class="el-icon-delete"></i>删除</a>
                    </template>
                </el-table-column>
            </el-table>
            <div class="elPag clearfix">
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
        </div>
        <!--新增角色  -->
        <el-dialog  :title="roleDialogTitle" :visible.sync="addRoleVisible" @open="listenOpenAddRoleDialog" @close="listenCloseAddroleDialog">
            <!-- <div class="bg-info"> -->
                <el-form  :model="roleFormData" label-width="100px" :rules="addRoleFormRules" ref="roleFormData">
                        <el-form-item label="角色名"  prop="roleName" style="margin-bottom:20px">
                                <el-input v-model.trim="roleFormData.roleName" clearable placeholder="请输入角色名">
                                </el-input>
                        </el-form-item>
                        <el-form-item label="角色说明"  prop="roleRemark" style="margin-bottom:20px">
                                <el-input type="textarea" v-model.trim="roleFormData.remark" clearable placeholder="点此输入角色说明">
                                </el-input>
                        </el-form-item>
                        <el-form-item label="部门"  style="margin-bottom:20px">
                            <el-select v-model="roleFormData.department" placeholder="选择部门">
                                <el-option v-for="item in departmentArray" :label="item.name" :value="item.id" :key="item.id" ></el-option>
                                <!--<el-option label="停车场级别" :value="0"></el-option>-->
                                <!--<el-option label="财务" :value="1"></el-option>-->
                                <!--<el-option label="岗亭" :value="2"></el-option>-->
                            </el-select>
                        </el-form-item>
                        <el-form-item label="模块权限">
                            <el-tree
                                :data="permissionData"
                                show-checkbox
                                node-key="id"
                                :default-checked-keys="defaultCheckedKeys"
                                :props="defaultProps"
                                :highlight-current="true"
                                accordion
                                ref="tree"
                                >
                            </el-tree>                        
                        </el-form-item>
                </el-form>
                <div slot="footer">
                    <el-button type="primary" @click="roleDialogSubmit('roleFormData')" >提交</el-button>
                    <el-button @click="addRoleVisible = false">取消</el-button>
                </div>
            <!-- </div> -->
        </el-dialog> 

    </section>
</template>
<script>
import { addRole, deleteRole, updateRole, enabledRole, getRoleList,getMenuListByRoleId} from '@/api/api';
export default {
    data() {
        return {
            roleList:'',   //列表数据
            listLoading: false,
            pageSize:10,
            dataTotal:0,
            currentPage:1,
            searchValue: '',
            departmentArray:[
                {id:0,name:'部门级别'},
                {id:1,name:'财务'},
                {id:2,name:'岗亭'}
            ],
            roleFormData:{
                department:'',
                "enabledFlag": 1,
                "permissionIds": [],
                "remark": "",
                "roleName": ""
            },
            defaultProps: {
                children: 'children',
                label: 'name'
            },  
            roleDialogTitle: '新增角色',
            // 列表信息
            array: [],
            addRoleVisible: false,
            addRoleLoading: false,
            addRoleFormRules: {
                roleName: [
                  { required: true, message: '请输入角色名', trigger: 'blur' },
                ],
            },
            permissionData:[],
            
            defaultCheckedKeys:[],

            markManageRoleAdd: false,
            markManageRoleUpdate: false,
            markManageRoleDelete: false,
        }
    },
    mounted() {
        this.markManageRoleAdd = this.Util.isPermission('markManageRoleAdd')
        this.markManageRoleUpdate = this.Util.isPermission('markManageRoleUpdate')        
        this.markManageRoleDelete = this.Util.isPermission('markManageRoleDelete') 

        this.getTableList(true);
    },
    beforeUpdate(){
        try {
            let menuNode = document.getElementsByClassName('menu-active')
            menuNode[0].classList.remove('menu-active')  
        } catch (error) {}         
        document.getElementById("menu-box-7").classList.add("menu-active")				
    },     
    filters:{
        transformEnabledFlag(value){
            return value === 1 ? '启用' : '关闭'
        }
    },    
    methods: {
        //监听打开新增/修改弹窗
        listenOpenAddRoleDialog(){
            let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
            if(userInfo) {  
                //防止新增比自己权限更高的角色,所以只能只能在当前登录用户角色权限树下分配权限
                this.getLoginMenuListByRoleId(userInfo.roleId)
            }else{
                this.$message.error('当前登录已失效,请重新登录')
            }
        },
        //监听关闭新增/修改弹窗
        listenCloseAddroleDialog(){
            this.defaultCheckedKeys = []
            this.$refs.tree.setCheckedKeys([]);
            this.roleFormData.enabledFlag = 1
            this.roleFormData.permissionIds = []
            this.roleFormData.remark = ''
            this.roleFormData.roleName = ''
        },        
        //页码改变
        handleSizeChange(val) {
            this.pageSize = val
            this.getTableList(false)
        },
        //页改变
        handleCurrentChange(val) {
            this.getTableList(false)
        }, 
        // 获取当前登录用户角色对应权限数据
        getLoginMenuListByRoleId(RoleId){
            getMenuListByRoleId({},RoleId).then(res=>{
                if(res.data.code === 'SUCCESS'){
                       let tempList =  res.data.data    
                       let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))

                       //如果不是超级管理员,删除其权限管理功能分配
                       if (userInfo.realName !== '超级管理员' ) {
                            for (let i = 0; i < tempList.length; i++) {
                                if (tempList[i].mark === 'markSetting') {
                                    for (let j = 0; j < tempList[i].children.length; j++) {
                                        if (tempList[i].children[j].mark === 'markManagePermissionQuery') {
                                            tempList[i].children.splice(j,1)
                                        }
                                    }
                                } 
                            }                           
                       }
 
                       this.permissionData =  tempList  

                }else{
                    this.message.error(res.data.msg)
                }

            })
        },           
        // 获取角色对应权限数据
        getMenuListByRoleId(RoleId){
            getMenuListByRoleId({},RoleId).then(res=>{
                    // console.log(res);
                if(res.data.code === 'SUCCESS'){
                    let tempList = res.data.data

                    let allIdList = []      //所有权限id
                    let leafIdList = []   //所有叶子节点id

                    filtersId(tempList)
                    function filtersId(arr){
                        for(let v of arr){
                            allIdList.push(v.id)
                            if(v.children && v.children.length){
                                //递归查找出所有叶子节点
                                filtersId(v.children)
                            }else{
                                leafIdList.push(v.id)
                            }
                            
                        }
                    }        
                    this.defaultCheckedKeys =  leafIdList

                }else{
                    this.message.error(res.data.msg)
                }

            })
        },         
        // 自定义序号
        indexMethod(index){
            return index +this.pageSize*(this.currentPage-1);
        },
        // 新增/修改角色
        editRole(title,role){
            // console.log(role)
            this.roleList = role
            this.addRoleVisible=true
            this.roleDialogTitle = title
            if(title === '新增角色'){
                this.roleFormData.enabledFlag = 1
                this.roleFormData.permissionIds = []
                this.roleFormData.remark = ''
                this.roleFormData.roleName = ''
            }else if(title === '修改角色'){
                // console.log(role);
                this.getMenuListByRoleId(role.id)

                this.roleFormData.enabledFlag = role.enabledFlag
              
                this.roleFormData.department = role.deptNo
                // console.log(this.roleFormData.department)
                this.roleFormData.permissionIds = []
                this.roleFormData.remark = role.remark
                this.roleFormData.roleName = role.roleName
                this.roleFormData.id = role.id

            }
        },
        //表单提交
        roleDialogSubmit(formName){

            this.$refs[formName].validate((valid) => {
                if (valid) {
                        let checkedKeys = this.$refs.tree.getCheckedKeys()              //节点选择状态
                        let halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()      //节点半选中状态
                        //合并并去重
                        this.roleFormData.permissionIds = [...new Set([...checkedKeys, ...halfCheckedKeys])]

                        let params = {
                            "enabledFlag": this.roleFormData.enabledFlag,
                            "deptNo": this.roleFormData.department,
                            "operatorId": this.Util.userInfo.id,
                            "permissionIds": this.roleFormData.permissionIds,
                            "remark": this.roleFormData.remark,
                            "roleName": this.roleFormData.roleName                                
                        }       

                        if(this.roleDialogTitle === '新增角色'){

                            addRole(params)
                                .then((data) => {
                                    if(data.code === 'SUCCESS'){
                                        this.$message({
                                            message: '操作成功',
                                            type: 'success'
                                        });
                                        this.addRoleVisible = false
                                        this.getTableList(true)
                                    }else{
                                        this.$message.error(data.msg);                           
                                    }
                            })                             
                        }else if(this.roleDialogTitle === '修改角色'){
                            // console.log(params);
                            params.id = this.roleFormData.id
                            updateRole(params)
                                .then((data) => {
                                    if(data.code === 'SUCCESS'){
                                        this.$message({
                                            message: '操作成功',
                                            type: 'success'
                                        });
                                        this.addRoleVisible = false
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
        //切换启用状态
        enabledRole(role){
            this.$confirm('您确认切换启用状态吗?', '提示', {
                type: 'warning'
                }).then(() => {
                    let enabledFlag = null
                    role.enabledFlag === 0 ? enabledFlag = 1 :enabledFlag = 0

                    let params = {
                        "enabledFlag": enabledFlag,
                        "id": role.id,
                        "operatorId": this.Util.userInfo.id                        
                    }
                    enabledRole(params,role.id)
                        .then((data) => {
                            // console.log(data);
                            if(data.code === 'SUCCESS'){
                                this.$message({
                                    type:'success',
                                    message:'操作成功'
                                })
                                this.getTableList(true)
                            }else{
                                this.$message.error(data.msg)
                            }
                        })
            });            
        },
        //删除
        handleDelete(row) {
            // console.log(index)
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
                }).then(() => {
                    let params = {
                        "id": row.id,
                        "operatorId": this.Util.userInfo.id                       
                    }
                    deleteRole(params,row.id)
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
            });
        },
        /**
         * 查询
         * @param {booleal} isGlobal 是否是全局搜索,true表示是,当前页要置为1
         */         
        getTableList(isGlobal) {
            if(isGlobal){
                this.currentPage = 1
            }

            let param = {
                roleName:this.searchValue,  
                current:this.currentPage,    
                length:this.pageSize,
            }            

            this.listLoading = true
            getRoleList(param).then(data => {
                // console.log(data)
                this.listLoading = false
                if (data.data.code === "SUCCESS") {
                    this.array = data.data.data.content
                    this.dataTotal = data.data.data.totalElements

                } else {
                    this.$message.error(data.data.msg)
                }
            });
        }, 
    },
}

</script>

<style lang="scss" scoped>
    .content{
        margin: 10px;
        padding:10px;
        background: $color-gray; 
        border-radius:10px;  
        .content-body{
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

