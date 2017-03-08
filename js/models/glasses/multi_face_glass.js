function setupExample() {
	"use strict";

	var numFacesToTrack = 2;

	// The BRFv4ThreeJSUtils should already be set up.

	var _threejsUtils = brfv4.example.threejsUtils;

	function loadModels() {

		if(_threejsUtils) {

			// Remove all models that might be present and load the models you want.

			_threejsUtils.removeAll();
			_threejsUtils.loadOcclusionHead("assets/occlusion_head.json", numFacesToTrack);
			_threejsUtils.loadModel("assets/model.json", numFacesToTrack);
		}
	}

	brfv4.example.setupBRFExample = function() {
		loadModels();
	};



	brfv4.example.updateBRFExample = function( imageData) {

		// brfManager.update(imageData);

		// Hide the 3d models. Only show them on top of tracked faces.

		if(_threejsUtils) _threejsUtils.hideAll();

		// draw.clear();

		// In this example BRF will look for more than one face.
		// So we loop through the analysed faces and check their state.

		// var brfFaces = brfManager.getFaces();

		if( typeof obsDrawPoints.face != "undefined") {
			var faces = obsDrawPoints;
			var numFaces = faces.face.length;
			for(var i = 0; i < numFaces; i++) {
				// Draw the 68 facial feature points as reference.

				var  vertices = [];
				var  pointsLen = faces.face[i].facePoint.length;

				for (var j = 0 ; j < pointsLen ;j ++ ){
					var x = faces.face[i].facePoint[j].x;
					var y = faces.face[i].facePoint[j].y;
					vertices.push(x);
					vertices.push(y);

					DrawPoint.setPoint(x,y);
				}
				//绘制三角形点
				// draw.drawTrianglesAsPoints(vertices, 2.0, false, 0x00a0ff, 0.4);

				// Set the 3D model according to the tracked results.
				/*
				 dd('face.scale：' + face.scale + '\n'
				 + 'face.translationX：' + face.translationX + '\n'
				 + 'face.translationY：' + face.translationY + '\n'
				 + 'face.rotationX：' + face.rotationX + '\n'
				 + 'face.rotationY：' + face.rotationY + '\n'
				 + 'face.rotationZ：' + face.rotationZ);
				 */

				var faceObj = {};
				faceObj.scale = 320; //3D模型缩放
				faceObj.translationX = 330;  //x轴坐标
				faceObj.translationY =500;  //y轴坐标
				faceObj.rotationX = 0;  //X轴旋转
				faceObj.rotationY = 0;  //Y轴旋转
				faceObj.rotationZ = 0;  //Z轴旋转

				if (_threejsUtils) _threejsUtils.update(i, faceObj, true);
			}

			if(_threejsUtils) { _threejsUtils.render(); }


		}
	};

}

// setupExample();