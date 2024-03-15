<?php




$jsonResponse = file_get_contents('countryBorders.geo.json');

$jsonResponse = json_decode($jsonResponse, true);




$output = null;
foreach ($jsonResponse['features'] as $feature) {
    if ($feature['properties']['iso_a2'] == $_REQUEST['countryCode']) {


        $output = $feature['geometry'];


        break;

    }
    ;
}







header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);


