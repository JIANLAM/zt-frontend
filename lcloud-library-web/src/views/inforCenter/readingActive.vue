<template>
	<div class="container">
		<el-form :inline="true">
      <el-form-item>
        <span v-for="(item,index) in power" :key="index">
          <el-button v-if="item.name.trim()=='新增'" type="primary"  icon="el-icon-plus" @click="pushData('add')">发布活动</el-button>
          <el-button  v-if="item.name.trim()=='删除'" type="warning" :disabled="deleteIds.length==0" icon="el-icon-error" @click="deleteData('more',0)">批量删除</el-button>
        </span>
      </el-form-item>
		</el-form>
		<!-- <el-row :gutter="30"> -->
		 	 <!-- <el-col :xl="6" :lg="6" :md='8' v-for='item in data' :key='item.id' :style="{marginBottom:'10px'}">
		 	 	 <el-card :body-style="{ padding: '0px'}">
		 	 	 	<h1>{{item.title}}</h1>
				      <img :src="item.img | imgPath" class="image">
				      <div style="padding: 14px;">
				      	<p class="content">{{item.content}}</p>
				        <span>活动地点:{{item.place}}</span>
				        <div class="bottom clearfix">
				          <time class="time">{{ currentDate }}</time>
				          <el-button type="text" class="button">详情</el-button>
				        </div>
				      </div>
				  </el-card>
		 	 </el-col>	 	 -->
		<!-- </el-row> -->
	  <div class="content">
			<ul class="content_ul">
        <li class="content_li clearfix" v-for="item in data" :key="item.id">
				<el-col :span="22" style="position:relative">
					<div class="contentLeft"><img :src="item.libImgList[0].libActiveImg" v-if="item.libImgList.length!=0">
					<img src="../../assets/images/u3216.png" v-else>
					</div>
					<div class="contentRight">
						 <!-- <h3 class="title">{{item.title}}</h3>
						 <div class="name">{{item.createTime}}</div> -->
						 <div class="noticeTitle">
                  <span style="font-size: 18px;color: #666;"><span style="font-weight: bold">[阅读活动]</span> {{item.title}}</span>
                  <span class="rightTime">{{item.createTime}}</span>
              </div>
						 <div class="detail2" v-html="item.content"></div>
						 <el-col :span="12">
							 <div class="address">活动地点：{{item.address}}</div>
						 <div class="date">开始时间：{{ item.startTime}}</div>
						 <div class="date">结束时间：{{ item.closureTime}}</div>

						 </el-col>
						 <el-col :span="12" >
							 <div class="bottom">
							<el-button type="primary" round size="small" @click=detail(item.id)>进入详情</el-button>
                 <span v-for="(item2,index2) in power" :key="index2">
							      <el-button v-if="item2.name.trim()=='修改'" @click="pushData(item)" round  type="warning" size="small">修改活动</el-button>
				            <el-button v-if="item2.name.trim()=='删除'" @click="deleteData('one',item.id)" round  type="danger" size="small">删除活动</el-button>
                 </span>
						 </div>
						 </el-col>
					</div>
				</el-col>
          <span v-for="(item2,index2) in power" :key="index2" >
				 <el-col :span="2" class="readingActive" v-if="item2.name.trim()=='删除'">
                   <el-checkbox style="margin-top:110px" :label="item.id"    v-model="deleteIds">{{ }}</el-checkbox>
			   </el-col>
          </span>
				</li>
			</ul>
		</div>



		<!-- 分页 -->
		<el-row>
  			<el-col :span="24">
		  		<el-pagination
			      :page-sizes="[4, 8, 12, 20]"
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
    	<dia-log :visible.sync="visible1" title="活动详情" style="padding:0;">
	    	<div class="container2 clearfix">
				<div class="title2">{{detailData.title}}</div>
				<div class="author2">{{detailData.createTime}}</div>
				<div class="img">
						<img :src="img.libActiveImg" v-for="img in detailData.libImgList" v-if="detailData.libImgList.length!=0" :key="img.id">
				</div>
				<div class="content2" v-html="detailData.content"></div>
				<div class="bottom2"> </div>
	 </div>
	  </dia-log>


 <!--发布活动-->
    	<dia-log :visible.sync="visible2" :title="diaTitle" style="padding:0;">
	    	<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="活动标题" prop="title">
                   <el-input v-model="ruleForm.title"></el-input>
                </el-form-item>
				<el-form-item label="开始时间" prop="startTime">
                    <el-date-picker type="datetime" placeholder="选择日期" @change="dateChangebirthday"
		        value-format="yyyy-MM-dd HH:mm:ss" v-model="ruleForm.startTime" style="width: 100%;"></el-date-picker>
                </el-form-item>
				<el-form-item label="结束时间" prop="startTime">
                    <el-date-picker type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" @change="dateChangebirthday" v-model="ruleForm.closureTime" style="width: 100%;"></el-date-picker>
                </el-form-item>
				<el-form-item label="活动内容" prop="content" >
					<vue-editor v-model="ruleForm.content"  :editorToolbar="customToolbar"></vue-editor>
					<!-- <el-input type="textarea" :rows="9"   v-model="ruleForm.content" ></el-input> -->
				</el-form-item>
				 <el-form-item label="活动地址" prop="address">
                   <el-input v-model="ruleForm.address"></el-input>
                </el-form-item>
				<el-form-item label="活动图片" prop="libNewsImg" class="clearfix">
          <el-upload
            class="reader-avatar-uploader"
            action="/roleUser/user/v1/upload/pic"
            :show-file-list="false"
            :http-request="successUpload">
           <span class="reader-avatar_wrap">
             <i class="el-icon-plus avatar-uploader-icon"></i>
           </span>
          </el-upload>
          <div class="imgs" v-for="(item,index) in ruleForm.saveImgList" :key="index">
            <img  :src="item" >
            <i class="el-icon-circle-close-outline" @click="deletePic(index)"></i>
          </div>
           </el-form-item>
				<el-form-item >
					<el-button type="primary" @click="submitForm('ruleForm')">{{this.diaTitle=='发布活动'?'立即创建':'立即修改'}}</el-button>
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
  import {readActivities,readActivitiesDetail,activeGo,newActive,deleteActive} from '@/request/libraryInfo'
  import {readerImportPic} from '@/request/systemSetup'
  export default{
	components:{
		DiaLog,
		VueEditor
		},
  	data(){
  		return {
  			currentDate:new Date().toLocaleString(),
  			data:[],
			form:{
				pageSize:4,
  				pageNum:1
			},
			deleteIds:[],
			dataPage:{},
			detailData:[],
			visible1:false,
			visible2:false,
			diaTitle:'',
			ruleForm: {
				title: '',
				content: '',
				startTime:'',
				closureTime:'',
				address:'',
				saveImgList:[]
			},
			rules: {
				title: [
					{ required: true, message: '请输入活动标题', trigger: 'blur' }
				],
				content: [
					{ required: true, message: '请输入活动内容', trigger: 'blur' }
				],
				address: [
					{ required: true, message: '请输入活动地址', trigger: 'blur' }
				],
                startTime: [
                   { type: 'string', required: true, message: '请选择日期', trigger: 'blur' }
                ],
                closureTime: [
                    { type: 'string', required: true, message: '请选择时间', trigger: 'blur' }
                ]
				}	,
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
	  watch:{
  		picker(newVal){
  			if(newVal&&newVal.length>0){
	  			this.ruleForm.startTime=newVal[0];
	  			this.ruleForm.closureTime=newVal[1];
  			}else{
  				this.ruleForm.startTime='';
  				this.ruleForm.closureTime='';
  			}
  		}
  	},
  	filters:{
  		  reduce:function(value){
            if(value.length>100){
				let str=value.substr(0,100)+"...";
				return  str
			}else{
				return value
			}
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
		// dateChangebirthday(val) {
        //    this.ruleForm.startTime= val;
        //   },
       dateChangebirthday() {
		//    this.ruleForm.closureTime= val;


          },
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
			   if (valid) {
           if(Date.parse(this.ruleForm.closureTime)<Date.parse(this.ruleForm.startTime)){
             this.$message({
               type: 'error',
               message: '结束时间应大于开始时间'
             });
             return
           }
		    	newActive(this.ruleForm).then(data=>{
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
           content: '',
           startTime:'',
           closureTime:'',
           address:'',
           saveImgList:[]
       }
	  },
	    deleteData(first,second){
			let obj,content;
			if(first=="more"){
                content="all"
				obj=this.deleteIds.join(",")
			}else{
				obj=second
			}
            this.$confirm(content=="all"?('是否删除'+this.deleteIds.length+'条活动'):'是否删除此活动？', '提示', {
		        confirmButtonText: '确定',
		        cancelButtonText: '取消',
		        type: 'warning'
	        }).then(() => {
	        	deleteActive(obj).then(data=>{
	        		if(data.data.code==0){
		  				 this.$message({
				            type: 'success',
				            message: '删除活动成功!'
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
			 //分页事件
        handleSizeChange(val) {
            this.form.pageSize=val;
            this.getData();
        },
        handleCurrentChange(val) {
            this.form.pageNum=val;
            this.getData();
	      },
			 //获取数据
        getData(){
            getData.call(this,readActivities,this.form);
		},
		 detail(id){
		   this.visible1=true;
		   readActivitiesDetail(id).then(data=>{
	        		if(data.data.code==0){
		  			  this.detailData=data.data.libNewsVoObj
	  				}else{
	  					this.$message({
				            type: 'error',
				            message: data.data.msg
				          });
	  				}


	  			})
	   },
		//    发布活动
	   pushData(value){
           this.visible2=true;
       this.$nextTick(()=>{
         this.$refs.ruleForm.clearValidate();
       });
           if(value=="add"){
			this.diaTitle="发布活动";
			this.ruleForm={
				title: '',
				content: '',
				startTime:'',
				closureTime:'',
				address:'',
				saveImgList:[]
			}
		   }else{
			   this.diaTitle="修改活动";
			    let arr=[]
			    for(let i=0;i<value.libImgList.length;i++){
			       arr.push(value.libImgList[i].libActiveImg)
          }
				 this.ruleForm={
					title: value.title,
					saveImgList:arr,
					content: value.content,
					id:value.id,
					startTime:value.startTime,
					closureTime:value.closureTime,
				    address:value.address,
				}
		   }
	   },
      //上次成功事件和图片上传
      successUpload(response){
        let formData = new FormData()
        formData.append('file', response.file)
        readerImportPic(formData).then(res=>{
          if(res.data.code==0){
            this.ruleForm.saveImgList.push(res.data.url);
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
      deletePic(index){
         this.ruleForm.saveImgList.splice(index,1)
      }
		},
		created(){
      this.getPowerArr();
			this.getData()
		}
  }

</script>

<style type="style/css" scoped>
	h1{
		/*background-color: rgb(255, 153, 51);*/
		text-align: center;
		line-height: 40px;
		font-weight: 400;
		font-size: 16px;
		/*color: #fff;*/
	}
	.time {
	    font-size: 13px;
	    color: #999;
  	}
  	.content{
  		font-size: 13px;
  		line-height: 1.5;
  		text-indent: 2em;
  		margin-bottom: 20px;
  	}
  .bottom {
    margin-top: 36px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    height: auto;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }

  .clearfix:after {
      clear: both
  }
	.content_li{width: 95%;list-style: none;padding: 20px;margin-bottom: 20px;border: 2px solid #cccccc;border-radius: 15px;background: white;font-size: 17px;position: relative}
	.contentLeft{width: 380px;height: 232px;position:absolute;left: 20px;right: 0;overflow: hidden }
	.contentLeft img{display: block;width: 368px;}
	.contentRight{margin-left: 400px}
	.title{font-size: 20px;margin-top: 5px;font-family: 'Axure Handwriting Bold', 'Axure Handwriting';}
	.name{color: #999999;margin-top: 10px;font-family: 'Axure Handwriting Bold', 'Axure Handwriting';font-size: 14px}
	.detail2{line-height: 24px;margin: 15px 0 10px ;min-height: 90px;overflow: hidden;
    max-height: 95px;}
	.date,.address{font-size: 16px;color: #FF9900}
	.bottom{float:right;}
.bottom>*{margin-bottom: 10px}
	.title2{font-size: 24px;color: #222; letter-spacing: 1px;}
	.author2{color:#777;margin-top: 22px;margin-bottom: 20px;font-size: 15px;}
	.content2{font-size: 14px;line-height: 28px}
	.img{width: 100%;;text-align: center}
	.img img{width: 150px;margin: 20px;}
	.box span{margin-right: 20px }
	.bottom2{margin-top: 50px;float: right}
	input[type=checkbox]:after  {

content: "";

display:block;

width: 20px;

height: 20px;

text-align: center;

line-height: 14px;

font-size: 16px;

color: #fff;

border: 2px solid #ddd;

background-color: #fff;

box-sizing:border-box;

}

input[type=checkbox]:checked:after  {

border: 4px solid #ddd;

background-color: #37AF6E;

}

  .reader-avatar_wrap,.imgs{
    display: inline-block;
    min-width: 158px;
    height: 158px;
    line-height:158px;
    border: 1px dashed #d9d9d9;
    margin: 0 5px 10px ;
  }
  .reader-avatar-uploader,.reader-avatar-uploader .avatar, .imgs img{
    width: 158px;
    height: 158px;
    float:left;
  }
  .reader-avatar-uploader{
    width: 186px;
    margin-right: 5px;
  }
  .el-icon-circle-close-outline{
    font-size: 26px;
    vertical-align: top;
    cursor: pointer;
  }
	.noticeTitle{
		height: 38px;
		line-height: 22px;
		/* padding: 0 16px; */
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
	.readingActive .el-checkbox__inner{
		width: 20px;
		height: 20px;
	}
	.readingActive .el-checkbox__inner::after{
		height: 12px;
		left: 7px;
	}
</style>

