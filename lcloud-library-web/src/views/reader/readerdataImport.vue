<template>
  <div id="readerinformationManagement">
    <el-button type="primary" icon="iconfont el-icon-download" @click="loadModel">下载模板</el-button>
    <el-button type="primary" icon="iconfont icon-daoru" @click="importReaderData" v-if="searchButton">导入</el-button>
    <el-table
      :data="tableData"
      border
      style="width: 100%;margin-top:20px;">
      <el-table-column  type="index" width="50"></el-table-column>
      <el-table-column  prop="readerCardNumber"  label="读者证号"></el-table-column>
      <el-table-column  prop="username" label="姓名">  </el-table-column>
      <el-table-column  prop="sex" label="性别">
        <template slot-scope="scope">
          <span v-if="scope.row.sex == 1">男</span>
          <span v-if="scope.row.sex == 2">女</span>
        </template>
      </el-table-column>
      <el-table-column  prop="status"  label="证状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">禁用</span>
          <span v-if="scope.row.status == 1">正常</span>
          <span v-if="scope.row.status == 2">注销</span>
          <span v-if="scope.row.status == 3">挂失</span>
        </template>
      </el-table-column>
      <el-table-column  prop="startDate"  label="启用日期"></el-table-column>
      <el-table-column  prop="endDate"  label="终止日期"></el-table-column>
      <el-table-column  prop="createDate"  label="办证日期"></el-table-column>
      <el-table-column  prop="prePayment"  label="预付款金额"></el-table-column>
      <el-table-column  prop="arrear"  label="欠款金额"></el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[20,40,60,80]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPages">
    </el-pagination>
    <!--模板弹框-->
    <el-dialog :visible.sync="dialogModelVisible" title="导入读者数据模板" :width="'950px'">
      <el-table
        :data="modelTableData"
        border
        style="width: 100%;">
        <el-table-column  type="index" width="50"></el-table-column>
        <el-table-column  prop="" label="读者证号"></el-table-column>
        <el-table-column  prop="" label="姓名">  </el-table-column>
        <el-table-column  prop="" label="性别"></el-table-column>
        <el-table-column  prop="" label="证状态"></el-table-column>
        <el-table-column  prop="" label="启用日期"></el-table-column>
        <el-table-column  prop="" label="终止日期"></el-table-column>
        <el-table-column  prop="" label="办证日期"></el-table-column>
        <el-table-column  prop="" label="预付款金额"></el-table-column>
        <el-table-column  prop="" label="欠款金额"></el-table-column>
      </el-table>
    </el-dialog>
    <!--导入弹框-->
    <el-dialog :visible.sync="dialogImportVisible" title="导入读者数据" class="collectionParameters supplier1 upDialog">
      <el-upload
        class="upload-demo"
        drag
        ref="upload"
        action="/roleUser/user/v1/reader/readerImport"
        accept=".xls"
        multiple
        :http-request="tableDataSuccessUpload"
        :auto-upload="false"
        name="fileName">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传xls文件</div>
      </el-upload>
      <div class="addSure">
        <el-button  round type="primary" @click="upload">点击上传</el-button>
        <el-button @click="dialogImportVisible = false" round>取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {readerList,readerDataImport} from '@/request/circulationReaderManageSchool'
  import {timeFormat} from '@/methods/method'
export default {
  data() {
    return {
      pageNum:1,//页码数
      pageSize:20,//每页多少条
      totalPages:0,//总页数
      tableData:[],//table数据
      modelTableData:[{},{}],//模板弹框数据数组
      dialogModelVisible:false,//模板弹框显示与隐藏
      dialogImportVisible:false,//导入弹框显示与隐藏
      power:[],//按钮权限数组
      searchButton:false
    };
  },
  created(){
    this.getPowerArr();
    this.getReaderInfo(this.getReaderInfoParams());
  },
  methods:{
    //得到权限按钮数组
    getPowerArr(){
      let  obj;
      let  power =this.$route.meta.power;
      for(let i=0,len=power.length;i<len;i++){
        if(power[i].name=='导入'){
          this.searchButton=true;
        }
      }
      this.power=power;
    },
    getReaderInfoParams(){
      let params={
        jsonStr:{
          page:this.pageNum,
          pageSize:this.pageSize
        },
        pageNum:this.pageNum,
        pageSize:this.pageSize
      };
      return params;
    },
    //得到读者信息
    getReaderInfo(params){
      readerList(params).then(res => {
        if (res.data.code == 0) {
          this.totalPages=Number(res.data.page.total);
          this.tableData=res.data.page.list;
          for(let i=0;i<this.tableData.length;i++){
            this.$set(this.tableData[i],'startDate',timeFormat(this.tableData[i].startDate));
            this.$set(this.tableData[i],'endDate',timeFormat(this.tableData[i].endDate));
            this.$set(this.tableData[i],'createDate',timeFormat(this.tableData[i].createDate));
          }
        } else {
          this.$message({
            type: "error",
            message: res.data.msg,
            duration:1000
          });
        }
      });
    },
    //导入数据
    importReaderData(){
      this.dialogImportVisible=true;
    },
    //上次成功事件和读者数据上传
    tableDataSuccessUpload(response){
      let formData = new FormData();
      formData.append('fileName', response.file);
      readerDataImport(formData).then(res=>{
        if(res.data.code==0){
          response.onSuccess();
          this.getReaderInfo(this.getReaderInfoParams());
          this.$message({
            type: 'success',
            message: '上传成功!',
            duration:1000
          });
        }else{
          response.onError()
          this.$message({
            type: 'error',
            message: res.data.msg,
            duration:1000
          });
        }
      })
    },
    //上传事件
    upload(){
      this.$refs.upload.submit();
    },
    handleSizeChange(val) {
      this.pageSize=val;//每页多少条
      this.getReaderInfo(this.getReaderInfoParams());
    },
    handleCurrentChange(val) {
      this.pageNum=val;//页码数
      this.getReaderInfo(this.getReaderInfoParams());
    },
    loadModel(){
      this.dialogModelVisible=true;
    }
  }
};
</script>

<style scoped>
  .upload_btn_wrap{
    margin-top:20px;
  }
  .el-upload-dragger{
    width: 460px;
  }
</style>
<style>
  .upDialog .el-upload-dragger{
    width: 460px;
  }
</style>

