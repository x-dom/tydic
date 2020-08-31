/**
 * 初始化界面
 */
;
var gis;
$(function () {
    gis = new GisFn();
    gis.init();
});

function GisFn(){
    return {
        viewer: null,
        init: function(){
            var _this = this;
            Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MzIwZmMxZC1lMGQzLTRmOWMtYmFiNS0yMjIwMmVhYzVkYzkiLCJpZCI6NDkxMCwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0MjAxMjczMX0._-wzI2SrgF0s6FmKWV97mInajiOshMGzOTgUs-cuX-U';
            
            //MapBox
            // var baseLayer=new Cesium.MapboxStyleImageryProvider({
            //     username: "heady713",
            //     styleId: 'ck25tobew0iqy1co2wqyctbr4',
            //     accessToken: 'pk.eyJ1IjoiaGVhZHk3MTMiLCJhIjoiY2swNG9nN3hwMDN1MTNkcG5iY2oxc3JieCJ9.2MDQ2_zQ_rxNQcIQAVmqPw'
            // })

            //高德
            // var  baselayerUrl = {
            //     url: '//webrd{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
            //     value: ['01', '02', '03', '04']
            // };
            // let baseLayer = new Cesium.UrlTemplateImageryProvider({
            //     url: baselayerUrl.url,
            //     subdomains: baselayerUrl.value,
            //     tileWidth: 256,
            //     tileHeight: 256,
            //     minimumLevel: 3,
            //     maximumLevel: 18
            //   });

            //MapServer
            let baseLayer = new Cesium.ArcGisMapServerImageryProvider({
                url: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
                enablePickFeatures: false,
            });

            _this.viewer = new Cesium.Viewer('cesiumContainer', {
                requestRenderMode: false, // 进入后台停止渲染
                targetFrameRate: 30, // 帧率30，节约GPU资源
                fullscreenButton: true, //是否显示全屏按钮
                infoBox: false,//信息弹窗控件
                geocoder: false,//是否显示geocoder小器件，右上角查询按钮 
                scene3DOnly: true,//如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
                selectionIndicator: false,//是否显示默认的选中指示框
                baseLayerPicker: false,//是否显示图层选择器
                homeButton: false, //是否显示Home按钮
                sceneModePicker: false,//   是否显示3D/2D选择器
                navigationHelpButton: false,//是否显示右上角的帮助按钮
                animation: false,//是否创建动画小器件，左下角仪表
                creditsDisplay: false,
                timeline: false,//是否显示时间轴
                shouldAnimate : true,
                fullscreenButton: false,//是否显示全屏按钮
                // terrainProvider: Cesium.createWorldTerrain(),//地形
                imageryProvider: baseLayer,
            });
            _this.viewer.scene.globe.depthTestAgainstTerrain = false;//地形相关
            _this.viewer.scene.debugShowFramesPerSecond = true;//FPS
            _this.viewer._cesiumWidget._creditContainer.style.display = "none";//去除版权信息
            _this.viewer.scene.highDynamicRange = false;// 解决瓦片地图偏灰问题
            // var layers =  _this.viewer.imageryLayers;
            // var tilemapLayer = layers.get(0);
            // tilemapLayer.brightness = 0.15;
            // tilemapLayer.contrast = 1.45;
            // tilemapLayer.hue = 2.4;
            // tilemapLayer.saturation = 2;
            // tilemapLayer.gamma = 0.6;

            //定位
            _this.flyHome();

            //加载默认站点
            _this.loadSubwayDefault();

            //加载站点动画
            // _this.loadStationAnimation(15);

            //扫描线
            // _this.addCircleScanPostStage(_this.viewer, [104.0653, 30.6597], 1500, "RGBA(255, 0.0, 0.0, 1)", 4000);

            //雷达扫描线
            // _this.addRadarScanPostStage(_this.viewer, [104.0653, 30.6597], 500, "RGBA(255, 0.0, 0.0, 1)", 4000);


            // //点光源阴影
            // var scene = _this.viewer.scene;
            // scene.debugShowFramesPerSecond = true;
            // _this.viewer.shadows = true;
            // _this.viewer.terrainShadows = true ? Cesium.ShadowMode.ENABLED : Cesium.ShadowMode.DISABLED;

            // var lightCenter = Cesium.Cartesian3.fromDegrees(104.0653, 30.6597, 500.0);
            // var camera = new Cesium.Camera(_this.viewer.scene);
            // camera.position = lightCenter;

            // var shadowMapTemp = new Cesium.ShadowMap({
            //     context: scene.context,
            //     lightCamera: camera,
            //     maxmimumDistance: 10000.0,
            //     pointLightRadius: 1000.0,
            //     darkness: 0.1,
            //     cascadesEnabled: false,
            //     isPointLight: true,
            //     debugShow: false,
            //     softShadows: true
            // });
            // shadowMapTemp._clearCommand.color = Cesium.Color.fromCssColorString("RGBA(255, 0.0, 0.0, 1)");
            // shadowMapTemp.enabled = true;
            // scene.shadowMap = shadowMapTemp;
        },

        /**
         * 主页
         */
        flyHome: function(){
            var _this = this;
            _this.viewer.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(104.0653, 30.6597, 870),
                orientation: {
                    heading: Cesium.Math.toRadians(0.0), // east, default value is 0.0 (north)
                    pitch: Cesium.Math.toRadians(-90),    // default value (looking down)
                    roll: 0.0                             // default value
                }
            });
        },
        
        /**
         * 定位
         */
        flyTo: function(entity){
            var _this = this;
            _this.viewer.flyTo(entity,{
                heading: _this.viewer.camera.heading, // east, default value is 0.0 (north)
                pitch: Cesium.Math.toRadians(-45),    // default value (looking down)
                roll: _this.viewer.camera.roll                         // default value
            });
        },

        /**
         * 加载默认地铁
         */
        loadSubwayDefault: function (){
            var _this = this;
            _this.entities = _this.entities||{};
            
            //1号线
            var line1 = self.data.subway[1].station;
            _this.entities.line1Station = _this.entities.line1Station || [];
            for (let i = 0; i < line1.length; i++) {
                var coordinates = line1[i].coordinates;
                var trans_flag = line1[i].trans_flag;
                var dpoint = new dmap.geom.DPoint({coordinates: coordinates, projection: "EPSG:4326"});
                var entity = _this.viewer.entities.add({
                    id: "line1-station"+ line1[i]["station_id"],
                    position : Cesium.Cartesian3.fromDegrees(coordinates[0], coordinates[1], 0),
                    // polygon : {
                    //     show : true, // default
                    //     hierarchy: trans_flag==1?dpoint.get3DSquare(40):dpoint.get3DCircle(20),
                    //     material : Cesium.Color.fromCssColorString("#3a347e"), 
                    // },
                    label : {
                        text: line1[i]["name"],
                        eyeOffset: new Cesium.Cartesian3(0, 100, 0),
                        scaleByDistance : new Cesium.NearFarScalar(1.0e2, 2, 1.0e4, 0.1),
                    },
                    billboard: {
                        image: 'image/cdmetro.png',
                        eyeOffset: new Cesium.Cartesian3(0, 160, 0),
                        scaleByDistance : new Cesium.NearFarScalar(1.0e2, 2, 1.0e4, 0.1),
                        scale: 0.5,
                    },
                    point : {
                        color : Cesium.Color.SKYBLUE, // default: WHITE
                        pixelSize : 16, // default: 1
                        outlineColor : Cesium.Color.YELLOW, // default: BLACK
                        outlineWidth : 4 // default: 0
                    }
                });

                _this.entities.line1Station.push(entity);
            }
            

            //2号线
            var line2 = self.data.subway[2].station;
            _this.entities.line2Station = _this.entities.line2Station || [];
            for (let i = 0; i < line2.length; i++) {
                var coordinates = line2[i].coordinates;
                var trans_flag = line2[i].trans_flag;
                var dpoint = new dmap.geom.DPoint({coordinates: coordinates, projection: "EPSG:4326"});
                var entity = _this.viewer.entities.add({
                    id: "line2-station"+ line2[i]["station_id"],
                    position : Cesium.Cartesian3.fromDegrees(coordinates[0], coordinates[1],10),
                    polygon : {
                        show : true, // default
                        hierarchy: trans_flag==1?dpoint.get3DSquare(40):dpoint.get3DCircle(20),
                        material : Cesium.Color.fromCssColorString("#fa7759"), 
                    }
                });

                _this.entities.line2Station.push(entity);
            }
            
            //3号线
            var line3 = self.data.subway[3].station;
            _this.entities.line3Station = _this.entities.line3Station || [];
            for (let i = 0; i < line3.length; i++) {
                var coordinates = line3[i].coordinates;
                var trans_flag = line3[i].trans_flag;
                var dpoint = new dmap.geom.DPoint({coordinates: coordinates, projection: "EPSG:4326"});
                var entity = _this.viewer.entities.add({
                    id: "line3-station"+ line3[i]["station_id"],
                    position : Cesium.Cartesian3.fromDegrees(coordinates[0], coordinates[1],10),
                    polygon : {
                        show : true, // default
                        hierarchy: trans_flag==1?dpoint.get3DSquare(40):dpoint.get3DCircle(20),
                        material : Cesium.Color.fromCssColorString("#f03085"), 
                    },
                });

                _this.entities.line3Station.push(entity);
            }
           
            //4号线
            var line4 = self.data.subway[4].station;
            _this.entities.line4Station = _this.entities.line4Station || [];
            for (let i = 0; i < line4.length; i++) {
                var coordinates = line4[i].coordinates;
                var trans_flag = line4[i].trans_flag;
                var dpoint = new dmap.geom.DPoint({coordinates: coordinates, projection: "EPSG:4326"});
                var entity = _this.viewer.entities.add({
                    id: "line4-station"+ line4[i]["station_id"],
                    position : Cesium.Cartesian3.fromDegrees(coordinates[0], coordinates[1],10),
                    polygon : {
                        show : true, // default
                        hierarchy: trans_flag==1?dpoint.get3DSquare(40):dpoint.get3DCircle(20),
                        material : Cesium.Color.fromCssColorString("#03a14c"), 
                    }
                });

                _this.entities.line4Station.push(entity);
            }
           
            //7号线
            var line7 = self.data.subway[7].station;
            _this.entities.line7Station = _this.entities.line7Station || [];
            for (let i = 0; i < line7.length; i++) {
                var coordinates = line7[i].coordinates;
                var trans_flag = line7[i].trans_flag;
                var dpoint = new dmap.geom.DPoint({coordinates: coordinates, projection: "EPSG:4326"});
                var entity = _this.viewer.entities.add({
                    id: "line7-station"+ line7[i]["station_id"],
                    position : Cesium.Cartesian3.fromDegrees(coordinates[0], coordinates[1],10),
                    polygon : {
                        show : true, // default
                        hierarchy: trans_flag==1?dpoint.get3DSquare(40):dpoint.get3DCircle(20),
                        material : Cesium.Color.fromCssColorString("#9ecad5"), 
                    },
                });

                _this.entities.line7Station.push(entity);
            }

            //添加线网
            var lines = self.data.subway;
            _this.entities.subwayNetline = _this.entities.subwayNetline || [];
            for (var i in lines) {
                var line = lines[i];
                var coordinates = line.coordinates;
                var line_id = line.line_id;
                var color = "#9ecad5";
                if(line_id == 1){
                    color = "#3a347e";
                } else if(line_id == 2){
                    color = "#fa7759";
                } else if(line_id == 3){
                    color = "#f03085";
                } else if(line_id == 4){
                    color = "#03a14c";
                } else if(line_id == 7){
                    color = "#9ecad5";
                }

                var wallCoordinates = JSON.parse(JSON.stringify(coordinates));
                for (let i = 0; i < wallCoordinates.length; i++) {
                    wallCoordinates[i][2] = 100;
                }
                var entity = _this.viewer.entities.add({
                    id: "subway_netline"+ line_id,
                    polyline: {
                        show : true,
                        positions: Cesium.Cartesian3.fromDegreesArray(coordinates.join().split(",")),
                        width: 5,
                        material: Cesium.Color.fromCssColorString(color),
                        clampToGround: true,
                    },
                });

                _this.entities.subwayNetline.push(entity);
            }

            // var num = 0;
            // var sign = 1;
            // _this.flyTo(_this.entities.line1Station[num]);
            // setInterval(() => {
            //     if(sign == 1 && num == _this.entities.line1Station.length-1){
            //         sign = -1;
            //     } else if(sign == -1 && num == 0){
            //         sign = 1;
            //     }
            //     num += sign;
            //     _this.flyTo(_this.entities.line1Station[num]);
            // }, 3000);

            //添加统计结果
            _this.loadPopulationResult();


            //添加楼宇
            _this.loadBuilding();
        },

        /**
         * 加载指定站点动画
         * @param {*} station_id 
         */
        loadStationAnimation: function(station_id){
            var _this = this;
            var data = self.data.populationMove[station_id];
            if(!_this.stationPopulationAnimation){
                _this.stationPopulationAnimation = new StationPopulationAnimation(_this.viewer,data);
            } else {
                _this.stationPopulationAnimation.reload(data);
            }
        },

        /**
         * 加载人流结果
         */
        loadPopulationResult: function(){
            var _this = this;

            //1号线
            var line1 = self.data.populationMove;
            var entities = [];
            for (const i in line1) {
                var station_id = line1[i].station_id;
                if(station_id <= 14) continue;
                
                var moveInCnt = line1[i].moveInCnt;
                var moveOutCnt = line1[i].moveOutCnt;
                var text = "";
                if(station_id == 15){
                    text = "上客"+ moveInCnt + "人/次";
                } else {
                    text = "下客"+ moveOutCnt + "人/次";
                }

                var coordinates = line1[i].coordinates;
                var entity = _this.viewer.entities.add({
                    show: false,
                    id: "line1-station-population-"+ line1[i]["station_id"],
                    position : Cesium.Cartesian3.fromDegrees(coordinates[0], coordinates[1], 0),
                    label : {
                        text: text,
                        eyeOffset: new Cesium.Cartesian3(50, 1000, 0),
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        fillColor: Cesium.Color.WHITE,
                        // labelStyle: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        // scaleByDistance : new Cesium.NearFarScalar(0, 3, 4.0e3, 0.5),
                        distanceDisplayCondition : new Cesium.DistanceDisplayCondition(2000, Number.MAX_VALUE),
                        showBackground: true,
                        backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.4),
                        font: '14px sans-serif',
                        // scaleByDistance : new Cesium.NearFarScalar(1.0e2, 2, 1.0e4, 0.1),
                    },
                });
                entities.push(entity);
            }

            _this.showPoPulationResult = function() {
                for (let i = 0; i < entities.length; i++) {
                    const entity = entities[i];
                    entity.show = true;
                }
            }
            
            _this.hidePoPulationResult = function() {
                for (let i = 0; i < entities.length; i++) {
                    const entity = entities[i];
                    entity.show = false;
                }
            }
        },

        /**
         * 加载建筑
         */
        loadBuilding: function(){
            var _this = this;

            //1号线
            // var line1 = self.data.populationMove;
            // var entities = [];
            // var geometryInstances = [];
            // for (const key in line1) {
            //     var buildings = line1[key].building;
            //     if(buildings){
            //         for (let i = 0; i < buildings.length; i++) {
            //             var building = buildings[i];
            //             // var options = {};
            //             // options.polygon = {
            //             //     outline: true,
            //             //     show : true,
            //             //     hierarchy: Cesium.Cartesian3.fromDegreesArray(building.coordinates.join().split(",")),
            //             //     height: 0,
            //             //     extrudedHeight: building.height,
            //             //     distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4200),
            //             //     material: Cesium.Color.fromCssColorString("rgba(100, 100, 240, 0.5)"),
            //             //     // material: new Cesium.ImageMaterialProperty({
            //             //     //     image: '/tydic-sichuan-dmap-demo/image/building1.png',
            //             //     //     transparent : true,
            //             //     //     repeat : new Cesium.Cartesian2(1.0, 1.0),
            //             //     // })
            //             // };
            //             // entities.push(_this.viewer.entities.add(options));

            //             var hierarchy = Cesium.Cartesian3.fromDegreesArray(building.coordinates.join().split(","));
            //             var extrudedHeight = building.height;
            //             var extrudedPolygon = new Cesium.PolygonGeometry({
            //                 vertexFormat: Cesium.MaterialAppearance.MaterialSupport.TEXTURED.vertexFormat,
            //                 polygonHierarchy : new Cesium.PolygonHierarchy(hierarchy),
            //                 extrudedHeight: extrudedHeight,
            //                 perPositionHeight: true
            //             });
            //             var geometry = Cesium.PolygonGeometry.createGeometry(extrudedPolygon);
            //             var polygonCone = new Cesium.GeometryInstance({
            //                 geometry: geometry,
            //                 modelMatrix: Cesium.Matrix4.IDENTITY,
            //                 attributes: {
            //                     color : Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(0, 0.5, 1.0,1)),
            //                     distanceDisplayCondition:  new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(0.0, 4200.0),
            //                 }
            //             });
            //             geometryInstances.push(polygonCone);
            //         }
            //     }
            // }

            // var vs = `
            //     attribute vec3 position3DHigh;
            //     attribute vec3 position3DLow;
            //     attribute vec3 a_position;
            //     attribute vec3 position;
            //     attribute vec3 v_positionEC;
            //     attribute float batchId;
            //     attribute vec4 color;
            //     varying vec4 v_color;
            //     varying vec3 v_positionMC;
            //     void main()
            //     {
            //         v_color = color;
            //         vec4 p = czm_computePosition();
            //         v_positionMC = v_positionEC;
            //         gl_Position = czm_modelViewProjectionRelativeToEye * p;
            //     }
            // `;

            // var fs = `
            // varying vec4 v_color;
            // varying vec3 v_positionMC;
            // precision mediump float;
            // void main()
            // {
            //     gl_FragColor = v_color;
            //     float position3DZ = v_positionMC.y;
            //     float randomNum1 = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;
            //     float channelNum = position3DZ / 20.0 + sin(randomNum1) * 0.5;
            //     gl_FragColor *= vec4(channelNum, channelNum, channelNum, 1.0);

            //     float randomNum2 = fract(czm_frameNumber / 360.0);
            //     randomNum2 = abs(randomNum2 - 0.5) * 2.0;
            //     float changeH = clamp(position3DZ / 300.0, 0.0, 1.0);
            //     float changeDiff = step(0.005, abs(changeH - randomNum2));
            //     gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - changeDiff);
            // }
            // `;
            // _this.viewer.scene.primitives.add(new Cesium.Primitive({
            //     geometryInstances: geometryInstances,
            //     appearance: new Cesium.EllipsoidSurfaceAppearance({
            //         aboveGround: true,
            //         material : Cesium.Material.fromType('Color'),
            //         fragmentShaderSource:  fs,
            //         vertexShaderSource: vs,
            //         renderState: {
            //             depthTest: {
            //                 enabled: true,
            //                 func: Cesium.DepthFunction.LESS_OR_EQUAL
            //             },
            //         },
            //     }),
            // }));

            var viewer = _this.viewer;
            var color = `vec4(0, 0.5, 1.0,1)`;
            _this.tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
                url: 'data/chengdu-1line/tileset.json',
                maximumScreenSpaceError: 60,//减少细粒度元素渲染，优化渲染效率
                shaderDebug: false,
                headVS: ` varying vec3 xs_positionMC;`,
                contentVS: ` xs_positionMC = a_position.xyz;`,
                headFS: ` varying vec3 xs_positionMC;`,
                contentFS: `
                    float position3DZ = xs_positionMC.z;
                    float randomNum1 = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;
                    float channelNum = position3DZ / 20.0 + sin(randomNum1) * 0.5;
                    gl_FragColor *= vec4(channelNum, channelNum, channelNum, 1.0);

                    float randomNum2 = fract(czm_frameNumber / 360.0);
                    randomNum2 = abs(randomNum2 - 0.5) * 2.0;
                    float changeH = clamp(position3DZ / 100.0, 0.0, 1.0);
                    float changeDiff = step(0.005, abs(changeH - randomNum2));
                    gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - changeDiff);
                `,
            }));
            _this.tileset.style = new Cesium.Cesium3DTileStyle({
                color : color,
            });
        },

       /**
        * 添加扫描线 depth关闭   lon:-74.01296152309055 lat:40.70524201566827 height:129.14366696393927
        * @param {*} viewer 
        * @param {*} center 扫描中心
        * @param {*} maxRadius 最大半径 米
        * @param {*} color 扫描颜色
        * @param {*} duration 持续时间 毫秒
        */
        addCircleScanPostStage: function (viewer, center, maxRadius, color, duration) {
            var scanColor = Cesium.Color.fromCssColorString(color);
            var cartographicCenter = new Cesium.Cartographic(Cesium.Math.toRadians(center[0]), Cesium.Math.toRadians(center[1]), center[2]||0);
            var ScanSegmentShader =
                "uniform sampler2D colorTexture;\n" +
                "uniform sampler2D depthTexture;\n" +
                "varying vec2 v_textureCoordinates;\n" +
                "uniform vec4 u_scanCenterEC;\n" +
                "uniform vec3 u_scanPlaneNormalEC;\n" +
                "uniform float u_radius;\n" +
                "uniform vec4 u_scanColor;\n" +

                "vec4 toEye(in vec2 uv, in float depth)\n" +
                " {\n" +
                " vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\n" +
                " vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);\n" +
                " posInCamera =posInCamera / posInCamera.w;\n" +
                " return posInCamera;\n" +
                " }\n" +

                "vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point)\n" +
                "{\n" +
                    "vec3 v01 = point -planeOrigin;\n" +
                    "float d = dot(planeNormal, v01) ;\n" +
                    "return (point - planeNormal * d);\n" +
                "}\n" +

                "float getDepth(in vec4 depth)\n" +
                "{\n" +
                    "float z_window = czm_unpackDepth(depth);\n" +
                    "z_window = czm_reverseLogDepth(z_window);\n" +
                    "float n_range = czm_depthRange.near;\n" +
                    "float f_range = czm_depthRange.far;\n" +
                    "return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\n" +
                "}\n" +

                "void main()\n" +
                "{\n" +
                    "gl_FragColor = texture2D(colorTexture, v_textureCoordinates);\n" +
                    "float depth = getDepth( texture2D(depthTexture, v_textureCoordinates));\n" +
                    "vec4 viewPos = toEye(v_textureCoordinates, depth);\n" +
                    "vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);\n" +
                    "float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);\n" +
                    "if(dis < u_radius)\n" +
                        "{\n" +
                        "float f = 1.0 -abs(u_radius - dis) / u_radius;\n" +
                        "f = pow(f, 4.0);\n" +
                        "gl_FragColor = mix(gl_FragColor, u_scanColor, f);\n" +
                    "}\n" +
                "}\n";

            var _Cartesian3Center = Cesium.Cartographic.toCartesian(cartographicCenter);
            var _Cartesian4Center = new Cesium.Cartesian4(_Cartesian3Center.x, _Cartesian3Center.y, _Cartesian3Center.z, 1);

            var _CartographicCenter1 = new Cesium.Cartographic(cartographicCenter.longitude, cartographicCenter.latitude, cartographicCenter.height + 500);
            var _Cartesian3Center1 = Cesium.Cartographic.toCartesian(_CartographicCenter1);
            var _Cartesian4Center1 = new Cesium.Cartesian4(_Cartesian3Center1.x, _Cartesian3Center1.y, _Cartesian3Center1.z, 1);

            var _time = (new Date()).getTime();

            var _scratchCartesian4Center = new Cesium.Cartesian4();
            var _scratchCartesian4Center1 = new Cesium.Cartesian4();
            var _scratchCartesian3Normal = new Cesium.Cartesian3();

            var ScanPostStage = new Cesium.PostProcessStage({
                fragmentShader: ScanSegmentShader,
                uniforms: {
                    u_scanCenterEC: function () {
                        return Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                    },
                    u_scanPlaneNormalEC: function () {
                        var temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                        var temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);
                        _scratchCartesian3Normal.x = temp1.x - temp.x;
                        _scratchCartesian3Normal.y = temp1.y - temp.y;
                        _scratchCartesian3Normal.z = temp1.z - temp.z;

                        Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);
                        return _scratchCartesian3Normal;
                    },
                    u_radius: function () {
                        return maxRadius * (((new Date()).getTime() - _time) % duration) / duration;
                    },
                    u_scanColor: scanColor
                }
            });

            viewer.scene.postProcessStages.add(ScanPostStage);
        },
       /**
        * 添加雷达扫描线 地形遮挡开启   lon:-74.01296152309055 lat:40.70524201566827 height:129.14366696393927
        * @param {*} viewer 
        * @param {*} center 扫描中心
        * @param {*} radius 半径 米
        * @param {*} color 扫描颜色
        * @param {*} duration 持续时间 毫秒
        */
       addRadarScanPostStage: function (viewer, center, radius, color, duration) {
        var scanColor = Cesium.Color.fromCssColorString(color);
        var cartographicCenter = new Cesium.Cartographic(Cesium.Math.toRadians(center[0]), Cesium.Math.toRadians(center[1]), center[2]||0);
            var ScanSegmentShader =
                "uniform sampler2D colorTexture;\n" +
                "uniform sampler2D depthTexture;\n" +
                "varying vec2 v_textureCoordinates;\n" +
                "uniform vec4 u_scanCenterEC;\n" +
                "uniform vec3 u_scanPlaneNormalEC;\n" +
                "uniform vec3 u_scanLineNormalEC;\n" +
                "uniform float u_radius;\n" +
                "uniform vec4 u_scanColor;\n" +

                "vec4 toEye(in vec2 uv, in float depth)\n" +
                " {\n" +
                " vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\n" +
                " vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);\n" +
                " posInCamera =posInCamera / posInCamera.w;\n" +
                " return posInCamera;\n" +
                " }\n" +

                "bool isPointOnLineRight(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt)\n" +
                "{\n" +
                    "vec3 v01 = testPt - ptOnLine;\n" +
                    "normalize(v01);\n" +
                    "vec3 temp = cross(v01, lineNormal);\n" +
                    "float d = dot(temp, u_scanPlaneNormalEC);\n" +
                    "return d > 0.5;\n" +
                "}\n" +

                "vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point)\n" +
                "{\n" +
                    "vec3 v01 = point -planeOrigin;\n" +
                    "float d = dot(planeNormal, v01) ;\n" +
                    "return (point - planeNormal * d);\n" +
                "}\n" +

                "float distancePointToLine(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt)\n" +
                "{\n" +
                    "vec3 tempPt = pointProjectOnPlane(lineNormal, ptOnLine, testPt);\n" +
                    "return length(tempPt - ptOnLine);\n" +
                "}\n" +

                "float getDepth(in vec4 depth)\n" +
                "{\n" +
                    "float z_window = czm_unpackDepth(depth);\n" +
                    "z_window = czm_reverseLogDepth(z_window);\n" +
                    "float n_range = czm_depthRange.near;\n" +
                    "float f_range = czm_depthRange.far;\n" +
                    "return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\n" +
                "}\n" +

                "void main()\n" +
                "{\n" +
                    "gl_FragColor = texture2D(colorTexture, v_textureCoordinates);\n" +
                    "float depth = getDepth( texture2D(depthTexture, v_textureCoordinates));\n" +
                    "vec4 viewPos = toEye(v_textureCoordinates, depth);\n" +
                    "vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);\n" +
                    "float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);\n" +
                    "float twou_radius = u_radius * 2.0;\n" +
                    "if(dis < u_radius)\n" +
                    "{\n" +
                        "float f0 = 1.0 -abs(u_radius - dis) / u_radius;\n" +
                        "f0 = pow(f0, 64.0);\n" +
                        "vec3 lineEndPt = vec3(u_scanCenterEC.xyz) + u_scanLineNormalEC * u_radius;\n" +
                        "float f = 0.0;\n" +
                        "if(isPointOnLineRight(u_scanCenterEC.xyz, u_scanLineNormalEC.xyz, prjOnPlane.xyz))\n" +
                        "{\n" +
                            "float dis1= length(prjOnPlane.xyz - lineEndPt);\n" +
                            "f = abs(twou_radius -dis1) / twou_radius;\n" +
                            "f = pow(f, 3.0);\n" +
                        "}\n" +
                        "gl_FragColor = mix(gl_FragColor, u_scanColor, f + f0);\n" +
                    "}\n" +
                "}\n";

            var _Cartesian3Center = Cesium.Cartographic.toCartesian(cartographicCenter);
            var _Cartesian4Center = new Cesium.Cartesian4(_Cartesian3Center.x, _Cartesian3Center.y, _Cartesian3Center.z, 1);

            var _CartographicCenter1 = new Cesium.Cartographic(cartographicCenter.longitude, cartographicCenter.latitude, cartographicCenter.height + 500);
            var _Cartesian3Center1 = Cesium.Cartographic.toCartesian(_CartographicCenter1);
            var _Cartesian4Center1 = new Cesium.Cartesian4(_Cartesian3Center1.x, _Cartesian3Center1.y, _Cartesian3Center1.z, 1);

            var _CartographicCenter2 = new Cesium.Cartographic(cartographicCenter.longitude + Cesium.Math.toRadians(0.001), cartographicCenter.latitude, cartographicCenter.height);
            var _Cartesian3Center2 = Cesium.Cartographic.toCartesian(_CartographicCenter2);
            var _Cartesian4Center2 = new Cesium.Cartesian4(_Cartesian3Center2.x, _Cartesian3Center2.y, _Cartesian3Center2.z, 1);
            var _RotateQ = new Cesium.Quaternion();
            var _RotateM = new Cesium.Matrix3();

            var _time = (new Date()).getTime();

            var _scratchCartesian4Center = new Cesium.Cartesian4();
            var _scratchCartesian4Center1 = new Cesium.Cartesian4();
            var _scratchCartesian4Center2 = new Cesium.Cartesian4();
            var _scratchCartesian3Normal = new Cesium.Cartesian3();
            var _scratchCartesian3Normal1 = new Cesium.Cartesian3();

            var ScanPostStage = new Cesium.PostProcessStage({
                fragmentShader: ScanSegmentShader,
                uniforms: {
                    u_scanCenterEC: function () {
                        return Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                    },
                    u_scanPlaneNormalEC: function () {
                        var temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                        var temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);
                        _scratchCartesian3Normal.x = temp1.x - temp.x;
                        _scratchCartesian3Normal.y = temp1.y - temp.y;
                        _scratchCartesian3Normal.z = temp1.z - temp.z;

                        Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);
                        return _scratchCartesian3Normal;
                    },
                    u_radius: radius,
                    u_scanLineNormalEC: function () {
                        var temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                        var temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);
                        var temp2 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center2, _scratchCartesian4Center2);

                        _scratchCartesian3Normal.x = temp1.x - temp.x;
                        _scratchCartesian3Normal.y = temp1.y - temp.y;
                        _scratchCartesian3Normal.z = temp1.z - temp.z;

                        Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);

                        _scratchCartesian3Normal1.x = temp2.x - temp.x;
                        _scratchCartesian3Normal1.y = temp2.y - temp.y;
                        _scratchCartesian3Normal1.z = temp2.z - temp.z;

                        var tempTime = (((new Date()).getTime() - _time) % duration) / duration;
                        Cesium.Quaternion.fromAxisAngle(_scratchCartesian3Normal, tempTime * Cesium.Math.PI * 2, _RotateQ);
                        Cesium.Matrix3.fromQuaternion(_RotateQ, _RotateM);
                        Cesium.Matrix3.multiplyByVector(_RotateM, _scratchCartesian3Normal1, _scratchCartesian3Normal1);
                        Cesium.Cartesian3.normalize(_scratchCartesian3Normal1, _scratchCartesian3Normal1);
                        return _scratchCartesian3Normal1;
                    },
                    u_scanColor: scanColor
                }
            });

            viewer.scene.postProcessStages.add(ScanPostStage);
        }
    };
}


/**
 * 
 * 站点人流动画
 * @param Viewer viewer 视图对象
 * @param {coordinates: null, building: null, grid: null} data 数据参数：站点位置、楼宇数据、网格数据
 */
var StationPopulationAnimation = (function () {
    function _(viewer, data) {
        this.options = {
        };
        this.animationStatus = true;
        this.tansLines = [];
        this.gridlines = [];
        this.grids = [];
        this.buildings = [];
        this.postProcessStage;
        this.data = data;
        this.viewer = viewer;
        this._init();
    }

    _.prototype._init = function () {
        var _this = this;
        
        //响应站点
        // this.postProcessStage = addCircleScanPostStage(_this.viewer, _this.data.coordinates, 50, "RGBA(0, 255, 0.0, 1)", 2000);
        
        //加载楼宇
        // _this.loadBuildings();

        //加载网格
        var grids = _this.data.grid;
        if(grids){
            for (let i = 0; i < grids.length; i++) {
                var grid = grids[i];
                var position = Cesium.Cartesian3.fromDegrees(grid.center[0], grid.center[1],200);
                grid.position = position;
                grid.stationCoordinates = _this.data.coordinates;
                
                //绘制网格
                this.grids.push(new GridPrimitive(_this.viewer, grid));
            }
        }        
    };

    //加载楼宇
    // _.prototype.loadBuildings = function () {
    //     var _this = this;
    //     var buildings = _this.data.building;
    //     if(buildings){
    //         for (let i = 0; i < buildings.length; i++) {
    //             var building = buildings[i];
    //             var options = {};
    //             options.polygon = {
    //                 outline: true,
    //                 show : true,
    //                 hierarchy: Cesium.Cartesian3.fromDegreesArray(building.coordinates.join().split(",")),
    //                 height: 0,
    //                 extrudedHeight: building.height,
    //                 distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4200),
    //                 // material: Cesium.Color.fromCssColorString("#45f2f2"),
    //                 material: new Cesium.ImageMaterialProperty({
    //                     image: '/tydic-sichuan-dmap-demo/image/building1.png',
    //                     transparent : true,
    //                     repeat : new Cesium.Cartesian2(1.0, 1.0),
    //                 })
    //             };
    //             _this.buildings.push(_this.viewer.entities.add(options));
    //         }
    //     }
    // }

    //加载到站动画
    _.prototype.loadArriveAnimation = function () {
        //加载网格连线动画
        this.loadGridsLineAnimation();

        //换乘站动画
        this.loadTransStationAnimation();
        //4秒后继续前进
        this.timerCode = setTimeout(() => {
            if(this.animationStatus){
                lineGIS.gotoNextStation();
            }
        }, 4000);
    }

    //停止动画
    _.prototype.stopAnimation = function () {
        console.log("停止动画");
        this.animationStatus = false;
        window.clearTimeout(this.timerCode);
        this.timerCode = undefined;
    }

    //开始动画
    _.prototype.startAnimation = function () {
        this.stopAnimation();
        console.log("继续动画");
        this.animationStatus = true;
        lineGIS.gotoNextStation();
    }

    //添加网格连线动画
    _.prototype.loadGridsLineAnimation = function () {
        var _this = this;
        //加载网格
        var grids = _this.data.grid;
        if(grids){
            for (let i = 0; i < grids.length; i++) {
                var grid = grids[i];
                var start = grid.center;
                var end = grid.stationCoordinates;
                if(grid.moveOut){
                    start =  end;
                    end = grid.center;
                }
                var traceArr = dmap.utils.geom.parabolaEquation(start, end, 100, 32);
                traceArr = traceArr.join().split(",");
                var traceEntity = _this.viewer.entities.add({
                    polyline: {
                        positions: Cesium.Cartesian3.fromDegreesArrayHeights(traceArr),
                        width: 2,
                        material: new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.fromCssColorString("#ff9800"), 2000)
                    }
                });
                
                //绘制网格
                this.gridlines.push(traceEntity);
            }
        } 
    }

    //加载换乘站动画
    _.prototype.loadTransStationAnimation = function () {
        var _this = this;
        if(_this.data.trans_flag == 1){
            var stations = self.data.transStation[_this.data.name];
            if(stations){
                for (let i = 0; i < stations.length; i++) {
                    const station = stations[i];
                    if(station.line_id == 1){
                        continue;
                    }
                    var stations2 = self.data.subway[station.line_id].station;
                    for (let j = 0; j < stations2.length; j++) {
                        const s = stations2[j];
                        if(s.station_id == station.station_id+1 || s.station_id == station.station_id-1){
                            var lineArr = [station.coordinates[0], station.coordinates[1], s.coordinates[0], s.coordinates[1]];
                            var options = {};
                            options.polyline = {
                                show : true,
                                positions: Cesium.Cartesian3.fromDegreesArray(lineArr),
                                width: 10,
                                // material: new Cesium.PolylineGlowMaterialProperty({ //发光线
                                //     glowPower : 0.2,
                                //     color : Cesium.Color.RED
                                // }),
                                material: new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.fromCssColorString("#ff9800"), 2000),
                                clampToGround: true,
                            };
                            _this.tansLines.push(_this.viewer.entities.add(options));
                        }
                    }
                }
            }
        }
    }

    /**
     * 重新加载数据
     */
    _.prototype.reload = function (data) {
        this.data = data||this.data;
        this.clearTraceLine();
        this._init();
    }

    /**
     * 清除轨迹线
     */
    _.prototype.clearTraceLine = function () {
        for (let i = 0; i < this.tansLines.length; i++) {
            const entity = this.tansLines[i];
            this.viewer.entities.remove(entity);
        }
        this.tansLines = [];
        
        for (let i = 0; i < this.gridlines.length; i++) {
            const entity = this.gridlines[i];
            this.viewer.entities.remove(entity);
        }
        this.gridlines = [];
    }

    //清除所有
    _.prototype.clear = function () {
        this.stopAnimation();
        this.animationStatus = true;

        for (let i = 0; i < this.tansLines.length; i++) {
            const entity = this.tansLines[i];
            this.viewer.entities.remove(entity);
        }
        this.tansLines = [];
  
        for (let i = 0; i < this.gridlines.length; i++) {
            const entity = this.gridlines[i];
            this.viewer.entities.remove(entity);
        }
        this.gridlines = [];
        
        for (let i = 0; i < this.grids.length; i++) {
            const grid = this.grids[i];
            grid.clear();
        }
        this.grids = [];
     
        // for (let i = 0; i < this.buildings.length; i++) {
        //     const building = this.buildings[i];
        //     this.viewer.entities.remove(building);
        // }
        // this.buildings = [];

        if(this.postProcessStage){
            this.viewer.scene.postProcessStages.remove(this.postProcessStage);
        }
        this.postProcessStage = undefined;
    }

    return _;
})();

/**
 * 自定义网格对象
 */
var GridPrimitive = (function () {
    function _(viewer, data){

        this.viewer = viewer;
        this.data = data;
        this._init();
    }

    _.prototype._init = function () {
        this.loadGrids();
    }

    //添加网格
    _.prototype.loadGrids = function () {
        var _this = this;
        var grid = _this.data;



        var wallColor = '';
        if (grid.user_cnt > 250) {
            wallColor = '#ff0c00';
        } else if (grid.user_cnt > 180) {
            wallColor = '#ffe000';
        } else if (grid.user_cnt > 120) {
            wallColor = '#efff00';
        } else if (grid.user_cnt > 60) {
            wallColor = '#84ff00';
        } else {
            wallColor = '#3aad00';
        }

        var options = {};
        // options.polyline = {
        //     show : true,
        //     positions: Cesium.Cartesian3.fromDegreesArray(grid.coordinates.join().split(",")),
        //     width: 2,
        //     // material: new Cesium.PolylineGlowMaterialProperty({ //发光线
        //     //     glowPower : 0.2,
        //     //     color : Cesium.Color.RED
        //     // }),
        //     material: new Cesium.PolylineGlowMaterialProperty({
        //         color: wallColor,
        //     }),
        //     clampToGround: true,
        // };

        // options.polygon = {
        //     outline: true,
        //     show : true,
        //     hierarchy: Cesium.Cartesian3.fromDegreesArray(grid.coordinates.join().split(",")),
        //     height: 0,
        //     extrudedHeight: 10,
        //     distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 100000),
        //     // material: Cesium.Color.fromCssColorString("#2f5d41"),
        //     material: new Cesium.ImageMaterialProperty({
        //         image: '/tydic-sichuan-dmap-demo/image/wall.png',
        //         transparent : true,
        //         repeat : new Cesium.Cartesian2(1.0, 1.0),
        //     }),
        // };

        // var time = (new Date()).getTime();
        options.label = {
            show: true,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            fillColor: Cesium.Color.WHITE,
            // labelStyle: Cesium.LabelStyle.FILL_AND_OUTLINE,
            scaleByDistance : new Cesium.NearFarScalar(0, 3, 4.0e3, 0.5),
            distanceDisplayCondition : new Cesium.DistanceDisplayCondition(0.0, 4.0e3),
            showBackground: true,
            backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.4),
            font: '14px sans-serif',
            text: grid.area_name + "\n" + grid.user_cnt
            // text: new Cesium.CallbackProperty(function (){
            //     if((new Date()).getTime() - time > 2000){
            //         time = (new Date()).getTime();
            //         if(!isNaN(grid.user_cnt) && grid.moveOut){
            //             grid.user_cnt += Math.round(Math.random()*10);
            //         } else if(!isNaN(grid.user_cnt) && !grid.moveOut){
            //             grid.user_cnt -= Math.round(Math.random()*10);
            //         }
            //     }

            //     if(grid.user_cnt < 0){
            //         grid.user_cnt = 0;

            //         if(_this.lineEntity){
            //             _this.viewer.entities.remove(_this.lineEntity);
            //         }
            //         _this.lineEntity = undefined;
            //     }

            //     return grid.user_cnt+""
            // }, false)
        };

        var tempArr = grid.coordinates.join().split(",");
        var wallCoordinates = [];
        for (let i = 0; i < tempArr.length; i+=2) {
            wallCoordinates.push(tempArr[i]);
            wallCoordinates.push(tempArr[i+1]);
            wallCoordinates.push(50);
        }

        options.wall = {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(wallCoordinates.join().split(",")),
            material: getColorRampMaterial([0.0, 0.05, 0.08, 0.1, 0.12, 0.16, 0.2],wallColor, true),
        };
        options.position = grid.position;
        _this.entity = _this.viewer.entities.add(options);
    }

    //清空绘制
    _.prototype.clear = function () {
        if(this.entity){
            this.viewer.entities.remove(this.entity);
        }
        this.entity = undefined;
    }
    return _;
})();


/**
 * 自定义楼宇对象
 */
// var BuildingPrimitive = (function () {
//     function _(viewer, data){

//         this.viewer = viewer;
//         this.data = data;
//         this.height = 10;
//         this._init();
//     }
    
//     _.prototype._init = function () {
//         var _this = this;
//         var building = _this.data;
//         var options = {};
//         var startTime = (new Date()).getTime();
//         options.polygon = {
//             outline: true,
//             show : true,
//             hierarchy: Cesium.Cartesian3.fromDegreesArray(building.coordinates.join().split(",")),
//             height: 0,
//             extrudedHeight: 10,
//             // extrudedHeight: new Cesium.CallbackProperty(function (){
//             //     if((new Date()).getTime() - startTime > 2000){
//             //         startTime = (new Date()).getTime();
//             //         if(_this.height <= building.height){
//             //             _this.height += 50;
//             //         } else {
//             //             _this.height = building.height;
//             //         }

//             //         console.log(_this.height);
//             //     }

//             //     return _this.height;
//             // }, false),
//             distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 100000),
//             // material: Cesium.Color.fromCssColorString("#2f5d41"),
//             material: new Cesium.ImageMaterialProperty({
//                 image: '/tydic-sichuan-dmap-demo/image/wall.png',
//                 transparent : true,
//                 repeat : new Cesium.Cartesian2(1.0, 1.0),
//             })
//         };

//         _this.entity = _this.viewer.entities.add(options);

//         // setInterval(() => {
//         //     if((new Date()).getTime() - startTime > 2000){
//         //         startTime = (new Date()).getTime();
//         //         if(_this.height <= building.height){
//         //             _this.height += 50;
//         //         } else {
//         //             _this.height = building.height;
//         //         }

//         //         console.log(_this.height);

//         //         _this.entity.extrudedHeight = _this.height;
//         //     }
//         // }, 1000);
//     }
    
//     _.prototype.clear = function () {
//         if(this.entity){
//             this.viewer.entities.remove(this.entity);
//         }
//         this.entity = undefined;
//     }
//     return _;
// })();

/**
 * 添加扫描线 depth关闭   lon:-74.01296152309055 lat:40.70524201566827 height:129.14366696393927
 * @param {*} viewer 
 * @param {*} center 扫描中心
 * @param {*} maxRadius 最大半径 米
 * @param {*} color 扫描颜色
 * @param {*} duration 持续时间 毫秒
 */
var addCircleScanPostStage = function (viewer, center, maxRadius, color, duration) {
    var scanColor = Cesium.Color.fromCssColorString(color);
    var cartographicCenter = new Cesium.Cartographic(Cesium.Math.toRadians(center[0]), Cesium.Math.toRadians(center[1]), center[2]||0);
    var ScanSegmentShader =
        "uniform sampler2D colorTexture;\n" +
        "uniform sampler2D depthTexture;\n" +
        "varying vec2 v_textureCoordinates;\n" +
        "uniform vec4 u_scanCenterEC;\n" +
        "uniform vec3 u_scanPlaneNormalEC;\n" +
        "uniform float u_radius;\n" +
        "uniform vec4 u_scanColor;\n" +

        "vec4 toEye(in vec2 uv, in float depth)\n" +
        " {\n" +
        " vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\n" +
        " vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);\n" +
        " posInCamera =posInCamera / posInCamera.w;\n" +
        " return posInCamera;\n" +
        " }\n" +

        "vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point)\n" +
        "{\n" +
            "vec3 v01 = point -planeOrigin;\n" +
            "float d = dot(planeNormal, v01) ;\n" +
            "return (point - planeNormal * d);\n" +
        "}\n" +

        "float getDepth(in vec4 depth)\n" +
        "{\n" +
            "float z_window = czm_unpackDepth(depth);\n" +
            "z_window = czm_reverseLogDepth(z_window);\n" +
            "float n_range = czm_depthRange.near;\n" +
            "float f_range = czm_depthRange.far;\n" +
            "return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\n" +
        "}\n" +

        "void main()\n" +
        "{\n" +
            "gl_FragColor = texture2D(colorTexture, v_textureCoordinates);\n" +
            "float depth = getDepth( texture2D(depthTexture, v_textureCoordinates));\n" +
            "vec4 viewPos = toEye(v_textureCoordinates, depth);\n" +
            "vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);\n" +
            "float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);\n" +
            "if(dis < u_radius)\n" +
                "{\n" +
                "float f = 1.0 -abs(u_radius - dis) / u_radius;\n" +
                "f = pow(f, 4.0);\n" +
                "gl_FragColor = mix(gl_FragColor, u_scanColor, f);\n" +
            "}\n" +
        "}\n";

    var _Cartesian3Center = Cesium.Cartographic.toCartesian(cartographicCenter);
    var _Cartesian4Center = new Cesium.Cartesian4(_Cartesian3Center.x, _Cartesian3Center.y, _Cartesian3Center.z, 1);

    var _CartographicCenter1 = new Cesium.Cartographic(cartographicCenter.longitude, cartographicCenter.latitude, cartographicCenter.height + 500);
    var _Cartesian3Center1 = Cesium.Cartographic.toCartesian(_CartographicCenter1);
    var _Cartesian4Center1 = new Cesium.Cartesian4(_Cartesian3Center1.x, _Cartesian3Center1.y, _Cartesian3Center1.z, 1);

    var _time = (new Date()).getTime();

    var _scratchCartesian4Center = new Cesium.Cartesian4();
    var _scratchCartesian4Center1 = new Cesium.Cartesian4();
    var _scratchCartesian3Normal = new Cesium.Cartesian3();

    var ScanPostStage = new Cesium.PostProcessStage({
        fragmentShader: ScanSegmentShader,
        uniforms: {
            u_scanCenterEC: function () {
                return Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
            },
            u_scanPlaneNormalEC: function () {
                var temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                var temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);
                _scratchCartesian3Normal.x = temp1.x - temp.x;
                _scratchCartesian3Normal.y = temp1.y - temp.y;
                _scratchCartesian3Normal.z = temp1.z - temp.z;

                Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);
                return _scratchCartesian3Normal;
            },
            u_radius: function () {
                return maxRadius * (((new Date()).getTime() - _time) % duration) / duration;
            },
            u_scanColor: scanColor
        }
    });

    return viewer.scene.postProcessStages.add(ScanPostStage);
};

/**
 * 获取渐变材质 getColorRampMaterial([0.1, 0.2, 0.3, 0.5, 0.7, 0.9, 1.0],"#FF0000", true)
 * @param {*} elevationRamp 
 * @param {*} color 
 * @param {*} isVertical 
 */
var getColorRampMaterial = function (elevationRamp, color, isVertical) {
    //十六进制颜色值的正则表达式  
    function colorHexToRgba(value, opacity){
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;  
        var sColor = value;  
        if(sColor && reg.test(sColor)){  
            if(sColor.length === 4){  
                var sColorNew = "#";  
                for(var i=1; i<4; i+=1){  
                    sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));     
                }  
                sColor = sColorNew;  
            }  
            //处理六位的颜色值  
            var sColorChange = [];  
            for(var i=1; i<7; i+=2){  
                sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));    
            }  
            return "rgba(" + sColorChange.join(",") + ","+opacity+")"; 
            
        } else {  
            return sColor;    
        }
    };
    
    var ramp = document.createElement('canvas');
    ramp.width = isVertical ? 1 : 100;
    ramp.height = isVertical ? 100 : 1;
    var ctx = ramp.getContext('2d');
    ctx.fillStyle = 'rgba(255, 255, 255, 0)';
    var values = elevationRamp;
    var grd = isVertical ? ctx.createLinearGradient(0, 0, 0, 100) : ctx.createLinearGradient(0, 0, 100, 0);
    
    grd.addColorStop(values[0], colorHexToRgba(color, values[0])); 
    grd.addColorStop(values[1], colorHexToRgba(color, values[1])); 
    grd.addColorStop(values[2], colorHexToRgba(color, values[2])); 
    grd.addColorStop(values[3], colorHexToRgba(color, values[3])); 
    grd.addColorStop(values[4], colorHexToRgba(color, values[4])); 
    grd.addColorStop(values[5], colorHexToRgba(color, values[5]));  
    grd.addColorStop(values[6], colorHexToRgba(color, values[6])); 

    ctx.fillStyle = grd;
    if (isVertical)
        ctx.fillRect(0, 0, 1, 100);
    else
        ctx.fillRect(0, 0, 100, 1);
    // return ramp;

    var material = new Cesium.ImageMaterialProperty({
        image : ramp,
        transparent: true
    });

    return material;
};
