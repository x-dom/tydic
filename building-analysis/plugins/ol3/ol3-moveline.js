(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.MoveLine = factory());
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
        canvas.className = 'ol3-moveline-canvas';
        var ctx = this.ctx = this.canvas.getContext('2d');
        canvas.style.cssText = 'position:absolute;' + 'left:0;' + 'top:0;';
        this.adjustSize();
        this.adjustRatio(ctx);
        this.draw();
        map.getViewport().appendChild(canvas);
        var that = this;
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
        if (center) {
            var pixel = map.getPixelFromCoordinate(center);
            if(pixel && !isNaN(pixel[0]) && !isNaN(pixel[1])) {
                this.canvas.style.left = pixel[0] - size[0] / 2 + 'px';
                this.canvas.style.top = pixel[1] - size[1] / 2 + 'px';
                this.options.update && this.options.update.call(this);
            }
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
 
    var MoveLine = function MoveLine(map, userOptions) {
        var self = this;
 
        //默认参数
        var options = {
            //marker点半径
            markerRadius: 3,
            //线条类型 solid、dashed、dotted
            lineType: 'solid',
            //移动点半径
            moveRadius: 2,
            //移动点颜色
            fillColor: '#fff',
            //移动点阴影颜色
            shadowColor: '#fff',
            //移动点阴影大小
            shadowBlur: 5,
            //最小显示层级
            minZoom: null,
            //最大显示层级
            maxZoom: null,
        };
 
        //全局变量
        var baseLayer = null,
            animationLayer = null,
            width = map.getSize()[0],
            height = map.getSize()[1],
            animationFlag = true,
            markLines = [];
 
        //参数合并
        var merge = function merge(userOptions, options) {
            Object.keys(userOptions).forEach(function (key) {
                options[key] = userOptions[key];
            });
        };
 
        function Marker(opts) {
            this.name = opts.name||'';
            this.value = opts.value||'';
            this.location = opts.location;
            this.color = opts.color;
        }
 
        Marker.prototype.draw = function (context) {
            var pixel = this.pixel = map.getPixelFromCoordinate(this.location);
            if(this.color && pixel && !isNaN(pixel[0]) && !isNaN(pixel[1])) {
                context.save();
                context.beginPath();
                var gradientRadius = options.markerRadius*3;
                var grd = context.createRadialGradient(pixel[0], pixel[1], options.markerRadius, pixel[0], pixel[1], gradientRadius);
                grd.addColorStop(0, this.color);
                grd.addColorStop(1, 'rgba(255,255,255,0)');
                context.fillStyle = grd;
                context.fillRect(pixel[0]-gradientRadius, pixel[1]-gradientRadius, pixel[0]+gradientRadius, pixel[1]+gradientRadius);
                // context.arc(pixel[0], pixel[1], options.markerRadius, 0, Math.PI * 2, true);
                // context.closePath();
                // context.fill();

                context.fillStyle = 'rgba(0,0,0,.8)';
                context.fillRect(pixel[0] - this.name.length*6 -2, pixel[1] - gradientRadius - 20, this.name.length*12 + 4, 18);
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.font = '12px Microsoft YaHei';
                context.fillStyle = this.color;
                context.fillText(this.name, pixel[0], pixel[1] - gradientRadius - 10);
                context.restore();

                var value = this.value;
                if(self.showValue && value) {
                    var numStr = value.toString();
                    context.fillStyle = 'rgba(0,0,0,.8)';
                    context.fillRect(pixel[0] - numStr.length*6 -2, pixel[1] - gradientRadius - 35, numStr.length*12 + 4, 15);
                    context.textAlign = 'center';
                    context.textBaseline = 'middle';
                    context.font = '12px Microsoft YaHei';
                    context.fillStyle = '#FFF';
                    context.fillText(numStr, pixel[0], pixel[1] - gradientRadius - 25);
                    context.restore();
                }
            }
        };
 
        function MarkLine(opts) {
            this.from = opts.from;
            this.to = opts.to;
            this.color = opts.color;
            this.width = opts.width;
            this.id = opts.id;
            this.step = 0;
        }
 
        MarkLine.prototype.getPointList = function (from, to) {
            var points = [];
            if(from && to) {
                points = [[from[0], from[1]], [to[0], to[1]]];
                var ex = points[1][0];
                var ey = points[1][1];
                points[3] = [ex, ey];
                points[1] = this.getOffsetPoint(points[0], points[3]);
                points[2] = this.getOffsetPoint(points[3], points[0]);
                points = this.smoothSpline(points, false);
                //修正最后一点在插值产生的偏移
                points[points.length - 1] = [ex, ey];
            }
            return points;
        };
 
        MarkLine.prototype.getOffsetPoint = function (start, end) {
            var distance = this.getDistance(start, end) / 3; //除以3？
            var angle, dX, dY;
            var mp = [start[0], start[1]];
            var deltaAngle = -0.2; //偏移0.2弧度
            if (start[0] != end[0] && start[1] != end[1]) {
                //斜率存在
                var k = (end[1] - start[1]) / (end[0] - start[0]);
                angle = Math.atan(k);
            } else if (start[0] == end[0]) {
                //垂直线
                angle = (start[1] <= end[1] ? 1 : -1) * Math.PI / 2;
            } else {
                //水平线
                angle = 0;
            }
            if (start[0] <= end[0]) {
                angle -= deltaAngle;
                dX = Math.round(Math.cos(angle) * distance);
                dY = Math.round(Math.sin(angle) * distance);
                mp[0] += dX;
                mp[1] += dY;
            } else {
                angle += deltaAngle;
                dX = Math.round(Math.cos(angle) * distance);
                dY = Math.round(Math.sin(angle) * distance);
                mp[0] -= dX;
                mp[1] -= dY;
            }
            return mp;
        };
 
        MarkLine.prototype.smoothSpline = function (points, isLoop) {
            var len = points.length;
            var ret = [];
            var distance = 0;
            for (var i = 1; i < len; i++) {
                distance += this.getDistance(points[i - 1], points[i]);
            }
            var segs = distance / 2;
            segs = segs > 300?300:segs;
            segs = segs < len ? len : segs;
            for (var i = 0; i < segs; i++) {
                var pos = i / (segs - 1) * (isLoop ? len : len - 1);
                var idx = Math.floor(pos);
                var w = pos - idx;
                var p0;
                var p1 = points[idx % len];
                var p2;
                var p3;
                if (!isLoop) {
                    p0 = points[idx === 0 ? idx : idx - 1];
                    p2 = points[idx > len - 2 ? len - 1 : idx + 1];
                    p3 = points[idx > len - 3 ? len - 1 : idx + 2];
                } else {
                    p0 = points[(idx - 1 + len) % len];
                    p2 = points[(idx + 1) % len];
                    p3 = points[(idx + 2) % len];
                }
                var w2 = w * w;
                var w3 = w * w2;
 
                ret.push([this.interpolate(p0[0], p1[0], p2[0], p3[0], w, w2, w3), this.interpolate(p0[1], p1[1], p2[1], p3[1], w, w2, w3)]);
            }
            return ret;
        };
 
        MarkLine.prototype.interpolate = function (p0, p1, p2, p3, t, t2, t3) {
            var v0 = (p2 - p0) * 0.5;
            var v1 = (p3 - p1) * 0.5;
            return (2 * (p1 - p2) + v0 + v1) * t3 + (-3 * (p1 - p2) - 2 * v0 - v1) * t2 + v0 * t + p1;
        };
 
        MarkLine.prototype.getDistance = function (p1, p2) {
            return Math.sqrt((p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1]));
        };
 
        MarkLine.prototype.drawMarker = function (context) {
            this.from.draw(context);
            this.to.draw(context);
        };
 
        MarkLine.prototype.drawLinePath = function (context) {
            var pointList = this.path = this.getPointList(map.getPixelFromCoordinate(this.from.location), map.getPixelFromCoordinate(this.to.location));
            if(pointList.length == 0) return;
            context.save();
            context.beginPath();
            context.lineWidth = this.width;
            context.strokeStyle = this.color;
 
            if (!options.lineType || options.lineType == 'solid') {
                context.moveTo(pointList[0][0], pointList[0][1]);
                for (var i = 0; i < pointList.length; i++) {
                    context.lineTo(pointList[i][0], pointList[i][1]);
                }
            } else if (options.lineType == 'dashed' || options.lineType == 'dotted') {
                for (var i = 1; i < pointList.length; i += 2) {
                    context.moveTo(pointList[i - 1][0], pointList[i - 1][1]);
                    context.lineTo(pointList[i][0], pointList[i][1]);
                }
            }
            context.stroke();
            context.restore();
        };
 
        MarkLine.prototype.drawMoveCircle = function (context) {
            var pointList = this.path || this.getPointList(map.getPixelFromCoordinate(this.from.location), map.getPixelFromCoordinate(this.to.location));
            if(pointList.length == 0) return;
            if (this.step >= pointList.length) {
                this.step = 0;
            }
            context.save();
            context.fillStyle = options.fillColor;
            context.shadowColor = options.shadowColor;
            context.shadowBlur = options.shadowBlur;
            context.beginPath();
            context.arc(pointList[this.step][0], pointList[this.step][1], options.moveRadius, 0, Math.PI * 2, true);
            context.fill();
            context.closePath();
            context.restore();
            this.step += 1;
        };
 
        //底层canvas渲染，标注，线条
        var brush = function brush() {
            var baseCtx = baseLayer.canvas.getContext('2d');
            if (!baseCtx) {
                return;
            }
 
            baseCtx.clearRect(0, 0, width, height);
 
            markLines.forEach(function (line) {
                line.drawMarker(baseCtx);
                line.drawLinePath(baseCtx);
            });
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
 
            animationCtx.fillStyle = 'rgba(0,0,0,.93)';
            var prev = animationCtx.globalCompositeOperation;
            animationCtx.globalCompositeOperation = 'destination-in';
            animationCtx.fillRect(0, 0, width, height);
            animationCtx.globalCompositeOperation = prev;
 
            for (var i = 0; i < markLines.length; i++) {
                var markLine = markLines[i];
                markLine.drawMoveCircle(animationCtx); //移动圆点
            }
        };
        var addMarkLine = function addMarkLine() {
            markLines = [];
            var dataset = options.data;
            dataset.forEach(function (line, i) {
                markLines.push(new MarkLine({
                    id: i,
                    color: line.color,
                    width: line.width,
                    from: new Marker({
                        value: line.from.value,
                        name: line.from.name,
                        location: [line.from.lnglat[0], line.from.lnglat[1]],
                        color: line.color,
                    }),
                    to: new Marker({
                        value: line.from.value,
                        name: line.to.name,
                        location: [line.to.lnglat[0], line.to.lnglat[1]],
                        // color: options.colors[i]
                        color: null
                    })
                }));
            });
        };
        
        //初始化
        var init = function init(map, options) {
            merge(userOptions, options);
            self._show = userOptions.show==undefined?true:userOptions.show;
            self._isStop = false;
            self.showValue = userOptions.showValue==undefined?false:userOptions.showValue;
            addMarkLine();
            baseLayer = new CanvasLayer({
                show: self._show,
                map: map,
                minZoom: options.minZoom,
                maxZoom: options.maxZoom,
                update: brush,
            });
 
            animationLayer = new CanvasLayer({
                show: self._show,
                map: map,
                minZoom: options.minZoom,
                maxZoom: options.maxZoom,
                update: render
            });
            self.baseLayer = baseLayer;
            self.animationLayer = animationLayer;
            self.show = self._show;
            (function drawFrame() {
                if(!self._isStop){
                    requestAnimationFrame(drawFrame);
                    render();
                }
            })();
        };
        
        init(map, options);
        self.options = options;
    };
 
    MoveLine.prototype.update = function (resetOpts) {
        for (var key in resetOpts) {
            this.options[key] = resetOpts[key];
        }
    };
    MoveLine.prototype.destroy = function () {
        this._isStop = true;
        if(this.baseLayer){
            this.baseLayer.canvas.remove();
        }   
        if(this.animationLayer){
            this.animationLayer.canvas.remove();
        }
    };
    Object.defineProperties(MoveLine.prototype, {
        show: {
            get: function () {
                return this._show;
            },
            set: function(bool) {
                this._show = bool;
                if(this.baseLayer){
                    this.baseLayer.show = this._show;
                }
                if(this.animationLayer){
                    this.animationLayer.show = this._show;
                }
            }
        },
    })
 
    return MoveLine;
})));