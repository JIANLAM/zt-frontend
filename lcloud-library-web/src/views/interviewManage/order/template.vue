<template>
	<div class="container">
		<el-form :inline="true" :model="form" class="demo-form-inline">
		 		<el-form-item label="">
				 <el-input placeholder="请输入内容" v-model="form.searchValue" class="input-with-select" @keyup.enter.native="searchData" clearable>
				    <el-select v-model="form.searchKey" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
				      	<el-option label="模板名称" value="title"></el-option>
				      	<el-option label="创建者账号" value="creatorName"></el-option>			
				        <el-option label="创建者姓名" value="author"></el-option>
				    </el-select>	  
				  </el-input>
			</el-form-item>	
			 <el-button type="primary" icon="el-icon-search" @click="searchData">检索</el-button>
			 <el-button type="success" icon="el-icon-circle-plus-outline" @click="addTemplate">新增模板</el-button>
		</el-form>

 		<el-table
		    :data="data"
		    tooltip-effect="dark"
		    style="width: 100%"
		    @selection-change="selectChange"
		     v-loading="loading"
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
				prop="title"
		      label="模板名称"
		      >
		    </el-table-column>
		    
		    <el-table-column
				prop="isbn"
		      label="创建者账号"
		      >
		    </el-table-column>
		    <el-table-column
				prop="author"
		      label="创建者姓名"
		      >
		    </el-table-column>
		    <el-table-column
				prop="bookType"
		      label="创建时间"
		      >
		    </el-table-column>
		    <el-table-column
				prop="publisher"
		      label="默认模板"
		      >
		    </el-table-column>
		  
		    <el-table-column
				prop="pubdate"
		      label="备注"
		      >
		    </el-table-column>
		   
		     <el-table-column
		      label="操作"
		      >
		      	<template slot-scope="scope">			   
				  <el-button type="text" size="mini">修改</el-button>
				  <el-button type="text" size="mini" :style="{color:'#f56c6c'}">删除</el-button>
				  <el-button type="text" size="mini" :style="{color:'#f56c6c'}">设为默认</el-button>
			   </template>
		    </el-table-column>
		   
		  </el-table>

		
		<el-row>
  			<el-col :span="24">
		  		 <el-pagination
			      :page-sizes="[3, 5, 10, 20]"
			      :page-size="searchDataForm.pageSize"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="dataPage.total"
			       @size-change="handleSizeChange"
	              @current-change="handleCurrentChange"
	              :current-page="dataPage.pageNum">
			   	 </el-pagination>
   			</el-col>
		</el-row>
		
		<dia-log :visible.sync="visible" :title="dialogTitle" width="500px" top="15vh">
			<el-table
		    ref="multipleTable"
		    :data="addData"
		    tooltip-effect="dark"
		    style="width: 100%"
		    empty-text="点击下方添加字段"
		   	>
		     <el-table-column
		      type="index"
		      width="55">
		    </el-table-column>
		    <el-table-column
		      label="数据库字段名"
		      >
		      <template slot-scope="scope">
		      		<el-select v-model="scope.row.name" placeholder="请选择">
					    <el-option
					      label="下拉"
					      value="1">
					    </el-option>
					    <el-option
					      label="下拉1"
					      value="11">
					    </el-option>
					    <el-option
					      label="下拉2"
					      value="222">
					    </el-option>
					    <el-option
					      label="下拉3"
					      value="333">
					    </el-option>
					    <el-option
					      label="下拉4"
					      value="444">
					    </el-option>
					  </el-select>
		      </template>
		    </el-table-column>
		     
		     <el-table-column
		      label="操作"
		      width="60"
		      >
		      	<template slot-scope="scope">			         			 
				  <el-button type="text" size="mini" :style="{color:'#f56c6c'}" @click="deleteLine(scope)">删除</el-button>	
			   </template>
		    </el-table-column>
		    <el-table-column
		      label=""
		      align="center"
		       width="60"
		      >
		      	<template slot-scope="scope">
					<i class="el-icon-rank" v-if="addData.length>1"></i>
			   </template>
		    </el-table-column>
		  </el-table>
	
		  <div style="text-align:center;fontSize:18px;margin-top:10px;" v-if="addData.length<10">
		  	<el-button type="danger" icon="el-icon-plus" circle @click="addLine"></el-button>
		 	 <!-- <i class="el-icon-plus" @click="addLine"></i> -->

		  </div>

			<div slot="footers" class="dialog-footer">
			    <el-button @click="visible = false">取 消</el-button>
			    <el-button type="primary" @click="visible = false">保存</el-button>
		    </div>
		</dia-log>
	
	</div>
</template>

<script>
import { recommbuyList } from '@/request/order'
import { getData } from '@/methods/method'
import DiaLog from '@/components/Dialog'
import Sortable from 'sortablejs'
  export default{
  	components:{
  		DiaLog
  	},
  	data(){
  		return {
  			visible:false,
  			dialogTitle:'新增模板',
  			allSelect:true,
  			loading:false,
  			form:{
  				searchKey:'title',
  				searchValue:'',
  				startTime:'',	
  				endTime:''	
  			},
  			searchDataForm:{
  				searchKey:'',
  				searchValue:'',
  				pageNum:1,
  				pageSize:5,
  				timeKey:'creatTime',
  				startTime:'',
  				endTime:''
  			},
  			data:[{
  				title:'导入模板一',
  				isbn:'1',
  				author:1,
  				bookType:1,
  				pubdate:1

  			}],
  			dataPage:{},
  			addData:[],
  			sortableData:[],
  			sortable:''
  		}
  	},
  	created(){
  		// getData.call(this,recommbuyList,this.searchDataForm);
  	},
  	methods:{		
  		//新增模板
		addTemplate(){
			this.visible=true;
			const this_=this;
			this.$nextTick(function(){
				let el=document.querySelectorAll('.el-dialog__body .el-table__body-wrapper > table > tbody')[0];
				 this.sortable = Sortable.create(el,{
					setData: function(dataTransfer) {//清除火狐在拖动结束后自动打开一个页面的问题
			          dataTransfer.setData('Text', '')
			        },
			        onUpdate:function(evt){
			        	this_.$nextTick(function(){
							this_.$refs.multipleTable.doLayout();
						});
			        },
					onEnd:function(evt){
						  const targetRow = this_.sortableData.splice(evt.oldIndex, 1)[0]
          					this_.sortableData.splice(evt.newIndex, 0, targetRow)
						
					}
				
	  			 });
			})
			
			
	  		
		},
 		handleSizeChange(val){
 			this.searchDataForm.pageSize=val;
 			this.getData(this.searchDataForm);
 		},
 		handleCurrentChange(val){
 			this.searchDataForm.pageNum=val;
 			this.getData(this.searchDataForm);
 		},
 		indexMethod(index){
  			return this.dataPage.startRow+index
  		},
  		selectChange(selection){
  			if(selection.length&&selection.length>0){
  				this.allSelect=false;
  			}else{
  				this.allSelect=true;
  			}	
  		},
  		searchData(){

  		},
  		addCar(scope){
  			console.log(scope)
  		},
  		addLine(){
  			if(this.addData.length<10){
  				const id=(this.addData.length+1)+'--'+new Date()*1;
  				this.addData.push({
  					id:id,
  					name:''
  				})
  				this.sortableData.push(id);
  				this.$nextTick(function(){
  					this.$refs.multipleTable.doLayout();
  				})
  				
  			}		
  		},
  		deleteLine(scope){
  			for(let i in this.sortableData){
  				if(this.sortableData[i]==scope.row.id){
  					this.sortableData.splice(i,1);
  				}
  			}
  			let arr=[];
  				for(let j in this.sortableData){
  					for(let i in this.addData){
  					if(this.sortableData[j]==this.addData[i].id){
  						arr.push(this.addData[i]);
  					}
  				}
  			}
  			this.addData=[];		
  			this.$nextTick(function(){
  				this.$refs.multipleTable.doLayout();
  				this.addData=arr;
  			})
  		}
  		//30214
  	}
  	
  }
  
</script>

<style type="style/css">
	.sortable-ghost{
		background-color:#ecf5ff!important;
	}
	.el-table--enable-row-hover .el-table__body tr:hover>td{
		background-color: #fff;
	}
	.line{
		text-align: center;
	}
	.aaa{
		margin:0;
	}
	.el-dialog *{
		user-select:none;
	}
</style>