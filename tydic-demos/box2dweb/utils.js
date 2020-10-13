function titleOf(lon, lat, z) {
    z = z || 21;
    lat = radius(lat);
    z = Math.pow(2, z - 1);
    return [Math.floor(z * (lon / 180 + 1)), Math.ceil(z * (1 - (Math.log(Math.tan(lat) + 1 / Math.cos(lat))) / Math.PI))];
}

function radius(degree) {
    return parseFloat(degree) / 180 * Math.PI;
}