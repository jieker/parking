<!--面包屑导航,从匹配的路由中获取-->
<template>
    <div class="BCrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="item in activeRoute"  :key="item.path" >
                {{ item.name }} 
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>
<script>
export default {
    name:'BeadCrumb',
    computed: {
        activeRoute: function () {
            // console.log(this.$route.matched)
            return this.$route.matched.filter(function (item) {
                //不显示按钮
                if(item.name && item.meta !== 2){
                    return item
                }
            })
        }
    },
    mounted(){
        // console.log(this.$route.matched)
    }
}
</script>
<style lang="scss">
    .BCrumb{
        width: 100%;
        padding: 18px 0;
        background-color: white;
        border-bottom: 1px solid #999;
        .el-breadcrumb{
            margin-left: 20px;
        }
        .el-breadcrumb__item{
            font-size: 20px;
            .el-breadcrumb__inner{
                font-weight: bold;
            }
        }
        .el-breadcrumb__item:last-child{
            .el-breadcrumb__inner{
                color: #FF754A;
            }

        }
    }
</style>

