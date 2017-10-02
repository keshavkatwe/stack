import Stack from './stack-core';

class Route extends Stack.Component {
  constructor(props) {
    super(props);
    this.onHashChanged = this.onHashChanged.bind(this);
    this.state = {
      isCurrentRoute: false,
      params: null
    }

  }

  componentDidMount() {
    window.addEventListener('hashchange', this.onHashChanged);
    this.loadRoute();
  }

  onHashChanged(newURL) {
    this.loadRoute(newURL);
  }

  loadRoute() {
    let variableNames = [];
    let route = this.props.path.replace(/([:*])(\w+)/g, function (full, dots, name) {
      variableNames.push(name);
      return '([^\/]+)';
    }) + '(?:\/|$)';

    let hashURL = window.location.href.split('#')[1] || '';
    let match = hashURL.match(new RegExp(route));


    if (match) {

      let params = match
        .slice(1, match.length)
        .reduce((params, value, index) => {
          if (params === null) params = {};
          params[variableNames[index]] = value;
          return params;
        }, null);

      this.setState({
        isCurrentRoute: true,
        params: params
      });
    }
    else {
      this.setState({
        isCurrentRoute: false,
        params: null
      });
    }

  }


  render() {
    if (this.state.isCurrentRoute) {
      return Stack.createElement(this.props.component, {params: this.state.params});
    }
    return null;
  }
}

export default Route
