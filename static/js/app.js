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
	createMap(barsArray, lat, lon);
	setSideBoxHTML(barsArray);
	searchBarAutofill(barsArray);
	$('#locate').click(function(event) {
		getLocation();
	});
}
//function for setting up Map
function createMap(barsArray, lat, lon){
	var mymap = L.map('mapid').setView([lat, lon], 13);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	    maxZoom: 18,
	    id: 'attejee.pp8gce0d',
	    accessToken: 'pk.eyJ1IjoiYXR0ZWplZSIsImEiOiJjaW5mdnpvY2UwMDd4dnltNXY1YnYyZ2l5In0.Nw7B-YX52ITNbME_rm6B5A'
	}).addTo(mymap);

	addBarMarker(barsArray, mymap);
};

//Sets all the bars as markers to map
function addBarMarker(barsArray, mymap){
	for (var i=0; i < barsArray.length; i++){
		var marker = L.marker([barsArray[i].location.lat, barsArray[i].location.lon]).addTo(mymap);
		marker.bindPopup("<b>"+barsArray[i].name+"</b><br>"+barsArray[i].address+".").openPopup();
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

function barSearchFunction(){
	bar = $('#barSearch').val();
	showBarInfo(bar)
};

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


function showBarInfo(barName){

	switch(barName){
		case "Bar Barbababa":
			$('#barInfo').html(
				"<h3>"+barsArray[0].name+"</h3>"+
				"<p>"+barsArray[0].address+"</p>"+
				"<p> Rating: 5/5</p>"
				);
			$('#barComments').html(
				"<h3>Comments</h3><hr>"+
				"<p>Really cool 5/5</p>"+
				"<p><strong>Jack Nicholson</strong></p><hr>"+
				"<p>Super cool 5/5</p>"+
				"<p><strong>Bruce Lee</strong></p><hr>"+
				"<p>Really cool 5/5</p>"+
				"<p><strong>Mr. X</strong></p><hr>"
				);
			break;
		case "Pub PubloEblo":
			$('#barInfo').html(
				"<h3>"+barsArray[1].name+"</h3>"+
				"<p>"+barsArray[1].address+"</p>"+
				"<p> Rating: 4/5</p>"
				);
			$('#barComments').html(
				"<h3>Comments</h3><hr>"+
				"<p>Almost cool 4/5</p>"+
				"<p><strong>Jack Nicholson</strong></p><hr>"+
				"<p>Nice one 4/5</p>"+
				"<p><strong>Bruce Lee</strong></p><hr>"+
				"<p>Lorumitus Ipsumiatus 4/5</p>"+
				"<p><strong>Mr. X</strong></p><hr>"
				);
			break;
		case "Bistro Pivo":
			$('#barInfo').html(
				"<h3>"+barsArray[2].name+"</h3>"+
				"<p>"+barsArray[2].address+"</p>"+
				"<p> Rating: 3/5</p>"
				);
			$('#barComments').html(
				"<h3>Comments</h3><hr>"+
				"<p>Mediocre 3/5</p>"+
				"<p><strong>Jack Nicholson</strong></p><hr>"+
				"<p>Still better than nothing 3/5</p>"+
				"<p><strong>Bruce Lee</strong></p><hr>"+
				"<p>I almost liked it 3/5</p>"+
				"<p><strong>Mr. X</strong></p><hr>"
				);
			break;
		default:
			break;
	};
}

