<?php

OCP\JSON::checkAppEnabled('files_zenodo');
OCP\JSON::checkLoggedIn();

$filename = $_POST["filename"];
$dir = $_POST["dir"];
$metadata = $_POST["metadata"]; 
$sandbox_token = OC_Appconfig::getValue('files_zenodo', 'sandboxtoken');
$production_token = OC_Appconfig::getValue('files_zenodo', 'productiontoken');

$sandboxurl    = "https://sandbox.zenodo.org/api/deposit/depositions?access_token=" . $sandbox_token;
$productionurl = "https://zenodo.org/api/deposit/depositions?access_token=" . $production_token;

$options = array(
	'http' => array(
		'header' => "Content-type: application/x-www-form-urlencoded\r\n",
		'method' => 'POST',
		'content' => http_build_query($metadata)
	)
);

$context = stream_context_create($options);
$result  = file_get_contents($sandboxurl, false, $context);

OCP\JSON::success($result);

