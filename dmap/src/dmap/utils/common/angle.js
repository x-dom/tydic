import {transform} from '../geom';

/**
 * 绘制扇形工具
 * @param {*} origin 原点
 * @param {*} radius  半径
 * @param {*} sides 边数
 * @param {*} r 弧度
 * @param {*} angel 角度
 */
export const GetMarcoXyArcArray = function (origin, radius, sides, r, angel) {
    origin = transform(origin, "EPSG:4326", "EPSG:3857");
    var x = [];
    x[0] = [origin[0], origin[1]];
    for (var j = 1; j < sides; j++) {
        var tx = origin[0] + radius * Math.cos(Math.PI / 180 * (90 - angel + (sides / 2 - j) * r / (sides - 2)));

        var ty = origin[1] + radius * Math.sin(Math.PI / 180 * (90 - angel + (sides / 2 - j) * r / (sides - 2)));

        x[j] = [tx, ty];
    }
    return [x];
}

/**
 * 角度工具
 */
export const AngleUtil = {
	/**
	 * 求B点经纬度
	 * @param MyLatLng A 已知点的经纬度，
	 * @param double distance   AB两地的距离  单位km
	 * @param double angle  AB连线与正北方向的夹角（0~360）
	 * @return  B点的经纬度
	 */
	getLatLng: function(A, distance, angle){
		
		var dx = distance*1000*Math.sin(angle* Math.PI / 180);
		var dy= distance*1000*Math.cos(angle* Math.PI / 180);
		
		var bjd=(dx/A.Ed+A.m_RadLo)*180./Math.PI;
		var bwd=(dy/A.Ec+A.m_RadLa)*180./Math.PI;
		return AngleUtil.LatLng(bjd, bwd);
	},
	
	/**
	 * 获取AB连线与正北方向的角度
	 * @param MyLatLng A  A点的经纬度
	 * @param MyLatLng B  B点的经纬度
	 * @return  AB连线与正北方向的角度（0~360）
	 */
	getAngle: function(A, B){
		var dx=(B.m_RadLo-A.m_RadLo)*A.Ed;
		var dy=(B.m_RadLa-A.m_RadLa)*A.Ec;
		var angle=0.0;
		angle=Math.atan(Math.abs(dx/dy))*180./Math.PI;	
		var dLo=B.m_Longitude-A.m_Longitude;
		var dLa=B.m_Latitude-A.m_Latitude;
		if(dLo>0&&dLa<=0){
			angle=(90.-angle)+90;
		}
		else if(dLo<=0&&dLa<0){
			angle=angle+180.;
		}else if(dLo<0&&dLa>=0){
			angle= (90.-angle)+270;
		}
		return angle;
    },
    
    /**
     * 自定义经纬度对象
     * @param {*} longitude 
     * @param {*} latitude 
     */
	LatLng: function(longitude,latitude){
        var Rc = 6378137;
        var Rj = 6356725;
        var m_LoDeg,m_LoMin,m_LoSec;
        var m_LaDeg,m_LaMin,m_LaSec;
        var m_Longitude,m_Latitude;
        var m_RadLo,m_RadLa;
        var Ec;
        var Ed;
        m_LoDeg= longitude;
        m_LoMin= ((longitude-m_LoDeg)*60);
        m_LoSec=(longitude-m_LoDeg-m_LoMin/60.)*3600;
        
        m_LaDeg=latitude;
        m_LaMin=((latitude-m_LaDeg)*60);
        m_LaSec=(latitude-m_LaDeg-m_LaMin/60.)*3600;
        
        m_Longitude=longitude;
        m_Latitude=latitude;
        m_RadLo=longitude*Math.PI/180.;
        m_RadLa=latitude*Math.PI/180.;
        Ec=Rj+(Rc-Rj)*(90.-m_Latitude)/90.;
        Ed=Ec*Math.cos(m_RadLa);
    
        return{
            m_LoDeg: m_LoDeg,
            m_LoMin: m_LoMin,
            m_LoSec: m_LoSec,
    
            m_LaDeg: m_LaDeg,
            m_LaMin: m_LaMin,
            m_LaSec: m_LaSec,
    
            m_Longitude: m_Longitude,
            m_Latitude: m_Latitude,
            m_RadLo: m_RadLo,
            m_RadLa: m_RadLa,
            Ec: Ec,
            Ed: Ed,
        }
    }
}

function test(){
    var A= AngleUtil.LatLng(104.0547, 30.6590);
	var B= AngleUtil.getLatLng(A, 0.2, 200);
    var C= AngleUtil.getLatLng(A, 0.2, 100);
    var aglAB = AngleUtil.getAngle(A,B);
    var aglAC = AngleUtil.getAngle(A,C);
    var radian = aglAC - aglAB;
    console.log(B);
    console.log(C);
    var cellPolygonArr1 = GetMarcoXyArcArray([A.m_Longitude, A.m_Latitude], 200, 200, radian, AngleUtil.getAngle(A,B) + radian/2);
    var cellPolygon1 = new dmap.geom.DPolygon({coordinates: cellPolygonArr1, projection: "EPSG:3857"});
    var cellFeature1 = new dmap.feature.DFeature({geometry: cellPolygon1, properties: {name: '测试绘制扇形'}});
    polygonLayer.addData(cellFeature1);

    var line1 = new dmap.geom.DLineString({coordinates: [[A.m_Longitude, A.m_Latitude, 45],[B.m_Longitude, B.m_Latitude, 45]]});
    var lineFeature1 = new dmap.feature.DFeature({geometry: line1, properties: {name: '测试绘制线1'}});
    lineLayer.addData(lineFeature1);

    var line2 = new dmap.geom.DLineString({coordinates: [[A.m_Longitude, A.m_Latitude, 45],[C.m_Longitude, C.m_Latitude, 45]]});
    var lineFeature2 = new dmap.feature.DFeature({geometry: line2, properties: {name: '测试绘制线2'}});
    lineLayer.addData(lineFeature2);
}

