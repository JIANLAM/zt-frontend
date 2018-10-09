<template>
    <div id="librarystatistical">
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="统计字段">
                <el-select v-model="form.branch" style="width:420px;">
                    <el-option label="图书流通类型" value="defileCirculLend"></el-option>
                    <el-option label="图书分类" value="defileTypeLend"></el-option>
                    <el-option label="馆藏地点" value="defilecollAdsLend"></el-option>
                    <el-option label="读者证类型" value="defileReaderLend"></el-option>
                    <el-option label="学生证 年级" value="defileGradeLend"></el-option>
                    <el-option label="学生证 班级" value="defileClassesLend"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时间范围">
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
            <el-form-item label="统计字段模板">
                <el-select v-model="fieldTemplate" style="width:420px;" multiple>
                    <el-option label="种数" value="bookTypeCount"></el-option>
                    <el-option label="册数" value="totalCount"></el-option>
                    <el-option label="总价" value="totalPrice"></el-option>
                </el-select>
            </el-form-item>
            <div style="text-align: center; width:600px;">
                <el-button type="primary" icon="el-icon-search" @click="searchData">执行统计</el-button>
                <el-button type="warning" icon="el-icon-refresh" @click="reset()">重置条件</el-button>
            </div>
        </el-form>
        <el-card class="box-card" v-show="detail" >
            <div slot="header" class="clearfix">
                <span>图书借阅统计</span>
                <el-button style="float: right" type="primary" @click="exportOrderCount" size="small">导出</el-button>
            </div>
            <div  class="text item">
                <el-table :data="data" border v-loading="loading">
                <el-table-column :label="value" v-for="(value, key, index) in tableColumn" :key="index" :prop="key"></el-table-column>
            </el-table>
            </div>
        </el-card>
        <el-card class="box-card" v-show="detail" :style="{float:'right'}">
            <div :style="{float:'left'}">
                <el-select v-model="chartShope" style="width:120px;">
                    <el-option label="柱状图" value="bar"></el-option>
                    <el-option label="折线图" value="line"></el-option>
                </el-select>
            </div>
            <div id="myChart" :style="{width: '300px', height: '300px',float:'right'}" v-show="chartShope=='bar'"></div>
            <div id="myChart2" :style="{width: '300px', height: '300px',float:'right'}" v-show="chartShope=='line'"></div>
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
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require("echarts/lib/component/legend")
import axios from '@/axios/request'
import { exportCirculation} from '@/request/count'
  export default {
    data() {
      return {
            data:[],
            loading:true,
            innerVisible: false,
            tabPosition: 'right',
            radio: '',
            picker:'',
            form :{
                branch:'defileCirculLend',
                startTime:"",
                endTime:""
            },
            fieldTemplate:['bookTypeCount'],
            tableColumn:{},
            title:"图书流通类型",
            detail:false,
            chartShope:"bar"
      };
    },
    methods:{
        searchData(){
          if(this.fieldTemplate.length==0){
            this.$message({
              type: 'error',
              message:"请选择统计字段模板！",
              duration:'2000'
            });
            return
          }
            let obj=this.form;
            this.form={
                branch:obj.branch,
                startTime:obj.startTime,
                endTime:obj.endTime,
                bookTypeCount:"种数",
                totalCount:"",
                totalPrice:"",
            }
            switch(this.form.branch){
                case "defileCirculLend":this.title="图书流通类型";break;
                case "defileTypeLend":this.title="图书分类";break;
                case "defilecollAdsLend":this.title="馆藏地点";break;
                case "defileReaderLend":this.title="读者证类型";break;
                case "defileGradeLend":this.title="学生证 年级";break;
                case "defileClassesLend":this.title="学生证 班级";break;
            }
            this.detail=true;

            for(let numb=0,arrLength=this.fieldTemplate.length;numb<arrLength;numb++){
                this.$set(this.form,this.fieldTemplate[numb],"选中")
            }

            console.log(this.form)
            axios.get("/datacount/datacount/v1/circulation/"+this.form.branch,{
                params: {jsonStr: JSON.stringify(this.form)}})
            .then(data=>{
                if(data.data.code==0){
                    this.loading=false;
                    this.tableColumn=data.data.ListMap[0];
                    data.data.ListMap.splice(0,1);
                    this.data=data.data.ListMap ;
                    var myChart = echarts.init(document.getElementById('myChart'));
                    var myChart2 = echarts.init(document.getElementById('myChart2'));
                    myChart.clear();myChart2.clear();
                    // X轴
                    let  xArr=[];
                    let arrList=[];
                    for(var key  in this.tableColumn){
                        if(key!=0){
                             xArr.push(this.tableColumn[key]);
                             arrList.push(key)
                        }
                    }
                        // Y轴
                    let yArr=[];
                    for(let i=0,length=this.data.length;i<length;i++){
                        yArr.push(this.data[i][0]);
                    }
                    console.log(yArr)
                    let numArr=[];
                    let name="";
                    for(let i=0,length=this.data.length;i<length;i++){
                        let arr=[];
                        for(let item  in this.data[i]){
                            if(item!=0){
                                arr.push(this.data[i][item])
                            }
                        }
                        numArr.push(arr)
                    }
                    let seriesList=[];
                    let seriesList2=[];
                    for(let j=0;j<numArr.length;j++){
                            seriesList.push({name:yArr[j],type:"bar",data:numArr[j]})
                            seriesList2.push({name:yArr[j],type:"line",data:numArr[j]})
                    }
                    console.log(seriesList)
                    myChart.setOption({
                        title: {
                            text: ''
                        },
                        tooltip: {},
                        legend: {
                            layout: 'horizontal',
                            data:yArr
                        },
                        xAxis: {
                            data: xArr
                        },
                        yAxis: {},
                        series:seriesList
                    });
                    myChart2.setOption({
                        title: {
                            text: ''
                        },
                        tooltip: {},
                        legend: {
                            x:'left',
                            data:yArr
                        },
                        xAxis: {
                            data: xArr
                        },
                        yAxis: {},
                        series:seriesList2
                    });
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
            this.form={
                branch:'defileCirculLend',
                startTime:"",
                endTime:""
            }
            this.picker='';
            this.fieldTemplate=['bookTypeCount']

        },
        exportCount(){
            this.innerVisible=true
        },
        init(){
            window.addEventListener("resize", this.chart.resize);
        },
           //导出
        exportOrderCount(){
        this.$confirm('是否要导出图书污损统计?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          exportCirculation(JSON.stringify(this.form)).then(data=>{
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
    },
    created(){

    },
    mounted(){

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
    }
  }
</script>
<style scoped>
    .box-card{margin-top: 50px;width: 49%;float: left;}

</style>
