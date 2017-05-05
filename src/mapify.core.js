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
            backgroundColor: '#ffffff', //=> background color of the map, visible when tiles are not yet loaded

            // Possible map types: (accepts an array or comma separated string)
            // - 'roadmap'
            // - 'terrain' //=> this is actually a sub menu of roadmap
            // - 'satellite'
            // - 'hybrid' //=> this is actually a sub menu of satellite
            mapTypes: ['roadmap'],

            // Possible controls: (accepts an array or comma separated string)
            // - 'zoom'
            // - 'fullscreen'
            // - 'streetview'
            // - 'rotate'
            // - 'scale'
            // The mapTypeControl is enabled automatically if you set more than one mapType.
            controls: ['zoom'],

            // Custom map styles...
            // Find premade themes on https://snazzymaps.com/
            styles: null,

            // Gesture handling...
            // - 'none':        The map cannot be panned or zoomed by user gestures.
            // - 'greedy':      All touch gestures pan or zoom the map.
            // - 'cooperative': Two-finger touch gestures pan and zoom the map.
            //                  One-finger touch gestures are not handled by the map.
            //                  In this mode, the map cooperates with the page,
            //                  so that one-finger touch gestures can pan the page.
            // - 'auto':        Gesture handling is either cooperative or greedy,
            //                  depending on whether the page is scrollable or not.
            gestures: 'cooperative',

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

            spiderfy: true, //=> enable marker spiderfier?
            spiderClick: false, //=> handle click event on a marker that triggers spiderfier

            // Add official or custom map types...
            spiderLegColors: {
                roadmap: '#444',
                terrain: '#444',
                satellite: '#fff',
                hybrid: '#fff'
            },
            spiderLegColorsHighlighted: {
                roadmap: '#f00',
                terrain: '#f00',
                satellite: '#f00',
                hybrid: '#f00'
            },

            spiderfierOptions: {
                markersWontMove: true, //=> set true for performance if markers will not be moved
                markersWontHide: false, //=> set true for performance if markers will not be hidden
                keepSpiderfied: true, //=> keep spider open when one of its markers is clicked
                ignoreMapClick: false, //=> keep spider open when the map is clicked
                nearbyDistance: 20,
                circleSpiralSwitchover: 9,
                legWeight: 2,

                // With the "onSpiderMarkerFormat" event handler you can manipulate
                // the marker based on its spider state (spiderfied/unspiderfied/...).
                //
                // Set this option to true if you only need to detect
                // the "SPIDERFIED" and (initial) "UNSPIDERFIED" state changes.
                // This will trigger the event on each affected marker when
                // it is spiderfied and unspiderfied.
                //
                // Set this option to false if you need to detect
                // the "SPIDERFIED", "SPIDERFIABLE" and "UNSPIDERFIABLE" states.
                // This will **additionally** trigger the event on every marker
                // when the map loads and zoom level changes.
                // So setting this option to true is a performance boost!
                basicFormatEvents: true
            },

            // The following callbacks are available...
            // The map and marker parameters are the Google Map and Marker objects.
            // You can access the related .map and .marker DOM elements as jQuery objects
            // via the property map.$map and marker.$marker
            onInitialized:             function (map, markers, clusterer, spiderfier) { },
            onMapClick:                function (map, event) { },
            onMarkerClick:             function (marker, map, event) { },
            onMarkerMouseEnter:        function (marker, map, event) { },
            onMarkerMouseLeave:        function (marker, map, event) { },
            onMarkerElementClick:      function (marker, map, event) { },
            onMarkerElementMouseEnter: function (marker, map, event) { },
            onMarkerElementMouseLeave: function (marker, map, event) { },
            onClusterClick:            function (markers, cluster, map) { },
            onClusterMouseEnter:       function (markers, cluster, map) { },
            onClusterMouseLeave:       function (markers, cluster, map) { },
            onSpiderMarkerFormat:      function (marker, markerStatus, map) { }
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
        this.clusterer = null; //=> Google MarkerClusterer object
        this.spiderfier = null; //=> OverlappingMarkerSpiderfier object
        this.infoWindow = new google.maps.InfoWindow();

        this.init();
    }

    $.extend(Plugin.prototype, {

        init: function () {
            this.normalizeOptions();
            this.createMap();
            this.enableSpiderfier();
            this.createMarkers();
            this.setMapOptions();
            this.fitBounds();
            this.enableClusters();
            this.onInitialized();
        },

        normalizeOptions: function () {
            this.options.mapTypes = this.convertOptionToArray(this.options.mapTypes, ['roadmap'],
                function (mapType) {
                    return google.maps.MapTypeId[mapType.toUpperCase()] || mapType;
                }
            );
            this.options.controls = this.convertOptionToArray(this.options.controls, [],
                function (control) {
                    return control.toLowerCase();
                }
            );
        },

        convertOptionToArray: function (option, defaultValue, conversionCallable) {
            if (this.isEmpty(option)) {
                option = defaultValue;
            }

            if ( ! this.isArray(option)) {
                option = this.splitValues(option);
            }

            return option.map(conversionCallable);
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
                    .on('click',      this.options.markers, this.onMarkerElementClick.bind(this))
                    .on('mouseenter', this.options.markers, this.onMarkerElementMouseEnter.bind(this))
                    .on('mouseleave', this.options.markers, this.onMarkerElementMouseLeave.bind(this));
            }
        },

        createMarker: function (markerOptions) {
            var clickEvent, marker;

            marker = new google.maps.Marker(
                this.removeEmptyObjectProperties({
                    position: this.createLatLng(markerOptions.lat, markerOptions.lng),
                    icon: this.normalizeIcon(markerOptions),
                    label: markerOptions.label,
                    title: markerOptions.title,
                    infoWindow: markerOptions.infoWindow,
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

            if (this.spiderfier !== null) {
                this.spiderfier.trackMarker(marker);
            }

            clickEvent = this.shouldHandleClickOnSpiderfy() ? 'click' : 'spider_click';

            marker.addListener(clickEvent,  function(event) { this.onMarkerClick(marker, event);      }.bind(this));
            marker.addListener('mouseover', function(event) { this.onMarkerMouseEnter(marker, event); }.bind(this));
            marker.addListener('mouseout',  function(event) { this.onMarkerMouseLeave(marker, event); }.bind(this));
        },

        setMapOptions: function () {
            this.map.setOptions(
                this.removeEmptyObjectProperties({
                    center: this.getMapCenterPosition(),
                    gestureHandling: this.options.gestures,
                    zoom: this.options.zoom,
                    scrollwheel: this.options.scrollwheel,
                    backgroundColor: this.options.backgroundColor,
                    styles: this.options.styles,
                    mapTypeId: this.options.mapTypes[0],
                    // Controls...
                    mapTypeControl: this.options.mapTypes.length > 1,
                    zoomControl: this.isControlEnabled('zoom'),
                    fullscreenControl: this.isControlEnabled('fullscreen'),
                    streetViewControl: this.isControlEnabled('streetview'),
                    rotateControl: this.isControlEnabled('rotate'),
                    scaleControl: this.isControlEnabled('scale'),
                    // Control options...
                    mapTypeControlOptions: {
                        mapTypeIds: this.options.mapTypes
                    }
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

        //
        // Spiderfier
        //
        // Requires vendor/oms.js (OverlappingMarkerSpiderfier)
        // Docs: https://github.com/jawj/OverlappingMarkerSpiderfier
        //

        enableSpiderfier: function () {
            if (this.shouldDisableSpiderfier()) {
                return;
            }

            this.spiderfier = new OverlappingMarkerSpiderfier(this.map, this.options.spiderfierOptions);

            $.each(this.options.mapTypes, function (index, mapTypeId) {
                this.spiderfier.legColors.usual[mapTypeId] = this.options.spiderLegColors[mapTypeId] || '#444';
                this.spiderfier.legColors.highlighted[mapTypeId] = this.options.spiderLegColorsHighlighted[mapTypeId] || '#f00';
            }.bind(this));

            this.spiderfier.addListener('format', this.onSpiderMarkerFormat.bind(this));
        },

        shouldDisableSpiderfier: function () {
            return ! this.classExists('OverlappingMarkerSpiderfier') || this.options.spiderfy === false;
        },

        shouldHandleClickOnSpiderfy: function () {
            return this.spiderfier === null || this.options.spiderClick === true;
        },

        //
        // Clusters
        //
        // Requires vendor/markerclusterer.js (Google Maps MarkerClustererPlus)
        // Docs: http://htmlpreview.github.io/?https://github.com/googlemaps/v3-utility-library/blob/master/markerclustererplus/docs/reference.html
        //

        enableClusters: function () {
            if (this.shouldDisableClusters()) {
                return;
            }

            this.clusterer = new MarkerClusterer(this.map, this.markers, {
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

            this.clusterer.addListener('click', this.onClusterClick.bind(this));
            this.clusterer.addListener('mouseover', this.onClusterMouseEnter.bind(this));
            this.clusterer.addListener('mouseout', this.onClusterMouseLeave.bind(this));
        },

        shouldDisableClusters: function () {
            return ! this.classExists('MarkerClusterer') || this.options.clusters === false || this.markers.length < 2;
        },

        getClustersIconStyles: function () {
            if (this.isArray(this.options.clusterIcons)) {
                return this.options.clusterIcons;
            }

            var clusterIconSize = this.splitValues(this.options.clusterIconSize);

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

            if (this.isArray(this.options.markers)) {
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
                infoWindow: $marker.data('info-window'),
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
                backgroundColor: this.$map.data('background-color'),
                mapType: this.$map.data('map-type'),
                gestures: this.$map.data('gestures'),
                zoom: this.$map.data('zoom'),
                scrollwheel: this.$map.data('scrollwheel'),
                controls: this.$map.data('controls'),

                icon: this.$map.data('icon'),
                iconSize: this.$map.data('icon-size'),
                iconOrigin: this.$map.data('icon-origin'),
                iconAnchor: this.$map.data('icon-anchor'),

                fitbounds: this.$map.data('fitbounds'),
                fitboundsPadding: this.$map.data('fitbounds-padding'),

                spiderfy: this.$map.data('spiderfy'),
                spiderClick: this.$map.data('spider-click'),

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
        // InfoWindow
        //

        closeInfoWindow: function () {
            this.infoWindow.close();
        },

        openInfoWindow: function (marker) {
            var content = this.getInfoWindowContent(marker);

            this.closeInfoWindow();

            if (content !== null) {
                this.infoWindow.setContent(content);
                this.infoWindow.open(this.map, marker);
            }
        },

        getInfoWindowContent: function (marker) {
            var content = null;

            if (this.isString(marker.infoWindow)) {
                content = this.getInfoWindowSelectorContent(marker.infoWindow.trim());
            }

            return content || this.getInfoWindowChildElementContent(marker.$marker);
        },

        getInfoWindowSelectorContent: function (infoWindowContent) {
            if (infoWindowContent.substr(0, 1) === '.' || infoWindowContent.substr(0, 1) === '#') {
                return $(infoWindowContent).html() || null;
            }

            return infoWindowContent.length > 0 ? infoWindowContent : null;
        },

        getInfoWindowChildElementContent: function ($marker) {
            if ($marker) {
                return $marker.find('.info-window').html() || null;
            }

            return null;
        },

        //
        // Google Factory
        //

        createLatLng: function (lat, lng) {
            return new google.maps.LatLng(lat, lng);
        },

        createSize: function (size) {
            size = this.splitValues(size);

            return size ? new google.maps.Size(size[0], size[1]) : null;
        },

        createPoint: function (point) {
            point = this.splitValues(point);

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

        isControlEnabled: function (control) {
            return this.options.controls.indexOf(control) > -1;
        },

        isEmpty: function (value) {
            return value === null || value === undefined || value.length === undefined || value.length === 0;
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

        splitValues: function (values) {
            if ( ! values) {
                return null;
            }

            values = values.split(',');

            return values.map(function (value) {
                return value.trim();
            });
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
            this.closeInfoWindow();
            this.runUserCallback(this.options.onMapClick, this.map, this.map, event);
        },

        onMarkerClick: function (marker, event) {
            this.openInfoWindow(marker);
            this.runUserCallback(this.options.onMarkerClick, marker, marker, this.map, event);
        },

        onMarkerMouseEnter: function (marker, event) {
            this.runUserCallback(this.options.onMarkerMouseEnter, marker, marker, this.map, event);
        },

        onMarkerMouseLeave: function (marker, event) {
            this.runUserCallback(this.options.onMarkerMouseLeave, marker, marker, this.map, event);
        },

        onMarkerElementClick: function (event) {
            var marker = $(event.currentTarget).data('marker');
            this.runUserCallback(this.options.onMarkerElementClick, marker, marker, this.map, event);
        },

        onMarkerElementMouseEnter: function (event) {
            var marker = $(event.currentTarget).data('marker');
            this.runUserCallback(this.options.onMarkerElementMouseEnter, marker, marker, this.map, event);
        },

        onMarkerElementMouseLeave: function (event) {
            var marker = $(event.currentTarget).data('marker');
            this.runUserCallback(this.options.onMarkerElementMouseLeave, marker, marker, this.map, event);
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

        onSpiderMarkerFormat: function (marker, markerStatus) {
            this.runUserCallback(this.options.onSpiderMarkerFormat, marker, marker, markerStatus, this.map);
        },

        onInitialized: function () {
            this.runUserCallback(this.options.onSpiderMarkerFormat, this.map, this.map, this.markers, this.clusterer, this.spiderfier);
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
