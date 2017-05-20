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

            iconHover: null, //=> marker icon when hovering over it
            iconHoverSize: null, //=> optional
            iconHoverOrigin: null, //=> optional
            iconHoverAnchor: null, //=> optional

            iconOpen: null, //=> marker icon when info window is open
            iconOpenSize: null, //=> optional
            iconOpenOrigin: null, //=> optional
            iconOpenAnchor: null, //=> optional

            hoverClass: null, //=> class name that is added to a marker element on marker hover
            openClass: null, //=> class name that is added to a marker element when its info window is open

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
            spiderClick: true, //=> handle click event on a marker that triggers spiderfier

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

            // Center marker on $marker hover/click if clustered or not in bounds...
            // Choose: 'hover', 'click', 'hover-always', 'click-always', false
            panToMarker: false,

            // Show info window and center marker on $marker hover/click if clustered or not in bounds...
            // Choose: 'hover', 'click', 'hover-always', 'click-always', false
            triggerInfoWindowOnElement: false,

            // Show info window on marker object hover/click...
            // Choose: 'hover', 'click', false
            triggerInfoWindowOnMarker: 'click',

            closeInfoWindowsOnMapClick: true,
            infoWindowMaxWidth: null,

            // The class to look for under a marker element
            // when auto detecting an info window...
            // This takes the form of $marker.find('.info-window');
            infoWindowChildSelector: '.info-window',

            // The following callbacks are available...
            // The map and marker parameters are the Google Map and Marker objects.
            // You can access the related .map and .marker DOM elements as jQuery objects
            // via the property map.$map and marker.$marker
            onInitialized:             function (map, markers, clusterer, spiderfier) { },
            onMapClick:                function (map, markers, clusterer, spiderfier, event) { },
            onMarkerClick:             function (marker, map, markers, clusterer, spiderfier, event) { },
            onMarkerMouseEnter:        function (marker, map, markers, clusterer, spiderfier, event) { },
            onMarkerMouseLeave:        function (marker, map, markers, clusterer, spiderfier, event) { },
            onMarkerElementClick:      function (marker, map, markers, clusterer, spiderfier, event) { },
            onMarkerElementMouseEnter: function (marker, map, markers, clusterer, spiderfier, event) { },
            onMarkerElementMouseLeave: function (marker, map, markers, clusterer, spiderfier, event) { },
            onClusterClick:            function (clusterMarkers, cluster, map, markers, clusterer, spiderfier) { },
            onClusterMouseEnter:       function (clusterMarkers, cluster, map, markers, clusterer, spiderfier) { },
            onClusterMouseLeave:       function (clusterMarkers, cluster, map, markers, clusterer, spiderfier) { },
            onSpiderMarkerFormat:      function (marker, markerStatus, map, markers, clusterer, spiderfier) { }
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
        this.infoWindows = {}; //=> Google Maps InfoWindow objects

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
            this.openDefaultInfoWindows();
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
            var clickEvent, marker, markerIcons;

            markerIcons = {
                default: this.normalizeIcon('icon', markerOptions),
                hover: this.normalizeIcon('iconHover', markerOptions),
                open: this.normalizeIcon('iconOpen', markerOptions)
            };

            marker = new google.maps.Marker(
                this.removeEmptyObjectProperties({
                    position: this.createLatLng(markerOptions.lat, markerOptions.lng),
                    icon: markerIcons.default,
                    icons: markerIcons,
                    label: markerOptions.label,
                    title: markerOptions.title,
                    infoWindow: markerOptions.infoWindow,
                    infoWindowGroup: markerOptions.infoWindowGroup || 'default',
                    infoWindowOpen: markerOptions.infoWindowOpen,
                    infoWindowMaxWidth: markerOptions.infoWindowMaxWidth,
                    map: this.map
                })
            );

            if (this.isUsingMarkerElements()) {
                marker.$marker = markerOptions.$marker;
                markerOptions.$marker.data('marker', marker);
            }

            // Get any info window content so we don't need to fetch it every time
            marker.infoWindow = this.getInfoWindowContent(marker);

            this.createInfoWindow(marker);

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
                label: $marker.data('label'),
                title: $marker.data('title'),

                icon: $marker.data('icon'),
                iconSize: $marker.data('icon-size'),
                iconOrigin: $marker.data('icon-origin'),
                iconAnchor: $marker.data('icon-anchor'),

                iconHover: $marker.data('icon-hover'),
                iconHoverSize: $marker.data('icon-hover-size'),
                iconHoverOrigin: $marker.data('icon-hover-origin'),
                iconHoverAnchor: $marker.data('icon-hover-anchor'),

                iconOpen: $marker.data('icon-open'),
                iconOpenSize: $marker.data('icon-open-size'),
                iconOpenOrigin: $marker.data('icon-open-origin'),
                iconOpenAnchor: $marker.data('icon-open-anchor'),

                infoWindow: $marker.data('info-window'),
                infoWindowGroup: $marker.data('info-window-group'),
                infoWindowOpen: $marker.data('info-window-open'),
                infoWindowMaxWidth: $marker.data('info-window-max-width'),

                $marker: $marker
            });
        },

        normalizeIcon: function (iconType, markerOptions) {
            var icon = this.removeEmptyObjectProperties({
                url:                         markerOptions[iconType]            || this.options[iconType]            || this.options.icon,
                scaledSize: this.createSize( markerOptions[iconType + 'Size']   || this.options[iconType + 'Size']   || this.options.iconSize),
                origin:     this.createPoint(markerOptions[iconType + 'Origin'] || this.options[iconType + 'Origin'] || this.options.iconOrigin),
                anchor:     this.createPoint(markerOptions[iconType + 'Anchor'] || this.options[iconType + 'Anchor'] || this.options.iconAnchor)
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

                iconHover: this.$map.data('icon-hover'),
                iconHoverSize: this.$map.data('icon-hover-size'),
                iconHoverOrigin: this.$map.data('icon-hover-origin'),
                iconHoverAnchor: this.$map.data('icon-hover-anchor'),

                iconOpen: this.$map.data('icon-open'),
                iconOpenSize: this.$map.data('icon-open-size'),
                iconOpenOrigin: this.$map.data('icon-open-origin'),
                iconOpenAnchor: this.$map.data('icon-open-anchor'),

                hoverClass: this.$map.data('hover-class'),
                openClass: this.$map.data('open-class'),

                panToMarker: this.$map.data('pan-to-marker'),

                closeInfoWindowsOnMapClick: this.$map.data('close-info-windows-on-map-click'),
                triggerInfoWindowOnMarker: this.$map.data('trigger-info-window-on-marker'),
                triggerInfoWindowOnElement: this.$map.data('trigger-info-window-on-element'),
                infoWindowMaxWidth: this.$map.data('info-window-max-width'),

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
        // Pan and Zoom
        //

        isMarkerWithinBounds: function (marker) {
            return this.map.getBounds().contains(marker.position);
        },

        centerMarker: function (marker) {
            this.map.panTo(marker.position);
        },

        goToMarker: function (marker) {
            // The marker needs to be within the bounds,
            // else the clusterer won't set marker.map...
            this.centerMarker(marker);

            // If the marker is clustered, zoom in...
            while (marker.map === null && this.map.getZoom() < 20 && this.clusterer) {
                this.map.setZoom(this.map.getZoom() + 1);

                // Center again if needed, as zooming may have
                // placed the marker outside of the bounds.
                if ( ! this.isMarkerWithinBounds(marker)) {
                    this.centerMarker(marker);
                }

                // Clusters are updated/repainted when
                // Google Maps triggers the 'idle' event.
                // So force a repaint...
                this.clusterer.repaint();
            }
        },

        //
        // Info Window
        //

        createInfoWindow: function (marker) {
            var infoWindow;

            // Create an InfoWindow instance for the specified group if it does not already exist
            if (marker.infoWindow === null || this.infoWindows[marker.infoWindowGroup] !== undefined) {
                return;
            }

            infoWindow = new google.maps.InfoWindow();

            infoWindow.addListener('closeclick', function () {
                this.closeInfoWindow(infoWindow);
            }.bind(this));

            this.infoWindows[marker.infoWindowGroup] = infoWindow;
        },

        openInfoWindow: function (marker) {
            var infoWindow, maxWidth;

            this.closeInfoWindows(marker);

            if ( ! marker.infoWindow) {
                return;
            }

            infoWindow = this.infoWindows[marker.infoWindowGroup];
            maxWidth = marker.infoWindowMaxWidth || this.options.infoWindowMaxWidth;

            if (maxWidth) {
                infoWindow.setOptions({
                    maxWidth: maxWidth
                });
            }

            if (marker.icons.open) {
                marker.setIcon(marker.icons.open);
            }

            marker.isInfoWindowOpen = true;

            this.addMarkerElementOpenClass(marker);

            infoWindow.marker = marker;
            infoWindow.setContent(marker.infoWindow);
            infoWindow.open(this.map, marker);
        },

        closeInfoWindows: function (marker) {
            this.closeInfoWindow(this.infoWindows[marker.infoWindowGroup]);
        },

        closeAllInfoWindows: function () {
            $.each(this.infoWindows, function (index, infoWindow) {
                this.closeInfoWindow(infoWindow);
            }.bind(this));
        },

        closeInfoWindow: function (infoWindow) {
            if ( ! infoWindow) {
                return;
            }

            if (infoWindow.marker) {
                infoWindow.marker.isInfoWindowOpen = false;
                infoWindow.marker.setIcon(infoWindow.marker.icons.default);
                this.removeMarkerElementOpenClass(infoWindow.marker);
            }

            infoWindow.marker = null;
            infoWindow.close();
        },

        openDefaultInfoWindows: function () {
            var openedInfoWindowGroups = [];
            $.each(this.markers, function (index, marker) {
                if (this.shouldOpenInfoWindowOnLoad(marker, openedInfoWindowGroups)) {
                    openedInfoWindowGroups.push(marker.infoWindowGroup);
                    this.openInfoWindow(marker);
                }
            }.bind(this));
        },

        shouldOpenInfoWindowOnLoad: function (marker, openedInfoWindowGroups) {
            return openedInfoWindowGroups.indexOf(marker.infoWindowGroup) === -1
                && marker.infoWindowOpen === true
                && marker.infoWindow;
        },

        //
        // Info Window Content
        //

        getInfoWindowContent: function (marker) {
            var content = null;

            if (this.isString(marker.infoWindow)) {
                content = this.getInfoWindowContentFromMarkerOption(marker.infoWindow.trim());
            }

            return content || this.getInfoWindowContentFromChildElement(marker.$marker);
        },

        getInfoWindowContentFromMarkerOption: function (infoWindowContent) {
            if (infoWindowContent.substr(0, 1) === '.' || infoWindowContent.substr(0, 1) === '#') {
                return $(infoWindowContent).html() || null;
            }

            return infoWindowContent.length > 0 ? infoWindowContent : null;
        },

        getInfoWindowContentFromChildElement: function ($marker) {
            if ($marker) {
                return $marker.find(this.options.infoWindowChildSelector).html() || null;
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
        // Marker Element Classes
        //

        addMarkerElementHoverClass: function (marker) {
            if (this.options.hoverClass && marker.$marker) {
                marker.$marker.addClass(this.options.hoverClass);
            }
        },

        removeMarkerElementHoverClass: function (marker) {
            if (this.options.hoverClass && marker.$marker) {
                marker.$marker.removeClass(this.options.hoverClass);
            }
        },

        addMarkerElementOpenClass: function (marker) {
            if (this.options.openClass && marker.$marker) {
                marker.$marker.addClass(this.options.openClass);
            }
        },

        removeMarkerElementOpenClass: function (marker) {
            if (this.options.openClass && marker.$marker) {
                marker.$marker.removeClass(this.options.openClass);
            }
        },

        //
        // Event Conditionals
        //

        shouldPanToMarker: function (eventName, marker) {
            return this.shouldAlwaysPanToMarker(eventName)
                || this.shouldPanToMarkerBecauseClusteredOrOutOfBounds(eventName, marker);
        },

        shouldAlwaysPanToMarker: function (eventName) {
            return this.options.panToMarker === eventName + '-always'
                || this.options.triggerInfoWindowOnElement === eventName + '-always';
        },

        shouldPanToMarkerBecauseClusteredOrOutOfBounds: function (eventName, marker) {
            return (this.options.panToMarker === eventName || this.options.triggerInfoWindowOnElement === eventName)
                && (marker.map === null || ! this.isMarkerWithinBounds(marker));
        },

        shouldOpenInfoWindowOnElementEvent: function (eventName) {
            return this.options.triggerInfoWindowOnElement === eventName
                || this.options.triggerInfoWindowOnElement === eventName + '-always';
        },

        //
        // Map Events
        //

        onInitialized: function () {
            this.runUserCallback(this.options.onSpiderMarkerFormat, this.map, this.map, this.markers, this.clusterer, this.spiderfier);
        },

        onMapClick: function (event) {
            if (this.options.closeInfoWindowsOnMapClick === true) {
                this.closeAllInfoWindows();
            }
            this.runUserCallback(this.options.onMapClick, this.map, this.map, this.markers, this.clusterer, this.spiderfier, event);
        },

        //
        // Marker Object Events
        //

        onMarkerClick: function (marker, event) {
            if (this.options.triggerInfoWindowOnMarker === 'click') {
                this.openInfoWindow(marker);
            }

            this.runUserCallback(this.options.onMarkerClick, marker, marker, this.map, this.markers, this.clusterer, this.spiderfier, event);
        },

        onMarkerMouseEnter: function (marker, event) {
            if (this.options.triggerInfoWindowOnMarker === 'hover') {
                this.openInfoWindow(marker);
            }

            if (marker.icons.hover) {
                marker.setIcon(marker.icons.hover);
            }

            this.addMarkerElementHoverClass(marker);

            this.runUserCallback(this.options.onMarkerMouseEnter, marker, marker, this.map, this.markers, this.clusterer, this.spiderfier, event);
        },

        onMarkerMouseLeave: function (marker, event) {
            var icon;

            if (this.options.triggerInfoWindowOnMarker === 'hover') {
                this.closeInfoWindows(marker);
            }

            if (marker.icons.hover) {
                icon = marker.isInfoWindowOpen ? 'open': 'default';
                marker.setIcon(marker.icons[icon]);
            }

            this.removeMarkerElementHoverClass(marker);

            this.runUserCallback(this.options.onMarkerMouseLeave, marker, marker, this.map, this.markers, this.clusterer, this.spiderfier, event);
        },

        //
        // Marker Element Events
        //

        onMarkerElementClick: function (event) {
            var marker = $(event.currentTarget).data('marker');
            this.handleMarkerElementEvent('click', marker, event);
            this.runUserCallback(this.options.onMarkerElementClick, marker, marker, this.map, this.markers, this.clusterer, this.spiderfier, event);
        },

        onMarkerElementMouseEnter: function (event) {
            var marker = $(event.currentTarget).data('marker');

            if (marker.icons.hover) {
                marker.setIcon(marker.icons.hover);
            }

            this.addMarkerElementHoverClass(marker);

            this.handleMarkerElementEvent('hover', marker, event);
            this.runUserCallback(this.options.onMarkerElementMouseEnter, marker, marker, this.map, this.markers, this.clusterer, this.spiderfier, event);
        },

        onMarkerElementMouseLeave: function (event) {
            var marker = $(event.currentTarget).data('marker'),
                icon;

            if (marker.icons.hover) {
                icon = marker.isInfoWindowOpen ? 'open' : 'default';
                marker.setIcon(marker.icons[icon]);
            }

            this.removeMarkerElementHoverClass(marker);

            if (this.shouldOpenInfoWindowOnElementEvent('hover')) {
                this.closeInfoWindows(marker);
            }

            this.runUserCallback(this.options.onMarkerElementMouseLeave, marker, marker, this.map, this.markers, this.clusterer, this.spiderfier, event);
        },

        handleMarkerElementEvent: function (eventName, marker, event) {
            if (this.shouldPanToMarker(eventName, marker)) {
                event.preventDefault();
                this.goToMarker(marker);
            }

            if (this.shouldOpenInfoWindowOnElementEvent(eventName)) {
                event.preventDefault();
                this.closeInfoWindows(marker);
                // Don't open the info window if the marker is still
                // clustered and thus not shown on the map...
                if (marker.map !== null) {
                    this.openInfoWindow(marker);
                }
            }
        },

        //
        // Cluster Events
        //

        onClusterClick: function (cluster) {
            this.runUserCallback(this.options.onClusterClick, cluster, cluster.getMarkers(), cluster, this.map, this.markers, this.clusterer, this.spiderfier);
        },

        onClusterMouseEnter: function (cluster) {
            this.runUserCallback(this.options.onClusterMouseEnter, cluster, cluster.getMarkers(), cluster, this.map, this.markers, this.clusterer, this.spiderfier);
        },

        onClusterMouseLeave: function (cluster) {
            this.runUserCallback(this.options.onClusterMouseLeave, cluster, cluster.getMarkers(), cluster, this.map, this.markers, this.clusterer, this.spiderfier);
        },

        //
        // Spider Events
        //

        onSpiderMarkerFormat: function (marker, markerStatus) {
            this.runUserCallback(this.options.onSpiderMarkerFormat, marker, marker, markerStatus, this.map, this.markers, this.clusterer, this.spiderfier);
        },

        //
        // Callback Handler
        //

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
