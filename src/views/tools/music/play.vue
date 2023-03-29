<template>
    <div class="bottomControl">
        <audio id="audioPlayer" ref="audioPlayerRef" :src="state.musicUrl" autoplay @play="changeState(true)"
            @pause="changeState(false)" @ended="changeMusic('next')" @timeupdate="timeupdate">
        </audio>
        <div class="left">
            <div class="musicInfo">
                <div class="musicName">
                    {{ state.musicDetail.name }}
                </div>
                <div class="singer">
                    {{ state.musicDetail.singerName }}
                </div>
            </div>
        </div>
        <!-- 中间 -->
        <div class="center">
            <div class="buttons">
                <span @click="state.playType = state.playType == 'order' ? 'random' : 'order'">
                    <i class="iconfont icon-xunhuan" v-if="state.playType == 'order'"></i>
                    <i class="iconfont icon-suiji1" v-else></i>
                </span>
                <span @click="changeMusic('pre')"><i class="iconfont icon-shangyishou"></i></span>
                <span @click="changePlayState()">
                    <i v-if="state.isPlay" class="iconfont icon-zantingtingzhi"></i>
                    <i v-else class="iconfont icon-icon_play"></i>
                </span>
                <span @click="changeMusic('next')">
                    <i class="iconfont icon-xiayishou"></i>
                </span>
                <span>
                    <i class="iconfont icon-xihuan" :class="state.isUserLikeCurrentMusic ? 'like' : ''"
                        @click="state.musicList.length != 0 ? likeIt() : ''">
                    </i>
                </span>
            </div>
            <!-- 进度条 -->
            <div class="progressBar">
                <span class="currentTime">{{ handleMusicTime(state.currentTime) }}</span>
                <!-- :value 是单向的  要实现双向要v-model -->
                <el-slider class="progressSlider" v-model="state.timeProgress" :show-tooltip="false"
                    @change="changeProgress"></el-slider>
                <span class="totalTime">{{ handleMusicTime(state.duration) }}</span>
            </div>
        </div>
        <!-- 右边 -->
        <div class="right">
            <div class="volumeControl">
                <i class="iconfont icon-yinliang" @click="changeMutedState"></i>
                <el-slider class="volumeSlider" v-model="state.volume" @input="changeVolume"
                    :show-tooltip="false"></el-slider>
            </div>
            <div class="playList" @click="openDrawer">
                <i class="iconfont icon-bofangliebiao"></i>
            </div>
        </div>
        <!-- 抽屉 -->
        <el-drawer :visible.sync="state.drawer" :with-header="false" width="300">
            <div class="drawerHeader">总{{ state.musicList.length }}首</div>
            <el-table :data="state.musicList" stripe style="width: 100%" :show-header="false" @row-dblclick="clickRow"
                highlight-current-row lazy>
                <el-table-column prop="name" width="150px"> </el-table-column>
                <el-table-column prop="ar[0].name" width="80px"> </el-table-column>
                <el-table-column prop="dt" width="70px"> </el-table-column>
            </el-table>
        </el-drawer>
    </div>
</template>
  
<script lang="ts" setup>

import { handleMusicTime } from "../../../utils/utils";
import { reactive, onMounted, watch, ref } from "vue";
let lastSecond = 0;

// 保存当前音量
let volumeSave = 0;

let state = reactive({
    musicDetail: {
    },
    musicUrl: "http://m7.music.126.net/20230328000405/19e9a25803fb1535ec3141804cae9282/ymusic/1358/d103/c9bf/b209db455243dcce97d23d5990ace62a.mp3",
    musicList: [
        { singerName: "tsffffffffffffffffffffffffffss",name: "asdf99999999999999999999999999999", id: 1, url: "http://m7.music.126.net/20230328000405/19e9a25803fb1535ec3141804cae9282/ymusic/1358/d103/c9bf/b209db455243dcce97d23d5990ace62a.mp3" }
    ],
    currentMusicIndex: 0,
    drawer: false,
    // 音乐总时长
    duration: "00:00",
    // 当前播放时间位置
    currentTime: 0,
    // 进度条的位置
    timeProgress: 0,
    // 音量
    volume: 30,
    // 是否静音
    isMuted: false,
    // 抽屉是否被打开过（如果没打开过，里面的数据是不会渲染的）
    hasDrawerOpend: false,
    // 用户的喜欢音乐列表
    likeMuiscList: [],
    // 用户是否喜欢当前音乐
    isUserLikeCurrentMusic: false,
    // 播放模式（顺序播放，随机播放）
    // order random
    playType: "order",
    isPlay: false,
    // 总时长的秒数
    durationNum: 0
})

let audioPlayerRef = ref()


debugger

onMounted(() => {
    state.musicDetail = state.musicList[0]
    // get music duration
    let myVid = audioPlayerRef.value;

    audioPlayerRef = myVid

    if (myVid != null) {
        myVid.load();
        myVid.oncanplay = function () {
            state.durationNum = myVid.duration
            state.duration = state.durationNum
        }
    }
})


const changePlayState = () => {
    !state.isPlay ? playMusic() : pauseMusic();
}
// 播放音乐的函数
const playMusic = () => {
    audioPlayerRef.play();
}
// 暂停音乐的函数
const pauseMusic = () => {
    audioPlayerRef.pause();
}

// audio开始或暂停播放的回调  在vuex中改变状态
const changeState = (status: boolean) => {
    state.isPlay = status;
}

// 当前播放时间位置
const timeupdate = () => {
    // 节流
    let time = audioPlayerRef.currentTime;
    // 将当前播放时间保存到vuex  如果保存到vuex这步节流,会导致歌词不精准,误差最大有1s
    // this.$store.commit("updateCurrentTime", time);

    time = Math.floor(time);
    if (time !== lastSecond) {
        // console.log(time);
        lastSecond = time;
        state.currentTime = time;
        // 计算进度条的位置
        state.timeProgress = Math.floor((time / state.durationNum) * 100);
        // console.log(this.timeProgress);
    }
}
// 拖动进度条的回调
const changeProgress = (val: number) => {
    // console.log(e);
    // 修改当前播放时间
    state.currentTime = Math.floor((val / 100) * state.durationNum);
    // 改变audio的实际当前播放时间
    audioPlayerRef.currentTime = state.currentTime;
}
// 拖动音量条的回调
const changeVolume = (val: number) => {
    // 改变audio的音量
    // input事件 实时触发
    audioPlayerRef.volume = val / 100;
    if (state.isMuted && val > 0) {
        state.isMuted = false;
    } else if (val == 0 && state.isMuted == false) {
        state.isMuted = true;
    }
}
// 点击小喇叭的回调 （切换静音状态）
const changeMutedState = () => {
    if (state.isMuted) {
        state.volume = volumeSave;
    } else {
        volumeSave = state.volume;
        state.volume = 0;
    }

    state.isMuted = !state.isMuted;
}


watch(state.isPlay, (newVal, oldVal) => {
    // if (newVal) {
    //     playMusic();
    // } else {
    //     pauseMusic();
    // }
})


</script>
  
<style scoped>
.bottomControl {
    /* background-color: pink; */
    border-top: 1px solid #ddd;
    width: 100%;
    height: 55px;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    padding: 6px 10px;
    z-index: 10000;
    background-color: #fff;
}

.center {
    margin-top: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.buttons {
    display: flex;
    align-items: center;
    height: 13px;
}

.buttons i {
    font-size: 20px;
    color: #313131;
}

.buttons span:nth-child(3) i {
    font-size: 25px;
}

.center .icon-xunhuan {
    font-size: 17px;
}

.center .icon-xihuan {
    font-size: 15px;
}

.right {
    display: flex;
    align-items: center;
    position: relative;
}

.volumeControl {
    display: flex;
    align-items: center;
    margin-right: 15px;
}

.icon-yinliang {
    font-size: 18px;
    margin-right: 7px;
}

.volumeSlider {
    width: 55px;
}

.icon-bofangliebiao {
    font-size: 18px;
    margin-right: 10px;
}

.progressSlider {
    width: 300px;
}

.buttons span {
    display: inline-block;
    width: 50px;
    box-sizing: border-box;
    text-align: center;
}

.icon-zantingtingzhi {
    font-size: 35px !important;
}

.drawerHeader {
    font-size: 12px;
    transform: scale(0.9);
    color: #aaa;
    padding: 15px 0;
}

.progressBar {
    display: flex;
    align-items: center;
}

.currentTime,
.totalTime {
    font-size: 12px;
    transform: scale(0.85);
    color: #aaa;
    margin: 0 5px;
    width: 30px;
    text-align: center;
}

.progressBar {
    height: 10px;
    margin-top: 12px;
    overflow: hidden;
}

.like {
    color: #ec4141 !important;
}

.downloadContainer {
    height: 100%;
    position: relative;
}

.downloadContainer i {
    position: absolute;
    bottom: 5px;
}


.center .icon-suiji1 {
    font-size: 15px;
}

:deep(.el-slider__button) {
    width: 10px !important;
    height: 10px !important;
}
</style>