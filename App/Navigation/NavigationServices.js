import {CommonActions, StackActions} from '@react-navigation/native';

class NavigationServices {
  constructor() {
    this.setInstance = this.setInstance.bind(this);
    this.getInstance = this.getInstance.bind(this);
    this.navigate = this.navigate.bind(this);
    this.push = this.push.bind(this);
    this.pop = this.pop.bind(this);
    this.popToTop = this.popToTop.bind(this);
    this.getCurrentRoute = this.getCurrentRoute.bind(this);
  }

  setInstance(instance) {
    this.instance = instance;
  }

  navigate(name, options) {
    if (this.instance) {
      this.instance.navigate(name, options);
    }
  }

  replace(name, options) {
    if (this.instance) {
      const pushAction = StackActions.replace(name, options);
      this.instance.dispatch(pushAction);
    }
  }

  push(name, options) {
    if (this.instance) {
      const pushAction = StackActions.push(name, options);
      this.instance.dispatch(pushAction);
    }
  }

  popToTop(callback) {
    if (this.instance) {
      const instanceState = this.instance.getState();
      if (instanceState?.index > 0) {
        const pushActions = StackActions.popToTop();
        this.instance.dispatch(pushActions);
      }

      if (typeof callback === 'function') {
        callback();
      }
    }
  }

  pop(n) {
    if (this.instance) {
      if (typeof n === 'number') {
        const actions = StackActions.pop(n);
        this.instance.dispatch(actions);
      } else {
        this.instance.goBack();
      }
    }
  }

  setParams(params) {
    if (this.instance) {
      this.instance.dispatch(CommonActions.setParams(params));
    }
  }

  getCurrentRoute() {
    if (this.instance) {
      return this.instance.getCurrentRoute();
    }

    return undefined;
  }

  getInstance() {
    if (this.instance) {
      return this.instance;
    }

    return undefined;
  }
}

export default new NavigationServices();
