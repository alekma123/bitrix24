/* eslint-disable */
this.BX = this.BX || {};
(function (exports,main_core) {
  'use strict';

  var _excluded = ["mask"],
    _excluded2 = ["mask"],
    _excluded3 = ["chunks"],
    _excluded4 = ["parent", "isOptional", "placeholderChar", "displayChar", "lazy", "eager"],
    _excluded5 = ["expose", "repeat"],
    _excluded6 = ["_blocks"],
    _excluded7 = ["to", "from", "maxLength", "autofix"],
    _excluded8 = ["mask", "pattern"],
    _excluded9 = ["mask", "pattern", "blocks"],
    _excluded10 = ["expose"],
    _excluded11 = ["mask"],
    _excluded12 = ["compiledMasks", "currentMaskRef", "currentMask"],
    _excluded13 = ["enum"],
    _excluded14 = ["repeat"];
  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { babelHelpers.defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
  (function (global, factory) {
    (typeof exports === "undefined" ? "undefined" : babelHelpers["typeof"](exports)) === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define(['exports'], factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.IMask = {}));
  })(undefined, function (exports) {

    /** Checks if value is string */
    function isString(str) {
      return typeof str === 'string' || str instanceof String;
    }

    /** Checks if value is object */
    function isObject(obj) {
      var _obj$constructor;
      return babelHelpers["typeof"](obj) === 'object' && obj != null && (obj == null || (_obj$constructor = obj.constructor) == null ? void 0 : _obj$constructor.name) === 'Object';
    }
    function pick(obj, keys) {
      if (Array.isArray(keys)) return pick(obj, function (_, k) {
        return keys.includes(k);
      });
      return Object.entries(obj).reduce(function (acc, _ref) {
        var _ref5 = babelHelpers.slicedToArray(_ref, 2),
          k = _ref5[0],
          v = _ref5[1];
        if (keys(v, k)) acc[k] = v;
        return acc;
      }, {});
    }

    /** Direction */
    var DIRECTION = {
      NONE: 'NONE',
      LEFT: 'LEFT',
      FORCE_LEFT: 'FORCE_LEFT',
      RIGHT: 'RIGHT',
      FORCE_RIGHT: 'FORCE_RIGHT'
    };

    /** Direction */

    function forceDirection(direction) {
      switch (direction) {
        case DIRECTION.LEFT:
          return DIRECTION.FORCE_LEFT;
        case DIRECTION.RIGHT:
          return DIRECTION.FORCE_RIGHT;
        default:
          return direction;
      }
    }

    /** Escapes regular expression control chars */
    function escapeRegExp(str) {
      return str.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1');
    }

    // cloned from https://github.com/epoberezkin/fast-deep-equal with small changes
    function objectIncludes(b, a) {
      if (a === b) return true;
      var arrA = Array.isArray(a),
        arrB = Array.isArray(b);
      var i;
      if (arrA && arrB) {
        if (a.length != b.length) return false;
        for (i = 0; i < a.length; i++) if (!objectIncludes(a[i], b[i])) return false;
        return true;
      }
      if (arrA != arrB) return false;
      if (a && b && babelHelpers["typeof"](a) === 'object' && babelHelpers["typeof"](b) === 'object') {
        var dateA = a instanceof Date,
          dateB = b instanceof Date;
        if (dateA && dateB) return a.getTime() == b.getTime();
        if (dateA != dateB) return false;
        var regexpA = a instanceof RegExp,
          regexpB = b instanceof RegExp;
        if (regexpA && regexpB) return a.toString() == b.toString();
        if (regexpA != regexpB) return false;
        var keys = Object.keys(a);
        // if (keys.length !== Object.keys(b).length) return false;

        for (i = 0; i < keys.length; i++) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
        for (i = 0; i < keys.length; i++) if (!objectIncludes(b[keys[i]], a[keys[i]])) return false;
        return true;
      } else if (a && b && typeof a === 'function' && typeof b === 'function') {
        return a.toString() === b.toString();
      }
      return false;
    }

    /** Selection range */

    /** Provides details of changing input */
    var ActionDetails = /*#__PURE__*/function () {
      /** Current input value */

      /** Current cursor position */

      /** Old input value */

      /** Old selection */

      function ActionDetails(opts) {
        babelHelpers.classCallCheck(this, ActionDetails);
        Object.assign(this, opts);

        // double check if left part was changed (autofilling, other non-standard input triggers)
        while (this.value.slice(0, this.startChangePos) !== this.oldValue.slice(0, this.startChangePos)) {
          --this.oldSelection.start;
        }
        if (this.insertedCount) {
          // double check right part
          while (this.value.slice(this.cursorPos) !== this.oldValue.slice(this.oldSelection.end)) {
            if (this.value.length - this.cursorPos < this.oldValue.length - this.oldSelection.end) ++this.oldSelection.end;else ++this.cursorPos;
          }
        }
      }

      /** Start changing position */
      babelHelpers.createClass(ActionDetails, [{
        key: "startChangePos",
        get: function get() {
          return Math.min(this.cursorPos, this.oldSelection.start);
        } /** Inserted symbols count */
      }, {
        key: "insertedCount",
        get: function get() {
          return this.cursorPos - this.startChangePos;
        } /** Inserted symbols */
      }, {
        key: "inserted",
        get: function get() {
          return this.value.substr(this.startChangePos, this.insertedCount);
        } /** Removed symbols count */
      }, {
        key: "removedCount",
        get: function get() {
          // Math.max for opposite operation
          return Math.max(this.oldSelection.end - this.startChangePos ||
          // for Delete
          this.oldValue.length - this.value.length, 0);
        } /** Removed symbols */
      }, {
        key: "removed",
        get: function get() {
          return this.oldValue.substr(this.startChangePos, this.removedCount);
        } /** Unchanged head symbols */
      }, {
        key: "head",
        get: function get() {
          return this.value.substring(0, this.startChangePos);
        } /** Unchanged tail symbols */
      }, {
        key: "tail",
        get: function get() {
          return this.value.substring(this.startChangePos + this.insertedCount);
        } /** Remove direction */
      }, {
        key: "removeDirection",
        get: function get() {
          if (!this.removedCount || this.insertedCount) return DIRECTION.NONE;

          // align right if delete at right
          return (this.oldSelection.end === this.cursorPos || this.oldSelection.start === this.cursorPos) &&
          // if not range removed (event with backspace)
          this.oldSelection.end === this.oldSelection.start ? DIRECTION.RIGHT : DIRECTION.LEFT;
        }
      }]);
      return ActionDetails;
    }();
    /** Applies mask on element */
    function IMask(el, opts) {
      // currently available only for input-like elements
      return new IMask.InputMask(el, opts);
    }

    // TODO can't use overloads here because of https://github.com/microsoft/TypeScript/issues/50754
    // export function maskedClass(mask: string): typeof MaskedPattern;
    // export function maskedClass(mask: DateConstructor): typeof MaskedDate;
    // export function maskedClass(mask: NumberConstructor): typeof MaskedNumber;
    // export function maskedClass(mask: Array<any> | ArrayConstructor): typeof MaskedDynamic;
    // export function maskedClass(mask: MaskedDate): typeof MaskedDate;
    // export function maskedClass(mask: MaskedNumber): typeof MaskedNumber;
    // export function maskedClass(mask: MaskedEnum): typeof MaskedEnum;
    // export function maskedClass(mask: MaskedRange): typeof MaskedRange;
    // export function maskedClass(mask: MaskedRegExp): typeof MaskedRegExp;
    // export function maskedClass(mask: MaskedFunction): typeof MaskedFunction;
    // export function maskedClass(mask: MaskedPattern): typeof MaskedPattern;
    // export function maskedClass(mask: MaskedDynamic): typeof MaskedDynamic;
    // export function maskedClass(mask: Masked): typeof Masked;
    // export function maskedClass(mask: typeof Masked): typeof Masked;
    // export function maskedClass(mask: typeof MaskedDate): typeof MaskedDate;
    // export function maskedClass(mask: typeof MaskedNumber): typeof MaskedNumber;
    // export function maskedClass(mask: typeof MaskedEnum): typeof MaskedEnum;
    // export function maskedClass(mask: typeof MaskedRange): typeof MaskedRange;
    // export function maskedClass(mask: typeof MaskedRegExp): typeof MaskedRegExp;
    // export function maskedClass(mask: typeof MaskedFunction): typeof MaskedFunction;
    // export function maskedClass(mask: typeof MaskedPattern): typeof MaskedPattern;
    // export function maskedClass(mask: typeof MaskedDynamic): typeof MaskedDynamic;
    // export function maskedClass<Mask extends typeof Masked> (mask: Mask): Mask;
    // export function maskedClass(mask: RegExp): typeof MaskedRegExp;
    // export function maskedClass(mask: (value: string, ...args: any[]) => boolean): typeof MaskedFunction;

    /** Get Masked class by mask type */
    function maskedClass(mask) /* TODO */{
      if (mask == null) throw new Error('mask property should be defined');
      if (mask instanceof RegExp) return IMask.MaskedRegExp;
      if (isString(mask)) return IMask.MaskedPattern;
      if (mask === Date) return IMask.MaskedDate;
      if (mask === Number) return IMask.MaskedNumber;
      if (Array.isArray(mask) || mask === Array) return IMask.MaskedDynamic;
      if (IMask.Masked && mask.prototype instanceof IMask.Masked) return mask;
      if (IMask.Masked && mask instanceof IMask.Masked) return mask.constructor;
      if (mask instanceof Function) return IMask.MaskedFunction;
      console.warn('Mask not found for mask', mask); // eslint-disable-line no-console
      return IMask.Masked;
    }
    function normalizeOpts(opts) {
      if (!opts) throw new Error('Options in not defined');
      if (IMask.Masked) {
        if (opts.prototype instanceof IMask.Masked) return {
          mask: opts
        };

        /*
          handle cases like:
          1) opts = Masked
          2) opts = { mask: Masked, ...instanceOpts }
        */
        var _ref6 = opts instanceof IMask.Masked ? {
            mask: opts
          } : isObject(opts) && opts.mask instanceof IMask.Masked ? opts : {},
          _ref6$mask = _ref6.mask,
          mask = _ref6$mask === void 0 ? undefined : _ref6$mask,
          instanceOpts = babelHelpers.objectWithoutProperties(_ref6, _excluded);
        if (mask) {
          var _mask = mask.mask;
          return _objectSpread(_objectSpread({}, pick(mask, function (_, k) {
            return !k.startsWith('_');
          })), {}, {
            mask: mask.constructor,
            _mask: _mask
          }, instanceOpts);
        }
      }
      if (!isObject(opts)) return {
        mask: opts
      };
      return _objectSpread({}, opts);
    }

    // TODO can't use overloads here because of https://github.com/microsoft/TypeScript/issues/50754

    // From masked
    // export default function createMask<Opts extends Masked, ReturnMasked=Opts> (opts: Opts): ReturnMasked;
    // // From masked class
    // export default function createMask<Opts extends MaskedOptions<typeof Masked>, ReturnMasked extends Masked=InstanceType<Opts['mask']>> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedOptions<typeof MaskedDate>, ReturnMasked extends MaskedDate=MaskedDate<Opts['parent']>> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedOptions<typeof MaskedNumber>, ReturnMasked extends MaskedNumber=MaskedNumber<Opts['parent']>> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedOptions<typeof MaskedEnum>, ReturnMasked extends MaskedEnum=MaskedEnum<Opts['parent']>> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedOptions<typeof MaskedRange>, ReturnMasked extends MaskedRange=MaskedRange<Opts['parent']>> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedOptions<typeof MaskedRegExp>, ReturnMasked extends MaskedRegExp=MaskedRegExp<Opts['parent']>> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedOptions<typeof MaskedFunction>, ReturnMasked extends MaskedFunction=MaskedFunction<Opts['parent']>> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedOptions<typeof MaskedPattern>, ReturnMasked extends MaskedPattern=MaskedPattern<Opts['parent']>> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedOptions<typeof MaskedDynamic>, ReturnMasked extends MaskedDynamic=MaskedDynamic<Opts['parent']>> (opts: Opts): ReturnMasked;
    // // From mask opts
    // export default function createMask<Opts extends MaskedOptions<Masked>, ReturnMasked=Opts extends MaskedOptions<infer M> ? M : never> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedNumberOptions, ReturnMasked extends MaskedNumber=MaskedNumber<Opts['parent']>> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedDateFactoryOptions, ReturnMasked extends MaskedDate=MaskedDate<Opts['parent']>> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedEnumOptions, ReturnMasked extends MaskedEnum=MaskedEnum<Opts['parent']>> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedRangeOptions, ReturnMasked extends MaskedRange=MaskedRange<Opts['parent']>> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedPatternOptions, ReturnMasked extends MaskedPattern=MaskedPattern<Opts['parent']>> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedDynamicOptions, ReturnMasked extends MaskedDynamic=MaskedDynamic<Opts['parent']>> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedOptions<RegExp>, ReturnMasked extends MaskedRegExp=MaskedRegExp<Opts['parent']>> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedOptions<Function>, ReturnMasked extends MaskedFunction=MaskedFunction<Opts['parent']>> (opts: Opts): ReturnMasked;

    /** Creates new {@link Masked} depending on mask type */
    function createMask(opts) {
      if (IMask.Masked && opts instanceof IMask.Masked) return opts;
      var nOpts = normalizeOpts(opts);
      var MaskedClass = maskedClass(nOpts.mask);
      if (!MaskedClass) throw new Error("Masked class is not found for provided mask " + nOpts.mask + ", appropriate module needs to be imported manually before creating mask.");
      if (nOpts.mask === MaskedClass) delete nOpts.mask;
      if (nOpts._mask) {
        nOpts.mask = nOpts._mask;
        delete nOpts._mask;
      }
      return new MaskedClass(nOpts);
    }
    IMask.createMask = createMask;

    /**  Generic element API to use with mask */
    var MaskElement = /*#__PURE__*/function () {
      function MaskElement() {
        babelHelpers.classCallCheck(this, MaskElement);
      }
      babelHelpers.createClass(MaskElement, [{
        key: "select",
        /** Safely sets element selection */value: function select(start, end) {
          if (start == null || end == null || start === this.selectionStart && end === this.selectionEnd) return;
          try {
            this._unsafeSelect(start, end);
          } catch (_unused) {}
        } /** */
      }, {
        key: "selectionStart",
        /** */
        /** */
        /** */
        /** Safely returns selection start */
        get: function get() {
          var start;
          try {
            start = this._unsafeSelectionStart;
          } catch (_unused2) {}
          return start != null ? start : this.value.length;
        } /** Safely returns selection end */
      }, {
        key: "selectionEnd",
        get: function get() {
          var end;
          try {
            end = this._unsafeSelectionEnd;
          } catch (_unused3) {}
          return end != null ? end : this.value.length;
        }
      }, {
        key: "isActive",
        get: function get() {
          return false;
        }
        /** */
        /** */
        /** */
      }]);
      return MaskElement;
    }();
    IMask.MaskElement = MaskElement;
    var KEY_Z = 90;
    var KEY_Y = 89;

    /** Bridge between HTMLElement and {@link Masked} */
    var HTMLMaskElement = /*#__PURE__*/function (_MaskElement) {
      babelHelpers.inherits(HTMLMaskElement, _MaskElement);
      /** HTMLElement to use mask on */

      function HTMLMaskElement(input) {
        var _this;
        babelHelpers.classCallCheck(this, HTMLMaskElement);
        _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(HTMLMaskElement).call(this));
        _this.input = input;
        _this._onKeydown = _this._onKeydown.bind(babelHelpers.assertThisInitialized(_this));
        _this._onInput = _this._onInput.bind(babelHelpers.assertThisInitialized(_this));
        _this._onBeforeinput = _this._onBeforeinput.bind(babelHelpers.assertThisInitialized(_this));
        _this._onCompositionEnd = _this._onCompositionEnd.bind(babelHelpers.assertThisInitialized(_this));
        return _this;
      }
      babelHelpers.createClass(HTMLMaskElement, [{
        key: "bindEvents",
        /** Binds HTMLElement events to mask internal events */value: function bindEvents(handlers) {
          this.input.addEventListener('keydown', this._onKeydown);
          this.input.addEventListener('input', this._onInput);
          this.input.addEventListener('beforeinput', this._onBeforeinput);
          this.input.addEventListener('compositionend', this._onCompositionEnd);
          this.input.addEventListener('drop', handlers.drop);
          this.input.addEventListener('click', handlers.click);
          this.input.addEventListener('focus', handlers.focus);
          this.input.addEventListener('blur', handlers.commit);
          this._handlers = handlers;
        }
      }, {
        key: "_onKeydown",
        value: function _onKeydown(e) {
          if (this._handlers.redo && (e.keyCode === KEY_Z && e.shiftKey && (e.metaKey || e.ctrlKey) || e.keyCode === KEY_Y && e.ctrlKey)) {
            e.preventDefault();
            return this._handlers.redo(e);
          }
          if (this._handlers.undo && e.keyCode === KEY_Z && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            return this._handlers.undo(e);
          }
          if (!e.isComposing) this._handlers.selectionChange(e);
        }
      }, {
        key: "_onBeforeinput",
        value: function _onBeforeinput(e) {
          if (e.inputType === 'historyUndo' && this._handlers.undo) {
            e.preventDefault();
            return this._handlers.undo(e);
          }
          if (e.inputType === 'historyRedo' && this._handlers.redo) {
            e.preventDefault();
            return this._handlers.redo(e);
          }
        }
      }, {
        key: "_onCompositionEnd",
        value: function _onCompositionEnd(e) {
          this._handlers.input(e);
        }
      }, {
        key: "_onInput",
        value: function _onInput(e) {
          if (!e.isComposing) this._handlers.input(e);
        } /** Unbinds HTMLElement events to mask internal events */
      }, {
        key: "unbindEvents",
        value: function unbindEvents() {
          this.input.removeEventListener('keydown', this._onKeydown);
          this.input.removeEventListener('input', this._onInput);
          this.input.removeEventListener('beforeinput', this._onBeforeinput);
          this.input.removeEventListener('compositionend', this._onCompositionEnd);
          this.input.removeEventListener('drop', this._handlers.drop);
          this.input.removeEventListener('click', this._handlers.click);
          this.input.removeEventListener('focus', this._handlers.focus);
          this.input.removeEventListener('blur', this._handlers.commit);
          this._handlers = {};
        }
      }, {
        key: "rootElement",
        get: function get() {
          var _this$input$getRootNo, _this$input$getRootNo2, _this$input;
          return (_this$input$getRootNo = (_this$input$getRootNo2 = (_this$input = this.input).getRootNode) == null ? void 0 : _this$input$getRootNo2.call(_this$input)) != null ? _this$input$getRootNo : document;
        } /** Is element in focus */
      }, {
        key: "isActive",
        get: function get() {
          return this.input === this.rootElement.activeElement;
        }
      }]);
      return HTMLMaskElement;
    }(MaskElement);
    IMask.HTMLMaskElement = HTMLMaskElement;

    /** Bridge between InputElement and {@link Masked} */
    var HTMLInputMaskElement = /*#__PURE__*/function (_HTMLMaskElement) {
      babelHelpers.inherits(HTMLInputMaskElement, _HTMLMaskElement);
      /** InputElement to use mask on */

      function HTMLInputMaskElement(input) {
        var _this2;
        babelHelpers.classCallCheck(this, HTMLInputMaskElement);
        _this2 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(HTMLInputMaskElement).call(this, input));
        _this2.input = input;
        return _this2;
      }

      /** Returns InputElement selection start */
      babelHelpers.createClass(HTMLInputMaskElement, [{
        key: "_unsafeSelect",
        /** Sets InputElement selection */value: function _unsafeSelect(start, end) {
          this.input.setSelectionRange(start, end);
        }
      }, {
        key: "_unsafeSelectionStart",
        get: function get() {
          return this.input.selectionStart != null ? this.input.selectionStart : this.value.length;
        } /** Returns InputElement selection end */
      }, {
        key: "_unsafeSelectionEnd",
        get: function get() {
          return this.input.selectionEnd;
        }
      }, {
        key: "value",
        get: function get() {
          return this.input.value;
        },
        set: function set(value) {
          this.input.value = value;
        }
      }]);
      return HTMLInputMaskElement;
    }(HTMLMaskElement);
    IMask.HTMLMaskElement = HTMLMaskElement;
    var HTMLContenteditableMaskElement = /*#__PURE__*/function (_HTMLMaskElement2) {
      babelHelpers.inherits(HTMLContenteditableMaskElement, _HTMLMaskElement2);
      function HTMLContenteditableMaskElement() {
        babelHelpers.classCallCheck(this, HTMLContenteditableMaskElement);
        return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(HTMLContenteditableMaskElement).apply(this, arguments));
      }
      babelHelpers.createClass(HTMLContenteditableMaskElement, [{
        key: "_unsafeSelect",
        /** Sets HTMLElement selection */value: function _unsafeSelect(start, end) {
          if (!this.rootElement.createRange) return;
          var range = this.rootElement.createRange();
          range.setStart(this.input.firstChild || this.input, start);
          range.setEnd(this.input.lastChild || this.input, end);
          var root = this.rootElement;
          var selection = root.getSelection && root.getSelection();
          if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
          }
        } /** HTMLElement value */
      }, {
        key: "_unsafeSelectionStart",
        /** Returns HTMLElement selection start */get: function get() {
          var root = this.rootElement;
          var selection = root.getSelection && root.getSelection();
          var anchorOffset = selection && selection.anchorOffset;
          var focusOffset = selection && selection.focusOffset;
          if (focusOffset == null || anchorOffset == null || anchorOffset < focusOffset) {
            return anchorOffset;
          }
          return focusOffset;
        } /** Returns HTMLElement selection end */
      }, {
        key: "_unsafeSelectionEnd",
        get: function get() {
          var root = this.rootElement;
          var selection = root.getSelection && root.getSelection();
          var anchorOffset = selection && selection.anchorOffset;
          var focusOffset = selection && selection.focusOffset;
          if (focusOffset == null || anchorOffset == null || anchorOffset > focusOffset) {
            return anchorOffset;
          }
          return focusOffset;
        }
      }, {
        key: "value",
        get: function get() {
          return this.input.textContent || '';
        },
        set: function set(value) {
          this.input.textContent = value;
        }
      }]);
      return HTMLContenteditableMaskElement;
    }(HTMLMaskElement);
    IMask.HTMLContenteditableMaskElement = HTMLContenteditableMaskElement;
    var InputHistory = /*#__PURE__*/function () {
      function InputHistory() {
        babelHelpers.classCallCheck(this, InputHistory);
        this.states = [];
        this.currentIndex = 0;
      }
      babelHelpers.createClass(InputHistory, [{
        key: "push",
        value: function push(state) {
          // if current index points before the last element then remove the future
          if (this.currentIndex < this.states.length - 1) this.states.length = this.currentIndex + 1;
          this.states.push(state);
          if (this.states.length > InputHistory.MAX_LENGTH) this.states.shift();
          this.currentIndex = this.states.length - 1;
        }
      }, {
        key: "go",
        value: function go(steps) {
          this.currentIndex = Math.min(Math.max(this.currentIndex + steps, 0), this.states.length - 1);
          return this.currentState;
        }
      }, {
        key: "undo",
        value: function undo() {
          return this.go(-1);
        }
      }, {
        key: "redo",
        value: function redo() {
          return this.go(+1);
        }
      }, {
        key: "clear",
        value: function clear() {
          this.states.length = 0;
          this.currentIndex = 0;
        }
      }, {
        key: "currentState",
        get: function get() {
          return this.states[this.currentIndex];
        }
      }, {
        key: "isEmpty",
        get: function get() {
          return this.states.length === 0;
        }
      }]);
      return InputHistory;
    }();
    InputHistory.MAX_LENGTH = 100;

    /** Listens to element events and controls changes between element and {@link Masked} */
    var InputMask = /*#__PURE__*/function () {
      /**
        View element
      */

      /** Internal {@link Masked} model */

      function InputMask(el, opts) {
        babelHelpers.classCallCheck(this, InputMask);
        this.el = el instanceof MaskElement ? el : el.isContentEditable && el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA' ? new HTMLContenteditableMaskElement(el) : new HTMLInputMaskElement(el);
        this.masked = createMask(opts);
        this._listeners = {};
        this._value = '';
        this._unmaskedValue = '';
        this._rawInputValue = '';
        this.history = new InputHistory();
        this._saveSelection = this._saveSelection.bind(this);
        this._onInput = this._onInput.bind(this);
        this._onChange = this._onChange.bind(this);
        this._onDrop = this._onDrop.bind(this);
        this._onFocus = this._onFocus.bind(this);
        this._onClick = this._onClick.bind(this);
        this._onUndo = this._onUndo.bind(this);
        this._onRedo = this._onRedo.bind(this);
        this.alignCursor = this.alignCursor.bind(this);
        this.alignCursorFriendly = this.alignCursorFriendly.bind(this);
        this._bindEvents();

        // refresh
        this.updateValue();
        this._onChange();
      }
      babelHelpers.createClass(InputMask, [{
        key: "maskEquals",
        value: function maskEquals(mask) {
          var _this$masked;
          return mask == null || ((_this$masked = this.masked) == null ? void 0 : _this$masked.maskEquals(mask));
        } /** Masked */
      }, {
        key: "_bindEvents",
        /** Starts listening to element events */value: function _bindEvents() {
          this.el.bindEvents({
            selectionChange: this._saveSelection,
            input: this._onInput,
            drop: this._onDrop,
            click: this._onClick,
            focus: this._onFocus,
            commit: this._onChange,
            undo: this._onUndo,
            redo: this._onRedo
          });
        } /** Stops listening to element events */
      }, {
        key: "_unbindEvents",
        value: function _unbindEvents() {
          if (this.el) this.el.unbindEvents();
        } /** Fires custom event */
      }, {
        key: "_fireEvent",
        value: function _fireEvent(ev, e) {
          var listeners = this._listeners[ev];
          if (!listeners) return;
          listeners.forEach(function (l) {
            return l(e);
          });
        } /** Current selection start */
      }, {
        key: "_saveSelection",
        /** Stores current selection */value: function _saveSelection() {
          if (this.displayValue !== this.el.value) {
            console.warn('Element value was changed outside of mask. Syncronize mask using `mask.updateValue()` to work properly.'); // eslint-disable-line no-console
          }

          this._selection = {
            start: this.selectionStart,
            end: this.cursorPos
          };
        } /* ev */ /** Syncronizes model value from view */
      }, {
        key: "updateValue",
        value: function updateValue() {
          this.masked.value = this.el.value;
          this._value = this.masked.value;
          this._unmaskedValue = this.masked.unmaskedValue;
          this._rawInputValue = this.masked.rawInputValue;
        } /** Syncronizes view from model value, fires change events */
      }, {
        key: "updateControl",
        value: function updateControl(cursorPos) {
          var newUnmaskedValue = this.masked.unmaskedValue;
          var newValue = this.masked.value;
          var newRawInputValue = this.masked.rawInputValue;
          var newDisplayValue = this.displayValue;
          var isChanged = this.unmaskedValue !== newUnmaskedValue || this.value !== newValue || this._rawInputValue !== newRawInputValue;
          this._unmaskedValue = newUnmaskedValue;
          this._value = newValue;
          this._rawInputValue = newRawInputValue;
          if (this.el.value !== newDisplayValue) this.el.value = newDisplayValue;
          if (cursorPos === 'auto') this.alignCursor();else if (cursorPos != null) this.cursorPos = cursorPos;
          if (isChanged) this._fireChangeEvents();
          if (!this._historyChanging && (isChanged || this.history.isEmpty)) this.history.push({
            unmaskedValue: newUnmaskedValue,
            selection: {
              start: this.selectionStart,
              end: this.cursorPos
            }
          });
        } /** Updates options with deep equal check, recreates {@link Masked} model if mask type changes */
      }, {
        key: "updateOptions",
        value: function updateOptions(opts) {
          var mask = opts.mask,
            restOpts = babelHelpers.objectWithoutProperties(opts, _excluded2); // TODO types, yes, mask is optional

          var updateMask = !this.maskEquals(mask);
          var updateOpts = this.masked.optionsIsChanged(restOpts);
          if (updateMask) this.mask = mask;
          if (updateOpts) this.masked.updateOptions(restOpts); // TODO

          if (updateMask || updateOpts) this.updateControl();
        } /** Updates cursor */
      }, {
        key: "updateCursor",
        value: function updateCursor(cursorPos) {
          if (cursorPos == null) return;
          this.cursorPos = cursorPos;

          // also queue change cursor for mobile browsers
          this._delayUpdateCursor(cursorPos);
        } /** Delays cursor update to support mobile browsers */
      }, {
        key: "_delayUpdateCursor",
        value: function _delayUpdateCursor(cursorPos) {
          var _this3 = this;
          this._abortUpdateCursor();
          this._changingCursorPos = cursorPos;
          this._cursorChanging = setTimeout(function () {
            if (!_this3.el) return; // if was destroyed
            _this3.cursorPos = _this3._changingCursorPos;
            _this3._abortUpdateCursor();
          }, 10);
        } /** Fires custom events */
      }, {
        key: "_fireChangeEvents",
        value: function _fireChangeEvents() {
          this._fireEvent('accept', this._inputEvent);
          if (this.masked.isComplete) this._fireEvent('complete', this._inputEvent);
        } /** Aborts delayed cursor update */
      }, {
        key: "_abortUpdateCursor",
        value: function _abortUpdateCursor() {
          if (this._cursorChanging) {
            clearTimeout(this._cursorChanging);
            delete this._cursorChanging;
          }
        } /** Aligns cursor to nearest available position */
      }, {
        key: "alignCursor",
        value: function alignCursor() {
          this.cursorPos = this.masked.nearestInputPos(this.masked.nearestInputPos(this.cursorPos, DIRECTION.LEFT));
        } /** Aligns cursor only if selection is empty */
      }, {
        key: "alignCursorFriendly",
        value: function alignCursorFriendly() {
          if (this.selectionStart !== this.cursorPos) return; // skip if range is selected
          this.alignCursor();
        } /** Adds listener on custom event */
      }, {
        key: "on",
        value: function on(ev, handler) {
          if (!this._listeners[ev]) this._listeners[ev] = [];
          this._listeners[ev].push(handler);
          return this;
        } /** Removes custom event listener */
      }, {
        key: "off",
        value: function off(ev, handler) {
          if (!this._listeners[ev]) return this;
          if (!handler) {
            delete this._listeners[ev];
            return this;
          }
          var hIndex = this._listeners[ev].indexOf(handler);
          if (hIndex >= 0) this._listeners[ev].splice(hIndex, 1);
          return this;
        } /** Handles view input event */
      }, {
        key: "_onInput",
        value: function _onInput(e) {
          this._inputEvent = e;
          this._abortUpdateCursor();
          var details = new ActionDetails({
            // new state
            value: this.el.value,
            cursorPos: this.cursorPos,
            // old state
            oldValue: this.displayValue,
            oldSelection: this._selection
          });
          var oldRawValue = this.masked.rawInputValue;
          var offset = this.masked.splice(details.startChangePos, details.removed.length, details.inserted, details.removeDirection, {
            input: true,
            raw: true
          }).offset;

          // force align in remove direction only if no input chars were removed
          // otherwise we still need to align with NONE (to get out from fixed symbols for instance)
          var removeDirection = oldRawValue === this.masked.rawInputValue ? details.removeDirection : DIRECTION.NONE;
          var cursorPos = this.masked.nearestInputPos(details.startChangePos + offset, removeDirection);
          if (removeDirection !== DIRECTION.NONE) cursorPos = this.masked.nearestInputPos(cursorPos, DIRECTION.NONE);
          this.updateControl(cursorPos);
          delete this._inputEvent;
        } /** Handles view change event and commits model value */
      }, {
        key: "_onChange",
        value: function _onChange() {
          if (this.displayValue !== this.el.value) this.updateValue();
          this.masked.doCommit();
          this.updateControl();
          this._saveSelection();
        } /** Handles view drop event, prevents by default */
      }, {
        key: "_onDrop",
        value: function _onDrop(ev) {
          ev.preventDefault();
          ev.stopPropagation();
        } /** Restore last selection on focus */
      }, {
        key: "_onFocus",
        value: function _onFocus(ev) {
          this.alignCursorFriendly();
        } /** Restore last selection on focus */
      }, {
        key: "_onClick",
        value: function _onClick(ev) {
          this.alignCursorFriendly();
        }
      }, {
        key: "_onUndo",
        value: function _onUndo() {
          this._applyHistoryState(this.history.undo());
        }
      }, {
        key: "_onRedo",
        value: function _onRedo() {
          this._applyHistoryState(this.history.redo());
        }
      }, {
        key: "_applyHistoryState",
        value: function _applyHistoryState(state) {
          if (!state) return;
          this._historyChanging = true;
          this.unmaskedValue = state.unmaskedValue;
          this.el.select(state.selection.start, state.selection.end);
          this._saveSelection();
          this._historyChanging = false;
        } /** Unbind view events and removes element reference */
      }, {
        key: "destroy",
        value: function destroy() {
          this._unbindEvents();
          this._listeners.length = 0;
          delete this.el;
        }
      }, {
        key: "mask",
        get: function get() {
          return this.masked.mask;
        },
        set: function set(mask) {
          if (this.maskEquals(mask)) return;
          if (!(mask instanceof IMask.Masked) && this.masked.constructor === maskedClass(mask)) {
            // TODO "any" no idea
            this.masked.updateOptions({
              mask: mask
            });
            return;
          }
          var masked = mask instanceof IMask.Masked ? mask : createMask({
            mask: mask
          });
          masked.unmaskedValue = this.masked.unmaskedValue;
          this.masked = masked;
        } /** Raw value */
      }, {
        key: "value",
        get: function get() {
          return this._value;
        },
        set: function set(str) {
          if (this.value === str) return;
          this.masked.value = str;
          this.updateControl('auto');
        } /** Unmasked value */
      }, {
        key: "unmaskedValue",
        get: function get() {
          return this._unmaskedValue;
        },
        set: function set(str) {
          if (this.unmaskedValue === str) return;
          this.masked.unmaskedValue = str;
          this.updateControl('auto');
        } /** Raw input value */
      }, {
        key: "rawInputValue",
        get: function get() {
          return this._rawInputValue;
        },
        set: function set(str) {
          if (this.rawInputValue === str) return;
          this.masked.rawInputValue = str;
          this.updateControl();
          this.alignCursor();
        } /** Typed unmasked value */
      }, {
        key: "typedValue",
        get: function get() {
          return this.masked.typedValue;
        },
        set: function set(val) {
          if (this.masked.typedValueEquals(val)) return;
          this.masked.typedValue = val;
          this.updateControl('auto');
        } /** Display value */
      }, {
        key: "displayValue",
        get: function get() {
          return this.masked.displayValue;
        }
      }, {
        key: "selectionStart",
        get: function get() {
          return this._cursorChanging ? this._changingCursorPos : this.el.selectionStart;
        } /** Current cursor position */
      }, {
        key: "cursorPos",
        get: function get() {
          return this._cursorChanging ? this._changingCursorPos : this.el.selectionEnd;
        },
        set: function set(pos) {
          if (!this.el || !this.el.isActive) return;
          this.el.select(pos, pos);
          this._saveSelection();
        }
      }]);
      return InputMask;
    }();
    IMask.InputMask = InputMask;

    /** Provides details of changing model value */
    var ChangeDetails = /*#__PURE__*/function () {
      babelHelpers.createClass(ChangeDetails, null, [{
        key: "normalize",
        /** Inserted symbols */
        /** Additional offset if any changes occurred before tail */
        /** Raw inserted is used by dynamic mask */
        /** Can skip chars */
        value: function normalize(prep) {
          return Array.isArray(prep) ? prep : [prep, new ChangeDetails()];
        }
      }]);
      function ChangeDetails(details) {
        babelHelpers.classCallCheck(this, ChangeDetails);
        Object.assign(this, {
          inserted: '',
          rawInserted: '',
          tailShift: 0,
          skip: false
        }, details);
      }

      /** Aggregate changes */
      babelHelpers.createClass(ChangeDetails, [{
        key: "aggregate",
        value: function aggregate(details) {
          this.inserted += details.inserted;
          this.rawInserted += details.rawInserted;
          this.tailShift += details.tailShift;
          this.skip = this.skip || details.skip;
          return this;
        } /** Total offset considering all changes */
      }, {
        key: "equals",
        value: function equals(details) {
          return this.inserted === details.inserted && this.tailShift === details.tailShift && this.rawInserted === details.rawInserted && this.skip === details.skip;
        }
      }, {
        key: "offset",
        get: function get() {
          return this.tailShift + this.inserted.length;
        }
      }, {
        key: "consumed",
        get: function get() {
          return Boolean(this.rawInserted) || this.skip;
        }
      }]);
      return ChangeDetails;
    }();
    IMask.ChangeDetails = ChangeDetails;

    /** Provides details of continuous extracted tail */
    var ContinuousTailDetails = /*#__PURE__*/function () {
      /** Tail value as string */

      /** Tail start position */

      /** Start position */

      function ContinuousTailDetails(value, from, stop) {
        babelHelpers.classCallCheck(this, ContinuousTailDetails);
        if (value === void 0) {
          value = '';
        }
        if (from === void 0) {
          from = 0;
        }
        this.value = value;
        this.from = from;
        this.stop = stop;
      }
      babelHelpers.createClass(ContinuousTailDetails, [{
        key: "toString",
        value: function toString() {
          return this.value;
        }
      }, {
        key: "extend",
        value: function extend(tail) {
          this.value += String(tail);
        }
      }, {
        key: "appendTo",
        value: function appendTo(masked) {
          return masked.append(this.toString(), {
            tail: true
          }).aggregate(masked._appendPlaceholder());
        }
      }, {
        key: "unshift",
        value: function unshift(beforePos) {
          if (!this.value.length || beforePos != null && this.from >= beforePos) return '';
          var shiftChar = this.value[0];
          this.value = this.value.slice(1);
          return shiftChar;
        }
      }, {
        key: "shift",
        value: function shift() {
          if (!this.value.length) return '';
          var shiftChar = this.value[this.value.length - 1];
          this.value = this.value.slice(0, -1);
          return shiftChar;
        }
      }, {
        key: "state",
        get: function get() {
          return {
            value: this.value,
            from: this.from,
            stop: this.stop
          };
        },
        set: function set(state) {
          Object.assign(this, state);
        }
      }]);
      return ContinuousTailDetails;
    }();
    /** Append flags */
    /** Extract flags */
    // see https://github.com/microsoft/TypeScript/issues/6223
    /** Provides common masking stuff */
    var Masked = /*#__PURE__*/function () {
      /** */

      /** */

      /** Transforms value before mask processing */

      /** Transforms each char before mask processing */

      /** Validates if value is acceptable */

      /** Does additional processing at the end of editing */

      /** Format typed value to string */

      /** Parse string to get typed value */

      /** Enable characters overwriting */

      /** */

      /** */

      /** */

      /** */

      function Masked(opts) {
        babelHelpers.classCallCheck(this, Masked);
        this._value = '';
        this._update(_objectSpread(_objectSpread({}, Masked.DEFAULTS), opts));
        this._initialized = true;
      }

      /** Sets and applies new options */
      babelHelpers.createClass(Masked, [{
        key: "updateOptions",
        value: function updateOptions(opts) {
          if (!this.optionsIsChanged(opts)) return;
          this.withValueRefresh(this._update.bind(this, opts));
        } /** Sets new options */
      }, {
        key: "_update",
        value: function _update(opts) {
          Object.assign(this, opts);
        } /** Mask state */
      }, {
        key: "reset",
        /** Resets value */value: function reset() {
          this._value = '';
        }
      }, {
        key: "resolve",
        /** Resolve new value */value: function resolve(value, flags) {
          if (flags === void 0) {
            flags = {
              input: true
            };
          }
          this.reset();
          this.append(value, flags, '');
          this.doCommit();
        }
      }, {
        key: "nearestInputPos",
        /** Finds nearest input position in direction */value: function nearestInputPos(cursorPos, direction) {
          return cursorPos;
        }
      }, {
        key: "totalInputPositions",
        value: function totalInputPositions(fromPos, toPos) {
          if (fromPos === void 0) {
            fromPos = 0;
          }
          if (toPos === void 0) {
            toPos = this.displayValue.length;
          }
          return Math.min(this.displayValue.length, toPos - fromPos);
        } /** Extracts value in range considering flags */
      }, {
        key: "extractInput",
        value: function extractInput(fromPos, toPos, flags) {
          if (fromPos === void 0) {
            fromPos = 0;
          }
          if (toPos === void 0) {
            toPos = this.displayValue.length;
          }
          return this.displayValue.slice(fromPos, toPos);
        } /** Extracts tail in range */
      }, {
        key: "extractTail",
        value: function extractTail(fromPos, toPos) {
          if (fromPos === void 0) {
            fromPos = 0;
          }
          if (toPos === void 0) {
            toPos = this.displayValue.length;
          }
          return new ContinuousTailDetails(this.extractInput(fromPos, toPos), fromPos);
        } /** Appends tail */
      }, {
        key: "appendTail",
        value: function appendTail(tail) {
          if (isString(tail)) tail = new ContinuousTailDetails(String(tail));
          return tail.appendTo(this);
        } /** Appends char */
      }, {
        key: "_appendCharRaw",
        value: function _appendCharRaw(ch, flags) {
          if (!ch) return new ChangeDetails();
          this._value += ch;
          return new ChangeDetails({
            inserted: ch,
            rawInserted: ch
          });
        } /** Appends char */
      }, {
        key: "_appendChar",
        value: function _appendChar(ch, flags, checkTail) {
          if (flags === void 0) {
            flags = {};
          }
          var consistentState = this.state;
          var details;
          var _this$doPrepareChar = this.doPrepareChar(ch, flags);
          var _this$doPrepareChar2 = babelHelpers.slicedToArray(_this$doPrepareChar, 2);
          ch = _this$doPrepareChar2[0];
          details = _this$doPrepareChar2[1];
          if (ch) {
            details = details.aggregate(this._appendCharRaw(ch, flags));

            // TODO handle `skip`?

            // try `autofix` lookahead
            if (!details.rawInserted && this.autofix === 'pad') {
              var noFixState = this.state;
              this.state = consistentState;
              var fixDetails = this.pad(flags);
              var chDetails = this._appendCharRaw(ch, flags);
              fixDetails = fixDetails.aggregate(chDetails);

              // if fix was applied or
              // if details are equal use skip restoring state optimization
              if (chDetails.rawInserted || fixDetails.equals(details)) {
                details = fixDetails;
              } else {
                this.state = noFixState;
              }
            }
          }
          if (details.inserted) {
            var consistentTail;
            var appended = this.doValidate(flags) !== false;
            if (appended && checkTail != null) {
              // validation ok, check tail
              var beforeTailState = this.state;
              if (this.overwrite === true) {
                consistentTail = checkTail.state;
                for (var i = 0; i < details.rawInserted.length; ++i) {
                  checkTail.unshift(this.displayValue.length - details.tailShift);
                }
              }
              var tailDetails = this.appendTail(checkTail);
              appended = tailDetails.rawInserted.length === checkTail.toString().length;

              // not ok, try shift
              if (!(appended && tailDetails.inserted) && this.overwrite === 'shift') {
                this.state = beforeTailState;
                consistentTail = checkTail.state;
                for (var _i = 0; _i < details.rawInserted.length; ++_i) {
                  checkTail.shift();
                }
                tailDetails = this.appendTail(checkTail);
                appended = tailDetails.rawInserted.length === checkTail.toString().length;
              }

              // if ok, rollback state after tail
              if (appended && tailDetails.inserted) this.state = beforeTailState;
            }

            // revert all if something went wrong
            if (!appended) {
              details = new ChangeDetails();
              this.state = consistentState;
              if (checkTail && consistentTail) checkTail.state = consistentTail;
            }
          }
          return details;
        } /** Appends optional placeholder at the end */
      }, {
        key: "_appendPlaceholder",
        value: function _appendPlaceholder() {
          return new ChangeDetails();
        } /** Appends optional eager placeholder at the end */
      }, {
        key: "_appendEager",
        value: function _appendEager() {
          return new ChangeDetails();
        } /** Appends symbols considering flags */
      }, {
        key: "append",
        value: function append(str, flags, tail) {
          if (!isString(str)) throw new Error('value should be string');
          var checkTail = isString(tail) ? new ContinuousTailDetails(String(tail)) : tail;
          if (flags != null && flags.tail) flags._beforeTailState = this.state;
          var details;
          var _this$doPrepare = this.doPrepare(str, flags);
          var _this$doPrepare2 = babelHelpers.slicedToArray(_this$doPrepare, 2);
          str = _this$doPrepare2[0];
          details = _this$doPrepare2[1];
          for (var ci = 0; ci < str.length; ++ci) {
            var d = this._appendChar(str[ci], flags, checkTail);
            if (!d.rawInserted && !this.doSkipInvalid(str[ci], flags, checkTail)) break;
            details.aggregate(d);
          }
          if ((this.eager === true || this.eager === 'append') && flags != null && flags.input && str) {
            details.aggregate(this._appendEager());
          }

          // append tail but aggregate only tailShift
          if (checkTail != null) {
            details.tailShift += this.appendTail(checkTail).tailShift;
            // TODO it's a good idea to clear state after appending ends
            // but it causes bugs when one append calls another (when dynamic dispatch set rawInputValue)
            // this._resetBeforeTailState();
          }

          return details;
        }
      }, {
        key: "remove",
        value: function remove(fromPos, toPos) {
          if (fromPos === void 0) {
            fromPos = 0;
          }
          if (toPos === void 0) {
            toPos = this.displayValue.length;
          }
          this._value = this.displayValue.slice(0, fromPos) + this.displayValue.slice(toPos);
          return new ChangeDetails();
        } /** Calls function and reapplies current value */
      }, {
        key: "withValueRefresh",
        value: function withValueRefresh(fn) {
          if (this._refreshing || !this._initialized) return fn();
          this._refreshing = true;
          var rawInput = this.rawInputValue;
          var value = this.value;
          var ret = fn();
          this.rawInputValue = rawInput;
          // append lost trailing chars at the end
          if (this.value && this.value !== value && value.indexOf(this.value) === 0) {
            this.append(value.slice(this.displayValue.length), {}, '');
            this.doCommit();
          }
          delete this._refreshing;
          return ret;
        }
      }, {
        key: "runIsolated",
        value: function runIsolated(fn) {
          if (this._isolated || !this._initialized) return fn(this);
          this._isolated = true;
          var state = this.state;
          var ret = fn(this);
          this.state = state;
          delete this._isolated;
          return ret;
        }
      }, {
        key: "doSkipInvalid",
        value: function doSkipInvalid(ch, flags, checkTail) {
          return Boolean(this.skipInvalid);
        } /** Prepares string before mask processing */
      }, {
        key: "doPrepare",
        value: function doPrepare(str, flags) {
          if (flags === void 0) {
            flags = {};
          }
          return ChangeDetails.normalize(this.prepare ? this.prepare(str, this, flags) : str);
        } /** Prepares each char before mask processing */
      }, {
        key: "doPrepareChar",
        value: function doPrepareChar(str, flags) {
          if (flags === void 0) {
            flags = {};
          }
          return ChangeDetails.normalize(this.prepareChar ? this.prepareChar(str, this, flags) : str);
        } /** Validates if value is acceptable */
      }, {
        key: "doValidate",
        value: function doValidate(flags) {
          return (!this.validate || this.validate(this.value, this, flags)) && (!this.parent || this.parent.doValidate(flags));
        } /** Does additional processing at the end of editing */
      }, {
        key: "doCommit",
        value: function doCommit() {
          if (this.commit) this.commit(this.value, this);
        }
      }, {
        key: "splice",
        value: function splice(start, deleteCount, inserted, removeDirection, flags) {
          if (inserted === void 0) {
            inserted = '';
          }
          if (removeDirection === void 0) {
            removeDirection = DIRECTION.NONE;
          }
          if (flags === void 0) {
            flags = {
              input: true
            };
          }
          var tailPos = start + deleteCount;
          var tail = this.extractTail(tailPos);
          var eagerRemove = this.eager === true || this.eager === 'remove';
          var oldRawValue;
          if (eagerRemove) {
            removeDirection = forceDirection(removeDirection);
            oldRawValue = this.extractInput(0, tailPos, {
              raw: true
            });
          }
          var startChangePos = start;
          var details = new ChangeDetails();

          // if it is just deletion without insertion
          if (removeDirection !== DIRECTION.NONE) {
            startChangePos = this.nearestInputPos(start, deleteCount > 1 && start !== 0 && !eagerRemove ? DIRECTION.NONE : removeDirection);

            // adjust tailShift if start was aligned
            details.tailShift = startChangePos - start;
          }
          details.aggregate(this.remove(startChangePos));
          if (eagerRemove && removeDirection !== DIRECTION.NONE && oldRawValue === this.rawInputValue) {
            if (removeDirection === DIRECTION.FORCE_LEFT) {
              var valLength;
              while (oldRawValue === this.rawInputValue && (valLength = this.displayValue.length)) {
                details.aggregate(new ChangeDetails({
                  tailShift: -1
                })).aggregate(this.remove(valLength - 1));
              }
            } else if (removeDirection === DIRECTION.FORCE_RIGHT) {
              tail.unshift();
            }
          }
          return details.aggregate(this.append(inserted, flags, tail));
        }
      }, {
        key: "maskEquals",
        value: function maskEquals(mask) {
          return this.mask === mask;
        }
      }, {
        key: "optionsIsChanged",
        value: function optionsIsChanged(opts) {
          return !objectIncludes(this, opts);
        }
      }, {
        key: "typedValueEquals",
        value: function typedValueEquals(value) {
          var tval = this.typedValue;
          return value === tval || Masked.EMPTY_VALUES.includes(value) && Masked.EMPTY_VALUES.includes(tval) || (this.format ? this.format(value, this) === this.format(this.typedValue, this) : false);
        }
      }, {
        key: "pad",
        value: function pad(flags) {
          return new ChangeDetails();
        }
      }, {
        key: "state",
        get: function get() {
          return {
            _value: this.value,
            _rawInputValue: this.rawInputValue
          };
        },
        set: function set(state) {
          this._value = state._value;
        }
      }, {
        key: "value",
        get: function get() {
          return this._value;
        },
        set: function set(value) {
          this.resolve(value, {
            input: true
          });
        }
      }, {
        key: "unmaskedValue",
        get: function get() {
          return this.value;
        },
        set: function set(value) {
          this.resolve(value, {});
        }
      }, {
        key: "typedValue",
        get: function get() {
          return this.parse ? this.parse(this.value, this) : this.unmaskedValue;
        },
        set: function set(value) {
          if (this.format) {
            this.value = this.format(value, this);
          } else {
            this.unmaskedValue = String(value);
          }
        } /** Value that includes raw user input */
      }, {
        key: "rawInputValue",
        get: function get() {
          return this.extractInput(0, this.displayValue.length, {
            raw: true
          });
        },
        set: function set(value) {
          this.resolve(value, {
            raw: true
          });
        }
      }, {
        key: "displayValue",
        get: function get() {
          return this.value;
        }
      }, {
        key: "isComplete",
        get: function get() {
          return true;
        }
      }, {
        key: "isFilled",
        get: function get() {
          return this.isComplete;
        }
      }]);
      return Masked;
    }();
    Masked.DEFAULTS = {
      skipInvalid: true
    };
    Masked.EMPTY_VALUES = [undefined, null, ''];
    IMask.Masked = Masked;
    var ChunksTailDetails = /*#__PURE__*/function () {
      /** */

      function ChunksTailDetails(chunks, from) {
        babelHelpers.classCallCheck(this, ChunksTailDetails);
        if (chunks === void 0) {
          chunks = [];
        }
        if (from === void 0) {
          from = 0;
        }
        this.chunks = chunks;
        this.from = from;
      }
      babelHelpers.createClass(ChunksTailDetails, [{
        key: "toString",
        value: function toString() {
          return this.chunks.map(String).join('');
        }
      }, {
        key: "extend",
        value: function extend(tailChunk) {
          if (!String(tailChunk)) return;
          tailChunk = isString(tailChunk) ? new ContinuousTailDetails(String(tailChunk)) : tailChunk;
          var lastChunk = this.chunks[this.chunks.length - 1];
          var extendLast = lastChunk && (
          // if stops are same or tail has no stop
          lastChunk.stop === tailChunk.stop || tailChunk.stop == null) &&
          // if tail chunk goes just after last chunk
          tailChunk.from === lastChunk.from + lastChunk.toString().length;
          if (tailChunk instanceof ContinuousTailDetails) {
            // check the ability to extend previous chunk
            if (extendLast) {
              // extend previous chunk
              lastChunk.extend(tailChunk.toString());
            } else {
              // append new chunk
              this.chunks.push(tailChunk);
            }
          } else if (tailChunk instanceof ChunksTailDetails) {
            if (tailChunk.stop == null) {
              // unwrap floating chunks to parent, keeping `from` pos
              var firstTailChunk;
              while (tailChunk.chunks.length && tailChunk.chunks[0].stop == null) {
                firstTailChunk = tailChunk.chunks.shift(); // not possible to be `undefined` because length was checked above
                firstTailChunk.from += tailChunk.from;
                this.extend(firstTailChunk);
              }
            }

            // if tail chunk still has value
            if (tailChunk.toString()) {
              // if chunks contains stops, then popup stop to container
              tailChunk.stop = tailChunk.blockIndex;
              this.chunks.push(tailChunk);
            }
          }
        }
      }, {
        key: "appendTo",
        value: function appendTo(masked) {
          if (!(masked instanceof IMask.MaskedPattern)) {
            var tail = new ContinuousTailDetails(this.toString());
            return tail.appendTo(masked);
          }
          var details = new ChangeDetails();
          for (var ci = 0; ci < this.chunks.length; ++ci) {
            var chunk = this.chunks[ci];
            var lastBlockIter = masked._mapPosToBlock(masked.displayValue.length);
            var stop = chunk.stop;
            var chunkBlock = void 0;
            if (stop != null && (
            // if block not found or stop is behind lastBlock
            !lastBlockIter || lastBlockIter.index <= stop)) {
              if (chunk instanceof ChunksTailDetails ||
              // for continuous block also check if stop is exist
              masked._stops.indexOf(stop) >= 0) {
                details.aggregate(masked._appendPlaceholder(stop));
              }
              chunkBlock = chunk instanceof ChunksTailDetails && masked._blocks[stop];
            }
            if (chunkBlock) {
              var tailDetails = chunkBlock.appendTail(chunk);
              details.aggregate(tailDetails);

              // get not inserted chars
              var remainChars = chunk.toString().slice(tailDetails.rawInserted.length);
              if (remainChars) details.aggregate(masked.append(remainChars, {
                tail: true
              }));
            } else {
              details.aggregate(masked.append(chunk.toString(), {
                tail: true
              }));
            }
          }
          return details;
        }
      }, {
        key: "unshift",
        value: function unshift(beforePos) {
          if (!this.chunks.length || beforePos != null && this.from >= beforePos) return '';
          var chunkShiftPos = beforePos != null ? beforePos - this.from : beforePos;
          var ci = 0;
          while (ci < this.chunks.length) {
            var chunk = this.chunks[ci];
            var shiftChar = chunk.unshift(chunkShiftPos);
            if (chunk.toString()) {
              // chunk still contains value
              // but not shifted - means no more available chars to shift
              if (!shiftChar) break;
              ++ci;
            } else {
              // clean if chunk has no value
              this.chunks.splice(ci, 1);
            }
            if (shiftChar) return shiftChar;
          }
          return '';
        }
      }, {
        key: "shift",
        value: function shift() {
          if (!this.chunks.length) return '';
          var ci = this.chunks.length - 1;
          while (0 <= ci) {
            var chunk = this.chunks[ci];
            var shiftChar = chunk.shift();
            if (chunk.toString()) {
              // chunk still contains value
              // but not shifted - means no more available chars to shift
              if (!shiftChar) break;
              --ci;
            } else {
              // clean if chunk has no value
              this.chunks.splice(ci, 1);
            }
            if (shiftChar) return shiftChar;
          }
          return '';
        }
      }, {
        key: "state",
        get: function get() {
          return {
            chunks: this.chunks.map(function (c) {
              return c.state;
            }),
            from: this.from,
            stop: this.stop,
            blockIndex: this.blockIndex
          };
        },
        set: function set(state) {
          var chunks = state.chunks,
            props = babelHelpers.objectWithoutProperties(state, _excluded3);
          Object.assign(this, props);
          this.chunks = chunks.map(function (cstate) {
            var chunk = "chunks" in cstate ? new ChunksTailDetails() : new ContinuousTailDetails();
            chunk.state = cstate;
            return chunk;
          });
        }
      }]);
      return ChunksTailDetails;
    }();
    var PatternCursor = /*#__PURE__*/function () {
      function PatternCursor(masked, pos) {
        babelHelpers.classCallCheck(this, PatternCursor);
        this.masked = masked;
        this._log = [];
        var _ref7 = masked._mapPosToBlock(pos) || (pos < 0 ?
          // first
          {
            index: 0,
            offset: 0
          } :
          // last
          {
            index: this.masked._blocks.length,
            offset: 0
          }),
          offset = _ref7.offset,
          index = _ref7.index;
        this.offset = offset;
        this.index = index;
        this.ok = false;
      }
      babelHelpers.createClass(PatternCursor, [{
        key: "pushState",
        value: function pushState() {
          this._log.push(this.state);
        }
      }, {
        key: "popState",
        value: function popState() {
          var s = this._log.pop();
          if (s) this.state = s;
          return s;
        }
      }, {
        key: "bindBlock",
        value: function bindBlock() {
          if (this.block) return;
          if (this.index < 0) {
            this.index = 0;
            this.offset = 0;
          }
          if (this.index >= this.masked._blocks.length) {
            this.index = this.masked._blocks.length - 1;
            this.offset = this.block.displayValue.length; // TODO this is stupid type error, `block` depends on index that was changed above
          }
        }
      }, {
        key: "_pushLeft",
        value: function _pushLeft(fn) {
          this.pushState();
          for (this.bindBlock(); 0 <= this.index; --this.index, this.offset = ((_this$block = this.block) == null ? void 0 : _this$block.displayValue.length) || 0) {
            var _this$block;
            if (fn()) return this.ok = true;
          }
          return this.ok = false;
        }
      }, {
        key: "_pushRight",
        value: function _pushRight(fn) {
          this.pushState();
          for (this.bindBlock(); this.index < this.masked._blocks.length; ++this.index, this.offset = 0) {
            if (fn()) return this.ok = true;
          }
          return this.ok = false;
        }
      }, {
        key: "pushLeftBeforeFilled",
        value: function pushLeftBeforeFilled() {
          var _this4 = this;
          return this._pushLeft(function () {
            if (_this4.block.isFixed || !_this4.block.value) return;
            _this4.offset = _this4.block.nearestInputPos(_this4.offset, DIRECTION.FORCE_LEFT);
            if (_this4.offset !== 0) return true;
          });
        }
      }, {
        key: "pushLeftBeforeInput",
        value: function pushLeftBeforeInput() {
          var _this5 = this;
          // cases:
          // filled input: 00|
          // optional empty input: 00[]|
          // nested block: XX<[]>|
          return this._pushLeft(function () {
            if (_this5.block.isFixed) return;
            _this5.offset = _this5.block.nearestInputPos(_this5.offset, DIRECTION.LEFT);
            return true;
          });
        }
      }, {
        key: "pushLeftBeforeRequired",
        value: function pushLeftBeforeRequired() {
          var _this6 = this;
          return this._pushLeft(function () {
            if (_this6.block.isFixed || _this6.block.isOptional && !_this6.block.value) return;
            _this6.offset = _this6.block.nearestInputPos(_this6.offset, DIRECTION.LEFT);
            return true;
          });
        }
      }, {
        key: "pushRightBeforeFilled",
        value: function pushRightBeforeFilled() {
          var _this7 = this;
          return this._pushRight(function () {
            if (_this7.block.isFixed || !_this7.block.value) return;
            _this7.offset = _this7.block.nearestInputPos(_this7.offset, DIRECTION.FORCE_RIGHT);
            if (_this7.offset !== _this7.block.value.length) return true;
          });
        }
      }, {
        key: "pushRightBeforeInput",
        value: function pushRightBeforeInput() {
          var _this8 = this;
          return this._pushRight(function () {
            if (_this8.block.isFixed) return;

            // const o = this.offset;
            _this8.offset = _this8.block.nearestInputPos(_this8.offset, DIRECTION.NONE);
            // HACK cases like (STILL DOES NOT WORK FOR NESTED)
            // aa|X
            // aa<X|[]>X_    - this will not work
            // if (o && o === this.offset && this.block instanceof PatternInputDefinition) continue;
            return true;
          });
        }
      }, {
        key: "pushRightBeforeRequired",
        value: function pushRightBeforeRequired() {
          var _this9 = this;
          return this._pushRight(function () {
            if (_this9.block.isFixed || _this9.block.isOptional && !_this9.block.value) return;

            // TODO check |[*]XX_
            _this9.offset = _this9.block.nearestInputPos(_this9.offset, DIRECTION.NONE);
            return true;
          });
        }
      }, {
        key: "block",
        get: function get() {
          return this.masked._blocks[this.index];
        }
      }, {
        key: "pos",
        get: function get() {
          return this.masked._blockStartPos(this.index) + this.offset;
        }
      }, {
        key: "state",
        get: function get() {
          return {
            index: this.index,
            offset: this.offset,
            ok: this.ok
          };
        },
        set: function set(s) {
          Object.assign(this, s);
        }
      }]);
      return PatternCursor;
    }();
    var PatternFixedDefinition = /*#__PURE__*/function () {
      /** */

      /** */

      /** */

      /** */

      /** */

      /** */

      function PatternFixedDefinition(opts) {
        babelHelpers.classCallCheck(this, PatternFixedDefinition);
        Object.assign(this, opts);
        this._value = '';
        this.isFixed = true;
      }
      babelHelpers.createClass(PatternFixedDefinition, [{
        key: "reset",
        value: function reset() {
          this._isRawInput = false;
          this._value = '';
        }
      }, {
        key: "remove",
        value: function remove(fromPos, toPos) {
          if (fromPos === void 0) {
            fromPos = 0;
          }
          if (toPos === void 0) {
            toPos = this._value.length;
          }
          this._value = this._value.slice(0, fromPos) + this._value.slice(toPos);
          if (!this._value) this._isRawInput = false;
          return new ChangeDetails();
        }
      }, {
        key: "nearestInputPos",
        value: function nearestInputPos(cursorPos, direction) {
          if (direction === void 0) {
            direction = DIRECTION.NONE;
          }
          var minPos = 0;
          var maxPos = this._value.length;
          switch (direction) {
            case DIRECTION.LEFT:
            case DIRECTION.FORCE_LEFT:
              return minPos;
            case DIRECTION.NONE:
            case DIRECTION.RIGHT:
            case DIRECTION.FORCE_RIGHT:
            default:
              return maxPos;
          }
        }
      }, {
        key: "totalInputPositions",
        value: function totalInputPositions(fromPos, toPos) {
          if (fromPos === void 0) {
            fromPos = 0;
          }
          if (toPos === void 0) {
            toPos = this._value.length;
          }
          return this._isRawInput ? toPos - fromPos : 0;
        }
      }, {
        key: "extractInput",
        value: function extractInput(fromPos, toPos, flags) {
          if (fromPos === void 0) {
            fromPos = 0;
          }
          if (toPos === void 0) {
            toPos = this._value.length;
          }
          if (flags === void 0) {
            flags = {};
          }
          return flags.raw && this._isRawInput && this._value.slice(fromPos, toPos) || '';
        }
      }, {
        key: "_appendChar",
        value: function _appendChar(ch, flags) {
          if (flags === void 0) {
            flags = {};
          }
          if (this.isFilled) return new ChangeDetails();
          var appendEager = this.eager === true || this.eager === 'append';
          var appended = this["char"] === ch;
          var isResolved = appended && (this.isUnmasking || flags.input || flags.raw) && (!flags.raw || !appendEager) && !flags.tail;
          var details = new ChangeDetails({
            inserted: this["char"],
            rawInserted: isResolved ? this["char"] : ''
          });
          this._value = this["char"];
          this._isRawInput = isResolved && (flags.raw || flags.input);
          return details;
        }
      }, {
        key: "_appendEager",
        value: function _appendEager() {
          return this._appendChar(this["char"], {
            tail: true
          });
        }
      }, {
        key: "_appendPlaceholder",
        value: function _appendPlaceholder() {
          var details = new ChangeDetails();
          if (this.isFilled) return details;
          this._value = details.inserted = this["char"];
          return details;
        }
      }, {
        key: "extractTail",
        value: function extractTail() {
          return new ContinuousTailDetails('');
        }
      }, {
        key: "appendTail",
        value: function appendTail(tail) {
          if (isString(tail)) tail = new ContinuousTailDetails(String(tail));
          return tail.appendTo(this);
        }
      }, {
        key: "append",
        value: function append(str, flags, tail) {
          var details = this._appendChar(str[0], flags);
          if (tail != null) {
            details.tailShift += this.appendTail(tail).tailShift;
          }
          return details;
        }
      }, {
        key: "doCommit",
        value: function doCommit() {}
      }, {
        key: "pad",
        value: function pad(flags) {
          return this._appendPlaceholder();
        }
      }, {
        key: "value",
        get: function get() {
          return this._value;
        }
      }, {
        key: "unmaskedValue",
        get: function get() {
          return this.isUnmasking ? this.value : '';
        }
      }, {
        key: "rawInputValue",
        get: function get() {
          return this._isRawInput ? this.value : '';
        }
      }, {
        key: "displayValue",
        get: function get() {
          return this.value;
        }
      }, {
        key: "isComplete",
        get: function get() {
          return true;
        }
      }, {
        key: "isFilled",
        get: function get() {
          return Boolean(this._value);
        }
      }, {
        key: "state",
        get: function get() {
          return {
            _value: this._value,
            _rawInputValue: this.rawInputValue
          };
        },
        set: function set(state) {
          this._value = state._value;
          this._isRawInput = Boolean(state._rawInputValue);
        }
      }]);
      return PatternFixedDefinition;
    }();
    var PatternInputDefinition = /*#__PURE__*/function () {
      /** */

      /** */

      /** */

      /** */

      /** */

      /** */

      /** */

      /** */

      function PatternInputDefinition(opts) {
        babelHelpers.classCallCheck(this, PatternInputDefinition);
        var parent = opts.parent,
          isOptional = opts.isOptional,
          placeholderChar = opts.placeholderChar,
          displayChar = opts.displayChar,
          lazy = opts.lazy,
          eager = opts.eager,
          maskOpts = babelHelpers.objectWithoutProperties(opts, _excluded4);
        this.masked = createMask(maskOpts);
        Object.assign(this, {
          parent: parent,
          isOptional: isOptional,
          placeholderChar: placeholderChar,
          displayChar: displayChar,
          lazy: lazy,
          eager: eager
        });
      }
      babelHelpers.createClass(PatternInputDefinition, [{
        key: "reset",
        value: function reset() {
          this.isFilled = false;
          this.masked.reset();
        }
      }, {
        key: "remove",
        value: function remove(fromPos, toPos) {
          if (fromPos === void 0) {
            fromPos = 0;
          }
          if (toPos === void 0) {
            toPos = this.value.length;
          }
          if (fromPos === 0 && toPos >= 1) {
            this.isFilled = false;
            return this.masked.remove(fromPos, toPos);
          }
          return new ChangeDetails();
        }
      }, {
        key: "_appendChar",
        value: function _appendChar(ch, flags) {
          if (flags === void 0) {
            flags = {};
          }
          if (this.isFilled) return new ChangeDetails();
          var state = this.masked.state;
          // simulate input
          var details = this.masked._appendChar(ch, this.currentMaskFlags(flags));
          if (details.inserted && this.doValidate(flags) === false) {
            details = new ChangeDetails();
            this.masked.state = state;
          }
          if (!details.inserted && !this.isOptional && !this.lazy && !flags.input) {
            details.inserted = this.placeholderChar;
          }
          details.skip = !details.inserted && !this.isOptional;
          this.isFilled = Boolean(details.inserted);
          return details;
        }
      }, {
        key: "append",
        value: function append(str, flags, tail) {
          // TODO probably should be done via _appendChar
          return this.masked.append(str, this.currentMaskFlags(flags), tail);
        }
      }, {
        key: "_appendPlaceholder",
        value: function _appendPlaceholder() {
          if (this.isFilled || this.isOptional) return new ChangeDetails();
          this.isFilled = true;
          return new ChangeDetails({
            inserted: this.placeholderChar
          });
        }
      }, {
        key: "_appendEager",
        value: function _appendEager() {
          return new ChangeDetails();
        }
      }, {
        key: "extractTail",
        value: function extractTail(fromPos, toPos) {
          return this.masked.extractTail(fromPos, toPos);
        }
      }, {
        key: "appendTail",
        value: function appendTail(tail) {
          return this.masked.appendTail(tail);
        }
      }, {
        key: "extractInput",
        value: function extractInput(fromPos, toPos, flags) {
          if (fromPos === void 0) {
            fromPos = 0;
          }
          if (toPos === void 0) {
            toPos = this.value.length;
          }
          return this.masked.extractInput(fromPos, toPos, flags);
        }
      }, {
        key: "nearestInputPos",
        value: function nearestInputPos(cursorPos, direction) {
          if (direction === void 0) {
            direction = DIRECTION.NONE;
          }
          var minPos = 0;
          var maxPos = this.value.length;
          var boundPos = Math.min(Math.max(cursorPos, minPos), maxPos);
          switch (direction) {
            case DIRECTION.LEFT:
            case DIRECTION.FORCE_LEFT:
              return this.isComplete ? boundPos : minPos;
            case DIRECTION.RIGHT:
            case DIRECTION.FORCE_RIGHT:
              return this.isComplete ? boundPos : maxPos;
            case DIRECTION.NONE:
            default:
              return boundPos;
          }
        }
      }, {
        key: "totalInputPositions",
        value: function totalInputPositions(fromPos, toPos) {
          if (fromPos === void 0) {
            fromPos = 0;
          }
          if (toPos === void 0) {
            toPos = this.value.length;
          }
          return this.value.slice(fromPos, toPos).length;
        }
      }, {
        key: "doValidate",
        value: function doValidate(flags) {
          return this.masked.doValidate(this.currentMaskFlags(flags)) && (!this.parent || this.parent.doValidate(this.currentMaskFlags(flags)));
        }
      }, {
        key: "doCommit",
        value: function doCommit() {
          this.masked.doCommit();
        }
      }, {
        key: "currentMaskFlags",
        value: function currentMaskFlags(flags) {
          var _flags$_beforeTailSta;
          return _objectSpread(_objectSpread({}, flags), {}, {
            _beforeTailState: (flags == null || (_flags$_beforeTailSta = flags._beforeTailState) == null ? void 0 : _flags$_beforeTailSta.masked) || (flags == null ? void 0 : flags._beforeTailState)
          });
        }
      }, {
        key: "pad",
        value: function pad(flags) {
          return new ChangeDetails();
        }
      }, {
        key: "value",
        get: function get() {
          return this.masked.value || (this.isFilled && !this.isOptional ? this.placeholderChar : '');
        }
      }, {
        key: "unmaskedValue",
        get: function get() {
          return this.masked.unmaskedValue;
        }
      }, {
        key: "rawInputValue",
        get: function get() {
          return this.masked.rawInputValue;
        }
      }, {
        key: "displayValue",
        get: function get() {
          return this.masked.value && this.displayChar || this.value;
        }
      }, {
        key: "isComplete",
        get: function get() {
          return Boolean(this.masked.value) || this.isOptional;
        }
      }, {
        key: "state",
        get: function get() {
          return {
            _value: this.value,
            _rawInputValue: this.rawInputValue,
            masked: this.masked.state,
            isFilled: this.isFilled
          };
        },
        set: function set(state) {
          this.masked.state = state.masked;
          this.isFilled = state.isFilled;
        }
      }]);
      return PatternInputDefinition;
    }();
    PatternInputDefinition.DEFAULT_DEFINITIONS = {
      '0': /\d/,
      'a': /[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
      // http://stackoverflow.com/a/22075070
      '*': /./
    };

    /** Masking by RegExp */
    var MaskedRegExp = /*#__PURE__*/function (_Masked) {
      babelHelpers.inherits(MaskedRegExp, _Masked);
      function MaskedRegExp() {
        babelHelpers.classCallCheck(this, MaskedRegExp);
        return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(MaskedRegExp).apply(this, arguments));
      }
      babelHelpers.createClass(MaskedRegExp, [{
        key: "updateOptions",
        /** */
        /** Enable characters overwriting */
        /** */
        /** */
        /** */
        value: function updateOptions(opts) {
          babelHelpers.get(babelHelpers.getPrototypeOf(MaskedRegExp.prototype), "updateOptions", this).call(this, opts);
        }
      }, {
        key: "_update",
        value: function _update(opts) {
          var mask = opts.mask;
          if (mask) opts.validate = function (value) {
            return value.search(mask) >= 0;
          };
          babelHelpers.get(babelHelpers.getPrototypeOf(MaskedRegExp.prototype), "_update", this).call(this, opts);
        }
      }]);
      return MaskedRegExp;
    }(Masked);
    IMask.MaskedRegExp = MaskedRegExp;

    /** Pattern mask */
    var MaskedPattern = /*#__PURE__*/function (_Masked2) {
      babelHelpers.inherits(MaskedPattern, _Masked2);
      /** */

      /** */

      /** Single char for empty input */

      /** Single char for filled input */

      /** Show placeholder only when needed */

      /** Enable characters overwriting */

      /** */

      /** */

      /** */

      function MaskedPattern(opts) {
        babelHelpers.classCallCheck(this, MaskedPattern);
        return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(MaskedPattern).call(this, _objectSpread(_objectSpread(_objectSpread({}, MaskedPattern.DEFAULTS), opts), {}, {
          definitions: Object.assign({}, PatternInputDefinition.DEFAULT_DEFINITIONS, opts == null ? void 0 : opts.definitions)
        })));
      }
      babelHelpers.createClass(MaskedPattern, [{
        key: "updateOptions",
        value: function updateOptions(opts) {
          babelHelpers.get(babelHelpers.getPrototypeOf(MaskedPattern.prototype), "updateOptions", this).call(this, opts);
        }
      }, {
        key: "_update",
        value: function _update(opts) {
          opts.definitions = Object.assign({}, this.definitions, opts.definitions);
          babelHelpers.get(babelHelpers.getPrototypeOf(MaskedPattern.prototype), "_update", this).call(this, opts);
          this._rebuildMask();
        }
      }, {
        key: "_rebuildMask",
        value: function _rebuildMask() {
          var _this10 = this;
          var defs = this.definitions;
          this._blocks = [];
          this.exposeBlock = undefined;
          this._stops = [];
          this._maskedBlocks = {};
          var pattern = this.mask;
          if (!pattern || !defs) return;
          var unmaskingBlock = false;
          var optionalBlock = false;
          var _loop = function _loop(_i2) {
            if (_this10.blocks) {
              var p = pattern.slice(_i2);
              var bNames = Object.keys(_this10.blocks).filter(function (bName) {
                return p.indexOf(bName) === 0;
              });
              // order by key length
              bNames.sort(function (a, b) {
                return b.length - a.length;
              });
              // use block name with max length
              var bName = bNames[0];
              if (bName) {
                var _normalizeOpts = normalizeOpts(_this10.blocks[bName]),
                  expose = _normalizeOpts.expose,
                  repeat = _normalizeOpts.repeat,
                  bOpts = babelHelpers.objectWithoutProperties(_normalizeOpts, _excluded5); // TODO type Opts<Arg & Extra>
                var blockOpts = _objectSpread(_objectSpread({
                  lazy: _this10.lazy,
                  eager: _this10.eager,
                  placeholderChar: _this10.placeholderChar,
                  displayChar: _this10.displayChar,
                  overwrite: _this10.overwrite,
                  autofix: _this10.autofix
                }, bOpts), {}, {
                  repeat: repeat,
                  parent: _this10
                });
                var maskedBlock = repeat != null ? new IMask.RepeatBlock(blockOpts /* TODO */) : createMask(blockOpts);
                if (maskedBlock) {
                  _this10._blocks.push(maskedBlock);
                  if (expose) _this10.exposeBlock = maskedBlock;

                  // store block index
                  if (!_this10._maskedBlocks[bName]) _this10._maskedBlocks[bName] = [];
                  _this10._maskedBlocks[bName].push(_this10._blocks.length - 1);
                }
                _i2 += bName.length - 1;
                i = _i2;
                return "continue";
              }
            }
            var _char = pattern[_i2];
            var isInput = (_char in defs);
            if (_char === MaskedPattern.STOP_CHAR) {
              _this10._stops.push(_this10._blocks.length);
              i = _i2;
              return "continue";
            }
            if (_char === '{' || _char === '}') {
              unmaskingBlock = !unmaskingBlock;
              i = _i2;
              return "continue";
            }
            if (_char === '[' || _char === ']') {
              optionalBlock = !optionalBlock;
              i = _i2;
              return "continue";
            }
            if (_char === MaskedPattern.ESCAPE_CHAR) {
              ++_i2;
              _char = pattern[_i2];
              if (!_char) {
                i = _i2;
                return "break";
              }
              isInput = false;
            }
            var def = isInput ? new PatternInputDefinition(_objectSpread(_objectSpread({
              isOptional: optionalBlock,
              lazy: _this10.lazy,
              eager: _this10.eager,
              placeholderChar: _this10.placeholderChar,
              displayChar: _this10.displayChar
            }, normalizeOpts(defs[_char])), {}, {
              parent: _this10
            })) : new PatternFixedDefinition({
              "char": _char,
              eager: _this10.eager,
              isUnmasking: unmaskingBlock
            });
            _this10._blocks.push(def);
            i = _i2;
          };
          for (var i = 0; i < pattern.length; ++i) {
            var _ret = _loop(i);
            if (_ret === "continue") continue;
            if (_ret === "break") break;
          }
        }
      }, {
        key: "reset",
        value: function reset() {
          babelHelpers.get(babelHelpers.getPrototypeOf(MaskedPattern.prototype), "reset", this).call(this);
          this._blocks.forEach(function (b) {
            return b.reset();
          });
        }
      }, {
        key: "doCommit",
        value: function doCommit() {
          this._blocks.forEach(function (b) {
            return b.doCommit();
          });
          babelHelpers.get(babelHelpers.getPrototypeOf(MaskedPattern.prototype), "doCommit", this).call(this);
        }
      }, {
        key: "appendTail",
        value: function appendTail(tail) {
          return babelHelpers.get(babelHelpers.getPrototypeOf(MaskedPattern.prototype), "appendTail", this).call(this, tail).aggregate(this._appendPlaceholder());
        }
      }, {
        key: "_appendEager",
        value: function _appendEager() {
          var _this$_mapPosToBlock;
          var details = new ChangeDetails();
          var startBlockIndex = (_this$_mapPosToBlock = this._mapPosToBlock(this.displayValue.length)) == null ? void 0 : _this$_mapPosToBlock.index;
          if (startBlockIndex == null) return details;

          // TODO test if it works for nested pattern masks
          if (this._blocks[startBlockIndex].isFilled) ++startBlockIndex;
          for (var bi = startBlockIndex; bi < this._blocks.length; ++bi) {
            var d = this._blocks[bi]._appendEager();
            if (!d.inserted) break;
            details.aggregate(d);
          }
          return details;
        }
      }, {
        key: "_appendCharRaw",
        value: function _appendCharRaw(ch, flags) {
          if (flags === void 0) {
            flags = {};
          }
          var blockIter = this._mapPosToBlock(this.displayValue.length);
          var details = new ChangeDetails();
          if (!blockIter) return details;
          for (var bi = blockIter.index, block; block = this._blocks[bi]; ++bi) {
            var _flags$_beforeTailSta;
            var blockDetails = block._appendChar(ch, _objectSpread(_objectSpread({}, flags), {}, {
              _beforeTailState: (_flags$_beforeTailSta = flags._beforeTailState) == null || (_flags$_beforeTailSta = _flags$_beforeTailSta._blocks) == null ? void 0 : _flags$_beforeTailSta[bi]
            }));
            details.aggregate(blockDetails);
            if (blockDetails.consumed) break; // go next char
          }

          return details;
        }
      }, {
        key: "extractTail",
        value: function extractTail(fromPos, toPos) {
          var _this11 = this;
          if (fromPos === void 0) {
            fromPos = 0;
          }
          if (toPos === void 0) {
            toPos = this.displayValue.length;
          }
          var chunkTail = new ChunksTailDetails();
          if (fromPos === toPos) return chunkTail;
          this._forEachBlocksInRange(fromPos, toPos, function (b, bi, bFromPos, bToPos) {
            var blockChunk = b.extractTail(bFromPos, bToPos);
            blockChunk.stop = _this11._findStopBefore(bi);
            blockChunk.from = _this11._blockStartPos(bi);
            if (blockChunk instanceof ChunksTailDetails) blockChunk.blockIndex = bi;
            chunkTail.extend(blockChunk);
          });
          return chunkTail;
        }
      }, {
        key: "extractInput",
        value: function extractInput(fromPos, toPos, flags) {
          if (fromPos === void 0) {
            fromPos = 0;
          }
          if (toPos === void 0) {
            toPos = this.displayValue.length;
          }
          if (flags === void 0) {
            flags = {};
          }
          if (fromPos === toPos) return '';
          var input = '';
          this._forEachBlocksInRange(fromPos, toPos, function (b, _, fromPos, toPos) {
            input += b.extractInput(fromPos, toPos, flags);
          });
          return input;
        }
      }, {
        key: "_findStopBefore",
        value: function _findStopBefore(blockIndex) {
          var stopBefore;
          for (var si = 0; si < this._stops.length; ++si) {
            var stop = this._stops[si];
            if (stop <= blockIndex) stopBefore = stop;else break;
          }
          return stopBefore;
        } /** Appends placeholder depending on laziness */
      }, {
        key: "_appendPlaceholder",
        value: function _appendPlaceholder(toBlockIndex) {
          var details = new ChangeDetails();
          if (this.lazy && toBlockIndex == null) return details;
          var startBlockIter = this._mapPosToBlock(this.displayValue.length);
          if (!startBlockIter) return details;
          var startBlockIndex = startBlockIter.index;
          var endBlockIndex = toBlockIndex != null ? toBlockIndex : this._blocks.length;
          this._blocks.slice(startBlockIndex, endBlockIndex).forEach(function (b) {
            if (!b.lazy || toBlockIndex != null) {
              var _blocks2;
              details.aggregate(b._appendPlaceholder((_blocks2 = b._blocks) == null ? void 0 : _blocks2.length));
            }
          });
          return details;
        } /** Finds block in pos */
      }, {
        key: "_mapPosToBlock",
        value: function _mapPosToBlock(pos) {
          var accVal = '';
          for (var bi = 0; bi < this._blocks.length; ++bi) {
            var block = this._blocks[bi];
            var blockStartPos = accVal.length;
            accVal += block.displayValue;
            if (pos <= accVal.length) {
              return {
                index: bi,
                offset: pos - blockStartPos
              };
            }
          }
        }
      }, {
        key: "_blockStartPos",
        value: function _blockStartPos(blockIndex) {
          return this._blocks.slice(0, blockIndex).reduce(function (pos, b) {
            return pos += b.displayValue.length;
          }, 0);
        }
      }, {
        key: "_forEachBlocksInRange",
        value: function _forEachBlocksInRange(fromPos, toPos, fn) {
          if (toPos === void 0) {
            toPos = this.displayValue.length;
          }
          var fromBlockIter = this._mapPosToBlock(fromPos);
          if (fromBlockIter) {
            var toBlockIter = this._mapPosToBlock(toPos);
            // process first block
            var isSameBlock = toBlockIter && fromBlockIter.index === toBlockIter.index;
            var fromBlockStartPos = fromBlockIter.offset;
            var fromBlockEndPos = toBlockIter && isSameBlock ? toBlockIter.offset : this._blocks[fromBlockIter.index].displayValue.length;
            fn(this._blocks[fromBlockIter.index], fromBlockIter.index, fromBlockStartPos, fromBlockEndPos);
            if (toBlockIter && !isSameBlock) {
              // process intermediate blocks
              for (var bi = fromBlockIter.index + 1; bi < toBlockIter.index; ++bi) {
                fn(this._blocks[bi], bi, 0, this._blocks[bi].displayValue.length);
              }

              // process last block
              fn(this._blocks[toBlockIter.index], toBlockIter.index, 0, toBlockIter.offset);
            }
          }
        }
      }, {
        key: "remove",
        value: function remove(fromPos, toPos) {
          if (fromPos === void 0) {
            fromPos = 0;
          }
          if (toPos === void 0) {
            toPos = this.displayValue.length;
          }
          var removeDetails = babelHelpers.get(babelHelpers.getPrototypeOf(MaskedPattern.prototype), "remove", this).call(this, fromPos, toPos);
          this._forEachBlocksInRange(fromPos, toPos, function (b, _, bFromPos, bToPos) {
            removeDetails.aggregate(b.remove(bFromPos, bToPos));
          });
          return removeDetails;
        }
      }, {
        key: "nearestInputPos",
        value: function nearestInputPos(cursorPos, direction) {
          if (direction === void 0) {
            direction = DIRECTION.NONE;
          }
          if (!this._blocks.length) return 0;
          var cursor = new PatternCursor(this, cursorPos);
          if (direction === DIRECTION.NONE) {
            // -------------------------------------------------
            // NONE should only go out from fixed to the right!
            // -------------------------------------------------
            if (cursor.pushRightBeforeInput()) return cursor.pos;
            cursor.popState();
            if (cursor.pushLeftBeforeInput()) return cursor.pos;
            return this.displayValue.length;
          }

          // FORCE is only about a|* otherwise is 0
          if (direction === DIRECTION.LEFT || direction === DIRECTION.FORCE_LEFT) {
            // try to break fast when *|a
            if (direction === DIRECTION.LEFT) {
              cursor.pushRightBeforeFilled();
              if (cursor.ok && cursor.pos === cursorPos) return cursorPos;
              cursor.popState();
            }

            // forward flow
            cursor.pushLeftBeforeInput();
            cursor.pushLeftBeforeRequired();
            cursor.pushLeftBeforeFilled();

            // backward flow
            if (direction === DIRECTION.LEFT) {
              cursor.pushRightBeforeInput();
              cursor.pushRightBeforeRequired();
              if (cursor.ok && cursor.pos <= cursorPos) return cursor.pos;
              cursor.popState();
              if (cursor.ok && cursor.pos <= cursorPos) return cursor.pos;
              cursor.popState();
            }
            if (cursor.ok) return cursor.pos;
            if (direction === DIRECTION.FORCE_LEFT) return 0;
            cursor.popState();
            if (cursor.ok) return cursor.pos;
            cursor.popState();
            if (cursor.ok) return cursor.pos;
            return 0;
          }
          if (direction === DIRECTION.RIGHT || direction === DIRECTION.FORCE_RIGHT) {
            // forward flow
            cursor.pushRightBeforeInput();
            cursor.pushRightBeforeRequired();
            if (cursor.pushRightBeforeFilled()) return cursor.pos;
            if (direction === DIRECTION.FORCE_RIGHT) return this.displayValue.length;

            // backward flow
            cursor.popState();
            if (cursor.ok) return cursor.pos;
            cursor.popState();
            if (cursor.ok) return cursor.pos;
            return this.nearestInputPos(cursorPos, DIRECTION.LEFT);
          }
          return cursorPos;
        }
      }, {
        key: "totalInputPositions",
        value: function totalInputPositions(fromPos, toPos) {
          if (fromPos === void 0) {
            fromPos = 0;
          }
          if (toPos === void 0) {
            toPos = this.displayValue.length;
          }
          var total = 0;
          this._forEachBlocksInRange(fromPos, toPos, function (b, _, bFromPos, bToPos) {
            total += b.totalInputPositions(bFromPos, bToPos);
          });
          return total;
        } /** Get block by name */
      }, {
        key: "maskedBlock",
        value: function maskedBlock(name) {
          return this.maskedBlocks(name)[0];
        } /** Get all blocks by name */
      }, {
        key: "maskedBlocks",
        value: function maskedBlocks(name) {
          var _this12 = this;
          var indices = this._maskedBlocks[name];
          if (!indices) return [];
          return indices.map(function (gi) {
            return _this12._blocks[gi];
          });
        }
      }, {
        key: "pad",
        value: function pad(flags) {
          var details = new ChangeDetails();
          this._forEachBlocksInRange(0, this.displayValue.length, function (b) {
            return details.aggregate(b.pad(flags));
          });
          return details;
        }
      }, {
        key: "state",
        get: function get() {
          return _objectSpread(_objectSpread({}, babelHelpers.get(babelHelpers.getPrototypeOf(MaskedPattern.prototype), "state", this)), {}, {
            _blocks: this._blocks.map(function (b) {
              return b.state;
            })
          });
        },
        set: function set(state) {
          if (!state) {
            this.reset();
            return;
          }
          var _blocks = state._blocks,
            maskedState = babelHelpers.objectWithoutProperties(state, _excluded6);
          this._blocks.forEach(function (b, bi) {
            return b.state = _blocks[bi];
          });
          babelHelpers.set(babelHelpers.getPrototypeOf(MaskedPattern.prototype), "state", maskedState, this, true);
        }
      }, {
        key: "isComplete",
        get: function get() {
          return this.exposeBlock ? this.exposeBlock.isComplete : this._blocks.every(function (b) {
            return b.isComplete;
          });
        }
      }, {
        key: "isFilled",
        get: function get() {
          return this._blocks.every(function (b) {
            return b.isFilled;
          });
        }
      }, {
        key: "isFixed",
        get: function get() {
          return this._blocks.every(function (b) {
            return b.isFixed;
          });
        }
      }, {
        key: "isOptional",
        get: function get() {
          return this._blocks.every(function (b) {
            return b.isOptional;
          });
        }
      }, {
        key: "unmaskedValue",
        get: function get() {
          return this.exposeBlock ? this.exposeBlock.unmaskedValue : this._blocks.reduce(function (str, b) {
            return str += b.unmaskedValue;
          }, '');
        },
        set: function set(unmaskedValue) {
          if (this.exposeBlock) {
            var tail = this.extractTail(this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) + this.exposeBlock.displayValue.length);
            this.exposeBlock.unmaskedValue = unmaskedValue;
            this.appendTail(tail);
            this.doCommit();
          } else babelHelpers.set(babelHelpers.getPrototypeOf(MaskedPattern.prototype), "unmaskedValue", unmaskedValue, this, true);
        }
      }, {
        key: "value",
        get: function get() {
          return this.exposeBlock ? this.exposeBlock.value :
          // TODO return _value when not in change?
          this._blocks.reduce(function (str, b) {
            return str += b.value;
          }, '');
        },
        set: function set(value) {
          if (this.exposeBlock) {
            var tail = this.extractTail(this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) + this.exposeBlock.displayValue.length);
            this.exposeBlock.value = value;
            this.appendTail(tail);
            this.doCommit();
          } else babelHelpers.set(babelHelpers.getPrototypeOf(MaskedPattern.prototype), "value", value, this, true);
        }
      }, {
        key: "typedValue",
        get: function get() {
          return this.exposeBlock ? this.exposeBlock.typedValue : babelHelpers.get(babelHelpers.getPrototypeOf(MaskedPattern.prototype), "typedValue", this);
        },
        set: function set(value) {
          if (this.exposeBlock) {
            var tail = this.extractTail(this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) + this.exposeBlock.displayValue.length);
            this.exposeBlock.typedValue = value;
            this.appendTail(tail);
            this.doCommit();
          } else babelHelpers.set(babelHelpers.getPrototypeOf(MaskedPattern.prototype), "typedValue", value, this, true);
        }
      }, {
        key: "displayValue",
        get: function get() {
          return this._blocks.reduce(function (str, b) {
            return str += b.displayValue;
          }, '');
        }
      }]);
      return MaskedPattern;
    }(Masked);
    MaskedPattern.DEFAULTS = _objectSpread(_objectSpread({}, Masked.DEFAULTS), {}, {
      lazy: true,
      placeholderChar: '_'
    });
    MaskedPattern.STOP_CHAR = '`';
    MaskedPattern.ESCAPE_CHAR = '\\';
    MaskedPattern.InputDefinition = PatternInputDefinition;
    MaskedPattern.FixedDefinition = PatternFixedDefinition;
    IMask.MaskedPattern = MaskedPattern;

    /** Pattern which accepts ranges */
    var MaskedRange = /*#__PURE__*/function (_MaskedPattern) {
      babelHelpers.inherits(MaskedRange, _MaskedPattern);
      babelHelpers.createClass(MaskedRange, [{
        key: "_matchFrom",
        /**
          Optionally sets max length of pattern.
          Used when pattern length is longer then `to` param length. Pads zeros at start in this case.
        */
        /** Min bound */
        /** Max bound */
        get: function get() {
          return this.maxLength - String(this.from).length;
        }
      }]);
      function MaskedRange(opts) {
        babelHelpers.classCallCheck(this, MaskedRange);
        return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(MaskedRange).call(this, opts)); // mask will be created in _update
      }
      babelHelpers.createClass(MaskedRange, [{
        key: "updateOptions",
        value: function updateOptions(opts) {
          babelHelpers.get(babelHelpers.getPrototypeOf(MaskedRange.prototype), "updateOptions", this).call(this, opts);
        }
      }, {
        key: "_update",
        value: function _update(opts) {
          var _opts$to = opts.to,
            to = _opts$to === void 0 ? this.to || 0 : _opts$to,
            _opts$from = opts.from,
            from = _opts$from === void 0 ? this.from || 0 : _opts$from,
            _opts$maxLength = opts.maxLength,
            maxLength = _opts$maxLength === void 0 ? this.maxLength || 0 : _opts$maxLength,
            _opts$autofix = opts.autofix,
            autofix = _opts$autofix === void 0 ? this.autofix : _opts$autofix,
            patternOpts = babelHelpers.objectWithoutProperties(opts, _excluded7);
          this.to = to;
          this.from = from;
          this.maxLength = Math.max(String(to).length, maxLength);
          this.autofix = autofix;
          var fromStr = String(this.from).padStart(this.maxLength, '0');
          var toStr = String(this.to).padStart(this.maxLength, '0');
          var sameCharsCount = 0;
          while (sameCharsCount < toStr.length && toStr[sameCharsCount] === fromStr[sameCharsCount]) ++sameCharsCount;
          patternOpts.mask = toStr.slice(0, sameCharsCount).replace(/0/g, '\\0') + '0'.repeat(this.maxLength - sameCharsCount);
          babelHelpers.get(babelHelpers.getPrototypeOf(MaskedRange.prototype), "_update", this).call(this, patternOpts);
        }
      }, {
        key: "boundaries",
        value: function boundaries(str) {
          var minstr = '';
          var maxstr = '';
          var _ref8 = str.match(/^(\D*)(\d*)(\D*)/) || [],
            _ref9 = babelHelpers.slicedToArray(_ref8, 3),
            placeholder = _ref9[1],
            num = _ref9[2];
          if (num) {
            minstr = '0'.repeat(placeholder.length) + num;
            maxstr = '9'.repeat(placeholder.length) + num;
          }
          minstr = minstr.padEnd(this.maxLength, '0');
          maxstr = maxstr.padEnd(this.maxLength, '9');
          return [minstr, maxstr];
        }
      }, {
        key: "doPrepareChar",
        value: function doPrepareChar(ch, flags) {
          if (flags === void 0) {
            flags = {};
          }
          var details;
          var _babelHelpers$get$cal = babelHelpers.get(babelHelpers.getPrototypeOf(MaskedRange.prototype), "doPrepareChar", this).call(this, ch.replace(/\D/g, ''), flags);
          var _babelHelpers$get$cal2 = babelHelpers.slicedToArray(_babelHelpers$get$cal, 2);
          ch = _babelHelpers$get$cal2[0];
          details = _babelHelpers$get$cal2[1];
          if (!ch) details.skip = !this.isComplete;
          return [ch, details];
        }
      }, {
        key: "_appendCharRaw",
        value: function _appendCharRaw(ch, flags) {
          if (flags === void 0) {
            flags = {};
          }
          if (!this.autofix || this.value.length + 1 > this.maxLength) return babelHelpers.get(babelHelpers.getPrototypeOf(MaskedRange.prototype), "_appendCharRaw", this).call(this, ch, flags);
          var fromStr = String(this.from).padStart(this.maxLength, '0');
          var toStr = String(this.to).padStart(this.maxLength, '0');
          var _this$boundaries = this.boundaries(this.value + ch),
            _this$boundaries2 = babelHelpers.slicedToArray(_this$boundaries, 2),
            minstr = _this$boundaries2[0],
            maxstr = _this$boundaries2[1];
          if (Number(maxstr) < this.from) return babelHelpers.get(babelHelpers.getPrototypeOf(MaskedRange.prototype), "_appendCharRaw", this).call(this, fromStr[this.value.length], flags);
          if (Number(minstr) > this.to) {
            if (!flags.tail && this.autofix === 'pad' && this.value.length + 1 < this.maxLength) {
              return babelHelpers.get(babelHelpers.getPrototypeOf(MaskedRange.prototype), "_appendCharRaw", this).call(this, fromStr[this.value.length], flags).aggregate(this._appendCharRaw(ch, flags));
            }
            return babelHelpers.get(babelHelpers.getPrototypeOf(MaskedRange.prototype), "_appendCharRaw", this).call(this, toStr[this.value.length], flags);
          }
          return babelHelpers.get(babelHelpers.getPrototypeOf(MaskedRange.prototype), "_appendCharRaw", this).call(this, ch, flags);
        }
      }, {
        key: "doValidate",
        value: function doValidate(flags) {
          var str = this.value;
          var firstNonZero = str.search(/[^0]/);
          if (firstNonZero === -1 && str.length <= this._matchFrom) return true;
          var _this$boundaries3 = this.boundaries(str),
            _this$boundaries4 = babelHelpers.slicedToArray(_this$boundaries3, 2),
            minstr = _this$boundaries4[0],
            maxstr = _this$boundaries4[1];
          return this.from <= Number(maxstr) && Number(minstr) <= this.to && babelHelpers.get(babelHelpers.getPrototypeOf(MaskedRange.prototype), "doValidate", this).call(this, flags);
        }
      }, {
        key: "pad",
        value: function pad(flags) {
          var _this13 = this;
          var details = new ChangeDetails();
          if (this.value.length === this.maxLength) return details;
          var value = this.value;
          var padLength = this.maxLength - this.value.length;
          if (padLength) {
            this.reset();
            for (var i = 0; i < padLength; ++i) {
              details.aggregate(babelHelpers.get(babelHelpers.getPrototypeOf(MaskedRange.prototype), "_appendCharRaw", this).call(this, '0', flags));
            }

            // append tail
            value.split('').forEach(function (ch) {
              return _this13._appendCharRaw(ch);
            });
          }
          return details;
        }
      }, {
        key: "isComplete",
        get: function get() {
          return babelHelpers.get(babelHelpers.getPrototypeOf(MaskedRange.prototype), "isComplete", this) && Boolean(this.value);
        }
      }]);
      return MaskedRange;
    }(MaskedPattern);
    IMask.MaskedRange = MaskedRange;
    var DefaultPattern = 'd{.}`m{.}`Y';

    // Make format and parse required when pattern is provided

    /** Date mask */
    var MaskedDate = /*#__PURE__*/function (_MaskedPattern2) {
      babelHelpers.inherits(MaskedDate, _MaskedPattern2);
      babelHelpers.createClass(MaskedDate, null, [{
        key: "extractPatternOptions",
        value: function extractPatternOptions(opts) {
          var mask = opts.mask,
            pattern = opts.pattern,
            patternOpts = babelHelpers.objectWithoutProperties(opts, _excluded8);
          return _objectSpread(_objectSpread({}, patternOpts), {}, {
            mask: isString(mask) ? mask : pattern
          });
        }
        /** Pattern mask for date according to {@link MaskedDate#format} */
        /** Start date */
        /** End date */
        /** Format typed value to string */
        /** Parse string to get typed value */
      }]);
      function MaskedDate(opts) {
        babelHelpers.classCallCheck(this, MaskedDate);
        return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(MaskedDate).call(this, MaskedDate.extractPatternOptions(_objectSpread(_objectSpread({}, MaskedDate.DEFAULTS), opts))));
      }
      babelHelpers.createClass(MaskedDate, [{
        key: "updateOptions",
        value: function updateOptions(opts) {
          babelHelpers.get(babelHelpers.getPrototypeOf(MaskedDate.prototype), "updateOptions", this).call(this, opts);
        }
      }, {
        key: "_update",
        value: function _update(opts) {
          var _MaskedDate$DEFAULTS$ = _objectSpread(_objectSpread({}, MaskedDate.DEFAULTS), opts),
            mask = _MaskedDate$DEFAULTS$.mask,
            pattern = _MaskedDate$DEFAULTS$.pattern,
            blocks = _MaskedDate$DEFAULTS$.blocks,
            patternOpts = babelHelpers.objectWithoutProperties(_MaskedDate$DEFAULTS$, _excluded9);
          var patternBlocks = Object.assign({}, MaskedDate.GET_DEFAULT_BLOCKS());
          // adjust year block
          if (opts.min) patternBlocks.Y.from = opts.min.getFullYear();
          if (opts.max) patternBlocks.Y.to = opts.max.getFullYear();
          if (opts.min && opts.max && patternBlocks.Y.from === patternBlocks.Y.to) {
            patternBlocks.m.from = opts.min.getMonth() + 1;
            patternBlocks.m.to = opts.max.getMonth() + 1;
            if (patternBlocks.m.from === patternBlocks.m.to) {
              patternBlocks.d.from = opts.min.getDate();
              patternBlocks.d.to = opts.max.getDate();
            }
          }
          Object.assign(patternBlocks, this.blocks, blocks);
          babelHelpers.get(babelHelpers.getPrototypeOf(MaskedDate.prototype), "_update", this).call(this, _objectSpread(_objectSpread({}, patternOpts), {}, {
            mask: isString(mask) ? mask : pattern,
            blocks: patternBlocks
          }));
        }
      }, {
        key: "doValidate",
        value: function doValidate(flags) {
          var date = this.date;
          return babelHelpers.get(babelHelpers.getPrototypeOf(MaskedDate.prototype), "doValidate", this).call(this, flags) && (!this.isComplete || this.isDateExist(this.value) && date != null && (this.min == null || this.min <= date) && (this.max == null || date <= this.max));
        } /** Checks if date is exists */
      }, {
        key: "isDateExist",
        value: function isDateExist(str) {
          return this.format(this.parse(str, this), this).indexOf(str) >= 0;
        } /** Parsed Date */
      }, {
        key: "maskEquals",
        value: function maskEquals(mask) {
          return mask === Date || babelHelpers.get(babelHelpers.getPrototypeOf(MaskedDate.prototype), "maskEquals", this).call(this, mask);
        }
      }, {
        key: "optionsIsChanged",
        value: function optionsIsChanged(opts) {
          return babelHelpers.get(babelHelpers.getPrototypeOf(MaskedDate.prototype), "optionsIsChanged", this).call(this, MaskedDate.extractPatternOptions(opts));
        }
      }, {
        key: "date",
        get: function get() {
          return this.typedValue;
        },
        set: function set(date) {
          this.typedValue = date;
        }
      }, {
        key: "typedValue",
        get: function get() {
          return this.isComplete ? babelHelpers.get(babelHelpers.getPrototypeOf(MaskedDate.prototype), "typedValue", this) : null;
        },
        set: function set(value) {
          babelHelpers.set(babelHelpers.getPrototypeOf(MaskedDate.prototype), "typedValue", value, this, true);
        }
      }]);
      return MaskedDate;
    }(MaskedPattern);
    MaskedDate.GET_DEFAULT_BLOCKS = function () {
      return {
        d: {
          mask: MaskedRange,
          from: 1,
          to: 31,
          maxLength: 2
        },
        m: {
          mask: MaskedRange,
          from: 1,
          to: 12,
          maxLength: 2
        },
        Y: {
          mask: MaskedRange,
          from: 1900,
          to: 9999
        }
      };
    };
    MaskedDate.DEFAULTS = _objectSpread(_objectSpread({}, MaskedPattern.DEFAULTS), {}, {
      mask: Date,
      pattern: DefaultPattern,
      format: function format(date, masked) {
        if (!date) return '';
        var day = String(date.getDate()).padStart(2, '0');
        var month = String(date.getMonth() + 1).padStart(2, '0');
        var year = date.getFullYear();
        return [day, month, year].join('.');
      },
      parse: function parse(str, masked) {
        var _str$split$map = str.split('.').map(Number),
          _str$split$map2 = babelHelpers.slicedToArray(_str$split$map, 3),
          day = _str$split$map2[0],
          month = _str$split$map2[1],
          year = _str$split$map2[2];
        return new Date(year, month - 1, day);
      }
    });
    IMask.MaskedDate = MaskedDate;

    /** Dynamic mask for choosing appropriate mask in run-time */
    var MaskedDynamic = /*#__PURE__*/function (_Masked3) {
      babelHelpers.inherits(MaskedDynamic, _Masked3);
      function MaskedDynamic(opts) {
        var _this14;
        babelHelpers.classCallCheck(this, MaskedDynamic);
        _this14 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(MaskedDynamic).call(this, _objectSpread(_objectSpread({}, MaskedDynamic.DEFAULTS), opts)));
        _this14.currentMask = undefined;
        return _this14;
      }
      babelHelpers.createClass(MaskedDynamic, [{
        key: "updateOptions",
        value: function updateOptions(opts) {
          babelHelpers.get(babelHelpers.getPrototypeOf(MaskedDynamic.prototype), "updateOptions", this).call(this, opts);
        }
      }, {
        key: "_update",
        value: function _update(opts) {
          var _this15 = this;
          babelHelpers.get(babelHelpers.getPrototypeOf(MaskedDynamic.prototype), "_update", this).call(this, opts);
          if ('mask' in opts) {
            this.exposeMask = undefined;
            // mask could be totally dynamic with only `dispatch` option
            this.compiledMasks = Array.isArray(opts.mask) ? opts.mask.map(function (m) {
              var _normalizeOpts2 = normalizeOpts(m),
                expose = _normalizeOpts2.expose,
                maskOpts = babelHelpers.objectWithoutProperties(_normalizeOpts2, _excluded10);
              var masked = createMask(_objectSpread({
                overwrite: _this15._overwrite,
                eager: _this15._eager,
                skipInvalid: _this15._skipInvalid
              }, maskOpts));
              if (expose) _this15.exposeMask = masked;
              return masked;
            }) : [];

            // this.currentMask = this.doDispatch(''); // probably not needed but lets see
          }
        }
      }, {
        key: "_appendCharRaw",
        value: function _appendCharRaw(ch, flags) {
          if (flags === void 0) {
            flags = {};
          }
          var details = this._applyDispatch(ch, flags);
          if (this.currentMask) {
            details.aggregate(this.currentMask._appendChar(ch, this.currentMaskFlags(flags)));
          }
          return details;
        }
      }, {
        key: "_applyDispatch",
        value: function _applyDispatch(appended, flags, tail) {
          if (appended === void 0) {
            appended = '';
          }
          if (flags === void 0) {
            flags = {};
          }
          if (tail === void 0) {
            tail = '';
          }
          var prevValueBeforeTail = flags.tail && flags._beforeTailState != null ? flags._beforeTailState._value : this.value;
          var inputValue = this.rawInputValue;
          var insertValue = flags.tail && flags._beforeTailState != null ? flags._beforeTailState._rawInputValue : inputValue;
          var tailValue = inputValue.slice(insertValue.length);
          var prevMask = this.currentMask;
          var details = new ChangeDetails();
          var prevMaskState = prevMask == null ? void 0 : prevMask.state;

          // clone flags to prevent overwriting `_beforeTailState`
          this.currentMask = this.doDispatch(appended, _objectSpread({}, flags), tail);

          // restore state after dispatch
          if (this.currentMask) {
            if (this.currentMask !== prevMask) {
              // if mask changed reapply input
              this.currentMask.reset();
              if (insertValue) {
                this.currentMask.append(insertValue, {
                  raw: true
                });
                details.tailShift = this.currentMask.value.length - prevValueBeforeTail.length;
              }
              if (tailValue) {
                details.tailShift += this.currentMask.append(tailValue, {
                  raw: true,
                  tail: true
                }).tailShift;
              }
            } else if (prevMaskState) {
              // Dispatch can do something bad with state, so
              // restore prev mask state
              this.currentMask.state = prevMaskState;
            }
          }
          return details;
        }
      }, {
        key: "_appendPlaceholder",
        value: function _appendPlaceholder() {
          var details = this._applyDispatch();
          if (this.currentMask) {
            details.aggregate(this.currentMask._appendPlaceholder());
          }
          return details;
        }
      }, {
        key: "_appendEager",
        value: function _appendEager() {
          var details = this._applyDispatch();
          if (this.currentMask) {
            details.aggregate(this.currentMask._appendEager());
          }
          return details;
        }
      }, {
        key: "appendTail",
        value: function appendTail(tail) {
          var details = new ChangeDetails();
          if (tail) details.aggregate(this._applyDispatch('', {}, tail));
          return details.aggregate(this.currentMask ? this.currentMask.appendTail(tail) : babelHelpers.get(babelHelpers.getPrototypeOf(MaskedDynamic.prototype), "appendTail", this).call(this, tail));
        }
      }, {
        key: "currentMaskFlags",
        value: function currentMaskFlags(flags) {
          var _flags$_beforeTailSta, _flags$_beforeTailSta2;
          return _objectSpread(_objectSpread({}, flags), {}, {
            _beforeTailState: ((_flags$_beforeTailSta = flags._beforeTailState) == null ? void 0 : _flags$_beforeTailSta.currentMaskRef) === this.currentMask && ((_flags$_beforeTailSta2 = flags._beforeTailState) == null ? void 0 : _flags$_beforeTailSta2.currentMask) || flags._beforeTailState
          });
        }
      }, {
        key: "doDispatch",
        value: function doDispatch(appended, flags, tail) {
          if (flags === void 0) {
            flags = {};
          }
          if (tail === void 0) {
            tail = '';
          }
          return this.dispatch(appended, this, flags, tail);
        }
      }, {
        key: "doValidate",
        value: function doValidate(flags) {
          return babelHelpers.get(babelHelpers.getPrototypeOf(MaskedDynamic.prototype), "doValidate", this).call(this, flags) && (!this.currentMask || this.currentMask.doValidate(this.currentMaskFlags(flags)));
        }
      }, {
        key: "doPrepare",
        value: function doPrepare(str, flags) {
          if (flags === void 0) {
            flags = {};
          }
          var _babelHelpers$get$cal3 = babelHelpers.get(babelHelpers.getPrototypeOf(MaskedDynamic.prototype), "doPrepare", this).call(this, str, flags),
            _babelHelpers$get$cal4 = babelHelpers.slicedToArray(_babelHelpers$get$cal3, 2),
            s = _babelHelpers$get$cal4[0],
            details = _babelHelpers$get$cal4[1];
          if (this.currentMask) {
            var currentDetails;
            var _babelHelpers$get$cal5 = babelHelpers.get(babelHelpers.getPrototypeOf(MaskedDynamic.prototype), "doPrepare", this).call(this, s, this.currentMaskFlags(flags));
            var _babelHelpers$get$cal6 = babelHelpers.slicedToArray(_babelHelpers$get$cal5, 2);
            s = _babelHelpers$get$cal6[0];
            currentDetails = _babelHelpers$get$cal6[1];
            details = details.aggregate(currentDetails);
          }
          return [s, details];
        }
      }, {
        key: "doPrepareChar",
        value: function doPrepareChar(str, flags) {
          if (flags === void 0) {
            flags = {};
          }
          var _babelHelpers$get$cal7 = babelHelpers.get(babelHelpers.getPrototypeOf(MaskedDynamic.prototype), "doPrepareChar", this).call(this, str, flags),
            _babelHelpers$get$cal8 = babelHelpers.slicedToArray(_babelHelpers$get$cal7, 2),
            s = _babelHelpers$get$cal8[0],
            details = _babelHelpers$get$cal8[1];
          if (this.currentMask) {
            var currentDetails;
            var _babelHelpers$get$cal9 = babelHelpers.get(babelHelpers.getPrototypeOf(MaskedDynamic.prototype), "doPrepareChar", this).call(this, s, this.currentMaskFlags(flags));
            var _babelHelpers$get$cal10 = babelHelpers.slicedToArray(_babelHelpers$get$cal9, 2);
            s = _babelHelpers$get$cal10[0];
            currentDetails = _babelHelpers$get$cal10[1];
            details = details.aggregate(currentDetails);
          }
          return [s, details];
        }
      }, {
        key: "reset",
        value: function reset() {
          var _this$currentMask;
          (_this$currentMask = this.currentMask) == null || _this$currentMask.reset();
          this.compiledMasks.forEach(function (m) {
            return m.reset();
          });
        }
      }, {
        key: "remove",
        value: function remove(fromPos, toPos) {
          var details = new ChangeDetails();
          if (this.currentMask) {
            details.aggregate(this.currentMask.remove(fromPos, toPos))
            // update with dispatch
            .aggregate(this._applyDispatch());
          }
          return details;
        }
      }, {
        key: "extractInput",
        value: function extractInput(fromPos, toPos, flags) {
          return this.currentMask ? this.currentMask.extractInput(fromPos, toPos, flags) : '';
        }
      }, {
        key: "extractTail",
        value: function extractTail(fromPos, toPos) {
          return this.currentMask ? this.currentMask.extractTail(fromPos, toPos) : babelHelpers.get(babelHelpers.getPrototypeOf(MaskedDynamic.prototype), "extractTail", this).call(this, fromPos, toPos);
        }
      }, {
        key: "doCommit",
        value: function doCommit() {
          if (this.currentMask) this.currentMask.doCommit();
          babelHelpers.get(babelHelpers.getPrototypeOf(MaskedDynamic.prototype), "doCommit", this).call(this);
        }
      }, {
        key: "nearestInputPos",
        value: function nearestInputPos(cursorPos, direction) {
          return this.currentMask ? this.currentMask.nearestInputPos(cursorPos, direction) : babelHelpers.get(babelHelpers.getPrototypeOf(MaskedDynamic.prototype), "nearestInputPos", this).call(this, cursorPos, direction);
        }
      }, {
        key: "maskEquals",
        value: function maskEquals(mask) {
          return Array.isArray(mask) ? this.compiledMasks.every(function (m, mi) {
            if (!mask[mi]) return;
            var _mask$mi = mask[mi],
              oldMask = _mask$mi.mask,
              restOpts = babelHelpers.objectWithoutProperties(_mask$mi, _excluded11);
            return objectIncludes(m, restOpts) && m.maskEquals(oldMask);
          }) : babelHelpers.get(babelHelpers.getPrototypeOf(MaskedDynamic.prototype), "maskEquals", this).call(this, mask);
        }
      }, {
        key: "typedValueEquals",
        value: function typedValueEquals(value) {
          var _this$currentMask5;
          return Boolean((_this$currentMask5 = this.currentMask) == null ? void 0 : _this$currentMask5.typedValueEquals(value));
        }
      }, {
        key: "value",
        get: function get() {
          return this.exposeMask ? this.exposeMask.value : this.currentMask ? this.currentMask.value : '';
        },
        set: function set(value) {
          if (this.exposeMask) {
            this.exposeMask.value = value;
            this.currentMask = this.exposeMask;
            this._applyDispatch();
          } else babelHelpers.set(babelHelpers.getPrototypeOf(MaskedDynamic.prototype), "value", value, this, true);
        }
      }, {
        key: "unmaskedValue",
        get: function get() {
          return this.exposeMask ? this.exposeMask.unmaskedValue : this.currentMask ? this.currentMask.unmaskedValue : '';
        },
        set: function set(unmaskedValue) {
          if (this.exposeMask) {
            this.exposeMask.unmaskedValue = unmaskedValue;
            this.currentMask = this.exposeMask;
            this._applyDispatch();
          } else babelHelpers.set(babelHelpers.getPrototypeOf(MaskedDynamic.prototype), "unmaskedValue", unmaskedValue, this, true);
        }
      }, {
        key: "typedValue",
        get: function get() {
          return this.exposeMask ? this.exposeMask.typedValue : this.currentMask ? this.currentMask.typedValue : '';
        },
        set: function set(typedValue) {
          if (this.exposeMask) {
            this.exposeMask.typedValue = typedValue;
            this.currentMask = this.exposeMask;
            this._applyDispatch();
            return;
          }
          var unmaskedValue = String(typedValue);

          // double check it
          if (this.currentMask) {
            this.currentMask.typedValue = typedValue;
            unmaskedValue = this.currentMask.unmaskedValue;
          }
          this.unmaskedValue = unmaskedValue;
        }
      }, {
        key: "displayValue",
        get: function get() {
          return this.currentMask ? this.currentMask.displayValue : '';
        }
      }, {
        key: "isComplete",
        get: function get() {
          var _this$currentMask2;
          return Boolean((_this$currentMask2 = this.currentMask) == null ? void 0 : _this$currentMask2.isComplete);
        }
      }, {
        key: "isFilled",
        get: function get() {
          var _this$currentMask3;
          return Boolean((_this$currentMask3 = this.currentMask) == null ? void 0 : _this$currentMask3.isFilled);
        }
      }, {
        key: "state",
        get: function get() {
          var _this$currentMask4;
          return _objectSpread(_objectSpread({}, babelHelpers.get(babelHelpers.getPrototypeOf(MaskedDynamic.prototype), "state", this)), {}, {
            _rawInputValue: this.rawInputValue,
            compiledMasks: this.compiledMasks.map(function (m) {
              return m.state;
            }),
            currentMaskRef: this.currentMask,
            currentMask: (_this$currentMask4 = this.currentMask) == null ? void 0 : _this$currentMask4.state
          });
        },
        set: function set(state) {
          var compiledMasks = state.compiledMasks,
            currentMaskRef = state.currentMaskRef,
            currentMask = state.currentMask,
            maskedState = babelHelpers.objectWithoutProperties(state, _excluded12);
          if (compiledMasks) this.compiledMasks.forEach(function (m, mi) {
            return m.state = compiledMasks[mi];
          });
          if (currentMaskRef != null) {
            this.currentMask = currentMaskRef;
            this.currentMask.state = currentMask;
          }
          babelHelpers.set(babelHelpers.getPrototypeOf(MaskedDynamic.prototype), "state", maskedState, this, true);
        }
      }, {
        key: "overwrite",
        get: function get() {
          return this.currentMask ? this.currentMask.overwrite : this._overwrite;
        },
        set: function set(overwrite) {
          this._overwrite = overwrite;
        }
      }, {
        key: "eager",
        get: function get() {
          return this.currentMask ? this.currentMask.eager : this._eager;
        },
        set: function set(eager) {
          this._eager = eager;
        }
      }, {
        key: "skipInvalid",
        get: function get() {
          return this.currentMask ? this.currentMask.skipInvalid : this._skipInvalid;
        },
        set: function set(skipInvalid) {
          this._skipInvalid = skipInvalid;
        }
      }, {
        key: "autofix",
        get: function get() {
          return this.currentMask ? this.currentMask.autofix : this._autofix;
        },
        set: function set(autofix) {
          this._autofix = autofix;
        }
      }]);
      return MaskedDynamic;
    }(Masked);
    /** Currently chosen mask */
    /** Currently chosen mask */
    /** Compliled {@link Masked} options */
    /** Chooses {@link Masked} depending on input value */
    MaskedDynamic.DEFAULTS = _objectSpread(_objectSpread({}, Masked.DEFAULTS), {}, {
      dispatch: function dispatch(appended, masked, flags, tail) {
        if (!masked.compiledMasks.length) return;
        var inputValue = masked.rawInputValue;

        // simulate input
        var inputs = masked.compiledMasks.map(function (m, index) {
          var isCurrent = masked.currentMask === m;
          var startInputPos = isCurrent ? m.displayValue.length : m.nearestInputPos(m.displayValue.length, DIRECTION.FORCE_LEFT);
          if (m.rawInputValue !== inputValue) {
            m.reset();
            m.append(inputValue, {
              raw: true
            });
          } else if (!isCurrent) {
            m.remove(startInputPos);
          }
          m.append(appended, masked.currentMaskFlags(flags));
          m.appendTail(tail);
          return {
            index: index,
            weight: m.rawInputValue.length,
            totalInputPositions: m.totalInputPositions(0, Math.max(startInputPos, m.nearestInputPos(m.displayValue.length, DIRECTION.FORCE_LEFT)))
          };
        });

        // pop masks with longer values first
        inputs.sort(function (i1, i2) {
          return i2.weight - i1.weight || i2.totalInputPositions - i1.totalInputPositions;
        });
        return masked.compiledMasks[inputs[0].index];
      }
    });
    IMask.MaskedDynamic = MaskedDynamic;

    /** Pattern which validates enum values */
    var MaskedEnum = /*#__PURE__*/function (_MaskedPattern3) {
      babelHelpers.inherits(MaskedEnum, _MaskedPattern3);
      function MaskedEnum(opts) {
        babelHelpers.classCallCheck(this, MaskedEnum);
        return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(MaskedEnum).call(this, _objectSpread(_objectSpread({}, MaskedEnum.DEFAULTS), opts))); // mask will be created in _update
      }
      babelHelpers.createClass(MaskedEnum, [{
        key: "updateOptions",
        value: function updateOptions(opts) {
          babelHelpers.get(babelHelpers.getPrototypeOf(MaskedEnum.prototype), "updateOptions", this).call(this, opts);
        }
      }, {
        key: "_update",
        value: function _update(opts) {
          var enum_ = opts["enum"],
            eopts = babelHelpers.objectWithoutProperties(opts, _excluded13);
          if (enum_) {
            var lengths = enum_.map(function (e) {
              return e.length;
            });
            var requiredLength = Math.min.apply(Math, babelHelpers.toConsumableArray(lengths));
            var optionalLength = Math.max.apply(Math, babelHelpers.toConsumableArray(lengths)) - requiredLength;
            eopts.mask = '*'.repeat(requiredLength);
            if (optionalLength) eopts.mask += '[' + '*'.repeat(optionalLength) + ']';
            this["enum"] = enum_;
          }
          babelHelpers.get(babelHelpers.getPrototypeOf(MaskedEnum.prototype), "_update", this).call(this, eopts);
        }
      }, {
        key: "_appendCharRaw",
        value: function _appendCharRaw(ch, flags) {
          var _this16 = this;
          if (flags === void 0) {
            flags = {};
          }
          var matchFrom = Math.min(this.nearestInputPos(0, DIRECTION.FORCE_RIGHT), this.value.length);
          var matches = this["enum"].filter(function (e) {
            return _this16.matchValue(e, _this16.unmaskedValue + ch, matchFrom);
          });
          if (matches.length) {
            if (matches.length === 1) {
              this._forEachBlocksInRange(0, this.value.length, function (b, bi) {
                var mch = matches[0][bi];
                if (bi >= _this16.value.length || mch === b.value) return;
                b.reset();
                b._appendChar(mch, flags);
              });
            }
            var d = babelHelpers.get(babelHelpers.getPrototypeOf(MaskedEnum.prototype), "_appendCharRaw", this).call(this, matches[0][this.value.length], flags);
            if (matches.length === 1) {
              matches[0].slice(this.unmaskedValue.length).split('').forEach(function (mch) {
                return d.aggregate(babelHelpers.get(babelHelpers.getPrototypeOf(MaskedEnum.prototype), "_appendCharRaw", _this16).call(_this16, mch));
              });
            }
            return d;
          }
          return new ChangeDetails({
            skip: !this.isComplete
          });
        }
      }, {
        key: "extractTail",
        value: function extractTail(fromPos, toPos) {
          if (fromPos === void 0) {
            fromPos = 0;
          }
          if (toPos === void 0) {
            toPos = this.displayValue.length;
          }
          // just drop tail
          return new ContinuousTailDetails('', fromPos);
        }
      }, {
        key: "remove",
        value: function remove(fromPos, toPos) {
          var _this17 = this;
          if (fromPos === void 0) {
            fromPos = 0;
          }
          if (toPos === void 0) {
            toPos = this.displayValue.length;
          }
          if (fromPos === toPos) return new ChangeDetails();
          var matchFrom = Math.min(babelHelpers.get(babelHelpers.getPrototypeOf(MaskedEnum.prototype), "nearestInputPos", this).call(this, 0, DIRECTION.FORCE_RIGHT), this.value.length);
          var pos;
          for (pos = fromPos; pos >= 0; --pos) {
            var matches = this["enum"].filter(function (e) {
              return _this17.matchValue(e, _this17.value.slice(matchFrom, pos), matchFrom);
            });
            if (matches.length > 1) break;
          }
          var details = babelHelpers.get(babelHelpers.getPrototypeOf(MaskedEnum.prototype), "remove", this).call(this, pos, toPos);
          details.tailShift += pos - fromPos;
          return details;
        }
      }, {
        key: "isComplete",
        get: function get() {
          return this["enum"].indexOf(this.value) >= 0;
        }
      }]);
      return MaskedEnum;
    }(MaskedPattern);
    /** Match enum value */
    MaskedEnum.DEFAULTS = _objectSpread(_objectSpread({}, MaskedPattern.DEFAULTS), {}, {
      matchValue: function matchValue(estr, istr, matchFrom) {
        return estr.indexOf(istr, matchFrom) === matchFrom;
      }
    });
    IMask.MaskedEnum = MaskedEnum;

    /** Masking by custom Function */
    var MaskedFunction = /*#__PURE__*/function (_Masked4) {
      babelHelpers.inherits(MaskedFunction, _Masked4);
      function MaskedFunction() {
        babelHelpers.classCallCheck(this, MaskedFunction);
        return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(MaskedFunction).apply(this, arguments));
      }
      babelHelpers.createClass(MaskedFunction, [{
        key: "updateOptions",
        /** */
        /** Enable characters overwriting */
        /** */
        /** */
        /** */
        value: function updateOptions(opts) {
          babelHelpers.get(babelHelpers.getPrototypeOf(MaskedFunction.prototype), "updateOptions", this).call(this, opts);
        }
      }, {
        key: "_update",
        value: function _update(opts) {
          babelHelpers.get(babelHelpers.getPrototypeOf(MaskedFunction.prototype), "_update", this).call(this, _objectSpread(_objectSpread({}, opts), {}, {
            validate: opts.mask
          }));
        }
      }]);
      return MaskedFunction;
    }(Masked);
    IMask.MaskedFunction = MaskedFunction;
    var _MaskedNumber;
    /** Number mask */
    var MaskedNumber = /*#__PURE__*/function (_Masked5) {
      babelHelpers.inherits(MaskedNumber, _Masked5);
      /** Single char */

      /** Single char */

      /** Array of single chars */

      /** */

      /** */

      /** Digits after point */

      /** Flag to remove leading and trailing zeros in the end of editing */

      /** Flag to pad trailing zeros after point in the end of editing */

      /** Enable characters overwriting */

      /** */

      /** */

      /** */

      /** Format typed value to string */

      /** Parse string to get typed value */

      function MaskedNumber(opts) {
        babelHelpers.classCallCheck(this, MaskedNumber);
        return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(MaskedNumber).call(this, _objectSpread(_objectSpread({}, MaskedNumber.DEFAULTS), opts)));
      }
      babelHelpers.createClass(MaskedNumber, [{
        key: "updateOptions",
        value: function updateOptions(opts) {
          babelHelpers.get(babelHelpers.getPrototypeOf(MaskedNumber.prototype), "updateOptions", this).call(this, opts);
        }
      }, {
        key: "_update",
        value: function _update(opts) {
          babelHelpers.get(babelHelpers.getPrototypeOf(MaskedNumber.prototype), "_update", this).call(this, opts);
          this._updateRegExps();
        }
      }, {
        key: "_updateRegExps",
        value: function _updateRegExps() {
          var start = '^' + (this.allowNegative ? '[+|\\-]?' : '');
          var mid = '\\d*';
          var end = (this.scale ? "(" + escapeRegExp(this.radix) + "\\d{0," + this.scale + "})?" : '') + '$';
          this._numberRegExp = new RegExp(start + mid + end);
          this._mapToRadixRegExp = new RegExp("[" + this.mapToRadix.map(escapeRegExp).join('') + "]", 'g');
          this._thousandsSeparatorRegExp = new RegExp(escapeRegExp(this.thousandsSeparator), 'g');
        }
      }, {
        key: "_removeThousandsSeparators",
        value: function _removeThousandsSeparators(value) {
          return value.replace(this._thousandsSeparatorRegExp, '');
        }
      }, {
        key: "_insertThousandsSeparators",
        value: function _insertThousandsSeparators(value) {
          // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
          var parts = value.split(this.radix);
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandsSeparator);
          return parts.join(this.radix);
        }
      }, {
        key: "doPrepareChar",
        value: function doPrepareChar(ch, flags) {
          if (flags === void 0) {
            flags = {};
          }
          var _babelHelpers$get$cal11 = babelHelpers.get(babelHelpers.getPrototypeOf(MaskedNumber.prototype), "doPrepareChar", this).call(this, this._removeThousandsSeparators(this.scale && this.mapToRadix.length && (
            /*
              radix should be mapped when
              1) input is done from keyboard = flags.input && flags.raw
              2) unmasked value is set = !flags.input && !flags.raw
              and should not be mapped when
              1) value is set = flags.input && !flags.raw
              2) raw value is set = !flags.input && flags.raw
            */
            flags.input && flags.raw || !flags.input && !flags.raw) ? ch.replace(this._mapToRadixRegExp, this.radix) : ch), flags),
            _babelHelpers$get$cal12 = babelHelpers.slicedToArray(_babelHelpers$get$cal11, 2),
            prepCh = _babelHelpers$get$cal12[0],
            details = _babelHelpers$get$cal12[1];
          if (ch && !prepCh) details.skip = true;
          if (prepCh && !this.allowPositive && !this.value && prepCh !== '-') details.aggregate(this._appendChar('-'));
          return [prepCh, details];
        }
      }, {
        key: "_separatorsCount",
        value: function _separatorsCount(to, extendOnSeparators) {
          if (extendOnSeparators === void 0) {
            extendOnSeparators = false;
          }
          var count = 0;
          for (var pos = 0; pos < to; ++pos) {
            if (this._value.indexOf(this.thousandsSeparator, pos) === pos) {
              ++count;
              if (extendOnSeparators) to += this.thousandsSeparator.length;
            }
          }
          return count;
        }
      }, {
        key: "_separatorsCountFromSlice",
        value: function _separatorsCountFromSlice(slice) {
          if (slice === void 0) {
            slice = this._value;
          }
          return this._separatorsCount(this._removeThousandsSeparators(slice).length, true);
        }
      }, {
        key: "extractInput",
        value: function extractInput(fromPos, toPos, flags) {
          if (fromPos === void 0) {
            fromPos = 0;
          }
          if (toPos === void 0) {
            toPos = this.displayValue.length;
          }
          var _this$_adjustRangeWit = this._adjustRangeWithSeparators(fromPos, toPos);
          var _this$_adjustRangeWit2 = babelHelpers.slicedToArray(_this$_adjustRangeWit, 2);
          fromPos = _this$_adjustRangeWit2[0];
          toPos = _this$_adjustRangeWit2[1];
          return this._removeThousandsSeparators(babelHelpers.get(babelHelpers.getPrototypeOf(MaskedNumber.prototype), "extractInput", this).call(this, fromPos, toPos, flags));
        }
      }, {
        key: "_appendCharRaw",
        value: function _appendCharRaw(ch, flags) {
          if (flags === void 0) {
            flags = {};
          }
          var prevBeforeTailValue = flags.tail && flags._beforeTailState ? flags._beforeTailState._value : this._value;
          var prevBeforeTailSeparatorsCount = this._separatorsCountFromSlice(prevBeforeTailValue);
          this._value = this._removeThousandsSeparators(this.value);
          var oldValue = this._value;
          this._value += ch;
          var num = this.number;
          var accepted = !isNaN(num);
          var skip = false;
          if (accepted) {
            var fixedNum;
            if (this.min != null && this.min < 0 && this.number < this.min) fixedNum = this.min;
            if (this.max != null && this.max > 0 && this.number > this.max) fixedNum = this.max;
            if (fixedNum != null) {
              if (this.autofix) {
                this._value = this.format(fixedNum, this).replace(MaskedNumber.UNMASKED_RADIX, this.radix);
                skip || (skip = oldValue === this._value && !flags.tail); // if not changed on tail it's still ok to proceed
              } else {
                accepted = false;
              }
            }
            accepted && (accepted = Boolean(this._value.match(this._numberRegExp)));
          }
          var appendDetails;
          if (!accepted) {
            this._value = oldValue;
            appendDetails = new ChangeDetails();
          } else {
            appendDetails = new ChangeDetails({
              inserted: this._value.slice(oldValue.length),
              rawInserted: skip ? '' : ch,
              skip: skip
            });
          }
          this._value = this._insertThousandsSeparators(this._value);
          var beforeTailValue = flags.tail && flags._beforeTailState ? flags._beforeTailState._value : this._value;
          var beforeTailSeparatorsCount = this._separatorsCountFromSlice(beforeTailValue);
          appendDetails.tailShift += (beforeTailSeparatorsCount - prevBeforeTailSeparatorsCount) * this.thousandsSeparator.length;
          return appendDetails;
        }
      }, {
        key: "_findSeparatorAround",
        value: function _findSeparatorAround(pos) {
          if (this.thousandsSeparator) {
            var searchFrom = pos - this.thousandsSeparator.length + 1;
            var separatorPos = this.value.indexOf(this.thousandsSeparator, searchFrom);
            if (separatorPos <= pos) return separatorPos;
          }
          return -1;
        }
      }, {
        key: "_adjustRangeWithSeparators",
        value: function _adjustRangeWithSeparators(from, to) {
          var separatorAroundFromPos = this._findSeparatorAround(from);
          if (separatorAroundFromPos >= 0) from = separatorAroundFromPos;
          var separatorAroundToPos = this._findSeparatorAround(to);
          if (separatorAroundToPos >= 0) to = separatorAroundToPos + this.thousandsSeparator.length;
          return [from, to];
        }
      }, {
        key: "remove",
        value: function remove(fromPos, toPos) {
          if (fromPos === void 0) {
            fromPos = 0;
          }
          if (toPos === void 0) {
            toPos = this.displayValue.length;
          }
          var _this$_adjustRangeWit3 = this._adjustRangeWithSeparators(fromPos, toPos);
          var _this$_adjustRangeWit4 = babelHelpers.slicedToArray(_this$_adjustRangeWit3, 2);
          fromPos = _this$_adjustRangeWit4[0];
          toPos = _this$_adjustRangeWit4[1];
          var valueBeforePos = this.value.slice(0, fromPos);
          var valueAfterPos = this.value.slice(toPos);
          var prevBeforeTailSeparatorsCount = this._separatorsCount(valueBeforePos.length);
          this._value = this._insertThousandsSeparators(this._removeThousandsSeparators(valueBeforePos + valueAfterPos));
          var beforeTailSeparatorsCount = this._separatorsCountFromSlice(valueBeforePos);
          return new ChangeDetails({
            tailShift: (beforeTailSeparatorsCount - prevBeforeTailSeparatorsCount) * this.thousandsSeparator.length
          });
        }
      }, {
        key: "nearestInputPos",
        value: function nearestInputPos(cursorPos, direction) {
          if (!this.thousandsSeparator) return cursorPos;
          switch (direction) {
            case DIRECTION.NONE:
            case DIRECTION.LEFT:
            case DIRECTION.FORCE_LEFT:
              {
                var separatorAtLeftPos = this._findSeparatorAround(cursorPos - 1);
                if (separatorAtLeftPos >= 0) {
                  var separatorAtLeftEndPos = separatorAtLeftPos + this.thousandsSeparator.length;
                  if (cursorPos < separatorAtLeftEndPos || this.value.length <= separatorAtLeftEndPos || direction === DIRECTION.FORCE_LEFT) {
                    return separatorAtLeftPos;
                  }
                }
                break;
              }
            case DIRECTION.RIGHT:
            case DIRECTION.FORCE_RIGHT:
              {
                var separatorAtRightPos = this._findSeparatorAround(cursorPos);
                if (separatorAtRightPos >= 0) {
                  return separatorAtRightPos + this.thousandsSeparator.length;
                }
              }
          }
          return cursorPos;
        }
      }, {
        key: "doCommit",
        value: function doCommit() {
          if (this.value) {
            var number = this.number;
            var validnum = number;

            // check bounds
            if (this.min != null) validnum = Math.max(validnum, this.min);
            if (this.max != null) validnum = Math.min(validnum, this.max);
            if (validnum !== number) this.unmaskedValue = this.format(validnum, this);
            var formatted = this.value;
            if (this.normalizeZeros) formatted = this._normalizeZeros(formatted);
            if (this.padFractionalZeros && this.scale > 0) formatted = this._padFractionalZeros(formatted);
            this._value = formatted;
          }
          babelHelpers.get(babelHelpers.getPrototypeOf(MaskedNumber.prototype), "doCommit", this).call(this);
        }
      }, {
        key: "_normalizeZeros",
        value: function _normalizeZeros(value) {
          var parts = this._removeThousandsSeparators(value).split(this.radix);

          // remove leading zeros
          parts[0] = parts[0].replace(/^(\D*)(0*)(\d*)/, function (match, sign, zeros, num) {
            return sign + num;
          });
          // add leading zero
          if (value.length && !/\d$/.test(parts[0])) parts[0] = parts[0] + '0';
          if (parts.length > 1) {
            parts[1] = parts[1].replace(/0*$/, ''); // remove trailing zeros
            if (!parts[1].length) parts.length = 1; // remove fractional
          }

          return this._insertThousandsSeparators(parts.join(this.radix));
        }
      }, {
        key: "_padFractionalZeros",
        value: function _padFractionalZeros(value) {
          if (!value) return value;
          var parts = value.split(this.radix);
          if (parts.length < 2) parts.push('');
          parts[1] = parts[1].padEnd(this.scale, '0');
          return parts.join(this.radix);
        }
      }, {
        key: "doSkipInvalid",
        value: function doSkipInvalid(ch, flags, checkTail) {
          if (flags === void 0) {
            flags = {};
          }
          var dropFractional = this.scale === 0 && ch !== this.thousandsSeparator && (ch === this.radix || ch === MaskedNumber.UNMASKED_RADIX || this.mapToRadix.includes(ch));
          return babelHelpers.get(babelHelpers.getPrototypeOf(MaskedNumber.prototype), "doSkipInvalid", this).call(this, ch, flags, checkTail) && !dropFractional;
        }
      }, {
        key: "typedValueEquals",
        value: function typedValueEquals(value) {
          // handle  0 -> '' case (typed = 0 even if value = '')
          // for details see https://github.com/uNmAnNeR/imaskjs/issues/134
          return (babelHelpers.get(babelHelpers.getPrototypeOf(MaskedNumber.prototype), "typedValueEquals", this).call(this, value) || MaskedNumber.EMPTY_VALUES.includes(value) && MaskedNumber.EMPTY_VALUES.includes(this.typedValue)) && !(value === 0 && this.value === '');
        }
      }, {
        key: "unmaskedValue",
        get: function get() {
          return this._removeThousandsSeparators(this._normalizeZeros(this.value)).replace(this.radix, MaskedNumber.UNMASKED_RADIX);
        },
        set: function set(unmaskedValue) {
          babelHelpers.set(babelHelpers.getPrototypeOf(MaskedNumber.prototype), "unmaskedValue", unmaskedValue, this, true);
        }
      }, {
        key: "typedValue",
        get: function get() {
          return this.parse(this.unmaskedValue, this);
        },
        set: function set(n) {
          this.rawInputValue = this.format(n, this).replace(MaskedNumber.UNMASKED_RADIX, this.radix);
        } /** Parsed Number */
      }, {
        key: "number",
        get: function get() {
          return this.typedValue;
        },
        set: function set(number) {
          this.typedValue = number;
        }
      }, {
        key: "allowNegative",
        get: function get() {
          return this.min != null && this.min < 0 || this.max != null && this.max < 0;
        }
      }, {
        key: "allowPositive",
        get: function get() {
          return this.min != null && this.min > 0 || this.max != null && this.max > 0;
        }
      }]);
      return MaskedNumber;
    }(Masked);
    _MaskedNumber = MaskedNumber;
    MaskedNumber.UNMASKED_RADIX = '.';
    MaskedNumber.EMPTY_VALUES = [].concat(babelHelpers.toConsumableArray(Masked.EMPTY_VALUES), [0]);
    MaskedNumber.DEFAULTS = _objectSpread(_objectSpread({}, Masked.DEFAULTS), {}, {
      mask: Number,
      radix: ',',
      thousandsSeparator: '',
      mapToRadix: [_MaskedNumber.UNMASKED_RADIX],
      min: Number.MIN_SAFE_INTEGER,
      max: Number.MAX_SAFE_INTEGER,
      scale: 2,
      normalizeZeros: true,
      padFractionalZeros: false,
      parse: Number,
      format: function format(n) {
        return n.toLocaleString('en-US', {
          useGrouping: false,
          maximumFractionDigits: 20
        });
      }
    });
    IMask.MaskedNumber = MaskedNumber;

    /** Mask pipe source and destination types */
    var PIPE_TYPE = {
      MASKED: 'value',
      UNMASKED: 'unmaskedValue',
      TYPED: 'typedValue'
    };
    /** Creates new pipe function depending on mask type, source and destination options */
    function createPipe(arg, from, to) {
      if (from === void 0) {
        from = PIPE_TYPE.MASKED;
      }
      if (to === void 0) {
        to = PIPE_TYPE.MASKED;
      }
      var masked = createMask(arg);
      return function (value) {
        return masked.runIsolated(function (m) {
          m[from] = value;
          return m[to];
        });
      };
    }

    /** Pipes value through mask depending on mask type, source and destination options */
    function pipe(value, mask, from, to) {
      return createPipe(mask, from, to)(value);
    }
    IMask.PIPE_TYPE = PIPE_TYPE;
    IMask.createPipe = createPipe;
    IMask.pipe = pipe;

    /** Pattern mask */
    var RepeatBlock = /*#__PURE__*/function (_MaskedPattern4) {
      babelHelpers.inherits(RepeatBlock, _MaskedPattern4);
      babelHelpers.createClass(RepeatBlock, [{
        key: "repeatFrom",
        get: function get() {
          var _ref;
          return (_ref = Array.isArray(this.repeat) ? this.repeat[0] : this.repeat === Infinity ? 0 : this.repeat) != null ? _ref : 0;
        }
      }, {
        key: "repeatTo",
        get: function get() {
          var _ref2;
          return (_ref2 = Array.isArray(this.repeat) ? this.repeat[1] : this.repeat) != null ? _ref2 : Infinity;
        }
      }]);
      function RepeatBlock(opts) {
        babelHelpers.classCallCheck(this, RepeatBlock);
        return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(RepeatBlock).call(this, opts));
      }
      babelHelpers.createClass(RepeatBlock, [{
        key: "updateOptions",
        value: function updateOptions(opts) {
          babelHelpers.get(babelHelpers.getPrototypeOf(RepeatBlock.prototype), "updateOptions", this).call(this, opts);
        }
      }, {
        key: "_update",
        value: function _update(opts) {
          var _ref3, _ref4, _this$_blocks;
          var _normalizeOpts3 = normalizeOpts(opts),
            repeat = _normalizeOpts3.repeat,
            blockOpts = babelHelpers.objectWithoutProperties(_normalizeOpts3, _excluded14); // TODO type
          this._blockOpts = Object.assign({}, this._blockOpts, blockOpts);
          var block = createMask(this._blockOpts);
          this.repeat = (_ref3 = (_ref4 = repeat != null ? repeat : block.repeat) != null ? _ref4 : this.repeat) != null ? _ref3 : Infinity; // TODO type

          babelHelpers.get(babelHelpers.getPrototypeOf(RepeatBlock.prototype), "_update", this).call(this, {
            mask: 'm'.repeat(Math.max(this.repeatTo === Infinity && ((_this$_blocks = this._blocks) == null ? void 0 : _this$_blocks.length) || 0, this.repeatFrom)),
            blocks: {
              m: block
            },
            eager: block.eager,
            overwrite: block.overwrite,
            skipInvalid: block.skipInvalid,
            lazy: block.lazy,
            placeholderChar: block.placeholderChar,
            displayChar: block.displayChar
          });
        }
      }, {
        key: "_allocateBlock",
        value: function _allocateBlock(bi) {
          if (bi < this._blocks.length) return this._blocks[bi];
          if (this.repeatTo === Infinity || this._blocks.length < this.repeatTo) {
            this._blocks.push(createMask(this._blockOpts));
            this.mask += 'm';
            return this._blocks[this._blocks.length - 1];
          }
        }
      }, {
        key: "_appendCharRaw",
        value: function _appendCharRaw(ch, flags) {
          if (flags === void 0) {
            flags = {};
          }
          var details = new ChangeDetails();
          for (var bi = (_this$_mapPosToBlock$ = (_this$_mapPosToBlock = this._mapPosToBlock(this.displayValue.length)) == null ? void 0 : _this$_mapPosToBlock.index) != null ? _this$_mapPosToBlock$ : Math.max(this._blocks.length - 1, 0), block, allocated;
          // try to get a block or
          // try to allocate a new block if not allocated already
          block = (_this$_blocks$bi = this._blocks[bi]) != null ? _this$_blocks$bi : allocated = !allocated && this._allocateBlock(bi); ++bi) {
            var _this$_mapPosToBlock$, _this$_mapPosToBlock, _this$_blocks$bi, _flags$_beforeTailSta;
            var blockDetails = block._appendChar(ch, _objectSpread(_objectSpread({}, flags), {}, {
              _beforeTailState: (_flags$_beforeTailSta = flags._beforeTailState) == null || (_flags$_beforeTailSta = _flags$_beforeTailSta._blocks) == null ? void 0 : _flags$_beforeTailSta[bi]
            }));
            if (blockDetails.skip && allocated) {
              // remove the last allocated block and break
              this._blocks.pop();
              this.mask = this.mask.slice(1);
              break;
            }
            details.aggregate(blockDetails);
            if (blockDetails.consumed) break; // go next char
          }

          return details;
        }
      }, {
        key: "_trimEmptyTail",
        value: function _trimEmptyTail(fromPos, toPos) {
          var _this$_mapPosToBlock2, _this$_mapPosToBlock3;
          if (fromPos === void 0) {
            fromPos = 0;
          }
          var firstBlockIndex = Math.max(((_this$_mapPosToBlock2 = this._mapPosToBlock(fromPos)) == null ? void 0 : _this$_mapPosToBlock2.index) || 0, this.repeatFrom, 0);
          var lastBlockIndex;
          if (toPos != null) lastBlockIndex = (_this$_mapPosToBlock3 = this._mapPosToBlock(toPos)) == null ? void 0 : _this$_mapPosToBlock3.index;
          if (lastBlockIndex == null) lastBlockIndex = this._blocks.length - 1;
          var removeCount = 0;
          for (var blockIndex = lastBlockIndex; firstBlockIndex <= blockIndex; --blockIndex, ++removeCount) {
            if (this._blocks[blockIndex].unmaskedValue) break;
          }
          if (removeCount) {
            this._blocks.splice(lastBlockIndex - removeCount + 1, removeCount);
            this.mask = this.mask.slice(removeCount);
          }
        }
      }, {
        key: "reset",
        value: function reset() {
          babelHelpers.get(babelHelpers.getPrototypeOf(RepeatBlock.prototype), "reset", this).call(this);
          this._trimEmptyTail();
        }
      }, {
        key: "remove",
        value: function remove(fromPos, toPos) {
          if (fromPos === void 0) {
            fromPos = 0;
          }
          if (toPos === void 0) {
            toPos = this.displayValue.length;
          }
          var removeDetails = babelHelpers.get(babelHelpers.getPrototypeOf(RepeatBlock.prototype), "remove", this).call(this, fromPos, toPos);
          this._trimEmptyTail(fromPos, toPos);
          return removeDetails;
        }
      }, {
        key: "totalInputPositions",
        value: function totalInputPositions(fromPos, toPos) {
          if (fromPos === void 0) {
            fromPos = 0;
          }
          if (toPos == null && this.repeatTo === Infinity) return Infinity;
          return babelHelpers.get(babelHelpers.getPrototypeOf(RepeatBlock.prototype), "totalInputPositions", this).call(this, fromPos, toPos);
        }
      }, {
        key: "state",
        get: function get() {
          return babelHelpers.get(babelHelpers.getPrototypeOf(RepeatBlock.prototype), "state", this);
        },
        set: function set(state) {
          this._blocks.length = state._blocks.length;
          this.mask = this.mask.slice(0, this._blocks.length);
          babelHelpers.set(babelHelpers.getPrototypeOf(RepeatBlock.prototype), "state", state, this, true);
        }
      }]);
      return RepeatBlock;
    }(MaskedPattern);
    IMask.RepeatBlock = RepeatBlock;
    try {
      globalThis.IMask = IMask;
    } catch (_unused4) {}
    exports.ChangeDetails = ChangeDetails;
    exports.ChunksTailDetails = ChunksTailDetails;
    exports.DIRECTION = DIRECTION;
    exports.HTMLContenteditableMaskElement = HTMLContenteditableMaskElement;
    exports.HTMLInputMaskElement = HTMLInputMaskElement;
    exports.HTMLMaskElement = HTMLMaskElement;
    exports.InputMask = InputMask;
    exports.MaskElement = MaskElement;
    exports.Masked = Masked;
    exports.MaskedDate = MaskedDate;
    exports.MaskedDynamic = MaskedDynamic;
    exports.MaskedEnum = MaskedEnum;
    exports.MaskedFunction = MaskedFunction;
    exports.MaskedNumber = MaskedNumber;
    exports.MaskedPattern = MaskedPattern;
    exports.MaskedRange = MaskedRange;
    exports.MaskedRegExp = MaskedRegExp;
    exports.PIPE_TYPE = PIPE_TYPE;
    exports.PatternFixedDefinition = PatternFixedDefinition;
    exports.PatternInputDefinition = PatternInputDefinition;
    exports.RepeatBlock = RepeatBlock;
    exports.createMask = createMask;
    exports.createPipe = createPipe;
    exports["default"] = IMask;
    exports.forceDirection = forceDirection;
    exports.normalizeOpts = normalizeOpts;
    exports.pipe = pipe;
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
  });

  var Contact = /*#__PURE__*/function () {
    function Contact() {
      babelHelpers.classCallCheck(this, Contact);
      this.createDialog();
      this.initCreateContact();
    }
    babelHelpers.createClass(Contact, [{
      key: "show",
      value: function show() {
        if (!this.dialog.isShown()) {
          this.dialog.show();
          this.initMask();
        }
      }
    }, {
      key: "initMask",
      value: function initMask() {
        var phoneInput = document.getElementById('tel');
        IMask(phoneInput, {
          mask: '+{7} (000) 000-00-00'
        });
      }
    }, {
      key: "createDialog",
      value: function createDialog() {
        var node = '';
        var context = this;
        this.dialog = BX.PopupWindowManager.create('create', node, {
          content: context.getForm(),
          offsetTop: 1,
          offsetLeft: 0,
          width: 400,
          lightShadow: true,
          closeIcon: true,
          closeByEsc: true,
          padding: 0,
          autoHide: true,
          overlay: true,
          titleBar: {
            content: BX.create("h2", {
              html: 'Создать контакт',
              props: {
                className: 'form-title'
              }
            })
          }
        });
      }
    }, {
      key: "createContact",
      value: function createContact(event) {
        var formData = new FormData(document.getElementById('create-contact'));
        this.request(Object.fromEntries(formData.entries()));
      }
    }, {
      key: "initCreateContact",
      value: function initCreateContact() {
        var form = document.getElementById('create');
        form.addEventListener('submit', function (event) {
          event.preventDefault();
          var formData = new FormData(event.target);
          this.request(Object.fromEntries(formData));
        }.bind(this));
      }
    }, {
      key: "request",
      value: function request(contact) {
        BX.ajax.runComponentAction('custom:crm.deal.create', 'createContact', {
          mode: 'ajax',
          data: {
            contact: contact
          }
        }).then(function (response) {
          BX.UI.Notification.Center.notify({
            content: "Контакт успешно создан"
          });
          this.dialog.close();
        }.bind(this), function (response) {
          BX.UI.Notification.Center.notify({
            content: "\u041E\u0448\u0438\u043A\u0430 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u0430. ".concat(response.errors[0].message)
          });
          this.dialog.close();
        });
      }
    }, {
      key: "getForm",
      value: function getForm() {
        var div = document.createElement('div');
        div.innerHTML = "\n           <form class=\"ui-form\" id=\"create-contact\">\n                <div class=\"ui-form-row\">\n                    <div class=\"ui-form-label\">\n                        <div class=\"ui-ctl-label-text\">\u0424\u0430\u043C\u0438\u043B\u0438\u044F</div>\n                    </div>\n                    <div class=\"ui-form-content\">\n                        <div class=\"ui-ctl ui-ctl-textbox ui-ctl-w100\">\n                            <input \n                                type=\"text\" \n                                class=\"ui-ctl-element\" \n                                placeholder=\"\"\n                                name=\"LAST_NAME\"\n                                >\n                        </div>\n                    </div>\n                </div>\n                <div class=\"ui-form-row\">\n                    <div class=\"ui-form-label\">\n                        <div class=\"ui-ctl-label-text\">\u0418\u043C\u044F</div>\n                    </div>\n                    <div class=\"ui-form-content\">\n                        <div class=\"ui-ctl ui-ctl-textbox ui-ctl-w100\">\n                            <input \n                                type=\"text\" \n                                class=\"ui-ctl-element\" \n                                placeholder=\"\"\n                                name=\"NAME\"\n                                required\n                                >\n                        </div>\n                    </div>\n                </div>\n                <div class=\"ui-form-row\">\n                    <div class=\"ui-form-label\">\n                        <div class=\"ui-ctl-label-text\">\u041E\u0442\u0447\u0435\u0441\u0442\u0432\u043E</div>\n                    </div>\n                    <div class=\"ui-form-content\">\n                        <div class=\"ui-ctl ui-ctl-textbox ui-ctl-w100\">\n                            <input \n                                type=\"text\" \n                                class=\"ui-ctl-element\" \n                                placeholder=\"\"\n                                name=\"SECOND_NAME\"\n                                >\n                        </div>\n                    </div>\n                </div>\n                <div class=\"ui-form-row\">\n                    <div class=\"ui-form-label\">\n                        <div class=\"ui-ctl-label-text\">\u0422\u0435\u043B\u0435\u0444\u043E\u043D</div>\n                    </div>\n                    <div class=\"ui-form-content\">\n                        <div class=\"ui-ctl ui-ctl-textbox ui-ctl-w100\">\n                            <input \n                                type=\"text\" \n                                id=\"tel\" \n                                class=\"ui-ctl-element tel\" \n                                placeholder=\"\"\n                                name=\"PHONE\"\n                                required\n                                >\n                        </div>\n                    </div>\n                </div>\n                <div class=\"ui-btn-container ui-btn-container-center\">\n                    <input\n                            type=\"submit\"\n                            class=\"ui-btn ui-btn-success\"\n                            name=\"submit\"\n                            value=\"\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C\"\n                    >\n                </div>\n             </form>\n        ";
        return div;
      }
    }]);
    return Contact;
  }();

  var Crmdeal = /*#__PURE__*/function () {
    function Crmdeal() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        targetNode: ''
      };
      babelHelpers.classCallCheck(this, Crmdeal);
      this.targetNode = options.targetNode;
      this.contactForm = new Contact();
    }
    babelHelpers.createClass(Crmdeal, [{
      key: "init",
      value: function init() {
        this.searchContacts();
        this.createDialog();
      }
    }, {
      key: "searchContacts",
      value: function searchContacts() {
        if (this.targetNode) {
          this.targetNode.addEventListener('input', function (event) {
            this.getContacts(this.targetNode.value);
          }.bind(this));
          this.targetNode.addEventListener('blur', function (event) {
            if (this.dataset['id'] === '') this.value = '';
          });
        }
      }
    }, {
      key: "getContacts",
      value: function getContacts() {
        var fio = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        BX.ajax.runComponentAction('custom:crm.deal.create', 'getContacts', {
          mode: 'ajax',
          data: {
            fio: fio
          }
        }).then(function (response) {
          var list = this.getEmptyList();
          if (response.data.length > 0) {
            list = this.getListContact(response.data);
          }
          if (response.data.length === 0) {
            this.targetNode.dataset['id'] = '';
          }
          this.dialog.setContent(list);
        }.bind(this), function (response) {
          console.error(response);
        });
      }
    }, {
      key: "createDialog",
      value: function createDialog() {
        var node = this.targetNode;
        var dialog = BX.PopupWindowManager.create('search', node, {
          content: '',
          autoHide: true,
          offsetTop: 1,
          offsetLeft: 0,
          lightShadow: true,
          closeIcon: false,
          closeByEsc: true,
          width: 263,
          angle: false,
          padding: 0
        });
        BX.bind(node, 'input', BX.delegate(function () {
          if (!dialog.isShown()) {
            dialog.show();
          }
        }, this));
        this.dialog = dialog;
      }
    }, {
      key: "getEmptyList",
      value: function getEmptyList() {
        var ul = document.createElement('ul');
        ul.setAttribute('class', 'contact-items');
        var li = document.createElement('li');
        var div = document.createElement('div');
        div.innerText = 'создать новый контакт';
        BX.bind(div, 'click', BX.proxy(function () {
          console.log('создать новый контакт');
          this.contactForm.show();
        }, this));
        li.appendChild(div);
        ul.appendChild(li);
        return ul;
      }
    }, {
      key: "getListContact",
      value: function getListContact() {
        var _this = this;
        var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var li = null;
        var ul = document.createElement('ul');
        ul.setAttribute('class', 'contact-items');
        items.forEach(function (item) {
          li = document.createElement('li');
          li.setAttribute('class', '');
          li.setAttribute('data-id', item['ID']);
          li.innerText = item['FULL_NAME'];
          BX.bind(li, 'click', BX.proxy(function () {
            this.updSelectedContact(item);
          }, _this));
          ul.appendChild(li);
        });
        return ul;
      }
    }, {
      key: "updSelectedContact",
      value: function updSelectedContact(item) {
        this.targetNode.value = item['FULL_NAME'];
        this.targetNode.setAttribute('data-id', item['ID']);
      }
    }]);
    return Crmdeal;
  }();

  exports.Crmdeal = Crmdeal;

}((this.BX.Custom = this.BX.Custom || {}),BX));
//# sourceMappingURL=crmdeal.bundle.js.map
