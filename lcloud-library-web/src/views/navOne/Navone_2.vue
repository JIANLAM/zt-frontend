<template>
	<div class="a">哈哈哈</div>
</template>
<script>
	export default{
		mounted(){
			console.log(this.$store.getters.siderbar_routers)
		}
	}
</script>
<style>
	/*.a{
		color: red;
	}*/
</style>