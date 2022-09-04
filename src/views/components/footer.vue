<template>
  <div class="footer">
    <!-- <span v-html="copyRight"></span>copyRight {{currentDate}} <a href="http://beian.miit.gov.cn/"> 粤ICP备20013202号</a> -->
    <span v-html="copyRight"></span> {{ currentDate }} javascript技术分享
  </div>
</template>
<script lang="ts">
export default {
  // 子组件
  components: {},
  // 父组件传递过来的参数
  props: [],
  // 当前用到的参数
  data() {
    return {
      copyRight: "&copy",
      currentDate: new Date().getFullYear(),
    };
  },
  // 当前定义的计算属性
  computed: {},
  // 监听属性
  watch: {},
  // 生命周期钩子---创建前
  created() {},
  // 当前定义的函数
  methods: {},
};
</script>
<style lang="scss" scoped>
.footer {
  bottom: 20px;
  margin-top: 20px;
  padding: 20px 0;
  text-align: center;
}
</style>
