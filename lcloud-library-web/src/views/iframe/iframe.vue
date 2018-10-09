<template>
	<iframe :src="$route.meta.path" frameborder="0"></iframe>
</template>

<script>
  export default{
  }
  
</script>

<style type="style/css" scoped>
	iframe{
		width: 100%;
		height: 100%;
	}
</style>