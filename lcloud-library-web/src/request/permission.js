import axios from '@/axios/request'


export function getRouter(){
	return axios({
		url:'/login/getrouter',
		method:'post'
	})
}