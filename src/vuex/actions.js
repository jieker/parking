import { getGateListSimple,getParkGlobalSet,} from '@/api/api'
import Util from '@/common/js/util'

export const setParkGlobalSet = ({commit},param) => {
    getParkGlobalSet(param)
    .then( (data) => {
        if(data.data.code === 'SUCCESS'){
            if(data.data.data ){
                let parkGlobalSet = data.data.data
                parkGlobalSet.operatorId = Util.userInfo.id 
                commit('setParkGlobalSet',parkGlobalSet)
            }

        }else{
            this.$message.error(data.data.msg);                        
        }                                             
    })
}


export const setGateList = ({commit},param) => {
    getGateListSimple(param)
    .then( (data) => {
        if(data.data.data){
            commit('setGateList',data.data.data)
        }else{
            this.$message.error(data.data.msg);                             
        }                                              
    })
}


