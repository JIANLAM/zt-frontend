<template>
    <div id="template">
        <el-form ref="exportForm" :model="exportForm" label-width="140px" :inline="true">
            <div>
            <el-form-item label="导出数据类型">
                <el-select  style="width: 420px;" v-model="exportForm.sjtype">
                    <el-option label="MARC数据" value="1"></el-option>
                    <el-option label="Execl表格" value="2"></el-option>
                </el-select>
            </el-form-item>
            </div>
            <div>
            <el-form-item label="导出库">
                <el-select  style="width: 420px;" v-model="exportForm.daor">
                    <el-option label="采访库" value="1"></el-option>
                    <el-option label="中央库" value="2"></el-option>
                </el-select>

            </el-form-item>
            <!--<el-form-item label="分类号">-->
                <!--<el-input  style="width: 210px;" v-model="exportForm.bookType" clearable></el-input>-->
                <!--<el-button type="primary" @click="search(exportForm.daor)">查询</el-button>-->
                <!--<el-button type="primary" @click="exportBtn(exportForm.daor, exportForm.sjtype)">导出</el-button>-->
            <!--</el-form-item>-->
            </div>
            <!-- <div>
                <el-form-item label="书目记录号范围">
                    <el-input  style="width: 210px;" v-model="exportForm.jl"></el-input>
                    <span>-</span>
                    <el-input style="width: 210px;" v-model="exportForm.zd"></el-input>
                </el-form-item>
            </div>
            <div class="interview" v-if="exportForm.daor == 1">
                <div>
                    <el-form-item label="条码号范围">
                        <el-input  style="width: 210px;" v-model="exportForm.jl"></el-input>
                        <span>-</span>
                        <el-input style="width: 210px;" v-model="exportForm.zd"></el-input>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="索取号范围">
                        <el-input  style="width: 210px;" v-model="exportForm.jl"></el-input>
                        <span>-</span>
                        <el-input style="width: 210px;" v-model="exportForm.zd"></el-input>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="条码号字段">
                        <el-input  style="width: 210px;" v-model="exportForm.barcode"></el-input>
                    </el-form-item>
                    <el-form-item label="索取号字段">
                        <el-input style="width: 210px;" v-model="exportForm.carNO"></el-input>
                    </el-form-item>
                    <el-form-item label="条码号字段添加方式">
                        <el-input style="width: 210px;" v-model="exportForm.tz"></el-input>
                    </el-form-item>
                </div>
            </div> -->
            <!-- <div>
                <el-form-item label="记录结束符">
                    <el-input  style="width: 210px;" v-model="importForm.jl"></el-input>
                </el-form-item>
                <el-form-item label="字段结束符">
                    <el-input style="width: 210px;" v-model="importForm.zd"></el-input>
                </el-form-item>
                <el-form-item label="子字段结束符">
                    <el-input style="width: 210px;" v-model="importForm.zzd"></el-input>
                </el-form-item>
            </div>  -->
            <div>
                <el-form-item label="分类号范围">
                    <el-input  style="width: 210px;" v-model="exportForm.bookTypeStar" clearable></el-input>
                    <span>-</span>
                    <el-input style="width: 210px;" v-model="exportForm.bookTypeEnd " clearable></el-input>
                  <el-button type="primary" @click="search(exportForm.daor)">查询</el-button>
                  <el-button type="primary" @click="exportBtn(exportForm.daor, exportForm.sjtype)">导出</el-button>
                </el-form-item>
            </div>
        </el-form>
         <el-table
            :data="tableData" border  style="width: 100%" @current-change="deailsData" highlight-current-row v-loading="loading">
            <el-table-column  type="index" width="50" label="序号">  </el-table-column>
            <!-- <el-table-column  prop="remark"  label="书目记录号">  </el-table-column> -->
            <el-table-column  prop="title"  label="图书名称">  </el-table-column>
            <el-table-column  prop="isbn"  label="ISBN">  </el-table-column>
            <el-table-column  prop="author"  label="作者">  </el-table-column>
            <el-table-column  prop="bookType"  label="分类号">  </el-table-column>
            <el-table-column  prop="publisher"  label="出版社">  </el-table-column>
            <el-table-column  prop="pubdate"  label="出版时间" :formatter="dateFormat">  </el-table-column>
            <el-table-column  prop="price"  label="单价（元）">  </el-table-column>
            <el-table-column  prop="bookSize"  label="开本">  </el-table-column>
            <el-table-column  prop="pages"  label="页数">  </el-table-column>
            <el-table-column  prop="summary"  label="摘要" width="200px" show-overflow-tooltip>  </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageData.pageSize"
            :current-page="pageData.pageNum"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageData.total"
            >
        </el-pagination>
        <el-dialog title="MARC信息" :visible.sync="visible">
            <span v-html="marcBookData" class="marc"></span>
        </el-dialog>
    </div>
</template>

<script>
import {cataloguePreBook, catalogueBook, exportPreBook, exportBook, exportPrebookMARC, exportBookMarc, infoprePrebookMARC, infoBookMarc } from '@/request/catalog';
import moment from "moment";
export default {
    data() {
      return {
          loading: false,
         activeName: 'first',
         exportForm: {
             bookType: '',
             bookTypeStar: '',
             bookTypeEnd: '',
             daor: '1',
             sjtype: '1'
         },
         tableData: [],
         pageData: {
             pageSize: 10,
             pageNum: 1,
             total: 0
         },
         searchData: {},
         exportData: {},
         warehouseType: '', // 存储搜索后的库类型
         marcBookData: '',
         visible: false
      };
    },
     methods: {
        //  采访库查询
       getCataloguePreBook(obj) {
           this.loading = true;
           cataloguePreBook(obj).then(data =>{
               if(data.data.code == 0) {
                   this.pageData = {
                        pageSize: data.data.page.pageSize,
                        pageNum: data.data.page.pageNum,
                        total: data.data.page.total
                    }
                   this.tableData = data.data.page.list;
                   this.loading = false;
               }else {
                    this.$message({
                    type: 'error',
                    message: data.data.msg,
                    duration:'2000'
                });
               }
           })
       },
        // 中央库查询
        getCatalogueBook(obj) {
            this.loading = true;
            catalogueBook(obj).then(data =>{
                if(data.data.code == 0) {
                    this.pageData = {
                        pageSize: data.data.page.pageSize,
                        pageNum: data.data.page.pageNum,
                        total: data.data.page.total
                    }
                   this.tableData = data.data.page.list;
                   this.loading = false;
                }else {
                    this.$message({
                        type: 'error',
                        message: data.data.msg,
                        duration:'2000'
                    });
                }
            })
        },
       search(type) {
           this.searchData = {
                bookType: this.exportForm.bookType,
                bookTypeStar: this.exportForm.bookTypeStar,
                bookTypeEnd: this.exportForm.bookTypeEnd,
                pageNum: 1,
                pageSize: 10
            }
           if(type == '1') {
               this.warehouseType = type;
               this.getCataloguePreBook(JSON.stringify(this.searchData));
           }else {
                this.warehouseType = type;
               this.getCatalogueBook(JSON.stringify(this.searchData));
           }
       },
       //导出
	    exportBtn(type, tabType){
	    	this.$confirm('是否要导出该数据?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
	        }).then(() => {
                this.exportData = {
                    bookType: this.exportForm.bookType,
                    bookTypeStar: this.exportForm.bookTypeStar,
                    bookTypeEnd: this.exportForm.bookTypeEnd
                    }
                    // 导出execl格式
                    if (tabType == '2') {
                        if(type == '1') {
                            exportPreBook(JSON.stringify(this.exportData)).then(data=>{
                                if(data.data.code==0){
                                    console.log(data.data)
                                    window.open(data.data.xlsurl);
                                        this.$message({
                                        type: 'success',
                                        message: '导出成功!正在下载，请稍后..',
                                        duration:'6000'
                                    });
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
                                    message: '导出失败!'
                                });
                            })
                        }else{
                            exportBook(JSON.stringify(this.exportData)).then(data=>{
                                if(data.data.code==0){
                                    console.log(data.data)
                                    window.open(data.data.xlsurl);
                                    this.$message({
                                        type: 'success',
                                        message: '导出成功!正在下载，请稍后..',
                                        duration:'6000'
                                    });
                                }else {
                                    this.$message({
                                        type: 'error',
                                        message: data.data.msg,
                                        duration:'2000'
                                    });
                                }
                            }).catch(err=>{
                                this.$message({
                                    type: 'info',
                                    message: '导出失败!'
                                });
                            })
                        }
                    }else {
                        if(type == '1') {
                            exportPrebookMARC(JSON.stringify(this.exportData)).then(data=>{
                                if(data.data.code==0){
                                    console.log(data.data)
                                    window.open(data.data.xlsurl);
                                    this.$message({
                                        type: 'success',
                                        message: '导出成功!正在下载，请稍后..',
                                        duration:'6000'
                                    });
                                }else {
                                    this.$message({
                                        type: 'error',
                                        message: data.data.msg,
                                        duration:'2000'
                                    });
                                }               
                            }).catch(err=>{
                                this.$message({
                                    type: 'info',
                                    message: '导出失败!'
                                });
                            })
                        }else{
                            exportBookMarc(JSON.stringify(this.exportData)).then(data=>{
                                if(data.data.code==0){
                                    console.log(data.data)
                                    window.open(data.data.xlsurl);
                                    this.$message({
                                        type: 'success',
                                        message: '导出成功!正在下载，请稍后..',
                                        duration:'6000'
                                    });
                                }else {
                                    this.$message({
                                        type: 'error',
                                        message: data.data.msg,
                                        duration:'2000'
                                    });
                                }
                               
                            }).catch(err=>{
                                this.$message({
                                    type: 'info',
                                    message: '导出失败!'
                                });
                            })
                        }
                    }

	        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '导出失败!'
		          });
	        });
        },
        dateFormat(row, column) {
            var date = row[column.property];
            if (date == undefined) {
                return "";
            }
            return moment(date).format("YYYY-MM-DD");
        },
        handleSizeChange(val) {
            this.searchData.pageSize = val;
            if(this.warehouseType == '1') {
                this.getCataloguePreBook(JSON.stringify(this.searchData));
            }else {
                this.getCatalogueBook(JSON.stringify(this.searchData));
            }

        },
        handleCurrentChange(val) {
            this.searchData.pageNum = val;
            if(this.warehouseType == '1') {
                this.getCataloguePreBook(JSON.stringify(this.searchData));
            }else {
                this.getCatalogueBook(JSON.stringify(this.searchData));
            }
        },
        deailsData(row) {
            let bookId = row.id;
            this.visible = true;
            if (this.warehouseType == '1') {
                infoprePrebookMARC(bookId).then(data =>{
                    if(data.data.code == 0) {
                        this.marcBookData = data.data.marcpreBookString;
                    }else {
                         this.$message({
                            type: 'error',
                            message: data.data.msg,
                            duration:'2000'
                        });
                    }
                })
            }else {
                infoBookMarc(bookId).then(data =>{
                    if(data.data.code == 0) {
                        this.marcBookData = data.data.marcBookString;
                    }else {
                        this.$message({
                            type: 'error',
                            message: data.data.msg,
                            duration:'2000'
                        });
                    }
                })
            }
        }
    }
  };
</script>

<style>
    .box-card{margin-top: 50px;}
    .marc{line-height: 24px;}
</style>
