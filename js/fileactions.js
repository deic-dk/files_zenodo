var oauthWindow;
var clientAppID;
var clientSecret;
var redirectUrl;

var metaPopupTitle = "Metadata for Zenodo upload";

function getClient(){
	$.ajax(OC.linkTo('files_zenodo', 'ajax/get_client.php'), {
		type: "GET",
		dataType: 'json',
		success: function(s) {
			clientAppID = s['clientAppID'];
			clientSecret = s['clientSecret'];
			redirectUrl = s['redirectURL'];
		}
	});
}

function openZenodoAuth(fileid) {
	
	var uploaded = $('#fileList tr[data-id='+fileid+']').attr('zenodo_uploaded');
	if(uploaded=='yes'){
		OC.dialogs.confirm('This file has already been published. Altering its metadata or re-uploading is not recommended. Continue anyway?',
				'Already published', function(res){if(res){doOpenZenodoAuth(fileid);}}, false);
	}
 }

function doOpenZenodoAuth(fileid){
	var url = "https://zenodo.org/oauth/authorize?"+
	"client_id="+clientAppID+"&scope=deposit%3Awrite+deposit%3Aactions&"+
	"redirect_uri="+redirectUrl+"&response_type=token&state="+fileid;
//alert(url);
if(!clientAppID){
	OC.dialogs.alert("Please ask your administrator to set a 'Zenodo' app id.", "No appid", function(res){}, true);
	return false;
}
var oauthWindow = window.open(url, "_blank", 
		"toolbar=no, scrollbars=yes, width=620, height=600, top=500, left=500");
}

function addTag(fileid, filename, tagname){
	$.ajax({
		url: OC.filePath('meta_data', 'ajax', 'updateFileInfo.php'),
		async: false,
		timeout: 200,
		data: {
			fileid: fileid,
			tagname: tagname
		},
		type: "POST",
		success: function(result) {
			if(!result){
				OC.dialogs.alert("Please define a 'Zenodo' schema.", "No metadata schema", function(res){}, true);
			}
			else{
				editMeta(metaPopupTitle, filename, fileid, result, styleMetaPopup, openZenodoAuth);
			}
		},
	});
}

// From user_orcid/js/settings_personal.js
function getOrcid(callback){
	$.ajax(OC.linkTo('user_orcid', 'ajax/get_orcid.php'), {
		type: "GET",
		dataType: 'json',
		success: function(s) {
			if(typeof s['orcid'] !== 'undefined'){
				orcid = s['orcid'];
			}
			else{
				orcid = '';
			}
			callback(orcid);
		}
	});
}

function getCommunities(callback){
	$.ajax(OC.linkTo('files_zenodo', 'ajax/get_tokens.php'), {
		type: "GET",
		dataType: 'json',
		success: function(s) {
			if(typeof s['communities'] != 'undefined'){
				communities = s.communities;
			}
			else{
				communities = '';
			}
			callback(communities);
		}
	});
}

function styleMetaPopup(fileid, filename) {
	
	var titleInput = $('.ui-dialog .edit[value=title]').parent().find('input.value');
	if(!titleInput.val().length){
		titleInput.val(filename);
	}
	
	var creatorsInput = $('.ui-dialog .edit[value=creators]').parent().find('input.value');
	if(!creatorsInput.val().length){
		// This is theme-specific. TODO: generalize
		var userFullNameSpan = $('.dropdown .user-menu span');
		var userFullName = '';
		if(userFullNameSpan.length){
			userFullName = userFullNameSpan.first().text();
		}
		if(!userFullName.length){
			userFullName = $('head').attr('data-user');
		}
		
		// Very theme/apps-specific. TODO: generalize
		var userAffiliationI = $('#left-apps-menu .nav i.icon-gift');
		var userAffiliationSpan;
		if(userAffiliationI.length){
			userAffiliationSpan = userAffiliationI.parent().find('span');
		}
		var userAffiliation = '';
		if(userAffiliationSpan.length){
			userAffiliation = userAffiliationSpan.first().text();
		}
		
		getOrcid(function(orcid){
			creatorsInput.val('[{Author: '+userFullName+', Affiliation: '+userAffiliation+(orcid.length?', orcid: '+orcid:'')+'}]');
		});
	}
	
	var uploadTypeSelect = $('.ui-dialog .edit[value=upload_type]').parent().find('select.value');
	uploadTypeSelect.on('change', function(){
		$('.ui-dialog .edit[value=image_type]').parent().addClass('hidden');
		$('.ui-dialog .edit[value=publication_type]').parent().addClass('hidden');
		if($(this).val()=='publication'){
			$('.ui-dialog .edit[value=publication_type]').parent().removeClass('hidden');
		}
		else{
			$('.ui-dialog .edit[value=publication_type]').parent().find('select').val('');
		}
		if($(this).val()=='image'){
			$('.ui-dialog .edit[value=image_type]').parent().removeClass('hidden');
		}
		else{
			$('.ui-dialog .edit[value=image_type]').parent().find('select').val('');
		}
	});
	if(!uploadTypeSelect.val() || uploadTypeSelect.val()!='publication'){
		$('.ui-dialog .edit[value=publication_type]').parent().addClass('hidden');
	}
	if(!uploadTypeSelect.val() || uploadTypeSelect.val()!='image'){
		$('.ui-dialog .edit[value=image_type]').parent().addClass('hidden');
	}
	var publicationDateInput = $('.ui-dialog .edit[value=publication_date]').parent().find('input.value');
	if(!publicationDateInput.val().length){
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth();//January is 0!
		var yyyy = today.getFullYear();
		var date = yyyy+'-'+mm+'-'+dd;
		publicationDateInput.val(date);
	}
	var accessRightSelect = $('.ui-dialog .edit[value=access_right]').parent().find('select.value');
	accessRightSelect.on('change', function(){
		$('.ui-dialog .edit[value=embargo_date]').parent().addClass('hidden');
		$('.ui-dialog .edit[value=access_conditions]').parent().addClass('hidden');
		if($(this).val()=='restricted'){
			$('.ui-dialog .edit[value=access_conditions]').parent().removeClass('hidden');
		}
		else{
			$('.ui-dialog .edit[value=access_conditions]').parent().find('select').val('');
		}
		if($(this).val()=='embargoed'){
			$('.ui-dialog .edit[value=embargo_date]').parent().removeClass('hidden');
		}
		else{
			$('.ui-dialog .edit[value=embargo_date]').parent().find('select').val('');
		}
	});
	if(!accessRightSelect.val() || accessRightSelect.val()!='restricted'){
		$('.ui-dialog .edit[value=access_conditions]').parent().addClass('hidden');
	}
	if(!accessRightSelect.val() || accessRightSelect.val()!='embargoed'){
		$('.ui-dialog .edit[value=embargo_date]').parent().addClass('hidden');
	}
	
	$('.ui-dialog .edit[value=deposition_id]').parent().addClass('hidden');
	$('.ui-dialog .edit[value=uploaded]').parent().addClass('hidden');
	
	var communitiesInput = $('.ui-dialog .edit[value=communities]').parent().find('input.value');
	if(!communitiesInput.val().length){
		getCommunities(function(communities){
			if(communities.length){
				communitiesInput.val(communities);
				communitiesInput.prop("readonly", true);
			}
		});
	}
	
	if($('.ui-dialog .edit[value=uploaded]').parent().find('input.value').val()=='yes'){
		$('#fileList tr[data-id='+fileid+']').attr('zenodo_uploaded', 'yes');
	}
	
	$('.ui-dialog .popup_ok').text('Next: Upload file Zenodo');
	
}

$(document).ready(function() {
	
	getClient();
	
	if (typeof FileActions !== 'undefined') {
		// Register our function with ownCloud - files, not folders
		FileActions.register('file', t('files_zenodo', 'Zenodo'), OC.PERMISSION_READ, OC.imagePath('files_zenodo', 'zenodo_z'),
			function(filename, context) {
				if (scanFiles.scanning) {
					return;
				}
				if ($('#dropdown').length == 0) {
					var tr = FileList.findFileEl(filename);
					//$(html).appendTo($(tr).find('td.filename'));
					$(tr).addClass('mouseOver');
					var filename = $(tr).data('file');
					var fileid = $(tr).data('id');
					if(typeof editMeta !== 'undefined'){
						var tagid = $(tr).find('span.tagtext').filter(function() { return ($(this).text() === 'Zenodo') }).closest('.label').attr('data-tag');
						if(typeof tagid == 'undefined' || !tagid.length){
							addTag(fileid, filename, 'Zenodo');
						}
						else{
							editMeta(metaPopupTitle, filename, fileid, tagid, styleMetaPopup, openZenodoAuth);
						}
					}
					else{
						OC.dialogs.alert('Please install and enable the app metadata.', 'No metadata', function(res){}, true);
					}
				} else {
					$("#dropdown").slideUp(200, function() {
						$(this).remove();
					});
					$('tr').removeClass('mouseOver');
				}
			}
		);
	}

	// Add action to top bar (visible when files are selected)
	/*if(!$('.nav-sidebar li[data-id="sharing_in"] a.active').length &&
			!$('.nav-sidebar li[data-id="trash"] a.active').length &&
			(typeof OCA.Files !== 'undefined' && OCA.Files.FileList.prototype.getGetParam('view')!='trashbin')){
		$('#headerName .selectedActions').prepend(
			'<a class="zenodo btn btn-xs btn-default" id="zenodo" href=""><i class="icon icon-zenodo"></i>' + t('files_zenodo', ' Publish') + '</a>&nbsp;');
	}*/
});
