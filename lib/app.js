var $ = jQuery;
var app;
var rooms = new Array(120);

// tracking with ga
// window._gaq && _gaq.push(["_trackEvent", "sign-up", "show", , , w])


// can't run because browser doesn't have webkitcssmatrix
// if (!("WebKitCSSMatrix" in window) || !("m11" in new WebKitCSSMatrix)) window.location.pathname = "/c" + window.location.pathname;


///////
///////
///////
// ACTUAL APP
///////

//<a class="twitter-timeline" href="https://twitter.com/hashtag/corgi" data-widget-id="589798852925988864">#corgi Tweets</a>
//<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>

C("twitterWidget", ["require", "exports", "module"], function (c, k, module) {
  
  function widget(hashtag) {

  }

  module.e = widget;
});


// room overviews
C("smallSurface", ["require", "exports", "module", "0/c"], function (require, k, module) {
  
  var contentTemplate = '<div class="number"><%= peopleCount %> <%= peoplePlural %></div><div class="symbol"><%= topic %></div><div class="name"><%= description %></div><div class="mass"><%= spectatorCount %> spectator<%= spectatorPlural %></div>'
  var Surface = require('0/c');
      
  function small(topic, description, alpha) {
    
    this.topic = topic;
    this.description = description;
    this.peopleCount = 0;
    this.spectatorCount = 0;

    this.topicSet = false;

    this.template = _.template(contentTemplate);
    this.colors = [
      "rgba(73,160,154," + alpha + ")",
      "rgba(170,131,57," + alpha + ")",
      "rgba(167,56,61," + alpha + ")"
    ];

    this.surface = new Surface([256, 192]);
    // .j = .addClass
    this.surface.j("periodic-item");
    
    this.updateContent();
    this.setState(0);
  }

  small.prototype.updateContent = function() {
    // .R = .addContent
    this.surface.R(this.template({ 
      peopleCount: this.peopleCount,
      peoplePlural: this.peopleCount == 1 ? 'person' : 'people',
      spectatorCount: this.spectatorCount,
      spectatorPlural: this.spectatorCount == 1 ? '' : 's',
      topic: this.topic,
      description: this.description
    }));
  }

  small.prototype.setPeopleCount = function(count) {
    this.peopleCount = count;
    this.updateContent();
    this.updateState();
  }

  small.prototype.setSpectatorCount = function(count) {
    this.spectatorCount = count;
    this.updateContent();
  }

  small.prototype.setTopic = function(topic) {
    this.topic = topic;
    this.topicSet = true;
    this.updateContent();
    this.updateState();
  }

  small.prototype.setDescription = function(description) {
    this.description = description;
    this.updateContent();
  }

  small.prototype.setState = function(state) {
    // 0 means empty, 1 means topic set, 2 means active
    this.state = state;
    // .Bb = .addStyle
    this.surface.Bb({
      backgroundColor: this.colors[this.state]
    });
  }

  small.prototype.updateState = function() {
    // 0 means empty, 1 means topic set, 2 means active
    if (this.peopleCount > 0) this.setState(2);
    else if (this.topicSet) this.setState(1);
    else this.setState(0);
  }

  module.e = small;
});

  

C("auth", ["require", "exports", "module"], function (c, k, module) {
  function auth(firebase, provider, callback) {
    firebase.authWithOAuthRedirect(provider, function(error) {
      if (error) {
        callback(error);
      }
    });
  }

  module.e = auth;
});



C("createRooms", ["require", "exports", "module", "Room"], function (require, exports, module) {

  var Room = require("Room");

  function getUsername(user, provider) {
    if (provider === 'twitter') return user.username;
    else if (provider === 'google') return user.displayName;
  }

  function getImage(user, provider) {
    if (provider === 'twitter') return user.cachedUserProfile.profile_image_url;
    else if (provider === 'google') return user.cachedUserProfile.picture;
  }

  function start(opts, provider, callback) {
    opts.firebase.child('rooms').once('value', function (snap) {
      var rms = snap.val();
      
      rms.forEach(function (room, index) {
        var newRoom = new Room({
          webrtc: opts.webrtc,
          firebase: opts.firebase.child('rooms').child(index),
          socket: opts.socket,
          username: getUsername(opts.user, provider),
          image: getImage(opts.user, provider),
          room: index.toString(), 
          $video: opts.myVideo.$video,
          myVideoView: opts.myVideo.view,
          config: { DOUBLE_CLICK_TOLERANCE: 200 }
        });
        rooms[index].room = newRoom;

        opts.firebase.child('rooms').child(index).child('topic').on('value', function(snap) {
          if (snap.val() !== "") rooms[index].smallSurface.setTopic(snap.val());
        });
      });
    });
  }

  module.e = start;
});

C("localVideo", ["require", "exports", "module", "VideoView"], function (require, exports, module) {

  var VideoView = require("VideoView");

  function localVideo(opts, callback) {
    var
      $video = $('<video></video>').attr('id', opts.id),
      localVideo = {
        $video: $video,
        view: new VideoView($video[0], $('body'), 'me', true, { DOUBLE_CLICK_TOLERANCE: 200 }),     
      };
    return localVideo;
  }

  module.e = localVideo;
});


// C = define

/// the elements code
C("Elements", {
  xf: "H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Rv Fl Uup Lv Uus Ur Un Ft".split(" "),
  uf: {
    Ag: [0, 5, 6, 7, 14, 15, 33],
    zg: [1, 9, 17, 35, 53, 85, 117],
    tg: [8, 16, 34, 52, 84, 116],
    xg: [4, 13, 31, 32, 50, 51, 83],
    Ib: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
      38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 71, 72, 73, 74, 75, 76, 77, 78, 79, 103, 104, 105, 106, 107, 108, 109, 110, 111
    ],
    Cg: [12, 30, 48, 49, 80, 81, 82, 112, 113, 114, 115],
    lg: [2, 10, 18, 36, 54, 86],
    mg: [3, 11, 19, 37, 55, 87],
    vg: [56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70],
    kg: [88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102]
  },
  wf: "Hydrogen Helium Lithium Beryllium Boron Carbon Nitrogen Oxygen Fluorine Neon Sodium Magnesium Aluminium Silicon Phosphorus Sulfur Chlorine Argon Potassium Calcium Scandium Titanium Vanadium Chromium Manganese Iron Cobalt Nickel Copper Zinc Gallium Germanium Arsenic Selenium Bromine Krypton Rubidium Strontium Yttrium Zirconium Niobium Molybdenum Technetium Ruthenium Rhodium Palladium Silver Cadmium Indium Tin Antimony Tellurium Iodine Xenon Cesium Barium Lanthanum Cerium Praseodymium Neodymium Promethium Samarium Europium Gadolinium Terbium Dysprosium Holmium Erbium Thulium Ytterbium Lutetium Hafnium Tantalum Tungsten Rhenium Osmium Iridium Platinum Gold Mercury Thallium Lead Bismuth Polonium Astatine Radon Francium Radium Actinium Thorium Protactinium Uranium Neptunium Plutonium Americium Curium Berkelium Californium Einsteinium Fermium Mendelevium Nobelium Lawrencium Rutherfordium Dubnium Seaborgium Bohrium Hassium Meitnerium Darmstadtium Roentgenium Copernicium Ravikantium Flerovium Ununpentium Livermorium Ununseptium Urasium Unrealium Fictitium".split(" "),
  vf: "1.008;4.003;6.941;9.012;10.812;12.011;14.007;15.999;18.998;20.180;22.990;24.305;26.982;28.086;30.974;32.066;35.453;39.948;39.098;40.078;44.956;47.867;50.942;51.996;54.938;55.845;58.933;58.693;63.546;65.382;69.723;72.631;74.922;78.963;79.904;83.798;85.468;87.621;88.906;91.224;92.906;95.962;(98);101.072;102.916;106.421;107.868;112.411;114.818;118.712;121.760;127.603;126.904;131.294;132.905;137.328;138.905;140.116;140.908;144.242;(145);150.362;151.964;157.253;158.925;162.500;164.930;167.259;168.934;173.055;174.967;178.492;180.948;183.841;186.207;190.233;192.217;195.085;196.967;200.592;204.383;207.21;208.980;(209);(210);(222);(223);(226);(227);232.038;231.036;238.029;(237);(244);(243);(247);(247);(251);(252);(257);(258);(259);(262);(267);(268);(269);(270);(269);(278);(281);(281);(285);(123);(289);(288);(293);(294);(456);(789);(432)".split(";")
});



C("app", "require exports module RoomTopicView ChatView smallSurface auth createRooms localVideo ioconnection 0/4 0/c 0/2 0/9 0/e 0/f 0/1 0/5 0/7 0/6 0/g 1/i 1/j 1/s 1/r 1/p 1/l 1/q 1/n 1/o 1/m 3/14 3/15 3/16 3/19 3/1a 6/1i 6/1k 6/1j 2/z 4/1d 4/1c Elements".split(" "), function(c, something, module) {
  
  var begin = function(firebase, socketUrl) {

    var
      ChatView = c('ChatView'),
      RoomTopicView = c('RoomTopicView'),
      IOconnection = c("ioconnection"),
      authUser = firebase.getAuth() || null,
      videoId = 'video-wrapper',
      localVideo = c("localVideo")({ id: videoId }),
      socket = new IOconnection({ url: socketUrl }),
      webrtc = new SimpleWebRTC({
        connection: socket,
        localVideoEl: videoId,
        remoteVideosEl: '',
        detectSpeakingEvents: true,
        autoAdjustMic: true,
        autoRequestMedia: false,
        localVideo: {
            autoplay: true,
            mirror: true,
            muted: true
        },
        media: {
          video: true,
          audio: true
        }
      });
      app = {
        activeRoom: -1,
        stats: {
          activeRooms: 0,
          activePeople: 0
        },
        webrtc: webrtc,
        localVideo: localVideo,
        readyToCall: false,
        globalMessages: new Backbone.Collection(),
        globalChat: null
      };

    firebase.child('global').child('messages').on('child_added', function (snap) {
      app.globalMessages.add(snap.val());
    });

    socket.on('presence', function(presence) {
      if (app.globalChat) {
        app.globalChat.addParticipant(presence);
      }
    });
    socket.on('vacated', function(profile) {
      if (app.globalChat) {
        app.globalChat.removeParticipant(profile.username);
      }
    });
    socket.on('presence_room', function(presence) {
      if (rooms[presence.room_id]) {
        rooms[presence.room_id].room.chat.addParticipant(presence.profile);
      }
    });
    socket.on('vacated_room', function(presence) {
      if (rooms[presence.room_id]) {
        rooms[presence.room_id].room.chat.removeParticipant(presence.profile.username);
      }
    });

    socket.on('users_count', function(count) {
      app.stats.activePeople = count;
      updateCounts();
    });

    socket.on('rooms_count', function(count) {
      app.stats.activeRooms = count;
      updateCounts();
    });

    socket.on('room_count', function(data) {
      var index = parseInt(data.room_id, "10");
      rooms[index].smallSurface.setPeopleCount(data.count);
      if (rooms[index].room) rooms[index].room.setPeopleCount(data.count);
    });

    webrtc.on('readyToCall', function () {
      app.readyToCall = true;
      jQuery('body').append(localVideo.view.$container);
    });

    function joinRoomsCB(err, result) {

    }

    var roomCodes = c("Elements").xf;

    function displayRoom(index, target) {
      var
          room = rooms[index].room,
          $target = jQuery(target);

      var roomCode = roomCodes[index];

      location.hash = roomCode;

      //$target.append(room.map.$container);  
      $target.append(room.chat.$container);
      room.chat.open();
      $target.append(room.topic.$container);

      var $leave = jQuery('<button class="leave-room">leave room</button>');
      $leave.click(function () { x(index); });
      jQuery(target).append($leave);

      var $share = jQuery('<p class="share-room-url">share: <span>' + location.origin + '/#' + roomCode + '</span></p>');
      jQuery(target).append($share);

      //if (app.readyToCall) {
        room.join(function (err, roomDesc) {

          attachMediaStream(webrtc.webrtc.localStream, localVideo.$video[0]);

          function addVideo(v) {
            // random position for now
            var top = Math.floor((Math.random() * ($target.height() - 100)) + 1);
            //var left = Math.floor((Math.random() * ($target.width() - 100)) + 1);
            var right = Math.floor((Math.random() * (468 - 100)) + 1);
            v.setParent($target);
            $target.append(v.$container);
            v.$container.css({
                top: top + 'px',
                right: right + 'px'
            });
          }

          room.videoAdded(addVideo);
          
          for (peer in room.videos) {
            addVideo(room.videos[peer]);
          }
        });
      /*} else {
        webrtc.startLocalVideo();
      }*/
    }


    function init(username, image) {
        var roomCodes = c("Elements").xf;
        var mapper = new Backbone.Model({ 
          name: username,
          image: image
        });
        app.globalChat = new ChatView(app.globalMessages, mapper, 'global');
        var cHeight = jQuery('body').height() - 98 - 50 - 50 - 166 - 16; // input : header : header : participants : padding
        app.globalChat.$messages.height(cHeight);
        jQuery('body').append(app.globalChat.$container);
        app.globalChat.close();

        jQuery(document).on(ChatView.events.inputFocus, function () {
          G = false;
          $.Ia(1); // switch the keyboard controls on/off
        });
        jQuery(document).on(ChatView.events.inputBlur, function () {
          G = true;
          $.Ia(0); // switch the keyboard controls on/off
        });
        jQuery(document).on(RoomTopicView.events.inputFocus, function () {
          G = false;
          $.Ia(1); // switch the keyboard controls on/off
        });
        jQuery(document).on(RoomTopicView.events.inputBlur, function () {
          G = true;
          $.Ia(0); // switch the keyboard controls on/off
        });

        var sendChatMessage = function (event, data) {
          firebase.child('global').child('messages').push(data);
        };
        jQuery(document).on(ChatView.events.message + '-global', sendChatMessage);

        if (window.location.hash) {
          var roomIndex = roomCodes.indexOf(window.location.hash.substring(1));
          b(0);
          g(roomIndex);
          closeSignup();
          Ka = [0, 0, 600];
          beforeRotate = [0, 0, 0];
          La = [0, 0, 0];
        } else {
          b(1);
        }
    }

    function twAuthCB(err, authData) {
      if (!err) {

        if (!authUser) authUser = authData;
        // .pa means setSize
        //twLogin.pa([250, ]);
        twLogin.R("<p>Welcome " + authData.twitter.username + ".</p>");
        delete twLogin.pb.fc.click; // remove the click listener
        googleMod.Ua(); // hide the google login button by hiding its modifier

        //start joining rooms
        webrtc.startLocalVideo();
        c("createRooms")({
          webrtc: webrtc,
          firebase: firebase,
          user: authUser.twitter,
          myVideo: localVideo,
          socket: socket
        }, 'twitter', joinRoomsCB);

        init(authData.twitter.username, authData.twitter.cachedUserProfile.profile_image_url);

        socket.emit('setDetails', {
          username: authData.twitter.username,
          image: authData.twitter.cachedUserProfile.profile_image_url
        });

      } else {
        twLogin.R("<button>Oopsy. Error. Try again?</button>");
      }
    }

    function googleAuthCB(err, authData) {
      if (!err) {

        if (!authUser) authUser = authData;
        // .pa means setSize
        //twLogin.pa([250, ]);

        googleLogin.R("<p>Welcome " + authData.google.displayName + ".</p>");
        delete googleLogin.pb.fc.click; // remove the click listener
        twMod.Ua(); // hide the twitter login button by hiding its modifier

        //start joining rooms
        webrtc.startLocalVideo();
        c("createRooms")({
          webrtc: webrtc,
          firebase: firebase,
          user: authUser.google,
          myVideo: localVideo,
          socket: socket
        }, 'google', joinRoomsCB);

        init(authData.google.displayName, authData.google.cachedUserProfile.picture);

        socket.emit('setDetails', {
          username: authData.google.displayName,
          image: authData.google.cachedUserProfile.picture
        });

      } else {
        googleLogin.R("<button>Oopsy. Error. Try again?</button>");
      }
    }

    function loginClick(provider) {
      return function () {
        if (provider == 'twitter') c("auth")(firebase, provider, twAuthCB);
        else if (provider == 'google') c("auth")(firebase, provider, googleAuthCB);
      };
    }

    // c = require

    // global w = false
    // global p = true

    function k(a) {
      var b = 1.70158;
      return 1 > (a /= 0.5) ? 0.5 * a * a * (((b *= 1.525) + 1) * a - b) : 0.5 * ((a -= 2) * a * (((b *= 1.525) + 1) * a + b) + 2)
    }

    function j(a) {
      117 == a ? a = 62 : 62 == a && (a = 117);
      return m.translate(hb * (Math.floor(a / 15) - 3.5), ib * (a % 5 - 2), -jb * (Math.floor(a / 5) % 3) - 500)
    }

    function f(a) {
      0 == a ? a = 112 : 112 == a && (a = 0);
      return kb(a)
    }


    // the function used to position the rooms
    // based on their index
    function h(a) {
      a = [a % 15, Math.floor(a / 15)];
      
      return m.translate(340 * (a[0] - 7), 260 * (a[1] - 3), 0);
    }

    function e(a) {
      return m.multiply(m.translate(0, 20 * (a - 59), 700), m.Za(0.1 * a * Math.PI))
    }

    function a(a) {
      return m.multiply(m.translate(0,
        250 * (Math.floor(a / 30) - 1), -900), m.Za(-0.06667 * a * Math.PI))
    }

    function b(b, c) {
      var d = J != b;
      J = "undefined" != typeof b ? b : (J + 1) % 2;
      0 <= K && x(K);
      r.o();
      z.Kf();
      var g = {
        duration: 1E3,
        h: ra.H.Ca
      };


      if (0 == J) {
        z.cb(h, g, c);
        z.bb(1, g);
        r.A([0, 0, 50], g); // camera position
        r.F([0, 0, 0], g);
        r.O([0, 0, 0], g);
        H.Cb([-5E3, 5E3], g);
        H.Db([-3E3, 3E3], g);
        H.Eb([-5E3, 5E3], g);
        //U.setTransform(m.translate(120, 0, 0), p);
        U.setTransform(m.translate(30, 0, 0), p);
        (d && q("periodic table"));
      } 
      /*else if (1 == J) {
        (r.A([0, 0, 700], g), r.F([0, 0, 0], g), r.O([0, 0, 0], g), z.cb(e, g, c), z.bb(1, g), H.Cb([-5E3, 5E3], g), H.Db([-3E3, 3E3], g), H.Eb([-5E3, 5E3], g), U.setTransform(m.translate(0, 0, 0), p));
        (d && q("helix"));
      } 
      else if (2 == J) {
        (r.A([0, 0, -500], g), r.F([0, 0, 0], g), r.O([0, 0, 0], g), z.cb(a, g, c), z.bb(1, g), H.Cb([-5E3, 5E3], g), H.Db([-3E3, 3E3], g), H.Eb([-5E3, 5E3], g), U.setTransform(m.translate(60, 0, 0), p));
        (d && q("wall of fame"));
      }
      else if (0 == J) {
        (r.A([0, 0, 800], g), r.F([0, 0, 0], g), r.O([0, 0, 0], g), z.cb(f, g, c), z.bb(1, g), H.Cb([-5E3, 5E3], g), H.Db([-3E3, 3E3], g), H.Eb([-5E3, 5E3], g), U.setTransform(m.translate(-60, 0, 0), p));
        (d && q("sphere"));
      }*/
      else if (1 == J) {
        r.A([0, 0, -600], g);
        r.F([0, -Math.PI / 11, 0], g);
        r.O([0, 0, 0], g);
        z.cb(j, g, c);
        z.bb(1, g);
        //U.setTransform(m.translate(-120, 0, 0), p);
        U.setTransform(m.translate(-30, 0, 0), p);
        (d && q("paraflow"));
      }

      // V is the thing that moves around all the surfaces, only do it if we're in "paraflow"
      1 == J ? V.enable() : V.disable();
      W.Ia(J)
    }

    function d() {
      var a = {
        duration: 1E3
      };
      x(K);
      r.A(Ka, a);
      r.F(lb, a);
      r.O(La, a)
    }

    // this function gets called to bring a surface into the front and center
    // so it does camera movement
    function g(a) {
      m.ka(z.V(a));
      K = a; // set the global K to reference the index of the room at front/center
      mb = z.V(a);
      z.gc(a);

      // DISABLE THE NAV KEYS
      //$.Ia(1);

      /*
      var b = Q[a].da.backgroundImage;
      if (b) {
        Q[a].Bb({
          backgroundImage: aa[a].da.backgroundImage
        });
        var c = new Image;
        c.onload = function() {
          Q[a].Bb({
            backgroundImage: b
          })
        };
        c.src = b.substring(5, b.length - 2)
      }
      ba.Bb({
        backgroundColor: aa[a].da.backgroundColor
      });
      */
      Ka = r.K().slice(0);
      lb = r.ja().slice(0);
      La = r.Sa().slice(0);
      c = m.multiply(m.translate(0, 0, 0), H.Ef(z.V(a)));
      r.Rf(c, {
        duration: 1E3
      }, function() {
        K == a && (z.set(a, m.scale(0, 0, 0)), P.Xc(function() {
          Ma.show()
        }))
      });
      V.Mc(a);
      V.bf(a, 500);
      fa.disable()
    }

    function x(a) {
      webrtc.once('leftRoom', function() {
        ga.Zb(0);
        z.set(a, mb);
        z.xc(a);
        V.Lf(a);
        K == a && (K = -1, $.Ia(0), Ma.Ua())
      });
      rooms[K].room.leave();
    }

    function q(a) {
      Na.R(a);
      Oa.set(1, w);
      Oa.Ua()
    }

    function t(a, c, d) {
      c = new E([60, 60], c);
      c.j("shape-button");
      c.m(new L);
      c.k("click", function() {
        G && b(a)
      });
      return c
    }

    function F() {
      sa.Of(1) && (ha.Ua(), sa.Ua(),
        R.Ia(0))
    }

    function y(a, b, c) {
      var d = "http://famo.us";
      b && (d += "/r/" + b);
      c || (b = ["Wow! HTML5 performance solved. Check out famo.us Beta + Demo", "I can't believe what I saw HTML5 do. Check out famo.us Beta + Demo", "The famo.us demo just blew me away. Check out famo.us Beta + Demo", "If I hadn't seen it, I wouldn't believe it: famo.us HTML5 Beta + Demo", "I'm gunna go with holy shitsnacks! famo.us HTML5 Beta + Demo"], c = b[Math.floor(Math.random() * b.length)]);
      return '<a href="https://twitter.com/share?text=' + encodeURIComponent(c) +
        "&url=" + encodeURIComponent(d) + "&via=befamous\" onclick=\"event.preventDefault(); window.open(event.currentTarget.href, '_blank', 'width=700,height=260');\">" + a + "</a>"
    }

    function B(a) {
      return y('<img src="/img/twitter.png" alt="Tweet" />', a, l)
    }

    function openSignup() {
      X.R("");
      ha.show();
      ia.ab(1);
      ia.setTransform(m.W, {
        duration: 500,
        h: k
      });
      ta.Ua();
      R.Ia(2)
    }

    function closeSignup() {
      ha.Ua();
      ia.setTransform(m.move(m.scale(0.0010, 0.0010, 0.0010), [-0.5 * window.innerWidth, 0, 0]), {
        duration: 500,
        h: k
      }, function() {
        ia.ab(0)
      });
      ta.show();
      R.Ia(0);
      G = p; // enable events
      if (K < 0) b(0); // switch to periodic table
    }

    // define all the modules as variables for use within app
    var A = "Common" in window && "API" in Common,
      G = p, // w = false, p = true. This G variable seems to enable or disable all the events, clicking, and keyboard stuff
      P = c("0/4"),
      E = c("0/c"),  // I think this is Surface
      Eb = c("0/2"),
      m = c("0/9"),
      u = c("0/e"),
      Fb = c("0/f"),
      ja = c("0/1"),
      Pa = c("0/5"),
      Gb = c("0/7"),
      ua = c("0/6"),
      ra = c("0/g"),
      Hb = c("1/i");
    c("1/j");
    var Qa = c("1/s"),
      Ib = c("1/r"),
      Jb = c("1/p"),
      ka = c("1/l"),
      Kb = c("1/q"),
      va = c("1/n"),
      ca = c("1/o"),
      Lb = c("1/m"),
      la = c("3/14"),
      Mb = c("3/15"),
      Nb = c("3/16");
    c("3/19");
    var Ob = c("3/1a"),
      Pb = c("6/1i"),
      Qb = c("6/1k"),
      Rb = c("6/1j");
    c("2/z");

    var auth = c("auth");

    //   
    var
      SmallSurface = c("smallSurface"),
      Ra = c("Elements").xf, // element codes
      L = c("4/1d"),
      Sb = c("4/1c"),
      Tb = c("Elements").uf, // element groupings
      nb = c("Elements").wf, // element names
      ob = c("Elements").vf, // element weights
      ma = Ra.length,
      Sa = Array(ma);

    // setup random starting opacities for the elements
    // it will get combined with the color rgb(73,160,154) in an RGBA value
    for (var Ta = 0; Ta < ma; Ta++) {
      Sa[Ta] = 0.5 + 0.7 * Math.random();
    }

    // 
    for (var aa, Ua = Array(ma), S = 0; S < Ua.length; S++) {
      // create the new surface with a width and height
      var s = new SmallSurface(Ra[S], nb[S], Sa[S]);
      Ua[S] = s.surface;
      rooms[S] = {
        smallSurface: s
      };
    }

    // aa is now an array of our surfaces
    aa = Ua;


    // these bigger surfaces get display when you click on one 
    // of the smaller ones to zoom in and focus on it
    for (var Va = Array(ma), T = 0; T < Va.length; T++) {
      var xa = new E([768, 576]);
      xa.Bb({
        backgroundColor: "rgba(73,160,154," + Sa[T] + ")"
      });
      xa.j("periodic-item-hq");
      //console.log(xa);
      // does .k mean .on? 
      xa.k('deploy', displayRoom.bind(null, T));
      //
      // dont do setContent xa.R('<div class="number">' + (T + 1) + '</div><div class="symbol">' + Ra[T] + '</div><div class="name">' + nb[T] + '</div><div class="mass">' + ob[T] + "</div>");
      Va[T] = xa
    }

    // Q is now the array of high quality surfaces
    var Q = Va;



    // WHAT IS ALL THIS STUFF?? 
    var r = new Hb;
    r.A([0, 0, 5E3]);
    r.F([0, 0, 0]);
    r.O([0, -3 * Math.PI, 0]);
    var H = new Lb(r),
      Ub = new Qa(r),
      Vb = new Ib(r, {
        N: 700,
        $: 2 * Math.PI,
        Z: 2 * Math.PI,
        qd: 200,
        yd: 200,
        sd: p,
        zd: p,
        Wa: p
      }),
      Wb = new Jb(r, {
        Wa: p
      }),
      Xb = new Qa(r, {
        N: 900,
        D: ca,
        md: {
          duration: 2E3,
          h: ra.H.Vd
        },
        Wa: p
      }),
      Yb = new Qa(r, {
        N: 700,
        eb: 200 / Math.PI,
        D: ca,
        Wa: p
      });

    A && (ka = Kb);
    var Zb = new ka(r),
      pb = new ka(r, {
        v: p
      }),
      $b = new ka(r, {
        N: 700,
        eb: 200 / Math.PI,
        v: p,
        X: p,
        D: ca
      }),
      ac = new ka(r, {
        N: 900,
        v: p,
        D: ca
      }),
      bc = new va(r, {
        Aa: p
      }),
      qb = new va(r, {
        Aa: p,
        v: p
      }),
      cc = new va(r, {
        Aa: p,
        N: 700,
        eb: 200 / Math.PI,
        v: p,
        X: p,
        D: ca
      }),
      dc = new va(r, {
        Aa: p,
        N: 900,
        v: p,
        D: ca
      });



      // every fifteen seconds, attempt to flip the view to a different style
      // this is some kind of timer
    var
      fa = new Nb(function() {
        function a() {
          d.ub && setTimeout(function ec() {
            if (d.ub) {
              var a = r.ja().slice(0),
                b = a.slice(0),
                c = 0.5 > Math.random() ?
                -1 : 1;
              0.5 > Math.random() ? b[0] += 2 * c * Math.PI : b[1] += 2 * c * Math.PI;
              r.F(b, {
                duration: 3E3
              }, function() {
                r.F(a);
                setTimeout(ec, 1E4)
              })
            }
          }, 1E4)
        }

        function c() {
          d.ub && (z.de(z.all()), b(4, a))
        }
        var d = this;
        0 == J ? c() : (b(0), setTimeout(c, 200))
      }, 15E3);

    fa.disable();
    P.I(fa);

    // V is the thing that moves around all the surfaces
    var V = new Qb(300, 2E3, 1);

    V.disable();

    for (var hb = 270, ib = 350, jb = 400, kb, ya = [], rb = Math.floor(7), Wa = 0; Wa <= rb; Wa++) {
      var sb = Math.PI / 2 - Wa * (Math.PI / rb),
        za = Math.floor(1400 * Math.PI * Math.cos(sb) / 160);
      0 == za && (za = 1);
      for (var Xa = 0; Xa < za; Xa++) {
        var fc = Xa * (2 * Math.PI / za) - Math.PI;
        ya.push(m.multiply(m.translate(0,
          0, 700), m.Ce(sb), m.Za(fc)))
      }
    }

    for (; 118 > ya.length;) ya.push(m.W);

    kb = function(a) {
      return 118 <= a ? m.scale(0, 0, 0) : ya[a]
    };

    var W = new Pa(4);
    W.Q(3).m([Ub, pb, qb]);
    W.Q(0).m([Vb, pb, qb]);
    W.Q(4).m([Wb, Zb, bc]);
    W.Q(1).m([Yb, $b, cc]);
    W.Q(2).m([Xb, ac, dc]);


    // add the event listeners
    var tb = new ua;
    tb.k("keyup", function(a) {
      if (G)
        if (A) {
          var c = new Common.API.TVKeyValue;
          a.keyCode == c.KEY_ENTER && b()
        } else 32 == a.keyCode && b()
    });
    var J = 4,
      Aa = new ua([new L, new Sb]);
    Aa.k("click", function(a) {
      a.target == document.body && d()
    });
    Aa.k("pinch", function() {
      d()
    });
    Aa.k("keyup",
      function(a) {
        27 == a.keyCode ? d() : null//32 == a.keyCode && ga.Zb() // don't flip when hitting the spacebar
      });


    var $ = new Pa(0);

    // what is z??
    var z = new Ob(aa);
    z.cb(h);
    z.bb(0);

    // the FLIPPER
    var ga = new Mb;

    var
      gc = new Rb(z, 0.1),
      Ba = new Pb(z, Tb),
      Ma = new la(0, w),
      K = -1,  // K stores the index of a front and center room if there is one
      Ka = l,
      lb = l,
      La = l,
      mb = l;

    // aa is the array of surfaces
    for (var O = 0; O < aa.length; O++)(function(a, b) {
      // a is index
      // b is the surface
      b.m(new L);

      // if you click on the surface, move it to center stage
      b.k("click", function() {
        G && (0 > K ? g(a) : (x(K), g(a), Ka = [0, 0, 600], beforeRotate = [0, 0, 0], La = [0, 0, 0]))
      });

      // if you hold on a surface, do what? 
      b.k("hold", function() {
        if (G) {
          var b = Ba.nf(a)[0];
          Ba.Nf(a) ? Ba.fg(b) : Ba.Mc(b)
        }
      })

    }).call(this, O, aa[O]);


    // for each of the high quality surfaces in Q, attach a click listener that 
    // flips the Flipper to the back
    for (O = 0; O < Q.length; O++) {
      Q[O].m(new L);
      
      // don't flip to the back right now
      /*Q[O].k("click", function() {
        ga.Zb(1)
      }); */
    }
    new Fb(0);

    // there is only one 'back of the card' created, and they put it on the flip side of Flipper
    var ba = new E([768, 576], "Reserved for Future Examples");
    ba.j("periodic-item-hq");
    ba.j("periodic-item-back");
    ba.m(new L);

    // when you click on the back, flip the flipper to the front
    ba.k("click", function() {
      ga.Zb(0)
    });

    // the floating words "periodic table"
    var ub = new E([200, 32], "rooms");
    ub.j("caption");

    // the text that comes up when you switch views
    var Na = new E([600, 50], "");
    Na.j("shape-flash");

    var Oa = new la(0, {
        duration: 1E3,
        h: ra.H.Ud
      });
    
    // U is the modifier that slides around with the background for
    // showing which type of viz is selected
    var U = new u(m.translate(-150, 0, 0), 1, "b");
    U.De({
      duration: 250,
      h: ra.H.Qa
    });

    // vb is actual surface inside U
    var vb = new E([60, 60], '<div class="shape-button-indicator-box"></div>');
    vb.j("shape-button-indicator");
    var hc = t(1, '<img src="/img/paraflow.png" alt="PF" />', "paraflow"),
      ic = t(0, '<img src="/img/periodic.png" alt="P" />', "periodic table"),
      //jc = t(0, '<img src="/img/sphere.png" alt="S" />', "sphere"),
      //kc = t(1, '<img src="/img/helix.png" alt="H" />', "helix"),
      //lc = t(2, '<img src="/img/wall.png" alt="W" />', "wall of fame"),
      Ya = new E([window.innerWidth, window.innerHeight]);

    Ya.j("obscure");
    var ha = new la(0, {
        duration: 700,
        h: k
      }),
      Ca = new E([200, 60], "controls &nbsp;&#9432;");
    Ca.j("info-button");
    var sa = new la(0, {
      duration: 500,
      h: k
    });
    Ca.m(new L);
    Ca.k("click", function() {
      G && (ha.show(), sa.show(), R.Ia(1))
    });
    

    //sessionStorage.getItem("signedUp") ? (G = p, P.Xc(v)) : (G = w, P.Xc(D));
    

    var wb = new E([600, 400], "<h3>Controls</h3><ul><li>One finger to scroll</li><li>Two fingers to pinch zoom</li><li>Three fingers to plane in 3D</li><li>Touch any object to navigate to that object in 3D space</li><li>Touch-hold an object to disassemble any shape</li></ul><ul><li>Space key to shapeshift</li><li>WASD keys to move up, left, down, and right</li><li>Shift + W/S keys to move in/out</li><li>Arrow keys to rotate or spin</li><li>Hold Ctrl to enable mouse rotation</li></ul>");
    wb.j("info");

    var Za = new ua([new L]);
    Za.k("keyup", F);
    Za.k("click", F);
    var ia = new u(m.W),
      xb = new E([600, 500], '<h3>Welcome to <strong>Junto</strong><br /><span class="sub">an emergent discussion platform</span></h3><p>an open source discussion platform,<br />bringing livestreaming video, a public backchannel,<br />and the intentions of progressive minds into a forum together to develop plans to drive humanity forward.</p><p class="experience"><a href="http://emergentbydesign.com/2010/06/01/guidelines-for-engaging-in-generative-dialogue-a-k-a-the-conversation/" target="_blank">guidelines</a> - <a href="http://www.emergence.cc/2010/07/junto-overview-of-concept-philosophy-and-components/" target="_blank" >concept</a> - <a href="https://github.com/metamaps/junto" target="_blank" >code</a></p>');
    xb.j("signup-box");
    
    var $a = new E([600, 150], '<form method="POST" action="#"><div class="input"><input id="email" type="text" size="30" name="email" maxlength="75" placeholder="enter email to sign up for beta" size="35" /><input id="github" class="half" type="text" size="30" name="github" maxlength="75" placeholder="github account" size="35" /><input id="github"  class="half" type="text" size="30" name="twitter" maxlength="75" placeholder="twitter account" size="35" /></div><input class="button" type="submit" value="sign up" /></form>');
    $a.j("signup");

    var X = new E([600, 20]);
    X.j("signup-error");

    var Da = new E([100, 100], '<img src="/img/circle-x.png" alt="x" />');
    Da.j("signup-hide");
    Da.m(new L);
    Da.k("click", function() {
      closeSignup();
    });

    var credit = new E([200, 40], 'implementation by <a href="http://twitter.com/Connoropolous" target="_blank">@Connoropolous</a>');
    credit.j("credit");

    // sign in with twitter
    var twMod = new la(0, {
      duration: 700,
      h: k
    });
    twMod.show();

    var twLogin = new E([250, 50], '<button>Login with Twitter</button>');
    twLogin.j("twitter-login");
    twLogin.j("user-login");
    twLogin.m(new L);
    twLogin.k("click", loginClick('twitter'));

    // sign in with twitter
    var googleMod = new la(0, {
      duration: 700,
      h: k
    });
    googleMod.show();

    var googleLogin = new E([250, 50], '<button>Login with Google</button>');
    googleLogin.j("google-login");
    googleLogin.j("user-login");
    googleLogin.m(new L);
    googleLogin.k("click", loginClick('google'));


    var Ea = new E([120, 30], "Welcome!");
    Ea.j("signup-show");
    Ea.m(new L);
    Ea.k("click", function() {
      openSignup();
    });

    var ta = new la(0);

    var na = new ja;
    na.i(xb);

    /*na.i(new u(m.translate(0, 145, 0.01))).f($a); */ // don't add sign up form for now

    na.i(new u(m.translate(0, 210, 0.01))).f(X);
    na.i(new u(m.translate(275, -225, 0.01))).f(Da);

    if (!authUser) {
      na.i(new u(m.translate(110, 90, 0.01))).f(twMod).f(twLogin);
      na.i(new u(m.translate(110, 150, 0.01))).f(googleMod).f(googleLogin);
      na.i(new u(m.translate(138, 220, 0.01))).f(credit);
    } else {
      if (authUser.provider === 'twitter') na.i(new u(m.translate(110, 90, 0.01))).f(twMod).f(twLogin);
      else if (authUser.provider === 'google') na.i(new u(m.translate(110, 90, 0.01))).f(googleMod).f(googleLogin);
      na.i(new u(m.translate(138, 170, 0.01))).f(credit);
    }

    window.addEventListener("submit", function(a) {
      a.preventDefault();
      for (var b = {}, c = p, a = a.target.querySelectorAll("input"), d = 0; d < a.length; d++) {
        var e = a[d];
        e.name && (b[e.name] = e.value)
      }
      /^$|^[a-zA-Z0-9_]{1,15}$/.test(b.twitter) == w && (c = w);
      /^$|^[a-zA-Z0-9][a-zA-Z0-9-]{0,38}$/.test(b.github) == w && (c = w);
      a = document.location.href.split("/");
      b.referrerId = 2 <= a.length && "r" == a[a.length - 2] ? a[a.length - 1] : "";
      
      a = new XMLHttpRequest;
      a.open("POST", "/developers");
      a.setRequestHeader("Content-Type", "application/json");
      a.onreadystatechange = function() {
        if (4 == this.readyState)
          if (200 == this.status) {
            var a = JSON.parse(this.responseText);
            "OK" == a.status ? (X.R(""), $a.R("<p><strong>Success!</strong> We just sent you an email with some more information. We'll send you updates soon.</p>" + ('<div class="tweet-button">' +
              y("Tweet", a.socialId) + "</div>")), Fa.R(B(a.socialId)), sessionStorage.setItem("signedUp", p), window._gaq && _gaq.push(["_trackEvent", "sign-up", "success", , , w])) : X.R(a.msg)
          } else X.R("Ooops! Something went wrong. Try again."), window._gaq && _gaq.push(["_trackEvent", "sign-up", "error", , , p])
      };
      c ? a.send(JSON.stringify(b)) : (X.R("Ooops! Something went wrong. Try again."), window._gaq && _gaq.push(["_trackEvent", "sign-up", "error", , , p]))
    });
    var yb = new ua;
    yb.k("keyup", function(a) {
      if (A) {
        var b = new Common.API.TVKeyValue;
        a.keyCode ==
          b.KEY_EXIT && closeSignup()
      } else 27 == a.keyCode && closeSignup(), 13 == a.keyCode && (document.activeElement && "INPUT" != document.activeElement.nodeName) && closeSignup()
    });
    var R = new Pa(0);
    R.Q(0).m($);
    R.Q(1).m(Za);
    R.Q(2).m(yb);
    var zb = new E([70, 84], "<img width='70' height='84' src='/img/junto-logo-transparent.png' />");
    zb.j("overlay-text");
    

    /* jobs button
    var Ga = new E([80, 60], '<a href="https://jobs.lever.co/famo.us" target="_blank">jobs</a>');
    Ga.j("jobs-button");
    Ga.j("overlay-text");
    Ga.k("click", function() {
      window._gaq && _gaq.push(["_trackEvent", "sign-up", "jobs", , , p])
    });
    */


    // TWEET BUTTON
    // .j = .addClass
    var Fa = new E([60, 60], B());
    Fa.j("shape-button");
    Fa.k("click",
      function() {
        // CLICK EVENT
      });


    var Ab = new E([300, 60]); // COPYRIGHT
    function updateCounts() {
      var
        rooms = app.stats.activeRooms + " active room" + (app.stats.activeRooms == 1 ? ", " : "s, "),
        people = app.stats.activePeople + (app.stats.activePeople == 1 ? " person" : " people") + " present";
      Ab.R(rooms + people);
    }
    updateCounts();
    // .j means .addClass
    Ab.j("copyright");

    var mc = P.Pd(document.querySelector("#main")),
      Bb = P.Pd(document.querySelector("#overlay")),
      bb = new ja;
    bb.i(new u(m.move(m.scale(3, 3, 3), [0, -1E3, 0]))).f(ub);
    bb.i(H).f(V).f(z);

    var cb = new ja;
    cb.i(r).f(bb);
    cb.i(Ma).f(new u(m.translate(0, 0, 200))).f(ga).f(function() {
      var a = {
          transform: m.scale(1 / 3, 1 / 3, 1 / 3),
          target: 0 <= K ? Q[K].z() : s
        },
        b = {
          transform: m.scale(1 / 3, 1 / 3, 1 /
            3),
          target: ba.z()
        };
      return [a, b]
    });

    // BOTTOM BAR
    var Ha = new Eb([window.innerWidth, 60]);
    Ha.j("bottom-bar");
    Bb.k("resize", function() {
      Ha.pa([window.innerWidth, 60]);
      Ya.pa([window.innerWidth, window.innerHeight])
    });


    // ja = mainContext
    var M = new ja;
    // .i = .add  which adds a surface to a context
    //M.i(new u(m.translate(240, 0), 1, "b")).f(Fa);
    M.i(new u(m.W, 1, "br")).f(Fa);
    
    M.i(new u(m.translate(30, 0), 1, "b")).f(ic);
    M.i(new u(m.translate(-30, 0), 1, "b")).f(hc);
    //M.i(new u(m.translate(-120, 0), 1, "b")).f(hc);
    //M.i(new u(m.translate(120, 0), 1, "b")).f(ic);
    //M.i(new u(m.translate(0, 0), 1, "b")).f(kc);
    //M.i(new u(m.translate(60, 0), 1, "b")).f(lc);
    //M.i(new u(m.translate(-60, 0), 1, "b")).f(jc);
    M.i(new u(m.translate(0, 0, 0.01), 1, "b")).f(U).f(vb);
    M.i(new u(m.translate(-50, 0), 1, "br")).f(Ca);
    M.i(new u(m.W, 1, "bl")).f(Ab);
    Ha.Qb(M);
    
    // ja = mainContext
    var N = new ja;
    // .i = .add  which adds a surface to a context
    N.i(Oa).f(Na);
    N.i(new u(m.W, 1, "tl")).f(zb);

    /* N.i(new u(m.W, 1, "tr")).f(Ga); */ // don't add jobs button

    N.i(new u(m.translate(0, 0, 0), 1, "b")).f(Ha);
    N.i(new u(m.translate(0, 0, 0.09))).f(ha).f(Ya);

    // add the 'info' box
    N.i(new u(m.translate(0, 0, 1))).f(sa).f(wb);

    N.i(new u(m.translate(0, 0, 1))).f(ia).f(na);
    N.i(new u(m.move(m.vd(Math.PI / 2), [-45, 0]), 1, "l")).f(ta).f(Ea);
    

    mc.Qb(cb);
    Bb.Qb(N);
    $.Q(0).Ga(W);
    $.Q(0).Ga(tb);
    $.Q(1).m(Aa);
    var db = new Gb;
    db.Ga(R);
    db.Ga(fa);
    P.m(db);
    P.I(function() {
      if (1 == J) {
        var a = Math.ceil(ma / 15) * hb,
          b = 5 * ib,
          c = 3 * jb,
          d = r.ja(),
          e = 0.5 * Math.abs(Math.sin(d[1]) + 1),
          d = 0.5 * Math.abs(-Math.sin(d[0]) + 1);
        H.Cb([(e - 1) * a, e * a], w);
        H.Db([(d - 1) * b, d * b], w);
        H.Eb([-c + 400, 400], w);
        gc.update()
      }
    });

    // initialize with auth
    //firebase.unauth();
    if (authUser && authUser.provider === 'twitter') twAuthCB(null, authUser);
    else if (authUser && authUser.provider === 'google') googleAuthCB(null, authUser);
    else {
      b(1);
      firebase.onAuth(function (authData) {
        if (authData && authData.provider === 'twitter') twAuthCB(null, authData);
        else if (authData && authData.provider === 'google') googleAuthCB(null, authData);
      });
    }

    for (var i = 0; i < 120; i++) {
      socket.emit('requestRoomCount', i.toString());
    }
  }

  module.e = begin;
});



