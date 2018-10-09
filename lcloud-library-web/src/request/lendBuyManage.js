import axios from '@/axios/request'


//获取读者信用列表
export function creditList(obj){
	return axios({
	    url: '/apiCredit/apiCredit/v1/credit/list',
	    method: 'get',
	    params: {
		    jsonStr:obj
		}	  
  	})
}


//获取读者信用详情列表
export function readerCreditList(obj){
	return axios({
	    url: '/apiCredit/apiCredit/v1/readercredit/list',
	    method: 'get',
	    params: {
		    jsonStr:obj
		}	  
  	})
}

//读者信用修改保存
export function creditUpdate(obj){
	return axios({
	    url: '/apiCredit/apiCredit/v1/credit/update',
	    method: 'post',
	    data:obj  
  	})
}
// 批量启用禁用借购
export function setstatus(obj){
	return axios({
	    url: '/apiCredit/apiCredit/v1/credit/setislendbuy',
	    method: 'post',
		data:obj  
  	})
}
// 批量修改信用值
export function creditMore(obj){
	return axios({
	    url: '/apiCredit/apiCredit/v1/credit/setownvalue',
	    method: 'post',
		data:obj
  	})
}