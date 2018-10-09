<template>
    <div id="collenction">
        <el-form :inline="true" :model="searchData" class="demo-form-inline">
           <span v-if="searchButton">
              <el-form-item label="起始条码号">
                  <el-input v-model="searchData.barCodeStart" placeholder="请输入起始条码号" clearable  v-on:keyup.enter.native="seacrch"></el-input>
              </el-form-item>
              <el-form-item label="终止条码号">
                  <el-input v-model="searchData.barCodeEnd" placeholder="请输入终止条码号" clearable v-on:keyup.enter.native="seacrch"></el-input>
              </el-form-item>
              <el-form-item label="馆藏状态">
              <el-select v-model="searchData.status">
                  <el-option label="所有" value=""></el-option>
                  <el-option label="在架" value= '0'></el-option>
                  <el-option label="借出" value= '1'></el-option>
                  <el-option label="阅览" value= '2'></el-option>
                  <el-option label="污损" value= '3'></el-option>
                  <el-option label="丢失" value= '4'></el-option>
                  <el-option label="剔除" value= '5'></el-option>
                  <el-option label="预借" value= '6'></el-option>
                  <el-option label="赠送" value= '7'></el-option>
              </el-select>
		      </el-form-item>
           </span>


          <span v-for="(item,index) in power" :key="index">
          <el-button v-if="item.name.trim()=='检索'" type="primary" icon="el-icon-search" style="margin-left: 10px;" @click="seacrch">检索</el-button>
          <el-button v-if="item.name.trim()=='删除'" type="danger" icon="el-icon-delete" style="margin-left: 10px;margin-bottom: 20px" :disabled="isCheck" @click="deletSome">删除</el-button>
          <el-button type="success" v-if="item.name.trim()=='更多条件'&&searchButton==true" :icon="iconDown" @click="expertSearch" style="margin-left: 10px;margin-bottom: 20px" >更多条件</el-button>
          </span>



          <div v-show='showNo' style="width: 1000px">
            <el-form-item label="起始索取号">
                  <el-input v-model="searchData.callNoStart" placeholder="请输入起始索取号" clearable  @keyup.enter.native="seacrch"></el-input>
            </el-form-item>
            <el-form-item label="终止索取号">
                <el-input v-model="searchData.callNoEnd" placeholder="请输入终止索取号" clearable v-on:keyup.enter.native="seacrch"></el-input>
            </el-form-item>
          <el-form-item label="馆藏地点">
            <el-select v-model="searchData.shelf">
              <el-option label="所有" value=""></el-option>
              <el-option v-for="item in collAddressData" :label="item.label" :key="item.id" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        <el-form-item label="起止入藏日期">
          <el-date-picker
              v-model="picker"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
		    </el-form-item>
        <el-form-item label="流通类型">
          <el-select v-model="searchData.actType">
              <!-- <el-option label="外文期刊" value="0"></el-option>
              <el-option label="外文图书" value="1"></el-option>
              <el-option label="特种文献" value="2"></el-option>
              <el-option label="普通古籍" value="3"></el-option>
              <el-option label="缩微制品" value="4"></el-option>
              <el-option label="岁数光盘" value="5"></el-option>
              <el-option label="声像资料" value="6"></el-option>
              <el-option label="电子文献" value="7"></el-option>
              <el-option label="中文报刊" value="8"></el-option>
              <el-option label="中文图书" value="9"></el-option> -->
              <el-option label="所有" value=""></el-option>
              <el-option v-for="item in circulationData" :label="item.label" :key="item.id" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
			</div>
		</el-form>
        <el-table
            :data="data" border  @selection-change="selectChange">
            <el-table-column  type="selection" width="40"></el-table-column>
            <el-table-column  label="序号" type="index" width="50">  </el-table-column>
            <el-table-column  prop="barCode"  label="条码号">  </el-table-column>
            <el-table-column  prop="title"  label="图书名称" >  </el-table-column>
            <el-table-column  prop="isbn"  label="ISBN" >  </el-table-column>
            <el-table-column  prop="callNo"  label="索取号" >  </el-table-column>
            <el-table-column  prop="shelfName"  label="馆藏地点" >  </el-table-column>
            <el-table-column  prop="status"  label="馆藏状态" >
                <template slot-scope="scope">
                  <span v-if="scope.row.status == 0">在架</span>
                  <span v-if="scope.row.status == 1">借出</span>
                  <span v-if="scope.row.status == 2">阅览</span>
                  <span v-if="scope.row.status == 3">污损</span>
                  <span v-if="scope.row.status == 4">丢失</span>
                  <span v-if="scope.row.status == 5">剔除</span>
                  <span v-if="scope.row.status == 6">预借</span>
                  <span v-if="scope.row.status == 7">赠送</span>
                </template>
            </el-table-column>
            <el-table-column  prop="actName"  label="流通类型" ></el-table-column>
            <el-table-column  prop="curlibName"  label="当前所在馆">
               <template slot-scope="scope" v-if="scope.row.status!=1">
                  {{scope.row.curlibName}}
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            :page-sizes="[10, 20, 30, 40]"
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
import { manageList, managDdelete, circulationList, collAddressList } from "@/request/collection";
export default {
  data() {
    return {
      picker: "", //时间选择器
      showNo: false,
      iconDown: "el-icon-caret-bottom",
      searchData: {
        barCodeStart: "",
        barCodeEnd: "",
        callNoStart: "",
        callNoEnd: "",
        status: "",
        shelf: "",
        actType: "",
        startTime: "",
        endTime: ""
      },
      circulationData: [],
      collAddressData: [],
      dataPage: {},
      data: [],
      form: {
        pageSize: 10,
        pageNum: 1
      },
      isCheck: true,
      selection: {},
      power:[],//按钮权限数组
      searchButton:false,
      moreButton:false
    };
  },
  created() {
    this.getPowerArr();
    this.getManageList(JSON.stringify(this.form));
    this.getCirculationList();
    this.getCollAddressList();
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
    // 高级搜索
    expertSearch() {
      this.showNo = !this.showNo;
      if (this.showNo) {
        this.showNo = true;
        this.iconDown = "el-icon-caret-top";
      } else {
        this.showNo = false;
        this.iconDown = "el-icon-caret-bottom";
        this.searchData = {
          barCodeStart: "",
          barCodeEnd: "",
          callNoStart: "",
          callNoEnd: "",
          status: "",
          shelf: "",
          actType: "",
          startTime: "",
          endTime: ""
        };
      }
    },
    // 流通类型下拉框
    getCirculationList() {
      circulationList().then(data =>{
        if(data.data.code == 0) {
          this.circulationData = data.data.page.list;
        }
      })
    },
    // 馆藏地点下拉框
    getCollAddressList() {
      collAddressList().then(data =>{
        if(data.data.code == 0) {
          this.collAddressData = data.data.page.list;
        }
      })
    },
    getManageList(obj) {
      manageList(obj).then(data => {
        this.dataPage = data.data.page;
        if (data.data.code == 0) {
          this.data = data.data.page.list;
          if(data.data.page.list&&data.data.page.list.length>0){
  						this.data=data.data.page.list;
  					}else{
  						if(JSON.parse(obj).pageNum>1){
  							this.form.pageNum--;
  							this.getData(JSON.stringify(this.form))
  						}else{
  							this.data=[];
  						}
  					}
        } else {
          this.$message({
            type: "error",
            message: data.data.msg,
            duration: 3 * 1000,
            showClose: true
          });
        }
      });
    },
    seacrch() {
      this.form = {
        pageSize: 10,
        pageNum: 1
      };
      Object.assign(this.form, this.searchData);
      this.getManageList(JSON.stringify(this.form));
    },
    //批量删除
    deletSome(){
      this.$confirm('确认要删除这'+this.selection.length+'条数据吗?', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {
            let arr=[];
            for(let val of this.selection){
              arr.push(val.id);
            }
            let newObj={};
            newObj=arr.toString();
            this.managDdelete(newObj);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除!'
            });
      });
    },
    //删除数据的方法
    managDdelete(obj) {
      managDdelete(obj).then(data => {
        if (data.data.code == 0 && data.data.count) {
          this.getManageList(JSON.stringify(this.form));
          this.$message({
            type: "success",
            message: "成功删除" + data.data.count + "条数据!"
          });
        } else {
          this.$message({
            type: "error",
            message: data.data.msg
          });
        }
      });
    },
    //列表选择事件
      selectChange(selection){
        if(selection.length >= 1){
          this.selection = selection;
          this.isCheck = false;
        }else{
          this.isCheck = true;
        }
      },
    // 分页事件
    handleSizeChange(val) {
      this.form.pageSize = val;
      this.getManageList(JSON.stringify(this.form));
    },
    handleCurrentChange(val) {
      this.form.pageNum = val;
      this.getManageList(JSON.stringify(this.form));
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
.bg-purple-cook {
  height: 300px;
  border: 1px solid #7777;
}
.bg-purple-dook {
  height: 300px;
  border: 1px solid #7777;
}
</style>
