import axios  from '@/axios/request'


//文献来源
export function literatureSource(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/sys/literatureList",
        method:"get",
        params:{
            jsonStr:obj
        }
    })
}
//新增或修改文献来源接口
export function literatureSave(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/sys/literatureSave",
        method:"post",
        data:obj
    })
}
//删除一条或多条文献来源接口
export function literatureDelete(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/sys/delete/"+obj,
        method:"post",
    })
}
//装帧类型
export function bindingList(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/sys/bindingList",
        method:"get",
        params:{
            jsonStr:obj
        }
    })
}
//新增或修改文献来源接口
export function bindingSave(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/sys/bindingSave",
        method:"post",
        data:obj
    })
}
//载体类型
export function carrierList(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/sys/carrierList",
        method:"get",
        params:{
            jsonStr:obj
        }
    })
}
//新增或修改载体类型接口
export function carrierSave(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/sys/carrierSave",
        method:"post",
        data:obj
    })
}
//查询文献流通类型列表接口
export function circulationList(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/clt/circulationList",
        method:"get",
        params:{
            jsonStr:obj
        }
    })
}
//新增或修改文献流通类型接口
export function circulationSave(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/clt/circulationSave",
        method:"post",
        data:obj
    })
}
//查询读者证类型列表接口
export function readerCardList(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/clt/readerCardList",
        method:"get",
        params:{
            jsonStr:obj
        }
    })
}
//新增或修改文读者证类型接口
export function readerCardSave(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/clt/readerCardSave",
        method:"post",
        data:obj
    })
}
//删除读者证类型
export function delReaderCard(obj){
  return axios({
    url:"/apiParameter/apiParameter/v1/clt/delReaderCard/"+obj,
    method:"post",
  })
}
//查询馆藏状态设置列表接口
export function collStateList(obj){
    return axios({
        url:"/dictionary/dictionary/v1/dict/label/collState",
        method:"get",
        params:{
            jsonStr:obj
        }
    })
}
//查询指定数据字典列表接口
export function collStateList2(obj){
  return axios({
    url:"/dictionary/dictionary/v1/dict/label/collState",
    method:"get",
    params:{
      jsonStr:obj
    }
  })
}
//由isbn搜索出这书的数据
export function isbnSearch(obj){
  return axios({
    url:"/dictionary/dictionary/v1/pubhouse/info/isbn/"+obj,
    method:"get",
  })
}
//新增或修改馆藏状态设置接口
export function collStateSave(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/colle/collStateSave",
        method:"post",
        data:obj
    })
}

//查询馆藏地设置列表接口
export function collAddressList(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/colle/collAddressList",
        method:"get",
        params:{
            jsonStr:obj
        }
    })
}


//查询条码分区使用者列表接口
export function cuurLibraryUser(obj){
  return axios({
    url:"/apiParameter/apiParameter/v1/partition/list/cuurLibraryUser",
    method:"get",
    params:{
      jsonStr:obj
    }
  })
}

//查询当前用户创建的条码分区列表接口
export function partitionList2(obj){
  return axios({
    url:"/apiParameter/apiParameter/v1/partition/list/currUser",
    method:"get",
    params:{
      jsonStr:obj
    }
  })
}
//新增或修改文馆藏地设置接口
export function collAddressSave(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1//colle/collAddressSave",
        method:"post",
        data:obj
    })
}

//删除一条或多条馆藏地设置接口
export function colleDelete(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/colle/delete/"+obj,
        method:"post",
    })
}

//删除一条或多条馆藏地设置接口
export function cltDelete(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/clt/delete/"+obj,
        method:"post",
    })
}

//供应商设置
export function vendorSetting(obj){
    return axios({
        url:"",
        method:"get",
        params:{
            jsonStr:obj
        }
    })
}
//添加供应商
export function addVendor(obj){
    return axios({
        url:"",
        method:"get",
        params:{
            jsonStr:obj
        }
    })
}
//删除供应商
export function deteleVendor(obj){
    return axios({
        url:"",
        method:"get",
        params:{
            jsonStr:obj
        }
    })
}
//查询Z39.50地址设置列表接口
export function addressSetting(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/libDataBase/list",
        method:"get",
        params:{
            jsonStr:obj
        }
    })
}
//新增或修改Z39.50地址设置列表接口
export function addressSettingSave(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/libDataBase/save",
        method:"post",
        data:obj
    })
}
//删除Z39.50地址设置列表接口
export function addressSettingDelete(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/libDataBase/delete/"+obj,
        method:"post",
    })
}
//Z39.50地址设置列表接口详情
export function addressSettingDetail(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/libDataBase/getLibDataBase/"+obj,
        method:"get",
    })
}

// marc接口
//查询MARC字段列表接口
export function marcList(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/marc/list",
        method:"get",
        params:{
            jsonStr:obj
        }
    })
}
//新增或修改MARC字段接口
export function marcSave(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/marc/save",
        method:"post",
        data:obj
    })
}
//删除删除指定MARC字段接口
export function marcDelete(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/marc/delete/"+obj,
        method:"post",
    })
}
//查询单个MARC字段详情接口
export function marcDetail(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/marc/info/"+obj,
        method:"get",
    })
}

// MARC字段导出接口
export function exportMarc(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/marc/exportMarc",
        method:"get",
        data:obj
    })
}




// MARC模板
//查询MARC模板列表接口
export function marcFindMouldList(obj){
  return axios({
    url:"/apiParameter/apiParameter/v1/marc/findMouldList",
    method:"get",
    params:{
      jsonStr:obj
    }
  })
}
//新增或修改MARC模板接口
export function marcSaveMould(obj){
  return axios({
    url:"/apiParameter/apiParameter/v1/marc/saveMould",
    method:"post",
    data:obj
  })
}
//删除删除指定MARC模板接口
export function marcDeleteMould(obj){
  return axios({
    url:"/apiParameter/apiParameter/v1/marc/deleteMould/"+obj,
    method:"post",
  })
}
//查询单个MARC模板详情接口
export function marcDetailMould(obj){
  return axios({
    url:"/apiParameter/apiParameter/v1/marc/infoMould/"+obj,
    method:"get",
  })
}

// MARC模板导出接口
export function exportMarcMould(obj){
  return axios({
    url:"/apiParameter/apiParameter/v1/marc/exportMarcMould",
    method:"get",
    data:obj
  })
}
//MARC字段下载导出模板接口
export function exportMould2(obj){
  return axios({
    url:"/apiParameter/apiParameter/v1/marc/exportMould",
    method:"get",
    params:{
      jsonStr:obj
    }
  })
}
//MARC字段导入模板接口
export function importMould(obj){
  return axios({
    url:"/apiParameter/apiParameter/v1/marc/importMarc",
    method:"post",
    data:obj
  })
}

//MARC模板 设置为默认接口
export function marcOpen(id){
  return axios({
    url:"/apiParameter/apiParameter/v1/marc/open/"+id,
    method:"post",
  })
}

//MARC模板 设置为非默认接口
export function marcClose(id){
  return axios({
    url:"/apiParameter/apiParameter/v1/marc/colse/"+id,
    method:"post",
  })
}



// 条码分区
//查询条码分区参数列表接口
export function partitionList(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/partition/list",
        method:"get",
        params:{
            jsonStr:obj
        }
    })
}
//新增或修改条码分区参数接口
export function partitionListSave(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/partition/save",
        method:"post",
        data:obj
    })
}
//删除指定条码分区参数接口
export function partitionListDelete(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/partition/delete/"+obj,
        method:"post",
    })
}
//新增初始化最大条码区号接口
export function partitionListMax(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/partition/maxBarcodeNumber",
        method:"get",
    })
}
//查询发送邮箱设置列表接口
export function mailboxList(obj){
  return axios({
    url:"/apiParameter/apiParameter/v1/mailbox/list",
    method:"get",
    params:{
      jsonStr:obj
    }
  })
}
//新增或修改发送邮箱设置接口
export function mailboxListSave(obj){
  return axios({
    url:"/apiParameter/apiParameter/v1/mailbox/save",
    method:"post",
    data:obj
  })
}


//删除发送邮箱设置接口
export function mailboxListDelete(obj){
  return axios({
    url:"/apiParameter/apiParameter/v1/mailbox/delete/"+obj,
    method:"post",
  })
}
//验证发送邮箱设置接口
export function testSmtp(username,password,smtphost){
  return axios({
    url:"/circulate/circulate/v1/lend/testSmtp?username="+username+"&password="+password+"&smtphost="+smtphost,
    method:"get",

  })
}



//种次号
//查询种次号维护List集合列表接口
export function defendList(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/defend/list",
        method:"get",
        params:{
            jsonStr:obj
        }
    })
}
//新增或修改种次号维护接口
export function defendListSave(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/defend/save",
        method:"post",
        data:obj


    })
}
//删除指定种次号维护接口
export function defendListDelete(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/defend/delete/"+obj,
        method:"post",
    })
}
//新增初始化最大当前种号接口
export function defendListMax(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/defend/maxCurrSeednumber",
        method:"get",
    })
}
//由分类号获取索取号
export function classNumber(obj){
  return axios({
    url:"/apiParameter/apiParameter/v1/defend/maxCurrSeednumber/"+obj,
    method:"get",
  })
}
//种次号维护导出接口
export function defendExportExcel(obj){
  return axios({
    url:"/apiParameter/apiParameter/v1/defend/exportExcel",
    method:"get",
    params:{
      jsonStr:obj
    }
  })
}
//种次号维护下载导出模板接口
export function exportMould(obj){
  return axios({
    url:"/apiParameter/apiParameter/v1/defend/exportMould",
    method:"get",
    params:{
      jsonStr:obj
    }
  })
}


//查询馆内借阅规则
export function museumRulelist(obj){
    return axios({
        url:"/circulate/circulate/v1/rule/museumRulelist",
        method:"get",
        params:{
            jsonStr:obj
        }
    })
}
//查询馆际借阅规则
export function interlibraryRulelist(obj){
  return axios({
    url:"/circulate/circulate/v1/rule/interlibraryRulelist",
    method:"get",
    params:{
      jsonStr:obj
    }
  })
}
// 新增或修改借阅规则接口
export function ruleSave(obj){
    return axios({
        url:"/circulate/circulate/v1/rule/save",
        method:"post",
        data:obj
    })
}
//删除指定借阅规则接口
export function ruleDelete(obj){
    return axios({
        url:"/circulate/circulate/v1/rule/delete/"+obj,
        method:"post",
    })
}
// 借阅规则导出接口
export function exportRule(obj){
    return axios({
        url:"/circulate/circulate/v1/rule/exportRule",
        method:"get",
        params:{
            jsonStr:obj
        }
    })
}
//查询单个借阅规则详情接口
export function ruleDetail(obj){
    return axios({
        url:"/circulate/circulate/v1/rule/info/"+obj,
        method:"get",
    })
}
//启用借阅规则
export function ruleOpen(id){
    return axios({
        url:"/circulate/circulate/v1/rule/ruleOpen/"+id,
        method:"post",
    })
}

//禁用借阅规则
export function ruleClose(id,type){
    return axios({
        url:"/circulate/circulate/v1/rule/ruleClose/"+id,
        method:"post",
    })
}

// 自定义字段
//查询自定义字段设置列表接口
export function fieldList1(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/field/cusOnelist",
        method:"get",
        params:{
            jsonStr:obj
        }
    })
}
export function fieldList2(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/field/cusTwolist",
        method:"get",
        params:{
            jsonStr:obj
        }
    })
}
export function fieldList3(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/field/cusThreelist",
        method:"get",
        params:{
            jsonStr:obj
        }
    })
}
export function cusOneSave(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/field/cusOneSave",
        method:"post",
        data:obj
    })
}
export function cusTowSave(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/field/cusTowSave",
        method:"post",
        data:obj
    })
}
export function cusThreeSave(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/field/cusThreeSave",
        method:"post",
        data:obj
    })
}
export function fieldDelete(obj){
    return axios({
        url:"/apiParameter/apiParameter/v1/field/delete/"+obj,
        method:"post",
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
// 上传图片
export const readerImportPic=(params)=>{
  return axios({
    url:'/roleUser/user/v1/upload/pic',
    method:'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data:params
  })
}




