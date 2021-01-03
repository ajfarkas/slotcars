// configs
const trackMargin = 20;
const trackW = 500;
const trackH = 300;
const ovalRad = 150;
const ovalF = 0.2;

// calculated
const ovalNeg = -1 * ovalRad;
const ovalRad2 = 2 * ovalRad;

let trackType = null;

// check for mistakes in config
if (ovalRad > (trackW/2) || ovalRad > (trackH/2)) {
	console.log(trackW/2 - ovalRad, trackH/2 - ovalRad)
	throw new Error('Track size error, radius must be ≤ shortest length.')
}

const label = document.querySelector('.track-label');

const trackStartPos = {
	oval: [
		[`${trackMargin+ovalRad+ovalRad*ovalF}px`, `${trackMargin}px`]
	]
}

class Car {
	constructor(el, x, y) {
		this.el = el;
		if (x && y) this.setPosition(x, y);
	}

	setPosition(x, y) {
		this.x = x;
		this.y = y;
		this.el.style.left = x;
		this.el.style.top = y;
	}

	setStart(kind, id) {
		this.setPosition(...trackStartPos[kind][id]);
	}

	set id(i) {
		if (this.id !== undefined) this.id = i;
		return this.id;
	}
};

const tracks = {
	oval: `M${ovalRad},0`
		+ `l${trackW - (ovalRad2)},0`
		+ `c${ovalRad*ovalF},0 ${ovalRad},0 ${ovalRad},${ovalRad}`
		+ `l0,${trackH - ovalRad2}`
		+ `c0,${ovalRad} ${ovalNeg*(1-ovalF)},${ovalRad} ${ovalNeg},${ovalRad}`
		+ `l${-1*trackW + (ovalRad2)},0`
		+ `c${ovalNeg*ovalF},0 ${ovalNeg},0 ${ovalNeg},${ovalNeg}`
		+ `l0,${-1*trackH + ovalRad2}`
		+ `c0,${ovalNeg} ${ovalRad*(1-ovalF)},${ovalNeg} ${ovalRad},${ovalNeg}`
};

class Track {
	constructor(el, kind) {
		this.el = el;
		this.cars = [];
		this.setKind(kind);

		this.el.setAttribute('viewBox', `-${trackMargin} -${trackMargin} ${trackW + (trackMargin*2)} ${trackH + (trackMargin*2)}`);
	}

	setKind(kind) {
		this.kind = kind;
		label.innerText = trackType;
		this.el.querySelector('path').setAttribute('d', tracks[kind]);
	}
	// Adds car to Track and returns car ID
	addCar(car) {
		const id = this.cars.length;
		this.cars.push(car);
		car.setStart(this.kind, id);
		return id;
	}
}

// DOM Elements
const car0 = new Car(document.querySelector('.car-0'));
const track = new Track(document.getElementById('track'), 'oval');
car0.id = track.addCar(car0);

