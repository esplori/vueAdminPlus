<template>
    <div class="handler">
        <span class="tab-cus-title">{{ propsState.title }}<i></i></span>
        <div><slot></slot></div>
    </div>
</template>
<script lang="ts" setup>
const propsState = defineProps(["title"]);
</script>
<style lang="scss" scoped>
.handler {
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .tab-cus-title {
        position: relative;
        color: var(--el-color-primary);

        i {
            position: absolute;
            width: 100%;
            height: 1px;
            bottom: -12px;
            left: 0;
            border: 1px solid var(--el-color-primary);
        }
    }
}
</style>
  
