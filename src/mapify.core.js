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
            zoom: 15,
            scrollwheel: false, //=> zoom with the mouse scrollwheel
            fitbounds: true, //=> fit all markers on the map?
            fitboundsPadding: 50, //=> stop zooming in as soon as a markers gets in the padding zone

            icon: null, //=> a "data-icon" on a marker will override any default icon
            iconSize: null, //=> optional
            iconOrigin: null, //=> optional
            iconAnchor: null, //=> optional

            clusters: true, //=> enable marker clustering?
            clusterTitle: '', //=> browser tooltip when hovering over a cluster icon
            clusterCenter: true, //=> position the cluster icon in the center of the markers or on the first marker
            clusterGridSize: 40, //=> the lower the grid size, the closer markers need to be to each other to be clustered
            clusterMinSize: 2, //=> the minimum number of markers needed in a cluster before a cluster appears
            clusterMaxZoom: 15, //=> stop clustering when zoomed in to this level
            clusterZoomOnClick: true,
            clusterRetina: true,
            clusterIcon: '/images/cluster.png',
            clusterIconSize: '50,50', //=> should be actual icon size or the text will be positioned wrong
            clusterTextColor: '#ffffff',
            clusterTextSize: 12,

            // Array of cluster icon styles...
            // If defined, this overrides previous cluster icon and text options.
            // Each style in the array is a ClusterIconStyle class/object.
            // Check the official documentation for more details:
            // http://htmlpreview.github.io/?https://github.com/googlemaps/v3-utility-library/blob/master/markerclustererplus/docs/reference.html
            clusterIcons: null,

            // Function that returns an object containing
            // the text and title for the cluster icon,
            // as well as the clusterIcons array index to use.
            clusterCalculator: function (markers, totalAvailableIcons) {
                var index = 0,
                    title = '',
                    count = markers.length.toString(),
                    dv = count;

                while (dv !== 0) {
                    dv = parseInt(dv / 10, 10);
                    index++;
                }

                index = Math.min(index, totalAvailableIcons);

                return {
                    text: count,
                    index: index,
                    title: title
                };
            },

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
            onMarkerLegendMouseLeave: function (marker, map, event) { },
            onClusterClick:           function (markers, cluster, map) { },
            onClusterMouseEnter:      function (markers, cluster, map) { },
            onClusterMouseLeave:      function (markers, cluster, map) { }
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
        this.markerClusterer = null; //=> Google MarkerClusterer object

        this.init();
    }

    $.extend(Plugin.prototype, {

        init: function () {
            this.createMap();
            this.createMarkers();
            this.setMapOptions();
            this.fitBounds();
            this.enableClustering();
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

            // When fitbounds is true for a specific marker,
            // and global fitbounds is also still true (by default),
            // set global fitbounds to false and reset the bounds array.
            if (markerOptions.fitbounds === true && this.options.fitbounds === true) {
                this.options.fitbounds = false;
                this.bounds = [];
            }

            if (markerOptions.fitbounds === true || this.options.fitbounds === true) {
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
            // Only use fitBounds when there is
            // more than one marker.
            if (this.bounds.length > 1) {
                var bounds = new google.maps.LatLngBounds();

                $.each(this.bounds, function (index, marker) {
                    bounds.extend(marker.position);
                });

                this.map.fitBounds(bounds, this.options.fitboundsPadding);
            }
        },

        enableClustering: function () {
            if (this.shouldDisableClustering()) {
                return;
            }

            // Requires markerclusterer.js
            // Docs: http://htmlpreview.github.io/?https://github.com/googlemaps/v3-utility-library/blob/master/markerclustererplus/docs/reference.html

            this.markerClusterer = new MarkerClusterer(this.map, this.markers, {
                title: this.options.clusterTitle,
                averageCenter: this.options.clusterCenter,
                gridSize: this.options.clusterGridSize,
                minimumClusterSize: this.options.clusterMinSize,
                maxZoom: this.options.clusterMaxZoom,
                zoomOnClick: this.options.clusterZoomOnClick,
                enableRetinaIcons: this.options.clusterRetina,
                calculator: this.options.clusterCalculator,
                styles: this.getClustersIconStyles()
            });

            this.markerClusterer.addListener('click',     function(cluster) { this.onClusterClick(cluster);      }.bind(this));
            this.markerClusterer.addListener('mouseover', function(cluster) { this.onClusterMouseEnter(cluster); }.bind(this));
            this.markerClusterer.addListener('mouseout',  function(cluster) { this.onClusterMouseLeave(cluster); }.bind(this));
        },

        shouldDisableClustering: function () {
            return ! this.classExists('MarkerClusterer') || this.options.clusters === false || this.markers.length < 2;
        },

        getClustersIconStyles: function () {
            if (this.isArray(this.options.clusterIcons)) {
                return this.options.clusterIcons;
            }

            var clusterIconSize = this.splitNumbers(this.options.clusterIconSize);

            return [{
                width: clusterIconSize[0], //=> actual image width
                height: clusterIconSize[1], //=> actual image height
                url: this.options.clusterIcon,
                backgroundPosition: '0, 0', //=> mind the space after the comma !!!
                anchorIcon: [
                    clusterIconSize[1] / 2, //=> Y
                    clusterIconSize[0] / 2  //=> X
                ],
                anchorText: [0, 0], //=> [Y,X] from the center of the cluster icon
                textColor: this.options.clusterTextColor,
                textSize: this.options.clusterTextSize,
                textDecoration: 'none',
                fontFamily: 'Arial, sans-serif',
                fontStyle: 'normal',
                fontWeight: 'bold'
            }];
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
                lat: this.$map.data('lat'),
                lng: this.$map.data('lng'),
                centerLat: this.$map.data('center-lat') || this.$map.data('lat'),
                centerLng: this.$map.data('center-lng') || this.$map.data('lng'),
                zoom: this.$map.data('zoom'),
                scrollwheel: this.$map.data('scrollwheel'),

                icon: this.$map.data('icon'),
                iconSize: this.$map.data('icon-size'),
                iconOrigin: this.$map.data('icon-origin'),
                iconAnchor: this.$map.data('icon-anchor'),

                fitbounds: this.$map.data('fitbounds'),
                fitboundsPadding: this.$map.data('fitbounds-padding'),

                clusters: this.$map.data('clusters'),
                clusterTitle: this.$map.data('cluster-title'),
                clusterCenter: this.$map.data('cluster-center'),
                clusterGridSize: this.$map.data('cluster-grid-size'),
                clusterMinSize: this.$map.data('cluster-min-size'),
                clusterMaxZoom: this.$map.data('cluster-max-zoom'),
                clusterZoomOnClick: this.$map.data('cluster-zoom-on-click'),
                clusterRetina: this.$map.data('cluster-retina'),
                clusterIcon: this.$map.data('cluster-icon'),
                clusterIconSize: this.$map.data('cluster-icon-size'),
                clusterTextColor: this.$map.data('cluster-text-color'),
                clusterTextSize: this.$map.data('cluster-text-size')
            });
        },

        //
        // Google Factory
        //

        createLatLng: function (lat, lng) {
            return new google.maps.LatLng(lat, lng);
        },

        createSize: function (size) {
            size = this.splitNumbers(size);

            return size ? new google.maps.Size(size[0], size[1]) : null;
        },

        createPoint: function (point) {
            point = this.splitNumbers(point);

            return point ? new google.maps.Point(point[0], point[1]) : null;
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
            return value !== null && value !== undefined && value.constructor === Array;
        },

        classExists: function (className) {
            return typeof window[className] === 'function' && typeof window[className].prototype === 'object';
        },

        splitNumbers: function (values) {
            if ( ! values) {
                return null;
            }

            return values.split(',');
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
            this.runUserCallback(this.options.onMapClick, this.map, this.map, event);
        },

        onMarkerClick: function (marker, event) {
            this.runUserCallback(this.options.onMarkerClick, marker, marker, this.map, event);
        },

        onMarkerMouseEnter: function (marker, event) {
            this.runUserCallback(this.options.onMarkerMouseEnter, marker, marker, this.map, event);
        },

        onMarkerMouseLeave: function (marker, event) {
            this.runUserCallback(this.options.onMarkerMouseLeave, marker, marker, this.map, event);
        },

        onMarkerLegendClick: function (event) {
            var marker = $(event.currentTarget).data('marker');
            this.runUserCallback(this.options.onMarkerLegendClick, marker, marker, this.map, event);
        },

        onMarkerLegendMouseEnter: function (event) {
            var marker = $(event.currentTarget).data('marker');
            this.runUserCallback(this.options.onMarkerLegendMouseEnter, marker, marker, this.map, event);
        },

        onMarkerLegendMouseLeave: function (event) {
            var marker = $(event.currentTarget).data('marker');
            this.runUserCallback(this.options.onMarkerLegendMouseLeave, marker, marker, this.map, event);
        },

        onClusterClick: function (cluster) {
            this.runUserCallback(this.options.onClusterClick, cluster, cluster.getMarkers(), cluster, this.map);
        },

        onClusterMouseEnter: function (cluster) {
            this.runUserCallback(this.options.onClusterMouseEnter, cluster, cluster.getMarkers(), cluster, this.map);
        },

        onClusterMouseLeave: function (cluster) {
            this.runUserCallback(this.options.onClusterMouseLeave, cluster, cluster.getMarkers(), cluster, this.map);
        },

        runUserCallback: function (callback, target) {
            if (callback instanceof Function) {
                callback.apply(target, Array.prototype.slice.call(arguments, 2));
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
