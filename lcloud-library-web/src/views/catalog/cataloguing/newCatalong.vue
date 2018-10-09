<template>
  <div id="catalong" @keyup.alt.83="sure()" @keyup.alt.69="addNew()" @keyup.alt.67="copyData"  tabindex="12">
    <!--<span :class="{click: easyCatalong,red:red}"  @click="easyCatalong=true">简易编目</span>-->
    <!--<span :class="{click: !easyCatalong,red:red}" type="success" @click="easyCatalong=false">MARC编目</span>-->
    <el-form :inline="true" :model="searchFrom" class="demo-form-inline" >
      <el-form-item >
        <el-input ref="inputFocus" v-model="searchFrom.searchValue" clearable  size="medium" style="width:300px" v-on:keyup.enter.native="search">
          <el-select v-model="searchFrom.searchKey" slot="prepend" :style="{width:'120px'}">
            <el-option label="ISBN" value="isbn"></el-option>
            <el-option label="书目记录号" value="id"></el-option>
            <el-option label="正题名" value="title"></el-option>
            <el-option label="作者" value="author"></el-option>
            <el-option label="分类号" value="bookType"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item label="其他书库：">
        <!--<el-radio label="1" v-model="source">新华集团</el-radio>-->
        <!--<el-radio label="2" v-model="source">Z39.50服务端</el-radio>-->
        <!--<el-radio label="3" v-model="source">豆瓣图书</el-radio>-->
        <!--<el-radio label="4" v-model="source">平台数据中心</el-radio>-->

        <el-checkbox-group v-model="source2" @change="changPages">
          <!--<el-checkbox label="0">本馆中央库</el-checkbox>-->
          <el-checkbox label="1">本馆采访库</el-checkbox>
          <el-checkbox label="2">新华书库</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="单个库显示记录数：" v-if="!pageYes">
        <el-select v-model="pageSize" :style="{width:'120px'}" :disabled="pageYes">
          <el-option label="1条" :value="pageTotal[0]"></el-option>
          <el-option label="3条" :value="pageTotal[1]"></el-option>
          <el-option label="5条" :value="pageTotal[2]"></el-option>
          <el-option label="10条" :value="pageTotal[3]"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button  type="primary"  @click="search()" round size="medium">查询</el-button>
        <el-tooltip content="使用快捷键Alt+s或者Alt+S即可进行保存" placement="top">
           <el-button  type="success"   round size="medium"  @click="sure()" >保存(s)</el-button>
        </el-tooltip>
        <el-tooltip content="使用快捷键Alt+e或者Alt+E即可进行清空" placement="top">
           <el-button  type="danger"  @click="addNew()" round size="medium">清空(e)</el-button>
        </el-tooltip>
        <el-tooltip content="使用快捷键Alt+c或者Alt+C即可进行复制" placement="top">
            <el-button  type="info"  @click="copyData" round size="medium" >复制(c)</el-button>
         </el-tooltip>
        <el-button  type="warning"  @click="defaultSetting"  round size="medium" >默认参数设置</el-button>
      </el-form-item>
      <br>
    </el-form>
    <el-card class="box-card"  v-loading="loading2"
             element-loading-text="保存中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)">
      <div id="detail" >
        <div v-show="easyCatalong">
          <el-row>
            <el-col :span="5">
              <div class="one">
                <el-upload
                  class="reader-avatar-uploader"
                  action="/roleUser/user/v1/upload/pic"
                  :show-file-list="false"
                  :http-request="successUpload">
                                 <span class="reader-avatar_wrap">
                                   <img v-if="pic" :src="pic" class="avatar">
                                   <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                 </span>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
                <el-form :label-position="labelPosition" label-width="80px" :model="form" size="mini" style="margin-top:22px">
                  <el-form-item label="版次">
                    <el-select v-model="revision"  placeholder="请选择" >
                      <el-option label="第一版" value="0"></el-option>
                      <el-option label="第二版" value="1"></el-option>
                      <el-option label="第三版" value="2"></el-option>
                      <el-option label="第四版" value="3"></el-option>
                      <el-option label="修订版" value="4"></el-option>
                      <el-option label="增订版" value="5"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="语种">
                    <el-select v-model="language"  placeholder="请选择" >
                      <el-option label="汉语" value="0"></el-option>
                      <el-option label="英语" value="1"></el-option>
                      <el-option label="世界语" value="2"></el-option>
                      <el-option label="法语" value="3"></el-option>
                      <el-option label="德语" value="4"></el-option>
                      <el-option label="日语" value="5"></el-option>
                      <el-option label="拉丁语" value="6"></el-option>
                      <el-option label="俄语" value="7"></el-option>
                      <el-option label="藏语" value="8"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="币种">
                    <el-select v-model="currency"  placeholder="请选择" >
                      <el-option label="人民币|RMB" value="0"></el-option>
                      <el-option label="美元|USD" value="1"></el-option>
                      <el-option label="日元|JPY" value="2"></el-option>
                      <el-option label="欧元|EUR" value="3"></el-option>
                      <el-option label="港币|HKD" value="4"></el-option>
                      <el-option label="韩国元|KRW" value="5"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="开本">
                    <el-select v-model="bookSize"  placeholder="请选择">
                      <el-option label="16开" value="0"></el-option>
                      <el-option label="32开" value="1"></el-option>
                      <el-option label="46开" value="2"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="载体类型">
                    <el-select v-model="carrierType"  placeholder="请选择" >
                      <el-option :label="item.label" :value="item.id.toString()" v-for="item in carrierList" :key="item.id"></el-option>
                    </el-select>
                  </el-form-item>


                </el-form>
              </div>
            </el-col>
            <el-col :span="10" >
              <div class="two">
                <el-form :label-position="labelPosition" label-width="100px" :model="form" size="mini">
                  <el-form-item label="书目记录号" >
                    <el-input v-model="bookId" :disabled="true"></el-input>
                  </el-form-item>
                  <el-form-item label="正题名" class="is-required" >
                    <el-input v-model="form.book.title" ref="input1" @keyup.enter.native="handleEnter(2)"> </el-input>
                  </el-form-item>
                  <el-form-item label="第一责任人" class="is-required" >
                    <el-input v-model="form.book.firstDuty" ref="input3" @keyup.enter.native="handleEnter(4)"></el-input>
                  </el-form-item>
                  <el-form-item label="并列题名">
                    <el-input v-model="form.book.parallelTitle" ref="input5" @keyup.enter.native="handleEnter(6)"></el-input>
                  </el-form-item>
                  <el-form-item label="从题名">
                    <el-input v-model="form.book.seriesTitle" ref="input7" @keyup.enter.native="handleEnter(8)"></el-input>
                  </el-form-item>
                  <el-form-item label="出版社">
                    <el-input v-model="form.book.publisher" ref="input9" @keyup.enter.native="handleEnter(10)"></el-input>
                  </el-form-item>
                  <el-form-item label="页数">
                    <el-input v-model="form.book.pages" ref="input11" @keyup.enter.native="handleEnter(12)" @keyup.native="justNumber2('pages')" @afterpaste.native="justNumber2('pages')"></el-input>
                  </el-form-item>
                  <el-form-item label="分类号" class="is-required">
                    <el-tooltip content="输入分类号按下回车键来生成索取号" placement="top">
                      <el-input v-model="form.book.bookType" ref="input13"  v-on:keyup.enter.native="getCallno" placeholder="输入分类号按下回车键来生成索取号"></el-input>
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item label="主题词">
                    <el-input v-model="form.book.subjectWord" ref="input15" @keyup.enter.native="handleEnter(16)"></el-input>
                  </el-form-item>
                  <el-form-item label="装帧类型">
                    <el-select v-model="binding"  placeholder="请选择" >
                      <el-option :label="item.label" :value="item.id.toString()" v-for="item in bindingList" :key="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
            <el-col :span="9">
              <div class="three">
                <el-form :label-position="labelPosition" label-width="100px" :model="form" size="mini">
                  <el-form-item label="ISBN" prop="book.isbn" class="is-required" >
                    <el-tooltip content="点击回车键可获取出版社等信息" placement="top">
                    <el-input v-model="form.book.isbn" ref="input0" v-on:keyup.enter.native="isbnSearch"  @keyup.native="justNumber5('isbn')" @afterpaste.native="justNumber5('isbn')"></el-input>
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item label="分册号" prop="divisionNumber">
                    <el-input v-model="form.book.divisionNumber" ref="input2" @keyup.enter.native="handleEnter(3)"></el-input>
                  </el-form-item>
                  <el-form-item label="分辑名" prop="divisionName">
                    <el-input v-model="form.book.divisionName" ref="input4" @keyup.enter.native="handleEnter(5)"></el-input>
                  </el-form-item>
                  <el-form-item label="其他责任人" prop="otherDuty"  >
                    <el-input v-model="form.book.otherDuty" ref="input6" @keyup.enter.native="handleEnter(7)"></el-input>
                  </el-form-item>
                  <el-form-item label="副题名">
                    <el-input v-model="form.book.secondTitle" ref="input8" @keyup.enter.native="handleEnter(9)"></el-input>
                  </el-form-item>
                  <el-form-item label="出版地">
                    <el-input v-model="form.book.pubArea" ref="input10" @keyup.enter.native="handleEnter(11)"></el-input>
                  </el-form-item>
                  <el-form-item label="出版日期">
                    <el-tooltip content="出版日期格式为“年-月”，比如2018-09" placement="top">
                      <el-input  ref="input12"  v-model="form.book.pubdate" @keyup.enter.native="handleEnter(13)"  clearable @keyup.native="justNumber4('pubdate')" @afterpaste.native="justNumber4('pubdate')"></el-input>
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item label="索取号" prop="callNo" class="is-required" >
                    <el-input v-model="callNo" ref="input14" @keyup.enter.native="handleEnter(15)"></el-input>
                  </el-form-item>
                  <el-form-item label="价格" class="is-required" >
                    <el-input v-model="form.book.price" ref="input16" @keyup.enter.native="handleEnter(17)" @keyup.native="justNumber3('price')" @afterpaste.native="justNumber3('price')"></el-input>
                  </el-form-item>

                  <el-form-item label="复本数" prop="recount">
                    <el-tooltip content="输入复本书按下回车键来添加条码，只能输入正整数" placement="top">
                      <el-input  ref="input17"  @keyup.native="justNumber('recount')" @afterpaste.native="justNumber('recount')"  v-model.number="form.recount" v-on:keyup.enter.native="addData" placeholder="输入复本书按下回车键来添加条码,只能输入正整数"></el-input>
                    </el-tooltip>
                  </el-form-item>

                  <!--<el-form-item label="编目者">-->
                    <!--<el-input v-model="user.userName" :disabled="true"></el-input>-->
                  <!--</el-form-item>-->
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
        </div>
        <!-- MARC编目 -->
        <div v-if="!easyCatalong">
          <el-form :inline="true" :model="searchForm2" class="demo-form-inline" size="medium">
            <el-form-item label="书目记录号">
              <el-input  v-model="searchForm2.value" class="input-with-select" readonly :style="{width:'120px'}"></el-input>
            </el-form-item>
            <el-form-item >
              <el-select v-model="searchForm2.online" default-first-option="" :style="{width:'120px'}">
                <el-option label="CNMARC模板1" value="CNMARC模板1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" >添加字段</el-button>
              <el-button type="danger" >批量删除</el-button>
              <el-button type="warning" >删除所有字段</el-button>
            </el-form-item>
          </el-form>
          <el-table ref="multipleTable" :data="marcData" tooltip-effect="dark" style="width: 100%" v-loading='loading' @selection-change="selectChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" width="55" label="序号"></el-table-column>
            <el-table-column prop="description" label="字段意义"></el-table-column>
            <el-table-column prop="name" label="字段名称"></el-table-column>
            <el-table-column prop="designator" label="指示符"></el-table-column>
            <el-table-column prop="fieldValue" label="字段值"></el-table-column>
            <el-table-column  label="操作" >
              <template slot-scope="scope">
                <el-button type="text" size="mini" style="color: rgb(245, 108, 108);"  @click="deleteData(scope.row)" >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-form :inline="true" :model="addForm" size="mini" >
          <el-form-item label="馆藏地点">
            <el-select v-model="addForm.colladdressId"  placeholder="请选择" style="width:120px" >
              <el-option :label="item.label" :value="item.id.toString()" v-for="item in collAddressList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="条码分区">
            <el-select v-model="addForm.partition"  placeholder="请选择" style="width:120px" >
              <el-option :label="item.barcodeName" :value="item.id.toString()" v-for="item in partitionList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="流通类型">
            <el-select v-model="addForm.actType"  placeholder="请选择" style="width:120px">
              <el-option :label="item.label" :value="item.id.toString()" v-for="item in circulationList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文献来源">
            <el-select v-model="addForm.source"  placeholder="请选择">
              <el-option :label="item.label" :value="item.id.toString()" v-for="item in literatureList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="批次号">
            <el-input v-model="addForm.catalogBatch"  placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item >
            <el-button  type="primary"  @click="addData('one')" round size="mini">增加一行</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="form.holdingList" border  size="mini"  height="180px">
          <el-table-column   label="删除" width="80px">
            <template slot-scope="scope">
                <el-button type="text" @click="deleteTable(scope.$index)" style="color:red" >删除</el-button>
            </template>
          </el-table-column>
          <el-table-column  prop="barcode"  label="图书条码" width="180px" >
            <template slot-scope="scope">
              <el-form>
                <el-form-item size="mini" class="el-form-item1">
                  <el-input type="text" style="padding: 0" v-model="form.holdingList[scope.$index].barcode"></el-input>
                </el-form-item>
              </el-form>
            </template></el-table-column>
          <el-table-column  prop="indate"  label="上架日期" width="150px">
            <template slot-scope="scope">
              <el-form>
                <el-form-item size="mini" class="el-form-item1">
                  <el-date-picker type="date" v-model="form.holdingList[scope.$index].indate" style="padding-right: 0;width: 130px"></el-date-picker>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column  prop="collection"  label="馆藏地点" >
            <template slot-scope="scope">
              <el-form>
                <el-form-item size="mini" class="el-form-item1">
                  <el-select v-model="form.holdingList[scope.$index].colladdressId"  placeholder="请选择">
                    <el-option :label="item.label" :value="item.id.toString()" v-for="item in collAddressList" :key="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column  prop="state"  label="馆藏状态">
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
          <el-table-column  prop="state"  label="流通类型" >
            <template slot-scope="scope">
              <el-form>
                <el-form-item size="mini" class="el-form-item1">
                  <el-select v-model="form.holdingList[scope.$index].actType"  placeholder="请选择" >
                    <el-option :label="item.label" :value="item.id.toString()" v-for="item in circulationList" :key="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column  prop="state"  label="文献来源" >
            <template slot-scope="scope">
              <el-form>
                <el-form-item size="mini" class="el-form-item1">
                  <el-select v-model="form.holdingList[scope.$index].source"  placeholder="请选择" >
                    <el-option :label="item.label" :value="item.id.toString()" v-for="item in literatureList" :key="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column  prop="batch"  label="批次" >
            <template slot-scope="scope">
              <el-form>
                <el-form-item size="mini" class="el-form-item1">
                  <el-input type="text" v-model="form.holdingList[scope.$index].catalogBatch"></el-input>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column    label="备注" >
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
    <el-dialog
      title=""
      :visible.sync="visible" width="70%" id="result">
      <div class="external">
        <el-tabs v-model="activeName2" @tab-click="handleClick">
          <el-tab-pane label="查询结果" name="first">
            <el-table
              :data="tableData" border  style="width: 100%;margin-top:20px" max-height="500"  v-loading='loading'  @row-dblclick="coverData" :cell-style="{cursor:'pointer'}">
              <el-table-column fixed label="序号" type="index" width="50" >
                <template slot-scope="scope">
                  <!--{{scope.$index+1 }}-->
                  <div class="tableColor" style=" color: #606266" v-if="scope.row.source==0"><div>{{scope.$index+1}}</div></div>
                  <div class="tableColor" style="background:#ccc ;" v-if="scope.row.source==1"><div >{{scope.$index+1}}</div></div>
                  <div class="tableColor" style="background:#666 ;" v-if="scope.row.source==2"><div >{{scope.$index+1}}</div></div>
                </template>
              </el-table-column>
              <el-table-column  prop="source"  label="所在库">
                <template slot-scope="scope">
                  <span v-if="scope.row.source==0">本馆中央库</span>
                  <span v-if="scope.row.source==1">本馆采访库</span>
                  <span v-if="scope.row.source==2">新华书库</span>
                  <!--<span v-if="scope.row.source==2">Z39.50服务端</span>-->
                  <!--<span v-if="scope.row.source==3">豆瓣图书</span>-->
                  <!--<span v-if="scope.row.source==4">平台数据中心</span>-->
                </template>
              </el-table-column>
              <!--<el-table-column label="" prop=""></el-table-column>-->
              <el-table-column  prop="title"  label="图书名称">  </el-table-column>
              <el-table-column  prop="isbn"  label="ISBN">  </el-table-column>
              <el-table-column  prop="bookType" label="分类号">  </el-table-column>
              <el-table-column  prop="firstDuty"  label="作者">  </el-table-column>
              <el-table-column  prop="publisher"  label="出版社">  </el-table-column>
              <el-table-column  prop="pubdate"  label="出版时间">
                <template slot-scope="scope">
                   <span>{{scope.row.pubdate}}</span>
                </template>
              </el-table-column>

              <el-table-column  prop="source"  label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="add(scope.row)">查看</el-button>
                  <el-button type="text" style="color:red" @click="coverData(scope.row)">选择</el-button>
                </template>
              </el-table-column>
            </el-table>
             <!--分页-->
            <el-row v-if="total">
            <el-col :span="24">
            <el-pagination
            :page-sizes="[3, 5, 10, 20]"
            :page-size="form0.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tablePage.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="tablePage.pageNum"
            >
            </el-pagination>
            </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="书目详情" name="second">
            <el-row>
              <el-col :span="8">
                <div class="one">
                  <div >
                    <img :src="bookForm.pic" class="bookFormPic">
                  </div>
                  <el-form :label-position="labelPosition" readonly label-width="80px" :model="bookForm" size="mini">
                    <el-form-item label="版次">
                      <el-select v-model="bookForm.revision"  placeholder="请选择" :disabled="true">
                        <el-option label="第一版" value="0"></el-option>
                        <el-option label="第二版" value="1">0</el-option>
                        <el-option label="第三版" value="2"></el-option>
                        <el-option label="第四版" value="3"></el-option>
                        <el-option label="修订版" value="4"></el-option>
                        <el-option label="增订版" value="5"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="语种">
                      <el-select v-model="bookForm.language"  placeholder="请选择" :disabled="true">
                        <el-option label="汉语" value="0"></el-option>
                        <el-option label="英语" value="1"></el-option>
                        <el-option label="世界语" value="2"></el-option>
                        <el-option label="法语" value="3"></el-option>
                        <el-option label="德语" value="4"></el-option>
                        <el-option label="日语" value="5"></el-option>
                        <el-option label="拉丁语" value="6"></el-option>
                        <el-option label="俄语" value="7"></el-option>
                        <el-option label="藏语" value="8"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="币种">
                      <el-select v-model="bookForm.currency"  placeholder="请选择" :disabled="true">
                        <el-option label="人民币|RMB" value="0"></el-option>
                        <el-option label="美元|USD" value="1"></el-option>
                        <el-option label="日元|JPY" value="2"></el-option>
                        <el-option label="欧元|EUR" value="3"></el-option>
                        <el-option label="港币|HKD" value="4"></el-option>
                        <el-option label="韩国元|KRW" value="5"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="开本">
                      <el-select v-model="bookForm.bookSize"  placeholder="请选择" :disabled="true">
                        <el-option label="16开" value="0"></el-option>
                        <el-option label="32开" value="1"></el-option>
                        <el-option label="46开" value="2"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="载体类型">
                      <el-select v-model="bookForm.carrierType"  placeholder="请选择" :disabled="true">
                        <el-option :label="item.label" :value="item.id.toString()" v-for="item in carrierList" :key="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="装帧类型">
                      <el-select v-model="bookForm.binding"  placeholder="请选择" :disabled="true">
                        <el-option :label="item.label" :value="item.id.toString()" v-for="item in bindingList" :key="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-form>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="two">
                  <el-form :label-position="labelPosition" label-width="90px" :model="bookForm" size="mini">
                    <el-form-item label="书目记录号">
                      <el-input v-model="bookForm.id" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="正题名">
                      <el-input v-model="bookForm.title" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="第一负责人">
                      <el-input v-model="bookForm.firstDuty" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="并列题名">
                      <el-input v-model="bookForm.parallelTitle" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="从题名">
                      <el-input v-model="bookForm.seriesTitle" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="出版地">
                      <el-input v-model="bookForm.pubArea" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="页数">
                      <el-input v-model="bookForm.pages" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="分类号">
                      <el-input v-model="bookForm.bookType" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="主题词">
                      <el-input v-model="bookForm.subjectWord" readonly></el-input>
                    </el-form-item>
                  </el-form>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="three">
                  <el-form :label-position="labelPosition" label-width="90px" :model="form" size="mini">
                    <el-form-item label="ISBN"  >
                      <el-input v-model="bookForm.isbn" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="分册号">
                      <el-input v-model="bookForm.divisionNumber" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="其他责任人">
                      <el-input v-model="bookForm.otherDuty" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="副题名">
                      <el-input v-model="bookForm.secondTitle" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="出版社">
                      <el-input v-model="bookForm.publisher" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="出版日期">
                      <el-input v-model="bookForm.pubdate" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="价格">
                      <el-input v-model="bookForm.price" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="索取号">
                      <el-input v-model="bookForm.callNo" readonly></el-input>
                    </el-form-item>
                    <!--<el-form-item label="复本数">-->
                      <!--<el-input v-model="bookForm.recount" v-on:keyup.enter.native="addData" readonly></el-input>-->
                    <!--</el-form-item>-->


                    <el-form-item label="编目者">
                      <el-input v-model="user.userName" readonly></el-input>
                    </el-form-item>
                  </el-form>
                </div>
              </el-col>
            </el-row>
            <el-input style="margin-bottom:20px"
                      type="textarea"
                      :rows="3"
                      placeholder="摘要"
                      v-model="bookForm.summary"
                      readonly>
            </el-input>
            <div style="text-align: center">
              <el-button type="primary" @click="coverData(detailRow)">选择</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
    <!--默认参数设置-->
    <el-dialog title="默认参数设置" :visible.sync="dialogTableVisible" id="defaultSet" width="700px">
      <el-form ref="formA" :model="formA" status-icon label-width="120px" >
        <el-form-item label="馆藏地点">
          <el-select v-model="formA['collAddressId']"  placeholder="请选择"  >
            <el-option :label="item.label" :value="item.id.toString()" v-for="item in collAddressList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="条码分区">
          <el-select v-model="formA['barcodeId']"  placeholder="请选择" style="width:200px;display: inline-block" @change="getBarcode">
            <el-option :label="item.barcodeName" :value="item.id.toString()" v-for="item in partitionList" :key="item.id"></el-option>
          </el-select>
          条码前缀：<span style="color: red;margin-right: 15px">{{barcodePrefix}}</span>
          条码总位数：<span style="color: red">{{totalBit}}</span>
        </el-form-item>
        <el-form-item label="流通类型">
          <el-select v-model="formA['circulationId']"  placeholder="请选择">
            <el-option :label="item.label" :value="item.id.toString()" v-for="item in circulationList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版次">
          <el-select v-model="formA['revisionId']"  placeholder="请选择" >
            <el-option label="第一版" value="0"></el-option>
            <el-option label="第二版" value="1"></el-option>
            <el-option label="第三版" value="2"></el-option>
            <el-option label="第四版" value="3"></el-option>
            <el-option label="修订版" value="4"></el-option>
            <el-option label="增订版" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="语种">
          <el-select v-model="formA['languageId']"  placeholder="请选择" >
            <el-option label="汉语" value="0"></el-option>
            <el-option label="英语" value="1"></el-option>
            <el-option label="世界语" value="2"></el-option>
            <el-option label="法语" value="3"></el-option>
            <el-option label="德语" value="4"></el-option>
            <el-option label="日语" value="5"></el-option>
            <el-option label="拉丁语" value="6"></el-option>
            <el-option label="俄语" value="7"></el-option>
            <el-option label="藏语" value="8"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="币种">
          <el-select v-model="formA['currencyId']"  placeholder="请选择" >
            <el-option label="人民币|RMB" value="0"></el-option>
            <el-option label="美元|USD" value="1"></el-option>
            <el-option label="日元|JPY" value="2"></el-option>
            <el-option label="欧元|EUR" value="3"></el-option>
            <el-option label="港币|HKD" value="4"></el-option>
            <el-option label="韩国元|KRW" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开本">
          <el-select v-model="formA['bookSize']"  placeholder="请选择">
            <el-option label="16开" value="0"></el-option>
            <el-option label="32开" value="1"></el-option>
            <el-option label="46开" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="载体类型">
          <el-select v-model="formA['carrierType']"  placeholder="请选择" >
            <el-option :label="item.label" :value="item.id.toString()" v-for="item in carrierList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="装帧类型">
          <el-select v-model="formA['bindingId']"  placeholder="请选择" >
            <el-option :label="item.label" :value="item.id.toString()" v-for="item in bindingList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文献来源">
          <el-select v-model="formA['literatureId']"  placeholder="请选择">
            <el-option :label="item.label" :value="item.id.toString()" v-for="item in literatureList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="批次号">
          <el-input v-model="formA.catalogBatch"  placeholder="请输入" clearable style="width: 90%"></el-input>
        </el-form-item>
        <el-form-item label="使用者">
          <el-input v-model="user.loginName" disabled style="width: 90%"></el-input>
        </el-form-item>
        <div id="sure">
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button @click="cancelDefault">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import { mapGetters } from "vuex";
  import moment from "moment";
  import {catalogDetail,catalogSave,getmaxbarcode,foreignbooklist,foreignbookinfo,catalogList,downloadbook,downloadprebook,catalogDelete,defaultparam,defaultparamSave} from '@/request/catalog'
  import {collAddressList,partitionList2,collStateList2,circulationList,literatureSource,readerImportPic,classNumber,isbnSearch,defendListSave,bindingList,carrierList} from '@/request/systemSetup'
  import Template from "../../interviewManage/order/template";
  export default {
    components: {Template},
    computed: {
      ...mapGetters(["user"])
    },
    data() {
      return {
        loading: false,
        visible:false,
        picker: [],
        searchFrom: {
          searchValue: '',
          searchKey: 'isbn',
          page:"1",
        },
        form0: {
          type:'1',
          pageSize: 5,
          pageNum: 1
        },
        tablePage: {},
        tableData: [],
        activeName2:"first",
        labelPosition: "right",
        dialogImageUrl: "",
        dialogVisible: false,
        form: {
          book:{
            revision:"0",
            language: "0",
            bookSize : "0",
            carrierType :"0",
            binding: "0"
          },
          holdingList:[]
        },
        data1:[],
        form1:{
          isbn:"",
          pageNum: 1,
          pageSize: 5,
          source:""
        },
        searchBookFrom:{
          searchKey:  'isbn',

        },
        addForm:{},
        collAddressList:[],
        partitionList:[],
        circulationList:[],
        literatureList:[],
        out:true,
        source:"",
        bookForm:{},
        source2:["0"],
        easyCatalong:true,
        red:true,
        searchForm2:{},
        marcData:[{}],
        loading2:false,
        collStateList:[],
        addObj:[],
        newData:[],
        pic:"",
        dialogTableVisible:false,
        formA:{},
        formB:{
          barcodeId:"",
          bindingId:"",
          bookSize:"",
          carrierType:"",
          catalogBatch:"",
          circulationId:"",
          collAddressId:"",
          createBy:"",
          createTime:"",
          currUser:"",
          currencyId:"",
          id:"",
          languageId:"",
          libraryId:"",
          literatureId:"",
          revisionId:""
        },
        totalBit:0,
        total:false,
        barcodePrefix:"",
        detailObj:{},
        defendListSaveForm:{},
        pageYes:true,
        pageTotal:[1,3,5,10],
        pageSize:5,
        callNo:"",
        barcodeId:"",
        loading2:false,
        bookId:"",
        altKey:false,
        detailRow:"",
        carrierList:""  ,
        bindingList:"",
        revision:"",
        language:"",
        currency:"",
        bookSize:"",
        carrierType:"",
        binding:""
      };
    },
    created() {

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
      collStateList2().then(data=>{
        if(data.data.code==0){
          this.collStateList=data.data.dic;
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
      // 获取文献来源
      literatureSource().then(data=>{
        if(data.data.code==0){
          this.literatureList=data.data.page.list;
        }else{
          this.$message({
            type: 'error',
            message:"文献来源数据获取失败！失败原因："+data.data.msg,
            duration:'2000'
          });
        }
      }).catch(err=>{
        this.$message({
          type: 'info',
          message: '文献来源数据获取失败，失败原因：'+err.data.msg
        });
      })
      // 条码分区参数
      partitionList2().then(data=>{
        if(data.data.code==0){
          this.partitionList=data.data.page.list;
          // 默认参数
          this.defaultparamSet()
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
      // 装帧类型
      bindingList().then(data=>{
        if(data.data.code==0){
          this.bindingList=data.data.page.list;
        }else{
          this.$message({
            type: 'error',
            message:"装帧类型数据获取失败！失败原因："+data.data.msg,
            duration:'2000'
          });
        }
      }).catch(err=>{
        this.$message({
          type: 'info',
          message: '装帧类型数据获取失败，失败原因：'+err.data.msg
        });
      })
      // 载体类型
      carrierList().then(data=>{
        if(data.data.code==0){
          this.carrierList=data.data.page.list;
        }else{
          this.$message({
            type: 'error',
            message:"载体类型数据获取失败！失败原因："+data.data.msg,
            duration:'2000'
          });
        }
      }).catch(err=>{
        this.$message({
          type: 'info',
          message: '载体类型数据获取失败，失败原因：'+err.data.msg
        });
      })
    },
    methods: {
      handleEnter (index) {
        this.$refs["input"+index].focus()
      } ,
  //上次成功事件和图片上传
      successUpload(response){
        let formData = new FormData()
        formData.append('file', response.file)
        readerImportPic(formData).then(res=>{
          if(res.data.code==0){
            this.pic =res.data.url;
            // console.log(this.form.book.pic)
            this.$message({
              type: 'success',
              message: '上传成功!'
            });
          }else{
            this.$message({
              type: 'error',
              message: res.data.msg
            });
          }
        })
      },
      search(search) {
        // if(this.searchFrom.searchValue==""){
        //   this.$message({
        //     type: 'error',
        //     message:"请输入查询值！",
        //     duration:'2000'
        //   });
        //   return
        // }
        // if(this.source2.length==0){
        //   this.$message({
        //     type: 'error',
        //     message:"请先选择查询范围！",
        //     duration:'2000'
        //   });
        //   return
        // }
        let obj=this.form0;
        this.activeName2="first";
        if(search=="search"){
          this.form0={
            pageSize: 5,
            pageNum:1,
            type:this.source2.join(",")
          }
        }else{
          this.form0= {
            pageSize: obj.pageSize,
            pageNum:1,
            type:this.source2.join(",")
          };
        }
        if(this.source2.length==1){
          this.total=true;
        }else {
          this.total=false;
        }
        //去掉空格
        this.searchFrom.searchValue=this.searchFrom.searchValue.replace(/(^\s*)|(\s*$)/g, "");
        Object.assign(this.form0, this.searchFrom);
        this.getAcceptancedetailList(JSON.stringify(this.form0));
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
        this.form0.pageNum=1;
        this.getAcceptancedetailList(JSON.stringify(this.form0));
      },
      handleCurrentChange(val) {
        this.form0.pageNum = val;
        this.getAcceptancedetailList(JSON.stringify(this.form0));
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
      addNew(){
        this.form={
          book:{
            revision:"0",
            language: "0",
            bookSize : "0",
            carrierType :"0",
            binding: "0"
          },
          holdingList:[]
        };
        this.bookId="";
        this.callNo="";
        this.pic="";
        this.defaultparamSet()
      },
      add(row, event, column){
        this.detailRow=row;
        console.log(row)
        this.activeName2='second';
        let obj={bookId:row.id,isbn:row.isbn,"source":row.source};
        this.detailObj=obj;
        this.bookForm.pic="";
        catalogDetail(obj).then(data=>{
          if(data.data.code==0){
            // 如果详情不为空
           if(data.data.CatalogVO!=null){

             // 如果详情的book为空
             if(data.data.CatalogVO.book==null){

               this.bookForm=row
             }else {
               // 如果详情的book有数据
               for(let item in data.data.CatalogVO.book){
                 if(data.data.CatalogVO.book[item]!=""){
                   this.$set(this.bookForm,item,data.data.CatalogVO.book[item])
                 }else{
                   this.$set(this.bookForm,item,row[item])
                 }
               }
               // 去掉空格
               if(this.bookForm.summary){
                 this.bookForm.summary=this.bookForm.summary.replace(/\r\n/g,'');
                 this.bookForm.summary=this.bookForm.summary.replace(/\n/g,'');
                 this.bookForm.summary=this.bookForm.summary.replace(/\s/g,'')
               }

             }
           }else {
             this.bookForm=row
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
      getAcceptancedetailList(obj){
        this.visible=true;
        this.loading=true;
        catalogList(obj).then(data=>{
          if(data.data.code==0){
            this.tableData=[];
            this.tablePage = data.data.page;
            if(this.source2.length>1){
              for(let i=0,len=data.data.page.list.length;i<len;i++){
                this.tableData.push(...data.data.page.list[i]);
              }
            }else{
              this.tableData=data.data.page.list;
            }
            for(let index=0;index<this.tableData.length;index++){


            }
            if(this.tableData.length==0){
              this.visible=false;
              this.$message({
                type: 'error',
                message:"没查询到该数据，请重新搜索！",
                duration:'3000'
              });
              if(this.searchFrom.searchKey=="isbn"){
                this.form={
                  book:{
                    revision:"0",
                    language: "0",
                    bookSize : "0",
                    carrierType :"0",
                    binding: "0",
                    isbn:this.searchFrom.searchValue
                  },
                  holdingList:[]
                };
                this.$refs.input0.focus()
              }
            }else{
            }
            // 如果搜索了但是数据只有一条则自动填充
            if(this.tableData.length==1&&this.searchFrom.searchValue.replace(/(^\s*)|(\s*$)/g, "")!=""){
              this.coverData(this.tableData[0])
            }
            this.loading=false;
            if(data.data.page.list&&data.data.page.list.length>0){
            }else{
              if(data.data.page.pageNum>1) {
                this.form0.pageNum=data.data.page.pageNum-1;
                this.getAcceptancedetailList(JSON.stringify(this.form0));
              }
            }
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

      sure(type){
        let obj;
        // 日期最少是4位
        if(!(this.form.book.pubdate==undefined||this.form.book.pubdate.replace(/(^\s*)|(\s*$)/g, "")=="")&&this.form.book.pubdate.replace(/[^\d]/g,'').toString().length<4){
          this.$message({
            type: 'error',
            message:"请输入正确的日期格式！年份必须为4位数字，如果不够则前面补0",
            duration:'2000'
          });
          this.$refs.input12.focus()
          return
        }
        if(this.form.book.isbn==undefined||this.form.book.isbn.replace(/(^\s*)|(\s*$)/g, "")==""){
          this.$message({
            type: 'error',
            message:"请输入ISBN！",
            duration:'2000'
          });
          this.$refs.input0.focus()
          return
        }
        if(this.form.book.title==undefined||this.form.book.title.replace(/(^\s*)|(\s*$)/g, "")==""){
          this.$message({
            type: 'error',
            message:"请输入正题名！",
            duration:'2000'
          });
          this.$refs.input1.focus()
          return
        }
        if(this.form.book.firstDuty==undefined||this.form.book.firstDuty.replace(/(^\s*)|(\s*$)/g, "")==""){
          this.$message({
            type: 'error',
            message:"请输入第一责任人！",
            duration:'2000'
          });
          this.$refs.input3.focus()
          return
        }
        if(this.form.book.price==undefined||this.form.book.price==""){
          this.$message({
            type: 'error',
            message:"请输入价格！",
            duration:'2000'
          });
          this.$refs.input16.focus()
          return
        }
        if(this.callNo==undefined||this.callNo.replace(/(^\s*)|(\s*$)/g, "")==""){
          this.$message({
            type: 'error',
            message:"请输入索取号！",
            duration:'2000'
          });
          this.$refs.input14.focus()
          return
        }
        // if(this.form.holdingList.length==0){
        //   this.$message({
        //     type: 'error',
        //     message:"请添加馆藏信息！",
        //     duration:'2000'
        //   });
        //   return
        // }
          this.form.book.callNo=this.callNo;
          obj=this.form
          obj.book.pic=this.pic;
          obj.book.id=this.bookId;
        obj.book.revision=this.revision;
        obj.book.language=this.language;
        obj.book.currency=this.currency;
        obj.book.bookSize=this.bookSize;
        obj.book.carrierType=this.carrierType;
        obj.book.binding=this.binding;

        obj.book.author=this.form.book.firstDuty;
        let saveForm=this.form.book.callNo.split("/");
        defendListSave({"classNumber":saveForm[0],"currSeednumber":saveForm[1],"id":this.barcodeId}).then(data=>{
        })
        this.loading2=true;
         catalogSave(obj).then(data=>{
          if(data.data.code==0){
            this.$message({
              type: 'success',
              message:"保存成功！",
              duration:'2000'
            });
            this.loading2=false;
            this.defaultparamSet()
            this.form={
              book:{},
              holdingList:[]
            }
            this.callNo="";
            this.pic="";
            this.bookId="";
            this.$refs.inputFocus.focus();
            this.searchFrom.searchValue=""
          }else{
            this.loading2=false;
            this.$message({
              type: 'error',
              message:"保存失败！失败原因："+data.data.msg,
              duration:'2000'
            });
          }
        }).catch(err=>{
          this.loading2=false;
          this.$message({
            type: 'info',
            message: '保存失败！失败原因：'+err.data.msg
          });
        })
      },
      addData(type){
        if(type!="one"){
          if(this.form.recount==undefined||this.form.recount==""){
            this.$message({
              type: 'error',
              message:"请输入大于0的复本数",
              duration:'2000'
            });
            return
          }
        }else {
          // 加一行的时候复本书+1
          this.form.recount=this.form.holdingList.length+1
        }
        if(this.form.recount>200){
          this.$message({
            type: 'error',
            message:"一次性输入的区间长度不大于200！",
            duration:'2000'
          });
          return
        }
        if(this.addForm.partition==undefined){
          this.$message({
            type: 'error',
            message:"请先选择条码分区！",
            duration:'2000'
          });
          return
        }
        let totalBit,currUser;
        for(let numbers=0;numbers<this.partitionList.length;numbers++){
          if(this.addForm.partition==this.partitionList[numbers].id){
            totalBit=this.partitionList[numbers].totalBit;
            currUser=this.partitionList[numbers].currUser;
            this.addForm.prefix=this.partitionList[numbers].prefix;
          }
        }
        var barcode;
        let obj={totalBit:totalBit,currUser:currUser,prefix:this.addForm.prefix};
        getmaxbarcode(obj).then(data=>{
          console.log(data)
          if(data.data.code==0){
            barcode=data.data.LableVO.currBarcode;
            if(data.data.LableVO.surplusBarcode<0){
              this.$message({
                type: 'error',
                message:"没有多余的图书条码了，请重新选择条码分区！",
                duration:'5000'
              });
              return
            }
            if(Number(this.form.recount)>Number(data.data.LableVO.stopBarcode)){
              this.$message({
                type: 'error',
                message:"复本书超过了条码最大长度！，请重新选择条码分区！或者修改复本数",
                duration:'5000'
              });
              return
            }
            //输入的数字
            let  count;
            // 增加一行
            if(type=="one"){
              count=this.form.holdingList.length+1
            }else {
              count=Number(this.form.recount)
            }
            // this.form.holdingList=[];
            // 馆藏长度
            let rocountLength=this.form.holdingList.length;
            let countNum=count-rocountLength;
            let nowNum;
            if(countNum>=0){
              for(let i=0;i<countNum;i++){
                if(rocountLength>0){
                  nowNum=Number(this.form.holdingList[rocountLength-1].barcode.replace(this.addForm.prefix,""))+1+i
                }else {
                   nowNum=Number(barcode)+i+1+rocountLength
                }
                // 不够长度则补0
                function PrefixInteger(num,length) {
                  return (Array(length).join('0') + num).slice(-length);
                }
                nowNum=PrefixInteger(nowNum,totalBit);
                  this.form.holdingList.push(
                    {"barcode":this.addForm.prefix+""+nowNum,
                      "colladdressId":this.addForm.colladdressId,
                      "actType":this.addForm.actType,
                      "catalogBatch":this.addForm.catalogBatch,
                      "status":this.collStateList[0].value,
                      "source":this.addForm.source,
                      "prefix":this.addForm.prefix,
                      "currUser":currUser,
                      "add":'add',
                      "indate":new Date(),
                      "callNo":this.form.book.callNo
                    })

              }
            }else {
              this.form.holdingList=this.form.holdingList.splice(0,count)
            }

          }
        })
      },
      deleteTable(index){
        this.form.holdingList.splice(index,1);
        this.form.recount=this.form.holdingList.length;
      },
      // 覆盖
      coverData(row){
        this.form={
          book:{},
          holdingList:[]
        }
        this.callNo="";
        this.pic="";
        this.bookId="";
        let obj={bookId:row.id,isbn:row.isbn,"source":row.source}
        catalogDetail(obj).then(data=>{
          if(data.data.code==0){
            this.visible=false;
            // 如果详情不为空
            if(data.data.CatalogVO!=null){
              // 如果book数据为空
            if(data.data.CatalogVO.book==null){
              this.form.book={};
            }else {
              // 如果详情的book有数据
              for(let item in data.data.CatalogVO.book){
                if(data.data.CatalogVO.book[item]!=""){
                  this.$set(this.form.book,item,data.data.CatalogVO.book[item])
                }else {
                  this.$set(this.form.book,item,row[item])
                }
              }
            }
              if(this.form.book.pic!=null){
                this.pic=this.form.book.pic
              }
            }else {
                this.form.book=row
            }
             // 去掉空格
            if(this.form.book.summary) {
              this.form.book.summary = this.form.book.summary.replace(/\r\n/g, '');
              this.form.book.summary = this.form.book.summary.replace(/\n/g, '');
              this.form.book.summary = this.form.book.summary.replace(/\s/g, '')
            }
            console.log(this.form.book.summary)
            this.callNo=this.form.book.callNo;
            this.form.holdingList=[];
            this.pic=this.form.book.pic;
            this.bookId=this.form.book.id;
            this.revision=this.form.book.revision;
            this.language=this.form.book.language;
            this.currency=this.form.book.currency;
            this.bookSize=this.form.book.bookSize;
            this.carrierType=this.form.book.carrierType;
            this.binding=this.form.book.binding;
            this.$refs.input0.focus()
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

      },
      getBarcode(){
        for(let index=0;index<this.partitionList.length;index++){
          if(this.partitionList[index].id==this.formA['barcodeId']){
            this.barcodePrefix=this.partitionList[index].prefix;
            this.totalBit=this.partitionList[index].totalBit;
            console.log(this.barcodePrefix,this.totalBit)
          }
        }
      },
      getCallno(){
        if(this.form.book.bookType==undefined||this.form.book.bookType.replace(/(^\s*)|(\s*$)/g, "")==""){
          this.$message({
            type: 'error',
            message:"请先输入分类号！",
            duration:'2000'
          });
          return
        }
        classNumber(this.form.book.bookType).then(data=>{
          if(data.data.code==0){
            this.callNo=this.form.book.bookType+"/"+data.data.maxBarcodeNumber.maxNub;
            if(data.data.maxBarcodeNumber.id!=null){
              this.barcodeId=data.data.maxBarcodeNumber.id;
            }
            // this.$set(this.form.book,"callNo",this.form.book.bookType+"/"+data.data.maxBarcodeNumber.maxNub);
            // console.log(this.form.book)
            this.$refs["input14"].focus()
          }
        })
      },
      // 默认参数设置
      defaultSetting(){
        this.dialogTableVisible=true;
         this.formA={
           barcodeId:this.formB.barcodeId,
           bindingId:this.formB.bindingId,
           bookSize:this.formB.bookSize,
           carrierType:this.formB.carrierType,
           catalogBatch:this.formB.catalogBatch,
           circulationId:this.formB.circulationId,
           collAddressId:this.formB.collAddressId,
           createBy:this.formB.createBy,
           createTime:this.formB.createTime,
           currUser:this.formB.currUser,
           currencyId:this.formB.currencyId,
           id:this.formB.id,
           languageId:this.formB.languageId,
           libraryId:this.formB.libraryId,
           literatureId:this.formB.literatureId,
           pageNum:this.formB.pageNum,
           pageSize:this.formB.pageSize,
           revisionId:this.formB.revisionId
         }
      },
      onSubmit(){
        this.formA.currUser=this.user.loginName;
        defaultparamSave(this.formA).then(data=>{
          if(data.data.code==0){
            this.$message({
              type: 'success',
              message:"保存成功！",
              duration:'2000'
            });
            this.dialogTableVisible=false;
            this.defaultparamSet()
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
      //根据isbn搜索书
      isbnSearch(){
        this.handleEnter(1);
        if(this.form.book.isbn==undefined||this.form.book.isbn.replace(/(^\s*)|(\s*$)/g, "")==""){
          this.$message({
            type: 'error',
            message:"请先输入isbn！",
            duration:'2000'
          });
          return
        }
        isbnSearch(this.form.book.isbn.replace(/(^\s*)|(\s*$)/g, "")).then(data=>{
          if(data.data.code==0){
            if(data.data.info){
              for(let item in data.data.info){
                if(item=="author"){
                  this.$set(this.form.book,'firstDuty',data.data.info[item])
                }else {
                  this.$set(this.form.book,item,data.data.info[item])
                }
              }
            }
          }
        })
      },
      // 默认参数
      defaultparamSet(){
        defaultparam().then(data=>{
          if(data.data.code==0){
            // this.partitionList=data.data.page.list;
            if(data.data.catalogDefaultparam!=null){
              for(let key in data.data.catalogDefaultparam){
                // 初始化值
                this.$set(this.formB,key,data.data.catalogDefaultparam[key].toString());
                if(key=="collAddressId"){this.$set(this.addForm,'colladdressId',data.data.catalogDefaultparam[key].toString())}
                if(key=="barcodeId"){
                  this.$set(this.addForm,'partition',data.data.catalogDefaultparam[key].toString())
                  console.log( this.partitionList)
                  for(let numbers=0;numbers<this.partitionList.length;numbers++){
                    if(data.data.catalogDefaultparam[key].toString()==this.partitionList[numbers].id){
                      this.barcodePrefix=this.partitionList[numbers].prefix;
                      this.totalBit=this.partitionList[numbers].totalBit
                    }
                  }
                }
                if(key=="circulationId"){this.$set(this.addForm,'actType',data.data.catalogDefaultparam[key].toString())}
                if(key=="literatureId"){this.$set(this.addForm,'source',data.data.catalogDefaultparam[key].toString())}
                if(key=="catalogBatch"){this.$set(this.addForm,'catalogBatch',data.data.catalogDefaultparam[key].toString())}
                if(key=="revisionId"){this.revision=data.data.catalogDefaultparam[key].toString()}
                if(key=="languageId"){this.language=data.data.catalogDefaultparam[key].toString()}
                if(key=="bookSize"){this.bookSize=data.data.catalogDefaultparam[key].toString()}
                if(key=="carrierType"){this.carrierType=data.data.catalogDefaultparam[key].toString()}
                if(key=="bindingId"){this.binding=data.data.catalogDefaultparam[key].toString()}
                if(key=="currencyId"){this.currency=data.data.catalogDefaultparam[key].toString()}

              }
            }
          }else{
            this.$message({
              type: 'error',
              message:"默认参数数据获取失败！失败原因："+data.data.msg,
              duration:'2000'
            });
          }
        }).catch(err=>{
          this.$message({
            type: 'info',
            message: '默认参数数据获取失败，失败原因：'+err.data.msg
          });
        })
      },
      // 关闭弹框初始化默认值
      cancelDefault(){
        this.dialogTableVisible=false;

      },
      changPages(){
        if(this.source2.length>1){
          this.pageYes=false;
          this.pageSize=3;
          this.searchFrom.pageSize=3;

        }else {
          this.pageYes=true;
          this.searchFrom.pageSize=5
        }
      },
      copyData(){
        this.bookId="";
        this.$message({
          type: 'success',
          message:"复制成功！",
          duration:'2000'
        });

      },
      stopE(){
        // 阻止浏览器alt+e的默认行为
        function KeyDown(){
          if ( (window.event.altKey)&&window.event.keyCode==69){
            event.preventDefault();
          }
        }
        document.onkeydown = KeyDown
      },
      // 复本书只能输入数字
      justNumber(obj){
        if(this.form[obj]){
          this.form[obj]=this.form[obj].toString().replace(/[^\d]/g,'')
        }
      },
      // 页数只能输入正整数
      justNumber2(obj){
        if(this.form.book[obj]){
          this.form.book[obj]=this.form.book[obj].toString().replace(/[^\d]/g,'')
        }
      },
      // 价格只能输入正整数和小数
      justNumber3(obj){
        if(this.form.book[obj]){
          this.form.book[obj]=this.form.book[obj].toString().replace(/[^\d\.]/g,'')
        }
      },
      // 日期只能输入数字和-,.
      justNumber4(obj){
        if(this.form.book[obj]){
          this.form.book[obj]=this.form.book[obj].toString().replace(/[^\d\.\-]/g,'')
        }
      },
      // isbn只能输入数字和-
      justNumber5(obj){
        if(this.form.book[obj]){
          this.form.book[obj]=this.form.book[obj].toString().replace(/[^\d\-]/g,'')
        }
      }
    },
    filters: {
      // dateSort(value){
      //   // return value.split(" ")[0]
      // }
    },
    watch:{
      pageSize(newValue){
        this.searchFrom.pageSize=newValue
      }
    },
    mounted(){
      // 进入页面输入框获取焦点
      this.$refs.inputFocus.focus();
       this.stopE()
    }
  };
</script>
<style  scoped>
  #catalong{background: white;overflow: hidden;height: 100%;}
  .red{display: inline-block;width: 100px;;height: 40px;line-height: 40px;text-align: center;cursor: pointer;}
  .click{color:red;border-bottom: 1px solid  black}
  .detail{
    cursor: pointer;

  }
  .reader-avatar_wrap{
    display: inline-block;
    width: 158px;
    height: 158px;
    line-height:158px;
    overflow:hidden;
    border: 1px dashed #d9d9d9;
  }
  .reader-avatar-uploader{
    padding-left: 40px;
  }
  .reader-avatar-uploader .avatar{
    width: 100%;
    height: 100%;
  }
  .demo-form-inline{margin: 30px 0 0 10px}
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{margin-bottom: 8px}
  .box-card{margin-top: 0;height: 100%;}
   .tableColor{color: white;position: absolute;left: 0;top: 0;width: 100%;height: 100%;}
  .tableColor div{ position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%)}
  .bookFormPic{display:inline-block;width:148px;height:148px;margin-left: 100px}
</style>
<style>
  .el-table__body-wrapper .el-table__empty-block{min-height: 120px}
  .el-dialog * {
    -webkit-user-select: text!important;
    -moz-user-select: text!important;
    -ms-user-select: text!important;
    user-select: text!important;
  }
  #defaultSet .el-select{
    display: block;
    width: 90%;
  }
   #sure .el-button--primary{
    margin-left: 150px;
  }
  #sure .el-button--default{
    float: right;
    margin-right: 84px;
  }
   #result .el-dialog__title:before{
    display: none;
  }
  #result .el-dialog__body{padding-top: 0}
</style>
