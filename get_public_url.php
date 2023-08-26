<?php

require_once 'base.php';
OCP\JSON::checkAppEnabled('files_sharding');

$user = OCP\USER::getUser();
// This is to allow ScienceRepository/Zenodo to query for user matching share
if(empty($user)){
	$user = \OC_Chooser::checkIP();
}
if(empty($user)){
	if(!OCA\FilesSharding\Lib::checkIP()){
		http_response_code(401);
		exit;
	}
}

$path = $_REQUEST['path'];
$group = empty($_REQUEST['group'])?null:$_REQUEST['group'];

$fileSource = \OCA\FilesSharding\Lib::getFileId($path, $user_id, $group);
//$itemSource = \OCA\FilesSharding\Lib::getItemSource($fileSource);
$share = \OC\Share\Share::getItemSharedWithByLink('file'/*file or folder*/, $fileSource, $user);
$url = '';

\OCP\Util::writeLog('files_zenodo', 'file_source: '.$fileSource, \OC_Log::WARN);
//\OCP\Util::writeLog('files_zenodo', 'item_source: '.$itemSource, \OC_Log::WARN);

if(!empty($share['token'])){
	$url = \OCA\FilesSharding\Lib::getMasterURL().'shared/'.$share['token'];
}
OCP\JSON::encodedPrint($url);
