<template>
	<div class="container">
		<el-form :inline="true" :model="searchData" class="demo-form-inline">
      <span v-if="searchButton">
        <el-form-item label="">
				 <el-input placeholder="请输入内容" v-model="searchData.searchValue " class="input-with-select" clearable   v-on:keyup.enter.native="search">
				    <el-select v-model="searchData.searchKey" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
				      <el-option label="订购号" value="purchaseCode"></el-option>
				      <el-option label="订单号" value="orderCode"></el-option>
				      <el-option label="创建者" value="creatorName"></el-option>
				       <el-option label="快递号" value="expressCode"></el-option>
              <!-- <el-option label="书名" value="title"></el-option>
                       <el-option label="作者" value="author"></el-option> -->
              <!-- <el-option label="ISBN" value="ISBN"></el-option> -->
              <!-- <el-option label="出版社" value="publisher"></el-option> -->
				    </el-select>

				  </el-input>
			</el-form-item>
			<el-form-item label="创建时间">
				  <el-date-picker
            v-model="picker"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
            value-format="yyyy-MM-dd HH:mm:ss">
			    </el-date-picker>
			</el-form-item>
				<el-form-item label="审核状态">
			    <el-select v-model="searchData.checkStatusSearch" placeholder="审核状态">
			      <el-option label="所有" value=""></el-option>
			      <el-option label="通过" value="1"></el-option>
			      <el-option label="未通过" value="2"></el-option>
			      <el-option label="未审核" value="0"></el-option>
			    </el-select>
			</el-form-item>
      </span>
			<el-form-item label="">
         <span v-for="(item,index) in power" :key="index">
            <el-button v-if="item.name.trim()=='检索'" type="primary" icon="el-icon-search" @click="search">检索</el-button>
            <el-button v-if="item.name.trim()=='导出'" type="warning" icon="iconfont icon-daoru" :disabled="isCheck" @click="exportBudget">导出</el-button>
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
					width="55">
				</el-table-column>
		     <el-table-column
		      type="index"
		      width="55"
		      align="center"
		       :index="indexMethod">
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
				prop="expressCode"
		      label="快递信息"
		      >
		    </el-table-column>
		    <el-table-column
				prop="creatorName"
		      label="创建者"
		      >
		    </el-table-column>
		    <el-table-column
				prop="createTime"
		      label="创建时间"
		      >
		    </el-table-column>
		    <el-table-column
				prop="bookTypeQty"
		      label="图书种数"
		      >
		    </el-table-column>
		    <el-table-column
				prop="totalQuantity"
		      label="总册数"
		      >
		    </el-table-column>
		    <el-table-column
				prop="totalPrice"
		      label="总金额"
		      >
		    </el-table-column>
		    <el-table-column
		      label="审核状态"
		      >
		      <template slot-scope="scope">
		      		<el-tag type="success" v-if="scope.row.checkStatus==1">审核通过</el-tag>
		      		<el-tag type="danger" v-if="scope.row.checkStatus==2">审核未通过</el-tag>
		      		<el-tag type="warning" v-if="scope.row.checkStatus==0">未审核</el-tag>
		      </template>
		    </el-table-column>
			<el-table-column
				prop="summary"
		      label="备注"
		      >
		    </el-table-column>

		     <el-table-column
		      label="操作"
		      align="center"
		      >
		      	<template slot-scope="scope">
              <span v-for="(item,index) in power" :key="index">
                <el-button v-if="item.name.trim()=='物流信息'" type="text" size="mini" @click="showWuliu()">物流信息</el-button>
                <el-button v-if="item.name.trim()=='订单详情'" type="text" size="mini" @click="showDingd(scope.row)">订单详情</el-button>
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

		<dia-log :visible.sync="showDia" :title="isWuliu?'物流信息':'订单详情'">
			<div class="borders" v-if="isWuliu">
				<ul>
					<li v-for="(item,index) in wuliuData" :key="index" class="wuliuDataLi">
						<div class="time">{{item.time}}</div><div class="msg"><span class="oldAddress">{{item.oldAddress}}</span>已发出,下一站<span class="toAddress">{{item.toAddress}}</span></div>
					</li>
				</ul>
			</div>

			<el-table
		    ref="books"
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
				prop="bookQty"
		      label="册数"
		      >
		    </el-table-column>
		    <el-table-column
				prop="totalPrice"
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
import { orderbuy, selectedBooks, exportOrderList } from '@/request/order'
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
				isCheck:true,//未选中禁用导出按钮
				bookList:[],
  			picker:[],//时间选择器
  			searchData:{
  				searchValue:'',
  				searchKey:'purchaseCode',
  				checkStatusSearch:'',
  				startTime:'',
  				endTime:''
  			},
  			form: {
  				searchValue:'',
  				searchKey:'',
  				checkStatusSearch:'',
  				startTime:'',
  				endTime:'',
  				timeKey:"creatTime",
  				orderCodeHave:1,
  				pageNum:1,
  				pageSize:5
				},
				form1: {

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
  		this.getData(JSON.stringify(this.form));
      this.getPowerArr();
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
  			orderbuy(obj).then(data=>{
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
			getSelectedBooks(obj){
  			this.loading=true;
  			selectedBooks(obj).then(data=>{
  				if(data.data.code==0){
  					if(data.data.page.list&&data.data.page.list.length>0){
  						this.bookList=data.data.page.list;
  					}else{
  						this.bookList=[];
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
				//导出多条订购单信息
				exportBudget(){
					this.$confirm('是否要导出订购单信息?', '提示', {
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
							exportOrderList(JSON.stringify(obj)).then(data=>{
								if(data.data.code==0){
									window.location.href=data.data.xlsurl;
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
				//预算列表选择事件
				selectChange(selection){
					if(selection.length >= 1){
						this.selection = selection;
						this.isCheck = false;
					}else{
						this.isCheck = true;
					}
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
  			Object.assign(this.form, this.searchData);
  			this.getData(JSON.stringify(this.form));
  		},
  		showDingd(row){
  			this.showDia=true;
  			this.isWuliu=false;
				this.bookList=row.bookList;
				const form1 = {
					orderId: row.id,
					pageSize: "1000"
				}
				this.form1 = form1;
				this.getSelectedBooks(JSON.stringify(this.form1))
  		},
  		showWuliu(){
  			this.showDia=true;
  			this.isWuliu=true;

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
