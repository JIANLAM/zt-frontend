<template>
	<div class="container">
		<el-form :inline="true" :model="searchForm" class="demo-form-inline">
       <span v-if="searchButton">
          <el-form-item label="">
            <el-input placeholder="请输入内容" v-model="searchForm.value" class="input-with-select" clearable v-on:keyup.enter.native="searchData">
              <el-select v-model="searchForm.key" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
                <el-option label="订单号" value="orderNo"></el-option>
                <el-option label="快递单号" value="expressNo"></el-option>
                <el-option label="归属图书馆" value="libName"></el-option>
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
       </span>
		  <el-form-item>
        <span v-for="(item,index) in power" :key="index">
          <el-button v-if="item.name.trim()=='检索'" type="primary" icon="el-icon-search" @click="searchData">检索</el-button>
          <el-button v-if="item.name.trim()=='导出'" type="warning" icon="iconfont icon-daoru" @click="exportPurchaseOrder"  :disabled="data.length==0">导出</el-button>
        </span>
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
						<!-- <el-tag v-if="scope.row.status==4" type="primary">已还书</el-tag> -->
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
              <span v-for="(item,index) in power" :key="index">
				        <el-button v-if="item.name.trim()=='物流信息'" type="text" size="mini" @click="showDialog(scope.row)">物流信息</el-button>
              </span>
			   </template>
		    </el-table-column>

		  </el-table>

		<dia-log :visible.sync="visible" :title="DialogTitle">
				<div class="borders">
					<ul>
						<li v-for="item in wuliuData" :key='item.id' class="wuliuDataLi">
							<div class="time">{{item.time}}</div><div class="msg"><span class="oldAddress">{{item.oldAddress}}</span>已发出,下一站<span class="toAddress">{{item.toAddress}}</span></div>
						</li>
					</ul>
				</div>
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
 import {lendbuyList,exportPurchase} from '@/request/query'
import {getData} from '@/methods/method'
  export default{
  	components:{
  		DiaLog
  	},
  	data(){
  		return {
  			wuliuData:[],
  			DialogTitle:'',
  			loading:false,
  			search:false,
  			visible:false,
  			tabelLoading:false,
  			orderNo:'',
  			picker:[],
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
        getData.call(this,lendbuyList,data);
      },
      searchData(){
        let newForm=this.form;
        this.form={
          startTime:this.searchForm.startTime,
          endTime:this.searchForm.endTime,
          pageSize:newForm.pageSize,
					pageNum:newForm.pageNum,
        }
        this.$set(this.form,this.searchForm.key,this.searchForm.value);
        this.getData(this.form);
      },
  		//查看订单信息
  		lookOrder(row){
  			this.visible=true;
  			this.orderNo='订单号:'+row.orderNo;
  			let lendBuyOrderId={
  				lendBuyOrderId:row.lendBuyOrderId
  			}
  			this.getbookListData(JSON.stringify(lendBuyOrderId));
  		},
  		getbookListData(obj){
  			this.tabelLoading=true;

  			lendbuyBookList(obj).then(data=>{
  				if(data.data.page.list&&data.data.page.list.length>0){
  					this.dialogTabel=data.data.page.list;
  				}else{
  					this.dialogTabel=[];
  				}
  				this.tabelLoading=false;
  			})
  		},
      //导出多条借购单
      exportPurchaseOrder(){
        this.$confirm('是否要导出借购单?', '提示', {
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
          console.log(newVal)
        }else{
          this.searchForm.startTime='';
          this.searchForm.endTime='';
        }
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
