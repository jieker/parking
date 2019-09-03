<template>
   	<!-- 弹窗-会员信息 -->
	<el-dialog class="form-dialog" title="会员信息"  width="90%" :visible.sync="membersInfoProp.visible" @open="listenOpenDialog" @closed="listenCloseDialog">
        <div class="content-body">
            <div class="body-top">
                    <el-select class="width-180" v-model="searchType" placeholder="请选择">
                        <el-option label="按车牌号" value="carNum"></el-option>
                        <el-option label="按姓名" value="owner"></el-option>
                    </el-select>
                    <el-input class="width-180" v-model.trim="searchValue"  @keyup.enter.native ="getVipList(true)"  placeholder="请输入查询关键字" clearable></el-input>
                    <el-button type="primary" @click="getVipList(true)" size="small">查询</el-button>
            </div>
            <div class="body-table">
                    <!--列表-->
                    <el-table :data="array" highlight-current-row v-loading="listLoading"  height="540" :cell-style="tableRow">
                        <el-table-column prop="carNum" label="车牌号" min-width="105" sortable>
                        </el-table-column>
                        <el-table-column prop="startTime" label="生效时间" min-width="160"  sortable>
                        </el-table-column>
                        <el-table-column prop="stopTime" label="失效时间" min-width="160"  sortable>
                        </el-table-column> 
                        <el-table-column prop="memberStatus" label="状态" min-width="115" :formatter="formatMemberStatus" sortable>
                        </el-table-column>                    									
                        <el-table-column prop="memberType" label="会员类型" min-width="107" sortable >
                        </el-table-column>
                        <el-table-column prop="owner" label="姓名" min-width="115" sortable>
                        </el-table-column> 	
                        <el-table-column prop="company" label="公司" min-width="115" sortable>
                        </el-table-column>                     					
                    </el-table> 
            </div>
            <div class="body-paging elPag text-center " >
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="dataTotal">
                    </el-pagination>
                    <el-button type="primary" class="PagGo">GO</el-button>
            </div>
        </div>		
	</el-dialog> 
</template>

<script>
import {vipList} from '@/api/api'
export default {
    props: [ 'membersInfoProp' ],
    data(){
        return {
            listLoading: false,
            pageSize:10,
            dataTotal:0,
            currentPage:1,
            array:[],
            searchType:'carNum',
            searchValue:'',

        }
    },
    methods:{
        //监听弹窗关闭
        listenCloseDialog(){
            this.$emit('listenCloseMainDialog') 									
        },        
        //监听弹窗打开
        listenOpenDialog(){
           this.searchValue = this.membersInfoProp.carNum
            this.getVipList(true);
        },
        //根据月卡状态增加相应颜色区分
        tableRow(obj){
            if(obj.row.memberStatus === 0){
                return {color:'#E6A23C'}
            }if(obj.row.memberStatus === 1){
                // return {color:'blue'}
            }else{
                return {color:'#a5a7aa'}
            }
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getVipList(false)
        },
        handleCurrentChange(val) {
            this.getVipList(false)
        },
        formatMemberStatus(row, column) {
            // -0,未生效；1,已生效；2,已失效；3,挂起；4,解挂
            return row.memberStatus == 0? '未生效' : row.memberStatus == 1 ? '已生效' :row.memberStatus == 2 ? '已失效' :row.memberStatus == 3 ? '挂起':row.memberStatus == 4 ? '解挂':'未知';
        },
        //获取月卡信息
        getVipList(isGlobal){
            let params={
                operatorId:this.Util.userInfo.id,
                carNum:'',
                owner:'',
                current:this.currentPage-1,
                length:this.pageSize,
            }
            if(isGlobal){
                params.current = 0
            }
            if(this.searchType === 'carNum'){
                params.carNum = this.searchValue
            }
            if(this.searchType === 'owner'){
                params.owner = this.searchValue
            }

            this.listLoading = true

            vipList(params).then( res => {
                this.listLoading = false

                // console.log(res.data.data.content)
                if(res.data.code=='SUCCESS'){
                    this.array=res.data.data.content;
                    this.dataTotal=res.data.data.totalElements;
                }else{
                    this.$message.error(res.data.msg)
                }
              }).catch(err=>{
                    this.listLoading = false
                })              
        },    
    }
}
</script>

<style lang="scss" scoped>
      
    .content-body{
            background: $color-gray;
            padding:0px 10px;
            .body-top{
                padding: 10px 0px;
            }
            .body-table{
                background: #fff;
            }
            .body-paging{
                padding: 20px 0px;
            }
    }

</style>
