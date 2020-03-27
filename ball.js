
function CollisionDetector()
{
	let res = {};
	res.Lines = [];
	res.RegisterLine = function(Segment, Callback, Object)
	{
		let LineInfo = {
			Segment : Segment,
			Callback : Callback,
			Object : Object,
		};
		res.Lines.push(LineInfo);
	};
	res.DetectCollision = function(Segment)
	{
		let res = {};
		//Lines.forEach( li => 
		return res;
	};
	return res;
}

let BallSize = 5;

function RandDir()
{
	let angle = Math.random(2*Math.PI);
	let res = {};
	res.x = Math.cos(angle);
	res.y = Math.sin(angle);
	return res;
}

function Add(Pt, Speed, Direction)
{
	return {
		x : Pt.x + Speed*Direction.x,
		y : Pt.y + Speed*Direction.y,
	};
}

function CreateBall(Point)
{
	let ball = {
		direction : { x : 1, y : 0 },
		speed : 1,
		location : Point,
		draw : function(Canvas)
		{			
			Canvas.DrawCircle(location, 5);			
		},
		update : function(CollisionDetector)
		{
			let nl = Add(location, speed, direction);
			let s = CreatePosition(location, nl);
			let colres = CollisionDetector.DetectCollision(s);
			if (colres == null)
				location = nl;
			else
				colres.Object.OnBallHit(this);
		},
		BounceBack : function(Seg)
		{
			let UnitNormal = UnitNormalVec(Seg);
			this.direction = ReflectVec(direction, UnitNormal);
		},
	};
	return ball;
}

