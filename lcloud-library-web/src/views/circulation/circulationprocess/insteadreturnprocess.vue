<template>
  <div id="insteadreturn">
    <el-form :inline="true" :model="searchForm">
        <span v-if="searchButton">
          <el-form-item >
            <el-input v-model="searchForm.value" clearable>
              <el-select v-model="searchForm.key" slot="prepend" :style="{width:'150px'}">
                <el-option label="读者证号" value="readerCardNumber"></el-option>
                <el-option label="读者所属馆" value="readerLib"></el-option>
                <el-option label="图书所属馆" value="bookLibName"></el-option>
                <el-option label="图书名称" value="bookName"></el-option>
                <el-option label="ISBN" value="isbn"></el-option>
                <el-option label="条码号" value="barcode"></el-option>
                <el-option label="索取号" value="callno"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="申请时间">
            <el-date-picker
              v-model="picker"
              type="daterange"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd"
              clearable>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.statusStr">
              <el-option label="所有" value=""></el-option>
              <el-option label=" 还书待取回" value="5"></el-option>
              <el-option label="已完成" value="6"></el-option>
            </el-select>
          </el-form-item>
        </span>
      <span v-for="(item,index) in power" :key="index">
        <el-button v-if="item.name.trim()=='检索'" type="primary" icon="el-icon-search" @click="search">查询</el-button>
        <el-button v-if="item.name.trim()=='导出'" style="margin-bottom: 20px" type="warning" icon="el-icon-upload" @click="exportBackList" :disabled="tableData.length == 0">导出</el-button>
      </span>
    </el-form>
    <el-table
      :data="tableData" border  style="width: 100%" v-loading="loading">
      <el-table-column label="序号" type="index" width="50" align="center">  </el-table-column>
      <el-table-column  prop="readerCardNumber"  label="读者证号" >  </el-table-column>
      <el-table-column  prop="readerLibName"  label="读者所属馆" >  </el-table-column>
      <el-table-column  prop="bookLibName"  label="图书所属馆" >  </el-table-column>
      <el-table-column  prop="barcode"  label="条码号" >  </el-table-column>
      <el-table-column  prop="bookName"  label="图书名称" >  </el-table-column>
      <el-table-column  prop="callNo"  label="索书号" >  </el-table-column>
      <el-table-column  prop="dueTime"  label="申请时间" :formatter="dateTabFormat">  </el-table-column>
      <el-table-column  prop="status"  label="状态" >
        <template slot-scope="scope">
          <span v-if="scope.row.status == 5">还书待取回</span>
          <span v-if="scope.row.status == 6">已完成</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-sizes="[10, 20, 30,40]"
      :page-size="dataPage.pageSize"
      :current-page="dataPage.pageNum"
      layout="total, sizes, prev, pager, next, jumper"
      :total="dataPage.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>
<script>
  import { helpBackList, helpBackListExport } from "@/request/circulation";
  import moment from 'moment';
  export default {
    data(){
      return {
        picker: [],
        searchForm:{
          value:'',
          key:'readerCardNumber',
          duetimeStart: '',
          duetimeEnd: '',
          statusStr: ''
        },
         form: {
          pageSize: 10,
          pageNum: 1
        },
        dataPage:{},
        tableData:[],
        exportBlist: {},
        power:[],//按钮权限数组
        searchButton:false,
        loading: false
      };
    },
    created() {
      this.getPowerArr();
      this.getHelpBackList(this.form);
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
      getHelpBackList(obj) {
        this.loading = true;
        helpBackList(obj).then(data =>{
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
      search() {
         this.form = {
          pageSize: 10,
          pageNum: 1,
          duetimeStart: this.searchForm.duetimeStart,
          duetimeEnd: this.searchForm.duetimeEnd,
          statusStr: this.searchForm.statusStr
        }
        this.$set(this.form, this.searchForm.key, this.searchForm.value);
        this.getHelpBackList(this.form);
      },
      // 表格时间格式化
      dateTabFormat(row, column) {
        var date = row[column.property];
        if (date == undefined) {
          return "";
        }
        return moment(date).format("YYYY-MM-DD");
      },
      //导出代还信息
      exportBackList(){
        this.$confirm('是否要导出该列表所有代还处理信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           Object.assign(this.exportBlist, this.searchForm);
          this.$set(this.exportBlist,this.searchForm.key, this.searchForm.value);
          helpBackListExport(this.exportBlist).then(data=>{
            if(data.data.code==0){
              window.open(data.data.url)
            }
            this.$message({
              type: 'success',
              message: '导出成功!正在下载，请稍后..',
              duration:'6000'
            });
          }).catch(err=>{
            this.$message({
              type: 'info',
              message: '导出失败!'
            });
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '导出已取消!'
          });
        });
      },
      // 分页事件
      handleSizeChange(val) {
        this.form.pageSize=val;
        this.getHelpBackList(this.form);
      },
      handleCurrentChange(val) {
        this.form.pageNum=val;
        this.getHelpBackList(this.form);
      },
    },
    watch:{
			picker(newVal){
				if(newVal&&newVal.length>0){
					this.searchForm.duetimeStart=newVal[0];
					this.searchForm.duetimeEnd=newVal[1];
				}else{
					this.searchForm.duetimeStart='';
					this.searchForm.duetimeEnd='';
				}
			}
		}
  };
</script>
<style>

</style>

