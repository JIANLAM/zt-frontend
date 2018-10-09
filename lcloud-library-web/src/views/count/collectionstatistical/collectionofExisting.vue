<template>
    <div id="classification">
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="分馆名称">
                <el-select v-model="form.libraryId" style="width: 420px;" >
                  <el-option label="全部" value=""></el-option>
                  <el-option :label="item.name" :value="item.id" v-for="item in forOrgAll" :key="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="馆藏地点">
                <el-select v-model="collAdsTypeIds" style="width: 420px;" multiple>
                    <el-option :label="item.label" :value="item.id" v-for="item in collAddressList" :key="item.id"></el-option>
                </el-select>
                <el-radio v-model="columnType" label="0">馆藏地点纵向 流通类型横向</el-radio>
            </el-form-item>
            <el-form-item label="图书流通类型">
                <el-select v-model="circulationTypeIds" style="width:420px;" multiple>
                    <el-option :label="item.label" :value="item.id" v-for="item in circulationList" :key="item.id"></el-option>
                </el-select>
                <el-radio v-model="columnType" label="1">流通类型纵向   馆藏地点横向</el-radio>
            </el-form-item>
             <el-form-item label="分类号范围">
                    <el-input v-model="form.bookType" style="width: 210px;">-</el-input>
                    <el-input v-model="form.bookTypeEnd" style="width: 210px;"></el-input>
            </el-form-item>
            <el-form-item label="操作起止时间">
                <el-date-picker
                    v-model="picker"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    clearable
                    style="width:420px;">
                </el-date-picker>
            </el-form-item>
            <div style="text-align: center; width:600px;">
                <el-button type="success" icon="el-icon-search" @click="searchData">执行统计</el-button>
                <el-button type="warning" icon="el-icon-refresh" @click="reset">重置条件</el-button>
            </div>
        </el-form>
        <el-card class="box-card" v-show="detail" >
            <div slot="header" class="clearfix">
                <span>馆藏分类统计</span>
                <el-button style="float: right" type="primary" @click="exportOrderCount" size="small">导出</el-button>
            </div>
            <div  class="text item">
                <el-table :data="data" border v-loading="loading" :span-method="objectSpanMethod">
                <el-table-column label="馆藏地点" width="180"  prop="name" v-if="form.columnType==0"></el-table-column>
                <el-table-column label="流通类型" width="180"  prop="name" v-else></el-table-column>
                <el-table-column label="统计项" :prop="'0'"></el-table-column>
                <el-table-column :label="value" v-for="(value, key, index) in tableColumn" :key="index" :prop="key"></el-table-column>
            </el-table>


            </div>
        </el-card>
    <el-dialog  width="30%"  title="您的文件将保存为.csv格式文件"  :visible.sync="innerVisible"  append-to-body>
        <el-radio v-model="radio" label="1">打开文件</el-radio>
            <el-radio v-model="radio" label="2">保存文件</el-radio>
            <div slot="footer" class="dialog-footer">
                <el-button @click="innerVisible = false">取 消</el-button>
                <el-button type="primary" @click="innerVisible = false">确 定</el-button>
            </div>
    </el-dialog>
    </div>
</template>

<script>
import axios from '@/axios/request'
import {collAddressList,circulationList} from '@/request/systemSetup'
import { collExistingCount,exportCollection,forOrgAll} from '@/request/count'
export default {
    data() {
      return {
        loading:true,
        dialogTableVisible: false,
        visible: false,
        radio: '',
        picker:'',
        form: {
            startTime:"",
            endTime:"",
            columnType:"0",
            pageNum:0,
            pageSize:20,
        },
        columnType:"0",
        collAdsTypeIds:"",
        circulationTypeIds:"",
        collAddressList:[],
        forOrgAll:[],
        circulationList:[],
        formLabelWidth: '120px',
        chartShope:"bar",
        detail:false,
        tableColumn:{},
        title:"图书流通类型",
        data:[],
        innerVisible:false,
      };
    },
     methods: {
         objectSpanMethod({ row, column, rowIndex, columnIndex }) {
         if (columnIndex === 0) {
          if (rowIndex % 3 === 0) {
            return {
              rowspan: 3,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
       },
         searchData(){
            this.form.collAdsTypeIds=this.collAdsTypeIds.join(",");
            this.form.circulationTypeIds=this.circulationTypeIds.join(",");
            if(this.form.collAdsTypeIds==""){
                this.$message({
                    type: 'error',
                    message:'请选择馆藏地点！',
                    duration:'2000'
                });
                return
            }else if(this.form.circulationTypeIds==""){
                this.$message({
                    type: 'error',
                    message:'请选择图书流通类型！',
                    duration:'2000'
                });
                return
            }
           this.form.columnType=this.columnType;
            this.detail=true;
            this.loading=true;
            collExistingCount(JSON.stringify(this.form)).then(data=>{
                if(data.data.code==0){
                    this.data=[]
                    this.loading=false;
                    this.tableColumn=data.data.ListMap.topRow[0];
                    for(let dataItem in data.data.ListMap){
                        if(dataItem!='topRow'){
                            for(let dataName=0;dataName<data.data.ListMap[dataItem].length;dataName++){
                                data.data.ListMap[dataItem][dataName].name=dataItem
                            }
                            if(dataItem!='合计'){
                                this.data.push(...data.data.ListMap[dataItem])
                            }

                        }
                    }
                     this.data.push(...data.data.ListMap['合计'])
                }else{
                    this.$message({
                    type: 'error',
                    message:"数据获取失败！失败原因："+data.data.msg,
                    duration:'2000'
                });
                }
            }).catch(err=>{
                this.$message({
                    type: 'info',
                    message: '数据获取失败，失败原因：'+err.data.msg
                });
            })
        },
        reset(){
            this.picker=''
            this.collAdsTypeIds=[this.collAddressList[0].id];
            this.form.libraryId="";
            this.circulationTypeIds=[this.circulationList[0].id];
            this.form.columnType="0";
        },
          //导出
        exportOrderCount(){
        this.$confirm('是否要导出馆藏现存统计?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           exportCollection(this.form).then(data=>{
            if(data.data.code==0){
              // window.location.href=data.data.xlsurl;
              window.open(data.data.xlsurl)
            }
            this.$message({
              type: 'success',
              message: '导出成功!正在下载，请稍后..',
              duration:'6000'
            });
          }).catch(err=>{
            this.$message({
              type: 'info',
              message: '导出失败!'
            });
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '导出已取消!'
          });
        });
      },
      //图书馆信息递归函数
        dataArr(data){
          let tmp = []
		  const _this=this;
		  Array.from(data).forEach(function(record) {
		    tmp.push(record)
		    if (record.children && record.children.length > 0) {
		      const children =_this.dataArr(record.children)
		      tmp = tmp.concat(children)
		    }
		  })
		  return tmp
        }
    },
    watch:{
        picker(newVal){
            if(newVal&&newVal.length>0){
            this.form.startTime=newVal[0];
            this.form.endTime=newVal[1];
            console.log(newVal)
            }else{
            this.form.startTime='';
            this.form.endTime='';
            }
      },
    },
    created(){
         // 获取馆藏地点
        collAddressList().then(data=>{
            if(data.data.code==0){
                this.collAddressList=data.data.page.list;
                this.collAdsTypeIds=[this.collAddressList[0].id]
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
           // 图书馆
        forOrgAll().then(data=>{
            if(data.data.code==0){
                this.forOrgAll=this.dataArr(data.data.list);
            }else{
                this.$message({
                type: 'error',
                message:"分馆数据获取失败！失败原因："+data.data.msg,
                duration:'2000'
            });
            }
        }).catch(err=>{
            this.$message({
                type: 'info',
                message: '分馆数据获取失败，失败原因：'+err.data.msg
            });
        })
         // 获取图书流通类型
        circulationList().then(data=>{
            if(data.data.code==0){
                this.circulationList=data.data.page.list;
                this.circulationTypeIds=[this.circulationList[0].id]
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
    }
  };
</script>

<style>
    .box-card{margin-top: 50px;}
</style>
