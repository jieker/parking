webpackJsonp([3],{1127:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a(92);e.default={components:{DDiscounts:function(){return a.e(17).then(a.bind(null,393))}},props:["chargeInfoProp"],mounted:function(){},data:function(){var t=this;return{listLoading:!1,pageSize:10,dataTotal:0,currentPage:1,carNumSearch:this.chargeInfoProp.carNum,chargeStatisticalDateSearch:null,discountsPropData:{visible:!1},chargeStatisticalVisible:!1,array:[],chargeStatisticalArry:[],eleDiscountDetails:[],paperDiscountDetails:[],discountDetailsTotal:0,userList:null,currentUserId:this.Util.userInfo.id,startTime:"",endTime:"",pickerOptionsStart:{disabledDate:function(e){var a=t.endTime;if(a)return e.getTime()>new Date(a).getTime()}},pickerOptionsEnd:{disabledDate:function(e){var a=t.startTime;if(a)return e.getTime()<new Date(a).getTime()}}}},methods:{closeDialog:function(){this.$emit("listenCloseMainDialog")},exportOnsitePaymentList:function(){var t=this,e={operatorId:this.currentUserId,carNum:this.carNumSearch,startTime:this.Util.formatDate.format(this.startTime,"yyyy-MM-dd hh:mm:ss"),endTime:this.Util.formatDate.format(this.endTime,"yyyy-MM-dd hh:mm:ss"),current:this.currentPage,length:this.pageSize};if(this.Util.isBrowerIE()){console.log(333);var a=i.exportOnsitePaymentList+"?operatorId="+e.operatorId+"&carNum="+e.carNum+"&startTime="+e.startTime+"&endTime="+e.endTime+"&current="+e.current+"&length="+e.length;this.Util.ieExportExcel(a)}else this.$axios({url:i.exportOnsitePaymentList,method:"get",params:e,responseType:"blob"}).then(function(e){"SUCCESS"===e.headers.code?t.Util.exportExcel(e):t.$message.error(decodeURI(e.headers.msg))})},userChange:function(){console.log(this.currentUserId),this.getPaymentList(!0)},openDiscountConunt:function(){if(this.startTime&&this.endTime){if(this.startTime>=this.endTime)return void this.$message.error("开始时间不能小于等于结束时间");this.discountsPropData.visible=!0,this.discountsPropData.startTime=this.startTime,this.discountsPropData.endTime=this.endTime,this.discountsPropData.carNumSearch=this.carNumSearch,this.discountsPropData.operatorId=this.currentUserId}else{if(!0==!this.startTime&&!0==!this.endTime)return void this.$message.error("查询开始时间和结束时间不能为空");if(!0==!this.startTime&&!1==!this.endTime)return void this.$message.error("请选择开始时间");if(!1==!this.startTime&&!0==!this.endTime)return void this.$message.error("请选择结束时间")}},getOnsiteCouponList:function(t){var e=this,a={paymentId:t.id};(0,i.getOnsiteCouponList)(a).then(function(t){if(e.eleDiscountDetails=[],e.paperDiscountDetails=[],e.discountDetailsTotal=0,"SUCCESS"==t.data.code)for(var a=t.data.data,i=0;i<a.length;i++)e.discountDetailsTotal+=a[i].couponActualValue,1===a[i].couponOrigin?(0===a[i].type?a[i].couponName="全免券":1===a[i].type?(a[i].value=e.Util.formatMinutes(a[i].value),a[i].couponName="免时长"+a[i].value):2===a[i].type&&(a[i].value=e.Util.formatMoney(a[i].value),a[i].couponName="免金额"+a[i].value+"元"),e.eleDiscountDetails.push(a[i])):0===a[i].couponOrigin&&e.paperDiscountDetails.push(a[i]);else e.$message.error(t.data.msg)})},getListUser:function(){var t=this,e={length:1e3,current:1};(0,i.listUser)(e).then(function(e){"SUCCESS"===e.data.code?t.userList=e.data.data.content:t.$message.error(e.data.msg)})},openChargeInfoDialog:function(){this.carNumSearch=this.chargeInfoProp.carNum,this.currentUserId=this.Util.userInfo.id;var t=this.Util.userInfo.createTime;this.startTime=this.chargeInfoProp.startTime||new Date(t.replace(/-/g,"/")),this.endTime=this.chargeInfoProp.endTime||new Date(JSON.parse(sessionStorage.getItem("commonTime"))),this.getPaymentList(!0),this.getListUser()},handleSizeChange:function(t){this.pageSize=t,this.getPaymentList(!1)},handleCurrentChange:function(t){this.getPaymentList(!1)},getPaymentList:function(t){var e=this,a={operatorId:this.currentUserId,carNum:this.carNumSearch,startTime:"",endTime:"",current:this.currentPage,length:this.pageSize};if(t&&(a.current=1),this.startTime&&this.endTime){if(this.startTime>=this.endTime)return void this.$message.error("开始时间不能小于等于结束时间");a.startTime=this.Util.formatDate.format(this.startTime,"yyyy-MM-dd hh:mm:ss"),a.endTime=this.Util.formatDate.format(this.endTime,"yyyy-MM-dd hh:mm:ss")}else{if(!0==!this.startTime&&!0==!this.endTime)return void this.$message.error("查询开始时间和结束时间不能为空");if(!0==!this.startTime&&!1==!this.endTime)return void this.$message.error("请选择开始时间");if(!1==!this.startTime&&!0==!this.endTime)return void this.$message.error("请选择结束时间")}this.listLoading=!0,(0,i.getOnsitePaymentList)(a).then(function(t){e.listLoading=!1,"SUCCESS"==t.data.code?(e.array=[],e.array=t.data.data.content,e.dataTotal=t.data.data.totalElements):e.$message.error(""+t.data.msg)}).catch(function(t){e.listLoading=!1})},openChargeStatisticalDialog:function(){if(this.startTime&&this.endTime){if(this.startTime>=this.endTime)return void this.$message.error("开始时间不能小于等于结束时间");this.chargeStatisticalVisible=!0,this.getStatistList()}else{if(!0==!this.startTime&&!0==!this.endTime)return void this.$message.error("查询开始时间和结束时间不能为空");if(!0==!this.startTime&&!1==!this.endTime)return void this.$message.error("请选择开始时间");if(!1==!this.startTime&&!0==!this.endTime)return void this.$message.error("请选择结束时间")}},getStatistList:function(){var t=this,e={operatorId:this.currentUserId,startTime:"",endTime:"",carNum:this.carNumSearch};if(this.startTime&&this.endTime){if(this.startTime>=this.endTime)return void this.$message.error("开始时间不能小于等于结束时间");e.startTime=this.Util.formatDate.format(this.startTime,"yyyy-MM-dd hh:mm:ss"),e.endTime=this.Util.formatDate.format(this.endTime,"yyyy-MM-dd hh:mm:ss")}else{if(!0==!this.startTime&&!0==!this.endTime)return void this.$message.error("查询开始时间和结束时间不能为空");if(!0==!this.startTime&&!1==!this.endTime)return void this.$message.error("请选择开始时间");if(!1==!this.startTime&&!0==!this.endTime)return void this.$message.error("请选择结束时间")}(0,i.getStatistList)(e).then(function(e){"SUCCESS"==e.data.code?(t.chargeStatisticalArry=e.data.data,t.dataTotal=e.data.data.totalElements):t.$message.error(""+e.data.msg)})}}}},1216:function(t,e,a){e=t.exports=a(959)(),e.push([t.i,'\n/*! normalize.css v1.1.2 | MIT License | git.io/normalize */article[data-v-8190071e],aside[data-v-8190071e],details[data-v-8190071e],figcaption[data-v-8190071e],figure[data-v-8190071e],footer[data-v-8190071e],header[data-v-8190071e],hgroup[data-v-8190071e],main[data-v-8190071e],nav[data-v-8190071e],section[data-v-8190071e],summary[data-v-8190071e]{display:block}audio[data-v-8190071e],canvas[data-v-8190071e],video[data-v-8190071e]{display:inline-block;*display:inline;*zoom:1}audio[data-v-8190071e]:not([controls]){display:none;height:0}[hidden][data-v-8190071e]{display:none}html[data-v-8190071e]{font-size:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}button[data-v-8190071e],html[data-v-8190071e],input[data-v-8190071e],select[data-v-8190071e],textarea[data-v-8190071e]{font-family:sans-serif}body[data-v-8190071e]{margin:0}a[data-v-8190071e]{text-decoration:none}a[data-v-8190071e]:focus{outline:thin dotted}a[data-v-8190071e]:active,a[data-v-8190071e]:hover{outline:0}h1[data-v-8190071e]{font-size:2em;margin:.67em 0}h2[data-v-8190071e]{font-size:1.5em;margin:.83em 0}h3[data-v-8190071e]{font-size:1.17em;margin:1em 0}h4[data-v-8190071e]{font-size:1em;margin:1.33em 0}h5[data-v-8190071e]{font-size:.83em;margin:1.67em 0}h6[data-v-8190071e]{font-size:.67em;margin:2.33em 0}abbr[title][data-v-8190071e]{border-bottom:1px dotted}b[data-v-8190071e],strong[data-v-8190071e]{font-weight:700}blockquote[data-v-8190071e]{margin:1em 40px}dfn[data-v-8190071e]{font-style:italic}hr[data-v-8190071e]{-moz-box-sizing:content-box;box-sizing:content-box;height:0}mark[data-v-8190071e]{background:#ff0;color:#000}p[data-v-8190071e],pre[data-v-8190071e]{margin:1em 0}code[data-v-8190071e],kbd[data-v-8190071e],pre[data-v-8190071e],samp[data-v-8190071e]{font-family:monospace,serif;_font-family:courier new,monospace;font-size:1em}pre[data-v-8190071e]{white-space:pre;white-space:pre-wrap;word-wrap:break-word}q[data-v-8190071e]{quotes:none}q[data-v-8190071e]:after,q[data-v-8190071e]:before{content:"";content:none}small[data-v-8190071e]{font-size:80%}sub[data-v-8190071e],sup[data-v-8190071e]{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sup[data-v-8190071e]{top:-.5em}sub[data-v-8190071e]{bottom:-.25em}dl[data-v-8190071e],menu[data-v-8190071e],ol[data-v-8190071e],ul[data-v-8190071e]{margin:1em 0}dd[data-v-8190071e]{margin:0 0 0 40px}menu[data-v-8190071e],ol[data-v-8190071e],ul[data-v-8190071e]{padding:0 0 0 40px}nav ol[data-v-8190071e],nav ul[data-v-8190071e]{list-style:none;list-style-image:none}img[data-v-8190071e]{border:0;-ms-interpolation-mode:bicubic;display:block}svg[data-v-8190071e]:not(:root){overflow:hidden}figure[data-v-8190071e],form[data-v-8190071e]{margin:0}fieldset[data-v-8190071e]{border:1px solid silver;margin:0 2px;padding:.35em .625em .75em}legend[data-v-8190071e]{border:0;padding:0;white-space:normal;*margin-left:-7px}button[data-v-8190071e],input[data-v-8190071e],select[data-v-8190071e],textarea[data-v-8190071e]{font-size:100%;margin:0;vertical-align:baseline;*vertical-align:middle}button[data-v-8190071e],input[data-v-8190071e]{line-height:normal}button[data-v-8190071e],select[data-v-8190071e]{text-transform:none}button[data-v-8190071e],html input[type=button][data-v-8190071e],input[type=reset][data-v-8190071e],input[type=submit][data-v-8190071e]{-webkit-appearance:button;cursor:pointer;*overflow:visible}button[disabled][data-v-8190071e],html input[disabled][data-v-8190071e]{cursor:default}input[type=checkbox][data-v-8190071e],input[type=radio][data-v-8190071e]{box-sizing:border-box;padding:0;*height:13px;*width:13px}input[type=search][data-v-8190071e]{-webkit-appearance:textfield;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;box-sizing:content-box}input[type=search][data-v-8190071e]::-webkit-search-cancel-button,input[type=search][data-v-8190071e]::-webkit-search-decoration{-webkit-appearance:none}button[data-v-8190071e]::-moz-focus-inner,input[data-v-8190071e]::-moz-focus-inner{border:0;padding:0}textarea[data-v-8190071e]{overflow:auto;vertical-align:top}table[data-v-8190071e]{border-collapse:collapse;border-spacing:0}.float-left[data-v-8190071e]{float:left}.float-right[data-v-8190071e]{float:right}.clearfix[data-v-8190071e]:after{content:".";display:block;height:0;clear:both;visibility:hidden}.clearfix[data-v-8190071e]{zoom:1}.text-center[data-v-8190071e]{text-align:center}.text-left[data-v-8190071e]{text-align:left}.text-right[data-v-8190071e]{text-align:right}.text-justify[data-v-8190071e]{text-align:justify}.text-info[data-v-8190071e]{color:#909399}.text-success[data-v-8190071e]{color:#67c23a}.text-warning[data-v-8190071e]{color:#e6a23c}.text-danger[data-v-8190071e]{color:#f56c6c}.text-blue[data-v-8190071e]{color:#20a0ff}.text-orange[data-v-8190071e]{color:#fc813b}.text-white[data-v-8190071e]{color:#fff}.un-select[data-v-8190071e]{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.bg-info[data-v-8190071e]{background-color:#eee}.bg-success[data-v-8190071e]{background-color:#67c23a}.bg-warning[data-v-8190071e]{background-color:#e6a23c}.bg-danger[data-v-8190071e]{background-color:#f56c6c}.img-responsive[data-v-8190071e]{display:inline-block;height:auto;max-width:100%}.width-100[data-v-8190071e]{width:100px}.width-120[data-v-8190071e]{width:120px}.width-150[data-v-8190071e]{width:150px}.width-160[data-v-8190071e]{width:160px}.width-180[data-v-8190071e]{width:180px}.width-200[data-v-8190071e]{width:200px}.width-230[data-v-8190071e]{width:230px}.margin-0[data-v-8190071e]{margin:0}.padding-0[data-v-8190071e]{padding:0}.font-size-16[data-v-8190071e]{font-size:16px}.font-weight-b[data-v-8190071e]{font-weight:700}.cursor-pointer[data-v-8190071e]{cursor:pointer}.elPag[data-v-8190071e]{width:100%;text-align:center}.elPag .el-pagination[data-v-8190071e]{display:inline-block}.elPag .PagGo[data-v-8190071e]{padding:5px!important;position:relative;top:6px}.content-head h2[data-v-8190071e]{padding:0 8px;color:#fc813b}.content-head hr[data-v-8190071e]{border:1px solid #999}.content-body[data-v-8190071e]{background:#eee;padding:0 10px}.content-body .body-top[data-v-8190071e]{padding:10px 0}.content-body .body-top .body-top-left[data-v-8190071e]{float:left;width:69%}.content-body .body-top .body-top-right[data-v-8190071e]{float:right;width:29%}.content-body .body-table[data-v-8190071e]{background:#fff}.content-body .body-paging[data-v-8190071e]{padding:20px 0}.form-dialog .table-box[data-v-8190071e]{border-top:1px solid #ebeef5;border-left:1px solid #ebeef5;border-right:1px solid #ebeef5}',""])},1272:function(t,e,a){var i=a(1216);"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);a(960)("44d2d7db",i,!0)},1399:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("el-dialog",{staticClass:"form-dialog",attrs:{title:"收费情况",width:"90%",visible:t.chargeInfoProp.visible},on:{"update:visible":function(e){t.$set(t.chargeInfoProp,"visible",e)},open:t.openChargeInfoDialog,closed:t.closeDialog}},[a("div",{staticClass:"content-body"},[a("div",{staticClass:"body-top clearfix"},[a("div",{staticClass:"body-top-left"},[a("el-select",{staticClass:"width-120",attrs:{placeholder:"请选择用户"},on:{change:t.userChange},model:{value:t.currentUserId,callback:function(e){t.currentUserId=e},expression:"currentUserId"}},t._l(t.userList,function(t){return a("el-option",{key:t.id,attrs:{label:t.realName,value:t.id}})})),t._v(" "),a("el-date-picker",{staticClass:"width-200",attrs:{type:"datetime",placeholder:"开始时间","picker-options":t.pickerOptionsStart},model:{value:t.startTime,callback:function(e){t.startTime=e},expression:"startTime"}}),t._v("     \n                    至                   \n                    "),a("el-date-picker",{staticClass:"width-200",attrs:{type:"datetime",placeholder:"结束时间","picker-options":t.pickerOptionsEnd},model:{value:t.endTime,callback:function(e){t.endTime=e},expression:"endTime"}}),t._v(" "),a("keyboard",{attrs:{placeholder:"请输入车牌",width:"120"},nativeOn:{keyup:function(e){if(!("button"in e)&&t._k(e.keyCode,"enter",13,e.key,"Enter"))return null;t.getPaymentList(!0)}},model:{value:t.carNumSearch,callback:function(e){t.carNumSearch="string"==typeof e?e.trim():e},expression:"carNumSearch"}}),t._v(" "),a("el-button",{attrs:{type:"primary",size:"small"},on:{click:function(e){t.getPaymentList(!0)}}},[t._v("查询")])],1),t._v(" "),a("div",{staticClass:"body-top-right text-right"},[a("el-button",{attrs:{type:"primary",size:"small"},on:{click:function(e){t.exportOnsitePaymentList()}}},[t._v("导出")]),t._v(" "),a("el-button",{attrs:{type:"primary",size:"small"},on:{click:t.openChargeStatisticalDialog}},[t._v("收费统计")]),t._v(" "),a("el-button",{attrs:{type:"primary",size:"small"},on:{click:t.openDiscountConunt}},[t._v("优惠信息汇总")])],1)]),t._v(" "),a("div",{staticClass:"body-table"},[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.listLoading,expression:"listLoading"}],attrs:{data:t.array,"highlight-current-row":"",height:"550"}},[a("el-table-column",{attrs:{prop:"operatorName",label:"收费人","min-width":"100",sortable:""}}),t._v(" "),a("el-table-column",{attrs:{prop:"carNum",label:"车牌号","min-width":"100",sortable:""}}),t._v(" "),a("el-table-column",{attrs:{prop:"carType",label:"车辆类型","min-width":"100",sortable:""},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(t._f("transformCarType")(e.row.carType)))])]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"startTime",label:"计费开始时间","min-width":"160",sortable:""}}),t._v(" "),a("el-table-column",{attrs:{prop:"payTime",label:"缴费时间","min-width":"160",sortable:""}}),t._v(" "),a("el-table-column",{attrs:{prop:"billingTime",label:"计费时长","min-width":"130",sortable:""},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(t._f("transformSeconds")(e.row.billingTime)))])]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"totalPay",label:"应收(元)","min-width":"115",sortable:""},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(t._f("transformMoney")(e.row.totalPay)))])]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"discountedPay",label:"实收(元)","min-width":"107",sortable:""},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(t._f("transformMoney")(e.row.discountedPay)))])]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"freePay",label:"总优惠(元)","min-width":"115",sortable:""},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(t._f("transformMoney")(e.row.freePay)))]),t._v(" "),a("el-popover",{directives:[{name:"show",rawName:"v-show",value:0!==e.row.freePay,expression:"scope.row.freePay !==0"}],attrs:{placement:"right",width:"300",trigger:"click"}},[a("el-row",[a("el-col",{attrs:{span:12}},[a("b",[t._v("电子优惠券")])]),t._v(" "),a("el-col",{attrs:{span:12}},[a("b",[t._v("券额")])])],1),t._v(" "),t._l(t.eleDiscountDetails,function(e){return a("div",{key:e.couponName},[a("el-row",[a("el-col",{attrs:{span:12}},[a("p",[t._v(t._s(e.couponName))])]),t._v(" "),a("el-col",{staticClass:"text-success",attrs:{span:12}},[a("p",[t._v(t._s(e.value))])])],1),t._v(" "),a("hr")],1)}),t._v(" "),t._l(t.paperDiscountDetails,function(e){return a("div",{key:e.couponName},[a("el-row",[a("el-col",{attrs:{span:12}},[a("p",[t._v("纸质优惠券")]),t._v(" "),a("p",[t._v("金额(元)")])]),t._v(" "),a("el-col",{staticClass:"text-success",attrs:{span:12}},[a("p",[t._v(t._s(e.couponName))]),t._v(" "),a("p",[t._v(t._s(t._f("transformMoney")(e.couponActualValue)))])])],1),t._v(" "),a("hr")],1)}),t._v(" "),a("el-button",{staticClass:"text-blue",staticStyle:{margin:"0",padding:"0"},attrs:{slot:"reference",type:"text",size:"mini"},on:{click:function(a){t.getOnsiteCouponList(e.row)}},slot:"reference"},[t._v("详情")])],2)]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"payType",label:"支付方式","min-width":"115",sortable:""}}),t._v(" "),a("el-table-column",{attrs:{prop:"remark",label:"备注信息","min-width":"180","show-overflow-tooltip":"",sortable:""}})],1)],1),t._v(" "),a("div",{staticClass:"body-paging text-center elPag"},[a("el-pagination",{attrs:{"current-page":t.currentPage,"page-size":t.pageSize,layout:"total,sizes,prev, pager, next, jumper",total:t.dataTotal},on:{"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange,"update:currentPage":function(e){t.currentPage=e}}}),t._v(" "),a("el-button",{staticClass:"PagGo",attrs:{type:"primary"}},[t._v("GO")])],1)])]),t._v(" "),a("d-discounts",{attrs:{discountsPropData:t.discountsPropData}}),t._v(" "),a("el-dialog",{staticClass:"form-dialog",attrs:{title:"收费统计",visible:t.chargeStatisticalVisible},on:{"update:visible":function(e){t.chargeStatisticalVisible=e}}},[a("div",{staticClass:"table-box"},[a("el-table",{staticStyle:{background:"#f3f3f3"},attrs:{data:t.chargeStatisticalArry,"highlight-current-row":""}},[a("el-table-column",{attrs:{prop:"payType",label:"收费方式","min-width":"105"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(e.row.payType))])]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"totalPay",label:"汇总","min-width":"115"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(t._f("transformMoney")(e.row.totalPay)))])]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"freePay",label:"优惠","min-width":"100"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(t._f("transformMoney")(e.row.freePay)))])]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"discountedPay",label:"实收","min-width":"115"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(t._f("transformMoney")(e.row.discountedPay)))])]}}])})],1)],1)])],1)},staticRenderFns:[]}},248:function(t,e,a){a(1272);var i=a(37)(a(1127),a(1399),"data-v-8190071e",null);t.exports=i.exports}});