<template>
    <div id="readerinformationManagement">
        <el-form :inline="true" :model="searchFrom" class="demo-form-inline" v-if="searchButton">
            <el-form-item label="">
				  <el-input v-model="searchFrom.value" clearable   @keyup.enter.native="search">
				    <el-select v-model="searchFrom.key" slot="prepend" :style="{width:'150px'}">
                        <el-option label="读者证号" value="readerCardNumber"></el-option>
                        <el-option label="身份证号" value="IDCard"></el-option>
                    </el-select>
					<el-button slot="append" icon="el-icon-search" @click="search">检索</el-button>
				  </el-input>
			</el-form-item>
        </el-form>
        <el-form :inline="true" :model="readerFrom" class="demo-form-inline" v-if="searchButton">
            <div style="width: 60%;">
                <el-form-item label="读者证号">
                    <el-input v-model="readerFrom.readerCardNumber" readonly></el-input>
                </el-form-item>
                <el-form-item label="读者姓名">
                    <el-input v-model="readerFrom.readerName" readonly></el-input>
                </el-form-item>
                <el-form-item label="　身份证号">
                    <el-input v-model="readerFrom.idcard" readonly></el-input>
                </el-form-item>
                <el-form-item label="证状态">
                    <el-select v-model="readerFrom.status" :disabled="true">
                    <el-option label=" " value=""></el-option>
                    <el-option label="正常" value="1"></el-option>
                    <el-option label="注销" value="2"></el-option>
                    <el-option label="挂失" value="3"></el-option>
                    <el-option label="禁用" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="readerFrom.sex" :disabled="true">
                    <el-option label=" " value=""></el-option>
                    <el-option label="男" value="all"></el-option>
                    <el-option label="女" value="normal"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="预付款金额">
                    <el-input v-model="readerFrom.prePayment" readonly></el-input>
                </el-form-item>
            </div>
        </el-form>
        <el-table
            :data="tableData" border  style="width: 100%">
            <el-table-column  type="index" label="序号" width="50">  </el-table-column>
            <el-table-column  prop="typeName"  label="财经类别">  </el-table-column>
            <el-table-column  prop="financeDatetime"  label="日期">  </el-table-column>
            <el-table-column  prop="forfeit"  label="罚款金额">  </el-table-column>
            <el-table-column  prop="status" label="状态">  </el-table-column>
            <el-table-column  prop="bookName"  label="书名">  </el-table-column>
            <el-table-column  prop="barcode"  label="条码号">  </el-table-column>
        </el-table>
         <el-pagination
            :page-sizes="[10, 20, 30,40]"
            :page-size="tablePage.pageSize"
            :current-page="tablePage.pageNum"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tablePage.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            >
        </el-pagination>
    </div>
</template>

<script>
import { readerFinance } from "@/request/circulation";
export default {
  data() {
    return {
      searchFrom:{
          value: '',
          key: 'readerCardNumber',
      },
      readerFrom: {
          readerCardNumber: '',
          readerName: '',
          IDCard: '',
          status: '',
          sex: '',
      },
      form: {
          pageSize: 10,
          pageNum: 1
      },
      tablePage: {},
      tableData:[],
      power:[],//按钮权限数组
      searchButton:false
    };
  },
  created() {
    this.getPowerArr();
  },
  methods: {
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
    getReaderFinance(obj) {
          readerFinance(obj).then(data =>{
              if(data.data.code == 0){
                this.tablePage = data.data.page;
                this.tableData = data.data.page.list;
                this.readerFrom = data.data.reader;
                this.readerFrom.status = data.data.reader.status.toString();
                console.log(this.readerFrom.status);
              } else {
                this.$message({
                    type: "error",
                    message: data.data.msg,
                    duration: 3 * 1000,
                    showClose: true
                });
              }
          })
    },
    search() {
         this.form = {
          pageSize: 10,
          pageNum: 1
        }
        this.$set(this.form, this.searchFrom.key, this.searchFrom.value);
        this.getReaderFinance(this.form);
    },
    // 分页事件
    handleSizeChange(val) {
        this.form.pageSize = val;
        this.getReaderFinance(this.form);
    },
    handleCurrentChange(val) {
        this.form.pageNum = val;
        this.getReaderFinance(this.form);
    }
 }

};
</script>

<style>

</style>
