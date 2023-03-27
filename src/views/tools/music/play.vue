<template>
    <div class="bottomControl">
        <audio id="aaa" :src="musicUrl" ref="audioPlayer" autoplay @play="changeState(true)" @pause="changeState(false)"
            @ended="changeMusic('next')" @timeupdate="timeupdate"></audio>

        <!-- 中间 -->
        <div class="center">
            <div class="buttons">
                <span @click="playType = playType == 'order' ? 'random' : 'order'"><i class="iconfont icon-xunhuan"
                        v-if="playType == 'order'"></i><i class="iconfont icon-suiji1" v-else></i></span>
                <span @click="changeMusic('pre')"><i class="iconfont icon-shangyishou"></i></span>
                <span @click="changePlayState()">
                    <i v-if="state.isPlay" class="iconfont icon-zantingtingzhi"></i>
                    <i v-else class="iconfont icon-icon_play"></i>
                </span>
                <span @click="changeMusic('next')">
                    <i class="iconfont icon-xiayishou"></i>
                </span>
                <span><i class="iconfont icon-xihuan" :class="isUserLikeCurrentMusic ? 'like' : ''"
                        @click="musicList.length != 0 ? likeIt() : ''"></i></span>
            </div>
            <!-- 进度条 -->
            <div class="progressBar">
                <span class="currentTime">{{ currentTime | handleMusicTime }}</span>
                <!-- :value 是单向的  要实现双向要v-model -->
                <el-slider class="progressSlider" v-model="timeProgress" :show-tooltip="false"
                    @change="changeProgress"></el-slider>
                <span class="totalTime">{{ duration }}</span>
            </div>
        </div>
        <!-- 右边 -->
        <div class="right">
            <div class="volumeControl">
                <i class="iconfont icon-yinliang" @click="changeMutedState"></i>
                <el-slider class="volumeSlider" v-model="volume" @input="changeVolume" :show-tooltip="false"></el-slider>
            </div>
            <div class="playList" @click="openDrawer">
                <i class="iconfont icon-bofangliebiao"></i>
            </div>
            <!-- 备案信息 -->
            <el-tooltip class="item" effect="dark" placement="left" :enterable="false">
                <div v-html="recondInfo" slot="content"></div>
                <el-link type="info" href="https://beian.miit.gov.cn/" target="_blank"
                    class="recondInfo">粤ICP备2021068014号</el-link>
            </el-tooltip>
        </div>
        <!-- 抽屉 -->
        <el-drawer :visible.sync="drawer" :with-header="false" width="300">
            <div class="drawerHeader">总{{ musicList.length }}首</div>
            <el-table :data="musicList" stripe style="width: 100%" :show-header="false" @row-dblclick="clickRow"
                highlight-current-row lazy>
                <el-table-column prop="name" width="150px"> </el-table-column>
                <el-table-column prop="ar[0].name" width="80px"> </el-table-column>
                <el-table-column prop="dt" width="70px"> </el-table-column>
            </el-table>
        </el-drawer>
    </div>
</template>
  
<script>
import { handleMusicTime, returnSecond } from "@/utils/utils.js";
let lastSecond = 0;
// 总时长的秒数
let durationNum = 0;
// 保存当前音量
let volumeSave = 0;
// 当前音乐类型，用于下载
let musicType = "";

export default {
    name: "BottomControl",
    data() {
        return {
            musicDetail: {},
            musicUrl: "http://m7.music.126.net/20230328000405/19e9a25803fb1535ec3141804cae9282/ymusic/1358/d103/c9bf/b209db455243dcce97d23d5990ace62a.mp3",
            musicList: [
                { name: "asdf", id: 1, url: "http://m7.music.126.net/20230328000405/19e9a25803fb1535ec3141804cae9282/ymusic/1358/d103/c9bf/b209db455243dcce97d23d5990ace62a.mp3" }
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
            recondInfo: `仅供学习使用, 侵权必删!`,
            // 播放模式（顺序播放，随机播放）
            // order random
            playType: "order",
            state: {
                isPlay: false
            }
        };
    },
    mounted() {
        this.musicDetail = this.musicList[0]
        // get music duration
        var myVid = document.getElementById("aaa");
        let _this = this
        if (myVid != null) {
            var duration;
            myVid.load();
            myVid.oncanplay = function () {
                durationNum = myVid.duration
                _this.duration = durationNum
            }
        }
    },
    methods: {
        // 请求
        // 请求歌曲的url
        async getMusicDetail(id) {
            this.$store.commit("updateMusicLoadState", true);
            let result = await this.$request("/song/url", { id });
            // console.log(musicDetail);
            // console.log(result);
            // 获取不到url
            if (result.data.data[0].url == null) {
                this.$message.error("该歌曲暂无版权，将为您播放下一首歌曲");
                this.changeMusic("next");
                return;
            }
            this.musicUrl = result.data.data[0].url;
            musicType = result.data.data[0].type.toLowerCase();
            this.$store.commit("updateMusicLoadState", false);
        },

        // 点击播放键的回调
        changePlayState() {
            !this.state.isPlay ? this.playMusic() : this.pauseMusic();
        },
        // 播放音乐的函数
        playMusic() {
            this.$refs.audioPlayer.play();
        },
        // 暂停音乐的函数
        pauseMusic() {
            this.$refs.audioPlayer.pause();
        },
        // audio开始或暂停播放的回调  在vuex中改变状态
        changeState(state) {
            this.state.isPlay = state;
        },
        // 根据id找到 musicList中对应的musicDetail
        getMusicDetailFromMusicList() {

            let index = this.musicList.findIndex(
                (item) => item.id == this.$store.state.musicId
            );
            console.log(index);
            if (index != -1) {
                // 记录当前音乐的index
                this.currentMusicIndex = index;
                // 将索引传至vuex
                this.$store.commit("updateCurrentIndex", index);
                this.musicDetail = this.musicList[index];
                // 直接从audio标签中的duration属性拿时长会有请求时差问题，所以直接在musicInfo中拿
                this.duration = this.musicList[index].dt;
            }
        },
        // 切歌函数
        changeMusic(type, id) {
            if (type == "click") {
                // 点击抽屉row进行切歌
                this.$store.commit("updateMusicId", id);
            } else if (type == "pre") {
                let currentMusicIndex = this.currentMusicIndex;
                let preIndex;
                if (this.playType == "order") {
                    preIndex =
                        currentMusicIndex - 1 < 0
                            ? this.musicList.length - 1
                            : currentMusicIndex - 1;
                } else if (this.playType == "random") {
                    if (this.musicList.length == 1) {
                        preIndex = currentMusicIndex;
                    } else {
                        // Math.floor(Math.random()*10); 可均衡获取0到9的随机整数。
                        preIndex = currentMusicIndex;
                        while (preIndex == currentMusicIndex) {
                            preIndex = Math.floor(Math.random() * this.musicList.length);
                        }
                    }
                }
                console.log(this.musicList[preIndex].id);
                this.$store.commit("updateMusicId", this.musicList[preIndex].id);
            } else if (type == "next") {
                let currentMusicIndex = this.currentMusicIndex;
                let nextIndex;
                if (this.playType == "order") {
                    nextIndex =
                        currentMusicIndex + 1 == this.musicList.length
                            ? 0
                            : currentMusicIndex + 1;
                } else if (this.playType == "random") {
                    if (this.musicList.length == 1) {
                        nextIndex = currentMusicIndex;
                    } else {
                        // Math.floor(Math.random()*10); 可均衡获取0到9的随机整数。
                        nextIndex = currentMusicIndex;
                        while (nextIndex == currentMusicIndex) {
                            nextIndex = Math.floor(Math.random() * this.musicList.length);
                        }
                    }
                }
                // console.log(this.musicList[nextIndex].id);
                this.$store.commit("updateMusicId", this.musicList[nextIndex].id);
            }
        },
        // 双击抽屉列表中的row的回调
        clickRow(row) {
            // console.log(row.id);
            this.changeMusic("click", row.id);
        },
        // 当前播放时间位置
        timeupdate() {
            // 节流
            let time = this.$refs.audioPlayer.currentTime;
            // 将当前播放时间保存到vuex  如果保存到vuex这步节流,会导致歌词不精准,误差最大有1s
            // this.$store.commit("updateCurrentTime", time);

            time = Math.floor(time);
            if (time !== lastSecond) {
                // console.log(time);
                lastSecond = time;
                this.currentTime = time;
                // 计算进度条的位置
                this.timeProgress = Math.floor((time / durationNum) * 100);
                // console.log(this.timeProgress);
            }
        },
        // 拖动进度条的回调
        changeProgress(e) {
            // console.log(e);
            // 修改当前播放时间
            this.currentTime = Math.floor((e / 100) * durationNum);
            // 改变audio的实际当前播放时间
            this.$refs.audioPlayer.currentTime = this.currentTime;
        },
        // 拖动音量条的回调
        changeVolume(e) {
            // 改变audio的音量
            // input事件 实时触发
            this.$refs.audioPlayer.volume = e / 100;
            if (this.isMuted && e > 0) {
                this.isMuted = false;
            } else if (e == 0 && this.isMuted == false) {
                this.isMuted = true;
            }
        },
        // 点击小喇叭的回调 （切换静音状态）
        changeMutedState() {
            if (this.isMuted) {
                this.volume = volumeSave;
            } else {
                volumeSave = this.volume;
                this.volume = 0;
            }
            console.log(volumeSave, this.isMuted);
            this.isMuted = !this.isMuted;
        },
        // 操作drawerList中DOM的函数
        handleDrawerListDOM(currentIndex, lastIndex) {
            // 目前没什么好思路 直接操作原生DOM
            this.$nextTick(() => {
                let tableRows = document
                    .querySelector(".bottomControl")
                    .querySelectorAll(".el-table__row");
                // // 直接修改dom样式的颜色无效  可能是因为第三方组件 style scoped的原因
                // // 通过引入全局样式解决
                if (tableRows[currentIndex]) {
                    tableRows[currentIndex].children[0]
                        .querySelector(".cell")
                        .classList.add("currentRow");
                    tableRows[currentIndex].children[1]
                        .querySelector(".cell")
                        .classList.add("currentRow");
                }
                if (
                    (lastIndex && lastIndex != -1 && tableRows[lastIndex]) ||
                    lastIndex == 0
                ) {
                    // 将上一首的类名删掉
                    tableRows[lastIndex].children[0]
                        .querySelector(".cell")
                        .classList.remove("currentRow");
                    tableRows[lastIndex].children[1]
                        .querySelector(".cell")
                        .classList.remove("currentRow");
                }
            });
        },
        // 点击打开抽屉的回调
        openDrawer() {
            // 关闭也是这个回调，所以直接取反
            this.drawer = !this.drawer;
            this.hasDrawerOpend = true;
            this.handleDrawerListDOM(this.currentMusicIndex);
        },



        // 点击下载按钮的回调
        downloadCurrentMusic() {
            // console.log("download");
            console.log(this.musicDetail, this.musicUrl);

            // 匹配资源的域名
            let url = this.musicUrl.match(/\http.*?\.net/);
            // 匹配域名名称，并匹配对应的代理
            let serve = url[0].match(/http:\/(\S*).music/)[1];
            if (
                serve != "/m7" &&
                serve != "/m701" &&
                serve != "/m8" &&
                serve != "/m801"
            ) {
                // 没有对应的代理
                this.$message.error("匹配不到对应的代理,下载失败!");
                return;
            }
            // 截取后面的参数
            let params = this.musicUrl.slice(url[0].length);

            let downloadMusicInfo = {
                url: serve + params,
                name:
                    this.musicDetail.name +
                    " - " +
                    this.musicDetail.ar[0].name +
                    "." +
                    musicType,
            };

            console.log(downloadMusicInfo);
            this.$store.commit("updateDownloadMusicInfo", downloadMusicInfo);
        },


    },

    watch: {
        // 监听播放状态
        "state.isPlay"(isPlay) {
            if (isPlay) {
                this.playMusic();
            } else {
                this.pauseMusic();
            }
        },
    },
};
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

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 5px;
    overflow: hidden;
    margin-right: 10px;
    cursor: pointer;
}

.avatar img {
    width: 100%;
}

.left {
    display: flex;
    align-items: center;
    width: 123px;
}

.musicInfo {
    color: rgb(37, 37, 37);
    font-size: 12px;
    width: 70px;
}

.musicName {
    margin-bottom: 4px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.singer {
    transform: scale(0.9);
    margin-left: -3px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
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

.recondInfo {
    position: absolute;
    font-size: 12px;
    transform: scale(0.8);
    width: 140px;
    right: -5px;
    bottom: -5px;
}

.center .icon-suiji1 {
    font-size: 15px;
}

/deep/.el-slider__button {
    width: 10px !important;
    height: 10px !important;
}
</style>