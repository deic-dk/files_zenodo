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

//FIXME: needs serious optimisation

$sandboxsql		= "SELECT token_string FROM `*PREFIX*files_zenodo_tokens` WHERE `*PREFIX*files_zenodo_tokens`.`token_name` = 'sandbox'";
$productionsql		= "SELECT token_string FROM `*PREFIX*files_zenodo_tokens` WHERE `*PREFIX*files_zenodo_tokens`.`token_name` = 'production'";

$sandboxquery		= \OCP\DB::prepare($sandboxsql); //FIXME: Deprecated since 8.1.0 use prepare() of \OCP\IDBConnection - \OC::$server->getDatabaseConnection()
$productionquery	= \OCP\DB::prepare($productionsql);

$sandboxoutput		= $sandboxquery->execute();
$productionoutput	= $productionquery->execute();

$sandboxrow		= $sandboxoutput->fetchRow();
$productionrow		= $productionoutput->fetchRow();

$sandboxresult		= $sandboxrow['token_string'];
$productionresult	= $productionrow['token_string'];

OCP\JSON::success(array('sandboxtoken' => $sandboxresult, 'productiontoken' => $productionresult));

