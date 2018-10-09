<template>
	<div class="container">
		<el-form :inline="true" class="demo-form-inline">
			<el-form-item>
        <span v-for="(item,index) in power" :key="index">
			  <el-button v-if="item.name.trim()=='新增'" type="success" icon="el-icon-plus" @click="ruleType('add')">新增规则</el-button>
			  <el-button v-if="item.name.trim()=='删除'" type="danger" icon="el-icon-delete" :disabled="allSelect" @click="deletSome">删除</el-button>
        </span>
			  <!-- <el-button type="danger" icon="iconfont icon-jichutubiao-">导入</el-button>
			  <el-button type="warning" icon="iconfont icon-daoru">导出</el-button> -->
		 	</el-form-item>
		</el-form>

		 <el-table
		    ref="multipleTable"
		    :data="data"
		    tooltip-effect="dark"
		    style="width: 100%"
		    @selection-change="selectChange"
		   	>
		    <el-table-column
		      type="selection"
		      width="55">
		    </el-table-column>
		    <el-table-column
				prop="ruleName"
		      label="规则名称"
		      >
		    </el-table-column>
		    <el-table-column
		      prop="creator"
		      label="创建者"
		     >
		    </el-table-column>
		    <el-table-column
		      prop="createTime"
		      label="创建时间"
		        show-overflow-tooltip
		      >
		    </el-table-column>
		    <el-table-column
		      prop="checkerName"
		      label="审核者"
		      >
		    </el-table-column>
		     <el-table-column
		      prop="startTime"
		      label="开始时间"
		      show-overflow-tooltip
		      >
		    </el-table-column>
		     <el-table-column
		      prop="endTime"
		      label="结束时间"
		      show-overflow-tooltip
		      >
		    </el-table-column>
		     <el-table-column
		      prop="plan"
		      label="预算方案"
		      >
		    </el-table-column>
		     <el-table-column
		      prop="budgetPrice"
		      label="预算价格(万元)"
		      >
		    </el-table-column>
		     <el-table-column
		      prop="summary"
		      label="备注"
		      show-overflow-tooltip
		      >
		    </el-table-column>
		    <el-table-column
		      label="启用状态"
		     	align="center"
		      >
				<template slot-scope="scope">
					<span v-if="searchButton == true">
						<el-tooltip v-if="scope.row.isUseStatus== '1'" class="item" effect="dark" :content="tip" placement="top-start">
							<el-switch
								:disabled="scope.row.isUseStatus== '1'"
								v-model="scope.row.status"
								active-color="#13ce66"
								inactive-color="#ff4949"
								@change="changEnable(scope.row)">
							</el-switch>
						</el-tooltip>
						<el-switch
						v-else
						v-model="scope.row.status"
						active-color="#13ce66"
						inactive-color="#ff4949"
						@change="changEnable(scope.row)"
						:disabled="scope.row.isUseStatus== '1'"
						>
						</el-switch>
					</span>
					<span v-else>
						<span v-if="scope.row.status == 1">禁用</span>
						<span v-if="scope.row.status == 0">启用</span>
					</span>	
			   </template>
		    </el-table-column>
		     <el-table-column
		      label="操作"
		      >
		      	<template slot-scope="scope">
             <!-- <span   v-if="scope.row.isUseStatus == '0' || scope.row.isUseStatus == 'null'">
				  <el-button v-if="item.name.trim()=='修改'" type="text" size="mini" @click="ruleType('edit', scope.row)">查看/修改</el-button>
				  <el-button v-if="item.name.trim()=='删除'" type="text" size="mini" :style="{color:'#f56c6c'}" @click="dalet(scope.row)">删除</el-button>
             </span>
			 <span v-else></span> -->
					<span v-if="scope.row.isUseStatus == '1'">----</span>
					<span v-else>
						<span v-for="(item,index) in power" :key="index">
							<el-button v-if="item.name.trim()=='修改'" type="text" size="mini" @click="ruleType('edit', scope.row)">修改</el-button>
							<el-button v-if="item.name.trim()=='删除'" type="text" size="mini" :style="{color:'#f56c6c'}" @click="dalet(scope.row)">删除</el-button>
						</span>
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
		<dia-log :visible.sync="visible" :title="diaLogTitle" top="10vh" width="650px" :before-close='closeDialog'>
			 <el-form ref="ruleForm" :model="ruleForm" :rules="rules"  status-icon label-width="120px" size="small" style="max-width:600px">
	  		  <el-form-item label="复本数(本)" prop="duplicateQty">
	  		   	<el-tooltip class="item" effect="light" content="表示同一种图书最大可采购的复本数，为空则表示不限制" placement="top">
	     			  <el-input-number v-model="ruleForm.duplicateQty" :step="1" :min="0"></el-input-number>
	    		</el-tooltip>
	  		  </el-form-item>
	  			<el-form-item label="出版年份" prop="publishYear">
				    <el-col :span="11">
	  		   	<el-tooltip class="item" effect="light" content="使用‘~’号表示一段起止时间段，如：2017~2018，为空则不限制" placement="top">
	  		   		<el-input v-model="ruleForm.publishYear" @keyup.native="justNumber4('publishYear')" @afterpaste.native="justNumber4('publishYear')"></el-input>
                        <!-- <el-date-picker
                          v-model="ruleForm.publishYear"
                          type="date"
                          placeholder="选择日期"
                        >
                        </el-date-picker> -->
	    			</el-tooltip>
				    </el-col>
				    <el-col :span="11">
							&nbsp;
							<el-radio v-model="ruleForm.publishYearAllow" label="1">只允许</el-radio>
							<el-radio v-model="ruleForm.publishYearAllow" label="-1">只禁止</el-radio>
				    </el-col>
	  		  </el-form-item>
	  		  <el-form-item label="分类号" prop="categoryNo">
				    <el-col :span="11">
						<el-tooltip class="item" effect="light" content="多个之间用逗号(，)隔开，如：I2,I4，为空则不限制。" placement="top">
								<!-- <el-select v-model="ruleForm.categoryNo" multiple placeholder="请选择">
									<el-option label="马克思列宁主义" value="A"></el-option>
									<el-option label="哲学、宗教" value="B"></el-option>
									<el-option label="社会科学总论" value="C"></el-option>
									<el-option label="政治、法律" value="D"></el-option>
									<el-option label="军事" value="E"></el-option>
									<el-option label="经济" value="F"></el-option>
									<el-option label="文化、科学、教育、体育" value="G"></el-option>
									<el-option label="语言、文字" value="H"></el-option>
									<el-option label="文学" value="I"></el-option>
									<el-option label="艺术" value="J"></el-option>
									<el-option label="历史、地理" value="K"></el-option>
									<el-option label="自然科学总论" value="N"></el-option>
									<el-option label="数理科学和化学" value="O"></el-option>
									<el-option label="天文学、地球科学" value="P"></el-option>
									<el-option label="生物科学" value="Q"></el-option>
									<el-option label="医药、卫生" value="R"></el-option>
									<el-option label="农业科学" value="S"></el-option>
									<el-option label="工业技术" value="T"></el-option>
									<el-option label="交通运输" value="U"></el-option>
									<el-option label="航空、航天" value="V"></el-option>
									<el-option label="环境科学、安全科学" value="X"></el-option>
									<el-option label="综合性图书" value="Z"></el-option>
								</el-select>	 -->
							<el-input v-model="ruleForm.categoryNo"></el-input>
						</el-tooltip>
				    </el-col>
						&nbsp;
						<el-radio v-model="ruleForm.categoryNoAllow" label="1">只允许</el-radio>
						<el-radio v-model="ruleForm.categoryNoAllow" label="-1">只禁止</el-radio>
	  		  </el-form-item>
	  		 <el-form-item label="图书单价" prop="bookPrice">
					 <el-tooltip class="item" effect="light" content="注：使用“~”表示价格区间，如：50~60，为空则不限制" placement="top">
			       		<el-input v-model="ruleForm.bookPrice"></el-input>
					</el-tooltip>
	  		  </el-form-item>
	  		   <el-form-item label="图书开本" >
					 <el-tooltip class="item" effect="light" content="注：表示对借购图书的开本进行限制，多个之间用分号(;)隔开，为空则表示不限制。" placement="top">
	  		   		<el-select v-model="ruleForm.bookSize" multiple placeholder="请选择">
									<el-option :label="item.size" :value="item.id.toString()" v-for="item in bookSizeList" :key="item.id" ></el-option>
							</el-select>
						</el-tooltip>
	    		    &nbsp;
	    		    <el-radio v-model="ruleForm.bookSizeAllow" label="1">只允许</el-radio>
              <el-radio v-model="ruleForm.bookSizeAllow" label="-1">只禁止</el-radio>
	  		  </el-form-item>
	  		  <el-form-item label="图书页数" >
				    <el-col :span="11">
							<el-tooltip class="item" effect="light" content="注：表示对借购图书的页数进行限制，多个之间用分号(;)隔开，为空则表示不限制。" placement="top">
								<el-input v-model.number="ruleForm.pages"></el-input>
							</el-tooltip>
				    </el-col>
				    <el-col :span="11">
							 &nbsp;
						  <el-radio v-model="ruleForm.pagesAllow" label="1">只允许</el-radio>
							<el-radio v-model="ruleForm.pagesAllow" label="-1">只禁止</el-radio>
				    </el-col>
	  		  </el-form-item>
	  		  <el-form-item label="出版单位" >
				    <el-col :span="11">
							<el-tooltip class="item" effect="light" content="注：表示对借购图书的出版单位进行限制。多个之间用分号(;)隔开，为空则表示不限制。" placement="top">
								<!-- <el-select v-model="ruleForm.publisher" multiple placeholder="请选择">
									<el-option :label="item.name" :value="item.id.toString()" v-for="item in publisherList" :key="item.id" ></el-option>
								</el-select> -->
								<el-input v-model="ruleForm.publisher"></el-input>
							</el-tooltip>
				    </el-col>
						&nbsp;
						<el-radio v-model="ruleForm.publisherAllow" label="1">只允许</el-radio>
						<el-radio v-model="ruleForm.publisherAllow" label="-1">只禁止</el-radio>
	  		  </el-form-item>
					<el-form-item label="创建者" v-if="isShow">
						<el-input :disabled="true" v-model="ruleForm.creator"></el-input>
					</el-form-item>
					<el-form-item label="创建时间" v-if="isShow">
						<el-input :disabled="true"  v-model="ruleForm.createTime"></el-input>
					</el-form-item>
	  		  <el-form-item label="是否启用" >
	    			<el-select v-model="ruleForm.status">
							<el-option label="启用" value="0"></el-option>
							<el-option label="不启用" value="1"></el-option>
						</el-select>
	  		  </el-form-item>
	  		  <el-form-item label="审核者" >
				<el-select v-model="ruleForm.checker" >
					<el-option label="无" value=""></el-option>
					<el-option :label="item.loginName" :value="item.id" v-for="item in oprlist" :key="item.id"></el-option>
				</el-select>
	  		  </el-form-item>
	  		  <el-form-item label="有效时间" prop="name">
				<el-date-picker
					v-model="picker"
					type="daterange"
					range-separator="-"
					start-placeholder="开始日期"
					end-placeholder="结束日期">
				</el-date-picker>
	  		  </el-form-item>
	  		  <!-- <el-form-item label="订购号生成规则">
						<el-col :span="9">
							 <el-input v-model="ruleForm.prefix" placeholder="订购号前缀，如：Ding"></el-input>
						</el-col>
						<el-col class="line" :span="1">&nbsp;</el-col>
	     			<el-col :span="6">
							 <el-input v-model="ruleForm.totalnum" placeholder="订购号总位数"></el-input>
						</el-col>
						<el-col class="line" :span="1">&nbsp;</el-col>
						<el-col :span="7">
							 <el-input v-model="ruleForm.startnum" placeholder="订购号起始数字"></el-input>
						</el-col>
	  		  </el-form-item> -->
	  		  <el-form-item label="备注">
	     			 <el-input type="textarea" v-model="ruleForm.summary"></el-input>
	  		  </el-form-item>
			</el-form>
			<div slot="footers">
				 <el-button type="success" @click="RuleSave('add')" v-if="addShow" :loading="addLoading">保存</el-button>
				 <el-button type="success" @click="RuleSave('edit')" v-if="isShow" :loading="editLoading">保存</el-button>
	  		 <el-button @click="closeDialog">取消</el-button>
			</div>


		</dia-log>

	</div>
</template>

<script>
import DiaLog from '@/components/Dialog'
import {purchaseruleList,addRule,addRuleSave,editRuleSave,deleteRule,setstatus,editRule,operatorList} from '@/request/order'
import {getData} from '@/methods/method'
import moment from "moment";
  export default{
  	components:{
  		DiaLog
  	},
  	data(){
		var bookPrice = (rule, value, callback) => {
			let str = /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
			if (!str.test(value)) {
				callback(new Error("金额格式不正确，金额为非负整数，正小数（小数位不超过2位）"));
			} else {
				callback();
			}
		};
		// var categoryNo = (rule, value, callback) => {
		// 	if(!value) {
		// 		callback();
		// 	}
		// 	let str = /^[a-zA-Z0-9][.][/]$/;
		// 	if (!str.test(value)) {
		// 		callback(new Error("分类号格式不对"));
		// 	} else {
		// 		callback();
		// 	}
		// };
  		return {
			addLoading: false,
			editLoading: false,
			rules: {
				bookPrice: [{ required: true, message: '图书单价不能为空', trigger: "blur" },
							{validator: bookPrice, trigger: "blur"}],
				publishYear: [{ required: true, message: '出版年份不能为空', trigger: "blur" }],
				// categoryNo: [{validator: categoryNo, trigger: "blur"}]
			},
  			pickerOptions2: {
	          shortcuts: [{
	            text: '最近一周',
	            onClick(picker) {
	              const end = new Date();
	              const start = new Date();
	              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
	              picker.$emit('pick', [start, end]);
	            }
	          }, {
	            text: '最近一个月',
	            onClick(picker) {
	              const end = new Date();
	              const start = new Date();
	              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
	              picker.$emit('pick', [start, end]);
	            }
	          }, {
	            text: '最近三个月',
	            onClick(picker) {
	              const end = new Date();
	              const start = new Date();
	              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
	              picker.$emit('pick', [start, end]);
	            }
	          }]
			},
			picker: [],
  			oprlist: {},
			visible: false,
			isShow: false,
			addShow: true,
  			allSelect:true,
  			diaLogTitle:'',
			selection:[],
			tip: '该规则正被使用，该状态不可切换！',
  			form:{
  				radio:'1',
  				pageSize:5,
  				pageNum:1
				},
				ruleForm: {
					duplicateQty: '',
					publishYear: '',
					categoryNo: '',
					bookPrice: '',
					pages: '',
					status: '',
					categoryNoAllow: '',
					bookSizeAllow: '',
					creator: '',
					createTime: '',
					totalnum: '',
					startnum: '',
					publisherAllow: '',
					pagesAllow: '',
					publishYearAllow: '',
					prefix: '',
					summary: '',
					publisher: [],
					bookSize: [],
					startTime: '',
					endTime: ''
				},
  			data:[],
				dataPage:{},
				diaLogMsg: '',
				bookSizeList: [], // 图书开本
				catalogList: [],  // 分类号
				publisherList: [], // 出版单位
        power:[],//按钮权限数组
        searchButton:false
  		}
  	},
  	created(){
      	this.getPowerArr();
		this.getData();
		this.getOperatorList();
  	},
  	methods:{
      //得到权限按钮数组
      getPowerArr(){
        let  obj;
        let  power =this.$route.meta.power;
        for(let i=0,len=power.length;i<len;i++){
          if(power[i].name=='修改'){
            this.searchButton=true;
          }
        }
        this.power=power;
      },
  		getData(){
  			getData.call(this,purchaseruleList,this.form).then(data=>{
  				for(let i of this.data){
	  				if(i.status=='1'){
	  					i.status=false;
	  				}else{
	  					i.status=true;
					}
  				}
  			}).catch(err=>{})
  		},
  		handleSizeChange(val) {
  			this.form.pageSize=val;
  			this.getData();
	    },
	    handleCurrentChange(val) {
	    	this.form.pageNum=val;
	       this.getData();
	    },
  		selectChange(selection){
  			if(selection.length&&selection.length>0){
  				this.allSelect=false;
  				this.selection=selection;
  			}else{
  				this.allSelect=true;
  			}
  		},
  		changEnable(row){
  			let arr=[row.id]
  			let obj={
  				ids:arr.toString(),
  				status:row.status?"0":"1"
  			}
			setstatus(obj).then(data=>{
				if(data.data.code==0){
					this.$message({
			          message: '状态切换成功!',
			          type: 'success'
			        });
				}else{
					this.$message({
			          message: data.data.msg,
			          type: 'error'
			        });
				}
			})

		  },
		//审核者下拉框数据
		getOperatorList() {
			operatorList().then(data =>{
				if(data.data.code == 0) {
					this.oprlist = data.data.oprlist;
				}else {
					this.$message({
			          message: data.data.msg,
			          type: 'error'
			        });
				}
			})
		},
  		//删除多条
  		deletSome(){
  			this.$confirm('是否要删除这'+this.selection.length+'条规则?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	let arr=[];
		        	for(let i of this.selection){
		        		arr.push(i.id);
		        	}
		        	let obj={
		        		ids:arr.toString()
		        	}
		        	this.deletOne(obj);
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除操作!'
		          });
		        });
  		},
  		//删除一条
  		deletOne(obj){
  			deleteRule(obj).then(data=>{
  				if(data.data.code==0){
  					this.$message({
		              type: 'success',
		              message: '删除成功!'
		            });
  					this.getData();
				}else{
					this.$message({
						type: 'error',
						message: data.data.msg
					});
				}
  			})
  		},
  		dalet(row){
  			this.$confirm('是否要删除此条规则?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	let arr=[row.id];
		        	let obj={
		        		ids:arr.toString()
		        	}
		        	this.deletOne(obj);

		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除操作!'
		          });
		        });
			},
			// 获取下拉框
			addRule() {
				addRule().then(data =>{
					if(data.data.code == 0) {
						this.bookSizeList = data.data.PurchaseRule.bookSizeList;
						// this.publisherList = data.data.PurchaseRule.publisherList;
					}else {
						this.$message({
							type: 'error',
							message: data.data.msg
						});
					}
				})
			},
			// 获取修改信息
			editRule(Id) {
				editRule(Id).then(data =>{
					if(data.data.code == 0) {
						this.ruleForm = {
							createTime: data.data.PurchaseRule.createTime,
							creator: data.data.PurchaseRule.creator,
							duplicateQty: data.data.PurchaseRule.duplicateQty,
							publisher: data.data.PurchaseRule.publisher,
							bookPrice: data.data.PurchaseRule.bookPrice,
							publishYear: data.data.PurchaseRule.publishYear,
							status: data.data.PurchaseRule.status,
							publishYearAllow: data.data.PurchaseRule.publishYearAllow,
							publisherAllow: data.data.PurchaseRule.publisherAllow,
							bookSizeAllow: data.data.PurchaseRule.bookSizeAllow,
							categoryNoAllow: data.data.PurchaseRule.categoryNoAllow,
							categoryNo: data.data.PurchaseRule.categoryNo,
							totalnum: data.data.PurchaseRule.totalnum,
							startnum: data.data.PurchaseRule.startnum,
							bookSize: data.data.PurchaseRule.bookSize == ''? data.data.PurchaseRule.bookSize: data.data.PurchaseRule.bookSize.split(',').map(String),
							prefix: data.data.PurchaseRule.prefix,
							summary: data.data.PurchaseRule.summary,
							startTime: data.data.PurchaseRule.startTime,
							endTime: data.data.PurchaseRule.endTime,
							id: Id,
							checker: data.data.PurchaseRule.checker,
							pages: data.data.PurchaseRule.pages,
							pagesAllow: data.data.PurchaseRule.pagesAllow
						}
						this.bookSizeList = data.data.PurchaseRule.bookSizeList;
						// this.publisherList = data.data.PurchaseRule.publisherList;
					}else {
						this.$message({
							type: 'error',
							message: data.data.msg
						});
					}
				})
			},
			// 新增、修改规则调用方式
			RuleSave(type) {
				if(type == 'add') {
					// this.ruleForm.publisher = this.ruleForm.publisher;
					this.ruleForm.bookSize = this.ruleForm.bookSize.join(',');
					// this.ruleForm.categoryNo = this.ruleForm.categoryNo.join(',');
					// this.ruleForm.publishYear = moment(this.ruleForm.publishYear).format('YYYY-MM-DD');
					// this.ruleForm.publishYear = this.ruleForm.publishYear== "Invalid date"? '': this.ruleForm.publishYear;
					this.ruleForm.startTime = moment(this.ruleForm.startTime).format('YYYY-MM-DD');
					this.ruleForm.endTime = moment(this.ruleForm.endTime).format('YYYY-MM-DD');
					this.$refs.ruleForm.validate(valid => {
						if(valid) {
							this.addLoading = true;
							addRuleSave(this.ruleForm).then(data =>{
								if(data.data.code == 0) {
									this.visible = false;
									this.$message({
										type: 'success',
										message: this.diaLogMsg
									});
									this.addLoading = false;
									this.getData();
								}else {
									this.$message({
										type: 'error',
										message: data.data.msg
									});
									this.addLoading = false;
								}
							})
						}
					})		
				}else{
					// this.ruleForm.publisher = this.ruleForm.publisher;
					this.ruleForm.bookSize = this.ruleForm.bookSize.join(',');
					this.$refs.ruleForm.validate(valid => {
						if(valid) {
							this.editLoading = true;
							editRuleSave(this.ruleForm).then(data =>{
								if(data.data.code == 0) {
									this.visible = false;
									this.$message({
										type: 'success',
										message: this.diaLogMsg
									});
									this.editLoading = false;
									this.getData();
								}else {
									this.$message({
										type: 'error',
										message: data.data.msg
									});
									this.editLoading = false;
								}
							})
						}
					})
					
				}
			},
  		ruleType(type,row){
				if( type == 'add') {
					this.diaLogTitle='新增规则';
					this.visible=true;
					this.addRule();
					this.isShow = false;
					this.addShow = true;
					this.diaLogMsg = '新增规则成功';
					this.ruleForm = {
						duplicateQty: '',
						publishYear: '',
						categoryNo: '',
						bookPrice: '',
						pages: '',
						status: '',
						categoryNoAllow: '',
						bookSizeAllow: '',
						creator: '',
						createTime: '',
						totalnum: '',
						startnum: '',
						publisherAllow: '',
						pagesAllow: '',
						publishYearAllow: '',
						prefix: '',
						summary: '',
						publisher: '',
						bookSize: []
					}
				}else {
					this.diaLogTitle='修改规则';
					this.visible = true;
					this.isShow = true;
					this.addShow = false;
					let Id = row.id;
					this.editRule(Id);
					this.diaLogMsg = '修改该规则成功';

				}
		  },
		closeDialog() {
			this.visible = false;
			this.$refs.ruleForm.resetFields();
		},
		// 日期只能输入数字和-,.
		justNumber4(obj){
			if(this.ruleForm[obj]){
			this.ruleForm[obj]=this.ruleForm[obj].toString().replace(/[^\d\.\~]/g,'')
			}
		}
	  },
	  watch:{
  		picker(newVal){
  			if(newVal&&newVal.length>0){
	  			this.ruleForm.startTime=newVal[0];
	  			this.ruleForm.endTime=newVal[1];
  			}else{
  				this.ruleForm.startTime='';
  				this.ruleForm.endTime='';
  			}
  		},
	}
  }

</script>

<style>
	.el-radio+.el-radio{
		margin-left: 10px;
	}
	.line{
		text-align: center;
	}

</style>


