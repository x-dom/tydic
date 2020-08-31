/**
 * 搜索控件
 */
const SearchControl = function(map, options) {
    let defaultOptions = {
        show: true,
        activate: false,
        type: "circle",//circle、rectangle、polygon
        fillColor: "#53b4df85",
        textColor: "#FFFF00",
        lineColor: "#1d7ca7",
        opacity: 0.2,
        width: 2.0,
        dash: true,
        dashLength: 16.0
    }

    this.map = map;
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
    let container = _this.map.getTargetElement();
    let selectType = _this._activate?_this.type.toLocaleLowerCase():undefined;
    _this.root = document.createElement("div");
    _this.root.className = "ol3-search-control";
    _this.root.style.display = _this._show?"block":"none";
    container.appendChild(_this.root);

    let content = document.createElement("div");
    content.className = "ol3-search-control-content";
    _this.root.appendChild(content);
    
    //圆
    let circleElement = document.createElement("div");
    circleElement.title = "圆";
    circleElement.className = "ol3-search-control-circle";
    circleElement.innerHTML = `<svg t="1589163568518" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="930" width="32" height="32"><path d="M562.432 40.96H460.8c-22.912 0-41.344 18.432-41.344 41.344v101.376c0 22.912 18.432 41.344 41.344 41.344h101.632c22.912 0 41.344-18.432 41.344-41.344V82.304c0-22.912-18.56-41.344-41.344-41.344zM542.72 164.096h-62.464V101.888H542.72v62.208zM562.432 819.2H460.8c-22.912 0-41.344 18.432-41.344 41.344v101.376c0 22.912 18.432 41.344 41.344 41.344h101.632c22.912 0 41.344-18.432 41.344-41.344v-101.376c0-22.912-18.56-41.344-41.344-41.344zM542.72 942.336h-62.464v-62.208H542.72v62.208z" p-id="931" fill="#FFFFFF"></path><path d="M155.52 475.904c4.096-32.128 12.544-63.488 25.216-93.44 18.048-42.752 44.032-81.28 77.056-114.304s71.424-58.88 114.304-77.056c24.192-10.24 49.28-17.664 75.008-22.4V109.952C262.4 138.752 117.888 288.64 97.152 475.904h58.368zM766.08 268.16c33.024 33.024 58.88 71.424 77.056 114.304 12.672 30.08 21.12 61.312 25.216 93.44H926.72C905.984 288.64 761.472 138.752 576.896 109.952v58.752c25.728 4.736 50.688 12.16 75.008 22.4 42.752 18.048 81.152 44.032 114.176 77.056zM868.352 577.92c-4.096 32.128-12.544 63.488-25.216 93.44-18.048 42.752-44.032 81.28-77.056 114.304s-71.424 58.88-114.304 77.056c-24.192 10.24-49.28 17.664-75.008 22.4v58.752C761.472 914.944 905.984 765.056 926.72 577.92h-58.368zM257.792 785.664c-33.024-33.024-58.88-71.424-77.056-114.304-12.672-30.08-21.12-61.312-25.216-93.44H97.152C117.888 765.056 262.4 914.944 447.104 943.872v-58.752c-25.728-4.736-50.688-12.16-75.008-22.4-42.752-18.176-81.28-44.032-114.304-77.056z" p-id="932" fill="#FFFFFF"></path><path d="M992.768 572.928v-101.632c0-22.912-18.432-41.344-41.344-41.344h-101.376c-22.912 0-41.344 18.432-41.344 41.344v101.632c0 22.912 18.432 41.344 41.344 41.344h101.376c22.784 0 41.344-18.56 41.344-41.344z m-123.264-19.712v-62.464h62.208v62.464h-62.208zM214.528 572.928v-101.632c0-22.912-18.432-41.344-41.344-41.344H71.808c-22.912 0-41.344 18.432-41.344 41.344v101.632c0 22.912 18.432 41.344 41.344 41.344h101.376c22.784 0 41.344-18.56 41.344-41.344z m-123.264-19.712v-62.464h62.208v62.464H91.264z" p-id="933" fill="#FFFFFF"></path></svg>`;
    content.appendChild(circleElement);

    //矩形
    let rectangleElement = document.createElement("div");
    rectangleElement.title = "矩形";
    rectangleElement.className = "ol3-search-control-rectangle";
    rectangleElement.innerHTML = `<svg t="1589164010573" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1742" width="32" height="32"><path d="M900.48 276.48c22.912 0 41.344-18.432 41.344-41.344v-101.632c0-22.912-18.432-41.344-41.344-41.344h-101.376c-22.912 0-41.344 18.432-41.344 41.344V152.32H266.24v-18.816c0-22.912-18.432-41.344-41.344-41.344H123.264C100.48 92.16 81.92 110.72 81.92 133.504v101.376c0 22.912 18.432 41.344 41.344 41.344H142.08V768H123.264C100.48 768 81.92 786.432 81.92 809.344v101.376c0 22.912 18.432 41.344 41.344 41.344h101.632c22.912 0 41.344-18.432 41.344-41.344V892.16h491.52v18.816c0 22.912 18.432 41.344 41.344 41.344h101.376c22.912 0 41.344-18.432 41.344-41.344v-101.632c0-22.912-18.432-41.344-41.344-41.344H881.92V276.48h18.56z m-81.92-123.392h62.208v62.464h-62.208v-62.464z m-675.712 0.128h62.464v62.208h-62.464v-62.208z m62.464 737.92h-62.464v-62.208h62.464v62.208z m675.456 0.128h-62.208v-62.464h62.208v62.464zM817.92 768h-18.816c-22.912 0-41.344 18.432-41.344 41.344V828.16H266.24v-18.816c0-22.912-18.432-41.344-41.344-41.344H206.08V276.224h18.816c22.912 0 41.344-18.432 41.344-41.344V216.32h491.52v18.816c0 22.912 18.432 41.344 41.344 41.344H817.92v491.52z" p-id="1743" fill="#FFFFFF"></path></svg>`;
    content.appendChild(rectangleElement);

    //多边形
    let polygonElement = document.createElement("div");
    polygonElement.title = "多边形";
    polygonElement.className = "ol3-search-control-polygon";
    polygonElement.innerHTML = `<svg t="1589164126350" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1976" width="32" height="32"><path d="M878.592 724.736l3.2-425.216c35.84-16.128 60.8-52.096 60.8-93.952 0-56.704-46.208-102.912-102.912-102.912-35.456 0-66.688 17.92-85.248 45.312l-523.52-33.536c-12.8-42.24-52.096-73.216-98.56-73.216-56.704 0-102.912 46.08-102.912 102.912 0 51.2 37.504 93.696 86.528 101.632l98.688 556.544c-30.976 17.792-51.968 51.2-51.968 89.344 0 56.704 46.208 102.912 102.912 102.912 49.408 0 90.752-34.944 100.608-81.408l380.16-49.92c16.384 35.2 52.096 59.648 93.312 59.648 56.704 0 102.912-46.208 102.912-102.912 0-43.008-26.496-79.872-64-95.232z m-601.344 64.64L179.2 235.776c23.296-11.904 41.472-32.512 50.304-57.344l507.52 32.512c2.432 46.848 36.224 85.504 80.768 95.232l-3.072 414.08c-38.272 9.6-68.096 40.704-75.904 79.616l-379.392 49.792c-14.72-32.512-45.568-56.064-82.176-60.288zM839.68 166.656c21.504 0 38.912 17.408 38.912 38.912 0 21.504-17.408 38.912-38.912 38.912s-38.912-17.408-38.912-38.912c0-21.504 17.408-38.912 38.912-38.912z" p-id="1977" fill="#FFFFFF"></path></svg>`;
    content.appendChild(polygonElement);

    //恢复
    let restoreElement = document.createElement("div");
    restoreElement.title = "恢复";
    restoreElement.className = "ol3-search-control-polygon";
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
SearchControl.prototype.mouseClick = function(position) {
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
SearchControl.prototype.mouseMove = function(position) {
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
            _this.primitive = new Ol3SearchPrimitive(_this.map, options)
        } else {
            if(_this.type == 'circle'){
                if(_this.positions.length==0){
                    _this.primitive.text = "点击开始绘制";
                    _this.primitive.position = position;
                    _this.primitive.positions = [];
               } else {
                    let position1 = _this.positions[0];
                    let position2 = position;
                    let result = _this.calculateCircle(position1,position2);
                    _this.primitive.text = "双击开始搜索";
                    _this.primitive.position = position;
                    _this.primitive.positions = [result.orignalArr];
               }
            } else if(_this.type == 'rectangle'){
                if(_this.positions.length==0){
                     _this.primitive.text = "点击开始绘制";
                     _this.primitive.position = position;
                     _this.primitive.positions = [];
                } else {
                    let position1 = _this.positions[0];
                    let position2 = position;
                    let result = _this.calculateRectangle(position1, position2);
                    _this.primitive.text = "双击开始搜索";
                    _this.primitive.position = position;
                    _this.primitive.positions = [result.orignalArr];
                }
            } else if(_this.type == 'polygon'){
                _this.primitive.text = "双击开始搜索";
                _this.primitive.position = position;
                _this.primitive.positions = [[..._this.positions, position]];
            }
        }
    }
}

//鼠标双击
SearchControl.prototype.mouseDBClick = function(position) {
    let _this = this;
    
    if(_this._activate && _this.callBack) {
        _this._activate = false;
        _this.load();
        if(_this.type == 'circle'){
            let result = _this.calculateCircle(_this.positions[0],_this.positions[_this.positions.length-1]);
            _this.callBack(result.latlonArr);
        } else if(_this.type == 'rectangle'){
            let result = _this.calculateRectangle(_this.positions[0],_this.positions[_this.positions.length-1]);
            _this.callBack(result.latlonArr);
        } else if(_this.type == 'polygon'){
            let result = _this.transformWGS84([..._this.positions,_this.positions[0]]);
            _this.callBack(result);
        }
    }
}

//世界坐标数组转经纬度坐标
SearchControl.prototype.transformWGS84 = function(positions) {
    let result = [];
    let projCode = this.map.getView().getProjection().getCode(); 
    positions.forEach(p => {
        result.push(ol.proj.transform(p, projCode, 'EPSG:4326'));
    });

    return result;
}

//世界坐标计算矩形(忽略高度)
SearchControl.prototype.calculateRectangle = function(position1, position2) {
    let result = {orignalArr:[],latlonArr:[]};
    let projCode = this.map.getView().getProjection().getCode(); 
    let p1 = position1;
    let p2 = position2;

    result.orignalArr.push([p1[0], p1[1]]);
    result.orignalArr.push([p1[0], p2[1]]);
    result.orignalArr.push([p2[0], p2[1]]);
    result.orignalArr.push([p2[0], p1[1]]);
    result.orignalArr.push([p1[0], p1[1]]);
    
    result.latlonArr.push(ol.proj.transform([p1[0], p1[1]], projCode, 'EPSG:4326'));
    result.latlonArr.push(ol.proj.transform([p1[0], p2[1]], projCode, 'EPSG:4326'));
    result.latlonArr.push(ol.proj.transform([p2[0], p2[1]], projCode, 'EPSG:4326'));
    result.latlonArr.push(ol.proj.transform([p2[0], p1[1]], projCode, 'EPSG:4326'));
    result.latlonArr.push(ol.proj.transform([p1[0], p1[1]], projCode, 'EPSG:4326'));

    return result;
}

//世界坐标计算圆(忽略高度)
SearchControl.prototype.calculateCircle = function(position1, position2) {
    let result = {orignalArr:[],latlonArr:[]};
    let projCode = this.map.getView().getProjection().getCode(); 
    let p1 = ol.proj.transform(position1, projCode, 'EPSG:3857');
    let p2 = ol.proj.transform(position2, projCode, 'EPSG:3857');
    let sizes = 64;
    let radius = Math.sqrt(Math.pow((p1[0]-p2[0]),2) + Math.pow((p1[1]-p2[1]),2));
    for(let i = 0; i < sizes; i++){
        let angle = (i/sizes) * Math.PI * 2.0;
        let dx = Math.cos( angle ) * radius;
        let dy = Math.sin( angle ) * radius;
        let x = p1[0] + dx;
        let y = p1[1] + dy;
        result.orignalArr.push(ol.proj.transform([x, y], 'EPSG:3857', projCode));
        result.latlonArr.push(ol.proj.transform([x, y], 'EPSG:3857', 'EPSG:4326'));
    }
    result.orignalArr.push(result.orignalArr[0]);
    result.latlonArr.push(result.latlonArr[0]);
    return result;
}

//搜索图元
const Ol3SearchPrimitive = (function () {
    function _(map, options) {
        this.map = map;
        this.type = options.type||"rectangle";
        this._position = options.position;
        this._positions = options.positions||[];
        this.text = options.text||'';
        this._show = options.show||true;

        this.fillColor = options.fillColor||'#FFFF00';
        this.textColor = options.textColor||'#FFFF00';
        this.lineColor = options.lineColor||'#000000';
        this.opacity = options.opacity||'1.0';
        this.width = options.width||'1.0';
        this.dash = options.dash;
        this.dashLength = options.dashLength||16.0;
        
        let _this = this;
        this.pointStyle = function(feature) {
            return new ol.style.Style({
                text: new ol.style.Text({
                    text: _this.text,
                    offsetY: -20,
                    font: '14px sans-serif',
                    textBaseline: 'middle',
                    fill:new ol.style.Fill({
                        color: _this.textColor
                    }),
                    // stroke: new ol.style.Stroke({
                    //     color: '#fff',
                    //     width: 2.0
                    // })
                }), 
                image: new ol.style.Circle({
                    radius: 5,
                    fill: new ol.style.Stroke({
                        color: 'rgba(255,0,0,0.5)',
                    }),
                    stroke: new ol.style.Stroke({
                      color: 'red',
                    })
                })
            });
        };

        this.polygonStyle = function(feature) {
            var lineDash;

            if(_this.dash) {
                lineDash = [_this.dashLength, _this.dashLength];
            }

            return new ol.style.Style({
                fill:new ol.style.Fill({
                    color: _this.fillColor
                }),
                stroke: new ol.style.Stroke({
                    color: _this.lineColor,
                    width: _this.width,
                    lineDash: lineDash
                })
            });
        };

        this.point,this.polygon;
        
        this.update();
    }

    Object.defineProperties(_.prototype, {
        show: {
            get: function() {
                return this._show;
            },
            set: function(bool) {
                this._show = bool;
                if(this.layer) {
                    this.layer.setVisible(bool);
                }
            }
        },
        position: {
            get: function() {
                return this._position;
            },
            set: function(position) {
                this._position = position;
                this.update();
            }
        },
        positions: {
            get: function() {
                return this._positions;
            },
            set: function(positions) {
                this._positions = positions;
                this.update();
            }
        },
    });

    _.prototype.update = function () {
        var _this = this;
        if(!_this.layer) {
            _this.layer = new ol.layer.Vector({
                source: new ol.source.Vector(),
                zIndex: 20,
                visible: _this._show
            });
            _this.map.addLayer(_this.layer);
        }

        var source = _this.layer.getSource();
        if(!_this.point) {
            _this.point = new ol.Feature();
            _this.point.setStyle(_this.pointStyle);
            source.addFeature(_this.point);
        }

        if(!_this.polygon) {
            _this.polygon = new ol.Feature();
            _this.polygon.setStyle(_this.polygonStyle);
            source.addFeature(_this.polygon);
        }

        _this.point.setGeometry(new ol.geom.Point(_this._position));
        _this.polygon.setGeometry(new ol.geom.Polygon(_this._positions));
    };

    _.prototype.clear = function () {
        if(this.layer) {
            this.map.removeLayer(this.layer);
            this.layer = undefined;
            this.point = undefined;
            this.polygon = undefined;
        }
    }

    return _;
})();