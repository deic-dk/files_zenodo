var oauthWindow;
var clientAppID;
var clientSecret;
var redirectUrl;
var depositBaseURL;

var metaPopupTitle = t('files_zenodo', 'Metadata for deposit');

function publishMultiple(event){
	// Publish multiple files
	event.stopPropagation();
	event.preventDefault();
	if($('#publishAction').length>0 && !$(event.target).is('#publishSelect')){
		$('#publishAction').detach();
		return false;
	}
	var files = FileList.getSelectedFiles();
	var mime = null;
	var onlyZenodo = false;
	for( var i=0;i<files.length;++i){
		// We cannot publish directories
		if(files[i].mimetype=='httpd/unix-directory'){
			return false;
		}
		// For mixed mimetypes we can only publish to Zenodo
		if(i>0 && files[i].mimetype!=mime){
			onlyZenodo = true;
			break;
		}
		mime = files[i].mimetype;
	}
	publishCreateSelect(files[0].name,  files[0].mimetype, onlyZenodo, $('#headerName .selectedActions .publish:visible'), true);
	$('#publishSelect').on('change', function(ev){
		 ev.stopImmediatePropagation();
		var tagname = $(ev.target).val();
		if(typeof editMeta !== 'undefined'){
			for( var i=0;i<files.length;++i){
				var tagid = $('tr[data-id='+files[i].id+']').find('span.tagtext').filter(function() { return ($(this).text()===tagname) }).closest('.label').attr('data-tag');
				if(typeof tagid == 'undefined' || !tagid.length){
					addTag(files[i].id, files[i].name, tagname, false);
				}
			}
		getTagID(tagname,
			function(tagid){
			if(tagname==='Zenodo'){
				editMeta(metaPopupTitle, files[0].name, files[0].id, tagid, styleMetaPopup, openZenodoAuth);
			}
			else if(tagname==='MediaCMS'){
				editMeta(metaPopupTitle, files[0].name, files[0].id, tagid, setMediaParams, publishMedia);
			}
			else if(tagname==='ScienceNotebooks'){
				editMeta(metaPopupTitle, files[0].name, files[0].id, tagid, setNotebookParams, publishNotebook);
			}
		});
		}
	});
	return false;
};

function addSelectedPublishAction(){
	$('#headerName .selectedActions').each(function(){
		if(!$(this).find('.publish').length){
			$('<a class="publish btn btn-xs btn-default" href=""><i class="icon icon-forward"></i>'+t('files_zenodo',' Publish')+'</a>').prependTo($(this));
			$(this).find('.publish').click(publishMultiple)
		}
	});
}

function getClient(){
	$.ajax(OC.linkTo('files_zenodo', 'ajax/get_client.php'), {
		type: "GET",
		dataType: 'json',
		success: function(s) {
			depositBaseURL = s['baseURL'];
			clientAppID = s['clientAppID'];
			clientSecret = s['clientSecret'];
			redirectUrl = s['redirectURL'];
		}
	});
}

function publishMedia(fileid, filenames) { /*both can be multi-entry strings like file1:file2:file3*/
	var title = $('#meta_data_container span.keyname:contains("Title")').parent().find('input.value').last().val();
	var description = $('#meta_data_container span.keyname:contains("Description")').parent().find('input.value').last().val();
	$('button.popup_ok').css('background-image', 'url('+ OC.imagePath('core', 'loading-small.gif') + ')').css('background-repeat', 'no-repeat').css('background-position', 'center center').css('opacity', '.6').css('cursor', 'default').off();
	// Add message field
	$('.ui-dialog-buttonset').prepend('<div class="msg"></div>')
	var fileids = (''+fileid).split(':');
	var tr = FileList.findFileEl(filenames[0]);
	var group = tr.attr('data-group');
	for(var i=0; i<fileids.length; ++i){
		$('div.msg').text("Uploading "+filenames[i]+"...");
		$.ajax({
			url: OC.filePath('files_zenodo', 'ajax', 'mediacms_publish.php'),
			async: true,
			data: {
				fileid: fileids[i],
				filename: filenames[i],
				group: group,
				title: title,
				description: description,
				dataType: 'json',
				i: (''+(i+1))
			},
			type: "POST",
			success: function(data) {
				if(parseInt(data['i'])==fileids.length){
			    $('div.msg').text("All done.");
					$('button.popup_ok').css('background-image', '').css('opacity', '1.0').css('cursor', 'pointer').on();
					$('body').find('.ui-dialog').delay(2000)
					.queue(function (next) { 
						$(this).remove();
						next(); 
					});
				}
			},
			error: function(s, textStatus, errorThrown) {
				$('button.popup_ok').css('background-image', '').css('opacity', '1.0').css('cursor', 'pointer').on();
				OC.dialogs.alert(t("files_zenodo", "Publish: Something went wrong. Please make sure you have already logged in on media.sciencedata.dk"+errorThrown), t("files_zenodo", "Error"));
			}
		});
	}
}

function publishNotebook(fileid, filenames) { /*both can be multi-entry strings like file1:file2:file3*/
	var category = $('#meta_data_container span.keyname:contains("Category")').parent().find('select.value').last().val();
	$('button.popup_ok').css('background-image', 'url('+ OC.imagePath('core', 'loading-small.gif') + ')').css('background-repeat', 'no-repeat').css('background-position', 'center center').css('opacity', '.6').css('cursor', 'default').off();
	// Add message field
	$('.ui-dialog-buttonset').prepend('<div class="msg"></div>')
	var fileids = (''+fileid).split(':');
	var tr = FileList.findFileEl(filenames[0]);
	var group = tr.attr('data-group');
	for(var i=0; i<fileids.length; ++i){
		$('div.msg').text("Uploading "+filenames[i]+"...");
		$.ajax({
			url: OC.webroot+'/remote.php/notebooks',
			async: false,
			data: {
				action: 'publish',
				fileid: fileids[i],
				filename: filenames[i],
				group: group,
				section: category,
				dataType: 'json',
				i: (''+(i+1))
			},
			type: "POST",
			success: function(data) {
				if(parseInt(data['i'])==fileids.length){
			    $('div.msg').text("All done.");
					$('button.popup_ok').css('background-image', '').css('opacity', '1.0').css('cursor', 'pointer').on();
					$('body').find('.ui-dialog').delay(2000)
					.queue(function (next) { 
						$(this).remove();
						next(); 
					});
				}
			},
			error: function(s, textStatus, errorThrown) {
				$('button.popup_ok').css('background-image', '').css('opacity', '1.0').css('cursor', 'pointer').on();
				OC.dialogs.alert(t("files_zenodo", "Publish: Something went wrong. "+errorThrown), t("files_zenodo", "Error"));
			}
		});
	}
}

function openZenodoAuth(fileid, filenames) {
	var baseURL = $('#selectedDepositBaseURL').val();
	var myClientAppID = $('#selectedClientAppID').val();
	var myClientSecret = $('#selectedClientSecret').val();
	if(!baseURL){
		OC.dialogs.alert(t('files_zenodo', 'Please choose a destination.'), t('files_zenodo', 'No destination'), function(res){}, true);
		return false;
	}
	var fileids = (''+fileid).split(':');
	for(var i=0; i<fileids.length; ++i){
		var uploaded = $('#fileList tr[data-id='+fileids[i]+']').attr('zenodo_uploaded');
		if(uploaded=='yes'){
			OC.dialogs.confirm(t('files_zenodo', 'The file '+filenames[i]+' has already been deposited. Altering its metadata or re-uploading is not recommended. Continue anyway?'),
					t('files_zenodo', 'Already uploaded'), function(res){if(res){doOpenZenodoAuth(fileid, baseURL, myClientAppID, myClientSecret);}}, false);
		}
		else{
			doOpenZenodoAuth(fileids[i], baseURL, myClientAppID, myClientSecret);
		}
	}
 }

function setMediaParams(){
	//var title = $('.ui-dialog .edit[value=Title]').parent().find('input.value').val();
	$('.ui-dialog .popup_ok').after("<span class='url'>media.sciencedata.dk</span>");
	$('.ui-dialog .popup_ok').text(t('files_zenodo', 'Next: Deposit to')+' ');
}

function setNotebookParams(){
	$('.ui-dialog .popup_ok').after("<span class='url'>sciencenotebooks.dk</span>");
	$('.ui-dialog .popup_ok').text(t('files_zenodo', 'Next: Deposit to')+' ');
	//$('div#meta_data_container ul li span:contains("Category")').first().parent().append('<span class="spacer">&hellip; or &hellip;</span><input class="value new_category" type="text" value="" placeholder= "Create new" title="Create new category"></input');
	$('#meta_data_container span.keyname:contains("Category")').parent().find('select.value').last().on('change', function(ev){
		$('#meta_data_container span.keyname:contains("Category")').parent().find('input.value').last().val('');
	});
	$('#meta_data_container span.keyname:contains("Category")').parent().find('input.value').last().on('input', function(ev){
		$('#meta_data_container span.keyname:contains("Category")').parent().find('select.value').last().val('');
	});
}

function doOpenZenodoAuth(fileid, baseURL, myClientAppID, myClientSecret){
	if(!clientAppID){
		OC.dialogs.alert(t('files_zenodo', "'Please ask your administrator to set a 'Zenodo' app ID."), t('files_zenodo', "No app ID"), function(res){}, true);
		return false;
	}
	var fileids = (''+fileid).split(':');
	var url
	for(var i=0; i<fileids.length; ++i){
		url = baseURL+"/oauth/authorize?"+
		"client_id="+myClientAppID+"&scope=deposit%3Awrite+deposit%3Aactions&"+
		"redirect_uri="+redirectUrl+"&response_type=token&state="+fileids[i];
		$('body').find('.ui-dialog').remove();
		oauthWindow = window.open(url, "_blank", 
			"toolbar=no, scrollbars=yes, width=620, height=600, top=500, left=500");
	}
}

function getTagID(tagname, callback){
	$.ajax({
		url: OC.filePath('meta_data', 'ajax', 'updateFileInfo.php'),
		async: false,
		timeout: 200,
		data: {
			tagname: tagname
		},
		type: "POST",
		success: function(tagid) {
			callback(tagid);
		}
	});
}

function addTag(fileid, filename, tagname, editafter){
	$.ajax({
		url: OC.filePath('meta_data', 'ajax', 'updateFileInfo.php'),
		async: false,
		timeout: 200,
		data: {
			fileid: fileid,
			tagname: tagname
		},
		type: "POST",
		success: function(tagid) {
			if(!tagid){
				OC.dialogs.alert("Please define a '"+tagname+"' schema.", "No metadata schema", function(res){}, true);
				return false;
			}
			if(editafter){
				if(tagname==='Zenodo'){
					editMeta(metaPopupTitle, filename, fileid, tagid, styleMetaPopup, openZenodoAuth);
				}
				else if(tagname==='MediaCMS'){
					editMeta(metaPopupTitle, filename, fileid, tagid, setMediaParams, publishMedia);
				}
				else if(tagname==='ScienceNotebooks'){
					editMeta(metaPopupTitle, filename, fileid, tagid, setNotebookParams, publishNotebook);
				}
			}
		}
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
			if(typeof s['communities'] != 'undefined' && s['communities'] != null){
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
	console.log(fileid);
	
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
		var userAffiliationSpan = null;
		if(userAffiliationI.length){
			userAffiliationSpan = userAffiliationI.parent().find('span');
		}
		var userAffiliation = '';
		if(userAffiliationSpan.length){
			userAffiliation = userAffiliationSpan.first().text();
		}
		
		getOrcid(function(orcid){
			creatorsInput.val('[{"name": "'+userFullName+'", "affiliation": "'+userAffiliation+(orcid.length?'", "orcid": "'+orcid+'"':'"')+'}]');
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
		var mm = today.getMonth()+1;//January is 0!
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
	
	//$('.ui-dialog .edit[value=deposition_id]').parent().addClass('hidden');
	$('.ui-dialog .edit[value=deposition_id]').parent().find('input.value').attr('placeholder', 'Fill in only if adding file to existing deposit');
	$('.ui-dialog .edit[value=uploaded]').parent().addClass('hidden');
	$('.ui-dialog .edit[value=bucket]').parent().addClass('hidden');
	var url = $('.ui-dialog .edit[value=url]').parent().find('input.value').val();
	$('.ui-dialog .edit[value=url]').parent().addClass('hidden');

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
	$('.ui-dialog .popup_ok').after("<select id='depositBaseURL'></select>");
	if(!depositBaseURL){
		OC.dialogs.alert("Please ask your administrator to set a deposit base URL.", "No base URL", function(res){}, true);
		return false;
	}
	var baseURLs = depositBaseURL.split(" ");
	if(baseURLs.length>1){
		$('#depositBaseURL').append('<option value=""></option>');
	}
	var selected = '';
	var thisbaseurl;
	jQuery.each(baseURLs, function(i, data) {
		selected = '';
		thisbaseurl = data.trim();
		if(url && url.startsWith(thisbaseurl)){
			selected = ' selected="selected"';
			$('#selectedDepositBaseURL').val(thisbaseurl);
			var clientAppIDs = clientAppID.split(" ");
			$('#selectedClientAppID').val(clientAppIDs[i].trim());
			var clientSecrets = clientSecret.split(" ");
			$('#selectedClientSecret').val(clientSecrets[i].trim());
		}
		$('#depositBaseURL').append('<option value="'+thisbaseurl+'"'+selected+'>'+thisbaseurl+'</option>');
	});
	if(baseURLs.length==1){
		setDepositData();
	}
	$('#depositBaseURL').change(function(el){
		setDepositData();
	});
	$('.ui-dialog .popup_ok').text(t('files_zenodo', 'Next: Deposit to')+' ');
}

function setDepositData(){
	var baseURLs = depositBaseURL.split(" ");
	$('#selectedDepositBaseURL').val($('#depositBaseURL').val());
	var i = $('#depositBaseURL').prop('selectedIndex')-(baseURLs.length>1?1:0);
	var clientAppIDs = clientAppID.split(" ");
	$('#selectedClientAppID').val(clientAppIDs[i].trim());
	var clientSecrets = clientSecret.split(" ");
	$('#selectedClientSecret').val(clientSecrets[i].trim());
}

function metaPopup(filename, tr, tag){
	if ($('#dropdown').length == 0) {
		//$(html).appendTo($(tr).find('td.filename'));
		$(tr).addClass('mouseOver');
		var filename = $(tr).data('file');
		var fileid = $(tr).data('id');
		if(typeof editMeta !== 'undefined'){
			var tagid = $(tr).find('span.tagtext').filter(function() { return ($(this).text()===tag) }).closest('.label').attr('data-tag');
			if(typeof tagid == 'undefined' || !tagid.length){
				addTag(fileid, filename, tag, true);
			}
			else{
				if(tag==='Zenodo'){
					editMeta(metaPopupTitle, filename, fileid, tagid, styleMetaPopup, openZenodoAuth);
				}
				else if(tag==='MediaCMS'){
					editMeta(metaPopupTitle, filename, fileid, tagid, setMediaParams, publishMedia);
				}
				else if(tag==='ScienceNotebooks'){
					editMeta(metaPopupTitle, filename, fileid, tagid, setNotebookParams, publishNotebook);
				}
			}
		}
		else{
			OC.dialogs.alert('Please install and enable the app metadata.', 'No metadata', function(res){}, true);
		}
	}
	else {
		$("#dropdown").slideUp(200, function() {
			$(this).remove();
		});
		$('tr').removeClass('mouseOver');
	}
}

function publishCreateSelect(filename, mimeType, zenodoOnly, el, multiple){
	var html = '<div id="publishAction" class="publishDrop'+(multiple?'':' filePublishSelect')+'">';
	html += '<select id="publishSelect">';
	html += '<option value="" disabled selected>'+t('files_zenodo', 'Select destination')+'</option>';
	html +='<option value="Zenodo">'+t('files_zenodo', 'Data repository (Zenodo)')+'</option>';
	html += '<option value="MediaCMS"'+((!zenodoOnly && mimeType.startsWith("video/"))?'':' disabled')+'>'+t('files_zenodo', 'Media platform (MediaCMS)')+'</option>';
	html += '<option value="ScienceNotebooks"'+((!zenodoOnly && mimeType=="application/x-ipynb+json")?'':' disabled')+'>'+t('files_zenodo', 'Notebook demos (ScienceNotebooks)')+'</option>';;
	html += '</select>';
	html += '</div>';
	$(html).appendTo(el);
	$(html).find('option').css('font-weight', 'bold');
	$(html).find('option.disabled').css('font-weight', 'lighter');
	$(html).find('option').first().css('opacity', '.8');
}

$(document).ready(function() {
	
	$('body').prepend('<input type="hidden" id="selectedDepositBaseURL"></input>');
	$('body').prepend('<input type="hidden" id="selectedClientAppID"></input>');
	$('body').prepend('<input type="hidden" id="selectedClientSecret"></input>');

	getClient();
	
	addSelectedPublishAction();
	
	if (typeof FileActions !== 'undefined') {
		// Register our function with ownCloud - files, not folders
		FileActions.register(/*'file'*/'all', t('files_zenodo', 'Zenodo'), OC.PERMISSION_READ, OC.imagePath('files_zenodo', 'forward'),
			function(filename, context) {
				if (scanFiles.scanning) {
					return;
				}
				
				var tr = FileList.findFileEl(filename);
				
				if (($('#publishAction').length > 0)) {
					$('#publishAction').detach();
					$('.ui-autocomplete').remove();
					$('tr').removeClass('mouseOver');
				}
				else{
					$(tr).addClass('mouseOver');
					publishCreateSelect(filename, tr.attr('data-mime'), false, $(tr).find('td.filename'), false);
					// appendTo runs synchronously, so we can just add action here
					$('#publishSelect').on('change', function(ev){
						metaPopup(filename, tr, $('#publishSelect').val());
					});
				}
			}
		);
	}
	
	$(this).click(function(event){
		if( !$(event.target).hasClass('ui-corner-all') && $(event.target).parents().index($('.ui-menu'))==-1 &&
			!$(event.target).hasClass('publishDrop') && !$(event.target).is('#publishAction') &&
			$(event.target).parents().index($('#publishAction'))==-1){
			$('#publishAction').detach();
		}
	});

	// Add action to top bar (visible when files are selected)
	/*if(!$('.nav-sidebar li[data-id="sharing_in"] a.active').length &&
			!$('.nav-sidebar li[data-id="trash"] a.active').length &&
			(typeof OCA.Files !== 'undefined' && OCA.Files.FileList.prototype.getGetParam('view')!='trashbin')){
		$('#headerName .selectedActions').prepend(
			'<a class="zenodo btn btn-xs btn-default" id="zenodo" href=""><i class="icon icon-forward"></i>' + t('files_zenodo', ' Publish') + '</a>&nbsp;');
	}*/
});
