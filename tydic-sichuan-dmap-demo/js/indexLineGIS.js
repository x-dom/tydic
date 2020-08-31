var lineGIS;
let station_time = 4;
$(function () {
  initCanvas();
  drawCharts(1);
  var gisindex = 0;
    lineGIS = lineGISFn();
    lineGIS.init();
    $(".container ul li i").on("click",function(){
      gisindex = $(this).parent().index('.container ul li');
      gis.stationPopulationAnimation.stopAnimation();
      lineGIS.flyToStationIndex(gisindex + 14);
    })
    $('.start').on("click",function(){
        $('.textCon').hide();
        $("#pie2").hide();
        $(".icon.on").removeClass('off').next('span').css("color","#fff");
        $(".container canvas").remove();
        initCanvas();

       
        gis.hidePoPulationResult();
        if(gis.stationPopulationAnimation){
            gis.stationPopulationAnimation.clear();
        }
        lineGIS.init();
        gis.loadStationAnimation(15);
        gis.stationPopulationAnimation.loadArriveAnimation();
    })
    $('.choose').on("click",function(){
        gis.stationPopulationAnimation.startAnimation();
    })
})

function lineGISFn() {
    return {
        stations: [],
        currentStation: null,
        currentStationIndex: -1,
        historyStation: null,
        cameraLocation: {
            14: {
                position: new Cesium.Cartesian3(-1338159.2325751812, 5335423.204024776, 3221626.27190832),
                direction: new Cesium.Cartesian3(0.5313184073556837, -0.8101197108838674, 0.24780396292726847),
                up: new Cesium.Cartesian3(0.19140644214627392, 0.39973708133457686, 0.8964228018691957)
            },
            15: {
                position: new Cesium.Cartesian3(-1337954.9876989315, 5334782.097511212, 3222772.588406973),
                direction: new Cesium.Cartesian3(0.5313247579168844, -0.8101738560311929, 0.24761325616394667),
                up: new Cesium.Cartesian3(0.19145495423119768, 0.3995543975272723, 0.896493883926125)
            },
            16: {
                position: new Cesium.Cartesian3(-1336239.4785981916, 5334258.48376237, 3223759.767489861),
                direction: new Cesium.Cartesian3(0.09640714885606555, -0.9061149979685256, 0.4118995898346385),
                up: new Cesium.Cartesian3(-0.18825732189858452, 0.3897581277803398,  0.9014697901653372)
            },
            17: {
                position: new Cesium.Cartesian3(-1335796.7941711815, 5334027.313447255, 3226221.333014187),
                direction: new Cesium.Cartesian3(0.1343161788556891,  -0.9792524965634622, -0.1517356651279884),
                up: new Cesium.Cartesian3(-0.22363084236022018,  -0.17912743105051743, 0.9580723405831632)
            },
            18: {
               position: new Cesium.Cartesian3(-1336337.560860993, 5332863.209566644, 3226172.875191428),
               direction: new Cesium.Cartesian3(0.3819111193937825,  -0.8983914070238357, 0.21687963636340024),
               up: new Cesium.Cartesian3(0.0954610912117341,  0.2717587614596283, 0.9576191078057048)
            },
            19: {
                position: new Cesium.Cartesian3(-1335633.2976957394, 5332460.385707505, 3227214.949384472),
                direction: new Cesium.Cartesian3(0.05804569669710849,  -0.9912659721789007, 0.11841650854153052),
                up: new Cesium.Cartesian3(-0.2630987863715067,  0.09923358119004044, 0.9596518769710399)
            },
            20: {
                position: new Cesium.Cartesian3(-1333788.7116675712, 5330088.992552611, 3228899.3899686476),
                direction: new Cesium.Cartesian3(-0.9385548219325763,  -0.34396686808632015, -0.028313245769396016),
                up: new Cesium.Cartesian3(-0.3101304836009823,  0.8045363717816222, 0.5064980845194624)
            },
            21: {
                position: new Cesium.Cartesian3(-1333035.204399073, 5330634.656595139, 3229216.899811063),
                direction: new Cesium.Cartesian3(-0.7972529629530097,  -0.5856303236466225, 0.14637225518587543),
                up: new Cesium.Cartesian3(-0.42083610213211775,  0.7130622729668018, 0.5607487583701491)
            },
            22: {
                position: new Cesium.Cartesian3(-1333605.8719504285, 5329482.209786887, 3232020.126112197),
                direction: new Cesium.Cartesian3(-0.5789755279629158,  -0.45716706138910124, -0.6751189643321514),
                up: new Cesium.Cartesian3(-0.7005256474250547,  0.7025960425800453, 0.12499047263918622)
            },
            23: {
                position: new Cesium.Cartesian3(-1335166.3843318317, 5328663.122400676, 3230498.238709674),
                direction: new Cesium.Cartesian3(0.1573614217036103,  -0.6677093785821633, 0.7275998685492183),
                up: new Cesium.Cartesian3(-0.17898858045533697,  0.7052923923226232, 0.6859487804482302)
            },
            24: {
                position: new Cesium.Cartesian3(-1334907.6475756427, 5327775.804952129, 3231693.5612638914),
                direction: new Cesium.Cartesian3(0.15521692954827251,  -0.5831827224969349, 0.797374201340042),
                up: new Cesium.Cartesian3(-0.19280820823496628,  0.773750112677867, 0.6034366229921831)
            },
            25: {
                position: new Cesium.Cartesian3(-1334802.513346646, 5327394.300434951, 3232365.843675566),
                direction: new Cesium.Cartesian3(0.15523966676118436,  -0.5832776560630176, 0.7973003335014407),
                up: new Cesium.Cartesian3(-0.19278895024168427,  0.7736787828874577, 0.6035342256860762)
            },
            26: {
                position: new Cesium.Cartesian3(-1335195.6762077562, 5328556.986081212, 3232851.544098298),
                direction: new Cesium.Cartesian3(0.24926354472318293, -0.9016148216039871, 0.3534945526257009),
                up: new Cesium.Cartesian3(-0.06835976280370473, 0.34772458586209587, 0.9351013609317737)
            },
            27: {
                position: new Cesium.Cartesian3(-1334486.0064814473, 5328180.751036484, 3233357.426080394),
                direction: new Cesium.Cartesian3(-0.08171848985012971, -0.8891338994607239, 0.45029212434416604),
                up: new Cesium.Cartesian3(-0.28829424227349876, 0.45357654360216626, 0.8432999163796124)
            },
            28: {
                position: new Cesium.Cartesian3(-1334590.6128766744, 5327754.933150382, 3234015.8518957384),
                direction: new Cesium.Cartesian3(-0.08167220030477082, -0.8891893033304044, 0.45019110890839215),
                up: new Cesium.Cartesian3(-0.2882866004312397, 0.45346772164614846, 0.8433610504622856)
            },
            29: {
                position: new Cesium.Cartesian3(-1334847.1035587904, 5327077.657904098, 3235025.517485014),
                direction: new Cesium.Cartesian3(-0.08158515612114445, -0.8892757159669135, 0.4500361799813678),
                up: new Cesium.Cartesian3(-0.2882830452862638, 0.45329561789954204, 0.8434547815938626)
            },
            30: {
                position: new Cesium.Cartesian3(-1335609.7061833271, 5328223.176838291, 3236852.070627898),
                direction: new Cesium.Cartesian3(0.2126189224730997,  -0.9766408875486751, 0.031076849494671318),
                up: new Cesium.Cartesian3(-0.05577348121492968,  0.019622347129499118, 0.9982506109621458)
            },
            31: {
                position: new Cesium.Cartesian3(-1334661.6283380345, 5326034.203551394, 3237182.662725076),
                direction: new Cesium.Cartesian3(-0.4223503550053571, -0.8835000988424031, 0.20260245055850834),
                up: new Cesium.Cartesian3(-0.5260236568877926, 0.4209272477548572, 0.7389988934307785)
            },
            32: {
                position: new Cesium.Cartesian3(-1335770.1599173506, 5325004.096103388, 3238265.8087542513),
                direction: new Cesium.Cartesian3(0.048431413915661234, -0.9624732516313583, 0.26701992068063),
                up: new Cesium.Cartesian3(-0.24056967945844168, 0.24822354063254673, 0.9383556379119301)
            },
            100: {
                position: new Cesium.Cartesian3(-1351900.4338333816, 5340439.568264866, 3232754.854160746),
                direction: new Cesium.Cartesian3(0.785978440099803,  -0.6052870336755974, -0.1259583207353796),
                up: new Cesium.Cartesian3(0.5422225297228572,  0.5769802230983604, 0.6108097497701813)
            }

        },
        init: function () {
            this.stations = data.subway[1].station;
            this.currentStation = this.stations[14];
            this.currentStationIndex = 14;
            var lon0 = this.currentStation.coordinates[0];
            var lat0 = this.currentStation.coordinates[1];
            var center = Cesium.Cartesian3.fromDegrees(lon0, lat0);
            var heading = Cesium.Math.toRadians(0.0);
            var pitch = Cesium.Math.toRadians(-30.0);
            var range = 5000.0;

            gis.viewer.camera.flyTo({
                destination: this.cameraLocation[14].position,
                orientation: {
                    direction: this.cameraLocation[14].direction,
                    up: this.cameraLocation[14].up,
                },
                duration: 2,
            });
            if (this.historyStation) {
                gis.viewer.entities.remove(this.historyStation);
            }
            if (this.entityPath) {
                gis.viewer.entities.remove(this.entityPath);
            }

            if(this.timeCode){
                window.clearTimeout(this.timeCode);
                this.timeCode = undefined;
            }
        },
        gotoStation: function (lon, lat) {
            if (this.currentStation) {
                var _this = this;
                var now = Date.now();
                var start = gis.viewer.clock.currentTime;
                var stop = Cesium.JulianDate.addSeconds(start, station_time-1, new Cesium.JulianDate());
                var point1 = new Cesium.SampledPositionProperty();
                var lon0 = this.currentStation.coordinates[0];
                var lat0 = this.currentStation.coordinates[1];
                point1.addSample(start, Cesium.Cartesian3.fromDegrees(lon0, lat0, 0));
                point1.addSample(stop, Cesium.Cartesian3.fromDegrees(lon0, lat0, 0));

                var point2 = new Cesium.SampledPositionProperty();
                point2.addSample(start, Cesium.Cartesian3.fromDegrees(lon0, lat0, 0));
                point2.addSample(stop, Cesium.Cartesian3.fromDegrees(lon, lat, 0));
                if (this.entityPath) {
                    gis.viewer.entities.remove(this.entityPath);
                }

                this.entityPath = gis.viewer.entities.add({
                    name: 'path',
                    polyline: {
                        show: true,
                        positions: new Cesium.PositionPropertyArray([point1, point2]),
                        width: 20,
                        clampToGround: true,
                        material: new Cesium.PolylineGlowMaterialProperty({
                            color: Cesium.Color.YELLOW,
                            glowPower: 0.1,
                            taperPower: 1.0
                        })
                    }
                });
            }
        },
        flyToStationIndex: function(index){
            var _this = this;
            if (_this.stations[index]) {
                setTimeout(function(){
                    gis.viewer.camera.flyTo({
                        destination: _this.cameraLocation[index].position,
                        orientation: {
                            direction: _this.cameraLocation[index].direction,
                            up: _this.cameraLocation[index].up,
                        },
                        duration: 2,
                        easingFunction: Cesium.EasingFunction.LINEAR_NONE
                    });
                }, 1000);
            }
        },

        gotoStationIndex: function (index) {
            var _idx = index;
            var _this = this;
            if (this.currentStation && this.stations[index]) {
                var lon = this.stations[index].coordinates[0];
                var lat = this.stations[index].coordinates[1];
                setTimeout(function(){
                    gis.viewer.camera.flyTo({
                        destination: _this.cameraLocation[_idx].position,
                        orientation: {
                            direction: _this.cameraLocation[_idx].direction,
                            up: _this.cameraLocation[_idx].up,
                        },
                        duration: station_time-1,
                        easingFunction: Cesium.EasingFunction.LINEAR_NONE
                    });

                }, 1000);
                this.gotoStation(lon, lat);
                this.currentStationIndex = index;
                this.currentStation = this.stations[index];
                // this.refreshHistoryStation();
                gis.loadStationAnimation(this.currentStationIndex + 1);
                _this.timeCode = setTimeout("lineGIS.refreshHistoryStation();", ((station_time-1) * 980));
            }

            if(lineGIS.currentStation.station_id == 33){
              var _this = this;
              setTimeout(() => {
                  gis.stationPopulationAnimation.clearTraceLine();
                  gis.viewer.camera.flyTo({
                      destination: _this.cameraLocation[100].position,
                      orientation: {
                          direction: _this.cameraLocation[100].direction,
                          up: _this.cameraLocation[100].up,
                      },
                      duration: 4,
                      easingFunction: Cesium.EasingFunction.LINEAR_NONE
                  });
                  gis.showPoPulationResult();
              }, 8000);
            }
          
        },
        gotoNextStation: function () {
          cl.updateStatue(1,this.currentStationIndex);
            if (this.currentStation) {
                this.gotoStationIndex(this.currentStationIndex + 1);
            }
        },
        refreshHistoryStation() {
            if(this.timeCode){
                this.timeCode = undefined;
            }

            var arr = [];
            var lon0 = null;
            var lat0 = null;
            for (let i = 13; i <= this.currentStationIndex; i++) {
                var point = Cesium.Cartesian3.fromDegrees(this.stations[i].coordinates[0], this.stations[i].coordinates[1], 0);
                arr.push(point);
                lon0 = this.stations[i].coordinates[0];
                lat0 = this.stations[i].coordinates[1];
            }
            if (this.historyStation) {
                gis.viewer.entities.remove(this.historyStation);
            }
            var center = Cesium.Cartesian3.fromDegrees(lon0, lat0);
            var heading = Cesium.Math.toRadians(0.0);
            var pitch = Cesium.Math.toRadians(-30.0);
            var range = 5000.0;
            // gis.viewer.camera.lookAt(center, new Cesium.HeadingPitchRange(heading, pitch, range));
            this.historyStation = gis.viewer.entities.add({
                name: 'historyStation',
                polyline: {
                    show: true,
                    positions: arr,
                    width: 20,
                    clampToGround: true,
                    material: new Cesium.PolylineGlowMaterialProperty({
                        color: Cesium.Color.YELLOW,
                        glowPower: 0.1,
                        taperPower: 1.0
                    })
                }
            });
            // gis.loadStationAnimation(this.currentStationIndex + 1);
            cl.updateStatue(0);
            gis.stationPopulationAnimation.loadArriveAnimation();
            //到达后之后
            $('#cont li').eq(this.currentStationIndex- 14).children('i').addClass("off");
            $('#cont li').eq(this.currentStationIndex - 14).children('span').css("color", "#0081cf");
            drawCharts(this.currentStationIndex- 13);
        }
    }
}
