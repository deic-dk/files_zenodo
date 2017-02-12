<?php

$depositURL = "https://zenodo.org/deposit/";
$apiURL = "https://zenodo.org/api/deposit/depositions/";

\OCP\Util::writeLog('files_zenodo', 'REQUEST_URI: '.$_SERVER['REQUEST_URI'].'-->'.
		serialize($_GET), \OC_Log::WARN);

if(empty($_GET['access_token'])){
	echo "<script type='text/javascript'>var url=window.location.href.replace(window.location.hash,'')".
	"+'?'+window.location.hash.replace('#', ''); ".
			"/*alert('Will now upload file to '+url); */window.location.href=url;</script>";
}
else{

$token = $_GET['access_token'];
$fileId =  $_GET['state'];
$user = \OCP\User::getUser();
$clientAppID  = OC_Appconfig::getValue('files_zenodo', 'clientAppID');
$clientSecret = OC_Appconfig::getValue('files_zenodo', 'clientSecret');

\OCP\Util::writeLog('files_zenodo','Received token: '.$token.', file: '.$fileId, \OC_Log::WARN);

// First check if metadata has been filled out.
OCP\JSON::checkAppEnabled('meta_data');
$zenodoTagID = \OCA\meta_data\Tags::getTagID('Zenodo', $user);

$fileTags = \OCA\meta_data\Tags::getFileTags(array($fileId), $user, array($user));
if(!in_array($zenodoTagID, $fileTags[$fileId])){
	echo('ERROR: Zenodo tag not found or not public. '.$user);
	die;
}

$zenodoTagInfo = \OCA\meta_data\Tags::getUserFileTags($user, array($fileId), array($zenodoTagID));
if(!in_array($zenodoTagID, $fileTags[$fileId])){
	echo('ERROR: Your file must have Zenodo metadata assigned before publishing.');
	die;
}

$zenodoFileTag = $zenodoTagInfo->filestags[$fileId]->getFileTag($zenodoTagID);
$metadata = $zenodoFileTag->getMetadata();

$percent = 0;
function curlProgressCallback($resource, $download_size = 0, $downloaded = 0,
		$upload_size = 0, $uploaded = 0){
	global $percent;
	if($upload_size>0){
		$newPercent = round(100*$uploaded/$upload_size);
		if($newPercent>$percent){
			$percent = $newPercent;
			echo '<pb>'.$percent.'</pb>';
			flush();
			\OCP\Util::writeLog('files_zenodo','Progress: '.$percent.'%', \OC_Log::WARN);
		}
	}
}

function curlInit($url, $content, $contentType="application/json", $infile=null){
	$curl = curl_init();
	curl_setopt($curl, CURLOPT_URL, $url);
	$httpHeaders  = array();
	$httpHeaders[] = "User-Agent: curl";
	$httpHeaders[] = "Content-Type: ".$contentType;
	if(!empty($infile)){
		curl_setopt($curl, CURLOPT_TIMEOUT, 86400); // 1 Day Timeout
		curl_setopt($curl, CURLOPT_NOPROGRESS, false);
		curl_setopt($curl, CURLOPT_PROGRESSFUNCTION, 'curlProgressCallback');
		curl_setopt($curl, CURLOPT_BUFFERSIZE, 128);
		curl_setopt($curl, CURLOPT_FORBID_REUSE, false);
		curl_setopt($curl, CURLOPT_FRESH_CONNECT, false);
		curl_setopt($curl, CURLOPT_SAFE_UPLOAD, false);
	}
	curl_setopt($curl, CURLOPT_HTTPHEADER, $httpHeaders);
	curl_setopt($curl, CURLOPT_HEADER, false);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_POST, true);
	curl_setopt($curl, CURLOPT_POSTFIELDS, $content);
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
	curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);
	curl_setopt($curl, CURLOPT_FOLLOWLOCATION, TRUE);
	curl_setopt($curl, CURLOPT_UNRESTRICTED_AUTH, TRUE);
	curl_setopt($curl, CURLINFO_HEADER_OUT, TRUE);
	return $curl;
}

// Show confirmation
$tmpl = new OCP\Template("files_zenodo", "thanks");
$tmpl->assign('url', $depositURL);
$tmpl->printPage();
flush();

// Create record if not already created
if(!empty($metadata->getValue('deposition_id'))){
	$depositId = $metadata->getValue('deposition_id');
}
else{
	$url = $apiURL."?access_token=".$token;
	$content = '{"metadata":'.json_encode($metadata).'}';
	\OCP\Util::writeLog('files_zenodo','Creating record at: '.$url.'. Metadata: '.$content, \OC_Log::WARN);
	$curl = curlInit($url, $content);
	$json_response = curl_exec($curl);
	$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
	if($status===0 || $status>=300 || $json_response===null || $json_response===false){
		echo('ERROR: bad response. '.$json_response);
		die;
	}
	else{
		$response = json_decode($json_response, true);
	}
	curl_close($curl);
	if(!empty($response) && !empty($response['id'])){
		$depositId = $response['id'];
		// Write ID to metadata record
		$depositIdKey = \OCA\meta_data\Tags::getKeyID($zenodoTagID, 'deposition_id', $user);
		\OCA\meta_data\Tags::updateFileKeyVal($fileId, $zenodoTagID, $depositIdKey, $depositId);
	}
}

// Upload file if not already uploaded
if(!empty($metadata->getValue('uploaded')) && $metadata->getValue('uploaded')=='yes'){
	echo '<div class="upload_info alert alert-info">File already uploaded.</div>';
}
elseif(!empty($depositId)){
	echo '<span class="deposit_id">'.$depositId.'</span>';
	$filepath = \OC\Files\Filesystem::getpath($fileId);
	$group = null;
	if(empty($filepath) && \OCP\App::isEnabled('user_group_admin')){
		// Not found in files/, try user_group_admin/
		if(empty($fs)){
			$fs = \OCP\Files::getStorage('user_group_admin');
		}
		$filepath = $fs->getPath($fileId);
		// Now get the group name
		if(!empty($filepath)){
			$gIndex = strpos($filepath, '/', 1);
			$group = $gIndex>0?substr($filepath, 1, $gIndex-1):'';
			$view = new \OC\Files\View('/'.$owner.'/user_group_admin/'.$group);
			\OCP\Util::writeLog('files_zenodo', 'Group: '.$row['fileid'].'-->'.$filepath.'-->'.$group, \OC_Log::WARN);
		}
	}
	if(empty($filepath)){
		\OCP\Util::writeLog('meta_data', 'No path info for '.$row['fileid'].'-->'.$filepath, \OC_Log::WARN);
	}
	if(!empty($group)){
		\OCP\Util::writeLog('files_zenodo', 'Group: '.$group, \OC_Log::WARN);
		$absolutePath = $view->getAbsolutePath($filepath);
	}
	else{
		list($st, $internalPath) = \OC\Files\Filesystem::resolvePath('/' . $user . '/files' . $filepath);
		$storage = \OC\Files\Filesystem::getStorage($st);
		$absolutePath = $storage->getLocalFile('/' . $user . '/files' . $filepath);
		\OCP\Util::writeLog('files_zenodo', 'Absolute path of '.$filepath.
				':'.serialize($absolutePath).':'.serialize($internalPath), \OC_Log::WARN);
	}
	$pathInfo= pathinfo($absolutePath);
	$filename = $pathInfo['basename'];
	$absolutePath = realpath($absolutePath);
	$cFile = '@' . stripslashes($absolutePath);
	$content = array('name'=>$filename, 'file'=>$cFile);
	$url = $apiURL.$depositId."/files?access_token=".$token;
	
	\OCP\Util::writeLog('files_zenodo','Uploading '.$filepath.' ('.$absolutePath.') to: '.
			$url.'. Content: '.$cFile, \OC_Log::WARN);
	
	if(empty($absolutePath)){
		\OCP\Util::writeLog('meta_data', 'Could not get absoute path of '.$filepath.
				':'.serialize($absolutePath), \OC_Log::WARN);
		die;
	}
	
	$curl = curlInit($url, $content, "multipart/form-data", $absolutePath);
	$json_response = curl_exec($curl);
	$info = curl_getinfo($curl);
	$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
	
	if($status===0 || $status>=300 || $json_response===null || $json_response===false){
		echo('ERROR: bad response. '.$json_response);
		\OCP\Util::writeLog('files_zenodo','ERROR: '.
				$json_response.' -- '.$status.' -- '.serialize($info), \OC_Log::ERROR);
		die;
	}
	else{
		// Flag as uploaded
		$uploadedKey = \OCA\meta_data\Tags::getKeyID($zenodoTagID, 'uploaded', $user);
		\OCA\meta_data\Tags::updateFileKeyVal($fileId, $zenodoTagID, $uploadedKey, 'yes');
	}
	
	curl_close($curl);
}
else{
	OCP\JSON::error();
}

}
