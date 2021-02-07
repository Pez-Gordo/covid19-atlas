var map = L.map('map').fitWorld();

var fullCountryArray = [];
var iso2CountryCode;

L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=ypfODnzHuwl0bYyyvG3i', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    crossOrigin: true
}).addTo(map)

map.setZoom(2.5);

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
        //console.log(fullCountryArray[4])
        for (var i = 0; i < fullCountryArray.length; i++) {
            for (var j = 0; j < result.covidData.data.length; j++) {
                if (fullCountryArray[i].properties.iso_a2 === result.covidData.data[j].code) {
                    var cases = result.covidData.data[j].latest_data.confirmed;
                    var popup = "Country           --> " + result.covidData.data[j].name + "<br>" +
                    "Cases             --> " + result.covidData.data[j].latest_data.confirmed + "<br>" + 
                    "Deaths            --> " + result.covidData.data[j].latest_data.deaths + "<br>" +
                    "Death Rate        --> " + result.covidData.data[j].latest_data.calculated.death_rate + " %<br>" +
                    "Recovered         --> " + result.covidData.data[j].latest_data.recovered + "<br>" + 
                    //"Cases per Million --> " + result.covidData.data[j].latest_data.calculation.cases_per_million_population + "<br>" +
                    "Recovery Rate        --> " + result.covidData.data[j].latest_data.calculated.recovery_rate + " %";

                    if (cases < 10000) {
                        L.geoJSON(fullCountryArray[i], {
                            color: '#000000',
                            fillOpacity: 1,
                            fillColor: '#a2fdc6',
                            weight: 1,
                        }).addTo(map).bindPopup(popup);
                    } else if (cases > 9999 && cases < 50000) {
                        L.geoJSON(fullCountryArray[i], {
                            color: '#000000',
                            fillOpacity: 1,
                            fillColor: '#53d38e',
                            weight: 1,
                        }).addTo(map).bindPopup(popup);
                    } else if (cases > 49999 && cases < 200000) {
                        L.geoJSON(fullCountryArray[i], {
                            color: '#000000',
                            fillOpacity: 1,
                            fillColor: '##00b363',
                            weight: 1,
                        }).addTo(map).bindPopup(popup);
                    } else if (cases > 199999 && cases < 50000) {
                        L.geoJSON(fullCountryArray[i], {
                            color: '#000000',
                            fillOpacity: 1,
                            fillColor: '#008d3d',
                            weight: 1,
                        }).addTo(map).bindPopup(popup);
                    } else if (cases > 499999 && cases < 1000000) {
                        L.geoJSON(fullCountryArray[i], {
                            color: '#000000',
                            fillOpacity: 1,
                            fillColor: '#006828',
                            weight: 1,
                        }).addTo(map).bindPopup(popup);
                    } else if (cases > 999999 && cases < 2500000) {
                        L.geoJSON(fullCountryArray[i], {
                            color: '#000000',
                            fillOpacity: 1,
                            fillColor: '#00481c',
                            weight: 1,
                        }).addTo(map).bindPopup(popup);
                    } else if (cases > 2500000) {
                        L.geoJSON(fullCountryArray[i], {
                            color: '#000000',
                            fillOpacity: 1,
                            fillColor: '#000000',
                            weight: 1,
                            
                        }).addTo(map).bindPopup(popup);
                    } 
                    
                }
            }
            
        }
    
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
    }

});


var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend');
            //magnitudes = [0, 1, 2, 3, 4, 5, 6, 7];

        
            div.innerHTML = 
                            "&nbsp;&nbsp;< 9.999<i style='background: #a2fdc6'></i><br>" +
                            "&nbsp;&nbsp;10.000 - 49.999<i style='background: #53d38e'></i><br>" + 
                            "&nbsp;&nbsp;50.000 - 199.999<i style='background: #00b363'></i><br>" +
                            "&nbsp;&nbsp;200.000 - 499.999<i style='background: #008d3d'></i><br>" +
                            "&nbsp;&nbsp;500.000 - 999.999<i style='background: #006828'></i><br>" +
                            "&nbsp;&nbsp;1.000.000 - 2.499.999<i style='background: #00481c'></i><br>" +
                            "&nbsp;&nbsp;> 2.500.000<i style='background: #000000'></i><br>";
                            
        

        return div;
    };
    legend.addTo(map);


  