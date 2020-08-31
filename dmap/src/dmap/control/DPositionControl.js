import DBaseControl from "./DBaseControl";
import {transform, registerProjection } from "../utils/geom";
import {PositionSearchSvg}  from  "./DControlSvg";

/**
 * 定位控件
 */
export default class DPositionControl extends DBaseControl{
    constructor(options) {

        let use_options = {
            on2D: true,
            on3D: true,
            isShowControl: false,
            projection: "EPSG:4326",
            projections: ["EPSG:4326","EPSG:3857","EPSG:4496","EPSG:4490","EPSG:27700"]
        };
        options = options||{};
        $.extend(use_options, options);
        super(use_options);
        use_options = this.options;
        this.target = use_options.target;
        this.isShowControl = use_options.isShowControl;
        this.projection = use_options.projection;
        this.projections = use_options.projections;
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
            _this.element.className = "dmap-control dmap-position"+classPosition;

            let btnElement = document.createElement("button");
            btnElement.title = "位置查询";
            btnElement.innerHTML = PositionSearchSvg;
            _this.element.appendChild(btnElement);
            root.appendChild(_this.element);

            //创建定位面板
            _this.content = document.createElement("div");
            _this.content.className = "dmap-control dmap-position-content";
            _this.content.style.display = _this.isShowControl?"block":"none";
            document.getElementById(_this.map.target).appendChild(_this.content);

            let lonLabelElement = document.createElement("label");
            lonLabelElement.innerText = "经度：";
            _this.content.appendChild(lonLabelElement);
            let lonElement = document.createElement("input");
            _this.content.appendChild(lonElement);
            let latLabelElement = document.createElement("label");
            latLabelElement.innerText = "纬度：";
            _this.content.appendChild(latLabelElement);
            let latElement = document.createElement("input");
            _this.content.appendChild(latElement);
            let projLabelElement = document.createElement("label");
            projLabelElement.innerText = "坐标系：";
            _this.content.appendChild(projLabelElement);
            let projElement = document.createElement("select");
            _this.content.appendChild(projElement);
            for (let i = 0; i < _this.projections.length; i++) {
                const projection = _this.projections[i];
                let optionElement = document.createElement("option");
                optionElement.value = projection;
                optionElement.innerText = projection;

                if(projection == _this.projection){
                    optionElement.selected = true;
                }
                projElement.appendChild(optionElement);
            }
            let searchBtnElement = document.createElement("input");
            searchBtnElement.value = "定位";
            searchBtnElement.type = "button";
            searchBtnElement.style.marginLeft = "5px";
            _this.content.appendChild(searchBtnElement);

            searchBtnElement.onclick = function(){
                let lon = Number(lonElement.value);
                let lat = Number(latElement.value);
                let projection = projElement.value;

                if(lonElement.value == ""){
                    alert("输入经度不能为空！");
                } else if(lonElement.value == ""){
                    alert("输入纬度不能为空！");
                } else if(isNaN(lon)){
                    alert("请确认经度输入正确！");
                } else if(isNaN(lat)){
                    alert("请确认纬度输入正确！");
                } else if(!registerProjection(projection)){
                    alert("请确认坐标系输入正确！");
                } else {
                    let center = transform([lon, lat], projection, _this.map.projection);
                    _this.map.setCenter(center);
                }
            }

            btnElement.onclick = function(){
                if(_this.content.style.display == "none"){
                    _this.content.style.display = "block";
                    _this.isShowControl = true;
                } else {
                    _this.content.style.display = "none";
                    _this.isShowControl = false;
                }
            }

            _this.show(_this.on2D, _this.on3D);
            _this.eventCode = _this.map.on("change:mode",function(evt){
                _this.show(_this.on2D, _this.on3D);
            });

            //清除事件
            _this.clearEnvent = function (){
                if(_this.map){
                    _this.map.eventObj.unByCode(_this.eventCode);
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
}