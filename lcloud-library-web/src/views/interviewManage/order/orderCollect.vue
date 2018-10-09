<template>
	<div class="container">
		<el-form :inline="true" :model="searchData" class="demo-form-inline">
      <span v-if="searchButton">
        <el-form-item label="">
				<el-input placeholder="请输入内容" v-model="searchData.searchValue" class="input-with-select" @keyup.enter.native="search" clearable>
				    <el-select v-model="searchData.searchKey" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
				      <el-option label="订购号" value="purchaseCode"></el-option>
              <!-- <el-option label="验收人" value="creatorName"></el-option>
                            <el-option label="经费类型" value="creatorLoginName"></el-option> -->
              <!-- <el-option label="图书馆供应商" value="supplierName"></el-option> -->
				    </el-select>
				</el-input>
		  </el-form-item>
		  <span style="font-size: 14px;color: #606266;">验收状态：</span>
		  <el-select v-model="searchData.orderStatus" placeholder="请选择" style="width: 120px;margin-left: 10px;">
		      <el-option label="所有" value=""></el-option>
		      <el-option label="已发货" value="3"></el-option>
		      <el-option label="部分验收" value="4"></el-option>
					<el-option label="已完成" value="6"></el-option>
		  </el-select>
		  <el-form-item label="订购日期：">
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
      <span v-for="(item,index) in power" :key="index">
		  <el-button v-if="item.name.trim()=='检索'" type="primary" icon="el-icon-search" @click="search" style="margin-left: 20px;">检索</el-button>
      </span>
		</el-form>
		<!-- <el-table
		    ref="multipleTable"
		    :data="data"
		    tooltip-effect="dark"
		    style="width: 100%;margin-top: 20px;"
		    @selection-change="handleSelectionChange">

		    <el-table-column
		      type="index"
					align="center"
		      width="50">

		    </el-table-column>
		    <el-table-column
		      prop="purchaseCode"
					align="center"
		      label="订购号"
		      >
		    </el-table-column>
		    <el-table-column
		      prop="createTime"
		      label="订购日期"
					align="center"
		      >
		    </el-table-column>
		    <el-table-column
		      prop="bookTypeQty"
		      label="图书种数"
					align="center"
		      >
		    </el-table-column>
		    <el-table-column
		      prop="totalQuantity"
		      label="总册数"
					align="center"
		      >
		    </el-table-column>
		    <el-table-column
		      prop="totalPrice"
		      label="总价(万元￥)"
					align="center"
		      >
		    </el-table-column>
		    <el-table-column
		      prop=""
		      label="图书馆供应商"
					align="center"
		      >
					 <template slot-scope="scope">
						 <span>新华集团</span>
					 </template>
		    </el-table-column>
				<el-table-column
		      prop="orderStatus"
		      label="验收状态"
					align="center"
		      >
					<template slot-scope="scope">
			    	<span v-if="scope.row.orderStatus == 3">已发货</span>
						<span v-if="scope.row.orderStatus == 4">部分验收</span>
						<span v-if="scope.row.orderStatus == 6">已完成</span>
			    </template>
		    </el-table-column>
		    <el-table-column
		      prop="operation"
		      label="操作"
					align="center"
		      >
					<template slot-scope="scope">
						<el-button type="text" :style="{color:'#67c23a'}" @click="batchAccept">批次验收</el-button>
						<el-button type="text" :style="{color:'#e6a23c'}" @click="orderDetails(scope.row)">订购单详情</el-button>
					</template>
		    </el-table-column>
			</el-table> -->




			<!-- <el-pagination
	      @size-change="handleSizeChange"
	      @current-change="handleCurrentChange"
	      :current-page="dataPage.pageNum"
	      :page-sizes="[3, 5, 10, 20]"
	      :page-size="dataPage.pageSize"
	      layout="total, sizes, prev, pager, next, jumper"
	      :total="dataPage.total">
	    </el-pagination> -->


    <tree-table :columns="columns" :data="data">
      <el-table-column
        prop=""
        label="图书馆供应商"
        align="center"
       slot="lib">
        <template slot-scope="scope">
          <span>新华集团</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderStatus"
        label="验收状态"
        align="center"
        slot="orderStatus">
        <template slot-scope="scope">
          <span v-if="scope.row.orderStatus == 3">已发货</span>
          <span v-if="scope.row.orderStatus == 4">部分验收</span>
          <span v-if="scope.row.orderStatus == 6">已完成</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" slot="opta">
        <template slot-scope="scope">
					<el-button type="text" v-if='scope.row.parent' :style="{color:'#67c23a'}" @click="batchAccept(scope.row)">批次验收</el-button>
          <span v-for="(item,index) in power" :key="index">
            <el-button v-if="item.name.trim()=='订单详情'" type="text"   :style="{color:'#e6a23c'}" @click="orderDetails(scope.row)" v-else>订购单详情</el-button>
          </span>
        </template>
      </el-table-column>
    </tree-table>

			<dia-log :visible.sync="visible" :width="visible?'80%':'400px'" :center="visible">
					<el-form :inline="true" :model="batchbookForm" class="demo-form-inline">
						 	<el-form-item label="">
								 <el-input placeholder="请输入内容" v-model="batchbookForm.searchValue" class="input-with-select" clearable size="small">
								    <el-select v-model="batchbookForm.searchKey" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
								       <el-option label="图书名称" value="title"></el-option>
								       <el-option label="ISBN" value="isbn"></el-option>
								       <el-option label="作者" value="author"></el-option>
								       <el-option label="出版社" value="publisher"></el-option>
								    </el-select>
								  </el-input>
							</el-form-item>
							<el-form-item label="到货状态">
								<el-select v-model="batchbookForm.status" placeholder="请选择" style="width: 120px;margin-left: 10px;" size="small">
										<el-option label="所有" value=""></el-option>
										<el-option label="缺货" value="3"></el-option>
										<el-option label="完成到货" value="4"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item >
							   <el-button type="primary" icon="el-icon-search" size="small" @click="searchAccept">检索</el-button>
							</el-form-item>
						</el-form>

				<el-table
		         :data="orderbatchbook"
		         style="width:100%"
						@selection-change="batchSelectionChange"
						v-loading="batchLoading"
		         >
						 <el-table-column
							type="selection"
							width="40">
						</el-table-column>
				      <el-table-column
				        type="index"
				        width="50"
				        fixed="left"
								label="序号">
				      </el-table-column>
				      <el-table-column
				        prop="title"
				        label="图书名称"
				         fixed="left"
				       >
				      </el-table-column>
				      <el-table-column
				        prop="isbn"
				        label="ISBN"
				        show-overflow-tooltip
				        >
				      </el-table-column>
				      <el-table-column
				        prop="author"
				        label="作者">
				      </el-table-column>
				      <el-table-column
				        prop="bookType"
				        label="分类号">
				      </el-table-column>
				      <el-table-column
				        prop="publisher"
				        label="出版社">
				      </el-table-column>
				      <el-table-column
				        prop="pubdate"
				        label="出版时间"
				        show-overflow-tooltip
								:formatter="dateFormat">
				      </el-table-column>
				      <el-table-column
				        prop="price"
				        label="单价(¥)"
				       >
				      </el-table-column>
							<el-table-column
				        prop="orderQty"
				        label="订购数"
				       >
				      </el-table-column>
				      <el-table-column
				        prop="orderQty"
				        label="本批发货数"
				        >
				      </el-table-column>
				       <el-table-column
				       prop="bookQty"
				        width="160"
				        label="实际到货数"
				        align="center">
				      </el-table-column>
			    	</el-table>
				 	 <el-row >
							<el-col :span="24">
							 <el-pagination
						      :page-sizes="[5, 10, 20, 30]"
						      :page-size="batchbookPage.pageSize"
						      layout="total, sizes, prev, pager, next, jumper"
						      :total="batchbookPage.total"
							 		 @size-change="batchSizeChange"
				           @current-change="batchCurrentChange"
				          :current-page="batchbookPage.pageNum"
						      >
						   	 </el-pagination>
				   	 	</el-col>
					</el-row>

			<div slot="footers">
				<!-- <el-button round type="primary">验收</el-button> -->
				<el-button round type="primary" :disabled=" batchSelection == 0" @click="postAccepted">验收提交</el-button>
				<el-button round type="primary" :disabled=" batchSelection == 0" @click="orderbatchbookExport">导出</el-button>
				<el-button @click="visible = false" round>关 闭</el-button>
			</div>
		</dia-log>

		<dia-log :visible.sync="visible2" :width="visible2?'80%':'400px'" :center="visible2">
					<el-form :inline="true" :model="detailFrom" class="demo-form-inline">
						 	<el-form-item label="">
								 <el-input placeholder="请输入内容" v-model="detailFrom.searchValue" class="input-with-select" clearable>
								    <el-select v-model="detailFrom.searchKey" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
								       <el-option label="图书名称" value="title"></el-option>
								       <el-option label="ISBN" value="isbn"></el-option>
								       <el-option label="作者" value="author"></el-option>
								       <el-option label="出版社" value="publisher"></el-option>
								    </el-select>
								  </el-input>
							</el-form-item>
							<span style="font-size: 14px;color: #606266;">到货状态：</span>
								<el-select v-model="detailFrom.status" placeholder="请选择" style="width: 120px;margin-left: 10px;">
										<el-option label="所有" value=""></el-option>
										<el-option label="缺货" value="3"></el-option>
										<el-option label="完成到货" value="4"></el-option>
								</el-select>
							<el-form-item >
							   <el-button type="primary" icon="el-icon-search" @click="searchDetail">检索</el-button>
							</el-form-item>
						</el-form>

				<el-table
						:data="detailData"
						style="width:100%"

						v-loading="batchLoading"
		         >
				      <el-table-column
				        type="index"
				        width="45"
				        fixed="left"
								label="序号">
				      </el-table-column>
				      <el-table-column
				        prop="title"
				        label="图书名称"
				         fixed="left"
				       >
				      </el-table-column>
				      <el-table-column
				        prop="isbn"
				        label="ISBN"
				        show-overflow-tooltip
				        >
				      </el-table-column>
				      <el-table-column
				        prop="author"
				        label="作者">
				      </el-table-column>
				      <el-table-column
				        prop="bookType"
				        label="分类号">
				      </el-table-column>
				      <el-table-column
				        prop="publisher"
				        label="出版社">
				      </el-table-column>
				      <el-table-column
				        prop="pubdate"
				        label="出版时间"
				        show-overflow-tooltip>
				      </el-table-column>
				      <el-table-column
				        prop="price"
				        label="单价(元)"
				       >
				      </el-table-column>
				      <el-table-column
				        prop="bookQty"
				        label="订购数"
				        >
				      </el-table-column>
				       <el-table-column
				       prop="checkedQty"
				        width="160"
				        label="总到货数"
				        align="center">
				      </el-table-column>
							<el-table-column
				       prop="batchMsg"
				        width="160"
				        label="状态"
				        align="center">
				      </el-table-column>
			    	</el-table>
				 	 <el-row >
							<el-col :span="24">
							 <el-pagination
						      :page-sizes="[5, 10, 20, 30]"
						      :page-size="detailPage.pageSize"
						      layout="total, sizes, prev, pager, next, jumper"
						      :total="detailPage.total"
							  	@size-change="detailSizeChange"
									@current-change="detailCurrentChange"
									:current-page="detailPage.pageNum"
						      >
						   	 </el-pagination>
				   	 	</el-col>
					</el-row>

			<div slot="footers">
				<el-button round type="primary" @click="exportLack">生成催缺单</el-button>
				<el-button @click="visible2 = false" round>取 消</el-button>
			</div>
		</dia-log>

	</div>
</template>

<script>
  import treeTable from '@/components/orderTreeTable'
	import DiaLog from '@/components/Dialog'
	import {accept, orderbatchbook, checkDetail, exportLack, accepted, orderbatchbookExport } from '@/request/order'
	import moment from "moment";
	export default {
		components:{
				DiaLog,
        treeTable
	  	},
	    data() {
	      return {
					picker: '',
					dataPage:{},//表格分页信息存放点
					batchLoading:false,//审核表格的加载动画
					detailData: [], //订单详情存放点
					detailPage: {},
					detailFrom:{
						searchKey: 'title',
						searchValue:"",
						status:""
					},
	        searchData: {
	          searchKey: 'purchaseCode',
	          searchValue: '',
						orderStatus: '',
						timeKey: '',
						startTime: '',
						endTime: ''
					},
					form: {	//搜索值
						searchKey: '',
	          searchValue: '',
						status: '',
						timeKey: '',
						startTime: '',
						endTime: '',
						pageNum: 1,
						pageSize:5,
					},
					batchbookForm: {
						pageNum: 1,
						pageSize: 5,
						searchKey: 'title',
						searchValue: '',
						status: ''
					},
					form2: {
						pageNum: 1,
						pageSize: 5
					},
					auditingForm:{
						searchKey:'',
							searchValue:'',
							startTime:'',
							endTime:'',
							resource:'',
							timeKey:'pubdate',
							pageNum:1,
							pageSize:5,
							orderId:''
					},
					data: [],
					batchData: [],
	        multipleSelection: [],
	        currentPage: 4,
	        visible: false, //弹框显示与否
	        visible2: false, //弹框显示与否
	        labelPosition: 'left',
	        formLabelAlign: {
	          name: '',
	          region: '',
	          type: ''
	        },
          columns: [
            {
              text: '订购号',
							value: 'purchaseCode',
							width: '300',
            },
            {
              text: '订购日期',
              value: 'createTime',
            },
            {
              text: '图书种数',
              value: 'bookTypeQty'
            },
            {
              text: '总册数',
              value: 'totalQuantity'
            },
            {
              text: '总价(万元)',
              value: 'totalPrice'
            },

					],
					orderbatchbook: [],
					batchbookPage: {},
					isDisabled: true,
					batchSelection: '',
					orderBatchId: '',
          power:[],//按钮权限数组
          searchButton:false
		  }
			},
			created() {
        this.getPowerArr();
				this.getAccept(JSON.stringify(this.form));
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
				// 点击搜索
	    	search(){
					Object.assign(this.form, this.searchData);
					this.getAccept(JSON.stringify(this.form));
				},
				// 订单详情点击搜索
				searchDetail() {
					this.form2 = {
						pageNum: 1,
						pageSize: 5
					}
					Object.assign(this.form2, this.detailFrom);
					this.getCheckDetail(JSON.stringify(this.form2));
				},
				dateFormat(row, column) {
               var date = row[column.property];
          if (date == undefined) {
             return "";
          }
          return moment(date).format("YYYY-MM-DD");
				},
				getAccept(obj) { //获取列表
						this.loading=true;
						accept(obj).then(data=>{
							if(data.data.code==0){
								this.dataPage=data.data.page;
								if(data.data.page.list&&data.data.page.list.length>0){
									this.data=data.data.page.list;
								}else{
									if(JSON.parse(obj).pageNum>1){
										this.form.pageNum--;
										this.getAccept(JSON.stringify(this.form))
									}else{
										this.data=[];
									}
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
				getCheckDetail(Id) { //获取订单详情列表
						this.loading=true;
						checkDetail(Id).then(data=>{
							if(data.data.code==0){
								this.detailPage=data.data.page;
								this.detailData=data.data.page.list;
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
				exportLack() {
					this.$confirm('确定是否生成该订单的催缺单?', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
						}).then(() => {
							let obj={
								orderId: this.detailFrom.orderId,
							}
							exportLack(JSON.stringify(obj)).then(data=>{
								if(data.data.code==0){
									console.log(data.data)
									window.location.href=data.data.xlsurl;
								}
								this.$message({
										type: 'success',
										message: '生成成功!正在下载，请稍后..',
										duration:'6000'
									});
							}).catch(err=>{
								this.$message({
										type: 'info',
										message: '生成失败!'
								});
							})

						}).catch(() => {
								this.$message({
									type: 'info',
									message: '生成失败!'
								});
						});
				},
	    	handleSelectionChange(){

				},
				getOrderbatchbook(obj) {
					orderbatchbook(obj).then(data =>{
							if(data.data.code == 0) {
								this.orderbatchbook = data.data.page.list;
								this.batchbookPage = data.data.page;
							}else {
								this.$message({
									type: 'error',
									message: '请求成功!但后台返回错误! '+data.data.msg,
									duration: 10 * 1000,
									showClose: true
								});
							}
						})
				},
				// 批次提交
				postAccepted() {
					let arr=[];
					for(let i of this.batchSelection){
						let str=i.id+'-'+i.checkedQty;
						arr.push(str)
					}
					let ids={
						ids:arr.toString(),
						orderBatchId: this.orderBatchId
					}
					accepted(ids).then(data =>{
						if(data.data.code ==0) {
							this.$message({
								type: 'success',
								message: '提交成功！',
								duration:'3000'
							});
							this.getOrderbatchbook(this.batchbookForm);
						}else {
							this.$message({
									type: 'error',
									message: data.data.msg,
									duration: 10 * 1000,
									showClose: true
								});
						}
					})
				},
	    	batchAccept(row){
					this.visible = true;
					this.orderBatchId = row.id;
					this.batchbookForm.orderBatchId = this.orderBatchId;
					this.getOrderbatchbook(this.batchbookForm);
				},
				searchAccept() {
					this.batchbookForm.pageNum = 1;
					this.batchbookForm.pageSize = 5;
					this.getOrderbatchbook(this.batchbookForm);
				},
				orderbatchbookExport() {
					this.$confirm('是否要导出所选的记录?', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
						}).then(() => {
							let arr=[];
							for(let i in this.batchSelection){
								arr.push(this.batchSelection[i].id)
							}
							let obj={
								ids:arr.toString()
							}
							orderbatchbookExport(JSON.stringify(obj)).then(data=>{
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
									message: '导出失败!'
								});
						});
				},
				// 订购单详情
				orderDetails(row) {
					this.visible2 = true;
					this.detailFrom.orderId = row.id
					Object.assign(this.form2, this.detailFrom);
					this.getCheckDetail(JSON.stringify(this.form2));
				},
	    	doChange(){
	    		this.visible2 = true
	    	},
	    	handleSizeChange(val) {
					this.form.pageSize=val;
					this.getAccept(JSON.stringify(this.form));
				},
		    handleCurrentChange(val) {
	    		this.form.pageNum=val;
	        this.getAccept(JSON.stringify(this.form));
				},
				batchSelectionChange(selection) {
						this.batchSelection = selection;
				},
				// 批次验收列表分页
				batchSizeChange(val) {
					this.batchbookForm.pageSize=val;
					this.getOrderbatchbook(this.batchbookForm);
				},
				batchCurrentChange(val) {
					this.batchbookForm.pageNum=val;
					this.getOrderbatchbook(this.batchbookForm);

				},
				// 订单详情列表分页
				detailSizeChange(val) {
					this.form2.pageSize = val;
					this.getCheckDetail(JSON.stringify(this.form2));
				},
				detailCurrentChange(val) {
					this.form2.pageNum = val;
					this.getCheckDetail(JSON.stringify(this.form2));
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

<style>

</style>
