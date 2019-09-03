/* 
    全局过滤器
 */

import Util from './util'


//转换后台返回的时间,格式"yyyy/MM/dd hh:mm:ss"
exports.transformTime = (value) => {
    if(value){
        //IE下JavaScript字符串转换成Date后出现NaN错误,把"-"替换成"/"
        return Util.formatDate.format(new Date(value.replace( /-/g,"/")),'yyyy/MM/dd hh:mm:ss') 
    }
}

//转换后台返回的时间,格式"yyyy/MM/dd"
exports.transformTime2 = (value) => {
    if(value){
        return Util.formatDate.format(new Date(value.replace( /-/g,"/")),'yyyy/MM/dd') 
    }
}

//转换车类型
exports.transformCarType = (value) => {
    return value === 'small' ? '小型' : value === 'large' ? '大型' : value === 'superLarge' ? '超大型' : value === 'freeCharge' ? '免费车辆' : ''
}

//空转换为无
exports.transformNoting = (value) => {
    return value ? value : '无'
}

//用户类型
exports.transformUserType = (value) =>{
    return value === 0 ? '临时用户' : value === 1 ? '月卡用户' : ''
}

//秒转天小时分钟
exports.transformSeconds = (value) =>{
    let minute = parseInt(value/(60)) //秒数转分钟
    let hour = Math.floor(minute/60) //分钟转小时

    let d = Math.floor(hour/24)   //求天
    let h = hour%24               //求小时
    let m = minute%60 		      //求分钟	
    if (d === 0 && h === 0 && m === 0) {
        return '0分钟'
    }else if (d === 0) {
        return `${h}小时${m}分钟`
        
    } else{
        return `${d}天${h}小时${m}分钟`
    }
}

//分钟转天小时分钟
exports.transformMinutes = (value) =>{
    let hour = Math.floor(value/60)  //分钟转小时

    let d = Math.floor(hour/24)     //求天
    let h = hour%24                 //求小时
    let m = value%60; 		        //求分钟
    
    if (d === 0 && h === 0 && m === 0) {
        return '0分钟'
    }else if (d === 0) {
        return `${h}小时${m}分钟`
        
    } else{
        return `${d}天${h}小时${m}分钟`
    }    

}

//金额分单位制转元单位制,并保留2位小数
exports.transformMoney = (value) =>{
    return (value/100).toFixed(2)
}
//替换"null"为''
exports.transformNull = (value) =>{
    return value === 'null' ? '' : value
}
//true/false转"是"和"否"
exports.transformBoolean = (value) =>{
    return value ? '是' : '否'
}
//优惠券类型
exports.transformCouponType = (value) =>{
    return value === 0 ? '全免' : value === 1 ? '减免金额' : value === 2 ? '减免时间' : '未知'
}
