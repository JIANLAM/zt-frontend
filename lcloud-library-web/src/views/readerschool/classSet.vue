<template>
   <div id="classSet">

      <el-tabs :tab-position="tabPosition" style="height: 600px;" @tab-click="handleClick">
         <el-tab-pane :label="item.name" v-for="(item, index) in classData" :key="index">
            <div style="margin: 10px 0">
              <el-button type="success" size="small" icon="el-icon-plus" @click="typeData('add')" v-if="searchButton">新增</el-button>
            </div>
            <el-table
               :data="tableData" border  style="width: 100%">
               <el-table-column label="序号" type="index" width="50">  </el-table-column>
               <el-table-column  prop="code"  label="班级编码">  </el-table-column>
               <el-table-column  prop="name"  label="班级名称">  </el-table-column>
               <el-table-column  prop="remark"  label="备注">  </el-table-column>
               <el-table-column  label="操作">  <template slot-scope="scope">
              <el-button type="text" @click="typeData(scope.row)" v-if="searchButton1">修改</el-button>
              <el-button type="text" @click="deleteData(scope.row)" v-if="searchButton2">删除</el-button>
            </template></el-table-column>
            </el-table>
         </el-tab-pane>
         <el-pagination
          class="page_wrap"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="tablePage.pageNum"
          :page-sizes="[2, 20, 30, 40]"
          :page-size="tablePage.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tablePage.total">
        </el-pagination>
      </el-tabs>

      <div class="increase">
         <el-dialog :visible.sync="visible" width="25%" :title="titleName" :before-close='closeDialog'>
            <el-form :model="classForm"  :rules="rules" ref="ruleForm">
               <el-form-item label="班级名称" :label-width="formLabelWidth" prop="name">
                  <el-input v-model="classForm.name" auto-complete="off" :style="{width:'220px'}"></el-input>
               </el-form-item>
               <el-form-item label="班级编码" :label-width="formLabelWidth" prop="code">
                  <el-input v-model="classForm.code" auto-complete="off" :style="{width:'220px'}"></el-input>
               </el-form-item>
               <!-- <el-form-item label="父节点" :label-width="formLabelWidth">
                  <el-input :disabled='true' v-model="classForm.parent" auto-complete="off" :style="{width:'220px'}"></el-input>
               </el-form-item> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="classesSave" size="small">保存</el-button>
               <el-button @click="closeDialog" size="small" plain>取消</el-button>
            </div>
         </el-dialog>
      </div>
   </div>
</template>

<script>
import { gradeList, classesList, classesSave, classesDelete } from "@/request/circulation";
export default {
    data() {
      var checkNumber = (rule, value, callback) => {
        let str = /^[0-9a-zA-Z]+$/;
        if (!value) {
          return callback(new Error("班级代码不能为空"));
        }
        if (!str.test(value)) {
          callback(new Error("班级代码只能为数字和英文"));
        } else {
          callback();
        }
      };
      var name = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("班级名称不能为空"));
        } else {
          callback();
        }
      };
      return {
        visible:false,
        tabPosition:'left',
        classForm: {
          code: '',
          name: '',
          gradeId: ''
        },
        tableFrom: {
          pageNum: 1,
          pageSize:2,
          gradeId: ''
        },
        titleName: '新增班级信息',
        msg: '',
        formLabelWidth: '120px',
        classData:[],
        tableData: [],
        tablePage: {},
        tabIndex: 0,
        msg: '',
        rules: {
          name: [{ validator: name, trigger: "blur" }],
          code: [{ validator: checkNumber, trigger: "blur" }],
       },
        power:[],//按钮权限数组
        searchButton:false,
        searchButton1:false,
        searchButton2:false
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
          if(power[i].name=='新增'){
            this.searchButton=true;
          }
          if(power[i].name=='修改'){
            this.searchButton1=true;
          }
          if(power[i].name=='删除'){
            this.searchButton2=true;
          }
        }
        this.power=power;
      },
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
      // tab切换事件
      handleClick(tab, event) {
        this.tabIndex= Number(tab.index);
        this.tableFrom.gradeId = this.classData[this.tabIndex].id
        this.classesList(this.tableFrom);
      },
      classesList(obj) {
        classesList(obj).then(data=>{
          if (data.data.code == 0) {
          this.tablePage = data.data.page;
          this.tableData = data.data.page.list;
          if(data.data.page.list.length == 0) {
             if (data.data.page.pageNum>1) {
              this.tableFrom.pageNum--;
              this.classesList(JSON.stringify(this.tableFrom));
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
        })
      },
      // 新增或者修改
      typeData(type) {
        this.visible = true;
        if (type == "add") {
          this.titleName = "新增班级信息";
           this.classForm = {};
          this.classForm.gradeId = this.tableFrom.gradeId;
          console.log(this.classForm);
          this.msg = "新增成功";
        } else {
          this.titleName = "修改班级信息";
          this.editId = type.id;
          this.msg = "修改成功";
          let Id = type.id;
          this.classForm = {
            name: type.name,
            code: type.code,
            gradeId: this.tableFrom.gradeId,
            id: Id,
          };
          console.log(this.classForm);
        }
      },
      classesSave() {
        let classForm = this.classForm;
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            classesSave(classForm).then(data => {
              if (data.data.code == 0) {
                this.visible = false;
                this.$message({
                  type: "success",
                  message: this.msg
                });
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
          }
        });
      },
      // 删除
      deleteData(row) {
        let id = row.id;
        this.$confirm(
          "确认要删除该班级代码为【" + row.code + "】的信息吗?",
          "警告",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "error"
          }
        ).then(() => {
            this.classesDelete(id);
          }).catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除!"
          });
        });
      },
      classesDelete(Id) {
        classesDelete(Id).then(data=>{
          if (data.data.code == 0) {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.classesList(this.tableFrom);
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
      closeDialog() {
        this.visible = false;
        this.$refs.ruleForm.resetFields();
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
