addEventListener( "load", track_init, false );

var touched = false,
		touchX,
		touchY,
		touchID,
		tw, th, tratio;

function track_init( e ) {
		// set-up touch interaction
		document.addEventListener( 'touchstart', track_touch_start, false );
		document.addEventListener( 'touchmove', track_touch_move, false );
		document.addEventListener( 'touchend', track_touch_end, false );
		// set-up mouse interaction
		document.addEventListener( 'mousedown', track_mouse_down, false );
		document.addEventListener( 'mousemove', track_mouse_move, false );
		document.addEventListener( 'mouseup', track_mouse_up, false );
		
		tw = window.innerWidth/2;
		th = window.innerHeight/2;
		tratio = tw / th;
//		tw /= ratio;
/*
		cw /= 2;
		ch /= 2;
*/
}

/*******************************************************************/
/* HANDLE TOUCH INPUT **********************************************/
/*******************************************************************/

function track_touch_start(event) 
{
	if ( !touched )
	{
		var t = event.changedTouches[0];
		touchID = t.identifier;
		track_start( t.pageX, t.pageY );
	}
	event.preventDefault(); 
	return true;
}

function track_touch_move(event) 
{
	if ( touched )
	{
		var ts = event.changedTouches,
				n = ts.length, t;
		while( n-- )
		{
			t = ts[n];
			if ( t.identifier == touchID )
			{
				track_move( t.pageX, t.pageY );
				break;
			}
		}
	}
	event.preventDefault();
	return true;
} 

function track_touch_end(event) 
{ 
	if ( touched )
	{
		var ts = event.changedTouches,
				n = ts.length, t;
		while( n-- )
		{
			t = ts[n];
			if ( t.identifier == touchID )
			{
				track_end();
				break;
			}
		}
	}
	event.preventDefault();
	return true;
}



/*******************************************************************/
/* HANDLE MOUSE INPUT **********************************************/
/*******************************************************************/

function track_mouse_down( event ) 
{
	if ( !touched )
	{
		track_start( event.pageX, event.pageY );
	}
	
	event.preventDefault();
	return true;
}

function track_mouse_move(event) 
{
	if ( touched )
	{
		track_move( event.pageX, event.pageY );
	}
	
	event.preventDefault();
	return true;
}

function track_mouse_up( event ) 
{
	if ( touched )
	{
		track_end();
	}
	
	event.preventDefault();
	return true;
}


/*******************************************************************/
/* ABSTRACT INPUT HANDLING *****************************************/
/*******************************************************************/


function track_start( x, y )
{
	touched = true;
	track_move( x, y );
}

function track_move( x, y )
{
	touchX = (x / tw - 1)*tratio;
	touchY = -(y / th - 1);
	//console.log( touchX + " -- " + touchY );
}

function track_end()
{
	touched = false;
}