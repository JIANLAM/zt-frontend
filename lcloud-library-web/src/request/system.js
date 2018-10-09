import axios from '@/axios/request'

//新华机构数据
export function xh(obj){
	return axios({
		url:'/organize/organize/v1/org/list/xh',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}

//图书馆机构数据
export function gov(obj){
	return axios({
		url:'/organize/organize/v1/org/list/gov',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}
//成员馆机构数据
export function forOrgAll(obj){
  return axios({
    url:'/organize/organize/v1/org/list/forOrgAll',
    method:'get',
    params:{
      jsonStr:obj
    }
  })
}

//其他机构数据
export function otr(obj){
	return axios({
		url:'/organize/organize/v1/org/list/otr',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}

//新增或修改组织机构接口
export function orgSave(obj){
	return axios({
		url:'/organize/organize/v1/org/save',
		method:'post',
		data:obj
	})
}

//删除织机构接口
export function orgDelete(id){
	return axios({
		url:'/organize/organize/v1/org/delete/'+id,
		method:'post'
	})
}




//系统管理-角色管理列表
export const roleManageList=(params)=>{
  return axios.get('/roleUser/user/v1/role/list',{
    params:params
  })
}
//系统管理-角色管理列表-删除角色数据
export const roleManageDeleteItem=(params)=>{
  return axios.post('/roleUser/user/v1/role/delete',params)
}
//系统管理-角色管理列表-添加角色
export const roleManageAddRole=(params)=>{
  return axios.post('/roleUser/user/v1/role/add',params)
}
//系统管理-角色管理列表-更新角色
export const roleManageUpdateRole=(params)=>{
  return axios.post('/roleUser/user/v1/role/update',params)
}
//系统管理-角色管理列表-新增和修改的机构类别列表
export const roleManageOrgTypeList=()=>{
  return axios.get('/roleUser/user/v1/org/typelist')
}
//系统管理-用户管理列表
export const userManageList=(params)=>{
  return axios.get('/roleUser/user/v1/user/admlist',{
    params:params
  })
}
//系统管理-用户管理列表-删除用户数据
export const userManageDeleteItem=(params)=>{
  return axios.post('/roleUser/user/v1/user/delete',params)
}
//系统管理-用户管理列表-增加和修改角色列表（下拉）
export const userManageRoleList=()=>{
  return axios.get('/roleUser/user/v1/role/litelist')
}
//系统管理-用户管理列表-机构列表
export const userManageOrgList=(params)=>{
  return axios.get('/roleUser/user/v1/org/list',{
    params:params
  })
}
//系统管理-用户管理列表-添加用户
export const userManageAddUser=(params)=>{
  return axios.post('/roleUser/user/v1/user/admadd',params)
}
//系统管理-用户管理列表-更新用户
export const userManageUpdateUser=(params)=>{
  return axios.post('/roleUser/user/v1/user/update',params)
}
//菜单和操作
// export const permList=()=>{
//   return axios.get('/roleUser/user/v1/perm/list')
// }
export const permList=()=>{
  return axios.get('/roleUser/user/v1/role/getAddRoleList')
}
export function roleDetail(obj){
  return axios({
    url:'/roleUser/user/v1/role/detail',
    method:'get',
    params:{
      jsonStr:obj
    }
  })
}
