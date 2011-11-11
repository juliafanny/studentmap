function initialize_googlemaps(element) {
  var latlng = new google.maps.LatLng($('#latitude').html(), $('#longditude').html());
  var myOptions = {
    zoom: 16,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var map = new google.maps.Map(element, myOptions);
  var marker = new google.maps.Marker({
    position: latlng, 
    map: map, 
    title: $('#roomName').html()
  });
}