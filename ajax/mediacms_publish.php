<?php

$fileid = $_POST['fileid'];
$filename = $_POST['filename'];
$group = $_POST['group'];
$title = $_POST['title'];
$description = $_POST['description'];
$category = $_POST['category'];
$i = $_POST['i'];

// We use the same unique WAYF/eduGAIN user ID on both sciencedata.dk and media.sciencedata.dk
$userID  = OCP\User::getUser();
// Users on media.sciencedata.dk cannot log in with username/password - they don't know their password
$password = OC_Appconfig::getValue('files_zenodo', 'mediaCmsToken');
$baseurl = OC_Appconfig::getValue('files_zenodo', 'mediaCmsURL', 'https://media.sciencedata.dk');

$apiURL  = $baseurl.'/api/v1';
$myMediaURL  = $baseurl.'/user/'.$userID;

$userEmail = \OCP\Config::getUserValue($userID, 'settings', 'email');

// Log in

function curlInit($url){
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_HEADER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
	curl_setopt($ch, CURLOPT_FAILONERROR, false);
	curl_setopt($ch, CURLOPT_FORBID_REUSE, true);
	curl_setopt($ch, CURLOPT_FRESH_CONNECT, true);
	$headerArray =  Array("Accept-Language: en-us;q=0.7,en;q=0.3",
			"Accept-Charset: utf-8,windows-1251;q=0.7,*;q=0.7", "Pragma: no-cache",
			"Cache-Control: no-cache", "Connection: Close", "User-Agent: ScienceData");
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headerArray);
	//curl_setopt($ch, CURLOPT_NOBODY, true);
	curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 120);
	curl_setopt($ch, CURLOPT_TIMEOUT, 120);
	return $ch;
}

$curl = curlInit($apiURL.'/login');
curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC) ;
curl_setopt($curl, CURLOPT_USERPWD, $userEmail.":".$password);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_HEADER, false);
curl_setopt($curl, CURLOPT_POSTFIELDS, array('email'=>$userEmail, 'password'=>$password));
$json_response = curl_exec($curl);
$status = curl_getinfo($curl);
curl_close($curl);

if(empty($status['http_code']) || $status['http_code']===0 || $status['http_code']>=300 ||
		$json_response===null || $json_response===false){
			\OCP\Util::writeLog('files_sharding', 'ERROR: bad ws response from '.$apiURL.'/login'.' : '.
			serialize(array('email'=>$userEmail, 'password'=>$password)).' : '.
			serialize($status).' : '.$json_response, \OC_Log::ERROR);
	header('HTTP/1.0 401 Unauthorized');
	\OCP\JSON::error(array('message' => $json_response));
	exit;
}

\OCP\Util::writeLog('files_zenodo', 'Auth response '.$json_response, \OC_Log::WARN);

$asArray = true;
$response = json_decode($json_response, $asArray);
$authKey = $response["token"];

// Upload the video file

$full_path = \OCA\FilesSharding\Lib::getFullPath($filename, '', $userID, $fileid, $group);

\OCP\Util::writeLog('files_zenodo', 'Uploading '.$full_path.' to MediaCMS with credentials '.$userEmail.":".$authKey, \OC_Log::WARN);
$cFile = curl_file_create($full_path);
$curl = curlInit($apiURL.'/media');
curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC ) ;
curl_setopt($curl, CURLOPT_USERPWD, $userEmail.":".$authKey);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, array('media_file' => $cFile,
		'description' => $description, 'title'=> $title));

$headerArray[] =  'authorization: Token '.$authKey;
curl_setopt($curl, CURLOPT_HTTPHEADER, $headerArray);

$json_response = curl_exec($curl);
$status = curl_getinfo($curl);
curl_close($curl);

if(empty($status['http_code']) || $status['http_code']===0 || $status['http_code']>=300 ||
		$json_response===null || $json_response===false){
	\OCP\Util::writeLog('files_zenodo', 'ERROR: bad ws response from '.$url.' : '.
			serialize($status).' : '.$json_response, \OC_Log::ERROR);
	header('HTTP/1.0 401 Unauthorized');
	\OCP\JSON::error(array('message' => $json_response));
	exit;
}

OCP\JSON::encodedPrint(array(
	'mediaURL' => $myMediaURL,
	'i' => ($i + 1)
));


