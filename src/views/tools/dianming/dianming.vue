<template>
  <div class="dianming">
    <div>
      总人数：<span>{{ state.students.length }}</span> 人，共抽取：
      <el-input v-model="state.size" style="width: 75px"></el-input> 位
    </div>
    <div style="padding: 20px 0">
      <el-button type="primary" style="width: 250px" @click="onBtnClick()">
        {{ btnText }}
      </el-button>
    </div>
    <div>
      <ul style="
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-flow: row wrap;
        ">
        <li v-for="(v, i) in state.students" :key="i"
          :class="{ active: state.selectedStudentIndexs.includes(i as never) }">
          {{ v }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, computed } from "vue";
const state = reactive({
  students: [
    "张三",
    "李四",
    "王五",
    "阿福",
    "旺财",
    "小米",
    "小红",
    "白白",
    "小天",
    "赵六",
    "晓晴",
    "吴浩",
    "阿勇",
    "王武",
    "江山",
    "天下",
    "阮天",
    "萌萌",
    "芒果",
    "卿苑",
    "青柠",
    "青鸢",
    "苹芃",
    "小妮",
    "子依",
    "点点",
    "贤贤",
    "青鸢",
    "苹芃",
    "小妮",
    "子依",
    "点点",
    "贤贤",
    "青鸢",
    "苹芃",
    "小妮",
    "子依",
    "点点",
    "贤贤",
    "青鸢",
    "苹芃",
    "小妮",
    "子依",
    "点点",
    "贤贤",
    "青鸢",
    "苹芃",
    "小妮",
    "子依",
    "点点",
    "贤贤",
    "青鸢",
    "苹芃",
    "小妮",
    "子依",
    "点点",
    "贤贤",
    "青鸢",
    "苹芃",
    "小妮",
    "子依",
    "点点",
    "贤贤",
    "青鸢",
    "苹芃",
    "小妮",
    "子依",
    "点点",
    "贤贤",
  ],
  studentIndexs: [],
  size: 1,
  selectedStudentIndexs: [],
  intervalId: null,
});

onMounted(() => {
  const index = state.students.map((v, i) => i);
  state.students.sort(() => 0.5 - Math.random());
  state.studentIndexs = index as any;
});
const btnText = computed(() => {
  return state.intervalId ? "停止" : "开始";
});

const onBtnClick = () => {
  // 已开启，需要停止
  if (state.intervalId) {
    clearInterval(state.intervalId);
    state.intervalId = null;
  } else {
    // 未开启，需要开启
    state.intervalId = setInterval(() => {
      state.selectedStudentIndexs = state.studentIndexs
        .sort(() => 0.5 - Math.random())
        .slice(0, state.size);
    }, 300) as any;
  }
};
</script>

<style scoped lang="scss">
.dianming {
  background: #fff;
  padding: 20px;
  display: flex;
  flex-flow: column;
  align-items: center;
  color: #333;
  height: 700px;

  li {
    margin: 10px;
    padding: 10px;
    border: 1px solid gray;
    border-radius: 5px;
  }

  .active {
    background-color: #333;
    color: #fff;
    /* 2D转换的属性名 */
    transform: scale(1.2);
    /* 过渡效果的属性名 */
    transition: transform 0.3s;
    /* 位移，属于transform的属性值 */
    /* translate */
  }
}
</style>
