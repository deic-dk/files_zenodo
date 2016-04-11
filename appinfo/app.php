<?php
/*                                                                                                                                
 * files_zenodo, ownCloud integration to Zenodo (zenodo.org) 
 *                                                                                                                                
 * Written 2016 by Lars N\xc3\xa6sbye Christensen, DeIC
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

OC::$CLASSPATH['OCA\FilesZenodo\Db'] = 'files_zenodo/ajax/db.php';
OC::$CLASSPATH['OCA\FilesZenodo\Send'] = 'files_zenodo/ajax/send.php';

// Load our fileactions script
if (\OCP\User::isLoggedIn()) {
    \OCP\Util::addScript('files_zenodo', 'fileactions');
}

// Register the panel in Admin settings
 \OCP\App::registerAdmin('files_zenodo', 'settings');

