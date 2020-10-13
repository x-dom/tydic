const ueMaxPower = 23, enodeBMaxPower = 43;
const STRING_NOT_FOUND = -1;
const carrier_width = 15 * 1000;
const table_x = new Array(800, 900, 1700, 1800, 2000, 2100, 2300, 2500);
const ldf_4 = new Array(6.456, 6.855, 9.744, 10.058, 10.666, 10.961, 11.535, 12.090);
const al_5 = new Array(3.676, 3.903, 5.551, 5.730, 6.077, 6.246, 6.573, 6.890);
const ldp_6 = new Array(2.465, 2.627, 3.825, 3.958, 4.216, 4.342, 4.588, 4.828);
const al_7 = new Array(2.193, 2.333, 3.360, 3.472, 3.692, 3.798, 4.006, 4.208);
var feeder_loss_coef = {};
const loss_array_dict = {
    'ldf_4': ldf_4,
    'al_5': al_5,
    'ldp_6': ldp_6,
    'al_7': al_7
}
const situations = {
    SITUATION_SUBURBAN: '郊区', 
    SITUATION_CITY: '市区',
    SITUATION_CONCENTRATE_CITY: '密集市区',
    SITUATION_VILLAGE: '农村'
}
const units_index = {
    'hz': 0,
    'khz': 3,
    'mhz': 6,
    'ghz': 9,
    'gh': 9
}

function maxpower(equipment) {
    equipment = (equipment || "ue").toLowerCase();
    return equipment.indexOf("ue") > STRING_NOT_FOUND ? ueMaxPower : enodeBMaxPower;
}

function gain(f, equipment) {
    equipment = (equipment || "ue").toLowerCase();
    if (equipment.indexOf("ue") > STRING_NOT_FOUND) {
        return 0;
    }
    f = f || 1500;
    if (f >= 1500) {
        return 18;
    } else if (f >= 900) {
        return 15;
    } else {
        return 0;
    }
}

function EIRP(frequency, equipment) {
    equipment = (equipment || "ue").toLowerCase();
    return maxpower(equipment) + gain(frequency, equipment);
}

function noise_coef(frequency, equipment) {
    equipment = (equipment || "ue").toLowerCase();
    if (equipment.indexOf("ue") > STRING_NOT_FOUND) {
        return 7;
    }
    if (frequency >= 1710 && frequency <= 1755 || frequency >= 2110 && frequency <= 2155) {
        return 2;
    } else if (frequency <= 2100) {
        return 2.3;
    } else if (frequency >= 2600) {
        return 2.5;
    } else {
        return 0; // TODO
    }
}

function sinr(equipment) {
    equipment = (equipment || "ue").toLowerCase();
    return equipment.indexOf("ue") > STRING_NOT_FOUND ? 1.5 : -3;
}

function warm_noise(rb_num) {
    rb_num = rb_num || 1;
    return -174 + 10 * Math.log10(carrier_width) + 10 * Math.log10(rb_num);
}

function accept_sensitivity(frequency, equipment, rb_num) {
    return warm_noise(rb_num) + sinr(equipment) + noise_coef(frequency, equipment);
}

function demodulation_threshold(sinr, bler) {
    bler = bler || 10;
    return 2;
}

function min_accept_electrical_level(frequency, equipment, situation, sinr, feeder_length, feeder_type) {
    return accept_sensitivity(frequency, equipment, sinr) + feeder_loss(feeder_length, frequency, feeder_type) - gain(frequency, situation);
}

function feeder_loss(length, frequency, type) {
    var coef;
    type = type || "ldf_4";
    type = type.toLowerCase().replace(/(?<=[a-z])(?=\d)/, "_");
    if (type in feeder_loss_coef) {
        coef = feeder_loss_coef[type];
    } else {
        coef = new Array();
        var mase = Number.MAX_VALUE;
        var fit_x = loss_array_dict[type];
        for (var i = fit_x.length - 1;i > 0;i--) {
            var k = (fit_x[i] - fit_x[0]) / (table_x[i] - table_x[0]);
            // var fit_y = new Array();
            var curMase = 0;
            for (var j = 0; j < table_x.length;j++) {
                var y = k * (table_x[j] - table_x[0]) + fit_x[0];
                // fit_y.push(y);
                curMase += Math.pow(y - fit_x[j], 2);
            }
            curMase = Math.sqrt(curMase);

            if (mase > curMase) {
                mase = curMase;
                coef[0] = k;
                coef[1] = fit_x[0] - k * table_x[0];
            }
        }
        feeder_loss_coef[type] = coef;
    }

    return (coef[0] * frequency + coef[1]) * length / 100.0;
}

function distance_for_mapl(mapl, frequency) {
    return Math.pow(10, (mapl - 32.44 - 20 * Math.log10(frequency)) / 20);
}

function c_cell(situation, frequency) {
    return 0;
}

function c_m(situation) {
    return name == situations.SITUATION_CONCENTRATE_CITY ? 3 : 0;
}

function a_hm(situation, frequency, receiverHeight) {
    var lgf = Math.log(frequency);
    if (situation != situations.SITUATION_CONCENTRATE_CITY) {
        return (1.1 * lgf - 0.7) * receiverHeight - (1.56 * lgf - 0.8);
    } else if (frequency > 150 && frequency < 200) {
        return 8.29 * Math.pow(Math.log10(1.54 * receiverHeight), 2) - 1.1;
    } else if (frequency > 200 && frequency < 1500) {
        return 3.2 * Math.pow(Math.log10(11.75 * receiverHeight)) - 4.97;
    } else {
        return 0;
    }
}

function shadow(situation) {
    situation = situation || situations.SITUATION_CONCENTRATE_CITY;
    if (situation == situations.SITUATION_CITY) {
        return 9.4
    } else if (situation == situations.SITUATION_CONCENTRATE_CITY) {
        return 11.7;
    } else if (situation == situations.SITUATION_SUBURBAN) {
        return 7.2;
    } else {
        return 6.2;
    }
}

function penetrate_loss(frequency, situation) {
    situation = situation || situations.SITUATION_CONCENTRATE_CITY;
    if (situation == situations.SITUATION_CONCENTRATE_CITY) {
        return frequency <= 900 ? 18 : 20;
    } else if (situation == situations.SITUATION_CITY) {
        return frequency <= 900 ? 14 : 16;
    } else if (situation == situations.SITUATION_SUBURBAN) {
        return frequency <= 900 ? 10 : 12;
    } else {
        return frequency <= 900 ? 7 : 8;
    }
}

function mapl(situation, frequency, senderEquipment, receiverEquipment, feeder_length, rb_num) {
    feeder_length = feeder_length || 90;
    rb_num = rb_num || 96;
    return EIRP(frequency, senderEquipment) - accept_sensitivity(frequency, receiverEquipment, rb_num) + gain(frequency, receiverEquipment) - 2.0 - feeder_loss(feeder_length, frequency, "ldf_4") - shadow(situation) - penetrate_loss(frequency, situation) - 0.0 + 2.5 + 4.0;
}

function distanceForMaplCost231Hata(situation, mapl, frequency, senderHeight, receiverHeight) {
    receiverHeight = receiverHeight || 1.8;
    var A1 = frequency <= 1500 ? 69.55 : 46.30;
    var A2 = frequency <= 1500 ? 26.16 : 33.90;
    var A3 = -13.82, B1 = 44.90, B2 = -6.55;
    var lgf = Math.log(frequency), lght = Math.log(senderHeight);
    console.log("mapl(before) = ", mapl);
    var mapl = mapl - A1 - A2 * lgf - A3 * lght + a_hm(situation, frequency, receiverHeight) - c_m(situation) - c_cell(situation, frequency);
    console.log("mapl(after) = ", mapl);
    return Math.pow(10, mapl / (B1 + B2 * lght));
}

function transformer(value, src, target) {
    src = (src || "MHz").toLowerCase();
    target = (target || "MHz").toLowerCase();
    value = value || "1000";
    
    return parseFloat(value) * Math.pow(10, units_index[src] - units_index[target]);
}

function getMinFrequency(frequency_str, unit) {
    unit = unit || "MHz";
    var pattern = /(?<![^\+\-~/])\s*\d+(?:\.\d+)?(?=(?:[mMkKgG]?[hH][zZ]?)|\W)/gi;
    var values = frequency_str == null ? new Array() : frequency_str.match(pattern);
    if (values.length == 0) {
        return 0;
    }
    var result_index = -1, strIndex = 0;
    pattern = /(?<=\d)[mMkKgG]?[hH][Zz]/gi;
    for (var i = 0;i < values.length;i++) {
        var strIndex = frequency_str.indexOf(values[i], strIndex) + values[i].length - 1;
        var tmp_unit = findUnit(frequency_str, strIndex, pattern);
        console.log("value = " + values[i] +", tmpUnit = " + tmp_unit + ", unit = " + unit);
        values[i] = transformer(values[i], tmp_unit, unit);
        if (result_index < 0 || values[result_index] > values[i]) {
            result_index = i;
        }
    }
    return values[result_index];
}

function findUnit(str, strIndex, pattern) {
    strIndex = Math.max(0, strIndex);
    var tmp = str.substr(strIndex).match(pattern);
    // console.log(tmp);
    if (tmp != null && tmp.length > 0) {
        return tmp[0];
    } else {
        return 'mhz';
    }
}

function isWhite(str) {
    return str.trim().length == 0;
}

// 场强计算，不考虑穿透损耗
var fieldStrength = {
    // 直射场，路径损耗
    perpendicular: function(Tx, d) {
      // apply COST231-Hata caculate power loss
      var fre = 2400; // emission frequency
      var ht = 45; // base station height
      var hr = 1.7; //use floor height
      var α = 3.2*Math.pow(Math.log10(11.754*hr), 2)-4.97 //bigcity && f≥300MHz
      var k = 3; //3 bigcity; 0 middle or small city；-12.25 suburban
      // var d; //distance bettwen T&R
      var L; //路径损耗
      var Gt = 11;// 天线增益，全向型天线一般为11dBi
      var Gr = 11;// 接收增益，手机天线接收收益一般为11dBi
      var Rx;// 边缘场强,0-140
      var Rs = -105;// 接收灵敏度，普通-85dBm，一般-105dBm，专业-120dBm

      L = 46.3+33.9*Math.log10(fre)-13.82*Math.log10(ht)+(44.9-6.55*Math.log10(ht))*Math.log10(d/1000)-α+k;
      Rx = Tx-L-20;//建筑外立面损耗30dB，链路裕量20dB

      return Rx;
    },
    // 反射场
    reflect: function(Ei, n, r) {
      var ε = 5;// 介电常数
      var nv = n.x*r.y-n.y*r.x;// 垂直单位法向矢量
      var nh = r.x*n.y-r.y*n.x;// 水平单位法向矢量
      var Ev;// 垂直极化电场
      var Eh;// 水平极化电场
      var E;// 反射电场
      // 求入射角
      var patternAB = Math.abs(r.x * n.x + r.y * n.y);
      var patternA = Math.sqrt(Math.pow(r.x, 2)+Math.pow(r.y, 2));
      var patternB = Math.sqrt(Math.pow(n.x, 2)+Math.pow(n.y, 2));
      var θ = Math.PI/2 - Math.acos(patternAB / (patternA * patternB));

      Ev = ((Ei*nv)*nv)*(Math.cos(θ)-Math.sqrt(ε-1+Math.pow(Math.cos(θ),2)))/(Math.cos(θ)+Math.sqrt(ε-1+Math.pow(Math.cos(θ),2)));
      Eh = ((Ei*nh)*nh)*(ε*Math.cos(θ)-Math.sqrt(ε-1+Math.pow(Math.cos(θ),2)))/(ε*Math.cos(θ)+Math.sqrt(ε-1+Math.pow(Math.cos(θ),2)));
      E = Ev + Eh;
      return E.toFixed(2);
    },
    // 绕射场
    diffraction: function() {
      
    },
    distanceForMaplCost231Hata: function(mapl) {
        var L = mapl - 20;
        var fre = 2400; // emission frequency
        var ht = 45; // base station height
        var hr = 1.7; //use floor height
        var α = 3.2*Math.pow(Math.log10(11.754*hr), 2)-4.97 //bigcity && f≥300MHz
        var k = 3; //3 bigcity; 0 middle or small city；-12.25 suburban
        var loss = 46.3+33.9*Math.log10(fre)-13.82*Math.log10(ht)-α+k;
        return Math.pow(10, (L - loss) / (44.9-6.55*Math.log10(ht))) * 1000;
    }
  }
