webpackJsonp([64],{410:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n(92);e.default={data:function(){return{listLoading:!1,pageSize:10,dataTotal:0,currentPage:1,CostStn:{cloudPayFlag:!1,timeLimitFlag:!1,rangeDateValue:[new Date(2016,9,10,0,0),new Date(2016,9,10,12,0)],memberType:"",remark:"",operatorId:"",standarId:"",regionArr:[],chargeStn:{dayMoney:0,monthMoney:0,yearMoney:0},chargeStandardUnit:"月",chargeStandardNum:0},regionArray:[],array:[],isUpdate:!1,costStnVisible:!1,costStnTitle:"新增标准",addCostStnLoading:!1,addCostStnFormRules:{chargeStn:[],memberType:[{required:!0,message:"请输入会员类型",trigger:"blur"}],chargeStandardNum:[{required:!0,message:"请输入收费标准",trigger:"change"}],regionArr:[{type:"array",required:!0,message:"至少选择一个有效区域",trigger:"change"}]}}},mounted:function(){this.getTableList()},beforeUpdate:function(){document.getElementById("menu-box-6").classList.add("menu-active")},methods:{handleSizeChange:function(t){this.pageSize=t,this.getTableList()},handleCurrentChange:function(t){this.currentPage=t,this.getTableList()},formatRegion:function(t,e){var n="",a=t.regionInfos;for(var r in a)n+=a[r].regionName+",";return n.substring(0,n.length-1)},tbHeader:function(t){return"1"==t.column.label?{display:"none"}:{"text-align":"center"}},indexMethod:function(t){return t+this.pageSize*(this.currentPage-1)},regionChange:function(t){for(var e="",n=0;n<t.length;n++)for(var a in this.regionArray)t[n]==this.regionArray[a].regionName&&(e+=this.regionArray[a].id+",");return e.substring(0,e.length-1)},addCsotStn:function(){this.costStnTitle="新增标准",this.costStnVisible=!0,this.isUpdate=!1,this.getRegion(),this.CostStn.memberType="",this.CostStn.chargeStn.dayMoney="",this.CostStn.chargeStn.monthMoney="",this.CostStn.chargeStn.yearMoney="",this.CostStn.remark="",this.CostStn.regionArr=[],this.CostStn.cloudPayFlag=!1,this.CostStn.timeLimitFlag=!1,this.CostStn.chargeStandardUnit="月",this.CostStn.chargeStandardNum=0},editCostStn:function(t,e){if(console.log(e),""!==e.startTime&&""!==e.endTime){var n=e.startTime.split(":"),a=e.endTime.split(":");this.CostStn.rangeDateValue=[new Date(2016,9,10,n[0],n[1]),new Date(2016,9,10,a[0],a[1])]}else this.CostStn.rangeDateValue=[new Date(2016,9,10,0,0),new Date(2016,9,10,0,0)];this.costStnVisible=!0,this.costStnTitle="修改标准",this.isUpdate=!0,this.CostStn.regionArr=[],this.getRegion();for(var r=0;r<e.regionInfos.length;r++)this.CostStn.regionArr.push(e.regionInfos[r].regionName);this.CostStn.memberType=e.memberType,this.CostStn.chargeStn.dayMoney="",this.CostStn.chargeStn.monthMoney="",this.CostStn.chargeStn.yearMoney="",this.CostStn.remark=e.remark,this.CostStn.standarId=e.id,this.CostStn.cloudPayFlag=e.cloudPayFlag,this.CostStn.timeLimitFlag=e.timeLimitFlag,e.dayMoney?(this.CostStn.chargeStandardUnit="天",this.CostStn.chargeStandardNum=e.dayMoney):e.monthMoney?(this.CostStn.chargeStandardUnit="月",this.CostStn.chargeStandardNum=e.monthMoney):e.yearMoney&&(this.CostStn.chargeStandardUnit="年",this.CostStn.chargeStandardNum=e.yearMoney)},CostStnSubmit:function(){var t=this,e="",n="",r="",s=this.CostStn.regionArr;this.$refs.CostStnForm.validate(function(i){if(i){t.CostStn.timeLimitFlag&&(e=t.Util.formatDate.format(t.CostStn.rangeDateValue[0],"hh:mm"),n=t.Util.formatDate.format(t.CostStn.rangeDateValue[1],"hh:mm")),s.length&&(r=t.regionChange(s)),"天"===t.CostStn.chargeStandardUnit?t.CostStn.chargeStn.dayMoney=t.CostStn.chargeStandardNum:"月"===t.CostStn.chargeStandardUnit?t.CostStn.chargeStn.monthMoney=t.CostStn.chargeStandardNum:"年"===t.CostStn.chargeStandardUnit&&(t.CostStn.chargeStn.yearMoney=t.CostStn.chargeStandardNum);var o={operatorId:t.Util.userInfo.id,memberType:t.CostStn.memberType,dayMoney:t.CostStn.chargeStn.dayMoney,monthMoney:t.CostStn.chargeStn.monthMoney,yearMoney:t.CostStn.chargeStn.yearMoney,regionId:r,remark:t.CostStn.remark,cloudPayFlag:t.CostStn.cloudPayFlag,timeLimitFlag:t.CostStn.timeLimitFlag,startTime:e,endTime:n};console.log(o),t.isUpdate?(o.id=t.CostStn.standarId,(0,a.updateMemberRate)(o).then(function(e){"SUCCESS"==e.code?(t.costStnVisible=!1,t.getTableList(),t.$message({type:"success",message:e.msg})):t.$message.error(e.msg)})):(0,a.addMemberRate)(o).then(function(e){"SUCCESS"==e.code?(t.costStnVisible=!1,t.getTableList(),t.$message({type:"success",message:e.msg})):t.$message.error(e.msg)})}else console.log("error submit!!")})},handleDelete:function(t,e){var n=this;this.$confirm("确认删除该记录吗?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){var t={operatorId:n.Util.userInfo.id,id:e.id};(0,a.deleteMemberRate)(t).then(function(t){"SUCCESS"==t.code?(n.costStnVisible=!1,n.getTableList(),n.$message({type:"success",message:t.msg})):n.$message.error(t.msg)})})},getTableList:function(){var t=this,e={operatorId:this.Util.userInfo.id,current:this.currentPage-1,length:this.pageSize};this.listLoading=!0,(0,a.listMemberRate)(e).then(function(e){t.listLoading=!1,"SUCCESS"===e.data.code?(t.array=e.data.data.content,t.dataTotal=e.data.data.totalElements):t.$message.error(e.data.msg)})},getRegion:function(){var t=this,e={operatorId:this.Util.userInfo.id};(0,a.getRegionAllSimpleInfo)(e).then(function(e){"SUCCESS"===e.data.code?t.regionArray=e.data.data:t.$message.error(e.data.msg)})}}}}});