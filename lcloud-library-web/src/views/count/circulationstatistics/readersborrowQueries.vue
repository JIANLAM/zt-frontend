<template>
  <div id="currentquery">
    <el-form :inline="true" :model="form">
      <el-form-item v-if="searchButton">
        <el-input v-model="form.searchValue" placeholder="请输入内容再查询" clearable v-on:keyup.enter.native="searchData">
          <el-select v-model="form.searchKey" slot="prepend" :style="{width:'150px'}">
            <el-option label="读者证号" value="readerCardNumber"></el-option>
            <el-option label="身份证号" value="cardNumber"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <span v-for="(item,index) in power" :key="index" >
                <el-button v-if="item.name.trim()=='检索'" type="primary" icon="el-icon-search" @click="searchData">检索</el-button>
                <el-button v-if="item.name.trim()=='导出'" style="margin-bottom: 20px" :disabled="tableData.length==0" type="warning" icon="iconfont icon-daoru" @click="exportData">导出</el-button>
            </span>
    </el-form>
    <el-form :inline="true" :model="readerRecodeMan" v-if="searchButton">
      <el-form-item label="读者证号：" label-width="82px">
        <el-input v-model="readerRecodeMan.readerCardNumber" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="读者姓名：" label-width="82px">
        <el-input v-model="readerRecodeMan.userName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="证状态：" label-width="82px">
        <el-input v-if="readerRecodeMan.status==0" value="禁用" :disabled="true"></el-input>
        <el-input v-if="readerRecodeMan.status==1" value="正常" :disabled="true"></el-input>
        <el-input v-if="readerRecodeMan.status==2" value="注销" :disabled="true"></el-input>
        <el-input v-if="readerRecodeMan.status==3" value="挂失" :disabled="true"></el-input>
        <el-input v-else value="" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="读者类型：" label-width="82px">
        <el-input v-if="readerRecodeMan.readerType==0" value="其他" :disabled="true"></el-input>
        <el-input v-if="readerRecodeMan.readerType==1" value="学生" :disabled="true"></el-input>
        <el-input v-else value="" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="身份证号：" label-width="82px">
        <el-input v-model="readerRecodeMan.cardNumber" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="证有效期：" label-width="82px">
        <el-input v-model="readerRecodeMan.valiTime" :disabled="true"></el-input>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData" border  style="width: 100%">
      <el-table-column  label="文献所属馆" prop="libName"></el-table-column>
      <el-table-column  label="条码号" prop="barCode"></el-table-column>
      <el-table-column  label="书名" prop="title"></el-table-column>
      <el-table-column  label="作者" prop="author"></el-table-column>
      <el-table-column  label="索书号" prop="callNo"></el-table-column>
      <el-table-column  label="借阅类型" prop="lendStatus">
        <template slot-scope="scope">
          <span v-if="scope.row.lendStatus==0">在借</span>
          <span v-if="scope.row.lendStatus==1">已还</span>
          <span v-if="scope.row.lendStatus==2">续借</span>
          <span v-if="scope.row.lendStatus==3">逾期</span>
        </template>
      </el-table-column>
      <el-table-column  label="借出日期" prop="lendTime"></el-table-column>
      <el-table-column  label="应还日期" prop="dueBackTime"></el-table-column>
      <el-table-column  label="续借次数" prop="reLendCount"></el-table-column>
      <el-table-column  label="价格" prop="price"></el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[20,40,60,80]"
      :page-size="20"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPages"
      style="margin-top:20px;">
    </el-pagination>
  </div>
</template>
<script>
  import {readerLendSearch,readerLendSearchExport} from '@/request/dataSearchCurrent'
  export default {
    data(){
      return {
        pageNum:1,//页码数
        pageSize:20,//每页多少条
        totalPages:0,//总页数
        form:{
          searchValue:'',
          searchKey:'readerCardNumber'
        },
        readerRecodeMan:{},
        tableData:[],
        power:[],//按钮权限数组
        searchButton:false
      }
    },
    created(){
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
            obj=power[0];
            power[0]=power[i];
            power[i]=obj
          }
        }
        this.power=power;
      },
      getReaderLendInfo(){
        let params={
          jsonStr:{
            pageNum:this.pageNum,
            pageSize:this.pageSize
          }
        };
        this.$set(params.jsonStr,this.form.searchKey,this.form.searchValue);
        readerLendSearch(params).then(res =>{
          if (res.data.code == 0){
            this.totalPages=Number(res.data.page.total);
            this.readerRecodeMan=res.data.reader;
            this.tableData=res.data.page.list;
            for(let i=0;i<this.tableData.length;i++){
              if(this.tableData[i].lendTime||this.tableData[i].dueBackTime){
                this.$set(this.tableData[i],'lendTime',this.tableData[i].lendTime.split(' ')[0]);
                this.$set(this.tableData[i],'dueBackTime',this.tableData[i].dueBackTime.split(' ')[0]);
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
      //查询
      searchData(){
        this.pageNum=1;//页码数
        this.pageSize=20;//每页多少条
        this.getReaderLendInfo();
      },
      //导出
      exportData(){
        let params={
          jsonStr:{
            pageNum:this.pageNum,
            pageSize:this.pageSize
          }
        };
        this.$set(params.jsonStr,this.form.searchKey,this.form.searchValue);
        this.$confirm('是否要导出这'+this.tableData.length+'条读者数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          readerLendSearchExport(params).then(res=>{
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
      handleSizeChange(val) {
        this.pageSize=val;//每页多少条
        this.getReaderLendInfo();
      },
      handleCurrentChange(val) {
        this.pageNum=val;//页码数
        this.getReaderLendInfo();
      },
    }
  }
</script>
<style>

</style>
