<template>
	<div class="container">
		<el-form :inline="true"  class="demo-form-inline">
			<el-form-item>
		    <el-button type="success" @click="addRess" icon="el-icon-plus">新增地址</el-button>
		  </el-form-item>
		</el-form>
		<el-table
		    :data="data"
		    style="width: 100%"
		    max-height="650"
		    :row-class-name="tableRowClassName">
	    <el-table-column
	      type="index"
	      width="50"
	       fixed>
	    </el-table-column>
	    <el-table-column
	      prop="name"
	      label="收货人"
	     >
	    </el-table-column>
	    <el-table-column
	      prop="area"
	      label="所在地区"
	      >
	    </el-table-column>
	    <el-table-column
	      prop="address"
	      label="详细地址">
	    </el-table-column>
	    <el-table-column
	      prop="zipcode"
	      label="邮编">
	    </el-table-column>
	    <el-table-column
	      prop="tel"
	      label="电话/手机">
	    </el-table-column>
	    <el-table-column
	      label="状态">
	    	  <template slot-scope="scope">
					<el-tag type="danger" v-if='scope.row.isDefault'>默认地址</el-tag>	
		       </template>
	    </el-table-column>
	    <el-table-column
	      label="操作"
	       align='center'>
	        <template slot-scope="scope">
		        <el-button type="text" size="small" @click="update(scope.row)">修改</el-button>
		        <el-button type="text" size="small" :style="{color:'#f56c6c'}" @click="delet(scope.row)">删除</el-button>
		        <el-button type="text" size="small" :style="{color:'#e6a23c'}" v-if='!scope.row.isDefault' @click="setDefault(scope.row)">设为默认</el-button>
		    </template>
	    </el-table-column>
	  </el-table>
		
		<dia-log ref="diaLog"></dia-log>
	</div>
</template>

<script>
import DiaLog from './AddressDialog.vue'
  export default{
  	components:{
  		DiaLog
  	},
  	data(){
  		return {
  			dialogTableVisible:false,
  			data:[{
  				id:'01',
  				name:'杨潇',
  				area:['广东省','深圳市','宝安区'],
  				address:'中央大道B座H单元（14楼）',
  				zipcode:'518101',
  				tel:'18170873545',
  				isDefault:true
  			},{
  				id:'02',
  				name:'杨潇1',
  				area:['广东省','深圳市','宝安区'],
  				address:'中央大道B座H单元（14楼）',
  				zipcode:'518101',
  				tel:'18170873545',
  				isDefault:false
  			},{
  				id:'03',
  				name:'杨潇2',
  				area:['广东省','深圳市','宝安区'],
  				address:'中央大道B座H单元（14楼）',
  				zipcode:'518101',
  				tel:'18170873545',
  				isDefault:false
  			},{
  				id:'04',
  				name:'杨潇3',
  				area:['广东省','深圳市','宝安区'],
  				address:'中央大道B座H单元（14楼）',
  				zipcode:'518101',
  				tel:'18170873545',
  				isDefault:false
  			}],
  			default:'01'
  		}
  	},
  	methods:{
  		tableRowClassName({row, rowIndex}) {
	        if (rowIndex === 2) {
	          return 'success-row'
	        }else{
	           return ''
	        }
	       
      	},
      	addRess(){
      		this.$refs['diaLog'].visible(1);

      	},
      	update(row){
      		this.$refs['diaLog'].visible(0);
      		this.$refs['diaLog'].init(row);
      	},
      	setDefault(row){
      		  this.$confirm('将这条地址设为默认吗?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		       		for(let i in this.data){
		      			if(this.data[i].id==this.default){
		      				this.data[i].isDefault=false;
		      			}
		      		}
		      		row.isDefault=true;
		      		this.default=row.id;
			          this.$message({
			            type: 'success',
			            message: '设为默认地址成功!'
			          });
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消设置'
		          });          
		        });	
      	},
      	delet(row){
      		this.$confirm('确认要删除这条收货地址吗?', '警告', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'error'
		        }).then(() => {
		          
		       		for(let i in this.data){
		      			if(this.data[i].id==row.id){
		      				if(this.data[i].isDefault){
		      					this.data.splice(i,1)
		      					try{
		      						this.default=this.data[0].id;
		      						this.data[0].isDefault=true
		      					}catch(e){
		      						
		      					}
		      					
		      				}else{
		      					this.data.splice(i,1)
		      				}	
		      				
		      			}
		      		}
	      			
		          this.$message({
		            type: 'success',
		            message: '删除成功!'
		          });
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除!'
		          });          
		        });	
      	}
  	}
  
  }
  
</script>

<style type="style/css" scoped>

</style>