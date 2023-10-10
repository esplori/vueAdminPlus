import wordMapJson from "./wordMap.json"
import * as echarts from "echarts";
export function getCurrDate(val: any) {
  let currVal = val;
  if (!currVal) {
    currVal = new Date().getTime();
  }
  const date =
    new Date(currVal).getFullYear() +
    "-" +
    (new Date(currVal).getMonth() + 1 < 10
      ? "0" + (new Date(currVal).getMonth() + 1)
      : new Date(currVal).getMonth() + 1) +
    "-" +
    (new Date(currVal).getDate() < 10
      ? "0" + new Date(currVal).getDate()
      : new Date(currVal).getDate()) +
    " " +
    (new Date(currVal).getHours() < 10
      ? "0" + new Date(currVal).getHours()
      : new Date(currVal).getHours()) +
    ":" +
    (new Date(currVal).getMinutes() < 10
      ? "0" + new Date(currVal).getMinutes()
      : new Date(currVal).getMinutes()) +
    ":" +
    (new Date(currVal).getSeconds() < 10
      ? "0" + new Date(currVal).getSeconds()
      : new Date(currVal).getSeconds());
  // 兼容safari
  return date.replace(/-/g, "/");
}
export function randomStr(type: string) {
  if (type === "numLetter") {
    return parseFloat(
      (Math.random() * 100).toString().replace(".", "")
    ).toString(32);
  } else {
    return (Math.random() * 100).toString().replace(".", "");
  }
}
export function flatArr(arr: Array<any>) {
  const returnArr = arr || [];
  return returnArr.flat();
}
/**
 * 删除html标签
 * @param {*} str
 * @returns
 */
export function delHtmlTag(str: string) {
  return str
    .replace(/<\/?.+?>/g, "")
    .replace(/&nbsp;/g, "")
    .replace(/&lt;/g, "")
    .replace(/&gt;/g, "");
}
/**
 * 省份名称字典映射
 * @returns 
 */
export function nameMapDict() {
  return {
    "广东": "广东省",
    "北京": "北京",
    "台湾": "台湾省",
    "陕西": "陕西省",
    "浙江": "浙江省",
    "湖北": "湖北省",
    "香港": "香港",
    "福建": "福建省",
    "江西": "江西省",
    "湖南": "湖南省",
    "江苏": "江苏省",
    "安徽": "安徽省",
    "河南": "河南省",
    "四川": "四川省",
    "山西": "山西省",
    "吉林": "吉林省",
    "贵州": "贵州省",
    "云南": "云南省",
    "海南": "海南省",
    "山东": "山东省",
    "天津": "天津",
    "辽宁": "辽宁省",
    "黑龙江": "黑龙江省",
    "甘肃": "甘肃省",
    "河北": "河北省",
    "西藏": "西藏",
    "青海": "青海",
    "内蒙古": "内蒙古",
    "宁夏": "宁夏",
  }
}
export function commonOptions(title: string, data: Array<{ name: string, value: number }>) {
  return {
    title: {
      text: title,
      left: 20,
      top: 10
    },
    tooltip: {
      trigger: "item",
      formatter: " {a} <br/>{b} : {c}({d}%)",
    },
    series: [
      {
        name: title,
        type: "pie",
        data: data,
        radius: ["40%", "55%"],
        emphasis: {
          label: {
            show: true,
            fontSize: 12,
            fontWeight: 'bold'
          }
        },
      },
    ],
  }
}
export function dayViewsOptions(state: any) {
  return {
    title: {
      text: "最近30天访问量",
      left: 20,
      top: 10
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
        shadowStyle: {
          color: "rgba(0,0,0,0.08)",
        },
      },
    },
    legend: {
      top: 10
    },
    grid:{
      left: '5%',
      right: '3%',
    },
    xAxis: {
      data: state.everyDayViews.map((item: any) => {
        return item.createDate;
      }),
      boundaryGap: true,
      axisLabel: {
        interval: 5,
        rotate: 0, // 倾斜度 -90 至 90 默认为0
        margin: 8,
        formatter: function (value: string) {
          const str = value.slice(0, 10).slice(-5);
          return str;
        },
      },
      axisLine: {
        lineStyle: {
          color: "#a0a6a8",
        },
      },
    },
    yAxis: {
      splitNumber: 4,
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
        },
      },
    },
    series: [
      {
        name: "今日访问IP数(UV)",
        type: "line",
        stack: "Total",
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(58,77,233,0.8)'
            },
            {
              offset: 1,
              color: 'rgba(58,77,233,0.3)'
            }
          ])
        },
        emphasis: {
          focus: "series",
        },
        data: state.everyDayViews.map((item: any) => {
          return item.dayIp;
        }),
        smooth: true,
        showSymbol: false
      },
      {
        name: "今日浏览量(PV)",
        type: "line",
        stack: "Total",
        showSymbol: false,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(103,194,54,1)'
            },
            {
              offset: 1,
              color: 'rgba(103,194,54,0.3)'
            }
          ])
        },
        emphasis: {
          focus: "series",
        },
        data: state.everyDayViews.map((item: any) => {
          return item.dayViews;
        }),
        label: {
          show: true,
          position: "top",
        },
        smooth: true,
      },
    ],
  }
}
export function mapOptions(list: Array<Object>) {
  return {
    title: {
      text: "访问地域分布",
      left: 20,
      top: 10
    },
    colorBy: "series",
    name: "city",
    label: {
      color: "red",
    },
    tooltip: {
      trigger: "item",
      formatter: function (params: any) {
        return `${params.name}: ${params.value || 0}`;
      },
    },
    visualMap: {
      min: 0,
      max: 200,
      text: ["High", "Low"],
      realtime: false,
      calculable: true,
      inRange: {
        color: ["lightskyblue", "yellow", "orangered"],
      },
    },
    series: [
      {
        type: "map",
        map: "china",
        data: list,
        nameMap: nameMapDict()
      },
    ],
  };
}
export function worldMapOptions(list: Array<Object>) {
  return {
    title: {
      text: "全球访问地域分布",
      left: 20,
      top: 10
    },
    colorBy: "series",
    name: "city",
    label: {
      color: "red",
    },
    tooltip: {
      trigger: "item",
      formatter: function (params: any) {
        return `${params.name}: ${params.value || 0}`;
      },
    },
    visualMap: {
      min: 0,
      max: 200,
      text: ["High", "Low"],
      realtime: false,
      calculable: true,
      inRange: {
        color: ["lightskyblue", "yellow", "orangered"],
      },
    },
    series: [
      {
        type: "map",
        map: "world",
        data: list,
        nameMap: wordMapJson
      },
    ],
  };
}
