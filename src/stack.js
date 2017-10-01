import Helper from './helper';

let Stack = {

  createElement(tag, config, children) {
    let vNode;
    if (typeof tag == 'function') {
      vNode = this.createVComponent(tag, config, children);
    }
    else {
      vNode = this.createVElement(tag, config, children);
    }



    return vNode;
  },

  update(prevElement, nextElement, parentNode) {

    if (nextElement == null) {
      this.deleteDom(prevElement, parentNode);
    }
    else if (prevElement == undefined) {
      this.mount(nextElement, parentNode);
    }
    //Implement the first assumption!
    else if (prevElement.tag === nextElement.tag) {
      //Inspect the type. If the `tag` is a string
      //we have a `vElement`. (we should actually
      //made some helper functions for this ;))
      if (typeof prevElement.tag === 'string') {
        Stack.updateVElement(prevElement, nextElement);
      }
      else if (typeof prevElement.tag === 'function') {
        this.updateVComponent(prevElement, nextElement, parentNode);
      }
    } else {
      const updateDom = this.mount(nextElement, parentNode, true);
      parentNode.replaceChild(updateDom, prevElement.dom);
    }
  },

  createVElement(tag, config, children = []) {
    const {className, style} = config || {};
    let events = {};

    Helper.forEach(config, function (attr, key) {
      if (key.substr(0, 2) == 'on') {
        events[key.substr(2).toLowerCase()] = attr;
      }
    });

    let attrs = Helper.filter(config, (item, key) => {
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
    }
  },

  updateVElement(prevElement, nextElement) {
    //get the native DOMnode information.
    const dom = prevElement.dom;
    //store the native DOMnode information.
    //on our nextElement.
    nextElement.dom = dom;


    if (nextElement.props.children) {
      this.updateChildren(prevElement.props.children, nextElement.props.children, dom);
    }

    if (prevElement.style !== nextElement.style) {
      Helper.forEach(nextElement.style, function (styleValue, styleKey) {
        dom.style[styleKey] = styleValue;
      });
    }

    if (prevElement.className !== nextElement.className) {
      dom.className = nextElement.className || '';
    }

  },

  updateVComponent(prevElement, nextElement, parentNode) {
    if (prevElement.tag === nextElement.tag) {
      nextElement._instance = prevElement._instance;
      // nextElement._instance.props = nextElement.props;
      // nextElement._instance.updateComponent();

      nextElement._instance.componentWillReceiveProps(nextElement.props);
    }
  },

  updateChildren(prevChildren, nextChildren, parentDOMNode) {
    // debugger;

    if (!Array.isArray(nextChildren)) {
      nextChildren = [nextChildren];
    }
    if (!Array.isArray(prevChildren)) {
      prevChildren = [prevChildren];
    }



    for (let i = 0; i < nextChildren.length; i++) {
      //We're skipping a lot of cases here. Like what if
      //the children array have different lenghts? Then we
      //should replace smartly etc. :)
      const nextChild = nextChildren[i];
      const prevChild = prevChildren[i];


      if (Array.isArray(prevChild) || Array.isArray(nextChild))
      {
        // debugger;
        this.updateChildren(prevChild, nextChild, parentDOMNode);
      }
      else
      {
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
      const extraDomCount = prevChildren.length - nextChildren.length;

      for (let i = 0; i < extraDomCount; i++) {
        this.deleteDom(prevChildren[prevChildren.length - i - 1], parentDOMNode);
      }
    }
  },

  deleteDom(vNode, parentNode) {
    this.triggerComponentUnMounts(vNode);
    parentNode.removeChild(vNode.dom);
  },

  triggerComponentUnMounts(vNode) {
    if (typeof vNode != 'string' && typeof vNode !='number') {

      // debugger;
      if (typeof vNode.tag == 'function') {
        vNode._instance.componentWillUnmount();
        this.triggerComponentUnMounts(vNode._instance._currentElement);
      }
      else {
        Helper.forEach(vNode.props.children, (child) => {
          this.triggerComponentUnMounts(child, vNode.dom);
        });
      }
    }
  },

  updateVText(prevText, nextText, parentDOM) {
    if (prevText !== nextText) {
      parentDOM.firstChild.nodeValue = nextText;
    }
  },

  createVComponent(tag, props, children = []) {
    if (!props) {
      props = {};
    }

    props.children = children;
    return {
      tag: tag,
      props: props,
      dom: null,
    }
  },

  mount(input, parentDOMNode, isUpdate = false) {

    // debugger;

    //Hmmm lets see what input is.
    if (typeof input === 'string' || typeof input === 'number') {
      //we have a vText
      this.mountVText(input, parentDOMNode);
    } else if (typeof input.tag == 'function') {
      return this.mountVComponent(input, parentDOMNode);
    } else if (typeof input == 'object' && Helper.isArray(input)) {
      Helper.forEach(input, (child) => {
        this.mount(child, parentDOMNode)
      });
    }
    else {
      //we have a vElement
      return this.mountVElement(input, parentDOMNode, isUpdate);
    }
  },

  mountVComponent(vComponent, parentDOMNode) {
    const {tag, props} = vComponent;

    // build a component instance. This uses the
    // defined Component class. For brevity
    // call it Component. Not needed ofcourse, new tag(props)
    // would do the same.
    const Component = tag;
    const instance = new Component(props);

    // The instance or Component has a render() function
    // that returns the user-defined vNode.
    const nextRenderedElement = instance.render();

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



    const dom = this.mount(nextRenderedElement, parentDOMNode);



    instance.dom = dom;
    //save the instance for later
    //references!

    vComponent.dom = dom;


    //append the DOM we've created.
    parentDOMNode.appendChild(dom);
    instance.componentDidMount();

    return dom;
  },

  mountVText(vText, parentDOMNode) {
    // Oeeh we received a vText with it's associated parentDOMNode.
    // we can set it's textContent to the vText value.
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
    parentDOMNode.innerHTML += vText;
  },


  mountVElement(vElement, parentDOMNode, isUpdate = false) {
    const {tag, className, props, style, events, attrs} = vElement;

    //create a native DOM node
    const domNode = document.createElement(tag);

    //for later reference save the DOM node
    //on our vElement
    vElement.dom = domNode;

    if (attrs) {
      Helper.forEach(attrs, (attr, key) => {
        domNode[key] = attr;
      });
    }

    if (props && props.children) {
      Helper.forEach(props.children, (child) => {
        this.mount(child, domNode);
      });
    }


    if (style) {
      Helper.forEach(style, (styleValue, styleKey) => {
        domNode.style[styleKey] = styleValue;
      });
    }

    if (events) {
      Helper.forEach(events, (evt, key) => {
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

class Component {
  constructor(props) {
    this.props = props || {};
    this.state = {};

    this._currentElement = null;
    this._pendingState = null;
    this._parentNode = null;
  }


  updateComponent() {
    const prevState = this.state;
    const prevRenderedElement = this._currentElement;

    if (this._pendingState !== prevState) {
      this.state = this._pendingState;
    }
    //reset _pendingState
    this._pendingState = null;
    const nextRenderedElement = this.render();
    this._currentElement = nextRenderedElement;

    //get it in the native DOM
    Stack.update(prevRenderedElement, nextRenderedElement, this._parentNode);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentWillReceiveProps(props) {
  }

  forceUpdate(callback) {
    this.updateComponent();
    if (callback) {
      callback();
    }
  }

  setState(partialNewState, callback) {
    // Awesome things to come
    this._pendingState = Object.assign({}, this.state, partialNewState);
    this.updateComponent();
    if (callback) {
      callback();
    }
  }

  render() {

  }
}


export default {
  Component: Component,
  createElement: (tag, config, ...children) => Stack.createElement(tag, config, children),
  render: (input, parentDOMNode) => Stack.mount(input, parentDOMNode)
}
