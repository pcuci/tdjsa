var locate = function() {
  navigator.geolocation.getCurrentPosition(onSuccess, onError);
};

var onSuccess = function(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;

  var url = createURL(latitude, longitude);
  setLocation(window, url);
}

var createURL = function(latitude, longitude) {
  if (latitude && longitude) {
    return 'http://maps.google.com?q=' + latitude + ',' + longitude;
  }
  return '';
};

var setLocation = function(window, url) {
  window.location = url;
};

var onError = function(error) {
  document.getElementById('error').innerHTML = error.message;
}
