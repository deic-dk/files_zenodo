function files_zenodo_send(filename, context) {
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
		FileActions.register('all', t('files_zenodo', 'Zenodo'), OC.PERMISSION_READ, OC.imagePath('files_zenodo', 'img/zenodo_z'),
			function(filename) {
				if (scanFiles.scanning) {
					return;
				}
				if ($('#dropdown').length == 0) {
					var tr = FileList.findFileEl(filename);
					var itemType = 'file';
					var itemSource = $(tr).data('id');
					var html = '<div id="dropdown" class="drop" data-item-type="' + itemType +
						'" data-item-source="' + itemSource +
						'"><b>Upload type:</b><br><select id="uploadtype"><option value="publication">Publication</option><option value="poster">Poster</option><option value="presentation">Presentation</option><option value="dataset">Dataset</option><option value="image">Image</option><option value="video">Video/Audio</option><option value="software">Software</option></select>&nbsp;<select id="publicationtype"><option value="book">Book</option><option value="section">Section</option><option value="conferencepaper">Conference paper</option><option value="article">Article</option><option value="patent">Patent</option><option value="preprint">Preprint</option><option value="report">Report</option><option value="softwaredocumentation">Software documentation</option><option value="thesis">Thesis</option><option value="technicalnote">Technical note</option><option value="workingpaper">Working paper</option><option value="other">Other</option></select>&nbsp;<select id="imagetype"><option value="figure">Figure</option><option value="plot">Plot</option><option value="drawing">Drawing</option><option value="diagram">Diagram</option><option value="photo">Photo</option><option value="other">Other</option></select><br><b>Publication date:</b><br><input type="text" id="publicationdate"><br><b>Title:</b><br><input type="text" id="title"><br><b>Creators:</b><br><input type="text" id="creators"><br><b>Description:</b><br><input type="text" id="description"><br><b>Access right:</b> <select id="accessright"><option value="open">Open</option><option value="embargoed">Embargoed</option><option value="restricted">Restricted</option><option value="closed">Closed</option></select> <b>License:</b> <br><b>Embargo date:</b><br><input type="text" id="embargo_date"><br><b>Access Conditions:</b><br><input type="text" id="access_right"><br><input type=button value="Publish (sandbox)"> <input type=button value="Publish (production)"></div>';

					$(html).appendTo($(tr).find('td.filename'));
					$(tr).addClass('mouseOver');
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
	$('#app-content-files #headerName .selectedActions').prepend(
		'<a class="tag btn btn-xs btn-default" id="tag" href=""><i class="icon icon-zenodo"></i>' + t('files_zenodo', ' Zenodo') + '</a>&nbsp;');

});
