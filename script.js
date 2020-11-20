class VectorPhy {
	constructor(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}
	static applyForce(force, m) {
		return Vector2D.div(force, m);
	}
	static seperation(from, p) {
		//'from' is an array.. need to define p.dis in class
		//p.dis is the distance
		let sum = new Vector2D(), steer = new Vector2D();
		let count = 0;

		for (var i = 0; i < from.length; i++) {
			//console.log(from.length)
			if (from[i] == p) continue;

			let d = Vector2D.distance(p.pos, from[i].pos);
			if (d < p.dis+(p.r*2) && d > 0) {
				let diff = Vector2D.sub(p.pos, from[i].pos);
				diff = Vector2D.normalize(diff);

				sum = Vector2D.add(diff, sum);
				count++;
			}
		}
		if (count > 0) {
			//console.log(1)
			let desired = Vector2D.div(sum, count);
			desired = Vector2D.setMag(p.maxSpd, desired);
			steer = Vector2D.sub(desired, p.vel);
			
		}
		steer = Vector2D.limit(p.maxForce, steer);
		//console.log(from.length);
		return VectorPhy.applyForce(steer, p.m);
	}
	static align(from, p) {
		//or attraction
		//from is store array.. need to define p.dis in class
		let sum = new Vector2D(), steer = new Vector2D();
		let count = 0;

		for (var i = 0; i < from.length; i++) {
			//console.log(from.length)
			if (from[i] == p) continue;

			let d = Vector2D.distance(p.pos, from[i].pos);
			if (d < p.adis+p.r && d > 0) {
				sum = Vector2D.add(from[i].vel, sum);
				count++;
			}
		}
		if (count > 0) {
			//console.log(1)
			let desired = Vector2D.div(sum, count);
			desired = Vector2D.setMag(p.maxSpd, desired);
			steer = Vector2D.sub(desired, p.vel);
			
		}
		steer = Vector2D.limit(p.maxForce, steer);
		return VectorPhy.applyForce(steer, p.m);
	}
	static cohesion(from, p) {
		//or attraction
		//from is store array.. need to define p.dis in class
		let sum = new Vector2D(), steer = new Vector2D();
		let count = 0;

		for (var i = 0; i < from.length; i++) {
			//console.log(from.length)
			if (from[i] == p) continue;

			let d = Vector2D.distance(p.pos, from[i].pos);
			if (d < p.cdis+p.r && d > 0) {
				//let diff = Vector2D.sub(from[i].pos, p.pos);
				//diff = Vector2D.normalize(diff);

				sum = Vector2D.add(from[i].pos, sum);
				count++;
			}
		}
		if (count > 0) {
			//console.log(1)
			let desired = Vector2D.div(sum, count);
			desired = Vector2D.setMag(p.maxSpd, desired);
			steer = Vector2D.sub(desired, p.vel);
			
		}
		steer = Vector2D.limit(p.maxForce, steer);
		return VectorPhy.applyForce(steer, p.m);
	}
}




var canvas = document.querySelector('#canvas');
var ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

addEventListener('resize', (e) => {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
});

let s = new Shapes(ctx);
var man2 = new Array();

class Particle {
	constructor(x, y) {
		this.pos = new Vector2D(x, y);
		this.vel = new Vector2D(1, 1);
		this.acc = new Vector2D();
		this.m = 1;
		this.maxSpd = 5;
		this.maxForce = 0.1;

		this.dis = 30;
		this.cdis = 50;
		this.adis = 50;
		this.r = this.m*10;

		this.theta = 0;
	}
	draw(angle) {
		s.eqTri(this.r, this.pos.x, this.pos.y, angle);
		s.stroke();
	}
	corner() {
		if (this.pos.x > canvas.width) {
			this.pos.x = Math.random();
		}if (this.pos.x < 0) {
			this.pos.x = canvas.width;
		}if (this.pos.y > canvas.height) {
			this.pos.y = Math.random();
		}if (this.pos.y < 0) {
			this.pos.y = canvas.height;
		}
	}
	update1() {
		this.corner();
		this.draw(this.theta);

		this.acc = VectorPhy.seperation(man2, this);
		this.acc = Vector2D.add(this.acc, VectorPhy.align(man2, this));
		this.acc = Vector2D.add(this.acc, VectorPhy.cohesion(man2, this));
		this.vel = Vector2D.add(this.acc, this.vel);
		this.vel = Vector2D.limit(2, this.vel);
		this.pos = Vector2D.add(this.vel, this.pos);

		this.theta = Math.atan2(this.vel.y, this.vel.x);
	}
}


(()=>{
	for (var i = 0; i < 100; i++) {
		man2.push(new Particle(Math.random()*200, Math.random()*200));
	}
})();

(function animation() {
	
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	man2.forEach(x=>{
		x.update1();
	});

	requestAnimationFrame(animation);
})();
