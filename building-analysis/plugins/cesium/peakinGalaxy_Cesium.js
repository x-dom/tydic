import widgets from 'cesium/Widgets/widgets.css';
import cesium from 'cesium/Cesium';
const Cesium = cesium;
var viewer;
const PGC = {
    /**
     * 创建场景
     * div: 场景容器 DOM 的 ID，默认值为：cesiumContainer
     * MapServer: 地图服务链接，默认值为：蓝色底图
     **/
    createViewer: function (div, MapServer) {
        viewer = new Cesium.Viewer(div ? div : "cesiumContainer", {
            animation: false, //是否创建动画小器件，左下角仪表
            baseLayerPicker: false, //是否显示图层选择器
            fullscreenButton: false, //是否显示全屏按钮
            geocoder: false, //是否显示geocoder小器件，右上角查询按钮
            homeButton: false, //是否显示Home按钮
            infoBox: false, //是否显示信息框
            sceneModePicker: false, //是否显示3D/2D选择器
            selectionIndicator: false, //是否显示选取指示器组件
            timeline: false, //是否显示时间轴
            navigationHelpButton: false, //是否显示右上角的帮助按钮
            scene3DOnly: true, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
            //navigationInstructionsInitiallyVisible:false,
            showRenderLoopErrors: false,
            imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
                url: MapServer ? MapServer : "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
            }),
        });
        return viewer
    },
    /**
     * 获取 tileset 原始中心位置
     * t: 加载 tileset 成功后进入回调的对象
     **/
    getTilesetCenter: function (t) {
        //记录模型原始的中心点
        let boundingSphere = t.boundingSphere;
        //模型原始的中心点。此处是笛卡尔坐标，单位：米。
        let position = boundingSphere.center;
        // 经纬度，单位：弧度
        let catographic = Cesium.Cartographic.fromCartesian(position);
        // 高度，单位：米
        let height = Number(catographic.height);
        // 经纬度，单位：度
        let longitude = Number(Cesium.Math.toDegrees(catographic.longitude).toFixed(6));
        let latitude = Number(Cesium.Math.toDegrees(catographic.latitude).toFixed(6));
        return { x: longitude, y: latitude, z: height };
    },
    /**
     * 添加倾斜摄影模型
     * url: tileset.json 路径
     * id: 模型名称
     * ifFly2Model: 是否在加载完成后飞至模型处
     **/
    addModel: function (url, id, ifFly2Model) {
        let t = new Cesium.Cesium3DTileset({
            url: url,
            id: id
        });
        viewer.scene.primitives.add(t);
        t.readyPromise.then((argument) => {
            let c = PGC.getTilesetCenter(argument)
            let longitude = c.x;
            let latitude = c.y;
            let height = c.height;
            let heading = 0;
            let position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
            let mat = Cesium.Transforms.eastNorthUpToFixedFrame(position);
            let rotationX = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(heading)));
            Cesium.Matrix4.multiply(mat, rotationX, mat);
            t._root.transform = mat;
            if (ifFly2Model) {
                setTimeout(() => {
                    viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(longitude, latitude - 0.001, height + 200) });
                }, 1700)
            }
        });
    },
    /**
     * 获取经纬度在屏幕上的位置
     * x: 经度
     * y: 纬度
     **/
    toScreen: function (x, y) {
        let position = Cesium.Cartesian3.fromDegrees(x, y);
        let clickPt = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, position);
        let screenX = clickPt.x;
        let screenY = clickPt.y;
        return { top: screenX, left: screenY }
    },
    /**
     * 获取当前视角高度
     **/
    getHeight: function () {
        let scene = viewer.scene;
        let ellipsoid = scene.globe.ellipsoid;
        let height = ellipsoid.cartesianToCartographic(viewer.camera.position).height;
        return height
    },
    /**
     * 获取当前中心点坐标
     **/
    getCenter: function () {
        // 取椭球面
        let e = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(viewer.canvas.clientWidth / 2, viewer.canvas.clientHeight / 2));
        let curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(e);
        let x = curPosition.longitude * 180 / Math.PI;
        let y = curPosition.latitude * 180 / Math.PI;
        return { x: x, y: y }
    },
    /**
     * 注册/注销 获取当前点击的经纬度坐标
     * ifDestroy: 是否注销，留空为注册，有内容则注销
     **/
    getClickPos: function (ifDestroy) {
        let s = ifDestroy ? false : true;
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        if (s) {

            handler.setInputAction(function (click) {
                let clickX = click.position.x;
                let clickY = click.position.y;
                return { x: clickX, y: clickY }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);//响应滚轮点击：MIDDLE_CLICK | 鼠标移动：MOUSE_MOVE
        } else {
            handler.destroy()
        }
    },
    /**
     * 添加图层
     * x: 经度
     * y: 纬度
     * img: 图片路径
     * height: 图片高度
     * width: 图片宽度
     **/
    addMaker: function (x, y, img, height, width) {
        let p = Cesium.Cartesian3.fromDegrees(x, y);
        viewer.entities.add({
            attr: attr ? attr : null,
            layer: layerID,
            position: p,
            billboard: {
                image: img,
                show: true,
                height: height ? height : 48,
                width: width ? width : 36,
                eyeOffset: new Cesium.Cartesian3(0.0, 5.0, 0.0),
            },
        });
    },
    /**
     * 添加动态标记层
     * x: 经度
     * y: 纬度
     * img: 图片路径
     * height: 图片高度
     * width: 图片宽度
     **/
    addGif: function(layer, x, y, altitude, img, width, height) {
        let div;
        if(!document.getElementById(layer)) {
            div = document.createElement("div");
        }else{
            div = document.getElementById(layer);
        }
        div.id = layer;
        document.body.appendChild(div);
        let div_img = document.createElement("img");
        div_img.src = img;
        div_img.style.height = height + "px";
        div_img.style.width = width + "px";
        div_img.style.position = "absolute";
        div_img.style.zIndex = 99;
        let scratch = new Cesium.Cartesian2();
        viewer.scene.preRender.addEventListener(function() {
            let position = Cesium.Cartesian3.fromDegrees(x,y,altitude ? altitude : 0);
            let canvasPosition = viewer.scene.cartesianToCanvasCoordinates(position, scratch);
            if (Cesium.defined(canvasPosition)) {
                div_img.style.top = canvasPosition.y + height/2 + "px";
                div_img.style.left = canvasPosition.x + width/2 +"px";
            }
        });
        div.appendChild(div_img);
    },
    /**
     * 移除动态标记图层
     * x: 经度
     * y: 纬度
     * img: 图片路径
     * height: 图片高度
     * width: 图片宽度
     **/
    removeGif: function(layer) {
        viewer.scene.preRender._listeners.forEach(item=>{viewer.scene.preRender.removeEventListener(item)});
        document.body.removeChild(document.getElementById(layer));
    },
    /*
    * 飞行至指定的经纬度
     * x: 经度
     * y: 纬度
     * pitch 俯仰角（-90~90），默认-90，-90为相机看向正下方，90为相机看向正上方，可选
     * distance 相机与目标的距离(单位米)，默认500，可选
     * duration 飞行时间，单位秒，默认飞行3秒，可选
     * */
    fly2Point: function (x, y, pitch, distance, duration) {//点位置 + 俯仰角 + 时间
        let X = x ? x : 0;
        let Y = y ? y : 0;
        if (x == 0) {
            return
        }
        let Pitch = pitch ? pitch : -45;
        let Distance = distance ? distance : 1000;
        let Duration = duration ? duration : 3;
        let entity = viewer.entities.getById("flyTmp");
        if (Cesium.defined(entity)) {
            viewer.entities.remove(entity);
        }
        entity = viewer.entities.add({
            id: 'flyTmp',
            position: Cesium.Cartesian3.fromDegrees(X, Y),
            point: {
                pixelSize: 0,
                color: Cesium.Color.WHITE.withAlpha(0),
                outlineColor: Cesium.Color.WHITE.withAlpha(0),
                outlineWidth: 0
            }
        });
        viewer.flyTo(entity, {
            duration: Duration,
            offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(Pitch), Distance)
        });
    },
    
    /*
    * 围绕中心点旋转
     * x: 经度
     * y: 纬度
     * period: 旋转时长，单位：秒
     * pitch 俯仰角（-90~90），默认-90，-90为相机看向正下方，默认值为 -30 度
     * speed: 每秒飞行速度（单位：度/秒），默认值为 2 度
     * distance 相机与目标的距离(单位：米)，默认值为 5000 米
     * */
    lookAround: function (x, y, period, pitch, speed, distance) {
        // 相机看点的角度，如果大于0那么则是从地底往上看，所以要为负值，这里取-30 度
        let Pitch = Cesium.Math.toRadians(pitch ? pitch : -30);
        // 每秒转动度数
        let angle = speed ? speed : 2;
        // 给定相机距离点多少距离飞行，这里取值为5000m
        let dis = distance ? distance : 5000;
        let startTime = Cesium.JulianDate.fromDate(new Date());
        let stopTime = Cesium.JulianDate.addSeconds(
            startTime,
            period,
            new Cesium.JulianDate()
        );
        viewer.clock.startTime = startTime.clone(); // 开始时间
        viewer.clock.stopTime = stopTime.clone(); // 结速时间
        viewer.clock.currentTime = startTime.clone(); // 当前时间
        viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; // 行为方式
        viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK; // 时钟设置为当前系统时间; 忽略所有其他设置。
        // 相机的当前 heading
        let initialHeading = viewer.camera.heading;
        let Exection = function TimeExecution() {
            // 当前已经过去的时间，单位s
            let delTime = Cesium.JulianDate.secondsDifference(
                viewer.clock.currentTime,
                viewer.clock.startTime
            );
            let heading = Cesium.Math.toRadians(delTime * angle) + initialHeading;
            viewer.scene.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(x, y), // 点的坐标
                orientation: {
                    heading: heading,
                    pitch: Pitch
                }
            });
            viewer.scene.camera.moveBackward(dis);
            if (
                Cesium.JulianDate.compare(
                    viewer.clock.currentTime,
                    viewer.clock.stopTime
                ) >= 0
            ) {
                viewer.clock.onTick.removeEventListener(Exection);
            }
        };
        viewer.clock.onTick.addEventListener(Exection);
    },
    /*
    * 注销中心点旋转
     * */
    removeLookAround: function () {
        viewer.clock.onTick._listeners.forEach(item => { viewer.clock.onTick.removeEventListener(item) })
    }
}

export { PGC, Cesium }