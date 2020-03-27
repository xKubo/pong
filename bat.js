function CreateBat()
{
	let Bat = {};
	
	Bat.CurPos = 0;
	Bat.Step = 0.05;
	Bat.MinPos = 0;
	Bat.Width = 0.1;
	Bat.MaxPos = 1 - Bat.Width;
	Bat.Points = [];
	
	Bat.MoveRight = function()
	{
		if (Bat.CurPos < Bat.MaxPos)
		{
			Bat.BatPosition += Bat.Step;
			Bat.UpdatePoints();
		}
		
	};
	
	Bat.MoveLeft = function()
	{
		if (Bat.CurPos > Bat.MinPos)
		{
			Bat.BatPosition -= Bat.Step;
			Bat.UpdatePoints();
		}
			
	};
	
	Bat.draw = function(Canvas) 
	{
		Canvas.DrawLine(this.Position);
		Canvas.FillPoly(Bat.Points);		
	};
	Bat.SetPosition = function(Segment)
	{
		this.Position = Segment;
		this.PosVec = SegmentDiff(Segment).p2;
		this.PosLen = Len(PosVec);
		this.BatHeight = 0.1;
		this.BatWidth = 0.03;
		let PosNormVec = Norm(NormalVec(this.PosVec));
		this.NormVec = this.BatWidth * PosNormVec * this.PosLen;
		this.UpdatePoints();
	};
	
	Bat.UpdatePoints = function ()
	{
		let LeftPt = LinInt(Bat.Position.p1, Bat.BatPosition.p2, Bat.CurPos);
		let RightPt = LinInt(Bat.Position.p1, Bat.BatPosition.p2, Bat.CurPos + Bat.BatWidth);
		
		Bat.Points[0] = Add(LeftPt, Bat.NormVec);
		Bat.Points[1] = Add(LeftPt, -Bat.NormVec);
		Bat.Points[2] = Add(RightPt, -Bat.NormVec);
		Bat.Points[3] = Add(RightPt, Bat.NormVec);
	};
	
	Bat.Covers = function(t)
	{
		return t >= Bat.CurPos && t <= Bat.CurPos + Bat.Width;
	};
	
	return Bat;
}