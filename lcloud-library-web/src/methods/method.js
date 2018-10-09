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



export function format(fmt) {
    var o = {
    "M+" : this.getMonth()+1, //月份
    "d+" : this.getDate(), //日
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
    "H+" : this.getHours(), //小时
    "m+" : this.getMinutes(), //分
    "s+" : this.getSeconds(), //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S" : this.getMilliseconds() //毫秒
    };
    var week = {
    "0" : "/u65e5",
    "1" : "/u4e00",
    "2" : "/u4e8c",
    "3" : "/u4e09",
    "4" : "/u56db",
    "5" : "/u4e94",
    "6" : "/u516d"
    };
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}
//前面是否加零
function add0(m){return m<10?'0'+m:m }
//时间戳转化成时间格式
export function timeFormat(timestamp){
  //timestamp是整数，否则要parseInt转换,不会出现少个0的情况
  var time = new Date(timestamp);
  var year = time.getFullYear();
  var month = time.getMonth()+1;
  var date = time.getDate();
  var hours = time.getHours();
  var minutes = time.getMinutes();
  var seconds = time.getSeconds();
  return year+'-'+add0(month)+'-'+add0(date);
}
/**
 * 18位身份证号码校验
 */
export function isIdCard(idcard){
  if(!idcard){
    return false;
  }
  if(idcard.length<18){
    return false;
  }
  let len = 17;
  let sum = 0;
  let yzArray = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];
  let codeArray = ['1','0','X','9','8','7','6','5','4','3','2'];
  for(let i=0;i<len;i++){
    sum+=idcard[i]*yzArray[i];
  }
  let mod = sum%11;
  if( codeArray[mod]==idcard[17]){
    return true;
  }
  return false;
}
