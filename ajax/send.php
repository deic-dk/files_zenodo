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

if (\OCP\App::isEnabled('files_zenodo')) {
    
    // FIXME get our universal tokens from DB instead
    $sandbox_token   = "";
    $productiontoken = "";
    
    $sandboxurl    = "https://sandbox.zenodo.org/api/deposit/depositions?access_token=" . $sandbox_token;
    $productionurl = "https://zenodo.org/api/deposit/depositions?access_token=" . $production_token;
    
    $metadata = array(
        'upload_type' => 'value1',
        'publication_type' => 'value2',
        'image_type' => 'value3',
        'publication_date' => 'value4',
        'title' => 'value5',
        'creators' => array(),
        'description' => 'value6',
        'access_right' => 'value7',
        'license' => 'value8',
        'embargo_date' => 'value9',
        'access_conditions' => 'value10',
        'doi' => 'value11',
        'prereserve_doi' => false,
        'keywords' => array(
            'keyword1',
            'keyword2'
        ),
        'notes' => 'value12',
        'related_identifiers' => array(),
        'contributors' => array(),
        'references' => array(
            'ref1',
            'ref2'
        ),
        'communities' => array(),
        'grants' => array(),
        'journal_title' => 'value13',
        'journal_volume' => 'value14',
        'journal_issue' => 'value15',
        'journal_pages' => 'value16',
        'conference_title' => 'value17',
        'conference_acronym' => 'value18',
        'conference_dates' => 'value19',
        'conference_place' => 'value20',
        'conference_url' => 'value21',
        'conference_session' => 'value22',
        'conference_session_part' => 'value23',
        'imprint_publisher' => 'value24',
        'imprint_isbn' => 'value25',
        'imprint_place' => 'value26',
        'partof_title' => 'value27',
        'partof_pages' => 'value28',
        'thesis_supervisors' => array(),
        'thesis_university' => 'value29',
        'subjects' => array()
        
    );
    
    $options = array(
        'http' => array(
            'header' => "Content-type: application/x-www-form-urlencoded\r\n",
            'method' => 'POST',
            'content' => http_build_query($metadata)
        )
    );
    
    $context = stream_context_create($options);
    $result  = file_get_contents($sandboxurl, false, $context);
    if ($result === FALSE) {
        /* error */
    }
    
    var_dump($result);
    
}
