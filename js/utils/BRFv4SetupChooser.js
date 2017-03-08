(function() {
	"use strict";
	
	var example		= brfv4.example;
	var component	= example.setupChooser 	= example.setupChooser || {};
	var controller	= component.controller	= component.controller || {};

	QuickSettings.useExtStyleSheet();

	var _settingsLeft  = document.getElementById("_settingsLeft");

	var _urlMap = {
		"Webcam Setup":		brfv4.example.setupWebcamExample,
		"Image Setup":		brfv4.example.setupImageExample
	};
	var _urls = [];
	for (var key in _urlMap) { _urls.push(key); }

	controller.onChoseSetup = function(data) {

		var setupFunc = _urlMap[data.value];

		if(setupFunc) {
			brfv4.example.reset();
			setupFunc();
			brfv4.example.reinit();
		}
	};

	component.panel = QuickSettings.create(7, 12, "Setup Chooser", _settingsLeft).setWidth(200)

		.addHTML("Switch between setups", "Choose which setup to run.")

		.addDropDown("_setup", _urls, controller.onChoseSetup)
		.hideTitle("_setup");
})();
