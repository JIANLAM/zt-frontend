<template>
  <el-menu
    uniqueOpened
    :default-active="$route.path"
    :collapse="isCollapse"
    class="el-menu-vertical-demo"
    background-color="#585858"
    text-color="#C3C3C3"
    active-text-color="#F79700"
    router
   >

    <div class="el-dropdown-link middle">
      <img :src="user.icon" v-if="user.icon">
      <img src="../../assets/images/timg.jpg" v-else>
    </div>


    <template v-for="item in siderbar_routers.children" v-if='item.hidden == 0'>
      <el-submenu  v-if="item.children&&item.children.length>0" :key="item.name" :index="item.path">
        <template slot="title">
          <i class="iconfont" :class="item.meta.icon" v-if="item.meta&&item.meta.icon"></i>
          <span>{{item.name}}</span>
        </template>
        <template v-for="child in item.children" >
          <el-submenu  :index="child.path"  v-if="!child.children">
            <template slot="title">{{child.name}}</template>
            <template v-for="i in child.children">
              <el-menu-item :index="i.path">{{i.name}}</el-menu-item>
            </template>
          </el-submenu>
          <el-menu-item :index="child.path" v-else>
            <i class="iconfont" :class="child.meta.icon" v-if="child.meta&&child.meta.icon"></i>
            <span slot="title">{{child.name}}</span>
          </el-menu-item>
        </template>

      </el-submenu>
      <el-menu-item v-else :index="item.path"  :key="item.name" >
        <i class="iconfont" :class="item.meta.icon" v-if="item.meta&&item.meta.icon"></i>
        <span slot="title">{{item.name}}</span>
      </el-menu-item>


    </template>
  </el-menu>
</template>
<script>
  import { mapGetters } from 'vuex'
  export default{
    computed: {
      ...mapGetters([
        'sidebar',
        'siderbar_routers',
        'user'
      ]),
      isCollapse() {
        return !this.sidebar.isOpen
      }
    }

  }
</script>
<style scoped>
  .iconfont{
    margin-right: 5px;
    margin-left: 3px;
    text-align: center;
    font-size: 18px;
    vertical-align: middle;
  }
  .el-menu{

    border-right: 0;
  }
  .el-submenu .el-menu-item{
    min-width:180px;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 180px;
  }
  .el-menu-item.is-active{
		background-color: #fff!important;
     border-right: 5px solid #F79700;
	}
  .el-dropdown-link img{
    height: 80px;
    width: 80px;
  }
  .middle{
    padding: 15px 50px;
  }
</style>
