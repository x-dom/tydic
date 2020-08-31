/**
 * 室内建筑对象
 * @param {*} viewer 
 * @param {*} options 
 */
const IndoorBuilding = function (viewer, options) {
    let defaultOptions = {
        show: true,
        height: 0,
        extrudedHeight: 30,
        selectHeight: 400,
    };
    this.viewer = viewer;
    Object.assign(defaultOptions, options);
    this._show = defaultOptions.show;
    this.height = defaultOptions.height;
    this.extrudedHeight = defaultOptions.extrudedHeight;
    this.selectHeight = defaultOptions.selectHeight;
    this.floors = [];
    this.legend;
};

//绑定属性事件
Object.defineProperties(IndoorBuilding.prototype, {
    show: {
        get: function () {
            return this._show;
        },
        set: function(bool) {
            let _this = this;
            _this._show = bool;
            _this.floors.forEach((el,index) => {
                if(_this._show && el.floor.select){
                    el.floor.show = true;
                } else {
                    el.floor.show = false;
                }
            });
            
            if(_this.legend) {
                if(_this._show) {
                    _this.legend.style.display = 'block';
                } else {
                    _this.legend.style.display = 'none';
                }
            }
        }
    },
});


//销毁
IndoorBuilding.prototype.destroy = function() {
    let _this = this;
    if(_this.floors) {
        _this.floors.forEach(el => {
            el.floor.destroy();
        });
        _this.floors = [];
    }

    if(_this.legend) {
        _this.legend.remove();
        _this.legend = undefined;
    }
};


//添加楼层
IndoorBuilding.prototype.addFloor = function(floorId, sortNum, floor, rooms) {
    let _this = this;
    let tempArr = _this.floors.filter(el => {return el.floorId == floorId;});
    if(tempArr.length > 0) {
        console.error("Floor is already build.");
        return;
    } 
    let indoorFloor = new IndoorFloor(_this.viewer, {
        show: _this._show,
        select: false
    });
    indoorFloor.loadFloorByEntity(floor);
    indoorFloor.loadRoomByDataSource(rooms);
    sortNum = sortNum==undefined?(_this.floors.length-1):sortNum;
    _this.floors.push({floorId: floorId, sortNum: sortNum, floor: indoorFloor});
    _this._updatePosition();
}

//根据楼层ID获取楼层对象
IndoorBuilding.prototype.getFloorByFloorId = function(floorId) {
    let _this = this;
    let result;
    _this.floors.forEach(el => {
        if(el.floorId == floorId){
            result = el;
            return;
        }
    });
    return result;
};

//添加房间数据
IndoorBuilding.prototype.addFloorRoomsOfDataSourceByFloorId = function (floorId, dataSource){
    let _this = this;
    _this.floors.forEach(el => {
        if(el.floorId == floorId){
            el.floor.loadRoomByDataSource(dataSource);
            return;
        }
    });
};

//添加房间数据
IndoorBuilding.prototype.addFloorRoomOfEntityByFloorId = function (floorId, entity){
    let _this = this;
    let floor = _this.getFloorByFloorId(floorId);
    if(floor){
        floor.floor.addRoomByEntity(entity);
    }
};


//选中楼层
IndoorBuilding.prototype.selectFloorById = function(floorId){
    let _this = this;
    let valid = true;
    _this.floors.forEach(el => {
        if(el.floorId == floorId){
            if( el.floor.select) {
                valid = false;
                return;
            }
            
            el.floor.select = true;
        } else {
            el.floor.select = false;
        }
    });

    if(valid){
        _this._updatePosition();
    }
};

//更新楼层位置
IndoorBuilding.prototype._updatePosition = function(){
    let _this = this;
    _this.loadLegend();
    _this.floors.sort(function(a, b){
        return a.sortNum - b.sortNum;
    });

    let selectHeight = 0;
    _this.floors.forEach((el, index) => {
        // el.floor.height = _this.height + index*_this.extrudedHeight + selectHeight;
        // el.floor.update();
        // if(el.floor.select){
        //     selectHeight = _this.selectHeight;
        // }

        el.floor.height = 0;
        el.floor.update();
        if(el.floor.select){
            el.floor.show = true;
        } else {
            el.floor.show = false;
        }
    });
};

//加载图例
IndoorBuilding.prototype.loadLegend = function() {
    let _this = this;

    if(_this.legend){
        _this.legend.remove();
        _this.legend = undefined;
    }

    if(_this.floors && _this.floors.length > 0) {
        let container = _this.viewer.container;
        _this.legend = document.createElement("div");
        _this.legend.className = "cesium-indoormap-legend";
        container.appendChild(_this.legend);

        if(_this._show) {
            _this.legend.style.display = 'block';
        } else {
            _this.legend.style.display = 'none';
        }

        let floorPlus = document.createElement("div");
        floorPlus.className = "floor-plus";
        _this.legend.appendChild(floorPlus);
        
        let floorListBox = document.createElement("div");
        floorListBox .className = "floor-list-box";
        _this.legend.appendChild(floorListBox);

        let ul = document.createElement("ul");
        ul.className = "floor-list";
        floorListBox.appendChild(ul);

        _this.floors.sort(function(a, b){
            return b.sortNum - a.sortNum;
        });
        let selectIndex;
        _this.floors.forEach((val, index) => {
            let select = val.floor.select;
            let floorId = val.floorId;
            let li = document.createElement("li");
            li.className = "floor-list-item";
            ul.appendChild(li);
            let div = document.createElement("div");
            div.innerText = floorId;
            li.appendChild(div);
            div.onclick = function() {
                _this.selectFloorById(floorId);
            };
            if(select){
                selectIndex = index;
                li.className = "floor-list-item selected";
            }
        });
       
        let floorMinus = document.createElement("div");
        floorMinus.className = "floor-minus";
        _this.legend.appendChild(floorMinus);

        if( _this.floors.length < 4) {
            floorPlus.className = "floor-plus disabled";
            floorMinus.className = "floor-minus disabled";
            floorPlus.style.display = "none";
            floorMinus.style.display = "none";
        }

        if(selectIndex != undefined){
            floorListBox.scrollTop = (floorListBox.scrollHeight - floorListBox.offsetHeight)*selectIndex/_this.floors.length; 
            if(selectIndex == _this.floors.length-1) {
                floorListBox.scrollTop = (floorListBox.scrollHeight - floorListBox.offsetHeight); 
            }
        } else {
            floorListBox.scrollTop = (floorListBox.scrollHeight - floorListBox.offsetHeight)*0.5; 
        }

        if(selectIndex != undefined){
            let preIndex = selectIndex - 1;
            let nexIndex = selectIndex + 1;
            if(preIndex > -1) {
                let floorId = _this.floors[preIndex].floorId;
                floorPlus.onclick = function () {
                    _this.selectFloorById(floorId);
                }
            } else {
                floorPlus.className = "floor-plus disabled";
            }
            
            if(nexIndex < _this.floors.length) {
                let floorId = _this.floors[nexIndex].floorId;
                floorMinus.onclick = function () {
                    _this.selectFloorById(floorId);
                }
            } else {
                floorMinus.className = "floor-minus disabled";
            }
        } else {
            floorPlus.className = "floor-plus disabled";
            floorMinus.className = "floor-minus disabled";
        }
    }
}


/**
 * 室内楼层
 * @param {*} viewer 
 * @param {*} options 
 */
const IndoorFloor = function (viewer, options) {
    let defaultOptions = {
        show: true,
        height: 0,//楼高
        thickness: 0.5, //厚度
        select: false,
        color: "#3993bb",
        selectColor: "#9e9e9e",
        roomColor: "#0080ff",
        fill_color_express: function() {
            if(this.select){
                return Cesium.Color.fromCssColorString(this.selectColor).withAlpha(0.8);
            } else {
                return Cesium.Color.fromCssColorString(this.color).withAlpha(0.5);
            }
        },
        outline_color_express: function() {
            if(this.select){
                return Cesium.Color.fromCssColorString(this.selectColor).withAlpha(1.0);
            } else {
                return Cesium.Color.fromCssColorString(this.color).withAlpha(1.0);
            }
        },
        roomHeight_express: function() {
            return 2;
        },
        roomColor_express: function() {
            return Cesium.Color.fromCssColorString(this.color);
            // if(this.select){
            //     return Cesium.Color.fromCssColorString(this.selectColor).withAlpha(1.0);
            // } else {
            //     return Cesium.Color.fromCssColorString(this.selectColor).withAlpha(0.5);
            // }
        }
    };
    this.viewer = viewer;
    Object.assign(defaultOptions, options);
    this._show = !!defaultOptions.show;
    this.select = !!defaultOptions.select;
    this.height = defaultOptions.height;
    this.color = defaultOptions.color;
    this.selectColor = defaultOptions.selectColor;
    this.fill_color_express = defaultOptions.fill_color_express;
    this.outline_color_express = defaultOptions.outline_color_express;
    this.roomHeight_express = defaultOptions.roomHeight_express;
    this.roomColor_express = defaultOptions.roomColor_express;
    this.thickness = defaultOptions.thickness;
    this.dataSource = new Cesium.CustomDataSource();//布局(室内建筑数据)
    if(this.select){
        this.viewer.dataSources.add(this.dataSource);
    }
    this.floor;
};

//绑定属性事件
Object.defineProperties(IndoorFloor.prototype, {
    show: {
        get: function () {
            return this._show;
        },
        set: function(bool) {
            this._show = bool;
            if(Cesium.defined(this.floor)){
                this.floor.show = bool;
            }
            if(Cesium.defined(this.dataSource)){
                this.dataSource.show = bool;
            }
        }
    },
});

//销毁
IndoorFloor.prototype.destroy = function() {
    let _this = this;
    if(Cesium.defined(_this.floor)){
        _this.viewer.entities.remove(_this.floor);
        _this.floor = undefined;
    };

    if(Cesium.defined(_this.dataSource)){
        _this.viewer.dataSources.remove(_this.dataSource);
        _this.dataSource = undefined;
    };
};

//加载楼层对象
IndoorFloor.prototype.loadFloorByEntity = function(entity) {
    let _this = this;
    if(Cesium.defined(_this.floor)){
        _this.viewer.entities.remove(_this.floor);
        _this.floor = undefined;
    };

    if(Cesium.defined(entity)){
        entity.show = _this._show;
        entity.name = "indoor-floor";
        entity.polygon.height = _this.height;
        entity.polygon.extrudedHeight = _this.height + _this.thickness;
        entity.polygon.material = _this.fill_color_express();
        entity.polygon.outlineColor = _this.outline_color_express();
        entity.polygon.closeBottom = false;
        // entity.polygon.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
        _this.floor = this.viewer.entities.add(entity);
    }

};

//加载数据
IndoorFloor.prototype.loadRoomByDataSource = function(dataSource) {
    let _this = this;
    if(Cesium.defined(dataSource)){
        dataSource.entities.values.forEach(entity => {
            _this.addRoomByEntity(entity);
        });
    }

};

//加载单个数据
IndoorFloor.prototype.addRoomByEntity = function(entity) {
    let _this = this;
    if(Cesium.defined(_this.dataSource) && !_this.dataSource.entities.contains(entity)){
        entity.polygon.height = _this.height + _this.thickness;
        entity.polygon.extrudedHeight = _this.height + _this.thickness + _this.roomHeight_express();
        entity.polygon.material = _this.roomColor_express();
        entity.polygon.outline = false;
        _this.dataSource.entities.add(entity);
    }
};

//删除单个数据
IndoorFloor.prototype.removeRoomByEntity = function(entity) {
    if(Cesium.defined(this.dataSource) && this.dataSource.entities.contains(entity)){
        this.dataSource.entities.remove(entity);
    }
};

//更新房间
IndoorFloor.prototype.update = function() {
    let _this = this;
    if(Cesium.defined(_this.floor)){
        _this.floor.polygon.height = _this.height;
        _this.floor.polygon.extrudedHeight = _this.height + _this.thickness;
        _this.floor.polygon.material =  _this.fill_color_express();
        _this.floor.polygon.outlineColor = _this.outline_color_express();
    }
    if(Cesium.defined(_this.dataSource)){
        _this.dataSource.entities.values.forEach(entity => {
            entity.polygon.height = _this.height + _this.thickness;
            entity.polygon.extrudedHeight = _this.height + _this.thickness + _this.roomHeight_express();
            entity.polygon.material = _this.roomColor_express();
        });

        if(_this.viewer.dataSources.contains(_this.dataSource)){
            if(!_this.select){
                _this.viewer.dataSources.remove(_this.dataSource);
            }
        } else {
            if(_this.select){
                _this.viewer.dataSources.add(_this.dataSource);
            }
        }
    }
}