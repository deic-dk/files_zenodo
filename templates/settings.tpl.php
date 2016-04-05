<?php
$sbtoken = "Placeholder for DB retrieved sandbox token";
$prtoken = "Placeholder for DB retrieved production token";
?>
<fieldset id="filesZenodoSettings" class="section" >
<h2><img src="/apps/files_zenodo/img/zenodo.svg" style='vertical-align: baseline; margin-right:25px;'>Research. Shared.</h2>
  <br>
  <p>Set your access tokens for sandbox and/or production environments.</p>
  <table>
  <tr>
  <td>
  <label for='sandboxtoken'>Sandbox token:</label>
  </td>
  <td>
  <input type='text' name='sandboxtoken' id='sandboxtoken' title='Input the access token used for Zenodo sandbox' style='width:450px;' value='<?php
echo htmlentities($sbtoken);
?>'>
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
  <input type='text' name='productiontoken' id='productiontoken' title='Input the access token used for Zenodo production' style='width:450px;' value='<?php
echo htmlentities($prtoken);
?>'>
  </td>
  <td>
  <input type='button' name='productionvalidate' value='Validate' disabled>
  </td>
  </tr>
  </table>
  <br>
  <input type='submit' value='Save' id='tokensubmit' original-title='' title='Store environment selection and tokens' disabled>
</fieldset>

