/**
 * 电信信号数据模型对象（基于Cesium）
 */
var TelSignalObject = function(viewer,viewPoint,options){
    var result = {
        /**
         * 初始化
         * @param {*} viewer 
         * @param {*} viewPoint 
         * @param {*} options 
         */
        _init: function(viewer,viewPoint,options){
            this.viewer = viewer;//视图
            this.viewPoint = viewPoint;//视点
            this.options = options||{};//自定义属性
            this.id = this.options.id;//编号
            this.name = this.options.name;//名称
            this.arcInterval =  this.options.arcInterval==undefined?1:this.options.arcInterval;//弧度间隔
            this.fqInterval = this.options.fqInterval==undefined?20:this.options.fqInterval//频率间隔

            this.distance = this.options.distance==undefined?500:this.options.distance//覆盖距离
            this.rotAngle = this.options.rotAngle==undefined?90:this.options.rotAngle//旋转角度
            this.hArcAngle = this.options.hArcAngle==undefined?60:this.options.hArcAngle//水平弧半角角度
            this.vArcAngle = this.options.vArcAngle==undefined?30:this.options.vArcAngle//垂直弧半角角度
            this.dipAngle = this.options.dipAngle==undefined?0:this.options.dipAngle//下倾角

            this.telPoints = [];
            this.ellipsePoints = [];
            this.entityCList = [];
            this.primitivePolygon;
            this.primitiveLine;

            this.webMercatorProjection = new Cesium.WebMercatorProjection(this.viewer.scene.globe.ellipsoid);//墨卡托坐标转换工具
            this.viewPointWebMercator = this.webMercatorProjection.project(Cesium.Cartographic.fromCartesian(this.viewPoint));

            this._calculationTelPoints();
            this._caculateEllipsePoints();
        },
        
        /**
         * 销毁 
         */
        destory: function(){
            this.entityCList.forEach(entity => {
                this.viewer.entities.remove(entity);
            });
            this.entityCList =  [];

            if(this.primitivePolygon){
                this.viewer.scene.primitives.remove(this.primitivePolygon);
            }
            this.primitivePolygon = undefined;
           
            if(this.primitiveLine){
                this.viewer.scene.primitives.remove(this.primitiveLine);
            }
            this.primitiveLine = undefined;
        },

        /**
         * 计算信号点数据
         */
         _calculationTelPoints: function(){
             var _this = this;
             _this.telPoints = [];
 
             var interval = this.fqInterval;
             var minAngle =  -_this.rotAngle - _this.hArcAngle/2+90;
             var maxAngle =  -_this.rotAngle + _this.hArcAngle/2+90;
             var distance = _this.viewPointWebMercator.z*Math.tan(Cesium.Math.toRadians(75+_this.dipAngle));
             for (var i = minAngle; i <= maxAngle; i+=this.arcInterval) {
                 // 度数转弧度
                 var radians = Cesium.Math.toRadians(i);
                 var radius = 0;
                 var tempDistance = distance;
                 for (var num = 0; num*interval <= distance; num++) {
                     radius = num*interval;
                     // 计算目标点
                     var toPoint = new Cesium.Cartesian3( _this.viewPointWebMercator.x + radius * Math.cos(radians),  _this.viewPointWebMercator.y + radius * Math.sin(radians), 0);
                     tempDistance -= interval;
                     toPoint.value = tempDistance/distance;
                     _this.telPoints.push(toPoint);
                 }
             }
         },
 
        /**
         * 计算覆盖椭圆数据
         */
         _caculateEllipsePoints: function(){
             var _this = this;
             _this.ellipsePoints = [];
 
             //计算距离
             var distance = _this.viewPointWebMercator.z*Math.tan(Cesium.Math.toRadians(75+_this.dipAngle));
 
             //计算半径
             var radians1 = Cesium.Math.toRadians(_this.vArcAngle/2);
             var vRadius = distance*Math.tan(radians1);//垂直半径
             var pRadius = vRadius*_this.hArcAngle/_this.vArcAngle;//平行半径
 
             //计算中心点位置
             distance = distance - vRadius;
             var angle = -_this.rotAngle+90;
             var radians2 = Cesium.Math.toRadians(angle);
             var centerPoint = new Cesium.Cartesian3( _this.viewPointWebMercator.x + distance * Math.cos(radians2),  _this.viewPointWebMercator.y + distance * Math.sin(radians2), 0);
             var centerPoint2 = new Cesium.Cartesian3( _this.viewPointWebMercator.x + 10 * Math.cos(radians2),  _this.viewPointWebMercator.y + 10 * Math.sin(radians2), 0);
 
             //计算椭圆点
             var count = 32;
             var radians3 = (Math.PI / 180) * Math.round(180 / count); //弧度
             for(var i = 0; i < count; i++){
                 var x = centerPoint.x + vRadius * Math.sin(radians3 * i);
                 var y = centerPoint.y + pRadius * Math.cos(radians3 * i);
                 _this.ellipsePoints.unshift({x:x,y:y}); //为保持数据顺时针
             }

             for (var j = 0; j < _this.ellipsePoints.length; j++) {
                 _this.ellipsePoints[j] = getTransPoints(centerPoint, _this.ellipsePoints[j], radians2);
             }
             
             this.ellipsePoints.unshift({x: _this.viewPointWebMercator.x, y: _this.viewPointWebMercator.y});

             function getTransPoints(originPoint, newPoint, radians){
                 var l = Math.sqrt(Math.pow(newPoint.x - originPoint.x,2)
                 + Math.pow(newPoint.y - originPoint.y, 2));
                 var cosa = (newPoint.x - originPoint.x)/l;
                 var sina = (newPoint.y - originPoint.y)/l;
                 var siny = sina * Math.cos(radians) + Math.sin(radians) * cosa;
                 var cosy = cosa * Math.cos(radians) - Math.sin(radians) * sina
         
                 return {x: (originPoint.x + l*cosy), y: (originPoint.y + l*siny)};
             }
         },
 
         /**
          * 生成 entityCList面--形成圆锥
          */
         _createEntityCList: function(){
            var viewer = this.viewer;
            var points = this.ellipsePoints;
            var topPoint = this.viewPoint;

            //创建 面
            this.destory();
            for(var i=0;i<points.length;i++){
                var point1,point2;
                if(i==(points.length-1)){
                    point1 = this._transformMercatorToWorld(points[0]);
                    point2 = this._transformMercatorToWorld(points[i]);
                } else {
                    point1 = this._transformMercatorToWorld(points[i]);
                    point2 = this._transformMercatorToWorld(points[i+1]);
                }
                var hierarchy = [topPoint,point1,point2];
                var entityC= viewer.entities.add({
                    name:"三角形",
                    polygon : {
                        hierarchy:hierarchy,
                        outline : false,
                        perPositionHeight:true,//允许三角形使用点的高度
                        material: Cesium.Color.RED.withAlpha(0.3)//光的材质
                    }
                });
                this.entityCList.push(entityC);
            }
         },

         /**
          * 生成 primitiveCList面--形成圆锥
          */
         _createPrimitiveCList: function(){
            var viewer = this.viewer;
            var points = this.ellipsePoints;
            var topPoint = this.viewPoint;

            //创建 面
            this.destory();
            var pointsTemp = [];
            for(var i=0;i<points.length;i++){
                var point1,point2;
                    
                if(i==(points.length-1)){
                    point1 = this._transformMercatorToWorld(points[0]);
                    point2 = this._transformMercatorToWorld(points[i]);
                } else {
                    point1 = this._transformMercatorToWorld(points[i]);
                    point2 = this._transformMercatorToWorld(points[i+1]);
                }
                pointsTemp.push(topPoint);
                pointsTemp.push(point1);
                pointsTemp.push(point2);
            }

            var positionArr = [];
            var colorArr = [];
            var indiceArr = [];
            for(var i=0;i<pointsTemp.length;i+=3){
                positionArr.push(pointsTemp[i].x);
                positionArr.push(pointsTemp[i].y);
                positionArr.push(pointsTemp[i].z);

                positionArr.push(pointsTemp[i+1].x);
                positionArr.push(pointsTemp[i+1].y);
                positionArr.push(pointsTemp[i+1].z);
                
                positionArr.push(pointsTemp[i+2].x);
                positionArr.push(pointsTemp[i+2].y);
                positionArr.push(pointsTemp[i+2].z);

                if(i == 0 || i == (pointsTemp.length-3)) {
                    colorArr.push(0.0);
                    colorArr.push(0.0);
                    colorArr.push(1.0);
                    colorArr.push(0.2);
    
                    colorArr.push(0.0);
                    colorArr.push(0.0);
                    colorArr.push(1.0);
                    colorArr.push(0.2);
                    
                    colorArr.push(1.0);
                    colorArr.push(0.0);
                    colorArr.push(0.0);
                    colorArr.push(0.5);
                } else {
                    colorArr.push(0.0);
                    colorArr.push(0.0);
                    colorArr.push(1.0);
                    colorArr.push(0.2);
    
                    colorArr.push(1.0);
                    colorArr.push(0.0);
                    colorArr.push(0.0);
                    colorArr.push(0.5);
                    
                    colorArr.push(1.0);
                    colorArr.push(0.0);
                    colorArr.push(0.0);
                    colorArr.push(0.5);
                }

                indiceArr.push(i);
                indiceArr.push(i+1);
                indiceArr.push(i+2);
            }

            positionArr = new Float64Array(positionArr);
            colorArr = new Float32Array(colorArr);
            indiceArr = new Uint16Array(indiceArr);
            var geometry = new Cesium.Geometry({
                attributes: {
                    position: new Cesium.GeometryAttribute({
                        componentDatatype: Cesium.ComponentDatatype.DOUBLE,
                        componentsPerAttribute: 3,
                        values: positionArr
                    }),
                    color: new Cesium.GeometryAttribute({
                        componentDatatype: Cesium.ComponentDatatype.FLOAT,
                        componentsPerAttribute: 4,
                        values: colorArr
                    })
                },
                indices: indiceArr,
                primitiveType: Cesium.PrimitiveType.TRIANGLES,
                boundingSphere: Cesium.BoundingSphere.fromVertices(positionArr)
            });
            
            var geometry2 = new Cesium.Geometry({
                attributes: {
                    position: new Cesium.GeometryAttribute({
                        componentDatatype: Cesium.ComponentDatatype.DOUBLE,
                        componentsPerAttribute: 3,
                        values: positionArr
                    }),
                    color: new Cesium.GeometryAttribute({
                        componentDatatype: Cesium.ComponentDatatype.FLOAT,
                        componentsPerAttribute: 4,
                        values: colorArr
                    })
                },
                indices: indiceArr,
                primitiveType: Cesium.PrimitiveType.LINE_LOOP,
                boundingSphere: Cesium.BoundingSphere.fromVertices(positionArr)
            });

            var vs = "attribute vec3 position3DHigh;\
            attribute vec3 position3DLow;\
            attribute vec4 color;\
            varying vec4 v_color;\
            attribute float batchId;\
            void main()\
            {\
                vec4 p = czm_computePosition();\
                v_color =color;\
                p = czm_modelViewProjectionRelativeToEye * p;\
                gl_Position = p;\
            }\
            ";

            var fs = "varying vec4 v_color;\
            void main()\
            {\
                gl_FragColor =v_color;\
            }\
            ";

            var appearance = new Cesium.Appearance({         
                renderState: {
                    // blending: Cesium.BlendingState.PRE_MULTIPLIED_ALPHA_BLEND , //DISABLED   PRE_MULTIPLIED_ALPHA_BLEND  ALPHA_BLEND 
                    depthTest: {
                        enabled: true,
                        func: Cesium.DepthFunction.LESS_OR_EQUAL
                    },
                    // depthMask: true,
                    polygonOffset: {
                        enabled: true,
                        factor: 1.0,
                        units: 1.0
                    },
                },
                fragmentShaderSource: fs,
                vertexShaderSource: vs
            });

            this.primitivePolygon = viewer.scene.primitives.add(new Cesium.Primitive({
                geometryInstances: new Cesium.GeometryInstance({
                    geometry: geometry,
                    attributes: {
                        distanceDisplayCondition:  new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(0.0, 3000.0),
                    }
                }),
                appearance: appearance,
                asynchronous: false
            }));
            
            this.primitiveLine = viewer.scene.primitives.add(new Cesium.Primitive({
                geometryInstances: new Cesium.GeometryInstance({
                    geometry: geometry2,
                    attributes: {
                        distanceDisplayCondition:  new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(0.0, 3000.0),
                        // color: new Cesium.ColorGeometryInstanceAttribute(1,0,0,1)
                    }
                }),
                appearance: appearance,
                asynchronous: false
            }));
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

    result._init(viewer,viewPoint,options);

    return result;
};


/**
 * 电信信号热力图（基于Cesium）
 */
var TelSignalHeatMapFun = function(viewer, points){

    var result = {
        gridInterval: 1,
        viewPort: {width: 100,height: 100},
        mapbox: null,
        points: [],
        grids: [],
        viewer: null,
        webMercatorProjection: null,
        entity: null,
        canvas: null,

        /**
         * 初始化
         * @param {*} viewer 
         * @param {*} points 
         */
        init: function(viewer, points){
            this.viewer = viewer;
            this.points = points||[];
            this.webMercatorProjection = new Cesium.WebMercatorProjection(viewer.scene.globe.ellipsoid);
            this.palette = this._getColorPaint();

            //准备数据
            this._caculateGridPoints();
            this.render();
        },

         /**
         * 销毁 
         */
        destory: function(){
            if(this.entity){
                this.viewer.entities.remove(this.entity);
                this.entity =  undefined;
            }
        },

        /**
         * 渲染
         */
        render: function(){
            this.destory();
            if(!this.points || this.points.length==0) return;

            var _this = this;
            var viewer = _this.viewer;
            var scene = viewer.scene;

            var bound = [];
            bound[0] = _this.webMercatorProjection.unproject(new Cesium.Cartesian3(_this.mapbox[0], _this.mapbox[1], 0));
            bound[1] = _this.webMercatorProjection.unproject(new Cesium.Cartesian3(_this.mapbox[0], _this.mapbox[3], 0));
            bound[2] = _this.webMercatorProjection.unproject(new Cesium.Cartesian3(_this.mapbox[2], _this.mapbox[3], 0));
            bound[3] = _this.webMercatorProjection.unproject(new Cesium.Cartesian3(_this.mapbox[2], _this.mapbox[1], 0));

            bound[0] = Cesium.Cartographic.toCartesian(bound[0].clone());
            bound[1] = Cesium.Cartographic.toCartesian(bound[1].clone());
            bound[2] = Cesium.Cartographic.toCartesian(bound[2].clone());
            bound[3] = Cesium.Cartographic.toCartesian(bound[3].clone());
            bound[4] = bound[0];
            
            var fs = "varying vec2 v_st;\
            void main()\
            {\
                czm_materialInput materialInput;\
                czm_material material=czm_getMaterial(materialInput,v_st);\
                vec4 color=vec4(material.diffuse + material.emission,material.alpha);\
                if(color.x==1.0&&color.y==1.0&&color.z==1.0&&color.w==1.0) color=vec4(vec3(0.0,0.0,0.0),0.0);\
                gl_FragColor =color;\
            }\
            ";

            var ms = "czm_material czm_getMaterial(czm_materialInput materialInput,vec2 v_st)\
            {\
                vec4 color = texture2D(image, v_st);\
                czm_material material = czm_getDefaultMaterial(materialInput);\
                material.diffuse= color.rgb;\
                material.alpha=color.a;\
                return material;\
            }\
            ";

            var vs = "attribute vec3 position3DHigh;\
            attribute vec3 position3DLow;\
            attribute vec2 st;\
            attribute float batchId;\
            varying vec2 v_st;\
            void main()\
            {\
                vec4 p = czm_computePosition();\
                v_st=st;\
                p = czm_modelViewProjectionRelativeToEye * p;\
                gl_Position = p;\
            }\
            ";
   

            //定义对象
            var canvas =  _this._getRenderCanvas();
            _this.primitive = scene.primitives.add(new Cesium.Primitive({
                geometryInstances : new Cesium.GeometryInstance({
                    geometry : new Cesium.RectangleGeometry({
                        rectangle :Cesium.Rectangle.fromCartesianArray(bound),
                        vertexFormat : Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
                    })
                }),
                appearance : new Cesium.EllipsoidSurfaceAppearance({
                    renderState: {
                        depthTest : {
                            enabled: true,
                            func : Cesium.DepthFunction.GREATER_OR_EQUAL
                        },
                    },
                    material: new Cesium.Material({
                        fabric : {
                            type : 'Image',
                            uniforms : {
                                image: canvas,
                            },
                            source: ms,
                        }
                    }),
                    fragmentShaderSource: fs,
                    vertexShaderSource: vs
                })
            }));
        },

        /**
         * 获取渲染画布
         */
        _getRenderCanvas: function(alphaR){
            var start = Date.now();
            var _this = this;
            var grids = _this.grids;
            if(!_this.canvas){
                _this.canvas = document.createElement("canvas");
            }
            var canvas = _this.canvas;
            var context = canvas.getContext('2d');
            context.clearRect(0,0,canvas.width,canvas.height);  
            context.globalAlpha=0;

            canvas.width = _this.viewPort.width;
            canvas.height = _this.viewPort.height;
            var radius = _this.gridInterval*2;
            console.log(grids.length);
            grids.forEach(grid => {
                var center = [grid.center[0], grid.center[1]];
                context.beginPath();
                var alpha = grid.value;  
                alpha = alpha>1?1:alpha;
                alpha = alpha<0?0:alpha;
                context.globalAlpha = alpha*(alphaR?alphaR:1);
                context.arc(center[0], center[1], radius, 0, Math.PI*2, true);
                var gradient = context.createRadialGradient(center[0], center[1],0,center[0], center[1],radius);
                gradient.addColorStop(0,"rgba(0,0,0,1)");
                gradient.addColorStop(1,"rgba(0,0,0,0)");
                context.fillStyle = gradient;
                context.closePath();
                context.fill();
            });
            console.log((Date.now() - start)/1000);
            //颜色映射
            var img = context.getImageData(0,0,canvas.width,canvas.height);
            var imgData = img.data;
            console.log(imgData.length);
            for (var i = 3; i < imgData.length; i+=4) {
                var alpha = imgData[i];
                var offset = alpha*4;
                if(!offset){
                    continue;
                }
                //映射颜色的rgb值
                imgData[i-3]=this.palette[offset];   
                imgData[i-2]=this.palette[offset+1];
                imgData[i-1]=this.palette[offset+2];
            }
            console.log((Date.now() - start)/1000);
            context.putImageData(img, 0,0,0,0,canvas.width,canvas.height);
            
            
            console.log(canvas);
            return canvas;
        },

        /**
         * 计算网格点
         */
        _caculateGridPoints: function(){
            if(this.points.length==0) return;

            var _this = this;

            //计算边界
            _this.mapbox = [];
            _this.points.forEach(data => {
                var x = data.x;
                var y = data.y;

                if(!_this.mapbox[0]){
                    _this.mapbox[0] = x; 
                    _this.mapbox[1] = y; 
                    _this.mapbox[2] = x; 
                    _this.mapbox[3] = y; 
                } else {
                    _this.mapbox[0] = Math.min(_this.mapbox[0], x); 
                    _this.mapbox[1] = Math.min(_this.mapbox[1], y); 
                    _this.mapbox[2] = Math.max(_this.mapbox[2], x); 
                    _this.mapbox[3] = Math.max(_this.mapbox[3], y); 
                }
            });
            _this.mapbox[0] -= _this.gridInterval/2;
            _this.mapbox[1] -= _this.gridInterval/2;
            _this.mapbox[2] += _this.gridInterval/2;
            _this.mapbox[3] += _this.gridInterval/2;
            _this.mapbox[2] = _this.mapbox[0] + Math.floor((_this.mapbox[2] -  _this.mapbox[0])/_this.gridInterval)*_this.gridInterval;
            _this.mapbox[3] = _this.mapbox[1] + Math.floor((_this.mapbox[3] -  _this.mapbox[1])/_this.gridInterval)*_this.gridInterval;
            _this.viewPort.width = _this.mapbox[2] - _this.mapbox[0];
            _this.viewPort.height = _this.mapbox[3] - _this.mapbox[1];

            var mapDataGrid = [];
            var mapDataGridObj = {};
            _this.points.forEach(data => {
                var point = [data.x, data.y];
                var gridInfo = findGridInfo(_this.viewPort, _this.mapbox, _this.gridInterval, point);
                var idx = gridInfo.idx;
                var minMax = gridInfo.minMax;
                var centerPoint = [minMax[0] + (minMax[2]-minMax[0])/2, minMax[1] + (minMax[3]-minMax[1])/2];
                if(mapDataGridObj[idx]){
                    mapDataGridObj[idx].value += data.value;
                } else {
                    mapDataGridObj[idx] = {center:centerPoint, value:0};
                    mapDataGridObj[idx].value = data.value;
                }
            });

          

            for (var key in mapDataGridObj) {
                if (mapDataGridObj.hasOwnProperty(key)) {
                    var element = mapDataGridObj[key];
                    mapDataGrid.push(element);
                }
            }

            /**
             * 判断点在网格中的分布位置
             * @param {*} viewPoint 
             * @param {*} mapbox 
             * @param {*} interval 
             * @param {*} point 
             */
            function findGridInfo (viewPoint, mapbox, interval, point){
                var clientH = viewPoint.height;
                var gridLng = interval;
                var gridLat = interval;
                var x = Math.floor((point[0] - mapbox[0])/gridLng);
                var y = Math.floor((point[1] - mapbox[1])/gridLat);
                return {
                    idx: "X"+x+"Y"+y,
                    minMax:[
                        gridLng*x,
                        clientH - gridLat*y,
                        gridLng*(x+1),
                        clientH - gridLat*(y+1)
                    ],
                }
            }

            _this.grids = mapDataGrid.filter(data => !!data.value);
           return mapDataGrid.filter(data => !!data.value);
        },

        

        /**
         * 添加点数据
         * @param {*} points 
         */
        addPoints: function(points){
            points = points||[];
            this.points.concat(points);
            this._caculateGridPoints();
            this.render();
        },

        /**
         * 设置数据
         * @param {*} points 
         */
        setPoints: function(points){
            points = points||[];
            this.points = points;
            this._caculateGridPoints();
            this.render();
        },

        /**
         * 获取色带
         */
        _getColorPaint: function () {
            var paletteCanvas = document.createElement("canvas");
            var paletteCtx = paletteCanvas.getContext("2d");
            var gradientConfig = {
                .2: 'rgba(0,0,255,0.2)',
                .3: 'rgba(43,111,231,0.3)',
                .4: 'rgba(2,192,241,0.4)',
                .6: 'rgba(44,222,148,0.6)',
                .8: 'rgba(254,237,83,0.8)',
                .9: 'rgba(255,118,50,0.9)',
                1: 'rgba(255,64,28,1)',
            };
            paletteCanvas.width = 256;
            paletteCanvas.height = 1;
            var gradient = paletteCtx.createLinearGradient(0,0,256,1);
            for (var key in gradientConfig) {
                gradient.addColorStop(key, gradientConfig[key]);
            }
            // gradient.addColorStop(0.2,"rgba(255,0,0,0.8)");
            // gradient.addColorStop(1,"rgba(0,0,255,0.2)");
            paletteCtx.fillStyle = gradient;
            paletteCtx.fillRect(0,0,256,1);

            return paletteCtx.getImageData(0,0,256,1).data;
        }
    };
    
    result.init(viewer, points);
    return result;
}

/**
 * 定义对象
 * @param {*} viewer 视图
 * @param {*} telSignalObjects 电信号对象
 * @param {*} options 配置参数
 */
var TelSignalSimulation = function(viewer,telSignalObjects,options){
    
    var result = {
        /**
         * 初始化
         */
        _init: function(viewer,telSignalObjects,options){
            this.viewer = viewer;
            this.telSignalObjects = telSignalObjects||[];
            this.options = options;
            this.heatMap = new TelSignalHeatMapFun(this.viewer, []);

            this.render();
        },

        /**
         * 渲染
         */
        render: function(){
            var heatMapPoints = [];
          
            this.telSignalObjects.forEach(obj => {
                obj._createPrimitiveCList();
                obj.telPoints.forEach(point => {
                    heatMapPoints.push(point);
                });
            });
            this.heatMap.setPoints(heatMapPoints);
        },
    };

    result._init(viewer,telSignalObjects,options);

    return result;
}