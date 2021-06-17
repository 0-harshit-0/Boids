class VectorPhy {
	constructor(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}
	static applyForce(force, m) {
		return Vector2D.div(force, m);
	}
	static repel(from, p) {
		let dir , d, force;
		for (var i = 0; i < from.length; i++) {
			dir = Vector2D.sub(from[i].pos, p.pos);
			d = Vector2D.magnitude(dir);

			d = Vector2D.constrain(d, 5, 100);
			dir = Vector2D.normalize(dir);
			force = -1 *100 / (d**1.8);
			dir = Vector2D.mul(dir, force);
		}

		return VectorPhy.applyForce(dir, p.m);
	}
	static seperation(from, p) {

		let sum = new Vector2D(), steer = new Vector2D();
		let count = 0;

		for (var i = 0; i < from.length; i++) {
			//console.log(from.length)
			if (from[i] == p) continue;

			let d = Vector2D.distance(p.pos, from[i].pos);
			if (d <= from[i].dis+(p.r*2) && d > 0) {
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
var man2 = new Array(), obstacle = new Array();


class Obstacles {
	constructor(x, y) {
		this.pos = new Vector2D(x, y);
		this.dis = 10;
		this.maxForce = 0.71;
	}
	draw() {
		s.circle(this.pos.x, this.pos.y);
		s.fill('red');
	}
	repel(p) {
		let dir, d, force;
		
		dir = Vector2D.sub(this.pos, p.pos);
		d = Vector2D.magnitude(dir);

		d = Vector2D.constrain(d, 5, 100);
		dir = Vector2D.normalize(dir);
		force = -1 * 20 / (d**1.5);
		dir = Vector2D.mul(dir, force);

		return VectorPhy.applyForce(dir, p.m);
	}
	seperation1(p) {

		let sum = new Vector2D(), steer = new Vector2D();
		let count = 0;

		
			//console.log(from.length)
		if (this !== p){
			let d = Vector2D.distance(p.pos, this.pos);
			if (d <= this.dis+(p.r*2) && d > 0) {
				let diff = Vector2D.sub(p.pos, this.pos);
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
		steer = Vector2D.limit(this.maxForce, steer);
		//console.log(from.length);
		return VectorPhy.applyForce(steer, p.m);
	}
}
class Particle {
	constructor(x, y) {
		this.pos = new Vector2D(x, y);
		this.vel = new Vector2D(1, 1);
		this.acc = new Vector2D();
		this.m = 1;
		this.maxSpd = 10;
		this.maxForce = 0.21;

		this.dis = 30;
		this.cdis = 50;
		this.adis = 50;
		this.r = this.m*10;

		this.theta = 0;
	}
	draw(angle) {
		s.eqTri(this.r, this.pos.x, this.pos.y, angle);
		s.stroke('white');
	}
	
	update1() {
		//this.corner();
		this.draw(this.theta);
		this.acc = VectorPhy.seperation(man2, this);
		this.acc = Vector2D.add(this.acc, VectorPhy.align(man2, this));
		this.acc = Vector2D.add(this.acc, VectorPhy.cohesion(man2, this));
		obstacle.forEach(z => {
			this.acc = Vector2D.add(this.acc, z.seperation1(this));
		});

		this.vel = Vector2D.add(this.acc, this.vel);
		this.vel = Vector2D.limit(3, this.vel);
		this.pos = Vector2D.add(this.vel, this.pos);

		this.acc = 0;

		this.theta = Math.atan2(this.vel.y, this.vel.x);
	}
}


(()=>{
	for (var i = 0; i < 100; i++) {
		man2.push(new Particle(Math.random()*200, Math.random()*200));
	}
	
})();
addEventListener('click', (e)=> {
	//console.log(1)
	
	obstacle.push(new Obstacles(e.x, e.y));
});
addEventListener('keypress', (e) => {
	if (e.key == 'a') {
		for (var i = 0; i < 100; i++) {
		man2.push(new Particle(Math.random()*200, Math.random()*200));
	}
	}
});
(function animation() {
	
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	man2.forEach(x=>{
		x.update1();
	});
	obstacle.forEach(z => {
		z.draw();
	});
	requestAnimationFrame(animation);
})();
