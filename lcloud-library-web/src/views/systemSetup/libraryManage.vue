<template>
	<div>
		<el-form :inline="true" :model="searchForm" class="demo-form-inline">
		 	<el-form-item label="" v-if="searchButton">
				 <el-input placeholder="请输入内容" v-model="searchForm.searchValue" class="input-with-select" clearable @keyup.enter.native="search">
				    <el-select v-model="searchForm.searchKey" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
				    	<el-option label="馆名称" value="name"></el-option>
				      	<el-option label="馆代码" value="code"></el-option>
				      	<el-option label="联系人" value="linkmanName"></el-option>
				    </el-select>
				  </el-input>
			</el-form-item>
			<!-- <el-form-item label="地区区域">
				<cas-cader v-model="searchForm.area"></cas-cader>
			</el-form-item> -->
			<el-form-item label="" v-if="searchButton">
			  <el-button type="primary" icon="el-icon-search" @click="search">检索</el-button>
			  <el-button type="success" icon="el-icon-circle-plus-outline" @click="addNode">添加一级馆</el-button>
			</el-form-item>
		</el-form>

		<tree-table :columns="columns" :data="data">
			<el-table-column label="操作">
				<template slot-scope="scope">
          <span v-for="(item,index) in power" :key="index">
            <el-button v-if="item.name.trim()=='修改'" type="text" @click="update(scope.row)">修改</el-button>
            <el-button v-if="item.name.trim()=='删除'" type="text" @click="deleteNode(scope.row)">删除</el-button>
            <el-button v-if="item.name.trim()=='添加下级馆'" type="text" @click="addNext(scope.row)">添加下级馆</el-button>
          </span>
				 </template>
			</el-table-column>
		</tree-table>

		<dia-log :visible.sync="visible" :title="dialogTitle" class="collectionParameters" width="700px">
			<el-form ref="form" :model="updateData" :rules="rules" label-width="100px" v-if="!isAdd">

				<el-form-item label="上级馆">
					<span>{{updateData.parentName}}</span><i class="el-icon-caret-bottom" style="fontSize:18px;color:#67c23a;cursor:pointer;" @click="showTree"></i>
			    	<el-tree
			    		@node-click="nodeClick"
			    	 	accordion
					  :props="props"
					  :data="datas"
					  style="maxHeight:300px;overflow:auto;"
					  v-if="treeShow"
					 >
						 <span class="custom-tree-node" slot-scope="{ node, data }">
							 <span><i class="iconfont" :class="node.icon" style="marginRight:5px;color:#e68e1c;"></i>{{ node.label }}</span>
						</span>
					</el-tree>
			    </el-form-item>

				<el-form-item label="馆名称"  prop="name">
			    	 <el-input v-model="updateData.name"></el-input>
			    </el-form-item>
			     <el-form-item label="馆代码"  prop="code">
				    <el-input v-model="updateData.code"></el-input>
				</el-form-item>
			    <el-form-item label="联系人"  prop="linkmanName">
				    <el-input v-model="updateData.linkmanName"></el-input>
				</el-form-item>
				<el-form-item label="联系人号码"  prop="linkmanPhone">
					<el-input v-model="updateData.linkmanPhone"></el-input>
				</el-form-item>
				<el-form-item label="所属地"  prop="city2">
  				  <cas-cader v-model="city2" style="width: 100%"></cas-cader>
 				</el-form-item>
				 <el-form-item label="性别:">
                 <el-select v-model="updateData.sex" placeholder="请选择性别" style="width: 100%">
                    <el-option label="男" :value="value0"></el-option>
                    <el-option label="女" :value="value1"></el-option>
                   </el-select>
                </el-form-item>
			</el-form>
			<div v-else>
				<el-alert
			   		 title="这里只能添加新的馆，如果想在已有的馆下添加，请选中馆点击右边添加下级馆!"
			   		 type="warning"
			    	close-text="知道了" v-if="!isaddNext">
			 	 </el-alert>

				<el-form ref="forms" :model="addForm" :rules="rules" status-icon label-width="100px" style="marginTop:10px;">
					<el-form-item label="馆名称" prop="name">
				    	 <el-input v-model="addForm.name"></el-input>
				    </el-form-item>
				     <el-form-item label="馆代码" prop="code">
					    <el-input v-model="addForm.code"></el-input>
					</el-form-item>
				    <el-form-item label="联系人" prop="linkmanName">
					    <el-input v-model="addForm.linkmanName"></el-input>
					</el-form-item>
					<el-form-item label="手机号码" prop="linkmanPhone">
						<el-input v-model="addForm.linkmanPhone"></el-input>
					</el-form-item>
          <el-form-item label="所属地" prop="city">
            <cas-cader v-model="city" style="width: 100%"></cas-cader>
          </el-form-item>
						 <el-form-item label="性别:">
                    <el-select v-model="addForm.sex" placeholder="请选择性别" style="width: 100%">
                     <el-option label="男" :value="value0"></el-option>
                     <el-option label="女" :value="value1"></el-option>
                   </el-select>
                </el-form-item>

				</el-form>
			</div>
			 <div class="addSure">
          <el-button type="primary" @click="save">保存</el-button>
			    <el-button @click="visible = false">取 消</el-button>
			  </div>
		</dia-log>
	</div>
</template>

<script>
import CasCader from '@/components/cascader'
import treeTable from '@/components/treeTable'
import DiaLog from '@/components/Dialog'
import { forOrgAll,orgSave,orgDelete} from '@/request/system'
  export default{
  	components:{
  		CasCader,
  		treeTable,
  		DiaLog
  	},
  	data(){
  		var linkmanName=(rule, value, callback)=>{
  			if (value === '') {
	          callback(new Error('请输入联系人!'));
		    } else {

		          if (/^[\u4e00-\u9fa5]+$/.test(value)) {
		             callback();
		          }else{
		          	 callback(new Error('联系人只能输入中文汉字!'));
		          }

		    }
  		}
  		var linkmanPhone=(rule, value, callback)=>{
  			if (value === '') {
	          callback(new Error('请输入手机号!'));
		    } else {

		          if (/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(value)) {
		             callback();
		          }else{
		          	 callback(new Error('手机号码格式有误!'));
		          }

		    }
  		}
  		return {
  			isaddNext:false,
  			isAdd:false,
  			parent:'',
  			dialogTitle:'',
  			treeShow:false,
  			props:{
  				children: 'children',
          		label: 'label'
  			},
  			datas:[],
  			visible:false,
  			updateData:{},
  			searchForm:{
  				// area:[],
  				searchKey:'name',
  				searchValue:''
  			},

  			addForm:{
  				name:"",
  				linkmanName:"",
  				linkmanPhone:"",
  				city:"",
				  code:"",
				  sex:''
  			},
        city:[],
        city2:[],
  			rules:{
	          name: [
	            {trigger: 'blur',required: true,message: '馆名称必填!'},
	            { max:10, message: '长度在10个字符以内!', trigger: 'blur' }
	          ],
	          linkmanName: [
	            { trigger: 'blur',required: true,message: '联系人姓名必填!'},
	             { max:6, message: '长度在6个汉字以内!', trigger: 'blur' },
	             { validator: linkmanName, trigger: 'blur' }
	          ],
	          linkmanPhone: [
	            { vtrigger: 'blur',required: true,message: '联系人手机号必填!'},
	            { validator: linkmanPhone, trigger: 'blur' }
	          ],
	          city: [
	          ],
	          code:[
	          	 {trigger: 'blur',required: true,message: '馆代码必填!'},
	          ]
	        },
  			columns: [
		        {
		          text: '馆名称',
		          value: 'name',
				},
				{
		          text: '馆代码',
		          value: 'code',
		        },
		        {
		          text: '联系人',
		          value: 'linkmanName'
		        },
		        {
		          text: '联系人号码',
		          value: 'linkmanPhone'
		        },
		        {
		          text: '所属地',
		          value: 'city'
		        }
	      	],
	        data:[],
          power:[],//按钮权限数组
          searchButton:false,
          value0:1,
          value1:0
  		}
  	},
  	created(){
      this.getPowerArr();
  		this.getData();
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
  		getData(obj){
        forOrgAll(obj).then(data=>{
	  			if(data.data.code==0){
	  				this.data=data.data.list;
	  			}
  			})
  		},
  		search(){
  			let obj={}
  			obj[this.searchForm.searchKey]=this.searchForm.searchValue;
  			this.getData(obj);
  		},
  		//修改馆
  		update(row){
  		this.city2=[];
  			this.dialogTitle="修改'"+row.name+"'馆";
        if(row.city!=""){
          this.city2=row.city.split(",")
        }

  			this.updateData=row;
  			this.isAdd=false;
  			this.treeShow=false;
  			this.visible=true;
  			if(this.updateData.parent){
  				this.$set(this.updateData,'parentName',this.updateData.parent.name);
  				// this.parent=row.parent.name;
  			}else{
  				this.$set(this.updateData,'parentName','无')
  			}
  			this.$set(this.updateData,'newParentId','');
  			this.$set(this.updateData,'newParentIds','');

  		},
  		//显示树形选择
  		showTree(){
  			this.treeShow=true;
        forOrgAll().then(data=>{
	  			if(data.data.code==0){
	  				this.datas=this.format(data.data.list);
	  			}else{
	  				this.$message({
	  					type:"error",
	  					message:"获取上级馆数据异常!"
	  				})
	  			}
  			})
  		},
  		//格式化数据
  		format(data,level=0){
  			level++;
  			let arr=[];
  			for(let item of data){
  				let obj={
  					label:item.name,
  					id:item.id,
  					parentIds:item.parentIds,
  					icon:""
  				}
  				if(level==1){
  					obj.icon="icon-jigou"
  				}else if(level==2){
  					obj.icon="icon-wenjian"
  				}else{
  					obj.icon="icon-wenjian1"
  				}
  				if(item.children&&item.children.length>0){
  					obj.children=this.format(item.children,level);
  				}
  				arr.push(obj);
  			}
  			return arr
  		},
  		nodeClick(row){
  			this.updateData.parentName=row.label;
  			this.updateData.newParentId=row.id;
  			this.updateData.newParentIds=row.parentIds;
  		},
  		//删除
  		deleteNode(row){
  			if(row.children&&row.children.length>0){
  				this.$confirm("'"+row.name+"'有子馆，删除子馆也会被删除，是否继续?", '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning'
			        }).then(() => {
			        	this.orgDelete(row.id);
			        }).catch(() => {

			        });
  			}else{
  				this.$confirm("是否删除'"+row.name+"'?", '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	 this.orgDelete(row.id);
		        }).catch(() => {

		        });
  			}
  		},
  		//请求后台删除数据
  		orgDelete(id){
  			orgDelete(id).then(data=>{
  				if(data.data.code==0){
  					this.getData();
  					this.$message({
			            type: 'success',
			            message: '删除成功!'
			          });
  				}else{
  					this.$message({
			            type: 'error',
			            message: data.data.msg
			          });
  				}
  			})
  		},
  		//添加馆
  		addNode(){
  			this.dialogTitle="添加馆";
  			this.isAdd=true;
  			this.isaddNext=false;
  			this.visible=true;
  			this.addForm={
  				name:"",
  				linkmanName:"",
  				linkmanPhone:"",
  				city:[],
  				code:""
  			}
  			this.city =[] ;
  			this.$nextTick(function(){
  				this.$refs.forms.clearValidate();
  			})
  		},
  		//修改保存和添加保存共用一个方法
  		save(){
  			if(this.isAdd){

  				this.$refs.forms.validate((valid) => {
		          if (valid) {
		          	let obj=Object.assign({},{
		          		type:2
		          	},this.addForm)
                obj.city=this.city.join(",");
		          	console.log(this.city)
		           	orgSave(obj).then(res=>{
                  if(res.data.code==0){
                    this.$message({
                      type: 'success',
                      message: this.addForm.name+'添加成功!'
                    });
                    this.visible=false;
                    this.getData();
                  }else{
                    this.$message({
                      type: 'error',
                      message: res.data.msg
                    });
                  }
		           	}).catch(err=>{
                  this.$message({
                    type: 'error',
                    message: err.data.msg
                  });
                });
		          }
		        });
  			}else{
  				this.$refs.form.validate((valid) => {
		          if (valid) {
		          	let Id,Ids;
		          	if(this.updateData.newParentId==""&&this.updateData.newParentIds==""){
		          		Id=this.updateData.parentId;
		          		Ids=this.updateData.parentIds;
		          	}else{
		          		Id=this.updateData.newParentId;
		          		Ids=this.updateData.newParentIds+this.updateData.newParentId+",";
		          	}
		          	let obj={
		          		id:this.updateData.id,
		          		parentId:Id,
		          		parentIds:Ids,
		          		linkmanName:this.updateData.linkmanName,
		          		linkmanPhone:this.updateData.linkmanPhone,
		          		code:this.updateData.code,
		          		name:this.updateData.name,
		          		city:this.city2.join(","),
		          		type:2,
                  sex:this.updateData.sex
		          	}
		          	orgSave(obj).then(res=>{
                  if(res.data.code==0){
                    this.$message({
                      type: 'success',
                      message: this.addForm.name+'修改成功!'
                    });
                    this.visible=false;
                    this.getData();
                  }else{
                    this.$message({
                      type: 'error',
                      message: res.data.msg
                    });
                  }
		           	}).catch(err=>{
                  this.$message({
                    type: 'error',
                    message: err.data.msg
                  });
                });
		          }
		        });
  			}
  		},
  		// orgSave(obj){
  		// 	return new Promise((resolve,reject)=>{
	  	// 		orgSave(obj).then(data=>{
	       //      	if(data.data.code==0){
	       //      		this.visible=false;
	       //      		this.getData();
	       //      		resolve();
	       //      	}else{
	       //      		reject();
	       //      		this.$message({
			// 	            type: 'error',
			// 	            message: data.data.msg
			// 	          });
	       //      	}
	       //      }).catch(err=>{
	       //      	reject();
	       //      })
           //  })
  		// },
  		//添加下级馆
  		addNext(row){
  			this.dialogTitle="添加'"+row.name+"'下级馆";
  			this.isaddNext=true;
  			this.isAdd=true;
  			this.addForm={
  				name:"",
  				linkmanName:"",
  				linkmanPhone:"",
  				city:"",
  				code:"",
  				parentId:row.id,
  				parentIds:row.parentIds+row.id+","
  			}
  			this.visible=true;
  			this.$nextTick(function(){
  				this.$refs.forms.clearValidate();

  			})
  		},

  	},
    watch:{
  	  city(newValue){
  	    console.log(newValue)
      }
    }
  }

</script>

