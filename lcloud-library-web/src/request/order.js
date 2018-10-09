import axios from '@/axios/request'


//征订目录订单列表查询
export function orderbuy(obj){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchaseorder/list',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}

//征订目录规则查询
export function orderbuyrule(Id){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchaseorder/edit/' + Id,
		method:'get'	
	})
}


//征订目录 添加订购单时自动生成订购单信息（订购号、创建时间等）
export function orderbuyAdd(){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchaseorder/add',
		method:'get'	
	})
}

//征订目录  新增订购单保存
//
export function orderbuySave(obj){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchaseorder/save',
		method:'post',
		data:obj		
	})
}

//订购单修改保存
//参数:{remark,ruleId,orderBuyNum,orderBuyId}
export function orderbuyUpdate(obj){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchaseorder/update',
		method:'post',
		data:obj	
	})
}

//订购单删除
//参数:{orderBuyId:'1,2,3'}
export function orderbuyDelete(obj){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchaseorder/delete',
		method:'post',
		data:obj	
	})
}

//订购单提交
//参数:{"ids":'1,2,3,4,',"orderStatus":'1'}
export function orderbuyCommit(obj){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchaseorder/commit',
		method:'post',
		data:obj	
	})
}

//订购单自动审核
//参数:{orderBuyId:'1,2,3'}
export function autoCheck(obj){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchasebook/autocheck',
		method:'post',
		data:obj	
	})
}

//订购图书查询

export function orderbuyBookList(obj){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchaseorder/list',
		method:'post',
		data:obj	
	})
}

//添加图书检索

export function searchBookList(obj){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/prebook/querylist',
		method:'get',
		params:{
			jsonStr:obj
		}	
	})
}

//订购单图书添加

export function addBooks(obj){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchaseorder/addbooks',
		method:'post',
		data: obj
	})
}

//订购单已选图书查询
export function selectedBooks(obj){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchasebook/list',
		method:'get',
		params:{
			jsonStr:obj
		}	
	})
}

//已选图书订购数修改

export function setbookqty(obj){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchasebook/setbookqty',
		method:'post',
		data:obj
	})
}

//已选图书移除
export function bookDelete(obj){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchasebook/delete',
		method:'post',
		data:obj
	})
}

//已选图书查重
export function dupcheck(obj){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchasebook/dupcheck',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}

//来源图书查重
//{"ids":'1,2',”libraryId”:’1’}
export function dupsearch(obj){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchasebook/dupsearch',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}

//导出订购单信息
//{"ids":'4,5'}
export function exportOrders(obj){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchaseorder/export',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}

//荐购查询
export function recommbuyList(obj){
	return axios({
		url:'/apiRecommBuy/apiRecommBuy/v1/recommbuy/listlibrary',
		method:'get',
		params:{
			jsonStr:obj
		}	
	})
}
// 荐购加入订购单 
export function addrecommbuy(ids){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchaseorder/addrecommbuy',
		method:'post',
		data: ids
	})
}
// API荐购列表导出接口
export function exportRecommbuy(obj){
	return axios({
		url:'/apiRecommBuy/apiRecommBuy/v1/recommbuy/export',
		method:'get',
		params:{
			jsonStr:obj
		}	
	})
}

//订购规则列表获取接口
export function purchaseruleList(obj){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchaserule/list',
		method:'get',
		params:{
			jsonStr:obj
		}	
	})
}

//订购规则添加
export function addRule(obj){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchaserule/add',
		method:'get',
		params:{
			jsonStr:obj
		}	
	})
}

//订购规则添加保存
export function addRuleSave(obj){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchaserule/save',
		method:'post',
		data:obj	
	})
}

// 订购规则修改
export function editRule(id){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchaserule/edit/' + id,
		method:'get'
	})
}

//订购规则修改保存
export function editRuleSave(obj){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchaserule/update',
		method:'post',
		data:obj	
	})
}

//订购规则删除
//ids:'1,2'
export function deleteRule(obj){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchaserule/delete',
		method:'post',
		data:obj	
	})
}

//订购规则启用接口
export function setstatus(obj){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchaserule/setstatus',
		method:'post',
		data:obj	
	})
}

//图书导入接口
export function importFile(obj){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchasebook/import',
		method:'post',
		headers: {'Content-Type': 'application/json;charset=UTF-8'},
		data:obj	
	})
}

//图书导出接口
export function exportFile(obj){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchasebook/export',
		method:'get',
		params:{
			jsonStr:obj
		}	
	})
}

//审核未通过的强行通过
export function adopt(obj){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchasebook/checked',
		method:'post',
		data:obj
	})
}

// -------------- 财经管理

//财经管理列表
export function finance(obj){
	return axios({
		url:'/apiBudget/apiBudget/v1/budget/list',
		method:'get',
		params:{
			jsonStr:obj
		}	
	})
}

// 财经删除列表选中数据接口
export function financeDelete(obj){
	return axios({
		url:'/apiBudget/apiBudget/v1/budget/delete',
		method:'post',
		data:obj
	})
}

// 财经预算添加 生成数据接口
export function budgetBuyAdd(obj){
	return axios({
		url:'/apiBudget/apiBudget/v1/budget/add',
		method:'get'
	})
}


// 财经预算添加保存接口
export function BudgetSave(obj){
	return axios({
		url:'/apiBudget/apiBudget/v1/budget/save',
		method:'post',
		data:obj		
	})
}

// 财经预算修改 生成数据接口
export function editBudget(Id){
	return axios({
		url:'/apiBudget/apiBudget/v1/budget/edit/' + Id,
		method:'get',
	})
}
// 财经预算修改保存接口
export function editSave(obj){
	return axios({
		url:'/apiBudget/apiBudget/v1/budget/update',
		method:'post',
		data:obj
	})
}

// 财经预算表导出接口
export function exportBudget(obj){
	return axios({
		url:'/apiBudget/apiBudget/v1/budget/export',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}

// 订购单导出
export function exportOrderList(obj){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchaseorder/export',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}



// ----------------- 订购验收 -----------------------

// 订购验收列表
export function accept(obj){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchaseorder/acceptlist',
		// url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchaseorder/acceptlist.json',
		method:'get',
		params:{
			jsonStr:obj
		}	
	})
}

// 单批次验收列表
export function orderbatchbook(obj){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/orderbatchbook/list',
		method:'get',
		params:{
			jsonStr:obj
		}	
	})
}

// 单批次验收提交 
export function accepted(obj) {
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/orderbatchbook/accepted',
		method:'post',
		data:obj		
	})
}

// 订购验收 ---- 订单详情列表api
export function checkDetail(Id){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchasebook/getaccepted',
		method:'get',
		params:{
			jsonStr:Id
		}	
	})
}

// 订购导出
export function orderbatchbookExport(ids){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/orderbatchbook/export',
		method:'get',
		params:{
			jsonStr: ids
		}	
	})
}

// 订单验收 ---- 订单详情 ----生成催缺单api
export function exportLack(Id){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchasebook/exportlack',
		method:'get',
		params:{
			jsonStr:Id
		}	
	})
}

// 订购规则审核者名称
export function operatorList(){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchaserule/operatorList',
		method:'get'
	})
}

// 豆瓣搜索图书
export function doubanBook(obj){
	return axios({
		url:'/currentSearch/booksearch/v1/douban/book',
		method:'get',
		params: obj
	})
}

// 采访日志
export function purchaseorderLogs(obj){
	return axios({
		url:'/apiPurchaseOrder/apiPurchaseOrder/v1/purchaseorder/logs',
		method:'get',
		params: obj
	})
}

