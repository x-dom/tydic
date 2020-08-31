
var busiManage;
$(function() {
  busiManage = new BusiManageFn();
  busiManage.initFormVerify();
  busiManage.initSearchForm();
  busiManage.initMap();
  busiManage.loadDataTable();
  busiManage.bindBusiAdd();
});

//商综体管理对象
function BusiManageFn() {
  this.serverUrl = Common.url_server_root;
  this.search = {busi_name: ''};
  this.layui = layui;
  this.layui.use(['form', 'table', 'transfer', 'layer']);
};

//初始化表单校验规则
BusiManageFn.prototype.initFormVerify = function() {
  var form = this.layui.form;
  form.verify({
    // coordinate:[/^[0-9]{1,4}([.][0-9]{1,5})?$/,'请输入正确的经纬度坐标'],
    coordinate:[/[0-9]*(\.[0-9]*|bai[eE][+-][0-9]*)$/,'请输入正确的经纬度坐标'],
  });

  if($.cookie('role_id') == -1) {
    $('#busi_add').show();
  } else {
    $('#busi_add').hide();
  }
};

//初始化搜索表单
BusiManageFn.prototype.initSearchForm = function() {
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
BusiManageFn.prototype.loadDataTable = function() {
  var _this = this;
  var table = _this.layui.table;
  var form = _this.layui.form;
  var transfer  = _this.layui.transfer;
  var layer  = _this.layui.layer;
  var cols = [
    {field: 'busi_id', title: '商综体ID', align: 'center'}
    ,{field: 'busi_name', title: '商综体名称', sort: true}
    ,{field: 'address', title: '商综体地址'}
    ,{field: 'lon', title: '经度'}
    ,{field: 'lat', title: '纬度'}
    ,{field: 'create_time', title: '创建时间', templet: function(val) {
      return _this.formatText(val.create_time);
    }}
    ,{field: 'remarks', title: '备注', templet: function(val) {
      return _this.formatText(val.remarks);
    }}
    ,{field: 'option', title: '操作', width: '25%', align: 'center', templet: function(val) {
      var html = '';
      html += '<button type="button" class="layui-btn layui-btn-sm"  lay-event="edit">编辑</button>';
      if($.cookie('role_id') == -1) {
        html += '<button type="button" class="layui-btn layui-btn-sm"  lay-event="del">删除</button>';
      }
      html += '<button type="button" class="layui-btn layui-btn-sm"  lay-event="manager">添加管理员</button>';
      html += '<button type="button" class="layui-btn layui-btn-sm"  lay-event="user">添加用户</button>';
      if(val.flag == 1) {
        html += '<button type="button" class="layui-btn layui-btn-sm"  lay-event="compete">停用竞争项目</button>';
      } else {
        html += '<button type="button" class="layui-btn layui-btn-sm"  lay-event="compete">启用竞争项目</button>';
      }
      return html;
    }}
  ];
  table.render({
    elem: '#busi_data',
    height: 'full-180',
    cellMinWidth: 80,
    limit:30,
    page: true,
    url: _this.serverUrl + '/busi/query?busi_name='+_this.search.busi_name,
    cols: [cols]
  });

  //监听行单击事件（双击事件为：rowDouble）
  table.on('row(busi_data)', function(obj){
    //标注选中样式
    // obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
  });
  table.on('tool(busi_data)', function (obj) {
    var busi_id = obj.data.busi_id;
    if(obj.event == 'edit') {//编辑
      var index = layer.open({
        //layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        type: 1
        ,title: "编辑商综体("+obj.data.busi_name+")"
        ,area: '900px;'
        ,shade: 0.8
        ,moveType: 1
        ,content: $("#edit_form")//引用的弹出层的页面层的方式加载修改界面表单
      });
      _this.map.updateSize()
      _this.addMapMarker(obj.data.lon, obj.data.lat);
      _this.addBound(obj.data.wkt);
      form.render();
      document.getElementById("edit_form").reset();
      form.val('edit_form', obj.data);
      form.on('submit(edit-btn)', function(massage) {
        var params = massage.field;
        $.ajax({
          url: _this.serverUrl + '/busi/edit',
          method: 'post',
          data: params,
          success: function(res) {
            if(res && res.code == 0){
              _this.layui.table.reload('busi_data');//更新表单
            }

            if(res && res.code != 0){
              layer.alert(res.msg, {icon: 5});
            }
          }
        });
        layer.close(index);
        return false;
      });
    } else if(obj.event == 'del') {//删除
      layer.confirm('删除后数据将无法恢复，是否继续？', {icon: 3, title:'提示信息'}, function(index){
        $.ajax({
          url: _this.serverUrl + '/busi/del',
          method: 'GET',
          data: {busi_id: busi_id},
          success: function(res) {
            if(res && res.code == 0){
              _this.layui.table.reload('busi_data');//更新表单
              layer.alert('删除成功，数据明日刷新！', {icon: 7});
            }

            if(res && res.code != 0){
              layer.alert(res.msg, {icon: 5});
            }
          }
        });
        layer.close(index);
      });
    } else if(obj.event == 'manager') {//添加管理员
      var dataArr = [];
      var valueArr = [];
      $.ajax({
        async: false,
        url: _this.serverUrl + '/busi/queryAdmins',
        method: 'GET',
        data: {busi_id: busi_id},
        success: function(res) {
          if(res && res.code == 0 && res.data && res.data.length > 0){
            for (var i = 0; i < res.data.length; i++) {
              var el = res.data[i];
              valueArr.push(el.user_id);
            }
          }

          if(res && res.code != 0){
            layer.alert(res.msg, {icon: 5});
          }
        }
      });

      $.ajax({
        async: false,
        url: _this.serverUrl + '/user/query',
        method: 'GET',
        success: function(res) {
          if(res && res.code == 0 && res.data && res.data.length > 0){
            for (var i = 0; i < res.data.length; i++) {
              var el = res.data[i];
              dataArr.push({value: el.user_id, title: el.user_name});
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
        ,title: ['所有用户', '选中用户']  //自定义标题
        ,showSearch: true
        ,height: 410 //定义高度
        ,data: dataArr
        ,value: valueArr
        ,onchange: function(obj, index){
        }
      })

      layer.open({
        //layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        type: 1
        ,title: "添加管理员"
        ,area: '510px'
        ,shade: 0.8
        ,moveType: 1
        ,content: $("#edit_transfer")
        ,btn: ['确定', '取消']
        ,btnAlign: 'c'
        ,yes: function() {
          var getData = transfer.getData('edit_transfer'); 
          var user_ids = [];
          for (let i = 0; i < getData.length; i++) {
            const el = getData[i];
            user_ids.push(el.value);
          }

          $.ajax({
            async: false,
            url: _this.serverUrl + '/busi/setAdmins',
            // traditional:true,//用传统方式序列化数据
            method: 'POST',
            data: {
              busi_id: busi_id,
              user_ids: user_ids.join(',')
            },
            success: function(res) {
              if(res && res.code == 0){
                _this.layui.table.reload('busi_data');//更新表单
              }

              if(res && res.code != 0){
                layer.alert(res.msg, {icon: 5});
              }
            }
          });
          layer.closeAll();
        }
        ,btn2: function() {
          layer.closeAll();
        }
      });
    } else if(obj.event == 'user') {//添加用户
      var dataArr = [];
      var valueArr = [];
      $.ajax({
        async: false,
        url: _this.serverUrl + '/busi/queryUsers',
        method: 'GET',
        data: {busi_id: busi_id},
        success: function(res) {
          if(res && res.code == 0 && res.data && res.data.length > 0){
            for (var i = 0; i < res.data.length; i++) {
              var el = res.data[i];
              valueArr.push(el.user_id);
            }
          }

          if(res && res.code != 0){
            layer.alert(res.msg, {icon: 5});
          }
        }
      });

      $.ajax({
        async: false,
        url: _this.serverUrl + '/user/query',
        method: 'GET',
        success: function(res) {
          if(res && res.code == 0 && res.data && res.data.length > 0){
            for (var i = 0; i < res.data.length; i++) {
              var el = res.data[i];
              dataArr.push({value: el.user_id, title: el.user_name});
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
        ,title: ['所有用户', '选中用户']  //自定义标题
        ,showSearch: true
        ,height: 410 //定义高度
        ,data: dataArr
        ,value: valueArr
        ,onchange: function(obj, index){
        }
      })

      layer.open({
        //layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        type: 1
        ,title: "添加用户"
        ,area: '510px'
        ,shade: 0.8
        ,moveType: 1
        ,content: $("#edit_transfer")
        ,btn: ['确定', '取消']
        ,btnAlign: 'c'
        ,yes: function() {
          var getData = transfer.getData('edit_transfer'); 
          var user_ids = [];
          for (let i = 0; i < getData.length; i++) {
            const el = getData[i];
            user_ids.push(el.value);
          }

          $.ajax({
            async: false,
            url: _this.serverUrl + '/busi/setUsers',
            // traditional:true,//用传统方式序列化数据
            method: 'POST',
            data: {
              busi_id: busi_id,
              user_ids: user_ids.join(',')
            },
            success: function(res) {
              if(res && res.code == 0){
                _this.layui.table.reload('busi_data');//更新表单
              }

              if(res && res.code != 0){
                layer.alert(res.msg, {icon: 5});
              }
            }
          });
          layer.closeAll();
        }
        ,btn2: function() {
          layer.closeAll();
        }
      });
    } else if(obj.event == 'compete') {//添加竞争项目
      var params = obj.data;
      params.flag = params.flag==1?0:1;
      $.ajax({
        url: _this.serverUrl + '/busi/edit',
        method: 'post',
        data: params,
        success: function(res) {
          if(res && res.code == 0){
            _this.layui.table.reload('busi_data');//更新表单
          }

          if(res && res.code != 0){
            layer.alert(res.msg, {icon: 5});
          }
        }
      });
    }
  });
}

//绑定商综体添加
BusiManageFn.prototype.bindBusiAdd = function () {
  var _this = this;
  var form = _this.layui.form;
  $("#busi_add").unbind().bind('click', function() {
    var index = layer.open({
      //layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
      type: 1
      ,title: "新增商综体"
      ,area: '900px;'
      ,shade: 0.8
      ,moveType: 1
      ,content: $("#edit_form")//引用的弹出层的页面层的方式加载修改界面表单
    });
    _this.map.updateSize();
    _this.features.clear();
    _this.addMapMarker();
    form.render();
    document.getElementById("edit_form").reset();
    form.on('submit(edit-btn)', function(massage) {
      var params = massage.field;
      $.ajax({
        url: _this.serverUrl + '/busi/add',
        method: 'post',
        data: params,
        success: function(res) {
          if(res && res.code == 0){
            _this.layui.table.reload('busi_data');//更新表单
            layer.alert('新增成功，数据明日刷新！', {icon: 7});
          }

          if(res && res.code != 0){
            layer.alert(res.msg, {icon: 5});
          }
        }
      });
      layer.close(index);
      return false;
    });
  });
};

//格式化文本
BusiManageFn.prototype.formatText = function (text) {
  if(!text || text == 'undefined' || text == 'null'){
    return '--';
  } else {
      text = text+'';
      return text.trim();
  }
};

//格式化文本
BusiManageFn.prototype.formatStr = function (text) {
  if(!text || text == 'undefined' || text == 'null'){
      return '';
  } else {
      text = text+'';
      return text.trim();
  }
};

//初始化地图
BusiManageFn.prototype.initMap = function() {
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

    _this.isPosition = false;
    _this.isPolygon = false;
    _this.features = new ol.Collection();
    _this.wktFomat = new ol.format.WKT();
    _this.map.on("click", function(evt) {
      var position = evt.coordinate;
      position = ol.proj.transform(position, 'EPSG:3857', 'EPSG:4326');
      position = gcj02towgs84(position[0], position[1]);

      if(_this.isPosition) {
        _this.addMapMarker(position[0], position[1]);
      }
    });

    _this.featureOverlay = new ol.layer.Vector({
      source: new ol.source.Vector({features: _this.features}),
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
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          stroke: new ol.style.Stroke({
            lineDash: [dashLen,dashLen],
            color: '#ffcc33',
            width: width
          }),
          image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
              color: '#ffcc33'
            })
          })
        })
      }
    });
    _this.featureOverlay.setMap(_this.map);

    function editEnd(evt) {
      var feature;
      if(evt.type == 'modifyend') {
        feature = evt.features.getArray()[0];
      } else if(evt.type == 'drawend') {
        feature = evt.feature;
      }

      feature = gcj02towgs84OfFeature3857(feature);
      var wkt = _this.wktFomat.writeFeature(feature, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      });
      _this.layui.form.val('edit_form', {wkt: wkt});
      _this.addBound(wkt);
    }

    var modify = new ol.interaction.Modify({
      features: _this.features,
      deleteCondition: function(event) {
        return ol.events.condition.shiftKeyOnly(event) &&
            ol.events.condition.singleClick(event);
      }
    });
    modify.on("modifyend", editEnd);
    _this.map.addInteraction(modify);

    var draw; // global so we can remove it later
    function addInteraction() {
      draw = new ol.interaction.Draw({
        features: _this.features,
        type: 'Polygon'
      });
      _this.map.addInteraction(draw);
      draw.on("drawstart", function(evt) {
        _this.features.clear();
      });
      draw.on("drawend", editEnd);
    }

    $('.map-postion').unbind().bind('click', function () {
      var lon = $('#edit_form input[name=lon]').val();
      var lat = $('#edit_form input[name=lat]').val();
      _this.addMapMarker(lon, lat);
    });

    $('#map_postion_btn').unbind().bind('click', function(){
      $('#map_cancel_btn').click();
      if($(this).hasClass('select')) {
        _this.isPosition = false;
      } else {
        $(this).addClass('select');
        _this.isPosition = true;
      }
    });
    
    $('#map_polygon_btn').unbind().bind('click', function(){
      $('#map_cancel_btn').click();
      if($(this).hasClass('select')) {
        _this.isPolygon = false;
      } else {
        $(this).addClass('select');
        _this.isPolygon = true;
        _this.map.removeInteraction(draw);
        _this.map.addInteraction(modify);
        addInteraction();
      }
    });

    $('#map_cancel_btn').unbind().bind('click', function(){
      $('.map-btn').removeClass('select');
      _this.isPosition = false;
      _this.isPolygon = false;
      _this.map.removeInteraction(draw);
      _this.map.removeInteraction(modify);
    });
  }
}

BusiManageFn.prototype.setCenter = function(lon, lat) {
  var center = wgs84togcj02(lon, lat);
  center = ol.proj.transform(center, 'EPSG:4326', 'EPSG:3857');
  this.map.getView().animate({center: center});
}

//添加标记
BusiManageFn.prototype.addMapMarker = function(lon, lat) {
  var _this = this;

  if(!_this.markerLayer) {
    var style = function(feature) {
      return new ol.style.Style({
        image: new ol.style.Icon({
          src: 'image/position1.png'
        }),
      });
    };
    _this.markerLayer = new ol.layer.Vector({
      source: new ol.source.Vector(),
      zIndex: 12,
      opacity: 0.8,
      style: style
    });
    _this.map.addLayer(_this.markerLayer);
  }
  var source = _this.markerLayer.getSource();
  source.clear();

  lon = Number(lon);
  lat = Number(lat);
  if(73 < lon && lon < 136 && 3 < lat && lat < 54){
    _this.setCenter(lon, lat);
    _this.layui.form.val('edit_form', {lon: lon, lat: lat});
    var coordinate = wgs84togcj02(lon, lat);
    coordinate = ol.proj.transform(coordinate,'EPSG:4326', 'EPSG:3857');
    var feature = new ol.Feature({
      geometry: new ol.geom.Point(coordinate)
    });
    source.addFeature(feature);
  }
}

//添加边界
BusiManageFn.prototype.addBound = function(wkt) {
  var _this = this;
  _this.features.clear();
  if(wkt) {
    wkt = wkt.trim();
    if(wkt != '') {
      var feature = _this.wktFomat.readFeature(wkt, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
      });
      feature = wgs84togcj02OfFeature3857(feature);
      _this.features.push(feature);
    }
  }
}