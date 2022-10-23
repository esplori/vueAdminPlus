<template>
  <div class="post">
    <el-form label-width="85px" :model="state.form">
      <el-form-item label="" label-width="0">
        <el-input class="title" size="large" v-model="state.form.title" placeholder="请输入文章标题"></el-input>
      </el-form-item>
      <el-form-item label="" label-width="0">
        <div style="width: 100%">
          <div style="min-height: 550px" id="wangeditorRef" ref="wangeditorRef"></div>
        </div>
        <div class="autosaveTip" v-show="state.showAutosaveTip">
          <el-alert title="自动保存成功，每过15秒会自动保存，防止数据丢失" type="success">
          </el-alert>
        </div>
      </el-form-item>
      <el-form-item label="创建时间：">
        <el-date-picker type="datetime" style="width: 250px" popper-class="select-zindex"
          v-model="state.form.createDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="分类：">
        <el-select v-model="state.form.cate" popper-class="select-zindex" class="optionsWidth">
          <el-option v-for="(item, index) in state.cateList" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="浏览量：">
        <el-input v-model="state.form.views" disabled class="optionsWidth"></el-input>
      </el-form-item>
      <el-form-item label="字数：">
        <div class="optionsWidth">{{ state.form.wordsNum }}</div>
      </el-form-item>
      <el-form-item label="关键字：">
        <el-tag :key="tag" v-for="tag in state.dynamicTags" closable :disable-transitions="false"
          @close="handleClose(tag)">
          {{ tag }}
        </el-tag>
        <el-input class="input-new-tag" v-if="state.inputVisible" v-model="state.inputValue" ref="saveTagInput"
          size="small" @keyup.enter="handleInputConfirm" @blur="handleInputConfirm">
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新增</el-button>
      </el-form-item>

      <el-form-item>
        <el-button @click="submit(true)" type="primary">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import Wangeditor from "wangeditor";
import {
  postPageApi,
  editPageApi,
  getDetailByIdApi,
  getAdminCateValidApi,
} from "@/views/API/admin.js";
import { getCurrDate } from "@/utils/common.js";
import { reactive, onMounted, computed, onBeforeUnmount } from "vue";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const state = reactive({
  form: {
    id: "",
    title: "",
    content: "",
    cate: "",
    views: 0,
    keywords: "",
    createBy: "",
    wordsNum: 0,
    createDate: getCurrDate(""),
  },
  cateList: [{name:"",id:""}],
  editorOption: {
    placeholder: "编辑文章内容",
  },
  editor: {} as any,
  inputVisible: false,
  inputValue: "",
  dynamicTags: [],
  autoSave: null, // 自动保存定时器
  showAutosaveTip: false, // 是否显示自动保存提示
});

onMounted(() => {
  // 页签加载完成后每30秒调用保存接口，实现自动保存
  state.autoSave = setInterval(() => {
    submit(false);
  }, 30000) as any;
  let userinfo = localStorage.getItem("userInfo") as any;
  if (userinfo) {
    userinfo = JSON.parse(userinfo);
  } else {
    userinfo = {};
  }
  state.editor = new Wangeditor("#wangeditorRef") as any;
  // 配置 server 接口地址
  state.editor.config.uploadImgServer = "/bootService/account/upload";
  state.editor.config.uploadFileName = "file";
  state.editor.config.uploadImgHeaders = {
    Authorization: userinfo.token,
  };
  state.editor.config.uploadImgTimeout = 100 * 1000;
  state.editor.config.uploadImgHooks = {
    // 上传图片之前
    before: function (xhr:any) {
      // console.log(xhr);
      // // 可阻止图片上传
      // return {
      //     prevent: true,
      //     msg: '需要提示给用户的错误信息'
      // }
    },
    // 图片上传并返回了结果，图片插入已成功
    success: function (xhr:any) {
      // console.log("success", xhr);
    },
    // 图片上传并返回了结果，但图片插入时出错了
    fail: function (xhr:any, editor:any, resData:any) {
      // console.log("fail", resData);
    },
    // 上传图片出错，一般为 http 请求的错误
    error: function (xhr:any, editor:any, resData:any) {
      // console.log("error", xhr, resData);
    },
    // 上传图片超时
    timeout: function (xhr:any) {
      // console.log("timeout");
    },
    // 图片上传并返回了结果，想要自己把图片插入到编辑器中
    // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
    customInsert: function (insertImgFn:any, result:any) {
      // result 即服务端返回的接口
      // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
      insertImgFn(result.data[0].url);
    },
  };
  // 配置菜单栏，删减菜单，调整顺序
  state.editor.config.menus = [
    "head",
    "bold",
    "fontSize",
    "underline",
    "link",
    "list",
    "justify",
    "quote",
    "image",
    "video",
    "code",
  ] as any;
  // 插入代码语言配置
  state.editor.config.languageType = [
    "JavaScript",
    "CSS",
    "Java",
    "JSON",
    "Html",
  ] as any;
  // 配置 onchange 回调函数
  state.editor.config.onchange = function (newHtml:any) {
    let dom = document.querySelector(".w-e-text") as any
    state.form.wordsNum = dom.textContent.length;
  };
  // 配置触发 onchange 的时间频率，默认为 200ms
  // this.editor.config.onchangeTimeout = 5000; // 修改为 500ms
  state.editor.create();

  const id = route.query.id;
  if (id) {
    getDetail(id);
  }
  getCate(id);
});

const userInfo = computed(() => {
  const uinfo = localStorage.getItem("userInfo");
  if (uinfo) {
    return JSON.parse(uinfo);
  } else {
    return "";
  }
});

const getCate = async (id: any) => {
  const res: any = await getAdminCateValidApi({});
  if (res) {
    state.cateList = res.data.result || [];
    if (!id) {
      //  如果不是编辑，默认取第一个分类
      state.form.cate = state.cateList[0].id;
    }
  }
};

const submit = async (jump: any) => {
  state.form.content = (state.editor.txt.html()) as any;
  // 自动保存，如果无标题或内容不调接口
  if (!jump && (!state.form.title || !state.form.content)) {
    return false;
  }
  // 正常提交提示必填项
  if (!state.form.title && jump) {
    ElMessage.warning("请输入标题");
    return false;
  }
  if (!state.form.content && jump) {
    ElMessage.warning("请输入内容");
    return false;
  }
  if (!state.form.cate && jump) {
    ElMessage.warning("请选择分类");
    return false;
  }
  // 同时保存到缓存
  localStorage.setItem("postInfo", JSON.stringify(state.form));
  if (state.form.id) {
    editPage(jump);
  } else {
    postPage(jump);
  }
  if (!jump) {
    // 自动保存成功后显示提示，5秒后关闭
    state.showAutosaveTip = true;
    setTimeout(() => {
      state.showAutosaveTip = false;
    }, 5000);
  }
};

const editPage = async (jump: any) => {
  const res = await editPageApi({
    ...state.form,
    createDate: getCurrDate(state.form.createDate),
    createBy: userInfo && userInfo.value.username,
    keywords: state.dynamicTags.join(","),
  });
  if (res) {
    const { page, cate, pageSize } = route.query;
    // 保存列表查询参数,自动保存不跳转
    jump &&
      router.push({
        path: "pageList",
        query: { page, cate, pageSize },
      });
  }
};

const postPage = async (jump: any) => {
  const res: any = await postPageApi({
    ...state.form,
    createBy: userInfo && userInfo.value.username,
    createDate: getCurrDate(state.form.createDate),
    keywords: state.dynamicTags.join(","),
  });
  if (res) {
    // 回填id，方便再次保存使用
    state.form.id = res.data;
    jump && router.push({ path: "pageList" });
  }
};

const getDetail = async (id: any) => {
  const res: any = await getDetailByIdApi({ id: id });
  if (res) {
    // 日期兼容safari
    res.data.result.createDate = res.data.result.createDate.replace(/-/g, "/");
    // this.$set(this, "form", res.data.result);
    state.form = res.data.result;
    state.dynamicTags = state.form.keywords
      ? state.form.keywords.split(",")
      : [] as any;
    state.editor.txt.html(state.form.content);
  }
};

const handleClose = async (tag: never) => {
  state.dynamicTags.splice(state.dynamicTags.indexOf(tag), 1);
};

const showInput = async (tag: any) => {
  state.inputVisible = true;
  // this.$nextTick((_) => {
  //   this.$refs.saveTagInput.$refs.input.focus();
  // });
};

const handleInputConfirm = async (tag: any) => {
  const inputValue = state.inputValue as never;
  if (inputValue) {
    state.dynamicTags.push(inputValue);
  }
  state.inputVisible = false;
  state.inputValue = "";
};
onBeforeUnmount(() => {
  // 页面销毁前清除定时器
  clearInterval(state.autoSave as any);
});
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

  // 重置标题样式
  .title {
    :deep(.el-input__wrapper) {
      margin-top: 30px;
      box-shadow: none;
      font-size: 24px;
      border-bottom: 1px solid var(--el-input-border-color);
    }
  }
}
</style>
