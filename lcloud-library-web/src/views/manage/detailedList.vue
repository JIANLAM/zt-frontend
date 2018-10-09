<template>
	<div class="container">
		<el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="">
        <el-input placeholder="请输入内容" v-model="searchForm.value" class="input-with-select" clearable>
          <el-select v-model="searchForm.key" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
            <el-option label="订单号" value="orderNo"></el-option>
            <el-option label="快递单号" value="expressNo"></el-option>
            <el-option label="读者姓名" value="userName"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
		  <el-form-item label="订单创建时间">
		 	 <el-date-picker
		      v-model="picker"
		      type="datetimerange"
		      start-placeholder="开始日期"
		      end-placeholder="结束日期"
		      :default-time="['12:00:00']"
		      value-format="yyyy-MM-dd HH:mm:ss"
		       clearable>
		    </el-date-picker>
		  </el-form-item>

		  <el-form-item>
		    <el-button type="primary" icon="el-icon-search" @click="searchData">查询订单</el-button>
        <el-button type="warning" icon="iconfont icon-daoru" @click="exportPurchaseOrder"  :disabled="data.length==0">导出</el-button>
		  </el-form-item>
		</el-form>

 		<el-table
		    ref="multipleTable"
		    :data="data"
		    tooltip-effect="dark"
		    style="width: 100%"

		   	>
		     <el-table-column
		      type="index"
		      width="55">
		    </el-table-column>
		    <el-table-column
				prop="orderNo"
		      label="订单号"
		      >
		    </el-table-column>
		   <el-table-column
				prop="expressNo"
		      label="快递单号"
		      >
		    </el-table-column>
		    <el-table-column
				prop="readerCardNumber"
		      label="读者证号"
		      >
		    </el-table-column>
		    <el-table-column
				prop="userName"
		      label="读者姓名"
		      >
		    </el-table-column>
		    <el-table-column
				prop="bookCount"
		      label="图书总数"
		      >
		    </el-table-column>
		    <el-table-column
				prop="totalMoney"
		      label="总价(元)"
		      >
		    </el-table-column>
		    <el-table-column
				prop="sendeeInfo"
		      label="收件信息"
		      >
		    </el-table-column>
		    <el-table-column
		      label="状态"
		      >
		      <template slot-scope="scope">
            <el-tag v-if="scope.row.status==0" type="success">待处理</el-tag>
            <el-tag v-if="scope.row.status==1" type="info">已发货</el-tag>
            <el-tag v-if="scope.row.status==2" type="warning">已收货</el-tag>
            <el-tag v-if="scope.row.status==3" type="danger">已取消</el-tag>
						<el-tag v-if="scope.row.status==4" type="primary">已还书</el-tag>
		      </template>
		    </el-table-column>
				<el-table-column
						prop="createTime"
						label="创建时间"
					>
			    </el-table-column>
		      <!-- <el-table-column
					prop="remark"
		      label="备注"
		      >
		    </el-table-column> -->
		     <el-table-column
		      label="操作"
		      align="center"
		      >
		      	<template slot-scope="scope">
				  <el-button type="text" size="mini" @click="showWuliu()">物流信息</el-button>
				  <el-button type="text" size="mini" @click="showDingd(scope.row)">订单详情</el-button>
			   </template>
		    </el-table-column>

		  </el-table>

	<dia-log :visible.sync="showDia" :title="isWuliu?'物流信息':'订单详情'">
			<div class="borders" v-if="isWuliu">	
				<ul>
					<li v-for="item in wuliuData" :key='item.id' class="wuliuDataLi">
						<div class="time">{{item.time}}</div><div class="msg"><span class="oldAddress">{{item.oldAddress}}</span>已发出,下一站<span class="toAddress">{{item.toAddress}}</span></div>
					</li>
				</ul>	
			</div>	
			
				<el-table
  				v-loading="tabelLoading"
			    :data="bookList"
			    stripe
			    max-height="650"
			    style="width: 100%"
          v-else
          >
			    <el-table-column
			      type="index"
			      width="50"
			       fixed>
			    </el-table-column>
			    <el-table-column
			      prop="title"
			      label="书名"
			      >
		  	    </el-table-column>
		  	    <el-table-column
			      prop="author"
			      label="作者"
			      >
		  	    </el-table-column>
		  		<el-table-column
			      prop="bookType"
			      label="分类"
			      >
		  	    </el-table-column>
		  	    <el-table-column
			      prop="publisher"
			      label="出版社"
			      >
		  	    </el-table-column>
		  	    <el-table-column
			      prop="isbn"
			      label="isbn"
			      >
		  	    </el-table-column>
		  	    <el-table-column
			      prop="price"
			      label="价格(元)"
			      >
		  	    </el-table-column>
		   
  		</el-table>

		</dia-log>

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


	</div>
</template>

<script>
import DiaLog from '@/components/Dialog'
 import {lendbuyList,exportPurchase,lendbuyDetail} from '@/request/query'
import {getData} from '@/methods/method'
  export default{
  	components:{
  		DiaLog
  	},
  	data(){
  		return {
        wuliuData:[],
        showDia:false,
  			isWuliu:false,
  			DialogTitle:'',
  			loading:false,
  			search:false,
  			visible:false,
  			tabelLoading:false,
  			orderNo:'',
        picker:[],
        bookList:[],
  			dialogTabel:[],
        searchForm:{
          value:'',
          key:'userName',
          startTime:'',
          endTime:''
        },
        form:{
          startTime:'',
          endTime:'',
          pageSize:5,
          pageNum:1
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
  			dataPage:{}
  		}
  	},
  	methods:{
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
        getData.call(this,lendbuyList,data);
      },
      searchData(){
        let newForm=this.form;
        this.form={
          startTime:this.searchForm.startTime,
          endTime:this.searchForm.endTime,
          pageSize:newForm.pageSize,
          pageNum:newForm.pageNum
        }
        this.$set(this.form,this.searchForm.key,this.searchForm.value);
        this.getData(this.form);
      },
  	
      //导出多条借购单
      exportPurchaseOrder(){
        this.$confirm('是否要导出这'+this.data.length+'条借购单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          exportPurchase(JSON.stringify(this.form)).then(data=>{
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
            message: '取消导出!'
          });
        });
      },
      	getSelectedBooks(obj){
  			this.loading=true;
  			lendbuyDetail(obj).then(data=>{
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
  	created(){
      this.getData();
  	},
    watch:{
      picker(newVal){
        if(newVal&&newVal.length>0){
          this.searchForm.startTime=newVal[0];
          this.searchForm.endTime=newVal[1];
          console.log(newVal)
        }else{
          this.searchForm.startTime='';
          this.searchForm.endTime='';
        }
      }
		},
		filters:{
			currery:function(value){
				 return "¥"+value
			}
		}

  }

</script>

<style type="style/css">

	.el-step__title{
		font-size: 14px;
	}
	_:-ms-lang(x),.el-step{
		flex:1;
	}
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
