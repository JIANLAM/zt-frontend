<template>
  <div id="autoreminder">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="借阅催还" name="first">
            <el-form :inline="true" :model="verifyFrom" :rules="rules" ref="dynamicValidateForm">
              <el-form-item label="发信邮箱" prop="outboxId">
                <el-select v-model="verifyFrom.outboxId">
                  <el-option v-for="item in mailboxData" :key="item.id" :label="item.address" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <span v-if="searchButton2">
                <el-checkbox label="发送邮件" v-model="verifyFrom.sendEmail"></el-checkbox>
                <el-checkbox label="发送通知" v-model="verifyFrom.sendNotice"></el-checkbox>
                <el-button type="success" icon="el-icon-printer" :disabled="isCheck" @click="sendData" style="margin-left: 13px">发送</el-button>
              </span>
            </el-form>
              <el-form :inline="true" :model="searchForm" v-if="searchButton" >
                <el-form-item label="图书状态">
                  <el-select v-model="searchForm.lendStatus" :style="{width:'120px'}">
                    <el-option label="所有" value="3"></el-option>
                    <el-option label="在借" value="0"></el-option>
                    <el-option label="已逾期" value="1"></el-option>
                    <el-option label="将逾期" value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="借出日期">
                  <el-date-picker
                    v-model="lendPicker"
                    type="daterange"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    value-format="yyyy-MM-dd"
                    clearable>
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="应还日期">
                  <el-date-picker
                    v-model="duebackPicker"
                    type="daterange"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    value-format="yyyy-MM-dd"
                    clearable>
                  </el-date-picker>
                </el-form-item>
                <el-button type="primary" icon="el-icon-search" style="margin-left: 10px;" @click="search">检索</el-button>
              </el-form>
            <el-table
              :data="tableData" border  style="width: 100%" @selection-change="selectChange" v-loading="loading">
              <el-table-column type="selection" width="40"></el-table-column>
              <el-table-column label="序号" type="index" width="50" align="center">  </el-table-column>
              <el-table-column  prop="readerCardNumber"  label="读者证号" >  </el-table-column>
              <el-table-column  prop="userName"  label="读者姓名" >  </el-table-column>
              <el-table-column  prop="readerCardName"  label="证类型" >  </el-table-column>
              <el-table-column  prop="email"  label="邮箱地址" >  </el-table-column>
              <el-table-column  prop="barcode"  label="条码号" >  </el-table-column>
              <el-table-column  prop="title"  label="图书名称" >  </el-table-column>
              <el-table-column  prop="callNo"  label="索取号" >  </el-table-column>
              <!-- <el-table-column  prop="ownlibName"  label="所属馆" >  </el-table-column> -->
              <el-table-column  prop="collAddress"  label="馆藏地点" >  </el-table-column>
              <el-table-column  prop="circulation"  label="流通类型" >  </el-table-column>
              <el-table-column  prop="lendTime"  label="借出日期" :formatter="dateTabFormat">  </el-table-column>
              <el-table-column  prop="dueBackTime"  label="应还日期" :formatter="dateTabFormat">  </el-table-column>
            </el-table>
            <el-pagination
              :page-sizes="[5, 10, 15,20]"
              :page-size="dataPage.pageSize"
              :current-page="dataPage.pageNum"
              layout="total, sizes, prev, pager, next, jumper"
              :total="dataPage.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            >
            </el-pagination>
    </el-tab-pane>
    <el-tab-pane label="借购催还" name="second">
          <el-form :inline="true" :model="verifyFrom" :rules="rules1" ref="dynamicValidateForm1">
              <el-form-item label="发信邮箱" prop="username">
                <el-select v-model="verifyFrom.outboxId">
                  <el-option v-for="item in mailboxData" :key="item.id" :label="item.address" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <span v-if="searchButton2">
                <el-checkbox label="发送邮件" v-model="verifyFrom.sendEmail"></el-checkbox>
                <el-checkbox label="发送通知" v-model="verifyFrom.sendNotice"></el-checkbox>
                <el-button type="success" icon="el-icon-printer" :disabled="lendbuySelection.length== 0" @click="sendlendbuyData" style="margin-left: 13px">发送</el-button>
              </span>
            </el-form>
              <el-form :inline="true" :model="searchForm" v-if="searchButton" >
                <el-form-item label="图书状态">
                  <el-select v-model="searchForm.bookStatus" :style="{width:'120px'}">
                    <el-option label="所有" value="3"></el-option>
                    <el-option label="在借" value="0"></el-option>
                    <el-option label="已逾期" value="1"></el-option>
                    <el-option label="将逾期" value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="借出日期">
                  <el-date-picker
                    v-model="lendPicker"
                    type="daterange"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    value-format="yyyy-MM-dd"
                    clearable>
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="应还日期">
                  <el-date-picker
                    v-model="duebackPicker"
                    type="daterange"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    value-format="yyyy-MM-dd"
                    clearable>
                  </el-date-picker>
                </el-form-item>
                <el-button type="primary" icon="el-icon-search" style="margin-left: 10px;" @click="searchLendbuy">检索</el-button>
              </el-form>
            <el-table
              :data="lendbuyData" border  style="width: 100%" @selection-change="lendbuyChange" v-loading="lendbuyLoading">
              <el-table-column type="selection" width="40"></el-table-column>
              <el-table-column label="序号" type="index" width="50" align="center">  </el-table-column>
              <el-table-column  prop="readerCardNumber"  label="读者证号" >  </el-table-column>
              <el-table-column  prop="userName"  label="读者姓名" >  </el-table-column>
              <el-table-column  prop="readerCardName"  label="证类型" >  </el-table-column>
              <el-table-column  prop="email"  label="邮箱地址" >  </el-table-column>
              <el-table-column  prop="barcode"  label="条码号" >  </el-table-column>
              <el-table-column  prop="title"  label="图书名称" >  </el-table-column>
              <el-table-column  prop="callNo"  label="索取号" >  </el-table-column>
              <!-- <el-table-column  prop="libraryName"  label="所属馆" >  </el-table-column> -->
              <el-table-column  prop="collAddress"  label="馆藏地点" >  </el-table-column>
              <el-table-column  prop="circulation"  label="流通类型" >  </el-table-column>
              <el-table-column  prop="lendTime"  label="借出日期" :formatter="dateTabFormat">  </el-table-column>
              <el-table-column  prop="dueBackTime"  label="应还日期" :formatter="dateTabFormat">  </el-table-column>
            </el-table>
            <el-pagination
              :page-sizes="[5, 10, 15,20]"
              :page-size="lendbuyPage.pageSize"
              :current-page="lendbuyPage.pageNum"
              layout="total, sizes, prev, pager, next, jumper"
              :total="lendbuyPage.total"
              @size-change="lendbuySizeChange"
              @current-change="lendbuyCurrentChange"
            >
            </el-pagination>
    </el-tab-pane>
  </el-tabs>

  </div>
</template>
<script>
  import { noteicList, testSmtp, sendNotice, overduelist, overdueSave } from "@/request/circulation";
  import { mailboxList } from "@/request/systemSetup";
  import moment from 'moment';
  export default {
    data(){
      var email = (rule, value, callback) => {
        var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if(!value) {
            return callback(new Error('邮箱不能为空'));
        }else {
          callback();
        }
      };
      var password = (rule, value, callback) => {
        if(!value) {
            return callback(new Error('密码不能为空'));
        }else {
          callback();
        }
      };
      var smtphost = (rule, value, callback) => {
        if(!value) {
            return callback(new Error('SMTP服务器不能为空'));
        }else {
          callback();
        }
      };
      return {
        activeName: 'first',
        checkList: [''],
        lendPicker: [],
        duebackPicker: [],
        selection:'',
        lendbuySelection: '',
        isCheck: true,
        searchForm:{
          bookStatus:'',
          duebacktimeStart: '',
          duebacktimeEnd: '',
          lendtimeStart: '',
          lendtimeEnd: ''
        },
        verifyFrom: {
          outboxId:'',
          sendEmail: false,
          sendNotice: false
        },
        form: {
          pageSize: 10,
          pageNum: 1
        },
        form1: {
          pageSize: 10,
          pageNum: 1
        },
        dataPage:{},
        tableData:[],
        // 校验规则
        rules: {
          outboxId: [
            { validator: email, trigger: 'blur' }
          ],
        },
        rules1: {
          outboxId: [
            { validator: email, trigger: 'blur' }
          ],
        },
        power:[],//按钮权限数组
        searchButton:false,
        searchButton1:false,
        searchButton2:false,
        mailboxData: [],//邮箱下拉储存点
        loading: false,
        lendbuyLoading: false,
        lendbuyData: [],
        lendbuyPage: {}
      };
    },
    created() {
      this.getPowerArr();
      this.getNoteicList(this.form);
      this.getMailboxList();
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
          if(power[i].name=='验证'){
            this.searchButton1=true;
          }
          if(power[i].name=='发送'){
            this.searchButton2=true;
          }
        }
        this.power=power;
      },
      // 借阅催还列表
      getNoteicList(obj) {
        this.loading = true;
        noteicList(obj).then(data =>{
          if(data.data.code == 0) {
            this.dataPage = data.data.page;
            this.tableData = data.data.page.list;
            this.loading = false;  
          }else {
            this.$message({
              type: "error",
              message: data.data.msg,
              duration: 3 * 1000,
              showClose: true
            });
          }
        })
      },
      // 借购催还列表
      getOverduelist(obj) {
        this.lendbuyLoading = true;
        overduelist(obj).then(data=>{
          if(data.data.code == 0) {
            this.lendbuyPage = data.data.page;
            this.lendbuyData = data.data.page.list;
            this.lendbuyLoading = false;
          }else {
            this.$message({
              type: "error",
              message: data.data.msg,
              duration: 3 * 1000,
              showClose: true
            });
          }
        })
      },
      // 邮箱下拉框
      getMailboxList() {
        mailboxList().then(data =>{
          if(data.data.code == 0) {
            this.mailboxData = data.data.page.list
          }else {
            this.$message({
              type: "error",
              message: data.data.msg,
              duration: 3 * 1000,
              showClose: true
            });
          }
        })
      },
      handleClick(tab) {
        console.log(tab.index);
        if(tab.index == '1') {
          this.getOverduelist(this.form1);
        }else {
          this.getNoteicList(this.form);
        }
      },
      // 发送按钮接口（借阅催还）  ----  模块化形式
      sendNotice(data) {
        sendNotice(data).then(data =>{
          if(data.data.code == 0) {
              this.$message({
              type: "success",
              message: '发送成功'
            });
          }else{
            this.$message({
              type: "error",
              message: data.data.msg,
              duration: 3 * 1000,
              showClose: true
            });
          }
        })
      },
      // 发送邮箱（借阅催还）
      sendData() {
        let IdArr = [];
        for(let val of this.selection){
            IdArr.push(val.id);
        }
        let data = {
          outboxId: this.verifyFrom.outboxId,
          sendEmail:  this.verifyFrom.sendEmail == true? 1:0,
          sendNotice:  this.verifyFrom.sendNotice == true? 1:0,
          lendBookIds: IdArr.toString()
        }
        if (this.verifyFrom.sendNotice == 1 &&  this.verifyFrom.sendEmail == 0) {
            this.$refs.dynamicValidateForm.resetFields();
            this.sendNotice(data);
        }else {
          this.$refs.dynamicValidateForm.validate(valid => {
            if(valid) {
                this.sendNotice(data);
            }
          })
        }
            
      },
      // 发送按钮 （借购催还） ----  模块化形式
      overdueSave(data) {
        overdueSave(data).then(data =>{
          if(data.data.code == 0) {
              this.$message({
              type: "success",
              message: '发送成功'
            });
          }else{
            this.$message({
              type: "error",
              message: data.data.msg,
              duration: 3 * 1000,
              showClose: true
            });
          }
        })
      },
      // 发送邮箱（借购催还）
      sendlendbuyData() {
        let IdArr = [];
        for(let val of this.lendbuySelection){
            IdArr.push(val.id);
        }
        let data = {
          outboxId: this.verifyFrom.outboxId,
          sendEmail:  this.verifyFrom.sendEmail == true? 1:0,
          sendNotice:  this.verifyFrom.sendNotice == true? 1:0,
          lendBookIds: IdArr.toString()
        }
        if (this.verifyFrom.sendNotice == 1 &&  this.verifyFrom.sendEmail == 0) {
            this.$refs.dynamicValidateForm1.resetFields();
            this.overdueSave(data);
        }else {
          this.$refs.dynamicValidateForm1.validate(valid => {
          if(valid) {
            this.overdueSave(data);
          }
        })
        }
        
      },
      // 点击搜索(借阅催还)
      search() {
        this.form = {
          pageSize: 10,
          pageNum: 1
        }
        Object.assign(this.form, this.searchForm);
        this.getNoteicList(this.form);
      },
      // 点击搜索（借购催还）
      searchLendbuy() {
        this.form = {
          pageSize: 10,
          pageNum: 1
        }
        Object.assign(this.form1, this.searchForm);
        this.getOverduelist(this.form1);
      },
      // 列表选择事件
      selectChange(selection){
        if(selection.length >= 1){
          this.selection = selection;
          this.isCheck = false;
        }else{
          this.isCheck = true;
        }
      },
      lendbuyChange(val) {
        if(val.length >= 1) {
          this.lendbuySelection = val;
        }
      },
      // 表格时间格式化
      dateTabFormat(row, column) {
        var date = row[column.property];
        if (date == undefined) {
          return "";
        }
        return moment(date).format("YYYY-MM-DD");
      },
      // 分页事件(借阅催还)
      handleSizeChange(val) {
        this.form.pageSize=val;
        this.getNoteicList(this.form);
      },
      handleCurrentChange(val) {
        this.form.pageNum=val;
        this.getNoteicList(this.form);
      },
      // 分页事件（借购催还）
      lendbuySizeChange(val) {
        this.form1.pageSize=val;
        this.getOverduelist(this.form1);
      },
      lendbuyCurrentChange(val) {
        this.form1.pageNum=val;
        this.getOverduelist(this.form1);
      },
    },
    watch:{
			duebackPicker(newVal){
				if(newVal&&newVal.length>0){
					this.searchForm.duebacktimeStart=newVal[0];
					this.searchForm.duebacktimeEnd=newVal[1];
				}else{
					this.searchForm.duebacktimeStart='';
					this.searchForm.duebacktimeEnd='';
				}
      },
      lendPicker(newVal){
        if(newVal&&newVal.length>0){
					this.searchForm.lendtimeStart=newVal[0];
					this.searchForm.lendtimeEnd=newVal[1];
				}else{
					this.searchForm.lendtimeStart='';
					this.searchForm.lendtimeEnd='';
				}
      }
		}
  };
</script>
<style>

</style>
