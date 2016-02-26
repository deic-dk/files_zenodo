
function files_zenodo_send (filename, context) {
	var dir = context.dir || context.fileList.getCurrentDirectory();
	$.ajax(OC.linkTo('files_zenodo', 'ajax/send.php'), {
		type: 'POST',
		data: {
			filename: filename,
			dir: dir
		},
		dataType: 'json',
		success: function(s) {
			alert(JSON.stringify(s));
			
		},
		error: function(s) {
			alert('error ' + JSON.stringify(s));
		}
});
}

$(document).ready(function() {
	if (typeof FileActions !== 'undefined') {
		FileActions.register('all', t('files_zenodo','Zenodo'), OC.PERMISSION_READ, OC.imagePath('files_zenodo','img/zenodo_z'),
			function(filename) {
				if(scanFiles.scanning) { return; }
				if($('#dropdown').length==0){
					var tr = FileList.findFileEl(filename);
					var itemType = 'file';
					var itemSource = $(tr).data('id');
					var html = '<div id="dropdown" class="drop" data-item-type="'+itemType+'" data-item-source="'+itemSource+'">&nbsp;<img src="/apps/files_zenodo/img/orcid.png"><a href="http://orcid.org/0000-0001-8135-3489" target="_new">0000-0001-8135-3489</a>&nbsp;(change)<br>Zenodo token:<br><br><input type=button value="Publish (sandbox)"> <input type=button value="Publish (production)"></div>';


					$(html).appendTo( $(tr).find('td.filename') );
					$(tr).addClass('mouseOver');
					addNewDropDown(itemSource);
				}
				else {
					$("#dropdown").slideUp(200, function(){ $(this).remove();});
					$('tr').removeClass('mouseOver');
				}
			}
		);
	}
        // Add action to top bar (visible when files are selected)
        $('#app-content-files #headerName .selectedActions').prepend(
                        '<a class="tag btn btn-xs btn-default" id="tag" href=""><i class="icon icon-zenodo"></i>'+t('files_zenodo',' Zenodo')+'</a>&nbsp;');

});

