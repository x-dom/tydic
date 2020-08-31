var cl = null;

function drawCharts(num){
  return;
  var pie1Ydata = [],pie2Ydata = [],pie3Ydata = [];
    pie1Ydata = [
      {
        value:chartdata[num-1].male_cnt*50
      },
      {
        value:chartdata[num-1].female_cnt*50
      }
    ];
    pie2Ydata = [
      {
        name:"音视频类",
        value:chartdata[num-1].media_app_cnt*100
      },
      {
        name:"即时通讯",
        value:chartdata[num-1].sns_app_cnt*100
      },
      {
        name:"游戏",
        value:chartdata[num-1].game_app_cnt*100
      },
      {
        name:"购物",
        value:chartdata[num-1].shopping_app_cnt*100
      }
    ];
    pie3Ydata = [
      {
        value:chartdata[num-1].cnt_18_25*50, 
        name:'18~25岁'
      },
      {
        value:chartdata[num-1].cnt_25_35*50, 
        name:'25~35岁'
      },
      {
        value:chartdata[num-1].cnt_35_45*50, 
        name:'35~45岁'
      },
      {
        value:chartdata[num-1].cnt_45_*50, 
        name:'45岁以上'
      }
    ]
    $('.off_cnt').html(chartdata[num-1].off_cnt);
    $('.take_time').html(chartdata[num-1].avg_gohome_take_time);
    $('.avg_flux').html(chartdata[num-1].avg_flux);
    $('.avg_op_delay').html(chartdata[num-1].avg_fp_delay);
    $('.avg_fp_delay').html(chartdata[num-1].avg_po_delay);
    $('.avg_vd_speed').html(chartdata[num-1].avg_vd_speed);
    $('.avg_stutter_times').html(chartdata[num-1].avg_stutter_times);
    if(num>1){
      $('.textCon').show();
      $("#pie2").show();
      drawPie2(pie2Ydata);
    }
  drawPie1(pie1Ydata);
  drawPie3(pie3Ydata);
}
function drawPie1(data) {
  var echart = echarts.init(document.getElementById('pie1'));
  var pathSymbols = {
    men: 'image://data:image/png;base64,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',
    women: 'image://data:image/png;base64,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',
  };
  var labelSetting = {
      normal: {
          show: true,
          position: 'right',
          offset: [10, 0],
          textStyle: {
              fontSize: 16
          }
      }
  };
  option = {
      title: {
          text: '男女性上下车情况',
          left:"center",
          textStyle:{
            color:"#fff",
            fontSize:14,
          },
          top:10
      },
      tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'shadow'
          }
      },
      grid:{
        right:"20%",
        bottom:10
      },
      yAxis: {
        show:false,
          data: ['男生', '女生'],
          inverse: true,
          axisLine: {show: false},
          axisTick: {show: false},
          axisLabel: {
            show:false,
              margin: 30,
              textStyle: {
                  fontSize: 12,
                  color:"#fff"
              }
          },
      },
      xAxis: {
          splitLine: {show: false},
          axisLabel: {show: false},
          axisTick: {show: false},
          axisLine: {show: false}
      },
      series: [
        {
          type: 'pictorialBar',
          label: labelSetting,
          symbolRepeat: true,
          symbolSize:[20,20],
          data: [
            {
              value: data[0].value,
              symbol: pathSymbols.men,
              itemStyle:{
                color:"#0081cf"
              }
          },
          {
            value: data[1].value,
            symbol: pathSymbols.women
        }
        ]
      },
    ]
  };
  echart.setOption(option);
}
function drawPie2(scaleData) {
  var echart = echarts.init(document.getElementById('pie2'));
  var placeHolderStyle = {
    normal: {
      label: {
        show: false
      },
      labelLine: {
        show: false
      },
      color: 'rgba(0, 0, 0, 0)',
      borderColor: 'rgba(0, 0, 0, 0)',
      borderWidth: 0
    }
  };
  var data = [];
  var color = ['rgb(255, 153, 153)', 'rgb(255, 176, 63)', 'rgb(61, 186, 45)', 'rgb(43, 166, 254)'];
  var colorBorder = ['rgba(255, 153, 153, 0.4)', 'rgba(255, 176, 63, 0.4)', 'rgba(61, 186, 45, 0.4)', 'rgba(43, 166, 254, 0.4)'];
  for (var i = 0; i < scaleData.length; i++) {
    data.push({
      data: scaleData[i].value,
      value: 20,
      name: scaleData[i].name,
      itemStyle: {
        normal: {
          color: color[i],
          borderWidth: 20,
          borderColor: colorBorder[i]
        }
      }
    }, {
      value: 8,
      name: '',
      itemStyle: placeHolderStyle
    });
  }
  data.push({
    value: 40,
    name: '',
    itemStyle: placeHolderStyle
  })
  var seriesObj = [{
    name: '',
    type: 'pie',
    clockWise: false,
    radius: [40, 70],
    center: ['50%', '60%'],
    hoverAnimation: false,
    startAngle: -30,
    itemStyle: {
      normal: {
        label: {
          show: true,
          position: 'inner',
          fontSize: 14,
          lineHeight: 15,
          formatter: function (params) {
            var percent = 0;
            var total = 0;
            for (var i = 0; i < scaleData.length; i++) {
              total += scaleData[i].value;
            }
            percent = ((params.value / total) * 100).toFixed(0);
            if (params.name !== '') {
              // return params.name + '\n' + params.data.data;
              if (params.name.length > 4) {
                return params.name.slice(0, 3) + '\n' + params.name.slice(3);
              } else {
                return params.name;
              }

            } else {
              return '';
            }
          }
        },
        labelLine: {
          length: 20,
          length2: 20,
          show: true
        }
      }
    },
    data: data
  }, {
    name: '',
    type: 'pie',
    clockWise: false,
    radius: [40, 70],
    center: ['50%', '60%'],
    hoverAnimation: false,
    startAngle: -30,
    itemStyle: {
      normal: {
        label: {
          show: true,
          position: 'outside',
          fontSize: 14,
          formatter: function (params) {
            var percent = 0;
            var total = 0;
            for (var i = 0; i < scaleData.length; i++) {
              total += scaleData[i].value;
            }
            percent = ((params.value / total) * 100).toFixed(0);
            if (params.name !== '') {
              return params.data.data;
            } else {
              return '';
            }
          }
        },
        labelLine: {
          length: 20,
          length2: 20,
          show: true
        }
      }
    },
    data: data
  }];
  option = {
    title: {
        text: 'app使用人数',
        left:"center",
        textStyle:{
          color:"#fff",
          fontSize:14,
        },
        top:10
    },
    tooltip: {
      show: false
    },
    legend: {
      show: false
    },
    toolbox: {
      show: false
    },
    series: seriesObj,
  }
  echart.setOption(option);
}
function drawPie3(pie3Ydata) {
  var echart = echarts.init(document.getElementById('pie3'));
  option = {
    title: {
        text: '人员年龄构成',
        left: 'center',
        top: 10,
        textStyle: {
            color: '#fff',
            fontSize:14,
        }
    },

    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    series : [
        {
            name:'访问来源',
            type:'pie',
            radius : '55%',
            center: ['50%', '50%'],
            data:pie3Ydata,
            label: {
                normal: {
                }
            },
            labelLine: {
                normal: {
                    smooth: 0.2,
                    length: 10,
                    length2: 20
                }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
        }
    ]
};
  echart.setOption(option);
}
/*========================================================*/
/* Define Canvas and Initialize
/*========================================================*/
/*========================================================*/
/* Light Loader
/*========================================================*/
var lightLoader = function (c, cw, ch, sum) {

  var _this = this;
  this.c = c;
  this.ctx = c.getContext('2d');
  this.cw = cw;
  this.ch = ch;

  this.loaded = 84;
  this.loaderSpeed = 1.2;
  this.loaderHeight = 10;
  this.loaderWidth = sum * 84;
  this.loader = {
    x: (this.cw / 2) - (this.loaderWidth / 2),
    y: (this.ch / 2) - (this.loaderHeight / 2)
  };
  this.particles = [];
  this.particleLift = 180;
  this.hueStart = 0
  this.hueEnd = 120;
  this.hue = 0;
  this.gravity = .15;
  this.particleRate = 4;
  this.stop = null;
  this.stateIndex = 1;
  this.num = 0;

  /*========================================================*/
  /* Initialize
  /*========================================================*/
  this.init = function () {
    this.loop();
  };

  /*========================================================*/
  /* Utility Functions
  /*========================================================*/
  this.rand = function (rMi, rMa) {
    return ~~((Math.random() * (rMa - rMi + 1)) + rMi);
  };
  this.hitTest = function (x1, y1, w1, h1, x2, y2, w2, h2) {
    return !(x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1);
  };
  /*========================================================*/
  /* Update Loader
  /*========================================================*/
  this.updateLoader = function () {
    if(this.stateIndex == 1){
      if (this.loaded < this.num*84) {
        this.loaded += this.loaderSpeed;
      }
    }else{
    }
  };
  this.updateStatue = function (state,num) {
    this.stateIndex = state;
    if(num){
      this.num = num-12 ;
    }
    console.log(num)
  }
  /*========================================================*/
  /* Render Loader
  /*========================================================*/
  this.renderLoader = function () {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(this.loader.x, this.loader.y, this.loaderWidth, this.loaderHeight);

    this.hue = this.hueStart + (this.loaded / 1596) * (this.hueEnd - this.hueStart);

    var newWidth = (this.loaded / 1596) * this.loaderWidth;
    this.ctx.fillStyle = 'hsla(252, 100%, 40%, 1)';
    this.ctx.fillRect(this.loader.x, this.loader.y, newWidth, this.loaderHeight);

    this.ctx.fillStyle = '#222';
    this.ctx.fillRect(this.loader.x, this.loader.y, newWidth, this.loaderHeight / 2);
  };

  /*========================================================*/
  /* Particles
  /*========================================================*/
  this.Particle = function () {
    this.x = _this.loader.x + ((_this.loaded / 1596) * _this.loaderWidth) - _this.rand(0, 1);
    this.y = _this.ch / 2 + _this.rand(0, _this.loaderHeight) - _this.loaderHeight / 2;
    this.vx = (_this.rand(0, 4) - 2) / 100;
    this.vy = (_this.rand(0, _this.particleLift) - _this.particleLift * 2) / 100;
    this.width = _this.rand(1, 4) / 2;
    this.height = _this.rand(1, 4) / 2;
    this.hue = _this.hue;
  };

  this.Particle.prototype.update = function (i) {
    this.vx += (_this.rand(0, 6) - 3) / 100;
    this.vy += _this.gravity;
    this.x += this.vx;
    this.y += this.vy;

    if (this.y > _this.ch) {
      _this.particles.splice(i, 1);
    }
  };

  this.Particle.prototype.render = function () {
    _this.ctx.fillStyle = 'hsla(189, 100%, ' + _this.rand(50, 70) + '%, ' + _this.rand(20, 100) / 100 + ')';
    _this.ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  this.createParticles = function () {
    var i = this.particleRate;
    while (i--) {
      this.particles.push(new this.Particle());
    };
  };

  this.updateParticles = function () {
    var i = this.particles.length;
    while (i--) {
      var p = this.particles[i];
      p.update(i);
    };
  };

  this.renderParticles = function () {
    var i = this.particles.length;
    while (i--) {
      var p = this.particles[i];
      p.render();
    };
  };


  /*========================================================*/
  /* Clear Canvas
  /*========================================================*/
  this.clearCanvas = function () {
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.clearRect(0, 0, this.cw, this.ch);
    this.ctx.globalCompositeOperation = 'lighter';
  };

  /*========================================================*/
  /* Animation Loop
  /*========================================================*/
  this.loop = function () {
    var loopIt = function () {
      var starttime = Date.now();
      _this.stop = requestAnimationFrame(loopIt, _this.c);
      _this.clearCanvas();

      _this.createParticles();

      _this.updateLoader();
      _this.updateParticles();

      _this.renderLoader();
      _this.renderParticles();
    };
    loopIt();
  };

};

/*========================================================*/
/* Check Canvas Support
/*========================================================*/
var isCanvasSupported = function () {
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
};

/*========================================================*/
/* Setup requestAnimationFrame
/*========================================================*/
var setupRAF = function () {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  };

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  };

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
  };
};
var initCanvas =  function (){
  if (isCanvasSupported) {
    var sum = $('#cont li').length;
    var c = document.createElement('canvas');
    c.width = sum * 84;
    c.height = 100;
    var cw = c.width;
    var ch = c.height;
    document.getElementById('cont').appendChild(c);
    cl = new lightLoader(c, cw, ch, sum);
    setupRAF();
    cl.init(sum);
  }
}

