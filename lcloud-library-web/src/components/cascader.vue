<template>
	<el-cascader :options="options" :value="value" @change="model" clearable></el-cascader>
</template>

<script>
import json from '@/mock/save.json'

  export default{
  	name:'CasCader',
  	props: ['value'],
  	model: {
      prop: 'value',
      event: 'change'
    },
  	data(){
  		return {
  			options:[]
  		}
  	},
  	created(){
  		const obj=json;
  		this.options=this.forMethods(obj);
  	},
  	methods:{
  		forMethods(obj){
  			var arr=[];
	 		for(let key in obj){
	 			let newObj={};
	 			 if(obj[key].child){	
		 			newObj.value=obj[key].name;
		 			newObj.label=obj[key].name;
	 			 	newObj.children=this.forMethods(obj[key].child);	 		
	 			 }else{
	 			 	newObj.value=obj[key];
	 			 	newObj.label=obj[key];
	 			 }
	 			arr.push(newObj);
	 		}
	 		return arr	
  		},
  		model(arr){
  			this.$emit('change', arr)
  		}
  	}
  }
</script>

<style type="style/css" scoped>

</style>