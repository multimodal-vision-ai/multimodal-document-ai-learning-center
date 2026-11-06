var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn3, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn3 && (res = (0, fn3[__getOwnPropNames(fn3)[0]])(fn3 = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// ../../node_modules/.pnpm/onnxruntime-web@1.27.0/node_modules/onnxruntime-web/dist/ort.webgpu.bundle.min.mjs
var ort_webgpu_bundle_min_exports = {};
__export(ort_webgpu_bundle_min_exports, {
  InferenceSession: () => Xf,
  TRACE: () => $a,
  TRACE_EVENT_BEGIN: () => $e,
  TRACE_EVENT_END: () => ze,
  TRACE_FUNC_BEGIN: () => tt,
  TRACE_FUNC_END: () => rt,
  Tensor: () => Le,
  default: () => vl,
  env: () => Q,
  registerBackend: () => Qe
});
async function ts(a = {}) {
  var r = a, s = !!globalThis.window, f = !!globalThis.WorkerGlobalScope, i = f && self.name?.startsWith("em-pthread");
  r.mountExternalData = (e, t) => {
    e.startsWith("./") && (e = e.substring(2)), (r.Vc || (r.Vc = /* @__PURE__ */ new Map())).set(e, t);
  }, r.unmountExternalData = () => {
    delete r.Vc;
  }, globalThis.SharedArrayBuffer ?? new WebAssembly.Memory({ initial: 0, maximum: 0, shared: true }).buffer.constructor;
  let d = () => {
    let e = (t) => (...n) => {
      let o = Me;
      return n = t(...n), Me != o ? new Promise((u, c) => {
        Br2 = { resolve: u, reject: c };
      }) : n;
    };
    (() => {
      for (let t of ["_OrtAppendExecutionProvider", "_OrtCreateSession", "_OrtRun", "_OrtRunWithBinding", "_OrtBindInput"]) r[t] = e(r[t]);
    })(), typeof jsepRunAsync < "u" && (r._OrtRun = jsepRunAsync(r._OrtRun), r._OrtRunWithBinding = jsepRunAsync(r._OrtRunWithBinding)), d = void 0;
  };
  r.asyncInit = () => {
    d?.();
  };
  var l, m, y = (e, t) => {
    throw t;
  }, w = import.meta.url, T = "";
  if (s || f) {
    try {
      T = new URL(".", w).href;
    } catch {
    }
    f && (m = (e) => {
      var t = new XMLHttpRequest();
      return t.open("GET", e, false), t.responseType = "arraybuffer", t.send(null), new Uint8Array(t.response);
    }), l = async (e) => {
      if (oe2(e)) return new Promise((n, o) => {
        var u = new XMLHttpRequest();
        u.open("GET", e, true), u.responseType = "arraybuffer", u.onload = () => {
          u.status == 200 || u.status == 0 && u.response ? n(u.response) : o(u.status);
        }, u.onerror = o, u.send(null);
      });
      var t = await fetch(e, { credentials: "same-origin" });
      if (t.ok) return t.arrayBuffer();
      throw Error(t.status + " : " + t.url);
    };
  }
  var g, v, S, U2, R, H, C = console.log.bind(console), M = console.error.bind(console), q = C, B = M, W2 = false, oe2 = (e) => e.startsWith("file://");
  function p() {
    Fe2.buffer != X.buffer && se();
  }
  if (i) {
    let e = function(t) {
      try {
        var n = t.data, o = n.Pc;
        if (o === "load") {
          let u = [];
          self.onmessage = (c) => u.push(c), H = () => {
            postMessage({ Pc: "loaded" });
            for (let c of u) e(c);
            self.onmessage = e;
          };
          for (let c of n.ee) r[c] && !r[c].proxy || (r[c] = (...h) => {
            postMessage({ Pc: "callHandler", de: c, args: h });
          }, c == "print" && (q = r[c]), c == "printErr" && (B = r[c]));
          Fe2 = n.ke, se(), v = n.le, bt(), $t2();
        } else if (o === "run") {
          ((function(u) {
            var c = (p(), A)[u + 52 >>> 2 >>> 0];
            u = (p(), A)[u + 56 >>> 2 >>> 0], Uo2(c, c - u), D(c);
          }))(n.Oc), Fr2(n.Oc, 0, 0, 1, 0, 0), bn2(), Ir2(n.Oc), ne || (po2(), ne = true);
          try {
            zs2(n.ie, n.Xc);
          } catch (u) {
            if (u != "unwind") throw u;
          }
        } else n.target !== "setimmediate" && (o === "checkMailbox" ? ne && Pt2() : o && (B(`worker: received unknown command ${o}`), B(n)));
      } catch (u) {
        throw xo2(), u;
      }
    };
    var ne = false;
    self.onunhandledrejection = (t) => {
      throw t.reason || t;
    }, self.onmessage = e;
  }
  var X, J2, Ce2, Z, x, A, _, ae, me2, Y, we2, re2 = false;
  function se() {
    var e = Fe2.buffer;
    r.HEAP8 = X = new Int8Array(e), Ce2 = new Int16Array(e), r.HEAPU8 = J2 = new Uint8Array(e), Z = new Uint16Array(e), r.HEAP32 = x = new Int32Array(e), r.HEAPU32 = A = new Uint32Array(e), _ = new Float32Array(e), ae = new Float64Array(e), me2 = new BigInt64Array(e), Y = new BigUint64Array(e);
  }
  function yr() {
    re2 = true, i ? H() : ke2.$b();
  }
  function Te(e) {
    throw B(e = "Aborted(" + e + ")"), W2 = true, e = new WebAssembly.RuntimeError(e + ". Build with -sASSERTIONS for more info."), R?.(e), e;
  }
  function qe() {
    return { a: { f: Vs2, J: js2, k: Hs2, p: qs2, l: Ys2, sa: Js2, b: Xs2, ca: Zs2, Ja: Sn, q: Ks2, da: Ln, Za: Bn, Fa: On, Ha: Mn, _a: Un, Xa: Cn, Qa: Dn, Wa: Pn, oa: _n, Ga: Rn, Yb: Nn, Ya: kn, Zb: Wn2, db: Qs2, Da: ti, Tb: ri, Rb: oi, Ca: si, M: ii, I: ui, Sb: fi, ja: yi, Ub: bi, Ta: wi, Wb: Ti, Ka: vi, Pb: Ei, ka: Si, Sa: Ir2, ab: Ai, U: Bi, n: Di, c: Sr2, rb: Pi, w: _i, L: Ri, z: Ni, j: ki, o: qn2, sb: Wi, G: Fi, T: Gi, h: $i, u: zi, m: Vi, i: ji, Na: Hi, Oa: qi, Pa: Yi, La: Zn2, Ma: Kn2, Qb: Qn2, eb: Xi, cb: Qi, Y: eu2, qb: tu2, la: ru2, bb: Zi, fb: nu2, $a: ou2, Xb: au2, N: Ji, gb: su2, X: iu2, Vb: uu2, nb: bu2, C: wu2, ra: gu2, qa: Tu2, pb: vu2, W: Eu2, v: Su2, mb: Au2, lb: Iu2, kb: xu2, ob: Lu2, jb: Bu2, ib: Ou2, hb: Mu2, Ua: ao2, Va: so2, Ia: wr, V: io2, na: uo2, Ra: fo2, ma: co2, Cb: $f2, xa: Rf2, Db: Gf2, ya: _f2, F: Af2, e: cf, s: uf, x: sf, B: Tf2, Fb: Cf2, ba: Uf2, D: pf, za: Df2, $: Nf2, ga: Mf2, Gb: Of2, Hb: Bf2, Ba: If2, Aa: Lf2, Ib: xf2, wa: Ff2, aa: Pf2, d: ff2, A: lf, r: df, Bb: zf2, t: hf2, y: Ef2, H: mf, E: yf2, K: Sf2, R: kf2, ia: gf2, _: Wf2, Kb: wf2, Lb: bf2, Jb: vf2, g: Cu2, a: Fe2, Ob: Ye2, Eb: Du2, ha: Pu2, O: _u2, pa: Ru2, Mb: Nu2, ta: ku2, Q: Wu2, yb: Fu2, zb: Gu2, ua: $u2, ea: zu2, P: Vu2, Ea: ju2, va: Hu2, Z: qu2, wb: Yu2, _b: Ju2, S: Xu2, Ab: Zu2, tb: Ku2, ub: ef, vb: tf, fa: rf, xb: nf, Nb: of } };
  }
  async function bt() {
    function e(o, u) {
      var c = ke2 = o.exports;
      o = {};
      for (let [h, b] of Object.entries(c)) typeof b == "function" ? (c = Ii(b), o[h] = c) : o[h] = b;
      return ke2 = o, ke2 = (function() {
        var h = ke2, b = (I) => (F) => I(F) >>> 0, E = (I) => () => I() >>> 0;
        return (h = Object.assign({}, h)).ac = b(h.ac), h.Dc = E(h.Dc), h.Fc = b(h.Fc), h.sd = /* @__PURE__ */ ((I) => (F, j2) => I(F, j2) >>> 0)(h.sd), h.xd = b(h.xd), h.yd = E(h.yd), h.Cd = b(h.Cd), h;
      })(), hn2.push(ke2.jd), lo2 = (o = ke2).ac, po2 = o.bc, r._OrtInit = o.cc, r._OrtGetLastError = o.dc, r._OrtCreateSessionOptions = o.ec, r._OrtAppendExecutionProvider = o.fc, r._OrtAddFreeDimensionOverride = o.gc, r._OrtAddSessionConfigEntry = o.hc, r._OrtReleaseSessionOptions = o.ic, r._OrtCreateSession = o.jc, r._OrtReleaseSession = o.kc, r._OrtGetInputOutputCount = o.lc, r._OrtGetInputOutputMetadata = o.mc, r._OrtFree = o.nc, r._OrtCreateTensor = o.oc, r._OrtGetTensorData = o.pc, r._OrtReleaseTensor = o.qc, r._OrtCreateRunOptions = o.rc, r._OrtAddRunConfigEntry = o.sc, r._OrtReleaseRunOptions = o.tc, r._OrtCreateBinding = o.uc, r._OrtBindInput = o.vc, r._OrtBindOutput = o.wc, r._OrtClearBoundOutputs = o.xc, r._OrtReleaseBinding = o.yc, r._OrtRunWithBinding = o.zc, r._OrtRun = o.Ac, r._OrtEndProfiling = o.Bc, Pr2 = r._OrtGetWebGpuDevice = o.Cc, Ft2 = o.Dc, xe = r._free = o.Ec, pt2 = r._malloc = o.Fc, mo2 = r._wgpuBufferRelease = o.Gc, ho2 = r._wgpuCreateInstance = o.Hc, yo2 = o.Ic, bo2 = o.Jc, wo2 = o.Kc, go2 = o.Lc, To2 = o.Mc, vo2 = o.Qc, Eo2 = o._c, So2 = o.$c, Ao2 = o.ad, _r = o.cd, Rr2 = o.dd, Nr2 = o.ed, kr2 = o.fd, Et2 = o.gd, Wr2 = o.hd, Io2 = o.id, Fr2 = o.ld, xo2 = o.md, Lo = o.nd, Bo2 = o.od, Gr2 = o.pd, Oo2 = o.qd, Mo2 = o.rd, $r = o.sd, N = o.td, St2 = o.ud, Uo2 = o.vd, D = o.wd, Gt2 = o.xd, P = o.yd, Co2 = o.zd, zr2 = o.Ad, Do2 = o.Bd, Po2 = o.Cd, _o2 = o.Dd, Vr2 = o.Ed, Ro2 = o.Fd, No2 = o.Gd, ko2 = o.Hd, Wo = o.Id, Fo = o.Jd, Go = o.Kd, $o2 = o.Ld, zo2 = o.Md, Vo = o.Nd, jo = o.Od, Ho = o.Pd, qo = o.Qd, Yo = o.Rd, Jo = o.Sd, Xo = o.Ud, Zo = o.Vd, Ko = o.Wd, Qo = o.Xd, ea = o.Zd, ta = o._d, ra = o.$d, na = o.ae, oa = o.be, aa = o.ce, sa = o.qe, ia = o.re, ua = o.se, fa = o.te, ca = o.ue, da = o.ve, la = o.we, pa = o.xe, ma = o.ye, ha = o.ze, ya = o.Ae, ba = o.$e, wa = o.af, ga = o.bf, Ta = o.cf, v = u, ke2;
    }
    var t, n = qe();
    return r.instantiateWasm ? new Promise((o) => {
      r.instantiateWasm(n, (u, c) => {
        o(e(u, c));
      });
    }) : i ? e(new WebAssembly.Instance(v, qe()), v) : (we2 ??= r.locateFile ? r.locateFile ? r.locateFile("ort-wasm-simd-threaded.asyncify.wasm", T) : T + "ort-wasm-simd-threaded.asyncify.wasm" : new URL("ort-wasm-simd-threaded.asyncify.wasm", import.meta.url).href, t = await (async function(o) {
      var u = we2;
      if (!g && !oe2(u)) try {
        var c = fetch(u, { credentials: "same-origin" });
        return await WebAssembly.instantiateStreaming(c, o);
      } catch (h) {
        B(`wasm streaming compile failed: ${h}`), B("falling back to ArrayBuffer instantiation");
      }
      return (async function(h, b) {
        try {
          var E = await (async function(I) {
            if (!g) try {
              var F = await l(I);
              return new Uint8Array(F);
            } catch {
            }
            if (I == we2 && g) I = new Uint8Array(g);
            else {
              if (!m) throw "both async and sync fetching of the wasm failed";
              I = m(I);
            }
            return I;
          })(h);
          return await WebAssembly.instantiate(E, b);
        } catch (I) {
          B(`failed to asynchronously prepare wasm: ${I}`), Te(I);
        }
      })(u, o);
    })(n), e(t.instance, t.module));
  }
  class wt2 {
    name = "ExitStatus";
    constructor(t) {
      this.message = `Program terminated with exit(${t})`, this.status = t;
    }
  }
  var Se = (e) => {
    e.terminate(), e.onmessage = () => {
    };
  }, Ae = [], Be2 = 0, ee2 = null, K = (e) => {
    We2.length == 0 && (gn2(), wn(We2[0]));
    var t = We2.pop();
    if (!t) return 6;
    gt.push(t), Je[e.Oc] = t, t.Oc = e.Oc;
    var n = { Pc: "run", ie: e.he, Xc: e.Xc, Oc: e.Oc };
    return t.postMessage(n, e.Zc), 0;
  }, G = 0, V2 = (e, t, ...n) => {
    var o, u = 16 * n.length, c = P(), h = Gt2(u), b = h >>> 3;
    for (o of n) typeof o == "bigint" ? ((p(), me2)[b++ >>> 0] = 1n, (p(), me2)[b++ >>> 0] = o) : ((p(), me2)[b++ >>> 0] = 0n, (p(), ae)[b++ >>> 0] = o);
    return e = Lo(e, 0, u, h, t), D(c), e;
  };
  function Ye2(e) {
    if (i) return V2(0, 1, e);
    if (S = e, !(0 < G)) {
      for (var t of gt) Se(t);
      for (t of We2) Se(t);
      We2 = [], gt = [], Je = {}, W2 = true;
    }
    y(0, new wt2(e));
  }
  function br(e) {
    if (i) return V2(1, 0, e);
    wr(e);
  }
  var wr = (e) => {
    if (S = e, i) throw br(e), "unwind";
    Ye2(e);
  }, We2 = [], gt = [], hn2 = [], Je = {}, yn2 = (e) => {
    var t = e.Oc;
    delete Je[t], We2.push(e), gt.splice(gt.indexOf(e), 1), e.Oc = 0, Bo2(t);
  };
  function bn2() {
    hn2.forEach((e) => e());
  }
  var wn = (e) => new Promise((t) => {
    e.onmessage = (u) => {
      var c = u.data;
      if (u = c.Pc, c.Wc && c.Wc != Ft2()) {
        var h = Je[c.Wc];
        h ? h.postMessage(c, c.Zc) : B(`Internal error! Worker sent a message "${u}" to target pthread ${c.Wc}, but that thread no longer exists!`);
      } else u === "checkMailbox" ? Pt2() : u === "spawnThread" ? K(c) : u === "cleanupThread" ? he(() => {
        yn2(Je[c.je]);
      }) : u === "loaded" ? (e.loaded = true, t(e)) : c.target === "setimmediate" ? e.postMessage(c) : u === "uncaughtException" ? e.onerror(c.error) : u === "callHandler" ? r[c.de](...c.args) : u && B(`worker sent an unknown command ${u}`);
    }, e.onerror = (u) => {
      throw B(`worker sent an error! ${u.filename}:${u.lineno}: ${u.message}`), u;
    };
    var n, o = [];
    for (n of []) r.propertyIsEnumerable(n) && o.push(n);
    e.postMessage({ Pc: "load", ee: o, ke: Fe2, le: v });
  });
  function gn2() {
    var e = new Worker((() => {
      let t = URL;
      return import.meta.url > "file:" && import.meta.url < "file;" ? new t("ort.webgpu.bundle.min.mjs", import.meta.url) : new URL(import.meta.url);
    })(), { type: "module", workerData: "em-pthread", name: "em-pthread" });
    We2.push(e);
  }
  var Fe2, zs2 = (e, t) => {
    G = 0, e = Vr2(e, t), 0 < G ? S = e : Gr2(e);
  }, Ct = [], Dt2 = 0, ce = (e) => -9007199254740992 > e || 9007199254740992 < e ? NaN : Number(e);
  function Vs2(e) {
    var t = new gr(e >>>= 0);
    return (p(), X)[t.Rc + 12 >>> 0] == 0 && (Tn(t, true), Dt2--), vn(t, false), Ct.push(t), Po2(e);
  }
  var ft = 0, js2 = () => {
    N(0, 0);
    var e = Ct.pop();
    Co2(e.Yc), ft = 0;
  };
  function Tn(e, t) {
    t = t ? 1 : 0, (p(), X)[e.Rc + 12 >>> 0] = t;
  }
  function vn(e, t) {
    t = t ? 1 : 0, (p(), X)[e.Rc + 13 >>> 0] = t;
  }
  class gr {
    constructor(t) {
      this.Yc = t, this.Rc = t - 24;
    }
  }
  var Tr2 = (e) => {
    var t = ft;
    if (!t) return St2(0), 0;
    var n = new gr(t);
    (p(), A)[n.Rc + 16 >>> 2 >>> 0] = t;
    var o = (p(), A)[n.Rc + 4 >>> 2 >>> 0];
    if (!o) return St2(0), t;
    for (var u of e) {
      if (u === 0 || u === o) break;
      if (Do2(u, o, n.Rc + 16)) return St2(u), t;
    }
    return St2(o), t;
  };
  function Hs2() {
    return Tr2([]);
  }
  function qs2(e) {
    return Tr2([e >>> 0]);
  }
  function Ys2(e, t, n, o) {
    return Tr2([e >>> 0, t >>> 0, n >>> 0, o >>> 0]);
  }
  var Js2 = () => {
    var e = Ct.pop();
    e || Te("no exception to throw");
    var t = e.Yc;
    throw (p(), X)[e.Rc + 13 >>> 0] == 0 && (Ct.push(e), vn(e, true), Tn(e, false), Dt2++), zr2(t), ft = t;
  };
  function Xs2(e, t, n) {
    var o = new gr(e >>>= 0);
    throw t >>>= 0, n >>>= 0, (p(), A)[o.Rc + 16 >>> 2 >>> 0] = 0, (p(), A)[o.Rc + 4 >>> 2 >>> 0] = t, (p(), A)[o.Rc + 8 >>> 2 >>> 0] = n, zr2(e), Dt2++, ft = e;
  }
  var Zs2 = () => Dt2;
  function En(e, t, n, o) {
    return i ? V2(2, 1, e, t, n, o) : Sn(e, t, n, o);
  }
  function Sn(e, t, n, o) {
    if (e >>>= 0, t >>>= 0, n >>>= 0, o >>>= 0, !globalThis.SharedArrayBuffer) return 6;
    var u = [];
    return i && u.length === 0 ? En(e, t, n, o) : (e = { he: n, Oc: e, Xc: o, Zc: u }, i ? (e.Pc = "spawnThread", postMessage(e, u), 0) : K(e));
  }
  function Ks2(e) {
    throw ft ||= e >>> 0, ft;
  }
  var An = globalThis.TextDecoder && new TextDecoder(), In = (e, t, n, o) => {
    if (n = t + n, o) return n;
    for (; e[t] && !(t >= n); ) ++t;
    return t;
  }, xn = (e, t = 0, n, o) => {
    if (16 < (n = In(e, t >>>= 0, n, o)) - t && e.buffer && An) return An.decode(e.buffer instanceof ArrayBuffer ? e.subarray(t, n) : e.slice(t, n));
    for (o = ""; t < n; ) {
      var u = e[t++];
      if (128 & u) {
        var c = 63 & e[t++];
        if ((224 & u) == 192) o += String.fromCharCode((31 & u) << 6 | c);
        else {
          var h = 63 & e[t++];
          65536 > (u = (240 & u) == 224 ? (15 & u) << 12 | c << 6 | h : (7 & u) << 18 | c << 12 | h << 6 | 63 & e[t++]) ? o += String.fromCharCode(u) : (u -= 65536, o += String.fromCharCode(55296 | u >> 10, 56320 | 1023 & u));
        }
      } else o += String.fromCharCode(u);
    }
    return o;
  }, ct = (e, t, n) => (e >>>= 0) ? xn((p(), J2), e, t, n) : "";
  function Ln(e, t, n) {
    return i ? V2(3, 1, e, t, n) : 0;
  }
  function Bn(e, t) {
    if (i) return V2(4, 1, e, t);
  }
  function On(e, t) {
    if (i) return V2(5, 1, e, t);
  }
  function Mn(e, t, n) {
    if (i) return V2(6, 1, e, t, n);
  }
  function Un(e, t, n) {
    return i ? V2(7, 1, e, t, n) : 0;
  }
  function Cn(e, t) {
    if (i) return V2(8, 1, e, t);
  }
  function Dn(e, t, n) {
    if (i) return V2(9, 1, e, t, n);
  }
  function Pn(e, t, n, o) {
    if (i) return V2(10, 1, e, t, n, o);
  }
  function _n(e, t, n, o) {
    if (i) return V2(11, 1, e, t, n, o);
  }
  function Rn(e, t, n, o) {
    if (i) return V2(12, 1, e, t, n, o);
  }
  function Nn(e) {
    if (i) return V2(13, 1, e);
  }
  function kn(e, t) {
    if (i) return V2(14, 1, e, t);
  }
  function Wn2(e, t, n) {
    if (i) return V2(15, 1, e, t, n);
  }
  var Qs2 = () => Te(""), Oe2 = (e) => {
    e >>>= 0;
    for (var t = ""; ; ) {
      var n = (p(), J2)[e++ >>> 0];
      if (!n) return t;
      t += String.fromCharCode(n);
    }
  }, vr = {}, Er2 = {}, dt2 = class extends Error {
    constructor(e) {
      super(e), this.name = "BindingError";
    }
  };
  function De2(e, t, n = {}) {
    return (function(o, u, c = {}) {
      var h = u.name;
      if (!o) throw new dt2(`type "${h}" must have a positive integer typeid pointer`);
      if (Er2.hasOwnProperty(o)) {
        if (c.fe) return;
        throw new dt2(`Cannot register type '${h}' twice`);
      }
      Er2[o] = u, vr.hasOwnProperty(o) && (u = vr[o], delete vr[o], u.forEach((b) => b()));
    })(e, t, n);
  }
  var Fn2 = (e, t, n) => {
    switch (t) {
      case 1:
        return n ? (o) => (p(), X)[o >>> 0] : (o) => (p(), J2)[o >>> 0];
      case 2:
        return n ? (o) => (p(), Ce2)[o >>> 1 >>> 0] : (o) => (p(), Z)[o >>> 1 >>> 0];
      case 4:
        return n ? (o) => (p(), x)[o >>> 2 >>> 0] : (o) => (p(), A)[o >>> 2 >>> 0];
      case 8:
        return n ? (o) => (p(), me2)[o >>> 3 >>> 0] : (o) => (p(), Y)[o >>> 3 >>> 0];
      default:
        throw new TypeError(`invalid integer width (${t}): ${e}`);
    }
  };
  function ti(e, t, n, o, u) {
    e >>>= 0, n >>>= 0, t = Oe2(t >>> 0);
    let c = (h) => h;
    if (o = o === 0n) {
      let h = 8 * n;
      c = (b) => BigInt.asUintN(h, b), u = c(u);
    }
    De2(e, { name: t, Nc: c, Tc: (h, b) => (typeof b == "number" && (b = BigInt(b)), b), Sc: Fn2(t, n, !o), Uc: null });
  }
  function ri(e, t, n, o) {
    De2(e >>>= 0, { name: t = Oe2(t >>> 0), Nc: function(u) {
      return !!u;
    }, Tc: function(u, c) {
      return c ? n : o;
    }, Sc: function(u) {
      return this.Nc((p(), J2)[u >>> 0]);
    }, Uc: null });
  }
  var Gn2 = [], Xe2 = [0, 1, , 1, null, 1, true, 1, false, 1];
  function Sr2(e) {
    9 < (e >>>= 0) && --Xe2[e + 1] === 0 && (Xe2[e] = void 0, Gn2.push(e));
  }
  var ve = (e) => {
    if (!e) throw new dt2(`Cannot use deleted val. handle = ${e}`);
    return Xe2[e];
  }, Ie = (e) => {
    switch (e) {
      case void 0:
        return 2;
      case null:
        return 4;
      case true:
        return 6;
      case false:
        return 8;
      default:
        let t = Gn2.pop() || Xe2.length;
        return Xe2[t] = e, Xe2[t + 1] = 1, t;
    }
  };
  function Ar2(e) {
    return this.Nc((p(), A)[e >>> 2 >>> 0]);
  }
  var ni = { name: "emscripten::val", Nc: (e) => {
    var t = ve(e);
    return Sr2(e), t;
  }, Tc: (e, t) => Ie(t), Sc: Ar2, Uc: null };
  function oi(e) {
    return De2(e >>> 0, ni);
  }
  var ai = (e, t) => {
    switch (t) {
      case 4:
        return function(n) {
          return this.Nc((p(), _)[n >>> 2 >>> 0]);
        };
      case 8:
        return function(n) {
          return this.Nc((p(), ae)[n >>> 3 >>> 0]);
        };
      default:
        throw new TypeError(`invalid float width (${t}): ${e}`);
    }
  };
  function si(e, t, n) {
    n >>>= 0, De2(e >>>= 0, { name: t = Oe2(t >>> 0), Nc: (o) => o, Tc: (o, u) => u, Sc: ai(t, n), Uc: null });
  }
  function ii(e, t, n, o, u) {
    e >>>= 0, n >>>= 0, t = Oe2(t >>> 0);
    let c = (b) => b;
    if (o === 0) {
      var h = 32 - 8 * n;
      c = (b) => b << h >>> h, u = c(u);
    }
    De2(e, { name: t, Nc: c, Tc: (b, E) => E, Sc: Fn2(t, n, o !== 0), Uc: null });
  }
  function ui(e, t, n) {
    function o(c) {
      var h = (p(), A)[c >>> 2 >>> 0];
      return c = (p(), A)[c + 4 >>> 2 >>> 0], new u((p(), X).buffer, c, h);
    }
    var u = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array, BigInt64Array, BigUint64Array][t];
    De2(e >>>= 0, { name: n = Oe2(n >>> 0), Nc: o, Sc: o }, { fe: true });
  }
  var Pe = (e, t, n) => {
    var o = (p(), J2);
    if (t >>>= 0, 0 < n) {
      var u = t;
      n = t + n - 1;
      for (var c = 0; c < e.length; ++c) {
        var h = e.codePointAt(c);
        if (127 >= h) {
          if (t >= n) break;
          o[t++ >>> 0] = h;
        } else if (2047 >= h) {
          if (t + 1 >= n) break;
          o[t++ >>> 0] = 192 | h >> 6, o[t++ >>> 0] = 128 | 63 & h;
        } else if (65535 >= h) {
          if (t + 2 >= n) break;
          o[t++ >>> 0] = 224 | h >> 12, o[t++ >>> 0] = 128 | h >> 6 & 63, o[t++ >>> 0] = 128 | 63 & h;
        } else {
          if (t + 3 >= n) break;
          o[t++ >>> 0] = 240 | h >> 18, o[t++ >>> 0] = 128 | h >> 12 & 63, o[t++ >>> 0] = 128 | h >> 6 & 63, o[t++ >>> 0] = 128 | 63 & h, c++;
        }
      }
      o[t >>> 0] = 0, e = t - u;
    } else e = 0;
    return e;
  }, _e2 = (e) => {
    for (var t = 0, n = 0; n < e.length; ++n) {
      var o = e.charCodeAt(n);
      127 >= o ? t++ : 2047 >= o ? t += 2 : 55296 <= o && 57343 >= o ? (t += 4, ++n) : t += 3;
    }
    return t;
  };
  function fi(e, t) {
    De2(e >>>= 0, { name: t = Oe2(t >>> 0), Nc(n) {
      var o = (p(), A)[n >>> 2 >>> 0];
      return o = ct(n + 4, o, true), xe(n), o;
    }, Tc(n, o) {
      o instanceof ArrayBuffer && (o = new Uint8Array(o));
      var u = typeof o == "string";
      if (!(u || ArrayBuffer.isView(o) && o.BYTES_PER_ELEMENT == 1)) throw new dt2("Cannot pass non-string to std::string");
      var c = u ? _e2(o) : o.length, h = pt2(4 + c + 1), b = h + 4;
      return (p(), A)[h >>> 2 >>> 0] = c, u ? Pe(o, b, c + 1) : (p(), J2).set(o, b >>> 0), n !== null && n.push(xe, h), h;
    }, Sc: Ar2, Uc(n) {
      xe(n);
    } });
  }
  var $n = globalThis.TextDecoder ? new TextDecoder("utf-16le") : void 0, ci = (e, t, n) => {
    if (e >>>= 1, 16 < (t = In((p(), Z), e, t / 2, n)) - e && $n) return $n.decode((p(), Z).slice(e, t));
    for (n = ""; e < t; ++e) {
      var o = (p(), Z)[e >>> 0];
      n += String.fromCharCode(o);
    }
    return n;
  }, di = (e, t, n) => {
    if (n ??= 2147483647, 2 > n) return 0;
    var o = t;
    n = (n -= 2) < 2 * e.length ? n / 2 : e.length;
    for (var u = 0; u < n; ++u) {
      var c = e.charCodeAt(u);
      (p(), Ce2)[t >>> 1 >>> 0] = c, t += 2;
    }
    return (p(), Ce2)[t >>> 1 >>> 0] = 0, t - o;
  }, li = (e) => 2 * e.length, pi = (e, t, n) => {
    var o = "";
    e >>>= 2;
    for (var u = 0; !(u >= t / 4); u++) {
      var c = (p(), A)[e + u >>> 0];
      if (!c && !n) break;
      o += String.fromCodePoint(c);
    }
    return o;
  }, mi = (e, t, n) => {
    if (t >>>= 0, n ??= 2147483647, 4 > n) return 0;
    var o = t;
    n = o + n - 4;
    for (var u = 0; u < e.length; ++u) {
      var c = e.codePointAt(u);
      if (65535 < c && u++, (p(), x)[t >>> 2 >>> 0] = c, (t += 4) + 4 > n) break;
    }
    return (p(), x)[t >>> 2 >>> 0] = 0, t - o;
  }, hi = (e) => {
    for (var t = 0, n = 0; n < e.length; ++n) 65535 < e.codePointAt(n) && n++, t += 4;
    return t;
  };
  function yi(e, t, n) {
    if (e >>>= 0, t >>>= 0, n = Oe2(n >>>= 0), t === 2) var o = ci, u = di, c = li;
    else o = pi, u = mi, c = hi;
    De2(e, { name: n, Nc: (h) => {
      var b = (p(), A)[h >>> 2 >>> 0];
      return b = o(h + 4, b * t, true), xe(h), b;
    }, Tc: (h, b) => {
      if (typeof b != "string") throw new dt2(`Cannot pass non-string to C++ string type ${n}`);
      var E = c(b), I = pt2(4 + E + t);
      return (p(), A)[I >>> 2 >>> 0] = E / t, u(b, I + 4, E + t), h !== null && h.push(xe, I), I;
    }, Sc: Ar2, Uc(h) {
      xe(h);
    } });
  }
  function bi(e, t) {
    De2(e >>>= 0, { ge: true, name: t = Oe2(t >>> 0), Nc: () => {
    }, Tc: () => {
    } });
  }
  function wi(e) {
    Fr2(e >>> 0, !f, 1, !s, 131072, false), bn2();
  }
  var he = (e) => {
    if (!W2) try {
      if (e(), !(0 < G)) try {
        i ? Ft2() && Gr2(S) : wr(S);
      } catch (t) {
        t instanceof wt2 || t == "unwind" || y(0, t);
      }
    } catch (t) {
      t instanceof wt2 || t == "unwind" || y(0, t);
    }
  }, gi = !Atomics.waitAsync || globalThis.navigator?.userAgent && 91 > Number((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./) || [])[2]);
  function Ir2(e) {
    e >>>= 0, gi || (Atomics.waitAsync((p(), x), e >>> 2, e).value.then(Pt2), e += 128, Atomics.store((p(), x), e >>> 2, 1));
  }
  var Pt2 = () => he(() => {
    var e = Ft2();
    e && (Ir2(e), Mo2());
  });
  function Ti(e, t) {
    (e >>>= 0) == t >>> 0 ? setTimeout(Pt2) : i ? postMessage({ Wc: e, Pc: "checkMailbox" }) : (e = Je[e]) && e.postMessage({ Pc: "checkMailbox" });
  }
  var xr2 = [];
  function vi(e, t, n, o, u) {
    for (t >>>= 0, u >>>= 0, xr2.length = 0, n = u >>> 3, o = u + o >>> 3; n < o; ) {
      var c;
      c = (p(), me2)[n++ >>> 0] ? (p(), me2)[n++ >>> 0] : (p(), ae)[n++ >>> 0], xr2.push(c);
    }
    return (t ? jr2[t] : af[e])(...xr2);
  }
  var Ei = () => {
    G = 0;
  };
  function Si(e) {
    e >>>= 0, i ? postMessage({ Pc: "cleanupThread", je: e }) : yn2(Je[e]);
  }
  function Ai(e) {
  }
  var _t2 = (e) => {
    try {
      e();
    } catch (t) {
      Te(t);
    }
  };
  function Ii(e) {
    var t = (...n) => {
      Rt2.push(e);
      try {
        return e(...n);
      } finally {
        W2 || (Rt2.pop(), Me && Ge2 === 1 && Rt2.length === 0 && (Ge2 = 0, G += 1, _t2(wa), typeof Fibers < "u" && Fibers.De()));
      }
    };
    return jn2.set(e, t), t;
  }
  var Ge2 = 0, Me = null, zn = 0, Rt2 = [], Lr2 = /* @__PURE__ */ new Map(), Vn = /* @__PURE__ */ new Map(), jn2 = /* @__PURE__ */ new Map(), xi = 0, Br2 = null, Li = [], Hn2 = (e) => (function(t) {
    if (!W2) {
      if (Ge2 === 0) {
        var n = false, o = false;
        t((u = 0) => {
          if (!W2 && (zn = u, n = true, o)) {
            Ge2 = 2, _t2(() => ga(Me)), typeof MainLoop < "u" && MainLoop.Yd && MainLoop.resume(), u = false;
            try {
              var c = (function() {
                var E = (p(), x)[Me + 8 >>> 2 >>> 0];
                return E = Vn.get(E), E = jn2.get(E), --G, E();
              })();
            } catch (E) {
              c = E, u = true;
            }
            var h = false;
            if (!Me) {
              var b = Br2;
              b && (Br2 = null, (u ? b.reject : b.resolve)(c), h = true);
            }
            if (u && !h) throw c;
          }
        }), o = true, n || (Ge2 = 1, Me = (function() {
          var u = pt2(65548), c = u + 12;
          if ((p(), A)[u >>> 2 >>> 0] = c, (p(), A)[u + 4 >>> 2 >>> 0] = c + 65536, c = Rt2[0], !Lr2.has(c)) {
            var h = xi++;
            Lr2.set(c, h), Vn.set(h, c);
          }
          return c = Lr2.get(c), (p(), x)[u + 8 >>> 2 >>> 0] = c, u;
        })(), typeof MainLoop < "u" && MainLoop.Yd && MainLoop.pause(), _t2(() => ba(Me)));
      } else Ge2 === 2 ? (Ge2 = 0, _t2(Ta), xe(Me), Me = null, Li.forEach(he)) : Te(`invalid state: ${Ge2}`);
      return zn;
    }
  })((t) => {
    e().then(t);
  });
  function Bi(e) {
    return e >>>= 0, Hn2(async () => {
      var t = await ve(e);
      return Ie(t);
    });
  }
  var Or2 = [], Oi = (e) => {
    var t = Or2.length;
    return Or2.push(e), t;
  }, Mi = (e, t) => {
    for (var n = Array(e), o = 0; o < e; ++o) {
      var u = o, c = (p(), A)[t + 4 * o >>> 2 >>> 0], h = Er2[c];
      if (h === void 0) throw e = `parameter ${o}`, c = lo2(c), t = Oe2(c), xe(c), new dt2(`${e} has unknown type ${t}`);
      n[u] = h;
    }
    return n;
  }, Ui = (e, t, n) => {
    var o = [];
    return e = e(o, n), o.length && ((p(), A)[t >>> 2 >>> 0] = Ie(o)), e;
  }, Ci = {}, Nt = (e) => {
    var t = Ci[e];
    return t === void 0 ? Oe2(e) : t;
  };
  function Di(e, t, n) {
    var [o, ...u] = Mi(e, t >>> 0);
    t = o.Tc.bind(o);
    var c = u.map((E) => E.Sc.bind(E));
    e--;
    var h = { toValue: ve };
    switch (e = c.map((E, I) => {
      var F = `argFromPtr${I}`;
      return h[F] = E, `${F}(args${I ? "+" + 8 * I : ""})`;
    }), n) {
      case 0:
        var b = "toValue(handle)";
        break;
      case 2:
        b = "new (toValue(handle))";
        break;
      case 3:
        b = "";
        break;
      case 1:
        h.getStringOrSymbol = Nt, b = "toValue(handle)[getStringOrSymbol(methodName)]";
    }
    return b += `(${e})`, o.ge || (h.toReturnWire = t, h.emval_returnValue = Ui, b = `return emval_returnValue(toReturnWire, destructorsRef, ${b})`), b = `return function (handle, methodName, destructorsRef, args) {
  ${b}
  }`, n = new Function(Object.keys(h), b)(...Object.values(h)), b = `methodCaller<(${u.map((E) => E.name)}) => ${o.name}>`, Oi(Object.defineProperty(n, "name", { value: b }));
  }
  function Pi(e, t) {
    return t >>>= 0, (e = ve(e >>> 0)) == ve(t);
  }
  function _i(e) {
    return (e >>>= 0) ? (e = Nt(e), Ie(globalThis[e])) : Ie(globalThis);
  }
  function Ri(e) {
    return e = Nt(e >>> 0), Ie(r[e]);
  }
  function Ni(e, t) {
    return t >>>= 0, e = ve(e >>> 0), t = ve(t), Ie(e[t]);
  }
  function ki(e) {
    9 < (e >>>= 0) && (Xe2[e + 1] += 1);
  }
  function qn2(e, t, n, o, u) {
    return Or2[e >>> 0](t >>> 0, n >>> 0, o >>> 0, u >>> 0);
  }
  function Wi(e, t, n, o, u) {
    return qn2(e >>> 0, t >>> 0, n >>> 0, o >>> 0, u >>> 0);
  }
  function Fi() {
    return Ie([]);
  }
  function Gi(e) {
    e = ve(e >>> 0);
    for (var t = Array(e.length), n = 0; n < e.length; n++) t[n] = e[n];
    return Ie(t);
  }
  function $i(e) {
    return Ie(Nt(e >>> 0));
  }
  function zi() {
    return Ie({});
  }
  function Vi(e) {
    for (var t = ve(e >>>= 0); t.length; ) {
      var n = t.pop();
      t.pop()(n);
    }
    Sr2(e);
  }
  function ji(e, t, n) {
    t >>>= 0, n >>>= 0, e = ve(e >>> 0), t = ve(t), n = ve(n), e[t] = n;
  }
  function Hi(e, t) {
    e = ce(e), t >>>= 0, e = new Date(1e3 * e), (p(), x)[t >>> 2 >>> 0] = e.getUTCSeconds(), (p(), x)[t + 4 >>> 2 >>> 0] = e.getUTCMinutes(), (p(), x)[t + 8 >>> 2 >>> 0] = e.getUTCHours(), (p(), x)[t + 12 >>> 2 >>> 0] = e.getUTCDate(), (p(), x)[t + 16 >>> 2 >>> 0] = e.getUTCMonth(), (p(), x)[t + 20 >>> 2 >>> 0] = e.getUTCFullYear() - 1900, (p(), x)[t + 24 >>> 2 >>> 0] = e.getUTCDay(), e = (e.getTime() - Date.UTC(e.getUTCFullYear(), 0, 1, 0, 0, 0, 0)) / 864e5 | 0, (p(), x)[t + 28 >>> 2 >>> 0] = e;
  }
  var Yn2 = (e) => e % 4 == 0 && (e % 100 != 0 || e % 400 == 0), Jn2 = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335], Xn2 = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  function qi(e, t) {
    e = ce(e), t >>>= 0, e = new Date(1e3 * e), (p(), x)[t >>> 2 >>> 0] = e.getSeconds(), (p(), x)[t + 4 >>> 2 >>> 0] = e.getMinutes(), (p(), x)[t + 8 >>> 2 >>> 0] = e.getHours(), (p(), x)[t + 12 >>> 2 >>> 0] = e.getDate(), (p(), x)[t + 16 >>> 2 >>> 0] = e.getMonth(), (p(), x)[t + 20 >>> 2 >>> 0] = e.getFullYear() - 1900, (p(), x)[t + 24 >>> 2 >>> 0] = e.getDay();
    var n = (Yn2(e.getFullYear()) ? Jn2 : Xn2)[e.getMonth()] + e.getDate() - 1 | 0;
    (p(), x)[t + 28 >>> 2 >>> 0] = n, (p(), x)[t + 36 >>> 2 >>> 0] = -60 * e.getTimezoneOffset(), n = new Date(e.getFullYear(), 6, 1).getTimezoneOffset();
    var o = new Date(e.getFullYear(), 0, 1).getTimezoneOffset();
    e = 0 | (n != o && e.getTimezoneOffset() == Math.min(o, n)), (p(), x)[t + 32 >>> 2 >>> 0] = e;
  }
  function Yi(e) {
    e >>>= 0;
    var t = new Date((p(), x)[e + 20 >>> 2 >>> 0] + 1900, (p(), x)[e + 16 >>> 2 >>> 0], (p(), x)[e + 12 >>> 2 >>> 0], (p(), x)[e + 8 >>> 2 >>> 0], (p(), x)[e + 4 >>> 2 >>> 0], (p(), x)[e >>> 2 >>> 0], 0), n = (p(), x)[e + 32 >>> 2 >>> 0], o = t.getTimezoneOffset(), u = new Date(t.getFullYear(), 6, 1).getTimezoneOffset(), c = new Date(t.getFullYear(), 0, 1).getTimezoneOffset(), h = Math.min(c, u);
    return 0 > n ? (p(), x)[e + 32 >>> 2 >>> 0] = +(u != c && h == o) : 0 < n != (h == o) && (u = Math.max(c, u), t.setTime(t.getTime() + 6e4 * ((0 < n ? h : u) - o))), (p(), x)[e + 24 >>> 2 >>> 0] = t.getDay(), n = (Yn2(t.getFullYear()) ? Jn2 : Xn2)[t.getMonth()] + t.getDate() - 1 | 0, (p(), x)[e + 28 >>> 2 >>> 0] = n, (p(), x)[e >>> 2 >>> 0] = t.getSeconds(), (p(), x)[e + 4 >>> 2 >>> 0] = t.getMinutes(), (p(), x)[e + 8 >>> 2 >>> 0] = t.getHours(), (p(), x)[e + 12 >>> 2 >>> 0] = t.getDate(), (p(), x)[e + 16 >>> 2 >>> 0] = t.getMonth(), (p(), x)[e + 20 >>> 2 >>> 0] = t.getYear(), e = t.getTime(), BigInt(isNaN(e) ? -1 : e / 1e3);
  }
  function Zn2(e, t, n, o, u, c, h) {
    return i ? V2(16, 1, e, t, n, o, u, c, h) : -52;
  }
  function Kn2(e, t, n, o, u, c) {
    if (i) return V2(17, 1, e, t, n, o, u, c);
  }
  var Tt2 = {}, Ji = () => performance.timeOrigin + performance.now();
  function Qn2(e, t) {
    if (i) return V2(18, 1, e, t);
    if (Tt2[e] && (clearTimeout(Tt2[e].id), delete Tt2[e]), !t) return 0;
    var n = setTimeout(() => {
      delete Tt2[e], he(() => Oo2(e, performance.timeOrigin + performance.now()));
    }, t);
    return Tt2[e] = { id: n, Ce: t }, 0;
  }
  function Xi(e, t, n, o) {
    e >>>= 0, t >>>= 0, n >>>= 0, o >>>= 0;
    var u = (/* @__PURE__ */ new Date()).getFullYear(), c = new Date(u, 0, 1).getTimezoneOffset();
    u = new Date(u, 6, 1).getTimezoneOffset();
    var h = Math.max(c, u);
    (p(), A)[e >>> 2 >>> 0] = 60 * h, (p(), x)[t >>> 2 >>> 0] = +(c != u), e = (t = (b) => {
      var E = Math.abs(b);
      return `UTC${0 <= b ? "-" : "+"}${String(Math.floor(E / 60)).padStart(2, "0")}${String(E % 60).padStart(2, "0")}`;
    })(c), t = t(u), u < c ? (Pe(e, n, 17), Pe(t, o, 17)) : (Pe(e, o, 17), Pe(t, n, 17));
  }
  var Zi = () => Date.now();
  function Qi(e, t, n) {
    if (n >>>= 0, !(0 <= e && 3 >= e)) return 28;
    if (e === 0) e = Date.now();
    else {
      e = performance.timeOrigin + performance.now();
    }
    return e = Math.round(1e6 * e), (p(), me2)[n >>> 3 >>> 0] = BigInt(e), 0;
  }
  var Mr2 = [], eo2 = (e, t) => {
    Mr2.length = 0;
    for (var n; n = (p(), J2)[e++ >>> 0]; ) {
      var o = n != 105;
      t += (o &= n != 112) && t % 8 ? 4 : 0, Mr2.push(n == 112 ? (p(), A)[t >>> 2 >>> 0] : n == 106 ? (p(), me2)[t >>> 3 >>> 0] : n == 105 ? (p(), x)[t >>> 2 >>> 0] : (p(), ae)[t >>> 3 >>> 0]), t += o ? 8 : 4;
    }
    return Mr2;
  };
  function eu2(e, t, n) {
    return e >>>= 0, t = eo2(t >>> 0, n >>> 0), jr2[e](...t);
  }
  function tu2(e, t, n) {
    return e >>>= 0, t = eo2(t >>> 0, n >>> 0), jr2[e](...t);
  }
  var ru2 = () => {
  };
  function nu2(e, t) {
    return B(ct(e >>> 0, t >>> 0));
  }
  var ou2 = () => {
    throw G += 1, "unwind";
  };
  function au2() {
    return 4294901760;
  }
  var su2 = () => 1, iu2 = () => navigator.hardwareConcurrency;
  function uu2(e) {
    e >>>= 0;
    var t = (p(), J2).length;
    if (e <= t || 4294901760 < e) return false;
    for (var n = 1; 4 >= n; n *= 2) {
      var o = t * (1 + 0.2 / n);
      o = Math.min(o, e + 100663296);
      e: {
        o = (Math.min(4294901760, 65536 * Math.ceil(Math.max(e, o) / 65536)) - Fe2.buffer.byteLength + 65535) / 65536 | 0;
        try {
          Fe2.grow(o), se();
          var u = 1;
          break e;
        } catch {
        }
        u = void 0;
      }
      if (u) return true;
    }
    return false;
  }
  var Ue2 = (e) => {
    var t = _e2(e) + 1, n = Gt2(t);
    return Pe(e, n, t), n;
  }, Ur2 = (e, t) => {
    (p(), A)[e >>> 2 >>> 0] = t;
    var n = (p(), A)[e >>> 2 >>> 0];
    (p(), A)[e + 4 >>> 2 >>> 0] = (t - n) / 4294967296;
  }, vt2 = (e) => (p(), A)[e >>> 2 >>> 0] + 4294967296 * (p(), x)[e + 4 >>> 2 >>> 0], de = [], fu2 = (e, t) => {
    de[e >>> 0] = t;
  }, Re2 = [], kt2 = [], lt = (e, t) => {
    kt2[e] = new Promise((n) => t.finally(() => n(e)));
  }, L = (e) => {
    if (e) return de[e >>> 0];
  }, cu2 = (e, t) => {
    for (e = (p(), A)[e >>> 2 >>> 0]; e; e = (p(), A)[e >>> 2 >>> 0]) t[(p(), x)[e + 4 >>> 2 >>> 0]](e);
  }, Wt2 = (e, t, n) => {
    (p(), A)[e >>> 2 >>> 0] = t, (p(), A)[e + 4 >>> 2 >>> 0] = n;
  }, to2 = (e) => {
    var t = (p(), A)[e >>> 2 >>> 0];
    return e = (p(), A)[e + 4 >>> 2 >>> 0], ct(t, e);
  }, Ne = (e) => {
    var t = (p(), A)[e >>> 2 >>> 0];
    return e = (p(), A)[e + 4 >>> 2 >>> 0], t ? ct(t, e) : e === 0 ? "" : void 0;
  }, du2 = (e) => {
    var t = Ne(e + 4), n = (n = (p(), A)[e + 12 >>> 2 >>> 0]) ? L(n) : "auto";
    if (e += 16) {
      var o = L((p(), A)[e + 4 >>> 2 >>> 0]), u = (p(), A)[e + 16 >>> 2 >>> 0], c = (p(), A)[e + 20 >>> 2 >>> 0];
      if (u) {
        for (var h = {}, b = 0; b < u; ++b) {
          var E = c + 24 * b;
          h[to2(E + 4)] = (p(), ae)[E + 16 >>> 3 >>> 0];
        }
        u = h;
      } else u = void 0;
      e = { module: o, constants: u, entryPoint: Ne(e + 8) };
    } else e = void 0;
    return { label: t, layout: n, compute: e };
  }, ro2 = (e, t) => {
    function n(o, u) {
      o = e[o], (p(), A)[t + u >>> 2 >>> 0] = o;
    }
    n("maxTextureDimension1D", 4), n("maxTextureDimension2D", 8), n("maxTextureDimension3D", 12), n("maxTextureArrayLayers", 16), n("maxBindGroups", 20), n("maxBindGroupsPlusVertexBuffers", 24), n("maxBindingsPerBindGroup", 28), n("maxDynamicUniformBuffersPerPipelineLayout", 32), n("maxDynamicStorageBuffersPerPipelineLayout", 36), n("maxSampledTexturesPerShaderStage", 40), n("maxSamplersPerShaderStage", 44), n("maxStorageBuffersPerShaderStage", 48), n("maxStorageTexturesPerShaderStage", 52), n("maxUniformBuffersPerShaderStage", 56), n("minUniformBufferOffsetAlignment", 80), n("minStorageBufferOffsetAlignment", 84), Ur2(t + 64, e.maxUniformBufferBindingSize), Ur2(t + 72, e.maxStorageBufferBindingSize), n("maxVertexBuffers", 88), Ur2(t + 96, e.maxBufferSize), n("maxVertexAttributes", 104), n("maxVertexBufferArrayStride", 108), n("maxInterStageShaderVariables", 112), n("maxColorAttachments", 116), n("maxColorAttachmentBytesPerSample", 120), n("maxComputeWorkgroupStorageSize", 124), n("maxComputeInvocationsPerWorkgroup", 128), n("maxComputeWorkgroupSizeX", 132), n("maxComputeWorkgroupSizeY", 136), n("maxComputeWorkgroupSizeZ", 140), n("maxComputeWorkgroupsPerDimension", 144), e.Be !== void 0 && n("maxImmediateSize", 148);
  }, lu2 = [, "validation", "out-of-memory", "internal"], pu2 = [, "compatibility", "core"], no2 = { 1: "core-features-and-limits", 2: "depth-clip-control", 3: "depth32float-stencil8", 4: "texture-compression-bc", 5: "texture-compression-bc-sliced-3d", 6: "texture-compression-etc2", 7: "texture-compression-astc", 8: "texture-compression-astc-sliced-3d", 9: "timestamp-query", 10: "indirect-first-instance", 11: "shader-f16", 12: "rg11b10ufloat-renderable", 13: "bgra8unorm-storage", 14: "float32-filterable", 15: "float32-blendable", 16: "clip-distances", 17: "dual-source-blending", 18: "subgroups", 19: "texture-formats-tier1", 20: "texture-formats-tier2", 21: "primitive-index", 22: "texture-component-swizzle", 327692: "chromium-experimental-unorm16-texture-formats", 327729: "chromium-experimental-multi-draw-indirect" }, mu2 = [, "low-power", "high-performance"], hu2 = [, "occlusion", "timestamp"], yu2 = { undefined: 1, unknown: 1, destroyed: 2 };
  function bu2(e, t, n, o, u, c) {
    t = ce(t), n = ce(n), o >>>= 0, u >>>= 0, c >>>= 0;
    var h = L(e >>> 0);
    if (e = {}, c) {
      var b = (p(), A)[c + 12 >>> 2 >>> 0];
      if (b) {
        var E = (p(), A)[c + 16 >>> 2 >>> 0];
        e.requiredFeatures = Array.from((p(), A).subarray(E >>> 2 >>> 0, E + 4 * b >>> 2 >>> 0), (O2) => no2[O2]);
      }
      var I = (p(), A)[c + 20 >>> 2 >>> 0];
      if (I) {
        let O2 = function(ye2, fe2, Ze2 = false) {
          fe2 = I + fe2, (fe2 = (p(), A)[fe2 >>> 2 >>> 0]) == 4294967295 || Ze2 && fe2 == 0 || (F[ye2] = fe2);
        }, ue = function(ye2, fe2) {
          fe2 = I + fe2;
          var Ze2 = (p(), A)[fe2 >>> 2 >>> 0], Vf2 = (p(), A)[fe2 + 4 >>> 2 >>> 0];
          Ze2 == 4294967295 && Vf2 == 4294967295 || (F[ye2] = vt2(fe2));
        };
        var F = {};
        O2("maxTextureDimension1D", 4), O2("maxTextureDimension2D", 8), O2("maxTextureDimension3D", 12), O2("maxTextureArrayLayers", 16), O2("maxBindGroups", 20), O2("maxBindGroupsPlusVertexBuffers", 24), O2("maxDynamicUniformBuffersPerPipelineLayout", 32), O2("maxDynamicStorageBuffersPerPipelineLayout", 36), O2("maxSampledTexturesPerShaderStage", 40), O2("maxSamplersPerShaderStage", 44), O2("maxStorageBuffersPerShaderStage", 48), O2("maxStorageTexturesPerShaderStage", 52), O2("maxUniformBuffersPerShaderStage", 56), O2("minUniformBufferOffsetAlignment", 80), O2("minStorageBufferOffsetAlignment", 84), ue("maxUniformBufferBindingSize", 64), ue("maxStorageBufferBindingSize", 72), O2("maxVertexBuffers", 88), ue("maxBufferSize", 96), O2("maxVertexAttributes", 104), O2("maxVertexBufferArrayStride", 108), O2("maxInterStageShaderVariables", 112), O2("maxColorAttachments", 116), O2("maxColorAttachmentBytesPerSample", 120), O2("maxComputeWorkgroupStorageSize", 124), O2("maxComputeInvocationsPerWorkgroup", 128), O2("maxComputeWorkgroupSizeX", 132), O2("maxComputeWorkgroupSizeY", 136), O2("maxComputeWorkgroupSizeZ", 140), O2("maxComputeWorkgroupsPerDimension", 144), O2("maxImmediateSize", 148, true), e.requiredLimits = F;
      }
      (b = (p(), A)[c + 24 >>> 2 >>> 0]) && (b = { label: Ne(b + 4) }, e.defaultQueue = b), e.label = Ne(c + 4);
    }
    G += 1, lt(t, h.requestDevice(e).then((O2) => {
      --G, he(() => {
        de[u >>> 0] = O2.queue, de[o >>> 0] = O2, G += 1, lt(n, O2.lost.then((ue) => {
          he(() => {
            O2.onuncapturederror = () => {
            };
            var ye2 = P(), fe2 = Ue2(ue.message);
            Rr2(n, yu2[ue.reason], fe2), D(ye2);
          }), --G;
        })), O2.onuncapturederror = (ue) => {
          var ye2 = 5;
          ue.error instanceof GPUValidationError ? ye2 = 2 : ue.error instanceof GPUOutOfMemoryError ? ye2 = 3 : ue.error instanceof GPUInternalError && (ye2 = 4);
          var fe2 = P();
          ue = Ue2(ue.error.message), Io2(o, ye2, ue), D(fe2);
        }, "adapterInfo" in O2 || (O2.adapterInfo = h.info), Wr2(t, 1, o, 0);
      });
    }, (O2) => {
      --G, he(() => {
        var ue = P(), ye2 = Ue2(O2.message);
        Wr2(t, 3, o, ye2), n && Rr2(n, 4, ye2), D(ue);
      });
    }));
  }
  function wu2(e) {
    var t = L(e >>>= 0), n = Re2[e];
    if (n) {
      for (var o = 0; o < n.length; ++o) n[o]();
      delete Re2[e];
    }
    t.destroy();
  }
  function gu2(e, t, n) {
    n >>>= 0;
    var o = L(e >>>= 0);
    n == 4294967295 && (n = void 0);
    try {
      var u = o.getMappedRange(t >>> 0, n);
    } catch {
      return 0;
    }
    var c = $r(16, u.byteLength);
    return (p(), J2).set(new Uint8Array(u), c >>> 0), Re2[e].push(() => xe(c)), c;
  }
  function Tu2(e, t, n) {
    n >>>= 0;
    var o = L(e >>>= 0);
    n == 4294967295 && (n = void 0);
    try {
      var u = o.getMappedRange(t >>> 0, n);
    } catch {
      return 0;
    }
    var c = $r(16, u.byteLength);
    return (p(), J2).fill(0, c, u.byteLength), Re2[e].push(() => {
      new Uint8Array(u).set((p(), J2).subarray(c >>> 0, c + u.byteLength >>> 0)), xe(c);
    }), c;
  }
  function vu2(e, t, n, o, u) {
    e >>>= 0, t = ce(t), n = ce(n), u >>>= 0;
    var c = L(e);
    Re2[e] = [], u == 4294967295 && (u = void 0), G += 1, lt(t, c.mapAsync(n, o >>> 0, u).then(() => {
      --G, he(() => {
        Nr2(t, 1, 0);
      });
    }, (h) => {
      --G, he(() => {
        P();
        var b = Ue2(h.message);
        Nr2(t, h.name === "AbortError" ? 4 : h.name === "OperationError" ? 3 : 0, b), delete Re2[e];
      });
    }));
  }
  function Eu2(e) {
    var t = L(e >>>= 0), n = Re2[e];
    if (n) {
      for (var o = 0; o < n.length; ++o) n[o]();
      delete Re2[e], t.unmap();
    }
  }
  function Su2(e) {
    delete de[e >>> 0];
  }
  function Au2(e, t, n) {
    e >>>= 0, t >>>= 0, n >>>= 0;
    var o = !!(p(), A)[t + 32 >>> 2 >>> 0];
    t = { label: Ne(t + 4), usage: (p(), A)[t + 16 >>> 2 >>> 0], size: vt2(t + 24), mappedAtCreation: o }, e = L(e);
    try {
      var u = e.createBuffer(t);
    } catch {
      return false;
    }
    return de[n >>> 0] = u, o && (Re2[n] = []), true;
  }
  function Iu2(e, t, n, o) {
    e >>>= 0, t = ce(t), o >>>= 0, n = du2(n >>> 0), e = L(e), G += 1, lt(t, e.createComputePipelineAsync(n).then((u) => {
      --G, he(() => {
        de[o >>> 0] = u, _r(t, 1, o, 0);
      });
    }, (u) => {
      --G, he(() => {
        var c = P(), h = Ue2(u.message);
        _r(t, u.reason === "validation" ? 3 : u.reason === "internal" ? 4 : 0, o, h), D(c);
      });
    }));
  }
  function xu2(e, t, n) {
    e >>>= 0, t >>>= 0, n >>>= 0;
    var o = (p(), A)[t >>> 2 >>> 0], u = (p(), x)[o + 4 >>> 2 >>> 0];
    t = { label: Ne(t + 4), code: "" }, u === 2 && (t.code = to2(o + 8)), e = L(e).createShaderModule(t), de[n >>> 0] = e;
  }
  var Lu2 = (e) => {
    (e = L(e)).onuncapturederror = null, e.destroy();
  };
  function Bu2(e, t) {
    t = ce(t), e = L(e >>> 0), G += 1, lt(t, e.popErrorScope().then((n) => {
      --G, he(() => {
        var o = 5;
        n ? n instanceof GPUValidationError ? o = 2 : n instanceof GPUOutOfMemoryError ? o = 3 : n instanceof GPUInternalError && (o = 4) : o = 1;
        var u = P(), c = n ? Ue2(n.message) : 0;
        kr2(t, 1, o, c), D(u);
      });
    }, (n) => {
      --G, he(() => {
        var o = P(), u = Ue2(n.message);
        kr2(t, 1, 5, u), D(o);
      });
    }));
  }
  function Ou2(e, t, n, o) {
    if (t = ce(t), o >>>= 0, n >>>= 0) {
      var u = { featureLevel: pu2[(p(), x)[n + 4 >>> 2 >>> 0]], powerPreference: mu2[(p(), x)[n + 8 >>> 2 >>> 0]], forceFallbackAdapter: !!(p(), A)[n + 12 >>> 2 >>> 0] };
      (e = (p(), A)[n >>> 2 >>> 0]) !== 0 && (p(), u.Fe = !!(p(), A)[e + 8 >>> 2 >>> 0]);
    }
    "gpu" in navigator ? (G += 1, lt(t, navigator.gpu.requestAdapter(u).then((c) => {
      --G, he(() => {
        if (c) de[o >>> 0] = c, Et2(t, 1, o, 0);
        else {
          var h = P(), b = Ue2("WebGPU not available on this browser (requestAdapter returned null)");
          Et2(t, 3, o, b), D(h);
        }
      });
    }, (c) => {
      --G, he(() => {
        var h = P(), b = Ue2(c.message);
        Et2(t, 4, o, b), D(h);
      });
    }))) : (u = P(), e = Ue2("WebGPU not available on this browser (navigator.gpu is not available)"), Et2(t, 3, o, e), D(u));
  }
  function Mu2(e, t, n) {
    return e >>>= 0, t >>>= 0, n >>>= 0, Hn2(async () => {
      var o = [];
      if (n) {
        var u = (p(), x)[n >>> 2 >>> 0];
        o.length = t + 1, o[t] = new Promise((b) => setTimeout(b, u, 0));
      } else o.length = t;
      for (var c = 0; c < t; ++c) {
        var h = vt2(e + 8 * c);
        if (!(h in kt2)) return h;
        o[c] = kt2[h];
      }
      return o = await Promise.race(o), delete kt2[o], o;
    });
  }
  var Cr2, Dr2 = {}, oo2 = () => {
    if (!Cr2) {
      var e, t = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: (globalThis.navigator?.language ?? "C").replace("-", "_") + ".UTF-8", _: "./this.program" };
      for (e in Dr2) Dr2[e] === void 0 ? delete t[e] : t[e] = Dr2[e];
      var n = [];
      for (e in t) n.push(`${e}=${t[e]}`);
      Cr2 = n;
    }
    return Cr2;
  };
  function ao2(e, t) {
    if (i) return V2(19, 1, e, t);
    e >>>= 0, t >>>= 0;
    var n, o = 0, u = 0;
    for (n of oo2()) {
      var c = t + o;
      (p(), A)[e + u >>> 2 >>> 0] = c, o += Pe(n, c, 1 / 0) + 1, u += 4;
    }
    return 0;
  }
  function so2(e, t) {
    if (i) return V2(20, 1, e, t);
    e >>>= 0, t >>>= 0;
    var n = oo2();
    for (var o of ((p(), A)[e >>> 2 >>> 0] = n.length, e = 0, n)) e += _e2(o) + 1;
    return (p(), A)[t >>> 2 >>> 0] = e, 0;
  }
  function io2(e) {
    return i ? V2(21, 1, e) : 52;
  }
  function uo2(e, t, n, o) {
    return i ? V2(22, 1, e, t, n, o) : 52;
  }
  function fo2(e, t, n, o) {
    return i ? V2(23, 1, e, t, n, o) : 70;
  }
  var Uu2 = [null, [], []];
  function co2(e, t, n, o) {
    if (i) return V2(24, 1, e, t, n, o);
    t >>>= 0, n >>>= 0, o >>>= 0;
    for (var u = 0, c = 0; c < n; c++) {
      var h = (p(), A)[t >>> 2 >>> 0], b = (p(), A)[t + 4 >>> 2 >>> 0];
      t += 8;
      for (var E = 0; E < b; E++) {
        var I = e, F = (p(), J2)[h + E >>> 0], j2 = Uu2[I];
        F === 0 || F === 10 ? ((I === 1 ? q : B)(xn(j2)), j2.length = 0) : j2.push(F);
      }
      u += b;
    }
    return (p(), A)[o >>> 2 >>> 0] = u, 0;
  }
  function Cu2(e) {
    return e >>> 0;
  }
  function Du2(e, t) {
    return ro2(L(e >>> 0).limits, t >>> 0), 1;
  }
  function Pu2(e, t) {
    return L(e >>> 0).features.has(no2[t]);
  }
  function _u2(e) {
    return BigInt(L(e >>> 0).size);
  }
  function Ru2(e) {
    return BigInt(L(e >>> 0).usage);
  }
  function Nu2(e, t) {
    if (e >>>= 0, t >>>= 0) {
      var n = Ne(t + 4);
      n = { label: n, timestampWrites: t = (t = (p(), A)[t + 12 >>> 2 >>> 0]) !== 0 ? { querySet: L((p(), A)[t + 4 >>> 2 >>> 0]), beginningOfPassWriteIndex: (p(), A)[t + 8 >>> 2 >>> 0], endOfPassWriteIndex: (p(), A)[t + 12 >>> 2 >>> 0] } : void 0 };
    }
    return t = L(e), e = To2(0), n = t.beginComputePass(n), de[e >>> 0] = n, e;
  }
  function ku2(e, t, n, o) {
    n = ce(n), (o = ce(o)) == -1 && (o = void 0), (e = L(e >>> 0)).clearBuffer(L(t >>> 0), n, o);
  }
  function Wu2(e, t, n, o, u, c) {
    n = ce(n), u = ce(u), c = ce(c), L(e >>> 0).copyBufferToBuffer(L(t >>> 0), n, L(o >>> 0), u, c);
  }
  function Fu2(e) {
    var t = L(e >>> 0);
    return e = wo2(0), t = t.finish(), de[e >>> 0] = t, e;
  }
  function Gu2(e, t, n, o, u, c) {
    c = ce(c), L(e >>> 0).resolveQuerySet(L(t >>> 0), n, o, L(u >>> 0), c);
  }
  function $u2(e, t, n, o) {
    L(e >>> 0).dispatchWorkgroups(t, n, o);
  }
  function zu2(e, t, n) {
    n = ce(n), L(e >>> 0).dispatchWorkgroupsIndirect(L(t >>> 0), n);
  }
  function Vu2(e) {
    L(e >>> 0).end();
  }
  function ju2(e, t, n, o, u) {
    o >>>= 0, u >>>= 0, e = L(e >>> 0), n = L(n >>> 0), o == 0 ? e.setBindGroup(t, n) : e.setBindGroup(t, n, (p(), A), u >>> 2, o);
  }
  function Hu2(e, t) {
    L(e >>> 0).setPipeline(L(t >>> 0));
  }
  function qu2(e, t, n) {
    L(e >>> 0).Ee(L(t >>> 0), n);
  }
  function Yu2(e, t) {
    var n = L(e >>> 0);
    return e = bo2(0), t = n.getBindGroupLayout(t), de[e >>> 0] = t, e;
  }
  function Ju2(e, t) {
    function n(u) {
      var c = (p(), A)[u + 8 >>> 2 >>> 0], h = (p(), A)[u + 32 >>> 2 >>> 0], b = (p(), A)[u + 36 >>> 2 >>> 0], E = 0;
      return cu2(u, { 327681: (I) => {
        E = (p(), A)[I + 8 >>> 2 >>> 0];
      } }), c ? ((h = vt2(u + 24)) == -1 && (h = void 0), c = { buffer: L(c), offset: vt2(u + 16), size: h }) : c = L(h || b || E), { binding: (p(), A)[u + 4 >>> 2 >>> 0], resource: c };
    }
    e >>>= 0, t = { label: Ne((t >>>= 0) + 4), layout: L((p(), A)[t + 12 >>> 2 >>> 0]), entries: (function(u, c) {
      for (var h = [], b = 0; b < u; ++b) h.push(n(c + 40 * b));
      return h;
    })((p(), A)[t + 16 >>> 2 >>> 0], (p(), A)[t + 20 >>> 2 >>> 0]) }, e = L(e);
    var o = yo2(0);
    return fu2(o, e.createBindGroup(t)), o;
  }
  function Xu2(e, t) {
    var n;
    return e >>>= 0, (t >>>= 0) && (n = { label: Ne(t + 4) }), t = L(e), e = go2(0), n = t.createCommandEncoder(n), de[e >>> 0] = n, e;
  }
  function Zu2(e, t) {
    e >>>= 0, t >>>= 0, t = { type: hu2[(p(), x)[t + 12 >>> 2 >>> 0]], count: (p(), A)[t + 16 >>> 2 >>> 0] };
    var n = L(e);
    return e = vo2(0), t = n.createQuerySet(t), de[e >>> 0] = t, e;
  }
  function Ku2(e, t) {
    e = L(e >>> 0).adapterInfo, t >>>= 0, (p(), A)[t + 52 >>> 2 >>> 0] = e.subgroupMinSize, (p(), A)[t + 56 >>> 2 >>> 0] = e.subgroupMaxSize;
    var n = e.vendor + e.architecture + e.device + e.description, o = _e2(n) + 1, u = pt2(o);
    return u && Pe(n, u, o), n = u, o = _e2(e.vendor), Wt2(t + 4, n, o), n += o, o = _e2(e.architecture), Wt2(t + 12, n, o), n += o, o = _e2(e.device), Wt2(t + 20, n, o), Wt2(t + 28, n + o, _e2(e.description)), (p(), x)[t + 36 >>> 2 >>> 0] = 2, e = e.isFallbackAdapter ? 3 : 4, (p(), x)[t + 40 >>> 2 >>> 0] = e, (p(), A)[t + 44 >>> 2 >>> 0] = 0, (p(), A)[t + 48 >>> 2 >>> 0] = 0, 1;
  }
  var Qu2 = { "core-features-and-limits": 1, "depth-clip-control": 2, "depth32float-stencil8": 3, "texture-compression-bc": 4, "texture-compression-bc-sliced-3d": 5, "texture-compression-etc2": 6, "texture-compression-astc": 7, "texture-compression-astc-sliced-3d": 8, "timestamp-query": 9, "indirect-first-instance": 10, "shader-f16": 11, "rg11b10ufloat-renderable": 12, "bgra8unorm-storage": 13, "float32-filterable": 14, "float32-blendable": 15, "clip-distances": 16, "dual-source-blending": 17, subgroups: 18, "texture-formats-tier1": 19, "texture-formats-tier2": 20, "primitive-index": 21, "texture-component-swizzle": 22, "chromium-experimental-unorm16-texture-formats": 327692, "chromium-experimental-multi-draw-indirect": 327729 };
  function ef(e, t) {
    t >>>= 0;
    var n = L(e >>> 0);
    e = pt2(4 * n.features.size);
    var o = 0, u = 0;
    for (let c of n.features) 0 <= (n = Qu2[c]) && ((p(), x)[e + o >>> 2 >>> 0] = n, o += 4, u++);
    (p(), A)[t + 4 >>> 2 >>> 0] = e, (p(), A)[t >>> 2 >>> 0] = u;
  }
  function tf(e, t) {
    return ro2(L(e >>> 0).limits, t >>> 0), 1;
  }
  function rf(e, t) {
    L(e >>> 0).pushErrorScope(lu2[t]);
  }
  function nf(e, t, n) {
    t >>>= 0, n >>>= 0, e = L(e >>> 0), t = Array.from((p(), x).subarray(n >>> 2 >>> 0, n + 4 * t >>> 2 >>> 0), (o) => L(o)), e.submit(t);
  }
  function of(e, t, n, o, u) {
    n = ce(n), o >>>= 0, u >>>= 0, e = L(e >>> 0), t = L(t >>> 0), o = (p(), J2).subarray(o >>> 0, o + u >>> 0), e.writeBuffer(t, n, o, 0, u);
  }
  i || (function() {
    for (var e = r.numThreads - 1; e--; ) gn2();
    Ae.push(async () => {
      var t = (async function() {
        if (!i) return Promise.all(We2.map(wn));
      })();
      Be2++, await t, --Be2 == 0 && ee2 && (t = ee2, ee2 = null, t());
    });
  })(), i || (Fe2 = new WebAssembly.Memory({ initial: 256, maximum: 65536, shared: true }), se()), r.wasmBinary && (g = r.wasmBinary), r.stackSave = () => P(), r.stackRestore = (e) => D(e), r.stackAlloc = (e) => Gt2(e), r.setValue = function(e, t, n = "i8") {
    switch (n.endsWith("*") && (n = "*"), n) {
      case "i1":
      case "i8":
        (p(), X)[e >>> 0] = t;
        break;
      case "i16":
        (p(), Ce2)[e >>> 1 >>> 0] = t;
        break;
      case "i32":
        (p(), x)[e >>> 2 >>> 0] = t;
        break;
      case "i64":
        (p(), me2)[e >>> 3 >>> 0] = BigInt(t);
        break;
      case "float":
        (p(), _)[e >>> 2 >>> 0] = t;
        break;
      case "double":
        (p(), ae)[e >>> 3 >>> 0] = t;
        break;
      case "*":
        (p(), A)[e >>> 2 >>> 0] = t;
        break;
      default:
        Te(`invalid type for setValue: ${n}`);
    }
  }, r.getValue = function(e, t = "i8") {
    switch (t.endsWith("*") && (t = "*"), t) {
      case "i1":
      case "i8":
        return (p(), X)[e >>> 0];
      case "i16":
        return (p(), Ce2)[e >>> 1 >>> 0];
      case "i32":
        return (p(), x)[e >>> 2 >>> 0];
      case "i64":
        return (p(), me2)[e >>> 3 >>> 0];
      case "float":
        return (p(), _)[e >>> 2 >>> 0];
      case "double":
        return (p(), ae)[e >>> 3 >>> 0];
      case "*":
        return (p(), A)[e >>> 2 >>> 0];
      default:
        Te(`invalid type for getValue: ${t}`);
    }
  }, r.UTF8ToString = ct, r.stringToUTF8 = Pe, r.lengthBytesUTF8 = _e2;
  var lo2, po2, Pr2, Ft2, xe, pt2, mo2, ho2, yo2, bo2, wo2, go2, To2, vo2, Eo2, So2, Ao2, _r, Rr2, Nr2, kr2, Et2, Wr2, Io2, Fr2, xo2, Lo, Bo2, Gr2, Oo2, Mo2, $r, N, St2, Uo2, D, Gt2, P, Co2, zr2, Do2, Po2, _o2, Vr2, Ro2, No2, ko2, Wo, Fo, Go, $o2, zo2, Vo, jo, Ho, qo, Yo, Jo, Xo, Zo, Ko, Qo, ea, ta, ra, na, oa, aa, sa, ia, ua, fa, ca, da, la, pa, ma, ha, ya, ba, wa, ga, Ta, ke2, af = [Ye2, br, En, Ln, Bn, On, Mn, Un, Cn, Dn, Pn, _n, Rn, Nn, kn, Wn2, Zn2, Kn2, Qn2, ao2, so2, io2, uo2, fo2, co2], jr2 = { 1028716: (e, t, n, o, u) => {
    if (r === void 0 || !r.Vc) return 1;
    if ((e = ct(Number(e >>> 0))).startsWith("./") && (e = e.substring(2)), !(e = r.Vc.get(e))) return 2;
    if (t = Number(t >>> 0), n = Number(n >>> 0), o = Number(o >>> 0), t + n > e.byteLength) return 3;
    try {
      let c = e.subarray(t, t + n);
      switch (u) {
        case 0:
          (p(), J2).set(c, o >>> 0);
          break;
        case 1:
          r.bd ? r.bd(o, c) : r.pe(o, c);
          break;
        default:
          return 4;
      }
      return 0;
    } catch {
      return 4;
    }
  }, 1029540: (e, t, n) => {
    r.Td(e, (p(), J2).subarray(t >>> 0, t + n >>> 0));
  }, 1029604: () => r.ne(), 1029646: (e) => {
    r.kd(e);
  }, 1029683: () => typeof wasmOffsetConverter < "u" };
  function sf(e, t, n, o) {
    var u = P();
    try {
      return zo2(e, t, n, o);
    } catch (c) {
      if (D(u), c !== c + 0) throw c;
      N(1, 0);
    }
  }
  function uf(e, t, n) {
    var o = P();
    try {
      return Fo(e, t, n);
    } catch (u) {
      if (D(o), u !== u + 0) throw u;
      N(1, 0);
    }
  }
  function ff2(e) {
    var t = P();
    try {
      Ro2(e);
    } catch (n) {
      if (D(t), n !== n + 0) throw n;
      N(1, 0);
    }
  }
  function cf(e, t) {
    var n = P();
    try {
      return Vr2(e, t);
    } catch (o) {
      if (D(n), o !== o + 0) throw o;
      N(1, 0);
    }
  }
  function df(e, t, n) {
    var o = P();
    try {
      _o2(e, t, n);
    } catch (u) {
      if (D(o), u !== u + 0) throw u;
      N(1, 0);
    }
  }
  function lf(e, t) {
    var n = P();
    try {
      Vo(e, t);
    } catch (o) {
      if (D(n), o !== o + 0) throw o;
      N(1, 0);
    }
  }
  function pf(e, t, n, o, u, c, h) {
    var b = P();
    try {
      return Wo(e, t, n, o, u, c, h);
    } catch (E) {
      if (D(b), E !== E + 0) throw E;
      N(1, 0);
    }
  }
  function mf(e, t, n, o, u, c) {
    var h = P();
    try {
      No2(e, t, n, o, u, c);
    } catch (b) {
      if (D(h), b !== b + 0) throw b;
      N(1, 0);
    }
  }
  function hf2(e, t, n, o) {
    var u = P();
    try {
      $o2(e, t, n, o);
    } catch (c) {
      if (D(u), c !== c + 0) throw c;
      N(1, 0);
    }
  }
  function yf2(e, t, n, o, u, c, h) {
    var b = P();
    try {
      Ho(e, t, n, o, u, c, h);
    } catch (E) {
      if (D(b), E !== E + 0) throw E;
      N(1, 0);
    }
  }
  function bf2(e, t, n, o, u, c, h) {
    var b = P();
    try {
      qo(e, t, n, o, u, c, h);
    } catch (E) {
      if (D(b), E !== E + 0) throw E;
      N(1, 0);
    }
  }
  function wf2(e, t, n, o, u, c, h, b) {
    var E = P();
    try {
      ra(e, t, n, o, u, c, h, b);
    } catch (I) {
      if (D(E), I !== I + 0) throw I;
      N(1, 0);
    }
  }
  function gf2(e, t, n, o, u, c, h, b, E, I, F, j2) {
    var te = P();
    try {
      Yo(e, t, n, o, u, c, h, b, E, I, F, j2);
    } catch (O2) {
      if (D(te), O2 !== O2 + 0) throw O2;
      N(1, 0);
    }
  }
  function Tf2(e, t, n, o, u) {
    var c = P();
    try {
      return jo(e, t, n, o, u);
    } catch (h) {
      if (D(c), h !== h + 0) throw h;
      N(1, 0);
    }
  }
  function vf2(e, t, n, o, u, c) {
    var h = P();
    try {
      na(e, t, n, o, u, c);
    } catch (b) {
      if (D(h), b !== b + 0) throw b;
      N(1, 0);
    }
  }
  function Ef2(e, t, n, o, u) {
    var c = P();
    try {
      ko2(e, t, n, o, u);
    } catch (h) {
      if (D(c), h !== h + 0) throw h;
      N(1, 0);
    }
  }
  function Sf2(e, t, n, o, u, c, h, b) {
    var E = P();
    try {
      Go(e, t, n, o, u, c, h, b);
    } catch (I) {
      if (D(E), I !== I + 0) throw I;
      N(1, 0);
    }
  }
  function Af2(e) {
    var t = P();
    try {
      return oa(e);
    } catch (n) {
      if (D(t), n !== n + 0) throw n;
      N(1, 0);
    }
  }
  function If2(e, t, n) {
    var o = P();
    try {
      return aa(e, t, n);
    } catch (u) {
      if (D(o), u !== u + 0) throw u;
      N(1, 0);
    }
  }
  function xf2(e, t) {
    var n = P();
    try {
      return ya(e, t);
    } catch (o) {
      if (D(n), o !== o + 0) throw o;
      return N(1, 0), 0n;
    }
  }
  function Lf2(e) {
    var t = P();
    try {
      return Jo(e);
    } catch (n) {
      if (D(t), n !== n + 0) throw n;
      return N(1, 0), 0n;
    }
  }
  function Bf2(e, t, n, o) {
    var u = P();
    try {
      return sa(e, t, n, o);
    } catch (c) {
      if (D(u), c !== c + 0) throw c;
      N(1, 0);
    }
  }
  function Of2(e, t, n, o, u) {
    var c = P();
    try {
      return ia(e, t, n, o, u);
    } catch (h) {
      if (D(c), h !== h + 0) throw h;
      N(1, 0);
    }
  }
  function Mf2(e, t, n, o, u, c) {
    var h = P();
    try {
      return ua(e, t, n, o, u, c);
    } catch (b) {
      if (D(h), b !== b + 0) throw b;
      N(1, 0);
    }
  }
  function Uf2(e, t, n, o, u, c) {
    var h = P();
    try {
      return ea(e, t, n, o, u, c);
    } catch (b) {
      if (D(h), b !== b + 0) throw b;
      N(1, 0);
    }
  }
  function Cf2(e, t, n, o, u, c) {
    var h = P();
    try {
      return fa(e, t, n, o, u, c);
    } catch (b) {
      if (D(h), b !== b + 0) throw b;
      N(1, 0);
    }
  }
  function Df2(e, t, n, o, u, c, h, b) {
    var E = P();
    try {
      return ta(e, t, n, o, u, c, h, b);
    } catch (I) {
      if (D(E), I !== I + 0) throw I;
      N(1, 0);
    }
  }
  function Pf2(e, t, n, o, u) {
    var c = P();
    try {
      return ca(e, t, n, o, u);
    } catch (h) {
      if (D(c), h !== h + 0) throw h;
      return N(1, 0), 0n;
    }
  }
  function _f2(e, t, n, o) {
    var u = P();
    try {
      return da(e, t, n, o);
    } catch (c) {
      if (D(u), c !== c + 0) throw c;
      N(1, 0);
    }
  }
  function Rf2(e, t, n, o) {
    var u = P();
    try {
      return la(e, t, n, o);
    } catch (c) {
      if (D(u), c !== c + 0) throw c;
      N(1, 0);
    }
  }
  function Nf2(e, t, n, o, u, c, h, b, E, I, F, j2) {
    var te = P();
    try {
      return pa(e, t, n, o, u, c, h, b, E, I, F, j2);
    } catch (O2) {
      if (D(te), O2 !== O2 + 0) throw O2;
      N(1, 0);
    }
  }
  function kf2(e, t, n, o, u, c, h, b, E, I, F) {
    var j2 = P();
    try {
      ma(e, t, n, o, u, c, h, b, E, I, F);
    } catch (te) {
      if (D(j2), te !== te + 0) throw te;
      N(1, 0);
    }
  }
  function Wf2(e, t, n, o, u, c, h, b, E, I, F, j2, te, O2, ue, ye2) {
    var fe2 = P();
    try {
      ha(e, t, n, o, u, c, h, b, E, I, F, j2, te, O2, ue, ye2);
    } catch (Ze2) {
      if (D(fe2), Ze2 !== Ze2 + 0) throw Ze2;
      N(1, 0);
    }
  }
  function Ff2(e, t, n) {
    var o = P();
    try {
      return Zo(e, t, n);
    } catch (u) {
      if (D(o), u !== u + 0) throw u;
      return N(1, 0), 0n;
    }
  }
  function Gf2(e, t, n) {
    var o = P();
    try {
      return Xo(e, t, n);
    } catch (u) {
      if (D(o), u !== u + 0) throw u;
      N(1, 0);
    }
  }
  function $f2(e, t, n) {
    var o = P();
    try {
      return Ko(e, t, n);
    } catch (u) {
      if (D(o), u !== u + 0) throw u;
      N(1, 0);
    }
  }
  function zf2(e, t, n, o) {
    var u = P();
    try {
      Qo(e, t, n, o);
    } catch (c) {
      if (D(u), c !== c + 0) throw c;
      N(1, 0);
    }
  }
  function $t2() {
    if (0 < Be2) ee2 = $t2;
    else if (i) U2?.(r), yr();
    else {
      for (var e = Ae; 0 < e.length; ) e.shift()(r);
      0 < Be2 ? ee2 = $t2 : (r.calledRun = true, W2 || (yr(), U2?.(r)));
    }
  }
  return i || (ke2 = await bt(), $t2()), r.PTR_SIZE = 4, r.webgpuInit = (e) => {
    let t = /* @__PURE__ */ new WeakMap(), n, o, u = 1;
    r.webgpuRegisterDevice = (b) => {
      if (o !== void 0) throw Error("another WebGPU EP inference session is being created.");
      if (b) {
        var E = t.get(b);
        if (!E) {
          let I = ((F, j2 = 0) => {
            var te = Ao2(j2);
            return j2 = So2(j2, te), de[te >>> 0] = F.queue, de[j2 >>> 0] = F, j2;
          })(b, E = ho2(0));
          E = [u++, E, I], t.set(b, E);
        }
        return n = b, o = E[0], E;
      }
      n = void 0, o = 0;
    };
    let c = /* @__PURE__ */ new Map();
    r.webgpuOnCreateSession = (b) => {
      if (o !== void 0) {
        var E = o;
        if (o = void 0, b) {
          let I = Pr2(E);
          c.set(b, I), E === 0 && e(n ?? L(I));
        }
        n = void 0;
      }
    }, r.webgpuOnReleaseSession = (b) => {
      c.delete(b);
    };
    let h = /* @__PURE__ */ Symbol("gpuBufferMetadata");
    r.webgpuRegisterBuffer = (b, E, I) => {
      if (I) return b[h] = [I, NaN], I;
      if (I = b[h]) return I[1]++, I[0];
      if ((E = c.get(E)) === void 0) throw Error("Invalid session handle passed to webgpuRegisterBuffer");
      return E = ((F, j2 = 0) => (F.mapState === "unmapped" || Te(), j2 = Eo2(j2), de[j2 >>> 0] = F, j2))(b, E), b[h] = [E, 1], E;
    }, r.webgpuUnregisterBuffer = (b) => {
      let E = b[h];
      if (!E) throw Error("Buffer is not registered");
      E[1]--, E[1] === 0 && (mo2(E[0]), delete b[h]);
    }, r.webgpuGetBuffer = (b) => L(b), r.webgpuCreateDownloader = (b, E, I) => {
      if ((I = c.get(I)) === void 0) throw Error("Invalid session handle passed to webgpuRegisterBuffer");
      let F = L(I), j2 = 16 * Math.ceil(Number(E) / 16);
      return async () => {
        let te = F.createBuffer({ size: j2, usage: 9 });
        try {
          let O2 = F.createCommandEncoder();
          return O2.copyBufferToBuffer(b, 0, te, 0, j2), F.queue.submit([O2.finish()]), await te.mapAsync(GPUMapMode.READ), te.getMappedRange().slice(0, E);
        } finally {
          te.destroy();
        }
      };
    }, r.bd = (b, E) => {
      var I = E.buffer;
      let F = E.byteOffset, j2 = E.byteLength;
      if (E = 16 * Math.ceil(Number(j2) / 16), b = L(b), !n) {
        var te = Pr2(o);
        n = L(te);
      }
      let O2 = (te = n.createBuffer({ mappedAtCreation: true, size: E, usage: 6 })).getMappedRange();
      new Uint8Array(O2).set(new Uint8Array(I, F, j2)), te.unmap(), (I = n.createCommandEncoder()).copyBufferToBuffer(te, 0, b, 0, E), n.queue.submit([I.finish()]), te.destroy();
    };
  }, r.webnnInit = (e) => {
    let t = e[0];
    [r.ne, r.kd, r.webnnEnsureTensor, r.Td, r.webnnDownloadTensor, r.me, r.webnnEnableTraceEvent] = e.slice(1), r.webnnReleaseTensorId = r.kd, r.webnnUploadTensor = r.Td, r.webnnRegisterMLContext = r.me, r.webnnOnRunStart = (n) => t.onRunStart(n), r.webnnOnRunEnd = t.onRunEnd.bind(t), r.webnnOnReleaseSession = (n) => {
      t.onReleaseSession(n);
    }, r.webnnCreateMLTensorDownloader = (n, o) => t.createMLTensorDownloader(n, o), r.webnnRegisterMLTensor = (n, o, u, c) => t.registerMLTensor(n, o, u, c), r.webnnCreateMLContext = (n) => t.createMLContext(n), r.webnnRegisterMLConstant = (n, o, u, c, h, b) => t.registerMLConstant(n, o, u, c, h, r.Vc, b), r.webnnRegisterGraphInput = t.registerGraphInput.bind(t), r.webnnIsGraphInput = t.isGraphInput.bind(t), r.webnnRegisterGraphOutput = t.registerGraphOutput.bind(t), r.webnnIsGraphOutput = t.isGraphOutput.bind(t), r.webnnCreateTemporaryTensor = t.createTemporaryTensor.bind(t), r.webnnIsGraphInputOutputTypeSupported = t.isGraphInputOutputTypeSupported.bind(t);
  }, re2 ? r : new Promise((e, t) => {
    U2 = e, R = t;
  });
}
var Hr, jf, Hf, qf, qr, k, At, Yf, zt, Vt, Ke, Qe, Jf, va, Yr, Ea, Sa, Aa, Ia, ie, Jr, Q, xa, La, Ba, Oa, Xr, Ma, Ua, Ca, Da, Pa, _a, et, It, Ra, Na, ka, Wa, Fa, Ga, le, jt, Le, Zr, $a, za, tt, rt, $e, ze, Kr, Ht, Va, Xf, ja, Ha, qa, Ya, Ja, Qr, Ve, qt, Qa, Za, Ka, Zf, es, rs, Kf, Qf, ns, ss, rn, ec, ge, is, tn, tc, rc, us, nc, os, fs, as, cs, Yt, nn, on, nr, ds, oc, ac, sc, Jt, z, je, be, Lt, $, or, ls, ps, ic, uc, fc, Bt, ot, cc, ms, hs, He, ar, mt, at, Ot, sr, ir, an, st, Mt, sn, ys, bs, dc, lc, ws, gs, Ts, pc, pe, un, Es, cn, Ss, mc, vs, hc, As, ur, fr, fn, Is, xs, Ls, cr, yc, dn, Bs, bc, Xt, Zt, it, wc, Os, xt, Kt, Qt, Ms, er, tr, rr, en, ut, Ee, Ut, lr, pr, dr, ln, pn, ht, yt, Tc, Us, Cs, Ds, Ps, _s, Rs, Ns, mn, ks, vc, mr, Ws, Gs, Fs, hr, Ec, $s, Xa, vl;
var init_ort_webgpu_bundle_min = __esm({
  "../../node_modules/.pnpm/onnxruntime-web@1.27.0/node_modules/onnxruntime-web/dist/ort.webgpu.bundle.min.mjs"() {
    Hr = Object.defineProperty;
    jf = Object.getOwnPropertyDescriptor;
    Hf = Object.getOwnPropertyNames;
    qf = Object.prototype.hasOwnProperty;
    qr = ((a) => typeof __require < "u" ? __require : typeof Proxy < "u" ? new Proxy(a, { get: (r, s) => (typeof __require < "u" ? __require : r)[s] }) : a)(function(a) {
      if (typeof __require < "u") return __require.apply(this, arguments);
      throw Error('Dynamic require of "' + a + '" is not supported');
    });
    k = (a, r) => () => (a && (r = a(a = 0)), r);
    At = (a, r) => {
      for (var s in r) Hr(a, s, { get: r[s], enumerable: true });
    };
    Yf = (a, r, s, f) => {
      if (r && typeof r == "object" || typeof r == "function") for (let i of Hf(r)) !qf.call(a, i) && i !== s && Hr(a, i, { get: () => r[i], enumerable: !(f = jf(r, i)) || f.enumerable });
      return a;
    };
    zt = (a) => Yf(Hr({}, "__esModule", { value: true }), a);
    Yr = k(() => {
      Vt = /* @__PURE__ */ new Map(), Ke = [], Qe = (a, r, s) => {
        if (r && typeof r.init == "function" && typeof r.createInferenceSessionHandler == "function") {
          let f = Vt.get(a);
          if (f === void 0) Vt.set(a, { backend: r, priority: s });
          else {
            if (f.priority > s) return;
            if (f.priority === s && f.backend !== r) throw new Error(`cannot register backend "${a}" using priority ${s}`);
          }
          if (s >= 0) {
            let i = Ke.indexOf(a);
            i !== -1 && Ke.splice(i, 1);
            for (let d = 0; d < Ke.length; d++) if (Vt.get(Ke[d]).priority <= s) {
              Ke.splice(d, 0, a);
              return;
            }
            Ke.push(a);
          }
          return;
        }
        throw new TypeError("not a valid backend");
      }, Jf = async (a) => {
        let r = Vt.get(a);
        if (!r) return "backend not found.";
        if (r.initialized) return r.backend;
        if (r.aborted) return r.error;
        {
          let s = !!r.initPromise;
          try {
            return s || (r.initPromise = r.backend.init(a)), await r.initPromise, r.initialized = true, r.backend;
          } catch (f) {
            return s || (r.error = `${f}`, r.aborted = true), r.error;
          } finally {
            delete r.initPromise;
          }
        }
      }, va = async (a) => {
        let r = a.executionProviders || [], s = r.map((y) => typeof y == "string" ? y : y.name), f = s.length === 0 ? Ke : s, i, d = [], l = /* @__PURE__ */ new Set();
        for (let y of f) {
          let w = await Jf(y);
          typeof w == "string" ? d.push({ name: y, err: w }) : (i || (i = w), i === w && l.add(y));
        }
        if (!i) throw new Error(`no available backend found. ERR: ${d.map((y) => `[${y.name}] ${y.err}`).join(", ")}`);
        for (let { name: y, err: w } of d) s.includes(y) && console.warn(`removing requested execution provider "${y}" from session options because it is not available: ${w}`);
        let m = r.filter((y) => l.has(typeof y == "string" ? y : y.name));
        return [i, new Proxy(a, { get: (y, w) => w === "executionProviders" ? m : Reflect.get(y, w) })];
      };
    });
    Ea = k(() => {
      Yr();
    });
    Aa = k(() => {
      Sa = "1.27.0";
    });
    Jr = k(() => {
      Aa();
      Ia = "warning", ie = { wasm: {}, webgl: {}, webgpu: {}, versions: { common: Sa }, set logLevel(a) {
        if (a !== void 0) {
          if (typeof a != "string" || ["verbose", "info", "warning", "error", "fatal"].indexOf(a) === -1) throw new Error(`Unsupported logging level: ${a}`);
          Ia = a;
        }
      }, get logLevel() {
        return Ia;
      } };
      Object.defineProperty(ie, "logLevel", { enumerable: true });
    });
    xa = k(() => {
      Jr();
      Q = ie;
    });
    Oa = k(() => {
      La = (a, r) => {
        let s = typeof document < "u" ? document.createElement("canvas") : new OffscreenCanvas(1, 1);
        s.width = a.dims[3], s.height = a.dims[2];
        let f = s.getContext("2d");
        if (f != null) {
          let i, d;
          r?.tensorLayout !== void 0 && r.tensorLayout === "NHWC" ? (i = a.dims[2], d = a.dims[3]) : (i = a.dims[3], d = a.dims[2]);
          let l = r?.format !== void 0 ? r.format : "RGB", m = r?.norm, y, w;
          m === void 0 || m.mean === void 0 ? y = [255, 255, 255, 255] : typeof m.mean == "number" ? y = [m.mean, m.mean, m.mean, m.mean] : (y = [m.mean[0], m.mean[1], m.mean[2], 0], m.mean[3] !== void 0 && (y[3] = m.mean[3])), m === void 0 || m.bias === void 0 ? w = [0, 0, 0, 0] : typeof m.bias == "number" ? w = [m.bias, m.bias, m.bias, m.bias] : (w = [m.bias[0], m.bias[1], m.bias[2], 0], m.bias[3] !== void 0 && (w[3] = m.bias[3]));
          let T = d * i, g = 0, v = T, S = T * 2, U2 = -1;
          l === "RGBA" ? (g = 0, v = T, S = T * 2, U2 = T * 3) : l === "RGB" ? (g = 0, v = T, S = T * 2) : l === "RBG" && (g = 0, S = T, v = T * 2);
          for (let R = 0; R < d; R++) for (let H = 0; H < i; H++) {
            let C = (a.data[g++] - w[0]) * y[0], M = (a.data[v++] - w[1]) * y[1], q = (a.data[S++] - w[2]) * y[2], B = U2 === -1 ? 255 : (a.data[U2++] - w[3]) * y[3];
            f.fillStyle = "rgba(" + C + "," + M + "," + q + "," + B + ")", f.fillRect(H, R, 1, 1);
          }
          if ("toDataURL" in s) return s.toDataURL();
          throw new Error("toDataURL is not supported");
        } else throw new Error("Can not access image data");
      }, Ba = (a, r) => {
        let s = typeof document < "u" ? document.createElement("canvas").getContext("2d") : new OffscreenCanvas(1, 1).getContext("2d"), f;
        if (s != null) {
          let i, d, l;
          r?.tensorLayout !== void 0 && r.tensorLayout === "NHWC" ? (i = a.dims[2], d = a.dims[1], l = a.dims[3]) : (i = a.dims[3], d = a.dims[2], l = a.dims[1]);
          let m = r !== void 0 && r.format !== void 0 ? r.format : "RGB", y = r?.norm, w, T;
          y === void 0 || y.mean === void 0 ? w = [255, 255, 255, 255] : typeof y.mean == "number" ? w = [y.mean, y.mean, y.mean, y.mean] : (w = [y.mean[0], y.mean[1], y.mean[2], 255], y.mean[3] !== void 0 && (w[3] = y.mean[3])), y === void 0 || y.bias === void 0 ? T = [0, 0, 0, 0] : typeof y.bias == "number" ? T = [y.bias, y.bias, y.bias, y.bias] : (T = [y.bias[0], y.bias[1], y.bias[2], 0], y.bias[3] !== void 0 && (T[3] = y.bias[3]));
          let g = d * i;
          if (r !== void 0 && (r.format !== void 0 && l === 4 && r.format !== "RGBA" || l === 3 && r.format !== "RGB" && r.format !== "BGR")) throw new Error("Tensor format doesn't match input tensor dims");
          let v = 4, S = 0, U2 = 1, R = 2, H = 3, C = 0, M = g, q = g * 2, B = -1;
          m === "RGBA" ? (C = 0, M = g, q = g * 2, B = g * 3) : m === "RGB" ? (C = 0, M = g, q = g * 2) : m === "RBG" && (C = 0, q = g, M = g * 2), f = s.createImageData(i, d);
          for (let W2 = 0; W2 < d * i; S += v, U2 += v, R += v, H += v, W2++) f.data[S] = (a.data[C++] - T[0]) * w[0], f.data[U2] = (a.data[M++] - T[1]) * w[1], f.data[R] = (a.data[q++] - T[2]) * w[2], f.data[H] = B === -1 ? 255 : (a.data[B++] - T[3]) * w[3];
        } else throw new Error("Can not access image data");
        return f;
      };
    });
    _a = k(() => {
      jt();
      Xr = (a, r) => {
        if (a === void 0) throw new Error("Image buffer must be defined");
        if (r.height === void 0 || r.width === void 0) throw new Error("Image height and width must be defined");
        if (r.tensorLayout === "NHWC") throw new Error("NHWC Tensor layout is not supported yet");
        let { height: s, width: f } = r, i = r.norm ?? { mean: 255, bias: 0 }, d, l;
        typeof i.mean == "number" ? d = [i.mean, i.mean, i.mean, i.mean] : d = [i.mean[0], i.mean[1], i.mean[2], i.mean[3] ?? 255], typeof i.bias == "number" ? l = [i.bias, i.bias, i.bias, i.bias] : l = [i.bias[0], i.bias[1], i.bias[2], i.bias[3] ?? 0];
        let m = r.format !== void 0 ? r.format : "RGBA", y = r.tensorFormat !== void 0 && r.tensorFormat !== void 0 ? r.tensorFormat : "RGB", w = s * f, T = y === "RGBA" ? new Float32Array(w * 4) : new Float32Array(w * 3), g = 4, v = 0, S = 1, U2 = 2, R = 3, H = 0, C = w, M = w * 2, q = -1;
        m === "RGB" && (g = 3, v = 0, S = 1, U2 = 2, R = -1), y === "RGBA" ? q = w * 3 : y === "RBG" ? (H = 0, M = w, C = w * 2) : y === "BGR" && (M = 0, C = w, H = w * 2);
        for (let W2 = 0; W2 < w; W2++, v += g, U2 += g, S += g, R += g) T[H++] = (a[v] + l[0]) / d[0], T[C++] = (a[S] + l[1]) / d[1], T[M++] = (a[U2] + l[2]) / d[2], q !== -1 && R !== -1 && (T[q++] = (a[R] + l[3]) / d[3]);
        return y === "RGBA" ? new le("float32", T, [1, 4, s, f]) : new le("float32", T, [1, 3, s, f]);
      }, Ma = async (a, r) => {
        let s = typeof HTMLImageElement < "u" && a instanceof HTMLImageElement, f = typeof ImageData < "u" && a instanceof ImageData, i = typeof ImageBitmap < "u" && a instanceof ImageBitmap, d = typeof a == "string", l, m = r ?? {}, y = () => {
          if (typeof document < "u") return document.createElement("canvas");
          if (typeof OffscreenCanvas < "u") return new OffscreenCanvas(1, 1);
          throw new Error("Canvas is not supported");
        }, w = (T) => typeof HTMLCanvasElement < "u" && T instanceof HTMLCanvasElement || T instanceof OffscreenCanvas ? T.getContext("2d") : null;
        if (s) {
          let T = y();
          T.width = a.width, T.height = a.height;
          let g = w(T);
          if (g != null) {
            let v = a.height, S = a.width;
            if (r !== void 0 && r.resizedHeight !== void 0 && r.resizedWidth !== void 0 && (v = r.resizedHeight, S = r.resizedWidth), r !== void 0) {
              if (m = r, r.tensorFormat !== void 0) throw new Error("Image input config format must be RGBA for HTMLImageElement");
              m.tensorFormat = "RGBA", m.height = v, m.width = S;
            } else m.tensorFormat = "RGBA", m.height = v, m.width = S;
            g.drawImage(a, 0, 0), l = g.getImageData(0, 0, S, v).data;
          } else throw new Error("Can not access image data");
        } else if (f) {
          let T, g;
          if (r !== void 0 && r.resizedWidth !== void 0 && r.resizedHeight !== void 0 ? (T = r.resizedHeight, g = r.resizedWidth) : (T = a.height, g = a.width), r !== void 0 && (m = r), m.format = "RGBA", m.height = T, m.width = g, r !== void 0) {
            let v = y();
            v.width = g, v.height = T;
            let S = w(v);
            if (S != null) S.putImageData(a, 0, 0), l = S.getImageData(0, 0, g, T).data;
            else throw new Error("Can not access image data");
          } else l = a.data;
        } else if (i) {
          if (r === void 0) throw new Error("Please provide image config with format for Imagebitmap");
          let T = y();
          T.width = a.width, T.height = a.height;
          let g = w(T);
          if (g != null) {
            let v = a.height, S = a.width;
            return g.drawImage(a, 0, 0, S, v), l = g.getImageData(0, 0, S, v).data, m.height = v, m.width = S, Xr(l, m);
          } else throw new Error("Can not access image data");
        } else {
          if (d) return new Promise((T, g) => {
            let v = y(), S = w(v);
            if (!a || !S) return g();
            let U2 = new Image();
            U2.crossOrigin = "Anonymous", U2.src = a, U2.onload = () => {
              v.width = U2.width, v.height = U2.height, S.drawImage(U2, 0, 0, v.width, v.height);
              let R = S.getImageData(0, 0, v.width, v.height);
              m.height = v.height, m.width = v.width, T(Xr(R.data, m));
            };
          });
          throw new Error("Input data provided is not supported - aborted tensor creation");
        }
        if (l !== void 0) return Xr(l, m);
        throw new Error("Input data provided is not supported - aborted tensor creation");
      }, Ua = (a, r) => {
        let { width: s, height: f, download: i, dispose: d } = r, l = [1, f, s, 4];
        return new le({ location: "texture", type: "float32", texture: a, dims: l, download: i, dispose: d });
      }, Ca = (a, r) => {
        let { dataType: s, dims: f, download: i, dispose: d } = r;
        return new le({ location: "gpu-buffer", type: s ?? "float32", gpuBuffer: a, dims: f, download: i, dispose: d });
      }, Da = (a, r) => {
        let { dataType: s, dims: f, download: i, dispose: d } = r;
        return new le({ location: "ml-tensor", type: s ?? "float32", mlTensor: a, dims: f, download: i, dispose: d });
      }, Pa = (a, r, s) => new le({ location: "cpu-pinned", type: a, data: r, dims: s ?? [r.length] });
    });
    ka = k(() => {
      et = /* @__PURE__ */ new Map([["float32", Float32Array], ["uint8", Uint8Array], ["int8", Int8Array], ["uint16", Uint16Array], ["int16", Int16Array], ["int32", Int32Array], ["bool", Uint8Array], ["float64", Float64Array], ["uint32", Uint32Array], ["int4", Uint8Array], ["uint4", Uint8Array]]), It = /* @__PURE__ */ new Map([[Float32Array, "float32"], [Uint8Array, "uint8"], [Int8Array, "int8"], [Uint16Array, "uint16"], [Int16Array, "int16"], [Int32Array, "int32"], [Float64Array, "float64"], [Uint32Array, "uint32"]]), Ra = false, Na = () => {
        if (!Ra) {
          Ra = true;
          let a = typeof BigInt64Array < "u" && BigInt64Array.from, r = typeof BigUint64Array < "u" && BigUint64Array.from, s = globalThis.Float16Array, f = typeof s < "u" && s.from;
          a && (et.set("int64", BigInt64Array), It.set(BigInt64Array, "int64")), r && (et.set("uint64", BigUint64Array), It.set(BigUint64Array, "uint64")), f ? (et.set("float16", s), It.set(s, "float16")) : et.set("float16", Uint16Array);
        }
      };
    });
    Ga = k(() => {
      jt();
      Wa = (a) => {
        let r = 1;
        for (let s = 0; s < a.length; s++) {
          let f = a[s];
          if (typeof f != "number" || !Number.isSafeInteger(f)) throw new TypeError(`dims[${s}] must be an integer, got: ${f}`);
          if (f < 0) throw new RangeError(`dims[${s}] must be a non-negative integer, got: ${f}`);
          r *= f;
        }
        return r;
      }, Fa = (a, r) => {
        switch (a.location) {
          case "cpu":
            return new le(a.type, a.data, r);
          case "cpu-pinned":
            return new le({ location: "cpu-pinned", data: a.data, type: a.type, dims: r });
          case "texture":
            return new le({ location: "texture", texture: a.texture, type: a.type, dims: r });
          case "gpu-buffer":
            return new le({ location: "gpu-buffer", gpuBuffer: a.gpuBuffer, type: a.type, dims: r });
          case "ml-tensor":
            return new le({ location: "ml-tensor", mlTensor: a.mlTensor, type: a.type, dims: r });
          default:
            throw new Error(`tensorReshape: tensor location ${a.location} is not supported`);
        }
      };
    });
    jt = k(() => {
      Oa();
      _a();
      ka();
      Ga();
      le = class {
        constructor(r, s, f) {
          Na();
          let i, d;
          if (typeof r == "object" && "location" in r) switch (this.dataLocation = r.location, i = r.type, d = r.dims, r.location) {
            case "cpu-pinned": {
              let m = et.get(i);
              if (!m) throw new TypeError(`unsupported type "${i}" to create tensor from pinned buffer`);
              if (!(r.data instanceof m)) throw new TypeError(`buffer should be of type ${m.name}`);
              this.cpuData = r.data;
              break;
            }
            case "texture": {
              if (i !== "float32") throw new TypeError(`unsupported type "${i}" to create tensor from texture`);
              this.gpuTextureData = r.texture, this.downloader = r.download, this.disposer = r.dispose;
              break;
            }
            case "gpu-buffer": {
              if (i !== "float32" && i !== "float16" && i !== "int32" && i !== "int64" && i !== "uint32" && i !== "uint8" && i !== "bool" && i !== "uint4" && i !== "int4") throw new TypeError(`unsupported type "${i}" to create tensor from gpu buffer`);
              this.gpuBufferData = r.gpuBuffer, this.downloader = r.download, this.disposer = r.dispose;
              break;
            }
            case "ml-tensor": {
              if (i !== "float32" && i !== "float16" && i !== "int32" && i !== "int64" && i !== "uint32" && i !== "uint64" && i !== "int8" && i !== "uint8" && i !== "bool" && i !== "uint4" && i !== "int4") throw new TypeError(`unsupported type "${i}" to create tensor from MLTensor`);
              this.mlTensorData = r.mlTensor, this.downloader = r.download, this.disposer = r.dispose;
              break;
            }
            default:
              throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`);
          }
          else {
            let m, y;
            if (typeof r == "string") if (i = r, y = f, r === "string") {
              if (!Array.isArray(s)) throw new TypeError("A string tensor's data must be a string array.");
              m = s;
            } else {
              let w = et.get(r);
              if (w === void 0) throw new TypeError(`Unsupported tensor type: ${r}.`);
              if (Array.isArray(s)) {
                if (r === "float16" && w === Uint16Array || r === "uint4" || r === "int4") throw new TypeError(`Creating a ${r} tensor from number array is not supported. Please use ${w.name} as data.`);
                r === "uint64" || r === "int64" ? m = w.from(s, BigInt) : m = w.from(s);
              } else if (s instanceof w) m = s;
              else if (s instanceof Uint8ClampedArray) if (r === "uint8") m = Uint8Array.from(s);
              else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");
              else if (r === "float16" && s instanceof Uint16Array && w !== Uint16Array) m = new globalThis.Float16Array(s.buffer, s.byteOffset, s.length);
              else throw new TypeError(`A ${i} tensor's data must be type of ${w}`);
            }
            else if (y = s, Array.isArray(r)) {
              if (r.length === 0) throw new TypeError("Tensor type cannot be inferred from an empty array.");
              let w = typeof r[0];
              if (w === "string") i = "string", m = r;
              else if (w === "boolean") i = "bool", m = Uint8Array.from(r);
              else throw new TypeError(`Invalid element type of data array: ${w}.`);
            } else if (r instanceof Uint8ClampedArray) i = "uint8", m = Uint8Array.from(r);
            else {
              let w = It.get(r.constructor);
              if (w === void 0) throw new TypeError(`Unsupported type for tensor data: ${r.constructor}.`);
              i = w, m = r;
            }
            if (y === void 0) y = [m.length];
            else if (!Array.isArray(y)) throw new TypeError("A tensor's dims must be a number array");
            d = y, this.cpuData = m, this.dataLocation = "cpu";
          }
          let l = Wa(d);
          if (this.cpuData && l !== this.cpuData.length && !((i === "uint4" || i === "int4") && Math.ceil(l / 2) === this.cpuData.length)) throw new Error(`Tensor's size(${l}) does not match data length(${this.cpuData.length}).`);
          this.type = i, this.dims = d, this.size = l;
        }
        static async fromImage(r, s) {
          return Ma(r, s);
        }
        static fromTexture(r, s) {
          return Ua(r, s);
        }
        static fromGpuBuffer(r, s) {
          return Ca(r, s);
        }
        static fromMLTensor(r, s) {
          return Da(r, s);
        }
        static fromPinnedBuffer(r, s, f) {
          return Pa(r, s, f);
        }
        toDataURL(r) {
          return La(this, r);
        }
        toImageData(r) {
          return Ba(this, r);
        }
        get data() {
          if (this.ensureValid(), !this.cpuData) throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");
          return this.cpuData;
        }
        get location() {
          return this.dataLocation;
        }
        get texture() {
          if (this.ensureValid(), !this.gpuTextureData) throw new Error("The data is not stored as a WebGL texture.");
          return this.gpuTextureData;
        }
        get gpuBuffer() {
          if (this.ensureValid(), !this.gpuBufferData) throw new Error("The data is not stored as a WebGPU buffer.");
          return this.gpuBufferData;
        }
        get mlTensor() {
          if (this.ensureValid(), !this.mlTensorData) throw new Error("The data is not stored as a WebNN MLTensor.");
          return this.mlTensorData;
        }
        async getData(r) {
          switch (this.ensureValid(), this.dataLocation) {
            case "cpu":
            case "cpu-pinned":
              return this.data;
            case "texture":
            case "gpu-buffer":
            case "ml-tensor": {
              if (!this.downloader) throw new Error("The current tensor is not created with a specified data downloader.");
              if (this.isDownloading) throw new Error("The current tensor is being downloaded.");
              try {
                this.isDownloading = true;
                let s = await this.downloader();
                return this.downloader = void 0, this.dataLocation = "cpu", this.cpuData = s, r && this.disposer && (this.disposer(), this.disposer = void 0), s;
              } finally {
                this.isDownloading = false;
              }
            }
            default:
              throw new Error(`cannot get data from location: ${this.dataLocation}`);
          }
        }
        dispose() {
          if (this.isDownloading) throw new Error("The current tensor is being downloaded.");
          this.disposer && (this.disposer(), this.disposer = void 0), this.cpuData = void 0, this.gpuTextureData = void 0, this.gpuBufferData = void 0, this.mlTensorData = void 0, this.downloader = void 0, this.isDownloading = void 0, this.dataLocation = "none";
        }
        ensureValid() {
          if (this.dataLocation === "none") throw new Error("The tensor is disposed.");
        }
        reshape(r) {
          if (this.ensureValid(), this.downloader || this.disposer) throw new Error("Cannot reshape a tensor that owns GPU resource.");
          return Fa(this, r);
        }
      };
    });
    Zr = k(() => {
      jt();
      Le = le;
    });
    Kr = k(() => {
      Jr();
      $a = (a, r) => {
        (typeof ie.trace > "u" ? !ie.wasm.trace : !ie.trace) || console.timeStamp(`${a}::ORT::${r}`);
      }, za = (a, r) => {
        let s = new Error().stack?.split(/\r\n|\r|\n/g) || [], f = false;
        for (let i = 0; i < s.length; i++) {
          if (f && !s[i].includes("TRACE_FUNC")) {
            let d = `FUNC_${a}::${s[i].trim().split(" ")[1]}`;
            r && (d += `::${r}`), $a("CPU", d);
            return;
          }
          s[i].includes("TRACE_FUNC") && (f = true);
        }
      }, tt = (a) => {
        (typeof ie.trace > "u" ? !ie.wasm.trace : !ie.trace) || za("BEGIN", a);
      }, rt = (a) => {
        (typeof ie.trace > "u" ? !ie.wasm.trace : !ie.trace) || za("END", a);
      }, $e = (a) => {
        (typeof ie.trace > "u" ? !ie.wasm.trace : !ie.trace) || console.time(`ORT::${a}`);
      }, ze = (a) => {
        (typeof ie.trace > "u" ? !ie.wasm.trace : !ie.trace) || console.timeEnd(`ORT::${a}`);
      };
    });
    Va = k(() => {
      Yr();
      Zr();
      Kr();
      Ht = class a {
        constructor(r) {
          this.handler = r;
        }
        async run(r, s, f) {
          tt(), $e("InferenceSession.run");
          let i = {}, d = {};
          if (typeof r != "object" || r === null || r instanceof Le || Array.isArray(r)) throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");
          let l = true;
          if (typeof s == "object") {
            if (s === null) throw new TypeError("Unexpected argument[1]: cannot be null.");
            if (s instanceof Le) throw new TypeError("'fetches' cannot be a Tensor");
            if (Array.isArray(s)) {
              if (s.length === 0) throw new TypeError("'fetches' cannot be an empty array.");
              l = false;
              for (let w of s) {
                if (typeof w != "string") throw new TypeError("'fetches' must be a string array or an object.");
                if (this.outputNames.indexOf(w) === -1) throw new RangeError(`'fetches' contains invalid output name: ${w}.`);
                i[w] = null;
              }
              if (typeof f == "object" && f !== null) d = f;
              else if (typeof f < "u") throw new TypeError("'options' must be an object.");
            } else {
              let w = false, T = Object.getOwnPropertyNames(s);
              for (let g of this.outputNames) if (T.indexOf(g) !== -1) {
                let v = s[g];
                (v === null || v instanceof Le) && (w = true, l = false, i[g] = v);
              }
              if (w) {
                if (typeof f == "object" && f !== null) d = f;
                else if (typeof f < "u") throw new TypeError("'options' must be an object.");
              } else d = s;
            }
          } else if (typeof s < "u") throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");
          for (let w of this.inputNames) if (typeof r[w] > "u") throw new Error(`input '${w}' is missing in 'feeds'.`);
          if (l) for (let w of this.outputNames) i[w] = null;
          let m = await this.handler.run(r, i, d), y = {};
          for (let w in m) if (Object.hasOwnProperty.call(m, w)) {
            let T = m[w];
            T instanceof Le ? y[w] = T : y[w] = new Le(T.type, T.data, T.dims);
          }
          return ze("InferenceSession.run"), rt(), y;
        }
        async release() {
          return this.handler.dispose();
        }
        static async create(r, s, f, i) {
          tt(), $e("InferenceSession.create");
          let d, l = {};
          if (typeof r == "string") {
            if (d = r, typeof s == "object" && s !== null) l = s;
            else if (typeof s < "u") throw new TypeError("'options' must be an object.");
          } else if (r instanceof Uint8Array) {
            if (d = r, typeof s == "object" && s !== null) l = s;
            else if (typeof s < "u") throw new TypeError("'options' must be an object.");
          } else if (r instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && r instanceof SharedArrayBuffer) {
            let T = r, g = 0, v = r.byteLength;
            if (typeof s == "object" && s !== null) l = s;
            else if (typeof s == "number") {
              if (g = s, !Number.isSafeInteger(g)) throw new RangeError("'byteOffset' must be an integer.");
              if (g < 0 || g >= T.byteLength) throw new RangeError(`'byteOffset' is out of range [0, ${T.byteLength}).`);
              if (v = r.byteLength - g, typeof f == "number") {
                if (v = f, !Number.isSafeInteger(v)) throw new RangeError("'byteLength' must be an integer.");
                if (v <= 0 || g + v > T.byteLength) throw new RangeError(`'byteLength' is out of range (0, ${T.byteLength - g}].`);
                if (typeof i == "object" && i !== null) l = i;
                else if (typeof i < "u") throw new TypeError("'options' must be an object.");
              } else if (typeof f < "u") throw new TypeError("'byteLength' must be a number.");
            } else if (typeof s < "u") throw new TypeError("'options' must be an object.");
            d = new Uint8Array(T, g, v);
          } else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");
          let [m, y] = await va(l), w = await m.createInferenceSessionHandler(d, y);
          return ze("InferenceSession.create"), rt(), new a(w);
        }
        startProfiling() {
          this.handler.startProfiling();
        }
        endProfiling() {
          this.handler.endProfiling();
        }
        get inputNames() {
          return this.handler.inputNames;
        }
        get outputNames() {
          return this.handler.outputNames;
        }
        get inputMetadata() {
          return this.handler.inputMetadata;
        }
        get outputMetadata() {
          return this.handler.outputMetadata;
        }
      };
    });
    ja = k(() => {
      Va();
      Xf = Ht;
    });
    Ha = k(() => {
    });
    qa = k(() => {
    });
    Ya = k(() => {
    });
    Ja = k(() => {
    });
    Qr = {};
    At(Qr, { InferenceSession: () => Xf, TRACE: () => $a, TRACE_EVENT_BEGIN: () => $e, TRACE_EVENT_END: () => ze, TRACE_FUNC_BEGIN: () => tt, TRACE_FUNC_END: () => rt, Tensor: () => Le, env: () => Q, registerBackend: () => Qe });
    Ve = k(() => {
      Ea();
      xa();
      ja();
      Zr();
      Ha();
      qa();
      Kr();
      Ya();
      Ja();
    });
    qt = k(() => {
    });
    Qa = {};
    At(Qa, { default: () => Zf });
    es = k(() => {
      en();
      je();
      Yt();
      Za = "ort-wasm-proxy-worker", Ka = globalThis.self?.name === Za;
      Ka && (self.onmessage = (a) => {
        let { type: r, in: s } = a.data;
        try {
          switch (r) {
            case "init-wasm":
              Jt(s.wasm).then(() => {
                Xt(s).then(() => {
                  postMessage({ type: r });
                }, (f) => {
                  postMessage({ type: r, err: f });
                });
              }, (f) => {
                postMessage({ type: r, err: f });
              });
              break;
            case "init-ep": {
              let { epName: f, env: i } = s;
              Zt(i, f).then(() => {
                postMessage({ type: r });
              }, (d) => {
                postMessage({ type: r, err: d });
              });
              break;
            }
            case "copy-from": {
              let { buffer: f } = s, i = xt(f);
              postMessage({ type: r, out: i });
              break;
            }
            case "create": {
              let { model: f, options: i } = s;
              Kt(f, i).then((d) => {
                postMessage({ type: r, out: d });
              }, (d) => {
                postMessage({ type: r, err: d });
              });
              break;
            }
            case "release":
              Qt(s), postMessage({ type: r });
              break;
            case "run": {
              let { sessionId: f, inputIndices: i, inputs: d, outputIndices: l, options: m } = s;
              er(f, i, d, l, new Array(l.length).fill(null), m).then((y) => {
                y.some((w) => w[3] !== "cpu") ? postMessage({ type: r, err: "Proxy does not support non-cpu tensor location." }) : postMessage({ type: r, out: y }, rr([...d, ...y]));
              }, (y) => {
                postMessage({ type: r, err: y });
              });
              break;
            }
            case "end-profiling":
              tr(s), postMessage({ type: r });
              break;
            default:
          }
        } catch (f) {
          postMessage({ type: r, err: f });
        }
      });
      Zf = Ka ? null : (a) => new Worker(a ?? ge, { type: "module", name: Za });
    });
    rs = {};
    At(rs, { default: () => Kf });
    ns = k(() => {
      Kf = ts, Qf = globalThis.self?.name?.startsWith("em-pthread");
      Qf && ts();
    });
    Yt = k(() => {
      qt();
      ss = typeof location > "u" ? void 0 : location.origin, rn = import.meta.url > "file:" && import.meta.url < "file;", ec = () => {
        {
          if (rn) {
            let a = URL;
            return new URL(new a("ort.webgpu.bundle.min.mjs", import.meta.url).href, ss).href;
          }
          return import.meta.url;
        }
      }, ge = ec(), is = () => {
        if (ge && !ge.startsWith("blob:")) return ge.substring(0, ge.lastIndexOf("/") + 1);
      }, tn = (a, r) => {
        try {
          let s = r ?? ge;
          return (s ? new URL(a, s) : new URL(a)).origin === ss;
        } catch {
          return false;
        }
      }, tc = (a, r) => {
        let s = r ?? ge;
        try {
          return (s ? new URL(a, s) : new URL(a)).href;
        } catch {
          return;
        }
      }, rc = (a, r) => `${r ?? "./"}${a}`, us = async (a) => {
        let s = await (await fetch(a, { credentials: "same-origin" })).blob();
        return URL.createObjectURL(s);
      }, nc = async (a) => (await import(
        /*webpackIgnore:true*/
        /*@vite-ignore*/
        a
      )).default, os = (es(), zt(Qa)).default, fs = async () => {
        if (!ge) throw new Error("Failed to load proxy worker: cannot determine the script source URL.");
        if (tn(ge)) return [void 0, os()];
        let a = await us(ge);
        return [a, os(a)];
      }, as = (ns(), zt(rs)).default, cs = async (a, r, s, f) => {
        let i = as && !(a || r);
        if (i) if (ge) i = tn(ge) || f && !s;
        else if (f && !s) i = true;
        else throw new Error("cannot determine the script source URL.");
        if (i) return [void 0, as];
        {
          let d = "ort-wasm-simd-threaded.asyncify.mjs", l = a ?? tc(d, r), m = s && l && !tn(l, r), y = m ? await us(l) : l ?? rc(d, r);
          return [m ? y : void 0, await nc(y)];
        }
      };
    });
    je = k(() => {
      Yt();
      on = false, nr = false, ds = false, oc = () => {
        if (typeof SharedArrayBuffer > "u") return false;
        try {
          return typeof MessageChannel < "u" && new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)), WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 5, 4, 1, 3, 1, 1, 10, 11, 1, 9, 0, 65, 0, 254, 16, 2, 0, 26, 11]));
        } catch {
          return false;
        }
      }, ac = () => {
        try {
          return WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 30, 1, 28, 0, 65, 0, 253, 15, 253, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 253, 186, 1, 26, 11]));
        } catch {
          return false;
        }
      }, sc = () => {
        try {
          return WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 19, 1, 17, 0, 65, 1, 253, 15, 65, 2, 253, 15, 65, 3, 253, 15, 253, 147, 2, 11]));
        } catch {
          return false;
        }
      }, Jt = async (a) => {
        if (on) return Promise.resolve();
        if (nr) throw new Error("multiple calls to 'initializeWebAssembly()' detected.");
        if (ds) throw new Error("previous call to 'initializeWebAssembly()' failed.");
        nr = true;
        let r = a.initTimeout, s = a.numThreads;
        if (a.simd !== false) {
          if (a.simd === "relaxed") {
            if (!sc()) throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.");
          } else if (!ac()) throw new Error("WebAssembly SIMD is not supported in the current environment.");
        }
        let f = oc();
        s > 1 && !f && (typeof self < "u" && !self.crossOriginIsolated && console.warn("env.wasm.numThreads is set to " + s + ", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."), console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."), a.numThreads = s = 1);
        let i = a.wasmPaths, d = typeof i == "string" ? i : void 0, l = i?.mjs, m = l?.href ?? l, y = i?.wasm, w = y?.href ?? y, T = a.wasmBinary, [g, v] = await cs(m, d, s > 1, !!T || !!w), S = false, U2 = [];
        if (r > 0 && U2.push(new Promise((R) => {
          setTimeout(() => {
            S = true, R();
          }, r);
        })), U2.push(new Promise((R, H) => {
          let C = { numThreads: s };
          if (T) C.wasmBinary = T, C.locateFile = (M) => M;
          else if (w || d) C.locateFile = (M) => w ?? d + M;
          else if (m && m.indexOf("blob:") !== 0) C.locateFile = (M) => new URL(M, m).href;
          else if (g) {
            let M = is();
            M && (C.locateFile = (q) => M + q);
          }
          v(C).then((M) => {
            nr = false, on = true, nn = M, R(), g && URL.revokeObjectURL(g);
          }, (M) => {
            nr = false, ds = true, H(M);
          });
        })), await Promise.race(U2), S) throw new Error(`WebAssembly backend initializing failed due to timeout: ${r}ms`);
      }, z = () => {
        if (on && nn) return nn;
        throw new Error("WebAssembly is not initialized yet.");
      };
    });
    or = k(() => {
      je();
      be = (a, r) => {
        let s = z(), f = s.lengthBytesUTF8(a) + 1, i = s._malloc(f);
        return s.stringToUTF8(a, i, f), r.push(i), i;
      }, Lt = (a, r, s, f) => {
        if (typeof a == "object" && a !== null) {
          if (s.has(a)) throw new Error("Circular reference in options");
          s.add(a);
        }
        Object.entries(a).forEach(([i, d]) => {
          let l = r ? r + i : i;
          if (typeof d == "object") Lt(d, l + ".", s, f);
          else if (typeof d == "string" || typeof d == "number") f(l, d.toString());
          else if (typeof d == "boolean") f(l, d ? "1" : "0");
          else throw new Error(`Can't handle extra config type: ${typeof d}`);
        });
      }, $ = (a) => {
        let r = z(), s = r.stackSave();
        try {
          let f = r.PTR_SIZE, i = r.stackAlloc(2 * f);
          r._OrtGetLastError(i, i + f);
          let d = Number(r.getValue(i, f === 4 ? "i32" : "i64")), l = r.getValue(i + f, "*"), m = l ? r.UTF8ToString(l) : "";
          throw new Error(`${a} ERROR_CODE: ${d}, ERROR_MESSAGE: ${m}`);
        } finally {
          r.stackRestore(s);
        }
      };
    });
    ps = k(() => {
      je();
      or();
      ls = (a) => {
        let r = z(), s = 0, f = [], i = a || {};
        try {
          if (a?.logSeverityLevel === void 0) i.logSeverityLevel = 2;
          else if (typeof a.logSeverityLevel != "number" || !Number.isInteger(a.logSeverityLevel) || a.logSeverityLevel < 0 || a.logSeverityLevel > 4) throw new Error(`log severity level is not valid: ${a.logSeverityLevel}`);
          if (a?.logVerbosityLevel === void 0) i.logVerbosityLevel = 0;
          else if (typeof a.logVerbosityLevel != "number" || !Number.isInteger(a.logVerbosityLevel)) throw new Error(`log verbosity level is not valid: ${a.logVerbosityLevel}`);
          a?.terminate === void 0 && (i.terminate = false);
          let d = 0;
          return a?.tag !== void 0 && (d = be(a.tag, f)), s = r._OrtCreateRunOptions(i.logSeverityLevel, i.logVerbosityLevel, !!i.terminate, d), s === 0 && $("Can't create run options."), a?.extra !== void 0 && Lt(a.extra, "", /* @__PURE__ */ new WeakSet(), (l, m) => {
            let y = be(l, f), w = be(m, f);
            r._OrtAddRunConfigEntry(s, y, w) !== 0 && $(`Can't set a run config entry: ${l} - ${m}.`);
          }), [s, f];
        } catch (d) {
          throw s !== 0 && r._OrtReleaseRunOptions(s), f.forEach((l) => r._free(l)), d;
        }
      };
    });
    hs = k(() => {
      je();
      or();
      ic = (a) => {
        switch (a) {
          case "disabled":
            return 0;
          case "basic":
            return 1;
          case "extended":
            return 2;
          case "layout":
            return 3;
          case "all":
            return 99;
          default:
            throw new Error(`unsupported graph optimization level: ${a}`);
        }
      }, uc = (a) => {
        switch (a) {
          case "sequential":
            return 0;
          case "parallel":
            return 1;
          default:
            throw new Error(`unsupported execution mode: ${a}`);
        }
      }, fc = (a) => {
        a.extra || (a.extra = {}), a.extra.session || (a.extra.session = {});
        let r = a.extra.session;
        r.use_ort_model_bytes_directly || (r.use_ort_model_bytes_directly = "1"), a.executionProviders && a.executionProviders.some((s) => (typeof s == "string" ? s : s.name) === "webgpu") && (a.enableMemPattern = false);
      }, Bt = (a, r, s, f) => {
        let i = be(r, f), d = be(s, f);
        z()._OrtAddSessionConfigEntry(a, i, d) !== 0 && $(`Can't set a session config entry: ${r} - ${s}.`);
      }, ot = (a, r, s, f) => {
        let i = be(r, f), d = be(s, f);
        a.push([i, d]);
      }, cc = async (a, r, s) => {
        let f = r.executionProviders;
        for (let i of f) {
          let d = typeof i == "string" ? i : i.name, l = [];
          switch (d) {
            case "webnn":
              if (d = "WEBNN", Bt(a, "session.disable_quant_qdq", "1", s), Bt(a, "session.disable_qdq_constant_folding", "1", s), typeof i != "string") {
                let v = i?.deviceType;
                v && Bt(a, "deviceType", v, s);
              }
              break;
            case "webgpu":
              {
                d = "WebGPU";
                let g;
                if (typeof i != "string") {
                  let S = i;
                  if (S.device) if (typeof GPUDevice < "u" && S.device instanceof GPUDevice) g = S.device;
                  else throw new Error("Invalid GPU device set in WebGPU EP options.");
                  let { enableGraphCapture: U2 } = r;
                  if (typeof U2 == "boolean" && U2 && ot(l, "enableGraphCapture", "1", s), typeof S.preferredLayout == "string" && ot(l, "preferredLayout", S.preferredLayout, s), S.forceCpuNodeNames) {
                    let R = Array.isArray(S.forceCpuNodeNames) ? S.forceCpuNodeNames : [S.forceCpuNodeNames];
                    ot(l, "forceCpuNodeNames", R.join(`
`), s);
                  }
                  S.validationMode && ot(l, "validationMode", S.validationMode, s);
                }
                let v = z().webgpuRegisterDevice(g);
                if (v) {
                  let [S, U2, R] = v;
                  ot(l, "deviceId", S.toString(), s), ot(l, "webgpuInstance", U2.toString(), s), ot(l, "webgpuDevice", R.toString(), s);
                }
              }
              break;
            case "wasm":
            case "cpu":
              continue;
            default:
              throw new Error(`not supported execution provider: ${d}`);
          }
          let m = be(d, s), y = l.length, w = 0, T = 0;
          if (y > 0) {
            w = z()._malloc(y * z().PTR_SIZE), s.push(w), T = z()._malloc(y * z().PTR_SIZE), s.push(T);
            for (let g = 0; g < y; g++) z().setValue(w + g * z().PTR_SIZE, l[g][0], "*"), z().setValue(T + g * z().PTR_SIZE, l[g][1], "*");
          }
          await z()._OrtAppendExecutionProvider(a, m, w, T, y) !== 0 && $(`Can't append execution provider: ${d}.`);
        }
      }, ms = async (a) => {
        let r = z(), s = 0, f = [], i = a || {};
        fc(i);
        try {
          let d = ic(i.graphOptimizationLevel ?? "all"), l = uc(i.executionMode ?? "sequential"), m = typeof i.logId == "string" ? be(i.logId, f) : 0, y = i.logSeverityLevel ?? 2;
          if (!Number.isInteger(y) || y < 0 || y > 4) throw new Error(`log severity level is not valid: ${y}`);
          let w = i.logVerbosityLevel ?? 0;
          if (!Number.isInteger(w) || w < 0 || w > 4) throw new Error(`log verbosity level is not valid: ${w}`);
          let T = typeof i.optimizedModelFilePath == "string" ? be(i.optimizedModelFilePath, f) : 0;
          if (s = r._OrtCreateSessionOptions(d, !!i.enableCpuMemArena, !!i.enableMemPattern, l, !!i.enableProfiling, 0, m, y, w, T), s === 0 && $("Can't create session options."), i.executionProviders && await cc(s, i, f), i.enableGraphCapture !== void 0) {
            if (typeof i.enableGraphCapture != "boolean") throw new Error(`enableGraphCapture must be a boolean value: ${i.enableGraphCapture}`);
            Bt(s, "enableGraphCapture", i.enableGraphCapture.toString(), f);
          }
          if (i.freeDimensionOverrides) for (let [g, v] of Object.entries(i.freeDimensionOverrides)) {
            if (typeof g != "string") throw new Error(`free dimension override name must be a string: ${g}`);
            if (typeof v != "number" || !Number.isInteger(v) || v < 0) throw new Error(`free dimension override value must be a non-negative integer: ${v}`);
            let S = be(g, f);
            r._OrtAddFreeDimensionOverride(s, S, v) !== 0 && $(`Can't set a free dimension override: ${g} - ${v}.`);
          }
          return i.extra !== void 0 && Lt(i.extra, "", /* @__PURE__ */ new WeakSet(), (g, v) => {
            Bt(s, g, v, f);
          }), [s, f];
        } catch (d) {
          throw s !== 0 && r._OrtReleaseSessionOptions(s) !== 0 && $("Can't release session options."), f.forEach((l) => r._free(l)), d;
        }
      };
    });
    st = k(() => {
      He = (a) => {
        switch (a) {
          case "int8":
            return 3;
          case "uint8":
            return 2;
          case "bool":
            return 9;
          case "int16":
            return 5;
          case "uint16":
            return 4;
          case "int32":
            return 6;
          case "uint32":
            return 12;
          case "float16":
            return 10;
          case "float32":
            return 1;
          case "float64":
            return 11;
          case "string":
            return 8;
          case "int64":
            return 7;
          case "uint64":
            return 13;
          case "int4":
            return 22;
          case "uint4":
            return 21;
          default:
            throw new Error(`unsupported data type: ${a}`);
        }
      }, ar = (a) => {
        switch (a) {
          case 3:
            return "int8";
          case 2:
            return "uint8";
          case 9:
            return "bool";
          case 5:
            return "int16";
          case 4:
            return "uint16";
          case 6:
            return "int32";
          case 12:
            return "uint32";
          case 10:
            return "float16";
          case 1:
            return "float32";
          case 11:
            return "float64";
          case 8:
            return "string";
          case 7:
            return "int64";
          case 13:
            return "uint64";
          case 22:
            return "int4";
          case 21:
            return "uint4";
          default:
            throw new Error(`unsupported data type: ${a}`);
        }
      }, mt = (a, r) => {
        let s = [-1, 4, 1, 1, 2, 2, 4, 8, -1, 1, 2, 8, 4, 8, -1, -1, -1, -1, -1, -1, -1, 0.5, 0.5][a], f = typeof r == "number" ? r : r.reduce((i, d) => i * d, 1);
        return s > 0 ? Math.ceil(f * s) : void 0;
      }, at = (a) => {
        switch (a) {
          case "float16":
            return typeof Float16Array < "u" ? Float16Array : Uint16Array;
          case "float32":
            return Float32Array;
          case "uint8":
            return Uint8Array;
          case "int8":
            return Int8Array;
          case "uint16":
            return Uint16Array;
          case "int16":
            return Int16Array;
          case "int32":
            return Int32Array;
          case "bool":
            return Uint8Array;
          case "float64":
            return Float64Array;
          case "uint32":
            return Uint32Array;
          case "int64":
            return BigInt64Array;
          case "uint64":
            return BigUint64Array;
          default:
            throw new Error(`unsupported type: ${a}`);
        }
      }, Ot = (a) => {
        switch (a) {
          case "verbose":
            return 0;
          case "info":
            return 1;
          case "warning":
            return 2;
          case "error":
            return 3;
          case "fatal":
            return 4;
          default:
            throw new Error(`unsupported logging level: ${a}`);
        }
      }, sr = (a) => a === "float32" || a === "float16" || a === "int32" || a === "int64" || a === "uint32" || a === "uint8" || a === "bool" || a === "uint4" || a === "int4", ir = (a) => a === "float32" || a === "float16" || a === "int32" || a === "int64" || a === "uint32" || a === "uint64" || a === "int8" || a === "uint8" || a === "bool" || a === "uint4" || a === "int4", an = (a) => {
        switch (a) {
          case "none":
            return 0;
          case "cpu":
            return 1;
          case "cpu-pinned":
            return 2;
          case "texture":
            return 3;
          case "gpu-buffer":
            return 4;
          case "ml-tensor":
            return 5;
          default:
            throw new Error(`unsupported data location: ${a}`);
        }
      };
    });
    sn = k(() => {
      qt();
      Mt = async (a) => {
        if (typeof a == "string") {
          let r = await fetch(a);
          if (!r.ok) throw new Error(`failed to load external data file: ${a}`);
          let s = r.headers.get("Content-Length"), f = s ? parseInt(s, 10) : 0;
          if (f < 1073741824) return new Uint8Array(await r.arrayBuffer());
          {
            if (!r.body) throw new Error(`failed to load external data file: ${a}, no response body.`);
            let i = r.body.getReader(), d;
            try {
              d = new ArrayBuffer(f);
            } catch (m) {
              if (m instanceof RangeError) {
                let y = Math.ceil(f / 65536);
                d = new WebAssembly.Memory({ initial: y, maximum: y }).buffer;
              } else throw m;
            }
            let l = 0;
            for (; ; ) {
              let { done: m, value: y } = await i.read();
              if (m) break;
              let w = y.byteLength;
              new Uint8Array(d, l, w).set(y), l += w;
            }
            return new Uint8Array(d, 0, f);
          }
        }
        else return a instanceof Blob ? new Uint8Array(await a.arrayBuffer()) : a instanceof Uint8Array ? a : new Uint8Array(a);
      };
    });
    bs = k(() => {
      st();
      ys = (a, r) => new (at(r))(a);
    });
    un = k(() => {
      st();
      dc = ["V", "I", "W", "E", "F"], lc = (a, r) => {
        console.log(`[${dc[a]},${(/* @__PURE__ */ new Date()).toISOString()}]${r}`);
      }, Ts = (a, r) => {
        ws = a, gs = r;
      }, pc = (a, r) => {
        let s = Ot(a), f = Ot(ws);
        s >= f && lc(s, typeof r == "function" ? r() : r);
      }, pe = (...a) => {
        gs && pc(...a);
      };
    });
    xs = k(() => {
      st();
      un();
      Es = /* @__PURE__ */ new Map([["float32", 32], ["float16", 16], ["int32", 32], ["uint32", 32], ["int64", 64], ["uint64", 64], ["int8", 8], ["uint8", 8], ["int4", 4], ["uint4", 4]]), cn = (a, r) => {
        if (r === "int32") return a;
        let s = Es.get(r);
        if (!s) throw new Error(`WebNN backend does not support data type: ${r}`);
        let f = s / 8;
        if (a.byteLength % f !== 0) throw new Error(`Invalid Uint8Array length - must be a multiple of ${f}.`);
        let i = a.byteLength / f, d = new (at(r))(a.buffer, a.byteOffset, i);
        switch (r) {
          case "int64":
          case "uint64": {
            let l = new Int32Array(i);
            for (let m = 0; m < i; m++) {
              let y = d[m];
              if (y > 2147483647n || y < -2147483648n) throw new Error("Can not convert int64 data to int32 - value out of range.");
              l[m] = Number(y);
            }
            return new Uint8Array(l.buffer);
          }
          case "int8":
          case "uint8":
          case "uint32": {
            if (r === "uint32" && d.some((m) => m > 2147483647)) throw new Error("Can not convert uint32 data to int32 - value out of range.");
            let l = Int32Array.from(d, Number);
            return new Uint8Array(l.buffer);
          }
          default:
            throw new Error(`Unsupported data conversion from ${r} to 'int32'`);
        }
      }, Ss = (a, r) => {
        if (r === "int32") return a;
        if (a.byteLength % 4 !== 0) throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");
        let s = a.byteLength / 4, f = new Int32Array(a.buffer, a.byteOffset, s);
        switch (r) {
          case "int64": {
            let i = BigInt64Array.from(f, BigInt);
            return new Uint8Array(i.buffer);
          }
          case "uint64": {
            if (f.some((d) => d < 0)) throw new Error("Can not convert int32 data to uin64 - negative value found.");
            let i = BigUint64Array.from(f, BigInt);
            return new Uint8Array(i.buffer);
          }
          case "int8": {
            if (f.some((d) => d < -128 || d > 127)) throw new Error("Can not convert int32 data to int8 - value out of range.");
            let i = Int8Array.from(f, Number);
            return new Uint8Array(i.buffer);
          }
          case "uint8": {
            if (f.some((i) => i < 0 || i > 255)) throw new Error("Can not convert int32 data to uint8 - value out of range.");
            return Uint8Array.from(f, Number);
          }
          case "uint32": {
            if (f.some((d) => d < 0)) throw new Error("Can not convert int32 data to uint32 - negative value found.");
            let i = Uint32Array.from(f, Number);
            return new Uint8Array(i.buffer);
          }
          default:
            throw new Error(`Unsupported data conversion from 'int32' to ${r}`);
        }
      }, mc = 1, vs = () => mc++, hc = /* @__PURE__ */ new Map([["int8", "int32"], ["uint8", "int32"], ["uint32", "int32"], ["int64", "int32"]]), As = (a, r) => {
        let s = Es.get(a);
        if (!s) throw new Error(`WebNN backend does not support data type: ${a}`);
        return r.length > 0 ? Math.ceil(r.reduce((f, i) => f * i) * s / 8) : 0;
      }, ur = class {
        constructor(r) {
          this.isDataConverted = false;
          let { sessionId: s, context: f, tensor: i, dataType: d, shape: l, fallbackDataType: m } = r;
          this.sessionId = s, this.mlContext = f, this.mlTensor = i, this.dataType = d, this.tensorShape = l, this.fallbackDataType = m;
        }
        get tensor() {
          return this.mlTensor;
        }
        get type() {
          return this.dataType;
        }
        get fallbackType() {
          return this.fallbackDataType;
        }
        get shape() {
          return this.tensorShape;
        }
        get byteLength() {
          return As(this.dataType, this.tensorShape);
        }
        destroy() {
          pe("verbose", () => "[WebNN] TensorWrapper.destroy"), this.mlTensor.destroy();
        }
        write(r) {
          this.mlContext.writeTensor(this.mlTensor, r);
        }
        async read(r) {
          if (this.fallbackDataType) {
            let s = await this.mlContext.readTensor(this.mlTensor), f = Ss(new Uint8Array(s), this.dataType);
            if (r) {
              (r instanceof ArrayBuffer ? new Uint8Array(r) : new Uint8Array(r.buffer, r.byteOffset, r.byteLength)).set(f);
              return;
            } else return new Uint8Array(f).buffer;
          } else return r ? this.mlContext.readTensor(this.mlTensor, r) : this.mlContext.readTensor(this.mlTensor);
        }
        canReuseTensor(r, s, f) {
          return this.mlContext === r && this.dataType === s && this.tensorShape.length === f.length && this.tensorShape.every((i, d) => i === f[d]);
        }
        setIsDataConverted(r) {
          this.isDataConverted = r;
        }
      }, fr = class {
        constructor(r, s) {
          this.tensorManager = r;
          this.wrapper = s;
        }
        get tensorWrapper() {
          return this.wrapper;
        }
        releaseTensor() {
          this.tensorWrapper && (this.tensorManager.releaseTensor(this.tensorWrapper), this.wrapper = void 0);
        }
        async ensureTensor(r, s, f, i) {
          let d = this.tensorManager.getMLContext(r), l = this.tensorManager.getMLOpSupportLimits(r), m;
          if (!l?.input.dataTypes.includes(s)) {
            if (m = hc.get(s), !m || l?.input.dataTypes.includes(m)) throw new Error(`WebNN backend does not support data type: ${s}`);
            pe("verbose", () => `[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${s} to ${m}`);
          }
          if (this.wrapper) {
            if (this.wrapper.canReuseTensor(d, s, f)) return this.wrapper.tensor;
            if (i) {
              if (this.wrapper.byteLength !== As(s, f)) throw new Error("Unable to copy data to tensor with different size.");
              this.activeUpload = new Uint8Array(await this.wrapper.read());
            }
            this.tensorManager.releaseTensor(this.wrapper);
          }
          let y = typeof MLTensorUsage > "u" ? void 0 : MLTensorUsage.READ | MLTensorUsage.WRITE;
          return this.wrapper = await this.tensorManager.getCachedTensor(r, s, f, y, true, true, m), i && this.activeUpload && (this.wrapper.write(this.activeUpload), this.activeUpload = void 0), this.wrapper.tensor;
        }
        upload(r) {
          let s = r;
          if (this.wrapper) {
            if (this.wrapper.fallbackType) if (this.wrapper.fallbackType === "int32") s = cn(r, this.wrapper.type), this.wrapper.setIsDataConverted(true);
            else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);
            if (r.byteLength === this.wrapper.byteLength) {
              this.wrapper.write(s);
              return;
            } else pe("verbose", () => "Data size does not match tensor size. Releasing tensor."), this.releaseTensor();
          }
          this.activeUpload ? this.activeUpload.set(s) : this.activeUpload = new Uint8Array(s);
        }
        async download(r) {
          if (this.activeUpload) {
            let s = this.wrapper?.isDataConverted ? Ss(this.activeUpload, this.wrapper?.type) : this.activeUpload;
            if (r) {
              r instanceof ArrayBuffer ? new Uint8Array(r).set(s) : new Uint8Array(r.buffer, r.byteOffset, r.byteLength).set(s);
              return;
            } else return s.buffer;
          }
          if (!this.wrapper) throw new Error("Tensor has not been created.");
          return r ? this.wrapper.read(r) : this.wrapper.read();
        }
      }, fn = class {
        constructor(r) {
          this.backend = r;
          this.tensorTrackersById = /* @__PURE__ */ new Map();
          this.freeTensors = [];
          this.externalTensors = /* @__PURE__ */ new Set();
        }
        getMLContext(r) {
          let s = this.backend.getMLContext(r);
          if (!s) throw new Error("MLContext not found for session.");
          return s;
        }
        getMLOpSupportLimits(r) {
          return this.backend.getMLOpSupportLimits(r);
        }
        reserveTensorId() {
          let r = vs();
          return this.tensorTrackersById.set(r, new fr(this)), r;
        }
        releaseTensorId(r) {
          let s = this.tensorTrackersById.get(r);
          s && (this.tensorTrackersById.delete(r), s.tensorWrapper && this.releaseTensor(s.tensorWrapper));
        }
        async ensureTensor(r, s, f, i, d) {
          pe("verbose", () => `[WebNN] TensorManager.ensureTensor {tensorId: ${s}, dataType: ${f}, shape: ${i}, copyOld: ${d}}`);
          let l = this.tensorTrackersById.get(s);
          if (!l) throw new Error("Tensor not found.");
          return l.ensureTensor(r, f, i, d);
        }
        upload(r, s) {
          let f = this.tensorTrackersById.get(r);
          if (!f) throw new Error("Tensor not found.");
          f.upload(s);
        }
        async download(r, s) {
          pe("verbose", () => `[WebNN] TensorManager.download {tensorId: ${r}, dstBuffer: ${s?.byteLength}}`);
          let f = this.tensorTrackersById.get(r);
          if (!f) throw new Error("Tensor not found.");
          return f.download(s);
        }
        releaseTensorsForSession(r) {
          for (let s of this.freeTensors) s.sessionId === r && s.destroy();
          this.freeTensors = this.freeTensors.filter((s) => s.sessionId !== r);
        }
        registerTensor(r, s, f, i) {
          let d = this.getMLContext(r), l = vs(), m = new ur({ sessionId: r, context: d, tensor: s, dataType: f, shape: i });
          return this.tensorTrackersById.set(l, new fr(this, m)), this.externalTensors.add(m), l;
        }
        async getCachedTensor(r, s, f, i, d, l, m) {
          let y = this.getMLContext(r);
          for (let [T, g] of this.freeTensors.entries()) if (g.canReuseTensor(y, s, f)) {
            pe("verbose", () => `[WebNN] Reusing tensor {dataType: ${s}, ${m ? `fallbackDataType: ${m},` : ""} shape: ${f}`);
            let v = this.freeTensors.splice(T, 1)[0];
            return v.sessionId = r, v;
          }
          pe("verbose", () => `[WebNN] MLContext.createTensor {dataType: ${s}, ${m ? `fallbackDataType: ${m},` : ""} shape: ${f}}`);
          let w = await y.createTensor({ dataType: m ?? s, shape: f, dimensions: f, usage: i, writable: d, readable: l });
          return new ur({ sessionId: r, context: y, tensor: w, dataType: s, shape: f, fallbackDataType: m });
        }
        releaseTensor(r) {
          this.externalTensors.has(r) && this.externalTensors.delete(r), this.freeTensors.push(r);
        }
      }, Is = (...a) => new fn(...a);
    });
    Ls = {};
    At(Ls, { WebNNBackend: () => dn });
    Bs = k(() => {
      st();
      je();
      bs();
      xs();
      un();
      cr = /* @__PURE__ */ new Map([[1, "float32"], [10, "float16"], [6, "int32"], [12, "uint32"], [7, "int64"], [13, "uint64"], [22, "int4"], [21, "uint4"], [3, "int8"], [2, "uint8"], [9, "uint8"]]), yc = (a, r) => {
        if (a === r) return true;
        if (a === void 0 || r === void 0) return false;
        let s = Object.keys(a).sort(), f = Object.keys(r).sort();
        return s.length === f.length && s.every((i, d) => i === f[d] && a[i] === r[i]);
      }, dn = class {
        constructor(r) {
          this.tensorManager = Is(this);
          this.mlContextBySessionId = /* @__PURE__ */ new Map();
          this.sessionIdsByMLContext = /* @__PURE__ */ new Map();
          this.mlContextCache = [];
          this.sessionGraphInputs = /* @__PURE__ */ new Map();
          this.sessionGraphOutputs = /* @__PURE__ */ new Map();
          this.temporaryGraphInputs = [];
          this.temporaryGraphOutputs = [];
          this.temporarySessionTensorIds = /* @__PURE__ */ new Map();
          this.mlOpSupportLimitsBySessionId = /* @__PURE__ */ new Map();
          Ts(r.logLevel, !!r.debug);
        }
        get currentSessionId() {
          if (this.activeSessionId === void 0) throw new Error("No active session");
          return this.activeSessionId;
        }
        onRunStart(r) {
          pe("verbose", () => `[WebNN] onRunStart {sessionId: ${r}}`), this.activeSessionId = r;
        }
        onRunEnd(r) {
          pe("verbose", () => `[WebNN] onRunEnd {sessionId: ${r}}`);
          let s = this.temporarySessionTensorIds.get(r);
          if (s) {
            for (let f of s) pe("verbose", () => `[WebNN] releasing temporary tensor {tensorId: ${f}}`), this.tensorManager.releaseTensorId(f);
            this.temporarySessionTensorIds.delete(r), this.activeSessionId = void 0;
          }
        }
        async createMLContext(r) {
          if (r instanceof GPUDevice) {
            let f = this.mlContextCache.findIndex((i) => i.gpuDevice === r);
            if (f !== -1) return this.mlContextCache[f].mlContext;
            {
              let i = await navigator.ml.createContext(r);
              return this.mlContextCache.push({ gpuDevice: r, mlContext: i }), i;
            }
          } else if (r === void 0) {
            let f = this.mlContextCache.findIndex((i) => i.options === void 0 && i.gpuDevice === void 0);
            if (f !== -1) return this.mlContextCache[f].mlContext;
            {
              let i = await navigator.ml.createContext();
              return this.mlContextCache.push({ mlContext: i }), i;
            }
          }
          let s = this.mlContextCache.findIndex((f) => yc(f.options, r));
          if (s !== -1) return this.mlContextCache[s].mlContext;
          {
            let f = await navigator.ml.createContext(r);
            return this.mlContextCache.push({ options: r, mlContext: f }), f;
          }
        }
        registerMLContext(r, s) {
          this.mlContextBySessionId.set(r, s);
          let f = this.sessionIdsByMLContext.get(s);
          f || (f = /* @__PURE__ */ new Set(), this.sessionIdsByMLContext.set(s, f)), f.add(r), this.mlOpSupportLimitsBySessionId.has(r) || this.mlOpSupportLimitsBySessionId.set(r, s.opSupportLimits()), this.temporaryGraphInputs.length > 0 && (this.sessionGraphInputs.set(r, this.temporaryGraphInputs), this.temporaryGraphInputs = []), this.temporaryGraphOutputs.length > 0 && (this.sessionGraphOutputs.set(r, this.temporaryGraphOutputs), this.temporaryGraphOutputs = []);
        }
        onReleaseSession(r) {
          this.sessionGraphInputs.delete(r), this.sessionGraphOutputs.delete(r);
          let s = this.mlContextBySessionId.get(r);
          if (!s) return;
          this.tensorManager.releaseTensorsForSession(r), this.mlContextBySessionId.delete(r), this.mlOpSupportLimitsBySessionId.delete(r);
          let f = this.sessionIdsByMLContext.get(s);
          if (f.delete(r), f.size === 0) {
            this.sessionIdsByMLContext.delete(s);
            let i = this.mlContextCache.findIndex((d) => d.mlContext === s);
            i !== -1 && this.mlContextCache.splice(i, 1);
          }
        }
        getMLContext(r) {
          return this.mlContextBySessionId.get(r);
        }
        getMLOpSupportLimits(r) {
          return this.mlOpSupportLimitsBySessionId.get(r);
        }
        reserveTensorId() {
          return this.tensorManager.reserveTensorId();
        }
        releaseTensorId(r) {
          pe("verbose", () => `[WebNN] releaseTensorId {tensorId: ${r}}`), this.tensorManager.releaseTensorId(r);
        }
        async ensureTensor(r, s, f, i, d) {
          let l = cr.get(f);
          if (!l) throw new Error(`Unsupported ONNX data type: ${f}`);
          return this.tensorManager.ensureTensor(r ?? this.currentSessionId, s, l, i, d);
        }
        async createTemporaryTensor(r, s, f) {
          pe("verbose", () => `[WebNN] createTemporaryTensor {onnxDataType: ${s}, shape: ${f}}`);
          let i = cr.get(s);
          if (!i) throw new Error(`Unsupported ONNX data type: ${s}`);
          let d = this.tensorManager.reserveTensorId();
          await this.tensorManager.ensureTensor(r, d, i, f, false);
          let l = this.temporarySessionTensorIds.get(r);
          return l ? l.push(d) : this.temporarySessionTensorIds.set(r, [d]), d;
        }
        uploadTensor(r, s) {
          if (!z().shouldTransferToMLTensor) throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");
          pe("verbose", () => `[WebNN] uploadTensor {tensorId: ${r}, data: ${s.byteLength}}`), this.tensorManager.upload(r, s);
        }
        async downloadTensor(r, s) {
          return this.tensorManager.download(r, s);
        }
        createMLTensorDownloader(r, s) {
          return async () => {
            let f = await this.tensorManager.download(r);
            return ys(f, s);
          };
        }
        registerMLTensor(r, s, f, i) {
          let d = cr.get(f);
          if (!d) throw new Error(`Unsupported ONNX data type: ${f}`);
          let l = this.tensorManager.registerTensor(r, s, d, i);
          return pe("verbose", () => `[WebNN] registerMLTensor {tensor: ${s}, dataType: ${d}, dimensions: ${i}} -> {tensorId: ${l}}`), l;
        }
        registerMLConstant(r, s, f, i, d, l, m = false) {
          if (!l) throw new Error("External mounted files are not available.");
          let y = r;
          r.startsWith("./") && (y = r.substring(2));
          let w = l.get(y);
          if (!w) throw new Error(`File with name ${y} not found in preloaded files.`);
          if (s + f > w.byteLength) throw new Error("Out of bounds: data offset and length exceed the external file data size.");
          let T = w.slice(s, s + f).buffer, g;
          switch (d.dataType) {
            case "float32":
              g = new Float32Array(T);
              break;
            case "float16":
              g = typeof Float16Array < "u" ? new Float16Array(T) : new Uint16Array(T);
              break;
            case "int32":
              g = new Int32Array(T);
              break;
            case "uint32":
              g = new Uint32Array(T);
              break;
            case "int64":
              if (m) {
                let v = cn(new Uint8Array(T), "int64");
                g = new Int32Array(v.buffer), d.dataType = "int32";
              } else g = new BigInt64Array(T);
              break;
            case "uint64":
              g = new BigUint64Array(T);
              break;
            case "int8":
              g = new Int8Array(T);
              break;
            case "int4":
            case "uint4":
            case "uint8":
              g = new Uint8Array(T);
              break;
            default:
              throw new Error(`Unsupported data type: ${d.dataType} in creating WebNN Constant from external data.`);
          }
          return pe("verbose", () => `[WebNN] registerMLConstant {dataType: ${d.dataType}, shape: ${d.shape}}} ${m ? "(Note: it was int64 data type and registered to int32 as workaround)" : ""}`), i.constant(d, g);
        }
        registerGraphInput(r) {
          this.temporaryGraphInputs.push(r);
        }
        registerGraphOutput(r) {
          this.temporaryGraphOutputs.push(r);
        }
        isGraphInput(r, s) {
          let f = this.sessionGraphInputs.get(r);
          return f ? f.includes(s) : false;
        }
        isGraphOutput(r, s) {
          let f = this.sessionGraphOutputs.get(r);
          return f ? f.includes(s) : false;
        }
        isGraphInputOutputTypeSupported(r, s, f = true) {
          let i = cr.get(He(s)), d = this.mlOpSupportLimitsBySessionId.get(r);
          return typeof i > "u" ? false : f ? !!d?.input.dataTypes.includes(i) : !!d?.output.dataTypes.includes(i);
        }
        flush() {
        }
      };
    });
    en = k(() => {
      Ve();
      ps();
      hs();
      st();
      je();
      or();
      sn();
      bc = (a, r) => {
        z()._OrtInit(a, r) !== 0 && $("Can't initialize onnxruntime.");
      }, Xt = async (a) => {
        bc(a.wasm.numThreads, Ot(a.logLevel));
      }, Zt = async (a, r) => {
        z().asyncInit?.();
        let s = a.webgpu.adapter;
        if (r === "webgpu") {
          if (typeof navigator > "u" || !navigator.gpu) throw new Error("WebGPU is not supported in current environment");
          if (s) {
            if (typeof s.limits != "object" || typeof s.features != "object" || typeof s.requestDevice != "function") throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.");
          } else {
            let f = a.webgpu.powerPreference;
            if (f !== void 0 && f !== "low-power" && f !== "high-performance") throw new Error(`Invalid powerPreference setting: "${f}"`);
            let i = a.webgpu.forceFallbackAdapter;
            if (i !== void 0 && typeof i != "boolean") throw new Error(`Invalid forceFallbackAdapter setting: "${i}"`);
            if (s = await navigator.gpu.requestAdapter({ powerPreference: f, forceFallbackAdapter: i }), !s) throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.');
          }
        }
        if (r === "webnn" && (typeof navigator > "u" || !navigator.ml)) throw new Error("WebNN is not supported in current environment");
        if (r === "webgpu" && z().webgpuInit((f) => {
          a.webgpu.device = f;
        }), r === "webnn") {
          let f = new (Bs(), zt(Ls)).WebNNBackend(a);
          z().webnnInit([f, () => f.reserveTensorId(), (i) => f.releaseTensorId(i), async (i, d, l, m, y) => f.ensureTensor(i, d, l, m, y), (i, d) => {
            f.uploadTensor(i, d);
          }, async (i, d) => f.downloadTensor(i, d), (i, d) => f.registerMLContext(i, d), !!a.trace]);
        }
      }, it = /* @__PURE__ */ new Map(), wc = (a) => {
        let r = z(), s = r.stackSave();
        try {
          let f = r.PTR_SIZE, i = r.stackAlloc(2 * f);
          r._OrtGetInputOutputCount(a, i, i + f) !== 0 && $("Can't get session input/output count.");
          let l = f === 4 ? "i32" : "i64";
          return [Number(r.getValue(i, l)), Number(r.getValue(i + f, l))];
        } finally {
          r.stackRestore(s);
        }
      }, Os = (a, r) => {
        let s = z(), f = s.stackSave(), i = 0;
        try {
          let d = s.PTR_SIZE, l = s.stackAlloc(2 * d);
          s._OrtGetInputOutputMetadata(a, r, l, l + d) !== 0 && $("Can't get session input/output metadata.");
          let y = Number(s.getValue(l, "*"));
          i = Number(s.getValue(l + d, "*"));
          let w = s.HEAP32[i / 4];
          if (w === 0) return [y, 0];
          let T = s.HEAPU32[i / 4 + 1], g = [];
          for (let v = 0; v < T; v++) {
            let S = Number(s.getValue(i + 8 + v * d, "*"));
            g.push(S !== 0 ? s.UTF8ToString(S) : Number(s.getValue(i + 8 + (v + T) * d, "*")));
          }
          return [y, w, g];
        } finally {
          s.stackRestore(f), i !== 0 && s._OrtFree(i);
        }
      }, xt = (a) => {
        let r = z(), s = r._malloc(a.byteLength);
        if (s === 0) throw new Error(`Can't create a session. failed to allocate a buffer of size ${a.byteLength}.`);
        return r.HEAPU8.set(a, s), [s, a.byteLength];
      }, Kt = async (a, r) => {
        let s, f, i = z();
        Array.isArray(a) ? [s, f] = a : a.buffer === i.HEAPU8.buffer ? [s, f] = [a.byteOffset, a.byteLength] : [s, f] = xt(a);
        let d = 0, l = 0, m = 0, y = [], w = [], T = [];
        try {
          if ([l, y] = await ms(r), r?.externalData && i.mountExternalData) {
            let B = [];
            for (let W2 of r.externalData) {
              let oe2 = typeof W2 == "string" ? W2 : W2.path;
              B.push(Mt(typeof W2 == "string" ? W2 : W2.data).then((p) => {
                i.mountExternalData(oe2, p);
              }));
            }
            await Promise.all(B);
          }
          for (let B of r?.executionProviders ?? []) if ((typeof B == "string" ? B : B.name) === "webnn") {
            if (i.shouldTransferToMLTensor = false, typeof B != "string") {
              let oe2 = B, p = oe2?.context, ne = oe2?.gpuDevice, X = oe2?.deviceType, J2 = oe2?.powerPreference;
              p ? i.currentContext = p : ne ? i.currentContext = await i.webnnCreateMLContext(ne) : i.currentContext = await i.webnnCreateMLContext({ deviceType: X, powerPreference: J2 });
            } else i.currentContext = await i.webnnCreateMLContext();
            break;
          }
          d = await i._OrtCreateSession(s, f, l), i.webgpuOnCreateSession?.(d), d === 0 && $("Can't create a session."), i.jsepOnCreateSession?.(), i.currentContext && (i.webnnRegisterMLContext(d, i.currentContext), i.currentContext = void 0, i.shouldTransferToMLTensor = true);
          let [g, v] = wc(d), S = !!r?.enableGraphCapture, U2 = [], R = [], H = [], C = [], M = [];
          for (let B = 0; B < g; B++) {
            let [W2, oe2, p] = Os(d, B);
            W2 === 0 && $("Can't get an input name."), w.push(W2);
            let ne = i.UTF8ToString(W2);
            U2.push(ne), H.push(oe2 === 0 ? { name: ne, isTensor: false } : { name: ne, isTensor: true, type: ar(oe2), shape: p });
          }
          for (let B = 0; B < v; B++) {
            let [W2, oe2, p] = Os(d, B + g);
            W2 === 0 && $("Can't get an output name."), T.push(W2);
            let ne = i.UTF8ToString(W2);
            R.push(ne), C.push(oe2 === 0 ? { name: ne, isTensor: false } : { name: ne, isTensor: true, type: ar(oe2), shape: p });
            {
              if (S && r?.preferredOutputLocation === void 0) {
                M.push("gpu-buffer");
                continue;
              }
              let X = typeof r?.preferredOutputLocation == "string" ? r.preferredOutputLocation : r?.preferredOutputLocation?.[ne] ?? "cpu", J2 = i.webnnIsGraphOutput;
              if (X === "cpu" && J2 && J2(d, ne)) {
                M.push("ml-tensor-cpu-output");
                continue;
              }
              if (X !== "cpu" && X !== "cpu-pinned" && X !== "gpu-buffer" && X !== "ml-tensor") throw new Error(`Not supported preferred output location: ${X}.`);
              if (S && X !== "gpu-buffer") throw new Error(`Not supported preferred output location: ${X}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);
              M.push(X);
            }
          }
          let q = null;
          return M.some((B) => B === "gpu-buffer" || B === "ml-tensor" || B === "ml-tensor-cpu-output") && (m = i._OrtCreateBinding(d), m === 0 && $("Can't create IO binding."), q = { handle: m, outputPreferredLocations: M, outputPreferredLocationsEncoded: M.map((B) => B === "ml-tensor-cpu-output" ? "ml-tensor" : B).map((B) => an(B)) }), it.set(d, [d, w, T, q, S, false]), [d, U2, R, H, C];
        } catch (g) {
          throw w.forEach((v) => i._OrtFree(v)), T.forEach((v) => i._OrtFree(v)), m !== 0 && i._OrtReleaseBinding(m) !== 0 && $("Can't release IO binding."), d !== 0 && i._OrtReleaseSession(d) !== 0 && $("Can't release session."), g;
        } finally {
          i._free(s), l !== 0 && i._OrtReleaseSessionOptions(l) !== 0 && $("Can't release session options."), y.forEach((g) => i._free(g)), i.unmountExternalData?.();
        }
      }, Qt = (a) => {
        let r = z(), s = it.get(a);
        if (!s) throw new Error(`cannot release session. invalid session id: ${a}`);
        let [f, i, d, l, m] = s;
        l && (m && r._OrtClearBoundOutputs(l.handle) !== 0 && $("Can't clear bound outputs."), r._OrtReleaseBinding(l.handle) !== 0 && $("Can't release IO binding.")), r.jsepOnReleaseSession?.(a), r.webnnOnReleaseSession?.(a), r.webgpuOnReleaseSession?.(a), i.forEach((y) => r._OrtFree(y)), d.forEach((y) => r._OrtFree(y)), r._OrtReleaseSession(f) !== 0 && $("Can't release session."), it.delete(a);
      }, Ms = async (a, r, s, f, i, d, l = false) => {
        if (!a) {
          r.push(0);
          return;
        }
        let m = z(), y = m.PTR_SIZE, w = a[0], T = a[1], g = a[3], v = g, S, U2;
        if (w === "string" && (g === "gpu-buffer" || g === "ml-tensor")) throw new Error("String tensor is not supported on GPU.");
        if (l && g !== "gpu-buffer") throw new Error(`External buffer must be provided for input/output index ${d} when enableGraphCapture is true.`);
        if (g === "gpu-buffer") {
          let C = a[2].gpuBuffer;
          U2 = mt(He(w), T);
          {
            let M = m.webgpuRegisterBuffer;
            if (!M) throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');
            S = M(C, f);
          }
        } else if (g === "ml-tensor") {
          let C = a[2].mlTensor;
          U2 = mt(He(w), T);
          let M = m.webnnRegisterMLTensor;
          if (!M) throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');
          S = M(f, C, He(w), T);
        } else {
          let C = a[2];
          if (Array.isArray(C)) {
            U2 = y * C.length, S = m._malloc(U2), s.push(S);
            for (let M = 0; M < C.length; M++) {
              if (typeof C[M] != "string") throw new TypeError(`tensor data at index ${M} is not a string`);
              m.setValue(S + M * y, be(C[M], s), "*");
            }
          } else {
            let M = m.webnnIsGraphInput, q = m.webnnIsGraphOutput;
            if (w !== "string" && M && q) {
              let B = m.UTF8ToString(i);
              if (M(f, B) || q(f, B)) {
                let W2 = He(w);
                U2 = mt(W2, T), v = "ml-tensor";
                let oe2 = m.webnnCreateTemporaryTensor, p = m.webnnUploadTensor;
                if (!oe2 || !p) throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');
                let ne = await oe2(f, W2, T);
                p(ne, new Uint8Array(C.buffer, C.byteOffset, C.byteLength)), S = ne;
              } else U2 = C.byteLength, S = m._malloc(U2), s.push(S), m.HEAPU8.set(new Uint8Array(C.buffer, C.byteOffset, U2), S);
            } else U2 = C.byteLength, S = m._malloc(U2), s.push(S), m.HEAPU8.set(new Uint8Array(C.buffer, C.byteOffset, U2), S);
          }
        }
        let R = m.stackSave(), H = m.stackAlloc(4 * T.length);
        try {
          T.forEach((M, q) => m.setValue(H + q * y, M, y === 4 ? "i32" : "i64"));
          let C = m._OrtCreateTensor(He(w), S, U2, H, T.length, an(v));
          C === 0 && $(`Can't create tensor for input/output. session=${f}, index=${d}.`), r.push(C);
        } finally {
          m.stackRestore(R);
        }
      }, er = async (a, r, s, f, i, d) => {
        let l = z(), m = l.PTR_SIZE, y = it.get(a);
        if (!y) throw new Error(`cannot run inference. invalid session id: ${a}`);
        let w = y[0], T = y[1], g = y[2], v = y[3], S = y[4], U2 = y[5], R = r.length, H = f.length, C = 0, M = [], q = [], B = [], W2 = [], oe2 = [], p = l.stackSave(), ne = l.stackAlloc(R * m), X = l.stackAlloc(R * m), J2 = l.stackAlloc(H * m), Ce2 = l.stackAlloc(H * m);
        try {
          [C, M] = ls(d), $e("wasm prepareInputOutputTensor");
          for (let _ = 0; _ < R; _++) await Ms(s[_], q, W2, a, T[r[_]], r[_], S);
          for (let _ = 0; _ < H; _++) await Ms(i[_], B, W2, a, g[f[_]], R + f[_], S);
          ze("wasm prepareInputOutputTensor");
          for (let _ = 0; _ < R; _++) l.setValue(ne + _ * m, q[_], "*"), l.setValue(X + _ * m, T[r[_]], "*");
          for (let _ = 0; _ < H; _++) l.setValue(J2 + _ * m, B[_], "*"), l.setValue(Ce2 + _ * m, g[f[_]], "*");
          if (v && !U2) {
            let { handle: _, outputPreferredLocations: ae, outputPreferredLocationsEncoded: me2 } = v;
            if (T.length !== R) throw new Error(`input count from feeds (${R}) is expected to be always equal to model's input count (${T.length}).`);
            $e("wasm bindInputsOutputs");
            for (let Y = 0; Y < R; Y++) {
              let we2 = r[Y];
              await l._OrtBindInput(_, T[we2], q[Y]) !== 0 && $(`Can't bind input[${Y}] for session=${a}.`);
            }
            for (let Y = 0; Y < H; Y++) {
              let we2 = f[Y];
              i[Y]?.[3] ? (oe2.push(B[Y]), l._OrtBindOutput(_, g[we2], B[Y], 0) !== 0 && $(`Can't bind pre-allocated output[${Y}] for session=${a}.`)) : l._OrtBindOutput(_, g[we2], 0, me2[we2]) !== 0 && $(`Can't bind output[${Y}] to ${ae[Y]} for session=${a}.`);
            }
            ze("wasm bindInputsOutputs"), it.set(a, [w, T, g, v, S, true]);
          }
          l.jsepOnRunStart?.(w), l.webnnOnRunStart?.(w);
          let Z;
          v ? Z = await l._OrtRunWithBinding(w, v.handle, H, J2, C) : Z = await l._OrtRun(w, X, ne, R, Ce2, H, J2, C), Z !== 0 && $("failed to call OrtRun().");
          let x = [], A = [];
          $e("wasm ProcessOutputTensor");
          for (let _ = 0; _ < H; _++) {
            let ae = Number(l.getValue(J2 + _ * m, "*"));
            if (ae === B[_] || oe2.includes(B[_])) {
              x.push(i[_]), ae !== B[_] && l._OrtReleaseTensor(ae) !== 0 && $("Can't release tensor.");
              continue;
            }
            let me2 = l.stackSave(), Y = l.stackAlloc(4 * m), we2 = false, re2, se = 0;
            try {
              l._OrtGetTensorData(ae, Y, Y + m, Y + 2 * m, Y + 3 * m) !== 0 && $(`Can't access output tensor data on index ${_}.`);
              let Te = m === 4 ? "i32" : "i64", qe = Number(l.getValue(Y, Te));
              se = l.getValue(Y + m, "*");
              let bt = l.getValue(Y + m * 2, "*"), wt2 = Number(l.getValue(Y + m * 3, Te)), Se = [];
              for (let ee2 = 0; ee2 < wt2; ee2++) Se.push(Number(l.getValue(bt + ee2 * m, Te)));
              l._OrtFree(bt) !== 0 && $("Can't free memory for tensor dims.");
              let Ae = Se.reduce((ee2, K) => ee2 * K, 1);
              re2 = ar(qe);
              let Be2 = v?.outputPreferredLocations[f[_]];
              if (re2 === "string") {
                if (Be2 === "gpu-buffer" || Be2 === "ml-tensor") throw new Error("String tensor is not supported on GPU.");
                let ee2 = [];
                for (let K = 0; K < Ae; K++) {
                  let G = l.getValue(se + K * m, "*"), V2 = l.getValue(se + (K + 1) * m, "*"), Ye2 = K === Ae - 1 ? void 0 : V2 - G;
                  ee2.push(l.UTF8ToString(G, Ye2));
                }
                x.push([re2, Se, ee2, "cpu"]);
              } else if (Be2 === "gpu-buffer" && Ae > 0) {
                let ee2 = l.webgpuGetBuffer;
                if (!ee2) throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');
                let K = ee2(se), G = mt(qe, Ae);
                if (G === void 0 || !sr(re2)) throw new Error(`Unsupported data type: ${re2}`);
                we2 = true;
                {
                  l.webgpuRegisterBuffer(K, a, se);
                  let V2 = l.webgpuCreateDownloader(K, G, a);
                  x.push([re2, Se, { gpuBuffer: K, download: async () => {
                    let Ye2 = await V2();
                    return new (at(re2))(Ye2);
                  }, dispose: () => {
                    l._OrtReleaseTensor(ae) !== 0 && $("Can't release tensor.");
                  } }, "gpu-buffer"]);
                }
              } else if (Be2 === "ml-tensor" && Ae > 0) {
                let ee2 = l.webnnEnsureTensor, K = l.webnnIsGraphInputOutputTypeSupported;
                if (!ee2 || !K) throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');
                if (mt(qe, Ae) === void 0 || !ir(re2)) throw new Error(`Unsupported data type: ${re2}`);
                if (!K(a, re2, false)) throw new Error(`preferredLocation "ml-tensor" for ${re2} output is not supported by current WebNN Context.`);
                let V2 = await ee2(a, se, qe, Se, false);
                we2 = true, x.push([re2, Se, { mlTensor: V2, download: l.webnnCreateMLTensorDownloader(se, re2), dispose: () => {
                  l.webnnReleaseTensorId(se), l._OrtReleaseTensor(ae);
                } }, "ml-tensor"]);
              } else if (Be2 === "ml-tensor-cpu-output" && Ae > 0) {
                let ee2 = l.webnnCreateMLTensorDownloader(se, re2)(), K = x.length;
                we2 = true, A.push((async () => {
                  let G = [K, await ee2];
                  return l.webnnReleaseTensorId(se), l._OrtReleaseTensor(ae), G;
                })()), x.push([re2, Se, [], "cpu"]);
              } else {
                let ee2 = at(re2), K = new ee2(Ae);
                new Uint8Array(K.buffer, K.byteOffset, K.byteLength).set(l.HEAPU8.subarray(se, se + K.byteLength)), x.push([re2, Se, K, "cpu"]);
              }
            } finally {
              l.stackRestore(me2), re2 === "string" && se && l._free(se), we2 || l._OrtReleaseTensor(ae);
            }
          }
          v && !S && (l._OrtClearBoundOutputs(v.handle) !== 0 && $("Can't clear bound outputs."), it.set(a, [w, T, g, v, S, false]));
          for (let [_, ae] of await Promise.all(A)) x[_][2] = ae;
          return ze("wasm ProcessOutputTensor"), x;
        } finally {
          l.webnnOnRunEnd?.(w), l.stackRestore(p), s.forEach((Z) => {
            Z && Z[3] === "gpu-buffer" && l.webgpuUnregisterBuffer(Z[2].gpuBuffer);
          }), i.forEach((Z) => {
            Z && Z[3] === "gpu-buffer" && l.webgpuUnregisterBuffer(Z[2].gpuBuffer);
          }), q.forEach((Z) => l._OrtReleaseTensor(Z)), B.forEach((Z) => l._OrtReleaseTensor(Z)), W2.forEach((Z) => l._free(Z)), C !== 0 && l._OrtReleaseRunOptions(C), M.forEach((Z) => l._free(Z));
        }
      }, tr = (a) => {
        let r = z(), s = it.get(a);
        if (!s) throw new Error("invalid session id");
        let f = s[0], i = r._OrtEndProfiling(f);
        i === 0 && $("Can't get an profile file name."), r._OrtFree(i);
      }, rr = (a) => {
        let r = [];
        for (let s of a) {
          let f = s[2];
          !Array.isArray(f) && "buffer" in f && r.push(f.buffer);
        }
        return r;
      };
    });
    mn = k(() => {
      Ve();
      en();
      je();
      Yt();
      ut = () => !!Q.wasm.proxy && typeof document < "u", Ut = false, lr = false, pr = false, pn = /* @__PURE__ */ new Map(), ht = (a, r) => {
        let s = pn.get(a);
        s ? s.push(r) : pn.set(a, [r]);
      }, yt = () => {
        if (Ut || !lr || pr || !Ee) throw new Error("worker not ready");
      }, Tc = (a) => {
        switch (a.data.type) {
          case "init-wasm":
            Ut = false, a.data.err ? (pr = true, ln[1](a.data.err)) : (lr = true, ln[0]()), dr && (URL.revokeObjectURL(dr), dr = void 0);
            break;
          case "init-ep":
          case "copy-from":
          case "create":
          case "release":
          case "run":
          case "end-profiling": {
            let r = pn.get(a.data.type);
            a.data.err ? r.shift()[1](a.data.err) : r.shift()[0](a.data.out);
            break;
          }
        }
      }, Us = async () => {
        if (!lr) {
          if (Ut) throw new Error("multiple calls to 'initWasm()' detected.");
          if (pr) throw new Error("previous call to 'initWasm()' failed.");
          if (Ut = true, ut()) return new Promise((a, r) => {
            Ee?.terminate(), fs().then(([s, f]) => {
              try {
                Ee = f, Ee.onerror = (d) => r(d), Ee.onmessage = Tc, ln = [a, r];
                let i = { type: "init-wasm", in: Q };
                !i.in.wasm.wasmPaths && (s || rn) && (i.in.wasm.wasmPaths = { wasm: new URL("ort-wasm-simd-threaded.asyncify.wasm", import.meta.url).href }), Ee.postMessage(i), dr = s;
              } catch (i) {
                r(i);
              }
            }, r);
          });
          try {
            await Jt(Q.wasm), await Xt(Q), lr = true;
          } catch (a) {
            throw pr = true, a;
          } finally {
            Ut = false;
          }
        }
      }, Cs = async (a) => {
        if (ut()) return yt(), new Promise((r, s) => {
          ht("init-ep", [r, s]);
          let f = { type: "init-ep", in: { epName: a, env: Q } };
          Ee.postMessage(f);
        });
        await Zt(Q, a);
      }, Ds = async (a) => ut() ? (yt(), new Promise((r, s) => {
        ht("copy-from", [r, s]);
        let f = { type: "copy-from", in: { buffer: a } };
        Ee.postMessage(f, [a.buffer]);
      })) : xt(a), Ps = async (a, r) => {
        if (ut()) {
          if (r?.preferredOutputLocation) throw new Error('session option "preferredOutputLocation" is not supported for proxy.');
          return yt(), new Promise((s, f) => {
            ht("create", [s, f]);
            let i = { type: "create", in: { model: a, options: { ...r } } }, d = [];
            a instanceof Uint8Array && d.push(a.buffer), Ee.postMessage(i, d);
          });
        } else return Kt(a, r);
      }, _s = async (a) => {
        if (ut()) return yt(), new Promise((r, s) => {
          ht("release", [r, s]);
          let f = { type: "release", in: a };
          Ee.postMessage(f);
        });
        Qt(a);
      }, Rs = async (a, r, s, f, i, d) => {
        if (ut()) {
          if (s.some((l) => l[3] !== "cpu")) throw new Error("input tensor on GPU is not supported for proxy.");
          if (i.some((l) => l)) throw new Error("pre-allocated output tensor is not supported for proxy.");
          return yt(), new Promise((l, m) => {
            ht("run", [l, m]);
            let y = s, w = { type: "run", in: { sessionId: a, inputIndices: r, inputs: y, outputIndices: f, options: d } };
            Ee.postMessage(w, rr(y));
          });
        } else return er(a, r, s, f, i, d);
      }, Ns = async (a) => {
        if (ut()) return yt(), new Promise((r, s) => {
          ht("end-profiling", [r, s]);
          let f = { type: "end-profiling", in: a };
          Ee.postMessage(f);
        });
        tr(a);
      };
    });
    Ws = k(() => {
      Ve();
      mn();
      st();
      qt();
      sn();
      ks = (a, r) => {
        switch (a.location) {
          case "cpu":
            return [a.type, a.dims, a.data, "cpu"];
          case "gpu-buffer":
            return [a.type, a.dims, { gpuBuffer: a.gpuBuffer }, "gpu-buffer"];
          case "ml-tensor":
            return [a.type, a.dims, { mlTensor: a.mlTensor }, "ml-tensor"];
          default:
            throw new Error(`invalid data location: ${a.location} for ${r()}`);
        }
      }, vc = (a) => {
        switch (a[3]) {
          case "cpu":
            return new Le(a[0], a[2], a[1]);
          case "gpu-buffer": {
            let r = a[0];
            if (!sr(r)) throw new Error(`not supported data type: ${r} for deserializing GPU tensor`);
            let { gpuBuffer: s, download: f, dispose: i } = a[2];
            return Le.fromGpuBuffer(s, { dataType: r, dims: a[1], download: f, dispose: i });
          }
          case "ml-tensor": {
            let r = a[0];
            if (!ir(r)) throw new Error(`not supported data type: ${r} for deserializing MLTensor tensor`);
            let { mlTensor: s, download: f, dispose: i } = a[2];
            return Le.fromMLTensor(s, { dataType: r, dims: a[1], download: f, dispose: i });
          }
          default:
            throw new Error(`invalid data location: ${a[3]}`);
        }
      }, mr = class {
        async fetchModelAndCopyToWasmMemory(r) {
          return Ds(await Mt(r));
        }
        async loadModel(r, s) {
          tt();
          let f;
          typeof r == "string" ? f = await this.fetchModelAndCopyToWasmMemory(r) : f = r, [this.sessionId, this.inputNames, this.outputNames, this.inputMetadata, this.outputMetadata] = await Ps(f, s), rt();
        }
        async dispose() {
          return _s(this.sessionId);
        }
        async run(r, s, f) {
          tt();
          let i = [], d = [];
          Object.entries(r).forEach((v) => {
            let S = v[0], U2 = v[1], R = this.inputNames.indexOf(S);
            if (R === -1) throw new Error(`invalid input '${S}'`);
            i.push(U2), d.push(R);
          });
          let l = [], m = [];
          Object.entries(s).forEach((v) => {
            let S = v[0], U2 = v[1], R = this.outputNames.indexOf(S);
            if (R === -1) throw new Error(`invalid output '${S}'`);
            l.push(U2), m.push(R);
          });
          let y = i.map((v, S) => ks(v, () => `input "${this.inputNames[d[S]]}"`)), w = l.map((v, S) => v ? ks(v, () => `output "${this.outputNames[m[S]]}"`) : null), T = await Rs(this.sessionId, d, y, m, w, f), g = {};
          for (let v = 0; v < T.length; v++) g[this.outputNames[m[v]]] = l[v] ?? vc(T[v]);
          return rt(), g;
        }
        startProfiling() {
        }
        endProfiling() {
          Ns(this.sessionId);
        }
      };
    });
    Gs = {};
    At(Gs, { OnnxruntimeWebAssemblyBackend: () => hr, initializeFlags: () => Fs, wasmBackend: () => Ec });
    $s = k(() => {
      Ve();
      mn();
      Ws();
      Fs = () => {
        (typeof Q.wasm.initTimeout != "number" || Q.wasm.initTimeout < 0) && (Q.wasm.initTimeout = 0);
        let a = Q.wasm.simd;
        if (typeof a != "boolean" && a !== void 0 && a !== "fixed" && a !== "relaxed" && (console.warn(`Property "env.wasm.simd" is set to unknown value "${a}". Reset it to \`false\` and ignore SIMD feature checking.`), Q.wasm.simd = false), typeof Q.wasm.proxy != "boolean" && (Q.wasm.proxy = false), typeof Q.wasm.trace != "boolean" && (Q.wasm.trace = false), typeof Q.wasm.numThreads != "number" || !Number.isInteger(Q.wasm.numThreads) || Q.wasm.numThreads <= 0) if (typeof self < "u" && !self.crossOriginIsolated) Q.wasm.numThreads = 1;
        else {
          let r = typeof navigator > "u" ? qr("node:os").cpus().length : navigator.hardwareConcurrency;
          Q.wasm.numThreads = Math.min(4, Math.ceil((r || 1) / 2));
        }
      }, hr = class {
        async init(r) {
          Fs(), await Us(), await Cs(r);
        }
        async createInferenceSessionHandler(r, s) {
          let f = new mr();
          return await f.loadModel(r, s), f;
        }
      }, Ec = new hr();
    });
    Ve();
    Ve();
    Ve();
    Xa = "1.27.0";
    vl = Qr;
    {
      let a = ($s(), zt(Gs)).wasmBackend;
      Qe("webgpu", a, 5), Qe("webnn", a, 5), Qe("cpu", a, 10), Qe("wasm", a, 10);
    }
    Object.defineProperty(Q.versions, "web", { value: Xa, enumerable: true });
  }
});

// ../../node_modules/.pnpm/onnxruntime-web@1.27.0/node_modules/onnxruntime-web/dist/ort.bundle.min.mjs
var ort_bundle_min_exports = {};
__export(ort_bundle_min_exports, {
  InferenceSession: () => _f,
  TRACE: () => Tr,
  TRACE_EVENT_BEGIN: () => _t,
  TRACE_EVENT_END: () => wt,
  TRACE_FUNC_BEGIN: () => Ve2,
  TRACE_FUNC_END: () => Re,
  Tensor: () => je2,
  default: () => oT,
  env: () => _e,
  registerBackend: () => kt
});
async function cs2(t = {}) {
  var e = t, r = !!globalThis.window, n = !!globalThis.WorkerGlobalScope, o = n && self.name?.startsWith("em-pthread");
  e.mountExternalData = (a, l) => {
    a.startsWith("./") && (a = a.substring(2)), (e.Xc || (e.Xc = /* @__PURE__ */ new Map())).set(a, l);
  }, e.unmountExternalData = () => {
    delete e.Xc;
  }, globalThis.SharedArrayBuffer ?? new WebAssembly.Memory({ initial: 0, maximum: 0, shared: true }).buffer.constructor;
  let i = (a) => async (...l) => {
    try {
      if (e.Yc) throw Error("Session already started");
      let h = e.Yc = { Kd: l[0], errors: [] }, f = await a(...l);
      if (e.Yc !== h) throw Error("Session mismatch");
      e.dd?.flush();
      let w = h.errors;
      if (0 < w.length) {
        let C = await Promise.all(w);
        if (C = C.filter((P) => P), 0 < C.length) throw Error(C.join(`
`));
      }
      return f;
    } finally {
      e.Yc = null;
    }
  };
  e.jsepInit = (a, l) => {
    if (a === "webgpu") {
      [e.dd, e.Ad, e.Ed, e.ed, e.Dd, e.$b, e.Fd, e.Hd, e.Bd, e.Cd, e.Gd] = l;
      let h = e.dd;
      e.jsepRegisterBuffer = (f, w, C, P) => h.registerBuffer(f, w, C, P), e.jsepGetBuffer = (f) => h.getBuffer(f), e.jsepCreateDownloader = (f, w, C) => h.createDownloader(f, w, C), e.jsepOnCreateSession = (f) => {
        h.onCreateSession(f);
      }, e.jsepOnReleaseSession = (f) => {
        h.onReleaseSession(f);
      }, e.jsepOnRunStart = (f) => h.onRunStart(f), e.Id = (f, w) => {
        h.upload(f, w);
      };
    } else if (a === "webnn") {
      let h = l[0];
      [e.Sd, e.sd, e.webnnEnsureTensor, e.td, e.webnnDownloadTensor, e.Rd, e.webnnEnableTraceEvent] = l.slice(1), e.webnnReleaseTensorId = e.sd, e.webnnUploadTensor = e.td, e.webnnRegisterMLContext = e.Rd, e.webnnOnRunStart = (f) => h.onRunStart(f), e.webnnOnRunEnd = h.onRunEnd.bind(h), e.webnnOnReleaseSession = (f) => {
        h.onReleaseSession(f);
      }, e.webnnCreateMLTensorDownloader = (f, w) => h.createMLTensorDownloader(f, w), e.webnnRegisterMLTensor = (f, w, C, P) => h.registerMLTensor(f, w, C, P), e.webnnCreateMLContext = (f) => h.createMLContext(f), e.webnnRegisterMLConstant = (f, w, C, P, D, H) => h.registerMLConstant(f, w, C, P, D, e.Xc, H), e.webnnRegisterGraphInput = h.registerGraphInput.bind(h), e.webnnIsGraphInput = h.isGraphInput.bind(h), e.webnnRegisterGraphOutput = h.registerGraphOutput.bind(h), e.webnnIsGraphOutput = h.isGraphOutput.bind(h), e.webnnCreateTemporaryTensor = h.createTemporaryTensor.bind(h), e.webnnIsGraphInputOutputTypeSupported = h.isGraphInputOutputTypeSupported.bind(h);
    }
  };
  let s = () => {
    let a = (l) => (...h) => {
      let f = et2;
      return h = l(...h), et2 != f ? new Promise((w, C) => {
        En = { resolve: w, reject: C };
      }) : h;
    };
    (() => {
      for (let l of ["_OrtAppendExecutionProvider", "_OrtCreateSession", "_OrtRun", "_OrtRunWithBinding", "_OrtBindInput"]) e[l] = a(e[l]);
    })(), i !== void 0 && (e._OrtRun = i(e._OrtRun), e._OrtRunWithBinding = i(e._OrtRunWithBinding)), s = void 0;
  };
  e.asyncInit = () => {
    s?.();
  };
  var u, d, c = (a, l) => {
    throw l;
  }, p = import.meta.url, m = "";
  if (r || n) {
    try {
      m = new URL(".", p).href;
    } catch {
    }
    n && (d = (a) => {
      var l = new XMLHttpRequest();
      return l.open("GET", a, false), l.responseType = "arraybuffer", l.send(null), new Uint8Array(l.response);
    }), u = async (a) => {
      if (z2(a)) return new Promise((h, f) => {
        var w = new XMLHttpRequest();
        w.open("GET", a, true), w.responseType = "arraybuffer", w.onload = () => {
          w.status == 200 || w.status == 0 && w.response ? h(w.response) : f(w.status);
        }, w.onerror = f, w.send(null);
      });
      var l = await fetch(a, { credentials: "same-origin" });
      if (l.ok) return l.arrayBuffer();
      throw Error(l.status + " : " + l.url);
    };
  }
  var g, y, b, _, T, x, $2 = console.log.bind(console), S = console.error.bind(console), I = $2, E = S, A = false, z2 = (a) => a.startsWith("file://");
  function v() {
    ht2.buffer != N.buffer && Me();
  }
  if (o) {
    let a = function(l) {
      try {
        var h = l.data, f = h.Sc;
        if (f === "load") {
          let w = [];
          self.onmessage = (C) => w.push(C), x = () => {
            postMessage({ Sc: "loaded" });
            for (let C of w) a(C);
            self.onmessage = a;
          };
          for (let C of h.xd) e[C] && !e[C].proxy || (e[C] = (...P) => {
            postMessage({ Sc: "callHandler", wd: C, args: P });
          }, C == "print" && (I = e[C]), C == "printErr" && (E = e[C]));
          ht2 = h.Od, Me(), y = h.Pd, be2(), $r();
        } else if (f === "run") {
          ((function(w) {
            var C = (v(), L)[w + 52 >>> 2 >>> 0];
            w = (v(), L)[w + 56 >>> 2 >>> 0], Wi(C, C - w), ue(C);
          }))(h.Rc), Bn(h.Rc, 0, 0, 1, 0, 0), Go(), In(h.Rc), R || (Mi(), R = true);
          try {
            np(h.Md, h.bd);
          } catch (w) {
            if (w != "unwind") throw w;
          }
        } else h.target !== "setimmediate" && (f === "checkMailbox" ? R && hr2() : f && (E(`worker: received unknown command ${f}`), E(h)));
      } catch (w) {
        throw Ri(), w;
      }
    };
    var R = false;
    self.onunhandledrejection = (l) => {
      throw l.reason || l;
    }, self.onmessage = a;
  }
  var N, F, q, X, B, L, Q2, Y, Z, te, ae, le2 = false;
  function Me() {
    var a = ht2.buffer;
    e.HEAP8 = N = new Int8Array(a), q = new Int16Array(a), e.HEAPU8 = F = new Uint8Array(a), X = new Uint16Array(a), e.HEAP32 = B = new Int32Array(a), e.HEAPU32 = L = new Uint32Array(a), Q2 = new Float32Array(a), Y = new Float64Array(a), Z = new BigInt64Array(a), te = new BigUint64Array(a);
  }
  function ve() {
    le2 = true, o ? x() : ct.sb();
  }
  function M(a) {
    throw E(a = "Aborted(" + a + ")"), A = true, a = new WebAssembly.RuntimeError(a + ". Build with -sASSERTIONS for more info."), T?.(a), a;
  }
  function G() {
    return { a: { ma: Am, gb: Cm, g: op, J: ip, f: ap, o: sp, h: up, ha: dp, b: lp, T: cp, Ha: Zo, n: pp, $: Jo, Xa: ei, Da: ti, Fa: ri, Ya: ni, Va: oi, Oa: ii, Ua: ai, ka: si, Ea: ui, Ba: di, Wa: li, Ca: ci, bb: mp, ea: hp, wa: gp, ua: yp, da: wp, O: vp, H: $p, va: xp, _: kp, xa: Pp, Ra: Op, za: Bp, Ia: Dp, sa: Mp, fa: Rp, Qa: In, _a: Up, R: Wp, r: Kp, c: Sn, hb: jp, y: Zp, M: Qp, D: Yp, l: Xp, s: _i, ib: Jp, I: em, S: tm, j: rm, u: nm, q: om, k: im, La: am, Ma: sm, Na: um, Ja: xi, Ka: Si, ta: Ti, db: lm, ab: mm, v: fm, aa: hm, ga: gm, $a: cm, W: bm, Za: ym, Aa: _m, F: dm, U: wm, la: wr, ya: $m, fb: vm, eb: xm, Sa: Ei, Ta: ki, Ga: _n, V: Pi, ja: Oi, Pa: zi, ia: Bi, kb: cf, na: af, lb: lf, oa: of, G: Zm, e: Om, t: km, w: Em, B: Wm, mb: tf, K: qm, x: Dm, pa: rf, Y: sf, ba: ef, nb: Jm, ob: Xm, P: Gm, qa: Ym, pb: Qm, N: Km, Z: nf, d: Pm, A: Bm, m: zm, jb: pf, p: Rm, z: Um, C: Mm, E: Nm, L: Hm, qb: jm, Q: uf, ca: Fm, X: df, rb: Lm, ra: Vm, i: Tm, a: ht2, cb: lr2 } };
  }
  async function be2() {
    function a(f, w) {
      var C = ct = f.exports;
      f = {};
      for (let [P, D] of Object.entries(C)) typeof D == "function" ? (C = Np(D), f[P] = C) : f[P] = D;
      return ct = f, ct = (function() {
        var P = ct, D = (K) => (se) => K(se) >>> 0, H = (K) => () => K() >>> 0;
        return (P = Object.assign({}, P)).tb = D(P.tb), P.Xb = H(P.Xb), P.Zb = D(P.Zb), P.lc = D(P.lc), P.mc = H(P.mc), P.qc = D(P.qc), P;
      })(), Lo.push(ct._b), Di = (f = ct).tb, Mi = f.ub, e._OrtInit = f.vb, e._OrtGetLastError = f.wb, e._OrtCreateSessionOptions = f.xb, e._OrtAppendExecutionProvider = f.yb, e._OrtAddFreeDimensionOverride = f.zb, e._OrtAddSessionConfigEntry = f.Ab, e._OrtReleaseSessionOptions = f.Bb, e._OrtCreateSession = f.Cb, e._OrtReleaseSession = f.Db, e._OrtGetInputOutputCount = f.Eb, e._OrtGetInputOutputMetadata = f.Fb, e._OrtFree = f.Gb, e._OrtCreateTensor = f.Hb, e._OrtGetTensorData = f.Ib, e._OrtReleaseTensor = f.Jb, e._OrtCreateRunOptions = f.Kb, e._OrtAddRunConfigEntry = f.Lb, e._OrtReleaseRunOptions = f.Mb, e._OrtCreateBinding = f.Nb, e._OrtBindInput = f.Ob, e._OrtBindOutput = f.Pb, e._OrtClearBoundOutputs = f.Qb, e._OrtReleaseBinding = f.Rb, e._OrtRunWithBinding = f.Sb, e._OrtRun = f.Tb, e._OrtEndProfiling = f.Ub, e._JsepOutput = f.Vb, e._JsepGetNodeName = f.Wb, vr = f.Xb, tt2 = e._free = f.Yb, Qt2 = e._malloc = f.Zb, Bn = f.ac, Ri = f.bc, Ui = f.cc, Ni = f.dc, Dn = f.ec, Vi = f.fc, Li = f.gc, ce = f.hc, Yt2 = f.ic, Wi = f.jc, ue = f.kc, Mn = f.lc, de = f.mc, Gi = f.nc, Rn = f.oc, Hi = f.pc, Fi = f.qc, qi = f.rc, Un = f.sc, Ki = f.tc, ji = f.uc, Zi = f.vc, Qi = f.wc, Yi = f.xc, Xi = f.yc, Ji = f.zc, ea = f.Ac, ta = f.Bc, ra = f.Cc, na = f.Dc, oa = f.Ec, ia = f.Fc, aa = f.Gc, sa = f.Hc, ua = f.Ic, da = f.Jc, la = f.Kc, ca = f.Lc, pa = f.Mc, ma = f.Nc, fa = f.Pc, ha = f.Qc, ga = f.$c, ba = f.ad, ya = f.fd, _a2 = f.jd, wa = f.kd, va2 = f.ld, $a2 = f.md, xa2 = f.nd, Sa2 = f.od, Ta = f.pd, Ia2 = f.qd, Ca2 = f.vd, Aa2 = f.Td, Ea2 = f.Ud, ka2 = f.Vd, Pa2 = f.Wd, y = w, ct;
    }
    var l, h = G();
    return e.instantiateWasm ? new Promise((f) => {
      e.instantiateWasm(h, (w, C) => {
        f(a(w, C));
      });
    }) : o ? a(new WebAssembly.Instance(y, G()), y) : (ae ??= e.locateFile ? e.locateFile ? e.locateFile("ort-wasm-simd-threaded.jsep.wasm", m) : m + "ort-wasm-simd-threaded.jsep.wasm" : new URL("ort-wasm-simd-threaded.jsep.wasm", import.meta.url).href, l = await (async function(f) {
      var w = ae;
      if (!g && !z2(w)) try {
        var C = fetch(w, { credentials: "same-origin" });
        return await WebAssembly.instantiateStreaming(C, f);
      } catch (P) {
        E(`wasm streaming compile failed: ${P}`), E("falling back to ArrayBuffer instantiation");
      }
      return (async function(P, D) {
        try {
          var H = await (async function(K) {
            if (!g) try {
              var se = await u(K);
              return new Uint8Array(se);
            } catch {
            }
            if (K == ae && g) K = new Uint8Array(g);
            else {
              if (!d) throw "both async and sync fetching of the wasm failed";
              K = d(K);
            }
            return K;
          })(P);
          return await WebAssembly.instantiate(H, D);
        } catch (K) {
          E(`failed to asynchronously prepare wasm: ${K}`), M(K);
        }
      })(w, f);
    })(h), a(l.instance, l.module));
  }
  class Ee2 {
    name = "ExitStatus";
    constructor(l) {
      this.message = `Program terminated with exit(${l})`, this.status = l;
    }
  }
  var $e2 = (a) => {
    a.terminate(), a.onmessage = () => {
    };
  }, Pe = [], he = 0, Te = null, qe = (a) => {
    ft.length == 0 && (Fo(), Ho(ft[0]));
    var l = ft.pop();
    if (!l) return 6;
    jt2.push(l), It2[a.Rc] = l, l.Rc = a.Rc;
    var h = { Sc: "run", Md: a.Ld, bd: a.bd, Rc: a.Rc };
    return l.postMessage(h, a.rd), 0;
  }, Ne = 0, Se = (a, l, ...h) => {
    var f, w = 16 * h.length, C = de(), P = Mn(w), D = P >>> 3;
    for (f of h) typeof f == "bigint" ? ((v(), Z)[D++ >>> 0] = 1n, (v(), Z)[D++ >>> 0] = f) : ((v(), Z)[D++ >>> 0] = 0n, (v(), Y)[D++ >>> 0] = f);
    return a = Ui(a, 0, w, P, l), ue(C), a;
  };
  function lr2(a) {
    if (o) return Se(0, 1, a);
    if (b = a, !(0 < Ne)) {
      for (var l of jt2) $e2(l);
      for (l of ft) $e2(l);
      ft = [], jt2 = [], It2 = {}, A = true;
    }
    c(0, new Ee2(a));
  }
  function Vo(a) {
    if (o) return Se(1, 0, a);
    _n(a);
  }
  var _n = (a) => {
    if (b = a, o) throw Vo(a), "unwind";
    lr2(a);
  }, ft = [], jt2 = [], Lo = [], It2 = {}, Wo = (a) => {
    var l = a.Rc;
    delete It2[l], ft.push(a), jt2.splice(jt2.indexOf(a), 1), a.Rc = 0, Ni(l);
  };
  function Go() {
    Lo.forEach((a) => a());
  }
  var Ho = (a) => new Promise((l) => {
    a.onmessage = (w) => {
      var C = w.data;
      if (w = C.Sc, C.Zc && C.Zc != vr()) {
        var P = It2[C.Zc];
        P ? P.postMessage(C, C.rd) : E(`Internal error! Worker sent a message "${w}" to target pthread ${C.Zc}, but that thread no longer exists!`);
      } else w === "checkMailbox" ? hr2() : w === "spawnThread" ? qe(C) : w === "cleanupThread" ? fr2(() => {
        Wo(It2[C.Nd]);
      }) : w === "loaded" ? (a.loaded = true, l(a)) : C.target === "setimmediate" ? a.postMessage(C) : w === "uncaughtException" ? a.onerror(C.error) : w === "callHandler" ? e[C.wd](...C.args) : w && E(`worker sent an unknown command ${w}`);
    }, a.onerror = (w) => {
      throw E(`worker sent an error! ${w.filename}:${w.lineno}: ${w.message}`), w;
    };
    var h, f = [];
    for (h of []) e.propertyIsEnumerable(h) && f.push(h);
    a.postMessage({ Sc: "load", xd: f, Od: ht2, Pd: y });
  });
  function Fo() {
    var a = new Worker((() => {
      let l = URL;
      return import.meta.url > "file:" && import.meta.url < "file;" ? new l("ort.bundle.min.mjs", import.meta.url) : new URL(import.meta.url);
    })(), { type: "module", workerData: "em-pthread", name: "em-pthread" });
    ft.push(a);
  }
  var ht2, np = (a, l) => {
    Ne = 0, a = Un(a, l), 0 < Ne ? b = a : Dn(a);
  }, cr2 = [], pr2 = 0;
  function op(a) {
    var l = new wn(a >>>= 0);
    return (v(), N)[l.Tc + 12 >>> 0] == 0 && (qo(l, true), pr2--), Ko(l, false), cr2.push(l), Fi(a);
  }
  var Ut2 = 0, ip = () => {
    ce(0, 0);
    var a = cr2.pop();
    Gi(a.cd), Ut2 = 0;
  };
  function qo(a, l) {
    l = l ? 1 : 0, (v(), N)[a.Tc + 12 >>> 0] = l;
  }
  function Ko(a, l) {
    l = l ? 1 : 0, (v(), N)[a.Tc + 13 >>> 0] = l;
  }
  class wn {
    constructor(l) {
      this.cd = l, this.Tc = l - 24;
    }
  }
  var vn = (a) => {
    var l = Ut2;
    if (!l) return Yt2(0), 0;
    var h = new wn(l);
    (v(), L)[h.Tc + 16 >>> 2 >>> 0] = l;
    var f = (v(), L)[h.Tc + 4 >>> 2 >>> 0];
    if (!f) return Yt2(0), l;
    for (var w of a) {
      if (w === 0 || w === f) break;
      if (Hi(w, f, h.Tc + 16)) return Yt2(w), l;
    }
    return Yt2(f), l;
  };
  function ap() {
    return vn([]);
  }
  function sp(a) {
    return vn([a >>> 0]);
  }
  function up(a, l, h, f) {
    return vn([a >>> 0, l >>> 0, h >>> 0, f >>> 0]);
  }
  var dp = () => {
    var a = cr2.pop();
    a || M("no exception to throw");
    var l = a.cd;
    throw (v(), N)[a.Tc + 13 >>> 0] == 0 && (cr2.push(a), Ko(a, true), qo(a, false), pr2++), Rn(l), Ut2 = l;
  };
  function lp(a, l, h) {
    var f = new wn(a >>>= 0);
    throw l >>>= 0, h >>>= 0, (v(), L)[f.Tc + 16 >>> 2 >>> 0] = 0, (v(), L)[f.Tc + 4 >>> 2 >>> 0] = l, (v(), L)[f.Tc + 8 >>> 2 >>> 0] = h, Rn(a), pr2++, Ut2 = a;
  }
  var cp = () => pr2;
  function jo(a, l, h, f) {
    return o ? Se(2, 1, a, l, h, f) : Zo(a, l, h, f);
  }
  function Zo(a, l, h, f) {
    if (a >>>= 0, l >>>= 0, h >>>= 0, f >>>= 0, !globalThis.SharedArrayBuffer) return 6;
    var w = [];
    return o && w.length === 0 ? jo(a, l, h, f) : (a = { Ld: h, Rc: a, bd: f, rd: w }, o ? (a.Sc = "spawnThread", postMessage(a, w), 0) : qe(a));
  }
  function pp(a) {
    throw Ut2 ||= a >>> 0, Ut2;
  }
  var Qo = globalThis.TextDecoder && new TextDecoder(), Yo = (a, l, h, f) => {
    if (h = l + h, f) return h;
    for (; a[l] && !(l >= h); ) ++l;
    return l;
  }, Xo = (a, l = 0, h, f) => {
    if (16 < (h = Yo(a, l >>>= 0, h, f)) - l && a.buffer && Qo) return Qo.decode(a.buffer instanceof ArrayBuffer ? a.subarray(l, h) : a.slice(l, h));
    for (f = ""; l < h; ) {
      var w = a[l++];
      if (128 & w) {
        var C = 63 & a[l++];
        if ((224 & w) == 192) f += String.fromCharCode((31 & w) << 6 | C);
        else {
          var P = 63 & a[l++];
          65536 > (w = (240 & w) == 224 ? (15 & w) << 12 | C << 6 | P : (7 & w) << 18 | C << 12 | P << 6 | 63 & a[l++]) ? f += String.fromCharCode(w) : (w -= 65536, f += String.fromCharCode(55296 | w >> 10, 56320 | 1023 & w));
        }
      } else f += String.fromCharCode(w);
    }
    return f;
  }, Ae = (a, l, h) => (a >>>= 0) ? Xo((v(), F), a, l, h) : "";
  function Jo(a, l, h) {
    return o ? Se(3, 1, a, l, h) : 0;
  }
  function ei(a, l) {
    if (o) return Se(4, 1, a, l);
  }
  function ti(a, l) {
    if (o) return Se(5, 1, a, l);
  }
  function ri(a, l, h) {
    if (o) return Se(6, 1, a, l, h);
  }
  function ni(a, l, h) {
    return o ? Se(7, 1, a, l, h) : 0;
  }
  function oi(a, l) {
    if (o) return Se(8, 1, a, l);
  }
  function ii(a, l, h) {
    if (o) return Se(9, 1, a, l, h);
  }
  function ai(a, l, h, f) {
    if (o) return Se(10, 1, a, l, h, f);
  }
  function si(a, l, h, f) {
    if (o) return Se(11, 1, a, l, h, f);
  }
  function ui(a, l, h, f) {
    if (o) return Se(12, 1, a, l, h, f);
  }
  function di(a) {
    if (o) return Se(13, 1, a);
  }
  function li(a, l) {
    if (o) return Se(14, 1, a, l);
  }
  function ci(a, l, h) {
    if (o) return Se(15, 1, a, l, h);
  }
  var mp = () => M(""), Je = (a) => {
    a >>>= 0;
    for (var l = ""; ; ) {
      var h = (v(), F)[a++ >>> 0];
      if (!h) return l;
      l += String.fromCharCode(h);
    }
  }, $n = {}, xn = {}, Nt = class extends Error {
    constructor(a) {
      super(a), this.name = "BindingError";
    }
  };
  function lt(a, l, h = {}) {
    return (function(f, w, C = {}) {
      var P = w.name;
      if (!f) throw new Nt(`type "${P}" must have a positive integer typeid pointer`);
      if (xn.hasOwnProperty(f)) {
        if (C.yd) return;
        throw new Nt(`Cannot register type '${P}' twice`);
      }
      xn[f] = w, $n.hasOwnProperty(f) && (w = $n[f], delete $n[f], w.forEach((D) => D()));
    })(a, l, h);
  }
  var pi = (a, l, h) => {
    switch (l) {
      case 1:
        return h ? (f) => (v(), N)[f >>> 0] : (f) => (v(), F)[f >>> 0];
      case 2:
        return h ? (f) => (v(), q)[f >>> 1 >>> 0] : (f) => (v(), X)[f >>> 1 >>> 0];
      case 4:
        return h ? (f) => (v(), B)[f >>> 2 >>> 0] : (f) => (v(), L)[f >>> 2 >>> 0];
      case 8:
        return h ? (f) => (v(), Z)[f >>> 3 >>> 0] : (f) => (v(), te)[f >>> 3 >>> 0];
      default:
        throw new TypeError(`invalid integer width (${l}): ${a}`);
    }
  };
  function hp(a, l, h, f, w) {
    a >>>= 0, h >>>= 0, l = Je(l >>> 0);
    let C = (P) => P;
    if (f = f === 0n) {
      let P = 8 * h;
      C = (D) => BigInt.asUintN(P, D), w = C(w);
    }
    lt(a, { name: l, Oc: C, Vc: (P, D) => (typeof D == "number" && (D = BigInt(D)), D), Uc: pi(l, h, !f), Wc: null });
  }
  function gp(a, l, h, f) {
    lt(a >>>= 0, { name: l = Je(l >>> 0), Oc: function(w) {
      return !!w;
    }, Vc: function(w, C) {
      return C ? h : f;
    }, Uc: function(w) {
      return this.Oc((v(), F)[w >>> 0]);
    }, Wc: null });
  }
  var mi = [], Ct = [0, 1, , 1, null, 1, true, 1, false, 1];
  function Sn(a) {
    9 < (a >>>= 0) && --Ct[a + 1] === 0 && (Ct[a] = void 0, mi.push(a));
  }
  var He2 = (a) => {
    if (!a) throw new Nt(`Cannot use deleted val. handle = ${a}`);
    return Ct[a];
  }, Ke2 = (a) => {
    switch (a) {
      case void 0:
        return 2;
      case null:
        return 4;
      case true:
        return 6;
      case false:
        return 8;
      default:
        let l = mi.pop() || Ct.length;
        return Ct[l] = a, Ct[l + 1] = 1, l;
    }
  };
  function Tn(a) {
    return this.Oc((v(), L)[a >>> 2 >>> 0]);
  }
  var bp = { name: "emscripten::val", Oc: (a) => {
    var l = He2(a);
    return Sn(a), l;
  }, Vc: (a, l) => Ke2(l), Uc: Tn, Wc: null };
  function yp(a) {
    return lt(a >>> 0, bp);
  }
  var _p = (a, l) => {
    switch (l) {
      case 4:
        return function(h) {
          return this.Oc((v(), Q2)[h >>> 2 >>> 0]);
        };
      case 8:
        return function(h) {
          return this.Oc((v(), Y)[h >>> 3 >>> 0]);
        };
      default:
        throw new TypeError(`invalid float width (${l}): ${a}`);
    }
  };
  function wp(a, l, h) {
    h >>>= 0, lt(a >>>= 0, { name: l = Je(l >>> 0), Oc: (f) => f, Vc: (f, w) => w, Uc: _p(l, h), Wc: null });
  }
  function vp(a, l, h, f, w) {
    a >>>= 0, h >>>= 0, l = Je(l >>> 0);
    let C = (D) => D;
    if (f === 0) {
      var P = 32 - 8 * h;
      C = (D) => D << P >>> P, w = C(w);
    }
    lt(a, { name: l, Oc: C, Vc: (D, H) => H, Uc: pi(l, h, f !== 0), Wc: null });
  }
  function $p(a, l, h) {
    function f(C) {
      var P = (v(), L)[C >>> 2 >>> 0];
      return C = (v(), L)[C + 4 >>> 2 >>> 0], new w((v(), N).buffer, C, P);
    }
    var w = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array, BigInt64Array, BigUint64Array][l];
    lt(a >>>= 0, { name: h = Je(h >>> 0), Oc: f, Uc: f }, { yd: true });
  }
  var gt = (a, l, h) => {
    var f = (v(), F);
    if (l >>>= 0, 0 < h) {
      var w = l;
      h = l + h - 1;
      for (var C = 0; C < a.length; ++C) {
        var P = a.codePointAt(C);
        if (127 >= P) {
          if (l >= h) break;
          f[l++ >>> 0] = P;
        } else if (2047 >= P) {
          if (l + 1 >= h) break;
          f[l++ >>> 0] = 192 | P >> 6, f[l++ >>> 0] = 128 | 63 & P;
        } else if (65535 >= P) {
          if (l + 2 >= h) break;
          f[l++ >>> 0] = 224 | P >> 12, f[l++ >>> 0] = 128 | P >> 6 & 63, f[l++ >>> 0] = 128 | 63 & P;
        } else {
          if (l + 3 >= h) break;
          f[l++ >>> 0] = 240 | P >> 18, f[l++ >>> 0] = 128 | P >> 12 & 63, f[l++ >>> 0] = 128 | P >> 6 & 63, f[l++ >>> 0] = 128 | 63 & P, C++;
        }
      }
      f[l >>> 0] = 0, a = l - w;
    } else a = 0;
    return a;
  }, mr2 = (a) => {
    for (var l = 0, h = 0; h < a.length; ++h) {
      var f = a.charCodeAt(h);
      127 >= f ? l++ : 2047 >= f ? l += 2 : 55296 <= f && 57343 >= f ? (l += 4, ++h) : l += 3;
    }
    return l;
  };
  function xp(a, l) {
    lt(a >>>= 0, { name: l = Je(l >>> 0), Oc(h) {
      var f = (v(), L)[h >>> 2 >>> 0];
      return f = Ae(h + 4, f, true), tt2(h), f;
    }, Vc(h, f) {
      f instanceof ArrayBuffer && (f = new Uint8Array(f));
      var w = typeof f == "string";
      if (!(w || ArrayBuffer.isView(f) && f.BYTES_PER_ELEMENT == 1)) throw new Nt("Cannot pass non-string to std::string");
      var C = w ? mr2(f) : f.length, P = Qt2(4 + C + 1), D = P + 4;
      return (v(), L)[P >>> 2 >>> 0] = C, w ? gt(f, D, C + 1) : (v(), F).set(f, D >>> 0), h !== null && h.push(tt2, P), P;
    }, Uc: Tn, Wc(h) {
      tt2(h);
    } });
  }
  var fi = globalThis.TextDecoder ? new TextDecoder("utf-16le") : void 0, Sp = (a, l, h) => {
    if (a >>>= 1, 16 < (l = Yo((v(), X), a, l / 2, h)) - a && fi) return fi.decode((v(), X).slice(a, l));
    for (h = ""; a < l; ++a) {
      var f = (v(), X)[a >>> 0];
      h += String.fromCharCode(f);
    }
    return h;
  }, Tp = (a, l, h) => {
    if (h ??= 2147483647, 2 > h) return 0;
    var f = l;
    h = (h -= 2) < 2 * a.length ? h / 2 : a.length;
    for (var w = 0; w < h; ++w) {
      var C = a.charCodeAt(w);
      (v(), q)[l >>> 1 >>> 0] = C, l += 2;
    }
    return (v(), q)[l >>> 1 >>> 0] = 0, l - f;
  }, Ip = (a) => 2 * a.length, Cp = (a, l, h) => {
    var f = "";
    a >>>= 2;
    for (var w = 0; !(w >= l / 4); w++) {
      var C = (v(), L)[a + w >>> 0];
      if (!C && !h) break;
      f += String.fromCodePoint(C);
    }
    return f;
  }, Ap = (a, l, h) => {
    if (l >>>= 0, h ??= 2147483647, 4 > h) return 0;
    var f = l;
    h = f + h - 4;
    for (var w = 0; w < a.length; ++w) {
      var C = a.codePointAt(w);
      if (65535 < C && w++, (v(), B)[l >>> 2 >>> 0] = C, (l += 4) + 4 > h) break;
    }
    return (v(), B)[l >>> 2 >>> 0] = 0, l - f;
  }, Ep = (a) => {
    for (var l = 0, h = 0; h < a.length; ++h) 65535 < a.codePointAt(h) && h++, l += 4;
    return l;
  };
  function kp(a, l, h) {
    if (a >>>= 0, l >>>= 0, h = Je(h >>>= 0), l === 2) var f = Sp, w = Tp, C = Ip;
    else f = Cp, w = Ap, C = Ep;
    lt(a, { name: h, Oc: (P) => {
      var D = (v(), L)[P >>> 2 >>> 0];
      return D = f(P + 4, D * l, true), tt2(P), D;
    }, Vc: (P, D) => {
      if (typeof D != "string") throw new Nt(`Cannot pass non-string to C++ string type ${h}`);
      var H = C(D), K = Qt2(4 + H + l);
      return (v(), L)[K >>> 2 >>> 0] = H / l, w(D, K + 4, H + l), P !== null && P.push(tt2, K), K;
    }, Uc: Tn, Wc(P) {
      tt2(P);
    } });
  }
  function Pp(a, l) {
    lt(a >>>= 0, { zd: true, name: l = Je(l >>> 0), Oc: () => {
    }, Vc: () => {
    } });
  }
  function Op(a) {
    Bn(a >>> 0, !n, 1, !r, 131072, false), Go();
  }
  var fr2 = (a) => {
    if (!A) try {
      if (a(), !(0 < Ne)) try {
        o ? vr() && Dn(b) : _n(b);
      } catch (l) {
        l instanceof Ee2 || l == "unwind" || c(0, l);
      }
    } catch (l) {
      l instanceof Ee2 || l == "unwind" || c(0, l);
    }
  }, zp = !Atomics.waitAsync || globalThis.navigator?.userAgent && 91 > Number((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./) || [])[2]);
  function In(a) {
    a >>>= 0, zp || (Atomics.waitAsync((v(), B), a >>> 2, a).value.then(hr2), a += 128, Atomics.store((v(), B), a >>> 2, 1));
  }
  var hr2 = () => fr2(() => {
    var a = vr();
    a && (In(a), Li());
  });
  function Bp(a, l) {
    (a >>>= 0) == l >>> 0 ? setTimeout(hr2) : o ? postMessage({ Zc: a, Sc: "checkMailbox" }) : (a = It2[a]) && a.postMessage({ Sc: "checkMailbox" });
  }
  var Cn = [];
  function Dp(a, l, h, f, w) {
    for (l >>>= 0, w >>>= 0, Cn.length = 0, h = w >>> 3, f = w + f >>> 3; h < f; ) {
      var C;
      C = (v(), Z)[h++ >>> 0] ? (v(), Z)[h++ >>> 0] : (v(), Y)[h++ >>> 0], Cn.push(C);
    }
    return (l ? Nn[l] : Im[a])(...Cn);
  }
  var Mp = () => {
    Ne = 0;
  };
  function Rp(a) {
    a >>>= 0, o ? postMessage({ Sc: "cleanupThread", Nd: a }) : Wo(It2[a]);
  }
  function Up(a) {
  }
  var gr = (a) => {
    try {
      a();
    } catch (l) {
      M(l);
    }
  };
  function Np(a) {
    var l = (...h) => {
      br.push(a);
      try {
        return a(...h);
      } finally {
        A || (br.pop(), et2 && bt === 1 && br.length === 0 && (bt = 0, Ne += 1, gr(Ea2), typeof Fibers < "u" && Fibers.Zd()));
      }
    };
    return bi.set(a, l), l;
  }
  var bt = 0, et2 = null, hi = 0, br = [], An = /* @__PURE__ */ new Map(), gi = /* @__PURE__ */ new Map(), bi = /* @__PURE__ */ new Map(), Vp = 0, En = null, Lp = [], yi = (a) => (function(l) {
    if (!A) {
      if (bt === 0) {
        var h = false, f = false;
        l((w = 0) => {
          if (!A && (hi = w, h = true, f)) {
            bt = 2, gr(() => ka2(et2)), typeof MainLoop < "u" && MainLoop.ud && MainLoop.resume(), w = false;
            try {
              var C = (function() {
                var H = (v(), B)[et2 + 8 >>> 2 >>> 0];
                return H = gi.get(H), H = bi.get(H), --Ne, H();
              })();
            } catch (H) {
              C = H, w = true;
            }
            var P = false;
            if (!et2) {
              var D = En;
              D && (En = null, (w ? D.reject : D.resolve)(C), P = true);
            }
            if (w && !P) throw C;
          }
        }), f = true, h || (bt = 1, et2 = (function() {
          var w = Qt2(65548), C = w + 12;
          if ((v(), L)[w >>> 2 >>> 0] = C, (v(), L)[w + 4 >>> 2 >>> 0] = C + 65536, C = br[0], !An.has(C)) {
            var P = Vp++;
            An.set(C, P), gi.set(P, C);
          }
          return C = An.get(C), (v(), B)[w + 8 >>> 2 >>> 0] = C, w;
        })(), typeof MainLoop < "u" && MainLoop.ud && MainLoop.pause(), gr(() => Aa2(et2)));
      } else bt === 2 ? (bt = 0, gr(Pa2), tt2(et2), et2 = null, Lp.forEach(fr2)) : M(`invalid state: ${bt}`);
      return hi;
    }
  })((l) => {
    a().then(l);
  });
  function Wp(a) {
    return a >>>= 0, yi(async () => {
      var l = await He2(a);
      return Ke2(l);
    });
  }
  var kn = [], Gp = (a) => {
    var l = kn.length;
    return kn.push(a), l;
  }, Hp = (a, l) => {
    for (var h = Array(a), f = 0; f < a; ++f) {
      var w = f, C = (v(), L)[l + 4 * f >>> 2 >>> 0], P = xn[C];
      if (P === void 0) throw a = `parameter ${f}`, C = Di(C), l = Je(C), tt2(C), new Nt(`${a} has unknown type ${l}`);
      h[w] = P;
    }
    return h;
  }, Fp = (a, l, h) => {
    var f = [];
    return a = a(f, h), f.length && ((v(), L)[l >>> 2 >>> 0] = Ke2(f)), a;
  }, qp = {}, yr = (a) => {
    var l = qp[a];
    return l === void 0 ? Je(a) : l;
  };
  function Kp(a, l, h) {
    var [f, ...w] = Hp(a, l >>> 0);
    l = f.Vc.bind(f);
    var C = w.map((H) => H.Uc.bind(H));
    a--;
    var P = { toValue: He2 };
    switch (a = C.map((H, K) => {
      var se = `argFromPtr${K}`;
      return P[se] = H, `${se}(args${K ? "+" + 8 * K : ""})`;
    }), h) {
      case 0:
        var D = "toValue(handle)";
        break;
      case 2:
        D = "new (toValue(handle))";
        break;
      case 3:
        D = "";
        break;
      case 1:
        P.getStringOrSymbol = yr, D = "toValue(handle)[getStringOrSymbol(methodName)]";
    }
    return D += `(${a})`, f.zd || (P.toReturnWire = l, P.emval_returnValue = Fp, D = `return emval_returnValue(toReturnWire, destructorsRef, ${D})`), D = `return function (handle, methodName, destructorsRef, args) {
  ${D}
  }`, h = new Function(Object.keys(P), D)(...Object.values(P)), D = `methodCaller<(${w.map((H) => H.name)}) => ${f.name}>`, Gp(Object.defineProperty(h, "name", { value: D }));
  }
  function jp(a, l) {
    return l >>>= 0, (a = He2(a >>> 0)) == He2(l);
  }
  function Zp(a) {
    return (a >>>= 0) ? (a = yr(a), Ke2(globalThis[a])) : Ke2(globalThis);
  }
  function Qp(a) {
    return a = yr(a >>> 0), Ke2(e[a]);
  }
  function Yp(a, l) {
    return l >>>= 0, a = He2(a >>> 0), l = He2(l), Ke2(a[l]);
  }
  function Xp(a) {
    9 < (a >>>= 0) && (Ct[a + 1] += 1);
  }
  function _i(a, l, h, f, w) {
    return kn[a >>> 0](l >>> 0, h >>> 0, f >>> 0, w >>> 0);
  }
  function Jp(a, l, h, f, w) {
    return _i(a >>> 0, l >>> 0, h >>> 0, f >>> 0, w >>> 0);
  }
  function em() {
    return Ke2([]);
  }
  function tm(a) {
    a = He2(a >>> 0);
    for (var l = Array(a.length), h = 0; h < a.length; h++) l[h] = a[h];
    return Ke2(l);
  }
  function rm(a) {
    return Ke2(yr(a >>> 0));
  }
  function nm() {
    return Ke2({});
  }
  function om(a) {
    for (var l = He2(a >>>= 0); l.length; ) {
      var h = l.pop();
      l.pop()(h);
    }
    Sn(a);
  }
  function im(a, l, h) {
    l >>>= 0, h >>>= 0, a = He2(a >>> 0), l = He2(l), h = He2(h), a[l] = h;
  }
  function am(a, l) {
    a = -9007199254740992 > a || 9007199254740992 < a ? NaN : Number(a), l >>>= 0, a = new Date(1e3 * a), (v(), B)[l >>> 2 >>> 0] = a.getUTCSeconds(), (v(), B)[l + 4 >>> 2 >>> 0] = a.getUTCMinutes(), (v(), B)[l + 8 >>> 2 >>> 0] = a.getUTCHours(), (v(), B)[l + 12 >>> 2 >>> 0] = a.getUTCDate(), (v(), B)[l + 16 >>> 2 >>> 0] = a.getUTCMonth(), (v(), B)[l + 20 >>> 2 >>> 0] = a.getUTCFullYear() - 1900, (v(), B)[l + 24 >>> 2 >>> 0] = a.getUTCDay(), a = (a.getTime() - Date.UTC(a.getUTCFullYear(), 0, 1, 0, 0, 0, 0)) / 864e5 | 0, (v(), B)[l + 28 >>> 2 >>> 0] = a;
  }
  var wi = (a) => a % 4 == 0 && (a % 100 != 0 || a % 400 == 0), vi = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335], $i = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  function sm(a, l) {
    a = -9007199254740992 > a || 9007199254740992 < a ? NaN : Number(a), l >>>= 0, a = new Date(1e3 * a), (v(), B)[l >>> 2 >>> 0] = a.getSeconds(), (v(), B)[l + 4 >>> 2 >>> 0] = a.getMinutes(), (v(), B)[l + 8 >>> 2 >>> 0] = a.getHours(), (v(), B)[l + 12 >>> 2 >>> 0] = a.getDate(), (v(), B)[l + 16 >>> 2 >>> 0] = a.getMonth(), (v(), B)[l + 20 >>> 2 >>> 0] = a.getFullYear() - 1900, (v(), B)[l + 24 >>> 2 >>> 0] = a.getDay();
    var h = (wi(a.getFullYear()) ? vi : $i)[a.getMonth()] + a.getDate() - 1 | 0;
    (v(), B)[l + 28 >>> 2 >>> 0] = h, (v(), B)[l + 36 >>> 2 >>> 0] = -60 * a.getTimezoneOffset(), h = new Date(a.getFullYear(), 6, 1).getTimezoneOffset();
    var f = new Date(a.getFullYear(), 0, 1).getTimezoneOffset();
    a = 0 | (h != f && a.getTimezoneOffset() == Math.min(f, h)), (v(), B)[l + 32 >>> 2 >>> 0] = a;
  }
  function um(a) {
    a >>>= 0;
    var l = new Date((v(), B)[a + 20 >>> 2 >>> 0] + 1900, (v(), B)[a + 16 >>> 2 >>> 0], (v(), B)[a + 12 >>> 2 >>> 0], (v(), B)[a + 8 >>> 2 >>> 0], (v(), B)[a + 4 >>> 2 >>> 0], (v(), B)[a >>> 2 >>> 0], 0), h = (v(), B)[a + 32 >>> 2 >>> 0], f = l.getTimezoneOffset(), w = new Date(l.getFullYear(), 6, 1).getTimezoneOffset(), C = new Date(l.getFullYear(), 0, 1).getTimezoneOffset(), P = Math.min(C, w);
    return 0 > h ? (v(), B)[a + 32 >>> 2 >>> 0] = +(w != C && P == f) : 0 < h != (P == f) && (w = Math.max(C, w), l.setTime(l.getTime() + 6e4 * ((0 < h ? P : w) - f))), (v(), B)[a + 24 >>> 2 >>> 0] = l.getDay(), h = (wi(l.getFullYear()) ? vi : $i)[l.getMonth()] + l.getDate() - 1 | 0, (v(), B)[a + 28 >>> 2 >>> 0] = h, (v(), B)[a >>> 2 >>> 0] = l.getSeconds(), (v(), B)[a + 4 >>> 2 >>> 0] = l.getMinutes(), (v(), B)[a + 8 >>> 2 >>> 0] = l.getHours(), (v(), B)[a + 12 >>> 2 >>> 0] = l.getDate(), (v(), B)[a + 16 >>> 2 >>> 0] = l.getMonth(), (v(), B)[a + 20 >>> 2 >>> 0] = l.getYear(), a = l.getTime(), BigInt(isNaN(a) ? -1 : a / 1e3);
  }
  function xi(a, l, h, f, w, C, P) {
    return o ? Se(16, 1, a, l, h, f, w, C, P) : -52;
  }
  function Si(a, l, h, f, w, C) {
    if (o) return Se(17, 1, a, l, h, f, w, C);
  }
  var Zt2 = {}, dm = () => performance.timeOrigin + performance.now();
  function Ti(a, l) {
    if (o) return Se(18, 1, a, l);
    if (Zt2[a] && (clearTimeout(Zt2[a].id), delete Zt2[a]), !l) return 0;
    var h = setTimeout(() => {
      delete Zt2[a], fr2(() => Vi(a, performance.timeOrigin + performance.now()));
    }, l);
    return Zt2[a] = { id: h, Yd: l }, 0;
  }
  function lm(a, l, h, f) {
    a >>>= 0, l >>>= 0, h >>>= 0, f >>>= 0;
    var w = (/* @__PURE__ */ new Date()).getFullYear(), C = new Date(w, 0, 1).getTimezoneOffset();
    w = new Date(w, 6, 1).getTimezoneOffset();
    var P = Math.max(C, w);
    (v(), L)[a >>> 2 >>> 0] = 60 * P, (v(), B)[l >>> 2 >>> 0] = +(C != w), a = (l = (D) => {
      var H = Math.abs(D);
      return `UTC${0 <= D ? "-" : "+"}${String(Math.floor(H / 60)).padStart(2, "0")}${String(H % 60).padStart(2, "0")}`;
    })(C), l = l(w), w < C ? (gt(a, h, 17), gt(l, f, 17)) : (gt(a, f, 17), gt(l, h, 17));
  }
  var cm = () => Date.now();
  function mm(a, l, h) {
    if (h >>>= 0, !(0 <= a && 3 >= a)) return 28;
    if (a === 0) a = Date.now();
    else {
      a = performance.timeOrigin + performance.now();
    }
    return a = Math.round(1e6 * a), (v(), Z)[h >>> 3 >>> 0] = BigInt(a), 0;
  }
  var Pn = [], Ii = (a, l) => {
    Pn.length = 0;
    for (var h; h = (v(), F)[a++ >>> 0]; ) {
      var f = h != 105;
      l += (f &= h != 112) && l % 8 ? 4 : 0, Pn.push(h == 112 ? (v(), L)[l >>> 2 >>> 0] : h == 106 ? (v(), Z)[l >>> 3 >>> 0] : h == 105 ? (v(), B)[l >>> 2 >>> 0] : (v(), Y)[l >>> 3 >>> 0]), l += f ? 8 : 4;
    }
    return Pn;
  };
  function fm(a, l, h) {
    return a >>>= 0, l = Ii(l >>> 0, h >>> 0), Nn[a](...l);
  }
  function hm(a, l, h) {
    return a >>>= 0, l = Ii(l >>> 0, h >>> 0), Nn[a](...l);
  }
  var gm = () => {
  };
  function bm(a, l) {
    return E(Ae(a >>> 0, l >>> 0));
  }
  var ym = () => {
    throw Ne += 1, "unwind";
  };
  function _m() {
    return 4294901760;
  }
  var wm = () => navigator.hardwareConcurrency, At2 = {}, _r = (a) => {
    var l;
    return (l = /\bwasm-function\[\d+\]:(0x[0-9a-f]+)/.exec(a)) ? +l[1] : (l = /:(\d+):\d+(?:\)|$)/.exec(a)) ? 2147483648 | +l[1] : 0;
  }, Ci = (a) => {
    for (var l of a) (a = _r(l)) && (At2[a] = l);
  };
  function vm() {
    var a = Error().stack.toString().split(`
`);
    return a[0] == "Error" && a.shift(), Ci(a), At2.gd = _r(a[3]), At2.Jd = a, At2.gd;
  }
  function wr(a) {
    if (!(a = At2[a >>> 0])) return 0;
    var l;
    if (l = /^\s+at .*\.wasm\.(.*) \(.*\)$/.exec(a)) a = l[1];
    else if (l = /^\s+at (.*) \(.*\)$/.exec(a)) a = l[1];
    else {
      if (!(l = /^(.+?)@/.exec(a))) return 0;
      a = l[1];
    }
    tt2(wr.hd ?? 0), l = mr2(a) + 1;
    var h = Qt2(l);
    return h && gt(a, h, l), wr.hd = h, wr.hd;
  }
  function $m(a) {
    a >>>= 0;
    var l = (v(), F).length;
    if (a <= l || 4294901760 < a) return false;
    for (var h = 1; 4 >= h; h *= 2) {
      var f = l * (1 + 0.2 / h);
      f = Math.min(f, a + 100663296);
      e: {
        f = (Math.min(4294901760, 65536 * Math.ceil(Math.max(a, f) / 65536)) - ht2.buffer.byteLength + 65535) / 65536 | 0;
        try {
          ht2.grow(f), Me();
          var w = 1;
          break e;
        } catch {
        }
        w = void 0;
      }
      if (w) return true;
    }
    return false;
  }
  function xm(a, l, h) {
    if (a >>>= 0, l >>>= 0, At2.gd == a) var f = At2.Jd;
    else (f = Error().stack.toString().split(`
`))[0] == "Error" && f.shift(), Ci(f);
    for (var w = 3; f[w] && _r(f[w]) != a; ) ++w;
    for (a = 0; a < h && f[a + w]; ++a) (v(), B)[l + 4 * a >>> 2 >>> 0] = _r(f[a + w]);
    return a;
  }
  var On, zn = {}, Ai = () => {
    if (!On) {
      var a, l = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: (globalThis.navigator?.language ?? "C").replace("-", "_") + ".UTF-8", _: "./this.program" };
      for (a in zn) zn[a] === void 0 ? delete l[a] : l[a] = zn[a];
      var h = [];
      for (a in l) h.push(`${a}=${l[a]}`);
      On = h;
    }
    return On;
  };
  function Ei(a, l) {
    if (o) return Se(19, 1, a, l);
    a >>>= 0, l >>>= 0;
    var h, f = 0, w = 0;
    for (h of Ai()) {
      var C = l + f;
      (v(), L)[a + w >>> 2 >>> 0] = C, f += gt(h, C, 1 / 0) + 1, w += 4;
    }
    return 0;
  }
  function ki(a, l) {
    if (o) return Se(20, 1, a, l);
    a >>>= 0, l >>>= 0;
    var h = Ai();
    for (var f of ((v(), L)[a >>> 2 >>> 0] = h.length, a = 0, h)) a += mr2(f) + 1;
    return (v(), L)[l >>> 2 >>> 0] = a, 0;
  }
  function Pi(a) {
    return o ? Se(21, 1, a) : 52;
  }
  function Oi(a, l, h, f) {
    return o ? Se(22, 1, a, l, h, f) : 52;
  }
  function zi(a, l, h, f) {
    return o ? Se(23, 1, a, l, h, f) : 70;
  }
  var Sm = [null, [], []];
  function Bi(a, l, h, f) {
    if (o) return Se(24, 1, a, l, h, f);
    l >>>= 0, h >>>= 0, f >>>= 0;
    for (var w = 0, C = 0; C < h; C++) {
      var P = (v(), L)[l >>> 2 >>> 0], D = (v(), L)[l + 4 >>> 2 >>> 0];
      l += 8;
      for (var H = 0; H < D; H++) {
        var K = a, se = (v(), F)[P + H >>> 0], pe2 = Sm[K];
        se === 0 || se === 10 ? ((K === 1 ? I : E)(Xo(pe2)), pe2.length = 0) : pe2.push(se);
      }
      w += D;
    }
    return (v(), L)[f >>> 2 >>> 0] = w, 0;
  }
  function Tm(a) {
    return a >>> 0;
  }
  o || (function() {
    for (var a = e.numThreads - 1; a--; ) Fo();
    Pe.push(async () => {
      var l = (async function() {
        if (!o) return Promise.all(ft.map(Ho));
      })();
      he++, await l, --he == 0 && Te && (l = Te, Te = null, l());
    });
  })(), o || (ht2 = new WebAssembly.Memory({ initial: 256, maximum: 65536, shared: true }), Me()), e.wasmBinary && (g = e.wasmBinary), e.stackSave = () => de(), e.stackRestore = (a) => ue(a), e.stackAlloc = (a) => Mn(a), e.setValue = function(a, l, h = "i8") {
    switch (h.endsWith("*") && (h = "*"), h) {
      case "i1":
      case "i8":
        (v(), N)[a >>> 0] = l;
        break;
      case "i16":
        (v(), q)[a >>> 1 >>> 0] = l;
        break;
      case "i32":
        (v(), B)[a >>> 2 >>> 0] = l;
        break;
      case "i64":
        (v(), Z)[a >>> 3 >>> 0] = BigInt(l);
        break;
      case "float":
        (v(), Q2)[a >>> 2 >>> 0] = l;
        break;
      case "double":
        (v(), Y)[a >>> 3 >>> 0] = l;
        break;
      case "*":
        (v(), L)[a >>> 2 >>> 0] = l;
        break;
      default:
        M(`invalid type for setValue: ${h}`);
    }
  }, e.getValue = function(a, l = "i8") {
    switch (l.endsWith("*") && (l = "*"), l) {
      case "i1":
      case "i8":
        return (v(), N)[a >>> 0];
      case "i16":
        return (v(), q)[a >>> 1 >>> 0];
      case "i32":
        return (v(), B)[a >>> 2 >>> 0];
      case "i64":
        return (v(), Z)[a >>> 3 >>> 0];
      case "float":
        return (v(), Q2)[a >>> 2 >>> 0];
      case "double":
        return (v(), Y)[a >>> 3 >>> 0];
      case "*":
        return (v(), L)[a >>> 2 >>> 0];
      default:
        M(`invalid type for getValue: ${l}`);
    }
  }, e.UTF8ToString = Ae, e.stringToUTF8 = gt, e.lengthBytesUTF8 = mr2;
  var Di, Mi, vr, tt2, Qt2, Bn, Ri, Ui, Ni, Dn, Vi, Li, ce, Yt2, Wi, ue, Mn, de, Gi, Rn, Hi, Fi, qi, Un, Ki, ji, Zi, Qi, Yi, Xi, Ji, ea, ta, ra, na, oa, ia, aa, sa, ua, da, la, ca, pa, ma, fa, ha, ga, ba, ya, _a2, wa, va2, $a2, xa2, Sa2, Ta, Ia2, Ca2, Aa2, Ea2, ka2, Pa2, ct, Im = [lr2, Vo, jo, Jo, ei, ti, ri, ni, oi, ii, ai, si, ui, di, li, ci, xi, Si, Ti, Ei, ki, Pi, Oi, zi, Bi], Nn = { 1003524: (a, l, h, f, w) => {
    if (e === void 0 || !e.Xc) return 1;
    if ((a = Ae(Number(a >>> 0))).startsWith("./") && (a = a.substring(2)), !(a = e.Xc.get(a))) return 2;
    if (l = Number(l >>> 0), h = Number(h >>> 0), f = Number(f >>> 0), l + h > a.byteLength) return 3;
    try {
      let C = a.subarray(l, l + h);
      switch (w) {
        case 0:
          (v(), F).set(C, f >>> 0);
          break;
        case 1:
          e.Qd ? e.Qd(f, C) : e.Id(f, C);
          break;
        default:
          return 4;
      }
      return 0;
    } catch {
      return 4;
    }
  }, 1004348: (a, l, h) => {
    e.td(a, (v(), F).subarray(l >>> 0, l + h >>> 0));
  }, 1004412: () => e.Sd(), 1004454: (a) => {
    e.sd(a);
  }, 1004491: () => {
    e.Bd();
  }, 1004522: () => {
    e.Cd();
  }, 1004551: () => {
    e.Gd();
  }, 1004576: (a) => e.Ad(a), 1004609: (a) => e.Ed(a), 1004641: (a, l, h) => {
    e.ed(Number(a), Number(l), Number(h), true);
  }, 1004704: (a, l, h) => {
    e.ed(Number(a), Number(l), Number(h));
  }, 1004761: () => typeof wasmOffsetConverter < "u", 1004818: (a) => {
    e.$b("Abs", a, void 0);
  }, 1004869: (a) => {
    e.$b("Neg", a, void 0);
  }, 1004920: (a) => {
    e.$b("Floor", a, void 0);
  }, 1004973: (a) => {
    e.$b("Ceil", a, void 0);
  }, 1005025: (a) => {
    e.$b("Reciprocal", a, void 0);
  }, 1005083: (a) => {
    e.$b("Sqrt", a, void 0);
  }, 1005135: (a) => {
    e.$b("Exp", a, void 0);
  }, 1005186: (a) => {
    e.$b("Erf", a, void 0);
  }, 1005237: (a) => {
    e.$b("Sigmoid", a, void 0);
  }, 1005292: (a, l, h) => {
    e.$b("HardSigmoid", a, { alpha: l, beta: h });
  }, 1005371: (a) => {
    e.$b("Log", a, void 0);
  }, 1005422: (a) => {
    e.$b("Sin", a, void 0);
  }, 1005473: (a) => {
    e.$b("Cos", a, void 0);
  }, 1005524: (a) => {
    e.$b("Tan", a, void 0);
  }, 1005575: (a) => {
    e.$b("Asin", a, void 0);
  }, 1005627: (a) => {
    e.$b("Acos", a, void 0);
  }, 1005679: (a) => {
    e.$b("Atan", a, void 0);
  }, 1005731: (a) => {
    e.$b("Sinh", a, void 0);
  }, 1005783: (a) => {
    e.$b("Cosh", a, void 0);
  }, 1005835: (a) => {
    e.$b("Asinh", a, void 0);
  }, 1005888: (a) => {
    e.$b("Acosh", a, void 0);
  }, 1005941: (a) => {
    e.$b("Atanh", a, void 0);
  }, 1005994: (a) => {
    e.$b("Tanh", a, void 0);
  }, 1006046: (a) => {
    e.$b("Not", a, void 0);
  }, 1006097: (a, l, h) => {
    e.$b("Clip", a, { min: l, max: h });
  }, 1006166: (a) => {
    e.$b("Clip", a, void 0);
  }, 1006218: (a, l) => {
    e.$b("Elu", a, { alpha: l });
  }, 1006276: (a) => {
    e.$b("Gelu", a, void 0);
  }, 1006328: (a) => {
    e.$b("Relu", a, void 0);
  }, 1006380: (a, l) => {
    e.$b("LeakyRelu", a, { alpha: l });
  }, 1006444: (a, l) => {
    e.$b("ThresholdedRelu", a, { alpha: l });
  }, 1006514: (a, l) => {
    e.$b("Cast", a, { to: l });
  }, 1006572: (a) => {
    e.$b("Add", a, void 0);
  }, 1006623: (a) => {
    e.$b("Sub", a, void 0);
  }, 1006674: (a) => {
    e.$b("Mul", a, void 0);
  }, 1006725: (a) => {
    e.$b("Div", a, void 0);
  }, 1006776: (a) => {
    e.$b("Pow", a, void 0);
  }, 1006827: (a) => {
    e.$b("Equal", a, void 0);
  }, 1006880: (a) => {
    e.$b("Greater", a, void 0);
  }, 1006935: (a) => {
    e.$b("GreaterOrEqual", a, void 0);
  }, 1006997: (a) => {
    e.$b("Less", a, void 0);
  }, 1007049: (a) => {
    e.$b("LessOrEqual", a, void 0);
  }, 1007108: (a, l, h, f, w) => {
    e.$b("ReduceMean", a, { keepDims: !!l, noopWithEmptyAxes: !!h, axes: f ? Array.from((v(), B).subarray(Number(f) >>> 0, Number(w) >>> 0)) : [] });
  }, 1007283: (a, l, h, f, w) => {
    e.$b("ReduceMax", a, { keepDims: !!l, noopWithEmptyAxes: !!h, axes: f ? Array.from((v(), B).subarray(Number(f) >>> 0, Number(w) >>> 0)) : [] });
  }, 1007457: (a, l, h, f, w) => {
    e.$b("ReduceMin", a, { keepDims: !!l, noopWithEmptyAxes: !!h, axes: f ? Array.from((v(), B).subarray(Number(f) >>> 0, Number(w) >>> 0)) : [] });
  }, 1007631: (a, l, h, f, w) => {
    e.$b("ReduceProd", a, { keepDims: !!l, noopWithEmptyAxes: !!h, axes: f ? Array.from((v(), B).subarray(Number(f) >>> 0, Number(w) >>> 0)) : [] });
  }, 1007806: (a, l, h, f, w) => {
    e.$b("ReduceSum", a, { keepDims: !!l, noopWithEmptyAxes: !!h, axes: f ? Array.from((v(), B).subarray(Number(f) >>> 0, Number(w) >>> 0)) : [] });
  }, 1007980: (a, l, h, f, w) => {
    e.$b("ReduceL1", a, { keepDims: !!l, noopWithEmptyAxes: !!h, axes: f ? Array.from((v(), B).subarray(Number(f) >>> 0, Number(w) >>> 0)) : [] });
  }, 1008153: (a, l, h, f, w) => {
    e.$b("ReduceL2", a, { keepDims: !!l, noopWithEmptyAxes: !!h, axes: f ? Array.from((v(), B).subarray(Number(f) >>> 0, Number(w) >>> 0)) : [] });
  }, 1008326: (a, l, h, f, w) => {
    e.$b("ReduceLogSum", a, { keepDims: !!l, noopWithEmptyAxes: !!h, axes: f ? Array.from((v(), B).subarray(Number(f) >>> 0, Number(w) >>> 0)) : [] });
  }, 1008503: (a, l, h, f, w) => {
    e.$b("ReduceSumSquare", a, { keepDims: !!l, noopWithEmptyAxes: !!h, axes: f ? Array.from((v(), B).subarray(Number(f) >>> 0, Number(w) >>> 0)) : [] });
  }, 1008683: (a, l, h, f, w) => {
    e.$b("ReduceLogSumExp", a, { keepDims: !!l, noopWithEmptyAxes: !!h, axes: f ? Array.from((v(), B).subarray(Number(f) >>> 0, Number(w) >>> 0)) : [] });
  }, 1008863: (a) => {
    e.$b("Where", a, void 0);
  }, 1008916: (a, l, h) => {
    e.$b("Transpose", a, { perm: l ? Array.from((v(), B).subarray(Number(l) >>> 0, Number(h) >>> 0)) : [] });
  }, 1009040: (a, l, h, f) => {
    e.$b("DepthToSpace", a, { blocksize: l, mode: Ae(h), format: f ? "NHWC" : "NCHW" });
  }, 1009173: (a, l, h, f) => {
    e.$b("DepthToSpace", a, { blocksize: l, mode: Ae(h), format: f ? "NHWC" : "NCHW" });
  }, 1009306: (a, l, h, f, w, C, P, D, H, K, se, pe2, xe, Ie, yt2) => {
    e.$b("ConvTranspose", a, { format: H ? "NHWC" : "NCHW", autoPad: l, dilations: [h], group: f, kernelShape: [w], pads: [C, P], strides: [D], wIsConst: () => !!(v(), N)[K >>> 0], outputPadding: se ? Array.from((v(), B).subarray(Number(se) >>> 0, Number(pe2) >>> 0)) : [], outputShape: xe ? Array.from((v(), B).subarray(Number(xe) >>> 0, Number(Ie) >>> 0)) : [], activation: Ae(yt2) });
  }, 1009739: (a, l, h, f, w, C, P, D, H, K, se, pe2, xe, Ie) => {
    e.$b("ConvTranspose", a, { format: D ? "NHWC" : "NCHW", autoPad: l, dilations: Array.from((v(), B).subarray(Number(h) >>> 0, (Number(h) >>> 0) + 2 >>> 0)), group: f, kernelShape: Array.from((v(), B).subarray(Number(w) >>> 0, (Number(w) >>> 0) + 2 >>> 0)), pads: Array.from((v(), B).subarray(Number(C) >>> 0, (Number(C) >>> 0) + 4 >>> 0)), strides: Array.from((v(), B).subarray(Number(P) >>> 0, (Number(P) >>> 0) + 2 >>> 0)), wIsConst: () => !!(v(), N)[H >>> 0], outputPadding: K ? Array.from((v(), B).subarray(Number(K) >>> 0, Number(se) >>> 0)) : [], outputShape: pe2 ? Array.from((v(), B).subarray(Number(pe2) >>> 0, Number(xe) >>> 0)) : [], activation: Ae(Ie) });
  }, 1010400: (a, l, h, f, w, C, P, D, H, K, se, pe2, xe, Ie, yt2) => {
    e.$b("ConvTranspose", a, { format: H ? "NHWC" : "NCHW", autoPad: l, dilations: [h], group: f, kernelShape: [w], pads: [C, P], strides: [D], wIsConst: () => !!(v(), N)[K >>> 0], outputPadding: se ? Array.from((v(), B).subarray(Number(se) >>> 0, Number(pe2) >>> 0)) : [], outputShape: xe ? Array.from((v(), B).subarray(Number(xe) >>> 0, Number(Ie) >>> 0)) : [], activation: Ae(yt2) });
  }, 1010833: (a, l, h, f, w, C, P, D, H, K, se, pe2, xe, Ie) => {
    e.$b("ConvTranspose", a, { format: D ? "NHWC" : "NCHW", autoPad: l, dilations: Array.from((v(), B).subarray(Number(h) >>> 0, (Number(h) >>> 0) + 2 >>> 0)), group: f, kernelShape: Array.from((v(), B).subarray(Number(w) >>> 0, (Number(w) >>> 0) + 2 >>> 0)), pads: Array.from((v(), B).subarray(Number(C) >>> 0, (Number(C) >>> 0) + 4 >>> 0)), strides: Array.from((v(), B).subarray(Number(P) >>> 0, (Number(P) >>> 0) + 2 >>> 0)), wIsConst: () => !!(v(), N)[H >>> 0], outputPadding: K ? Array.from((v(), B).subarray(Number(K) >>> 0, Number(se) >>> 0)) : [], outputShape: pe2 ? Array.from((v(), B).subarray(Number(pe2) >>> 0, Number(xe) >>> 0)) : [], activation: Ae(Ie) });
  }, 1011494: (a, l) => {
    e.$b("GlobalAveragePool", a, { format: l ? "NHWC" : "NCHW" });
  }, 1011585: (a, l, h, f, w, C, P, D, H, K, se, pe2, xe, Ie) => {
    e.$b("AveragePool", a, { format: Ie ? "NHWC" : "NCHW", auto_pad: l, ceil_mode: h, count_include_pad: f, storage_order: w, dilations: C ? Array.from((v(), B).subarray(Number(C) >>> 0, Number(P) >>> 0)) : [], kernel_shape: D ? Array.from((v(), B).subarray(Number(D) >>> 0, Number(H) >>> 0)) : [], pads: K ? Array.from((v(), B).subarray(Number(K) >>> 0, Number(se) >>> 0)) : [], strides: pe2 ? Array.from((v(), B).subarray(Number(pe2) >>> 0, Number(xe) >>> 0)) : [] });
  }, 1012064: (a, l) => {
    e.$b("GlobalAveragePool", a, { format: l ? "NHWC" : "NCHW" });
  }, 1012155: (a, l, h, f, w, C, P, D, H, K, se, pe2, xe, Ie) => {
    e.$b("AveragePool", a, { format: Ie ? "NHWC" : "NCHW", auto_pad: l, ceil_mode: h, count_include_pad: f, storage_order: w, dilations: C ? Array.from((v(), B).subarray(Number(C) >>> 0, Number(P) >>> 0)) : [], kernel_shape: D ? Array.from((v(), B).subarray(Number(D) >>> 0, Number(H) >>> 0)) : [], pads: K ? Array.from((v(), B).subarray(Number(K) >>> 0, Number(se) >>> 0)) : [], strides: pe2 ? Array.from((v(), B).subarray(Number(pe2) >>> 0, Number(xe) >>> 0)) : [] });
  }, 1012634: (a, l) => {
    e.$b("GlobalMaxPool", a, { format: l ? "NHWC" : "NCHW" });
  }, 1012721: (a, l, h, f, w, C, P, D, H, K, se, pe2, xe, Ie) => {
    e.$b("MaxPool", a, { format: Ie ? "NHWC" : "NCHW", auto_pad: l, ceil_mode: h, count_include_pad: f, storage_order: w, dilations: C ? Array.from((v(), B).subarray(Number(C) >>> 0, Number(P) >>> 0)) : [], kernel_shape: D ? Array.from((v(), B).subarray(Number(D) >>> 0, Number(H) >>> 0)) : [], pads: K ? Array.from((v(), B).subarray(Number(K) >>> 0, Number(se) >>> 0)) : [], strides: pe2 ? Array.from((v(), B).subarray(Number(pe2) >>> 0, Number(xe) >>> 0)) : [] });
  }, 1013196: (a, l) => {
    e.$b("GlobalMaxPool", a, { format: l ? "NHWC" : "NCHW" });
  }, 1013283: (a, l, h, f, w, C, P, D, H, K, se, pe2, xe, Ie) => {
    e.$b("MaxPool", a, { format: Ie ? "NHWC" : "NCHW", auto_pad: l, ceil_mode: h, count_include_pad: f, storage_order: w, dilations: C ? Array.from((v(), B).subarray(Number(C) >>> 0, Number(P) >>> 0)) : [], kernel_shape: D ? Array.from((v(), B).subarray(Number(D) >>> 0, Number(H) >>> 0)) : [], pads: K ? Array.from((v(), B).subarray(Number(K) >>> 0, Number(se) >>> 0)) : [], strides: pe2 ? Array.from((v(), B).subarray(Number(pe2) >>> 0, Number(xe) >>> 0)) : [] });
  }, 1013758: (a, l, h, f, w) => {
    e.$b("Gemm", a, { alpha: l, beta: h, transA: f, transB: w });
  }, 1013862: (a) => {
    e.$b("MatMul", a, void 0);
  }, 1013916: (a, l, h, f) => {
    e.$b("ArgMax", a, { keepDims: !!l, selectLastIndex: !!h, axis: f });
  }, 1014024: (a, l, h, f) => {
    e.$b("ArgMin", a, { keepDims: !!l, selectLastIndex: !!h, axis: f });
  }, 1014132: (a, l) => {
    e.$b("Softmax", a, { axis: l });
  }, 1014195: (a, l) => {
    e.$b("Concat", a, { axis: l });
  }, 1014255: (a, l, h, f, w) => {
    e.$b("Split", a, { axis: l, numOutputs: h, splitSizes: f ? Array.from((v(), B).subarray(Number(f) >>> 0, Number(w) >>> 0)) : [] });
  }, 1014411: (a) => {
    e.$b("Expand", a, void 0);
  }, 1014465: (a, l) => {
    e.$b("Gather", a, { axis: Number(l) });
  }, 1014536: (a, l) => {
    e.$b("GatherElements", a, { axis: Number(l) });
  }, 1014615: (a, l) => {
    e.$b("GatherND", a, { batch_dims: Number(l) });
  }, 1014694: (a, l, h, f, w, C, P, D, H, K, se) => {
    e.$b("Resize", a, { antialias: l, axes: h ? Array.from((v(), B).subarray(Number(h) >>> 0, Number(f) >>> 0)) : [], coordinateTransformMode: Ae(w), cubicCoeffA: C, excludeOutside: P, extrapolationValue: D, keepAspectRatioPolicy: Ae(H), mode: Ae(K), nearestMode: Ae(se) });
  }, 1015056: (a, l, h, f, w, C, P) => {
    e.$b("Slice", a, { starts: l ? Array.from((v(), B).subarray(Number(l) >>> 0, Number(h) >>> 0)) : [], ends: f ? Array.from((v(), B).subarray(Number(f) >>> 0, Number(w) >>> 0)) : [], axes: C ? Array.from((v(), B).subarray(Number(C) >>> 0, Number(P) >>> 0)) : [] });
  }, 1015320: (a) => {
    e.$b("Tile", a, void 0);
  }, 1015372: (a, l, h) => {
    e.$b("InstanceNormalization", a, { epsilon: l, format: h ? "NHWC" : "NCHW" });
  }, 1015486: (a, l, h) => {
    e.$b("InstanceNormalization", a, { epsilon: l, format: h ? "NHWC" : "NCHW" });
  }, 1015600: (a) => {
    e.$b("Range", a, void 0);
  }, 1015653: (a, l) => {
    e.$b("Einsum", a, { equation: Ae(l) });
  }, 1015734: (a, l, h, f, w) => {
    e.$b("Pad", a, { mode: l, value: h, pads: f ? Array.from((v(), B).subarray(Number(f) >>> 0, Number(w) >>> 0)) : [] });
  }, 1015877: (a, l, h, f, w, C) => {
    e.$b("BatchNormalization", a, { epsilon: l, momentum: h, spatial: !!w, trainingMode: !!f, format: C ? "NHWC" : "NCHW" });
  }, 1016046: (a, l, h, f, w, C) => {
    e.$b("BatchNormalization", a, { epsilon: l, momentum: h, spatial: !!w, trainingMode: !!f, format: C ? "NHWC" : "NCHW" });
  }, 1016215: (a, l, h) => {
    e.$b("CumSum", a, { exclusive: Number(l), reverse: Number(h) });
  }, 1016312: (a, l, h) => {
    e.$b("DequantizeLinear", a, { axis: l, blockSize: h });
  }, 1016402: (a, l, h, f, w) => {
    e.$b("GridSample", a, { align_corners: l, mode: Ae(h), padding_mode: Ae(f), format: w ? "NHWC" : "NCHW" });
  }, 1016572: (a, l, h, f, w) => {
    e.$b("GridSample", a, { align_corners: l, mode: Ae(h), padding_mode: Ae(f), format: w ? "NHWC" : "NCHW" });
  }, 1016742: (a, l) => {
    e.$b("ScatterND", a, { reduction: Ae(l) });
  }, 1016827: (a, l, h, f, w, C, P, D, H) => {
    e.$b("Attention", a, { numHeads: l, isUnidirectional: h, maskFilterValue: f, scale: w, doRotary: C, qkvHiddenSizes: P ? Array.from((v(), B).subarray(Number(D) >>> 0, Number(D) + P >>> 0)) : [], pastPresentShareBuffer: !!H });
  }, 1017099: (a) => {
    e.$b("BiasAdd", a, void 0);
  }, 1017154: (a) => {
    e.$b("BiasSplitGelu", a, void 0);
  }, 1017215: (a) => {
    e.$b("FastGelu", a, void 0);
  }, 1017271: (a, l, h, f, w, C, P, D, H, K, se, pe2, xe, Ie, yt2, Vn) => {
    e.$b("Conv", a, { format: pe2 ? "NHWC" : "NCHW", auto_pad: l, dilations: h ? Array.from((v(), B).subarray(Number(h) >>> 0, Number(f) >>> 0)) : [], group: w, kernel_shape: C ? Array.from((v(), B).subarray(Number(C) >>> 0, Number(P) >>> 0)) : [], pads: D ? Array.from((v(), B).subarray(Number(D) >>> 0, Number(H) >>> 0)) : [], strides: K ? Array.from((v(), B).subarray(Number(K) >>> 0, Number(se) >>> 0)) : [], w_is_const: () => !!(v(), N)[Number(xe) >>> 0], activation: Ae(Ie), activation_params: yt2 ? Array.from((v(), Q2).subarray(Number(yt2) >>> 0, Number(Vn) >>> 0)) : [] });
  }, 1017855: (a) => {
    e.$b("Gelu", a, void 0);
  }, 1017907: (a, l, h, f, w, C, P, D, H) => {
    e.$b("GroupQueryAttention", a, { numHeads: l, kvNumHeads: h, scale: f, softcap: w, doRotary: C, rotaryInterleaved: P, smoothSoftmax: D, localWindowSize: H });
  }, 1018124: (a, l, h, f) => {
    e.$b("LayerNormalization", a, { axis: l, epsilon: h, simplified: !!f });
  }, 1018235: (a, l, h, f) => {
    e.$b("LayerNormalization", a, { axis: l, epsilon: h, simplified: !!f });
  }, 1018346: (a, l, h, f, w, C) => {
    e.$b("MatMulNBits", a, { k: l, n: h, accuracyLevel: f, bits: w, blockSize: C });
  }, 1018473: (a, l, h, f, w, C) => {
    e.$b("MultiHeadAttention", a, { numHeads: l, isUnidirectional: h, maskFilterValue: f, scale: w, doRotary: C });
  }, 1018632: (a, l) => {
    e.$b("QuickGelu", a, { alpha: l });
  }, 1018696: (a, l, h, f, w) => {
    e.$b("RotaryEmbedding", a, { interleaved: !!l, numHeads: h, rotaryEmbeddingDim: f, scale: w });
  }, 1018835: (a, l, h) => {
    e.$b("SkipLayerNormalization", a, { epsilon: l, simplified: !!h });
  }, 1018937: (a, l, h) => {
    e.$b("SkipLayerNormalization", a, { epsilon: l, simplified: !!h });
  }, 1019039: (a, l, h, f) => {
    e.$b("GatherBlockQuantized", a, { gatherAxis: l, quantizeAxis: h, blockSize: f });
  }, 1019160: (a) => {
    e.Fd(a);
  }, 1019194: (a, l) => e.Hd(Number(a), Number(l), e.Yc.Kd, e.Yc.errors) };
  function Cm(a, l, h) {
    return yi(async () => {
      await e.Dd(Number(a), Number(l), Number(h));
    });
  }
  function Am() {
    return typeof wasmOffsetConverter < "u";
  }
  function Em(a, l, h, f) {
    var w = de();
    try {
      return ea(a, l, h, f);
    } catch (C) {
      if (ue(w), C !== C + 0) throw C;
      ce(1, 0);
    }
  }
  function km(a, l, h) {
    var f = de();
    try {
      return Qi(a, l, h);
    } catch (w) {
      if (ue(f), w !== w + 0) throw w;
      ce(1, 0);
    }
  }
  function Pm(a) {
    var l = de();
    try {
      Ki(a);
    } catch (h) {
      if (ue(l), h !== h + 0) throw h;
      ce(1, 0);
    }
  }
  function Om(a, l) {
    var h = de();
    try {
      return Un(a, l);
    } catch (f) {
      if (ue(h), f !== f + 0) throw f;
      ce(1, 0);
    }
  }
  function zm(a, l, h) {
    var f = de();
    try {
      qi(a, l, h);
    } catch (w) {
      if (ue(f), w !== w + 0) throw w;
      ce(1, 0);
    }
  }
  function Bm(a, l) {
    var h = de();
    try {
      ta(a, l);
    } catch (f) {
      if (ue(h), f !== f + 0) throw f;
      ce(1, 0);
    }
  }
  function Dm(a, l, h, f, w, C, P) {
    var D = de();
    try {
      return Xi(a, l, h, f, w, C, P);
    } catch (H) {
      if (ue(D), H !== H + 0) throw H;
      ce(1, 0);
    }
  }
  function Mm(a, l, h, f, w, C) {
    var P = de();
    try {
      ji(a, l, h, f, w, C);
    } catch (D) {
      if (ue(P), D !== D + 0) throw D;
      ce(1, 0);
    }
  }
  function Rm(a, l, h, f) {
    var w = de();
    try {
      Ji(a, l, h, f);
    } catch (C) {
      if (ue(w), C !== C + 0) throw C;
      ce(1, 0);
    }
  }
  function Um(a, l, h, f, w) {
    var C = de();
    try {
      Zi(a, l, h, f, w);
    } catch (P) {
      if (ue(C), P !== P + 0) throw P;
      ce(1, 0);
    }
  }
  function Nm(a, l, h, f, w, C, P) {
    var D = de();
    try {
      na(a, l, h, f, w, C, P);
    } catch (H) {
      if (ue(D), H !== H + 0) throw H;
      ce(1, 0);
    }
  }
  function Vm(a, l, h, f, w, C, P) {
    var D = de();
    try {
      oa(a, l, h, f, w, C, P);
    } catch (H) {
      if (ue(D), H !== H + 0) throw H;
      ce(1, 0);
    }
  }
  function Lm(a, l, h, f, w, C, P, D) {
    var H = de();
    try {
      ua(a, l, h, f, w, C, P, D);
    } catch (K) {
      if (ue(H), K !== K + 0) throw K;
      ce(1, 0);
    }
  }
  function Wm(a, l, h, f, w) {
    var C = de();
    try {
      return ra(a, l, h, f, w);
    } catch (P) {
      if (ue(C), P !== P + 0) throw P;
      ce(1, 0);
    }
  }
  function Gm(a, l, h) {
    var f = de();
    try {
      return da(a, l, h);
    } catch (w) {
      if (ue(f), w !== w + 0) throw w;
      ce(1, 0);
    }
  }
  function Hm(a, l, h, f, w, C, P, D) {
    var H = de();
    try {
      la(a, l, h, f, w, C, P, D);
    } catch (K) {
      if (ue(H), K !== K + 0) throw K;
      ce(1, 0);
    }
  }
  function Fm(a, l, h, f, w, C, P, D, H, K, se, pe2) {
    var xe = de();
    try {
      ia(a, l, h, f, w, C, P, D, H, K, se, pe2);
    } catch (Ie) {
      if (ue(xe), Ie !== Ie + 0) throw Ie;
      ce(1, 0);
    }
  }
  function qm(a, l, h, f, w, C) {
    var P = de();
    try {
      return aa(a, l, h, f, w, C);
    } catch (D) {
      if (ue(P), D !== D + 0) throw D;
      ce(1, 0);
    }
  }
  function Km(a, l, h) {
    var f = de();
    try {
      return ca(a, l, h);
    } catch (w) {
      if (ue(f), w !== w + 0) throw w;
      return ce(1, 0), 0n;
    }
  }
  function jm(a, l, h, f, w, C, P, D, H) {
    var K = de();
    try {
      Yi(a, l, h, f, w, C, P, D, H);
    } catch (se) {
      if (ue(K), se !== se + 0) throw se;
      ce(1, 0);
    }
  }
  function Zm(a) {
    var l = de();
    try {
      return pa(a);
    } catch (h) {
      if (ue(l), h !== h + 0) throw h;
      ce(1, 0);
    }
  }
  function Qm(a, l) {
    var h = de();
    try {
      return Ca2(a, l);
    } catch (f) {
      if (ue(h), f !== f + 0) throw f;
      return ce(1, 0), 0n;
    }
  }
  function Ym(a) {
    var l = de();
    try {
      return ma(a);
    } catch (h) {
      if (ue(l), h !== h + 0) throw h;
      return ce(1, 0), 0n;
    }
  }
  function Xm(a, l, h, f) {
    var w = de();
    try {
      return _a2(a, l, h, f);
    } catch (C) {
      if (ue(w), C !== C + 0) throw C;
      ce(1, 0);
    }
  }
  function Jm(a, l, h, f, w) {
    var C = de();
    try {
      return wa(a, l, h, f, w);
    } catch (P) {
      if (ue(C), P !== P + 0) throw P;
      ce(1, 0);
    }
  }
  function ef(a, l, h, f, w, C) {
    var P = de();
    try {
      return va2(a, l, h, f, w, C);
    } catch (D) {
      if (ue(P), D !== D + 0) throw D;
      ce(1, 0);
    }
  }
  function tf(a, l, h, f, w, C) {
    var P = de();
    try {
      return $a2(a, l, h, f, w, C);
    } catch (D) {
      if (ue(P), D !== D + 0) throw D;
      ce(1, 0);
    }
  }
  function rf(a, l, h, f, w, C, P, D) {
    var H = de();
    try {
      return sa(a, l, h, f, w, C, P, D);
    } catch (K) {
      if (ue(H), K !== K + 0) throw K;
      ce(1, 0);
    }
  }
  function nf(a, l, h, f, w) {
    var C = de();
    try {
      return xa2(a, l, h, f, w);
    } catch (P) {
      if (ue(C), P !== P + 0) throw P;
      return ce(1, 0), 0n;
    }
  }
  function of(a, l, h, f) {
    var w = de();
    try {
      return Sa2(a, l, h, f);
    } catch (C) {
      if (ue(w), C !== C + 0) throw C;
      ce(1, 0);
    }
  }
  function af(a, l, h, f) {
    var w = de();
    try {
      return Ta(a, l, h, f);
    } catch (C) {
      if (ue(w), C !== C + 0) throw C;
      ce(1, 0);
    }
  }
  function sf(a, l, h, f, w, C, P, D, H, K, se, pe2) {
    var xe = de();
    try {
      return Ia2(a, l, h, f, w, C, P, D, H, K, se, pe2);
    } catch (Ie) {
      if (ue(xe), Ie !== Ie + 0) throw Ie;
      ce(1, 0);
    }
  }
  function uf(a, l, h, f, w, C, P, D, H, K, se) {
    var pe2 = de();
    try {
      ba(a, l, h, f, w, C, P, D, H, K, se);
    } catch (xe) {
      if (ue(pe2), xe !== xe + 0) throw xe;
      ce(1, 0);
    }
  }
  function df(a, l, h, f, w, C, P, D, H, K, se, pe2, xe, Ie, yt2, Vn) {
    var mf = de();
    try {
      ya(a, l, h, f, w, C, P, D, H, K, se, pe2, xe, Ie, yt2, Vn);
    } catch (Ln) {
      if (ue(mf), Ln !== Ln + 0) throw Ln;
      ce(1, 0);
    }
  }
  function lf(a, l, h) {
    var f = de();
    try {
      return fa(a, l, h);
    } catch (w) {
      if (ue(f), w !== w + 0) throw w;
      ce(1, 0);
    }
  }
  function cf(a, l, h) {
    var f = de();
    try {
      return ha(a, l, h);
    } catch (w) {
      if (ue(f), w !== w + 0) throw w;
      ce(1, 0);
    }
  }
  function pf(a, l, h, f) {
    var w = de();
    try {
      ga(a, l, h, f);
    } catch (C) {
      if (ue(w), C !== C + 0) throw C;
      ce(1, 0);
    }
  }
  function $r() {
    if (0 < he) Te = $r;
    else if (o) _?.(e), ve();
    else {
      for (var a = Pe; 0 < a.length; ) a.shift()(e);
      0 < he ? Te = $r : (e.calledRun = true, A || (ve(), _?.(e)));
    }
  }
  return o || (ct = await be2(), $r()), e.PTR_SIZE = 4, le2 ? e : new Promise((a, l) => {
    _ = a, T = l;
  });
}
var Wn, ff, hf, gf, Gn, V, Vt2, bf, Xt2, xr, Et, kt, yf, Oa2, Hn, za2, Ba2, Da2, Ma2, Oe, Fn, _e, Ra2, Ua2, Na2, Va2, qn, La2, Wa2, Ga2, Ha2, Fa2, qa2, Pt, Jt2, Ka2, ja2, Za2, Qa2, Ya2, Xa2, De, Sr, je2, Kn, Tr, Ja2, Ve2, Re, _t, wt, jn, Ir, es2, _f, ts2, rs2, ns2, os2, is2, Zn, Le2, Cr, ds2, ss2, us2, wf, ls2, ps2, vf, $f, ms2, gs2, Xn, xf, We, bs2, Yn, Sf, Tf, ys2, If, fs2, _s2, hs2, ws2, Ar, Jn, eo, Rr, vs2, Cf, Af, Ef, Er, ye, vt, Ge, tr2, me, Ur, $s2, xs2, kf, Pf, Of, Lt2, zf, Ss2, Ts2, $t, rt2, xt2, Wt, rr2, Nr, Vr, to, J, nr2, ro, Bf, Df, Is2, Cs2, Lr, Mf, ie2, nt, no, ot2, k2, zt2, Wr, As2, Es2, re, Gr, oo, Ps2, ao, Os2, Rf, ks2, Uf, zs, Hr2, Fr, io, Bs2, Ds2, qr2, Nf, Kr2, Ms2, jr, Rs2, so, uo, Vf, Lf, Us2, co, lo, Vs, Ls2, po, ee, Ce, Bt2, fo, we, ze2, W, fe, ho, Dt, Ze, j, Zr2, O, U, Ws2, Qr2, mo, Gs2, oe, Wf, Hs, Gf, Hf2, Ff, qf2, Be, Fs2, qs, pt, Kf2, jf2, Zf2, Qf2, Yf2, Xf2, Jf2, eh, th, rh, it2, Ks, js, Zs, Qs, Ys, Xs, Js, eu, tu, ru, nu, at2, nh, Xr2, go, st2, oh, ih, ah, sh, uh, dh, lh, ch, ph, mh, ut2, ou, iu, au, su, uu, du, lu, cu, pu, mu, Yr2, fu, hu, gu, bo, bu, fh, yo, hh, gh, bh, Gt, yh, yu, Jr2, _h, wh, vh, _u, wu, $h, xh, vu, $u, Sh, ge2, xu, Su, Tu, Iu, Cu, Au, Eu, ku, Pu, Th, Ou, zu, Bu, Du, or2, Mu, en2, Ru, Uu, Nu, Vu, Lu, Wu, Gu, Hu, Fu, qu, Ku, ju, Zu, Qu, Yu, Xu, Ju, ed, _o, wo, td, rd, nd, Ih, Ch, od, tn2, Ah, Eh, ad, sd, kh, Ph, dt, ud, dd, ld, cd, pd, md, fd, hd, gd, bd, yd, zh, Bh, Dh, Mh, _d, wd, vd, Qe2, Ye, Xe, rn2, St, ke, $d, nn2, xd, Sd, ir2, on2, an2, Rh, Uh, vo, Td, Nh, $o, Vh, ar2, sn2, Lh, Id, Cd, Wh, Ad, un2, Gh, Ed, Hh, kd, Pd, Od, zd, Bd, Dd, Fh, xo, qh, So, To, Md, Kh, jh, Io, Rd, Ud, Nd, Zh, Qh, Yh, Vd, Ld, Xh, Wd, Jh, Gd, Hd, eg, Fd, qd, Kd, tg, rg, ng, jd, Zd, Qd, Co, dn2, Yd, og, ig, Ao, Eo, Xd, ag, Jd, el, tl, sg, rl, ug, dg, nl, ol, lg, il, al, cg, pg, sl, ul, dl, mg, ll, cl, pl, fg, hg, ml, fl, hl, gg, bg, gl, bl, yl, yg, _g, _l, wl, vl2, mt2, Tt, Ht2, Ft, wg, vg, $g, xg, Sg, Tg, Ig, Cg, $l, xl, Sl, Ue, kg, Il, Tl, Pg, sr2, Cl, ko, Og, zg, Bg, Dg, Po, Al, El, Oo, Mg, ln2, kl, zo, Rg, Ug, Pl, Ng, Ol, zl, Bl, Vg, Lg, Dl, Ml, Wg, Gg, Rl, Ul, Hg, Nl, Vl, Fg, qg, Kg, Ll, Wl, Gl, jg, Zg, Qg, Yg, Xg, Jg, eb, tb, Hl, Fl, cn2, ql, Kl, jl, Zl, rb, nb, Ql, Yl, Xl, Jl, ec2, tc2, rc2, nc2, oc2, ic2, ac2, sc2, uc2, ib, ab, dc2, lc2, cc2, sb, ub, pc2, mc2, db, lb, fc2, hc2, gc, cb, pb, mb, bc2, fb, hb, gb, bb, yb, _b, wb, vb, yc2, $b, xb, Sb, Tb, Ib, _c, wc2, vc2, Cb, Ab, $c, xc, Eb, pn2, kb, Sc, Pb, Ob, Tc2, Ic, Cc, zb, Bb, Ac, Ec2, kc, Pc, Db, Mb, Rb, Oc, zc, Ub, Nb, Bc, Dc, Mc, Rc, mn2, Uc, Nc, Vb, Lb, Bo, Do, Vc, Lc, ur2, Mo, Wb, Wc, Gb, kr, Pr, Mt2, Hb, Gc, er2, Or, zr, Hc, Br, Dr, Mr, Qn, Rt, Fe, dr2, hn, gn, fn2, Ro, Uo, qt2, Kt2, qb, Fc, qc, Kc, jc, Zc, Qc, Yc, No, Xc, Kb, bn, Jc, tp, ep, yn, jb, rp, as2, oT;
var init_ort_bundle_min = __esm({
  "../../node_modules/.pnpm/onnxruntime-web@1.27.0/node_modules/onnxruntime-web/dist/ort.bundle.min.mjs"() {
    Wn = Object.defineProperty;
    ff = Object.getOwnPropertyDescriptor;
    hf = Object.getOwnPropertyNames;
    gf = Object.prototype.hasOwnProperty;
    Gn = ((t) => typeof __require < "u" ? __require : typeof Proxy < "u" ? new Proxy(t, { get: (e, r) => (typeof __require < "u" ? __require : e)[r] }) : t)(function(t) {
      if (typeof __require < "u") return __require.apply(this, arguments);
      throw Error('Dynamic require of "' + t + '" is not supported');
    });
    V = (t, e) => () => (t && (e = t(t = 0)), e);
    Vt2 = (t, e) => {
      for (var r in e) Wn(t, r, { get: e[r], enumerable: true });
    };
    bf = (t, e, r, n) => {
      if (e && typeof e == "object" || typeof e == "function") for (let o of hf(e)) !gf.call(t, o) && o !== r && Wn(t, o, { get: () => e[o], enumerable: !(n = ff(e, o)) || n.enumerable });
      return t;
    };
    Xt2 = (t) => bf(Wn({}, "__esModule", { value: true }), t);
    Hn = V(() => {
      xr = /* @__PURE__ */ new Map(), Et = [], kt = (t, e, r) => {
        if (e && typeof e.init == "function" && typeof e.createInferenceSessionHandler == "function") {
          let n = xr.get(t);
          if (n === void 0) xr.set(t, { backend: e, priority: r });
          else {
            if (n.priority > r) return;
            if (n.priority === r && n.backend !== e) throw new Error(`cannot register backend "${t}" using priority ${r}`);
          }
          if (r >= 0) {
            let o = Et.indexOf(t);
            o !== -1 && Et.splice(o, 1);
            for (let i = 0; i < Et.length; i++) if (xr.get(Et[i]).priority <= r) {
              Et.splice(i, 0, t);
              return;
            }
            Et.push(t);
          }
          return;
        }
        throw new TypeError("not a valid backend");
      }, yf = async (t) => {
        let e = xr.get(t);
        if (!e) return "backend not found.";
        if (e.initialized) return e.backend;
        if (e.aborted) return e.error;
        {
          let r = !!e.initPromise;
          try {
            return r || (e.initPromise = e.backend.init(t)), await e.initPromise, e.initialized = true, e.backend;
          } catch (n) {
            return r || (e.error = `${n}`, e.aborted = true), e.error;
          } finally {
            delete e.initPromise;
          }
        }
      }, Oa2 = async (t) => {
        let e = t.executionProviders || [], r = e.map((d) => typeof d == "string" ? d : d.name), n = r.length === 0 ? Et : r, o, i = [], s = /* @__PURE__ */ new Set();
        for (let d of n) {
          let c = await yf(d);
          typeof c == "string" ? i.push({ name: d, err: c }) : (o || (o = c), o === c && s.add(d));
        }
        if (!o) throw new Error(`no available backend found. ERR: ${i.map((d) => `[${d.name}] ${d.err}`).join(", ")}`);
        for (let { name: d, err: c } of i) r.includes(d) && console.warn(`removing requested execution provider "${d}" from session options because it is not available: ${c}`);
        let u = e.filter((d) => s.has(typeof d == "string" ? d : d.name));
        return [o, new Proxy(t, { get: (d, c) => c === "executionProviders" ? u : Reflect.get(d, c) })];
      };
    });
    za2 = V(() => {
      Hn();
    });
    Da2 = V(() => {
      Ba2 = "1.27.0";
    });
    Fn = V(() => {
      Da2();
      Ma2 = "warning", Oe = { wasm: {}, webgl: {}, webgpu: {}, versions: { common: Ba2 }, set logLevel(t) {
        if (t !== void 0) {
          if (typeof t != "string" || ["verbose", "info", "warning", "error", "fatal"].indexOf(t) === -1) throw new Error(`Unsupported logging level: ${t}`);
          Ma2 = t;
        }
      }, get logLevel() {
        return Ma2;
      } };
      Object.defineProperty(Oe, "logLevel", { enumerable: true });
    });
    Ra2 = V(() => {
      Fn();
      _e = Oe;
    });
    Va2 = V(() => {
      Ua2 = (t, e) => {
        let r = typeof document < "u" ? document.createElement("canvas") : new OffscreenCanvas(1, 1);
        r.width = t.dims[3], r.height = t.dims[2];
        let n = r.getContext("2d");
        if (n != null) {
          let o, i;
          e?.tensorLayout !== void 0 && e.tensorLayout === "NHWC" ? (o = t.dims[2], i = t.dims[3]) : (o = t.dims[3], i = t.dims[2]);
          let s = e?.format !== void 0 ? e.format : "RGB", u = e?.norm, d, c;
          u === void 0 || u.mean === void 0 ? d = [255, 255, 255, 255] : typeof u.mean == "number" ? d = [u.mean, u.mean, u.mean, u.mean] : (d = [u.mean[0], u.mean[1], u.mean[2], 0], u.mean[3] !== void 0 && (d[3] = u.mean[3])), u === void 0 || u.bias === void 0 ? c = [0, 0, 0, 0] : typeof u.bias == "number" ? c = [u.bias, u.bias, u.bias, u.bias] : (c = [u.bias[0], u.bias[1], u.bias[2], 0], u.bias[3] !== void 0 && (c[3] = u.bias[3]));
          let p = i * o, m = 0, g = p, y = p * 2, b = -1;
          s === "RGBA" ? (m = 0, g = p, y = p * 2, b = p * 3) : s === "RGB" ? (m = 0, g = p, y = p * 2) : s === "RBG" && (m = 0, y = p, g = p * 2);
          for (let _ = 0; _ < i; _++) for (let T = 0; T < o; T++) {
            let x = (t.data[m++] - c[0]) * d[0], $2 = (t.data[g++] - c[1]) * d[1], S = (t.data[y++] - c[2]) * d[2], I = b === -1 ? 255 : (t.data[b++] - c[3]) * d[3];
            n.fillStyle = "rgba(" + x + "," + $2 + "," + S + "," + I + ")", n.fillRect(T, _, 1, 1);
          }
          if ("toDataURL" in r) return r.toDataURL();
          throw new Error("toDataURL is not supported");
        } else throw new Error("Can not access image data");
      }, Na2 = (t, e) => {
        let r = typeof document < "u" ? document.createElement("canvas").getContext("2d") : new OffscreenCanvas(1, 1).getContext("2d"), n;
        if (r != null) {
          let o, i, s;
          e?.tensorLayout !== void 0 && e.tensorLayout === "NHWC" ? (o = t.dims[2], i = t.dims[1], s = t.dims[3]) : (o = t.dims[3], i = t.dims[2], s = t.dims[1]);
          let u = e !== void 0 && e.format !== void 0 ? e.format : "RGB", d = e?.norm, c, p;
          d === void 0 || d.mean === void 0 ? c = [255, 255, 255, 255] : typeof d.mean == "number" ? c = [d.mean, d.mean, d.mean, d.mean] : (c = [d.mean[0], d.mean[1], d.mean[2], 255], d.mean[3] !== void 0 && (c[3] = d.mean[3])), d === void 0 || d.bias === void 0 ? p = [0, 0, 0, 0] : typeof d.bias == "number" ? p = [d.bias, d.bias, d.bias, d.bias] : (p = [d.bias[0], d.bias[1], d.bias[2], 0], d.bias[3] !== void 0 && (p[3] = d.bias[3]));
          let m = i * o;
          if (e !== void 0 && (e.format !== void 0 && s === 4 && e.format !== "RGBA" || s === 3 && e.format !== "RGB" && e.format !== "BGR")) throw new Error("Tensor format doesn't match input tensor dims");
          let g = 4, y = 0, b = 1, _ = 2, T = 3, x = 0, $2 = m, S = m * 2, I = -1;
          u === "RGBA" ? (x = 0, $2 = m, S = m * 2, I = m * 3) : u === "RGB" ? (x = 0, $2 = m, S = m * 2) : u === "RBG" && (x = 0, S = m, $2 = m * 2), n = r.createImageData(o, i);
          for (let E = 0; E < i * o; y += g, b += g, _ += g, T += g, E++) n.data[y] = (t.data[x++] - p[0]) * c[0], n.data[b] = (t.data[$2++] - p[1]) * c[1], n.data[_] = (t.data[S++] - p[2]) * c[2], n.data[T] = I === -1 ? 255 : (t.data[I++] - p[3]) * c[3];
        } else throw new Error("Can not access image data");
        return n;
      };
    });
    qa2 = V(() => {
      Sr();
      qn = (t, e) => {
        if (t === void 0) throw new Error("Image buffer must be defined");
        if (e.height === void 0 || e.width === void 0) throw new Error("Image height and width must be defined");
        if (e.tensorLayout === "NHWC") throw new Error("NHWC Tensor layout is not supported yet");
        let { height: r, width: n } = e, o = e.norm ?? { mean: 255, bias: 0 }, i, s;
        typeof o.mean == "number" ? i = [o.mean, o.mean, o.mean, o.mean] : i = [o.mean[0], o.mean[1], o.mean[2], o.mean[3] ?? 255], typeof o.bias == "number" ? s = [o.bias, o.bias, o.bias, o.bias] : s = [o.bias[0], o.bias[1], o.bias[2], o.bias[3] ?? 0];
        let u = e.format !== void 0 ? e.format : "RGBA", d = e.tensorFormat !== void 0 && e.tensorFormat !== void 0 ? e.tensorFormat : "RGB", c = r * n, p = d === "RGBA" ? new Float32Array(c * 4) : new Float32Array(c * 3), m = 4, g = 0, y = 1, b = 2, _ = 3, T = 0, x = c, $2 = c * 2, S = -1;
        u === "RGB" && (m = 3, g = 0, y = 1, b = 2, _ = -1), d === "RGBA" ? S = c * 3 : d === "RBG" ? (T = 0, $2 = c, x = c * 2) : d === "BGR" && ($2 = 0, x = c, T = c * 2);
        for (let E = 0; E < c; E++, g += m, b += m, y += m, _ += m) p[T++] = (t[g] + s[0]) / i[0], p[x++] = (t[y] + s[1]) / i[1], p[$2++] = (t[b] + s[2]) / i[2], S !== -1 && _ !== -1 && (p[S++] = (t[_] + s[3]) / i[3]);
        return d === "RGBA" ? new De("float32", p, [1, 4, r, n]) : new De("float32", p, [1, 3, r, n]);
      }, La2 = async (t, e) => {
        let r = typeof HTMLImageElement < "u" && t instanceof HTMLImageElement, n = typeof ImageData < "u" && t instanceof ImageData, o = typeof ImageBitmap < "u" && t instanceof ImageBitmap, i = typeof t == "string", s, u = e ?? {}, d = () => {
          if (typeof document < "u") return document.createElement("canvas");
          if (typeof OffscreenCanvas < "u") return new OffscreenCanvas(1, 1);
          throw new Error("Canvas is not supported");
        }, c = (p) => typeof HTMLCanvasElement < "u" && p instanceof HTMLCanvasElement || p instanceof OffscreenCanvas ? p.getContext("2d") : null;
        if (r) {
          let p = d();
          p.width = t.width, p.height = t.height;
          let m = c(p);
          if (m != null) {
            let g = t.height, y = t.width;
            if (e !== void 0 && e.resizedHeight !== void 0 && e.resizedWidth !== void 0 && (g = e.resizedHeight, y = e.resizedWidth), e !== void 0) {
              if (u = e, e.tensorFormat !== void 0) throw new Error("Image input config format must be RGBA for HTMLImageElement");
              u.tensorFormat = "RGBA", u.height = g, u.width = y;
            } else u.tensorFormat = "RGBA", u.height = g, u.width = y;
            m.drawImage(t, 0, 0), s = m.getImageData(0, 0, y, g).data;
          } else throw new Error("Can not access image data");
        } else if (n) {
          let p, m;
          if (e !== void 0 && e.resizedWidth !== void 0 && e.resizedHeight !== void 0 ? (p = e.resizedHeight, m = e.resizedWidth) : (p = t.height, m = t.width), e !== void 0 && (u = e), u.format = "RGBA", u.height = p, u.width = m, e !== void 0) {
            let g = d();
            g.width = m, g.height = p;
            let y = c(g);
            if (y != null) y.putImageData(t, 0, 0), s = y.getImageData(0, 0, m, p).data;
            else throw new Error("Can not access image data");
          } else s = t.data;
        } else if (o) {
          if (e === void 0) throw new Error("Please provide image config with format for Imagebitmap");
          let p = d();
          p.width = t.width, p.height = t.height;
          let m = c(p);
          if (m != null) {
            let g = t.height, y = t.width;
            return m.drawImage(t, 0, 0, y, g), s = m.getImageData(0, 0, y, g).data, u.height = g, u.width = y, qn(s, u);
          } else throw new Error("Can not access image data");
        } else {
          if (i) return new Promise((p, m) => {
            let g = d(), y = c(g);
            if (!t || !y) return m();
            let b = new Image();
            b.crossOrigin = "Anonymous", b.src = t, b.onload = () => {
              g.width = b.width, g.height = b.height, y.drawImage(b, 0, 0, g.width, g.height);
              let _ = y.getImageData(0, 0, g.width, g.height);
              u.height = g.height, u.width = g.width, p(qn(_.data, u));
            };
          });
          throw new Error("Input data provided is not supported - aborted tensor creation");
        }
        if (s !== void 0) return qn(s, u);
        throw new Error("Input data provided is not supported - aborted tensor creation");
      }, Wa2 = (t, e) => {
        let { width: r, height: n, download: o, dispose: i } = e, s = [1, n, r, 4];
        return new De({ location: "texture", type: "float32", texture: t, dims: s, download: o, dispose: i });
      }, Ga2 = (t, e) => {
        let { dataType: r, dims: n, download: o, dispose: i } = e;
        return new De({ location: "gpu-buffer", type: r ?? "float32", gpuBuffer: t, dims: n, download: o, dispose: i });
      }, Ha2 = (t, e) => {
        let { dataType: r, dims: n, download: o, dispose: i } = e;
        return new De({ location: "ml-tensor", type: r ?? "float32", mlTensor: t, dims: n, download: o, dispose: i });
      }, Fa2 = (t, e, r) => new De({ location: "cpu-pinned", type: t, data: e, dims: r ?? [e.length] });
    });
    Za2 = V(() => {
      Pt = /* @__PURE__ */ new Map([["float32", Float32Array], ["uint8", Uint8Array], ["int8", Int8Array], ["uint16", Uint16Array], ["int16", Int16Array], ["int32", Int32Array], ["bool", Uint8Array], ["float64", Float64Array], ["uint32", Uint32Array], ["int4", Uint8Array], ["uint4", Uint8Array]]), Jt2 = /* @__PURE__ */ new Map([[Float32Array, "float32"], [Uint8Array, "uint8"], [Int8Array, "int8"], [Uint16Array, "uint16"], [Int16Array, "int16"], [Int32Array, "int32"], [Float64Array, "float64"], [Uint32Array, "uint32"]]), Ka2 = false, ja2 = () => {
        if (!Ka2) {
          Ka2 = true;
          let t = typeof BigInt64Array < "u" && BigInt64Array.from, e = typeof BigUint64Array < "u" && BigUint64Array.from, r = globalThis.Float16Array, n = typeof r < "u" && r.from;
          t && (Pt.set("int64", BigInt64Array), Jt2.set(BigInt64Array, "int64")), e && (Pt.set("uint64", BigUint64Array), Jt2.set(BigUint64Array, "uint64")), n ? (Pt.set("float16", r), Jt2.set(r, "float16")) : Pt.set("float16", Uint16Array);
        }
      };
    });
    Xa2 = V(() => {
      Sr();
      Qa2 = (t) => {
        let e = 1;
        for (let r = 0; r < t.length; r++) {
          let n = t[r];
          if (typeof n != "number" || !Number.isSafeInteger(n)) throw new TypeError(`dims[${r}] must be an integer, got: ${n}`);
          if (n < 0) throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${n}`);
          e *= n;
        }
        return e;
      }, Ya2 = (t, e) => {
        switch (t.location) {
          case "cpu":
            return new De(t.type, t.data, e);
          case "cpu-pinned":
            return new De({ location: "cpu-pinned", data: t.data, type: t.type, dims: e });
          case "texture":
            return new De({ location: "texture", texture: t.texture, type: t.type, dims: e });
          case "gpu-buffer":
            return new De({ location: "gpu-buffer", gpuBuffer: t.gpuBuffer, type: t.type, dims: e });
          case "ml-tensor":
            return new De({ location: "ml-tensor", mlTensor: t.mlTensor, type: t.type, dims: e });
          default:
            throw new Error(`tensorReshape: tensor location ${t.location} is not supported`);
        }
      };
    });
    Sr = V(() => {
      Va2();
      qa2();
      Za2();
      Xa2();
      De = class {
        constructor(e, r, n) {
          ja2();
          let o, i;
          if (typeof e == "object" && "location" in e) switch (this.dataLocation = e.location, o = e.type, i = e.dims, e.location) {
            case "cpu-pinned": {
              let u = Pt.get(o);
              if (!u) throw new TypeError(`unsupported type "${o}" to create tensor from pinned buffer`);
              if (!(e.data instanceof u)) throw new TypeError(`buffer should be of type ${u.name}`);
              this.cpuData = e.data;
              break;
            }
            case "texture": {
              if (o !== "float32") throw new TypeError(`unsupported type "${o}" to create tensor from texture`);
              this.gpuTextureData = e.texture, this.downloader = e.download, this.disposer = e.dispose;
              break;
            }
            case "gpu-buffer": {
              if (o !== "float32" && o !== "float16" && o !== "int32" && o !== "int64" && o !== "uint32" && o !== "uint8" && o !== "bool" && o !== "uint4" && o !== "int4") throw new TypeError(`unsupported type "${o}" to create tensor from gpu buffer`);
              this.gpuBufferData = e.gpuBuffer, this.downloader = e.download, this.disposer = e.dispose;
              break;
            }
            case "ml-tensor": {
              if (o !== "float32" && o !== "float16" && o !== "int32" && o !== "int64" && o !== "uint32" && o !== "uint64" && o !== "int8" && o !== "uint8" && o !== "bool" && o !== "uint4" && o !== "int4") throw new TypeError(`unsupported type "${o}" to create tensor from MLTensor`);
              this.mlTensorData = e.mlTensor, this.downloader = e.download, this.disposer = e.dispose;
              break;
            }
            default:
              throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`);
          }
          else {
            let u, d;
            if (typeof e == "string") if (o = e, d = n, e === "string") {
              if (!Array.isArray(r)) throw new TypeError("A string tensor's data must be a string array.");
              u = r;
            } else {
              let c = Pt.get(e);
              if (c === void 0) throw new TypeError(`Unsupported tensor type: ${e}.`);
              if (Array.isArray(r)) {
                if (e === "float16" && c === Uint16Array || e === "uint4" || e === "int4") throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${c.name} as data.`);
                e === "uint64" || e === "int64" ? u = c.from(r, BigInt) : u = c.from(r);
              } else if (r instanceof c) u = r;
              else if (r instanceof Uint8ClampedArray) if (e === "uint8") u = Uint8Array.from(r);
              else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");
              else if (e === "float16" && r instanceof Uint16Array && c !== Uint16Array) u = new globalThis.Float16Array(r.buffer, r.byteOffset, r.length);
              else throw new TypeError(`A ${o} tensor's data must be type of ${c}`);
            }
            else if (d = r, Array.isArray(e)) {
              if (e.length === 0) throw new TypeError("Tensor type cannot be inferred from an empty array.");
              let c = typeof e[0];
              if (c === "string") o = "string", u = e;
              else if (c === "boolean") o = "bool", u = Uint8Array.from(e);
              else throw new TypeError(`Invalid element type of data array: ${c}.`);
            } else if (e instanceof Uint8ClampedArray) o = "uint8", u = Uint8Array.from(e);
            else {
              let c = Jt2.get(e.constructor);
              if (c === void 0) throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);
              o = c, u = e;
            }
            if (d === void 0) d = [u.length];
            else if (!Array.isArray(d)) throw new TypeError("A tensor's dims must be a number array");
            i = d, this.cpuData = u, this.dataLocation = "cpu";
          }
          let s = Qa2(i);
          if (this.cpuData && s !== this.cpuData.length && !((o === "uint4" || o === "int4") && Math.ceil(s / 2) === this.cpuData.length)) throw new Error(`Tensor's size(${s}) does not match data length(${this.cpuData.length}).`);
          this.type = o, this.dims = i, this.size = s;
        }
        static async fromImage(e, r) {
          return La2(e, r);
        }
        static fromTexture(e, r) {
          return Wa2(e, r);
        }
        static fromGpuBuffer(e, r) {
          return Ga2(e, r);
        }
        static fromMLTensor(e, r) {
          return Ha2(e, r);
        }
        static fromPinnedBuffer(e, r, n) {
          return Fa2(e, r, n);
        }
        toDataURL(e) {
          return Ua2(this, e);
        }
        toImageData(e) {
          return Na2(this, e);
        }
        get data() {
          if (this.ensureValid(), !this.cpuData) throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");
          return this.cpuData;
        }
        get location() {
          return this.dataLocation;
        }
        get texture() {
          if (this.ensureValid(), !this.gpuTextureData) throw new Error("The data is not stored as a WebGL texture.");
          return this.gpuTextureData;
        }
        get gpuBuffer() {
          if (this.ensureValid(), !this.gpuBufferData) throw new Error("The data is not stored as a WebGPU buffer.");
          return this.gpuBufferData;
        }
        get mlTensor() {
          if (this.ensureValid(), !this.mlTensorData) throw new Error("The data is not stored as a WebNN MLTensor.");
          return this.mlTensorData;
        }
        async getData(e) {
          switch (this.ensureValid(), this.dataLocation) {
            case "cpu":
            case "cpu-pinned":
              return this.data;
            case "texture":
            case "gpu-buffer":
            case "ml-tensor": {
              if (!this.downloader) throw new Error("The current tensor is not created with a specified data downloader.");
              if (this.isDownloading) throw new Error("The current tensor is being downloaded.");
              try {
                this.isDownloading = true;
                let r = await this.downloader();
                return this.downloader = void 0, this.dataLocation = "cpu", this.cpuData = r, e && this.disposer && (this.disposer(), this.disposer = void 0), r;
              } finally {
                this.isDownloading = false;
              }
            }
            default:
              throw new Error(`cannot get data from location: ${this.dataLocation}`);
          }
        }
        dispose() {
          if (this.isDownloading) throw new Error("The current tensor is being downloaded.");
          this.disposer && (this.disposer(), this.disposer = void 0), this.cpuData = void 0, this.gpuTextureData = void 0, this.gpuBufferData = void 0, this.mlTensorData = void 0, this.downloader = void 0, this.isDownloading = void 0, this.dataLocation = "none";
        }
        ensureValid() {
          if (this.dataLocation === "none") throw new Error("The tensor is disposed.");
        }
        reshape(e) {
          if (this.ensureValid(), this.downloader || this.disposer) throw new Error("Cannot reshape a tensor that owns GPU resource.");
          return Ya2(this, e);
        }
      };
    });
    Kn = V(() => {
      Sr();
      je2 = De;
    });
    jn = V(() => {
      Fn();
      Tr = (t, e) => {
        (typeof Oe.trace > "u" ? !Oe.wasm.trace : !Oe.trace) || console.timeStamp(`${t}::ORT::${e}`);
      }, Ja2 = (t, e) => {
        let r = new Error().stack?.split(/\r\n|\r|\n/g) || [], n = false;
        for (let o = 0; o < r.length; o++) {
          if (n && !r[o].includes("TRACE_FUNC")) {
            let i = `FUNC_${t}::${r[o].trim().split(" ")[1]}`;
            e && (i += `::${e}`), Tr("CPU", i);
            return;
          }
          r[o].includes("TRACE_FUNC") && (n = true);
        }
      }, Ve2 = (t) => {
        (typeof Oe.trace > "u" ? !Oe.wasm.trace : !Oe.trace) || Ja2("BEGIN", t);
      }, Re = (t) => {
        (typeof Oe.trace > "u" ? !Oe.wasm.trace : !Oe.trace) || Ja2("END", t);
      }, _t = (t) => {
        (typeof Oe.trace > "u" ? !Oe.wasm.trace : !Oe.trace) || console.time(`ORT::${t}`);
      }, wt = (t) => {
        (typeof Oe.trace > "u" ? !Oe.wasm.trace : !Oe.trace) || console.timeEnd(`ORT::${t}`);
      };
    });
    es2 = V(() => {
      Hn();
      Kn();
      jn();
      Ir = class t {
        constructor(e) {
          this.handler = e;
        }
        async run(e, r, n) {
          Ve2(), _t("InferenceSession.run");
          let o = {}, i = {};
          if (typeof e != "object" || e === null || e instanceof je2 || Array.isArray(e)) throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");
          let s = true;
          if (typeof r == "object") {
            if (r === null) throw new TypeError("Unexpected argument[1]: cannot be null.");
            if (r instanceof je2) throw new TypeError("'fetches' cannot be a Tensor");
            if (Array.isArray(r)) {
              if (r.length === 0) throw new TypeError("'fetches' cannot be an empty array.");
              s = false;
              for (let c of r) {
                if (typeof c != "string") throw new TypeError("'fetches' must be a string array or an object.");
                if (this.outputNames.indexOf(c) === -1) throw new RangeError(`'fetches' contains invalid output name: ${c}.`);
                o[c] = null;
              }
              if (typeof n == "object" && n !== null) i = n;
              else if (typeof n < "u") throw new TypeError("'options' must be an object.");
            } else {
              let c = false, p = Object.getOwnPropertyNames(r);
              for (let m of this.outputNames) if (p.indexOf(m) !== -1) {
                let g = r[m];
                (g === null || g instanceof je2) && (c = true, s = false, o[m] = g);
              }
              if (c) {
                if (typeof n == "object" && n !== null) i = n;
                else if (typeof n < "u") throw new TypeError("'options' must be an object.");
              } else i = r;
            }
          } else if (typeof r < "u") throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");
          for (let c of this.inputNames) if (typeof e[c] > "u") throw new Error(`input '${c}' is missing in 'feeds'.`);
          if (s) for (let c of this.outputNames) o[c] = null;
          let u = await this.handler.run(e, o, i), d = {};
          for (let c in u) if (Object.hasOwnProperty.call(u, c)) {
            let p = u[c];
            p instanceof je2 ? d[c] = p : d[c] = new je2(p.type, p.data, p.dims);
          }
          return wt("InferenceSession.run"), Re(), d;
        }
        async release() {
          return this.handler.dispose();
        }
        static async create(e, r, n, o) {
          Ve2(), _t("InferenceSession.create");
          let i, s = {};
          if (typeof e == "string") {
            if (i = e, typeof r == "object" && r !== null) s = r;
            else if (typeof r < "u") throw new TypeError("'options' must be an object.");
          } else if (e instanceof Uint8Array) {
            if (i = e, typeof r == "object" && r !== null) s = r;
            else if (typeof r < "u") throw new TypeError("'options' must be an object.");
          } else if (e instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && e instanceof SharedArrayBuffer) {
            let p = e, m = 0, g = e.byteLength;
            if (typeof r == "object" && r !== null) s = r;
            else if (typeof r == "number") {
              if (m = r, !Number.isSafeInteger(m)) throw new RangeError("'byteOffset' must be an integer.");
              if (m < 0 || m >= p.byteLength) throw new RangeError(`'byteOffset' is out of range [0, ${p.byteLength}).`);
              if (g = e.byteLength - m, typeof n == "number") {
                if (g = n, !Number.isSafeInteger(g)) throw new RangeError("'byteLength' must be an integer.");
                if (g <= 0 || m + g > p.byteLength) throw new RangeError(`'byteLength' is out of range (0, ${p.byteLength - m}].`);
                if (typeof o == "object" && o !== null) s = o;
                else if (typeof o < "u") throw new TypeError("'options' must be an object.");
              } else if (typeof n < "u") throw new TypeError("'byteLength' must be a number.");
            } else if (typeof r < "u") throw new TypeError("'options' must be an object.");
            i = new Uint8Array(p, m, g);
          } else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");
          let [u, d] = await Oa2(s), c = await u.createInferenceSessionHandler(i, d);
          return wt("InferenceSession.create"), Re(), new t(c);
        }
        startProfiling() {
          this.handler.startProfiling();
        }
        endProfiling() {
          this.handler.endProfiling();
        }
        get inputNames() {
          return this.handler.inputNames;
        }
        get outputNames() {
          return this.handler.outputNames;
        }
        get inputMetadata() {
          return this.handler.inputMetadata;
        }
        get outputMetadata() {
          return this.handler.outputMetadata;
        }
      };
    });
    ts2 = V(() => {
      es2();
      _f = Ir;
    });
    rs2 = V(() => {
    });
    ns2 = V(() => {
    });
    os2 = V(() => {
    });
    is2 = V(() => {
    });
    Zn = {};
    Vt2(Zn, { InferenceSession: () => _f, TRACE: () => Tr, TRACE_EVENT_BEGIN: () => _t, TRACE_EVENT_END: () => wt, TRACE_FUNC_BEGIN: () => Ve2, TRACE_FUNC_END: () => Re, Tensor: () => je2, env: () => _e, registerBackend: () => kt });
    Le2 = V(() => {
      za2();
      Ra2();
      ts2();
      Kn();
      rs2();
      ns2();
      jn();
      os2();
      is2();
    });
    Cr = V(() => {
    });
    ds2 = {};
    Vt2(ds2, { default: () => wf });
    ls2 = V(() => {
      Qn();
      vt();
      Ar();
      ss2 = "ort-wasm-proxy-worker", us2 = globalThis.self?.name === ss2;
      us2 && (self.onmessage = (t) => {
        let { type: e, in: r } = t.data;
        try {
          switch (e) {
            case "init-wasm":
              Er(r.wasm).then(() => {
                kr(r).then(() => {
                  postMessage({ type: e });
                }, (n) => {
                  postMessage({ type: e, err: n });
                });
              }, (n) => {
                postMessage({ type: e, err: n });
              });
              break;
            case "init-ep": {
              let { epName: n, env: o } = r;
              Pr(o, n).then(() => {
                postMessage({ type: e });
              }, (i) => {
                postMessage({ type: e, err: i });
              });
              break;
            }
            case "copy-from": {
              let { buffer: n } = r, o = er2(n);
              postMessage({ type: e, out: o });
              break;
            }
            case "create": {
              let { model: n, options: o } = r;
              Or(n, o).then((i) => {
                postMessage({ type: e, out: i });
              }, (i) => {
                postMessage({ type: e, err: i });
              });
              break;
            }
            case "release":
              zr(r), postMessage({ type: e });
              break;
            case "run": {
              let { sessionId: n, inputIndices: o, inputs: i, outputIndices: s, options: u } = r;
              Br(n, o, i, s, new Array(s.length).fill(null), u).then((d) => {
                d.some((c) => c[3] !== "cpu") ? postMessage({ type: e, err: "Proxy does not support non-cpu tensor location." }) : postMessage({ type: e, out: d }, Mr([...i, ...d]));
              }, (d) => {
                postMessage({ type: e, err: d });
              });
              break;
            }
            case "end-profiling":
              Dr(r), postMessage({ type: e });
              break;
            default:
          }
        } catch (n) {
          postMessage({ type: e, err: n });
        }
      });
      wf = us2 ? null : (t) => new Worker(t ?? We, { type: "module", name: ss2 });
    });
    ps2 = {};
    Vt2(ps2, { default: () => vf });
    ms2 = V(() => {
      vf = cs2, $f = globalThis.self?.name?.startsWith("em-pthread");
      $f && cs2();
    });
    Ar = V(() => {
      Cr();
      gs2 = typeof location > "u" ? void 0 : location.origin, Xn = import.meta.url > "file:" && import.meta.url < "file;", xf = () => {
        {
          if (Xn) {
            let t = URL;
            return new URL(new t("ort.bundle.min.mjs", import.meta.url).href, gs2).href;
          }
          return import.meta.url;
        }
      }, We = xf(), bs2 = () => {
        if (We && !We.startsWith("blob:")) return We.substring(0, We.lastIndexOf("/") + 1);
      }, Yn = (t, e) => {
        try {
          let r = e ?? We;
          return (r ? new URL(t, r) : new URL(t)).origin === gs2;
        } catch {
          return false;
        }
      }, Sf = (t, e) => {
        let r = e ?? We;
        try {
          return (r ? new URL(t, r) : new URL(t)).href;
        } catch {
          return;
        }
      }, Tf = (t, e) => `${e ?? "./"}${t}`, ys2 = async (t) => {
        let r = await (await fetch(t, { credentials: "same-origin" })).blob();
        return URL.createObjectURL(r);
      }, If = async (t) => (await import(
        /*webpackIgnore:true*/
        /*@vite-ignore*/
        t
      )).default, fs2 = (ls2(), Xt2(ds2)).default, _s2 = async () => {
        if (!We) throw new Error("Failed to load proxy worker: cannot determine the script source URL.");
        if (Yn(We)) return [void 0, fs2()];
        let t = await ys2(We);
        return [t, fs2(t)];
      }, hs2 = (ms2(), Xt2(ps2)).default, ws2 = async (t, e, r, n) => {
        let o = hs2 && !(t || e);
        if (o) if (We) o = Yn(We) || n && !r;
        else if (n && !r) o = true;
        else throw new Error("cannot determine the script source URL.");
        if (o) return [void 0, hs2];
        {
          let i = "ort-wasm-simd-threaded.jsep.mjs", s = t ?? Sf(i, e), u = r && s && !Yn(s, e), d = u ? await ys2(s) : s ?? Tf(i, e);
          return [u ? d : void 0, await If(d)];
        }
      };
    });
    vt = V(() => {
      Ar();
      eo = false, Rr = false, vs2 = false, Cf = () => {
        if (typeof SharedArrayBuffer > "u") return false;
        try {
          return typeof MessageChannel < "u" && new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)), WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 5, 4, 1, 3, 1, 1, 10, 11, 1, 9, 0, 65, 0, 254, 16, 2, 0, 26, 11]));
        } catch {
          return false;
        }
      }, Af = () => {
        try {
          return WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 30, 1, 28, 0, 65, 0, 253, 15, 253, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 253, 186, 1, 26, 11]));
        } catch {
          return false;
        }
      }, Ef = () => {
        try {
          return WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 19, 1, 17, 0, 65, 1, 253, 15, 65, 2, 253, 15, 65, 3, 253, 15, 253, 147, 2, 11]));
        } catch {
          return false;
        }
      }, Er = async (t) => {
        if (eo) return Promise.resolve();
        if (Rr) throw new Error("multiple calls to 'initializeWebAssembly()' detected.");
        if (vs2) throw new Error("previous call to 'initializeWebAssembly()' failed.");
        Rr = true;
        let e = t.initTimeout, r = t.numThreads;
        if (t.simd !== false) {
          if (t.simd === "relaxed") {
            if (!Ef()) throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.");
          } else if (!Af()) throw new Error("WebAssembly SIMD is not supported in the current environment.");
        }
        let n = Cf();
        r > 1 && !n && (typeof self < "u" && !self.crossOriginIsolated && console.warn("env.wasm.numThreads is set to " + r + ", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."), console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."), t.numThreads = r = 1);
        let o = t.wasmPaths, i = typeof o == "string" ? o : void 0, s = o?.mjs, u = s?.href ?? s, d = o?.wasm, c = d?.href ?? d, p = t.wasmBinary, [m, g] = await ws2(u, i, r > 1, !!p || !!c), y = false, b = [];
        if (e > 0 && b.push(new Promise((_) => {
          setTimeout(() => {
            y = true, _();
          }, e);
        })), b.push(new Promise((_, T) => {
          let x = { numThreads: r };
          if (p) x.wasmBinary = p, x.locateFile = ($2) => $2;
          else if (c || i) x.locateFile = ($2) => c ?? i + $2;
          else if (u && u.indexOf("blob:") !== 0) x.locateFile = ($2) => new URL($2, u).href;
          else if (m) {
            let $2 = bs2();
            $2 && (x.locateFile = (S) => $2 + S);
          }
          g(x).then(($2) => {
            Rr = false, eo = true, Jn = $2, _(), m && URL.revokeObjectURL(m);
          }, ($2) => {
            Rr = false, vs2 = true, T($2);
          });
        })), await Promise.race(b), y) throw new Error(`WebAssembly backend initializing failed due to timeout: ${e}ms`);
      }, ye = () => {
        if (eo && Jn) return Jn;
        throw new Error("WebAssembly is not initialized yet.");
      };
    });
    Ur = V(() => {
      vt();
      Ge = (t, e) => {
        let r = ye(), n = r.lengthBytesUTF8(t) + 1, o = r._malloc(n);
        return r.stringToUTF8(t, o, n), e.push(o), o;
      }, tr2 = (t, e, r, n) => {
        if (typeof t == "object" && t !== null) {
          if (r.has(t)) throw new Error("Circular reference in options");
          r.add(t);
        }
        Object.entries(t).forEach(([o, i]) => {
          let s = e ? e + o : o;
          if (typeof i == "object") tr2(i, s + ".", r, n);
          else if (typeof i == "string" || typeof i == "number") n(s, i.toString());
          else if (typeof i == "boolean") n(s, i ? "1" : "0");
          else throw new Error(`Can't handle extra config type: ${typeof i}`);
        });
      }, me = (t) => {
        let e = ye(), r = e.stackSave();
        try {
          let n = e.PTR_SIZE, o = e.stackAlloc(2 * n);
          e._OrtGetLastError(o, o + n);
          let i = Number(e.getValue(o, n === 4 ? "i32" : "i64")), s = e.getValue(o + n, "*"), u = s ? e.UTF8ToString(s) : "";
          throw new Error(`${t} ERROR_CODE: ${i}, ERROR_MESSAGE: ${u}`);
        } finally {
          e.stackRestore(r);
        }
      };
    });
    xs2 = V(() => {
      vt();
      Ur();
      $s2 = (t) => {
        let e = ye(), r = 0, n = [], o = t || {};
        try {
          if (t?.logSeverityLevel === void 0) o.logSeverityLevel = 2;
          else if (typeof t.logSeverityLevel != "number" || !Number.isInteger(t.logSeverityLevel) || t.logSeverityLevel < 0 || t.logSeverityLevel > 4) throw new Error(`log severity level is not valid: ${t.logSeverityLevel}`);
          if (t?.logVerbosityLevel === void 0) o.logVerbosityLevel = 0;
          else if (typeof t.logVerbosityLevel != "number" || !Number.isInteger(t.logVerbosityLevel)) throw new Error(`log verbosity level is not valid: ${t.logVerbosityLevel}`);
          t?.terminate === void 0 && (o.terminate = false);
          let i = 0;
          return t?.tag !== void 0 && (i = Ge(t.tag, n)), r = e._OrtCreateRunOptions(o.logSeverityLevel, o.logVerbosityLevel, !!o.terminate, i), r === 0 && me("Can't create run options."), t?.extra !== void 0 && tr2(t.extra, "", /* @__PURE__ */ new WeakSet(), (s, u) => {
            let d = Ge(s, n), c = Ge(u, n);
            e._OrtAddRunConfigEntry(r, d, c) !== 0 && me(`Can't set a run config entry: ${s} - ${u}.`);
          }), [r, n];
        } catch (i) {
          throw r !== 0 && e._OrtReleaseRunOptions(r), n.forEach((s) => e._free(s)), i;
        }
      };
    });
    Ts2 = V(() => {
      vt();
      Ur();
      kf = (t) => {
        switch (t) {
          case "disabled":
            return 0;
          case "basic":
            return 1;
          case "extended":
            return 2;
          case "layout":
            return 3;
          case "all":
            return 99;
          default:
            throw new Error(`unsupported graph optimization level: ${t}`);
        }
      }, Pf = (t) => {
        switch (t) {
          case "sequential":
            return 0;
          case "parallel":
            return 1;
          default:
            throw new Error(`unsupported execution mode: ${t}`);
        }
      }, Of = (t) => {
        t.extra || (t.extra = {}), t.extra.session || (t.extra.session = {});
        let e = t.extra.session;
        e.use_ort_model_bytes_directly || (e.use_ort_model_bytes_directly = "1"), t.executionProviders && t.executionProviders.some((r) => (typeof r == "string" ? r : r.name) === "webgpu") && (t.enableMemPattern = false);
      }, Lt2 = (t, e, r, n) => {
        let o = Ge(e, n), i = Ge(r, n);
        ye()._OrtAddSessionConfigEntry(t, o, i) !== 0 && me(`Can't set a session config entry: ${e} - ${r}.`);
      }, zf = async (t, e, r) => {
        let n = e.executionProviders;
        for (let o of n) {
          let i = typeof o == "string" ? o : o.name, s = [];
          switch (i) {
            case "webnn":
              if (i = "WEBNN", Lt2(t, "session.disable_quant_qdq", "1", r), Lt2(t, "session.disable_qdq_constant_folding", "1", r), typeof o != "string") {
                let g = o?.deviceType;
                g && Lt2(t, "deviceType", g, r);
              }
              break;
            case "webgpu":
              if (i = "JS", typeof o != "string") {
                let m = o;
                if (m?.preferredLayout) {
                  if (m.preferredLayout !== "NCHW" && m.preferredLayout !== "NHWC") throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${m.preferredLayout}`);
                  Lt2(t, "preferredLayout", m.preferredLayout, r);
                }
              }
              break;
            case "wasm":
            case "cpu":
              continue;
            default:
              throw new Error(`not supported execution provider: ${i}`);
          }
          let u = Ge(i, r), d = s.length, c = 0, p = 0;
          if (d > 0) {
            c = ye()._malloc(d * ye().PTR_SIZE), r.push(c), p = ye()._malloc(d * ye().PTR_SIZE), r.push(p);
            for (let m = 0; m < d; m++) ye().setValue(c + m * ye().PTR_SIZE, s[m][0], "*"), ye().setValue(p + m * ye().PTR_SIZE, s[m][1], "*");
          }
          await ye()._OrtAppendExecutionProvider(t, u, c, p, d) !== 0 && me(`Can't append execution provider: ${i}.`);
        }
      }, Ss2 = async (t) => {
        let e = ye(), r = 0, n = [], o = t || {};
        Of(o);
        try {
          let i = kf(o.graphOptimizationLevel ?? "all"), s = Pf(o.executionMode ?? "sequential"), u = typeof o.logId == "string" ? Ge(o.logId, n) : 0, d = o.logSeverityLevel ?? 2;
          if (!Number.isInteger(d) || d < 0 || d > 4) throw new Error(`log severity level is not valid: ${d}`);
          let c = o.logVerbosityLevel ?? 0;
          if (!Number.isInteger(c) || c < 0 || c > 4) throw new Error(`log verbosity level is not valid: ${c}`);
          let p = typeof o.optimizedModelFilePath == "string" ? Ge(o.optimizedModelFilePath, n) : 0;
          if (r = e._OrtCreateSessionOptions(i, !!o.enableCpuMemArena, !!o.enableMemPattern, s, !!o.enableProfiling, 0, u, d, c, p), r === 0 && me("Can't create session options."), o.executionProviders && await zf(r, o, n), o.enableGraphCapture !== void 0) {
            if (typeof o.enableGraphCapture != "boolean") throw new Error(`enableGraphCapture must be a boolean value: ${o.enableGraphCapture}`);
            Lt2(r, "enableGraphCapture", o.enableGraphCapture.toString(), n);
          }
          if (o.freeDimensionOverrides) for (let [m, g] of Object.entries(o.freeDimensionOverrides)) {
            if (typeof m != "string") throw new Error(`free dimension override name must be a string: ${m}`);
            if (typeof g != "number" || !Number.isInteger(g) || g < 0) throw new Error(`free dimension override value must be a non-negative integer: ${g}`);
            let y = Ge(m, n);
            e._OrtAddFreeDimensionOverride(r, y, g) !== 0 && me(`Can't set a free dimension override: ${m} - ${g}.`);
          }
          return o.extra !== void 0 && tr2(o.extra, "", /* @__PURE__ */ new WeakSet(), (m, g) => {
            Lt2(r, m, g, n);
          }), [r, n];
        } catch (i) {
          throw r !== 0 && e._OrtReleaseSessionOptions(r) !== 0 && me("Can't release session options."), n.forEach((s) => e._free(s)), i;
        }
      };
    });
    J = V(() => {
      $t = (t) => {
        switch (t) {
          case "int8":
            return 3;
          case "uint8":
            return 2;
          case "bool":
            return 9;
          case "int16":
            return 5;
          case "uint16":
            return 4;
          case "int32":
            return 6;
          case "uint32":
            return 12;
          case "float16":
            return 10;
          case "float32":
            return 1;
          case "float64":
            return 11;
          case "string":
            return 8;
          case "int64":
            return 7;
          case "uint64":
            return 13;
          case "int4":
            return 22;
          case "uint4":
            return 21;
          default:
            throw new Error(`unsupported data type: ${t}`);
        }
      }, rt2 = (t) => {
        switch (t) {
          case 3:
            return "int8";
          case 2:
            return "uint8";
          case 9:
            return "bool";
          case 5:
            return "int16";
          case 4:
            return "uint16";
          case 6:
            return "int32";
          case 12:
            return "uint32";
          case 10:
            return "float16";
          case 1:
            return "float32";
          case 11:
            return "float64";
          case 8:
            return "string";
          case 7:
            return "int64";
          case 13:
            return "uint64";
          case 22:
            return "int4";
          case 21:
            return "uint4";
          default:
            throw new Error(`unsupported data type: ${t}`);
        }
      }, xt2 = (t, e) => {
        let r = [-1, 4, 1, 1, 2, 2, 4, 8, -1, 1, 2, 8, 4, 8, -1, -1, -1, -1, -1, -1, -1, 0.5, 0.5][t], n = typeof e == "number" ? e : e.reduce((o, i) => o * i, 1);
        return r > 0 ? Math.ceil(n * r) : void 0;
      }, Wt = (t) => {
        switch (t) {
          case "float16":
            return typeof Float16Array < "u" ? Float16Array : Uint16Array;
          case "float32":
            return Float32Array;
          case "uint8":
            return Uint8Array;
          case "int8":
            return Int8Array;
          case "uint16":
            return Uint16Array;
          case "int16":
            return Int16Array;
          case "int32":
            return Int32Array;
          case "bool":
            return Uint8Array;
          case "float64":
            return Float64Array;
          case "uint32":
            return Uint32Array;
          case "int64":
            return BigInt64Array;
          case "uint64":
            return BigUint64Array;
          default:
            throw new Error(`unsupported type: ${t}`);
        }
      }, rr2 = (t) => {
        switch (t) {
          case "verbose":
            return 0;
          case "info":
            return 1;
          case "warning":
            return 2;
          case "error":
            return 3;
          case "fatal":
            return 4;
          default:
            throw new Error(`unsupported logging level: ${t}`);
        }
      }, Nr = (t) => t === "float32" || t === "float16" || t === "int32" || t === "int64" || t === "uint32" || t === "uint8" || t === "bool" || t === "uint4" || t === "int4", Vr = (t) => t === "float32" || t === "float16" || t === "int32" || t === "int64" || t === "uint32" || t === "uint64" || t === "int8" || t === "uint8" || t === "bool" || t === "uint4" || t === "int4", to = (t) => {
        switch (t) {
          case "none":
            return 0;
          case "cpu":
            return 1;
          case "cpu-pinned":
            return 2;
          case "texture":
            return 3;
          case "gpu-buffer":
            return 4;
          case "ml-tensor":
            return 5;
          default:
            throw new Error(`unsupported data location: ${t}`);
        }
      };
    });
    ro = V(() => {
      Cr();
      nr2 = async (t) => {
        if (typeof t == "string") {
          let e = await fetch(t);
          if (!e.ok) throw new Error(`failed to load external data file: ${t}`);
          let r = e.headers.get("Content-Length"), n = r ? parseInt(r, 10) : 0;
          if (n < 1073741824) return new Uint8Array(await e.arrayBuffer());
          {
            if (!e.body) throw new Error(`failed to load external data file: ${t}, no response body.`);
            let o = e.body.getReader(), i;
            try {
              i = new ArrayBuffer(n);
            } catch (u) {
              if (u instanceof RangeError) {
                let d = Math.ceil(n / 65536);
                i = new WebAssembly.Memory({ initial: d, maximum: d }).buffer;
              } else throw u;
            }
            let s = 0;
            for (; ; ) {
              let { done: u, value: d } = await o.read();
              if (u) break;
              let c = d.byteLength;
              new Uint8Array(i, s, c).set(d), s += c;
            }
            return new Uint8Array(i, 0, n);
          }
        }
        else return t instanceof Blob ? new Uint8Array(await t.arrayBuffer()) : t instanceof Uint8Array ? t : new Uint8Array(t);
      };
    });
    nt = V(() => {
      J();
      Bf = ["V", "I", "W", "E", "F"], Df = (t, e) => {
        console.log(`[${Bf[t]},${(/* @__PURE__ */ new Date()).toISOString()}]${e}`);
      }, Lr = (t, e) => {
        Is2 = t, Cs2 = e;
      }, Mf = (t, e) => {
        let r = rr2(t), n = rr2(Is2);
        r >= n && Df(r, typeof e == "function" ? e() : e);
      }, ie2 = (...t) => {
        Cs2 && Mf(...t);
      };
    });
    re = V(() => {
      no = class {
        static calcMatMulShape(e, r) {
          return e[1] !== r[0] ? void 0 : [e[0], r[1]];
        }
      }, ot2 = class {
        static calcShape(e, r, n = false) {
          let o = e.length, i = r.length;
          if (o === 0) return r;
          if (i === 0) return e;
          let s = Math.max(e.length, r.length), u = new Array(s);
          if (n) {
            if (o < 2 || i < 2) return;
            let d = no.calcMatMulShape([e[o - 2], e[o - 1]], [r[i - 2], r[i - 1]]);
            if (d === void 0) return;
            [u[s - 2], u[s - 1]] = d;
          }
          for (let d = n ? 3 : 1; d <= s; d++) {
            let c = o - d < 0 ? 1 : e[o - d], p = i - d < 0 ? 1 : r[i - d];
            if (c !== p && c > 1 && p > 1) return;
            let m = Math.max(c, p);
            if (c && p) u[s - d] = Math.max(c, p);
            else {
              if (m > 1) return;
              u[s - d] = 0;
            }
          }
          return u;
        }
        static isValidBroadcast(e, r) {
          let n = e.length, o = r.length;
          if (n > o) return false;
          for (let i = 1; i <= n; i++) if (e[n - i] !== 1 && e[n - i] !== r[o - i]) return false;
          return true;
        }
      }, k2 = class t {
        static size(e) {
          return t.getSizeFromDimensionRange(e, 0, e.length);
        }
        static convertShape(e, r = 4) {
          let n = e.length;
          if (n === 0) return [];
          let o = new Array(n), i = n - 1;
          for (; i >= 0; ) {
            if (e[i] % r === 0) {
              o[i] = e[i] / r;
              break;
            }
            if (r % e[i] !== 0) throw new Error("cannot convert shape");
            o[i] = 1, r /= e[i], i--;
          }
          for (i--; i >= 0; i--) o[i] = e[i];
          return o;
        }
        static sizeFromDimension(e, r) {
          if (r < 0 || r > e.length) throw new Error(`invalid dimension of ${r} for sizeFromDimension as Tensor has ${e.length} dimensions.`);
          return t.getSizeFromDimensionRange(e, r, e.length);
        }
        static sizeToDimension(e, r) {
          if (r < 0 || r > e.length) throw new Error(`invalid dimension of ${r} for sizeToDimension as Tensor has ${e.length} dimensions.`);
          return t.getSizeFromDimensionRange(e, 0, r);
        }
        static getSizeFromDimensionRange(e, r, n) {
          let o = 1;
          for (let i = r; i < n; i++) {
            if (e[i] < 0) throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");
            o *= Number(e[i]);
          }
          return o;
        }
        static computeStrides(e) {
          let r = e.length;
          if (r === 0) return [];
          if (r === 1) return [1];
          let n = new Array(r);
          n[r - 1] = 1, n[r - 2] = e[r - 1];
          for (let o = r - 3; o >= 0; --o) n[o] = n[o + 1] * e[o + 1];
          return n;
        }
        static normalizeAxis(e, r) {
          if (e < -r && e >= r) throw new Error("unsupported axis for this operation.");
          return e < 0 ? e + r : e;
        }
        static normalizeAxes(e, r) {
          return e.map((n) => this.normalizeAxis(n, r ?? e.length));
        }
        static sortBasedOnPerm(e, r) {
          return r ? r.map((n) => e[n]) : e.slice().reverse();
        }
        static padShape(e, r) {
          let n = e.length;
          return e.map((o, i) => o + r[i] + r[i + n]);
        }
        static areEqual(e, r) {
          return e.length !== r.length ? false : e.every((n, o) => n === r[o]);
        }
      }, zt2 = class t {
        static adjustPoolAttributes(e, r, n, o, i, s) {
          if (!e && n.length !== r.length - 2) throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");
          if (e) for (let u = 0; u < r.length - 2; u++) u >= n.length ? n.push(r[u + 2]) : n[u] = r[u + 2];
          for (let u = 0; u < n.length; u++) if (u < o.length) {
            if (o[u] < 0) throw new Error("strides should be greater than or equal to 1");
          } else o.push(1);
          for (let u = 0; u < n.length; u++) if (u < i.length) {
            if (i[u] < 0) throw new Error("dilations should be greater than or equal to 1");
          } else i.push(1);
          for (let u = 0; u < n.length * 2; u++) if (u < s.length) {
            if (s[u] < 0) throw new Error("pad should be greater than or equal to 1");
          } else s.push(0);
          for (let u = 0; u < n.length; u++) {
            if (n[u] <= 0) throw new Error("kernel shapes need to be greater than 0");
            if (s[u] >= n[u] || s[u + n.length] >= n[u]) throw new Error("pads should be smaller than kernel");
          }
        }
        static adjustPadsBasedOnAutoPad(e, r, n, o, i, s, u) {
          if (u) {
            if (i.length !== 2 * (e.length - 2)) throw new Error("length of pads should be twice the length of data dimensions");
            if (r.length !== e.length - 2) throw new Error("length of strides should be the length of data dimensions");
            if (o.length !== e.length - 2) throw new Error("length of kernel shapes should be the length of data dimensions");
            for (let d = 0; d < e.length - 2; d++) t.adjustPadAndReturnShape(e[d + (s ? 1 : 2)], r[d], n[d], o[d], i, d, d + e.length - 2, u);
          }
        }
        static computePoolOutputShape(e, r, n, o, i, s, u) {
          if (r.length <= 0) throw new Error("input shape must be of size greater than 0");
          let d = [r[0], r[1]];
          return t.computeShapeHelper(e, r, d, n, o, i, s, u), d;
        }
        static computeConvOutputShape(e, r, n, o, i, s, u) {
          if (e.length <= 0 || r.length <= 0) throw new Error("invalid input tensor dims or invalid filter tensor dims");
          let d = [e[0], r[0]];
          return t.computeShapeHelper(false, e, d, n, o, i, s, u), d;
        }
        static computeShapeHelper(e, r, n, o, i, s, u, d) {
          if (e) for (let c = 0; c < r.length - 2; c++) n.push(1);
          else for (let c = 0; c < r.length - 2; c++) n.push(t.adjustPadAndReturnShape(r[c + 2], o[c], i[c], s[c], u, c, c + r.length - 2, d));
        }
        static adjustPadAndReturnShape(e, r, n, o, i, s, u, d) {
          let c = n * (o - 1) + 1;
          if (d && d !== "NOTSET") switch (d) {
            case "VALID":
              return i[s] = 0, i[u] = 0, Math.floor((e - c) / r + 1);
            case "SAME_LOWER":
            case "SAME_UPPER":
              if (n !== 1) throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");
              {
                let m = ((e + r - 1) / r - 1) * r + o - e;
                return i[s] = Math.floor(d === "SAME_LOWER" ? (m + 1) / 2 : m / 2), i[u] = m - i[s], Math.floor((e + m - o) / r + 1);
              }
            default:
              throw new Error("Unsupported AutoPad type");
          }
          else return Math.floor((e + i[s] + i[u] - c) / r + 1);
        }
      }, Wr = class {
        static getShapeOfGemmResult(e, r, n, o, i) {
          if (e.length !== 2 || n.length !== 2) throw new Error("shape need to be of size 2");
          let s, u, d;
          r ? (s = e[1], u = e[0]) : (s = e[0], u = e[1]);
          let c = -1;
          if (o ? (d = n[0], c = 1) : (d = n[1], c = 0), n[c] !== u) throw new Error("dimension mismatch");
          if (s <= 0 || d <= 0 || u <= 0) throw new Error("invalid shape specified");
          if (i && !ot2.isValidBroadcast(i, [s, d])) throw new Error("gemm: invalid bias shape for broadcast");
          return [s, d, u];
        }
      }, As2 = -34028234663852886e22, Es2 = 34028234663852886e22;
    });
    oo = V(() => {
      J();
      Gr = (t, e) => new (Wt(e))(t);
    });
    Ds2 = V(() => {
      J();
      nt();
      Ps2 = /* @__PURE__ */ new Map([["float32", 32], ["float16", 16], ["int32", 32], ["uint32", 32], ["int64", 64], ["uint64", 64], ["int8", 8], ["uint8", 8], ["int4", 4], ["uint4", 4]]), ao = (t, e) => {
        if (e === "int32") return t;
        let r = Ps2.get(e);
        if (!r) throw new Error(`WebNN backend does not support data type: ${e}`);
        let n = r / 8;
        if (t.byteLength % n !== 0) throw new Error(`Invalid Uint8Array length - must be a multiple of ${n}.`);
        let o = t.byteLength / n, i = new (Wt(e))(t.buffer, t.byteOffset, o);
        switch (e) {
          case "int64":
          case "uint64": {
            let s = new Int32Array(o);
            for (let u = 0; u < o; u++) {
              let d = i[u];
              if (d > 2147483647n || d < -2147483648n) throw new Error("Can not convert int64 data to int32 - value out of range.");
              s[u] = Number(d);
            }
            return new Uint8Array(s.buffer);
          }
          case "int8":
          case "uint8":
          case "uint32": {
            if (e === "uint32" && i.some((u) => u > 2147483647)) throw new Error("Can not convert uint32 data to int32 - value out of range.");
            let s = Int32Array.from(i, Number);
            return new Uint8Array(s.buffer);
          }
          default:
            throw new Error(`Unsupported data conversion from ${e} to 'int32'`);
        }
      }, Os2 = (t, e) => {
        if (e === "int32") return t;
        if (t.byteLength % 4 !== 0) throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");
        let r = t.byteLength / 4, n = new Int32Array(t.buffer, t.byteOffset, r);
        switch (e) {
          case "int64": {
            let o = BigInt64Array.from(n, BigInt);
            return new Uint8Array(o.buffer);
          }
          case "uint64": {
            if (n.some((i) => i < 0)) throw new Error("Can not convert int32 data to uin64 - negative value found.");
            let o = BigUint64Array.from(n, BigInt);
            return new Uint8Array(o.buffer);
          }
          case "int8": {
            if (n.some((i) => i < -128 || i > 127)) throw new Error("Can not convert int32 data to int8 - value out of range.");
            let o = Int8Array.from(n, Number);
            return new Uint8Array(o.buffer);
          }
          case "uint8": {
            if (n.some((o) => o < 0 || o > 255)) throw new Error("Can not convert int32 data to uint8 - value out of range.");
            return Uint8Array.from(n, Number);
          }
          case "uint32": {
            if (n.some((i) => i < 0)) throw new Error("Can not convert int32 data to uint32 - negative value found.");
            let o = Uint32Array.from(n, Number);
            return new Uint8Array(o.buffer);
          }
          default:
            throw new Error(`Unsupported data conversion from 'int32' to ${e}`);
        }
      }, Rf = 1, ks2 = () => Rf++, Uf = /* @__PURE__ */ new Map([["int8", "int32"], ["uint8", "int32"], ["uint32", "int32"], ["int64", "int32"]]), zs = (t, e) => {
        let r = Ps2.get(t);
        if (!r) throw new Error(`WebNN backend does not support data type: ${t}`);
        return e.length > 0 ? Math.ceil(e.reduce((n, o) => n * o) * r / 8) : 0;
      }, Hr2 = class {
        constructor(e) {
          this.isDataConverted = false;
          let { sessionId: r, context: n, tensor: o, dataType: i, shape: s, fallbackDataType: u } = e;
          this.sessionId = r, this.mlContext = n, this.mlTensor = o, this.dataType = i, this.tensorShape = s, this.fallbackDataType = u;
        }
        get tensor() {
          return this.mlTensor;
        }
        get type() {
          return this.dataType;
        }
        get fallbackType() {
          return this.fallbackDataType;
        }
        get shape() {
          return this.tensorShape;
        }
        get byteLength() {
          return zs(this.dataType, this.tensorShape);
        }
        destroy() {
          ie2("verbose", () => "[WebNN] TensorWrapper.destroy"), this.mlTensor.destroy();
        }
        write(e) {
          this.mlContext.writeTensor(this.mlTensor, e);
        }
        async read(e) {
          if (this.fallbackDataType) {
            let r = await this.mlContext.readTensor(this.mlTensor), n = Os2(new Uint8Array(r), this.dataType);
            if (e) {
              (e instanceof ArrayBuffer ? new Uint8Array(e) : new Uint8Array(e.buffer, e.byteOffset, e.byteLength)).set(n);
              return;
            } else return new Uint8Array(n).buffer;
          } else return e ? this.mlContext.readTensor(this.mlTensor, e) : this.mlContext.readTensor(this.mlTensor);
        }
        canReuseTensor(e, r, n) {
          return this.mlContext === e && this.dataType === r && this.tensorShape.length === n.length && this.tensorShape.every((o, i) => o === n[i]);
        }
        setIsDataConverted(e) {
          this.isDataConverted = e;
        }
      }, Fr = class {
        constructor(e, r) {
          this.tensorManager = e;
          this.wrapper = r;
        }
        get tensorWrapper() {
          return this.wrapper;
        }
        releaseTensor() {
          this.tensorWrapper && (this.tensorManager.releaseTensor(this.tensorWrapper), this.wrapper = void 0);
        }
        async ensureTensor(e, r, n, o) {
          let i = this.tensorManager.getMLContext(e), s = this.tensorManager.getMLOpSupportLimits(e), u;
          if (!s?.input.dataTypes.includes(r)) {
            if (u = Uf.get(r), !u || s?.input.dataTypes.includes(u)) throw new Error(`WebNN backend does not support data type: ${r}`);
            ie2("verbose", () => `[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${r} to ${u}`);
          }
          if (this.wrapper) {
            if (this.wrapper.canReuseTensor(i, r, n)) return this.wrapper.tensor;
            if (o) {
              if (this.wrapper.byteLength !== zs(r, n)) throw new Error("Unable to copy data to tensor with different size.");
              this.activeUpload = new Uint8Array(await this.wrapper.read());
            }
            this.tensorManager.releaseTensor(this.wrapper);
          }
          let d = typeof MLTensorUsage > "u" ? void 0 : MLTensorUsage.READ | MLTensorUsage.WRITE;
          return this.wrapper = await this.tensorManager.getCachedTensor(e, r, n, d, true, true, u), o && this.activeUpload && (this.wrapper.write(this.activeUpload), this.activeUpload = void 0), this.wrapper.tensor;
        }
        upload(e) {
          let r = e;
          if (this.wrapper) {
            if (this.wrapper.fallbackType) if (this.wrapper.fallbackType === "int32") r = ao(e, this.wrapper.type), this.wrapper.setIsDataConverted(true);
            else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);
            if (e.byteLength === this.wrapper.byteLength) {
              this.wrapper.write(r);
              return;
            } else ie2("verbose", () => "Data size does not match tensor size. Releasing tensor."), this.releaseTensor();
          }
          this.activeUpload ? this.activeUpload.set(r) : this.activeUpload = new Uint8Array(r);
        }
        async download(e) {
          if (this.activeUpload) {
            let r = this.wrapper?.isDataConverted ? Os2(this.activeUpload, this.wrapper?.type) : this.activeUpload;
            if (e) {
              e instanceof ArrayBuffer ? new Uint8Array(e).set(r) : new Uint8Array(e.buffer, e.byteOffset, e.byteLength).set(r);
              return;
            } else return r.buffer;
          }
          if (!this.wrapper) throw new Error("Tensor has not been created.");
          return e ? this.wrapper.read(e) : this.wrapper.read();
        }
      }, io = class {
        constructor(e) {
          this.backend = e;
          this.tensorTrackersById = /* @__PURE__ */ new Map();
          this.freeTensors = [];
          this.externalTensors = /* @__PURE__ */ new Set();
        }
        getMLContext(e) {
          let r = this.backend.getMLContext(e);
          if (!r) throw new Error("MLContext not found for session.");
          return r;
        }
        getMLOpSupportLimits(e) {
          return this.backend.getMLOpSupportLimits(e);
        }
        reserveTensorId() {
          let e = ks2();
          return this.tensorTrackersById.set(e, new Fr(this)), e;
        }
        releaseTensorId(e) {
          let r = this.tensorTrackersById.get(e);
          r && (this.tensorTrackersById.delete(e), r.tensorWrapper && this.releaseTensor(r.tensorWrapper));
        }
        async ensureTensor(e, r, n, o, i) {
          ie2("verbose", () => `[WebNN] TensorManager.ensureTensor {tensorId: ${r}, dataType: ${n}, shape: ${o}, copyOld: ${i}}`);
          let s = this.tensorTrackersById.get(r);
          if (!s) throw new Error("Tensor not found.");
          return s.ensureTensor(e, n, o, i);
        }
        upload(e, r) {
          let n = this.tensorTrackersById.get(e);
          if (!n) throw new Error("Tensor not found.");
          n.upload(r);
        }
        async download(e, r) {
          ie2("verbose", () => `[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${r?.byteLength}}`);
          let n = this.tensorTrackersById.get(e);
          if (!n) throw new Error("Tensor not found.");
          return n.download(r);
        }
        releaseTensorsForSession(e) {
          for (let r of this.freeTensors) r.sessionId === e && r.destroy();
          this.freeTensors = this.freeTensors.filter((r) => r.sessionId !== e);
        }
        registerTensor(e, r, n, o) {
          let i = this.getMLContext(e), s = ks2(), u = new Hr2({ sessionId: e, context: i, tensor: r, dataType: n, shape: o });
          return this.tensorTrackersById.set(s, new Fr(this, u)), this.externalTensors.add(u), s;
        }
        async getCachedTensor(e, r, n, o, i, s, u) {
          let d = this.getMLContext(e);
          for (let [p, m] of this.freeTensors.entries()) if (m.canReuseTensor(d, r, n)) {
            ie2("verbose", () => `[WebNN] Reusing tensor {dataType: ${r}, ${u ? `fallbackDataType: ${u},` : ""} shape: ${n}`);
            let g = this.freeTensors.splice(p, 1)[0];
            return g.sessionId = e, g;
          }
          ie2("verbose", () => `[WebNN] MLContext.createTensor {dataType: ${r}, ${u ? `fallbackDataType: ${u},` : ""} shape: ${n}}`);
          let c = await d.createTensor({ dataType: u ?? r, shape: n, dimensions: n, usage: o, writable: i, readable: s });
          return new Hr2({ sessionId: e, context: d, tensor: c, dataType: r, shape: n, fallbackDataType: u });
        }
        releaseTensor(e) {
          this.externalTensors.has(e) && this.externalTensors.delete(e), this.freeTensors.push(e);
        }
      }, Bs2 = (...t) => new io(...t);
    });
    Ms2 = V(() => {
      J();
      vt();
      oo();
      Ds2();
      nt();
      qr2 = /* @__PURE__ */ new Map([[1, "float32"], [10, "float16"], [6, "int32"], [12, "uint32"], [7, "int64"], [13, "uint64"], [22, "int4"], [21, "uint4"], [3, "int8"], [2, "uint8"], [9, "uint8"]]), Nf = (t, e) => {
        if (t === e) return true;
        if (t === void 0 || e === void 0) return false;
        let r = Object.keys(t).sort(), n = Object.keys(e).sort();
        return r.length === n.length && r.every((o, i) => o === n[i] && t[o] === e[o]);
      }, Kr2 = class {
        constructor(e) {
          this.tensorManager = Bs2(this);
          this.mlContextBySessionId = /* @__PURE__ */ new Map();
          this.sessionIdsByMLContext = /* @__PURE__ */ new Map();
          this.mlContextCache = [];
          this.sessionGraphInputs = /* @__PURE__ */ new Map();
          this.sessionGraphOutputs = /* @__PURE__ */ new Map();
          this.temporaryGraphInputs = [];
          this.temporaryGraphOutputs = [];
          this.temporarySessionTensorIds = /* @__PURE__ */ new Map();
          this.mlOpSupportLimitsBySessionId = /* @__PURE__ */ new Map();
          Lr(e.logLevel, !!e.debug);
        }
        get currentSessionId() {
          if (this.activeSessionId === void 0) throw new Error("No active session");
          return this.activeSessionId;
        }
        onRunStart(e) {
          ie2("verbose", () => `[WebNN] onRunStart {sessionId: ${e}}`), this.activeSessionId = e;
        }
        onRunEnd(e) {
          ie2("verbose", () => `[WebNN] onRunEnd {sessionId: ${e}}`);
          let r = this.temporarySessionTensorIds.get(e);
          if (r) {
            for (let n of r) ie2("verbose", () => `[WebNN] releasing temporary tensor {tensorId: ${n}}`), this.tensorManager.releaseTensorId(n);
            this.temporarySessionTensorIds.delete(e), this.activeSessionId = void 0;
          }
        }
        async createMLContext(e) {
          if (e instanceof GPUDevice) {
            let n = this.mlContextCache.findIndex((o) => o.gpuDevice === e);
            if (n !== -1) return this.mlContextCache[n].mlContext;
            {
              let o = await navigator.ml.createContext(e);
              return this.mlContextCache.push({ gpuDevice: e, mlContext: o }), o;
            }
          } else if (e === void 0) {
            let n = this.mlContextCache.findIndex((o) => o.options === void 0 && o.gpuDevice === void 0);
            if (n !== -1) return this.mlContextCache[n].mlContext;
            {
              let o = await navigator.ml.createContext();
              return this.mlContextCache.push({ mlContext: o }), o;
            }
          }
          let r = this.mlContextCache.findIndex((n) => Nf(n.options, e));
          if (r !== -1) return this.mlContextCache[r].mlContext;
          {
            let n = await navigator.ml.createContext(e);
            return this.mlContextCache.push({ options: e, mlContext: n }), n;
          }
        }
        registerMLContext(e, r) {
          this.mlContextBySessionId.set(e, r);
          let n = this.sessionIdsByMLContext.get(r);
          n || (n = /* @__PURE__ */ new Set(), this.sessionIdsByMLContext.set(r, n)), n.add(e), this.mlOpSupportLimitsBySessionId.has(e) || this.mlOpSupportLimitsBySessionId.set(e, r.opSupportLimits()), this.temporaryGraphInputs.length > 0 && (this.sessionGraphInputs.set(e, this.temporaryGraphInputs), this.temporaryGraphInputs = []), this.temporaryGraphOutputs.length > 0 && (this.sessionGraphOutputs.set(e, this.temporaryGraphOutputs), this.temporaryGraphOutputs = []);
        }
        onReleaseSession(e) {
          this.sessionGraphInputs.delete(e), this.sessionGraphOutputs.delete(e);
          let r = this.mlContextBySessionId.get(e);
          if (!r) return;
          this.tensorManager.releaseTensorsForSession(e), this.mlContextBySessionId.delete(e), this.mlOpSupportLimitsBySessionId.delete(e);
          let n = this.sessionIdsByMLContext.get(r);
          if (n.delete(e), n.size === 0) {
            this.sessionIdsByMLContext.delete(r);
            let o = this.mlContextCache.findIndex((i) => i.mlContext === r);
            o !== -1 && this.mlContextCache.splice(o, 1);
          }
        }
        getMLContext(e) {
          return this.mlContextBySessionId.get(e);
        }
        getMLOpSupportLimits(e) {
          return this.mlOpSupportLimitsBySessionId.get(e);
        }
        reserveTensorId() {
          return this.tensorManager.reserveTensorId();
        }
        releaseTensorId(e) {
          ie2("verbose", () => `[WebNN] releaseTensorId {tensorId: ${e}}`), this.tensorManager.releaseTensorId(e);
        }
        async ensureTensor(e, r, n, o, i) {
          let s = qr2.get(n);
          if (!s) throw new Error(`Unsupported ONNX data type: ${n}`);
          return this.tensorManager.ensureTensor(e ?? this.currentSessionId, r, s, o, i);
        }
        async createTemporaryTensor(e, r, n) {
          ie2("verbose", () => `[WebNN] createTemporaryTensor {onnxDataType: ${r}, shape: ${n}}`);
          let o = qr2.get(r);
          if (!o) throw new Error(`Unsupported ONNX data type: ${r}`);
          let i = this.tensorManager.reserveTensorId();
          await this.tensorManager.ensureTensor(e, i, o, n, false);
          let s = this.temporarySessionTensorIds.get(e);
          return s ? s.push(i) : this.temporarySessionTensorIds.set(e, [i]), i;
        }
        uploadTensor(e, r) {
          if (!ye().shouldTransferToMLTensor) throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");
          ie2("verbose", () => `[WebNN] uploadTensor {tensorId: ${e}, data: ${r.byteLength}}`), this.tensorManager.upload(e, r);
        }
        async downloadTensor(e, r) {
          return this.tensorManager.download(e, r);
        }
        createMLTensorDownloader(e, r) {
          return async () => {
            let n = await this.tensorManager.download(e);
            return Gr(n, r);
          };
        }
        registerMLTensor(e, r, n, o) {
          let i = qr2.get(n);
          if (!i) throw new Error(`Unsupported ONNX data type: ${n}`);
          let s = this.tensorManager.registerTensor(e, r, i, o);
          return ie2("verbose", () => `[WebNN] registerMLTensor {tensor: ${r}, dataType: ${i}, dimensions: ${o}} -> {tensorId: ${s}}`), s;
        }
        registerMLConstant(e, r, n, o, i, s, u = false) {
          if (!s) throw new Error("External mounted files are not available.");
          let d = e;
          e.startsWith("./") && (d = e.substring(2));
          let c = s.get(d);
          if (!c) throw new Error(`File with name ${d} not found in preloaded files.`);
          if (r + n > c.byteLength) throw new Error("Out of bounds: data offset and length exceed the external file data size.");
          let p = c.slice(r, r + n).buffer, m;
          switch (i.dataType) {
            case "float32":
              m = new Float32Array(p);
              break;
            case "float16":
              m = typeof Float16Array < "u" ? new Float16Array(p) : new Uint16Array(p);
              break;
            case "int32":
              m = new Int32Array(p);
              break;
            case "uint32":
              m = new Uint32Array(p);
              break;
            case "int64":
              if (u) {
                let g = ao(new Uint8Array(p), "int64");
                m = new Int32Array(g.buffer), i.dataType = "int32";
              } else m = new BigInt64Array(p);
              break;
            case "uint64":
              m = new BigUint64Array(p);
              break;
            case "int8":
              m = new Int8Array(p);
              break;
            case "int4":
            case "uint4":
            case "uint8":
              m = new Uint8Array(p);
              break;
            default:
              throw new Error(`Unsupported data type: ${i.dataType} in creating WebNN Constant from external data.`);
          }
          return ie2("verbose", () => `[WebNN] registerMLConstant {dataType: ${i.dataType}, shape: ${i.shape}}} ${u ? "(Note: it was int64 data type and registered to int32 as workaround)" : ""}`), o.constant(i, m);
        }
        registerGraphInput(e) {
          this.temporaryGraphInputs.push(e);
        }
        registerGraphOutput(e) {
          this.temporaryGraphOutputs.push(e);
        }
        isGraphInput(e, r) {
          let n = this.sessionGraphInputs.get(e);
          return n ? n.includes(r) : false;
        }
        isGraphOutput(e, r) {
          let n = this.sessionGraphOutputs.get(e);
          return n ? n.includes(r) : false;
        }
        isGraphInputOutputTypeSupported(e, r, n = true) {
          let o = qr2.get($t(r)), i = this.mlOpSupportLimitsBySessionId.get(e);
          return typeof o > "u" ? false : n ? !!i?.input.dataTypes.includes(o) : !!i?.output.dataTypes.includes(o);
        }
        flush() {
        }
      };
    });
    jr = V(() => {
    });
    Ls2 = V(() => {
      nt();
      jr();
      Rs2 = /* @__PURE__ */ new Map([[64, 250], [128, 200], [256, 200], [512, 200], [2048, 230], [4096, 200], [8192, 50], [16384, 50], [32768, 50], [65536, 50], [131072, 50], [262144, 50], [524288, 50], [1048576, 50], [2097152, 30], [4194304, 20], [8388608, 10], [12582912, 10], [16777216, 10], [26214400, 15], [33554432, 22], [44236800, 2], [58982400, 6], [67108864, 6], [134217728, 6], [167772160, 6]]), so = [], uo = (t) => Math.ceil(Number(t) / 16) * 16, Vf = (t) => {
        for (let e = 0; e < so.length; e++) {
          let r = so[e];
          if (t <= r) return r;
        }
        return Math.ceil(t / 16) * 16;
      }, Lf = 1, Us2 = () => Lf++, co = async (t, e, r, n) => {
        let o = uo(r), i = t.device.createBuffer({ size: o, usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ });
        try {
          let s = t.getCommandEncoder();
          t.endComputePass(), s.copyBufferToBuffer(e, 0, i, 0, o), t.flush(), await i.mapAsync(GPUMapMode.READ);
          let u = i.getMappedRange();
          if (n) {
            let d = n();
            return d.set(new Uint8Array(u, 0, r)), d;
          } else return new Uint8Array(u.slice(0, r));
        } finally {
          i.destroy();
        }
      }, lo = class {
        constructor(e) {
          this.backend = e;
          this.storageCache = /* @__PURE__ */ new Map(), this.freeBuffers = /* @__PURE__ */ new Map(), this.freeUniformBuffers = /* @__PURE__ */ new Map(), this.buffersPending = [], this.capturedPendingBuffers = /* @__PURE__ */ new Map();
          for (let [r] of Rs2) so.push(r), this.freeBuffers.set(r, []), this.freeUniformBuffers.set(r, []);
          this.sessionCount = 0;
        }
        upload(e, r) {
          let n = r.buffer, o = r.byteOffset, i = r.byteLength, s = uo(i), u = this.storageCache.get(e);
          if (!u) throw new Error("gpu data for uploading does not exist");
          if (Number(u.originalSize) !== i) throw new Error(`inconsistent data size. gpu data size=${u.originalSize}, data size=${i}`);
          let d = this.backend.device.createBuffer({ mappedAtCreation: true, size: s, usage: GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC }), c = d.getMappedRange();
          new Uint8Array(c).set(new Uint8Array(n, o, i)), d.unmap();
          let p = this.backend.device.createCommandEncoder();
          p.copyBufferToBuffer(d, 0, u.gpuData.buffer, 0, s), this.backend.device.queue.submit([p.finish()]), d.destroy(), ie2("verbose", () => `[WebGPU] GpuDataManager.upload(id=${e})`);
        }
        memcpy(e, r) {
          let n = this.storageCache.get(e);
          if (!n) throw new Error("source gpu data for memcpy does not exist");
          let o = this.storageCache.get(r);
          if (!o) throw new Error("destination gpu data for memcpy does not exist");
          if (n.originalSize !== o.originalSize) throw new Error("inconsistent source and destination gpu data size");
          let i = uo(n.originalSize), s = this.backend.getCommandEncoder();
          this.backend.endComputePass(), s.copyBufferToBuffer(n.gpuData.buffer, 0, o.gpuData.buffer, 0, i);
        }
        registerExternalBuffer(e, r, n) {
          let o;
          if (n) {
            if (o = n[0], e === n[1]) return ie2("verbose", () => `[WebGPU] GpuDataManager.registerExternalBuffer(size=${r}) => id=${o}, buffer is the same, skip.`), o;
            if (this.backend.capturedCommandList.has(this.backend.currentSessionId)) throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`);
          } else o = Us2();
          return this.storageCache.set(o, { gpuData: { id: o, type: 0, buffer: e }, originalSize: r }), ie2("verbose", () => `[WebGPU] GpuDataManager.registerExternalBuffer(size=${r}) => id=${o}, registered.`), o;
        }
        unregisterExternalBuffer(e) {
          e !== void 0 && (this.storageCache.delete(e), ie2("verbose", () => `[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`));
        }
        create(e, r = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST) {
          let n = Vf(e), o, i = (r & GPUBufferUsage.STORAGE) === GPUBufferUsage.STORAGE, s = (r & GPUBufferUsage.UNIFORM) === GPUBufferUsage.UNIFORM;
          if (i || s) {
            let c = (i ? this.freeBuffers : this.freeUniformBuffers).get(n);
            c ? c.length > 0 ? o = c.pop() : o = this.backend.device.createBuffer({ size: n, usage: r }) : o = this.backend.device.createBuffer({ size: n, usage: r });
          } else o = this.backend.device.createBuffer({ size: n, usage: r });
          let u = { id: Us2(), type: 0, buffer: o };
          return this.storageCache.set(u.id, { gpuData: u, originalSize: Number(e) }), ie2("verbose", () => `[WebGPU] GpuDataManager.create(size=${e}) => id=${u.id}`), u;
        }
        get(e) {
          return this.storageCache.get(e)?.gpuData;
        }
        release(e) {
          let r = typeof e == "bigint" ? Number(e) : e, n = this.storageCache.get(r);
          if (!n) {
            if (this.storageCache.size === 0) return 0;
            throw new Error("releasing data does not exist");
          }
          return ie2("verbose", () => `[WebGPU] GpuDataManager.release(id=${r}), gpuDataId=${n.gpuData.id}`), this.storageCache.delete(r), this.buffersPending.push(n.gpuData.buffer), n.originalSize;
        }
        async download(e, r) {
          let n = this.storageCache.get(Number(e));
          if (!n) throw new Error("data does not exist");
          await co(this.backend, n.gpuData.buffer, n.originalSize, r);
        }
        refreshPendingBuffers() {
          if (this.buffersPending.length !== 0) if (this.backend.sessionStatus === "default") {
            for (let e of this.buffersPending) {
              let r = Rs2.get(e.size);
              if ((e.usage & GPUBufferUsage.STORAGE) === GPUBufferUsage.STORAGE) {
                let n = this.freeBuffers.get(e.size) || [];
                r === void 0 || n.length >= r ? e.destroy() : n.push(e);
              } else if ((e.usage & GPUBufferUsage.UNIFORM) === GPUBufferUsage.UNIFORM) {
                let n = this.freeUniformBuffers.get(e.size) || [];
                r === void 0 || n.length >= r ? e.destroy() : n.push(e);
              } else e.destroy();
            }
            this.buffersPending = [];
          } else {
            let e = this.capturedPendingBuffers.get(this.backend.currentSessionId);
            e || (e = [], this.capturedPendingBuffers.set(this.backend.currentSessionId, e));
            for (let r of this.buffersPending) e.push(r);
            this.buffersPending = [];
          }
        }
        dispose() {
          this.freeBuffers.forEach((e) => {
            e.forEach((r) => {
              r.destroy();
            });
          }), this.freeUniformBuffers.forEach((e) => {
            e.forEach((r) => {
              r.destroy();
            });
          }), this.storageCache.forEach((e) => {
            e.gpuData.buffer.destroy();
          }), this.capturedPendingBuffers.forEach((e) => {
            e.forEach((r) => {
              r.destroy();
            });
          }), this.storageCache = /* @__PURE__ */ new Map(), this.freeBuffers = /* @__PURE__ */ new Map(), this.freeUniformBuffers = /* @__PURE__ */ new Map(), this.capturedPendingBuffers = /* @__PURE__ */ new Map();
        }
        onCreateSession() {
          this.sessionCount += 1;
        }
        onReleaseSession(e) {
          let r = this.capturedPendingBuffers.get(e);
          r && (r.forEach((n) => {
            n.destroy();
          }), this.capturedPendingBuffers.delete(e)), this.sessionCount -= 1, this.sessionCount === 0 && (ie2("warning", () => "[WebGPU] Clearing webgpu buffer cache"), this.storageCache.forEach((n) => {
            n.gpuData.buffer.destroy();
          }), this.storageCache = /* @__PURE__ */ new Map());
        }
      }, Vs = (...t) => new lo(...t);
    });
    Ce = V(() => {
      po = class {
        constructor(e) {
          Object.assign(this, e);
        }
        get cacheKey() {
          return this.key || (this.key = Object.getOwnPropertyNames(this).sort().map((e) => `${this[e]}`).join(";")), this.key;
        }
      }, ee = (t) => new po(t);
    });
    oe = V(() => {
      J();
      re();
      Bt2 = 64, fo = (t, e) => {
        if (e === 3) throw new Error("vec3 has same alignment as vec4, use vec4 instead");
        switch (Number(t)) {
          case 10:
            return e > 1 ? `vec${e}<f16>` : "f16";
          case 1:
            return e > 1 ? `vec${e}<f32>` : "f32";
          case 6:
            return e > 1 ? `vec${e}<i32>` : "i32";
          case 12:
            return e > 1 ? `vec${e}<u32>` : "u32";
          case 7:
            if (e > 1) throw new Error("currently not supported vecX of uint64 yet");
            return ["vec2<u32>", "i32"];
          case 13:
            if (e > 1) throw new Error("currently not supported vecX of uint64 yet");
            return ["vec2<u32>", "u32"];
          case 9:
            if (e !== 4) throw new Error("bool must be vec4");
            return ["u32", "vec4<bool>"];
          case 22:
            return "i32";
          case 21:
            return "u32";
          default:
            throw new Error(`Unknown data type: ${t}`);
        }
      }, we = (t, e = 1) => {
        let r = fo(t, e);
        return typeof r == "string" ? r : r[0];
      }, ze2 = (t, e = 1) => {
        let r = fo(t, e);
        return typeof r == "string" ? r : r[1];
      }, W = (...t) => {
        let e = [];
        return t.forEach((r) => {
          r.length !== 0 && e.push({ type: 12, data: r }, { type: 12, data: k2.computeStrides(r) });
        }), e;
      }, fe = (t) => t % 4 === 0 ? 4 : t % 2 === 0 ? 2 : 1, ho = (t = "f32", e, r = "0") => !e || e === 1 ? `${t}(${r})` : `vec${e}<${t}>(${r})`, Dt = (t, e, r) => t === "f32" ? r : e === 1 ? `f32(${r})` : `vec${e}<f32>(${r})`, Ze = (t, e) => e === 4 ? `(${t}.x + ${t}.y + ${t}.z + ${t}.w)` : e === 2 ? `(${t}.x + ${t}.y)` : e === 3 ? `(${t}.x + ${t}.y + ${t}.z)` : t, j = (t, e, r, n) => t.startsWith("uniforms.") && r > 4 ? typeof e == "string" ? n === "f16" ? `${t}[(${e}) / 8][(${e}) % 8 / 4][(${e}) % 8 % 4]` : `${t}[(${e}) / 4][(${e}) % 4]` : n === "f16" ? `${t}[${Math.floor(e / 8)}][${Math.floor(e % 8 / 4)}][${e % 8 % 4}]` : `${t}[${Math.floor(e / 4)}][${e % 4}]` : r > 1 ? `${t}[${e}]` : t, Zr2 = (t, e, r, n, o) => {
        let i = typeof r == "number", s = i ? r : r.length, u = [...new Array(s).keys()], d = s < 2 ? "u32" : s <= 4 ? `vec${s}<u32>` : `array<u32, ${s}>`, c = fo(e, o), p = typeof c == "string" ? c : c[1], m = typeof c == "string" ? c : c[0], g = { indices: d, value: p, storage: m, tensor: e }, y = (M) => typeof M == "string" ? M : `${M}u`, b = { offsetToIndices: false, indicesToOffset: false, broadcastedIndicesToOffset: false, set: false, setByIndices: false, get: false, getByIndices: false }, _ = i ? "uniforms." : "", T = `${_}${t}_shape`, x = `${_}${t}_strides`, $2 = "";
        for (let M = 0; M < s - 1; M++) $2 += `
    let dim${M} = current / ${j(x, M, s)};
    let rest${M} = current % ${j(x, M, s)};
    indices[${M}] = dim${M};
    current = rest${M};
    `;
        $2 += `indices[${s - 1}] = current;`;
        let S = s < 2 ? "" : `
  fn o2i_${t}(offset: u32) -> ${g.indices} {
    var indices: ${g.indices};
    var current = offset;
    ${$2}
    return indices;
  }`, I = (M) => (b.offsetToIndices = true, s < 2 ? M : `o2i_${t}(${M})`), E = [];
        if (s >= 2) for (let M = s - 1; M >= 0; M--) E.push(`${j(x, M, s)} * (indices[${M}])`);
        let A = s < 2 ? "" : `
  fn i2o_${t}(indices: ${g.indices}) -> u32 {
    return ${E.join("+")};
  }`, z2 = (M) => (b.indicesToOffset = true, s < 2 ? M : `i2o_${t}(${M})`), v = (...M) => s === 0 ? "0u" : `${g.indices}(${M.map(y).join(",")})`, R = (M, G) => s < 2 ? `${M}` : `${j(M, G, s)}`, N = (M, G, be2) => s < 2 ? `${M}=${be2};` : `${j(M, G, s)}=${be2};`, F = {}, q = (M, G) => {
          b.broadcastedIndicesToOffset = true;
          let be2 = `${G.name}broadcastedIndicesTo${t}Offset`;
          if (be2 in F) return `${be2}(${M})`;
          let Ee2 = [];
          for (let $e2 = s - 1; $e2 >= 0; $e2--) {
            let Pe = G.indicesGet("outputIndices", $e2 + G.rank - s);
            Ee2.push(`${R(x, $e2)} * (${Pe} % ${R(T, $e2)})`);
          }
          return F[be2] = `fn ${be2}(outputIndices: ${G.type.indices}) -> u32 {
             return ${Ee2.length > 0 ? Ee2.join("+") : "0u"};
           }`, `${be2}(${M})`;
        }, X = (M, G) => (() => {
          if (g.storage === g.value) return `${t}[${M}]=${G};`;
          if (g.storage === "vec2<u32>" && g.value === "i32") return `${t}[${M}]=vec2<u32>(u32(${G}), select(0u, 0xFFFFFFFFu, ${G} < 0));`;
          if (g.storage === "vec2<u32>" && g.value === "u32") return `${t}[${M}]=vec2<u32>(u32(${G}), 0u);`;
          if (g.storage === "u32" && g.value === "vec4<bool>") return `${t}[${M}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${G}));`;
          throw new Error(`not supported combination of storage type ${g.storage} and value type ${g.value} yet`);
        })(), B = (M) => (() => {
          if (g.storage === g.value) return `${t}[${M}]`;
          if (g.storage === "vec2<u32>" && g.value === "i32") return `i32(${t}[${M}].x)`;
          if (g.storage === "vec2<u32>" && g.value === "u32") return `u32(${t}[${M}].x)`;
          if (g.storage === "u32" && g.value === "vec4<bool>") return `vec4<bool>(bool(${t}[${M}] & 0xFFu), bool(${t}[${M}] & 0xFF00u), bool(${t}[${M}] & 0xFF0000u), bool(${t}[${M}] & 0xFF000000u))`;
          throw new Error(`not supported combination of storage type ${g.storage} and value type ${g.value} yet`);
        })(), L = s < 2 ? "" : `
  fn get_${t}ByIndices(indices: ${g.indices}) -> ${p} {
    return ${B(`i2o_${t}(indices)`)};
  }`, Q2 = s < 2 ? "" : (() => {
          let M = u.map((be2) => `d${be2}: u32`).join(", "), G = u.map((be2) => `d${be2}`).join(", ");
          return `
  fn get_${t}(${M}) -> ${p} {
    return get_${t}ByIndices(${v(G)});
  }`;
        })(), Y = (...M) => {
          if (M.length !== s) throw new Error(`indices length must be ${s}`);
          let G = M.map(y).join(",");
          return s === 0 ? B("0u") : s === 1 ? B(G[0]) : (b.get = true, b.getByIndices = true, b.indicesToOffset = true, `get_${t}(${G})`);
        }, Z = (M) => s < 2 ? B(M) : (b.getByIndices = true, b.indicesToOffset = true, `get_${t}ByIndices(${M})`), te = s < 2 ? "" : `
  fn set_${t}ByIndices(indices: ${g.indices}, value: ${p}) {
    ${X(`i2o_${t}(indices)`, "value")}
  }`, ae = s < 2 ? "" : (() => {
          let M = u.map((be2) => `d${be2}: u32`).join(", "), G = u.map((be2) => `d${be2}`).join(", ");
          return `
  fn set_${t}(${M}, value: ${p}) {
    set_${t}ByIndices(${v(G)}, value);
  }`;
        })();
        return { impl: () => {
          let M = [], G = false;
          return b.offsetToIndices && (M.push(S), G = true), b.indicesToOffset && (M.push(A), G = true), b.broadcastedIndicesToOffset && (Object.values(F).forEach((be2) => M.push(be2)), G = true), b.set && (M.push(ae), G = true), b.setByIndices && (M.push(te), G = true), b.get && (M.push(Q2), G = true), b.getByIndices && (M.push(L), G = true), !i && G && M.unshift(`const ${T} = ${g.indices}(${r.join(",")});`, `const ${x} = ${g.indices}(${k2.computeStrides(r).join(",")});`), M.join(`
`);
        }, type: g, offsetToIndices: I, indicesToOffset: z2, broadcastedIndicesToOffset: q, indices: v, indicesGet: R, indicesSet: N, set: (...M) => {
          if (M.length !== s + 1) throw new Error(`indices length must be ${s}`);
          let G = M[s];
          if (typeof G != "string") throw new Error("value must be string");
          let be2 = M.slice(0, s).map(y).join(",");
          return s === 0 ? X("0u", G) : s === 1 ? X(be2[0], G) : (b.set = true, b.setByIndices = true, b.indicesToOffset = true, `set_${t}(${be2}, ${G})`);
        }, setByOffset: X, setByIndices: (M, G) => s < 2 ? X(M, G) : (b.setByIndices = true, b.indicesToOffset = true, `set_${t}ByIndices(${M}, ${G});`), get: Y, getByOffset: B, getByIndices: Z, usage: n, name: t, strides: x, shape: T, rank: s };
      }, O = (t, e, r, n = 1) => Zr2(t, e, r, "input", n), U = (t, e, r, n = 1) => Zr2(t, e, r, "output", n), Ws2 = (t, e, r) => Zr2(t, e, r, "atomicOutput", 1), Qr2 = (t, e, r, n = 1) => Zr2(t, e, r, "internal", n), mo = class {
        constructor(e, r) {
          this.normalizedDispatchGroup = e;
          this.limits = r;
          this.internalVariables = [];
          this.variables = [];
          this.uniforms = [];
          this.variableIndex = 0;
        }
        guardAgainstOutOfBoundsWorkgroupSizes(e) {
          return `if (global_idx >= ${typeof e == "number" ? `${e}u` : e}) { return; }`;
        }
        mainStart(e = Bt2) {
          let r = typeof e == "number" ? e : e[0], n = typeof e == "number" ? 1 : e[1], o = typeof e == "number" ? 1 : e[2];
          if (r > this.limits.maxComputeWorkgroupSizeX || n > this.limits.maxComputeWorkgroupSizeY || o > this.limits.maxComputeWorkgroupSizeZ) throw new Error(`workgroup size [${r}, ${n}, ${o}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);
          if (r * n * o > this.limits.maxComputeInvocationsPerWorkgroup) throw new Error(`workgroup size [${r}, ${n}, ${o}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);
          let i = this.normalizedDispatchGroup[1] === 1 && this.normalizedDispatchGroup[2] === 1, s = i ? `@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>` : `@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`, u = i ? `let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;` : `let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${r * n * o}u + local_idx;`;
          return `@compute @workgroup_size(${r}, ${n}, ${o})
  fn main(${s}) {
    ${u}
  `;
        }
        appendVariableUniforms(e) {
          e.rank !== 0 && (e.shape.startsWith("uniforms.") && this.uniforms.push({ name: e.shape.replace("uniforms.", ""), type: "u32", length: e.rank }), e.strides.startsWith("uniforms.") && this.uniforms.push({ name: e.strides.replace("uniforms.", ""), type: "u32", length: e.rank }));
        }
        declareVariable(e, r) {
          if (e.usage === "internal") throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");
          this.variables.push(e), this.appendVariableUniforms(e);
          let n = e.usage === "input" ? "read" : "read_write", o = e.usage === "atomicOutput" ? "atomic<i32>" : e.type.storage;
          return `@group(0) @binding(${r}) var<storage, ${n}> ${e.name}: array<${o}>;`;
        }
        declareVariables(...e) {
          return e.map((r) => this.declareVariable(r, this.variableIndex++)).join(`
`);
        }
        registerInternalVariable(e) {
          if (e.usage !== "internal") throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");
          this.internalVariables.push(e), this.appendVariableUniforms(e);
        }
        registerInternalVariables(...e) {
          return e.forEach((r) => this.registerInternalVariable(r)), this;
        }
        registerUniform(e, r, n = 1) {
          return this.uniforms.push({ name: e, type: r, length: n }), this;
        }
        registerUniforms(e) {
          return this.uniforms = this.uniforms.concat(e), this;
        }
        uniformDeclaration() {
          if (this.uniforms.length === 0) return "";
          let e = [];
          for (let { name: r, type: n, length: o } of this.uniforms) if (o && o > 4) n === "f16" ? e.push(`@align(16) ${r}:array<mat2x4<${n}>, ${Math.ceil(o / 8)}>`) : e.push(`${r}:array<vec4<${n}>, ${Math.ceil(o / 4)}>`);
          else {
            let i = o == null || o === 1 ? n : `vec${o}<${n}>`;
            e.push(`${r}:${i}`);
          }
          return `
      struct Uniforms { ${e.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`;
        }
        get additionalImplementations() {
          return this.uniformDeclaration() + this.variables.map((e) => e.impl()).join(`
`) + this.internalVariables.map((e) => e.impl()).join(`
`);
        }
        get variablesInfo() {
          if (this.uniforms.length === 0) return;
          let e = (r) => [12, 10, 1, 6][["u32", "f16", "f32", "i32"].indexOf(r)];
          return this.uniforms.map((r) => [e(r.type), r.length ?? 1]);
        }
      }, Gs2 = (t, e) => new mo(t, e);
    });
    pt = V(() => {
      J();
      re();
      Ce();
      oe();
      Wf = (t, e) => {
        if (!t || t.length !== 1) throw new Error("Transpose requires 1 input.");
        if (e.length !== 0 && e.length !== t[0].dims.length) throw new Error(`perm size ${e.length} does not match input rank ${t[0].dims.length}`);
      }, Hs = (t, e) => e.length !== 0 ? e : [...new Array(t).keys()].reverse(), Gf = (t, e) => k2.sortBasedOnPerm(t, Hs(t.length, e)), Hf2 = (t, e, r, n) => {
        let o = `fn perm(i: ${n.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`;
        for (let i = 0; i < e; ++i) o += `a[${t[i]}]=i[${i}];`;
        return o += "return a;}";
      }, Ff = (t, e) => {
        let r = [], n = [];
        for (let o = 0; o < t.length; ++o) t[o] !== 1 && r.push(t[o]), t[e[o]] !== 1 && n.push(e[o]);
        return { newShape: r, newPerm: n };
      }, qf2 = (t, e) => {
        let r = 0;
        for (let n = 0; n < t.length; ++n) if (e[t[n]] !== 1) {
          if (t[n] < r) return false;
          r = t[n];
        }
        return true;
      }, Be = (t, e) => {
        let r = t.dataType, n = t.dims.length, o = Hs(n, e), i = Gf(t.dims, o), s = t.dims, u = i, d = n < 2 || qf2(o, t.dims), c;
        if (d) return c = (_) => {
          let T = O("input", r, s, 4), x = U("output", r, u, 4);
          return `
  ${_.registerUniform("output_size", "u32").declareVariables(T, x)}
  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`;
        }, { name: "TransposeCopy", shaderCache: { inputDependencies: ["type"] }, getRunData: () => {
          let _ = k2.size(i);
          return { outputs: [{ dims: i, dataType: t.dataType }], dispatchGroup: { x: Math.ceil(_ / 64 / 4) }, programUniforms: [{ type: 12, data: Math.ceil(_ / 4) }] };
        }, getShaderSource: c };
        let { newShape: p, newPerm: m } = Ff(t.dims, o), g = k2.areEqual(m, [2, 3, 1]), y = k2.areEqual(m, [3, 1, 2]);
        if (p.length === 2 || g || y) {
          s = g ? [p[0], p[1] * p[2]] : y ? [p[0] * p[1], p[2]] : p, u = [s[1], s[0]];
          let _ = 16;
          return c = (T) => {
            let x = O("a", r, s.length), $2 = U("output", r, u.length);
            return `
  ${T.registerUniform("output_size", "u32").declareVariables(x, $2)}
  var<workgroup> tile : array<array<${$2.type.value}, ${_ + 1}>, ${_}>;
  ${T.mainStart([_, _, 1])}
    let stride = (uniforms.output_shape[1] - 1) / ${_} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${_}u + local_id.x;
    let input_row = workgroup_id_x * ${_}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${x.getByIndices(`${x.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${_}u + local_id.x;
    let output_row = workgroup_id_y * ${_}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${$2.setByIndices(`${$2.type.indices}(output_row, output_col)`, "tile[local_id.x][local_id.y]")}
    }
  }`;
          }, { name: "TransposeShared", shaderCache: { inputDependencies: ["type"] }, getRunData: () => {
            let T = k2.size(i);
            return { outputs: [{ dims: i, dataType: t.dataType }], dispatchGroup: { x: Math.ceil(u[1] / _), y: Math.ceil(u[0] / _) }, programUniforms: [{ type: 12, data: T }, ...W(s, u)] };
          }, getShaderSource: c };
        }
        return c = (_) => {
          let T = O("a", r, s.length), x = U("output", r, u.length);
          return `
  ${_.registerUniform("output_size", "u32").declareVariables(T, x)}

  ${Hf2(o, n, T, x)}

  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${x.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${x.setByOffset("global_idx", T.getByIndices("aIndices"))}
  }`;
        }, { name: "Transpose", shaderCache: { hint: `${e}`, inputDependencies: ["rank"] }, getRunData: () => {
          let _ = k2.size(i);
          return { outputs: [{ dims: i, dataType: t.dataType }], dispatchGroup: { x: Math.ceil(_ / 64) }, programUniforms: [{ type: 12, data: _ }, ...W(s, u)] };
        }, getShaderSource: c };
      }, Fs2 = (t, e) => {
        Wf(t.inputs, e.perm), t.compute(Be(t.inputs[0], e.perm));
      }, qs = (t) => ee({ perm: t.perm });
    });
    nu = V(() => {
      J();
      re();
      oe();
      Yr2();
      pt();
      Kf2 = { max: "select(bestValue, candidate, candidate > bestValue)", min: "select(bestValue, candidate, candidate < bestValue)", mean: "bestValue + candidate", sum: "bestValue + candidate", prod: "bestValue * candidate", sumSquare: "bestValue + candidate * candidate", logSumExp: "bestValue + exp(candidate)", l1: "bestValue + abs(candidate)", l2: "bestValue + candidate * candidate", logSum: "bestValue + candidate" }, jf2 = { max: "select(bestValue, candidate, candidate > bestValue)", min: "select(bestValue, candidate, candidate < bestValue)", mean: "bestValue + candidate", sum: "bestValue + candidate", prod: "bestValue * candidate", sumSquare: "bestValue + candidate", logSumExp: "bestValue + candidate", l1: "bestValue + candidate", l2: "bestValue + candidate", logSum: "bestValue + candidate" }, Zf2 = { max: "_A[offset]", min: "_A[offset]", mean: "0", sum: "0", prod: "1", sumSquare: "0", logSumExp: "0", l1: "0", l2: "0", logSum: "0" }, Qf2 = { max: "bestValue", min: "bestValue", sum: "bestValue", prod: "bestValue", sumSquare: "bestValue", logSumExp: "log(bestValue)", l1: "bestValue", l2: "sqrt(bestValue)", logSum: "log(bestValue)" }, Yf2 = (t, e) => {
        let r = [];
        for (let n = e - t; n < e; ++n) r.push(n);
        return r;
      }, Xf2 = (t, e) => {
        let r = [], n = t.length;
        for (let i = 0; i < n; i++) e.indexOf(i) === -1 && r.push(t[i]);
        let o = e.map((i) => t[i]);
        return [r, o];
      }, Jf2 = (t, e) => {
        let r = t.length + e.length, n = [], o = 0;
        for (let i = 0; i < r; i++) e.indexOf(i) === -1 ? n.push(t[o++]) : n.push(1);
        return n;
      }, eh = (t, e) => {
        for (let r = 0; r < t.length; ++r) if (t[t.length - r - 1] !== e - 1 - r) return false;
        return true;
      }, th = (t, e) => {
        let r = [];
        if (!eh(t, e)) {
          for (let n = 0; n < e; ++n) t.indexOf(n) === -1 && r.push(n);
          t.forEach((n) => r.push(n));
        }
        return r;
      }, rh = (t, e, r, n, o, i, s) => {
        let u = r[0].dims, d = k2.size(i), c = k2.size(s), p = O("_A", r[0].dataType, u), m = U("output", o, i), g = 64;
        d === 1 && (g = 256);
        let y = `
          var<workgroup> aBestValues : array<f32, ${g}>;
       `, b = (_) => `
        ${_.registerUniform("reduceSize", "u32").declareVariables(p, m)}
        ${y}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${_.mainStart(g)}

          let outputIndex = global_idx / ${g};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${Zf2[n]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${g}) {
           let candidate = f32(${p.getByOffset("offset + k")});
           bestValue = ${Kf2[n]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${g}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${jf2[n]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${m.setByOffset("outputIndex", `${n === "mean" ? `${m.type.storage}(bestValue / f32(uniforms.reduceSize))` : `${m.type.storage}(${Qf2[n]})`}`)};
         }
        }`;
        return { name: t, shaderCache: { hint: `${e};${g}`, inputDependencies: ["type"] }, getShaderSource: b, getRunData: () => ({ outputs: [{ dims: i, dataType: o }], dispatchGroup: { x: d }, programUniforms: [{ type: 12, data: c }] }) };
      }, it2 = (t, e, r, n) => {
        let o = t.inputs.length === 1 ? r : go(t.inputs, r), i = o.axes;
        i.length === 0 && !o.noopWithEmptyAxes && (i = t.inputs[0].dims.map((y, b) => b));
        let s = k2.normalizeAxes(i, t.inputs[0].dims.length), u = s, d = t.inputs[0], c = th(u, t.inputs[0].dims.length);
        c.length > 0 && (d = t.compute(Be(t.inputs[0], c), { inputs: [0], outputs: [-1] })[0], u = Yf2(u.length, d.dims.length));
        let [p, m] = Xf2(d.dims, u), g = p;
        o.keepDims && (g = Jf2(p, s)), t.compute(rh(e, o.cacheKey, [d], n, t.inputs[0].dataType, g, m), { inputs: [d] });
      }, Ks = (t, e) => {
        it2(t, "ReduceMeanShared", e, "mean");
      }, js = (t, e) => {
        it2(t, "ReduceL1Shared", e, "l1");
      }, Zs = (t, e) => {
        it2(t, "ReduceL2Shared", e, "l2");
      }, Qs = (t, e) => {
        it2(t, "ReduceLogSumExpShared", e, "logSumExp");
      }, Ys = (t, e) => {
        it2(t, "ReduceMaxShared", e, "max");
      }, Xs = (t, e) => {
        it2(t, "ReduceMinShared", e, "min");
      }, Js = (t, e) => {
        it2(t, "ReduceProdShared", e, "prod");
      }, eu = (t, e) => {
        it2(t, "ReduceSumShared", e, "sum");
      }, tu = (t, e) => {
        it2(t, "ReduceSumSquareShared", e, "sumSquare");
      }, ru = (t, e) => {
        it2(t, "ReduceLogSumShared", e, "logSum");
      };
    });
    Yr2 = V(() => {
      J();
      re();
      Ce();
      oe();
      nu();
      at2 = (t) => {
        if (!t || t.length === 0 || t.length > 2) throw new Error("Reduce op requires 1 or 2 inputs.");
        if (t.length === 2 && t[1].dims.length !== 1) throw new Error("Invalid axes input dims.");
      }, nh = (t) => ["", "", `var value = ${t.getByIndices("input_indices")};`, ""], Xr2 = (t, e, r, n, o, i, s = false, u = false) => {
        let d = [], c = r[0].dims, p = c.length, m = k2.normalizeAxes(o, p), g = !u && m.length === 0;
        c.forEach((T, x) => {
          g || m.indexOf(x) >= 0 ? s && d.push(1) : d.push(T);
        });
        let y = d.length, b = k2.size(d);
        return { name: t, shaderCache: e, getShaderSource: (T) => {
          let x = [], $2 = O("_A", r[0].dataType, p), S = U("output", i, y), I = n($2, S, m), E = I[2];
          for (let A = 0, z2 = 0; A < p; A++) g || m.indexOf(A) >= 0 ? (s && z2++, E = `for(var j${A}: u32 = 0; j${A} < ${c[A]}; j${A}++) {
                  ${I[2].includes("last_index") ? `let last_index = j${A};` : ""}
                  ${$2.indicesSet("input_indices", A, `j${A}`)}
                  ${E}
                }`) : (x.push(`${$2.indicesSet("input_indices", A, S.indicesGet("output_indices", z2))};`), z2++);
          return `

        ${T.registerUniform("output_size", "u32").declareVariables($2, S)}

        ${T.mainStart()}
          ${T.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${$2.type.indices};
          let output_indices = ${S.offsetToIndices("global_idx")};

          ${x.join(`
`)}
          ${I[0]}       // init ops for reduce max/min
          ${I[1]}
          ${E}
          ${I[3]}
          ${I.length === 4 ? S.setByOffset("global_idx", "value") : I.slice(4).join(`
`)}
        }`;
        }, getRunData: () => ({ outputs: [{ dims: d, dataType: i }], dispatchGroup: { x: Math.ceil(b / 64) }, programUniforms: [{ type: 12, data: b }, ...W(c, d)] }) };
      }, go = (t, e) => {
        let r = [];
        return t[1].dims[0] > 0 && t[1].getBigInt64Array().forEach((n) => r.push(Number(n))), ee({ axes: r, keepDims: e.keepDims, noopWithEmptyAxes: e.noopWithEmptyAxes });
      }, st2 = (t, e, r, n) => {
        let o = t.inputs, i = o.length === 1 ? r : go(o, r);
        t.compute(Xr2(e, { hint: i.cacheKey, inputDependencies: ["rank"] }, [o[0]], i.noopWithEmptyAxes && i.axes.length === 0 ? nh : n, i.axes, o[0].dataType, i.keepDims, i.noopWithEmptyAxes), { inputs: [0] });
      }, oh = (t, e) => {
        at2(t.inputs), st2(t, "ReduceLogSum", e, (n, o) => [`var value = ${o.type.storage}(0);`, "", `value += ${n.getByIndices("input_indices")};`, "value = log(value);"]);
      }, ih = (t, e) => {
        at2(t.inputs), st2(t, "ReduceL1", e, (n, o) => [`var value = ${o.type.storage}(0);`, "", `value += abs(${n.getByIndices("input_indices")});`, ""]);
      }, ah = (t, e) => {
        at2(t.inputs), st2(t, "ReduceL2", e, (n, o) => [`var t = ${o.type.value}(0); var value = ${o.type.value}(0);`, "", `t = ${n.getByIndices("input_indices")}; value += (t * t);`, "value = sqrt(value);"]);
      }, sh = (t, e) => {
        at2(t.inputs), st2(t, "ReduceLogSumExp", e, (n, o) => [`var value = ${o.type.storage}(0);`, "", `value += exp(${n.getByIndices("input_indices")});`, "value = log(value);"]);
      }, uh = (t, e) => {
        at2(t.inputs), st2(t, "ReduceMax", e, (n, o, i) => {
          let s = [];
          for (let u = 0; u < n.rank; u++) (i.indexOf(u) >= 0 || i.length === 0) && s.push(n.indicesSet("input_indices", u, 0));
          return [`${s.join(`
`)}`, `var value = ${n.getByIndices("input_indices")};`, `value = max(value, ${n.getByIndices("input_indices")});`, ""];
        });
      }, dh = (t, e) => {
        at2(t.inputs), st2(t, "ReduceMean", e, (n, o, i) => {
          let s = 1;
          for (let u = 0; u < n.rank; u++) (i.indexOf(u) >= 0 || i.length === 0) && (s *= t.inputs[0].dims[u]);
          return ["var sum = f32(0);", "", `sum += f32(${n.getByIndices("input_indices")});`, `let value = ${o.type.value}(sum / ${s});`];
        });
      }, lh = (t, e) => {
        at2(t.inputs), st2(t, "ReduceMin", e, (n, o, i) => {
          let s = [];
          for (let u = 0; u < n.rank; u++) (i.indexOf(u) >= 0 || i.length === 0) && s.push(`input_indices[${u}] = 0;`);
          return [`${s.join(`
`)}`, `var value = ${n.getByIndices("input_indices")};`, `value = min(value, ${n.getByIndices("input_indices")});`, ""];
        });
      }, ch = (t, e) => {
        at2(t.inputs), st2(t, "ReduceProd", e, (n, o) => [`var value = ${o.type.storage}(1);`, "", `value *= ${n.getByIndices("input_indices")};`, ""]);
      }, ph = (t, e) => {
        at2(t.inputs), st2(t, "ReduceSum", e, (n, o) => [`var value = ${o.type.storage}(0);`, "", `value += ${n.getByIndices("input_indices")};`, ""]);
      }, mh = (t, e) => {
        at2(t.inputs), st2(t, "ReduceSumSquare", e, (n, o) => [`var t = ${o.type.value}(0); var value = ${o.type.value}(0);`, "", `t = ${n.getByIndices("input_indices")}; value += t * t;`, ""]);
      }, ut2 = (t, e, r) => {
        if (e.length === 0) return r;
        let n = 1, o = 1;
        for (let i = 0; i < e.length; i++) e.indexOf(i) === -1 ? n *= t[i] : o *= t[i];
        return o < 32 && n > 1024;
      }, ou = (t, e) => {
        ut2(t.inputs[0].dims, e.axes, e.noopWithEmptyAxes) ? dh(t, e) : Ks(t, e);
      }, iu = (t, e) => {
        ut2(t.inputs[0].dims, e.axes, e.noopWithEmptyAxes) ? ih(t, e) : js(t, e);
      }, au = (t, e) => {
        ut2(t.inputs[0].dims, e.axes, e.noopWithEmptyAxes) ? ah(t, e) : Zs(t, e);
      }, su = (t, e) => {
        ut2(t.inputs[0].dims, e.axes, e.noopWithEmptyAxes) ? sh(t, e) : Qs(t, e);
      }, uu = (t, e) => {
        ut2(t.inputs[0].dims, e.axes, e.noopWithEmptyAxes) ? uh(t, e) : Ys(t, e);
      }, du = (t, e) => {
        ut2(t.inputs[0].dims, e.axes, e.noopWithEmptyAxes) ? lh(t, e) : Xs(t, e);
      }, lu = (t, e) => {
        ut2(t.inputs[0].dims, e.axes, e.noopWithEmptyAxes) ? ch(t, e) : Js(t, e);
      }, cu = (t, e) => {
        ut2(t.inputs[0].dims, e.axes, e.noopWithEmptyAxes) ? ph(t, e) : eu(t, e);
      }, pu = (t, e) => {
        ut2(t.inputs[0].dims, e.axes, e.noopWithEmptyAxes) ? mh(t, e) : tu(t, e);
      }, mu = (t, e) => {
        ut2(t.inputs[0].dims, e.axes, e.noopWithEmptyAxes) ? oh(t, e) : ru(t, e);
      };
    });
    bu = V(() => {
      J();
      Ce();
      Yr2();
      fu = (t) => {
        if (!t || t.length === 0 || t.length > 2) throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");
        if (t[0].dataType !== 1) throw new Error("Invalid input type.");
      }, hu = (t, e) => {
        fu(t.inputs);
        let r = (n, o, i) => {
          let s = [];
          for (let u = 0; u < n.rank; u++) (i.indexOf(u) >= 0 || i.length === 0) && s.push(`input_indices[${u}] = 0;`);
          return [`${s.join(`
`)}`, `var value = ${n.getByIndices("input_indices")};
var best_index : i32 = 0;`, `if (${n.getByIndices("input_indices")} ${e.selectLastIndex > 0 ? "<=" : "<"} value) {
         value = ${n.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`, "", o.setByOffset("global_idx", "best_index")];
        };
        t.compute(Xr2("ArgMin", { hint: e.cacheKey, inputDependencies: ["rank"] }, [t.inputs[0]], r, [e.axis], 7, e.keepDims), { inputs: [0] });
      }, gu = (t, e) => {
        fu(t.inputs);
        let r = (n, o, i) => {
          let s = [];
          for (let u = 0; u < n.rank; u++) (i.indexOf(u) >= 0 || i.length === 0) && s.push(`input_indices[${u}] = 0;`);
          return [`${s.join(`
`)}`, `var value = ${n.getByIndices("input_indices")};
var best_index : i32 = 0;`, `if (${n.getByIndices("input_indices")} ${e.selectLastIndex > 0 ? ">=" : ">"} value) {
         value = ${n.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`, "", o.setByOffset("global_idx", "best_index")];
        };
        t.compute(Xr2("argMax", { hint: e.cacheKey, inputDependencies: ["rank"] }, [t.inputs[0]], r, [e.axis], 7, e.keepDims), { inputs: [0] });
      }, bo = (t) => ee(t);
    });
    Jr2 = V(() => {
      J();
      re();
      jr();
      oe();
      fh = (t, e) => {
        let r = t[0], n = t[1], o = t[2], i = t[3], s = t[4], u = t[5];
        if (s && u) throw new Error("Attention cannot have both past and attention_bias");
        if (r.dims.length !== 3) throw new Error('Input "input" must have 3 dimensions');
        let d = r.dims[0], c = r.dims[1], p = r.dims[2];
        if (o.dims.length !== 1) throw new Error('Input "bias" is expected to have 1 dimensions');
        if (n.dims.length !== 2) throw new Error('Input "weights" is expected to have 2 dimensions');
        if (n.dims[0] !== p) throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");
        if (o.dims[0] !== n.dims[1]) throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');
        let m = o.dims[0] / 3, g = m, y = g;
        if (e.qkvHiddenSizes.length > 0) {
          if (e.qkvHiddenSizes.length !== 3) throw new Error("qkv_hidden_sizes attribute should have 3 elements");
          for (let S of e.qkvHiddenSizes) if (S % e.numHeads !== 0) throw new Error("qkv_hidden_sizes should be divisible by num_heads");
          m = e.qkvHiddenSizes[0], g = e.qkvHiddenSizes[1], y = e.qkvHiddenSizes[2];
        }
        let b = c;
        if (m !== g) throw new Error("qkv_hidden_sizes first element should be same as the second");
        if (o.dims[0] !== m + g + y) throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');
        let _ = 0;
        if (s) {
          if (g !== y) throw new Error('Input "past" expect k_hidden_size == v_hidden_size');
          if (s.dims.length !== 5) throw new Error('Input "past" must have 5 dimensions');
          if (s.dims[0] !== 2) throw new Error('Input "past" first dimension must be 2');
          if (s.dims[1] !== d) throw new Error('Input "past" second dimension must be batch_size');
          if (s.dims[2] !== e.numHeads) throw new Error('Input "past" third dimension must be num_heads');
          if (s.dims[4] !== g / e.numHeads) throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');
          e.pastPresentShareBuffer || (_ = s.dims[3]);
        }
        let T = b + _, x = -1, $2 = 0;
        if (i) throw new Error("Mask not supported");
        if (s) throw new Error("past is not supported");
        if (u) {
          if (u.dims.length !== 4) throw new Error('Input "attention_bias" must have 4 dimensions');
          if (u.dims[0] !== d || u.dims[1] !== e.numHeads || u.dims[2] !== c || u.dims[3] !== T) throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)');
        }
        return { batchSize: d, sequenceLength: c, pastSequenceLength: _, kvSequenceLength: b, totalSequenceLength: T, maxSequenceLength: x, inputHiddenSize: p, hiddenSize: m, vHiddenSize: y, headSize: Math.floor(m / e.numHeads), vHeadSize: Math.floor(y / e.numHeads), numHeads: e.numHeads, isUnidirectional: false, pastPresentShareBuffer: false, maskFilterValue: e.maskFilterValue, maskType: $2, scale: e.scale, broadcastResPosBias: false, passPastInKv: false, qkvFormat: 1 };
      }, yo = (t, e, r) => e && t ? `
      let total_sequence_length_input = u32(${e.getByOffset("0")});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${t?.getByOffset("batchIdx")}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       ` : `
    ${r ? "let past_sequence_length = uniforms.past_sequence_length" : ""};
    let present_sequence_length = total_sequence_length;
    `, hh = (t, e, r, n, o, i, s, u) => {
        let d = fe(s ? 1 : i), c = 64, p = i / d;
        p < c && (c = 32);
        let m = Math.ceil(i / d / c), g = [{ type: 12, data: e }, { type: 12, data: r }, { type: 12, data: n }, { type: 12, data: o }, { type: 12, data: p }, { type: 12, data: m }], y = we(t.dataType, d), b = ze2(1, d), _ = ["type"];
        s && _.push("type"), u && _.push("type");
        let T = (x) => {
          let $2 = U("x", t.dataType, t.dims, d), S = [$2], I = s ? O("seq_lens", s.dataType, s.dims) : void 0;
          I && S.push(I);
          let E = u ? O("total_sequence_length_input", u.dataType, u.dims) : void 0;
          E && S.push(E);
          let A = ze2(t.dataType), z2 = [{ name: "batch_size", type: "u32" }, { name: "num_heads", type: "u32" }, { name: "past_sequence_length", type: "u32" }, { name: "sequence_length", type: "u32" }, { name: "total_sequence_length", type: "u32" }, { name: "elements_per_thread", type: "u32" }];
          return `
  var<workgroup> thread_max: array<f32, ${c}>;
  var<workgroup> thread_sum: array<f32, ${c}>;
  ${x.registerUniforms(z2).declareVariables(...S)}
  ${x.mainStart([c, 1, 1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${yo(I, E, false)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${c}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${s ? "u32(past_sequence_length + workgroup_id.y + 1)" : "total_sequence_length"};
    var thread_max_vector = ${b}(-3.4028234663852886e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${b}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(() => {
            switch (d) {
              case 1:
                return "thread_max_vector";
              case 2:
                return "max(thread_max_vector.x, thread_max_vector.y)";
              case 4:
                return "max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";
              default:
                throw new Error(`Unsupported components: ${d}`);
            }
          })()};
    workgroupBarrier();

    var max_value =  f32(-3.4028234663852886e+38f);
    for (var i = 0u; i < ${c}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${b}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${b}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(() => {
            switch (d) {
              case 1:
                return "sum_vector";
              case 2:
                return "sum_vector.x + sum_vector.y";
              case 4:
                return "sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";
              default:
                throw new Error(`Unsupported components: ${d}`);
            }
          })()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${c}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${$2.type.value}(${A}(1.0) / ${A}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${b}(x[offset + i]);
        x[offset + i] = ${$2.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${s ? `
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${$2.type.value}(${A}(0));
        }` : ""};
  }`;
        };
        return { name: "AttentionProbsSoftmax", shaderCache: { hint: `${c};${y};${d}`, inputDependencies: _ }, getShaderSource: T, getRunData: () => ({ outputs: [], dispatchGroup: { x: 1, y: o, z: e * r }, programUniforms: g }) };
      }, gh = (t, e, r, n, o, i, s, u, d) => {
        let c = s + i.kvSequenceLength, p = [i.batchSize, i.numHeads, i.sequenceLength, c], m = t > 1 && n, g = i.kvNumHeads ? i.kvNumHeads : i.numHeads, y = m ? [i.batchSize, g, c, i.headSize] : void 0, b = i.nReps ? i.nReps : 1, _ = i.scale === 0 ? 1 / Math.sqrt(i.headSize) : i.scale, T = fe(i.headSize), x = i.headSize / T, $2 = 12, S = { x: Math.ceil(c / $2), y: Math.ceil(i.sequenceLength / $2), z: i.batchSize * i.numHeads }, I = [{ type: 12, data: i.sequenceLength }, { type: 12, data: x }, { type: 12, data: c }, { type: 12, data: i.numHeads }, { type: 12, data: i.headSize }, { type: 1, data: _ }, { type: 12, data: s }, { type: 12, data: i.kvSequenceLength }, { type: 12, data: b }], E = m && n && k2.size(n.dims) > 0, A = ["type", "type"];
        E && A.push("type"), o && A.push("type"), u && A.push("type"), d && A.push("type");
        let z2 = [{ dims: p, dataType: e.dataType, gpuDataType: 0 }];
        m && z2.push({ dims: y, dataType: e.dataType, gpuDataType: 0 });
        let v = (R) => {
          let N = O("q", e.dataType, e.dims, T), F = O("key", r.dataType, r.dims, T), q = [N, F];
          if (E) {
            let te = O("past_key", n.dataType, n.dims, T);
            q.push(te);
          }
          o && q.push(O("attention_bias", o.dataType, o.dims));
          let X = u ? O("seq_lens", u.dataType, u.dims) : void 0;
          X && q.push(X);
          let B = d ? O("total_sequence_length_input", d.dataType, d.dims) : void 0;
          B && q.push(B);
          let L = U("output", e.dataType, p), Q2 = [L];
          m && Q2.push(U("present_key", e.dataType, y, T));
          let Y = ze2(1, T), Z = [{ name: "M", type: "u32" }, { name: "K", type: "u32" }, { name: "N", type: "u32" }, { name: "num_heads", type: "u32" }, { name: "head_size", type: "u32" }, { name: "alpha", type: "f32" }, { name: "past_sequence_length", type: "u32" }, { name: "kv_sequence_length", type: "u32" }, { name: "n_reps", type: "u32" }];
          return `
  const TILE_SIZE = ${$2}u;

  var<workgroup> tileQ: array<${N.type.storage}, ${$2 * $2}>;
  var<workgroup> tileK: array<${N.type.storage}, ${$2 * $2}>;
  ${R.registerUniforms(Z).declareVariables(...q, ...Q2)}
  ${R.mainStart([$2, $2, 1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${b === 1 ? "headIdx" : "headIdx / uniforms.n_reps"};
    let kv_num_heads = ${b === 1 ? "uniforms.num_heads" : "uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${yo(X, B, true)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${E && m ? "let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;" : ""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${m ? "let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;" : ""}
    var value = ${Y}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${E && m ? `
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }` : `
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${m ? `if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }` : ""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${Y}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(() => {
            switch (T) {
              case 1:
                return "value";
              case 2:
                return "value.x + value.y";
              case 4:
                return "value.x + value.y + value.z + value.w";
              default:
                throw new Error(`Unsupported components: ${T}`);
            }
          })()};
        output[outputIdx] = ${L.type.value} (sum * uniforms.alpha) + ${o ? "attention_bias[outputIdx]" : "0.0"};
    }
  }`;
        };
        return { name: "AttentionProbs", shaderCache: { hint: `${T};${o !== void 0};${n !== void 0};${t}`, inputDependencies: A }, getRunData: () => ({ outputs: z2, dispatchGroup: S, programUniforms: I }), getShaderSource: v };
      }, bh = (t, e, r, n, o, i, s = void 0, u = void 0) => {
        let d = i + o.kvSequenceLength, c = o.nReps ? o.nReps : 1, p = o.vHiddenSize * c, m = t > 1 && n, g = o.kvNumHeads ? o.kvNumHeads : o.numHeads, y = m ? [o.batchSize, g, d, o.headSize] : void 0, b = [o.batchSize, o.sequenceLength, p], _ = 12, T = { x: Math.ceil(o.vHeadSize / _), y: Math.ceil(o.sequenceLength / _), z: o.batchSize * o.numHeads }, x = [{ type: 12, data: o.sequenceLength }, { type: 12, data: d }, { type: 12, data: o.vHeadSize }, { type: 12, data: o.numHeads }, { type: 12, data: o.headSize }, { type: 12, data: p }, { type: 12, data: i }, { type: 12, data: o.kvSequenceLength }, { type: 12, data: c }], $2 = m && n && k2.size(n.dims) > 0, S = ["type", "type"];
        $2 && S.push("type"), s && S.push("type"), u && S.push("type");
        let I = [{ dims: b, dataType: e.dataType, gpuDataType: 0 }];
        m && I.push({ dims: y, dataType: e.dataType, gpuDataType: 0 });
        let E = (A) => {
          let z2 = O("probs", e.dataType, e.dims), v = O("v", r.dataType, r.dims), R = [z2, v];
          $2 && R.push(O("past_value", n.dataType, n.dims));
          let N = s ? O("seq_lens", s.dataType, s.dims) : void 0;
          s && R.push(N);
          let F = u ? O("total_sequence_length_input", u.dataType, u.dims) : void 0;
          u && R.push(F);
          let X = [U("output", e.dataType, b)];
          m && X.push(U("present_value", e.dataType, y));
          let B = [{ name: "M", type: "u32" }, { name: "K", type: "u32" }, { name: "N", type: "u32" }, { name: "num_heads", type: "u32" }, { name: "head_size", type: "u32" }, { name: "v_hidden_size", type: "u32" }, { name: "past_sequence_length", type: "u32" }, { name: "kv_sequence_length", type: "u32" }, { name: "n_reps", type: "u32" }];
          return `
  const TILE_SIZE = ${_}u;
  var<workgroup> tileQ: array<${z2.type.value}, ${_ * _}>;
  var<workgroup> tileV: array<${z2.type.value}, ${_ * _}>;
  ${A.registerUniforms(B).declareVariables(...R, ...X)}
  ${A.mainStart([_, _, 1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${c === 1 ? "headIdx" : "headIdx / uniforms.n_reps"};
   let kv_num_heads = ${c === 1 ? "uniforms.num_heads" : "uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${yo(N, F, true)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${$2 && m ? "let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;" : ""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${m ? "let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;" : ""}
   var value = ${z2.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${$2 && m ? `
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      ` : `
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${m ? `
            if (w + local_id.y < present_sequence_length) {
          present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileV[idx];
        }` : ""}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < total_sequence_length; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileV[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + headIdx * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`;
        };
        return { name: "AttentionScore", shaderCache: { hint: `${n !== void 0};${t}`, inputDependencies: S }, getRunData: () => ({ outputs: I, dispatchGroup: T, programUniforms: x }), getShaderSource: E };
      }, Gt = (t, e, r, n, o, i, s, u, d, c, p = void 0, m = void 0) => {
        let g = Math.min(t.outputCount, 1 + (s ? 1 : 0) + (u ? 1 : 0)), y = g > 1 ? s : void 0, b = g > 1 ? u : void 0, _ = g > 1 ? c.pastSequenceLength : 0, T = _ + c.kvSequenceLength, x = d && k2.size(d.dims) > 0 ? d : void 0, $2 = [e, r];
        y && k2.size(y.dims) > 0 && $2.push(y), x && $2.push(x), p && $2.push(p), m && $2.push(m);
        let S = t.compute(gh(g, e, r, y, x, c, _, p, m), { inputs: $2, outputs: g > 1 ? [-1, 1] : [-1] })[0];
        t.compute(hh(S, c.batchSize, c.numHeads, _, c.sequenceLength, T, p, m), { inputs: p && m ? [S, p, m] : [S], outputs: [] });
        let I = [S, n];
        b && k2.size(b.dims) > 0 && I.push(b), p && I.push(p), m && I.push(m), t.compute(bh(g, S, n, b, c, _, p, m), { inputs: I, outputs: g > 1 ? [0, 2] : [0] });
      }, yh = (t, e) => {
        let r = [e.batchSize, e.numHeads, e.sequenceLength, e.headSize], n = e.sequenceLength, o = e.inputHiddenSize, i = e.headSize, s = 12, u = { x: Math.ceil(e.headSize / s), y: Math.ceil(e.sequenceLength / s), z: e.batchSize * e.numHeads }, d = [t.inputs[0], t.inputs[1], t.inputs[2]], c = [{ type: 12, data: n }, { type: 12, data: o }, { type: 12, data: i }, { type: 12, data: e.numHeads }, { type: 12, data: e.headSize }, { type: 12, data: e.hiddenSize }, { type: 12, data: e.hiddenSize + e.hiddenSize + e.vHiddenSize }], p = (m) => {
          let g = U("output_q", d[0].dataType, r), y = U("output_k", d[0].dataType, r), b = U("output_v", d[0].dataType, r), _ = O("input", d[0].dataType, d[0].dims), T = O("weight", d[1].dataType, d[1].dims), x = O("bias", d[2].dataType, d[2].dims), $2 = _.type.storage, S = [{ name: "M", type: "u32" }, { name: "K", type: "u32" }, { name: "N", type: "u32" }, { name: "num_heads", type: "u32" }, { name: "head_size", type: "u32" }, { name: "hidden_size", type: "u32" }, { name: "ldb", type: "u32" }];
          return `
  const TILE_SIZE = ${s}u;
  var<workgroup> tileInput: array<${$2}, ${s * s}>;
  var<workgroup> tileWeightQ: array<${$2}, ${s * s}>;
  var<workgroup> tileWeightK: array<${$2}, ${s * s}>;
  var<workgroup> tileWeightV: array<${$2}, ${s * s}>;
  ${m.registerUniforms(S).declareVariables(_, T, x, g, y, b)}
  ${m.mainStart([s, s, 1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${$2}(0);
    var valueK = ${$2}(0);
    var valueV = ${$2}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileInput[TILE_SIZE * local_id.y + local_id.x] = input[inputOffset + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        let offset = n + (w + local_id.y) * uniforms.ldb;
        tileWeightQ[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetQ + offset];
        tileWeightK[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetK + offset];
        tileWeightV[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetV + offset];
      }
      workgroupBarrier();
      for (var k: u32 = 0u; k<TILE_SIZE && w+k < uniforms.K; k++) {
        let inputTileOffset = TILE_SIZE * local_id.y + k;
        let weightTileOffset = TILE_SIZE * k + local_id.x;
        valueQ += tileInput[inputTileOffset] * tileWeightQ[weightTileOffset];
        valueK += tileInput[inputTileOffset] * tileWeightK[weightTileOffset];
        valueV += tileInput[inputTileOffset] * tileWeightV[weightTileOffset];
      }

      workgroupBarrier();
    }

    let headOffset = (m * uniforms.N + n) % uniforms.head_size;
    valueQ += bias[headOffset + biasOffsetQ];
    valueK += bias[headOffset + biasOffsetK];
    valueV += bias[headOffset + biasOffsetV];

    let offset = workgroup_id.z * uniforms.M * uniforms.N;
    if (m < uniforms.M && n < uniforms.N) {
      let outputIdx = offset + m * uniforms.N + n;
      output_q[outputIdx] = valueQ;
      output_k[outputIdx] = valueK;
      output_v[outputIdx] = valueV;
    }
  }`;
        };
        return t.compute({ name: "AttentionPrepare", shaderCache: { inputDependencies: ["type", "type", "type"] }, getRunData: () => ({ outputs: [{ dims: r, dataType: t.inputs[0].dataType, gpuDataType: 0 }, { dims: r, dataType: t.inputs[0].dataType, gpuDataType: 0 }, { dims: r, dataType: t.inputs[0].dataType, gpuDataType: 0 }], dispatchGroup: u, programUniforms: c }), getShaderSource: p }, { inputs: d, outputs: [-1, -1, -1] });
      }, yu = (t, e) => {
        let r = fh(t.inputs, e), [n, o, i] = yh(t, r);
        return Gt(t, n, o, i, t.inputs[4], void 0, void 0, void 0, t.inputs[5], r);
      };
    });
    wu = V(() => {
      Le2();
      J();
      re();
      Ce();
      oe();
      _h = (t, e) => {
        if (!t || t.length !== 5) throw new Error("BatchNormalization requires 5 inputs");
        let r = (n, o, i) => {
          let s = o.length;
          if (s !== n.length) throw new Error(`${i}: num dimensions != ${s}`);
          o.forEach((u, d) => {
            if (u !== n[d]) throw new Error(`${i}: dim[${d}] do not match`);
          });
        };
        if (t[0].dims.length > 1) {
          let n = e.format === "NHWC" ? e.spatial ? t[0].dims.slice(-1) : t[0].dims.slice(-1).concat(t[0].dims.slice(1, t[0].dims.length - 1)) : t[0].dims.slice(1, e.spatial ? 2 : void 0);
          r(t[1].dims, n, "Invalid input scale"), r(t[2].dims, n, "Invalid input B"), r(t[3].dims, n, "Invalid input mean"), r(t[4].dims, n, "Invalid input var");
        } else r(t[1].dims, [1], "Invalid input scale"), r(t[2].dims, [1], "Invalid input B"), r(t[3].dims, [1], "Invalid input mean"), r(t[4].dims, [1], "Invalid input var");
      }, wh = (t, e) => {
        let { epsilon: r, spatial: n, format: o } = e, i = t[0].dims, s = n ? fe(i[i.length - 1]) : 1, u = o === "NHWC" && i.length > 1 ? s : 1, d = k2.size(i) / s, c = n, p = c ? i.length : i, m = O("x", t[0].dataType, t[0].dims, s), g = O("scale", t[1].dataType, t[1].dims, u), y = O("bias", t[2].dataType, t[2].dims, u), b = O("inputMean", t[3].dataType, t[3].dims, u), _ = O("inputVar", t[4].dataType, t[4].dims, u), T = U("y", t[0].dataType, p, s), x = () => {
          let S = "";
          if (n) S = `let cOffset = ${i.length === 1 ? "0u" : o === "NHWC" ? `outputIndices[${i.length - 1}] / ${s}` : "outputIndices[1]"};`;
          else if (o === "NCHW") S = `
            ${T.indicesSet("outputIndices", "0", "0")}
            let cOffset = ${T.indicesToOffset("outputIndices")};`;
          else {
            S = `var cIndices = ${g.type.indices}(0);
                       cIndices[0] = outputIndices[${i.length - 1}];`;
            for (let I = 1; I < g.rank; I++) S += `cIndices[${I}] = outputIndices[${I}];`;
            S += `let cOffset = ${g.indicesToOffset("cIndices")};`;
          }
          return S;
        }, $2 = (S) => `
  const epsilon = ${r};
  ${S.registerUniform("outputSize", "u32").declareVariables(m, g, y, b, _, T)}
  ${S.mainStart()}
  ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${T.offsetToIndices(`global_idx * ${s}`)};
    ${x()}
    let scale = ${g.getByOffset("cOffset")};
    let bias = ${y.getByOffset("cOffset")};
    let inputMean = ${b.getByOffset("cOffset")};
    let inputVar = ${_.getByOffset("cOffset")};
    let x = ${m.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${T.setByOffset("global_idx", "value")}
  }`;
        return { name: "BatchNormalization", shaderCache: { hint: `${e.epsilon}_${e.format}_${n}_${s}`, inputDependencies: c ? ["rank", "type", "type", "type", "type"] : void 0 }, getShaderSource: $2, getRunData: () => ({ outputs: [{ dims: t[0].dims, dataType: t[0].dataType }], dispatchGroup: { x: Math.ceil(d / 64) }, programUniforms: c ? [{ type: 12, data: d }, ...W(i)] : [{ type: 12, data: d }] }) };
      }, vh = (t) => ee(t), _u = (t, e) => {
        let { inputs: r, outputCount: n } = t, o = vh({ ...e, outputCount: n });
        if (_e.webgpu.validateInputContent && _h(r, o), e.trainingMode) throw new Error("BatchNormalization trainingMode is not supported yet.");
        t.compute(wh(r, o));
      };
    });
    $u = V(() => {
      re();
      oe();
      $h = (t) => {
        if (t[0].dims.length !== 3) throw new Error("input should have 3 dimensions");
        if (![320, 640, 1280].includes(t[0].dims[2])) throw new Error("number of channels should be 320, 640 or 1280");
        if (t[1].dims.length !== 1) throw new Error("bias is expected to have 1 dimensions");
        if (t[0].dims[2] !== t[1].dims[0]) throw new Error("last dimension of input and bias are not the same");
      }, xh = (t) => {
        let e = t[0].dims, r = t[0].dims[2], n = k2.size(e) / 4, o = t[0].dataType, i = O("input", o, e, 4), s = O("bias", o, [r], 4), u = O("residual", o, e, 4), d = U("output", o, e, 4);
        return { name: "BiasAdd", getRunData: () => ({ outputs: [{ dims: e, dataType: t[0].dataType }], dispatchGroup: { x: Math.ceil(n / 64) } }), getShaderSource: (p) => `
  const channels = ${r}u / 4;
  ${p.declareVariables(i, s, u, d)}

  ${p.mainStart()}
    ${p.guardAgainstOutOfBoundsWorkgroupSizes(n)}
    let value = ${i.getByOffset("global_idx")}
      + ${s.getByOffset("global_idx % channels")} + ${u.getByOffset("global_idx")};
    ${d.setByOffset("global_idx", "value")}
  }` };
      }, vu = (t) => {
        $h(t.inputs), t.compute(xh(t.inputs));
      };
    });
    tn2 = V(() => {
      J();
      re();
      Ce();
      oe();
      Sh = (t, e, r, n, o, i, s) => {
        let u = Math.ceil(e / 4), d = "";
        typeof o == "string" ? d = `${o}(a)` : d = o("a");
        let c = O("inputData", r, [u], 4), p = U("outputData", n, [u], 4), m = [{ name: "vec_size", type: "u32" }];
        return s && m.push(...s), `
      ${t.registerUniforms(m).declareVariables(c, p)}

  ${i ?? ""}

  ${t.mainStart()}
    ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${c.getByOffset("global_idx")};
    ${p.setByOffset("global_idx", d)}
  }`;
      }, ge2 = (t, e, r, n, o, i = t.dataType, s, u) => {
        let d = [{ type: 12, data: Math.ceil(k2.size(t.dims) / 4) }];
        return s && d.push(...s), { name: e, shaderCache: { hint: o, inputDependencies: ["type"] }, getShaderSource: (c) => Sh(c, k2.size(t.dims), t.dataType, i, r, n, u), getRunData: (c) => ({ outputs: [{ dims: t.dims, dataType: i }], dispatchGroup: { x: Math.ceil(k2.size(c[0].dims) / 64 / 4) }, programUniforms: d }) };
      }, xu = (t) => {
        t.compute(ge2(t.inputs[0], "Abs", "abs"));
      }, Su = (t) => {
        t.compute(ge2(t.inputs[0], "Acos", "acos"));
      }, Tu = (t) => {
        t.compute(ge2(t.inputs[0], "Acosh", "acosh"));
      }, Iu = (t) => {
        t.compute(ge2(t.inputs[0], "Asin", "asin"));
      }, Cu = (t) => {
        t.compute(ge2(t.inputs[0], "Asinh", "asinh"));
      }, Au = (t) => {
        t.compute(ge2(t.inputs[0], "Atan", "atan"));
      }, Eu = (t) => {
        t.compute(ge2(t.inputs[0], "Atanh", "atanh"));
      }, ku = (t) => ee(t), Pu = (t, e) => {
        let r;
        switch (e.to) {
          case 10:
            r = "vec4<f16>";
            break;
          case 1:
            r = "vec4<f32>";
            break;
          case 12:
            r = "vec4<u32>";
            break;
          case 6:
            r = "vec4<i32>";
            break;
          case 9:
            r = "vec4<bool>";
            break;
          default:
            throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${e.to}`);
        }
        t.compute(ge2(t.inputs[0], "Cast", r, void 0, e.cacheKey, e.to));
      }, Th = (t) => {
        let e, r, n = t.length >= 2 && t[1].data !== 0, o = t.length >= 3 && t[2].data !== 0;
        switch (t[0].dataType) {
          case 1:
            e = n ? t[1].getFloat32Array()[0] : -34028234663852886e22, r = o ? t[2].getFloat32Array()[0] : 34028234663852886e22;
            break;
          case 10:
            e = n ? t[1].getUint16Array()[0] : 64511, r = o ? t[2].getUint16Array()[0] : 31743;
            break;
          default:
            throw new Error("Unsupport data type");
        }
        return ee({ min: e, max: r });
      }, Ou = (t, e) => {
        let r = e || Th(t.inputs), n = ze2(t.inputs[0].dataType);
        t.compute(ge2(t.inputs[0], "Clip", (o) => `clamp(${o}, vec4<${n}>(uniforms.min), vec4<${n}>(uniforms.max))`, void 0, r.cacheKey, void 0, [{ type: t.inputs[0].dataType, data: r.min }, { type: t.inputs[0].dataType, data: r.max }], [{ name: "min", type: n }, { name: "max", type: n }]), { inputs: [0] });
      }, zu = (t) => {
        t.compute(ge2(t.inputs[0], "Ceil", "ceil"));
      }, Bu = (t) => {
        t.compute(ge2(t.inputs[0], "Cos", "cos"));
      }, Du = (t) => {
        t.compute(ge2(t.inputs[0], "Cosh", "cosh"));
      }, or2 = (t) => ee(t), Mu = (t, e) => {
        let r = ze2(t.inputs[0].dataType);
        t.compute(ge2(t.inputs[0], "Elu", (n) => `elu_vf32(${n})`, `
  const elu_alpha_ = ${r}(${e.alpha});

  fn elu_f32(a: ${r}) -> ${r} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${r}>) -> vec4<${r}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`, e.cacheKey));
      }, en2 = (t = "f32") => `
const r0: ${t} = 0.3275911;
const r1: ${t} = 0.254829592;
const r2: ${t} = -0.284496736;
const r3: ${t} = 1.421413741;
const r4: ${t} = -1.453152027;
const r5: ${t} = 1.061405429;

fn erf_vf32(v: vec4<${t}>) -> vec4<${t}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`, Ru = (t) => {
        let e = ze2(t.inputs[0].dataType);
        t.compute(ge2(t.inputs[0], "Erf", (r) => `erf_vf32(${r})`, en2(e)));
      }, Uu = (t) => {
        t.compute(ge2(t.inputs[0], "Exp", "exp"));
      }, Nu = (t) => {
        t.compute(ge2(t.inputs[0], "Floor", "floor"));
      }, Vu = (t) => {
        let e = ze2(t.inputs[0].dataType);
        t.compute(ge2(t.inputs[0], "Gelu", (r) => `0.5 * ${r} * (1.0 + erf_vf32(${r} * 0.7071067811865475))`, en2(e)));
      }, Lu = (t, e) => {
        let r = ze2(t.inputs[0].dataType);
        t.compute(ge2(t.inputs[0], "LeakyRelu", (n) => `select(leaky_relu_alpha_ * ${n}, ${n}, ${n} >= vec4<${r}>(0.0))`, `const leaky_relu_alpha_ = ${r}(${e.alpha});`, e.cacheKey));
      }, Wu = (t) => {
        t.compute(ge2(t.inputs[0], "Not", (e) => `!${e}`));
      }, Gu = (t) => {
        t.compute(ge2(t.inputs[0], "Neg", (e) => `-${e}`));
      }, Hu = (t) => {
        t.compute(ge2(t.inputs[0], "Reciprocal", (e) => `1.0/${e}`));
      }, Fu = (t) => {
        let e = ze2(t.inputs[0].dataType);
        t.compute(ge2(t.inputs[0], "Relu", (r) => `select(vec4<${e}>(0.0), ${r}, ${r} > vec4<${e}>(0.0))`));
      }, qu = (t) => {
        t.compute(ge2(t.inputs[0], "Sigmoid", (e) => `(1.0 / (1.0 + exp(-${e})))`));
      }, Ku = (t) => ee(t), ju = (t, e) => {
        let r = ze2(t.inputs[0].dataType);
        t.compute(ge2(t.inputs[0], "HardSigmoid", (n) => `max(vec4<${r}>(0.0), min(vec4<${r}>(1.0), ${e.alpha} * ${n} + vec4<${r}>(${e.beta})))`, void 0, e.cacheKey));
      }, Zu = (t) => {
        t.compute(ge2(t.inputs[0], "Sin", "sin"));
      }, Qu = (t) => {
        t.compute(ge2(t.inputs[0], "Sinh", "sinh"));
      }, Yu = (t) => {
        t.compute(ge2(t.inputs[0], "Sqrt", "sqrt"));
      }, Xu = (t) => {
        t.compute(ge2(t.inputs[0], "Tan", "tan"));
      }, Ju = (t) => `sign(${t}) * (1 - exp(-2 * abs(${t}))) / (1 + exp(-2 * abs(${t})))`, ed = (t) => {
        t.compute(ge2(t.inputs[0], "Tanh", Ju));
      }, _o = (t = "f32") => `
const fast_gelu_a: ${t} = 0.5;
const fast_gelu_b: ${t} = 0.7978845608028654;
const fast_gelu_c: ${t} = 0.035677408136300125;

fn tanh_v(v: vec4<${t}>) -> vec4<${t}> {
  return ${Ju("v")};
}
`, wo = (t) => `(fast_gelu_a + fast_gelu_a * tanh_v(${t} * (fast_gelu_c * ${t} * ${t} + fast_gelu_b))) * ${t}`, td = (t) => {
        let e = ze2(t.inputs[0].dataType);
        t.compute(ge2(t.inputs[0], "FastGelu", wo, _o(e), void 0, t.inputs[0].dataType));
      }, rd = (t, e) => {
        let r = ze2(t.inputs[0].dataType);
        return t.compute(ge2(t.inputs[0], "ThresholdedRelu", (n) => `select(vec4<${r}>(0.0), ${n}, ${n} > thresholded_relu_alpha_)`, `const thresholded_relu_alpha_ = vec4<${r}>(${e.alpha});`, e.cacheKey)), 0;
      }, nd = (t) => {
        t.compute(ge2(t.inputs[0], "Log", "log"));
      }, Ih = (t, e) => `
const alpha = vec4<${t}>(${e});
const one = ${t}(1.0);
const zero = ${t}(0.0);

fn quick_gelu_impl(x: vec4<${t}>) -> vec4<${t}> {
  let v = x *alpha;
  var x1 : vec4<${t}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`, Ch = (t) => `quick_gelu_impl(${t})`, od = (t, e) => {
        let r = ze2(t.inputs[0].dataType);
        t.compute(ge2(t.inputs[0], "QuickGelu", Ch, Ih(r, e.alpha), e.cacheKey, t.inputs[0].dataType));
      };
    });
    sd = V(() => {
      re();
      oe();
      tn2();
      Ah = (t) => {
        if (t[0].dims.length !== 3) throw new Error("input should have 3 dimensions");
        if (![2560, 5120, 10240].includes(t[0].dims[2])) throw new Error("hidden state should be 2560, 5120 or 10240");
        if (t[1].dims.length !== 1) throw new Error("bias is expected to have 1 dimensions");
        if (t[0].dims[2] !== t[1].dims[0]) throw new Error("last dimension of input and bias are not the same");
      }, Eh = (t) => {
        let e = t[0].dims.slice();
        e[2] = e[2] / 2;
        let r = O("input", t[0].dataType, t[0].dims, 4), n = O("bias", t[0].dataType, [t[0].dims[2]], 4), o = U("output", t[0].dataType, e, 4), i = k2.size(e) / 4, s = we(t[0].dataType);
        return { name: "BiasSplitGelu", getRunData: () => ({ outputs: [{ dims: e, dataType: t[0].dataType }], dispatchGroup: { x: Math.ceil(i / 64) } }), getShaderSource: (d) => `
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${t[0].dims[2] / 4 / 2}u;

  ${d.declareVariables(r, n, o)}

  ${en2(s)}

  ${d.mainStart()}
    ${d.guardAgainstOutOfBoundsWorkgroupSizes(i)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${o.setByOffset("global_idx", "valueLeft * geluRight")}
  }` };
      }, ad = (t) => {
        Ah(t.inputs), t.compute(Eh(t.inputs));
      };
    });
    yd = V(() => {
      J();
      re();
      oe();
      kh = (t, e, r, n, o, i, s, u, d, c, p, m) => {
        let g, y;
        typeof u == "string" ? g = y = ($2, S) => `${u}((${$2}),(${S}))` : typeof u == "function" ? g = y = u : (g = u.scalar, y = u.vector);
        let b = U("outputData", p, n.length, 4), _ = O("aData", d, e.length, 4), T = O("bData", c, r.length, 4), x;
        if (o) if (i) {
          let $2 = k2.size(e) === 1, S = k2.size(r) === 1, I = e.length > 0 && e[e.length - 1] % 4 === 0, E = r.length > 0 && r[r.length - 1] % 4 === 0;
          $2 || S ? x = b.setByOffset("global_idx", y($2 ? `${_.type.value}(${_.getByOffset("0")}.x)` : _.getByOffset("global_idx"), S ? `${T.type.value}(${T.getByOffset("0")}.x)` : T.getByOffset("global_idx"))) : x = `
            let outputIndices = ${b.offsetToIndices("global_idx * 4u")};
            let offsetA = ${_.broadcastedIndicesToOffset("outputIndices", b)};
            let offsetB = ${T.broadcastedIndicesToOffset("outputIndices", b)};
            ${b.setByOffset("global_idx", y(s || I ? _.getByOffset("offsetA / 4u") : `${_.type.value}(${_.getByOffset("offsetA / 4u")}[offsetA % 4u])`, s || E ? T.getByOffset("offsetB / 4u") : `${T.type.value}(${T.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `;
        } else x = b.setByOffset("global_idx", y(_.getByOffset("global_idx"), T.getByOffset("global_idx")));
        else {
          if (!i) throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");
          let $2 = (S, I, E = "") => {
            let A = `aData[indexA${I}][componentA${I}]`, z2 = `bData[indexB${I}][componentB${I}]`;
            return `
            let outputIndices${I} = ${b.offsetToIndices(`global_idx * 4u + ${I}u`)};
            let offsetA${I} = ${_.broadcastedIndicesToOffset(`outputIndices${I}`, b)};
            let offsetB${I} = ${T.broadcastedIndicesToOffset(`outputIndices${I}`, b)};
            let indexA${I} = offsetA${I} / 4u;
            let indexB${I} = offsetB${I} / 4u;
            let componentA${I} = offsetA${I} % 4u;
            let componentB${I} = offsetB${I} % 4u;
            ${S}[${I}] = ${E}(${g(A, z2)});
          `;
          };
          p === 9 ? x = `
            var data = vec4<u32>(0);
            ${$2("data", 0, "u32")}
            ${$2("data", 1, "u32")}
            ${$2("data", 2, "u32")}
            ${$2("data", 3, "u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));` : x = `
            ${$2("outputData[global_idx]", 0)}
            ${$2("outputData[global_idx]", 1)}
            ${$2("outputData[global_idx]", 2)}
            ${$2("outputData[global_idx]", 3)}
          `;
        }
        return `
        ${t.registerUniform("vec_size", "u32").declareVariables(_, T, b)}

        ${m ?? ""}

        ${t.mainStart()}
        ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${x}
      }`;
      }, Ph = (t, e, r, n, o, i, s = r.dataType) => {
        let u = r.dims.map(Number), d = n.dims.map(Number), c = !k2.areEqual(u, d), p = u, m = k2.size(u), g = false, y = false, b = [c];
        if (c) {
          let _ = ot2.calcShape(u, d, false);
          if (!_) throw new Error("Can't perform binary op on the given tensors");
          p = _.slice(), m = k2.size(p);
          let T = k2.size(u) === 1, x = k2.size(d) === 1, $2 = u.length > 0 && u[u.length - 1] % 4 === 0, S = d.length > 0 && d[d.length - 1] % 4 === 0;
          b.push(T), b.push(x), b.push($2), b.push(S);
          let I = 1;
          for (let E = 1; E < p.length; E++) {
            let A = u[u.length - E], z2 = d[d.length - E];
            if (A === z2) I *= A;
            else break;
          }
          I % 4 === 0 ? (y = true, g = true) : (T || x || $2 || S) && (g = true);
        } else g = true;
        return b.push(g), { name: t, shaderCache: { hint: e + b.map((_) => _.toString()).join("_"), inputDependencies: ["rank", "rank"] }, getShaderSource: (_) => kh(_, u, d, p, g, c, y, o, r.dataType, n.dataType, s, i), getRunData: () => ({ outputs: [{ dims: p, dataType: s }], dispatchGroup: { x: Math.ceil(m / 64 / 4) }, programUniforms: [{ type: 12, data: Math.ceil(k2.size(p) / 4) }, ...W(u, d, p)] }) };
      }, dt = (t, e, r, n, o, i) => {
        t.compute(Ph(e, o ?? "", t.inputs[0], t.inputs[1], r, n, i));
      }, ud = (t) => {
        dt(t, "Add", (e, r) => `${e}+${r}`);
      }, dd = (t) => {
        dt(t, "Div", (e, r) => `${e}/${r}`);
      }, ld = (t) => {
        dt(t, "Equal", { scalar: (e, r) => `u32(${e}==${r})`, vector: (e, r) => `vec4<u32>(${e}==${r})` }, void 0, void 0, 9);
      }, cd = (t) => {
        dt(t, "Mul", (e, r) => `${e}*${r}`);
      }, pd = (t) => {
        let e = O("input", t.inputs[0].dataType, t.inputs[0].dims).type.value;
        dt(t, "Pow", { scalar: (n, o) => `pow_custom(${n},${o})`, vector: (n, o) => `pow_vector_custom(${n},${o})` }, `
    fn pow_custom(a : ${e}, b : ${e}) -> ${e} {
      if (b == ${e}(0.0)) {
        return ${e}(1.0);
      } else if (a < ${e}(0.0) && f32(b) != floor(f32(b))) {
        return ${e}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${e}(1.0), round(f32(abs(b) % ${e}(2.0))) != 1.0) * ${e}(${e === "i32" ? "round" : ""}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${e}>, b : vec4<${e}>) -> vec4<${e}> {
      // TODO: implement vectorized pow
      return vec4<${e}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `);
      }, md = (t) => {
        dt(t, "Sub", (e, r) => `${e}-${r}`);
      }, fd = (t) => {
        dt(t, "Greater", { scalar: (e, r) => `u32(${e}>${r})`, vector: (e, r) => `vec4<u32>(${e}>${r})` }, void 0, void 0, 9);
      }, hd = (t) => {
        dt(t, "Less", { scalar: (e, r) => `u32(${e}<${r})`, vector: (e, r) => `vec4<u32>(${e}<${r})` }, void 0, void 0, 9);
      }, gd = (t) => {
        dt(t, "GreaterOrEqual", { scalar: (e, r) => `u32(${e}>=${r})`, vector: (e, r) => `vec4<u32>(${e}>=${r})` }, void 0, void 0, 9);
      }, bd = (t) => {
        dt(t, "LessOrEqual", { scalar: (e, r) => `u32(${e}<=${r})`, vector: (e, r) => `vec4<u32>(${e}<=${r})` }, void 0, void 0, 9);
      };
    });
    vd = V(() => {
      J();
      re();
      Ce();
      oe();
      zh = (t, e) => {
        if (!t || t.length < 1) throw new Error("too few inputs");
        let r = 0, n = t[r], o = n.dataType, i = n.dims.length;
        t.forEach((s, u) => {
          if (u !== r) {
            if (s.dataType !== o) throw new Error("input tensors should be one type");
            if (s.dims.length !== i) throw new Error("input tensors should have the same shape");
            s.dims.forEach((d, c) => {
              if (c !== e && d !== n.dims[c]) throw new Error("non concat dimensions must match");
            });
          }
        });
      }, Bh = (t, e) => `
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${t}u>(${e});
    for (var i: u32 = 0u; i < ${t}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${t}u;
  }`, Dh = (t, e) => {
        let r = t.length, n = [];
        for (let o = 0; o < r; ++o) {
          let i = e.setByOffset("global_idx", t[o].getByIndices("indices"));
          r === 1 ? n.push(i) : o === 0 ? n.push(`if (inputIndex == ${o}u) { ${i} }`) : o === r - 1 ? n.push(`else { ${i} }`) : n.push(`else if (inputIndex == ${o}) { ${i} }`);
        }
        return n.join(`
`);
      }, Mh = (t, e, r, n) => {
        let o = k2.size(r), i = new Array(t.length), s = new Array(t.length), u = 0, d = [], c = [], p = [{ type: 12, data: o }];
        for (let _ = 0; _ < t.length; ++_) u += t[_].dims[e], i[_] = u, c.push(t[_].dims.length), s[_] = O(`input${_}`, n, c[_]), d.push("rank"), p.push({ type: 12, data: i[_] });
        for (let _ = 0; _ < t.length; ++_) p.push(...W(t[_].dims));
        p.push(...W(r));
        let m = U("output", n, r.length), g = m.indicesGet("indices", e), y = Array.from(Array(i.length).keys()).map((_) => `uniforms.sizeInConcatAxis${_}`).join(","), b = (_) => `

  ${(() => {
          _.registerUniform("outputSize", "u32");
          for (let T = 0; T < t.length; T++) _.registerUniform(`sizeInConcatAxis${T}`, "u32");
          return _.declareVariables(...s, m);
        })()}

  ${Bh(i.length, y)}

  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    var indices = ${m.offsetToIndices("global_idx")};

    let inputIndex = calculateInputIndex(${g});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${i.length}u>(${y});
      ${g} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${Dh(s, m)}
  }`;
        return { name: "Concat", shaderCache: { hint: `${e}`, inputDependencies: d }, getRunData: () => ({ outputs: [{ dims: r, dataType: n }], dispatchGroup: { x: Math.ceil(o / 64) }, programUniforms: p }), getShaderSource: b };
      }, _d = (t, e) => {
        let r = t.inputs, n = r[0].dims, o = k2.normalizeAxis(e.axis, n.length);
        zh(r, o);
        let i = n.slice();
        i[o] = r.reduce((u, d) => u + (d.dims.length > o ? d.dims[o] : 0), 0);
        let s = r.filter((u) => k2.size(u.dims) > 0);
        t.compute(Mh(s, o, i, r[0].dataType), { inputs: s });
      }, wd = (t) => ee({ axis: t.axis });
    });
    St = V(() => {
      J();
      re();
      Qe2 = (t, e, r = "f32") => {
        switch (t.activation) {
          case "Relu":
            return `value = max(value, ${e}(0.0));`;
          case "Sigmoid":
            return `value = (${e}(1.0) / (${e}(1.0) + exp(-value)));`;
          case "Clip":
            return `value = clamp(value, ${e}(${r}(uniforms.clip_min)), ${e}(${r}(uniforms.clip_max)));`;
          case "HardSigmoid":
            return `value = max(${e}(0.0), min(${e}(1.0), ${r}(uniforms.alpha) * value + ${r}(uniforms.beta)));`;
          case "LeakyRelu":
            return `value = select(${r}(uniforms.alpha) * value, value, value >= ${e}(0.0));`;
          case "Tanh":
            return `let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;
          case "":
            return "";
          default:
            throw new Error(`Unsupported activation ${t.activation}`);
        }
      }, Ye = (t, e) => {
        t.activation === "Clip" ? e.push({ type: 1, data: t.clipMax }, { type: 1, data: t.clipMin }) : t.activation === "HardSigmoid" ? e.push({ type: 1, data: t.alpha }, { type: 1, data: t.beta }) : t.activation === "LeakyRelu" && e.push({ type: 1, data: t.alpha });
      }, Xe = (t, e) => {
        t.activation === "Clip" ? e.push({ name: "clip_max", type: "f32" }, { name: "clip_min", type: "f32" }) : t.activation === "HardSigmoid" ? e.push({ name: "alpha", type: "f32" }, { name: "beta", type: "f32" }) : t.activation === "LeakyRelu" && e.push({ name: "alpha", type: "f32" });
      }, rn2 = (t) => {
        let e = t?.activation || "";
        if (e === "HardSigmoid") {
          let [r, n] = t?.activation_params || [0.2, 0.5];
          return { activation: e, alpha: r, beta: n };
        } else if (e === "Clip") {
          let [r, n] = t?.activation_params || [As2, Es2];
          return { activation: e, clipMax: n, clipMin: r };
        } else if (e === "LeakyRelu") {
          let [r] = t?.activation_params || [0.01];
          return { activation: e, alpha: r };
        }
        return { activation: e };
      };
    });
    nn2 = V(() => {
      ke = (t, e) => {
        switch (t) {
          case 1:
            return e;
          case 2:
            return `vec2<${e}>`;
          case 3:
            return `vec3<${e}>`;
          case 4:
            return `vec4<${e}>`;
          default:
            throw new Error(`${t}-component is not supported.`);
        }
      }, $d = (t) => `
      ${t ? "value = value + getBiasByOutputCoords(coords);" : ""}
      `;
    });
    Sd = V(() => {
      xd = (t) => `
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${t}.x), i32(${t}.y), i32(${t}.z), 1));
}
`;
    });
    an2 = V(() => {
      J();
      re();
      oe();
      St();
      ir2 = (t, e, r, n, o) => {
        let i = n - r;
        return `
      ${Array.from({ length: r }).map((s, u) => `
      if (${j(e.shape, u, e.rank)} != 1) {
        ${e.indicesSet(t, u, j(o, u + i, n))}
      } else {
        ${e.indicesSet(t, u, 0)}
      }`).join("")}
`;
      }, on2 = (t, e, r, n, o = false, i) => {
        let s = t[0].dims, u = t[1].dims, d = s[s.length - 2], c = u[u.length - 1], p = s[s.length - 1], m = fe(c), g = fe(p), y = fe(d), b = k2.size(r) / m / y, _ = t.length > 2, T = n ? n.slice(0, -2) : r.slice(0, -2), $2 = [k2.size(T), d, c], S = [{ type: 12, data: b }, { type: 12, data: d }, { type: 12, data: c }, { type: 12, data: p }];
        Ye(e, S), S.push(...W(T, s, u)), _ && S.push(...W(t[2].dims)), S.push(...W($2));
        let I = (E) => {
          let A = Qr2("batch_dims", t[0].dataType, T.length), z2 = O("a", t[0].dataType, s.length, g), v = O("b", t[1].dataType, u.length, m), R = U("output", t[0].dataType, $2.length, m), N = we(R.type.tensor), F = Qe2(e, R.type.value, N), q = [z2, v], X = "";
          if (_) {
            let Q2 = o ? m : 1;
            q.push(O("bias", t[2].dataType, t[2].dims.length, Q2)), X = `${o ? `value += bias[col / ${Q2}];` : `value += ${R.type.value}(bias[row + i]);`}`;
          }
          let B = [{ name: "output_size", type: "u32" }, { name: "M", type: "u32" }, { name: "N", type: "u32" }, { name: "K", type: "u32" }];
          Xe(e, B);
          let L = () => {
            let Q2 = `var a_data: ${z2.type.value};`;
            for (let Y = 0; Y < g; Y++) Q2 += `
              let b_data${Y} = b[(b_offset + (k + ${Y}) * uniforms.N + col) / ${m}];`;
            for (let Y = 0; Y < y; Y++) {
              Q2 += `a_data = a[(a_offset + (row + ${Y}) * uniforms.K + k) / ${g}];`;
              for (let Z = 0; Z < g; Z++) Q2 += `
            values[${Y}] = fma(${v.type.value}(a_data${g === 1 ? "" : `[${Z}]`}), b_data${Z}, values[${Y}]);
`;
            }
            return Q2;
          };
          return `
  ${E.registerUniforms(B).registerInternalVariables(A).declareVariables(...q, R)}
  ${E.mainStart()}
    ${E.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${m})) * ${m};
    var index1 = global_idx / (uniforms.N / ${m});
    let stride1 = uniforms.M / ${y};
    let row = (index1 % stride1) * ${y};
    let batch = index1 / stride1;

    ${r.length === 2 ? "" : `let batch_indices = ${A.offsetToIndices("batch")};`}

    var a_indices: ${z2.type.indices};
    ${ir2("a_indices", z2, z2.rank - 2, A.rank, "batch_indices")}
    ${z2.indicesSet("a_indices", z2.rank - 2, 0)}
    ${z2.indicesSet("a_indices", z2.rank - 1, 0)}
    let a_offset = ${z2.indicesToOffset("a_indices")};

    var b_indices: ${v.type.indices};
    ${ir2("b_indices", v, v.rank - 2, A.rank, "batch_indices")}
    ${v.indicesSet("b_indices", v.rank - 2, 0)}
    ${v.indicesSet("b_indices", v.rank - 1, 0)}
    let b_offset = ${v.indicesToOffset("b_indices")};
    var values: array<${R.type.value}, ${y}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${g}) {
      ${L()}
    }
    for (var i = 0u; i < ${y}u; i++) {
      var value = values[i];
      ${X}
      ${F}
      let cur_indices = ${R.type.indices}(batch, row + i, col);
      let offset = ${R.indicesToOffset("cur_indices")};
      ${R.setByOffset(`offset / ${m}`, "value")};
    }
  }
  `;
        };
        return { name: "MatMulNaive", shaderCache: { hint: `${e.activation};${m};${g};${y};${o}`, inputDependencies: _ ? ["rank", "rank", "rank"] : ["rank", "rank"] }, getRunData: () => ({ outputs: [{ dims: i ? i(r) : r, dataType: t[0].dataType }], dispatchGroup: { x: Math.ceil(b / 64) }, programUniforms: S }), getShaderSource: I };
      };
    });
    sn2 = V(() => {
      J();
      re();
      oe();
      St();
      an2();
      nn2();
      Rh = (t, e) => t ? `
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${e ? ", batchIndices" : ""});
        ` : `
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${e ? ", batchIndices" : ""});
        `, Uh = (t, e) => t ? `
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${e === 3 ? "" : "let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${e === 3 ? "" : "acc[i] = BCached3 * ACached3[i] + acc[i];"}
        }` : `
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${e === 3 ? "" : "acc[i] = BCached3 * ACached.w + acc[i];"}
        }`, vo = (t, e, r = "f32", n, o = false, i = 32, s = false, u = 32) => {
        let d = e[1] * t[1], c = e[0] * t[0], p = o ? d : i, m = o ? i : d, g = p / e[0], y = i / e[1];
        if (!((o && g === 4 && t[1] === 4 || !o && (g === 3 || g === 4)) && p % e[0] === 0 && i % e[1] === 0 && t[0] === 4)) throw new Error(`If transposeA ${o} is true, innerElementSize ${g} and workPerThread[1] ${t[1]} must be 4.
      Otherwise, innerElementSize ${g} must be 3 or 4.
  tileAWidth ${p} must be divisible by workgroupSize[0]${e[0]}. tileInner ${i} must be divisible by workgroupSize[1] ${e[1]}. colPerThread ${t[0]} must be 4.`);
        return `
var<workgroup> mm_Asub: array<array<vec${g}<${r}>, ${p / g}>, ${m}>;
var<workgroup> mm_Bsub: array<array<vec4<${r}>, ${c / t[0]}>, ${i}>;

const rowPerThread = ${t[1]};
const colPerThread = ${t[0]};
const innerElementSize = ${g};
const tileInner = ${i};

@compute @workgroup_size(${e[0]}, ${e[1]}, ${e[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${s ? "0" : "i32(globalId.z)"};
  ${n ? `let batchIndices = ${n.offsetToIndices("u32(batch)")};` : ""}
  let globalRowStart = i32(workgroupId.y) * ${d};

  let num_tiles = ${s ? `${Math.ceil(u / i)}` : "(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${s ? `i32(globalId.z) * ${u}` : "0"};

  var acc: array<vec4<${r}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${y};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${Rh(o, n)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${y}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${n ? ", batchIndices" : ""});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${g === 3 ? "" : "let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${Uh(o, g)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`;
      }, Td = (t, e) => t ? `
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${e ? ", batchIndices" : ""});
            ` : `
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${e ? ", batchIndices" : ""});
            `, Nh = (t) => t ? "let ACached = mm_Asub[k][tileRow + innerRow];" : "let ACached = mm_Asub[tileRow + innerRow][k];", $o = (t, e, r = "f32", n, o = false, i = 32, s = false, u = 32, d = false) => {
        let c = t[1] * e[1], p = t[0] * e[0], m = o ? c : i, g = o ? i : c;
        if (!(g % e[1] === 0 && m % e[0] === 0 && i % e[1] === 0)) throw new Error(`tileAHight ${g} must be divisible by workgroupSize[1]${e[1]}, tileAWidth ${m} must be divisible by workgroupSize[0]${e[0]}, tileInner ${i} must be divisible by workgroupSize[1]${e[1]}`);
        let y = g / e[1], b = m / e[0], _ = i / e[1], T = d ? `
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${c};
    let globalColStart = i32(workgroupId.x) * ${p};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${g}; inputRow = inputRow + ${e[1]}) {
        for (var inputCol = localCol; inputCol < ${m}; inputCol = inputCol + ${e[0]}) {
          ${Td(o, n)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${i}; inputRow = inputRow + ${e[1]}) {
            for (var inputCol = localCol; inputCol < ${p}; inputCol = inputCol + ${e[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${n ? ", batchIndices" : ""});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${r}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${e[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${o ? `mm_Asub[k][localRow + innerRow * ${e[1]}];` : `mm_Asub[localRow + innerRow * ${e[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${e[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${e[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    ` : `
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${c};

let tileRowA = i32(localId.y) * ${y};
let tileColA = i32(localId.x) * ${b};
let tileRowB = i32(localId.y) * ${_};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${y}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${b}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${Td(o, n)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${_}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${n ? ", batchIndices" : ""});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${r}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${Nh(o)}
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];
      }
    }
  }

  workgroupBarrier();
}

for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
    mm_write(batch, globalRow + innerRow, globalCol + innerCol,
        acc[innerRow][innerCol]);
  }
}
`;
        return `
  var<workgroup> mm_Asub : array<array<${r}, ${m}>, ${g}>;
  var<workgroup> mm_Bsub : array<array<${r}, ${p}>, ${i}>;
  const rowPerThread = ${t[1]};
  const colPerThread = ${t[0]};
  const tileInner = ${i};

@compute @workgroup_size(${e[0]}, ${e[1]}, ${e[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${s ? "0" : "i32(globalId.z)"};
    ${n ? `let batchIndices = ${n.offsetToIndices("u32(batch)")};` : ""}
    let num_tiles = ${s ? `${Math.ceil(u / i)}` : "(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${s ? `i32(globalId.z) * ${u}` : "0"};

    var acc : array<array<${r}, colPerThread>, rowPerThread>;
    ${T}
  }
`;
      }, Vh = (t, e, r, n, o = false) => {
        let [i, s, u, d] = n, c = we(n[0].type.tensor);
        return `
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${i.type.indices}) -> ${ke(t, c)} {
      var value = ${ke(t, c)}(0.0);
      let col = colIn * ${t};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${s.type.indices};
        ${ir2("aIndices", s, s.rank - 2, i.rank, "batchIndices")}
        ${s.indicesSet("aIndices", s.rank - 2, "u32(row)")}
        ${s.indicesSet("aIndices", s.rank - 1, "u32(colIn)")}
        value = ${s.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${i.type.indices}) -> ${ke(t, c)} {
      var value = ${ke(t, c)}(0.0);
      let col = colIn * ${t};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${u.type.indices};
        ${ir2("bIndices", u, u.rank - 2, i.rank, "batchIndices")}
        ${u.indicesSet("bIndices", u.rank - 2, "u32(row)")}
        ${u.indicesSet("bIndices", u.rank - 1, "u32(colIn)")}
        value = ${u.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${ke(t, c)}) {
      let col = colIn * ${t};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${e ? `value = value + ${o ? "bias[colIn]" : `${ke(t, c)}(bias[row])`};` : ""}
        ${r}
        ${d.setByIndices("vec3<u32>(coords)", "value")}
      }
    }
    `;
      }, ar2 = (t, e, r, n, o = false, i) => {
        let s = t[0].dims, u = t[1].dims, d = s.slice(0, -2), c = u.slice(0, -2), p = n ? n.slice(0, -2) : r.slice(0, -2), m = k2.size(p), g = s[s.length - 2], y = s[s.length - 1], b = u[u.length - 1], _ = y % 4 === 0 && b % 4 === 0, T = g <= 8 ? [4, 1, 1] : [4, 4, 1], x = [8, 8, 1], $2 = [Math.ceil(b / x[0] / T[0]), Math.ceil(g / x[1] / T[1]), Math.ceil(m / x[2] / T[2])], S = _ ? 4 : 1, I = [...d, g, y / S], E = I.length, A = [...c, y, b / S], z2 = A.length, v = [m, g, b / S], R = [{ type: 6, data: g }, { type: 6, data: b }, { type: 6, data: y }];
        Ye(e, R), R.push(...W(p, I, A));
        let N = ["rank", "rank"], F = t.length > 2;
        F && (R.push(...W(t[2].dims)), N.push("rank")), R.push(...W(v));
        let q = (X) => {
          let B = p.length, L = Qr2("batchDims", t[0].dataType, B, 1), Q2 = we(t[0].dataType), Y = O("a", t[0].dataType, E, S), Z = O("b", t[1].dataType, z2, S), te = U("result", t[0].dataType, v.length, S), ae = [Y, Z];
          if (F) {
            let G = o ? S : 1;
            ae.push(O("bias", t[2].dataType, t[2].dims.length, G));
          }
          let le2 = [{ name: "dim_a_outer", type: "i32" }, { name: "dim_b_outer", type: "i32" }, { name: "dim_inner", type: "i32" }];
          Xe(e, le2);
          let Me = we(te.type.tensor), ve = Qe2(e, te.type.value, Me), M = Vh(S, F, ve, [L, Y, Z, te], o);
          return `
  ${X.registerUniforms(le2).registerInternalVariables(L).declareVariables(...ae, te)}
  ${M}
  ${_ ? vo(T, x, Q2, L) : $o(T, x, Q2, L)}
                   `;
        };
        return { name: "MatMul", shaderCache: { hint: `${T};${e.activation};${_};${o}`, inputDependencies: N }, getRunData: () => ({ outputs: [{ dims: i ? i(r) : r, dataType: t[0].dataType }], dispatchGroup: { x: $2[0], y: $2[1], z: $2[2] }, programUniforms: R }), getShaderSource: q };
      };
    });
    Cd = V(() => {
      J();
      nt();
      oe();
      St();
      nn2();
      Sd();
      sn2();
      Lh = (t, e, r, n, o = false, i, s = 4, u = 4, d = 4, c = "f32") => {
        let p = (N) => {
          switch (N) {
            case 1:
              return "resData = x[xIndex];";
            case 3:
              return `resData = vec3<${c}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;
            case 4:
              return "resData = x[xIndex / 4];";
            default:
              throw new Error(`innerElementSize ${N} is not supported.`);
          }
        }, m = (N) => {
          switch (N) {
            case 1:
              return "return w[row * i32(uniforms.w_shape[3]) + colIn];";
            case 4:
              return "return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";
            default:
              throw new Error(`innerElementSize ${N} is not supported.`);
          }
        }, g = t ? `
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    ` : `
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `, y = t ? `
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    ` : `
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `, b = t ? "i32(uniforms.x_shape[1])" : "i32(uniforms.x_shape[2])", _ = t ? "i32(uniforms.x_shape[2])" : "i32(uniforms.x_shape[3])", T = t ? "row" : "col", x = t ? "col" : "row", $2 = `
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${t ? "i32(uniforms.result_shape[2])" : "i32(uniforms.result_shape[3])"};
    let outRow = ${T} / outWidth;
    let outCol = ${T} % outWidth;

    let WRow = ${x} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${x} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${x} % inChannels;
    var resData = ${ke(s, c)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${b} && xCol >= 0 && xCol < ${_}) {
      ${g}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${p(s)}
    }
    return resData;`, S = t ? e && n ? `
    let col = colIn * ${s};
    ${$2}` : `
    let col = colIn * ${s};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${$2}
    }
    return ${ke(s, c)}(0.0);` : n && r ? `
    let col = colIn * ${s};
    ${$2}` : `
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${$2}
    }
    return ${ke(s, c)}(0.0);`, I = t ? n && r ? m(u) : `
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${m(u)}
    }
    return ${ke(u, c)}(0.0);` : `
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${m(u)}
    }
    return ${ke(u, c)}(0.0);`, E = ke(d, c), A = t ? ke(s, c) : ke(u, c), z2 = t ? ke(u, c) : ke(s, c), v = Qe2(i, E, c);
        return `
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${A} {
      ${t ? S : I}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${z2} {
      ${t ? I : S}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${E}) {
      let col = colIn * ${d};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${t ? "i32(uniforms.result_shape[2])" : "i32(uniforms.result_shape[3])"};
      ${y}
      ${$d(o)}
      ${v}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`;
      }, Id = (t, e, r, n, o, i, s, u, d) => {
        let c = e.format === "NHWC", p = c ? t[0].dims[3] : t[0].dims[1], m = r[0], g = c ? r[2] : r[3], y = c ? r[1] : r[2], b = c ? r[3] : r[1], _ = c && (p % 4 === 0 || p % 3 === 0) && b % 4 === 0, T = c ? b : g * y, x = c ? g * y : b, $2 = [8, 8, 1], S = n <= 8 ? [4, 1, 1] : [4, 4, 1], I = [Math.ceil(T / $2[0] / S[0]), Math.ceil(x / $2[1] / S[1]), Math.ceil(m / $2[2] / S[2])];
        ie2("verbose", () => `[conv2d_mm_webgpu] dispatch = ${I}`);
        let E = _ ? c && p % 4 !== 0 ? 3 : 4 : 1, A = $2[1] * S[1], z2 = $2[0] * S[0], v = Math.max($2[0] * E, $2[1]), R = n % A === 0, N = o % z2 === 0, F = i % v === 0, q = _ ? [E, 4, 4] : [1, 1, 1], X = [{ type: 6, data: n }, { type: 6, data: o }, { type: 6, data: i }, { type: 6, data: [e.pads[0], e.pads[1]] }, { type: 6, data: e.strides }, { type: 6, data: e.dilations }];
        Ye(e, X), X.push(...W(t[0].dims, t[1].dims));
        let B = ["rank", "rank"];
        s && (X.push(...W(t[2].dims)), B.push("rank")), X.push(...W(r));
        let L = (Q2) => {
          let Y = [{ name: "dim_a_outer", type: "i32" }, { name: "dim_b_outer", type: "i32" }, { name: "dim_inner", type: "i32" }, { name: "pad", type: "i32", length: 2 }, { name: "stride", type: "i32", length: 2 }, { name: "dilation", type: "i32", length: 2 }];
          Xe(e, Y);
          let Z = _ ? 4 : 1, te = we(t[0].dataType), ae = `
      fn setOutputAtIndex(flatIndex : i32, value : ${_ ? `vec4<${te}>` : te}) {
        result[flatIndex] = ${_ ? `vec4<${te}>` : te}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${_ ? `vec4<${te}>` : te}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${_ ? "/ 4" : ""}, value);
      }`, le2 = O("x", t[0].dataType, t[0].dims.length, E === 3 ? 1 : E), Me = O("w", t[1].dataType, t[1].dims.length, Z), ve = [le2, Me], M = U("result", t[0].dataType, r.length, Z);
          if (s) {
            let G = O("bias", t[2].dataType, t[2].dims.length, Z);
            ve.push(G), ae += `
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${_ ? `vec4<${te}>` : te} {
          return bias[coords.${c ? "w" : "y"}${_ ? "/ 4" : ""}];
        }`;
          }
          return `
        ${xd("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${Q2.registerUniforms(Y).declareVariables(...ve, M)}
        ${ae}
        ${Lh(c, R, N, F, s, e, q[0], q[1], q[2], te)}
        ${_ ? vo(S, $2, te, void 0, !c, v) : $o(S, $2, te, void 0, !c, v, false, void 0, u)}`;
        };
        return { name: "Conv2DMatMul", shaderCache: { hint: `${e.cacheKey};${E};${_};${R};${N};${F};${A};${z2};${v}`, inputDependencies: B }, getRunData: () => ({ outputs: [{ dims: d ? d(r) : r, dataType: t[0].dataType }], dispatchGroup: { x: I[0], y: I[1], z: I[2] }, programUniforms: X }), getShaderSource: L };
      };
    });
    Od = V(() => {
      J();
      nt();
      re();
      oe();
      St();
      nn2();
      Wh = (t) => {
        let e = 1;
        for (let r = 0; r < t.length; r++) e *= t[r];
        return e;
      }, Ad = (t) => typeof t == "number" ? [t, t, t] : t, un2 = (t, e) => e <= 1 ? t : t + (t - 1) * (e - 1), Gh = (t, e, r, n = 1) => {
        let o = un2(e, n);
        return Math.floor((t[0] * (r - 1) - r + o) / 2);
      }, Ed = (t, e, r, n, o) => {
        o == null && (o = Gh(t, e[0], n[0]));
        let i = [0, 0, 0, r];
        for (let s = 0; s < 3; s++) t[s] + 2 * o >= e[s] && (i[s] = Math.trunc((t[s] - e[s] + 2 * o) / n[s] + 1));
        return i;
      }, Hh = (t, e, r, n, o, i, s, u, d, c) => {
        let p, m, g, y;
        if (t === "VALID" && (t = 0), typeof t == "number") {
          p = { top: t, bottom: t, left: t, right: t, front: t, back: t };
          let b = Ed([e, r, n, 1], [u, d, c], 1, [o, i, s], t);
          m = b[0], g = b[1], y = b[2];
        } else if (Array.isArray(t)) {
          if (!t.every((_, T, x) => _ === x[0])) throw Error(`Unsupported padding parameter: ${t}`);
          p = { top: t[0], bottom: t[1], left: t[2], right: t[3], front: t[4], back: t[5] };
          let b = Ed([e, r, n, 1], [u, d, c], 1, [o, i, s], t[0]);
          m = b[0], g = b[1], y = b[2];
        } else if (t === "SAME_UPPER") {
          m = Math.ceil(e / o), g = Math.ceil(r / i), y = Math.ceil(n / s);
          let b = (m - 1) * o + u - e, _ = (g - 1) * i + d - r, T = (y - 1) * s + c - n, x = Math.floor(b / 2), $2 = b - x, S = Math.floor(_ / 2), I = _ - S, E = Math.floor(T / 2), A = T - E;
          p = { top: S, bottom: I, left: E, right: A, front: x, back: $2 };
        } else throw Error(`Unknown padding parameter: ${t}`);
        return { padInfo: p, outDepth: m, outHeight: g, outWidth: y };
      }, kd = (t, e, r, n, o, i = false, s = "channelsLast") => {
        let u, d, c, p, m;
        if (s === "channelsLast") [u, d, c, p, m] = t;
        else if (s === "channelsFirst") [u, m, d, c, p] = t;
        else throw new Error(`Unknown dataFormat ${s}`);
        let [g, , y, b, _] = e, [T, x, $2] = Ad(r), [S, I, E] = Ad(n), A = un2(y, S), z2 = un2(b, I), v = un2(_, E), { padInfo: R, outDepth: N, outHeight: F, outWidth: q } = Hh(o, d, c, p, T, x, $2, A, z2, v), X = i ? g * m : g, B = [0, 0, 0, 0, 0];
        return s === "channelsFirst" ? B = [u, X, N, F, q] : s === "channelsLast" && (B = [u, N, F, q, X]), { batchSize: u, dataFormat: s, inDepth: d, inHeight: c, inWidth: p, inChannels: m, outDepth: N, outHeight: F, outWidth: q, outChannels: X, padInfo: R, strideDepth: T, strideHeight: x, strideWidth: $2, filterDepth: y, filterHeight: b, filterWidth: _, effectiveFilterDepth: A, effectiveFilterHeight: z2, effectiveFilterWidth: v, dilationDepth: S, dilationHeight: I, dilationWidth: E, inShape: t, outShape: B, filterShape: e };
      }, Pd = (t, e, r, n, o, i) => {
        let s = i === "channelsLast"; s ? t[0].dims[3] : t[0].dims[1]; let c = [64, 1, 1], p = { x: r.map(($2, S) => S) }, m = [Math.ceil(Wh(p.x.map(($2) => r[$2])) / c[0]), 1, 1];
        ie2("verbose", () => `[conv3d_naive_webgpu] dispatch = ${m}`);
        let g = 1, y = k2.size(r), b = [{ type: 12, data: y }, { type: 12, data: n }, { type: 12, data: o }, { type: 12, data: e.strides }, { type: 12, data: e.dilations }];
        Ye(e, b), b.push(...W(t[0].dims, t[1].dims));
        let _ = ["rank", "rank"], T = t.length === 3;
        T && (b.push(...W(t[2].dims)), _.push("rank")), b.push(...W(r));
        let x = ($2) => {
          let S = [{ name: "output_size", type: "u32" }, { name: "filter_dims", type: "u32", length: n.length }, { name: "pads", type: "u32", length: o.length }, { name: "strides", type: "u32", length: e.strides.length }, { name: "dilations", type: "u32", length: e.dilations.length }];
          Xe(e, S);
          let I = 1, E = we(t[0].dataType), A = O("x", t[0].dataType, t[0].dims.length, g), z2 = O("W", t[1].dataType, t[1].dims.length, I), v = [A, z2], R = U("result", t[0].dataType, r.length, I), N = "";
          if (T) {
            let X = O("bias", t[2].dataType, t[2].dims.length, I);
            v.push(X), N += `
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${E} {
          return bias[${s ? j("coords", 4, 5) : j("coords", 1, 5)}${""}];
        }`;
          }
          let F = ke(g, E), q = Qe2(e, F, E);
          return `
            ${N}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${A.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${z2.getByIndices("aIndices")};
            }
          ${$2.registerUniforms(S).declareVariables(...v, R)}
          ${$2.mainStart()}
          ${$2.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${R.offsetToIndices("global_idx")};
              let batch = ${j("coords", 0, A.rank)};
              let d2 = ${s ? j("coords", A.rank - 1, A.rank) : j("coords", 1, A.rank)};
              let xFRCCorner = vec3<u32>(${s ? j("coords", 1, A.rank) : j("coords", 2, A.rank)},
              ${s ? j("coords", 2, A.rank) : j("coords", 3, A.rank)},
              ${s ? j("coords", 3, A.rank) : j("coords", 4, A.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${s ? j("uniforms.x_shape", 1, A.rank) : j("uniforms.x_shape", 2, A.rank)};
              let xShapeZ = ${s ? j("uniforms.x_shape", 2, A.rank) : j("uniforms.x_shape", 3, A.rank)};
              let xShapeW = ${s ? j("uniforms.x_shape", 3, A.rank) : j("uniforms.x_shape", 4, A.rank)};
              let xShapeU = ${s ? j("uniforms.x_shape", 4, A.rank) : j("uniforms.x_shape", 1, A.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = 0.0;
              for (var wF = 0u; wF < uniforms.filter_dims[0]; wF++) {
                let xF = xFCorner + wF * uniforms.dilations[0];
                if (xF < 0 || xF >= xShapeY) {
                  continue;
                }

                for (var wR = 0u; wR < uniforms.filter_dims[1]; wR++) {
                  let xR = xRCorner + wR * uniforms.dilations[1];
                  if (xR < 0 || xR >= xShapeZ) {
                    continue;
                  }

                  for (var wC = 0u; wC < uniforms.filter_dims[2]; wC++) {
                    let xC = xCCorner + wC * uniforms.dilations[2];
                    if (xC < 0 || xC >= xShapeW) {
                      continue;
                    }

                    for (var d1 = 0u; d1 < inputDepthNearestVec4; d1 += 4) {
                      ${s ? `let xValues = vec4<f32>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            ` : `let xValues = vec4<f32>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<f32>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${s ? `value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);` : `value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${s ? `let xValues = vec2<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      ` : `let xValues = vec2<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${s ? `let xValues = vec3<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      ` : `let xValues = vec3<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${T ? "value = value + getBiasByOutputCoords(coords)" : ""};
              ${q}
              result[global_idx] = f32(value);
          }`;
        };
        return { name: "Conv3DNaive", shaderCache: { hint: `${e.cacheKey};${s};${g};${T}`, inputDependencies: _ }, getRunData: () => ({ outputs: [{ dims: r, dataType: t[0].dataType }], dispatchGroup: { x: m[0], y: m[1], z: m[2] }, programUniforms: b }), getShaderSource: x };
      };
    });
    Dd = V(() => {
      J();
      re();
      oe();
      St();
      zd = (t, e, r, n) => {
        let o = t.length > 2, i = o ? "value += b[output_channel];" : "", s = t[0].dims, u = t[1].dims, d = e.format === "NHWC", c = d ? r[3] : r[1], p = c / e.group, m = d && p >= 4 ? fe(c) : 1, g = k2.size(r) / m, y = [{ type: 12, data: g }, { type: 12, data: e.dilations }, { type: 12, data: [e.strides[0], e.strides[1]] }, { type: 12, data: [e.pads[0], e.pads[1]] }, { type: 12, data: p }];
        Ye(e, y), y.push(...W(s, [u[0], u[1], u[2], u[3] / m]));
        let b = o ? ["rank", "rank", "rank"] : ["rank", "rank"];
        y.push(...W([r[0], r[1], r[2], r[3] / m]));
        let _ = (T) => {
          let x = U("output", t[0].dataType, r.length, m), $2 = we(x.type.tensor), S = Qe2(e, x.type.value, $2), I = O("x", t[0].dataType, s.length), E = O("w", t[1].dataType, u.length, m), A = [I, E];
          o && A.push(O("b", t[2].dataType, t[2].dims, m));
          let z2 = [{ name: "output_size", type: "u32" }, { name: "dilations", type: "u32", length: e.dilations.length }, { name: "strides", type: "u32", length: 2 }, { name: "pads", type: "u32", length: 2 }, { name: "output_channels_per_group", type: "u32" }];
          Xe(e, z2);
          let v = d ? `
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[0]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[1]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[1]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[2]; wInChannel++) {
            let input_channel = in_channel_offset + wInChannel;
            let xVal = ${I.get("batch", "xHeight", "xWidth", "input_channel")};
            let wVal = ${E.get("wHeight", "wWidth", "wInChannel", "output_channel")};
            value += xVal * wVal;
          }
        }
      }
      ` : `
      for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
        let input_channel = in_channel_offset + wInChannel;
        for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
          let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

          if (xHeight < 0u || xHeight >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
            let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
            if (xWidth < 0u || xWidth >= uniforms.x_shape[3]) {
              continue;
            }

            let xVal = ${I.get("batch", "input_channel", "xHeight", "xWidth")};
            let wVal = ${E.get("output_channel", "wInChannel", "wHeight", "wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;
          return `
  ${T.registerUniforms(z2).declareVariables(...A, x)}

  ${T.mainStart()}
    ${T.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${x.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${d ? 3 : 1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${d ? 1 : 2}], outputIndices[${d ? 2 : 3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${m} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${d ? 2 : 1}];

    var value: ${x.type.value} = ${x.type.value}(0);
    ${v}
    ${i}
    ${S}
    ${x.setByOffset("global_idx", "value")}
  }`;
        };
        return { name: "GroupedConv", shaderCache: { hint: `${e.cacheKey}_${m}`, inputDependencies: b }, getRunData: () => ({ outputs: [{ dims: n ? n(r) : r, dataType: t[0].dataType }], dispatchGroup: { x: Math.ceil(g / 64) }, programUniforms: y }), getShaderSource: _ };
      }, Bd = (t, e, r, n) => {
        let o = t.length > 2, i = fe(r[3]), s = fe(r[2]), u = k2.size(r) / i / s, d = [t[0].dims[0], t[0].dims[1], t[0].dims[2], t[0].dims[3] / i], c = [t[1].dims[0], t[1].dims[1], t[1].dims[2], t[1].dims[3] / i], p = [r[0], r[1], r[2], r[3] / i], m = [{ type: 12, data: u }, { type: 6, data: [e.strides[0], e.strides[1]] }, { type: 6, data: [e.pads[0], e.pads[1]] }];
        Ye(e, m), m.push(...W(d, c, p));
        let g = (s - 1) * e.strides[1] + c[1], y = (b) => {
          let _ = U("output", t[0].dataType, p.length, i), T = we(_.type.tensor), x = Qe2(e, _.type.value, T), $2 = O("x", t[0].dataType, d.length, i), S = O("w", t[1].dataType, c.length, i), I = [$2, S];
          o && I.push(O("b", t[2].dataType, t[2].dims, i));
          let E = o ? "value += b[output_channel];" : "", A = [{ name: "output_size", type: "u32" }, { name: "strides", type: "i32", length: 2 }, { name: "pads", type: "i32", length: 2 }];
          return Xe(e, A), `
  ${b.registerUniforms(A).declareVariables(...I, _)}
  ${b.mainStart()}
    ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${s}u;
    let col = (index1 % width1) * ${s}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${$2.type.value}, ${g}>;
    var values: array<${_.type.value}, ${s}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${c[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${g}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${$2.get("batch", "u32(x_height)", "u32(x_width)", "input_channel")};
          } else {
            x_vals[i] = ${$2.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${c[1]}; w_width++) {
          let w_val = ${S.get("w_height", "w_width", "0", "output_channel")};
          for (var i = 0u; i < ${s}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${s}u; i++) {
      var value = values[i];
      ${E}
      ${x}
      ${_.set("batch", "row", "col + i", "output_channel", "value")};
    }
  }`;
        };
        return { name: "GroupedConv-Vectorize", shaderCache: { hint: `${e.cacheKey};${i};${s};${g};${c[0]};${c[1]}`, inputDependencies: o ? ["rank", "rank", "type"] : ["rank", "rank"] }, getRunData: () => ({ outputs: [{ dims: n ? n(r) : r, dataType: t[0].dataType }], dispatchGroup: { x: Math.ceil(u / 64) }, programUniforms: m }), getShaderSource: y };
      };
    });
    Rd = V(() => {
      re();
      Cd();
      Od();
      sn2();
      Dd();
      St();
      an2();
      pt();
      Fh = (t, e, r, n, o, i) => {
        let s = t[0], u = t.slice(i ? 1 : 2, i ? 3 : 4), d = u.length, c = e[0], m = e.slice(2).map((b, _) => b + (b - 1) * (r[_] - 1)), y = u.map((b, _) => b + n[_] + n[_ + d]).map((b, _) => Math.floor((b - m[_] + o[_]) / o[_]));
        return y.splice(0, 0, s), y.splice(i ? 3 : 1, 0, c), y;
      }, xo = [2, 3, 1, 0], qh = (t, e) => {
        if (!t || t.length !== 2 && t.length !== 3) throw new Error("Conv requires 2 or 3 inputs");
        if (t[0].dims.length > 5) throw new Error("greater than 5D is not supported");
        if (t[0].dims.length !== t[1].dims.length) throw new Error("filter does not have same dimension as input");
        let r = t[0].dims[e.format === "NHWC" ? t[0].dims.length - 1 : 1], n = t[1].dims[1] * e.group;
        if (r !== n) throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");
        if (t.length === 3 && (t[2].dims.length !== 1 || t[1].dims[0] !== t[2].dims[0])) throw new Error("invalid bias");
        let o = t[0].dims.length - 2;
        if (e.dilations.length !== o) throw new Error(`dilations should be ${o}D`);
        if (e.strides.length !== o) throw new Error(`strides should be ${o}D`);
        if (e.pads.length !== o * 2) throw new Error(`pads should be ${o * 2}D`);
        if (e.kernelShape.length !== 0 && e.kernelShape.length !== t[1].dims.length - 2) throw new Error("invalid kernel shape");
      }, So = (t, e) => {
        let r = t.kernelShape.slice();
        r.length < e[1].dims.length - 2 && r.push(...Array(e[1].dims.length - 2 - r.length).fill(0));
        for (let i = 2; i < e[1].dims.length; ++i) r[i - 2] === 0 && (r[i - 2] = e[1].dims[i]);
        let n = t.pads.slice();
        zt2.adjustPadsBasedOnAutoPad(e[0].dims, t.strides, t.dilations, r, n, t.format === "NHWC", t.autoPad);
        let o = Object.assign({}, t);
        return Object.assign(o, { kernelShape: r, pads: n }), o;
      }, To = (t) => {
        let e = rn2(t), r = t.format, n = ["NOTSET", "VALID", "SAME_UPPER", "SAME_LOWER"][t.auto_pad], o = t.dilations, i = t.group, s = t.kernel_shape, u = t.pads, d = t.strides, c = t.w_is_const();
        return { autoPad: n, format: r, dilations: o, group: i, kernelShape: s, pads: u, strides: d, wIsConst: c, ...e, cacheKey: `${t.format};${e.activation};` };
      }, Md = (t, e, r, n) => {
        let o = r.format === "NHWC", i = Fh(e[0].dims, e[1].dims, r.dilations, r.pads, r.strides, o);
        if (r.group !== 1) {
          let A = [e[0]];
          if (o) {
            let v = t.kernelCustomData.wT ?? t.compute(Be(e[1], xo), { inputs: [1], outputs: [r.wIsConst ? -2 : -1] })[0];
            r.wIsConst && !t.kernelCustomData.wT && (t.kernelCustomData.wT = v), A.push(v);
          } else A.push(e[1]);
          e.length === 3 && A.push(e[2]), !t.adapterInfo.isArchitecture("ampere") && o && e[1].dims[0] === r.group && e[1].dims[1] === 1 && r.dilations[0] === 1 && r.dilations[1] === 1 ? t.compute(Bd(A, r, i, n), { inputs: A }) : t.compute(zd(A, r, i, n), { inputs: A });
          return;
        }
        let s = e.length === 3, u = e[0].dims[o ? 1 : 2], d = e[0].dims[o ? 2 : 3], c = e[0].dims[o ? 3 : 1], p = e[1].dims[2], m = e[1].dims[3], g = i[o ? 1 : 2], y = i[o ? 2 : 3], b = i[o ? 3 : 1], _ = o && p === u && m === d && r.pads[0] === 0 && r.pads[1] === 0;
        if (_ || p === 1 && m === 1 && r.dilations[0] === 1 && r.dilations[1] === 1 && r.strides[0] === 1 && r.strides[1] === 1 && r.pads[0] === 0 && r.pads[1] === 0) {
          let A = i[0], z2, v, R, N = [];
          if (o) {
            let X = t.kernelCustomData.wT ?? t.compute(Be(e[1], xo), { inputs: [1], outputs: [r.wIsConst ? -2 : -1] })[0];
            if (r.wIsConst && !t.kernelCustomData.wT && (t.kernelCustomData.wT = X), _) {
              let B = u * d * c;
              z2 = e[0].reshape([1, A, B]), v = X.reshape([1, B, b]), R = [1, A, b];
            } else z2 = e[0].reshape([A, u * d, c]), v = X.reshape([1, c, b]), R = [A, g * y, b];
            N.push(z2), N.push(v);
          } else z2 = e[0].reshape([A, c, u * d]), v = e[1].reshape([1, b, c]), R = [A, b, g * y], N.push(v), N.push(z2);
          s && N.push(e[2]);
          let F = R[2], q = N[0].dims[N[0].dims.length - 1];
          F < 8 && q < 8 ? t.compute(on2(N, r, i, R, o, n), { inputs: N }) : t.compute(ar2(N, r, i, R, o, n), { inputs: N });
          return;
        }
        let T = true, x = t.kernelCustomData.wT ?? t.compute(Be(e[1], xo), { inputs: [1], outputs: [r.wIsConst ? -2 : -1] })[0];
        r.wIsConst && !t.kernelCustomData.wT && (t.kernelCustomData.wT = x);
        let $2 = [e[0], x];
        s && $2.push(e[2]);
        let S = o ? g * y : b, I = o ? b : g * y, E = p * m * c;
        t.compute(Id($2, r, i, S, I, E, s, T, n), { inputs: $2 });
      }, Kh = (t, e) => {
        let r = e.format === "NHWC", n = [t.inputs[0].reshape(r ? [t.inputs[0].dims[0], 1, t.inputs[0].dims[1], t.inputs[0].dims[2]] : [t.inputs[0].dims[0], t.inputs[0].dims[1], 1, t.inputs[0].dims[2]]), t.inputs[1].reshape([t.inputs[1].dims[0], t.inputs[1].dims[1], 1, t.inputs[1].dims[2]])];
        t.inputs.length === 3 && n.push(t.inputs[2]);
        let o = [0, e.pads[0], 0, e.pads[1]], i = [1].concat(e.strides), s = [1].concat(e.dilations), u = [1].concat(e.kernelShape), d = So({ ...e, pads: o, strides: i, dilations: s, kernelShape: u }, n);
        Md(t, n, d, (c) => r ? [c[0], c[2], c[3]] : [c[0], c[1], c[3]]);
      }, jh = (t, e, r) => {
        let n = r.format === "NHWC" ? "channelsLast" : "channelsFirst", o = So(r, e), i = r.autoPad === "NOTSET" ? r.pads : r.autoPad, s = kd(e[0].dims, e[1].dims, r.strides, r.dilations, i, false, n);
        t.compute(Pd(e, o, s.outShape, [s.filterDepth, s.filterHeight, s.filterWidth], [s.padInfo.front, s.padInfo.top, s.padInfo.left], n));
      }, Io = (t, e) => {
        if (qh(t.inputs, e), t.inputs[0].dims.length === 3) Kh(t, e);
        else if (t.inputs[0].dims.length === 5) jh(t, t.inputs, e);
        else {
          let r = So(e, t.inputs);
          Md(t, t.inputs, r);
        }
      };
    });
    Nd = V(() => {
      J();
      nt();
      re();
      oe();
      Ud = (t, e, r) => {
        let n = t.length > 2, o = e.outputShape, i = e.format === "NHWC", s = e.group, u = t[1].dims, d = u[2] / s, c = u[3], p = i ? fe(d) : 1, m = i && c === 1 && d >= 4, g = m ? Math.floor(d / 4) * 4 : Math.floor(d / p) * p, y = d - g, b = i ? fe(c) : 1, _ = i ? c === 1 ? p : b : 1, T = k2.size(o) / b, x = [Math.ceil(T / 64), 1, 1];
        ie2("verbose", () => `[conv2d_backprop_webgpu] dispatch = ${x}`);
        let $2 = ["rank", "rank"], S = [e.strides[0], e.strides[1]], I = [e.kernelShape[i ? 1 : 2], e.kernelShape[i ? 2 : 3]], E = [e.dilations[0], e.dilations[1]], A = [I[0] + (e.dilations[0] <= 1 ? 0 : (e.kernelShape[i ? 1 : 2] - 1) * (e.dilations[0] - 1)), I[1] + (e.dilations[1] <= 1 ? 0 : (e.kernelShape[i ? 2 : 3] - 1) * (e.dilations[1] - 1))], z2 = [A[0] - 1 - Math.floor((e.pads[0] + e.pads[2]) / 2), A[1] - 1 - Math.floor((e.pads[1] + e.pads[3]) / 2)], v = [{ type: 12, data: T }, { type: 12, data: S }, { type: 12, data: I }, { type: 12, data: E }, { type: 12, data: A }, { type: 6, data: z2 }, { type: 12, data: g }, { type: 12, data: d }, { type: 12, data: c }, ...W(t[0].dims, t[1].dims)];
        n && (v.push(...W(t[2].dims)), $2.push("rank")), v.push(...W(o));
        let R = (N) => {
          let F = [{ name: "output_size", type: "u32" }, { name: "strides", type: "u32", length: S.length }, { name: "filter_dims", type: "u32", length: I.length }, { name: "dilations", type: "u32", length: I.length }, { name: "effective_filter_dims", type: "u32", length: A.length }, { name: "pads", type: "i32", length: z2.length }, { name: "input_channels_per_group_int", type: "u32" }, { name: "input_channels_per_group", type: "u32" }, { name: "output_channels_per_group", type: "u32" }], q = we(t[0].dataType), X = i ? 1 : 2, B = i ? 2 : 3, L = i ? 3 : 1, Q2 = O("W", t[1].dataType, t[1].dims.length, _), Y = O("Dy", t[0].dataType, t[0].dims.length, p), Z = [Y, Q2];
          n && Z.push(O("bias", t[2].dataType, [o[L]].length, b));
          let te = U("result", t[0].dataType, o.length, b), ae = () => {
            let ve = "";
            if (m) p === 4 ? ve += `
        let xValue = ${Y.getByOffset("x_offset")};
        let wValue = ${Q2.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;` : p === 2 ? ve += `
          dotProd = dotProd + dot(vec4<${q}>(${Y.getByOffset("x_offset")}, ${Y.getByOffset("x_offset + 1u")}), vec4<${q}>(${Q2.getByOffset("w_offset")}, ${Q2.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;` : p === 1 && (ve += `
          dotProd = dotProd + dot(vec4<${q}>(${Y.getByOffset("x_offset")}, ${Y.getByOffset("x_offset + 1u")}, ${Y.getByOffset("x_offset + 2u")}, ${Y.getByOffset("x_offset + 3u")}), vec4<${q}>(${Q2.getByOffset("w_offset")}, ${Q2.getByOffset("w_offset + 1u")}, ${Q2.getByOffset("w_offset + 2u")}, ${Q2.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);
            else if (ve += `
                  let xValue = ${i ? Y.getByOffset(`${Y.indicesToOffset(`${Y.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${p}`) : Y.get("batch", "inputChannel", "idyR", "idyC")};
        `, p === 1) ve += `
          let w_offset = ${Q2.indicesToOffset(`${Q2.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${Q2.getByOffset(`w_offset / ${_}`)};
          dotProd = dotProd + xValue * wValue;`;
            else for (let M = 0; M < p; M++) ve += `
            let wValue${M} = ${Q2.getByOffset(`${Q2.indicesToOffset(`${Q2.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${M}, wOutChannel)`)} / ${_}`)};
            dotProd = dotProd + xValue[${M}] * wValue${M};`;
            return ve;
          }, le2 = () => {
            if (y === 0) return "";
            if (!m) throw new Error(`packInputAs4 ${m} is not true.`);
            let ve = "";
            if (p === 1) {
              ve += "dotProd = dotProd";
              for (let M = 0; M < y; M++) ve += `
            + ${Y.getByOffset(`x_offset + ${M}`)} * ${Q2.getByOffset(`w_offset + ${M}`)}`;
              ve += ";";
            } else if (p === 2) {
              if (y !== 2) throw new Error(`Invalid inputChannelsRemainder ${y}.`);
              ve += `
          let xValue = ${Y.getByOffset("x_offset")};
          let wValue = ${Q2.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`;
            }
            return ve;
          }, Me = `
            let outputIndices = ${te.offsetToIndices(`global_idx * ${b}`)};
            let batch = ${te.indicesGet("outputIndices", 0)};
            let d1 = ${te.indicesGet("outputIndices", L)};
            let r = ${te.indicesGet("outputIndices", X)};
            let c = ${te.indicesGet("outputIndices", B)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${te.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${q}(dyRCorner) + ${q}(wR)) / ${q}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${q}(uniforms.Dy_shape[${X}]) || fract(dyR) > 0.0 ||
                  wRPerm < 0) {
                continue;
              }
              let idyR: u32 = u32(dyR);
              var wC: u32 = 0;
              if (uniforms.dilations.y == 1) {
                // Minimum wC >= 0 that satisfies (dyCCorner + wC) % (uniforms.strides.y) == 0
                wC = u32(((dyCCorner + i32(uniforms.strides.y) - 1) / i32(uniforms.strides.y)) * i32(uniforms.strides.y) - dyCCorner);
              }
              for (; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
                if (wC % uniforms.dilations.y != 0) {
                  continue;
                }
                let dyC = (${q}(dyCCorner) + ${q}(wC)) / ${q}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${q}(uniforms.Dy_shape[${B}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${m ? `
                var x_offset = ${Y.indicesToOffset(`${Y.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${p};
                var w_offset = ${Q2.indicesToOffset(`${Q2.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${_};
                  ` : ""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${m ? 4 : p}) {
                  ${ae()}
                  inputChannel = inputChannel + ${m ? 4 : p};
                }
                ${le2()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${n ? ` + bias[d1 / ${b}]` : ""};
            ${te.setByOffset("global_idx", "value")};
          `;
          return `
    ${N.registerUniforms(F).declareVariables(...Z, te)}
      ${N.mainStart()}
      ${N.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${Me}}`;
        };
        return { name: "ConvTranspose2D", shaderCache: { hint: `${e.cacheKey};${p}${_}${b}${m}${y}`, inputDependencies: $2 }, getRunData: () => ({ dispatchGroup: { x: x[0], y: x[1], z: x[2] }, outputs: [{ dims: r ? r(o) : o, dataType: t[0].dataType }], programUniforms: v }), getShaderSource: R };
      };
    });
    Hd = V(() => {
      Nd();
      St();
      pt();
      Zh = (t, e, r, n, o, i) => (t - 1) * e + r + (n - 1) * o + 1 - i, Qh = (t, e, r, n, o) => {
        let i = Math.floor(t / 2);
        e === "SAME_UPPER" ? (r[n] = i, r[o] = t - i) : e === "SAME_LOWER" && (r[n] = t - i, r[o] = i);
      }, Yh = (t, e, r, n, o, i, s, u, d, c) => {
        let p = t.length - 2, m = c.length === 0;
        d.length < p && d.push(...Array(p - d.length).fill(0));
        let g = t[0], y = e[u ? 3 : 1] * o;
        for (let b = 0, _ = t.length - p - (u ? 1 : 0); b < p; ++b, ++_) {
          let T = t[_], x = m ? T * s[b] : c[b], $2 = Zh(T, s[b], i[b], e[_], r[b], x);
          Qh($2, n, i, b, b + p), m && c.push(s[b] * (T - 1) + d[b] + (e[_] - 1) * r[b] + 1 - i[b] - i[b + p]);
        }
        c.splice(0, 0, g), c.splice(u ? 3 : 1, 0, y);
      }, Vd = (t, e) => {
        let r = t.kernelShape.slice();
        if (t.kernelShape.length === 0 || t.kernelShape.reduce((m, g) => m * g, 1) === 0) {
          r.length = 0;
          for (let m = 2; m < e[1].dims.length; ++m) r.push(e[1].dims[m]);
        }
        let n = t.format === "NHWC";
        r.splice(0, 0, e[1].dims[0]), r.splice(n ? 3 : 1, 0, e[1].dims[1]);
        let o = t.pads.slice(), i = t.outputShape.slice(), s = t.outputPadding.slice(), u = e[0].dims, d = t.dilations.slice();
        if (d.reduce((m, g) => m + g, 0) === 0) {
          let m = e[0].dims.length - 2;
          d = new Array(m).fill(1);
        }
        let c = t.strides.slice();
        if (c.reduce((m, g) => m + g, 0) === 0) {
          let m = e[0].dims.length - 2;
          c = new Array(m).fill(1);
        }
        Yh(u, r, d, t.autoPad, t.group, o, c, n, s, i);
        let p = Object.assign({}, t);
        return Object.assign(p, { kernelShape: r, pads: o, outputPadding: s, outputShape: i, dilations: d, strides: c }), p;
      }, Ld = (t) => {
        let e = rn2(t), r = t.format, n = ["NOTSET", "VALID", "SAME_UPPER", "SAME_LOWER"][typeof t.autoPad > "u" ? 0 : t.autoPad], o = t.dilations, i = t.group ?? 1, s = t.kernelShape, u = t.pads, d = t.strides, c = t.wIsConst(), p = t.outputPadding, m = t.outputShape;
        return { autoPad: n, format: r, dilations: o, group: i, kernelShape: s, outputPadding: p, outputShape: m, pads: u, strides: d, wIsConst: c, ...e, cacheKey: `${t.format};${e.activation};` };
      }, Xh = (t, e) => {
        if (!t || t.length !== 2 && t.length !== 3) throw new Error("Conv requires 2 or 3 inputs");
        if (t[0].dims.length !== 4 && t[0].dims.length !== 3) throw new Error("currently only support 2-dimensional conv");
        if (t[0].dims.length !== t[1].dims.length) throw new Error("filter does not have same dimension as input");
        let r = t[0].dims[e.format === "NHWC" ? t[0].dims.length - 1 : 1], n = t[1].dims[0];
        if (r !== n) throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");
        let o = t[1].dims[1] * e.group;
        if (t.length === 3 && (t[2].dims.length !== 1 || t[2].dims[0] !== o)) throw new Error("invalid bias");
        let i = t[0].dims.length - 2;
        if (e.dilations.reduce((p, m) => p + m, 0) > 0 && e.dilations.length !== i) throw new Error(`dilations should be ${i}D`);
        if (e.strides.reduce((p, m) => p + m, 0) > 0 && e.strides.length !== i) throw new Error(`strides should be ${i}D`);
        if (e.pads.reduce((p, m) => p + m, 0) > 0 && e.pads.length !== i * 2) throw new Error(`pads should be ${i * 2}D`);
        if (e.outputPadding.length !== i && e.outputPadding.length !== 0) throw new Error(`output_padding should be ${i}D`);
        if (e.kernelShape.reduce((p, m) => p + m, 0) > 0 && e.kernelShape.length !== 0 && e.kernelShape.length !== t[1].dims.length - 2) throw new Error("invalid kernel shape");
        if (e.outputShape.length !== 0 && e.outputShape.length !== t[0].dims.length - 2) throw new Error("invalid output shape");
      }, Wd = (t, e, r, n) => {
        let o = t.kernelCustomData.wT ?? t.compute(Be(e[1], [2, 3, 0, 1]), { inputs: [1], outputs: [r.wIsConst ? -2 : -1] })[0];
        r.wIsConst && !t.kernelCustomData.wT && (t.kernelCustomData.wT = o);
        let i = [e[0], o];
        e.length === 3 && i.push(e[2]), t.compute(Ud(i, r, n), { inputs: i });
      }, Jh = (t, e) => {
        let r = e.format === "NHWC", n = [t.inputs[0].reshape(r ? [t.inputs[0].dims[0], 1, t.inputs[0].dims[1], t.inputs[0].dims[2]] : [t.inputs[0].dims[0], t.inputs[0].dims[1], 1, t.inputs[0].dims[2]]), t.inputs[1].reshape([t.inputs[1].dims[0], t.inputs[1].dims[1], 1, t.inputs[1].dims[2]])];
        t.inputs.length === 3 && n.push(t.inputs[2]);
        let o = e.kernelShape;
        (o.length === 0 || o[0] === 0) && (o = [t.inputs[1].dims[2]]);
        let i = e.dilations;
        (i.length === 0 || i[0] === 0) && (i = [1]);
        let s = e.strides;
        (s.length === 0 || s[0] === 0) && (s = [1]);
        let u = e.pads;
        u.length === 0 && (u = [0, 0]), u = [0, u[0], 0, u[1]], s = [1].concat(s), i = [1].concat(i), o = [1].concat(o);
        let d = e.outputPadding;
        d = [0].concat(d);
        let c = Vd({ ...e, pads: u, strides: s, dilations: i, kernelShape: o, outputPadding: d }, n);
        Wd(t, n, c, (p) => r ? [p[0], p[2], p[3]] : [p[0], p[1], p[3]]);
      }, Gd = (t, e) => {
        if (Xh(t.inputs, e), t.inputs[0].dims.length === 3) Jh(t, e);
        else {
          let r = Vd(e, t.inputs);
          Wd(t, t.inputs, r);
        }
      };
    });
    Kd = V(() => {
      J();
      re();
      Ce();
      oe();
      eg = (t, e, r, n) => {
        let o = k2.size(e), i = e.length, s = O("input", t, i), u = U("output", t, i), d = r.dataType === 6 ? r.getInt32Array()[0] : Number(r.getBigInt64Array()[0]), c = k2.normalizeAxis(d, i), p = (m) => {
          let g = ` i32(${s.indicesGet("inputIndices", "uniforms.axis")}) `, y = j("uniforms.input_shape", "uniforms.axis", i), b = n.reverse ? g + (n.exclusive ? " + 1" : "") : "0", _ = n.reverse ? y : g + (n.exclusive ? "" : " + 1");
          return `
                ${m.registerUniform("outputSize", "u32").registerUniform("axis", "u32").declareVariables(s, u)}
                ${m.mainStart()}
                  ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${u.offsetToIndices("global_idx")};
                  var sum = ${u.type.value}(0);
                  let first : i32 = ${b};
                  let last : i32 = ${_};
                  for (var i : i32 = first; i < last; i++) {
                    ${s.indicesSet("inputIndices", "uniforms.axis", "u32(i)")};
                    sum = sum + ${s.getByIndices("inputIndices")};
                  }
                  ${u.setByOffset("global_idx", "sum")};
                }`;
        };
        return { name: "CumSum", shaderCache: { hint: n.cacheKey, inputDependencies: ["rank"] }, getRunData: () => ({ outputs: [{ dims: e, dataType: t }], dispatchGroup: { x: Math.ceil(o / 64) }, programUniforms: [{ type: 12, data: o }, { type: 12, data: c }, ...W(e, e)] }), getShaderSource: p };
      }, Fd = (t, e) => {
        let r = t.inputs[0].dims, n = t.inputs[0].dataType, o = t.inputs[1];
        t.compute(eg(n, r, o, e), { inputs: [0] });
      }, qd = (t) => {
        let e = t.exclusive === 1, r = t.reverse === 1;
        return ee({ exclusive: e, reverse: r });
      };
    });
    Qd = V(() => {
      J();
      re();
      Ce();
      oe();
      tg = (t) => {
        if (!t || t.length !== 1) throw new Error("DepthToSpace requires 1 input.");
        if (t[0].dims.length !== 4) throw new Error("DepthToSpace requires 4D input.");
      }, rg = (t, e, r, n) => {
        let o = [];
        o.push(`fn perm(i: ${n.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`);
        for (let i = 0; i < e; ++i) o.push(r.indicesSet("a", t[i], `i[${i}]`));
        return o.push("return a;}"), o.join(`
`);
      }, ng = (t, e) => {
        let r, n, o, i, s, u, d = e.format === "NHWC", c = e.blocksize, p = e.mode === "DCR";
        d ? ([r, n, o, i] = t.dims, s = p ? [r, n, o, c, c, i / c ** 2] : [r, n, o, i / c ** 2, c, c], u = p ? [0, 1, 3, 2, 4, 5] : [0, 1, 4, 2, 5, 3]) : ([r, n, o, i] = [t.dims[0], t.dims[2], t.dims[3], t.dims[1]], s = p ? [r, c, c, i / c ** 2, n, o] : [r, i / c ** 2, c, c, n, o], u = p ? [0, 3, 4, 1, 5, 2] : [0, 1, 4, 2, 5, 3]);
        let m = t.reshape(s), g = m.dims.length, y = t.dataType, b = O("a", y, g), _ = U("output", y, g), T = (x) => `
  ${x.registerUniform("output_size", "u32").declareVariables(b, _)}

  ${rg(u, g, b, _)}

  ${x.mainStart()}
    ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${_.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${_.setByOffset("global_idx", b.getByIndices("aIndices"))}
  }`;
        return { name: "DepthToSpace", shaderCache: { hint: `${t.dims};${e.blocksize};${e.mode}`, inputDependencies: ["rank"] }, getRunData: (x) => {
          let $2 = d ? [r, n * c, o * c, i / c ** 2] : [r, i / c ** 2, n * c, o * c], S = k2.size($2), I = m.dims, E = k2.sortBasedOnPerm(I, u);
          return { outputs: [{ dims: $2, dataType: x[0].dataType }], dispatchGroup: { x: Math.ceil(S / 64) }, programUniforms: [{ type: 12, data: S }, ...W(I, E)] };
        }, getShaderSource: T };
      }, jd = (t, e) => {
        tg(t.inputs), t.compute(ng(t.inputs[0], e));
      }, Zd = (t) => ee({ blocksize: t.blocksize, mode: t.mode, format: t.format });
    });
    tl = V(() => {
      J();
      re();
      Ce();
      oe();
      Co = "[a-zA-Z]|\\.\\.\\.", dn2 = "(" + Co + ")+", Yd = "^" + dn2 + "$", og = "(" + dn2 + ",)*" + dn2, ig = "^" + og + "$", Ao = class {
        constructor(e = -1) {
          this.symbolToIndices = /* @__PURE__ */ new Map(), this.inputIndex = e;
        }
        addSymbol(e, r) {
          let n = this.symbolToIndices.get(e);
          n === void 0 ? n = [r] : n.push(r), this.symbolToIndices.set(e, n);
        }
      }, Eo = class {
        constructor(e, r) {
          this.equation = r;
          this.hasEllipsis = false, this.symbolToInfo = /* @__PURE__ */ new Map(), this.lhs = new Array(), this.outputDims = [];
          let [n, o] = r.includes("->") ? r.split("->", 2) : [r, ""];
          if (!n.match(RegExp(ig))) throw new Error("Invalid LHS term");
          if (n.split(",").forEach((u, d) => {
            let c = e[d].dims.slice();
            if (!u.match(RegExp(Yd))) throw new Error("Invalid LHS term");
            let p = this.processTerm(u, true, c, d);
            this.lhs.push(p);
          }), o === "") o += [...this.symbolToInfo.entries()].filter(([u, d]) => d.count === 1 || u === "...").map(([u]) => u).join("");
          else if (!o.match(RegExp(dn2))) throw new Error("Invalid RHS");
          o.match(RegExp(Co, "g"))?.forEach((u) => {
            if (u === "...") this.outputDims = this.outputDims.concat(this.ellipsisDims);
            else {
              let d = this.symbolToInfo.get(u);
              if (d === void 0) throw new Error("Invalid RHS symbol");
              this.outputDims.push(d.dimValue);
            }
          }), this.rhs = this.processTerm(o, false, this.outputDims);
        }
        addSymbol(e, r, n) {
          let o = this.symbolToInfo.get(e);
          if (o !== void 0) {
            if (o.dimValue !== r && o.count !== 1) throw new Error("Dimension mismatch");
            o.count++, o.inputIndices.push(n);
          } else o = { count: 1, dimValue: r, inputIndices: [n] };
          this.symbolToInfo.set(e, o);
        }
        processTerm(e, r, n, o = -1) {
          let i = n.length, s = false, u = [], d = 0;
          if (!e.match(RegExp(Yd)) && !r && e !== "") throw new Error("Invalid LHS term");
          let c = e.match(RegExp(Co, "g")), p = new Ao(o);
          return c?.forEach((m, g) => {
            if (m === "...") {
              if (s) throw new Error("Only one ellipsis is allowed per input term");
              s = true;
              let y = i - c.length + 1;
              if (y < 0) throw new Error("Ellipsis out of bounds");
              if (u = n.slice(d, d + y), this.hasEllipsis) {
                if (this.ellipsisDims.length !== u.length || this.ellipsisDims.toString() !== u.toString()) throw new Error("Ellipsis dimensions mismatch");
              } else if (r) this.hasEllipsis = true, this.ellipsisDims = u;
              else throw new Error("Ellipsis must be specified in the LHS");
              for (let b = 0; b < u.length; b++) {
                let _ = String.fromCharCode(48 + b);
                p.addSymbol(_, g + b), this.addSymbol(_, n[d++], o);
              }
            } else p.addSymbol(m, g + (this.hasEllipsis ? this.ellipsisDims.length - 1 : 0)), this.addSymbol(m, n[d++], o);
          }), p;
        }
      }, Xd = (t) => t + "_max", ag = (t, e, r, n) => {
        let i = t.map((p) => p.length).map((p, m) => O(`input${m}`, e, p)), s = k2.size(n), u = U("output", e, n.length), d = [...r.symbolToInfo.keys()].filter((p) => !r.rhs.symbolToIndices.has(p)), c = (p) => {
          let m = [], g = "var prod = 1.0;", y = "var sum = 0.0;", b = "sum += prod;", _ = [], T = [], x = [], $2 = [], S = r.symbolToInfo.size === r.rhs.symbolToIndices.size;
          r.symbolToInfo.forEach((E, A) => {
            if (r.rhs.symbolToIndices.has(A)) {
              let z2 = r.rhs.symbolToIndices.get(A)?.[0];
              z2 !== void 0 && r.lhs.forEach((v, R) => {
                if (E.inputIndices.includes(R)) {
                  let N = v.symbolToIndices.get(A);
                  if (N === void 0) throw new Error("Invalid symbol error");
                  N.forEach((F) => {
                    m.push(`${i[R].indicesSet(`input${R}Indices`, F, u.indicesGet("outputIndices", z2))}`);
                  });
                }
              });
            } else r.lhs.forEach((z2, v) => {
              if (E.inputIndices.includes(v)) {
                let R = z2.symbolToIndices.get(A);
                if (R === void 0) throw new Error("Invalid symbol error");
                R.forEach((N) => {
                  _.push(`${i[v].indicesSet(`input${v}Indices`, N, `${A}`)}`);
                }), $2.push(`prod *= ${i[v].getByIndices(`input${v}Indices`)};`);
              }
            }), T.push(`for(var ${A}: u32 = 0; ${A} < uniforms.${Xd(A)}; ${A}++) {`), x.push("}");
          });
          let I = S ? [...m, `let sum = ${i.map((E, A) => E.getByIndices(`input${A}Indices`)).join(" * ")};`] : [...m, y, ...T, ..._, g, ...$2, b, ...x];
          return `
            ${p.registerUniforms(d.map((E) => ({ name: `${Xd(E)}`, type: "u32" }))).registerUniform("outputSize", "u32").declareVariables(...i, u)}

            ${p.mainStart()}
            ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${u.offsetToIndices("global_idx")};
            ${i.map((E, A) => `var input${A}Indices: ${i[A].type.indices};`).join(`
`)}
            ${I.join(`
`)};
            ${u.setByOffset("global_idx", "sum")};
          }`;
        };
        return { name: "Einsum", shaderCache: { hint: r.equation, inputDependencies: t.map(() => "rank") }, getRunData: () => {
          let p = d.filter((g) => r.symbolToInfo.has(g)).map((g) => ({ type: 12, data: r.symbolToInfo.get(g)?.dimValue || 0 }));
          p.push({ type: 12, data: s });
          let m = t.map((g, y) => [...W(g)]).reduce((g, y) => g.concat(y), p);
          return m.push(...W(n)), { outputs: [{ dims: n, dataType: e }], dispatchGroup: { x: Math.ceil(s / 64) }, programUniforms: m };
        }, getShaderSource: c };
      }, Jd = (t, e) => {
        let r = new Eo(t.inputs, e.equation), n = r.outputDims, o = t.inputs.map((i, s) => i.dims);
        t.compute(ag(o, t.inputs[0].dataType, r, n));
      }, el = (t) => {
        let e = t.equation.replace(/\s+/g, "");
        return ee({ equation: e });
      };
    });
    ol = V(() => {
      J();
      re();
      oe();
      sg = (t) => {
        if (!t || t.length !== 2) throw new Error("Expand requires 2 input.");
        let e = t[0].dims, r = Array.from(t[1].getBigInt64Array(), Number), n = r.length < e.length ? 0 : r.length - e.length, o = e.length < r.length ? 0 : e.length - r.length;
        for (; n < r.length && o < e.length; ++n, ++o) if (r[n] !== e[o] && r[n] !== 1 && e[o] !== 1) throw new Error("Expand requires shape to be broadcastable to input");
      }, rl = (t, e) => {
        let r = t.length - e.length, n = [];
        for (let o = 0; o < r; ++o) n.push(t[o]);
        for (let o = 0; o < e.length; ++o) n.push(e[o] === 1 ? t[o + r] : e[o]);
        return n;
      }, ug = (t, e) => t.length > e.length ? rl(t, e) : rl(e, t), dg = (t) => {
        let e = t[0].dims, r = Array.from(t[1].getBigInt64Array(), Number), n = ug(e, r), o = t[0].dataType, i = o === 9 || k2.size(e) === 1, s = o === 9 || e.length > 0 && e[e.length - 1] % 4 === 0 ? 4 : 1, u = i || n.length > 0 && n[n.length - 1] % 4 === 0 ? 4 : 1, d = Math.ceil(k2.size(n) / u), c = (m) => {
          let g = O("input", o, e.length, s), y = U("output", o, n.length, u), b;
          if (o === 9) {
            let _ = (T, x, $2 = "") => `
          let outputIndices${x} = ${y.offsetToIndices(`outputOffset + ${x}u`)};
          let offset${x} = ${g.broadcastedIndicesToOffset(`outputIndices${x}`, y)};
          let index${x} = offset${x} / 4u;
          let component${x} = offset${x} % 4u;
          ${T}[${x}] = ${$2}(${g.getByOffset(`index${x}`)}[component${x}]);
        `;
            b = `
        let outputOffset = global_idx * ${u};
        var data = vec4<u32>(0);
        ${_("data", 0, "u32")}
        ${_("data", 1, "u32")}
        ${_("data", 2, "u32")}
        ${_("data", 3, "u32")}
        ${y.setByOffset("global_idx", "data")}
      }`;
          } else b = `
        let outputIndices = ${y.offsetToIndices(`global_idx * ${u}`)};
        let inputOffset = ${g.broadcastedIndicesToOffset("outputIndices", y)};
        let data = ${y.type.value}(${g.getByOffset(`inputOffset / ${s}`)});
        ${y.setByOffset("global_idx", "data")}
      }`;
          return `
    ${m.registerUniform("vec_size", "u32").declareVariables(g, y)}
    ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${b}`;
        }, p = [{ type: 12, data: d }, ...W(e, n)];
        return { name: "Expand", shaderCache: { hint: `${n.length};${s}${u}`, inputDependencies: ["rank"] }, getShaderSource: c, getRunData: () => ({ outputs: [{ dims: n, dataType: t[0].dataType }], dispatchGroup: { x: Math.ceil(d / 64) }, programUniforms: p }) };
      }, nl = (t) => {
        sg(t.inputs), t.compute(dg(t.inputs), { inputs: [0] });
      };
    });
    al = V(() => {
      J();
      re();
      oe();
      tn2();
      lg = (t) => {
        let e = t[0].dataType, r = k2.size(t[0].dims), n = k2.size(t[1].dims), o = n % 4 === 0, i = (s) => {
          let u = O("x", e, [1], 4), d = O("bias", e, [1], 4), c = U("y", e, [1], 4), p = [{ name: "output_vec_size", type: "u32" }, { name: "bias_size", type: "u32" }], m = (y) => `
      let bias${y}_offset: u32 = (global_idx * 4 + ${y}) % uniforms.bias_size;
      let bias${y} = ${d.getByOffset(`bias${y}_offset / 4`)}[bias${y}_offset % 4];`, g = o ? `
      let bias = ${d.getByOffset("global_idx % (uniforms.bias_size / 4)")};` : `${m(0)}${m(1)}${m(2)}${m(3)}
      let bias = ${u.type.value}(bias0, bias1, bias2, bias3);`;
          return `${s.registerUniforms(p).declareVariables(u, d, c)}

    ${_o(ze2(e))}

    ${s.mainStart(Bt2)}
      ${s.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${u.getByOffset("global_idx")};
      ${g}
      let x_in = x + bias;
      ${c.setByOffset("global_idx", wo("x_in"))}
    }`;
        };
        return { name: "FastGeluWithBias", shaderCache: { hint: `${o}`, inputDependencies: ["type", "type"] }, getShaderSource: i, getRunData: (s) => ({ outputs: [{ dims: s[0].dims, dataType: s[0].dataType }], programUniforms: [{ type: 12, data: Math.ceil(r / 4) }, { type: 12, data: n }], dispatchGroup: { x: Math.ceil(r / Bt2 / 4) } }) };
      }, il = (t) => {
        t.inputs.length < 2 || k2.size(t.inputs[1].dims) === 0 ? td(t) : t.compute(lg(t.inputs));
      };
    });
    dl = V(() => {
      J();
      re();
      Ce();
      oe();
      cg = (t) => {
        if (!t || t.length !== 2) throw new Error("Gather requires 2 inputs.");
      }, pg = (t, e) => {
        let r = t[0].dims, n = t[1].dims, o = r.length, i = k2.normalizeAxis(e.axis, o), s = r.slice(0);
        s.splice(i, 1, ...n);
        let u = r[i], d = t[0].dataType === 9 ? 4 : 1, c = Math.ceil(k2.size(s) / d), p = [{ type: 12, data: c }, { type: 6, data: u }, { type: 12, data: i }, ...W(t[0].dims, t[1].dims, s)], m = (g) => {
          let y = O("data", t[0].dataType, t[0].dims.length, d), b = O("inputIndices", t[1].dataType, t[1].dims.length), _ = U("output", t[0].dataType, s.length, d), T = ($2) => {
            let S = n.length, I = `var indicesIndices${$2}  = ${b.type.indices}(0);`;
            for (let E = 0; E < S; E++) I += `${S > 1 ? `indicesIndices${$2}[${E}]` : `indicesIndices${$2}`} = ${s.length > 1 ? `outputIndices${$2}[uniforms.axis + ${E}]` : `outputIndices${$2}`};`;
            I += `
          var idx${$2} = ${b.getByIndices(`indicesIndices${$2}`)};
          if (idx${$2} < 0) {
            idx${$2} = idx${$2} + uniforms.axisDimLimit;
          }
          var dataIndices${$2} : ${y.type.indices};
        `;
            for (let E = 0, A = 0; E < o; E++) E === i ? (I += `${o > 1 ? `dataIndices${$2}[${E}]` : `dataIndices${$2}`} = u32(idx${$2});`, A += S) : (I += `${o > 1 ? `dataIndices${$2}[${E}]` : `dataIndices${$2}`} = ${s.length > 1 ? `outputIndices${$2}[${A}]` : `outputIndices${$2}`};`, A++);
            return I;
          }, x;
          if (t[0].dataType === 9) {
            let $2 = (S, I, E = "") => `
          let outputIndices${I} = ${_.offsetToIndices(`outputOffset + ${I}u`)};
          ${T(I)};
          let offset${I} = ${y.indicesToOffset(`dataIndices${I}`)};
          let index${I} = offset${I} / 4u;
          let component${I} = offset${I} % 4u;
          ${S}[${I}] = ${E}(${y.getByOffset(`index${I}`)}[component${I}]);
        `;
            x = `
        let outputOffset = global_idx * ${d};
        var value = vec4<u32>(0);
        ${$2("value", 0, "u32")}
        ${$2("value", 1, "u32")}
        ${$2("value", 2, "u32")}
        ${$2("value", 3, "u32")}
        ${_.setByOffset("global_idx", "value")}
      `;
          } else x = `
      let outputIndices = ${_.offsetToIndices("global_idx")};
      ${T("")};
      let value = ${y.getByIndices("dataIndices")};
      ${_.setByOffset("global_idx", "value")};
      `;
          return `
      ${g.registerUniform("outputSize", "u32").registerUniform("axisDimLimit", "i32").registerUniform("axis", "u32").declareVariables(y, b, _)}
      ${g.mainStart()}
        ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${x}
      }`;
        };
        return { name: "Gather", shaderCache: { hint: e.cacheKey, inputDependencies: ["rank", "rank"] }, getRunData: () => ({ outputs: [{ dims: s, dataType: t[0].dataType }], dispatchGroup: { x: Math.ceil(c / 64) }, programUniforms: p }), getShaderSource: m };
      }, sl = (t) => ee({ axis: t.axis }), ul = (t, e) => {
        let r = t.inputs;
        cg(r), t.compute(pg(t.inputs, e));
      };
    });
    pl = V(() => {
      J();
      re();
      oe();
      mg = (t, e, r, n, o, i, s, u, d) => {
        let c = [{ type: 12, data: i }, { type: 12, data: n }, { type: 12, data: o }, { type: 12, data: r }, { type: 12, data: s }, { type: 12, data: u }, { type: 12, data: d }], p = [i];
        c.push(...W(e.dims, p));
        let m = (g) => {
          let y = O("indices_data", e.dataType, e.dims.length), b = U("input_slice_offsets_data", 12, 1, 1), _ = [y, b], T = [{ name: "output_size", type: "u32" }, { name: "batch_dims", type: "u32" }, { name: "input_dims", type: "u32", length: o.length }, { name: "sizes_from_slice_dims_data", type: "u32", length: r.length }, { name: "num_slices_per_batch", type: "u32" }, { name: "input_batch_stride", type: "u32" }, { name: "num_slice_dims", type: "u32" }];
          return `
  ${g.registerUniforms(T).declareVariables(..._)}
  ${g.mainStart()}
    ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${o.length === 1 ? "index += i32(uniforms.input_dims);" : "index += i32(uniforms.input_dims[input_dim_idx]);"}
      }
      ${r.length === 1 ? "relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);" : "relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);"}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`;
        };
        return t.compute({ name: "computeSliceOffsets", shaderCache: { hint: `${o.length}_${r.length}`, inputDependencies: ["rank"] }, getRunData: () => ({ outputs: [{ dims: p, dataType: t.inputs[1].dataType }], dispatchGroup: { x: Math.ceil(i / 64) }, programUniforms: c }), getShaderSource: m }, { inputs: [e], outputs: [-1] })[0];
      }, ll = (t, e) => {
        let r = t.inputs, n = r[0].dims, o = r[0].dataType, i = r[1].dims, s = i[i.length - 1], u = k2.sizeToDimension(i, i.length - 1), d = k2.sizeFromDimension(n, e.batchDims + s), c = k2.sizeToDimension(n, e.batchDims), p = k2.sizeFromDimension(n, e.batchDims), m = u / c, g = new Array(s), y = d;
        for (let I = 0; I < s; ++I) g[s - 1 - I] = y, y *= n[e.batchDims + s - 1 - I];
        let b = mg(t, r[1], g, e.batchDims, n, u, m, p, s), _ = e.batchDims + s;
        if (_ > n.length) throw new Error("last dimension of indices must not be larger than rank of input tensor");
        let T = i.slice(0, -1).concat(n.slice(_)), x = k2.size(T), $2 = [{ type: 12, data: x }, { type: 12, data: d }, ...W(r[0].dims, b.dims, T)], S = (I) => {
          let E = O("data", r[0].dataType, r[0].dims.length), A = O("slice_offsets", 12, b.dims.length), z2 = U("output", r[0].dataType, T.length);
          return `
          ${I.registerUniform("output_size", "u32").registerUniform("slice_size", "u32").declareVariables(E, A, z2)}
            ${I.mainStart()}
            ${I.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`;
        };
        t.compute({ name: "GatherND", shaderCache: { hint: e.cacheKey, inputDependencies: ["rank", "rank"] }, getRunData: () => ({ outputs: [{ dims: T, dataType: o }], dispatchGroup: { x: Math.ceil(x / 64) }, programUniforms: $2 }), getShaderSource: S }, { inputs: [r[0], b] });
      }, cl = (t) => ({ batchDims: t.batch_dims, cacheKey: "" });
    });
    hl = V(() => {
      J();
      re();
      Ce();
      oe();
      fg = (t, e) => {
        if (t.length < 3 || t.length > 4) throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");
        let r = k2.normalizeAxis(e.quantizeAxis, t[0].dims.length), n = e.blockSize, o = t[0], i = t[2], s = t.length === 4 ? t[3] : void 0;
        if (i.dims.length !== o.dims.length || !o.dims.map((u, d) => d === r ? Math.ceil(u / n) === i.dims[d] : u === i.dims[d]).reduce((u, d) => u && d, true)) throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");
        if (s) {
          if (s.dataType !== o.dataType) throw new Error("Zero point must have the same data type as the input tensor.");
          if (s.dims.length !== i.dims.length || !s.dims.map((u, d) => u === i.dims[d]).reduce((u, d) => u && d, true)) throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.");
        }
      }, hg = (t, e) => {
        let r = t[0].dims, n = t[1].dims, o = r.length, i = k2.normalizeAxis(e.gatherAxis, o), s = k2.normalizeAxis(e.quantizeAxis, o), u = r.slice(0);
        u.splice(i, 1, ...n);
        let d = k2.size(u), c = t[2].dataType, m = t[0].dataType === 22, g = [{ type: 12, data: d }, { type: 12, data: s }, { type: 12, data: i }, { type: 12, data: e.blockSize }, ...W(...t.map((b, _) => b.dims), u)], y = (b) => {
          let _ = O("data", t[0].dataType, t[0].dims.length), T = O("inputIndices", t[1].dataType, t[1].dims.length), x = O("scales", t[2].dataType, t[2].dims.length), $2 = t.length > 3 ? O("zeroPoint", t[3].dataType, t[3].dims.length) : void 0, S = U("output", c, u.length), I = [_, T, x];
          $2 && I.push($2);
          let E = [{ name: "output_size", type: "u32" }, { name: "quantize_axis", type: "u32" }, { name: "gather_axis", type: "u32" }, { name: "block_size", type: "u32" }];
          return `
        ${b.registerUniforms(E).declareVariables(...I, S)}
        ${b.mainStart()}
        let output_indices = ${S.offsetToIndices("global_idx")};
        var indices_indices = ${T.type.indices}(0);
        ${n.length > 1 ? `
          for (var i: u32 = 0; i < ${n.length}; i++) {
            let index = ${S.indicesGet("output_indices", "uniforms.gather_axis + i")};
            ${T.indicesSet("indices_indices", "i", "index")};
          }` : `indices_indices = ${S.indicesGet("output_indices", "uniforms.gather_axis")};`};
        var data_indices = ${_.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${S.indicesGet("output_indices", "i")};
          ${_.indicesSet("data_indices", "i", "index")};
        }
        var index_from_indices = ${T.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${r[i]};
        }
        ${_.indicesSet("data_indices", "uniforms.gather_axis", "u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${u.length}; i++) {
          let index = ${S.indicesGet("output_indices", `i + ${n.length} - 1`)};
          ${_.indicesSet("data_indices", "i", "index")};
        }
        let data_offset = ${_.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${_.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${m ? "unpack4xI8" : "unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${x.indicesGet("data_indices", "uniforms.quantize_axis")} / uniforms.block_size;
        ${x.indicesSet("scale_indices", "uniforms.quantize_axis", "quantize_axis_index")};
        var scale = ${x.getByIndices("scale_indices")};
        ${$2 ? `
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${$2.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${$2.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${m ? "unpack4xI8" : "unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];` : "var zero_point = 0"};
        let dequantized_data = ${ze2(c)}(quantized_data - zero_point) * scale;
        ${S.setByOffset("global_idx", "dequantized_data")};
    }`;
        };
        return { name: "GatherBlockQuantized", shaderCache: { hint: `${e.cacheKey};${t.filter((b, _) => _ !== 1).map((b) => b.dims.join("_")).join(";")}`, inputDependencies: Array.from({ length: t.length }, (b, _) => "rank") }, getRunData: () => ({ outputs: [{ dims: u, dataType: c }], dispatchGroup: { x: Math.ceil(d / 64) }, programUniforms: g }), getShaderSource: y };
      }, ml = (t, e) => {
        let r = t.inputs;
        fg(r, e), t.compute(hg(t.inputs, e));
      }, fl = (t) => ee({ blockSize: t.blockSize, gatherAxis: t.gatherAxis, quantizeAxis: t.quantizeAxis });
    });
    yl = V(() => {
      J();
      re();
      Ce();
      oe();
      gg = (t) => {
        if (!t || t.length !== 2) throw new Error("GatherElements requires 2 inputs.");
        if (t[0].dims.length < 1) throw new Error("GatherElements requires that the data input be rank >= 1.");
        if (t[0].dims.length !== t[1].dims.length) throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`);
      }, bg = (t, e) => {
        let r = t[0].dims, n = t[0].dataType, o = r.length, i = t[1].dims, s = t[1].dataType, u = k2.normalizeAxis(e.axis, o), d = r[u], c = i.slice(0), p = k2.size(c), m = O("input", n, o), g = O("indicesInput", s, i.length), y = U("output", n, c.length), b = [{ type: 12, data: p }, { type: 6, data: d }, { type: 12, data: u }];
        return b.push(...W(r, i, c)), { name: "GatherElements", shaderCache: { inputDependencies: ["rank", "rank"] }, getRunData: () => ({ outputs: [{ dims: c, dataType: t[0].dataType }], dispatchGroup: { x: Math.ceil(p / 64) }, programUniforms: b }), getShaderSource: (x) => `
      ${x.registerUniform("outputSize", "u32").registerUniform("axisDimLimit", "i32").registerUniform("axis", "u32").declareVariables(m, g, y)}
      ${x.mainStart()}
      ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${y.offsetToIndices("global_idx")};

      var idx = ${g.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${m.type.indices}(outputIndices);
      ${m.indicesSet("inputIndices", "uniforms.axis", "u32(idx)")};
      let value = ${m.getByIndices("inputIndices")};

      ${y.setByOffset("global_idx", "value")};
  }` };
      }, gl = (t) => ee({ axis: t.axis }), bl = (t, e) => {
        let r = t.inputs;
        gg(r), t.compute(bg(t.inputs, e));
      };
    });
    vl2 = V(() => {
      J();
      re();
      oe();
      yg = (t) => {
        if (!t) throw new Error("Input is missing");
        if (t.length < 2 || t.length > 3) throw new Error("Invaid input number.");
        if (t.length === 3 && t[2].dims.length > 2) throw new Error("Invalid input shape of C");
        if (t[0].dataType !== t[1].dataType || t.length === 3 && t[0].dataType !== t[2].dataType) throw new Error("Input types are mismatched");
      }, _g = (t, e) => {
        let r = t[0].dims.slice(), n = t[1].dims.slice(), [o, i, s] = Wr.getShapeOfGemmResult(r, e.transA, n, e.transB, t.length === 3 ? t[2].dims : void 0), u = [o, i];
        if (!u) throw new Error("Can't use gemm on the given tensors");
        let d = 16, c = Math.ceil(i / d), p = Math.ceil(o / d), m = true, g = k2.size(u), y = [{ type: 12, data: m ? c : g }, { type: 12, data: o }, { type: 12, data: i }, { type: 12, data: s }, { type: 1, data: e.alpha }, { type: 1, data: e.beta }], b = ["type", "type"];
        t.length === 3 && (y.push(...W(t[2].dims)), b.push("rank")), y.push(...W(u));
        let _ = (x) => {
          let $2 = "";
          e.transA && e.transB ? $2 = "value += a[k * uniforms.M + m] * b[n * uniforms.K + k];" : e.transA && !e.transB ? $2 = "value += a[k * uniforms.M + m] * b[k * uniforms.N + n];" : !e.transA && e.transB ? $2 = "value += a[m * uniforms.K + k] * b[n * uniforms.K + k];" : !e.transA && !e.transB && ($2 = "value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");
          let S = e.alpha === 1 ? "" : "value *= uniforms.alpha;", I = O("a", t[0].dataType, t[0].dims), E = O("b", t[1].dataType, t[1].dims), A = I.type.value, z2 = null, v = [I, E];
          t.length === 3 && (z2 = O("c", t[2].dataType, t[2].dims.length), v.push(z2));
          let R = U("output", t[0].dataType, u.length);
          v.push(R);
          let N = [{ name: "output_size", type: "u32" }, { name: "M", type: "u32" }, { name: "N", type: "u32" }, { name: "K", type: "u32" }, { name: "alpha", type: "f32" }, { name: "beta", type: "f32" }];
          return `
  ${x.registerUniforms(N).declareVariables(...v)}

  ${x.mainStart()}
    ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${A}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${$2}
    }

    ${S}
    ${z2 != null ? `let cOffset = ${z2.broadcastedIndicesToOffset("vec2(m, n)", R)}; value += ${A}(uniforms.beta) * ${z2.getByOffset("cOffset")};` : ""}
    output[global_idx] = value;
  }`;
        }, T = (x) => {
          let $2 = O("a", t[0].dataType, t[0].dims), S = O("b", t[1].dataType, t[1].dims), I = null, E = [$2, S];
          t.length === 3 && (I = O("c", t[2].dataType, t[2].dims.length), E.push(I));
          let A = U("output", t[0].dataType, u.length);
          E.push(A);
          let z2 = [{ name: "num_tile_n", type: "u32" }, { name: "M", type: "u32" }, { name: "N", type: "u32" }, { name: "K", type: "u32" }, { name: "alpha", type: "f32" }, { name: "beta", type: "f32" }], v = "", R = "";
          e.transA && e.transB ? (R = `
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${$2.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `, v = "value += tile_a[k][local_id.y] * tile_b[local_id.x][k];") : e.transA && !e.transB ? (R = `
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${$2.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `, v = "value += tile_a[k][local_id.y] * tile_b[k][local_id.x];") : !e.transA && e.transB ? (R = `
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${$2.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `, v = "value += tile_a[local_id.y][k] * tile_b[local_id.x][k];") : !e.transA && !e.transB && (R = `
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${$2.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `, v = "value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");
          let N = e.alpha === 1 ? "" : "value *= uniforms.alpha;";
          return `
  ${x.registerUniforms(z2).declareVariables(...E)}
  var<workgroup> tile_a: array<array<${$2.type.storage}, ${d}>, ${d}>;
  var<workgroup> tile_b: array<array<${S.type.storage}, ${d}>, ${d}>;
  ${x.mainStart([d, d, 1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${d};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${d};
    let num_tiles = (uniforms.K - 1) / ${d} + 1;
    var k_start = 0u;
    var value = ${A.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${R}
      k_start = k_start + ${d};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${d}; k++) {
        ${v}
      }
      workgroupBarrier();
    }

    ${N}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${I != null ? `let cOffset = ${I.broadcastedIndicesToOffset("vec2(m, n)", A)}; value += ${A.type.value}(uniforms.beta) * ${I.getByOffset("cOffset")};` : ""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`;
        };
        return m ? { name: "GemmShared", shaderCache: { hint: `${e.cacheKey}`, inputDependencies: b }, getRunData: () => ({ outputs: [{ dims: u, dataType: t[0].dataType }], dispatchGroup: { x: c * p }, programUniforms: y }), getShaderSource: T } : { name: "Gemm", shaderCache: { hint: `${e.cacheKey}`, inputDependencies: b }, getRunData: () => ({ outputs: [{ dims: u, dataType: t[0].dataType }], dispatchGroup: { x: Math.ceil(g / 64) }, programUniforms: y }), getShaderSource: _ };
      }, _l = (t) => {
        let e = t.transA, r = t.transB, n = t.alpha, o = t.beta;
        return { transA: e, transB: r, alpha: n, beta: o, cacheKey: `${t.transA};${t.transB};${t.alpha === 1}` };
      }, wl = (t, e) => {
        yg(t.inputs), t.compute(_g(t.inputs, e));
      };
    });
    Sl = V(() => {
      J();
      re();
      Ce();
      oe();
      [mt2, Tt, Ht2, Ft] = [0, 1, 2, 3], wg = (t) => {
        if (t[0].dims.length !== 4) throw new Error("only 4-D tensor is supported.");
        if (t[0].dims.length !== t[1].dims.length) throw new Error("input dimensions must be equal to grid dimensions");
        if (t[0].dims.length - 2 !== t[1].dims[t[1].dims.length - 1]) throw new Error(`last dimension of grid must be equal to ${t[0].dims.length - 2}`);
        if (t[0].dims[0] !== t[1].dims[0]) throw new Error("grid batch size must match input batch size");
      }, vg = `
  fn gs_get_cubic_coeffs(x: f32) -> vec4<f32> {
    let cubic_alpha = -0.75f;
    let x_abs = abs(x);
    var coeffs: vec4<f32>;
    coeffs[0] = (((cubic_alpha * (x_abs + 1) - 5 * cubic_alpha) * (x_abs + 1) + 8 * cubic_alpha) * (x_abs + 1) - 4 * cubic_alpha);
    coeffs[1] = (((cubic_alpha + 2) * x_abs - (cubic_alpha + 3)) * x_abs * x_abs + 1);
    coeffs[2] = (((cubic_alpha + 2) * (1 - x_abs) - (cubic_alpha + 3)) * (1 - x_abs) * (1 - x_abs) + 1);
    coeffs[3] = (((cubic_alpha * (2 - x_abs) - 5 * cubic_alpha) * (2 - x_abs) + 8 * cubic_alpha) * (2 - x_abs) - 4 * cubic_alpha);
    return coeffs;
  }
`, $g = (t) => `
  fn gs_bicubic_interpolate(p: mat4x4<${t}>, x: f32, y: f32) -> ${t} {
    var v: vec4<f32>;
    var coeffs = gs_get_cubic_coeffs(x);
    for (var i = 0; i < 4; i++) {
      v[i] = coeffs[0] * p[i][0] + coeffs[1] * p[i][1] + coeffs[2] * p[i][2] + coeffs[3] * p[i][3];
    }
    coeffs = gs_get_cubic_coeffs(y);
    let pixel = ${t}(coeffs[0] * v[0] + coeffs[1] * v[1] + coeffs[2] * v[2] + coeffs[3] * v[3]);
    return pixel;
  }
`, xg = (t) => `
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${t.alignCorners === 0 ? `
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    ` : `
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`, Sg = (t) => `
  ${t.paddingMode === "reflection" ? `
      fn gs_reflect(x: i32, x_min: f32, x_max: f32) -> u32 {
        var dx = 0.0;
        var fx = f32(x);
        let range = x_max - x_min;
        if (fx < x_min) {
          dx = x_min - fx;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_min + r;
          } else {
            fx = x_max - r;
          }
        } else if (fx > x_max) {
          dx = fx - x_max;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_max - r;
          } else {
            fx = x_min + r;
          }
        }
        return u32(fx);
      }` : ""}
`, Tg = (t, e, r) => `
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${e} {
     var pixel = ${e}(0);
     var indices = vec4<u32>(0);
     indices[${mt2}] = batch;
     indices[${Tt}] = channel;` + (() => {
        switch (r.paddingMode) {
          case "zeros":
            return `
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${Ht2}] = u32(r);
            indices[${Ft}] = u32(c);
          } else {
            return ${e}(0);
          }
        `;
          case "border":
            return `
          indices[${Ht2}] = u32(clamp(r, 0, H - 1));
          indices[${Ft}] = u32(clamp(c, 0, W - 1));
        `;
          case "reflection":
            return `
          indices[${Ht2}] = gs_reflect(r, border[1], border[3]);
          indices[${Ft}] = gs_reflect(c, border[0], border[2]);
        `;
          default:
            throw new Error(`padding mode ${r.paddingMode} is not supported`);
        }
      })() + `
    return ${t.getByIndices("indices")};
  }
`, Ig = (t, e, r) => (() => {
        switch (r.mode) {
          case "nearest":
            return `
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${mt2}], indices[${Tt}], border);
        `;
          case "bilinear":
            return `
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${mt2}], indices[${Tt}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${mt2}], indices[${Tt}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${mt2}], indices[${Tt}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${mt2}], indices[${Tt}], border);

          let dx2 = ${e}(f32(x2) - x);
          let dx1 = ${e}(x - f32(x1));
          let dy2 = ${e}(f32(y2) - y);
          let dy1 = ${e}(y - f32(y1));
          let result = dy2 * (dx2 * p11 + dx1 * p12) + dy1 * (dx2 * p21 + dx1 * p22);
        `;
          case "bicubic":
            return `
          let x0 = i32(floor(x)) - 1;
          let y0 = i32(floor(y)) - 1;
          var p: mat4x4<${e}>;
          for (var h = 0; h < 4; h++) {
            for (var w = 0; w < 4; w++) {
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${mt2}], indices[${Tt}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;
          default:
            throw new Error(`mode ${r.mode} is not supported`);
        }
      })() + `${t.setByOffset("global_idx", "result")}`, Cg = (t, e) => {
        let r = O("x", t[0].dataType, t[0].dims.length), n = [t[1].dims[0], t[1].dims[1], t[1].dims[2]], o = O("grid", t[1].dataType, n.length, 2), i = [t[0].dims[0], t[0].dims[1], t[1].dims[1], t[1].dims[2]];
        e.format === "NHWC" && (i = [t[0].dims[0], t[1].dims[1], t[1].dims[2], t[0].dims[3]], [mt2, Tt, Ht2, Ft] = [0, 3, 1, 2]);
        let s = U("output", t[0].dataType, i.length), u = r.type.value, d = k2.size(i), c = [{ type: 12, data: d }, ...W(t[0].dims, n, i)], p = (m) => `
  ${m.registerUniform("output_size", "u32").declareVariables(r, o, s)}
  ${vg}
  ${$g(u)}
  ${xg(e)}
  ${Sg(e)}
  ${Tg(r, u, e)}

  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${Ht2}]);
      let W_in = i32(uniforms.x_shape[${Ft}]);

      ${e.alignCorners === 0 ? `
      let x_min = -0.5;
      let x_max = f32(W_in) - 0.5;
      let y_min = -0.5;
      let y_max = f32(H_in) - 0.5;
      ` : `
      let x_min = 0.0;
      let x_max = f32(W_in) - 1.0;
      let y_min = 0.0;
      let y_max = f32(H_in) - 1.0;
      `};
      let border = vec4<f32>(x_min, y_min, x_max, y_max);

      let indices = ${s.offsetToIndices("global_idx")};
      var grid_indices = vec3<u32>(indices[${mt2}], indices[${Ht2}], indices[${Ft}]);
      let nxy = ${o.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${Ig(s, u, e)}
  }`;
        return { name: "GridSample", shaderCache: { hint: `${e.cacheKey}`, inputDependencies: ["type", "type"] }, getRunData: (m) => {
          let g = k2.size(i);
          return { outputs: [{ dims: i, dataType: m[0].dataType }], dispatchGroup: { x: Math.ceil(g / 64) }, programUniforms: c };
        }, getShaderSource: p };
      }, $l = (t, e) => {
        wg(t.inputs), t.compute(Cg(t.inputs, e));
      }, xl = (t) => ee({ alignCorners: t.align_corners, mode: t.mode, paddingMode: t.padding_mode, format: t.format });
    });
    ko = V(() => {
      J();
      re();
      Ce();
      jr();
      Jr2();
      oe();
      pt();
      Ue = (t, e) => t.length > e && t[e].dims.length > 0 ? t[e] : void 0, kg = (t, e) => {
        let r = t[0], n = Ue(t, 1), o = Ue(t, 2), i = Ue(t, 3), s = Ue(t, 4), u = Ue(t, 5), d = Ue(t, 6), c = Ue(t, 7);
        if (r.dims.length !== 3 && r.dims.length !== 5) throw new Error("Input query is expected to have 3 or 5 dimensions");
        let p = r.dims[0], m = r.dims[1], g = r.dims.length === 3 ? r.dims[2] : e.numHeads * r.dims[4], y = m, b = 0, _ = 0, T = Math.floor(g / e.numHeads);
        if (d && c && k2.size(d.dims) && k2.size(c.dims)) {
          if (d.dims.length !== 4) throw new Error('Input "past_key" is expected to have 4 dimensions');
          if (d.dims[0] !== p || d.dims[1] !== e.numHeads || d.dims[3] !== T) throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');
          if (c.dims[0] !== p || c.dims[1] !== e.numHeads || c.dims[3] !== T) throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');
          if (d.dims[2] !== c.dims[2]) throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');
          if (c.dims.length !== 4) throw new Error('Input "past_value" is expected to have 4 dimensions');
          b = d.dims[2], _ = d.dims[2];
        } else if (d && k2.size(d.dims) || c && k2.size(c.dims)) throw new Error('Input "past_key" and "past_value" shall be both present or both absent');
        let x;
        if (n && k2.size(n.dims) > 0) {
          if (r.dims.length !== 3) throw new Error('Input "query" is expected to have 3 dimensions when key is given');
          if (n.dims.length < 3 || n.dims.length > 5) throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');
          if (r.dims[0] !== n.dims[0]) throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');
          if (n.dims.length === 3) {
            if (n.dims[2] !== r.dims[2]) throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');
            x = 2, y = n.dims[1];
          } else if (n.dims.length === 5) {
            if (n.dims[2] !== e.numHeads || n.dims[3] !== 2 || n.dims[4] !== T) throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');
            if (o) throw new Error('Expect "value" be none when "key" has packed kv format.');
            x = 5, y = n.dims[1];
          } else {
            if (n.dims[1] !== e.numHeads || n.dims[3] !== T) throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');
            x = 0, y = n.dims[2];
          }
        } else {
          if (r.dims.length !== 5) throw new Error('Input "query" is expected to have 5 dimensions when key is empty');
          if (r.dims[2] !== e.numHeads || r.dims[3] !== 3) throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');
          x = 3;
        }
        if (i && k2.size(i.dims) > 0) {
          if (i.dims.length !== 1) throw new Error('Input "bias" is expected to have 1 dimension');
          if (n && n.dims.length === 5 && n.dims[3] === 2) throw new Error("bias is not allowed for packed kv.");
        }
        let $2 = b + y, S = 0;
        if (s && k2.size(s.dims) > 0) {
          S = 8;
          let z2 = s.dims;
          throw z2.length === 1 ? z2[0] === p ? S = 1 : z2[0] === 3 * p + 2 && (S = 3) : z2.length === 2 && z2[0] === p && z2[1] === $2 && (S = 5), S === 8 ? new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)') : new Error("Mask not supported");
        }
        let I = false, E = g;
        if (o && k2.size(o.dims) > 0) {
          if (o.dims.length !== 3 && o.dims.length !== 4) throw new Error('Input "value" is expected to have 3 or 4 dimensions');
          if (r.dims[0] !== o.dims[0]) throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');
          if (o.dims.length === 3) {
            if (y !== o.dims[1]) throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');
            E = o.dims[2];
          } else {
            if (y !== o.dims[2]) throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');
            E = o.dims[1] * o.dims[3], I = true;
          }
        }
        let A = false;
        if (s && k2.size(s.dims) > 0) throw new Error("Key padding mask is not supported");
        if (u && k2.size(u.dims) > 0) {
          if (u.dims.length !== 4) throw new Error('Input "attention_bias" is expected to have 4 dimensions');
          if (u.dims[0] !== p || u.dims[1] !== e.numHeads || u.dims[2] !== m || u.dims[3] !== $2) throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)');
        }
        return { batchSize: p, sequenceLength: m, pastSequenceLength: b, kvSequenceLength: y, totalSequenceLength: $2, maxSequenceLength: _, inputHiddenSize: 0, hiddenSize: g, vHiddenSize: E, headSize: T, vHeadSize: Math.floor(E / e.numHeads), numHeads: e.numHeads, isUnidirectional: false, pastPresentShareBuffer: false, maskFilterValue: e.maskFilterValue, maskType: S, scale: e.scale, broadcastResPosBias: A, passPastInKv: I, qkvFormat: x };
      }, Il = (t) => ee({ ...t }), Tl = ee({ perm: [0, 2, 1, 3] }), Pg = (t, e, r, n, o, i, s) => {
        let u = [n, o, i], d = k2.size(u), c = [{ type: 12, data: d }, { type: 12, data: s }, { type: 12, data: i }], p = (m) => {
          let g = U("qkv_with_bias", e.dataType, u), y = O("qkv", e.dataType, u), b = O("bias", r.dataType, u), _ = [{ name: "output_size", type: "u32" }, { name: "bias_offset", type: "u32" }, { name: "hidden_size", type: "u32" }];
          return `
  ${m.registerUniforms(_).declareVariables(y, b, g)}
  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`;
        };
        return t.compute({ name: "MultiHeadAttentionAddBias", shaderCache: { inputDependencies: ["type", "type"] }, getRunData: () => ({ outputs: [{ dims: u, dataType: e.dataType, gpuDataType: 0 }], dispatchGroup: { x: Math.ceil(d / 64) }, programUniforms: c }), getShaderSource: p }, { inputs: [e, r], outputs: [-1] })[0];
      }, sr2 = (t, e, r, n, o, i, s, u) => {
        let d = i;
        if (s && k2.size(s.dims) > 0) {
          if (n === 1) throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");
          return d = Pg(t, i, s, e, n, r * o, u), d = d.reshape([e, n, r, o]), r === 1 || n === 1 ? d : t.compute(Be(d, Tl.perm), { inputs: [d], outputs: [-1] })[0];
        } else return i.dims.length === 3 && (d = i.reshape([e, n, r, o])), r === 1 || n === 1 ? d : t.compute(Be(d, Tl.perm), { inputs: [d], outputs: [-1] })[0];
      }, Cl = (t, e) => {
        let r = kg(t.inputs, e), n = t.inputs[0], o = Ue(t.inputs, 1), i = Ue(t.inputs, 2), s = Ue(t.inputs, 3), u = Ue(t.inputs, 4), d = Ue(t.inputs, 5), c = Ue(t.inputs, 6), p = Ue(t.inputs, 7);
        if (n.dims.length === 5) throw new Error("Packed QKV is not implemented");
        if (o?.dims.length === 5) throw new Error("Packed KV is not implemented");
        let m = o && i && o.dims.length === 4 && i.dims.length === 4, g = sr2(t, r.batchSize, r.numHeads, r.sequenceLength, r.headSize, n, s, 0);
        if (m) return Gt(t, g, o, i, u, void 0, c, p, d, r);
        if (!o || !i) throw new Error("key and value must be provided");
        let y = sr2(t, r.batchSize, r.numHeads, r.kvSequenceLength, r.headSize, o, s, r.hiddenSize), b = sr2(t, r.batchSize, r.numHeads, r.kvSequenceLength, r.vHeadSize, i, s, 2 * r.hiddenSize);
        Gt(t, g, y, b, u, void 0, c, p, d, r);
      };
    });
    Oo = V(() => {
      J();
      re();
      Ce();
      oe();
      Og = (t) => {
        if (!t || t.length < 1) throw new Error("too few inputs");
      }, zg = (t, e) => {
        let r = [], n = e.numOutputs;
        return t[1].dims[0] > 0 && (t[1].getBigInt64Array().forEach((o) => r.push(Number(o))), n = r.length), ee({ numOutputs: n, axis: e.axis, splitSizes: r });
      }, Bg = (t) => `
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${t}u; i += 1u ) {
    if (index < ${j("uniforms.size_in_split_axis", "i", t)}) {
        return i;
    }
    }
    return ${t}u;
}`, Dg = (t) => {
        let e = t.length, r = [];
        for (let n = 0; n < e; ++n) {
          let o = t[n].setByIndices("indices", "input[global_idx]");
          e === 1 ? r.push(o) : n === 0 ? r.push(`if (output_number == ${n}u) { ${o} }`) : n === e - 1 ? r.push(`else { ${o} }`) : r.push(`else if (output_number == ${n}) { ${o} }`);
        }
        return `
      fn writeBufferData(output_number: u32, indices: ${t[0].type.indices}, global_idx: u32) {
        ${r.join(`
`)}
      }`;
      }, Po = (t, e) => {
        let r = t[0].dims, n = k2.size(r), o = t[0].dataType, i = k2.normalizeAxis(e.axis, r.length), s = new Array(e.numOutputs), u = O("input", o, r.length), d = new Array(e.numOutputs), c = [], p = [], m = 0, g = [{ type: 12, data: n }];
        for (let b = 0; b < e.numOutputs; b++) {
          m += e.splitSizes[b], d[b] = m;
          let _ = r.slice();
          _[i] = e.splitSizes[b], p.push(_), s[b] = U(`output${b}`, o, _.length), c.push({ dims: p[b], dataType: t[0].dataType });
        }
        g.push({ type: 12, data: d }, ...W(r, ...p));
        let y = (b) => `
  ${b.registerUniform("input_size", "u32").registerUniform("size_in_split_axis", "u32", d.length).declareVariables(u, ...s)}
  ${Bg(d.length)}
  ${Dg(s)}

  ${b.mainStart()}
    ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${u.offsetToIndices("global_idx")};
    var index = ${u.indicesGet("indices", i)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${j("uniforms.size_in_split_axis", "output_number - 1u", d.length)};
      ${u.indicesSet("indices", i, "index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;
        return { name: "Split", shaderCache: { hint: e.cacheKey, inputDependencies: ["rank"] }, getShaderSource: y, getRunData: () => ({ outputs: c, dispatchGroup: { x: Math.ceil(n / 64) }, programUniforms: g }) };
      }, Al = (t, e) => {
        Og(t.inputs);
        let r = t.inputs.length === 1 ? e : zg(t.inputs, e);
        t.compute(Po(t.inputs, r), { inputs: [0] });
      }, El = (t) => {
        let e = t.axis, r = t.splitSizes, n = t.numOutputs < 0 ? r.length : t.numOutputs;
        if (n !== r.length) throw new Error("numOutputs and splitSizes length must be equal");
        return ee({ axis: e, numOutputs: n, splitSizes: r });
      };
    });
    zo = V(() => {
      J();
      re();
      Ce();
      oe();
      Mg = (t, e) => {
        let [r, n, o, i] = t, { numHeads: s, rotaryEmbeddingDim: u } = e;
        if (r.dims.length !== 3 && r.dims.length !== 4) throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${r.dims.length}`);
        if (!k2.areEqual(n.dims, []) && !k2.areEqual(n.dims, [1]) && n.dims.length !== 2) throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${n.dims.length}`);
        if (o.dims.length !== 2) throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${o.dims.length}`);
        if (i.dims.length !== 2) throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${i.dims.length}`);
        if (!k2.areEqual(o.dims, i.dims)) throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");
        if (u > 0 && s === 0) throw new Error("num_heads must be provided if rotary_embedding_dim is specified");
        let d = r.dims[0], c = r.dims[r.dims.length - 2], p = o.dims[0], m = k2.sizeFromDimension(r.dims, 1) / c, g = u === 0 ? o.dims[1] * 2 : m / s;
        if (u > g) throw new Error("rotary_embedding_dim must be less than or equal to head_size");
        if (n.dims.length === 2) {
          if (d !== n.dims[0]) throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${n.dims[0]}`);
          if (c !== n.dims[1]) throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${n.dims[1]}`);
        }
        if (c > p) throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported");
        if (g / 2 !== o.dims[1] && u / 2 !== o.dims[1]) throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${o.dims[1]}`);
      }, ln2 = (t, e) => {
        let { interleaved: r, numHeads: n, rotaryEmbeddingDim: o, scale: i } = e, s = t[0].dims[0], u = k2.sizeFromDimension(t[0].dims, 1), d = t[0].dims[t[0].dims.length - 2], c = u / d, p = t[2].dims[1], m = o === 0 ? p * 2 : c / n, g = new Array(s, d, c / m, m - p), y = k2.computeStrides(g), b = [{ type: 1, data: i }, { type: 12, data: g }, { type: 12, data: y }, ...t[0].dims.length === 3 ? new Array({ type: 12, data: [u, c, m, 1] }) : [], ...t[0].dims.length === 4 ? new Array({ type: 12, data: [u, m, d * m, 1] }) : [], ...W(t[0].dims, t[1].dims, t[2].dims, t[3].dims, t[0].dims)], _ = (T) => {
          let x = O("input", t[0].dataType, t[0].dims.length), $2 = O("position_ids", t[1].dataType, t[1].dims.length), S = O("cos_cache", t[2].dataType, t[2].dims.length), I = O("sin_cache", t[3].dataType, t[3].dims.length), E = U("output", t[0].dataType, t[0].dims.length);
          return T.registerUniforms([{ name: "scale", type: "f32" }, { name: "global_shape", type: "u32", length: g.length }, { name: "global_strides", type: "u32", length: y.length }, { name: "input_output_strides", type: "u32", length: y.length }]), `
        ${T.declareVariables(x, $2, S, I, E)}

        ${T.mainStart(Bt2)}
          let half_rotary_emb_dim = uniforms.${S.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${T.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${$2.broadcastedIndicesToOffset("bsnh.xy", U("", $2.type.tensor, 2))};
            let position_id =
                u32(${$2.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${r});
            let j = i + select(half_rotary_emb_dim, 1, ${r});
            let re = ${x.getByOffset("i")} * ${S.get("position_id", "bsnh[3]")} -
                ${x.getByOffset("j")} * ${I.get("position_id", "bsnh[3]")};
            ${E.setByOffset("i", "re")}
            let im = ${x.getByOffset("i")} * ${I.get("position_id", "bsnh[3]")} +
                ${x.getByOffset("j")} * ${S.get("position_id", "bsnh[3]")};
            ${E.setByOffset("j", "im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${E.setByOffset("k", x.getByOffset("k"))}
          }
        }`;
        };
        return { name: "RotaryEmbedding", shaderCache: { hint: ee({ interleaved: r }).cacheKey, inputDependencies: ["rank", "rank", "rank", "rank"] }, getShaderSource: _, getRunData: () => ({ outputs: [{ dims: t[0].dims, dataType: t[0].dataType }], dispatchGroup: { x: Math.ceil(k2.size(g) / Bt2) }, programUniforms: b }) };
      }, kl = (t, e) => {
        Mg(t.inputs, e), t.compute(ln2(t.inputs, e));
      };
    });
    zl = V(() => {
      Ce();
      J();
      Jr2();
      ko();
      Oo();
      pt();
      zo();
      oe();
      Rg = (t, e) => {
        if (e.doRotary && t.length <= 7) throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");
        let r = t[0], n = t[1], o = t[2], i = t[3], s = t[4];
        if (e.doRotary !== 0 && t.length <= 7) throw new Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");
        if (e.localWindowSize !== -1) throw new Error("Local attention is not supported");
        if (e.softcap !== 0) throw new Error("Softcap is not supported");
        if (e.rotaryInterleaved !== 0) throw new Error("Rotary interleaved is not supported");
        if (e.smoothSoftmax) throw new Error("Smooth softmax is not supported");
        if (r.dims.length !== 3 && r.dims.length !== 5) throw new Error("Input query is expected to have 3 or 5 dimensions");
        let u = false, d = r.dims[0], c = r.dims[1], p = r.dims.length === 3 ? u ? r.dims[2] / 3 : r.dims[2] : e.numHeads * r.dims[4], m = c, g = 0, y = !n || n.dims.length === 0, b = Math.floor(y ? p / (e.numHeads + 2 * e.kvNumHeads) : p / e.numHeads);
        y && (p = b * e.numHeads);
        let _ = i && i.dims.length !== 0, T = s && s.dims.length !== 0;
        if (_ && i.dims.length === 4 && i.dims[0] === d && i.dims[1] !== e.kvNumHeads && i.dims[2] === e.kvNumHeads && i.dims[3] === b) throw new Error("BSNH pastKey/pastValue is not supported");
        if (_ && T) {
          if (i.dims.length !== 4) throw new Error('Input "past_key" is expected to have 4 dimensions');
          if (s.dims.length !== 4) throw new Error('Input "past_value" is expected to have 4 dimensions');
          g = i.dims[2];
        } else if (_ || T) throw new Error('Input "past_key" and "past_value" shall be both present or both absent');
        let $2 = 1;
        if (n && n.dims.length > 0) {
          if (r.dims.length !== 3) throw new Error('Input "query" is expected to have 3 dimensions when key is given');
          if (n.dims.length < 3 || n.dims.length > 5) throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');
          if (r.dims[0] !== n.dims[0]) throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');
          if (n.dims.length === 3) {
            if (r.dims[2] % n.dims[2] !== 0) throw new Error('Dimension 2 of "query" should be a multiple of "key"');
            m = n.dims[1];
          } else if (n.dims.length === 5) {
            if (n.dims[2] !== e.numHeads || n.dims[3] !== 2 || n.dims[4] !== b) throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');
            if (o) throw new Error('Expect "value" be none when "key" has packed kv format.');
            m = n.dims[1];
          } else {
            if (n.dims[1] !== e.numHeads || n.dims[3] !== b) throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');
            m = n.dims[2];
          }
        } else {
          if (r.dims.length !== 3 && r.dims.length !== 5) throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');
          if (r.dims.length === 5 && (r.dims[2] !== e.numHeads || r.dims[3] !== 3)) throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');
          $2 = 3;
        }
        let S = 0, I = false, E = e.kvNumHeads ? b * e.kvNumHeads : p;
        if (o && o.dims.length > 0) {
          if (o.dims.length !== 3 && o.dims.length !== 4) throw new Error('Input "value" is expected to have 3 or 4 dimensions');
          if (r.dims[0] !== o.dims[0]) throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');
          if (o.dims.length === 3) {
            if (m !== o.dims[1]) throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');
            E = o.dims[2];
          } else {
            if (m !== o.dims[2]) throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');
            E = o.dims[1] * o.dims[3], I = true;
          }
        }
        let A = t.length > 4 ? t[5] : void 0;
        if (A) {
          if (A.dims.length === 0) throw new Error("seqlens_k must be at least 1D, got scalar.");
          let N = A.dims.reduce((F, q) => F * q, 1);
          if (N !== d) throw new Error(`seqlens_k must have batch_size (${d}) elements, got ${N}.`);
          for (let F = 0; F < A.dims.length; F++) if (A.dims[F] !== 1 && A.dims[F] !== d) throw new Error(`seqlens_k has unexpected shape. Each dimension must be 1 or batch_size (${d}), got dims[${F}] = ${A.dims[F]}.`);
        }
        return { batchSize: d, sequenceLength: c, pastSequenceLength: g, kvSequenceLength: m, totalSequenceLength: -1, maxSequenceLength: -1, inputHiddenSize: 0, hiddenSize: p, vHiddenSize: E, headSize: b, vHeadSize: Math.floor(E / e.kvNumHeads), numHeads: e.numHeads, kvNumHeads: e.kvNumHeads, nReps: e.numHeads / e.kvNumHeads, pastPresentShareBuffer: false, maskType: S, scale: e.scale, broadcastResPosBias: false, passPastInKv: I, qkvFormat: $2 };
      }, Ug = ee({ perm: [0, 2, 1, 3] }), Pl = (t, e, r) => {
        let n = e, o = r.kvNumHeads;
        return e.dims.length === 3 && r.kvSequenceLength !== 0 && (n = e.reshape([r.batchSize, r.kvSequenceLength, o, r.headSize]), n = t.compute(Be(n, Ug.perm), { inputs: [n], outputs: [-1] })[0]), n;
      }, Ng = (t, e, r, n) => {
        let o = 7, i = ["type", "type"], s = [t * e], u = t * e, d = [{ type: 12, data: u }, { type: 12, data: e }, { type: 12, data: t }], c = (p) => {
          let m = O("seq_lens", r.dataType, r.dims), g = O("total_seq_lens", n.dataType, n.dims), y = U("pos_ids", o, s), b = [{ name: "output_size", type: "u32" }, { name: "sequence_length", type: "u32" }, { name: "batch_size", type: "u32" }];
          return `
  ${p.registerUniforms(b).declareVariables(m, g, y)}
  ${p.mainStart()}
    ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let total_sequence_length = u32(${g.getByOffset("0")});
    let is_subsequent_prompt = uniforms.sequence_length > 1 && uniforms.sequence_length != total_sequence_length;
    let is_first_prompt = !is_subsequent_prompt && uniforms.sequence_length == total_sequence_length;
    let batch_idx = global_idx / uniforms.sequence_length;
    let sequence_idx = i32(global_idx % uniforms.sequence_length);
    var pos_id: i32 = 0;
    let seqlen = ${m.getByOffset("batch_idx")};
    let total_seqlen = seqlen + 1;
    if (is_first_prompt) {
      if (sequence_idx < total_seqlen) {
        pos_id = sequence_idx;
      } else {
        pos_id = 1;
      }
      ${y.setByOffset("global_idx", "pos_id")}
    } else if (is_subsequent_prompt) {
      let past_seqlen = total_seqlen - i32(uniforms.sequence_length);
      if (past_seqlen + sequence_idx < total_seqlen) {
        pos_id = past_seqlen + sequence_idx;
      } else {
        pos_id = 1;
      }
      ${y.setByOffset("global_idx", "pos_id")}
    } else if (global_idx < uniforms.batch_size) {
      ${y.setByOffset("global_idx", "seqlen")}
    };
  }
  `;
        };
        return { name: "GeneratePositionIds", shaderCache: { hint: `${t};${e}`, inputDependencies: i }, getRunData: () => ({ outputs: [{ dims: s, dataType: o }], dispatchGroup: { x: Math.ceil(u / 64) }, programUniforms: d }), getShaderSource: c };
      }, Ol = (t, e) => {
        let r = Rg(t.inputs, e);
        if (t.inputs[0].dims.length === 5) throw new Error("Packed QKV is not implemented");
        if (t.inputs[1]?.dims.length === 5) throw new Error("Packed KV is not implemented");
        let n = t.inputs[0], o = t.inputs[1] && t.inputs[1].dims.length > 0 ? t.inputs[1] : void 0, i = t.inputs[2] && t.inputs[2].dims.length > 0 ? t.inputs[2] : void 0, s = t.inputs[3] && t.inputs[3].dims.length !== 0 ? t.inputs[3] : void 0, u = t.inputs[4] && t.inputs[4].dims.length !== 0 ? t.inputs[4] : void 0, d = t.inputs.length > 4 ? t.inputs[5] : void 0, c = t.inputs.length > 5 ? t.inputs[6] : void 0, p = r.kvNumHeads ? r.kvNumHeads : r.numHeads, m = ee({ axis: 2, numOutputs: 3, splitSizes: [r.numHeads * r.headSize, p * r.headSize, p * r.headSize] }), [g, y, b] = !o && !i ? t.compute(Po([n], m), { inputs: [n], outputs: [-1, -1, -1] }) : [n, o, i], _, T;
        if (e.doRotary) {
          let I = t.compute(Ng(r.batchSize, r.sequenceLength, d, c), { inputs: [d, c], outputs: [-1] })[0], E = t.inputs[7], A = t.inputs[8], z2 = ee({ interleaved: e.rotaryInterleaved !== 0, numHeads: r.numHeads, rotaryEmbeddingDim: 0, scale: e.scale }), v = [g, I, E, A], R = [-1];
          _ = t.compute(ln2(v, z2), { inputs: v, outputs: R })[0], v.splice(0, 1, y);
          let N = ee({ interleaved: e.rotaryInterleaved !== 0, numHeads: r.kvNumHeads, rotaryEmbeddingDim: 0, scale: e.scale });
          T = t.compute(ln2(v, N), { inputs: v, outputs: R })[0];
        }
        let x = sr2(t, r.batchSize, r.numHeads, r.sequenceLength, r.headSize, e.doRotary ? _ : g, void 0, 0), $2 = Pl(t, e.doRotary ? T : y, r), S = Pl(t, b, r);
        Gt(t, x, $2, S, void 0, void 0, s, u, void 0, r, d, c);
      };
    });
    Ml = V(() => {
      J();
      re();
      pt();
      oe();
      Bl = (t, e, r, n, o, i, s, u) => {
        let d = fe(i), c = d === 1 ? "f32" : `vec${d}f`, p = d === 1 ? "vec2f" : `mat2x${d}f`, m = o * s, g = 64;
        m === 1 && (g = 256);
        let y = [o, s, i / d], b = [o, s, 2], _ = ["rank", "type", "type"], T = [];
        T.push(...W(y, b));
        let x = ($2) => {
          let S = O("x", e.dataType, 3, d), I = O("scale", r.dataType, r.dims), E = O("bias", n.dataType, n.dims), A = U("output", 1, 3, 2), z2 = [S, I, E, A];
          return `
  var<workgroup> workgroup_shared : array<${p}, ${g}>;
  const workgroup_size = ${g}u;
  ${$2.declareVariables(...z2)}
  ${$2.mainStart(g)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${c}(0);
    var squared_sum = ${c}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${c}(${S.get("batch", "channel", "h")});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${p}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${Ze("workgroup_shared[0][0]", d)} / f32(hight * ${d});
      let squared_sum_final = ${Ze("workgroup_shared[0][1]", d)} / f32(hight * ${d});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${u}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`;
        };
        return t.compute({ name: "InstanceNormComputeChannelScaleShift", shaderCache: { hint: `${d};${u};${g}`, inputDependencies: _ }, getRunData: () => ({ outputs: [{ dims: b, dataType: 1 }], dispatchGroup: { x: m }, programUniforms: T }), getShaderSource: x }, { inputs: [e, r, n], outputs: [-1] })[0];
      }, Vg = (t, e, r) => {
        let n = e[0].dims, o = n, i = 2, s = n[0], u = n[1], d = k2.sizeFromDimension(n, i), c = fe(d), p = k2.size(o) / c, m = Bl(t, e[0], e[1], e[2], s, d, u, r.epsilon), g = [s, u, d / c], y = [s, u], b = ["type", "none"], _ = (T) => {
          let x = O("x", e[0].dataType, g.length, c), $2 = O("scale_shift", 1, y.length, 2), S = U("output", e[0].dataType, g.length, c), I = [x, $2, S];
          return `
  ${T.registerUniform("output_size", "u32").declareVariables(...I)}
  ${T.mainStart()}
  ${T.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${S.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${$2.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${x.getByOffset("global_idx")} * ${S.type.value}(scale_shift.x) + ${S.type.value}(scale_shift.y);
      ${S.setByOffset("global_idx", "value")};
  }`;
        };
        t.compute({ name: "InstanceNormalization", shaderCache: { hint: `${c}`, inputDependencies: b }, getRunData: () => ({ outputs: [{ dims: o, dataType: e[0].dataType }], dispatchGroup: { x: Math.ceil(p / 64) }, programUniforms: [{ type: 12, data: p }, ...W(g, y, g)] }), getShaderSource: _ }, { inputs: [e[0], m] });
      }, Lg = (t, e, r) => {
        let n = e[0].dims, o = n, i = n[0], s = n[n.length - 1], u = k2.sizeFromDimension(n, 1) / s, d = fe(s), c = k2.size(o) / d, p = [{ type: 12, data: u }, { type: 12, data: Math.floor(s / d) }], m = ["type", "type"], g = false, y = [0, n.length - 1];
        for (let x = 0; x < n.length - 2; x++) g = g || n[x + 1] !== 1, y.push(x + 1);
        g = g && n[n.length - 1] !== 1;
        let b = g ? t.compute(Be(t.inputs[0], y), { inputs: [t.inputs[0]], outputs: [-1] })[0] : t.inputs[0].reshape(Array.from({ length: n.length }, (x, $2) => n[y[$2]])), _ = Bl(t, b, e[1], e[2], i, u, s, r.epsilon), T = (x) => {
          let $2 = we(e[0].dataType), S = d === 1 ? "vec2f" : `mat${d}x2f`, I = (z2) => {
            let v = z2 === 0 ? "x" : "y", R = d === 1 ? "f32" : `vec${d}f`;
            switch (d) {
              case 1:
                return `${$2}(${R}(scale.${v}))`;
              case 2:
                return `vec2<${$2}>(${R}(scale[0].${v}, scale[1].${v}))`;
              case 4:
                return `vec4<${$2}>(${R}(scale[0].${v}, scale[1].${v}, scale[2].${v}, scale[3].${v}))`;
              default:
                throw new Error(`Not supported compoents ${d}`);
            }
          }, E = O("input", e[0].dataType, e[0].dims, d), A = U("output", e[0].dataType, o, d);
          return `
  @group(0) @binding(0) var<storage, read> input : array<${E.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${S}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${A.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${x.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${I(0)}, ${I(1)});
  }`;
        };
        t.compute({ name: "InstanceNormalizationNHWC", shaderCache: { hint: `${d}`, inputDependencies: m }, getRunData: () => ({ outputs: [{ dims: o, dataType: e[0].dataType }], dispatchGroup: { x: Math.ceil(c / 64) }, programUniforms: p }), getShaderSource: T }, { inputs: [e[0], _] });
      }, Dl = (t, e) => {
        e.format === "NHWC" ? Lg(t, t.inputs, e) : Vg(t, t.inputs, e);
      };
    });
    Ul = V(() => {
      J();
      re();
      oe();
      Wg = (t) => {
        if (!t || t.length < 2) throw new Error("layerNorm requires at least 2 inputs.");
      }, Gg = (t, e, r) => {
        let n = e.simplified, o = t[0].dims, i = t[1], s = !n && t[2], u = o, d = k2.normalizeAxis(e.axis, o.length), c = k2.sizeToDimension(o, d), p = k2.sizeFromDimension(o, d), m = k2.size(i.dims), g = s ? k2.size(s.dims) : 0;
        if (m !== p || s && g !== p) throw new Error(`Size of X.shape()[axis:] == ${p}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${m} and bias size of ${g}`);
        let y = [];
        for (let E = 0; E < o.length; ++E) E < d ? y.push(o[E]) : y.push(1);
        let b = fe(p), _ = ["type", "type"], T = [{ type: 12, data: c }, { type: 1, data: p }, { type: 12, data: Math.floor(p / b) }, { type: 1, data: e.epsilon }];
        s && _.push("type");
        let x = r > 1, $2 = r > 2, S = (E) => {
          let A = we(t[0].dataType), z2 = [O("x", t[0].dataType, t[0].dims, b), O("scale", i.dataType, i.dims, b)];
          s && z2.push(O("bias", s.dataType, s.dims, b)), z2.push(U("output", t[0].dataType, u, b)), x && z2.push(U("mean_data_output", 1, y)), $2 && z2.push(U("inv_std_output", 1, y));
          let v = [{ name: "norm_count", type: "u32" }, { name: "norm_size", type: "f32" }, { name: "norm_size_vectorized", type: "u32" }, { name: "epsilon", type: "f32" }];
          return `
  ${E.registerUniforms(v).declareVariables(...z2)}
  ${E.mainStart()}
    ${E.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${ho("f32", b)};
    var mean_square_vector = ${ho("f32", b)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${Dt(A, b, "x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${Ze("mean_vector", b)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${Ze("mean_square_vector", b)} / uniforms.norm_size ${n ? "" : "- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${Dt(A, b, "x[j + offset]")};
      let f32scale = ${Dt(A, b, "scale[j]")};
      output[j + offset] = ${z2[0].type.value}((f32input ${n ? "" : "- mean"}) * inv_std_dev * f32scale
        ${s ? `+ ${Dt(A, b, "bias[j]")}` : ""}
      );
    }

    ${x ? "mean_data_output[global_idx] = mean" : ""};
    ${$2 ? "inv_std_output[global_idx] = inv_std_dev" : ""};
  }`;
        }, I = [{ dims: u, dataType: t[0].dataType }];
        return x && I.push({ dims: y, dataType: 1 }), $2 && I.push({ dims: y, dataType: 1 }), { name: "LayerNormalization", shaderCache: { hint: `${b};${r};${n}`, inputDependencies: _ }, getRunData: () => ({ outputs: I, dispatchGroup: { x: Math.ceil(c / 64) }, programUniforms: T }), getShaderSource: S };
      }, Rl = (t, e) => {
        Wg(t.inputs), t.compute(Gg(t.inputs, e, t.outputCount));
      };
    });
    Vl = V(() => {
      re();
      an2();
      sn2();
      Hg = (t) => {
        if (!t || t.length !== 2) throw new Error("MatMul requires 2 inputs.");
        if (t[0].dims[t[0].dims.length - 1] !== t[1].dims[t[1].dims.length - 2]) throw new Error("shared dimension does not match.");
      }, Nl = (t) => {
        Hg(t.inputs);
        let e = ot2.calcShape(t.inputs[0].dims, t.inputs[1].dims, true);
        if (!e) throw new Error("Can't use matmul on the given tensors");
        let r = e[e.length - 1], n = t.inputs[0].dims[t.inputs[0].dims.length - 1];
        if (r < 8 && n < 8) t.compute(on2(t.inputs, { activation: "" }, e));
        else {
          let o = e[e.length - 2], i = k2.size(t.inputs[0].dims.slice(0, -2)), s = k2.size(t.inputs[1].dims.slice(0, -2));
          if (i !== 1 && o === 1 && s === 1) {
            let u = t.inputs[0].reshape([1, i, n]), d = t.inputs[1].reshape([1, n, r]), c = [1, i, r], p = [u, d];
            t.compute(ar2(p, { activation: "" }, e, c), { inputs: p });
          } else t.compute(ar2(t.inputs, { activation: "" }, e));
        }
      };
    });
    Gl = V(() => {
      J();
      re();
      Ce();
      oe();
      Fg = (t, e) => {
        if (t.length < 3 || t.length > 4) throw new Error("MatMulNBits requires 3 or 4 inputs");
        let r = t[0], n = r.dims.length;
        if (r.dims[n - 1] !== e.k) throw new Error("The last dim of input shape does not match the k value");
        let o = Math.floor((e.k + e.blockSize - 1) / e.blockSize), i = e.blockSize / 8 * e.bits, s = t[1];
        if (!k2.areEqual(s.dims, [e.n, o, i])) throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");
        let d = t[2].dims;
        if (k2.size(d) !== e.n * o) throw new Error("scales input size error.");
        if (t.length === 4) {
          let p = t[3].dims, m = e.n * (e.bits === 8 ? o : Math.floor((o * e.bits + 7) / 8));
          if (k2.size(p) !== m) throw new Error("zeroPoints input size error.");
        }
      }, qg = (t, e) => {
        let r = t[0].dims, n = r.length, o = r[n - 2], i = e.k, s = e.n, u = r.slice(0, n - 2), d = k2.size(u), p = t[1].dims[2] / 4, m = t[0].dataType, g = fe(e.k), y = fe(p), b = fe(s), _ = u.concat([o, s]), T = o > 1 && s / b % 2 === 0 ? 2 : 1, x = k2.size(_) / b / T, $2 = 64, S = [], I = [d, o, i / g], E = k2.convertShape(t[1].dims).slice();
        E.splice(-1, 1, p / y), S.push(...W(I)), S.push(...W(E)), S.push(...W(t[2].dims)), t.length === 4 && S.push(...W(k2.convertShape(t[3].dims)));
        let A = [d, o, s / b];
        S.push(...W(A));
        let z2 = (v) => {
          let R = I.length, N = O("a", t[0].dataType, R, g), F = O("b", 12, E.length, y), q = O("scales", t[2].dataType, t[2].dims.length), X = [N, F, q], B = t.length === 4 ? O("zero_points", 12, t[3].dims.length) : void 0;
          B && X.push(B);
          let L = A.length, Q2 = U("output", t[0].dataType, L, b), Y = we(t[0].dataType), Z = (() => {
            switch (g) {
              case 1:
                return `array<${Y}, 8>`;
              case 2:
                return `mat4x2<${Y}>`;
              case 4:
                return `mat2x4<${Y}>`;
              default:
                throw new Error(`${g}-component is not supported.`);
            }
          })(), te = Math.floor(32 / e.bits), ae = Math.floor(te / 8), le2 = () => {
            let M = "";
            for (let G = 0; G < ae; G++) {
              let be2 = G * e.bits * 4, Ee2 = be2 + e.bits;
              M += `
          // reuse a data (pass ${G})
            var input_offset${G > 0 ? G : ""} = ${G === 0 ? N.indicesToOffset(`${N.type.indices}(batch, row, word_offset)`) : "input_offset"};
            var a_data${G > 0 ? G : ""}: ${Z};
            for (var j${G > 0 ? G : ""}: u32 = 0; j${G > 0 ? G : ""} < ${8 / g}; j${G > 0 ? G : ""}++) {
              a_data${G > 0 ? G : ""}[j${G > 0 ? G : ""}] = ${N.getByOffset(`input_offset${G > 0 ? G : ""}`)};
              input_offset${G > 0 ? G : ""}++;
            }
          `;
              for (let $e2 = 0; $e2 < b * T; $e2++) M += `
            b_value = ${y === 1 ? `b${$e2}_data` : `b${$e2}_data[i]`};
            ${e.bits === 2 ? `{
              let half_word = b_value >> ${G * 16}u;
              let byte_lo = half_word & 0xFFu;
              let byte_hi = (half_word >> 8u) & 0xFFu;
              let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
              b_value_lower = unpack4xU8(spread_word & b_mask);
              b_value_upper = unpack4xU8((spread_word >> 2u) & b_mask);
            }` : `b_value_lower = unpack4xU8((b_value >> ${be2}u) & b_mask);
            b_value_upper = unpack4xU8((b_value >> ${Ee2}u) & b_mask);`}
            b_quantized_values = ${Z}(${Array.from({ length: 4 }, (Pe, he) => `${Y}(b_value_lower[${he}]), ${Y}(b_value_upper[${he}])`).join(", ")});
            b_dequantized_values = ${g === 1 ? `${Z}(${Array.from({ length: 8 }, (Pe, he) => `(b_quantized_values[${he}] - ${B ? `zero_point${$e2}` : "zero_point"}) * scale${$e2}`).join(", ")});` : `(b_quantized_values - ${Z}(${Array(8).fill(`${B ? `zero_point${$e2}` : "zero_point"}`).join(",")})) * scale${$e2};`};
            workgroup_shared[local_id.x * ${T} + ${Math.floor($e2 / b)}]${b > 1 ? `[${$e2 % b}]` : ""} += ${Array.from({ length: 8 / g }, (Pe, he) => `${g === 1 ? `a_data${G > 0 ? G : ""}[${he}] * b_dequantized_values[${he}]` : `dot(a_data${G > 0 ? G : ""}[${he}], b_dequantized_values[${he}])`}`).join(" + ")};
          `;
            }
            return M;
          }, Me = () => {
            let M = `
            var col_index = col * ${b};
            ${B ? `
            let zero_point_values_per_byte: u32 = ${Math.floor(8 / e.bits)}u;
            let zero_point_bytes_per_col = (nBlocksPerCol + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;` : `
            // The default zero point is ${Math.pow(2, e.bits - 1)} for unsigned ${e.bits}-bit quantization.
            let zero_point = ${Y}(${Math.pow(2, e.bits - 1).toFixed(1)});`}
            `;
            for (let G = 0; G < b * T; G++) M += `
            let scale${G} = ${q.getByOffset("col_index * nBlocksPerCol + block")};
            ${B ? `
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${e.bits}u);
            zero_point_word = ${B.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${G} = ${Y}((zero_point_word) & ${e.bits === 2 ? "0x3u" : "0xFu"});` : ""}
            col_index += 1;`;
            return M;
          }, ve = () => {
            let M = `col_index = col * ${b};`;
            for (let G = 0; G < b * T; G++) M += `
            let b${G}_data = ${F.getByIndices(`${F.type.indices}(col_index, block, word)`)};
            col_index += 1;`;
            return M += `
            var b_value: u32;
            let b_mask: u32 = ${e.bits === 2 ? "0x03030303u" : "0x0F0F0F0Fu"};
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${Z};
            var b_dequantized_values: ${Z};`, M;
          };
          return `
        var<workgroup> workgroup_shared: array<${Q2.type.value}, ${T * $2}>;
        ${v.declareVariables(...X, Q2)}
        ${v.mainStart([$2, 1, 1])}
          let output_indices = ${Q2.offsetToIndices(`(global_idx / ${$2}) * ${T}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${$2}) {
            //process one block
            var word_offset: u32 = block * ${e.blockSize / g};
            ${Me()}
            for (var word: u32 = 0; word < ${p}; word += ${y}) {
              ${ve()}
              for (var i: u32 = 0; i < ${y}; i++) {
                ${le2()}
                word_offset += ${te / g};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${T}) {
            var output_value: ${Q2.type.value} = ${Q2.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${$2}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${T};
            }
            ${Q2.setByIndices(`${Q2.type.indices}(batch, row, col + local_id.x)`, "output_value")};
          }
        }`;
        };
        return { name: "MatMulNBits", shaderCache: { hint: `${e.blockSize};${e.bits};${g};${y};${b};${T};${$2}`, inputDependencies: Array(t.length).fill("rank") }, getRunData: () => ({ outputs: [{ dims: _, dataType: m }], dispatchGroup: { x }, programUniforms: S }), getShaderSource: z2 };
      }, Kg = (t, e) => {
        let r = t[0].dims, n = r.length, o = r[n - 2], i = e.k, s = e.n, u = r.slice(0, n - 2), d = k2.size(u), p = t[1].dims[2] / 4, m = t[0].dataType, g = fe(e.k), y = fe(p), b = u.concat([o, s]), _ = 128, T = s % 8 === 0 ? 8 : s % 4 === 0 ? 4 : 1, x = _ / T, $2 = Math.floor(32 / e.bits), S = x * y * $2, I = S / g, E = S / e.blockSize, A = k2.size(b) / T, z2 = [], v = [d, o, i / g], R = k2.convertShape(t[1].dims).slice();
        R.splice(-1, 1, p / y), z2.push(...W(v)), z2.push(...W(R)), z2.push(...W(t[2].dims)), t.length === 4 && z2.push(...W(k2.convertShape(t[3].dims)));
        let N = [d, o, s];
        z2.push(...W(N));
        let F = (q) => {
          let X = v.length, B = O("a", t[0].dataType, X, g), L = O("b", 12, R.length, y), Q2 = O("scales", t[2].dataType, t[2].dims.length), Y = [B, L, Q2], Z = t.length === 4 ? O("zero_points", 12, t[3].dims.length) : void 0;
          Z && Y.push(Z);
          let te = N.length, ae = U("output", t[0].dataType, te), le2 = we(t[0].dataType), Me = () => {
            switch (g) {
              case 1:
                return `
          let a_data0 = vec4<${le2}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${le2}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;
              case 2:
                return `
          let a_data0 = vec4<${le2}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${le2}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;
              case 4:
                return `
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;
              default:
                throw new Error(`${g}-component is not supported.`);
            }
          };
          return `
        var<workgroup> sub_a: array<${B.type.value}, ${I}>;
        var<workgroup> inter_results: array<array<${ae.type.value}, ${x}>, ${T}>;
        ${q.declareVariables(...Y, ae)}
        ${q.mainStart([x, T, 1])}
          let output_indices = ${ae.offsetToIndices(`workgroup_index * ${T}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${E} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${I};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${I}; a_offset += ${_})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${B.getByIndices(`${B.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${B.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${E} + local_id.x;
            ${Z ? `
            let zero_point_values_per_byte: u32 = ${Math.floor(8 / e.bits)}u;
            let zero_point_bytes_per_col = (n_blocks_per_col + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${e.bits}u);
            let zero_point_word = ${Z.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${le2}((zero_point_word) & ${e.bits === 2 ? "0x3u" : "0xFu"});` : `
            // The default zero point is ${Math.pow(2, e.bits - 1)} for unsigned ${e.bits}-bit quantization.
            let zero_point = ${le2}(${Math.pow(2, e.bits - 1).toFixed(1)});`}
            let scale = ${Q2.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${L.getByIndices(`${L.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${e.blockSize / g};
            for (var i: u32 = 0; i < ${y}; i++) {
              let b_value = ${y === 1 ? "b_data" : "b_data[i]"};
              ${(() => {
            let ve = Math.floor($2 / 8), M = "";
            for (let G = 0; G < ve; G++) {
              let be2 = G * e.bits * 4, Ee2 = be2 + e.bits;
              M += `
              ${Me()}
              {${e.bits === 2 ? `
                let half_word = b_value >> ${G * 16}u;
                let byte_lo = half_word & 0xFFu;
                let byte_hi = (half_word >> 8u) & 0xFFu;
                let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
                let b_value_lower = unpack4xU8(spread_word & 0x03030303u);
                let b_value_upper = unpack4xU8((spread_word >> 2u) & 0x03030303u);` : `
                let b_value_lower = unpack4xU8((b_value >> ${be2}u) & 0x0F0F0F0Fu);
                let b_value_upper = unpack4xU8((b_value >> ${Ee2}u) & 0x0F0F0F0Fu);`}
                let b_quantized_values = mat2x4<${le2}>(${Array.from({ length: 4 }, ($e2, Pe) => `${le2}(b_value_lower[${Pe}]), ${le2}(b_value_upper[${Pe}])`).join(", ")});
                let b_dequantized_values = (b_quantized_values - mat2x4<${le2}>(${Array(8).fill("zero_point").join(",")})) * scale;
                inter_results[local_id.y][local_id.x] += ${Array.from({ length: 2 }, ($e2, Pe) => `${`dot(a_data${Pe}, b_dequantized_values[${Pe}])`}`).join(" + ")};
              }
              word_offset += ${8 / g};`;
            }
            return M;
          })()}
            }
            workgroupBarrier();
          }

          if (local_idx < ${T}) {
            var output_value: ${ae.type.value} = ${ae.type.value}(0);
            for (var b = 0u; b < ${x}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${ae.setByIndices(`${ae.type.indices}(batch, row, col + local_idx)`, "output_value")}
            }
          }
        }`;
        };
        return { name: "BlockwiseMatMulNBits32", shaderCache: { hint: `${e.blockSize};${g};${y};${x};${T}`, inputDependencies: Array(t.length).fill("rank") }, getRunData: () => ({ outputs: [{ dims: b, dataType: m }], dispatchGroup: { x: A }, programUniforms: z2 }), getShaderSource: F };
      }, Ll = (t, e) => {
        Fg(t.inputs, e), e.blockSize === 32 && t.adapterInfo.isVendor("intel") && t.adapterInfo.isArchitecture("gen-12lp") ? t.compute(Kg(t.inputs, e)) : t.compute(qg(t.inputs, e));
      }, Wl = (t) => ee(t);
    });
    Fl = V(() => {
      J();
      re();
      oe();
      jg = (t) => {
        if (!t || t.length < 1) throw new Error("Too few inputs");
        if (t[0].dataType !== 1 && t[0].dataType !== 10) throw new Error("Input type must be float or float16.");
        if (t.length >= 2) {
          let e = t[0].dims.length * 2 === t[1].dims[0];
          if (t.length === 4 && (e = t[3].dims[0] * 2 === t[1].dims[0]), !e) throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].");
        }
      }, Zg = (t, e, r) => {
        let n = "";
        for (let o = e - 1; o >= 0; --o) n += `
            k = i32(${t.indicesGet("indices", o)}) - ${j("uniforms.pads", o, r)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${j("uniforms.x_shape", o, e)})) {
              break;
            }
            offset += k * i32(${j("uniforms.x_strides", o, e)});
        `;
        return `
          value = ${t.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${n}
            value = x[offset];
          }
      `;
      }, Qg = (t, e, r) => {
        let n = "";
        for (let o = e - 1; o >= 0; --o) n += `
                k = i32(${t.indicesGet("indices", o)}) - ${j("uniforms.pads", o, r)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${j("uniforms.x_shape", o, e)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${j("uniforms.x_shape", o, e)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${j("uniforms.x_strides", o, e)});
            `;
        return `
              var offset = 0;
              var k = 0;
              ${n}
              value = x[offset];
          `;
      }, Yg = (t, e, r) => {
        let n = "";
        for (let o = e - 1; o >= 0; --o) n += `
                k = i32(${t.indicesGet("indices", o)}) - ${j("uniforms.pads", o, r)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${j("uniforms.x_shape", o, e)})) {
                  k = i32(${j("uniforms.x_shape", o, e)}) - 1;
                }
                offset += k * i32(${j("uniforms.x_strides", o, e)});
            `;
        return `
              var offset = 0;
              var k = 0;
              ${n}
              value = x[offset];
          `;
      }, Xg = (t, e, r) => {
        let n = "";
        for (let o = e - 1; o >= 0; --o) n += `
                k = i32(${t.indicesGet("indices", o)}) - ${j("uniforms.pads", o, r)};
                if (k < 0)  {
                  k += i32(${j("uniforms.x_shape", o, e)}]);
                }
                if (k >= i32(${j("uniforms.x_shape", o, e)})) {
                  k -= i32(${j("uniforms.x_shape", o, e)});
                }
                offset += k * i32(${j("uniforms.x_strides", o, e)});
            `;
        return `
              var offset = 0;
              var k = 0;
              ${n}
              value = x[offset];
          `;
      }, Jg = (t, e, r) => {
        switch (r.mode) {
          case 0:
            return Zg(t, e, r.pads.length);
          case 1:
            return Qg(t, e, r.pads.length);
          case 2:
            return Yg(t, e, r.pads.length);
          case 3:
            return Xg(t, e, r.pads.length);
          default:
            throw new Error("Invalid mode");
        }
      }, eb = (t, e) => {
        let r = k2.padShape(t[0].dims.slice(), e.pads), n = t[0].dims, o = k2.size(r), i = [{ type: 12, data: o }, { type: 6, data: e.pads }], s = t.length >= 3 && t[2].data;
        e.mode === 0 && i.push({ type: s ? t[2].dataType : 1, data: e.value }), i.push(...W(t[0].dims, r));
        let u = ["rank"], d = (c) => {
          let p = U("output", t[0].dataType, r.length), m = O("x", t[0].dataType, n.length), g = m.type.value, y = Jg(p, n.length, e), b = [{ name: "output_size", type: "u32" }, { name: "pads", type: "i32", length: e.pads.length }];
          return e.mode === 0 && b.push({ name: "constant_value", type: s ? g : "f32" }), `
            ${c.registerUniforms(b).declareVariables(m, p)}
            ${c.mainStart()}
            ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${p.offsetToIndices("global_idx")};

            var value = ${g}(0);
            ${y}
            output[global_idx] = value;
        }`;
        };
        return { name: "Pad", shaderCache: { hint: `${e.mode}${s}`, inputDependencies: u }, getRunData: () => ({ outputs: [{ dims: r, dataType: t[0].dataType }], dispatchGroup: { x: Math.ceil(k2.size(r) / 64) }, programUniforms: i }), getShaderSource: d };
      }, tb = (t, e) => {
        if (t.length > 1) {
          let r = t[1].getBigInt64Array(), n = t.length >= 3 && t[2].data ? t[2].dataType === 10 ? t[2].getUint16Array()[0] : t[2].getFloat32Array()[0] : 0, o = t[0].dims.length, i = new Int32Array(2 * o).fill(0);
          if (t.length >= 4) {
            let u = t[3].getBigInt64Array();
            for (let d = 0; d < u.length; d++) i[Number(u[d])] = Number(r[d]), i[Number(u[d]) + o] = Number(r[d + u.length]);
          } else r.forEach((u, d) => i[Number(d)] = Number(u));
          let s = [];
          return i.forEach((u) => s.push(u)), { mode: e.mode, value: n, pads: s };
        } else return e;
      }, Hl = (t, e) => {
        jg(t.inputs);
        let r = tb(t.inputs, e);
        t.compute(eb(t.inputs, r), { inputs: [0] });
      };
    });
    uc2 = V(() => {
      Le2();
      J();
      re();
      oe();
      cn2 = (t) => {
        if (_e.webgpu.validateInputContent && (!t || t.length !== 1)) throw new Error("Pool ops requires 1 input.");
      }, ql = (t, e, r) => {
        let n = e.format === "NHWC", o = t.dims.slice();
        n && o.splice(1, 0, o.pop());
        let i = Object.hasOwnProperty.call(e, "dilations"), s = e.kernelShape.slice(), u = e.strides.slice(), d = i ? e.dilations.slice() : [], c = e.pads.slice();
        zt2.adjustPoolAttributes(r, o, s, u, d, c);
        let p = zt2.computePoolOutputShape(r, o, u, d, s, c, e.autoPad), m = Object.assign({}, e);
        i ? Object.assign(m, { kernelShape: s, strides: u, pads: c, dilations: d, cacheKey: e.cacheKey }) : Object.assign(m, { kernelShape: s, strides: u, pads: c, cacheKey: e.cacheKey });
        let g = p.slice();
        return g.push(g.splice(1, 1)[0]), [m, n ? g : p];
      }, Kl = (t, e) => {
        let r = e.format === "NHWC", n = k2.size(t), o = k2.size(e.kernelShape), i = [{ type: 12, data: n }, { type: 12, data: o }], s = [{ name: "outputSize", type: "u32" }, { name: "kernelSize", type: "u32" }];
        if (e.kernelShape.length <= 2) {
          let u = e.kernelShape[e.kernelShape.length - 1], d = e.strides[e.strides.length - 1], c = e.pads[e.pads.length / 2 - 1], p = e.pads[e.pads.length - 1], m = !!(c + p);
          i.push({ type: 12, data: u }, { type: 12, data: d }, { type: 12, data: c }, { type: 12, data: p }), s.push({ name: "kw", type: "u32" }, { name: "sw", type: "u32" }, { name: "pwStart", type: "u32" }, { name: "pwEnd", type: "u32" });
          let g = false;
          if (e.kernelShape.length === 2) {
            let y = e.kernelShape[e.kernelShape.length - 2], b = e.strides[e.strides.length - 2], _ = e.pads[e.pads.length / 2 - 2], T = e.pads[e.pads.length - 2];
            g = !!(_ + T), i.push({ type: 12, data: y }, { type: 12, data: b }, { type: 12, data: _ }, { type: 12, data: T }), s.push({ name: "kh", type: "u32" }, { name: "sh", type: "u32" }, { name: "phStart", type: "u32" }, { name: "phEnd", type: "u32" });
          }
          return [i, s, true, m, g];
        } else {
          if (r) throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");
          let u = k2.computeStrides(e.kernelShape);
          i.push({ type: 12, data: u }, { type: 12, data: e.pads }, { type: 12, data: e.strides }), s.push({ name: "kernelStrides", type: "u32", length: u.length }, { name: "pads", type: "u32", length: e.pads.length }, { name: "strides", type: "u32", length: e.strides.length });
          let d = e.pads.reduce((c, p) => c + p);
          return [i, s, !!d, false, false];
        }
      }, jl = (t, e, r, n, o, i, s, u, d, c, p, m) => {
        let g = o.format === "NHWC", y = e.type.value, b = U("output", e.type.tensor, n);
        if (o.kernelShape.length <= 2) {
          let _ = "", T = "", x = "", $2 = r - (g ? 2 : 1);
          if (p ? _ = `
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${$2}] = indices[${$2}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${$2}] < 0 || xIndices[${$2}]
                      >= uniforms.x_shape[${$2}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${e.indicesToOffset("xIndices")}];
                  ${i}
                }` : _ = `
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${$2}] = indices[${$2}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${e.indicesToOffset("xIndices")}];
                  ${i}
                }`, o.kernelShape.length === 2) {
            let I = r - (g ? 3 : 2);
            m ? T = `
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${I}] = indices[${I}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${I}] < 0 || xIndices[${I}] >= uniforms.x_shape[${I}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              ` : T = `
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${I}] = indices[${I}] * uniforms.sh - uniforms.phStart + j;
                `, x = `
              }
            `;
          }
          return `
            ${t.registerUniforms(d).declareVariables(e, b)}

            ${t.mainStart()}
              ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${b.offsetToIndices("global_idx")};
              var xIndices = ${b.offsetToIndices("global_idx")};

              var value = ${y}(${u});
              var pad = 0;
              ${T}
              ${_}
              ${x}
              ${s}

              output[global_idx] = value;
            }`;
        } else {
          if (g) throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");
          let _ = o.kernelShape.length, T = o.pads.length, x = "";
          return c ? x = `
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${e.indicesToOffset("xIndices")}];
                ${i}
              }` : x = `
              }
              let x_val = x[${e.indicesToOffset("xIndices")}];
              ${i}
            `, `
            ${t.registerUniforms(d).declareVariables(e, b)}

            ${t.mainStart()}
              ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${b.offsetToIndices("global_idx")};
              var xIndices = ${b.offsetToIndices("global_idx")};

              var offsets: array<u32, ${_}>;

              var value = ${y}(${u});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${_ - 1}u; j++) {
                  offsets[j] = offset / ${j("uniforms.kernelStrides", "j", _)};
                  offset -= offsets[j] * ${j("uniforms.kernelStrides", "j", _)};
                }
                offsets[${_ - 1}] = offset;

                isPad = false;
                for (var j = ${r - _}u; j < ${r}u; j++) {
                  xIndices[j] = indices[j] * ${j("uniforms.strides", `j - ${r - _}u`, _)}
                    + offsets[j - ${r - _}u] - ${j("uniforms.pads", "j - 2u", T)};
                  ${x}
              }
              ${s}

              output[global_idx] = value;
            }`;
        }
      }, Zl = (t) => `${t.format};${t.ceilMode};${t.autoPad};${t.kernelShape.length}`, rb = (t) => `${Zl(t)};${t.countIncludePad}`, nb = (t) => `${Zl(t)};${t.storageOrder};${t.dilations}`, Ql = (t) => ({ format: t.format, autoPad: ["NOTSET", "VALID", "SAME_UPPER", "SAME_LOWER"][t.auto_pad], ceilMode: t.ceil_mode, kernelShape: t.kernel_shape, strides: t.strides, pads: t.pads }), Yl = (t, e, r, n) => {
        let [o, i] = ql(e, n, r), s = O("x", e.dataType, e.dims.length), u = s.type.value, d = "value += x_val;", c = "";
        o.countIncludePad ? c += `value /= ${u}(uniforms.kernelSize);` : c += `value /= ${u}(i32(uniforms.kernelSize) - pad);`;
        let [p, m, g, y, b] = Kl(i, o);
        p.push(...W(e.dims, i));
        let _ = ["rank"];
        return { name: t, shaderCache: { hint: `${n.cacheKey};${g};${y};${b}`, inputDependencies: _ }, getRunData: () => ({ outputs: [{ dims: i, dataType: e.dataType }], dispatchGroup: { x: Math.ceil(k2.size(i) / 64) }, programUniforms: p }), getShaderSource: (T) => jl(T, s, e.dims.length, i.length, o, d, c, 0, m, g, y, b) };
      }, Xl = (t) => {
        let e = t.count_include_pad !== 0, r = Ql(t);
        if (r.ceilMode !== 0) throw new Error("using ceil() in shape computation is not yet supported for AveragePool");
        let n = { countIncludePad: e, ...r, cacheKey: "" };
        return { ...n, cacheKey: rb(n) };
      }, Jl = (t, e) => {
        cn2(t.inputs), t.compute(Yl("AveragePool", t.inputs[0], false, e));
      }, ec2 = { autoPad: "", ceilMode: 0, countIncludePad: false, kernelShape: [], strides: [], pads: [], storageOrder: 0, dilations: [] }, tc2 = (t) => {
        let e = t.format;
        return { format: e, ...ec2, cacheKey: e };
      }, rc2 = (t, e) => {
        cn2(t.inputs), t.compute(Yl("GlobalAveragePool", t.inputs[0], true, e));
      }, nc2 = (t, e, r, n) => {
        let [o, i] = ql(e, n, r), s = `
      value = max(x_val, value);
    `, u = "", d = O("x", e.dataType, e.dims.length), c = ["rank"], [p, m, g, y, b] = Kl(i, o);
        return p.push(...W(e.dims, i)), { name: t, shaderCache: { hint: `${n.cacheKey};${g};${y};${b}`, inputDependencies: c }, getRunData: () => ({ outputs: [{ dims: i, dataType: e.dataType }], dispatchGroup: { x: Math.ceil(k2.size(i) / 64) }, programUniforms: p }), getShaderSource: (_) => jl(_, d, e.dims.length, i.length, o, s, u, e.dataType === 10 ? -65504 : -1e5, m, g, y, b) };
      }, oc2 = (t, e) => {
        cn2(t.inputs), t.compute(nc2("MaxPool", t.inputs[0], false, e));
      }, ic2 = (t) => {
        let e = t.storage_order, r = t.dilations, n = Ql(t);
        if (e !== 0) throw new Error("column major storage order is not yet supported for MaxPool");
        if (n.ceilMode !== 0) throw new Error("using ceil() in shape computation is not yet supported for MaxPool");
        let o = { storageOrder: e, dilations: r, ...n, cacheKey: "" };
        return { ...o, cacheKey: nb(o) };
      }, ac2 = (t) => {
        let e = t.format;
        return { format: e, ...ec2, cacheKey: e };
      }, sc2 = (t, e) => {
        cn2(t.inputs), t.compute(nc2("GlobalMaxPool", t.inputs[0], true, e));
      };
    });
    cc2 = V(() => {
      J();
      re();
      Ce();
      oe();
      ib = (t, e) => {
        if (t.length < 2 || t.length > 3) throw new Error("DequantizeLinear requires 2 or 3 inputs.");
        if (t.length === 3 && t[1].dims === t[2].dims) throw new Error("x-scale and x-zero-point must have the same shape.");
        if (t.length === 3 && t[0].dataType !== t[2].dataType) throw new Error("x and x-zero-point must have the same data type.");
        if (t[1].dims.length !== 0 && t[1].dims.length !== 1 && t[1].dims.length !== t[0].dims.length) throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");
        if (t.length > 2) {
          if (t[0].dataType !== t[2].dataType) throw new Error("x and x-zero-point must have the same data type.");
          if (t[1].dims.length !== t[2].dims.length) throw new Error("scale and zero-point inputs must have the same rank.");
          if (!t[1].dims.map((r, n) => r === t[2].dims[n]).reduce((r, n) => r && n, true)) throw new Error("scale and zero-point inputs must have the same shape.");
        }
        if (e.blockSize > 0) {
          if (t[1].dims.length === 0 || t[1].dims.length === 1 && t[1].dims[0] === 1) throw new Error("blockSize must be set only for block quantization.");
          if (!t[1].dims.map((o, i) => i === e.axis || o === t[0].dims[i]).reduce((o, i) => o && i, true)) throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");
          if (t[1].dims.length !== t[0].dims.length) throw new Error("For block qunatization the scale input rank must be the same as the x rank.");
          let r = t[0].dims[e.axis], n = t[1].dims[e.axis];
          if (e.blockSize < Math.ceil(r / n) || e.blockSize > Math.ceil(r / (n - 1) - 1)) throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].");
        }
      }, ab = (t, e) => {
        let r = k2.normalizeAxis(e.axis, t[0].dims.length), n = t[0].dataType, o = n === 3, i = t[0].dims, s = t[1].dataType, u = k2.size(i), d = n === 3 || n === 2, c = d ? [Math.ceil(k2.size(t[0].dims) / 4)] : t[0].dims, p = t[1].dims, m = t.length > 2 ? t[2] : void 0, g = m ? d ? [Math.ceil(k2.size(m.dims) / 4)] : m.dims : void 0, y = p.length === 0 || p.length === 1 && p[0] === 1, b = y === false && p.length === 1, _ = fe(u), T = y && (!d || _ === 4), x = T ? _ : 1, $2 = T && !d ? _ : 1, S = O("input", d ? 12 : n, c.length, $2), I = O("scale", s, p.length), E = m ? O("zero_point", d ? 12 : n, g.length) : void 0, A = U("output", s, i.length, x), z2 = [S, I];
        E && z2.push(E);
        let v = [c, p];
        m && v.push(g);
        let R = [{ type: 12, data: u / x }, { type: 12, data: r }, { type: 12, data: e.blockSize }, ...W(...v, i)], N = (F) => {
          let q = [{ name: "output_size", type: "u32" }, { name: "axis", type: "u32" }, { name: "block_size", type: "u32" }];
          return `
      ${F.registerUniforms(q).declareVariables(...z2, A)}
      ${F.mainStart()}
          ${F.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${A.offsetToIndices("global_idx")};

          // Set input x
          ${d ? `
            let input = ${S.getByOffset("global_idx / 4")};
            let x_vec = ${o ? "unpack4xI8(input)" : "unpack4xU8(input)"};
            let x_value = ${x === 1 ? "x_vec[global_idx % 4]" : "x_vec"};` : `let x_value = ${S.getByOffset("global_idx")};`};

          // Set scale input
          ${y ? `let scale_value= ${I.getByOffset("0")}` : b ? `
            let scale_index = ${A.indicesGet("output_indices", "uniforms.axis")};
            let scale_value= ${I.getByOffset("scale_index")};` : `
            var scale_indices: ${I.type.indices} = output_indices;
            let index = ${I.indicesGet("scale_indices", "uniforms.axis")} / uniforms.block_size;
            ${I.indicesSet("scale_indices", "uniforms.axis", "index")};
            let scale_value= ${I.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${E ? y ? d ? `
                let zero_point_input = ${E.getByOffset("0")};
                let zero_point_vec =  ${o ? "unpack4xI8(zero_point_input)" : "unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]` : `let zero_point_value = ${E.getByOffset("0")}` : b ? d ? `
                let zero_point_index = ${A.indicesGet("output_indices", "uniforms.axis")};
                let zero_point_input = ${E.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${o ? "unpack4xI8(zero_point_input)" : "unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]` : `
                let zero_point_index = ${A.indicesGet("output_indices", "uniforms.axis")};
                let zero_point_value = ${E.getByOffset("zero_point_index")};` : d ? `
                let zero_point_offset = ${I.indicesToOffset("scale_indices")};
                let zero_point_input = ${E.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${o ? "unpack4xI8(zero_point_input)" : "unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];` : `let zero_point_value = ${E.getByIndices("scale_indices")};` : `let zero_point_value = ${d ? o ? "i32" : "u32" : S.type.value}(0);`};
      // Compute and write output
      ${A.setByOffset("global_idx", `${A.type.value}(x_value - zero_point_value) * scale_value`)};
      }`;
        };
        return { name: "DequantizeLinear", shaderCache: { hint: e.cacheKey, inputDependencies: E ? ["rank", "rank", "rank"] : ["rank", "rank"] }, getShaderSource: N, getRunData: () => ({ outputs: [{ dims: i, dataType: s }], dispatchGroup: { x: Math.ceil(u / x / 64), y: 1, z: 1 }, programUniforms: R }) };
      }, dc2 = (t, e) => {
        ib(t.inputs, e), t.compute(ab(t.inputs, e));
      }, lc2 = (t) => ee({ axis: t.axis, blockSize: t.blockSize });
    });
    mc2 = V(() => {
      Le2();
      J();
      oe();
      sb = (t, e, r) => {
        let n = t === e, o = t < e && r < 0, i = t > e && r > 0;
        if (n || o || i) throw new Error("Range these inputs' contents are invalid.");
      }, ub = (t, e, r, n) => {
        let o = Math.abs(Math.ceil((e - t) / r)), i = [o], s = o, u = [{ type: 12, data: s }, { type: n, data: t }, { type: n, data: r }, ...W(i)], d = (c) => {
          let p = U("output", n, i.length), m = p.type.value, g = [{ name: "outputSize", type: "u32" }, { name: "start", type: m }, { name: "delta", type: m }];
          return `
        ${c.registerUniforms(g).declareVariables(p)}
        ${c.mainStart()}
        ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${m}(global_idx) * uniforms.delta;
      }`;
        };
        return { name: "Range", shaderCache: { hint: `${n}` }, getShaderSource: d, getRunData: () => ({ outputs: [{ dims: i, dataType: n }], dispatchGroup: { x: Math.ceil(s / 64) }, programUniforms: u }) };
      }, pc2 = (t) => {
        let e = 0, r = 0, n = 0;
        t.inputs[0].dataType === 6 ? (e = t.inputs[0].getInt32Array()[0], r = t.inputs[1].getInt32Array()[0], n = t.inputs[2].getInt32Array()[0]) : t.inputs[0].dataType === 1 && (e = t.inputs[0].getFloat32Array()[0], r = t.inputs[1].getFloat32Array()[0], n = t.inputs[2].getFloat32Array()[0]), _e.webgpu.validateInputContent && sb(e, r, n), t.compute(ub(e, r, n, t.inputs[0].dataType), { inputs: [] });
      };
    });
    gc = V(() => {
      J();
      re();
      Ce();
      oe();
      db = (t, e, r, n) => {
        if (t !== "none" && n !== "i32" && n !== "u32" && n !== "f32") throw new Error(`Input ${n} is not supported with reduction ${t}.`);
        let o = `{
                var oldValue = 0;
                loop {
                  let newValueF32 =`, i = `;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${e}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;
        switch (t) {
          case "none":
            return `${e}=${r};`;
          case "add":
            return n === "i32" || n === "u32" ? `atomicAdd(&${e}, bitcast<${n}>(${r}));` : `
              ${o}bitcast<${n}>(oldValue) + (${r})${i}`;
          case "max":
            return n === "i32" || n === "u32" ? `atomicMax(&${e}, bitcast<${n}>(${r}));` : `
                ${o}max(bitcast<f32>(oldValue), (${r}))${i}`;
          case "min":
            return n === "i32" || n === "u32" ? `atomicMin(&${e}, bitcast<${n}>(${r}));` : `${o}min(bitcast<${n}>(oldValue), (${r}))${i}`;
          case "mul":
            return `${o}(bitcast<${n}>(oldValue) * (${r}))${i}`;
          default:
            throw new Error(`Reduction ${t} is not supported.`);
        }
      }, lb = (t, e) => {
        let r = t[0].dims, n = t[1].dims, o = r, i = 1, s = Math.ceil(k2.sizeToDimension(n, n.length - 1) / i), u = n[n.length - 1], d = k2.sizeFromDimension(r, u), c = [{ type: 12, data: s }, { type: 12, data: u }, { type: 12, data: d }, ...W(t[1].dims, t[2].dims, o)], p = (m) => {
          let g = O("indices", t[1].dataType, t[1].dims.length), y = O("updates", t[2].dataType, t[2].dims.length, i), b = e.reduction !== "none" && e.reduction !== "" ? Ws2("output", t[0].dataType, o.length) : U("output", t[0].dataType, o.length, i);
          return `
      ${m.registerUniform("output_size", "u32").registerUniform("last_index_dimension", "u32").registerUniform("num_updates_elements", "u32").declareVariables(g, y, b)}
      ${m.mainStart()}
        ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
  var data_offset = 0u;
  let indices_start = uniforms.last_index_dimension * global_idx;
  let indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${t[0].dims.length === 1 ? `
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;` : `
    let element_count_dim = uniforms.output_strides[i - indices_start];
    let dim_value = uniforms.output_shape[i - indices_start];`}
    if (index >= 0) {
      if (index >= i32(dim_value)) {
        index = i32(dim_value - 1);
      }
    } else {
      if (index < -i32(dim_value)) {
        index = 0;
      } else {
        index += i32(dim_value);
      }
    }
    data_offset += u32((u32(index) * element_count_dim));
  }

  for (var i = 0u; i < uniforms.num_updates_elements; i++) {
    let value = updates[uniforms.num_updates_elements * global_idx + i];
    ${db(e.reduction, "output[data_offset + i]", "value", b.type.value)}
  }

      }`;
        };
        return { name: "ScatterND", shaderCache: { hint: `${e.cacheKey}_${e.reduction}`, inputDependencies: ["rank", "rank"] }, getRunData: () => ({ outputs: [{ dims: o, dataType: t[0].dataType }], dispatchGroup: { x: Math.ceil(s / 64) }, programUniforms: c }), getShaderSource: p };
      }, fc2 = (t) => ee({ reduction: t.reduction }), hc2 = (t, e) => {
        t.compute(lb(t.inputs, e), { inputs: [t.inputs[1], t.inputs[2]], outputs: [] });
      };
    });
    vc2 = V(() => {
      J();
      re();
      Ce();
      oe();
      cb = (t, e) => {
        if (t.every((r) => r > 0 || (() => {
          throw new Error("Resize requires scales input values to be positive");
        })), t.length > 0) {
          if (e.mode === "linear") {
            if (!(t.length === 2 || t.length === 3 || t.length === 4 && t[0] === 1 && t[1] === 1 || t.length === 4 && t[0] === 1 && t[3] === 1 || t.length === 5 && t[0] === 1 && t[1] === 1)) throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`);
          } else if (e.mode === "cubic" && !(t.length === 2 || t.length === 4 && t[0] === 1 && t[1] === 1 || t.length === 4 && t[0] === 1 && t[3] === 1)) throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode");
        }
      }, pb = (t, e, r) => {
        e.every((o) => o >= 0 && o < r || (() => {
          throw new Error("Resize requires axes input values to be positive and less than rank");
        }));
        let n = new Array(r).fill(1);
        return e.forEach((o, i) => n[o] = t[i]), n;
      }, mb = (t, e, r, n, o, i) => {
        let [s, u, d] = r > 10 ? [1, 2, 3] : [-1, t.length > 1 ? 1 : -1, -1], c = t[0].dims.length;
        if (s > 0 && t.length > s && t[s].dims.length > 0) t[s].getFloat32Array().forEach((p) => i.push(p));
        else if (e.coordinateTransformMode === "tf_crop_and_resize") throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");
        if (u > 0 && t.length > u && t[u].dims.length === 1 && t[u].dims[0] > 0) {
          if (t[u].getFloat32Array().forEach((p) => n.push(p)), n.length !== 0 && n.length !== c && r >= 18 && n.length !== e.axes.length) throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");
          cb(n, e), e.axes.length > 0 && pb(n, e.axes, c).forEach((p, m) => n[m] = p);
        }
        if (d > 0 && t.length > d && t[d].dims.length === 1 && t[d].dims[0] > 0 && (t[d].getBigInt64Array().forEach((p) => o.push(Number(p))), o.length !== 0 && o.length !== c && r >= 18 && o.length !== e.axes.length)) throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");
        if (e.axes.length > 0) {
          if (n.length !== 0 && n.length !== e.axes.length) throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');
          if (o.length !== 0 && o.length !== e.axes.length) throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified');
        }
        if (typeof n < "u" && typeof o < "u" && n.length > 0 && o.length > c) throw new Error("Resize requires only of scales or sizes to be specified");
      }, bc2 = (t, e, r, n) => `
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${t}) * (${e});
  let whole = ${n}(big / (${r}));
  let fract = ${n}(big % (${r})) / ${n}(${r});
  return whole + fract;
`, fb = (t, e) => `fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${e} { ` + (() => {
        switch (t) {
          case "asymmetric":
            return `
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${e}(xResized) / ${e}(xScale);
          } else {
            ${bc2("xResized", "lengthOriginal", "lengthResized", e)}
          }
        `;
          case "pytorch_half_pixel":
            return `if (lengthResized > 1) {
                    return (${e}(xResized) + 0.5) / ${e}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;
          case "tf_half_pixel_for_nn":
            return `return (${e}(xResized) + 0.5) / ${e}(xScale);`;
          case "align_corners":
            return `if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${bc2("xResized", "lengthOriginal - 1", "lengthResized - 1", e)}
                  }`;
          case "tf_crop_and_resize":
            return `if (lengthResized > 1) {
                    return ${e}(roiStart) * ${e}(lengthOriginal - 1) +
                        (${e}(xResized) * ${e}(roiEnd - roiStart) * ${e}(lengthOriginal - 1)) /
                        ${e}(lengthResized - 1);
                  } else {
                    return 0.5 * ${e}(roiStart + roiEnd) * ${e}(lengthOriginal - 1);
                  }`;
          case "half_pixel_symmetric":
            return `const outputWidth = ${e}xScale * ${e}(lengthResized);
                  const adjustment = ${e}(lengthResized) / outputWidth;
                  const center = ${e}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${e}(xResized) + 0.5) / ${e}(xScale)) - 0.5;`;
          case "half_pixel":
            return `return ((${e}(xResized) + 0.5) / ${e}(xScale)) - 0.5;`;
          default:
            throw new Error(`Coordinate transform mode ${t} is not supported`);
        }
      })() + "}", hb = (t, e, r) => `fn getNearestPixelFromOriginal(xOriginal: ${r}, isDownSample: bool) -> ${r} {` + (() => {
        switch (t) {
          case "round_prefer_ceil":
            return "if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";
          case "floor":
            return "return floor(xOriginal);";
          case "ceil":
            return "return ceil(xOriginal);";
          case "round_prefer_floor":
            return "if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";
          case "simple":
          default:
            if (e < 11) return "if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";
            throw new Error(`Nearest mode ${t} is not supported`);
        }
      })() + "}", gb = (t, e, r) => {
        let n = new Array(r).fill(0).concat(new Array(r).fill(1)), o = t.length === 0 ? n : t.slice();
        return e.length > 0 ? (e.forEach((i, s) => {
          n[i] = o[s], n[s + r] = o[e.length + s];
        }), n) : o;
      }, bb = (t, e, r, n) => {
        let o = [];
        if (r.length > 0) if (n.length > 0) {
          if (t.forEach((i) => o.push(i)), Math.max(...n) > t.length) throw new Error("axes is out of bound");
          n.forEach((i, s) => o[i] = r[s]);
        } else r.forEach((i) => o.push(i));
        else {
          if (e.length === 0) throw new Error("Resize requires either scales or sizes.");
          o = t.map((i, s) => Math.round(i * e[s]));
        }
        return o;
      }, yb = (t, e, r) => {
        let n = (() => {
          switch (r.keepAspectRatioPolicy) {
            case "not_larger":
              return r.axes.length > 0 ? Math.min(...r.axes.map((i) => e[i]), Number.MAX_VALUE) : Math.min(...e, Number.MAX_VALUE);
            case "not_smaller":
              return r.axes.length > 0 ? Math.max(...r.axes.map((i) => e[i]), Number.MIN_VALUE) : Math.max(...e, Number.MIN_VALUE);
            default:
              throw new Error(`Keep aspect ratio policy ${r.keepAspectRatioPolicy} is not supported`);
          }
        })();
        e.fill(1, 0, e.length);
        let o = t.slice();
        return r.axes.length > 0 ? (r.axes.forEach((i) => e[i] = n), r.axes.forEach((i) => o[i] = Math.round(t[i] * e[i]))) : (e.fill(n, 0, e.length), o.forEach((i, s) => o[s] = Math.round(i * e[s]))), o;
      }, _b = (t, e, r, n, o) => `
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> array<${t.type.value}, ${r.length}> {
      var original_indices: array<${t.type.value}, ${r.length}>;
      for (var i:u32 = 0; i < ${r.length}; i++) {
        var output_index = ${t.indicesGet("output_indices", "i")};
        var scale = ${j("uniforms.scales", "i", n)};
        var roi_low = ${j("uniforms.roi", "i", o)};
        var roi_hi = ${j("uniforms.roi", `i + ${e.length}`, o)};
        if (scale == 1.0) {
          original_indices[i] = ${t.type.value}(output_index);
        } else {
          var input_shape_i = ${j("uniforms.input_shape", "i", e.length)};
          var output_shape_i = ${j("uniforms.output_shape", "i", r.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`, wb = (t, e, r, n, o, i, s) => `
    fn calculateInputIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> ${t.type.indices} {
      var input_indices: ${t.type.indices};
      for (var i:u32 = 0; i < ${n.length}; i++) {
        var output_index = ${e.indicesGet("output_indices", "i")};
        var input_index: u32;
        var scale = ${j("uniforms.scales", "i", o)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${j("uniforms.roi", "i", i)};
          var roi_hi = ${j("uniforms.roi", `i + ${r.length}`, i)};
          var input_shape_i = ${j("uniforms.input_shape", "i", r.length)};
          var output_shape_i = ${j("uniforms.output_shape", "i", n.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${s} || (original_idx >= 0 && original_idx < ${e.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${e.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${t.indicesSet("input_indices", "i", "input_index")}
      }
      return input_indices;
    }`, vb = (t, e) => `
    fn checkInputIndices(input_indices: ${t.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${e.length}; i++) {
        var input_index = ${t.indicesGet("input_indices", "i")};
        if (input_index < 0 || input_index >= ${j("uniforms.input_shape", "i", e.length)}) {
          return false;
        }
      }
      return true;
    }`, yc2 = (t, e, r, n) => t.rank > n ? `
    ${t.indicesSet("input_indices", e, "channel")};
    ${t.indicesSet("input_indices", r, "batch")};
` : "", $b = (t, e, r, n, o) => {
        let [s, u, d, c] = r.length === 2 ? [-1, 0, 1, -1] : [0, 2, 3, 1], p = t.type.value;
        return `
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${p} {
      var input_indices: ${t.type.indices};
      ${t.indicesSet("input_indices", u, `max(0, min(row, ${r[u]} - 1))`)};
      ${t.indicesSet("input_indices", d, `max(0, min(col, ${r[d]} - 1))`)};
      ${yc2(t, c, s, 2)}
      return ${t.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${e.type.indices}) -> ${p} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${p} = originalIndices[${u}];
      var col:${p} = originalIndices[${d}];
      ${n ? `if (row < 0 || row > (${r[u]} - 1) || col < 0 || col > (${r[d]} - 1)) {
        return ${o};
      }` : ""};
      row = max(0, min(row, ${r[u]} - 1));
      col = max(0, min(col, ${r[d]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${r.length > 2 ? `u32(originalIndices[${c}])` : "0"};
      var batch: u32 =  ${r.length > 2 ? `u32(originalIndices[${s}])` : "0"};
      var x11: ${p} = getInputValue(batch, channel, row1, col1);
      var x12: ${p} = getInputValue(batch, channel, row1, col2);
      var x21: ${p} = getInputValue(batch, channel, row2, col1);
      var x22: ${p} = getInputValue(batch, channel, row2, col2);
      var dx1: ${p} = abs(row - ${p}(row1));
      var dx2: ${p} = abs(${p}(row2) - row);
      var dy1: ${p} = abs(col - ${p}(col1));
      var dy2: ${p} = abs(${p}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`;
      }, xb = (t, e, r, n, o, i, s, u, d, c) => {
        let p = r.length === 2, [g, y] = p ? [0, 1] : [2, 3] , b = t.type.value, _ = (T) => {
          let x = T === g ? "row" : "col";
          return `
      fn ${x}CubicInterpolation(input_indices: ${t.type.indices}, output_indices: ${e.type.indices}) -> ${b} {
        var output_index = ${e.indicesGet("output_indices", T)};
        var originalIdx: ${b} = getOriginalCoordinateFromResizedCoordinate(output_index, ${o[T]},
        ${n[T]}, ${r[T]}, ${i[T]}, ${i[T]} + ${r.length});
        var fractOriginalIdx: ${b} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${u} && (originalIdx < 0 || originalIdx > (${r[T]} - 1))) {
          return ${d};
        }
        var data: array<${b}, 4> = array<${b}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${x}: ${b} = originalIdx + ${b}(i);
          if (${x} < 0 || ${x} >= ${r[T]}) {
            ${c ? `coefs[i + 1] = 0.0;
                        continue;` : u ? `return ${d};` : `${x} = max(0, min(${x}, ${r[T]} - 1));`};
          }
        var input_indices_copy: ${t.type.indices} = input_indices;
          ${t.indicesSet("input_indices_copy", T, `u32(${x})`)};
          data[i + 1] = ${T === g ? t.getByIndices("input_indices_copy") : "rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`;
        };
        return `
    ${_(g)};
    ${_(y)};
  fn getCubicInterpolationCoefs(s: ${b}) -> array<${b}, 4> {
    var absS = abs(s);
    var coeffs: array<${b}, 4> = array<${b}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${b} = 1.0 - absS;
    var twoMinusAbsS: ${b} = 2.0 - absS;
    var onePlusAbsS: ${b} = 1.0 + absS;
    coeffs[0] = ((${s} * onePlusAbsS - 5 * ${s}) * onePlusAbsS + 8 * ${s}) * onePlusAbsS - 4 * ${s};
    coeffs[1] = ((${s} + 2) * absS - (${s} + 3)) * absS * absS + 1;
    coeffs[2] = ((${s} + 2) * oneMinusAbsS - (${s} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${s} * twoMinusAbsS - 5 * ${s}) * twoMinusAbsS + 8 * ${s}) * twoMinusAbsS - 4 * ${s};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${b}, 4>, coefs: array<${b}, 4>) -> ${b} {
    var coefsSum: ${b} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${e.type.indices}) -> ${b} {
    var input_indices: ${t.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `;
      }, Sb = (t, e, r, n, o) => {
        let [s, u, d, c, p] = r.length === 3 ? [-1, 0, 1, 2, -1] : [0, 2, 3, 4, 1], m = t.type.value;
        return `
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${m} {
      var input_indices: ${t.type.indices};
      ${t.indicesSet("input_indices", u, `max(0, min(depth, ${r[u]} - 1))`)};
      ${t.indicesSet("input_indices", d, `max(0, min(height, ${r[d]} - 1))`)};
      ${t.indicesSet("input_indices", c, `max(0, min(width, ${r[c]} - 1))`)};
      ${yc2(t, p, s, 3)}
      return ${t.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${e.type.indices}) -> ${m} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${m} = originalIndices[${u}];
      var height:${m} = originalIndices[${d}];
      var width:${m} = originalIndices[${c}];
      ${n ? `if (depth < 0 || depth > (${r[u]} - 1) || height < 0 || height > (${r[d]} - 1) || width < 0 || (width > ${r[c]} - 1)) {
      return ${o};
        }` : ""};

    depth = max(0, min(depth, ${r[u]} - 1));
      height = max(0, min(height, ${r[d]} - 1));
      width = max(0, min(width, ${r[c]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${r.length > 3 ? `u32(originalIndices[${p}])` : "0"};
      var batch: u32 =  ${r.length > 3 ? `u32(originalIndices[${s}])` : "0"};

      var x111: ${m} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${m} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${m} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${m} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${m} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${m} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${m} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${m} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${m} = abs(depth - ${m}(depth1));
      var dx2: ${m} = abs(${m}(depth2) - depth);
      var dy1: ${m} = abs(height - ${m}(height1));
      var dy2: ${m} = abs(${m}(height2) - height);
      var dz1: ${m} = abs(width - ${m}(width1));
      var dz2: ${m} = abs(${m}(width2) - width);
      if (depth1 == depth2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (height1 == height2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      if (width1 == width2) {
        dz1 = 0.5;
        dz2 = 0.5;
      }
      return (x111 * dx2 * dy2 * dz2 + x112 * dx2 * dy2 * dz1 + x121 * dx2 * dy1 *dz2 + x122 * dx2 * dy1 * dz1 +
              x211 * dx1 * dy2 * dz2 + x212 * dx1 * dy2 * dz1 + x221 * dx1 * dy1 *dz2 + x222 * dx1 * dy1 * dz1);
    }`;
      }, Tb = (t, e, r, n, o, i) => {
        let s = t.dims, u = gb(i, e.axes, s.length), d = bb(s, n, o, e.axes), c = n.slice();
        n.length === 0 && (c = s.map(($2, S) => $2 === 0 ? 1 : d[S] / $2), e.keepAspectRatioPolicy !== "stretch" && (d = yb(s, c, e)));
        let p = U("output", t.dataType, d.length), m = O("input", t.dataType, s.length), g = k2.size(d), y = s.length === d.length && s.every(($2, S) => $2 === d[S]), b = e.coordinateTransformMode === "tf_crop_and_resize", _ = e.extrapolationValue, T = m.type.value, x = ($2) => `
      ${y ? "" : `
      ${fb(e.coordinateTransformMode, T)};
      ${(() => {
          switch (e.mode) {
            case "nearest":
              return `
              ${vb(m, s)};
              ${hb(e.nearestMode, r, T)};
              ${wb(m, p, s, d, c.length, u.length, b)};
              `;
            case "linear":
              return `
              ${_b(p, s, d, c.length, u.length)};
              ${(() => {
                if (s.length === 2 || s.length === 4) return `${$b(m, p, s, b, _)}`;
                if (s.length === 3 || s.length === 5) return `${Sb(m, p, s, b, _)}`;
                throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.");
              })()};
            `;
            case "cubic":
              return `
            ${(() => {
                if (s.length === 2 || s.length === 4) return `${xb(m, p, s, d, c, u, e.cubicCoeffA, b, e.extrapolationValue, e.excludeOutside)}`;
                throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.");
              })()};
            `;
            default:
              throw Error("Invalid resize mode");
          }
        })()};
      `}
      ${$2.registerUniform("output_size", "u32").registerUniform("scales", "f32", c.length).registerUniform("roi", "f32", u.length).declareVariables(m, p)}
      ${$2.mainStart()}
        ${$2.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${y ? "output[global_idx] = input[global_idx];" : `
        let output_indices = ${p.offsetToIndices("global_idx")};
        var input_indices: ${m.type.indices};
        ${(() => {
          switch (e.mode) {
            case "nearest":
              return `input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${m.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${e.extrapolationValue};
                }`;
            case "linear":
              return `output[global_idx] = ${s.length === 2 || s.length === 4 ? "bilinearInterpolation" : "trilinearInterpolation"}(output_indices);`;
            case "cubic":
              return "output[global_idx] = bicubicInterpolation(output_indices);";
            default:
              throw Error(`Unsupported resize mode: ${e.mode}`);
          }
        })()};
`}
      }`;
        return { name: "Resize", shaderCache: { hint: `${e.cacheKey}|${r}|${c.length > 0 ? e.mode === "cubic" ? c : c.length : ""}|${o.length > 0 ? o : ""}|${u.length > 0 ? u : ""}|${y}|${e.mode === "nearest" ? s.length : s}`, inputDependencies: ["rank"] }, getShaderSource: x, getRunData: () => ({ outputs: [{ dims: d, dataType: t.dataType }], dispatchGroup: { x: Math.ceil(g / 64) }, programUniforms: [{ type: 12, data: g }, { type: 1, data: c }, { type: 1, data: u }, ...W(s, d)] }) };
      }, Ib = (t) => {
        let e = t.customDataBuffer;
        return new Uint32Array(e.buffer, e.byteOffset, 1)[0];
      }, _c = (t, e) => {
        let r = [], n = [], o = [], i = Ib(t);
        if (e.antialias !== 0) throw Error("Only default value (0) for Antialias attribute is supported");
        mb(t.inputs, e, i, r, n, o), t.compute(Tb(t.inputs[0], e, i, r, n, o), { inputs: [0] });
      }, wc2 = (t) => {
        let e = t.antialias, r = t.axes, n = t.coordinateTransformMode, o = t.cubicCoeffA, i = t.excludeOutside !== 0, s = t.extrapolationValue, u = t.keepAspectRatioPolicy, d = t.mode, c = t.nearestMode === "" ? "simple" : t.nearestMode;
        return ee({ antialias: e, axes: r, coordinateTransformMode: n, cubicCoeffA: o, excludeOutside: i, extrapolationValue: s, keepAspectRatioPolicy: u, mode: d, nearestMode: c });
      };
    });
    xc = V(() => {
      J();
      re();
      oe();
      Cb = (t) => {
        if (!t || t.length < 3) throw new Error("layerNorm requires at least 3 inputs.");
        let e = t[0], r = t[1], n = t[2];
        if (e.dataType !== r.dataType || e.dataType !== n.dataType) throw new Error("All inputs must have the same data type");
        if (e.dims.length !== 3 && e.dims.length !== 2) throw new Error("Input must be 2D or 3D");
        if (r.dims.length !== 3 && r.dims.length !== 2) throw new Error("Skip must be 2D or 3D");
        let o = e.dims[e.dims.length - 1], i = e.dims[e.dims.length - 2];
        if (r.dims[r.dims.length - 1] !== o) throw new Error("Skip must have the same hidden size as input");
        if (r.dims[r.dims.length - 2] !== i) throw new Error("Skip must have the same sequence length as input");
        if (n.dims.length !== 1) throw new Error("Gamma must be 1D");
        if (n.dims[n.dims.length - 1] !== o) throw new Error("Gamma must have the same hidden size as input");
        if (t.length > 3) {
          let s = t[3];
          if (s.dims.length !== 1) throw new Error("Beta must be 1D");
          if (s.dims[s.dims.length - 1] !== o) throw new Error("Beta must have the same hidden size as input");
        }
        if (t.length > 4) {
          let s = t[4];
          if (s.dims.length !== 1) throw new Error("Bias must be 1D");
          if (s.dims[s.dims.length - 1] !== o) throw new Error("Bias must have the same hidden size as input");
        }
      }, Ab = (t, e, r, n) => {
        let o = e.simplified, i = t[0].dims, s = k2.size(i), u = i, d = s, c = i.slice(-1)[0], p = n ? i.slice(0, -1).concat(1) : [], m = !o && t.length > 3, g = t.length > 4, y = n && r > 1, b = n && r > 2, _ = r > 3, T = 64, x = fe(c), $2 = [{ type: 12, data: d }, { type: 12, data: x }, { type: 12, data: c }, { type: 1, data: e.epsilon }], S = (E) => {
          let A = [{ name: "output_size", type: "u32" }, { name: "components", type: "u32" }, { name: "hidden_size", type: "u32" }, { name: "epsilon", type: "f32" }], z2 = [O("x", t[0].dataType, t[0].dims, x), O("skip", t[1].dataType, t[1].dims, x), O("gamma", t[2].dataType, t[2].dims, x)];
          m && z2.push(O("beta", t[3].dataType, t[3].dims, x)), g && z2.push(O("bias", t[4].dataType, t[4].dims, x)), z2.push(U("output", t[0].dataType, u, x)), y && z2.push(U("mean_output", 1, p)), b && z2.push(U("inv_std_output", 1, p)), _ && z2.push(U("input_skip_bias_sum", t[0].dataType, u, x));
          let v = we(t[0].dataType), R = we(1, x);
          return `

      ${E.registerUniforms(A).declareVariables(...z2)}
      var<workgroup> sum_shared : array<${R}, ${T}>;
      var<workgroup> sum_squared_shared : array<${R}, ${T}>;

      ${E.mainStart([T, 1, 1])}
        let ix = local_id.x;
        let iy = global_id.x / ${T};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${T};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${T - 1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${g ? "bias[offset1d + i]" : v + "(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${_ ? "input_skip_bias_sum[offset + i] = value;" : ""}
          output[offset + i] = value;
          let f32_value = ${Dt(v, x, "value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${T};
        for (var curr_size = reduce_size >> 1;  curr_size > 0; curr_size = reduce_size >> 1) {
          reduce_size = curr_size + (reduce_size & 1);
          if (ix < curr_size) {
            sum_shared[ix] += sum_shared[ix + reduce_size];
            sum_squared_shared[ix] += sum_squared_shared[ix + reduce_size];
          }
          workgroupBarrier();
        }

        let sum = sum_shared[0];
        let square_sum = sum_squared_shared[0];
        let mean = ${Ze("sum", x)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${Ze("square_sum", x)} / f32(uniforms.hidden_size) ${o ? "" : "- mean * mean"} + uniforms.epsilon);
        ${y ? "mean_output[global_idx] = mean;" : ""}
        ${b ? "inv_std_output[global_idx] = inv_std_dev;" : ""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${o ? "" : `- ${v}(mean)`}) *
            ${v}(inv_std_dev) * gamma[offset1d + i]
            ${m ? "+ beta[offset1d + i]" : ""};
        }
      }`;
        }, I = [{ dims: u, dataType: t[0].dataType }];
        return r > 1 && I.push({ dims: p, dataType: 1 }), r > 2 && I.push({ dims: p, dataType: 1 }), r > 3 && I.push({ dims: i, dataType: t[0].dataType }), { name: "SkipLayerNormalization", shaderCache: { hint: `${x};${y};${b};${_}`, inputDependencies: t.map((E, A) => "type") }, getShaderSource: S, getRunData: () => ({ outputs: I, dispatchGroup: { x: Math.ceil(d / c) }, programUniforms: $2 }) };
      }, $c = (t, e) => {
        Cb(t.inputs);
        let n = [0];
        t.outputCount > 1 && n.push(-3), t.outputCount > 2 && n.push(-3), t.outputCount > 3 && n.push(3), t.compute(Ab(t.inputs, e, t.outputCount, false), { outputs: n });
      };
    });
    Cc = V(() => {
      J();
      re();
      Ce();
      oe();
      Eb = (t, e) => {
        if (!t || t.length < 1) throw new Error("too few inputs");
        if (e.axes.length !== 0) {
          if (e.axes.length !== e.starts.length || e.axes.length !== e.ends.length) throw new Error("axes, starts and ends must have the same length");
        } else if (e.starts.length !== e.ends.length) throw new Error("starts and ends must have the same length");
        t.slice(1).forEach((r, n) => {
          if (t[n + 1].dataType !== 6 && t[n + 1].dataType !== 7) throw new Error(`Input ${n} must be an array of int32 or int64`);
        });
      }, pn2 = (t, e) => {
        let r = [];
        if (t.length > e) if (t[e].dataType === 7) t[e].getBigInt64Array().forEach((n) => r.push(Number(n)));
        else if (t[e].dataType === 6) t[e].getInt32Array().forEach((n) => r.push(Number(n)));
        else throw new Error(`Input ${e} must be an array of int32 or int64`);
        return r;
      }, kb = (t, e) => {
        if (t.length > 1) {
          let r = pn2(t, 1), n = pn2(t, 2), o = pn2(t, 3);
          return o.length === 0 && (o = [...Array(t[0].dims.length).keys()]), ee({ starts: r, ends: n, axes: o });
        } else return e;
      }, Sc = (t, e, r, n, o) => {
        let i = t;
        return t < 0 && (i += r[n[e]]), o[e] < 0 ? Math.max(0, Math.min(i, r[n[e]] - 1)) : Math.max(0, Math.min(i, r[n[e]]));
      }, Pb = (t, e, r) => `fn calculateInputIndices(output_indices: ${e.type.indices}) -> ${t.type.indices} {
          var input_indices: ${t.type.indices};
          var carry = 0u;
          for (var i = ${r.length - 1}; i >= 0; i--) {
            let input_shape_i = ${j("uniforms.input_shape", "i", r.length)};
            let steps_i = ${j("uniforms.steps", "i", r.length)};
            let signs_i = ${j("uniforms.signs", "i", r.length)};
            let starts_i = ${j("uniforms.starts", "i", r.length)};
            var output_index = ${e.indicesGet("output_indices", "i")};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${t.indicesSet("input_indices", "i", "input_index")};
          }
          return input_indices;
      }`, Ob = (t, e) => {
        let r = t[0].dims, n = k2.size(r), o = e.axes.length > 0 ? k2.normalizeAxes(e.axes, r.length) : [...Array(r.length).keys()], i = pn2(t, 4);
        i.forEach((x) => x !== 0 || (() => {
          throw new Error("step cannot be 0");
        })), i.length === 0 && (i = Array(o.length).fill(1));
        let s = e.starts.map((x, $2) => Sc(x, $2, r, o, i)), u = e.ends.map((x, $2) => Sc(x, $2, r, o, i));
        if (o.length !== s.length || o.length !== u.length) throw new Error("start, ends and axes should have the same number of elements");
        if (o.length !== r.length) for (let x = 0; x < r.length; ++x) o.includes(x) || (s.splice(x, 0, 0), u.splice(x, 0, r[x]), i.splice(x, 0, 1));
        let d = i.map((x) => Math.sign(x));
        i.forEach((x, $2, S) => {
          if (x < 0) {
            let I = (u[$2] - s[$2]) / x, E = s[$2], A = E + I * i[$2];
            s[$2] = A, u[$2] = E, S[$2] = -x;
          }
        });
        let c = r.slice(0);
        o.forEach((x, $2) => {
          c[x] = Math.ceil((u[x] - s[x]) / i[x]);
        });
        let p = { dims: c, dataType: t[0].dataType }, m = U("output", t[0].dataType, c.length), g = O("input", t[0].dataType, t[0].dims.length), y = k2.size(c), b = [{ name: "outputSize", type: "u32" }, { name: "starts", type: "u32", length: s.length }, { name: "signs", type: "i32", length: d.length }, { name: "steps", type: "u32", length: i.length }], _ = [{ type: 12, data: y }, { type: 12, data: s }, { type: 6, data: d }, { type: 12, data: i }, ...W(t[0].dims, c)], T = (x) => `
      ${x.registerUniforms(b).declareVariables(g, m)}
        ${Pb(g, m, r)}
        ${x.mainStart()}
          ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${m.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${m.setByOffset("global_idx", g.getByIndices("input_indices"))}
      }`;
        return { name: "Slice", shaderCache: { hint: `${d.length}_${s.length}_${i.length}`, inputDependencies: ["rank"] }, getShaderSource: T, getRunData: () => ({ outputs: [p], dispatchGroup: { x: Math.ceil(n / 64) }, programUniforms: _ }) };
      }, Tc2 = (t, e) => {
        Eb(t.inputs, e);
        let r = kb(t.inputs, e);
        t.compute(Ob(t.inputs, r), { inputs: [0] });
      }, Ic = (t) => {
        let e = t.starts, r = t.ends, n = t.axes;
        return ee({ starts: e, ends: r, axes: n });
      };
    });
    kc = V(() => {
      J();
      re();
      Ce();
      pt();
      oe();
      zb = (t) => {
        if (!t || t.length !== 1) throw new Error("Softmax op requires 1 input.");
      }, Bb = (t, e) => {
        let r = t.inputs[0], n = r.dims, o = k2.size(n), i = n.length, s = k2.normalizeAxis(e.axis, i), u = s < n.length - 1, d, c = [];
        u ? (c = Array.from({ length: i }, (z2, v) => v), c[s] = i - 1, c[i - 1] = s, d = t.compute(Be(r, c), { inputs: [r], outputs: [-1] })[0]) : d = r;
        let p = d.dims, m = p[i - 1], g = o / m, y = fe(m), b = m / y, _ = 64;
        g === 1 && (_ = 256);
        let T = (z2, v) => v === 4 ? `max(max(${z2}.x, ${z2}.y), max(${z2}.z, ${z2}.w))` : v === 2 ? `max(${z2}.x, ${z2}.y)` : v === 3 ? `max(max(${z2}.x, ${z2}.y), ${z2}.z)` : z2, x = O("x", d.dataType, d.dims, y), $2 = U("result", d.dataType, d.dims, y), S = x.type.value, I = we(d.dataType) === "f32" ? `var threadMax = ${S}(-3.4028234663852886e+38f);` : `var threadMax = ${S}(-65504.0h);`, E = (z2) => `
      var<workgroup> rowMaxShared : ${S};
      var<workgroup> rowSumShared : ${S};
      var<workgroup> threadShared : array<${S}, ${_}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${S} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${S}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${z2.registerUniform("packedCols", "i32").declareVariables(x, $2)}
      ${z2.mainStart(_)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${_};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${I}
        for (var col = lindex; col < cols; col += wg) {
          let value = getValue(row, col, row_stride);
          threadMax = max(threadMax, value);
        }
        if (lindex < cols) {
          threadShared[lindex] = threadMax;
        }
        workgroupBarrier();

        var reduceSize = min(cols, wg);
        for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
          reduceSize = currSize + (reduceSize & 1);
          if (lindex < currSize) {
            threadShared[lindex] = max(threadShared[lindex], threadShared[lindex + reduceSize]);
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowMaxShared = ${S}(${T("threadShared[0]", y)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${S}(0.0);
        for (var col = lindex; col < cols; col += wg) {
          let subExp = exp(getValue(row, col, row_stride) - rowMaxShared);
          threadSum += subExp;
        }
        threadShared[lindex] = threadSum;
        workgroupBarrier();

        for (var currSize = wg >> 1;  currSize > 0; currSize = currSize >> 1) {
          if (lindex < currSize) {
            threadShared[lindex] = threadShared[lindex] + threadShared[lindex + currSize];
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowSumShared = ${S}(${Ze("threadShared[0]", y)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          var value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          // max operation protects against NaN since all values should be >=0
          value = max(value, ${S}(0.0));
          setValue(row, col, row_stride, value);
        }
      }`, A = t.compute({ name: "Softmax", shaderCache: { hint: `${y};${_}`, inputDependencies: ["type"] }, getRunData: () => ({ outputs: [{ dims: p, dataType: d.dataType }], dispatchGroup: { x: g }, programUniforms: [{ type: 6, data: b }] }), getShaderSource: E }, { inputs: [d], outputs: [u ? -1 : 0] })[0];
        u && t.compute(Be(A, c), { inputs: [A] });
      }, Ac = (t, e) => {
        zb(t.inputs), Bb(t, e);
      }, Ec2 = (t) => ee({ axis: t.axis });
    });
    zc = V(() => {
      J();
      re();
      oe();
      Pc = (t) => Array.from(t.getBigInt64Array(), Number), Db = (t) => {
        if (!t || t.length !== 2) throw new Error("Tile requires 2 inputs.");
        if (t[0].dataType !== 1 && t[0].dataType !== 10 && t[0].dataType !== 6 && t[0].dataType !== 12) throw new Error("Tile only support float, float16, int32, and uint32 data types");
        if (t[1].dataType !== 7) throw new Error("Tile `repeats` input should be of int64 data type");
        if (t[1].dims.length !== 1) throw new Error("Tile `repeats` input should be 1-D");
        if (Pc(t[1]).length !== t[0].dims.length) throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor");
      }, Mb = (t, e) => {
        let r = [];
        for (let n = 0; n < t.length; ++n) r.push(t[n] * e[n]);
        return r;
      }, Rb = (t, e) => {
        let r = t[0].dims, n = e ?? Pc(t[1]), o = Mb(r, n), i = k2.size(o), s = t[0].dataType, u = O("input", s, r.length), d = U("output", s, o.length), c = (p) => `
      const inputShape = ${u.indices(...r)};
      ${p.registerUniform("output_size", "u32").declareVariables(u, d)}
      ${p.mainStart()}
      ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${d.offsetToIndices("global_idx")};
      var input_indices: ${u.type.indices};
      for (var i = 0; i < ${r.length}; i++) {
        let input_dim_i = ${u.indicesGet("uniforms.input_shape", "i")};
        let input_dim_value = ${d.indicesGet("output_indices", "i")}  % input_dim_i;

        ${u.indicesSet("input_indices", "i", "input_dim_value")}
      }
      ${d.setByOffset("global_idx", u.getByIndices("input_indices"))}
    }`;
        return { name: "Tile", shaderCache: { hint: `${n}`, inputDependencies: ["rank"] }, getRunData: () => ({ outputs: [{ dims: o, dataType: t[0].dataType }], dispatchGroup: { x: Math.ceil(i / 64) }, programUniforms: [{ type: 12, data: i }, ...W(t[0].dims, o)] }), getShaderSource: c };
      }, Oc = (t) => {
        Db(t.inputs), t.compute(Rb(t.inputs), { inputs: [0] });
      };
    });
    Dc = V(() => {
      J();
      re();
      oe();
      Ub = (t, e, r, n, o) => {
        let i = U("output_data", o, r.length, 4), s = O("a_data", e[1].dataType, e[1].dims.length, 4), u = O("b_data", e[2].dataType, e[2].dims.length, 4), d = O("c_data", e[0].dataType, e[0].dims.length, 4), c, p = (m, g, y) => `select(${g}, ${m}, ${y})`;
        if (!n) c = i.setByOffset("global_idx", p(s.getByOffset("global_idx"), u.getByOffset("global_idx"), d.getByOffset("global_idx")));
        else {
          let m = (g, y, b = "") => {
            let _ = `a_data[index_a${y}][component_a${y}]`, T = `b_data[index_b${y}][component_b${y}]`, x = `bool(c_data[index_c${y}] & (0xffu << (component_c${y} * 8)))`;
            return `
            let output_indices${y} = ${i.offsetToIndices(`global_idx * 4u + ${y}u`)};
            let offset_a${y} = ${s.broadcastedIndicesToOffset(`output_indices${y}`, i)};
            let offset_b${y} = ${u.broadcastedIndicesToOffset(`output_indices${y}`, i)};
            let offset_c${y} = ${d.broadcastedIndicesToOffset(`output_indices${y}`, i)};
            let index_a${y} = offset_a${y} / 4u;
            let index_b${y} = offset_b${y} / 4u;
            let index_c${y} = offset_c${y} / 4u;
            let component_a${y} = offset_a${y} % 4u;
            let component_b${y} = offset_b${y} % 4u;
            let component_c${y} = offset_c${y} % 4u;
            ${g}[${y}] = ${b}(${p(_, T, x)});
          `;
          };
          o === 9 ? c = `
            var data = vec4<u32>(0);
            ${m("data", 0, "u32")}
            ${m("data", 1, "u32")}
            ${m("data", 2, "u32")}
            ${m("data", 3, "u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));` : c = `
            ${m("output_data[global_idx]", 0)}
            ${m("output_data[global_idx]", 1)}
            ${m("output_data[global_idx]", 2)}
            ${m("output_data[global_idx]", 3)}
          `;
        }
        return `
        ${t.registerUniform("vec_size", "u32").declareVariables(d, s, u, i)}
        ${t.mainStart()}
        ${t.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${c}
      }`;
      }, Nb = (t) => {
        let e = t[1].dims, r = t[2].dims, n = t[0].dims, o = t[1].dataType, i = !(k2.areEqual(e, r) && k2.areEqual(r, n)), s = e, u = k2.size(e);
        if (i) {
          let c = ot2.calcShape(ot2.calcShape(e, r, false), n, false);
          if (!c) throw new Error("Can't perform where op on the given tensors");
          s = c, u = k2.size(s);
        }
        let d = Math.ceil(u / 4);
        return { name: "Where", shaderCache: { inputDependencies: ["rank", "rank", "rank"] }, getShaderSource: (c) => Ub(c, t, s, i, o), getRunData: () => ({ outputs: [{ dims: s, dataType: o }], dispatchGroup: { x: Math.ceil(u / 64 / 4) }, programUniforms: [{ type: 12, data: d }, ...W(n, e, r, s)] }) };
      }, Bc = (t) => {
        t.compute(Nb(t.inputs));
      };
    });
    Rc = V(() => {
      bu();
      Jr2();
      wu();
      $u();
      sd();
      yd();
      vd();
      Rd();
      Hd();
      Kd();
      Qd();
      tl();
      ol();
      al();
      dl();
      pl();
      hl();
      yl();
      vl2();
      Sl();
      zl();
      Ml();
      Ul();
      Vl();
      Gl();
      ko();
      Fl();
      uc2();
      cc2();
      mc2();
      gc();
      Yr2();
      vc2();
      zo();
      xc();
      Cc();
      kc();
      Oo();
      zc();
      pt();
      tn2();
      Dc();
      Mc = /* @__PURE__ */ new Map([["Abs", [xu]], ["Acos", [Su]], ["Acosh", [Tu]], ["Add", [ud]], ["ArgMax", [gu, bo]], ["ArgMin", [hu, bo]], ["Asin", [Iu]], ["Asinh", [Cu]], ["Atan", [Au]], ["Atanh", [Eu]], ["Attention", [yu]], ["AveragePool", [Jl, Xl]], ["BatchNormalization", [_u]], ["BiasAdd", [vu]], ["BiasSplitGelu", [ad]], ["Cast", [Pu, ku]], ["Ceil", [zu]], ["Clip", [Ou]], ["Concat", [_d, wd]], ["Conv", [Io, To]], ["ConvTranspose", [Gd, Ld]], ["Cos", [Bu]], ["Cosh", [Du]], ["CumSum", [Fd, qd]], ["DepthToSpace", [jd, Zd]], ["DequantizeLinear", [dc2, lc2]], ["Div", [dd]], ["Einsum", [Jd, el]], ["Elu", [Mu, or2]], ["Equal", [ld]], ["Erf", [Ru]], ["Exp", [Uu]], ["Expand", [nl]], ["FastGelu", [il]], ["Floor", [Nu]], ["FusedConv", [Io, To]], ["Gather", [ul, sl]], ["GatherElements", [bl, gl]], ["GatherBlockQuantized", [ml, fl]], ["GatherND", [ll, cl]], ["Gelu", [Vu]], ["Gemm", [wl, _l]], ["GlobalAveragePool", [rc2, tc2]], ["GlobalMaxPool", [sc2, ac2]], ["Greater", [fd]], ["GreaterOrEqual", [gd]], ["GridSample", [$l, xl]], ["GroupQueryAttention", [Ol]], ["HardSigmoid", [ju, Ku]], ["InstanceNormalization", [Dl]], ["LayerNormalization", [Rl]], ["LeakyRelu", [Lu, or2]], ["Less", [hd]], ["LessOrEqual", [bd]], ["Log", [nd]], ["MatMul", [Nl]], ["MatMulNBits", [Ll, Wl]], ["MaxPool", [oc2, ic2]], ["Mul", [cd]], ["MultiHeadAttention", [Cl, Il]], ["Neg", [Gu]], ["Not", [Wu]], ["Pad", [Hl]], ["Pow", [pd]], ["QuickGelu", [od, or2]], ["Range", [pc2]], ["Reciprocal", [Hu]], ["ReduceMin", [du]], ["ReduceMean", [ou]], ["ReduceMax", [uu]], ["ReduceSum", [cu]], ["ReduceProd", [lu]], ["ReduceL1", [iu]], ["ReduceL2", [au]], ["ReduceLogSum", [mu]], ["ReduceLogSumExp", [su]], ["ReduceSumSquare", [pu]], ["Relu", [Fu]], ["Resize", [_c, wc2]], ["RotaryEmbedding", [kl]], ["ScatterND", [hc2, fc2]], ["Sigmoid", [qu]], ["Sin", [Zu]], ["Sinh", [Qu]], ["Slice", [Tc2, Ic]], ["SkipLayerNormalization", [$c]], ["Split", [Al, El]], ["Sqrt", [Yu]], ["Softmax", [Ac, Ec2]], ["Sub", [md]], ["Tan", [Xu]], ["Tanh", [ed]], ["ThresholdedRelu", [rd, or2]], ["Tile", [Oc]], ["Transpose", [Fs2, qs]], ["Where", [Bc]]]);
    });
    Uc = V(() => {
      Le2();
      nt();
      oe();
      mn2 = class {
        constructor(e) {
          this.backend = e;
          this.repo = /* @__PURE__ */ new Map(), this.attributesBound = false;
        }
        getArtifact(e) {
          return this.repo.get(e);
        }
        setArtifact(e, r) {
          this.repo.set(e, r);
        }
        run(e, r, n, o, i) {
          Ve2(e.programInfo.name);
          let s = this.backend.device, u = this.backend.getComputePassEncoder();
          this.backend.writeTimestamp(this.backend.pendingDispatchNumber * 2);
          let d = [];
          for (let p of r) d.push({ binding: d.length, resource: { buffer: p.buffer } });
          for (let p of n) d.push({ binding: d.length, resource: { buffer: p.buffer } });
          i && d.push({ binding: d.length, resource: i });
          let c = s.createBindGroup({ layout: e.computePipeline.getBindGroupLayout(0), entries: d, label: e.programInfo.name });
          if (this.backend.sessionStatus === "capturing") {
            let p = { kernelId: this.backend.currentKernelId, computePipeline: e.computePipeline, bindGroup: c, dispatchGroup: o };
            this.backend.capturedCommandList.get(this.backend.currentSessionId).push(p);
          }
          u.setPipeline(e.computePipeline), u.setBindGroup(0, c), u.dispatchWorkgroups(...o), this.backend.writeTimestamp(this.backend.pendingDispatchNumber * 2 + 1), this.backend.pendingDispatchNumber++, (this.backend.pendingDispatchNumber >= this.backend.maxDispatchNumber || this.backend.queryType === "at-passes") && this.backend.endComputePass(), this.backend.pendingDispatchNumber >= this.backend.maxDispatchNumber && this.backend.flush(), Re(e.programInfo.name);
        }
        dispose() {
        }
        build(e, r) {
          Ve2(e.name);
          let n = this.backend.device, o = [];
          [{ feature: "shader-f16", extension: "f16" }, { feature: "subgroups", extension: "subgroups" }].forEach((m) => {
            n.features.has(m.feature) && o.push(`enable ${m.extension};`);
          });
          let s = Gs2(r, this.backend.device.limits), u = e.getShaderSource(s), d = `${o.join(`
`)}
${s.additionalImplementations}
${u}`, c = n.createShaderModule({ code: d, label: e.name });
          ie2("verbose", () => `[WebGPU] ${e.name} shader code: ${d}`);
          let p = n.createComputePipeline({ compute: { module: c, entryPoint: "main" }, layout: "auto", label: e.name });
          return Re(e.name), { programInfo: e, computePipeline: p, uniformVariablesInfo: s.variablesInfo };
        }
        normalizeDispatchGroupSize(e) {
          let r = typeof e == "number" ? e : e.x, n = typeof e == "number" ? 1 : e.y || 1, o = typeof e == "number" ? 1 : e.z || 1, i = this.backend.device.limits.maxComputeWorkgroupsPerDimension;
          if (r <= i && n <= i && o <= i) return [r, n, o];
          let s = r * n * o, u = Math.ceil(Math.sqrt(s));
          if (u > i) {
            if (u = Math.ceil(Math.cbrt(s)), u > i) throw new Error("Total dispatch size exceeds WebGPU maximum.");
            return [u, u, u];
          } else return [u, u, 1];
        }
      };
    });
    Nc = {};
    Vt2(Nc, { WebGpuBackend: () => Do });
    Vc = V(() => {
      Le2();
      J();
      nt();
      oo();
      Ls2();
      Rc();
      Uc();
      Vb = (t, e) => {
        if (e.length !== t.length) throw new Error(`inputDependencies length ${e.length} is not equal to inputTensors length ${t.length}.`);
        let r = [];
        for (let n = 0; n < t.length; ++n) {
          let o = t[n].dataType;
          switch (e[n]) {
            case "none": {
              r.push("");
              break;
            }
            case "type": {
              r.push(`${o}`);
              break;
            }
            case "rank": {
              let i = t[n].dims.length;
              r.push(`${o};${i}`);
              break;
            }
            case "dims": {
              let i = t[n].dims.join(",");
              r.push(`${o};${i}`);
              break;
            }
            default:
              throw new Error(`unsupported input dependency: ${e[n]}`);
          }
        }
        return r.join("|");
      }, Lb = (t, e, r) => {
        let n = t.name;
        return t.shaderCache?.hint && (n += "[" + t.shaderCache.hint + "]"), n += ":" + r + `:${Vb(e, t.shaderCache?.inputDependencies ?? new Array(e.length).fill("dims"))}`, n;
      }, Bo = class {
        constructor(e) {
          e && (this.architecture = e.architecture, this.vendor = e.vendor);
        }
        isArchitecture(e) {
          return this.architecture === e;
        }
        isVendor(e) {
          return this.vendor === e;
        }
      }, Do = class {
        constructor() {
          this.currentSessionId = null;
          this.currentKernelId = null;
          this.commandEncoder = null;
          this.computePassEncoder = null;
          this.maxDispatchNumber = 16;
          this.pendingDispatchNumber = 0;
          this.pendingKernels = [];
          this.pendingQueries = /* @__PURE__ */ new Map();
          this.sessionStatus = "default";
          this.capturedCommandList = /* @__PURE__ */ new Map();
          this.capturedPendingKernels = /* @__PURE__ */ new Map();
          this.sessionExternalDataMapping = /* @__PURE__ */ new Map();
        }
        get currentKernelCustomData() {
          if (this.currentKernelId === null) throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");
          let e = this.kernelCustomData.get(this.currentKernelId);
          return e || (e = {}, this.kernelCustomData.set(this.currentKernelId, e)), e;
        }
        async initialize(e, r) {
          this.env = e;
          let n = [], o = { requiredLimits: { maxComputeWorkgroupStorageSize: r.limits.maxComputeWorkgroupStorageSize, maxComputeWorkgroupsPerDimension: r.limits.maxComputeWorkgroupsPerDimension, maxStorageBufferBindingSize: r.limits.maxStorageBufferBindingSize, maxBufferSize: r.limits.maxBufferSize, maxComputeInvocationsPerWorkgroup: r.limits.maxComputeInvocationsPerWorkgroup, maxComputeWorkgroupSizeX: r.limits.maxComputeWorkgroupSizeX, maxComputeWorkgroupSizeY: r.limits.maxComputeWorkgroupSizeY, maxComputeWorkgroupSizeZ: r.limits.maxComputeWorkgroupSizeZ }, requiredFeatures: n }, i = (d) => r.features.has(d) && n.push(d) && true;
          i("chromium-experimental-timestamp-query-inside-passes") || i("timestamp-query"), i("shader-f16"), i("subgroups"), this.device = await r.requestDevice(o);
          let s = r, u = r.info ?? (typeof s.requestAdapterInfo == "function" ? await s.requestAdapterInfo() : void 0);
          this.adapterInfo = new Bo(u), this.gpuDataManager = Vs(this), this.programManager = new mn2(this), this.kernels = /* @__PURE__ */ new Map(), this.kernelPersistentData = /* @__PURE__ */ new Map(), this.kernelCustomData = /* @__PURE__ */ new Map(), Lr(e.logLevel, !!e.debug), this.device.onuncapturederror = (d) => {
            d.error instanceof GPUValidationError && console.error(`An uncaught WebGPU validation error was raised: ${d.error.message}`);
          }, Object.defineProperty(this.env.webgpu, "device", { value: this.device, writable: false, enumerable: true, configurable: true }), Object.defineProperty(this.env.webgpu, "adapter", { value: r, writable: false, enumerable: true, configurable: false }), this.setQueryType();
        }
        dispose() {
          typeof this.querySet < "u" && this.querySet.destroy(), this.gpuDataManager.dispose(), this.device && this.env?.webgpu && this.device.lost.then(() => {
            delete this.env.webgpu.device;
          });
        }
        getCommandEncoder() {
          return this.commandEncoder || (this.commandEncoder = this.device.createCommandEncoder()), this.commandEncoder;
        }
        getComputePassEncoder() {
          if (!this.computePassEncoder) {
            let e = this.getCommandEncoder(), r = {};
            this.queryType === "at-passes" && (r.timestampWrites = { querySet: this.querySet, beginningOfPassWriteIndex: this.pendingDispatchNumber * 2, endOfPassWriteIndex: this.pendingDispatchNumber * 2 + 1 }), this.computePassEncoder = e.beginComputePass(r);
          }
          return this.computePassEncoder;
        }
        endComputePass() {
          this.computePassEncoder && (this.computePassEncoder.end(), this.computePassEncoder = null);
        }
        flush() {
          if (!this.commandEncoder) return;
          Ve2(), this.endComputePass();
          let e;
          this.queryType !== "none" && (this.commandEncoder.resolveQuerySet(this.querySet, 0, this.pendingDispatchNumber * 2, this.queryResolveBuffer, 0), e = this.device.createBuffer({ size: this.pendingDispatchNumber * 2 * 8, usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST }), this.pendingQueries.set(e, this.pendingKernels), this.pendingKernels = [], this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer, 0, e, 0, this.pendingDispatchNumber * 2 * 8)), this.device.queue.submit([this.commandEncoder.finish()]), this.gpuDataManager.refreshPendingBuffers(), this.commandEncoder = null, this.pendingDispatchNumber = 0, this.queryType !== "none" && e.mapAsync(GPUMapMode.READ).then(() => {
            let r = new BigUint64Array(e.getMappedRange()), n = this.pendingQueries.get(e);
            for (let o = 0; o < r.length / 2; o++) {
              let i = n[o], s = i.kernelId, u = this.kernels.get(s), d = u.kernelType, c = u.kernelName, p = i.programName, m = i.inputTensorViews, g = i.outputTensorViews, y = r[o * 2], b = r[o * 2 + 1];
              typeof this.queryTimeBase > "u" && (this.queryTimeBase = y);
              let _ = Number(y - this.queryTimeBase), T = Number(b - this.queryTimeBase);
              if (!Number.isSafeInteger(_) || !Number.isSafeInteger(T)) throw new RangeError("incorrect timestamp range");
              if (this.env.webgpu.profiling?.ondata) this.env.webgpu.profiling.ondata({ version: 1, inputsMetadata: m.map((x) => ({ dims: x.dims, dataType: rt2(x.dataType) })), outputsMetadata: g.map((x) => ({ dims: x.dims, dataType: rt2(x.dataType) })), kernelId: s, kernelType: d, kernelName: c, programName: p, startTime: _, endTime: T });
              else {
                let x = "";
                m.forEach((S, I) => {
                  x += `input[${I}]: [${S.dims}] | ${rt2(S.dataType)}, `;
                });
                let $2 = "";
                g.forEach((S, I) => {
                  $2 += `output[${I}]: [${S.dims}] | ${rt2(S.dataType)}, `;
                }), console.log(`[profiling] kernel "${s}|${d}|${c}|${p}" ${x}${$2}start time: ${_} ns, execution time: ${T - _} ns`);
              }
              Tr("GPU", `${p}::${y}::${b}`);
            }
            e.unmap(), this.pendingQueries.delete(e);
          }), Re();
        }
        run(e, r, n, o, i, s) {
          Ve2(e.name);
          let u = [];
          for (let S = 0; S < r.length; ++S) {
            let I = r[S].data;
            if (I === 0) continue;
            let E = this.gpuDataManager.get(I);
            if (!E) throw new Error(`no GPU data for input: ${I}`);
            u.push(E);
          }
          let { outputs: d, dispatchGroup: c, programUniforms: p } = e.getRunData(r), m = n.length === 0 ? d.map((S, I) => I) : n;
          if (m.length !== d.length) throw new Error(`Output size ${m.length} must be equal to ${d.length}.`);
          let g = [], y = [];
          for (let S = 0; S < d.length; ++S) {
            if (!Number.isInteger(m[S]) || m[S] < -3 || m[S] >= s) throw new Error(`Invalid output index: ${m[S]}`);
            if (m[S] === -3) continue;
            let I = m[S] === -1, E = m[S] === -2, A = I || E ? i(d[S].dataType, d[S].dims) : o(m[S], d[S].dataType, d[S].dims);
            if (g.push(A), A.data === 0) continue;
            let z2 = this.gpuDataManager.get(A.data);
            if (!z2) throw new Error(`no GPU data for output: ${A.data}`);
            if (I && this.temporaryData.push(z2), E) {
              let v = this.kernelPersistentData.get(this.currentKernelId);
              v || (v = [], this.kernelPersistentData.set(this.currentKernelId, v)), v.push(z2);
            }
            y.push(z2);
          }
          if (u.length !== r.length || y.length !== g.length) {
            if (y.length === 0) return Re(e.name), g;
            throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`);
          }
          let b;
          if (p) {
            let S = 0, I = [];
            p.forEach((v) => {
              let R = typeof v.data == "number" ? [v.data] : v.data;
              if (R.length === 0) return;
              let N = v.type === 10 ? 2 : 4, F, q;
              v.type === 10 ? (q = R.length > 4 ? 16 : R.length > 2 ? 8 : R.length * N, F = R.length > 4 ? 16 : N * R.length) : (q = R.length <= 2 ? R.length * N : 16, F = 16), S = Math.ceil(S / q) * q, I.push(S);
              let X = v.type === 10 ? 8 : 4;
              S += R.length > 4 ? Math.ceil(R.length / X) * F : R.length * N;
            });
            let E = 16;
            S = Math.ceil(S / E) * E;
            let A = new ArrayBuffer(S);
            p.forEach((v, R) => {
              let N = I[R], F = typeof v.data == "number" ? [v.data] : v.data;
              if (v.type === 6) new Int32Array(A, N, F.length).set(F);
              else if (v.type === 12) new Uint32Array(A, N, F.length).set(F);
              else if (v.type === 10) new Uint16Array(A, N, F.length).set(F);
              else if (v.type === 1) new Float32Array(A, N, F.length).set(F);
              else throw new Error(`Unsupported uniform type: ${rt2(v.type)}`);
            });
            let z2 = this.gpuDataManager.create(S, GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM);
            this.device.queue.writeBuffer(z2.buffer, 0, A, 0, S), this.gpuDataManager.release(z2.id), b = { offset: 0, size: S, buffer: z2.buffer };
          }
          let _ = this.programManager.normalizeDispatchGroupSize(c), T = _[1] === 1 && _[2] === 1, x = Lb(e, r, T), $2 = this.programManager.getArtifact(x);
          if ($2 || ($2 = this.programManager.build(e, _), this.programManager.setArtifact(x, $2), ie2("info", () => `[artifact] key: ${x}, programName: ${e.name}`)), p && $2.uniformVariablesInfo) {
            if (p.length !== $2.uniformVariablesInfo.length) throw new Error(`Uniform variables count mismatch: expect ${$2.uniformVariablesInfo.length}, got ${p.length} in program "${$2.programInfo.name}".`);
            for (let S = 0; S < p.length; S++) {
              let I = p[S], E = I.type, A = typeof I.data == "number" ? 1 : I.data.length, [z2, v] = $2.uniformVariablesInfo[S];
              if (E !== z2 || A !== v) throw new Error(`Uniform variable ${S} mismatch: expect type ${z2} with size ${v}, got type ${E} with size ${A} in program "${$2.programInfo.name}".`);
            }
          }
          if (ie2("info", () => `[ProgramManager] run "${e.name}" (key=${x}) with ${_[0]}x${_[1]}x${_[2]}`), this.queryType !== "none" || this.sessionStatus === "capturing") {
            let S = { kernelId: this.currentKernelId, programName: $2.programInfo.name, inputTensorViews: r, outputTensorViews: g };
            this.pendingKernels.push(S), this.sessionStatus === "capturing" && this.capturedPendingKernels.get(this.currentSessionId).push(S);
          }
          return this.programManager.run($2, u, y, _, b), Re(e.name), g;
        }
        upload(e, r) {
          this.gpuDataManager.upload(e, r);
        }
        memcpy(e, r) {
          this.gpuDataManager.memcpy(e, r);
        }
        async download(e, r) {
          await this.gpuDataManager.download(e, r);
        }
        alloc(e) {
          return this.gpuDataManager.create(e).id;
        }
        free(e) {
          return this.gpuDataManager.release(e);
        }
        createKernel(e, r, n, o) {
          let i = Mc.get(e);
          if (!i) throw new Error(`kernel not implemented: ${e}`);
          let s = { kernelType: e, kernelName: o, kernelEntry: i[0], attributes: [i[1], n] };
          this.kernels.set(r, s);
        }
        releaseKernel(e) {
          let r = this.kernelPersistentData.get(e);
          if (r) {
            for (let n of r) this.gpuDataManager.release(n.id);
            this.kernelPersistentData.delete(e);
          }
          this.kernelCustomData.delete(e), this.kernels.delete(e);
        }
        computeKernel(e, r, n) {
          let o = this.kernels.get(e);
          if (!o) throw new Error(`kernel not created: ${e}`);
          let i = o.kernelType, s = o.kernelName, u = o.kernelEntry, d = o.attributes;
          if (this.currentKernelId !== null) throw new Error(`kernel "[${i}] ${s}" is not allowed to be called recursively`);
          this.currentKernelId = e, d[0] && (d[1] = d[0](d[1]), d[0] = void 0), ie2("info", () => `[WebGPU] Start to run kernel "[${i}] ${s}"...`);
          let c = this.env.debug;
          this.temporaryData = [];
          try {
            return c && this.device.pushErrorScope("validation"), u(r, d[1]), 0;
          } catch (p) {
            return n.push(Promise.resolve(`[WebGPU] Kernel "[${i}] ${s}" failed. ${p}`)), 1;
          } finally {
            c && n.push(this.device.popErrorScope().then((p) => p ? `GPU validation error for kernel "[${i}] ${s}": ${p.message}` : null));
            for (let p of this.temporaryData) this.gpuDataManager.release(p.id);
            this.temporaryData = [], this.currentKernelId = null;
          }
        }
        registerBuffer(e, r, n, o) {
          let i = this.sessionExternalDataMapping.get(e);
          i || (i = /* @__PURE__ */ new Map(), this.sessionExternalDataMapping.set(e, i));
          let s = i.get(r), u = this.gpuDataManager.registerExternalBuffer(n, o, s);
          return i.set(r, [u, n]), u;
        }
        unregisterBuffers(e) {
          let r = this.sessionExternalDataMapping.get(e);
          r && (r.forEach((n) => this.gpuDataManager.unregisterExternalBuffer(n[0])), this.sessionExternalDataMapping.delete(e));
        }
        getBuffer(e) {
          let r = this.gpuDataManager.get(e);
          if (!r) throw new Error(`no GPU data for buffer: ${e}`);
          return r.buffer;
        }
        createDownloader(e, r, n) {
          return async () => {
            let o = await co(this, e, r);
            return Gr(o.buffer, n);
          };
        }
        writeTimestamp(e) {
          this.queryType === "inside-passes" && this.computePassEncoder.writeTimestamp(this.querySet, e);
        }
        setQueryType() {
          this.queryType = "none", (this.env.webgpu.profiling?.mode === "default" || (typeof this.env.trace > "u" ? this.env.wasm.trace : this.env.trace)) && (this.device.features.has("chromium-experimental-timestamp-query-inside-passes") ? this.queryType = "inside-passes" : this.device.features.has("timestamp-query") && (this.queryType = "at-passes"), this.queryType !== "none" && typeof this.querySet > "u" && (this.querySet = this.device.createQuerySet({ type: "timestamp", count: this.maxDispatchNumber * 2 }), this.queryResolveBuffer = this.device.createBuffer({ size: this.maxDispatchNumber * 2 * 8, usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.QUERY_RESOLVE })));
        }
        captureBegin() {
          ie2("info", "captureBegin"), this.capturedCommandList.get(this.currentSessionId) || this.capturedCommandList.set(this.currentSessionId, []), this.capturedPendingKernels.get(this.currentSessionId) || this.capturedPendingKernels.set(this.currentSessionId, []), this.flush(), this.sessionStatus = "capturing";
        }
        captureEnd() {
          ie2("info", "captureEnd"), this.flush(), this.sessionStatus = "default";
        }
        replay() {
          ie2("info", "replay"), this.sessionStatus = "replaying";
          let e = this.capturedCommandList.get(this.currentSessionId), r = this.capturedPendingKernels.get(this.currentSessionId), n = e.length;
          this.pendingKernels = [];
          for (let o = 0; o < n; o++) {
            let i = this.getComputePassEncoder(), s = e[o];
            this.writeTimestamp(this.pendingDispatchNumber * 2), i.setPipeline(s.computePipeline), i.setBindGroup(0, s.bindGroup), i.dispatchWorkgroups(...s.dispatchGroup), this.writeTimestamp(this.pendingDispatchNumber * 2 + 1), this.pendingDispatchNumber++, this.queryType !== "none" && this.pendingKernels.push(r[o]), (this.pendingDispatchNumber >= this.maxDispatchNumber || this.queryType === "at-passes") && this.endComputePass(), this.pendingDispatchNumber >= this.maxDispatchNumber && this.flush();
          }
          this.flush(), this.sessionStatus = "default";
        }
        onCreateSession() {
          this.gpuDataManager.onCreateSession();
        }
        onReleaseSession(e) {
          this.unregisterBuffers(e), this.capturedCommandList.has(e) && this.capturedCommandList.delete(e), this.capturedPendingKernels.has(e) && this.capturedPendingKernels.delete(e), this.gpuDataManager.onReleaseSession(e);
        }
        onRunStart(e) {
          this.currentSessionId = e, this.setQueryType();
        }
      };
    });
    Lc = {};
    Vt2(Lc, { init: () => Wb });
    Wc = V(() => {
      J();
      nt();
      re();
      Ms2();
      ur2 = class t {
        constructor(e, r, n, o) {
          this.module = e;
          this.dataType = r;
          this.data = n;
          this.dims = o;
        }
        getFloat32Array() {
          if (this.dataType !== 1) throw new Error("Invalid data type");
          let e = k2.size(this.dims);
          return e === 0 ? new Float32Array() : new Float32Array(this.module.HEAP8.buffer, this.data, e);
        }
        getBigInt64Array() {
          if (this.dataType !== 7) throw new Error("Invalid data type");
          let e = k2.size(this.dims);
          return e === 0 ? new BigInt64Array() : new BigInt64Array(this.module.HEAP8.buffer, this.data, e);
        }
        getInt32Array() {
          if (this.dataType !== 6) throw new Error("Invalid data type");
          let e = k2.size(this.dims);
          return e === 0 ? new Int32Array() : new Int32Array(this.module.HEAP8.buffer, this.data, e);
        }
        getUint16Array() {
          if (this.dataType !== 10 && this.dataType !== 4) throw new Error("Invalid data type");
          let e = k2.size(this.dims);
          return e === 0 ? new Uint16Array() : new Uint16Array(this.module.HEAP8.buffer, this.data, e);
        }
        reshape(e) {
          if (k2.size(e) !== k2.size(this.dims)) throw new Error("Invalid new shape");
          return new t(this.module, this.dataType, this.data, e);
        }
      }, Mo = class {
        constructor(e, r, n) {
          this.module = e;
          this.backend = r;
          this.customDataOffset = 0;
          this.customDataSize = 0;
          this.adapterInfo = r.adapterInfo;
          let o = e.PTR_SIZE, i = n / e.PTR_SIZE, s = o === 4 ? "i32" : "i64";
          this.opKernelContext = Number(e.getValue(o * i++, s));
          let u = Number(e.getValue(o * i++, s));
          this.outputCount = Number(e.getValue(o * i++, s)), this.customDataOffset = Number(e.getValue(o * i++, "*")), this.customDataSize = Number(e.getValue(o * i++, s));
          let d = [];
          for (let c = 0; c < u; c++) {
            let p = Number(e.getValue(o * i++, s)), m = Number(e.getValue(o * i++, "*")), g = Number(e.getValue(o * i++, s)), y = [];
            for (let b = 0; b < g; b++) y.push(Number(e.getValue(o * i++, s)));
            d.push(new ur2(e, p, m, y));
          }
          this.inputs = d;
        }
        get kernelCustomData() {
          return this.backend.currentKernelCustomData;
        }
        get customDataBuffer() {
          return this.module.HEAPU8.subarray(this.customDataOffset, this.customDataOffset + this.customDataSize);
        }
        compute(e, r) {
          let n = r?.inputs?.map((u) => typeof u == "number" ? this.inputs[u] : u) ?? this.inputs, o = r?.outputs ?? [], i = (u, d, c) => new ur2(this.module, d, this.output(u, c), c), s = (u, d) => {
            let c = xt2(u, d);
            if (!c) throw new Error(`Unsupported data type: ${u}`);
            let p = c > 0 ? this.backend.gpuDataManager.create(c).id : 0;
            return new ur2(this.module, u, p, d);
          };
          return this.backend.run(e, n, o, i, s, this.outputCount);
        }
        output(e, r) {
          let n = this.module.stackSave();
          try {
            let o = this.module.PTR_SIZE, i = o === 4 ? "i32" : "i64", s = this.module.stackAlloc((1 + r.length) * o);
            this.module.setValue(s, r.length, i);
            for (let u = 0; u < r.length; u++) this.module.setValue(s + o * (u + 1), r[u], i);
            return this.module._JsepOutput(this.opKernelContext, e, s);
          } catch (o) {
            throw new Error(`Failed to generate kernel's output[${e}] with dims [${r}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${o}`);
          } finally {
            this.module.stackRestore(n);
          }
        }
      }, Wb = async (t, e, r, n) => {
        let o = e.jsepInit;
        if (!o) throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");
        if (t === "webgpu") {
          let i = (Vc(), Xt2(Nc)).WebGpuBackend, s = new i();
          await s.initialize(r, n), o("webgpu", [s, (u) => s.alloc(Number(u)), (u) => s.free(u), (u, d, c, p = false) => {
            if (p) ie2("verbose", () => `[WebGPU] jsepCopyGpuToGpu: src=${Number(u)}, dst=${Number(d)}, size=${Number(c)}`), s.memcpy(Number(u), Number(d));
            else {
              ie2("verbose", () => `[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(u)}, gpuDataId=${Number(d)}, size=${Number(c)}`);
              let m = e.HEAPU8.subarray(Number(u >>> 0), Number(u >>> 0) + Number(c));
              s.upload(Number(d), m);
            }
          }, async (u, d, c) => {
            ie2("verbose", () => `[WebGPU] jsepCopyGpuToCpu: gpuDataId=${u}, dataOffset=${d}, size=${c}`), await s.download(Number(u), () => e.HEAPU8.subarray(Number(d) >>> 0, Number(d + c) >>> 0));
          }, (u, d, c) => s.createKernel(u, Number(d), c, e.UTF8ToString(e._JsepGetNodeName(Number(d)))), (u) => s.releaseKernel(u), (u, d, c, p) => {
            ie2("verbose", () => `[WebGPU] jsepRun: sessionHandle=${c}, kernel=${u}, contextDataOffset=${d}`);
            let m = new Mo(e, s, Number(d));
            return s.computeKernel(Number(u), m, p);
          }, () => s.captureBegin(), () => s.captureEnd(), () => s.replay()]);
        } else {
          let i = new Kr2(r);
          o("webnn", [i, () => i.reserveTensorId(), (s) => i.releaseTensorId(s), async (s, u, d, c, p) => i.ensureTensor(s, u, d, c, p), (s, u) => {
            i.uploadTensor(s, u);
          }, async (s, u) => i.downloadTensor(s, u), (s, u) => i.registerMLContext(s, u), !!r.trace]);
        }
      };
    });
    Qn = V(() => {
      Le2();
      xs2();
      Ts2();
      J();
      vt();
      Ur();
      ro();
      Gb = (t, e) => {
        ye()._OrtInit(t, e) !== 0 && me("Can't initialize onnxruntime.");
      }, kr = async (t) => {
        Gb(t.wasm.numThreads, rr2(t.logLevel));
      }, Pr = async (t, e) => {
        ye().asyncInit?.();
        let r = t.webgpu.adapter;
        if (e === "webgpu") {
          if (typeof navigator > "u" || !navigator.gpu) throw new Error("WebGPU is not supported in current environment");
          if (r) {
            if (typeof r.limits != "object" || typeof r.features != "object" || typeof r.requestDevice != "function") throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.");
          } else {
            let n = t.webgpu.powerPreference;
            if (n !== void 0 && n !== "low-power" && n !== "high-performance") throw new Error(`Invalid powerPreference setting: "${n}"`);
            let o = t.webgpu.forceFallbackAdapter;
            if (o !== void 0 && typeof o != "boolean") throw new Error(`Invalid forceFallbackAdapter setting: "${o}"`);
            if (r = await navigator.gpu.requestAdapter({ powerPreference: n, forceFallbackAdapter: o }), !r) throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.');
          }
        }
        if (e === "webnn" && (typeof navigator > "u" || !navigator.ml)) throw new Error("WebNN is not supported in current environment");
        {
          let n = (Wc(), Xt2(Lc)).init;
          e === "webgpu" && await n("webgpu", ye(), t, r), e === "webnn" && await n("webnn", ye(), t);
        }
      }, Mt2 = /* @__PURE__ */ new Map(), Hb = (t) => {
        let e = ye(), r = e.stackSave();
        try {
          let n = e.PTR_SIZE, o = e.stackAlloc(2 * n);
          e._OrtGetInputOutputCount(t, o, o + n) !== 0 && me("Can't get session input/output count.");
          let s = n === 4 ? "i32" : "i64";
          return [Number(e.getValue(o, s)), Number(e.getValue(o + n, s))];
        } finally {
          e.stackRestore(r);
        }
      }, Gc = (t, e) => {
        let r = ye(), n = r.stackSave(), o = 0;
        try {
          let i = r.PTR_SIZE, s = r.stackAlloc(2 * i);
          r._OrtGetInputOutputMetadata(t, e, s, s + i) !== 0 && me("Can't get session input/output metadata.");
          let d = Number(r.getValue(s, "*"));
          o = Number(r.getValue(s + i, "*"));
          let c = r.HEAP32[o / 4];
          if (c === 0) return [d, 0];
          let p = r.HEAPU32[o / 4 + 1], m = [];
          for (let g = 0; g < p; g++) {
            let y = Number(r.getValue(o + 8 + g * i, "*"));
            m.push(y !== 0 ? r.UTF8ToString(y) : Number(r.getValue(o + 8 + (g + p) * i, "*")));
          }
          return [d, c, m];
        } finally {
          r.stackRestore(n), o !== 0 && r._OrtFree(o);
        }
      }, er2 = (t) => {
        let e = ye(), r = e._malloc(t.byteLength);
        if (r === 0) throw new Error(`Can't create a session. failed to allocate a buffer of size ${t.byteLength}.`);
        return e.HEAPU8.set(t, r), [r, t.byteLength];
      }, Or = async (t, e) => {
        let r, n, o = ye();
        Array.isArray(t) ? [r, n] = t : t.buffer === o.HEAPU8.buffer ? [r, n] = [t.byteOffset, t.byteLength] : [r, n] = er2(t);
        let i = 0, s = 0, u = 0, d = [], c = [], p = [];
        try {
          if ([s, d] = await Ss2(e), e?.externalData && o.mountExternalData) {
            let I = [];
            for (let E of e.externalData) {
              let A = typeof E == "string" ? E : E.path;
              I.push(nr2(typeof E == "string" ? E : E.data).then((z2) => {
                o.mountExternalData(A, z2);
              }));
            }
            await Promise.all(I);
          }
          for (let I of e?.executionProviders ?? []) if ((typeof I == "string" ? I : I.name) === "webnn") {
            if (o.shouldTransferToMLTensor = false, typeof I != "string") {
              let A = I, z2 = A?.context, v = A?.gpuDevice, R = A?.deviceType, N = A?.powerPreference;
              z2 ? o.currentContext = z2 : v ? o.currentContext = await o.webnnCreateMLContext(v) : o.currentContext = await o.webnnCreateMLContext({ deviceType: R, powerPreference: N });
            } else o.currentContext = await o.webnnCreateMLContext();
            break;
          }
          i = await o._OrtCreateSession(r, n, s), o.webgpuOnCreateSession?.(i), i === 0 && me("Can't create a session."), o.jsepOnCreateSession?.(), o.currentContext && (o.webnnRegisterMLContext(i, o.currentContext), o.currentContext = void 0, o.shouldTransferToMLTensor = true);
          let [m, g] = Hb(i), y = !!e?.enableGraphCapture, b = [], _ = [], T = [], x = [], $2 = [];
          for (let I = 0; I < m; I++) {
            let [E, A, z2] = Gc(i, I);
            E === 0 && me("Can't get an input name."), c.push(E);
            let v = o.UTF8ToString(E);
            b.push(v), T.push(A === 0 ? { name: v, isTensor: false } : { name: v, isTensor: true, type: rt2(A), shape: z2 });
          }
          for (let I = 0; I < g; I++) {
            let [E, A, z2] = Gc(i, I + m);
            E === 0 && me("Can't get an output name."), p.push(E);
            let v = o.UTF8ToString(E);
            _.push(v), x.push(A === 0 ? { name: v, isTensor: false } : { name: v, isTensor: true, type: rt2(A), shape: z2 });
            {
              if (y && e?.preferredOutputLocation === void 0) {
                $2.push("gpu-buffer");
                continue;
              }
              let R = typeof e?.preferredOutputLocation == "string" ? e.preferredOutputLocation : e?.preferredOutputLocation?.[v] ?? "cpu", N = o.webnnIsGraphOutput;
              if (R === "cpu" && N && N(i, v)) {
                $2.push("ml-tensor-cpu-output");
                continue;
              }
              if (R !== "cpu" && R !== "cpu-pinned" && R !== "gpu-buffer" && R !== "ml-tensor") throw new Error(`Not supported preferred output location: ${R}.`);
              if (y && R !== "gpu-buffer") throw new Error(`Not supported preferred output location: ${R}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);
              $2.push(R);
            }
          }
          let S = null;
          return $2.some((I) => I === "gpu-buffer" || I === "ml-tensor" || I === "ml-tensor-cpu-output") && (u = o._OrtCreateBinding(i), u === 0 && me("Can't create IO binding."), S = { handle: u, outputPreferredLocations: $2, outputPreferredLocationsEncoded: $2.map((I) => I === "ml-tensor-cpu-output" ? "ml-tensor" : I).map((I) => to(I)) }), Mt2.set(i, [i, c, p, S, y, false]), [i, b, _, T, x];
        } catch (m) {
          throw c.forEach((g) => o._OrtFree(g)), p.forEach((g) => o._OrtFree(g)), u !== 0 && o._OrtReleaseBinding(u) !== 0 && me("Can't release IO binding."), i !== 0 && o._OrtReleaseSession(i) !== 0 && me("Can't release session."), m;
        } finally {
          o._free(r), s !== 0 && o._OrtReleaseSessionOptions(s) !== 0 && me("Can't release session options."), d.forEach((m) => o._free(m)), o.unmountExternalData?.();
        }
      }, zr = (t) => {
        let e = ye(), r = Mt2.get(t);
        if (!r) throw new Error(`cannot release session. invalid session id: ${t}`);
        let [n, o, i, s, u] = r;
        s && (u && e._OrtClearBoundOutputs(s.handle) !== 0 && me("Can't clear bound outputs."), e._OrtReleaseBinding(s.handle) !== 0 && me("Can't release IO binding.")), e.jsepOnReleaseSession?.(t), e.webnnOnReleaseSession?.(t), e.webgpuOnReleaseSession?.(t), o.forEach((d) => e._OrtFree(d)), i.forEach((d) => e._OrtFree(d)), e._OrtReleaseSession(n) !== 0 && me("Can't release session."), Mt2.delete(t);
      }, Hc = async (t, e, r, n, o, i, s = false) => {
        if (!t) {
          e.push(0);
          return;
        }
        let u = ye(), d = u.PTR_SIZE, c = t[0], p = t[1], m = t[3], g = m, y, b;
        if (c === "string" && (m === "gpu-buffer" || m === "ml-tensor")) throw new Error("String tensor is not supported on GPU.");
        if (s && m !== "gpu-buffer") throw new Error(`External buffer must be provided for input/output index ${i} when enableGraphCapture is true.`);
        if (m === "gpu-buffer") {
          let x = t[2].gpuBuffer;
          b = xt2($t(c), p);
          {
            let $2 = u.jsepRegisterBuffer;
            if (!$2) throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');
            y = $2(n, i, x, b);
          }
        } else if (m === "ml-tensor") {
          let x = t[2].mlTensor;
          b = xt2($t(c), p);
          let $2 = u.webnnRegisterMLTensor;
          if (!$2) throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');
          y = $2(n, x, $t(c), p);
        } else {
          let x = t[2];
          if (Array.isArray(x)) {
            b = d * x.length, y = u._malloc(b), r.push(y);
            for (let $2 = 0; $2 < x.length; $2++) {
              if (typeof x[$2] != "string") throw new TypeError(`tensor data at index ${$2} is not a string`);
              u.setValue(y + $2 * d, Ge(x[$2], r), "*");
            }
          } else {
            let $2 = u.webnnIsGraphInput, S = u.webnnIsGraphOutput;
            if (c !== "string" && $2 && S) {
              let I = u.UTF8ToString(o);
              if ($2(n, I) || S(n, I)) {
                let E = $t(c);
                b = xt2(E, p), g = "ml-tensor";
                let A = u.webnnCreateTemporaryTensor, z2 = u.webnnUploadTensor;
                if (!A || !z2) throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');
                let v = await A(n, E, p);
                z2(v, new Uint8Array(x.buffer, x.byteOffset, x.byteLength)), y = v;
              } else b = x.byteLength, y = u._malloc(b), r.push(y), u.HEAPU8.set(new Uint8Array(x.buffer, x.byteOffset, b), y);
            } else b = x.byteLength, y = u._malloc(b), r.push(y), u.HEAPU8.set(new Uint8Array(x.buffer, x.byteOffset, b), y);
          }
        }
        let _ = u.stackSave(), T = u.stackAlloc(4 * p.length);
        try {
          p.forEach(($2, S) => u.setValue(T + S * d, $2, d === 4 ? "i32" : "i64"));
          let x = u._OrtCreateTensor($t(c), y, b, T, p.length, to(g));
          x === 0 && me(`Can't create tensor for input/output. session=${n}, index=${i}.`), e.push(x);
        } finally {
          u.stackRestore(_);
        }
      }, Br = async (t, e, r, n, o, i) => {
        let s = ye(), u = s.PTR_SIZE, d = Mt2.get(t);
        if (!d) throw new Error(`cannot run inference. invalid session id: ${t}`);
        let c = d[0], p = d[1], m = d[2], g = d[3], y = d[4], b = d[5], _ = e.length, T = n.length, x = 0, $2 = [], S = [], I = [], E = [], A = [], z2 = s.stackSave(), v = s.stackAlloc(_ * u), R = s.stackAlloc(_ * u), N = s.stackAlloc(T * u), F = s.stackAlloc(T * u);
        try {
          [x, $2] = $s2(i), _t("wasm prepareInputOutputTensor");
          for (let L = 0; L < _; L++) await Hc(r[L], S, E, t, p[e[L]], e[L], y);
          for (let L = 0; L < T; L++) await Hc(o[L], I, E, t, m[n[L]], _ + n[L], y);
          wt("wasm prepareInputOutputTensor");
          for (let L = 0; L < _; L++) s.setValue(v + L * u, S[L], "*"), s.setValue(R + L * u, p[e[L]], "*");
          for (let L = 0; L < T; L++) s.setValue(N + L * u, I[L], "*"), s.setValue(F + L * u, m[n[L]], "*");
          if (g && !b) {
            let { handle: L, outputPreferredLocations: Q2, outputPreferredLocationsEncoded: Y } = g;
            if (p.length !== _) throw new Error(`input count from feeds (${_}) is expected to be always equal to model's input count (${p.length}).`);
            _t("wasm bindInputsOutputs");
            for (let Z = 0; Z < _; Z++) {
              let te = e[Z];
              await s._OrtBindInput(L, p[te], S[Z]) !== 0 && me(`Can't bind input[${Z}] for session=${t}.`);
            }
            for (let Z = 0; Z < T; Z++) {
              let te = n[Z];
              o[Z]?.[3] ? (A.push(I[Z]), s._OrtBindOutput(L, m[te], I[Z], 0) !== 0 && me(`Can't bind pre-allocated output[${Z}] for session=${t}.`)) : s._OrtBindOutput(L, m[te], 0, Y[te]) !== 0 && me(`Can't bind output[${Z}] to ${Q2[Z]} for session=${t}.`);
            }
            wt("wasm bindInputsOutputs"), Mt2.set(t, [c, p, m, g, y, true]);
          }
          s.jsepOnRunStart?.(c), s.webnnOnRunStart?.(c);
          let q;
          g ? q = await s._OrtRunWithBinding(c, g.handle, T, N, x) : q = await s._OrtRun(c, R, v, _, F, T, N, x), q !== 0 && me("failed to call OrtRun().");
          let X = [], B = [];
          _t("wasm ProcessOutputTensor");
          for (let L = 0; L < T; L++) {
            let Q2 = Number(s.getValue(N + L * u, "*"));
            if (Q2 === I[L] || A.includes(I[L])) {
              X.push(o[L]), Q2 !== I[L] && s._OrtReleaseTensor(Q2) !== 0 && me("Can't release tensor.");
              continue;
            }
            let Y = s.stackSave(), Z = s.stackAlloc(4 * u), te = false, ae, le2 = 0;
            try {
              s._OrtGetTensorData(Q2, Z, Z + u, Z + 2 * u, Z + 3 * u) !== 0 && me(`Can't access output tensor data on index ${L}.`);
              let ve = u === 4 ? "i32" : "i64", M = Number(s.getValue(Z, ve));
              le2 = s.getValue(Z + u, "*");
              let G = s.getValue(Z + u * 2, "*"), be2 = Number(s.getValue(Z + u * 3, ve)), Ee2 = [];
              for (let he = 0; he < be2; he++) Ee2.push(Number(s.getValue(G + he * u, ve)));
              s._OrtFree(G) !== 0 && me("Can't free memory for tensor dims.");
              let $e2 = Ee2.reduce((he, Te) => he * Te, 1);
              ae = rt2(M);
              let Pe = g?.outputPreferredLocations[n[L]];
              if (ae === "string") {
                if (Pe === "gpu-buffer" || Pe === "ml-tensor") throw new Error("String tensor is not supported on GPU.");
                let he = [];
                for (let Te = 0; Te < $e2; Te++) {
                  let qe = s.getValue(le2 + Te * u, "*"), Ne = s.getValue(le2 + (Te + 1) * u, "*"), Se = Te === $e2 - 1 ? void 0 : Ne - qe;
                  he.push(s.UTF8ToString(qe, Se));
                }
                X.push([ae, Ee2, he, "cpu"]);
              } else if (Pe === "gpu-buffer" && $e2 > 0) {
                let he = s.jsepGetBuffer;
                if (!he) throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');
                let Te = he(le2), qe = xt2(M, $e2);
                if (qe === void 0 || !Nr(ae)) throw new Error(`Unsupported data type: ${ae}`);
                te = true, X.push([ae, Ee2, { gpuBuffer: Te, download: s.jsepCreateDownloader(Te, qe, ae), dispose: () => {
                  s._OrtReleaseTensor(Q2) !== 0 && me("Can't release tensor.");
                } }, "gpu-buffer"]);
              } else if (Pe === "ml-tensor" && $e2 > 0) {
                let he = s.webnnEnsureTensor, Te = s.webnnIsGraphInputOutputTypeSupported;
                if (!he || !Te) throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');
                if (xt2(M, $e2) === void 0 || !Vr(ae)) throw new Error(`Unsupported data type: ${ae}`);
                if (!Te(t, ae, false)) throw new Error(`preferredLocation "ml-tensor" for ${ae} output is not supported by current WebNN Context.`);
                let Ne = await he(t, le2, M, Ee2, false);
                te = true, X.push([ae, Ee2, { mlTensor: Ne, download: s.webnnCreateMLTensorDownloader(le2, ae), dispose: () => {
                  s.webnnReleaseTensorId(le2), s._OrtReleaseTensor(Q2);
                } }, "ml-tensor"]);
              } else if (Pe === "ml-tensor-cpu-output" && $e2 > 0) {
                let he = s.webnnCreateMLTensorDownloader(le2, ae)(), Te = X.length;
                te = true, B.push((async () => {
                  let qe = [Te, await he];
                  return s.webnnReleaseTensorId(le2), s._OrtReleaseTensor(Q2), qe;
                })()), X.push([ae, Ee2, [], "cpu"]);
              } else {
                let he = Wt(ae), Te = new he($e2);
                new Uint8Array(Te.buffer, Te.byteOffset, Te.byteLength).set(s.HEAPU8.subarray(le2, le2 + Te.byteLength)), X.push([ae, Ee2, Te, "cpu"]);
              }
            } finally {
              s.stackRestore(Y), ae === "string" && le2 && s._free(le2), te || s._OrtReleaseTensor(Q2);
            }
          }
          g && !y && (s._OrtClearBoundOutputs(g.handle) !== 0 && me("Can't clear bound outputs."), Mt2.set(t, [c, p, m, g, y, false]));
          for (let [L, Q2] of await Promise.all(B)) X[L][2] = Q2;
          return wt("wasm ProcessOutputTensor"), X;
        } finally {
          s.webnnOnRunEnd?.(c), s.stackRestore(z2), S.forEach((q) => s._OrtReleaseTensor(q)), I.forEach((q) => s._OrtReleaseTensor(q)), E.forEach((q) => s._free(q)), x !== 0 && s._OrtReleaseRunOptions(x), $2.forEach((q) => s._free(q));
        }
      }, Dr = (t) => {
        let e = ye(), r = Mt2.get(t);
        if (!r) throw new Error("invalid session id");
        let n = r[0], o = e._OrtEndProfiling(n);
        o === 0 && me("Can't get an profile file name."), e._OrtFree(o);
      }, Mr = (t) => {
        let e = [];
        for (let r of t) {
          let n = r[2];
          !Array.isArray(n) && "buffer" in n && e.push(n.buffer);
        }
        return e;
      };
    });
    No = V(() => {
      Le2();
      Qn();
      vt();
      Ar();
      Rt = () => !!_e.wasm.proxy && typeof document < "u", dr2 = false, hn = false, gn = false, Uo = /* @__PURE__ */ new Map(), qt2 = (t, e) => {
        let r = Uo.get(t);
        r ? r.push(e) : Uo.set(t, [e]);
      }, Kt2 = () => {
        if (dr2 || !hn || gn || !Fe) throw new Error("worker not ready");
      }, qb = (t) => {
        switch (t.data.type) {
          case "init-wasm":
            dr2 = false, t.data.err ? (gn = true, Ro[1](t.data.err)) : (hn = true, Ro[0]()), fn2 && (URL.revokeObjectURL(fn2), fn2 = void 0);
            break;
          case "init-ep":
          case "copy-from":
          case "create":
          case "release":
          case "run":
          case "end-profiling": {
            let e = Uo.get(t.data.type);
            t.data.err ? e.shift()[1](t.data.err) : e.shift()[0](t.data.out);
            break;
          }
        }
      }, Fc = async () => {
        if (!hn) {
          if (dr2) throw new Error("multiple calls to 'initWasm()' detected.");
          if (gn) throw new Error("previous call to 'initWasm()' failed.");
          if (dr2 = true, Rt()) return new Promise((t, e) => {
            Fe?.terminate(), _s2().then(([r, n]) => {
              try {
                Fe = n, Fe.onerror = (i) => e(i), Fe.onmessage = qb, Ro = [t, e];
                let o = { type: "init-wasm", in: _e };
                !o.in.wasm.wasmPaths && (r || Xn) && (o.in.wasm.wasmPaths = { wasm: new URL("ort-wasm-simd-threaded.jsep.wasm", import.meta.url).href }), Fe.postMessage(o), fn2 = r;
              } catch (o) {
                e(o);
              }
            }, e);
          });
          try {
            await Er(_e.wasm), await kr(_e), hn = true;
          } catch (t) {
            throw gn = true, t;
          } finally {
            dr2 = false;
          }
        }
      }, qc = async (t) => {
        if (Rt()) return Kt2(), new Promise((e, r) => {
          qt2("init-ep", [e, r]);
          let n = { type: "init-ep", in: { epName: t, env: _e } };
          Fe.postMessage(n);
        });
        await Pr(_e, t);
      }, Kc = async (t) => Rt() ? (Kt2(), new Promise((e, r) => {
        qt2("copy-from", [e, r]);
        let n = { type: "copy-from", in: { buffer: t } };
        Fe.postMessage(n, [t.buffer]);
      })) : er2(t), jc = async (t, e) => {
        if (Rt()) {
          if (e?.preferredOutputLocation) throw new Error('session option "preferredOutputLocation" is not supported for proxy.');
          return Kt2(), new Promise((r, n) => {
            qt2("create", [r, n]);
            let o = { type: "create", in: { model: t, options: { ...e } } }, i = [];
            t instanceof Uint8Array && i.push(t.buffer), Fe.postMessage(o, i);
          });
        } else return Or(t, e);
      }, Zc = async (t) => {
        if (Rt()) return Kt2(), new Promise((e, r) => {
          qt2("release", [e, r]);
          let n = { type: "release", in: t };
          Fe.postMessage(n);
        });
        zr(t);
      }, Qc = async (t, e, r, n, o, i) => {
        if (Rt()) {
          if (r.some((s) => s[3] !== "cpu")) throw new Error("input tensor on GPU is not supported for proxy.");
          if (o.some((s) => s)) throw new Error("pre-allocated output tensor is not supported for proxy.");
          return Kt2(), new Promise((s, u) => {
            qt2("run", [s, u]);
            let d = r, c = { type: "run", in: { sessionId: t, inputIndices: e, inputs: d, outputIndices: n, options: i } };
            Fe.postMessage(c, Mr(d));
          });
        } else return Br(t, e, r, n, o, i);
      }, Yc = async (t) => {
        if (Rt()) return Kt2(), new Promise((e, r) => {
          qt2("end-profiling", [e, r]);
          let n = { type: "end-profiling", in: t };
          Fe.postMessage(n);
        });
        Dr(t);
      };
    });
    Jc = V(() => {
      Le2();
      No();
      J();
      Cr();
      ro();
      Xc = (t, e) => {
        switch (t.location) {
          case "cpu":
            return [t.type, t.dims, t.data, "cpu"];
          case "gpu-buffer":
            return [t.type, t.dims, { gpuBuffer: t.gpuBuffer }, "gpu-buffer"];
          case "ml-tensor":
            return [t.type, t.dims, { mlTensor: t.mlTensor }, "ml-tensor"];
          default:
            throw new Error(`invalid data location: ${t.location} for ${e()}`);
        }
      }, Kb = (t) => {
        switch (t[3]) {
          case "cpu":
            return new je2(t[0], t[2], t[1]);
          case "gpu-buffer": {
            let e = t[0];
            if (!Nr(e)) throw new Error(`not supported data type: ${e} for deserializing GPU tensor`);
            let { gpuBuffer: r, download: n, dispose: o } = t[2];
            return je2.fromGpuBuffer(r, { dataType: e, dims: t[1], download: n, dispose: o });
          }
          case "ml-tensor": {
            let e = t[0];
            if (!Vr(e)) throw new Error(`not supported data type: ${e} for deserializing MLTensor tensor`);
            let { mlTensor: r, download: n, dispose: o } = t[2];
            return je2.fromMLTensor(r, { dataType: e, dims: t[1], download: n, dispose: o });
          }
          default:
            throw new Error(`invalid data location: ${t[3]}`);
        }
      }, bn = class {
        async fetchModelAndCopyToWasmMemory(e) {
          return Kc(await nr2(e));
        }
        async loadModel(e, r) {
          Ve2();
          let n;
          typeof e == "string" ? n = await this.fetchModelAndCopyToWasmMemory(e) : n = e, [this.sessionId, this.inputNames, this.outputNames, this.inputMetadata, this.outputMetadata] = await jc(n, r), Re();
        }
        async dispose() {
          return Zc(this.sessionId);
        }
        async run(e, r, n) {
          Ve2();
          let o = [], i = [];
          Object.entries(e).forEach((g) => {
            let y = g[0], b = g[1], _ = this.inputNames.indexOf(y);
            if (_ === -1) throw new Error(`invalid input '${y}'`);
            o.push(b), i.push(_);
          });
          let s = [], u = [];
          Object.entries(r).forEach((g) => {
            let y = g[0], b = g[1], _ = this.outputNames.indexOf(y);
            if (_ === -1) throw new Error(`invalid output '${y}'`);
            s.push(b), u.push(_);
          });
          let d = o.map((g, y) => Xc(g, () => `input "${this.inputNames[i[y]]}"`)), c = s.map((g, y) => g ? Xc(g, () => `output "${this.outputNames[u[y]]}"`) : null), p = await Qc(this.sessionId, i, d, u, c, n), m = {};
          for (let g = 0; g < p.length; g++) m[this.outputNames[u[g]]] = s[g] ?? Kb(p[g]);
          return Re(), m;
        }
        startProfiling() {
        }
        endProfiling() {
          Yc(this.sessionId);
        }
      };
    });
    tp = {};
    Vt2(tp, { OnnxruntimeWebAssemblyBackend: () => yn, initializeFlags: () => ep, wasmBackend: () => jb });
    rp = V(() => {
      Le2();
      No();
      Jc();
      ep = () => {
        (typeof _e.wasm.initTimeout != "number" || _e.wasm.initTimeout < 0) && (_e.wasm.initTimeout = 0);
        let t = _e.wasm.simd;
        if (typeof t != "boolean" && t !== void 0 && t !== "fixed" && t !== "relaxed" && (console.warn(`Property "env.wasm.simd" is set to unknown value "${t}". Reset it to \`false\` and ignore SIMD feature checking.`), _e.wasm.simd = false), typeof _e.wasm.proxy != "boolean" && (_e.wasm.proxy = false), typeof _e.wasm.trace != "boolean" && (_e.wasm.trace = false), typeof _e.wasm.numThreads != "number" || !Number.isInteger(_e.wasm.numThreads) || _e.wasm.numThreads <= 0) if (typeof self < "u" && !self.crossOriginIsolated) _e.wasm.numThreads = 1;
        else {
          let e = typeof navigator > "u" ? Gn("node:os").cpus().length : navigator.hardwareConcurrency;
          _e.wasm.numThreads = Math.min(4, Math.ceil((e || 1) / 2));
        }
      }, yn = class {
        async init(e) {
          ep(), await Fc(), await qc(e);
        }
        async createInferenceSessionHandler(e, r) {
          let n = new bn();
          return await n.loadModel(e, r), n;
        }
      }, jb = new yn();
    });
    Le2();
    Le2();
    Le2();
    as2 = "1.27.0";
    oT = Zn;
    {
      let t = (rp(), Xt2(tp)).wasmBackend;
      kt("webgpu", t, 5), kt("webnn", t, 5), kt("cpu", t, 10), kt("wasm", t, 10);
    }
    Object.defineProperty(_e.versions, "web", { value: as2, enumerable: true });
  }
});

// src/errors.ts
var DocLayoutError = class extends Error {
  constructor(code, message, details = {}, options) {
    super(message, options);
    this.code = code;
    this.details = details;
    this.name = "DocLayoutError";
  }
  code;
  details;
};

// src/model/manifest.ts
var CURRENT_SDK_VERSION = "1.2.0";
var SHA256_PATTERN = /^[0-9a-f]{64}$/i;
var VERSION_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;
var MODEL_BACKENDS = /* @__PURE__ */ new Set(["webgpu", "wasm"]);
var MODEL_PRECISIONS = /* @__PURE__ */ new Set(["fp32", "fp16", "int8"]);
function parseModelManifest(value) {
  const manifest2 = expectRecord(value, "manifest");
  if (manifest2.schemaVersion !== 1) {
    invalid("schemaVersion", "must be the supported version 1");
  }
  const minSdkVersion = expectString(manifest2.minSdkVersion, "minSdkVersion");
  const parsedMinimum = parseVersion(minSdkVersion, "minSdkVersion");
  const parsedCurrent = parseVersion(CURRENT_SDK_VERSION, "currentSdkVersion");
  if (compareVersions(parsedCurrent, parsedMinimum) < 0) {
    throw new DocLayoutError(
      "MODEL_INCOMPATIBLE",
      `Model requires SDK ${minSdkVersion} or newer; current SDK is ${CURRENT_SDK_VERSION}`,
      { currentSdkVersion: CURRENT_SDK_VERSION, minSdkVersion }
    );
  }
  validateModel(manifest2.model);
  validateTensor(manifest2.input, "input");
  validateOutputs(manifest2.outputs);
  validateLabels(manifest2.labels);
  validatePreprocessing(manifest2.preprocessing);
  validateSource(manifest2.source);
  const variants = validateVariants(manifest2.variants);
  validateVariantPriority(manifest2.variantPriority, variants);
  return value;
}
function validateModel(value) {
  const model = expectRecord(value, "model");
  expectString(model.architecture, "model.architecture");
  expectString(model.id, "model.id");
  expectString(model.modelType, "model.modelType");
  expectPositiveInteger(model.parameterCount, "model.parameterCount");
  parseVersion(expectString(model.version, "model.version"), "model.version");
}
function validateTensor(value, path) {
  const tensor = expectRecord(value, path);
  if (tensor.dtype !== "float32") {
    invalid(`${path}.dtype`, 'must be "float32"');
  }
  expectString(tensor.name, `${path}.name`);
  validateShape(tensor.shape, `${path}.shape`);
  return value;
}
function validateOutputs(value) {
  const outputs = expectArray(value, "outputs");
  if (outputs.length !== 4) {
    invalid("outputs", "must contain exactly four model outputs");
  }
  const names = /* @__PURE__ */ new Set();
  outputs.forEach((output, index) => {
    const tensor = validateTensor(output, `outputs[${index}]`);
    if (names.has(tensor.name)) {
      invalid(`outputs[${index}].name`, "must be unique");
    }
    names.add(tensor.name);
  });
}
function validateShape(value, path) {
  const shape = expectArray(value, path);
  if (shape.length === 0) {
    invalid(path, "must contain at least one dimension");
  }
  shape.forEach((dimension, index) => expectPositiveInteger(dimension, `${path}[${index}]`));
}
function validateLabels(value) {
  const labels = expectArray(value, "labels");
  if (labels.length === 0) {
    invalid("labels", "must contain at least one label");
  }
  labels.forEach((label, index) => expectString(label, `labels[${index}]`));
}
function validatePreprocessing(value) {
  const preprocessing = expectRecord(value, "preprocessing");
  expectBoolean(preprocessing.doNormalize, "preprocessing.doNormalize");
  expectBoolean(preprocessing.doRescale, "preprocessing.doRescale");
  expectBoolean(preprocessing.doResize, "preprocessing.doResize");
  expectNumberTuple(preprocessing.imageMean, "preprocessing.imageMean", false);
  expectNumberTuple(preprocessing.imageStd, "preprocessing.imageStd", true);
  expectNonNegativeInteger(preprocessing.resample, "preprocessing.resample");
  expectPositiveNumber(preprocessing.rescaleFactor, "preprocessing.rescaleFactor");
  const size = expectRecord(preprocessing.size, "preprocessing.size");
  expectPositiveInteger(size.height, "preprocessing.size.height");
  expectPositiveInteger(size.width, "preprocessing.size.width");
}
function validateSource(value) {
  const source = expectRecord(value, "source");
  const files = expectRecord(source.files, "source.files");
  const entries = Object.entries(files);
  if (entries.length === 0) {
    invalid("source.files", "must contain at least one source file digest");
  }
  for (const [filename, sha256] of entries) {
    expectString(filename, "source.files filename");
    expectSha256(sha256, `source.files.${filename}`);
  }
  expectString(source.license, "source.license");
  expectString(source.name, "source.name");
  expectHttpUrl(source.url, "source.url");
}
function validateVariants(value) {
  const variants = expectArray(value, "variants");
  if (variants.length === 0) {
    invalid("variants", "must contain at least one model variant");
  }
  const ids = /* @__PURE__ */ new Set();
  const coverage = /* @__PURE__ */ new Set();
  return variants.map((variant, index) => {
    const path = `variants[${index}]`;
    const parsed = expectRecord(variant, path);
    const id = expectString(parsed.id, `${path}.id`);
    if (ids.has(id)) {
      invalid(`${path}.id`, "must be unique");
    }
    ids.add(id);
    const precision = expectEnum(parsed.precision, `${path}.precision`, MODEL_PRECISIONS);
    const backends = expectArray(parsed.backendCompatibility, `${path}.backendCompatibility`);
    if (backends.length === 0) {
      invalid(`${path}.backendCompatibility`, "must contain at least one backend");
    }
    const variantBackends = /* @__PURE__ */ new Set();
    backends.forEach((backend, backendIndex) => {
      const parsedBackend = expectEnum(
        backend,
        `${path}.backendCompatibility[${backendIndex}]`,
        MODEL_BACKENDS
      );
      const pair = `${precision}:${parsedBackend}`;
      if (variantBackends.has(parsedBackend) || coverage.has(pair)) {
        invalid(path, `duplicates precision ${precision} and backend ${parsedBackend} coverage`);
      }
      variantBackends.add(parsedBackend);
      coverage.add(pair);
    });
    expectPositiveInteger(parsed.bytes, `${path}.bytes`);
    expectString(parsed.filename, `${path}.filename`);
    expectPositiveInteger(parsed.opset, `${path}.opset`);
    expectSha256(parsed.sha256, `${path}.sha256`);
    expectHttpUrl(parsed.url, `${path}.url`);
    validateVariantValidation(parsed.validation, `${path}.validation`);
    return variant;
  });
}
function validateVariantValidation(value, path) {
  const validation = expectRecord(value, path);
  expectBoolean(validation.included, `${path}.included`);
  expectBoolean(validation.pass, `${path}.pass`);
  expectString(validation.report, `${path}.report`);
}
function validateVariantPriority(value, variants) {
  const priority = expectArray(value, "variantPriority");
  if (priority.length !== variants.length) {
    invalid("variantPriority", "must list every model variant exactly once");
  }
  const variantIds = new Set(variants.map((variant) => variant.id));
  const priorityIds = /* @__PURE__ */ new Set();
  priority.forEach((id, index) => {
    const parsedId = expectString(id, `variantPriority[${index}]`);
    if (!variantIds.has(parsedId) || priorityIds.has(parsedId)) {
      invalid(`variantPriority[${index}]`, "must identify a unique declared model variant");
    }
    priorityIds.add(parsedId);
  });
}
function expectRecord(value, path) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    invalid(path, "must be an object");
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    invalid(path, "must be a plain object");
  }
  return value;
}
function expectArray(value, path) {
  if (!Array.isArray(value)) {
    invalid(path, "must be an array");
  }
  return value;
}
function expectString(value, path) {
  if (typeof value !== "string" || value.length === 0 || value.trim() !== value) {
    invalid(path, "must be a non-empty string without surrounding whitespace");
  }
  return value;
}
function expectBoolean(value, path) {
  if (typeof value !== "boolean") {
    invalid(path, "must be a boolean");
  }
  return value;
}
function expectPositiveInteger(value, path) {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) {
    invalid(path, "must be a positive safe integer");
  }
  return value;
}
function expectNonNegativeInteger(value, path) {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    invalid(path, "must be a non-negative safe integer");
  }
  return value;
}
function expectPositiveNumber(value, path) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    invalid(path, "must be a positive finite number");
  }
  return value;
}
function expectNumberTuple(value, path, nonZero) {
  const numbers = expectArray(value, path);
  if (numbers.length !== 3) {
    invalid(path, "must contain exactly three numbers");
  }
  numbers.forEach((number, index) => {
    if (typeof number !== "number" || !Number.isFinite(number) || nonZero && number === 0) {
      invalid(`${path}[${index}]`, `must be a finite${nonZero ? " non-zero" : ""} number`);
    }
  });
}
function expectSha256(value, path) {
  if (typeof value !== "string" || !SHA256_PATTERN.test(value)) {
    invalid(path, "must be a 64-character hexadecimal SHA-256 digest");
  }
  return value;
}
function expectHttpUrl(value, path) {
  const url = expectString(value, path);
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    invalid(path, "must be a valid HTTP(S) URL");
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:" || parsed.username || parsed.password) {
    invalid(path, "must be a safe HTTP(S) URL without credentials");
  }
  return url;
}
function expectEnum(value, path, values) {
  if (typeof value !== "string" || !values.has(value)) {
    invalid(path, `must be one of ${[...values].join(", ")}`);
  }
  return value;
}
function parseVersion(value, path) {
  const match = VERSION_PATTERN.exec(value);
  if (match === null) {
    invalid(path, "must be a valid semantic version");
  }
  const prerelease = match[4]?.split(".").map((identifier) => {
    if (/^\d+$/.test(identifier)) {
      if (identifier.length > 1 && identifier.startsWith("0")) {
        invalid(path, "must be a valid semantic version");
      }
      return Number(identifier);
    }
    return identifier;
  });
  return [Number(match[1]), Number(match[2]), Number(match[3]), prerelease ?? []];
}
function compareVersions(left, right) {
  for (let index = 0; index < 3; index += 1) {
    if (left[index] !== right[index]) {
      return left[index] < right[index] ? -1 : 1;
    }
  }
  const leftPrerelease = left[3];
  const rightPrerelease = right[3];
  if (leftPrerelease.length === 0 || rightPrerelease.length === 0) {
    return leftPrerelease.length === rightPrerelease.length ? 0 : leftPrerelease.length === 0 ? 1 : -1;
  }
  for (let index = 0; index < Math.max(leftPrerelease.length, rightPrerelease.length); index += 1) {
    const leftIdentifier = leftPrerelease[index];
    const rightIdentifier = rightPrerelease[index];
    if (leftIdentifier === void 0 || rightIdentifier === void 0) {
      return leftIdentifier === rightIdentifier ? 0 : leftIdentifier === void 0 ? -1 : 1;
    }
    if (leftIdentifier === rightIdentifier) {
      continue;
    }
    if (typeof leftIdentifier === "number" && typeof rightIdentifier === "string") {
      return -1;
    }
    if (typeof leftIdentifier === "string" && typeof rightIdentifier === "number") {
      return 1;
    }
    return leftIdentifier < rightIdentifier ? -1 : 1;
  }
  return 0;
}
function invalid(path, message) {
  throw new DocLayoutError("MANIFEST_INVALID", `Invalid model manifest: ${path} ${message}`, {
    path
  });
}

// src/postprocess.ts
var CONTOUR_EPSILON_RATIO = 4e-3;
var MASK_OUTPUT_STRIDE = 4;
function inferenceError(message, details = {}) {
  return new DocLayoutError("INFERENCE_FAILED", message, details);
}
function tensorLength(dims) {
  return dims.reduce((product, value) => product * value, 1);
}
function assertTensor(name, tensor, expected) {
  const dimensionsMatch = tensor.dims.length === expected.length && tensor.dims.every((dimension, index) => dimension === expected[index]);
  if (!dimensionsMatch || tensor.data.length !== tensorLength(tensor.dims)) {
    throw inferenceError(`Output tensor ${name} has an incompatible shape`, {
      actualShape: tensor.dims,
      dataLength: tensor.data.length,
      expectedShape: expected,
      name
    });
  }
}
function validateOutputs2(outputs, labels) {
  const [batch, queries, classes] = outputs.logits.dims;
  const [, maskQueries, maskHeight, maskWidth] = outputs.outMasks.dims;
  if (batch !== 1 || queries === void 0 || classes === void 0 || !Number.isInteger(queries) || !Number.isInteger(classes) || queries <= 0 || classes <= 0 || maskQueries !== queries || maskHeight === void 0 || maskWidth === void 0 || maskHeight <= 0 || maskWidth <= 0) {
    throw inferenceError("PP-DocLayoutV3 output tensor dimensions are invalid", {
      logitsShape: outputs.logits.dims,
      masksShape: outputs.outMasks.dims
    });
  }
  if (labels.length !== classes) {
    throw inferenceError("Manifest labels do not match the model class dimension", {
      classes,
      labels: labels.length
    });
  }
  assertTensor("logits", outputs.logits, [1, queries, classes]);
  assertTensor("pred_boxes", outputs.predBoxes, [1, queries, 4]);
  assertTensor("order_logits", outputs.orderLogits, [1, queries, queries]);
  assertTensor("out_masks", outputs.outMasks, [1, queries, maskHeight, maskWidth]);
  return { classes, maskHeight, maskWidth, queries };
}
function validateThreshold(threshold, message, details) {
  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 1) {
    throw inferenceError(message, details);
  }
}
function validateOptions(options) {
  const global = options.threshold ?? 0.5;
  validateThreshold(global, "Detection threshold must be between zero and one", {
    threshold: global
  });
  const classes = options.classThresholds ?? {};
  for (const [label, threshold] of Object.entries(classes)) {
    if (!options.labels.includes(label)) {
      throw inferenceError("Class threshold specifies an unknown manifest label", { label });
    }
    validateThreshold(threshold, "Class threshold must be between zero and one", {
      label,
      threshold
    });
  }
  for (const [name, size] of [
    ["input", options.inputSize],
    ["target", options.targetSize]
  ]) {
    if (!Number.isFinite(size.width) || !Number.isFinite(size.height) || size.width <= 0 || size.height <= 0) {
      throw inferenceError(`${name} image dimensions are invalid`, { ...size });
    }
  }
  return { classes, global };
}
function sigmoid(value) {
  if (value >= 0) {
    return 1 / (1 + Math.exp(-value));
  }
  const exponential = Math.exp(value);
  return exponential / (1 + exponential);
}
function selectCandidates(logits, queries, classes) {
  const candidates = new Array(queries * classes);
  for (let flatIndex = 0; flatIndex < candidates.length; flatIndex += 1) {
    candidates[flatIndex] = {
      flatIndex,
      labelId: flatIndex % classes,
      query: Math.floor(flatIndex / classes),
      score: sigmoid(logits[flatIndex])
    };
  }
  candidates.sort((left, right) => right.score - left.score || left.flatIndex - right.flatIndex);
  return candidates.slice(0, queries);
}
function readingOrderRanks(orderLogits, queries) {
  const votes = new Float64Array(queries);
  for (let query = 0; query < queries; query += 1) {
    let vote = 0;
    for (let previous = 0; previous < query; previous += 1) {
      vote += sigmoid(orderLogits[previous * queries + query]);
    }
    for (let next = query + 1; next < queries; next += 1) {
      vote += 1 - sigmoid(orderLogits[query * queries + next]);
    }
    votes[query] = vote;
  }
  const pointers = Array.from({ length: queries }, (_, query) => query).sort(
    (left, right) => votes[left] - votes[right] || left - right
  );
  const ranks = new Int32Array(queries);
  pointers.forEach((query, rank) => {
    ranks[query] = rank;
  });
  return ranks;
}
function boxForQuery(predBoxes, query, targetSize) {
  const offset = query * 4;
  const centerX = predBoxes[offset];
  const centerY = predBoxes[offset + 1];
  const width = predBoxes[offset + 2];
  const height = predBoxes[offset + 3];
  const halfWidth = Math.fround(width * 0.5);
  const halfHeight = Math.fround(height * 0.5);
  return {
    xMax: Math.fround(Math.fround(centerX + halfWidth) * targetSize.width),
    xMin: Math.fround(Math.fround(centerX - halfWidth) * targetSize.width),
    yMax: Math.fround(Math.fround(centerY + halfHeight) * targetSize.height),
    yMin: Math.fround(Math.fround(centerY - halfHeight) * targetSize.height)
  };
}
function bankersRound(value) {
  const floor = Math.floor(value);
  const fraction = value - floor;
  if (fraction < 0.5) return floor;
  if (fraction > 0.5) return floor + 1;
  return floor % 2 === 0 ? floor : floor + 1;
}
function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}
function rectangle(box) {
  const xMin = Math.trunc(box.xMin);
  const yMin = Math.trunc(box.yMin);
  const xMax = Math.trunc(box.xMax);
  const yMax = Math.trunc(box.yMax);
  return [
    { x: xMin, y: yMin },
    { x: xMax, y: yMin },
    { x: xMax, y: yMax },
    { x: xMin, y: yMax }
  ];
}
function cropAndResizeMask(tensor, shape, query, box, options, threshold) {
  const xMin = Math.trunc(box.xMin);
  const yMin = Math.trunc(box.yMin);
  const xMax = Math.trunc(box.xMax);
  const yMax = Math.trunc(box.yMax);
  const boxWidth = xMax - xMin;
  const boxHeight = yMax - yMin;
  if (boxWidth <= 0 || boxHeight <= 0) return void 0;
  const scaleWidth = options.inputSize.width / options.targetSize.width / MASK_OUTPUT_STRIDE;
  const scaleHeight = options.inputSize.height / options.targetSize.height / MASK_OUTPUT_STRIDE;
  const xStart = clamp(bankersRound(xMin * scaleWidth), 0, shape.maskWidth);
  const xEnd = clamp(bankersRound(xMax * scaleWidth), 0, shape.maskWidth);
  const yStart = clamp(bankersRound(yMin * scaleHeight), 0, shape.maskHeight);
  const yEnd = clamp(bankersRound(yMax * scaleHeight), 0, shape.maskHeight);
  const cropWidth = xEnd - xStart;
  const cropHeight = yEnd - yStart;
  if (cropWidth <= 0 || cropHeight <= 0) return void 0;
  const maskPlane = shape.maskWidth * shape.maskHeight;
  const maskOffset = query * maskPlane;
  const cropped = new Uint8Array(cropWidth * cropHeight);
  let hasForeground = false;
  for (let y = 0; y < cropHeight; y += 1) {
    for (let x = 0; x < cropWidth; x += 1) {
      const value = sigmoid(tensor.data[maskOffset + (yStart + y) * shape.maskWidth + xStart + x]) > threshold ? 1 : 0;
      cropped[y * cropWidth + x] = value;
      hasForeground ||= value === 1;
    }
  }
  if (!hasForeground) return void 0;
  const resized = new Uint8Array(boxWidth * boxHeight);
  for (let y = 0; y < boxHeight; y += 1) {
    const sourceY = Math.floor(y * cropHeight / boxHeight);
    for (let x = 0; x < boxWidth; x += 1) {
      const sourceX = Math.floor(x * cropWidth / boxWidth);
      resized[y * boxWidth + x] = cropped[sourceY * cropWidth + sourceX];
    }
  }
  return resized;
}
var TRACE_DIRECTIONS = [
  { x: 1, y: 0 },
  { x: 1, y: -1 },
  { x: 0, y: -1 },
  { x: -1, y: -1 },
  { x: -1, y: 0 },
  { x: -1, y: 1 },
  { x: 0, y: 1 },
  { x: 1, y: 1 }
];
function isForeground(mask, width, height, x, y) {
  return x >= 0 && y >= 0 && x < width && y < height && mask[y * width + x] === 1;
}
function directionIndex(from, to2) {
  const dx = clamp(to2.x - from.x, -1, 1);
  const dy = clamp(to2.y - from.y, -1, 1);
  return TRACE_DIRECTIONS.findIndex((direction) => direction.x === dx && direction.y === dy);
}
function traceContour(mask, width, height, startIndex) {
  const start = { x: startIndex % width, y: Math.floor(startIndex / width) };
  let current = start;
  let backtrack = { x: start.x - 1, y: start.y };
  let firstNext;
  const points = [start];
  const maximumSteps = mask.length * 8;
  for (let step = 0; step < maximumSteps; step += 1) {
    const backtrackDirection = directionIndex(current, backtrack);
    let next;
    let nextBacktrack;
    for (let scan = 1; scan <= 8; scan += 1) {
      const direction = TRACE_DIRECTIONS[(backtrackDirection + scan + 8) % 8];
      const candidate = { x: current.x + direction.x, y: current.y + direction.y };
      if (isForeground(mask, width, height, candidate.x, candidate.y)) {
        next = candidate;
        const previousDirection = TRACE_DIRECTIONS[(backtrackDirection + scan - 1 + 8) % 8];
        nextBacktrack = {
          x: current.x + previousDirection.x,
          y: current.y + previousDirection.y
        };
        break;
      }
    }
    if (next === void 0 || nextBacktrack === void 0) return points;
    if (firstNext === void 0) {
      firstNext = next;
    } else if (current.x === start.x && current.y === start.y && next.x === firstNext.x && next.y === firstNext.y) {
      break;
    }
    points.push(next);
    current = next;
    backtrack = nextBacktrack;
  }
  const last = points.at(-1);
  if (last !== void 0 && last.x === start.x && last.y === start.y) points.pop();
  return points;
}
function chainApproxSimple(points) {
  if (points.length <= 2) return [...points];
  const result = [];
  for (let index = 0; index < points.length; index += 1) {
    const previous = points[(index - 1 + points.length) % points.length];
    const current = points[index];
    const next = points[(index + 1) % points.length];
    const incomingX = Math.sign(current.x - previous.x);
    const incomingY = Math.sign(current.y - previous.y);
    const outgoingX = Math.sign(next.x - current.x);
    const outgoingY = Math.sign(next.y - current.y);
    if (incomingX !== outgoingX || incomingY !== outgoingY) result.push(current);
  }
  return result;
}
function polygonArea(points) {
  let area = 0;
  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    area += current.x * next.y - next.x * current.y;
  }
  return Math.abs(area) * 0.5;
}
function arcLength(points) {
  let length = 0;
  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    length += Math.hypot(next.x - current.x, next.y - current.y);
  }
  return length;
}
function pointSegmentDistance(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  if (dx === 0 && dy === 0) return Math.hypot(point.x - start.x, point.y - start.y);
  const projection = clamp(
    ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy),
    0,
    1
  );
  return Math.hypot(point.x - (start.x + projection * dx), point.y - (start.y + projection * dy));
}
function simplifyOpen(points, epsilon) {
  if (points.length <= 2) return [...points];
  const first = points[0];
  const last = points.at(-1);
  let maximumDistance = -1;
  let split = -1;
  for (let index = 1; index < points.length - 1; index += 1) {
    const distance = pointSegmentDistance(points[index], first, last);
    if (distance > maximumDistance) {
      maximumDistance = distance;
      split = index;
    }
  }
  if (maximumDistance <= epsilon || split < 0) return [first, last];
  const left = simplifyOpen(points.slice(0, split + 1), epsilon);
  const right = simplifyOpen(points.slice(split), epsilon);
  return [...left.slice(0, -1), ...right];
}
function simplifyClosed(points, epsilon) {
  if (points.length <= 4) return [...points];
  let startIndex = 0;
  let endIndex = 0;
  for (let iteration = 0; iteration < 3; iteration += 1) {
    const start = points[startIndex];
    let maximumDistance = -1;
    for (let index = 0; index < points.length; index += 1) {
      const point = points[index];
      const distance = (point.x - start.x) ** 2 + (point.y - start.y) ** 2;
      if (distance > maximumDistance) {
        maximumDistance = distance;
        endIndex = index;
      }
    }
    if (iteration < 2) startIndex = endIndex;
  }
  const cyclicArc = (from, to2) => {
    const result = [];
    let index = from;
    for (; ; ) {
      result.push(points[index]);
      if (index === to2) return result;
      index = (index + 1) % points.length;
    }
  };
  const firstArc = simplifyOpen(cyclicArc(startIndex, endIndex), epsilon);
  const secondArc = simplifyOpen(cyclicArc(endIndex, startIndex), epsilon);
  return [...firstArc.slice(0, -1), ...secondArc.slice(0, -1)];
}
function largestExternalContour(mask, width, height) {
  const visited = new Uint8Array(mask.length);
  const queue = new Int32Array(mask.length);
  let largest;
  let largestArea = -1;
  for (let start = 0; start < mask.length; start += 1) {
    if (mask[start] !== 1 || visited[start] === 1) continue;
    let head = 0;
    let tail = 0;
    let contourStart = start;
    queue[tail++] = start;
    visited[start] = 1;
    while (head < tail) {
      const index = queue[head++];
      if (index < contourStart) contourStart = index;
      const x = index % width;
      const y = Math.floor(index / width);
      for (const direction of TRACE_DIRECTIONS) {
        const nextX = x + direction.x;
        const nextY = y + direction.y;
        if (!isForeground(mask, width, height, nextX, nextY)) continue;
        const next = nextY * width + nextX;
        if (visited[next] === 0) {
          visited[next] = 1;
          queue[tail++] = next;
        }
      }
    }
    const contour = chainApproxSimple(traceContour(mask, width, height, contourStart));
    const area = polygonArea(contour);
    if (area > largestArea) {
      largest = contour;
      largestArea = area;
    }
  }
  return largest;
}
function extractCustomVertices(points) {
  const result = [];
  for (let index = 0; index < points.length; index += 1) {
    const previous = points[(index - 1 + points.length) % points.length];
    const current = points[index];
    const next = points[(index + 1) % points.length];
    const first = { x: previous.x - current.x, y: previous.y - current.y };
    const second = { x: next.x - current.x, y: next.y - current.y };
    const cross = first.y * second.x - first.x * second.y;
    if (cross >= 0) continue;
    const firstLength = Math.hypot(first.x, first.y);
    const secondLength = Math.hypot(second.x, second.y);
    const cosine = clamp(
      (first.x * second.x + first.y * second.y) / (firstLength * secondLength),
      -1,
      1
    );
    const angle = Math.acos(cosine) * 180 / Math.PI;
    if (Math.abs(angle - 45) >= 1) {
      result.push(current);
      continue;
    }
    let directionX = first.x / firstLength + second.x / secondLength;
    let directionY = first.y / firstLength + second.y / secondLength;
    const directionLength = Math.hypot(directionX, directionY);
    directionX /= directionLength;
    directionY /= directionLength;
    const step = (firstLength + secondLength) / 2;
    result.push({ x: current.x + directionX * step, y: current.y + directionY * step });
  }
  return result;
}
function polygonForCandidate(outputs, shape, candidate, options, threshold) {
  const fallback = rectangle(candidate.box);
  const resized = cropAndResizeMask(
    outputs.outMasks,
    shape,
    candidate.query,
    candidate.box,
    options,
    threshold
  );
  if (resized === void 0) return fallback;
  const boxWidth = Math.trunc(candidate.box.xMax) - Math.trunc(candidate.box.xMin);
  const boxHeight = Math.trunc(candidate.box.yMax) - Math.trunc(candidate.box.yMin);
  const contour = largestExternalContour(resized, boxWidth, boxHeight);
  if (contour === void 0) return fallback;
  const simplified = simplifyClosed(contour, CONTOUR_EPSILON_RATIO * arcLength(contour));
  const vertices = extractCustomVertices(simplified);
  if (vertices.length < 4) return fallback;
  const offsetX = Math.trunc(candidate.box.xMin);
  const offsetY = Math.trunc(candidate.box.yMin);
  return vertices.map(({ x, y }) => ({ x: x + offsetX, y: y + offsetY }));
}
function postprocessDetections(outputs, options) {
  const thresholds = validateOptions(options);
  const shape = validateOutputs2(outputs, options.labels);
  const ranks = readingOrderRanks(outputs.orderLogits.data, shape.queries);
  const candidates = selectCandidates(outputs.logits.data, shape.queries, shape.classes).filter((candidate) => {
    const label = options.labels[candidate.labelId];
    const threshold = Object.hasOwn(thresholds.classes, label) ? thresholds.classes[label] : thresholds.global;
    return candidate.score >= threshold;
  }).map((candidate) => ({
    ...candidate,
    box: boxForQuery(outputs.predBoxes.data, candidate.query, options.targetSize),
    order: ranks[candidate.query]
  })).sort((left, right) => left.order - right.order || right.score - left.score);
  return candidates.map((candidate, index) => ({
    box: candidate.box,
    label: options.labels[candidate.labelId],
    labelId: candidate.labelId,
    polygon: polygonForCandidate(outputs, shape, candidate, options, thresholds.global),
    readingOrder: index + 1,
    score: candidate.score
  }));
}

// src/preprocess.ts
var CUBIC_A = -0.75;
function throwIfAborted(signal) {
  if (signal?.aborted) {
    throw new DocLayoutError("ABORTED", "Image preprocessing was aborted", {
      reason: signal.reason
    });
  }
}
function cubicWeight(distance) {
  const value = Math.abs(distance);
  if (value <= 1) {
    return (CUBIC_A + 2) * value ** 3 - (CUBIC_A + 3) * value ** 2 + 1;
  }
  if (value < 2) {
    return CUBIC_A * value ** 3 - 5 * CUBIC_A * value ** 2 + 8 * CUBIC_A * value - 4 * CUBIC_A;
  }
  return 0;
}
function buildAxisSamples(sourceSize, targetSize) {
  const scale = sourceSize / targetSize;
  return Array.from({ length: targetSize }, (_, target) => {
    const source = (target + 0.5) * scale - 0.5;
    const base = Math.floor(source);
    const indices = [-1, 0, 1, 2].map(
      (offset) => Math.min(sourceSize - 1, Math.max(0, base + offset))
    );
    const weights = [-1, 0, 1, 2].map(
      (offset) => cubicWeight(source - (base + offset))
    );
    return { indices, weights };
  });
}
function saturateUint8(value) {
  return Math.min(255, Math.max(0, Math.round(value)));
}
function resizedChannel(raster, channel, targetWidth, targetHeight, signal) {
  const xSamples = buildAxisSamples(raster.width, targetWidth);
  const ySamples = buildAxisSamples(raster.height, targetHeight);
  const horizontal = new Float64Array(raster.height * targetWidth);
  for (let y = 0; y < raster.height; y += 1) {
    throwIfAborted(signal);
    for (let x = 0; x < targetWidth; x += 1) {
      const sample = xSamples[x];
      let value = 0;
      for (let index = 0; index < 4; index += 1) {
        value += raster.rgba[(y * raster.width + sample.indices[index]) * 4 + channel] * sample.weights[index];
      }
      horizontal[y * targetWidth + x] = saturateUint8(value);
    }
  }
  const resized = new Float64Array(targetWidth * targetHeight);
  for (let y = 0; y < targetHeight; y += 1) {
    throwIfAborted(signal);
    const sample = ySamples[y];
    for (let x = 0; x < targetWidth; x += 1) {
      let value = 0;
      for (let index = 0; index < 4; index += 1) {
        value += horizontal[sample.indices[index] * targetWidth + x] * sample.weights[index];
      }
      resized[y * targetWidth + x] = saturateUint8(value);
    }
  }
  return resized;
}
function validateRaster(raster) {
  if (raster.width <= 0 || raster.height <= 0 || raster.rgba.length !== raster.width * raster.height * 4) {
    throw new DocLayoutError("IMAGE_INVALID", "Image raster dimensions or pixel data are invalid", {
      height: raster.height,
      rgbaLength: raster.rgba.length,
      width: raster.width
    });
  }
}
function preprocessRaster(raster, config, options = {}) {
  throwIfAborted(options.signal);
  validateRaster(raster);
  const targetHeight = config.doResize ? config.size.height : raster.height;
  const targetWidth = config.doResize ? config.size.width : raster.width;
  if (targetWidth <= 0 || targetHeight <= 0) {
    throw new DocLayoutError("IMAGE_INVALID", "Preprocessing target dimensions are invalid", {
      height: targetHeight,
      width: targetWidth
    });
  }
  const plane = targetWidth * targetHeight;
  const data = new Float32Array(plane * 3);
  for (let channel = 0; channel < 3; channel += 1) {
    const pixels = config.doResize ? resizedChannel(raster, channel, targetWidth, targetHeight, options.signal) : void 0;
    const mean = config.imageMean[channel];
    const std = config.imageStd[channel];
    if (config.doNormalize && std === 0) {
      throw new DocLayoutError(
        "MANIFEST_INVALID",
        "Image normalization standard deviation is zero",
        {
          channel
        }
      );
    }
    for (let index = 0; index < plane; index += 1) {
      const source = pixels?.[index] ?? raster.rgba[index * 4 + channel];
      const rescaled = config.doRescale ? source * config.rescaleFactor : source;
      data[channel * plane + index] = config.doNormalize ? (rescaled - mean) / std : rescaled;
    }
  }
  throwIfAborted(options.signal);
  return {
    data,
    dims: [1, 3, targetHeight, targetWidth],
    originalSize: { height: raster.height, width: raster.width }
  };
}

// src/runtime/capabilities.ts
var SIMD_PROBE = new Uint8Array([
  0,
  97,
  115,
  109,
  1,
  0,
  0,
  0,
  1,
  4,
  1,
  96,
  0,
  0,
  3,
  2,
  1,
  0,
  10,
  30,
  1,
  28,
  0,
  65,
  0,
  253,
  15,
  253,
  12,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  253,
  186,
  1,
  26,
  11
]);
var THREADS_PROBE = new Uint8Array([
  0,
  97,
  115,
  109,
  1,
  0,
  0,
  0,
  1,
  4,
  1,
  96,
  0,
  0,
  3,
  2,
  1,
  0,
  5,
  4,
  1,
  3,
  1,
  1,
  10,
  11,
  1,
  9,
  0,
  65,
  0,
  254,
  16,
  2,
  0,
  26,
  11
]);
async function probeCapabilities(environment, options = {}) {
  const runtime = environment ?? readGlobalEnvironment();
  throwIfAborted2(options.signal);
  const diagnostics = [];
  let adapter = null;
  if (runtime.requestAdapter === void 0) {
    diagnostics.push("webgpu: unavailable because navigator.gpu is missing");
  } else {
    try {
      adapter = await abortable(runtime.requestAdapter(), options.signal);
      diagnostics.push(
        adapter === null ? "webgpu: unavailable because no adapter was returned" : "webgpu: supported by an acquired adapter"
      );
    } catch (error) {
      if (error instanceof DocLayoutError && error.code === "ABORTED") {
        throw error;
      }
      diagnostics.push(`webgpu: adapter request failed (${errorMessage(error)})`);
    }
  }
  const webgpu = adapter !== null;
  const webgpuFp16 = adapter?.features.has("shader-f16") === true;
  diagnostics.push(
    webgpuFp16 ? "webgpu-fp16: shader-f16 is supported" : "webgpu-fp16: shader-f16 is unavailable"
  );
  const wasm = runtime.wasm ?? runtime.validateWasm !== void 0;
  const wasmSimd = wasm && validateFeature(runtime.validateWasm, SIMD_PROBE);
  const wasmThreads = wasm && runtime.crossOriginIsolated && runtime.sharedArrayBuffer && validateFeature(runtime.validateWasm, THREADS_PROBE);
  diagnostics.push(wasm ? "wasm: supported" : "wasm: unavailable");
  diagnostics.push(wasmSimd ? "wasm-simd: supported" : "wasm-simd: unavailable");
  diagnostics.push(
    wasmThreads ? "wasm-threads: supported" : "wasm-threads: unavailable (requires shared memory and cross-origin isolation)"
  );
  diagnostics.push(
    runtime.worker ? "worker: supported" : "worker: unavailable in this environment"
  );
  return {
    crossOriginIsolated: runtime.crossOriginIsolated,
    diagnostics,
    wasm,
    wasmSimd,
    wasmThreads,
    webgpu,
    webgpuFp16,
    worker: runtime.worker
  };
}
function readGlobalEnvironment() {
  const runtimeNavigator = globalThis.navigator;
  const wasm = typeof WebAssembly === "object";
  return {
    crossOriginIsolated: globalThis.crossOriginIsolated === true,
    ...runtimeNavigator.gpu === void 0 ? {} : {
      requestAdapter: () => runtimeNavigator.gpu.requestAdapter({ powerPreference: "high-performance" })
    },
    sharedArrayBuffer: typeof SharedArrayBuffer === "function",
    ...wasm ? { validateWasm: (bytes) => WebAssembly.validate(bytes) } : {},
    wasm,
    worker: typeof Worker === "function"
  };
}
function validateFeature(validateWasm, bytes) {
  if (validateWasm === void 0) {
    return false;
  }
  try {
    return validateWasm(bytes);
  } catch {
    return false;
  }
}
function abortable(promise, signal) {
  if (signal === void 0) {
    return promise;
  }
  throwIfAborted2(signal);
  return new Promise((resolve, reject) => {
    const onAbort = () => reject(aborted(signal));
    signal.addEventListener("abort", onAbort, { once: true });
    promise.then(
      (value) => {
        signal.removeEventListener("abort", onAbort);
        resolve(value);
      },
      (error) => {
        signal.removeEventListener("abort", onAbort);
        reject(
          error instanceof Error ? error : new Error("WebGPU adapter request failed", { cause: error })
        );
      }
    );
  });
}
function throwIfAborted2(signal) {
  if (signal?.aborted === true) {
    throw aborted(signal);
  }
}
function aborted(signal) {
  return new DocLayoutError("ABORTED", "Capability probing was aborted", {
    reason: signal.reason ?? "aborted"
  });
}
function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

// src/runtime/ort-session.ts
var OUTPUT_ROLES = ["logits", "predBoxes", "orderLogits", "outMasks"];
var MAX_WASM_THREADS = 4;
function nowDefault() {
  return typeof performance === "object" ? performance.now() : Date.now();
}
async function defaultOrt(provider) {
  return provider === "webgpu" ? await Promise.resolve().then(() => (init_ort_webgpu_bundle_min(), ort_webgpu_bundle_min_exports)) : await Promise.resolve().then(() => (init_ort_bundle_min(), ort_bundle_min_exports));
}
function abortError(signal) {
  return new DocLayoutError("ABORTED", "ONNX inference was aborted", {
    reason: signal.reason ?? "aborted"
  });
}
function throwIfAborted3(signal) {
  if (signal?.aborted === true) throw abortError(signal);
}
function isOutOfMemory(error) {
  const message = error instanceof Error ? error.message : String(error);
  return /out of memory|failed to allocate|memory allocation|array buffer allocation failed|\boom\b/i.test(
    message
  );
}
function mapRuntimeError(error, stage, provider) {
  if (error instanceof DocLayoutError) return error;
  const code = isOutOfMemory(error) ? "OUT_OF_MEMORY" : stage === "session-create" ? "SESSION_CREATE_FAILED" : "INFERENCE_FAILED";
  const causeMessage = error instanceof Error ? error.message : String(error);
  return new DocLayoutError(
    code,
    `ONNX ${stage} failed for ${provider}`,
    { causeMessage, provider, stage },
    { cause: error }
  );
}
function sessionOptions(provider) {
  return {
    executionProviders: provider === "webgpu" ? [{ name: "webgpu", preferredLayout: "NCHW" }] : ["wasm"],
    executionMode: "sequential",
    graphOptimizationLevel: "all"
  };
}
function configureWasm(ort, options) {
  if (options.wasm?.paths !== void 0) ort.env.wasm.wasmPaths = options.wasm.paths;
  if (options.provider !== "wasm") return;
  const hardwareConcurrency = Math.max(
    1,
    Math.floor(options.hardwareConcurrency ?? globalThis.navigator?.hardwareConcurrency ?? 1)
  );
  ort.env.wasm.numThreads = options.capabilities.wasmThreads ? Math.min(
    MAX_WASM_THREADS,
    options.wasm?.numThreads ?? Math.max(1, Math.ceil(hardwareConcurrency / 2))
  ) : 1;
  ort.env.wasm.simd = options.capabilities.wasmSimd;
}
function copyTensor(name, tensor) {
  if (tensor === void 0 || !(tensor.data instanceof Float32Array)) {
    throw new DocLayoutError("INFERENCE_FAILED", `ONNX output ${name} is missing or not float32`, {
      name
    });
  }
  return { data: new Float32Array(tensor.data), dims: [...tensor.dims] };
}
function copyOutputs(raw, specs) {
  if (specs.length !== OUTPUT_ROLES.length) {
    throw new DocLayoutError("INFERENCE_FAILED", "PP-DocLayoutV3 requires exactly four outputs", {
      outputs: specs.length
    });
  }
  return Object.fromEntries(
    OUTPUT_ROLES.map((role, index) => {
      const name = specs[index].name;
      return [role, copyTensor(name, raw[name])];
    })
  );
}
function disposeOutputs(outputs) {
  const disposed = /* @__PURE__ */ new Set();
  for (const output of Object.values(outputs)) {
    if (output !== void 0 && !disposed.has(output)) {
      disposed.add(output);
      output.dispose();
    }
  }
}
async function createOrtSession(options) {
  const ort = options.ort ?? await defaultOrt(options.provider);
  const now = options.now ?? nowDefault;
  configureWasm(ort, options);
  const startedAt = now();
  let session2;
  try {
    session2 = await ort.InferenceSession.create(
      options.modelBytes,
      sessionOptions(options.provider)
    );
  } catch (error) {
    throw mapRuntimeError(error, "session-create", options.provider);
  }
  const sessionCreateMs = Math.max(0, now() - startedAt);
  let disposed = false;
  let releasePromise;
  return {
    provider: options.provider,
    sessionCreateMs,
    dispose() {
      if (releasePromise !== void 0) return releasePromise;
      disposed = true;
      releasePromise = session2.release();
      return releasePromise;
    },
    async run(data, dims, runOptions = {}) {
      if (disposed) {
        throw new DocLayoutError("INFERENCE_FAILED", "ONNX session has been disposed", {
          disposed: true
        });
      }
      throwIfAborted3(runOptions.signal);
      const input = new ort.Tensor("float32", data, dims);
      const ortRunOptions = {};
      const onAbort = () => {
        ortRunOptions.terminate = true;
      };
      runOptions.signal?.addEventListener("abort", onAbort, { once: true });
      const inferenceStartedAt = now();
      let rawOutputs;
      try {
        rawOutputs = await session2.run({ [options.input.name]: input }, ortRunOptions);
        throwIfAborted3(runOptions.signal);
        return {
          inferenceMs: Math.max(0, now() - inferenceStartedAt),
          outputs: copyOutputs(rawOutputs, options.outputs)
        };
      } catch (error) {
        if (runOptions.signal?.aborted === true) throw abortError(runOptions.signal);
        throw mapRuntimeError(error, "inference", options.provider);
      } finally {
        runOptions.signal?.removeEventListener("abort", onAbort);
        input.dispose();
        if (rawOutputs !== void 0) disposeOutputs(rawOutputs);
      }
    }
  };
}

// src/worker/inference.worker.ts
var scope = globalThis;
var controllers = /* @__PURE__ */ new Map();
var manifest;
var session;
function post(message) {
  scope.postMessage(message);
}
function progress(requestId, phase, status) {
  post({ phase, requestId, status, type: "progress" });
}
function serializeError(error) {
  if (error instanceof DocLayoutError) {
    return {
      code: error.code,
      details: error.details,
      message: error.message,
      name: error.name
    };
  }
  return {
    code: "INFERENCE_FAILED",
    details: {},
    message: error instanceof Error ? error.message : String(error),
    name: error instanceof Error ? error.name : "Error"
  };
}
async function initialize(message) {
  manifest = parseModelManifest(message.payload.manifest);
  const capabilities = await probeCapabilities();
  if (message.payload.provider === "webgpu" && !capabilities.webgpu) {
    throw new DocLayoutError(
      "CAPABILITY_UNSUPPORTED",
      "WebGPU is unavailable inside the inference worker",
      { provider: "webgpu", workerProbe: capabilities.diagnostics }
    );
  }
  session = await createOrtSession({
    capabilities,
    input: manifest.input,
    modelBytes: new Uint8Array(message.payload.modelBytes),
    outputs: manifest.outputs,
    provider: message.payload.provider,
    ...message.payload.wasm === void 0 ? {} : { wasm: message.payload.wasm }
  });
  post({ requestId: message.requestId, sessionCreateMs: session.sessionCreateMs, type: "ready" });
}
async function detect(message) {
  if (manifest === void 0 || session === void 0) {
    throw new DocLayoutError("INFERENCE_FAILED", "Inference worker is not initialized");
  }
  const controller = new AbortController();
  controllers.set(message.requestId, controller);
  try {
    progress(message.requestId, "preprocess", "start");
    const preprocessStartedAt = performance.now();
    const input = preprocessRaster(message.payload.raster, manifest.preprocessing, {
      signal: controller.signal
    });
    const preprocessMs = performance.now() - preprocessStartedAt;
    progress(message.requestId, "preprocess", "complete");
    progress(message.requestId, "inference", "start");
    const inference = await session.run(input.data, input.dims, { signal: controller.signal });
    progress(message.requestId, "inference", "complete");
    progress(message.requestId, "postprocess", "start");
    const postprocessStartedAt = performance.now();
    const detections = postprocessDetections(inference.outputs, {
      inputSize: manifest.preprocessing.size,
      labels: manifest.labels,
      targetSize: input.originalSize,
      ...message.payload.classThresholds === void 0 ? {} : { classThresholds: message.payload.classThresholds },
      ...message.payload.threshold === void 0 ? {} : { threshold: message.payload.threshold }
    });
    const postprocessMs = performance.now() - postprocessStartedAt;
    progress(message.requestId, "postprocess", "complete");
    post({
      payload: {
        detections,
        timings: { inferenceMs: inference.inferenceMs, postprocessMs, preprocessMs }
      },
      requestId: message.requestId,
      type: "result"
    });
  } finally {
    controllers.delete(message.requestId);
  }
}
scope.onmessage = (event) => {
  const message = event.data;
  if (message.type === "abort") {
    controllers.get(message.targetRequestId)?.abort(message.reason);
    return;
  }
  if (message.type === "dispose") {
    void session?.dispose().finally(() => {
      post({ requestId: message.requestId, type: "disposed" });
      scope.close();
    });
    return;
  }
  const operation = message.type === "init" ? initialize(message) : detect(message);
  void operation.catch((error) => {
    post({ error: serializeError(error), requestId: message.requestId, type: "error" });
  });
};
/*! Bundled license information:

onnxruntime-web/dist/ort.webgpu.bundle.min.mjs:
  (*!
   * ONNX Runtime Web v1.27.0
   * Copyright (c) Microsoft Corporation. All rights reserved.
   * Licensed under the MIT License.
   *)

onnxruntime-web/dist/ort.bundle.min.mjs:
  (*!
   * ONNX Runtime Web v1.27.0
   * Copyright (c) Microsoft Corporation. All rights reserved.
   * Licensed under the MIT License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)
*/
//# sourceMappingURL=inference.worker.js.map
//# sourceMappingURL=inference.worker.js.map