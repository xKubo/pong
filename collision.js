
function ComputeLineCollision(res, si, Segment)
{
	let is = IntersectSegments(si.Segment, Segment);
	if (is)
	{
		let res = {};
		res.Object = si.Object;
		res.tLine = is.t1;
		return res;
	}		
	else
		return res;
}

function CreateCollisionDetector()
{
	let cd = {};
	cd.Segments = [];
	cd.RegisterSegment = function(Segment, Object)
	{
		let SegmentInfo = {
			Segment : Segment,
			Object : Object,
		};
		cd.Segments.push(SegmentInfo);
	};
	cd.DetectCollision = function(Segment)
	{
		let res = null;		
		this.Segments.forEach( si => res = ComputeLineCollision(res, si, Segment));
		return res;
	};
	return cd;
}
