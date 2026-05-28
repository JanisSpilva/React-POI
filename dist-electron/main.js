import { app as A, ipcMain as T, dialog as Ze, shell as br, BrowserWindow as He, protocol as ve } from "electron";
import { fileURLToPath as gr } from "node:url";
import g from "node:fs";
import v from "node:path";
import Ye from "tty";
import ae from "util";
import Cr from "os";
import ze from "fs";
import Je from "buffer";
import W from "stream";
import wr from "path";
import Er from "zlib";
import Xe from "events";
var Fr = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Sr(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ee = { exports: {} }, Q = { exports: {} }, be, je;
function Ir() {
  if (je) return be;
  je = 1;
  var e = 1e3, r = e * 60, n = r * 60, t = n * 24, i = t * 7, o = t * 365.25;
  be = function(d, c) {
    c = c || {};
    var s = typeof d;
    if (s === "string" && d.length > 0)
      return f(d);
    if (s === "number" && isFinite(d))
      return c.long ? a(d) : u(d);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(d)
    );
  };
  function f(d) {
    if (d = String(d), !(d.length > 100)) {
      var c = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        d
      );
      if (c) {
        var s = parseFloat(c[1]), l = (c[2] || "ms").toLowerCase();
        switch (l) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return s * o;
          case "weeks":
          case "week":
          case "w":
            return s * i;
          case "days":
          case "day":
          case "d":
            return s * t;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return s * n;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return s * r;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return s * e;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return s;
          default:
            return;
        }
      }
    }
  }
  function u(d) {
    var c = Math.abs(d);
    return c >= t ? Math.round(d / t) + "d" : c >= n ? Math.round(d / n) + "h" : c >= r ? Math.round(d / r) + "m" : c >= e ? Math.round(d / e) + "s" : d + "ms";
  }
  function a(d) {
    var c = Math.abs(d);
    return c >= t ? p(d, c, t, "day") : c >= n ? p(d, c, n, "hour") : c >= r ? p(d, c, r, "minute") : c >= e ? p(d, c, e, "second") : d + " ms";
  }
  function p(d, c, s, l) {
    var x = c >= s * 1.5;
    return Math.round(d / s) + " " + l + (x ? "s" : "");
  }
  return be;
}
var ge, De;
function Ke() {
  if (De) return ge;
  De = 1;
  function e(r) {
    t.debug = t, t.default = t, t.coerce = p, t.disable = u, t.enable = o, t.enabled = a, t.humanize = Ir(), t.destroy = d, Object.keys(r).forEach((c) => {
      t[c] = r[c];
    }), t.names = [], t.skips = [], t.formatters = {};
    function n(c) {
      let s = 0;
      for (let l = 0; l < c.length; l++)
        s = (s << 5) - s + c.charCodeAt(l), s |= 0;
      return t.colors[Math.abs(s) % t.colors.length];
    }
    t.selectColor = n;
    function t(c) {
      let s, l = null, x, m;
      function h(...y) {
        if (!h.enabled)
          return;
        const C = h, w = Number(/* @__PURE__ */ new Date()), G = w - (s || w);
        C.diff = G, C.prev = s, C.curr = w, s = w, y[0] = t.coerce(y[0]), typeof y[0] != "string" && y.unshift("%O");
        let I = 0;
        y[0] = y[0].replace(/%([a-zA-Z%])/g, (L, K) => {
          if (L === "%%")
            return "%";
          I++;
          const $e = t.formatters[K];
          if (typeof $e == "function") {
            const vr = y[I];
            L = $e.call(C, vr), y.splice(I, 1), I--;
          }
          return L;
        }), t.formatArgs.call(C, y), (C.log || t.log).apply(C, y);
      }
      return h.namespace = c, h.useColors = t.useColors(), h.color = t.selectColor(c), h.extend = i, h.destroy = t.destroy, Object.defineProperty(h, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => l !== null ? l : (x !== t.namespaces && (x = t.namespaces, m = t.enabled(c)), m),
        set: (y) => {
          l = y;
        }
      }), typeof t.init == "function" && t.init(h), h;
    }
    function i(c, s) {
      const l = t(this.namespace + (typeof s > "u" ? ":" : s) + c);
      return l.log = this.log, l;
    }
    function o(c) {
      t.save(c), t.namespaces = c, t.names = [], t.skips = [];
      const s = (typeof c == "string" ? c : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const l of s)
        l[0] === "-" ? t.skips.push(l.slice(1)) : t.names.push(l);
    }
    function f(c, s) {
      let l = 0, x = 0, m = -1, h = 0;
      for (; l < c.length; )
        if (x < s.length && (s[x] === c[l] || s[x] === "*"))
          s[x] === "*" ? (m = x, h = l, x++) : (l++, x++);
        else if (m !== -1)
          x = m + 1, h++, l = h;
        else
          return !1;
      for (; x < s.length && s[x] === "*"; )
        x++;
      return x === s.length;
    }
    function u() {
      const c = [
        ...t.names,
        ...t.skips.map((s) => "-" + s)
      ].join(",");
      return t.enable(""), c;
    }
    function a(c) {
      for (const s of t.skips)
        if (f(c, s))
          return !1;
      for (const s of t.names)
        if (f(c, s))
          return !0;
      return !1;
    }
    function p(c) {
      return c instanceof Error ? c.stack || c.message : c;
    }
    function d() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return t.enable(t.load()), t;
  }
  return ge = e, ge;
}
var qe;
function Or() {
  return qe || (qe = 1, function(e, r) {
    r.formatArgs = t, r.save = i, r.load = o, r.useColors = n, r.storage = f(), r.destroy = /* @__PURE__ */ (() => {
      let a = !1;
      return () => {
        a || (a = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), r.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function n() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let a;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (a = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(a[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function t(a) {
      if (a[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + a[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors)
        return;
      const p = "color: " + this.color;
      a.splice(1, 0, p, "color: inherit");
      let d = 0, c = 0;
      a[0].replace(/%[a-zA-Z%]/g, (s) => {
        s !== "%%" && (d++, s === "%c" && (c = d));
      }), a.splice(c, 0, p);
    }
    r.log = console.debug || console.log || (() => {
    });
    function i(a) {
      try {
        a ? r.storage.setItem("debug", a) : r.storage.removeItem("debug");
      } catch {
      }
    }
    function o() {
      let a;
      try {
        a = r.storage.getItem("debug") || r.storage.getItem("DEBUG");
      } catch {
      }
      return !a && typeof process < "u" && "env" in process && (a = process.env.DEBUG), a;
    }
    function f() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = Ke()(r);
    const { formatters: u } = e.exports;
    u.j = function(a) {
      try {
        return JSON.stringify(a);
      } catch (p) {
        return "[UnexpectedJSONParseError]: " + p.message;
      }
    };
  }(Q, Q.exports)), Q.exports;
}
var ee = { exports: {} }, Ce, We;
function zr() {
  return We || (We = 1, Ce = (e, r = process.argv) => {
    const n = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", t = r.indexOf(n + e), i = r.indexOf("--");
    return t !== -1 && (i === -1 || t < i);
  }), Ce;
}
var we, ke;
function Lr() {
  if (ke) return we;
  ke = 1;
  const e = Cr, r = Ye, n = zr(), { env: t } = process;
  let i;
  n("no-color") || n("no-colors") || n("color=false") || n("color=never") ? i = 0 : (n("color") || n("colors") || n("color=true") || n("color=always")) && (i = 1), "FORCE_COLOR" in t && (t.FORCE_COLOR === "true" ? i = 1 : t.FORCE_COLOR === "false" ? i = 0 : i = t.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(t.FORCE_COLOR, 10), 3));
  function o(a) {
    return a === 0 ? !1 : {
      level: a,
      hasBasic: !0,
      has256: a >= 2,
      has16m: a >= 3
    };
  }
  function f(a, p) {
    if (i === 0)
      return 0;
    if (n("color=16m") || n("color=full") || n("color=truecolor"))
      return 3;
    if (n("color=256"))
      return 2;
    if (a && !p && i === void 0)
      return 0;
    const d = i || 0;
    if (t.TERM === "dumb")
      return d;
    if (process.platform === "win32") {
      const c = e.release().split(".");
      return Number(c[0]) >= 10 && Number(c[2]) >= 10586 ? Number(c[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in t)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((c) => c in t) || t.CI_NAME === "codeship" ? 1 : d;
    if ("TEAMCITY_VERSION" in t)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(t.TEAMCITY_VERSION) ? 1 : 0;
    if (t.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in t) {
      const c = parseInt((t.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (t.TERM_PROGRAM) {
        case "iTerm.app":
          return c >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(t.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(t.TERM) || "COLORTERM" in t ? 1 : d;
  }
  function u(a) {
    const p = f(a, a && a.isTTY);
    return o(p);
  }
  return we = {
    supportsColor: u,
    stdout: o(f(!0, r.isatty(1))),
    stderr: o(f(!0, r.isatty(2)))
  }, we;
}
var Ge;
function Rr() {
  return Ge || (Ge = 1, function(e, r) {
    const n = Ye, t = ae;
    r.init = d, r.log = u, r.formatArgs = o, r.save = a, r.load = p, r.useColors = i, r.destroy = t.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), r.colors = [6, 2, 3, 4, 5, 1];
    try {
      const s = Lr();
      s && (s.stderr || s).level >= 2 && (r.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    r.inspectOpts = Object.keys(process.env).filter((s) => /^debug_/i.test(s)).reduce((s, l) => {
      const x = l.substring(6).toLowerCase().replace(/_([a-z])/g, (h, y) => y.toUpperCase());
      let m = process.env[l];
      return /^(yes|on|true|enabled)$/i.test(m) ? m = !0 : /^(no|off|false|disabled)$/i.test(m) ? m = !1 : m === "null" ? m = null : m = Number(m), s[x] = m, s;
    }, {});
    function i() {
      return "colors" in r.inspectOpts ? !!r.inspectOpts.colors : n.isatty(process.stderr.fd);
    }
    function o(s) {
      const { namespace: l, useColors: x } = this;
      if (x) {
        const m = this.color, h = "\x1B[3" + (m < 8 ? m : "8;5;" + m), y = `  ${h};1m${l} \x1B[0m`;
        s[0] = y + s[0].split(`
`).join(`
` + y), s.push(h + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        s[0] = f() + l + " " + s[0];
    }
    function f() {
      return r.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function u(...s) {
      return process.stderr.write(t.formatWithOptions(r.inspectOpts, ...s) + `
`);
    }
    function a(s) {
      s ? process.env.DEBUG = s : delete process.env.DEBUG;
    }
    function p() {
      return process.env.DEBUG;
    }
    function d(s) {
      s.inspectOpts = {};
      const l = Object.keys(r.inspectOpts);
      for (let x = 0; x < l.length; x++)
        s.inspectOpts[l[x]] = r.inspectOpts[l[x]];
    }
    e.exports = Ke()(r);
    const { formatters: c } = e.exports;
    c.o = function(s) {
      return this.inspectOpts.colors = this.useColors, t.inspect(s, this.inspectOpts).split(`
`).map((l) => l.trim()).join(" ");
    }, c.O = function(s) {
      return this.inspectOpts.colors = this.useColors, t.inspect(s, this.inspectOpts);
    };
  }(ee, ee.exports)), ee.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Ee.exports = Or() : Ee.exports = Rr();
var _r = Ee.exports, k = { exports: {} }, Le = { exports: {} }, Pr = Qe;
function Qe(e, r) {
  if (e && r) return Qe(e)(r);
  if (typeof e != "function")
    throw new TypeError("need wrapper function");
  return Object.keys(e).forEach(function(t) {
    n[t] = e[t];
  }), n;
  function n() {
    for (var t = new Array(arguments.length), i = 0; i < t.length; i++)
      t[i] = arguments[i];
    var o = e.apply(this, t), f = t[t.length - 1];
    return typeof o == "function" && o !== f && Object.keys(f).forEach(function(u) {
      o[u] = f[u];
    }), o;
  }
}
var er = Pr;
Le.exports = er(re);
Le.exports.strict = er(rr);
re.proto = re(function() {
  Object.defineProperty(Function.prototype, "once", {
    value: function() {
      return re(this);
    },
    configurable: !0
  }), Object.defineProperty(Function.prototype, "onceStrict", {
    value: function() {
      return rr(this);
    },
    configurable: !0
  });
});
function re(e) {
  var r = function() {
    return r.called ? r.value : (r.called = !0, r.value = e.apply(this, arguments));
  };
  return r.called = !1, r;
}
function rr(e) {
  var r = function() {
    if (r.called)
      throw new Error(r.onceError);
    return r.called = !0, r.value = e.apply(this, arguments);
  }, n = e.name || "Function wrapped with `once`";
  return r.onceError = n + " shouldn't be called more than once", r.called = !1, r;
}
var tr = Le.exports, Ar = tr, Mr = function() {
}, Br = Fr.Bare ? queueMicrotask : process.nextTick.bind(process), Tr = function(e) {
  return e.setHeader && typeof e.abort == "function";
}, Nr = function(e) {
  return e.stdio && Array.isArray(e.stdio) && e.stdio.length === 3;
}, nr = function(e, r, n) {
  if (typeof r == "function") return nr(e, null, r);
  r || (r = {}), n = Ar(n || Mr);
  var t = e._writableState, i = e._readableState, o = r.readable || r.readable !== !1 && e.readable, f = r.writable || r.writable !== !1 && e.writable, u = !1, a = function() {
    e.writable || p();
  }, p = function() {
    f = !1, o || n.call(e);
  }, d = function() {
    o = !1, f || n.call(e);
  }, c = function(h) {
    n.call(e, h ? new Error("exited with error code: " + h) : null);
  }, s = function(h) {
    n.call(e, h);
  }, l = function() {
    Br(x);
  }, x = function() {
    if (!u) {
      if (o && !(i && i.ended && !i.destroyed)) return n.call(e, new Error("premature close"));
      if (f && !(t && t.ended && !t.destroyed)) return n.call(e, new Error("premature close"));
    }
  }, m = function() {
    e.req.on("finish", p);
  };
  return Tr(e) ? (e.on("complete", p), e.on("abort", l), e.req ? m() : e.on("request", m)) : f && !t && (e.on("end", a), e.on("close", a)), Nr(e) && e.on("exit", c), e.on("end", d), e.on("finish", p), r.error !== !1 && e.on("error", s), e.on("close", l), function() {
    u = !0, e.removeListener("complete", p), e.removeListener("abort", l), e.removeListener("request", m), e.req && e.req.removeListener("finish", p), e.removeListener("end", a), e.removeListener("close", a), e.removeListener("finish", p), e.removeListener("exit", c), e.removeListener("end", d), e.removeListener("error", s), e.removeListener("close", l);
  };
}, Ur = nr, $r = tr, jr = Ur, te;
try {
  te = require("fs");
} catch {
}
var V = function() {
}, Dr = typeof process > "u" ? !1 : /^v?\.0/.test(process.version), fe = function(e) {
  return typeof e == "function";
}, qr = function(e) {
  return !Dr || !te ? !1 : (e instanceof (te.ReadStream || V) || e instanceof (te.WriteStream || V)) && fe(e.close);
}, Wr = function(e) {
  return e.setHeader && fe(e.abort);
}, kr = function(e, r, n, t) {
  t = $r(t);
  var i = !1;
  e.on("close", function() {
    i = !0;
  }), jr(e, { readable: r, writable: n }, function(f) {
    if (f) return t(f);
    i = !0, t();
  });
  var o = !1;
  return function(f) {
    if (!i && !o) {
      if (o = !0, qr(e)) return e.close(V);
      if (Wr(e)) return e.abort();
      if (fe(e.destroy)) return e.destroy();
      t(f || new Error("stream was destroyed"));
    }
  };
}, Ve = function(e) {
  e();
}, Gr = function(e, r) {
  return e.pipe(r);
}, Vr = function() {
  var e = Array.prototype.slice.call(arguments), r = fe(e[e.length - 1] || V) && e.pop() || V;
  if (Array.isArray(e[0]) && (e = e[0]), e.length < 2) throw new Error("pump requires two streams per minimum");
  var n, t = e.map(function(i, o) {
    var f = o < e.length - 1, u = o > 0;
    return kr(i, f, u, function(a) {
      n || (n = a), a && t.forEach(Ve), !f && (t.forEach(Ve), r(n));
    });
  });
  return e.reduce(Gr);
}, Zr = Vr;
const { PassThrough: Hr } = W;
var Yr = (e) => {
  e = { ...e };
  const { array: r } = e;
  let { encoding: n } = e;
  const t = n === "buffer";
  let i = !1;
  r ? i = !(n || t) : n = n || "utf8", t && (n = null);
  const o = new Hr({ objectMode: i });
  n && o.setEncoding(n);
  let f = 0;
  const u = [];
  return o.on("data", (a) => {
    u.push(a), i ? f = u.length : f += a.length;
  }), o.getBufferedValue = () => r ? u : t ? Buffer.concat(u, f) : u.join(""), o.getBufferedLength = () => f, o;
};
const { constants: Jr } = Je, Xr = Zr, Kr = Yr;
class ir extends Error {
  constructor() {
    super("maxBuffer exceeded"), this.name = "MaxBufferError";
  }
}
async function ce(e, r) {
  if (!e)
    return Promise.reject(new Error("Expected a stream"));
  r = {
    maxBuffer: 1 / 0,
    ...r
  };
  const { maxBuffer: n } = r;
  let t;
  return await new Promise((i, o) => {
    const f = (u) => {
      u && t.getBufferedLength() <= Jr.MAX_LENGTH && (u.bufferedData = t.getBufferedValue()), o(u);
    };
    t = Xr(e, Kr(r), (u) => {
      if (u) {
        f(u);
        return;
      }
      i();
    }), t.on("data", () => {
      t.getBufferedLength() > n && f(new ir());
    });
  }), t.getBufferedValue();
}
k.exports = ce;
k.exports.default = ce;
k.exports.buffer = (e, r) => ce(e, { ...r, encoding: "buffer" });
k.exports.array = (e, r) => ce(e, { ...r, array: !0 });
k.exports.MaxBufferError = ir;
var Qr = k.exports, z = {}, H = {}, et = de;
function de() {
  this.pending = 0, this.max = 1 / 0, this.listeners = [], this.waiting = [], this.error = null;
}
de.prototype.go = function(e) {
  this.pending < this.max ? sr(this, e) : this.waiting.push(e);
};
de.prototype.wait = function(e) {
  this.pending === 0 ? e(this.error) : this.listeners.push(e);
};
de.prototype.hold = function() {
  return or(this);
};
function or(e) {
  e.pending += 1;
  var r = !1;
  return n;
  function n(i) {
    if (r) throw new Error("callback called twice");
    if (r = !0, e.error = e.error || i, e.pending -= 1, e.waiting.length > 0 && e.pending < e.max)
      sr(e, e.waiting.shift());
    else if (e.pending === 0) {
      var o = e.listeners;
      e.listeners = [], o.forEach(t);
    }
  }
  function t(i) {
    i(e.error);
  }
}
function sr(e, r) {
  r(or(e));
}
var Y = ze, ue = ae, Re = W, ar = Re.Readable, _e = Re.Writable, rt = Re.PassThrough, tt = et, le = Xe.EventEmitter;
H.createFromBuffer = nt;
H.createFromFd = it;
H.BufferSlicer = _;
H.FdSlicer = R;
ue.inherits(R, le);
function R(e, r) {
  r = r || {}, le.call(this), this.fd = e, this.pend = new tt(), this.pend.max = 1, this.refCount = 0, this.autoClose = !!r.autoClose;
}
R.prototype.read = function(e, r, n, t, i) {
  var o = this;
  o.pend.go(function(f) {
    Y.read(o.fd, e, r, n, t, function(u, a, p) {
      f(), i(u, a, p);
    });
  });
};
R.prototype.write = function(e, r, n, t, i) {
  var o = this;
  o.pend.go(function(f) {
    Y.write(o.fd, e, r, n, t, function(u, a, p) {
      f(), i(u, a, p);
    });
  });
};
R.prototype.createReadStream = function(e) {
  return new pe(this, e);
};
R.prototype.createWriteStream = function(e) {
  return new he(this, e);
};
R.prototype.ref = function() {
  this.refCount += 1;
};
R.prototype.unref = function() {
  var e = this;
  if (e.refCount -= 1, e.refCount > 0) return;
  if (e.refCount < 0) throw new Error("invalid unref");
  e.autoClose && Y.close(e.fd, r);
  function r(n) {
    n ? e.emit("error", n) : e.emit("close");
  }
};
ue.inherits(pe, ar);
function pe(e, r) {
  r = r || {}, ar.call(this, r), this.context = e, this.context.ref(), this.start = r.start || 0, this.endOffset = r.end, this.pos = this.start, this.destroyed = !1;
}
pe.prototype._read = function(e) {
  var r = this;
  if (!r.destroyed) {
    var n = Math.min(r._readableState.highWaterMark, e);
    if (r.endOffset != null && (n = Math.min(n, r.endOffset - r.pos)), n <= 0) {
      r.destroyed = !0, r.push(null), r.context.unref();
      return;
    }
    r.context.pend.go(function(t) {
      if (r.destroyed) return t();
      var i = new Buffer(n);
      Y.read(r.context.fd, i, 0, n, r.pos, function(o, f) {
        o ? r.destroy(o) : f === 0 ? (r.destroyed = !0, r.push(null), r.context.unref()) : (r.pos += f, r.push(i.slice(0, f))), t();
      });
    });
  }
};
pe.prototype.destroy = function(e) {
  this.destroyed || (e = e || new Error("stream destroyed"), this.destroyed = !0, this.emit("error", e), this.context.unref());
};
ue.inherits(he, _e);
function he(e, r) {
  r = r || {}, _e.call(this, r), this.context = e, this.context.ref(), this.start = r.start || 0, this.endOffset = r.end == null ? 1 / 0 : +r.end, this.bytesWritten = 0, this.pos = this.start, this.destroyed = !1, this.on("finish", this.destroy.bind(this));
}
he.prototype._write = function(e, r, n) {
  var t = this;
  if (!t.destroyed) {
    if (t.pos + e.length > t.endOffset) {
      var i = new Error("maximum file length exceeded");
      i.code = "ETOOBIG", t.destroy(), n(i);
      return;
    }
    t.context.pend.go(function(o) {
      if (t.destroyed) return o();
      Y.write(t.context.fd, e, 0, e.length, t.pos, function(f, u) {
        f ? (t.destroy(), o(), n(f)) : (t.bytesWritten += u, t.pos += u, t.emit("progress"), o(), n());
      });
    });
  }
};
he.prototype.destroy = function() {
  this.destroyed || (this.destroyed = !0, this.context.unref());
};
ue.inherits(_, le);
function _(e, r) {
  le.call(this), r = r || {}, this.refCount = 0, this.buffer = e, this.maxChunkSize = r.maxChunkSize || Number.MAX_SAFE_INTEGER;
}
_.prototype.read = function(e, r, n, t, i) {
  var o = t + n, f = o - this.buffer.length, u = f > 0 ? f : n;
  this.buffer.copy(e, r, t, o), setImmediate(function() {
    i(null, u);
  });
};
_.prototype.write = function(e, r, n, t, i) {
  e.copy(this.buffer, t, r, r + n), setImmediate(function() {
    i(null, n, e);
  });
};
_.prototype.createReadStream = function(e) {
  e = e || {};
  var r = new rt(e);
  r.destroyed = !1, r.start = e.start || 0, r.endOffset = e.end, r.pos = r.endOffset || this.buffer.length;
  for (var n = this.buffer.slice(r.start, r.pos), t = 0; ; ) {
    var i = t + this.maxChunkSize;
    if (i >= n.length) {
      t < n.length && r.write(n.slice(t, n.length));
      break;
    }
    r.write(n.slice(t, i)), t = i;
  }
  return r.end(), r.destroy = function() {
    r.destroyed = !0;
  }, r;
};
_.prototype.createWriteStream = function(e) {
  var r = this;
  e = e || {};
  var n = new _e(e);
  return n.start = e.start || 0, n.endOffset = e.end == null ? this.buffer.length : +e.end, n.bytesWritten = 0, n.pos = n.start, n.destroyed = !1, n._write = function(t, i, o) {
    if (!n.destroyed) {
      var f = n.pos + t.length;
      if (f > n.endOffset) {
        var u = new Error("maximum file length exceeded");
        u.code = "ETOOBIG", n.destroyed = !0, o(u);
        return;
      }
      t.copy(r.buffer, n.pos, 0, t.length), n.bytesWritten += t.length, n.pos = f, n.emit("progress"), o();
    }
  }, n.destroy = function() {
    n.destroyed = !0;
  }, n;
};
_.prototype.ref = function() {
  this.refCount += 1;
};
_.prototype.unref = function() {
  if (this.refCount -= 1, this.refCount < 0)
    throw new Error("invalid unref");
};
function nt(e, r) {
  return new _(e, r);
}
function it(e, r) {
  return new R(e, r);
}
var P = Je.Buffer, Fe = [
  0,
  1996959894,
  3993919788,
  2567524794,
  124634137,
  1886057615,
  3915621685,
  2657392035,
  249268274,
  2044508324,
  3772115230,
  2547177864,
  162941995,
  2125561021,
  3887607047,
  2428444049,
  498536548,
  1789927666,
  4089016648,
  2227061214,
  450548861,
  1843258603,
  4107580753,
  2211677639,
  325883990,
  1684777152,
  4251122042,
  2321926636,
  335633487,
  1661365465,
  4195302755,
  2366115317,
  997073096,
  1281953886,
  3579855332,
  2724688242,
  1006888145,
  1258607687,
  3524101629,
  2768942443,
  901097722,
  1119000684,
  3686517206,
  2898065728,
  853044451,
  1172266101,
  3705015759,
  2882616665,
  651767980,
  1373503546,
  3369554304,
  3218104598,
  565507253,
  1454621731,
  3485111705,
  3099436303,
  671266974,
  1594198024,
  3322730930,
  2970347812,
  795835527,
  1483230225,
  3244367275,
  3060149565,
  1994146192,
  31158534,
  2563907772,
  4023717930,
  1907459465,
  112637215,
  2680153253,
  3904427059,
  2013776290,
  251722036,
  2517215374,
  3775830040,
  2137656763,
  141376813,
  2439277719,
  3865271297,
  1802195444,
  476864866,
  2238001368,
  4066508878,
  1812370925,
  453092731,
  2181625025,
  4111451223,
  1706088902,
  314042704,
  2344532202,
  4240017532,
  1658658271,
  366619977,
  2362670323,
  4224994405,
  1303535960,
  984961486,
  2747007092,
  3569037538,
  1256170817,
  1037604311,
  2765210733,
  3554079995,
  1131014506,
  879679996,
  2909243462,
  3663771856,
  1141124467,
  855842277,
  2852801631,
  3708648649,
  1342533948,
  654459306,
  3188396048,
  3373015174,
  1466479909,
  544179635,
  3110523913,
  3462522015,
  1591671054,
  702138776,
  2966460450,
  3352799412,
  1504918807,
  783551873,
  3082640443,
  3233442989,
  3988292384,
  2596254646,
  62317068,
  1957810842,
  3939845945,
  2647816111,
  81470997,
  1943803523,
  3814918930,
  2489596804,
  225274430,
  2053790376,
  3826175755,
  2466906013,
  167816743,
  2097651377,
  4027552580,
  2265490386,
  503444072,
  1762050814,
  4150417245,
  2154129355,
  426522225,
  1852507879,
  4275313526,
  2312317920,
  282753626,
  1742555852,
  4189708143,
  2394877945,
  397917763,
  1622183637,
  3604390888,
  2714866558,
  953729732,
  1340076626,
  3518719985,
  2797360999,
  1068828381,
  1219638859,
  3624741850,
  2936675148,
  906185462,
  1090812512,
  3747672003,
  2825379669,
  829329135,
  1181335161,
  3412177804,
  3160834842,
  628085408,
  1382605366,
  3423369109,
  3138078467,
  570562233,
  1426400815,
  3317316542,
  2998733608,
  733239954,
  1555261956,
  3268935591,
  3050360625,
  752459403,
  1541320221,
  2607071920,
  3965973030,
  1969922972,
  40735498,
  2617837225,
  3943577151,
  1913087877,
  83908371,
  2512341634,
  3803740692,
  2075208622,
  213261112,
  2463272603,
  3855990285,
  2094854071,
  198958881,
  2262029012,
  4057260610,
  1759359992,
  534414190,
  2176718541,
  4139329115,
  1873836001,
  414664567,
  2282248934,
  4279200368,
  1711684554,
  285281116,
  2405801727,
  4167216745,
  1634467795,
  376229701,
  2685067896,
  3608007406,
  1308918612,
  956543938,
  2808555105,
  3495958263,
  1231636301,
  1047427035,
  2932959818,
  3654703836,
  1088359270,
  936918e3,
  2847714899,
  3736837829,
  1202900863,
  817233897,
  3183342108,
  3401237130,
  1404277552,
  615818150,
  3134207493,
  3453421203,
  1423857449,
  601450431,
  3009837614,
  3294710456,
  1567103746,
  711928724,
  3020668471,
  3272380065,
  1510334235,
  755167117
];
typeof Int32Array < "u" && (Fe = new Int32Array(Fe));
function fr(e) {
  if (P.isBuffer(e))
    return e;
  var r = typeof P.alloc == "function" && typeof P.from == "function";
  if (typeof e == "number")
    return r ? P.alloc(e) : new P(e);
  if (typeof e == "string")
    return r ? P.from(e) : new P(e);
  throw new Error("input must be buffer, number, or string, received " + typeof e);
}
function ot(e) {
  var r = fr(4);
  return r.writeInt32BE(e, 0), r;
}
function Pe(e, r) {
  e = fr(e), P.isBuffer(r) && (r = r.readUInt32BE(0));
  for (var n = ~~r ^ -1, t = 0; t < e.length; t++)
    n = Fe[(n ^ e[t]) & 255] ^ n >>> 8;
  return n ^ -1;
}
function Ae() {
  return ot(Pe.apply(null, arguments));
}
Ae.signed = function() {
  return Pe.apply(null, arguments);
};
Ae.unsigned = function() {
  return Pe.apply(null, arguments) >>> 0;
};
var st = Ae, Se = ze, at = Er, cr = H, ft = st, me = ae, xe = Xe.EventEmitter, dr = W.Transform, Me = W.PassThrough, ct = W.Writable;
z.open = dt;
z.fromFd = ur;
z.fromBuffer = ut;
z.fromRandomAccessReader = Be;
z.dosDateTimeToDate = pr;
z.validateFileName = hr;
z.ZipFile = M;
z.Entry = J;
z.RandomAccessReader = N;
function dt(e, r, n) {
  typeof r == "function" && (n = r, r = null), r == null && (r = {}), r.autoClose == null && (r.autoClose = !0), r.lazyEntries == null && (r.lazyEntries = !1), r.decodeStrings == null && (r.decodeStrings = !0), r.validateEntrySizes == null && (r.validateEntrySizes = !0), r.strictFileNames == null && (r.strictFileNames = !1), n == null && (n = oe), Se.open(e, "r", function(t, i) {
    if (t) return n(t);
    ur(i, r, function(o, f) {
      o && Se.close(i, oe), n(o, f);
    });
  });
}
function ur(e, r, n) {
  typeof r == "function" && (n = r, r = null), r == null && (r = {}), r.autoClose == null && (r.autoClose = !1), r.lazyEntries == null && (r.lazyEntries = !1), r.decodeStrings == null && (r.decodeStrings = !0), r.validateEntrySizes == null && (r.validateEntrySizes = !0), r.strictFileNames == null && (r.strictFileNames = !1), n == null && (n = oe), Se.fstat(e, function(t, i) {
    if (t) return n(t);
    var o = cr.createFromFd(e, { autoClose: !0 });
    Be(o, i.size, r, n);
  });
}
function ut(e, r, n) {
  typeof r == "function" && (n = r, r = null), r == null && (r = {}), r.autoClose = !1, r.lazyEntries == null && (r.lazyEntries = !1), r.decodeStrings == null && (r.decodeStrings = !0), r.validateEntrySizes == null && (r.validateEntrySizes = !0), r.strictFileNames == null && (r.strictFileNames = !1);
  var t = cr.createFromBuffer(e, { maxChunkSize: 65536 });
  Be(t, e.length, r, n);
}
function Be(e, r, n, t) {
  typeof n == "function" && (t = n, n = null), n == null && (n = {}), n.autoClose == null && (n.autoClose = !0), n.lazyEntries == null && (n.lazyEntries = !1), n.decodeStrings == null && (n.decodeStrings = !0);
  var i = !!n.decodeStrings;
  if (n.validateEntrySizes == null && (n.validateEntrySizes = !0), n.strictFileNames == null && (n.strictFileNames = !1), t == null && (t = oe), typeof r != "number") throw new Error("expected totalSize parameter to be a number");
  if (r > Number.MAX_SAFE_INTEGER)
    throw new Error("zip file too large. only file sizes up to 2^52 are supported due to JavaScript's Number type being an IEEE 754 double.");
  e.ref();
  var o = 22, f = 65535, u = Math.min(o + f, r), a = O(u), p = r - a.length;
  D(e, a, 0, u, p, function(d) {
    if (d) return t(d);
    for (var c = u - o; c >= 0; c -= 1)
      if (a.readUInt32LE(c) === 101010256) {
        var s = a.slice(c), l = s.readUInt16LE(4);
        if (l !== 0)
          return t(new Error("multi-disk zip files are not supported: found disk number: " + l));
        var x = s.readUInt16LE(10), m = s.readUInt32LE(16), h = s.readUInt16LE(20), y = s.length - o;
        if (h !== y)
          return t(new Error("invalid comment length. expected: " + y + ". found: " + h));
        var C = i ? ne(s, 22, s.length, !1) : s.slice(22);
        if (!(x === 65535 || m === 4294967295))
          return t(null, new M(e, m, r, x, C, n.autoClose, n.lazyEntries, i, n.validateEntrySizes, n.strictFileNames));
        var w = O(20), G = p + c - w.length;
        D(e, w, 0, w.length, G, function(I) {
          if (I) return t(I);
          if (w.readUInt32LE(0) !== 117853008)
            return t(new Error("invalid zip64 end of central directory locator signature"));
          var Ue = q(w, 8), L = O(56);
          D(e, L, 0, L.length, Ue, function(K) {
            return K ? t(K) : L.readUInt32LE(0) !== 101075792 ? t(new Error("invalid zip64 end of central directory record signature")) : (x = q(L, 32), m = q(L, 48), t(null, new M(e, m, r, x, C, n.autoClose, n.lazyEntries, i, n.validateEntrySizes, n.strictFileNames)));
          });
        });
        return;
      }
    t(new Error("end of central directory record signature not found"));
  });
}
me.inherits(M, xe);
function M(e, r, n, t, i, o, f, u, a, p) {
  var d = this;
  xe.call(d), d.reader = e, d.reader.on("error", function(c) {
    lr(d, c);
  }), d.reader.once("close", function() {
    d.emit("close");
  }), d.readEntryCursor = r, d.fileSize = n, d.entryCount = t, d.comment = i, d.entriesRead = 0, d.autoClose = !!o, d.lazyEntries = !!f, d.decodeStrings = !!u, d.validateEntrySizes = !!a, d.strictFileNames = !!p, d.isOpen = !0, d.emittedError = !1, d.lazyEntries || d._readEntry();
}
M.prototype.close = function() {
  this.isOpen && (this.isOpen = !1, this.reader.unref());
};
function E(e, r) {
  e.autoClose && e.close(), lr(e, r);
}
function lr(e, r) {
  e.emittedError || (e.emittedError = !0, e.emit("error", r));
}
M.prototype.readEntry = function() {
  if (!this.lazyEntries) throw new Error("readEntry() called without lazyEntries:true");
  this._readEntry();
};
M.prototype._readEntry = function() {
  var e = this;
  if (e.entryCount === e.entriesRead) {
    setImmediate(function() {
      e.autoClose && e.close(), !e.emittedError && e.emit("end");
    });
    return;
  }
  if (!e.emittedError) {
    var r = O(46);
    D(e.reader, r, 0, r.length, e.readEntryCursor, function(n) {
      if (n) return E(e, n);
      if (!e.emittedError) {
        var t = new J(), i = r.readUInt32LE(0);
        if (i !== 33639248) return E(e, new Error("invalid central directory file header signature: 0x" + i.toString(16)));
        if (t.versionMadeBy = r.readUInt16LE(4), t.versionNeededToExtract = r.readUInt16LE(6), t.generalPurposeBitFlag = r.readUInt16LE(8), t.compressionMethod = r.readUInt16LE(10), t.lastModFileTime = r.readUInt16LE(12), t.lastModFileDate = r.readUInt16LE(14), t.crc32 = r.readUInt32LE(16), t.compressedSize = r.readUInt32LE(20), t.uncompressedSize = r.readUInt32LE(24), t.fileNameLength = r.readUInt16LE(28), t.extraFieldLength = r.readUInt16LE(30), t.fileCommentLength = r.readUInt16LE(32), t.internalFileAttributes = r.readUInt16LE(36), t.externalFileAttributes = r.readUInt32LE(38), t.relativeOffsetOfLocalHeader = r.readUInt32LE(42), t.generalPurposeBitFlag & 64) return E(e, new Error("strong encryption is not supported"));
        e.readEntryCursor += 46, r = O(t.fileNameLength + t.extraFieldLength + t.fileCommentLength), D(e.reader, r, 0, r.length, e.readEntryCursor, function(o) {
          if (o) return E(e, o);
          if (!e.emittedError) {
            var f = (t.generalPurposeBitFlag & 2048) !== 0;
            t.fileName = e.decodeStrings ? ne(r, 0, t.fileNameLength, f) : r.slice(0, t.fileNameLength);
            var u = t.fileNameLength + t.extraFieldLength, a = r.slice(t.fileNameLength, u);
            t.extraFields = [];
            for (var p = 0; p < a.length - 3; ) {
              var d = a.readUInt16LE(p + 0), c = a.readUInt16LE(p + 2), s = p + 4, l = s + c;
              if (l > a.length) return E(e, new Error("extra field length exceeds extra field buffer size"));
              var x = O(c);
              a.copy(x, 0, s, l), t.extraFields.push({
                id: d,
                data: x
              }), p = l;
            }
            if (t.fileComment = e.decodeStrings ? ne(r, u, u + t.fileCommentLength, f) : r.slice(u, u + t.fileCommentLength), t.comment = t.fileComment, e.readEntryCursor += r.length, e.entriesRead += 1, t.uncompressedSize === 4294967295 || t.compressedSize === 4294967295 || t.relativeOffsetOfLocalHeader === 4294967295) {
              for (var m = null, p = 0; p < t.extraFields.length; p++) {
                var h = t.extraFields[p];
                if (h.id === 1) {
                  m = h.data;
                  break;
                }
              }
              if (m == null)
                return E(e, new Error("expected zip64 extended information extra field"));
              var y = 0;
              if (t.uncompressedSize === 4294967295) {
                if (y + 8 > m.length)
                  return E(e, new Error("zip64 extended information extra field does not include uncompressed size"));
                t.uncompressedSize = q(m, y), y += 8;
              }
              if (t.compressedSize === 4294967295) {
                if (y + 8 > m.length)
                  return E(e, new Error("zip64 extended information extra field does not include compressed size"));
                t.compressedSize = q(m, y), y += 8;
              }
              if (t.relativeOffsetOfLocalHeader === 4294967295) {
                if (y + 8 > m.length)
                  return E(e, new Error("zip64 extended information extra field does not include relative header offset"));
                t.relativeOffsetOfLocalHeader = q(m, y), y += 8;
              }
            }
            if (e.decodeStrings)
              for (var p = 0; p < t.extraFields.length; p++) {
                var h = t.extraFields[p];
                if (h.id === 28789) {
                  if (h.data.length < 6 || h.data.readUInt8(0) !== 1)
                    continue;
                  var C = h.data.readUInt32LE(1);
                  if (ft.unsigned(r.slice(0, t.fileNameLength)) !== C)
                    continue;
                  t.fileName = ne(h.data, 5, h.data.length, !0);
                  break;
                }
              }
            if (e.validateEntrySizes && t.compressionMethod === 0) {
              var w = t.uncompressedSize;
              if (t.isEncrypted() && (w += 12), t.compressedSize !== w) {
                var G = "compressed/uncompressed size mismatch for stored file: " + t.compressedSize + " != " + t.uncompressedSize;
                return E(e, new Error(G));
              }
            }
            if (e.decodeStrings) {
              e.strictFileNames || (t.fileName = t.fileName.replace(/\\/g, "/"));
              var I = hr(t.fileName, e.validateFileNameOptions);
              if (I != null) return E(e, new Error(I));
            }
            e.emit("entry", t), e.lazyEntries || e._readEntry();
          }
        });
      }
    });
  }
};
M.prototype.openReadStream = function(e, r, n) {
  var t = this, i = 0, o = e.compressedSize;
  if (n == null)
    n = r, r = {};
  else {
    if (r.decrypt != null) {
      if (!e.isEncrypted())
        throw new Error("options.decrypt can only be specified for encrypted entries");
      if (r.decrypt !== !1) throw new Error("invalid options.decrypt value: " + r.decrypt);
      if (e.isCompressed() && r.decompress !== !1)
        throw new Error("entry is encrypted and compressed, and options.decompress !== false");
    }
    if (r.decompress != null) {
      if (!e.isCompressed())
        throw new Error("options.decompress can only be specified for compressed entries");
      if (!(r.decompress === !1 || r.decompress === !0))
        throw new Error("invalid options.decompress value: " + r.decompress);
    }
    if (r.start != null || r.end != null) {
      if (e.isCompressed() && r.decompress !== !1)
        throw new Error("start/end range not allowed for compressed entry without options.decompress === false");
      if (e.isEncrypted() && r.decrypt !== !1)
        throw new Error("start/end range not allowed for encrypted entry without options.decrypt === false");
    }
    if (r.start != null) {
      if (i = r.start, i < 0) throw new Error("options.start < 0");
      if (i > e.compressedSize) throw new Error("options.start > entry.compressedSize");
    }
    if (r.end != null) {
      if (o = r.end, o < 0) throw new Error("options.end < 0");
      if (o > e.compressedSize) throw new Error("options.end > entry.compressedSize");
      if (o < i) throw new Error("options.end < options.start");
    }
  }
  if (!t.isOpen) return n(new Error("closed"));
  if (e.isEncrypted() && r.decrypt !== !1)
    return n(new Error("entry is encrypted, and options.decrypt !== false"));
  t.reader.ref();
  var f = O(30);
  D(t.reader, f, 0, f.length, e.relativeOffsetOfLocalHeader, function(u) {
    try {
      if (u) return n(u);
      var a = f.readUInt32LE(0);
      if (a !== 67324752)
        return n(new Error("invalid local file header signature: 0x" + a.toString(16)));
      var p = f.readUInt16LE(26), d = f.readUInt16LE(28), c = e.relativeOffsetOfLocalHeader + f.length + p + d, s;
      if (e.compressionMethod === 0)
        s = !1;
      else if (e.compressionMethod === 8)
        s = r.decompress != null ? r.decompress : !0;
      else
        return n(new Error("unsupported compression method: " + e.compressionMethod));
      var l = c, x = l + e.compressedSize;
      if (e.compressedSize !== 0 && x > t.fileSize)
        return n(new Error("file data overflows file bounds: " + l + " + " + e.compressedSize + " > " + t.fileSize));
      var m = t.reader.createReadStream({
        start: l + i,
        end: l + o
      }), h = m;
      if (s) {
        var y = !1, C = at.createInflateRaw();
        m.on("error", function(w) {
          setImmediate(function() {
            y || C.emit("error", w);
          });
        }), m.pipe(C), t.validateEntrySizes ? (h = new X(e.uncompressedSize), C.on("error", function(w) {
          setImmediate(function() {
            y || h.emit("error", w);
          });
        }), C.pipe(h)) : h = C, h.destroy = function() {
          y = !0, C !== h && C.unpipe(h), m.unpipe(C), m.destroy();
        };
      }
      n(null, h);
    } finally {
      t.reader.unref();
    }
  });
};
function J() {
}
J.prototype.getLastModDate = function() {
  return pr(this.lastModFileDate, this.lastModFileTime);
};
J.prototype.isEncrypted = function() {
  return (this.generalPurposeBitFlag & 1) !== 0;
};
J.prototype.isCompressed = function() {
  return this.compressionMethod === 8;
};
function pr(e, r) {
  var n = e & 31, t = (e >> 5 & 15) - 1, i = (e >> 9 & 127) + 1980, o = 0, f = (r & 31) * 2, u = r >> 5 & 63, a = r >> 11 & 31;
  return new Date(i, t, n, a, u, f, o);
}
function hr(e) {
  return e.indexOf("\\") !== -1 ? "invalid characters in fileName: " + e : /^[a-zA-Z]:/.test(e) || /^\//.test(e) ? "absolute path: " + e : e.split("/").indexOf("..") !== -1 ? "invalid relative path: " + e : null;
}
function D(e, r, n, t, i, o) {
  if (t === 0)
    return setImmediate(function() {
      o(null, O(0));
    });
  e.read(r, n, t, i, function(f, u) {
    if (f) return o(f);
    if (u < t)
      return o(new Error("unexpected EOF"));
    o();
  });
}
me.inherits(X, dr);
function X(e) {
  dr.call(this), this.actualByteCount = 0, this.expectedByteCount = e;
}
X.prototype._transform = function(e, r, n) {
  if (this.actualByteCount += e.length, this.actualByteCount > this.expectedByteCount) {
    var t = "too many bytes in the stream. expected " + this.expectedByteCount + ". got at least " + this.actualByteCount;
    return n(new Error(t));
  }
  n(null, e);
};
X.prototype._flush = function(e) {
  if (this.actualByteCount < this.expectedByteCount) {
    var r = "not enough bytes in the stream. expected " + this.expectedByteCount + ". got only " + this.actualByteCount;
    return e(new Error(r));
  }
  e();
};
me.inherits(N, xe);
function N() {
  xe.call(this), this.refCount = 0;
}
N.prototype.ref = function() {
  this.refCount += 1;
};
N.prototype.unref = function() {
  var e = this;
  if (e.refCount -= 1, e.refCount > 0) return;
  if (e.refCount < 0) throw new Error("invalid unref");
  e.close(r);
  function r(n) {
    if (n) return e.emit("error", n);
    e.emit("close");
  }
};
N.prototype.createReadStream = function(e) {
  var r = e.start, n = e.end;
  if (r === n) {
    var t = new Me();
    return setImmediate(function() {
      t.end();
    }), t;
  }
  var i = this._readStreamForRange(r, n), o = !1, f = new ye(this);
  i.on("error", function(a) {
    setImmediate(function() {
      o || f.emit("error", a);
    });
  }), f.destroy = function() {
    i.unpipe(f), f.unref(), i.destroy();
  };
  var u = new X(n - r);
  return f.on("error", function(a) {
    setImmediate(function() {
      o || u.emit("error", a);
    });
  }), u.destroy = function() {
    o = !0, f.unpipe(u), f.destroy();
  }, i.pipe(f).pipe(u);
};
N.prototype._readStreamForRange = function(e, r) {
  throw new Error("not implemented");
};
N.prototype.read = function(e, r, n, t, i) {
  var o = this.createReadStream({ start: t, end: t + n }), f = new ct(), u = 0;
  f._write = function(a, p, d) {
    a.copy(e, r + u, 0, a.length), u += a.length, d();
  }, f.on("finish", i), o.on("error", function(a) {
    i(a);
  }), o.pipe(f);
};
N.prototype.close = function(e) {
  setImmediate(e);
};
me.inherits(ye, Me);
function ye(e) {
  Me.call(this), this.context = e, this.context.ref(), this.unreffedYet = !1;
}
ye.prototype._flush = function(e) {
  this.unref(), e();
};
ye.prototype.unref = function(e) {
  this.unreffedYet || (this.unreffedYet = !0, this.context.unref());
};
var lt = "\0☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ";
function ne(e, r, n, t) {
  if (t)
    return e.toString("utf8", r, n);
  for (var i = "", o = r; o < n; o++)
    i += lt[e[o]];
  return i;
}
function q(e, r) {
  var n = e.readUInt32LE(r), t = e.readUInt32LE(r + 4);
  return t * 4294967296 + n;
}
var O;
typeof Buffer.allocUnsafe == "function" ? O = function(e) {
  return Buffer.allocUnsafe(e);
} : O = function(e) {
  return new Buffer(e);
};
function oe(e) {
  if (e) throw e;
}
const F = _r("extract-zip"), { createWriteStream: pt, promises: j } = ze, ht = Qr, U = wr, { promisify: Te } = ae, mt = W, xt = z, yt = Te(xt.open), vt = Te(mt.pipeline);
class bt {
  constructor(r, n) {
    this.zipPath = r, this.opts = n;
  }
  async extract() {
    return F("opening", this.zipPath, "with opts", this.opts), this.zipfile = await yt(this.zipPath, { lazyEntries: !0 }), this.canceled = !1, new Promise((r, n) => {
      this.zipfile.on("error", (t) => {
        this.canceled = !0, n(t);
      }), this.zipfile.readEntry(), this.zipfile.on("close", () => {
        this.canceled || (F("zip extraction complete"), r());
      }), this.zipfile.on("entry", async (t) => {
        if (this.canceled) {
          F("skipping entry", t.fileName, { cancelled: this.canceled });
          return;
        }
        if (F("zipfile entry", t.fileName), t.fileName.startsWith("__MACOSX/")) {
          this.zipfile.readEntry();
          return;
        }
        const i = U.dirname(U.join(this.opts.dir, t.fileName));
        try {
          await j.mkdir(i, { recursive: !0 });
          const o = await j.realpath(i);
          if (U.relative(this.opts.dir, o).split(U.sep).includes(".."))
            throw new Error(`Out of bound path "${o}" found while processing file ${t.fileName}`);
          await this.extractEntry(t), F("finished processing", t.fileName), this.zipfile.readEntry();
        } catch (o) {
          this.canceled = !0, this.zipfile.close(), n(o);
        }
      });
    });
  }
  async extractEntry(r) {
    if (this.canceled) {
      F("skipping entry extraction", r.fileName, { cancelled: this.canceled });
      return;
    }
    this.opts.onEntry && this.opts.onEntry(r, this.zipfile);
    const n = U.join(this.opts.dir, r.fileName), t = r.externalFileAttributes >> 16 & 65535, i = 61440, o = 16384, u = (t & i) === 40960;
    let a = (t & i) === o;
    !a && r.fileName.endsWith("/") && (a = !0);
    const p = r.versionMadeBy >> 8;
    a || (a = p === 0 && r.externalFileAttributes === 16), F("extracting entry", { filename: r.fileName, isDir: a, isSymlink: u });
    const d = this.getExtractedMode(t, a) & 511, c = a ? n : U.dirname(n), s = { recursive: !0 };
    if (a && (s.mode = d), F("mkdir", { dir: c, ...s }), await j.mkdir(c, s), a) return;
    F("opening read stream", n);
    const l = await Te(this.zipfile.openReadStream.bind(this.zipfile))(r);
    if (u) {
      const x = await ht(l);
      F("creating symlink", x, n), await j.symlink(x, n);
    } else
      await vt(l, pt(n, { mode: d }));
  }
  getExtractedMode(r, n) {
    let t = r;
    return t === 0 && (n ? (this.opts.defaultDirMode && (t = parseInt(this.opts.defaultDirMode, 10)), t || (t = 493)) : (this.opts.defaultFileMode && (t = parseInt(this.opts.defaultFileMode, 10)), t || (t = 420))), t;
  }
}
var gt = async function(e, r) {
  if (F("creating target directory", r.dir), !U.isAbsolute(r.dir))
    throw new Error("Target directory is expected to be absolute");
  return await j.mkdir(r.dir, { recursive: !0 }), r.dir = await j.realpath(r.dir), new bt(e, r).extract();
};
const Ct = /* @__PURE__ */ Sr(gt), mr = v.dirname(gr(import.meta.url));
process.env.APP_ROOT = v.join(mr, "..");
const B = v.join(A.getPath("userData"), "poi-map-data"), Z = v.join(B, "attachments"), Ie = v.join(B, "pois.json"), S = v.join(B, "offline-tiles"), ie = v.join(B, "marker-icons");
function $() {
  g.existsSync(B) || g.mkdirSync(B), g.existsSync(Z) || g.mkdirSync(Z);
}
function Ne(e, r) {
  g.existsSync(r) || g.mkdirSync(r, { recursive: !0 });
  for (const n of g.readdirSync(e)) {
    const t = v.join(e, n), i = v.join(r, n);
    g.statSync(t).isDirectory() ? Ne(t, i) : g.copyFileSync(t, i);
  }
}
T.handle("export-backup", async () => {
  $();
  const e = await Ze.showOpenDialog({
    title: "Choose folder to export backup into",
    properties: ["openDirectory"]
  });
  if (e.canceled || e.filePaths.length === 0)
    return !1;
  const r = v.join(
    e.filePaths[0],
    `poi-map-backup-${Date.now()}`
  );
  return Ne(B, r), !0;
});
T.handle("import-backup", async () => {
  const e = await Ze.showOpenDialog({
    title: "Choose backup folder",
    properties: ["openDirectory"]
  });
  if (e.canceled || e.filePaths.length === 0)
    return !1;
  $();
  const r = e.filePaths[0];
  return Ne(r, B), !0;
});
T.handle("load-pois", () => {
  if ($(), !g.existsSync(Ie))
    return [];
  const e = g.readFileSync(Ie, "utf-8");
  return JSON.parse(e);
});
T.handle("save-pois", (e, r) => ($(), g.writeFileSync(Ie, JSON.stringify(r, null, 2), "utf-8"), !0));
T.handle("save-attachment-file", (e, r) => {
  $();
  const n = `${Date.now()}-${v.basename(r)}`, t = v.join(Z, n);
  return g.copyFileSync(r, t), {
    name: v.basename(r),
    path: t
  };
});
T.handle("cleanup-unused-files", (e, r) => {
  $();
  const n = new Set(r), t = g.readdirSync(Z);
  for (const i of t) {
    const o = v.join(Z, i);
    n.has(o) || g.unlinkSync(o);
  }
  return !0;
});
T.handle("open-file", async (e, r) => (await br.openPath(r), !0));
function wt() {
  return g.existsSync(v.join(S, ".detail-ready")) ? 15 : g.existsSync(v.join(S, ".medium-ready")) ? 12 : g.existsSync(v.join(S, ".basic-ready")) ? 10 : 8;
}
T.handle("get-available-max-zoom", () => wt());
const Oe = process.env.VITE_DEV_SERVER_URL, $t = v.join(process.env.APP_ROOT, "dist-electron"), xr = v.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = Oe ? v.join(process.env.APP_ROOT, "public") : xr;
let b;
function Et(e) {
  return A.isPackaged ? v.join(process.resourcesPath, e) : v.join("C:\\Users\\sairo\\MAP", e);
}
async function se(e, r, n) {
  const t = v.join(r, n);
  if (g.existsSync(t))
    return;
  const i = Et(e);
  if (!g.existsSync(i)) {
    console.error("Missing ZIP:", i);
    return;
  }
  await Ct(i, {
    dir: r
  }), g.writeFileSync(t, "done", "utf-8");
}
async function Ft() {
  $(), g.existsSync(S) || g.mkdirSync(S, { recursive: !0 }), g.existsSync(ie) || g.mkdirSync(ie, { recursive: !0 }), await se(
    "latvia-tiles-basic.zip",
    S,
    ".basic-ready"
  ), await se(
    "latvia-marker-icons.zip",
    ie,
    ".markers-ready"
  );
}
async function St() {
  try {
    g.existsSync(v.join(S, ".medium-ready")) || (b == null || b.webContents.send("map-extraction-status", {
      message: "Preparing medium map detail...",
      detail: "Zoom 11–12 unpacking"
    }), await se(
      "latvia-tiles-medium.zip",
      S,
      ".medium-ready"
    ), b == null || b.webContents.send("map-extraction-status", {
      message: "Medium map detail ready",
      detail: "Zoom 11–12 is now available"
    })), g.existsSync(v.join(S, ".detail-ready")) || (b == null || b.webContents.send("map-extraction-status", {
      message: "Preparing detailed map layers...",
      detail: "Zoom 13–15 unpacking"
    }), await se(
      "latvia-tiles-detail.zip",
      S,
      ".detail-ready"
    ), b == null || b.webContents.send("map-extraction-status", {
      message: "Detailed map layers ready",
      detail: "Zoom 13–15 is now available"
    })), b == null || b.webContents.send("map-extraction-status", {
      message: "Offline map ready",
      detail: "All zoom levels are available"
    });
  } catch (e) {
    console.error("Background extraction failed:", e), b == null || b.webContents.send("map-extraction-status", {
      message: "Map extraction problem",
      detail: "Some zoom levels may not be available yet"
    });
  }
}
function yr() {
  b = new He({
    width: 1600,
    height: 1e3,
    autoHideMenuBar: !0,
    icon: v.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: v.join(mr, "preload.mjs")
    }
  }), b.maximize(), b.webContents.on("did-finish-load", () => {
    b == null || b.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), Oe ? b.loadURL(Oe) : b.loadFile(v.join(xr, "index.html"));
}
A.on("window-all-closed", () => {
  process.platform !== "darwin" && (A.quit(), b = null);
});
A.on("activate", () => {
  He.getAllWindows().length === 0 && yr();
});
A.whenReady().then(async () => {
  await Ft(), ve.registerFileProtocol("localfile", (e, r) => {
    const n = decodeURIComponent(
      e.url.replace("localfile://", "")
    );
    r({ path: n });
  }), ve.registerFileProtocol("markericon", (e, r) => {
    const n = decodeURIComponent(
      e.url.replace("markericon://", "")
    ), t = A.isPackaged ? ie : "C:\\Users\\sairo\\MAP\\latvia-marker-icons", i = v.join(t, n);
    r({ path: i });
  }), ve.registerFileProtocol("offlinetile", (e, r) => {
    const n = decodeURIComponent(
      e.url.replace("offlinetile://", "")
    ), t = A.isPackaged ? S : "C:\\Users\\sairo\\MAP\\latvia-offline-tiles", i = v.join(t, n);
    r({ path: i });
  }), yr(), setTimeout(() => {
    St();
  }, 1e3);
});
export {
  $t as MAIN_DIST,
  xr as RENDERER_DIST,
  Oe as VITE_DEV_SERVER_URL
};
