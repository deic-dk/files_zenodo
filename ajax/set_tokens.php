<?php

$clientAppID = $_POST['clientAppID'];
$clientSecret = $_POST['clientSecret'];

OC_Appconfig::setValue('files_zenodo', 'clientAppID', $clientAppID);
OC_Appconfig::setValue('files_zenodo', 'clientSecret', $clientSecret);

OCP\JSON::success();
