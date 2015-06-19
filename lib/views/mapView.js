C("MapView", ["require", "exports", "module"], function (require, exports, module) {

    var mapView;

    var Private = {
        handleInputTopic: function() {
            var topic = this.$mapInput.val();
            this.$mapInput.val('');
            $(document).trigger(mapView.events.change + '-' + this.room.room, [topic]);
        },
        addSelectize: function() {
            this.$mapInput.selectize({
                valueField: 'label',
                labelField: 'id',
                searchField: 'label',
                options: [],
                create: false,
                render: {
                    option: function(map, escape) {

                        return '<div>' +
                            '<span class="title">' +
                                '<span class="name">' + escape(item.label) + '</span>' +
                            '</span>' +
                        '</div>';
                    }
                },
                load: function(query, callback) {
                    if (!query.length) return callback();
                    $.ajax({
                        url: 'http://metamaps.cc/search/maps?term=' + query,
                        type: 'GET',
                        error: function() {
                            callback();
                        },
                        success: function(res) {
                            callback(res.movies);
                        }
                    });
                }
            });
        }
    };

    var Handlers = {
        cancelButtonClick: function() {
            this.$mapInput.val('');
            this.switch();
        },
        saveButtonClick: function() {
            Private.handleInputTopic.call(this);
        },
        editButtonClick: function() {
            this.$mapInput.val('');
            this.switch();
        },
        keyUp: function(event) {
            switch(event.which) {
                case 13: // enter
                  Private.handleInputTopic.call(this);
                  break;
            }
        }
    };

    mapView = function(room) {
        var self = this;

        this.room = room;

        this.map = null; // the id of the map to display
        this.editing = true;
        
        this.$saveButton = $('<button class="map-button save">save</div>');
        this.$cancelButton = $('<button class="map-button cancel">cancel</button>');
        this.$editButton = $('<button class="map-button edit">change map</button>');
        this.$mapInput = $('<input placeholder="Enter a metamap ID..." class="map-input"></input>');

        this.$saveButton.on('click', function () {
            Handlers.saveButtonClick.call(self);
        });
        this.$cancelButton.on('click', function () {
            Handlers.cancelButtonClick.call(self);
        });
        this.$editButton.on('click', function () {
            Handlers.editButtonClick.call(self);
        });
        this.$mapInput.on('keyup', function (event) {
            Handlers.keyUp.call(self, event);
        });

        this.$map = $('<iframe class="map-container"></iframe>');

        this.$editor = $('<div class="map-editor"></div>');
        this.$editor.append(this.$mapInput);
        this.$editor.append(this.$saveButton);
        this.$editor.append(this.$cancelButton);

        this.$container = $('<div class="map-box"></div>');
        this.$container.append(this.$map);
        this.$container.append(this.$editButton);
        this.$container.append(this.$editor);

        //Private.addSelectize.call(this);
    };

    mapView.prototype.setMap = function (map) {
        if (!map) return;
        this.map = map;
        this.$map.attr('src', 'http://metamaps.cc/maps/' + this.map);
        if (this.editing) {
            this.$editor.hide();
            this.$editButton.show();
            this.editing = false;
        }
    }

    mapView.prototype.switch = function () {
        if (this.editing) {
            this.$editor.hide();
            this.$editButton.show();
            this.editing = false;
        } else {
            this.$editor.show();
            this.$editButton.hide();
            this.editing = true;
        }
    }

    /**
     * @class
     * @static
     */
    mapView.events = {
        change: 'MapView:change'
    };

    module.e = mapView;
});