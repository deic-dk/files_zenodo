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
<h2><img src="/apps/files_zenodo/img/zenodo.svg" style = 'vertical-align: baseline; margin-right:30px'>Research. Shared.</h2>
  <br>
  <p>Set your Zenodo access tokens and choose whether to upload to the sandbox or the production environment.</p>
  <table>
  <tr>
  <tbody>
  <td>
  <input type='radio' name='rb_sandbox' id='rb_sandbox' title='Use the Zenodo sandbox - for testing' checked>
  <label for='rb_sandbox'>Sandbox</label>
  </td>
  <td>
  <label for='sandboxtoken'>Access Token:</label>
  <input type='text' name='sandboxtoken' id = 'sandboxtoken' original-title='' title='Input the access token used in Zenodo sandbox'>
  </td>
  <td>
  <input type='button' name='sandboxvalidate' value='Validate'> 
  </td> 
  </tr>
  <tr>
  <td>
  <input type='radio' name=rb_'production' id='rb_production' title='Use the Zenodo live environment (currently not available)' disabled>
  <label for='rb_production' disabled>Production</label>
  </td>
  <td>
  <label for='productiontoken'>Access Token:</label>
  <input type='text' name='productiontoken' id = 'productiontoken' original-title='' title='Input the access token used in Zenodo production' disabled>
  </td>
  <td>
  <input type='button' name='productionvalidate' value='Validate' disabled>
  </td>
  </tr>
  </tbody>
  </table>
  <br>
  <input type='submit' value='Save' id = 'tokensubmit' original-title='' title='Store environment and token'>
</fieldset>

