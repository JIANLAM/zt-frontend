<template>
    <div>
        <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="" v-if="searchButton">
                <el-input v-model="form.classNumber" clearable="" placeholder="输入分类号进行查询"></el-input>
			</el-form-item>
            <el-form-item label="">
                <span v-for="(item,index) in power" :key="index">
                    <el-button v-if="item.name.trim()=='检索'" type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                    <el-button v-if="item.name.trim()=='新增'" type="success" icon="el-icon-plus" @click="add('1')">添加</el-button>
                    <el-button  v-if="item.name.trim()=='删除'" type="warning" icon="el-icon-delete" @click="deleteData('1')" :disabled="selection.length==0">删除</el-button>
                    <el-button v-if="item.name.trim()=='导出'" type="primary" icon="el-icon-document" @click="defendExportExcel" :disabled="data.length==0">导出</el-button>
                    <el-button v-if="item.name.trim()=='导入'" type="success" icon="el-icon-upload" @click="importData">导入</el-button>
                </span>
            </el-form-item>
        </el-form>
        <div class="text item">
            <el-table ref="multipleTable" :data="data" tooltip-effect="dark" style="width: 100%" v-loading='loading' @selection-change="selectChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="index" width="55"></el-table-column>
                <el-table-column prop="classNumber" label="分类号"></el-table-column>
                <el-table-column prop="currSeednumber" label="当前种号"></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
                <el-table-column  label="操作" >
                    <template slot-scope="scope">
                        <!-- <el-button type="text" size="mini"  @click="detail(scope.row)">查看详情</el-button> -->
                        <span v-for="(item,index) in power" :key="index">
                            <el-button  v-if="item.name.trim()=='修改'" type="text" size="mini"  @click="add(scope.row)">修改</el-button>
                            <el-button  v-if="item.name.trim()=='删除'" type="text" size="mini" style="color: rgb(245, 108, 108);"  @click="deleteData(scope.row)">删除</el-button>
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
		      :page-size="form.pageSize"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="dataPage.total"
			  @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="dataPage.pageNum"
		      >
		   	 </el-pagination>
   			</el-col>
		</el-row>

        <!-- 添加 -->
        <el-dialog :visible.sync="visible" :title="DialogTitle" class="collectionParameters">
            <el-form ref="addForm" :model="addForm" label-width="100px" :rules="rules" class="clearfix">
                <el-form-item label="分类号" prop="classNumber">
                    <el-input v-model="addForm.classNumber" clearable></el-input>
                </el-form-item>
                <el-form-item label="当前种号" prop="currSeednumber" >
                    <el-input v-model="addForm.currSeednumber" clearable></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" v-model="addForm.remark" clearable></el-input>
                </el-form-item>
                <el-form-item class="addSure">
                    <el-button type="primary" @click="submitForm('addForm')">保存</el-button>
                    <el-button @click="cancel('addForm')">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>


        <!--上传-->
      <el-dialog :visible.sync="visible2" title="导入" >
        <div class="clearfix">
          <el-upload
            ref="upload"
            class="upload"
            :action="uploadUrl()"
            :on-success="handleSuccess"
            :on-error="handleError"
            drag
            method:="post"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel,.csv,text/plain"
            name="fileName"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
          <div class="downloadMoudle">
            <el-button  type="primary" @click="downImport">下载导入模板</el-button>
          </div>

        </div>
      </el-dialog>
    </div>
</template>
<script>
import { getData } from '@/methods/method'
import {defendList,defendListSave,defendListDelete,defendListMax,defendExportExcel,exportMould} from '@/request/systemSetup'
export default {
    data(){
        return {
            selection:[],
            selectionIds:[],
            loading:false,
            visible:false,
            visible2:false,
            DialogTitle:"",
            form:{
                classNumber:"",
                pageNum:1,
  				pageSize:5
            },
            data:[],
            dataPage:'',
            addForm:{

            },
            rules:{
                classNumber: [
                    { required: true, message: '请输入分类号', trigger: 'blur' }
                ],
                currSeednumber: [
                { required: true, message: '请输入当前种类号', trigger: 'blur' }
              ]
  			},
            addObj:{},
            power:[],//按钮权限数组
            searchButton:false
        }
    },
    methods:{
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
      uploadUrl(){
        var url = '/apiParameter/apiParameter/v1/defend/import';
        return url;
      },
      handleSuccess(data){
         console.log(typeof data,data)
        //上传成功要处理的事
        if(data.code==0){
          this.$message({
            type: 'success',
            message: "上传成功！",
            duration:'2000'
          });
          this.visible2=false;
          getData.call(this,defendList,JSON.stringify(this.form))
        }else{
          this.$message({
            type: 'error',
            message: "上传失败！失败原因："+data.msg,
            duration:'10000'
          });
        }
      },
      handleError(err){
        console.log(err)
        //上传失败要处理的事
        this.$message({
          type: 'error',
          message: "导入失败！失败原因："+err,
          duration:'5000'
        });

      },

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
          //分页事件
  		handleSizeChange(val) {
  			this.form.pageSize=val;
  		    getData.call(this,defendList,JSON.stringify(this.form))
		},
	    handleCurrentChange(val) {
	    	this.form.pageNum=val;
	        getData.call(this,defendList,JSON.stringify(this.form))
        },
    // 添加
        add(row){
            this.visible=true;
          this.$nextTick(()=>{
            this.$refs.addForm.clearValidate();
          });
            if(row=="1"){
                this.DialogTitle="新增"
                this.addForm={currSeednumber:1};
            }else{
                this.DialogTitle="修改"
                this.addForm={
                  "id":row.id,
                  "classNumber":row.classNumber,
                  "currSeednumber":row.currSeednumber,
                  "remark":row.remark,
                };
            }
        },
        // 提交
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    defendListSave(this.addForm).then(data=>{
                        if(data.data.code==0){
                            this.$message({
                                type: 'success',
                                message: this.DialogTitle+"成功！",
                                duration:'2000'
                            });
                            this.visible=false;
                            getData.call(this,defendList,JSON.stringify(this.form))
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
            // this.$refs[formName].resetFields();

        },
        // 删除
        deleteData(row){
            console.log(this.selectionIds)
            let content,obj;
            if(row=='1'){
                content='确定要删除这'+this.selection.length+'个种次号吗?'
                obj=this.selectionIds.join(',')
            }else{
                content='确定要删除这个种次号吗?'
                obj=row.id
            }
            this.$confirm(content, '警告', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'error'
                        }).then(() => {
                                defendListDelete(obj).then(data=>{
                                    if(data.data.code==0){
                                        this.$message({
                                            type: 'success',
                                            message: "删除成功！",
                                            duration:'2000'
                                        });
                                        getData.call(this,defendList,JSON.stringify(this.form))
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
            defendListDetail(row.id).then(data=>{
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
        //搜索
        search(){
            this.loading=true;
            getData.call(this,defendList,JSON.stringify(this.form))
        },
      //导出借购单统计
      defendExportExcel(){
        this.$confirm('是否要导出种次号维护?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj={
            classNumber:this.form.classNumber
          }
          defendExportExcel(JSON.stringify(obj)).then(data=>{
            if(data.data.code==0){
              // window.location.href=data.data.xlsurl;
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
        exportMould().then(data=>{
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
      }
    },
    created(){
        getData.call(this,defendList,JSON.stringify(this.form));
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
.upload{float: left;margin-left: 15px}
  .downloadMoudle{float: left;margin: 50px }
</style>
