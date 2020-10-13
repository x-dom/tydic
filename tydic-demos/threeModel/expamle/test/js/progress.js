import echarts from 'echarts'
    var slots={};
    window.hasLoaded = 0;
    window.loading = false;
    window.ulp = ulp;
    function initProgres(){
      ulp(67,"loadingProgress1");
      ulp(53,"loadingProgress2");
      drawChargeInfoChart("info_two_one",0.5);
      drawChargeInfoChart("info_three_one",0.4);
      drawChargeInfoChart("info_three_two",0.7);
      drawCharts();
    }
    function ulp(percent,id){
        window.loading = true;
        var i = 0, draw = null;
        draw = setInterval(function(){
            if (window.hasLoaded > percent) {
                window.loading = false;
                clearInterval(draw);
                draw = null;
                return true;
            }

            if (i<percent) {
                d(id);
                i++;
                window.hasLoaded += 1;
            } else {
                clearInterval(draw);
                draw = null;
            }
        }, 60);
    }

    function d(id){
        var c=document.getElementById(id),
        ctx=c.getContext('2d');
        $("#"+id).prev().find(".loadedNum").html(window.hasLoaded);
        var loaded = window.hasLoaded * 2 / 100 * Math.PI, cw = 102, hcw = 42;
        ctx.clearRect (0,0,cw,cw);
        ctx.beginPath();
        ctx.arc(hcw,hcw,hcw-4, 0, loaded, false);
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#82d480';
        ctx.stroke();
    }
    function drawCharts(){
      var chart = echarts.init(document.getElementById("chart"));
      var options = {
        grid: {
            top: "25%",
            bottom: "10%"
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow",
                label: {
                    show: true
                }
            }
        },
        legend: {
            data: ["告警", "流量"],
            top: "5%",
            textStyle: {
                color: "#ffffff",
            }
        },
        xAxis: {
            data: [
                "07/01",
                "07/02",
                "07/03",
                "07/04",
                "07/05",
                "07/06",
                "07/07",
                "07/08",
                
            ],
            axisLine: {
                show: true //隐藏X轴轴线
            },
            axisTick: {
                show: true //隐藏X轴刻度
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: "#d9dade" //X轴文字颜色
                }
            },
            axisLine: {
                        lineStyle: {
                            color: '#01FCE3'
                            }
                    },
        },
        yAxis: [{
                type: "value",
                name: "流量(MB)",
                nameTextStyle: {
                    color: "#d9dade"
                },
                splitLine: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: true
                },
                axisLine: {
                    show: true
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: "#d9dade"
                    }
                },
                axisLine: {
                            lineStyle: {
                                color: '#FFFFFF'
                                }
                        },
            },
        ],
        series: [{
                name: "告警",
                type: "scatter",
                symbol: "circle", //标记的图形为实心圆
                symbolSize: 20, //标记的大小
                itemStyle: {
                    //折线拐点标志的样式
                    color: function(val){
                      // console.log(val)
                      if(val.value == 0){
                        return "rgba(0,0,0,0)"
                      }else{
                        return "rgba(228, 57, 60,1)"
                      }
                    }
                },
                data: [4.2, 3.8, 0, 3.5, 0, 2.8, 0, 0]
            },
            {
                name: "流量",
                type: "line",
                showAllSymbol: true, 
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: "#00FFE3"
                            },
                            {
                                offset: 1,
                                color: "#4693EC"
                            }
                        ])
                    }
                },
                areaStyle:{
                  color: "rgba(5,140,255, 0.2)"
                },
                data: [4.2, 3.8, 4.8, 3.5, 2.9, 2.8, 3, 5]
            }
        ]
      }
      chart.setOption(options);
    }
    function initCharts(){
      drawChartOne();
      drawChartTwo();
      drawChartThree();
      drawChartFour();
    }
    function drawChartOne(){
      var yData = ['故障前', '故障后']
      var data = [211, 264]
      var color = ['#ebf910', '#2d25cb']
      var seriesData = []
      data.map((item, index) => {
          seriesData.push({
              name: '',
              value: item,
              itemStyle: {
                  normal: {
                    color: color[index],
                    barBorderRadius: 12
                  }
                }
          })
      })
      var chart = echarts.init(document.getElementById("chart_one"));
      var option = {
        legend: {
          show: false
        },
        grid: {
          left: '8%',
          right: '12%',
          bottom: '8%',
          top: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          }
        },
        yAxis: [
          {
            type: 'category',
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#363e83'
              }
            },
            axisLabel: {
              inside: false,
              textStyle: {
                color: '#68d8c3',
                fontWeight: 'normal',
                fontSize: 12
              }
            },
            data: yData
          }, {
            type: 'category',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitArea: {
              show: false
            },
            splitLine: {
              show: false
            },
            data: yData
          }, {
            type: 'category',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitArea: {
              show: false
            },
            splitLine: {
              show: false
            },
            data: yData
          }],
        series: [
          {
            name: '',
            type: 'bar',
            stack: '1',
            yAxisIndex: 0,
            data: seriesData,
            barWidth: 10,
            z: 3
          },
          {
            name: '',
            type: 'bar',
            yAxisIndex: 2,
            data: [
              {
                value:400,
                label:{
                  color:"#ebf910",
                }
              },
              {
                value:400,
                label:{
                  color:"#2d25cb",
                }
              }],
            barWidth: 10,
            itemStyle: {
              color: '#001a2b',
              barBorderRadius: 12
            },
            label: {
              normal: {
                show: true,
                fontSize: 12,
                padding: [0, 0, 0, 20],
                position: 'right',
                formatter: function (params) {
                  return data[params.dataIndex]
                }
              }
            },
            z: 0
          }
        ]
      }
      chart.setOption(option);
    }
    function drawChartTwo(){
      var pathSymbols = {
        reindeer: 'path://M95.115 776.811c-0.814 0-1.626 0-2.492-0.052-16.257-1.34-28.492-15.744-26.984-32.186 8.425-103.067 69.238-193.1 159.084-240.215-30.287-35.612-47.696-81.188-47.696-128.832 0-109.488 89.1-198.607 198.693-198.607 59.477 0 115.472 26.273 153.356 72.304 10.44 12.731 8.642 31.424-4.053 41.865-12.592 10.406-31.44 8.577-41.847-4.138-26.593-32.25-65.696-50.64-107.456-50.64-76.748 0-139.168 62.49-139.168 139.217 0 45.185 21.983 87.696 59.117 113.76l47.917 33.863-55.596 18.563c-91.235 30.56-155.368 112.254-163.315 207.864-1.341 15.522-14.223 27.234-29.56 27.234z m831.414 67.56c-15.406 0-28.27-11.763-29.641-27.287-7.476-89.794-66.428-169.49-150.355-203.116l-54.41-21.762 49.765-30.985c41.2-25.742 65.725-69.896 65.725-118.065 0-76.812-62.335-139.25-139.117-139.25-76.812 0-139.2 62.439-139.2 139.25 0 45.051 22.119 87.626 59.17 113.694l47.827 33.813-55.44 18.592c-91.385 30.713-155.438 112.32-163.368 207.963-1.34 16.257-15.526 28.376-32.052 27.036-16.355-1.275-28.44-15.627-27.17-31.987 8.491-103.214 69.425-193.148 159.254-240.35-30.408-35.507-47.627-81.204-47.627-128.762 0-109.61 89.118-198.624 198.607-198.624 109.488 0 198.542 89.014 198.542 198.624 0 51.997-20.002 100.709-55.102 137.182C894.122 629.49 948.053 714.78 956.19 812.37c1.221 16.256-10.863 30.608-27.184 32-0.915-0.116-1.796 0-2.476 0z m0 0',
        plane: 'path://M95.115 776.811c-0.814 0-1.626 0-2.492-0.052-16.257-1.34-28.492-15.744-26.984-32.186 8.425-103.067 69.238-193.1 159.084-240.215-30.287-35.612-47.696-81.188-47.696-128.832 0-109.488 89.1-198.607 198.693-198.607 59.477 0 115.472 26.273 153.356 72.304 10.44 12.731 8.642 31.424-4.053 41.865-12.592 10.406-31.44 8.577-41.847-4.138-26.593-32.25-65.696-50.64-107.456-50.64-76.748 0-139.168 62.49-139.168 139.217 0 45.185 21.983 87.696 59.117 113.76l47.917 33.863-55.596 18.563c-91.235 30.56-155.368 112.254-163.315 207.864-1.341 15.522-14.223 27.234-29.56 27.234z m831.414 67.56c-15.406 0-28.27-11.763-29.641-27.287-7.476-89.794-66.428-169.49-150.355-203.116l-54.41-21.762 49.765-30.985c41.2-25.742 65.725-69.896 65.725-118.065 0-76.812-62.335-139.25-139.117-139.25-76.812 0-139.2 62.439-139.2 139.25 0 45.051 22.119 87.626 59.17 113.694l47.827 33.813-55.44 18.592c-91.385 30.713-155.438 112.32-163.368 207.963-1.34 16.257-15.526 28.376-32.052 27.036-16.355-1.275-28.44-15.627-27.17-31.987 8.491-103.214 69.425-193.148 159.254-240.35-30.408-35.507-47.627-81.204-47.627-128.762 0-109.61 89.118-198.624 198.607-198.624 109.488 0 198.542 89.014 198.542 198.624 0 51.997-20.002 100.709-55.102 137.182C894.122 629.49 948.053 714.78 956.19 812.37c1.221 16.256-10.863 30.608-27.184 32-0.915-0.116-1.796 0-2.476 0z m0 0',
      }  
    var labelSetting = {
        normal: {
            show: true,
            position: 'right',
            offset: [10, 0],
            textStyle: {
                fontSize: 16,
                color:"#0081cf"
            }
        }
    };
      var chart = echarts.init(document.getElementById("chart_two"));
      var option = {
      tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'shadow'
          }
      },
      grid: {
          containLabel: true,
          top:20,
          bottom:20,
          left:38
      },
      yAxis: {
          data: ['故障前','故障后'],
          inverse: true,
          axisLine: {show: false},
          axisTick: {show: false},
          axisLabel: {
              margin: 10,
              align:"right",
              textStyle: {
                  fontSize: 12,
                  color:"#68d8c3"
              }
          },
      },
      xAxis: {
          splitLine: {show: false},
          axisLabel: {show: false},
          axisTick: {show: false},
          axisLine: {show: false}
      },
      series:[{
          name: '2015',
          type: 'pictorialBar',
          label: labelSetting,
          symbolRepeat: true,
          barWidth:10,
          symbolSize: '200%',
          barCategoryGap: '20%',
          barGap:"200%",
          data: [{
              value: 157,
              symbol: pathSymbols.reindeer,
              itemStyle:{
                color:"#ebf910"
              },
              label:{
                color:"#ebf910"
              }
          }, {
              value: 81,
              symbol: pathSymbols.plane,
              itemStyle:{
                color:"#2d25cb"
              },
              label:{
                color:"#2d25cb"
              }
          }]
      }]
    }
      chart.setOption(option);
    }
    function drawChartThree(){
      var yData = ['故障前', '故障后']
      var data = [211, 264]
      var color = ['#ebf910', '#2d25cb']
      var seriesData = []
      data.map((item, index) => {
          seriesData.push({
              name: '',
              value: item,
              itemStyle: {
                  normal: {
                    color: color[index],
                    barBorderRadius: 12
                  }
                }
          })
      })
      var chart = echarts.init(document.getElementById("chart_three"));
      var option = {
        legend: {
          show: false
        },
        grid: {
          left: '8%',
          right: '12%',
          bottom: '8%',
          top: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          }
        },
        yAxis: [
          {
            type: 'category',
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#363e83'
              }
            },
            axisLabel: {
              inside: false,
              textStyle: {
                color: '#68d8c3',
                fontWeight: 'normal',
                fontSize: 12
              }
            },
            data: yData
          }, {
            type: 'category',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitArea: {
              show: false
            },
            splitLine: {
              show: false
            },
            data: yData
          }, {
            type: 'category',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitArea: {
              show: false
            },
            splitLine: {
              show: false
            },
            data: yData
          }],
        series: [
          {
            name: '',
            type: 'bar',
            stack: '1',
            yAxisIndex: 0,
            data: seriesData,
            barWidth: 10,
            z: 3
          },
          {
            name: '',
            type: 'bar',
            yAxisIndex: 2,
            data: [
              {
                value:400,
                label:{
                  color:"#ebf910",
                }
              },
              {
                value:400,
                label:{
                  color:"#2d25cb",
                }
              }],
            barWidth: 10,
            itemStyle: {
              color: '#001a2b',
              barBorderRadius: 12
            },
            label: {
              normal: {
                show: true,
                fontSize: 12,
                padding: [0, 0, 0, 20],
                position: 'right',
                formatter: function (params) {
                  return data[params.dataIndex]
                }
              }
            },
            z: 0
          }
        ]
      }
      chart.setOption(option);
    }
    function drawChartFour(){
      var yData = ['故障前', '故障后']
      var data = [211, 264]
      var color = ['#ebf910', '#2d25cb']
      var seriesData = []
      data.map((item, index) => {
          seriesData.push({
              name: '',
              value: item,
              itemStyle: {
                  normal: {
                    color: color[index],
                    barBorderRadius: 12
                  }
                }
          })
      })
      var chart = echarts.init(document.getElementById("chart_four"));
      var option = {
        legend: {
          show: false
        },
        grid: {
          left: '8%',
          right: '12%',
          bottom: '8%',
          top: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          }
        },
        yAxis: [
          {
            type: 'category',
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#363e83'
              }
            },
            axisLabel: {
              inside: false,
              textStyle: {
                color: '#68d8c3',
                fontWeight: 'normal',
                fontSize: 12
              }
            },
            data: yData
          }, {
            type: 'category',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitArea: {
              show: false
            },
            splitLine: {
              show: false
            },
            data: yData
          }, {
            type: 'category',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitArea: {
              show: false
            },
            splitLine: {
              show: false
            },
            data: yData
          }],
        series: [
          {
            name: '',
            type: 'bar',
            stack: '1',
            yAxisIndex: 0,
            data: seriesData,
            barWidth: 10,
            z: 3
          },
          {
            name: '',
            type: 'bar',
            yAxisIndex: 2,
            data: [
              {
                value:400,
                label:{
                  color:"#ebf910",
                }
              },
              {
                value:400,
                label:{
                  color:"#2d25cb",
                }
              }],
            barWidth: 10,
            itemStyle: {
              color: '#001a2b',
              barBorderRadius: 12
            },
            label: {
              normal: {
                show: true,
                color: '#ebf910',
                fontSize: 12,
                padding: [0, 0, 0, 20],
                position: 'right',
                formatter: function (params) {
                  return data[params.dataIndex]
                }
              }
            },
            z: 0
          }
        ]
      }
      chart.setOption(option);
    }
    function drawChargeInfoChart(id,num){
      var chart = echarts.init(document.getElementById(id)),
      color_percent0 = '#0286ff',
      color_percent100 = '#082241';
      var option = {
            legend: {
                show: false,
            },
            grid: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
            },
            tooltip: {
                show: false,
            },
            series: [{
                    type: 'pie',
                    radius: ['70%', '90%'],
                    startAngle: 225,
                    hoverAnimation: false,
                    avoidLabelOverlap: false,
                    legendHoverLink: false,
                    labelLine: {
                        normal: {
                            show: false,
                        },
                    },
                    color: [{
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                    offset: 0,
                                    color: color_percent0,
                                },
                                {
                                    offset: 1,
                                    color: color_percent100,
                                },
                            ],
                        },
                        'none',
                    ],
                    data: [{
                            value: 75,
                            name: '',
                        },
                        {
                            value: 25,
                            name: '',
                        },
                    ],
                },
                {
                    name: '',
                    type: 'pie',
                    radius: ['58%', '60%'],
                    startAngle: 225,
                    hoverAnimation: false,
                    legendHoverLink: false,
                    color: [{
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                    offset: 0,
                                    color: color_percent0,
                                },
                                {
                                    offset: 1,
                                    color: color_percent100,
                                },
                            ],
                        },
                        'none',
                    ],
                    labelLine: {
                        normal: {
                            show: false,
                        },
                    },
                    data: [{
                            value: 75,
                            name: '',
                        },
                        {
                            value: 25,
                            name: '',
                        },
                    ],
                },
                {
                    name: '',
                    type: 'pie',
                    radius: ['70%', '90%'],
                    startAngle: 315,
                    hoverAnimation: false,
                    legendHoverLink: false,
                    labelLine: {
                        normal: {
                            show: false,
                        },
                    },
                    clockwise: false,
                    z: 2,
                    data: [{
                            name: '',
                            value: ((100 - num * 100) * 270) / 360,
                            label: {
                                formatter: '\n' + (num * 100).toFixed(0) + '%',
                                position: 'center',
                                show: true,
                                color: '#6ee5e8',
                                fontSize: 16,
                            },
                            itemStyle: {
                                color: 'rgba(34, 34, 34, .9)',
                            },
                        },
                        {
                            value: 1,
                            name: '',
                            itemStyle: {
                                color: '#0282f8',
                                borderColor: '#0286ff',
                                borderWidth: 1,
                            },
                        },
                        {
                            name: '',
                            value: 100 - ((100 - num * 100) * 270) / 360,
                            itemStyle: {
                                color: 'transparent',
                            },
                        },
                    ],
                },
            ],
        };
      chart.setOption(option)
    }
    export {initProgres,initCharts}
    