<?php
/*
 * files_zenodo, ownCloud integration to Zenodo (zenodo.org)
 *
 * Written 2016 by Lars N\xc3\xa6sbye Christensen, DeIC
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU AFFERO GENERAL PUBLIC LICENSE
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU AFFERO GENERAL PUBLIC LICENSE for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

OCP\JSON::checkLoggedIn();

if (OCP\App::isEnabled('files_zenodo')) {

$sandbox_token = "cE6sAlNmSe2ymIXuSDzh80vMMpKzGaITqPq3LTHcpApmXQPj17Fi0luatFZ2"; 
$productiontoken = ""; // NEVER write an actual production token here

$sandboxurl = "https://sandbox.zenodo.org/api/deposit/depositions?access_token=" . $sandbox_token;
$productionurl = "https://zenodo.org/api/deposit/depositions?access_token=" . $production_token;

$metadata = array('key1' => 'value1', 'key2' => 'value2'); // deposition metadata ( https://www.zenodo.org/dev#restapi-rep-meta )

$options = array(
    'http' => array(
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => http_build_query($metadata),
    ),
);

$context  = stream_context_create($options);
$result = file_get_contents($sandboxurl, false, $context);
if ($result === FALSE) { /* error */ }

var_dump($result);

}

