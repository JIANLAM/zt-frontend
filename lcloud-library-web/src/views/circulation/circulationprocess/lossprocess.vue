<template>
  <section class="container">
    <article class="info_wrap">
      <div class="reader_info_wrap">
        <h1>读者信息</h1>
        <section class="reader_info_box">
          <el-input v-if="searchButton" ref="LendReader" placeholder="请输入内容" v-model="searchForm.value" class="input-with-select" clearable :style="{width:'75%'}"  @keyup.enter.native="checkLendReader">
            <el-select v-model="searchForm.key" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
              <el-option label="读者证号" value="readerCardNumber"></el-option>
              <!-- <el-option label="读者姓名" value="readerName"></el-option> -->
              <el-option label="身份证号" value="IDCard"></el-option>
            </el-select>
          </el-input>
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
              <li>可借：{{readerData.lendNum}}</li>
              <li>已借：{{readerData.borrow}}</li>
              <li>欠款：{{readerData.arrear}}</li>
            </ul>
          </div>
        </section>
      </div>
      <div class="reader_info_wrap">
        <h1>图书信息</h1>
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
      <h1 class="result_title">处理结果</h1>
      <div class="process_result_wrap" style="padding: 15px;"><span style="color: red">{{message}}</span></div>
    </article>
    <article class="book_lend_info">
      <h1>图书借阅信息</h1>
      <el-table
        :data="lendbookInfo"
        border
        style="width: 100%;margin-top:10px;">
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
        <el-table-column
          prop="lendStatus"
          label="借阅状态">
          <template slot-scope="scope">
            <span v-if="scope.row.lendStatus == 0">在借中</span>
            <span v-if="scope.row.lendStatus == 2">续借中</span>
            <span v-if="scope.row.lendStatus == 3">逾期</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showProcess(scope.row)">丢失处理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </article>
    <!--丢失处理-->
    <el-dialog :visible.sync="processState" title="丢失处理" width='400px' >
      <el-form :model="stainedData" style="margin-left: 40px;" :rules="rules" ref="dynamicValidateForm">
        <el-form-item label="　文献价格">
            <el-input class="fine_input" :disabled="true" v-model="stainedData.price" placeholder="" size="small"></el-input>元
        </el-form-item >
        <el-form-item label=" 罚款金额" prop="forfeit">
            <el-input class="fine_input" v-model.number="stainedData.forfeit" placeholder="" size="small"></el-input>元
        </el-form-item >
        <el-form-item label=" 支付方式" prop="payMethod">
            <el-select v-model="stainedData.payMethod" size="small">
              <el-option label="现金" value="0"></el-option>
            </el-select>
        </el-form-item >
        <el-form-item label=" 是否缴纳" prop="status">
            <el-select v-model="stainedData.status" size="small">
              <el-option label="未缴纳" value="0"></el-option>
              <el-option label="已缴纳" value="1"></el-option>
            </el-select>
        </el-form-item>
       </el-form>
       <span slot="footer" class="dialog-footer">
          <el-button  @click="hideProcess" size="small">取 消</el-button>
          <el-button type="primary" @click="stainedBtn" size="small">提 交</el-button>
        </span>
    </el-dialog>
  </section>
</template>

<script>
import {
  lendBook,
  lendReader,
  readerlendbookInfo,
  lendLose
} from "@/request/circulation";
import moment from 'moment';
export default {
  data() {
    return {
      fines: "", //罚款金额
      processState: false, //处理弹框状态
      searchForm: {
        value: "",
        key: "readerCardNumber"
      },
      searchFormA: {
        value: "",
        key: "barcode"
      },
      stainedData: {
        price: '',
        forfeit: '',
        payMethod: '',
        status: ''
      },
      lendId: '',
      lendbookInfo: [],
      message: "",
      libraryData: {}, //图书信息数据
      readerData: {}, //读者信息数据
      tableDataResult: [], //处理结果-在借图书信息的table数据
      // 校验规则
        rules: {
          forfeit: [
            { required: true, message: '罚款金额不能为空'},
            { type: 'number', message: '罚款金额必须为数字值'}
          ],
          payMethod: [
            { required: true, message: '请选择支付方式'},
          ],
          status: [
            { required: true, message: '请选择是否缴纳'},
          ]
        },
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
    // 读者信息
    checkLendReader() {
      let obj = {};
      this.$set(obj, this.searchForm.key, this.searchForm.value);
      lendReader(obj).then(data => {
        if (data.data.code == 0) {
            this.message = '读取读者信息成功';
            this.readerData = data.data.ReaderInfoVo;
            this.$refs.LendBook.focus();
            this.lendbookInfo = data.data.ReaderInfoVo.lendBookList;
        } else {
          this.message = data.data.msg;
          this.readerData = {};
          this.lendbookInfo = []
        }
        this.searchForm.value = '';
      });
    },
    // 图书信息
    checkLendBook() {
      let obj = {};
      this.$set(obj, this.searchFormA.key, this.searchFormA.value);
      lendBook(obj).then(data => {
        if (data.data.code == 0) {
          this.$refs.LendReader.focus();
          this.libraryData = data.data.holding;
          this.message = '读取图书信息成功';
        } else {
          this.message = data.data.msg;
          this.libraryData = {};
        }
      });
      this.searchFormA.value = '';
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
    },
    showProcess(row){
        this.processState=true;
        this.stainedData.price = row.price;
        this.lendId = row.id;
      },
    stainedBtn() {
      let obj = {
        forfeit: this.stainedData.forfeit,
        lendId: this.lendId,
        payMethod: this.stainedData.payMethod,
        status: this.stainedData.status
      }
      let objData = {
          readerCardNumber: this.readerData.readerCardNumber
      }
     
      let searchForm = {}
      this.$set(searchForm, this.searchForm.key, this.searchForm.value);
      this.$refs.dynamicValidateForm.validate(valid => {
        if(valid) {
          lendLose(obj).then(data=>{
            if(data.data.code == 0) {
              this.processState= false;
              this.message = '丢失处理提交成功'
              this.stainedData = {}
              lendReader(objData).then(res=>{
                if(res.data.code == 0) {
                    this.lendbookInfo = res.data.ReaderInfoVo.lendBookList;
                }
              })
            }else {
                this.$message({
                type: "error",
                message: data.data.msg,
                duration: 3 * 1000,
                showClose: true
              });
            }
          })
        }
      })
    },
    hideProcess(){
      this.processState=false;
      this.stainedData = {}
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
.stained_process {
  width: 350px;
  height: 250px;
  background: #fff;
  border-radius: 5px;
}
.stained_process h1 {
  padding-top: 30px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}
.stained_process p {
  font-size: 0;
}
.stained_process p span {
  font-size: 14px;
}
.stained_process p span:nth-of-type(1) {
  display: inline-block;
  width: 80px;
  margin-right: 10px;
}
.wenxianprice {
  display: inline-block;
  text-align: left;
  text-indent: 15px;
}
.stained_process p span:nth-of-type(2) {
  display: inline-block;
  width: 80px;
}
.stained_process p:nth-of-type(1) {
  margin-top: 30px;
}
.stained_process p:nth-of-type(2) {
  margin-top: 20px;
}
.stained_process li {
  margin-top: 30px;
}
.fine_input {
  width: 200px;
  height: 30px;
  outline: none;
  border-radius: 5px;
}
.close_btn {
  margin-left: 25px;
}
</style>

