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
          <!-- <el-checkbox v-model="searchForm.cardChecked">刷卡读证</el-checkbox> -->
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
        <h1>图书信息</h1>
        <section class="reader_info_box">
          <el-input v-if="searchButton" ref="LendBook" placeholder="请输入内容" v-model="searchFormA.value" class="input-with-select" clearable :style="{width:'75%'}"  @keyup.enter.native="checkLendBook">
            <el-select v-model="searchFormA.key" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
              <el-option label="条形码" value="barcode"></el-option>
              <el-option label="RFID码" value="rfid"></el-option>
            </el-select>
          </el-input>
          <!-- <el-checkbox v-model="searchFormA.autoLendChecked">自动还回</el-checkbox> -->
          <div class="img_wrap flex flex-align-center">
            <img class="img_box book-img" :src="libraryData.pic" v-if="libraryData.pic" />
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
      <ul class="clearfix process_result_tab">
        <li class="fl" v-for="(item,index) in processResult" :key="index" @click="processResultFun(index)" :class="{actived:processResultState==index}">{{item}}</li>
      </ul>
      <div class="process_result_wrap" style="padding: 15px;" v-if="processResultState== 0"><span style="color: red">{{message}}</span></div>
      <div  v-if="processResultState==1" class="clearfix">
        <el-table
          :data="lendbookInfo"
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
          <el-table-column
            prop="lendStatus"
            label="借阅状态">
             <template slot-scope="scope">
              <span v-if="scope.row.lendStatus == 0">在借</span>
              <span v-if="scope.row.lendStatus == 2">续借</span>
              <span v-if="scope.row.lendStatus == 3">逾借</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- <el-button class="fr backBtn" type="primary">还回</el-button> -->
      </div>
    </article>
    <article class="book_lend_info">
      <h1>已还图书列表</h1>
      <el-table
        :data="backbook"
        border
        style="width: 100%;margin-top:10px;">
        <el-table-column
          type="index"
          label="序号"
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
          prop="backTime"
          label="还书日期"
          :formatter="dateTabFormat">
        </el-table-column>
      </el-table>
    </article>
    <!--还回罚款-->
    <el-dialog :visible.sync="processState" title="逾期罚款" width='400px' >
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
  let processResult=['处理结果','在借图书信息'];
  import { lendBook, lendReader, lendBackbook, readerlendbookInfo } from "@/request/circulation";
  import moment from 'moment';
  export default {
    data(){
      return {
        searchForm:{
          value:'',
          key:'readerCardNumber',
        },
        searchFormA:{
          value:'',
          key:'barcode'
        },
        message: '',
        backbook: [],
        lendbookInfo: [],
        libraryData: {},//图书信息数据
        readerData: {},//读者信息数据
        processResult:processResult,//处理结果-在借图书信息的导航切换
        processResultState: 0,//处理结果状态的变化
        tableDataResult:[],//处理结果-在借图书信息的table数据
        tableDataReturn:[],//已还图书列表的table数据
        power:[],//按钮权限数组
        searchButton:false,
        processState: false,
        stainedData: {
            price: '',
            forfeit: '',
            payMethod: '',
            status: ''
        },
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
        barcode: '',
      }
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
      // 还回处理
      getLendBackbook(obj) {      
        lendBackbook(obj).then(data =>{
          if(data.data.code == 0) {
            this.backbook.push(data.data.lend);
            this.processResultState = 0;
            this.message = data.data.lend.title + '已成功还回';
            this.processState = false;
            if(this.readerData.readerCardNumber) {
              let cardNum = {
                readerCardNumber: this.readerData.readerCardNumber
              }
              lendReader(cardNum).then(data => {
                if(data.data.code == 0) {
                  this.lendbookInfo = data.data.ReaderInfoVo.lendBookList;
                }
              })
            }
          }else {
            this.message = data.data.msg;
            this.processResultState = 0;
          }
        })
      },
      // 读者信息
      checkLendReader() {
        let obj = {};
        this.$set(obj, this.searchForm.key, this.searchForm.value);
        lendReader(obj).then(data =>{
          if(data.data.code == 0) {
            this.message = '读取读者信息成功';
            this.readerData = data.data.ReaderInfoVo;
            this.$refs.LendBook.focus();
            this.lendbookInfo = data.data.ReaderInfoVo.lendBookList;
            this.processResultState = 1;
          }else {
            this.message = data.data.msg;
            this.readerData = {};
            this.lendbookInfo = [];
            this.processResultState = 0;
          }
          this.searchForm.value = '';
        })
      },
      // 图书信息
      checkLendBook() {
        let obj = {};
        this.$set(obj, this.searchFormA.key, this.searchFormA.value);
        this.barcode = obj.barcode;
          lendBook(obj).then(data =>{
            if(data.data.code == 0) {
              this.$refs.LendReader.focus();
              this.libraryData = data.data.holding;
              this.processResultState = 0;
              if(data.data.holding.lendId) {
                if (data.data.holding.lendStatus == 3 || (new Date(data.data.holding.currTime).getTime() - new Date(data.data.holding.dueBackTime) > 0)) {    
                  this.stainedData.price = data.data.holding.price;
                  this.processState = true;         
                }else {
                  this.getLendBackbook(obj);
                }
              } 
            }else {
              this.message = data.data.msg;
              this.libraryData = {};
            }
            this.searchFormA.value = '';
          })
      },
      // 提交罚款 
      stainedBtn() {
        let obj = {
            price: this.stainedData.price,
            forfeit: this.stainedData.forfeit,
            payMethod: this.stainedData.payMethod,
            status: this.stainedData.status,
            barcode: this.barcode
        }
        this.$refs.dynamicValidateForm.validate(valid => {
          if(valid) {
            this.getLendBackbook(obj);
          }
        })
      },
      hideProcess(){
        this.processState=false;
        this.stainedData = {}
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
      processResultFun(index){
        this.processResultState=index;
      }
    },
    created() {
      this.getPowerArr();
      // this.getLoanProcessing(this.form);
    }
  }
</script>

<style scoped>
  .info_wrap{
    display:flex;
    justify-content:space-between;
  }
  .reader_info_wrap{
    width:48%;
    box-sizing:border-box;
  }
  .reader_info_wrap h1,.book_lend_info h1{
    font-size:16px;
    font-weight:bold;
    color:#333;
  }
  .reader_info_box{
    margin-top:10px;
    padding:20px 10px;
    border:1px solid #999;
    border-radius:5px;
    background:#fff;
  }
  .img_wrap{
    margin-top:20px;
  }
  .img_box{
    width: 207px;
    height: 248px;
  }
  .img_wrap ul{
    margin-left:35px;
  }
  .img_wrap ul li{
    font-size:14px;
    color:#333;
    margin-top:15px;
  }
  .img_wrap ul li:first-of-type{
    margin-top:0;
  }
  .process_result_tab li{
    color:#333;
    margin-left:20px;
    font-weight:bold;
  }
  .process_result_tab li.actived{
    color:#409eff;
  }
  .process_result_tab li:first-of-type{
    margin-left:0;
  }
  .tab_wrap{
    margin-top:55px;
  }
  .process_result_wrap{
    height:150px;
    margin-top:25px;
    border:1px solid #999;
    border-radius:5px;
    background:#fff;
  }
  .book_lend_info{
    margin-top:80px;
  }
  .backBtn{
    margin-top:15px;
  }
  .fine_input{
    width:200px;
    height:30px;
    outline:none;
    border-radius:5px;
  }
</style>
