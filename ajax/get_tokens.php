<?php

$baseURL  = OC_Appconfig::getValue('files_zenodo', 'baseURL');
$clientAppID  = OC_Appconfig::getValue('files_zenodo', 'clientAppID');
$clientSecret = OC_Appconfig::getValue('files_zenodo', 'clientSecret');
$communities = OC_Appconfig::getValue('files_zenodo', 'communities');
$mediaCmsURL = OC_Appconfig::getValue('files_zenodo', 'mediaCmsURL');
$mediaCmsToken = OC_Appconfig::getValue('files_zenodo', 'mediaCmsToken');

OCP\JSON::success(array(
		'baseURL' => $baseURL,
		'clientAppID' => $clientAppID,
		'clientSecret' => $clientSecret,
		'communities' => $communities,
		'mediaCmsURL' => $mediaCmsURL,
		'mediaCmsToken' => $mediaCmsToken
));
