<template>
	   <div id="outerContainer">
       <!-- <el-form :inline="true" :model="searchData" class="demo-form-inline">
          <el-form-item label="我的关注">
              <el-select v-model="searchData.checkStatusSearch">
                <el-option
                 v-for="item in fansData"
                 :key="item.peopleId"
                 :label="item.nickName"
                 :value="item.peopleId"
                 ></el-option>
              </el-select>
          </el-form-item>
      </el-form> -->
      <div :style="{marginBottom:'10px'}" @change="radioChange">
		    <el-radio-group v-model="radio" size="small">
		      <el-radio-button label="1">3天</el-radio-button>
		      <el-radio-button label="2">一周</el-radio-button>
		      <el-radio-button label="3">一个月</el-radio-button>
		      <el-radio-button label="4">三个月</el-radio-button>
		    </el-radio-group>
		</div>
          <!-- <el-card class="box-card" shadow="hover" style="marginBottom:10px;" v-for="item in shareData" :key="item.id">
            <div slot="header" class="clearfix">
                  <span class="el-dropdown-link">
                      <img :src="item.pic" alt="">
                  </span>
                  <span style="color:#409EFF;font-size: 12px;margin-left:20px;">{{item.nickName}}</span>
                  <span style="color:#949494;font-size: 12px">{{item.createTime}}</span>
            </div>
            <p class="text-content">{{item.content}}</p>
            <div class="footer clearfix">
              <div class="box">
                   <div class="report-box">
                    <span class="iconfont icon-guize report" @click="report(item)"><span class="counts">{{item.reportCount}}</span></span>
                  </div>
                  <div class="comment-box" @click="Delete(item)">
                    <span class="el-icon-delete comment"></span>
                  </div>
              </div>
            </div>
          </el-card> -->
          <el-card class="box-card" style="marginBottom:10px;" v-for="item in shareData" :key="item.id" body-style="padding:0px;">
            <div class="noticeDiv" >
              <span class="el-dropdown-link space-info">
                  <img :src="item.pic">
              </span>
              <div class="right_content">
                <div class="noticeTitle">
                  <span style="color: #46A4AF;font-size: 18px">{{item.nickName}}</span>
                  <span class="rightTime">{{item.createTime}}</span>
                </div>
                  <div class="noticeContent">
                  {{item.content}}
                </div>
              </div>

            </div>
            <div class="footer clearfix">
              <div class="box">
                   <div class="report-box">
                    <span class="iconfont icon-guize report" @click="report(item)"><span class="counts">{{item.reportCount}}</span></span>
                  </div>
                <span v-for="(item2,index2) in power" :key="index2">
                  <div class="comment-box" @click="Delete(item)" v-if="item2.name.trim()=='删除'">
                    <span class="iconfont el-icon-delete comment"><span class="counts">{{item.commentCount}}</span></span>
                  </div>
                </span>
              </div>
            </div>
          </el-card>
    <el-row style="float:right">
				<el-col :span="24">
					<el-pagination
					layout="total, prev, pager, next, jumper"
					:total="shareDataPage.total"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					>
				</el-pagination>
				</el-col>
			</el-row>

    <dia-log :visible.sync="visible2" title="举报详情" style="padding:0;">
        <div style="height:300px;">
           <el-table
            :data="reportData" border  style="width: 100%">
      			<el-table-column label="序号" width="50" type="index"></el-table-column>
            <el-table-column  prop="nickName" label="读者名称"></el-table-column>
            <el-table-column  prop="createTime" label="发表时间"></el-table-column>
            <el-table-column  prop="reason" label="举报内容"></el-table-column>
            <el-table-column  prop="type" label="举报类型"></el-table-column>
        </el-table>
          <el-row style="float:right">
          <el-col :span="24">
              <el-pagination
              layout="total, prev, pager, next, jumper"
              :total="reportDataPage.total"
              @size-change="handleSizeChange1"
              @current-change="handleCurrentChange1"
              >
            </el-pagination>
				</el-col>
			</el-row>
        </div>
    </dia-log>
    </div>
</template>

<script>
import DiaLog from "@/components/Dialog";
import {
  focuslist,
  sharelist,
  likeSave,
  likeCancel,
  shareInfo,
  commentlist,
  focusSave,
  focusDelete,
  commentSave,
  shareReport,
  shareDelete,
  reportlist
} from "@/request/sharingSpace";
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  name: "share",
  computed: {
    ...mapGetters(["user"])
  },
  components: {
    DiaLog
  },
  data() {
    return {
      searchData: {},
      visible: false,
      visible2: false,
      radio: "",
      value: "",
      fansData: [],
      fansDataPage: "",
      shareData: [],
      shareDataPage: "",
      form: {
        pageSize: 5,
        page: 1
      },
      share: [],
      reportData: [],
      reportDataPage: "",
      reportParam: {
        pageSize: 5,
        pageNum: 1
      },
      commentData: [],
      comment: {
        commentText: ""
      },
      rules: {
        commentText: [
          { required: true, message: "评论不能为空", trigger: "blur" },
          { min: 15, message: "评论内容不少于15字", trigger: "blur" }
        ]
      },
      focusParam: {
        orgId: this.$store.getters.user.orgId,
        pageSize: 1000,
        pageNum: 1
      },
      power:[],//按钮权限数组
      searchButton:false
    };
  },
  created() {
    this.getPowerArr();
    this.getFocuslist(JSON.stringify(this.focusParam));
    this.getSharelist(JSON.stringify(this.form));
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
    getFocuslist(obj) {
      focuslist(obj).then(data => {
        this.fansDataPage = data.data.page;
        if (data.data.code == 0) {
          this.fansData = data.data.page.list;
        } else {
          this.$message({
            type: "error",
            message: data.data.msg
          });
        }
      });
    },
    getSharelist(obj) {
      sharelist(obj).then(data => {
        this.shareDataPage = data.data.page;
        if (data.data.code == 0) {
          this.shareData = data.data.page.list;
        } else {
          this.$message({
            type: "error",
            message: data.data.msg
          });
        }
      });
    },
    // 分享评论
    getCommentlist(obj) {
      commentlist(obj).then(data => {
        if (data.data.code == 0) {
          this.commentData = data.data.page.list;
          console.log(this.commentData);
        } else {
          this.$message({
            type: "error",
            message: data.data.msg
          });
        }
      });
    },
    search() {
      Object.assign(this.form, this.searchData);
      this.getSharelist(JSON.stringify(this.form));
    },
    // 弹出详情
    sentient(row) {
      this.visible = true;
      let shareId = row.id;
      shareInfo(shareId).then(data => {
        if (data.data.code == 0) {
          this.share = data.data.share;
        } else {
          this.$message({
            type: "error",
            message: data.data.msg
          });
        }
      });
      let datas = {
        shareId: row.id
      };
      this.getCommentlist(JSON.stringify(datas));
    },
    // 删除评论
    Delete(row) {
      let shareId = row.id;
      this.$confirm("确定删除【" + row.nickName + "】用户的该条评论?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteShare(shareId);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    deleteShare(shareId) {
      shareDelete(shareId).then(data => {
        if (data.data.code == 0) {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.getSharelist(JSON.stringify(this.form));
        }
      });
    },
    // reportlist
    report(row) {
      this.visible2 = true;
       let reportParam = {
        pageSize: 5,
        pageNum: 1,
        shareId: row.id
      };
      console.log(row.id);
      this.reportlist(JSON.stringify(reportParam));
    },
    reportlist(obj) {
      reportlist(obj).then(data => {
        this.reportDataPage = data.data.page;
        if (data.data.code == 0) {
          this.reportData = data.data.page.list;
        }
      });
    },
    // 分享详情发表评论
    commentSave() {
      let commentParam = {
        shareId: this.shareData.id,
        orgId: this.shareData.orgId,
        content: this.comment.commentText
      };
      this.$refs.commentForm.validate(valid => {
        if (valid) {
          commentSave(commentParam).then(data => {
            if (data.data.code == 0) {
              this.$message({
                message: "评论成功",
                type: "success"
              });
              this.visible = false;
              this.getSharelist(JSON.stringify(this.form));
            } else {
              this.$message({
                type: "error",
                message: data.data.msg
              });
            }
          });
        }
      });
    },
    // 三天、一周、一个月、三个月查询
    radioChange(val) {
      let radIndex = val.target.value;
      console.log(radIndex);
      if (radIndex == 1) {
        this.form.startTime = moment()
          .subtract(3, "days")
          .format("YYYY-MM-DD");
      } else if (radIndex == 2) {
        this.form.startTime = moment()
          .subtract(7, "days")
          .format("YYYY-MM-DD");
      } else if (radIndex == 3) {
        this.form.startTime = moment()
          .subtract(1, "months")
          .format("YYYY-MM-DD");
      } else if (radIndex == 4) {
        this.form.startTime = moment()
          .subtract(3, "months")
          .format("YYYY-MM-DD");
      }
      this.search();
    },
    handleSizeChange(val) {
      this.form.pageSize = val;
      this.reportlist(JSON.stringify(this.form));
    },
    handleCurrentChange(val) {
      this.form.pageNum = val;
      this.getSharelist(JSON.stringify(this.form));
    },
    handleSizeChange1(val) {
      this.reportParam.pageSize = val;
      this.reportlist(JSON.stringify(this.reportParam));
    },
    handleCurrentChange1(val) {
      this.reportParam.pageNum = val;
      this.reportlist(JSON.stringify(this.reportParam));
    }
  }
};
</script>


<style type="style/css" scoped>
.footer {
  margin-top: 5px;
  margin-bottom: 5px;
}
.box {
  float: right;
  display: inline-block;
  font-size: 14px;
}
.el-dropdown-link img {
  height: 36px;
  width: 36px;
}
.avatarImgBox {
  margin-top: 10px;
  height: 50px;
}
.avatar {
  float: left;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 79px;
}
.avatar-left {
  float: left;
  height: 50px;
}
.avatar-top {
  float: left;
  font-size: 14px;
}
.intro {
  font-size: 12px;
  color: #949494;

  /* width:136px;  */
}
.avatar-bottom {
  float: left;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 126px;
}
.left-content {
  height: 500px;
  background: none;
  border: 2px solid #333;
  border-radius: 5px;
  position: relative;
  padding: 15px 15px 0;
}
.box-card {
  border: 2px solid #DADADA;
  border-radius: 5px;
}

.el-button--mini,
.el-button--mini.is-round {
  padding: 4px 9px;
}
.text-content {
  text-indent: 2em;
  color: #949494;
  font-size: 14px;
  line-height: 20px;
}
.comment,
.like,
.report {
  font-size: 20px;
  color: #A0A0A0;
}
.share {
  font-size: 20px;
  color: #ff6600;
}

.counts {
  font-size: 14px;
  color: #000;
}
.comment-box,
.like-box,
.like-cancel,
.share-box,
.report-box {
  width: 70px;
  float: right;
  cursor: pointer;
}
.focus-box {
  overflow-y: scroll;
  height: 450px;
}

.discuss {
  margin-top: 20px;
  height: 270px;
  overflow-x: scroll;
  border: 1px solid #949494;
}
.content {
  height: 90px;
  padding: 10px;
  border-bottom: 1px #949494 solid;
}
.speak {
  margin-top: 50px;
  text-indent: 2em;
}
.tbox {
  float: left;
}
.tbox-left {
  float: left;
  line-height: 37px;
  color: #409eff;
}
.noticeDiv{
		display: flex;
	}
	.right_content{
		flex: 1;
	}
	.rightTime{
		float: right;
		font-size: 14px;
		color: #999;
	}
	.noticeTitle{
		height: 38px;
		line-height: 80px;
		padding: 0 16px;
		border-bottom: none;
		border-left: none;
	}
	.noticeContent{
		padding: 16px;
		line-height:24px;
		font-size: 14px;
		border-top: none;
		border-left: none;
    color: #A0A0A0;
  }
  .space-info{
  width: 120px;
  height: 110px;
}
.space-info img{
  width: 90px;
  height: 90px;
  margin: 23px 5px 0 30px;
}
</style>
