import axios from '@/axios/request'

//获取信息列表（通知）
export function myNotice(obj){
	return axios({
		url:'/notice/notice/v1/myNotice/list',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}


//获取信息发布列表（通知）
export function sendNotice(obj){
	return axios({
		url:'/notice/notice/v1/sendNotice/list',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}
//发布信息（将草稿状态变为发布状态）
export function sendNoticeSend(id){
	return axios({
		url:'/notice/notice/v1/sendNotice/send/'+id,
		method:'post'
	})
}

//新增信息
export function saveNotice(obj){
	return axios({
		url:'/notice/notice/v1/sendNotice/save',
		method:'post',
		data:obj
	})
}

//删除已发送的信息
export function deleteNotice(id){
	return axios({
		url:"/notice/notice/v1/sendNotice/delete/"+id,
		method:'post'
	})
}
//获取已发送的信息的详情
export function noticeDetail(id){
  return axios({
    url:"/notice/notice/v1/sendNotice/info/"+id,
    method:'get'
  })
}


//删除已接受的信息
export function deleteMyNotice(id){
	return axios({
		url:"/notice/notice/v1/myNotice/delete/"+id,
		method:'post'
	})
}
//消息改为已读
export function readMyNotice(id){
	return axios({
		url:"/notice/notice/v1/myNotice/read/"+id,
		method:'post'
	})
}



