<template>
  <el-dialog :title="title" :visible.sync="dia" v-bind="$attrs" @close="close">
    <slot></slot>
    <div slot="footer" class="dialog-footer">
      <slot name="footers"></slot>
    </div>
  </el-dialog>
</template>

<script>
  export default{
    name:'DiaLog',
    props:['visible','title'],
    data(){
      return {
         dialog:null
      }
    },
    methods:{
      close(){       
        this.$emit("update:visible",this.dialog);
      } 
    },
    computed:{
      dia:{
        get:function(){
           return this.visible
        },
        set:function (newValue) {
            this.dialog=newValue
        }
        
      }
    }  
  }
  
</script>

<style type="style/css" scoped>

</style>