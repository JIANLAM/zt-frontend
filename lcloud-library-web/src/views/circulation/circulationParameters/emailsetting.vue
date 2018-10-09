<template>
    <div>
        <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="">
                <span v-for="(item,index) in power" :key="index">
                    <el-button v-if="item.name.trim()=='新增'" type="success" icon="el-icon-plus" @click="add('1')">添加</el-button>
                    <el-button  v-if="item.name.trim()=='删除'" type="warning" icon="el-icon-delete" @click="deleteData('1')" :disabled="selection.length==0">删除</el-button>
                      </span>
            </el-form-item>
        </el-form>
        <div class="text item">
            <el-table ref="multipleTable" :data="data" tooltip-effect="dark" style="width: 100%" v-loading='loading' @selection-change="selectChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="index" width="55"></el-table-column>
                <el-table-column prop="address" label="发件地址"></el-table-column>
                <el-table-column prop="smtpServer" label="SMTP服务器"></el-table-column>
                <el-table-column prop="licenseKey" label="授权码"></el-table-column>
                <el-table-column  label="操作" >
                    <template slot-scope="scope">
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
        <el-dialog :visible.sync="visible" :title="DialogTitle">
            <el-form ref="addForm" :model="addForm" label-width="120px" :rules="rules" class="clearfix">
                <el-form-item label="发件地址" prop="address">
                    <el-input v-model="addForm.address" clearable></el-input>
                </el-form-item>
                <el-form-item label="授权码" prop="licenseKey" >
                    <el-input v-model="addForm.licenseKey" clearable></el-input>
                </el-form-item>
                <el-form-item label="STMP服务器" prop="smtpServer">
                    <el-input type="textarea" v-model="addForm.smtpServer" clearable></el-input>
                </el-form-item>
                <el-form-item style="float:right;margin-top:15px">
                    <el-button @click="textButton('addForm')">验证</el-button>
                    <el-button type="primary" @click="submitForm('addForm')">确定</el-button>
                    <el-button @click="cancel('addForm')">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

    </div>
</template>
<script>
import { getData } from '@/methods/method'
import {mailboxList,mailboxListSave,mailboxListDelete,testSmtp} from '@/request/systemSetup'
export default {
    data(){
      var email = (rule, value, callback) => {
        var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
          if(!myreg.test(value)){
            callback(new Error("发件地址格式不对！"));
          }else {
            callback();
          }
      };
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
              address: [
                    { required: true, message: '请输入发件地址', trigger: 'blur' },
                    { validator: email, trigger: 'blur' }

                ],
              licenseKey : [
                { required: true, message: '请输入授权码', trigger: 'blur' }
              ],
              smtpServer: [
               { required: true, message: '请输入SMTP服务器', trigger: 'blur' }
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
  		    getData.call(this,mailboxList,JSON.stringify(this.form))
		},
	    handleCurrentChange(val) {
	    	this.form.pageNum=val;
	        getData.call(this,mailboxList,JSON.stringify(this.form))
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
                this.DialogTitle="修改";
                this.addForm={
                  id:row.id,
                  address:row.address,
                  licenseKey:row.licenseKey,
                  smtpServer:row.smtpServer,
                }
            }
        },
       //验证
      textButton(formName){
        this.$refs[formName].validate((valid) => {
            if (valid) {
        testSmtp(this.addForm.address,this.addForm.licenseKey,this.addForm.smtpServer).then(data=>{
          if(data.data.code==0){
            this.$message({
              type: 'success',
              message: "验证成功！",
              duration:'2000'
            });
          }else{
            this.$message({
              type: 'error',
              message: "验证失败！失败原因："+data.data.msg,
              duration:'2000'
            });
          }
        }).catch(err=>{
          this.$message({
            type: 'info',
            message:  "验证失败，失败原因："+err.data.msg
          });
        }) } else {
              console.log('error submit!!');
              return false;
            }
        });
      },
        // 提交
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    mailboxListSave(this.addForm).then(data=>{
                        if(data.data.code==0){
                            this.$message({
                                type: 'success',
                                message: this.DialogTitle+"成功！",
                                duration:'2000'
                            });
                            this.visible=false;
                            getData.call(this,mailboxList,JSON.stringify(this.form))
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
                content='确定要删除这'+this.selection.length+'个发件邮箱设置吗?'
                obj=this.selectionIds.join(',')
            }else{
                content='确定要删除这个发件邮箱设置吗?'
                obj=row.id
            }
            this.$confirm(content, '警告', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'error'
                        }).then(() => {
                                mailboxListDelete(obj).then(data=>{
                                    if(data.data.code==0){
                                        this.$message({
                                            type: 'success',
                                            message: "删除成功！",
                                            duration:'2000'
                                        });
                                        getData.call(this,mailboxList,JSON.stringify(this.form))
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
        //搜索
        search(){
            this.loading=true;
            getData.call(this,mailboxList,JSON.stringify(this.form))
        },
    },
    created(){
        getData.call(this,mailboxList,JSON.stringify(this.form));
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
