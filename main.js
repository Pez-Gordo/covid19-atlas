var map = L.map('map').fitWorld();

var fullCountryArray = [];
var iso2CountryCode;

L.tileLayer('https://api.maptiler.com/maps/toner/{z}/{x}/{y}.png?key=ypfODnzHuwl0bYyyvG3i', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    crossOrigin: true
}).addTo(map)

map.setZoom(2);

$.ajax({
	url: "./geoJson.php",
	type: 'GET',
	dataType: "json",
    	
	success: function(result) {
        console.log('countries info', result)
    
        for (let i = 0; i < result.data.border.features.length; i++) {
            fullCountryArray.push(result.data.border.features[i])
            iso2CountryCode = result.data.border.features[i].properties.iso_a2;
            //console.log(iso2CountryCode)
        }
    },
    error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }

});

$.ajax({
    url: "./covid.php",
    type: 'GET',
    dataType: 'json',
    
    success: function(result) {                    
        console.log('covid info', result)
        for (var i = 0; i < fullCountryArray.length; i++) {
            for (var j = 0; j < result.covidData.data.length; j++) {
                if (fullCountryArray[i].properties.iso_a2 === result.covidData.data[j].code) {
                    var cases = result.covidData.data[j].latest_data.confirmed;
                    if (cases < 10000) {
                        L.geoJSON(fullCountryArray[i], {
                            color: '#a2fdc6',
                            stroke: false
                        }).addTo(map);
                    } else if (cases > 9999 && cases < 50000) {
                        L.geoJSON(fullCountryArray[i], {
                            color: '#53d38e',
                            stroke: false
                        }).addTo(map);
                    } else if (cases > 49999 && cases < 200000) {
                        L.geoJSON(fullCountryArray[i], {
                            color: '#00b363',
                            stroke: false
                        }).addTo(map);
                    } else if (cases > 199999 && cases < 50000) {
                        L.geoJSON(fullCountryArray[i], {
                            color: '#008d3d',
                            stroke: false
                        }).addTo(map);
                    } else if (cases > 499999 && cases < 1000000) {
                        L.geoJSON(fullCountryArray[i], {
                            color: '#006828',
                            stroke: false
                        }).addTo(map);
                    } else if (cases > 999999 && cases < 2500000) {
                        L.geoJSON(fullCountryArray[i], {
                            color: '#00481c',
                            stroke: false
                        }).addTo(map);
                    } else if (cases > 2500000) {
                        L.geoJSON(fullCountryArray[i], {
                            color: 'magenta',
                            transparency: 1,
                            
                            stroke: false
                        }).addTo(map);
                    } 
                    
                }
            }
            
        }
    
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
    }

});