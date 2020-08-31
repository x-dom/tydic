const Cesium = require('cesium/Cesium');

/**
 * 3D覆盖物类
 */
export default class DOverlay3D{
	constructor(options){
		let use_options = {};

        //合并参数
		$.extend(use_options, options);
		
		this.options = options;
		this.content = use_options.content;
		// this.map = use_options.map;
		this.position = use_options.position;
		this.offsetX = use_options.offsetX || 0;
        this.offsetY = use_options.offsetY || 0;
		this.maxZoom = use_options.maxZoom || 8;
		this.container,this.event3d;
		
		this.render();
	}

	/**
	 * 渲染绘制
	 */
	render(){
		let _this = this;

		//清除
		_this.clear();
		if(_this.content && _this.map){
			let map3D = _this.map.map3D;
			
			_this.container = document.createElement("div");
			_this.container.className = 'dmap-overlay-3d';
			_this.container.style.position = "absolute";
			if(typeof(_this.content) == "string"){
				_this.container.innerHTML = _this.content;
			} else {
				_this.container.appendChild(_this.content);
			}
			map3D.scene.canvas.parentElement.appendChild(_this.container);

			updatePosition(_this.container, _this.position, map3D, _this.offsetX, _this.offsetY);
			let eventCode = _this.map.on("rendercomplete",function(){
				updatePosition(_this.container, _this.position, map3D, _this.offsetX, _this.offsetY);
			});
			_this.clear = function(){
				if(_this.container){
					_this.container.parentElement.removeChild(_this.container);
            		_this.container = undefined;
				}
				
				if(_this.map){
					_this.map.unByCode(eventCode);
				}
			}

			/**
			 * 位置更新
			 * @param {*} element 
			 * @param {*} position 
			 * @param {*} map3D 
			 */
			function updatePosition(element, position, map3D, offsetX, offsetY){
				if(element){
					let cartesian = new Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]||0);
					let pick = Cesium.SceneTransforms.wgs84ToWindowCoordinates(map3D.scene, cartesian);
					if(pick){
						let x = pick.x + offsetX;
						let y = pick.y + offsetY;
						element.style.left = x + "px";
						element.style.top = y + "px";
					}
				}
			}
		}
	}

	/**
	 * 清除
	 */
	clear() {
		if(this.container){
			this.container.parentElement.removeChild(this.container);
            this.container = undefined;
		}
		this.container = undefined;
		
		
		if(this.map && this.map.map3D && this.event3d){
			this.map.map3D.camera.moveEnd.removeEventListener(this.event3d);
		}
		this.event3d = undefined;
	}

	/**
	 * 设置地图
	 * @param {*} map 
	 */
	setMap (map){
		this.map = map;
		this.render();
	}
}