webpackJsonp([71],{402:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=i(240),n=function(t){return t&&t.__esModule?t:{default:t}}(a),o=i(92);e.default={data:function(){return{filters:{what:"",condition:"carNum",isEmploy:2},CostStn:{cname:"",Type:"",Area:"",remark:"",timeFW:"",money:""},DCVisible:!1,DCLoading:!1,array:[],currentPage:1,total:0,pageSize:10,listLoading:!1}},mounted:function(){this.getTableList()},methods:{exportExcel:function(){var t=this;i.e(0).then(function(){for(var e=i(361),a=e.export_json_to_excel,n=["车牌号","商家名称","优惠券类型","免费时长(h)","免费金额(￥)","创建时间","有效期至","使用时间","挂起时间","使用状态"],o=["carNum","merchantName","type","value","howLong","createTime","endTime","lockTime","status"],r=t.Util.deepCopy(t.array),s=0;s<r.length;s++)0===r[s].memberStatus?r[s].allowType="未生效":1===r[s].memberStatus?r[s].allowType="已生效":2===r[s].memberStatus?r[s].allowType="已失效":3===r[s].memberStatus?r[s].allowType="挂起":4===r[s].memberStatus?r[s].allowType="解挂":r[s].allowType="未知",r[s].startTime=t.Util.formatTime(r[s].startTime),r[s].stopTime=t.Util.formatTime(r[s].stopTime),r[s].createTime=t.Util.formatTime(r[s].createTime),r[s].lockTime=t.Util.formatTime(r[s].lockTime);a(n,t.Util.formatJson(o,r),"会员信息"+t.Util.formatDate.format(new Date,"yyyy-MM-dd"))}.bind(null,i)).catch(i.oe)},handleSizeChange:function(t){this.pageSize=t,this.getTableList()},handleCurrentChange:function(t){this.currentPage=t,this.getTableList()},formatType:function(t,e){return 1===t.type?"减免时间":2===t.type?"减免金额":0===t.type?"金额全免":"未知"},formatSate:function(t,e){return 1===t.status?"已使用":0===t.status?"未使用":"未知"},indexMethod:function(t){return t+this.pageSize*(this.currentPage-1)},Print:function(){},addDC:function(){this.DCVisible=!0,this.CostStn.Area="",this.CostStn.cname="",this.CostStn.remark=""},DCEdit:function(t,e){this.DCVisible=!0,this.CostStn.Area=e.Type,this.CostStn.cname=e.cname,this.CostStn.remark=e.note},DCDelete:function(t,e){this.$confirm("确认删除该记录吗?","提示",{type:"warning"}).then(function(){})},DCSubmit:function(){var t=this;this.$refs.DCForm.validate(function(e){if(e){var i=t.CostStn;console.log(i)}})},getTableList:function(t){var e=this,i=this.filters.condition,a=this.filters.what,r=this.filters.whatTime,s={};s[i]=a;var l={status:this.filters.isEmploy};r&&(l.beginDate=this.Util.formatDate.format(r[0],"yyyy-MM-dd hh:mm:ss"),l.endDate=this.Util.formatDate.format(r[1],"yyyy-MM-dd hh:mm:ss")),l.current=this.currentPage-1,l.length=this.pageSize;var m=(0,n.default)(l,s);(0,o.getElectCouponsList)(m).then(function(t){e.total=t.data.totalCount,e.array=t.data.data}).catch(function(t){console.log(t)})}}}}});