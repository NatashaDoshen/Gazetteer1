<?php


$jsonResponse = file_get_contents('country-by-currency-name.json');

$jsonResponse = json_decode($jsonResponse, true);

$requestedCountry = $_POST['country'];

$currencyName = null;

foreach ($jsonResponse as $countryData) {
    $country = $countryData['country'];

    if ($country == $requestedCountry) {
        $currencyName = $countryData['currency_name'];


        break;
    }
}

$output = ['currency_name' => $currencyName];

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);

