<template>
  <div class="post">
    <el-form label-width="85px" :model="form">
      <el-form-item label="" label-width="0">
        <el-input
          class="title"
          size="medium"
          v-model="form.title"
          placeholder="请输入文章标题"
        ></el-input>
      </el-form-item>
      <el-form-item label="" label-width="0">
        <div>
          <div style="min-height: 550px" id="wangeditor"></div>
        </div>
        <div class="autosaveTip" v-show="showAutosaveTip">
          <el-alert
            title="自动保存成功，每过15秒会自动保存，防止数据丢失"
            type="success"
          >
          </el-alert>
        </div>
      </el-form-item>
      <el-form-item label="创建时间：">
        <el-date-picker
          type="datetime"
          class="optionsWidth"
          popper-class="select-zindex"
          v-model="form.createDate"
          format="yyyy/MM/dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="分类：">
        <el-select
          v-model="form.cate"
          popper-class="select-zindex"
          class="optionsWidth"
        >
          <el-option
            v-for="(item, index) in cateList"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="浏览量：">
        <el-input v-model="form.views" disabled class="optionsWidth"></el-input>
      </el-form-item> -->
      <el-form-item label="字数：">
        <div class="optionsWidth">{{ form.wordsNum }}</div>
      </el-form-item>
      <el-form-item label="关键字：">
        <el-tag
          :key="tag"
          v-for="tag in dynamicTags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput"
          >+ 新增</el-button
        >
      </el-form-item>

      <el-form-item>
        <el-button @click="submit(true)" type="primary">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// import Wangeditor from "wangeditor";
import {
  postPageApi,
  editPageApi,
  getDetailByIdApi,
  getAdminCateValidApi,
} from "@/views/API/admin.js";
import { getCurrDate } from "@/utils/common.js";
export default {
  data() {
    return {
      form: {
        id: "",
        title: "",
        content: "",
        cate: "",
        views: 0,
        keywords: "",
        createBy: "",
        wordsNum: 0,
        createDate: getCurrDate(),
      },
      cateList: [],
      editorOption: {
        placeholder: "编辑文章内容",
      },
      editor: null,
      inputVisible: false,
      inputValue: "",
      dynamicTags: [],
      autoSave: null, // 自动保存定时器
      showAutosaveTip: false, // 是否显示自动保存提示
    };
  },
  components: {},
  mounted() {
    // 页签加载完成后每15秒调用保存接口，实现自动保存
    // this.autoSave = setInterval(() => {
    //   this.submit(false);
    // }, 15000);
    // let userinfo = localStorage.getItem("userInfo");
    // if (userinfo) {
    //   userinfo = JSON.parse(userinfo);
    // } else {
    //   userinfo = {};
    // }
    // this.editor = new Wangeditor("#wangeditor");
    // // 配置 server 接口地址
    // this.editor.config.uploadImgServer = "/bootService/account/upload";
    // this.editor.config.uploadFileName = "file";
    // this.editor.config.uploadImgHeaders = {
    //   Authorization: userinfo.token,
    // };
    // this.editor.config.uploadImgTimeout = 100 * 1000;
    // this.editor.config.uploadImgHooks = {
    //   // 上传图片之前
    //   before: function (xhr) {
    //     // console.log(xhr);
    //     // // 可阻止图片上传
    //     // return {
    //     //     prevent: true,
    //     //     msg: '需要提示给用户的错误信息'
    //     // }
    //   },
    //   // 图片上传并返回了结果，图片插入已成功
    //   success: function (xhr) {
    //     // console.log("success", xhr);
    //   },
    //   // 图片上传并返回了结果，但图片插入时出错了
    //   fail: function (xhr, editor, resData) {
    //     // console.log("fail", resData);
    //   },
    //   // 上传图片出错，一般为 http 请求的错误
    //   error: function (xhr, editor, resData) {
    //     // console.log("error", xhr, resData);
    //   },
    //   // 上传图片超时
    //   timeout: function (xhr) {
    //     // console.log("timeout");
    //   },
    //   // 图片上传并返回了结果，想要自己把图片插入到编辑器中
    //   // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
    //   customInsert: function (insertImgFn, result) {
    //     // result 即服务端返回的接口
    //     // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
    //     insertImgFn(result.data[0].url);
    //   },
    // };
    // // 配置菜单栏，删减菜单，调整顺序
    // this.editor.config.menus = [
    //   "head",
    //   "bold",
    //   "fontSize",
    //   "italic",
    //   "underline",
    //   "indent",
    //   "lineHeight",
    //   "foreColor",
    //   "backColor",
    //   "link",
    //   "list",
    //   "todo",
    //   "justify",
    //   "quote",
    //   "image",
    //   "video",
    //   "code",
    //   "undo",
    //   "redo",
    // ];
    // // 插入代码语言配置
    // this.editor.config.languageType = [
    //   "JavaScript",
    //   "CSS",
    //   "Java",
    //   "JSON",
    //   "Html",
    // ];
    // let _this = this;
    // // 配置 onchange 回调函数
    // this.editor.config.onchange = function (newHtml) {
    //   _this.form.wordsNum =
    //     document.querySelector(".w-e-text").textContent.length;
    // };
    // // 配置触发 onchange 的时间频率，默认为 200ms
    // // this.editor.config.onchangeTimeout = 5000; // 修改为 500ms
    // this.editor.create();
  },
  computed: {
    // userInfo() {
    //   const userinfo = localStorage.getItem("userInfo");
    //   if (userinfo) {
    //     return JSON.parse(userinfo);
    //   } else {
    //     return "";
    //   }
    // },
  },
  created() {
    // const id = this.$route.query.id;
    // if (id) {
    //   this.getDetail(id);
    // }
    // this.getCate(id);
  },
  methods: {
    async getCate(id) {
      const res = await getAdminCateValidApi({});
      if (res) {
        this.cateList = res.data.result || [];
        if (!id) {
          //  如果不是编辑，默认取第一个分类
          this.form.cate = this.cateList[0].id;
        }
      }
    },
    submit(jump) {
      this.form.content = this.editor.txt.html();
      // 自动保存，如果无标题或内容不调接口
      if (!jump && (!this.form.title || !this.form.content)) {
        return false;
      }
      // 正常提交提示必填项
      if (!this.form.title && jump) {
        this.$message.warning("请输入标题");
        return false;
      }
      if (!this.form.content && jump) {
        this.$message.warning("请输入内容");
        return false;
      }
      if (!this.form.cate && jump) {
        this.$message.warning("请选择分类");
        return false;
      }
      if (this.form.id) {
        this.editPage(jump);
      } else {
        this.postPage(jump);
      }
      if (!jump) {
        // 自动保存成功后显示提示，5秒后关闭
        this.showAutosaveTip = true;
        setTimeout(() => {
          this.showAutosaveTip = false;
        }, 5000);
      }
    },
    async editPage(jump) {
      const res = await editPageApi({
        ...this.form,
        createDate: getCurrDate(this.form.createDate),
        keywords: this.dynamicTags.join(","),
      });
      if (res) {
        let { page, cate, pageSize } = this.$route.query;
        // 保存列表查询参数,自动保存不跳转
        jump &&
          this.$router.push({
            path: "/pageList",
            query: { page, cate, pageSize },
          });
      }
    },
    async postPage(jump) {
      const res = await postPageApi({
        ...this.form,
        createBy: this.userInfo && this.userInfo.username,
        createDate: getCurrDate(this.form.createDate),
        keywords: this.dynamicTags.join(","),
      });
      if (res) {
        // 回填id，方便再次保存使用
        this.form.id = res.data;
        jump && this.$router.push({ path: "/pageList" });
      }
    },
    async getDetail(id) {
      const res = await getDetailByIdApi({ id: id });
      if (res) {
        // 日期兼容safari
        res.data.result.createDate = res.data.result.createDate.replace(
          /-/g,
          "/"
        );
        this.$set(this, "form", res.data.result);
        this.dynamicTags = this.form.keywords
          ? this.form.keywords.split(",")
          : [];
        this.editor.txt.html(this.form.content);
      }
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
  },
  beforeDestroy() {
    // 页面销毁前清除定时器
    clearInterval(this.autoSave);
  },
};
</script>

<style scoped lang="scss">
.post {
  width: 100%;
  .optionsWidth {
    width: 250px;
  }
  .el-tag {
    margin-right: 5px;
  }
  .button-new-tag {
    height: 28px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    vertical-align: bottom;
  }
  .autosaveTip {
    height: 35px;
    margin-top: 5px;
  }
  .el-alert {
    padding: 0;
  }
  .title {
    /deep/.el-input__inner {
      border-top: none;
      border-left: none;
      border-right: none;
      border-radius: 0;
    }
  }
}
</style>
