<?php

$jsonResponse = file_get_contents('countryBorders.geo.json');

$jsonResponse = json_decode($jsonResponse, true);




$output = array();
foreach ($jsonResponse['features'] as $feature) {
    $properties = $feature['properties'];
    $countryName = $properties['name'];
    $isoCode = $properties['iso_a2'];
    // Create option element
    $output[] = array(
        'name' => $countryName,
        'iso_code' => $isoCode
    );


}
;


header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);