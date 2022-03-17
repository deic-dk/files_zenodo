 <?php

//\OCP\JSON::checkAppEnabled('user_orcid');

if(\OC_User::isLoggedIn()){
	\OCP\Util::addScript('files_zenodo', 'fileactions');
	\OCP\Util::addStyle('files_zenodo', 'style');
	
	\OCP\App::registerAdmin('files_zenodo', 'settings'); 
}