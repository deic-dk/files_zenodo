
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
                                        var html = '<div id="dropdown" class="drop" data-item-type="'
					+itemType+
					'" data-item-source="'
					+itemSource+
					'"><b>Upload type:</b> <select id="uploadtype"><option value="publication">Publication</option><option value="poster">Poster</option><option value="presentation">Presentation</option><option value="dataset">Dataset</option><option value="image">Image</option><option value="video">Video/Audio</option><option value="software">Software</option></select>&nbsp;<select id="publicationtype"><option value="book">Book</option><option value="section">Section</option><option value="conferencepaper">Conference paper</option><option value="article">Article</option><option value="patent">Patent</option><option value="preprint">Preprint</option><option value="report">Report</option><option value="softwaredocumentation">Software documentation</option><option value="thesis">Thesis</option><option value="technicalnote">Technical note</option><option value="workingpaper">Working paper</option><option value="other">Other</option></select>&nbsp;<select id="imagetype"><option value="figure">Figure</option><option value="plot">Plot</option><option value="drawing">Drawing</option><option value="diagram">Diagram</option><option value="photo">Photo</option><option value="other">Other</option></select><br><b>Publication date:</b> <input type="text" id="publicationdate"><br><b>Title:</b> <input type="text" id="title"><br><b>Creators:</b> <input type="text" id="creators"><br><b>Description:</b> <input type="text" id="description"><br><b>Access right:</b> <select id="accessright"><option value="open">Open</option><option value="embargoed">Embargoed</option><option value="restricted">Restricted</option><option value="closed">Closed</option></select><br><b>License:</b> ( to be selected from https://zenodo.org/kb/export?kbname=licenses&format=kba )<br><b>Embargo date:</b> <input type="text" id="embargo_date"><br><b>Access Conditions:</b> <input type="text" id="access_right"><br><br><b>DOI:</b> <input type="text" id="doi"><br><b>Pre-reserve DOI?</b> <input type="checkbox" id="prereserve_doi"><br><b>Keywords:</b> <input type="text" id="keywords"><br><b>Notes:</b> <input type="text" id="notes"><br><b>Related identifiers:</b> <input type="text" id="related_identifiers"><br><b>Contributors:</b> <input type="text" id="contributors"><br><b>References:</b> <input type="text" id="references"><br><b>Communities:</b> <input type="text" id="communities"><br><b>Grants:</b> <input type="text" id="grants"><br><b>Journal title:</b> <input type="text" id="journal_title"><br><b>Journal volume:</b> <input type="text" id="journal_volume"><br><b>Journal issue:</b> <input type="text" id="journal_issue"><br><b>Journal pages:</b> <input type="text" id="journal_pages"><br><b>Conference title:</b> <input type="text" id="conference_title"><br><b>Conference acronym:</b> <input type="text" id="conference_acronym"><br><b>Conference dates:</b> <input type="text" id="conference_dates"><br><b>Conference place:</b> <input type="text" id="conference_place"><br><b>Conference URL:</b> <input type="text" id="conference_url"><br><b>Conference session:</b> <input type="text" id="conference_session"><br><b>Conference session part:</b> <input type="text" id="conference_session_part"><br><b>Imprint publisher:</b> <input type="text" id="imprint_publisher"><br><b>Imprint ISBN:</b> <input type="text" id="imprint_isbn"><br><b>Imprint place:</b> <input type="text" id="imprint_place"><br><b>Part of title:</b> <input type="text" id="partof_title"><br><b>Part of pages:</b> <input type="text" id="partof_pages"><br><b>Thesis supervisors:</b> <input type="text" id="thesis_supervisors"><br><b>Thesis university:</b> <input type="text" id="thesis_university"><br><b>Subjects:</b> <input type="text" id="subjects"><br><input type=button value="Publish (sandbox)"> <input type=button value="Publish (production)"></div>';

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

