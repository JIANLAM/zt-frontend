<template>
	<div>
		<el-form :inline="true">
			<el-form-item label="起止时间" v-if="searchButton">
				<el-date-picker
				v-model="picker"
				type="datetimerange"
				:picker-options="pickerOptions2"
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				:default-time="['12:00:00']"
		        value-format="yyyy-MM-dd HH:mm:ss"
				clearable>
				</el-date-picker>
			</el-form-item>
            <el-form-item>
               <span v-for="(item,index) in power" :key="index">
                  <el-button v-if="item.name.trim()=='检索'" type="primary"  icon="el-icon-search" @click="searchData">筛选</el-button>
                  <el-button v-if="item.name.trim()=='新增'" type="danger"  icon="el-icon-plus" @click="pushData('add')">发布资讯</el-button>
                  <el-button v-if="item.name.trim()=='删除'" type="warning" :disabled="deleteIds.length==0" icon="el-icon-error" @click="deleteData('more',0)">批量删除</el-button>
               </span>
            </el-form-item>
		</el-form>
		<!-- <el-checkbox-group v-model="checkedAllcheckedAll" > -->
		<el-card class="box-card" v-for="item in data" :key="item.id" shadow="hover" style="marginBottom:10px;">
			<el-col :span="1" class="libraryInformation" >
        <span v-for="(item2,index2) in power" :key="index2" >
        <el-checkbox :label="item.id" size="me" v-model="deleteIds" v-if="item2.name.trim()=='删除'">{{ }}</el-checkbox>
                </span>
			</el-col>

			<el-col :span="23">
				<div slot="header" class="clearfix">
		        <span class="title">{{item.title}}</span>
			    <span style="float:right">

			    </span>
		   </div>
		   <!-- <div class="date" style="margin-bottom:15px">
			    <span>{{item.orgName}}</span>&nbsp;
				<span>{{item.createTime}}</span>
			</div> -->
			<div class="noticeTitle">
				<span style="color: #666666;font-size: 18px">{{item.orgName}}</span>
				<span class="rightTime">{{item.createTime}}</span>
			</div>
		 <p style="lineHeight:1.5;color:#666666;max-height: 300px;overflow: hidden;" v-html="item.content"> /p>
		<div class="footer clearfix">
			<span style="text-align: left; color: #FFB43F">阅读:  {{item.lookCount }}</span>
			<div class="box">
				<el-button @click="detail(item.id)" type="primary" size="small" round>查看详情</el-button>
        <span v-for="(item2,index2) in power" :key="index2">
            <el-button v-if="item2.name.trim()=='修改'" @click="pushData(item)" type="warning" size="small" round>修改资讯</el-button>
            <el-button v-if="item2.name.trim()=='删除'" @click="deleteData('one',item.id)" type="danger" size="small" round>删除资讯</el-button>
        </span>
			</div>
		</div>
		</el-col>

		</el-card>
		<!-- </el-checkbox-group> -->
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

	<!-- 详情 -->
    	<dia-log :visible.sync="visible1" title="资讯详情" style="padding:0;">
	    	<div class="container2">
				<div class="title2">{{detailData.title}}</div>
				<div class="author2">{{detailData.orgName}}&nbsp;&nbsp;&nbsp;&nbsp;{{detailData.createTime}}</div>
				<div class="img"><img :src="detailData.libNewsImg"></div>
				<div class="content2" v-html="detailData.content"></div>
	 </div>
	  </dia-log>
    <!--发布资讯 -->
    	<dia-log :visible.sync="visible2" :title="diaTitle" style="padding:0;">
	    	<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="资讯标题" prop="title">
                   <el-input v-model="ruleForm.title"></el-input>
                </el-form-item>
				<el-form-item label="资讯内容" prop="content" >
					<vue-editor v-model="ruleForm.content"  :editorToolbar="customToolbar"></vue-editor>
				</el-form-item>
				<el-form-item label="资讯图片" prop="libNewsImg">
          <el-upload
            class="reader-avatar-uploader"
            action="/roleUser/user/v1/upload/pic"
            :show-file-list="false"
            :http-request="successUpload">
           <span class="reader-avatar_wrap">
             <img v-if="ruleForm.libNewsImg" :src="ruleForm.libNewsImg" class="avatar">
           </span>
          </el-upload>
          </el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')">{{this.diaTitle=='发布资讯'?'立即创建':'立即修改'}}</el-button>
					<el-button @click="resetForm('ruleForm')">重置</el-button>
				</el-form-item>
</el-form>
	   </dia-log>


	</div>
</template>

<script>
import {getData} from '@/methods/method'
import DiaLog from '@/components/Dialog'
import { VueEditor } from 'vue2-editor'
import {acqbookList,deletebookList,acqbookListDetail,lookNumber,newLibraryInformation,deleteInfo} from '@/request/libraryInfo'
import {readerImportPic} from '@/request/systemSetup'
  export default{
	components:{
  		DiaLog,
		VueEditor
  	},
  	data(){
  		return {
			form:{
				startTime:"",
				closureTime:"",
				pageSize:10,
  				pageNum:1
			},
			deleteIds:[],
			 ruleForm: {
				title: '',
				libNewsImg: '',
				content: '',
			},
			rules: {
				title: [
					{ required: true, message: '请输入资讯标题', trigger: 'blur' }
				],
				content: [
					{ required: true, message: '请输入资讯内容', trigger: 'blur' }
				]
				},
					data:[],
			detailData:[],
			visible1:false,
			visible2:false,
			diaTitle:'',
			pickerOptions2: {
                shortcuts: [{
					text: '最近一周',
					onClick(picker) {
					const end = new Date();
					const start = new Date();
					start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
					picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
				onClick(picker) {
					const end = new Date();
					const start = new Date();
					start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
					picker.$emit('pick', [start, end]);
					}
          }, {
            text: '最近三个月',
                onClick(picker) {
					const end = new Date();
					const start = new Date();
					start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
					picker.$emit('pick', [start, end]);
            }
          }]
        },
			picker:[],
			checkedAll:[],
			dataPage:{},
			customToolbar: [
				[{ 'size': ['small', false, 'large', 'huge'] }],
				[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
				['bold', 'italic', 'underline'],
				[{ 'list': 'ordered'}, { 'list': 'bullet' }],
				[{ 'script': 'sub'}, { 'script': 'super' }],
				[{ 'indent': '-1'}, { 'indent': '+1' }],
				[{ 'direction': 'rtl' }],
				[{ 'color': [] }, { 'background': [] }],
				[{ 'font': [] }],
				[{ 'align': [] }]
          ],
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
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
			   if (valid) {
			newLibraryInformation(this.ruleForm).then(data=>{
	        		if(data.data.code==0){
		  				 this.$message({
				            type: 'success',
				            message: this.diaTitle+'成功!'
						});
						this.visible2=false;
		  				this.getData();
	  				}else{
	  					this.$message({
				            type: 'error',
				            message: data.data.msg
				          });
	  				}


	  			})
			} else {
				// console.log('error submit!!');
				return false;
			}
        });
      },
      resetForm(formName) {
        this.ruleForm={
          title: '',
          libNewsImg: '',
          content: '',
        }
      },
		 //获取数据
        getData(data=this.form){
            getData.call(this,acqbookList,data);
        },
        searchData(){
            this.getData(this.form);
		},
		 //分页事件
        handleSizeChange(val) {
            this.form.pageSize=val;
            this.getData();
        },
        handleCurrentChange(val) {
            this.form.pageNum=val;
            this.getData();
	   },
	    deleteData(first,second){
			let obj,content;
			if(first=="more"){
                content="all"
				obj=this.deleteIds.join(",")
			}else{
				obj=second
			}
            this.$confirm(content=="all"?('是否删除'+this.deleteIds.length+'条资讯'):'是否删除此条资讯？', '提示', {
		        confirmButtonText: '确定',
		        cancelButtonText: '取消',
		        type: 'warning'
	        }).then(() => {
	        	deleteInfo(obj).then(data=>{
	        		if(data.data.code==0){
		  				 this.$message({
				            type: 'success',
				            message: '删除资讯成功!'
						});
						   this.deleteIds=[];
		  				  this.getData();
	  				}else{
	  					this.$message({
				            type: 'error',
				            message: data.data.msg
				          });
	  				}


	  			})
	        }).catch(() => {

	        });



	   },
	   detail(id){
		   this.visible1=true;
		   acqbookListDetail(id).then(data=>{
	        		if(data.data.code==0){
						this.detailData=data.data.libNewsVoObj;
						// 阅读量加1
						// let obj={libNewsId:id,readerId:1}
						// lookNumber(obj)
	  				}else{
	  					this.$message({
				            type: 'error',
				            message: data.data.msg
				          });
	  				}


	  			})
	   },
	//    发布资讯
	   pushData(value){
           this.visible2=true;
       this.$nextTick(()=>{
         this.$refs.ruleForm.clearValidate();
       });
           if(value=="add"){
			this.diaTitle="发布资讯";
			this.ruleForm={
					title: '',
					libNewsImg: '',
					content: '',
				}
		   }else{
			   this.diaTitle="修改资讯";
				this.ruleForm={
					title: value.title,
					libNewsImg: value.libNewsImg,
					content: value.content,
					id:value.id
				}
		   }
	   },
    //上次成功事件和图片上传
    successUpload(response){
      let formData = new FormData()
      formData.append('file', response.file)
      readerImportPic(formData).then(res=>{
        if(res.data.code==0){
          this.ruleForm.libNewsImg =res.data.url;
          response.onSuccess();
          this.$message({
            type: 'success',
            message: '上传成功!'
          });
        }else{
          response.onError();
          this.$message({
            type: 'error',
            message: res.data.msg
          });
        }
      })
    },
	},
	created(){
        this.getPowerArr();
        this.getData();
  	},
	watch:{
  		picker(newVal){
  			if(newVal&&newVal.length>0){
	  			this.form.startTime=newVal[0];
	  			this.form.closureTime=newVal[1];
  			}else{
  				this.form.startTime='';
  				this.form.closureTime='';
  			}
  		}
  	},
	filters:{
		reduce:function(value){
            if(value.length>200){
				let str=value.substr(0,200)+"...";
				return  str
			}else{
				return value
			}
		}
	}
  }

</script>

<style type="style/css" scoped>
.clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }

  .clearfix:after {
      clear: both
  }
	.footer{
		margin: 25px 0 15px ;
	}
	.box{
		float: right;
		display: inline-block;
		font-size: 14px;
		color:#f85959
	}
	.date{
		margin-bottom: 10px;
		color: #777;
		font-size: 14px
	}
	.title{
		font-size: 20px;
		font-weight: bold
	}
    .title2{font-size: 24px;color: #222; letter-spacing: 1px;}
	.author2{color:#777;margin-top: 22px;margin-bottom: 20px;font-size: 15px;}
	.content2{font-size: 14px;line-height: 28px}
	.img{width: 150px;margin: 20px auto}
	.img img{width: 150px;}
	.box span{margin-right: 20px }
.reader-avatar_wrap{
  display: inline-block;
  width: 158px;
  height: 158px;
  line-height:158px;
  overflow:hidden;
  border: 1px dashed #d9d9d9;
}
.reader-avatar-uploader .avatar{
  width: 100%;
  height: 100%;
}
.noticeTitle{
	height: 38px;
	line-height: 15px;
	border-bottom: none;
	border-left: none;
}
.rightTime{
	float: right;
	font-size: 14px;
	color: #999;
}
</style>
<style>
 .libraryInformation .el-checkbox__inner{
		width: 20px;
		height: 20px;
	}
	.libraryInformation .el-checkbox__inner::after{
		height: 12px;
		left: 7px;
	}
</style>

