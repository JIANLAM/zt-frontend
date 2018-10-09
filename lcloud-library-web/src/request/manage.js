import axios from '@/axios/request'

//查询借购订单列表-
export function ruleList(obj){
	return axios({
		url:'/lendbuy/lendbuy/v1/rule/list',
		method:'get',
		params:{
			jsonStr:obj
		}
	})
}

//新增或修改借购订单列表-
export function ruleListAdd(obj){
	return axios({
		url:'/lendbuy/lendbuy/v1/rule/save',
		method:'post',
		data:obj
	})
}
//启用借购规则
export function ruleListOn(readerType,id){
	return axios({
		url:'/lendbuy/lendbuy/v1/rule/'+readerType+'/on/'+id,
		method:'post',
	})
}
//禁用借购规则
export function ruleListOff(readerType,id){
	return axios({
		url:'/lendbuy/lendbuy/v1/rule/'+readerType+'/off/'+id,
		method:'post',
	})
}
// 删除借购规则
export function ruleListDelete(obj){
	return axios({
		url:'/lendbuy/lendbuy/v1/rule/delete/'+obj,
		method:'post',
	})
}
// 查看订单详情
export function ruleListInfo(obj){
	return axios({
		url:'/lendbuy/lendbuy/v1/rule/info/'+obj,
		method:'get',
	})
}
// 后台返回的状态要转换成true
export function getData(name,obj){
	this.loading=true;
    return new Promise((resolve,reject)=>{
        name(obj).then(data=>{
            console.log(data)
    		if(data.data.code==0){
                resolve();
    			this.dataPage=data.data.page;
    			if(data.data.page.list&&data.data.page.list.length>0){
					this.data=data.data.page.list;
					for(let i=0,length=this.data.length;i<length;i++){
						if(this.data[i].status==1){
							this.data[i].status=true
						}else{
							this.data[i].status=false
						}
					}
    			}else{
    				this.data=[];
    			}

    			this.loading=false;
    		}else{
                reject();
    			 this.$message({
    	          message: '错误!错误代码:'+data.data.code+','+data.data.msg,
    	          type: 'error'
    	        });
    		}
    	})
    })
}
