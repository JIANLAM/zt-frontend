<template>
	<div class="container">
		<el-form :inline="true" :model="searchData" class="demo-form-inline" v-if="searchButton">
		  <el-form-item label="日志类型">
				    <el-select v-model="searchData.operType" placeholder="请选择" style="width: 150px;" @keyup.enter.native="search">
							<el-option label="所有" value=""></el-option>
		      		<el-option label="添加" value="添加"></el-option>
		      		<el-option label="修改" value="修改"></el-option>
		      		<el-option label="修改已选书" value="修改已选书"></el-option>
		      		<el-option label="删除" value="删除"></el-option>
		      		<el-option label="删除已选书" value="删除已选书"></el-option>
							<el-option label="自动审核" value="自动审核"></el-option>
							<el-option label="强行审核" value="强行审核"></el-option>
							<el-option label="设置订购数" value="设置订购数"></el-option>
		    		</el-select>
		  </el-form-item>
			<el-form-item label="操作员">
        <el-select v-model="searchData.loginName" @keyup.enter.native="search">
          <el-option label="所有" value=""></el-option>
          <el-option v-for="item in operatorData" :key="item.id" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
		  <el-form-item label="操作时间">
				<el-date-picker
			      v-model="picker"
			      type="daterange"
			      start-placeholder="开始日期"
			      end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
						clearable
						>
			    </el-date-picker>
		  </el-form-item>
		  <el-button type="primary" icon="el-icon-search" @click="search">检索</el-button>
		</el-form>
		<el-table
		    ref="multipleTable"
		    :data="tableData"
		    tooltip-effect="dark"
		    style="width: 100%;"
		    @selection-change="handleSelectionChange">
		    <el-table-column
		      type="index"
		      width="50"
					label="序号">
		    </el-table-column>
		    <el-table-column
		      prop="createTime"
		      label="操作时间"
					:formatter="dateFormat">
		    </el-table-column>
		    <el-table-column
		      prop="operationType"
		      label="日志类型">
		    </el-table-column>
		    <el-table-column
		      prop="loginName"
		      label="操作员账户"
		      width="150"
		      show-overflow-tooltip>
		    </el-table-column>
        <el-table-column
					prop="userName"
				  label="操作员姓名" >
				</el-table-column>
		    <el-table-column
		      prop="opContent"
		      label="内容">
		    </el-table-column>
		    <el-table-column
		      prop="remark"
		      label="备注">
		    </el-table-column>
		</el-table>
		<el-pagination
	      @size-change="handleSizeChange"
	      @current-change="handleCurrentChange"
	      :current-page="dataPage.pageNum"
	      :page-sizes="[10, 20, 30, 40]"
	      :page-size="dataPage.pageSize"
	      layout="total, sizes, prev, pager, next, jumper"
	      :total="dataPage.total">
	    </el-pagination>
	</div>
</template>
<script>
import {purchaseorderLogs} from '@/request/order';
import {cuurLibraryUser} from '@/request/systemSetup';
import moment from "moment";
	export default {
	    data() {
	      return {
	      	picker: [],
	        searchData: {
						operType: '',
						startDate: '',
						endDate: '',
						loginName: ''
					},
					operatorData: [],
					form: {
						pageNum: 1,
						pageSize: 10
					},
					tableData: [],
					dataPage: {},
          power:[],//按钮权限数组
          searchButton:false
		  }
			},
			created() {
				this.getPurchaseorderLogs(this.form);
      	this.getOperatorList();
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
				dateFormat(row, column) {
               var date = row[column.property];
          if (date == undefined) {
             return "";
          }
          return moment(date).format("YYYY-MM-DD HH:mm:ss");
				},
				getPurchaseorderLogs(obj) {
					purchaseorderLogs(obj).then(data => {
						if(data.data.code == 0) {
							this.tableData = data.data.page.list;
							this.dataPage = data.data.page;
						}else {
							this.$message({
									type: 'error',
									message: '请求成功!后台出错! '+data.data.msg,
									duration: 3 * 1000,
									showClose: true
							});
						}
					})
				},
	    	handleSelectionChange(){

				},
				// 操作员下拉框
				getOperatorList() {
					cuurLibraryUser().then(data=>{
						if(data.data.code==0){
							this.operatorData=[];
							let list=data.data.cuurLibraryUserMap;
							for(let i=0,length=list.length;i<length;i++){
								this.operatorData.push({label:list[i].login_name+"|"+list[i].username,value:list[i].login_name})
							}
						}
					});
      	},
	    	search(){
	    		this.form = {
						pageNum: 1,
						pageSize: 10,
					}
					Object.assign(this.form, this.searchData);
					this.getPurchaseorderLogs(this.form);
	    	},
	    	handleSizeChange(val) {
		      this.form.pageSize=val;
					this.getPurchaseorderLogs(this.form);
		    },
		    handleCurrentChange(val) {
		      this.form.pageNum=val;
					this.getPurchaseorderLogs(this.form);
		    }
			},
			watch:{
			picker(newVal){
				if(newVal&&newVal.length>0){
					this.searchData.startDate=newVal[0];
					this.searchData.endDate=newVal[1];
				}else{
					this.searchData.startDate='';
					this.searchData.endDate='';
				}
			}
		}
	}
</script>

<style>

</style>
