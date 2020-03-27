



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
			Ball.BounceBack(seg);
			// just bounce back
		},
		SetPosition : function(pos) {},
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
/*			let MidPoint = LinInt(Segment.p1, Segment.p2, 0.5);
			
			let Segment1 = CreateSegment(Segment.p1, MidPoint);
			let Segment2 = CreateSegment(MidPoint, Segment.p2);
			
			Canvas.SetColor('red');
			Canvas.DrawLine(Segment1);
			Canvas.SetColor('blue');
			Canvas.DrawLine(Segment2);*/
		},
		OnBallHit : function(Ball, t)
		{
			if (bat.Covers(t))
				Ball.BounceBack(seg);
		},
		SetPosition : function (Pos) { this.bat.SetPosition(Pos); },
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

let i = 0;

function DrawScene(Main, Canvas)
{

	let S1 = CreateSegment_Coords(0, 0, 50, (i%100));
	let S2 = CreateSegment_Coords(50, 0, 0, 50);
	
	// for each wall draw it on its position
	Main.Walls.forEach((w, i) => w.draw(Canvas, Main.WallSegments[i]) );
	
	
	Canvas.SetColor('red');
	DrawSegment(Canvas, S1);
	Canvas.SetColor('blue');
	DrawSegment(Canvas, S2);
	Canvas.SetColor('black');
	let pt = IntersectLine(S1, S2);
	if (pt)
		Canvas.DrawCircle(pt, 5);
	
	++i;
}

function OnStart(Main, Canvas)
{
	
	Main.Players = CreatePlayers(Main, PlayerInfos);
	Main.Walls = [];
	Main.Walls.push(CreatePlayerWall(Main.Players[0]));
	Main.Walls.push(CreateNormalWall());
	Main.Walls.push(CreatePlayerWall(Main.Players[1]));
	Main.Walls.push(CreateNormalWall());
	Main.Walls.push(CreateNormalWall());
	
	/*
	Main.Players.forEach(function(p)
	{
		Main.Walls.push(CreateNormalWall());
		Main.Walls.push(CreatePlayerWall(p));
	});*/
	
	
	Main.WallSegments = GenerateWallSegments(Canvas.CenterPoint, Canvas.Height/3, Main.Walls.length);
	Main.Walls.forEach((w,i) => w.SetPosition(Main.WallSegments[i]));
	
	Main.Walls.forEach((w) => w.init(Main));
	
	Main.Ball = CreateBall();
	
	Main.Keyboard.Add('q', function(key) {Main._x += 3;});
	Main.Keyboard.Add('a', function(key) {Main._x -= 3;});

}


function CreateCanvas(Canvas)
{
	let cp = {
		x : 0,//Canvas.width/2,
		y : 0, // Canvas.height/2,
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
			document.addEventListener('keydown', () => this.keydown = true );
			document.addEventListener('keyup',  () => this.keydown = false );
			window.setInterval(() => this.draw(), 10);
		},
		
		Keyboard : CreateKeyboard(),
		
		draw : function() {
			this.Keyboard.OnTimer();
			this.canvas.SetColor('black');
			this.rc.fillStyle = "white";
			this.rc.fillRect(-this.canvas.Width/2, -this.canvas.Height/2, this.canvas.Width, this.canvas.Height);
			DrawScene(this, this.canvas);
			this.rc.fillStyle = "black";
			this.rc.fillRect(this._x, 0, 100, 10);
		},
		
		_x : -200,
	};
	
	return m;
}
