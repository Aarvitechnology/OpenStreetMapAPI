var myURL = jQuery('script[src$="map-search.js"]').attr('src').replace('map-search.js', '');

var arr_lat_long = new Array();


/* To Find latitude  & longitude  of start point if doesn't get type from array then it will take first address of json as a start point*/
function GetLatLongStartPoint(street, city, county, state, country, postalcode) {
    $.ajax({
        url: 'https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&extratags=1&namedetails=1', //read comments in search.php for more information usage
        type: 'GET',
        async: false,
        data: {
            street: street,
            city: city,
            state: state,
            country: country,
            postalcode: postalcode
        },
        dataType: 'json',
        success: function(json) {

            if (json.length > 0) {

                first_res_obj = json[0];
                start_lng = parseFloat(first_res_obj.lon);
                start_lat = parseFloat(first_res_obj.lat);

                arr_lat_long.push([start_lat, start_lng]);

            } else {
                response_mapping = 'No Location Found';
                alert('Start Location Not Found For Street: ' + street + ', City: ' + city + ', State: ' + state + ', Country: ' + country);
            }



        }
    });
}

/* To Find latitude  & longitude  of other point */
function GetLatLong(street, city, county, state, country, postalcode, person_name, url, contact_number, i_count) {
    $.ajax({
        url: 'https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&extratags=1&namedetails=1', //read comments in search.php for more information usage
        type: 'GET',
        async: false,
        data: {
            street: street,
            city: city,
            state: state,
            country: country,
            postalcode: postalcode
        },
        dataType: 'json',
        success: function(json) {

            if (json.length > 0) {
                var html_dynamic = '<div> <b>Country: </b> ' + country + ' <br/><b>State: </b> ' +
                    state + ' <br/> <b>City: </b> ' +
                    city + ' <br/> <b>Person: </b> ' +
                    person_name + ' <br/> <b>Contact: </b> ' +
                    contact_number + ' <br/> <a href="' + url + '" target="_blank">' +
                    person_name + '</a>  </div>';

                var first_res_obj = json[0];
                var r_lon = parseFloat(first_res_obj.lon);
                var r_lat = parseFloat(first_res_obj.lat);

                arr_lat_long.push([r_lat, r_lon]);

                // L.marker([r_lat, r_lon], { icon: myIcon })
                //     .bindPopup(html_dynamic).bindTooltip(person_name).openTooltip().addTo(map);

                markerArray.push(L.marker([r_lat, r_lon], { icon: myIcon })
                    .bindPopup(html_dynamic).bindTooltip(person_name).openTooltip());

                var circle = L.circle([r_lat, r_lon], {
                    color: 'red',
                    weight: 2,
                    // fillColor: '#f03',
                    // fillOpacity: 0.5,
                    // stroke: true,
                    fill: false,
                    radius: 50,
                    dashArray: '20,15',
                }).addTo(map);


            } else {
                response_mapping = 'No Location Found';
                alert(response_mapping + ' [' + i_count + '] For Street: ' + street + ', City: ' + city + ', State: ' + state + ', Country: ' + country);
            }



        }
    });
}

var myPinIcon = L.icon({
    // iconUrl: myURL + 'images/red-star-icon-3.png',
    // iconRetinaUrl: myURL + 'images/red-star-icon-3.png',
    iconUrl: myURL + 'images/pin24-red.png',
    iconRetinaUrl: myURL + 'images/pin48-red.png',
    iconSize: [29, 24],
    iconAnchor: [9, 21],
    popupAnchor: [0, -14]
});

var start_lng = '';
var start_lat = '';
var start_html_dynamic = '';
var start_tooltip_dynamic = '';
var markerArray = [];
var map;
var start_point_count = 0;
for (var i = 0; i < markers.length; ++i) {
    if (markers[i].type == 'start_point') {

        start_point_count++;

        start_html_dynamic = '<div> <b>Country: </b> ' + markers[i].Mailing_Country + ' <br/><b>State: </b> ' +
            markers[i].Mailing_State + ' <br/> <b>City: </b> ' +
            markers[i].Mailing_City + ' <br/> <b>Person: </b> ' +
            markers[i].name + ' <br/> <b>Contact: </b> ' +
            markers[i].contact_number + ' <br/> <a href="' + markers[i].url + '" target="_blank">' +
            markers[i].name + '</a>  </div>';
        start_tooltip_dynamic = markers[i].name;
        if (markers[i].lng != "" && markers[i].lat != "") {
            start_lng = parseFloat(markers[i].lng);
            start_lat = parseFloat(markers[i].lat);
            arr_lat_long.push([start_lat, start_lng]);

        } else {

            var street = city = county = state = country = postalcode = '';
            var req_mapping = {};
            street = markers[i].Mailing_Street;
            city = markers[i].Mailing_City;
            state = markers[i].Mailing_State;
            country = markers[i].Mailing_Country;
            postalcode = markers[i].Mailing_Zip;
            GetLatLongStartPoint(street, city, county, state, country, postalcode);


        }
    }

}

if (start_point_count == 0) {

    start_html_dynamic = '<div> <b>Country: </b> ' + markers[0].Mailing_Country + ' <br/><b>State: </b> ' +
        markers[0].Mailing_State + ' <br/> <b>City: </b> ' +
        markers[0].Mailing_City + ' <br/> <b>Person: </b> ' +
        markers[0].name + ' <br/> <b>Contact: </b> ' +
        markers[0].contact_number + ' <br/> <a href="' + markers[0].url + '" target="_blank">' +
        markers[0].name + '</a>  </div>';
    start_tooltip_dynamic = markers[0].name;

    if (markers[0].lng != "" && markers[0].lat != "") {
        start_lng = parseFloat(markers[0].lng);
        start_lat = parseFloat(markers[0].lat);
        arr_lat_long.push([start_lat, start_lng]);
    } else {

        var street = city = county = state = country = postalcode = '';
        var req_mapping = {};
        street = markers[0].Mailing_Street;
        city = markers[0].Mailing_City;
        state = markers[0].Mailing_State;
        country = markers[0].Mailing_Country;
        postalcode = markers[0].Mailing_Zip;

        GetLatLongStartPoint(street, city, county, state, country, postalcode);

    }


}


var map = new L.Map('map', {
    // zoom: 4,
    zoom: 10,
    center: new L.latLng([start_lat, start_lng]),
    markerLocation: true
});

//

// L.marker([start_lat, start_lng], { icon: myPinIcon }).bindPopup(start_html_dynamic).addTo(map);
markerArray.push(L.marker([start_lat, start_lng], { icon: myPinIcon }).bindPopup(start_html_dynamic).bindTooltip(start_tooltip_dynamic).openTooltip());
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a', 'b', 'c']
}).addTo(map);

// drawn with dashes of 20 pixels followed by a space of 15 pixels (dashArray) 
var circle = L.circle([start_lat, start_lng], {
    color: 'red',
    weight: 2,
    // fillColor: '#f03',
    // fillOpacity: 0.5,
    // stroke: true,
    fill: false,
    radius: 50,
    dashArray: '20,15',
}).addTo(map);

// L.control.scale().addTo(map);

var myURL = jQuery('script[src$="map-search.js"]').attr('src').replace('map-search.js', '')

var myIcon = L.icon({
    iconUrl: myURL + 'images/pin24.png',
    iconRetinaUrl: myURL + 'images/pin48.png',
    iconSize: [29, 24],
    iconAnchor: [9, 21],
    popupAnchor: [0, -14]
});



if (start_point_count == 0) {
    init_i = 1;
    var i_count = 1;
} else {
    init_i = 0;
    var i_count = 0;
}
for (var i = init_i; i < markers.length; i++) {
    i_count++;
    if (markers[i].type != 'start_point') {


        if (markers[i].lng != "" && markers[i].lat != "") {

            var html_dynamic = '<div> <b>Country: </b> ' + markers[i].Mailing_Country + ' <br/><b>State: </b> ' +
                markers[i].Mailing_State + ' <br/> <b>City: </b> ' +
                markers[i].Mailing_City + ' <br/> <b>Person: </b> ' +
                markers[i].name + ' <br/> <b>Contact: </b> ' +
                markers[i].contact_number + ' <br/> <a href="' + markers[i].url + '" target="_blank">' +
                markers[i].name + '</a>  </div>';

            arr_lat_long.push([parseFloat(markers[i].lat), parseFloat(markers[i].lng)]);

            var circle = L.circle([parseFloat(markers[i].lat), parseFloat(markers[i].lng)], {
                color: 'red',
                weight: 2,
                // fillColor: '#f03',
                // fillOpacity: 0.5,
                // stroke: true,
                fill: false,
                radius: 50,
                dashArray: '20,15',
            }).addTo(map);

            // L.marker([markers[i].lat, markers[i].lng], { icon: myIcon })
            //     .bindPopup(html_dynamic).bindTooltip(markers[i].name).openTooltip().addTo(map);
            markerArray.push(L.marker([markers[i].lat, markers[i].lng], { icon: myIcon })
                .bindPopup(html_dynamic).bindTooltip(markers[i].name).openTooltip());

        } else {

            var street = city = county = state = country = postalcode = '';
            var req_mapping = {};

            street = markers[i].Mailing_Street;
            city = markers[i].Mailing_City;
            state = markers[i].Mailing_State;
            country = markers[i].Mailing_Country;
            postalcode = markers[i].Mailing_Zip;
            var person_name = markers[i].name;
            var contact_number = markers[i].contact_number;
            var url = markers[i].url;
            var name = markers[i].name;
            var i_count = i;

            GetLatLong(street, city, county, state, country, postalcode, person_name, url, contact_number, i_count);


        }
    }

}

var group = L.featureGroup(markerArray).addTo(map);
map.fitBounds(group.getBounds());

function GetAllLatLong() {
    return arr_lat_long;
}

var all_lat_long = GetAllLatLong();
console.log(all_lat_long);
L.control.scale().addTo(map);