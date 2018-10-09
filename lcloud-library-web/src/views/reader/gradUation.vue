<template>
    <div class="upGrage">
      <h1 class="grade_title" style="margin-right:30px;">{{gradeInfo.name}}</h1>
      <el-button type="primary" @click="graduateTotal" v-if="searchButton">毕业</el-button>
      <el-table
        :data="tableData"
        tooltip-effect="dark"
        border
        style="width: 100%;margin-top:20px;"
      >
        <el-table-column
          type="index"
          width="55">
        </el-table-column>
        <el-table-column
          prop="code"
          label="班级编码"
        >
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="班级名称"
        >
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
        >
        </el-table-column>
      </el-table>
      <el-pagination
        class="page_wrap"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[20, 40, 60, 80]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPages">
      </el-pagination>
    </div>
</template>

<script>
 import {searchGradeList,searchGradeClassList,gradeGraduation} from '@/request/circulationReaderManageSchool'
export default {
    data() {
      return {
        tableData:[],//table数据
        pageNum:1,//页码数
        pageSize:20,//每页多少条
        totalPages:0,//总页数
        gradeInfo:{},//年级数据
        power:[],//按钮权限数组
        searchButton:false
      };
    },
    mounted(){
      this.getGradeInfo();
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
          if(power[i].name=='毕业'){
            this.searchButton=true;
          }
        }
        this.power=power;
      },
      getGradeInfo(){
        let params={
          jsonStr:{
            pageNum:1,
            pageSize:20
          }
        };
        searchGradeList(params).then(res => {
          if (res.data.code == 0) {
            let len=res.data.page.list.length;
            this.gradeInfo=res.data.page.list[len-1];
            this.getGradeClassInfo();
          } else {
            this.$message({
              type: "error",
              message: res.data.msg,
              duration:1000
            });
          }
        });
      },
      getGradeClassInfo(){
        let params={
          jsonStr:{
            pageNum:this.pageNum,
            pageSize:this.pageSize,
            gradeId:this.gradeInfo.id
          }
        };
        searchGradeClassList(params).then(res => {
          if (res.data.code == 0) {
             this.totalPages=Number(res.data.page.total);
             this.tableData=res.data.page.list;
          } else {
            this.$message({
              type: "error",
              message: res.data.msg,
              duration:1000
            });
          }
        });
      },
      handleSizeChange(val) {
        this.pageSize=val;//每页多少条
        this.getGradeClassInfo();
      },
      handleCurrentChange(val) {
        this.pageNum=val;//页码数
        this.getGradeClassInfo();
      },
      graduateTotal(){
        gradeGraduation(this.gradeInfo.id).then(res => {
          if (res.data.code == 0) {
            this.$message({
              type: "success",
              message: '毕业成功',
              duration:1000
            });
            this.getGradeInfo();
          } else {
            this.$message({
              type: "error",
              message: res.data.msg,
              duration:1000
            });
          }
        });
      }
   }
  };
</script>

<style scoped>
  .grade_title{
    display:inline-block;
    color: #409EFF;
    font-size: 14px;
    font-weight:normal;
  }
  .page_wrap{
    margin-top:20px;
  }
</style>
