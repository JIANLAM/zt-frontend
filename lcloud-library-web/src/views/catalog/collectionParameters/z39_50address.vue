<template>
    <div>
        <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="">
                <span v-for="(item,index) in power" :key="index">
                    <el-button  v-if="item.name.trim()=='新增'" type="success" icon="el-icon-plus" @click="add('1')">添加</el-button>
                    <el-button  v-if="item.name.trim()=='删除'" type="warning" icon="el-icon-delete" @click="deleteData('1')" :disabled="selection.length==0">删除</el-button>
                </span>
			</el-form-item>
        </el-form>
        <div class="text item">
            <el-table ref="multipleTable" :data="data" tooltip-effect="dark" style="width: 100%" v-loading='loading' @selection-change="selectChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="index" width="55"></el-table-column>
                <el-table-column prop="libName" label="馆名称"></el-table-column>
                <el-table-column prop="ipAddress" label="IP地址"></el-table-column>
                <el-table-column prop="portNumbers" label="端口号"></el-table-column>
                <el-table-column prop="databaseName" label="数据库名"></el-table-column>
                <el-table-column prop="userName" label="用户名"></el-table-column>
                <el-table-column prop="password" label="密码"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
                <el-table-column prop="characterset" label="字符集"></el-table-column>
                <el-table-column  label="操作" >
                    <template slot-scope="scope">
                        <!-- <el-button type="text" size="mini"  @click="detail(scope.row)">查看详情</el-button> -->
                        <span v-for="(item,index) in power" :key="index">
                            <el-button v-if="item.name.trim()=='修改'" type="text" size="mini"  @click="add(scope.row)">修改</el-button>
                            <el-button v-if="item.name.trim()=='删除'" style="color:red" type="text" size="mini"  @click="deleteData(scope.row)">删除</el-button>
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
        <el-dialog :visible.sync="visible" :title="DialogTitle" :before-close="cancel" class="collectionParameters" width="700px">
            <el-form ref="addForm" :model="addForm" label-width="100px" :rules="rules" class="clearfix">
                <el-form-item label="馆名称" prop="libName">
                    <el-input v-model="addForm.libName" clearable></el-input>
                </el-form-item>
                <el-form-item label="IP地址" prop="ipAddress">
                    <el-input v-model="addForm.ipAddress" clearable></el-input>
                </el-form-item>
                <el-form-item label="端口号" prop="portNumbers">
                    <el-input v-model="addForm.portNumbers" clearable></el-input>
                </el-form-item>
                <el-form-item label="数据库名" prop="databaseName">
                    <el-input v-model="addForm.databaseName" clearable></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="addForm.userName" clearable></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password" clearable></el-input>
                </el-form-item>
                <el-form-item label="字符集" prop="characterset">
                    <el-select v-model="addForm.characterset"  placeholder="请选择" :style="{width:'140px'}">
                        <el-option label="UTF-8" value="UTF-8"></el-option>
                        <el-option label="GBK" value="GBK"></el-option>
				    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" v-model="addForm.remark" clearable></el-input>
                </el-form-item>
                <el-form-item class="addSure">
                    <el-button type="primary" @click="submitForm('addForm')">确认</el-button>
                    <el-button @click="cancel('addForm')">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import { getData } from '@/methods/method'
import {addressSetting,addressSettingSave,addressSettingDelete,addressSettingDetail} from '@/request/systemSetup'
export default {
    data(){
        var validatePass= (rule, value, callback) => {
  			if (value === '') {
          		callback();
        	}else{
        		if(/^1[34578]\d{9}$/.test(value)==false){
        			callback(new Error('请输入正确格式的手机号码!'));
        		}else{
        			 callback();
        		}
        	}
  		};
  		var validatePass2= (rule, value, callback) => {
  			if (value === '') {
          		callback();
        	}else{
        		if(/^[0-9][0-9]{5}$/.test(value)==false){
        			callback(new Error('请输入正确格式的邮政编码!'));
        		}else{
        			 callback();
        		}
        	}
      };
        return {
            selection:[],
            selectionIds:[],
            loading:false,
            visible:false,
            DialogTitle:"",
            form:{
                searchValue:"",
                searchKey:"",
                pageNum:1,
  				pageSize:5
            },
            data:[],
            dataPage:'',
            addForm:{

            },
            rules:{
                libName: [
                    { required: true, message: '请输入馆名称', trigger: 'blur' }
                ],
  			    ipAddress: [
                    { required: true, message: '请输入IP地址', trigger: 'blur' }
                ],
                databaseName: [
                    { required: true, message: '请输入数据库名', trigger: 'blur' }
                ],
                userName: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
  			},
             power:[],//按钮权限数组


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
  		    getData.call(this,addressSetting,JSON.stringify(this.form))
		},
	    handleCurrentChange(val) {
	    	this.form.pageNum=val;
	        getData.call(this,addressSetting,JSON.stringify(this.form))
        },
    // 添加
        add(row){
            this.visible=true;
          this.$nextTick(()=>{
            this.$refs.addForm.clearValidate();
          });
            if(row=="1"){
                this.DialogTitle="新增"
                this.addForm={}
            }else{
                this.DialogTitle="修改";
                this.addForm={
                  id:row.id,
                  libName:row.libName,
                  ipAddress :row.ipAddress,
                  portNumbers:row.portNumbers,
                  databaseName:row.databaseName,
                  userName :row.userName,
                  password :row.password,
                  characterset:row.characterset,
                  remark:row.remark
                }
            }
        },
        // 提交
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    addressSettingSave(this.addForm).then(data=>{
                        if(data.data.code==0){
                            this.$message({
                                type: 'success',
                                message: this.DialogTitle+"成功！",
                                duration:'2000'
                            });
                            this.visible=false;
                            this.$refs[formName].resetFields();
                            getData.call(this,addressSetting,JSON.stringify(this.form))
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
            console.log(this.selectionIds)
            let content,obj;
            if(row=='1'){
                content='确定要删除这'+this.selection.length+'个地址设置吗?'
                obj=this.selectionIds.join(',')
            }else{
                content='确定要删除这个地址设置吗?'
                obj=row.id
            }
            this.$confirm(content, '警告', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'error'
                        }).then(() => {
                                addressSettingDelete(obj).then(data=>{
                                    if(data.data.code==0){
                                        this.$message({
                                            type: 'success',
                                            message: "删除成功！",
                                            duration:'2000'
                                        });
                                        getData.call(this,addressSetting,JSON.stringify(this.form))
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
            addressSettingDetail(row.id).then(data=>{
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
        }
    },
    created(){
        getData.call(this,addressSetting,JSON.stringify(this.form));
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

</style>
