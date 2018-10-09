<template>
	<div class="container">
		<el-form :inline="true" :model="searchData" class="demo-form-inline">
		  <el-form-item label="" v-if="searchHidden">
				 <el-input placeholder="请输入内容" v-model="searchData.searchValue" class="input-with-select" @keyup.enter.native="search" clearable>
				    <el-select v-model="searchData.searchKey" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
				      <el-option label="联系人" value="contact"></el-option>
							<el-option label="电话" value="phone"></el-option>
							<el-option label="邮箱" value="email"></el-option>
							<el-option label="地址" value="address"></el-option>
				    </el-select>
				  </el-input>
			</el-form-item>
      <span v-for="(item,index) in power" :key="index">
        <el-button  v-if="item.name.trim()=='检索'" type="primary" icon="el-icon-search" @click="search">检索</el-button>
        <el-button  v-if="item.name.trim()=='新增'" type="success" icon="el-icon-plus" @click="addtakeInfo">添加</el-button>
        <el-button  v-if="item.name.trim()=='删除'" type="danger" icon="el-icon-delete" :disabled="isCheck" @click="deletSome">删除</el-button>
      </span>
		</el-form>
		<el-table
		    ref="multipleTable"
		    :data="takeInfoData"
		    tooltip-effect="dark"
		    style="width: 100%;"
				v-loading="loading"
		    @selection-change="selectChange">
		    <el-table-column
		      type="selection"
		      width="40">
		    </el-table-column>
		    <el-table-column
		      type="index"
		      width="50"
					label="序号">
		    </el-table-column>
		    <!-- <el-table-column
		      prop="orderNo"
		      label="订购单位代码"
		      width="200">
		    </el-table-column> -->
		    <!-- <el-table-column
		      prop="schoolName"
		      label="学校名称"
		      width="150">
		    </el-table-column> -->
		    <el-table-column
		      prop="address"
		      label="收货地址"
		      show-overflow-tooltip>
		    </el-table-column>
		    <el-table-column
		      prop="contact"
		      label="联系人">
		    </el-table-column>
		    <el-table-column
		      prop="phone"
		      label="电话">
		    </el-table-column>
		    <el-table-column
		      prop="email"
		      label="邮箱">
		    </el-table-column>
		    <el-table-column
		      prop="billCode"
		      label="发票户号">
		    </el-table-column>
		    <el-table-column
		      prop="ratepayerCode"
		      label="纳税人识别号">
		    </el-table-column>
		    <!-- <el-table-column
		      prop="remarks"
		      label="备注">
		    </el-table-column> -->
				<el-table-column
		      label="操作"
		      align="center"
		      width="150px"
		      >
					<template slot-scope="scope">
							<el-button type="text"  @click="editBtn(scope.row)">修改</el-button>
							<el-button type="text"  :style="{color:'#f56c6c'}" @click="oddSome(scope.row)" >删除</el-button>
					</template>
		    </el-table-column>
		</el-table>
		<el-pagination
	      @size-change="handleSizeChange"
	      @current-change="handleCurrentChange"
	      :current-page="dataPage.pageNum"
	      :page-sizes="[5, 10, 20, 30]"
	      :page-size="5"
	      layout="total, sizes, prev, pager, next, jumper"
	      :total="dataPage.total">
	    </el-pagination>
	    <dia-log :visible.sync="visible" title="新增收货地址" :before-close='closeDialog' class="collectionParameters supplier1">
	    	<el-form :label-position="labelPosition" label-width="110px" :model="formLabelAlign" :rules="rules" ref="ruleForm">
			  <!-- <el-form-item label="订购单位编码">
			    <el-input v-model="formLabelAlign.name"></el-input>
			  </el-form-item>
			  <el-form-item label="学校名称">
			    <el-input v-model="formLabelAlign.region"></el-input>
			  </el-form-item> -->
			  <el-form-item label="收货地址" prop="address">
			    <el-input v-model="formLabelAlign.address"></el-input>
			  </el-form-item>
			  <el-form-item label="联系人" prop="contact">
			    <el-input v-model="formLabelAlign.contact"></el-input>
			  </el-form-item>
			  <el-form-item label="联系电话" prop="phone">
			    <el-input v-model="formLabelAlign.phone"></el-input>
			  </el-form-item>
			  <!-- <el-form-item label="发票户号" prop="billCode">
			    <el-input v-model="formLabelAlign.billCode"></el-input>
			  </el-form-item> -->
			  <el-form-item label="纳税人识别号" prop="ratepayerCode">
			    <el-input v-model="formLabelAlign.ratepayerCode"></el-input>
			  </el-form-item>
				<el-form-item label="邮箱" prop="email">
			    <el-input v-model="formLabelAlign.email"></el-input>
			  </el-form-item>
			  <!-- <el-form-item label="备注">
			    <el-input v-model="formLabelAlign.type" type="textarea"></el-input>
			  </el-form-item> -->
			</el-form>
			<div class="addSure">
				<el-button type="primary" round @click="addTakeInfoSave">确定</el-button>
				<el-button round @click="closeDialog">取 消</el-button>
			</div>
	    </dia-log>

			<dia-log :visible.sync="visible2" title="修改收货地址" :before-close='closeDialog2' class="collectionParameters supplier1">
	    	<el-form :label-position="labelPosition" label-width="110px" :model="formLabelAlign2" :rules="rules" ref="ruleForm2">
			  <!-- <el-form-item label="订购单位编码">
			    <el-input v-model="formLabelAlign.name"></el-input>
			  </el-form-item>
			  <el-form-item label="学校名称">
			    <el-input v-model="formLabelAlign.region"></el-input>
			  </el-form-item> -->
			  <el-form-item label="收货地址" prop="address">
			    <el-input v-model="formLabelAlign2.address"></el-input>
			  </el-form-item>
			  <el-form-item label="联系人" prop="contact">
			    <el-input v-model="formLabelAlign2.contact"></el-input>
			  </el-form-item>
			  <el-form-item label="联系电话" prop="phone">
			    <el-input v-model="formLabelAlign2.phone"></el-input>
			  </el-form-item>
			  <!-- <el-form-item label="发票户号" prop="billCode">
			    <el-input v-model="formLabelAlign.billCode"></el-input>
			  </el-form-item> -->
			  <el-form-item label="纳税人识别号" prop="ratepayerCode">
			    <el-input v-model="formLabelAlign2.ratepayerCode"></el-input>
			  </el-form-item>
				<el-form-item label="邮箱" prop="email">
			    <el-input v-model="formLabelAlign2.email"></el-input>
			  </el-form-item>
			  <!-- <el-form-item label="备注">
			    <el-input v-model="formLabelAlign.type" type="textarea"></el-input>
			  </el-form-item> -->
			</el-form>
			<div class="addSure">
				<el-button type="primary" round @click="takeInfoEditSave">确定</el-button>
				<el-button round @click="closeDialog2">取 消</el-button>
			</div>
	    </dia-log>
	</div>
</template>

<script>
	import DiaLog from '@/components/Dialog'
	import { takeInfoList, takeInfoAdd, takeInfoAddSave, takeInfoDelete, takeInfoEdit, takeInfoEditSave } from '@/request/interview'
	export default {
		components:{
			DiaLog
		},
	    data() {
					var phone = (rule, value, callback) => {
					let ph= /^1[34578]\d{9}$/;
					let mb= /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
					if(!ph.test(value)&&!mb.test(value)) {
						callback(new Error("联系电话格式不正确，请输入正确的手机号或带区号的固定电话"));
					}else {
						callback();
					}
				};
	      return {
					rules: {
						phone: [{ required: true, message: '请输入可联系方式', trigger: 'blur' },
									{ validator: phone, trigger: "blur" }],
						address:  [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
						contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
						email: [{ message: '请输入邮箱地址', trigger: 'blur' },
										{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
						ratepayerCode: [{ required: true, message: '请输入纳税人识别号', trigger: 'blur' }]
					},
					loading: false,
	        searchData: {
	          searchValue: '',
						searchKey: 'contact',
					},
					isCheck: true,
					dataPage:{},
					form: {
						pageNum: 1,
						pageSize: 5
					},
					takeInfoData:[],
	        multipleSelection: [],
	        currentPage: 4,
	        visible: false, //弹框显示与否
	        labelPosition: 'left',
	        formLabelAlign: {

					},
					formLabelAlign2: {},
					newTakeInfoBuy: {},
					visible2: false,
          power:[],//按钮权限数组
          searchHidden:false
		  }
			},
			created() {
				this.getTakeInfoList(JSON.stringify(this.form));
        this.getPowerArr();
			},
	    methods:{
        //得到权限按钮数组
        getPowerArr(){
          let  obj;
          let  power =this.$route.meta.power;
          for(let i=0,len=power.length;i<len;i++){
            if(power[i].name=='检索'){
              this.searchHidden=true;
              obj=power[0];
              power[0]=power[i];
              power[i]=obj
            }
          }
          this.power=power;
        },
				getTakeInfoList(obj) {
					this.loading=true;
					takeInfoList(obj).then(data=>{
						if(data.data.code==0){
							this.dataPage=data.data.page;
							if(data.data.page.list){
								this.takeInfoData=data.data.page.list;
							}
							if(data.data.page.list.length == 0) {
								if (data.data.page.pageNum>1) {
									this.form.pageNum--;
									this.getTakeInfoList(JSON.stringify(this.form));
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
				addtakeInfo() {
					this.takeInfoBuyMsg();
					this.visible = true;
				},
				takeInfoBuyMsg() {
					takeInfoAdd().then(data=>{
  				if(data.data.code==0){
						this.address=data.data.LibraryAddress;
						Object.assign(this.formLabelAlign, this.address);
						console.log(data.data);
  				}else{
  					 this.$message({
			            type: 'error',
			            message: data.data.msg
			        });
  				}
  			})
				},
				// 确认供应商
				addTakeInfoSave(){
					this.$refs.ruleForm.validate((valid) => {
							if (valid) {
									Object.assign(this.newTakeInfoBuy, this.formLabelAlign);
									this.takeInfoAddSave(this.newTakeInfoBuy,this.newTakeInfoBuy);
							} else {
								return false;
							}
						});
				},
				//供应商添加保存
				takeInfoAddSave(obj, newTakeInfoBuy){
					takeInfoAddSave(obj).then(data=>{
							if(data.data.code==0){
								this.$notify({
										title: '成功',
										message: '新增供应商成功!',
										type: 'success',
										duration: 3000
									});
									this.visible=false;
									// 清空表单
									 this.formLabelAlign={};
									this.getTakeInfoList(JSON.stringify(this.form))
							}else{
								this.$message({
									type: 'error',
									message: data.data.msg
								});
							}
						})
					this.$refs.ruleForm.resetFields();
				},
				// 编辑渲染数据
				editBtn(row) {
					this.visible2 = true;
					takeInfoEdit(row.id).then(data => {
						if(data.data.code == 0) {
							this.formLabelAlign2 = {
								address: data.data.LibraryAddress.address,
								billCode: data.data.LibraryAddress.billCode,
								contact: data.data.LibraryAddress.contact,
								ratepayerCode: data.data.LibraryAddress.ratepayerCode,
								email: data.data.LibraryAddress.email,
								phone: data.data.LibraryAddress.phone,
								id: data.data.LibraryAddress.id,
								status: data.data.LibraryAddress.status
							}
						}else {
							this.$message({
								type: 'error',
								message: data.data.msg
							});
						}
					})
				},
				// 编辑保存成功
				takeInfoEditSave() {
					this.$refs.ruleForm2.validate((valid) => {
							if (valid) {
								takeInfoEditSave(this.formLabelAlign2).then(data => {
									if(data.data.code == 0) {
										this.$notify({
											title: '成功',
											message: '修改该收货信息成功!',
											type: 'success',
											duration: 3000
										});
										this.closeDialog2();
										this.getTakeInfoList(JSON.stringify(this.form));
									}else{
										this.$message({
											type: 'error',
											message: data.data.msg
										});
									}
								})
							} else {
								return false;
							}
						});
				},
				// 单个删除
				oddSome(row){
					this.$confirm('确认要删除该收货信息吗?', '警告', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'error'
							}).then(() => {
								let newObj={
									ids: row.id.toString()
								}
								this.takeInfoDelete(newObj);
							}).catch(() => {
								this.$message({
									type: 'info',
									message: '已取消删除!'
								});
					});
				},
				//批量删除
				deletSome(){
					this.$confirm('确认要删除这'+this.selection.length+'条记录吗?', '警告', {
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
								this.takeInfoDelete(newObj);
							}).catch(() => {
								this.$message({
									type: 'info',
									message: '已取消删除!'
								});
					});
				},
				//删除数据的方法
				takeInfoDelete(obj){
					takeInfoDelete(obj).then(data=>{
						if(data.data.code==0&&data.data.count){
							this.getTakeInfoList(JSON.stringify(this.form));
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
				//预算列表选择事件
				selectChange(selection){
						if(selection.length >= 1){
						this.selection = selection;
						this.isCheck = false;
					}else{
						this.isCheck = true;
					}
					// if (selection.length == 1) {
					// 	this.inCheck = false;
					// }else {
					// 	this.inCheck = true;
					// }
				},
	    	handleSelectionChange(){

	    	},
	    	search(){
					// if(this.searchData.searchValue == '') {
					// 	this.getTakeInfoList(JSON.stringify(this.form));
					// }else {
					// 	this.getTakeInfoList(JSON.stringify(this.searchData));
					// }
					this.form = {
						pageNum: 1,
						pageSize: 5
					}
					Object.assign(this.form, this.searchData);
					this.getTakeInfoList(JSON.stringify(this.form));
	    	},
	    	closeDialog() {
					this.visible = false;
					this.$refs.ruleForm.resetFields();
				},
				closeDialog2() {
					this.visible2 = false;
					this.$refs.ruleForm2.resetFields();
				},
	    	handleSizeChange(val) {
  			this.form.pageSize=val;
  			this.getTakeInfoList(JSON.stringify(this.form));
	    	},
		    handleCurrentChange(val) {
	    	this.form.pageNum=val;
	        this.getTakeInfoList(JSON.stringify(this.form));
	    	},
		    addInfo(){
		    	this.visible = true
		    }
	    }
	}
</script>

<style>

</style>
