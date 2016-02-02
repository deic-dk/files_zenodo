<fieldset id="filesZenodoSettings" class="section" style='background-image: radial-gradient(circle farthest-corner at left top , #0047A8 0px, #2BBCFF 100%); color:white;'>
<h2 ><img src="/apps/files_zenodo/img/zenodo.svg" style='vertical-align: baseline; margin-right:25px;'> Research. Shared.</h2>
  <br>
  <p>Set your Zenodo access tokens and choose whether to upload to the sandbox or the production environment.</p>
  <table>
  <tr>
  <td>
  <input type='radio' name='radiobutton' id='rb_sandbox' title='Use the sandbox' checked>
  <label for='rb_sandbox'>Sandbox</label>
  </td>
  <td>
  <label for='sandboxtoken'>Access Token:</label>
  <input type='text' name='sandboxtoken' id = 'sandboxtoken' original-title='' title='Input the access token used for Zenodo sandbox'>
  </td>
  <td>
  <input type='button' name='sandboxvalidate' value='Validate'> 
  </td> 
  </tr>
  <tr>
  <td>
  <input type='radio' name='radiobutton' id='rb_production' title='Use the live environment' >
  <label for='rb_production' disabled>Production</label>
  </td>
  <td>
  <label for='productiontoken'>Access Token: </label>
  <input type='text' name='productiontoken' id = 'productiontoken' original-title='' title='Input the access token used for Zenodo production'>
  </td>
  <td>
  <input type='button' name='productionvalidate' value='Validate'>
  </td>
  </tr>
  </table>
  <br>
  <input type='submit' value='Save' id = 'tokensubmit' original-title='' title='Store environment selection and tokens'>
</fieldset>

