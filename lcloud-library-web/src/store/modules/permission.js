import { asyncRouterMap, constantRouterMap } from '@/router'
import { getRouter } from '@/request/permission'



/**
 * 获取当前访问路由所对应的路由表
 */
function getNowRouter(asyncRouterMap, to) {
  return asyncRouterMap.some(route => {
      let allPath=route.path;
      if(to.path.indexOf(allPath) !==-1) {
          return true;
      }
      else if (route.children && route.children.length>0) { //如果有孩子就遍历孩子
        return  getNowRouter(route.children,to)
      }
  })

}


const permission = {
  state: {
    routers: constantRouterMap,//总路由数据
    addRouters: [],//动态添加的路由数据
    siderbar_routers:[],//点击某个菜单后显示的路由菜单数据
    header_router:[]//专门给顶部一级导航存的一份数据
  },
  mutations: {
     SET_HEADER: (state, routers) => {
      state.header_router = routers
    },
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_NOWROUTES:(state,routers)=>{
       state.siderbar_routers=routers
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {//保存路由数据
      return new Promise(resolve => {
        console.log("--------------------")
        console.log(data.menu);
         console.log("--------------------")
        commit('SET_HEADER',data.menu)//设置保存HeaderNavbar.vue视图需要的数据
        let router=data.menu;
        let newRouter=router.map((val)=>val)
       let obj={//添加一条当用户输入""或者"/"后对应的路由数据
          path:"",
          redirect:newRouter[0].path,
          name:"主页"//加不加无所谓，反正也看不到
        }
        newRouter.unshift(obj);
        let newObj={//添加一条匹配所有的路由数据，全部重定向到404，注意一定要添加在路由数据的末尾,一定得用push!!!
          path: "*",
          redirect:"/404"
        }
        newRouter.push(newObj)
        console.log(newRouter);
        commit('SET_ROUTERS', newRouter)
        resolve(newRouter)//将路由数据返回给routerBefore.js处理
      })
    },
    getNowRoutes({ commit,state}, to) { //返回动态添加的路由数据里面你点击的那个路由所对应的菜单数据    
         for(let i=0;i<state.addRouters.length;i++){    
            if(state.addRouters[i].children&& state.addRouters[i].children.length>0){
             if(getNowRouter(state.addRouters[i].children,to)===true){   
              console.log(state.addRouters[i])          
                commit('SET_NOWROUTES',state.addRouters[i]); 
             }
            }
          } 

    }
  }
}

export default permission
