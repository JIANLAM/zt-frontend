<template>
  <el-dialog :title="id==1?'新增':'修改'" :visible.sync="dialogTableVisible" class="collectionParameters collectionParameters1" >
    <el-form ref="form" :model="form" :rules="rules" status-icon label-width="120px" v-if="id==1">
      <el-form-item label="角色代码:" prop="roleCode">
        <el-input v-model="form.roleCode"></el-input>
      </el-form-item>
      <el-form-item label="角色名称:" prop="roleName">
        <el-input v-model="form.roleName"></el-input>
      </el-form-item>
      <el-form-item label="所属成员馆:">
        <el-select v-model="form.orgType" placeholder="所属成员馆">
          <el-option  v-for="(item,index) in orgTypeList" :label="item.name" :value="item.id.toString()" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态:">
        <el-select v-model="form.status" placeholder="状态">
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="权限管理:">
        <div class="manger">
          <div>菜单权限</div>
          <el-tree :data="data2" :show-checkbox="true" node-key="id" :props="defaultProps" ref="tree"></el-tree>
        </div>
        <div class="manger">
          <div>操作权限</div>
          <el-tree :data="data3" show-checkbox node-key="id" :props="defaultProps3" ref="tree3"></el-tree>
        </div>
      </el-form-item>
      <el-form-item label="备注:" prop="remark">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item class="addSure">
        <el-button type="primary" @click="onSubmit" icon="el-icon-plus">新增</el-button>
        <el-button @click="dialogTableVisible=false">取消</el-button>
      </el-form-item>
    </el-form>

    <el-form ref="formA" :model="formA" :rules="rules" status-icon label-width="120px" v-else>
      <el-form-item label="角色代码:" prop="roleCode">
        <el-input v-model="formA.roleCode"></el-input>
      </el-form-item>
      <el-form-item label="角色名称:" prop="roleName">
        <el-input v-model="formA.roleName"></el-input>
      </el-form-item>
      <el-form-item label="所属成员馆:">
        <el-select v-model="formA.orgType" placeholder="所属成员馆">
          <el-option  v-for="(item,index) in orgTypeList" :label="item.name" :value="item.id.toString()" :key="index" @click="getOrgTypeA"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态:">
        <el-select v-model="formA.status" placeholder="状态">
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="权限管理:">
        <div class="manger">
          <div>菜单权限</div>
          <el-tree :data="data2" show-checkbox node-key="id"  :default-checked-keys="checkArr"   :props="defaultProps" ref="tree"></el-tree>
        </div>
        <div class="manger">
          <div>操作权限</div>
          <el-tree :data="data3" show-checkbox node-key="id" :default-checked-keys="checkArr2"  :props="defaultProps3" ref="tree3"></el-tree>
        </div>     </el-form-item>
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
  import {roleManageAddRole,roleManageUpdateRole,roleManageOrgTypeList,permList,roleDetail,forOrgAll} from '@/request/system'
  export default{
    data(){
      return {
        dialogTableVisible:false,//弹框显示与隐藏
        id:'',//显示新增和修改弹框标识
        orgTypeList:[],//所属成员馆
        form:{//新增表单数据
          permList:[],
          roleCode:'',
          roleName:'',
          orgType:'',
          status:'',
          remark:''
        },
        formA:{//修改表单数据
          id:'',
          orgTypeA:'',
          permList:[],
          roleCode:'',
          roleName:'',
          orgType:'',
          status:'1',
          remark:''
        },
        rules:{
          roleCode:[
            { required: true, message: '请输入角色代码!', trigger: 'blur' }
          ],
          roleName:[
            { required: true, message: '请输入角色名称!', trigger: 'blur' }
          ]
        },
        data2:[],
        data3:[],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        defaultProps3: {
          children: 'power',
          label: 'name'
        },
        checkArr:[],
        checkArr2:[],
        permList:[],
        permButtonList:[],
        num:0
      }
    },
    created(){
      forOrgAll().then(res=>{
        this.orgTypeList=this.format(res.data.list);
      });
      permList().then(data=>{
        this.data2=data.data.list;
        this.data3=data.data.list;
        this.treeToArray(this.data3)
        console.log(this.data3)
      })
    },
    methods:{
      //格式化数据
      format(data){
        let arr=[];
        const _this=this;
        Array.from(data).forEach(function(record) {
          arr.push(record)
          if (record.children && record.children.length > 0) {
            const children =_this.format(record.children)
            arr = arr.concat(children)
          }
        })
        return arr
      },
      visible(id){
        this.dialogTableVisible=true;
        this.id=id;
        if(id==1){
          if(this.checkArr&&this.checkArr.length>0){
            this.$refs.tree.setCheckedKeys([]);
          }
          if(this.checkArr2&&this.checkArr2.length>0){
           this.$refs.tree3.setCheckedKeys([]);
          }
          //this.$nextTick(()=>{
          //  this.$refs.form.clearFields();
          //})
          //this.$refs.form.resetFields();
          this.$nextTick(()=>{
            this.$refs.form.clearValidate();
          })
        }
      },
      getOrgTypeA(){
        this.formA.orgTypeA=Number(this.formA.orgType);
      },
      init(row){
        roleDetail({"roleId":row.id}).then(data=>{
          this.checkArr=this.getId2(data.data.list);
          this.$refs.tree.setCheckedKeys(this.checkArr);
          this.checkArr2=this.getId(this.treeToArray(data.data.list));
          this.$refs.tree3.setCheckedKeys(this.checkArr2);
          let role=data.data.role;
          this.formA.id=role.id;
          this.formA.orgTypeA=role.orgTypeA;
          this.formA.permList=role.permList;
          this.formA.roleCode=role.roleCode;
          this.formA.roleName=role.roleName;
          this.formA.createName=role.createName;
          this.formA.createTime=role.createTime;
          this.formA.orgType=role.orgType;
          this.formA.status=role.status.toString();
          this.formA.remark=role.remark;
        })
      },
      onSubmit(){
        // 添加菜单权限
        let permArr=this.$refs.tree.getCheckedNodes();
        this.permList=[];
        for(let i=0,len=permArr.length;i<len;i++){
          let parentParentId=permArr[i].parentParentId?permArr[i].parentParentId:"";
          let parentId=permArr[i].parentId?permArr[i].parentId:"";
          this.permList.push(permArr[i].id,parentParentId,parentId)
        }
        // 添加按钮权限
        let permButtonArr=this.$refs.tree3.getCheckedNodes();
        this.permButtonList=[];
        for(let i=0,len=permButtonArr.length;i<len;i++){
          if(permButtonArr[i].permId&&permButtonArr[i].buttonId){
            this.permButtonList.push({permId:permButtonArr[i].permId,buttonId:permButtonArr[i].buttonId})
          }
        }
        if(this.id==1){
          this.$refs.form.validate(valid =>{//添加角色列表数据提交
            if (valid){
              let permList=[];
              let arr=this.permList;
              for(let i=0,len=arr.length;i<len;i++){
                if(arr[i]!=""){
                  permList.push({'permId':arr[i]})
                }
              }
              let params={
                roleName:this.form.roleName,
                roleCode:this.form.roleCode,
                status:Number(this.form.status),
                orgType:this.form.orgType?Number(this.form.orgType):null,
                remark:this.form.remark,
                permList:permList,
                permButtonList:this.permButtonList
              };
              if(this.form.orgType){
                for(let ind=0;ind<this.orgTypeList.length;ind++){
                  if(this.orgTypeList[ind].id==Number(this.form.orgType)){
                    params.libName=this.orgTypeList[ind].name
                  }
                }
              }
              roleManageAddRole(params).then(res=>{
                this.$emit('roleManageList');
                if(res.data.code==0){
                  this.$message({
                    type: 'success',
                    message:"新增成功！",
                    duration:'2000'
                  });
                  this.dialogTableVisible=false;
                }else{
                  this.$message({
                    type: 'error',
                    message:"新增失败！失败原因："+res.data.msg,
                    duration:'2000'
                  });
                }
              });
            } else {
              this.$message({
                type: 'error',
                message: '提交失败，验证还没通过!',
                duration:2000
              });
              return false;
            }
          });
        }else if(this.id==0){//修改角色列表数据提交
          this.$refs.formA.validate(valid =>{
            if (valid){
              let permList=[];
              let arr=this.permList;
              for(let i=0,len=arr.length;i<len;i++){
                if(arr[i]!=""){
                  permList.push({'permId':arr[i]})
                }
              }
              let params={
                id:this.formA.id,
                roleName:this.formA.roleName,
                roleCode:this.formA.roleCode,
                status:this.formA.status,
                orgType:this.formA.orgType,
                remark:this.formA.remark,
                permList:permList,//如果更改了，再做判断
                roleId:this.formA.id,
                permButtonList:this.permButtonList
              };
              if(this.formA.orgType){
                for(let ind=0;ind<this.orgTypeList.length;ind++){
                  if(this.orgTypeList[ind].id==Number(this.formA.orgType)){
                    params.libName=this.orgTypeList[ind].name
                  }
                }
              }
              roleManageUpdateRole(params).then(res=>{
                this.$emit('roleManageList');
                if(res.data.code==0){
                  this.$message({
                    type: 'success',
                    message:"修改成功！",
                    duration:'2000'
                  });
                  this.dialogTableVisible=false;
                }else{
                  this.$message({
                    type: 'error',
                    message:"修改失败！失败原因："+res.data.msg,
                    duration:'2000'
                  });
                }
              });
            } else {
              this.$message({
                type: 'error',
                message: '提交失败，验证还没通过!',
                duration:2000
              });
              return false;
            }
          });
        }
      },
      treeToArray(data) {
        let tmp = [];
        const _this=this;
        Array.from(data).forEach(function(record) {
          if(record.children.length>0){
            record.power=record.children
          }else {
            for(let i=0,len=record.power.length;i<len;i++){
              if(record.power[i].permId&&record.power[i].buttonId){
                record.power[i].id=record.power[i].permId+"_"+record.power[i].buttonId
              }
            }
          }
          tmp.push(record)
          if (record.children && record.children.length > 0) {
            const children =_this.treeToArray(record.children)
            tmp = tmp.concat(children)
          }
        })
        return tmp
      },
      getId(data) {
        console.log(data)
        let tmp2 = [];
        const _this=this;
        Array.from(data).forEach(function(record) {
          if(record.children.length==0){
            for(let i=0,len=record.power.length;i<len;i++){
              tmp2.push(record.power[i].id)
            }
          }
          if (record.children && record.children.length > 0) {
            const children =_this.getId(record.children)
            tmp2 = tmp2.concat(children)
          }
        })
        console.log(tmp2)
        return tmp2
      },
      getId2(data) {
        let tmp = [];
        const _this=this;
        Array.from(data).forEach(function(record) {
          if(record.children.length==0){
            tmp.push(record.id);
          }
          if (record.children) {
            const children =_this.getId2(record.children)
            tmp = tmp.concat(children)
          }
        })
        return tmp
      }
    }
  }
</script>
<style scoped>
.manger{float: left;width: 50%;height:300px;overflow: auto}
.manger:nth-child(1){border-right: 1px dotted #ccc;width: 42%;margin-right: 7%}
</style>
