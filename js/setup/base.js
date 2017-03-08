// Basic stuff to work with the DOM elements (canvas, video, divs etc.)
// Also initialization of utility classes and brf update flow.

brfv4.example = brfv4.example || {};
brfv4.example.setupWebcamExample = null;
brfv4.example.setupImageExample = null;

/**
 * 获得元素HtmlElementObject
 * @param elementId
 * @returns {*}
 */
brfv4.example.getElement = function(elementId) {
	var element = brfv4.example[elementId];
	if(!element) {
		element = document.getElementById(elementId);
	}
	return element;
};
/**
 * 更新元素宽高
 * @param element
 * @param width
 * @param height
 * @param whatToUpdate
 */
brfv4.example.updateElementSize = function(element, width, height, whatToUpdate) {
	if(element) {
		if(whatToUpdate === 0) {
			element.style.width		= width  + "px";
			element.style.height	= height + "px";
		} else if(whatToUpdate === 1) {
			element.width			= width;
			element.height			= height;
		} else if(whatToUpdate === 2) {
			element.updateLayout(width, height);
		}
	}
};

/**
 * 更新布局宽高
 * @param width
 * @param height
 */
brfv4.example.updateLayout = function(width, height) {

	// update resolution, video size, canvas sizes etc.

	var getElement			= brfv4.example.getElement;
	var updateElementSize	= brfv4.example.updateElementSize;

	// updateElementSize(getElement("_content"), 		width, height, 0);
	updateElementSize(getElement("_drawing"), 		width, height, 1);
	updateElementSize(getElement("_faceSub"), 		width, height, 1);
	updateElementSize(getElement("_threejs"), 		width, height, 1);
	updateElementSize(getElement("_webcam"),		width, height, 1);
	updateElementSize(getElement("_imageData"),		width, height, 1);

	updateElementSize(getElement("resolution"), 	width, height, 1);
	updateElementSize(getElement("drawingUtils"),	width, height, 2);
	updateElementSize(getElement("threejsUtils"),	width, height, 2);
	updateElementSize(getElement("myCanvas"),	width, height,1);


};


/**
 * 初始化容器
 */
brfv4.example.initElements = function() {

	var getElement		= brfv4.example.getElement;

	var drawing 		= getElement("_drawing");
	var drawingUtils	= getElement("drawingUtils");

	if(drawing && brfv4.BRFv4DrawingUtils && !drawingUtils) {
		brfv4.example.drawingUtils = new brfv4.BRFv4DrawingUtils(drawing, getElement("_faceSub"), 30);
	}

	var sdkUtils		= getElement("sdkUtils");

	if(brfv4.BRFv4SDKUtils && !sdkUtils) {
		brfv4.example.sdkUtils = new brfv4.BRFv4SDKUtils();
	}

	var threejsCanvas	= getElement("_threejs");
	var threejsUtils	= getElement("threejsUtils");

	if(threejsCanvas && brfv4.BRFv4ThreeJSUtils && !threejsUtils) {
		brfv4.example.threejsUtils = new brfv4.BRFv4ThreeJSUtils(threejsCanvas);
	}

	if(brfv4.Rectangle) {
		brfv4.example.resolution = new brfv4.Rectangle(0, 0, window.innerWidth, window.innerHeight);
	}
};

brfv4.example.onBRFReady = function() {



	var getElement		= brfv4.example.getElement;
	var drawingUtils	= getElement("drawingUtils");


	drawingUtils.clickArea.mouseEnabled = false;
	drawingUtils.imageContainer.removeAllChildren();

	var threejsUtils = getElement("threejsUtils");
	if(threejsUtils) { threejsUtils.hideAll(); }

	if(brfv4.example.setupBRFExample) { brfv4.example.setupBRFExample(); }

	if(brfv4.example.onBRFUpdate) {
		if(brfv4.example.isImageDataStream()) {
			drawingUtils.setUpdateCallback(brfv4.example.onBRFUpdate)
		} else {
			for(var i = 0; i < 10; i++) {
				brfv4.example.onBRFUpdate();
			}
		}
	}
};

/**
 * 实时更新图像特征
 */
brfv4.example.onBRFUpdate = function() {

	var getElement		= brfv4.example.getElement;
	var imageData		= getElement("_imageData");
	var resolution		= getElement("resolution");

	if(brfv4.example.updateBRFExample) {
		// brfv4.example.updateImageData(); // depends on whether it is a webcam or image setup
		brfv4.example.updateBRFExample(	 // depends on the chosen example
			imageData.getContext("2d").getImageData(0, 0, resolution.width, resolution.height).data
		);
	}
};

brfv4.example.reset = function() {

	var getElement		= brfv4.example.getElement;
	var resolution		= getElement("resolution");

	if(resolution) {
		resolution.setTo(0, 0, window.innerWidth, window.innerHeight);
	}

};

/**
 * 重新初始化
 */
brfv4.example.reinit = function() {

	brfv4.example.onImageDataReady(window.innerWidth, window.innerHeight);
};

/**
 * 图像数据准备就绪
 * @param width
 * @param height
 */
brfv4.example.onImageDataReady = function(width, height) {

	brfv4.example.updateLayout(width, height);

	brfv4.example.onBRFReady();
};



