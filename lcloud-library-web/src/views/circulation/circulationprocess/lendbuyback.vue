<template>
  <section class="container">
    <article class="info_wrap">
      <div class="reader_info_wrap">
        <h1>读者信息</h1>
        <section class="reader_info_box">
          <el-input v-if="searchButton" placeholder="请输入内容" v-model="searchForm.value" class="input-with-select" clearable :style="{width:'75%'}" @keyup.enter.native="checkLendReader">
            <el-select v-model="searchForm.key" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
              <el-option label="读者证号" value="readerCardNumber"></el-option>
              <!-- <el-option label="读者姓名" value="readerName"></el-option> -->
              <el-option label="身份证号" value="IDCard"></el-option>
            </el-select>
          </el-input>
          <el-button v-if="searchButton" type="primary" icon="el-icon-search" @click="checkLendReader">查询</el-button>
          <div class="img_wrap flex">
            <ul class="flex-1">
              <li>读者证号：{{readerData.readerCardNumber}}</li>
              <li>读者姓名：{{readerData.readerName}}</li>
              <li>证有效期：{{dateFormat(readerData.endDate)}}</li>
              <li>证件状态：{{setCertificateStatus(readerData.status)}}</li>
              <li>所属图书馆：{{readerData.libraryName}}</li>
              <li>读者证类别:{{readerData.readerTypeName}}</li>
            </ul>
            <ul class="flex-1">
              <li>可借：{{readerData.lendNum}}</li>
              <li>已借：{{readerData.borrow}}</li>
              <li>欠款：{{readerData.arrear}}</li>
              <li>信用分：{{readerData.ownValue}}</li>
            </ul>
          </div>
        </section>
      </div>
      <div class="reader_info_wrap">
        <h1>图书信息</h1>
        <section class="reader_info_box">
          <el-input v-if="searchButton1" placeholder="请输入内容" v-model="searchFormA.value" class="input-with-select" clearable :style="{width:'75%'}" @keyup.enter.native="checkLendBook">
            <el-select v-model="searchFormA.key" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
              <el-option label="ISBN" value="isbn"></el-option>
            </el-select>
          </el-input>
          <el-button type="primary" @click="lendBuyBookProcess" v-if="searchButton1">借购还回</el-button>
          <div class="img_wrap flex flex-align-center">
            <ul class="flex-1">
              <li>书名：{{libraryData.title}}</li>
              <li>作者: {{libraryData.author}}</li>
              <li>ISBN：{{libraryData.isbn}}</li>
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
      <h1>借购信息列表</h1>
      <el-table
        :data="debitData"
        border
        style="width: 100%;margin-top:10px;">
        <el-table-column
          type="index"
          width="50"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="title"
          label="书名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="author"
          label="作者"
          width="180">
        </el-table-column>
        <el-table-column
          prop="isbn"
          label="ISBN">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="借购日期"
          :formatter="dateTabFormat">
        </el-table-column>
        <el-table-column
          prop="dueBackTime"
          label="应还日期"
          :formatter="dateTabFormat">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格">
        </el-table-column>
        <el-table-column
          prop="publisher"
          label="出版社">
        </el-table-column>
        <!-- <el-table-column
          prop="source"
          label="文件所属馆">
          <template slot-scope="scope">
              <span v-if="scope.row.source == 1">新华集团</span>
              <span v-if="scope.row.source == 2">本馆图书</span>
              <span v-if="scope.row.source == 3">豆瓣图书</span>
              <span v-if="scope.row.source == 4">成员馆图书</span>
          </template>
        </el-table-column> -->
      </el-table>
      <!-- <el-pagination
        :page-sizes="[5, 10, 15,20]"
        :page-size="dataPage.pageSize"
        :current-page="dataPage.pageNum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dataPage.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
    </el-pagination> -->
    </article>
  </section>
</template>

<script>
  import { lendBuyBookInfo, lendBuyReader,lendBuyBookProcess } from "@/request/circulation";
  import moment from 'moment';
  export default {
    data(){
      return {
        searchForm:{
          value:'',
          key:'readerCardNumber'
        },
        searchFormA:{
          value:'',
          key:'isbn'
        },
        form: {
          pageSize: 5,
          pageNum: 1
        },
        isCheck: true,
        dataPage: {},
        debitData: [],
        message: '',
        libraryData: {},
        readerData: {},
        tableDataResult:[],//处理结果-在借图书信息的table数据
        power:[],//按钮权限数组
        searchButton:false,
        searchButton1:false
      }
    },
    created() {
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
          }
          if(power[i].name=='借购还回'){
            this.searchButton1=true;
          }
        }
        this.power=power;
      },
      // 借购读者信息
      checkLendReader() {
        let obj = {};
        this.$set(obj, this.searchForm.key, this.searchForm.value);
        this.lendBuyReader(obj);
      },
      lendBuyReader(obj) {
        lendBuyReader(obj).then(data =>{
          if(data.data.code == 0) {
            this.readerData = data.data.lendBuyList;
            this.debitData = data.data.lendBuyList.lendBuyBookList;
           this.message = '读者信息读取成功！'
          }else {
            this.message = data.data.msg;
            this.readerData = {};
            this.debitData = [];
          }
            this.searchForm.value = '';
        })
      },
      // 借购图书信息
      checkLendBook() {
        let obj = {};
        this.$set(obj, this.searchFormA.key, this.searchFormA.value);
          lendBuyBookInfo(obj).then(data =>{
            if(data.data.code == 0) {
                this.libraryData = data.data.lendBuyBookInfo;
                this.message = '图书信息读取成功'   
            }else {
              this.message = data.data.msg;
              this.libraryData = {};
            }
            this.searchFormA.value = '';
          })
      },
      // 借购还回
      lendBuyBookProcess() {    
        if ( this.libraryData.id && this.readerData.readerId) {
          let obj = {
            preBookId: this.libraryData.id,
            readerId: this.readerData.readerId
          }
          let carNumber = {
            readerCardNumber: this.readerData.readerCardNumber
          } 
          lendBuyBookProcess(obj).then(data =>{
            if( data.data.code == 0 ) {
              this.message= "【" + data.data.bookName + "】" + "借购还回成功";
              lendBuyReader(carNumber).then(data=>{
                if(data.data.code ==0) {
                  this.debitData = data.data.lendBuyList.lendBuyBookList;
                }
              })
            }else {
              this.message = data.data.msg;
            }
          })
        }else {
          this.message = "请获取读者信息和图书信息再进行操作！！！"
        }
      },
      // 证状态格式化
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
      // 分页事件
      // handleSizeChange(val) {
      //   this.form.pageSize=val;
      //   let obj = {
      //     pageSize: this.form.pageSize,
      //     pageNum: this.form.pageNum
      //   };
      //   this.$set(obj, this.searchForm.key, this.searchForm.value);
      //   this.lendBuyReader(obj);
      // },
      // handleCurrentChange(val) {
      //   this.form.pageNum=val;
      //   let obj = {
      //     pageSize: this.form.pageSize,
      //     pageNum: this.form.pageNum
      //   };
      //   this.$set(obj, this.searchForm.key, this.searchForm.value);
      //   this.lendBuyReader(obj);
      // }
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
</style>

