<template>
    <div id="readerinformationManagement">
      <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item >
              <el-input v-model="form.searchValue" clearable>
                <el-select v-model="form.searchKey" slot="prepend" :style="{width:'150px'}">    
                  <el-option label="读者证号" value="readerCardNumber"></el-option>
                  <el-option label="读者姓名" value="username"></el-option>
                  <el-option label="身份证号" value="cardNumber"></el-option>
                </el-select>
              </el-input>
          </el-form-item>
          <span v-for="(item,index) in power" :key="index">
             <el-button v-if="item.name.trim()=='检索'" type="primary" icon="el-icon-search" @click="searchReader">查询</el-button>
             <el-button v-if="item.name.trim()=='删除'" type="danger" icon="el-icon-delete"  :disabled="readerTotalselection.length==0" @click="deleteSome">删除</el-button>
             <el-button v-if="item.name.trim()=='新增'" type="success" icon="el-icon-plus" @click="addReader">新增</el-button>
          </span>
      </el-form>
      <el-table
          :data="tableData"
          border
          @selection-change="readerTotalChange"
          style="width: 100%">
          <el-table-column  type="selection" width="50"></el-table-column>
          <el-table-column  prop="readerCardNumber"  label="读者证号"></el-table-column>
          <el-table-column  prop="username" label="姓名"> </el-table-column>
          <el-table-column  prop="sex" label="性别">
            <template slot-scope="scope">
              <span v-if="scope.row.sex == 1">男</span>
              <span v-if="scope.row.sex == 2">女</span>
            </template>
          </el-table-column>
          <el-table-column  prop="readerType"  label="读者证类型">
            <template slot-scope="scope">
              <span v-for="(item,index) in readerTypeListInfo" :key="index" v-if="item.id==scope.row.readerType">{{item.label}}</span>
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
        <el-table-column  prop="email"  label="邮箱地址"></el-table-column>
          <el-table-column  prop="phone" label="手机号"></el-table-column>
          <el-table-column  prop="startDate"  label="启用日期"></el-table-column>
          <el-table-column  prop="endDate"  label="终止日期"></el-table-column>
          <el-table-column  prop="prePayment"  label="预付款金额"></el-table-column>
          <el-table-column  prop="arrear"  label="欠款金额"></el-table-column>
          <el-table-column  prop="operation"  label="操作">
            <template slot-scope="scope">
              <span v-for="(item,index) in power" :key="index">
                <el-button v-if="item.name.trim()=='修改'" type="text" size="small" @click="updateReader(scope.row)">修改</el-button>
                <el-button v-if="item.name.trim()=='删除'" type="text" size="small" @click="deleteOne(scope.row)">删除</el-button>
              </span>
            </template>
          </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[20,40,60,80]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPages">
      </el-pagination>
      <!--弹框-->
      <el-dialog :visible.sync="dialogTableVisible" width="900px">
       <el-form ref="dialogDataFrom" :rules="rules" :model="dialogData" label-width="100px" status-icon  class="flex">
         <div class="flex-1">
           <el-upload
             class="reader-avatar-uploader"
             action="/roleUser/user/v1/upload/pic"
             :show-file-list="false"
             :http-request="successUpload">
             <span class="reader-avatar_wrap">
               <img v-if="dialogData.icon" :src="dialogData.icon" class="avatar">
               <i v-else class="el-icon-plus avatar-uploader-icon"></i>
             </span>
           </el-upload>
           <el-form-item class="item" label="身份证号" prop="cardNumber">
             <el-input v-model="dialogData.cardNumber" size="medium" clearable  @blur="idcardChange(dialogData.cardNumber)"></el-input>
           </el-form-item>
           <el-form-item label="出生日期"  prop="birthday">
             <el-date-picker
               clearable
               v-model="dialogData.birthday"
               type="date"
               size="medium"
               placeholder="选择日期"
               value-format="yyyy-MM-dd">
             </el-date-picker>
           </el-form-item>
           <el-form-item class="item" label="密码" prop="password">
             <el-input type="password" autocomplete="new-password" v-model="dialogData.password"  clearable></el-input>
           </el-form-item>
           <el-form-item class="item" label="邮箱地址:" prop="email">
             <el-input v-model="dialogData.email"></el-input>
           </el-form-item>
           <el-form-item class="item" label="预付款金额" prop="prePayment">
             <el-input v-model.number="dialogData.prePayment" clearable></el-input>
           </el-form-item>
           <el-form-item class="item" label="欠款金额" prop="arrear">
             <el-input v-model.number="dialogData.arrear" clearable></el-input>
           </el-form-item>
         </div>
         <div class="flex-1">
           <el-form-item label="读者证类型" prop="readerType">
             <el-select v-model="dialogData.readerType" placeholder="读者证类型">
               <el-option v-for="(item,index) in readerTypeListInfo" :key="index" :label="item.label" :value="item.id.toString()"></el-option>
             </el-select>
           </el-form-item>
           <el-form-item class="item" label="读者证号" prop="readerCardNumber">
             <el-input v-model="dialogData.readerCardNumber" :disabled="addUpdateState==1" clearable></el-input>
           </el-form-item>
           <el-form-item class="item" label="姓名" prop="username">
             <el-input v-model="dialogData.username" clearable></el-input>
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
           <el-form-item class="item" label="备注:" prop="remark">
             <el-input type="textarea" v-model="dialogData.remark"></el-input>
           </el-form-item>
         </div>
       </el-form>
        <div class="tc">
          <el-button class="btn_box" type="primary" @click="onSubmit">确定</el-button>
          <el-button class="btn_box btn_wrap" @click="cancel">取消</el-button>
        </div>
     </el-dialog>
    </div>
</template>

<script>
  import {readerList,deleteReaderInfo,readerImportPic,addModifyReader} from '@/request/circulationReaderManageSchool'
  import {readerCardList} from '@/request/systemSetup'
  import {timeFormat} from '@/methods/method'
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
    var email = (rule, value, callback) => {
      var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      if (!value) {
        callback();
      } else {
        if(!myreg.test(value)){
          callback(new Error("邮箱格式不对！"));
        }else {
          callback();
        }
      }
    };
    var arrear =  (rule, value, callback) => {
      var myreg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      if (!value) {
        callback();
      }else {
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
    var readerCardNumber=(rule, value, callback)=>{
      var myreg = /^[0-9a-zA-Z]*$/g;
      if (!value||value.trim()==''){
        callback(new Error('请输入读者证号'));
      } else if(!myreg.test(value)){
        callback(new Error("读者证号格式不对，只能输入数字或者字母"));
      }else {
        callback();
      }
    }
    return {
      page:1,//页码数
      pageSize:20,//每页多少条
      totalPages:0,//总页数
      power:[],//按钮权限数组
      form:{
        searchValue:'',
        searchKey:'readerCardNumber'
      },//表单数据
      tableData: [],//table数据
      readerTotalselection:[],//表格多选框选择后的数据存放点
      dialogTableVisible:false,//弹框显示与隐藏
      dialogData:{},//新增和修改弹窗表单数据
      addUpdateState:0,//新增和修改弹框的状态0:新增,1:修改
      readerTypeListInfo:[],//读者类型列表数据
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
        cardNumber: [
          {validator: idCard,trigger: 'blur' }
        ],
        phone: [
          {validator: phone,trigger: 'blur' }
        ],
        prePayment:[
          { validator: prePayment, trigger: 'blur' }
        ],
        readerCardNumber:[
          { required: true,validator:readerCardNumber,trigger: 'blur' }
        ],
        username:[
          { required: true, message: '请输入读者姓名', trigger: 'blur' }
        ],
        sex:[
          {required:true,message:'请选择性别',trigger:'change'}
        ],
        startDate: [
          {required: true, message: '请选择启用日期', trigger: 'change' }
        ],
        status:[
          {required: true, message: '请选择证状态', trigger: 'change' }
        ],
        readerType:[
          {required: true, message: '请选择读者证类型', trigger: 'change' }
        ],
        email: [
          { validator: email, trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getReaderInfo(this.getReaderInfoParams());
    this.getReaderTypeList();
    this.getPowerArr();
  },
  methods:{
    //得到权限按钮数组
    getPowerArr(){
      let  obj;
      let  power =this.$route.meta.power;
      for(let i=0,len=power.length;i<len;i++){
        if(power[i].name=='检索'){
           obj=power[0];
           power[0]=power[i];
           power[i]=obj
        }
      }
      this.power=power;
    },
    getReaderInfoParams(){
      let params={
        jsonStr:{
          page:this.page,
          pageSize:this.pageSize
        },
        pageNum:this.page,
        pageSize:this.pageSize
      };
      return params;
    },
    getSearchReaderInfoParams(){
      let params={
        jsonStr:{
          page:this.page,
          pageSize:this.pageSize
        },
        pageNum:this.page,
        pageSize:this.pageSize
      };
      this.$set(params.jsonStr,this.form.searchKey,this.form.searchValue.trim());
      return params;
    },
    //得到读者信息
    getReaderInfo(params){
      readerList(params).then(res =>{
        if (res.data.code == 0) {
          this.totalPages=Number(res.data.page.total);
          this.tableData=res.data.page.list;
          for(let i=0;i<this.tableData.length;i++){
            this.$set(this.tableData[i],'startDate',timeFormat(this.tableData[i].startDate));
            this.$set(this.tableData[i],'endDate',timeFormat(this.tableData[i].endDate));
            this.$set(this.tableData[i],'createDate',timeFormat(this.tableData[i].createDate));
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
    //查询读者信息
    searchReader(){
      this.page=1;//页码数
      this.pageSize=20;//每页多少条
      this.getReaderInfo(this.getSearchReaderInfoParams());
    },
    //选择的读者的条数
    readerTotalChange(sels){
      this.readerTotalselection=sels;
    },
    //上次成功事件和图片上传
    successUpload(response){
      let formData = new FormData()
      formData.append('file', response.file)
      readerImportPic(formData).then(res=>{
        if(res.data.code==0){
          this.$set(this.dialogData,'icon',res.data.url);
          response.onSuccess();
          this.$message({
            type: 'success',
            message: '上传成功!',
            duration:1000
          });
        }else{
          response.onError();
          this.$message({
            type: 'error',
            message: res.data.msg,
            duration:1000
          });
        }
      })
    },
    //修改时判断弹框读者的读者证类型的值
    dialogReaderTypeName(readerTypeName){
      return readerTypeListInfo[Number(readerTypeName)-1].label
    },
    //得到弹框读者类型列表
    getReaderTypeList(){
      let params= {
        page: 1,
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
      this.page=val;//页码数
      this.getReaderInfo(this.getReaderInfoParams());
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
      this.$set(this.dialogData,'prePayment','0');
      this.$set(this.dialogData,'arrear','0');
      this.$set(this.dialogData,'status','1');
      this.$set(this.dialogData,'startDate',this.showToDay());
      this.$set(this.dialogData,'createDate',this.showToDay());
      this.$set(this.dialogData,'endDate',this.showToAddYear());
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
         readerType:row.readerType.toString(),
         startDate:row.startDate,
         endDate:row.endDate,
         createDate:row.createDate,
         status:row.status,
         icon:row.icon,
         prePayment:row.prePayment,
         arrear:row.arrear,
         remark:row.remark,
         email:row.email
       };
       this.$set(this.rules,'password',[{message:'请输入密码',trigger:'blur'}]);
       this.$set(this.rules,'password','');
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
    //身份证输入框失去焦点时，新增时自动填写出生年月日和密码是出生年月日(要真实的身份证)
    idcardChange(cardNumber){
      cardNumber=cardNumber?cardNumber.toString().trim():'';
      if ((/\d{17}[\d|x]|\d{15}/).test(cardNumber) && (cardNumber.length == 15 || cardNumber.length == 18)) {
        let  year = cardNumber.substr(6, 4);//身份证年
        let  month = cardNumber.substr(10, 2);//身份证月
        let  date = cardNumber.substr(12, 2);//身份证日
        let  time =year+'-'+month+'-'+date;//身份证日期时间date
        let  timeA =year+month+date;//身份证日期时间date
        this.$set(this.dialogData,'birthday',time);
        this.$set(this.dialogData,'password',timeA);
      }else {
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
        this.$refs.dialogDataFrom.validate((valid) =>{
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
          if (valid) {
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
}
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
  .btn_box{
    width:100px;
  }
  .btn_wrap{
    margin-left:200px;
  }
</style>
