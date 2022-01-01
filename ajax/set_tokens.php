<?php

$baseURL = $_POST['baseURL'];
$clientAppID = $_POST['clientAppID'];
$clientSecret = $_POST['clientSecret'];
$communities = $_POST['communities'];

OC_Appconfig::setValue('files_zenodo', 'baseURL', $baseURL);
OC_Appconfig::setValue('files_zenodo', 'clientAppID', $clientAppID);
OC_Appconfig::setValue('files_zenodo', 'clientSecret', $clientSecret);
OC_Appconfig::setValue('files_zenodo', 'communities', $communities);

OCP\JSON::success();
