<template>
    <div id="manageSet">
        <bead-crumb></bead-crumb>
        <!-- 用户,角色,权限入口 -->
        <router-view></router-view>
    </div>
</template>

 <script>

export default {
    components:{
        // BeadCrumb
    },

    beforeUpdate(){
        try {
            let menuNode = document.getElementsByClassName('menu-active')
            menuNode[0].classList.remove('menu-active')  
        } catch (error) {}        
        document.getElementById("menu-box-7").classList.add("menu-active")				
    },     
}
</script>
<style lang="scss" >
    #manageSet{
        display: block !important;
        background: #fff;
    }
</style>
