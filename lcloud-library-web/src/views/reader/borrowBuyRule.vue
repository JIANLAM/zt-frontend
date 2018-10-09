<template>
	<div class="container">
		<el-form :inline="true" class="demo-form-inline">
			<el-form-item>
        <span v-for="(item,index) in power" :key="index">
          <el-button v-if="item.name.trim()=='新增'" type="success" icon="el-icon-plus" @click="addRule(1)">新增规则</el-button>
          <el-button v-if="item.name.trim()=='删除'" type="danger" icon="el-icon-delete" :disabled="allSelect" @click="dalet('all','all')">删除</el-button>
        </span>
			  <!-- <el-button type="primary"  icon="el-icon-success" :disabled="allSelect">启用多项</el-button>
			  <el-button type="info" icon="iconfont icon-jinyong" :disabled="allSelect">禁用多项</el-button> -->
			  <!-- <el-button type="danger" icon="iconfont icon-jichutubiao-">导入</el-button> -->
			  <!-- <el-button type="warning" icon="iconfont icon-daoru" >导出</el-button> -->
		 	</el-form-item>
		</el-form>

		 <el-table
		    ref="multipleTable"
		    :data="data"
		    tooltip-effect="dark"
		    style="width: 100%"
		    @selection-change="selectChange"
				v-loading="loading"
		   	>
		    <el-table-column
		      type="selection"
		      width="55">
		    </el-table-column>
		    <el-table-column
				prop="ruleName"
		      label="规则名称"
		      >

		    </el-table-column>
		    <el-table-column
		      prop="creatorName"
		      label="创建者"
		     >
		    </el-table-column>
		    <el-table-column
		      prop="createTime"
		      label="创建时间"
		        show-overflow-tooltip
		      >
		    </el-table-column>
		    <!-- <el-table-column
		      prop="lastUpdatePeople"
		      label="最后修改者"
		      >
		    </el-table-column>
		     <el-table-column
		      prop="lastUpdateTime"
		      label="最后修改时间"
		      show-overflow-tooltip
		      >
		    </el-table-column> -->

		     <el-table-column
		      prop="readerTypeName"
		      label="读者证类型"
		      show-overflow-tooltip
		      >
		    </el-table-column>
		     <el-table-column
		      prop="summary"
		      label="备注"
		      show-overflow-tooltip
		      >
		    </el-table-column>
		    <el-table-column
		      label="启用状态"
		     	align="center"
		      >
				<template slot-scope="scope">
					<el-switch
					  v-model.number="scope.row.status"
					  active-color="#13ce66"
					  inactive-color="#ff4949"
					  @change="changEnable(scope.row)"
            v-if="searchButton"
					></el-switch>
            <el-switch
              v-model.number="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              disabled
              v-else
            >
					</el-switch>
			       <!-- <el-tag type="success" v-if="scope.row.isEnable">启用</el-tag>
				  	<el-tag type="danger" v-if="!scope.row.isEnable">禁用</el-tag>  -->
			   </template>
		    </el-table-column>
		     <el-table-column
		      label="操作"
		      >
		      	<template slot-scope="scope">
          <span v-for="(item,index) in power" :key="index">
              <el-button v-if="item.name.trim()=='修改'" type="text" size="mini" @click="addRule(0,scope.row)">修改</el-button>
              <el-button v-if="item.name.trim()=='删除'" type="text" size="mini" :style="{color:'#f56c6c'}" @click="dalet(scope.row,'one')">删除</el-button>
          </span>
					<!--<el-button type="text" size="mini" :style="{color:'#67c23a'}" @click="orderDetail(scope.row)">借购规则详情</el-button>-->
			   </template>
		    </el-table-column>

		  </el-table>
     <el-row>
  			<el-col :span="24">
		  		<el-pagination
			      :page-sizes="[3, 5, 10, 20]"
			      :page-size="form.pageSize"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="dataPage.total"
				  @size-change="handleSizeChange"
	              @current-change="handleCurrentChange"
	              :current-page="dataPage.pageNum"
			      >
			   	 </el-pagination>
   			</el-col>
		</el-row>
		<rule-dia-log ref='RuleDiaLog' v-on:childMethod="getData"></rule-dia-log>
    <!-- 借购详情 -->
	<dia-log :visible.sync="showDia" title="借购详情" >
			<el-table
		    ref="books"
		    :data="detailList"
		    tooltip-effect="dark"
		    style="width: 100%"

		   	>
		     <el-table-column
		      type="index"
		      width="55">
		    </el-table-column>
		    <el-table-column
				prop="ruleName"
		      label="规则名称"
		      >
		    </el-table-column>
		    <el-table-column
				prop="duplicateQty"
		      label="复本数(本)"
		      >
		    </el-table-column>

		    <el-table-column
				prop="lendbuyDays"
		      label="借购天数"
		      >
		    </el-table-column>
		    <el-table-column
				prop="publishYear"
		      label="出版年份"
		      >
		    </el-table-column>
		    <el-table-column
				prop="categoryNo"
		      label="分类号"
		      >
		    </el-table-column>
		    <el-table-column
				prop="bookName"
		      label="书名"
		      >
		    </el-table-column>
		    <el-table-column
				prop="bookPrice"
		      label="图书单价"
		      >
		    </el-table-column>
		    <el-table-column
				prop="bookSize"
		      label="图书开本"
		      >
		    </el-table-column>

				<el-table-column
				prop="autoReceivedDays"
		      label="自动签收时间"
		      >
		    </el-table-column>
		    <el-table-column
				prop="overduePayrate"
		      label="逾期罚款率"
		      >
		    </el-table-column>
				<el-table-column
				prop="lostPayrate"
		      label="丢失罚款率"
		      >
		    </el-table-column>
				<el-table-column
				prop="brokenPayrate"
		      label="污损罚款率"
		      >
		    </el-table-column>
				<el-table-column
				prop="overduePayrate"
		      label="读者类型限制"
		      >
		    </el-table-column>
				<el-table-column
				prop="credit"
		      label="信用值限制"
		      >
		    </el-table-column>
					<el-table-column
		      label="是否启用"
		      >
					<template slot-scope="scope">
						 <el-tag v-if="scope.row.status==0" type="success">禁用</el-tag>
            <el-tag v-if="scope.row.status==1" type="warning">启用</el-tag>
						</template>
		    </el-table-column>
					<el-table-column
				prop="remark"
		      label="备注"
		      >
		    </el-table-column>
		  </el-table>

		</dia-log>


	</div>
</template>

<script>
import DiaLog from '@/components/Dialog'
import RuleDiaLog from './RuleDialog'
import {ruleList,ruleListOn,ruleListOff,ruleListDelete,ruleListInfo,getData} from '@/request/manage'
  export default{
  	components:{
			RuleDiaLog,
				DiaLog
  	},
  	data(){
  		return {
				loading:false,
				allSelect:true,
				showDia:false,
				form:{
          pageSize:5,
          pageNum:1
				},
				detailList:[],
				data:[],
				dataPage:{},
				selection:'',
        power:[],//按钮权限数组
        searchButton:false
  		}
  	},
  	methods:{
      //得到权限按钮数组
      getPowerArr(){
        let  obj;
        let  power =this.$route.meta.power;
        for(let i=0,len=power.length;i<len;i++){
          if(power[i].name=='新增'){
            obj=power[0];
            power[0]=power[i];
            power[i]=obj
          }else if(power[i].name=='修改'){
            this.searchButton=true
          }
        }
        this.power=power;
      },
			//分页事件
      handleSizeChange(val) {
        this.form.pageSize=val;
        this.getData();
      },
      handleCurrentChange(val) {
        this.form.pageNum=val;
        this.getData();
      },
			 //获取数据
      getData(data=this.form){
				getData.call(this,ruleList,data);

      },
  		selectChange(selection){
  			if(selection.length&&selection.length>0){
					this.allSelect=false;
					this.selection=selection
  			}else{
					this.allSelect=true;
					this.selection=""
  			}

  		},
  		changEnable(row){
				console.log(row)
				if(row.status){
          this.$confirm('启用此规则，读者类型相同的其他规则将禁用，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            ruleListOn(row.readerType,row.id).then(data=>{
              if(data.data.code==0){
                this.$message({
                  message: '启用状态成功!',
                  type: 'success'
                });
                this.getData();
              }else{
                this.$message({
                  message: data.data.msg,
                  type: 'error'
                });
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作！'
            });
            row.status=false
          });



				}else{
					ruleListOff(row.readerType,row.id).then(data=>{
				if(data.data.code==0){
					this.$message({
			          message: '禁用状态成功!',
			          type: 'success'
			        });
				}else{
					this.$message({
			          message: data.data.msg,
			          type: 'error'
			        });
				}
			})
				}



  		},

			// 删除借购规则
  		dalet(row,types){
						var deleteType="";
						var arr=[]
						var deleteId="";
						if(types=="one"){
							 deleteType="是否要删除此条规则?";
							 deleteId=row.id
						}else{
							 deleteType="是否要删除这"+this.selection.length+"条规则?";

							 for(let i=0,length=this.selection.length;i<length;i++){
								 arr.push(this.selection[i].id);
								 deleteId=arr.join(",")
								 	 console.log(deleteId)
							 }
						}
  			this.$confirm(deleteType, '提示', {
					cancelButtonClass: 'btn-custom-cancel1',
					    cancelButtonText: '取消',
		          confirmButtonText: '确定',
		          type: 'warning'
		        }).then(() => {
		        	 ruleListDelete(deleteId).then(data=>{
				      if(data.data.code==0){
					      this.$message({
			           message: '删除成功!',
								 type: 'success'

							 });
							 this.getData();
				       }else{
				      	this.$message({
			          message: data.data.msg,
			          type: 'error'
			         });
				}
			})

		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除操作!'
		          });
		        });
  		},
  		addRule(id,row=[]){
  			this.$refs['RuleDiaLog'].visible(id);
  			if(id==0){
  				this.$refs['RuleDiaLog'].init(row);
  			}
			},
			// 查看订单详情
			orderDetail(row){
					this.showDia=true
          	ruleListInfo(row.id).then(data=>{
  				if(data.data.code==0){
  					if(data.data.rule){
							this.detailList=[];
							this.detailList.push(data.data.rule);
						   console.log(this.detailList)
  					}else{
  						this.detailList=[];
  					}

  				}else{
  					this.$message({
			            type: 'error',
			            message: '请求成功!但后台返回错误! '+data.data.msg,
			             duration: 10 * 1000,
			             showClose: true
			        });
  				}
  			}).catch(error=>{

  			})
			}
  	},
    created() {
      this.getPowerArr();
		  this.getData();
		},
		watch:{

		}
  }

</script>

<style type="style/css" scoped>
	.el-button .iconfont+span{
		margin-left: 5px;
	}
	.btn-custom-cancel1 {
  float: right!important;
  margin-left: 10px;
}
</style>
