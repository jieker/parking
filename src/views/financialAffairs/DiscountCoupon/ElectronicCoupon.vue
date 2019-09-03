
  <template>
    <section id="eleCoupon">
        <div class="FA-warpper">
            <!--工具条-->
            <el-col :span="24" class="FA-toolbar " >
                <el-form :inline="true" :model="filters">
                    <el-form-item class="queryTime">
                        <span>开始时间：</span>
                        <el-date-picker type="datetime"  v-model="filters.startTime" placeholder="请输入查询时间" :picker-options="pickerOptionsStart"></el-date-picker>
                        <span>结束时间：</span>
                        <el-date-picker type="datetime"  v-model="filters.endTime" placeholder="请输入查询时间" :picker-options="pickerOptionsEnd"></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="filters.condition" placeholder="选择查询条件" clearable>
                            <el-option label="车牌号" value="carNum"></el-option>
                            <el-option label="商家名称" value="merchantName"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="queryCarNum">
                        <el-input v-model="filters.what" placeholder="请输入查询关键字" clearable></el-input>
                    </el-form-item>
                    <el-button type="primary" @click="find()">查询</el-button>
                    <el-form-item label="是否使用">
                        <el-radio-group v-model="filters.isEmploy" @change="getTableList()">
                            <el-radio :label="2">全部</el-radio>
                            <el-radio :label="1">已使用</el-radio>
                            <el-radio :label="0">未使用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item class="Fright">
                        <!-- <el-button type="primary" @click="addDC">导出</el-button>
                        <el-button type="primary" @click="Print">打印</el-button> -->
                    </el-form-item>
                </el-form>
            </el-col>
            <!--列表-->
            <el-table :data="array"  :header-cell-style="{'text-align':'center'}" highlight-current-row v-loading="listLoading" style="width: 100%;">
                <el-table-column type="index" width="55" :index="indexMethod" label="序号" align='center'>
                </el-table-column>
                <el-table-column prop="carNum" label="车牌号" align='center' >
                </el-table-column>
                <el-table-column prop="merchantName" label="商家名称" align='center' min-width="100" >
                </el-table-column>
                <el-table-column prop="type" label="优惠券类型" align='center' min-width="100" :formatter="formatType">
                </el-table-column>
                <el-table-column prop="value" label="免费时长(h)" align='center' min-width="100" >
                    <template slot-scope="scope">
                        {{scope.row.type === 1 ? scope.row.value/60 : ''}}
                    </template>
                </el-table-column>
                <el-table-column prop="howLong" label="免费金额(￥)" align='center' min-width="100" >
                    <template slot-scope="scope">
                        {{scope.row.type === 2 ? scope.row.value/100 : ''}}
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" align='center' min-width="120" sortable>
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime | transformTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="startTime" label="有效开始时间" align='center' min-width="120" sortable>
                    <template slot-scope="scope">
                        <span>{{scope.row.startTime | transformTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="endTime" label="有效结束时间" align='center' min-width="120" sortable>
                    <template slot-scope="scope">
                        <span>{{scope.row.endTime | transformTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="lockTime" label="使用时间" align='center' min-width="120" sortable>
                    <template slot-scope="scope">
                        <span>{{scope.row.lockTime | transformTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="使用状态" align='center' min-width="100" :formatter="formatSate">
                </el-table-column>
            </el-table>
            <div class="elPag clearfix">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 40, 80, 200]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total" >
                </el-pagination>
                <el-button type="primary" class="PagGo">GO</el-button>
            </div>
        </div>
        <!--添加纸质优惠券  -->
        <el-dialog  title="添加纸质优惠券" :visible.sync="DCVisible">
            <el-form class="clear" :model="CostStn" label-width="100px"  ref="DCForm">
                <el-col :span="20">
                    <div class="grid-content bg-purple">
                        <el-form-item label="发放商家" class="carNumber" prop="idCard">
                             <el-input v-model="CostStn.cname"></el-input>
                        </el-form-item>
                        <el-form-item label="优惠类型">
                           <el-select v-model="CostStn.Area">
                                <el-option label="减免金额" value="0"></el-option>
                                <el-option label="免费时长" value="1"></el-option>
                                <el-option label="金额全免" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="优惠金额" >
                            <el-input  v-model="CostStn.money"></el-input>
                            <span>元</span>
                        </el-form-item>
                        <el-form-item label="备      注" >
                            <el-input type="textarea" v-model="CostStn.remark"></el-input>
                        </el-form-item>
                    </div>
                </el-col>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="DCSubmit" :loading="DCLoading">提交</el-button>
                <el-button @click.native="DCVisible = false">取消</el-button>
            </div>
        </el-dialog> 

    </section>
</template>
<!--<script src="@/assets/js/financialAffairs/DiscountCoupon/electronicCoupon.js"></script>-->

 <script>

     import { getElectCouponsList } from '@/api/api';
     export default {
         data() {
             return {
                 filters:{
                     startTime:new Date(new Date(new Date().toLocaleDateString()).getTime()),
                     endTime:new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1),
                     // whatTime:[new Date(new Date(new Date().toLocaleDateString()).getTime()),new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)],
                     what:'',
                     condition:'carNum',
                     isEmploy:2
                 },
                 pickerOptionsStart: {
                     disabledDate: time => {
                         let endDateVal = this.filters.endTime
                         if (endDateVal) {
                             return time.getTime() > new Date(endDateVal).getTime();
                         }
                     }
                 },
                 pickerOptionsEnd: {
                     disabledDate: time => {
                         let beginDateVal = this.filters.startTime
                         if (beginDateVal) {
                             return (
                                 time.getTime() < new Date(beginDateVal).getTime()
                             );
                         }
                     }
                 },
                 CostStn:{
                     cname:'',
                     Type:'',
                     Area:'',
                     remark:'',
                     timeFW:'',
                     money:''
                 },
                 DCVisible: false,
                 DCLoading: false,

                 // 列表信息
                 array: [],
                 currentPage:1,
                 total: 0,
                 pageSize: 10,
                 listLoading: false,

             }
         },
         mounted() {
             this.getTableList();
         },
         methods: {
             handleSizeChange(val) {
                 this.pageSize =  val;
                 this.getTableList();
             },
             handleCurrentChange(val) {
                 this.currentPage = val;
                 this.getTableList();
             },
             // 优惠类型转换
             formatType: function (row, column) {
                 return row.type === 1? '减免时间' : row.type === 2 ? '减免金额' : row.type === 0 ? '金额全免': '未知';
             },
             // 使用状态转换
             formatSate: function (row, column) {
                 return row.status === 1? '已使用' : row.status === 0 ? '未使用': '未知';
             },
             // 自定义序号
             indexMethod(index){
                 return index +this.pageSize*(this.currentPage-1);
             },
             // 打印
             Print(){
                 // bdhtml=window.document.body.innerHTML;
                 // sprnstr="<!--startprint-->";
                 // eprnstr="<!--endprint-->";
                 // prnhtml=bdhtml.substr(bdhtml.indexOf(sprnstr)+17);
                 // prnhtml=prnhtml.substring(0,prnhtml.indexOf(eprnstr));
                 // window.document.body.innerHTML=prnhtml;
                 // window.print();
             },
             // 新增显示
             addDC(){
                 this.DCVisible=true;
                 this.CostStn.Area='';
                 this.CostStn.cname='';
                 this.CostStn.remark='';
             },
             // 修改显示
             DCEdit(index,row){
                 this.DCVisible=true;
                 this.CostStn.Area=row.Type;
                 this.CostStn.cname=row.cname;
                 // this.CostStn.money=row.Type;
                 this.CostStn.remark=row.note;

             },
             //删除
             DCDelete: function (index, row) {
                 // console.log(index)
                 this.$confirm('确认删除该记录吗?', '提示', {
                     type: 'warning'
                 }).then(() => {
                     // this.listLoading = true;
                 });
             },
             // 提交
             DCSubmit() {
                 this.$refs.DCForm.validate((valid) => {
                     if (valid) {
                         let para=this.CostStn;
                         console.log(para);
                         //     setVIPHandle(para).then(res=>{
                         //         // console.log(res)
                         //     }).catch(err=>{
                         //         console.log(err)
                         //     })
                         // } else {
                         //   console.log('error submit!!');
                         //   return false;
                     }
                 });
             },

             //查询
             find(){
                 let startTime = this.filters.startTime
                 let endTime = this.filters.endTime;
                 if(this.filters.startTime===null ||this.filters.endTime=== null){
                     this.$message({
                         message: '开始时间或结束时间不能为空',
                         type: 'warning'
                     });
                 }else if(this.filters.startTime && this.filters.endTime){
                     if(startTime.getTime()<endTime.getTime()){
                         this.getTableList()
                     }else if(startTime.getTime()===endTime.getTime()){
                         this.getTableList()
                     }else{
                         this.$message({
                             message: '开始时间大于结束时间',
                             type: 'warning'
                         });
                     }
                 }
             },
             // 获取table数据
             getTableList(isAgm){
                 let condition = this.filters.condition;
                 let what = this.filters.what;
                 let whatTime = this.filters.whatTime;
                 let obj = {};
                 obj[condition] = what;
                 let params = {
                     status: this.filters.isEmploy,
                     beginDate : this.Util.formatDate.format(this.filters.startTime,'yyyy-MM-dd hh:mm:ss'),
                     endDate : this.Util.formatDate.format(this.filters.endTime,'yyyy-MM-dd hh:mm:ss'),
                 }
                 // if(whatTime){
                 //     params.beginDate = this.Util.formatDate.format(whatTime[0],'yyyy-MM-dd hh:mm:ss')
                 //     params.endDate = this.Util.formatDate.format(whatTime[1],'yyyy-MM-dd hh:mm:ss')
                 // }
                 params.current=this.currentPage-1
                 params.length=this.pageSize
                 let para=Object.assign(params,obj)
                 getElectCouponsList(para).then(res=>{
                     this.total=res.data.totalCount;
                     this.array=res.data.data;
                     // console.log(res)
                 }).catch(err=>{
                     console.log(err)
                 })
             },
         },
     }

 </script>

<style lang="scss">
    #eleCoupon{
        .queryTime{
            width: 600px;
            /*.el-form-item__content{*/
                /*width: 78%;*/
                /*.el-range-editor.el-input__inner{*/
                    /*width: 100%;*/
                /*}*/
            /*}*/
        }
        .queryCarNum{
            width: 10%;
            .el-select{
                width: 30%;
                .el-input{
                    width: 70%;
                }
                margin-right: 10px;

            }
        }
        /*.el-input{*/
            /*width: 40%;*/
            /*margin-right: 10px;*/

        /*}*/

    }
</style>

