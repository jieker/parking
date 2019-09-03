<template>
    <div class="Navlist">
       <div class="text-right">
           <div v-show="!isCollapse" class="un-select text-right left-menu-top" @click.stop="isCollapse=!isCollapse"><i class="el-icon-caret-left"></i>折叠</div>
           <div v-show="isCollapse" class="un-select text-center left-menu-top" @click.stop="isCollapse=!isCollapse">展开<i  class="el-icon-caret-right"></i></div>
        </div>
       <el-menu 
         router 
         ref="navbar" 
         class="el-menu-vertical-demo" 
         :collapse="isCollapse"  
         :default-active="defActive"   
         unique-opened 
         background-color="#545c64"
         text-color="#fff"
         active-text-color="#FC813B"
       >
            <nav-bar-item v-for="(item, n) in navList" :item="item" :navIndex="String(n)" :key="n"></nav-bar-item>
        </el-menu>
    </div>
</template>

<script>
import NavBarItem from './NavBarItem'
  export default {
    name:'NavBar',
    props: ['navSelect'],
    components:{NavBarItem},
    computed:{
        defActive(){
            return this.$route.path
        },
    },
    data() {
      return {
        isCollapse: true,
        navList:[]
      };
    },
    watch:{
        //存储菜单展开/折叠状态到Cookie,记住用户偏好操作
        isCollapse(){
            let pageSetting = {
                isCollapse:this.isCollapse
            }
            localStorage.setItem('pageSetting',JSON.stringify(pageSetting))

        },        
    },    
    mounted(){
            this.createMenu()
            try {
                let tempVal = JSON.parse(localStorage.getItem('pageSetting'))
                if(tempVal){
                    this.isCollapse = tempVal.isCollapse
                }            
            } catch (error) {}
       
    },
    methods: {
        createMenu(){
            let permissionList = JSON.parse(sessionStorage.getItem('userPermission'))         

            // let navList=[]
            this.navList = []
            if(this.navSelect){
                let finAffList = null
            
                //根据权限数据生成财务端菜单
                for (let i = 0; i < permissionList.length; i++) {
                    if (permissionList[i].mark === 'markFinancialBtn' ) {
                        finAffList = permissionList[i].children
                        for(let i in finAffList){
                            if(finAffList[i].finAff){
                                this.navList.push(finAffList[i])
                            }
                        }                        
                        break
                    }
                }        

            }
            else{
                let settingList = null
            
                //根据权限数据生成数据与统计菜单
                for (let i = 0; i < permissionList.length; i++) {
                    if (permissionList[i].mark === 'markSetting' ) {
                        settingList = permissionList[i].children
                        for (let j = 0; j < settingList.length; j++) {
                            if (settingList[j].mark === 'markSettingDataSum' ) {
                                this.navList.push(settingList[j])
                                // console.log(this.navList);
                                break
                            }                            
                        }
                        break
                    }
                }                
            }
        }
    },
  }
</script>
<style lang="scss">
    .left-menu-top{
        font-size: 26px;
        color: $color-orange;
        cursor: pointer;
    };
    .Navlist{
        background-color:#545c64;
        .left-menu-top{
            padding: 2px 5px;
            font-size: 14px;
            color: #fff;
            cursor: pointer;
            i{
                font-size: 16px;
                color: $color-orange;
            }
        };
      
    }
</style>

<style>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>
