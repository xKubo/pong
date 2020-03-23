function CreateKeyboard()
{
	
	let res = {};
	res.Keys = [];
	res.PressedKeys = new Set();
	
	res.Add = function(Key, OnKeyPressed)
	{
		res.Keys[Key] = OnKeyPressed;
	}
	
	
	
	res._OnKeyDown = function(KeyEvent)
	{
		res.PressedKeys.add(KeyEvent.key);
	}

	res._OnKeyUp = function(KeyEvent)
	{
		res.PressedKeys.delete(KeyEvent.key);
	}
	
	res.OnTimer = function()
	{
		res.PressedKeys.forEach((key) => function(key) {
			if (res.Keys[key]) 
				res.Keys[key](key); 
		}(key));
	}
	
	document.addEventListener('keydown', (key) => res._OnKeyDown(key) );
	document.addEventListener('keyup',  (key) => res._OnKeyUp(key));
	
	return res;
}