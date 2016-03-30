<fieldset id="filesZenodoSettings" class="section" style='background-image: radial-gradient(circle farthest-corner at left top, #0047A8, #2BBCFF); color:white;'>
<h2><img src="/apps/files_zenodo/img/zenodo.svg" style='vertical-align: baseline; margin-right:25px;'> Research. Shared.</h2>
  <br>
  <p>Set your Zenodo access tokens for sandbox and production environments.</p>
  <table>
  <tr>
  <td>
  <label for='sandboxtoken'>Sandbox token:</label>
  </td>
  <td>
  <input type='text' name='sandboxtoken' id='sandboxtoken' original-title='' title='Input the access token used for Zenodo sandbox' style='width:450px;'>
  </td>
  <td>
  <input type='button' name='sandboxvalidate' value='Validate' disabled> 
  </td> 
  </tr>
  <tr>
  <td>
  <label for='productiontoken'>Production token: </label>
  </td>
  <td>
  <input type='text' name='productiontoken' id='productiontoken' original-title='' title='Input the access token used for Zenodo production' style='width:450px;'>
  </td>
  <td>
  <input type='button' name='productionvalidate' value='Validate' disabled>
  </td>
  </tr>
  </table>
  <br>
  <input type='submit' value='Save' id='tokensubmit' original-title='' title='Store environment selection and tokens'>
</fieldset>

