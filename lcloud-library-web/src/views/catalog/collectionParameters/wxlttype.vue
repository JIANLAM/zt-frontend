<template>
    <div>
        <!-- 文献流通类型 -->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span class='title'>文献流通类型</span>
                <span v-for="(item,index) in power" :key="index" style="float:right;margin-left:20px">
                  <el-button v-if="item.name.trim()=='删除'" type="danger"   size="medium" @click="deleteData('more',0)" :disabled="selection0.length==0">删除</el-button>
                  <el-button v-if="item.name.trim()=='新增'" type="primary"  size="medium" @click="add('add',0,'流通类型','')">添加</el-button>
                </span>
            </div>
            <div class="text item">
                <el-table ref="multipleTable" :data="data0" tooltip-effect="dark" style="width: 100%" v-loading='loading' @selection-change="selectChange0">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column type="index" width="55"></el-table-column>
                    <el-table-column prop="value" label="流通类型代码"></el-table-column>
                    <el-table-column prop="label" label="流通类型名称"></el-table-column>
                    <el-table-column prop="remarks" label="备注"></el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <span v-for="(item,index) in power" :key="index">
                                <el-button v-if="item.name.trim()=='修改'" type="text" @click="add('modify',0,'流通类型',scope.row)">修改</el-button>
                                <el-button v-if="item.name.trim()=='删除'" type="text" style="color: rgb(245, 108, 108);" @click="deleteData(scope.row,'')">删除</el-button>
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

        </el-card>
          <!-- 读者证类型 -->
        <el-card class="box-card" style="display: none">
            <div slot="header" class="clearfix">
                <span class='title'>读者证类型</span>
                <el-button type="danger"  style="float:right;margin-left:20px" size="medium" @click="deleteData('more',1)" :disabled="selection1.length==0">删除</el-button>
                <el-button type="primary"  style="float:right" size="medium" @click="add('add',1,'证类型','')">添加</el-button>
            </div>
            <div class="text item">
                <el-table ref="multipleTable" :data="data1" tooltip-effect="dark" style="width: 100%" v-loading='loading' @selection-change="selectChange1">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column type="index" width="55"></el-table-column>
                    <el-table-column prop="value" label="证类型代码"></el-table-column>
                    <el-table-column prop="label" label="证类型名称"></el-table-column>
                    <el-table-column prop="remarks" label="备注"></el-table-column>
                    <el-table-column label="操作" align="center">
                       <template slot-scope="scope">
                            <el-button type="text" @click="add('modify',1,'证类型',scope.row)">修改</el-button>
                            <el-button type="text" style="color: rgb(245, 108, 108);" @click="deleteData(scope.row,'')">删除</el-button>
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
              :current-page.sync="dataPage1.pageNum"
		      >
		   	 </el-pagination>
   			</el-col>
		</el-row>

        </el-card>

        <!-- 添加 -->
        <el-dialog :visible.sync="visible" :title="DialogTitle" :before-close="cancel" class="collectionParameters">
            <el-form ref="addForm" :model="addForm" label-width="120px" :rules="rules" class="clearfix">
                <el-form-item :label="code" prop="value">
                    <el-input v-model="addForm.value"></el-input>
                </el-form-item>
                <el-form-item :label="name" prop="label">
                    <el-input v-model="addForm.label"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input type="textarea" v-model="addForm.remarks"></el-input>
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
    import {getData} from '@/methods/method'
    import {circulationList,circulationSave,cltDelete,readerCardList,readerCardSave} from '@/request/systemSetup'
    export default {
        components:{
        },
        data(){
          var checkNumber = (rule, value, callback) => {
            let str = /^[0-9a-zA-Z]+$/;
            if (!str.test(value)) {
              callback(new Error("代码只能为数字和英文"));
            } else {
              callback();
            }
          };
            return {
                loading:false,
                loading1:false,
                loading2:false,
                loading3:false,
                data0:[],
                data1:[],
                dataPage0:[],
                dataPage1:[],
                selection0:[],
                selection1:[],
                visible:false,
                DialogTitle:"",
                form0:{
                    pageNum:0 ,
                    pageSize:3
                },
                form1:{
                    pageNum:0 ,
                    pageSize:3
                },
                addForm:{
                  value:"",
                  label:"",
                  remarks:""
                },
                rules: {
                   value: [
                        { required: true, message: '请填写代码', trigger: 'blur'},
                     { validator: checkNumber, trigger: "blur" }
                    ],
                    label: [
                        { required: true, message: '请填写名称', trigger: 'blur'}
                    ],
                },
                url2:[],
                url:[circulationSave,readerCardSave],
                urlIndex:0,
                content:"",
                code:"",
                name:"",
                power:[],//按钮权限数组
            }
        },
        created(){
            // getData.call(this,literatureSource,JSON.stringify(this.form))
            this.getData(circulationList,this.form0,0);
            this.getData(readerCardList,this.form1,1);
            this.getPowerArr();
        },
        methods:{
          //得到权限按钮数组
          getPowerArr(){
            let  obj;
            let  power =this.$route.meta.power;
            for(let i=0,len=power.length;i<len;i++){
              if(power[i].name=='删除'){
                obj=power[0];
                power[0]=power[i];
                power[i]=obj
              }
            }
            this.power=power;
          },
            //预算列表选择事件
            selectChange0(selection){
                if(selection.length >= 1){
                    this.selection0 = selection;
                }else{
                this.selection0 = '';
                }
            },
            //预算列表选择事件
            selectChange1(selection){
                if(selection.length >= 1){
                    this.selection1 = selection;
                }else{
                this.selection1 = '';
                }
            },
                //分页事件
            handleSizeChange0(val) {
                this.form0.pageSize=val;
                this.getData(circulationList,this.form0,0)
            },
            handleCurrentChange0(val) {
                this.form0.pageNum=val;
                this.getData(circulationList,this.form0,0)
            },
            //分页事件
            handleSizeChange1(val) {
                this.form1.pageSize=val;
                this.getData(readerCardList,this.form1,1)
            },
            handleCurrentChange1(val) {
                this.form1.pageNum=val;
                this.getData(readerCardList,this.form1,1)
            },
            getData(url,obj,id){
            url(JSON.stringify(obj)).then(data=>{
                if(data.data.code==0){
                    if(id==0){
                            this.data0=data.data.page.list;
                            this.dataPage0=data.data.page;
                        }else if(id==1){
                            this.data1=data.data.page.list;
                            this.dataPage1=data.data.page;
                    }
                    if(data.data.page.list&&data.data.page.list.length>0){
                    }else{
                        if(data.data.page.pageNum>1) {
                            if(id==0){
                                this.form0.pageNum=data.data.page.pageNum-1
                                this.getData(circulationList,this.form0,0);
                            }else{
                                this.form1.pageNum=data.data.page.pageNum-1
                                this.getData(readerCardList,this.form1,1)
                            }
                        }
                    }
                }else{
                    this.$message({
                    type: 'error',
                    message:"数据获取失败！失败原因："+data.data.msg,
                    duration:'2000'
                });
                    }
             }).catch(err=>{
                        this.$message({
                            type: 'info',
                            message: '数据获取失败，失败原因：'+err.data.msg
                        });
        })
            },
            // 添加
            add(type,index,title,row){
                this.visible=true;
              this.$nextTick(()=>{
                this.$refs.addForm.clearValidate();
              });
                this.urlIndex=index;
                 this.code=title+"代码";
                this.name=title+"名称";
                if(type=="add"){
                    this.content="新增";
                    this.DialogTitle="新增"+title;
                    this.addForm={}
                    this.addForm.id=row.id
                }else{
                    this.content="修改";
                    this.DialogTitle="修改"+title;
                    this.addForm.id=row.id;
                    this.addForm={
                      "id":row.id,
                      "value" :row.value,
                      "label" :row.label,
                      "remarks":row.remarks
                    }
                }

            },
            // 提交
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log(this.urlIndex)
                    this.url[this.urlIndex](this.addForm).then(data=>{
                        if(data.data.code==0){
                            this.$message({
                            type: 'success',
                            message:this.content+"成功",
                            duration:'2000'
                        });
                        this.visible=false;
                        this.getData(circulationList,this.form0,0);
                        this.getData(readerCardList,this.form1,1)

                        }else{
                            this.$message({
                            type: 'error',
                            message:this.content+"失败！失败原因："+data.data.msg,
                            duration:'2000'
                        });
                            }
                    }).catch(err=>{
                                this.$message({
                                    type: 'info',
                                    message: this.content+"失败！失败原因："+data.data.msg
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
            deleteData(row,id){
                this.$confirm('确定要删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                let obj=[];
                if(row=="more"){
                    if(id==0){
                        for(let i0=0,length0=this.selection0.length;i0<length0;i0++){
                            obj.push(this.selection0[i0].id)
                        }
                    }else if(id==1){
                        for(let i1=0,length1=this.selection1.length;i1<length1;i1++){
                            obj.push(this.selection1[i1].id)
                        }
                    }
                    obj=obj.join(",")
                }else{
                    obj=row.id
                }
                cltDelete(obj).then(data=>{
                    if(data.data.code==0){
                        this.$message({
                        type: 'success',
                        message:"删除成功",
                        duration:'2000'
                    });
                    this.visible=false;
                    this.getData(circulationList,this.form0,0);
                    this.getData(readerCardList,this.form1,1)

                    }else{
                        this.$message({
                        type: 'error',
                        message:"删除失败！失败原因："+data.data.msg,
                        duration:'2000'
                    });
                        }
                }).catch(err=>{
                            this.$message({
                                type: 'info',
                                message: "删除失败！失败原因："+data.data.msg
                            });
        })

                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '删除已取消!'
                });
                });

            }
        }




    }
</script>
<style scoped>
.text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
 .box-card{width: 48%;margin:0 1.5% 20px 0;float: left;}
 .title{font-size: 22px}
</style>
