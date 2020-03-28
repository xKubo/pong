
function RandDir()
{
	let angle = Math.random(2*Math.PI);
	let res = {};
	res.x = Math.cos(angle);
	res.y = Math.sin(angle);
	return res;
}

function CreateBall(Point)
{
	let BallSize = 5;
	let ball = {
		direction : RandDir(),
		speed : 3,
		location : Point,
		stopped : false,
		draw : function(Canvas)
		{			
			Canvas.SetColor('red');
			Canvas.DrawCircle(this.location, BallSize);			
		},
		update : function(CollisionDetector)
		{
			if (this.stopped)
				return;
			this.speed += 0.0005;
			let nl = Add(this.location, this.speed, this.direction);
			let s = CreateSegment(this.location, nl);
			let colres = CollisionDetector.DetectCollision(s);
			if (colres == null)
				this.location = nl;
			else
				colres.Object.OnBallHit(this, colres.tLine);
		},
		BounceBack : function(Seg)
		{
			let v = SegmentDiff(Seg);
			let UnitNormal = UnitNormalVec(v);
			this.direction = ReflectVec(this.direction, UnitNormal);
		},
		Stop : function()
		{
			this.stopped = true;
		}
	};
	return ball;
}

