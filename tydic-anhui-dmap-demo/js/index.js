;
$(function(){
    gridDemo.initGridTable();
    gridDemo.initBuildingTable(gridDemo.filterBuildingData(data.dm_gridunit_rsrp[0].gridunit_id));
   
    gridDemo.blindEvents();
});
function GridFn(){

}
function GridDataFn(){
    this.gridTableOpen = true;
    this.buildingTableOpen = true;
    this.sectorTableOpen = false;
    this.gridMappingBuilding = {};
}
var gridDemo = new GridFn();
var gridDataDemo = new GridDataFn();

/**
 * 添加楼层信息框
 */
function addFloorWindow(data){
    console.log(data);
    var rooms = self.data.dm_room_rsrp.filter(function(item,index){return item.building_id == data.building_id && item.floor_id == data.floor_id});
    var html = "<div class='gis-tip-box' id='gis-tip-box'>\
    <h3>"+data.building_name+"-"+data.floor_id+"层</h3>\
    <svg t=\"1570874255760\" class=\"icon\" viewBox=\"0 0 1024 1024\" p-id=\"3597\" width=\"16\" height=\"16\">\
        <path style=\"fill:#666;\" d=\"M512 620.544l253.3376 253.3376a76.6976 76.6976 0 1 0 108.544-108.544L620.6464 512l253.2352-253.3376a76.6976 76.6976 0 1 0-108.544-108.544L512 403.3536 258.6624 150.1184a76.6976 76.6976 0 1 0-108.544 108.544L403.3536 512 150.1184 765.3376a76.6976 76.6976 0 1 0 108.544 108.544L512 620.6464z\" p-id=\"3598\"></path>\
    </svg><div class='gis-tip-box-rooms-box'>";
    for(var i=0,len=rooms.length;i<len;i++){
        html += "<div style='background-color:"+gridDemo.getColorByRsrp(rooms[i].avg_rsrp)+"' class='gis-tip-rooms' data-id='"+rooms[i].floor_id+"' data-height='"+data.floorHeight+"'>"+rooms[i].room_name+"</div>";
    };
    html+="</div>";
    console.log(rooms);
    html += gridDemo.getTargetDom(rooms[0]);
    html+="</div>";
    self.infoWindow = self.infoWindow||{};

    if(self.infoWindow.floorWindow){
        self.map.removeOverlay(self.infoWindow.floorWindow);
        self.infoWindow.floorWindow = undefined;
    }
    self.infoWindow.floorWindow = new dmap.feature.DOverLay({
        content: html,
        position: data.coordinate,
        // position
        offsetX: 0,
        offsetY: 0,
        success: function () {
            $("#gis-tip-box .icon").off("click").on("click",function(){
                self.map.removeOverlay(self.infoWindow.floorWindow);
            })
            $("#gis-tip-box .gis-tip-rooms").off("click").on("click",function(){
                $(this).addClass("selected").siblings().removeClass("selected");
                var roomId = $(this).attr("data-id");
                var currentRoom = rooms.filter(function(item,index){return item.floor_id == roomId});
                console.log("选中的房间数据 ");
                console.log(currentRoom[0]);
                $(".gis-tip-target-box").html(gridDemo.getTargetDom(currentRoom[0]));
                addCellLineLayerOfRoom(data);
            })
        }
    });
    self.map.addOverlay(self.infoWindow.floorWindow);
}
GridFn.prototype.getTargetDom = function(data){
    var targetNams = [
        "重定向3G比例",
    "CQI>=7比例",
    "RRC连接重建比例",
    "RRC连接重建成功率",
    "系统内切换成功率",
    "同频切换成功率",
    "下行PRB双流占比",
    "上行PRB双流占比",
    "RRC连接建立成功率",
    "E-RAB掉线率",
    "PDCP层用户面总流量",
    "平均RRC连接用户数",
    "最大RRC连接用户数",
    "MR覆盖率",
    "人口数量",
    "网页浏览",
    "游戏",
    "即时通讯",
    "视频",
    "其他"];
    var useHtml = "<div class='gis-tip-target-box'>";
    useHtml += "<div class='gis-tip-target-box-rows'>\
        <div class='gis-tip-target-box-rows-left'><div class='gis-tip-target-box-rows-name'>人口数量</div><div class='gis-tip-target-box-rows-value'>"+data.population+"</div></div>\
        <div class='gis-tip-target-box-rows-right'><div class='gis-tip-target-box-rows-name'>平均RSRP</div><div class='gis-tip-target-box-rows-value'>"+data.avg_rsrp+"</div></div>\
        </div>";
    for(var i=0,len=targetNams.length;i<len;i++){
        if(i === 10){
            useHtml += "<div class='gis-tip-target-box-rows'>\
        <div class='gis-tip-target-box-rows-left'><div class='gis-tip-target-box-rows-name'>"+targetNams[i]+"</div><div class='gis-tip-target-box-rows-value'>"+gridDemo.randomNumber(data.population*10,0)+"</div></div>\
        <div class='gis-tip-target-box-rows-right'><div class='gis-tip-target-box-rows-name'>"+targetNams[i+1]+"</div><div class='gis-tip-target-box-rows-value'>"+gridDemo.randomNumber(data.population,2)+"</div></div>\
        </div>";
        }else{
            useHtml += "<div class='gis-tip-target-box-rows'>\
        <div class='gis-tip-target-box-rows-left'><div class='gis-tip-target-box-rows-name'>"+targetNams[i]+"</div><div class='gis-tip-target-box-rows-value'>"+gridDemo.randomNumber(100,0)+"</div></div>\
        <div class='gis-tip-target-box-rows-right'><div class='gis-tip-target-box-rows-name'>"+targetNams[i+1]+"</div><div class='gis-tip-target-box-rows-value'>"+gridDemo.randomNumber(100,0)+"</div></div>\
        </div>";
        }
        
        i++;
    }

    useHtml += "</div>";
    return useHtml;
}
/**
 * 根据RSRP获取颜色
 */
GridFn.prototype.getColorByRsrp = function(rsrp){
    var useColor = "";
    if(rsrp < -110){
        useColor = "#ff00009e";
    }else if(rsrp >= -110 && rsrp < -105){
        useColor = "#ff96009e";
    }else if(rsrp >= -105 && rsrp < -100){
        useColor = "#ffff009e";
    }else if(rsrp >= -100 && rsrp < -95){
        useColor = "#7bd7ff9e";
    }else if(rsrp >= -95 && rsrp < -90){
        useColor = "#00aeff9e";
    }else if(rsrp >= -90 && rsrp < -85){
        useColor = "#428aff9e";
    }else if(rsrp >= -85 && rsrp < -80){
        useColor = "#0059ff9e";
    }else if(rsrp >= -80){
        useColor = "#0000ff9e";
    };
    return useColor;
}
/**
 * 冒泡排序
 */
GridFn.prototype.sort = function(arrParams,field) {
    var arr = JSON.parse(JSON.stringify(arrParams));
    var len = arr.length;
    for(var i=1;i<=arr.length-1;i++){ //外层循环管排序的次数
        for(var j=0;j<=arr.length-i-1;j++){
            if(field){
                if(arr[j][field]-0>=arr[j+1][field]-0){
                    var temp=arr[j];
                    arr[j]=arr[j+1];
                    arr[j+1]=temp;
                }
            }else{
                if(arr[j]>=arr[j+1]){
                    var temp=arr[j];
                    arr[j]=arr[j+1];
                    arr[j+1]=temp;
                }
            }
        }
    }
    return arr;
}
/**
 * 快速排序
 */
GridFn.prototype.quickSort = function(arr, i, j,field) {
    arr= JSON.parse(JSON.stringify(arr));
  if(i < j) {
    let left = i;
    let right = j;
    let pivot = arr[left];
    while(i < j) {
      while(arr[j][field]-0 >= pivot[field]-0 && i < j) {  // 从后往前找比基准小的数
        j--;
      }
      if(i < j) {
        arr[i++] = arr[j];
      }
      while(arr[i][field]-0 <= pivot[field]-0 && i < j) {  // 从前往后找比基准大的数
        i++;
      }
      if(i < j) {
        arr[j--] = arr[i];
      }
    }
    arr[i] = pivot;
    this.quickSort(arr, left, i-1);
    this.quickSort(arr, i+1, right);
    return arr;
  }
};
/**
 * 生成随机数 
 */
GridFn.prototype.randomNumber =  function(max,min){
    return Math.floor(Math.random()*(max-min+1)+min);
}
/**
根据房间号查找关联扇区 
@params roomId 为楼宇ID
@Params sectorNumber 为比最大值小多少个 超出最大值 取 比最大值少一个
 */
GridFn.prototype.filterSectorByRoomId = function(roomId,sectorNumber){
    var waitUseSectorList =  data.dm_building_cell.filter(function(item,index){return item.building_id == roomId});
    var useSectorList = [],q=waitUseSectorList.length-sectorNumber<=0?1:waitUseSectorList.length-sectorNumber,i=0;
    while(i<q){
        var index = this.randomNumber(waitUseSectorList.length-1,0);
        useSectorList.push(waitUseSectorList[index]);
        i++;
    };

    for (let j = 0; j < useSectorList.length; j++) {
        for (let k = 0; k < self.data.cfg_cell.length; k++) {
            if(useSectorList[j].cell_id == self.data.cfg_cell[k].cell_id && useSectorList[j].enb_id == self.data.cfg_cell[k].enb_id ){
                useSectorList[j] = $.extend(useSectorList[j], self.data.cfg_cell[k]);
                continue;
            }
        }
    }
    return useSectorList;
} 

/**
根据楼宇ID关联扇区
 */
GridFn.prototype.filterSectorByBuildingId = function(buildingId){
    var useSectorList = data.dm_building_cell.filter(function(item,index){return item.building_id == buildingId});

    for (let j = 0; j < useSectorList.length; j++) {
        for (let k = 0; k < self.data.cfg_cell.length; k++) {
            if(useSectorList[j].cell_id == self.data.cfg_cell[k].cell_id && useSectorList[j].enb_id == self.data.cfg_cell[k].enb_id ){
                useSectorList[j] = $.extend(useSectorList[j], self.data.cfg_cell[k]);
                continue;
            }
        }
    }
    return useSectorList;
} 

/**
根据楼栋ID筛选楼层
 */
GridFn.prototype.filterFloorByBuildingId = function(buildingId){
    var useData = data.dm_floor_rsrp.filter(function(item,index){return item.building_id == buildingId});
    var returnData = this.sort(useData,"floor_id");
    return returnData;
}

/**
 * 根据网格ID删选网格下的楼宇
 */
GridFn.prototype.filterBuildingData = function(gridId){
    var gridMappingBuildingList = [],useBuildingList = [];
    gridMappingBuildingList = data.building.filter(function(item,index){return item.gridunit_id == gridId});
    for(var j=0,lenJ=gridMappingBuildingList.length;j<lenJ;j++){
        for(var k=0,lenK=data.dm_building_rsrp.length;k<lenK;k++){
            if( gridMappingBuildingList[j].building_id == data.dm_building_rsrp[k].building_id){
                useBuildingList.push(data.dm_building_rsrp[k]);
                continue;
            }
        }
    };
    return useBuildingList;
};
/**
 * 根据楼宇ID筛选扇区数据
 */
GridFn.prototype.filterSectorData = function(buildingId){
    var buildingMappingSectorList = [],useSectorList = [];
    buildingMappingSectorList = data.dm_building_cell.filter(function(item,index){return item.building_id == buildingId});
    for(var j=0,lenJ=buildingMappingSectorList.length;j<lenJ;j++){
        for(var k=0,lenK=data.cfg_cell.length;k<lenK;k++){
            if(buildingMappingSectorList[j].cell_id == data.cfg_cell[k].cell_id && buildingMappingSectorList[j].enb_id == data.cfg_cell[k].enb_id){
                useSectorList.push(data.cfg_cell[k]);
                continue;
            }
        }
    };
    return useSectorList;
    
};
/**
 * 计算表格的高度
 */
GridFn.prototype.getTableHeight = function(){
    var titleHeight = 25,allHeight = window.innerHeight,tableMargin = 10*2,footerWhite = 10;
    var useHeight = (allHeight - footerWhite - (titleHeight*3))/2 - tableMargin;
    return useHeight;
}
/**
 * 初始化网格的表格
 */
GridFn.prototype.initGridTable = function(){
    var height = this.getTableHeight();
    var limitNumber = Math.floor(height/39)-2;
    layui.table.render({
    elem: "#grid-table",
    height:height,
    page:{
        count:10,
        limit:limitNumber,
        curr:1,
        groups:2,
        layout:['prev', 'page', 'next',"count","skip"]
    },
    cols: [[
      {field:'gridunit_name', width:"60%", title: '网格', align: "center"},
      {field:'district_name', width:"30%", title: '区县', align: "center"},
      {field:'building_cnt', width:"30%", title: '楼宇数量', align: "center"},
      {field:'avg_rsrp', width:"30%", title: '平均RSRP', align: "center"}
    ]],
    data:data.dm_gridunit_rsrp
  });
  layui.table.on("row(grid-table)",function(rowObject){
    $(rowObject.tr[0]).addClass("selected").siblings().removeClass("selected");
    var rowBuildingData = gridDemo.filterBuildingData(rowObject.data.gridunit_id);
    gridDemo.initBuildingTable(rowBuildingData);
    loadBuildingLayer(rowObject.data.gridunit_id);
  });
  // 界面样式选中第一行   
  $("#grid-table").siblings(".layui-table-view").find(".layui-table-box>.layui-table-main>table>tbody>tr").eq(0).addClass("selected").siblings().removeClass("selected");
}
/**
 * 初始化 楼宇的表格
 */
GridFn.prototype.initBuildingTable = function(showData){
    var height = this.getTableHeight();
    var limitNumber = Math.floor(height/39)-2;
    layui.table.render({
    elem: "#building-table",
    height:height,
    page:{
        count:10,
        limit:limitNumber,
        curr:1,
        layout:['prev', 'page', 'next',"count","skip"]
    },
    cols: [[
      {field:'district_name', width: '30%', title: '区县'}
      ,{field:'building_name', width: '40%', title: '楼宇'}
      ,{field:'floor_cnt', width: '30%', title: '楼宇数量'}
      ,{field:'population', width: '30%', title: '人口数量'}
      ,{field:'avg_rsrp', title: '平均RSRP', width: '30%'}
    ]],
    data:showData
  });
  layui.table.on("row(building-table)",function(rowObject){
    $(rowObject.tr[0]).addClass("selected").siblings().removeClass("selected"); 
    var rowSelectorData = gridDemo.filterSectorData(rowObject.data.building_id);
    gridDemo.initSectorTable(rowSelectorData);
    loadFloorLayer(rowObject.data);
  });
  gridDemo.initSectorTable(gridDemo.filterSectorData(showData[0].building_id));
  $("#building-table").siblings(".layui-table-view").find(".layui-table-box>.layui-table-main>table>tbody>tr").eq(0).addClass("selected").siblings().removeClass("selected");
}
/**
 * 初始化 扇区的表格
 */
GridFn.prototype.initSectorTable = function(showData){
    var height = this.getTableHeight();
    var limitNumber = Math.floor(height/39)-2;
    layui.table.render({
    elem: "#sector-table",
    height:height,
    page:{
        count:10,
        limit:limitNumber,
        curr:1,
        layout:['prev', 'page', 'next',"count","skip"]
    },
    cols: [[
        {field:'phy_station_name', title: '物理站点名称',width:"80%",align:"center"}, 
        {field:'project_id', title: '工程编号',width:"100%",align:"center"}, 
        {field:'enb_name', title: '基站名称',width:"100%",align:"center"}, 
        {field:'cell_name', title: '扇区名称',width:"100%",align:"center"}, 
        {field:'eci', title: '索引关键值ECI',width:"50%",align:"center"}, 
        {field:'if_same_pci', title: '是否同PCI小区',width:"50%",align:"center"}, 
        {field:'same_pci_id', title: '同PCI小区编号',width:"50%",align:"center"}, 
        {field:'cell_cover_area_type', title: '扇区覆盖区域类型',width:"60%",align:"center"}, 
        {field:'cell_cover_road_type', title: '扇区覆盖道路类型',width:"60%",align:"center"}, 
        {field:'cell_cover_hotspot_type', title: '扇区覆盖热点类型',width:"60%",align:"center"}, 
        {field:'cell_type', title: '扇区类别',width:"60%",align:"center"}, 
        {field:'fdd_tdd', title: '双工模式',width:"30%",align:"center"}, 
        {field:'station_type', title: '站点类别',width:"30%",align:"center"}, 
        {field:'vendor', title: '厂家',width:"30%",align:"center"}, 
        {field:'angle', title: '方向角',width:"30%",align:"center"}, 
        {field:'pci', title: 'PCI值',width:"30%",align:"center"}, 
        {field:'tac', title: 'TAC值',width:"30%",align:"center"}, 
        {field:'freq_band', title: '频段指示',width:"30%",align:"center"}, 
        {field:'ul_ear_fcn', title: '上行中心频点',width:"40%",align:"center"}, 
        {field:'dl_ear_fcn', title: '下行中心频点',width:"40%",align:"center"}, 
        {field:'boundary_cell_type', title: '边界扇区类型',width:"40%",align:"center"}
    ]],
    data:showData
  });
  layui.table.on("row(sector-table)",function(rowObject){
    $(rowObject.tr[0]).addClass("selected").siblings().removeClass("selected"); 
  });
  $("#sector-table").siblings(".layui-table-view").find(".layui-table-box>.layui-table-main>table>tbody>tr").eq(0).addClass("selected").siblings().removeClass("selected");
};
/**
 * 绑定各种点击事件
 */
GridFn.prototype.blindEvents = function(){
    $("#grid-box-title").on("click",function(){
        var openFlag = $(this).attr("data-open");
        if(openFlag == 1){
            console.log("关");
            $(this).attr("data-open",2)
            .find("svg").removeClass("transfrom");
            // $(this).siblings(".box-wrap").addClass("transfrom");
            $("#grid-table-box").addClass("transfrom");
            $("#building-table-box").removeClass("transfrom").siblings(".box-title").attr("data-open",1).find("svg").addClass("transfrom");
            $("#sector-table-box").removeClass("transfrom").siblings(".box-title").attr("data-open",1).find("svg").addClass("transfrom");
        }else if(openFlag == 2){
            console.log("开");
            $(this).attr("data-open",1)
            .find("svg").addClass("transfrom");
            // $(this).siblings(".box-wrap").removeClass("transfrom");
            $("#grid-table-box").removeClass("transfrom");
            $("#building-table-box").removeClass("transfrom").siblings(".box-title").attr("data-open",1).find("svg").addClass("transfrom");
            $("#sector-table-box").addClass("transfrom").siblings(".box-title").attr("data-open",2).find("svg").removeClass("transfrom");
        }
    });
    $("#building-box-title").on("click",function(){
        var openFlag = $(this).attr("data-open");
        if(openFlag == 1){
           $(this).attr("data-open",2)
            .find("svg").removeClass("transfrom");
            // $(this).siblings(".box-wrap").addClass("transfrom");
            $("#grid-table-box").removeClass("transfrom").siblings(".box-title").attr("data-open",1).find("svg").addClass("transfrom");
            $("#building-table-box").addClass("transfrom");
            $("#sector-table-box").removeClass("transfrom").siblings(".box-title").attr("data-open",1).find("svg").addClass("transfrom");
        }else if(openFlag == 2){
            $(this).attr("data-open",1)
            .find("svg").addClass("transfrom");
            // $(this).siblings(".box-wrap").removeClass("transfrom");
            $("#grid-table-box").addClass("transfrom").siblings(".box-title").attr("data-open",2).find("svg").removeClass("transfrom");
            $("#building-table-box").removeClass("transfrom");
            $("#sector-table-box").removeClass("transfrom").siblings(".box-title").attr("data-open",1).find("svg").addClass("transfrom");
        }   
    });
    $("#sector-box-title").on("click",function(){
        var openFlag = $(this).attr("data-open");
        if(openFlag == 1){
           $(this).attr("data-open",2)
            .find("svg").removeClass("transfrom");
            $(this).siblings(".box-wrap").addClass("transfrom");
            $("#grid-table-box").removeClass("transfrom").siblings(".box-title").attr("data-open",1).find("svg").addClass("transfrom");
            $("#building-table-box").removeClass("transfrom").siblings(".box-title").attr("data-open",1).find("svg").addClass("transfrom");
            $("#sector-table-box").addClass("transfrom");
        }else if(openFlag == 2){
            $(this).attr("data-open",1)
            .find("svg").addClass("transfrom");
            $(this).siblings(".box-wrap").removeClass("transfrom");
            $("#grid-table-box").addClass("transfrom").siblings(".box-title").attr("data-open",2).find("svg").removeClass("transfrom");
            $("#building-table-box").removeClass("transfrom").siblings(".box-title").attr("data-open",1).find("svg").addClass("transfrom");
            $("#sector-table-box").removeClass("transfrom");
        }
    });
}