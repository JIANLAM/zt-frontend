 <template>
 	<div class="catalong">
		<el-form :inline="true" :model="searchForm" class="demo-form-inline" cl>
      <span v-if="searchButton">
           <el-form-item label="条形码检索范围">
		        <el-input v-model="searchForm.barcodeStart" clearable></el-input>
		    </el-form-item>
		    <el-form-item label="至">
		        <el-input v-model="searchForm.barcodeEnd"  clearable></el-input>
		    </el-form-item>
            <el-form-item label="分号类范围">
		        <el-input v-model="searchForm.bookTypeStart" clearable></el-input>
		    </el-form-item>
		    <el-form-item label="至">
		        <el-input v-model="searchForm.bookTypeEnd"  clearable></el-input>
		    </el-form-item>
			<el-form-item label="索取号范围">
				<el-input v-model="searchForm.callNoStart" clearable></el-input>
			</el-form-item>
			<el-form-item label="至">
				<el-input v-model="searchForm.callNoEnd"  clearable></el-input>
			</el-form-item>
			<el-form-item  label="打印模板">
				<el-select v-model="searchForm.labelSetId"  placeholder="请选择" :style="{width:'220px'}" @change="processResultFun3(1)">
					<el-option :label="item.labelName"  :value="item.id" v-for="(item,index ) in labelsetData" :key='index'></el-option>
				</el-select>
			</el-form-item>
      </span>
			<el-form-item>
			<el-button  type="primary" v-if="searchButton"  icon="el-icon-search" @click="search">查询</el-button>
			<el-button  type="warning" v-if="searchButton1"  icon="iconfont icon-daoru" @click="processResultFun2(1,'print')" :disabled="data.length==0">打印</el-button>
		</el-form-item>
		</el-form>
		<article class="tab_wrap">
			<ul class="clearfix process_result_tab">
				<li class="fl"  @click="processResultFun(0)" :class="{actived:processResultState==0}">查询结果</li>
				<li class="fl"  @click="processResultFun2(1)" :class="{actived:processResultState==1}" v-if="searchButton1">打印预览</li>
			</ul>
			<div style="padding: 15px" id="a" v-show="processResultState== 0">
				<el-button type="primary" :disabled="selection.length==0" size='small' @click="deleteBatch(data)">批量删除</el-button>
				<el-table
					:data="data"
					border
					style="width: 100%;margin-top:10px;"
					@selection-change="selectChange">
					<el-table-column
					type="selection"
					width="40">
					</el-table-column>
					<el-table-column
					type="index"
					width="50"
					label="序号">
					</el-table-column>
					<el-table-column
					prop="barcode"
					label="条码号"
					width="180">
					</el-table-column>
					<el-table-column
					prop="callNo"
					label="索取号">
					</el-table-column>
					<el-table-column
					prop="isbn"
					label="ISBN">
					</el-table-column>
					<el-table-column
					prop="title"
					label="书名">
					</el-table-column>
					<el-table-column
					prop="author"
					label="作者">
					</el-table-column>
					<el-table-column
					label="操作">
						<template slot-scope="scope">
							<el-button type="text" @click.native.prevent="deleteRow(scope.$index, data)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination
					:page-sizes="[5, 10, 15,20]"
					:page-size="dataPage.pageSize"
					:current-page="dataPage.pageNum"
					layout="total, sizes, prev, pager, next, jumper"
					:total="dataPage.total"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					>
				</el-pagination>
			</div>
			<div  v-show="processResultState==1" class="clearfix" id="printDiv"  v-loading='loading2'  >
				<!-- 打印预览 -->
				<div id="print" class="print" ref="print">
					<div :style="{width:(Number(printStyle.lableWeight)+Number(printStyle.leftSpace))*Number(printStyle.columnCount)-Number(printStyle.leftSpace)+Number(printStyle.lableWeight)/2+'mm'}">
					<div class="printList"  v-for="(item,index) in printData" :key="index">
						<div class="line">{{item[printStyle.oneRow]}}</div>
						<div class="line">{{item[printStyle.twoRow]}}</div>
						<div class="line">{{item[printStyle.threeRow]}}</div>
            <div class="line">{{item[printStyle.fourRow]}}</div>
					</div>
					</div>
				</div>
			</div>
    	</article>
 	</div>
 </template>
 <script>
import { printlabel, labelsetList } from "@/request/catalog";
export default {
  data() {
	let processResult=['查询结果','打印预览'];
    return {
      listLoading: false,
      picker: [],
      form: {
        pageNum: 1,
        pageSize: 10
	  },
	  selection: [],
	  searchForm: {
		  barcodeStart: '',
		  barcodeEnd: '',
		  bookTypeStart: '',
		  bookTypeEnd: '',
		  callNoStart: '',
		  callNoEnd: '',
		  labelSetId: ''
	  },
      dataPage: {},
	  data: [],
    printData:[],
	  labelsetData: [],
	  processResult: processResult,//处理结果-在借图书信息的导航切换
	  processResultState: 0,//处理结果状态的变化
	  printStyle:{},
    power:[],//按钮权限数组
    searchButton:false,
    searchButton1:false,
    forNumber:0,
    loading2:false,

    };
  },
  created() {
    this.getPowerArr();
	  this.getLabelsetList();
  },
  methods: {
    //得到权限按钮数组
    getPowerArr(){
      let  obj;
      let  power =this.$route.meta.power;
      for(let i=0,len=power.length;i<len;i++){
        if(power[i].name=='检索'){
          this.searchButton=true;
        }
        if(power[i].name=='打印'){
          this.searchButton1=true;
        }
      }
      this.power=power;
    },
	getPrintlabelt(obj) {
		printlabel(obj).then(data =>{
			if(data.data.code == 0) {
				this.dataPage = data.data.page;
				this.data = data.data.page.list;
			}else {
				this.$message({
					type: "error",
					message: data.data.msg,
					duration: 3 * 1000,
					showClose: true
				});
			}
		})
	},
	getLabelsetList() {
		labelsetList({pageNum:1, pageSize:1000}).then(data =>{
			if(data.data.code == 0) {
				this.labelsetData = data.data.page.list;
				this.searchForm.labelSetId=this.labelsetData[0].id
			}else {
				this.$message({
					type: "error",
					message: data.data.msg,
					duration: 3 * 1000,
					showClose: true
				});
			}
		})
	},
	deleteRow(index, rows) {
		rows.splice(index, 1);
		this.dataPage.total=this.data.length;
	},
	deleteBatch() {
		for(let i=0;i<this.data.length;i++){
			for(let j=0;j<this.selection.length;j++){
				if(this.data[i].holdingId==this.selection[j].holdingId){
					this.data.splice(i,1);
				}
			}
		}
		this.dataPage.total=this.data.length;
	},
	search() {
    this.processResultState=0
		this.form = {
			pageNum: 1,
			pageSize: 10
		}
		Object.assign(this.form, this.searchForm);
		this.getPrintlabelt(JSON.stringify(this.form));

	},
	//tab切换事件
	processResultFun(index){
		this.processResultState=index;
	},
	//预算列表选择事件
	selectChange(selection){
		this.selection = selection;

	},
	// 分页事件
	handleSizeChange(val) {
		this.form.pageSize=val;
		this.getPrintlabelt(this.form);
	},
	handleCurrentChange(val) {
		this.form.pageNum=val;
		this.getPrintlabelt(this.form);
	},
	//打印预览
	processResultFun2(index,value){
    this.processResultState=index;
    this.loading2=true;
    // 判断选了哪个书标模板
    for(let i=0,length=this.labelsetData.length;i<length;i++){
      if(this.labelsetData[i].id==this.searchForm.labelSetId){
        this.printStyle=this.labelsetData[i];
      }
    }
    this.forNumber=Number(this.printStyle.rowCount)*Number(this.printStyle.columnCount);
    this.printData=[...this.data]
    // 如果数据多于行数*列数
    if(this.data.length>=this.forNumber){
       this.printData=this.printData.splice(0,this.forNumber)
    }else{
      let addNumber=this.forNumber-this.data.length;
      for(let i=0;i<addNumber;i++){
        this.printData.push({barcode:"",callNo:"",currSeednumber:"",seriesNo:""})
      }
    }
		setTimeout(()=>{
      this.loading2=false;
      // 打印的纸
      let printParent=document.getElementById("print");
      // 每个书标
      let printList=document.getElementsByClassName("printList");
      // 书标里面的每一行
      let line=document.getElementsByClassName("line");

      let scaleNumber=this.printStyle.fontSize/12;
      let fontSizes="font-size:12px;transform: scale("+scaleNumber+");transform-origin:0 0;"+
        "-ms-transform: scale("+scaleNumber+");-ms-transform-origin:0 0;-webkit-transform: scale("+scaleNumber+");-webkit-transform-origin:0 0;" +
        "-moz-transform: scale("+scaleNumber+");-moz-transform-origin:0 0;-o-transform: scale("+scaleNumber+");-o-transform-origin:0 0;"
      // 纸张设置
      printParent.style="width:"+this.printStyle.paperWeight+"mm;height:"+this.printStyle.paperHeight+"mm;font-weight:"+this.printStyle.fontThick
      // 书标设置
      for(let j=0,length2=printList.length;j<length2;j++){
        printList[j].style="width:"+this.printStyle.lableWeight+"mm;height:"+this.printStyle.lableHeght+
          "mm;text-align:"+this.printStyle.alignment
      }
      //每一行
      for(let k=0,length3=line.length;k<length3;k++){
        // 第一行是首行上间距
        if(k%3==0){
          if(this.printStyle.alignment=="center"){
            line[k].style="margin-top:"+this.printStyle.topSpace+"mm;"+fontSizes
          }else if(this.printStyle.alignment=="left"){
            line[k].style="margin-left:"+ this.printStyle.leftSpace+"mm;margin-top:"+this.printStyle.topSpace+"mm;line-height:1"+fontSizes
          }else {
            line[k].style="margin-right:"+ this.printStyle.leftSpace+"mm;margin-top:"+this.printStyle.topSpace+"mm;"+fontSizes
          }
        }else{
          // 其他行是行间距
          if(this.printStyle.alignment=="center"){
            line[k].style="margin-top:"+ this.printStyle.spaceRow+"mm"+fontSizes
          }else if(this.printStyle.alignment=="left"){
            line[k].style="margin-left:"+ this.printStyle.leftSpace+"mm;margin-top:\"+ this.printStyle.spaceRow+\"mm"+fontSizes
          }else {
            line[k].style="margin-right:"+ this.printStyle.leftSpace+"mm;margin-top:\"+ this.printStyle.spaceRow+\"mm"+fontSizes
          }
        }
      }
      if(value=="print"){
        setTimeout(function(){
          window.print()
        },1000)}

    },1000)
	},
    // 下拉框选择
    processResultFun3(index){
      if(this.data.length!=0){
        this.processResultFun2(index)
      }

    }
  }
};
</script>

 <style scoped>
 .process_result_tab{
  margin-bottom: 20px
 }
.process_result_tab li {
  color: #333;
  margin-left: 20px;
  font-weight: bold;
}

.process_result_tab li.actived {
  color: #409eff;
}
.process_result_tab li:first-of-type {
  margin-left: 0;
}
.process_result_tab .fl{
  cursor: pointer;
}
.tab_wrap {
  margin-top: 30px;

}
.printList{display: inline-block;border: 1px solid red;box-sizing: border-box;overflow: hidden}
#print{background: white;clear: both}
@media print {
	#printDiv{position:fixed;left:0;top:0;background:white;width:100%;height: 100%;}
	.printList{border: none}
}
</style>
