webpackJsonp([68],{405:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a(92);e.default={props:{ChargeStaProp:{type:Object,default:{}},PostData:{type:Object},selectInpput:[String,Number,Date,Array]},computed:{TOPINFO:function(){return this.$route.query}},data:function(){return{totalRevenue:"",array:[],currentPage:1,total:0,pageSize:10,listLoading:!1,sels:[]}},mounted:function(){},methods:{formatType:function(t,e){return 0==t.type?"地面月卡":1==t.type?"内部人员":2==t.type?"地库月卡":3==t.type?"vip会员":"未知"},handleSizeChange:function(t){this.pageSize=t,this.getShiftDetail()},handleCurrentChange:function(t){this.currentPage=t,this.getShiftDetail()},indexMethod:function(t){return t+this.pageSize*(this.currentPage-1)},getShiftDetail:function(t){var e=this,a={operatorId:this.Util.userInfo.id,date:this.Util.formatDate.format(this.selectInpput,"yyyy-MM-dd"),payAddress:this.PostData.payAddress,chargeManId:this.PostData.chargeManId,chargeMan:this.PostData.chargeMan};a.current=t?0:this.currentPage-1,a.length=this.pageSize,(0,n.getShiftDetail)(a).then(function(t){e.array=t.data.data.content.shiftChargeDetails,e.totalRevenue=t.data.data.content,e.total=t.data.data.totalElements}).catch(function(t){console.log(t)})}}}}});