// globals
const svgNS = 'http://www.w3.org/2000/svg';

const label = document.querySelector('.track-label');

const trackStartPos = {
	oval: [
		[ovalRad, 0]
	]
};

const carSize = {
	oval: [20, 20]
};

function setAttrs(target, attrs) {
	Object.entries(attrs).forEach(([attr, val]) => {
		target.setAttribute(attr, val);
	});
}

function createSVG(tag) {
	return document.createElementNS(svgNS, tag);
}

class Car {
	constructor(track) {
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
		});
		
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
		parent.removeChild(this.track.el);
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

const segType = {
	ee: ['l3,0', 'l3,0'],
	ww: ['l-3,0', 'l-3,0'],
	ss: ['l0,3', 'l0,3'],
	nn: ['l0,-3', 'l0,-3'],
	es: [
		'c2,0 2,2 2,2',
		'c1,0 1,1 1,1'
	],
	sw: [
		'c0,2 -2,2 -2,2',
		'c0,1 -1,1 -1,1'
	],
	wn: [
		'c-2,0 -2,-2 -2,-2',
		'c-1,0 -1,-1 -1,-1'
	],
	ne: [
		'c0,-2 2,-2 2,-2',
		'c0,-1 1,-1 1,-1'
	],
	cross: null
};
// This is incorrect, only east and south work
const startPos = {
	e: ['3,1', '3,2'],
	s: ['2,3', '1,3'],
	w: ['6,2', '6,1'],
	n: ['1,6', '2,6']
};

const preset = {
	oval: 'eeeeeeesssswwwwwwwwnnnne'
};

class Track {
	constructor(el, kind) {
		this.el = el;
		this.track0 = createSVG('path');
		this.track1 = createSVG('path');

		this.buildTrack(preset[kind]);
		// this.cars = [];
	}

	setKind(kind) {
		this.kind = kind;
		label.innerText = kind;
	}

	buildTrack(codeStr) {
		const startDir = codeStr[0];
		let width = 3;
		let height = 3;
		let t0d = `M${startPos[startDir][0]}`;
		let t1d = `M${startPos[startDir][1]}`;

		const segments = codeStr.match(/[news]{2}/g);
		segments.forEach(s => {
			// This is incorrect, I have to use the order of e/w, n/s
			switch (s[1]) {
				case 'e': width += 3; break;
				case 's': height += 3; break;
			}
			t0d += segType[s][0];
			t1d += segType[s][1];
		});

		this.track0.setAttribute('d', t0d);
		this.track1.setAttribute('d', t1d);

		this.el.setAttribute('viewBox', `0 0 ${width} ${height}`);
		this.el.appendChild(this.track0);
		this.el.appendChild(this.track1);
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
// const car0 = new Car(track);
