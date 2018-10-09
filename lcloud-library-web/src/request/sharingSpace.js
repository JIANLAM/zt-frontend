import axios from '@/axios/request'

// 分享空间我的关注
export function focuslist(obj){
	return axios({
		url:'/interact/interact/v1/focus/focuslist',
		method:'get',
		params:{
			jsonStr:obj
		} 
	})
}
// 分享列表
export function sharelist(obj){
	return axios({
		url:'/interact/interact/v1/share/list',
		method:'get',
		params:{
			jsonStr:obj
		} 
	})
}
//点赞阅读分享接口
export function likeSave(shareId, readerId) {
	return axios({
		url:'/interact/interact/v1/share/' + shareId + '/agree/' + readerId + '/save',
		method:'post'
	})
}
//取消点赞
export function likeCancel(shareId, readerId) {
	return axios({
		url:'/interact/interact/v1/share/' + shareId + '/agree/' + readerId + '/cancel',
		method:'post'
	})
}
// 查询单个分享空间详情接口
export function shareInfo(shareId) {
	return axios({
		url:'/interact/interact/v1/share/info/' + shareId,
		method:'get'
	})
}
// 查看分享评论
export function commentlist(obj) {
	return axios({
		url:'/interact/interact/v1/share/commentlist',
		method:'get',
		params:{
			jsonStr: obj
		} 
	})
}

// 关注
export function focusSave(readerId) {
	return axios({
		url:'/interact/interact/v1/focus/save/'+ readerId,
		method:'post'
	})
}

// 取消关注
export function focusDelete(readerId) {
	return axios({
		url:'/interact/interact/v1/focus/delete/'+ readerId,
		method:'post'
	})
}

// 评论
export function commentSave(obj) {
	return axios({
		url:'/interact/interact/v1/share/comment/save',
		method:'post',
		data: obj
	})
}

// 发表分享
export function shareSave(obj) {
	return axios({
		url:'/interact/interact/v1/share/save',
		method:'post',
		data: obj
	})
}

// 举报类型
export function shareReport(obj) {
	return axios({
		url:'/interact/interact/v1/share/report',
		method:'post',
		data: obj
	})
}
// /interact/v1/share/delete/{shareId}
// 删除发表评论
export function shareDelete(shareId) {
	return axios({
		url:'/interact/interact/v1/share/delete/'+ shareId,
		method:'post'
	})
}

// /
export function reportlist(obj) {
	return axios({
		url:'/interact/interact/v1/share/reportlist',
		method:'get',
		params:{
			jsonStr: obj
		} 
	})
}