<template>
	<div class="container">
		<el-form :inline="true" :model="form" class="demo-form-inline">
		 	<el-form-item label="" v-if="searchButton">
				 <el-input placeholder="请输入内容" v-model="form.text" class="input-with-select" clearable @keyup.enter.native="search">
				    <el-select v-model="form.select" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
				      	<el-option label="角色代码"   value="1"></el-option>
				      	<el-option label="角色名称"   value="2"></el-option>
				      	<el-option label="创建者账户" value="3"></el-option>
				        <el-option label="创建者姓名" value="4"></el-option>
                <el-option label="所属馆名称" value="5"></el-option>
				    </el-select>
				  </el-input>
			</el-form-item>
			<el-form-item label="">
        <span v-for="(item,index) in power" :key="index">
          <el-button v-if="item.name.trim()=='检索'" type="primary" icon="el-icon-search" @click="search">检索</el-button>
          <el-button v-if="item.name.trim()=='新增'" type="primary" @click="addRole" icon="el-icon-circle-plus-outline">新增</el-button>
          <el-button v-if="item.name.trim()=='删除'" type="primary" :disabled="roleTotalselection.length==0" icon="el-icon-delete" @click="deletSome">批量删除</el-button>
        </span>

			</el-form-item>
		</el-form>

 		<el-table
		    ref="multipleTable"
		    :data="data"
		    tooltip-effect="dark"
        @selection-change="roleTotalChange"
        v-loading="loading"
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
				prop="roleCode"
		      label="角色代码"
		      >
		    </el-table-column>
		    <el-table-column
				prop="roleName"
		      label="角色名称"
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
				prop="libName"
		      label="所属馆名称"
		      >
		    </el-table-column>
		    <el-table-column
				prop="status"
		      label="状态"
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
            <el-button v-if="item.name.trim()=='修改'" type="text" size="small" @click="updateRole(scope.row)">修改</el-button>
            <el-button v-if="item.name.trim()=='删除'" type="text" size="small" :style="{color:'#f56c6c'}" @click="delet(scope.row)">删除</el-button>
          </span>
        </template>
      </el-table-column>
		  </el-table>

		<el-row>
      <el-col :span="24">
        <el-pagination
          :page-sizes="[3, 5, 10, 20]"
          :page-size="form.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="dataPage.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="dataPage.pageNum"
        >
        </el-pagination>
      </el-col>
    </el-row>

    <dia-log ref="diaLog" @roleManageList="roleManageList"></dia-log>
	</div>
</template>

<script>
  import DiaLog from '@/views/systemSetup/RoleMangeDialog'
  import {roleManageList,roleManageDeleteItem} from '@/request/system'
  import {timeFormat,getData} from '@/js/common'
  export default{
  	data(){
  		return {
  			showDia:false,
  			DialogTitle:'运单号:222222',
        loading:false,//表格加载动画显示
        orgTypeList:[],//机构类别列表
  			form:{
  				text:'',
  				select:'2',
  				startTime:'',
          endTime:'',
          pageSize:5,
          pageNum:1
  			},
  			data:[],//角色管理列表数据
        roleTotalselection:[],//表格多选框选择后的数据存放点
        // currentPage:1,
        dataPage:{},
        power:[],//按钮权限数组
        searchButton:false,
  		}
  	},
    components:{
      DiaLog
    },
    watch:{
  	//   //页码改变时-获取角色列表
    //   currentPage(){
    //     this.roleManageList();
    //   },
    //   //每页的数据条数改变时-获取角色列表
    //   pageSize(){
    //     this.roleManageList();
    //   }
    },
    created() {
      this.getPowerArr();
      this.roleManageList();
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
  	  //获取角色列表
  	  roleManageList(){
        let params={
          jsonStr:this.form
        }
        roleManageList(params).then(res=>{
          this.data=res.data.page.list.map(item=>{
            return {
              id:item.id,
              orgTypeA:item.orgType,
              // permList:item.permList.map(item=>{return {permId:item.permId}}),
              roleCode:item.roleCode,
              roleName:item.roleName,
              createAccount:item.createAccount,
              createName:item.createName,
              createTime:timeFormat(item.createTime),
              // orgType:Number(item.orgType)-1>=0?this.orgTypeList[Number(item.orgType)-1].name:this.orgTypeList[0].name,
              libName:item.libName,
              status:item.status?'启用':'禁用',
              remark:item.remark
            }
          });
          this.dataPage=res.data.page;
        });
      },
      roleTotalChange(sels){
        this.roleTotalselection=sels;
      },
     //分页事件
      handleSizeChange(val) {
        this.form.pageSize=val;
        this.roleManageList();
      },
      handleCurrentChange(val) {
        this.form.pageNum=val;
        this.roleManageList();
      },
      //增加角色列表数据
      addRole(){
        this.$refs['diaLog'].visible(1);


      },
      //修改角色列表数据
      updateRole(row){
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
            if(this.data[i].id==row.id){
              let params=[{id:row.id}];
              roleManageDeleteItem(params).then(res=>{
                this.loading=true;
                this.$message({
                  type: 'success',
                  message: '删除成功!',
                  duration:1000
                });
                setTimeout(() => {
                  this.roleManageList();
                  this.loading=false;
                },1500);
              });
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
      //批量删除-角色列表数据
      deletSome(){
        this.$confirm('确认要删除这'+this.roleTotalselection.length+'条数据吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          let params=[];
          for(let val of this.roleTotalselection){
            params.push({id:val.id});
          }
          roleManageDeleteItem(params).then(res=>{
            this.loading=true;
            this.$message({
              type: 'success',
              message: '删除成功!',
              duration:1000
            });
            setTimeout(() => {
              this.roleManageList();
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
      //转换角色管理-查询字符串
      switchSearch(){
  	    switch(Number(this.form.select)){
          case 1:
            return {roleCode:this.form.text,pageSize:5, pageNum:1};
            break;
          case 2:
            return {roleName:this.form.text,pageSize:5, pageNum:1};
            break;
          case 3:
            return {createAccount:this.form.text,pageSize:5, pageNum:1};
            break;
          case 4:
            return {createName:this.form.text,pageSize:5, pageNum:1};
            break;
          case 5:
            return {libName:this.form.text,pageSize:5, pageNum:1};
            break;
        }
      },
      //搜索角色列表
      search(){
        let params={
          jsonStr:this.switchSearch()
        }
        roleManageList(params).then(res=>{
          this.data=res.data.page.list.map(item=>{
            return {
              id:item.id,
              // permList:item.permList.map(item=>{return {permId:item.permId}}),
              roleCode:item.roleCode,
              roleName:item.roleName,
              createAccount:item.createAccount,
              createName:item.createName,
              createTime:timeFormat(item.createTime),
              libName:item.libName,
              status:item.status?'启用':'禁用',
              remark:item.remark
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
