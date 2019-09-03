export default {
    setParkGlobalSet(state,obj){
        state.parkGlobalSet = obj

        if(obj.showHugeCar){                               //区分大型车
            state.carTypeList = [                         // 车类型
                {typeName: '小型', mark: 'small'},
                {typeName: '大型', mark: 'large'},
                {typeName: '超大型', mark: 'superLarge'},
                {typeName: '免费车辆', mark: 'freeCharge'},
              ]
        }else{
            state.carTypeList = [                         // 车类型
                {typeName: '小型', mark: 'small'},
                {typeName: '大型', mark: 'large'},
                {typeName: '免费车辆', mark: 'freeCharge'},
              ]            
        }        
    },    
 
    setGateList(state,list){
        state.gateList = list
    },
       
      
}
