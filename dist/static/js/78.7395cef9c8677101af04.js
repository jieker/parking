webpackJsonp([78],{398:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(92);e.default={data:function(){return{filters:{what:"",condition:0},array:[],currentPage:1,total:0,pageSize:10,listLoading:!1}},mounted:function(){this.getTableList()},methods:{handleSizeChange:function(t){this.pageSize=t},handleCurrentChange:function(t){this.currentPage=t},formatType:function(t,e){return 1==t.valid?"修改月卡类别":2==t.valid?"修改月卡信息":3==t.valid?"修改车牌信息":4==t.valid?"修改月卡起止时间":5==t.valid?"删除月卡":6==t.valid?"修改月卡类型":7==t.valid?"挂起":8==t.valid?"解挂":"未知"},vipType:function(t,e){return 0==t.type?"地面月卡":1==t.type?"内部人员":2==t.type?"地库月卡":3==t.type?"vip会员":"未知"},indexMethod:function(t){return t+this.pageSize*(this.currentPage-1)},find:function(){this.filters.condition,this.filters.what},getTableList:function(){var t=this;(0,n.setVIPHandle)().then(function(e){t.total=e.totalNum,t.array=e.arr}).catch(function(t){console.log(t)})}}}}});