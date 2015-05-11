var restaurantDep = new Deps.Dependency(),
    restaurants = [],
    markers = [],
    map;

var openRestaurant = function (id) {
    var mapEl = $('#map'),
        detailEl = mapEl.find('.restaurant-detail-wrapper');

    if (!detailEl.length) {
        mapEl.append('<div class="restaurant-detail-wrapper"></div>');
        detailEl = mapEl.find('.restaurant-detail-wrapper');
    }

    detailEl.html('');

    N.showLoading();
    Meteor.call('Restaurant.getDetail', id, function (error, result) {
        N.hideLoading();

        result.proxiedPhoto = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url={0}&container=focus&refresh=86400'.format(
            encodeURIComponent(result.photo)
        );
        UI.insert(UI.renderWithData(Template.restaurantDetail, result), detailEl[0]);
    });
};

var loadRestaurants = function (ne, sw) {
    N.showLoading();

    Meteor.call('Restaurant.findIn', [ne.lat(), ne.lng()], [sw.lat(), sw.lng()], function (error, result) {
        N.hideLoading();

        restaurants = result;

        _.each(markers, function (marker) {
            marker.setMap(null);
        });

        markers.length = 0;

        _.each(restaurants, function (restaurant, i) {
            var geo = restaurant.detail.geo,
                order = i + 1,
                marker;

            restaurant.order = order;

            geo.address = geo.address.replace(/, France/, '');

            marker = new google.maps.Marker({
                position: new google.maps.LatLng(geo.coords[1], geo.coords[0]),
                map: map,
                icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld={0}|70DBDB|333333'.format(order)
            });

            marker.id = restaurant._id;
            google.maps.event.addListener(marker, 'click', function () {
                openRestaurant(this.id);
            });

            markers.push(marker);
        });

        restaurantDep.changed();
    });
};

_.extend(Template.map, {
    rendered: function () {
        $.getScript('https://www.google.com/jsapi', function () {
            if (window.google && !window.google.map) {
                google.load('maps', '3', {other_params:'sensor=false', callback: function(){
                    var mapEl = $('#map'),
                        mapHeight = $(window).height() - 70;

                    mapEl.width(Math.min($(window).width() - 300, 800));
                    mapEl.height(mapHeight);
                    $('.restaurant-list')[0].style.height = mapHeight + 'px';

                    map = new google.maps.Map(mapEl[0], {
                        center: new google.maps.LatLng(48.8567, 2.3508),
                        zoom: 12
                    });

                    google.maps.event.addListener(map, 'idle', function() {
                        var bounds = map.getBounds();
                        loadRestaurants(bounds.getNorthEast(), bounds.getSouthWest());
                    });

                }});
            }
        });
    },

    getRestaurants: function () {
        restaurantDep.depend();
        return restaurants;
    }
});

Template.map.events({
    'mouseenter .restaurant-summary': function (e, tpl) {
        var index = $(e.currentTarget).index();

        markers[index].setAnimation(google.maps.Animation.BOUNCE);
    },

    'mouseleave .restaurant-summary': function (e, tpl) {
        var index = $(e.currentTarget).index();

        markers[index].setAnimation(null);
    },

    'click .restaurant-summary': function (e, tpl) {
        var index = $(e.currentTarget).index(),
            id = restaurants[index]._id;

        openRestaurant(id);
    },
    'click .close': function () {
        $('.restaurant-detail-wrapper').remove();
    }
});
