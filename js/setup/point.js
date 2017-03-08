brfv4.example.setupWebcamExample = brfv4.example.setupWebcamExample || function() {

	if(!brfv4.example.initElements) {
		return;
	}

	brfv4.example.initElements();

	var getElement		= brfv4.example.getElement;

	var _webcamUtils	= getElement("webcamUtils");
	var _imageData		= getElement("_imageData");

	/*if(!_webcamUtils || !_imageData) {
		brfv4.trace("Please add a <video> tag with id='_webcam' and a <canvas> tag with id='_imageData' to the DOM.", true);
		return;
	}*/

	var _resolution		= getElement("resolution");

	// overwrite how to update the image data we work on

	brfv4.example.updateImageData = function() {

		var _imageDataCtx = _imageData.getContext("2d");

		_imageDataCtx.setTransform(-1.0, 0, 0, 1, _resolution.width, 0); // mirrored
		_imageDataCtx.drawImage(_webcamUtils.video, 0, 0, _resolution.width, _resolution.height);
	};

	// Don't reinit webcam if the stream is already available.

/*	brfv4.example.isImageDataAvailable = function() {
		console.log("cam isImageDataAvailable: " + _webcamUtils.playing);
		return _webcamUtils.playing;
	};*/

	brfv4.example.isImageDataStream = function() {
		return true;
	};
/*
	brfv4.example.initImageData = function() {
		console.log("cam initImageData: " + _webcamUtils.playing);
		_webcamUtils.waitForStream(_resolution.width, _resolution.height, 30, onCameraReady);
	};

	*/
/*
	brfv4.example.disposeImageData = function() {
		_webcamUtils.stopStream();
		console.log("cam disposeImageData: " + _webcamUtils.playing);
	};
	*/

	function onCameraReady() {
		"use strict";
		brfv4.example.onImageDataReady(window.innerWidth, window.innerHeight);
	}

		onCameraReady();
};
