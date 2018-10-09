<template>
	<div class="container">
		<el-form :inline="true" :model="form" class="demo-form-inline">
      <span v-if="searchButton">
        <el-form-item label="">
           <el-input placeholder="请输入内容" v-model="form.searchValue" class="input-with-select" clearable v-on:keyup.enter.native="searchData">
              <el-select v-model="form.searchKey" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
                  <el-option label="订购号" value="purchaseCode"></el-option>
                  <el-option label="订单号" value="orderCode"></el-option>
                  <!--<el-option label="创建者" value="creatorName"></el-option>-->
                  <el-option label="书名" value="title"></el-option>
                  <el-option label="作者" value="author"></el-option>
                   <el-option label="ISBN" value="isbn"></el-option>
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
        	<el-form-item label="数据来源">
              <el-select v-model="form.source" >
                <el-option label="新华集团" value="2"></el-option>
                <el-option label="采访库" value="1"></el-option>
                <el-option label="本馆中央库" value="0"></el-option>
              </el-select>
          </el-form-item>
        <el-form-item label="审核状态" style="display: none">
			    <el-select v-model="form.checkStatusSearch" placeholder="审核状态">
			      <el-option label="所有" value=""></el-option>
			        <el-option label="未审核" value="0"></el-option>
			      <el-option label="通过" value="1"></el-option>
			      <el-option label="未通过" value="2"></el-option>
			    </el-select>
			</el-form-item>
      </span>
			<el-form-item label="">
         <span v-for="(item,index) in power" :key="index">
            <el-button v-if="item.name.trim()=='检索'" type="primary" icon="el-icon-search" @click="searchData">检索</el-button>
            <el-button v-if="item.name.trim()=='导出'" type="warning" icon="iconfont icon-daoru" @click="exportOrderFiles" :disabled="selection.length==0">导出</el-button>
         </span>
			</el-form-item>
		</el-form>

 		<el-table
		    ref="multipleTable"
		    :data="data"
		    tooltip-effect="dark"
		    style="width: 100%"
		    v-loading="loading"
				 @selection-change="selectChange"
		   	>
			 <el-table-column
		      type="selection"
		      width="40"
					>
		    </el-table-column>
		     <el-table-column
		      type="index"
					label="序号"
		      width="55">
		    </el-table-column>
		     <el-table-column
				prop="purchaseCode"
		      label="订购号"
		      >
		    </el-table-column>
				<el-table-column
				prop="orderCode"
		      label="订单号"
		      >
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
		      label="单价(元)"
		      >
		    </el-table-column>
		    <el-table-column
				prop="bookQty"
		      label="册数"
		      >
		    </el-table-column>
		    <el-table-column
				prop="totalPrice"
		      label="总价(元)"
		      >
		    </el-table-column>
		  </el-table>

		<el-row>
  			<el-col :span="24">
		  		<el-pagination
		      :page-sizes="[5, 10, 30, 40]"
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
import { selectedBooks,exportFile } from '@/request/order'
  export default{
  	data(){
  		return {
  			loading:false,
  			picker:[],
  			form:{
  				searchKey:'purchaseCode',
  				searchValue:'',
  				checkStatusSearch:'',
  				startTime:'',
  				endTime:'',
          source:"2"
  			},
  			searchDataForm:{
  				searchKey:'',
  				searchValue:'',
  				checkStatusSearch:'',
  				pageNum:1,
  				pageSize:5,
  				timeKey:'pubdate',
  				startTime:'',
					endTime:'',
					source: '2'
  			},
  			data:[],
				dataPage:{},
				selection:[],
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
 		getData(obj){
 			this.loading=true;
 			selectedBooks(obj).then(data=>{
 				console.log(data)
 				if(data.data.code==0){
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
  		},
 //导出多条订购图书
      exportOrderFiles(){
        this.$confirm('是否要导出订购图书?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
              let arr=[];
							for(let i in this.selection){
								arr.push(this.selection[i].id)
							}
							let obj={
								ids:arr.toString()
							}
            exportFile(JSON.stringify(obj)).then(data=>{
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
      },	//预算列表选择事件
				selectChange(selection){
					if(selection.length >= 1){
						this.selection = selection;

					}else{

					}
				}
  	},
  	created(){
      this.getPowerArr();
  		this.getData(this.searchDataForm);
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
