
function ComputeLineCollision(res, li, Segment)
{
	let is = IntersectSegments(li.Segment, Segment);
	if (is)
	{
		let res = {};
		res.Object = li.Object;
		res.tLine = is.t1;
		return res;
	}		
	else
		return res;
}

function CreateCollisionDetector()
{
	let cd = {};
	cd.Lines = [];
	cd.RegisterLine = function(Segment, Object)
	{
		let LineInfo = {
			Segment : Segment,
			Object : Object,
		};
		cd.Lines.push(LineInfo);
	};
	cd.DetectCollision = function(Segment)
	{
		let res = null;		
		this.Lines.forEach( li => res = ComputeLineCollision(res, li, Segment));
		return res;
	};
	return cd;
}
