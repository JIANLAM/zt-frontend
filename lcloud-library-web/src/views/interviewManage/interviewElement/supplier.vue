<template>
	<div class="container">
		<el-form :inline="true" :model="searchData" class="demo-form-inline">
		  <!-- <el-form-item label="">
		    <el-input v-model="searchData.searchValue" placeholder="" style="width: 500px;"></el-input>
		  </el-form-item> -->
			<el-form-item label="" v-if="searchHidden">
				 <el-input placeholder="请输入内容" v-model="searchData.searchValue" class="input-with-select" @keyup.enter.native="search" clearable>
				    <el-select v-model="searchData.searchKey" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
				      <el-option label="供应商编码" value="coding"></el-option>
							<el-option label="联系人" value="contact"></el-option>
							<el-option label="地址" value="address"></el-option>
				    </el-select>
				  </el-input>
			</el-form-item>
      <span v-for="(item,index) in power" :key="index">
        <el-button v-if="item.name.trim()=='检索'" type="primary" icon="el-icon-search" @click="search">检索</el-button>
        <el-button v-if="item.name.trim()=='新增'" type="success" icon="el-icon-plus" @click="addSupplier">添加</el-button>
        <el-button v-if="item.name.trim()=='删除'" type="danger" icon="el-icon-delete" :disabled="isCheck" @click="deletSome">删除</el-button>
      </span>
		</el-form>
		<el-table
		    ref="multipleTable"
		    :data="supplierData"
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
		    <el-table-column
		      prop="coding"
		      label="供应商代码"
					>
		    </el-table-column>
		    <el-table-column
		      prop="name"
		      label="供应商名称"
		     >
		    </el-table-column>
		    <el-table-column
		      prop="address"
		      label="地址"
		      show-overflow-tooltip>
		    </el-table-column>
		    <el-table-column
		      prop="contact"
		      label="联系人"
		      >
		    </el-table-column>
		    <el-table-column
		      prop="phone"
		      label="电话"
		      >
		    </el-table-column>
		    <el-table-column
		      prop="email"
		      label="邮箱"
		      >
		    </el-table-column>
		    <el-table-column
		      prop="fax"
		      label="传真"
		     >
		    </el-table-column>
		    <el-table-column
		      prop="postcode"
		      label="邮编"
		     >
		    </el-table-column>
		    <el-table-column
		      prop="remark"
		      label="备注"
		      >
		    </el-table-column>
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
	      :page-sizes="[3, 5, 10, 20]"
	      :page-size="dataPage.pageSize"
	      layout="total, sizes, prev, pager, next, jumper"
	      :total="dataPage.total">
	    </el-pagination>
	    <dia-log :visible.sync="visible" :before-close='closeDialog' title="新增供应商" class="collectionParameters supplier1" width="700px">
	    	<el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign" :rules="rules" ref="ruleForm">
			  <el-form-item label="供应商代码" prop="coding">
			    <el-input v-model="formLabelAlign.coding"></el-input>
			  </el-form-item>
			  <el-form-item label="供应商名称" prop="name">
			    <el-input v-model="formLabelAlign.name"></el-input>
			  </el-form-item>
			  <el-form-item label="地址" prop="address">
			    <el-input v-model="formLabelAlign.address"></el-input>
			  </el-form-item>
			  <el-form-item label="联系人" prop="contact">
			    <el-input v-model="formLabelAlign.contact"></el-input>
			  </el-form-item>
			  <el-form-item label="联系电话" prop="phone">
			    <el-input v-model="formLabelAlign.phone"></el-input>
			  </el-form-item>
			  <el-form-item label="邮箱" prop="email">
			    <el-input v-model="formLabelAlign.email"></el-input>
			  </el-form-item>
			  <el-form-item label="邮政编码" prop="postcode">
			    <el-input v-model="formLabelAlign.postcode"></el-input>
			  </el-form-item>
			  <el-form-item label="传真" prop="fax">
			    <el-input v-model="formLabelAlign.fax"></el-input>
			  </el-form-item>
			  <el-form-item label="备注">
			    <el-input v-model="formLabelAlign.remark" type="textarea"></el-input>
			  </el-form-item>
			</el-form>
			<div class="addSure">
				<el-button type="primary" round @click="addSupplierSave">确定</el-button>
				<el-button @click="closeDialog" round>取 消</el-button>
			</div>
	    </dia-log>

			<dia-log :visible.sync="visible2" :before-close='closeDialog2' title="修改供应商设置" class="collectionParameters supplier1" width="700px">
	    	<el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign2" :rules="rules" ref="ruleForm2">
			  <el-form-item label="供应商代码" prop="coding">
			    <el-input v-model="formLabelAlign2.coding"></el-input>
			  </el-form-item>
			  <el-form-item label="供应商名称" prop="name">
			    <el-input v-model="formLabelAlign2.name"></el-input>
			  </el-form-item>
			  <el-form-item label="地址" prop="address">
			    <el-input v-model="formLabelAlign2.address"></el-input>
			  </el-form-item>
			  <el-form-item label="联系人" prop="contact">
			    <el-input v-model="formLabelAlign2.contact"></el-input>
			  </el-form-item>
			  <el-form-item label="电话" prop="phone">
			    <el-input v-model="formLabelAlign2.phone"></el-input>
			  </el-form-item>
			  <el-form-item label="邮箱" prop="email">
			    <el-input v-model="formLabelAlign2.email"></el-input>
			  </el-form-item>
			  <el-form-item label="传真" prop="fax">
			    <el-input v-model="formLabelAlign2.fax"></el-input>
			  </el-form-item>
			  <el-form-item label="邮编" prop="postcode">
			    <el-input v-model="formLabelAlign2.postcode"></el-input>
			  </el-form-item>
			  <el-form-item label="备注">
			    <el-input v-model="formLabelAlign2.remark" type="textarea"></el-input>
			  </el-form-item>
			</el-form>
			<div class="addSure">
				<el-button type="primary" round @click="supplierEditSave">确定</el-button>
				<el-button @click="closeDialog2" round>取 消</el-button>
			</div>
	    </dia-log>
	</div>
</template>

<script>
	import DiaLog from '@/components/Dialog'
	import { supplierList, supplierAdd, supplierAddSave, supplierDelete, supplierEdit, supplierEditSave } from '@/request/interview'
	export default {
		components:{
	  		DiaLog
	  	},
	    data() {
				 var checkNumber = (rule, value, callback) => {
					let str = /^[0-9a-zA-Z]+$/;
					if (!str.test(value)) {
						callback(new Error("供应商代码只能为数字和英文"));
					} else {
						callback();
					}
				};
				var phone = (rule, value, callback) => {
					let ph= /^1[34578]\d{9}$/;
					let mb= /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
					if(!ph.test(value)&&!mb.test(value)) {
						callback(new Error("联系电话格式不正确，请输入正确的手机号或带区号的固定电话"));
					}else {
						callback();
					}
				};
				var postcode = (rule, value, callback) => {
            if (!value) {
              callback();
            }else {
              let re = /^[0-9]{6}$/
              if (!re.test(value)) {
                callback(new Error("邮政编码格式不正确！"));
              } else {
                callback();
              }
            }
				};
				var fax = (rule, value, callback) => {
					if (!value) {
            callback();
      	}else {
						let mb= /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
						if(!mb.test(value)) {
							callback(new Error("传真格式不正确！"));
						}else {
							callback();
						}
					}
				};
	      return {
					rules: {
						coding: [{ required: true, message: '请输入供应商代码', trigger: 'blur' },
									{ validator: checkNumber, trigger: "blur" }],
						phone: [{ required: true, message: '请输入可联系方式', trigger: 'blur' },
									{ validator: phone, trigger: "blur" }],
						name: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
						address:  [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
						contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
						email: [{ message: '请输入邮箱地址', trigger: 'blur' },
										{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
						postcode: [
		            { min:6, message: '邮编至少为六位' },
              { validator: postcode, trigger: "blur" }
							],
						fax:  { validator: fax, trigger: 'blur' }
					},
					multipleSelection: [],
					visible: false, //弹框显示与否
					visible2: false,
					isCheck: true,
					loading:false,//表格加载动画显示
					labelPosition: 'left',
					formLabelAlign: {},
					formLabelAlign2: {},
					dataPage:{},//表格分页信息存放点
	        searchData: {
	          searchValue: '',
						searchKey: 'coding',
					},
					form: {
						pageNum: 1,
						pageSize:5,
					},
					supplierData: [],
					newSupplierBuy: {},
          power:[],//按钮权限数组
          searchHidden:false
		  	}
			},
			created() {
				this.getSupplierList(JSON.stringify(this.form));
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
				getSupplierList(obj) {
					this.loading=true;
					supplierList(obj).then(data=>{
						if(data.data.code==0){
							this.dataPage=data.data.page;
							if(data.data.page.list){
								this.supplierData=data.data.page.list;
							}
							if(data.data.page.list.length == 0) {
								if (data.data.page.pageNum>1) {
									this.form.pageNum--;
									this.getSupplierList(JSON.stringify(this.form))
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
				addSupplier() {
					this.supplierBuyMsg();
					this.visible = true;
				},
				supplierBuyMsg() {
					supplierAdd().then(data=>{
  				if(data.data.code==0){
						this.supplie=data.data.Supplier;
						Object.assign(this.formLabelAlign, this.supplie);
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
				addSupplierSave(){
					this.$refs.ruleForm.validate((valid) => {
							if (valid) {
									Object.assign(this.newSupplierBuy, this.formLabelAlign);
									this.supplierAddSave(this.newSupplierBuy,this.newSupplierBuy);
							} else {
								return false;
							}
						});
				},
				//供应商添加保存
				supplierAddSave(obj, newSupplierBuy){
					supplierAddSave(obj).then(data=>{
							if(data.data.code==0){
								this.$notify({
										title: '成功',
										message: '新增供应商成功!',
										type: 'success',
										duration: 3000
									});
									this.visible=false;
									this.formLabelAlign={};
									this.getSupplierList(JSON.stringify(this.form));
							}else{
								this.$message({
									type: 'error',
									message: data.data.msg
								});
							}
						})
					this.$refs.ruleForm.resetFields();
				},
				// 供应商信息编辑
				editBtn(row) {
					this.visible2 = true;
					supplierEdit(row.id).then(data => {
						if(data.data.code == 0) {
							this.formLabelAlign2 = {
								coding: data.data.Supplier.coding,
								contact: data.data.Supplier.contact,
								email: data.data.Supplier.email,
								fax: data.data.Supplier.fax,
								name: data.data.Supplier.name,
								phone: data.data.Supplier.phone,
								remark: data.data.Supplier.remark,
								postcode: data.data.Supplier.postcode,
								address: data.data.Supplier.address,
								id: data.data.Supplier.id
							}
						}else {
							this.$message({
								type: 'error',
								message: data.data.msg
							});
						}
					})
				},
				// 供应商编辑保存
				supplierEditSave() {
					this.$refs.ruleForm2.validate((valid) => {
							if (valid) {
								supplierEditSave(this.formLabelAlign2).then(data => {
									if(data.data.code == 0) {
										this.$notify({
											title: '成功',
											message: '修改供应商成功!',
											type: 'success',
											duration: 3000
										});
										this.closeDialog2();
										this.getSupplierList(JSON.stringify(this.form));
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
					this.$confirm('确认要删除该供应商代码为【'+ row.coding +'】的供应商吗?', '警告', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'error'
							}).then(() => {
								let newObj={
									ids: row.id.toString()
								}
								this.supplierDelete(newObj);
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
								this.supplierDelete(newObj);
							}).catch(() => {
								this.$message({
									type: 'info',
									message: '已取消删除!'
								});
					});
				},
				//删除数据的方法
				supplierDelete(obj){
					supplierDelete(obj).then(data=>{
						if(data.data.code==0&&data.data.count){
							this.getSupplierList(JSON.stringify(this.form));
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
	    	search(){
					this.form = {
						pageNum: 1,
						pageSize: 5
					}
	    		Object.assign(this.form, this.searchData);
					this.getSupplierList(JSON.stringify(this.form));
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
					this.getSupplierList(JSON.stringify(this.form));
	    	},
		    handleCurrentChange(val) {
	    		this.form.pageNum=val;
	        this.getSupplierList(JSON.stringify(this.form));
	    	}
	    }
	}
</script>

<style>

</style>
