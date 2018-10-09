<template>
    <div class="collectionMaintenance">
        <el-form :inline="true" :model="searchData" class="demo-form-inline">
            <el-form-item v-if="searchButton">
                <el-input placeholder="请输入内容" v-model="searchData.value" class="input-with-select" clearable v-on:keyup.enter.native="seacrch">
                <el-select v-model="searchData.key" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
                    <el-option label="条码号" value="barCode"></el-option>
                    <el-option label="图书名称" value="title"></el-option>
                    <el-option label="ISBN" value="ISBN"></el-option>
                    <el-option label="索取号" value="callNo"></el-option>
                </el-select>
                </el-input>
            </el-form-item>
            <span v-for="(item,index) in power" :key="index">
                <el-button v-if="item.name.trim()=='检索'" type="primary" icon="el-icon-search" @click="seacrch">检索</el-button>
                <el-button v-if="item.name.trim()=='删除'" type="danger" icon="el-icon-delete" style="margin-left: 10px;" :disabled="isCheck" @click="deletSome">删除</el-button>
            </span>
        </el-form>
        <el-table
            :data="data" border @selection-change="selectChange">
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column  prop="barCode"  label="条码号">  </el-table-column>
            <el-table-column  prop="title"  label="图书名称">  </el-table-column>
            <el-table-column  prop="isbn"  label="ISBN">  </el-table-column>
            <el-table-column  prop="callNo"  label="索取号">  </el-table-column>
            <el-table-column  prop="collAddressName"  label="馆藏地点"></el-table-column>
            <el-table-column  prop="actName"  label="流通类型"></el-table-column>
            <el-table-column  prop="status"  label="馆藏状态" >
                <template slot-scope="scope">
                  <span v-if="scope.row.status == 0">在架</span>
                  <span v-if="scope.row.status == 1">借出</span>
                  <span v-if="scope.row.status == 2">阅览</span>
                  <span v-if="scope.row.status == 3">污损</span>
                  <span v-if="scope.row.status == 4">丢失</span>
                  <span v-if="scope.row.status == 5">剔除</span>
                  <span v-if="scope.row.status == 6">预借</span>
                  <span v-if="scope.row.status == 7">赠送</span>
                </template>
            </el-table-column>
             <el-table-column  prop="curlibName"  label="当前所在馆">
               <template slot-scope="scope" v-if="scope.row.status!=1">
                  {{scope.row.curlibName}}
                </template>
             </el-table-column>
            <el-table-column  label="操作">
                 <template slot-scope="scope">
                      <span v-for="(item,index) in power" :key="index">
                          <el-button v-if="item.name.trim()=='修改'" type="text" @click="manageInfo(scope.row)">修改</el-button>
                          <el-button v-if="item.name.trim()=='删除'" type="text" @click="singleDelete(scope.row)" style="color: rgb(245, 108, 108);">删除</el-button>
                      </span>
                  </template>
            </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="dataPage.pageNum"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="dataPage.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="dataPage.total">
	      </el-pagination>
        <el-dialog width="1000px" :visible.sync="visible" title="馆藏信息" center :before-close='closeDialog'>
            <div style="height: 400px;">
                <div class="img-box">
                  <img :src="formLabelAlign.pic" alt="">
                </div>
                <div class="form-left">
                  <el-form :label-position="labelPosition" :model="formLabelAlign" label-width="100px" :rules="rules" ref="form">
                      <el-form-item label="书目记录号" prop="bookId" >
                        <el-input size="small" v-model.number="formLabelAlign.bookId "></el-input>
                      </el-form-item>
                      <el-form-item label="ISBN" prop="ISBN" >
                        <el-input size="small" :disabled="true" v-model.number="formLabelAlign.isbn"></el-input>
                      </el-form-item>
                      <el-form-item label="索取号" prop="callNo" >
                        <el-input size="small" :disabled="true" v-model.number="formLabelAlign.callNo"></el-input>
                      </el-form-item>
                      <el-form-item label="借阅读者证号" prop="readerCardNumber">
                        <el-input size="small" v-model.number="formLabelAlign.readerCardNumber" :disabled="formLabelAlign.status != '1'"></el-input>
                      </el-form-item>
                      <el-form-item label="借阅日期" prop="lendTime" >
                        <!-- <el-input size="small" v-model.number="formLabelAlign.lendTime"></el-input> -->
                        <el-date-picker
                          v-model="formLabelAlign.lendTime"
                          type="date"
                          placeholder="选择日期"
                          :disabled="formLabelAlign.status != '1'">
                        </el-date-picker>
                      </el-form-item>
                      <el-form-item label="应还日期" prop="dueBackTime" >
                        <!-- <el-input size="small" v-model.number="formLabelAlign.dueBackTime"></el-input> -->
                        <el-date-picker
                          v-model="formLabelAlign.dueBackTime"
                          type="date"
                          placeholder="选择日期"
                          :disabled="formLabelAlign.status != '1'">
                        </el-date-picker>
                      </el-form-item>
                  </el-form>
                </div>
                <div class="form-right">
                  <el-form :label-position="labelPosition" :model="formLabelAlign" label-width="100px">
                      <el-form-item label="条码号" prop="barCode" >
                        <el-input size="small" v-model.number="formLabelAlign.barCode"></el-input>
                      </el-form-item>
                      <el-form-item label="所属馆" prop="barCode" >
                        <el-input size="small" :disabled="true" v-model.number="formLabelAlign.libName "></el-input>
                      </el-form-item>
                      <el-form-item label="馆藏地点">
                        <el-select size="small" v-model="formLabelAlign.collAddressName">
                            <el-option v-for="item in collAddressData" :label="item.label" :key="item.id" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="馆藏状态" prop="status">
                        <el-select size="small" v-model="formLabelAlign.status">
                            <el-option label="在架" value= '0'></el-option>
                            <el-option label="借出" value= '1'></el-option>
                            <el-option label="阅览" value= '2'></el-option>
                            <el-option label="污损" value= '3'></el-option>
                            <el-option label="丢失" value= '4'></el-option>
                            <el-option label="剔除" value= '5'></el-option>
                            <el-option label="预借" value= '6'></el-option>
                            <el-option label="赠送" value= '7'></el-option>
                        </el-select>
                      </el-form-item>
                       <el-form-item label="流通类型" prop="actType" >
                        <el-select size="small" v-model="formLabelAlign.actType">
                          <el-option v-for="item in circulationData" :label="item.label" :key="item.id" :value="item.id.toString()"></el-option>
                        </el-select>
                      </el-form-item>
                  </el-form>
                </div>

            </div>
            <span slot="footer" class="dialog-footer" >
              <el-button type="primary" @click="editSave">保存</el-button>
              <el-button @click="closeDialog">取 消</el-button>
            </span>
        </el-dialog>
   </div>
</template>
<script>
import { manageList, manageInfo, circulationList, collAddressList, managUpdate , managDdelete} from "@/request/collection";
import moment from "moment";
export default {
  data() {
    var readerCardNumber= (rule, value, callback) => {
      if(this.formLabelAlign.status == '1') {
        if (!value) {
            callback(new Error('可借阅状态必须填写借阅读者证号'));
        }else{
          // if(/^[0-9]*$/.test(value)){
          //   callback(new Error('借阅读者证号只能为数字'));
          // }else{
          //   callback();
          // }
          callback();
        }
      }else {
         callback();
      }
    };
    var lendTime = (rule, value, callback) => {
      if(this.formLabelAlign.status == '1') {
        if (!value) {
          callback(new Error('可借阅状态必须填写借阅日期'));
        }else{
          callback();
        }
      }else {
         callback();
      }
    };
    var dueBackTime = (rule, value, callback) => {
      if(this.formLabelAlign.status == '1') {
        if (!value) {
          callback(new Error('可借阅状态必须填写应还日期'));
        }else{
          callback();
        }
      }else {
         callback();
      }
    };
    return {
      listLoading: false,
      dataPage: {},
      data: [],
      form: {
          pageSize: 10,
          pageNum: 1
      },
      searchData: {
        value: "",
        key: "barCode"
      },
      formLabelAlign: {
      },
      labelPosition: 'left',
      visible: false,
      circulationData: {},
      collAddressData: {},
      infoId: '',
      rules: {
        readerCardNumber: [
          { validator: readerCardNumber, trigger: 'blur' }
				],
				lendTime: [
					 { validator: lendTime, trigger: 'blur' }
        ],
        dueBackTime: [
					 { validator: dueBackTime, trigger: 'blur' }
				]
      },
      editForm: {},
      selection: {},
      isCheck: true,
      power:[],//按钮权限数组
      searchButton:true
    };
  },
  created() {
    this.getPowerArr();
    this.getManageList(JSON.stringify(this.form));
    this.getCirculationList();
    this.getCollAddressList();
  },
  methods: {
    //得到权限按钮数组
    getPowerArr(){
      let  obj;
      let deleteData;
      let  power =this.$route.meta.power;
      for(let i=0,len=power.length;i<len;i++){
        if(power[i].name=='检索'){
          this.searchButton=true;
          obj=power[0];
          power[0]=power[i];
          power[i]=obj
        }
        if(power[i].name=='删除') {
          deleteData = power[len- 1];
          power[len- 1] = power[i];
          power[i] = deleteData;
        }
      }
      this.power=power;
    },
    getManageList(obj) {
      manageList(obj).then(data => {
        this.dataPage = data.data.page;
        if (data.data.code == 0) {
          this.data = data.data.page.list;
        } else {
          this.$message({
            type: "error",
            message: data.data.msg,
            duration: 3 * 1000,
            showClose: true
          });
        }
      });
    },
    seacrch() {
        this.form = {
          pageSize: 10,
          pageNum: 1
        }
        this.$set(this.form,this.searchData.key,this.searchData.value);
        this.getManageList(JSON.stringify(this.form));
    },
    // 流通类型下拉框
    getCirculationList() {
      circulationList().then(data =>{
        if(data.data.code == 0) {
          this.circulationData = data.data.page.list;
        }
      })
    },
    // 馆藏地点下拉框
    getCollAddressList() {
      collAddressList().then(data =>{
        if(data.data.code == 0) {
          this.collAddressData = data.data.page.list;
        }
      })
    },
    closeDialog() {
      this.visible = false;
      this.$refs.form.resetFields();
    },
    // 馆藏详情
    manageInfo(row) {
      this.visible = true;
      this.infoId = row.id
      this.formLabelAlign = {};
      manageInfo(this.infoId).then(data =>{
        if(data.data.code == 0) {
          this.formLabelAlign = data.data.bookCopy;
          this.formLabelAlign.status = data.data.bookCopy.status.toString();
          this.formLabelAlign.shelf = data.data.bookCopy.shelf;
          this.formLabelAlign.actType = data.data.bookCopy.actType.toString();
          this.formLabelAlign.readerCardNumber = data.data.bookCopy.readerCardNumber;
          this.formLabelAlign.lendTime = data.data.bookCopy.lendTime;
          this.formLabelAlign.dueBackTime = data.data.bookCopy.dueBackTime;
          this.formLabelAlign.ISBN = data.data.bookCopy.isbn,
          this.formLabelAlign.libName = data.data.bookCopy.libName,
          this.formLabelAlign.callNo = data.data.bookCopy.callNo,
          this.formLabelAlign.barCode = data.data.bookCopy.barCode,
          this.formLabelAlign.collAddressName = data.data.bookCopy.collAddressId
        }else {
          this.$message({
            type: "error",
            message: data.data.msg
          });
        }
      })
    },
    editSave() {
      this.editForm = {
        status: this.formLabelAlign.status,
        shelf: this.formLabelAlign.shelf,
        actType: this.formLabelAlign.actType,
        libName: this.formLabelAlign.libName,
        bookId: this.formLabelAlign.bookId,
        lendTime: moment(this.formLabelAlign.lendTime).format('YYYY-MM-DD'),
        dueBackTime: moment(this.formLabelAlign.dueBackTime).format('YYYY-MM-DD') || '',
        readerCardNumber: this.formLabelAlign.readerCardNumber || '',
        ISBN: this.formLabelAlign.ISBN,
        callNo: this.formLabelAlign.callNo,
        barCode: this.formLabelAlign.barCode,
        collAddressId: this.formLabelAlign.collAddressName
      }
      this.editForm.lendTime = this.editForm.lendTime== "Invalid date"? '': this.editForm.lendTime;
      this.editForm.dueBackTime = this.editForm.dueBackTime== "Invalid date"? '': this.editForm.dueBackTime;
      this.managUpdate(this.infoId, this.editForm);
    },
    //修改 调用接口方法
    managUpdate(ids, obj) {
      this.$refs.form.validate(valid => {
        if(valid) {
          managUpdate(ids, obj).then(data =>{
              if (data.data.code == 0 && data.data.count !=0) {
              this.visible = false;
              this.getManageList(JSON.stringify(this.form));
              this.$message({
                type: "success",
                message: "修改成功!"
              });
            } else if(data.data.code == 0 && data.data.count ==0) {
              this.$message({
                type: "error",
                message: "借阅读者证号不存在，请重新输入!"
              });
            } else {
              this.$message({
                type: "error",
                message: data.data.msg
              });
            }
          })
        }
      })
    },
    // 当前行删除
    singleDelete(row) {
      this.$confirm('确认删除条码号【'+ row.barCode +'】的图书吗?', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {
            this.managDdelete(row.id);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除!'
            });
      });
    },
     //批量删除
    deletSome(){
      this.$confirm('确认要删除这'+this.selection.length+'条数据吗?', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {
            let arr=[];
            for(let val of this.selection){
              arr.push(val.id);
            }
            let newObj={};
            newObj=arr.toString();
            this.managDdelete(newObj);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除!'
            });
      });
    },
    //删除数据的方法
    managDdelete(obj) {
      managDdelete(obj).then(data => {
        if (data.data.code == 0 && data.data.count) {
          this.getManageList(JSON.stringify(this.form));
          this.$message({
            type: "success",
            message: "成功删除" + data.data.count + "条数据!"
          });
        } else {
          this.$message({
            type: "error",
            message: data.data.msg
          });
        }
      });
    },
    //列表选择事件
      selectChange(selection){
        if(selection.length >= 1){
          this.selection = selection;
          this.isCheck = false;
        }else{
          this.isCheck = true;
        }
      },
    // 分页事件
    handleSizeChange(val) {
      this.form.pageSize = val;
      this.getManageList(JSON.stringify(this.form));
    },
    handleCurrentChange(val) {
      this.form.pageNum = val;
      this.getManageList(JSON.stringify(this.form));
    }
  }
};
</script>


<style scoped>
    .img-box{
      width: 200px;
      height: 300px;
      float: left;
    }
    .img-box img{
      width: 100%;
      height: 100%;
    }
    .form-left{
      float: left;
      margin-left: 40px;
    }
    .form-right{
      float: right;
      margin-right: 40px;
    }
    /* .form-right .el-form-item {
      margin-bottom: 1px;
    }
    .form-left .el-form-item {
      margin-bottom: 1px;
    } */
</style>
