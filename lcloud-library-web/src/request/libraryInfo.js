import axios from '@/axios/request'


// 获取馆内资讯列表
export function acqbookList(obj){
	return axios({
	    url: '/libnews/libnews/v1/news/list',
	    method: 'get',
	    params: {
		    jsonStr: obj
		}	  
  	})
}
//获取详情
export function acqbookListDetail(obj){
	return axios({
	    url: '/libnews/libnews/v1/news/newsInfo/'+obj,
	    method: 'get',
	     
  	})
}
//阅读量加1
export function lookNumber(obj){
	return axios({
	    url: '/libnews/libnews/v1/news/saveLibNewsLook',
		method: 'post',
		data:obj
	     
  	})
}
// 删除馆内资讯列表
export function deletebookList(title){
	return axios({
	    url: '/libnews/libcloud/groom/acqbook/deletelist',
	    method: 'get',
	    params: {
		    title: title
		}	  
  	})
}
// 获取阅读活动列表
export function readActivities(title){
	return axios({
	    url: '/libnews/libnews/v1/active/list',
	    method: 'get',
	    params: {
		    title: title
		}	  
  	})
}
// 获取阅读活动详情
export function readActivitiesDetail(id){
	return axios({
	    url: '/libnews/libnews/v1/active/activeInfo/'+id,
	    method: 'get',
	    
  	})
}
//活动报名
export function activeGo(obj){
	return axios({	
	    url: '/libnews/libnews/v1/active/saveLibActiveEnroll',
		method: 'post',
		data:obj
	     
  	})
}
//新增馆内资讯
export function newLibraryInformation(obj){
	return axios({	
	    url: '/libnews/libnews/v1/news/save',
		method: 'post',
		data:obj
	     
  	})
}
// 删除馆内资讯
export function deleteInfo(id){
	return axios({
	    url: '/libnews/libnews/v1/news/delete/'+id,
	    method: 'post',
	    
  	})
}
//新增阅读活动
export function newActive(obj){
	return axios({	
	    url: '/libnews/libnews/v1/active/save',
		method: 'post',
		data:obj
	     
  	})
}
// 删除阅读活动
export function deleteActive(id){
	return axios({
	    url: '/libnews/libnews/v1/active/delete/'+id,
	    method: 'post',
	    
  	})
}