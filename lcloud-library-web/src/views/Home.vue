 <template>
 	    <el-container >
          <el-header height="80px">
            <header-component></header-component>	
          </el-header>
          <el-container>
              <el-aside width='auto'>
            	   <menu-component></menu-component>	
              </el-aside>
              <el-main>
                <!-- <div class="crumb">
                  <bread-crumb></bread-crumb>
                </div> -->
                <div class="container">
                	<transition name="fade" >
    			          <router-view></router-view>
    			        </transition>
                </div>
              </el-main>
          </el-container>
      </el-container>
 </template>

 <script>
  import MenuComponent from './menu/Menu'
  import HeaderComponent from './navBar/HeaderNavbar'
  // import BreadCrumb from './breadCrumb/BreadCrumb.vue'
//这个文件是页面大体结构,包括头部，侧边导航和中间内容区
 	export default {
	  components: {
		   MenuComponent,
		   HeaderComponent,
      //  BreadCrumb
		},
   
	}
 </script>

 <style>
  .crumb{
      padding:0px 0 15px;
      margin-bottom: 15px;
      border-bottom:1px dashed #c1c9dc;
  }
  .container{
    flex: 1;
  }
	.logo{
	  color:rgb(255, 255, 255);
	}
	.el-dropdown-link{
	  color: #fff;
	}
  .el-header{
    padding-left: 0;
  }
	.el-header, .el-footer {
    background-color: #3FACB9;
    text-align: center;
    line-height: 80px;
  }
  .el-aside{
    background-color: #585858;
  }
  .el-main {
    background-color: #E9EEF3;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    -ms-flex-preferred-size: auto;
    flex-basis: auto;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    min-width: 0;
  }
   _:-ms-lang(x),.is-vertical.el-container{
      height: 100%;
   }
  _:-ms-lang(x),.el-container{
    flex-basis:1px;
  }
  _:-ms-lang(x),.el-main{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    box-sizing:border-box;
    -o-box-sizing:border-box;
    -ms-box-sizing:border-box;
    -moz-box-sizing:border-box;
    -webkit-box-sizing:border-box;
  }
  .el-dropdown-link img{
  	 width: 36px;
    height: auto;
    margin-right: 5px;
    border-radius: 100%;
    vertical-align: middle;
  }

  
  *::-webkit-scrollbar{
    width: 16px;
  }
  *::-webkit-scrollbar-corner{
      background: transparent;
  }
  *::-webkit-scrollbar-thumb {
    min-height: 20px;
    background-clip: content-box;
    box-shadow: 0 0 0 5px rgba(0,0,0,.2) inset;
  }
  *::-webkit-scrollbar-track,*::-webkit-scrollbar-thumb{
      border-radius: 999px;
      border: 5px solid transparent;
  }
  *::-webkit-scrollbar-track{
      box-shadow: 1px 1px 5px rgba(0,0,0,.2) inset;
  }
  *::-webkit-scrollbar-track, *::-webkit-scrollbar-thumb{
      border-radius: 999px;
      border: 5px solid transparent;
  }

   .el-aside::-webkit-scrollbar-thumb {
    min-height: 20px;
    background-clip: content-box;
    box-shadow: 0 0 0 5px rgb(255, 208, 75) inset;
  }
 </style>