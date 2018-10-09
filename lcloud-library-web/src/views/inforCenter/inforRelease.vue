<template>
	<div class="container">
		<el-form :inline="true" :model="searchData" class="demo-form-inline">
      <span v-if="searchButton">
        <el-form-item label="">
           <el-input placeholder="请输入内容" v-model="searchData.value" class="input-with-select" clearable v-on:keyup.enter.native="search">
              <el-select v-model="searchData.key" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
                <el-option label="标题" value="title"></el-option>
                <el-option label="内容" value="content"></el-option>
              </el-select>
            </el-input>
        </el-form-item>
        <el-form-item label="发送时间">
            <el-date-picker
              v-model="picker"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00']"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="状态">
            <el-select v-model="searchData.status" placeholder="审核状态">
               <el-option label="所有" value=""></el-option>
              <el-option label="草稿" value="0"></el-option>
              <el-option label="已发布" value="1"></el-option>
            </el-select>
        </el-form-item>
      </span>
			<el-form-item label="">
      <span v-for="(item,index) in power" :key="index">
			  <el-button  v-if="item.name.trim()=='检索'" type="primary" icon="el-icon-search" @click="search">检索</el-button>
			  <el-button v-if="item.name.trim()=='新增'" type="success" icon="el-icon-circle-plus-outline" @click="add">发布信息</el-button>
      </span>

			</el-form-item>
		</el-form>

 		<el-table
		    ref="multipleTable"
		    :data="data"
		    tooltip-effect="dark"
		    style="width: 100%"
		    v-loading="loading"
		   	>
		   	 <el-table-column
				 type="selection"
				 width="55"
		      >
		    </el-table-column>
		     <el-table-column
		      type="index"
		      width="55"
		      align="center"
		       :index="indexMethod">
		    </el-table-column>
		    <el-table-column
				prop="title"
		      label="标题"
		      show-overflow-tooltip
		      >
		    </el-table-column>

		    <el-table-column
				prop="userName"
		      label="发送者姓名"
		      >
		    </el-table-column>
		    <el-table-column
				prop="createTime"
		      label="发送时间"
		      >
		    </el-table-column>
		    <el-table-column
		      label="状态"
		      >
		      <template slot-scope="scope">
		      		<el-tag type="success" v-if="scope.row.status==1">已发布</el-tag>
		      		<el-tag type="danger" v-if="scope.row.status==0">草稿</el-tag>
		      </template>
		    </el-table-column>
		     <el-table-column
		      label="操作"
		      align="center"
		      >
		      	<template slot-scope="scope">
				  <el-button type="text" size="mini" @click="look(scope.row)">查看内容</el-button>
              <span v-for="(item,index) in power" :key="index">
                  <el-button  type="text" size="mini" v-if="scope.row.status==0&&item.name.trim()=='新增'" style="color:#67c23a;" @click="sendNoticeSend(scope.row)">发布</el-button>
                  <el-button  type="text" size="mini" v-if="scope.row.status==0&&item.name.trim()=='修改'" style="color:#f56c6c;" @click="updateNotice(scope.row)">修改</el-button>
                  <el-button v-if="item.name.trim()=='删除'" type="text" size="mini" @click="deleteNotices(scope.row)">删除</el-button>
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

		<dia-log :visible.sync="visible" :title="dialogTitle">
			<el-form ref="form" :model="dialogForm" :rules="rules" label-width="80px">
				<el-form-item label="通知类型" >
				   <el-select v-model="dialogForm.type" placeholder="请选择通知类型">
				      <el-option label="借还通知" value="0"></el-option>
				      <el-option label="指示性通知" value="1"></el-option>
				   </el-select>
				</el-form-item>
				<el-form-item label="标题" prop="title">
				 	<el-input v-model="dialogForm.title"></el-input>
				</el-form-item>
				<el-form-item label="接收人" prop="userIds">
				 	<el-tree
				 	    ref="tree"
			    	 	accordion
					    :props="props"
					    :data="datas"
					    node-key="id"
					    @check="treeCheck"
					    show-checkbox
					    style="maxHeight:300px;overflow:auto;"
					 >
					 	 <span class="custom-tree-node" slot-scope="{ node, data }">
							 <span><i class="iconfont" :class="node.icon" style="marginRight:5px;fontSize:22px;"  :style="{color:data.sex==1?'#010106':'#de4d66'}" ></i>{{node.label}}</span>
						</span>
					</el-tree>
				</el-form-item>
				<el-form-item label="通知内容" prop="content">
				    <el-input type="textarea" v-model="dialogForm.content"></el-input>
				  </el-form-item>
			</el-form>

			<div slot="footers" class="dialog-footer">
			    <el-button @click="visible = false">取 消</el-button>
			    <el-button type="primary" @click="saveDraft">存为草稿</el-button>
			    <el-button type="success" @click="release">直接发布</el-button>
			</div>
		</dia-log>
	</div>
</template>

<script>
import DiaLog from '@/components/Dialog'
import { getData } from '@/methods/method'
import { userManageList } from '@/request/system'
import { sendNotice,saveNotice,deleteNotice,sendNoticeSend,noticeDetail} from '@/request/inforCenter'
  export default{
  	components:{
  		DiaLog
  	},
  	data(){
  		return {
  			dialogTitle:"",
  			loading:false,
  			visible:false,
  			isWuliu:false,
  			bookList:[],
  			picker:[],//时间选择器
  			searchData:{
  				key:'title',
  				value:'',
  				status:'',
  				startTime:'',
  				endTime:''
  			},
  			form:{
  				status:'',
  				startTime:'',
  				endTime:'',
  				timeKey:"creatTime",
  				orderCodeHave:1,
  				pageNum:1,
  				pageSize:5
  			},
  			dialogForm:{
  				type:"0",
  				title:'',
  				content:'',
  				userIds:[]
  			},
  			data:[],
  			datas:[],
  			dataPage:{},
  			props:{
  				children: 'children',
          		label: 'label'
  			},
  			rules:{
	          title: [
	            { trigger: 'blur',required: true,message: '标题必填!'},
	             { max:20, message: '长度在20个字符以内!', trigger: 'blur' }
	          ],
	          userIds: [
	            { trigger: 'blur',required: true,message: '接收人必填!'},
	          ],
	          content: [
	            { trigger: 'blur',required: true,message: '内容必填!'},
	          ]
	        },
        power:[],//按钮权限数组
        searchButton:false
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
  		indexMethod(index){
  			return this.dataPage.startRow+index
  		},
  		getData(){
  			getData.call(this,sendNotice,this.form);
  		},
  		//订购单分页事件
  		handleSizeChange(val) {
  			this.form.pageSize=val;
  			this.getData();
	    },
	    handleCurrentChange(val) {
	    	this.form.pageNum=val;
	        this.getData();
	    },
	    search(){
			 this.form={
  				status:this.searchData.status,
  				startTime:this.searchData.startTime,
  				endTime:this.searchData.endTime,
  				timeKey:"creatTime",
  				orderCodeHave:1,
  				pageNum:1,
  				pageSize:5
  			},
			this.$set(this.form,this.searchData.key,this.searchData.value);
  			this.getData(JSON.stringify(this.form));
  		},
  		showDingd(row){
  			this.showDia=true;
  			this.isWuliu=false;
  			this.bookList=row.bookList;
  		},
  		showWuliu(){
  			this.showDia=true;
  			this.isWuliu=true;

  		},
  		//发布信息
  		add(){
  			this.dialogForm={
  				type:"0",
  				title:'',
  				content:'',
  				userIds:[]
  			}

  			this.dialogTitle="发布信息";
  			this.visible=true;

  			this.userManageList();

  			this.$nextTick(function(){
				 this.$refs.tree.setCheckedKeys([]);
			})
  		},
  		userManageList(){
  			userManageList().then(data=>{
	  			if(data.data.code==0){
	  				console.log(data);
	  				this.datas=this.format(data.data.page.list);
	  			}else{
	  				this.$message({
	  					type:"error",
	  					message:"获取上级机构数据异常!"
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
  					label:item.userName,
  					id:item.userId,
  					sex:item.sex,
  					icon:""
  				}
  				if(level==1){
  					if(item.sex==1){
  						obj.icon="icon-nansheng"
  					}else{
  						obj.icon="icon-nv"
  					}

  				}
  				if(item.children&&item.children.length>0){
  					obj.children=this.format(item.children,level);
  				}
  				arr.push(obj);
  			}
  			return arr
  		},
  		//直接发布
  		release(){
  			this.$refs.form.validate((valid) => {
		          if (valid) {
		          	let obj=Object.assign({},{
		          		status:1
		          	},this.dialogForm)
		           	this.saveNotice(obj).then(res=>{
		           		this.getData();
		           		this.visible=false;

		           		this.$message({
		  					type:"success",
		  					message:"发布成功!"
	  					})
		           	}).catch(err=>{
		           		this.$message({
		  					type:"error",
		  					message:"发布失败!"+err
	  					})
		           	});
		          } else {
		            return false;
		          }
		        });
  		},
  		//存为草稿
  		saveDraft(){
  			this.$refs.form.validate((valid) => {
		          if (valid) {
		          	let obj=Object.assign({},{
		          		status:0
		          	},this.dialogForm)
		           	this.saveNotice(obj).then(res=>{
		           		this.getData();
		           		this.visible=false;


		           		this.$message({
		  					type:"success",
		  					message:"已为你存为草稿!"
	  					})
		           	}).catch(err=>{
		           		this.$message({
		  					type:"error",
		  					message:"保存失败!"+err
	  					})
		           	});
		          } else {
		            return false;
		          }
		        });
  		},
  		saveNotice(obj){
  			return new Promise((resolve,reject)=>{
	  			saveNotice(obj).then(data=>{
	  				if(data.data.code==0){
	  					resolve();
	  				}else{
	  					reject(data.data.msg);
	  				}
	  			}).catch(err=>{
	  				reject();
	  			})
  			})
  		},
  		//用户树形数据多选框点击事件
  		treeCheck(checkedNodes,checkedKeys){
  			this.dialogForm.userIds=checkedKeys.checkedKeys;
  		},
  		//删除事件
  		deleteNotices(row){
  			console.log(row)
  			 this.$confirm(row.status==0?'是否删除此草稿?':'该信息为已发布状态，是否删除?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          	this.deleteNotice(row.id)
		        }).catch(() => {});
  		},
  		//调取后台删除数据
  		deleteNotice(id){
  			deleteNotice(id).then(data=>{
  				if(data.data.code==0){
  					this.getData();
  					this.$message({
			            type: 'success',
			            message: '删除成功!'
		         	 });
  				}else{
  					this.$message({
			            type: 'error',
			            message: '删除失败!'+data.data.msg
		         	 });
  				}
  			 })
  		},
  		//发布信息
  		sendNoticeSend(row){
  			sendNoticeSend(row.id).then(data=>{
  				if(data.data.code==0){
  					this.getData();
  					this.$message({
			            type: 'success',
			            message: '发布成功!'
		         	 });
  				}else{
  					this.$message({
			            type: 'error',
			            message: '发布失败!'+data.data.msg
		         	 });
  				}
  			})
  		},
  		//修改信息
  		updateNotice(row){
        noticeDetail(row.id).then(data=>{
          if(data.data.code==0){
            let userIds=[];
            for(let i=0,len=data.data.users.length;i<len;i++){
              userIds.push(data.data.users[i].userId)
            }
            let type=row.type==0?"0":"1";
            this.dialogForm={
              type:type,
              title:row.title,
              content:row.content,
              userIds:userIds,
              id:row.id
            }
            this.userManageList();
            this.visible=true;
            this.$nextTick(function(){
              console.log(this.$refs.tree);
              this.$refs.tree.setCheckedKeys(userIds);
            })
          }else{
            this.$message({
              type: 'error',
              message: '获取信息详情失败!失败原因：'+data.data.msg
            });
          }
        }).catch(err=>{
          this.$message({
            type: 'error',
            message: '获取信息详情失败!失败原因：'+err.data.msg
          });
        })
		  },
		  // 查看详情
			look(row){
         this.$alert(row.content, '通知详情', {
          confirmButtonText: '确定',

        });
			}
  	},
  	watch:{
  		picker(newVal){
  			if(newVal&&newVal.length>0){
	  			this.searchData.startTime=newVal[0];
	  			this.searchData.endTime=newVal[1];
  			}else{
  				this.searchData.startTime='';
  				this.searchData.endTime='';
  			}
  		}
  	}
  }

</script>

<style type="style/css">
	.line{
		text-align: center;
	}
</style>
