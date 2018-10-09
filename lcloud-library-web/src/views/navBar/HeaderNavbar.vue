<template>
    <div class='container'>
          <div :style="{width:'180px'}">
            <div class="grid-content logo h1">图书馆服务子系统</div>
          </div>
          <el-row>
                <el-col :span="1">
                  <div class="tranfDiv" :class="{isOpen:sidebar.isOpen}">
                    <i class="iconfont icon-menu"  @click="toggleOpen"></i>
                  </div>
                </el-col>
                <el-col :span="21">
                  <div class="grid-content">
                    <el-menu
                      :default-active="defaultActive"
                      mode="horizontal"
                      @select="handleSelect"
                      background-color="#3FACB9"
                      router
                      text-color="#fff"
                      active-text-color="#fff">
                      <template v-for="item in header_router">
                        <el-menu-item :index="item.path" v-if="!item.hidden" :key="item.path">{{item.name}}</el-menu-item>
                      </template>

                    </el-menu>
                  </div>
                </el-col>
                <el-col :span="2">
                	<el-menu
                      class="el-menu-demo"
                      mode="horizontal"
                      background-color="#3FACB9"
                      text-color="#fff"
                      active-text-color="transparent">
	                	    <el-menu-item class="site-navbar__avatar" index="3">
                          <el-dropdown :show-timeout="0" placement="bottom">
                              <span class="el-dropdown-link">
                                <img :src="user.icon" v-if="user.icon">
                                <img src="../../assets/images/timg.jpg" v-else>
                                {{user.loginName}}
                              </span>
                              <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item ><span @click="editInformation" style="display:block;"><i class="iconfont icon-msnui-person-info"></i> 修改资料</span></el-dropdown-item>
                                <el-dropdown-item ><span @click="modifyPwdShow" style="display:block;"><i class="iconfont icon-AAICon-"></i> 修改密码</span></el-dropdown-item>
                                <el-dropdown-item ><span @click="loginOut" style="display:block;"><i class="iconfont icon-msnui-poweroff msnui"></i> 退 出</span></el-dropdown-item>
                              </el-dropdown-menu>
                            </el-dropdown>
	                      </el-menu-item>
                      </el-menu>
                </el-col>

                <!-- <el-col :span="1">
                	<el-menu
                      class="el-menu-demo"
                      mode="horizontal"
                      background-color="#3FACB9"
                      text-color="#fff"
                      active-text-color="transparent">
	                	    <el-menu-item class="site-navbar__avatar" index="3">
                          <span @click="loginOut" class="login-out"><i class="iconfont icon-msnui-poweroff msnui"></i>退出</span>
	                      </el-menu-item>
                      </el-menu>
                </el-col> -->
              </el-row>
              <!-- 个人资料弹出框 start -->
              <el-dialog width="800px" :visible.sync="informationDialog" title="个人资料" :before-close="cancelInformation" center>

                <el-card class="box-card">
                  <el-upload
                    class="reader-avatar-uploader"
                    action="/roleUser/user/v1/upload/pic"
                    :show-file-list="false"
                    :http-request="successUpload">
                    <span class="reader-avatar_wrap">
                      <img v-if="informationForm.icon" :src="informationForm.icon" class="avatar">
                      <img src="../../assets/images/timg.jpg" v-else>
                    </span>
                  </el-upload>
                  <el-form ref="informationForm" :rules="informationRules" :model="informationForm" label-width="80px" id="form">
                  <el-form-item label="登录名 :" >
                    <span class="color">{{user.loginName}}</span>
                  </el-form-item>
                    <el-form-item label="姓名 : ">
                      <el-input v-model="informationForm.userName"></el-input>
                    </el-form-item>
                    <el-form-item label="性别 : ">
                      <el-select v-model="informationForm.sex" placeholder="请选择性别">
                        <el-option label="男" value="1"></el-option>
                        <el-option label="女" value="2"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="联系电话 :" prop="phone">
                      <el-input  v-model="informationForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="电子邮箱 :" prop="email">
                      <el-input v-model="informationForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="所属机构 :">
                      <span class="color">{{user.organization}}</span>
                    </el-form-item>
                    <el-form-item label="上次登录 :">
                      <span class="color">{{dateFormat(user.lastLoginDate)}}&nbsp;&nbsp;</span>
                    </el-form-item>

                  </el-form>
                </el-card>
                <span slot="footer" class="dialog-footer" >
                      <el-button type="primary" @click='onSubmit'>保存</el-button>
                        <el-button  @click='cancelInformation'>取消</el-button>
                    </span>
              </el-dialog>
              <!-- 个人资料弹出框 end -->

              <!-- 修改密码弹出框 start-->
              <el-dialog  id="editPassword" width="600px" style="line-height: 1;" :visible.sync="modifyPsdDialog" title="修改密码" :before-close="cancelmodifyPwd" center >
                  <el-form ref="modifyPsdForm" :rules="modifyPsdRules" status-icon :model="modifyPsdForm" label-width="90px" id="form">
                    <el-form-item label="原始密码 :" prop="password">
                      <el-input type="password" v-model="modifyPsdForm.password" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码 :" prop="newPassword">
                      <el-input type="password" v-model="modifyPsdForm.newPassword" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码 :" prop="checkpsw">
                      <el-input type="password" v-model="modifyPsdForm.checkpsw" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item class="bottomSure">
                        <el-button type="primary" @click="onSave">保存</el-button>
                        <el-button @click="resetForm">重置</el-button>
                    </el-form-item>
                  </el-form>
              </el-dialog>
              <!-- 修改密码弹出框 end -->
      </div>
</template>
<script>
import { mapGetters } from 'vuex';
import moment from "moment";
import { modifyPwd, update } from "@/request/login";
import {readerImportPic} from '@/request/circulationReaderManageSchool'

	export default{
		name:"header-component",
		data() {
      // 校验规则
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
        if (!value) {
              callback();
        } else {
          if(!myreg.test(value)){
            callback(new Error("邮箱格式不对！"));
          }else {
            callback();
          }
        }
      };
      // 修改密码校验规则
      var validatePass = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入新密码"));
        } else if(value == this.modifyPsdForm.password) {
          callback(new Error("新密码不能和原密码一样"));
        } else {
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value !== this.modifyPsdForm.newPassword) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          if (this.modifyPsdForm.newPassword === "") {
            callback(new Error("请先输入新密码!"));
          }
          callback();
        }
      };
	    return {
	        activeIndex: '1',
	        activeIndex2: '1',
          defaultActive:'',
          // 个人资料弹出框信息
          informationDialog: false,
          informationForm: {
            userName: this.$store.getters.user.userName,
            sex: this.$store.getters.user.sex?this.$store.getters.user.sex.toString():null,
            email: this.$store.getters.user.email,
            phone: this.$store.getters.user.phone,
            userId: this.$store.getters.user.userId,
            phone: this.$store.getters.user.phone,
            icon: this.$store.getters.user.icon
          },
          loading: false,
          informationRules: {
            phone: [
              { validator: phone, trigger: 'blur' }
            ],
            email: [
              { validator: email, trigger: 'blur' }
            ]
          },
          // 修改密码弹出框信息
          modifyPsdDialog: false,
          modifyPsdForm: {
            password: "",
            newPassword: "",
            checkpsw: ""
          },
          modifyPsdRules: {
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
      computed: {
       ...mapGetters([
          'sidebar',
          'user',
          'header_router'
        ])
      },
      watch:{
        '$route':function(){
             this.setActive()
          }
      },
      mounted(){
        this.setActive()
      },
	    methods: {
        setActive(){
          this.$store.getters.header_router.forEach( route =>{
              if(this.$route.matched[0].path==route.path){
                this.defaultActive=route.path;
              }
          })
        },
	      handleSelect(key, keyPath) {
	        // console.log(this.$store.getters.siderbar_routers);
	      },
        toggleOpen(){
          this.$store.dispatch("toggleSideBar");
        },
        loginOut(){
          this.$store.dispatch("LoginOut").then(()=>{
             this.$router.push({path:'/login'})
              this.$message.success('退出成功!')
          })
        },
        // modifyPsd(){
        //   this.$router.push({ path: '/myAccount/modifyPsd' })
        // },
        // ------个人资料调用方法 start-----
        editInformation() {
          this.informationDialog = true;
        },
        cancelInformation() {
          this.informationDialog = false;
          this.informationForm = {
            userName: this.$store.getters.user.userName,
            sex: this.$store.getters.user.sex.toString(),
            email: this.$store.getters.user.email,
            phone: this.$store.getters.user.phone,
            userId: this.$store.getters.user.userId,
            phone: this.$store.getters.user.phone,
            icon: this.informationForm.icon
          }
          this.$refs.informationForm.resetFields();
        },
        onSubmit() {
          let saveData = {
            userId: this.informationForm.userId,
            userName: this.informationForm.userName,
            sex: this.informationForm.sex,
            phone: this.informationForm.phone,
            email: this.informationForm.email,
            icon: this.informationForm.icon
          };
          this.$refs.informationForm.validate(valid => {
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
        // -----个人资料调用方法end-----
        // ----- 修改密码start -----
        modifyPwdShow() {
          this.modifyPsdDialog = true;
        },
        cancelmodifyPwd() {
          this.modifyPsdDialog = false;
          this.$refs.modifyPsdForm.resetFields();
        },
        resetForm() {
          this.$refs["modifyPsdForm"].resetFields();
        },
        onSave() {
          let obj = {
            password: this.modifyPsdForm.password,
            newPassword: this.modifyPsdForm.newPassword,
            userId: this.$store.getters.user.userId
          };
          this.$refs.modifyPsdForm.validate(valid => {
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
        },
        // 修改密码 end
        //上次成功事件和图片上传
        successUpload(response){
          let formData = new FormData()
          formData.append('file', response.file)
          readerImportPic(formData).then(res=>{
            if(res.data.code==0){
              this.informationForm.icon =res.data.url;
              response.onSuccess();
              this.$message({
                type: 'success',
                message: '上传成功!',
                duration:1000
              });
            }else{
              response.onError();
              this.$message({
                type: 'error',
                message: res.data.msg,
                duration:1000
              });
            }
          })
        },
	    }
	}
</script>
<style scoped>
  .logo{
    font-family: 华文行楷;
    font-size: 20px;
  }
  .container{
    display: flex;
  }
  .el-row{
    flex: 1;
  }
  .tranfDiv{
    transform: rotate(90deg);
    transition:all .38s;
    transform-origin: 50% 50%;
    cursor: pointer;

  }
  .tranfDiv:hover .iconfont{
    color:rgb(255, 208, 75);
  }

  .isOpen{
    transform: rotate(0deg);
  }

  .el-menu--horizontal>.el-menu-item.is-active {
    border-bottom: 4px solid #409EFF;
    color: #303133;
  }

  .el-menu--horizontal>.el-menu-item{
    height: 80px;
    line-height: 80px;
  }

  .login-out{
    font-size: 14px;
    color: #fff;
  }
  .reader-avatar-uploader{
    text-align:center;
    margin-bottom:30px;
  }
  .reader-avatar_wrap{
    display: inline-block;
    width: 100px;
    height: 100px;
    line-height:178px;
    overflow:hidden;
    /* border: 1px dashed #d9d9d9; */
    border-radius: 100%
  }
  .reader-avatar_wrap img{
    width: 100%;
    height: 100%;
  }



</style>
<style>
  .container .el-menu-item{
    font-size: 16px;
  }
  .el-dialog__body .el-button:not(.el-button--text){
    margin-top: 40px;
    border-radius: 23px;
    padding: 10px 25px;
    font-size: 16px;
  }
  .bottomSure{

  }
  #editPassword .el-dialog--center .el-dialog__body{
    padding-bottom: 1px;
  }
  #editPassword .el-form-item__content{
    padding-right: 50px;
  }
  #editPassword .el-button--primary{
    margin-left: 30px;
  }
  #editPassword .el-button--default{
    float: right;
    margin-right: 30px;
  }
  #editPassword .el-dialog .el-dialog__header{
    text-align: left;
  }
  .el-dialog__title:before{
    display: block;
    content: "";
    background: #409EFF;
    margin-right: 10px;
    width: 6px;
    height: 30px;
    float: left;
  }
  .el-dialog__title{
    line-height: 30px;
  }
</style>

