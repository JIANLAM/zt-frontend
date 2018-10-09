const routerMap = require('./router.json')

const userMap = {
  admin: {
    role: ['admin'],
    token: 'admin',
    introduction: '我是超级管理员',
    name:'杨潇',
    sex:'男',
    age:'七年级三班',
    email:'125464863@qq.com',
    tel:'13316442368',
    school:'白云山中学',
    remarks:'普通用户',
    uid: '001',
    ip:'192.168.1.224',
    userTime:'2018/5/15'
  },
  editor: {
    role: ['editor'],
    token: 'editor',
    introduction: '我是编辑',
    name: 'Normal Editor',
    uid: '002',
    age:'七年级四班',
    email:'125464863@qq.com',
    tel:'13316442368',
    school:'白云山中学'
  },
  developer: {
    role: ['develop'],
    token: 'develop',
    introduction: '我是开发',
    name: '工程师小王',
    uid: '003'
  }
}






export default {
	login: data => {
   	 const { name } = JSON.parse(data.body);
     if(userMap[name]){
        return userMap[name];
     }else{
       return -1
     }
      
  	},
  getRouter:()=>{
    return routerMap
  },
  getUserInfo: data =>{
    const { token } = JSON.parse(data.body);
    if(userMap[token]){
       return userMap[token]
     }else{
      return -1
     }
   
  }
}