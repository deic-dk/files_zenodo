<fieldset id="filesZenodoSettings" class="section">
  <h2> <style scoped> img { filter: invert(100%)} </style>
<img src="/apps/files_zenodo/img/zenodo.svg">
</h2>
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

