<template>
    <div v-loading='loading2'  element-loading-text="预览加载中">
        <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="">
                <span v-for="(item,index) in power" :key="index">
                    <el-button  v-if="item.name.trim()=='新增'" type="success" icon="el-icon-plus" @click="add()">添加</el-button>
                    <el-button  v-if="item.name.trim()=='删除'" type="warning" icon="el-icon-delete" @click="deleteData('1')" :disabled="selection.length==0">删除</el-button>
                </span>
            </el-form-item>
        </el-form>
        <div class="text item">
            <el-table ref="multipleTable" :data="data" tooltip-effect="dark" style="width: 100%" v-loading='loading' @selection-change="selectChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="index" width="55" label="序号"></el-table-column>
                <el-table-column prop="labelName" label="模板名称"></el-table-column>
                <el-table-column prop="ipAddress" label="创建者账号"></el-table-column>
                <el-table-column prop="creator" label="创建者姓名"></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
                <el-table-column  label="操作" >
                    <template slot-scope="scope">
                        <!-- <el-button type="text" size="mini"  @click="detail(scope.row)">查看详情</el-button> -->
                        <span v-for="(item,index) in power" :key="index">
                            <el-button  v-if="item.name.trim()=='修改'" type="text" size="mini"  @click="editData(scope.row)">修改</el-button>
                            <el-button  v-if="item.name.trim()=='删除'" style="color: red" type="text" size="mini"  @click="deleteData(scope.row)">删除</el-button>
                        </span>
                      <el-button type="text" size="mini"  @click="preview(scope.row)">预览</el-button>
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
        <el-dialog :visible.sync="visible" :title="DialogTitle" width="1030px" style="min-width:900px">
            <el-form ref="addForm" :model="addForm" label-width="85px" :rules="rules" class="clearfix" >
              <el-form-item label="模板名称" prop="labelName" label-width="75px">
                <el-input v-model="addForm.labelName" clearable :style="{width:'240px'}"></el-input>
                &nbsp;&nbsp;&nbsp;&nbsp;备注&nbsp;&nbsp;<el-input v-model="addForm.remark" clearable :style="{width:'240px'}"></el-input>
              </el-form-item>
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>纸张设置</span>
                </div>
                <div>
                  <!--<el-form-item label="纸张模板" prop="paperSize" >-->
                  <!--<el-select v-model="addForm.paperSize"  placeholder="请选择" >-->
                      <!--<el-option label="A0" value="A0"></el-option>-->
                      <!--<el-option label="A1" value="A1"></el-option>-->
                      <!--<el-option label="A2" value="A2"></el-option>-->
                      <!--<el-option label="A3" value="A3"></el-option>-->
                      <!--<el-option label="A4" value="A4"></el-option>-->
                      <!--<el-option label="自定义" value="自定义"></el-option>-->
                  <!--</el-select>-->
                <!--</el-form-item>-->
                  <el-form-item label="纸张高度" prop="paperHeight">
                    <el-input v-model="addForm.paperHeight" clearable @keyup.native="justNumber('paperHeight')" @afterpaste.native="justNumber('paperHeight')"> </el-input>
                  </el-form-item>
                  <el-form-item label="纸张宽度" prop="paperWeight">
                      <el-input v-model="addForm.paperWeight" clearable @keyup.native="justNumber('paperWeight')" @afterpaste.native="justNumber('paperWeight')"></el-input>
                  </el-form-item>
                  <el-form-item label="行数" prop="rowCount">
                      <el-input v-model="addForm.rowCount" clearable @keyup.native="justNumber('rowCount')" @afterpaste.native="justNumber('rowCount')"></el-input>
                  </el-form-item>
                  <el-form-item label="列数" prop="columnCount">
                      <el-input v-model="addForm.columnCount" clearable @keyup.native="justNumber('columnCount')" @afterpaste.native="justNumber('columnCount')"></el-input>
                  </el-form-item>
                  <el-form-item label="字体大小" prop="fontSize">
                    <el-select v-model="addForm.fontSize"  placeholder="请选择" >
                      <el-option :label="item" :value="item" :key="item" v-for="item in fontsize"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="字体加粗" prop="fontThick">
                    <el-select v-model="addForm.fontThick"  placeholder="请选择" >
                      <el-option :label="item" :value="item" :key="item" v-for="item in fontweight"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-card>
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>书标设置</span>
                </div>
                <div>

                  <el-form-item label="书标高度" prop="lableHeght">
                    <el-input v-model="addForm.lableHeght" clearable @keyup.native="justNumber('lableHeght')" @afterpaste.native="justNumber('lableHeght')"></el-input>
                </el-form-item>
                <el-form-item label="书标宽度" prop="lableWeight">
                    <el-input v-model="addForm.lableWeight" clearable @keyup.native="justNumber('lableWeight')" @afterpaste.native="justNumber('lableWeight')"></el-input>
                </el-form-item>

                <el-form-item label="书标行间距" prop="rowSpace">
                  <el-input v-model="addForm.rowSpace" clearable @keyup.native="justNumber('rowSpace')" @afterpaste.native="justNumber('rowSpace')"></el-input>
                </el-form-item>
                <el-form-item label="书标列间距" prop="columnSpace">
                  <el-input v-model="addForm.columnSpace" clearable @keyup.native="justNumber('columnSpace')" @afterpaste.native="justNumber('columnSpace')"></el-input>
                </el-form-item>
                <el-form-item label="重复个数" prop="repeatNum">
                    <el-input v-model="addForm.repeatNum" clearable @keyup.native="justNumber('repeatNum')" @afterpaste.native="justNumber('repeatNum')"></el-input>
                </el-form-item>
                </div>
              </el-card>
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>书标格式</span>
                </div>
                <div>
                  <el-form-item label="第一行" prop="oneRow">
                    <el-select v-model="addForm.oneRow"  placeholder="请选择" >
                      <el-option :label="item.name" :value="item.code" :key="index" v-for="(item,index) in formats"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="第二行" prop="twoRow">
                    <el-select v-model="addForm.twoRow"  placeholder="请选择" >
                      <el-option :label="item.name" :value="item.code" :key="index" v-for="(item,index) in formats"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="第三行" prop="threeRow">
                    <el-select v-model="addForm.threeRow"  placeholder="请选择" >
                      <el-option :label="item.name" :value="item.code" :key="index" v-for="(item,index) in formats"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="第四行" prop="fourRow">
                    <el-select v-model="addForm.fourRow"  placeholder="请选择" >
                      <el-option :label="item.name" :value="item.code" :key="index" v-for="(item,index) in formats"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="对齐方式" prop="alignment">
                    <el-select v-model="addForm.alignment"  placeholder="请选择" @change="spaceType">
                      <el-option label="左" value="left" ></el-option>
                      <el-option label="中" value="center" ></el-option>
                      <el-option label="右" value="right" ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="首行上间距" prop="topSpace">
                    <el-input v-model="addForm.topSpace" clearable @keyup.native="justNumber('topSpace')" @afterpaste.native="justNumber('topSpace')"></el-input>
                  </el-form-item>
                  <el-form-item :label="typeSpace" prop="leftSpace">
                    <el-input v-model="addForm.leftSpace" clearable @keyup.native="justNumber('leftSpace')" @afterpaste.native="justNumber('leftSpace')"></el-input>
                  </el-form-item>
                  <el-form-item label="行间距" prop="spaceRow">
                    <el-input v-model="addForm.spaceRow" clearable @keyup.native="justNumber('spaceRow')" @afterpaste.native="justNumber('spaceRow')"></el-input>
                </el-form-item>
                  </div>
              </el-card>
                <el-form-item  class="sureBottom">
                    <el-button type="primary" @click="submitForm('addForm')" v-if="flag">确认</el-button>
                    <el-button type="primary" @click="editForm('addForm')" v-else>确认</el-button>
                    <el-button @click="cancel('addForm')">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--预览-->

      <div id="print" class="print" ref="print" >
        <div :style="{width:(Number(printStyle.lableWeight)+Number(printStyle.leftSpace))*Number(printStyle.columnCount)-Number(printStyle.leftSpace)+Number(printStyle.lableWeight)/2+'mm'}">
          <!--循环次数为行数*列数-->
          <div class="printList"  v-for="i  in forNumber" :key="i">
            <div class="line">{{printData[printStyle.oneRow]}}</div>
            <div class="line">{{printData[printStyle.twoRow]}}</div>
            <div class="line">{{printData[printStyle.threeRow]}}</div>
            <div class="line">{{printData[printStyle.fourRow]}}</div>
            <!-- <div class="line">{{item.fourRow}}</div> -->
            <!-- <div class="line">{{item.twoRow}}</div>
                        <div class="line">{{item.threeRow}}</div> -->
            <!-- <br v-if='index/printStyle.rowCount==0'> -->
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import { getData } from '@/methods/method'
import {labelsetlist,labelsetSave,labelsetDelete,labelsetAdd,labelsetEdit,labelsetUpdate} from '@/request/catalog'
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
            DialogTitle:"",
            form:{
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
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
        },
        fontsize:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
        fontweight:['无',"normal","bold","bolder","lighter","100","200","300","400","500","600","700","800","900"],
        formats:[{"name":"条码号","code":"barcode"},{"name":"分类号","code":"callNo"},{"name":"种次号","code":"currSeednumber"},{"name":"丛书号","code":"seriesNo"},{"name":"无","code":""} ],
        flag:true,
        power:[],//按钮权限数组
        searchButton:false,
        typeSpace:"左间距",
        printStyle:{},
          // 预览数据
        printData:{barcode:"rmb00001",callNo: "J212.05/1",currSeednumber: "1",seriesNo:"978"},
        forNumber:0,
        loading2:false

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
  		    getData.call(this,labelsetlist,JSON.stringify(this.form))
		},
	    handleCurrentChange(val) {
	    	this.form.pageNum=val;
	        getData.call(this,labelsetlist,JSON.stringify(this.form))
        },
    // 添加
        add(){
            this.visible=true;
            this.flag=true;
            labelsetAdd().then(data=>{
                if(data.data.code==0){
                    let creator=data.data.LabelSet.creator;
                    let libraryId=data.data.LabelSet.libraryId;
                    let createTime=data.data.LabelSet.createTime;
                    this.addForm={
                        labelName:'模板名称',
                        creator:creator,
                        createTime:createTime,
                        libraryId:libraryId,
                        paperSize:"A4",
                        paperHeight:"245",
                        paperWeight:"170",
                        rowCount:"10",
                        columnCount:"3",
                        fontSize:"17",
                        fontThick:"无",
                        lableHeght:"20",
                        lableWeight:"50",
                        leftSpace:"4.6",
                        topSpace:"4.4",
                        alignment:"left",
                        repeatNum:"1",
                        oneRow:"barcode",
                        twoRow:"callNo",
                        threeRow:"currSeednumber",
                        fourRow:"seriesNo",
                        spaceRow:"4.4",
                        columnSpace:"0",
                        rowSpace:"0"
                    }
                    this.DialogTitle="新增"
                }else{
                    this.$message({
                    type: 'error',
                    message: "获取创建者信息失败！失败原因："+data.data.msg,
                    duration:'2000'
                });
            }
            }).catch(err=>{
                this.$message({
                    type: 'info',
                    message: '获取创建者信息失败，失败原因：'+err.data.msg
                });
        })
        },
        editData(row){
            this.visible=true;
            this.flag=false;
            labelsetEdit(row.id).then(data=>{
                if(data.data.code==0){
                    this.addForm=data.data.LabelSet;
                    this.addForm.columnSpace=0;
                    this.addForm.rowSpace=0
                  this.DialogTitle="修改"
                }else{
                    this.$message({
                    type: 'error',
                    message: "获取模板信息失败！失败原因："+data.data.msg,
                    duration:'2000'
                });
            }
            }).catch(err=>{
                this.$message({
                    type: 'info',
                    message: '获取模板信息失败，失败原因：'+err.data.msg
                });
        })
        },
        // 提交
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                  //   if((Number(this.addForm.lableWeight)*Number(this.addForm.columnCount)+Number(this.addForm.columnSpace)*Number((this.addForm.columnCount)-1))>Number(this.addForm.paperWeight)){
                  //       this.$message({
                  //           type: 'error',
                  //           message: "书标宽度*列数+书标列间距*(列数-1)要小于纸张宽度",
                  //           duration:'4000'
                  //       });
                  //       return
                  //   }
                  //   if(Number(this.addForm.lableHeght)*Number(this.addForm.rowCount)+Number(this.addForm.rowSpace)*Number((this.addForm.rowCount)-1)>Number(this.addForm.paperHeight)){
                  //       this.$message({
                  //           type: 'error',
                  //           message: "书标高度*行数+书标行间距*(行数-1)要小于纸张高度",
                  //           duration:'4000'
                  //       });
                  //       return
                  //   }
                  //
                  // if((Number(this.addForm.leftSpace)>Number(this.addForm.lableWeight))&&this.addForm.alignment!="center"){
                  //   this.$message({
                  //     type: 'error',
                  //     message: this.typeSpace+"不能大于书标宽度",
                  //     duration:'4000'
                  //   });
                  //   return
                  // }
                  // // 判断有几行
                  //  let rowLength=0;
                  //   let arr=[];
                  //   arr.push(this.addForm.oneRow,this.addForm.twoRow,this.addForm.threeRow,this.addForm.fourRow);
                  //   for(let i=0,len=arr.length;i<len;i++){
                  //     if(arr[i]!=""){
                  //       rowLength+=1
                  //     }
                  //   }
                  //   if(Number(this.addForm.fontSize)*rowLength+Number(this.addForm.spaceRow)*(rowLength-1)+Number(this.addForm.topSpace)>Number(this.addForm.lableHeght)){
                  //     this.$message({
                  //       type: 'error',
                  //       message: "字体大小*"+rowLength+"+行间距*"+(rowLength-1)+"+首行上间距要小于书标高度",
                  //       duration:'4000'
                  //     });
                  //     return
                  //   }
                    labelsetSave(this.addForm).then(data=>{
                        if(data.data.code==0){
                            this.$message({
                                type: 'success',
                                message: this.DialogTitle+"成功！",
                                duration:'2000'
                            });
                            this.visible=false;
                            getData.call(this,labelsetlist,JSON.stringify(this.form))
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
        // 修改
        editForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    labelsetUpdate(this.addForm).then(data=>{
                        if(data.data.code==0){
                            this.$message({
                                type: 'success',
                                message: this.DialogTitle+"成功！",
                                duration:'2000'
                            });
                            this.visible=false;
                            getData.call(this,labelsetlist,JSON.stringify(this.form))
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
                content='确定要删除这'+this.selection.length+'个书标模板吗?'
                obj={ids:this.selectionIds.join(',')}
            }else{
                content='确定要删除这个书标模板吗?'
                obj={ids:row.id.toString()}
            }
            this.$confirm(content, '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {
                labelsetDelete(obj).then(data=>{
                    if(data.data.code==0){
                        this.$message({
                            type: 'success',
                            message: "删除成功！",
                            duration:'2000'
                        });
                        getData.call(this,labelsetlist,JSON.stringify(this.form))
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
        },
      //监听对齐方式
      spaceType(){
        if(this.addForm.alignment=="left"){
          this.typeSpace="左间距"
        }else if(this.addForm.alignment=="right"){
          this.typeSpace="右间距"
        }
      },
      //如果表单为空则默认为0，而且只能为数字
      justNumber(obj){
        if(this.addForm[obj]){
          this.addForm[obj]=this.addForm[obj].toString().replace(/[^\d]/g,'')
        }else {
          this.addForm[obj]=0
        }
      },
      // 预览模板
      preview(row){
        this.forNumber=Number(row.rowCount)*Number(row.columnCount);
        console.log(this.forNumber);
        this.loading2=true;
        setTimeout(()=>{
          this.loading2=false
          // 打印的纸
          let printParent=document.getElementById("print");
          // 每个书标
          let printList=document.getElementsByClassName("printList");
          // 书标里面的每一行
          let line=document.getElementsByClassName("line");
          // 判断选了哪个书标模板
          this.printStyle="";
          this.printStyle=row;
          let scaleNumber=this.printStyle.fontSize/12;
          let fontSizes="font-size:12px;transform: scale("+scaleNumber+");transform-origin:0 0;"+
            "-ms-transform: scale("+scaleNumber+");-ms-transform-origin:0 0;-webkit-transform: scale("+scaleNumber+");-webkit-transform-origin:0 0;" +
            "-moz-transform: scale("+scaleNumber+");-moz-transform-origin:0 0;-o-transform: scale("+scaleNumber+");-o-transform-origin:0 0;"
          if(printList.length==this.forNumber){
            // 纸张设置
            printParent.style="width:"+this.printStyle.paperWeight+"mm;height:"+this.printStyle.paperHeight+"mm;font-weight:"+this.printStyle.fontThick
            // 书标设置
            for(let j=0,length2=printList.length;j<length2;j++){
              printList[j].style="width:"+this.printStyle.lableWeight+"mm;height:"+this.printStyle.lableHeght+
                "mm;text-align:"+this.printStyle.alignment
            }
            //每一行
            for(let k=0,length3=line.length;k<length3;k++){
              // 第一行是首行上间距
              if(k%3==0){
                if(this.printStyle.alignment=="center"){
                  line[k].style="margin-top:"+this.printStyle.topSpace+"mm;"+fontSizes
                }else if(this.printStyle.alignment=="left"){
                  line[k].style="margin-left:"+ this.printStyle.leftSpace+"mm;margin-top:"+this.printStyle.topSpace+"mm;line-height:1"+fontSizes
                }else {
                  line[k].style="margin-right:"+ this.printStyle.leftSpace+"mm;margin-top:"+this.printStyle.topSpace+"mm;"+fontSizes
                }
              }else{
                // 其他行是行间距
                if(this.printStyle.alignment=="center"){
                  line[k].style="margin-top:"+ this.printStyle.spaceRow+"mm"+fontSizes
                }else if(this.printStyle.alignment=="left"){
                  line[k].style="margin-left:"+ this.printStyle.leftSpace+"mm;margin-top:\"+ this.printStyle.spaceRow+\"mm"+fontSizes
                }else {
                  line[k].style="margin-right:"+ this.printStyle.leftSpace+"mm;margin-top:\"+ this.printStyle.spaceRow+\"mm"+fontSizes
                }
              }
            }
          }
        },2000)
      }
    },
    created(){
        this.getPowerArr();
        getData.call(this,labelsetlist,JSON.stringify(this.form))
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
 .box-card{float: left;width:312px;height: 558px;margin-top: 0}
 .box-card:nth-child(3){margin: 0 20px;}
 .sureBottom {margin-left:240px;margin-bottom: -10px;clear: both}
.sureBottom button{margin-right: 150px}
.printList{display: inline-block;border: 1px solid red;box-sizing: border-box;overflow: hidden;}
#print{background: white;clear: both}
 </style>
