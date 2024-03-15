// use user's  current location latitude and longitude to get country code from the geoname

//const map = L.map('map').setView([51.505, -0.09], 13);


//L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//  maxZoom: 19,
//attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//}).addTo(map);

var streets = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    {
        attribution:
            "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
    }
);

var satellite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
        attribution:
            "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
    }
);
var basemaps = {
    "Streets": streets,
    "Satellite": satellite
};

var map = L.map("map", {
    layers: [streets]
}).setView([35.5, -4], 6);

var layerControl = L.control.layers(basemaps).addTo(map);



L.easyButton("fa-solid fa-city", function (btn, map) {
    $("#capitalModal").modal("show");
}).addTo(map);


$('#closeCapitalModal').click(function () {
    $("#capitalModal").modal('hide');
});

$('#capitalMinimiseButton').click(function () {
    $("#capitalModal").modal('hide');
});

L.easyButton("fa-solid fa-people-group", function (btn, map) {
    $("#populationModal").modal("show");
}).addTo(map);


$('#closePopulationModal').click(function () {
    $("#populationModal").modal('hide');
});


$('#minimisePopulationButton').click(function () {
    $("#populationModal").modal('hide');
});


L.easyButton("fa-solid fa-temperature-three-quarters", function (btn, map) {
    $("#weatherModal").modal("show");
}).addTo(map);


$('#weatherCloseModal').click(function () {
    $("#weatherModal").modal('hide');
});

$('#weatherMinimiseButton').click(function () {
    $("#weatherModal").modal('hide');
});

L.easyButton("fa-solid fa-wallet", function (btn, map) {
    $("#currencyModal").modal("show");
}).addTo(map);


$('#currencyCloseModal').click(function () {
    $("#currencyModal").modal('hide');
});

$('#minimiseCurrencyButton').click(function () {
    $("#currencyModal").modal('hide');
});



L.easyButton("fa-brands fa-wikipedia-w", function (btn, map) {
    $("#wikipediaModal").modal("show");
}).addTo(map);


$('#wikipediaCloseModal').click(function () {
    $("#wikipediaModal").modal('hide');
});

$('#wikipediaMinimiseButton').click(function () {
    $("#wikipediaModal").modal('hide');
});




//getting latitude and longitude of user's current location

navigator.geolocation.getCurrentPosition(success, error);

//let marker  circle, border;

let marker = null;
let circle = null;
let border = null;


function success(pos) {


    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const accuracy = pos.coords.accuracy;
    let coords = { "lat": lat, "lng": lng };

    //adding marker and circle to the map

    if (border) {

        border.clearLayers()

    };

    if (marker) {

        marker.clearLayers()

    };

    if (circle) {

        circle.clearLayers()

    };
    marker = L.marker([lat, lng]).addTo(map);
    circle = L.circle([lat, lng], { radius: accuracy }).addTo(map);






    //view set to lat and lng

    map.setView([lat, lng]);

    // AJAX request with coords to geoNames to get country code






    $.ajax({
        url: "./countryname.php",
        type: "POST",
        dataType: "JSON",
        // passing lat and lng from the current location
        data: coords,

        success: function (result) {
            // console.log(JSON.stringify(result));


            if (result.status.name == "ok") {
                $(result["data"]["countryCode"]);
                let currCode = result.data;
                // console.log(currCode);
                $('#countryCode').html(currCode);
                $('select').val(result.data).change();




            };




        },
        error: function (jqXHR, textStatus, errorThrown) {

            console.log(jqXHR);
            console.log(" No current location data available.")
        }





    })



    //dynamically populating drop down menu with country names 
    //when the map is clicked

    $.ajax({
        url: './populatingcountryname.php',
        type: 'GET',
        dataType: 'JSON',
        //data: { countryCode: $('#selCountry').val() },


        success: function (data) {


            //$('#selCountry').empty();

            const select = document.getElementById('selCountry');
            data.forEach(country => {
                const option = document.createElement('option');
                option.value = country.iso_code;
                option.textContent = country.name;
                select.appendChild(option);






            });


        },
        //error: function (jqXHR, textStatus, errorThrown) {

        //  console.log(jqXHR);
        //console.log(" No current location data available.")
        // }


    })


    $.ajax({

        url: './countryInfo.php',
        type: 'POST',
        dataType: 'JSON',
        data: {
            country: $('#selCountry').val()



        },
        success: function (result) {





            if (result.status.name == 'ok') {
                $('#capital').html(result['data'][0]['capital']);
                $('#population').html(result['data'][0]['population']);



            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(" No current location data available.")
        }

    })



    //requesting weather details and country code for current location

    $.ajax({
        url: "./weatherAPI.php",
        type: "POST",
        dataType: "JSON",
        // passing lat and lng from the current location
        data: coords,

        success: function (result) {
            console.log(JSON.stringify(result));

            $('countryCode').html(result);
            if (result.status.name == "ok") {

                $('#weather').html(result['data']['temperature']);

                $('#humidity').html(result['data']['humidity']);









            };

        },


        error: function (jqXHR, textStatus, errorThrown) {
            console.log(" No current location data available.")
        }
    });






}





function error(err) {
    if (error.code === 1) {
        alert("Location access denied")
    } else {
        alert("Cannot obtain the location")
    }
}


function error(err) {
    alert("Geolocation access denied")

}














$('#selCountry').on("change", function () {
    let countryCode = $('<select>').append('<option>').val();
    let countryName = $('#selCountry').text();
    $('#countryCode').html(countryCode);

    $.ajax({
        url: './countryborder.php',
        type: 'POST',
        dataType: 'JSON',
        data: { countryCode: $('#selCountry').val() },

        success: function (coordinates) {




            ////////////////////
            var showOnTheMap = L.geoJSON(coordinates, {
                style: function (feature) {
                    return {
                        color: 'gray',
                        weight: 2,
                        opacity: 1
                    }
                }
            }).addTo(map);

            /////////////////


            map.fitBounds(showOnTheMap.getBounds());



            //using coordinates to pass to php to get weather info
            $.ajax({
                url: './weatherAPI.php',
                type: 'POST',
                dataType: 'JSON',
                data: coordinates,



                success: function (result) {
                    //console.log(JSON.stringify(result));



                    if (result.status.name == "ok") {
                        $('#weather').html(result['data']['temperature']);

                        $('#humidity').html(result['data']['humidity']);
                        //$('#countryCode').html(result['data']['countryCode']);


                    }

                },

            })



        },


        error: function (jqXHR, textStatus, errorThrown) {

            console.log(jqXHR);
            console.log(" No current location data available.")
        }
    })

})












//user clicks on the country on the map and gets the borders and country code
function onMapClick(e) {




    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    $.ajax({
        url: './countryname.php',
        type: 'POST',
        dataType: 'JSON',
        data: { lat: lat, lng: lng },

        success: function (result) {
            console.log(JSON.stringify(result));


            if (result.status.name == "ok") {
                $(result["data"]["countryCode"]);
                let currCode = result.data;
                console.log(currCode);

                $('#countryCode').html(result["data"]["countryCode"]);

                $('select').val(currCode).change();





            };


            // Add country borders as a GeoJSON layer to the map
            L.geoJSON(result).addTo(map);
            var showCountryBorders = L.geoJSON(result5, {
                style: function (result) {
                    return {
                        color: 'gray',
                        weight: 2,
                        opacity: 1
                    }
                }
            }).addTo(map);




            map.fitBounds(showCountryBorders.getBounds());

        }

    })

    $.ajax({
        url: './weatherAPI.php',
        type: 'POST',
        dataType: 'JSON',
        data: { lat: lat, lng: lng },

        success: function (result) {
            console.log(JSON.stringify(result));



            if (result.status.name == "ok") {
                $('#weather').html(result['data']['temperature']);

                $('#humidity').html(result['data']['humidity']);
                // $('#countryCode').html(result['data']['countryCode']);

            }



        },





        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log("No country border data available.");
        }
    });




}






// Add click event listener to the map
map.on('click', onMapClick);

// user obtains  capital and population  of selected country 
//when selecting the country from drop down menu
$('#selCountry').on("change", function () {
    let countryCode = $('<select>').append('<option>').val();
    let countryN = $('#selCountry').text();











    $.ajax({

        url: './countryInfo.php',
        type: 'POST',
        dataType: 'JSON',
        data: {
            country: $('#selCountry').val()



        },
        success: function (result) {
            console.log(result);



            if (result.status.name == 'ok') {
                $('#capital').html(result['data'][0]['capital']);
                $('#population').html(result['data'][0]['population']);


            }


            $.ajax({

                url: './WikipediaAPI.php',
                type: 'POST',
                dataType: 'JSON',
                data: {
                    q: result['data'][0]['capital']
                },





                success: function (result1) {




                    console.log(result1);

                    if (result1.status.name == 'ok') {
                        $('#wikipedia').html(result1['data']['geonames'][0]['summary']);
                        // it gives the country code when user selects the country from drop down menu
                        //$('#countryCode').html(result1['data']['geonames'][9]['countryCode']);


                    }


                }

            })




            $.ajax({
                url: './currencyAPI.php',
                type: 'POST',
                dataType: 'JSON',
                data: {
                    country: $('#selCountry').text()
                },
                success: function (result2) {
                    if (result2.length > 0) {
                        var currencyName = result2[0]['currency_name'];
                        $('#currency').html(currencyName);
                    } else {
                        // Handle case where country currency not found
                        $('#currency').html('Currency not found');
                    }
                },
                error: function () {
                    // Handle error
                    $('#currency').html('Error fetching currency');
                }
            });



            $.ajax({

                url: './searchAPI.php',
                type: 'POST',
                dataType: 'JSON',
                data: {
                    q: result['data'][0]['capital']
                },





                success: function (result3) {




                    console.log(result3);

                    if (result3.status.name == 'ok') {
                        $('#airport').html(result3['data']['geonames'][1]['asciiName']);


                    }






                },

                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(" No current location data available.")
                }


            })


        },


    })




})





