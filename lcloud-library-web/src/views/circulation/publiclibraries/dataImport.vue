<template>
    <div class=" import">
         <el-form :inline="true" :model="form" class="demo-form-inline" label-width="100px" size="mini" >
            <div class="data">
                  <el-select v-model="form.name"  placeholder="请选择">	
                     <!-- <el-option label="第一版" value="title"></el-option>
                     <el-option label="第二版" value="author"></el-option>  -->
                     <el-option
                        v-for="item in cities"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                     </el-option>
                  </el-select>               
            </div>
            <div >
               <el-form-item label="语种:">
                  <el-button type="primary" plain size="small">确定</el-button>
               </el-form-item>
            </div>
         </el-form>
        <div style="text-align:center;">
            <el-button type="primary" plain size="small">确定</el-button>
            <el-button type="primary" plain size="small">取消</el-button>
        </div>

    </div>
</template>

<script>
 export default {
  data() {
   return {
    form:{
    writes:'',
    amount:'',
    box: '',
    cities: [
       {
          label: 'haha',
          value: '1',
       },
       {
          label: 'gaigai',
          value: '2',
       }
    ]
    },
  }
}}
</script>

<style>
.import {
  border-radius: 4px;
  width: 30%;
  min-height: 200px;
  background: #e5e9f2;
}
.data {
  text-align: center;
}
</style>