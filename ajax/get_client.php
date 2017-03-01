<?php

$clientAppID  = OC_Appconfig::getValue('files_zenodo', 'clientAppID');
$clientSecret = OC_Appconfig::getValue('files_zenodo', 'clientSecret');

$appUri = \OC::$WEBROOT . '/apps/files_zenodo/receive_token.php';
$redirectURL = (empty($_SERVER['HTTPS'])?'http':'https') . '://' . $_SERVER['SERVER_NAME'] .
	$appUri;


OCP\JSON::success(array(
	'redirectURL' => $redirectURL,
	'clientAppID' => $clientAppID,
	'clientSecret' => $clientSecret
));
