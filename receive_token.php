<script type="text/javascript" src="/core/js/jquery-1.10.0.min.js"></script>

<?php

require_once 'base.php';

OCP\JSON::checkAppEnabled('files_sharding');

\OCP\Util::writeLog('files_zenodo', 'REQUEST_URI: '.$_SERVER['REQUEST_URI'].', HTTP_REFERER: '.$_SERVER['HTTP_REFERER'].'-->'.
		serialize($_GET), \OC_Log::WARN);

function makeCurlFile($file){
	$mime = mime_content_type($file);
	$info = pathinfo($file);
	$name = $info['basename'];
	$output = new CURLFile($file, $mime, $name);
	return $output;
}

function curlInit($url, $content, $infile=null, $newFileApi=false, $fh=null){
	$curl = curl_init();
	$httpHeaders  = array();
	$httpHeaders[] = "User-Agent: curl";
	curl_setopt($curl, CURLOPT_URL, $url);
	if(!empty($infile) && !empty($fh) && $newFileApi){
		$contentType = "application/octet-stream";
		curl_setopt($curl, CURLOPT_PUT, 1);
		curl_setopt($curl, CURLOPT_INFILE, $fh);
		curl_setopt($curl, CURLOPT_INFILESIZE, filesize($infile));
		\OCP\Util::writeLog('files_zenodo','PUTTING file to '.$url, \OC_Log::WARN);
	}
	else{
		$contentType = "multipart/form-data";
		curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_POSTFIELDS, $content);
		\OCP\Util::writeLog('files_zenodo','POSTING '.serialize($content), \OC_Log::WARN);
	}
	if(!empty($infile)){
		curl_setopt($curl, CURLOPT_TIMEOUT, 86400); // 1 Day Timeout
		curl_setopt($curl, CURLOPT_NOPROGRESS, false);
		curl_setopt($curl, CURLOPT_PROGRESSFUNCTION, 'curlProgressCallback');
		curl_setopt($curl, CURLOPT_BUFFERSIZE, 128);
		curl_setopt($curl, CURLOPT_FORBID_REUSE, false);
		curl_setopt($curl, CURLOPT_FRESH_CONNECT, false);
		curl_setopt($curl, CURLOPT_SAFE_UPLOAD, true);
	}
	elseif(!$newFileApi){
		$contentType = "application/json";
	}
	$httpHeaders[] = "Content-Type: ".$contentType;
	$httpHeaders[] = "Expect:";
	curl_setopt($curl, CURLOPT_HTTPHEADER, $httpHeaders);
	curl_setopt($curl, CURLOPT_HEADER, false);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
	curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);
	curl_setopt($curl, CURLOPT_FOLLOWLOCATION, TRUE);
	curl_setopt($curl, CURLOPT_UNRESTRICTED_AUTH, TRUE);
	curl_setopt($curl, CURLINFO_HEADER_OUT, TRUE);
	curl_setopt($curl, CURLOPT_VERBOSE, TRUE);
	curl_setopt($curl, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_2_0);
	curl_setopt($curl, CURLOPT_BINARYTRANSFER, 1);
	return $curl;
}

function curlProgressCallback($resource, $download_size = 0, $downloaded = 0,
		$upload_size = 0, $uploaded = 0){
	$percent = 0;
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

// For some reason parameters are passed from the zenodo server as parameters after a #, like
// https://silo2.sciencedata.dk/apps/files_zenodo/receive_token.php#token_type=Bearer&state=1311865&user=%7B%27id%27%3A+u%272%27%7D&access_token=w6L6QJ6wBNXhqTZh0SYqBaRPjP7178&scope=deposit%3Awrite+deposit%3Aactions&expires_in=3600

// The server/PHP has no access to the anchor string, it can only be accessed via javascript, so we
// do this and redirect with the parameters passed as GET parameters instead.

if(empty($_GET['access_token'])){
	echo "<script type='text/javascript'>var url=window.location.href.replace(window.location.hash,'')".
			"+'?'+window.location.hash.replace('#', '')+'&baseurl=".$_SERVER['HTTP_REFERER']."'; ".
			"/*alert('Will now upload file to '+url); */window.location.href=url;</script>";
	exit;
}

// Now try again, with accessible parameters

$baseURL = $_GET['baseurl'];
$depositURL = $baseURL."deposit";
$apiURL = $baseURL."api/deposit/depositions";

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

// Show confirmation
$tmpl = new OCP\Template("files_zenodo", "thanks");
$tmpl->assign('baseurl', $baseURL);
$tmpl->assign('depositurl', $depositURL);
$tmpl->printPage();
flush();

unset($metadata->metadata['uploaded']);
// If record already created, get depositid and bucket from stored metadata
if(!empty($metadata->getValue('deposition_id'))){
	$depositId = $metadata->getValue('deposition_id');
	$bucket = $metadata->getValue('bucket');
}
// If not already created, create record
if(empty($metadata->getValue('deposition_id'))){
	$url = $apiURL."?access_token=".$token;
	$content = '{"metadata":'.json_encode($metadata).'}';
	\OCP\Util::writeLog('files_zenodo','Creating record at: '.$url.'. Metadata: '.serialize($metadata), \OC_Log::WARN);
	$curl = curlInit($url, $content);
	$json_response = curl_exec($curl);
	$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
	if($status===0 || $status>=300 || $json_response===null || $json_response===false){
		echo('ERROR: bad reply from server. '.$json_response);
		die;
	}
	else{
		$response = json_decode($json_response, true);
	}
	curl_close($curl);
	if(!empty($response) && !empty($response['id'])){
		\OCP\Util::writeLog('files_zenodo','Got bucket and deposit ID: '.$response['links']['bucket'].' : '.$response['id'], \OC_Log::WARN);
		$depositId = $response['id'];
		// Quickfix. This is due to what looks like an Invenio/Zenodo software bug...
		// TODO: fix on sciencerepository
		$bucket = str_replace('http://sciencerepository.dk:5000/', 'https://sciencerepository.dk/', $response['links']['bucket']);
		$bucket = str_replace('http://sciencerepository.dk/', 'https://sciencerepository.dk/',$bucket);
		$html_link = $response['links']['html'];
		// Write deposit and bucket ID to metadata record
		$depositIdKey = \OCA\meta_data\Tags::getKeyID($zenodoTagID, 'deposition_id', $user);
		\OCA\meta_data\Tags::updateFileKeyVal($fileId, $zenodoTagID, $depositIdKey, $depositId);
		$bucketKey = \OCA\meta_data\Tags::getKeyID($zenodoTagID, 'bucket', $user);
		\OCA\meta_data\Tags::updateFileKeyVal($fileId, $zenodoTagID, $bucketKey, $bucket);
		$urlKey = \OCA\meta_data\Tags::getKeyID($zenodoTagID, 'url', $user);
		\OCA\meta_data\Tags::updateFileKeyVal($fileId, $zenodoTagID, $urlKey, $html_link);
		
	}
}

// Upload file if not already uploaded - change: we allow reupload w. warning.
if(!empty($metadata->getValue('uploaded')) && $metadata->getValue('uploaded')=='yes'){
	echo '<div class="upload_info alert alert-info">File already uploaded.</div>';
}

if(!empty($depositId)){
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
		\OCP\Util::writeLog('files_zenodo', 'No path info for '.$row['fileid'].'-->'.$filepath, \OC_Log::WARN);
	}
	if(!empty($group)){
		\OCP\Util::writeLog('files_zenodo', 'Group: '.$group, \OC_Log::WARN);
		$absolutePath = $view->getAbsolutePath($filepath);
	}
	else{
		list($storage, $internalPath) = \OC\Files\Filesystem::resolvePath('/' . $user . '/files' . $filepath);
		//$storage = \OC\Files\Filesystem::getStorage($st);
		$absolutePath = $storage->getLocalFile('/files' . $filepath);
		\OCP\Util::writeLog('files_zenodo', 'Absolute path of '.$filepath.
				':'.serialize($absolutePath).':'.serialize($internalPath), \OC_Log::WARN);
	}
	$pathInfo= pathinfo($absolutePath);
	$filename = $pathInfo['basename'];
	$absolutePath = realpath($absolutePath);
	
	if(empty($absolutePath)){
		\OCP\Util::writeLog('files_zenodo', 'Could not get absoute path of '.$filepath.
				':'.serialize($absolutePath), \OC_Log::WARN);
		die;
	}

	// If we're uploading a directory, first zip it to a tmp file
	if(is_dir($absolutePath)){
		\OCA\FilesSharding\Lib::sendZipHeaders($filename.".zip");
		$tmpFile = tempnam(sys_get_temp_dir(), 'files_zenodo_').".zip";
		exec("PATH=\$PATH:/usr/local/bin; cd '".dirname($absolutePath)."'; zip -r '".$tmpFile."' ".$filename);
		$absolutePath = $tmpFile;
		$filename = $filename.".zip";
	}
	
	// Give time to create record
	sleep(3);
	// Try 3 times to upload
	$trials = 3;
	for($i = 0; $i < $trials; $i++){

		if(empty($bucket)){
			// As of PHP 5.6 no longer works...
			//$cFile = '@' . stripslashes($absolutePath);
			$cFile = makeCurlFile($absolutePath);
			$content = array('name'=>$filename, 'file'=>$cFile);
			$url = $apiURL."/".$depositId."/files?access_token=".$token;
			$curl = curlInit($url, $content, $absolutePath);
		}
		else{
			$url = $bucket."/".rawurlencode($filename)."?access_token=".$token;
			$fh = fopen($absolutePath, 'r');
			$curl = curlInit($url, null, $absolutePath, true, $fh);
		}
		
		\OCP\Util::writeLog('files_zenodo','Uploading '.$i.': '.$filepath.' ('.$absolutePath.') to: '.
				$url.', Content: '.(empty($content)?'':serialize($content)).
				', Bucket: '.(empty($bucket)?'':$bucket), \OC_Log::WARN);
		
		$json_response = curl_exec($curl);
		$info = curl_getinfo($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		if($status===0 || $status>=300 || $json_response===null ||
				$json_response===false){
			curl_close($curl);
			if($i<$trials-1){
				continue;
			}
			echo('ERROR: bad response. '.$json_response);
			\OCP\Util::writeLog('files_zenodo','ERROR: '.
					$json_response.' -- '.$status.' -- '.serialize($info), \OC_Log::ERROR);
			die;
		}
		else{
			// Flag as uploaded
			$uploadedKey = \OCA\meta_data\Tags::getKeyID($zenodoTagID, 'uploaded', $user);
			\OCA\meta_data\Tags::updateFileKeyVal($fileId, $zenodoTagID, $uploadedKey, 'yes');
			curl_close($curl);
			break;
		}
	}
	if(!empty($fh)){
		fclose($fh);
	}
	if(!empty($tmpFile)){
		unlink($tmpFile);
	}
}
else{
	OCP\JSON::error();
}

