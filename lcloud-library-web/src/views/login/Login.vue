<template>
	<div class="loginContainer">
		<div class="logo"></div>
		  <div class="rowSpan">
		  	<el-card class="box-card">
		  	  <h4 >图书馆管理软件登录</h4>
			  <div class="grid-content">
			  		<el-form :model="user" status-icon :rules="rules" ref="loginForm" label-width="0" class="demo-ruleForm">
			  		    <el-form-item  prop="loginName">
					       <el-input v-model="user.loginName"  prefix-icon="iconfont icon-yonghuming" placeholder="请输入用户名" @keyup.enter.native="submitForm()"></el-input>
					    </el-form-item>
					    <el-form-item  prop="password">
					      <el-input type="password" v-model="user.password" auto-complete="off"  prefix-icon="iconfont icon-mima" placeholder="请输入密码" @keyup.enter.native="submitForm()"></el-input>
					    </el-form-item>
					    <el-form-item  >
					      <el-button type="primary" @click="submitForm" class="btn" round>登 录</el-button>
					    </el-form-item>
					</el-form>
			  </div>
			</el-card>
		  </div>
	</div>
</template>
<script>
	export default {
		data(){
			return {
				user:{
					loginName:'',
					password:''
				},
				rules: {
		          loginName: [
		            { required: true, message: '请输入用户名', trigger: 'blur' },
		          ],
		          password: [
		            { required: true, message: '请输入密码!', trigger: 'blur' }
		          ]
		      	}
			}
		},
      	methods:{
      		submitForm(){
      			  this.$refs.loginForm.validate(valid => {
			            if (valid) {
			              this.$store.dispatch('Login', Object.assign({},this.user,{type:1})).then((res) => {
											// this.$message.success(res.user.loginName+'登录成功');
											this.$router.push({ path: '/' });
			              }).catch(err => {
			                this.$message.error(err);
			              });
			            } else {
			              console.log('提交失败，验证还没通过!');
			              return false;
			            }
		          });
      		}
      	}
	}
</script>
<style scoped>
	.loginContainer{
		height: 100%;
		width: 100%;
		background: url(../../assets/images/loginBG.png)no-repeat;
		background-size: 100% 100%;
	}
	.logo{
		background: url(../../assets/images/logo.png)no-repeat;
		width:255px;
		height:66px;
		position: absolute;
		left: 5%;
		top: 5%
	}
	.rowSpan{
		position: absolute;
		/*width: 33.33%;*/
		width: 400px;
    height: 320px;
		left: 75%;
		top: 50%;
		transform: translate(-50%,-50%);
	}
	.el-card{
		 height: 400px;
		 border-radius: 10px;
	}
	.rowSpan h4{
		text-align: center;
		margin:0 0 50px 0;
		font-size:28px;
		font-weight: 500;
		font-family:SourceHanSansCN-Regular;
		color: #4A9FF9;
	}
	.btn{
		display: block;
		width: 100%;
		margin:5px 0;
		height: 50px;
		border-radius: 50px;
	}

</style>
<style>
	.grid-content .el-input__inner{
		border-color: #4A9FF9 !important;
    	border-radius: 50px !important;
    	background: rgba(255,255,255,.3);
	}
	.grid-content .el-input__prefix{
		left: 20px;
	}
	.grid-content .el-input--prefix .el-input__inner {
	    padding-left: 50px;
			height: 45px
	}
	.grid-content .el-input__icon{
		color: #4A9FF9;
		font-size: 24px;
	}
	.grid-content .el-form-item__error{
		padding-left: 20px;
	}
	.grid-content .el-input {
    position: relative;
    font-size: 16px;
    display: inline-block;
    width: 100%;
		color: #666;
	}
	.rowSpan .el-card__body {
    padding: 40px;
	}
</style>
