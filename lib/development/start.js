C("start", ["require", "exports", "module", "app"], function(require) {
  var url = 'https://juntorooms.firebaseio.com/';
  var fb = new Firebase(url);
  require("app")(fb, "http://localhost:5002");
});
da(["start"]);