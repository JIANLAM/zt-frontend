<template>
	<div class="container">
		<el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <span v-if="searchHidden">
        <el-form-item label="">
          <el-input placeholder="请输入内容" v-model="searchForm.value" class="input-with-select" clearable v-on:keyup.enter.native="searchData">
            <el-select v-model="searchForm.key" slot="prepend"  placeholder="请选择" :style="{width:'120px'}">
              <el-option label="图书名称" value="bookName"></el-option>
              <el-option label="ISBN"   value="ISBN"></el-option>
              <el-option label="作者"   value="author"></el-option>
              <el-option label="分类号" value="bookType"></el-option>
              <el-option label="出版社" value="publisher"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="图书状态">
          <el-select v-model="searchForm.lendBuyStatus" placeholder="请选择" :style="{width:'120px'}">
            <el-option label="所有"   value=""></el-option>
            <el-option label="代发货" value="0"></el-option>
            <el-option label="待收货" value="1"></el-option>
            <el-option label="待还书" value="2"></el-option>
            <el-option label="已取消" value="3"></el-option>
            <el-option label="已完成" value="4"></el-option>
          </el-select>
        </el-form-item>
      </span>
			<el-form-item label="">
        <span v-for="(item,index) in power" :key="index">
          <el-button v-if="item.name.trim()=='统计'" type="primary" icon="el-icon-search" @click="searchData">统计</el-button>
          <el-button v-if="item.name.trim()=='导出'" type="warning" icon="iconfont icon-daoru" @click="exportBorrowBooks" :disabled="data.length==0">导出</el-button>
        </span>
      </el-form-item>
		</el-form>
 		<el-table ref="multipleTable" :data="data" tooltip-effect="dark" v-loading="loading" style="width: 100%">
		  <el-table-column type="index" width="55"></el-table-column>
		  <el-table-column prop="title" label="图书名称"></el-table-column>
		  <el-table-column prop="isbn"  label="ISBN"></el-table-column>
		  <el-table-column prop="author" label="作者"></el-table-column>
		  <el-table-column prop="bookType" label="分类号"></el-table-column>
		  <el-table-column prop="publisher" label="出版社"></el-table-column>
			<el-table-column prop="pubDate" label="出版时间" :formatter="dateTabFormat"></el-table-column>
		  <el-table-column prop="univalent" label="单价(元)"></el-table-column>
			<el-table-column prop="bookCount" label="总册数"></el-table-column>
		  <el-table-column prop="total" label="总价格(万元)"></el-table-column>
		</el-table>
			<!-- 高级统计 -->
	  <dia-log :visible.sync="visible" title="高级统计" top="10vh" width="620px">
	    <el-form ref="seniorForm" :model="seniorForm" :rules="rule" status-icon label-width="140px" size="small" style="max-width:540px">
	  	  <el-form-item label="图书名称" prop="name">
	     	  <el-input v-model="seniorForm.name"></el-input>
	  		</el-form-item>
				<el-form-item label="ISBN" prop="name">
	     	  <el-input v-model="seniorForm.name"></el-input>
	  		</el-form-item>
				<el-form-item label="读者证号" prop="name">
	     	  <el-input v-model="seniorForm.name"></el-input>
	  		</el-form-item>
				<el-form-item label="读者姓名" prop="name">
					<el-input v-model="seniorForm.name"></el-input>
				</el-form-item>
	  		<el-form-item label="读者性别" prop="sex">
	     		<el-select v-model="seniorForm.sex" multiple placeholder="请选择">
						<el-option label="全部" value="1"></el-option>
						<el-option label="男" value="2"></el-option>
						<el-option label="女" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="读者类型" prop="readerType">
					<el-select v-model="seniorForm.readerType" multiple placeholder="请选择">
						<el-option label="全部" value="all"></el-option>
						<el-option label="男" value="1"></el-option>
						<el-option label="女" value="2"></el-option>
				  </el-select>
	  		</el-form-item>
				<el-form-item label="下单方式">
					<el-select v-model="seniorForm.singleWay"  placeholder="请选择" :style="{width:'120px'}">
						<el-option label="所有" value="userName"></el-option>
						<el-option label="PC端" value="2"></el-option>
						<el-option label="移动端" value="title"></el-option>
						<el-option label="线下端" value="title"></el-option>
					</el-select>
				</el-form-item>
		  	<el-form-item label="读者年龄" >
					<el-col :span="11" >
						<el-form-item label="" prop="orderQuantity1">
					 <el-input v-model="seniorForm.orderQuantity1"></el-input>
						</el-form-item>
				</el-col>
				<el-col class="line" :span="2">-</el-col>
				<el-col :span="11">
					<el-form-item label="" prop="orderQuantity2">
						<el-input v-model="seniorForm.orderQuantity2"></el-input>
					</el-form-item>
				</el-col>
		  	</el-form-item>
	  		<el-form-item label="借购册数" >
		  		<el-col :span="11">
						<el-form-item label="" prop="totalPrice1">
							<el-input v-model="seniorForm.totalPrice1"></el-input>
						</el-form-item>
			  	</el-col>
					<el-col class="line" :span="2">-</el-col>
					<el-col :span="11">
						<el-form-item label="" prop="totalPrice2">
							<el-input v-model="seniorForm.totalPrice2"></el-input>
							</el-form-item>
					</el-col>

		  	</el-form-item>
				<el-form-item label="图书类别">
					<el-select v-model="seniorForm.singleWay"  placeholder="请选择" :style="{width:'120px'}">
						<el-option label="所有" value="userName"></el-option>
						<el-option label="PC端" value="2"></el-option>
						<el-option label="移动端" value="title"></el-option>
						<el-option label="线下端" value="title"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="图书单价" >
					<el-col :span="11" >
						<el-form-item label="" prop="orderQuantity1">
					<el-input v-model="seniorForm.orderQuantity1"></el-input>
						</el-form-item>
			  	</el-col>
				  <el-col class="line" :span="2">-</el-col>
				  <el-col :span="11">
						<el-form-item label="" prop="orderQuantity2">
							<el-input v-model="seniorForm.orderQuantity2"></el-input>
						</el-form-item>
				  </el-col>
				</el-form-item>
					<el-form-item label="出版者">
						<el-select v-model="seniorForm.singleWay"  placeholder="请选择" :style="{width:'120px'}">
							<el-option label="所有" value="userName"></el-option>
							<el-option label="PC端" value="2"></el-option>
							<el-option label="移动端" value="title"></el-option>
							<el-option label="线下端" value="title"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="作者">
						<el-select v-model="seniorForm.singleWay"  placeholder="请选择" :style="{width:'120px'}">
							<el-option label="所有" value="userName"></el-option>
							<el-option label="PC端" value="2"></el-option>
							<el-option label="移动端" value="title"></el-option>
							<el-option label="线下端" value="title"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="下单时间" prop="picker2">
						<el-date-picker
						v-model="picker2"
						type="datetimerange"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						:default-time="['12:00:00']"
						value-format="yyyy-MM-dd HH:mm:ss">
						</el-date-picker>
	  	  	</el-form-item>
			</el-form>
			<div slot="footers">
				<el-button @click="reset('seniorForm')">重置</el-button>
				  <el-button type="success" @click="onSubmit">开始统计</el-button>
	  		  <el-button @click="visible=false">取消</el-button>
			</div>
		</dia-log>
		<el-row>
			<el-col :span="24">
				<el-pagination :page-sizes="[5, 10, 15,20]" :page-size="form.pageSize" layout="total, sizes, prev, pager, next, jumper"
						:total="dataPage.total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
				</el-pagination>
			</el-col>
		</el-row>
	</div>
</template>
<script>
import { getData } from "@/methods/method";
import DiaLog from "@/components/Dialog";
import CasCader from "@/components/cascader";
import { buyBookStatistics ,bookLendExport} from "@/request/count";
import moment from 'moment';
export default {
  components: {
    DiaLog,
    CasCader
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback();
      } else {
        if (isNaN(value) || Number(value) < 0) {
          callback(new Error("请输入大于0的数字!"));
        } else {
          callback();
        }
      }
    };
    return {
      visible: false,
      loading: true,
      searchForm: {
        value: "",
        key: "bookName",
        placeOrderStartTime: "",
        placeOrderEndTime: "",
        lendBuyStatus: ""
      },
      form: {
        placeOrderStartTime: "",
        placeOrderEndTime: "",
        pageSize: 5,
        pageNum: 1
      },
      picker2: "",
      seniorForm: {
        searchValue: "",
        searchKey: "",
        name: "",
        // 订购总数量第一个
        orderQuantity1: "",
        orderQuantity2: "",
        // 订购总价第一个
        totalPrice1: "",
        totalPrice2: "",
        sex: "",
        day: "",
        readerType: "",
        readerCardNumber: "",
        singleWay: "",
        startTime1: "",
        endTime1: ""
      },
      data: [],
      dataPage: {},
      rule: {
        orderQuantity1: [{ validator: validatePass, trigger: "blur" }],
        orderQuantity2: [{ validator: validatePass, trigger: "blur" }],
        totalPrice1: [{ validator: validatePass, trigger: "blur" }],
        totalPrice2: [{ validator: validatePass, trigger: "blur" }]
      },
      power:[],//按钮权限数组
      searchHidden:false
    };
  },
  methods: {
    //得到权限按钮数组
    getPowerArr(){
      let  obj;
      let  power =this.$route.meta.power;
      for(let i=0,len=power.length;i<len;i++){
        if(power[i].name=='统计'){
          this.searchHidden=true;
          obj=power[0];
          power[0]=power[i];
          power[i]=obj
        }
      }
      this.power=power;
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
    //获取数据
    getData(data = this.form) {
      getData.call(this, buyBookStatistics, data);
    },
    searchData() {
      let newForm = this.form;
      this.form = {
        placeOrderStartTime: this.searchForm.placeOrderStartTime,
        placeOrderEndTime: this.searchForm.placeOrderEndTime,
        pageSize: 5,
        pageNum: 1,
        lendBuyStatus: this.searchForm.lendBuyStatus
      };
      this.$set(this.form, this.searchForm.key, this.searchForm.value);
      this.getData(this.form);
    },
    //导出多条图书借购统计
   exportBorrowBooks(){
        this.$confirm('是否要导出这图书借购统计?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj={
            placeOrderStartTime: this.searchForm.placeOrderStartTime,
            placeOrderEndTime: this.searchForm.placeOrderEndTime,
            lendBuyStatus: this.searchForm.lendBuyStatus
          }
          bookLendExport(JSON.stringify(obj)).then(data=>{
            if(data.data.code==0){
              // window.location.href=data.data.xlsurl;
              window.open(data.data.xlsurl)
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
            message: '导出已取消!'
          });
        });
      },
    onSubmit() {
      this.$refs.seniorForm.validate(valid => {
        if (valid) {
          if (
            Number(this.seniorForm.orderQuantity2) <=
            Number(this.seniorForm.orderQuantity1)
          ) {
            this.$message({
              type: "warning",
              message: "订购总数量第二个要大于第一个数字",
              duration: "3000"
            });
            return;
          }
          if (
            Number(this.seniorForm.totalPrice2) <=
            Number(this.seniorForm.totalPrice1)
          ) {
            this.$message({
              type: "warning",
              message: "订购总价第二个要大于第一个数字",
              duration: "3000"
            });
            return;
          }
          console.log(this.seniorForm);
          ruleListAdd(this.form1)
            .then(data => {
              if (data.data.code == 0) {
                this.$message({
                  type: "success",
                  message: "搜索成功",
                  duration: "2000"
                });

                this.getData();
              }
            })
            .catch(err => {
              this.$message({
                type: "info",
                message: "搜索失败，请重试!"
              });
            });
        } else {
          console.log("提交失败，验证还没通过!");
          return false;
        }
      });
    },
    reset(formName) {
      this.$refs[formName].resetFields();
      this.seniorForm.searchKey = "";
      this.picker2 = "";
    },
     // 表格时间格式化
      dateTabFormat(row, column) {
        var date = row[column.property];
        if (date == undefined) {
          return "";
        }
        return moment(date).format("YYYY-MM-DD");
      },
  },
  created() {
    this.getData();
    this.getPowerArr();
  },
  watch: {
    picker2(newVal) {
      if (newVal && newVal.length > 0) {
        this.seniorForm.startTime1 = newVal[0];
        this.seniorForm.endTime1 = newVal[1];
      } else {
        this.seniorForm.startTime1 = "";
        this.seniorForm.endTime1 = "";
      }
    }
  }
};
</script>

<style type="style/css">
.line {
  text-align: center;
}
.time,
.msg {
  display: inline-block;
  vertical-align: top;
}
.time {
  width: 140px;
}
.oldAddress {
  color: rgb(228, 78, 78);
  margin-right: 3px;
}
.wuliuDataLi {
  margin: 10px 0;
  display: flex;
}
.msg {
  flex: 1;
}
.toAddress {
  color: rgb(228, 78, 78);
  margin-left: 3px;
}
.borders {
  border: 1px dashed #e4e7ed;
  padding: 0 10px;
}
</style>
