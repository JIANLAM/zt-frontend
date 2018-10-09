import axios from '@/axios/request'


// 新书列表查询
export function newBooks(obj){
	return axios({
		url:'/apiNewBook/apiNewBook/v1/newbook/list',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}