function geocodeAddress(address) {
	console.log("gcA0");
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({address: address}, function(results, status) {
		console.log("on response");
	    if (status == google.maps.GeocoderStatus.OK) {
	   		const location = {
	   			lat: results[0].geometry.location.lat(),
	   			lon: results[0].geometry.location.lng()
	   		};
	   		console.log("loc: "+location);
	   		showLocation(location);
	    }
	    else{
	    	console.log("Something went wrong");
	    	return {};
	    }
	});
}
function showLocation(location){
	var barData = [{
		name: $('#name').val(),
		address: $('#address').val(),
		postCode: $('#postCode').val(),
		city: $('#city').val(),
		lat: location.lat,
		lon: location.lon
	}]
	console.log(JSON.stringify(barData));

	var url = "http://barbababa-skeletor.rhcloud.com/saveBar";

	$.ajax({
		url: url,
		type: 'POST',
        data: barData,
        contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		success: function (json) {
			console.log(json);
		}
	});
	
};

$("#barForm").submit(function( event ) {
	event.preventDefault();
  	var address = $('#address').val();
  	var city = $('#city').val();
  	var addressInput = address +", " + city;
  	console.log(addressInput);
	geocodeAddress(addressInput);
});
