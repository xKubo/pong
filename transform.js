

function Compose(m1, m2)
{
	return {
		a : m1.a*m2.a+m1.b*m2.d,	b : m1.a*m2.b+m1.b*m2.e,	c : m1.a*m2.c+m1.b*m2.f+m1.c,
		d : m1.d*m2.a+m1.e*m2.d,	e : m1.d*m2.b+m1.e*m2.e,	f : m1.d*m2.c+m1.e*m2.f+m1.f,
	};
}

function Scale(c)
{
	return {
		a : c,
		b : 0,
		c : 0,
		d : 0,
		e : c,
		f : 0,
	};
}
	


function Translate(Position)
{
	return {
		a : 1,
		b : 0,
		c : Position.x,
		d : 0,
		e : 1,
		f : Position.y,
	};
}

function Rotate(cs)
{
	let c = cs.cos;
	let s = cs.sin;
	return {
		a : c,
		b : -s,
		c : 0,
		d : s,
		e : c,
		f : 0,
	};	
}



function TransformPt(Point, Matrix)
{
	return {
		x : Point.x * Matrix.a + Point.y * Matrix.d + Matrix.c,
		y : Point.x * Matrix.b + Point.y * Matrix.e + Matrix.f,
	};
}

function CosSin(p1, p2)
{
	let a = Math.atan2(p1.x*p2.y-p1.y*p2.x,p1.x*p2.x+p1.y*p2.y);
	var res = {};
	res.cos = Math.cos(a);
	res.sin = -Math.sin(a);
	
	return res;
}


let ID = {
	matrix : Scale(1),
	invmatrix : Scale(1),
};


function CreateTransformation(OldPos, NewPos)
{
	var result = ID;
	
	let fApply = function (x1, x2) {  
		result.matrix = Compose(result.matrix, x1);
		result.invmatrix = Compose(x2, result.invmatrix);
	}
	
	let ZeroPt = CreatePoint(0, 0);
	
	let PosDiff = PointDiff(OldPos.p1, ZeroPt);	
	let t1 = Translate(PosDiff);
	let t2 = Translate(Neg(PosDiff));
	
	fApply(t1, t2);
	
	let ScaleCoeff = PositionLen(NewPos)/PositionLen(OldPos);
	let s1 = Scale(ScaleCoeff);
	let s2 = Scale(1/ScaleCoeff);
	
	fApply(s1, s2);
	
	var cs = CosSin(PositionDiff(OldPos), PositionDiff(NewPos));		
	let r1 = Rotate(cs);
	cs.sin = -cs.sin;
	let r2 = Rotate(cs);
	
	fApply(r1, r2);
	
	
	let PosDiffN = PointDiff(ZeroPt, NewPos.p1);	
	let t1N = Translate(PosDiffN);
	let t2N = Translate(Neg(PosDiffN));
	
	fApply(t1N, t2N);

	
	return {
		Set : function(Canvas) { Canvas.Transform(result.invmatrix); },
		Reset : function(Canvas) { Canvas.Transform(result.matrix); },
		FwdPt : function(Pt) { return TransformPt(Pt, result.matrix); },
		InvPt : function(Pt) { return TransformPt(Pt, result.invmatrix); },
	};
}

function TransformPos(Transformation, Position)
{
	return CreatePosition(Transformation.FwdPt(Position.p1), Transformation.FwdPt(Position.p2));
}

