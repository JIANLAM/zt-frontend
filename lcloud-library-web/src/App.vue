<template>
  <div id="app">
     <transition name="fade">
        <router-view></router-view>
      </transition>
  </div>
</template>

<script>

 export default {
     name: 'App',
  }

</script>

<style>
@import 'element-ui/lib/theme-chalk/index.css';


html,body{
  height: 100%;
}
#app {
font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
      width: 100%;
      height: 100%;
      min-width: 1200px;
      margin: 0 auto;
      overflow-x:hidden;
      display:-webkit-box;
      display:-webkit-flex;
      display:-ms-flexbox;
      display: -moz-box;
      display:flex;
      flex-direction:column;  
      -webkit-flex-direction:column;
      -ms-flex-direction:column;
      -moz-flex-direction:column;
      -webkit-box-orient:vertical;
      position: relative;

}
.el-table--border th, .el-table__fixed-right-patch {
    border-bottom: 1px solid #ebeef5;
    background: #D9EEF1;
}
.el-table th {
    background: #D9EEF1;
}
</style>
