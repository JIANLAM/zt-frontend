<template>
  <div id="circulationlog">
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="日志类型">
        <el-select v-model="searchForm.logType" @keyup.enter.native="search">
          <el-option label="所有" value=""></el-option>
          <el-option label="借出处理" value="借出处理"></el-option>
          <el-option label="续借处理" value="续借处理"></el-option>
          <el-option label="还回处理" value="还回处理"></el-option>
          <el-option label="污损处理" value="污损处理"></el-option>
          <el-option label="丢失处理" value="丢失处理"></el-option>
          <el-option label="代借处理" value="代借处理"></el-option>
          <el-option label="借购还回" value="借购还回"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作员">
        <el-select v-model="searchForm.operatorId" @keyup.enter.native="search">
          <el-option label="所有" value=""></el-option>
          <el-option v-for="item in operatorData" :key="item.id" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作时间">
        <el-date-picker
          v-model="picker"
          type="daterange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd"
          clearable>
        </el-date-picker>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
    </el-form>
    <el-table
      :data="tableData" border  style="width: 100%">
      <el-table-column  type="index"  label="序号" width="50">  </el-table-column>
      <el-table-column  prop="createTime"  label="操作时间" :formatter="dateTabFormat">  </el-table-column>
      <el-table-column  prop="operationType"  label="日志类型" >  </el-table-column>
      <el-table-column  prop="loginName"  label="操作员账户" >  </el-table-column>
      <el-table-column  prop="userName"  label="操作员姓名" >  </el-table-column>
      <el-table-column  prop="opContent"  label="操作内容" >  </el-table-column>
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
  </div>
</template>
<script>
  import { lendLogs, operatorList } from "@/request/circulation";
  import {cuurLibraryUser} from '@/request/systemSetup'
  import moment from 'moment';
  export default {
    data(){
      return {
        picker: [],
        checkList: [''],
        searchForm:{
          logType: '',
          startDate: '',
          endDate: '',
          operatorId: ''
        },
        form: {
          pageSize: 10,
          pageNum: 1
        },
        dataPage:{},
        tableData:[],
        operatorData: []
      };
    },
    created() {
      this.getLendLogs(this.form);
      this.getOperatorList();
    },
    methods: {
      getLendLogs(obj) {
        lendLogs(obj).then(data =>{
          if(data.data.code == 0) {
            this.dataPage = data.data.page;
            this.tableData = data.data.page.list;
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
      getOperatorList() {
        cuurLibraryUser().then(data=>{
          if(data.data.code==0){
            this.operatorData=[];
            let list=data.data.cuurLibraryUserMap;
            for(let i=0,length=list.length;i<length;i++){
              this.operatorData.push({label:list[i].login_name+"|"+list[i].username,value:list[i].id})
            }
            // this.addForm.currUser=this.operatorData[0].value

          }
        });
      },
      // 点击查询
      search() {
        this.form = {
          pageSize: 10,
          pageNum: 1,
        }
        Object.assign(this.form, this.searchForm);
        this.getLendLogs(this.form);
      },
      // 表格时间格式化
      dateTabFormat(row, column) {
        var date = row[column.property];
        if (date == undefined) {
          return "";
        }
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
      },
      // 分页事件
      handleSizeChange(val) {
        this.form.pageSize=val;
        this.getLendLogs(this.form);
      },
      handleCurrentChange(val) {
        this.form.pageNum=val;
        this.getLendLogs(this.form);
      }
    },
    watch:{
			picker(newVal){
				if(newVal&&newVal.length>0){
					this.searchForm.startDate=newVal[0];
					this.searchForm.endDate=newVal[1];
				}else{
					this.searchForm.startDate='';
					this.searchForm.endDate='';
				}
			}
		}
  };
</script>
<style>

</style>


