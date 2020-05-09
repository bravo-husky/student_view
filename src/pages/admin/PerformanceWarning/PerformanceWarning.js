import React, { useEffect, useRef } from "react";
import { report } from "../api";
import { message } from "antd";
// 引入 ECharts 主模块
import echarts from "echarts/lib/echarts";
// 引入提示框和标题组件
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/chart/pie"; //饼状图

let option = {
  backgroundColor: "#2c343c",

  title: {
    text: "成绩预警",
    left: "center",
    top: 20,
    textStyle: {
      color: "#ccc",
    },
  },

  tooltip: {
    trigger: "item",
    formatter: "姓名：{b}<br/>绩点： {c}<br/>",
    //({d}%)
  },

  visualMap: {
    show: false,
    min: 80,
    max: 600,
    inRange: {
      colorLightness: [0, 1],
    },
  },
  series: [
    {
      name: "详细信息",
      type: "pie",
      radius: "55%",
      center: ["50%", "50%"],
      data: [],
      roseType: "radius",
      label: {
        color: "rgba(255, 255, 255, 0.3)",
      },
      labelLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.3)",
        },
        smooth: 0.2,
        length: 10,
        length2: 20,
      },
      itemStyle: {
        color: "#c23531",
        shadowBlur: 200,
        shadowColor: "rgba(0, 0, 0, 0.5)",
      },

      animationType: "scale",
      animationEasing: "elasticOut",
      animationDelay: function (idx) {
        return Math.random() * 200;
      },
    },
  ],
};

const PerformanceWarning = () => {
  const conRef = useRef(null);
  let myChart = null;
  useEffect(() => {
    getReport();
    myChart = echarts.init(conRef.current);
    myChart.setOption(option, true);
  }, []);
  async function getReport() {
    let res = await report({});
    if (res && res.code === 1000) {
      console.log(res.data);
      // studentName
      // totalGpa
      let new_arr = [];
      for (let i = 0; i < res.data.length; i++) {
        new_arr.push({
          value: res.data[i].totalGpa,
          name: res.data[i].studentName,
        });
      }

      option.series[0].data = new_arr.sort(function (a, b) {
        return a.value - b.value;
      });

      console.log(option);

      myChart.setOption(JSON.parse(JSON.stringify(option)), true);
    } else if (res && res.msg) {
      message.info(res.msg);
    }
  }

  return (
    <div
      style={{
        height: "500px",
        width: "600px",
        margin: "0 auto",
        paddingTop: "100px",
      }}
    >
      <div style={{ height: "500px", width: "600px" }} ref={conRef}></div>
    </div>
  );
};

export default PerformanceWarning;
