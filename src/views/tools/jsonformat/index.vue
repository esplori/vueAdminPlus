<template>
    <searchHeader :title="'json格式化'"></searchHeader>
    <div class="tip-box">
        <el-alert v-show="state.showErrorMsg" :title="state.tipmsg" :type="state.alertType" />
    </div>
    <div class="container">
        <div class="origin-json">
            <el-input @change="inputChange" type="textarea" :rows="20" v-model="state.originJsonData"></el-input>
        </div>
        <json-viewer :value="state.jsonData" :expand-depth=5 copyable boxed sort class="format-json"></json-viewer>
    </div>
</template>
  
<script setup lang="ts">
import { reactive, onMounted, watchEffect } from "vue";
import JsonViewer from "vue-json-viewer";
import searchHeader from "../../components/searchHeader.vue";
const state = reactive({
    originJsonData: '',
    testJsonData: '{"code":0,"msg":"查询成功","data":{"username":"test","password":"","role":"ROLE_author","nickname":"i am a test user","userdesc":"developer","avatar":"icom","token":null}}',
    jsonData: {},
    showErrorMsg: true,
    tipmsg: "请输入json格式数据",
    alertType: "success",
    activeIndex: '1'
})
const handler = () => {
    if (!state.originJsonData) {
        state.tipmsg = '请输入json格式数据'
        return
    }
    try {
        state.jsonData = JSON.parse(state.originJsonData);
        state.tipmsg = '解析成功'
        state.alertType = "success"
    } catch (error) {
        state.tipmsg = 'json数据格式不正确'
        state.alertType = "error"
    }
};
const inputChange = (val:String) => {
    if (!val) {
        state.tipmsg = '请输入json格式数据'
    }
}
onMounted(() => {
    handler();
});

watchEffect(() => {
    handler();
});
</script>
<style scoped>
a {
    text-decoration: none;
}

.tip-box {
    height: 45px;
    margin-top: 10px;
    margin-bottom: 10px;
}

.container {
    width: 100%;
    display: flex;
    justify-content: space-between;
}

.origin-json {
    width: 49%;
    border-radius: 6px;

}

.origin-json textarea {
    border-radius: 6px;
}

.origin-json:hover {
    border-color: #409eff;
}

.format-json {
    box-sizing: border-box;
    width: 49%;
    height: 430px;
}

.format-json:hover {
    box-sizing: border-box;
    border: 1px solid #409eff !important;
}
</style>
  