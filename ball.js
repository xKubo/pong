
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
	res.DetectCollision = function(BallPosition)
	{
		return {
			
		};
	};
	return res;
}

let BallSize = 5;

function CreateBall(Point)
{
	return {
		direction : { x : 1, y : 0 },
		speed : 1,
		location : Point,
		draw : function(Canvas)
		{
			Canvas.DrawCircle(location, 5);			
		},
	};
}

