<template>
	<div id="app">
		<transition>
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'app',
	components: {
	}
}

</script>

<style lang="scss">
body {
	margin: 0px;
	padding: 0px;
	/*background: url(assets/bg1.jpg) center !important;
		background-size: cover;*/
	// background: #1F2D3D;
	font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
	font-size: 14px;
	-webkit-font-smoothing: antialiased;
}

#app {
	position: absolute;
	top: 0px;
	bottom: 0px;
	width: 100%;
	overflow: hidden;
}

.el-submenu [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.el-menu-item [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.toolbar {
	background: #f2f2f2;
	padding: 10px;
	//border:1px solid #dfe6ec;
	margin: 10px 0px;
	.el-form-item {
		margin-bottom: 10px;
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: all .2s ease;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
}
.block {
	width: 100%;
	text-align: center;
	margin-top:20px;
}
.block .el-pagination {
	display: inline-block;
}
.el-dialog__wrapper::-webkit-scrollbar {
	display:none;
}
.el-pagination .btn-next, .el-pagination .btn-prev , .el-pagination span , .el-pager li.number , .el-pager li{
	font-size: 16px;
	height: 30px;
	line-height: 30px;
}
.el-select-dropdown__wrap{
	max-height:500px ;
} 
.magn_bmt{
	width: 70%;
	height: 40px;
	display: inline-block;
	margin-bottom: 0 !important;                 
	border: 1px solid #eee;
	position: relative;
	margin-top: -1px;
	.el-form-item__label{
		border-right: 1px solid #eee;
	}
	span{
		height: 38px;
		display: inline-block;
	}
}
</style>