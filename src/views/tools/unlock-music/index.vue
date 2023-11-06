<template>
    <searchHeader :title="'加密音乐文件解密'"></searchHeader>
    <el-alert :title="desc" type="success" class="dailySentence" />
    <iframe src="./static/unlock-music/index.html" frameborder="0" width="100%" height="1000px"></iframe>
</template>
<script lang="ts" setup>
import searchHeader from "../../components/searchHeader.vue";
const desc = "将网易/酷狗等vip 加密后的音乐文件（如.ncm）下载后通过该工具转成能正常打开的mp3文件"
</script>