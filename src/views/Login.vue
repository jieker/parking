<template>
    <section  v-loading="loading" element-loading-text="登录中,请稍后....">
        <el-col :span="24" class="header">
            <el-col :span="12" class="logo">
                <img class="logo-img" src="../assets/img/mallparking_logo.png" alt="小猫停车">
            </el-col>
            <el-col :span="12">
                <el-select class="width-120" v-model="mainServiceUrl" placeholder="服务端切换" @change="serviceUrlChange">
                    <el-option label="开发服务器" value="192.168.1.226:9021"></el-option>
                    <el-option label="测试服务器" value="192.168.1.226:9022"></el-option>
                    <el-option label="谢文祥" value="192.168.1.46:9021"></el-option>
                    <el-option label="谢家旺" value="192.168.1.66:9021"></el-option>
                    <el-option label="温家祥" value="192.168.1.48:9021"></el-option>
                    <el-option label="外网服务器" value="120.77.237.179:1007"></el-option>
                </el-select>
            </el-col>
        </el-col>
        <el-col :span="24" class="main">
            <div class="content">
                <div class="login">
                    <div class="login-img">
                        <img  src="../assets/img/login_logo.png" alt="" />
                    </div>

                    <form id="loginForm" onsubmit="return false">
                        <select class="magin " v-model="position" @change="AccordLoginUser">
                            <option v-for="item in positionList" :key="item" :value="item">{{item}}</option>
                        </select>
                        <!-- 用户名 -->
                        <select class="magin " v-model="username" @change="deptPosition">
                            <option v-for="item in accountNumber" :key="item"  :value="item">{{item}}</option>
                        </select>
                        <span class="error" v-text="usenamerNotcie"></span>
                        <!-- 密码 -->
                        <input class="magin magintop-0 " name="password"  type="password" placeholder="请输入密码"
                               v-model.trim="password" @focus="passwordFocus" @keyup.prevent.enter="loginSubmit"
                        />
                        <span class="error"  v-text="passwordNotcie"></span>

                        <input class="magin magintop-0 butClick" type="button"  value="登录" @click.prevent="loginSubmit"/>

                    </form>

                </div>
            </div>
        </el-col>
        <el-col :span="24" class="footer">
            <div class="footer-content">
                CopyRight © 2018  <a href="http://www.mallparking.cn/web/index.html"
                                     target="_blank" rel="noopener noreferrer"> 深圳市小猫信息技术有限公司</a>  版权所有
            </div>
        </el-col>
    </section>
</template>

<script>
    import Cookies from 'js-cookie'
    import { ip,Dept,AccordLoginUser,Login,getMenuList,getMenuListByRoleId } from '@/api/api'

    let Base64 = require('js-base64').Base64;

    export default {
        data() {
            return {
                userInfos:'',

                loading: false,
                mainServiceUrl:'',

                position:'管理员',
                username:'',
                password:'123456',

                usenamerNotcie:'',  //输入框错误提示
                passwordNotcie:'',
                positionList: [],
                accountNumber:''

            };
        },
        mounted(){
            this.mainServiceUrl = Cookies.get('serviceUrl') || ip
            
            localStorage.getItem('loginUserInfo')
            this.userInfos = JSON.parse(localStorage.getItem('loginUserInfo'))
            this.deptPosition();
            this.loggedInUser();

        },
        methods: {
            //后台服务切换,测试阶段使用功能
            serviceUrlChange(){
                Cookies.set('serviceUrl', this.mainServiceUrl)
                window.location.reload()
            },

            // 获取用户登录信息
            loggedInUser(){
                if(this.userInfos){
                    this.position = this.userInfos.position
                    this.username = this.userInfos.account
                }
            },

            //查找部门位及人员
            deptPosition() {
                let para = {
                    account:this.username
                }
                Dept(para).then(res =>{
                    this.positionList = res.data.addresses
                    console.log(this.positionList)
                    this.AccordLoginUser()
                }).catch(err=>{

                })
            },

            //查找符合登录的人员
            AccordLoginUser(){
                let _this=this;
                let para={
                    address:this.position
                }
                AccordLoginUser(para).then(res=>{

                    if(res.code==='SUCCESS'){
                        console.log(res.data)
                        this.accountNumber = res.data
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
            },

            //登录按钮
            loginSubmit(){

                if(!this.username){
                    this.usenamerNotcie = '用户名不能为空'
                    return
                }else{
                    this.usenamerNotcie = ''
                }
                if(!this.password){
                    this.passwordNotcie = '密码不能为空'
                    return
                }else{
                    this.passwordNotcie = ''
                }
                let params={
                    "account":this.username,
                    "password":Base64.encode(this.password),
                    "position":this.position,
                }
                localStorage.setItem('loginUserInfo',JSON.stringify(params))
                // console.log(params)
                this.loading = true
                Login(params).then(res=>{
                    // console.log(res)
                    this.loading = false

                    if(res.code === 'SUCCESS'){
                        this.Util.userInfo = res.data

                        //用户信息存session
                        sessionStorage.setItem('userInfo',JSON.stringify(res.data))
                        //根据角色id获取对应的权限
                        this.getMenuListByRoleId(res.data.roleId)

                    }else if(res.code === 'OTHER_LOGIN'){
                        this.passwordNotcie = `账号“${res.data.account}”已登录此位置`
                    }
                    else {
                        this.passwordNotcie = res.msg
                    }
                }).catch(err=>{
                    this.loading = false
                })

            },
            usernameFocus(){
                this.usenamerNotcie = ''
            },
            passwordFocus(){
                this.passwordNotcie = ''
            },

            // 获取角色对应权限数据
            getMenuListByRoleId(RoleId){
                getMenuListByRoleId({},RoleId).then(res=>{

                    if(res.data.code === 'SUCCESS'){
                        let tempList = res.data.data
                        // console.log(tempList);
                        let userPermissionMarkList = []

                        //遍历出所有权限标识
                        filtersMark(tempList)
                        function filtersMark(arr){
                            for(let v of arr){
                                userPermissionMarkList.push(v.mark)
                                if(v.children && v.children.length){
                                    filtersMark(v.children)
                                }
                            }
                        }

                        //根据后台数据生成路由
                        let routes = [{
                            path: '',
                            component: () => import('@/views/Main'),
                            name: '',
                            children:[]
                        }]
                        routes[0].children =  this.Util.createRouter(tempList)

                        routes.push(
                            {
                                path: '*',
                                hidden: true,
                                redirect: {
                                    path: '/404'
                                }
                            },
                        )

                        // 增加到路由表里
                        this.$router.addRoutes(routes)

                        //权限原始数据存session
                        sessionStorage.setItem('userPermission',JSON.stringify(tempList))
                        sessionStorage.setItem('userPermissionMarkList',JSON.stringify(userPermissionMarkList))

                        let isHsaPermissionLogin = false        //用于判断是否有权限登录

                        for (let i = 0; i < tempList.length; i++) {

                            if (tempList[i].mark === 'markInCarInfo') {         //允许登录收费中心
                                isHsaPermissionLogin = true
                                this.$router.push('/InCarInfo')
                                break
                            }else if(tempList[i].mark === 'markMonitorCenter' ){        //允许登录监控中心
                                isHsaPermissionLogin = true
                                this.$router.push('/MonitorCenter')
                                break
                            }else if(tempList[i].mark === 'markWatchhouse'){      //允许登录岗亭监控
                                isHsaPermissionLogin = true
                                this.$router.push('/Watchhouse')
                                break
                            }else if(tempList[i].mark === 'markFinancialBtn'){        //允许登录财务端
                                isHsaPermissionLogin = true
                                this.$router.push('/VIPInfo')
                                break
                            }else{
                                isHsaPermissionLogin = false
                            }

                        }

                        if (!isHsaPermissionLogin) {
                            this.$message.error('您的账号权限不足,无法登录系统')
                        }

                        this.loading = false
                    }else{
                        this.message.error(res.data.msg)
                    }

                }).catch(err=>{
                    this.loading = false
                })
            },

        },
    }
</script>

<style scoped lang="scss">
    section{
        background: #28282a;
        width: 100%;
        height: 100%;
        overflow: auto;
        .header{
            height:80px;
            background-color:#37363a;
            .logo {
                padding-left:1%;
                line-height: 80px;
                .logo-img{
                    margin: 8px 0;
                    float: left;
                    height:68px;
                }
            }
        }
        .main{
            .content{
                margin-top: 56px;
                .login{
                    margin:0px auto;
                    width: 436px;
                    height:582px;
                    border-radius: 10px;
                    background:#37363a;
                    .login-img{
                        text-align: center;
                        img{
                            margin-top: 48px;
                            display: inline-block;
                        }
                    }
                    .magin{
                        margin-left: 48px;
                        box-sizing: border-box;
                        margin-top: 36px;
                        width:340px;
                        height:56px;
                        line-height: 56px;
                        font-size:20px ;
                        padding-left: 21px;
                        color:#ea7f41;
                        border-radius: 5px;
                        border: none;
                        background:#28282a;
                        position: relative;
                    }
                    .userList{
                        position: absolute;
                        margin-left: 8px;
                        margin-top: 1px;
                        height:30px;
                        line-height: 30px;
                        font-size:25px ;
                        color: #ea7f41;
                        width: 340px;
                        z-index: 100;
                    }
                    .userList li{
                        background-color: #28282a;
                        cursor:pointer;
                        overflow-y: hidden;
                    }
                    .userList li:hover{
                        background-color: #ea7f41;
                    }
                    .magin::-webkit-input-placeholder { /* WebKit, Blink, Edge */
                        color:#666666;
                    }
                    .magin::-moz-placeholder { /* Mozilla Firefox 4 to 18 */
                        color:#666666;
                    }
                    .magin::-moz-placeholder { /* Mozilla Firefox 19+ */
                        color:#666666;
                    }
                    .magin::-ms-input-placeholder { /* Internet Explorer 10-11 */
                        color:#666666;
                    }
                    .magintop-0{
                        margin-top: 0px;
                    }
                    .error{
                        display: block;
                        width: 340px;
                        height: 20px;
                        color: #f93d3d;
                        margin: 6px auto 10px;
                        font-size: 16px;
                    }
                    .butClick{
                        cursor: pointer;
                        color:#fff;
                        background:#ea7f41;
                    }
                }
            }
        }
        .footer{
            .footer-content{
                color: #666;
                width: 100%;
                height: 100px;
                line-height: 100px;
                text-align: center;
                a{
                    color: #666;
                }
                a:hover{
                    color: #20a0ff;
                    text-decoration: underline;
                }
            }
        }
    }

</style>