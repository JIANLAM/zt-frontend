<template>
	<div class="container">
		<el-form :inline="true" :model="searchData" class="demo-form-inline">
      <span v-if="searchButton">
        <el-form-item label="">
				 <el-input placeholder="请输入内容" v-model="searchData.searchValue" class="input-with-select" @keyup.enter.native="search" clearable>
				    <el-select v-model="searchData.searchKey" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
				      <el-option label="订购号" value="purchaseCode"></el-option>
							<el-option label="创建者账户" value="creatorLoginName"></el-option>
							<el-option label="创建者姓名" value="creatorName"></el-option>
							<el-option label="经费编码" value="coding"></el-option>
				    </el-select>
				  </el-input>
			</el-form-item>
		  <el-form-item label="创建时间：">
				<el-date-picker
          v-model="picker"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['12:00:00']"
          value-format="yyyy-MM-dd HH:mm:ss">
			    </el-date-picker>
		  </el-form-item>
		  <span style="font-size: 14px;color: #606266;">启用状态：</span>
		  <el-select v-model="searchData.status" placeholder="请选择" style="width: 120px;margin-left: 10px;">
		      <el-option label="全部" value=""></el-option>
		      <el-option label="是" value="1"></el-option>
		      <el-option label="否" value="2"></el-option>
		  </el-select>
      </span>

      <span v-for="(item,index) in power" :key="index">
        <el-button v-if="item.name.trim()=='检索'" type="primary" icon="el-icon-search" @click="search" style="margin-left: 10px;">检索</el-button>
        <el-button v-if="item.name.trim()=='新增'" type="success" icon="el-icon-plus" @click="addBudget">添加</el-button>
        <el-button v-if="item.name.trim()=='修改'" type="success" icon="el-icon-edit" :disabled="inCheck" @click="editData">修改</el-button>
        <el-button v-if="item.name.trim()=='删除'" type="danger" icon="el-icon-delete" :disabled="isCheck" @click="deletSome">删除</el-button>
        <el-button v-if="item.name.trim()=='导出'" type="warning" icon="iconfont icon-daoru" :disabled="isCheck" :style="{marginBottom:'10px'}" @click="exportBudget">导出经费单</el-button>
      </span>

    </el-form>
		<el-table
		    ref="multipleTable"
				v-loading="loading"
		    :data="data"
		    tooltip-effect="dark"
		    style="width: 100%;margin-top: 20px;"
		    @selection-change="selectChange">
		    <el-table-column
		      type="selection"
		      width="40">
		    </el-table-column>
		    <el-table-column
		      type="index"
					label="序号"
		      width="50">
		    </el-table-column>
		    <el-table-column
		      prop="coding"
		      label="经费编码"
		      max-width="200">
		    </el-table-column>
		    <el-table-column
		      prop="name"
		      label="经费名称"
		      max-width="200">
		    </el-table-column>
		    <el-table-column
		      prop="total"
		      label="总金额数（万元）"
		      max-width="150"
		      show-overflow-tooltip>
		    </el-table-column>
		    <el-table-column
		      prop="remain"
		      label="剩余金额（万元）"
		      max-width="150">
		    </el-table-column>
		    <el-table-column
		      prop="purchaseCode"
		      label="订购号"
		      max-width="200">
		    </el-table-column>
		    <el-table-column
		      prop="creatorName"
		      label="创建者姓名"
		      max-width="100">
		    </el-table-column>
		    <el-table-column
		      prop="creatTime"
		      label="创建时间"
		      max-width="200"
					:formatter="dateFormat">

		    </el-table-column>
		    <el-table-column
		      prop="status"
		      label="是否启用"
		      max-width="100">
					<template slot-scope="scope">
			    	<span v-if="scope.row.status == 2">否</span>
						<span v-if="scope.row.status == 1">是</span>
			    </template>
		    </el-table-column>
		    <el-table-column
		      prop="remark"
		      label="备注"
		      max-width="200">
		    </el-table-column>
		</el-table>
		<el-pagination
	      @size-change="handleSizeChange"
	      @current-change="handleCurrentChange"
	      :current-page="dataPage.pageNum"
	      :page-sizes="[3, 5, 10, 20]"
	      :page-size="dataPage.pageSize"
	      layout="total, sizes, prev, pager, next, jumper"
	      :total="dataPage.total">
	   </el-pagination>
	   <dia-log :visible.sync="visible" title="新增经费单" :before-close='closeDialog1'>
	    	<el-form :label-position="labelPosition" label-width="120px" :model="formLabelAlign" :rules="rules" ref="ruleForm">
				<el-form-item label="经费名称" prop="name">
			    <el-input v-model="formLabelAlign.name" style="width: 90%;"></el-input>
			  </el-form-item>
			  <el-form-item label="经费类型：" prop="type">
			    <el-select v-model="formLabelAlign.type" placeholder="请选择" style="width: 90%;" >
			      <el-option label="馆员荐购" value="1"></el-option>
			      <el-option label="读者荐购" value="2"></el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item label="经费代码：" prop="coding">
			    <el-input v-model="formLabelAlign.coding" style="width: 90%;" clearable></el-input>
			  </el-form-item>
			  <el-form-item label="总金额（元）：" prop="total">
			    <el-input v-model.number="formLabelAlign.total" style="width: 90%;" clearable></el-input>
			  </el-form-item>
			  <el-form-item label="是否启用：" prop="status">
			    <el-select v-model="formLabelAlign.status" placeholder="请选择" style="width:90%;">
			      <el-option label="是" value="1"></el-option>
			      <el-option label="否" value="2"></el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item label="备注：" prop="remark">
			    <el-input v-model="formLabelAlign.remark" style="width: 90%;" type="textarea"></el-input>
			  </el-form-item>
			</el-form>
			<div slot="footers">
				<el-button type="primary" @click="addBudgetData" :loading="addLoading" round>确定</el-button>
				<el-button @click="closeDialog1" round>取消</el-button>
			</div>
	    </dia-log>
	    <dia-log :visible.sync="visible2" title='修改经费单' :before-close='closeDialog2'>
	    	<el-form :label-position="labelPosition" label-width="120px" :model="formLabelAlign2" :rules="rules1" ref="ruleForm2">
					<el-form-item label="经费名称" prop="name">
			    <el-input v-model="formLabelAlign2.name" style="width: 90%;"></el-input>
			  </el-form-item>
			  <el-form-item label="经费类型：" prop="type">
			    <el-select v-model="formLabelAlign2.type" placeholder="请选择" style="width: 90%;">
			      <el-option label="馆员荐购" value="1"></el-option>
			      <el-option label="读者荐购" value="2"></el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item label="经费代码：" prop="coding" >
			    <el-input v-model="formLabelAlign2.coding" style="width: 90%;" clearable></el-input>
			  </el-form-item>
			  <el-form-item label="总金额（元）：" prop="total">
			    <el-input v-model.number="formLabelAlign2.total" style="width: 90%;" clearable></el-input>
			  </el-form-item>
			  <el-form-item label="创建者：">
			    <el-input v-model="formLabelAlign2.creatorName" :disabled="true" style="width: 90%;"></el-input>
			  </el-form-item>
			  <el-form-item label="创建时间：">
			    <el-input v-model="formLabelAlign2.creatTime" :disabled="true" style="width: 90%;"></el-input>
			  </el-form-item>
			  <el-form-item label="是否启用：" prop="status">
			    <el-select v-model="formLabelAlign2.status" placeholder="请选择" style="width: 90%;">
			      <el-option label="是" value="1"></el-option>
			      <el-option label="否" value="2"></el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item label="备注：" prop="remark">
			    <el-input v-model="formLabelAlign2.remark" style="width: 90%;"  type="textarea"></el-input>
			  </el-form-item>
			</el-form>
			<div slot="footers">
				<el-button type="primary" @click="editSaveData" round :loading="editLoading">确定</el-button>
				<el-button @click="closeDialog2" round>取 消</el-button>
			</div>
	    </dia-log>
	</div>
</template>

<script>
	import DiaLog from '@/components/Dialog'
	import {finance, financeDelete, budgetBuyAdd, BudgetSave, editBudget, formatDate, editSave, exportBudget} from '@/request/order'
	import moment from "moment";
	// import {format} from '@/methods/methods'
	export default {
		components:{
	  		DiaLog
	  	},
	    data() {

	      return {
					addLoading: false,
					editLoading: false,
					picker: '',//时间选择器
					isCheck:true,//删除多个是否禁用
					inCheck: true, // 修改是否禁用
					newBudgetBuy:{},//新增预算单保存时传给后台的参数
					editBudgetBuy:{},
					searchData:{//表单v-model的值
						searchKey: 'purchaseCode',
						searchValue:'',
						startTime:'',
						endTime:'',
						status: ''
					},
					loading: false,
					form: {	//搜索值
						searchKey: '',
						searchValue: '',
						timeKey: 'createTime',
						startTime:'',
						endTime: '',
						staus: '',
						pageNum: 1,
						pageSize:5,
					},
					data: [],
					dataPage:{},//表格分页信息存放点
	        multipleSelection: [],
	        visible: false, //弹框显示与否
	        visible2: false, //弹框显示与否
	        labelPosition: 'left',
	        formLabelAlign: {},
					formLabelAlign2: {
	          name: '',
	          coding: '',
						type: '',
						total: '',
						remain: '',
						creatorName: '',
						creatTime: '',
						status: '',
						remark: '',
	        },
					rules: {
						name: [
							{ required: true, message: '请输入经费名称', trigger: 'blur' }
						],
						type: [
							{ required: true, message: '请选择经费类型', trigger: 'change' }
						],
						coding: [
							{ required: true, message: '请输入经费代码', trigger: 'blur' }
						],
						total: [
							{ required: true, message: '请输入总金额', trigger: 'blur' },
								{type: 'number', message: '总金额必须为数字值' }
						],
						status: [
							{ required: true, message: '请选择是否启用', trigger: 'change' }
						],
					},
					rules1: {
						name: [
							{ required: true, message: '请输入经费名称', trigger: 'blur' }
						],
						type: [
							{ required: true, message: '请选择经费类型', trigger: 'blur' }
						],
						coding: [
								{ required: true, message: '请输入经费代码', trigger: 'blur' }
						],
						total: [
								{ required: true, message: '请输入总金额', trigger: 'blur'},
								{type: 'number', message: '总金额必须为数字值' }
						],
						status: [
								{ required: true, message: '请选择是否启用', trigger: 'blur' }
						],
					},
          power:[],//按钮权限数组
          searchButton:false
		 		}
			},
			created() {
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
				dateFormat(row, column) {
               var date = row[column.property];
          if (date == undefined) {
             return "";
          }
          return moment(date).format("YYYY-MM-DD HH:mm:ss");
				},
				//设置表格索引
				indexMethod(index){
					return this.dataPage.startRow+index
				},
				getData(obj){
					this.loading=true;
					finance(obj).then(data=>{
						if(data.data.code==0){
							this.dataPage=data.data.page;
							if(data.data.page.list&&data.data.page.list.length>0){
								this.data=data.data.page.list;
							}else{
								if(JSON.parse(obj).pageNum>1){
									this.form.pageNum--;
									this.getData(JSON.stringify(this.form))
								}else{
									this.data=[];
								}
							}
							this.loading=false;
						}else{
							this.$message({
										type: 'error',
										message: '请求成功!后台出错! '+data.data.msg,
										duration: 3 * 1000,
										showClose: true
								});
						}
  				}).catch(error=>{
  				})
				},
				//预算列表选择事件
				selectChange(selection){
					if(selection.length >= 1){
						this.selection = selection;
						this.isCheck = false;
					}else{
						this.isCheck = true;
					}
					if (selection.length == 1) {
						this.inCheck = false;
					}else {
						this.inCheck = true;
					}
				},
				// //单个删除
				// delet(row){
				// 	this.$confirm('确认要删除这条订购单吗?', '警告', {
				// 				confirmButtonText: '确定',
				// 				cancelButtonText: '取消',
				// 				type: 'error'
				// 			}).then(() => {
				// 				let newObj={
				// 					ids:''
				// 				}
				// 				let arr=[];
				// 				arr.push(row.id);
				// 				newObj.ids=arr.toString();
				// 				this.orderbuyDelete(newObj);

				// 			}).catch(() => {
				// 				this.$message({
				// 					type: 'info',
				// 					message: '已取消删除!'
				// 				});
				// 			});
				// },
				//批量删除
				deletSome(){
					this.$confirm('确认要删除这'+this.selection.length+'条订购单吗?', '警告', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'error'
							}).then(() => {
								let arr=[];
								for(let val of this.selection){
									arr.push(val.id);
								}
								let newObj={
									ids:''
								}
								newObj.ids=arr.toString();
								this.financeDelete(newObj);
							}).catch(() => {
								this.$message({
									type: 'info',
									message: '已取消删除!'
								});
					});
				},
				//删除数据的方法
				financeDelete(obj){
					financeDelete(obj).then(data=>{
						if(data.data.code==0&&data.data.count){
							this.getData(JSON.stringify(this.form));
								this.$message({
										type: 'success',
										message: '成功删除'+data.data.count+'条数据!'
									});
						}else{
							this.$message({
										type: 'error',
										message: data.data.msg
									});
						}
					})
				},
				//新增预算单
				addBudget() {
					this.formLabelAlign = {};
					this.budgetBuyMsg();
					this.visible = true;
				},
				budgetBuyMsg() {
					budgetBuyAdd().then(data=>{
  				if(data.data.code==0){
						this.Budget=data.data.Budget;
						Object.assign(this.formLabelAlign, this.Budget);
  				}else{
  					 this.$message({
			            type: 'error',
			            message: data.data.msg
			        });
  				}
  			})
				},
				// 确认新增预算单
				addBudgetData(){
					this.$refs.ruleForm.validate((valid) => {
							if (valid) {
									Object.assign(this.newBudgetBuy, this.formLabelAlign);
									this.BudgetSave(this.newBudgetBuy,this.newBudgetBuy);
							} else {
								return false;
							}
						});
				},
				closeDialog1() {
					this.visible = false;
					this.$refs.ruleForm.resetFields();
				},
				closeDialog2() {
					this.visible2 = false;
					this.$refs.ruleForm2.resetFields();
				},
				//预算单添加保存
				BudgetSave(obj, newBudgetBuy){
					this.addLoading = true;
					BudgetSave(obj).then(data=>{
							if(data.data.code==0){
								this.$notify({
										title: '成功',
										message: '新添加预算单成功!',
										type: 'success',
										duration: 3000
									});
									this.visible=false;
									this.addLoading = false;
									this.$refs.ruleForm.resetFields();
										this.getData(JSON.stringify(this.form));
							}else{
								this.$message({
											type: 'error',
											message: data.data.msg
										});
								this.addLoading = false;
							}
						})


				},
				// 修改预算单信息数据带入
				editData() {
						this.visible2 = true;
						let id = this.selection[0].id;
						this.editMug(id);
				},
				editMug(Id) {
					editBudget(Id).then(data=>{
						if(data.data.code==0){
							Object.assign(this.formLabelAlign2, data.data.Budget);
						}else{
							this.$message({
										type: 'error',
										message: data.data.msg
									});
						}
					})
				},
				// 修改预算单确认保存
				editSaveData() {
							this.$refs.ruleForm2.validate((valid) => {
							if (valid) {
								Object.assign(this.editBudgetBuy,this.formLabelAlign2)
								this.editLoading = true;
								editSave(this.editBudgetBuy).then(data=>{
									if(data.data.code==0){
										this.editLoading = false;
										this.getData(JSON.stringify(this.form));
										this.$message({
												message: '修改订单成功!',
												type: 'success'
											});
									}
									this.visible2=false;
								}).catch(error=>{
									this.$message({
												message: '修改失败,错误代码:'+error.response.status,
												type: 'error'
											});
									this.visible2=false;
									this.editLoading = false;
								})
								} else {
									return false;
								}
						});
					this.$refs.ruleForm2.resetFields();
				},
				//导出多条订购单信息
				exportBudget(){
					this.$confirm('是否要导出这'+this.selection.length+'条经费单信息?', '提示', {
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
							exportBudget(JSON.stringify(obj)).then(data=>{
								if(data.data.code==0){
									console.log(data.data)
									window.open(data.data.xlsurl);
									this.$message({
										type: 'success',
										message: '导出成功!正在下载，请稍后..',
										duration:'6000'
									});
								}else {
									this.$message({
											type: 'error',
											message: data.data.msg,
											duration:'2000'
									});
								}						
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
				// 点击搜索
	    	search(){
					Object.assign(this.form, this.searchData);
					this.getData(JSON.stringify(this.form));
	    	},
	    	handleSizeChange(val) {
					this.form.pageSize=val;
					this.getData(JSON.stringify(this.form));
	    	},
		    handleCurrentChange(val) {
	    		this.form.pageNum=val;
	        this.getData(JSON.stringify(this.form));
	    	},
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
