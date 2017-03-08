var brfv4 = brfv4 || {};

(function(lib) {
	"use strict";

	function BRFv4DrawingUtils(drawing, faceTextures, fps) {

		// We use CreateJS to easily draw the face tracking results.

		this.stage				= new createjs.Stage(drawing);
		this.faceTextures		= faceTextures;

		this.container			= new createjs.Container();
		this.clickArea			= new createjs.Shape();
		this.drawSprite			= new createjs.Shape();
        this.imageContainer		= new createjs.Container();
		this.draw				= this.drawSprite.graphics;
		this.onUpdateCallback 	= null;

		this.container.addChild(this.drawSprite);
		this.container.addChild(this.imageContainer);
		this.container.addChild(this.clickArea);
		this.stage.addChild(this.container);

		// Usually webcams deliver 30 FPS.
		// Or 15 FPS, when it is too dark.
		// So a stage FPS of 30 is just fine.

		fps = lib.defaultValue(fps, 30);

		createjs.Ticker.setFPS(fps);
		createjs.Ticker.addEventListener("tick", this.stage);
	}

	BRFv4DrawingUtils.prototype.updateLayout = function(width, height) {
		this.clickArea.graphics.clear();
		this.clickArea.graphics.beginFill("#ffffff");
		this.clickArea.graphics.drawRect(0, 0, width, height);
		this.clickArea.graphics.endFill();
		this.clickArea.alpha = 0.01; // will not be rendered if lower than 0.01
		this.clickArea.cursor = 'pointer';
	};

	BRFv4DrawingUtils.prototype.setUpdateCallback = function(updateCallback) {

		// Once BRF and Camera are ready we need to setup an onEnterFrame event.
		// The Ticker helps to get 30 FPS.

		if(this.onUpdateCallback != null) {
			this.stage.removeEventListener("tick", this.onUpdateCallback);
			this.onUpdateCallback = null;
		}

		if(updateCallback != null) {
			this.onUpdateCallback = updateCallback;
			this.stage.addEventListener("tick", this.onUpdateCallback);
		}
	};

	// The functions following below are drawing helpers
	// to draw points, rectangles, triangles, textures etc.

	BRFv4DrawingUtils.prototype.clear = function() {
		this.draw.clear();

		if(this.faceTextures) {
			var ctx = this.faceTextures.getContext("2d");
			ctx.clearRect(0, 0, this.faceTextures.width, this.faceTextures.height);
		}
	};

	BRFv4DrawingUtils.prototype.getColor = function(color, alpha) {
		return createjs.Graphics.getRGB((color >> 16) & 0xff, (color >> 8) & 0xff, (color) & 0xff, alpha);
	};

	BRFv4DrawingUtils.prototype.drawTriangles = function(vertices, triangles, clear, lineThickness, lineColor, lineAlpha, fillColor, fillAlpha) {
		clear			= lib.defaultValue(clear, false);
		lineThickness	= lib.defaultValue(lineThickness, 0.5);
		lineColor		= lib.defaultValue(lineColor, 0x00f6ff);
		lineAlpha		= lib.defaultValue(lineAlpha, 0.85);
		fillColor		= lib.defaultValue(fillColor, 0);
		fillAlpha		= lib.defaultValue(fillAlpha, 0);

		lineColor = this.getColor(lineColor, lineAlpha);

		if(!(fillColor == 0 && fillAlpha == 0)) {
			fillColor = this.getColor(fillColor, fillAlpha);
		}

		var g = this.draw;

		clear && g.clear();

		var i = 0;
		var l = triangles.length;

		while(i < l) {
			var ti0 = triangles[i];
			var ti1 = triangles[i + 1];
			var ti2 = triangles[i + 2];

			var x0 = vertices[ti0 * 2];
			var y0 = vertices[ti0 * 2 + 1];
			var x1 = vertices[ti1 * 2];
			var y1 = vertices[ti1 * 2 + 1];
			var x2 = vertices[ti2 * 2];
			var y2 = vertices[ti2 * 2 + 1];

			g.setStrokeStyle(lineThickness);
			g.beginStroke(lineColor);
			if(fillColor) g.beginFill(fillColor);

			g.moveTo(x0, y0);
			g.lineTo(x1, y1);
			g.lineTo(x2, y2);
			g.lineTo(x0, y0);

			if(fillColor) g.endFill();
			g.endStroke();

			i+=3;
		}
	};

	BRFv4DrawingUtils.prototype.drawTrianglesTexture = function(vertices, triangles, uvData, texture) {

		// Ported from: http://stackoverflow.com/questions/4774172/image-manipulation-and-texture-mapping-using-html5-canvas

		var canvas = document.getElementById("_faceSub");

		if(canvas) {
			var ctx = canvas.getContext("2d");

			var i = 0;
			var l = triangles.length;

			for(; i < l; i += 3) {

				var i0 = triangles[i];
				var i1 = triangles[i + 1];
				var i2 = triangles[i + 2];

				var x0 = vertices[i0 * 2];
				var y0 = vertices[i0 * 2 + 1];
				var x1 = vertices[i1 * 2];
				var y1 = vertices[i1 * 2 + 1];
				var x2 = vertices[i2 * 2];
				var y2 = vertices[i2 * 2 + 1];

				var u0 = uvData[i0 * 2] * texture.width;
				var v0 = uvData[i0 * 2 + 1] * texture.height;
				var u1 = uvData[i1 * 2] * texture.width;
				var v1 = uvData[i1 * 2 + 1] * texture.height;
				var u2 = uvData[i2 * 2] * texture.width;
				var v2 = uvData[i2 * 2 + 1] * texture.height;

				// Set clipping area so that only pixels inside the triangle will
				// be affected by the image drawing operation
				ctx.save(); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
				ctx.lineTo(x2, y2); ctx.closePath(); ctx.clip();

				// Compute matrix transform
				var delta   = u0*v1 + v0*u2 + u1*v2 - v1*u2 - v0*u1 - u0*v2;
				var delta_a = x0*v1 + v0*x2 + x1*v2 - v1*x2 - v0*x1 - x0*v2;
				var delta_b = u0*x1 + x0*u2 + u1*x2 - x1*u2 - x0*u1 - u0*x2;
				var delta_c = u0*v1*x2 + v0*x1*u2 + x0*u1*v2 - x0*v1*u2 - v0*u1*x2 - u0*x1*v2;
				var delta_d = y0*v1 + v0*y2 + y1*v2 - v1*y2 - v0*y1 - y0*v2;
				var delta_e = u0*y1 + y0*u2 + u1*y2 - y1*u2 - y0*u1 - u0*y2;
				var delta_f = u0*v1*y2 + v0*y1*u2 + y0*u1*v2 - y0*v1*u2 - v0*u1*y2 - u0*y1*v2;

				// Draw the transformed image
				ctx.setTransform(
					delta_a/delta, delta_d/delta,
					delta_b/delta, delta_e/delta,
					delta_c/delta, delta_f/delta);

				ctx.drawImage(texture, 0, 0);
				ctx.restore();
			}
		}
	};

	BRFv4DrawingUtils.prototype.drawTrianglesAsPoints = function(vertices, radius, clear, fillColor, fillAlpha) {
		clear			= lib.defaultValue(clear, false);
		radius			= lib.defaultValue(radius, 2.0);
		fillColor		= lib.defaultValue(fillColor, 0x00f6ff);
		fillAlpha		= lib.defaultValue(fillAlpha, 1.00);

		fillColor = this.getColor(fillColor, fillAlpha);

		var g = this.draw;

		clear && g.clear();

		var i = 0;
		var l = vertices.length;

		for(; i < l;) {
			var x = vertices[i++];
			var y = vertices[i++];
			g.beginFill(fillColor);
			g.drawCircle(x, y, radius);
			g.endFill();
		}
	};

	BRFv4DrawingUtils.prototype.drawRect = function(rect, clear, lineThickness, lineColor, lineAlpha) {
		clear			= lib.defaultValue(clear, false);
		lineThickness	= lib.defaultValue(lineThickness, 1.0);
		lineColor		= lib.defaultValue(lineColor, 0x00f6ff);
		lineAlpha		= lib.defaultValue(lineAlpha, 1.0);

		lineColor = this.getColor(lineColor, lineAlpha);

		var g = this.draw;

		clear && g.clear();

		g.setStrokeStyle(lineThickness);
		g.beginStroke(lineColor);
		g.drawRect(rect.x, rect.y, rect.width, rect.height);
		g.endStroke();
	};

	BRFv4DrawingUtils.prototype.drawRects = function(rects, clear, lineThickness, lineColor, lineAlpha) {
		clear 			= lib.defaultValue(clear, false);
		lineThickness 	= lib.defaultValue(lineThickness, 1.0); // "#00f6ff"
		lineColor 		= lib.defaultValue(lineColor, 0x00f6ff); // "#00f6ff"
		lineAlpha 		= lib.defaultValue(lineAlpha, 1.0);

		lineColor = this.getColor(lineColor, lineAlpha);

		var g = this.draw;

		clear && g.clear();

		g.setStrokeStyle(lineThickness);
		g.beginStroke(lineColor);

		var i = 0;
		var l = rects.length;
		var rect;

		for(; i < l; i++) {
			rect = rects[i];
			g.drawRect(rect.x, rect.y, rect.width, rect.height);
		}

		g.endStroke();
	};

	BRFv4DrawingUtils.prototype.drawPoint = function(point, radius, clear, fillColor, fillAlpha) {
		clear 			= lib.defaultValue(clear, false);
		fillColor 		= lib.defaultValue(fillColor, 0x00f6ff); // "#00f6ff"
		fillAlpha 		= lib.defaultValue(fillAlpha, 1.0);

		fillColor = this.getColor(fillColor, fillAlpha);

		var g = this.draw;

		clear && g.clear();

		g.beginFill(fillColor);
		g.drawCircle(point.x, point.y, radius);
		g.endFill();
	};

	BRFv4DrawingUtils.prototype.drawPoints = function(points, radius, clear, fillColor, fillAlpha) {
		clear 			= lib.defaultValue(clear, false);
		fillColor 		= lib.defaultValue(fillColor, 0x00f6ff); // "#00f6ff"
		fillAlpha 		= lib.defaultValue(fillAlpha, 1.0);

		fillColor = this.getColor(fillColor, fillAlpha);

		var g = this.draw;

		clear && g.clear();

		g.beginFill(fillColor);

		var i = 0;
		var l = points.length;
		var point;

		for(; i < l; i++) {
			point = points[i];
			g.drawCircle(point.x, point.y, radius);
		}

		g.endFill();
	};

	lib.BRFv4DrawingUtils = BRFv4DrawingUtils;

})(brfv4);
