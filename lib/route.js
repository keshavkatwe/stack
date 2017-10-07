'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stackCore = require('./stack-core');

var _stackCore2 = _interopRequireDefault(_stackCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Route = function (_Stack$Component) {
  _inherits(Route, _Stack$Component);

  function Route(props) {
    _classCallCheck(this, Route);

    var _this = _possibleConstructorReturn(this, (Route.__proto__ || Object.getPrototypeOf(Route)).call(this, props));

    _this.onHashChanged = _this.onHashChanged.bind(_this);
    _this.state = {
      isCurrentRoute: false,
      params: null
    };

    return _this;
  }

  _createClass(Route, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      window.addEventListener('hashchange', this.onHashChanged);
      this.loadRoute();
    }
  }, {
    key: 'onHashChanged',
    value: function onHashChanged(newURL) {
      this.loadRoute(newURL);
    }
  }, {
    key: 'loadRoute',
    value: function loadRoute() {
      var variableNames = [];

      if (this.props.path == '*') {
        this.props.path = '/' + this.props.path;
      }

      var route = this.props.path.replace(/([:*])(\w+)/g, function (full, dots, name) {
        variableNames.push(name);
        return '([^\/]+)';
      }) + '(?:\/|$)';

      var hashURL = window.location.href.split('#')[1] || '';

      if (hashURL == '') {
        window.location.hash = '#/';
      }

      if (hashURL[0] != '/') {
        hashURL = '/' + hashURL;
      }

      var match = hashURL.match(new RegExp(route));

      if (match) {

        var params = match.slice(1, match.length).reduce(function (params, value, index) {
          if (params === null) params = {};
          params[variableNames[index]] = value;
          return params;
        }, null);

        this.setState({
          isCurrentRoute: true,
          params: params
        });
      } else {
        this.setState({
          isCurrentRoute: false,
          params: null
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.state.isCurrentRoute) {
        return _stackCore2.default.createElement(this.props.component, { params: this.state.params });
      }
      return null;
    }
  }]);

  return Route;
}(_stackCore2.default.Component);

exports.default = Route;
module.exports = exports['default'];