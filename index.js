



function CreateNormalWall()
{
	return {
		init : function (Main) { },
		draw : function (Canvas, Segment) 
		{ 
			Canvas.SetColor('yellow');
			Canvas.DrawLine(Segment);
		},
		OnBallHit : function(Ball)
		{
			Ball.BounceBack(this.Position);
			// just bounce back
		},
		SetPosition : function(pos) 
		{
			this.Position = pos;			
		},
	};
}

function CreatePlayerWall(Player)
{	
		return {
		init : function (Main) 
		{
			Main.Keyboard.Add(Player.info.control.left, () => this.bat.MoveLeft());
			Main.Keyboard.Add(Player.info.control.right, () => this.bat.MoveRight());
		},
		bat : CreateBat(),		
		draw : function (Canvas, Segment) 
		{ 
			
			this.bat.draw(Canvas);
		},
		OnBallHit : function(Ball, t)
		{
			if (this.bat.Covers(t))
				Ball.BounceBack(this.Position);
		},
		SetPosition : function (Pos) { 
			this.Position = Pos;
			this.bat.SetPosition(Pos); 
		},
	};
}

function CreatePortalWall()
{

}




function GenerateWallSegments(CenterPoint, Size, Count)
{
	let Segments = [];
	
	let AngleAdd = 2*Math.PI/Count;
	
	let fGetPoint = function(i) {  
		return {
			x : CenterPoint.x + Size*Math.cos(i*AngleAdd),
			y : CenterPoint.y - Size*Math.sin(i*AngleAdd),				
		}
	};
		
	for (let i = 0; i<Count; ++i)
	{
		let Angle = i*AngleAdd;
		let Segment = 
		{
			p1 : fGetPoint(i),
			p2 : fGetPoint(i+1),
		}
		Segments.push(Segment);
	}
	
	return Segments;
}




let PlayerInfos = [
{	
	control : { type : 'key', left : 'w', right : 's'},
	name : 'P1',
},

{
	control : { type : 'key', left : 'p', right : 'l'},
	name : 'P2',
},

{
	control : { type : 'key', left : 'z', right : 'x'},
	name : 'P3',
}

];




function CreatePlayer(Main, PlayerInfo)
{
	return {
		info : PlayerInfo,
	};
	
	
	PlayerInfo;
}


function CreatePlayers(Main, PlayerInfos)
{
	var Players = [];
	PlayerInfos.forEach(pi => Players.push(CreatePlayer(Main, pi)) );
	return Players;
}


function DrawSegment(Canvas, Segment)
{
	Canvas.DrawCircle(Segment.p1, 5);
	Canvas.DrawLine(Segment);
}


function DrawScene(Main, Canvas)
{
	Main.Walls.forEach((w, i) => w.draw(Canvas, Main.WallSegments[i]) );
	Main.Ball.update(Main.CollisionDetector);
	Main.Ball.draw(Canvas);
}

function OnStart(Main, Canvas)
{
	let cd = CreateCollisionDetector();
	Main.CollisionDetector = cd;
	
	Main.Players = CreatePlayers(Main, PlayerInfos);
	Main.Walls = [];
	Main.Walls.push(CreatePlayerWall(Main.Players[0]));
	Main.Walls.push(CreateNormalWall());
	Main.Walls.push(CreatePlayerWall(Main.Players[1]));
	Main.Walls.push(CreateNormalWall());
	Main.Walls.push(CreateNormalWall());
	
	Main.WallSegments = GenerateWallSegments(Canvas.CenterPoint, Canvas.Height/3, Main.Walls.length);
	Main.Walls.forEach((w,i) => w.SetPosition(Main.WallSegments[i]));
	
	Main.Walls.forEach((w) => w.init(Main));
	
	Main.Walls.forEach((w) => cd.RegisterLine(w.Position, w));
	
	Main.Ball = CreateBall(CreatePoint(0,0));
	

}


function CreateCanvas(Canvas)
{
	let cp = {
		x : 0,
		y : 0,
	};		
	var rc = Canvas.getContext('2d');
	rc.transform(1, 0, 0, -1, Canvas.width/2, Canvas.height/2);
	return {
		SetColor : function(color) { rc.strokeStyle = color; },
		SetFillColor : function(color) { rc.fillStyle = color; },
		DrawLine : function (Position) { 
			rc.beginPath();
			rc.moveTo(Position.p1.x, Position.p1.y);
			rc.lineTo(Position.p2.x, Position.p2.y);
			rc.stroke();
		},
		DrawCircle : function(Point, Radius) {
			rc.beginPath();
			rc.ellipse(Point.x, Point.y, Radius, Radius, 0, 0, 2 * Math.PI);
			rc.stroke();	
		},
		FillPoly : function(Points) {
			rc.beginPath();
			rc.moveTo(Points[Points.length-1].x, Points[Points.length-1].y);
			Points.forEach((pt) => rc.lineTo(pt.x, pt.y));
			rc.closePath();
			rc.fill();
		},
		CenterPoint : cp,
		Width : Canvas.width,
		Height : Canvas.height,
		Transform : function(m) {
			rc.transform(m.a, m.d, m.b, m.e, m.c, m.f);
		}
	};
}


/// System functions

function $(query)
{
	return document.querySelectorAll(query);
}

window.GetMain = function()
{
	
	
	var m = 
	{
		init : function (idCnv, idDiv) {
			this.h5cnv = $(idCnv)[0];
			this.h5cnv.width = screen.width;
			this.h5cnv.height = screen.height;
			this.rc = this.h5cnv.getContext('2d');
			this.div = $(idDiv)[0];
			this.rc.lineWidth = 3;
			this.canvas = CreateCanvas(this.h5cnv);
			this.BoundRect = this.h5cnv.getBoundingClientRect();
			this.h5cnv.addEventListener('mousemove', e => { 
				this.div.innerText = "X:" + (e.clientX - this.BoundRect.left - this.h5cnv.width/2).toFixed(2) + 
				" Y:" + -1*(e.clientY - this.BoundRect.top - this.h5cnv.height/2).toFixed(2);
			});
			OnStart(this, this.canvas);
			window.setInterval(() => this.draw(), 10);
		},
		
		Keyboard : CreateKeyboard(),
		
		draw : function() {
			this.Keyboard.OnTimer();
			this.rc.fillStyle = "white";
			this.rc.fillRect(-this.canvas.Width/2, -this.canvas.Height/2, this.canvas.Width, this.canvas.Height);
			DrawScene(this, this.canvas);
		},
		
		_x : -200,
	};
	
	return m;
}
