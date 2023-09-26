<template>
  <div class="_post">
    <div id="editor-toolbar">
      <Toolbar
        style="z-index: 100"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
    </div>
    <div id="content">
      <div id="editor-container">
        <div id="title-container">
          <input v-model="state.form.title" placeholder="请输入标题..." />
        </div>
        <div id="editor-text-area">
          <Editor
            style="height: 500px; overflow-y: hidden"
            v-model="valueHtml"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="handleCreated"
            @onChange="handleChange"
          />
        </div>
        <!-- 文章选项 -->
        <div class="post-info">
          <el-form label-width="85px" :model="state.form">
            <el-form-item label="创建时间：">
              <el-date-picker
                type="datetime"
                style="width: 250px"
                :disabled-date="disabledDate"
                popper-class="select-zindex"
                v-model="state.form.createDate"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="分类：">
              <el-select
                v-model="state.form.cate"
                popper-class="select-zindex"
                class="optionsWidth"
              >
                <el-option
                  v-for="(item, index) in state.cateList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="浏览量：">
              <el-input
                v-model="state.form.views"
                disabled
                class="optionsWidth"
              ></el-input>
            </el-form-item>
            <el-form-item label="关键字：">
              <el-tag
                :key="tag"
                v-for="tag in state.dynamicTags"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="state.inputVisible"
                v-model="state.inputValue"
                ref="saveTagInput"
                @keyup.enter="handleInputConfirm"
                @blur="handleInputConfirm"
              >
              </el-input>
              <el-button v-else class="button-new-tag" @click="showInput"
                >+ 新增</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="submit-container">
      <div class="submit-bar">
        <div class="draft-tip" v-if="state.loading !== null">
          <span v-if="state.loading">
            <el-icon class="is-loading" style="margin-right: 5px">
              <Loading />
            </el-icon>
            <span>草稿保存中...</span>
          </span>
          <span v-else>草稿已保存</span>
        </div>
        <div>
          <span class="wordNum">字数：{{ state.form.wordsNum }}</span>
        </div>
        <div>
          <el-button
            :loading="state.postLoading"
            @click="submit(false)"
            type="primary"
            >发布</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import {
  onBeforeUnmount,
  ref,
  shallowRef,
  onMounted,
  reactive,
  computed,
} from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { ElMessage } from "element-plus";
import { getCurrDate } from "@/utils/common.js";
import { useRouter, useRoute } from "vue-router";
import { Loading } from "@element-plus/icons-vue";
import {
  postPageApi,
  editPageApi,
  getDetailByIdApi,
  getAdminCateValidApi,
} from "@/views/API/admin.js";

onMounted(() => {
  autoSave();
});
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  window.clearInterval(state.autoSaveInterval);
  const editor = editorRef.value;
  if (editor) {
    editor.destroy();
  }
});

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
  cateList: [{ name: "", id: "" }],
  inputVisible: false,
  inputValue: "",
  dynamicTags: [],
  autoSaveInterval: 0,
  loading: null,
  postLoading: false,
});

const id = route.query.id;

const userInfo = computed(() => {
  const uinfo = localStorage.getItem("userInfo");
  if (uinfo) {
    return JSON.parse(uinfo);
  } else {
    return "";
  }
});

const disabledDate = (date: any)=>{
  //  今天之后不能选择
  return date > new Date();
}

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

const getDetail = async (id: any) => {
  const res: any = await getDetailByIdApi({ id: id });
  if (res) {
    // 日期兼容safari
    res.data.result.createDate = res.data.result.createDate.replace(/-/g, "/");
    state.form = res.data.result;
    state.dynamicTags = state.form.keywords
      ? state.form.keywords.split(",")
      : ([] as any);
    editorRef.value.setHtml(state.form.content);
  }
};

if (id) {
  getDetail(id);
}
getCate(id);

const editPage = async (isDraft: boolean) => {
  if (isDraft) {
    state.loading = true as any;
  } else {
    state.postLoading = true;
  }
  const res = await editPageApi({
    ...state.form,
    createDate: getCurrDate(state.form.createDate),
    createBy: userInfo.value && userInfo.value.username,
    keywords: state.dynamicTags.join(","),
    draft: isDraft ? "1" : "0",
  });
  if (res) {
    const { page, cate, pageSize } = route.query;
    if (!isDraft) {
      state.postLoading = true;
      ElMessage.success("发布成功");
      router.push({
        path: "/article/pageList",
        query: { page, cate, pageSize },
      });
    } else {
      state.loading = false as any;
    }
  }
};

const postPage = async (isDraft: boolean) => {
  const res: any = await postPageApi({
    ...state.form,
    createBy: userInfo.value && userInfo.value.username,
    createDate: getCurrDate(state.form.createDate),
    keywords: state.dynamicTags.join(","),
    draft: isDraft ? "1" : "0",
  });
  if (res) {
    state.form.id = res.data;
    if (!isDraft) {
      ElMessage.success("发布成功");
      router.push({ path: "/article/pageList" });
    } else {
    }
  }
};

const mode = "default";
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
// 内容 HTML
const valueHtml = ref("");

const toolbarConfig = {
  excludeKeys: [
    "italic",
    "fullScreen",
    "through",
    "insertVideo",
    "insertTable",
    "todo",
  ],
};
const editorConfig = { placeholder: "请输入内容...", MENU_CONF: {} };

const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleChange = (editor: any) => {
  const editorDom = document.getElementById("w-e-textarea-1");
  if (editorDom && editorDom.textContent) {
    state.form.wordsNum = editorDom.textContent.length;
  } else {
    state.form.wordsNum = editor.getText().length;
  }
  state.form.content = editorRef.value.getHtml() as any;
};

editorConfig.MENU_CONF["uploadImage"] = {
  server: "/manage-service/account/upload",
  timeout: 15 * 1000, // 5s
  fieldName: "file",
  meta: {},
  metaWithUrl: true, // join params to url
  headers: { Accept: "application/json", Authorization: userInfo.value.token },
  maxFileSize: 10 * 1024 * 1024, // 10M
  base64LimitSize: 5 * 1024, // insert base64 format, if file's size less than 5kb
  customInsert(res: any, insertFn: any) {
    console.log(res);
    insertFn(res.data[0].url);
  },
};

const submit = async (type: boolean) => {
  state.form.content = editorRef.value.getHtml() as any;
  // 正常提交提示必填项
  if (!state.form.title) {
    ElMessage.warning("请输入标题");
    return false;
  }
  if (!state.form.content) {
    ElMessage.warning("请输入内容");
    return false;
  }
  if (!state.form.cate) {
    ElMessage.warning("请选择分类");
    return false;
  }
  // 同时保存到缓存
  localStorage.setItem("postInfo", JSON.stringify(state.form));
  if (state.form.id) {
    editPage(type);
  } else {
    postPage(type);
  }
};
const showInput = async (tag: any) => {
  state.inputVisible = true;
};

const handleInputConfirm = async (tag: any) => {
  const inputValue = state.inputValue as never;
  if (inputValue) {
    state.dynamicTags.push(inputValue);
  }
  state.inputVisible = false;
  state.inputValue = "";
};

const handleClose = async (tag: never) => {
  state.dynamicTags.splice(state.dynamicTags.indexOf(tag), 1);
};

const autoSave = () => {
  // 每15秒自动保存
  state.autoSaveInterval = setInterval(() => {
    if (state.form.title && state.form.content && state.form.cate) {
      submit(true);
    }
    console.log(state.autoSaveInterval);
  }, 15000);
};
</script>

<style scoped lang="scss">
._post {
  #top-container {
    border-bottom: 1px solid #e8e8e8;
    padding-left: 30px;
  }

  #editor-toolbar {
    width: 100%;
    background-color: #fcfcfc;
    margin: 0 auto;
  }

  #content {
    height: calc(100% - 40px);
    background-color: rgb(245, 245, 245);
    overflow-y: auto;
    position: relative;
  }

  #editor-container {
    width: 850px;
    margin: 30px auto 150px auto;
    background-color: #fff;
    padding: 20px 50px 50px 50px;
    border: 1px solid #e8e8e8;
    box-shadow: 0 2px 10px rgb(0 0 0 / 12%);
  }

  #title-container {
    padding: 20px 0;
    border-bottom: 1px solid #e8e8e8;
  }

  #title-container input {
    font-size: 30px;
    border: 0;
    outline: none;
    width: 100%;
    line-height: 1;
  }

  #editor-text-area {
    min-height: 500px;
    margin-top: 20px;
  }

  .post-info {
    border-top: 1px solid #ebebeb;
    padding-top: 20px;
  }

  .optionsWidth {
    width: 250px;
  }

  .submit-container {
    color: #8590a6;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 10px;
    text-align: center;
    background-color: #fff;
    border-top: 1px solid #ebebeb;
    z-index: 300;
  }

  .submit-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 850px;
    margin: 0 auto;

    .draft-tip {
      display: flex;
      align-items: center;
      margin-right: 30px;
    }
  }

  .wordNum {
    margin-right: 30px;
  }

  .input-new-tag {
    width: 90px;
    vertical-align: bottom;
  }

  .el-tag {
    margin-right: 5px;
    height: 32px;
  }
}
</style>
