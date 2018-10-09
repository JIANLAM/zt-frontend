<template>
    <div id="bibliographyImport">
            <el-form ref="importForm" :model="importForm" label-width="140px" :inline="true">
                <div>
                <el-form-item label="数据类型">
                    <el-select  style="width: 420px;" v-model="importForm.sjtype">
                        <el-option label="MARC数据" value="marc"></el-option>
                        <el-option label="Excel表格" value="execl"></el-option>
                    </el-select>
                </el-form-item>
                    </div>
                    <div>
                    <el-form-item label="导入库" >
                        <el-select  style="width: 420px;" v-model="importForm.daor">
                            <el-option label="采访库" value="1"></el-option>
                            <el-option label="中央库" value="2"></el-option>
                        </el-select>
                        <el-button type="primary" @click="importPreview">导入预览</el-button>
                        <el-button type="primary" @click="importReaderData">导入</el-button>
                    </el-form-item>
                    </div>
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
                <!-- <div v-if="importForm.daor == 1">
                    <el-form-item label="条码号字段">
                        <el-input  style="width: 210px;" v-model="importForm.barcode"></el-input>
                    </el-form-item>
                    <el-form-item label="索取号字段">
                        <el-input style="width: 210px;" v-model="importForm.carNO"></el-input>
                    </el-form-item>
                    <el-form-item label="条码号字段添加方式">
                        <el-input style="width: 210px;" v-model="importForm.tz"></el-input>
                    </el-form-item>
                </div>  -->
            </el-form>
            <div class="tip">{{tip}}</div>
            <el-table
                :data="tableData" border  style="width: 100%" >
                <el-table-column  type="index" width="50" label="序号">  </el-table-column>
                <!-- <el-table-column  prop="remark"  label="书目记录号">  </el-table-column> -->
                <el-table-column  prop="title"  label="图书名称">  </el-table-column>
                <el-table-column  prop="isbn"  label="ISBN">  </el-table-column>
                <el-table-column  prop="author"  label="作者">  </el-table-column>
                <el-table-column  prop="bookType"  label="分类号">  </el-table-column>
                <el-table-column  prop="publisher"  label="出版社">  </el-table-column>
                <el-table-column  prop="pubdate"  label="出版时间">  </el-table-column>
                <el-table-column  prop="bookSize"  label="单价（元）">  </el-table-column>
                <el-table-column  prop="remark"  label="开本">  </el-table-column>
                <el-table-column  prop="pagesTest"  label="页数">  </el-table-column>
                <el-table-column  prop="summary"  label="摘要" width="200px" show-overflow-tooltip>  </el-table-column>
            </el-table>
            <!-- <el-pagination
                :page-sizes="[10, 20, 30, 40]"
                :page-size="10"
                :current-page="1"
                layout="total, sizes, prev, pager, next, jumper"
                :total="10"
                >
            </el-pagination> -->
            <!--excel导入弹框-->
            <el-dialog :visible.sync="dialogImportVisible" title="导入excel数据" :width="'400px'" >
                <el-upload
                    class="upload-demo"
                    drag
                    ref="upload"
                    action="/apiCatalog/v1/catalogue/importBook"
                    accept=".xls"
                    :http-request="tableDataSuccessUpload"
                    :limit="1"
                    :on-exceed="handleExceed"
                    :auto-upload="false"
                    name="fileName"
                    v-loading="bookLoading">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传xls文件</div>
                </el-upload>
                <span  slot="footer" class="upload_btn_wrap dialog-footer">
                    <el-button  round type="primary" @click="upload" size="small" :loading="bookLoading">点击上传</el-button>
                    <el-button @click="dialogImportVisible = false" round size="small">取 消</el-button>
                </span>
            </el-dialog>
            <!-- marc导入弹框 -->
            <el-dialog :visible.sync="marcImportVisible" title="导入marc数据" :width="'400px'">
                <el-upload
                    class="upload-demo"
                    drag
                    ref="marcUpload"
                    action="/apiCatalog/v1/catalogue/importBook"
                    accept=".ISO"
                    :http-request="tableDataSuccessUpload"
                    :limit="1"
                    :on-exceed="handleExceed"
                    :auto-upload="false"
                    name="fileName"
                    v-loading="BookMarcLoading">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传ISO文件</div>
                </el-upload>
                <span  slot="footer" class="upload_btn_wrap dialog-footer">
                    <el-button  round type="primary" @click="marcUpload" size="small" :loading="BookMarcLoading">点击上传</el-button>
                    <el-button @click="marcImportVisible = false" round size="small">取 消</el-button>
                </span>
            </el-dialog>
            <!-- marc导入预览框 -->
            <el-dialog :visible.sync="previewMarcImportVisible" title="marc导入预览" :width="'400px'">
                <el-upload
                    class="upload-demo"
                    drag
                    ref="marcPreview"
                    action="/apiCatalog/v1/catalogue/importBook"
                    accept=".ISO"
                    :http-request="tableSuccessUpload"
                    :auto-upload="false"
                    :limit="1"
                    :on-exceed="handleExceed"
                    name="fileName"
                     v-loading="bookLoading">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传ISO文件</div>
                </el-upload>
                <span  slot="footer" class="upload_btn_wrap dialog-footer" >
                    <el-button  round type="primary" @click="marcPreviewUpload" :loading="bookLoading" size="small">点击上传</el-button>
                    <el-button @click="previewMarcImportVisible = false" round size="small">取 消</el-button>
                </span>
            </el-dialog>
            <!-- excel导入预览框 -->
            <el-dialog :visible.sync="previewExcelImportVisible" title="excel导入预览" :width="'400px'" >
                    <el-upload
                        class="upload-demo"
                        drag
                        ref="excelPreview"
                        action="/apiCatalog/v1/catalogue/importBook"
                        accept=".xls"
                        :limit="1"
                        :http-request="tableSuccessUpload"
                        :auto-upload="false"
                        :on-exceed="handleExceed"
                        name="fileName"
                        v-loading="bookLoading"
                        >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传xls文件</div>
                    </el-upload>
                    <span  slot="footer" class="upload_btn_wrap dialog-footer">
                        <el-button  round type="primary" @click="excelPreviewUpload" size="small" :loading="bookLoading">点击上传</el-button>
                        <el-button @click="previewExcelImportVisible = false" round size="small">取 消</el-button>
                    </span>
            </el-dialog>
        </div>
</template>

<script>
import {importBook, importPrebook, importBookMarc, importPrebookMarc, previewMarc, previewExcel } from '@/request/catalog';
export default {
    data() {
      return {
         dialogImportVisible: false,
         marcImportVisible: false,
         previewMarcImportVisible: false,
         previewExcelImportVisible: false,
         previewTypeName: '',
         importForm: {
             sjtype: 'marc',
             daor: '1'
         },
         tip:'',
         tableData: [],
         bookLoading: false,
         BookMarcLoading: false,
      };
    },
     methods: {
        //导入数据
        importReaderData(){
            if(this.importForm.sjtype == 'marc') {
                this.marcImportVisible = true;
                this.$nextTick(function(){
                    this.$refs.marcUpload.clearFiles();
                })
            }else {
                this.dialogImportVisible=true;
                this.$refs.upload.clearFiles();
            }
        },
        importPreview() {
            if(this.importForm.sjtype == 'marc') {
                this.previewMarcImportVisible = true;
                this.$nextTick(function(){
                this.$refs.marcPreview.clearFiles();
                })
            }else {
                this.previewExcelImportVisible = true;
                 this.$nextTick(function(){
                    this.$refs.excelPreview.clearFiles();
                })          
            }
        },
        //导入实际数据库
        tableDataSuccessUpload(response) {
            let formData = new FormData();
            formData.append('fileName', response.file);
            if( this.importForm.sjtype == 'execl') {
                if( this.importForm.daor == '2') {
                    this.bookLoading = true;
                    importBook(formData).then(data => {
                        
                        if(data.data.code ==0) {
                            response.onSuccess();
                            this.$message({
                                type: 'success',
                                message: '导入中央库excel成功!',
                                duration:1000
                            });
                            this.dialogImportVisible=false;
                            this.bookLoading = false;
                        }else {
                            this.$message({
                                type: 'error',
                                message: data.data.msg,
                                duration:1000
                            });
                            this.bookLoading = false;
                        }
                    })
                }else {
                    this.bookLoading = true;
                    importPrebook(formData).then(data => {               
                        if(data.data.code ==0) {
                            this.bookLoading = false;
                            response.onSuccess();
                            this.$message({
                                type: 'success',
                                message: '导入采访库excel成功!',
                                duration:1000
                            });
                            this.dialogImportVisible=false;
                        }else {
                            this.$message({
                                type: 'error',
                                message: data.data.msg,
                                duration:1000
                            });
                            this.bookLoading = false;
                        }
                    })
                }
            }else {
                if( this.importForm.daor == '1') {
                    this.BookMarcLoading = true;
                    importPrebookMarc(formData).then(data => {         
                        if(data.data.code ==0) {                       
                            response.onSuccess();
                            this.$message({
                                type: 'success',
                                message: '导入中央库marc成功!',
                                duration:1000
                            });
                            this.marcImportVisible=false;
                            this.BookMarcLoading = true;
                        }else {
                            this.$message({
                                type: 'error',
                                message: data.data.msg,
                                duration:1000
                            });
                             this.BookMarcLoading = false;
                        }
                    })
                }else {
                    this.BookMarcLoading = true;
                     importBookMarc(formData).then(data => {             
                        if(data.data.code ==0) {
                            response.onSuccess();
                            this.$message({
                                type: 'success',
                                message: '导入中央库marc成功!',
                                duration:1000
                            });
                            this.marcImportVisible=false;
                            this.BookMarcLoading = false;
                        }else {
                            this.$message({
                                type: 'error',
                                message: data.data.msg,
                                duration:1000
                            });
                             this.BookMarcLoading = false;
                        }
                    })
                }
            }
        },
        // 导入预览
        tableSuccessUpload(response) {
            let formData = new FormData();
            formData.append('fileName', response.file);
            if(this.importForm.sjtype == 'marc') {
                this.bookLoading = true;
                previewMarc(formData).then(data => {       
                    if(data.data.code == 0) {
                        this.$message({
                            type: 'success',
                            message: '导入模拟列表成功!请查看',
                            duration:1000
                        });
                        this.tip = '导入预览（MARC数据），仅展示前10条'
                        this.tableData = data.data.bookList
                        this.previewMarcImportVisible = false;
                        this.bookLoading = false;
                    }else {
                        this.$message({
                            type: 'error',
                            message: data.data.msg,
                            duration:1000
                        });
                        this.bookLoading = false;
                    }
                })
            }else {
                this.bookLoading = true;
                previewExcel(formData).then(data =>{   
                    if(data.data.code == 0) {
                        this.$message({
                            type: 'success',
                            message: '导入模拟列表成功!请查看',
                            duration:1000
                        });
                         this.tip= "导入模板（excel数据），仅展示前10条";
                        this.tableData = data.data.bookList;
                        this.previewExcelImportVisible = false;
                        this.bookLoading = false;
                    }else {
                        this.$message({
                            type: 'error',
                            message: data.data.msg,
                            duration:1000
                        });
                        this.bookLoading = false;
                    }
                })
            }
        },
        //  限制上传个数的回调方法 
        handleExceed() {
            this.$message.warning(`最多只能导入1个文件`);
        },
        upload() {
             this.$refs.upload.submit();
        },
        marcUpload() {
             this.$refs.marcUpload.submit();
        },
        marcPreviewUpload() {
            this.$refs.marcPreview.submit();
        },
        excelPreviewUpload() {
            this.$refs.excelPreview.submit();
        }
    }
  };
</script>

<style>
    .box-card{margin-top: 50px;}
    #bibliographyImport .el-dialog__footer{
        text-align: center
    }
    .tip{
        font-size: 24px;
        color: rgb(63, 172, 185);
        line-height: 40px
    }
</style>
