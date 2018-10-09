<template>
   <div id="classSet">
     <div>
       <el-form :inline="true" :model="form">
         <el-form-item >
           <el-input v-model="form.searchValue" clearable>
             <el-select v-model="form.searchKey" slot="prepend" :style="{width:'150px'}">    
               <el-option label="读者证号" value="readerCardNumber"></el-option>
               <el-option label="读者姓名" value="username"></el-option>
               <el-option label="学号/工号" value="stuworkNumber"></el-option>
             </el-select>
           </el-input>
         </el-form-item>
         <el-button type="primary" icon="el-icon-search" @click="searchReader">查询</el-button>
         <el-button type="danger" icon="el-icon-delete"  :disabled="readerTotalselection.length==0" @click="deleteSome">删除</el-button>
         <el-button type="success" icon="el-icon-plus" @click="addReader">新增</el-button>
         <el-button type="primary" icon="iconfont icon-daoru" @click="importReaderData">导入</el-button>
         <el-button type="warning" icon="iconfont icon-daoru" @click="exportReaderData">导出</el-button>
       </el-form>
     </div>
     <!--年级与班级导航数据-->
     <section class="flex">
       <ul id="nav">
         <li v-for="(item,index) in gradeList" :key="index" class="one_menuli">
           <p @click="onShow(index,item.id)" :class="{actived:item.ulShow}">{{item.name}}</p>
           <ul class="class_wrap" v-show="item.ulShow">
             <li v-for="(child,indexA) in gradeClassList" :key="indexA" class="two_menuli" :class="{actived:child.liShow}" @click="onActive(index,indexA,child.id)">{{child.name}}</li>
           </ul>
         </li>
       </ul>
       <div class="flex-1">
         <el-table :data="tableData" border @selection-change="readerTotalChange" style="width:100%" >
           <el-table-column type="selection" width="55"></el-table-column>
           <el-table-column  prop="readerCardNumber"  label="读者证号"></el-table-column>
           <el-table-column  prop="username"  label="读者姓名"></el-table-column>
           <el-table-column  prop="stuworkNumber"  label="学号/工号"></el-table-column>
           <el-table-column  prop="sex"  label="性别">
             <template slot-scope="scope">
               <span v-if="scope.row.sex == '1'">男</span>
               <span v-if="scope.row.sex == '2'">女</span>
             </template>
           </el-table-column>
           <el-table-column  prop="status"  label="证状态">
             <template slot-scope="scope">
               <span v-if="scope.row.status == 0">禁用</span>
               <span v-if="scope.row.status == 1">正常</span>
               <span v-if="scope.row.status == 2">注销</span>
               <span v-if="scope.row.status == 3">挂失</span>
             </template>
           </el-table-column>
           <el-table-column  prop="startDate"  label="启用日期"></el-table-column>
           <el-table-column  prop="endDate"  label="终止日期"></el-table-column>
           <el-table-column  prop="prePayment"  label="预付款金额"></el-table-column>
           <el-table-column  prop="arrear"  label="欠款金额"></el-table-column>
           <el-table-column  prop="remark"  label="备注"></el-table-column>
           <el-table-column  prop="operation"  label="操作">
             <template slot-scope="scope">
               <el-button type="text" size="small" @click="updateReader(scope.row)">修改</el-button>
               <el-button type="text" size="small" @click="deleteOne(scope.row)">删除</el-button>
             </template>
           </el-table-column>
         </el-table>
         <el-pagination
           @size-change="handleSizeChange"
           @current-change="handleCurrentChange"
           :current-page="pageNum"
           :page-sizes="[20,40,60,80]"
           :page-size="pageSize"
           layout="total, sizes, prev, pager, next, jumper"
           :total="totalPages">
         </el-pagination>
       </div>
     </section>
     <!--新增和修改弹框-->
     <el-dialog :visible.sync="dialogTableVisible" width="900px">
       <el-form ref="dialogDataFrom" :rules="rules" :model="dialogData" status-icon label-width="100px" class="flex">
         <div class="flex-1">
           <el-upload
             class="reader-avatar-uploader"
             action="/roleUser/user/v1/upload/pic"
             :show-file-list="false"
             :http-request="picSuccessUpload">
             <span class="reader-avatar_wrap">
               <img v-if="dialogData.icon" :src="dialogData.icon" class="avatar">
               <i v-else class="el-icon-plus avatar-uploader-icon"></i>
             </span>
           </el-upload>
           <el-form-item class="item" label="学号/工号" prop="stuworkNumber">
             <el-input v-model="dialogData.stuworkNumber" clearable></el-input>
           </el-form-item>
           <el-form-item class="item" label="身份证号" prop="cardNumber">
             <el-input v-model="dialogData.cardNumber" clearable @blur="idcardChange(dialogData.cardNumber)"></el-input>
           </el-form-item>
           <el-form-item label="出生日期" prop="birthday">
             <el-date-picker
               clearable
               v-model="dialogData.birthday"
               type="date"
               placeholder="选择日期"
               value-format="yyyy-MM-dd">
             </el-date-picker>
           </el-form-item>
           <el-form-item class="item" label="密码" prop="password">
             <el-input type="password" v-model="dialogData.password" clearable></el-input>
           </el-form-item>
           <el-form-item class="item" label="预付款金额" prop="prePayment">
             <el-input v-model="dialogData.prePayment" clearable></el-input>
           </el-form-item>
           <el-form-item class="item" label="欠款金额" prop="arrear">
             <el-input v-model="dialogData.arrear" clearable></el-input>
           </el-form-item>
           <el-form-item class="item" label="备注:" prop="remark">
             <el-input type="textarea" v-model="dialogData.remark"></el-input>
           </el-form-item>
         </div>
         <div class="flex-1">
           <el-form-item label="证类型" prop="readerType">
             <el-select v-model="dialogData.readerType" placeholder="证类型">
               <el-option v-for="(item,index) in readerTypeListInfo" :key="index" :label="item.label" :value="item.id"></el-option>
             </el-select>
           </el-form-item>
           <el-form-item label="年级" prop="grade">
             <el-select v-model="dialogData.grade" placeholder="年级" @change="dialogGradeChange">
               <el-option v-for="(item,index) in gradeList" :key="index" :label="item.name" :value="item.id"></el-option>
             </el-select>
           </el-form-item>
           <el-form-item label="班级" prop="classes">
             <el-select v-model="dialogData.classes" placeholder="班级">
               <el-option v-for="(child,index) in dialogGradeClassList" :key="index" :label="child.name" :value="child.id"></el-option>
             </el-select>
           </el-form-item>
           <el-form-item class="item" label="读者证号" prop="readerCardNumber">
             <el-input v-model="dialogData.readerCardNumber" clearable></el-input>
           </el-form-item>
           <el-form-item class="item" label="姓名" prop="readerName">
             <el-input v-model="dialogData.readerName" clearable></el-input>
           </el-form-item>
           <el-form-item label="性别" prop="sex">
             <el-select v-model="dialogData.sex" placeholder="性别">
               <el-option label="男" value="1"></el-option>
               <el-option label="女" value="2"></el-option>
             </el-select>
           </el-form-item>
           <el-form-item class="item" label="手机号" prop="phone">
             <el-input v-model="dialogData.phone" clearable></el-input>
           </el-form-item>
           <el-form-item label="启用日期" prop="startDate">
             <el-date-picker
               clearable
               v-model="dialogData.startDate"
               type="date"
               placeholder="选择日期"
               value-format="yyyy-MM-dd">
             </el-date-picker>
           </el-form-item>
           <el-form-item label="终止日期" prop="endDate">
             <el-date-picker
               clearable
               v-model="dialogData.endDate"
               type="date"
               placeholder="选择日期"
               value-format="yyyy-MM-dd">
             </el-date-picker>
           </el-form-item>
           <el-form-item label="办证日期" prop="createDate">
             <el-date-picker
               clearable
               v-model="dialogData.createDate"
               :disabled="addUpdateState==1"
               type="date"
               placeholder="选择日期"
               value-format="yyyy-MM-dd">
             </el-date-picker>
           </el-form-item>
           <el-form-item label="证状态" prop="status">
             <el-select v-model="dialogData.status" placeholder="证状态">
               <el-option label="禁用" value="0"></el-option>
               <el-option label="正常" value="1"></el-option>
               <el-option label="注销" value="2"></el-option>
               <el-option label="挂失" value="3"></el-option>
             </el-select>
           </el-form-item>
         </div>
       </el-form>
       <div class="tc">
         <el-button class="btn_box" type="primary" @click="onSubmit">确定</el-button>
         <el-button class="btn_box btn_wrap" @click="cancel">取消</el-button>
       </div>
     </el-dialog>
     <!--导入弹框-->
     <el-dialog :visible.sync="dialogImportVisible" title="导入读者数据" :width="'400px'">
       <el-upload
         class="upload-demo"
         drag
         ref="upload"
         action="/roleUser/user/v1/reader/readerImport"
         accept=".xls"
         multiple
         :http-request="tableDataSuccessUpload"
         :auto-upload="false"
         name="fileName">
         <i class="el-icon-upload"></i>
         <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
         <div class="el-upload__tip" slot="tip">只能上传xls文件</div>
       </el-upload>
       <div class="upload_btn_wrap">
         <el-button  round type="primary" @click="upload">点击上传</el-button>
         <el-button @click="dialogImportVisible = false" round>取 消</el-button>
       </div>
     </el-dialog>
   </div>
</template>

<script>
  import {searchGradeList,searchGradeClassList,readerList,deleteReaderInfo,readerImportPic,addModifyReader,readerDataExport,readerDataImport} from '@/request/circulationReaderManageSchool'
  import {readerCardList} from '@/request/systemSetup'
  import {timeFormat,isIdCard} from '@/methods/method'
export default {
    data() {
      var phone = (rule, value, callback) => {
        // let ph= /^1[34578]\d{9}$/;
        // let mb= /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
        let ph = /^1[34578]\d{9}$/;
        if (!value) {
          callback();
        }else {
          if(!ph.test(value)) {
            callback(new Error("手机号格式不正确，请输入正确的手机号"));
          }else {
            callback();
          }
        }
      };
      var idCard=(rule, value, callback)=>{
        if (!value) {
          callback();
        }else {
          if (!(/\d{17}[\d|x]|\d{15}/).test(value) || (value.length !== 15 && value.length !== 18)) {
            callback(new Error('身份证号码不符合规范'))
          } else {
            callback()
          }
        }
      };
      var arrear =  (rule, value, callback) => {
      var myreg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      if (!value) {
        callback();
      } else {
        if(!myreg.test(value)){
          callback(new Error("欠款金额格式不对"));
        }else {
          callback();
        }
      }
    };
    var prePayment =  (rule, value, callback) => {
      var myreg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      if (!value) {
        callback();
      } else {
        if(!myreg.test(value)){
          callback(new Error("预付款金额格式不对"));
        }else {
          callback();
        }
      }
    };
      return {
        dialogTableVisible:false,//新增和修改弹框显示与隐藏
        pageNum:1,//页码数
        pageSize:20,//每页多少条
        totalPages:0,//总页数
        gradeList:[],//年级导航的数据
        searchGradeId:'',//查询年级对应的id
        searchClassId:'',//查询年级对应的班级id
        gradeClassList:[],//年级对应的班级的数据
        activeIndex:0,//年级和班级对应的激活index
        form:{
          searchValue:'',
          searchKey:'readerCardNumber'
        },//表单数据
        tableData:[],//table数据
        readerTotalselection:[],//表格多选框选择后的数据存放点
        dialogData:{},//新增和修改弹窗表单数据
        dialogGradeClassList:[],//弹框年级对应的班级的数据
        addUpdateState:0,//新增和修改弹框的状态0:新增,1:修改
        readerTypeListInfo:[],//读者类型列表数据
        dialogImportVisible:false,//导入弹框显示与隐藏
        rules: {//新增和修改表单必填规则
          arrear: [
            {validator: arrear, trigger: 'blur' }
          ],
          birthday: [
            {message: '请选择读者生日', trigger: 'change'}
          ],
          createDate: [
            {required: true, message: '请选择办证日期', trigger: 'change' }
          ],
          endDate: [
            {required: true, message: '请选择终止日期', trigger: 'change' }
          ],
          idcard: [
            {validator: idCard,trigger: 'blur' }
          ],
          phone: [
            {validator: phone,trigger: 'blur' }
          ],
          password: [
            {required: true,message: '请输入密码', trigger: 'blur' }
          ],
          prePayment:[
            { validator: prePayment, trigger: 'blur' }
          ],
          readerCardNumber:[
            {required: true, message: '请输入读者证号码', trigger: 'blur' }
          ],
          username:[
            {required: true, message: '请输入读者姓名', trigger: 'blur' }
          ],
          sex:[
            {required: true, message: '请选择性别', trigger: 'change' }
          ],
          startDate: [
            {required: true, message: '请选择启用日期', trigger: 'change' }
          ],
          status:[
            {required: true, message: '请选择证状态', trigger: 'change' }
          ],
          readerType:[
            {required: true, message: '请选择所属部门', trigger: 'change' }
          ]
        }
      };
    },
    created(){
      this.getGradeInfo();
      this.getReaderTypeList();
    },
    methods:{
      //得到年级信息
      getGradeInfo(){
        let params={
          jsonStr:{
            pageNum:1,
            pageSize:20
          }
        };
        searchGradeList(params).then(res =>{
          if (res.data.code == 0) {
            this.gradeList=res.data.page.list;
            this.searchGradeId=this.gradeList[0].id
            this.getGradeClassInfo();
            this.getReaderInfo(this.getReaderInfoParams());
            for(let i=0;i<this.gradeList.length;i++){
              this.$set(this.gradeList[i],'ulShow',false);
            }
            this.$set(this.gradeList[0],'ulShow',true);
          } else {
            this.$message({
              type: "error",
              message: res.data.msg,
              duration:1000
            });
          }
        });
      },
      //得到班级信息
      getGradeClassInfo(){
        let params={
          jsonStr:{
            pageNum:this.pageNum,
            pageSize:this.pageSize,
            gradeId:this.searchGradeId
          }
        };
        searchGradeClassList(params).then(res => {
          if (res.data.code == 0){
            this.gradeClassList=res.data.page.list;
            for(let i=0;i<this.gradeClassList.length;i++){
              this.$set(this.gradeClassList[i],'liShow',false);
            }
          } else {
            this.$message({
              type: "error",
              message: res.data.msg,
              duration:1000
            });
          }
        });
      },
      getReaderInfoParams(){
        let params={
          page:this.pageNum,
          pageSize:this.pageSize,
          grade:this.searchGradeId,
          classes:this.searchClassId
        };
        return params;
      },
      getSearchReaderInfoParams(){
        let params={
          page:this.pageNum,
          pageSize:this.pageSize
        };
        this.$set(params,this.form.searchKey,this.form.searchValue);
        return params;
      },
      //得到读者信息
      getReaderInfo(params){
        readerList(params).then(res => {
          if (res.data.code == 0) {
            this.totalPages=Number(res.data.page.total);
            this.tableData=res.data.page.list;
            for(let i=0;i<this.tableData.length;i++){
              this.$set(this.tableData[i],'startDate',timeFormat(this.tableData[i].startDate));
              this.$set(this.tableData[i],'endDate',timeFormat(this.tableData[i].endDate));
              this.$set(this.tableData[i],'createDate',timeFormat(this.tableData[i].createDate));
            }
          }else{
            this.$message({
              type: "error",
              message: res.data.msg,
              duration:1000
            });
          }
        });
      },
      //得到弹框年级对应的班级信息
      getDialogGradeClassInfo(id){
        let params={
          jsonStr:{
            pageNum:this.pageNum,
            pageSize:this.pageSize,
            gradeId:Number(id)
          }
        };
        searchGradeClassList(params).then(res => {
          if (res.data.code == 0){
            this.dialogGradeClassList=res.data.page.list;
          } else {
            this.$message({
              type: "error",
              message: res.data.msg,
              duration:1000
            });
          }
        });
      },
      //得到弹框读者类型列表
      getReaderTypeList(){
        let params= {
          pageNum: 1,
          pageSize: 20
        };
        readerCardList(params).then(res => {
          if (res.data.code == 0){
            this.readerTypeListInfo=res.data.page.list;
           } else {
            this.$message({
              type: "error",
              message: res.data.msg,
              duration:1000
            });
          }
        });
      },
      handleSizeChange(val) {
        this.pageSize=val;//每页多少条
        this.getReaderInfo(this.getReaderInfoParams());
      },
      handleCurrentChange(val) {
        this.pageNum=val;//页码数
        this.getReaderInfo(this.getReaderInfoParams());
      },
      //选择的读者的条数
      readerTotalChange(sels){
        this.readerTotalselection=sels;
      },
      //查询读者信息
      searchReader(){
        this.pageNum=1;//页码数
        this.pageSize=20;//每页多少条
        this.getReaderInfo(this.getSearchReaderInfoParams());
      },
      //批量删除数据
      deleteSome(){
        this.$confirm('确认要删除这'+this.readerTotalselection.length+'条数据吗?','警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          let params=[];
          for(let val of this.readerTotalselection){
            params.push({id:val.id});
          }
          deleteReaderInfo(params).then(res=>{
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '删除成功!',
                duration:1000
              });
              this.getReaderInfo(this.getReaderInfoParams());
            }else {
              this.$message({
                type: "error",
                message: res.data.msg,
                duration:1000
              });
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除!',
            duration:1000
          });
        });
      },
      //增加
      addReader(){
        this.dialogData={};
        this.addUpdateState=0;//新增和修改弹框的状态0:新增,1:修改
        this.dialogTableVisible=true;
        this.$nextTick(()=>{
          this.$refs.dialogDataFrom.clearValidate();
        });
        this.$set(this.rules,'password',[{required:true,message:'请输入密码',trigger:'blur'}]);
        this.$set(this.dialogData,'prePayment',0);
        this.$set(this.dialogData,'arrear',0);
        this.$set(this.dialogData,'status','1');
        this.$set(this.dialogData,'startDate',this.showToDay());
        this.$set(this.dialogData,'createDate',this.showToDay());
        this.$set(this.dialogData,'endDate',this.showToAddYear());
        this.getDialogGradeClassInfo(this.searchGradeId);
        for(let i=0;i<this.gradeList.length;i++){
          if(this.searchGradeId==this.gradeList[i].id){
            this.$set(this.dialogData,'grade',this.gradeList[i].id);
          }
        }
        if(this.searchClassId) {
          for (let j=0; j<this.gradeClassList.length;j++) {
            if(this.searchClassId==this.gradeClassList[j].id){
              this.$set(this.dialogData,'classes',this.gradeClassList[j].id);
            }
          }
        }
      },
      //修改
      updateReader(row){
         this.addUpdateState=1;//新增和修改弹框的状态0:新增,1:修改
         this.dialogTableVisible=true;
         this.dialogData={
          id:row.id,
          readerCardNumber:row.readerCardNumber,
          username:row.username,
          sex:row.sex,
          cardNumber:row.cardNumber,
          birthday:row.birthday,
          phone:row.phone,
          password:row.password,
          readerType:row.readerType,
          grade:row.grade,//需要确认
          classes:row.classes,//需要确认
          stuworkNumber:row.stuworkNumber,//需要确认
          startDate:row.startDate,
          endDate:row.endDate,
          createDate:row.createDate,
          status:row.status,
          icon:row.icon,
          prePayment:row.prePayment,
          arrear:row.arrear,
          remark:row.remark
         };
         this.$set(this.rules,'password','');
         if(row.classes==0){
           this.$set(this.dialogData,'classes','');
         }
         this.getDialogGradeClassInfo(row.grade);
      },
      //删除单条数据
      deleteOne(row){
        this.$confirm('确认要删除这条数据吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          for(let i in this.tableData){
            if(this.tableData[i].id==row.id){
              let params=[{id:row.id}];
              deleteReaderInfo(params).then(res=>{
                if (res.data.code == 0) {
                  this.$message({
                    type: 'success',
                    message: '删除成功!',
                    duration:1000
                  });
                    this.getReaderInfo(this.getReaderInfoParams());
                }else {
                  this.$message({
                    type: "error",
                    message: res.data.msg,
                    duration:1000
                  });
                }
              });
            }
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除!',
            duration:1000
          });
        });
      },
      //导出读者数据
      exportReaderData(){
        let params={
          grade:this.searchGradeId,
          readerCardNumber:this.form.searchValue,
          classes:this.searchClassId
        };
        this.$set(params,this.form.searchKey,this.form.searchValue);
        this.$confirm('是否要导出这'+this.totalPages+'条读者数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          readerDataExport(params).then(res=>{
            if(res.data.code==0){
              window.open(res.data.url);
              this.$message({
                type: 'success',
                message: '导出成功!正在下载，请稍后..',
                duration:'1000'
              });
            }else{
              this.$message({
                type: 'info',
                message: res.data.msg,
                duration:'1000'
              });
            }
          }).catch(err=>{
            this.$message({
              type: 'info',
              message: err,
              duration:1000
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消导出!',
            duration:1000
          });
        });
      },
      //导入数据
      importReaderData(){
        this.dialogImportVisible=true;
      },
      //上次成功事件和读者数据上传
      tableDataSuccessUpload(response){
        let formData = new FormData();
        formData.append('file', response.file);
        readerDataImport(formData).then(res=>{
          if(res.data.code==0){
            response.onSuccess();
            this.getReaderInfo(this.getReaderInfoParams());
            this.$message({
              type: 'success',
              message: '上传成功!',
              duration:1000
            });
          }else{
            response.onError()
            this.$message({
              type: 'error',
              message: res.data.msg,
              duration:1000
            });
          }
        })
      },
      //上传事件
      upload(){
        this.$refs.upload.submit();
      },
      //上次成功事件和图片上传
      picSuccessUpload(response){
        let formData = new FormData()
        formData.append('file', response.file)
        readerImportPic(formData).then(res=>{
          if(res.data.code==0){
            this.$set(this.dialogData,'icon',res.data.url);
            response.onSuccess()
            this.$message({
              type: 'success',
              message: '上传成功!',
              duration:1000
            });
          }else{
            response.onError()
            this.$message({
              type: 'error',
              message: res.data.msg,
              duration:1000
            });
          }
        })
      },
      //年级和班级导航的变色和显隐
      gradeClassHS(){
        for(let i=0;i<this.gradeList.length;i++){
          this.$set(this.gradeList[i],'ulShow',false);
        }
        for(let j=0;j<this.gradeClassList.length;j++){
          this.$set(this.gradeClassList[j],'liShow',false);
        }
      },
      onShow(index,id){
        this.pageNum=1;//页码数
        this.pageSize=20;//每页多少条
        this.searchGradeId=id;//年级对应的id
        this.searchClassId='';//班级对应的id
        this.getGradeClassInfo();
        this.getReaderInfo(this.getReaderInfoParams());
        this.gradeClassHS();
        this.$set(this.gradeList[index],'ulShow',true);
        let liEleAll=document.querySelectorAll('.one_menuli');
        for(let i=0;i<liEleAll.length;i++){
          let liEleP=liEleAll[i].querySelectorAll('p')[0];
          liEleP.style.color="#303133";
        }
        let liEle=liEleAll[index];
        let liEleP=liEle.querySelectorAll('p')[0];
        liEleP.style.color="#409EFF";
      },
      onActive(index,indexA,id){
        this.searchClassId=id;
        this.pageNum=1;//页码数
        this.pageSize=20;//每页多少条
        this.getReaderInfo(this.getReaderInfoParams());
        this. gradeClassHS();
        this.$set(this.gradeList[index],'ulShow',true);
        this.$set(this.gradeClassList[indexA],'liShow',true);
        let liEle=document.querySelectorAll('.one_menuli')[index];
        let liEleP=liEle.querySelectorAll('p')[0];
        liEleP.style.color="#303133";
      },
      //弹框的年级变化时对应的班级信息
      dialogGradeChange(val){
        this.$set(this.dialogData,'classes','');
        this.getDialogGradeClassInfo(val);
      },
      //身份证输入框失去焦点时，新增时自动填写出生年月日和密码是出生年月日(要真实的身份证)
      idcardChange(cardNumber){
        if ((/\d{17}[\d|x]|\d{15}/).test(cardNumber.trim()) && (cardNumber.trim().length == 15 || cardNumber.trim().length == 18)){
          //区位码校验
          //出生年月日校验   前正则限制起始年份
          let  year = cardNumber.substr(6, 4);//身份证年
          let  month = cardNumber.substr(10, 2);//身份证月
          let  date = cardNumber.substr(12, 2);//身份证日
          let  time =year+'-'+month+'-'+date;//身份证日期时间date
          let  timeA =year+month+date;//身份证日期时间date
          this.$set(this.dialogData,'birthday',time);
          this.$set(this.dialogData,'password',timeA);
        }else{
          this.$set(this.dialogData,'birthday','');
          this.$set(this.dialogData,'password','');
        }
      },
      //利用js 获取本日时间代码
      showToDay(){
        let Nowdate=new Date();
        let M=Number(Nowdate.getMonth())+1
        return Nowdate.getFullYear()+"-"+M+"-"+Nowdate.getDate();
      },
      //利用js 获取当前日期加一年时间代码
      showToAddYear(){
        let Nowdate=new Date();
        let M=Number(Nowdate.getMonth())+1
        return Nowdate.getFullYear()+1+"-"+M+"-"+Nowdate.getDate();
      },
      //新增和修改数据提交
      onSubmit(){
        let params=this.dialogData;
        //新增和修改弹框的状态0:新增,1:修改
        if(this.addUpdateState==0){
          this.$refs.dialogDataFrom.validate((valid) => {
            if (valid) {
              addModifyReader(params).then(res=>{
                if(res.data.code==0){
                  this.getReaderInfo(this.getReaderInfoParams());
                  this.$message({
                    type: 'success',
                    message: '新增成功',
                    duration:1000
                  });
                  this.dialogTableVisible=false;
                }else{
                  this.$message({
                    type: 'error',
                    message: res.data.msg,
                    duration:1000
                  });
                }
              });
            }
          });
        }else if(this.addUpdateState==1){
          this.$refs.dialogDataFrom.validate((valid) => {
            if (valid){
              addModifyReader(params).then(res=>{
                if(res.data.code==0){
                  this.getReaderInfo(this.getReaderInfoParams());
                  this.$message({
                    type: 'success',
                    message: '修改成功',
                    duration:1000
                  });
                  this.dialogTableVisible=false;
                }else{
                  this.$message({
                    type: 'error',
                    message: res.data.msg,
                    duration:1000
                  });
                }
              })
            }
          });
        }
      },
      cancel(){
        this.dialogTableVisible=false;
        this.$nextTick(()=>{
          this.$refs.dialogDataFrom.resetFields();
        })
      }
    }
  };
</script>

<style scoped>
  .item{
    width:320px;
  }
  .reader-avatar-uploader{
    text-align:center;
    margin-bottom:30px;
  }
  .reader-avatar_wrap{
    display: inline-block;
    width: 178px;
    height: 178px;
    line-height:178px;
    overflow:hidden;
    border: 1px dashed #d9d9d9;
  }
  .reader-avatar-uploader .avatar{
    width: 100%;
    height: 100%;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  #nav>li{
    position:relative;
    width: 100px;
    list-style: none;
    font-size:14px;
    color: #303133;
  }
 #nav>li p:hover,.class_wrap>li:hover{
    color: #409EFF;
  }
  #nav>li p{
    height:40px;
    line-height:40px;
  }
  .class_wrap{
    width: 100px;
    margin: 0 auto;
  }
  .class_wrap>li{
    height:40px;
    line-height:40px;
    padding:0 10px;
    margin:0;
  }
  #nav>li p.actived{
   color: #409EFF;
 }
  .class_wrap>li.actived{
    color: #409EFF;
  }
  .btn_box{
    width:100px;
  }
  .btn_wrap{
    margin-left:200px;
  }
  .upload_btn_wrap{
    margin-top:20px;
  }
</style>
