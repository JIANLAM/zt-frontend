<template>
	<div class="container">
		<el-form :inline="true" :model="form" class="demo-form-inline">
		 	<el-form-item label="" v-if="searchButton">
				 <el-input placeholder="请输入内容" v-model="form.text" class="input-with-select" clearable @keyup.enter.native="search">
				    <el-select v-model="form.select" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
				    	<el-option label="登录名" value="1"></el-option>
				      	<el-option label="姓名" value="2"></el-option>
				      	<el-option label="创建者账户" value="4"></el-option>
                <el-option label="创建者姓名" value="5"></el-option>
				    </el-select>
				  </el-input>
			</el-form-item>


		<!--	<el-form-item label="地区区域">
				<cas-cader v-model="form.area"></cas-cader>{{form.area}}
			</el-form-item>-->

			<el-form-item label="">
      <span v-for="(item,index) in power" :key="index">
			  <el-button v-if="item.name.trim()=='检索'" type="primary" icon="el-icon-search" @click="search">检索</el-button>
				<el-button v-if="item.name.trim()=='新增'" type="success" icon="el-icon-circle-plus-outline" @click="addUser">新增</el-button>
			  <el-button v-if="item.name.trim()=='删除'" type="warning" :disabled="roleTotalselection.length==0" icon="iconfont el-icon-delete" @click="deletSome">批量删除</el-button>
      </span>
			</el-form-item>
		</el-form>
 		<el-table
		    ref="multipleTable"
		    :data="data"
		    tooltip-effect="dark"
        v-loading="loading"
        @selection-change="userTotalChange"
		    style="width: 100%"
		   	>
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
		     <el-table-column
		      type="index"
		      width="55">
		    </el-table-column>
		    <el-table-column
				prop="loginName"
		      label="登录名"
		      >
		    </el-table-column>
		    <el-table-column
				prop="userName"
		      label="姓名"
		      >
		    </el-table-column>
		    <el-table-column
				prop="organization"
		      label="所属机构"
		      >
		    </el-table-column>
		    <el-table-column
				prop="roleName"
		      label="所属角色"
		      >
		    </el-table-column>
		    <el-table-column
				prop="createAccount"
		      label="创建者账户"
		      >
		    </el-table-column>
		    <el-table-column
				prop="createName"
		      label="创建者姓名"
		      >
		    </el-table-column>
		    <el-table-column
				prop="createTime"
		      label="创建时间"
		      >
		    </el-table-column>
		    <el-table-column
				prop="enabled"
		      label="是否启用"
		      >
		    </el-table-column>

		    <el-table-column
				prop="remark"
		      label="备注"
		      >
		    </el-table-column>
      <el-table-column
        label="操作"
        align='center'>
        <template slot-scope="scope">
          <span v-for="(item,index) in power" :key="index">
            <el-button v-if="item.name.trim()=='修改'" type="text" size="small" @click="updateUser(scope.row)">修改</el-button>
            <el-button v-if="item.name.trim()=='删除'" type="text" size="small" :style="{color:'#f56c6c'}" @click="delet(scope.row)">删除</el-button>
          </span>
        </template>
      </el-table-column>
		  </el-table>
		<el-row>
  			<el-col :span="24">
		  		<el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
		      :page-sizes="[10, 20, 30, 40]"
		      :page-size="form.pageSize"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="dataPage.total">
		   	 </el-pagination>
   			</el-col>
		</el-row>
    <dia-log ref="diaLog" @userManageList="userManageList"></dia-log>
	</div>
</template>

<script>
import CasCader from '@/components/cascader'
import DiaLog from '@/views/systemSetup/UserManageDialog'
import {userManageList,userManageDeleteItem} from '@/request/system'
import {timeFormat} from '@/js/common'
  export default{
  	components:{
  		CasCader,
      DiaLog
  	},
  	data(){
  		return {
  			showDia:false,
  			DialogTitle:'运单号:222222',
        loading:false,//表格加载动画显示
  			form:{
  				text:'',
  				select:'1',
  				startTime:'',
  				endTime:'',
  				area:'',
          pageNum:1,
          pageSize:5
  			},
        data:[],//角色管理列表数据
        roleTotalselection:[],//表格多选框选择后的数据存放点
        currentPage:1,
        pageSize:10,
        dataPage:[],
        power:[],//按钮权限数组
        searchButton:false,
  		}
  	},
    watch:{
      //页码改变时-获取用户列表
      currentPage(){
        this.userManageList();
      },
      //每页的数据条数改变时-获取用户列表
      pageSize(){
        this.userManageList();
      }
    },
    created() {
      this.getPowerArr();
      //初始化用户列表
      this.userManageList();
    },
  	methods:{
      //得到权限按钮数组
      getPowerArr(){
        let  obj;
        let  power =this.$route.meta.power;
        for(let i=0,len=power.length;i<len;i++){
          if(power[i].name=='检索'){
            this.searchButton=true;
            obj=power[0];
            power[0]=power[i];
            power[i]=obj
          }
        }
        this.power=power;
      },
  	  //获取用户列表
  	  userManageList(){
        let params={
          jsonStr:{pageNum:this.currentPage,pageSize:this.pageSize}
        }
        userManageList(params).then(res=>{
          this.data=res.data.page.list.map(item=>{
            return {
              userId:item.userId,
              roleId:item.roleId,
              orgId:item.orgId,
              loginName:item.loginName,
              userName:item.userName,
              organization:item.organization,
              roleName:item.roleName,
              createAccount:item.createAccount,
              createName:item.createName,
              createTime:timeFormat(item.createTime),
              enabled:item.enabled?'启用':'禁用',
              remark:item.remark,
              loginPassword:'',
              checkloginPassword:'',
              sex:item.sex==1?'男':'女',
              phone:item.phone,
              email:item.email
            }
          });
          this.dataPage=res.data.page
        });
      },
      userTotalChange(sels){
        this.roleTotalselection=sels;
      },
  		showDialog(row){
  			this.showDia=true;
  		},
  		add(){
  			this.showDia=true;
  		},
      //获取每页数据的条数
      handleSizeChange(val) {
        this.pageSize=val;
      },
      //获取第几页
      handleCurrentChange(val) {
        this.currentPage=val;
      },
      //增加用户列表数据
      addUser(){
        this.$refs['diaLog'].visible(1);

      },
      //修改用户列表数据
      updateUser(row){
        this.$refs['diaLog'].visible(0);
        this.$refs['diaLog'].init(row);
      },
      //单个删除
      delet(row){
        this.$confirm('确认要删除这条数据吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          for(let i in this.data){
            if(this.data[i].userId==row.userId){
              let params=[{userId:row.userId}];
              userManageDeleteItem(params).then(res=>{
                this.loading=true;
                this.$message({
                  type: 'success',
                  message: '删除成功!',
                  duration:1000
                });
                setTimeout(() => {
                  this.userManageList();
                  this.loading=false;
                },1500);
              });
              this.roleManageList();
            }
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除!',
            duration:1000
          });
        });
      },
      //批量删除-用户列表数据
      deletSome(){
        this.$confirm('确认要删除这'+this.roleTotalselection.length+'条数据吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          let params=[];
          for(let val of this.roleTotalselection){
            params.push({userId:val.userId});
          }
          userManageDeleteItem(params).then(res=>{
            this.loading=true;
            this.$message({
              type: 'success',
              message: '删除成功!',
              duration:1000
            });
            setTimeout(() => {
              this.userManageList();
              this.loading=false;
            },1500);
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除!',
            duration:1000
          });
        });
      },
      //转换用户管理-查询字符串
      switchSearch(){
        switch(Number(this.form.select)){
          case 1:
            return {loginName:this.form.text,pageSize:5, pageNum:1};
            break;
          case 2:
            return {userName:this.form.text,pageSize:5, pageNum:1};
            break;
          case 3:
            return {roleName:this.form.text,pageSize:5, pageNum:1};
            break;
          case 4:
            return {createAccount:this.form.text,pageSize:5, pageNum:1};
            break;
          case 5:
            return {createName:this.form.text,pageSize:5, pageNum:1};
            break;
        }
      },
      //搜索用户列表
      search(){
        let params={
          jsonStr:this.switchSearch()
        }
        userManageList(params).then(res=>{
          this.data=res.data.page.list.map(item=>{
            return {
              userId:item.userId,
              roleId:item.roleId,
              orgId:item.orgId,
              loginName:item.loginName,
              userName:item.userName,
              organization:item.organization,
              roleName:item.roleName,
              createAccount:item.createAccount,
              createName:item.createName,
              createTime:timeFormat(item.createTime),
              enabled:item.enabled?'启用':'禁用',
              remark:item.remark,
              loginPassword:'',
              checkloginPassword:'',
              sex:item.sex==1?'男':'女',
              phone:item.phone,
              email:item.email
            }
          });
        });
      }
  	}
  }

</script>

<style type="style/css">
	.line{
		text-align: center;
	}
	.time,.msg{
		display: inline-block;
		vertical-align: top
	}
	.time{
		width: 140px;
	}
	.oldAddress{
		color: rgb(228, 78, 78);
		margin-right: 3px;
	}
	.wuliuDataLi{
		margin:10px 0;
		display: flex;
	}
	.msg{
		flex:1;
	}
	.toAddress{
		color:rgb(228, 78, 78);
		margin-left: 3px;
	}
	.borders{
		border:1px dashed #E4E7ED;
		padding: 0 10px;
	}
</style>
