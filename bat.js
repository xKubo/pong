function CreateBat()
{
	let Bat = {};

	Bat.Width = 0.3;
	Bat.Height = 0.03;
	
	Bat.MinPos = 0;
	Bat.MaxPos = 1 - Bat.Width;
	
	Bat.CurPos = (Bat.MaxPos - Bat.MinPos)/2;
	Bat.Step = 0.02;
	
	
	Bat.Points = [];
	
	Bat.MoveRight = function()
	{
		let incr = Math.min(Bat.MaxPos - Bat.CurPos, Bat.Step);
		Bat.CurPos += incr;
		Bat.UpdatePoints();	
	};
	
	Bat.MoveLeft = function()
	{
		let decr = Math.min(Bat.CurPos - Bat.MinPos, Bat.Step);
		Bat.CurPos -= decr;
		Bat.UpdatePoints();			
	};
	
	Bat.draw = function(Canvas) 
	{
		Canvas.SetColor('green');
		Canvas.DrawLine(this.Position);
		Canvas.SetFillColor('blue');
		Canvas.FillPoly(Bat.Points);		
	};
	Bat.SetPosition = function(Segment)
	{
		this.Position = Segment;
		this.PosVec = SegmentDiff(Segment);
		this.PosLen = Len(this.PosVec);
		let PosNormVec = Norm(NormalVec(this.PosVec));
		this.NormVec = Add(ZeroPt, this.Height * this.PosLen, PosNormVec);
		this.UpdatePoints();
	};
	
	Bat.UpdatePoints = function ()
	{
		let LeftPt = LinInt(this.Position.p1, this.Position.p2, Bat.CurPos);
		let RightPt = LinInt(this.Position.p1, this.Position.p2, Bat.CurPos + Bat.Width);
		
		Bat.Points[0] = Add(LeftPt, 1, this.NormVec);
		Bat.Points[1] = Add(LeftPt, 0, this.NormVec);
		Bat.Points[2] = Add(RightPt, 0, this.NormVec);
		Bat.Points[3] = Add(RightPt, 1, this.NormVec);
	};
	
	Bat.Covers = function(t)
	{
		return t >= Bat.CurPos && t <= Bat.CurPos + Bat.Width;
	};
	
	return Bat;
}