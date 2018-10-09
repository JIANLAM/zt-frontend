import axios from '@/axios/request'

//借购订单统计-
export function orderStatistics(obj){
	return axios({
		url:'/datacount/datacount/v1/interviewCount/lendBuyList',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}
//图书借购统计-
export function buyBookStatistics(obj){
	return axios({
		url:'/datacount/datacount/v1/interviewCount/bookLendBuyList',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}
//图书荐购统计-
export function recommBuyList(obj){
	return axios({
		url:'/datacount/datacount/v1/interviewCount/recommBuyList',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}
//订购单统计-
export function purchaseOrderList(obj){
	return axios({
		url:'/datacount/datacount/v1/interviewCount/purchaseOrderList',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}
// 导出统计
export function exportStatistics(obj){
	return axios({
		url:'/datacount/datacount/v1/interviewCount/exports',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}
// 流通统计导出接口
export function exportCirculation(obj){
	return axios({
		url:'/datacount/datacount/v1/circulation/exports',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}
//馆藏分类统计接口
export function collectionTypeCount(obj){
	return axios({
		url:'/datacount/datacount/v1/collection/collectionTypeCount',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}
// 馆藏统计导出接口
export function exportCollection(obj){
	return axios({
		url:'/datacount/datacount/v1/collection/exports',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}

// 馆藏处理统计获取操作人员接口
export function operationStaff(obj){
	return axios({
		url:'/datacount/datacount/v1/collection/operationStaff',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}
//馆藏处理统计接口
export function collManageCount(obj){
	return axios({
		url:'/datacount/datacount/v1/collection/collManageCount',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}
//馆藏分布统计接口
export function collDistriCount(obj){
	return axios({
		url:'/datacount/datacount/v1/collection/collDistriCount',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}

//馆藏现存统计接口
export function collExistingCount(obj){
	return axios({
		url:'/datacount/datacount/v1/collection/collExistingCount',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}


//获取分馆信息
export function forOrgAll(){
	return axios({
		url:'/organize/organize/v1/org/list/forOrgAll',
		method:'get',
	})
}


// 订购单导出统计
export function purOrderExport(obj){
  return axios({
    url:'/datacount/datacount/v1/interviewCount/purOrderExport',
    method:'get',
    params:{
      jsonStr:obj
    }
  })
}
// 借购单导出统计
export function lendBuyExport(obj){
  return axios({
    url:'/datacount/datacount/v1/interviewCount/lendBuyExport',
    method:'get',
    params:{
      jsonStr:obj
    }
  })
}
// 图书借购导出统计
export function bookLendExport(obj){
  return axios({
    url:'/datacount/datacount/v1/interviewCount/bookLendExport',
    method:'get',
    params:{
      jsonStr:obj
    }
  })
}
// 图书荐购导出统计
export function recommBuyExport(obj){
  return axios({
    url:'/datacount/datacount/v1/interviewCount/recommBuyExport',
    method:'get',
    params:{
      jsonStr:obj
    }
  })
}


















