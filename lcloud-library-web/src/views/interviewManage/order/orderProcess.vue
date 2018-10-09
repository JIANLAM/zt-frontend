<template>
	<div class="container">
		<el-form :inline="true" :model="form" class="demo-form-inline">
      <span v-if="searchButton">
        <el-form-item label="">
				 <el-input placeholder="请输入内容" v-model="form.searchValue" class="input-with-select" @keyup.enter.native="searchData" clearable>
				    <el-select v-model="form.searchKey" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
				      	<el-option label="图书名称" value="title"></el-option>
              <!-- <el-option label="读者证号" value="creatorName"></el-option>			 -->
				        <el-option label="作者" value="author"></el-option>
				        <el-option label="ISBN" value="isbn"></el-option>
						<el-option label="出版社" value="publisher"></el-option>
				    </el-select>
				  </el-input>
			</el-form-item>
			  <el-form-item label="出版时间">
				  <el-date-picker
            v-model="picker"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd">
			    </el-date-picker>
			</el-form-item>
      </span>

      <span v-for="(item,index) in power" :key="index">
			    <el-button v-if="item.name.trim()=='检索'" type="primary" icon="el-icon-search" @click="searchData">检索</el-button>
			  	<el-button v-if="item.name.trim()=='加入订购单'" type="success" icon="el-icon-plus" :disabled="allSelect" @click="addCar" :style="{marginLeft:'10px'}">加入订购单</el-button>
					<!-- <el-button type="success" icon="el-icon-plus" @click="addOrder">新增订购单</el-button> -->
			  	 <!-- <el-button icon="el-icon-setting">设置订购数</el-button> -->
			    <el-popover
						placement="bottom"
						title="查询条件"
						v-model="visible3"
          >
						<el-checkbox-group v-model="type">
								<el-checkbox label="title" name="title">图书名称</el-checkbox>
								<el-checkbox label="ISBN" name="isbn">ISBN</el-checkbox>
								<el-checkbox label="author" name="author">作者</el-checkbox>
								<el-checkbox label="分类号" name="type">分类号</el-checkbox>
								<el-checkbox label="publisher" name="publisher">出版社</el-checkbox>
								<el-checkbox label="出版时间" name="type">出版时间</el-checkbox>
								<el-checkbox label="单价" name="type">单价</el-checkbox>
							</el-checkbox-group>
							<div style="text-align: right; margin:10px 0 0">
								<el-button size="mini" type="text" @click="visible3 = false">取消</el-button>
								<el-button type="primary" size="mini" @click="cnkiOk">确定</el-button>
							</div>
						<el-button v-if="item.name.trim()=='查重'" type="danger" class="el-icon-search" :style="{marginLeft:'10px'}" :disabled="isCheck" @click="cnki" slot="reference"> 查重</el-button>
					</el-popover>
			    <el-button v-if="item.name.trim()=='导出'" type="warning" icon="iconfont icon-daoru" :style="{marginLeft:'10px'}" :disabled="isCheck" @click="exportRecommbuy">导出</el-button>
      </span>
		</el-form>
 		<el-table
		    ref="multipleTable"
		    :data="data"
		    tooltip-effect="dark"
		    style="width: 100%"
		    @selection-change="selectChange"
		     v-loading="loading"
		   	>
		    <el-table-column
		      type="selection"
		      width="55">
		    </el-table-column>
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
				prop="recount"
		      label="荐购次数"
		      >
		    </el-table-column>
		    <el-table-column
					 prop="source"
		      label="图书来源"
		      :formatter="resourceFormatter"
		      >
		    </el-table-column>
				<el-table-column
		      label="查重状态"
					align="center"
		      >
					<template slot-scope="scope">
						<span style="color:red;">{{scope.row.cnkiResult}}</span>
					</template>
		    </el-table-column>
		    <!-- <el-table-column
				prop="summary"
		      label="备注"
		      show-overflow-tooltip
		      >
		    </el-table-column> -->
		     <!-- <el-table-column
		      label="操作"
		      >
		      	<template slot-scope="scope">
				  <el-button type="text" size="mini" @click="addCar(scope.row)">加入订购单</el-button>

			   </template>
		    </el-table-column> -->

		  </el-table>
		<el-row>
  			<el-col :span="24" >
		  		 <el-pagination
			      :page-sizes="[3, 5, 10, 20]"
			      :page-size="searchDataForm.pageSize"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="dataPage.total"
			       @size-change="handleSizeChange"
	              @current-change="handleCurrentChange"
	              :current-page="dataPage.pageNum"
								style="float:left;">
			   	 </el-pagination>
						<div class="selected" :model="orderCode" v-if="isNM">当前已选订购单：{{orderCode}}</div>
   			</el-col>
		</el-row>

		<!-- <dia-log :visible.sync="visible2" title="新增订购单" width='600px'>
				<el-form  label-width="120px" :model="newOrder">
			  <el-form-item label="经费编码：">
			    <el-select placeholder="请选择" style="width: 90%;" >
			      <el-option label="馆员荐购" value="1"></el-option>
			      <el-option label="读者荐购" value="2"></el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item label="订购规则：">
			    <el-select placeholder="请选择" style="width: 90%;">
			      <el-option label="是" value="1"></el-option>
			      <el-option label="否" value="2"></el-option>
			    </el-select>
			  </el-form-item>
				<el-form-item label="收货地址：">
			    <el-select placeholder="请选择" style="width: 90%;">
			      <el-option label="是" value="1"></el-option>
			      <el-option label="否" value="2"></el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item label="备注：">
			    <el-input style="width: 90%;" type="textarea"></el-input>
			  </el-form-item>
			</el-form>
			<div slot="footers">
				<el-button type="primary" round>确定</el-button>
				<el-button @click="visible2 = false" round>取消</el-button>
			</div>
		</dia-log> -->
		<dia-log :visible.sync="visible" title="选择订购单" width="1050px">

				<el-form :inline="true" :model="searchTj" class="demo-form-inline">
				<el-form-item label="">
					<el-input placeholder="请输入内容" v-model="searchTj.searchValue" class="input-with-select" clearable>
							<el-select v-model="searchTj.searchKey" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
								<el-option label="创建者账户" value="creatorAccount"></el-option>
								<el-option label="订购号" value="purchaseCode"></el-option>
								<el-option label="创建者姓名" value="creatorName"></el-option>
								<el-option label="图书名称" value="title"></el-option>
								<el-option label="ISBN" value="isbn"></el-option>
								<el-option label="出版社" value="publisher"></el-option>
							</el-select>
						</el-input>
				</el-form-item>
				<el-form-item label="审核状态">
						<el-select v-model="searchTj.checkStatusSearch" placeholder="审核状态">
							<el-option label="所有" value=""></el-option>
							<el-option label="通过" value="1"></el-option>
							<el-option label="未通过" value="2"></el-option>
							<el-option label="未审核" value="0"></el-option>
						</el-select>
				</el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="search" style="margin-top: 0">检索</el-button>
			</el-form>
				<el-table
						ref="multipleTable"
						:data="orderbuyData"
						tooltip-effect="dark"
						style="width: 100%"
						v-loading="orderLoading"
						height="400"
						align="center"
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
						prop="creatorAccount"
			      label="创建者账号"
			      >
			    </el-table-column>
					<el-table-column
						prop="creatorName"
			      label="创建者姓名"
			      >
			    </el-table-column>
			    <el-table-column
						prop="ruleName"
			      label="规则名称"
			      >
					</el-table-column>
					<el-table-column
						prop="createTime"
						label="创建时间"
					>
			    </el-table-column>
			     <el-table-column
			      label="操作"
			      >
			      <template slot-scope="scope">
					 		 <el-button type="text" size="mini" @click="addDgd(scope.row)">确定加入</el-button>
				   </template>
			    </el-table-column>
			  </el-table>
			   <!-- <el-form :model="diaLogForm" :rules="rules" label-width="80px" ref="ruleForm" status-icon v-else>
				    <el-form-item label="订购规则" prop="ruleId">
				      <el-select v-model="diaLogForm.ruleId" placeholder="请选择订购规则" >
				      	<el-option label="关闭规则" value="0"></el-option>
				        <el-option :label="item.ruleName" :value="item.id" v-for="item in ruleList" :key="item.id" ></el-option>
				      </el-select>
				    </el-form-item>
				    <el-form-item label="备注信息">
					    <el-input type="textarea" v-model="diaLogForm.summary" placeholder="可不填"></el-input>
					</el-form-item>
			  </el-form> -->

			<!-- <div slot="footers">
				<span style="fontSize:14px;" v-if="!isAddOrder">不想添加到已有订单?点击 <el-button type="text" size="mini" style="fontSize:16px;color:#67C23A;" @click="isAddOrder=true">新增订单</el-button></span>
				<el-button type="success" v-else>新增并加入图书</el-button>
			</div> -->
		</dia-log>
	</div>
</template>

<script>
import { recommbuyList, dupsearch, orderbuyAdd, orderbuy, addrecommbuy, exportRecommbuy } from '@/request/order'
import DiaLog from '@/components/Dialog'
  export default{
  	components:{
  		DiaLog
  	},
  	data(){
  		return {
  			isFirst: true,
  			isAddOrder: false,
				visible: false,
				visible2: false,
				visible3: false,
  			allSelect: true,
				loading: false,
				orderLoading: false,
  			picker: [],
  			form: {
  				searchKey:'title',
  				searchValue: '',
  				startTime: '',
  				endTime: ''
				},
				form1: {
					searchKey:'',
  				searchValue:'',
  				startTime:'',
  				timeKey:'pubdate',
  				endTime:'',
  				checkStatusSearch:'',
  				orderCodeHave:0
				},
				diaLogForm:{},
				rules: {},
  			searchDataForm:{
  				searchKey: '',
  				searchValue: '',
  				pageNum: 1,
  				pageSize: 5,
  				timeKey: 'pubdate',
  				startTime: '',
  				endTime: ''
				},
				searchTj:{ //表单v-model的值
  				searchKey:'creatorAccount',
  				searchValue:'',
  				checkStatusSearch:''
  			},
				dataSelection: {},
				isCheck: true,
				type: [],
				data: [],
				orderbuyData: [],
				dataPage: {},
				orderCode: '',
				isNM: false,
				newOrder: {},
        power:[],//按钮权限数组
        searchButton:false
  		}
  	},
  	created(){
      this.getPowerArr();
  		this.getData(this.searchDataForm);
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
  		getData(obj) {
  			this.loading= true;
  			recommbuyList(obj).then(data=>{
  				if(data.data.code==0){
  					this.dataPage=data.data.page;
  					if(data.data.page.list&&data.data.page.list.length>0){
  						this.data=data.data.page.list;
  					}else{
  						this.data=[];
						}
						this.loading= false;
  				}
  			})
			},
			getOrderbuy(obj) {
					this.orderLoading= true;
					orderbuy(obj).then(data=>{
						if(data.data.code==0){
							if(data.data.page.list&&data.data.page.list.length>0){
								this.orderbuyData=data.data.page.list;
							}else{
									this.orderbuyData=[];
								}
								this.orderLoading= false;
						}
					}).catch(error=>{
					})
				},
				addDgd(row){
					let arr=[];
					let str=''
					for(let i of this.dataSelection){
						arr.push(i.id);
					}
					for(let j = 0; j < arr.length; j++) {
						str+= arr[j] + '-' + '0' + ',';
					}
					let obj = {
						orderId: row.id.toString(),
						ids: str.substring(0,str.length-1)
					}
					addrecommbuy(obj).then(data=>{
						if(data.data.code == 0) {
							this.visible = false;
							let purchaseOrder = data.data.res.purchaseOrder;
							this.orderCode = purchaseOrder.purchaseCode;
							this.isNM = true;
							this.$message({
								type: 'success',
								message: '所选图书已加入订购单！',
								duration:'3000'
							});

						}
				});
			},
  		//图书来源格式化
	    resourceFormatter(row, column, cellValue, index){
	    	if(cellValue==1){
	    		return '新华集团'
	    	}else if(cellValue==2){
	    		return '本馆图书'
	    	}else if(cellValue==3){
	    		return '豆瓣图书'
	    	}else{
	    		return '成员馆图书'
	    	}

			},
			//导出多条荐购信息
				exportRecommbuy(){
					this.$confirm('是否要导出这'+this.dataSelection.length+'条荐购信息?', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
						}).then(() => {
							let arr=[];
							for(let i in this.dataSelection){
								arr.push(this.dataSelection[i].id)
							}

							let obj={
								ids:arr.toString()
							}
							exportRecommbuy(JSON.stringify(obj)).then(data=>{
								if(data.data.code==0){
									this.$message({
										type: 'success',
										message: '导出成功!正在下载，请稍后..',
										duration:'6000'
									});
									window.location.href=data.data.xlsurl;

								}else{
									this.$message({
										type: 'error',
										message: data.data.msg,
										duration:'4000'
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
	    searchData(){
				Object.assign(this.searchDataForm,this.form);
				this.getData(this.searchDataForm);
			 },
			 search() {
				 	Object.assign(this.form1, this.searchTj);
					this.getOrderbuy(this.form1);
			 },
			handleSizeChange(val){
				this.searchDataForm.pageSize=val;
				this.getData(this.searchDataForm);
			},
			handleCurrentChange(val){
				this.searchDataForm.pageNum=val;
				this.getData(this.searchDataForm);
			},
			indexMethod(index){
					return this.dataPage.startRow+index
				},
				selectChange(selection){
					if(selection.length&&selection.length>0){
						this.dataSelection = selection
						this.allSelect=false;
						this.isCheck = false;
					}else{
						this.dataSelection = selection
						this.allSelect=true;
						this.isCheck = false;
					}
				},
  		addCar(){
				this.visible = true;
				this.getOrderbuy(JSON.stringify(this.form1))
			},
			addOrder() {
				this.visible2 = true;
				orderbuyAdd().then(data=>{
					if(data.data.code == 0) {
						console.log(data.data.PurchaseOrder)
						this.newOrder = data.data.PurchaseOrder
					}
				})
			},
			//查询图书查重
	    cnki(){
	    	this.visible3 = !this.visible3;
	    },
			cnkiOk(){
				let arr=[];
	    	for(let i of this.dataSelection){
	    		arr.push(i.id);
				}
	    	let obj={
	    		libraryId: '1',
	    		ids:arr.toString(),
	    		case:this.type.toString()
	    	}
	    	dupsearch(obj).then(data=>{
	    		if(data.data.code==0){
	    			for(let i of this.data){
	    				for(let j in data.data.res){
	    					if(i.id==j){
									this.$set(i,'cnkiResult',data.data.res[j]);
	    					}
	    				}
						}
	    			this.visible3=false;
	    		}
				})

	    },

  	},
  	watch:{
  		picker(newVal){
  			if(newVal&&newVal.length>0){
	  			this.form.startTime=newVal[0];
	  			this.form.endTime=newVal[1];
  			}else{
  				this.form.startTime='';
  				this.form.endTime='';
  			}
  		}
  	}
  }

</script>

<style type="style/css" scoped>
	.line{
		text-align: center;
		position: absolute;
	}
	.selected{
		line-height: 30px;
	}
</style>
