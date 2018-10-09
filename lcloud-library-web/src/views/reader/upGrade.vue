<template>
    <div id="upGrage">
        <el-tabs :tab-position="tabPosition" style="height: 600px;" @tab-click="handleClick">
            <el-tab-pane :label="item.name" v-for="(item, index) in classData" :key="index">
                <div style="margin: 10px 0">
                    <el-button type="danger" size="small" @click="upgradeData" v-if="searchButton">升级</el-button>
                </div>
                <!-- <div style="float: right">
                    <el-button type="primary" plain @click="upgradeData">升级</el-button>
                </div> -->
               <el-table
                :data="tableData" border  style="width: 100%" >
                    <el-table-column  label="序号" type="index" width="50" align="center"></el-table-column>
                    <el-table-column  prop="code"  label="班级编码"></el-table-column>
                    <el-table-column  prop="name"  label="班级名称"></el-table-column>
                    <!-- <el-table-column  prop="rules" label="升级后班级"></el-table-column>     -->
                    <!-- <el-table-column label="操作">
                         <template slot-scope="scope">
                            <el-button type="text">修改</el-button>
                            <el-button type="text">删除</el-button>
                        </template>
                    </el-table-column>       -->
                </el-table>
                <el-pagination
                    class="page_wrap"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="tablePage.pageNum"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="tablePage.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tablePage.total">
                </el-pagination>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { gradeList, classesList, upgrade } from "@/request/circulation";
export default {
    data() {
      return {
        tabPosition: 'left',
        tableData:[],
        tablePage: {},
        classData:[],
        tableFrom: {
          pageNum: 1,
          pageSize:10,
          gradeId: ''
        },
        tabIndex: 0,
        power:[],//按钮权限数组
        searchButton:false
      };
    },
    created() {
      this.getPowerArr();
        this.getGradeList();
    },
    methods: {
      //得到权限按钮数组
      getPowerArr(){
        let  obj;
        let  power =this.$route.meta.power;
        for(let i=0,len=power.length;i<len;i++){
          if(power[i].name=='升级'){
            this.searchButton=true;

          }
        }
        this.power=power;
      },
    // 年级列表
       getGradeList() {
        gradeList().then(data => {
          if (data.data.code == 0) {
              this.classData = data.data.page.list;
              this.tableFrom.gradeId = data.data.page.list[0].id;
              this.classesList(this.tableFrom);
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
    //  班级列表
      classesList(obj) {
        classesList(obj).then(data=>{
          if (data.data.code == 0) {
          this.tablePage = data.data.page;
          this.tableData = data.data.page.list;
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
    // 升级
    upgradeData() {
        let id = this.classData[this.tabIndex].id;
        this.$confirm(
        "确认要升级当前【" + this.classData[this.tabIndex].name + "】的级别吗?",
        "提示",
        {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
        }
    ).then(() => {
        this.upgrade(id);
        }).catch(() => {
        this.$message({
            type: "info",
            message: "已取消删除!"
        });
    });
    },
    upgrade(id) {
        upgrade(id).then(data=>{
            if(data.data.code == 0) {
                this.$message({
                type: "success",
                message: "升级成功"
                });
                this.classesList(this.tableFrom);
                this.getGradeList();
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
    // tab切换事件
    handleClick(tab, event) {
        this.tabIndex= Number(tab.index);
        this.tableFrom.gradeId = this.classData[this.tabIndex].id
        this.classesList(this.tableFrom);
    },
    // 分页事件
    handleSizeChange(val) {
        this.tableFrom.pageSize = val;
        this.classesList(this.tableFrom);
    },
    handleCurrentChange(val) {
        this.tableFrom.pageNum = val;
        this.classesList(this.tableFrom);
    }
    }
  };
</script>

<style>
</style>
