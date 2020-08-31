
/**
 * 信息提示框
 * @name TipInfoWinPrimitive
 * @use 
 * new TipInfoWinPrimitive(map, {viewPoint, content})
 */
;(function(undefined) {
    "use strict"
    var _global;

    /**
     * 弹窗对象（基于ol3）
     */
    var TipInfoWinPrimitive = function(map,options){
        var result = {
            /**
             * 初始化
             * @param {*} map 
             * @param {*} options 
             */
            _init: function(map,options){
                this.map = map;//视图
                this.options = options||{};//自定义属性
                this.setOptions();
            },

            /**
             * 设置属性
             */
            setOptions: function(options){
                this.options = Object.assign(this.options,options||{});//自定义属性
                this.content = this.options.content;
                this.viewPoint = this.options.viewPoint;//视点
                if(!this.viewPoint) return;
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
                _this.infoWinDom.className = "ol3-tipwin";
                // _this.infoWinDom.style.minWidth = "auto";

                var infoLine,contentDiv;
                infoLine = document.createElement("canvas");
                infoLine.width = _this.lineWidth;
                infoLine.height = _this.lineHeight;
                infoLine.className = "ol3-tipwin-line";
                var context = infoLine.getContext('2d');
                context.moveTo(0.5,_this.lineHeight+0.5);
                context.lineTo(Math.floor(_this.lineWidth/2)+0.5,2+0.5);
                context.lineTo(_this.lineWidth+0.5,2+0.5);
                context.lineWidth = 1;
                context.strokeStyle = "#8f9ff1";
                context.stroke();
                _this.infoWinDom.appendChild(infoLine);
                
                contentDiv = document.createElement("div");
                contentDiv.className = "ol3-tipwin-content";
                _this.infoWinDom.appendChild(contentDiv);
                contentDiv.innerText = _this.content||"";
                
                _this.overlay = new ol.Overlay(({
                    element: _this.infoWinDom,
                    autoPan: true,
                    position: _this.viewPoint,
                    // positioning: 'top-left',
                    // offset: [-17, -10],//偏移量设置
                }));
                _this.map.addOverlay(_this.overlay);
            },

            /**
             * 销毁
             */
            destory: function(){
                if(this.overlay) {
                    this.map.removeOverlay(this.overlay);
                }
            },
        };

        result._init(map,options);

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

/**
 * 基础信息提示框
 * @name BaseInfoWinPrimitive
 * @use 
 * new BaseInfoWinPrimitive(map, {viewPoint, title, content})
 */
;(function(undefined) {
    "use strict"
    var _global;

    /**
     * 弹窗对象（基于ol3）
     */
    var BaseInfoWinPrimitive = function(map,options){
        var result = {
            /**
             * 初始化
             * @param {*} map 
             * @param {*} options 
             */
            _init: function(map,options){
                this.map = map;//视图
                this.options = options||{};//自定义属性
                this.setOptions();
            },

            /**
             * 设置属性
             */
            setOptions: function(options){
                this.options = Object.assign(this.options,options||{});//自定义属性
                
                this.title = this.options.title;
                this.content = this.options.content;
                this.onClose = this.options.onClose;
                this.viewPoint = this.options.viewPoint;//视点
                if(!this.viewPoint) return;
                this.lineWidth = 100;
                this.lineHeight = 50;
                this.overlay;
                this.render();
            },

            /**
             * 渲染
             */
            render: function(){
                var _this = this;

                _this.destory();

                _this.infoWinDom = document.createElement("div");
                _this.infoWinDom.className = "ol3-infowin";

                var infoLine,contentDiv,header,headerTitle,headerBtn,body;
                infoLine = document.createElement("canvas");
                infoLine.width = _this.lineWidth;
                infoLine.height  = _this.lineHeight;
                infoLine.className = "ol3-infowin-line";
                var context = infoLine.getContext('2d');
                context.moveTo(0,_this.lineHeight);
                context.lineTo(_this.lineWidth/2,2);
                context.lineTo(_this.lineWidth,2);
                context.lineWidth = 1;
                context.strokeStyle = "#5c6fd7";
                context.stroke();
                _this.infoWinDom.appendChild(infoLine);

                contentDiv = document.createElement("div");
                contentDiv.className = "ol3-infowin-content";
                _this.infoWinDom.appendChild(contentDiv);

                header = document.createElement("div");
                header.className = "ol3-infowin-header";
                contentDiv.appendChild(header);

                headerTitle = document.createElement("span");
                headerTitle.className = "ol3-infowin-header-title";
                headerTitle.innerText = _this.title||"";
                header.appendChild(headerTitle);

                headerBtn = document.createElement("button");
                headerBtn.className = "ol3-infowin-header-btn";
                header.appendChild(headerBtn);
                headerBtn.onclick = function(){
                    _this.destory();
                    
                    if(_this.onClose){
                        _this.onClose();
                    }
                };

                body = document.createElement("div");
                body.className = "ol3-infowin-body";
                // body.innerHTML = _this.content||"";
                contentDiv.appendChild(body);
                
                if(_this.content){
                    var obj = _this.content;
                    if((typeof HTMLElement === 'object') 
                    ?(obj instanceof HTMLElement)
                    :!!(obj && typeof obj === 'object' && (obj.nodeType === 1 || obj.nodeType === 9) && typeof obj.nodeName === 'string')){
                        body.appendChild( _this.content);
                    }  else {
                        body.innerHTML = _this.content;
                    }
                }

                _this.overlay = new ol.Overlay(({
                    element: _this.infoWinDom,
                    autoPan: true,
                    position: _this.viewPoint,
                    positioning: 'bottom-left',
                    offset: [100, 0],//偏移量设置
                }));
                _this.overlay.getElement().parentElement.style.zIndex = 10
                _this.map.addOverlay(_this.overlay);
            },

            /**
             * 销毁
             */
            destory: function(){
                if(this.overlay) {
                    this.map.removeOverlay(this.overlay);
                }
            },
        };

        result._init(map,options);

        return result;
    };

    // 将插件对象暴露给全局对象
    _global = (function(){ return this || (0, eval)('this'); }());
    if(typeof module !=="undefined" && module.exports) {
        module.exports = BaseInfoWinPrimitive;
    } else if (typeof define === "function" && define.amd) {
        define(function() {return BaseInfoWinPrimitive;});
    } else {
        !('BaseInfoWinPrimitive' in _global) && (_global.BaseInfoWinPrimitive = BaseInfoWinPrimitive);
    }
  }());