//TelSignalSimulationPrimitive.js
;(function(undefined) {
    "use strict"
    var _global;

    /**
     * 电信信号数据模型对象（基于Cesium）
     */
    var TelSignalSimulationPrimitive = function(viewer,options){
        var result = {
            /**
             * 初始化
             * @param {*} viewer 
             * @param {*} options 
             */
            _init: function(viewer,options){
                this.viewer = viewer;//视图
                this.options = options||{};//自定义属性
                this.setOptions();
            },

            /**
             * 设置属性
             */
            setOptions: function(options){
                this.options = $.extend(this.options,options||{});//自定义属性
                
                this.id = this.options.id;//编号
                this.name = this.options.name||"";//名称
                this.modelUri = this.options.modelUri;//模型地址
                this.minDistanceDisplayCondition = this.options.minDistanceDisplayCondition||0.0;//最小显示距离
                this.maxDistanceDisplayCondition = this.options.maxDistanceDisplayCondition||Number.MAX_VALUE;//最大显示距离
                this.properties = this.options.properties||{};//属性
                this.arcInterval =  this.options.arcInterval==undefined?1:this.options.arcInterval;//弧度间隔
                this.fqInterval = this.options.fqInterval==undefined?20:this.options.fqInterval//频率间隔
                this.distance = this.options.distance==undefined?500:this.options.distance//覆盖距离
                this.rotAngle = this.options.rotAngle==undefined?90:this.options.rotAngle//旋转角度
                this.dipAngle = this.options.dipAngle==undefined?0:this.options.dipAngle//下倾角
                this.hArcAngle = this.options.hArcAngle==undefined?60:this.options.hArcAngle//水平弧半角角度
                this.vArcAngle = this.options.vArcAngle==undefined?30:this.options.vArcAngle//垂直弧半角角度

                this.fillColor = this.options.fillColor;//填充色
                this.strokeColor = this.options.strokeColor;//边框色
                this.isBlinking = this.options.isBlinking==undefined?false:this.options.isBlinking;//动画

                this.longitude = this.options.longitude;//经度
                this.latitude = this.options.latitude;//纬度
                this.height = this.options.height;//高度
                this.webMercatorProjection = new Cesium.WebMercatorProjection(this.viewer.scene.globe.ellipsoid);//墨卡托坐标转换工具
                // this.viewPoint = new Cesium.Cartesian3.fromDegrees(this.longitude, this.latitude, this.height);//视点
                this.modelPoint = this._caculateModelPoint();//位置点
                this.viewPoint = this._caculateViewPoint();//视点
                this.viewPointWebMercator = this.webMercatorProjection.project(Cesium.Cartographic.fromCartesian(this.viewPoint));

                this.onClick = this.options.onClick;
                this.onMouseMove = this.options.onMouseMove;

                this.viewPointsObj = {};
                this.primitivePolygon;
                this.primitiveLine;
                this.model;

                //计算中心位置
                this.center = this._caculateCenter();
                this.render();
            },

            /**
             * 计算模型位置
             */
            _caculateModelPoint: function(){
                var point = new Cesium.Cartesian3.fromDegrees(this.longitude, this.latitude, this.height);//原点
                var pointMercator = this.webMercatorProjection.project(Cesium.Cartographic.fromCartesian(point));
                var rotAngle = this.rotAngle + 90;//旋转角
                var radians = Cesium.Math.toRadians(rotAngle);

                var x = pointMercator.x + 2*Math.cos(radians);
                var y = pointMercator.y + 2*Math.sin(radians);
                var z = pointMercator.z;

                return  this._transformMercatorToWorld({x:x,y:y,z:z-2.5});
            },
           
            /**
             * 计算覆盖视点
             */
            _caculateViewPoint: function(){
                var point = new Cesium.Cartesian3.fromDegrees(this.longitude, this.latitude, this.height);//原点
                var pointMercator = this.webMercatorProjection.project(Cesium.Cartographic.fromCartesian(point));
                var rotAngle = this.rotAngle + 90;//旋转角
                var radians = Cesium.Math.toRadians(rotAngle);

                var x = pointMercator.x + 2*Math.cos(radians);
                var y = pointMercator.y + 2*Math.sin(radians);
                var z = pointMercator.z;

                return  this._transformMercatorToWorld({x:x,y:y,z:z});
            },

            /**
             * 计算中心点
             */
            _caculateCenter: function(){
                var _this = this;
                var rotAngle = _this.rotAngle;//旋转角
                var dipAngle = _this.dipAngle;//下倾角
                var hArcAngle = _this.hArcAngle;//水平弧半角角度
                var vArcAngle = _this.vArcAngle;//垂直弧半角角度

                var distance = _this.distance/2;//距离
                var hAngle = rotAngle + 90;//水平角度
                var vAngle = dipAngle - vArcAngle/2+90;//垂直角度

                var radiansV = Cesium.Math.toRadians(vAngle);
                var radiansH = Cesium.Math.toRadians(hAngle);
                var x = _this.viewPointWebMercator.x + distance * Math.sin(radiansV)* Math.cos(radiansH);
                var y = _this.viewPointWebMercator.y + distance * Math.sin(radiansV)* Math.sin(radiansH);
                var z = _this.viewPointWebMercator.z + distance * Math.cos(radiansV);
                _this.center = _this._transformMercatorToWorld({x:x,y:y,z:z});
                return _this.center;
            },
            
            /**
             * 销毁 
             */
            destory: function(){
                if(this.primitivePolygon){
                    this.viewer.scene.primitives.remove(this.primitivePolygon);
                    this.primitivePolygon = undefined;
                }
            
                if(this.primitiveLine){
                    this.viewer.scene.primitives.remove(this.primitiveLine);
                    this.primitiveLine = undefined;
                }
                
                if(this.model){
                    this.viewer.scene.primitives.remove(this.model);
                    this.model = undefined;
                }
            },

            /**
             * 计算渲染
             */
            render: function(startNum){
                var _this = this;
                _this.destory();

                /* 设备绘制 */
                if(_this.modelUri){
                    var hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(-_this.rotAngle), 0, Cesium.Math.toRadians(-_this.dipAngle));
                    // var hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(-_this.rotAngle), 0, Cesium.Math.toRadians(-15));
		            var origin = _this.modelPoint;
                    var modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(origin, hpr);

                    _this.model = viewer.scene.primitives.add(Cesium.Model.fromGltf({
                        // debugShowBoundingVolume: true,
                        show: true,
                        url : _this.modelUri,
                        modelMatrix : modelMatrix,
                        scale: 0.3,
                        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(_this.minDistanceDisplayCondition, _this.maxDistanceDisplayCondition),
                    }));

                    _this.model.properties = _this.properties;
                    _this.model.position = origin;
                    _this.model.name = "天线-"+_this.properties.name;
                    if(_this.onClick){
                        _this.model.onClick = this.onClick;
                    }
                    if(_this.onMouseMove){
                        _this.model.onMouseMove = this.onMouseMove;
                    }
                }

                /*信号模拟 */
                _this.viewPointsObj = {};//结果点
                var disInterval = _this.fqInterval; //距离频率
                var arcInterval = _this.arcInterval; //角度间隔
                var distance = _this.distance;//距离
                var rotAngle = _this.rotAngle;//旋转角
                var dipAngle = _this.dipAngle;//下倾角
                var hArcAngle = _this.hArcAngle;//水平弧半角角度
                var vArcAngle = _this.vArcAngle;//垂直弧半角角度

                // disInterval = 100;
                // arcInterval = 5;
                // distance = 500;
                // rotAngle = 0;
                // dipAngle = 0;
                // hArcAngle = 90;
                // vArcAngle = 60;

                var hMinAngle = rotAngle - hArcAngle/2+90;//水平最小角度
                var hMaxAngle = rotAngle + hArcAngle/2+90;//水平最大角度
                var vMinAngle = dipAngle - vArcAngle/2+90;//垂直最小角度
                var vMaxAngle = dipAngle + vArcAngle/2+90;//垂直最大角度
            
                var polygonPositionArr = [];
                var polygonColorArr = [];
                var polygonIndiceArr = [];
                var linePositionArr = [];
                var lineColorArr = [];
                var lineIndiceArr = [];
                
                var statrtD = startNum?startNum:0;//起始距离
                var endD = statrtD + disInterval;//结束距离

                var rayPointArr = [];
                var linePointArr = [];
                while (statrtD < distance) {
                    _this.viewPointsObj[statrtD] = getPointObjsByDistance(statrtD,vMinAngle,vMaxAngle,hMinAngle,hMaxAngle,arcInterval,statrtD/distance);
                    _this.viewPointsObj[endD] = getPointObjsByDistance(endD,vMinAngle,vMaxAngle,hMinAngle,hMaxAngle,arcInterval,endD/distance);

                    //水平射线面
                    for (var i = 0; i < _this.viewPointsObj[statrtD][0].length-1; i++) {
                        var point1 = _this.viewPointsObj[statrtD][0][i];
                        var point2 = _this.viewPointsObj[statrtD][0][i+1];
                        var point3 = _this.viewPointsObj[endD][0][i];
                        var point4 = _this.viewPointsObj[endD][0][i+1];
                    
                        var point5 = _this.viewPointsObj[statrtD][_this.viewPointsObj[statrtD].length-1][i];
                        var point6 = _this.viewPointsObj[statrtD][_this.viewPointsObj[statrtD].length-1][i+1];
                        var point7 = _this.viewPointsObj[endD][_this.viewPointsObj[statrtD].length-1][i];
                        var point8 = _this.viewPointsObj[endD][_this.viewPointsObj[statrtD].length-1][i+1];

                        rayPointArr.push(point1);
                        rayPointArr.push(point2);
                        rayPointArr.push(point3);
                        rayPointArr.push(point4);

                        rayPointArr.push(point5);
                        rayPointArr.push(point6);
                        rayPointArr.push(point7);
                        rayPointArr.push(point8);

                        if(i == 0){
                            linePointArr.push(point1);
                            linePointArr.push(point3);
                            linePointArr.push(point3);
                            linePointArr.push(point1);

                            linePointArr.push(point6);
                            linePointArr.push(point7);
                            linePointArr.push(point7);
                            linePointArr.push(point6);
                        }

                        if(i == _this.viewPointsObj[statrtD][0].length-2){
                            linePointArr.push(point2);
                            linePointArr.push(point4);
                            linePointArr.push(point4);
                            linePointArr.push(point2);

                            linePointArr.push(point5);
                            linePointArr.push(point8);
                            linePointArr.push(point8);
                            linePointArr.push(point5);
                        }
                    }
                
                    //垂直射线面
                    for (var i = 0; i < _this.viewPointsObj[statrtD].length-1; i++) {
                        var point1 = _this.viewPointsObj[statrtD][i][0];
                        var point2 = _this.viewPointsObj[statrtD][i+1][0];
                        var point3 = _this.viewPointsObj[endD][i][0];
                        var point4 = _this.viewPointsObj[endD][i+1][0];
                    
                        var point5 = _this.viewPointsObj[statrtD][i][_this.viewPointsObj[statrtD][0].length-1];
                        var point6 = _this.viewPointsObj[statrtD][i+1][_this.viewPointsObj[statrtD][0].length-1];
                        var point7 = _this.viewPointsObj[endD][i][_this.viewPointsObj[statrtD][0].length-1];
                        var point8 = _this.viewPointsObj[endD][i+1][_this.viewPointsObj[statrtD][0].length-1];

                        rayPointArr.push(point1);
                        rayPointArr.push(point2);
                        rayPointArr.push(point3);
                        rayPointArr.push(point4);

                        rayPointArr.push(point5);
                        rayPointArr.push(point6);
                        rayPointArr.push(point7);
                        rayPointArr.push(point8);
                    }

                    statrtD = endD + disInterval;
                    endD = statrtD + disInterval;

                    if(statrtD < distance &&  endD  > distance){
                        endD = distance;
                    }
                }

                //根据角度及相关参数获取构造几个的点对象
                function getPointObjsByDistance(distance,vMinAngle,vMaxAngle,hMinAngle,hMaxAngle,arcInterval, scale){
                    var result = [];
                    for (var i = vMinAngle; i < vMaxAngle; i+=arcInterval) {
                        var arr = [];
                        for (var j = hMinAngle; j <= hMaxAngle; j+=arcInterval) {
                            var pointN;
                            var radiansV = Cesium.Math.toRadians(i);
                            var radiansH = Cesium.Math.toRadians(j);
                            var x = _this.viewPointWebMercator.x + distance * Math.sin(radiansV)* Math.cos(radiansH);
                            var y = _this.viewPointWebMercator.y + distance * Math.sin(radiansV)* Math.sin(radiansH);
                            var z = _this.viewPointWebMercator.z + distance * Math.cos(radiansV);
                            pointN = _this._transformMercatorToWorld({x:x,y:y,z:z});
                            
                            // var polygonColor = [scale,0,1-scale,(1.0 - scale)/2];
                            // var lineColor = [scale,0,1-scale,1.0 - scale];
                            var polygonColor = [0,1-scale,0,(1.0 - scale)/2];
                            var lineColor = [0,1-scale,0,1.0 - scale];

                            if(_this.fillColor){
                                polygonColor = [_this.fillColor.red, _this.fillColor.green, _this.fillColor.blue,(1.0 - scale)/2];
                            }
                            
                            if(_this.strokeColor){
                                lineColor = [_this.strokeColor.red, _this.strokeColor.green, _this.strokeColor.blue, 1.0 - scale];
                            }

                            arr.push({value:pointN,distance:distance,polygonColor: polygonColor,lineColor:lineColor});
                        }
                        result.push(arr);
                    }
        
                    return result;
                };

                //计算射线面
                for (var i = 0; i < rayPointArr.length; i+=4) {
                    var p1 = rayPointArr[i];
                    var p2 = rayPointArr[i+1];
                    var p3 = rayPointArr[i+2];
                    var p4 = rayPointArr[i+3];

                    //面
                    polygonPositionArr.push(p1.value.x);
                    polygonPositionArr.push(p1.value.y);
                    polygonPositionArr.push(p1.value.z);
                    polygonColorArr.push(p1.polygonColor[0]);
                    polygonColorArr.push(p1.polygonColor[1]);
                    polygonColorArr.push(p1.polygonColor[2]);
                    polygonColorArr.push(p1.polygonColor[3]);

                    polygonPositionArr.push(p2.value.x);
                    polygonPositionArr.push(p2.value.y);
                    polygonPositionArr.push(p2.value.z);
                    polygonColorArr.push(p2.polygonColor[0]);
                    polygonColorArr.push(p2.polygonColor[1]);
                    polygonColorArr.push(p2.polygonColor[2]);
                    polygonColorArr.push(p2.polygonColor[3]);

                    polygonPositionArr.push(p4.value.x);
                    polygonPositionArr.push(p4.value.y);
                    polygonPositionArr.push(p4.value.z);
                    polygonColorArr.push(p4.polygonColor[0]);
                    polygonColorArr.push(p4.polygonColor[1]);
                    polygonColorArr.push(p4.polygonColor[2]);
                    polygonColorArr.push(p4.polygonColor[3]);

                    polygonPositionArr.push(p1.value.x);
                    polygonPositionArr.push(p1.value.y);
                    polygonPositionArr.push(p1.value.z);
                    polygonColorArr.push(p1.polygonColor[0]);
                    polygonColorArr.push(p1.polygonColor[1]);
                    polygonColorArr.push(p1.polygonColor[2]);
                    polygonColorArr.push(p1.polygonColor[3]);

                    polygonPositionArr.push(p4.value.x);
                    polygonPositionArr.push(p4.value.y);
                    polygonPositionArr.push(p4.value.z);
                    polygonColorArr.push(p4.polygonColor[0]);
                    polygonColorArr.push(p4.polygonColor[1]);
                    polygonColorArr.push(p4.polygonColor[2]);
                    polygonColorArr.push(p4.polygonColor[3]);

                    polygonPositionArr.push(p3.value.x);
                    polygonPositionArr.push(p3.value.y);
                    polygonPositionArr.push(p3.value.z);
                    polygonColorArr.push(p3.polygonColor[0]);
                    polygonColorArr.push(p3.polygonColor[1]);
                    polygonColorArr.push(p3.polygonColor[2]);
                    polygonColorArr.push(p3.polygonColor[3]);

                    polygonIndiceArr.push(polygonIndiceArr.length);
                    polygonIndiceArr.push(polygonIndiceArr.length);
                    polygonIndiceArr.push(polygonIndiceArr.length);
                    polygonIndiceArr.push(polygonIndiceArr.length);
                    polygonIndiceArr.push(polygonIndiceArr.length);
                    polygonIndiceArr.push(polygonIndiceArr.length);

                    //线
                    // linePositionArr.push(p1.value.x);
                    // linePositionArr.push(p1.value.y);
                    // linePositionArr.push(p1.value.z);
                    // lineColorArr.push(p1.lineColor[0]);
                    // lineColorArr.push(p1.lineColor[1]);
                    // lineColorArr.push(p1.lineColor[2]);
                    // lineColorArr.push(p1.lineColor[3]);

                    // linePositionArr.push(p2.value.x);
                    // linePositionArr.push(p2.value.y);
                    // linePositionArr.push(p2.value.z);
                    // lineColorArr.push(p2.lineColor[0]);
                    // lineColorArr.push(p2.lineColor[1]);
                    // lineColorArr.push(p2.lineColor[2]);
                    // lineColorArr.push(p2.lineColor[3]);
                
                    // linePositionArr.push(p2.value.x);
                    // linePositionArr.push(p2.value.y);
                    // linePositionArr.push(p2.value.z);
                    // lineColorArr.push(p2.lineColor[0]);
                    // lineColorArr.push(p2.lineColor[1]);
                    // lineColorArr.push(p2.lineColor[2]);
                    // lineColorArr.push(p2.lineColor[3]);

                    // linePositionArr.push(p4.value.x);
                    // linePositionArr.push(p4.value.y);
                    // linePositionArr.push(p4.value.z);
                    // lineColorArr.push(p4.lineColor[0]);
                    // lineColorArr.push(p4.lineColor[1]);
                    // lineColorArr.push(p4.lineColor[2]);
                    // lineColorArr.push(p4.lineColor[3]);
                    
                    // linePositionArr.push(p4.value.x);
                    // linePositionArr.push(p4.value.y);
                    // linePositionArr.push(p4.value.z);
                    // lineColorArr.push(p4.lineColor[0]);
                    // lineColorArr.push(p4.lineColor[1]);
                    // lineColorArr.push(p4.lineColor[2]);
                    // lineColorArr.push(p4.lineColor[3]);

                    // linePositionArr.push(p3.value.x);
                    // linePositionArr.push(p3.value.y);
                    // linePositionArr.push(p3.value.z);
                    // lineColorArr.push(p3.lineColor[0]);
                    // lineColorArr.push(p3.lineColor[1]);
                    // lineColorArr.push(p3.lineColor[2]);
                    // lineColorArr.push(p3.lineColor[3]);
                    
                    // linePositionArr.push(p3.value.x);
                    // linePositionArr.push(p3.value.y);
                    // linePositionArr.push(p3.value.z);
                    // lineColorArr.push(p3.lineColor[0]);
                    // lineColorArr.push(p3.lineColor[1]);
                    // lineColorArr.push(p3.lineColor[2]);
                    // lineColorArr.push(p3.lineColor[3]);

                    // linePositionArr.push(p1.value.x);
                    // linePositionArr.push(p1.value.y);
                    // linePositionArr.push(p1.value.z);
                    // lineColorArr.push(p1.lineColor[0]);
                    // lineColorArr.push(p1.lineColor[1]);
                    // lineColorArr.push(p1.lineColor[2]);
                    // lineColorArr.push(p1.lineColor[3]);

                    // lineIndiceArr.push(lineIndiceArr.length);
                    // lineIndiceArr.push(lineIndiceArr.length);
                    // lineIndiceArr.push(lineIndiceArr.length);
                    // lineIndiceArr.push(lineIndiceArr.length);
                    // lineIndiceArr.push(lineIndiceArr.length);
                    // lineIndiceArr.push(lineIndiceArr.length);
                    // lineIndiceArr.push(lineIndiceArr.length);
                    // lineIndiceArr.push(lineIndiceArr.length);
                }

                //计算同半径面
                for (var key in _this.viewPointsObj) {
                    if (_this.viewPointsObj.hasOwnProperty(key)) {
                        for (var i = 0; i < _this.viewPointsObj[key].length-1; i++) {
                            var arr = _this.viewPointsObj[key][i];
                            var arr2 = _this.viewPointsObj[key][i+1];
                            for (var j = 0; j < arr.length-1; j++) {
                                
                                var p1 = arr[j];
                                var p2 = arr[j+1];
                                var p3 = arr2[j];
                                var p4 = arr2[j+1];

                                //面
                                polygonPositionArr.push(p1.value.x);
                                polygonPositionArr.push(p1.value.y);
                                polygonPositionArr.push(p1.value.z);
                                polygonColorArr.push(p1.polygonColor[0]);
                                polygonColorArr.push(p1.polygonColor[1]);
                                polygonColorArr.push(p1.polygonColor[2]);
                                polygonColorArr.push(p1.polygonColor[3]);

                                polygonPositionArr.push(p2.value.x);
                                polygonPositionArr.push(p2.value.y);
                                polygonPositionArr.push(p2.value.z);
                                polygonColorArr.push(p2.polygonColor[0]);
                                polygonColorArr.push(p2.polygonColor[1]);
                                polygonColorArr.push(p2.polygonColor[2]);
                                polygonColorArr.push(p2.polygonColor[3]);

                                polygonPositionArr.push(p4.value.x);
                                polygonPositionArr.push(p4.value.y);
                                polygonPositionArr.push(p4.value.z);
                                polygonColorArr.push(p4.polygonColor[0]);
                                polygonColorArr.push(p4.polygonColor[1]);
                                polygonColorArr.push(p4.polygonColor[2]);
                                polygonColorArr.push(p4.polygonColor[3]);

                                polygonPositionArr.push(p1.value.x);
                                polygonPositionArr.push(p1.value.y);
                                polygonPositionArr.push(p1.value.z);
                                polygonColorArr.push(p1.polygonColor[0]);
                                polygonColorArr.push(p1.polygonColor[1]);
                                polygonColorArr.push(p1.polygonColor[2]);
                                polygonColorArr.push(p1.polygonColor[3]);

                                polygonPositionArr.push(p4.value.x);
                                polygonPositionArr.push(p4.value.y);
                                polygonPositionArr.push(p4.value.z);
                                polygonColorArr.push(p4.polygonColor[0]);
                                polygonColorArr.push(p4.polygonColor[1]);
                                polygonColorArr.push(p4.polygonColor[2]);
                                polygonColorArr.push(p4.polygonColor[3]);

                                polygonPositionArr.push(p3.value.x);
                                polygonPositionArr.push(p3.value.y);
                                polygonPositionArr.push(p3.value.z);
                                polygonColorArr.push(p3.polygonColor[0]);
                                polygonColorArr.push(p3.polygonColor[1]);
                                polygonColorArr.push(p3.polygonColor[2]);
                                polygonColorArr.push(p3.polygonColor[3]);

                                polygonIndiceArr.push(polygonIndiceArr.length);
                                polygonIndiceArr.push(polygonIndiceArr.length);
                                polygonIndiceArr.push(polygonIndiceArr.length);
                                polygonIndiceArr.push(polygonIndiceArr.length);
                                polygonIndiceArr.push(polygonIndiceArr.length);
                                polygonIndiceArr.push(polygonIndiceArr.length);

                                //线
                                // linePositionArr.push(p1.value.x);
                                // linePositionArr.push(p1.value.y);
                                // linePositionArr.push(p1.value.z);
                                // lineColorArr.push(p1.lineColor[0]);
                                // lineColorArr.push(p1.lineColor[1]);
                                // lineColorArr.push(p1.lineColor[2]);
                                // lineColorArr.push(p1.lineColor[3]);

                                // linePositionArr.push(p2.value.x);
                                // linePositionArr.push(p2.value.y);
                                // linePositionArr.push(p2.value.z);
                                // lineColorArr.push(p2.lineColor[0]);
                                // lineColorArr.push(p2.lineColor[1]);
                                // lineColorArr.push(p2.lineColor[2]);
                                // lineColorArr.push(p2.lineColor[3]);
                            
                                // linePositionArr.push(p2.value.x);
                                // linePositionArr.push(p2.value.y);
                                // linePositionArr.push(p2.value.z);
                                // lineColorArr.push(p2.lineColor[0]);
                                // lineColorArr.push(p2.lineColor[1]);
                                // lineColorArr.push(p2.lineColor[2]);
                                // lineColorArr.push(p2.lineColor[3]);

                                // linePositionArr.push(p4.value.x);
                                // linePositionArr.push(p4.value.y);
                                // linePositionArr.push(p4.value.z);
                                // lineColorArr.push(p4.lineColor[0]);
                                // lineColorArr.push(p4.lineColor[1]);
                                // lineColorArr.push(p4.lineColor[2]);
                                // lineColorArr.push(p4.lineColor[3]);
                                
                                // linePositionArr.push(p4.value.x);
                                // linePositionArr.push(p4.value.y);
                                // linePositionArr.push(p4.value.z);
                                // lineColorArr.push(p4.lineColor[0]);
                                // lineColorArr.push(p4.lineColor[1]);
                                // lineColorArr.push(p4.lineColor[2]);
                                // lineColorArr.push(p4.lineColor[3]);

                                // linePositionArr.push(p3.value.x);
                                // linePositionArr.push(p3.value.y);
                                // linePositionArr.push(p3.value.z);
                                // lineColorArr.push(p3.lineColor[0]);
                                // lineColorArr.push(p3.lineColor[1]);
                                // lineColorArr.push(p3.lineColor[2]);
                                // lineColorArr.push(p3.lineColor[3]);
                                
                                // linePositionArr.push(p3.value.x);
                                // linePositionArr.push(p3.value.y);
                                // linePositionArr.push(p3.value.z);
                                // lineColorArr.push(p3.lineColor[0]);
                                // lineColorArr.push(p3.lineColor[1]);
                                // lineColorArr.push(p3.lineColor[2]);
                                // lineColorArr.push(p3.lineColor[3]);

                                // linePositionArr.push(p1.value.x);
                                // linePositionArr.push(p1.value.y);
                                // linePositionArr.push(p1.value.z);
                                // lineColorArr.push(p1.lineColor[0]);
                                // lineColorArr.push(p1.lineColor[1]);
                                // lineColorArr.push(p1.lineColor[2]);
                                // lineColorArr.push(p1.lineColor[3]);

                                // lineIndiceArr.push(lineIndiceArr.length);
                                // lineIndiceArr.push(lineIndiceArr.length);
                                // lineIndiceArr.push(lineIndiceArr.length);
                                // lineIndiceArr.push(lineIndiceArr.length);
                                // lineIndiceArr.push(lineIndiceArr.length);
                                // lineIndiceArr.push(lineIndiceArr.length);
                                // lineIndiceArr.push(lineIndiceArr.length);
                                // lineIndiceArr.push(lineIndiceArr.length);
                                
                                if(j == 0){
                                    linePointArr.push(p1);
                                    linePointArr.push(p3);
                                    linePointArr.push(p3);
                                    linePointArr.push(p1);
                                }

                                if(j == arr.length-2){
                                    linePointArr.push(p2);
                                    linePointArr.push(p4);
                                    linePointArr.push(p4);
                                    linePointArr.push(p2);
                                }

                                if(i == 0){
                                    linePointArr.push(p1);
                                    linePointArr.push(p2);
                                    linePointArr.push(p2);
                                    linePointArr.push(p1);
                                }
                                
                                if(i == _this.viewPointsObj[key].length-2){
                                    linePointArr.push(p3);
                                    linePointArr.push(p4);
                                    linePointArr.push(p4);
                                    linePointArr.push(p3);
                                }
                            }
                        }
                    }
                }

                //计算边线
                for (var i = 0; i < linePointArr.length; i+=4) {
                    var p1 = linePointArr[i];
                    var p2 = linePointArr[i+1];
                    var p3 = linePointArr[i+2];
                    var p4 = linePointArr[i+3];

                    //线
                    linePositionArr.push(p1.value.x);
                    linePositionArr.push(p1.value.y);
                    linePositionArr.push(p1.value.z);
                    lineColorArr.push(p1.lineColor[0]);
                    lineColorArr.push(p1.lineColor[1]);
                    lineColorArr.push(p1.lineColor[2]);
                    lineColorArr.push(p1.lineColor[3]);

                    linePositionArr.push(p2.value.x);
                    linePositionArr.push(p2.value.y);
                    linePositionArr.push(p2.value.z);
                    lineColorArr.push(p2.lineColor[0]);
                    lineColorArr.push(p2.lineColor[1]);
                    lineColorArr.push(p2.lineColor[2]);
                    lineColorArr.push(p2.lineColor[3]);
                
                    linePositionArr.push(p2.value.x);
                    linePositionArr.push(p2.value.y);
                    linePositionArr.push(p2.value.z);
                    lineColorArr.push(p2.lineColor[0]);
                    lineColorArr.push(p2.lineColor[1]);
                    lineColorArr.push(p2.lineColor[2]);
                    lineColorArr.push(p2.lineColor[3]);

                    linePositionArr.push(p4.value.x);
                    linePositionArr.push(p4.value.y);
                    linePositionArr.push(p4.value.z);
                    lineColorArr.push(p4.lineColor[0]);
                    lineColorArr.push(p4.lineColor[1]);
                    lineColorArr.push(p4.lineColor[2]);
                    lineColorArr.push(p4.lineColor[3]);
                    
                    linePositionArr.push(p4.value.x);
                    linePositionArr.push(p4.value.y);
                    linePositionArr.push(p4.value.z);
                    lineColorArr.push(p4.lineColor[0]);
                    lineColorArr.push(p4.lineColor[1]);
                    lineColorArr.push(p4.lineColor[2]);
                    lineColorArr.push(p4.lineColor[3]);

                    linePositionArr.push(p3.value.x);
                    linePositionArr.push(p3.value.y);
                    linePositionArr.push(p3.value.z);
                    lineColorArr.push(p3.lineColor[0]);
                    lineColorArr.push(p3.lineColor[1]);
                    lineColorArr.push(p3.lineColor[2]);
                    lineColorArr.push(p3.lineColor[3]);
                    
                    linePositionArr.push(p3.value.x);
                    linePositionArr.push(p3.value.y);
                    linePositionArr.push(p3.value.z);
                    lineColorArr.push(p3.lineColor[0]);
                    lineColorArr.push(p3.lineColor[1]);
                    lineColorArr.push(p3.lineColor[2]);
                    lineColorArr.push(p3.lineColor[3]);

                    linePositionArr.push(p1.value.x);
                    linePositionArr.push(p1.value.y);
                    linePositionArr.push(p1.value.z);
                    lineColorArr.push(p1.lineColor[0]);
                    lineColorArr.push(p1.lineColor[1]);
                    lineColorArr.push(p1.lineColor[2]);
                    lineColorArr.push(p1.lineColor[3]);

                    lineIndiceArr.push(lineIndiceArr.length);
                    lineIndiceArr.push(lineIndiceArr.length);
                    lineIndiceArr.push(lineIndiceArr.length);
                    lineIndiceArr.push(lineIndiceArr.length);
                    lineIndiceArr.push(lineIndiceArr.length);
                    lineIndiceArr.push(lineIndiceArr.length);
                    lineIndiceArr.push(lineIndiceArr.length);
                    lineIndiceArr.push(lineIndiceArr.length);
                }


                var polygonGeometry = new Cesium.Geometry({
                    attributes: {
                        position: new Cesium.GeometryAttribute({
                            componentDatatype: Cesium.ComponentDatatype.DOUBLE,
                            componentsPerAttribute: 3,
                            values: polygonPositionArr
                        }),
                        color: new Cesium.GeometryAttribute({
                            componentDatatype: Cesium.ComponentDatatype.FLOAT,
                            componentsPerAttribute: 4,
                            values: polygonColorArr
                        }),
                    },
                    indices: polygonIndiceArr,
                    primitiveType: Cesium.PrimitiveType.TRIANGLES,
                    boundingSphere: Cesium.BoundingSphere.fromVertices(polygonPositionArr)
                });
                
                var lineGeometry = new Cesium.Geometry({
                    attributes: {
                        position: new Cesium.GeometryAttribute({
                            componentDatatype: Cesium.ComponentDatatype.DOUBLE,
                            componentsPerAttribute: 3,
                            values: linePositionArr
                        }),
                        // width : 10.0,
                        color: new Cesium.GeometryAttribute({
                            componentDatatype: Cesium.ComponentDatatype.FLOAT,
                            componentsPerAttribute: 4,
                            values: lineColorArr
                        }),
                    },
                    indices: lineIndiceArr,
                    primitiveType: Cesium.PrimitiveType.LINES,
                    boundingSphere: Cesium.BoundingSphere.fromVertices(linePositionArr)
                });

                var appearance = _this._getAppearance();
                _this.primitivePolygon = viewer.scene.primitives.add(new Cesium.Primitive({
                    geometryInstances: new Cesium.GeometryInstance({
                        geometry: polygonGeometry,
                        attributes: {
                            distanceDisplayCondition:  new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(_this.minDistanceDisplayCondition, _this.maxDistanceDisplayCondition),
                        },
                    }),
                    appearance: appearance,
                    asynchronous: false
                }));
                _this.primitiveLine = viewer.scene.primitives.add(new Cesium.Primitive({
                    geometryInstances: new Cesium.GeometryInstance({
                        geometry: lineGeometry,
                        attributes: {
                            distanceDisplayCondition:  new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(_this.minDistanceDisplayCondition, _this.maxDistanceDisplayCondition),
                        }
                    }),
                    appearance: appearance,
                    asynchronous: false,
                }));

                _this.primitivePolygon.properties = _this.properties;
                _this.primitiveLine.properties = _this.properties;

                if(_this.onClick){
                    _this.primitivePolygon.onClick = _this.onClick;
                }
            },

            /**
             * 显示/隐藏
             * @param {*} boolean 
             */
            signalShow: function(boolean){
                if(this.primitivePolygon){
                    this.primitivePolygon.show = boolean;
                }
                if(this.primitiveLine){
                    this.primitiveLine.show = boolean;
                }
            },
            
            /**
             * 显示/隐藏
             * @param {*} boolean 
             */
            show: function(boolean){
                if(this.primitivePolygon){
                    this.primitivePolygon.show = boolean;
                }
                if(this.primitiveLine){
                    this.primitiveLine.show = boolean;
                }
                if(this.model){
                    this.model.show = boolean;
                }
            },

            _getAppearance: function(){
                var vs = `
                attribute vec3 position3DHigh;
                attribute vec3 position3DLow;
                attribute vec3 position;
                attribute vec4 color;
                varying vec4 v_color;
                varying vec3 v_positionMC;
                attribute float batchId;
                void main()
                {
                    vec4 p = czm_computePosition();
                    v_color =color;
                    v_positionMC = position;
                    p = czm_modelViewProjectionRelativeToEye * p;
                    gl_Position = p;
                }
                `;

                
                var fs1 = `
                varying vec4 v_color;
                varying vec3 v_positionMC;
                precision mediump float;
                void main()
                {
                    // float time = fract(czm_frameNumber / 60.0);
                    // gl_FragColor = v_color*max(time, 1.0-time);
                    gl_FragColor = v_color;
                }
                `;

                var fs2 = `
                varying vec4 v_color;
                varying vec3 v_positionMC;
                precision mediump float;
                void main()
                {
                    float time = fract(czm_frameNumber / 60.0);
                    if(time > 0.5){
                        gl_FragColor = v_color;
                    } else {
                        gl_FragColor = v_color*0.5;
                    }
                }
                `;
                var fs = fs1;
                if(this.isBlinking){
                    fs = fs2;
                }

                var appearance = new Cesium.MaterialAppearance({         
                    renderState: {
                        blending: Cesium.BlendingState.PRE_MULTIPLIED_ALPHA_BLEND,  
                        depthTest: {
                            enabled: true,
                            func: Cesium.DepthFunction.LESS_OR_EQUAL
                        },
                    },
                    fragmentShaderSource: fs,
                    vertexShaderSource: vs,
                    closed: true,
                    translucent: true,
                    faceForward: true,//当有光照的的时候，当视图正对它的时候反转法向量，避免墙体的背面是黑色的
                    flat: true,//true,纯色着色，不考虑光照效果。
                });
                
                return appearance;
            },
    
            /**
             * 墨卡托转世界坐标
             */
            _transformMercatorToWorld: function(point){
                var resultPoint = this.webMercatorProjection.unproject(new Cesium.Cartesian3(point.x, point.y, point.z==undefined?0:point.z));
                resultPoint = Cesium.Cartographic.toCartesian(resultPoint.clone());
                return resultPoint;
            }
        };

        result._init(viewer,options);

        return result;
    };

    // 将插件对象暴露给全局对象
    _global = (function(){ return this || (0, eval)('this'); }());
    if(typeof module !=="undefined" && module.exports) {
        module.exports = TelSignalSimulationPrimitive;
    } else if (typeof define === "function" && define.amd) {
        define(function() {return TelSignalSimulationPrimitive;});
    } else {
        !('TelSignalSimulationPrimitive' in _global) && (_global.TelSignalSimulationPrimitive = TelSignalSimulationPrimitive);
    }
  }());


  //SignalHousePrimitive.js
;(function(undefined) {
    "use strict"
    var _global;

    /**
     * 机房模型对象（基于Cesium）
     */
    var SignalHousePrimitive = function(viewer,options){
        var result = {
            /**
             * 初始化
             * @param {*} viewer 
             * @param {*} options 
             */
            _init: function(viewer,options){
                this.viewer = viewer;//视图
                this.options = options||{};//自定义属性
                this.setOptions();
            },

            /**
             * 设置属性
             */
            setOptions: function(options){
                this.options = $.extend(this.options,options||{});//自定义属性

                this.code = this.options.code;
                this.longitude = this.options.longitude;
                this.latitude = this.options.latitude;
                this.path = this.options.path||[];
                this.modelUri = this.options.modelUri;
                this.minDistanceDisplayCondition = this.options.minDistanceDisplayCondition||0.0;//最小显示距离
                this.maxDistanceDisplayCondition = this.options.maxDistanceDisplayCondition||Number.MAX_VALUE;//最大显示距离
                this.onClick = this.options.onClick;
                this.onMouseMove = this.options.onMouseMove;
                
                this.model;
                this.netLine;

                this.render();
            },

            /**
             * 渲染
             */
            render: function(){
                var _this = this;

                _this.destory();

                //机房
                var hpr = new Cesium.HeadingPitchRoll(0.0, 0.0, 0.0);
                var origin =new Cesium.Cartesian3.fromDegrees(_this.longitude, _this.latitude, 0);
                var modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(origin, hpr);
                _this.model = _this.viewer.scene.primitives.add(Cesium.Model.fromGltf({
                    show: true,
                    url : _this.modelUri,
                    modelMatrix : modelMatrix,
                    scale: 1.0,
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(_this.minDistanceDisplayCondition, _this.maxDistanceDisplayCondition),
                }));
                _this.model.name = "机房-"+_this.code;
                _this.model.properties = _this.propertie;
                _this.model.position =origin;
                if(_this.onClick){
                    _this.model.onClick = _this.onClick;
                }
                if(_this.onMouseMove){
                    _this.model.onMouseMove = _this.onMouseMove;
                }


                //网线
                var color = "#007fff";
                var width = 2.0;
                var lineInstances = [];
                _this.path.forEach(linePath => {
                    var positions = Cesium.Cartesian3.fromDegreesArrayHeights(linePath);
                    var polyline = new Cesium.PolylineGeometry({
                        positions: positions,
                        width: width,
                    });
                    var geometryLine = Cesium.PolylineGeometry.createGeometry(polyline);
                    var lineInstance = new Cesium.GeometryInstance({
                        geometry: geometryLine,
                        modelMatrix: Cesium.Matrix4.IDENTITY,
                        attributes: {
                            distanceDisplayCondition:  new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(_this.minDistanceDisplayCondition, _this.maxDistanceDisplayCondition),
                        },
                    });
                    lineInstances.push(lineInstance);
                });
                
                var appearance = new Cesium.PolylineMaterialAppearance({
                    material: new Cesium.Material({
                        fabric: {
                            type: 'animationNetLineShader',
                            uniforms: {
                                color: Cesium.Color.fromCssColorString(color),
                                image: getColorRampImge(color, false),
                                glowPower: 0.05,//发光强度，以总线宽的百分比表示（小于1.0）。
                                taperPower: 1.0,//渐缩效果的强度，以总线长的百分比表示。如果为1.0或更高，则不使用锥度效果。
                                xs_time: 360.0,
                            },
                            source: `
                                uniform vec4 color;
                                uniform float glowPower;
                                uniform float taperPower;
                                uniform float xs_time;
                                uniform sampler2D image;
                                czm_material czm_getMaterial(czm_materialInput materialInput)
                                {   
                                    czm_material material = czm_getDefaultMaterial(materialInput);
                                    vec2 st = materialInput.st;
        
                                    float time = czm_frameNumber / xs_time;
                                    vec4 colorImage = texture2D(image, fract(vec2(st.s - time, 0.5 - st.t)));
                                    material.diffuse = (colorImage.rgb+color.rgb)/2.0;
                                    material.alpha = colorImage.a * color.a;
        
                                    // float glow = glowPower / abs(st.t - 0.5) - (glowPower / 0.5);
        
                                    // if (taperPower <= 0.99999) {
                                    //     glow *= min(1.0, taperPower / (0.5 - st.s * 0.5) - (taperPower / 0.5));
                                    // }
        
                                    // vec4 fragColor;
                                    // fragColor.rgb = max(vec3(glow - 1.0 + color.rgb), color.rgb);
                                    // fragColor.a = clamp(0.0, 1.0, glow) * color.a;
                                    // fragColor = czm_gammaCorrect(fragColor);
        
                                    // material.emission = fragColor.rgb;
                                    // material.diffuse = (colorImage.rgb+color.rgb)/2.0;
                                    // material.alpha = fragColor.a*colorImage.a;
        
                                    return material;
                                }
                            `
                        },
                    }),
                    renderState: {
                        depthTest: {
                            enabled: true,
                            func: Cesium.DepthFunction.NOT_EQUAL
                        },
                    },
                });
                _this.netLine = _this.viewer.scene.primitives.add(new Cesium.Primitive({
                    geometryInstances: lineInstances,
                    appearance: appearance,
                    asynchronous: false,
                }));
            },

            show: function(bool){
                if(this.model){
                    this.model.show = bool;
                }
                
                if(this.netLine){
                    this.netLine.show = bool;
                }
            },

            /**
             * 销毁
             */
            destory: function(){
                if(this.model){
                    this.viewer.scene.primitives.remove(this.model);
                    this.model = undefined;
                }
          
                if(this.netLine){
                    this.viewer.scene.primitives.remove(this.netLine);
                    this.netLine = undefined;
                }
            },
            
        };

        result._init(viewer,options);

        return result;
    };

    // 将插件对象暴露给全局对象
    _global = (function(){ return this || (0, eval)('this'); }());
    if(typeof module !=="undefined" && module.exports) {
        module.exports = SignalHousePrimitive;
    } else if (typeof define === "function" && define.amd) {
        define(function() {return SignalHousePrimitive;});
    } else {
        !('SignalHousePrimitive' in _global) && (_global.SignalHousePrimitive = SignalHousePrimitive);
    }
  }());


//SignalInfoWinPrimitive.js
;(function(undefined) {
    "use strict"
    var _global;

    /**
     * 弹窗对象（基于Cesium）
     */
    var SignalInfoWinPrimitive = function(viewer,options){
        var result = {
            /**
             * 初始化
             * @param {*} viewer 
             * @param {*} options 
             */
            _init: function(viewer,options){
                this.viewer = viewer;//视图
                this.options = options||{};//自定义属性
                this.setOptions();
            },

            /**
             * 设置属性
             */
            setOptions: function(options){
                this.options = $.extend(this.options,options||{});//自定义属性
                
                this.title = this.options.title;
                this.content = this.options.content;
                this.onClose = this.options.onClose;
                this.viewPoint = this.options.viewPoint;//视点
                this.webMercatorProjection = new Cesium.WebMercatorProjection(this.viewer.scene.globe.ellipsoid);//墨卡托坐标转换工具
                this.viewPointWebMercator = this.webMercatorProjection.project(Cesium.Cartographic.fromCartesian(this.viewPoint));
                this.lineWidth = 100;
                this.lineHeight = 50;
                this.render();
            },

            /**
             * 渲染
             */
            render: function(){
                var _this = this;

                _this.destory();

                _this.infoWinDom = document.createElement("div");
                _this.infoWinDom.className = "cesium-infowin";

                var infoLine,contentDiv,header,headerTitle,headerBtn,body;
                infoLine = document.createElement("canvas");
                infoLine.width = _this.lineWidth;
                infoLine.height  = _this.lineHeight;
                infoLine.className = "cesium-infowin-line";
                var context = infoLine.getContext('2d');
                context.moveTo(0,_this.lineHeight);
                context.lineTo(_this.lineWidth/2,2);
                context.lineTo(_this.lineWidth,2);
                context.lineWidth = 1;
                context.strokeStyle = "#5c6fd7";
                context.stroke();
                _this.infoWinDom.appendChild(infoLine);

                contentDiv = document.createElement("div");
                contentDiv.className = "cesium-infowin-content";
                _this.infoWinDom.appendChild(contentDiv);

                header = document.createElement("div");
                header.className = "cesium-infowin-header";
                contentDiv.appendChild(header);

                headerTitle = document.createElement("span");
                headerTitle.className = "cesium-infowin-header-title";
                headerTitle.innerText = _this.title||"";
                header.appendChild(headerTitle);

                headerBtn = document.createElement("button");
                headerBtn.className = "cesium-infowin-header-btn";
                header.appendChild(headerBtn);
                headerBtn.onclick = function(){
                    _this.destory();
                    
                    if(_this.onClose){
                        _this.onClose();
                    }
                };

                body = document.createElement("div");
                body.className = "cesium-infowin-body";
                // body.innerHTML = _this.content||"";
                contentDiv.appendChild(body);
                
                if(_this.content){
                    body.appendChild( _this.content);
                }

                _this.viewer.container.appendChild(_this.infoWinDom);
                _this.listener = _this.viewer.scene.postRender.addEventListener(function(){
                    var pick = Cesium.SceneTransforms.wgs84ToWindowCoordinates(_this.viewer.scene, _this.viewPoint); 
                    if(pick && pick.x && pick.y && _this.infoWinDom){
                        _this.infoWinDom.style.left =  (pick.x + _this.lineWidth)+"px";
                        _this.infoWinDom.style.top =  (pick.y-_this.infoWinDom.clientHeight/2 - _this.lineHeight)+"px";
                    }
                });
            },

            /**
             * 销毁
             */
            destory: function(){
                if(this.infoWinDom){
                    this.infoWinDom.remove();
                    this.infoWinDom = undefined;
                }
                if(this.listener){
                    this.viewer.scene.postRender.removeEventListener(this.listener);
                }
            },
            
            /**
             * 墨卡托转世界坐标
             */
            _transformMercatorToWorld: function(point){
                var resultPoint = this.webMercatorProjection.unproject(new Cesium.Cartesian3(point.x, point.y, point.z==undefined?0:point.z));
                resultPoint = Cesium.Cartographic.toCartesian(resultPoint.clone());
                return resultPoint;
            }
        };

        result._init(viewer,options);

        return result;
    };

    // 将插件对象暴露给全局对象
    _global = (function(){ return this || (0, eval)('this'); }());
    if(typeof module !=="undefined" && module.exports) {
        module.exports = SignalInfoWinPrimitive;
    } else if (typeof define === "function" && define.amd) {
        define(function() {return SignalInfoWinPrimitive;});
    } else {
        !('SignalInfoWinPrimitive' in _global) && (_global.SignalInfoWinPrimitive = SignalInfoWinPrimitive);
    }
  }());

  //TipInfoWinPrimitive.js
;(function(undefined) {
    "use strict"
    var _global;

    /**
     * 弹窗对象（基于Cesium）
     */
    var TipInfoWinPrimitive = function(viewer,options){
        var result = {
            /**
             * 初始化
             * @param {*} viewer 
             * @param {*} options 
             */
            _init: function(viewer,options){
                this.viewer = viewer;//视图
                this.options = options||{};//自定义属性
                this.setOptions();
            },

            /**
             * 设置属性
             */
            setOptions: function(options){
                this.options = $.extend(this.options,options||{});//自定义属性
                
                this.content = this.options.content;
                this.viewPoint = this.options.viewPoint;//视点
                this.webMercatorProjection = new Cesium.WebMercatorProjection(this.viewer.scene.globe.ellipsoid);//墨卡托坐标转换工具
                this.viewPointWebMercator = this.webMercatorProjection.project(Cesium.Cartographic.fromCartesian(this.viewPoint));
                this.lineWidth = 100;
                this.lineHeight = 20;
                this.render();
            },

            /**
             * 渲染
             */
            render: function(){
                var _this = this;

                _this.destory();

                _this.infoWinDom = document.createElement("div");
                _this.infoWinDom.className = "cesium-tipwin";
                // _this.infoWinDom.style.minWidth = "auto";

               
                var infoLine,contentDiv,header,headerTitle;
                infoLine = document.createElement("canvas");
                infoLine.width = _this.lineWidth;
                infoLine.height = _this.lineHeight;
                infoLine.className = "cesium-tipwin-line";
                var context = infoLine.getContext('2d');
                context.moveTo(0,_this.lineHeight);
                context.lineTo(_this.lineWidth/2,2);
                context.lineTo(_this.lineWidth,2);
                context.lineWidth = 1;
                context.strokeStyle = "#5c6fd7";
                context.stroke();
                _this.infoWinDom.appendChild(infoLine);
                
                contentDiv = document.createElement("div");
                contentDiv.className = "cesium-tipwin-content";
                _this.infoWinDom.appendChild(contentDiv);
                contentDiv.innerText = _this.content||"";
                
                _this.viewer.container.appendChild(_this.infoWinDom);
                _this.listener = _this.viewer.scene.postRender.addEventListener(function(){
                    var pick = Cesium.SceneTransforms.wgs84ToWindowCoordinates(_this.viewer.scene, _this.viewPoint); 
                    if(pick && pick.x && pick.y && _this.infoWinDom){
                        _this.infoWinDom.style.left =  (pick.x + _this.lineWidth)+"px";
                        _this.infoWinDom.style.top =  (pick.y-_this.infoWinDom.clientHeight - _this.lineHeight)+"px";
                    }
                });
            },

            /**
             * 销毁
             */
            destory: function(){
                if(this.infoWinDom){
                    this.infoWinDom.remove();
                    this.infoWinDom = undefined;
                }
                if(this.listener){
                    this.viewer.scene.postRender.removeEventListener(this.listener);
                }
            },
            
            /**
             * 墨卡托转世界坐标
             */
            _transformMercatorToWorld: function(point){
                var resultPoint = this.webMercatorProjection.unproject(new Cesium.Cartesian3(point.x, point.y, point.z==undefined?0:point.z));
                resultPoint = Cesium.Cartographic.toCartesian(resultPoint.clone());
                return resultPoint;
            }
        };

        result._init(viewer,options);

        return result;
    };

    // 将插件对象暴露给全局对象
    _global = (function(){ return this || (0, eval)('this'); }());
    if(typeof module !=="undefined" && module.exports) {
        module.exports = TipInfoWinPrimitive;
    } else if (typeof define === "function" && define.amd) {
        define(function() {return TipInfoWinPrimitive;});
    } else {
        !('TipInfoWinPrimitive' in _global) && (_global.TipInfoWinPrimitive = TipInfoWinPrimitive);
    }
  }());

  //SignalRRUPrimitive.js
;(function(undefined) {
    "use strict"
    var _global;

    /**
     * RRU设备对象（基于Cesium）
     */
    var SignalRRUPrimitive = function(viewer,options){
        var result = {
            /**
             * 初始化
             * @param {*} viewer 
             * @param {*} options 
             */
            _init: function(viewer,options){
                this.viewer = viewer;//视图
                this.options = options||{};//自定义属性
                this.setOptions();
            },

            /**
             * 设置属性
             */
            setOptions: function(options){
                this.options = $.extend(this.options,options||{});//自定义属性
                this.rotAngle = this.options.rotAngle==undefined?90:this.options.rotAngle//旋转角度
                // this.dipAngle = this.options.dipAngle==undefined?0:this.options.dipAngle//下倾角
                this.dipAngle = 0;
                this.modelUri = this.options.modelUri;//模型路径
                this.distanceDisplayCondition = this.options.distanceDisplayCondition;//模型路径
                this.longitude = this.options.longitude;//经度
                this.latitude = this.options.latitude;//纬度
                this.height = this.options.height;//高度
                this.webMercatorProjection = new Cesium.WebMercatorProjection(this.viewer.scene.globe.ellipsoid);//墨卡托坐标转换工具
                this.origin = this._caculateOriginPoint();//位置点
                this.onClick = this.options.onClick;
                this.onMouseMove = this.options.onMouseMove;
                
                this.model;

                this.render();
            },

             /**
             * 计算模型位置
             */
            _caculateOriginPoint: function(){
                var point = new Cesium.Cartesian3.fromDegrees(this.longitude, this.latitude, this.height);//原点
                var pointMercator = this.webMercatorProjection.project(Cesium.Cartographic.fromCartesian(point));
                var rotAngle = this.rotAngle + 90;//旋转角
                var radians = Cesium.Math.toRadians(rotAngle);

                var x = pointMercator.x + 1.5*Math.cos(radians);
                var y = pointMercator.y + 1.5*Math.sin(radians);
                var z = pointMercator.z;

                return  this._transformMercatorToWorld({x:x,y:y,z:z-2.5});
            },

            /**
             * 渲染
             */
            render: function(){
                var _this = this;
                _this.destory();

                /* 设备绘制 */
                var hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(-_this.rotAngle), 0, Cesium.Math.toRadians(-_this.dipAngle));
                var origin = _this.origin;
                var modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(origin, hpr);
                _this.model = _this.viewer.scene.primitives.add(Cesium.Model.fromGltf({
                    show: true,
                    url : _this.modelUri,
                    modelMatrix : modelMatrix,
                    scale: 0.3,
                    distanceDisplayCondition: _this.distanceDisplayCondition,
                }));
                _this.model.properties = this.properties;
                if(_this.onClick){
                    _this.model.onClick = this.onClick;
                }
                if(_this.onMouseMove){
                    _this.model.onMouseMove = this.onMouseMove;
                }
            },

            /**
             * 销毁
             */
            destory: function(){
                if(this.model){
                    this.viewer.scene.primitives.remove(this.model);
                    this.model = undefined;
                }
            },

            /**
             * 是否显示
             * @param {*} bool 
             */
            show: function(bool){
                if(this.model)
                this.model.show = !!bool;
            },
            
            /**
             * 墨卡托转世界坐标
             */
            _transformMercatorToWorld: function(point){
                var resultPoint = this.webMercatorProjection.unproject(new Cesium.Cartesian3(point.x, point.y, point.z==undefined?0:point.z));
                resultPoint = Cesium.Cartographic.toCartesian(resultPoint.clone());
                return resultPoint;
            }
        };

        result._init(viewer,options);

        return result;
    };

    // 将插件对象暴露给全局对象
    _global = (function(){ return this || (0, eval)('this'); }());
    if(typeof module !=="undefined" && module.exports) {
        module.exports = SignalRRUPrimitive;
    } else if (typeof define === "function" && define.amd) {
        define(function() {return SignalRRUPrimitive;});
    } else {
        !('SignalRRUPrimitive' in _global) && (_global.SignalRRUPrimitive = SignalRRUPrimitive);
    }
  }());