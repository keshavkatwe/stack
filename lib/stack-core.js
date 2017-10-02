'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _helper = require('./helper');

var _helper2 = _interopRequireDefault(_helper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Stack = {
  createElement: function createElement(tag, config, children) {
    var vNode = void 0;
    if (typeof tag == 'function') {
      vNode = this.createVComponent(tag, config, children);
    } else {
      vNode = this.createVElement(tag, config, children);
    }

    return vNode;
  },
  update: function update(prevElement, nextElement, parentNode) {

    if (nextElement == null) {
      this.deleteDom(prevElement, parentNode);
    } else if (prevElement == undefined) {
      this.mount(nextElement, parentNode);
    }
    //Implement the first assumption!
    else if (prevElement.tag === nextElement.tag) {
        //Inspect the type. If the `tag` is a string
        //we have a `vElement`. (we should actually
        //made some helper functions for this ;))
        if (typeof prevElement.tag === 'string') {
          Stack.updateVElement(prevElement, nextElement);
        } else if (typeof prevElement.tag === 'function') {
          this.updateVComponent(prevElement, nextElement, parentNode);
        }
      } else {
        debugger;
        var updateDom = this.mount(nextElement, parentNode, true);
        parentNode.replaceChild(updateDom, prevElement.dom);
      }
  },
  createVElement: function createVElement(tag, config) {
    var children = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    var _ref = config || {},
        className = _ref.className,
        style = _ref.style;

    var events = {};

    _helper2.default.forEach(config, function (attr, key) {
      if (key.substr(0, 2) == 'on') {
        events[key.substr(2).toLowerCase()] = attr;
      }
    });

    var attrs = _helper2.default.filter(config, function (item, key) {
      return !(key == 'className' || key == 'style' || key.substr(0, 2) == 'on');
    });

    return {
      tag: tag,
      className: className || null,
      style: style || null,
      props: {
        children: children
      },
      dom: null,
      events: events,
      attrs: attrs
    };
  },
  updateVElement: function updateVElement(prevElement, nextElement) {
    //get the native DOMnode information.
    var dom = prevElement.dom;
    //store the native DOMnode information.
    //on our nextElement.
    nextElement.dom = dom;

    if (nextElement.props.children) {
      this.updateChildren(prevElement.props.children, nextElement.props.children, dom);
    }

    if (prevElement.style !== nextElement.style) {
      _helper2.default.forEach(nextElement.style, function (styleValue, styleKey) {
        dom.style[styleKey] = styleValue;
      });
    }

    if (prevElement.className !== nextElement.className) {
      dom.className = nextElement.className || '';
    }
  },
  updateVComponent: function updateVComponent(prevElement, nextElement, parentNode) {
    if (prevElement.tag === nextElement.tag) {
      nextElement._instance = prevElement._instance;
      // nextElement._instance.props = nextElement.props;
      // nextElement._instance.updateComponent();

      nextElement._instance.componentWillReceiveProps(nextElement.props);
    }
  },
  updateChildren: function updateChildren(prevChildren, nextChildren, parentDOMNode) {
    // debugger;

    if (!Array.isArray(nextChildren)) {
      nextChildren = [nextChildren];
    }
    if (!Array.isArray(prevChildren)) {
      prevChildren = [prevChildren];
    }

    for (var i = 0; i < nextChildren.length; i++) {
      //We're skipping a lot of cases here. Like what if
      //the children array have different lenghts? Then we
      //should replace smartly etc. :)
      var nextChild = nextChildren[i];
      var prevChild = prevChildren[i];

      if (Array.isArray(prevChild) || Array.isArray(nextChild)) {
        // debugger;
        this.updateChildren(prevChild, nextChild, parentDOMNode);
      } else {
        //Check if the vNode is a vText
        if ((typeof nextChild === 'string' || typeof nextChild === 'number') && (typeof prevChild === 'string' || typeof prevChild === 'number')) {
          //We're taking a shortcut here. It would cleaner to
          //let the `update` function handle it, but we would to add some extra
          //logic because we don't have a `tag` property.
          this.updateVText(prevChild, nextChild, parentDOMNode);
          continue;
        } else {
          this.update(prevChild, nextChild, parentDOMNode);
        }
      }
    }

    if (prevChildren.length > nextChildren.length) {
      var extraDomCount = prevChildren.length - nextChildren.length;

      for (var _i = 0; _i < extraDomCount; _i++) {
        this.deleteDom(prevChildren[prevChildren.length - _i - 1], parentDOMNode);
      }
    }
  },
  deleteDom: function deleteDom(vNode, parentNode) {
    if (vNode) {
      this.triggerComponentUnMounts(vNode);
      parentNode.removeChild(vNode.dom);
    }
  },
  triggerComponentUnMounts: function triggerComponentUnMounts(vNode) {
    var _this = this;

    if (vNode != null && typeof vNode != 'string' && typeof vNode != 'number') {

      // debugger;
      if (typeof vNode.tag == 'function') {
        vNode._instance.componentWillUnmount();
        this.triggerComponentUnMounts(vNode._instance._currentElement);
      } else {
        _helper2.default.forEach(vNode.props.children, function (child) {
          _this.triggerComponentUnMounts(child, vNode.dom);
        });
      }
    }
  },
  updateVText: function updateVText(prevText, nextText, parentDOM) {
    if (prevText !== nextText) {
      parentDOM.firstChild.nodeValue = nextText;
    }
  },
  createVComponent: function createVComponent(tag, props) {
    var children = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    if (!props) {
      props = {};
    }

    props.children = children;
    return {
      tag: tag,
      props: props,
      dom: null
    };
  },
  mount: function mount(input, parentDOMNode) {
    var _this2 = this;

    var isUpdate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


    // debugger;

    //Hmmm lets see what input is.
    if (typeof input === 'string' || typeof input === 'number') {
      //we have a vText
      this.mountVText(input, parentDOMNode);
    } else if (typeof input.tag == 'function') {
      return this.mountVComponent(input, parentDOMNode);
    } else if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) == 'object' && _helper2.default.isArray(input)) {
      _helper2.default.forEach(input, function (child) {
        _this2.mount(child, parentDOMNode);
      });
    } else {
      //we have a vElement
      return this.mountVElement(input, parentDOMNode, isUpdate);
    }
  },
  mountVComponent: function mountVComponent(vComponent, parentDOMNode) {
    var tag = vComponent.tag,
        props = vComponent.props;

    // build a component instance. This uses the
    // defined Component class. For brevity
    // call it Component. Not needed ofcourse, new tag(props)
    // would do the same.

    var Component = tag;
    var instance = new Component(props);

    // The instance or Component has a render() function
    // that returns the user-defined vNode.
    var nextRenderedElement = instance.render();

    instance._currentElement = nextRenderedElement;
    instance._parentNode = parentDOMNode;

    vComponent._instance = instance;

    if (!nextRenderedElement) {
      // console.error(`Render is not defined or empty in ${instance.constructor.name} class.`);
      instance.componentDidMount();
      return;
    }

    // the currentElement can be a vElement or a
    // vComponent. mountVComponent doenst't care. Let the mount()
    // handle that!


    var dom = this.mount(nextRenderedElement, parentDOMNode);

    instance.dom = dom;
    //save the instance for later
    //references!

    vComponent.dom = dom;

    //append the DOM we've created.
    parentDOMNode.appendChild(dom);
    instance.componentDidMount();

    return dom;
  },
  mountVText: function mountVText(vText, parentDOMNode) {
    // Oeeh we received a vText with it's associated parentDOMNode.
    // we can set it's textContent to the vText value.
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
    parentDOMNode.innerHTML += vText;
  },
  mountVElement: function mountVElement(vElement, parentDOMNode) {
    var _this3 = this;

    var isUpdate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var tag = vElement.tag,
        className = vElement.className,
        props = vElement.props,
        style = vElement.style,
        events = vElement.events,
        attrs = vElement.attrs;

    //create a native DOM node

    var domNode = document.createElement(tag);

    //for later reference save the DOM node
    //on our vElement
    vElement.dom = domNode;

    if (attrs) {
      _helper2.default.forEach(attrs, function (attr, key) {
        domNode[key] = attr;
      });
    }

    if (props && props.children) {
      _helper2.default.forEach(props.children, function (child) {
        _this3.mount(child, domNode);
      });
    }

    if (style) {
      _helper2.default.forEach(style, function (styleValue, styleKey) {
        domNode.style[styleKey] = styleValue;
      });
    }

    if (events) {
      _helper2.default.forEach(events, function (evt, key) {
        domNode.addEventListener(key, evt);
      });
    }

    //add className to native node
    if (className) {
      domNode.className = className;
    }

    if (!isUpdate) {
      //Append domNode to the DOM
      parentDOMNode.appendChild(domNode);
    }

    return domNode;
  }
};

var Component = function () {
  function Component(props) {
    _classCallCheck(this, Component);

    this.props = props || {};
    this.state = {};

    this._currentElement = null;
    this._pendingState = null;
    this._parentNode = null;
  }

  _createClass(Component, [{
    key: 'updateComponent',
    value: function updateComponent() {
      var prevState = this.state;
      var prevRenderedElement = this._currentElement;

      if (this._pendingState !== prevState) {
        this.state = this._pendingState;
      }
      //reset _pendingState
      this._pendingState = null;
      var nextRenderedElement = this.render();
      this._currentElement = nextRenderedElement;

      //get it in the native DOM
      Stack.update(prevRenderedElement, nextRenderedElement, this._parentNode);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {}
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {}
  }, {
    key: 'forceUpdate',
    value: function forceUpdate(callback) {
      this.updateComponent();
      if (callback) {
        callback();
      }
    }
  }, {
    key: 'setState',
    value: function setState(partialNewState, callback) {
      // Awesome things to come
      this._pendingState = Object.assign({}, this.state, partialNewState);
      this.updateComponent();
      if (callback) {
        callback();
      }
    }
  }, {
    key: 'render',
    value: function render() {}
  }]);

  return Component;
}();

exports.default = {
  Component: Component,
  createElement: function createElement(tag, config) {
    for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    return Stack.createElement(tag, config, children);
  },
  render: function render(input, parentDOMNode) {
    return Stack.mount(input, parentDOMNode);
  }
};
module.exports = exports['default'];