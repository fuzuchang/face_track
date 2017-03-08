var brfv4 = brfv4 || {};

(function(lib) {
	"use strict";

	function BRFv4SDKUtils() {
		this.onSDKReady = null;
	}

	BRFv4SDKUtils.prototype.waitForSDK = function(callback) {
		this.onSDKReady = callback;
		if(!lib.sdkReady) {
			this.checkReady();
 		} else if(this.onSDKReady)  {
			this.onSDKReady();
		}
	};

	BRFv4SDKUtils.prototype.checkReady = function() {
		if(lib.sdkReady) {
			if(this.onSDKReady) this.onSDKReady();
		} else {
			setTimeout(this.checkReady.bind(this), 100);
		}
	};

	BRFv4SDKUtils.prototype.createElement = function(element, id, width, height, parent) {
		if(element == "canvas" || element == "video") {
			var tag = document.createElement(element);
			tag.id = id;
			tag.width = width;
			tag.height = height;

			if(parent) {
				var p = document.getElementById(parent);
				if(p) {
					p.appendChild(tag);
				} else {
					document.body.appendChild(tag);
				}
			}

			return tag;
		}
		return null;
	};

	BRFv4SDKUtils.prototype.createCanvas = function(id, width, height, parent) {
		// First look for an existing element with this id.
		var canvas = document.getElementById(id);
		// Not found? Create it.
		if(!canvas) {
			canvas = this.createElement("canvas", id, width, height, parent);
		} else {
			// Found? Then update size.
			canvas.width = width;
			canvas.height = height;
		}
		return canvas;
	};

	BRFv4SDKUtils.prototype.createVideo = function(id, width, height, parent) {
		// First look for an existing element with this id.
		var videoElement = document.getElementById(id);
		// Not found? Create it.
		if(!videoElement) {
			videoElement = this.createElement("video", id, width, height, parent);
		}
		return videoElement;
	};

	lib.BRFv4SDKUtils = BRFv4SDKUtils;

})(brfv4);