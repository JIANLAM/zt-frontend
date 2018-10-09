<template>
    <div>
        <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="">
                <span v-for="(item,index) in power" :key="index">
                    <el-button v-if="item.name.trim()=='新增'" type="success" icon="el-icon-plus" @click="add('1')">添加</el-button>
                    <el-button v-if="item.name.trim()=='删除'" type="warning" icon="el-icon-delete" @click="deleteData('1')" :disabled="selection.length==0">删除</el-button>
                </span>
            </el-form-item>
        </el-form>
        <div class="text item">
            <el-table ref="multipleTable" :data="data" tooltip-effect="dark" style="width: 100%" v-loading='loading' @selection-change="selectChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="index" width="55"></el-table-column>
                <el-table-column prop="barcodeNumber" label="条码区号"></el-table-column>
                <el-table-column prop="barcodeName" label="条码区名称"></el-table-column>
                <el-table-column prop="prefix" label="条码前缀"></el-table-column>
                <el-table-column prop="totalBit" label="条码总位数"></el-table-column>
                <el-table-column prop="startBarcode" label="起止条码号"></el-table-column>
                <el-table-column prop="stopBarcode" label="终止条码号"></el-table-column>
                <el-table-column prop="currBarcode" label="当前条码号"></el-table-column>
                <el-table-column prop="currUser" label="分区使用者">
                   <template slot-scope="scope">
                     <span v-if="scope.row.loginName">{{scope.row.loginName+"|"}}{{scope.row.username}}</span>
                   </template>
                </el-table-column>
                <el-table-column prop="characterset" label="备注"></el-table-column>
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
        <el-dialog :visible.sync="visible" :title="DialogTitle" class="collectionParameters" width="700px">
            <el-form ref="addForm" :model="addForm" label-width="100px" :rules="rules" class="clearfix">
                <el-form-item label="条码区号" prop="barcodeNumber">
                    <el-input v-model="addForm.barcodeNumber" readonly=""></el-input>
                </el-form-item>
                <el-form-item label="条码区名称" prop="barcodeName">
                    <el-input v-model="addForm.barcodeName" clearable></el-input>
                </el-form-item>
                <el-form-item label="条码区前缀" prop="prefix">
                    <el-input v-model="addForm.prefix" clearable></el-input>
                </el-form-item>
                <el-form-item label="条码总位数" prop="totalBit">
                    <el-input v-model="addForm.totalBit" clearable placeholder="请输入小于20的数字"></el-input>
                </el-form-item>
                <el-form-item label="起止条码号" prop="startBarcode">
                    <el-input v-model="addForm.startBarcode" clearable></el-input>
                </el-form-item>
                <el-form-item label="终止条码号" prop="stopBarcode">
                    <el-input v-model="addForm.stopBarcode" clearable></el-input>
                </el-form-item>
                <el-form-item label="当前条码号" prop="startBarcode">
                    <el-input v-model="addForm.startBarcode" disabled></el-input>
                </el-form-item>
                <el-form-item label="分区使用者" prop="currUser">
                  <el-select v-model="addForm['currUser']"  placeholder="请选择" :style="{width:'140px'}">
                    <el-option :label="item.label" :value="item.value" v-for="item in cuurLibraryUser" :key="item.value"></el-option>
                  </el-select>
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
    </div>
</template>
<script>
import { getData } from '@/methods/method'
import {partitionList,partitionListSave,partitionListDelete,partitionListMax,cuurLibraryUser} from '@/request/systemSetup'
import Template from "../../interviewManage/order/template";
export default {
  components: {Template},
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
    var checkNumber = (rule, value, callback) => {
      let str = /^[0-9a-zA-Z]+$/;
      if (!str.test(value)) {
        callback(new Error("条码区前缀只能为数字和英文"));
      } else {
        callback();
      }
    };
    var checkNumber1 = (rule, value, callback) => {
      let str = /^[0-9]+$/;
      if (!str.test(value)) {
        callback(new Error("请输入数字"));
      } else {
        callback();
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
            cuurLibraryUser:[],
            rules:{

  			    barcodeName: [
                    { required: true, message: '请输入条码区名称', trigger: 'blur' }
                ],
                totalBit: [
                    { required: true, message: '请输入条码总位数', trigger: 'blur' },
                  { validator: checkNumber1, trigger: "blur" }
                ],
                startBarcode: [
                    { required: true, message: '请输入起止条码号', trigger: 'blur' },
                  { validator: checkNumber1, trigger: "blur" }
                ],
                stopBarcode: [
                    { required: true, message: '请输入终止条码号', trigger: 'blur' },
                  { validator: checkNumber1, trigger: "blur" }
                ],
                currUser: [
                    { required: true, message: '请选择分区使用者', trigger: 'blur' }
                ],
                prefix: [
                  { required: true, message: '请输入条码枪前缀', trigger: 'blur' },
                  { validator: checkNumber, trigger: "blur" }
                ]
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
  		    getData.call(this,partitionList,JSON.stringify(this.form))
		},
	    handleCurrentChange(val) {
	    	this.form.pageNum=val;
	        getData.call(this,partitionList,JSON.stringify(this.form))
        },
    // 添加
        add(row){

            if(row=="1"){
                this.DialogTitle="新增";
                this.addForm={}
                this.$set(this.addForm,'currUser',this.cuurLibraryUser[0].value)
                partitionListMax().then(data=>{
                    if(data.data.code==0){
                        this.$set(this.addForm,"barcodeNumber",data.data.maxBarcodeNumber);
                        this.visible=true;
                      this.$nextTick(()=>{
                        this.$refs.addForm.clearValidate();
                      });
                    }
                })
            }else{
                this.DialogTitle="修改";
                this.addForm={
                  id: row.id,
                  barcodeNumber:row.barcodeNumber,
                  barcodeName: row.barcodeName,
                  prefix: row.prefix,
                  totalBit: row.totalBit,
                  startBarcode: row.startBarcode,
                  stopBarcode: row.stopBarcode,
                  currBarcode: row.currBarcode,
                  currUser:row.currUser,
                  remark: row.remark
                };
                this.visible=true;
              this.$nextTick(()=>{
                this.$refs.addForm.clearValidate();
              });
            }
        },
        // 提交
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                  if(Number(this.addForm.totalBit)>20){
                    this.$message({
                      type: 'error',
                      message: "总位数不能大于20，请重新输入",
                      duration:'5000'
                    });
                    return
                  }
                    if(this.addForm.startBarcode.toString().length>Number(this.addForm.totalBit)){
                        this.$message({
                            type: 'error',
                            message: "起始条码号总位数不能大于设置的总位数",
                            duration:'5000'
                        });
                        return
                    }
                    if(this.addForm.stopBarcode.toString().length>Number(this.addForm.totalBit)){
                        this.$message({
                            type: 'error',
                            message: "终止条码号总位数不能大于设置的总位数",
                            duration:'5000'
                        });
                        return
                    }
                    if(Number(this.addForm.stopBarcode)<Number(this.addForm.startBarcode)){
                      this.$message({
                        type: 'error',
                        message: "终止条码号要大于起始条码号",
                        duration:'5000'
                      });
                      return
                    }
                    this.addForm.currBarcode=this.addForm.startBarcode;
                    partitionListSave(this.addForm).then(data=>{
                        if(data.data.code==0){
                            this.$message({
                                type: 'success',
                                message: this.DialogTitle+"成功！",
                                duration:'2000'
                            });
                            this.visible=false;
                            this.$refs[formName].resetFields();
                            getData.call(this,partitionList,JSON.stringify(this.form))
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
                content='确定要删除这'+this.selection.length+'个条码分区参数吗?'
                obj=this.selectionIds.join(',')
            }else{
                content='确定要删除这个条码分区参数吗?'
                obj=row.id
            }
            this.$confirm(content, '警告', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'error'
                        }).then(() => {
                                partitionListDelete(obj).then(data=>{
                                    if(data.data.code==0){
                                        this.$message({
                                            type: 'success',
                                            message: "删除成功！",
                                            duration:'2000'
                                        });
                                        getData.call(this,partitionList,JSON.stringify(this.form))
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
            partitionListDetail(row.id).then(data=>{
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
      this.getPowerArr();
        getData.call(this,partitionList,JSON.stringify(this.form));
      cuurLibraryUser().then(data=>{
        if(data.data.code==0){
          this.cuurLibraryUser=[];
          let list=data.data.cuurLibraryUserMap;
          for(let i=0,length=list.length;i<length;i++){
            this.cuurLibraryUser.push({label:list[i].login_name+"|"+list[i].username,value:list[i].id})
          }
          this.addForm.currUser=this.cuurLibraryUser[0].value

        }
      });
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
