<template>
  <div class="_post">
    <div id="editor-toolbar">
      <Toolbar style="z-index: 100" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    </div>
    <div id="content">
      <div id="editor-container">
        <div id="title-container">
          <input v-model="state.form.title" placeholder="请输入标题..." />
        </div>
        <div id="editor-text-area">
          <Editor style="height: 500px; overflow-y: hidden" v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode"
            @onCreated="handleCreated" @onChange="handleChange" />
          <div class="draft-btn" @click="handleDraft">
            <!-- <el-button :icon="Edit"></el-button> -->
            <span>草稿</span>
            <span>记录</span>
          </div>
        </div>
        <!-- 文章选项 -->
        <div class="post-info">
          <el-form label-width="85px" :model="state.form">
            <el-form-item label="创建时间：">
              <el-date-picker type="datetime" style="width: 250px" :disabled-date="disabledDate"
                popper-class="select-zindex" v-model="state.form.createDate"></el-date-picker>
            </el-form-item>
            <el-form-item label="分类：">
              <el-select v-model="state.form.cate" popper-class="select-zindex" class="optionsWidth">
                <el-option v-for="(item, index) in state.cateList" :key="index" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="浏览量：">
              <el-input
                v-model="state.form.views"
                disabled
                class="optionsWidth"
              ></el-input>
            </el-form-item> -->
            <el-form-item label="关键字：">
              <el-tag :key="tag" v-for="tag in state.dynamicTags" closable :disable-transitions="false"
                @close="handleClose(tag)">
                {{ tag }}
              </el-tag>
              <el-input class="input-new-tag" v-if="state.inputVisible" v-model="state.inputValue" ref="saveTagInput"
                @keyup.enter="handleInputConfirm" @blur="handleInputConfirm">
              </el-input>
              <el-button v-else class="button-new-tag" @click="showInput">+ 新增</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="submit-container">
      <div class="submit-bar">
        <div class="draft-tip">
          <span v-if="state.loading">
            <el-icon class="is-loading" style="margin-right: 5px">
              <Loading />
            </el-icon>
            <span>草稿保存中...</span>
          </span>
          <span v-else>草稿已于 {{ getCurrDate("") }} 自动保存成功</span>
        </div>
        <div>
          <span class="wordNum">文章字数：{{ state.form.wordsNum }}</span>
        </div>
        <div>
          <el-button :loading="state.postLoading" @click="submit(false)" type="primary">发布</el-button>
        </div>
      </div>
    </div>
    <el-dialog :title="state.draft.title" v-model="state.draft.dialogVisible" width="30%">
      <div>
        <el-table :data="state.draft.list" style="width: 100%" height="500">
          <el-table-column label="序号" type="index" width="80px"> </el-table-column>
          <el-table-column label="标题" show-overflow-tooltip>
            <template #default="scope">
              {{ scope.row.title }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createDate"> </el-table-column>
          <el-table-column label="操作" width="180">
            <template #default="scope">
              <a :href="'/#/post?from=draft&did=' + scope.row.id + '&dindex=' + scope.row.dateStamp" target="_blank"
                rel="noopener noreferrer">查看</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { Edit } from "@element-plus/icons-vue";
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



const router = useRouter();
const route = useRoute();
const id = route.query.id;
const did = route.query.did as string;
const dindex = route.query.dindex as string;
const mode = "default";
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
// 内容 HTML
const valueHtml = ref("");

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
    dateStamp: ""
  },
  cateList: [{ name: "", id: "" }],
  inputVisible: false,
  inputValue: "",
  dynamicTags: [],
  autoSaveInterval: 0,
  loading: null,
  postLoading: false,
  draft: {
    title: "查看历史记录",
    dialogVisible: false,
    list: [],
  }
});
onMounted(() => {
  if (id) {
    getDetail(id);
  } else if (did && dindex) {
    // 从草稿过来时从本地缓存获取对应内容
    setTimeout(() => {
      // 加延时，等编辑器加载完成在渲染
      getDraftFromLocalstorage(did, dindex);
    }, 1000)
  }
  getCate(id);
  if (!did) {
    // 从草稿过来的内容不开启定时保存
    autoSave();
  }

});
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  window.clearInterval(state.autoSaveInterval);
  const editor = editorRef.value;
  if (editor) {
    editor.destroy();
  }
});

const userInfo = computed(() => {
  const uinfo = localStorage.getItem("userInfo");
  if (uinfo) {
    return JSON.parse(uinfo);
  } else {
    return "";
  }
});

const disabledDate = (date: any) => {
  //  今天之后不能选择
  return date > new Date();
}

const getCate = async (id: any) => {
  const res: any = await getAdminCateValidApi({
    pageNum: 1,
    pageSize: 100,
  });
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
const getDraftFromLocalstorage = (did: string, dindex: string) => {
  let tempPostList = localStorage.getItem("tempPostList") as any;
  if (tempPostList) {
    tempPostList = JSON.parse(tempPostList)
    let indexList = tempPostList[did].filter((item: any) => {
      return item.dateStamp == dindex
    })
    // 找到当前草稿
    if (indexList.length) {
      let currPost = indexList[0]
      state.form = currPost
      editorRef.value.setHtml(state.form.content);
    }

  }
}

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
    draft: isDraft ? 1 : 0,
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
    draft: isDraft ? 1 : 0,
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
const saveToLocalStorage = () => {
  // 手动添加时间戳
  state.form.createDate = getCurrDate(new Date());
  state.form.dateStamp = String(new Date().getTime());
  let tempPostList = localStorage.getItem("tempPostList") as any;
  if (tempPostList) {
    tempPostList = JSON.parse(tempPostList)
    // 自动保存同时保存到缓存，通过内容id跟时间戳作为唯一id
    if (state.form.id) {
      if (!tempPostList[state.form.id]) {
        tempPostList[state.form.id] = []
      }
      tempPostList[state.form.id].unshift(state.form);
      // 最新保存数据排最上面
      state.draft.list = JSON.parse(JSON.stringify(tempPostList[state.form.id]))
    }
  } else {
    tempPostList = {}
  }
  localStorage.setItem("tempPostList", JSON.stringify(tempPostList))
}

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
  // 自动保存记录
  saveToLocalStorage();
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
  }, 5000);
};
const handleDraft = () => {
  state.draft.dialogVisible = true;
}
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
    position: relative;
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

  .draft-btn {
    position: absolute;
    left: -110px;
    top: 30%;
    display: flex;
    flex-direction: column;
    border: 1px solid #8590a6;
    background-color: var(--el-color-primary);
    color: #fff;
    padding: 10px;
    cursor: pointer;
    border-radius: 4px;
  }

  .draft-item {
    text-align: left;
    padding: 5px 10px;

    &.hover {
      text-decoration: underline;
    }
  }
}
</style>
