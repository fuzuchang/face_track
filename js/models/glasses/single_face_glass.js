function setupExample() {
	"use strict";



	// The BRFv4ThreeJSUtils should already be set up.

	var _threejsUtils = brfv4.example.threejsUtils;

	function loadModels() {

		if(_threejsUtils) {

			// Remove all models that might be present and load the models you want.

			_threejsUtils.removeAll();
			_threejsUtils.loadOcclusionHead("assets/occlusion_head.json", 1);
			_threejsUtils.loadModel("assets/model.json", 1);
		}
	}

	brfv4.example.setupBRFExample = function(brfManager, resolution) {

		brfManager.init(resolution, resolution);
		loadModels();
	};

	brfv4.example.updateBRFExample = function(brfManager, imageData, draw) {

		brfManager.update(imageData);

		// Hide the 3d model. Only show them on top of tracked faces.

		if(_threejsUtils) _threejsUtils.hideAll();

		draw.clear();

		// In this example BRF is looking for one face only.
		// No need for a loop here.

		var face = brfManager.getFaces()[0];

		if(		face.state == brfv4.BRFState.FACE_TRACKING_START ||
				face.state == brfv4.BRFState.FACE_TRACKING) {

			// Draw the 68 facial feature points as reference.


			draw.drawTrianglesAsPoints(face.vertices, 2.0, false, 0x00a0ff, 0.4);

			// Set the 3D model according to the tracked results.

			if(_threejsUtils) _threejsUtils.update(0, face, true);
		}

		if(_threejsUtils) { _threejsUtils.render(); }
	};

}