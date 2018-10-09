<template>
	<el-dialog :title="id==1?'新增规则':'修改规则'" :visible.sync="dialogTableVisible">
	  	<el-form ref="form1" :model="form1" :rules="rules2" status-icon label-width="100px"  size="small">
        <el-form-item label="规则名称" prop="ruleName">
            <el-input  v-model="form1.ruleName"  clearable></el-input>
        </el-form-item>
        <el-form-item label="复本数(本)" prop="duplicateQty">
          <el-tooltip class="item" effect="light" content="表示同一种图书最大可采购的复本数，为空或为0则表示不限制" placement="top">
            <el-input-number v-model="form1.duplicateQty"  :step="1" :min="0"></el-input-number>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="借购天数" prop="lendbuyDays">
            <el-input-number v-model="form1.lendbuyDays"  :step="1" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="出版年份" prop="">
          <el-tooltip class="item" effect="light" content="表示被借购的图书的出版年份，为空或为0则表示不限制" placement="top">
            <el-date-picker
              v-model="picker"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions2">
            </el-date-picker>
          </el-tooltip>
          <el-radio v-model="form1.publishYearAllow" label="1">包含已选</el-radio>
          <el-radio v-model="form1.publishYearAllow" label="-1">不包含已选</el-radio>
        </el-form-item>
        <el-form-item label="分类号" >
          <el-tooltip class="item" effect="light" content="表示借购的图书所属的分类号" placement="top">
             <el-select v-model="form1.categoryNo"  placeholder="请选择">
					    <el-option label="1" value="value1"></el-option>
					    <el-option label="2" value="value2"></el-option>
					    <el-option label="3" value="value3"></el-option>
				  	</el-select>	 


          &nbsp;</el-tooltip>
          <el-radio v-model="form1.categoryNoAllow" label="1">包含已选</el-radio>
          <el-radio v-model="form1.categoryNoAllow" label="-1">不包含已选</el-radio>
        </el-form-item>

        <el-form-item label="书名" prop="bookName">
          <el-tooltip class="item" effect="light" content="表示被借购的图书书名中不能包含的关键字" placement="top">
            <el-input  v-model="form1.bookName" class="input-with-select" clearable></el-input>
            &nbsp;</el-tooltip>
          <el-radio v-model="form1.bookNameAllow" label="1">包含已选</el-radio>
          <el-radio v-model="form1.bookNameAllow" label="-1">不包含已选</el-radio>
        </el-form-item>


        <el-form-item label="图书单价"  >
            <el-input-number v-model.number="lowPrice" :min="0" controls-position="right"></el-input-number>-
            <el-input-number v-model.number="highPrice" :min="0" controls-position="right"></el-input-number>
        </el-form-item>

        <el-form-item label="图书开本" prop="bookSize">
          <el-select v-model="form1.bookSize"  placeholder="请选择">
					    <el-option label="1" value="value1"></el-option>
					    <el-option label="2" value="value2"></el-option>
					    <el-option label="3" value="value3"></el-option>
				  	</el-select>	 
          <el-radio v-model="form1.bookSizeAllow" label="1">包含已选</el-radio>
          <el-radio v-model="form1.bookSizeAllow" label="-1">不包含已选</el-radio>
        </el-form-item>

        <el-form-item label="自动签收时间" prop="autoReceivedDays">
          <el-tooltip class="item" effect="light" content="表示图书将在书店发货后的天数后自动签收" placement="top">
            <el-input-number v-model="form1.autoReceivedDays"  :step="1" :min="0"></el-input-number>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="逾期罚款率" prop="overduePayrate">
          <el-tooltip class="item" effect="light" content="表示罚款的计算方式，罚款金额=图书价格*罚款率*逾期天数。" placement="top">
            <el-input-number v-model="form1.overduePayrate"  :step="0.1" :min="0"></el-input-number>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="丢失罚款率" prop="lostPayrate">
          <el-tooltip class="item" effect="light" content="表示罚款的计算方式，罚款金额=图书价格*罚款率" placement="top">
            <el-input-number v-model="form1.lostPayrate"  :step="0.1" :min="0"></el-input-number>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="污损罚款率" prop="brokenPayrate">
          <el-tooltip class="item" effect="light" content="表示罚款的计算方式，罚款金额=图书价格*罚款率" placement="top">
            <el-input-number v-model="form1.brokenPayrate"  :step="0.1" :min="0"></el-input-number>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="读者类型限制" prop="readerType">
          <el-tooltip class="item" effect="light" content="借购规则对读者类型的限制" placement="top">
            <el-select v-model="form1.readerType"  placeholder="请选择">
					    <el-option label="1" value="value1"></el-option>
					    <el-option label="2" value="value2"></el-option>
					    <el-option label="3" value="value3"></el-option>
				  	</el-select>	 
          </el-tooltip>
          <el-radio v-model="form1.readerTypeAllow" label="1">包含已选</el-radio>
          <el-radio v-model="form1.readerTypeAllow" label="-1">不包含已选</el-radio>
        </el-form-item>
        <el-form-item label="信用值限制" prop="credit">
          <el-tooltip class="item" effect="light" content="读者信用值必须大于此值才能使用借购功能。" placement="top">
            <el-input v-model.number="form1.credit"></el-input>
          </el-tooltip>
        </el-form-item>
        <!-- <el-form-item label="规则有效时间" prop="name">
	  		  		<el-col :span="8">
 							<el-date-picker
						      v-model="form1.startTime"
						      type="date"
						      readonly
						      placeholder="选择日期">
						    </el-date-picker>   
				    </el-col>
				    <el-col class="line" :span="2">-</el-col>
				    <el-col :span="8">
				       		<el-date-picker
						      v-model="form1.endTime"
						      type="date"
						 
						      placeholder="选择日期">
						    </el-date-picker>    
				    </el-col>		    
	  		  </el-form-item>-->
         <el-form-item label="是否启用" >   
	    			<el-switch v-model="status"  @change="changEnable"></el-switch>	    		   
	  		  </el-form-item>
          <el-form-item label="备注" prop="remark">
	     			 <el-input type="textarea" v-model="form1.remark"></el-input>   
	  		  </el-form-item> 
  		  <el-form-item>
      
  		    <el-button type="primary" @click="onSubmit(0)" icon="el-icon-plus" v-if="id==1">新增</el-button>
            <el-button type="primary" @click="onSubmit(1)"  v-else>立即修改</el-button>
  		    <el-button @click="dialogTableVisible=false">取消</el-button>
  		  </el-form-item>
		</el-form>

		
	</el-dialog>
</template>

<script>
  import {ruleListAdd} from '@/request/manage'
  export default{
  	name:'RuleDiaLog',
  	data(){
  		var validatePass= (rule, value, callback) => {
  			if (value === '') {
          		callback(new Error('请输入手机号'));
        	}else{
        		if(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(value)==false){
        			callback(new Error('请输入正确格式的手机号码!'));
        		}else{
        			 callback();
        		}
        	}
  		};
  		var validatePass2= (rule, value, callback) => {
  			if (value === '') {
          		callback(new Error('请输入邮政编码!'));
        	}else{
        		if(/^[0-9][0-9]{5}$/.test(value)==false){
        			callback(new Error('请输入正确格式的邮政编码!'));
        		}else{
        			 callback();
        		}
        	}
      };
      var validatePass3= (rule, value, callback) => {
  			if (value === '') {
                 callback()
        	}else{
        		if(isNaN(value)||Number(value)<0){
        			callback(new Error('请输入大于0的数字!'));
        		}else{
        			 callback();
        		}
        	}
  		};
  		return {
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
  			dialogTableVisible:false,
  			id:'',
        picker:[],
        // 单价
        lowPrice:'',
        highPrice:'',
        // 图书开本
        lowBook:"",
        highBook:'',
        lowBookPages:'',
        highBookPages:'',
        // 订单id
        orderNum:"",
        status:'false',
  			form:{
  				id:'',
  				name:'',
  				area:'',
  				address:'',
  				zipcode:'',
  				tel:'',
  				type:'',
  				op:[]
  			},
        // 新增规则或者修改规则
  			form1:{
          ruleName:'',
          duplicateQty:"",
          lendbuyDays:'',
          publishYear:'',
          publishYearAllow:'0',
          categoryNo:'',
          categoryNoAllow:'0',
          bookName:'',
          bookNameAllow:'0',
          bookPrice:'',
          bookSize:'',
          bookSizeAllow:'0',
          pages:'',
          status:'0',
          remark:"",
          publisher:'',
          publisherAllow:'0',
          autoReceivedDays:'',
          overduePayrate:'',
          lostPayrate:'',
          brokenPayrate:'',
          libraryId:1,
          readerType:'',
          readerTypeAllow:'',
          credit:'',
          startTime:new Date(),
          endTime:''
        },
        	form2:{
          ruleName:'',
          duplicateQty:"",
          lendbuyDays:'',
          publishYear:'',
          publishYearAllow:'0',
          categoryNo:'',
          categoryNoAllow:'0',
          bookName:'',
          bookNameAllow:'0',
          bookPrice:'',
          bookSize:'',
          bookSizeAllow:'0',
          pages:'',
          status:'0',
          remark:"",
          publisher:'',
          publisherAllow:'0',
          autoReceivedDays:'',
          overduePayrate:'',
          lostPayrate:'',
          brokenPayrate:'',
          libraryId:1,
          readerType:'',
          readerTypeAllow:'',
          credit:'',
          startTime:new Date(),
          endTime:''
  			},
  			options:'',
  			rules2:{
  			    credit:[
              { validator: validatePass3, trigger: 'blur' }
            ]
  			}
  		}
  	},

  	methods:{
      getData(){
         this.$emit('childMethod'); 
      },
      changEnable(){
        if(this.status==true){
            this.form1.status="1"
        }else{
           this.form1.status="0"
        }
       
      },
  		visible(id){
        this.dialogTableVisible=true;
     
          	this.id=id;
          	if(id==1){
                 this.form1=this.form2
            	this.$nextTick(function(){
                	this.$refs['form1'].resetFields();
            	})
        	}
  		},
  		init(row){
              this.orderNum=row.id
	            this.form1=row

      },
      // 如果为0，转换为空
      changeEmpty(...arr){
        console.log(arr);
        for(let i=0,length=arr.length;i<length;i++){
           if(arr[i]==0){
              arr[i]=""
           }
        }
        console.log(arr);
      },
  		onSubmit(types){
      this.$refs.form1.validate(valid => {
			  if (valid) {
          let diaMsg="修改成功！";
          if(this.lowPrice==""&&this.highPrice==""){
            this.form1.bookPrice=""
          }else{
             if(Number(this.highPrice)<=Number(this.lowPrice)){
                 this.$message({
               type: 'warning',
               message: '图书单价第二个要大于第一个数字',
               duration:'1000'
             });      
                 return
             }else{
               this.form1.bookPrice=this.lowPrice+"~"+this.highPrice;
             }
          }
          if(this.form1.duplicateQty==0){this.form1.duplicateQty=""}
          if(this.form1.lendbuyDays==0){this.form1.lendbuyDays=""}
          if(this.form1.autoReceivedDays==0){this.form1.autoReceivedDays=""}
          if(this.form1.brokenPayrate==0){this.form1.brokenPayrate=""}
          if(this.form1.lostPayrate==0){this.form1.lostPayrate=""}
          if(this.form1.overduePayrate==0){this.form1.overduePayrate=""}

          // this.form1.categoryNo=this.form1.categoryNo.join(",");
        if(types==1){
          diaMsg=="修改成功！";
          this.form1=Object.assign({},this.form1,{"id":this.orderNum})
        }else{
          diaMsg="新增成功"
        }
        ruleListAdd(this.form1).then(data=>{
          if(data.data.code==0){
          this.$message({
            type: 'success',
            message: diaMsg,
            duration:'2000'
          });
          this.form1=this.form2;
          this.form1.categoryNo=[];
          this.dialogTableVisible=false;
          this.picker="";
          this.status="false";
          this.form1.status=0;
          this.lowPrice='';
          this.highPrice="";
          this.form1.bookPrice=""

          this.getData()
             }else{
            this.$message({
            type: 'error',
            message: data.data.msg,
            duration:'2000'
          });

             }
        }).catch(err=>{
          this.$message({
            type: 'info',
            message: '操作失败，请重试!'
          });
        })

                  }
     })

  		},
     
  	},
    watch:{
      picker(newVal){
        if(newVal&&newVal.length>0){
          this.form1.publishYear=newVal[0]+"~"+newVal[1];
          console.log(newVal)
        }else{
          this.form1.publishYear='';
        }
      },
      form1(newVal){
         console.log('form1'+JSON.stringify(newVal))
      }
    },
    computed:{




    }
  }
</script>

<style type="style/css" scoped>

</style>
