/* 
    全局工具文件
 */
import Util from './util'

let SIGN_REGEXP = /([yMdhsm])(\1*)/g;
let DEFAULT_PATTERN = 'yyyy-MM-dd';

function padding(s, len) {
    var len = len - (s + '').length;
    for (var i = 0; i < len; i++) { s = '0' + s; }
    return s;
};

const util = {
    userInfo:JSON.parse(sessionStorage.getItem('userInfo')),    //登录用户信息
    parkInfo:JSON.parse(sessionStorage.getItem('parkInfo')),    //停车场信息

    payTypeList:[                                               //支付方式            
        {id:'01',payTypeName:'现金支付'},
        {id:'02',payTypeName:'微信支付'},
        {id:'03',payTypeName:'支付宝支付'},
        {id:'04',payTypeName:'转账'},
        {id:'05',payTypeName:'刷卡'},
    ],
    //时间转换
    formatDate: {
        /**
         * 日期转字符串
         * @param {Date} date 转换的日期
         * @param {Sting} pattern 时间格式 'eg:yy/MM/dd hh:mm:ss' 注意月是大写
         * return Sting
         */        
        format (date, pattern) {
            if (!date) {
                return
            }
            pattern = pattern || DEFAULT_PATTERN;
            return pattern.replace(SIGN_REGEXP, function ($0) {
                switch ($0.charAt(0)) {
                    case 'y': return padding(date.getFullYear(), $0.length);
                    case 'M': return padding(date.getMonth() + 1, $0.length);
                    case 'd': return padding(date.getDate(), $0.length);
                    case 'w': return date.getDay() + 1;
                    case 'h': return padding(date.getHours(), $0.length);
                    case 'm': return padding(date.getMinutes(), $0.length);
                    case 's': return padding(date.getSeconds(), $0.length);
                    default:
                    break;
                }
            });
        },

        /**
         * 字符串转日期
         * @param {Sting} dateString 转换的日期字符串
         * @param {Sting} pattern 日期字符串格式 'eg:yy/MM/dd hh:mm:ss' 注意月是大写
         * return Date
         */            
        parse (dateString, pattern) {
            let matchs1 = pattern.match(SIGN_REGEXP);
            let matchs2 = dateString.match(/(\d)+/g);
            // console.log(matchs1)
            // console.log(matchs2)    
            if (matchs1.length == matchs2.length) {
                let _date = new Date(1970, 0, 1);
                for (let i = 0; i < matchs1.length; i++) {
                    let _int = parseInt(matchs2[i]);
                    let sign = matchs1[i];
                    switch (sign.charAt(0)) {
                        case 'y': _date.setFullYear(_int); break;
                        case 'M': _date.setMonth(_int - 1); break;
                        case 'd': _date.setDate(_int); break;
                        case 'h': _date.setHours(_int); break;
                        case 'm': _date.setMinutes(_int); break;
                        case 's': _date.setSeconds(_int); break;
                    }
                }
                return _date;
            }
            return null;
        }
    },
    /**
     * 深度拷贝
     * @param {object} o 拷贝的对象
     * return object
     */
    deepCopy(o) {
        if (o instanceof Array) {
            let n = [];
            for (let i = 0; i < o.length; ++i) {
                n[i] = util.deepCopy(o[i]);
            }
            return n;
        } else if (o instanceof Object) {
            let n = {}
            for (let i in o) {
                n[i] = util.deepCopy(o[i]);
            }
            return n;
        } else {
            return o;
        }
    }, 
    /**
     * 清空数据对象
     * @param {object} data 清空对象
    */
    emptyData(data){
        for (let i in data) {
            if (data[i] instanceof Array) {
                for (let j = 0; j < data[i].length; ++j) {
                    this.emptyData([i][j]);
                }
            }
            if (typeof(data[i])=='string') {
                // i=''
                let id=/id/ig;
                if(!id.test(i)){
                    data[i]='';
                }
            }
        }
        return data;
    },
    /**
     * 计算固定宽度占浏览器宽度的百分比,应用场景:例如需要弹出固定宽度的弹窗
     * @param {String} width 需要计算的固定的宽度
    */
    computerWidth(width){
        let clientWidth = document.documentElement.clientWidth || document.body.clientWidth
        let tempVal = (width/clientWidth)*100
        return `${tempVal}%`
    },    
    /**
     * 将渲染表格的数据转换成导出excel表格所需的数据格式
     * @param {Array} filterVal 列字段
     * @param {Array} jsonData 表格数据
    */    
    formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
    },    
    /**
     * 根据权限标识判断是否有权限
     * @param {String} mark 权限标识
     * return Boolean
    */    
    isPermission(mark){
        let userPermissionMarkList = JSON.parse(sessionStorage.getItem('userPermissionMarkList'))
        if (userPermissionMarkList && userPermissionMarkList.length) {
            return userPermissionMarkList.includes(mark)
        }else{
            alert('您的权限已失效,请重新登录')
        }
    },
    /**
     * 根据角色权限生成路由所需格式数据
     * @param {Array} list 后端返回的角色对应权限列表
     * return Array
    */    
    createRouter(list){
        let returnList = []
        for(let i = 0, len = list.length; i < len; i++){
            // 如果有路由路径
            if (list[i].component) {
                let tempObj = {
                    name: list[i].name,
                    path: list[i].path || '',
                    id: list[i].id,
                    type: list[i].type,
                    meta:list[i].type,
                    icon: list[i].icon,
                    finAff: list[i].finAff,
                    component: () => import(`@/${list[i].component}`)
                }                  
                if (list[i].children && list[i].children.length) {
                    tempObj.children = Util.createRouter(list[i].children)
                }     
                returnList.push(tempObj)                                         
            }else{
                let tempObj = {
                    name: list[i].name,
                    path: list[i].path || '',
                    id: list[i].id,
                    type: list[i].type,
                    meta:list[i].type,
                    icon: list[i].icon,
                    finAff: list[i].finAff,                    
                }  
                if (list[i].children && list[i].children.length) {
                    tempObj.children = Util.createRouter(list[i].children)
                }      
                returnList.push(tempObj)                                         
            }
        }     
        // console.log(returnList);
        return returnList

    },
    //转换后台返回的时间,格式"yyyy/MM/dd hh:mm:ss"
    formatTime(value){
        if(value){
            return Util.formatDate.format(new Date(value),'yyyy/MM/dd hh:mm:ss')
        }
    },    
    //毫秒转多少小时多少分钟
    formatSeconds (value) {
        let minute = Math.ceil(value/(1000*60)) //毫秒数转分钟
        let h =Math.floor(minute/60); //求小时
        let m = minute%60; 		   //求分钟	

        return `${h}小时${m}分`
    },
    //分钟转多少小时多少分钟
    formatMinutes (value) {
        let h =Math.floor(value/60); //求小时
        let m = value%60; 		   //求分钟	

        return `${h}小时${m}分`
    },    
    //金额分单位制转元单位制,并保留2位小数
    formatMoney (value) {
        return (value/100).toFixed(2)
    },   
    //空车牌转换为无
    formatCarNum (value) {
        if(!value){
            return '无'
        }
    },          
    
    //   车牌号校验,非表单验证时调用
    ruleCarNum(value){
        let  resultCreg = false;
        let  resultXreg = false;
        //新能源车牌
        let xreg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
        //普通车牌
        let creg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;

        if (value.length === 7){
            resultCreg = creg.test(value);
            if(resultCreg){
               return true
            }else{
                return false
            }
          }else if(value.length === 8){
            resultXreg = xreg.test(value);
            if(resultXreg){
                return true
            }else{
                return false
            }
          }else{
            return false
          }
    },
    /**
     * 计算两个时间段内的时间,返回秒
     * @param {Date} startTime 开始时间
     * @param {Date} stopTime 结束时间
     * return number
    */    
    computerTimeBetween(startTime,stopTime){
        let start = startTime.getTime()
        let stop = stopTime.getTime()
        // console.log(parseInt((stop-start)/1000));
        return parseInt((stop-start)/1000)  
    },
    /**
     * 根据Id获取岗亭名,返回岗亭名称
     * @param {String} id 岗亭id
     * @param {Array} list 岗亭列表
     * return number
    */    
    getGateNameById(id,list){
        for (let i = 0; i < list.length; i++) {
            if (id === list[i].id) {
                return list[i].gateName
            }
        }
    }, 
    /**
     * 导出Excel文件
     * @param {Object} res 接口返回数据
    */    
    exportExcel(res) {
        if(!res.data){
            return
        }
        let fileName = decodeURI(res.headers.filename)
        let blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'})
        let url = window.URL.createObjectURL(blob);
        let aLink = document.createElement("a");
        aLink.style.display = "none";
        aLink.href = url;
        aLink.setAttribute("download", fileName);
        document.body.appendChild(aLink);
        aLink.click();
        document.body.removeChild(aLink);   //下载完成移除元素
        window.URL.revokeObjectURL(url);    //释放掉blob对象
    }, 
    /**
     * ie下导出Excel文件
     * @param {String} URLStr get请求完整url
    */    
    ieExportExcel(URLStr){
        // console.log(URLStr);
        let aLink = document.createElement("iframe");
        aLink.style.display = "none";
        document.body.appendChild(aLink);
        aLink.src= URLStr   
        // console.log(111111111);
        window.setTimeout(() =>{
            document.body.removeChild(aLink);   //下载完成移除元素
            // console.log(222222222222);
        }, 15000)
    },
     /**
     * 根据html标签id获取dom对象
     * @param {string} id html标签id
     */   
    getAX(id){
        if (window.document[id]){
            return window.document[id];
        }
        if (navigator.appName.indexOf("Microsoft Internet")==-1){
            if (document.embeds && document.embeds[id])
                return document.embeds[id];
        }
        else{
            return document.getElementById(id);
        }
    },
    /**
     * 判断是否是ie
     * return Boolean
    */
    isBrowerIE () {
        let tmp = document.documentMode;
        let isIE;
        try {
            document.documentMode = "";
        } catch (e) { };

        isIE = typeof document.documentMode == "number" || eval("/*@cc_on!@*/!1");
        try {
            document.documentMode = tmp;
        } catch (e) { };  

        if (isIE) {       
            return true 
        } else{  //不是ie
            return false
        }           
    }, 
    /**
     * 生成uuid,不要大写字母和分隔符
     * @param {number} len 长度,默认32
     * @param {number} radix 生成基数长度,默认0-9和小写字母组成字符串长度
    */
    createUUID(len, radix){
        let chars = '0123456789abcdefghijklmnopqrstuvwxyz'.split('')
        let uuid = [], i
        radix = radix || chars.length
        len = len || 32
        for (let i = 0; i < len; i++){
            uuid[i] = chars[0 | Math.random()*radix]
        }
        return uuid.join('')
    }                     
};
export default util


