// globals
const svgNS = 'http://www.w3.org/2000/svg';

const label = document.querySelector('.track-label');

function setAttrs(target, attrs) {
	Object.entries(attrs).forEach(([attr, val]) => {
		target.setAttribute(attr, val);
	});
}

function createSVG(tag) {
	return document.createElementNS(svgNS, tag);
}

class Car {
	constructor(id, pos) {
		const el = createSVG('image');
		this.el = el;
		this.id = id;
		this.velocity = 1;

		setAttrs(el, {
			href: `racer${this.id}.png`,
			width: 1,
			height: 1,
			transform: 'translate(-0.5,-0.5)',
			id: `car-${this.id}`
		});
		// TODO: Allow starting position to face other directions.
		this.setPosition(pos);
	}

	setPosition([x, y]) {
		this.x = x;
		this.y = y;
		this.el.setAttribute('x', x);
		this.el.setAttribute('y', y);
	}

	set velocity(n) {
		if (typeof n !== 'number' || n < 0) n = 0;
		else if (n > 1) n = 1;

		return this._v = n;
	}

	get velocity() {
		return this._v || 0;
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
};
// TODO: add `en|ws|se|nw`.
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
/* This should be a get method on Track, as the
 * positions is relative to the track size.
*/
const startPos = {
	e: [[3,1], [3,2]],
	s: [[2,3], [1,3]],
	// w: [[6,2], [6,1]],
	// n: [[1,6], [2,6]]
};

const preset = {
	oval: 'eeeeeeesssswwwwwwwwnnnne'
};

class Track {
	constructor(el, kind) {
		this.el = el;
		this.startPos = null;
		this.cars = [];
		this.track = [
			createSVG('path'),
			createSVG('path')
		];

		let trackShape = preset[kind];

		if (!preset[kind]) {
			trackShape = kind;
			kind = 'custom';
		}

		const trackBuilt = this.buildTrack(trackShape);
		if (trackBuilt) {
			this.addCar(this.startPos[0]);
			this.addCar(this.startPos[1]);
		}
		this.setKind(kind);
	}

	setKind(kind) {
		this.kind = kind;
		label.innerText = kind;
		return kind;
	}

	buildTrack(codeStr) {
		const startDir = codeStr[0];
		this.startPos = startPos[startDir];

		let width = 3;
		let height = 3;
		let t0d = `M${startPos[startDir][0].join(',')}`;
		let t1d = `M${startPos[startDir][1].join(',')}`;

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

		this.track[0].setAttribute('d', t0d);
		this.track[1].setAttribute('d', t1d);

		this.el.setAttribute('viewBox', `0 0 ${width} ${height}`);
		this.el.appendChild(this.track[0]);
		this.el.appendChild(this.track[1]);

		return true;
	}
	// Adds car to Track and returns car ID
	addCar(pos) {
		const id = this.cars.length;
		const car = new Car(id, pos);

		this.cars.push(car);
		this.el.appendChild(car.el);
	}
}

// DOM Elements
const track = new Track(document.getElementById('track'), 'oval');
