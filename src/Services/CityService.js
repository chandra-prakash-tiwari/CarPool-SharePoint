import CityRecord from '../CityData/CityRecord.json';

export const CityService = {
    getValidCity,
    getCityDetails,
    distanceCalculator,
    dateUTCtoLocal,
    getCityById
}

function getValidCity(value) {
    if(value!=null)
        return CityRecord.filter((city) => city.Title.toLowerCase().includes(value.toLowerCase()));

    return CityRecord.filter((city) => city.Title.includes(value));
}

function getCityDetails(value) {
    if (value === null||value==='')
        return null;

    var city = CityRecord.filter((city) => city.Title.toLowerCase() === (value.toLowerCase()));
    return city[0];
}

function getCityById(id){
    return CityRecord.filter((a) => a.ID === id )[0].Title;
}

function distanceCalculator(from, to)
{
    var fromCity = getValidCity(from);
    var toCity = getValidCity(to);
    var radiusOverDegress = (Math.PI / 180);
    var srcLatROD = fromCity[0].Lat * radiusOverDegress;
    var srcLngROD = fromCity[0].Lng * radiusOverDegress;
    var descLatROD = toCity[0].Lat * radiusOverDegress;
    var descLngROD = toCity[0].Lng * radiusOverDegress;
    var lngDiff = descLngROD - srcLngROD;
    var latDiff = descLatROD - srcLatROD;
    var result1 = Math.pow(Math.sin(latDiff / 2.0), 2.0) + Math.cos(srcLatROD) * Math.cos(descLatROD) * Math.pow(Math.sin(lngDiff / 2.0), 2.0);
    var result2 = 3956.0 * 2.0 * Math.atan2(Math.sqrt(result1), Math.sqrt(1.0 - result1));
    return result2;
}

function dateUTCtoLocal(date){
    return new Date(date).toLocaleDateString();
}