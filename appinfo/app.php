 <?php

//\OCP\JSON::checkAppEnabled('user_orcid');

\OCP\Util::addScript('files_zenodo', 'fileactions');
\OCP\Util::addStyle('files_zenodo', 'style');

\OCP\App::registerAdmin('files_zenodo', 'settings'); 
