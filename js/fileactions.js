var oauthWindow;
var clientAppID;
var clientSecret;
var redirectUrl;

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
				editMeta(tagname, filename, fileid, result, openZenodoAuth);
			}
		},
	});
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
					var filename = $(tr).find('td.filename');
					var fileid = $(tr).data('id');
					if(typeof editMeta !== 'undefined'){
						var tagid = $(tr).find('span.tagtext').filter(function() { return ($(this).text() === 'Zenodo') }).closest('.label').attr('data-tag');
						if(typeof tagid == 'undefined' || !tagid.length){
							addTag(fileid, filename, 'Zenodo');
						}
						else{
							editMeta('Zenodo', filename, fileid, tagid, openZenodoAuth);
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
