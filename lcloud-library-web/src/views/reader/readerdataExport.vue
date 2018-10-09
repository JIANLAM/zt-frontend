<template>
   <div id="exportdata">
     <el-form :inline="true" :model="form" class="demo-form-inline">
       <span v-if="searchButton">
          <el-form-item label="读者证起止号：" prop="">
         <el-input class="item" v-model="form.firstValue"></el-input>
         <span>-</span>
         <el-input class="item" v-model="form.secondValue" @keyup.enter.native="searchReader"></el-input>
       </el-form-item>
       <el-form-item label="读者类型：" prop="readerType">
         <el-select v-model="form.readerType" placeholder="读者类型">
           <el-option v-for="(item,index) in readerTypeListInfo" :key="index" :label="item.label" :value="item.id"></el-option>
         </el-select>
       </el-form-item>
       <el-form-item label="办证日期：" prop="createDate">
         <el-date-picker
           v-model="form.createDate"
           type="date"
           placeholder="选择日期"
           value-format="yyyy-MM-dd">
         </el-date-picker>
       </el-form-item>
       <el-button type="primary" icon="el-icon-search" @click="searchReader">查询</el-button>
       </span>

       <el-button type="warning" style="margin-bottom: 20px" icon="iconfont icon-daoru" @click="exportReaderData" v-if="searchButton1" :disabled="this.tableData.length==0">导出</el-button>

     </el-form>
     <el-table
       :data="tableData"
       border
       style="width: 100%">
       <el-table-column   type="index" width="50"></el-table-column>
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
       :current-page="page"
       :page-sizes="[20,40,60,80]"
       :page-size="pageSize"
       layout="total, sizes, prev, pager, next, jumper"
       :total="totalPages">
     </el-pagination>
   </div>
</template>

<script>
  import {readerList,readerDataExport} from '@/request/circulationReaderManageSchool'
  import {readerCardList} from '@/request/systemSetup'
  import {timeFormat} from '@/methods/method'
 export default {
	data(){
    return {
      page:1,//页码数
      pageSize:20,//每页多少条
      totalPages:0,//总页数
      form:{
        firstValue:'',//读者证起止号
        secondValue:'',//读者证起止号
        readerType:'',//读者类型
        createDate:''//办证日期
      },
      readerTypeListInfo:[],//读者类型列表数据
      tableData:[],//table数据
      isBetween:'1',//导出时读者证起始值状态
      power:[],//按钮权限数组
      searchButton:false,
      searchButton1:false
    }
  },
   created(){
     this.getPowerArr();
     this.getReaderTypeList();
     this.getReaderInfo(this.getReaderInfoParams());
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
        if(power[i].name=='导出'){
          this.searchButton1=true;
        }
      }
      this.power=power;
    },
    isBetweenFun(){
      if(this.form.firstValue.trim()||this.form.secondValue.trim()){
        this.isBetween='0';
      }else if(!this.form.firstValue.trim()&&!this.form.secondValue.trim()){
        this.isBetween='1';
      }
    },
    getReaderInfoParams(){
      let params={
        jsonStr:{
          page:this.page,
          pageSize:this.pageSize
        },
        pageNum:this.page,
        pageSize:this.pageSize
      };
      return params;
    },
    getSearchReaderInfoParams(){
      this.isBetweenFun();
      let params={
        jsonStr:{
          page:this.page,
          pageSize:this.pageSize
        },
        pageNum:this.page,
        pageSize:this.pageSize
      };
      this.$set(params.jsonStr,'firstValue',this.form.firstValue.trim());
      this.$set(params.jsonStr,'secondValue',this.form.secondValue.trim());
      this.$set(params.jsonStr,'createDate',this.form.createDate?this.form.createDate:'');
      this.$set(params.jsonStr,'readerType',this.form.readerType.toString().trim());
      this.$set(params.jsonStr,'isBetween',this.isBetween);
      return params;
    },
    //得到读者信息
    getReaderInfo(params){
      readerDataExport(params).then(res => {
        if (res.data.code == 0) {
          this.totalPages=Number(res.data.reust.page.total);
          this.tableData=res.data.reust.page.list;
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
    //得到读者类型列表
    getReaderTypeList(){
      let params= {
        page: 1,
        pageSize: 20
      };
      readerCardList(params).then(res => {
        if (res.data.code == 0){
          this.readerTypeListInfo=res.data.page.list;
        } else {
          this.$message({
            type: "error",
            message: res.data.msg,
            duration:1000
          });
        }
      });
    },
    searchReader(){
      this.page=1;//页码数
      this.pageSize=20;//每页多少条
      this.getReaderInfo(this.getSearchReaderInfoParams());
    },
    //导出读者数据
    exportReaderData(){
      let params={
        jsonStr:{
          page: '',
          pageSize: '',
          firstValue:'',
          secondValue:'',
          createDate:'',
          readerType:'',
          isBetween:1
        }
      };
      this.$confirm('是否要导出这'+this.totalPages+'条读者数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        readerDataExport(params).then(res=>{
          if(res.data.code==0){
            window.open(res.data.reust.xlsurl);
            this.$message({
              type: 'success',
              message: '导出成功!正在下载，请稍后..',
              duration:'1000'
            });
          }else{
            this.$message({
              type: 'info',
              message: res.data.msg,
              duration:'1000'
            });
          }
        }).catch(err=>{
          this.$message({
            type: 'info',
            message: res.data.msg,
            duration:1000
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消导出!'
        });
      });
    },
    handleSizeChange(val) {
      this.pageSize=val;//每页多少条
      this.getReaderInfo(this.getReaderInfoParams());
    },
    handleCurrentChange(val) {
      this.page=val;//页码数
      let params=this.getReaderInfoParams();
      this.getReaderInfo(params);
    }
  }
}
</script>

<style scoped>
  .item{
    width:200px!important;
  }
</style>
