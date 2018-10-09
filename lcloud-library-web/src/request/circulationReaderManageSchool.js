import axios from '@/axios/request'
//流通管理-读者管理（学校馆）-毕业-查询年级列表接口
export const searchGradeList=(params)=>{
  return axios({
    url:'/grade/grade/v1/list',
    method:'get',
    params:params
  })
}
//流通管理-读者管理（学校馆）-毕业-查询年级所包含的班级列表接口
export const searchGradeClassList=(params)=>{
  return axios({
    url:'/grade/grade/v1/classes/list',
    method:'get',
    params:params
  })
}
//流通管理-读者管理（学校馆）-毕业-年级毕业接口
export const gradeGraduation=(params)=>{
  return axios({
    url:'/grade/grade/v1/graduate/'+params,
    method:'post'
  })
}
//流通管理-读者管理（学校馆）-读者信息-读者列表
export const readerList=(params)=>{
  return axios({
    url:'/roleUser/user/v1/reader/list',
    method:'get',
    params:params
  })
}
//流通管理-读者管理（学校馆）-读者信息-删除读者
export const deleteReaderInfo=(params)=>{
  return axios({
    url:'/roleUser/user/v1/reader/delete',
    method:'post',
    data:params
  })
}
//流通管理-读者管理（学校馆）-读者信息-图片上传
export const readerImportPic=(params)=>{
  return axios({
    url:'/roleUser/user/v1/upload/pic',
    method:'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data:params
  })
}

//流通管理-读者管理（学校馆）-读者信息-读者类型列表
export const readerTypeList=(params)=>{
  return axios({
    url:'/roleUser/user/v1/reader/readerTypeList',
    method:'get'
  })
}
//流通管理-读者管理（学校馆）-读者信息-添加和修改读者
export const addModifyReader=(params)=>{
  return axios({
    url:'/roleUser/user/v1/reader/operation',
    method:'post',
    data:params
  })
}
//流通管理-读者管理（学校馆）-读者信息-添加读者
export const addReader=(params)=>{
  return axios({
    url:'/roleUser/user/v1/reader/add',
    method:'post',
    data:params
  })
}
//流通管理-读者管理（学校馆）-读者信息-更新读者
export const updateReader=(params)=>{
  return axios({
    url:'/roleUser/user/v1/reader/update',
    method:'post',
    data:params
  })
}
//流通管理-读者管理（公共馆）-读者数据导出-读者数据导出
export const readerDataExport=(params)=>{
  return axios({
    url:'/roleUser/user/v1/reader/listExport',
    method:'get',
    params:params
  })
}
//流通管理-读者管理（公共馆）-读者数据导入-读者数据导入
export const readerDataImport=(params)=>{
  return axios({
    url:'/roleUser/user/v1/reader/listimport',
    method:'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data:params
  })
}
