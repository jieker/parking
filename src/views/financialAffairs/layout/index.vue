<template>
    <div class="finAffairs">
        <nav-bar :nav-select="isWay"></nav-bar>
        <section class="fin_content">
            <bead-crumb></bead-crumb>
            <div class="content">
                <router-view></router-view>
            </div>
        </section>
    </div>
</template>
<script>
import '@/styles/elem.scss'
export default {
    data(){
        return{
            isWay:true
        }
    },
    mounted(){
        // console.log(22222222222222222);
    },   
    // beforeUpdate(){
    //     try {
    //         let menuNode = document.getElementsByClassName('menu-active')
    //         menuNode[0].classList.remove('menu-active')  
    //     } catch (error) {}        
    //     document.getElementById("menu-box-6").classList.add("menu-active")				
    // },     

}
</script>
<style lang="scss" >
</style>
