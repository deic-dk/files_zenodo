<fieldset id="filesZenodoSettings" class="section" >
<h2>Data publishing</h2>
  <br>
  <img src="/apps/files_zenodo/img/zenodo.svg" style='vertical-align: baseline; margin-bottom: 14px; width: 96px;'>
  <br>
  <p>Set the ID and secret of your client app registered with Zenodo.</p>
  <p>To allow uploading to multiple services, enter space-separated lists of URLs, client IDs and client secrets.</p>
  <br>
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
  <img src="/apps/files_zenodo/img/mediacms.svg" style='vertical-align: baseline; margin-bottom: 14px; width: 108px;'>
  <br>
  <table>
  <tr>
  <td>
  <label for='mediaCmsURL'>Base URL:</label>
  </td>
  <td>
  <input type='text' id='mediaCmsURL' title='Service base URL' style='width:475px' />
  </td>
  </tr>
  <tr>
  <td>
  <label for='mediaCmsToken'>Token:</label>
  </td>
  <td>
  <input type='text' id='mediaCmsToken' title='Shared token for uploads to ScienceData MediaCMS servers.' style='width:475px' />
  </td>
  </tr>
  </table>
  <br>
  <input type='submit' value='Save' id='tokensubmit' title='Store settings' />
  <label id='zenodostatus'></label>
</fieldset>

