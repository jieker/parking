webpackJsonp([41],{1167:function(a,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=t(92);e.default={data:function(){return{defaultProps:{children:"children",label:"label"},dialogTitle:"新增权限",listLoading:!1,addPermissionVisible:!1,addPermissionLoading:!1,addPermissionFormData:{component:"",enabledFlag:1,finAff:0,icon:"",id:"",name:"",mark:"",code:"1",operatorId:"",orderNum:null,parentId:"",path:"",type:2},addPermissionFormRules:{name:[{required:!0,message:"请输入权限名",trigger:"blur"}],mark:[{required:!0,message:"请输入权限标识",trigger:"blur"}],code:[{required:!0,message:"请输入权限标识",trigger:"blur"}],orderNum:[{required:!0,message:"请输入当前级的排序顺序",trigger:"change"}]},permissionData:[],markManagePermissionAdd:!1,markManagePermissionUpdate:!1,markManagePermissionDelete:!1}},mounted:function(){this.markManagePermissionAdd=this.Util.isPermission("markManagePermissionAdd"),this.markManagePermissionUpdate=this.Util.isPermission("markManagePermissionUpdate"),this.markManagePermissionDelete=this.Util.isPermission("markManagePermissionDelete"),this.getTableList()},beforeUpdate:function(){document.getElementById("menu-box-7").classList.add("menu-active")},filters:{transformPermissionType:function(a){return 0===a?"目录":1===a?"菜单":2===a?"按钮":"未知"}},methods:{openAddPermissionDialogByBtn:function(){this.dialogTitle="新增权限",this.addPermissionVisible=!0},listenOpenAddPermissionDialog:function(){this.addPermissionFormData},listenCloseAddPermissionDialog:function(){for(var a in this.addPermissionFormData)this.addPermissionFormData[a]=null;this.addPermissionFormData.finAff=0,this.addPermissionFormData.type=2,this.addPermissionFormData.code="1",this.addPermissionFormData.enabledFlag=1},addPermissionSubmit:function(a){var e=this;this.$refs[a].validate(function(a){if(!a)return!1;e.addPermissionFormData.operatorId=e.Util.userInfo.id,"新增权限"===e.dialogTitle?(0,i.addMenu)(e.addPermissionFormData).then(function(a){"SUCCESS"===a.code?(e.$message({message:"操作成功",type:"success"}),e.addPermissionVisible=!1,e.getTableList(!0)):e.$message.error(a.msg)}):"修改权限"===e.dialogTitle&&(0,i.updateMenu)(e.addPermissionFormData).then(function(a){"SUCCESS"===a.code?(e.$message({message:"操作成功",type:"success"}),e.addPermissionVisible=!1,e.getTableList(!0)):e.$message.error(a.msg)})})},getTableList:function(){var a=this,e={name:"",current:1,length:1e3};(0,i.getMenuList)(e).then(function(e){"SUCCESS"===e.data.code?a.permissionData=e.data.data:a.message.error(e.data.msg)})},append:function(a){this.dialogTitle="新增权限",this.addPermissionVisible=!0,this.addPermissionFormData.parentId=a.id},edit:function(a){this.dialogTitle="修改权限",this.addPermissionVisible=!0,this.addPermissionFormData=this.Util.deepCopy(a),this.addPermissionFormData.operatorId=this.Util.userInfo.id,delete this.addPermissionFormData.createTime,delete this.addPermissionFormData.updateTime},remove:function(a,e){var t=this;this.$confirm("该删除为永久删除,您确认删除该记录吗?","提示",{type:"warning"}).then(function(){(0,i.deleteMenu)({},e.id).then(function(a){"SUCCESS"===a.code?(t.$message({message:"操作成功",type:"success"}),t.addPermissionVisible=!1,t.getTableList(!0)):t.$message.error(a.msg)})})}}}},1219:function(a,e,t){e=a.exports=t(959)(),e.push([a.i,'\n/*! normalize.css v1.1.2 | MIT License | git.io/normalize */article[data-v-8d1f274a],aside[data-v-8d1f274a],details[data-v-8d1f274a],figcaption[data-v-8d1f274a],figure[data-v-8d1f274a],footer[data-v-8d1f274a],header[data-v-8d1f274a],hgroup[data-v-8d1f274a],main[data-v-8d1f274a],nav[data-v-8d1f274a],section[data-v-8d1f274a],summary[data-v-8d1f274a]{display:block}audio[data-v-8d1f274a],canvas[data-v-8d1f274a],video[data-v-8d1f274a]{display:inline-block;*display:inline;*zoom:1}audio[data-v-8d1f274a]:not([controls]){display:none;height:0}[hidden][data-v-8d1f274a]{display:none}html[data-v-8d1f274a]{font-size:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}button[data-v-8d1f274a],html[data-v-8d1f274a],input[data-v-8d1f274a],select[data-v-8d1f274a],textarea[data-v-8d1f274a]{font-family:sans-serif}body[data-v-8d1f274a]{margin:0}a[data-v-8d1f274a]{text-decoration:none}a[data-v-8d1f274a]:focus{outline:thin dotted}a[data-v-8d1f274a]:active,a[data-v-8d1f274a]:hover{outline:0}h1[data-v-8d1f274a]{font-size:2em;margin:.67em 0}h2[data-v-8d1f274a]{font-size:1.5em;margin:.83em 0}h3[data-v-8d1f274a]{font-size:1.17em;margin:1em 0}h4[data-v-8d1f274a]{font-size:1em;margin:1.33em 0}h5[data-v-8d1f274a]{font-size:.83em;margin:1.67em 0}h6[data-v-8d1f274a]{font-size:.67em;margin:2.33em 0}abbr[title][data-v-8d1f274a]{border-bottom:1px dotted}b[data-v-8d1f274a],strong[data-v-8d1f274a]{font-weight:700}blockquote[data-v-8d1f274a]{margin:1em 40px}dfn[data-v-8d1f274a]{font-style:italic}hr[data-v-8d1f274a]{-moz-box-sizing:content-box;box-sizing:content-box;height:0}mark[data-v-8d1f274a]{background:#ff0;color:#000}p[data-v-8d1f274a],pre[data-v-8d1f274a]{margin:1em 0}code[data-v-8d1f274a],kbd[data-v-8d1f274a],pre[data-v-8d1f274a],samp[data-v-8d1f274a]{font-family:monospace,serif;_font-family:courier new,monospace;font-size:1em}pre[data-v-8d1f274a]{white-space:pre;white-space:pre-wrap;word-wrap:break-word}q[data-v-8d1f274a]{quotes:none}q[data-v-8d1f274a]:after,q[data-v-8d1f274a]:before{content:"";content:none}small[data-v-8d1f274a]{font-size:80%}sub[data-v-8d1f274a],sup[data-v-8d1f274a]{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sup[data-v-8d1f274a]{top:-.5em}sub[data-v-8d1f274a]{bottom:-.25em}dl[data-v-8d1f274a],menu[data-v-8d1f274a],ol[data-v-8d1f274a],ul[data-v-8d1f274a]{margin:1em 0}dd[data-v-8d1f274a]{margin:0 0 0 40px}menu[data-v-8d1f274a],ol[data-v-8d1f274a],ul[data-v-8d1f274a]{padding:0 0 0 40px}nav ol[data-v-8d1f274a],nav ul[data-v-8d1f274a]{list-style:none;list-style-image:none}img[data-v-8d1f274a]{border:0;-ms-interpolation-mode:bicubic;display:block}svg[data-v-8d1f274a]:not(:root){overflow:hidden}figure[data-v-8d1f274a],form[data-v-8d1f274a]{margin:0}fieldset[data-v-8d1f274a]{border:1px solid silver;margin:0 2px;padding:.35em .625em .75em}legend[data-v-8d1f274a]{border:0;padding:0;white-space:normal;*margin-left:-7px}button[data-v-8d1f274a],input[data-v-8d1f274a],select[data-v-8d1f274a],textarea[data-v-8d1f274a]{font-size:100%;margin:0;vertical-align:baseline;*vertical-align:middle}button[data-v-8d1f274a],input[data-v-8d1f274a]{line-height:normal}button[data-v-8d1f274a],select[data-v-8d1f274a]{text-transform:none}button[data-v-8d1f274a],html input[type=button][data-v-8d1f274a],input[type=reset][data-v-8d1f274a],input[type=submit][data-v-8d1f274a]{-webkit-appearance:button;cursor:pointer;*overflow:visible}button[disabled][data-v-8d1f274a],html input[disabled][data-v-8d1f274a]{cursor:default}input[type=checkbox][data-v-8d1f274a],input[type=radio][data-v-8d1f274a]{box-sizing:border-box;padding:0;*height:13px;*width:13px}input[type=search][data-v-8d1f274a]{-webkit-appearance:textfield;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;box-sizing:content-box}input[type=search][data-v-8d1f274a]::-webkit-search-cancel-button,input[type=search][data-v-8d1f274a]::-webkit-search-decoration{-webkit-appearance:none}button[data-v-8d1f274a]::-moz-focus-inner,input[data-v-8d1f274a]::-moz-focus-inner{border:0;padding:0}textarea[data-v-8d1f274a]{overflow:auto;vertical-align:top}table[data-v-8d1f274a]{border-collapse:collapse;border-spacing:0}.float-left[data-v-8d1f274a]{float:left}.float-right[data-v-8d1f274a]{float:right}.clearfix[data-v-8d1f274a]:after{content:".";display:block;height:0;clear:both;visibility:hidden}.clearfix[data-v-8d1f274a]{zoom:1}.text-center[data-v-8d1f274a]{text-align:center}.text-left[data-v-8d1f274a]{text-align:left}.text-right[data-v-8d1f274a]{text-align:right}.text-justify[data-v-8d1f274a]{text-align:justify}.text-info[data-v-8d1f274a]{color:#909399}.text-success[data-v-8d1f274a]{color:#67c23a}.text-warning[data-v-8d1f274a]{color:#e6a23c}.text-danger[data-v-8d1f274a]{color:#f56c6c}.text-blue[data-v-8d1f274a]{color:#20a0ff}.text-orange[data-v-8d1f274a]{color:#fc813b}.text-white[data-v-8d1f274a]{color:#fff}.un-select[data-v-8d1f274a]{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.bg-info[data-v-8d1f274a]{background-color:#eee}.bg-success[data-v-8d1f274a]{background-color:#67c23a}.bg-warning[data-v-8d1f274a]{background-color:#e6a23c}.bg-danger[data-v-8d1f274a]{background-color:#f56c6c}.img-responsive[data-v-8d1f274a]{display:inline-block;height:auto;max-width:100%}.width-100[data-v-8d1f274a]{width:100px}.width-120[data-v-8d1f274a]{width:120px}.width-150[data-v-8d1f274a]{width:150px}.width-160[data-v-8d1f274a]{width:160px}.width-180[data-v-8d1f274a]{width:180px}.width-200[data-v-8d1f274a]{width:200px}.width-230[data-v-8d1f274a]{width:230px}.margin-0[data-v-8d1f274a]{margin:0}.padding-0[data-v-8d1f274a]{padding:0}.font-size-16[data-v-8d1f274a]{font-size:16px}.font-weight-b[data-v-8d1f274a]{font-weight:700}.cursor-pointer[data-v-8d1f274a]{cursor:pointer}.elPag[data-v-8d1f274a]{width:100%;text-align:center}.elPag .el-pagination[data-v-8d1f274a]{display:inline-block}.elPag .PagGo[data-v-8d1f274a]{padding:5px!important;position:relative;top:6px}.content[data-v-8d1f274a]{margin:8px;padding:8px;background:#eee;border-radius:10px}.content .content-body[data-v-8d1f274a]{background:#eee}.content .content-body .body-top .body-top-left[data-v-8d1f274a]{float:left;width:49%}.content .content-body .body-top .body-top-right[data-v-8d1f274a]{float:right;width:49%}.content .content-body .body-paging[data-v-8d1f274a]{padding:20px 0}.content .content-tree[data-v-8d1f274a]{width:100%;height:670px;overflow-y:auto}.custom-tree-node[data-v-8d1f274a]{flex:1;display:flex;align-items:center;justify-content:space-between;font-size:14px;padding-right:8px}',""])},1275:function(a,e,t){var i=t(1219);"string"==typeof i&&(i=[[a.i,i,""]]),i.locals&&(a.exports=i.locals);t(960)("784f2f92",i,!0)},1401:function(a,e){a.exports={render:function(){var a=this,e=a.$createElement,t=a._self._c||e;return t("section",[t("div",{staticClass:"content"},[t("el-col",{staticClass:"content-body",attrs:{span:24}},[t("div",{staticClass:"body-top clearfix"},[t("div",{staticClass:"body-top-left"}),a._v(" "),t("div",{staticClass:"body-top-right text-right"},[a.markManagePermissionAdd?t("el-button",{staticStyle:{"margin-bottom":"10px"},attrs:{type:"primary",size:"small"},on:{click:a.openAddPermissionDialogByBtn}},[a._v("增加一级菜单")]):a._e(),a._v(" "),t("el-button",{staticStyle:{"margin-bottom":"10px"},attrs:{type:"primary",size:"small"},on:{click:a.getTableList}},[a._v("刷新")])],1)]),a._v(" "),t("div",{staticStyle:{padding:"5px 25px",background:"#eeeeee"}},[t("span",{staticClass:"custom-tree-node text-center"},[t("span",[a._v("权限名")]),a._v(" "),t("span",[a._v("权限标识")]),a._v(" "),t("span",[a._v("权限代码")]),a._v(" "),t("span",[a._v("权限类型")]),a._v(" "),t("span",[a._v("页面路径")]),a._v(" "),t("span",[a._v("操作")])])])]),a._v(" "),t("div",{staticClass:"content-tree"},[t("el-tree",{attrs:{data:a.permissionData,"node-key":"id",props:a.defaultProps,"highlight-current":!0,"default-expand-all":"","expand-on-click-node":!1},scopedSlots:a._u([{key:"default",fn:function(e){var i=e.node,d=e.data;return t("span",{staticClass:"custom-tree-node"},[t("span",[a._v(a._s(d.name))]),a._v(" "),t("span",[a._v(a._s(d.mark))]),a._v(" "),t("span",[a._v(a._s(d.code))]),a._v(" "),t("span",[a._v(a._s(a._f("transformPermissionType")(d.type)))]),a._v(" "),t("span",[a._v(a._s(d.path))]),a._v(" "),t("span",[a.markManagePermissionAdd?t("a",{staticClass:"text-blue",attrs:{src:"javascript:;"},on:{click:function(e){a.append(d)}}},[a._v("增加子菜单")]):a._e(),a._v(" "),a.markManagePermissionUpdate?t("a",{staticClass:"text-blue",attrs:{src:"javascript:;"},on:{click:function(e){a.edit(d)}}},[a._v("  "),t("i",{staticClass:"el-icon-edit"}),a._v("修改  ")]):a._e(),a._v(" "),a.markManagePermissionDelete?t("a",{staticClass:"text-danger",attrs:{src:"javascript:;"},on:{click:function(e){a.remove(i,d)}}},[t("i",{staticClass:"el-icon-delete"}),a._v("删除")]):a._e()])])}}])})],1)],1),a._v(" "),t("el-dialog",{attrs:{title:a.dialogTitle,visible:a.addPermissionVisible},on:{"update:visible":function(e){a.addPermissionVisible=e},open:a.listenOpenAddPermissionDialog,close:a.listenCloseAddPermissionDialog}},[t("el-form",{ref:"addPermissionFormData",attrs:{model:a.addPermissionFormData,"label-width":"160px",rules:a.addPermissionFormRules}},[t("el-form-item",{attrs:{label:"权限名",prop:"name"}},[t("el-input",{attrs:{placeholder:"请输入权限名",clearable:"",maxlength:"50"},model:{value:a.addPermissionFormData.name,callback:function(e){a.$set(a.addPermissionFormData,"name",e)},expression:"addPermissionFormData.name"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"权限标识",prop:"mark"}},[t("el-input",{attrs:{placeholder:"请输入权限标识",clearable:"",maxlength:"50"},model:{value:a.addPermissionFormData.mark,callback:function(e){a.$set(a.addPermissionFormData,"mark",e)},expression:"addPermissionFormData.mark"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"权限代码",prop:"code"}},[t("el-input",{attrs:{placeholder:"请输入权限代码",clearable:"",maxlength:"50"},model:{value:a.addPermissionFormData.code,callback:function(e){a.$set(a.addPermissionFormData,"code",e)},expression:"addPermissionFormData.code"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"排序顺序",prop:"orderNum"}},[t("el-input-number",{attrs:{clearable:"",min:1,max:1e3,placeholder:"请输入当前级的排序顺序",label:"请输入当前级的排序顺序"},model:{value:a.addPermissionFormData.orderNum,callback:function(e){a.$set(a.addPermissionFormData,"orderNum",e)},expression:"addPermissionFormData.orderNum"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"权限类型",prop:"type",placeholder:"请选择权限类型"}},[t("el-select",{model:{value:a.addPermissionFormData.type,callback:function(e){a.$set(a.addPermissionFormData,"type",e)},expression:"addPermissionFormData.type"}},[t("el-option",{attrs:{value:0,label:"目录"}}),a._v(" "),t("el-option",{attrs:{value:1,label:"菜单"}}),a._v(" "),t("el-option",{attrs:{value:2,label:"按钮"}})],1)],1),a._v(" "),t("el-form-item",{attrs:{label:"页面路径",prop:"path"}},[t("el-input",{attrs:{placeholder:"/url",clearable:""},model:{value:a.addPermissionFormData.path,callback:function(e){a.$set(a.addPermissionFormData,"path",e)},expression:"addPermissionFormData.path"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"页面资源文件路径",prop:"component"}},[t("el-input",{attrs:{placeholder:"filename/filename/filename",clearable:""},model:{value:a.addPermissionFormData.component,callback:function(e){a.$set(a.addPermissionFormData,"component",e)},expression:"addPermissionFormData.component"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"目录图标",prop:"icon"}},[t("el-input",{attrs:{placeholder:"fa fa-credit-card",clearable:""},model:{value:a.addPermissionFormData.icon,callback:function(e){a.$set(a.addPermissionFormData,"icon",e)},expression:"addPermissionFormData.icon"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"是否是财务端目录菜单",prop:"finAff"}},[t("el-select",{model:{value:a.addPermissionFormData.finAff,callback:function(e){a.$set(a.addPermissionFormData,"finAff",e)},expression:"addPermissionFormData.finAff"}},[t("el-option",{attrs:{value:0,label:"否"}}),a._v(" "),t("el-option",{attrs:{value:1,label:"是"}})],1)],1),a._v(" "),t("el-form-item",{attrs:{label:"启用状态",prop:"enabledFlag"}},[t("el-select",{model:{value:a.addPermissionFormData.enabledFlag,callback:function(e){a.$set(a.addPermissionFormData,"enabledFlag",e)},expression:"addPermissionFormData.enabledFlag"}},[t("el-option",{attrs:{value:1,label:"启用"}}),a._v(" "),t("el-option",{attrs:{value:0,label:"关闭"}})],1)],1)],1),a._v(" "),t("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[t("el-button",{attrs:{type:"primary"},on:{click:function(e){a.addPermissionSubmit("addPermissionFormData")}}},[a._v("提交")]),a._v(" "),t("el-button",{nativeOn:{click:function(e){a.addPermissionVisible=!1}}},[a._v("取消")])],1)],1)],1)},staticRenderFns:[]}},447:function(a,e,t){t(1275);var i=t(37)(t(1167),t(1401),"data-v-8d1f274a",null);a.exports=i.exports}});