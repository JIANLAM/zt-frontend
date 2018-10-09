<template>
    <div>
        <div :class="{nav:navColor,click:nav==true}"   @click="nav=true">MARC字段表</div>
        <div :class="{nav:navColor,click:nav==false}"  @click="nav=false">MARC模板</div>
      <!--MARC字段表-->
        <div v-show="nav==true">
          <el-form :inline="true" :model="form0" class="demo-form-inline">
            <el-form-item label="">
              <span v-for="(item,index) in power" :key="index">
                <el-button v-if="item.name.trim()=='新增'" type="success" icon="el-icon-plus" @click="add('1')">新增</el-button>
                <el-button v-if="item.name.trim()=='删除'" type="warning" icon="el-icon-delete" @click="deleteData('1')" :disabled="selection.length==0">删除</el-button>
                <el-button v-if="item.name.trim()=='导出'" type="danger" icon="el-icon-document" @click="marcexport" :disabled="data0.length==0">导出</el-button>
                <el-button v-if="item.name.trim()=='导入'" type="success" icon="el-icon-upload" @click="importData">导入</el-button>
              </span>
              <el-button  type="primary" @click="downImport">下载导入模板</el-button>
            </el-form-item>
          </el-form>
          <div class="text item">
            <el-table ref="multipleTable" :data="data0" tooltip-effect="dark" style="width: 100%" v-loading='loading' @selection-change="selectChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column type="index" width="55"></el-table-column>
              <el-table-column prop="description" label="字段意义"></el-table-column>
              <el-table-column prop="name" label="字段名称"></el-table-column>
              <el-table-column prop="designator" label="指示符"></el-table-column>
              <el-table-column prop="mustValues" label="必选子字段"></el-table-column>
              <el-table-column prop="selectValues" label="可选子字段"></el-table-column>
              <el-table-column  label="操作" >
                <template slot-scope="scope">
                  <!-- <el-button type="text" size="mini"  @click="detail(scope.row)">查看详情</el-button> -->
                  <span v-for="(item,index) in power" :key="index">
                    <el-button v-if="item.name.trim()=='修改'" type="text" size="mini"  @click="add(scope.row)">修改</el-button>
                    <el-button v-if="item.name.trim()=='删除'" type="text" size="mini" style="color: rgb(245, 108, 108);"  @click="deleteData(scope.row)">删除</el-button>
                  </span>
                </template>
              </el-table-column>

            </el-table>
          </div>
          <!-- 分页 -->
          <el-row>
            <el-col :span="24">
              <el-pagination
                :page-sizes="[3, 5, 10, 20]"
                :page-size="form0.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="dataPage0.total"
                @size-change="handleSizeChange0"
                @current-change="handleCurrentChange0"
                :current-page="dataPage0.pageNum"
              >
              </el-pagination>
            </el-col>
          </el-row>
        </div>
      <!--MARC模板-->
        <div v-show="nav==false">
        <el-form :inline="true" :model="form1" class="demo-form-inline">
          <el-form-item label="">
            <span v-for="(item,index) in power" :key="index">
            <el-button type="success" v-if="item.name.trim()=='新增'" icon="el-icon-plus" @click="add('1')">新增</el-button>
            <el-button type="warning" v-if="item.name.trim()=='删除'" icon="el-icon-delete" @click="deleteData('1')" :disabled="selection2.length==0">删除</el-button>
            </span>
            <!--<el-button type="danger" icon="el-icon-document" @click="marcexport" :disabled="data0.length==0">导出</el-button>-->
          </el-form-item>
        </el-form>
        <div class="text item">
          <el-table ref="multipleTable" :data="data1" tooltip-effect="dark" style="width: 100%" v-loading='loading2' @selection-change="selectChange2">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" width="55"></el-table-column>
            <el-table-column prop="value" label="模板代码"></el-table-column>
            <el-table-column prop="label" label="模板名称"></el-table-column>
            <el-table-column prop="remarks" label="备注"></el-table-column>
            <el-table-column label="设为默认">
              <template slot-scope="scope">
                <el-switch
                  v-model.number="scope.row.status"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="changEnable(scope.row)"
                  v-if="editButton">
                </el-switch>
                <el-switch
                  v-model.number="scope.row.status"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  disabled
                  v-else>
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column  label="操作" >
              <template slot-scope="scope">
                <!-- <el-button type="text" size="mini"  @click="detail(scope.row)">查看详情</el-button> -->
                <span v-for="(item,index) in power" :key="index">
                <el-button v-if="item.name.trim()=='修改'" type="text" size="mini"  @click="add(scope.row)">修改</el-button>
                <el-button v-if="item.name.trim()=='删除'" type="text" size="mini" style="color: rgb(245, 108, 108);"  @click="deleteData(scope.row)">删除</el-button>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <el-row>
          <el-col :span="24">
            <el-pagination
              :page-sizes="[3, 5, 10, 20]"
              :page-size="form1.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="dataPage1.total"
              @size-change="handleSizeChange1"
              @current-change="handleCurrentChange1"
              :current-page="dataPage1.pageNum"
            >
            </el-pagination>
          </el-col>
        </el-row>
      </div>




        <!-- 添加 字段表-->
        <el-dialog :visible.sync="visible" :title="DialogTitle" :before-close="cancel" class="collectionParameters" width="700px">
            <el-form ref="addForm1" :model="addForm" label-width="100px" :rules="rules" class="clearfix" v-show="nav==true">
                <el-form-item label="字段意义" prop="description">
                    <el-input v-model="addForm.description" ></el-input>
                </el-form-item>
                <el-form-item label="字段名称" prop="name">
                    <el-input v-model="addForm.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="指示符" prop="designator">
                  <el-input v-model="addForm.designator" clearable></el-input>
                </el-form-item>
                <el-form-item label="必选子字段" prop="mustValues">
                  <el-input v-model="addForm.mustValues" clearable placeholder="多个子字段之间以,隔开，如：a,b,c"></el-input>
                </el-form-item>
                <el-form-item label="可选子字段" prop="selectValues">
                  <el-input v-model="addForm.selectValues" clearable placeholder="多个子字段之间以,隔开，如：a,b,c"></el-input>
                </el-form-item>
                <el-form-item class="addSure">
                    <el-button type="primary" @click="submitForm('addForm1')">保存</el-button>
                    <el-button @click="cancel('addForm')">取消</el-button>
                </el-form-item>
            </el-form>

            <el-form ref="addForm2" :model="addForm" label-width="130px" :rules="rules2" class="clearfix" v-show="nav==false">
              <el-form-item label="模板代码" prop="value">
                <el-input v-model="addForm.value" ></el-input>
              </el-form-item>
              <el-form-item label="模板名称" prop="label">
                <el-input v-model="addForm.label" clearable></el-input>
              </el-form-item>
              <el-form-item label="主字段开始符" prop="mainField">
                <el-tooltip class="item" effect="dark" content="说明：输入字符的ACSII码" placement="top-start">
                  <el-input v-model="addForm.mainField" ></el-input>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="子字段开始符" prop="sonField">
                <el-tooltip class="item" effect="dark" content="说明：输入单个字符" placement="top-start">
                  <el-input v-model="addForm.sonField" clearable></el-input>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="MARC记录结束符" prop="tailed">
                <el-tooltip class="item" effect="dark" content="说明：输入单个字符" placement="top-start">
                  <el-input  v-model="addForm.tailed" clearable></el-input>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="备注" prop="remarks">
                <el-input type="textarea"  v-model="addForm.remarks" clearable></el-input>
              </el-form-item>
              <el-form-item label="" prop="marcData">
                <el-input type="textarea"  v-model="addForm.marcData" clearable></el-input>
              </el-form-item>
              <el-form-item class="addSure">
                <el-button type="primary" @click="submitForm('addForm2')">保存</el-button>
                <el-button @click="cancel('addForm2')">取消</el-button>
              </el-form-item>
            </el-form>
        </el-dialog>
      <!--上传-->
      <el-dialog :visible.sync="visible2" title="导入" width="600px">
        <div class="clearfix">
          <el-upload
            ref="upload"
            class="upload"
            drag
            method:="post"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel,.csv,text/plain"
            name="fileName"
            :http-request="successUpload"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>


        </div>
      </el-dialog>
    </div>
</template>
<script>
import axios  from '@/axios/request'
import {marcList,marcSave,marcDelete,exportMarc,marcDetail,marcFindMouldList,marcSaveMould,marcDeleteMould,marcDetailMould,exportMarcMould,exportMould2,marcOpen,marcClose,importMould} from '@/request/systemSetup'
export default {
    data(){
        return {
            loading2:false,
            nav:true,
            navColor:true,
            selection:[],
            selectionIds:[],
            selection2:[],
            selectionIds2:[],
            loading:false,
            visible:false,
            visible2:false,
            DialogTitle:"",
            form0:{
                pageNum:1,
  				      pageSize:5
            },
            form1:{
                pageNum:1,
                pageSize:5
            },
            data0:[],
            data1:[],
            detailData:[],
            dataPage0:'',
            dataPage1:'',
            addForm:{
            },
            rules:{
  			    description: [
                    { required: true, message: '请输入字段意义', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入字段名称', trigger: 'blur' }
                ]
  			},
          rules2:{
            value: [
              { required: true, message: '请输入模板代码', trigger: 'blur' }
            ]
          },
          power:[],//按钮权限数组
          editButton:false
        }
    },
    methods:{
      //得到权限按钮数组
      getPowerArr(){
        let  obj;
        let  power =this.$route.meta.power;
        for(let i=0,len=power.length;i<len;i++){
          if(power[i].name=='新增'){
            obj=power[0];
            power[0]=power[i];
            power[i]=obj
          }
          if(power[i].name=='修改'){
             this.editButton=true
          }
        }
        this.power=power;
      },
      //上次成功事件和图片上传
      successUpload(response){
        let formData = new FormData()
        formData.append('fileName', response.file)
        importMould(formData).then(res=>{
          if(res.data.code==0){
            this.$message({
              type: 'success',
              message: '上传成功!'
            });
            this.visible2=false;
            this.getMarcList();
          }else{
            this.$message({
              type: 'error',
              message: res.data.msg
            });
          }
        })
      },
      // 初始化数据
        getMarcList(){
          this.loading=true;
          marcList(this.form0).then(data=>{
            if(data.data.code==0){
              this.loading=false;
              this.data0=data.data.page.list;
              this.dataPage0=data.data.page
            }else{
              this.$message({
                type: 'error',
                message: "MARC字段表数据失败！失败原因："+data.data.msg,
                duration:'2000'
              });
            }
          }).catch(err=>{
            this.$message({
              type: 'info',
              message: 'MARC字段表数据失败，失败原因：'+err.data.msg
            });
          })
        },
        getMarcFindMouldList(){
          this.loading2=true;
          marcFindMouldList(this.form1).then(data=>{
            if(data.data.code==0){
              this.loading2=false;
              this.data1=data.data.page.list;
              for(let i=0,length=this.data1.length;i<length;i++){
                if(this.data1[i].status==1){
                  this.data1[i].status=true
                }else{
                  this.data1[i].status=false
                }
              }
              this.dataPage1=data.data.page
            }else{
              this.$message({
                type: 'error',
                message: "MARC模板数据失败！失败原因："+data.data.msg,
                duration:'2000'
              });
            }
          }).catch(err=>{
            this.$message({
              type: 'info',
              message: 'MARC模板数据失败，失败原因：'+err.data.msg
            });
          })
        } ,
        // 复选框
        selectChange(selection){
  			if(selection.length&&selection.length>0){
                this.selection=selection;
                this.selectionIds=[]
                for(let i=0,length=selection.length;i<length;i++){
                    this.selectionIds.push(selection[i].id)
                }
  			}else{
                this.selection='';
                this.selectionIds=[]
  			}

        },
      selectChange2(selection){
        if(selection.length&&selection.length>0){
          this.selection2=selection;
          this.selectionIds2=[]
          for(let i=0,length=selection.length;i<length;i++){
            this.selectionIds2.push(selection[i].id)
          }
        }else{
          this.selection2='';
          this.selectionIds2=[]
        }

      },
          //分页事件
  		handleSizeChange0(val) {
  			this.form0.pageSize=val;
        this.getMarcList();
		},
	    handleCurrentChange0(val) {
	    	this.form0.pageNum=val;
        this.getMarcList();
        },
      handleSizeChange1(val) {
        this.form1.pageSize=val;
        this.getMarcFindMouldList();
      },
      handleCurrentChange1(val) {
        this.form1.pageNum=val;
        this.getMarcFindMouldList();
      },
    // 添加
        add(row){
          this.visible=true;
          if(this.nav){
            this.$nextTick(()=>{
              this.$refs.addForm1.clearValidate();
            });
          }else {
            this.$nextTick(()=>{
              this.$refs.addForm2.clearValidate();
            });
          }
            if(row=="1"){
                this.DialogTitle="新增";
                this.addForm={};
            }else{
                this.DialogTitle="修改";
                if(this.nav){
                  this.addForm={
                    id: row.id,
                    description: row.description,
                    name:row.name,
                    designator: row.designator,
                    remarks: row.remarks
                  };
                }else {
                  this.addForm={
                    id: row.id,
                    value: row.value,
                    label: row.label,
                    mainField: row.mainField,
                    sonField: row.sonField,
                    tailed: row.tailed,
                    marcData: row.marcData,
                    remarks: row.remarks
                  };
                }

            }
        },
        // 提交
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                     axios.post('/apiParameter/apiParameter/v1/marc/'+(this.nav?'save':"saveMould"),this.addForm).then(data=>{
                        if(data.data.code==0){
                            this.$message({
                                type: 'success',
                                message: this.DialogTitle+"成功！",
                                duration:'2000'
                            });
                            this.visible=false;
                            if(this.nav) {
                              this.getMarcList();
                            }else {
                              this.getMarcFindMouldList()
                            }
                        }else{
                            this.$message({
                            type: 'error',
                            message: this.DialogTitle+"失败！失败原因："+data.data.msg,
                            duration:'2000'
                        });
                    }
                    }).catch(err=>{
                        this.$message({
                            type: 'info',
                            message: this.DialogTitle+'失败，失败原因：'+err.data.msg
                        });
        })
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        // 取消
        cancel(formName){
            this.visible=false;
        },
        // 删除
        deleteData(row){
            let content,obj;
            if(row=='1'){
                if(this.nav){
                  content='确定要删除这'+this.selection.length+'个marc字段表吗?'
                  obj=this.selectionIds.join(',')
                } else {
                  content='确定要删除这'+this.selection2.length+'个marc模板吗?'
                  obj=this.selectionIds2.join(',')
                }
            }else{
              if(this.nav) {
                content = '确定要删除这个marc字段表吗?'
              }else {
                content = '确定要删除这个marc模板吗?'
              }
              obj = row.id
            }
            this.$confirm(content, '警告', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'error'
                        }).then(() => {
                        axios.post('/apiParameter/apiParameter/v1/marc/'+(this.nav?'delete/':"deleteMould/")+obj).then(data=>{
                                    if(data.data.code==0){
                                        this.$message({
                                            type: 'success',
                                            message: "删除成功！",
                                            duration:'2000'
                                        });
                                        if(this.nav) {
                                            this.getMarcList();
                                        }else {
                                            this.getMarcFindMouldList()
                                        }
                                    }else{
                                        this.$message({
                                            type: 'error',
                                            message: "删除失败！失败原因："+data.data.msg,
                                            duration:'2000'
                                        });
                                    }

                                }).catch(err=>{
                                    this.$message({
                                        type: 'info',
                                        message: '删除失败，失败原因：'+err.data.msg
                                    });
                            })
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消删除!'
                            });
					});

        },
        detail(row){
            marcDetail(row.id).then(data=>{
                if(data.data.code==0){

                }else{
                    this.$message({
                        type: 'error',
                        message: "查看详情失败！失败原因："+data.data.msg,
                        duration:'2000'
                    });
                }
            }).catch(err=>{
                this.$message({
                    type: 'info',
                    message: '查看详情失败，失败原因：'+err.data.msg
                });
        })
        },
          //导出多条marc
      marcexport(){
        this.$confirm('是否要导出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          exportMarc().then(data=>{
            if(data.data.code==0){
              window.open(data.data.xlsurl)
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
      importData(){
        this.visible2=true
      },
      downImport(){
        exportMould2().then(data=>{
          if(data.data.code==0){
            window.open(data.data.xlsurl)
          }
          this.$message({
            type: 'success',
            message: '模板下载成功!正在下载，请稍后..',
            duration:'6000'
          });
        }).catch(err=>{
          this.$message({
            type: 'info',
            message: '模板下载失败!'
          });
        })
      },
      changEnable(row){
        console.log(row)
        if(row.status){
          marcOpen(row.id).then(data=>{
            if(data.data.code==0){
              this.$message({
                message: '设置默认状态成功!',
                type: 'success'
              });
            }else{
              this.$message({
                message: data.data.msg,
                type: 'error'
              });
            }
          })
        }else{
          marcClose(row.id).then(data=>{
            if(data.data.code==0){
              this.$message({
                message: '取消默认状态成功!',
                type: 'success'
              });
            }else{
              this.$message({
                message: data.data.msg,
                type: 'error'
              });
            }
          })
        }



      },
    },
    created(){
        this.getMarcList();
        this.getMarcFindMouldList();
        this.getPowerArr();
    }
}
</script>
<style scoped>
.clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .nav{display: inline-block;margin:0 10px 30px 0;cursor:pointer;height: 26px;line-height: 26px;font-size: 18px}
  .click{border-bottom: 1px solid #4c4c4c;color: red}
.upload{margin: 0 auto;width: 360px}

</style>
