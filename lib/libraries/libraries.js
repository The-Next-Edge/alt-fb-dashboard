C("ioconnection", ["require", "exports", "module"], function (c, k, module) {
  function SocketIoConnection(config) {
      this.connection = io.connect(config.url, config.socketio);
  }

  SocketIoConnection.prototype.on = function (ev, fn) {
      this.connection.on(ev, fn);
  };

  SocketIoConnection.prototype.emit = function () {
      this.connection.emit.apply(this.connection, arguments);
  };

  SocketIoConnection.prototype.getSessionid = function () {
      return this.connection.socket.sessionid;
  };

  SocketIoConnection.prototype.disconnect = function () {
      return this.connection.disconnect();
  };

  module.e = SocketIoConnection;
});

C("attachMediaStream", ["require", "exports", "module"], function (c, k, module) {
  module.e = function (stream, el, options) {
      var URL = window.URL;
      var opts = {
          autoplay: true,
          mirror: false,
          muted: false
      };
      var element = el || document.createElement('video');
      var item;

      if (options) {
          for (item in options) {
              opts[item] = options[item];
          }
      }

      if (opts.autoplay) element.autoplay = 'autoplay';
      if (opts.muted) element.muted = true;
      if (opts.mirror) {
          ['', 'moz', 'webkit', 'o', 'ms'].forEach(function (prefix) {
              var styleName = prefix ? prefix + 'Transform' : 'transform';
              element.style[styleName] = 'scaleX(-1)';
          });
      }

      // this first one should work most everywhere now
      // but we have a few fallbacks just in case.
      if (URL && URL.createObjectURL) {
          element.src = URL.createObjectURL(stream);
      } else if (element.srcObject) {
          element.srcObject = stream;
      } else if (element.mozSrcObject) {
          element.mozSrcObject = stream;
      } else {
          return false;
      }

      return element;
  }
});
var attachMediaStream = function (stream, el, options) {
      var URL = window.URL;
      var opts = {
          autoplay: true,
          mirror: false,
          muted: false
      };
      var element = el || document.createElement('video');
      var item;

      if (options) {
          for (item in options) {
              opts[item] = options[item];
          }
      }

      if (opts.autoplay) element.autoplay = 'autoplay';
      if (opts.muted) element.muted = true;
      if (opts.mirror) {
          ['', 'moz', 'webkit', 'o', 'ms'].forEach(function (prefix) {
              var styleName = prefix ? prefix + 'Transform' : 'transform';
              element.style[styleName] = 'scaleX(-1)';
          });
      }

      // this first one should work most everywhere now
      // but we have a few fallbacks just in case.
      if (URL && URL.createObjectURL) {
          element.src = URL.createObjectURL(stream);
      } else if (element.srcObject) {
          element.srcObject = stream;
      } else if (element.mozSrcObject) {
          element.mozSrcObject = stream;
      } else {
          return false;
      }

      return element;
  };