import axios from '@/axios/request'

export function getAddress(){
	return axios({
		url:'/account/v1/reader/userInfo/1',
		method:'get'
	})
}