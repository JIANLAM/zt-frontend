<template>
	<div class="container">
		<el-form :inline="true" :model="searchForm" class="demo-form-inline">
       <span v-if="searchButton">
          <el-form-item label="">
             <el-input placeholder="请输入内容" v-model="searchForm.value" class="input-with-select" clearable v-on:keyup.enter.native="searchData">
                <el-select v-model="searchForm.key" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
                    <!-- <el-option label="读者姓名" value="userName"></el-option>
                    <el-option label="读者证号" value="2"></el-option> -->
                    <el-option label="书名" value="title"></el-option>
                    <el-option label="作者" value="author"></el-option>
                     <el-option label="ISBN" value="ISBN"></el-option>
                <el-option label="出版社" value="publisher"></el-option>
                </el-select>
              </el-input>
          </el-form-item>
          <el-form-item label="出版时间">
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
            <el-button v-if="item.name.trim()=='检索'" type="primary" icon="el-icon-search" @click="searchData">检索</el-button>
            <el-button v-if="item.name.trim()=='导出'" style="margin-bottom: 20px" type="warning" icon="iconfont icon-daoru" @click="exportBorrowBooks" :disabled="data.length==0">导出</el-button>
         </span>
			</el-form-item>
		</el-form>

 		<el-table
		    ref="multipleTable"
		    :data="data"
		    tooltip-effect="dark"
		    v-loading="loading"
		    style="width: 100%"
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
					prop="pubDate"
		      label="出版时间"
		      >
		    </el-table-column>
		    <el-table-column
					prop="price"
		      label="单价(元)"
		      >
		    </el-table-column>
		  </el-table>

		<el-row>
  			<el-col :span="24">
		  		<el-pagination
				      :page-sizes="[5, 10, 15,20]"
				      :page-size="10"
				      layout="total, sizes, prev, pager, next, jumper"
				      :total="dataPage.total"
					  @size-change="handleSizeChange"
		              @current-change="handleCurrentChange"
				      >
		   		 </el-pagination>
   			</el-col>
		</el-row>


	</div>
</template>

<script>
import { lendbuyBookList ,exportBooks} from '@/request/query'
import { getData } from '@/methods/method'
  export default{
  	data(){
  		return {
  			picker:[],
  			loading:false,
  			searchForm:{
  				value:'',
  				key:'title',
  				startTime:'',
  				endTime:''
  			},
  			form:{
  				startTime:'',
  				endTime:'',
  				pageSize:5,
  				pageNum:1
  			},
  			data:[],
  			dataPage:{},
        power:[],//按钮权限数组
        searchButton:false
  		}
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
  		//分页事件
  		handleSizeChange(val) {
  			this.form.pageSize=val;
  			this.getData();
	    },
	    handleCurrentChange(val) {
	    	this.form.pageNum=val;
	        this.getData();
	    },
	    //获取数据
  		getData(data=this.form){
  			getData.call(this,lendbuyBookList,data);
  		},
  		searchData(){
  			let newForm=this.form;
  			this.form={
  				startTime:this.searchForm.startTime,
  				endTime:this.searchForm.endTime,
  				pageSize:5,
  				pageNum:1
  			}
  			this.$set(this.form,this.searchForm.key,this.searchForm.value);
  			this.getData(this.form);
  		},
      //导出多条借购图书信息
      exportBorrowBooks(){
        this.$confirm('是否要导出借购图书信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          exportBooks(JSON.stringify(this.form)).then(data=>{
            if(data.data.code==0){
              // window.location.href=data.data.xlsurl;
              window.open(data.data.xlsurl)
            }
            this.$message({
              type: 'success',
              message: '导出成功!正在下载，请稍后..',
              duration:'6000'
            });
          }).catch(err=>{
            this.$message({
              type: 'info',
              message: '导出失败!'
            });
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '导出已取消!'
          });
        });
      },

  	},
  	created(){
      this.getPowerArr();
  		this.getData();
  	},
  	watch:{
  		picker(newVal){
  			if(newVal&&newVal.length>0){
	  			this.searchForm.startTime=newVal[0];
	  			this.searchForm.endTime=newVal[1];
  			}else{
  				this.searchForm.startTime='';
  				this.searchForm.endTime='';
  			}
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
