<template>
   <div id="gradeSettings">
      <div style="margin: 10px 0">
        <el-button type="success" size="small" icon="el-icon-plus" @click="typeData('add')" v-if="searchButton">新增</el-button>
      </div>
      <el-table
         :data="tableData" border  style="width: 100%" >
         <el-table-column  type="index" width="50" label="序号">  </el-table-column>
         <el-table-column  prop="name"  label="年级名称">  </el-table-column>
         <el-table-column  prop="code"  label="年级代码">  </el-table-column>
         <el-table-column  prop="level"  label="年级级别">  </el-table-column>
         <el-table-column  prop="readerCardName"  label="所属部门">  </el-table-column>
         <el-table-column  prop="remark"  label="备注">  </el-table-column>
         <el-table-column  label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="typeData(scope.row)" v-if="searchButton1">修改</el-button>
              <el-button type="text" @click="deleteData(scope.row)" v-if="searchButton2">删除</el-button>
            </template>
           </el-table-column>
      </el-table>
      <el-pagination
            :page-sizes="[10, 20, 30, 40]"
            :page-size="tablePage.pageSize"
            :current-page="tablePage.pageNum"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tablePage.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            >
        </el-pagination>
      <el-dialog :visible.sync="visible" width="480px" :title="titleName" :before-close='closeDialog'>
        <el-form :model="levelForm" :rules="rules" ref="ruleForm">
            <el-form-item label="学段" :label-width="formLabelWidth" prop="grade">
              <el-select v-model="levelForm.type" @change='typeChange'>
                  <el-option label="小学" value="grade_primary"></el-option>
                  <el-option label="初中" value="grade_junior"></el-option>
                  <el-option label="高中" value="grade_senior"></el-option>
                  <el-option label="大学" value="university "></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="年级名称" :label-width="formLabelWidth" prop="name">
              <el-select v-model="levelForm.name"  @change='nameChange'>
                  <el-option :label="item.label" :value="item.label" v-for="item in grade" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="年级代码" :label-width="formLabelWidth" prop="code">
              <el-input v-model="levelForm.code" auto-complete="off" :style="{width:'220px'}"></el-input>
            </el-form-item>
            <el-form-item label="年级级别" :label-width="formLabelWidth" prop="level">
              <el-input :disabled="true" v-model="levelForm.level" auto-complete="off" :style="{width:'220px'}"></el-input>
            </el-form-item>
            <el-form-item label="所属部门" :label-width="formLabelWidth" prop="readerCardId">
              <el-select v-model="levelForm.readerCardId" placeholder="请选择" :style="{width:'220px'}">
                <el-option v-for="item in readerCardData" :key="item.id" :label="item.label" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="levelForm.remark" auto-complete="off" :style="{width:'220px'}"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="gradeSave" size="small">保存</el-button>
            <el-button @click="closeDialog" size="small">取 消</el-button>
        </div>
      </el-dialog>
   </div>
</template>

<script>
import {
  gradeList,
  gradeSave,
  gradeDelete,
  gradeInfo,
  levelName
} from "@/request/circulation";
import { readerCardList } from '@/request/systemSetup'

export default {
  data() {
    var checkNumber = (rule, value, callback) => {
      let str = /^[0-9a-zA-Z]+$/;
      if (!value) {
        return callback(new Error("年级代码不能为空"));
      }
      if (!str.test(value)) {
        callback(new Error("年级代码只能为数字和英文"));
      } else {
        callback();
      }
    };
    var grade = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("学段不能为空"));
      } else {
        callback();
      }
    };
    var name = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("年级名称不能为空"));
      } else {
        callback();
      }
    };
    var lendRule = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("所属部门不能为空"));
      } else {
        callback();
      }
    };
    return {
      visible: false,
      levelForm: {
        type: "",
        name: "",
        code: "",
        level: "",
        readerCardId: "",
        remark: ""
      },
      titleName: "新增年级信息",
      rules: {
        name: [{ validator: name, trigger: "change" }],
        code: [{ validator: checkNumber, trigger: "blur" }],
        type: [{ validator: grade, trigger: "blur" }],
        readerCardId: [{ validator: lendRule, trigger: "change" }]
      },
      form: {
        pageNum: 1,
        pageSize: 10
      },
      grade: [],
      formLabelWidth: "120px",
      tableData: [],
      tablePage: {},
      editId: "",
      msg: "新增成功",
      readerCardData: [],
      power:[],//按钮权限数组
      searchButton:false,
      searchButton1:false,
      searchButton2:false
    };
  },
  created() {
    this.getPowerArr();
    this.getReaderCardList();
    this.getGradeList(JSON.stringify(this.form));
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
    getGradeList(obj) {
      gradeList(obj).then(data => {
        if (data.data.code == 0) {
          this.tablePage = data.data.page;
          // this.tableData = data.data.page.list
          if (data.data.page.list) {
            this.tableData = data.data.page.list;
          }
          if(data.data.page.list.length == 0) {
             if (data.data.page.pageNum>1) {
              this.form.pageNum--;
              this.getGradeList(JSON.stringify(this.form));
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
    getReaderCardList(obj) {
        readerCardList(obj).then(data =>{
          if(data.data.code == 0) {
            this.readerCardData = data.data.page.list;
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
    // 新增年级信息
    typeData(typeName) {
      this.visible = true;
      if (typeName == "add") {
        this.titleName = "新增年级信息";
        this.levelForm = {};
        this.grade = []
        this.msg = "新增成功";
      } else {
        this.titleName = "修改年级信息";
        this.editId = typeName.id;
        this.msg = "修改成功";
        let Id = typeName.id;
        this.levelForm = {
          type: typeName.type,
          name: typeName.name,
          code: typeName.code,
          level: typeName.level,
          readerCardId: typeName.readerCardId,
          remark: typeName.remark,
          id: Id
        };
        // this.levelForm.id = id;
        // gradeInfo(id).then(data =>{
        //   if(data.data.code == 0) {
        //     this.levelForm = data.data.grade;
        //   }else {
        //     this.$message({
        //       type: "error",
        //       message: data.data.msg,
        //       duration: 3 * 1000,
        //       showClose: true
        //     });
        //   }
        // })
      }
    },
    gradeSave() {
      let levelForm = this.levelForm;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          gradeSave(levelForm).then(data => {
            if (data.data.code == 0) {
              this.visible = false;

              this.$message({
                type: "success",
                message: this.msg
              });

              this.getGradeList(this.form);
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
        "确认要删除该年级代码为【" + row.code + "】的信息吗?",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "error"
        }
      )
        .then(() => {
          this.gradeDelete(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除!"
          });
        });
    },
    gradeDelete(id) {
      gradeDelete(id).then(data => {
        if (data.data.code == 0) {
          this.$message({
            type: "success",
            message: "删除成功"
          });
          this.getGradeList(this.form);
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
    levelName(type) {
      levelName(type).then(data => {
        if (data.data.code == 0) {
          this.grade = data.data.dic;
        }
      });
    },
    // 学段下拉框事件
    typeChange() {
      if (this.levelForm.type == "grade_primary") {
        this.levelName("grade_primary");

      } else if (this.levelForm.type == "grade_junior") {
        this.levelName("grade_junior");

      } else if (this.levelForm.type == "grade_senior") {
        this.levelName("grade_senior");

      } else {
        this.levelName("university");
      }
    },
    // 年级名称下拉框事件
    nameChange() {
      this.levelForm.level = this.levelForm.name;
      if ((this.levelForm.level == "一年级")) {
        this.levelForm.level = 1;
      } else if ((this.levelForm.level == "二年级")) {
        this.levelForm.level = 2;
      } else if ((this.levelForm.level == "三年级")) {
        this.levelForm.level = 3;
      } else if ((this.levelForm.level == "四年级")) {
        this.levelForm.level = 4;
      } else if ((this.levelForm.level == "五年级")) {
        this.levelForm.level = 5;
      } else if ((this.levelForm.level == "六年级")) {
        this.levelForm.level = 6;
      } else if ((this.levelForm.level == "初一")) {
        this.levelForm.level = 7;
      } else if ((this.levelForm.level == "初二")) {
        this.levelForm.level = 8;
      } else if ((this.levelForm.level == "初三")) {
        this.levelForm.level = 9;
      } else if ((this.levelForm.level == "高一")) {
        this.levelForm.level = 10;
      } else if ((this.levelForm.level == "高二")) {
        this.levelForm.level = 11;
      } else if ((this.levelForm.level == "高三")) {
        this.levelForm.level = 12;
      } else if ((this.levelForm.level == "大一")) {
        this.levelForm.level = 13;
      } else if ((this.levelForm.level == "大二")) {
        this.levelForm.level = 14;
      } else if ((this.levelForm.level == "大三")) {
        this.levelForm.level = 15;
      } else {
        this.levelForm.level = 16;
      }
    },
    closeDialog() {
      this.visible = false;
			this.$refs.ruleForm.resetFields();
    },
    // 分页事件
    handleSizeChange(val) {
      this.form.pageSize = val;
      this.getGradeList(JSON.stringify(this.form));
    },
    handleCurrentChange(val) {
      this.form.pageNum = val;
      this.getGradeList(JSON.stringify(this.form));
    }
  }
};
</script>

<style>
</style》
