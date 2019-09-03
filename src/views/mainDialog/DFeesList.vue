<template>
    <div>
        <!-- 弹窗-收费标准查看 -->
        <el-dialog  title="收费标准查看"  width="96%" :visible.sync="feesListProp.visible" @open="getFeeslist" @closed="closeDialog" :close-on-click-modal="false">
            <el-row class="content">
                <el-col :span="24" class="content-body">
                  <div class="p-name">
                      <span>停车场名称：{{parkName}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <span>停车场ID：{{parkId}}</span>
                      <el-button type="primary" size="mini" style="margin-left: 120px" @click="syncCloud" v-if="markSettingFeesSync">同步云端收费标准</el-button>
                  </div>
                  <div v-for="item in tableDatas">
                      <div class="p-explain">
                          <span>车辆类型：{{item.carType}}</span>
                          <span>免费时长：{{item.timeOut}}分钟</span>
                          <span>缴费超时时间：{{item.timeOut}}分钟</span>
                          <span>额外免费时长：{{item.freeTime}}分钟</span>
                          <span>24小时收费上限：{{item.maxMoneyDay}}元</span>
                      </div>
                      <div class="p-table">
                          <table border="1">
                              <tr>
                                  <td width="200px">停车时长（h）</td>
                                  <td width="100px">0.5小时</td>
                                  <td width="100px">1小时</td>
                                  <td width="100px">1.5小时</td>
                                  <td width="100px">2小时</td>
                                  <td width="100px">2.5小时</td>
                                  <td width="100px">3小时</td>
                                  <td width="100px">3.5小时</td>
                                  <td width="100px">4小时</td>
                                  <td width="100px">4.5小时</td>
                                  <td width="100px">5小时</td>
                                  <td width="100px">5.5小时</td>
                                  <td width="100px">6小时</td>
                                  <td width="100px">6.5小时</td>
                                  <td width="100px">7小时</td>
                                  <td width="100px">7.5小时</td>
                                  <td width="100px">8小时</td>
                              </tr>
                              <tr>
                                  <td>费用（元）</td>
                                  <td>{{item.price1}}</td>
                                  <td>{{item.price2}}</td>
                                  <td>{{item.price3}}</td>
                                  <td>{{item.price4}}</td>
                                  <td>{{item.price5}}</td>
                                  <td>{{item.price6}}</td>
                                  <td>{{item.price7}}</td>
                                  <td>{{item.price8}}</td>
                                  <td>{{item.price9}}</td>
                                  <td>{{item.price10}}</td>
                                  <td>{{item.price11}}</td>
                                  <td>{{item.price12}}</td>
                                  <td>{{item.price13}}</td>
                                  <td>{{item.price14}}</td>
                                  <td>{{item.price15}}</td>
                                  <td>{{item.price16}}</td>
                              </tr>
                          </table>
                      </div>
                      <div class="p-table">
                          <table border="1">
                              <tr>
                                  <td width="201px">停车时长（h）</td>
                                  <td width="100px">8.5小时</td>
                                  <td width="100px">9小时</td>
                                  <td width="100px">9.5小时</td>
                                  <td width="100px">10小时</td>
                                  <td width="100px">10.5小时</td>
                                  <td width="100px">11小时</td>
                                  <td width="100px">11.5小时</td>
                                  <td width="100px">12小时</td>
                                  <td width="100px">12.5小时</td>
                                  <td width="100px">13小时</td>
                                  <td width="100px">13.5小时</td>
                                  <td width="100px">14小时</td>
                                  <td width="100px">14.5小时</td>
                                  <td width="100px">15小时</td>
                                  <td width="100px">15.5小时</td>
                                  <td width="100px">16小时</td>
                              </tr>
                              <tr>
                                  <td>费用（元）</td>
                                  <td>{{item.price17}}</td>
                                  <td>{{item.price18}}</td>
                                  <td>{{item.price19}}</td>
                                  <td>{{item.price20}}</td>
                                  <td>{{item.price21}}</td>
                                  <td>{{item.price22}}</td>
                                  <td>{{item.price23}}</td>
                                  <td>{{item.price24}}</td>
                                  <td>{{item.price25}}</td>
                                  <td>{{item.price26}}</td>
                                  <td>{{item.price27}}</td>
                                  <td>{{item.price28}}</td>
                                  <td>{{item.price29}}</td>
                                  <td>{{item.price30}}</td>
                                  <td>{{item.price31}}</td>
                                  <td>{{item.price32}}</td>
                              </tr>
                          </table>
                      </div>
                      <div class="p-table">
                          <table border="1">
                              <tr>
                                  <td width="200px">停车时长（h）</td>
                                  <td width="100px">16.5小时</td>
                                  <td width="100px">17小时</td>
                                  <td width="100px">17.5小时</td>
                                  <td width="100px">18小时</td>
                                  <td width="100px">18.5小时</td>
                                  <td width="100px">19小时</td>
                                  <td width="100px">19.5小时</td>
                                  <td width="100px">20小时</td>
                                  <td width="100px">20.5小时</td>
                                  <td width="100px">21小时</td>
                                  <td width="100px">21.5小时</td>
                                  <td width="100px">22小时</td>
                                  <td width="100px">22.5小时</td>
                                  <td width="100px">23小时</td>
                                  <td width="100px">23.5小时</td>
                                  <td width="100px">24小时</td>
                              </tr>
                              <tr>
                                  <td>费用（元）</td>
                                  <td>{{item.price33}}</td>
                                  <td>{{item.price34}}</td>
                                  <td>{{item.price35}}</td>
                                  <td>{{item.price36}}</td>
                                  <td>{{item.price37}}</td>
                                  <td>{{item.price38}}</td>
                                  <td>{{item.price39}}</td>
                                  <td>{{item.price40}}</td>
                                  <td>{{item.price41}}</td>
                                  <td>{{item.price42}}</td>
                                  <td>{{item.price43}}</td>
                                  <td>{{item.price44}}</td>
                                  <td>{{item.price45}}</td>
                                  <td>{{item.price46}}</td>
                                  <td>{{item.price47}}</td>
                                  <td>{{item.price48}}</td>
                              </tr>
                          </table>
                      </div>
                  </div>
                </el-col>
            </el-row>
        </el-dialog>
    </div>

</template>

<script>
    import { mapGetters } from "vuex";
    import {base,getFeeslist,syncCloud} from '@/api/api' ;

    export default {
        props: [ 'feesListProp' ],
        data(){
            return {
                listLoading: false,
                tableDatas:[],
                parkName:'',
                parkId:'',
                markSettingFeesSync:false,
            }
        },
        mounted(){
            this.markSettingFeesSync = this.Util.isPermission('markSettingFeesSync')
        },        
        methods:{
            closeDialog(){
                this.$emit('listenCloseMainDialog') 									
            },            
            // 获取收费标准列表
            getFeeslist() {
                let param={
                    operatorId:this.Util.userInfo.id
                }
                getFeeslist(param).then(data => {
                    // console.log(data.data.data)
                    this.tableDatas = data.data.data;
                    this.parkName = this.tableDatas[0].parkName;
                    this.parkId = this.tableDatas[0].parkId;
                });
            },
            // 同步云端收费标准
            syncCloud() {
                let param={
                    operatorId:this.Util.userInfo.id,
                    operatorName:this.Util.userInfo.realName,
                }
                syncCloud(param).then(data => {
                    // console.log(data.data.msg)
                    if(data.data.code==='SUCCESS') {
                        this.getFeeslist()
                        this.$message({
                            type:'success',
                            message:data.data.msg
                        })
                    }else {
                        this.$message.error(data.data.msg)
                    }

                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .p-name {
        font-size: 25px;
        font-weight: bolder;
    }
    .p-explain {
        margin-top: 15px;
        font-weight: bolder;
    }
    .p-explain span{
        margin-right: 30px;
        font-size: 20px;
    }
    .p-table {
        margin-top: 20px;
    }
    table {
        text-align: center;
        width: 100%;
    }
    .el-dialog__body {
        color: #ffffff;
    }

</style>



