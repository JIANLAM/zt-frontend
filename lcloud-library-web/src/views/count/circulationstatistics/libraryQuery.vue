<template>
    <div id="currentquery">
        <el-form :inline="true" :model="form">
            <el-form-item v-if="searchButton">
                <el-input v-model="form.searchValue" clearable v-on:keyup.enter.native="searchData">
                    <el-select v-model="form.searchKey" slot="prepend" :style="{width:'150px'}">
                        <el-option label="书名" value="title"></el-option>
                        <el-option label="ISBN" value="ISBN"></el-option>
                        <el-option label="作者" value="author"></el-option>
                        <el-option label="出版社" value="publisher"></el-option>
                    </el-select>
                </el-input>
            </el-form-item>
            <span v-for="(item,index) in power" :key="index">
                <el-button v-if="item.name.trim()=='检索'" type="primary" icon="el-icon-search" @click="searchData">检索</el-button>
                <el-button v-if="item.name.trim()=='导出'" style="margin-bottom: 20px" type="warning" icon="iconfont icon-daoru" :disabled="tableDataA.length==0" @click="exportData">导出</el-button>
            </span>
        </el-form>
        <el-table
            :data="tableData" border  style="width: 100%">
          <el-table-column type="index" width="55"></el-table-column>
            <el-table-column  label="文献所属馆" prop="libName"></el-table-column>
            <el-table-column  label="ISBN" prop="isbn"></el-table-column>
            <el-table-column  label="分类号" prop="bookType"></el-table-column>
            <el-table-column  label="索书号" prop="callNo"></el-table-column>
            <el-table-column  label="书名" prop="title"></el-table-column>
            <el-table-column  label="作者" prop="author"></el-table-column>
            <el-table-column  label="出版社" prop="publisher"></el-table-column>
            <el-table-column  label="出版时间" prop="pubDate"></el-table-column>
            <el-table-column  label="价格" prop="price"></el-table-column>
            <el-table-column  label="页数" prop="pages"></el-table-column>
          <el-table-column  prop="operation"  label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="checkDetails(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[20,40,60,80]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPages"
        style="margin-top:20px;"
      >
      </el-pagination>
      <el-dialog :visible.sync="dialogImportVisible" title="图书借阅详情" :width="'1200px'" :center="true">
        <el-table
          :data="tableDataA"
          border
          style="width: 100%;">
          <el-table-column  label="文献所属馆" prop="libName"></el-table-column>
          <el-table-column  label="条码号" prop="barCode"></el-table-column>
          <el-table-column  label="读者证号" prop="readerCardNumber"></el-table-column>
          <el-table-column  label="索书号" prop="callNo"></el-table-column>
          <el-table-column  label="流通类型" prop="actName"></el-table-column>
          <el-table-column  label="馆藏地点" prop="shelf"></el-table-column>
          <el-table-column  label="馆藏状态" prop="status">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0">可借阅</span>
              <span v-if="scope.row.status == 1">在借中</span>
              <span v-if="scope.row.status == 2">可阅览</span>
              <span v-if="scope.row.status == 3">污损</span>
              <span v-if="scope.row.status == 4">遗失</span>
              <span v-if="scope.row.status == 5">剔除</span>
            </template>
          </el-table-column>
          <el-table-column  label="借出日期" prop="lendTime"></el-table-column>
          <el-table-column  label="应还日期" prop="dueBackTime"></el-table-column>
          <el-table-column  label="续借次数" prop="reLendCount"></el-table-column>
          <el-table-column  label="价格" prop="price"></el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChangeA"
          @current-change="handleCurrentChangeA"
          :current-page="pageNumA"
          :page-sizes="[20,40,60,80]"
          :page-size="pageSizeA"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPagesA"
          style="margin-top:20px;">
        </el-pagination>
      </el-dialog>
    </div>
</template>
<script>
  import {bookLendSearch,bookLendDetailSearch,bookLendDetailExport} from '@/request/dataSearchCurrent'
export default {
	data(){
  		return {
        pageNum:1,//页码数
        pageSize:20,//每页多少条
        totalPages:0,//总页数
        pageNumA:1,//页码数
        pageSizeA:20,//每页多少条
        totalPagesA:0,//总页数
        dialogImportVisible:false,//弹框显示与隐藏
        bookLendSearchId:'',//图书借阅查询的每行的id
  			form:{
          searchValue:'',
          searchKey:'title'
  			},
        tableData:[],
        tableDataA:[],
        power:[],//按钮权限数组
        searchButton:false
  		}
  },
  created(){
    this.getPowerArr();
	  this.getBookLendInfo(this.getReaderInfoParams());
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
    getReaderInfoParams(){
      let params={
        jsonStr:{
          pageNum:this.pageNum,
          pageSize:this.pageSize
        }
      };
      return params;
    },
    getSearchReaderInfoParams(){
      let params={
        jsonStr:{
          pageNum:this.pageNum,
          pageSize:this.pageSize
        }
      };
      this.$set(params.jsonStr,this.form.searchKey,this.form.searchValue);
      return params;
    },
	  getBookLendInfo(params){
      bookLendSearch(params).then(res =>{
        if (res.data.code == 0){
          this.totalPages=Number(res.data.page.total);
          this.tableData=res.data.page.list;
          for(let i=0;i<this.tableData.length;i++){
            if(this.tableData[i].pubDate){
              this.$set(this.tableData[i],'pubDate',this.tableData[i].pubDate.split(' ')[0]);
            }
          }
        } else {
          this.$message({
            type: "error",
            message: res.data.msg
          });
        }
      });
    },
    searchData(){
      this.pageNum=1;//页码数
      this.pageSize=20;//每页多少条
      this.getBookLendInfo(this.getSearchReaderInfoParams());
    },
    //导出数据
    exportData(){
      let params= {
        jsonStr: {
          pageNum: this.pageNumA,
          pageSize: this.pageSizeA,
          bookId: this.bookLendSearchId
        }
      };
      this.$confirm('是否要导出这'+this.totalPagesA+'条图书借阅详情的数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        bookLendDetailExport(params).then(res=>{
          if(res.data.code==0){
            window.open(res.data.xlsurl);
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
            message: err
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消导出!'
        });
      });
    },
    //图书借阅的详情
    checkDetails(row){
	    this.bookLendSearchId=row.bookId;
      this.getBookLendDetailInfo();
	  },
    //得到图书借阅的详情
    getBookLendDetailInfo(){
       let params= {
         jsonStr:{
           pageNum: this.pageNumA,
           pageSize: this.pageSizeA,
           bookId:this.bookLendSearchId
         }
       };
       bookLendDetailSearch(params).then(res =>{
         if (res.data.code == 0){
           this.totalPagesA=Number(res.data.page.total);
           this.tableDataA=res.data.page.list;
           for(let i=0;i<this.tableDataA.length;i++){
             if(this.tableDataA[i].lendTime||this.tableDataA[i].dueBackTime){
               this.$set(this.tableDataA[i],'lendTime',this.tableDataA[i].lendTime.split(' ')[0]);
               this.$set(this.tableDataA[i],'dueBackTime',this.tableDataA[i].dueBackTime.split(' ')[0]);
             }
           }
           if(this.tableDataA.length>0){
             this.dialogImportVisible=true;
           }else if(this.tableDataA.length==0){
             this.dialogImportVisible=false;
             this.$message({
               message: '暂无相关数据'
             });
           }
         } else {
           this.$message({
             type: "error",
             message: res.data.msg
           });
         }
       });
     },
    handleSizeChange(val) {
      this.pageSize=val;//每页多少条
      this.getBookLendInfo(this.getReaderInfoParams());
    },
    handleCurrentChange(val) {
      this.pageNum=val;//页码数
      this.getBookLendInfo(this.getReaderInfoParams());
    },
    handleSizeChangeA(val) {
      this.pageSizeA=val;//每页多少条
      this.getBookLendDetailInfo();
    },
    handleCurrentChangeA(val) {
      this.pageNumA=val;//页码数
      this.getBookLendDetailInfo();
    }
  }
}
</script>
<style>

</style>
