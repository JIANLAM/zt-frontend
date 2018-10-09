<template>
	<div class="container">
		<el-form :inline="true" :model="searchData" class="demo-form-inline">
      <span v-if="searchButton">
        <el-form-item label="">
				<el-input placeholder="请输入内容" v-model="searchData.searchValue" class="input-with-select" @keyup.enter.native="search" clearable>
				    <el-select v-model="searchData.searchKey" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
							<el-option label="书名" value="title"></el-option>
							<el-option label="作者" value="author"></el-option>
							<el-option label="ISBN" value="isbn"></el-option>
							<el-option label="出版者" value="publisher"></el-option>
				    </el-select>
				  </el-input>
		  </el-form-item>
		  <el-form-item label="入库时间：">
				<el-date-picker
          v-model="picker"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd">
			    </el-date-picker>
		  </el-form-item>
			<el-select v-model="searchData.bookType" placeholder="请选择" style="width: 150px;margin-left: 10px;">
		      <el-option label="所有类别" value=""></el-option>
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
        <!-- <el-option label="其它类别" value="7"></el-option> -->
		  </el-select>
      </span>
      <span v-for="(item,index) in power" :key="index">
		    <el-button v-if="item.name.trim()=='检索'" type="primary" icon="el-icon-search" style="margin-left: 10px;" @click="search">检索</el-button>
      </span>

		</el-form>
		<el-form :inline="true" :model="formInline" class="demo-form-inline" v-if="searchButton">
		  <el-button type="primary" @click="weekNewBook">本周新书</el-button>
		  <el-button type="primary" @click="weekHotBook">本周热书</el-button>
		  <el-button type="primary" @click="monthNewBook">本月新书</el-button>
		  <el-button type="primary" @click="monthHotBook">本月热书</el-button>
		</el-form>
		<el-table
		    ref="multipleTable"
		    :data="data"
				v-loading="loading"
		    tooltip-effect="dark"
		    style="width: 100%;margin-top: 20px;"
		    @selection-change="handleSelectionChange">
		    <el-table-column
		      type="selection"
		      width="55">
		    </el-table-column>
		    <el-table-column
		      type="index"
		      width="50">
		    </el-table-column>
		    <el-table-column
		      prop="title"
		      label="图书名称"
		      min-width="200">
		    </el-table-column>
		    <el-table-column
		      prop="isbn"
		      label="ISBN"
		      min-width="200">
		    </el-table-column>
		    <el-table-column
		      prop="author"
		      label="作者"
		      min-width="150"
		      show-overflow-tooltip>
		    </el-table-column>
		    <el-table-column
		      prop="bookType"
		      label="分类号"
		      min-width="150">
		    </el-table-column>
		    <el-table-column
		      prop="publisher"
		      label="出版者"
		      min-width="200">
		    </el-table-column>
		    <el-table-column
		      prop="pubdate"
		      label="出版年份"
		      min-width="200"
					:formatter="dateFormat">
		    </el-table-column>
				<el-table-column
		      prop="storageTime"
		      label="入库时间"
		      min-width="200"
					:formatter="dateFormat">
		    </el-table-column>
		    <el-table-column
		      prop="price"
		      label="单价（￥）"
		      min-width="200">
		    </el-table-column>
		</el-table>
		<el-pagination
	      @size-change="handleSizeChange"
	      @current-change="handleCurrentChange"
	      :current-page="dataPage.pageNum"
	      :page-sizes="[3, 5, 10, 20]"
	      :page-size="5"
	      layout="total, sizes, prev, pager, next, jumper"
	      :total="dataPage.total">
	    </el-pagination>
	</div>
</template>

<script>
import { newBooks } from "@/request/bookCatalog";
import moment from "moment";
export default {
  data() {
    return {
      loading: false,
      picker: "",
      searchData: {
        searchKey: "title",
        searchValue: "",
        bookType: "",
        startTime: "",
        endTime: "",
        timeKey: "storageTime"
      },
      form: {
        //搜索值
        pageNum: 1,
        pageSize: 5
      },
      form1: {
        pageNum: 1,
        pageSize: 5
      },
      weekNewBoo: {
        //本周新书
        orderBydesc: "week",
        search: "new"
      },
      weekHotBoo: {
        //本周热书
        orderBydesc: "week",
        search: "hot"
      },
      monthNewBoo: {
        //本月新书
        orderBydesc: "month",
        search: "new"
      },
      monthHotBoo: {
        //本月热书
        orderBydesc: "month",
        search: "hot"
      },
      formInline: {
        pageNum: 1,
        pageSize: 5
      },
      data: [],
      multipleSelection: [],
      dataPage: {}, //表格分页信息存放点
      power:[],//按钮权限数组
      searchButton:false
    };
  },
  created() {
    this.getPowerArr();
    this.getNewBooks(JSON.stringify(this.form));
  },
  methods: {
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
    indexMethod(index) {
      return this.dataPage.startRow + index;
    },
    dateFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD");
    },
    getNewBooks(obj) {
      this.loading = true;
      newBooks(obj)
        .then(data => {
          if (data.data.code == 0) {
            this.dataPage = data.data.page;
            if (data.data.page.list && data.data.page.list.length > 0) {
              this.data = data.data.page.list;
            } else {
              if (JSON.parse(obj).pageNum > 1) {
                this.form.pageNum--;
                this.getNewBooks(JSON.stringify(this.form));
              } else {
                this.data = [];
              }
            }
            this.loading = false;
          } else {
            this.$message({
              type: "error",
              message: "请求成功!但后台返回错误! " + data.data.msg,
              duration: 3 * 1000,
              showClose: true
            });
          }
        })
        .catch(error => {});
    },
    handleSelectionChange() {},
    // 点击搜索
    search() {
      Object.assign(this.form, this.searchData);
      this.getNewBooks(JSON.stringify(this.form));
    },
    weekNewBook() {
      Object.assign(this.form1, this.weekNewBoo);
      this.getNewBooks(JSON.stringify(this.form1));
    },
    weekHotBook() {
      Object.assign(this.form1, this.weekHotBoo);
      this.getNewBooks(JSON.stringify(this.form1));
    },
    monthNewBook() {
      Object.assign(this.form1, this.monthNewBoo);
      this.getNewBooks(JSON.stringify(this.form1));
    },
    monthHotBook() {
      Object.assign(this.form1, this.monthHotBoo);
      this.getNewBooks(JSON.stringify(this.form1));
    },
    handleSizeChange(val) {
      this.form.pageSize = val;
      this.form1.pageSize = val;
      this.getNewBooks(JSON.stringify(this.form));
    },
    handleCurrentChange(val) {
      this.form.pageNum = val;
      this.form1.pageNum = val;
      this.getNewBooks(JSON.stringify(this.form));
    }
  },
  watch: {
    picker(newVal) {
      if (newVal && newVal.length > 0) {
        this.searchData.startTime = newVal[0];
        this.searchData.endTime = newVal[1];
      } else {
        this.searchData.startTime = "";
        this.searchData.endTime = "";
      }
    }
  }
};
</script>

<style>
</style>
