<fieldset id="filesZenodoSettings" class="section" >
<h2><img src="/apps/files_zenodo/img/zenodo.svg" style='vertical-align: baseline; margin-right:25px;'> Research. Shared.</h2>
  <br>
  <p>Set the ID and secret of your client app registered with Zenodo.</p>
  <p>To allow uploading to multiple services, enter space-separated lists of URLs, client IDs and client secrets.</p>
  <table>
  <tr>
  <td>
  <label for='baseURL'>Base URL:</label>
  </td>
  <td>
  <input type='text' id='baseURL' title='Base URL for Zenodo API endpoints' style='width:475px' />
  </td>
  </tr>
  <tr>
  <td>
  <label for='clientAppID'>Client ID:</label>
  </td>
  <td>
  <input type='text' id='clientAppID' title='Client app ID for Zenodo deposits' style='width:475px' />
  </td>
  </tr>
  <tr>
  <td>
  <label for='clientSecret'>Client secret:</label>
  </td>
  <td>
  <input type='text' id='clientSecret' title='Client app secret for Zenodo deposits' style='width:475px' />
  </td>
  </tr>
   <tr>
  <td>
  <label for='communities'>Communities:</label>
  </td>
  <td>
  <input type='text' id='communities' title='Curated Zenodo communities' style='width:475px' />
  </td>
  </tr>
  </table>
  <br>
  <input type='submit' value='Save' id='tokensubmit' title='Store settings' />
  <label id='zenodostatus'></label>
</fieldset>

