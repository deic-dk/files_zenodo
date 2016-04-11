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

namespace OCA\FilesZenodo\Db;

use \OCP\IDb;

class FilesZenodoDB {

    private $db;

    public function __construct(IDb $db) {
        $this->db = $db;
    }

    public function get_sandbox_token() {
        $sql = 'SELECT * FROM `*PREFIX*files_zenodo_tokens` WHERE `*PREFIX*files_zenodo_tokens`.`token_id` = 0';
        $query = $db->prepareQuery($sql);
        $result = $query->execute();

        while($row = $result->fetchRow()) {
            return $row;
        }
    }

    public function set_sandbox_token(string $intoken) {
        $sql = 'UPDATE `*PREFIX*files_zenodo_tokens` SET `token_string` =' . $intoken . ' WHERE `*PREFIX*files_zenodo_tokens`.`token_id` = 0';
        $query = $db->prepareQuery($sql);
        $result = $query->execute();
        return $result;

    }

    public function get_production_token() {
        $sql = 'SELECT * FROM `*PREFIX*files_zenodo_tokens` WHERE `*PREFIX*files_zenodo_tokens`.`token_id` = 1';
        $query = $db->prepareQuery($sql);
        $result = $query->execute();

        while($row = $result->fetchRow()) {
            return $row;
        }
    }

    public function set_production_token(string $intoken) {
        $sql = 'UPDATE `*PREFIX*files_zenodo_tokens` SET `token_string` =' . $intoken . ' WHERE `*PREFIX*files_zenodo_tokens`.`token_id` = 1';
        $query = $db->prepareQuery($sql);
        $result = $query->execute();
        return $result;
    }
}
