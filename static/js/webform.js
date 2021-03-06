function geocodeAddress(address) {
	console.log("gcA0");
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({address: address}, function(results, status) {
		console.log(results);
	    if (status == google.maps.GeocoderStatus.OK) {
	   		const location = {
	   			lat: results[0].geometry.location.lat(),
	   			lon: results[0].geometry.location.lng(),
	   			postCode: results[0].address_components[5].long_name
	   		};
	   		showLocation(location);
	    }
	    else{
	    	console.log("Something went wrong");
	    	return {};
	    }
	});
}

function showLocation(location){
	console.log(location.postCode);
	var barData = {
		name: $('#name').val(),
		address: $('#address').val(),
		postCode: location.postCode,
		city: $('#city').val(),
		lat: location.lat,
		lon: location.lon
		};
	console.log(JSON.stringify(barData));

	var url = "http://barbababa-skeletor.rhcloud.com/saveBar";

	$.post(url, barData);

    if(confirm("Bar added succesfully!")){
    	window.location.reload();
    }
    else{
    	window.location.reload();
    }


/*
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
*/
};

$("#barForm").submit(function( event ) {
	event.preventDefault();
  	var address = $('#address').val();
  	var city = $('#city').val();
  	var addressInput = address +", " + city;
  	console.log(addressInput);
	geocodeAddress(addressInput);
});
