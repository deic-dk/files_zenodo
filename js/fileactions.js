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
			};
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
			$(this).prepend('<a class="publish btn btn-xs btn-default" href=""><i class="icon icon-forward"></i>'+t('files_zenodo',' Publish')+'</a>&nbsp;')
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

window.publishMediaContinue = true;

function publishMedia(fileid, filenames) { /*both can be multi-entry strings like file1:file2:file3*/
	var title = $('#meta_data_container span.keyname:contains("Title")').parent().find('input.value').last().val();
	var description = $('#meta_data_container span.keyname:contains("Description")').parent().find('input.value').last().val();
	$('button.popup_ok').css('background-image', 'url('+ OC.imagePath('core', 'loading-small.gif') + ')').css('background-repeat', 'no-repeat').css('background-position', 'center center').css('opacity', '.6').css('cursor', 'default').off();
	// Add message field
	$('.ui-dialog-buttonset').prepend('<div class="msg"></div>')
	var fileids = (''+fileid).split(':');
	var tr = FileList.findFileEl(filenames[0]);
	var group = tr.attr('data-group');
	var totalUploads = fileids.length;
	window.publishMediaContinue = true;
	$('button.popup_cancel').click(function(ev){
		window.publishMediaContinue = false;
	});
	uploadMedia(fileids, filenames, group, title, description, 0, totalUploads);
}

function uploadMedia(fileids, filenames, group, title, description, i, totalUploads){
	if(!window.publishMediaContinue){
		return;
	}
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
			i: i
		},
		type: "POST",
		success: function(data) {
			i = parseInt(data['i']);
			if(i==totalUploads){
				$('div.msg').text("All done.");
				$('button.popup_ok').css('background-image', '').css('opacity', '1.0').css('cursor', 'pointer').on();
				$('body').find('.ui-dialog').delay(4000).queue(function (next) {
					$(this).remove();
					next(); 
				});
			}
			else{
				uploadMedia(fileids, filenames, group, title, description, i, totalUploads);
			}
		},
		error: function(s, textStatus, errorThrown) {
			totalUploads = totalUploads - 1;
			$('button.popup_ok').css('background-image', '').css('opacity', '1.0').css('cursor', 'pointer').on();
			OC.dialogs.alert(t("files_zenodo", "Publish: Something went wrong uploading "+filenames[i]+". Please make sure you have already logged in on media.sciencedata.dk. "+errorThrown), t("files_zenodo", "Error"));
		}
	});
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
			"toolbar=no, scrollbars=yes, width=620, height=800, top=500, left=500");
	}
}

function getTagID(tagname, callback){
	$.ajax({
		url: OC.filePath('meta_data', 'ajax', 'getTagID.php'),
		async: false,
		timeout: 200,
		data: {
			tagname: tagname
		},
		type: "GET",
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
		if(userAffiliationSpan && userAffiliationSpan.length){
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

function loadScript(url, callback) {
	var script = document.createElement("script")
	script.type = "text/javascript";
	if(script.readyState){ //IE
		script.onreadystatechange = function () {
			if (script.readyState == "loaded" || script.readyState == "complete") {
				script.onreadystatechange = null;
				if(callback){
					callback();
				}
			}
		}
	}
	else{ //Others
		script.onload = function () {
			if(callback){
				callback();
			}
		}
	}
	script.src = url;
	document.getElementsByTagName("head")[0].appendChild(script);
}

function showEpubViewer(dir, file, id, owner, group){
	if(typeof FileList !== 'undefined'){
		FileList.showMask();
	}
	if(typeof OCA.Files.App.fileList.getGroup !== 'undefined'){
		group = OCA.Files.App.fileList.getGroup();
	}
	var path = dir+'/'+file;
	var epubSrc = OC.webroot+'/themes/deic_theme_oc7/apps/files/ajax/download.php?'+'dir='+
		dir+
		(group?'&group='+encodeURIComponent(group):'')+
		(id?'&id='+id:'')+(owner?'&owner='+owner:'')+
		'&files='+encodeURIComponent(file);
	epubframe = $('<div id="epubframe"><div id="epubbar">\
		<a class="hlink navlink" id="close" title="'+t('files_zenodo', 'Close')+'">&#10006;</a>\
		<a class="hlink navlink" id="toc" title="'+t('files_zenodo', 'TOC')+'">&#9776;</a>\
		<a class="hlink navlink" id="prev" title="'+t('files_zenodo', 'Next page')+'">&larr;</a>\
		<a class="hlink navlink" id="next" title="'+t('files_zenodo', 'Previous page')+'">&rarr;</a>\
		<div id="TOC"><ul></ul></div>\
	</div>');
	var path = dir+'/'+file;
	var appcontent = '';
	if($('#app-content').length){
		appcontent = '#app-content';
	}
	else if($('#app-content-public').length){
		appcontent = 'header>#header';
	}
	else{
		return false;
	}
	$.when($(appcontent).append(epubframe)).then(
		function(){
			loadScript(OC.webroot+'/apps/files_zenodo/js/jszip.js');
			loadScript(OC.webroot+'/apps/files_zenodo/js/epub.js', function(){
				var book = ePub(epubSrc);
				var rendition = book.renderTo("epubframe", {method: "default", width: "100%", height:  800, ignoreClass: 'annotator-hl',
					flow: "paginated"});
				rendition.display();
			// Navigation loaded
			book.loaded.navigation.then(function(toc){
				//console.log(toc);
				for(var i=0; i<toc.toc.length; i++) {
					$('#TOC ul').append('<li><a class="toclink hlink" href="'+toc.toc[i].href+'">'+toc.toc[i].label+'</a></li>')
				}
				$("#TOC").hide();
				$('a.toclink').click(function(ev) {
					ev.preventDefault();
					ev.stopPropagation();
					rendition.display($(this).attr('href'));
					return false;
				});
			});
			// Navigation
			$("#epubframe #next").click(function(){
				rendition.next();
			});
			 $("#epubframe #prev").click(function(){
				rendition.prev();
			});
			$("#epubframe #toc").click(function(){
				$("#TOC").toggle();
			});
			var keyListener = function(e){
				// Left Key
				if ((e.keyCode || e.which) == 37) {
				rendition.prev();
				}
				// Right Key
				if ((e.keyCode || e.which) == 39) {
				rendition.next();
				}
			};
			rendition.on("keyup", keyListener);
			document.addEventListener("keyup", keyListener, false);
			rendition.on("relocated", function(location){
				$('.epub-view').css('height', '800px');
				//console.log(location);
				var cssLink = document.createElement("link");
				cssLink.href = OC.webroot+'/apps/files_zenodo/css/style.css'; 
				cssLink.rel = "stylesheet"; 
				cssLink.type = "text/css"; 
				window.frames[0].document.head.appendChild(cssLink);
				$(window.frames[0]).on("mousedown, mouseup, click", function(){
					$('#TOC').hide();
				});
			});
			rendition.themes.default(OC.webroot+"/themes/deic_theme_oc7/core/css/dark-theme.css");
			$("#epubframe")[0].scrollIntoView();
			$('#epubframe #close').click(function(){
				rendition.destroy();
				$('div#epubframe').remove();
				var view;
				if(typeof FileList!=='undefined'){
					view = FileList.getGetParam('view');
				}
				if(view=='' || view=='files'|| view=='sharingin'){
					$('#app-content-files.viewcontainer.inuse').removeClass('hidden').removeClass('inuse');
					$('#app-content-sharingin.viewcontainer.inuse').removeClass('hidden').removeClass('inuse');
					var dirref = OC.linkTo('files', 'index.php') + '?dir=' + dir + (view&&view!=''?'&view='+view:'');
					window.history.pushState( {service: 'files',  dir: dir}, '', dirref);
					//window.history.back();
				}
				$('#app-content-public #preview').removeClass('hidden');
			});
			if(typeof FileList !== 'undefined'){
				FileList.hideMask();
			}
			$('#app-content-files.viewcontainer:visible').addClass('hidden').addClass('inuse');
			$('#app-content-sharingin.viewcontainer:visible').addClass('hidden').addClass('inuse');
			$('#app-content-public #preview').addClass('hidden');
			var view;
			if(typeof FileList!=='undefined'){
				view = FileList.getGetParam('view');
			}
			if(view=='' || view=='files'|| view=='sharingin'){
				var ref = OC.linkTo('files', 'index.php') + '?dir=' + dir + '&file=' + file + (view&&view!=''?'&view='+view:'');
				window.history.pushState( {service: 'files', file: path}, '', ref);
			}
		});
	});
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
		
		/// EPUB
		if (OCA.Files) {
			OCA.Files.fileActions.register('application/epub+zip', 'View', OC.PERMISSION_READ, '', function (filename, context) {
				showEpubViewer(context.dir, filename, context.id, context.owner);
			});
			OCA.Files.fileActions.setDefault('application/epub+zip', 'View');
		}
		$('#app-content-public #imgframe img.publicpreview.epub').click(function(){
			showEpubViewer($('#dir').val(), $('#filename').val(), $('#fileid').val(), $('#owner').val());
		});
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
	
	$(document).click(function(e){
		// Hide EPUB TOC if shown and clicking outside it - works only for clicks outside the EPUB iframe---
		if(!$(e.target).is($('#TOC')) && !$(e.target).is($('#toc')) &&
				!$(e.target).parents().filter('#TOC').length &&
				!$(e.target).parents().filter('#toc').length) {
			$('#TOC').hide();
		}
	});
	
	$(window).on('popstate', function() {
		$('#epubframe').remove();
		$('#epubbar').remove();
		if(typeof FileList!=='undefined' && FileList.getGetParam){
			view = FileList.getGetParam('view');
			if(view=='' || view=='files' || view=='sharingin'){
				$('#app-content-files.viewcontainer.inuse').removeClass('hidden');
				$('#app-content-sharingin.viewcontainer.inuse').removeClass('hidden');
			}
		}
		$('#app-content-public #preview').removeClass('hidden');
  });

});
