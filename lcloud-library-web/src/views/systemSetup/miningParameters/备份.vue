<template>
    <div>
        <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="">
				 <el-input placeholder="请输入内容" v-model="form.searchValue" class="input-with-select" clearable>
				    <el-select v-model="form.searchKey" slot="prepend" placeholder="请选择" :style="{width:'140px'}">
                        <el-option label="联系人" value="userName"></el-option>
                        <el-option label="供应商名称" value="readCardNumber"></el-option>
                        <el-option label="供应商代码" value="readCardNumber"></el-option>
				    </el-select>	  
				  </el-input>
			</el-form-item>	
            <el-form-item label="">
			    <el-button type="primary" icon="el-icon-search" @click="search">检索</el-button>
                <el-button type="success" icon="el-icon-plus" @click="add">添加</el-button>
                <el-button type="warning" icon="el-icon-delete" @click="deleteData" :disabled="selection.length==0">删除</el-button>
			</el-form-item>
        </el-form>
        <div class="text item">
            <el-table ref="multipleTable" :data="data" tooltip-effect="dark" style="width: 100%" v-loading='loading' @selection-change="selectChange">
                <el-table-column type="selection" width="55"  label="供应商代码"></el-table-column>
                <el-table-column type="index" width="55"></el-table-column>
                <el-table-column prop="code" label="供应商代码"></el-table-column>
                <el-table-column prop="name" label="供应商名称"></el-table-column>
                <el-table-column prop="marke" label="地址"></el-table-column>
                <el-table-column prop="code" label="联系人"></el-table-column>
                <el-table-column prop="name" label="电话"></el-table-column>
                <el-table-column prop="marke" label="邮箱"></el-table-column>
                <el-table-column prop="name" label="传真"></el-table-column>
                <el-table-column prop="name" label="邮编"></el-table-column>
                <el-table-column prop="marke" label="备注"></el-table-column>
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
            <el-form ref="addForm" :model="addForm" label-width="100px" :rules="rules" class="clearfix">
                <el-form-item label="供应商代码" prop="code">
                    <el-input v-model="addForm.code" clearable></el-input>
                </el-form-item>
                <el-form-item label="供应商名称" prop="name">
                    <el-input v-model="addForm.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="code">
                    <el-input v-model="addForm.code" clearable></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="name">
                    <el-input v-model="addForm.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input v-model="addForm.phone" clearable></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email" clearable></el-input>
                </el-form-item>
                <el-form-item label="传真" prop="name">
                    <el-input v-model="addForm.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" v-model="addForm.remark" clearable></el-input>
                </el-form-item>
                <el-form-item style="float:right;margin-top:15px">
                    <el-button type="primary" @click="submitForm('addForm')">确认</el-button>
                    <el-button @click="cancel('addForm')">取消</el-button>
                </el-form-item>
            </el-form>    
        </el-dialog>
    </div>    
</template>
<script>
import { getData } from '@/methods/method'
import {vendorSetting,addVendor,deteleVendor} from '@/request/systemSetup'
export default {
    data(){
        var validatePass= (rule, value, callback) => {
  			if (value === '') {
          		callback();
        	}else{
        		if(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(value)==false){
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
            DialogTitle:"添加",
            form:{
                searchValue:"",
                searchKey:"",
                pageNum:1,
  				pageSize:5
            },
            data:[],
            dataPage:'',
            addForm:{
                phone:"",
                email:'',
            },
            rules:{
  			    phone:[
                    {trigger: 'blur',validator:validatePass}
                ],
                email:[
                    {trigger: 'blur',validator:validatePass2 }
                ],
  			}
            

        }
    },
    methods:{
        // 复选框
        selectChange(selection){
  			if(selection.length&&selection.length>0){
                this.selection=selection;
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
  		    getData.call(this,vendorSetting,JSON.stringify(this.form))
		},
	    handleCurrentChange(val) {
	    	this.form.pageNum=val;
	        getData.call(this,vendorSetting,JSON.stringify(this.form))
        },
        search(){
            vendorSetting(JSON.stringify(this.form)).then(data=>{
                if(data.data.code==0){
                    this.$message({
                    type: 'success',
                    message: '搜索成功！',
                    duration:'3000'
                    });
                }else{
                    this.$message({
                    type: 'error',
                    message: '搜索失败！'+'失败原因：'+data.data.msg,
                    duration:'3000'
                    });
                }

            }).catch(err=>{
                this.$message({
                    type: 'error',
                    message: '搜索失败！'+'失败原因：'+err.data.msg,
                    duration:'3000'
                    });
            })
        },
    // 添加
        add(){
            this.visible=true
        },
        // 提交
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    addVendor(this.addForm).then(data=>{
                        if(data.data.code==0){
                            this.$message({
                                type: 'success',
                                message: "新增成功！",
                                duration:'2000'
                            });
                            this.visible=true;
                            this.$refs[formName].resetFields();
                            getData.call(this,vendorSetting,JSON.stringify(this.form))
                        }else{
                            this.$message({
                            type: 'error',
                            message: "新增失败！失败原因："+data.data.msg,
                            duration:'2000'
                        });
                    }
                    }).catch(err=>{
                        this.$message({
                            type: 'info',
                            message: '新增失败，失败原因：'+err.data.msg
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
            this.$refs[formName].resetFields();
        },    
        // 删除
        deleteData(){
            this.$confirm('确认要删除这'+this.selection.length+'个供应商吗?', '警告', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'error'
                        }).then(() => {
                                let obj={ids:this.selectionIds.join(',')}
                                deteleVendor(obj).then(data=>{
                                    if(data.data.code==0){
                                        this.$message({
                                            type: 'success',
                                            message: "删除成功！",
                                            duration:'2000'
                                        });
                                        getData.call(this,vendorSetting,JSON.stringify(this.form))
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
           
        }
    },
    created(){
        getData.call(this,vendorSetting,JSON.stringify(this.form))
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
