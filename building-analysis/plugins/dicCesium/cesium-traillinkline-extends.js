/**
 * 飞线效果
 * @param {*} viewer 
 * @param {*} options 
 */
const TrailLinkLine = function(viewer, options) {
    let defaultOptions = {
        show: true,
        width: 1.0,
        color: "#f67b02",
        glowPower: 0.2,
        taperPower: 1.0,
        isOut: false,
    };
    this.viewer = viewer;
    Object.assign(defaultOptions, options);
    this._show = defaultOptions.show;
    this.color = defaultOptions.color;
    this.width = defaultOptions.width;
    this.glowPower = defaultOptions.glowPower;
    this.taperPower = defaultOptions.taperPower;
    this.positions = defaultOptions.positions;
    this.properties = defaultOptions.properties;
    this.text = defaultOptions.text;
    this.isOut = defaultOptions.isOut;
    this._rootContainer;
    this.trailLine;
    this.loadToEntity();
};

Object.defineProperties(TrailLinkLine.prototype, {
    show: {
        get: function () {
            return this._show;
        },
        set: function(bool) {
            this._show = bool;
            if(this.trailLine){
                this.trailLine.show = bool;
            }
            if(this.symbol){
                this.symbol.show = bool;
            }
        }
    },
});

//清空
TrailLinkLine.prototype.clear = function(){
    if(this.trailLine && this._rootContainer){
        this._rootContainer.remove(this.trailLine);
    }
    if(this.symbol){
        this.viewer.scene.primitives.remove(this.symbol);
        this.symbol = undefined;
    }
};

//以实例集合的形式加载
TrailLinkLine.prototype.loadToEntity = function(positions, viewer){
    this.clear();
    this.positions = positions||this.positions;
    this.viewer = viewer||this.viewer;

    positions = this.positions;
    viewer = this.viewer;
    if(!positions) return;
    let time = 3000;
    let color = Cesium.Color.fromCssColorString(this.color);
    let width = this.width;
    let glowPower = this.glowPower;
    let taperPower = this.taperPower;
    let properties = this.properties;

    let material = new Cesium.PolylineTrailLinkMaterialProperty(color, time);
    let cartesian3 = positions[0];
    let cartographic = Cesium.Cartographic.fromCartesian(cartesian3);
    let lat = Number(Cesium.Math.toDegrees(cartographic.latitude));
    let lng = Number(Cesium.Math.toDegrees(cartographic.longitude));
    let height = 50*10.0 + 10;
    var position = Cesium.Cartesian3.fromDegrees(lng, lat, height);

    this.trailLine = viewer.entities.add({
        show: this._show,
        properties: properties,
        // position: positions[parseInt(positions.length/2 -5)],
        position: position,
        polyline: {
            positions: positions,
            width: width,
            material: material
        },
        label: {
            text: this.text||"",
            font: '12px Lucida Sans',
            showBackground: true,
            backgroundPadding: new Cesium.Cartesian2(7, 7),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 1.5e4),
        }
    });
    this._rootContainer = viewer.entities;
    this.loadComposeSymbol();
};

//以实例普通图元的形式加载
TrailLinkLine.prototype.loadToPrimitive = function(positions, viewer){
    this.clear();
    this.positions = positions||this.positions;
    this.viewer = viewer||this.viewer;

    positions = this.positions;
    viewer = this.viewer;
    if(!positions) return;

    let time = 3000;
    let color = this.color;
    let width = this.width;
    let glowPower = this.glowPower;
    let taperPower = this.taperPower;
    let properties = this.properties;

    var appearance = new Cesium.PolylineMaterialAppearance({
        material: new Cesium.Material({
            fabric: {
                type: 'animationLineShader',
                uniforms: {
                    color: Cesium.Color.fromCssColorString(color),
                    image: getColorRampImge(color, false),
                    glowPower: glowPower,//发光强度，以总线宽的百分比表示（小于1.0）。
                    taperPower: taperPower,//渐缩效果的强度，以总线长的百分比表示。如果为1.0或更高，则不使用锥度效果。
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

                        float time = czm_frameNumber / 100.0;
                        vec4 colorImage = texture2D(image, fract(vec2(st.s - time, 0.5 - st.t)));
                        material.diffuse = (colorImage.rgb+color.rgb)/2.0;
                        material.alpha = colorImage.a * color.a;

                        float glow = glowPower / abs(st.t - 0.5) - (glowPower / 0.5);

                        if (taperPower <= 0.99999) {
                            glow *= min(1.0, taperPower / (0.5 - st.s * 0.5) - (taperPower / 0.5));
                        }

                        vec4 fragColor;
                        fragColor.rgb = max(vec3(glow - 1.0 + color.rgb), color.rgb);
                        fragColor.a = clamp(0.0, 1.0, glow) * color.a;
                        fragColor = czm_gammaCorrect(fragColor);

                        material.emission = fragColor.rgb;
                        material.diffuse = (colorImage.rgb+color.rgb)/2.0;
                        material.alpha = fragColor.a*colorImage.a;
                        material.diffuse = color.rgb;
                        material.alpha = fragColor.a;

                        return material;
                    }
                `
            },
        }),
        renderState: {
            depthTest: {
                enabled: true,
                func: Cesium.DepthFunction.ALWAYS
            },
        },
    });

    let polyline = new Cesium.PolylineGeometry({
        positions: positions,
        width: width
    });
    let geometry = Cesium.PolylineGeometry.createGeometry(polyline);
    let lineInstance = new Cesium.GeometryInstance({
        geometry: geometry,
        modelMatrix: Cesium.Matrix4.IDENTITY,
        properties: properties,
        attributes: {
            // distanceDisplayCondition:  distanceDisplayCondition,
        },
    });

    var primitive = new Cesium.Primitive({
        geometryInstances: lineInstance,
        appearance: appearance,
        asynchronous: false,
        show: this._show
    });
    primitive.properties = properties;

    this.trailLine = primitive;
    this._rootContainer = viewer.scene.primitives;
    viewer.scene.primitives.add(primitive);
    this.loadComposeSymbol();
};

TrailLinkLine.prototype.loadComposeSymbol = function() {
    if(this.symbol){
        this.viewer.scene.primitives.remove(this.symbol);
        this.symbol = undefined;
    }
    let positions = this.positions;
    let color = this.color;
    let position = positions[0];
    if(this.isOut){
        position = positions[positions.length-1];
    }

    let ellipsoid = this.viewer.scene.globe.ellipsoid;
    let cartographic = ellipsoid.cartesianToCartographic(position);
    let lat = Cesium.Math.toDegrees(cartographic.latitude);
    let lng = Cesium.Math.toDegrees(cartographic.longitude);
    let alt = cartographic.height;
    position = new Cesium.Cartesian3.fromDegrees(lng, lat, 0);
    let csp = new ComposeSymbolPoint({
        show: this._show,
        viewer: this.viewer,
        radius: 50,
        height: 0,
        position: position,
        color: Cesium.Color.fromCssColorString(color),
        slices: 6,
        // distanceDisplayCondition: new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(3000, Number.MAX_VALUE),
    });
    this.symbol = this.viewer.scene.primitives.add(csp.primitives);
};
