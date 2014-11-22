var app = angular.module('GameOfLive',[]);

var Game= {
	created: false,
	started: false,
    speed:2000,
	map:{ 
		lock: false,
		columns: 5,
		rows: 5,
		matrix: [[]]
	}
}

var Point = function( row , column , alive ){
	this.row = row || 0;
	this.column = column || 0;
	this.alive = alive || false;
}

app.controller('gameController',function($interval){
	this.game = Game;
	this.resume = function(){
		this.game.started = true;
		var map = this.game.map;
        var speed = this.game.speed;
		gameplay = $interval( function(){ updateMap( map ); } , speed );
	};
	
	this.step = function(){
		updateMap(this.game.map);
	}
	
	this.pause = function(){
		if(angular.isDefined(gameplay)){
			$interval.cancel(gameplay);
			this.gameplay = undefined;
		}
		this.game.started = false;
	}
	
	this.reset = function(){
		this.game.created = false;
        this.game.started = false;
        if(angular.isDefined(gameplay)){
			$interval.cancel(gameplay);
			this.gameplay = undefined;
        }
	}
	
});


app.controller('newMapController',function(){
	this.columns = 5;
	this.rows = 5;
	this.speed = 1000;
	this.create = function(game){
		var matrix =  [];
		for( var i = 0 ; i < this.rows ; i++ ){
			var row = [];
			for( var j = 0 ; j < this.columns ; j++ ){
			 var point = new Point(i,j,false)
			 row.push( point );
			}
			matrix.push(row);
		}
		game.map.rows = this.rows;
		game.map.columns = this.columns;
		game.map.matrix = matrix;
        game.speed = this.speed;
		game.created = true;
		
	}
});

function updateMap( map ){
	
	if( !map.lock ){
		map.lock = true;
		result = [];
		for( var i = 0 ; i < map.rows ; i++ ){
			resultRow = [];
			for( var j = 0 ; j < map.columns ; j++ ){
				alive = nextGen( i , j , map.matrix );
				var point = new Point(i,j,alive);
				resultRow.push(point);
			}
			result.push(resultRow);
		}
		map.matrix = result;
		map.lock = false;
	}
}

function nextGen( x , y , map ){
	var count = 0;
	var rows = map.length;
	var columns = map[0].length;
	for( var i = -1 ; i < 2 ; i++ ){
		for( var j = -1 ; j < 2 ; j++ ){
			posX = (x + i + rows) % rows;
			posY = (y + j + columns) % columns;
			if( map[posX][posY].alive ) count++;  
		}
	}  
	if(map[x][y].alive) 
        count--;
    
    return (count === 3) 
            || (map[x][y].alive 
                && count > 1 
                && count < 4) ;
	
}
