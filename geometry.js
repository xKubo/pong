
function LinInt(pt1, pt2, t)
{
	return {
		x : pt1.x + t*(pt2.x - pt1.x),
		y : pt1.y + t*(pt2.y - pt1.y),
	};
}

function LinInt_S(S1, S2, t)
{
		return {
				p1 : LinInt(S1.p1, S2.p1, t),
				p2 : LinInt(S1.p2, S2.p2, t),
		};
}

function Len(d)
{
	return Math.sqrt(d.x*d.x + d.y*d.y);
}

function Norm(d)
{
	let l = Len(d);
	
	return {
		x : d.x/l,
		y : d.y/l,
	};
}

function CreatePoint(x, y)
{
	return {
		x : x,
		y : y,
	};
}

function CreateSegment(p1, p2)
{
	return {
		p1 : p1,
		p2 : p2,
	};
}

function CreateSegment_Coords(p1x, p1y, p2x, p2y)
{
	return {
		p1 : CreatePoint(p1x, p1y),
		p2 : CreatePoint(p2x, p2y),
	};
}

function PointDiff(p1, p2)
{
	return {
		x : p2.x - p1.x,
		y : p2.y - p1.y,
	};
}

function SegmentDiff(p)
{
	return PointDiff(p.p2, p.p1);
}

function SegmentLen(p)
{
	return Len(SegmentDiff(p));
}

function Neg(Point)
{
	return {
		x: -Point.x,
		y: -Point.y,
	};
}

function FloatEq(n1, n2)
{
	return Math.abs(n1 - n2) < 1e-5;
}

function NormalVec(v)
{
	return {
		x : v.y,
		y : -v.x,
	};
}

function IntersectLine(S1, S2)
{
	
	/*
	
	
X1 = (x1, y1)
n1 = (a1, b1)

X2 = (x2, y2)
n2 = (a2, b2)

=======================

a1x + b1y = d1
a2x + b2y = d2

d1 = a1x1 + b1y1
d2 = a2x2 + b2y2

=======================

Px = (b2d1 - b1d2)/(a1b2 - a2b1)
Py = (a1d2 - a2d1)/(a1b2 - a2b1)
	
	
	*/
	
	
	let u1 = SegmentDiff(S1);
	let u2 = SegmentDiff(S2);
	
	let n1 = NormalVec(u1);
	let x1 = S1.p1;
		
	let n2 = NormalVec(u2);
	let x2 = S2.p1;
	
	let d1 = n1.x*x1.x + n1.y*x1.y;
	let d2 = n2.x*x2.x + n2.y*x2.y;
	
	let den = n1.x*n2.y - n1.y*n2.x;
	if (FloatEq(den, 0))
		return null;
	
	let pt = {
		x : (n2.y*d1 - n1.y*d2)/den,
		y : (n1.x*d2 - n2.x*d1)/den,
	};
	
	return pt;
}

function TFromPoints(ptBeg, ptEnd, ptMid)
{
	let dy = ptEnd.y - ptBeg.y;
	let dx = ptEnd.x - ptBeg.x;
	if (abs(dy) > abs(dx))
	{
		return (ptMid.y - ptBeg.y)/dy;
	}
	else
		return (ptMid.x - ptBeg.x)/dx;
	
}

function IntersectSegments(pos1, pos2)
{
	let pt = IntersectLine(pos1, pos2);
	if (pt == null)
		return null;
		
	let t1 = TFromPoints(pos1.p1, pos1.p2, pt);
	let t2 = TFromPoints(pos2.p1, pos2.p2, pt);
	
	if (t1 < 0 || t1 > 1)
		return null;
	if (t2 < 0 || t2 > 1)
		return null;
	
	return {
		t1 : t1,
		t2 : t2,
		pt : pt,
	};
}
