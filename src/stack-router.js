import Stack from './stack';
import Helper from './helper';

export class Router extends Stack.Component {
  constructor(props) {
    super(props);
    this.onHashChanged = this.onHashChanged.bind(this);
    this.state = {
      component: null
    }
  }

  componentDidMount() {
    window.addEventListener("hashchange", this.onHashChanged);
    this.loadRoute();
  }

  onHashChanged(newURL) {
    this.loadRoute();
  }

  loadRoute() {
    const url = location.hash.replace("#", '');
    Helper.forEach(this.props.children, (item) => {
      if (item.props.path == url) {
        if (this._currentElement) {
          this._currentElement._instance.componentWillUnmount()
        }
        this.loadComponent(Stack.createElement(item.props.component));
      }
    });
  }


  loadComponent(item) {
    this.setState({
      component: item
    })
  }

  render() {
    return (
      this.state.component
    );
  }
}

export class Route extends Stack.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<h2>Route {this.props.path}</h2>);
  }
}
