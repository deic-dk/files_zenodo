<?php

$sandboxtoken = $_POST['sandboxtoken'];
$productiontoken = $_POST['productiontoken'];

OC_Appconfig::setValue('files_zenodo', 'sandboxtoken', $sandboxtoken);
OC_Appconfig::setValue('files_zenodo', 'productiontoken', $productiontoken);

OCP\JSON::success();
