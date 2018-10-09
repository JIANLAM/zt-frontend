
import axios from '@/axios/request'
// 采访参数模块公用api方法

// 供应商设置列表接口
export function supplierList(obj){
	return axios({
		url:'/apiParameter/apiParameter/v1/supplier/list',
		method:'get',
		params:{
			jsonStr:obj
		}	
	})
}

//供应商设置 ---  进入添加渲染
export function supplierAdd(obj){
	return axios({
		url:'/apiParameter/apiParameter/v1/supplier/add',
		method:'get'
	})
}
//供应商设置 ---  进入添加保存
export function supplierAddSave(obj){
	return axios({
		url:'/apiParameter/apiParameter/v1/supplier/save',
		method:'post',
		data:obj
	})
}
// 供应商设置 --- 编辑渲染
export function supplierEdit(Id){
	return axios({
		url:'/apiParameter/apiParameter/v1/supplier/edit/'+ Id,
		method:'get'
	})
}

// 供应商设置 ---- 编辑保存
export function supplierEditSave(obj){
	return axios({
		url:'/apiParameter/apiParameter/v1/supplier/update',
		method:'post',
		data:obj
	})
}

// 供应商设置  --- 删除
export function supplierDelete(Ids){
	return axios({
		url:'/apiParameter/apiParameter/v1/supplier/delete',
		method:'post',
		data: Ids
	})
}


// 收货地址设置列表渲染
export function takeInfoList(obj){
	return axios({
		url:'/apiParameter/apiParameter/v1/libraryaddress/list',
		method:'get',
		params:{
			jsonStr:obj
		}	
	})
}
// 收货设置  ---- 进入添加渲染
export function takeInfoAdd(){
	return axios({
		url:'/apiParameter/apiParameter/v1/libraryaddress/add',
		method:'get',
	})
}
// // 收货设置  ---- 进入添加保存
export function takeInfoAddSave(obj){
	return axios({
		url:'/apiParameter/apiParameter/v1/libraryaddress/save',
		method:'post',
		data: obj
	})
}

// 收货设置  ---- 编辑进入渲染
export function takeInfoEdit(Id){
	return axios({
		url:'/apiParameter/apiParameter/v1/libraryaddress/edit/' + Id,
		method:'get',
	})
}

// 收货设置  ---- 编辑保存
export function takeInfoEditSave(obj){
	return axios({
		url:'/apiParameter/apiParameter/v1/libraryaddress/update',
		method:'post',
		data: obj
	})
}

//收货设置 --- 批量删除
export function takeInfoDelete(Ids){
	return axios({
		url:'/apiParameter/apiParameter/v1/libraryaddress/delete',
		method:'post',
		data: Ids
	})
}