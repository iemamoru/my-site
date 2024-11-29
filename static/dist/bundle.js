/******/ (() => { // webpackBootstrap
/*!****************************************************************!*\
  !*** ./static/js/2_76bbd318-f394-633c-85c1-29f7f464a7d0_ja.js ***!
  \****************************************************************/
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
document.addEventListener('DOMContentLoaded', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
  var chatBoard, postForm, contentInput, imageUpload, pageInfoElement, prevButton, nextButton, scrollUp, scrollDown, goLatest, goFirst, scrollToBottom, searchForm, popup, closePopup, useIdCheckbox, currentPage, postsPerPage, csrfToken, fetchData, renderMessages, csrfEndpoint, fetchCsrfToken, escapeContent, loadPage, fetchSearchResults, postMessage, showPopup, quotePost, hidePopup, updatePagination, handleScrollButtons;
  return _regeneratorRuntime().wrap(function _callee6$(_context6) {
    while (1) switch (_context6.prev = _context6.next) {
      case 0:
        chatBoard = document.getElementById('chatBoard');
        postForm = document.getElementById('postForm');
        contentInput = document.getElementById('content');
        imageUpload = document.getElementById('imageUpload');
        pageInfoElement = document.getElementById('page-count');
        prevButton = document.getElementById('btn_paging_prev');
        nextButton = document.getElementById('btn_paging_next');
        scrollUp = document.getElementById('scrollUp');
        scrollDown = document.getElementById('scrollDown');
        goLatest = document.getElementById('go-latest');
        goFirst = document.getElementById('go-first');
        scrollToBottom = document.getElementById('scroll-to-bottom');
        searchForm = document.getElementById('searchForm');
        popup = document.getElementById('popup');
        closePopup = document.getElementById('closePopup');
        useIdCheckbox = document.getElementById("use_id");
        currentPage = 1;
        postsPerPage = 60;
        csrfToken = "";
        fetchData = /*#__PURE__*/function () {
          var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(url) {
            var response, data;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;
                  _context.next = 3;
                  return fetch(url);
                case 3:
                  response = _context.sent;
                  _context.next = 6;
                  return response.json();
                case 6:
                  data = _context.sent;
                  if (!(data.result === "success")) {
                    _context.next = 11;
                    break;
                  }
                  return _context.abrupt("return", data);
                case 11:
                  console.error("データの取得に失敗しました。");
                  return _context.abrupt("return", null);
                case 13:
                  _context.next = 19;
                  break;
                case 15:
                  _context.prev = 15;
                  _context.t0 = _context["catch"](0);
                  console.error("エラーが発生しました:", _context.t0);
                  return _context.abrupt("return", null);
                case 19:
                case "end":
                  return _context.stop();
              }
            }, _callee, null, [[0, 15]]);
          }));
          return function fetchData(_x) {
            return _ref2.apply(this, arguments);
          };
        }();
        renderMessages = function renderMessages(messages) {
          var keyword = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
          chatBoard.innerHTML = '';
          messages.forEach(function (msg, index) {
            var timestamp = new Date(msg.timestamp);
            var options = {
              timeZone: 'Asia/Tokyo',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            };
            var formattedTimestamp = new Intl.DateTimeFormat('ja-JP', options).format(timestamp);
            var contentWithLinks = msg.content.replace(/&gt;&gt;(\d+)/g, function (match, postId) {
              var cleanPostId = postId.replace(/<\/?hit>/g, '');
              return "<span class=\"post-number-rep\" onclick=\"window.showPopup('".concat(cleanPostId, "', event)\"> >>").concat(cleanPostId, " </span>");
            });
            if (keyword) {
              var regex = new RegExp("(".concat(keyword, ")"), 'gi');
              contentWithLinks = contentWithLinks.replace(regex, function (match) {
                if (!match.includes('<hit>')) {
                  return "<hit>".concat(match, "</hit>");
                }
                return match;
              });
            }
            var postElement = document.createElement('div');
            postElement.className = 'post';
            var imageHTML = msg.image_url ? "<img src=\"".concat(msg.image_url, "\" alt=\"\u6295\u7A3F\u753B\u50CF\" class=\"post-image\" />") : '';
            postElement.innerHTML = "\n                <a class=\"post-number\" onclick=\"quotePost(".concat(msg.post_id, ")\">").concat(msg.post_id, ":</a>\n                <span class=\"post-timestamp\">").concat(formattedTimestamp, "</span>\n                ").concat(msg.user_id ? "<span class=\"post-user-id\" style=\"color: green;\">ID: ".concat(msg.user_id, "</span>") : "", "\n                <div class=\"post-content\">").concat(contentWithLinks, "</div>\n                ").concat(imageHTML, "\n            ");
            chatBoard.appendChild(postElement);
            if (index < messages.length - 1) {
              var hr = document.createElement('hr');
              chatBoard.appendChild(hr);
            }
          });
        };
        csrfEndpoint = "/realfightchangairukarakosobokuhatsukematsugewokaerunokamoshirenai/e0jwpe3rh9eehr30wp";
        fetchCsrfToken = /*#__PURE__*/function () {
          var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
            var response;
            return _regeneratorRuntime().wrap(function _callee2$(_context2) {
              while (1) switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.prev = 0;
                  _context2.next = 3;
                  return axios.get(csrfEndpoint);
                case 3:
                  response = _context2.sent;
                  csrfToken = response.data.naniittendaomaeha_orehananiitterukawakaranaidegowasu;
                  _context2.next = 10;
                  break;
                case 7:
                  _context2.prev = 7;
                  _context2.t0 = _context2["catch"](0);
                  console.error('CSRFトークンの取得に失敗しました:', _context2.t0);
                case 10:
                case "end":
                  return _context2.stop();
              }
            }, _callee2, null, [[0, 7]]);
          }));
          return function fetchCsrfToken() {
            return _ref3.apply(this, arguments);
          };
        }();
        escapeContent = function escapeContent(content) {
          return content.replace(/>>(\d+)/g, function (match, postId) {
            return "&gt;&gt;".concat(postId);
          });
        };
        loadPage = /*#__PURE__*/function () {
          var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(page) {
            var isFirst,
              initialData,
              data,
              _data$pagination,
              current_page,
              total_pages,
              total_messages,
              _args3 = arguments;
            return _regeneratorRuntime().wrap(function _callee3$(_context3) {
              while (1) switch (_context3.prev = _context3.next) {
                case 0:
                  isFirst = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : false;
                  if (!isFirst) {
                    _context3.next = 10;
                    break;
                  }
                  _context3.next = 4;
                  return fetchData("/open-chat/posts/timeline?page=".concat(page, "&limit=1"));
                case 4:
                  initialData = _context3.sent;
                  if (!initialData) {
                    _context3.next = 9;
                    break;
                  }
                  page = initialData.pagination.total_pages;
                  _context3.next = 10;
                  break;
                case 9:
                  return _context3.abrupt("return");
                case 10:
                  _context3.next = 12;
                  return fetchData("/open-chat/posts/timeline?page=".concat(page, "&limit=").concat(postsPerPage));
                case 12:
                  data = _context3.sent;
                  if (data) {
                    _data$pagination = data.pagination, current_page = _data$pagination.current_page, total_pages = _data$pagination.total_pages, total_messages = _data$pagination.total_messages;
                    updatePagination(current_page, total_pages, total_messages);
                    renderMessages(data.posts);
                  }
                case 14:
                case "end":
                  return _context3.stop();
              }
            }, _callee3);
          }));
          return function loadPage(_x2) {
            return _ref4.apply(this, arguments);
          };
        }();
        fetchSearchResults = /*#__PURE__*/function () {
          var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(keyword) {
            var page,
              url,
              data,
              posts,
              search_info,
              _args4 = arguments;
            return _regeneratorRuntime().wrap(function _callee4$(_context4) {
              while (1) switch (_context4.prev = _context4.next) {
                case 0:
                  page = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : 1;
                  url = "/open-chat/posts/timeline/search?keyword=".concat(encodeURIComponent(keyword), "&page=").concat(page, "&limit=").concat(postsPerPage);
                  _context4.next = 4;
                  return fetchData(url);
                case 4:
                  data = _context4.sent;
                  if (data) {
                    posts = data.posts, search_info = data.search_info;
                    updatePagination(page, Math.ceil(search_info.total_hits / postsPerPage), search_info.total_hits, true, search_info.keyword);
                    renderMessages(posts, keyword);
                  }
                case 6:
                case "end":
                  return _context4.stop();
              }
            }, _callee4);
          }));
          return function fetchSearchResults(_x3) {
            return _ref5.apply(this, arguments);
          };
        }();
        postMessage = /*#__PURE__*/function () {
          var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
            var content, imageFile, useId, formData, response;
            return _regeneratorRuntime().wrap(function _callee5$(_context5) {
              while (1) switch (_context5.prev = _context5.next) {
                case 0:
                  content = contentInput.value.trim();
                  imageFile = imageUpload.files[0];
                  useId = useIdCheckbox.checked;
                  if (!(!content && !imageFile)) {
                    _context5.next = 6;
                    break;
                  }
                  alert('メッセージまたは画像を入力してください');
                  return _context5.abrupt("return");
                case 6:
                  content = escapeContent(content);
                  formData = new FormData();
                  formData.append("content", content);
                  formData.append("use_id", useId);
                  if (imageFile) {
                    formData.append("image", imageFile);
                  }
                  _context5.prev = 11;
                  _context5.next = 14;
                  return axios.post('/open-chat/posts/new', formData, {
                    headers: {
                      "X-CSRF-Token": csrfToken
                    }
                  });
                case 14:
                  response = _context5.sent;
                  if (response.data.result === "success") {
                    contentInput.value = "";
                    imageUpload.value = "";
                    loadPage(currentPage);
                  } else {
                    console.error(response.data.message);
                  }
                  _context5.next = 21;
                  break;
                case 18:
                  _context5.prev = 18;
                  _context5.t0 = _context5["catch"](11);
                  console.error('投稿に失敗しました:', _context5.t0);
                case 21:
                case "end":
                  return _context5.stop();
              }
            }, _callee5, null, [[11, 18]]);
          }));
          return function postMessage() {
            return _ref6.apply(this, arguments);
          };
        }();
        showPopup = function showPopup(postId, event) {
          var cleanPostId = typeof postId === 'string' ? postId.replace(/<\/?hit>/g, '') : postId;
          axios.get("/open-chat/posts/".concat(cleanPostId)).then(function (response) {
            var post = response.data.post;
            if (post) {
              var contentWithLinks = post.content.replace(/&gt;&gt;(\d+)/g, function (match, postId) {
                var cleanLinkPostId = postId.replace(/<\/?hit>/g, '');
                return "<span class=\"post-number-rep\" onclick=\"window.showPopup(".concat(cleanLinkPostId, ", event)\"> ").concat(cleanLinkPostId, " </span>");
              });
              var timestamp = new Date(post.timestamp);
              var options = {
                timeZone: 'Asia/Tokyo',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              };
              var formattedTimestamp = new Intl.DateTimeFormat('ja-JP', options).format(timestamp);
              var _popup = document.createElement('div');
              _popup.classList.add('popup');
              _popup.innerHTML = "\n                        <div class=\"popup-content\">\n                            <button class=\"popup-close\">\u2716</button>\n                            <a class=\"post-number\" onclick=\"quotePost(".concat(post.id, ")\">").concat(post.id, ":</a>\n                            <span class=\"post-timestamp\">").concat(formattedTimestamp, "</span>\n                            <p>").concat(contentWithLinks, "</p>\n                        </div>\n                    ");
              var rect = event.target.getBoundingClientRect();
              var x = rect.left + window.pageXOffset;
              var y = rect.bottom + window.pageYOffset;
              _popup.style.left = "".concat(x, "px");
              _popup.style.top = "".concat(y, "px");
              _popup.querySelector('.popup-close').addEventListener('click', function () {
                return _popup.remove();
              });
              document.body.appendChild(_popup);
              requestAnimationFrame(function () {
                return _popup.classList.add('show');
              });
            } else {
              alert('この番号で投稿してる人なんていないヨ❗');
            }
          })["catch"](function (error) {
            console.error('Failed to load message:', error);
          });
        };
        quotePost = function quotePost(postId) {
          var quoteText = ">>".concat(postId);
          if (!contentInput.value.includes(quoteText)) {
            contentInput.value = "".concat(quoteText, "\n") + contentInput.value;
          }
        };
        hidePopup = function hidePopup() {
          popup.classList.remove('show');
          popup.addEventListener('transitionend', function () {
            popup.style.display = 'none';
          }, {
            once: true
          });
        };
        closePopup.addEventListener('click', hidePopup);
        window.quotePost = quotePost;
        window.showPopup = showPopup;
        updatePagination = function updatePagination(current_page, total_pages) {
          var total_hits = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
          var isSearch = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
          var keyword = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
          currentPage = current_page;
          if (isSearch) {
            pageInfoElement.textContent = "".concat(total_hits, "\u4EF6\u30D2\u30C3\u30C8! \u300C").concat(keyword, "\u300D");
          } else {
            pageInfoElement.textContent = "".concat(current_page, "/").concat(total_pages, "\u9801");
          }
          prevButton.disabled = current_page <= 1;
          nextButton.disabled = current_page >= total_pages;
        };
        handleScrollButtons = function handleScrollButtons() {
          var scrollPosition = window.scrollY;
          var windowHeight = window.innerHeight;
          var bodyHeight = document.body.scrollHeight;
          scrollUp.style.display = scrollPosition < 100 ? 'none' : 'block';
          scrollDown.style.display = scrollPosition + windowHeight >= bodyHeight - 100 ? 'none' : 'block';
        };
        prevButton.addEventListener('click', function () {
          return currentPage > 1 && loadPage(currentPage - 1);
        });
        nextButton.addEventListener('click', function () {
          return loadPage(currentPage + 1);
        });
        goLatest.addEventListener('click', function () {
          return loadPage(currentPage, true);
        });
        goFirst.addEventListener('click', function () {
          return loadPage(1);
        });
        scrollToBottom.addEventListener('click', function (e) {
          e.preventDefault();
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
          });
        });
        scrollUp.addEventListener('click', function (e) {
          e.preventDefault();
          window.scrollBy({
            top: -window.innerHeight * 0.8,
            behavior: 'smooth'
          });
        });
        scrollDown.addEventListener('click', function (e) {
          e.preventDefault();
          window.scrollBy({
            top: window.innerHeight * 0.8,
            behavior: 'smooth'
          });
        });
        window.addEventListener('scroll', handleScrollButtons);
        postForm.addEventListener('submit', function (e) {
          e.preventDefault();
          postMessage();
        });
        searchForm.addEventListener('submit', function (e) {
          e.preventDefault();
          var keyword = new FormData(searchForm).get('query').trim();
          if (keyword) {
            fetchSearchResults(keyword);
          }
        });
        _context6.next = 47;
        return fetchCsrfToken();
      case 47:
        loadPage(currentPage, true);
      case 48:
      case "end":
        return _context6.stop();
    }
  }, _callee6);
})));
/******/ })()
;
//# sourceMappingURL=bundle.js.map