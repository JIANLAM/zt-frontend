<template> 
   <div class="file">
      <div class="wenj">您的文件将保存为.csv格式文件</div>
      <div class="save">
         <el-radio v-model="radio" label="1">打开文件</el-radio>
         <el-radio v-model="radio" label="2">保存文件</el-radio>
      </div>
      <div style="text-align:center;">
         <el-button type="primary" plain size="small">确定</el-button>
         <el-button type="primary" plain size="small">取消</el-button>
      </div>
   </div>
</template>

<script>
export default {
    data () {
      return {
        radio: '1'
      };
    }
  }
</script>

<style>
.file {
    border-radius: 4px;
    width: 20%;
    min-height: 200px;
    background: #e5e9f2;
  }

.wenj{
   min-height: 50px;
   text-align:center;
}
.save{
   min-height: 70px;
   text-align:center;
}
</style>