<template>
  <el-dialog :title="id==1?'新增':'修改'" :visible.sync="dialogTableVisible" class="collectionParameters" width="700px">
    <el-form size="small" ref="form" :model="form" :rules="rules" status-icon label-width="120px" v-if="id==1">
      <el-form-item label="登录名:" prop="loginName">
        <el-input v-model="form.loginName"></el-input>
      </el-form-item>
      <el-form-item label="登录密码:" prop="loginPassword">
        <el-input type="password" v-model="form.loginPassword" auto-complete="off" ></el-input>
      </el-form-item>
      <el-form-item label="再次输入:" prop="checkloginPassword">
        <el-input type="password" v-model="form.checkloginPassword" auto-complete="off" ></el-input>
      </el-form-item>
      <el-form-item label="用户姓名:" prop="userName">
        <el-input v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="性别:">
        <el-select v-model="form.sex" placeholder="请选择性别" style="width: 100%">
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联系电话:" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱:" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="所属角色:">
        <el-select v-model="form.roleName" placeholder="请选择所属角色" @change="getOrgList" style="width: 100%">
          <el-option  v-for="(item,index) in downRoleList" :label="item.roleName" :value="item.roleId" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item label="所属机构:">-->
        <!--<el-select v-model="form.organizationOne" placeholder="请选择所属机构" @change="getOrgId">-->
          <!--<el-option  v-for="(item,index) in oneOrgList" :label="item.name" :value="item.orgId" :key="index"></el-option>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <!-- <el-form-item label="所属门店:">
        <el-select v-model="form.organizationTwo" placeholder="请选择所属机构" @change="getOrgIdA">
          <el-option  v-for="(item,index) in twoOrgList" :label="item.name" :value="item.orgId" :key="index"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="状态:">
        <el-select v-model="form.status" placeholder="状态" style="width: 100%">
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注:" prop="remark">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item class="addSure">
        <el-button type="primary" @click="onSubmit" >新增</el-button>
        <el-button @click="dialogTableVisible=false">取消</el-button>
      </el-form-item>
    </el-form>

    <el-form size="small" ref="formA" :model="formA" :rules="rulesA" status-icon label-width="120px" v-else>
      <el-form-item label="登录名:" prop="loginName">
        <el-input v-model="formA.loginName"></el-input>
      </el-form-item>
      <el-form-item label="登录密码:" prop="loginPassword">
        <el-input type="password" v-model="formA.loginPassword" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="再次输入:" prop="checkloginPassword">
        <el-input type="password" v-model="formA.checkloginPassword" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="用户姓名:" prop="userName">
        <el-input v-model="formA.userName"></el-input>
      </el-form-item>
      <el-form-item label="性别:">
        <el-select v-model="formA.sex" placeholder="请选择性别" style="width: 100%">
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联系电话:" prop="phone">
        <el-input v-model="formA.phone"></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱:" prop="email">
        <el-input v-model="formA.email"></el-input>
      </el-form-item>
      <el-form-item label="所属角色:">
        <el-select v-model="formA.roleName" placeholder="请选择所属角色" @change="getOrgList" style="width: 100%">
          <el-option  v-for="(item,index) in downRoleList" :label="item.roleName" :value="item.roleId" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item label="所属机构:">-->
        <!--<el-select v-model="formA.organizationOne" placeholder="请选择所属机构" @change="getOrgIdB">-->
          <!--<el-option  v-for="(item,index) in oneOrgList" :label="item.name" :value="item.orgId" :key="index" @click="getOrgId(index)"></el-option>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <!-- <el-form-item label="所属门店:">
        <el-select v-model="formA.organizationTwo" placeholder="请选择所属门店" @change="getOrgIdC">
          <el-option  v-for="(item,index) in twoOrgList" :label="item.name" :value="item.orgId" :key="index"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="状态:">
        <el-select v-model="formA.status" placeholder="状态" style="width: 100%">
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注:" prop="remark">
        <el-input type="textarea" v-model="formA.remark"></el-input>
      </el-form-item>
      <el-form-item class="addSure">
        <el-button type="primary" @click="onSubmit">立即修改</el-button>
        <el-button @click="dialogTableVisible=false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import {isvalidPhone} from '@/js/common'
  import {userManageAddUser,roleManageList,userManageOrgList,userManageUpdateUser} from '@/request/system'
  export default{
    data(){
      var validatePass = (rule, value, callback) => {
        if (value !== this.formA.loginPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.loginPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var checkPhone = (rule, value, callback) => {
        const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
        if (!value) {
          return callback(new Error('电话号码不能为空'))
        }
        setTimeout(() => {
          // Number.isInteger是es6验证数字是否为整数的方法,但是我实际用的时候输入的数字总是识别成字符串
          // 所以我就在前面加了一个+实现隐式转换

          if (!Number.isInteger(+value)) {
            callback(new Error('请输入数字值'))
          } else {
            if (phoneReg.test(value)) {
              callback()
            } else {
              callback(new Error('电话号码格式不正确'))
            }
          }
        }, 100)
      }
      var checkEmail = (rule, value, callback) => {
        const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
        if (!value) {
          return callback(new Error('邮箱不能为空'))
        }
        setTimeout(() => {
          if (mailReg.test(value)) {
            callback()
          } else {
            callback(new Error('请输入正确的邮箱格式'))
          }
        }, 100)
      }
      return {
        dialogTableVisible:false,//弹框显示与隐藏
        id:'',//显示新增和修改弹框标识
        downRoleList:[],//下拉角色列表
        oneOrgList:[],
        twoOrgList:[],
        form:{//新增表单数据
          orgId:'',
          loginName:'',
          userName:'',
          organizationOne:'',
          organizationTwo:'',
          roleName:'',
          status:'',
          remark:'',
          loginPassword:'',
          checkloginPassword:'',
          sex:'',
          phone:'',
          email:''
        },
        formA:{//修改表单数据
          userId:'',
          roleId:'',
          orgId:'',
          loginName:'',
          userName:'',
          organizationOne:'',
          organizationTwo:'',
          roleName:'',
          status:'',
          remark:'',
          loginPassword:'',
          checkloginPassword:'',
          sex:'',
          phone:'',
          email:''
        },
        rules:{
          loginName:[
            { required: true, message: '请输入登录名!', trigger: 'blur' }
          ],
          userName:[
            { required: true, message: '请输入用户姓名!', trigger: 'blur' }
          ],
          loginPassword:[
            { required: true, message: '请输入密码!', trigger: 'blur' },
            { min:6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
          ],
          checkloginPassword:[
            { required:true, validator:validatePass2, trigger: 'blur' },
          ],
          phone:[
            { required: true, trigger: 'blur',validator:checkPhone}
          ],
          email:[
            { required: true, trigger: 'blur',validator:checkEmail}
          ]
        },
        rulesA:{
          loginName:[
            { required: true, message: '请输入登录名!', trigger: 'blur' }
          ],
          userName:[
            { required: true, message: '请输入用户姓名!', trigger: 'blur' }
          ],
          loginPassword:[
            { required:false, message: '请输入密码!', trigger: 'blur' },
            { min:6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
          ],
          checkloginPassword:[
            { required:false, validator:validatePass, trigger: 'blur' },
          ],
          phone:[
            {required: true, trigger: 'blur',validator:checkPhone}
          ],
          email:[
            {required: true, trigger: 'blur',validator:checkEmail}
          ]
        }
      }
    },
    created(){
      let obj={jsonStr:{"pageSize":2000,"pageNum":1}}
      roleManageList(obj).then(res=>{
       this.downRoleList=res.data.page.list.map(item=>{
         return {
           roleId:item.id,
           roleName:item.roleName
         }
       });
      }).then(()=>{
        let orgList={
          jsonStr:{roleId:this.downRoleList[0].roleId}
        };
        userManageOrgList(orgList).then(res=>{
          res.data.list.forEach((value,index)=>{
            this.oneOrgList.push({
              orgId:res.data.list[index].id,
              name:res.data.list[index].name,
              children:res.data.list[index].children || [],
            });
            if(res.data.list[0].children.length>0){
              this.twoOrgList=res.data.list[0].children.map(item=>{
                return {
                  orgId:item.id,
                  name:item.name
                }
              });
            }
            })
          });
        });
    },
    methods:{
      //机构change事件
      organizationOne(val){
        for(let item of this.oneOrgList) {
          if (item.orgId == val) {
            this.twoOrgList = item.children;
          }
        }
      },
      visible(id){
        this.dialogTableVisible=true;
        this.id=id;
        if(id==1){
          this.$nextTick(()=>{
          this.$refs.form.clearValidate();
          })
        }
      },
      init(row){
          this.formA.userId=row.userId;
          this.formA.roleId=row.roleId;
          this.formA.orgId=row.orgId;
          this.formA.loginName=row.loginName;
          this.formA.userName=row.userName;
          this.formA.organizationOne=row.organization&&row.organization.indexOf('-')!=-1?row.organization.split('-')[0]:row.organization,
          this.formA.organizationTwo=row.organization&&row.organization.indexOf('-')!=-1?row.organization.split('-')[1]:'',
          this.formA.roleName=row.roleName;
          this.formA.createTime=row.createTime;
          this.formA.createName=row.createName;
          this.formA.status=row.status;
          this.formA.remark=row.remark;
          this.formA.loginPassword=row.loginPassword;
          this.formA.checkloginPassword=row.checkloginPassword;
          this.formA.sex=row.sex;
          this.formA.phone=row.phone;
          this.formA.email=row.email;
      },
      //点击角色得到机构列表
      getOrgList(roleId){
        let orgList={
          jsonStr:{roleId:roleId}
        };
        userManageOrgList(orgList).then(res=>{
          this.oneOrgList=[];
          this.twoOrgList=[];
          res.data.list.forEach((value,index)=>{
            this.oneOrgList.push({
              orgId:res.data.list[index].id,
              name:res.data.list[index].name,
              children:res.data.list[index].children || [],
            });
            if(res.data.list[0].children.length>0){
              this.twoOrgList=res.data.list[0].children.map(item=>{
                return {
                  orgId:item.id,
                  name:item.name
                }
              });
            }
          });
        });
      },
      //点击增加-所属机构得到机构id
      getOrgId(val) {
        for (let item of this.oneOrgList) {
          if (item.orgId == val) {
            this.twoOrgList = item.children.map(item => {
              return {
                orgId: item.id,
                name: item.name
              }
            })
          }
        }
        this.form.orgId=Number(this.form.organizationOne);
      },
      //点击增加-所属机构得到机构id
      getOrgIdA() {
        this.form.orgId=Number(this.form.organizationTwo);
      },
      //点击修改-所属机构得到机构id
      getOrgIdB(val) {
        for (let item of this.oneOrgList) {
          if (item.orgId == val) {
            this.twoOrgList = item.children.map(item => {
              return {
                orgId: item.id,
                name: item.name
              }
            })
          }
        }
        this.formA.orgId=Number(this.formA.organizationOne);
      },
      //点击修改-所属机构得到机构id
      getOrgIdC(){
        this.formA.orgId=Number(this.formA.organizationTwo);
      },
      onSubmit(){
        if(this.id==1){
          this.$refs.form.validate(valid =>{//添加用户列表数据提交
            if (valid){
              let params={
                loginName:this.form.loginName,
                userName:this.form.userName,
                password:this.form.loginPassword,
                status:Number(this.form.status),
                sex:Number(this.form.sex),
                email:this.form.email,
                phone:this.form.phone,
                remark:this.form.remark,
                roleId:Number(this.form.roleName),
                orgId:this.form.orgId
              };
              userManageAddUser(params).then(res=>{
                if(res.data.code==0){
                  this.$message({
                    type: 'success',
                    message: '添加成功!',
                    duration:2000
                  })
                  this.dialogTableVisible=false;
                  this.$emit('userManageList');
                }else {
                  this.$message({
                    type: 'success',
                    message: '添加失败!'+res.data.msg,
                    duration:2000
                  })
                }
              });
            }
          });
        }else if(this.id==0){//修改用户列表数据提交
          this.$refs.formA.validate(valid =>{
            if (valid){
              let params={
                userId:this.formA.userId,
                loginName:this.formA.loginName,
                userName:this.formA.userName,
                password:this.formA.loginPassword,
                status:Number(this.formA.status),
                sex:Number(this.formA.sex),
                email:this.formA.email,
                phone:this.formA.phone,
                remark:this.formA.remark,
                roleId:Number(this.formA.roleName),
                orgId:this.formA.orgId
              };
              userManageUpdateUser(params).then(res=>{
                if(res.data.code==0){
                  this.$message({
                    type: 'success',
                    message: '修改成功!',
                    duration:2000
                  })
                  this.dialogTableVisible=false;
                  this.$emit('userManageList');
                }else {
                  this.$message({
                    type: 'success',
                    message: '修改失败!'+res.data.msg,
                    duration:2000
                  })
                }

              });
            }
          });
        }

      }
    }
  }
</script>

<style scoped>

</style>
