<template>
	<el-dialog :title="id==1?'新增地址':'修改地址'" :visible.sync="dialogTableVisible">
	  	<el-form ref="form1" :model="form1" :rules="rules2" status-icon label-width="80px" v-if="id==1">
  		  <el-form-item label="收货人" prop="name">
  		    <el-input v-model="form1.name"></el-input>
  		  </el-form-item>
  		   <el-form-item label="所在地区">
             <cas-cader v-model='form1.area'></cas-cader>
  		  </el-form-item>

  			 <el-form-item label="详细地址" prop="address"> 
  		    <el-input v-model="form1.address"></el-input>
  		  </el-form-item>
  		  <el-form-item label="邮政编码" prop="zipcode">
  		    <el-input v-model="form1.zipcode"></el-input>
  		  </el-form-item>

  		   <el-form-item label="手机号码" prop="tel">
  		    <el-input v-model.number="form1.tel"></el-input>
  		  </el-form-item>
  		  <el-form-item>
  		    <el-button type="primary" @click="onSubmit" icon="el-icon-plus">新增</el-button>
  		    <el-button @click="dialogTableVisible=false">取消</el-button>
  		  </el-form-item>
		</el-form>

		<el-form ref="form" :model="form" :rules="rules" status-icon label-width="80px" v-else>
		  <el-form-item label="收货人" prop="name">
		    <el-input v-model="form.name" ></el-input>
		  </el-form-item>
		   <el-form-item label="所在地区">
				 <cas-cader v-model='form.area'></cas-cader>
		  </el-form-item>

			 <el-form-item label="详细地址" prop="address">
		    <el-input v-model="form.address" ></el-input>
		  </el-form-item>
		  <el-form-item label="邮政编码" prop="zipcode">
		    <el-input v-model="form.zipcode"></el-input>
		  </el-form-item>

		   <el-form-item label="手机号码" prop="tel">
		    <el-input v-model.number="form.tel"></el-input>
		  </el-form-item>
		  <el-form-item>
		    <el-button type="primary" @click="onSubmit">立即修改</el-button>
		    <el-button @click="dialogTableVisible=false">取消</el-button>
		  </el-form-item>
		</el-form>
	</el-dialog>
</template>

<script>
import { getAddress } from '@/request/address'
import CasCader from '@/components/cascader'

  export default{
  	name:'Dialog',	
    components:{
      CasCader
    },
  	data(){
  		var validatePass= (rule, value, callback) => {
  			if (value === '') {
          		callback(new Error('请输入手机号'));
        	}else{
        		if(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(value)==false){
        			callback(new Error('请输入正确格式的手机号码!'));	
        		}else{
        			 callback();
        		}
        	}
  		};
  		var validatePass2= (rule, value, callback) => {
  			if (value === '') {
          		callback(new Error('请输入邮政编码!'));
        	}else{
        		if(/^[0-9][0-9]{5}$/.test(value)==false){
        			callback(new Error('请输入正确格式的邮政编码!'));	
        		}else{
        			 callback();
        		}
        	}
  		};
  		return {
  			dialogTableVisible:false,
  			id:'',	
  			form:{
  				id:'',
  				name:'',
  				area:'',
  				address:'',
  				zipcode:'',
  				tel:'',
  				type:'',
  				op:[]
  			},
  			form1:{
  				name:'',
  				area:'',
  				address:'',
  				zipcode:'',
  				tel:'',
  				type:'',
  				op:[]
  			},
  			options:'',
  			rules:{
  				name:[
  					{ required: true, message: '请输入收件人!', trigger: 'blur' }
  				],
  				address:[
  					{ required: true, message: '请输入详细地址!', trigger: 'blur' }
  				],
  				tel:[
  					{ required: true, message: '请输入手机号码!', trigger: 'blur' },
  					{ validator: validatePass, trigger: 'blur' }
  				],
  				zipcode:[
  					{ required: true, message: '请输入邮政编码!', trigger: 'blur' },
  					{ validator: validatePass2, trigger: 'blur' }
  				],
  			},
  			rules2:{
  				name:[
  					{ required: true, message: '请输入收件人!', trigger: 'blur' }
  				],
  				address:[
  					{ required: true, message: '请输入详细地址!', trigger: 'blur' }
  				],
  				tel:[
  					{ required: true, message: '请输入手机号码!', trigger: 'blur' },
  					{ validator: validatePass, trigger: 'blur' }
  				],
  				zipcode:[
  					{ required: true, message: '请输入邮政编码!', trigger: 'blur' },
  					{ validator: validatePass2, trigger: 'blur' }
  				],
  			}
  		}
  	},
  	methods:{
  		visible(id){
  			this.dialogTableVisible=true;
       
          this.id=id;
          if(id==1){
            this.$nextTick(function(){
                this.$refs['form1'].resetFields();
            })
          
          }
       
  			
  		},
  		init(row){
  			   
	  			this.form.id=row.id;
	  			this.form.name=row.name;
	  			this.form.area=row.area;
	  			this.form.address=row.address;
	  			this.form.zipcode=row.zipcode;
	  			this.form.tel=row.tel;
	  			this.form.type=row.type;	
  			
  		},
  		onSubmit(){
  			getAddress().then(data=>{
  				console.log(data)
  			}).catch(error=>{
  				console.log(error)
  			})
  	
  		}
  	}
  }
</script>

<style type="style/css" scoped>

</style>