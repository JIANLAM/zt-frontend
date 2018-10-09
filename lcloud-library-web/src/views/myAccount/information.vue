<template>
	<div class="container">
		<el-card class="box-card" >
			<el-form ref="form" :rules="rules" :model="form" label-width="80px" id="form">
			<el-form-item label="登录名 :" >
				<span class="color">{{user.loginName}}</span>
			</el-form-item>
			  <el-form-item label="姓名 : ">
			    <el-input v-model="form.userName"></el-input>
			  </el-form-item>
			  <el-form-item label="性别 : ">
			    <el-select v-model="form.sex" placeholder="请选择性别">
			      <el-option label="男" value="1"></el-option>
			      <el-option label="女" value="2"></el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item label="联系电话 :" prop="phone">
			    <el-input  v-model="form.phone"></el-input>
			  </el-form-item>
			  <el-form-item label="电子邮箱 :" prop="email">
			    <el-input v-model="form.email"></el-input>
			  </el-form-item>
			  <el-form-item label="所属机构 :">
			  	<span class="color">{{user.organization}}</span>
			  </el-form-item>
			   <el-form-item label="上次登录 :">
			  	<span class="color">{{dateFormat(user.lastLoginDate)}}&nbsp;&nbsp;</span>
			  </el-form-item>
			  <el-form-item>		
			    	<el-button type="primary" @click='onSubmit'>保存</el-button>
			    	<el-button  @click='reset'>取消</el-button>
			  </el-form-item>
			</el-form>
		</el-card>
	</div>
</template>
<script>
import { mapGetters } from "vuex";
import { update } from "@/request/login";
import moment from "moment";
export default {
  name: "informationCom",
  computed: {
    ...mapGetters(["user"])
  },
  data() {
    var phone = (rule, value, callback) => {
      	let ph= /^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/;
		 		let mb= /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
				if(!ph.test(value)&&!mb.test(value)) {
					callback(new Error("联系电话格式不正确，请输入正确的手机号或带区号的固定电话"));
				}else {
           callback();
        }
    };
    var email = (rule, value, callback) => {
       var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      if (value === '') {
            callback();
      } else {
				if(!myreg.test(value)){
					callback(new Error("邮箱格式不对！"));
				}else {
           callback();
        }
      }
		};
    return {
      form: {
        userName: this.$store.getters.user.userName,
        sex: this.$store.getters.user.sex.toString(),
        email: this.$store.getters.user.email,
        phone: this.$store.getters.user.phone,
        userId: this.$store.getters.user.userId,
        phone: this.$store.getters.user.phone
      },
      loading: false,
			rules: {
        phone: [
          { validator: phone, trigger: 'blur' }
				],
				email: [
					 { validator: email, trigger: 'blur' }
				]
      }
    };
  },
  methods: {
    onSubmit() {
      let saveData = {
        userId: this.form.userId,
        userName: this.form.userName,
        sex: this.form.sex,
        phone: this.form.phone,
        email: this.form.email
      };
      this.$refs.form.validate(valid => {
        if (valid) {
          update(saveData).then(data => {
            if (data.data.code == 0) {
              this.$message({
                type: "success",
                message: "修改资料成功!"
              });
              location.reload();
            } else {
              this.$message({
                type: "error",
                message: data.data.msg
              });
            }
          });
        }
      });
    },
    // 转时间方法
    dateFormat(time) {
      if (time == undefined) {
        return "";
      }
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
    reset() {
      location.reload();
    }
  }
};
</script>
<style type="style/css" scoped>
.box-card {
  width: 460px;
}
.color {
  color: #606266;
}
</style>