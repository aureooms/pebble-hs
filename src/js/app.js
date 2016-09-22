/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */


var UI = require('ui');
var Vector2 = require('vector2');

var ajax = require('ajax');

var BUSY = false ;
var TIMESTAMP = 0 ;
var DATA = null ;

var TIMEOUT = null;
var INTERVAL = 60000;

var BOK = '#55AA55' ;
var BLO = '#FFFF55' ;
var BKO = '#FF0055' ;
var FOK = '#FFFFFF' ;
var FLO = '#000000' ;
var FKO = '#FFFFFF' ;
var WTF = '#555555' ;

var main = new UI.Window({
	scrollable: false,
	status: {
		separator : 'none',
		color: FKO,
		backgroundColor: BKO
	}
});

var size = main.size();
var w = size.x ;
var h = size.y ;

var background = new UI.Rect({
 position: new Vector2(0, 0),
 size: new Vector2(w, h),
 backgroundColor: BLO
});

main.add(background);

var count = new UI.Text({
 position: new Vector2(0,(h-30*3)/2),
 size: new Vector2(w, 30),
 font: 'bitham-42-bold',
 text: '',
 color: '#FFFFFF' ,
 backgroundColor: 'none',
 textAlign: 'center',
 textOverflow: 'fill'
});

main.add(count);

main.show();

var api = 'https://urlab.be/spaceapi.json' ;

function udisplay ( ) {
	
	var open = null ;
	var people = '?' ;
	
	try {
		open = DATA.state.open ;
	}
	catch (e){
		// do nothing
	}
	
	try {
		people = DATA.sensors.people_now_present[0].value ;
	}
	catch (e){
		// do nothing
	}
	
	if ( open === undefined ) open = null ;
	if ( people === undefined ) people = '?' ;
	
	var fco = FOK ;
	var bco = BOK ;
	var cco = BOK ;
	
	if ( open === null ) {
		fco = FKO ;
		bco = BKO ;
		cco = WTF ;
	}
	else if ( !open ) {
		cco = BKO ;
	}
	
	main.status('color', fco);
	main.status('backgroundColor', bco);
	background.backgroundColor( cco ) ;
	count.text(people);
}

function query ( ) {
	
	ajax({ url: api, type: 'json' },
	  function(data, status, request) {
		DATA = data ;
		udisplay();
		BUSY = false ;
		TIMESTAMP = Date.now();
		TIMEOUT = setTimeout( load , INTERVAL ) ;
	  },
	  function(data, status, request) {
		DATA = null;
		udisplay();
		BUSY = false ;
	  }
	);
}


function load(){
	
	if ( BUSY ) return ;
	
	BUSY = true ;
	
	if ( TIMEOUT !== null ) {
		clearTimeout(TIMEOUT);
		TIMEOUT = null ;
	}
	
	main.status('color', FLO ) ;
	main.status('backgroundColor', BLO ) ;
	
	query();
	
}


load();

main.on('click', 'select', function(e) { load() ; } ) ;
main.on('click', 'down', function(e) { load() ; } ) ;
main.on('click', 'up', function(e) { load() ; } ) ;
main.on('longClick', 'select', function(e) { load() ; } ) ;
main.on('longClick', 'down', function(e) { load() ; } ) ;
main.on('longClick', 'up', function(e) { load() ; } ) ;

main.on('hide', function(){
	if ( TIMEOUT !== null ) {
		clearTimeout(TIMEOUT);
		TIMEOUT = null ;
	}
});

main.on('show', function(){
	load();
});