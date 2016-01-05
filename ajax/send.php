<?php

/*
 * files_zenodo, ownCloud integration to Zenodo (zenodo.org)
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

$access_token = "accesstoken"; // dummy;

// $success = false;

r =  http_get ("https://zenodo.org/api/deposit/depositions", array("timeout"=>1), $info);
    
//    if ($success) 
{
        OCP\JSON::success($info);
    } 

/* else {
        OCP\JSON::error();
    }
}*/

