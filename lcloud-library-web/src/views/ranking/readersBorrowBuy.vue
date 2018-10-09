<template>
  <div id="ranking list">
 		<el-form :inline="true" :model="searchData" class="demo-form-inline">
      <span v-if="searchButton">
         <el-form-item>
           <el-input placeholder="请输入内容" v-model="searchData.searchValue" class="input-with-select" clearable v-on:keyup.enter.native="search">
              <el-select v-model="searchData.searchKey" slot="prepend" placeholder="请选择" :style="{width:'120px'}">
                <el-option label="读者姓名" value="userName"></el-option>
              </el-select>
           </el-input>
         </el-form-item>
         <el-form-item label="借购时间">
            <el-date-picker
               v-model="picker"
               type="daterange"
               start-placeholder="开始日期"
               end-placeholder="结束日期"
               value-format="yyyy-MM-dd"
               clearable>
            </el-date-picker>

         </el-form-item>
        <el-form-item label="读者性别">
 				    <el-select v-model="searchData.sex"  placeholder="请选择" :style="{width:'120px'}">
				      <el-option label="男" value="1"></el-option>
				        <el-option label="女" value="2"></el-option>
				    </el-select>
       </el-form-item>
      </span>
      <el-form-item>
        <span v-for="(item,index) in power" :key="index">
           <el-button v-if="item.name.trim()=='检索'" type="primary"  icon="el-icon-search" @click="search">检索</el-button>
           <el-button v-if="item.name.trim()=='导出'" type="warning"  icon="iconfont icon-daoru" @click="exportList">导出</el-button>
        </span>
		  </el-form-item>

 		 </el-form>

        <el-table
            :data="data" border  style="width: 100%">
            <el-table-column label="序号" width="50" type="index"></el-table-column>
            <el-table-column  prop="readerCardNumber" label="读者证号"></el-table-column>
            <el-table-column  prop="userName" label="读者姓名"></el-table-column>
            <el-table-column  prop="sex" label="读者性别">
							<template slot-scope="scope">
								<span v-if="scope.row.sex == 1">男</span>
								<span v-if="scope.row.sex == 2">女</span>
							</template>
						</el-table-column>
            <el-table-column  prop="readerType" label="证件类型">
							<template slot-scope="scope">
								<span v-if="scope.row.readerType == 0">其他</span>
								<span v-if="scope.row.readerType == 1">学生</span>
							</template>
						</el-table-column>
            <el-table-column  prop="recount" label="借购图书总数"></el-table-column>
       </el-table>

  	<el-row>
  			<el-col :span="24">
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
   			</el-col>
		</el-row>

  </div>
</template>

<script>
import { toplendbuyreader } from "@/request/ranking";
export default {
	data(){
  		return {
  			listLoading:false,
				picker:[],
			searchData: {
        searchKey: "userName",
        searchValue: "",
        startTime: "",
        endTime: ""
      },
  			form:{
  				pageNum: 1,
  				pageSize:10
  			},
  			dataPage:{},
				data:[],
				exportBlist: {},
        power:[],//按钮权限数组
        searchButton:false
  		}
		},
		created() {
      this.getPowerArr();
			this.getToplendbuyreader(JSON.stringify(this.form))
		},
		methods: {
      //得到权限按钮数组
      getPowerArr(){
        let  obj;
        let  power =this.$route.meta.power;
        for(let i=0,len=power.length;i<len;i++){
          if(power[i].name=='检索'){
            this.searchButton=true;
            obj=power[0];
            power[0]=power[i];
            power[i]=obj
          }
        }
        this.power=power;
      },
    getToplendbuyreader(obj) {
      this.listLoading = true;
      toplendbuyreader(obj).then(data => {
        this.dataPage = data.data.page;
        if (data.data.code == 0) {
          this.data = data.data.page.list;
        } else {
          this.$message({
            type: "error",
            message: "请求成功!后台出错! " + data.data.msg,
            duration: 3 * 1000,
            showClose: true
          });
        }
      });
		},
		//导出
    exportList(){
      this.$confirm('是否要导出这'+this.data.length+'条读者借购排行榜信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
         this.exportBlist = {
           export:'1',
           pageSize: this.form.pageSize,
           pageNum: this.form.pageNum
        }
        Object.assign(this.exportBlist, this.searchData);
        toplendbuyreader(this.exportBlist).then(data=>{
          if(data.data.code==0){
            window.location.href = data.data.xlsurl;
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
		search() {
      this.form = {
        pageNum: 1,
        pageSize: 10
      }
      Object.assign(this.form, this.searchData);
      this.getToplendbuyreader(JSON.stringify(this.form));
		},
    handleSizeChange(val) {
      this.form.pageSize = val;
      this.getToplendbuyreader(JSON.stringify(this.form));
    },
    handleCurrentChange(val) {
      this.form.pageNum = val;
      this.getToplendbuyreader(JSON.stringify(this.form));
    }
	},
	watch:{
			picker(newVal){
				if(newVal&&newVal.length>0){
					this.searchData.startTime=newVal[0];
					this.searchData.endTime=newVal[1];
				}else{
					this.searchData.startTime='';
					this.searchData.endTime='';
				}
			}
		}

}
</script>


<style>

</style>
