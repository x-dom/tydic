/*
 * @Author: your name
 * @Date: 2020-03-13 14:19:51
 * @LastEditTime: 2020-03-13 17:11:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \box2dweb\whcoord.js
 */

// 构造类函数
var Class = { 
  create: function() { 
    return function() { 
      this.initialize.apply(this , arguments); 
    } 
  } 
};

// 点类
whpoint=Class.create();

whpoint.prototype={
  initialize:function(x,y){
    this.x=x;
    this.y=y;
  }
};

// 矩形类
whrect=Class.create();

whrect.prototype={
  initialize:function(pointmin,pointmax){
  this.point1=pointmin;
  this.point2=pointmax;
  this.width=this.point2.x-this.point1.x;
  this.height=this.point2.y-this.point1.y;

  },

  getwidth:function(){
    return this.point2.x-this.point1.x;
  },

  setwidth:function(newwidth){
    this.width=newwidth;
  },

  getheight:function(){
    return this.point2.y-this.point1.y;
  },

  setheight:function(newheight){
    this.height=newheight;
  },

  setpointmax:function(pointmax){
    this.point2=pointmax;
  },

  setpointmin:function(pointmin){
    this.point1=pointmin;
  },

  getminx:function(){

    return this.point1.x;
  },
  getminy:function(){
    return this.point1.y;
  },
  getmaxx:function(){

    return this.point2.x
  },

  getmaxy:function(){

    return this.point2.y;
  }

};

// 坐标转换类
whcoordchange = Class.create();

whcoordchange.prototype = {
  initialize:function(screenrect,maprect){
    this.screenrect=screenrect;
    this.maprect=maprect;
  },
  getmapextent:function(screenpoint,twidth,theight){
    var screenbl_x=screenpoint.x-twidth/2;
    var screenbl_y=screenpoint.y+theight/2;
    var tempscreenblp=new whpoint(screenbl_x,screenbl_y);
    var resmapblp=this.screentomap(tempscreenblp);
    
    var screenur_x=screenpoint.x+twidth/2;
    var screenur_y=screenpoint.y-theight/2;
    var tempscreenurp=new whpoint(screenur_x,screenur_y);
    var resmapurp=this.screentomap(tempscreenurp);
    
    return new whrect(resmapblp,resmapurp);
     
  },
  screentomap:function(screenpoint){
    var resmapx=this.maprect.getminx() + this.maprect.getwidth()*(screenpoint.x-this.screenrect.getminx())/this.screenrect.getwidth();
    var resmapy=this.maprect.getmaxy() - this.maprect.getheight()*(screenpoint.y-this.screenrect.getminy())/this.screenrect.getheight();
    
    return new whpoint(resmapx,resmapy);
    },
  maptoscreen:function(mappoint){
    var resscreenx=this.screenrect.getminx() + this.screenrect.getwidth()*(mappoint.x-this.maprect.getminx())/this.maprect.getwidth();
    var resscreeny=this.screenrect.getminy() + this.screenrect.getheight()*(this.maprect.getmaxy()-mappoint.y)/this.maprect.getheight();
    return new whpoint(resscreenx.toFixed(6), resscreeny.toFixed(6));
    
  }
};


// 应用
// var scminp=new whpoint(10,10);
// var scmaxp=new whpoint(400,300);
// var screct=new whrect(scminp,scmaxp);

// var mminp=new whpoint(120.235,30.235);
// var  mmaxp=new whpoint(120.265,30.265);    

// var mrect=new whrect(mminp,mmaxp);

// //建立 屏幕坐标和 地图坐标的对应关系 注意应该是 鹰眼的范围 对应 地图的范围
// var mycoordchange=new whcoordchange(screct,mrect);

// var scpoint1=new whpoint(10,300);
// var mapscpoint1=mycoordchange.screentomap(scpoint1);

// alert(mapscpoint1.x+";"+mapscpoint1.y);

// var mapoint1=new whpoint(120.250,30.250);
// var scmapoint1=mycoordchange.maptoscreen(mapoint1);

// alert(scmapoint1.x+";"+scmapoint1.y);

// //根据屏幕坐标点 相应鹰眼redbox的 width 和 height 获取相应的 地图extent,
// var maprect=mycoordchange.getmapextent(scmapoint1,195,145);

// alert (maprect.getminx()+";" + maprect.getminy()+";"+maprect.getmaxx()+";"+ maprect.getmaxy());