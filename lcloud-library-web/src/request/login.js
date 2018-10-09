import axios from '@/axios/request'

// export function login(user){
// 	return axios({
// 		url:'/login/login',
// 		method:'post',
// 		data:user
// 	})
// }

export function login(user){
	return axios({
		url:'/roleUser/user/v1/token/auth',
		method:'post',
		data:user
	})
}

// export function getUserInfo(token){
// 	return axios({
// 		url:'/login/getUserInfo',
// 		method:'post',
// 		data:{
// 			token:token
// 		}
// 	})
// }

//获取用户信息
export function getUserInfo(){
	return axios({
		url:'/roleUser/user/v1/user/menu',
		method:'get'
	})
}

// 修改密码
export function modifyPwd(user){
	return axios({
		url:'/roleUser/user/v1/token/modifyPwd',
		method:'post',
		data: user
	})
}

// 
export function update(user){
	return axios({
		url:'/roleUser/user/v1/user/update',
		method:'post',
		data: user
	})
}