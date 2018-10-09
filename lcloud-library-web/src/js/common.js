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
  return year+'.'+add0(month)+'.'+add0(date);
}
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
// 手机号验证
export function isvalidPhone(str) {
  const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
  return reg.test(str)
}
