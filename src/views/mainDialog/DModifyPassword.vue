<template> 
    <!-- 修改密码 -->
    <el-dialog class="add" title="修改密码" width="40%" :visible.sync="modifyPasswordProp.visible" @close="closeModifyPasswordDialog('formModifyPassword')" @closed="closeDialog" :close-on-click-modal="false">
        <div class="add-box">
            <el-form label-position="left" label-width="80px" :model="formModifyPassword" :rules="rulesModifyPassword" ref="formModifyPassword" >
                <el-form-item  label="旧密码:" prop="old_password">
                    <el-input type="password" class="width-200" v-model="formModifyPassword.old_password" v-popover:popover1 clearable  placeholder="请输入旧密码">
                    </el-input>
                </el-form-item>
                <el-popover ref="popover1" placement="right" width="200" trigger="focus"  content="您当前登录的账户密码" >
                </el-popover>
                <el-form-item  label="新密码:" prop="new_password">
                    <el-input type="password" class="width-200" v-model="formModifyPassword.new_password" v-popover:popover2 clearable  placeholder="请输入新密码">
                    </el-input>
                </el-form-item>
                <el-popover ref="popover2" placement="right" width="200" trigger="focus"  content="6-20位数字、字母组成的字符" >
                </el-popover>                
                <el-form-item  label="确认密码:" prop="confirm_password">
                    <el-input type="password" class="width-200" v-model="formModifyPassword.confirm_password" clearable  placeholder="请再次输入新密码">
                    </el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button class="footer-btn" @click="modifyPasswordProp.visible = false">取消</el-button>
                <el-button class="footer-btn" type="primary" @click.native="modfiyPasswordSubmit('formModifyPassword')" >确认</el-button>
            </div>
        </div>
    </el-dialog>
</template> 

<script>
import {updatePass} from '@/api/api'
let Base64 = require('js-base64').Base64;

export default {
    name: 'DModifyPassword',
    props: [ 'modifyPasswordProp' ],
    data(){
			//校验旧密码
			let checkoldPassword = (rule, value, callback) => {
				if (!value) {
					return callback(new Error('密码不能为空'));
                }
                // else if(this.returnUserInfo === null){

				// 	let params = {
				// 					'userName': this.sysUserName,
				// 					'password': this.formModifyPassword.old_password,

				// 				};
				// 	parking_validatepasswd(params)
				// 		.then( (data) => {
				// 			if(data.flag === 1){
				// 				this.returnUserInfo = data.data
				// 				return callback();
				// 			}else if(data.data === 0){
				// 				return callback(new Error('密码错误'));
				// 			}
				// 		})

                // }
                else{
					callback();
				}

            };
			//校验新密码
			let checknewPassword = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
                }else if(value.length < 6){
					callback(new Error('密码长度不能小于6'));
                } 
                else {
					callback();
				}
            };
			//校验新密码重复密码
			let checkconfirmPassword = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.formModifyPassword.new_password) {
					callback(new Error('两次输入密码不一致!'));
				} else {
				callback();
				}
			};

        return {
            sysUserName: 'admin',	//登录用户名
            returnUserInfo:null,	//密码校验成功之后的返回值

            formModifyPassword: {
                old_password: '',
                new_password: '',
                confirm_password: '',
            },
            rulesModifyPassword:{
                old_password:[{ validator: checkoldPassword, trigger: 'blur' }],
                new_password:[{ validator: checknewPassword, trigger: 'blur' }],
                confirm_password:[{ validator: checkconfirmPassword, trigger: 'blur' }],
            },            
        }
    },
    methods:{
        //确认修改密码
        modfiyPasswordSubmit(formName){
				this.$refs[formName].validate((valid) => {
					if (valid) {
                        let para={
                            password:Base64.encode(this.formModifyPassword.old_password),
                            passwordNew:Base64.encode(this.formModifyPassword.new_password),
                            operatorId:this.Util.userInfo.id
                        }
                        // console.log(para)
                        updatePass(para).then(res=>{
                            console.log(res)
                            if(res.code=='SUCCESS'){
                                this.modifyPasswordProp.visible = false
                                this.$message({
                                    type:'success',
                                    message:res.msg
                                })
                                this.rePassVisible=false;
                                this.getListUser(false);

                            }else{
                                this.$message({
                                    type:'warning',
                                    message:res.msg
                                })
                            }
                        }).catch(err=>{
                            console.log(err)
                        })
					} else {
						return false;
					}
				});

        },
        //监听弹窗关闭
        closeModifyPasswordDialog(formName){
            this.$refs[formName].resetFields();
        },
        closeDialog(){
            this.$emit('listenCloseMainDialog') 									
        },         
    },
   
}
</script>

<style scoped lang="scss">
    .add{
        .add-box{
            .dialog-footer{
                margin-top: 20px;
                text-align: center;
                .footer-btn{
                    font-weight: bold;
                    width:120px;
                }
            }
        }
    }    
</style>

