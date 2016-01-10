<?php

OC_Util::checkAdminUser();

OCP\Util::addScript('files_zenodo', 'settings');

$tmpl = new OCP\Template( 'files_zenodo', 'settings.tpl');

return $tmpl->fetchPage();

