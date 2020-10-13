import {load, pageEvent} from '../../main.js'
import { initCharts } from '../../expamle/test/js/progress';
import GisConfig from '../../gismap/js/gisConfig.js'

var gis = new GisConfig();
window.gis = gis;

gis.load = load;
// $("#map").css("position","absolute");
// $("#map").css("z-index","100");
/**
 * 初始化界面
 */
$(function () {
    gis.init();
    gis.flyHome();
    gis.bindEvent();
    gis.loadBuilding();
    gis.loadAreaWall();
    gis.loadCityRoad();
    gis.loadSignalTower();
    gis.loadSignalSimulation();
    gis.loadRRUEquipment();
    gis.loadSignalHouse();
    gis.loadSourceControl();
    gis.loadScreenControl();
    $(".removeModel").on("click",function(){
      gis.loadSectorInfo("1_2")
    })
    $('.problemDesigin').on('click',function(){
      gis.bbuBreakViewDraw();
      $('.main .right').hide();
      $('.main .rightcopy').show();
      initCharts();
    })
    pageEvent();
});

/**
 * 初始化地图
 */
gis.init = function(){
    var _this = this;
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MzIwZmMxZC1lMGQzLTRmOWMtYmFiNS0yMjIwMmVhYzVkYzkiLCJpZCI6NDkxMCwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0MjAxMjczMX0._-wzI2SrgF0s6FmKWV97mInajiOshMGzOTgUs-cuX-U';
    
    //高德
    var  baselayerUrl = {
        url: '//webrd{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
        value: ['01', '02', '03', '04']
    };
    // var baseLayer = new Cesium.UrlTemplateImageryProvider({
    //     url: baselayerUrl.url,
    //     subdomains: baselayerUrl.value,
    //     tileWidth: 256,
    //     tileHeight: 256,
    //     minimumLevel: 3,
    //     maximumLevel: 18
    //     });

    //MapServer
    // var baseLayer = new Cesium.ArcGisMapServerImageryProvider({
    //     url: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
    //     enablePickFeatures: false,
    // });

    //谷歌影像地图
    var baseLayer=new Cesium.UrlTemplateImageryProvider({            	
        url:'http://www.google.cn/maps/vt?lyrs=s@800&x={x}&y={y}&z={z}',  
        tilingScheme:new Cesium.WebMercatorTilingScheme(),            	
        minimumLevel:1,            
        maximumLevel:20        
    }); 

    _this.viewer = new Cesium.Viewer('map', {
        requestRenderMode: false, // 进入后台停止渲染
        // targetFrameRate: 30, // 帧率30，节约GPU资源
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
    
    _this.viewer.scene.globe.depthTestAgainstTerrain = true;//地形相关
    _this.viewer.scene.debugShowFramesPerSecond = true;//FPS
    _this.viewer._cesiumWidget._creditContainer.style.display = "none";//去除版权信息
    _this.viewer.scene.globe.enableLighting = false;
    _this.viewer.scene.highDynamicRange = true;// 解决瓦片地图偏灰问题
    _this.webMercatorProjection = new Cesium.WebMercatorProjection(_this.viewer.scene.globe.ellipsoid);//墨卡托坐标转换工具

    var layers =  _this.viewer.imageryLayers;
    var tilemapLayer = layers.get(0);
    tilemapLayer.brightness = 0.3;
    // tilemapLayer.contrast = 1.45;
    // tilemapLayer.hue = 2.4;
    // tilemapLayer.saturation = 2;
    // tilemapLayer.gamma = 0.6;
    _this.tilemapLayer = tilemapLayer;

    _this.movesilhouettes = {
        model: undefined,
        originalColor: undefined,
        originalSize: undefined
    }


    //亮处高亮（影响渲染速度）
    // var bloom = _this.viewer.scene.postProcessStages.bloom;
    // bloom.enabled = false;
    // bloom.glowOnly = false;
    // bloom.contrast = 119;
    // bloom.brightness = -0.4;
    // bloom.delta = 0.9;
    // bloom.sigma = 3.78;
    // bloom.stepSize = 5;
    // bloom.isSelected = false;

    //设置操作习惯,更换中键和右键
    // this.viewer.scene.screenSpaceCameraController.tiltEventTypes = [
    //     Cesium.CameraEventType.RIGHT_DRAG, Cesium.CameraEventType.PINCH,
    //     { eventType: Cesium.CameraEventType.LEFT_DRAG, modifier: Cesium.KeyboardEventModifier.CTRL },
    //     { eventType: Cesium.CameraEventType.RIGHT_DRAG, modifier: Cesium.KeyboardEventModifier.CTRL }
    // ];
    // this.viewer.scene.screenSpaceCameraController.zoomEventTypes = [
    //     Cesium.CameraEventType.MIDDLE_DRAG, Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH];
};

/**
 * 回到主页
 */
gis.flyHome = function() {
    var _this = this;
    _this.viewer.camera.setView({
        destination: {
            x: 194845.3009783988,
            y: 4606109.729112264,
            z: 4396100.943310371
        },
        orientation: {
            heading: 0.14547219543368328, // east, default value is 0.0 (north)
            pitch: -0.9000425306187401,    // default value (looking down)
            roll: 0.0007856846629081815                            // default value
        }
    });
};

/**
 * 绑定事件
 */
gis.bindEvent = function(){
    var _this = this;
    //事件
    var event = new Cesium.ScreenSpaceEventHandler(_this.viewer.scene.canvas);
    event.setInputAction(function(evt){
        var pixel = evt.position;
        
        //坐标拾取
        var cartesian3 = _this.viewer.scene.globe.pick(_this.viewer.camera.getPickRay(pixel),_this.viewer.scene);
        if(cartesian3){
            var ellipsoid = _this.viewer.scene.globe.ellipsoid;
            var cartographic = ellipsoid.cartesianToCartographic(cartesian3);
            var lat = Cesium.Math.toDegrees(cartographic.latitude);
            var lng = Cesium.Math.toDegrees(cartographic.longitude);

            var coordinate = [lng, lat];
            coordinate[0] = Number(coordinate[0]);
            coordinate[1] = Number(coordinate[1]);
            console.log(coordinate);
        }

        //要素拾取
        var pickedFeature = _this.viewer.scene.pick(pixel);
        if (Cesium.defined(pickedFeature)) {
            console.log(pickedFeature);
            if(pickedFeature.id && pickedFeature.id.onClick){
                pickedFeature.id.onClick();
            }
            
            if(pickedFeature.primitive && pickedFeature.primitive.onClick){
                pickedFeature.primitive.onClick();
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    event.setInputAction(function(evt){

        if(_this.tipInfoWin){
            _this.tipInfoWin.destory();
        }

        if(_this.movesilhouettes.model){
            _this.movesilhouettes.model.silhouetteSize = _this.movesilhouettes.originalSize;
            _this.movesilhouettes.model.originalColor = _this.movesilhouettes.originalColor;
            _this.movesilhouettes.model = undefined;
            _this.movesilhouettes.originalSize = undefined;
            _this.movesilhouettes.originalColor = undefined;
        }

        var pixel = evt.endPosition;
        var pickedFeature = _this.viewer.scene.pick(pixel);
        if(!Cesium.defined(pickedFeature)) return;

        if(pickedFeature.id && pickedFeature.id.model){
            _this.movesilhouettes.model = pickedFeature.id.model;
            _this.movesilhouettes.originalSize = _this.movesilhouettes.model.silhouetteSize;
            _this.movesilhouettes.originalColor = _this.movesilhouettes.model.originalColor;
            _this.movesilhouettes.model.silhouetteColor = Cesium.Color.AQUA;
            _this.movesilhouettes.model.silhouetteSize = 2;
        }

        if(pickedFeature.primitive && pickedFeature.primitive instanceof Cesium.Model){
            _this.movesilhouettes.model = pickedFeature.primitive;
            _this.movesilhouettes.originalSize = _this.movesilhouettes.model.silhouetteSize;
            _this.movesilhouettes.originalColor = _this.movesilhouettes.model.originalColor;
            _this.movesilhouettes.model.silhouetteColor = Cesium.Color.AQUA;
            _this.movesilhouettes.model.silhouetteSize = 2;
        }

        if(pickedFeature.id && pickedFeature.id.onMouseMove){
            pickedFeature.id.onMouseMove();
        }
        
        if(pickedFeature.primitive && pickedFeature.primitive.onMouseMove){
            pickedFeature.primitive.onMouseMove();
        }
    },Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    event.setInputAction(function(evt){
        gis.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
    },Cesium.ScreenSpaceEventType.RIGHT_CLICK);
};

/**
 * 相机跟踪点
 */
gis.addTracePosition = function(position) {
    var heading = Cesium.Math.toRadians(50.0);
    var pitch = Cesium.Math.toRadians(-20.0);
    var range = 2000.0;
    var transform = Cesium.Transforms.eastNorthUpToFixedFrame(position);
    this.viewer.camera.lookAtTransform(transform, new Cesium.HeadingPitchRange(heading, pitch, range));
};

/**
 * 加载Gis屏幕设置
 */
gis.loadScreenControl = function() {
    var _this = this;

    //全屏
    var screenFullSvg = `<?xml version="1.0" encoding="UTF-8"?>
    <svg viewBox="0 0 128 128" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <!-- Generator: Sketch 55.2 (78181) - https://sketchapp.com -->
        <desc>Created with Sketch.</desc>
        <g id="页面1" stroke="none" stroke-width="1" fill="#9faae8" fill-rule="evenodd">
            <g id="图层应用图标" transform="translate(-1420.000000, -220.000000)" fill-rule="nonzero">
                <g id="全屏" transform="translate(1420.000000, 220.000000)">
                    <path d="M86.8769231,0.136094675 L121.584615,0.136094675 C124.784615,0.136094675 127.359763,2.73017751 127.359763,5.9112426 C127.359763,9.1112426 124.76568,11.6863905 121.584615,11.6863905 L86.8769231,11.6863905 C83.6769231,11.6863905 81.1017751,9.09230769 81.1017751,5.9112426 C81.1017751,2.73017751 83.695858,0.136094675 86.8769231,0.136094675 Z M86.8769231,115.809467 L121.584615,115.809467 C124.784615,115.809467 127.359763,118.40355 127.359763,121.584615 C127.359763,124.784615 124.76568,127.359763 121.584615,127.359763 L86.8769231,127.359763 C83.6769231,127.359763 81.1017751,124.76568 81.1017751,121.584615 C81.1017751,118.384615 83.695858,115.809467 86.8769231,115.809467 Z M5.93017751,115.809467 L40.6378698,115.809467 C43.8378698,115.809467 46.4130178,118.40355 46.4130178,121.584615 C46.4130178,124.784615 43.8189349,127.359866 40.6378698,127.359866 L5.93017751,127.359866 C2.73017751,127.378698 0.136094675,124.784615 0.136094675,121.584615 C0.136094675,118.384615 2.73017751,115.809467 5.93017751,115.809467 L5.93017751,115.809467 Z" id="形状"></path>
                    <path d="M10.0011834,109.731361 L34.5408284,85.191716 C35.9988166,83.695858 38.1384615,83.0899408 40.164497,83.6201183 C42.1905325,84.1502959 43.7621302,85.7218935 44.2923077,87.747929 C44.8224852,89.7739645 44.216568,91.9136095 42.7207101,93.3715976 L18.1810651,117.911243 C15.9088757,120.107692 12.3112426,120.069822 10.0769231,117.835503 C7.84260355,115.601183 7.82366864,112.00355 10.0011834,109.731361 L10.0011834,109.731361 Z M85.191716,34.5408284 L109.731361,10.0011834 C111.189349,8.50532544 113.328994,7.89940828 115.35503,8.4295858 C117.381065,8.95976331 118.952663,10.5313609 119.48284,12.5573964 C120.013018,14.583432 119.407101,16.7230769 117.911243,18.1810651 L93.3715976,42.7207101 C91.0994083,44.9171598 87.5017751,44.8792899 85.2674556,42.6449704 C83.0331361,40.4295858 82.9952663,36.8130178 85.191716,34.5408284 L85.191716,34.5408284 Z M5.93017751,0.136094675 L40.6378698,0.136094675 C42.7017751,0.136094675 44.6142012,1.23431953 45.6556213,3.03313609 C46.6970414,4.83195266 46.6970414,7.02840237 45.6556213,8.80828402 C44.6142012,10.6071006 42.7207101,11.7053254 40.6378698,11.7053254 L5.93017751,11.7053254 C3.86627219,11.7053254 1.95384615,10.6071006 0.912426036,8.80828402 C-0.128994083,7.00946746 -0.128994083,4.81301775 0.912426036,3.03313609 C1.95384615,1.23431953 3.84733728,0.136094675 5.93017751,0.136094675 Z" id="形状"></path>
                    <path d="M127.359763,5.93017751 L127.359763,40.6378698 C127.359763,43.8378698 124.76568,46.4130178 121.584615,46.4130178 C118.384615,46.4130178 115.809467,43.8189349 115.809467,40.6378698 L115.809467,5.93017751 C115.809467,2.73017751 118.40355,0.154926583 121.584615,0.154926583 C124.784615,0.136094675 127.359763,2.73017751 127.359763,5.93017751 Z M127.359763,86.895858 L127.359763,121.60355 C127.359763,123.667456 126.261538,125.579882 124.462722,126.621302 C122.663905,127.662722 120.467456,127.662722 118.687574,126.621302 C116.888757,125.579882 115.790533,123.686391 115.790533,121.60355 L115.790533,86.895858 C115.790533,83.695858 118.384615,81.1206071 121.56568,81.1206071 C124.784615,81.1017751 127.359763,83.695858 127.359763,86.895858 L127.359763,86.895858 Z M11.7053254,5.93017751 L11.7053254,40.6378698 C11.7053254,42.7017751 10.6071006,44.6142012 8.80828402,45.6556213 C7.00946746,46.6970414 4.81301775,46.6970414 3.03313609,45.6556213 C1.23431953,44.6142012 0.136094675,42.7207101 0.136094675,40.6378698 L0.136094675,5.93017751 C0.136094675,3.86627219 1.23431953,1.95384615 3.03313609,0.912426036 C4.83195266,-0.128994083 7.02840237,-0.128994083 8.80828402,0.912426036 C10.6071006,1.95384615 11.7053254,3.84733728 11.7053254,5.93017751 Z M11.7053254,86.895858 L11.7053254,121.60355 C11.7053254,123.667456 10.6071006,125.579882 8.80828402,126.621302 C7.00946746,127.662722 4.81301775,127.662722 3.03313609,126.621302 C1.23431953,125.579882 0.136094675,123.686391 0.136094675,121.60355 L0.136094675,86.895858 C0.136094675,83.695858 2.73017751,81.1206071 5.9112426,81.1206071 C9.1112426,81.1017751 11.7053254,83.695858 11.7053254,86.895858 L11.7053254,86.895858 Z" id="形状"></path>
                </g>
            </g>
        </g>
    </svg>`;

    //全屏取消
    var screenFullCancelSvg = `<?xml version="1.0" encoding="UTF-8"?>
    <svg viewBox="0 0 128 128" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <!-- Generator: Sketch 55.2 (78181) - https://sketchapp.com -->
        <desc>Created with Sketch.</desc>
        <g id="页面1" stroke="none" stroke-width="1" fill="#9faae8" fill-rule="evenodd">
            <g id="图层应用图标" transform="translate(-1220.000000, -220.000000)" fill-rule="nonzero">
                <g id="收缩" transform="translate(1220.000000, 220.000000)">
                    <path d="M121.584615,46.4130178 L86.895858,46.4130178 C83.695858,46.4130178 81.1207101,43.8189349 81.1207101,40.6378698 C81.1207101,37.4378698 83.7147929,34.8627219 86.895858,34.8627219 L121.60355,34.8627219 C124.80355,34.8627219 127.378698,37.4568047 127.378698,40.6378698 C127.359763,43.8189349 124.784615,46.3940828 121.584615,46.4130178 Z M86.8769231,115.809467 L121.584615,115.809467 C124.784615,115.809467 127.359763,118.40355 127.359763,121.584615 C127.359763,124.784615 124.76568,127.359763 121.584615,127.359763 L86.8769231,127.359763 C83.6769231,127.359763 81.1017751,124.76568 81.1017751,121.584615 C81.1017751,118.384615 83.695858,115.809467 86.8769231,115.809467 Z M40.6189349,92.6710059 L5.93017751,92.6710059 C2.73017751,92.6710059 0.136094675,90.0769231 0.136094675,86.895858 C0.136094675,83.695858 2.73017751,81.1207101 5.9112426,81.1207101 L40.6189349,81.1207101 C43.8189349,81.1207101 46.3940828,83.7147929 46.3940828,86.895858 C46.3940828,90.0769231 43.8189349,92.6710059 40.6189349,92.6710059 Z" id="形状"></path>
                    <path d="M36.5289941,98.7491124 L11.9893491,123.288757 C10.5313609,124.784615 8.39171598,125.390533 6.36568047,124.860355 C4.33964497,124.330178 2.76804734,122.75858 2.23786982,120.732544 C1.70769231,118.706509 2.31360947,116.566864 3.80946746,115.108876 L28.3491124,90.5692308 C30.6213018,88.3727811 34.2189349,88.4106509 36.4532544,90.6449704 C38.687574,92.860355 38.7254438,96.4769231 36.5289941,98.7491124 Z M123.288757,11.9893491 L98.7491124,36.5289941 C97.2911243,38.0248521 95.1514793,38.6307692 93.1254438,38.1005917 C91.0994083,37.5704142 89.5278107,35.9988166 88.9976331,33.9727811 C88.4674556,31.9467456 89.0733728,29.8071006 90.5692308,28.3491124 L115.108876,3.80946746 C117.381065,1.61301775 120.978698,1.65088757 123.213018,3.8852071 C125.447337,6.11952663 125.466272,9.71715976 123.288757,11.9893491 L123.288757,11.9893491 Z M5.93017751,0.136094675 L40.6378698,0.136094675 C42.7017751,0.136094675 44.6142012,1.23431953 45.6556213,3.03313609 C46.6970414,4.83195266 46.6970414,7.02840237 45.6556213,8.80828402 C44.6142012,10.6071006 42.7207101,11.7053254 40.6378698,11.7053254 L5.93017751,11.7053254 C3.86627219,11.7053254 1.95384615,10.6071006 0.912426036,8.80828402 C-0.128994083,7.00946746 -0.128994083,4.81301775 0.912426036,3.03313609 C1.95384615,1.23431953 3.84733728,0.136094675 5.93017751,0.136094675 Z" id="形状"></path>
                    <path d="M81.1017751,40.6189349 L81.1017751,5.93017751 C81.1017751,2.73017751 83.695858,0.155029586 86.8769231,0.155029586 C90.0769231,0.155029586 92.652071,2.74911243 92.652071,5.93017751 L92.652071,40.6378698 C92.652071,43.8378698 90.0579882,46.4130178 86.8769231,46.4130178 C83.695858,46.3940828 81.1017751,43.8189349 81.1017751,40.6189349 Z M127.359763,86.895858 L127.359763,121.60355 C127.359763,123.667456 126.261538,125.579882 124.462722,126.621302 C122.663905,127.662722 120.467456,127.662722 118.687574,126.621302 C116.888757,125.579882 115.790533,123.686391 115.790533,121.60355 L115.790533,86.895858 C115.790533,83.695858 118.384615,81.1206071 121.56568,81.1206071 C124.784615,81.1017751 127.359763,83.695858 127.359763,86.895858 L127.359763,86.895858 Z M11.7053254,5.93017751 L11.7053254,40.6378698 C11.7053254,42.7017751 10.6071006,44.6142012 8.80828402,45.6556213 C7.00946746,46.6970414 4.81301775,46.6970414 3.03313609,45.6556213 C1.23431953,44.6142012 0.136094675,42.7207101 0.136094675,40.6378698 L0.136094675,5.93017751 C0.136094675,3.86627219 1.23431953,1.95384615 3.03313609,0.912426036 C4.83195266,-0.128994083 7.02840237,-0.128994083 8.80828402,0.912426036 C10.6071006,1.95384615 11.7053254,3.84733728 11.7053254,5.93017751 Z M34.843787,121.584615 L34.843787,86.895858 C34.843787,84.8319527 35.9420118,82.9195266 37.7408284,81.8781065 C39.539645,80.8366864 41.7360947,80.8366864 43.5159763,81.8781065 C45.3147929,82.9195266 46.4130178,84.8130178 46.4130178,86.895858 L46.4130178,121.60355 C46.4130178,124.80355 43.8189349,127.378698 40.6378698,127.378698 C37.4189349,127.378698 34.843787,124.784615 34.843787,121.584615 Z" id="形状"></path>
                </g>
            </g>
        </g>
    </svg>`;

    var classNameShrink = "cesium-screen-shrink";
    var classNameFull = "cesium-screen-full";
    var screenControl = document.createElement("div");
    screenControl.className = classNameFull;
    screenControl.innerHTML = screenFullSvg;
    screenControl.onclick = function() {
        console.log(this);
        if(this.className.indexOf(classNameShrink) > -1){
            $(".left").fadeIn("slow");
            $(".right").fadeIn("slow");
            $(".bottom").fadeIn("slow");
            this.className = classNameFull;
            this.innerHTML = screenFullSvg;
        } else {
            $(".left").fadeOut("slow");
            $(".right").fadeOut("slow");
            $(".bottom").fadeOut("slow");
            this.className = classNameShrink;
            this.innerHTML = screenFullCancelSvg;
        }
    };
    _this.viewer.container.appendChild(screenControl);
}

/**
 * 加载资源控制
 */
gis.loadSourceControl = function(){
    var _this = this;
    
    var sources = [
        {
            name: "建筑",
            show: true,
            onClick: function(checked){
                if(_this.buildingTileset) {
                    _this.buildingTileset.show = checked;
                }
            }
        },
        {
            name: "区域",
            show: true,
            onClick: function(checked){
                if(_this.areaWallPrimitive) {
                    _this.areaWallPrimitive.show = checked;
                }
            }
        },
        {
            name: "路网",
            show: true,
            onClick: function(checked){
                if(_this.cityRoadNet) {
                    _this.cityRoadNet.show = checked;
                }
            }
        },
        {
            name: "铁塔",
            show: true,
            onClick: function(checked){
                _this.signalTowerMap.forEach(value => {
                    value.show = checked;
                });
                _this.composePointMap.forEach(value => {
                    value.show(checked);
                });
            }
        },
        {
            name: "机房",
            show: true,
            onClick: function(checked){
                _this.signalHouseMap.forEach(value => {
                    value.show(checked);
                });
            }
        },
        {
            name: "RRU",
            show: true,
            onClick: function(checked){
                _this.signalRRUMap.forEach(value => {
                    value.show(checked);
                });
            }
        },
        {
            name: "天线",
            show: true,
            onClick: function(checked){
                _this.signalSectorMap.forEach(value => {
                    value.show(checked);
                });
            }
        },
        {
            name: "覆盖",
            show: true,
            onClick: function(checked){
                _this.signalSectorMap.forEach(value => {
                    value.signalShow(checked);
                });
            }
        },
    ];

    var selectControl = document.createElement("div");
    selectControl.className = "select-control";
    _this.viewer.container.appendChild(selectControl);

    var selectTitle = document.createElement("div");
    selectTitle.className = "select-control-title";

    var titleSpan = document.createElement("span");
    titleSpan.innerText = "图层控制";
    selectTitle.appendChild(titleSpan);

    var titleArrow = document.createElement("div");
    titleArrow.className = "arrow";
    titleArrow.select = false;
    selectTitle.appendChild(titleArrow);
    selectControl.appendChild(selectTitle);

    var selectContent = document.createElement("div");
    selectContent.className = "select-control-content";
    selectControl.appendChild(selectContent);

    selectTitle.onclick = function(){
        if(titleArrow.select){
            titleArrow.className = "arrow";
            titleArrow.select = !titleArrow.select;
            $(selectContent).hide(200);
            // selectContent.style.display = "none";
        } else {
            titleArrow.className = "arrow select";
            titleArrow.select = !titleArrow.select;
            $(selectContent).show(200);
            // selectContent.style.display = "block";
        }
    };

    sources.forEach(value => {
        var element = document.createElement("div");
        element.className = "select-control-row";
        selectContent.appendChild(element);
        var elementSpan = document.createElement("span");
        elementSpan.innerText = value.name;
        element.appendChild(elementSpan);
        var elementSelect = document.createElement("div");
        
        elementSelect.select = value.show;
        if(value.show){
            elementSelect.className = "select-btn select";
        } else {
            elementSelect.className = "select-btn";
        }

        element.appendChild(elementSelect);
        elementSelect.onclick = function() {
            if(this.select){
                elementSelect.className = "select-btn";
                elementSelect.select = !this.select;
            } else {
                elementSelect.className = "select-btn select";
                elementSelect.select = !this.select;
            }
            value.onClick(this.select);
        };
    });
};

/**
 * 加载建筑
 */
gis.loadBuilding = function() {
    var _this = this;
    var viewer = _this.viewer;
    var url =  _this.sourcePath.building.url;
    var color = `vec4(0, 0.5, 1.0,1)`;

    _this.buildingTileset = new Cesium.Cesium3DTileset({
        url: url,
        maximumScreenSpaceError: _this.displayCondition.building.maximumScreenSpaceError,//减少细粒度元素渲染，优化渲染效率
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
    });
    _this.buildingTileset.style = new Cesium.Cesium3DTileStyle({
        color : color,
    });
    
    viewer.scene.primitives.add(_this.buildingTileset);
};

/**
 * 加载小区墙
 */
gis.loadAreaWall = function(){
    var _this = this;
    var url = _this.sourcePath.areaWall.url;
    Cesium.GeoJsonDataSource.load(url).then(function(dataSource) {
        var wallInstances = [];
        var entities = dataSource.entities.values;
        var distanceDisplayCondition = new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(_this.displayCondition.areaWall.minDistance, _this.displayCondition.areaWall.maxDistance); 
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            var positions = entity.polygon.hierarchy.getValue().positions;
            var maximumHeights = new Array(positions.length).fill(10);
            var minimumHeights = new Array(positions.length).fill(0);
            var wall = new Cesium.WallGeometry({
                positions: positions,
                materialSupport:  Cesium.MaterialAppearance.MaterialSupport.BASIC.vertexFormat,
                maximumHeights: maximumHeights,
                minimumHeights: minimumHeights,
            });
            var wallGeometry = Cesium.WallGeometry.createGeometry(wall);
            var wallInstance = new Cesium.GeometryInstance({
                geometry: wallGeometry,
                modelMatrix: Cesium.Matrix4.IDENTITY,
                attributes: {
                    distanceDisplayCondition:  distanceDisplayCondition,
                },
            });
            wallInstances.push(wallInstance);
        }

        var appearance = new Cesium.MaterialAppearance({
            material: new Cesium.Material({
                fabric: {
                    type: 'wallGradationShader',
                    uniforms: {
                        color: new Cesium.Color(0.5, 0.8, 1.0, 1.0),
                    },
                    source: `
                        uniform vec4 color;
                        czm_material czm_getMaterial(czm_materialInput materialInput)
                        {   
                            czm_material material = czm_getDefaultMaterial(materialInput);

                            vec2 st = materialInput.st;

                            float changeDiff;
                            float randomNum2 = fract(czm_frameNumber / 360.0);
                            float changeH = clamp(abs(st.t - 0.5), 0.0, 1.0);
                            changeDiff = step(0.01, abs(changeH - randomNum2));
                            changeDiff = min(changeDiff, 1.0);
                            changeDiff = 1.0 - changeDiff;
                            material.emission = color.rgb * changeDiff;

                            float powerRatio = fract(czm_frameNumber / 30.0) + 3.0;
                            float alpha = pow(1.0 - st.t, powerRatio);
                            material.diffuse = color.rgb;
                            material.alpha = alpha * color.a;
                            return material;
                        }
                    `
                },
                translucent: false
            }),
            faceForward: true
        });
    
        _this.areaWallPrimitive = _this.viewer.scene.primitives.add(new Cesium.Primitive({
            geometryInstances: wallInstances,
            appearance: appearance,
            asynchronous: false,
        }));
    });
};

/**
 * 加载城市道路
 */
gis.loadCityRoad = function(){
    var _this = this;
    _this.cityRoadNet = new Cesium.PrimitiveCollection();
    _this.viewer.scene.primitives.add(_this.cityRoadNet);

    var distanceDisplayCondition = new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(_this.displayCondition.road.minDistance, _this.displayCondition.road.maxDistance); 
    var colorArr = ["#f67b02", "#ff9803", "#fcc827", "#f3cf55", "#e5d08a"];
    var widthArr = [15, 12, 8, 5, 2];
    var appearanceCache = {};
    function getAppearance (color){
        if(appearanceCache[color]){
            return appearanceCache[color];
        }

        var appearance = new Cesium.PolylineMaterialAppearance({
            material: new Cesium.Material({
                fabric: {
                    type: 'animationLineShader',
                    uniforms: {
                        color: Cesium.Color.fromCssColorString(color),
                        image: getColorRampImge(color, false),
                        glowPower: 0.05,//发光强度，以总线宽的百分比表示（小于1.0）。
                        taperPower: 1.0,//渐缩效果的强度，以总线长的百分比表示。如果为1.0或更高，则不使用锥度效果。
                    },
                    source: `
                        uniform vec4 color;
                        uniform float glowPower;
                        uniform float taperPower;
                        uniform sampler2D image;
                        czm_material czm_getMaterial(czm_materialInput materialInput)
                        {   
                            czm_material material = czm_getDefaultMaterial(materialInput);
                            vec2 st = materialInput.st;

                            float time = czm_frameNumber / 360.0;
                            vec4 colorImage = texture2D(image, fract(vec2(st.s - time, 0.5 - st.t)));
                            // material.diffuse = (colorImage.rgb+color.rgb)/2.0;
                            // material.alpha = colorImage.a * color.a;

                            float glow = glowPower / abs(st.t - 0.5) - (glowPower / 0.5);

                            if (taperPower <= 0.99999) {
                                glow *= min(1.0, taperPower / (0.5 - st.s * 0.5) - (taperPower / 0.5));
                            }

                            vec4 fragColor;
                            fragColor.rgb = max(vec3(glow - 1.0 + color.rgb), color.rgb);
                            fragColor.a = clamp(0.0, 1.0, glow) * color.a;
                            fragColor = czm_gammaCorrect(fragColor);

                            material.emission = fragColor.rgb;
                            // material.diffuse = (colorImage.rgb+color.rgb)/2.0;
                            // material.alpha = fragColor.a*colorImage.a;
                            material.diffuse = color.rgb;
                            material.alpha = fragColor.a;

                            return material;
                        }
                    `
                },
            }),
            renderState: {
                depthTest: {
                    enabled: false,
                    func: Cesium.DepthFunction.LESS_OR_EQUAL
                },
            },
        });

        appearanceCache[color] = appearance;

        return appearance;
    }

    var line1Url = _this.sourcePath.road.line1;
    var line2Url = _this.sourcePath.road.line2;
    var line3Url = _this.sourcePath.road.line3;
    var line4Url = _this.sourcePath.road.line4;
    var line5Url = _this.sourcePath.road.line5;

    //一级道路
    Cesium.GeoJsonDataSource.load(line1Url).then(function(dataSource) {
        var lineInstances = [];
        var entities = dataSource.entities.values;
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            var positions = entity.polyline.positions.getValue();
            var polyline = new Cesium.PolylineGeometry({
                positions: positions,
                width : widthArr[0],
            });
            var geometryLine = Cesium.PolylineGeometry.createGeometry(polyline);
            var lineInstance = new Cesium.GeometryInstance({
                geometry: geometryLine,
                modelMatrix: Cesium.Matrix4.IDENTITY,
                attributes: {
                    distanceDisplayCondition:  distanceDisplayCondition,
                },
            });
            lineInstances.push(lineInstance);
        }
        var primitive = new Cesium.Primitive({
            geometryInstances: lineInstances,
            appearance: getAppearance(colorArr[0]),
            asynchronous: false,
        });
        _this.cityRoadNet.add(primitive);
    });

    //二级道路
    Cesium.GeoJsonDataSource.load(line2Url).then(function(dataSource) {
        var lineInstances = [];
        var entities = dataSource.entities.values;
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            var positions = entity.polyline.positions.getValue();
            var polyline = new Cesium.PolylineGeometry({
                positions: positions,
                width : widthArr[1],
            });
            var geometryLine = Cesium.PolylineGeometry.createGeometry(polyline);
            var lineInstance = new Cesium.GeometryInstance({
                geometry: geometryLine,
                modelMatrix: Cesium.Matrix4.IDENTITY,
                attributes: {
                    distanceDisplayCondition:  distanceDisplayCondition,
                },
            });
            lineInstances.push(lineInstance);
        }
        var primitive = new Cesium.Primitive({
            geometryInstances: lineInstances,
            appearance: getAppearance(colorArr[1]),
            asynchronous: false,
        });
        _this.cityRoadNet.add(primitive);
    });

    //三级道路
    Cesium.GeoJsonDataSource.load(line3Url).then(function(dataSource) {
        var lineInstances = [];
        var entities = dataSource.entities.values;
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            var positions = entity.polyline.positions.getValue();
            var polyline = new Cesium.PolylineGeometry({
                positions: positions,
                width : widthArr[2],
            });
            var geometryLine = Cesium.PolylineGeometry.createGeometry(polyline);
            var lineInstance = new Cesium.GeometryInstance({
                geometry: geometryLine,
                modelMatrix: Cesium.Matrix4.IDENTITY,
                attributes: {
                    distanceDisplayCondition:  distanceDisplayCondition,
                },
            });
            lineInstances.push(lineInstance);
        }
        var primitive = new Cesium.Primitive({
            geometryInstances: lineInstances,
            appearance: getAppearance(colorArr[2]),
            asynchronous: false,
        });
        _this.cityRoadNet.add(primitive);
    });

    //四级道路
    Cesium.GeoJsonDataSource.load(line4Url).then(function(dataSource) {
        var lineInstances = [];
        var entities = dataSource.entities.values;
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            var positions = entity.polyline.positions.getValue();
            var polyline = new Cesium.PolylineGeometry({
                positions: positions,
                width : widthArr[3],
            });
            var geometryLine = Cesium.PolylineGeometry.createGeometry(polyline);
            var lineInstance = new Cesium.GeometryInstance({
                geometry: geometryLine,
                modelMatrix: Cesium.Matrix4.IDENTITY,
                attributes: {
                    distanceDisplayCondition:  distanceDisplayCondition,
                },
            });
            lineInstances.push(lineInstance);
        }
        var primitive = new Cesium.Primitive({
            geometryInstances: lineInstances,
            appearance: getAppearance(colorArr[3]),
            asynchronous: false,
        });
        _this.cityRoadNet.add(primitive);
    });

    //五级道路
    Cesium.GeoJsonDataSource.load(line5Url).then(function(dataSource) {
        var lineInstances = [];
        var entities = dataSource.entities.values;
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            var positions = entity.polyline.positions.getValue();
            var polyline = new Cesium.PolylineGeometry({
                positions: positions,
                width : widthArr[4],
            });
            var geometryLine = Cesium.PolylineGeometry.createGeometry(polyline);
            var lineInstance = new Cesium.GeometryInstance({
                geometry: geometryLine,
                modelMatrix: Cesium.Matrix4.IDENTITY,
                attributes: {
                    distanceDisplayCondition:  distanceDisplayCondition,
                },
            });
            lineInstances.push(lineInstance);
        }
        var primitive = new Cesium.Primitive({
            geometryInstances: lineInstances,
            appearance: getAppearance(colorArr[4]),
            asynchronous: false,
        });
        
        _this.cityRoadNet.add(primitive);
    });
};

/**
 * 加载信号塔
 */
gis.loadSignalTower = function(){
    var _this = this;
    var viewer = _this.viewer;

    var dataArr = [
        {
            code: "ST001",
            name: "5G信号塔",
            type: "ST5G",
            longitude: 87.57553605244496,
            latitude: 43.85261649005997,
        },
        {
            code: "ST002",
            name: "5G信号塔",
            type: "ST5G",
            longitude: 87.57595066312719,
            latitude: 43.84753115686055,
        },
        {
            code: "ST003",
            name: "5G信号塔",
            type: "ST5G",
            longitude: 87.57938048778902,
            latitude: 43.84354787827363,
        },
        {
            code: "ST004",
            name: "5G信号塔",
            type: "ST5G",
            longitude: 87.58950721810429,
            latitude: 43.85391513905645,
        },
    ];

    //效率测试
    // var x = 10;
    // var y = 10;
    // var tempLon = dataArr[3].longitude;
    // var tempLat = dataArr[3].latitude;
    // var temArr = [];
    // for (var i = 0; i < x; i++) {
    //     tempLon+=Math.random()/50;
    //     var tempLat1 = tempLat;
    //     for (var j = 0; j < y; j++) {
    //         tempLat1+=Math.random()/50;
    //         var data = {};
    //         data.longitude = tempLon;
    //         data.latitude = tempLat1;
    //         data.code = "ST003_X"+i+"_Y"+j;
    //         data.name = dataArr[3].name;
    //         data.type = dataArr[3].type;
    //         temArr.push(data);
    //     }
    // }  

    // dataArr = dataArr.concat(temArr);
    var distanceDisplayCondition1 = new Cesium.DistanceDisplayCondition(_this.displayCondition.signalTower.minDistance, _this.displayCondition.signalTower.maxDistance);
    var distanceDisplayCondition2 = new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(_this.displayCondition.compsePoint.minDistance, _this.displayCondition.compsePoint.maxDistance);
    for (var i = 0; i < dataArr.length; i++) {
        var data = dataArr[i];
        var hpr = new Cesium.HeadingPitchRoll(0.0, 0.0, 0.0);
        var origin = new Cesium.Cartesian3.fromDegrees(data.longitude, data.latitude, 0);
        var modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(origin, hpr);
        var towerPrimitive = viewer.scene.primitives.add(Cesium.Model.fromGltf({
            show: true,
            url : _this.getModelUriByType(data.type),
            modelMatrix : modelMatrix,
            maximumScale: 4,
            scale: 1.0,
            distanceDisplayCondition: distanceDisplayCondition1,
        }));
        towerPrimitive.enbId = _this.signalTowerMap.size+1;
        data.enbId = _this.signalTowerMap.size+1;
        towerPrimitive.properties = data;
        towerPrimitive.position = origin;
        _this.signalTowerMap.set(data.code, towerPrimitive);
        towerPrimitive.onMouseMove = function(){
            _this.addIipInfoWin(this.position, "信号塔-" + this.properties.code)
        }


        //添加组合点
        var csp = new ComposeSymbolPoint({
            viewer: _this.viewer,
            radius: 100,
            position: origin,
            color: new Cesium.Color.fromCssColorString("#00FF00"),
            slices: 6,
            properties: data,
            distanceDisplayCondition: distanceDisplayCondition2,
            onClick: function(){
                var position = new Cesium.Cartesian3.fromDegrees(this.properties.longitude, this.properties.latitude, 10.0);
                _this.addTracePosition(position);
            }
        });
        _this.composePointMap.set(data.code, csp);
    }
};

/**
 * 加载RRU设备
 */
gis.loadRRUEquipment =function(){
    var _this = this;
    var distanceDisplayCondition = new Cesium.DistanceDisplayCondition(_this.displayCondition.rru.minDistance, _this.displayCondition.rru.maxDistance);
    _this.signalSectorMap.forEach(value=>{
        var properties = value.properties;
        var properties1 = {};
        properties1.code = properties.code;
        properties1.properties = properties;
        properties1.longitude = properties.longitude;
        properties1.latitude = properties.latitude;
        properties1.dipAngle = properties.dipAngle;
        properties1.rotAngle = properties.rotAngle;
        properties1.height = 35;
        properties1.modelUri = _this.getModelUriByType("2t2r_rru");
        properties1.distanceDisplayCondition = distanceDisplayCondition;
        var center = new Cesium.Cartesian3.fromDegrees(properties1.longitude, properties1.latitude, properties1.height);
        var text = "RRU-"+properties.name;
        properties1.onMouseMove = function(){
            _this.addIipInfoWin(center, text);
        };
        _this.signalRRUMap.set(properties1.code,new SignalRRUPrimitive(_this.viewer, properties1));
    });
};

/**
 * 加载信号模拟
 */
gis.loadSignalSimulation = function(){
    var _this = this;
    _this.signalTowerMap.forEach(value=>{
        var properties = value.properties;
        var properties1 = {};
        properties1.tower = properties;
        properties1.enbId = properties.enbId;
        properties1.longitude = properties.longitude;
        properties1.latitude = properties.latitude;
        properties1.cellId = 1;
        properties1.type = "2.1G";
        properties1.dipAngle = -15;
        properties1.rotAngle = 0;
        properties1.height = 40;

        properties1.modelUri = _this.getModelUriByType("4g_ant");
        properties1.name = "CJ_QT0_TSDZN_SRL8C_7";
        properties1.prbRate = "42%";
        properties1.userCnt = "35";
        properties1.dayFlowAvg = "1.08G";
        properties1.dayProfitAvg = "104元";
        properties1.isDelSelect = false;
        properties1.isMovSelect = false;
        
        var properties2 = {};
        properties2.tower = properties;
        properties2.enbId = properties.enbId;
        properties2.longitude = properties.longitude;
        properties2.latitude = properties.latitude;
        properties2.cellId = 2;
        properties2.type = "1.8G";
        properties2.dipAngle = -15;
        properties2.rotAngle = 120;
        properties2.height = 40;

        properties2.modelUri = _this.getModelUriByType("4g_ant");
        properties2.name = "CJ_QT0_TSDZN_SRL8C_7";
        properties2.prbRate = "42%";
        properties2.userCnt = "35";
        properties2.dayFlowAvg = "1.08G";
        properties2.dayProfitAvg = "104元";
        properties2.isDelSelect = false;
        properties2.isMovSelect = false;
        
        var properties3 = {};
        properties3.tower = properties;
        properties3.enbId = properties.enbId;
        properties3.longitude = properties.longitude;
        properties3.latitude = properties.latitude;
        properties3.cellId = 3;
        properties3.type = "800M";
        properties3.dipAngle = -10;
        properties3.rotAngle = 240;
        properties3.height = 40;

        properties3.modelUri = _this.getModelUriByType("4g_ant");
        properties3.name = "CJ_QT0_TSDZN_SRL8C_7";
        properties3.prbRate = "42%";
        properties3.userCnt = "35";
        properties3.dayFlowAvg = "1.08G";
        properties3.dayProfitAvg = "104元";
        properties3.isDelSelect = false;
        properties3.isMovSelect = false;

        properties1.code = properties1.enbId + "_" + properties1.cellId;
        properties2.code = properties2.enbId + "_" + properties2.cellId;
        properties3.code = properties3.enbId + "_" + properties3.cellId;

        properties1.infuenceArr = [properties2.code, properties3.code];
        properties2.infuenceArr = [properties1.code, properties3.code];
        properties3.infuenceArr = [properties1.code, properties2.code];
        var json1 = _this.getSignalSimulationJson(properties1.type,properties1.dipAngle,properties1.rotAngle,properties1)
        json1.minDistanceDisplayCondition = _this.displayCondition.signalSimulation.minDistance;
        json1.maxDistanceDisplayCondition = _this.displayCondition.signalSimulation.maxDistance;
        json1.onClick = function(){
            _this.loadSectorInfo(this.properties.code);
        }
        json1.onMouseMove = function(){
            _this.addIipInfoWin(this.position, this.name)
        }
        _this.signalSectorMap.set(properties1.code,new TelSignalSimulationPrimitive(_this.viewer, json1));
        
        var json2 = _this.getSignalSimulationJson(properties2.type,properties2.dipAngle,properties2.rotAngle,properties2)
        json2.minDistanceDisplayCondition = _this.displayCondition.signalSimulation.minDistance;
        json2.maxDistanceDisplayCondition = _this.displayCondition.signalSimulation.maxDistance;
        json2.onClick = function(){
            _this.loadSectorInfo(this.properties.code);
        }
        json2.onMouseMove = function(){
            _this.addIipInfoWin(this.position, this.name)
        }
        _this.signalSectorMap.set(properties2.code,new TelSignalSimulationPrimitive(_this.viewer, json2));
        
        var json3 = _this.getSignalSimulationJson(properties3.type,properties3.dipAngle,properties3.rotAngle,properties3)
        json3.minDistanceDisplayCondition = _this.displayCondition.signalSimulation.minDistance;
        json3.maxDistanceDisplayCondition = _this.displayCondition.signalSimulation.maxDistance;
        json3.onClick = function(){
            _this.loadSectorInfo(this.properties.code);
        }
        json3.onMouseMove = function(){
            _this.addIipInfoWin(this.position, this.name)
        }
        _this.signalSectorMap.set(properties3.code,new TelSignalSimulationPrimitive(_this.viewer, json3));
    });
};

/**
 * 加载机房
 */
gis.loadSignalHouse = function(){
    var _this = this;
    var signalHouseArr = [
        {
            code: "SH001",
            name: "机房",
            type: "rack_house",
            longitude: 87.57598988219324,
            latitude: 43.851610075507246,
            path:  [
                [
                    87.57598988219324, 43.851610075507246, 0,
                    87.57583231193118, 43.85160344612728, 0,
                    87.57590545312827, 43.85210091102994, 0,
                    87.57581163053811, 43.85232180308956, 0,
                    87.57553605244496, 43.85261649005997, 0,
                    87.57553605244496, 43.85261649005997, 30
                ]
            ]
        },
        {
            code: "SH002",
            name: "机房",
            type: "rack_house",
            longitude: 87.57638875590838,
            latitude: 43.84569989720426,
            path:  [
                [
                    87.57638875590838, 43.84569989720426, 0,
                    87.57593543229856, 43.845671943316695, 0,
                    87.5757312837212, 43.84640908910931, 0,
                    87.57550824162861, 43.847520513528885, 0,
                    87.57595066312719, 43.84753115686055, 0,
                    87.57595066312719, 43.84753115686055, 30
                ],
                [
                    87.57638875590838, 43.84569989720426, 0,
                    87.57593543229856, 43.845671943316695, 0,
                    87.57635001155053, 43.84508666135207, 0,
                    87.5781971418332, 43.84543656965578, 0,
                    87.57907010378341, 43.84351404604807, 0,
                    87.57938048778902, 43.84354787827363, 0,
                    87.57938048778902, 43.84354787827363, 30
                ]
            ]
        }
    ];

    for (var i = 0; i < signalHouseArr.length; i++) {
        var options = {};
        options.properties = signalHouseArr[i];
        options.code = signalHouseArr[i].code;
        options.longitude = signalHouseArr[i].longitude;
        options.latitude = signalHouseArr[i].latitude;
        options.path = signalHouseArr[i].path;
        options.modelUri = _this.getModelUriByType(signalHouseArr[i].type);
        options.minDistanceDisplayCondition = _this.displayCondition.signalHouse.minDistance;
        options.maxDistanceDisplayCondition = _this.displayCondition.signalHouse.maxDistance;
        options.onClick = function(){
            load();
        };
        options.onMouseMove = function(){
            _this.addIipInfoWin(this.position, this.name)
        }
        _this.signalHouseMap.set(signalHouseArr[i].code, new SignalHousePrimitive(_this.viewer, options));
    }
};

/**
 * 删除预览
 */
gis.delPreSignaSector = function(){
    if(this.preSignaSector){
        this.preSignaSector.destory();
        this.preSignaSector = undefined;
    }
};

/**
 * 加载扇区信息
 */
gis.loadSectorInfo = function(sectorCode){
    var _this = this;

    if(typeof(sectorCode) === "object"){
        sectorCode = sectorCode.getValue();
    }
    if( _this.signaInfoWinMap.get(sectorCode)){
        _this.signaInfoWinMap.get(sectorCode).destory();
    }

    var signaSector = _this.signalSectorMap.get(sectorCode);
    var properties = signaSector.properties;
    var options = {};
    options.viewPoint = signaSector.center;
    options.title = "覆盖信息";

    var prbRate = properties.prbRate;//PRB利用率
    var userCnt = properties.userCnt;//覆盖用户数
    var dayFlowAvg = properties.dayFlowAvg;//日均流量
    var dayProfitAvg = properties.dayProfitAvg;//日均收入

    var isDelSelect = properties.isDelSelect;//是否删除选中
    var isMovSelect = properties.isMovSelect;//是否迁移选中
    var isBreakDown = properties.isBreakDown;//是否设备损坏
    var isOpenInFlu = properties.isOpenInFlu;//是否开启影响
    
    var staticElement = document.createElement("div");
    staticElement.className = "common";
    var html = "<div><span class=\"label\">PRB利用率：</span><span class=\"value\">"+prbRate+"</span></div>";
    html += "<div><span class=\"label\">覆盖用户数：</span><span class=\"value\">"+userCnt+"</span></div>";
    html += "<div><span class=\"label\">日均流量：</span><span class=\"value\">"+dayFlowAvg+"</span></div>";
    html += "<div><span class=\"label\">日均收入：</span><span class=\"value\">"+dayProfitAvg+"</span></div>";

    //损坏
    var breakElement =  document.createElement("div");
    breakElement.className = "cesium-infowin-body-title";
    breakElement.innerText = "损坏：";

    var breakSelectBtn = document.createElement("span");
    breakSelectBtn.className = "cesium-infowin-select-btn";
    breakSelectBtn["select-status"] = false;
    breakElement.appendChild(breakSelectBtn);

    var breakSureBtn = document.createElement("button");
    breakSureBtn.className = "cesium-infowin-common-btn";
    breakSureBtn.innerText = "影响";
    breakSureBtn.style.float = "right";
    breakSureBtn.style.display = "none";
    breakSureBtn.style["margin-top"] = "5px";
    breakElement.appendChild(breakSureBtn);

    if(isBreakDown){
        breakSelectBtn["select-status"] = true;
        breakSelectBtn.className = "cesium-infowin-select-btn select";
        breakSureBtn.style.display = "block";
    }

    breakSelectBtn.onclick = function(){
        if(this["select-status"]){
            breakSelectBtn["select-status"] = false;
            breakSelectBtn.className = "cesium-infowin-select-btn";
            breakSureBtn.style.display = "none";
        } else {
            breakSelectBtn["select-status"] = true;
            breakSelectBtn.className = "cesium-infowin-select-btn select";
            breakSureBtn.style.display = "block";
        }
        signaSector.properties.isBreakDown = !!breakSelectBtn["select-status"];
        var options = _this.getSignalSimulationJson(signaSector.properties.type, signaSector.properties.dipAngle, signaSector.properties.rotAngle,signaSector.properties);
        _this.signalSectorMap.get(sectorCode).setOptions(options);
    };

    //损坏影响
    if(isOpenInFlu){
        breakSureBtn["select-status"] = true;
        _this.loadInfluenceSectorInfo(sectorCode);
    } else {
        breakSureBtn["select-status"] = false;
        _this.removeInfluenceSectorInfo(sectorCode);
    }
    breakSureBtn.onclick = function(){
        if(this["select-status"]){
            breakSureBtn["select-status"] = false;
            _this.removeInfluenceSectorInfo(sectorCode);
        } else {
            breakSureBtn["select-status"] = true;
            _this.loadInfluenceSectorInfo(sectorCode);
        }
        signaSector.properties.isOpenInFlu = !!breakSureBtn["select-status"];
        var options = _this.getSignalSimulationJson(signaSector.properties.type, signaSector.properties.dipAngle, signaSector.properties.rotAngle,signaSector.properties);
        _this.signalSectorMap.get(sectorCode).setOptions(options);
    };

    //拆除
    var delElement =  document.createElement("div");
    delElement.className = "cesium-infowin-body-title";
    delElement.innerText = "拆除：";

    var delSelectBtn = document.createElement("span");
    delSelectBtn.className = "cesium-infowin-select-btn";
    delSelectBtn["select-status"] = false;
    delElement.appendChild(delSelectBtn);

    var delSureBtn = document.createElement("button");
    delSureBtn.className = "cesium-infowin-common-btn";
    delSureBtn.innerText = "确认";
    delSureBtn.style.float = "right";
    delSureBtn.style.display = "none";
    delSureBtn.style["margin-top"] = "5px";
    delElement.appendChild(delSureBtn);

    if(isDelSelect){
        delSelectBtn["select-status"] = true;
        delSelectBtn.className = "cesium-infowin-select-btn select";
        delSureBtn.style.display = "block";
    }

    delSelectBtn.onclick = function(){
        if(this["select-status"]){
            delSelectBtn["select-status"] = false;
            delSelectBtn.className = "cesium-infowin-select-btn";
            delSureBtn.style.display = "none";
        } else {
            delSelectBtn["select-status"] = true;
            delSelectBtn.className = "cesium-infowin-select-btn select";
            delSureBtn.style.display = "block";
        }
        signaSector.properties.isDelSelect = !!delSelectBtn["select-status"];
        var options = _this.getSignalSimulationJson(signaSector.properties.type, signaSector.properties.dipAngle, signaSector.properties.rotAngle,signaSector.properties);
        _this.signalSectorMap.get(sectorCode).setOptions(options);
    };

    delSureBtn.onclick = function(){
        _this.delPreSignaSector();
        _this.signalSectorMap.get(sectorCode).destory();
        _this.signalSectorMap.delete(sectorCode);
        _this.signaInfoWinMap.get(sectorCode).destory();
        _this.signaInfoWinMap.delete(sectorCode);
    };


    //迁移
    var movElement =  document.createElement("div");
    movElement.className = "cesium-infowin-body-title";
    movElement.innerText = "迁移：";

    var movSelectBtn = document.createElement("span");
    movSelectBtn.className = "cesium-infowin-select-btn";
    movSelectBtn["select-status"] = false;
    movElement.appendChild(movSelectBtn);

    var movBodyElement = document.createElement("div");
    movBodyElement.style["padding-top"] = "10px";
    movBodyElement.style["display"] = "none";

    var movSelectDiv = document.createElement("div");
    movSelectDiv.className = "common";
    movSelectDiv.innerHTML = "<span class=\"label\">信号塔：</span>";
    movBodyElement.appendChild(movSelectDiv);
    var movSelect = document.createElement("select");
    movSelect.name = "code";
    movSelectDiv.appendChild(movSelect);
    _this.signalTowerMap.forEach((value, key)=>{
        var option = document.createElement("option");
        option.innerText = key;
        option.value = key;
        movSelect.appendChild(option);
    });
    movSelect.value = properties.tower.code;

    var movLonDiv = document.createElement("div");
    movLonDiv.className = "common";
    movLonDiv.innerHTML = "<span class=\"label\">经度：</span>";
    var movLonInput = document.createElement("input");
    movLonInput.type = "text";
    movLonInput.name = "longitude";
    movLonInput.value = properties.tower.longitude;
    movLonDiv.appendChild(movLonInput);
    movBodyElement.appendChild(movLonDiv);
    
    var movLatDiv = document.createElement("div");
    movLatDiv.className = "common";
    movLatDiv.innerHTML = "<span class=\"label\">纬度：</span>";
    var movLatInput = document.createElement("input");
    movLatInput.type = "text";
    movLatInput.name = "latitude";
    movLatInput.value = properties.tower.latitude;
    movLatDiv.appendChild(movLatInput);
    movBodyElement.appendChild(movLatDiv);
    
    var movHeightDiv = document.createElement("div");
    movHeightDiv.className = "common";
    movHeightDiv.innerHTML = "<span class=\"label\">挂高：</span>";
    var movHeightInput = document.createElement("input");
    movHeightInput.type = "text";
    movHeightInput.name = "height";
    movHeightInput.value = properties.height;
    movHeightDiv.appendChild(movHeightInput);
    movBodyElement.appendChild(movHeightDiv);
   
    var movRotAngleDiv = document.createElement("div");
    movRotAngleDiv.className = "common";
    movRotAngleDiv.innerHTML = "<span class=\"label\">方向角(°)：</span>";
    var movRotAngleInput = document.createElement("input");
    movRotAngleInput.type = "text";
    movRotAngleInput.name = "rotAngle";
    movRotAngleInput.value = properties.rotAngle;
    movRotAngleDiv.appendChild(movRotAngleInput);
    movBodyElement.appendChild(movRotAngleDiv);

    var movDipAngleDiv = document.createElement("div");
    movDipAngleDiv.className = "common";
    movDipAngleDiv.innerHTML = "<span class=\"label\">仰角(°)：</span>";
    var movDipAngleInput = document.createElement("input");
    movDipAngleInput.type = "text";
    movDipAngleInput.name = "dipAngle";
    movDipAngleInput.value = properties.dipAngle;
    movDipAngleDiv.appendChild(movDipAngleInput);
    movBodyElement.appendChild(movDipAngleDiv);

    var movSureDiv = document.createElement("div");
    movSureDiv.style["text-align"] = "right";
    var movInfluenceBtn = document.createElement("button");
    movInfluenceBtn.className = "cesium-infowin-common-btn";
    movInfluenceBtn.innerText = "影响";
    movInfluenceBtn.style["margin"] = "5px";
    movSureDiv.appendChild(movInfluenceBtn);
    var movPreviewBtn = document.createElement("button");
    movPreviewBtn.className = "cesium-infowin-common-btn";
    movPreviewBtn.innerText = "预览";
    movPreviewBtn.style["margin"] = "5px";
    movSureDiv.appendChild(movPreviewBtn);
    var movSureBtn = document.createElement("button");
    movSureBtn.className = "cesium-infowin-common-btn";
    movSureBtn.innerText = "确认";
    movSureBtn.style["margin"] = "5px";
    movSureDiv.appendChild(movSureBtn);
    movBodyElement.appendChild(movSureDiv);

    if(isMovSelect){
        movSelectBtn["select-status"] = true;
        movSelectBtn.className = "cesium-infowin-select-btn select";
        movBodyElement.style["display"] = "block";
    }

    movSelect.onchange = function(){
        if(!!this.value){
           var value = _this.signalTowerMap.get(this.value).properties.getValue();
           movLonInput.value = value.longitude;
           movLatInput.value = value.latitude;
        }
    };

    //删除影响
    if(isOpenInFlu){
        movSelectBtn["select-status"] = true;
        _this.loadInfluenceSectorInfo(sectorCode);
    } else {
        movSelectBtn["select-status"] = false;
        _this.removeInfluenceSectorInfo(sectorCode);
    }
    movInfluenceBtn.onclick = function(){
        if(this["select-status"]){
            movInfluenceBtn["select-status"] = false;
            _this.removeInfluenceSectorInfo(sectorCode);
        } else {
            movInfluenceBtn["select-status"] = true;
            _this.loadInfluenceSectorInfo(sectorCode);
        }
        signaSector.properties.isOpenInFlu = !!movInfluenceBtn["select-status"];
        var options = _this.getSignalSimulationJson(signaSector.properties.type, signaSector.properties.dipAngle, signaSector.properties.rotAngle,signaSector.properties);
        _this.signalSectorMap.get(sectorCode).setOptions(options);
    };

    //预览
    _this.delPreSignaSector();
    movPreviewBtn.onclick = function(){
        //删除预览
        _this.delPreSignaSector();

        var towerCode = movSelect.value;
        var tower = _this.signalTowerMap.get(towerCode).properties;
        var longitude = Number(movLonInput.value);
        var latitude = Number(movLatInput.value);
        var height = Number(movHeightInput.value);
        var rotAngle = Number(movRotAngleInput.value);
        var dipAngle = Number(movDipAngleInput.value);

        if(isNaN(longitude) || isNaN(latitude) || isNaN(height) || isNaN(rotAngle) || isNaN(dipAngle)){
            alert("请确认输入数据格式正确..");
        } else {
            var preProperties = {};
            preProperties.tower = tower;
            preProperties.enbId = properties.enbId;
            preProperties.longitude = longitude;
            preProperties.latitude = latitude;
            preProperties.cellId = properties.cellId;
            preProperties.type = properties.type;
            preProperties.dipAngle = dipAngle;
            preProperties.rotAngle = rotAngle;
            preProperties.height = height;
    
            preProperties.name = properties.name;
            preProperties.prbRate = properties.prbRate;
            preProperties.userCnt = properties.userCnt;
            preProperties.dayFlowAvg = properties.dayFlowAvg;
            preProperties.dayProfitAvg = properties.dayProfitAvg;
            preProperties.isDelSelect = false;
            preProperties.isMovSelect = false;
            preProperties.isPreSelect = true;
            preProperties.code = properties.code;

            var preJson = _this.getSignalSimulationJson(preProperties.type,preProperties.dipAngle,preProperties.rotAngle,preProperties)
            _this.preSignaSector = new TelSignalSimulationPrimitive(_this.viewer, preJson);
        }
    };

    //确认移动
    movSureBtn.onclick = function(){
        var towerCode = movSelect.value;
        var tower = _this.signalTowerMap.get(towerCode).properties;
        var longitude = Number(movLonInput.value);
        var latitude = Number(movLatInput.value);
        var height = Number(movHeightInput.value);
        var rotAngle = Number(movRotAngleInput.value);
        var dipAngle = Number(movDipAngleInput.value);

        if(isNaN(longitude) || isNaN(latitude) || isNaN(height) || isNaN(rotAngle) || isNaN(dipAngle)){
            alert("请确认输入数据格式正确..");
        } else {
            var preProperties = {};
            preProperties.tower = tower;
            preProperties.enbId = properties.enbId;
            preProperties.longitude = longitude;
            preProperties.latitude = latitude;
            preProperties.cellId = properties.cellId;
            preProperties.type = properties.type;
            preProperties.dipAngle = dipAngle;
            preProperties.rotAngle = rotAngle;
            preProperties.height = height;
    
            preProperties.name = properties.name;
            preProperties.prbRate = properties.prbRate;
            preProperties.userCnt = properties.userCnt;
            preProperties.dayFlowAvg = properties.dayFlowAvg;
            preProperties.dayProfitAvg = properties.dayProfitAvg;
            preProperties.isDelSelect = false;
            preProperties.isMovSelect = false;
            preProperties.isPreSelect = false;
            preProperties.code = properties.code;

            var preJson = _this.getSignalSimulationJson(preProperties.type,preProperties.dipAngle,preProperties.rotAngle,preProperties)
            _this.signalSectorMap.get(sectorCode).setOptions(preJson);

            _this.delPreSignaSector();
            _this.signaInfoWinMap.get(sectorCode).destory();
            _this.signaInfoWinMap.delete(sectorCode);
        }
    };
    
    //打开选择面板
    movSelectBtn.onclick = function(){
        if(this["select-status"]){
            movSelectBtn["select-status"] = false;
            movSelectBtn.className = "cesium-infowin-select-btn";
            movBodyElement.style.display = "none";
            _this.removeInfluenceSectorInfo(sectorCode);
        } else {
            movSelectBtn["select-status"] = true;
            movSelectBtn.className = "cesium-infowin-select-btn select";
            movBodyElement.style.display = "block";
        }
        signaSector.properties.isMovSelect = !!movSelectBtn["select-status"];
        var options = _this.getSignalSimulationJson(signaSector.properties.type, signaSector.properties.dipAngle, signaSector.properties.rotAngle,signaSector.properties);
        _this.signalSectorMap.get(sectorCode).setOptions(options);
    };

    staticElement.innerHTML = html;

    var content = document.createElement("div");
    content.appendChild(staticElement);
    content.appendChild(breakElement);
    content.appendChild(delElement);
    content.appendChild(movElement);
    content.appendChild(movBodyElement);

    //移动
    options.content = content;

    options.onClose = function(){
        _this.signaInfoWinMap.delete(sectorCode);
        _this.delPreSignaSector();
    }
    _this.signaInfoWinMap.set(sectorCode,new SignalInfoWinPrimitive(_this.viewer, options));
}

/**
 * 清除受影响小区
 */
gis.removeInfluenceSectorInfo = function(sectorCode){
    var _this = this;
    var arr = _this.signaInfluInfoWinMap.get(sectorCode);
    if(arr && arr.length > 1){
        for (var i = 0; i < arr.length; i++) {
            arr[i].destory();
        }
    }

    _this.signaInfluInfoWinMap.delete(sectorCode);
}

/**
 * 加载受影响小区信息
 */
gis.loadInfluenceSectorInfo = function(sectorCode){
    var _this = this;
    _this.removeInfluenceSectorInfo(sectorCode);
    var arr = _this.signalSectorMap.get(sectorCode).properties.infuenceArr;

    if(sectorCode == "3_1"){
        arr = ["3_1","3_2","3_3","2_1","2_2","2_3"];
    }
    var arrTemp = [];
    for (var i = 0; i < arr.length; i++) {
        var signaSector = _this.signalSectorMap.get(arr[i]);
        if (!signaSector) break;
        var properties = signaSector.properties;
        var options = {};
        options.viewPoint = signaSector.center;
        options.title = "受影响覆盖信息";
    
        var prbRate = properties.prbRate;//PRB利用率
        var userCnt = properties.userCnt;//覆盖用户数
        var dayFlowAvg = properties.dayFlowAvg;//日均流量
        var dayProfitAvg = properties.dayProfitAvg;//日均收入
    
        var staticElement = document.createElement("div");
        staticElement.className = "common";
        var html = "<div><span class=\"label\">PRB利用率：</span><span class=\"value\">"+prbRate+"</span><span class=\"label1\"><span class=\"upRate\"></span></span><span class=\"value\">2%</span></div>";
        html += "<div><span class=\"label\">覆盖用户数：</span><span class=\"value\">"+userCnt+"</span><span class=\"label1\"></span><span class=\"value\">持平</span></div>";
        html += "<div><span class=\"label\">日均流量：</span><span class=\"value\">"+dayFlowAvg+"</span><span class=\"label1\"><span class=\"upRate\"></span></span><span class=\"value\">2%</span></div>";
        html += "<div><span class=\"label\">日均收入：</span><span class=\"value\">"+dayProfitAvg+"</span><span class=\"label1\"></span><span class=\"value\">持平</span></div>";
        staticElement.innerHTML = html;
        var content = document.createElement("div");
        content.appendChild(staticElement);
    
        //移动
        options.content = content;
        arrTemp.push(new SignalInfoWinPrimitive(_this.viewer, options));
    }
    _this.signaInfluInfoWinMap.set(sectorCode, arrTemp);
}

/**
 * 添加提示信息框
 */
gis.addIipInfoWin = function(center, text){
    
    if(this.tipInfoWin){
        this.tipInfoWin.destory();
    }

    var options = {};
    options.viewPoint = center;
    options.content = text;
    this.tipInfoWin = new TipInfoWinPrimitive(this.viewer, options);
};

/**
 * 获取信号模拟JSON
 */
gis.getSignalSimulationJson = function(type, dipAngle, rotAngle, properties){
    var json = {};
    if(properties.isBreakDown){
        json.fillColor = Cesium.Color.RED.withAlpha(0.3);
        json.strokeColor = Cesium.Color.RED;
        json.isBlinking = true;
    } else if(properties.isPreSelect){
        json.fillColor = Cesium.Color.GREEN.withAlpha(0.3);
        json.strokeColor = Cesium.Color.GREEN;
        json.isBlinking = true;
    } else if(properties.isDelSelect || properties.isMovSelect){
        json.fillColor = Cesium.Color.YELLOW.withAlpha(0.3);
        json.strokeColor = Cesium.Color.YELLOW;
        json.isBlinking = true;
    } else {
        json.fillColor = false;
        json.strokeColor = false;
        json.isBlinking = false;
    }

    json.arcInterval = 5;
    json.type = type;
    json.dipAngle = dipAngle;
    json.rotAngle = rotAngle;
    json.properties = properties;
    json.height = properties.height;
    json.longitude = properties.longitude;
    json.latitude = properties.latitude;
    json.modelUri = properties.modelUri;
    json.name = properties.name;
    if(type == "2.1G"){
        json.hArcAngle = 120;
        json.vArcAngle = 40;
        json.fqInterval = 50;
        json.distance = 400;
    } else if(type == "1.8G"){
        json.hArcAngle = 60;
        json.vArcAngle = 40;
        json.fqInterval = 100;
        json.distance = 600;
    } else if(type == "800M"){
        json.hArcAngle = 30;
        json.vArcAngle = 40;
        json.fqInterval = 150;
        json.distance = 800;
    }

    return json;
};

/**
 * 根据类型获取模型地址
 */
gis.getModelUriByType = function(type){
    var uri;
    if(type =="ST5G"){
        // uri = "expamle/model/base-station.glb";
        uri = "./gismap/model/pole_ring.glb";
    } else if(type =="2t2r_rru"){
        uri = "./gismap/model/2t2r_rru.glb";
    } else if(type =="2t4r_rru"){
        uri = "./gismap/model/2t4r_rru.glb";
    } else if(type =="4g_ant"){
        uri = "./gismap/model/4g_ant.glb";
    } else if(type =="5g_ant"){
        uri = "./gismap/model/5g_ant.glb";
    } else if(type =="ant"){
        uri = "./gismap/model/ant.glb";
    } else if(type =="gps"){
        uri = "./gismap/model/gps.glb";
    } else if(type =="pole_ring"){
        uri = "./gismap/model/pole_ring.glb";
    } else if(type =="pole_single"){
        uri = "gismap/model/pole_single.glb";
    } else if(type =="pole_tree"){
        uri = "./gismap/model/pole_tree.glb";
    } else if(type =="quanxiang_ant"){
        uri = "./gismap/model/quanxiang_ant.glb";
    } else if(type =="rack_house"){
        uri = "./gismap/model/rack_house.glb";
    } else if(type =="rack"){
        uri = "./gismap/model/rack.glb";
    }

    return uri;
};

/**
 * BBU损坏效果绘制
 */
gis.bbuBreakViewDraw = function(){
    var _this = this;
    var signaSector1 = _this.signalSectorMap.get("3_1");
    var signaSector2 = _this.signalSectorMap.get("3_2");
    var signaSector3 = _this.signalSectorMap.get("3_3");

    signaSector1.properties.isBreakDown = true;
    var options = _this.getSignalSimulationJson(signaSector1.properties.type, signaSector1.properties.dipAngle, signaSector1.properties.rotAngle,signaSector1.properties);
    signaSector1.setOptions(options);
    signaSector2.properties.isBreakDown = true;
    var options = _this.getSignalSimulationJson(signaSector2.properties.type, signaSector2.properties.dipAngle, signaSector2.properties.rotAngle,signaSector2.properties);
    signaSector2.setOptions(options);
    signaSector3.properties.isBreakDown = true;
    var options = _this.getSignalSimulationJson(signaSector3.properties.type, signaSector3.properties.dipAngle, signaSector3.properties.rotAngle,signaSector3.properties);
    signaSector3.setOptions(options);

    _this.loadInfluenceSectorInfo("3_1");
};