	<head><style type="text/css">pb{display: none;}</style></head>
		<title>Thanks</title>
		<meta charset="utf-8">
		<link rel="stylesheet" href="<?php echo OC::$WEBROOT;?>/core/css/styles.css?v=cf866614b6b18cda13fe699a3a65661b" type="text/css" media="screen">
		<link rel="stylesheet" href="<?php echo OC::$WEBROOT;?>/core/css/apps.css?v=cf866614b6b18cda13fe699a3a65661b" type="text/css" media="screen">
		<link rel="stylesheet" href="<?php echo OC::$WEBROOT;?>/core/css/fixes.css?v=cf866614b6b18cda13fe699a3a65661b" type="text/css" media="screen">
		<link rel="stylesheet" href="<?php echo OC::$WEBROOT;?>/core/css/jquery-ui-1.10.0.custom.css?v=cf866614b6b18cda13fe699a3a65661b" type="text/css" media="screen">
		<link rel="stylesheet" href="<?php echo OC::$WEBROOT;?>/core/css/jquery.ocdialog.css?v=cf866614b6b18cda13fe699a3a65661b" type="text/css" media="screen">
		<link rel="stylesheet" href="<?php echo OC::$WEBROOT;?>/apps/files_zenodo/css/style.css?v=cf866614b6b18cda13fe699a3a65661b" type="text/css" media="screen">
		<!-- For some reason this is not loading: -->
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" type="text/css" media="screen">
		<script type="text/javascript" src="<?php echo OC::$WEBROOT;?>/core/js/jquery-ui-1.10.0.custom.js?v=cf866614b6b18cda13fe699a3a65661b"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" ></script>
		<script type="text/javascript" src="<?php echo OC::$WEBROOT;?>/core/js/jquery-1.10.0.min.js?v=cf866614b6b18cda13fe699a3a65661b"></script>
		<script type="text/javascript" src="<?php echo OC::$WEBROOT;?>/apps/files_zenodo/js/thanks.js?v=cf866614b6b18cda13fe699a3a65661b"></script>
	<body>
	<script>
	</script>
	<div class="zenodo-popup">
		<div class="progress">
			<div class="progress-bar progress-bar-success" role="progressbar" 
			aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%">
				0%
			</div>
		</div>
		<div class="upload_info alert alert-info">Hang on - uploading...</div>
		<h2>
			Thank you for uploading your data to
			<a target="_blank" class="deposit_link" href="<?php echo $_['url'];?>"><img class="zenodo_img" src="/apps/files_zenodo/img/zenodo.svg" /></a>
		</h2>
		<div>
			Edit your new publication at <a target="_blank" class="deposit_link link" href="<?php echo $_['url'];?>"><?php echo $_['url'];?></a>.
		</div>
	</div>
	</body>
