$(document).ready(function() {

	// catch clicks on our Submit button
	$('#tokensubmit').click(function() {
		productiontoken = document.getElementById('productiontoken').value;
		sandboxtoken = document.getElementById('sandboxtoken').value;

		$.ajax(OC.linkTo('files_zenodo', 'ajax/set_tokens.php'), {
			type: "POST",
			data: {
				sandboxtoken: sandboxtoken,
				productiontoken: productiontoken
			},
			dataType: 'json',
			success: function(s) {
				document.getElementById('zenodostatus').style.color = "green";
				document.getElementById('zenodostatus').innerHTML = "Stored.";

			}
		});

	});

	// retrieve our stored token values (if any)
	$.ajax(OC.linkTo('files_zenodo', 'ajax/get_tokens.php'), {
		type: "GET",
		dataType: 'json',
		success: function(s) {
			document.getElementById('sandboxtoken').value = s['sandboxtoken'];
			document.getElementById('productiontoken').value = s['productiontoken'];
		}
	});

});
