<!--
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
-->

<fieldset id="filesZenodoSettings" class="section">
<h2><img src="/apps/files_zenodo/img/zenodo.svg"></h2>
  <?php  
 echo "     
  <label for='sandbox'>Sandbox</label>
  <input type='radio' name='sandbox' id='sandbox' title='Use the Zenodo sandbox - for testing' checked>
  <label for='production' disabled>Production</label>
  <input type='radio' name='production' id='production' title='Use the live Zenodo API (currently not available)' disabled> 
  <br> 
  <label for='token'>Access Token:</label>
  <input type='text' name='token' id = 'token' original-title='' title='Input the access token used in Zenodo'>
  <br>
  <input type='submit' value='Save' id = 'tokensubmit' original-title='' title='Store environment and token'>";
?>
</fieldset>

