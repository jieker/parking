<template>
    <!-- 财务端入口 -->
    <section >
        <router-view></router-view>
    </section>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    mounted(){
        try {
            let menuNode = document.getElementsByClassName('menu-active')
            menuNode[0].classList.remove('menu-active')  
        } catch (error) {} 			
        document.getElementById("menu-box-6").classList.add("menu-active")				
    },    

}
</script>
<style lang="scss" >

</style>
