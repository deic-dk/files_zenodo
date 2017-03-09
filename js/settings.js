$(document).ready(function() {

	// catch clicks on our Submit button
	$('#tokensubmit').click(function() {
		clientAppID = $('#clientAppID').val();
		clientSecret = $('#clientSecret').val();
		communities = $('#communities').val();

		$.ajax(OC.linkTo('files_zenodo', 'ajax/set_tokens.php'), {
			type: "POST",
			data: {
				clientAppID: clientAppID,
				clientSecret: clientSecret,
				communities: communities
			},
			dataType: 'json',
			success: function(s) {
				 OC.msg.finishedSaving('#zenodostatus', {status: 'success', data: {message: "Client ID/secret + communities stored."}});
					$('#zenodostatus').css("color", "green");
			}
		});
	});

	// retrieve our stored token values (if any)
	$.ajax(OC.linkTo('files_zenodo', 'ajax/get_tokens.php'), {
		type: "GET",
		dataType: 'json',
		success: function(s) {
			$('#clientAppID').val(s['clientAppID']);
			$('#clientSecret').val( s['clientSecret']);
			$('#communities').val( s['communities']);
		}
	});

});
