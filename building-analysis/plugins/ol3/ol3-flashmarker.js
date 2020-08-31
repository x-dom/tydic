(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.FlashMarker = factory());
}(this, (function () { 'use strict';
    function CanvasLayer(options) {
        this.options = options || {};
        this.minZoom = options.minZoom;
        this.maxZoom = options.maxZoom;
        this._show = options.show;
        this._map = options.map;
        this.initialize();
    }

    CanvasLayer.prototype.initialize = function () {
        var map = this._map;
        var canvas = this.canvas = document.createElement('canvas');
        canvas.className = 'ol3-flashmaker-canvas';
        var ctx = this.ctx = this.canvas.getContext('2d');
        canvas.style.cssText = 'position:absolute;' + 'left:0;' + 'top:0;';
        this.adjustSize();
        this.adjustRatio(ctx);
        this.draw();
        map.getViewport().appendChild(canvas);
        var that = this;
        // map.getView().on('change:rotation',function(){
        //     that.show = that._show;
        //     that.adjustSize();
        //     that._draw();
        // });
        // map.on("moveend",function(){
        //     that.show = that._show;
        //     that.adjustSize();
        //     that._draw();
        // });
        map.on("postcompose",function(){
            that.show = that._show;
            that.adjustSize();
            that._draw();
        });
        return this.canvas;
    };

    CanvasLayer.prototype.adjustSize = function () {
        var size = this._map.getSize();
        var canvas = this.canvas;
        canvas.width = size[0];
        canvas.height = size[1];
        canvas.style.width = canvas.width + 'px';
        canvas.style.height = canvas.height + 'px';
    };

    CanvasLayer.prototype.adjustRatio = function (ctx) {
        var backingStore = ctx.backingStorePixelRatio || ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
        var pixelRatio = (window.devicePixelRatio || 1) / backingStore;
        var canvasWidth = ctx.canvas.width;
        var canvasHeight = ctx.canvas.height;
        ctx.canvas.width = canvasWidth * pixelRatio;
        ctx.canvas.height = canvasHeight * pixelRatio;
        ctx.canvas.style.width = canvasWidth + 'px';
        ctx.canvas.style.height = canvasHeight + 'px';
        ctx.scale(pixelRatio, pixelRatio);
    };

    CanvasLayer.prototype.draw = function () {
        var self = this;
        var args = arguments;

        clearTimeout(self.timeoutID);
        self.timeoutID = setTimeout(function () {
            self._draw();
        }, 15);
    };

    CanvasLayer.prototype._draw = function () {
        var map = this._map;
        var size = map.getSize();
        var center = map.getView().getCenter();
        var pixel = map.getPixelFromCoordinate(center);
        if (pixel) {
            this.canvas.style.left = pixel[0] - size.width / 2 + 'px';
            this.canvas.style.top = pixel[1] - size.height / 2 + 'px';
            this.options.update && this.options.update.call(this);
        }
    };

    CanvasLayer.prototype.getContainer = function () {
        return this.canvas;
    };

    Object.defineProperties(CanvasLayer.prototype, {
        show: {
            get: function () {
                return this._show;
            },
            set: function(bool) {
                this._show = bool;
                if(this.canvas){
                    if(this._show){
                        this.canvas.style.display = 'block';
                    } else {
                        this.canvas.style.display = 'none';
                    }

                    var zoom = this._map.getView().getZoom();
                    if(this.minZoom){
                        if(this.minZoom > zoom){
                            this.canvas.style.display = 'none';
                        }
                    }
                    if(this.maxZoom){
                        if(this.maxZoom < zoom){
                            this.canvas.style.display = 'none';
                        }
                    }
                }
            }
        },
    })

    var global = typeof window === 'undefined' ? {} : window;

    var requestAnimationFrame = global.requestAnimationFrame || global.mozRequestAnimationFrame || global.webkitRequestAnimationFrame || global.msRequestAnimationFrame || function (callback) {
        return global.setTimeout(callback, 1000 / 60);
    };

    function FlashMarker(map, userOptions) {
        var self = this;

        //默认参数
        var options = {
            //最小显示层级
            minZoom: null,
            //最大显示层级
            maxZoom: null,
            //是否显示
            show: true,
        };

        var animationLayer = null,
            width = map.getSize()[0],
            height = map.getSize()[1],
            animationFlag = true;
        var markers = [];

        //参数合并
        var merge = function merge(userOptions, options) {
            Object.keys(userOptions).forEach(function (key) {
                options[key] = userOptions[key];
            });
        };

        function Marker(opts) {
            this.name = opts.name;
            this.location = opts.location;
            this.color = opts.color;
            this.type = opts.type || 'circle';
            this.speed = opts.speed || 0.5;
            this.size = 0;
            this.max = opts.max || 50;
        }
    
        Marker.prototype.draw = function (context) {
            this._update();
            context.save();
            context.beginPath();
            switch (this.type) {
                case 'circle':
                    this._drawCircle(context);
                    break;
                case 'ellipse':
                    this._drawEllipse(context);
                    break;
                default:
                    break;
            }
            context.closePath();
            context.restore();
    
            this.size += this.speed;
            if (this.size > this.max) {
                this.size = 0;
            }
        };

        Marker.prototype._update = function (){
            var p1 = map.getPixelFromCoordinate(this.location);
            var mapCode =  map.getView().getProjection().getCode();
            var mocatorC = ol.proj.transform(this.location, mapCode, 'EPSG:3857');
            mocatorC = [mocatorC[0]+ this.size, mocatorC[1]];
            mocatorC = ol.proj.transform(mocatorC , 'EPSG:3857', mapCode);
            var p2 = map.getPixelFromCoordinate(mocatorC);
            if(p1 && p2) {
                this.pixel = p1;
                this.radius = Math.sqrt((p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1]));
            }
        };
    
        Marker.prototype._drawCircle = function (context) {
            // var pixel = this.pixel || map.getPixelFromCoordinate(this.location);
            var pixel = this.pixel;
            var radius = this.radius;
            if(pixel && !isNaN(pixel[0]) && !isNaN(pixel[1]) && radius) {
                context.strokeStyle = this.color;
                // context.moveTo(pixel[0], pixel[1]);
                context.arc(pixel[0], pixel[1], radius, 0, Math.PI * 2);
                context.stroke();
            }
        };
    
        Marker.prototype._drawEllipse = function (context) {
            var pixel = this.pixel || map.getPixelFromCoordinate(this.location);
            if(pixel && !isNaN(pixel[0]) && !isNaN(pixel[1])) {
                var x = pixel[0],
                    y = pixel[1],
                    w = this.size,
                    h = this.size / 2,
                    kappa = 0.5522848,
        
                // control point offset horizontal
                ox = w / 2 * kappa,
        
                // control point offset vertical
                oy = h / 2 * kappa,
        
                // x-start
                xs = x - w / 2,
        
                // y-start
                ys = y - h / 2,
        
                // x-end
                xe = x + w / 2,
        
                // y-end
                ye = y + h / 2;
        
                context.strokeStyle = this.color;
                context.moveTo(xs, y);
                context.bezierCurveTo(xs, y - oy, x - ox, ys, x, ys);
                context.bezierCurveTo(x + ox, ys, xe, y - oy, xe, y);
                context.bezierCurveTo(xe, y + oy, x + ox, ye, x, ye);
                context.bezierCurveTo(x - ox, ye, xs, y + oy, xs, y);
                context.stroke();
            };
        };

        //上层canvas渲染，动画效果
        var render = function render() {
            var animationCtx = animationLayer.canvas.getContext('2d');
            if (!animationCtx) {
                return;
            }

            if (!animationFlag) {
                animationCtx.clearRect(0, 0, width, height);
                return;
            }

            animationCtx.fillStyle = 'rgba(0,0,0,0.95)';
            var prev = animationCtx.globalCompositeOperation;
            animationCtx.globalCompositeOperation = 'destination-in';
            animationCtx.fillRect(0, 0, width, height);
            animationCtx.globalCompositeOperation = prev;

            for (var i = 0; i < markers.length; i++) {
                var marker = markers[i];
                marker.draw(animationCtx);
            }
        };

        var addMarker = function addMarker() {
            var data = self.data;
            data.forEach(function (item, i) {
                var newMarker = new Marker(item);
                markers.push(newMarker);
            });
        };

        //初始化
        var init = function init(map, options) {
            merge(userOptions, options);
            self._show = userOptions.show==undefined?true:userOptions.show;
            self._isStop = false;
            self.data = options.data;
            addMarker();
            animationLayer = new CanvasLayer({
                show: self._show,
                map: map,
                minZoom: options.minZoom,
                maxZoom: options.maxZoom,
                update: render
            });
            self.animationLayer = animationLayer;
            self.show = self._show;
            (function drawFrame() {
                if(!self._isStop) {
                    requestAnimationFrame(drawFrame);
                    render();
                }
            })();
        };

        init(map, options);
        self.options = options;
    }

    FlashMarker.prototype.update = function (resetOpts) {
        for (var key in resetOpts) {
            this.options[key] = resetOpts[key];
        }
    };

    FlashMarker.prototype.destroy = function () {
        this._isStop = true;
        if(this.animationLayer){
            this.animationLayer.canvas.remove();
        }
    };

    Object.defineProperties(FlashMarker.prototype, {
        show: {
            get: function () {
                return this._show;
            },
            set: function(bool) {
                this._show = bool;
                if(this.animationLayer){
                    this.animationLayer.show = this._show;
                }
            }
        },
    })

    return FlashMarker;

})));