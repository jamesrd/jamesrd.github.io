var c = document.getElementById("myCanvas");
var throttled = false;
var timeout = false;
var delay = 500;

window.addEventListener('resize', function() {
	clearTimeout(timeout);

	timeout = setTimeout(doDraw, delay);
});

function doDraw() {
	// only run if we're not throttled
	if (!throttled) {
		// actual callback action
		setupCanvas();
		drawFern();
		// we're throttled!
		throttled = true;
		// set a timeout to un-throttle
		setTimeout(function() {
			throttled = false;
		}, delay);
	}
}

function setupCanvas() {
	c.width = c.offsetWidth;
	c.height = c.offsetHeight;
}

function drawLine() {
	var ctx = c.getContext("2d");
	ctx.moveTo(0, 0);
	ctx.lineTo(c.width, c.height);
	ctx.stroke();
}

function drawFern() {
	var ps = .015;
	var scaling = -12;
	var ctx = c.getContext("2d");

	ctx.scale(c.width / (scaling + 2.5), c.width / scaling);
	ctx.translate(scaling * 0.35, scaling * 0.85);

	ctx.rotate(0.6);
	// algorithm from Wikipedia
	// https://en.wikipedia.org/wiki/Barnsley_fern
	var x = 0;
	var y = 0;
	var n = 0;
	while (n < 1000) {
		sleep(1).then(() => {
			var n2 = 0;
			while (n2 < 70) {
				var xn = 0;
				var yn = 0;
				var fill = "darkgreen";

				let cseed = getRandomInt(10);
				if (cseed > 8) {
					fill = "green";
				} else if (cseed > 7) {
					fill = "#088F8F";
				}

				var r = Math.random();
				if (r < 0.01) {
					xn = 0.0;
					yn = 0.16 * y;
				} else if (r < 0.86) {
					xn = 0.85 * x + 0.04 * y;
					yn = -0.04 * x + 0.85 * y + 1.6;
				} else if (r < 0.93) {
					xn = 0.2 * x - 0.26 * y;
					yn = 0.23 * x + 0.22 * y + 1.6;
				} else {
					xn = -0.15 * x + 0.28 * y;
					yn = 0.26 * x + 0.24 * y + 0.44;
				}
				ctx.fillStyle = fill;
				ctx.fillRect(xn, yn, ps, ps);
				x = xn;
				y = yn;
				n2++;
			}
		});
		n++;

	}
}

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
