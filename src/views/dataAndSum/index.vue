<template>
    <div id="dataAndsum">
        <nav-bar :nav-select="isWay"></nav-bar>
        <section class="fin_content">
            <!-- <bead-crumb></bead-crumb> -->
            <div class="content">
                <router-view></router-view>
            </div>
        </section>
    </div>
</template>
<script>
var echarts = require('echarts/lib/echarts');

import '@/styles/elem.scss'
export default {
    data(){
        return{
            isWay:false
        }
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
