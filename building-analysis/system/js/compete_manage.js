var competeManage;
$(function() {
  competeManage = new CompeteManageFn();
  competeManage.initSearchForm();
  competeManage.initMap();
  competeManage.loadDataTable();
});

//商综体管理对象
function CompeteManageFn() {
  this.serverUrl = Common.url_server_root;
  this.search = {busi_name: ''};
  this.layers = {};
  this.overlays = {};
  this.overlays.markerBuild = [];
  this.layui = layui;
  this.layui.config({
    base: '../plugins/layui/',
  })
  this.layui.use(['table', 'form', 'layer', 'code']);
};

//初始化搜索表单
CompeteManageFn.prototype.initSearchForm = function() {
  var _this = this;
  var form = _this.layui.form;
  //监听搜索按钮提交
  form.on('submit(search-btn)', function(data){
    _this.search.busi_name = data.field.busi_name;
    _this.loadDataTable();
    return false;
  });
};

//加载数据表格
CompeteManageFn.prototype.loadDataTable = function() {
  var _this = this;
  var table = _this.layui.table;
  var form = _this.layui.form;
  var transfer  = _this.layui.transfer;
  var layer  = _this.layui.layer;
  var cols = [
    {field: 'busi_id', title: '商综体ID', align: 'center'}
    ,{field: 'busi_name', title: '商综体名称', sort: true, event: 'collapse',
    templet: function(d) {
        return '<div style="position: relative;\n' 
        + '    padding: 0 10px 0 20px;">' + d.busi_name 
        + '<i style="left: 0px;" lay-tips="展开" class="layui-icon layui-colla-icon layui-icon-right"></i></div>'
    }
    }
    ,{field: 'address', title: '商综体地址'}
    ,{field: 'lon', title: '经度'}
    ,{field: 'lat', title: '纬度'}
    ,{field: 'distance', title: '距离', align: 'center', templet: function(val) {
      return _this.formatDistance(val.distance);
    }}
    ,{field: 'remarks', title: '备注', templet: function(val) {
      return _this.formatText(val.remarks);
    }}
    ,{field: 'option', title: '操作', width: '25%', align: 'center', templet: function(val) {
      var html = '';
      html += '<button type="button" class="layui-btn layui-btn-sm"  lay-event="edit">编辑竞争项目</button>';
      return html;
    }}
  ];
  table.render({
    elem: '#busi_data',
    icon_key: 'title',// 必须
    top_value: 0,
    height: 'full-180',
    cellMinWidth: 80,
    limit:30,
    page: true,
    url: _this.serverUrl + '/busi/queryCompetitive?busi_name='+_this.search.busi_name,
    cols: [cols]
  });

  table.on('tool(busi_data)', function (obj) {
    var busi_id = obj.data.busi_id;
    if(obj.event === 'edit') {//新增竞争项目
      var dataArr = [];
      var valueArr = [];
      $.ajax({
        async: false,
        url: _this.serverUrl + '/busi/queryCompetitors',
        method: 'GET',
        data: {busi_id: busi_id},
        success: function(res) {
          if(res && res.code == 0 && res.data && res.data.length > 0){
            for (var i = 0; i < res.data.length; i++) {
              var el = res.data[i];
              valueArr.push(el.busi_id);
            }
          }

          if(res && res.code != 0){
            layer.alert(res.msg, {icon: 5});
          }
        }
      });

      $.ajax({
        async: false,
        url: _this.serverUrl + '/busi/query',
        method: 'GET',
        success: function(res) {
          if(res && res.code == 0 && res.data && res.data.length > 0){
            for (var i = 0; i < res.data.length; i++) {
              var el = res.data[i];
              el.value = el.busi_id;
              el.title = el.busi_name;
              if(el.value === busi_id) {
                el.disabled = true;
              }
              dataArr.push(el);
            }
          }

          if(res && res.code != 0){
            layer.alert(res.msg, {icon: 5});
          }
        }
      });

      transfer.render({
        elem: '#edit_transfer'
        ,id: 'edit_transfer' //定义唯一索引
        ,title: ['所有商综体', '选中商综体']  //自定义标题
        ,showSearch: true
        ,height: 410 //定义高度
        ,data: dataArr
        ,value: valueArr
        ,onchange: function(obj, index){
          var getData = transfer.getData('edit_transfer'); 
          _this.loadCompleteMarket(getData);
        }
      });

      var index = layer.open({
        //layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        type: 1
        ,title: "编辑竞争项目"
        ,area: '840px'
        ,shade: 0.8
        ,moveType: 1
        ,content: $("#edit_compete")
        ,btn: ['确定', '取消']
        ,btnAlign: 'c'
        ,yes: function() {
          var getData = transfer.getData('edit_transfer'); 
          var busi_ids = [];
          for (let i = 0; i < getData.length; i++) {
            const el = getData[i];
            busi_ids.push(el.value);
          }
        
          $.ajax({
            async: false,
            url: _this.serverUrl + '/busi/addCompetitors',
            // traditional:true,//用传统方式序列化数据
            method: 'POST',
            data: {
              busi_id: busi_id,
              competitor_busi_ids: busi_ids.join(',')
            },
            success: function(res) {
              if(res && res.code == 0){
                if(document.getElementById('collapse_table_' + busi_id)) {
                  _this.layui.table.reload('collapse_table_' + busi_id);//更新表单
                }
                layer.alert('修改成功，数据明日刷新！', {icon: 7});
              }

              if(res && res.code != 0){
                layer.alert(res.msg, {icon: 5});
              }
            }
          });
          layer.close(index);
        }
        ,btn2: function() {
          layer.close(index);
        }
      });
      _this.map.updateSize();
      _this.setCenter(obj.data.lon,  obj.data.lat);
      var getData = transfer.getData('edit_transfer'); 
      _this.loadCompleteMarket(getData);
    } else if(obj.event === 'collapse') {//打开竞对项目
      var trObj = layui.$(this).parent('tr'); //当前行
      var accordion = true //开启手风琴，那么在进行折叠操作时，始终只会展现当前展开的表格。
      var content = '<table></table>' //内容
      collapseTable({
        elem: trObj,
        accordion: accordion,
        content: content,
        success: function(trObjChildren, index) { //成功回调函数
          //trObjChildren 展开tr层DOM
          //index 当前层索引
          var tableId = 'collapse_table_' + busi_id;
          trObjChildren.find('table').attr("id", tableId);
          trObjChildren.find('table').attr("lay-filter", tableId);
          table.render({
              elem: "#" + tableId,
              url: _this.serverUrl + '/busi/queryCompetitors?busi_id='+busi_id,
              limit: 3,
              cellMinWidth: 80,
              cols: [[
                {field: 'busi_id', title: '商综体ID', align: 'center'}
                ,{field: 'busi_name', title: '商综体名称', sort: true}
                ,{field: 'address', title: '商综体地址'}
                ,{field: 'lon', title: '经度'}
                ,{field: 'lat', title: '纬度'}
                ,{field: 'distance', title: '距离', align: 'center', templet: function(val) {
                  return _this.formatDistance(val.distance);
                }}
                ,{field: 'remarks', title: '备注', templet: function(val) {
                  return _this.formatText(val.remarks);
                }}
                ,{field: 'option', title: '操作', width: '25%', align: 'center', templet: function(val) {
                  var html = '';
                  html += '<button type="button" class="layui-btn layui-btn-sm"  lay-event="del">删除</button>';
                  return html;
                }}
              ]]
          });

          table.on('tool('+tableId+')', function (obj) {
            var id = obj.data.id;
            if(obj.event === 'del') {//删除
              layer.confirm('删除后数据将无法恢复，是否继续？', {icon: 3, title:'提示信息'}, function(index){
                $.ajax({
                  url: _this.serverUrl + '/busi/delCompetitor',
                  method: 'POST',
                  data: {id: id},
                  success: function(res) {
                    if(res && res.code == 0){
                      _this.layui.table.reload(tableId);//更新表单
                      layer.alert('删除成功，数据明日刷新！', {icon: 7});
                    }

                    if(res && res.code != 0){
                      layer.alert(res.msg, {icon: 5});
                    }
                  }
                });
                layer.close(index);
              });
            }
          });
        }
      });
    }
  });

  //扩展表
  function collapseTable(options) {
    var trObj = options.elem;
    if (!trObj) return;
    var accordion = options.accordion,
    success = options.success,
    content = options.content || '';
    var tableView = trObj.parents('.layui-table-view'); //当前表格视图
    var id = tableView.attr('lay-id'); //当前表格标识
    var index = trObj.data('index'); //当前行索引
    var leftTr = tableView.find('.layui-table-fixed.layui-table-fixed-l tr[data-index="' + index + '"]'); //左侧当前固定行
    var rightTr = tableView.find('.layui-table-fixed.layui-table-fixed-r tr[data-index="' + index + '"]'); //右侧当前固定行
    var colspan = trObj.find('td').length; //获取合并长度
    var trObjChildren = trObj.next(); //展开行Dom
    var indexChildren = id + '-' + index + '-children'; //展开行索引
    var leftTrChildren = tableView.find('.layui-table-fixed.layui-table-fixed-l tr[data-index="' + indexChildren + '"]'); //左侧展开固定行
    var rightTrChildren = tableView.find('.layui-table-fixed.layui-table-fixed-r tr[data-index="' + indexChildren + '"]'); //右侧展开固定行
    var lw = leftTr.width() + 15; //左宽
    var rw = rightTr.width() + 15; //右宽
    //不存在就创建展开行
    if (trObjChildren.data('index') != indexChildren) {
        //装载HTML元素
        var tr = '<tr data-index="' + indexChildren + '"><td colspan="' + colspan + '"><div style="height: auto;padding-left:' + lw + 'px;padding-right:' + rw + 'px" class="layui-table-cell">' + content + '</div></td></tr>';
        trObjChildren = trObj.after(tr).next().hide(); //隐藏展开行
        var fixTr = '<tr data-index="' + indexChildren + '"></tr>';//固定行
        leftTrChildren = leftTr.after(fixTr).next().hide(); //左固定
        rightTrChildren = rightTr.after(fixTr).next().hide(); //右固定
    }
    //展开|折叠箭头图标
    trObj.find('td[lay-event="collapse"] i.layui-colla-icon').toggleClass("layui-icon-right layui-icon-down");
    //显示|隐藏展开行
    trObjChildren.toggle();
    //开启手风琴折叠和折叠箭头
    if (accordion) {
        trObj.siblings().find('td[lay-event="collapse"] i.layui-colla-icon').removeClass("layui-icon-down").addClass("layui-icon-right");
        trObjChildren.siblings('[data-index$="-children"]').hide(); //展开
        rightTrChildren.siblings('[data-index$="-children"]').hide(); //左固定
        leftTrChildren.siblings('[data-index$="-children"]').hide(); //右固定
    }
    success(trObjChildren, indexChildren); //回调函数
    heightChildren = trObjChildren.height(); //展开高度固定
    rightTrChildren.height(heightChildren + 115).toggle(); //左固定
    leftTrChildren.height(heightChildren + 115).toggle(); //右固定
  }
}

//格式化文本
CompeteManageFn.prototype.formatText = function (text) {
  if(!text || text == 'undefined' || text == 'null'){
    return '--';
  } else {
      text = text+'';
      return text.trim();
  }
};

//格式化距离
CompeteManageFn.prototype.formatDistance = function (text) {
  if(!text || text == 'undefined' || text == 'null'){
    return '--';
  } else {
    text = Number(text);
    if(text < 1000) {
      text = text + '米';
    } else {
      text = (text/1000).toFixed(2) + '公里';
    }
    return text.trim();
  }
};

//格式化文本
CompeteManageFn.prototype.formatStr = function (text) {
  if(!text || text == 'undefined' || text == 'null'){
      return '';
  } else {
      text = text+'';
      return text.trim();
  }
};


//初始化地图
CompeteManageFn.prototype.initMap = function() {
  var _this = this;
  if(!_this.map){
    var _this = this;
    var center = ol.proj.transform([116.45642531259954, 39.892976756646576], 'EPSG:4326', 'EPSG:3857')
    var extent = ol.extent.boundingExtent([[73.66,3.86],[135.05,53.55]]);
    extent =  ol.proj.transformExtent(extent, 'EPSG:4326', 'EPSG:3857');
    var map_server = Common.map_server;//地图服务地址
    var viewer = new ol.View({
      center: center,
      zoom: 16,
      projection: "EPSG:3857",
      minZoom: 4,
      maxZoom: 18,
      extent: extent//限制范围
    });

    var layers = [];
    var baseLayer = new ol.layer.Image({
      source: new ol.source.Raster({
        sources: 
        [
          new ol.source.XYZ({
            url: map_server[0].url,
            minZoom: map_server[0].minimumLevel||1,
            maxZoom: map_server[0].maximumLevel||18,
            crossOrigin: 'anonymous',
            transition: 0,
            logo: 'DIC',
            // tileLoadFunction: function(imageTile, src) {
            //     imageTile.getImage().src = src;
            // }
          })
        ],
        operationType: 'pixel',
        operation: function (pixels, data) {
          var pixel = pixels[0];
          pixel[0] = 10;
          pixel[1] = 255 - pixel[1];
          pixel[2] = 255 - pixel[2] + 20;
          return pixel;
        }
      })
    });
    layers.push(baseLayer);
    _this.map = new ol.Map({
      view: viewer,
      layers: layers,
      target: 'map',
      controls : ol.control.defaults({
        attribution : false,
        zoom : false,
        zoomOptions : {
          className : "myzoom"
        }
      })
    });
  }
}

CompeteManageFn.prototype.setCenter = function(lon, lat) {
  lon = Number(lon);
  lat = Number(lat);
  if(73 < lon && lon < 136 && 3 < lat && lat < 54){
    var center = wgs84togcj02(lon, lat);
    center = ol.proj.transform(center, 'EPSG:4326', 'EPSG:3857');
    this.map.getView().animate({center: center});
  }
}


//加载竞争商场
CompeteManageFn.prototype.loadCompleteMarket = function (data) {
  var _this = this;

  if(!_this.layers.marketBound){
      _this.layers.marketBound = new ol.layer.Vector({
          source: new ol.source.Vector(),
          zIndex: 12,
          style: function() {
              var zoom  = _this.map.getView().getZoom();
              var width = 1.0;
              var dashLen = 10;
              if(zoom > 15) {
                  width = 5.0;
                  dashLen = 10;
              } else if(zoom > 13) {
                  width = 2.0;
                  dashLen = 5;
              } else {
                  dashLen = 1;
                  width = 1.0;
              }
              return new ol.style.Style({
                  stroke: new ol.style.Stroke({
                      lineDash: [dashLen,dashLen],
                      color: '#ffcc33',
                      width: width
                  })
              });
          }
      });
      _this.map.addLayer(_this.layers.marketBound);
  }

  var source = _this.layers.marketBound.getSource();
  source.clear();

  if(_this.layers.flashMaker) {
      _this.layers.flashMaker.destroy();
      _this.layers.flashMaker = undefined;
  }

  if(_this.overlays.markerBuild.length > 1){
      _this.overlays.markerBuild.forEach(val => {
          _this.map.removeOverlay(val);
      });
      _this.overlays.markerBuild = [];
  }

  if(data.length == 0) return;

  var extentXMin,extentXMax,extentYMin,extentYMax;
  var format = new ol.format.WKT();
  var flashMakerData = [];
  data.forEach(val => {
    var center = wgs84togcj02(val.lon, val.lat);
    if(extentXMin) {
      extentXMin = Math.min(center[0], extentXMin);
    } else {
      extentXMin = center[0];
    }
    if(extentXMax) {
      extentXMax = Math.max(center[0], extentXMax);
    } else {
      extentXMax = center[0];
    }
    if(extentYMin) {
      extentYMin = Math.min(center[1], extentYMin);
    } else {
      extentYMin = center[1];
    }
    if(extentYMax) {
      extentYMax = Math.max(center[1], extentYMax);
    } else {
      extentYMax = center[1];
    }
    var container = document.createElement("div");
    container.className = "popup-count popup-marker-building";
    // container.style.display = (zoom>=13 && _this.show.circleBound)?'block':'none';
    var marker = document.createElement("div");
    marker.className = "popup-count-marker";
    marker.innerText = val.title;
    container.appendChild(marker);
    var centerMercator = ol.proj.transform(center, 'EPSG:4326', 'EPSG:3857');
    var overlay = new ol.Overlay({
      element: container,
      autoPan: true,
      position: centerMercator,
      positioning: 'bottom-left',
      offset: [-17, -5],//偏移量设置
    });
    _this.map.addOverlay(overlay);
    _this.overlays.markerBuild.push(overlay);

    flashMakerData.push({
      name: val.title,
      location: centerMercator,
      color: '#FF0000',
      type: 'circle',
    });

    var wkt = val.wkt;
    if(wkt) {
      wkt = wkt.trim();
      if(wkt != '') {
        var feature = format.readFeature(wkt, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });
        feature = wgs84togcj02OfFeature3857(feature);
        feature.setProperties({
            type: 'bound',
            name: val.name,
            center: [val.longitude, val.latitude],
            desc: val.desc,
        });
        source.addFeature(feature);
      }
    }
  });


  var options = {
      show: true,
      minZoom: 3,
      maxZoom: 18,
      data: flashMakerData
  }
  _this.layers.flashMaker = new FlashMarker(_this.map, options);

  var extent = ol.extent.boundingExtent([[extentXMin, extentYMin],[extentXMax, extentYMax]]);
  extent =  ol.proj.transformExtent(extent, 'EPSG:4326', 'EPSG:3857');
  _this.map.getView().fit(extent, _this.map.getSize());
};