<template>
      <div class="export">
         <div class="data">
            <span>导出模版</span>
            <el-select v-model="value" placeholder="请选择">
               <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
               </el-option>
            </el-select>
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
         options: [ {
          value: '选项1',
          label: '1'
        }, {
          value: '选项2',
          label: '2'
        }],
        value: '',
         form: {
          title: ""        
      }
    }
  }
 }
</script>

<style>
.export {
    border-radius: 4px;
    width: 30%;
    min-height: 200px;
    background: #e5e9f2;
  }
.data{
    min-height: 100px;
   text-align:center;
}


</style>