<template>
	<div class="container">
		<el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <span v-if="searchHidden">
        <el-form-item label="">
       <el-input placeholder="请输入内容" v-model="searchForm.value" class="input-with-select" clearable v-on:keyup.enter.native="searchData">
          <el-select v-model="searchForm.key" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
              <el-option label="订购号" value="purchaseCode"></el-option>
              <el-option label="创建者账户" value="createLoginName"></el-option>
              <el-option label="创建者姓名" value="createUserName"></el-option>
              <el-option label="审核者账户" value="checkerLoginName"></el-option>
              <el-option label="审核者姓名" value="checkerUserName"></el-option>
          </el-select>
        </el-input>
    </el-form-item>
        <el-form-item label="下单日期">
				<el-date-picker
          v-model="picker"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd">
			    </el-date-picker>
			</el-form-item>
      </span>
			<el-form-item label="">
        <span v-for="(item,index) in power" :key="index">
          <el-button v-if="item.name.trim()=='统计'" type="primary" icon="el-icon-search" @click="searchData">统计</el-button>
          <el-button v-if="item.name.trim()=='导出'" type="warning" icon="iconfont icon-daoru" @click="exportOrderCount" :disabled="data.length==0">导出</el-button>
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
				prop="purchaseCode"
		      label="订购号"
		      >
		    </el-table-column>
		    <el-table-column
				prop="createLoginName"
		      label="创建者账户"
		      >
		    </el-table-column>
		    <el-table-column
				prop="createUserName"
		      label="创建者姓名"
		      >
		    </el-table-column>
		    <el-table-column
					prop="orderTime"
		      label="下单时间"
					:formatter="dateTabFormat"
		      >
		    </el-table-column>
		    <el-table-column
				prop="bookTypeCount"
		      label="图书种数"
		      >
		    </el-table-column>
		    <el-table-column
				prop="totalQuantity"
		      label="图书册数"
		      >
		    </el-table-column>
				<el-table-column
				prop="totalPrice"
		      label="总价(万元)"
		      >
		    </el-table-column>
				<el-table-column
				prop="checkerLoginName"
		      label="审核者账户"
		      >
		    </el-table-column>
				<el-table-column
				prop="checkerUserName"
		      label="审核者姓名"
		      >
		    </el-table-column>
				<el-table-column
		      label="状态"
		      >
					<template slot-scope="scope">
            <el-tag v-if="scope.row.checkStatus==0" type="success">待审核</el-tag>
            <el-tag v-if="scope.row.checkStatus==1" type="info">审核通过</el-tag>
            <el-tag v-if="scope.row.checkStatus==2" type="warning">审核不通过</el-tag>
            <el-tag v-if="scope.row.checkStatus==3" type="danger无需审核"></el-tag>
		      </template>
		    </el-table-column>
				<el-table-column
				prop="checkTime"
		      label="审核时间"
		      >
		    </el-table-column>
		  </el-table>
			<!-- 高级统计 -->
	<dia-log :visible.sync="visible" title="高级统计" top="10vh" width="620px">
			<el-form ref="seniorForm" :model="seniorForm" :rules="rule" status-icon label-width="140px" size="small" style="max-width:540px">
	  		<el-form-item label="" prop="searchValue">
				 <el-input placeholder="请输入内容"  v-model="seniorForm.searchValue" class="input-with-select" clearable>
				    <el-select v-model="seniorForm.searchKey"  slot="prepend" placeholder="请选择统计字段" :style="{width:'120px'}">
				      	<el-option label="订单号" value="title"></el-option>
				      	<el-option label="读者证书" value="creatorName"></el-option>
								<el-option label="读者姓名" value="creatorName"></el-option>
				    </el-select>
				  </el-input>
				</el-form-item>
	  		    <el-form-item label="下单时间" prop="picker2">
		     			 <el-date-picker
					      v-model="picker2"
					      type="datetimerange"
					      start-placeholder="开始日期"
					      end-placeholder="结束日期"
					      :default-time="['12:00:00']"
					      value-format="yyyy-MM-dd HH:mm:ss">
					    </el-date-picker>
	  		    </el-form-item>
	  		    <el-form-item label="审核者账号" prop="account">
	     	     	<el-input v-model="seniorForm.account"></el-input>
	  		    </el-form-item>
	  		    <el-form-item label="审核者姓名" prop="name">
	     	     	<el-input v-model="seniorForm.name"></el-input>
	  		    </el-form-item>
						<el-form-item label="审核日期" prop="picker3">
		     			 <el-date-picker
					      v-model="picker3"
					      type="datetimerange"
					      start-placeholder="开始日期"
					      end-placeholder="结束日期"
					      :default-time="['12:00:00']"
					      value-format="yyyy-MM-dd HH:mm:ss">
					    </el-date-picker>
	  		    </el-form-item>
	  		    <el-form-item label="订单状态" prop="status">
	     			<el-select v-model="seniorForm.status" multiple placeholder="请选择">
					    <el-option label="无需审核" value="1"></el-option>
					    <el-option label="未审核" value="2"></el-option>
							<el-option label="已审核" value="2"></el-option>
					</el-select>
	  		    </el-form-item>
		  		  <el-form-item label="订购总数量" >
		  		  		<el-col :span="11" >
									<el-form-item label="" prop="orderQuantity1">
					     	<el-input v-model="seniorForm.orderQuantity1"></el-input>
								  </el-form-item>
					    </el-col>
					    <el-col class="line" :span="2">-</el-col>
					    <el-col :span="11">
								<el-form-item label="" prop="orderQuantity2">
					    	  <el-input v-model="seniorForm.orderQuantity2"></el-input>
								</el-form-item>
					    </el-col>

		  		  </el-form-item>
	  		  	<el-form-item label="订购总价" >
		  		  		<el-col :span="11">
									<el-form-item label="" prop="totalPrice1">
					     	    <el-input v-model="seniorForm.totalPrice1"></el-input>
								  </el-form-item>
					    </el-col>
					    <el-col class="line" :span="2">-</el-col>
					    <el-col :span="11">
								<el-form-item label="" prop="totalPrice2">
					    	 <el-input v-model="seniorForm.totalPrice2"></el-input>
								 </el-form-item>
					    </el-col>

		  		  </el-form-item>

			</el-form>

			<div slot="footers">
				<el-button @click="reset('seniorForm')">重置</el-button>
				 <el-button type="success" @click="onSubmit">开始统计</el-button>
	  		     <el-button @click="visible=false">取消</el-button>
			</div>


		</dia-log>
		<el-row>
  			<el-col :span="24">
		  		<el-pagination
				      :page-sizes="[5, 10, 15,20]"
				      :page-size="form.pageSize"
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
import { getData } from '@/methods/method'
import DiaLog from '@/components/Dialog'
import CasCader from '@/components/cascader'
import { purchaseOrderList ,purOrderExport} from '@/request/count'
import moment from 'moment';
  export default{
		components:{
			DiaLog,
  		CasCader
		}
		,
  	data(){
			var validatePass= (rule, value, callback) => {
  			if (value === '') {
                 callback()
        	}else{
        		if(isNaN(value)||Number(value)<0){
        			callback(new Error('请输入大于0的数字!'));
        		}else{
        			 callback();
        		}
        	}
  		};
  		return {
				visible:false,
  			picker:[],
  			loading:false,
  			searchForm:{
  				value:'',
  				key:'purchaseCode',
  				placeOrderStartTime:'',
  				placeOrderEndTime:''
  			},
  			form:{
					purchaseCode:'',
  				placeOrderStartTime:'',
  				placeOrderEndTime:'',
  				pageSize:5,
  				pageNum:1
				},
				picker2:"",
				picker3:"",
				seniorForm:{
					searchValue:'',
					searchKey:"",
					account:"",
					name:"",
						// 订购总数量第一个
				  orderQuantity1:"",
				  orderQuantity2:"",
			 	// 订购总价第一个
			  	totalPrice1:"",
			  	totalPrice2:"",
					status:"",
					orderQuantity:"",
          totalPrice:"",
          startTime1:'',
  				endTime1:'',
          startTime2:'',
  				endTime2:''
				},
  			data:[],
				dataPage:{},
				rule:{
  			    orderQuantity1:[
              { validator: validatePass, trigger: 'blur' }
						],
						orderQuantity2:[
              { validator: validatePass, trigger: 'blur' }
						],
						totalPrice1:[
              { validator: validatePass, trigger: 'blur' }
						],
						totalPrice2:[
              { validator: validatePass, trigger: 'blur' }
            ]
  			},
        power:[],//按钮权限数组
        searchHidden:false
  		}
  	},
  	methods:{
      //得到权限按钮数组
      getPowerArr(){
        let  obj;
        let  power =this.$route.meta.power;
        for(let i=0,len=power.length;i<len;i++){
          if(power[i].name=='统计'){
            this.searchHidden=true;
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
  			getData.call(this,purchaseOrderList,data);
  		},
  		searchData(){
  			let newForm=this.form;
  			this.form={
  				placeOrderStartTime:this.searchForm.placeOrderStartTime,
  				placeOrderEndTime:this.searchForm.placeOrderEndTime,
  				pageSize:5,
  				pageNum:1
  			}
  			this.$set(this.form,this.searchForm.key,this.searchForm.value);
  			this.getData(this.form);
  		},
      //导出多条订购单统计
      exportOrderCount(){
        this.$confirm('是否要导出订购单统计?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj={
            placeOrderStartTime:this.searchForm.placeOrderStartTime,
            placeOrderEndTime:this.searchForm.placeOrderEndTime,
          }
          purOrderExport(obj).then(data=>{
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
      onSubmit(){
        this.$refs.seniorForm.validate(valid => {
			            if (valid) {
										if(Number(this.seniorForm.orderQuantity2)<=Number(this.seniorForm.orderQuantity1)){
											this.$message({
											type: 'warning',
											message: '订购总数量第二个要大于第一个数字',
											duration:'3000'
										});
												return
									}
										if(Number(this.seniorForm.totalPrice2)<=Number(this.seniorForm.totalPrice1)){
											this.$message({
											type: 'warning',
											message: '订购总价第二个要大于第一个数字',
											duration:'3000'
										});
												return
									}
										  console.log(this.seniorForm)
										  ruleListAdd(this.form1).then(data=>{
												if(data.data.code==0){
												this.$message({
													type: 'success',
													message: '搜索成功',
													duration:'2000'
												});

												this.getData()
													}
											}).catch(err=>{
												this.$message({
													type: 'info',
													message: '搜索失败，请重试!'
												});
										})



			            } else {
			              console.log('提交失败，验证还没通过!');
			              return false;
			            }
		          });



			},
			reset(formName){
				this.$refs[formName].resetFields();
				this.seniorForm.searchKey="";
				this.picker2="";
				this.picker3="";
			},
			 // 表格时间格式化
      dateTabFormat(row, column) {
        var date = row[column.property];
        if (date == undefined) {
          return "";
        }
        return moment(date).format("YYYY-MM-DD");
      },
  	},
  	created(){
  		this.getData();
      this.getPowerArr();
  	},
  	watch:{
  		picker(newVal){
  			if(newVal&&newVal.length>0){
	  			this.searchForm.placeOrderStartTime=newVal[0];
	  			this.searchForm.placeOrderEndTime=newVal[1];
  			}else{
  				this.searchForm.placeOrderStartTime='';
  				this.searchForm.placeOrderEndTime='';
  			}
			},
			picker2(newVal){
  			if(newVal&&newVal.length>0){
	  			this.seniorForm.startTime1=newVal[0];
	  			this.seniorForm.endTime1=newVal[1];
  			}else{
  				this.seniorForm.startTime1='';
  				this.seniorForm.endTime1='';
  			}
			},
			picker3(newVal){
  			if(newVal&&newVal.length>0){
	  			this.seniorForm.startTime2=newVal[0];
	  			this.seniorForm.endTime2=newVal[1];
  			}else{
  				this.seniorForm.startTime2='';
  				this.seniorForm.endTime2='';
  			}
			},
		},
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
