// import 'utils.js';

var b2Vec2 = Box2D.Common.Math.b2Vec2
        , b2BodyDef = Box2D.Dynamics.b2BodyDef
        , b2Body = Box2D.Dynamics.b2Body
        , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
        , b2World = Box2D.Dynamics.b2World
        , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
        , b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
        , b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape    
        , b2ContactFilter = Box2D.Dynamics.b2ContactFilter
        , b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
        , b2DebugDraw = Box2D.Dynamics.b2DebugDraw
        , b2Fixture = Box2D.Dynamics.b2Fixture
        , b2AABB = Box2D.Collision.b2AABB
        , b2WorldManifold = Box2D.Collision.b2WorldManifold
        , b2ManifoldPoint = Box2D.Collision.b2ManifoldPoint
        , b2RayCastInput = Box2D.Collision.b2RayCastInput
        , b2RayCastOutput = Box2D.Collision.b2RayCastOutput
        , b2Color = Box2D.Common.b2Color;

class GridFieldStrength {
    constructor() {
        this.fieldStrengthValues = {};
        this.fieldStrengthPoints = {};
        this.minX = Number.MAX_VALUE;
        this.maxX = Number.MIN_VALUE;
        this.minY = Number.MAX_VALUE;
        this.maxY = Number.MIN_VALUE;
        this.minValue = 10000000;
        this.maxValue = - 100000;
    }

    add(key, x, y, value) {
        // key 为发射点的键值 x 为栅格横坐标 y 为栅格纵坐标 value 为当前栅格场强
        x = parseInt(x);
        y = parseInt(y);
        value = parseFloat(value || 0);
        if (isNaN(value) || !isFinite(value) || value < -78) {
            return;
        }
        this.minValue = Math.min(this.minValue, value);
        this.maxValue = Math.max(this.maxValue, value);
        this.minX = Math.min(this.minX, x);
        this.maxX = Math.max(this.maxX, x);
        this.minY = Math.min(this.minY, y);
        this.maxY = Math.max(this.maxY, y);
        var str = x + "-" + y;
        if (str in this.fieldStrengthValues) {
            if (key in this.fieldStrengthValues[str]) {
                this.fieldStrengthValues[str][key] = dbmAdd(value, this.fieldStrengthValues[str][key]);
                this.fieldStrengthPoints[str][key] += 1;
            } else {
                this.fieldStrengthValues[str][key] = value;
                this.fieldStrengthPoints[str][key] = 1;
            }
        } else {
            this.fieldStrengthValues[str] = {};
            this.fieldStrengthPoints[str] = {};
            this.fieldStrengthValues[str][key] = value;
            this.fieldStrengthPoints[str][key] = 1;
        }
    }

    get(x, y) {
        // 获取 栅格x,y 的场强
        x = parseInt(x);
        y = parseInt(y);
        var str = x + "-" + y;
        // console.log(this.fieldStrengthValues);
        if (str in this.fieldStrengthValues) {
            var sum = null;
            for (var key in this.fieldStrengthValues[str]) {
                // console.log(this.fieldStrengthValues[str][key], sum);
                if (sum == null) {
                    sum = dbmDiv(this.fieldStrengthValues[str][key], Math.max(1, this.fieldStrengthPoints[str][key]));
                } else {
                    sum = dbmAdd(sum, dbmDiv(this.fieldStrengthValues[str][key], Math.max(1, this.fieldStrengthPoints[str][key])));
                }
            }
            // console.log(str, sum);
            return sum.toFixed(0);
        } else {
            return null;
        }
    }

    addLonLat(key, lon, lat, value, z) {
        z = parseInt(z) || 21;
        var x, y = titleOf(lon, lat, z);
        this.add(key, x, y, value);
    }

    heatMap() {
        // 获取n X 3 的数组 n->栅格个数 内数组第一第二个为 栅格的横坐标 纵坐标 第三个为栅格场强
        var result = new Array();
        for (var x = this.minX;x <= this.maxX;x++) {
            for (var y = this.minY;y <= this.maxY;y++) {
                var temp = {};
                temp["x"] = x;
                temp["y"] = y;
                var value = this.get(x, y);
                if (value == null) {
                    value = -100;
                }
                temp["value"] = value;
                result.push(temp);
            }
        }
        return result;
    }

    frequency(x, y) {
        // 获取栅格 x,y 中场强的频次
        x = parseInt(x);
        y = parseInt(y);
        var str = x + "-" + y;
        if (str in this.fieldStrengthPoints) {
            var sum = 0;
            for (var key in this.fieldStrengthPoints[str]) {
                sum += Math.max(1, this.fieldStrengthPoints[str][key]);
            }
            // console.log(str, sum);
            return sum;
        } else {
            return 0;
        }
    }

    threshold() {
        // 获取当前值的范围
        return [this.minValue, this.maxValue];
    }
}

function dbmAdd(d1, d2) {
    // 两个分贝相加
    var n1 = Math.pow(10, d1 / 10);
    var n2 = Math.pow(10, d2 / 10);
    return 10 * Math.log10(n1 + n2);
}

function dbmDiv(d, n) {
    // 分贝除以常数
    var d1 = Math.pow(10, d / 10) / n;
    return 10 * Math.log10(d1);
}

function applyGrid(gridFieldLength, p1, p2, Tx) {
    // 在 gridFieldLength 中 p1 -> p2 的路径上的各个栅格加入相应场强 Tx为发射点场强
    if (Tx < -78) {
        return;
    }
    var p = path(p1, p2);
    if (p1.x > 24 && p1.x < 25 && p1.y > 3 && p1.y < 4) {
        console.log(p);
    }
    for (var i = 0; i < p.length;i++) {
        var distance = Math.sqrt(Math.pow(p[i].x - p1.x, 2) + Math.pow(p[i].y - p1.y, 2));
        distance = Math.max(distance, 0.01);
        gridFieldLength.add(p1.x + ", " + p1.y, p[i].x, p[i].y, fieldStrength.perpendicular(Tx, distance));
    }
}

function path(p1, p2) {
    // p1 -> p2 路径走过的栅格
    // var len = Math.ceil(Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)));

    // var deltaX = (p2.x - p1.x) / len;
    // var deltaY = (p2.y - p1.y) / len;
    // var result = new Array();

    // for (var i = 0;i <= len; i++) {
    //     var x = p1.x + deltaX * i;
    //     var y = p1.y + deltaY * i;
    //     result.push(new b2Vec2(x, y));
    // }

    // return result;

    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    // 临时存入点列表与网格单元列表不一致
    var temList = new Array();
    var gridList = new Array();
    // 设置增量
    var increX = dx/Math.abs(dx);
    var increY = dy/Math.abs(dy);

    // 直线方程：斜截式
    var k = dy/dx;
    var b = -k * p1.x + p1.y;

    // 注意：路径保存需要保留起始坐标
    for (var m=0; m<=Math.abs(dx); m++) {
        // 沿横轴方向遍历，既查询与网格纵轴的交点
        var temPoint1 = new b2Vec2();
        // if(increX > 0){
        //   temPoint1.x = Math.floor(p1.x) + increX * m;
        //   temPoint1.y = k * temPoint1.x + b;
        //   temList.push(temPoint1);
        // }else {
        //   temPoint1.x = Math.ceil(p1.x) + increX * m;
        //   temPoint1.y = k * temPoint1.x + b;
        //   temList.push(temPoint1);
        // }
        temPoint1.x = Math.ceil(p1.x) + increX * m;
        temPoint1.y = k * temPoint1.x + b;
        temList.push(temPoint1); 
    }
    // 沿纵轴方向遍历，既查询与网格横轴的交点
    for (var n=0; n<=Math.abs(dy); n++) {
        var temPoint2 = new b2Vec2();
        // if(increY > 0) {
        //   temPoint2.y = Math.floor(p1.y) + increY * n;
        //   temPoint2.x = (temPoint2.y - p1.y) / k + p1.x;
        //   temList.push(temPoint2);
        // }else {
        //   temPoint2.y = Math.ceil(p1.y) + increY * n;
        //   temPoint2.x = (temPoint2.y - p1.y) / k + p1.x;
        //   temList.push(temPoint2);
        // }
        temPoint2.y = Math.ceil(p1.y) + increY * n;
        temPoint2.x = (temPoint2.y - p1.y) / k + p1.x;
        temList.push(temPoint2);
    }

    // console.log(temList);

    /*
    * 截止此处，已将直线与网格单元边界线的交点求出，接下来需要获取对应的网格序列号（依旧用坐标表示）  
    */
    // 网格路径单元，起始点单独计算
    var startId = new b2Vec2();
    var endId = new b2Vec2();
    startId.x = Math.ceil(p1.x);
    startId.y = Math.ceil(p1.y);

    endId.x = Math.ceil(p2.x);
    endId.y = Math.ceil(p2.y);
    // 将起点网格ID放入路径
    // gridList.push(startId);

    // 将除起始点外其他点导入,应用echart时包括0行0列
    for (var j=0; j<(temList.length);j++) {
        var temGridId1 = new b2Vec2();
        var temGridId2 = new b2Vec2();
        var temGridId3 = new b2Vec2();
        var temGridId4 = new b2Vec2();
        if((temList[j].x !=Math.ceil(temList[j].x)) && 
        (temList[j].y ==Math.ceil(temList[j].y))){
            temGridId1.x = Math.ceil(temList[j].x)-1;
            temGridId1.y = Math.ceil(temList[j].y)-1+1;
            temGridId2.x = Math.ceil(temList[j].x)-1;
            temGridId2.y = Math.ceil(temList[j].y)-1;
            gridList.push(temGridId1, temGridId2);
        } 
        else if((temList[j].y !=Math.ceil(temList[j].y)) && 
        (temList[j].x ==Math.ceil(temList[j].x))) {
            temGridId1.x = Math.ceil(temList[j].x)-1;
            temGridId1.y = Math.ceil(temList[j].y)-1;
            temGridId2.x = Math.ceil(temList[j].x)-1+1;
            temGridId2.y = Math.ceil(temList[j].y)-1;
            gridList.push(temGridId1, temGridId2);
        }
        else{
            temGridId1.x = Math.ceil(temList[j].x)-1;
            temGridId1.y = Math.ceil(temList[j].y)-1;
            temGridId2.x = Math.ceil(temList[j].x)-1+1;
            temGridId2.y = Math.ceil(temList[j].y)-1;
            temGridId3.x = Math.ceil(temList[j].x)-1;
            temGridId3.y = Math.ceil(temList[j].y)-1+1;
            temGridId4.x = Math.ceil(temList[j].x)-1+1;
            temGridId4.y = Math.ceil(temList[j].y)-1+1;
            gridList.push(temGridId1,temGridId2,temGridId3,temGridId4);
        }
    };

    // 将终点网格ID放入路径
    // gridList.push(endId);
    return unique(gridList);
}

function unique(arr) {
    if (!Array.isArray(arr)) {
      console.log('type error!')
      return
    };
    // 方法一：比较法，缺点：效率太低
    // for(var i=0;i<arr.length-1;i++){
    //   for(var j=1;j<arr.length;j++){
    //     while(i!=j){
    //       if(arr[i].x == arr[j].x && arr[i].y == arr[j].y){
    //         arr.splice(j,1);
    //       }
    //     }
    //   }
    // }

    // 方法二：降维法
    const obj ={};
    for(const item of arr){
      obj[item.x+','+item.y] = item;
    }
    arr = Object.values(obj);
    return arr;
  }
