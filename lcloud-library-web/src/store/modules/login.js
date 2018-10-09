import { login,getUserInfo} from '@/request/login'
import Cookie from 'js-cookie'

const Login = {
  state: {
      token:Cookie.get('libraryToken'),
      user:''
  },
  mutations: {
    SET_TOKEN:(state,token)=>{
      state.token=token;
    },
    SET_USER:(state,user)=>{
      state.user=user;
    },
   
  },
  actions: {
   	Login({ commit },user){
       return new Promise((resolve,reject) => {
            login(user).then(res=>{
              if(res.data.code == 0){ 
                 const data=res.data;
                 Cookie.set('libraryToken', data.token, { expires: 7 })
                 commit('SET_TOKEN',data.token)
                  resolve(data);
              }else{
                 reject(res.data.msg);
              } 
            }).catch(err=>{
                reject(err);
            })
       })
   	},
    LoginOut({ commit }){
       return new Promise((resolve,reject) => {
           Cookie.remove('libraryToken')
           commit('SET_TOKEN','')
           commit('SET_USER','')
           resolve();
      })
    },
    getUserInfo({ commit,state}){
       return new Promise((resolve,reject) => {
          getUserInfo().then(res=>{
             if(res.data.code == 0){
                commit('SET_USER',res.data.user)
                resolve(res.data);
             }else{
                reject(res.data.msg);
             }
          }).catch(err=>{
                reject(err);
          })
      })
    }

  }
}

export default Login