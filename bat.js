function CreateBat()
{
	let Bat = {};
	
	Bat.CurPos = 0;
	Bat.Step = 0.05;
	Bat.MinPos = 0;
	Bat.Width = 0.3;
	Bat.MaxPos = 1 - Bat.Width;
	Bat.Points = [];
	
	Bat.MoveRight = function()
	{
		if (Bat.CurPos < Bat.MaxPos)
		{
			Bat.CurPos += Bat.Step;
			Bat.UpdatePoints();
		}
		
	};
	
	Bat.MoveLeft = function()
	{
		if (Bat.CurPos > Bat.MinPos)
		{
			Bat.CurPos -= Bat.Step;
			Bat.UpdatePoints();
		}
			
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
		this.BatHeight = 0.1;
		this.BatWidth = 0.03;
		let PosNormVec = Norm(NormalVec(this.PosVec));
		this.NormVec = Add(ZeroPt, this.BatWidth * this.PosLen, PosNormVec);
		this.UpdatePoints();
	};
	
	Bat.UpdatePoints = function ()
	{
		let LeftPt = LinInt(this.Position.p1, this.Position.p2, Bat.CurPos);
		let RightPt = LinInt(this.Position.p1, this.Position.p2, Bat.CurPos + Bat.BatWidth);
		
		Bat.Points[0] = Add(LeftPt, 1, this.NormVec);
		Bat.Points[1] = Add(LeftPt, -1, this.NormVec);
		Bat.Points[2] = Add(RightPt, -1, this.NormVec);
		Bat.Points[3] = Add(RightPt, 1, this.NormVec);
	};
	
	Bat.Covers = function(t)
	{
		return t >= Bat.CurPos && t <= Bat.CurPos + Bat.Width;
	};
	
	return Bat;
}