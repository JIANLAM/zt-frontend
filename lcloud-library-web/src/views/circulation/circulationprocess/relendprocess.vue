<template>
  <section class="container">
    <article class="info_wrap">
      <div class="reader_info_wrap">
        <h1>读者信息</h1>
        <section class="reader_info_box">
          <el-input  v-if="searchButton" ref="LendReader" placeholder="请输入内容" v-model="searchForm.value" class="input-with-select" clearable :style="{width:'75%'}" @keyup.enter.native="checkLendReader">
            <el-select v-model="searchForm.key" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
              <el-option label="读者证号" value="readerCardNumber"></el-option>
              <!-- <el-option label="读者姓名" value="readerName"></el-option> -->
              <el-option label="身份证号" value="IDCard"></el-option>
            </el-select>
          </el-input>
          <!-- <el-checkbox v-model="searchForm.cardChecked">刷卡读证</el-checkbox> -->
          <div class="img_wrap flex">
            <img class="img_box" :src="readerData.pic" v-if="readerData.pic" />
            <img class="img_box" src="../../../assets/images/tmg.png" v-else>
            <ul class="flex-1">
              <li>所属馆：{{readerData.libraryName}}</li>
              <li>读者证号：{{readerData.readerCardNumber}}</li>
              <li>读者姓名：{{readerData.readerName}}</li>
              <li>证有效期：{{dateFormat(readerData.endDate)}}</li>
              <li>证件状态：{{setCertificateStatus(readerData.status)}}</li>
              <li>读者证类别: {{readerData.readerTypeName}}</li>
              <li>可借：{{readerData.lendNum}}</li>
              <li>已借：{{readerData.borrow}}</li>
              <li>欠款：{{readerData.arrear}}</li>
              <li>信用分：{{readerData.credit}}</li>
            </ul>
          </div>
        </section>
      </div>
      <div class="reader_info_wrap">
        <h1>图书信息</h1>
        <section class="reader_info_box">
          <el-input v-if="searchButton" ref="LendBook" placeholder="请输入内容" v-model="searchFormA.value" class="input-with-select" clearable :style="{width:'75%'}"  @keyup.enter.native="checkLendBook">
            <el-select v-model="searchFormA.key" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
              <el-option label="条形码" value="barcode"></el-option>
              <el-option label="RFID码" value="rfid"></el-option>
            </el-select>
          </el-input>
          <!-- <el-checkbox v-model="searchFormA.autoLendChecked">自动续借</el-checkbox> -->
          <div class="img_wrap flex flex-align-center">
            <img class="img_box" :src="libraryData.pic" v-if="libraryData.pic" />
            <img class="img_box" src="../../../assets/images/book.png" v-else>
            <ul class="flex-1">
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
      <div class="h-one">处理结果</div>
      <!-- <div class="process_result_wrap" style="padding: 15px;" v-if>
        <span style="color: red">{{message}}</span>
      </div> -->
      <ul class="process_result_wrap" style="padding: 15px;">
        <li style="color: red" v-if="messageA&&messageA.length> 0" v-for=" (item,index) in messageA" :key="index">{{index+1+'.'+item.title + item.relendMsg}}</li>
        <li style="color: red" v-if="messageA.length == 0">{{message}}</li>
      </ul>
    </article>
    <article class="book_lend_info">
      <h1>图书借阅信息</h1>
      <el-table
        :data="lendbookInfo"
        border
        style="width: 100%;margin-top:10px;"
        @selection-change="selectChange">
        <el-table-column
          type="selection"
          width="50">
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
        <el-table-column
          prop="relendNum"
          label="续借次数">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" v-if="searchButton2" size="small" @click="oddRelendbook(scope.row)">续借</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button class="fr backBtn" v-if="searchButton2" type="primary" :disabled="isCheck" @click="postRelendbook">续借</el-button>
    </article>
  </section>
</template>

<script>
import {
  lendBook,
  lendReader,
  relendbook,
  readerlendbookInfo
} from "@/request/circulation";
import moment from "moment";
export default {
  data() {
    return {
      searchForm: {
        value: "",
        key: "readerCardNumber"
      },
      searchFormA: {
        value: "",
        key: "barcode"
      },
      isCheck: true,
      selection: "",
      relendbookData: [],
      lendbookInfo: [],
      message: "",
      messageA: [],
      libraryData: {}, //图书信息数据
      readerData: {}, //读者信息数据
      processResultState: 0, //处理结果状态的变化
      tableDataResult: [], //处理结果-在借图书信息的table数据
      tableDataBookLend: [], //图书借阅信息的table数据
      power:[],//按钮权限数组
      searchButton:false,
      searchButton2:false
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
        }
        if(power[i].name=='续借'){
          this.searchButton2=true;
        }
      }
      this.power=power;
    },
    // 批量续借处理
    postRelendbook() {
      let arr = [];
      for (let val of this.selection) {
        arr.push(val.id);
      }
      this.relendbook(arr);
    },
    oddRelendbook(row) {
      let idArr = [];
      idArr.push(row.id);
      this.relendbook(idArr);
    },
    relendbook(ids) {
      let obj = {
        readerCardNumber: this.readerData.readerCardNumber
      };
      // this.$set(obj, this.searchForm.key, this.searchForm.value);
      relendbook(ids).then(data => {
        if (data.data.code == 0) {
          this.messageA = data.data.relendbook;
          lendReader(obj).then(data => {
            if (data.data.code == 0) {
              this.lendbookInfo = data.data.ReaderInfoVo.lendBookList;
            }
          })
        } else {
          this.messageA = [];
          this.message = data.data.msg;
        }
      });
    },
    // 读者信息
    checkLendReader() {
      let obj = {};
      this.$set(obj, this.searchForm.key, this.searchForm.value);
      lendReader(obj).then(data => {
        if (data.data.code == 0) {
          this.message = '读取读者信息成功';
          this.readerData = data.data.ReaderInfoVo;
          this.lendbookInfo = data.data.ReaderInfoVo.lendBookList;
          this.$refs.LendBook.focus();
        } else {
          this.messageA = [];
          this.message = data.data.msg;
          this.readerData = {};
          this.lendbookInfo = [];
        }
        this.searchForm.value = '';
      });

    },
    // 图书信息
    checkLendBook() {
      let obj = {};
      let idArr = [];
      this.$set(obj, this.searchFormA.key, this.searchFormA.value);
      lendBook(obj).then(data => {
        if (data.data.code == 0) {
          this.$refs.LendReader.focus();
          this.libraryData = data.data.holding;
          this.messageA = [];
          this.message = "读取图书信息成功";
          console.log(data.data.holding);
          // if (data.data.holding.lendId) {
          //   idArr.push(data.data.holding.lendId);
          //   console.log(data.data.holding.lendId);
          //   this.relendbook(idArr);
          // }

        } else {
          this.messageA = [];
          this.message = data.data.msg;
          this.libraryData = {};
        }
        this.searchFormA.value = '';
      });
    },
    //图书借阅信息列表选择事件
    selectChange(selection) {
      if (selection.length >= 1) {
        this.selection = selection;
        this.isCheck = false;
      } else {
        this.isCheck = true;
      }
    },
    // 证件状态格式化
    setCertificateStatus(n) {
      var $map = {
        0: "禁用",
        1: "正常",
        2: "注销",
        3: "挂失"
      };
      return $map[n] || "";
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
  height: 337px;
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
  height: 150px;
  margin-top: 25px;
  border: 1px solid #999;
  border-radius: 5px;
  background: #fff;
}
.book_lend_info {
  margin-top: 80px;
}
.backBtn {
  margin-top: 15px;
}
.h-one {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
</style>
