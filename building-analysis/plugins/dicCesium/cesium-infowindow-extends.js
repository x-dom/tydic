
/**
 * 信息提示框
 * @name TipInfoWinPrimitive
 * @use 
 * new TipInfoWinPrimitive(viewer, {viewPoint, content})
 */
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
                this.options = Object.assign(this.options,options||{});//自定义属性
                this.content = this.options.content;
                this.viewPoint = this.options.viewPoint;//视点
                if(!this.viewPoint) return;
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
                _this.infoWinDom.className = "cesium-tipwin";
                // _this.infoWinDom.style.minWidth = "auto";

                var infoLine,contentDiv;
                infoLine = document.createElement("canvas");
                infoLine.width = _this.lineWidth;
                infoLine.height = _this.lineHeight;
                infoLine.className = "cesium-tipwin-line";
                var context = infoLine.getContext('2d');
                context.moveTo(0.5,_this.lineHeight+0.5);
                context.lineTo(Math.floor(_this.lineWidth/2)+0.5,2+0.5);
                context.lineTo(_this.lineWidth+0.5,2+0.5);
                context.lineWidth = 1;
                context.strokeStyle = "#8f9ff1";
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

/**
 * 基础信息提示框
 * @name BaseInfoWinPrimitive
 * @use 
 * new BaseInfoWinPrimitive(viewer, {viewPoint, title, content})
 */
;(function(undefined) {
    "use strict"
    var _global;

    /**
     * 弹窗对象（基于Cesium）
     */
    var BaseInfoWinPrimitive = function(viewer,options){
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
                this.options = Object.assign(this.options,options||{});//自定义属性
                
                this.title = this.options.title;
                this.content = this.options.content;
                this.onClose = this.options.onClose;
                this.viewPoint = this.options.viewPoint;//视点
                if(!this.viewPoint) return;
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
                    var obj = _this.content;
                    if((typeof HTMLElement === 'object') 
                    ?(obj instanceof HTMLElement)
                    :!!(obj && typeof obj === 'object' && (obj.nodeType === 1 || obj.nodeType === 9) && typeof obj.nodeName === 'string')){
                        body.appendChild( _this.content);
                    }  else {
                        body.innerHTML = _this.content;
                    }
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
        module.exports = BaseInfoWinPrimitive;
    } else if (typeof define === "function" && define.amd) {
        define(function() {return BaseInfoWinPrimitive;});
    } else {
        !('BaseInfoWinPrimitive' in _global) && (_global.BaseInfoWinPrimitive = BaseInfoWinPrimitive);
    }
  }());