/**
 * 圆形封闭墙
 */
var CloseWallOfCircleGeometry = function(options){
    options = options || {};
    var height = options.height||10.0;
    var topRadius = options.topRadius||0.2;
    var bottomRadius = options.bottomRadius||2.0;
    var slices = options.slices||6;
    var angle = options.angle||0.0;
    var origin = options.origin;
    var ellipsoid = Cesium.Ellipsoid.WGS84;
    var webMercatorProjection = new Cesium.WebMercatorProjection(ellipsoid);//墨卡托坐标转换工具
    var originMercator = webMercatorProjection.project(Cesium.Cartographic.fromCartesian(origin));

    //顶点
    var positions = new Float64Array((slices+1)*3*2);
    var index = 0;
    for(var i = 0; i < slices+1; i++){
        if(i == slices){
            positions[index++] = positions[0];
            positions[index++] = positions[1];
            positions[index++] = positions[2];
            positions[index++] = positions[3];
            positions[index++] = positions[4];
            positions[index++] = positions[5];
        } else {
            var angl = (i/slices) * Math.PI * 2.0 + (angle/360)*Math.PI*2.0;
            var dx1 = Math.cos( angl ) * topRadius;
            var dy1 = Math.sin( angl ) * topRadius;
            var x1 = originMercator.x + dx1;
            var y1 = originMercator.y + dy1;
            var z1 = originMercator.z + height;

            var cartographic1 = webMercatorProjection.unproject(new Cesium.Cartesian3(x1, y1, z1));
            var point1 = Cesium.Cartographic.toCartesian(cartographic1.clone());
            positions[index++] = point1.x;
            positions[index++] = point1.y;
            positions[index++] = point1.z;

            var dx2 = Math.cos( angl ) * bottomRadius;
            var dy2 = Math.sin( angl ) * bottomRadius;
            var x2 = originMercator.x + dx2;
            var y2 = originMercator.y + dy2;
            var z2 = originMercator.z + 0.0;

            var cartographic2 = webMercatorProjection.unproject(new Cesium.Cartesian3(x2, y2, z2));
            var point2 = Cesium.Cartographic.toCartesian(cartographic2.clone());
            positions[index++] = point2.x;
            positions[index++] = point2.y;
            positions[index++] = point2.z;
        }
    }

    //二维坐标
    var st = new Float64Array((slices+1)*2*2);

    var indexS = 0;
    for (var i = 0; i < slices+1; i++) {
        st[indexS++] = i/slices;
        st[indexS++] = 1.0;

        st[indexS++] = i/slices;
        st[indexS++] = 0.0;
    }

    var attributes = new Cesium.GeometryAttributes({
        position : new Cesium.GeometryAttribute({
            componentDatatype : Cesium.ComponentDatatype.DOUBLE,
            componentsPerAttribute : 3,
            values : positions
        }),
        st : new Cesium.GeometryAttribute({
            componentDatatype : Cesium.ComponentDatatype.FLOAT,
            componentsPerAttribute : 2,
            values : st
        }),
    });

    //顶点索引
    var indices = new Uint16Array((slices+1)*2*3);
    var indexN = 0;
    for (var i = 0; i < slices*2; i+=2) {
        indices[indexN++] = i;
        indices[indexN++] = i+1;
        indices[indexN++] = i+2;

        indices[indexN++] = i+2;
        indices[indexN++] = i+1;
        indices[indexN++] = i+3;
    }

    //包围球
    var boundingSphere = Cesium.BoundingSphere.fromVertices(positions);

    var geometry = Cesium.GeometryPipeline.computeNormal(new Cesium.Geometry({
        attributes: attributes,
        indices: indices,
        primitiveType: Cesium.PrimitiveType.TRIANGLES,
        boundingSphere: boundingSphere
    }));

    this.attributes = geometry.attributes;
    this.indices = geometry.indices;
    this.primitiveType = geometry.primitiveType;
    this.boundingSphere = geometry.boundingSphere;
};

/**
  * 复合标记点
  * ComposeSymbolPoint.js
  */
;(function(undefined) {
    "use strict"
    var _global;

    var ComposeSymbolPoint = function(options){
        var result = {
            /**
             * 初始化
             * @param {*} options
             */
            _init: function(options){
                this.options = options||{};//自定义属性
                this.initGroundCircleCanvas();
                this.initDashCircleCanvas();
                this.setOptions();
            },

            /**
             * 设置属性
             */
            setOptions: function(options){
                this.options = $.extend(this.options,options||{});//自定义属性
                this.viewer = this.options.viewer;
                this.position = this.options.position;//原点
                this.radius = this.options.radius||100;//半径
                this.height = this.options.height||0;//距地面高度
                this.slices = this.options.slices||6;//边数
                this.color = this.options.color||Cesium.Color.BLUE;//颜色
                this.properties = this.options.properties;
                this.onClick = this.options.onClick;

                this.distanceDisplayCondition = this.options.distanceDisplayCondition||new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(0.0, Number.MAX_VALUE);//显示范围
                this.primitives = new Cesium.PrimitiveCollection();
                this.primitives.show = !!this.options.show;
                this.viewer.scene.primitives.add(this.primitives);

                this.createGroundCircle();
                this.createDashCircle();
                this.createCylinder();
                this.createParticleCylinder();
            },

            /**
             * 初始化底面圆画布
             */
            initGroundCircleCanvas: function() {
                this.groundCircle = document.createElement('canvas');
                this.groundCircle.width = 512;
                this.groundCircle.height = 512;
                var ctx = this.groundCircle.getContext('2d');
                var gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
                gradient.addColorStop(0.1, "rgba(255, 255, 255, 1.0)");
                gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.0)");
                gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.9)");
                gradient.addColorStop(0.7, "rgba(255, 255, 255, 0.0)");
                gradient.addColorStop(0.9, "rgba(255, 255, 255, 0.2)");
                gradient.addColorStop(1.0, "rgba(255, 255, 255, 1.0)");

                ctx.clearRect(0, 0, 512, 512);
                ctx.beginPath();
                ctx.arc(256, 256, 256, 0, Math.PI * 2, true);
                // ctx.fillStyle = "rgb(0, 155, 255)";
                ctx.fillStyle = gradient;
                ctx.fill();
                ctx.restore();
            },

            /**
             * 初始化虚线圆画布
             */
            initDashCircleCanvas: function() {
                this.dashCircle = document.createElement('canvas');
                this.dashCircle.width = 512;
                this.dashCircle.height = 512;
                var ctx = this.dashCircle.getContext('2d');
                ctx.clearRect(0, 0, 512, 512);
                ctx.strokeStyle = "rgb(255, 255, 255)";
                ctx.setLineDash([80, 60]);
                ctx.lineWidth = 30;
                ctx.arc(256, 256, 241, 0, Math.PI * 2, true);
                ctx.stroke();
            },

            /**
             * 创建底面圆
             */
            createGroundCircle() {
                var circle = new Cesium.CircleGeometry({
                    center : this.position,
                    radius : this.radius,
                    height: this.height,
                });
                var geometry = Cesium.CircleGeometry.createGeometry(circle);


                var appearance = new Cesium.MaterialAppearance({
                    // material: Cesium.Material.fromType("Color"),
                    material: new Cesium.Material({
                        fabric : {
                            type : 'xs_cbc',
                            uniforms : {
                                u_image: this.groundCircle,
                                u_color: this.color
                            },
                            source: `
                            uniform vec4 u_color;
                            uniform sampler2D u_image;
                            czm_material czm_getMaterial(czm_materialInput materialInput)
                            {
                                czm_material material = czm_getDefaultMaterial(materialInput);
                                vec2 st = materialInput.st;
                                vec4 colorImage = texture2D(u_image, fract(st));
                                material.diffuse = colorImage.rgb * u_color.rgb;
                                material.alpha = colorImage.a * u_color.a;
                                return material;
                            }
                            `
                        }
                    }),
                    faceForward : true,
                    renderState: {
                        blending: Cesium.BlendingState.PRE_MULTIPLIED_ALPHA_BLEND,
                        depthTest: {
                            enabled: true,
                            func: Cesium.DepthFunction.ALWAYS
                        },
                        depthMask: true,
                    },
                });


                var primitive = this.primitives.add(new Cesium.Primitive({
                    // debugShowBoundingVolume: true,
                    geometryInstances: new Cesium.GeometryInstance({
                        geometry: geometry,
                        attributes: {
                            distanceDisplayCondition:  this.distanceDisplayCondition,
                        },
                    }),
                    appearance: appearance,
                    asynchronous: false
                }));
                primitive.properties = this.properties;
                primitive.onClick = this.onClick;
            },

            /**
             * 创建虚线圆(动态辐射波)
             */
            createDashCircle() {
                var circle = new Cesium.CircleGeometry({
                    center : this.position,
                    radius : this.radius,
                    height: this.height,
                });
                var geometry = Cesium.CircleGeometry.createGeometry(circle);


                var appearance = new Cesium.MaterialAppearance({
                    // material: Cesium.Material.fromType("Color"),
                    material: new Cesium.Material({
                        fabric : {
                            type : 'xs_cdc',
                            uniforms : {
                                u_image: this.dashCircle,
                                u_color: this.color
                            },
                            source: `
                            uniform vec4 u_color;
                            uniform sampler2D u_image;
                            czm_material czm_getMaterial(czm_materialInput materialInput)
                            {
                                czm_material material = czm_getDefaultMaterial(materialInput);
                                vec2 st = materialInput.st;
                                vec2 center = vec2(0.5);
                                //旋转的坐标平移到原点
                                st -= center;
                                //旋转坐标
                                float angle = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;
                                st = vec2(cos(angle)*st.s - sin(angle)*st.t, sin(angle)*st.s + cos(angle)*st.t);
                                //多余部分的图片，设置采样点为(0,0)
                                if (abs(st.s) > 0.5 || abs(st.y) > 0.5) {
                                    st = vec2(0, 0);
                                }
                                //平移回去，完成旋转
                                st += center;

                                //同比变化
                                float angle2 = fract(czm_frameNumber / 360.0)* 3.14159265 * 2.0;
                                float scale = sin(angle2)*5.0;
                                if (scale < 1.0) {
                                    scale = 1.1;
                                }
                                st = st*scale + (scale - 1.0)*-0.5;
                                float distance = distance(center, st);
                                //多余部分的图片，设置采样点为(0,0)
                                if (distance > 0.5) {
                                    st = vec2(0, 0);
                                }
                                vec4 colorImage = texture2D(u_image, fract(st));
                                material.diffuse = colorImage.rgb * u_color.rgb;
                                material.alpha = colorImage.a * u_color.a;
                                return material;
                            }
                            `
                        }
                    }),
                    faceForward : true,
                    renderState: {
                        blending: Cesium.BlendingState.PRE_MULTIPLIED_ALPHA_BLEND,
                        depthTest: {
                            enabled: true,
                            func: Cesium.DepthFunction.ALWAYS
                        },
                        depthMask: true,
                    },
                });


                var primitive = this.primitives.add(new Cesium.Primitive({
                    // debugShowBoundingVolume: true,
                    geometryInstances: new Cesium.GeometryInstance({
                        geometry: geometry,
                        attributes: {
                            distanceDisplayCondition:  this.distanceDisplayCondition,
                        },
                    }),
                    appearance: appearance,
                    asynchronous: false
                }));
                primitive.properties = this.properties;
                primitive.onClick = this.onClick;
            },

            /**
             * 创建圆柱
             */
            createCylinder() {
                var appearance = new Cesium.MaterialAppearance({
                    material: new Cesium.Material({
                        fabric : {
                            type : 'xs_cdc',
                            uniforms : {
                                u_color: this.color
                            },
                            source: `
                            uniform vec4 u_color;
                            czm_material czm_getMaterial(czm_materialInput materialInput)
                            {
                                czm_material material = czm_getDefaultMaterial(materialInput);
                                vec2 st = materialInput.st;
                                float powerRatio = fract(czm_frameNumber / 30.0) + 1.0;
                                float alpha = pow(1.0 - st.t, powerRatio);
                                material.diffuse = u_color.rgb;
                                material.alpha =  u_color.a*alpha;
                                return material;
                            }
                            `
                        }
                    }),
                    faceForward : true,
                    renderState: {
                        blending: Cesium.BlendingState.PRE_MULTIPLIED_ALPHA_BLEND,
                        depthTest: {
                            enabled: true,
                            func: Cesium.DepthFunction.ALWAYS
                        },
                        depthMask: true,
                    },
                });

                var geometry = new CloseWallOfCircleGeometry({
                    height: this.radius*10.0,
                    topRadius: this.radius*0.2*0.1,
                    bottomRadius: this.radius*0.1,
                    slices: this.slices,
                    origin: this.position
                });

                var primitive = this.primitives.add(new Cesium.Primitive({
                    // debugShowBoundingVolume: true,
                    geometryInstances: new Cesium.GeometryInstance({
                        geometry: geometry,
                        attributes: {
                            color: Cesium.ColorGeometryInstanceAttribute.fromColor(this.color),
                            distanceDisplayCondition:  this.distanceDisplayCondition,
                        }
                    }),
                    appearance: appearance,
                    asynchronous: false
                }));
                primitive.properties = this.properties;
                primitive.onClick = this.onClick;
            },

            /**
             * 创建粒子圆柱
             */
            createParticleCylinder() {
                var image = 'data:image/png;base64,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';
                var appearance = new Cesium.MaterialAppearance({
                    material: new Cesium.Material({
                        fabric : {
                            type : 'xs_cdc',
                            uniforms : {
                                u_image: image,
                                u_color: this.color
                            },
                            source: `
                            uniform vec4 u_color;
                            uniform sampler2D u_image;
                            czm_material czm_getMaterial(czm_materialInput materialInput)
                            {
                                czm_material material = czm_getDefaultMaterial(materialInput);
                                vec2 st = materialInput.st;
                                float dt = fract(czm_frameNumber / 90.0);
                                vec2 n_st = fract(vec2(1.0) + st - vec2(dt, dt));
                                vec4 colorImage = texture2D(u_image, n_st);
                                material.diffuse = colorImage.rgb*u_color.rgb;
                                material.alpha = colorImage.a*fract(1.0-st.t);
                                return material;
                            }
                            `
                        }
                    }),
                    faceForward : true,
                    renderState: {
                        blending: Cesium.BlendingState.PRE_MULTIPLIED_ALPHA_BLEND,
                        depthTest: {
                            enabled: true,
                            func: Cesium.DepthFunction.ALWAYS
                        },
                        depthMask: true,
                    },
                });

                var geometry = new CloseWallOfCircleGeometry({
                    height: this.radius*10.0,
                    topRadius: this.radius*0.2,
                    bottomRadius: this.radius*0.5,
                    slices: this.slices,
                    origin: this.position
                });

                var instance = new Cesium.GeometryInstance({
                    geometry: geometry,
                    attributes: {
                        distanceDisplayCondition:  this.distanceDisplayCondition,
                    },
                });


                var primitive = this.primitives.add(new Cesium.Primitive({
                    // debugShowBoundingVolume: true,
                    geometryInstances: instance,
                    appearance: appearance,
                    asynchronous: false
                }));
                primitive.properties = this.properties;
                primitive.onClick = this.onClick;
            },

            /**
             * 是否可见
             * @param boolean bool
             */
            show(bool){
                this.primitives.show = bool;
            },
        };

        result._init(options);

        return result;
    };

    // 将插件对象暴露给全局对象
    _global = (function(){ return this || (0, eval)('this'); }());
    if(typeof module !=="undefined" && module.exports) {
        module.exports = ComposeSymbolPoint;
    } else if (typeof define === "function" && define.amd) {
        define(function() {return ComposeSymbolPoint;});
    } else {
        !('ComposeSymbolPoint' in _global) && (_global.ComposeSymbolPoint = ComposeSymbolPoint);
    }
}());

//广告牌接口类
const InterfaceBillboard = function(options) {
    let defaultOptions = {
        color: '#FFFF00',
        fontSize: 40,
        fontFamily: '楷体',
        font: '40px 楷体',
        text: '乐成中心',
        src: "image/yuecheng_logo2.png",
        canvasWidth: undefined,
        canvasHeight: undefined,
    };
    Object.assign(defaultOptions, options);
    this.color = defaultOptions.color;
    this.fontSize = defaultOptions.fontSize;
    this.fontFamily = defaultOptions.fontFamily;
    this.font = this.fontSize + 'px ' +this.fontFamily;
    this.text = defaultOptions.text;
    this.src = defaultOptions.src;
    this.canvasWidth = defaultOptions.canvasWidth;
    this.canvasHeight = defaultOptions.canvasHeight;
    
    this._canvasOfText = function(text) {
        this.text = text||this.text;
        this._canvas = document.createElement('canvas');
        this._canvas.width = this.canvasWidth || this.fontSize*this.text.length + 10;
        this._canvas.height = this.canvasHeight || this.fontSize + 10;
        var ctx = this._canvas.getContext("2d");
        ctx.fillStyle= "rgba(255,255,255,0)";
        ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
        ctx.font = this.font;
        ctx.fillStyle= this.color;
        ctx.fillText(this.text,5,this.fontSize+5);
    };

    this._canvasOfImage = function(src,callBack) {
        var _this = this;
        this.src = src||this.src;
        _this._image.src = _this.src;
        _this._image.onload = function() {
            var _width = this.width;
            var _height = this.height;
            _this._canvas = document.createElement('canvas');
            _this._canvas.width = _this.canvasWidth||_width;
            _this._canvas.height = _this.canvasHeight||_height;
            var ctx = _this._canvas.getContext("2d");
            ctx.drawImage(_this._image,0,0,_width,_height);
            callBack(_this._canvas);
        }
    };

};


/**
 * 柱状广告牌
 * @param {*} viewer 
 * @param {*} options 
 */
const CylinderBillboard = function(viewer, options) {
    let defaultOptions = {
        show: true,
        color: '#FFFF00',
        fontSize: 40,
        fontFamily: '楷体',
        font: '40px 楷体',
        text: '乐成中心',
        src: "image/yuecheng_logo2.png",
        canvasWidth: undefined,
        canvasHeight: undefined,
        height: 40.0,
        height: 40.0,
        topRadius: 40.0,
        bottomRadius: 40.0,
        slices: 32,
    };
    Object.assign(defaultOptions, options);
    InterfaceBillboard.call(this,defaultOptions);
    this.viewer = viewer;
    this._show = defaultOptions.show;
    this.height = defaultOptions.height;
    this.topRadius = defaultOptions.topRadius;
    this.bottomRadius = defaultOptions.bottomRadius;
    this.slices = defaultOptions.slices;
    this.origin = defaultOptions.origin;
    this._image = new Image();
    this._canvas;
    this._rootContainer;
    this.primitive;
    this.drawByImage(this.src, this.origin, this.canvasWidth, this.canvasHeight);
};

Object.defineProperties(CylinderBillboard.prototype, {
    //显示
    show: {
        get: function () {
            return this._show;
        },
        set: function(bool) {
            this._show = bool;
            if(this.primitive){
                this.primitive.show = bool;
            }
        }
    },
});

//清空
CylinderBillboard.prototype.clear = function() {
    if(this.primitive && this._rootContainer){
        this._rootContainer.remove(this.primitive);
    }
};

//绘制
CylinderBillboard.prototype.draw = function(image, origin) {
    image = image|| this._canvas;
    this.origin = origin||this.origin;
    var height = this.height;
    if(typeof(image) === "object"){
        var ratio = image.width/image.height;
        height = Math.max(this.topRadius, this.bottomRadius)*2*Math.PI/ratio;
    }
    this.clear();
    var viewer = this.viewer;
    var appearance = new Cesium.MaterialAppearance({
        material: new Cesium.Material({
            fabric : {
                type : 'xs_cdc',
                uniforms : {
                    u_image: image
                },
                source: `
                uniform sampler2D u_image;
                czm_material czm_getMaterial(czm_materialInput materialInput)
                {
                    czm_material material = czm_getDefaultMaterial(materialInput);
                    vec2 st = materialInput.st;
                    float dt = fract(czm_frameNumber / 360.0);
                    vec2 n_st = vec2(fract(st.s - dt), st.t);
                    vec4 colorImage = texture2D(u_image, n_st);
                    material.diffuse = colorImage.rgb;
                    material.alpha = colorImage.a;
                    return material;
                }
                `
            }
        }),
        faceForward : true,
        // renderState: {
        //     blending: Cesium.BlendingState.PRE_MULTIPLIED_ALPHA_BLEND,
        //     depthTest: {
        //         enabled: true,
        //         func: Cesium.DepthFunction.ALWAYS
        //     },
        //     depthMask: true,
        // },
    });

    var geometry = new CloseWallOfCircleGeometry({
        height: height,
        topRadius: this.topRadius,
        bottomRadius: this.bottomRadius,
        slices: this.slices,
        origin: this.origin
    });

    var instance = new Cesium.GeometryInstance({
        geometry: geometry,
        attributes: {
            // distanceDisplayCondition:  this.distanceDisplayCondition,
        },
    });

    this._rootContainer = viewer.scene.primitives;
    this.primitive = this._rootContainer.add(new Cesium.Primitive({
        // debugShowBoundingVolume: true,
        geometryInstances: instance,
        appearance: appearance,
        asynchronous: false,
        show: this._show
    }));
};

//绘制文字
CylinderBillboard.prototype.drawByText = function(text, origin, canvasWidth, canvasHeight) {
    var _this = this;
    _this.text = text||_this.text;
    _this.canvasWidth = canvasWidth || _this.canvasWidth;
    _this.canvasHeight = canvasHeight || _this.canvasHeight;
    var image = _this._canvasOfText();
    _this.draw(image, origin);
};

//绘制图片
CylinderBillboard.prototype.drawByImage = function(src, origin, canvasWidth, canvasHeight) {
    var _this = this;
    _this.src = src||_this.src;
    _this.canvasWidth = canvasWidth || _this.canvasWidth;
    _this.canvasHeight = canvasHeight || _this.canvasHeight;
    _this._canvasOfImage(_this.src, function(image){
        _this.draw(image, origin);
    });
};

/**
 * 围栏
 * @param {*} viewer 
 * @param {*} options 
 */
const Enclosure = function(viewer, options) {
    let defaultOptions = {
        show: true,
        color: '#FFFFFF',
        height: 10.0,
    };
    this.viewer = viewer;
    Object.assign(defaultOptions, options);
    this._show = defaultOptions.show;
    this.color = defaultOptions.color;
    this.height = defaultOptions.height;
    this.positions = defaultOptions.positions;
    this._rootContainer;
    this.enclosure;
    this.draw();
};

Object.defineProperties(Enclosure.prototype, {
    //显示
    show: {
        get: function () {
            return this._show;
        },
        set: function(bool) {
            this._show = bool;
            if(this.enclosure){
                this.enclosure.show = bool;
            }
        }
    },
});

//清空
Enclosure.prototype.clear = function() {
    if(this.enclosure && this._rootContainer){
        this._rootContainer.remove(this.enclosure);
    }
};

//绘制
Enclosure.prototype.draw = function(positions, viewer) {
    this.clear();
    this.positions = positions||this.positions;
    this.viewer = viewer||this.viewer;

    viewer = this.viewer;
    positions = this.positions;
    var height = this.height;
    var show = this.show;
    var color = Cesium.Color.fromCssColorString(this.color);
    var maximumHeights = new Array(positions.length).fill(height);
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
            // distanceDisplayCondition:  distanceDisplayCondition,
        },
    });

    var appearance = new Cesium.MaterialAppearance({
        material: new Cesium.Material({
            fabric: {
                type: 'wallGradationShader',
                uniforms: {
                    color: color
                },
                source: `
                    uniform vec4 color;
                    czm_material czm_getMaterial(czm_materialInput materialInput)
                    {   
                        czm_material material = czm_getDefaultMaterial(materialInput);

                        vec2 st = materialInput.st;

                        float changeDiff;
                        float randomNum2 = fract(czm_frameNumber / 360.0);
                        randomNum2 = abs(randomNum2 - 0.5) * 2.0;
                        float changeH = clamp(st.t, 0.0, 1.0);
                        changeDiff = step(0.01, abs(changeH - randomNum2));
                        changeDiff = min(changeDiff, 1.0);
                        changeDiff = 1.0 - changeDiff;
                        material.emission = color.rgb * changeDiff;

                        float powerRatio = fract(czm_frameNumber / 30.0)+1.0;
                        float alpha = pow(1.0 - st.t, powerRatio);
                        material.diffuse = czm_gammaCorrect(color.rgb);
                        material.alpha = alpha * color.a;
                        return material;
                    }
                `
            },
            translucent: true,
        }),
        faceForward: true
    });

    this._rootContainer = viewer.scene.primitives;
    this.enclosure = this._rootContainer.add(new Cesium.Primitive({
        geometryInstances: wallInstance,
        appearance: appearance,
        asynchronous: false,
        show: show
    }));
};