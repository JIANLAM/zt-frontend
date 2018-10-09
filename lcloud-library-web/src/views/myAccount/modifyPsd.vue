<template>
	<div class="container">
		<el-card class="box-card" >
			<el-form ref="form" :rules="rules" status-icon :model="form" label-width="90px" id="form">
				<el-form-item label="原始密码 :" prop="password">
					<el-input type="password" v-model="form.password" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="新密码 :" prop="newPassword">
					<el-input type="password" v-model="form.newPassword" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="确认密码 :" prop="checkpsw">
					<el-input type="password" v-model="form.checkpsw" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item>		
				    <el-button type="primary" @click="onSave">保存</el-button>
				     <el-button @click="resetForm">重置</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
import { modifyPwd } from "@/request/login";
import { mapGetters } from "vuex";
export default {
  name: "modifyPwd",
  computed: {
    ...mapGetters(["user"])
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else if(value == this.form.password) {
				callback(new Error("新密码不能和原密码一样"));
			} else {
        callback();
			}
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        if (this.form.newPassword === "") {
          callback(new Error("请先输入新密码!"));
        }
        callback();
      }
    };

    return {
      form: {
        password: "",
        newPassword: "",
        checkpsw: ""
      },
      rules: {
        password: [
          { required: true, message: "请输入原始密码", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ],
        newPassword: [
          { required: true, validator: validatePass, trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ],
        checkpsw: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    resetForm() {
      this.$refs["form"].resetFields();
    },

    onSave() {
      let obj = {
        password: this.form.password,
        newPassword: this.form.newPassword,
        userId: this.$store.getters.user.userId
      };
      this.$refs.form.validate(valid => {
        if (valid) {
          modifyPwd(obj).then(data => {
            if (data.data.code == 0) {
              this.$store.dispatch("LoginOut").then(() => {
                this.$router.push({ path: "/login" });
                this.$message.success("修改密码成功!请重新登录");
              });
            } else {
              this.$message({
                type: "error",
                message: data.data.msg
              });
            }
          });
        }
      });
    }
  }
};
</script>

<style type="style/css" scoped>
.box-card {
  width: 460px;
}
</style>