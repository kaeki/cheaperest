
var mymap = L.map('mapid').setView([60.169768, 24.938578], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'attejee.pp8gce0d',
    accessToken: 'pk.eyJ1IjoiYXR0ZWplZSIsImEiOiJjaW5mdnpvY2UwMDd4dnltNXY1YnYyZ2l5In0.Nw7B-YX52ITNbME_rm6B5A'
}).addTo(mymap);

var barsArray = [{
					ID: 1,
					name: "Bar Barbababa",
					address: "Nönönö 12, HKI",
					lat: 60.164964,
					lon: 24.939901
				},{
					ID: 2,
					name: "Pub PubloEblo",
					address: "Nununnu 28, HKI",
					lat: 60.189295,
					lon: 24.951231
				},{
					ID: 3,
					name: "Bistro Pivo",
					address: "Juhsad 39, HKI",
					lat: 60.184260,
					lon: 24.920331
				}];

console.log(barsArray[0].lat)

for (var i=0; i < barsArray.length; i++){
	var marker = L.marker([barsArray[i].lat, barsArray[i].lon]).addTo(mymap);
	marker.bindPopup("<b>"+barsArray[i].name+"</b><br>"+barsArray[i].address+".").openPopup();
}
var sideBoxHTML;
function setSideBoxHTML(sideBoxHTML){
	var rate = 5;
	for (var i=0; i < barsArray.length; i++){
		sideBoxHTML += '<tr><td>'+(i+1)+'.</td><td><a href="#" onclick="showBarInfo(bar);return false;">'+
		barsArray[i].name+'</a></td><td>'+barsArray[i].address+'</td><td>'+(rate-i)+'/5</td></tr>';
	};

	$('#topThree').append(sideBoxHTML);
	$('#newBars').append(sideBoxHTML);
}

setSideBoxHTML(sideBoxHTML);

var bar;
function barSearchFunction(){
	barl = $('#barSearch').val();
	showBarInfo(barl);
};
function showBarInfo(barl){
	var bar = barl;
	switch(bar){
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
