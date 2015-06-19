C("RoomTopicView", ["require", "exports", "module"], function (require, exports, module) {

    var roomTopicView;

    var Private = {
        handleInputTopic: function() {
            var topic = this.$topicInput.val();
            this.$topicInput.val('');
            $(document).trigger(roomTopicView.events.change + '-' + this.room.room, [topic]);
        }
    };

    var Handlers = {
        cancelButtonClick: function() {
            this.$topicInput.val('');
            this.switch();
        },
        saveButtonClick: function() {
            Private.handleInputTopic.call(this);
        },
        editButtonClick: function() {
            this.$topicInput.val('');
            this.switch();
        },
        keyUp: function(event) {
            switch(event.which) {
                case 13: // enter
                  Private.handleInputTopic.call(this);
                  break;
            }
        },
        inputFocus: function() {
            $(document).trigger(roomTopicView.events.inputFocus);
        },
        inputBlur: function() {
            $(document).trigger(roomTopicView.events.inputBlur);
        }
    };

    roomTopicView = function(room) {
        var self = this;

        this.room = room;

        this.topic = "";
        this.editing = true;
        
        this.$saveButton = $('<button class="topic-button save">save</div>');
        this.$cancelButton = $('<button class="topic-button cancel">cancel</button>');
        this.$editButton = $('<button class="topic-button edit">change room topic</button>');
        this.$topicInput = $('<input placeholder="Enter a topic..." class="topic-input"></input>');
        this.$title = $('<div class="topic-title"></div>');

        this.$saveButton.on('click', function () {
            Handlers.saveButtonClick.call(self);
        });
        this.$cancelButton.on('click', function () {
            Handlers.cancelButtonClick.call(self);
        });
        this.$editButton.on('click', function () {
            Handlers.editButtonClick.call(self);
        });
        this.$topicInput.on('keyup', function (event) {
            Handlers.keyUp.call(self, event);
        });

        this.$topicInput.on('focus', function () {
            Handlers.inputFocus.call(self);
        });
        this.$topicInput.on('blur', function () {
            Handlers.inputBlur.call(self);
        });

        this.$editor = $('<div class="topic-editor"></div>');
        this.$editor.append(this.$topicInput);
        this.$editor.append(this.$saveButton);
        this.$editor.append(this.$cancelButton);

        this.$display = $('<div class="topic-display"></div>').hide();
        this.$display.append(this.$title);
        this.$display.append(this.$editButton);

        this.$container = $('<div class="topic-box"></div>');
        this.$container.append(this.$editor);
        this.$container.append(this.$display);
    };

    roomTopicView.prototype.setTopic = function (topic) {
        if (!topic || topic == "") return;
        this.topic = topic;
        this.$title.html(this.topic);
        if (this.editing) {
            this.$editor.hide();
            this.$display.show();
            this.editing = false;
        }
    }

    roomTopicView.prototype.switch = function () {
        if (this.editing) {
            this.$editor.hide();
            this.$display.show();
            this.editing = false;
        } else {
            this.$display.hide();
            this.$editor.show();
            this.editing = true;
        }
    }

    /**
     * @class
     * @static
     */
    roomTopicView.events = {
        change: 'RoomTopicView:change',
        inputFocus: 'RoomTopicView:inputFocus',
        inputBlur: 'RoomTopicView:inputBlur'
    };

    module.e = roomTopicView;
});

    