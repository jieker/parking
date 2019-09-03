import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.prototype.$axios = axios
import * as actions from './actions'
import * as getters from './getters'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
    //停车场全局配置
    parkGlobalSet:{
        parkMode:'simple',      //停车场模式
        askFlag:false,            //禁入车辆自动识别后是否弹窗询问
        showHugeCar:true,       //是否区分大型车和超大型车
        forbidNoSpace:true,     //车位已满是否允许车辆进场
        limitTempCar:true,      //临时用户是否有上限
        limitTempCarNum: 0,     //上限数量
        vipToManyCar:true,      //是否启用一卡多车
        freeCarPassAuto:true,   //免费车辆是否自动放行
    },     
    carTypeList: [                         // 车类型
        {typeName: '小型', mark: 'small'},
        {typeName: '大型', mark: 'large'},
        {typeName: '超大型', mark: 'superLarge'},
        {typeName: '免费车辆', mark: 'freeCharge'},
      ],
    gateList:null,                         //岗亭简单信息(id,name)集合,用于下拉选等简单应用 

}

// 创建 store 实例
export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
})