var brfv4 = brfv4 || {};

(function(lib) {
	"use strict";

	function BRFv4Stats(numTimesPerFrame) {
		this.stats			= null;
		this.init(numTimesPerFrame);
	}

	BRFv4Stats.prototype.init = function(numTimesPerFrame) {

		this.stats = new Stats();
		this.stats.setMode(0); // 0: fps, 1: ms, 2: mb
		this.stats.setNumTimesPerFrame(numTimesPerFrame);

		var statsParent = document.getElementById("_stats");
		if(!statsParent) { statsParent = document.body; }

		statsParent.appendChild(this.stats.domElement);

		// this.updateLayout(0, 0);
	};

	// BRFv4Stats.prototype.updateLayout = function(x, y) {
	// 	if(this.stats != null) {
	// 		this.stats.domElement.style.position= 'absolute';
	// 		this.stats.domElement.style.left	= x + 'px';
	// 		this.stats.domElement.style.bottom	= y + 'px';
	// 	}
	// };

	BRFv4Stats.prototype.start = function() {
		if(this.stats != null) this.stats.begin();	// Starts the FPS measurement.
	};

	BRFv4Stats.prototype.end = function() {
		if(this.stats != null) this.stats.end();	// Ends the FPS measurement.
	};

	lib.BRFv4Stats = BRFv4Stats;

	/**
	 * Based on MrDoobs https://github.com/mrdoob/stats.js
	 * Changed the MS panel to show the MS average of the last 30 frames.
	 */

	var Stats = function () {
		var now = ( self.performance && self.performance.now ) ? self.performance.now.bind( performance ) : Date.now;
		var startTime = now(), prevTime = startTime;
		var frames = 0, mode = 1;
		var timesCounter = 0;
		var timesLength = 30;
		var times = [];

		function createElement( tag, id, css ) {
			var element = document.createElement( tag );
			element.id = id;
			element.style.cssText = css;
			return element;
		}
		function createPanel( id, fg, bg ) {
			var div = createElement( 'div', id, 'padding:0 0 3px 3px;text-align:left;background:' + bg );
			var text = createElement( 'div', id + 'Text', 'font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px;color:' + fg );
			text.innerHTML = id.toUpperCase();
			div.appendChild( text );

			var graph = createElement( 'div', id + 'Graph', 'width:74px;height:30px;background:' + fg );
			div.appendChild( graph );

			for ( var i = 0; i < 74; i ++ ) {
				graph.appendChild( createElement( 'span', '', 'width:1px;height:30px;float:left;opacity:0.9;background:' + bg ) );
			}
			return div;
		}
		function setMode( value ) {
			var children = container.children;
			for ( var i = 0; i < children.length; i ++ ) {
				children[ i ].style.display = i === value ? 'block' : 'none';
			}
			mode = value;
		}
		function setNumTimesPerFrame(numTimesPerFrame) {
			timesLength = numTimesPerFrame;
		}
		function updateGraph( dom, value ) {
			var child = dom.appendChild( dom.firstChild );
			child.style.height = Math.min( 30, 30 - value * 30 ) + 'px';
		}
		var container = createElement( 'div', 'stats', 'width:80px;opacity:0.9;cursor:pointer' );
		container.addEventListener( 'mousedown', function ( event ) {
			event.preventDefault();
			setMode( ++ mode % container.children.length );

		}, false );

		// FPS
		var fps = 0, fpsMin = Infinity, fpsMax = 0;
		var fpsDiv = createPanel( 'fps', '#00a0ff', '#002' );
		var fpsText = fpsDiv.children[ 0 ];
		var fpsGraph = fpsDiv.children[ 1 ];
		container.appendChild( fpsDiv );

		// MS
		var ms = 0, msMin = Infinity, msMax = 0;
		var msDiv = createPanel( 'ms', '#0f0', '#020' );
		var msText = msDiv.children[ 0 ];
		var msGraph = msDiv.children[ 1 ];
		container.appendChild( msDiv );

		// MEM
		if ( self.performance && self.performance.memory ) {
			var mem = 0, memMin = Infinity, memMax = 0;
			var memDiv = createPanel( 'mb', '#f08', '#201' );
			var memText = memDiv.children[ 0 ];
			var memGraph = memDiv.children[ 1 ];
			container.appendChild( memDiv );
		}

		setMode( mode );

		return {

			REVISION: 14,
			domElement: container,
			setMode: setMode,
			setNumTimesPerFrame: setNumTimesPerFrame,

			begin: function () {
				startTime = now();
			},

			end: function () {
				var time = now();
				var i;

				if(times.length < timesLength) {
					for(i = times.length; i < timesLength; i++) {
						times.push(1);
					}
				}

				ms = time - startTime;

				// update only every 30th frame.
				if(timesCounter < timesLength) {

					times[timesCounter] = ms;

					timesCounter++;

					if(timesCounter >= timesLength) {
						var sumMS = 0;
						for(i = 0; i < timesLength; i++) {
							sumMS += times[i];
						}
						ms = sumMS / timesLength;

						msMin = Math.min( msMin, ms );
						msMax = Math.max( msMax, ms );

						msText.textContent = ( ms | 0 ) + ' MS (' + ( msMin | 0 ) + '-' + ( msMax | 0 ) + ')';
						updateGraph( msGraph, ms / 200 );

						timesCounter = 0;
					}
				}
				frames ++;

				if ( time > prevTime + 1000 ) {
					fps = Math.round( ( frames * 1000 ) / ( time - prevTime ) );
					fpsMin = Math.min( fpsMin, fps );
					fpsMax = Math.max( fpsMax, fps );

					fpsText.textContent = fps + ' FPS (' + fpsMin + '-' + fpsMax + ')';
					updateGraph( fpsGraph, fps / 100 );

					prevTime = time;
					frames = 0;

					if ( mem !== undefined ) {
						var heapSize = performance.memory.usedJSHeapSize;
						var heapSizeLimit = performance.memory.jsHeapSizeLimit;

						mem = Math.round( heapSize * 0.000000954 );
						memMin = Math.min( memMin, mem );
						memMax = Math.max( memMax, mem );

						memText.textContent = mem + ' MB (' + memMin + '-' + memMax + ')';
						updateGraph( memGraph, heapSize / heapSizeLimit );
					}
				}
				return time;
			},

			update: function () {
				startTime = this.end();
			}
		};
	};
	if ( typeof module === 'object' ) {
		module.exports = Stats;
	}

})(brfv4);
