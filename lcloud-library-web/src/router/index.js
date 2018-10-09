import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

const _import = require('./_import_' + process.env.NODE_ENV);

Vue.use(Router)

export const constantRouterMap=[
	{
    	path:'/login',
    	name: 'login',
     	component:_import('login/Login')
	},
	{ path: '/404', component: _import('errorPage/404'), hidden: true },
    { path: '/401', component: _import('errorPage/401'), hidden: true }
]


export default new Router({
	// mode:'history',
	scrollBehavior: () => ({ y: 0 }),
	routes: constantRouterMap
})


// export const asyncRouterMap = [
//   {
//       path: '',
//       name: '借购管理',
//       component:_import('Home'),
//       redirect:"/navtwo",
//       children:[
//         {  
//           path: 'navone',
//           name:'navone',
//           //有三级菜单就加上这句
//           component: {render (c) { return c('router-view') }},
//           redirect:"/navone/a",
//           meta:{title:'订购清单',icon:'el-icon-location'},
//           children:[
//             {
//               path:'a',
//               name:'a',
//               component:_import('navOne/Navone_1')
//             }
//           ]
//         },
//         {path: 'navtwo',name:'navtwo',component:_import('navOne/Navone_2'),meta:{title:'订购清单一',icon:'el-icon-setting'}},
//         {path: 'navthree',name:'navthree',component:_import('navOne/Navone_3'),meta:{title:'订购清单三',icon:'el-icon-document'}}
//       ]
//   },
//   {
//       path: '/dingou',
//       name: '订购管理',
//       // meta: { roles: ['admin'] },
//       component:_import('Home'),
//       redirect:"/dingou/dingou1",
//       children:[
//          {path: 'dingou1',name:'dingou1',component:_import('dinGou/Dingou1'),meta:{title:'订购管理一',icon:'el-icon-menu',role:['admin']}},
//          {path: 'dingou2',name:'dingou2',component:_import('dinGou/Dingou2'),meta:{title:'订购管理二',icon:'el-icon-document'}}
//       ]
//   },
//   {
//       path: '/myAccount',
//       name: '我的账户',
//       component:_import('Home'),
//       redirect:"/myAccount/information",
//       children:[
//          {path: 'information',name:'我的资料',component:_import('myAccount/Information'),meta:{icon:'icon-msnui-person-info'}},
//          {path: 'notice',name:'我的通知',component:_import('myAccount/Notice'),meta:{icon:'icon-tongzhi'}},
//          {path: 'borrow',name:'我的借阅',component:_import('myAccount/Borrow'),meta:{icon:'icon-jieyue'}},
//          {path: 'borrowBuy',name:'我的借购',component:_import('myAccount/BorrowBuy'),meta:{icon:'icon-jiegou'}},
//          {path: 'substitute',name:'我的代借',component:_import('myAccount/Substitute'),meta:{icon:'icon-jie'}},
//          {path: 'personalData',name:'个人数据',component:_import('dinGou/Dingou1'),meta:{icon:'icon-shuju'}},
//          {path: 'recommendation',name:'我的荐购',component:_import('dinGou/Dingou1'),meta:{icon:'icon-jiangou'}},
//          {path: 'preLoan',name:'我的预借',component:_import('dinGou/Dingou1'),meta:{icon:'icon-yu'}},
//          {path: 'generationReturns',name:'我的代还',component:_import('dinGou/Dingou1'),meta:{icon:'icon-huan'}},
//          {path: 'lent',name:'我的转借',component:_import('dinGou/Dingou1'),meta:{icon:'icon-zhuanjie'}},
//          {path: 'readingActive',name:'阅读活动',component:_import('myAccount/readingActive'),meta:{icon:'icon-huodong'}}
//       ]
//   },
//   { path: '*', component: _import('errorPage/404'), hidden: true }
// ]