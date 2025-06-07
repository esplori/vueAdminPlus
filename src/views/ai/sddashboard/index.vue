<template>
    <div class="sd-list">
        <searchHeader :title="'作品灵感'">
            <div class="select-by-cate">
                <div class="pdding">
                    <el-input v-model="state.params.tag" placeholder="输入关键字搜索" @change="tagChange" clearable></el-input>
                </div>
                <span class="pdding"><el-button type="primary" @click="insert">发布</el-button></span>
            </div>
        </searchHeader>
        <div id="masonryBox">
            <div v-for="(item, index) in state.list" class="masonry-item">
                <el-image
                    :style="'max-width:' + item.fit_width  + 'px;height: ' + item.fit_height + 'px;border-radius: 10px;'"
                    :src="item.url" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" lazy :preview-src-list="[item.url]"
                    hide-on-click-modal :initial-index="0" @click="updateView(item.id)" fit="cover" />
                <div class="el-icon-view-bottom"><el-icon>
                        <View />
                    </el-icon><span class="imgs-views">{{ item.views }}</span></div>
            </div>
            <div style="clear:both"></div>
        </div>
        <el-dialog title="提示" v-model="state.dialogVisible" width="30%">
            <el-upload class="upload-demo" drag :action="sdUploadApi()" multiple :headers="headers">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <template #tip>
                    <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </template>
            </el-upload>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="state.dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="refresh">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { getListApi, sdUploadApi, getDetailUpdateViewApi } from "./API";
import { reactive, onMounted, nextTick, computed, onBeforeUnmount } from "vue";
import { debounce } from "lodash"
import searchHeader from "@/views/components/searchHeader.vue";
import { View } from "@element-plus/icons-vue";
type stateType = {
    dialogVisible: boolean,
    list: [
        { url: string, fit_width: string, fit_height: string }
    ],
    params: {
        pageNum: number,
        pageSize: number,
        tag: string
    },
    total: number
}
const state: stateType = reactive({
    dialogVisible: false,
    list: [{ url: "", fit_width: "", fit_height: "" }],
    params: {
        pageNum: 1,
        pageSize: 30,
        tag: ""
    },
    total: 0,
    srcList: []
});
onMounted(() => {
    let masonryBox = document.getElementById("masonryBox") as any
    masonryBox.style.height = document.documentElement.clientHeight - 110 + "px"
    addScrollEvent()
    addResizeEvent()
    getList()

});
const headers = computed(() => {
    let userinfo = localStorage.getItem("userInfo") as any;
    if (userinfo) {
        userinfo = JSON.parse(userinfo);
        return { Authorization: userinfo.token };
    }
    return { Authorization: "" };
});
const insert = () => {
    state.dialogVisible = true
}
const refresh = () => {
    state.params.pageNum = 1
    getList()
    state.dialogVisible = false
}
const scrollEvent = () => {
    let iddom = document.getElementById("masonryBox") as any
    let clientHeight = iddom.clientHeight;
    let docHeight = iddom.scrollHeight;
    let scrollTop = iddom.scrollTop;
    console.log(docHeight, clientHeight, scrollTop);
    // 有时候可以值会相差0.7，通过math.ceil 解决
    if (clientHeight + Math.ceil(scrollTop) == docHeight) {
        console.log("到底了");
        handleCurrentChange(++state.params.pageNum)
    }
}
const addScrollEvent = () => {
    let masonryBox = document.getElementById("masonryBox") as any
    masonryBox.addEventListener('scroll', scrollEvent)

}
const getList = async () => {
    const res: any = await getListApi(state.params);
    if (res) {
        if (state.params.pageNum == 1) {
            state.list = res.data.result;
        } else {
            // 不是第一页就合并
            state.list = state.list.concat(res.data.result) as any;
        }
        state.total = res.data.total;
        nextTick(() => {
            imgLocation('masonryBox', 'masonry-item')
        })
    }
};
// debounce 使用方法跟正常函数有一些差异
const handleCurrentChange = debounce(function (val: any) {
    // 滚动分页
    state.params.pageNum = val;
    getList();
}, 1000);
const getChildElement = (parent: any, content: string) => {
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
const imgLocation = (parent: string, content: string) => {
    var cparent = document.getElementById(parent)
    // cparent 下的所有的第一层的子容器 box
    var ccontent = getChildElement(cparent, content)
    //找从谁开始是需要被摆放位置的

    // var winWidth = document.documentElement.clientWidth //获取视窗的宽度
    var winWidth = document.querySelector(".sd-list")?.clientWidth as any
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
const addResizeEvent = () => {
    // 监听窗口大小变化
    window.addEventListener('resize', function () {
        var cparent = document.getElementById("masonryBox")
        var ccontent = getChildElement(cparent, 'masonry-item')
        if (ccontent) {
            ccontent.forEach((item: any) => {
                item.style.position = 'static'
                item.style.top = 0
                item.style.left = 0
            })
        }
        nextTick(() => {
            imgLocation('masonryBox', 'masonry-item')
        })
    })
}
const tagChange = () => { }

onBeforeUnmount(() => {
    window.removeEventListener('scroll', scrollEvent)
})
const updateView = async (id: string) => {
    const res: any = await getDetailUpdateViewApi({ id });
}
</script>

<style scope lang="scss">
#masonryBox {
    position: relative;
    /* max-width: 1200px; */
    margin: 0 auto;
    overflow-x: auto;
}

.masonry-item {
    max-width: 274px;
    padding: 5px;
    /* border: 1px solid #ccc; */
    float: left;
    position: relative;
    .el-icon-view-bottom {
        position: absolute;
        bottom: 11px;
        border-radius: 10px;
        width: 96%;
        height: 40px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 10px;
        /* background-color: rgba(0, 0, 0, 0.5); */
        background-image: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));

        .imgs-views {
            margin-left: 5px;
        }
    }
}

.sd-list {
    padding: 20px;
}
</style>