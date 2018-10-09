<template>
	<div class="container">
		<el-form :inline="true" :model="searchData" class="demo-form-inline">
      <span v-if="searchButton">
        <el-form-item label="">
				 <el-input placeholder="请输入内容" v-model="searchData.searchValue" class="input-with-select" @keyup.enter.native="search" clearable>
				    <el-select v-model="searchData.searchKey" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
				      <el-option label="订购号" value="purchaseCode"></el-option>
				      <el-option label="创建者账户" value="creatorAccount"></el-option>
				      <el-option label="创建者姓名" value="creatorName"></el-option>
				      <el-option label="图书名称" value="title"></el-option>
				    </el-select>
				  </el-input>
			</el-form-item>
			  <el-form-item label="订单状态">
			    <el-select v-model="searchData.checkStatusSearch" placeholder="审核状态">
                  <el-option label="所有" value=""></el-option>
			      <el-option label="已提交" value="0"></el-option>
			      <el-option label="已审核" value="1"></el-option>
			      <el-option label="未通过" value="2"></el-option>
			      <el-option label="未审核" value="3"></el-option>
			    </el-select>
			</el-form-item>
      </span>
      <span v-for="(item,index) in power" :key="index">
			   <el-button v-if="item.name.trim()=='检索'" type="primary" icon="el-icon-search" @click="search">检索</el-button>
      </span>
		</el-form>

 		<el-table
		    ref="multipleTable"
		    :data="data"
		    tooltip-effect="dark"
		    style="width: 100%"
		    @selection-change="selectChange"
		    v-loading="loading"
		    highlight-current-row
		    border
		   	>
		    <!-- <el-table-column
		      type="selection"
		      width="50"
		      fixed="left"
		      align="center"
		      >
		    </el-table-column> -->
		     <el-table-column
		      type="index"
		      width="50"
		      fixed="left"
		      align="center"
		      label="序号"
		      >
		    </el-table-column>
		    <el-table-column
			   prop="purchaseCode"
		      label="订购号"
		      width="140"
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
		      label="总价(万元)"
		      align="center"
		      >
		    </el-table-column>
			<el-table-column
		      label="状态"
		      width="120px"
		      align="center"
		      >
		    	<template slot-scope="scope">
		     	    <el-tag v-if="scope.row.checkStatus==0" type="warning">未审核</el-tag>
				    <el-tag v-if="scope.row.checkStatus==1" type="success">审核通过</el-tag>
				    <el-tag v-if="scope.row.checkStatus==2" type="danger">审核未通过</el-tag>
				    <el-tag v-if="scope.row.checkStatus==3" >无需审核</el-tag>
		       </template>
		    </el-table-column>
            <el-table-column
				prop="checkerAccount"
		      label="审核者账户"
		      align="center"
		      >
		    </el-table-column>
		    <el-table-column
				prop="checkerName"
		      label="审核者姓名"
		      align="center"
		      >
		    </el-table-column>
		    <el-table-column
				prop="checkTime"
		      label="审核时间"
		      align="center"
		      >
		    </el-table-column>
		     <el-table-column
		      label="操作"
		      align="center"
		      width="250px"
		      fixed="right"
		      >
		      	<template slot-scope="scope">
              <span v-for="(item,index) in power" :key="index">
                 <el-button v-if="item.name.trim()=='新增'" type="text"  :style="{color:'#67c23a'}" @click="lookBook(scope.row)">添加/查看</el-button>
                 <!-- <el-button v-if="item.name.trim()=='导入'" type="text"  :style="{color:'rgba(142, 113, 199, 0.7)'}" @click="importBook(scope.row)">导入</el-button>
                 <el-button v-if="item.name.trim()=='导出'" type="text"  :style="{color:'#e76cf5'}" @click="exportBook(scope.row)">导出</el-button> -->
                 <!-- 只有未审核的才会出现此按钮 -->
                 <el-button  type="text"  :style="{color:'#e6a23c'}" v-if="scope.row.checkStatus==0&&item.name.trim()=='审核'" @click="auditing(scope.row)">审核</el-button>
              </span>
              <!-- 无需审核和审核通过的才能提交 -->
              <el-button  type="text"  :style="{color:'#806161'}" v-if="scope.row.checkStatus==1 || scope.row.checkStatus==3" @click="submission(scope.row)">提交</el-button>
			   </template>
		    </el-table-column>
		  </el-table>
		<el-row >
  			<el-col :span="24">
		  	<el-pagination
		      :page-sizes="[1, 5, 10, 20]"
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
		<dia-log :visible.sync="visible" :title="diaLogTitle" :center="addBook" :width="addBook?'80%':'30%'" :before-close='closeDialog'>
			<div v-if="addBook">
				<el-tabs tab-position="top"  type="border-card" v-model="tabs" @tab-click="tabClick">
				    <el-tab-pane >
					    <span slot="label"><i class="el-icon-search"></i> 查询图书</span>
					   	 <el-form :inline="true" :model="addBookForm" class="demo-form-inline">
						 	<el-form-item label="">
								 <el-input placeholder="请输入内容" v-model="addBookForm.searchValue" class="input-with-select" clearable size="small">
								    <el-select v-model="addBookForm.searchKey" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
								       <el-option label="图书名称" value="title"></el-option>
								       <el-option label="ISBN" value="isbn"></el-option>
								       <el-option label="作者" value="author"></el-option>
								       <el-option label="出版社" value="publisher"></el-option>
								    </el-select>
								  </el-input>
							</el-form-item>
							<el-form-item label="数据来源">
							    <el-select v-model="addBookForm.source" placeholder="数据来源"
							    size="small" style="width: 130px;" @change="sourceChange">
							      <el-option label="新华集团" value="2"></el-option>
							      <el-option label="采访库" value="1"></el-option>
							      <el-option label="本馆中央库" value="0"></el-option>
							    </el-select>
							</el-form-item>
							<!-- <el-form-item label="去除已选">
								<el-tooltip class="item" effect="dark" content="选中后查询结果将会去除已选图书中的图书!" placement="top">
								   	<el-switch
									  v-model="isSelectd"
									  active-color="#13ce66"
									  inactive-color="#dcdfe6"
									  @change="selectdChange">
									</el-switch>
								</el-tooltip>
							</el-form-item> -->
							<el-form-item >
							<!-- <el-form-item label="入库时间"  v-if="addBookForm.source == '2'">
								 <el-date-picker
							      v-model="addBookPicker"
							      type="daterange"
							      start-placeholder="开始日期"
							      end-placeholder="结束日期"
							      value-format="yyyy-MM-dd"
							      size="small">
							    </el-date-picker>
							</el-form-item> -->
							<!-- <el-form-item v-if="addBookForm.source == '2'" style="width: 130px;">
							    <el-select v-model="addBookForm"
							    size="small">
							      <el-option label="显示所有" value=""></el-option>
							      <el-option label="仅显示可订购" value="1"></el-option>
							    </el-select>
							</el-form-item> -->
							</el-form-item>
							<el-form-item >
							   <el-button type="primary" icon="el-icon-search"  round size="small" @click="searchBook">搜索图书</el-button>
							</el-form-item>
						</el-form>
			    	  <el-table
				         :data="addBookData"
				         style="width: 100%"
						  @selection-change="addBookSelectChange"
						  v-loading="addLoading"
				         >
				         <el-table-column
					        type="selection"
					        width="45"
					         fixed="left">
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
					        label="出版时间">
					      </el-table-column>
					      <el-table-column
					        prop="price"
					        label="单价(元)">
					      </el-table-column>

					      <el-table-column
					        prop="source"
					        label="图书来源"
					        :formatter="resourceFormatter">
					      </el-table-column>

					       <el-table-column
					        width="160"
					        label="订购数"
					         fixed="right"
					         align="center">
					        	<template slot-scope="scope">
					        		<el-input-number v-model="scope.row.OrderNumber" size="mini" :min="1"  ></el-input-number>
					        	</template>
					      </el-table-column>

					      <el-table-column
					       align="center"
					        label="查重结果"
					        fixed="right">
								<template slot-scope="scope">
					        		<span style="color:red;">{{scope.row.cnkiResult}}</span>
					        	</template>

					      </el-table-column>

					       <el-table-column
					        label="操作"
					        fixed="right"
					        align="center"
					       >
					      		 <template slot-scope="scope">
					        		<el-button type="text"  @click="addOneBook(scope.row)">添加</el-button>
					        	</template>
					      </el-table-column>

				    	</el-table>
					 	 <el-row >
	  						<el-col :span="24">
								 <el-pagination
							      :page-sizes="[3, 5, 10, 20]"
							      :page-size="addForm.pageSize"
							      layout="total, sizes, prev, pager, next, jumper"
							      :total="addBookDataPage.total"
								  @size-change="addBookSizeChange"
					              @current-change="addBookCurrentChange"
					              :current-page="addForm.pageNum"
							      >
							   	 </el-pagination>
					   	 	</el-col>
						</el-row>
				    </el-tab-pane>


					<!-- 已选图书 -->
				    <el-tab-pane>
				     	<span slot="label"><i class="el-icon-document"></i> 已选图书</span>
				    	<el-form :inline="true" :model="addBookForm" class="demo-form-inline">
						 	<el-form-item label="">
								 <el-input placeholder="请输入内容" v-model="addBookForm.searchValue" class="input-with-select" clearable size="small">
								    <el-select v-model="addBookForm.searchKey" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
								       <el-option label="图书名称" value="title"></el-option>
								       <el-option label="ISBN" value="isbn"></el-option>
								       <el-option label="作者" value="author"></el-option>
								       <el-option label="出版社" value="publisher"></el-option>
								    </el-select>
								  </el-input>
							</el-form-item>
							<!-- <el-form-item label="创建时间">
								 <el-date-picker
							      v-model="addBookPicker"
							      type="datetimerange"
							      start-placeholder="开始日期"
							      end-placeholder="结束日期"
							      :default-time="['12:00:00']"
							      value-format="yyyy-MM-dd HH:mm:ss"
							      size="small">
							    </el-date-picker>
							</el-form-item> -->
							<el-form-item label="数据来源">
							    <el-select v-model="addBookForm.source" placeholder="审核状态"
							    size="small">
							      <el-option label="新华集团" value="2"></el-option>
							      <el-option label="采访库" value="1"></el-option>
							      <el-option label="本馆中央库" value="0"></el-option>
							    </el-select>
							</el-form-item>
							<el-form-item >
						 	  <el-button type="primary" icon="el-icon-search" @click="searchSelected" round size="small">检索</el-button>
							</el-form-item>
						</el-form>
						<el-table
				         :data="selectBookListData"
				         style="width: 100%"
						  @selection-change="SelectedChange"
						  v-loading="selectedLoading"
				         >
				         <el-table-column
					        type="selection"
					        width="45"
					         fixed="left">
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
					        label="isbn"
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
					      status
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
					        prop="source"
					        label="图书来源"
					        :formatter="resourceFormatter">
					      </el-table-column>
							<el-table-column

					        label="审核状态"
					       >
						       	<template slot-scope="scope">
					        		<el-tag type="warning" v-if="scope.row.status==0">未审核</el-tag>
					        		<el-tag type="success" v-if="scope.row.status==1">审核通过</el-tag>
					        		<el-tag type="error" v-if="scope.row.status==2">审核未通过</el-tag>
					        	</template>
					      </el-table-column>
					       <el-table-column
					        width="160"
					        label="订购数"
					         fixed="right"
					         align="center">
					        	<template slot-scope="scope">
					        		<el-input-number v-model="scope.row.bookQty" size="mini" :min="1" v-if="scope.row.isEditor"></el-input-number>
					        		<span v-else>{{scope.row.bookQty}}</span>
					        	</template>
					      </el-table-column>

					      <el-table-column
					        label="查重结果"
					        fixed="right"
					       >
					       		<template slot-scope="scope">
					        		<span style="color:red;">{{scope.row.cnkiResult}}</span>
					        	</template>
					      </el-table-column>
					      <el-table-column
					        label="操作"
					        fixed="right"
					        align="center"
					        width="180px"
					       >
					      		 <template slot-scope="scope">
					        		<el-button type="text" v-if="!scope.row.isEditor" @click="updateSelected(scope.row)">修改</el-button>
					        		<el-button type="success" size="small" v-if="scope.row.isEditor"  @click="saveSelected(scope.row)">保存</el-button>
					        		<el-button type="text" size="small" v-if="scope.row.isEditor" :style="{color:'#e6a23c'}" @click="cancelUpdata(scope.row)">取消修改</el-button>
					        		<el-button type="text" :style="{color:'#f56c6c'}" @click="deletBook(scope.row)">移除</el-button>
					        	</template>
					      </el-table-column>
				    	</el-table>
					 	 <el-row >
	  						<el-col :span="24">
								 <el-pagination
							      :page-sizes="[3, 5, 10, 20]"
							      :page-size="selectdForm.pageSize"
							      layout="total, sizes, prev, pager, next, jumper"
							      :total="selectBookListPage.total"
								  @size-change="selectedSizeChange"
					              @current-change="selectedCurrentChange"
					              :current-page="selectdForm.pageNum"
							      >
							   	 </el-pagination>
					   	 	</el-col>
						</el-row>
					</el-tab-pane>
				 </el-tabs>
	</div>
			<el-form :model="diaLogForm" :rules="rules" label-width="80px" ref="ruleForm" status-icon v-else>
				<el-form-item label="经费编码">
			    <el-select placeholder="请选择" v-model="diaLogForm.budgetId" style="width: 70%">
					<el-option :label="item.coding" :value="item.id" v-for="item in budgetList" :key="item.id"></el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item label="收货地址">
			    <el-select placeholder="请选择" v-model="diaLogForm.address" style="width: 70%">
					<el-option :label="item.address" :value="item.id" v-for="item in addressList" :key="item.id"></el-option>
			    </el-select>
			  </el-form-item>
			    <el-form-item label="订购规则" prop="ruleId">
			      <el-select v-model="diaLogForm.ruleId" placeholder="请选择订购规则" style="width: 70%">
			      	<el-option label="关闭规则" value="0"></el-option>
			        <el-option :label="item.ruleName" :value="item.id" v-for="item in ruleList" :key="item.id"></el-option>
			      </el-select>
			    </el-form-item>
			     <el-form-item label="备注信息">
				    <el-input type="textarea" v-model="diaLogForm.summary" placeholder="可不填" style="width: 70%"></el-input>
				  </el-form-item>
		  	</el-form>
		  	<div slot="footers">
		 		<el-button type="error"  round :disabled="isAddBook" @click="setOrderNumber" v-if="addBook&&tabs==0">批量设置订购数</el-button>
		  		<el-input-number v-model="orderNumber" controls-position="right" @change="handleChange" :min="0" :step="10" v-if="IsSetOrderNum&&tabs==0"
		  		ref="setOrderNum"></el-input-number>
		  		<el-button type="primary"  v-if="addBook&&tabs==0" round :disabled="isAddBook" @click="addBooks">批量添加图书</el-button>

		  		<el-popover
				  placement="top"
				  title="查询条件"
				  v-model="visible2">
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
				    <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
				    <el-button type="primary" size="mini" @click="cnkiOk">确定</el-button>
				  </div>
				  <!-- <el-button type="primary"  v-if="addBook&&tabs==0" :disabled="isAddBook" round @click="cnki" slot="reference">查重</el-button> -->

				</el-popover>


				<el-button type="error"  round :disabled="isUpdata" @click="UpdataBookQty" v-if="addBook&&tabs==1">订购数修改</el-button>
		  		<el-input-number v-model="bookQty" controls-position="right" @change="handleChange" :min="0" :step="10" v-if="addBook&&IsSetBookQty&&tabs==1"
		  		ref="setBookQty"></el-input-number>
		  		<el-button type="primary"   round  v-if="addBook&&IsSetBookQty&&tabs==1" @click="saveUpdata">保存修改</el-button>

		  		<el-button type="danger"  v-if="addBook&&tabs==1" round :disabled="isUpdata" @click="deletBooks">移除</el-button>

		  		<el-popover
				  placement="top"
				  title="查询条件"
				  v-model="visible3">
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
				    <el-button type="primary" size="mini" @click="cnki_two">确定</el-button>
				  </div>
				 <!-- <el-button type="primary"   v-if="addBook&&tabs==1" round :disabled="isUpdata" @click="visible3=!visible3" slot="reference">查重</el-button> -->

				</el-popover>

			    <el-button type="primary" @click="addOrderData" v-if="isAdd&&!addBook" round>确 定</el-button>
			    <el-button type="primary" @click="saveOrderData" v-if="!isAdd&&!addBook" round>保存</el-button>
			    <el-button @click="closeDialog" round>取 消</el-button>
			</div>
		</dia-log>


		<dia-log :visible.sync="isAuditing" :title="isAuditingTitle" :width="isAudit?'80%':'400px'" :center="isAudit">
			<div v-if="isAudit">
				<el-table
		         :data="auditingData"
		         style="width:100%"
				  @selection-change="auditingChange"
				  v-loading="auditingLoading"
		         >
			         <el-table-column
				        type="selection"
				        width="45"
				         fixed="left">
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
				        show-overflow-tooltip>
				      </el-table-column>
				      <el-table-column
				        prop="price"
				        label="单价(元)"
				       >
				      </el-table-column>
				      <el-table-column
				        prop="source"
				        label="图书来源"
				        :formatter="resourceFormatter">
				      </el-table-column>

				       <el-table-column
				       prop="bookQty"
				        width="160"
				        label="订购数"

				        align="center">
				      </el-table-column>

				      <el-table-column
				        label="审核状态"
						 width="120px"
						  fixed="right"
				       >
				       		<template slot-scope="scope">
				        		<el-tag type="warning" v-if="scope.row.status==0">未审核</el-tag>
				        		<el-tag type="success" v-if="scope.row.status==1">审核通过</el-tag>
				        		<el-tag type="danger" v-if="scope.row.status==2">审核未通过</el-tag>
				        	</template>
				      </el-table-column>
				      <el-table-column
				        label="审核详情"
				        fixed="right"
				        show-overflow-tooltip
				       >
				       		<template slot-scope="scope">
				        		<span style="color:#dc4d4d;">{{scope.row.checkedmsg}}</span>
				        	</template>
				      </el-table-column>
				      <el-table-column
				        label="操作"
				        fixed="right"
				        align="center"
				        width="100px"
				       >
				      		 <template slot-scope="scope">
				        		<el-button type="text" v-if="scope.row.status==2" style="color:rgb(103, 194, 58);" @click="adopt(scope.row)">通过</el-button>
				        	</template>
				      </el-table-column>
			    	</el-table>
				 	 <el-row >
							<el-col :span="24">
							 <el-pagination
						      :page-sizes="[3, 5, 10, 20]"
						      :page-size="auditingForm.pageSize"
						      layout="total, sizes, prev, pager, next, jumper"
						      :total="auditingPage.total"
							  @size-change="auditingSizeChange"
				              @current-change="auditingCurrentChange"
				              :current-page="auditingForm.pageNum"
						      >
						   	 </el-pagination>
				   	 	</el-col>
					</el-row>
			</div>

			<el-upload
			  class="upload-demo"
			  drag
			  ref="upload"
			  action="/apiPurchaseOrder/apiPurchaseOrder/v1/purchasebook/import"
			  accept=".xls,.xlsx"
			  multiple
			  :http-request="successUpload"
			  :auto-upload="false"
			   name="fileName"
			  v-else
			  >
			  <i class="el-icon-upload"></i>
			  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
			  <div class="el-upload__tip" slot="tip">只能上传xls或xlsx文件</div>
			</el-upload>

			<div slot="footers">
				<el-button  round v-if="!isAudit" type="primary" @click="upload">点击上传</el-button>
				<el-button v-if="isAudit" round type="primary"  @click="autoAudit">自动审核</el-button>
				<el-button @click="isAuditing = false" round>取 消</el-button>
			</div>


		</dia-log>
	</div>
</template>

<script>
import { orderbuy,orderbuyAdd,orderbuySave,orderbuyrule,orderbuyUpdate,
	orderbuyDelete,searchBookList,addBooks,selectedBooks,setbookqty,bookDelete,dupcheck,dupsearch,orderbuyCommit,exportOrders,importFile,exportFile,autoCheck,adopt,doubanBook} from '@/request/order'
import DiaLog from '@/components/Dialog'
  export default{
  	components:{
  		DiaLog
  	},
  	data(){
  		return {
          	tabs:'0',
  			addBook:false,//是否是添加图书
  			visible:false,//弹框显示与否
  			isCheck:true,//删除多个是否禁用
  			loading:false,//表格加载动画显示
  			addLoading:false,
  			selectedLoading:false,
  			auditingLoading:false,//审核表格的加载动画
  			isAdd:false,//是否是添加订单还是修改订单
  			diaLogTitle:'标题',//弹框标题
  			picker:[],//时间选择器
  			addBookPicker:[],//查看添加图书的时间选择器
  			searchData:{//表单v-model的值
  				searchKey:'purchaseCode',
  				searchValue:'',
  				startTime:'',
  				endTime:'',
  				checkStatusSearch:''
  			},
  			form:{//表单实际提交值,查表格数据
  				searchKey:'',
  				searchValue:'',
  				startTime:'',
  				timeKey:'creatTime',
  				endTime:'',
  				checkStatusSearch:'',
  				pageNum:1,
  				pageSize:5,
  				orderCodeHave:0
  			},
  			data:[],//表格数据存放点
  			dataPage:{},//表格分页信息存放点
			ruleList:[],//规则数据存放点
			budgetList:[],
			addressList:[],
  			diaLogForm: {//弹框修改规则和添加规则v-model存放点
				ruleId:'',
				summary:'',
				budgetId:'',
				address:''
  			},
  			updateForm:{},//修改规则保存时传给后台的参数
  			newOrderBuy:{},//新增订购单保存时传给后台的参数
  			rules:{//表单规则
  				ruleId:[
  					{required: true, message: '请选择订购规则!', trigger: 'change' }
  				]
  			},
  			selection:[],//表格多选框选择后的数据存放点
  			addBookForm:{
  				searchKey:'title',
  				searchValue:'',
  				startTime:'',
  				endTime:'',
  				source:'1'
  			},
  			addForm:{
  				searchKey:'title',
  				searchValue:'',
  				startTime:'',
  				endTime:'',
  				source:'',//图书来源
  				timeKey:'pubdate',
  				pageNum:1,
  				pageSize:5,
  				orderId:''
  			},
  			selectdForm:{
  				searchKey:'',
  				searchValue:'',
  				startTime:'',
  				endTime:'',
  				source: '2',
  				timeKey:'pubdate',
  				pageNum:1,
  				pageSize:5,
				orderId:'',
				ruleId: ''  
  			},
  			addBookData:[],
  			addBookDataPage:{},
  			isAddBook:true,//是否禁用添加/查看图书的添加按钮
  			addBookSelection:[],//添加图书多选按钮选择的数据放这
  			addTime:0,//添加间隔时间
  			orderNumber:1,//设置订购数
  			IsSetOrderNum:false,//设置订购数的计数器显示与隐藏
			id:'',//当前选择的是哪个订单,订单id
			ruleID: '',  
  			selectBookListData:[],//已选图书数据存放点
  			selectBookListPage:{},//已选图书分页信息存放点
  			isSelectd:false,//是否包含已选的开关
 			lastBookQty:'',//已还图书订购数修改之前的值
 			isUpdata:true,
 			bookQty:0,//修改订购数初始化
 			selection_:[],
 			IsSetBookQty:false,
 			visible2:false,//查重条件框的显示与隐藏
 			visible3:false,
 			type:[],
 			isAuditing:false,//审核的dialog显示隐藏
 			auditingData:[],//审核数据存放点
 			auditingPage:{},//审核分页数据存放点
 			auditingForm:{
 				searchKey:'',
  				searchValue:'',
  				startTime:'',
  				endTime:'',
  				source:'',
  				timeKey:'pubdate',
  				pageNum:1,
  				pageSize:5,
  				orderId:''
 			},
 			isAudit:false,
 			isAuditingTitle:'',
 			auditSelection:[],//审核多选数据存放点
 			isDisable:true,//
       power:[],//按钮权限数组
       searchButton:false
  		}
  	},
  	created(){
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
  		//设置表格索引
  		indexMethod(index){
  			return this.dataPage.startRow+index
  		},
  		indexMethod1(index){
  			return this.addBookDataPage.startRow+index
  		},
  		indexMethod2(index){
  			return this.selectBookListPage.startRow+index
  		},
  		indexMethod3(index){
  			return this.auditingPage.startRow+index
  		},
  		getData(obj){
  			this.loading=true;
  			orderbuy(obj).then(data=>{
  				console.log(data.data.page)
  				if(data.data.code==0){
  					this.dataPage=data.data.page;
  					if(data.data.page.list&&data.data.page.list.length>0){
  						this.data=data.data.page.list;
					  }
					if(data.data.page.list.length == 0) {
						if (data.data.page.pageNum>1) {
							this.form.pageNum--;
							this.getData(JSON.stringify(this.form))
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
  		//订单列表选择事件
  		selectChange(selection){
  			if(selection.length>=1){
  				this.selection=selection;

  				this.isCheck=false;
  			}else{
  				this.isCheck=true;
  			}
  		},

  		//单个删除
  		delet(row){
  			this.$confirm('确认要删除这条订购单吗?', '警告', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'error'
		        }).then(() => {
		        	let newObj={
		        		ids:''
		        	}
		        	let arr=[];
		        	arr.push(row.id);
		        	newObj.ids=arr.toString();
		        	this.orderbuyDelete(newObj);

		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除!'
		          });
		        });
  		},
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
		        	this.orderbuyDelete(newObj);
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除!'
		          });
		    });
  		},
  		//删除数据的方法
  		orderbuyDelete(obj){
  			orderbuyDelete(obj).then(data=>{
  				if(data.data.code==0&&data.data.count){

	  				this.getData(JSON.stringify(this.form));
			      	this.$message({
			            type: 'success',
						message: '成功删除'+data.data.count+'条数据!',
						duration: 3000
			          });
  				}else{
  					 this.$message({
			            type: 'error',
			            message: data.data.msg
			          });
  				}
  			})
  		},
  		search(){
			this.form.pageNum = 1;
  			Object.assign(this.form, this.searchData);
  			this.getData(JSON.stringify(this.form));
  		},
  		//新增订购
  		addOrder(){
  			this.addBook=false;
  			this.isAdd=true;
  			this.diaLogForm= {
				ruleId:'',
				summary:'',
				budgetId:'',
				address:''
			  };
  			this.orderbuyMsg();
  			this.visible=true;
  			this.diaLogTitle='新增订购';

  		},
  		//查询规则
  		orderbuyMsg(){
  			orderbuyAdd().then(data=>{
  				if(data.data.code==0){
					this.ruleList= data.data.ruleList;
					this.budgetList= data.data.budgetList;
					this.addressList= data.data.addressList
  					this.newOrderBuy=data.data.PurchaseOrder;
  				}else{
  					 this.$message({
			            type: 'error',
			            message: data.data.msg
			          });
  				}
  			})
  		},
  		//确认新增订购单
  		addOrderData(){
  			this.$refs.ruleForm.validate((valid) => {
	          if (valid) {
	          		Object.assign(this.newOrderBuy, this.diaLogForm);
	            	this.orderbuySave(this.newOrderBuy,this.newOrderBuy);
	          } else {
	            return false;
	          }
	        });
  		},
  		//订购单添加保存
  		orderbuySave(obj,newOrderBuy){
 			orderbuySave(obj).then(data=>{
  				if(data.data.code==0){
  					 this.$notify({
			          title: '成功',
			          message: '新添加订购单成功!订购号为:'+data.data.purchaseCode,
			          type: 'success',
			          duration: 3000
					});
					this.diaLogForm= {
						ruleId:'',
						summary:'',
						budgetId:'',
						address:''
					},
			        this.visible=false;
	  				this.getData(JSON.stringify({
		  				searchKey:'',
		  				searchValue:'',
		  				startTime:'',
		  				timeKey:'creatTime',
		  				endTime:'',
		  				checkStatusSearch:'',
		  				pageNum:1,
		  				orderCodeHave:0,
		  				pageSize:this.form.pageSize
		  			}));
	  			}else{
  					 this.$message({
			            type: 'error',
			            message: data.data.msg
			          });
  				}
  			})
  			this.$refs.ruleForm.resetFields();
		  },
		//   豆瓣搜索图书
		getDoubanBook(obj) {
			doubanBook(obj).then(data=>{
				if(data.data.code == 0) {

				}
			})
		},
  		//订购单分页事件
  		handleSizeChange(val) {
  			this.form.pageSize=val;
  			this.getData(JSON.stringify(this.form));
	    },
	    handleCurrentChange(val) {
	    	this.form.pageNum=val;
	        this.getData(JSON.stringify(this.form));
	    },
	    //查询图书分页事件
	    addBookSizeChange(val){
	    	this.addForm.pageSize=val;
  			this.searchBookData(JSON.stringify(this.addForm));
	    },
	    addBookCurrentChange(val){
	    	this.addForm.pageNum=val;
  			this.searchBookData(JSON.stringify(this.addForm));
	    },
	    //已选图书分页事件
	    selectedSizeChange(val){
	    	this.selectdForm.pageSize=val;
  			this.selectedBooks(this.selectdForm);
	    },
	    selectedCurrentChange(val){
	    	this.selectdForm.pageNum=val;
  			this.selectedBooks(this.selectdForm);
	    },
	    //审核分页事件
	    auditingSizeChange(val){
	    	this.auditingForm.pageSize=val;
  			this.auditingBook(this.auditingForm);
	    },
	    auditingCurrentChange(val){
	    	this.auditingForm.pageNum=val;
  			this.auditingBook(this.auditingForm);
	    },

	    //修改规则事件
	    updateRule(row){
	    	console.log(row)
	    	this.addBook=false;
	    	this.isAdd=false;
			this.diaLogTitle='修改规则';
			orderbuyrule(row.id).then(data =>{
				if(data.data.code == 0) {
					this.ruleList= data.data.ruleList;
					this.budgetList= data.data.budgetList;
					this.addressList= data.data.addressList
					this.newOrderBuy=data.data.PurchaseOrder;
				}
			})
	    	const updateForms={
	    		ruleId:row.ruleId.toString(),
	    		summary:row.summary,
				// orderCode:row.orderCode?row.orderCode:'',
				budgetId: row.budgetId,
				address: Number(row.address) || '',
	    		purchaseCode:row.purchaseCode,
	    		id:row.id
			}
	    	this.diaLogForm=updateForms;
	    	this.$nextTick(function(){
	    		this.visible=true;
	    	})
	    },
	    //获取规则信息
	    orderbuyrule(row){
	    	orderbuyrule(row).then(data=>{
	    		if(data.data.code==0){
	    			if(data.data.ruleList&&data.data.ruleList.length>0){
						this.ruleList=data.data.ruleList;
	    			}
	    		}else{
  					 this.$message({
			            type: 'error',
			            message: '获取规则信息失败'+data.data.msg
			          });
  				}
	    	})
	    },
	    //确认修改规则
	    saveOrderData(){
	    	this.$refs.ruleForm.validate((valid) => {
	          if (valid) {
	          		Object.assign(this.updateForm,this.diaLogForm)
			    	orderbuyUpdate(this.updateForm).then(data=>{
			    		console.log(data)
			    		if(data.data.code==0){
			    			this.getData(JSON.stringify(this.form));
			    			 this.$message({
					          message: '修改订单成功!',
					          type: 'success'
					        });
			    		}else{

			    		}
			    		this.visible=false;
			    	}).catch(error=>{
			    		 this.$message({
					          message: '修改失败,错误代码:'+error.response.status,
					          type: 'error'
					        });
			    		this.visible=false;
			    	})
	          } else {
	            return false;
	          }
	        });

	    },
	    //添加查看图书事件
	    lookBook(row){
	    	this.tabs='0';
	    	this.addBook=true;
	    	this.visible=true;
	    	this.isSelectd=false;
	    	this.diaLogTitle='添加/查看图书';
	    	this.addBookForm={
  				searchKey:'title',
  				searchValue:'',
  				startTime:'',
  				endTime:'',
				source:'2',
				timeKey:'pubdate',
  				pageNum:1,
				pageSize:5,
				orderId: row.id,
				ruleId: row.ruleId
  			}
	    	this.addForm={
  				searchKey:'',
  				searchValue:'',
  				startTime:'',
  				endTime:'',
  				source: '2',
  				timeKey:'pubdate',
  				pageNum:1,
  				pageSize:5,
				orderId: row.id,
				ruleId: row.ruleId
  			};
  			this.selectdForm={
  				searchKey:'',
  				searchValue:'',
  				startTime:'',
  				endTime:'',
  				source: '2',
  				timeKey:'pubdate',
  				pageNum:1,
  				pageSize:5,
				orderId:row.id,
				ruleId: row.ruleId
  			}
	    	this.searchBookData(JSON.stringify(this.addBookForm));
			this.id=row.id;
			this.ruleID = row.ruleId;
	    	this.IsSetBookQty=false;
	    },
	    //添加图书查询
	    searchBookData(obj){
	    	this.addLoading=true;
	    	searchBookList(obj).then(data=>{
	    		if(data.data.code==0){
	    			console.log(data)
	    			this.addBookDataPage=data.data.page;
	    			if(data.data.page.list&&data.data.page.list.length>0){
	    				this.addBookData=data.data.page.list;
	    			}else{
	    				this.addBookData=[];
	    			}
	    			this.$nextTick(function(){
			    		for(let i of this.addBookData){
			    			this.$set(i,'OrderNumber',1)
			    			this.$set(i,'cnkiResult','')
			    		}
			    	})
			    	this.addLoading=false;
	    		}else{
  					 this.$message({
			            type: 'error',
			            message: data.data.msg
			          });
  				}

	    	})
	    },
	    //添加查看图书搜索按钮事件
	    searchBook(){
	    	this.searchBookData(JSON.stringify(this.addBookForm));
	    },
	    //添加查看图书多选事件
	    addBookSelectChange(selection){
	    	if(selection.length>0){
	    		this.addBookSelection=selection;
	    		this.isAddBook=false;
	    	}else{
	    		this.IsSetOrderNum=false;
	    		this.addBookSelection=[];
				this.isAddBook=true;
	    	}
	    },
	    //已选图书选择事件
  		SelectedChange(selection){
  			if(selection.length>0){
	    		this.selection_=selection;
	    		this.isUpdata=false;
	    	}else{
	    		this.IsSetBookQty=false;
	    		this.selection_=[];
				this.isUpdata=true;
	    	}
  		},
  		//审核图书的多选框事件
  		auditingChange(selection){

  			if(selection.length>0){
	    		this.auditSelection=selection;
	    		this.isDisable=false;
	    	}else{
	    		this.auditSelection=[];
				this.isDisable=true;
	    	}
  		},
	    //订购数设置
	    setOrderNumber(){
	    	this.IsSetOrderNum=true;
	    	this.$nextTick(function(){
	    		this.$refs.setOrderNum.focus();
	    	})
	    },
	    //订购数修改
	    UpdataBookQty(){
	    	this.IsSetBookQty=true;
	    	this.$nextTick(function(){
	    		this.$refs.setBookQty.focus();
	    	})
	    },
	    //订购数改变事件
	    handleChange(val){
	    	for(let data of this.addBookSelection){
	    		data.OrderNumber=val;
	    	}
	    },
	    //批量添加图书事件
	    addBooks(){
	    	 this.$confirm('是否要添加这'+this.addBookSelection.length+'类图书?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
			    	if(this.orderNumber>0){
				    	let arr=[];
				    	// for(let i of this.addBookSelection){
				    	// 	let str=i.id+'-'+i.OrderNumber;
				    	// 	arr.push(str)
				    	// }
				    	// let ids={
				    	// 	ids:arr.toString(),
				    	// 	orderId:this.id
						// }
						for(let i of this.addBookSelection){
				    		let str= { 
								bookQty: i.OrderNumber,
								bookId: i.id,
								source: i.source
							}
				    		arr.push(str)
				    	}
				    	let ids={
				    		purchasebooklist: arr,
							orderId: this.id,
							ruleId: this.ruleID,
							operation: 0
						}
				    	this.saveBookData(ids).then(res=>{
							this.tabs = '1';
							this.selectedBooks(this.selectdForm)
				    		this.searchBookData(JSON.stringify(this.addForm));
				    		 this.$message({
					          message:res.data.count+'类图书已添加!',
					          type: 'success'
					        });
				    		 this.addBookSelection=[];
							 this.orderNumber=1;

				    		 this.getData(JSON.stringify(this.form));
				    	}).catch(err=>{
				    		this.$message({
					          message:err.response.status,
					          type: 'error'
					        });

				    	})
				    }else{
			    		this.$message({
				          message:'添加失败,订购数不能为0!',
				          type: 'error'
						});
			    	}
	    	}).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消添加'
		          });
	        });
	    },
	    //单条图书添加
	    addOneBook(row){
	    	let date=new Date()*1;
	    	if(date-this.addTime>1000){
	    		// this.addTime=date;
		    	// let arr=[];
		  	    // let str=row.id+'-'+row.OrderNumber;
				// arr.push(str)
		    	// let ids={
		    	// 	ids:arr.toString(),
		    	// 	orderId:this.id
		    	// }
		    	// this.saveBookData(ids).then(res=>{
		    	// 	this.$message({
			    //       message:'该类图书已添加!',
			    //       type: 'success'
			    //     });
		    	// 	this.getData(JSON.stringify(this.form));//更新一下订单列表的数据
		    	// }).catch(err=>{

				// })
	    		this.addTime=date;
				let ids={
		    		purchasebooklist: [],
					orderId:this.id,
					ruleId: this.ruleID,
					operation: 0
				}
				ids.purchasebooklist = [
					{
						bookId: row.id,
						bookQty: row.OrderNumber,
						source: row.source
					}
				]
				this.saveBookData(ids).then(res=>{
					this.tabs = '1';
					this.selectedBooks(this.selectdForm);
		    		this.$message({
			          message:'该类图书已添加!',
			          type: 'success'
			        });
		    		this.getData(JSON.stringify(this.form));//更新一下订单列表的数据
		    	}).catch(err=>{

				})
			}else{
				this.addTime=date;
				this.$message({
		          message:'操作太频繁，请稍后再试!!',
		          type: 'error'
				});
			}
	    },
	    //添加图书存后台
	    saveBookData(ids){
	    	return new Promise((resolve,reject)=>{
	    		addBooks(ids).then(data=>{
	    			console.log(data)
	    			if(data.data.code==0){
	    				resolve(data)
	    			}else{
	    				this.$message({
				          message:'添加失败!'+data.data.msg,
				          type: 'error'
				        });
				        reject();
	    			}
	    		}).catch(err=>{
	    			this.$message({
			          message:err.response.status,
			          type: 'error'
			        });
	    			reject()
	    		})
	    	})
	    },
	    //选项卡切换事件
	    tabClick(val){
	    	if(val.index==1){
				console.log(val.index);
				this.selectedBooks(this.selectdForm);
				
	    	}
	    },
	    //查询已选图书
	    selectedBooks(obj){		
			this.selectedLoading=true;
	    	selectedBooks(obj).then(data=>{
	    		if(data.data.code==0){
	    			console.log(data)
	    			this.selectBookListPage=data.data.page;
	    			if(data.data.page.list&&data.data.page.list.length>0){

	    				this.selectBookListData=data.data.page.list;
	    				this.$nextTick(()=>{
	    					for(let i of this.selectBookListData){
	    						this.$set(i,'isEditor',false)
	    						this.$set(i,'cnkiResult','')
	    					}
	    				})

	    			}else{
	    				if(obj.pageNum>1){
	    					this.selectdForm.pageNum--;
	    					this.selectedBooks(this.selectdForm)
	    				}else{
	    					this.selectBookListData=[];
	    				}

	    			}
	    			this.selectedLoading=false;
	    		}else{
	    			this.$message({
			          message:'查询已选图书失败!'+data.data.msg,
			          type: 'error'
			        });
	    		}
	    	})
	    },
	    //是否包含已选图书的开关
	    selectdChange(val){
	    	if(val){
	    		this.addForm.orderId=this.id;
	    	}else{
	    		this.addForm.orderId='';
	    	}
	    },
	    //已选图书检索事件
	    searchSelected(){
	    	this.selectdForm.pageNum=1;
			Object.assign(this.selectdForm,this.addBookForm);
			this.selectdForm.startTime = '';
			this.selectdForm.endTime = '';
	    	this.selectedBooks(this.selectdForm);
	    },
	    //图书来源格式化
	    resourceFormatter(row, column, cellValue, index){
	    	if(cellValue==2){
	    		return '新华集团'
	    	}else if(cellValue==1){
	    		return '采访库'
	    	}else if(cellValue==0){
	    		return '本馆中央库'
	    	}else{
	    		return '其他来源'
	    	}

	    },
	    updateSelected(row){
	       this.lastBookQty=row.bookQty;
	    	row.isEditor=true;
	    },
	    saveSelected(row){
	    	// let str=row.id+'-'+row.bookQty;
	    	// let arr=[];
	    	// arr.push(str);
	    	// const obj={
	    	// 	orderId:row.orderId,
	    	// 	ids:arr.toString()
			// }
			let obj={
		    		purchasebooklist: [],
					orderId:this.id,
					ruleId: this.ruleID,
					operation: 1
				}
				obj.purchasebooklist = [
					{
						bookId: row.id,
						bookQty: row.bookQty,
						source: row.source
					}
				]
	    	 this.saveBookData(obj).then(res=>{
    	 			this.$message({
			          message:'修改成功!',
			          type: 'success'
			        });
    	 			this.getData(JSON.stringify(this.form));
	    	 }).catch(err=>{
	    	 	row.bookQty=this.lastBookQty;
	    	 	this.$message({
		          message:'修改订购数失败!',
		          type: 'error'
				});
	    	 })
	    	row.isEditor=false;
	    },
	    cancelUpdata(row){
	    	row.bookQty=this.lastBookQty;
	    	row.isEditor=false;
	    },
	    saveBookqty(obj){
	    	return new Promise((resolve,reject)=>{
		    	setbookqty(obj).then(data=>{
		    		if(data.data.code==0){
		    			resolve();
		    		}else{
		    			reject(data.data.msg);
		    		}
		    	}).catch(err=>{
		    		this.$message({
			          message:err.response.status,
			          type: 'error'
			        });
		    	})
	    	})
	    },
	     //保存修改按钮事件
	    saveUpdata(){
	    	if(this.bookQty>0){
		    	let arr=[];
		    	// for(let data of this.selection_){
		    	// 	let str=data.id+'-'+this.bookQty;
		    	// 	arr.push(str)
		    	// 	data.bookQty=this.bookQty;
		    	// }
		    	// const obj={
		    	// 	orderId:this.id,
		    	// 	ids:arr.toString()
				// }
				for(let i of this.selection_){
					let str= { 
						bookQty: this.bookQty,
						bookId: i.id,
						source: i.source
					}
					arr.push(str)
				}
				let obj={
					purchasebooklist: arr,
					orderId: this.id,
					ruleId: this.ruleID,
					operation: 1
				}

		    	 this.saveBookData(obj).then(res=>{
	    	 			this.$message({
				          message:'修改成功!',
				          type: 'success'
				        });
				        this.selectedBooks(this.selectdForm);
				        this.getData(JSON.stringify(this.form));
		    	 }).catch(err=>{
		    	 	this.$message({
			          message:'修改订购数失败!'+err,
			          type: 'error'
					});
		    	 })
	    	}else{
	    		this.$message({
		          message:'保存失败,订购数最少为一本!',
		          type: 'error'
				});
	    	}
	    },
	   	//移除图书事件
	    deletBook(row){
	    	// arr.push(row.id);
	    	// let obj={
	    	// 	orderId:this.id,
	    	// 	ids:arr.toString()
			// }
			this.$confirm('是否要移除该图书？', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
				let ids={
					purchasebooklist: [],
					orderId:this.id,
					ruleId: this.ruleID
				}
				ids.purchasebooklist = [
					{
						bookId: row.id,
						bookQty: row.bookQty,
						source: row.source
					}
				]
				this.bookDelete(ids).then(res=>{
					this.selectedBooks(this.selectdForm);
				}).catch(res=>{

				});
			 }).catch(() => {
				 this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });
			});
	    },
	    //移除多本图书
	    deletBooks(){
	    	 this.$confirm('是否要移除这'+this.selection_.length+'本图书？', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	let arr=[];
		        	// for(let i of this.selection_){
		        	// 	arr.push(i.id);
		        	// }
			    	// let obj={
			    	// 	orderId:this.id,
			    	// 	ids:arr.toString()
					// }
					for(let i of this.selection_){
						let str= { 
							bookQty: i.bookQty,
							bookId: i.id,
							source: i.source
						}
						arr.push(str)
					}
					let obj={
						purchasebooklist: arr,
						orderId: this.id,
						ruleId: this.ruleID,
					}
			    	this.bookDelete(obj).then(res=>{
			    		this.selectedBooks(this.selectdForm);
			    	}).catch(res=>{

			    	});

		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });
		        });
	    	console.log(this.selection_)
	    },
	     //请求后台移除图书
	    bookDelete(obj){
	    	return new Promise((resolve,reject)=>{
		    	bookDelete(obj).then(data=>{
		    		if(data.data.code==0){
		    			resolve();
		    			this.$message({
					          message:'移除'+data.data.count+'类图书成功!',
					          type: 'success'
					        });
		    		}else{

		    			this.$message({
					          message:'移除失败!'+data.data.msg,
					          type: 'error'
					    });
					    reject();
		    		}
		    	}).catch(err=>{
		    		reject();
		    		this.$message({
			          message:err.response.status,
			          type: 'error'
			        });
		    	})
	    	})
	    },
	    //查询图书查重
	    cnki(){
	    	this.visible2=!this.visible2;
	    },
	    //确认查重
	    cnkiOk(){
	    	let arr=[];
	    	for(let i of this.addBookSelection){
	    		arr.push(i.id);
	    	}
	    	let obj={
	    		userId:'1',
	    		ids:arr.toString(),
	    		case:this.type.toString()
	    	}
	    	dupsearch(obj).then(data=>{
	    		if(data.data.code==0){
	    			for(let i of this.addBookData){
	    				for(let j in data.data.res){
	    					if(i.id==j){
	    						i.cnkiResult=data.data.res[j];
	    					}
	    				}
	    			}
	    			this.visible2=false;
	    		}
	    	})
	    },
	   	//已选图书查重
	    cnki_two(){
	    	let arr=[];
	    	for(let i of this.selection_){
	    		arr.push(i.id);
	    	}
	    	let obj={
	    		userId:'1',
	    		ids:arr.toString(),
	    		case:this.type.toString()
	    	}
	    	dupcheck(obj).then(data=>{
	    		if(data.data.code==0){
	    			for(let i of this.selection_){
	    				for(let j in data.data.res){
	    					if(i.id==j){
	    						i.cnkiResult=data.data.res[j];
	    					}
	    				}
	    			}
	    			this.visible3=false;
	    		}
	    	})
	    },
	    //订单提交
	    submission(row){
	    	 this.$confirm('是否提交该订单?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	        	let arr=[];
		    	arr.push(row.id);
		    	let obj={
		    		ids:arr.toString(),
		    		checkStatus:row.checkStatus
		    	}
		    	orderbuyCommit(obj).then(data=>{
		    		if(data.data.code==0){
		    			this.$message({
				            type: 'success',
				            message: '提交成功!'
			            });
		    			this.getData(JSON.stringify(this.form));

		    		}else{
		    			this.$message({
				            type: 'error',
				            message: '提交失败!'+data.data.msg
				          });
		    		}
		    	})

	        }).catch(() => {
	          this.$message({
	            type: 'info',
	            message: '已取消提交'
	          });
	        });

	    },
	    //审核事件
	    auditing(row){
	    	this.isAuditingTitle="审核图书"
	    	this.isAudit=true
	    	this.isAuditing=true
	    	// this.auditingForm.orderId=row.id;
	    	this.auditingForm={
  				searchKey:'',
  				searchValue:'',
  				startTime:'',
  				endTime:'',
  				source:'',
  				timeKey:'pubdate',
  				pageNum:1,
  				pageSize:5,
  				orderId:row.id
  			}
	    	this.auditingBook(this.auditingForm);
	    },
	    //查询审核图书
	    auditingBook(obj){
	    	this.auditingLoading=true
	    	selectedBooks(obj).then(data=>{
	    		if(data.data.code==0){
	    			console.log(data)
	    			this.auditingPage=data.data.page;
	    			if(data.data.page.list&&data.data.page.list.length>0){
	    				this.auditingData=data.data.page.list;
	    				this.$nextTick(()=>{
	    					for(let i of this.auditingData){
	    						this.$set(i,'details','')
	    					}
	    				})

	    			}else{
	    				this.auditingData=[];
	    			}
	    			this.auditingLoading=false;
	    		}else{
	    			this.$message({
			          message:'查询已选图书失败!'+data.data.msg,
			          type: 'error'
			        });
	    		}
	    	})
	    },
	    //导出图书
	    exportBook(row){
	    	if(row.bookTypeQty==''||row.bookTypeQty==0||row.bookTypeQty==undefined){
	    		this.$alert('该订购单里没有图书，导出失败!', '导出图书失败!', {
		          confirmButtonText: '确定', type: 'error'});
	    	}else{
		    	 this.$confirm('是否要导出该订单图书的信息?', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning'
			        }).then(() => {
			        	let obj={
			        		orderId:row.id
			        	}
			        	  exportFile(obj).then(data=>{
				    		if(data.data.code==0){
				    			window.location.href=data.data.xlsurl;
				    		}else{
				    			this.$message({
						            type: 'error',
						            message: data.data.msg
						        });
				    		}
				    	})
			        }).catch(() => {

			        });
		    }
	    },
	    //导出多条订购单信息
	    exportOrder(){
	    	this.$confirm('是否要导出这'+this.selection.length+'条订购单信息?', '提示', {
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

	        	exportOrders(JSON.stringify(obj)).then(data=>{
	        		if(data.data.code==0){
	        			console.log(data.data)
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
	    //导入图书
	    importBook(row){
	    	console.log(row)
	    	this.id=row.id;
	    	this.isAudit=false;
	    	this.isAuditing=true;
	    	this.isAuditingTitle='导入图书';
	    	this.$nextTick(function(){
	    		this.$refs.upload.clearFiles();
	    	})

	    },

	    //上次成功事件
	    successUpload(response){

	    	 let formData = new FormData()
	    	 formData.append('fileName', response.file)
		     formData.append('orderId', this.id)

	    	 importFile(formData).then(data=>{
	    	 	if(data.data.code==0){
	    	 		response.onSuccess()
	    	 		 this.$message({
			             type: 'success',
			             message: '上传成功!'
			         });
	    	 	}else{
	    	 		response.onError()
	    	 		this.$message({
			             type: 'error',
			             message: '上传失败!'
			         });
	    	 	}
	    	 })
	    },
	    //上传事件
	    upload(){
	    	this.$refs.upload.submit();
	    },
	    //自动审核
	    autoAudit(){
	    	if(this.auditSelection.length>0){
	    		let arr=[];
	    		for(let i of this.auditSelection){
	    			arr.push(i.id)
	    		}
	    		let obj={
	    			orderId:this.id,
	    			ids:arr.toString()
	    		}
	    		autoCheck(obj).then(data=>{
	    			if(data.data.code==0){
	    				this.auditingBook(this.auditingForm);
	    			}else{
	    				this.$message({
				             type: 'error',
				             message: data.data.msg
				        });
	    			}
	    		})
	    	}else{
	    		this.$message({
		             type: 'error',
		             message: '请选择需要审核的书籍!'
		        });
	    	}
	    },
	    //强行通过
	    adopt(row){
	    	 this.$confirm('该书审核结果为未通过状态，是否强行通过?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let arr=[row.id]
				let obj={
					ids:arr.toString()
				}
				adopt(obj).then(data=>{
					if(data.data.code==0){
						this.auditingBook(this.auditingForm);
					}else{
						this.$message({
								type: 'error',
								message: data.data.msg
						});
					}
				})
			}).catch(() => {

			});
		},
		closeDialog() {
			this.visible = false;
			this.addBookForm = {};
			this.addBookPicker = [];
		},
		sourceChange() {
			if(this.addBookForm.source != '2') {
				this.addBookForm.startTime = '',
				this.addBookForm.endTime='';
				this.addBookPicker = [];
			}
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
  		},
  		addBookPicker(newVal){
  			if(newVal&&newVal.length>0){
	  			this.addBookForm.startTime=newVal[0];
	  			this.addBookForm.endTime=newVal[1];
  			}else{
  				this.addBookForm.startTime='';
  				this.addBookForm.endTime='';
  			}
  		}
  	}
  }

</script>

<style type="style/css" scoped>
	.red{
		color: red;
	}
	
</style>
