;var CesiumHeatmapGL = (function(Cesium,createWebGLHeatmap){
    function CHGL(chglviewer, data, weight, bool){
        this._viewer=chglviewer;
        this._weight=weight;
        this._show=!!bool;
        this.data=data;
        this.heatmapcanvas;
        this.update();
    }

    CHGL.prototype.update = function(data){
        var _this = this;
        _this.data = data||_this.data;
        if(_this.data.length ==0) return;
        var lonmin=1000;
        var lonmax=-1000;
        var latmin=1000;
        var latmax=-1000;
        _this.data.forEach(coordinates => {
            var lon = coordinates[0];
            var lat = coordinates[1];
            lonmin = lon<lonmin?lon:lonmin;
            latmin = lat<latmin?lat:latmin;
            lonmax = lon>lonmax?lon:lonmax;
            latmax = lat>latmax?lat:latmax;
        });
        var xrange = lonmax-lonmin;
        var yrange = latmax-latmin;
        var extent={xMin:lonmin-xrange/10,yMin:latmin-yrange/10, xMax:lonmax+xrange/10,yMax:latmax+yrange/10};
        _this.heatmapcanvas = document.createElement('canvas');
        document.body.appendChild(_this.heatmapcanvas);
        _this.heatmapcanvas.width = 1000;
        _this.heatmapcanvas.height = parseInt(1000/(extent.xMax-extent.xMin)*(extent.yMax-extent.yMin));
        try{
            var heatmap = _this._heatmap = createWebGLHeatmap({canvas: _this.heatmapcanvas,intensityToAlpha:true});
        }
        catch(error){
            console.error(error);
        }
        _this.data.forEach(coordinates => {
            var x = (coordinates[0]-extent.xMin)/(extent.xMax-extent.xMin)*_this.heatmapcanvas.clientWidth;
            var y = (-(coordinates[1]-extent.yMin)/(extent.yMax-extent.yMin)+1)*_this.heatmapcanvas.clientHeight;
            coordinates[2] = coordinates[2]||0;
            var weight = coordinates[2]/_this._weight * 50;
            heatmap.addPoint(x, y, weight, 0.05);
        });
        heatmap.adjustSize(); 
        heatmap.update();
        heatmap.display();
        _this.drawHeatmapRect(_this.heatmapcanvas,extent);
        // this._viewer.camera.flyTo({
        //     destination : Cesium.Rectangle.fromDegrees(extent.xMin, extent.yMin, extent.xMax, extent.yMax)
        // });
    }

    CHGL.prototype.destory = function() {
        if(this._worldRectangle){
            this._viewer.scene.primitives.remove(this._worldRectangle);
            this._worldRectangle = undefined;
        }
        if(this.heatmapcanvas) {
            this.heatmapcanvas.remove();
            this.heatmapcanvas = undefined;
        }
    };

	CHGL.prototype.drawHeatmapRect = function(canvas,extent) {
        var image = convertCanvasToImage(canvas);
        this.destory();
		this._worldRectangle = this._viewer.scene.primitives.add(new Cesium.GroundPrimitive({
			geometryInstances : new Cesium.GeometryInstance({
				geometry : new Cesium.RectangleGeometry({
					rectangle : Cesium.Rectangle.fromDegrees(extent.xMin, extent.yMin, extent.xMax, extent.yMax),
					vertexFormat : Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
				})
			}),
			appearance : new Cesium.EllipsoidSurfaceAppearance({
                aboveGround : false,
                // renderState: {
                //     depthTest: {
                //         enabled: true,
                //         func: Cesium.DepthFunction.ALWAYS
                //     },
                // },
			}),
			show : this._show
		}));
		this._worldRectangle.appearance.material = new Cesium.Material({
			fabric : {
				type : 'Image',
				uniforms : {
					image : image.src
				}
			}
		});
    }

    CHGL.prototype.updateHeatmap=function(){
        this._heatmap.adjustSize(); 
        this._heatmap.update();
        this._heatmap.display();

        var image = convertCanvasToImage(this._heatmap.canvas);
        this._worldRectangle.appearance.material.uniforms.image=image.src;
        //  = new Cesium.Material({
		// 	fabric : {
		// 		type : 'Image',
		// 		uniforms : {
		// 			image : image.src
		// 		}
		// 	}
		// });
    }
    
    CHGL.prototype.multiply = function(value){
        this._heatmap.multiply(value);
        this.updateHeatmap();
    }

    CHGL.prototype.clamp = function(min,max){
        this._heatmap.clamp(min, max);
        this.updateHeatmap();
    }

    CHGL.prototype.blur = function(){
        this._heatmap.blur();
        this.updateHeatmap();
    }

    Object.defineProperties(CHGL.prototype, {
        show: {
            get: function () {
                return this._show;
            },
            set: function(bool) {
                this._show = bool;
                if(this._worldRectangle){
                    this._worldRectangle.show = bool;
                }
            }
        },
    });

	function convertCanvasToImage(canvas) {
		var image = new Image();
		image.src = canvas.toDataURL("image/png");
		return image;
    }
    return CHGL;
})(window.Cesium||{},window.createWebGLHeatmap||{});