<template>
  <div class="container"> 
  <el-dialog title="订单详情" width="70%" :visible.sync="dialogTableVisible">
    <el-table :data="gridData">
      <el-table-column type='index'></el-table-column>
      <el-table-column property="title" label="图书名称" ></el-table-column>
      <el-table-column property="isbn" label="isbn" ></el-table-column>
      <el-table-column property="author" label="作者" ></el-table-column>
      <el-table-column property="bookKind" label="分类号" ></el-table-column>
      <el-table-column property="publishComp" label="出版社" ></el-table-column>
      <el-table-column property="publishDate" label="出版时间" ></el-table-column>
      <el-table-column property="price" label="单价"></el-table-column>
    </el-table>
  </el-dialog>
  <el-tabs type="border-card">
    <el-tab-pane label="订购单列表">     
        <el-table
          :data="acqbillList.list"
           stripe
          style="width: 100%">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="billId"
            label="订单号"
            >
          </el-table-column>
          <el-table-column
            prop="createUserId"
            label="创建者"
            >
          </el-table-column>
           <el-table-column 
            label="创建时间"
            >
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
              </template>
          </el-table-column>

          <el-table-column
            prop="budget"
            label="预算金额"
            >
          </el-table-column>
          <el-table-column
            prop="bookSum"
            label="总册数"
            >
          </el-table-column>
          <el-table-column
            :formatter="priceformat"
            prop="price"
            label="总金额"
            >
          </el-table-column>
           <el-table-column
            prop="status"
            label="状态"
            :filters="[{ text: '未审核', value: '0' }, { text: '审核通过', value: '1' }]"
            :filter-method="filterTag"
            filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.status === '0' ? 'danger' : 'success'"
                close-transition>{{scope.row.status | format }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            >
          </el-table-column>
          <el-table-column
              label="操作"
              width="120">
               <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
              </template>
          </el-table-column>
        </el-table> 
    </el-tab-pane>
    <el-tab-pane label="推荐图书列表">
        <el-form :inline="true"  class="demo-form-inline" @submit.native.prevent>
          <el-form-item label="书名:">
            <el-input v-model="bookName" placeholder="书名">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="success" :disabled="isDisabled" @click="joinCar">加入订购单</el-button>
          </el-form-item>
         </el-form>
       <el-table
          :data="data.list"
           stripe
          @selection-change="handleSelectionChange"
          style="width: 100%">

          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="title"
            label="图书名称"
            >
          </el-table-column>
          <el-table-column
            prop="isbn"
            label="isbn"
            >
          </el-table-column>
         
          <el-table-column
            prop="author"
            label="作者"
            >
          </el-table-column>
          <el-table-column
            prop="bookKind"
            label="分类号"
            >
          </el-table-column>
          <el-table-column
            prop="publishComp"
            label="出版社"
            >
          </el-table-column>
          <el-table-column 
            label="出版时间"
            >
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.publishDate }}</span>
              </template>
          </el-table-column>
          <el-table-column
            prop="price"
            label="单价"
            >
          </el-table-column>      
        </el-table> 
    </el-tab-pane>
  </el-tabs>   

 
</div>
</template>
<script>
	import { acqbookList,acqbillList,billBooks,textListss} from '@/request/groom'
	export default{
		data(){
			return { 
        bookName:'',
				data:'',
        acqbillList:'',
        gridData:'',
        dialogTableVisible:false,
        isDisabled:true,
        carList:[],
        money:0
			}	
		},
    filters: {
      format(value){
         return value === '0' ? '未审核' : '审核通过'
      }   
    },
    methods:{
      handleClick(row){
          billBooks(row.bookKindSum).then( res =>{
              this.gridData=res.data.list;
              this.dialogTableVisible=true;
          }).catch(error => {
            this.$message.error(error);
          });
      },   
      filterTag(value, row) {
        return row.status === value;
      },
      priceformat(row, column) {
        return row.price.toFixed(2);
      },
      handleSelectionChange(row){     
         if(row.length&&row.length>0){
            this.isDisabled=false;
         }else{
           this.isDisabled=true;
         }
         this.carList=row;
      },
      search(){
        this.requestBook(this.bookName)
      },
      requestBook(title){
          acqbookList(title).then(res=>{
            this.data=res.data.page;  
          }).catch(error => {
             this.$message.error(error);
          });
      },
      joinCar(){
        this.$prompt('请输入预算金额', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
          inputErrorMessage: '输入的预算金额格式不正确!',
          roundButton:true
        }).then(({ value }) => {
          this.$message({
            type: 'success',
            message: '加入订购单成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '您取消输入'
          });       
        });
      }
    },
		mounted(){
      textListss().then(res=>{
         console.log(res)
      })
		  this.requestBook();
      acqbillList().then(res=>{
        if(res.data.msg=="success"){
          this.acqbillList=res.data.page;
        }else{
          this.$message.error('错误');
        }      
      }).catch(error => {
          console.log(error);
      })
		}
	}
</script>
<style scoped>

</style>