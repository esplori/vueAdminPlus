<template>
    <searchHeader :title="'小游戏'"></searchHeader>
    <iframe src="https://source.dsiab.com/games/index.html" frameborder="0" width="100%" :height="windowWidth"></iframe>
</template>
<script lang="ts" setup>
import searchHeader from "../../components/searchHeader.vue";
let windowWidth = window.innerHeight 
</script>