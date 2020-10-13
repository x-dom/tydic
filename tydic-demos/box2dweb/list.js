function List() {
     
  this.listSize = 0;   // 列表的元素个数

  this.pos = 0;    // 列表的当前位置
  this.dataStore = [];    // 列表数组
  this.append = append;    // 列表的末尾添加新元素
  this.find = find;    // 找到指定元素的位置
  this.toString = toString;     // 返回列表的字符串形式
  this.insert = insert;    // 在现有元素后插入新元素
  this.remove = remove;    // 从列表中删除元素
  this.clear = clear;    // 清空列表中的所有元素
  this.front = front;    // 将列表的当前位置移到第一个元素
  this.end = end;    // 将列表的当前位置移到最后一个元素
  this.next = next;    //将当前位置后移一位
  this.hasNext = hasNext;    // 判断是否有后一位
  this.hasPrev = hasPrev;    // 判断是否有前一位
  this.length = length;   // 返回列表元素的个数
  this.valueOf = valueOf; // 返回原值
  this.currPos = currPos;    // 返回列表的当前位置
  this.moveTo = moveTo;    // 将列表的当前位置移动到指定位置
  this.getElement = getElement;    // 返回当前位置的元素
  this.contains = contains; // 判断给定元素是否在列表中
}
/**
 * @description: 列表追加元素，并将指针长度自增1 
 */
function append(element) {
  this.dataStore[this.listSize++] = element;
}
/**
 * @description: 查找元素 
 */
function find(element) {
  for (var i = 0; i < this.listSize; i++) {
      console.log(i);
      if (element == this.dataStore[i]) {
          return i;
      }
  }
  return -1;
}
/**
 * @description: 删除元素 
 */
function remove(element) {
  var findAt = this.find(element);
  if (findAt > -1) {
      this.dataStore.splice(findAt, 1);
      --this.listSize;
      return true;
  }
}
/**
 * @description: 获取列表长度 
 */
function length() {
  return this.listSize;
}
/**
 * @description: 返回原值
 */
function valueOf() {
  return this.dataStore;
}
/**
 * @description: 转为字符串 
 */
function toString() {
  return this.dataStore;
}
/**
 * @description: 插入列表元素 
 */
function insert(element, after) {
  var insertAt = this.find(after);
  if (insertAt > -1) {
      this.dataStore.splice(insertAt + 1, 0, element);
      this.listSize++;
      return true;
  }
  return false;
}
/**
 * @description: 清空列表 
 */
function clear() {
  delete this.dataStore;
  this.dataStore = [];
  this.listSize = this.pos = 0;
}
/**
 * @description: 判断指定的值是否在列表中 
 */
function contains(element) {
  for (var i = 0; i < this.listSize; i++) {
      if (this.dataStore[i] == element) {
          return true;
      }
  }
  return false;
}
/**
 * @description: 指针移位到首位 
 */
function front() {
  this.pos = 0;
}
/**
 * @description: 指针移位到末位 
 */
function end() {
  this.pos = this.listSize - 1;
}
/**
 * @description: 指针前移一位 
 */
function prev() {
  if (this.pos > 0) {
      this.pos--;
  }
}
/**
 * @description: 指针后移一位 
 */
function next() {
  if (this.pos < this.listSize - 1) {
      this.pos++;
  }
}
/**
 * @description: 判断是否存在后一位 
 */
function hasNext() {
  return this.pos < this.listSize - 1;
}
/**
 * @description: 判断是否存在前一位 
 */
function hasPrev() {
  return this.pos > 0;
}
/**
 * @description: 获取指针 
 */
function currPos() {
  return this.pos;
}
/**
 * @description: 移动指针 
 */
function moveTo(position) {
  if (position < this.listSize - 1) {
      this.pos = position;
  }
}
/**
 * @description: 获取指针指向对象 
 */
function getElement() {
  return this.dataStore[this.pos];
}

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

function visual(world, rayStartPoint, rayEndPoint) {
  var input = new b2RayCastInput();
  var output = new b2RayCastOutput();
  var intersectionPoint = new b2Vec2(); // 交点
  var normalEnd = new b2Vec2();

  input.p1 = rayStartPoint;
  input.p2 = rayEndPoint;
  input.maxFraction = 1;
  var closestFraction = 1;

  for (var i = world.GetBodyList(); i; i = i.GetNext()) {
    for (var j = i.GetFixtureList(); j; j = j.GetNext()) {
      if (j.RayCast(output, input) && output.fraction < closestFraction) {
        closestFraction = output.fraction;
        intersectionPoint.x = rayStartPoint.x + closestFraction * (rayEndPoint.x - rayStartPoint.x);
        intersectionPoint.y = rayStartPoint.y + closestFraction * (rayEndPoint.y - rayStartPoint.x);
        // console.log("i = ", PointStr(i.m_xf.position), "j = ", j.m_shape, "intersectionPoint = ", PointStr(intersectionPoint));
        find(j, intersectionPoint);
        output = new b2RayCastOutput();
      }
    }
  }

  return closestFraction == 1 ? false : intersectionPoint;
}

function find(fixture, intersectionPoint) {
  
  if (fixture.m_shape.m_type == 1) {
    for (var i = 0; i < fixture.m_shape.m_vertexCount;i++) {
      var i_1 = (i + 1) % fixture.m_shape.m_vertexCount;
      if (Math.abs((Math.max(intersectionPoint.y, 0) - fixture.m_shape.m_vertices[i].y - fixture.m_body.m_xf.position.y) * (fixture.m_shape.m_vertices[i_1].x - fixture.m_shape.m_vertices[i].x) - 
      (fixture.m_shape.m_vertices[i_1].y - fixture.m_shape.m_vertices[i].y) * (Math.max(intersectionPoint.x, 0) - fixture.m_shape.m_vertices[i].x - fixture.m_body.m_xf.position.x)) < 1e-10) {
        // console.log(PointStr(intersectionPoint), " 在 ", PointStr(new b2Vec2(fixture.m_shape.m_vertices[i].x + fixture.m_body.m_xf.position.x, fixture.m_shape.m_vertices[i].y + fixture.m_body.m_xf.position.y)), " 到 ",
        // PointStr(new b2Vec2(fixture.m_shape.m_vertices[i_1].x + fixture.m_body.m_xf.position.x, fixture.m_shape.m_vertices[i_1].y + fixture.m_body.m_xf.position.y)), "上");
        if (!fixture.m_userData) {
          fixture.m_userData = i.toString();
        } else {
          var data = fixture.m_userData.split("-");
          for (var t = 0; t < data.length; t++) {
            if (parseInt(data[t]) == i) {
              return false;
            }
          }
          fixture.m_userData = fixture.m_userData + "-" + i.toString();
        }
        // if (fixture.m_shape.m_vertexCount > 2) {
        //   console.log(fixture, "fixture.m_userData = ", fixture.m_userData);
        // }
        var section1 = new InterSection(new b2Vec2(fixture.m_shape.m_vertices[i].x + fixture.m_body.m_xf.position.x, fixture.m_shape.m_vertices[i].y + fixture.m_body.m_xf.position.y));
        var section2 = new InterSection(new b2Vec2(fixture.m_shape.m_vertices[i_1].x + fixture.m_body.m_xf.position.x, fixture.m_shape.m_vertices[i_1].y + fixture.m_body.m_xf.position.y));
        section1.setCenter(new b2Vec2(fixture.m_shape.m_centroid.x + fixture.m_body.m_xf.position.x, fixture.m_shape.m_centroid.y + fixture.m_body.m_xf.position.y));
        section2.setCenter(new b2Vec2(fixture.m_shape.m_centroid.x + fixture.m_body.m_xf.position.x, fixture.m_shape.m_centroid.y + fixture.m_body.m_xf.position.y));
        section1.setEdges(new b2Vec2(fixture.m_shape.m_vertices[i_1].x + fixture.m_body.m_xf.position.x, fixture.m_shape.m_vertices[i_1].y + fixture.m_body.m_xf.position.y));
        section2.setEdges(new b2Vec2(fixture.m_shape.m_vertices[i].x + fixture.m_body.m_xf.position.x, fixture.m_shape.m_vertices[i].y + fixture.m_body.m_xf.position.y));
        section2.setEdges(new b2Vec2(fixture.m_shape.m_vertices[(i + 2) % fixture.m_shape.m_vertexCount].x + fixture.m_body.m_xf.position.x, fixture.m_shape.m_vertices[(i + 2) % fixture.m_shape.m_vertexCount].y + fixture.m_body.m_xf.position.y));
        section1.setEdges(new b2Vec2(fixture.m_shape.m_vertices[(i - 1 + fixture.m_shape.m_vertexCount) % fixture.m_shape.m_vertexCount].x 
        + fixture.m_body.m_xf.position.x, fixture.m_shape.m_vertices[(i - 1 + fixture.m_shape.m_vertexCount) % fixture.m_shape.m_vertexCount].y + fixture.m_body.m_xf.position.y));
        return [section1, section2];
      }
    }
  } else if (fixture.m_shape.m_type == 0) {
    
  }

  return false;
}

function polygonStr(fixture) {
  var ver = "";
  for (var i = 0;i < fixture.m_shape.m_vertexCount;i++) {
    if (i > 0) {
      ver = ver + " -> ";
    }
    ver = ver + "(" + (/*fixture.m_shape.m_centroid.x + */fixture.m_shape.m_vertices[i].x) + ", " + (/*f.m_shape.m_centroid.y + */fixture.m_shape.m_vertices[i].y) + ")";
  }
  return ver;
}

function PointStr(point) {
  return "(" + point.x + ", " + point.y + ")";
}

class InterSection {
   
  // constructor(x, y) {
  //   this.point = new b2Vec2(x, y);
  // }

  constructor(point) {
    // console.log("setCenter()", PointStr(point));
    this.point = new b2Vec2(point.x, point.y);
  }

  getPoint() {
    return this.point;
  }

  setEdges(point) {
    if (!this.edges) {
      this.edges = new Array();
    }
    if (this.edges.length < 2) {
      this.edges.push(point);
    }
  }

  setCenter(center) {
    var a = this.angle_of(center);
    this.centerAngle = a % (2 * Math.PI);
  }

  angle_of(center) {
    var a = Math.abs(center.y - this.point.y) < 1e-10 ? Math.PI / 2 : Math.atan((center.x - this.point.x) / (center.y - this.point.y));
    if (a < 0 && center.x > this.point.x || a == 0 && center.y < this.point.y) {
      a = a + Math.PI;
    } else if (a > 0 && center.x < this.point.x) {
      a = a - Math.PI;
    }
    while (a < 0) {
      a = a + 2 * Math.PI;
    }
    return a;
  }

  lowestAndBiggest() {
    var l = this.angle_of(this.edges[0]) % (2 * Math.PI);
    var b = this.angle_of(this.edges[1]) % (2 * Math.PI);
    // console.log("l = ", l, ", b = ", b, ", centerAngle = ", this.centerAngle);
    
    // if (l > b && this.centerAngle > b) {
    //   l = l - Math.PI * 2;
    // } else if (l > b && this.centerAngle < b) {
    //   var t = l;
    //   l = b;
    //   b = t;
    // } else if (l < b && this.centerAngle > b) {
    //   l = l + Math.PI * 2;
    // } else if (l < b && (this.centerAngle < l || this.centerAngle > b)) {
    //   l = l - Math.PI * 2;
    // }
    // console.log("centerAngle = ", this.centerAngle);
    if (l > b) {
      var t = l;
      l = b;
      b = t;
    }
    if (this.centerAngle < b && this.centerAngle > l) {
      var t = b - 2 * Math.PI;
      b = l;
      l = t;
    }

    
    return [l, b];
  }
}
