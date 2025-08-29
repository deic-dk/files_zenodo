 <?php

//\OCP\JSON::checkAppEnabled('user_orcid');

 if(\OC_User::isLoggedIn() &&!isset($_SERVER['REQUEST_URI']) ||
 		strpos($_SERVER['REQUEST_URI'], OC::$WEBROOT ."/shared/")!==0 &&
 		strpos($_SERVER['REQUEST_URI'], OC::$WEBROOT ."/public/")!==0 &&
 		strpos($_SERVER['REQUEST_URI'], OC::$WEBROOT ."/files/")!==0 &&
 		strpos($_SERVER['REQUEST_URI'], OC::$WEBROOT ."/remote.php/")!==0 &&
 		strpos($_SERVER['REQUEST_URI'], OC::$WEBROOT ."/sharingin/")!==0 &&
 		strpos($_SERVER['REQUEST_URI'], OC::$WEBROOT ."/sharingout/")!==0 &&
 		strpos($_SERVER['REQUEST_URI'], OC::$WEBROOT ."/groupfolders/")!==0
 		){
	\OCP\Util::addScript('files_zenodo', 'fileactions');
	\OCP\Util::addStyle('files_zenodo', 'style');
	
	\OCP\App::registerAdmin('files_zenodo', 'settings'); 
}