N.core.Geocoder = new function () {
    var GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json?address={address}&components=country:{country}&sensor=false&lang={lang}&key=" + N.Config.GOOGLE_KEY;

    var get = function (address, country, lang) {
        var url = GEOCODE_URL.format({
            address: address,
            country: country,
            lang: lang
        });

        var response = JSON.parse(HTTP.get(url).content),
            place, result;

        if (response.status == 'OK') {
            place = response.results[0];

            return result = {
                address: place.formatted_address,
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng
            };
        } else {
            console.error('Cannot geocode ' + address);
        }

        return null;
    };

    this.get = get;
};
