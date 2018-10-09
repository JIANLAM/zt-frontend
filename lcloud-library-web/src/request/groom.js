import axios from '@/axios/request'

//获取推荐图书
export function acqbookList(title){
	return axios({
	    url: 'http://192.168.1.98:8181/libcloud/groom/acqbook/list',
	    method: 'get',
	    params: {
		    title: title
		}	  
  	})
}

//获取订单列表
export function acqbillList(params){
	return axios({
	    url: 'http://192.168.1.98:8181/libcloud/groom/acqbill/list',
	    method: 'get',
	    params: {
		    params: params
		}
  	})
}

//获取订单内容
export function billBooks(billId){
	return axios({
	    url: 'http://192.168.1.98:8181/libcloud/groom/acqbill/bill/'+billId+'/books',
	    method: 'get',
  	})
}


export function textListss(){
	return axios({
	    url: '/test/listss',
	    method: 'get'
  	})
}


