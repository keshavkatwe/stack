'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Route = exports.Router = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stack = require('./stack');

var _stack2 = _interopRequireDefault(_stack);

var _helper = require('./helper');

var _helper2 = _interopRequireDefault(_helper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Router = exports.Router = function (_Stack$Component) {
  _inherits(Router, _Stack$Component);

  function Router(props) {
    _classCallCheck(this, Router);

    var _this = _possibleConstructorReturn(this, (Router.__proto__ || Object.getPrototypeOf(Router)).call(this, props));

    _this.onHashChanged = _this.onHashChanged.bind(_this);
    _this.state = {
      component: null
    };
    return _this;
  }

  _createClass(Router, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      window.addEventListener("hashchange", this.onHashChanged);
      this.loadRoute();
    }
  }, {
    key: 'onHashChanged',
    value: function onHashChanged(newURL) {
      this.loadRoute();
    }
  }, {
    key: 'loadRoute',
    value: function loadRoute() {
      var _this2 = this;

      var url = location.hash.replace("#", '');
      _helper2.default.forEach(this.props.children, function (item) {
        if (item.props.path == url) {
          if (_this2._currentElement) {
            _this2._currentElement._instance.componentWillUnmount();
          }
          _this2.loadComponent(_stack2.default.createElement(item.props.component));
        }
      });
    }
  }, {
    key: 'loadComponent',
    value: function loadComponent(item) {
      this.setState({
        component: item
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return this.state.component;
    }
  }]);

  return Router;
}(_stack2.default.Component);

var Route = exports.Route = function (_Stack$Component2) {
  _inherits(Route, _Stack$Component2);

  function Route(props) {
    _classCallCheck(this, Route);

    return _possibleConstructorReturn(this, (Route.__proto__ || Object.getPrototypeOf(Route)).call(this, props));
  }

  _createClass(Route, [{
    key: 'render',
    value: function render() {
      return _stack2.default.createElement(
        'h2',
        null,
        'Route ',
        this.props.path
      );
    }
  }]);

  return Route;
}(_stack2.default.Component);