/**
 * 搜索控件
 */
const SearchControl = function(viewer, options) {
    let defaultOptions = {
        show: true,
        activate: false,
        type: "circle",//circle、rectangle、polygon
        fillColor: "#53b4df",
        textColor: "#FFFF00",
        lineColor: "#1d7ca7",
        opacity: 0.2,
        width: 2.0,
        dash: true,
        dashLength: 16.0
    }

    this.viewer = viewer;
    this.webMercatorProjection = new Cesium.WebMercatorProjection(this.viewer.scene.globe.ellipsoid);//墨卡托坐标转换工具
    Object.assign(defaultOptions, options||{});
    this._show = defaultOptions.show;
    this.type = defaultOptions.type;
    this.fillColor = defaultOptions.fillColor;
    this.textColor = defaultOptions.textColor;
    this.lineColor = defaultOptions.lineColor;
    this.opacity = defaultOptions.opacity;
    this.width = defaultOptions.width;
    this.dash = defaultOptions.dash;
    this.dashLength = defaultOptions.dashLength;
    this._activate = defaultOptions.activate;
    this.callBack = defaultOptions.callBack;
    this.afterOpen = defaultOptions.afterOpen;
    this.afterClose = defaultOptions.afterClose;
    this.restore = defaultOptions.restore;
    this.positions = [];
    this.root;
    this.primitive;
    this.load();
}

Object.defineProperties(SearchControl.prototype, {
    show: {
        get: function() {
            return this._show;
        },
        set: function(bool) {
            this._show = bool;

            if(this._show) {
                this.root.style.display = 'block';
            } else {
                this.drawEnd();
                this.root.style.display = 'none';
            }

            if(this._show && this.afterOpen) {
                this.afterOpen();
            }

            if(!this._show && this.afterClose){
                this.afterClose();
            }
        }
    },
    activate: {
        get: function() {
            return this._activate;
        },
        set: function(bool) {
            this._activate = bool;
            this.load();
            if(bool) {
                this.drawStart();
            } else {
                this.drawEnd();
            }
        }
    }
});

//清空
SearchControl.prototype.clear = function() {
    if(this.root) {
        this.root.remove();
    }
    if(this.primitive){
        this.primitive.clear();
        this.primitive = undefined;
    }
}

//加载
SearchControl.prototype.load = function() {
    this.clear();
    let _this = this;
    let container = _this.viewer.container;
    let selectType = _this._activate?_this.type.toLocaleLowerCase():undefined;
    _this.root = document.createElement("div");
    _this.root.className = "cesium-search-control";
    _this.root.style.display = _this._show?"block":"none";
    container.appendChild(_this.root);

    let content = document.createElement("div");
    content.className = "cesium-search-control-content";
    _this.root.appendChild(content);
    
    //圆
    let circleElement = document.createElement("div");
    circleElement.title = "圆";
    circleElement.className = "cesium-search-control-circle";
    circleElement.innerHTML = `<svg t="1589163568518" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="930" width="32" height="32"><path d="M562.432 40.96H460.8c-22.912 0-41.344 18.432-41.344 41.344v101.376c0 22.912 18.432 41.344 41.344 41.344h101.632c22.912 0 41.344-18.432 41.344-41.344V82.304c0-22.912-18.56-41.344-41.344-41.344zM542.72 164.096h-62.464V101.888H542.72v62.208zM562.432 819.2H460.8c-22.912 0-41.344 18.432-41.344 41.344v101.376c0 22.912 18.432 41.344 41.344 41.344h101.632c22.912 0 41.344-18.432 41.344-41.344v-101.376c0-22.912-18.56-41.344-41.344-41.344zM542.72 942.336h-62.464v-62.208H542.72v62.208z" p-id="931" fill="#FFFFFF"></path><path d="M155.52 475.904c4.096-32.128 12.544-63.488 25.216-93.44 18.048-42.752 44.032-81.28 77.056-114.304s71.424-58.88 114.304-77.056c24.192-10.24 49.28-17.664 75.008-22.4V109.952C262.4 138.752 117.888 288.64 97.152 475.904h58.368zM766.08 268.16c33.024 33.024 58.88 71.424 77.056 114.304 12.672 30.08 21.12 61.312 25.216 93.44H926.72C905.984 288.64 761.472 138.752 576.896 109.952v58.752c25.728 4.736 50.688 12.16 75.008 22.4 42.752 18.048 81.152 44.032 114.176 77.056zM868.352 577.92c-4.096 32.128-12.544 63.488-25.216 93.44-18.048 42.752-44.032 81.28-77.056 114.304s-71.424 58.88-114.304 77.056c-24.192 10.24-49.28 17.664-75.008 22.4v58.752C761.472 914.944 905.984 765.056 926.72 577.92h-58.368zM257.792 785.664c-33.024-33.024-58.88-71.424-77.056-114.304-12.672-30.08-21.12-61.312-25.216-93.44H97.152C117.888 765.056 262.4 914.944 447.104 943.872v-58.752c-25.728-4.736-50.688-12.16-75.008-22.4-42.752-18.176-81.28-44.032-114.304-77.056z" p-id="932" fill="#FFFFFF"></path><path d="M992.768 572.928v-101.632c0-22.912-18.432-41.344-41.344-41.344h-101.376c-22.912 0-41.344 18.432-41.344 41.344v101.632c0 22.912 18.432 41.344 41.344 41.344h101.376c22.784 0 41.344-18.56 41.344-41.344z m-123.264-19.712v-62.464h62.208v62.464h-62.208zM214.528 572.928v-101.632c0-22.912-18.432-41.344-41.344-41.344H71.808c-22.912 0-41.344 18.432-41.344 41.344v101.632c0 22.912 18.432 41.344 41.344 41.344h101.376c22.784 0 41.344-18.56 41.344-41.344z m-123.264-19.712v-62.464h62.208v62.464H91.264z" p-id="933" fill="#FFFFFF"></path></svg>`;
    content.appendChild(circleElement);

    //矩形
    let rectangleElement = document.createElement("div");
    rectangleElement.title = "矩形";
    rectangleElement.className = "cesium-search-control-rectangle";
    rectangleElement.innerHTML = `<svg t="1589164010573" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1742" width="32" height="32"><path d="M900.48 276.48c22.912 0 41.344-18.432 41.344-41.344v-101.632c0-22.912-18.432-41.344-41.344-41.344h-101.376c-22.912 0-41.344 18.432-41.344 41.344V152.32H266.24v-18.816c0-22.912-18.432-41.344-41.344-41.344H123.264C100.48 92.16 81.92 110.72 81.92 133.504v101.376c0 22.912 18.432 41.344 41.344 41.344H142.08V768H123.264C100.48 768 81.92 786.432 81.92 809.344v101.376c0 22.912 18.432 41.344 41.344 41.344h101.632c22.912 0 41.344-18.432 41.344-41.344V892.16h491.52v18.816c0 22.912 18.432 41.344 41.344 41.344h101.376c22.912 0 41.344-18.432 41.344-41.344v-101.632c0-22.912-18.432-41.344-41.344-41.344H881.92V276.48h18.56z m-81.92-123.392h62.208v62.464h-62.208v-62.464z m-675.712 0.128h62.464v62.208h-62.464v-62.208z m62.464 737.92h-62.464v-62.208h62.464v62.208z m675.456 0.128h-62.208v-62.464h62.208v62.464zM817.92 768h-18.816c-22.912 0-41.344 18.432-41.344 41.344V828.16H266.24v-18.816c0-22.912-18.432-41.344-41.344-41.344H206.08V276.224h18.816c22.912 0 41.344-18.432 41.344-41.344V216.32h491.52v18.816c0 22.912 18.432 41.344 41.344 41.344H817.92v491.52z" p-id="1743" fill="#FFFFFF"></path></svg>`;
    content.appendChild(rectangleElement);

    //多边形
    let polygonElement = document.createElement("div");
    polygonElement.title = "多边形";
    polygonElement.className = "cesium-search-control-polygon";
    polygonElement.innerHTML = `<svg t="1589164126350" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1976" width="32" height="32"><path d="M878.592 724.736l3.2-425.216c35.84-16.128 60.8-52.096 60.8-93.952 0-56.704-46.208-102.912-102.912-102.912-35.456 0-66.688 17.92-85.248 45.312l-523.52-33.536c-12.8-42.24-52.096-73.216-98.56-73.216-56.704 0-102.912 46.08-102.912 102.912 0 51.2 37.504 93.696 86.528 101.632l98.688 556.544c-30.976 17.792-51.968 51.2-51.968 89.344 0 56.704 46.208 102.912 102.912 102.912 49.408 0 90.752-34.944 100.608-81.408l380.16-49.92c16.384 35.2 52.096 59.648 93.312 59.648 56.704 0 102.912-46.208 102.912-102.912 0-43.008-26.496-79.872-64-95.232z m-601.344 64.64L179.2 235.776c23.296-11.904 41.472-32.512 50.304-57.344l507.52 32.512c2.432 46.848 36.224 85.504 80.768 95.232l-3.072 414.08c-38.272 9.6-68.096 40.704-75.904 79.616l-379.392 49.792c-14.72-32.512-45.568-56.064-82.176-60.288zM839.68 166.656c21.504 0 38.912 17.408 38.912 38.912 0 21.504-17.408 38.912-38.912 38.912s-38.912-17.408-38.912-38.912c0-21.504 17.408-38.912 38.912-38.912z" p-id="1977" fill="#FFFFFF"></path></svg>`;
    content.appendChild(polygonElement);

    //恢复
    let restoreElement = document.createElement("div");
    restoreElement.title = "恢复";
    restoreElement.className = "cesium-search-control-polygon";
    restoreElement.innerHTML = `<svg t="1589801260070" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1963" width="32" height="32"><path d="M1024 896c0 0-96-556.8-595.2-556.8L428.8 128 0 512l428.8 358.4L428.8 627.2C697.6 627.2 883.2 646.4 1024 896L1024 896 1024 896z" p-id="1964" fill="#FFFFFF"></path></svg>`;
    content.appendChild(restoreElement);

    if(selectType && selectType == 'circle'){
        circleElement.className += " activate";
    } else if(selectType && selectType == "rectangle") {
        rectangleElement.className += " activate";
    } else if(selectType && selectType == "polygon") {
        polygonElement.className += " activate";
    }

    circleElement.onclick = function () {
        _this.type = 'circle';
        _this.activate = true;
    }
    rectangleElement.onclick = function () {
        _this.type = 'rectangle';
        _this.activate = true;
    }
    polygonElement.onclick = function () {
        _this.type = 'polygon';
        _this.activate = true;
    }

    restoreElement.onclick = function () {
        _this.activate = false;
        if(_this.restore){
            _this.restore();
        }
    }
};

//开始
SearchControl.prototype.drawStart = function() {
    let _this = this;
    _this._activate = true;
    _this.positions = [];
}

//结束
SearchControl.prototype.drawEnd = function() {
    let _this = this;
    _this._activate = false;
    _this.positions = [];
}

//鼠标单击
SearchControl.prototype.mouseClick = function(position, position84) {
    let _this = this;
    if(_this._activate){
        if(_this.type == 'circle'){
            _this.positions.push(position);
        } else if(_this.type == 'rectangle'){
            _this.positions.push(position);
        } else if(_this.type == 'polygon'){
            _this.positions.push(position);
        }
    }
}

//鼠标移动
SearchControl.prototype.mouseMove = function(position, position84) {
    let _this = this;
    if(_this._activate) {
        if(!_this.primitive){
            let options = {};
            options.text = "点击开始绘制";
            options.position = position;
            options.positions = [];
            options.fillColor = _this.fillColor,
            options.lineColor = _this.lineColor,
            options.textColor = _this.textColor;
            options.opacity = _this.opacity;
            options.width = _this.width,
            options.dash = _this.dash,
            options.dashLength = _this.dashLength,
            _this.primitive = new CesiumSearchPrimitive(_this.viewer, options)
        } else {
            if(_this.type == 'circle'){
                if(_this.positions.length==0){
                    _this.primitive.text = "点击开始绘制";
                    _this.primitive.position = position;
                    _this.primitive.positions = [];
               } else {
                    let position1 = _this.positions[0];
                    let position2 = position;
                    let result = _this.calculateCircleByWorld3D(position1,position2);
                    _this.primitive.text = "双击开始搜索";
                    _this.primitive.position = position;
                    _this.primitive.positions = result.cartesian3;
               }
            } else if(_this.type == 'rectangle'){
                if(_this.positions.length==0){
                     _this.primitive.text = "点击开始绘制";
                     _this.primitive.position = position;
                     _this.primitive.positions = [];
                } else {
                    let position1 = _this.positions[0];
                    let position2 = position;
                    let result = _this.calculateRectangleByWorld3D(position1, position2);
                    _this.primitive.text = "双击开始搜索";
                    _this.primitive.position = position;
                    _this.primitive.positions = result.cartesian3;
                }
            } else if(_this.type == 'polygon'){
                _this.primitive.text = "双击开始搜索";
                _this.primitive.position = position;
                _this.primitive.positions = [..._this.positions, position];
            }
        }
    }
}

//鼠标双击
SearchControl.prototype.mouseDBClick = function(position, position84) {
    let _this = this;
    
    if(_this._activate && _this.callBack) {
        _this._activate = false;
        _this.load();
        if(_this.type == 'circle'){
            let result = _this.calculateCircleByWorld3D(_this.positions[0],_this.positions[_this.positions.length-1]);
            _this.callBack(result.latlonArr);
        } else if(_this.type == 'rectangle'){
            let result = _this.calculateRectangleByWorld3D(_this.positions[0],_this.positions[_this.positions.length-1]);
            _this.callBack(result.latlonArr);
        } else if(_this.type == 'polygon'){
            let result = _this.transformWGS84ByWorld3D([..._this.positions,_this.positions[0]]);
            _this.callBack(result);
        }
    }
}

//世界坐标数组转经纬度坐标(忽略高度)
SearchControl.prototype.transformWGS84ByWorld3D = function(positions) {
    let result = [];
    positions.forEach(p => {
        let cartographic = Cesium.Cartographic.fromCartesian(p);
        result.push([Number(Cesium.Math.toDegrees(cartographic.longitude)).toFixed(6), Number(Cesium.Math.toDegrees(cartographic.latitude)).toFixed(6)]);
    });

    return result;
}

//世界坐标计算矩形(忽略高度)
SearchControl.prototype.calculateRectangleByWorld3D = function(position1, position2) {
    let result = {cartesian3:[],latlonArr:[]};
    let cartographic1 = Cesium.Cartographic.fromCartesian(position1);
    let cartographic2 = Cesium.Cartographic.fromCartesian(position2);

    result.latlonArr.push([Number(Cesium.Math.toDegrees(cartographic1.longitude)).toFixed(6), Number(Cesium.Math.toDegrees(cartographic1.latitude)).toFixed(6)]);
    result.latlonArr.push([Number(Cesium.Math.toDegrees(cartographic1.longitude)).toFixed(6), Number(Cesium.Math.toDegrees(cartographic2.latitude)).toFixed(6)]);
    result.latlonArr.push([Number(Cesium.Math.toDegrees(cartographic2.longitude)).toFixed(6), Number(Cesium.Math.toDegrees(cartographic2.latitude)).toFixed(6)]);
    result.latlonArr.push([Number(Cesium.Math.toDegrees(cartographic2.longitude)).toFixed(6), Number(Cesium.Math.toDegrees(cartographic1.latitude)).toFixed(6)]);
    result.latlonArr.push([Number(Cesium.Math.toDegrees(cartographic1.longitude)).toFixed(6), Number(Cesium.Math.toDegrees(cartographic1.latitude)).toFixed(6)]);
    let positions = result.latlonArr.join(",").split(",");
    result.cartesian3 = Cesium.Cartesian3.fromDegreesArray(positions);

    return result;
}

//世界坐标计算圆(忽略高度)
SearchControl.prototype.calculateCircleByWorld3D = function(position1, position2) {
    let result = {cartesian3:[],latlonArr:[]};
    position1 = this.webMercatorProjection.project(Cesium.Cartographic.fromCartesian(position1));
    position2 = this.webMercatorProjection.project(Cesium.Cartographic.fromCartesian(position2));

    let sizes = 64;
    let radius = Math.sqrt(Math.pow((position1.x-position2.x),2) + Math.pow((position1.y-position2.y),2));
    for(let i = 0; i < sizes; i++){
        let angle = (i/sizes) * Math.PI * 2.0;
        let dx = Math.cos( angle ) * radius;
        let dy = Math.sin( angle ) * radius;
        let x = position1.x + dx;
        let y = position1.y + dy;
        let p = this.webMercatorProjection.unproject(new Cesium.Cartesian3(x, y, position1.z));
        result.cartesian3.push(Cesium.Cartographic.toCartesian(p.clone()));
        let lat = Number(Cesium.Math.toDegrees(p.latitude)).toFixed(6);
        let lon = Number(Cesium.Math.toDegrees(p.longitude)).toFixed(6);
        result.latlonArr.push([lon, lat]);
    }
    result.cartesian3.push(result.cartesian3[0]);
    result.latlonArr.push(result.latlonArr[0]);

    return result;
}

//搜索图元
const CesiumSearchPrimitive = (function () {
    function _(viewer, options) {
        this.viewer = viewer;
        this.type = options.type||"rectangle";
        this.position = options.position;
        this.positions = options.positions||[];
        this.text = options.text||'';
        this._show = options.show||true;

        this.fillColor = options.fillColor||'#FFFF00';
        this.textColor = options.textColor||'#FFFF00';
        this.lineColor = options.lineColor||'#000000';
        this.opacity = options.opacity||'1.0';
        this.width = options.width||'1.0';
        this.dash = options.dash;
        this.dashLength = options.dashLength||16.0;
        this.options = {
            label: {
                text: this.text,
                font: '18px sans-serif',
                fillColor: Cesium.Color.fromCssColorString(this.textColor),
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(20, -20),
            },
            polyline: {
                positions: [],
                material: Cesium.Color.fromCssColorString(this.lineColor),
                width: this.width,
                clampToGround: true
            },
            polygon: {
                hierarchy : [],
                // perPositionHeight : true,
                material :  Cesium.Color.fromCssColorString(this.fillColor).withAlpha(this.opacity),
                // heightReference:20000
            },
        };

        //虚线
        if(this.dash) {
            this.options.polyline.material = new Cesium.PolylineDashMaterialProperty({
                color: Cesium.Color.fromCssColorString(this.lineColor),
                dashLength: this.dashLength
            });
        }
        
        this._init();
    }

    Object.defineProperties(_.prototype, {
        show: {
            get: function() {
                return this._show;
            },
            set: function(bool) {
                this._show = bool;
                if(this.entity) {
                    this.entity.show = bool;
                }
            }
        },
    });

    _.prototype._init = function () {
        var _self = this;
        var _update = function () {
            return new Cesium.PolygonHierarchy(_self.positions, []);
        };
        var _update0 = function () {
            return _self.positions;
        };
        var _update1 = function () {
            return _self.position;
        };
        var _update2 = function () {
            return _self.text;
        };
     
        this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false);
        this.options.polyline.positions = new Cesium.CallbackProperty(_update0, false);
        this.options.position = new Cesium.CallbackProperty(_update1, false);
        this.options.label.text = new Cesium.CallbackProperty(_update2, false);
        this.entity = this.viewer.entities.add(this.options);
    };

    _.prototype.clear = function () {
        this.viewer.entities.remove(this.entity);
    }

    return _;
})();