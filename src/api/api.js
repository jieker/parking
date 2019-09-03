/*后台API */

import axios from 'axios';
import Cookies from 'js-cookie'

export let ip = Cookies.get('serviceUrl') || '192.168.1.226:9021';        //开发服务器
export let base = `http://${ip}/v2/park` ;     



export let vipimport = `http://${ip}/v2/park/vip/excel/import` ;


// 停车场岗亭交班管理
export const Handover = params => { return axios.post(`${base}/user/shift`, params).then(res => res.data); };
// 停车场管理:查找进场规则
export const getListRules = params => { return axios.get(`${base}/gate/list/rules`, { params: params }) };
// 停车场管理:查找进场规则
export const alterListRules = params => { return axios.post(`${base}/gate/list/rules/setting`, params).then(res => res.data); };
// 停车场管理:增加停车场
export const addPark = params => { return axios.post(`${base}/add`, params).then(res => res.data); };
// 停车场管理:删除停车场
export const deletePark = (params,parkId) => { return axios.post(`${base}/${parkId}/delete`, params).then(res => res.data); };
// 停车场管理:查询停车场全局配置
export const getParkGlobalSet = params => { return axios.get(`${base}/setting/global`, { params: params }) };
// 停车场管理:查停车场及区域信息
export const getParkAllInfo = params => { return axios.get(`${base}/all/info`, { params: params }) };
// 停车场管理:查停车场简单信息
export const getParkSimpleInfo = params => { return axios.get(`${base}/list`, { params: params }) };
// 停车场管理:修改停车场全局配置
export const updateParkGlobalSet = params => { return axios.post(`${base}/setting/global/update`, params).then(res => res.data); };
// 停车场管理:修改停车场id
export const updateParkId = params => { return axios.post(`${base}/update`, params).then(res => res.data); };

// 停车场管理:增加区域
export const addRegion = params => { return axios.post(`${base}/region/add`, params).then(res => res.data); };
// 停车场管理:删除区域
export const deleteRegion = (params,regionId) => { return axios.post(`${base}/region/${regionId}/delete`, params).then(res => res.data); };
// 停车场管理:修改区域
export const updateRegion = (params,regionId) => { return axios.post(`${base}/region/${regionId}/update`, params).then(res => res.data); };
// 停车场管理:查区域信息
export const getRegionAllSimpleInfo = params => { return axios.get(`${base}/region/all/simple`, { params: params }) };
// 停车场管理:查区域停车位
export const getRegionSpaceByRegionId = (params,regionId) => { return axios.get(`${base}/region/${regionId}/spaces`, { params: params }) };

// 停车场管理:增加岗亭
export const addGate = params => { return axios.post(`${base}/gate/add`, params).then(res => res.data); };
// 停车场管理:删除岗亭
export const deleteGate = (params,gateId) => { return axios.post(`${base}/gate/${gateId}/delete`, params).then(res => res.data); };
// 停车场管理:修改岗亭
export const updateGate = (params,gateId) => { return axios.post(`${base}/gate/${gateId}/update`, params).then(res => res.data); };
// 停车场管理:查岗亭可配置进场规则
export const getGateRules = params => { return axios.get(`${base}/gate/rules`, { params: params }) };
// 停车场管理:查岗亭简单信息
export const getGateListSimple = params => { return axios.get(`${base}/gate/list/simple`, { params: params }) };
// 停车场管理:查岗亭信息
export const getGateListAll = params => { return axios.get(`${base}/gate/list/all`, { params: params }) };
// 停车场管理:根据区域id查区域下的岗亭
export const getGateListByRegionId = (params,regionId) => { return axios.get(`${base}/region/${regionId}/gate/list/all`, { params: params }) };


// 停车场管理:增加收费中心
export const addToll = params => { return axios.post(`${base}/toll/add`, params).then(res => res.data); };
// 停车场管理:删除收费中心
export const deleteToll = params => { return axios.post(`${base}/toll/${params}/delete`, params).then(res => res.data); };
// 停车场管理:修改收费中心
export const updateToll = params => { return axios.post(`${base}/toll/update`, params).then(res => res.data); };
// 停车场管理:根据区域id查区域下的收费中心
export const getTollListByRegionId = params => { return axios.get(`${base}/toll/list`, { params: params }) };

// 监控中心:查所有岗亭硬件配置
export const getParkCenterList = params => { return axios.get(`${base}/center/list`, { params: params }) };
// 监控中心:更加岗亭id查岗亭硬件配置
export const getParkCenterListByGateId = (params,gateId) => { return axios.get(`${base}/center/${gateId}/list`, { params: params }) };
// 监控中心:查询车辆入场及出场
export const getParkCenterCarList = params => { return axios.get(`${base}/center/car/list`, { params: params }) };

/**
 * 场内车辆管理
 * */ 
// 场内车辆管理:查岗场内车辆
export const getOnsiteList = params => { return axios.get(`${base}/onsite/list`, { params: params }) };
// 场内车辆管理:查岗优惠券详情
export const getOnsiteCouponList = params => { return axios.get(`${base}/onsite/coupon/list`, { params: params }) };
// 场内车辆管理:查岗场出场记录
export const getOnsiteOutList = params => { return axios.get(`${base}/onsite/out/list`, { params: params }) };
// 场内车辆管理:查岗收费记录
export const getOnsitePaymentList = params => { return axios.get(`${base}/onsite/payment/list`, { params: params }) };
//收费记录导出
export const exportOnsitePaymentList = `${base}/onsite/payment/export`
// 场内车辆管理:查岗收费统计
export const getStatistList = params => { return axios.get(`${base}/onsite/statistics/list`, { params: params }) };
// 场内车辆管理:查询岗亭
export const getGateList = params => { return axios.get(`${base}/onsite/gate/list`, { params: params }) };
// 停车场管理:修改车牌
export const updateOnsite = params => { return axios.post(`${base}/onsite/update`, params).then(res => res.data); };
// 计费
export const inCarBilling = params => { return axios.post(`${base}/onsite/billing/add`, params).then(res => res.data); };
// 收费
export const inCarCharge = params => { return axios.post(`${base}/onsite/confirm/charge`, params).then(res => res.data); };
//手动同步进场记录到云端
export const inCarRecordSyncCloud = params => { return axios.post(`${base}/record/sync/cloud`, params).then(res => res.data); };
//导入进场记录
export const inCarRecordExcelImport = `${base}/record/excel/import`
//删除进场记录
export const deleteInRecord = (params,id) => { return axios.post(`${base}/onsite/${id}/delete`, params).then(res => res.data); };


/**
 * 进场管理
 * */ 
// 进场管理:手动进场
export const manualInPark = params => { return axios.post(`${base}/parkin/manual`, params).then(res => res.data); };
//手动添加进场记录
export const manualAddParkRecord = params => { return axios.post(`${base}/parkin/record/add`, params).then(res => res.data); };
//阻止进场发送led接口参数
export const manualRefusePark = params => { return axios.post(`${base}/parkin/refuse`, params).then(res => res.data); };
//允许进场发送led接口参数
export const manualPermitPark = params => { return axios.post(`${base}/parkin/permit`, params).then(res => res.data); };


/**
 * 出场管理
 * */ 
// 手动出场计费
export const manualOutPark = params => { return axios.post(`${base}/out/manual/add`, params).then(res => res.data); };
//现金收费出场(有进场记录)
export const cashPayOutPark = params => { return axios.post(`${base}/out/cash/pay`, params).then(res => res.data); };
//现金收费出场(无进场记录)
export const noRecordcashPayOutPark = params => { return axios.post(`${base}/out/no/record/cash/pay`, params).then(res => res.data); };
//开关闸
export const commGateOutPark = params => { return axios.post(`${base}/out/comm/gate`, params).then(res => res.data); };
// 车牌检索
export const getOutSearchCar = params => { return axios.get(`${base}/out/search/car`, { params: params }) };

/**
 * 系统日志
 * */
// 获取系统日志列表
export const getLogList = params => { return axios.get(`${base}/log/list`, { params: params }) };

/**
 * 黑名单
 * */ 
// 获取黑名单
export const getBlacklist = params => { return axios.get(`${base}/blacklist/list`, { params: params }) };
//新增
export const addBlacklist = params => { return axios.post(`${base}/blacklist/add`, params).then(res => res.data); };
//删除
export const deleteBlacklist = params => { return axios.post(`${base}/blacklist/delete`, params).then(res => res.data); };
//导出
export const blacklistExcelExport = `${base}/blacklist/excel/export`
//导入
export const blacklistExcelImport = `${base}/blacklist/excel/import`
/**
 * 临时车
 * */ 
// 获取临时车
export const getWhitelist = params => { return axios.get(`${base}/whitelist/list`, { params: params }) };
//新增
export const addWhitelist = params => { return axios.post(`${base}/whitelist/add`, params).then(res => res.data); };
//删除
export const deleteWhitelist = params => { return axios.post(`${base}/whitelist/delete`, params).then(res => res.data); };
//删除
export const updateWhitelist = params => { return axios.post(`${base}/whitelist/update`, params).then(res => res.data); };
//导出
// export const whitelistExcelExport = (params,responseType) => { return axios.get(`${base}/whitelist/excel/export`, { params: params },responseType) };
//导入
export const whitelistExcelExport = `${base}/whitelist/excel/export`
export const whitelistExcelImport = `${base}/whitelist/excel/import`
/**
 * 收费标准
 * */
// 收费标准
export const getFeeslist = params => { return axios.get(`${base}/charge/rules`, { params: params }) };
// 同步收费标准
export const syncCloud = params => { return axios.get(`${base}/charge/sync/cloud/charging`, { params: params }) };

/**
 * 管理设置:用户管理
 * 
 * */

// 查找系统时间
export const commonTime = params => { return axios.get(base+'/common/time', { params: params }).then(res => res.data); };
// 查找登录位置
export const Dept = params => { return axios.get(base+'/user/address', { params: params }).then(res => res.data); };
// 查找符合登录的人员
export const AccordLoginUser = params => { return axios.get(base+'/user/'+params.address+'/account').then(res => res.data); };
// 登录
export const Login = params => { return axios.post(base+'/user/login', params).then(res => res.data); };
// 退出
export const logoutAPI = params => { return axios.post(base+'/user/logout', params).then(res => res.data); };
// 查询用户
export const listUser = params => { return axios.get(base+'/user/list', { params: params }); };
// 查询角色
export const listRole = params => { return axios.get(base+'/user/role/list', { params: params }); };
// 新增用户
export const addUser = params => { return axios.post(base+'/user/add', params).then(res => res.data); };
// 查询监控中心信息
export const listWatchCenter = params => { return axios.get(base+'/center/list', { params: params }); };
//修改密码
export const updatePass = params => { return axios.post(base+'/user/password/'+params.operatorId+'/update/', params).then(res => res.data); };
//修改用户
export const updateUser = params => { return axios.post(base+'/user/update', params).then(res => res.data); };
//删除用户
export const deleteUser = params => { return axios.post(base+'/user/'+params.id+'/delete', params).then(res => res.data); };
//重置密码
export const resetPass = params => { return axios.post(base+'/user/password/'+params.id+'/reset', params).then(res => res.data); };

/**
 * 管理设置:角色管理
 * 
 * */ 
//新增角色
export const addRole = params => { return axios.post(`${base}/role/add`, params).then(res => res.data); };
//删除角色
export const deleteRole = (params,id) => { return axios.post(`${base}/role/${id}/delete`, params).then(res => res.data); };
//修改角色
export const updateRole = params => { return axios.post(`${base}/role/update`, params).then(res => res.data); };
//切换角色状态
export const enabledRole = (params,id) => { return axios.post(`${base}/role/${id}/enabled`, params).then(res => res.data); };
//查询角色
export const getRoleList = params => { return axios.get(`${base}/role/list`, { params: params }); };

/**
 * 管理设置:权限管理
 * 
 * */ 
//新增权限
export const addMenu = params => { return axios.post(`${base}/menu/add`, params).then(res => res.data); };
//删除权限
export const deleteMenu = (params,id) => { return axios.post(`${base}/menu/${id}/delete`, params).then(res => res.data); };
//修改权限
export const updateMenu = params => { return axios.post(`${base}/menu/update`, params).then(res => res.data); };
//切换角色状态
export const enableMenu = (params,id) => { return axios.post(`${base}/menu/${id}/enable`, params).then(res => res.data); };
//查询权限
export const getMenuList = params => { return axios.get(`${base}/menu/list`, { params: params }); };
//查询角色对应权限
export const getMenuListByRoleId = (params,id) => { return axios.get(`${base}/menu/${id}/list`, { params: params }); };

/**
 * 设备信息管理
 * */ 
// 查询设备信息
export const listDeviceInfo = params => { return axios.get(base+'/device/list', { params: params }); };
//添加摄像头
export const addCamera = params => { return axios.post(base+'/device/camera/add', params).then(res => res.data); };
//添加LED显示屏
export const addGateLed = params => { return axios.post(base+'/device/led/add', params).then(res => res.data); };
//添加闸机
export const addSluice = params => { return axios.post(base+'/device/sluice/add', params).then(res => res.data); };
//修改摄像头
export const updateCamera = params => { return axios.post(base+'/device/camera/'+params.id+'/update', params).then(res => res.data); };
//修改闸机
export const updateSluice = params => { return axios.post(base+'/device/sluice/'+params.id+'/update', params).then(res => res.data); };
//修改led
export const updateLed = params => { return axios.post(base+'/device/led/'+params.id+'/update', params).then(res => res.data); };
//删除
export const deleteDevice = params => { return axios.post(base+'/device/'+params.id+'/delete', params).then(res => res.data); };
//测试开闸
export const sluiceDeviceTest = params => { return axios.get(`${base}/device/test/sluice`, { params: params }); };
//测试LED
export const ledDeviceTest = params => { return axios.get(`${base}/device/test/led`, { params: params }); };

/**
 * 设备类型光临
*/
//新增设备类型
export const addDeviceType = params => { return axios.post(`${base}/device/type/add`, params).then(res => res.data); };
//删除设备类型
export const deleteDeviceType = (params,id) => { return axios.post(`${base}/device/type/${id}/delete`, params).then(res => res.data); };
//修改设备类型
export const updateDeviceType = params => { return axios.post(`${base}/device/type/update`, params).then(res => res.data); };
//切换设备类型
export const openDeviceType = (params,id) => { return axios.post(`${base}/device/type/${id}/open`, params).then(res => res.data); };
//查询设备类型
export const getDeviceTypeList = params => { return axios.get(`${base}/device/type/list`, { params: params }); };

/**
 * 财务
 * 
 * 年月卡管理
 * 
*/
export const exportVIPList = `${base}/vip/excel/export`;   //会员信息列表导出
export const exportOperationList = `${base}/vip/operation/excel/export`;   //业务办理记录列表导出
export const exportOrderList = `${base}/vip/order/excel/export`;   //会员收费明细列表导出
export const getVIPInfo = params => { return axios.post(`${base}/viptable`, params).then(res => res.data); };
export const setVIPHandle = params => { return axios.post(`${base}/viptable`, params).then(res => res.data); };
// 业务办理:业务办理记录
export const applyRecord = params => { return axios.get(base+'/vip/apply/record', { params: params }); };
// 业务办理:根据开始时间查询结束时间
export const getExpireTime = params => { return axios.get(base+'/vip/expiretime', { params: params }); };
// 收费明细:收费明细查询
export const changeList = params => { return axios.get(base+'/vip/charge/list', { params: params }); };
// 收费明细:收费信息统计
export const changeCount = params => { return axios.get(base+'/vip/charge/count', { params: params }); };

// 会员信息:会员办理
export const vipAdd = params => {  return axios.post(base+'/vip/apply', params).then(res => res.data); };
// 会员信息:费用变更
export const feeChange = params => { return axios.post(base+'/vip/'+params.id+'/fee/change', params).then(res => res.data); };
// 会员信息:会员续费
export const feeRenewals = params => { return axios.post(base+'/vip/'+params.id+'/fee/renewals', params).then(res => res.data); };
// 会员信息:信息修改
export const infoUpdate = params => { return axios.post(base+'/vip/'+params.id+'/info/update', params).then(res => res.data); };
// 会员信息:会员删除
export const vipDelete = params => {  return axios.post(base+'/vip/'+params.id+'/delete', params.operatorId).then(res => res.data); };
// 会员信息:会员批量删除
export const vipBatchDelete = params => {  return axios.post(base+'/vip/delete/batch', params).then(res => res.data); };
// 会员信息:会员挂起解挂
export const vipPause = params => { return axios.post(base+'/vip/'+params.id+'/pause', params).then(res => res.data); };
// 会员信息:同步云端数据
export const syncCloudInfo = params => { return axios.post(base+'/vip/sync/cloud',  params ); };
// 会员信息:月卡查询列表
export const vipList = params => { return axios.get(base+'/vip/list', { params: params }); };
// 会员信息:根据月卡ID查询月卡信息
export const vipIdList = params => { return axios.get(base+'/vip/'+params.id, { params: params }); };
// 会员信息:会员类型统计
export const vipTypeCount = params => { return axios.get(base+'/vip/count', { params: params }); };

// 会员收费标准:查询收费标准列表
export const listMemberRate = params => { return axios.get(base+'/member/rate/list', { params: params }); };
//会员收费标准:查询收费标准列表(简单)
export const listMemberRateSim = params => { return axios.get(base+'/member/rate/list/simple', { params: params }); };
//会员收费标准:新增
export const addMemberRate = params => { return axios.post(base+'/member/rate/add', params).then(res => res.data); };
//会员收费标准:修改
export const updateMemberRate = params => { return axios.post(base+'/member/rate/'+params.id+'/update', params).then(res => res.data); };
//会员收费标准:删除
export const deleteMemberRate = params => { return axios.post(base+'/member/rate/'+params.id+'/delete', params).then(res => res.data); };

// 纸质优惠券:分页查询
export const getCouponTypeList = params => { return axios.get(base+'/coupon/type/list', { params: params }); };
// 纸质优惠券:查所有
export const getCouponTypeAllList = params => { return axios.get(base+'/coupon/type/coupon/page/all', { params: params }); };
//纸质优惠券:新增
export const addCouponType = params => { return axios.post(base+'/coupon/type/add', params).then(res => res.data); };
//纸质优惠券:修改
export const updateCouponType = params => { return axios.post(base+'/coupon/type/update', params).then(res => res.data); };
//纸质优惠券:删除
export const deleteCouponType = params => { return axios.post(base+'/coupon/type/delete', params).then(res => res.data); };
// 纸质优惠券使用记录:查询
export const getCouponUsedList = params => { return axios.get(base+'/coupon/record/page/list', { params: params }); };
// 纸质优惠券使用记录:汇总
export const getCouponUsedCount = params => { return axios.get(base+'/coupon/record/page/analyse', { params: params }); };
// 电子优惠券:分页查询
export const getElectCouponsList = params => { return axios.get(base+'/coupon/order/elect/list', { params: params }); };
// 电子优惠券使用统计
export const getElectcouponUsedRecord = params => { return axios.get(base+'/coupon/record/electcoupon/statistics', { params: params }); };

//停车收入明细列表数据：查询
export const getIncomeDetail = params => { return axios.get(base+'/summary/charge/detail', { params: params }); };
//导出停车收入明细列表数据：导出
export const exportIncomeDetail = `http://${ip}/v2/park/summary/charge/detail/export`;
//导出停车收入明细列表数据：导出
export const exportFlowAmount = `http://${ip}/v2/park/summary/export/flow/amount`;
//车流量金额汇总表数据：查询
export const getFlowAmount = params => { return axios.get(base+'/summary/charge/flow/amount', { params: params }); };
//收费处操作员收费数据统计：查询
export const getOperatorCharge = params => { return axios.get(base+'/summary/charge/operator', { params: params }); };
//班次收费统计：查询
export const getShiftCharge = params => { return axios.get(base+'/summary/charge/shift', { params: params }); };
//班次收费统计：导出
export const exportShiftCharge = `http://${ip}/v2/park/summary/charge/shift/export`;
//个人班次收费统计详情：查询
export const getShiftDetail = params => { return axios.get(base+'/summary/charge/shift/detail', { params: params }); };
//班次收费统计汇总：查询
export const getShiftChargeCount = params => { return axios.get(base+'/summary/charge/shift/count', { params: params }); };
//月汇总表：查询
export const getChargeCountMonth = params => { return axios.get(base+'/summary/charge/count/month', { params: params }); };
//年汇总表：查询
export const getChargeCountYear = params => { return axios.get(base+'/summary/charge/count/year', { params: params }); };

//年汇总表：查询
export const importBdDeptdoc = params => { return axios.post(base+'/vip/excel/import', { params: params }); };


/**
 在场车辆 
*/

//在场车辆记录
export const carInfo = params => { return axios.get(base+'/onsite/car/info', { params: params }); };
//根据车牌查询月卡信息
export const vipCarInfo = params => { return axios.get(base+'/vip/car/info', { params: params }); };

//添加取消收费记录
export const addCancelChargeRecord = params => { return axios.post(base+'/log/charge/cancel/add', params).then(res => res.data); };
export const exportCancelCharge = `${base}/log/charge/cancel/export`;


/**
 车辆数据统计
 */
export const exportChardeDataYear = `${base}/summary/year/car/export`;   //年汇总列表导出
export const exportChardeDataMonth = `${base}/summary/month/car/export`;   //月汇总列表导出
export const exportChardeDataDay = `${base}/summary/day/car/export`;   //车流量汇总列表导出
export const exportAbnormalList = `${base}/log/abnormal/list/export`;  // 导出异常查询列表
//查询取消收费记录列表
export const cancelCharge = params => { return axios.get(base+'/log/charge/cancel', { params: params }); };
//查询异常查询列表
export const abnormalList = params => { return axios.get(base+'/log/abnormal/list', { params: params }); };
//日车辆统计
export const dayCarCount = params => { return axios.get(base+'/summary/day/car', { params: params }); };
//月车辆统计
export const monthCarCount = params => { return axios.get(base+'/summary/month/car', { params: params }); };
//年车辆统计
export const yearCarCount = params => { return axios.get(base+'/summary/year/car', { params: params }); };

//下载控件
export const downloadActive = `${base}/camera/plugin`;   


