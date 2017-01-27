<?php

$sandboxtoken    = OC_Appconfig::getValue('files_zenodo', 'sandboxtoken');
$productiontoken = OC_Appconfig::getValue('files_zenodo', 'productiontoken');

OCP\JSON::success(array(
		'sandboxtoken' => $sandboxtoken,
		'productiontoken' => $productiontoken
));
