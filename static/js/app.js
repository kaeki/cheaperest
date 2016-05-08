//Testi-Baarit

/*
var testArray = [{
					ID: 1,
					name: "Bar Barbababa",
					address: "Nönönö 12, HKI",
					lat: 60.164964,
					lon: 24.939901,
					rating: [4,5,5,5,5,5,5,5]	
				},{
					ID: 2,
					name: "Pub PubloEblo",
					address: "Nununnu 28, HKI",
					lat: 60.189295,
					lon: 24.951231,
					rating: [3,4,3,3,4,4,3,5,2]
				},{
					ID: 3,
					name: "Bistro Pivo",
					address: "Juhsad 39, HKI",
					lat: 60.184260,
					lon: 24.920331,
					rating: [3,2,4,3,3,2,2,1]
				}];


//Gets Bars from google sheet / OR NOT
function getBars (){
	 // ID of the Google Spreadsheet
	 var spreadsheetID = "1X3C5Peao4M5vTspsmJgegVRwGFtdRL-rGV_Vmunv9zs";
	 
	 // Make sure it is public or set to Anyone with link can view 
	 var url = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/od6/public/basic?alt=json";
*/ 

//Gets bars from API
function getBars(){
	var url = "http://barbababa-skeletor.rhcloud.com/bars";
	var mydata = [];
	$.ajax({
		url: url,
		dataType: 'json',
		success: function (json) {
			barCallBack(json);
			
		}
	});
}
getBars();

//When getBars is ready, data is used to do these things
function barCallBack(barsArray){
	var lat = 60.169768;
	var lon = 24.938578;
	setSideBoxHTML(barsArray);
	createMap(barsArray, lat, lon);
	searchBarAutofill(barsArray);
	$('#locate').click(function() {
		getLocation();
	});
	$('#barSearchBtn').click(function(){
		var barName = $('#barŚearch').val();
		showBarInfo(barName, barsArray);
	});
}
//function for setting up Map
function createMap(barsArray, lat, lon){
	var mymap = L.map('mapid');
	mymap.setView([lat, lon], 13);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	    maxZoom: 18,
	    id: 'attejee.pp8gce0d',
	    accessToken: 'pk.eyJ1IjoiYXR0ZWplZSIsImEiOiJjaW5mdnpvY2UwMDd4dnltNXY1YnYyZ2l5In0.Nw7B-YX52ITNbME_rm6B5A'
	}).addTo(mymap);

	addBarMarker(barsArray, mymap);
};

function sendRate(){
	var rate = $('#selectRate').val();
	var name = parseInt($('#mapMarkerDiv').attr("value"));
	var data = {
				name: name,
				rate: rate;
				};
	var url = "http://barbababa-skeletor.rhcloud.com/updateBar";
	console.log(data);
	$.ajax({
		url: url,
		type: 'POST',
		data: data,
		dataType: 'json',
		success: function () {
			$('#ratingOK').html('Noice!');
			console.log(data);
		}
	});
}
//Sets all the bars as markers to map
function addBarMarker(barsArray, mymap){
	var dropdownHTML = 
			'<div class="form-group">'+
			'<label for="sel1">Select rating:</label>'+
			'<select class="form-control" id="selectRate">'+
			'<option>1</option>'+
			'<option>2</option>'+
			'<option>3</option>'+
			'<option>4</option>'+
			'<option>5</option>'+
			'</select>'+
			'</div>'+
			'<button class="btn btn-default" id="rate" onclick="sendRate();">Rate bar</button><span id="ratingOK"></span>';
	for (var i=0; i < barsArray.length; i++){
		var marker = L.marker([barsArray[i].location.lat, barsArray[i].location.lon]).addTo(mymap);
		marker.bindPopup('<span id="barID" value="'+barsArray[i]._id+
			'"></span><div id="mapMarkerDiv" value="'+barsArray[i].name+'" class="mapMarker" style="font-size: 1,65em;"><h3>'+
			barsArray[i].name+'</h3><p>'+barsArray[i].address+
			'</p><p>Rating: '+barsArray[i].ratingAvg+'/5</p>'+
			dropdownHTML+'</div>');
	};
}

//Calculates bars Average rating, rounds it and sorts array
function sortBarPerRating(barsArray){

	for (var i = 0; i < barsArray.length; i++){
		if (i < barsArray[i].rating.length){
			var sum = barsArray[i].rating.reduce(function(a, b) { return a + b; });
			var avg = sum / barsArray[i].rating.length;
			barsArray[i].ratingAvg = Math.round(avg * 1) / 1;
		}
	}
	var sortedArray = barsArray.sort(function(a, b){
 		return a.ratingAvg-b.ratingAvg;
	});
	return sortedArray;
}

//Sets data to sidebox
function threeBarsHTML(barsArray){
	var HTML;
	var count = 1;
	for (var i=barsArray.length-1; i > barsArray.length-4; i--){
		HTML += '<tr><td>'+(count++)+'.</td><td><a href="#" onclick="showBarInfo('+barsArray[i].name+')">'+
		barsArray[i].name+'</a></td><td>'+barsArray[i].address+'</td><td>'+barsArray[i].ratingAvg+'/5</td></tr>';
	}
	return HTML;
}
function setSideBoxHTML(barsArray){
	//Sets top three 
	var topThreeArr = sortBarPerRating(barsArray);
	var topThreeHTML = threeBarsHTML(topThreeArr);
	//Sets new bars
	var newBarsHTML = threeBarsHTML(barsArray);
	$('#topThree').append(topThreeHTML);
	$('#newBars').append(newBarsHTML);
}


//Fills the autofill in search box with bar names
function searchBarAutofill(arrayOfBars){
	var input = document.getElementById("barSearch");
	var awesomplete = new Awesomplete(input, {
	  minChars: 1,
	  maxItems: 5,
	  autoFirst: true
	});
	var barNameArray = [];
	for (var i=0; i< arrayOfBars.length; i++){
		barNameArray.push(arrayOfBars[i].name);
	}

	awesomplete.list = barNameArray;
}
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        $('#locationError').HTML = "Geolocation is not supported by this browser.";
    }
}
function showPosition(position){
	var lat = position.coords.latitude;
	var lon = position.coords.longitude;
	createMap(barsArray, lat, lon);
}


function showBarInfo(barName, barsArray){
	for (var i=0; i < barsArray.length; i++){
		if(barName == barsArray[i].name){
			L.map('mapid').setView([barsArray[i].location.lat, barsArray[i].location.lon], 13);
			$('#menu1').html(
				'<h3>'+barsArray[i].name+'</h3>'+
				'<p>'+barsArray[i].address+'</p>'+
				'<p>'+barsArray[i].postCode+' '+barsArray[i].city+'</p>'+
				'<p>Rating: '+barsArray[i].ratingAvg+'/5  Rated '+
					barsArray[i].rating.length+' times.</p>'
				);
		};
	};
}

