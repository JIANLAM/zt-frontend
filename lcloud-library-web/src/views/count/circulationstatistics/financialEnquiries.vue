<template>
  <div id="currentquery">
    <el-form :inline="true" :model="form">
    <span v-if="searchButton">
       <el-form-item >
         <el-input v-model="form.searchValue" clearable v-on:keyup.enter.native="searchData">
           <el-select v-model="form.searchKey" slot="prepend" :style="{width:'150px'}">
             <el-option label="读者证号" value="readerCardNumber"></el-option>
             <el-option label="身份证号" value="cardNumber"></el-option>
           </el-select>
         </el-input>
       </el-form-item>
       <el-form-item label="日期范围">
            <el-date-picker
              v-model="picker"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              clearable>
            </el-date-picker>
          </el-form-item>
    </span>
      <span v-for="(item,index) in power" :key="index">
        <el-button v-if="item.name.trim()=='检索'" type="primary" icon="el-icon-search" @click="searchData">检索</el-button>
        <el-button v-if="item.name.trim()=='导出'" style="margin-bottom: 20px"  type="warning" icon="iconfont icon-daoru" @click="exportData">导出</el-button>
      </span>
    </el-form>
    <el-table
      :data="tableData" border  style="width: 100%">
      <el-table-column  type="index" width="50"></el-table-column>
      <el-table-column  label="读者证号" prop="readerCardNumber"></el-table-column>
      <el-table-column  label="读者姓名" prop="userName"></el-table-column>
      <el-table-column  label="所属馆" prop="libName"></el-table-column>
      <el-table-column  label="操作员" prop="operatorName"></el-table-column>
      <el-table-column  label="财经类别" prop="typeName"></el-table-column>
      <el-table-column  label="日期" prop="financeDatetime"></el-table-column>
      <el-table-column  label="金额" prop="forfeit"></el-table-column>
      <el-table-column  label="付款方式" prop="payMethod">
        <template slot-scope="scope">
          <span v-if="scope.row.payMethod==0">现金</span>
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
      style="margin-top:20px;">
    </el-pagination>
  </div>
</template>
<script>
  import {readerFinanceSearch,readerFinanceSearchExport} from '@/request/dataSearchCurrent'
  export default {
    data(){
      return {
        pageNum:1,//页码数
        pageSize:20,//每页多少条
        totalPages:0,//总页数
        picker:[],
        startTime:'',//开始时间
        endTime:'',//结束时间
        form:{
          searchValue:'',
          searchKey:'readerCardNumber'
        },
        tableData:[],
        power:[],//按钮权限数组
        searchButton:false
      }
    },
    watch:{
      picker(newVal){
        if(newVal&&newVal.length>0){
          this.startTime=newVal[0];
          this.endTime=newVal[1];
        }else{
          this.startTime='';
          this.endTime='';
        }
      }
    },
    created(){
      this.getPowerArr();
      this.getReaderFinanceInfo(this.getReaderInfoParams());
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
            pageSize:this.pageSize,
            startTime:this.startTime,
            endTime:this.endTime
          }
        };
        this.$set(params.jsonStr,this.form.searchKey,this.form.searchValue);
        return params;
      },
      getReaderFinanceInfo(params){
        readerFinanceSearch(params).then(res =>{
          if (res.data.code == 0){
            this.totalPages=Number(res.data.page.total);
            this.tableData=res.data.page.list;
            for(let i=0;i<this.tableData.length;i++){
              if(this.tableData[i].financeDatetime){
                this.$set(this.tableData[i],'financeDatetime',this.tableData[i].financeDatetime.split(' ')[0]);
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
        this.getReaderFinanceInfo(this.getSearchReaderInfoParams());
      },
      //导出
      exportData(){
        let params=this.getSearchReaderInfoParams();
        this.$confirm('是否要导出这'+this.totalPages+'条读者数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          readerFinanceSearchExport(params).then(res=>{
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
        this.getReaderFinanceInfo(this.getReaderInfoParams());
      },
      handleCurrentChange(val) {
        this.pageNum=val;//页码数
        this.getReaderFinanceInfo(this.getReaderInfoParams());
      },
    }
  }
</script>
<style>

</style>

