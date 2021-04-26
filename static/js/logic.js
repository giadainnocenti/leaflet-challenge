// Create a map object
var myMap = L.map("mapid", {
  center: [39.8283, -98.5795],
  zoom: 5
});

// adding the base map
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
}).addTo(myMap);

function createMarkers(response){
	console.log(response)
	for (var i=0; i< response.features.length; i++){
			//retrieve the coordinates for each marker
			coords = [response.features[i].geometry.coordinates[1], response.features[i].geometry.coordinates[0]]
			// retrieving the depth of the earthquake - it will determine the color of the circle
			var depth = response.features[i].geometry.coordinates[2];
			
			//inset data in the popup
			var date = new Date(response.features[i].properties.time*1000)
			var loc = response.features[i].properties.place
			var mag = response.features[i].properties.mag

        // Create the circles for each earthquake report and add to the baseMap layer.
        L.circle(coords, {
            opacity: .5,
            fillOpacity: 0.75,
            weight: .5,
            color: 'black',
            fillColor: colorDepth(depth),
            radius: 7000 * response.features[i].properties.mag
    }).bindPopup(`<p align = "left"> <strong>Date:</strong> ${date} <br>
     <strong>Location:</strong> ${loc} <br> <strong>Magnitude:</strong> ${mag} </p>`).addTo(myMap)
	};
};
//function to picke the color
function colorDepth(depth){
	switch(true){
            case (depth > -10 && depth < 10):
                color = 'rgb(19, 235, 45)'
                break;
            case (depth >= 10 && depth < 30):
                color = 'rgb(138, 206, 0)'
                break;
            case (depth >= 30 && depth < 50):
                color = 'rgb(186, 174, 0)'
                break;
            case (depth >= 50 && depth < 70):
                color = 'rgb(218, 136, 0)'
                break;
            case ( depth >= 70 && depth < 90):
                color = 'rgb(237, 91, 0)'
                break;
            case (depth >= 90):
                color = 'rgb(242, 24, 31)'
                break;
        };
		return color
};
newMarker = L.layer
//function to create the legend
function CreateLegend(){
    var div = L.DomUtil.create('div', 'info legend');
    var grades = ['-10-10', '10-30', '30-50', '50-70', '70-90', '90+'];
    var colors = [
        'rgb(19, 235, 45)',
        'rgb(138, 206, 0)',
        'rgb(186, 174, 0)',
        'rgb(218, 136, 0)',
        'rgb(237, 91, 0)',
        'rgb(242, 24, 31)'
        ];
    var labels = [];
    // loop through our density intervals and generate a label with a colored square for each interval
    grades.forEach(function(grade, index){
        labels.push("<div class = 'row'><li style=\"background-color: " + colors[index] +  "; width: 10px"+ "; height: 10px" + "\"></li>" + "<li>" + grade + "</li></div>");
    })
  
    div.innerHTML += "<ul>" + labels.join("") +"</ul>";
    return div;
};
//adding a legend to the map
var legend = L.control({position: 'bottomright'});
legend.onAdd = CreateLegend
legend.addTo(myMap)

//call to fetch all the data to show on the map
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson").then(createMarkers);