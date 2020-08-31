import "./css/DLayerInfoControl.css";
import {DOverLay} from "./../feature/feature";

/**
 * 图层信息控件
 */
export default class DLayerInfoControl{
    constructor(options) {

        let use_options = {
            on2D: true,
            on3D: true
        };
        options = options||{};
        $.extend(use_options, options);
        this.options = use_options;
        this.id = use_options.id|| ((new Date()).getTime() + "");
        this.on2D = use_options.on2D==undefined?false:use_options.on2D;//在2D中展示
        this.on3D = use_options.on3D==undefined?false:use_options.on3D;//在3D中展示

        this.layer = use_options.layer;
        this.touchType = use_options.touchType||"click";//触发类型
        this.styleType = use_options.styleType||"blue";//样式类型
        this.title = use_options.title||"";//标题
        this.params = use_options.params||undefined;//展示属性名
        this.offsetX = use_options.offsetX || 0;
        this.offsetY = use_options.offsetY || 0;
        this.width =  use_options.width || 200;
        this.height = this.width *2/3;
        
        this.create();
    }

    /**
     * 创建
     */
    create(){
        let _this = this;
        this.destroy();

        if(_this.layer && _this.layer.map){
            _this.evevtCode = _this.layer.on(_this.touchType, createOverlay);

            /**
             * 创建弹窗
             * @param {*} evt 
             */
            function createOverlay(evt, num){
                num = num||0;
                _this.evt = evt;
                _this.evt.num = num;
                _this.close();
                console.log(evt);
                if(evt.features.length == 0 && evt.pickedFeature instanceof Cesium.Cesium3DTileFeature){
                    let obj = {properties:{}};
                    evt.pickedFeature.getPropertyNames().forEach(name => {
                        obj.properties[name] = evt.pickedFeature.getProperty(name);
                    });
                    evt.features.push(obj);
                }
                if(_this.layer.visibility && evt.features.length > 0){
                    let position = evt.coordinate;
                    let features = evt.features;
                    let feature = features[num];
                    let properties = feature.properties;

                    let styleType = _this.styleType;
                    let styleClassName = "";
                    if(styleType == "blue"){
                        styleClassName = "dmap-layerinfo-"+ styleType;
                    } else if(styleType == "light"){
                        styleClassName = "dmap-layerinfo-"+ styleType;
                    }
    
                    let element = document.createElement("div");
                    element.className = "dmap-layerinfo "+ styleClassName;
    
                    let containerElement = document.createElement("div");
                    containerElement.className = "dmap-layerinfo-container";
                    containerElement.style.width = _this.width+'px';
                    containerElement.style.maxHeight = _this.height+'px';
                    element.appendChild(containerElement);
    
                    let titleElement = document.createElement("div");
                    titleElement.className = "dmap-layerinfo-title";
                    containerElement.appendChild(titleElement);
                    
                    let titleTextElement = document.createElement("div");
                    titleTextElement.className = "dmap-layerinfo-title-text";
                    titleTextElement.innerText = _this.title;
                    titleTextElement.title = _this.title;
                    titleElement.appendChild(titleTextElement);
                    
                    let closerElement = document.createElement("span");
                    closerElement.className = "dmap-layerinfo-closer";
                    closerElement.innerHTML = "✘";
                    titleElement.appendChild(closerElement);
    
                    let contentElement = document.createElement("div");
                    contentElement.className = "dmap-layerinfo-content";
                    contentElement.style.maxHeight = _this.height - 50 + "px";
                    if(features.length > 1){
                        let groupElement = document.createElement("div");
                        groupElement.className = "dmap-layerinfo-group";
                        containerElement.appendChild(groupElement);
                        
                        let selectElement = document.createElement("select");
                        selectElement.value = num;
                        groupElement.appendChild(selectElement);
    
                        for (let i = 0; i < features.length; i++) {
                            let optionElement = document.createElement("option");
                            optionElement.value = i;
                            optionElement.innerText = i+1;
                            if(i == num){
                                optionElement.selected = true;
                            }
                            selectElement.appendChild(optionElement);
                        }
    
                        selectElement.onchange = function(){
                            createOverlay(_this.evt, this.value);
                        }
                        // contentElement.style.maxHeight = "calc(100% - 50px)";
                        contentElement.style.maxHeight = _this.height - 70 + "px";
                    }
                    containerElement.appendChild(contentElement);
    
                    let listElement = document.createElement("div");
                    listElement.className = "dmap-layerinfo-list";
                    contentElement.appendChild(listElement);
    
                    let maxLen = 300;
                    if(_this.params){
                        for (let i = 0; i < _this.params.length; i++) {
                            const param = _this.params[i];
                            let text = properties[param];
                            let keyElement = document.createElement("div");
                            keyElement.className = "dmap-layerinfo-list-attr";
                            keyElement.innerText = param;
                            keyElement.title = param;
                            listElement.appendChild(keyElement);
    
                            
                            let valueElement = document.createElement("div");
                            valueElement.className = "dmap-layerinfo-list-value";
                            valueElement.title = text;
                            if(text===text+'' && text.length >= maxLen){
                                valueElement.innerText = text.substring(0, maxLen-1) + "...";
                            } else {
                                valueElement.innerText = text;
                            }
                            listElement.appendChild(valueElement);
                        }
                    } else {
                        for (const key in properties) {
                            let text = properties[key];
                            let keyElement = document.createElement("div");
                            keyElement.className = "dmap-layerinfo-list-attr";
                            keyElement.innerText = key;
                            keyElement.title = key;
                            listElement.appendChild(keyElement);
    
                            let valueElement = document.createElement("div");
                            valueElement.className = "dmap-layerinfo-list-value";
                            valueElement.title = text;
                            if(text===text+'' && text.length >= maxLen){
                                valueElement.innerText = text.substring(0, maxLen-1) + "...";
                            } else {
                                valueElement.innerText = text;
                            }
                            listElement.appendChild(valueElement);
                        }
                    }
    
                    let arrowElement = document.createElement("div");
                    arrowElement.className = "dmap-layerinfo-arrow";
                    element.appendChild(arrowElement);
                    
                    _this.overlay = new DOverLay({
                        content: element,
                        position: position,
                        on2D: _this.on2D,
                        on3D: _this.on3D,
                    });
                    _this.layer.map.addOverlay(_this.overlay);
                    _this.overlay.setOffset(-$(_this.overlay.content).width()/2 + _this.offsetX - 5, -$(_this.overlay.content).height()+10 + _this.offsetY - 10);
                    closerElement.onclick = function(){
                        _this.layer.map.removeOverlay(_this.overlay, _this.evt.num);
                        _this.overlay = undefined;
                    }
                }
            }

            /**
             * 刷新弹窗内容
             */
            _this.refreshOverlay = function(options){
                options = options||{};
                $.extend(_this.options, options);
                _this.on2D = _this.options.on2D==undefined?false:_this.options.on2D;//在2D中展示
                _this.on3D = _this.options.on3D==undefined?false:_this.options.on3D;//在3D中展示

                _this.layer = _this.options.layer;
                _this.touchType = _this.options.touchType||"click";//触发类型
                _this.styleType = _this.options.styleType||"blue";//样式类型
                _this.title = _this.options.title||"";//标题
                _this.params = _this.options.params||undefined;//展示属性名
                _this.offsetX = _this.options.offsetX || 0;//沿X轴偏移量
                _this.offsetY = _this.options.offsetY || 0;//沿Y轴偏移量
                _this.width = _this.options.width || 400;//宽度
                _this.height = _this.width*2/3;//高度

                if(_this.evevtCode){
                    _this.layer.unByCode(this.evevtCode);
                }
                _this.evevtCode = _this.layer.on(_this.touchType, createOverlay);

                if(_this.overlay){
                    createOverlay(_this.evt);
                }
            }
        }
    }

    close(){
        if(this.overlay && this.layer.map){
            this.layer.map.removeOverlay(this.overlay);
        }
    }

    destroy(){
        if(this.layer){
            if(this.overlay && this.layer.map){
                this.layer.map.removeOverlay(this.overlay);
            }

            if(this.evevtCode){
                this.layer.unByCode(this.evevtCode);
            }
        }
    }

    /**
     * 2D中显示
     */
    showOn2D(bool){
        this.on2D = bool;
        this.create();
    }
    
    /**
     * 3D中显示
     */
    showOn3D(bool){
        this.on3D = bool;
        this.create();
    }

    /**
     * 设置图层
     */
    setLayer(layer){
        this.create();
        this.layer = layer;
    }
}