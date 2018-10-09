<template>
	<div class="container">
		<el-form :inline="true" :model="searchData" class="demo-form-inline">
       <span v-if="searchButton">
		 	<el-form-item label="">
				 <el-input placeholder="请输入内容" v-model="searchData.value " class="input-with-select" clearable v-on:keyup.enter.native="search">
				    <el-select v-model="searchData.key" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
				      <el-option label="标题" value="title"></el-option>
				      <el-option label="发送者姓名" value="createName"></el-option>
				       <el-option label="机构名称" value="orgName"></el-option>
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
       </span>
			<el-form-item label="">
        <span v-for="(item,index) in power" :key="index">
			   <el-button v-if="item.name.trim()=='检索'" type="primary" icon="el-icon-search" @click="search">检索</el-button>
        </span>
			  <!-- <el-button type="warning" icon="iconfont icon-daoru">导出</el-button> -->
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
		    <!-- <el-table-column
				prop="createBy"
		      label="发送者账号"
		      >
		    </el-table-column> -->
		    <el-table-column
				prop="createName"
		      label="发送者姓名"
		      >
		    </el-table-column>
		    <el-table-column
				prop="orgName"
		      label="机构名称"
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
		      		<el-tag type="success" v-if="scope.row.status==0">未读</el-tag>
		      		<el-tag type="danger" v-if="scope.row.status==1">已读</el-tag>
		      </template>
		    </el-table-column>
		     <el-table-column
		      label="操作"
		      align="center"
		      >
		      	<template slot-scope="scope">
		      <el-button type="text" size="mini" @click="look(scope.row)">查看内容</el-button>
              <span v-for="(item,index) in power" :key="index">
				         <el-button v-if="item.name.trim()=='删除'" type="text" size="mini" @click="deleteOne(scope.row)">删除</el-button>
              </span>
				  <el-button type="text" size="mini" @click="readOne(scope.row)" v-show="!scope.row.status">标记为已读</el-button>
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

		<dia-log :visible.sync="showDia" :title="isWuliu?'物流信息':'订单详情'">
			<div class="borders" v-if="isWuliu">
				<ul>
					<li v-for="item in wuliuData" class="wuliuDataLi">
						<div class="time">{{item.time}}</div><div class="msg"><span class="oldAddress">{{item.oldAddress}}</span>已发出,下一站<span class="toAddress">{{item.toAddress}}</span></div>
					</li>
				</ul>
			</div>

			<el-table
		    ref="multipleTable"
		    :data="bookList"
		    tooltip-effect="dark"
		    style="width: 100%"
		     v-else
		   	>

		     <el-table-column
		      type="index"
		      width="55">
		    </el-table-column>
		    <el-table-column
				prop="bookName"
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
				prop="classNumber"
		      label="分类号"
		      >
		    </el-table-column>
		    <el-table-column
				prop="press"
		      label="出版社"
		      >
		    </el-table-column>
		    <el-table-column
				prop="pressTime"
		      label="出版时间"
		      >
		    </el-table-column>
		    <el-table-column
				prop="price"
		      label="单价"
		      >
		    </el-table-column>
		    <el-table-column
				prop="total"
		      label="册数"
		      >
		    </el-table-column>
		    <el-table-column
				prop="allPrice"
		      label="总价"
		      >
		    </el-table-column>
		  </el-table>

		</dia-log>

	</div>
</template>

<script>
import CasCader from '@/components/cascader'
import DiaLog from '@/components/Dialog'
import { myNotice ,deleteMyNotice,readMyNotice} from '@/request/inforCenter'
  export default{
  	components:{
  		CasCader,
  		DiaLog
  	},
  	data(){
  		return {
  			loading:false,
  			showDia:false,
  			isWuliu:false,
  			bookList:[],
  			picker:[],//时间选择器
  			searchData:{
  				key:'title',
  				value:'',
  				startTime:'',
  				endTime:''
  			},
  			form:{
  				startTime:'',
  				endTime:'',
  				pageNum:1,
					pageSize:5,
					userId:"1"
  			},
  			wuliuData:[{
  				time:'2018-03-28 12:05:49',
  				oldAddress:'深圳中图公司我是很长很长的备注!我是很长很长的备注!我是很长很长的备注!我是很长很长的备注!',
  				toAddress:'广州分部公司'
  			},{
  				time:'2018-03-28 12:05:49',
  				oldAddress:'深圳中图公司',
  				toAddress:'广州分部公司'
  			},{
  				time:'2018-03-28 12:05:49',
  				oldAddress:'深圳中图公司',
  				toAddress:'广州分部公司'
  			}],
  			data:[],
  			dataPage:{},
        power:[],//按钮权限数组
        searchButton:false
  		}
  	},

  	created(){
  		console.log(this.$route);
      this.getPowerArr();
  		this.getData(JSON.stringify(this.form));
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
  		getData(obj){
				this.loading=true;

  			myNotice(obj).then(data=>{
  				console.log(data)
  				if(data.data.code==0){
  					this.dataPage=data.data.page;
  					if(data.data.page.list&&data.data.page.list.length>0){
  						this.data=data.data.page.list;
  					}else{
  						this.data=[];
  					}
  					this.loading=false;
  				}else{
  					this.$message({
			            type: 'error',
			            message: '请求成功!但后台返回错误! '+data.data.msg,
			             duration: 10 * 1000,
			             showClose: true
			        });
  				}
  			}).catch(error=>{

  			})

  		},
  		//订购单分页事件
  		handleSizeChange(val) {
  			this.form.pageSize=val;
  			this.getData(JSON.stringify(this.form));
	    },
	    handleCurrentChange(val) {
	    	this.form.pageNum=val;
	        this.getData(JSON.stringify(this.form));
	    },
	    search(){
				this.$set(this.form,this.searchData.key,this.searchData.value);
				this.form.startTime=this.searchData.startTime;
				this.form.endTime=this.searchData.endTime;
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
			// 删除
			deleteOne(row){
				   this.$confirm(row.status==1?'是否删除此信息?':'该信息为未读状态，是否删除?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          	this.deleteNotice(row.noticeReadId)
		        }).catch(() => {});

			},
			//调取后台删除数据
  		deleteNotice(id){
  			deleteMyNotice(id).then(data=>{
  				if(data.data.code==0){
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
				// 标为已读
			readOne(row){
				   this.$confirm('是否标记为已读', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          	this.readNotice(row.noticeReadId)
		        }).catch(() => {});

			},
			//调取后台修改消息读取状态
  		readNotice(id){
  			readMyNotice(id).then(data=>{
  				if(data.data.code==0){
  					this.$message({
			            type: 'success',
			            message: '修改成功!'
		         	 });
  				}else{
  					this.$message({
			            type: 'error',
			            message: '修改失败!'+data.data.msg
		         	 });
  				}
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
