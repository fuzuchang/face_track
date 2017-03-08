brfv4.example.preloader = brfv4.example.preloader || null;

brfv4.example.setProgressBar = function(percent, visible) {

	var bar = document.getElementById("_preloader");
	if(!bar) return;

	if(percent < 0.0) percent = 0.0;
	if(percent > 1.0) percent = 1.0;

	var width = Math.round(percent * 640);
	var color = //ffd200
		(((percent * 64 + 128 + 64) & 0xff) << 16) +
		(((percent * 55 + 105 + 50) & 0xff) <<  8); // no blue portion

	bar.style.width = width + "px";
	bar.style.backgroundColor = "#" + color.toString(16);
	bar.style.display = visible ? "block" : "none";
};

brfv4.example.preload = function (filesToLoad, callback) {

	if (brfv4.example.preloader != null || !filesToLoad) {
		return;
	}

	function onFileLoaded(event) {
		var item = event.item;
		var id = item.id;
		var req = brfv4.memoryInitializerRequest;

		if(id == "memFile" && req) {
			req.response = event.result;
			if(req.callback) { req.callback(); }
		}
	}

	function onPreloadProgress(event) {
		brfv4.example.setProgressBar(event.loaded, true);
	}

	function onPreloadComplete(event) {
		brfv4.example.setProgressBar(1.0, false);
		if(callback) callback();
	}

	var loader = brfv4.example.preloader = new createjs.LoadQueue(true);
	loader.on("progress", onPreloadProgress);
	loader.on("complete", onPreloadComplete);
	loader.on("fileload", onFileLoaded);
	loader.loadManifest(filesToLoad, true);
};

brfv4.example.loadSetup = function (filesToLoad) {

	function onPreloadComplete(event) {
		brfv4.example.setProgressBar(1.0, false);
		setupBasics();
		brfv4.example.reinit();
	}

	var loader = brfv4.example.loader = new createjs.LoadQueue(true);
	// loader.on("progress", onPreloadProgress);
	loader.on("complete", onPreloadComplete);
	loader.loadManifest(filesToLoad, true);
};

brfv4.example.loadExample = function (filesToLoad) {

	function onPreloadComplete(event) {
		brfv4.example.setProgressBar(1.0, false);
		setupExample();
		brfv4.example.reinit();
	}

	var loader = brfv4.example.loader = new createjs.LoadQueue(true);
	// loader.on("progress", onPreloadProgress);
	loader.on("complete", onPreloadComplete);
	loader.loadManifest(filesToLoad, true);
};
