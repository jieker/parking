<!--用户管理-->
  <template>
    <section >
        <div  class="content">
            <!--工具条-->
            <el-col :span="24" class="content-body" >
                <div class="body-top clearfix">
                    <div class="body-top-left">
                        <el-select class="width-120" v-model="searchType" placeholder="请选择" @change="searchValue = ''">
                            <el-option label="账号名" value="账号名"></el-option>
                            <el-option label="员工编号" value="员工编号"></el-option>
                            <el-option label="真实姓名" value="真实姓名"></el-option>
                            <el-option label="角色名" value="角色名"></el-option>
                        </el-select>                         
                        <el-input class="width-180" v-model.trim="searchValue" @keyup.enter.native ="getTableList(true)" placeholder="请输入查询关键字" clearable ></el-input>
                        <el-button type="primary" size="small" @click="getListUser(true)">查询</el-button>
                    </div>
                    <div class="body-top-right text-right">
                        <el-button  size="small" type="primary"  @click="editUser('新增用户',null)" v-if="markManageUserAdd">添加</el-button>
                    </div>
                </div>
            </el-col>
            <!--列表 -->
            <el-table :data="array"  highlight-current-row v-loading="listLoading" height="539" :row-class-name="tableRowClassName">
                <el-table-column type="index" :index="indexMethod" label="序号" width="55">
                </el-table-column>
                <el-table-column prop="roleName" label="角色名" :formatter="formatRole" min-width="100" sortable>
                    <template slot-scope="scope">
                        <span>{{scope.row.role&&scope.row.role.length?scope.row.role[0].roleName:'暂无角色'}}</span>
                    </template>                    
                </el-table-column>
                <el-table-column prop="account" label="用户账户"  min-width="110" sortable>
                </el-table-column>
                <el-table-column prop="realName" label="姓名"  min-width="100" sortable>
                </el-table-column>
                <el-table-column prop="deleteFlag" label="用户状态"  min-width="100" :formatter="formatDeleteState" sortable>
                </el-table-column>
                <el-table-column prop="employeeNo" label="编号"  min-width="100" sortable>
                </el-table-column>
                <el-table-column prop="createTime" label="添加时间"  min-width="160"  sortable>
                </el-table-column>
                <el-table-column label="操作" min-width="160">
                    <template slot-scope="scope">
                        <a href="javascript:;" class="text-blue" 
                            @click="updatePass(scope.$index,scope.row)" 
                            v-show="scope.row.account!=='admin'&&scope.row.deleteFlag!==1"
                            v-if="markManageUserReset"
                        >重置密码</a>
                        <a href="javascript:;" class="text-blue" 
                            @click="editUser('修改用户',scope.row)" 
                            v-show="scope.row.account!=='admin'&&scope.row.deleteFlag!==1"
                            v-if="markManageUserUpdate"
                        >&nbsp&nbsp<i class="el-icon-edit"></i>修改&nbsp&nbsp</a>
                        <a href="javascript:;" class="text-danger" @click="deleteUser(scope.$index,scope.row)" 
                            v-show="scope.row.account!=='admin'&&scope.row.account!==Util.userInfo.account&&scope.row.deleteFlag!==1"
                            v-if="markManageUserDelete"
                        ><i class="el-icon-delete"></i>删除</a>
                    </template>
                </el-table-column>
            </el-table> 
             <div class="elPag clearfix">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 40, 80, 120]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total" >
                </el-pagination>
                <el-button type="primary" class="PagGo">GO</el-button>
            </div>
        </div>
        <!--添加/修改用户弹窗-->
        <el-dialog  :title="dialogTitle" :visible.sync="addUserVisible" width="30%" @open="listenOpenEditUserDialog" @close="listenCloseEditUserDialog">
            <el-form  :model="addUser" label-width="100px" :rules="rulesAddUser" ref="addUser" class="dialog-addUser">
                <el-form-item label="用户角色"  prop="roleId" style="margin-bottom:20px">
                    <el-select v-model="addUser.roleId" placeholder="请选择" class="userType">
                        <el-option v-for="item in listRole" :label="item.roleName" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户账户"  prop="account" >
                    <el-input class="width-200" v-model.trim="addUser.account" clearable maxlength="32" placeholder="请输入用户账户"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名"  prop="realName" >
                    <el-input class="width-200" v-model.trim="addUser.realName" clearable maxlength="32" placeholder="请输入用户真实姓名"></el-input>
                </el-form-item>
                <el-form-item label="员工编号"  prop="employeeNo" >
                    <el-input class="width-200" v-model.trim="addUser.employeeNo" clearable maxlength="32" placeholder="请输入员工编号"></el-input>
                </el-form-item>
                <el-form-item v-show="dialogTitle==='新增用户'" label="用户密码" prop="password">
                    <el-input class="width-200" type="password" v-model.trim="addUser.password" clearable maxlength="32" placeholder="请输入用户密码"></el-input>
                </el-form-item>
                <el-form-item v-show="dialogTitle==='新增用户'" label="确认密码" prop="rePassWord">
                    <el-input class="width-200" type="password" v-model.trim="addUser.rePassWord" clearable maxlength="32" placeholder="请输入确认密码"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="addUserSubmit" :loading="addUserLoading">提交</el-button>
                <el-button @click.native="addUserVisible = false">取消</el-button>
            </div>
        </el-dialog>   
    </section>
</template>

<script>

import {base,listRole,listUser,addUser,updateUser,deleteUser,resetPass} from '@/api/api';
let Base64 = require('js-base64').Base64;

export default {

    data(){
    //密码确定校验
      var rePassUser = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.addUser.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };        
      var rePassUpdate = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.rePass.passwordNew) {
          callback(new Error('输入密码不一致!'));
        } else {
          callback();
        }
      };        
      return{
            msg:'用户管理',
            dialogTitle:'新增用户',
            searchType: '账号名',
            searchValue: '',
            // 列表信息
            array: [],
            currentPage:1,
            total: 0,
            pageSize: 10,
            listLoading: false,

            listRole:[],            //角色类型列表
            //新增用户信息
            addUserVisible:false,
            addUserLoading:false,
            addUser:{
                roleId:'',
                account:"",
                employeeNo:'',
                realName:'',
                password:'',
                rePassWord:''
            },
            rulesAddUser:{
                rePassWord:[{
                    required: true,  validator:rePassUser, trigger: 'blur'
                }],
                roleId:[{
                    required: true,  message:'请选择用户角色', trigger: 'blur'
                }],
                account:[{
                    required: true,   message:'请输入用户账户', trigger: 'blur'
                }],
                realName:[{
                    required: true,  message:'请输入真实姓名', trigger: 'blur'
                }],
                employeeNo:[{
                    required: true,  message:'请输入员工编号', trigger: 'blur'
                }],
                password:[{
                    required: true,  message:'请输入用户密码', trigger: 'blur'
                }],
            },

            //修改密码信息
            rePassLoading:false,
            rePass:{
                operatorId:'',
                account:"",
                password:'',
                passwordNew:'',
                rePassWord:''
            },
            rulesRePass:{
                password:[{
                    required: true,  message:'请输入密码', trigger: 'blur'
                }],
                rePassWord:[{
                    required: true,  validator:rePassUpdate, trigger: 'blur'
                }],
                passwordNew:[{
                    required: true,  message:'请输入新密码', trigger: 'blur'
                }],
            },
           markManageUserAdd: false, 
           markManageUserUpdate: false, 
           markManageUserDelete: false, 
           markManageUserReset: false, 
        }
    },
    mounted(){
        this.markManageUserAdd = this.Util.isPermission('markManageUserAdd')
        this.markManageUserUpdate = this.Util.isPermission('markManageUserUpdate')        
        this.markManageUserDelete = this.Util.isPermission('markManageUserDelete')        
        this.markManageUserReset = this.Util.isPermission('markManageUserReset')

        this.getListUser(false)

    },
    beforeUpdate(){
        try {
            let menuNode = document.getElementsByClassName('menu-active')
            menuNode[0].classList.remove('menu-active')  
        } catch (error) {}        
        document.getElementById("menu-box-7").classList.add("menu-active")				
    },    
    methods:{
        tableRowClassName({row,rowIndex}){
            if (row.deleteFlag === 1) {
                return "delete-text";
            }
        },
        //监听新增修改用户弹窗打开
        listenOpenEditUserDialog(){
            this.getListRole()
        },     
        //监听新增修改用户弹窗关闭
        listenCloseEditUserDialog(){
            this.addUser.roleId = ''
            this.addUser.account = ''
            this.addUser.employeeNo = ''
            this.addUser.realName = ''
            this.addUser.password = ''
            this.addUser.rePassWord = ''
            this.$refs['addUser'].resetFields()
        },    
        //点击新增修改按钮打开弹窗        
        editUser(dialogTitle,user){
            this.dialogTitle = dialogTitle
            this.addUserVisible = true
            if(this.dialogTitle === '新增用户'){
                this.addUser.roleId = ''
                this.addUser.account = ''
                this.addUser.employeeNo = ''
                this.addUser.realName = ''
                this.addUser.password = ''
                this.addUser.rePassWord = ''
            }else if(this.dialogTitle === '修改用户'){
                // this.addUser = this.Util.deepCopy(user)
                if (user.role.length > 0) {
                    this.addUser.roleId = user.role[0].id
                }
                this.addUser.account = user.account
                this.addUser.employeeNo = user.employeeNo
                this.addUser.realName = user.realName
                this.addUser.password = user.password
                this.addUser.rePassWord = user.password
                this.addUser.id = user.id
                // console.log(this.addUser);
            }
        },
        // 每页数据大小
        handleSizeChange(val) {
            this.pageSize =  val ;
            this.getListUser(true);
        },
        // 当前页
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getListUser(true);               
        },
        // 自定义序号
        indexMethod(index){
            return index +this.pageSize*(this.currentPage-1);
        },
        // 创建时间转换
        formatCreatTime (row, column) {
            let time=new Date(row.createTime);
            return this.Util.formatDate.format(time,'yy/MM/dd  hh:mm')
        },
        // 获取角色名
        formatRole(row, column) {
            // let time=new Date(row.createTime);
            if(row.operatorRole){
                return row.operatorRole.role.roleName
            }
        },
        // 用户状态
        formatDeleteState: function (row, column) {
            // let time=new Date(row.createTime);
            return row.deleteFlag==0?'正常':row.deleteFlag==1?'已删除':'未知'
        },
        //角色列表
        getListRole(){
            listRole().then(res=>{
                // console.log(res);
                if (res.data.code === "SUCCESS") {
                   this.listRole=res.data.data
                } else {
                    this.$message.error(res.data.msg)
                }                 
            })
        },
        // 用户列表
        getListUser(isPara){
            this.array=[];
            let para={
                length:this.pageSize,
                current:this.currentPage
            }
            if (this.searchType === '账号名') {
                para.account = this.searchValue
            } else if(this.searchType === '员工编号') {
                para.employeeNo = this.searchValue
            }else if(this.searchType === '真实姓名') {
                para.realName = this.searchValue
            }else if(this.searchType === '角色名') {
                para.roleName	 = this.searchValue
            }else{

            }
            para=isPara?para:null
            listUser(para).then(res=>{
                // console.log(res)
                if (res.data.code === "SUCCESS") {
                    this.array=res.data.data.content
                    this.total=res.data.data.totalElements
                } else {
                    this.$message.error(res.data.msg)
                }                

            })
        },
        // 新增用户提交
        addUserSubmit(){
            var _this=this;
            this.$refs.addUser.validate((valid) => {
                if (valid) {
                    let para={
                        roleId:_this.addUser.roleId,
                        realName:_this.addUser.realName,
                        account:_this.addUser.account,
                        employeeNo:_this.addUser.employeeNo,
                        password:Base64.encode(_this.addUser.password),
                        id:_this.addUser.id,
                        operatorId:this.Util.userInfo.id
                    }
                    // console.log(para)
                    if(this.dialogTitle === '新增用户'){
                        addUser(para).then(res=>{
                            // console.log(res);
                            if(res.code === 'SUCCESS'){
                                _this.$message({
                                    type:'success',
                                    message:res.msg
                                })
                                _this.addUserVisible=false;
                                _this.getListUser(false);
                            }else{
                                _this.$message.error(res.msg)
                            }
                        })
                    }else if(this.dialogTitle === '修改用户'){
                        delete para.password
                        updateUser(para).then(res=>{
                            // console.log(res.data);
                            if(res.code === 'SUCCESS'){
                                _this.$message({
                                    type:'success',
                                    message:res.msg
                                })
                                _this.addUserVisible=false;
                                _this.getListUser(false);
                            }else{
                                _this.$message.error(res.msg)
                            }
                        })
                    }                    

                    
                } else {
                 
                  return false;
                }
              });
        },
        //重置密码
        updatePass(index,row){
            let _this=this;
            this.$confirm('您确定要将密码重置为123456吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let para={
                    "account": row.id,
                    "id": row.id,
                    "operatorId": this.Util.userInfo.id,
                    "passwordNew": Base64.encode('123456')                   
                }
                resetPass(para).then(res=>{
                    // console.log(res)
                    if(res.msg=='成功'){
                        _this.$message({
                            type: 'success',
                            message:res.msg
                        });
                        // _this.getListUser(false);
                    }
                }).catch(err=>{
                    console.log(err)
                })
                // let url=base+'/user/'+para.id+'/delete'
                // this.$axios.post(url,para).then(res=>{
                //     // console.log(res);
                //     if(res.data.msg=='成功'){
                //         _this.$message({
                //             type: 'success',
                //             message:res.data.msg
                //         });
                //         _this.getListUser(false);
                //     }
                // }).catch(err=>{
                //     console.log(err)
                // })
            }).catch(() => {
                _this.$message({
                    type: 'info',
                    message: '已取消重置'
                });
            });
        },
     
        //删除用户
        deleteUser(index,row){
            let _this=this;
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    let para={
                        id:row.id,
                        deleteFlag:1
                    }
                    deleteUser(para).then(res=>{
                        console.log(res)
                        if(res.code=='SUCCESS'){
                            _this.$message({
                                type: 'success',
                                message:res.msg
                            });
                            _this.getListUser(false);
                        }else{
                            _this.$message(res.msg)
                        }
                }).catch(err=>{
                        console.log(err)
                    })
                    // let url=base+'/user/'+para.id+'/delete'
                    // this.$axios.post(url,para).then(res=>{
                    //     // console.log(res);
                    //     if(res.data.msg=='成功'){
                    //         _this.$message({
                    //             type: 'success',
                    //             message:res.data.msg
                    //         });
                    //         _this.getListUser(false);
                    //     }
                    // }).catch(err=>{
                    //     console.log(err)
                    // })
                }).catch(() => {
                    _this.$message({
                    type: 'info',
                    message: '已取消删除'
                    });          
                });
        }
    }
}
</script>

<style lang="scss" scoped>
    .content{
        margin: 10px;
        padding:10px;
        background: $color-gray; 
        border-radius:10px;  
        .content-body{
            // padding:0px 10px;
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
    #mageUser{
        .el-dialog__body{
            text-align: center;
            .dialog-addUser{
                width: 60%;
                display: inline-block;
                .userType{
                    width: 100%;
                }
            }
        }
        .el-table{
            a{
                text-decoration: none;
                margin-left: 10px;
                cursor: pointer;
                &:hover{
                    color: #FC813B;
                }
            }
        }
    }
</style>
<style >

.el-table .delete-text {
  color: #a5a7aa;
}
</style>

