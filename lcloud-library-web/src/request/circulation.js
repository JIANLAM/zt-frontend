import axios from '@/axios/request'

//  -------------读者公共管  ----

// 读者信息管理
export function userReader(obj){
	return axios({
		url:'/roleUser/user/v1/reader/list',
		method:'get',
		params:obj	
	})
}

// 读者财经
export function readerFinance(obj){
	return axios({
		url:'/dataquery/dataquery/v1/finance/list',
		method:'get',
		params: obj
	})
}


// ----------------  读者管理（学校馆）  ----------
// 部门设置列表
export function deptList(obj){
	return axios({
		url:'/grade/grade/v1/dept/list',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}

// 查看单个部门详情
export function deptInfo(id){
	return axios({
		url:'/grade/v1/dept/info/' + id,
		method:'get'
	})
}

// 新增或者修改部门信息接口
export function deptSave(obj){
	return axios({
		url:'/grade/grade/v1/dept/save',
		method:'post',
		data: obj
	})
}

// 删除部门信息
export function deptDelete(Id){
	return axios({
		url:'/grade/grade/v1/dept/delete/' + Id,
		method:'post'
	})
}

// 年级列表
export function gradeList(obj){
	return axios({
		url:'/grade/grade/v1/list',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}

// 新增或者修改年级信息接口
export function gradeSave(obj){
	return axios({
		url:'/grade/grade/v1/save',
		method:'post',
		data: obj
	})
}

// 删除年级信息
export function gradeDelete(Id){
	return axios({
		url:'/grade/grade/v1/delete/'+ Id,
		method:'post'
	})
}

// 查看年级信息grade/v1/info/{id}
export function gradeInfo(id){
	return axios({
		url:'/grade/grade/v1/info/'+ id,
		method:'get'
	})
}

// 查看班级设置
export function classesList(obj){
	return axios({
		url:'/grade/grade/v1/classes/list',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}

// 学段接口返回年级名称下拉框数据
export function levelName(type){
	return axios({
		url:'/dictionary/dictionary/v1/dict/label/'+ type,
		method:'get'
	})
}

// 班级修改、添加
export function classesSave(obj){
	return axios({
		url:'/grade/grade/v1/classes/save',
		method:'post',
		data: obj
	})
}

// 删除
export function classesDelete(Id){
	return axios({
		url:'/grade/grade/v1/classes/delete/'+ Id,
		method:'post'
	})
}

// 升级
export function upgrade(Id){
	return axios({
		url:'/grade/grade/v1/upgrade/'+ Id,
		method:'post'
	})
}


// -------------  流通处理 --------------

// 借出处理
export function loanProcessing(obj){
	return axios({
		url:'/circulate/circulate/v1/lends/lendbook',
		method:'get',
		params: obj	
	})
}

//读者信息
export function lendReader(obj){
	return axios({
		url:'/circulate/circulate/v1/lends/reader',
		method:'get',
		params: obj

	})
}

// 图书信息
export function lendBook(obj){
	return axios({
		url:'/circulate/circulate/v1/lends/book',
		method:'get',
		params: obj
	})
}

// 借书时的图书信息
export function bookInLend(obj){
	return axios({
		url:'/circulate/circulate/v1/lends/bookInLend',
		method:'get',
		params: obj
	})
}

// 还回处理
export function lendBackbook(obj){
	return axios({
		url:'/circulate/circulate/v1/lends/backbook',
		method:'get',
		params: obj
	})
}

// 在借图书信息
export function readerlendbookInfo(obj){
	return axios({
		url:'/circulate/circulate/v1/lends/readerlendbookInfo',
		method:'get',
		params: obj
	})
}

// 续借处理
export function relendbook(obj){
	return axios({
		url:'/circulate/circulate/v1/lends/relendbook',
		method:'post',
		data: obj
	})
}

// 代借处理列表
export function helpLendList(obj){
	return axios({
		url:'circulate/circulate/v1/lends/helpLendList',
		method:'get',
		params: {
			jsonStr:obj
		}
	})
}

// 代借处理
export function helpLendProcess(obj){
	return axios({
		url:'/circulate/circulate/v1/lends/helpLendProcess',
		method:'post',
		data: obj
	})
}

// 代還處理列表
export function helpBackList(obj){
	return axios({
		url:'/circulate/circulate/v1/lends/helpBackList',
		method:'get',
		params: obj
	})
}

// 借还通知列表(借阅催还)
export function noteicList(obj){
	return axios({
		url:'/circulate/circulate/v1/overdue/noteicList',
		method:'get',
		params: {
			jsonStr:obj
		}
	})
}

// 借购催还列表
export function overduelist(obj){
	return axios({
		url:'/circulate/circulate/v1/overdue/list',
		method:'get',
		params: {
			jsonStr:obj
		}
	})
}

// 验证SMTP服务器 
export function testSmtp(obj){
	return axios({
		url:'/circulate/circulate/v1/lend/testSmtp',
		method:'get',
		params: obj
	})
}

// 发送通知（借阅催还）
export function sendNotice(obj){
	return axios({
		url:'/circulate/circulate/v1/overdue/sendNotice ',
		method:'post',
		data: obj
	})
}

// 发送通知（借购催还）
export function overdueSave(obj){
	return axios({
		url:'/circulate/circulate/v1/overdue/save ',
		method:'post',
		data: obj
	})
}

// ------- 借购还回 -------

// 借购图书信息
export function lendBuyBookInfo(obj){
	return axios({
		url:'/circulate/circulate/v1/lends/lendBuyBookInfo',
		method:'get',
		params: obj
	})
}

// 借购读者信息
export function lendBuyReader(obj){
	return axios({
		url:'/circulate/circulate/v1/lends/lendBuyReader',
		method:'get',
		params: obj
	})
}

// 借购还回
export function lendBuyBookProcess(obj){
	return axios({
		url:'/circulate/circulate/v1/lends/lendBuyBookProcess',
		method:'get',
		params: obj
	})
}

//  流通日志
export function lendLogs(obj){
	return axios({
		url:'/circulate/circulate/v1/lends/logs',
		method:'get',
		params: {
			jsonStr:obj
		}
	})
}

// 污损处理
export function stained(obj){
	return axios({
		url:'/circulate/circulate/v1/lends/stained',
		method:'get',
		params: obj
	})
}

// 丢失处理
export function lendLose(obj){
	return axios({
		url:'/circulate/circulate/v1/lends/lose',
		method:'get',
		params: obj
	})
}

//  代借处理导出
export function helpLendListExport(obj){
	return axios({
		url:'/circulate/circulate/v1/lends/helpLendListExport',
		method:'get',
		params: obj
	})
}

//  代还处理导出circulate/v1/lend/
export function helpBackListExport(obj){
	return axios({
		url:'/circulate/circulate/v1/lends/helpBackListExport',
		method:'get',
		params: obj
	})
}

// 借阅规则
export function ruleList(){
	return axios({
		url:'/circulate/circulate/v1/rules/list',
		method:'get'
	})
}

// 操作员下拉接口
export function operatorList(){
	return axios({
		url:'/circulate/circulate/v1/lends/operatorList',
		method:'get'
	})
}



