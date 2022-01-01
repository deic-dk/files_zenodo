function getPbPercentDone(){
	if(!$("pb").length){
		return -1;
	}
	var n = parseInt($("pb").last().text());
	$("pb").remove();
	return n;
}

function setProgressBarProgress(percentDone){
	if(percentDone<0){
		return false
	}
	$(".progress-bar").attr("aria-valuenow", percentDone);
	$(".progress-bar").css("width", percentDone+"%");
	$(".progress-bar").text(percentDone+"%");
}

(function(){
	var timer = setInterval(function(){
		percentDone = getPbPercentDone();
		setProgressBarProgress(percentDone);
		if(percentDone==100){
			var url = $("#deposit_link").attr("href");
			$("#deposit_link").attr("href", url+"/"+$(".deposit_id").text());
			$("#deposit_link.link").text(url+"/"+$(".deposit_id").text());
			$(".upload_info").removeClass("alert-info");
			$(".upload_info").addClass("alert-success");
			$(".upload_info").text("Done!");
			clearInterval(timer);
		}
	}, 1000);

})();


