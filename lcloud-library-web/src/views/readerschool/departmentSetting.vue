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
                <el-table-column type="index" width="55" label="序号"></el-table-column>
                <el-table-column prop="value" label="证类型代码"></el-table-column>
                <el-table-column prop="label" label="证类型名称"></el-table-column>
                <el-table-column  prop="museumRuleTest" label="馆内借阅规则">
                   <!--<template  slot-scope="scope">-->
                       <!--<el-select v-model="data[scope.$index].museumRule"  placeholder="请选择" :style="{width:'140px'}">-->
                         <!--<el-option :label="item.ruleName" :value="item.id" v-for="item in museumRulelist" :key="item.id"></el-option>-->
                       <!--</el-select>-->
                   <!--</template>-->
                </el-table-column>
                <el-table-column prop="interlibraryRuleTest" label="馆际借阅规则">
                  <!--<template  slot-scope="scope">-->
                    <!--<el-select v-model="data[scope.$index].interlibraryRule"  placeholder="请选择" :style="{width:'140px'}">-->
                      <!--<el-option :label="item.ruleName" :value="item.id" v-for="item in interlibraryRulelist" :key="item.id"></el-option>-->
                    <!--</el-select>-->
                  <!--</template>-->
                </el-table-column>

                <el-table-column prop="remarks" label="备注"></el-table-column>
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
        <el-dialog :visible.sync="visible" :title="DialogTitle" :before-close='closeDialog' >
            <el-form ref="addForm" :model="addForm" label-width="130px" :rules="rules" class="clearfix">
                <el-form-item label="证类型代码" prop="value">
                    <el-input v-model="addForm.value" clearable></el-input>
                </el-form-item>
                <el-form-item label="证类型名称" prop="label">
                    <el-input v-model="addForm.label" clearable></el-input>
                </el-form-item>
                <el-form-item label="本馆借阅规则" prop="museumRule">
                  <el-select v-model="addForm.museumRule"  placeholder="请选择" :style="{width:'140px'}">
                    <el-option :label="item.ruleName" :value="item.id" v-for="item in museumRulelist" :key="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="馆际借阅规则" prop="interlibraryRule">
                  <el-select v-model="addForm.interlibraryRule"  placeholder="请选择" :style="{width:'140px'}">
                    <el-option :label="item.ruleName" :value="item.id" v-for="item in interlibraryRulelist" :key="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input type="textarea" v-model="addForm.remarks" clearable></el-input>
                </el-form-item>
                <el-form-item style="float:right;margin-top:15px">
                    <el-button type="primary" @click="submitForm('addForm')">保存</el-button>
                    <el-button @click="closeDialog('addForm')">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import { getData } from '@/methods/method'
import {partitionListSave,delReaderCard,partitionListMax,museumRulelist,interlibraryRulelist,readerCardList,readerCardSave} from '@/request/systemSetup'
import Template from "../interviewManage/order/template";
export default {
  components: {Template},
  data(){
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

              value: [
                    { required: true, message: '请输入证类型代码', trigger: 'blur' }
                ],
              label: [
                    { required: true, message: '请输入证类型名称', trigger: 'blur' }
                ],
              remarks: [
                    { required: true, message: '请输入备注', trigger: 'blur' }
                ],
              museumRule: [
                { required: true, message: '请选择本馆借阅规则', trigger: 'blur' }
              ]

  			},
          museumRulelist:[],
          interlibraryRulelist:[],
          power:[],//按钮权限数组
        }
    },
    methods:{
      //得到权限按钮数组
      getPowerArr(){
        let  obj;
        let  power =this.$route.meta.power;
        for(let i=0,len=power.length;i<len;i++){
          if(power[i].name=='添加'){
            obj=power[0];
            power[0]=power[i];
            power[i]=obj
          }
        }
        this.power=power;
      },
        closeDialog() {
          this.visible = false;
          if(this.DialogTitle=="新增"){
            this.$refs.addForm.resetFields();
          }
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
  		    getData.call(this,readerCardList,JSON.stringify(this.form))
		},
	    handleCurrentChange(val) {
	    	this.form.pageNum=val;
	        getData.call(this,readerCardList,JSON.stringify(this.form))
        },
    // 添加
        add(row){
            this.visible=true;
            if(row=="1"){
              this.DialogTitle="新增";
              this.addForm={};
              this.$nextTick(()=>{
                this.$refs.addForm.clearValidate();
              });

            }else{
                this.DialogTitle="修改";
                this.addForm={
                  id:row.id,
                  value:row.value,
                  label:row.label,
                  museumRule:row.museumRule,
                  interlibraryRule:row.interlibraryRule,
                  remarks:row.remarks
                };
            }
        },
        // 提交
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                  readerCardSave(this.addForm).then(data=>{
                        if(data.data.code==0){
                            this.$message({
                                type: 'success',
                                message: this.DialogTitle+"成功！",
                                duration:'2000'
                            });
                            this.visible=false;
                            getData.call(this,readerCardList,JSON.stringify(this.form))
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
                content='确定要删除这'+this.selection.length+'个条证类型参数吗?'
                obj=this.selectionIds.join(',')
            }else{
                content='确定要删除这个证类型参数吗?'
                obj=row.id
            }
            this.$confirm(content, '警告', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'error'
                        }).then(() => {
              delReaderCard(obj).then(data=>{
                                    if(data.data.code==0){
                                        this.$message({
                                            type: 'success',
                                            message: "删除成功！",
                                            duration:'2000'
                                        });
                                        getData.call(this,readerCardList,JSON.stringify(this.form))
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
          readerCardListDetail(row.id).then(data=>{
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
        getData.call(this,readerCardList,JSON.stringify(this.form));
        museumRulelist().then(data=>{
        if(data.data.code==0){
          this.museumRulelist=data.data.page.list;
        }else{
          this.$message({
            type: 'error',
            message:"本馆借阅规则数据获取失败！失败原因："+data.data.msg,
            duration:'2000'
          });
        }
      }).catch(err=>{
        this.$message({
          type: 'info',
          message: '本馆借阅规则数据获取失败，失败原因：'+err.data.msg
        });
      })
      interlibraryRulelist().then(data=>{
        if(data.data.code==0){
          this.interlibraryRulelist=data.data.page.list;
        }else{
          this.$message({
            type: 'error',
            message:"本馆借阅规则数据获取失败！失败原因："+data.data.msg,
            duration:'2000'
          });
        }
      }).catch(err=>{
        this.$message({
          type: 'info',
          message: '本馆借阅规则数据获取失败，失败原因：'+err.data.msg
        });
      })



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
