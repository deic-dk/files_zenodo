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

// obtain current user's id
if (isset($_GET['user_id'])) {
    $user_id = $_GET['user_id'];
} else {
    $user_id = \OC::$server->getUserSession()->getUser()->getUID();
}

// set the tokens via database query

$sandboxtoken            = $_POST['sandboxtoken'];
$productiontoken         = $_POST['productiontoken'];

//FIXME: \OCP\DB::prepare is deprecated since 8.1.0 use prepare() of \OCP\IDBConnection - \OC::$server->getDatabaseConnection()

$sandboxsql    = "INSERT INTO `*PREFIX*files_zenodo_tokens` (`token_name`, `token_string`) VALUES ('sandbox', '" . $sandboxtoken . "') ON DUPLICATE KEY UPDATE token_string = '" . $sandboxtoken . "', token_name = 'sandbox'";

$sandboxquery  = \OCP\DB::prepare($sandboxsql); 
$result = $sandboxquery->execute();

$productionsql    = "INSERT INTO `*PREFIX*files_zenodo_tokens` (`token_name`, `token_string`) VALUES ('production', '" . $productiontoken . "') ON DUPLICATE KEY UPDATE token_string = '" . $productiontoken . "', token_name = 'production'";
$productionquery  = \OCP\DB::prepare($productionsql);
$result = $productionquery->execute();

OCP\JSON::success(array('result' => $result));

