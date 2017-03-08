var brfv4 = brfv4 || {};

(function(lib) {
	"use strict";

	function BRFv4WebcamUtils(video) {
		this.constraints	= null;
		this.video			= video;
		this.onCameraReady	= null;
		this.stream			= null;
	}

	BRFv4WebcamUtils.prototype.waitForStream = function(width, height, fps, callback) {
		this.constraints = {video: {width: width, height: height, frameRate: fps}};
		this.onCameraReady = callback;
		this.startStream();
	};

	BRFv4WebcamUtils.prototype.startStream = function() {
		this.stopStream();
		lib.trace("BRFv4WebcamUtils.startStream: try: " + this.constraints.video.width + "x" + this.constraints.video.height);
		window.navigator.mediaDevices.getUserMedia(this.constraints)
			.then (this.onStreamFetched.bind(this))
			.catch(this.onStreamError.bind(this));
	};

	BRFv4WebcamUtils.prototype.stopStream = function() {
		this.playing = false;
		if (this.stream != null) {
			this.stream.getTracks().forEach(function(track) {
				track.stop();
			});
			this.stream = null;
		}
		if(this.video != null && this.video.srcObject != null) {
			this.video.srcObject = null;
		}
	};

	BRFv4WebcamUtils.prototype.onStreamError = function(e) {
		lib.trace("BRFv4WebcamUtils.onStreamError: " + e);
	};

	BRFv4WebcamUtils.prototype.onStreamFetched = function(mediaStream) {
		this.stream = mediaStream;

		if(this.video != null) {
			this.video.srcObject = mediaStream;
			this.video.play();
			this.onStreamDimensionsAvailable();
		}
	};

	BRFv4WebcamUtils.prototype.onStreamDimensionsAvailable = function(e) {

		// As we can't be sure, what resolution we get, we need to read it
		// from the already playing stream to be sure.

		if(this.video.videoWidth == 0) {
			lib.trace("BRFv4WebcamUtils.onStreamDimensionsAvailable: waiting");
			setTimeout(this.onStreamDimensionsAvailable.bind(this), 100);
		} else {
			// Now we know the dimensions of the stream. So tell the app, the camera is ready.
			this.playing = true;
			if(this.onCameraReady) {
				this.onCameraReady();
			}
		}
	};

	lib.BRFv4WebcamUtils = BRFv4WebcamUtils;

})(brfv4);
