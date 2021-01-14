// globals
svgNS = 'http://www.w3.org/2000/svg';

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
		[ovalRad, 0]
	]
}

const carSize = {
	oval: [20, 20]
}

function setAttrs(target, attrs) {
	Object.entries(attrs).forEach(([attr, val]) => {
		target.setAttribute(attr, val);
	});
}

function createSVG(tag) {
	return document.createElementNS(svgNS, tag);
}

class Car {
	constructor(track, demo) {
		if (!track || track.constructor.name !== 'Track')
			throw new Error('Must initialize Car with a valid Track');

		const el = createSVG('image');
		this.el = el;

		track.addCar(this);
		this.track = track;

		const halfsize = carSize[track.kind][1]/2;

		setAttrs(el, {
			href: `racer${this.id}.png`,
			width: carSize[track.kind][0],
			height: carSize[track.kind][1],
			transform: `translate(-${halfsize},-${halfsize})`,
			id: `car-${this.id}`
		})
		
		this.setStart(this.track.kind, this.id);
	}

	setPosition(x, y) {
		this.x = x;
		this.y = y;
		this.el.setAttribute('x', x);
		this.el.setAttribute('y', y);
	}

	setStart(kind, id) {
		this.setPosition(...trackStartPos[kind][id]);
	}

	demo() {
		const anim = createSVG('animateMotion');
		setAttrs(anim, {
			'xlink:href': `#car-${this.id}`,
			dur: '10s',
			begin: '0s',
			fill: 'freeze',
			repeatCount: 'indefinite'
		});
		const mpath = createSVG('mpath');
		setAttrs(mpath, {
			'xlink:href': '#track-0'
		});
		anim.appendChild(mpath);

		setAttrs(this.el, {x: 0, y: 0});

		this.track.el.appendChild(anim);
		const demoTrack = this.track.el.outerHTML;
		const parent = this.track.el.parentElement;
		parent.removeChild(track.el);
		parent.innerHTML += demoTrack;
	}

	set id(i) {
		if (this._id === undefined) this._id = i;
		return this._id;
	}

	get id() {
		return this._id;
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
		car.id = id;
		this.cars.push(car);
		this.el.appendChild(car.el);
	}
}

// DOM Elements
const track = new Track(document.getElementById('track'), 'oval');
const car0 = new Car(track);

document.getElementById('demo').addEventListener('click', ev => {
	ev.target.disabled = true;
	car0.demo();
})
