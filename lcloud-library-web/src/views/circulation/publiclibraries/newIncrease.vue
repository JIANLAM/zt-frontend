<template>  
   <div id="circulation">
      <div style="margin: 30px 0;"></div>
         <el-row :gutter="40">
            <el-col :span="6">
               <div class="grid-content bg-purple">
                  <el-form :label-position="labelPosition" label-width="100px" :model="form" size="mini">
                     <el-form-item label="读者证号">
                        <el-input v-model="form.readres" :style="{width:'247px'}"></el-input>
                     </el-form-item>

                     <el-form-item label="姓名">
                        <el-input v-model="form.name" :style="{width:'247px'}"></el-input>
                     </el-form-item>

                     <el-form-item label="性别">
                        <el-select v-model="form.gender"  placeholder="请选择" :style="{width:'120px'}"  >	
                           <el-option label="男" value="title"></el-option>
                           <el-option label="女" value="author"></el-option> 
                        </el-select>
                     </el-form-item>

                     <el-form-item label="身份证号">
                        <el-input v-model="form.number" :style="{width:'247px'}"></el-input>
                     </el-form-item>

                     <el-form-item label="出生年月">
                        <el-input v-model="form.birth" :style="{width:'247px'}"></el-input>
                     </el-form-item>

                     <el-form-item label="手机号码">
                        <el-input v-model="form.mobile" :style="{width:'247px'}"></el-input>
                     </el-form-item>

                     <el-form-item label="密码">
                        <el-input v-model="form.password" :style="{width:'247px'}"></el-input>
                     </el-form-item>

                     <el-form-item label="本馆流通类型">
                        <el-select v-model="form.our"  placeholder="请选择" :style="{width:'247px'}">	
                           <el-option label="1" value="title"></el-option>
                           <el-option label="2" value="title"></el-option>
                           <el-option label="3" value="title"></el-option>
                           <el-option label="4" value="title"></el-option>
                        </el-select>
                     </el-form-item>

                     <el-form-item label="馆际流通类型">
                        <el-select v-model="form.interlibrary"  placeholder="请选择" :style="{width:'247px'}">	
                           <el-option label="第一版" value="title"></el-option>
                           <el-option label="第二版" value="author"></el-option> 
                        </el-select>
                     </el-form-item>

                     <el-form-item label="启用日期">
                        <div class="block">
                           <el-date-picker
                              v-model="value1"
                              type="datetime"
                              placeholder="年/月/日"
                              :style="{width:'247px'}">
                           </el-date-picker>
                        </div>
                     </el-form-item>

                     <el-form-item label="终止日期">
                        <div class="block">
                           <el-date-picker
                              v-model="value1"
                              type="datetime"
                              placeholder="年/月/日"
                              :style="{width:'247px'}">
                           </el-date-picker>
                        </div>
                     </el-form-item>

                     <el-form-item label="办证日期">
                        <el-input v-model="form.registration" :style="{width:'247px'}"></el-input>
                     </el-form-item>

                     <el-form-item label="证状态">
                        <el-select v-model="form.state"  placeholder="请选择" :style="{width:'247px'}">	
                           <el-option label="禁用" value="title"></el-option>
                           <el-option label="正常" value="author"></el-option>
                           <el-option label="注销" value="author"></el-option>
                           <el-option label="挂失" value="author"></el-option> 
                        </el-select>
                     </el-form-item>
                  </el-form>
               </div>
            </el-col>
            <el-col :span="6">
               <div class="grid-content bg-purple-light">            
                  <el-upload
                     class="avatar-uploader"
                     action="https://jsonplaceholder.typicode.com/posts/"
                     :show-file-list="false"
                     :on-success="handleAvatarSuccess"
                     :before-upload="beforeAvatarUpload">
                     <img v-if="imageUrl" :src="imageUrl" class="avatar">
                     <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                  <el-form :label-position="labelPosition" label-width="100px" :model="form" size="mini">
                     <el-form-item label="自定义1">
                           <el-select v-model="form.custom"  placeholder="请选择" :style="{width:'247px'}">	
                              <el-option label="1" value="title"></el-option>
                              <el-option label="2" value="author"></el-option> 
                           </el-select>
                     </el-form-item>

                     <el-form-item label="自定义2">
                        <el-select v-model="form.custom"  placeholder="请选择" :style="{width:'247px'}">	
                           <el-option label="1" value="title"></el-option>
                           <el-option label="2" value="author"></el-option> 
                        </el-select>
                     </el-form-item>

                     <el-form-item label="自定义3">
                        <el-select v-model="form.custom"  placeholder="请选择" :style="{width:'247px'}">	
                           <el-option label="1" value="title"></el-option>
                           <el-option label="2" value="author"></el-option> 
                        </el-select>
                     </el-form-item>

                     <el-form-item label="自定义4">
                           <el-input v-model="form.custom" :style="{width:'247px'}"></el-input>
                     </el-form-item>
                     <el-form-item label="自定义5">
                        <el-input v-model="form.custom" :style="{width:'247px'}"></el-input>
                     </el-form-item>
                     <el-form-item label="自定义6">
                        <el-input v-model="form.custom" :style="{width:'247px'}"></el-input>
                     </el-form-item>
                     <el-form-item label="违约次数">
                        <el-input v-model="form.default" :style="{width:'247px'}"></el-input>
                     </el-form-item>
                     <el-form-item label="馆际互借次数">
                        <el-input v-model="form.each" :style="{width:'247px'}"></el-input>
                     </el-form-item>
                     <el-form-item label="预付款金额">
                        <el-input v-model="form.payment" :style="{width:'247px'}"></el-input>
                     </el-form-item>
                     <el-form-item label="欠款金额">
                        <el-input v-model="form.arrears" :style="{width:'247px'}"></el-input>
                     </el-form-item>
                  </el-form>
               </div>
            </el-col>
         </el-row>
         <div class="anniu" style="text-align: center; width:800px;">
         <el-button type="primary">确认</el-button>
         <el-button type="primary">取消</el-button>
         </div>
         
   </div>
</template>

<script>
export default {
  data() {
    return {
      labelPosition: "left",
      imageUrl: '',
      form: {
        readres: "",
        name: "",
        gender: "",
        number: "",
        birth: "",
        mobile: "",
        password: "",
        our: "",
        interlibrary: "",
        registration:'',
        state:'',
        custom:'',
        default:'',
        each:'',
        payment:'',
        arrears:'',
        pageSize: 10
      },
      activeName: 'first'
    };
  },
  methods: {
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传图像只能是 JPG 格式!');
        }
        if (!isLt10M) {
          this.$message.error('上传图像大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
  }
};
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 140px;
    height: 140px;
    line-height: 140px;
    text-align: center;
  }
  .avatar {
    width: 140px;
    height: 140px;
    display: block;
  }


</style>