import axios from 'axios'
import { Message } from 'element-ui'
import Cookie from 'js-cookie'
import store from '@/store'


// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000// request timeout
})
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// request interceptor
service.interceptors.request.use(config => {

  let tokens=Cookie.get('libraryToken');//每次请求都去获取一次token值
  config.headers.Authorization=tokens?("Bearer "+tokens):'';//然后设置请求头,将token加进去
  // Do something before request is sent

  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response =>{
    let token=Cookie.get('libraryToken');//每次请求成功，都去取一次token
    if(token){//如果有token再去重新刷新token,否则会导致无限调用
       axios.get("/roleUser/user/v1/token/refresh",{headers:{'Authorization':"Bearer "+token}}).then(res=>{//刷新token，并将cookie里的token重新赋值和重新设置时间
          if(res.data.code==0){
              Cookie.set('libraryToken',res.data.token,{ expires: 7 })
          }
       }).catch(err=>{
          if(err.response.status==401){//如果刷新token时出错就重登(出错有可能是请求头的token是错的)
            store.dispatch('LoginOut').then(() => {
                location.reload();// 重新加载页面,重新实例化vue-router对象 避免bug
            });
          }else{
             Message({
              message:'刷新token值错误!',
              type: 'error',
              duration: 4 * 1000
            }) 
          }
       })
     }   
     return response
  },
  error => {
    if(error.response.status==401){
         Message({
          message:'登录错误!非法的Token值!',
          type: 'error',
          duration: 4 * 1000
        }) 
        store.dispatch('LoginOut').then(() => {
            location.reload();// 重新加载页面,重新实例化vue-router对象 避免bug
        });
    }else{
       Message({
        message: error.message,
        type: 'error',
        duration: 4 * 1000
       })
    }
   
    return Promise.reject(error)
  })

export default service
