var l = void 0,
  p = !0,
  s = null,
  w = !1,
  da, C;

function ea(c, k) {
  var j, f, h, e, a, b, d, g, x, q = k && k.split("/"),
    t = I.map,
    F = t && t["*"] || {};
  if (c && "." === c.charAt(0) && k) {
    q = q.slice(0, q.length - 1);
    c = q.concat(c.split("/"));
    for (g = 0; g < c.length; g += 1)
      if (j = c[g], "." === j) c.splice(g, 1), g -= 1;
      else if (".." === j)
      if (1 === g && (".." === c[2] || ".." === c[0])) break;
      else 0 < g && (c.splice(g - 1, 2), g -= 2);
    c = c.join("/")
  }
  if ((q || F) && t) {
    j = c.split("/");
    for (g = j.length; 0 < g; g -= 1) {
      f = j.slice(0, g).join("/");
      if (q)
        for (x = q.length; 0 < x; x -= 1)
          if (h = t[q.slice(0, x).join("/")])
            if (h = h[f]) {
              e = h;
              a = g;
              break
            }
      if (e) break;
      !b && (F && F[f]) && (b = F[f], d = g)
    }!e && b && (e = b, a = d);
    e && (j.splice(0, a, e), c = j.join("/"))
  }
  return c
}

function oa(c, k) {
  return function() {
    return pa.apply(l, qa.call(arguments, 0).concat([c, k]))
  }
}

function Ia(c) {
  return function(k) {
    Y[c] = k
  }
}

function Ja(c) {
  if (eb.hasOwnProperty(c)) {
    var k = eb[c];
    delete eb[c];
    fb[c] = p;
    gb.apply(l, k)
  }
  if (!Y.hasOwnProperty(c) && !fb.hasOwnProperty(c)) throw Error("No " + c);
  return Y[c]
}

function Cb(c) {
  var k, j = c ? c.indexOf("!") : -1; - 1 < j && (k = c.substring(0, j), c = c.substring(j + 1, c.length));
  return [k, c]
}
var gb, pa, Db, Z, Y = {},
  eb = {},
  I = {},
  fb = {},
  qa = [].slice;
Db = function(c, k) {
  var j, f = Cb(c),
    h = f[0],
    c = f[1];
  h && (h = ea(h, k), j = Ja(h));
  h ? c = j && j.normalize ? j.normalize(c, function(e) {
    return ea(e, k)
  }) : ea(c, k) : (c = ea(c, k), f = Cb(c), h = f[0], c = f[1], h && (j = Ja(h)));
  return {
    Zd: h ? h + "!" + c : c,
    Vf: c,
    Dg: h,
    re: j
  }
};
Z = {
  Yf: function(c) {
    return oa(c)
  },
  e: function(c) {
    var k = Y[c];
    return "undefined" !== typeof k ? k : Y[c] = {}
  },
  Tf: function(c) {
    return {
      id: c,
      uri: "",
      e: Y[c],
      Ic: function() {
        return I && I.Ic && I.Ic[c] || {}
      }
    }
  }
};
gb = function(c, k, j, f) {
  var h, e, a, b, d = [],
    g, f = f || c;
  if ("function" === typeof j) {
    k = !k.length && j.length ? ["require", "exports", "module"] : k;
    for (b = 0; b < k.length; b += 1)
      if (a = Db(k[b], f), e = a.Zd, "require" === e) d[b] = Z.Yf(c);
      else if ("exports" === e) d[b] = Z.e(c), g = p;
    else if ("module" === e) h = d[b] = Z.Tf(c);
    else if (Y.hasOwnProperty(e) || eb.hasOwnProperty(e) || fb.hasOwnProperty(e)) d[b] = Ja(e);
    else if (a.re) a.re.load(a.Vf, oa(f, p), Ia(e), {}), d[b] = Y[e];
    else throw Error(c + " missing " + e);
    k = j.apply(Y[c], d);
    if (c)
      if (h && h.e !== l && h.e !== Y[c]) Y[c] =
        h.e;
      else if (k !== l || !g) Y[c] = k
  } else c && (Y[c] = j)
};
da = pa = function(c, k, j, f, h) {
  if ("string" === typeof c) return Z[c] ? Z[c](k) : Ja(Db(c, k).Zd);
  c.splice || (I = c, k.splice ? (c = k, k = j, j = s) : c = l);
  k = k || function() {};
  "function" === typeof j && (j = f, f = h);
  f ? gb(l, c, k, j) : setTimeout(function() {
    gb(l, c, k, j)
  }, 15);
  return pa
};
pa.Ic = function(c) {
  I = c;
  return pa
};
C = function(c, k, j) {
  k.splice || (j = k, k = []);
  eb[c] = [c, k, j]
};
C.ng = {
  ug: p
};