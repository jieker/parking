<template>
<div>
    <!-- 弹窗-进出场记录 -->
    <el-dialog class="form-dialog" title="进出场记录"  width="90%" @opened="openDialog" :visible.sync="inOutRecordProp.visible"  @closed="closeDialog">
        <div class="dialog-box">
            <el-tabs @tab-click="tabClick" type="border-card" v-model="activeName">
                <el-tab-pane label="在场车辆" name="在场车辆" v-if="markInRecord">
                    <in-record ref="InRecord" :in-record-prop="inRecordProp"></in-record> 
                </el-tab-pane>
                <el-tab-pane label="出场记录" name="出场记录" v-if="markOutRecord">
                       <out-record ref="OutRecord" ></out-record>                        
                </el-tab-pane>
            </el-tabs>          
        </div>	
    </el-dialog> 

</div>

</template>

<script>
import InRecord from './InRecord.vue'

export default {
    components: {
        InRecord: () => import('./InRecord.vue'),
        OutRecord: () => import('./OutRecord.vue'),
    },    
    props: [ 'inOutRecordProp' ],
    data(){
        return {
            
            inRecordProp: {
                carNum: ''
            },
            activeName:'在场车辆',
            markInRecord:false,
            markOutRecord:false,
        }
    },
    mounted() {
        this.markInRecord = this.Util.isPermission('markInRecord')
        this.markOutRecord = this.Util.isPermission('markOutRecord')
    },    
    methods:{
        tabClick(value){
            // console.log(value);
            if(value.label === '在场车辆'){
                this.$refs.InRecord.getOnsiteList(true)
            }else if(value.label === '出场记录'){
                this.$refs.OutRecord.getOnsiteOutList(true)
            }
        },        
        openDialog(){
            this.activeName = '在场车辆'
            this.$refs.InRecord.initialSearchValue()
            this.$refs.OutRecord.initialSearchValue()

            this.inRecordProp.carNum = this.inOutRecordProp.carNum
            this.$refs.InRecord.getOnsiteList(true,this.inOutRecordProp.carNum)                
        },
        closeDialog(){
            this.$emit('listenCloseMainDialog') 									
        },
      
    }
}
</script>

<style >
.el-tabs--border-card > .el-tabs__content{
    padding:0;
}
 
</style>
