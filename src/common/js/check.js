/* 
    全局表单校验规则文件
 */
export default {
    //   车牌号校验
     ruleCarNum(rule, value, callback){
        let  resultCreg = false;
        let  resultXreg = false;
        //普通车牌
        let creg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;        
        //新能源车牌
        let xreg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;


        if (value.length === 7){
            resultCreg = creg.test(value);
            if(resultCreg){
                callback();
            }else{
                callback(new Error('您输入的车牌号格式不正确!'));
            }
          }else if(value.length === 8){
            resultXreg = xreg.test(value);
            if(resultXreg){
                callback();
            }else{
                callback(new Error('您输入的车牌号格式不正确!'));
            }
          }else{
            callback(new Error('请输入正确的车牌号!'));
          }
     },

   
}
