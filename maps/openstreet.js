var myURL = jQuery('script[src$="openstreet.js"]').attr('src').replace('openstreet.js', '');

var arr_lat_long = new Array();
var markerArray = [];
var arr_not_found_markers = new Array();
var map;

function GenrateOSMMap(map_element, arr_map_request, configuration_options) {

    var start_lng = '';
    var start_lat = '';
    var start_html_dynamic = '';
    var start_tooltip_dynamic = '';

    var start_point_count = 0;

    /* Create a Center Point*/

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
    for (var i = 0; i < arr_map_request.length; ++i) {
        if (arr_map_request[i].type == 'start_point') {

            start_point_count++;

            start_html_dynamic = '<div> <b>Country: </b> ' + arr_map_request[i].Mailing_Country + ' <br/><b>State: </b> ' +
                arr_map_request[i].Mailing_State + ' <br/> <b>City: </b> ' +
                arr_map_request[i].Mailing_City + ' <br/> <b>Person: </b> ' +
                arr_map_request[i].name + ' <br/> <b>Contact: </b> ' +
                arr_map_request[i].contact_number + ' <br/> <a href="' + arr_map_request[i].url + '" target="_blank">' +
                arr_map_request[i].name + '</a>  </div>';
            start_tooltip_dynamic = arr_map_request[i].name;
            if (arr_map_request[i].lng != "" && arr_map_request[i].lat != "") {
                start_lng = parseFloat(arr_map_request[i].lng);
                start_lat = parseFloat(arr_map_request[i].lat);
                arr_lat_long.push([start_lat, start_lng]);

            } else {

                var street = city = county = state = country = postalcode = '';
                var req_mapping = {};
                street = arr_map_request[i].Mailing_Street;
                city = arr_map_request[i].Mailing_City;
                state = arr_map_request[i].Mailing_State;
                country = arr_map_request[i].Mailing_Country;
                postalcode = arr_map_request[i].Mailing_Zip;
                GetLatLongStartPoint(street, city, county, state, country, postalcode);


            }
        }

    }

    if (start_point_count == 0) {

        start_html_dynamic = '<div> <b>Country: </b> ' + arr_map_request[0].Mailing_Country + ' <br/><b>State: </b> ' +
            arr_map_request[0].Mailing_State + ' <br/> <b>City: </b> ' +
            arr_map_request[0].Mailing_City + ' <br/> <b>Person: </b> ' +
            arr_map_request[0].name + ' <br/> <b>Contact: </b> ' +
            arr_map_request[0].contact_number + ' <br/> <a href="' + arr_map_request[0].url + '" target="_blank">' +
            arr_map_request[0].name + '</a>  </div>';
        start_tooltip_dynamic = arr_map_request[0].name;

        if (arr_map_request[0].lng != "" && arr_map_request[0].lat != "") {
            start_lng = parseFloat(arr_map_request[0].lng);
            start_lat = parseFloat(arr_map_request[0].lat);
            arr_lat_long.push([start_lat, start_lng]);
        } else {

            var street = city = county = state = country = postalcode = '';
            var req_mapping = {};
            street = arr_map_request[0].Mailing_Street;
            city = arr_map_request[0].Mailing_City;
            state = arr_map_request[0].Mailing_State;
            country = arr_map_request[0].Mailing_Country;
            postalcode = arr_map_request[0].Mailing_Zip;

            GetLatLongStartPoint(street, city, county, state, country, postalcode);

        }


    }

    /* End Create a Center Point*/

    /* Initialize a Map With Center Point*/
    var map = new L.Map('map', {
        zoom: configuration_options.center_zoom_level,
        // zoom: 10,
        center: new L.latLng([start_lat, start_lng]),
        markerLocation: true
    });

    //

    L.marker([start_lat, start_lng], { icon: myPinIcon }).bindPopup(start_html_dynamic).addTo(map);
    // markerArray.push(L.marker([start_lat, start_lng], { icon: myPinIcon }).bindPopup(start_html_dynamic).bindTooltip(start_tooltip_dynamic).openTooltip());
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: ['a', 'b', 'c']
    }).addTo(map);

    CreateMarkerCircle([start_lat, start_lng], map, configuration_options);

    /* End Initialize a Map With Center Point*/

    /* Initialize Other Markers*/

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
    for (var i = init_i; i < arr_map_request.length; i++) {
        i_count++;
        if (arr_map_request[i].type != 'start_point') {


            if (arr_map_request[i].lng != "" && arr_map_request[i].lat != "") {

                var html_dynamic = '<div> <b>Country: </b> ' + arr_map_request[i].Mailing_Country + ' <br/><b>State: </b> ' +
                    arr_map_request[i].Mailing_State + ' <br/> <b>City: </b> ' +
                    arr_map_request[i].Mailing_City + ' <br/> <b>Person: </b> ' +
                    arr_map_request[i].name + ' <br/> <b>Contact: </b> ' +
                    arr_map_request[i].contact_number + ' <br/> <a href="' + arr_map_request[i].url + '" target="_blank">' +
                    arr_map_request[i].name + '</a>  </div>';

                arr_lat_long.push([parseFloat(arr_map_request[i].lat), parseFloat(arr_map_request[i].lng)]);

                CreateMarkerCircle([parseFloat(arr_map_request[i].lat), parseFloat(arr_map_request[i].lng)], map, configuration_options);

                L.marker([arr_map_request[i].lat, arr_map_request[i].lng], { icon: myIcon })
                    .bindPopup(html_dynamic).bindTooltip(arr_map_request[i].name).openTooltip().addTo(map);
                // markerArray.push(L.marker([arr_map_request[i].lat, arr_map_request[i].lng], { icon: myIcon })
                //     .bindPopup(html_dynamic).bindTooltip(arr_map_request[i].name).openTooltip());

            } else {

                var street = city = county = state = country = postalcode = '';
                var req_mapping = {};

                street = arr_map_request[i].Mailing_Street;
                city = arr_map_request[i].Mailing_City;
                state = arr_map_request[i].Mailing_State;
                country = arr_map_request[i].Mailing_Country;
                postalcode = arr_map_request[i].Mailing_Zip;
                var person_name = arr_map_request[i].name;
                var contact_number = arr_map_request[i].contact_number;
                var url = arr_map_request[i].url;
                var name = arr_map_request[i].name;
                var i_count = i;

                GetLatLong(map, configuration_options, street, city, county, state, country, postalcode, person_name, url, contact_number, i_count, myIcon);


            }
        }

    }

    /* End Initialize Other Markers*/

    /* Adjust Zoom LEvel Based On All Markers */
    // var group = L.featureGroup(markerArray).addTo(map);
    // map.fitBounds(group.getBounds());
    /* End Adjust Zoom LEvel Based On All Markers */

    return arr_not_found_markers;
}

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
                arr_not_found_markers.push(0);
                alert('Start Location Not Found For Street: ' + street + ', City: ' + city + ', State: ' + state + ', Country: ' + country);
            }



        }
    });
}

/* To Find latitude  & longitude  of other point */
function GetLatLong(map_element, configuration_options, street, city, county, state, country, postalcode, person_name, url, contact_number, i_count, myIcon) {
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

                L.marker([r_lat, r_lon], { icon: myIcon })
                    .bindPopup(html_dynamic).bindTooltip(person_name).openTooltip().addTo(map_element);
                // L.marker([markers[i].lat, markers[i].lng], { icon: myIcon })
                // .bindPopup(html_dynamic).bindTooltip(markers[i].name).openTooltip().addTo(map);
                // markerArray.push(L.marker([r_lat, r_lon], { icon: myIcon })
                //     .bindPopup(html_dynamic).bindTooltip(person_name).openTooltip());

                // var circle = L.circle([r_lat, r_lon], {
                //     color: 'red',
                //     weight: 2,
                //     // fillColor: '#f03',
                //     // fillOpacity: 0.5,
                //     // stroke: true,
                //     fill: false,
                //     radius: 50,
                //     dashArray: '20,15',
                // }).addTo(map_element);
                // CreateMarkerCircle([r_lat, r_lon],);
                CreateMarkerCircle([r_lat, r_lon], map_element, configuration_options);

            } else {
                response_mapping = 'No Location Found';
                arr_not_found_markers.push(i_count);
                alert(response_mapping + ' [' + i_count + '] For Street: ' + street + ', City: ' + city + ', State: ' + state + ', Country: ' + country);
            }



        }
    });
}

function CreateMarkerCircle(LatLon, map_element, arr_config) {

    var unit_radius = '10';
    var unit_type = arr_config.unit_type;
    var unit = arr_config.radius_unit;
    if (unit_type == 'miles') {
        unit_radius = unit * 1609.344;
    } else if (unit_type == 'kilometers') {
        unit_radius = unit * 1000;
    }
    // By Default Circle radius is in meter
    // drawn with dashes of 20 pixels followed by a space of 15 pixels (dashArray) 
    L.circle(LatLon, {
        color: 'red',
        weight: 2,
        // fillColor: '#f03',
        // fillOpacity: 0.5,
        // stroke: true,
        fill: false,
        radius: unit_radius,
        dashArray: '20,15',
    }).addTo(map_element);
}