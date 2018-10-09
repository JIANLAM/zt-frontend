<template>
	<div>
	<el-breadcrumb separator-class="el-icon-arrow-right">	
	  <el-breadcrumb-item  v-for="item in routerList" :key="item.name">{{item.name}}</el-breadcrumb-item>
	</el-breadcrumb>
	</div>
</template>

<script>
  export default{
  	name:'BreadCrumb',
  	data(){
  		return {
  			routerList:[]
  		}
  	},
  	watch:{
  		$route:function(){
  			this.init();
  		}
  	},
  	created(){
  		this.init();
  	},
  	methods:{
  		init(){
  			this.routerList=this.$route.matched;
  		}
  	}
  }
  
</script>

<style type="style/css" scoped>

</style>