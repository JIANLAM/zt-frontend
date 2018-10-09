import axios from '@/axios/request'
//数据查询-流通查询-图书借阅查询接口
export const bookLendSearch=(params)=>{
  return axios({
    url:'/currentSearch/dataquery/v1/lend/books',
    method:'get',
    params:params
  })
}
//数据查询-流通查询-图书借阅详情查询（馆藏信息）接口
export const bookLendDetailSearch=(params)=>{
  return axios({
    url:'/currentSearch/dataquery/v1/lend/books/holding',
    method:'get',
    params:params
  })
}
//数据查询-流通查询-图书借阅详情查询（馆藏信息）接口-对应导出数据接口
export const bookLendDetailExport=(params)=>{
  return axios({
    url:'/currentSearch/dataquery/v1/lend/books/holding/export',
    method:'get',
    params:params
  })
}
//数据查询-流通查询-图书借阅史查询（借阅记录）接口
export const bookLendHistoryDetailSearch=(params)=>{
  return axios({
    url:'/currentSearch/dataquery/v1/lend/books/record',
    method:'get',
    params:params
  })
}
//数据查询-流通查询-图书借阅史查询（借阅记录）接口-对应导出数据接口
export const bookLendHistoryDetailExport=(params)=>{
  return axios({
    url:'/currentSearch/dataquery/v1/lend/books/record/export',
    method:'get',
    params:params
  })
}
//数据查询-流通查询-读者借阅查询接口
export const readerLendSearch=(params)=>{
  return axios({
    url:'/currentSearch/dataquery/v1/lend/reader/holding',
    method:'get',
    params:params
  })
}
//数据查询-流通查询-读者借阅查询接口-对应导出数据接口
export const readerLendSearchExport=(params)=>{
  return axios({
    url:'/currentSearch/dataquery/v1/lend/reader/holding/export',
    method:'get',
    params:params
  })
}
//数据查询-流通查询-读者财经查询接口
export const readerFinanceSearch=(params)=>{
  return axios({
    url:'/currentSearch/dataquery/v1/finance/list',
    method:'get',
    params:params
  })
}
//数据查询-流通查询-读者财经查询接口-对应导出数据接口
export const readerFinanceSearchExport=(params)=>{
  return axios({
    url:'/currentSearch/dataquery/v1/finance/list/export',
    method:'get',
    params:params
  })
}
//数据查询-流通查询-图书污损查询接口
export const bookDirtySearch=(params)=>{
  return axios({
    url:'/currentSearch/dataquery/v1/finance/list/broken',
    method:'get',
    params:params
  })
}
//数据查询-流通查询-图书污损查询接口-对应导出数据接口
export const bookDirtySearchExport=(params)=>{
  return axios({
    url:'/currentSearch/dataquery/v1/finance/list/broken/export',
    method:'get',
    params:params
  })
}
//数据查询-流通查询-图书污损查询接口-查询文献流通类型列表接口
export const SearCirculationTypeList=(params)=>{
  return axios({
    url:"/apiParameter/apiParameter/v1/clt/circulationList",
    method:'get',
    params:params
  })
}
//数据查询-流通查询-图书丢失查询接口
export const bookLostSearch=(params)=>{
  return axios({
    url:'/currentSearch/dataquery/v1/finance/list/lost',
    method:'get',
    params:params
  })
}
//数据查询-流通查询-图书丢失查询接口-对应导出数据接口
export const bookLostSearchExport=(params)=>{
  return axios({
    url:'/currentSearch/dataquery/v1/finance/list/lost/export',
    method:'get',
    params:params
  })
}
