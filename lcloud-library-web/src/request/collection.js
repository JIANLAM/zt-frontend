import axios from '@/axios/request'

//	查询馆藏书籍列表接口
export function manageList(obj) {
	return axios({
		url: '/holding/holding/v1/manage/list',
		method: 'get',
		params: {
			jsonStr: obj
		}
	})
}

//	查询馆藏操作日志列表接口
export function logList(obj) {
	return axios({
		url: '/holding/holding/v1/manage/log/list',
		method: 'get',
		params: {
			jsonStr: obj
		}
	})
}

// 批删除 
export function managDdelete(ids) {
	return axios({
		url: '/holding/holding/v1/manage/delete/' + ids,
		method: 'post'
	})
}

// 批修改 holding/v1/manage/update/{ids
export function managUpdate(ids, obj) {
	return axios({
		url: '/holding/holding/v1/manage/update/' + ids,
		method: 'post',
		data: obj
	})
}

// 查询单个馆藏书籍详情接口
export function manageInfo(ids) {
	return axios({
		url: '/holding/holding/v1/manage/info/' + ids,
		method: 'get',
	})
}

// 流通类型下拉框
export function circulationList() {
	return axios({
		url: '/apiParameter/apiParameter/v1/clt/circulationList',
		method: 'get',
	})
}

// 馆藏地点下拉框
export function collAddressList() {
	return axios({
		url: '/apiParameter/apiParameter/v1/colle/collAddressList',
		method: 'get',
	})
}