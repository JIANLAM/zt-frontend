<template>
  <section class="container">
    <article class="info_wrap">
      <div class="reader_info_wrap">
        <div class="h-one">读者信息</div>
        <section class="reader_info_box">
          <el-form :model="searchForm" v-if="searchButton">
            <el-input ref="LendReader" placeholder="请输入内容" v-model="searchForm.value" class="input-with-select" clearable :style="{width:'75%'}" @keyup.enter.native="checkLendReader">
              <el-select v-model="searchForm.key" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
                <el-option label="读者证号" value="readerCardNumber"></el-option>
                <!-- <el-option label="读者姓名" value="readerName"></el-option> -->
                <el-option label="身份证号" value="IDCard"></el-option>
              </el-select>
            </el-input>
            <!-- <el-checkbox v-model="slotCardChecked" @change="checkLendReader">刷卡读证</el-checkbox> -->
            </el-form>
            <div class="img_wrap flex flex-align-center">
              <img class="img_box" :src="readerData.pic" v-if="readerData.pic" />
              <img class="img_box" src="../../../assets/images/tmg.png" v-else>
              <ul class="flex-1">
                <li>所属馆：{{readerData.libraryName}}</li>
                <li>读者证号：{{readerData.readerCardNumber}}</li>
                <li>读者姓名：{{readerData.readerName}}</li>
                <li>证有效期：{{dateFormat(readerData.endDate)}}</li>
                <li>证件状态：{{setCertificateStatus(readerData.status)}}</li>
                <li>读者证类别: {{readerData.readerTypeName}}</li>
                <li>规则类别：{{readerData.ruleTypeName}}</li>
                <li>可借：{{readerData.lendNum}}</li>
                <li>已借：{{readerData.borrow}}</li>
                <li>欠款：{{readerData.arrear}}</li>
              </ul>
            </div>

        </section>
      </div>
      <div class="reader_info_wrap">
        <div class="h-one">图书信息</div>
        <section class="reader_info_box">
          <el-input v-if="searchButton" ref="LendBook" placeholder="请输入内容" v-model="searchFormA.value" class="input-with-select" clearable :style="{width:'75%'}" @keyup.enter.native="checkLendBook">
            <el-select v-model="searchFormA.key" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
              <el-option label="条形码" value="barcode"></el-option>
              <el-option label="RFID码" value="rfid"></el-option>
            </el-select>
          </el-input>
          <div class="img_wrap flex flex-align-center">
            <img class="img_box" :src="libraryData.pic" v-if="libraryData.pic" />
            <img class="img_box" src="../../../assets/images/book.png" v-else>
            <ul class="flex-1" style="height: 275px">
              <li>所属馆：{{libraryData.ownlibName}}</li>
              <li>条码号：{{libraryData.barcode}}</li>
              <li>书名：{{libraryData.title}}</li>
              <li>索取号：{{libraryData.callNo}}</li>
              <li>ISBN：{{libraryData.isbn}}</li>
              <li>作者: {{libraryData.author}}</li>
              <li>价格：{{libraryData.price}}</li>
              <li>出版社：{{libraryData.publisher}}</li>
              <li>出版日期：{{dateFormat(libraryData.pubdate)}}</li>
            </ul>
          </div>
        </section>
      </div>
    </article>
    <article class="tab_wrap">
      <!-- <ul class="clearfix process_result_tab">
        <li class="fl" v-for="(item,index) in processResult" :key="index" @click="processResultFun(index)" :class="{actived:processResultState==index}">{{item}}</li>
      </ul> -->
       <div class="h-one">处理结果</div>
      <div class="process_result_wrap" style="padding: 15px;"><span style="color: red">{{message}}</span></div>
    </article>
    <article class="book_lend_info">
      <div class="h-one">图书借阅信息</div>
      <el-table
        :data="debitData"
        border
        style="width: 100%;margin-top:25px;">
        <el-table-column
          type="index"
          width="50"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="ownlibName"
          label="所属馆"
          width="180">
        </el-table-column>
        <el-table-column
          prop="barcode"
          label="条码号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="title"
          label="图书名称">
        </el-table-column>
        <el-table-column
          prop="callNo"
          label="索取号">
        </el-table-column>
        <el-table-column
          prop="isbn"
          label="ISBN">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格">
        </el-table-column>
        <el-table-column
          prop="lendTime"
          label="借出日期"
          :formatter="dateTabFormat">
        </el-table-column>
        <el-table-column
          prop="dueBackTime"
          label="应还日期"
          :formatter="dateTabFormat">
        </el-table-column>
        <!-- <el-table-column
          prop=""
          label="图书状态">
        </el-table-column> -->
      </el-table>
    </article>
  </section>
</template>

<script>
let processResult = ["处理结果", "在借图书信息"];
import { loanProcessing, lendBook, lendReader, bookInLend } from "@/request/circulation";
import moment from 'moment';
export default {
  data() {
    return {
      searchForm: {
        value: "",
        key: "readerCardNumber",
      },
      searchFormA: {
        value: "",
        key: "barcode",
      },
      message: '',
      libraryData: {},
      readerData: {},
      processResultState: 0, //处理结果状态的变化
      debitData: [], //处理结果-在借图书信息的table数据
      tableDataBookLend: [], //图书借阅信息的table数据
      power:[],//按钮权限数组
      searchButton:false
    };
  },
  created() {
    this.getPowerArr();
    // this.getLoanProcessing(this.form);
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
    getLoanProcessing(obj) {
      loanProcessing(obj).then(data => {
        if (data.data.code == 0) {
          this.debitData.push(data.data.lend);
          this.message = data.data.lend.title + '已成功借出';
        } else {
          // this.$message({
          //   type: "error",
          //   message: data.data.msg,
          //   duration: 3 * 1000,
          //   showClose: true
          // });
          this.message = data.data.msg;
        }
      });
    },
    checkLendReader() {
      let obj = {};
      this.$set(obj, this.searchForm.key, this.searchForm.value);
        lendReader(obj).then(data =>{
          if(data.data.code == 0) {
            this.message = '读取读者信息成功';
            this.readerData = data.data.ReaderInfoVo;
            this.$refs.LendBook.focus();
            if(this.libraryData.id) {
              let ids = {
                readerId: this.readerData.readerId,
                holdingId: this.libraryData.id
              }
              this.getLoanProcessing(ids);

            }
          }else {
            this.message = data.data.msg;
            this.readerData = {};
          }
          this.searchForm.value = '';
        })
    },
    // 图书信息
    checkLendBook() {
      let obj = {};
      this.$set(obj, this.searchFormA.key, this.searchFormA.value);
        bookInLend(obj).then(data =>{
          if(data.data.code == 0) {
            this.libraryData = data.data.holding;
            this.message = '读取图书信息成功';
            this.$refs.LendReader.focus();
            if(this.readerData.readerId) {
              let ids = {
                readerId: this.readerData.readerId,
                holdingId: this.libraryData.id
              }
              this.getLoanProcessing(ids);
            }
          }else {
            this.message = data.data.msg;
            this.libraryData = {};
          }
          this.searchFormA.value = '';
        })
    },
    setCertificateStatus(n) {
      var $map = {
        0: '禁用',
        1: '正常',
        2: '注销',
        3: '挂失'
      };
      return $map[n] || ''
    },
    // 表格时间格式化
    dateTabFormat(row, column) {
        var date = row[column.property];
        if (date == undefined) {
          return "";
        }
        return moment(date).format("YYYY-MM-DD");
      },
    // 文本转时间方法
    dateFormat(time) {
      if (time == undefined) {
        return "";
      }
      return moment(time).format("YYYY-MM-DD");
    },
    processResultFun(index) {
      this.processResultState = index;
    }
  }
};
</script>

<style scoped>
.info_wrap {
  display: flex;
  justify-content: space-between;
}
.reader_info_wrap {
  width: 48%;
  box-sizing: border-box;
}
.reader_info_wrap h1,
.book_lend_info h1 {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
.reader_info_box {
  margin-top: 10px;
  padding: 20px 10px;
  border: 1px solid #999;
  border-radius: 5px;
  background: #fff;
}
.img_wrap {
  margin-top: 20px;
}
.img_box {
  width: 207px;
  height: 248px;
}
.img_wrap ul {
  margin-left: 35px;
}
.img_wrap ul li {
  font-size: 14px;
  color: #333;
  margin-top: 15px;
}
.img_wrap ul li:first-of-type {
  margin-top: 0;
}
.process_result_tab li {
  color: #333;
  margin-left: 20px;
  font-weight: bold;
}
.process_result_tab li.actived {
  color: #409eff;
}
.process_result_tab li:first-of-type {
  margin-left: 0;
}
.tab_wrap {
  margin-top: 55px;
}
.process_result_wrap {
  height: 120px;
  margin-top: 25px;
  border: 1px solid #999;
  border-radius: 5px;
  background: #fff;
}
.book_lend_info {
  margin-top: 80px;
}
.h-one{
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
</style>

