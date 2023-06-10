import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Chart from "chart.js/auto";
import classNames from "classnames/bind";

import styles from "assets/css/default.module.scss";
import { TypeProps } from "stores/type";

const cx = classNames.bind(styles);

const Charts = () => {
  useEffect(() => {
    // 차트를 그릴 캔버스 요소 가져오기
    const xBarChartCanvas = document.getElementById(
      "xBarChart"
    ) as HTMLCanvasElement;
    const xBarChartCtx = xBarChartCanvas.getContext("2d");
    const yBarChartCanvas = document.getElementById(
      "yBarChart"
    ) as HTMLCanvasElement;
    const yBarChartCtx = yBarChartCanvas.getContext("2d");
    const lineChartCanvas = document.getElementById(
      "lineChart"
    ) as HTMLCanvasElement;
    const lineChartCtx = lineChartCanvas.getContext("2d");
    const doughnutChartCanvas = document.getElementById(
      "doughnutChart"
    ) as HTMLCanvasElement;
    const doughnutChartCtx = doughnutChartCanvas.getContext("2d");
    const pieChartCanvas = document.getElementById(
      "pieChart"
    ) as HTMLCanvasElement;
    const pieChartCtx = pieChartCanvas.getContext("2d");

    // 데이터 준비
    const barChartData = {
      labels: [
        "03/09",
        "03/17",
        "03/24",
        "03/31",
        "04/07",
        "04/14",
        "04/21",
        "04/28",
        "05/11",
        "05/19",
        "05/26",
      ],
      datasets: [
        {
          label: "3개월 주가",
          data: [
            549000, 553000, 569000, 584000, 580000, 594000, 572000, 581000,
            553000, 552000, 578000,
          ],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
    const doughnutChartData = {
      labels: ["내수", "수출"],
      datasets: [
        {
          data: [34.13, 65.87],
          backgroundColor: ["red", "blue"],
        },
      ],
    };

    // 차트 인스턴스 생성
    if (
      xBarChartCtx === null ||
      yBarChartCtx === null ||
      lineChartCtx === null ||
      doughnutChartCtx === null ||
      pieChartCtx === null
    ) {
      return;
    }

    const xBarChart = new Chart(xBarChartCtx, {
      type: "bar",
      data: barChartData,
      options: {
        indexAxis: "x",
        scales: {
          x: {
            beginAtZero: true,
          },
        },
      },
    });
    const yBarChart = new Chart(yBarChartCtx, {
      type: "bar",
      data: barChartData,
      options: {
        indexAxis: "y",
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    const lineChart = new Chart(lineChartCtx, {
      type: "line",
      data: barChartData,
    });
    const doughnutChart = new Chart(doughnutChartCtx, {
      type: "doughnut",
      data: doughnutChartData,
    });
    const pieChart = new Chart(pieChartCtx, {
      type: "pie",
      data: doughnutChartData,
    });

    return () => {
      xBarChart?.destroy();
      yBarChart?.destroy();
      lineChart?.destroy();
      doughnutChart?.destroy();
      pieChart?.destroy();
    };
  }, []);

  const charts = [
    "xBarChart",
    "yBarChart",
    "lineChart",
    "doughnutChart",
    "pieChart",
  ];

  const Card = ({ type }: TypeProps) => {
    console.log(type);
    return (
      <div className={cx("card")}>
        <canvas id={type}></canvas>
      </div>
    );
  };
  return (
    <div className={cx("inner")}>
      <h1>Charts: chart.js</h1>
      <div className={cx("cards")}>
        {charts.slice(0, 2).map((type, idx) => (
          <Card type={type} />
        ))}
      </div>
      <div className={cx("cards")}>
        <Card type={charts[2]} />
      </div>

      <div className={cx("cards")}>
        {charts.slice(3, 5).map((type, idx) => (
          <Card type={type} />
        ))}
      </div>
    </div>
  );
};

export default Charts;
