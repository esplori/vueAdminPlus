<template>
    <div class="sd-list">
        <searchHeader :title="'作品灵感'"></searchHeader>
        <div id="masonryBox">
            <div v-for="(item, index) in state.list" class="masonry-item">
                <!-- <div :style="item.style">{{ index }}</div> -->
                <img :src="item.url" alt=""
                    style="max-width: 300px;height: 100%;border-radius: 10px;">
            </div>
            <div style="clear:both"></div>
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { getListApi } from "./API";
import { reactive, onMounted, nextTick } from "vue";
import searchHeader from "../components/searchHeader.vue";
const state = reactive({
    list: [],
    params: {
        page: 1,
        pageSize: 10,
    },
    total: 0,
});
onMounted(() => {
    // generateData()
    getList()

});
// const generateData = () => {
//     for (let index = 0; index < 50; index++) {
//         state.list.push({
//             style: `height:${Math.random() * 200 + 50 + Math.random() * 200}px;background-color:rgba(${Math.random() * 230}, ${Math.random() * 230},${Math.random() * 230},0.5)`
//         })
//     }
// }

const addScrollEvent = () => {
    // let iddom = document.getElementsByClassName('content-container')[0];
    let iddom = document.documentElement;
    window.addEventListener('scroll', function () {
        debugger
        var scrollHeight = parseFloat(iddom.scrollHeight);
        var scrollTop = parseInt(iddom.scrollTop);
        var height = parseFloat(iddom.offsetHeight);
        console.log(scrollTop, scrollHeight, height);

        if ((scrollTop + height) >= scrollHeight - 1) {
            // 到底了
            // generateData()
            getList();
        }
    })

}
const getList = async () => {
    const res: any = await getListApi(state.params);
    if (res) {
        state.list = state.list.concat(res.data);
        state.total = res.data.length;
        nextTick(() => {
            imgLocation('masonryBox', 'masonry-item')
            addScrollEvent()
        })
    }
};

const handleSizeChange = (val: any) => {
    state.params.pageSize = val;
    getList();
};

const handleCurrentChange = (val: any) => {
    state.params.page = val;
    getList();
};
const getChildElement = (parent, content) => {
    var contentArr = []
    var allContent = parent.getElementsByTagName('div') //[xxxx数组]
    //遍历allContent 把中其类名为 content 的容器都存到contentArr数组中
    for (var i = 0; i < allContent.length; i++) {
        //当前这个容器的类名是否为 content
        if (allContent[i].className == content) {
            contentArr.push(allContent[i])
        }
    }
    return contentArr
}


//获取到所有要摆放的图片
const imgLocation = (parent, content) => {
    var cparent = document.getElementById(parent)
    // cparent 下的所有的第一层的子容器 box
    var ccontent = getChildElement(cparent, content)  //[装了20个div]
    debugger
    //找从谁开始是需要被摆放位置的
    var winWidth = document.documentElement.clientWidth //获取视窗的宽度
    // var winWidth = 934 //获取视窗的宽度
    var imgWidth = ccontent[0].offsetWidth              //获取图片盒子的宽度
    var num = Math.floor(winWidth / imgWidth)           //向下取整

    // 操作第 num+1 张图
    var BoxHeightArr: any[] = []
    for (var i = 0; i < ccontent.length; i++) {
        // 前num张只要计算高度
        if (i < num) {
            BoxHeightArr[i] = ccontent[i].offsetHeight
        } else {
            //我们要操作的Box
            var minHeight = Math.min.apply(null, BoxHeightArr)
            var minIndex = BoxHeightArr.indexOf(minHeight)

            ccontent[i].style.position = 'absolute'
            ccontent[i].style.top = minHeight + 'px'
            ccontent[i].style.left = (imgWidth * minIndex) + 'px'

            //更新最矮的那一列的高度
            BoxHeightArr[minIndex] = BoxHeightArr[minIndex] + ccontent[i].offsetHeight
        }
    }
    console.log("BoxHeightArr", BoxHeightArr);

}
</script>

<style scope>
#masonryBox {
    position: relative;
    width: 100%;
    height: 1000px
}

.masonry-item {
    width: 312px;
    padding: 5px;
    /* border: 1px solid #ccc; */
    float: left;

    /* img {
        width: 100%;
    } */
}
</style>
  