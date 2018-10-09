<template>
  <div id="catalong">
 	<el-form :inline="true" :model="searchFrom" class="demo-form-inline">
		<el-form-item >
			<el-input v-model="searchFrom.searchValue" clearable>
				<el-select v-model="searchFrom.searchKey" slot="prepend" :style="{width:'120px'}">
					<el-option label="ISBN" value="isbn"></el-option>
					<el-option label="正题名" value="title"></el-option>
					<el-option label="作者" value="author"></el-option>
					<!-- <el-option label="条形码" value="barcode"></el-option> -->
					<!-- <el-option label="种次号" value="kindtime"></el-option>
					<el-option label="分次号" value="several"></el-option>  -->
				</el-select>
			</el-input>
		</el-form-item>
		<el-form-item label="验收时间">
			<el-date-picker
					v-model="picker"
					type="daterange"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					value-format="yyyy-MM-dd"
					clearable>
			</el-date-picker>
		</el-form-item>
		<el-form-item>
			<el-button  type="primary"  icon="el-icon-search" @click="search">检索</el-button>
		</el-form-item>
 	</el-form>
	<el-table
		:data="tableData" border  style="width: 100%" v-loading="loading">
		<el-table-column  label="序号" type="index" width="50">  </el-table-column>
		<el-table-column  prop="title"  label="图书名称" >  </el-table-column>
		<el-table-column  prop="isbn"  label="ISBN" >  </el-table-column>
		<el-table-column  prop="author"  label="作者" >  </el-table-column>
		<el-table-column  prop="bookType"  label="分类号" >  </el-table-column>
		<el-table-column  prop="publisher"  label="出版社" >  </el-table-column>
		<el-table-column  prop="pubdate"  label="出版年份" 	:formatter="YtdFormat"></el-table-column>
		<el-table-column  prop="price"  label="价格" >  </el-table-column>
		<el-table-column  prop="recount"  label="副本数">  </el-table-column>
    <el-table-column  prop="recount"  label="详情">
      <template slot-scope="scope">
        <el-button type="text" @click="add(scope.row)">查看详情</el-button>
      </template>
    </el-table-column>
	</el-table>
  	<el-row>
		<el-col :span="24">
			<el-pagination
			:page-sizes="[10, 20, 30, 40]"
			:page-size="tablePage.pageSize"
			:current-page="tablePage.pageNum"
			layout="total, sizes, prev, pager, next, jumper"
			:total="tablePage.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
			>
			</el-pagination>
		</el-col>
	</el-row>
  <!-- 弹出框 -->
  <el-dialog :visible.sync="detailVisible" width="90%">
    <el-tabs v-model="activeName1" type="card" @tab-click="handleClick">
      <el-tab-pane label="普通编目" name="first">
            <el-card >

              <el-button  type="primary"  icon="el-icon-check" round="" size="mini" style="float:right" @click="sure()">保存</el-button>
              <div id="detail" style="margin-top:50px">
                <el-row>
                  <el-col :span="8">
                      <div class="one">
                            <el-upload
                              style="width:100%"
                              action="https://jsonplaceholder.typicode.com/posts/"
                              list-type="picture-card"
                              :on-preview="handlePictureCardPreview"
                              :on-remove="handleRemove">
                              <i class="el-icon-plus"></i>
                            </el-upload>
                            <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" :src="dialogImageUrl" alt="">
                            </el-dialog>
                             <el-form :label-position="labelPosition" label-width="80px" :model="form" size="mini" style="margin-top:40px">
                              <el-form-item label="版次">
                                  <el-select v-model="form.book.revision"  placeholder="请选择" >
                                    <el-option label="第一版" value="第一版"></el-option>
                                    <el-option label="第二版" value="第二版"></el-option>
                                    <el-option label="第三版" value="第三版"></el-option>
                                    <el-option label="第四版" value="第四版"></el-option>
                                    <el-option label="修订版" value="修订版"></el-option>
                                    <el-option label="增订版" value="增订版"></el-option>
                                  </el-select>
                              </el-form-item>
                              <el-form-item label="语种">
                                  <el-select v-model="form.book.language"  placeholder="请选择" >
                                  <el-option label="汉语" value="汉语"></el-option>
                                  <el-option label="英语" value="英语"></el-option>
                                  <el-option label="世界语" value="世界语"></el-option>
                                  <el-option label="法语" value="法语"></el-option>
                                  <el-option label="德语" value="德语"></el-option>
                                  <el-option label="日语" value="日语"></el-option>
                                  <el-option label="拉丁语" value="拉丁语"></el-option>
                                  <el-option label="俄语" value="俄语"></el-option>
                                  <el-option label="藏语" value="藏语"></el-option>
                                  </el-select>
                              </el-form-item>
                              <el-form-item label="开本">
                                  <el-select v-model="form.name"  placeholder="请选择">
                                  <el-option label="32开" value="32开"></el-option>
                                  <el-option label="46开" value="46开"></el-option>
                                  </el-select>
                              </el-form-item>
                              <el-form-item label="载体类型">
                                  <el-select v-model="form.book.carrierType"  placeholder="请选择" >
                                  <el-option label="图书" value="图书"></el-option>
                                  <el-option label="期刊" value="期刊"></el-option>
                                  <el-option label="报纸" value="报纸"></el-option>
                                  <el-option label="录像带" value="录像带"></el-option>
                                  <el-option label="光碟" value="光碟"></el-option>
                                  </el-select>
                              </el-form-item>
                              <el-form-item label="装帧类型">
                                  <el-select v-model="form.book.binding"  placeholder="请选择" >
                                  <el-option label="平装" value="平装"></el-option>
                                  <el-option label="精装" value="精装"></el-option>
                                  </el-select>
                              </el-form-item>


                        </el-form>
                      </div>
                  </el-col>
                  <el-col :span="8">
                      <div class="two">
                        <el-form :label-position="labelPosition" label-width="90px" :model="form" size="mini">
                            <el-form-item label="书目记录号">
                              <el-input v-model="form.id" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="正题名">
                              <el-input v-model="form.book.title"></el-input>
                            </el-form-item>
                            <el-form-item label="从题名">
                              <el-input v-model="form.book.seriesTitle"></el-input>
                            </el-form-item>
                            <el-form-item label="副题名">
                              <el-input v-model="form.book.secondTitle"></el-input>
                            </el-form-item>
                            <el-form-item label="并列题名">
                              <el-input v-model="form.book.parallelTitle"></el-input>
                            </el-form-item>
                            <el-form-item label="第一负责人">
                              <el-input v-model="form.book.firstDuty"></el-input>
                            </el-form-item>
                            <el-form-item label="出版社">
                              <el-input v-model="form.book.publisher"></el-input>
                            </el-form-item>
                            <el-form-item label="出版日期">
                              <el-input v-model="form.book.pubdate"></el-input>
                            </el-form-item>
                            <el-form-item label="获得方式">
                              <el-select v-model="form.book.source"  placeholder="请选择">
                              <el-option label="购买" value="购买"></el-option>
                              <el-option label="捐赠" value="捐赠"></el-option>
                              <el-option label="交换" value="交换"></el-option>
                              <el-option label="自编" value="自编"></el-option>
                              </el-select>
                            </el-form-item>
                        </el-form>
                      </div>
                  </el-col>
                  <el-col :span="8">
                      <div class="three">
                        <el-form :label-position="labelPosition" label-width="70px" :model="form" size="mini">
                            <el-form-item label="ISBN">
                              <el-input v-model="form.book.isbn"></el-input>
                            </el-form-item>
                            <el-form-item label="分类号">
                              <el-input v-model="form.book.bookType"></el-input>
                            </el-form-item>
                            <el-form-item label="索取号">
                              <el-input v-model="form.callNo"></el-input>
                            </el-form-item>
                            <el-form-item label="主题词">
                              <el-input v-model="form.book.subjectWord"></el-input>
                            </el-form-item>
                              <el-form-item label="复本数" prop="recount" :rules="[{ required: true, message: '复本数不能为空'},{ type: 'number', message: '复本数必须为数字值'}]">
                                  <el-tooltip content="输入复本书按下回车键来添加条码" placement="top">
                                    <el-input v-model.number="form.recount" v-on:keyup.enter.native="addData" placeholder="输入复本书按下回车键来添加条码"></el-input>
                                  </el-tooltip>
                                </el-form-item>
                            <el-form-item label="价格">
                              <el-input v-model="form.book.price"></el-input>
                            </el-form-item>
                            <el-form-item label="页数">
                              <el-input v-model="form.book.pages"></el-input>
                            </el-form-item>
                            <el-form-item label="编目者">
                            <el-input v-model="form.creatorName" :disabled="true"></el-input>
                            </el-form-item>
                        </el-form>
                      </div>
                  </el-col>
                </el-row>
                  <el-input style="margin-bottom:20px"
                            type="textarea"
                            :rows="3"
                            placeholder="摘要"
                            v-model="form.book.summary">
                        </el-input>
                <el-form :inline="true" :model="addForm" size="mini" >

                    <el-form-item label="馆藏地点">
                        <el-select v-model="addForm.colladdressId"  placeholder="请选择" style="width:120px" @change="getPartitionList">
                          <el-option :label="item.label" :value="item.value" v-for="item in collAddressList" :key="item.id"></el-option>
                        </el-select>
                  </el-form-item>
                  <el-form-item label="条码分区">
                        <el-select v-model="addForm.partition"  placeholder="请选择" style="width:120px" @change="getBarcode">
                            <el-option :label="item.barcodeName" :value="item.value" v-for="item in partitionList" :key="item.id"></el-option>
                        </el-select>
                  </el-form-item>
                  <el-form-item label="流通类型">
                      <el-select v-model="addForm.actType"  placeholder="请选择" style="width:120px">
                        <el-option :label="item.label" :value="item.value" v-for="item in circulationList" :key="item.id"></el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="起始条码">
                      <el-input v-model="addForm.barcodeStart" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="终止条码">
                      <el-input v-model="addForm.barcodeEnd" clearable></el-input>
                  </el-form-item>
                </el-form>
                <el-table
                  :data="form.holdingList" border  size="mini">
                  <el-table-column   label="删除" width="80px">
                    <template slot-scope="scope">
                      <el-button type="text" @click="deleteTable(scope.$index)" style="color:red">删除</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column  prop="barcode"  label="图书条码">  </el-table-column>
                  <el-table-column  prop="indate"  label="上架日期" width="240px">
                    <template slot-scope="scope">
                    <el-form>
                        <el-form-item size="mini" class="el-form-item1">
                          <el-date-picker type="datetime" v-model="form.holdingList[scope.$index].indate"></el-date-picker>
                        </el-form-item>
                    </el-form>
                    </template>
                  </el-table-column>
                  <el-table-column  prop="collection"  label="馆藏地点" width="150px">
                    <template slot-scope="scope">
                        <el-form>
                          <el-form-item size="mini" class="el-form-item1">
                            <el-select v-model="form.holdingList[scope.$index].colladdressId"  placeholder="请选择">
                              <el-option :label="item.label" :value="item.value" v-for="item in collAddressList" :key="item.id"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-form>
                    </template>
                  </el-table-column>
                  <el-table-column  prop="state"  label="馆藏状态" width="150px">
                    <template slot-scope="scope">
                        <el-form>
                          <el-form-item size="mini" class="el-form-item1">
                            <el-select v-model="form.holdingList[scope.$index].status"  placeholder="请选择" >
                              <el-option :label="item.label" :value="item.value" v-for="item in collStateList" :key="item.id"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-form>
                    </template>
                  </el-table-column>
                  <el-table-column  prop="state"  label="流通类型" width="150px">
                    <template slot-scope="scope">
                        <el-form>
                          <el-form-item size="mini" class="el-form-item1">
                            <el-select v-model="form.holdingList[scope.$index].actType"  placeholder="请选择" >
                              <el-option :label="item.label" :value="item.value" v-for="item in circulationList" :key="item.id"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-form>
                    </template>
                  </el-table-column>
                  <el-table-column  prop="batch"  label="批次" width="150px">
                    <template slot-scope="scope">
                      <el-form>
                        <el-form-item size="mini" class="el-form-item1">
                          <el-input type="text" v-model="form.holdingList[scope.$index].catalogBatch"></el-input>
                        </el-form-item>
                      </el-form>
                    </template>
                  </el-table-column>
                  <el-table-column    label="备注" width="150px">
                    <template slot-scope="scope">
                      <el-form>
                        <el-form-item size="mini" class="el-form-item1">
                          <el-input type="text" v-model="form.holdingList[scope.$index].remark"></el-input>
                      </el-form-item>
                    </el-form>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
      </el-tab-pane>
      <el-tab-pane label="MARC编目" name="second">配置管理</el-tab-pane>
  </el-tabs>
  </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
import {catalogDetail,catalogSave,getmaxbarcode,foreignbooklist,foreignbookinfo,acceptancedetailList,downloadbook,downloadprebook} from '@/request/catalog'
import {collAddressList,partitionList,collStateList,circulationList} from '@/request/systemSetup'
export default {
  data() {
    return {
      loading: false,
      loading2: false,
      picker: [],
      searchFrom: {
        searchValue: '',
        searchKey: 'isbn',
        startTime: "",
        endTime: "",
        timeKey: "acceptTime"
      },
      form0: {
        pageSize: 5,
        pageNum: 1
      },
      tablePage: {},
      tableData: [],
      detailVisible:false,
      activeName1: 'first',
      activeName2:"first",
      labelPosition: "right",
      dialogImageUrl: "",
      dialogVisible: false,
      form: {
        book:{},
        holdingList:[]
      },
      data1:[],
      dataPage1:[],
      form1:{
        isbn:"",
        pageNum: 1,
        pageSize: 5,
        source:[]
      },
      searchBookFrom:{
        searchKey:  'isbn'
      },
      addForm:{},
      collAddressList:[],
      partitionList:[{label:"20180806",value:"1"}],
      circulationList:[],
      out:true,
      source:[],
      bookForm:{},
      downloadbook1:downloadbook,
      downloadbook2:downloadprebook,
      collStateList:[],

    };
  },
  created() {
    this.getAcceptancedetailList(JSON.stringify(this.form0));
    this.getBookData();;
       // 获取馆藏地点
      collAddressList().then(data=>{
          if(data.data.code==0){
              this.collAddressList=data.data.page.list;
          }else{
              this.$message({
              type: 'error',
              message:"馆藏地点数据获取失败！失败原因："+data.data.msg,
              duration:'2000'
          });
          }
      }).catch(err=>{
          this.$message({
              type: 'info',
              message: '馆藏地点数据获取失败，失败原因：'+err.data.msg
          });
      })
      // 获取馆藏状态
        collStateList().then(data=>{
            if(data.data.code==0){
                this.collStateList=data.data.page.list;
            }else{
                this.$message({
                type: 'error',
                message:"馆藏状态数据获取失败！失败原因："+data.data.msg,
                duration:'2000'
            });
            }
        }).catch(err=>{
            this.$message({
                type: 'info',
                message: '馆藏状态数据获取失败，失败原因：'+err.data.msg
            });
        })
          // 获取图书流通类型
        circulationList().then(data=>{
            if(data.data.code==0){
                this.circulationList=data.data.page.list;
            }else{
                this.$message({
                type: 'error',
                message:"图书流通类型数据获取失败！失败原因："+data.data.msg,
                duration:'2000'
            });
            }
        }).catch(err=>{
            this.$message({
                type: 'info',
                message: '图书流通类型数据获取失败，失败原因：'+err.data.msg
            });
        })

  },
  methods: {
    search() {
      let obj = {
        pageSize: this.form0.pageSize,
        pageNum: this.form0.pageNum
      };
      Object.assign(obj, this.searchFrom);
      this.getAcceptancedetailList(JSON.stringify(obj));
    },
    //
    YtdFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
          return "";
      }
      return moment(date).format("YYYY-MM");
    },
    // 分页事件
    handleSizeChange(val) {
      this.form0.pageSize = val;
      this.getAcceptancedetailList(JSON.stringify(this.form0));
    },
    handleCurrentChange(val) {
      this.form0.pageNum = val;
      this.getAcceptancedetailList(JSON.stringify(this.form0));
    },
     //分页事件
    handleSizeChange1(val) {
      this.form1.pageSize=val;
      this.getBookData()
    },
    handleCurrentChange1(val) {
      this.form1.pageNum=val;
      this.getBookData()
    },
     handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      console.log(dialogImageUrl)
      this.dialogVisible = true;
    },
    // tab点击事件
    handleClick(tab, event) {
        console.log(tab, event);
    },
    add(row){
      this.detailVisible=true;
      let obj={bookId:row.id,isbn:row.isbn}
      catalogDetail(obj).then(data=>{
      if(data.data.code==0){
        this.form=data.data.CatalogVO;
        if(!this.form.holdingList){
          this.form.holdingList=[];
        }
      }else{
          this.$message({
          type: 'error',
          message:"数据详情获取失败！失败原因："+data.data.msg,
          duration:'2000'
      });
          }
    }).catch(err=>{
        this.$message({
          type: 'info',
          message: '数据详情获取失败！失败原因：'+err.data.msg
        });
})
    } ,
    addOut(row){
      this.activeName2='second';
      this.detailVisible=true;
      let obj={id:row.id,isbn:row.isbn,source:row.source}
      foreignbookinfo(obj).then(data=>{
      if(data.data.code==0){
        this.bookForm=data.data.Book
      }else{
          this.$message({
          type: 'error',
          message:"数据详情获取失败！失败原因："+data.data.msg,
          duration:'2000'
      });
          }
    }).catch(err=>{
        this.$message({
          type: 'info',
          message: '数据详情获取失败！失败原因：'+err.data.msg
        });
})
  } ,
  getAcceptancedetailList(obj){
    this.loading=true
    acceptancedetailList(obj).then(data=>{
      if(data.data.code==0){
          this.tablePage = data.data.page;
          this.tableData = data.data.page.list;
          this.loading=false
          if(data.data.page.list&&data.data.page.list.length>0){
          }else{
              if(data.data.page.pageNum>1) {
                this.form0.pageNum=data.data.page.pageNum-1
                this.getAcceptancedetailList(JSON.stringify(this.form0));
              }
          }
      }else{
          this.$message({
          type: 'error',
          message:"本馆图书数据获取失败！失败原因："+data.data.msg,
          duration:'2000'
      });
          }
    }).catch(err=>{
        this.$message({
          type: 'info',
          message: '本馆图书数据获取失败，失败原因：'+err.data.msg
        });
})
  },
  // 外部图书获取
    getBookData(search){
    this.loading2=true;
    let obj=this.form1;
    if(search=="search"){
      this.form1={
        pageNum: 1,
        pageSize: 5,
        source:this.source.join(",")
      }
    }else{
      this.form1={
        pageNum: obj.pageNum,
        pageSize: obj.pageSize,
        source:this.source.join(",")
      }
    }

      this.$set(this.form1,this.searchBookFrom.searchKey,this.searchBookFrom.searchValue)
    foreignbooklist(JSON.stringify(this.form1)).then(data=>{
      if(data.data.code==0){
            this.data1=data.data.page.list;
            this.dataPage1=data.data.page;
            this.loading2=false
          if(data.data.page.list&&data.data.page.list.length>0){
          }else{
              if(data.data.page.pageNum>1) {
                this.form1.pageNum=data.data.page.pageNum-1
                this.getBookData();
              }
          }
      }else{
          this.$message({
          type: 'error',
          message:"外部图书数据获取失败！失败原因："+data.data.msg,
          duration:'2000'
      });
          }
    }).catch(err=>{
        this.$message({
          type: 'info',
          message: '外部图书数据获取失败，失败原因：'+err.data.msg
        });
})
  },
  searchBookData(){
    this.activeName2='first';
    this.getBookData('search')
  },
  sure(value=this.form){
    if(this.form.holdingList.length==0){
        this.$message({
          type: 'error',
          message:"请至少编目一本书！",
          duration:'2000'
      });
      return
    }
    catalogSave(value).then(data=>{
      if(data.data.code==0){
          this.$message({
          type: 'success',
          message:"保存成功！",
          duration:'2000'
      });
        this.detailVisible=false;
        this.getAcceptancedetailList(JSON.stringify(this.form0));
      }else{
          this.$message({
          type: 'error',
          message:"保存失败！失败原因："+data.data.msg,
          duration:'2000'
      });
          }
    }).catch(err=>{
        this.$message({
          type: 'info',
          message: '保存失败！失败原因：'+err.data.msg
        });
})
  },
   addData(){
    console.log(1);
 // 表格数据长度
    let  length=this.form.holdingList.length;
    let obj;
    var barcode;
    if(length>0){
      obj={barcodeStart:this.addForm.barcodeStart||this.form.holdingList[this.form.holdingList.length-1].barcode,barcodeEnd:this.addForm.barcodeEnd};
   }else{
      obj={barcodeStart:this.addForm.barcodeStart,barcodeEnd:this.addForm.barcodeEnd};
   }
    getmaxbarcode(obj).then(data=>{
    if(data.data.code==0){
      barcode=data.data.LableVO.barcode
    //输入的数字
    let  count=Number(this.form.recount);
    if(count>length){
        let num=count-length;
        for(let i=0;i<num;i++){
          this.form.holdingList.push(
            {"barcode":Number(barcode)+i,
            "colladdressId":this.addForm.colladdressId,
            "actType":this.addForm.actType,
            "catalogBatch":'',
            "status":""
            })
        }
    }
    }
    })
  },
  deleteTable(index){
    this.form.holdingList.splice(index,1)
    this.form.recount=this.form.recount-1
  },
  // 覆盖
  coverData(){
    Object.assign(this.form.book,this.bookForm)
  },
  // 下载
  downloadData(url){
      url(this.bookForm).then(data=>{
      if(data.data.code==0){
          this.$message({
          type: 'success',
          message:data.data.msg,
          duration:'2000'
      });
        this.getAcceptancedetailList(JSON.stringify(this.form0));
        this.activeName3='first';
      }else{
          this.$message({
          type: 'error',
          message:"下载失败！失败原因："+data.data.msg,
          duration:'2000'
      });
          }
    }).catch(err=>{
        this.$message({
          type: 'info',
          message: '下载失败！失败原因：'+err.data.msg
        });
})
  },
    getPartitionList(){
      let name='';
      for(let index=0;index<this.collAddressList.length;index++){
        if(this.collAddressList[index].id==this.addForm.colladdressId){
          name=this.collAddressList[index].label
        }
      }
      // 条码分区参数
      partitionList().then(data=>{
        if(data.data.code==0){
          this.partitionList=[];
          for(let i=0,length=data.data.page.list.length;i<length;i++){
            if(data.data.page.list[i].bpmName==name){
              this.partitionList.push(data.data.page.list[i])
            }
          }

        }else{
          this.$message({
            type: 'error',
            message:"条码分区参数数据获取失败！失败原因："+data.data.msg,
            duration:'2000'
          });
        }
      }).catch(err=>{
        this.$message({
          type: 'info',
          message: '条码分区参数数据获取失败，失败原因：'+err.data.msg
        });
      })


    },
    getBarcode(){
      for(let index=0;index<this.partitionList.length;index++){
        if(this.partitionList[index].id==this.addForm.partition){
          this.addForm.barcodeStart=this.partitionList[index].startBarcode;
          this.addForm.barcodeEnd=this.partitionList[index].stopBarcode
        }
      }
    }
  },
  watch: {
    picker(newVal) {
      if (newVal && newVal.length > 0) {
        this.searchFrom.startTime = newVal[0];
        this.searchFrom.endTime = newVal[1];
      } else {
        this.searchFrom.startTime = "";
        this.searchFrom.endTime = "";
      }
    },
    detailVisible(newVal){
         if(!newVal){
           this.activeName2='first';
           this.bookForm={}
         }
    }
  }
};
</script>
<style  scoped>
.el-upload.el-upload--picture-card{width:168px;height:168px}
</style>
