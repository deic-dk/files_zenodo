<?php

$clientAppID  = OC_Appconfig::getValue('files_zenodo', 'clientAppID');
$clientSecret = OC_Appconfig::getValue('files_zenodo', 'clientSecret');

OCP\JSON::success(array(
		'clientAppID' => $clientAppID,
		'clientSecret' => $clientSecret
));
