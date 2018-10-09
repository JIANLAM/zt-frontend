import Router from './router'
import Cookie from 'js-cookie'
import store from './store'
import { Message,Notification } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getRouter } from '@/request/permission'

const _import = require('./router/_import_' + process.env.NODE_ENV);

//要修改顶进度条的颜色就去改node_modules下的nprogress/nprogress.css,或者找到进度条的class用css属性!important强行覆盖
NProgress.configure({ showSpinner: false })



//处理菜单数据，变成vue-router需要的路由数据
function filterAsyncRouter(asyncRouterMap) {
    let routerMap;
    if(asyncRouterMap instanceof Array){
        routerMap=asyncRouterMap;
    }else{
        routerMap=[asyncRouterMap];
    }
    let arr=[];
    routerMap.forEach((item,val)=>{
      console.log(item.power);
        let obj={
          name:item.name,//路由名称
          path:item.path,//路由路径
          component:'',//路由对应的视图文件(vue文件)
          hidden:item.hidden==0?false:true,//菜单显示与否 0表示显示，1表示隐藏
          children:[],
          meta:{
            role:item.hidden==0?true:false,//管理员给不给你进，有没有权限
            icon:item.icon,//菜单图标
            power:item.power//按钮权限，暂时隐藏
          }
        }
        if(item.component&&item.component!=''){
            try{
              obj.component=_import(item.component);
            }catch(e){
              obj.hidden=true;
              obj.component=null;
              // obj.meta.role=false;
              // 这个注释表示如果你配置的component是错误的，那直接不给你进这个路由的权限，不过现在注释了，表示你可以进，但是没东西
              if( item.hidden == 0) {
                  Notification({
                     type:'error',
                    title: '菜单配置错误！！',
                    message: '"'+item.name+'"菜单对应的文件不存在!,该菜单已为你暂时隐藏,请联系管理员处理！',
                    duration: 0
                  });
              }
            }
        }else{
           try{
             obj.component=_import('dinGou/dingou1');//如果没有视图组件，默认给个视图
           }catch(e){

           }
        }

        if(/^(http:\/\/)/.test(item.path)){//如果用户配置的路径是一个http地址或者https地址，那么系统默认会将它视为是想将该网址引用进本系统，那么就引入iframe
            obj.meta.path=item.path;
            obj.path=item.path.replace('http://','');
            obj.component=_import('iframe/iframe');
        }else if(/^(https:\/\/)/.test(item.path)){
             obj.meta.path=item.path;
            obj.path=item.path.replace('https://','');
            obj.component=_import('iframe/iframe');
        }

        if(item.children&&item.children.length>0){
            obj.redirect=item.children[0].path;//如果有子路由，默认重定向到子路由
            obj.children=filterAsyncRouter(item.children);//递归一下
        }
        arr.push(obj);
    })
    return arr
}


Router.beforeEach((to, from, next) => {
  NProgress.start();

  const token=Cookie.get('libraryToken');//每次跳路由时都去cookie里获取一遍有没有token(有没有登录过，不管该token是不是人为加的，后面会做验证)
    if(token){
    	if(to.path=='/login'){
    		next({ path: '/' })
          NProgress.done();
    	}else{
        if(!store.getters.user){//判断vuex里有没有用户信息
           store.dispatch("getUserInfo").then(data =>{ //获取用户信息和菜单信息，用户信息保存到vuex里，获取菜单信息返回data过来了

              store.dispatch("GenerateRoutes",{
                    menu:filterAsyncRouter(data.menu.routers)//调用方法将菜单路由信息处理成vue-router想要的数据格式，然后传给vuex处理保存
                }).then((res)=>{

                    Router.addRoutes(res) //vue-router动态添加路由
                    store.dispatch('getNowRoutes', to);//获取一下当前要去往的地址所对应的路由信息，并保存在vuex里
                    next({ ...to})  //hack手法，具体为什么这么写我也忘了...
                })
            }).catch(err =>{
              store.dispatch("LoginOut").then(()=>{//获取用户信息和菜单信息失败就登出，清理一下cookie
                next({ path: '/login'});
                NProgress.done();
                Message.error(err);
              });
           })
        }else{
            store.dispatch('getNowRoutes', to);//如果用户信息有的话，就获取一下当前要去往的地址所对应的路由信息，并保存在vuex里
            if(to.path=='/401'|| to.path=='/404'){//如果去的地址是401或者404就让他去
              next();
            }else{
              if(to.meta.role){//如果不是去401或者404，那么该路由就是菜单路由，那么meta里就会有role字段权限字段,如果role为true有权限就通过
                 next();
              }else{//否则就去401页面
                next({ path:'/401'});
                NProgress.done();
              }
            }

        }
    	}
    }else{//如果没token，那么判断去的页面是不是下面这些
    	if(to.path=='/login' || to.path=='/404' || to.path=='/401'){
    		next()
    	}else{
    		next({ path: '/login' })
          NProgress.done();
    	}
    }
})

Router.afterEach(() => {
 	NProgress.done();
})
