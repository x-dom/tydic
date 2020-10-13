import * as THREE from './build/three.module.js';
import { GLTFLoader } from './expamle/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from './expamle/jsm/controls/OrbitControls.js';
import { Line2 } from './expamle/jsm/lines/Line2.js';
import { LineMaterial } from './expamle/jsm/lines/LineMaterial.js';
import { LineGeometry } from './expamle/jsm/lines/LineGeometry.js';
import { RenderPass } from './expamle/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from './expamle/jsm/postprocessing/ShaderPass.js';
import { EffectComposer } from './expamle/jsm/postprocessing/EffectComposer.js';
import { OutlinePass } from './expamle/jsm/postprocessing/OutlinePass.js';
import { FXAAShader } from './expamle/jsm/shaders/FXAAShader.js';
import { FBXLoader } from './expamle/jsm/loaders/FBXLoader.js';

import {loadObj,loadFbx} from './expamle/test/js/model.js';
import {initProgres,initCharts} from './expamle/test/js/progress';
import {affdata} from './expamle/test/js/data';
var stopAnimation;
var composer, effectFXAA, outlinePass;
var camera, scene, renderer, stats,qqq,matLine,matLine1,matLine2,controls,svgrender,
towerline,towerline1,towerline2,
object=[],
selectedObjects,
raycaster = new THREE.Raycaster(),
mouse = new THREE.Vector2();
var width,height;
var map2 = new THREE.TextureLoader().load( 'expamle/test/image/building3.png' );
  map2.anisotropy = 4;
  map2.wrapS = THREE.RepeatWrapping;
  map2.wrapT = THREE.RepeatWrapping;
  map2.blending = 'AdditiveBlending';
var map1 = new THREE.TextureLoader().load( 'expamle/test/image/test.png' );
  map1.anisotropy = 4;
function load() {
  var widthCon = window.innerWidth - 1040;
  $("#cont").width(widthCon+'px');
 // if($("title").html() == "拆闲补忙"){
    $(".right").hide();
    $(".goods").show();
  //}
  width=widthCon;
  height=$("#cont")[0].offsetHeight;
  if(!renderer){
    init();
    loadObj(scene);
    drawsourceLine();
    towerAnimtion()
    animate();
    initevent();
  }
}

var rrudata = [
  {
    name:"怀远电信局",
    id:"440592",
    BUSINESS_CENTER:"",
    type:"RRU3632",
    state:"直流",
    RRU_LOCATION:"涡河三桥与北大坝交口",
    ENB_LEVEL:"A"
  },
  {
    name:"红庙",
    id:"440639",
    BUSINESS_CENTER:"禹王城市营业部",
    type:"RRU3632",
    state:"直流",
    RRU_LOCATION:"粮库",
    ENB_LEVEL:"B"
  },
  {
    name:"涡河三桥与北大坝交口",
    id:"440632",
    BUSINESS_CENTER:"",
    type:"RRU3632",
    state:"直流",
    RRU_LOCATION:"怀远中医院",
    ENB_LEVEL:"C"
  },
]  
function init(){
  raycaster.linePrecision = 3;
  var container = document.createElement( 'div' );
  document.getElementById('cont').appendChild( container );
  renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
  renderer.setClearAlpha(0.2);      
  renderer.setClearColor( 0x000000, 0.0 );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( width, height );
  container.appendChild( renderer.domElement );
  scene = new THREE.Scene();
  //载入相机
  camera = new THREE.PerspectiveCamera( 90, width / height, 1, 8000 );
  camera.position.set( 380, 50, 500 );
  scene.add( camera );
  //载入灯光
  var ambientLight = new THREE.AmbientLight( 0xaaaaaa);
  scene.add( ambientLight );
  //载入房间模型以及铁塔
  loadGltfModel();
  loadHouse();
  window.addEventListener( 'resize', onWindowResize, false );
  composer = new EffectComposer( renderer );
  var renderPass = new RenderPass( scene, camera );
  composer.addPass( renderPass );

  outlinePass = new OutlinePass( new THREE.Vector2( width, height ), scene, camera );
  composer.addPass( outlinePass );

  var onLoad = function ( texture ) {

  outlinePass.patternTexture = texture;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  };

  var loader = new THREE.TextureLoader();

  loader.load( './expamle/test/image/tri_pattern.jpg', onLoad );

  effectFXAA = new ShaderPass( FXAAShader );
  effectFXAA.uniforms[ 'resolution' ].value.set( 1 / width, 1 / height );
  effectFXAA.renderToScreen = true;
  composer.addPass( effectFXAA );

  controls = new OrbitControls( camera, renderer.domElement );
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.RIGHT,
	  MIDDLE: THREE.MOUSE.MIDDLE,
	  RIGHT: THREE.MOUSE.LEFT,
  }

  //初始中心位置
  controls.target = new THREE.Vector3(380, 50, 0);

  //可以水平绕行多远，上限
  controls.maxAzimuthAngle = 90/360*Math.PI; 
  //可以水平绕行多远，下限
  controls.minAzimuthAngle = -90/360*Math.PI; 

  //可以垂直绕行多远，上限
  controls.maxPolarAngle = 180/360*Math.PI; 
  //可以垂直绕行多远，下限
  controls.minPolarAngle = 0; 

  //controls.addEventListener( 'change', render ); 
  // 使动画循环使用时阻尼或自转 意思是否有惯性 
  controls.enableDamping = true; 
  //动态阻尼系数 就是鼠标拖拽旋转灵敏度 
  controls.dampingFactor = 0.25; 
  //是否可以缩放 
  controls.enableZoom = true; 
  //是否自动旋转 
  controls.autoRotate = false; 
  //设置相机距离原点的最远距离 
  controls.minDistance = 10; 
  //设置相机距离原点的最远距离 
  controls.maxDistance = 3000; 
  //是否开启右键拖拽 
  controls.enablePan = true; 
  //启用或禁用摄像机的水平和垂直旋转
  controls.enableRotate = true; 
  //平移时相机位置的平移方式
  controls.screenSpacePanning = true;
}
//示例模型加载
function loadGltfModel(){
  var loader = new GLTFLoader();
  var loaderfbx = new FBXLoader();
  //加载信号塔
  loader.load('./expamle/test/testglb/pole_ring.glb',(gltf) => {
    var model = gltf.scene;
    model.scale.setScalar(10);
    model.position.set(70,0,300);
    model.name = "xinhaota";
    // model.children[0].material = new THREE.MeshPhongMaterial( { map:map1, shininess: 100,specular: 0x111111,transparent:true,opacity:0.8} );
    scene.add(model);
  })
  //加载天线以及rru
  loader.load('./expamle/test/testglb/2t2r_rru.glb',(gltf) => {
    for(var i=0;i<3;i++){
      var val = gltf.scene.clone();
      if(i == 0){
        val.position.set(80,330,300);
        val.rotation.z += -0.05;
      }else if(i == 1){
        val.position.set(68,330,292);
        val.rotation.y += 2.14;
        val.rotation.z += -0.05;
      }else if(i == 2){
        val.position.set(63,330,306);
        val.rotation.z += -0.05;
        val.rotation.y +=-1.8;
      }
      for(var j=0;j<val.children.length;j++){
        val.children[j].positionData = val.position;
        for(var h=0;h<val.children[j].children.length;h++){
          var zhi=val.children[j].children[h];
        //  zhi.material.color.set("#ffffff");
        }
      }
      val.scale.multiplyScalar(3);
      val.rrudata = rrudata[i];
      val.name="rru";
      var point = val.position;
      var pointArr = [
            point.x-2.5,point.y,point.z,
            70,point.y-10,300,
            70,2,300,
            380,2,300,
            380,2,390,
            377,16+i*10,400
          ];
      var pointArr1 = [
        point.x+0.5,point.y,point.z+0.5,
        70,point.y-10,300,
        70,2,300,
        380,2,300,
        380,2,390,
        375,16+i*10,400
      ];
      var pointArr2 = [
        385,16+i*10,400,
        385-i*1,8,400,
      ];
      var options = {
        pointArr:pointArr,
        pointArr1:pointArr1,
        pointArr2:pointArr2,
      }
      drawLine(options);
      scene.add( val);
    }
  })
  loader.load('./expamle/test/testglb/4g_ant.glb',(gltf) => {
    for(var i=0;i<3;i++){
      var val = gltf.scene.clone();
      if(i == 0){
        val.position.set(80,380,300);
        val.rotation.z += -0.05;
      }else if(i == 1){
        val.position.set(68,380,292);
        val.rotation.y += 2.14;
        val.rotation.z += -0.05;
      }else if(i == 2){
        val.position.set(63,380,306);
        val.rotation.z += -0.05;
        val.rotation.y +=-1.8;
      }
      for(var j=0;j<val.children.length;j++){
        val.children[j].positionData = val.position;
      }
      val.scale.multiplyScalar(3);
      val.name="rru_antenna";
      var point = val.position;
      var pointArr = [
        point.x-2.5,point.y,point.z,
        point.x,point.y-20,point.z,
      ];
      var pointArr1 = [
        point.x,point.y,point.z,
        point.x+0.5,point.y-20,point.z+0.5,
      ];
      var options = {
        pointArr:pointArr,
        pointArr1:pointArr1,
      }
      drawLine(options);
      scene.add( val);
    }
  })
}
//铁塔动画
function towerAnimtion(){
  var geometry = new THREE.CircleGeometry( 50, 60 );
  var geometry1 = new THREE.CircleGeometry( 30, 60 );
  var geometry2 = new THREE.CircleGeometry( 10, 60 );
  geometry.vertices.shift();
  geometry1.vertices.shift();
  geometry2.vertices.shift();
  var lineMaterial = new THREE.LineBasicMaterial({
        color: '#ff0000'
    });
    towerline = new THREE.LineLoop(geometry, lineMaterial);
    towerline1 = new THREE.LineLoop(geometry1, lineMaterial);
    towerline2 = new THREE.LineLoop(geometry2, lineMaterial);
    towerline.position.set(70,400,300);
    towerline.rotateX(Math.PI/2);
    towerline1.rotateX(Math.PI/2);
    towerline2.rotateX(Math.PI/2);
    towerline1.position.set(70,400,300);
    towerline2.position.set(70,400,300);
}
//铁塔连接线
function drawLine({pointArr,pointArr1,pointArr2,color1=0xffffff,color2=0x0081cf,linewidth=2} = {}){
  // var color1 = color1 || 0xffffff ;
  // var color2 = color2 || 0x111111 ;
  // var linewidth = linewidth || 2;
  var geometry = new LineGeometry();
  var geometry1 = new LineGeometry();
  geometry1.setPositions( pointArr1 );
  geometry.setPositions( pointArr );
  matLine = new LineMaterial( {
    color: color1,
    linewidth: linewidth, // in pixels
    dashed: false
  } );
  matLine1 = new LineMaterial( {
    color: color2,
    linewidth: linewidth, // in pixels
    dashed: false
  } );
  matLine2 = new LineMaterial( {
    color: color2,
    linewidth: linewidth+2, // in pixels
    dashed: false
  } );
  matLine.resolution.set( width, height );
  matLine1.resolution.set( width, height );
  matLine2.resolution.set( width, height );
  var line = new Line2( geometry, matLine );
  line.name="line2";
  var line1 = new Line2( geometry1, matLine1 );
  line1.name="line2";
  scene.add( line );
  scene.add( line1 );
  if(pointArr2){
    var geometry2 = new LineGeometry();
    geometry2.setPositions( pointArr2 );
    var line2 = new Line2( geometry2, matLine2 );
    line2.name="line2";
    scene.add( line2);
  }
}
//加载电源线以及开关线
function drawsourceLine(){
  var pointArr = [
    355,2,435,
    355,2,390,
    383,2,390,
    383,6,400,
  ];
  var pointArr1= [
    350,2,435,
    350,2,395,
    380,2,395,
    380,6,400,
  ];
  var options = {
    pointArr:pointArr,
    pointArr1:pointArr1,
    color1:0x0081cf,
    color2:0xe4393c
  }
  //电源线
  drawLine(options);
  var line1 = [
    445,50,400,
    445,50,353,
    330,50,353,
    310,50,353
  ];
  var line2= [
    445,50,405,
    445,50,430,
    445,2,430,
    410,2,430,
  ];
  //开关线
  var options1 = {
    pointArr:line1,
    pointArr1:line2,
    color1:0x0081cf,
    color2:0x0081cf
  }
  drawLine(options1);
}
//加载房间、
function loadHouse(){
  var material_1 = new THREE.MeshPhongMaterial( { color: 0xaaaaaa } );
  var material_2 = new THREE.MeshPhongMaterial( { color: 0xaaaaaa} );
  var material_3 = new THREE.MeshPhongMaterial( { color: 0xaaaaaa } );
  
  var material_4 = new THREE.MeshPhongMaterial( { color: 0xaaaaaa } );
  var material_5 = new THREE.MeshPhongMaterial( { map:map2, shininess: 100,specular: 0x08084b,transparent:true,opacity:0.8} );
  var material_6 = new THREE.MeshPhongMaterial( { map:map2, shininess: 100,specular: 0x08084b,transparent:true,opacity:0.8} );
  var materials = [];
  materials.push(material_1);
  materials.push(material_2);
  materials.push(material_3);
  materials.push(material_4);
  materials.push(material_5);
  materials.push(material_6);
  //左边的墙
  var geometry = new THREE.BoxBufferGeometry(250, 100 ,5 );
  var mesh = new THREE.Mesh( geometry, materials );
  //mesh.rotateY(Math.PI/2);
  mesh.position.set(250,50,350);
  mesh.rotateY(-Math.PI/2);
  scene.add(mesh);
  //后边的墙
  var geometry1 = new THREE.BoxBufferGeometry(250, 100 ,5);
  var mesh1 = new THREE.Mesh( geometry1, materials );
  mesh1.position.set(375,50,225);
  scene.add(mesh1);
  //右边的墙
  var geometry2 = new THREE.BoxBufferGeometry(250, 100 ,5);
  var mesh2 = new THREE.Mesh( geometry2, materials );
  mesh2.position.set(500,50,350);
  mesh2.rotateY(Math.PI/2);
  scene.add(mesh2);
  //底部的墙
  var materialBottom = new THREE.MeshPhongMaterial( { color:0x0081cf,transparent:true,opacity:0.2 } );
  var geometry3 = new THREE.BoxBufferGeometry(600, 400 ,1);
  var mesh3 = new THREE.Mesh( geometry3, materials );
  mesh3.rotateX(-Math.PI/2);
  mesh3.position.set(350,0,350);
  scene.add(mesh3);
  
  var directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0);
  directionalLight.position.set(400,200,400);
    scene.add(directionalLight);
    directionalLight.target = mesh3;
}
//交互事件
function initevent(){
  document.getElementById('cont').addEventListener("click",(event) => {
    event.stopPropagation();
    mouse.x = ((event.clientX-520) / renderer.domElement.clientWidth) * 2 - 1;
　　    mouse.y = - ((event.clientY-80) / renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    object = [];
    scene.children.forEach(child => {
　　　　  if (child.name == 'bbu' ||child.name == 'rru' || child.type == "Line2"  || child.name == 'jixiang' || child.name == 'galssDoor') {//根据需求判断哪些加入objects,也可以在生成object的时候push进objects
　　　　　　object.push(child)
　　　　}
    })
    var intersects = raycaster.intersectObjects(object,true);
    if(intersects.length>0){
      addSelectedObject( intersects[0].object );
      outlinePass.visibleEdgeColor.set( "#0081cf" );
      outlinePass.hiddenEdgeColor.set( "#0081cf" );
      outlinePass.edgeStrength = Number( 6 );
      outlinePass.selectedObjects = selectedObjects;
      if(intersects[0].object.name == 'line2'){
        intersects[0].object.material.color.set("#ff7200");
      }
      if(intersects[0].object.parent.name == 'galssDoor'){
        if(intersects[0].object.parent.rotation.y == 0){
          intersects[0].object.parent.rotateY(Math.PI/2);
        }else{
          intersects[0].object.parent.rotateY(-Math.PI/2);
        }
      }
      if(intersects[0].object.name == 'bbu'){
        if(intersects[0].object.bbudata){
          loadbbuInfo(intersects[0].object.bbudata,"bbu");
          $(".infoBox").show();
        }
        if(intersects[0].object.position.z == 405 || intersects[0].object.position.z == 0){
          intersects[0].object.position.z += 10; 
        }else{
          intersects[0].object.position.z -= 10; 
          $(".infoBox").hide();
        }
      }
      if(intersects[0].object.parent.name == 'rru'){
        loadbbuInfo(intersects[0].object.parent.rrudata,"rru");
        $(".infoBox").show();
      }
    }
  })
  $(".btnInfo span").unbind('click').on('click',function(){
    var label = $(this)[0].dataset.label;
    for(var i=0;i<scene.children.length;i++){
    if(scene.children[i].name == label){
      addSelectedObject( scene.children[i] );
      outlinePass.visibleEdgeColor.set( "#0081cf" );
      outlinePass.hiddenEdgeColor.set( "#0081cf" );
      outlinePass.edgeStrength = Number( 6 );
      outlinePass.selectedObjects = selectedObjects;
      var position = scene.children[i].position;
      controls.target = new THREE.Vector3(position.x, position.y, position.z);
      if(scene.children[i].name == "xinhaota"){
        scene.add(towerline);
        scene.add(towerline1);
        scene.add(towerline2);
      }
    }
    }
  })
  $(".container .close").unbind('click').on("click",function(event){
    event.stopPropagation();
   // clear();
    $("#cont").width("0");
  })
  $(".colsebtn").unbind('click').on("click",function(){
    $(".infoBox").hide();
  })
}
//加载bbu信息
function loadbbuInfo(data,type){
  var info = `
  <p><span class='label'>设备名称：</span>${data.name}！</p>
  <p><span class='label'>SN码：</span>${data.EQUIPMENT_COMPANY}！</p>
  <p><span class='label'>软件版本：</span>${data.BUSINESS_CENTER}</p>
  <p><span class='label'>设备状态：</span>${data.type}</p>
  <p><span class='label'>BBU生产日期：</span>${data.status}</p>
  <p><span class='label'>生产厂家：</span>${data.ENB_TYPE}</p>
  <p><span class='label'>入网日期：</span>${data.ENB_LEVEL}</p>
  `;
  var rruinfo =
  `
    <p><span class='label'>name：</span>${data.name}！</p>
    <p><span class='label'>id：</span>${data.id}！</p>
    <p><span class='label'>BUSINESS_CENTER：</span>${data.BUSINESS_CENTER}</p>
    <p><span class='label'>type：</span>${data.type}</p>
    <p><span class='label'>state：</span>${data.state}</p>
    <p><span class='label'>RRU_LOCATION：</span>${data.RRU_LOCATION}</p>
    <p><span class='label'>ENB_LEVEL：</span>${data.ENB_LEVEL}</p>
  `;
  if(type == "rru"){
    $(".infoBox div").html(rruinfo);
  }else{
    $(".infoBox div").html(info);
  }
  
}
function addSelectedObject( object ) {
  selectedObjects = [];
  selectedObjects.push( object );
}
function animate() {
  if(towerline.scale.x>10){
    towerline.scale.x = 1;
    towerline.scale.y = 1;
  }else{
    towerline.scale.x += 0.05;
    towerline.scale.y += 0.05;
  }
  if(towerline1.scale.x>10){
    towerline1.scale.x = 1;
    towerline1.scale.y = 1;
  }else{
    towerline1.scale.x += 0.05;
    towerline1.scale.y += 0.05;
  }
  if(towerline2.scale.x>10){
    towerline2.scale.x = 1;
    towerline2.scale.y = 1;
  }else{
    towerline2.scale.x += 0.05;
    towerline2.scale.y += 0.05;
  }
  stopAnimation = requestAnimationFrame( animate );
  controls.update();
  renderer.render( scene, camera );
  // composer.render();
}
function onWindowResize() {
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height );
  composer.setSize( width,height );
  effectFXAA.uniforms[ 'resolution' ].value.set( 1 / width, 1 / height );
}
//删除模型  释放内存
function clear(){
  cancelAnimationFrame(stopAnimation);
  renderer.dispose();
  renderer.forceContextLoss();
  renderer.domElement = null;
  renderer = null;
  if(scene.children.length>0){
    for(var i=0;i<scene.children.length;i++){
      var cuuobj = scene.children[i];
      if(cuuobj.children.length>0){
        for(var j = 0; j< cuuobj.children.length; j++){
          var obj = cuuobj.children[j];
          if(obj.children.length>0){
            for(var h = 0; h< obj.children.length; h++){
              if(obj.children[h].type == 'Mesh' || obj.children[h].type == 'line' && obj.children[h].type == 'Line2'){
                obj.children[h].geometry.dispose(); // 删除几何体
                if(obj.children[h].material instanceof Array){
                  for(var k=0;k<obj.children[h].material.length;k++){
                    var val = obj.children[h].material[k];
                    if(val.map){
                      val.map.dispose();
                    }
                    val.dispose(); // 删除材质
                  }
                }else{
                  if(obj.children[h].material.map){
                    obj.children[h].material.map.dispose();    // 删除纹理
                  }
                  obj.children[h].material.dispose(); // 删除材质
                }
              }
            }
          }else{
            if(obj.type == 'Mesh' || obj.type == 'line' && obj.type == 'Line2'){
              obj.geometry.dispose(); // 删除几何体
              if(obj.material instanceof Array){
                for(var k=0;k<obj.material.length;k++){
                  var val = obj.material[k];
                  if(val.map){
                    val.map.dispose();
                  }
                  val.dispose(); // 删除材质
                }
              }else{
                if(obj.material.map){
                  obj.material.map.dispose();
                }
                obj.material.dispose(); // 删除材质
              }
            }
          }
        }
      }else{
        if(cuuobj.type == 'Mesh' || cuuobj.type == 'line' && cuuobj.type == 'Line2'){
          cuuobj.geometry.dispose(); // 删除几何体
          if(cuuobj.material instanceof Array){
            for(var k=0;k<cuuobj.material.length;k++){
              var val = cuuobj.material[k];
              if(val.map){
                val.map.dispose();
              }
              val.dispose(); // 删除材质
            }
          }else{
            if(cuuobj.material.map){
              cuuobj.material.map.dispose();
            }
            cuuobj.material.dispose(); // 删除材质
          }
        }
      }
    }
    for(var i=0;i<scene.children.length;i++){
      var cuuobj = scene.children[i];
      scene.remove(cuuobj);
    }
  }
  scene = null;
}
function pageEvent(){
  $(".title span").on("click",function(){
    var index = $(this).index();
    $(this).parent().next().children().eq(index).addClass("on").siblings().removeClass("on");
    $(this).addClass("on").siblings().removeClass("on");
    if($(this).html() == "性能信息"){
      setTimeout(function(){
        $(".natureInfo .one b").each(function(){
          var val = 1-$(this).html()/100;
          $(this).html("");
          $(this).parent().prev().css({transform:"scale("+val+")"});
          var a=0;
          var timer=setInterval(() => {
            a++;
            $(this).html(a);
            var b=parseInt((1-val)*100);
            if(a == b){
              clearInterval(timer);
            }
          }, 30);
        })
      },0)
    }else{
      $(".natureInfo .one b").each(function(){
        $(this).parent().prev().css({transform:"scale(1)"});
      })
    }
  })
  $(".opreate span").on("click",function(){
    var index = $(this).index();
    $(this).parent().next().next().children().eq(index).addClass("on").siblings().removeClass("on");
    $(this).addClass("on").siblings().removeClass("on");
  })
  $(".bottom").flexslider({animation:"slide",slideshow:false,controlNav:false,itemWidth:246,itemMargin:24,prevText:"<",nextText:">",move:1});
  $(".showModel").on("click",function(){
    $('.main .right').hide();
    $('.main .rightcopy').show();
    initCharts();
  })
  $("#closeCopy,#closeGoods").on("click",function(){
    $('.main .right').show();
    $('.main .rightcopy').hide();
    $('.main .goods').hide();
  })
  $(".meeting").on("click",function(){
    $(".videomeet").show();
  })
  $(".videomeet>span").on("click",function(){
    $(".videomeet").hide();
  })
  $(".detailCon .diff span").on("click",function(){
    var val=$(this)[0].dataset.aff;
    var html='';
    for(var i=0;i<affdata[val].length;i++){
      html+=`<li>
      <span class="label">${affdata[val][i].label}：</span>
      <span class="value">${affdata[val][i].value}</span>
    </li>`
    }
    $('.detailInfo ul').html(html);
    $(this).addClass('on').siblings().removeClass('on');
  })
  $(".detailInfo h4 a").on("click",function(){
    var name = $(this).prev().html();
    $(".rightcopy .title span").eq(0).addClass("on").next().removeClass("on");
    $(".chartContainer>div").eq(0).addClass("on").next().removeClass("on");
    $(".chartContainer>div").eq(0).children('h4').html("小区名称："+name);
  })
  $(".opcenter>div").on("mouseenter",function(){
    $(this).children('.evlist').show();
  })
  $(".opcenter>div").on("mouseleave",function(){
    $(this).children('.evlist').hide();
  })
  $('.defeatDetail').on("click",function(){
    $(this).parent().parent().parent().removeClass('on').next().next().addClass('on');
    $(this).parent().parent().parent().parent().prev().children().eq(2).addClass('on').siblings().removeClass("on");
  })
  initProgres();
}
export {load,pageEvent} 
