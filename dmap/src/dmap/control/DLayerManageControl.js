import DBaseControl from "./DBaseControl";
import {LayerHideSvg, LayerShowSvg}  from  "./DControlSvg";

/**
 * 图层管理控件
 * 
 * 
 */
export default class DLayerManageControl extends DBaseControl{
    constructor(options) {
        let use_options = {
            on2D: true,
            on3D: true,
            isShowControl: false,
            switchShow: true,
            layers: []
        };
        options = options||{};
        $.extend(use_options, options);
        super(use_options);
        use_options = this.options;
        this.target = use_options.target;

        this.create();
    }

    /**
     * 创建
     */
    create(){
        let _this = this;
        this.destroy();
        if(_this.map){
            let root = _this.target;
            let classPosition = " dmap-control-left";
            if(!root){
                classPosition = " dmap-control-absolute"
                root = document.getElementById(_this.map.target);
            }
            _this.element = document.createElement("div");
            _this.element.className = "dmap-control dmap-layer-manage"+classPosition;

            let btnElement = document.createElement("button");
            btnElement.title = "图层控制";
            btnElement.innerHTML = '<svg t="1568623827717" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2315"><path d="M512 603.022L56.889 341.333 512 79.644l455.111 261.69L512 603.021zM170.667 341.333L512 534.756l341.333-193.423L512 147.911 170.667 341.333z"  p-id="2316"></path><path d="M910.222 455.111l-56.889 34.133L512 682.667 113.778 455.11l-56.89 34.133L512 750.934l455.111-261.69z"  p-id="2317"></path><path d="M910.222 614.4l-56.889 34.133L512 841.956v5.688L113.778 620.09l-56.89 28.444L512 910.223l455.111-261.69z"  p-id="2318"></path></svg>';
            _this.element.appendChild(btnElement);
            root.appendChild(_this.element);

            btnElement.onclick = function(){
                _this.isShowControl=!_this.isShowControl;
                _this.create();
            }

            //创建图层面板
            if(_this.isShowControl){
                _this.content = document.createElement("div");
                _this.content.className = "dmap-control dmap-layer-manage-content";
                _this.content.style.display = _this.isShowControl?"block":"none";
                document.getElementById(_this.map.target).appendChild(_this.content);
                
                let titleElement = document.createElement("div");
                titleElement.className = "dmap-layer-manage-title";
                let btnElement1 = document.createElement("button");
                btnElement1.title = getTitleAndText(_this.map).title;
                btnElement1.innerHTML = getTitleAndText(_this.map).text;
                titleElement.appendChild(btnElement1);
                _this.content.appendChild(titleElement);
    
                btnElement1.onclick = function(){
                    _this.switchShow=!_this.switchShow;
                    _this.create();
                }
    
                function getTitleAndText(map){
                    // let title = "图层管理";
                    // let text = '<svg t="1568623827717" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2315"><path d="M512 603.022L56.889 341.333 512 79.644l455.111 261.69L512 603.021zM170.667 341.333L512 534.756l341.333-193.423L512 147.911 170.667 341.333z"  p-id="2316"></path><path d="M910.222 455.111l-56.889 34.133L512 682.667 113.778 455.11l-56.89 34.133L512 750.934l455.111-261.69z"  p-id="2317"></path><path d="M910.222 614.4l-56.889 34.133L512 841.956v5.688L113.778 620.09l-56.89 28.444L512 910.223l455.111-261.69z"  p-id="2318"></path></svg>';
                    let title = "点击显示图层控件面板";
                    let text = '<svg t="1568623827717" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2315"><path d="M512 603.022L56.889 341.333 512 79.644l455.111 261.69L512 603.021zM170.667 341.333L512 534.756l341.333-193.423L512 147.911 170.667 341.333z"  p-id="2316"></path><path d="M910.222 455.111l-56.889 34.133L512 682.667 113.778 455.11l-56.89 34.133L512 750.934l455.111-261.69z"  p-id="2317"></path><path d="M910.222 614.4l-56.889 34.133L512 841.956v5.688L113.778 620.09l-56.89 28.444L512 910.223l455.111-261.69z"  p-id="2318"></path></svg>';
                    if(_this.switchShow){
                        title = "点击隐藏图层控件面板";
                        text = '<svg t="1568623770204" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1624"><path d="M852.6 462.9l12.1 7.6c24.8 15.6 32.3 48.3 16.7 73.2-4.2 6.7-9.9 12.4-16.7 16.7L540.4 764.1c-17.3 10.8-39.2 10.8-56.4 0L159.3 560c-24.8-15.6-32.3-48.3-16.7-73.2 4.2-6.7 9.9-12.4 16.7-16.7l12.1-7.6L483.9 659c17.3 10.8 39.2 10.8 56.4 0l312.2-196 0.1-0.1z m0 156.1l12.1 7.6c24.8 15.6 32.3 48.3 16.7 73.2-4.2 6.7-9.9 12.4-16.7 16.7L540.4 920.2c-17.3 10.8-39.2 10.8-56.4 0L159.3 716.1c-24.8-15.6-32.3-48.3-16.7-73.2 4.2-6.7 9.9-12.4 16.7-16.7l12.1-7.6L483.9 815c17.3 10.8 39.2 10.8 56.4 0l312.2-196h0.1zM540 106.4l324.6 204.1c24.8 15.6 32.3 48.3 16.7 73.2-4.2 6.7-9.9 12.4-16.7 16.7L540.4 604c-17.3 10.8-39.2 10.8-56.4 0L159.3 399.8c-24.8-15.6-32.3-48.3-16.7-73.2 4.2-6.7 9.9-12.4 16.7-16.7l324.4-203.7c17.3-10.8 39.2-10.8 56.4 0l-0.1 0.2z" p-id="1625"></path></svg>';
                    }
                    
                    return {title: title, text: text};
                }
    
                //添加控制面板
                // _this.switchShow = true;
                if(_this.switchShow){
                    _this.layers = [];
                    for (let i = 0; i < _this.map.layers.length; i++) {
                        const element = _this.map.layers[i];
                        let name = element.name;
                        if(!name){
                            name = element.id;
                        }
                        _this.layers.push({
                            name: name,
                            layer: element
                        });
                    }
    
                    //排序(冒泡)
                    for (let i = 0; i < _this.layers.length; i++) {
                        for (var j=0;j<_this.layers.length-1-i;j++) {
                            let isSwitch = false;
                            if(_this.layers[j].layer.index != undefined || _this.layers[j+1].layer.index != undefined){
                                //叠加顺序大的排后面
                                if(_this.layers[j].layer.index != undefined && _this.layers[j+1].layer.index != undefined){
                                    if(_this.layers[j].layer.index < _this.layers[j+1].layer.index){
                                        isSwitch = true;
                                    }
                                } 
                                //叠加顺序未定义的排后面
                                else if(_this.layers[j].layer.index == undefined){
                                    isSwitch = true;
                                }
                            } else if(
                                //叠加顺序未定义则按照加载顺序排列
                                _this.map.layers.indexOf(_this.layers[j].layer) != -1
                                && _this.map.layers.indexOf(_this.layers[j+1].layer) != -1
                                && _this.map.layers.indexOf(_this.layers[j].layer)
                                < _this.map.layers.indexOf(_this.layers[j].layer+1)
                            ){
                                isSwitch = true;
                            }
                            
                            if(isSwitch){
                                var temp = _this.layers[j];
                                _this.layers[j] = _this.layers[j+1];
                                _this.layers[j+1] = temp;
                            }
                        }
                    }
    
                    //容器
                    let containerElement = document.createElement("div");
                    containerElement.className =  "dmap-layer-manage-container";
                    for (let i = 0; i < _this.layers.length; i++) {
                        const layer = _this.layers[i];
                        let valid = false;
                        for (let j = 0; j < _this.map.layers.length; j++) {
                            const mapLayer = _this.map.layers[j];
                            if(layer.layer === mapLayer){
                                valid = true;
                                break;
                            }
                        }
    
                        if(valid){
                            let rowElement = document.createElement("div");
                            rowElement.className = "dmap-layer-manage-row";
                            rowElement.draggable = true;
                            rowElement.index = i;
                            containerElement.appendChild(rowElement);
    
                            let checkElement = document.createElement("input");
                            checkElement.type = "checkbox";
                            checkElement.id = "dmap-layer-manage-row-"+i;
                            if(layer.layer.visible){
                          
                                checkElement.setAttribute("checked", "checked");
                            }
                            rowElement.appendChild(checkElement);
    
                            let labelElement = document.createElement("label");
                            labelElement.innerText = layer.name;
                            labelElement.setAttribute("for", checkElement.id);
                            rowElement.appendChild(labelElement);
                            checkElement.onclick = function(e){
                                layer.layer.setVisible(this.checked);
                            }
                        } else {
                            console.warn("Name 为"+layer.name+"的图层，在地图中未定义.");
                        }
                    }
                    _this.content.appendChild(containerElement);
    
                    //拖动事件
                    var draging = null;
                    containerElement.ondragstart = function(event) {
                        //firefox设置了setData后元素才能拖动！！！！
                        event.dataTransfer.setData("te", event.target.innerText); //不能使用text，firefox会打开新tab
                        //event.dataTransfer.setData("self", event.target);
                        draging = event.target;
                    }
                    containerElement.ondragover = function(event) {
                        event.preventDefault();
                        var target = event.target;
                        if(target.nodeName === "LABEL" || target.nodeName === "INPUT"){
                            target = target.parentNode;
                        }
                        //以要判断是不是行元素
                        if (target.className.indexOf("dmap-layer-manage-row") > -1) {
                            if (target !== draging) {
                                var targetRect = target.getBoundingClientRect();
                                var dragingRect = draging.getBoundingClientRect();
                                if (target) {
                                    if (target.animated) {
                                        return;
                                    }
                                }
                                if (_index(draging) < _index(target)) {
                                    target.parentNode.insertBefore(draging, target.nextSibling);
                                } else {
                                    target.parentNode.insertBefore(draging, target);
                                }
                                _animate(dragingRect, draging);
                                _animate(targetRect, target);
    
    
                                let targetLayer = _this.layers[target.index].layer;
                                let dragingLayer = _this.layers[draging.index].layer;
                                let targetLayerIndex = _this.map.layers.indexOf(targetLayer);
                                let dragingLayerIndex = _this.map.layers.indexOf(dragingLayer);
                               
                                //交换叠加顺序
                                var tempIndex = _this.layers[target.index].layer.index;
                                _this.layers[target.index].layer.index = _this.layers[draging.index].layer.index;
                                _this.layers[draging.index].layer.index = tempIndex;
                                
                                //交换加载顺序
                                _this.map.layers[dragingLayerIndex] = _this.map.layers.splice(targetLayerIndex, 1, _this.map.layers[dragingLayerIndex])[0];
                                
                                //刷新图层
                                for (let i = 0; i < _this.map.layers.length; i++) {
                                    if(_this.map.layers[i] &&  _this.map.layers[i].render){
                                        _this.map.layers[i].setMap(_this.map);      
                                    }  
                                }
    
                                //交换控件标识下标
                                var temp = draging.index;
                                draging.index = target.index;
                                target.index = temp;
                                
                                //交换控件图层下标
                                _this.layers[draging.index] = _this.layers.splice(target.index, 1, _this.layers[draging.index])[0];
                            }
                        }
    
    
                        //获取元素在父元素中的index
                        function _index(el) {
                            var index = 0;
    
                            if (!el || !el.parentNode) {
                                return -1;
                            }
    
                            while (el && (el = el.previousElementSibling)) {
                                //console.log(el);
                                index++;
                            }
    
                            return index;
                        }
    
    
                        function _animate(prevRect, target) {
                            var ms = 300;
                    
                            if (ms) {
                                var currentRect = target.getBoundingClientRect();
                    
                                if (prevRect.nodeType === 1) {
                                    prevRect = prevRect.getBoundingClientRect();
                                }
                    
                                _css(target, 'transition', 'none');
                                _css(target, 'transform', 'translate3d(' +
                                    (prevRect.left - currentRect.left) + 'px,' +
                                    (prevRect.top - currentRect.top) + 'px,0)'
                                );
                    
                                target.offsetWidth; // 触发重绘
                                //放在timeout里面也可以
                                // setTimeout(function() {
                                //     _css(target, 'transition', 'all ' + ms + 'ms');
                                //     _css(target, 'transform', 'translate3d(0,0,0)');
                                // }, 0);
                                _css(target, 'transition', 'all ' + ms + 'ms');
                                _css(target, 'transform', 'translate3d(0,0,0)');
                    
                                clearTimeout(target.animated);
                                target.animated = setTimeout(function() {
                                    _css(target, 'transition', '');
                                    _css(target, 'transform', '');
                                    target.animated = false;
                                }, ms);
                            }
                        }
    
                        //给元素添加style
                        function _css(el, prop, val) {
                            var style = el && el.style;
    
                            if (style) {
                                if (val === void 0) {
                                    if (document.defaultView && document.defaultView.getComputedStyle) {
                                        val = document.defaultView.getComputedStyle(el, '');
                                    } else if (el.currentStyle) {
                                        val = el.currentStyle;
                                    }
    
                                    return prop === void 0 ? val : val[prop];
                                } else {
                                    if (!(prop in style)) {
                                        prop = '-webkit-' + prop;
                                    }
    
                                    style[prop] = val + (typeof val === 'string' ? '' : 'px');
                                }
                            }
                        }
                    };
                }
            }

            _this.show(_this.on2D, _this.on3D);
            _this.modeChangeCode = _this.map.on("change:mode",function(evt){
                // _this.show(_this.on2D, _this.on3D);
                _this.create();
            });
            _this.layerChangeCode = _this.map.on("change:layer",function(evt){
                _this.create();
            });
            //清除事件
            _this.clearEnvent = function (){
                if(_this.map){
                    _this.map.eventObj.unByCode(_this.modeChangeCode);
                }
                if(_this.map){
                    _this.map.eventObj.unByCode(_this.layerChangeCode);
                }
            }
        }
    }

    /**
     * 销毁
     */
    destroy(){
        if(this.element){
            this.element.parentElement.removeChild(this.element);
            this.element = undefined;
        }

        if(this.content){
            this.content.parentElement.removeChild(this.content);
            this.content = undefined;
        }

        if(this.clearEnvent){
            this.clearEnvent();
        }
    }

    // /**
    //  * 添加图层
    //  * @param {*} layer 
    //  */    
    // addLayer(layer){
    //     let valid = true;
    //     for (let i = 0; i < this.layers.length; i++) {
    //         const element = this.layers[i];
    //         if(element.layer === layer.layer){
    //             valid = false;
    //             console.warn("图层已存在，名称为: "+ element.name);
    //             break;
    //         }
    //     }
    //     if(valid){
    //         this.layers.push(layer);
    //     }

    //     this.create();
    // }

    // /**
    //  * 删除图层
    //  */
    // removeLayer(layer){
    //     let newArr = [];
    //     for (let i = 0; i < this.layers.length; i++) {
    //         const element = this.layers[i];
    //         if(element.layer != layer.layer){
    //             newArr.push(element);
    //         }
    //     }
    //     this.layers = newArr;
    //     this.create();
    // }
}