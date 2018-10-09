import axios from '@/axios/request'

// API图书借阅排行
export function toplendbook(obj){
	return axios({
		url:'/apiTop/apiTop/v1/top/toplendbook',
		method:'get',
		params:{
			jsonStr:obj
		} 
	})
}

//API图书推荐排行
export function toprecommbook(obj){
	return axios({
		url:'/apiTop/apiTop/v1/top/toprecommbook',
		method:'get',
		params:{
			jsonStr:obj
		} 
	})
}

// API读者借阅排行
export function toplendreader(obj){
	return axios({
		url:'/apiTop/apiTop/v1/top/toplendreader',
		method:'get',
		params:{
			jsonStr:obj
		} 
	})
}

// API图书荐购排行
export function toprecommbuybook(obj){
	return axios({
		url:'/apiTop/apiTop/v1/top/toprecommbuybook',
		method:'get',
		params:{
			jsonStr:obj
		} 
	})
}

// API读者荐购排行
export function toprecommbuyreader(obj){
	return axios({
		url:'/apiTop/apiTop/v1/top/toprecommbuyreader',
		method:'get',
		params:{
			jsonStr:obj
		} 
	})
}

// 6、API图书借购排行
export function toplendbuybook(obj){
	return axios({
		url:'/apiTop/apiTop/v1/top/toplendbuybook',
		method:'get',
		params:{
			jsonStr:obj
		} 
	})
}

// 7、API读者借购排行
export function toplendbuyreader(obj){
	return axios({
		url:'/apiTop/apiTop/v1/top/toplendbuyreader',
		method:'get',
		params:{
			jsonStr:obj
		} 
	})
}

