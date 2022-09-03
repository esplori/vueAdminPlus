<template>
  <div class='carousel-container'>
      <el-carousel :interval="5000" arrow="always" :height="355">
        <el-carousel-item v-for="(item, index) in list" :key="index">
          <img :src="item.url" alt="" height="355px">
        </el-carousel-item>
      </el-carousel>
  </div>
</template>
<script>
export default {
  // 子组件
  components: {
  },
  // 父组件传递过来的参数
  props: [],
  // 当前用到的参数
  data () {
    return {
      list: [
        { url: '/uploadFile/6747983f-9661-439f-8656-44e305896989.png' }
      ]
    }
  },
  // 当前定义的计算属性
  computed: {
  },
  // 监听属性
  watch: {},
  // 生命周期钩子---创建前
  created () {
  },
  // 当前定义的函数
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.carousel-container{
  margin-top: 20xp;
  padding: 20px 0;
  text-align: center;
}
</style>
