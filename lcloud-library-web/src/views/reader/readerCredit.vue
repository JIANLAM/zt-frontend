<template>
	<div class="container">
		<el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <span >
      <el-form-item label="">
				 <el-input placeholder="请输入内容" v-model="searchForm.searchValue" class="input-with-select" clearable>
				    <el-select v-model="searchForm.searchKey" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
				      <el-option label="读者姓名" value="userName"></el-option>
				      <el-option label="读者证号" value="readerCardNumber"></el-option>
				    </el-select>
				  </el-input>
			</el-form-item>
			<el-form-item label="信用值">
				<el-input-number v-model="searchForm.ownValueBegin"  controls-position="right" :min="0" :max="100" @change="inputChange"></el-input-number>
			   	-
			    <el-input-number v-model="searchForm.ownValueEnd"  @change="inputChange1" controls-position="right" :min="0" :max="101"></el-input-number>

			</el-form-item>
			<el-form-item label="读者证状态">
			    <el-select v-model="searchForm.cardStatus" placeholder="读者证状态">
			      <el-option label="所有" value=""></el-option>
			       <el-option label="正常" value="1"></el-option>
			      <el-option label="注销" value="2"></el-option>
			      <el-option label="挂失" value="3"></el-option>
			      <el-option label="禁用" value="0"></el-option>
			    </el-select>
			</el-form-item>
			<el-form-item label="">
			  <el-button type="primary" icon="el-icon-search" @click="search">检索</el-button>
			</el-form-item>
			<el-form-item label="">
			  <el-button v-if="searchMore" type="success" :icon="more?'el-icon-arrow-up':'el-icon-arrow-down'" @click="more=!more">更多条件</el-button>
			</el-form-item>
      </span>
			<br/>
			<!-- 更多条件 -->
         <el-form :inline="true" class="demo-form-inline" v-show="more">
		 	<el-form-item label="性别">
				    <el-select v-model="searchForm.sex" placeholder="请选择" :style="{width:'120px'}">
					 <el-option label="全部" value=""></el-option>
				      <el-option label="男" value="1"></el-option>
				      <el-option label="女" value="2"></el-option>
				    </el-select>
			</el-form-item>
			<!-- <el-form-item label="信用值">
				<el-input-number v-model="searchMore.ownValueBegin"  controls-position="right" :min="0" :max="100" @change="inputChange"></el-input-number>
			   	-
			    <el-input-number v-model="searchMore.ownValueEnd"  @change="inputChange" controls-position="right" :min="0" :max="100"></el-input-number>

			</el-form-item> -->
			<el-form-item label="借购是否启用">
			    <el-select v-model="searchForm.islendBuy" placeholder="请选择" :style="{width:'120px'}">
			      <el-option label="全部" value=""></el-option>
			       <el-option label="是" value="1"></el-option>
			      <el-option label="否" value="0"></el-option>
			    </el-select>
			</el-form-item>

		</el-form>

		    <el-form-item label="" v-if="searchButton1">
			  <!-- <el-button   :disabled="data.length==0" type="warning"  @click="all">全选</el-button> -->
              <el-button :disabled="selection.length==0" type="danger"  @click="openStatus('open')">批量启用借购</el-button>
			  <el-button  :disabled="selection.length==0" type="success"  @click="openStatus('close')">批量禁用借购</el-button>
              <el-button   :disabled="selection.length==0" type="warning"  @click="creditValue">批量修改信用值</el-button>
			</el-form-item>


		</el-form>



 		<el-table
		    :data="data"
		    tooltip-effect="dark"
		    style="width: 100%"
		    v-loading="loading"
			@selection-change="selectChange"
		   	>
			<el-table-column
		      type="selection"
		      width="55"
			  label="全选">
		    </el-table-column>
		     <el-table-column
		      type="index"
		      width="55">
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
		      label="读者性别"
		      >
		      	<template slot-scope="scope">
		      		<span v-if="scope.row.sex==1">男</span>
		      		<span v-else>女</span>
		      	 </template>
		    </el-table-column>
		    <el-table-column
		      prop="cardNumber"
		      label="读者证类型"
		      show-overflow-tooltip
		      >
		    </el-table-column>
		     <el-table-column
		      label="读者证状态"
		      >
		      <template slot-scope="scope">
			    	<el-tag type="success" v-if="scope.row.cardStatus==1">正常</el-tag>
			    	<el-tag type="warning" v-if="scope.row.cardStatus==2">注销</el-tag>
			    	<el-tag type="info" v-if="scope.row.cardStatus==3">挂失</el-tag>
            <el-tag type="danger" v-if="scope.row.cardStatus==0">禁用</el-tag>
		      </template>
		    </el-table-column>

		     <el-table-column
		      label="启用借购"
		      >
		      	<template slot-scope="scope">
		     		<el-switch
					  v-model="scope.row.islendBuy"
					  active-color="#13ce66"
					  inactive-color="#dcdfe6" v-if="scope.row.editor">
					</el-switch>
			    	<span v-else>{{scope.row.islendBuy?'是':'否'}}</span>
			    </template>
		    </el-table-column>
		     <el-table-column
		      label="信用值"
		      width="150"
		      >
		      	<template slot-scope="scope">
		      		<el-input-number v-model="scope.row.ownValue"  :step="10" :min="0" :max="100" size="small"  v-if="scope.row.editor"></el-input-number>
		      		<span v-else>{{scope.row.ownValue}}</span>

		      	</template>
		    </el-table-column>
		   <el-table-column
		      prop="summary"
		      label="备注"
		      show-overflow-tooltip
		      >
		    </el-table-column>
		     <el-table-column
		      label="操作"
		      align="center"
          width="200px"
		      >
		      	<template slot-scope="scope">
              <span v-if="searchButton1">
                 <el-button type="primary" size="mini" @click="update(scope.row)" v-if="!scope.row.editor">修改</el-button>
				          <el-button type="success" size="mini" @click="save(scope.row)" v-else >保存</el-button>
              </span>
				  <el-button size="mini" @click="showDialog(scope.row)">信用详情</el-button>
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

   			</el-col >

		</el-row>





		<el-dialog title="信用详情" :visible.sync="visible" width="60%">
		<el-form :inline="true"  class="demo-form-inline" size="small">
		  <el-form-item label="发生时间">
		 	 <el-date-picker
		      v-model="picker"
		      type="datetimerange"
		      start-placeholder="开始日期"
		      end-placeholder="结束日期"
		      :default-time="['12:00:00']"
		      value-format="yyyy-MM-dd"
		       clearable>
		    </el-date-picker>
			<el-form-item label="">
			  <el-button type="primary" icon="el-icon-search" @click="searchDetail">检索</el-button>
			</el-form-item>
			<el-form-item label="" class="detail">
			      读者证号：<span>{{details.readerCardNumber}}</span>&nbsp;&nbsp;&nbsp;
			      姓名：<span>{{details.userName}}</span>&nbsp;&nbsp;&nbsp;
			      信用值：<span>{{details.ownValue}}</span>

			</el-form-item>
		  </el-form-item>

		</el-form>


		  <el-table :data="creditList">
		  	<el-table-column
		      type="index"
		      width="55">
		    </el-table-column>
			  <el-table-column prop="deductScoreTime" label="发生时间"></el-table-column>
			  <el-table-column label="扣分情况">
			  		<template slot-scope="scope">
			  			<span>{{scope.row.afterDeductCreditValue-scope.row.beforeDeductCreditValue}}</span>
			  		</template>
			  </el-table-column>
			  <el-table-column prop="beforeDeductCreditValue" label="结算前"></el-table-column>
			  <el-table-column prop="afterDeductCreditValue" label="结算后"></el-table-column>
			  <el-table-column prop="deductScoreReason" label="扣分原因"></el-table-column>
		    </el-table>
		</el-dialog>
	</div>
</template>

<script>
import { getData } from "@/methods/method";
import {
  creditList,
  readerCreditList,
  creditUpdate,
  setstatus,
  creditMore
} from "@/request/lendBuyManage";
export default {
  data() {
    return {
      loading: false,
      more: false,
      searchForm: {
        sex: "",
        islendBuy: "",
        searchKey: "userName",
        searchValue: "",
        ownValueBegin: 0,
        ownValueEnd: 101,
        cardStatus: ""
      },
      a: "1",
      form: {
        searchKey: "readerCardNumber",
        searchValue: "",
        ownValueBegin: "",
        ownValueEnd: "",
        statusSearch: "",
        pageNum: 1,
        pageSize: 5
      },
      formDetail: {
        startTime: "",
        endTime: ""
      },
      visible: false,
      dataPage: {},
      data: [],
      creditListPage: {},
      creditList: [],
      selection: "",
      selectionId: "",
      picker: [],
      details: {
        readerCardNumber: "",
        userName: "",
        ownValue: ""
      },
      power:[],//按钮权限数组
      searchButton:false,
      searchButton1:false,
      searchMore:false
    };
  },
  created() {
    // this.getPowerArr();
    this.getData();
  },
  filters: {
    // typeTag(data) {
    //   if (data == 1) {
    //     return "success";
    //   } else if (data == 2) {
    //     return "warning";
    //   } else if (data == 3) {
    //     return "info";
    //   } else {
    //     return "danger";
    //   }
    // },
    // typeName(data) {
    //   if (data == 1) {
    //     return "正常";
    //   } else if (data == 2) {
    //     return "注销";
    //   } else if (data == 3) {
    //     return "挂失";
    //   } else {
    //     return "禁用";
    //   }
    // }
  },
  methods: {
    //得到权限按钮数组
    // getPowerArr(){
    //   let  obj;
    //   let  power =this.$route.meta.power;
    //   for(let i=0,len=power.length;i<len;i++){
    //     if(power[i].name=='检索'){
    //       this.searchButton=true;
    //       obj=power[0];
    //       power[0]=power[i];
    //       power[i]=obj
    //     }
    //     if(power[i].name=='修改'){
    //       this.searchButton1=true;
    //     }
    //     if(power[i].name=='更多条件'){
    //       this.searchMore=true
    //     }
    //   }
    //   this.power=power;
    // },
    selectChange(selection) {
      if (selection.length && selection.length > 0) {
        this.allSelect = false;
        this.selection = selection;
        //   得到被选中的数据
        let arr = [];
        for (let i = 0, length = this.selection.length; i < length; i++) {
          arr.push(this.selection[i].id);
        }
        this.selectionId = arr.join(",");
      } else {
        this.allSelect = true;
        this.selection = "";
        this.selectionId = "";
      }
    },
    //   全选
    all() {},
    // 批量启用禁用借购
    openStatus(status) {
      let obj, setStatus;
      if (status == "open") {
        setStatus = "1";
      } else {
        setStatus = "0";
      }
      obj = {
        ids: this.selectionId,
        islendBuy: setStatus
      };
      setstatus(obj).then(data => {
        if (data.data.code == 0) {
          this.$message({
            message: "批量修改状态成功!",
            type: "success"
          });
          this.getData();
        } else {
          this.$message({
            message: data.data.msg,
            type: "error"
          });
        }
      });
    },
    // 批量修改信用值
    creditValue() {
      this.$prompt("请输入修改后的信用值", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[0-9]*$/,
        inputErrorMessage: "请输入数字"
      })
        .then(({ value }) => {
          let obj = {
            ids: this.selectionId,
            ownValue: value.toString()
          };
          creditMore(obj).then(data => {
            if (data.data.code == 0) {
              this.$message({
                message: "批量修改信用值成功!",
                type: "success"
              });
              this.getData();
            } else {
              this.$message({
                message: data.data.msg,
                type: "error"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    search() {
      if (!this.more) {
        this.searchForm.sex = "";
        this.searchForm.islendBuy = "";
      }
      // if(Number(this.searchForm.ownValueBegin)>=Number(this.searchForm.ownValueEnd)){
      // 	 this.$message({
      //         message: "第二个信用值应该大于第一个信用值",
      //         type: 'error'
      // 			});
      // 			return
      // }
      this.form = {
        searchKey: "readerCardNumber",
        searchValue: "",
        ownValueBegin: "",
        ownValueEnd: "",
        statusSearch: "",
        pageNum: 1,
        pageSize: 5
      };
      Object.assign(this.form, this.searchForm);
      this.getData();
    },
    getData() {
      getData
        .call(this, creditList, this.form)
        .then(res => {
          const _this = this;
          this.data.forEach(function(item, index) {
            if (item.islendBuy == 1) {
              _this.$set(item, "islendBuy", true);
            } else {
              _this.$set(item, "islendBuy", false);
            }
            _this.$set(item, "editor", false);
          });
        })
        .catch(err => {});
    },
    inputChange(newVal) {
      this.searchForm.ownValueBegin = parseInt(newVal);
    },
    inputChange1(newVal) {
      this.searchForm.ownValueEnd = parseInt(newVal);
    },
    //分页事件
    handleSizeChange(val) {
      this.form.pageSize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.form.pageNum = val;
      this.getData();
    },

    update(row) {
      row.editor = !row.editor;
      this.$message({
        message: "正在进行修改操作!",
        type: "warning",
        showClose: true
      });
    },
    save(row) {
      row.editor = !row.editor;
      let newObj = {
        islendBuy: row.islendBuy ? 1 : 0,
        ownValue: row.ownValue,
        id: row.id
      };
      creditUpdate(newObj).then(data => {
        console.log(data);
        if (data.data.code == 0) {
          this.$message({
            message: "保存成功!",
            type: "success",
            showClose: true
          });
        }
      });
    },
    showDialog(row) {
      this.details = {
        readerCardNumber: row.readerCardNumber,
        userName: row.userName,
        ownValue: row.ownValue
      };
      this.visible = true;
      let obj = {
        readerId: row.readerId,
        pageNum: 1
      };
      readerCreditList(obj).then(data => {
        if (data.data.code == 0) {
          this.creditListPage = data.data.page;
          if (data.data.page.list && data.data.page.list.length > 0) {
            this.creditList = data.data.page.list;
          } else {
            this.creditList = [];
          }
        } else {
          this.$message({
            message: data.data.msg,
            type: "error",
            showClose: true
          });
        }
      });
    },
    searchDetail() {
      let obj = {
        readerId: 1,
        pageNum: 1,
        startTime: this.formDetail.startTime,
        endTime: this.formDetail.endTime
      };
      readerCreditList(obj).then(data => {
        if (data.data.code == 0) {
          this.creditListPage = data.data.page;
          if (data.data.page.list && data.data.page.list.length > 0) {
            this.creditList = data.data.page.list;
          } else {
            this.creditList = [];
          }
        } else {
          this.$message({
            message: data.data.msg,
            type: "error",
            showClose: true
          });
        }
      });
    }
  },
  watch: {
    picker(newVal) {
      if (newVal && newVal.length > 0) {
        this.formDetail.startTime = newVal[0];
        this.formDetail.endTime = newVal[1];
        console.log(newVal);
      } else {
        this.formDetail.startTime = "";
        this.formDetail.endTime = "";
      }
    }
  }
};
</script>

<style type="style/css">
.line {
  text-align: center;
}
.more {
  margin-top: 20px;
}
.detail {
  float: right;
}
.detail span {
  color: red;
}
</style>
