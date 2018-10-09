<template>
	<div class="container">
		<el-form :inline="true" :model="form" class="demo-form-inline">
      <span v-if="searchButton">
		 		<el-form-item label="">
				 <el-input placeholder="请输入内容" v-model="form.searchValue" class="input-with-select" clearable v-on:keyup.enter.native="searchData">
				    <el-select v-model="form.searchKey" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
				      	<el-option label="图书名称" value="title"></el-option>
				      	<!-- <el-option label="读者证号" value="creatorName"></el-option>			 -->
				        <el-option label="作者" value="author"></el-option>
				         <el-option label="ISBN" value="isbn"></el-option>
						<el-option label="出版社" value="publisher"></el-option>
				    </el-select>
				  </el-input>
			</el-form-item>
			  <el-form-item label="出版时间">
				  <el-date-picker
			      v-model="picker"
			      type="daterange"
			      start-placeholder="开始日期"
			      end-placeholder="结束日期"
			      :default-time="['12:00:00']"
			      value-format="yyyy-MM-dd">
			    </el-date-picker>
			</el-form-item>
      </span>
      <span v-for="(item,index) in power" :key="index">
			  <el-button v-if="item.name.trim()=='检索'" type="primary" icon="el-icon-search" @click="searchData">检索</el-button>
      </span>
		</el-form>

 		<el-table
		    ref="multipleTable"
		    :data="data"
		    tooltip-effect="dark"
		    style="width: 100%"
		     v-loading="loading"
		   	>
		     <el-table-column
		      type="index"
		      width="55">
		    </el-table-column>
		    <el-table-column
				prop="title"
		      label="图书名称"
		      >
		    </el-table-column>

		    <el-table-column
				prop="isbn"
		      label="ISBN"
		      >
		    </el-table-column>
		    <el-table-column
				prop="author"
		      label="作者"
		      >
		    </el-table-column>
		    <el-table-column
				prop="bookType"
		      label="分类号"
		      >
		    </el-table-column>
		    <el-table-column
				prop="publisher"
		      label="出版社"
		      >
		    </el-table-column>

		    <el-table-column
				prop="pubdate"
		      label="出版时间"
		      >
		    </el-table-column>
		    <el-table-column
				prop="price"
		      label="单价"
		      >
		    </el-table-column>
			<el-table-column
				prop="recount"
		      label="荐购次数"
		      >
		    </el-table-column>
		    <el-table-column
			 prop="source"
		      label="图书来源"
		      :formatter="resourceFormatter"
		      >
		    </el-table-column>
		    <el-table-column
				prop="summary"
		      label="备注"
		      show-overflow-tooltip
		      >
		    </el-table-column>
		   <!--  <el-table-column
				prop="summary"
		      label="查重结果"
		      >
		    </el-table-column> -->

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


	</div>
</template>

<script>
import { recommbuyList } from '@/request/order'
  export default{
  	data(){
  		return {
  			allSelect:true,
  			loading:false,
  			picker:[],
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
  				timeKey:'pubdate',
  				startTime:'',
  				endTime:''
  			},
  			data:[],
  			dataPage:{},
        power:[],//按钮权限数组
        searchButton:false
  		}
  	},
  	created(){
      this.getPowerArr();
  		this.getData(this.searchDataForm);
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
  			this.loading=true;
  			recommbuyList(obj).then(data=>{
  				if(data.data.code==0){
  					console.log(data)
  					this.dataPage=data.data.page;
  					if(data.data.page.list&&data.data.page.list.length>0){
  						this.data=data.data.page.list;
  					}else{
  						this.data=[];
  					}
  					this.loading=false;
  				}
  			})
  		},
  		//图书来源格式化
	    resourceFormatter(row, column, cellValue, index){
	    	if(cellValue==1){
	    		return '新华集团'
	    	}else if(cellValue==2){
	    		return '本馆图书'
	    	}else if(cellValue==3){
	    		return '豆瓣图书'
	    	}else{
	    		return '成员馆图书'
	    	}

	    },
	    searchData(){

 			Object.assign(this.searchDataForm,this.form);
 			this.searchDataForm.pageNum=1;
 			this.searchDataForm.pageSize=5;
 			this.getData(this.searchDataForm);
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
  		}
  	},
  	watch:{
  		picker(newVal){
  			if(newVal&&newVal.length>0){
	  			this.form.startTime=newVal[0];
	  			this.form.endTime=newVal[1];
  			}else{
  				this.form.startTime='';
  				this.form.endTime='';
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
