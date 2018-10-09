import axios from '@/axios/request'

// 普通编目－查询
export function catalogList(obj){
	return axios({
		url:'/apiCatalog/apiCatalog/v1/catalogue/list',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}
// 普通编目－详情
export function catalogDetail(obj){
	return axios({
		url:'/apiCatalog/apiCatalog/v1/catalogue/cataloginfo',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}
// 普通编目－保存
export function catalogSave(obj){
	return axios({
		url:'/apiCatalog/apiCatalog/v1/catalogue/save',
		method:'post',
		data:obj
	})
}
// 普通编目－删除
export function catalogDelete(obj){
  return axios({
    url:'/apiCatalog/apiCatalog/v1/catalogue/singledelete',
    method:'post',
    data:obj
  })
}
// 验收编目查询
export function acceptancedetailList(obj){
	return axios({
		url:'/apiCatalog/apiCatalog/v1/acceptancedetail/list',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}
//API获取馆藏中最大的条码号(编目复本数Enter事件)
export function getmaxbarcode(obj){
	return axios({
		url:'/apiCatalog/apiCatalog/v1/catalog/getmaxbarcode',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}
// 外部图书－查询
export function foreignbooklist(obj){
	return axios({
		url:'/apiCatalog/apiCatalog/v1/catalog/foreignbooklist',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}
// 外部图书－详情
export function foreignbookinfo(obj){
	return axios({
		url:'/apiCatalog/apiCatalog/v1/catalog/foreignbookinfo',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}
// 验收编目查询
export function lendbuylist(obj){
	return axios({
		url:'/apiCatalog/apiCatalog/v1/catalog/lendbuylist',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}
// 书标查询列表http://192.168.1.97:8290/apiCatalog/v1/labelset/list
export function labelsetlist(obj){
	return axios({
		url:'/apiCatalog/apiCatalog/v1/labelset/list',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}
//书标保存http://192.168.1.97:8290/apiCatalog/v1/labelset/save
export function labelsetSave(obj){
	return axios({
		url:'/apiCatalog/apiCatalog/v1/labelset/save',
		method:'post',
		data:obj
	})
}
//书标删除http://192.168.1.97:8290/apiCatalog/v1/labelset/delete
export function labelsetDelete(obj){
	return axios({
		url:'/apiCatalog/apiCatalog/v1/labelset/delete',
		method:'post',
		data:obj
	})
}
//书标添加http://192.168.1.97:8290/apiCatalog/v1/labelset/add
export function labelsetAdd(obj){
	return axios({
		url:'/apiCatalog/apiCatalog/v1/labelset/add',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}
//书标修改http://192.168.1.97:8290/apiCatalog/v1/labelset/edit{id}
export function labelsetEdit(obj){
	return axios({
		url:'/apiCatalog/apiCatalog/v1/labelset/edit/'+obj,
		method:'get',
	})
}
//修改保存http://192.168.1.97:8290/apiCatalog/v1/labelset/update
export function labelsetUpdate(obj){
	return axios({
		url:'/apiCatalog/apiCatalog/v1/labelset/update',
		method:'post',
		data:obj
	})
}

// 书标列表查询
export function printlabel(obj){
	return axios({
		url:'/apiCatalog/apiCatalog/v1/labelset/getprintlabel',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}
// 打印模板下拉框
export function labelsetList(){
	return axios({
		url:'/apiCatalog/apiCatalog/v1/labelset/list',
		method:'get'
	})
}
//下载到中央库
export function downloadbook(obj){
	return axios({
		url:'/apiCatalog/apiCatalog/v1/catalog/downloadbook',
		method:'get',
		data:obj
	})
}
//下载到采访库
export function downloadprebook(obj){
	return axios({
		url:'/apiCatalog/apiCatalog/v1/catalog/downloadprebook',
		method:'get',
		data:obj
	})
}
// 编目日志
export function operationlog(obj){
	return axios({
		url:'/apioperationlog/apioperationlog/v1/operationlog/list',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}
// 获取默认参数;
export function defaultparam(obj){
  return axios({
    url:'/apiCatalog/apiCatalog/v1/defaultparam/info',
    method:'get',
    params:{
      jsonStr:obj
    }
  })
}
// 新增默认参数;
export function defaultparamSave(obj){
  return axios({
    url:'/apiCatalog/apiCatalog/v1/defaultparam/save',
    method:'post',
    data:obj
  })
}

// 书目导入导出采访库搜索
export function cataloguePreBook(obj){
	return axios({
	  url:'/apiCatalog/apiCatalog/v1/catalogue/preBook/list',
	  method:'get',
	  params:{
		jsonStr:obj
	  }
	})
  }

// 书目导入导出/采访库execl导出
export function exportPreBook(obj){
	return axios({
	  url:'/apiCatalog/apiCatalog/v1/catalogue/exportPreBook',
	  method:'get',
	  params:{
		jsonStr:obj
	  }
	})
  }

// 书目导入导出/采访库marc 导出
export function exportPrebookMARC(obj){
	return axios({
	  url:'/apiCatalog/apiCatalog/v1/catalogue/exportPrebookMARC',
	  method:'get',
	  params:{
		jsonStr:obj
	  }
	})
}
// 书目导入导出/ 采访库execl导入
export const importPrebook=(params)=>{
  return axios({
    url:'/apiCatalog/apiCatalog/v1/catalogue/importPrebook',
    method:'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data:params
  })
}
//  书目导入导出/ 采访库marc导入
export const importPrebookMarc=(params)=>{
  return axios({
    url:'/apiCatalog/apiCatalog/v1/catalogue/importPrebookMarc',
    method:'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data:params
  })
}

//   书目导入导出/采访库marc 内容详细
export function infoprePrebookMARC(preBookId){
		return axios({
			url:'/apiCatalog/apiCatalog/v1/catalogue/infopre/'+preBookId,
			method:'get'
		})
  }

// 书目导入导出中央库搜索
export function catalogueBook(obj){
		return axios({
			url:'/apiCatalog/apiCatalog/v1/catalogue/book/list',
			method:'get',
			params:{
			jsonStr:obj
			}
		})
  }

// 书目导入导出/中央库execl导出
export function exportBook(obj){
	return axios({
	  url:'/apiCatalog/apiCatalog/v1/catalogue/exportBook',
	  method:'get',
	  params:{
		jsonStr:obj
	  }
	})
  }

// 书目导入导出/中央库marc导出
export function exportBookMarc(obj){
	return axios({
	  url:'/apiCatalog/apiCatalog/v1/catalogue/exportBookMarc',
	  method:'get',
	  params:{
		jsonStr:obj
	  }
	})
	}
// 书目导入导出/中央库execl导入
export const importBook=(params)=>{
  return axios({
    url:'/apiCatalog/apiCatalog/v1/catalogue/importBook',
    method:'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data:params
  })
}
// 书目导入导出/ 中央库marc导入
export const importBookMarc=(params)=>{
  return axios({
    url:'/apiCatalog/apiCatalog/v1/catalogue/importBookMarc',
    method:'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data:params
  })
}

// 书目导入导出/中央库marc 内容详细
export function infoBookMarc(bookId){
	return axios({
	  url:'/apiCatalog/apiCatalog/v1/catalogue/info/'+bookId,
	  method:'get'
	})
}
	
// 书目导入导出/ marc导入预览
export const previewMarc=(params)=>{
  return axios({
    url:'/apiCatalog/apiCatalog/v1/catalogue/previewMarc',
    method:'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data: params
  })
}

// 书目导入导出/ excel导入预览
export const previewExcel=(params)=>{
  return axios({
    url:'/apiCatalog/apiCatalog/v1/catalogue/previewExcel',
    method:'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data: params
  })
}



