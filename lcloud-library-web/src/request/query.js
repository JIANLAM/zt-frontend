import axios from '@/axios/request'

//查询借购订单列表-
export function lendbuyList(obj){
	return axios({
		url:'/lendbuy/lendbuy/v1/order/listonline',
		method:'get',
		params:{
			jsonStr:obj 
		} 
	})
}
//查询借购订单详情
export function lendbuyDetail(obj){
	return axios({
		url:'/lendbuy/lendbuy/v1/order/bookList',
		method:'get',
		params:{
			jsonStr:obj 
		} 
	})
}
//导出借购单信息
export function exportPurchase(obj){
  return axios({
    url:'/lendbuy/lendbuy/v1/order/exportonline',
    method:'get',
    params:{
      jsonStr:obj
    }
  })
}
//查询借购书籍列表-
export function lendbuyBookList(obj){
	return axios({
		url:'/lendbuy/lendbuy/v1/order/bookList',
		method:'get',
		params:{
			jsonStr:obj 
		} 
	})
}
//导出借购书籍
export function exportBooks(obj){
  return axios({
    url:'/lendbuy/lendbuy/v1/order/exportbooks',
    method:'get',
    params:{
      jsonStr:obj
    }
  })
}
//查询荐购图书列表
export function recommbuyList(obj){
	return axios({
		url:'/recommbuy/recommbuy/v1/recommbuyWork/list',
		method:'get',
		params:{
			jsonStr:obj 
		} 
	})
}
