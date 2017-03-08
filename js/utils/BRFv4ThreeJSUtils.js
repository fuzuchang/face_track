var brfv4 = brfv4 || {};

(function() {

	function BRFv4ThreeJSUtils(threejsStage) {

		this.stage			= threejsStage;
		this.scene			= new THREE.Scene();

		this.camera			= new THREE.OrthographicCamera(
			this.stage.width  / -2, this.stage.width  / 2,
			this.stage.height /  2, this.stage.height / -2,  50, 10000 );

		this.renderer		= new THREE.CanvasRenderer(
			{alpha: true, canvas: this.stage, antialias: false});

		this.pointLight		= new THREE.PointLight(0xffffff, 0.75, 10000);
		this.baseNodes		= [];
		this.modelZ			= 4000;

		this.renderer.setClearColor(0x000000, 0); // the default
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(this.stage.width, this.stage.height, true);

		this.scene.add(new THREE.AmbientLight(0xffffff, 0.65));
		this.scene.add(this.pointLight);

		this.occlusionObjects = [];
		this.renderWidth = this.stage.width;
		this.renderHeight = this.stage.height;
	}

	BRFv4ThreeJSUtils.prototype.updateLayout = function(width, height) {

		this.renderWidth = width;
		this.renderHeight = height;

		this.renderer.setSize(width, height, true);

		this.camera.left	= width  / -2;
		this.camera.right	= width  /  2;
		this.camera.top		= height /  2;
		this.camera.bottom	= height / -2;

		this.camera.position.set(0, 0, 0);
		this.camera.lookAt(new THREE.Vector3(0, 0, 1));
		this.camera.updateProjectionMatrix();
	};

	BRFv4ThreeJSUtils.prototype.update = function(index, face, show) {

		if(index >= this.baseNodes.length) {
			return;
		}

		var baseNode = this.baseNodes[index];
		if(!baseNode) return;

		if (show) {

			var s =  (face.scale / 180);
			var x = -(face.translationX - (this.renderWidth  * 0.5));
			var y = -(face.translationY - (this.renderHeight * 0.5));
			var z =  this.modelZ;

			var rx = THREE.Math.radToDeg(-face.rotationX);
			var ry = THREE.Math.radToDeg(-face.rotationY);
			var rz = THREE.Math.radToDeg( face.rotationZ);

			var rya = ry < 0 ? -ry : ry;
			ry = ry * 0.90;

			baseNode.visible = true;
			baseNode.position.set(x, y, z);
			baseNode.scale.set(s, s, s);
			baseNode.rotation.set(
				THREE.Math.degToRad(rx),
				THREE.Math.degToRad(ry),
				THREE.Math.degToRad(rz)
			);
		} else {
			baseNode.visible = false;				// Hide the 3d object, if no face was tracked.
		}
	};

	BRFv4ThreeJSUtils.prototype.render = function() {
		this.renderer.render(this.scene, this.camera);	// Render the threejs scene.
	};

	BRFv4ThreeJSUtils.prototype.addBaseNodes = function(maxFaces) {

		var containers = this.baseNodes;
		var i;
		var group;

		for(i = containers.length; i < maxFaces; i++) {
			group = new THREE.Group();
			group.visible = false;
			containers.push(group);
			this.scene.add(group);
		}

		for(i = containers.length - 1; i > maxFaces; i--) {
			group = containers[k];
			this.scene.remove(group);
		}
	};

	BRFv4ThreeJSUtils.prototype.loadOcclusionHead = function(url, maxFaces) {

		var _this = this;

		_this.addBaseNodes(maxFaces);

		var containers = this.baseNodes;
		var loader = new THREE.ObjectLoader();

		loader.load(url, (function(model) {
			_this.model = model;

			for(var k = 0; k < containers.length; k++) {
				var mesh = model.clone();
				mesh.position.set(model.position.x, model.position.y, model.position.z);
				mesh.material.colorWrite = false;
				mesh.renderOrder = 0;
				_this.occlusionObjects.push(mesh);
				containers[k].add(mesh);
			}

			_this.render();

		}).bind(this));
	};

	BRFv4ThreeJSUtils.prototype.loadModel = function(url, maxFaces) {

		var _this = this;

		_this.addBaseNodes(maxFaces);

		var containers = this.baseNodes;
		var loader = new THREE.ObjectLoader();

		loader.load(url, (function(model) {
			_this.model = model;

			for(var k = 0; k < containers.length; k++) {
				var mesh = model.clone();
				mesh.position.set(model.position.x, model.position.y, model.position.z);
				mesh.renderOrder = 2;
				containers[k].add(mesh);
			}

			_this.render();

		}).bind(this));
	};

	BRFv4ThreeJSUtils.prototype.showOcclusionObjects = function(showThem) {

		for(var k = 0; k < this.occlusionObjects.length; k++) {
			var mesh = this.occlusionObjects[k];
			mesh.material.colorWrite = showThem;
		}
	};

	BRFv4ThreeJSUtils.prototype.hideAll = function() {
		for(var k = 0; k < this.baseNodes.length; k++) {
			var baseNode = this.baseNodes[k];
			baseNode.visible = false;
		}
		this.render();
	};

	BRFv4ThreeJSUtils.prototype.removeAll = function() {
		for(var k = 0; k < this.baseNodes.length; k++) {
			var baseNode = this.baseNodes[k];
			for(var j = baseNode.children.length - 1; j >= 0; j--) {
				baseNode.remove(baseNode.children[j]);
			}
		}
		this.render();
	};

	brfv4.BRFv4ThreeJSUtils = BRFv4ThreeJSUtils;

})();