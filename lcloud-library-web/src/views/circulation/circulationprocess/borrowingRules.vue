<template>
    <div>
        <div :class="{nav:navColor,click:nav==true}"   @click="inRule">馆内借阅规则</div>
        <div :class="{nav:navColor,click:nav==false}"  @click="outRule">馆际借阅规则</div>
        <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="">
               <span v-for="(item,index) in power" :key="index">
                  <el-button v-if="item.name.trim()=='新增'" type="primary" icon="el-icon-plus" @click="add('add')">新建</el-button>
                  <el-button v-if="item.name.trim()=='删除'" type="danger" icon="el-icon-delete" @click="deleteData('1')" :disabled="selection.length==0">删除</el-button>
                  <el-button v-if="item.name.trim()=='导出'" type="success" icon="el-icon-document" :disabled="data.length==0" v-show="nav==true" @click="ruleExport('exportMuseumRule')">导出</el-button>
                  <el-button v-if="item.name.trim()=='导出'" type="success" icon="el-icon-document" :disabled="data.length==0" v-show="nav==false" @click="ruleExport('exportInterlibraryRule')">导出</el-button>
               </span>
            </el-form-item>
        </el-form>
        <div class="text item">
            <el-table ref="multipleTable" :data="data" tooltip-effect="dark" style="width: 100%" v-loading='loading' @selection-change="selectChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="index" width="55"></el-table-column>
                <el-table-column prop="ruleCode" label="规则代码"></el-table-column>
                <el-table-column prop="ruleName" label="规则名称"></el-table-column>
                <el-table-column prop="createName" label="创建者"></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column prop="status" label="是否启用">
                    <template slot-scope="scope">
                         <el-switch
                            v-model.number="scope.row.status"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            @change="changEnable(scope.row)"
                             v-if="searchButton">
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
                <el-table-column prop="remarks" label="备注"></el-table-column>
                <el-table-column  label="操作" >
                    <template slot-scope="scope">
                        <!--<el-button type="text" size="mini"  @click="detail(scope.row)">查看详情</el-button>-->
                        <span v-for="(item,index) in power" :key="index">
                            <el-button v-if="item.name.trim()=='修改'" type="text" size="mini" style="color: rgb(255, 208, 75);"   @click="add(scope.row)">修改</el-button>
                            <el-button v-if="item.name.trim()=='删除'" type="text" size="mini" style="color: rgb(245, 108, 108);"  @click="deleteData(scope.row)" >删除</el-button>
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
        <!-- 详情  -->
        <el-dialog :visible.sync="visibleDetail" :title="DialogTitle">
            <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" v-loading='loading'>
                <el-table-column type="index" width="55"></el-table-column>
                <el-table-column prop="ruleCode" label="规则代码"></el-table-column>
                <el-table-column prop="ruleName" label="规则名称"></el-table-column>
                <el-table-column prop="lendQty" label="借阅册数"></el-table-column>
                <el-table-column prop="lendDays" label="借阅天数"></el-table-column>
                <el-table-column prop="renewQty" label="续借次数"></el-table-column>
                <el-table-column prop="renewDays" label="续借天数"></el-table-column>
                <el-table-column prop="overduePayrate" label="逾期罚款率"></el-table-column>
                <el-table-column type="lostPayrate" width="丢失罚款率"></el-table-column>
                <el-table-column prop="brokenPayrate" label="污损罚款率"></el-table-column>
                <el-table-column prop="ruleType" label="规则类型">
                  <template slot-scope="scope">
                    <span v-if="scope.row.ruleType==0">馆内</span>
                    <span v-else>馆外</span>
                  </template>
                </el-table-column>
                <el-table-column prop="credit" label="信用值限制"></el-table-column>
                <el-table-column prop="literatureType" label="可借文献类型"></el-table-column>
                <el-table-column prop="status" label="是否启用">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status==1">是</span>
                        <span v-else>否</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column prop="createName" label="创建者姓名"></el-table-column>
                <el-table-column prop="updateBy" label="修改者"></el-table-column>
                <el-table-column prop="updateTime" label="修改时间"></el-table-column>
                <el-table-column prop="updaterName" label="修改者姓名"></el-table-column>
            </el-table>
        </el-dialog>

        <!-- 添加 -->
        <el-dialog :visible.sync="visible" title="新增借阅规则">
            <el-form ref="addForm" :model="addForm" label-width="110px" :rules="rules" class="clearfix">
                <el-form-item label="规则类别" prop="ruleType">
                  <el-select v-model="addForm.ruleType"  placeholder="请选择" :style="{width:'140px'}">
                    <el-option label="馆内借阅" value="0"></el-option>
                    <el-option label="馆际借阅" value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="规则代码" prop="ruleCode">
                  <el-input v-model="addForm.ruleCode" ></el-input>
                </el-form-item>
                <el-form-item label="规则名称" prop="ruleName">
                    <el-input v-model="addForm.ruleName" ></el-input>
                </el-form-item>

                <el-form-item label="借阅册数" prop="lendQty">
                    <el-tooltip content="注：表示借阅的图书可借阅册数，为空则表示不限制册数。" placement="top" >
                        <el-input v-model="addForm.lendQty" ></el-input>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="借阅天数" prop="lendDays">
                    <el-tooltip content="注：表示借阅的图书可借阅的天数，为空则表示不限制借阅天数。" placement="top">
                        <el-input v-model="addForm.lendDays" ></el-input>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="续借次数" prop="renewQty">
                    <el-tooltip content="注：表示借阅的图书可续借的次数，为空则表示不允许续借。" placement="top">
                        <el-input v-model="addForm.renewQty" ></el-input>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="续借天数" prop="renewDays">
                    <el-tooltip content="注：表示借阅的图书可续借的天数，为空则表示不允许续借。" placement="top">
                        <el-input v-model="addForm.renewDays" ></el-input>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="逾期罚款" prop="overduePayrate">
                    <el-tooltip content="注：表示罚款的计算方式，罚款金额=图书价格*罚款率*逾期天数。(/天)" placement="top">
                        <el-input v-model="addForm.overduePayrate" ></el-input>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="丢失罚款倍率" prop="lostPayrate">
                    <el-tooltip content="注：表示罚款的计算方式，罚款金额=图书价格*罚款率。(/天)" placement="top">
                        <el-input v-model="addForm.lostPayrate" ></el-input>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="污损罚款倍率" prop="brokenPayrate">
                    <el-tooltip content="注：表示罚款的计算方式，罚款金额=图书价格*罚款率。(/天)" placement="top">
                        <el-input v-model="addForm.brokenPayrate" ></el-input>
                    </el-tooltip>
                </el-form-item>

                <el-form-item label="信用值限制" prop="credit">
                    <el-tooltip content="注：读者信用值必须大于此值才能使用借阅功能。" placement="top">
                        <el-input v-model="addForm.credit" ></el-input>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="可借文献类型" prop="literatureType">
                        <el-select v-model="addForm.literatureType"  placeholder="请选择" :style="{width:'300px'}" multiple >
                            <el-option :label="item.label" :value="item.id" v-for="item in circulationList" :key="item.value"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item label="是否启用" prop="status">
                        <el-select v-model="addForm.status"  placeholder="请选择" :style="{width:'140px'}">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item style="float:right;margin-top:15px">
                    <el-button type="primary" @click="submitForm('addForm')">确定</el-button>
                    <el-button @click="cancel('addForm')">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
  import axios  from '@/axios/request'
  import {museumRulelist,interlibraryRulelist,ruleSave,ruleDelete,exportRule,readerCardList,ruleOpen,ruleClose,getData,circulationList} from '@/request/systemSetup'
export default {
    data(){
        var validatePass= (rule, value, callback) => {
          console.log(value)
  			if (value == ''||value==undefined) {
          		callback();
        	}else{
        		if(isNaN(value)&&Number(value)<0){
        			callback(new Error('请输入正整数!'));
        		}else{
        			 callback();
        		}
        	}
  		};
        return {
            navColor:true,
            nav:true,
            selection:[],
            selectionIds:[],
            loading:false,
            visible:false,
            visibleDetail:false,
            DialogTitle:"",
            form:{
                pageNum:1,
                pageSize:5,
                libraryId:""
            },
            data:[],
            tableData:[],
            dataPage:'',
            addForm:{
               dicId:"WSG|文史馆",
               ruleType:"0"
            },
            rules:{
  			    lendQty: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                lendDays: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                renewQty: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                renewDays: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                credit: [
                    { validator: validatePass, trigger: 'blur' }
                ],
  			},
          ruleList:museumRulelist,
          circulationList:[],
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
          if(power[i].name=='新增'){
            obj=power[0];
            power[0]=power[i];
            power[i]=obj
          }else if(power[i].name=='修改'){
            this.searchButton=true
          }
        }
        this.power=power;
      },
        inRule(){
            this.nav=true;
            this.ruleList=museumRulelist;
            getData.call(this,this.ruleList,JSON.stringify(this.form))
           console.log()
        },
        outRule(){
            this.nav=false;
            this.ruleList=interlibraryRulelist;
            getData.call(this,this.ruleList,JSON.stringify(this.form))
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
  		    getData.call(this,this.ruleList,JSON.stringify(this.form))
		},
	    handleCurrentChange(val) {
	    	this.form.pageNum=val;
	        getData.call(this,this.ruleList,JSON.stringify(this.form))
        },
        changEnable(row){
            console.log(row)
            if(row.status){
            ruleOpen(row.id).then(data=>{
                if(data.data.code==0){
                    this.$message({
                    message: '启用状态成功!',
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
                ruleClose(row.id).then(data=>{
            if(data.data.code==0){
                this.$message({
                    message: '禁用状态成功!',
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
    // 添加
        add(row){
            this.visible=true;
            if(row=="add"){
                this.DialogTitle="新增借阅规则";
                this.addForm={ruleType:"0",status:"1",literatureType:[]}
            }else{
                this.DialogTitle="修改借阅规则";
                if(typeof  row.literatureType!="object"){row.literatureType=(row.literatureType==null?"":[row.literatureType]);}
                row.status=(row.status==null?"":row.status?"1":"0");
                row.ruleType=row.ruleType.toString();
                this.addForm=row;
                // this.addForm.
            }
        },
        // 提交
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(Array.isArray(this.addForm.literatureType)){
                      this.addForm.literatureType=this.addForm.literatureType.join(",");
                    }
                    ruleSave(this.addForm).then(data=>{
                      this.addForm.literatureType=[];
                        if(data.data.code==0){
                            this.$message({
                                type: 'success',
                                message: this.DialogTitle+"成功！",
                                duration:'2000'
                            });
                            this.visible=false;
                            getData.call(this,this.ruleList,JSON.stringify(this.form))
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
                content='确定要删除这'+this.selection.length+'个借阅规则吗?'
                obj=this.selectionIds.join(',')
            }else{
                content='确定要删除这个借阅规则吗?'
                obj=row.id
            }
            this.$confirm(content, '警告', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'error'
                        }).then(() => {
                                ruleDelete(obj).then(data=>{
                                    if(data.data.code==0){
                                        this.$message({
                                            type: 'success',
                                            message: "删除成功！",
                                            duration:'2000'
                                        });
                                        getData.call(this,this.ruleList,JSON.stringify(this.form))
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
            this.tableData=[];
            this.tableData.push(row);
            this.visibleDetail=true;
        },
            //导出多条借阅规则
        ruleExport(url){
            this.$confirm('是否要导出?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
            axios.get('/circulate/circulate/v1/rule/'+url).then(data=>{
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
    },
    created(){
         this.getPowerArr();
        getData.call(this,this.ruleList,JSON.stringify(this.form))
      // 获取可借文献类型
        circulationList().then(data=>{
          if(data.data.code==0){
            this.circulationList=data.data.page.list;
          }else{
            this.$message({
              type: 'error',
              message:"可借文献类型数据获取失败！失败原因："+data.data.msg,
              duration:'2000'
            });
          }
        }).catch(err=>{
          this.$message({
            type: 'info',
            message: '可借文献类型数据获取失败，失败原因：'+err.data.msg
          });
        })
      },
     watch:{
       visible(newVal){
           if(newVal==false){
             for(let i=0,length=this.data.length;i<length;i++){
               if(this.data[i].status==1){
                 this.data[i].status=true
               }else{
                 this.data[i].status=false
               }
             }
           }
       }

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
</style>
