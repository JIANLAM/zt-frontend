<template>
   <div id="collenction">
      <el-form :inline="true" :model="searchData" class="collectionlog" v-if="searchButton">
         <!-- <el-form-item label="操作类型">
            <el-select v-model="searchData.operationType" placeholder="请选择">
               <el-option label="所有" value=""></el-option>
               <el-option label="删除" value="删除"></el-option>
               <el-option label="修改" value="修改"></el-option>
            </el-select>
         </el-form-item>
         <el-form-item label="操作员账户">
                <el-input placeholder="请输入内容" v-model="searchData.loginName" class="input-with-select" clearable>

                </el-input>
        </el-form-item> -->
       <el-form-item label="日志类型">
				    <el-select v-model="searchData.operationType" placeholder="请选择" style="width: 150px;" @keyup.enter.native="search">
		      		<el-option label="所有" value=""></el-option>
		     			<el-option label="新增" value="新增"></el-option>
		     			<el-option label="修改" value="修改"></el-option>
		     			<el-option label="删除" value="删除"></el-option>
		    		</el-select>
		    </el-form-item>
        <el-form-item label="操作员">
          <el-select v-model="searchData.loginName" @keyup.enter.native="search">
            <el-option label="所有" value=""></el-option>
            <el-option v-for="item in operatorData" :key="item.id" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作时间">
          <el-date-picker
              v-model="picker"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              clearable
              >
            </el-date-picker>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search">检索</el-button>
      </el-form>
      <el-table
        :data="data" border>
        <el-table-column  label="序号" type="index" width="50">  </el-table-column>
        <el-table-column  prop="createTime"  label="操作时间">  </el-table-column>
        <el-table-column  prop="operationType"  label="日志类型" >  </el-table-column>
        <el-table-column  prop="loginName"  label="操作员账户">  </el-table-column>
        <el-table-column  prop="userName"  label="操作员姓名">  </el-table-column>
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
import { logList } from "@/request/collection";
import {cuurLibraryUser} from '@/request/systemSetup';
export default {
  data() {
    return {
      picker: '',
      searchData: {
        key: "operationType",
        value: "",
        startTime: "",
        endTime: ""
      },
      operatorData: [],
      form: {
        pageSize: 10,
        pageNum: 1
      },
      dataPage: {},
      data: [],
      power:[],//按钮权限数组
      searchButton:false
    };
  },
  created() {
    this.getLogList(JSON.stringify(this.form));
    this.getOperatorList();
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
    getLogList(obj) {
      logList(obj).then(data => {
        this.dataPage = data.data.page;
        if (data.data.code == 0) {
          this.data = data.data.page.list;
        }else {
          this.$message({
            type: "error",
            message: data.data.msg,
            duration: 3 * 1000,
            showClose: true
          });
        }
      });
    },
    search() {
      this.form = {
        pageSize: 10,
        pageNum: 1,
      };
      Object.assign(this.form, this.searchData);
      this.getLogList(JSON.stringify(this.form));
    },
    // 操作员下拉框
    getOperatorList() {
      cuurLibraryUser().then(data=>{
        if(data.data.code==0){
          this.operatorData=[];
          let list=data.data.cuurLibraryUserMap;
          for(let i=0,length=list.length;i<length;i++){
            this.operatorData.push({label:list[i].login_name+"|"+list[i].username,value:list[i].login_name})
          }
        }
      });
    },
    // 分页事件
    handleSizeChange(val) {
      this.form.pageSize = val;
      this.getLogList(JSON.stringify(this.form));
    },
    handleCurrentChange(val) {
      this.form.pageNum = val;
      this.getLogList(JSON.stringify(this.form));
    }
  },
  watch: {
    picker(newVal) {
      if (newVal && newVal.length > 0) {
        this.searchData.startTime = newVal[0];
        this.searchData.endTime = newVal[1];
      } else {
        this.searchData.startTime = "";
        this.searchData.endTime = "";
      }
    }
  }
};
</script>
<style>
</style>
