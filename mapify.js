;(function($, window, document, undefined) {

    "use strict";

    var pluginName = "mapify",
        defaults = {
            // The following plugin options can be overridden
            // by their data attribute counterparts.
            // This way you can set defaults for multiple maps
            // and override specific options per map.
            markers: [], //=> a selector or array of marker objects
            lat: null,
            lng: null,
            centerLat: null,
            centerLng: null,

            // Map zoom level...
            // 1: World
            // 5: Landmass/continent
            // 10: City
            // 15: Streets
            // 20: Buildings
            zoom: 10,
            scrollwheel: false, //=> zoom with the mouse scrollwheel
            fitbounds: false, //=> fit all markers on the map?
            fitboundsPadding: 20, //=> minimum space between map borders and markers

            icon: null, //=> a "data-icon" on a marker will override any default icon
            iconSize: null, //=> optional
            iconOrigin: null, //=> optional
            iconAnchor: null, //=> optional

            // The following callbacks are available...
            // The map and marker parameters are the Google Map and Marker objects.
            // You can access the related .map and .marker DOM elements as jQuery objects
            // via the property map.$map and marker.$marker
            onMapClick:               function (map, event) { },
            onMarkerClick:            function (marker, map, event) { },
            onMarkerMouseEnter:       function (marker, map, event) { },
            onMarkerMouseLeave:       function (marker, map, event) { },
            onMarkerLegendClick:      function (marker, map, event) { },
            onMarkerLegendMouseEnter: function (marker, map, event) { },
            onMarkerLegendMouseLeave: function (marker, map, event) { }
        };

    function Plugin (mapContainer, options) {
        // The map element
        this.mapContainer = mapContainer;
        this.$map = $(mapContainer);

        // Merge map options and data attributes
        this.options = $.extend({}, defaults, options, this.getMapDataAttributes());

        this.map = null; //=> Google Map object
        this.markers = []; //=> Google Marker objects
        this.bounds = []; //=> Google Marker objects that should fit in the map

        this.init();
    }

    $.extend(Plugin.prototype, {

        init: function () {
            this.createMap();
            this.createMarkers();
            this.setMapOptions();
            this.fitBounds();
        },

        createMap: function () {
            this.map = new google.maps.Map(this.mapContainer);
            this.map.addListener('click', this.onMapClick.bind(this));
            this.map.$map = this.$map;
            this.$map.data('map', this.map);
        },

        createMarkers: function () {
            $.each(this.normalizeMarkerOptions(), function (index, markerOptions) {
                this.createMarker(markerOptions);
            }.bind(this));

            if (this.isUsingMarkerElements()) {
                $(document)
                    .on('click',      this.options.markers, this.onMarkerLegendClick.bind(this))
                    .on('mouseenter', this.options.markers, this.onMarkerLegendMouseEnter.bind(this))
                    .on('mouseleave', this.options.markers, this.onMarkerLegendMouseLeave.bind(this));
            }
        },

        createMarker: function (markerOptions) {
            var marker = new google.maps.Marker(
                this.removeEmptyObjectProperties({
                    position: this.createLatLng(markerOptions.lat, markerOptions.lng),
                    icon: this.normalizeIcon(markerOptions),
                    label: markerOptions.label,
                    title: markerOptions.title,
                    map: this.map
                })
            );

            if (this.isUsingMarkerElements()) {
                marker.$marker = markerOptions.$marker;
                markerOptions.$marker.data('marker', marker);
            }

            if (this.options.fitbounds === true || markerOptions.fitbounds === true) {
                this.bounds.push(marker);
            }

            this.markers.push(marker);

            if (markerOptions.center === true) {
                this.setCenterCoordinates(markerOptions.lat, markerOptions.lng);
            }

            marker.addListener('click',     function(event) { this.onMarkerClick(marker, event);      }.bind(this));
            marker.addListener('mouseover', function(event) { this.onMarkerMouseEnter(marker, event); }.bind(this));
            marker.addListener('mouseout',  function(event) { this.onMarkerMouseLeave(marker, event); }.bind(this));
        },

        setMapOptions: function () {
            this.map.setOptions(
                this.removeEmptyObjectProperties({
                    center: this.getMapCenterPosition(),
                    zoom: this.options.zoom,
                    scrollwheel: this.options.scrollwheel
                })
            );
        },

        getMapCenterPosition: function () {
            if ( ! this.options.centerLat || ! this.options.centerLng) {
                if (this.markers.length === 0) {
                    return console.error('Could not set a center position on the map.');
                }

                // If there is no center point yet,
                // use the first marker.
                this.setCenterCoordinates(
                    this.markers[0].position.lat(),
                    this.markers[0].position.lng()
                );
            }

            return this.createLatLng(this.options.centerLat, this.options.centerLng);
        },

        setCenterCoordinates: function (lat, lng) {
            this.options.centerLat = lat;
            this.options.centerLng = lng;
        },

        fitBounds: function () {
            if (this.bounds.length > 0) {
                var bounds = new google.maps.LatLngBounds();

                $.each(this.bounds, function (index, marker) {
                    bounds.extend(marker.position);
                });

                this.map.fitBounds(bounds, this.options.fitboundsPadding);
            }
        },

        //
        // Normalize Marker Options
        //

        normalizeMarkerOptions: function () {
            if (this.mapHasSingleMarkerCoords()) {
                return [this.normalizeMarkerElement(this.$map)];
            }

            if (this.isUsingMarkerElements()) {
                return this.normalizeMarkerElements();
            }

            if (this.isArray(this.optios.markers)) {
                return this.options.markers;
            }

            return [];
        },

        normalizeMarkerElements: function () {
            var markers = [];

            $(this.options.markers).each(function (index, marker) {
                markers.push(this.normalizeMarkerElement($(marker)));
            }.bind(this));

            return markers;
        },

        normalizeMarkerElement: function ($marker) {
            return this.removeEmptyObjectProperties({
                lat: $marker.data('lat'),
                lng: $marker.data('lng'),
                center: $marker.data('center'),
                fitbounds: $marker.data('fitbounds'),
                icon: $marker.data('icon'),
                iconSize: $marker.data('icon-size'),
                iconOrigin: $marker.data('icon-origin'),
                iconAnchor: $marker.data('icon-anchor'),
                label: $marker.data('label'),
                title: $marker.data('title'),
                $marker: $marker
            });
        },

        normalizeIcon: function (markerOptions) {
            var icon = this.removeEmptyObjectProperties({
                url:                         markerOptions.icon       || this.options.icon,
                scaledSize: this.createSize( markerOptions.iconSize   || this.options.iconSize),
                origin:     this.createPoint(markerOptions.iconOrigin || this.options.iconOrigin),
                anchor:     this.createPoint(markerOptions.iconAnchor || this.options.iconAnchor)
            });

            return icon.url ? icon : null;
        },

        //
        // Map Data Attributes
        //

        getMapDataAttributes: function () {
            return this.removeEmptyObjectProperties({
                markers: this.$map.data('markers'),
                zoom: this.$map.data('zoom'),
                scrollwheel: this.$map.data('scrollwheel'),
                fitbounds: this.$map.data('fitbounds'),
                fitboundsPadding: this.$map.data('fitbounds-padding'),
                lat: this.$map.data('lat'),
                lng: this.$map.data('lng'),
                centerLat: this.$map.data('center-lat') || this.$map.data('lat'),
                centerLng: this.$map.data('center-lng') || this.$map.data('lng'),
                icon: this.$map.data('icon'),
                iconSize: this.$map.data('icon-size'),
                iconOrigin: this.$map.data('icon-origin'),
                iconAnchor: this.$map.data('icon-anchor')
            });
        },

        //
        // Google Factory
        //

        createLatLng: function (lat, lng) {
            return new google.maps.LatLng(lat, lng);
        },

        createSize: function (size) {
            size = this.splitValues(size);

            return size ? new google.maps.Size(size.x, size.y) : null;
        },

        createPoint: function (point) {
            point = this.splitValues(point);

            return point ? new google.maps.Point(point.x, point.y) : null;
        },

        //
        // General Helpers
        //

        mapHasSingleMarkerCoords: function () {
            return this.options.lat && this.options.lng;
        },

        isUsingMarkerElements: function () {
            return this.isString(this.options.markers);
        },

        isString: function (value) {
            return typeof value === 'string' || value instanceof String;
        },

        isArray: function (value) {
            return value.constructor === Array;
        },

        splitValues: function (values) {
            if ( ! values) {
                return null;
            }

            values = values.split(',');

            return {
                x: values[0],
                y: values[1]
            };
        },

        removeEmptyObjectProperties: function (obj) {
            for (var propName in obj) {
                if (obj[propName] === null || obj[propName] === undefined) {
                    delete obj[propName];
                }
            }

            return obj;
        },

        //
        // Events & Callbacks
        //

        onMapClick: function (event) {
            this.runUserCallback(this.options.onMapClick, this.map, event);
        },

        onMarkerClick: function (marker, event) {
            this.runUserCallback(this.options.onMarkerClick, marker, this.map, event);
        },

        onMarkerMouseEnter: function (marker, event) {
            this.runUserCallback(this.options.onMarkerMouseEnter, marker, this.map, event);
        },

        onMarkerMouseLeave: function (marker, event) {
            this.runUserCallback(this.options.onMarkerMouseLeave, marker, this.map, event);
        },

        onMarkerLegendClick: function (event) {
            var marker = $(event.currentTarget).data('marker');
            this.runUserCallback(this.options.onMarkerLegendClick, marker, this.map, event);
        },

        onMarkerLegendMouseEnter: function (event) {
            var marker = $(event.currentTarget).data('marker');
            this.runUserCallback(this.options.onMarkerLegendMouseEnter, marker, this.map, event);
        },

        onMarkerLegendMouseLeave: function (event) {
            var marker = $(event.currentTarget).data('marker');
            this.runUserCallback(this.options.onMarkerLegendMouseLeave, marker, this.map, event);
        },

        runUserCallback: function (callback) {
            if (callback instanceof Function) {
                callback.apply(this, Array.prototype.slice.call(arguments, 1));
            }
        }

    });

    $.fn[ pluginName ] = function (options) {
        return this.each(function () {
            if ( ! $.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
