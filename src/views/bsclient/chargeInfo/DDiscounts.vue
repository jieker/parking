<template>
    <!-- 弹窗-优惠信息汇总 -->
    <el-dialog class="form-dialog" title="优惠信息汇总"  width="50%" @open="openDialog" :visible.sync="discountsPropData.visible" >
        <div class="dialog-box">
            <el-tabs @tab-click="tabClick">
                <el-tab-pane label="电子券优惠">
                    <el-table :data="eleDiscountsArry" highlight-current-row show-summary height="300">
                        <el-table-column prop="couponType" label="优惠券类型" min-width="105" >
                        </el-table-column>
                        <el-table-column prop="couponVal" label="优惠金额" min-width="115" >
                        </el-table-column>
                    </el-table>            
                </el-tab-pane>
                <!-- <el-tab-pane label="纸质券优惠">
                    <el-table :data="paperDiscountsArry" highlight-current-row show-summary height="300">
                        <el-table-column prop="couponName" label="券名称" min-width="105" >
                        </el-table-column>
                        <el-table-column prop="totalUse" label="使用数量" min-width="115" >
                        </el-table-column>                          
                        <el-table-column prop="totalValue" label="总金额" min-width="115" >
                        </el-table-column>                   									
                    </el-table>            
                </el-tab-pane>
                <el-tab-pane label="其它优惠">
                    <el-table :data="otherDiscountsArry" highlight-current-row show-summary height="300">
                        <el-table-column prop="discount_name" label="券名称" min-width="105" >
                        </el-table-column>
                        <el-table-column prop="discount_money" label="使用数量" min-width="115" >
                        </el-table-column>
                        <el-table-column prop="discount_num" label="总金额" min-width="115" >
                        </el-table-column>                    									
                    </el-table>            
                </el-tab-pane> -->
            </el-tabs>          
        </div>	
    </el-dialog> 
</template>

<script>
import {getElectcouponUsedRecord ,getCouponUsedCount} from '@/api/api' ;
export default {
    props: [ 'discountsPropData' ],
    data(){
        return {
            listLoading:false,
            dateValue:'',
            dateSearch:[],
            carNumSearch:'',
            currentPage:1,
            eleDiscountsArry:[],
            paperDiscountsArry:[], 
            otherDiscountsArry:[]
                       
        }
    },
    methods:{
        openDialog(){
            
            this.operatorId = this.discountsPropData.operatorId
            this.dateSearch = this.discountsPropData.dateSearch
            this.carNumSearch = this.discountsPropData.carNumSearch
            this.getElectcouponUsedRecord()
            // this.getCouponUsedCount()
        },
        tabClick(value){
            console.log(value.label);
        },     
        //电子优惠券   
        getElectcouponUsedRecord(){
            let params = {
                operatorId: this.operatorId,
                carNum: this.carNumSearch,
                beginDate:'',
                endDate	:'',
            }
            // if(this.dateSearch  && this.dateSearch.length){
                params.beginDate = this.Util.formatDate.format(this.discountsPropData.startTime,'yyyy-MM-dd hh:mm:ss')
                params.endDate = this.Util.formatDate.format(this.discountsPropData.endTime,'yyyy-MM-dd hh:mm:ss')
            // }            
            getElectcouponUsedRecord(params).then(data => {
                // console.log(data)
                if (data.data.code === "SUCCESS") {
                    this.eleDiscountsArry = data.data.data
                }
               else {
                    this.$message.error(data.data.msg)
                }
            });            
        },  
        //纸质优惠券   
        getCouponUsedCount(){
            getCouponUsedCount({}).then(data => {
                // console.log(data)
                if (data.data.code === "SUCCESS") {
                    this.paperDiscountsArry = data.data.data
                }
               else {
                    this.$message.error(data.data.msg)
                }
            });            
        },              
      
    }
}
</script>

<style lang="scss" scoped>

.form-dialog{
    .dialog-box{
        border-top: 1px solid $color-gray2;
        border-left: 1px solid $color-gray2;
        border-right: 1px solid $color-gray2;
    }
   
}
 
</style>


