<template>
    <div>
        <!-- 弹窗-进场规则 -->
        <el-dialog  title="进场规则 提示：岗亭对应勾选的身份可在该岗亭进场，默认时间段为24小时，时间段可设置" @open="getListRules" width="96%" :visible.sync="approachRulesProp.visible"  :close-on-click-modal="false" @closed="closeDialog">
            <el-row class="content">
                <el-col :span="24" class="content-body">
                    <el-tabs type="border-card">
                        <el-tab-pane v-for="(items,index) in tableDatas" :key="index">
                            <span slot="label"><i class="el-icon-date"></i> {{items.gateName}}</span>
                            <div class="carType">
                                <div class="oneCarType" v-for="(item,index) in items.rules" :key="index">
                                    <!--<input type="checkbox" />-->
                                    <!--<span class="carName">{{item.memberType}}</span>-->

                                    <div class="checkbox-height">
                                        <div class="rule-title">
                                            <el-checkbox  v-model="item.openFlag">{{item.memberType}}:</el-checkbox>
                                        </div>
                                        <div class="rule-range">
                                            <!--<el-time-picker is-range  format="HH:mm"-->
                                            <!--v-model="item.rangeDateValue" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">-->
                                            <!--</el-time-picker>-->
                                            <el-time-picker
                                                    format="HH:mm"
                                                    v-model="item.value2"
                                                    :picker-options="{
                                                              selectableRange: '00:00:00 - 23:59:00'
                                                            }"
                                                    placeholder="任意时间点">
                                            </el-time-picker>
                                            <span>至</span>
                                            <el-time-picker
                                                    format="HH:mm"
                                                    v-model="item.value3"
                                                    :picker-options="{
                                                          selectableRange: '00:00:00 - 23:59:59'
                                                        }"
                                                    placeholder="任意时间点">
                                            </el-time-picker>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                    <!--<div class="area" v-for="items in tableDatas">-->
                        <!--<div class="box">{{items.gateName}}</div>-->
                        <!--<div class="carType">-->
                            <!--<div class="oneCarType" v-for="(item,index) in items.rules" :key="index">-->
                                <!--&lt;!&ndash;<input type="checkbox" />&ndash;&gt;-->
                                <!--&lt;!&ndash;<span class="carName">{{item.memberType}}</span>&ndash;&gt;-->

                                      <!--<div class="checkbox-height">-->
                                            <!--<div class="rule-title">-->
                                                <!--<el-checkbox  v-model="item.openFlag">{{item.memberType}}:</el-checkbox>-->
                                            <!--</div>-->
                                            <!--<div class="rule-range">-->
                                                <!--&lt;!&ndash;<el-time-picker is-range  format="HH:mm"&ndash;&gt;-->
                                                                <!--&lt;!&ndash;v-model="item.rangeDateValue" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">&ndash;&gt;-->
                                                <!--&lt;!&ndash;</el-time-picker>&ndash;&gt;-->
                                                <!--<el-time-picker-->
                                                        <!--format="HH:mm"-->
                                                        <!--v-model="item.value2"-->
                                                        <!--:picker-options="{-->
                                                              <!--selectableRange: '00:00:00 - 23:59:00'-->
                                                            <!--}"-->
                                                        <!--placeholder="任意时间点">-->
                                                <!--</el-time-picker>-->
                                                <!--<span>至</span>-->
                                                <!--<el-time-picker-->
                                                        <!--format="HH:mm"-->
                                                        <!--v-model="item.value3"-->
                                                        <!--:picker-options="{-->
                                                          <!--selectableRange: '00:00:00 - 23:59:59'-->
                                                        <!--}"-->
                                                        <!--placeholder="任意时间点">-->
                                                <!--</el-time-picker>-->
                                            <!--</div>-->
                                      <!--</div>-->
                            <!--</div>-->
                        <!--</div>-->
                    <!--</div>-->
                </el-col>
            </el-row>
            <div class="s-button">
                <el-button @click="approachRulesProp.visible = false" v-if="markSettingRuleUpdate">取 消</el-button>
                <el-button type="primary" @click="alterListRules()" v-if="markSettingRuleUpdate">确 定</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    import { mapGetters } from "vuex";
    import {base,getGateListAll,getListRules,alterListRules} from '@/api/api' ;

    export default {
        props: [ 'approachRulesProp' ],
        data(){
            return {
                // value2: new Date(2016, 9, 10, 0, 0,0),
                // value3:  new Date(2016, 9, 10, 23, 59,59),
                tableDatas:'',
                listLoading: false,
                rules: [],
                // rangeDateValue:''

                markSettingRuleUpdate:false,
            }
        },
        computed: {
            // ...mapGetters({
            //     carTypeList: 'getCarTypeList',
            // }),
        },
        mounted(){
            this.markSettingRuleUpdate = this.Util.isPermission('markSettingRuleUpdate')
        },
        methods:{
            openDialog(){
                this.getListRules()
            },
            closeDialog(){
                this.$emit('listenCloseMainDialog') 									
            },            
            getListRules() {
                let param={
                    operatorId:this.Util.userInfo.id
                }
                getListRules(param).then(data => {
                    console.log(data.data.data)
                    this.tableDatas = data.data.data;
                    let tempList = this.Util.deepCopy(this.tableDatas)

                    for(let j = 0,len = tempList.length; j<len; j++) {
                        this.tableDatas[j].rules = []
                        for(let i = 0,len = tempList[j].rules.length; i<len; i++) {
                            let tempObj = this.Util.deepCopy(tempList[j].rules[i]);
                            // console.log(tempObj)
                            if (tempList[j].rules[i].openFlag === true) {
                                //已选中的规则
                                let beginTime = tempList[j].rules[i].beginTime.split(':')
                                let endTime = tempList[j].rules[i].endTime.split(':')
                                tempObj.value2 = new Date(2016, 9, 10, beginTime[0], beginTime[1]);
                                tempObj.value3 = new Date(2016, 9, 10, endTime[0], endTime[1]);
                                // tempObj.rangeDateValue = [new Date(2016, 9, 10, beginTime[0], beginTime[1]), new Date(2016, 9, 10, endTime[0], endTime[1])];
                            } else {
                                tempObj.value2 = new Date(2016, 9, 10, 0, 0);
                                tempObj.value3 = new Date(2016, 9, 10, 23, 59);
                                // tempObj.rangeDateValue = [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 23, 59)]
                            }
                            this.tableDatas[j].rules.push(tempObj)
                        }
                    }
                });
            },

            //修改收费规则
            alterListRules(){
                let param={
                    operatorId:this.Util.userInfo.id
                };
                for(let j = 0,len = this.tableDatas.length; j<len; j++){
                    for(let i = 0,len = this.tableDatas[j].rules.length; i<len; i++) {
                        this.tableDatas[j].rules[i].beginTime = this.Util.formatDate.format(this.tableDatas[j].rules[i].value2, 'hh:mm')
                        this.tableDatas[j].rules[i].endTime = this.Util.formatDate.format(this.tableDatas[j].rules[i].value3, 'hh:mm')
                    }
                    this.rules.push(...this.tableDatas[j].rules)
                    // console.log(this.rules)
                }
                param.rules = this.rules
                 // console.log(param)
                alterListRules(param)
                    .then((data) => {
                        // console.log(data)
                        if(data.code === 'SUCCESS'){
                            this.approachRulesProp.visible = false
                            this.$message({
                                message: '设置成功',
                                type: 'success'
                            });
                        }else{
                            this.$message.error(data.msg);
                        }
                    })
            },


        }
    }
</script>

<style lang="scss" scoped>
    .content {
        height: 600px;
        overflow: auto;
    }
    .area {
        display: flex;
    }
    .box {
        width: 17%;
    }
    .timeSlot input{
        width: 24px;
        border-radius: 5px;
    }
    .carType {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
    }
    .oneCarType {
        margin-left: 15px;
        margin-bottom: 60px;
    }
    .carName {
        margin-right: 30px;
    }
    .s-button {
        text-align: center;
        /*margin-top: 65px;*/
    }
    .checkbox-height {
        display: flex;
        width: 402px;
        height: 27px;
        line-height: 27px;
    }
    .rule-title {
        width: 44%;
        position: relative;
        .el-checkbox{
            word-wrap: break-word;
            position: absolute;
            right: 20px;
        }
    }
    .rule-range {
        width: 56%;
        .el-date-editor.el-input, .el-date-editor.el-input__inner {
            width: 97px;
        }
    }
    .el-range-editor.el-input__inner  {
        width: 200px;
    }

    /*.form-dialog{*/
    /*.content{*/
        /*background: $color-gray;*/
        /*border-radius:10px;*/
    /*.content-body{*/
        /*padding:0px 10px;*/
    /*.body-top{*/
        /*padding: 10px 0px;*/
    /*.body-top-left{*/
        /*float: left;*/
        /*width: 49%;*/
    /*}*/
    /*.body-top-right{*/
        /*float: right;*/
        /*width: 49%;*/
    /*}*/
    /*}*/
    /*.body-paging{*/
        /*padding: 20px 0px;*/
    /*}*/
    /*}*/


    /*}*/

    /*}*/
    .el-dialog__body {
        color: #ffffff;
    }

</style>



