type AlertType = 'info' | 'warn' | 'error' | 'success' | 'notif';

export type DropdownType = {
  alertWithType: (type: AlertType, title: string, message: string) => void
};

class DropDownHolder {
  instance = undefined;

  constructor() {
    this.setInstance = this.setInstance.bind(this);
    this.setModalInstance = this.setModalInstance.bind(this);
    this.alert = this.alert.bind(this);
  }

  setInstance(instance) {
    this.instance = instance;
  }

  setModalInstance(instance) {
    this.modalInstance = instance;
  }

  alert(
    type: AlertType,
    title: string,
    message: string,
    payload: any,
    interval: number
  ) {
    let instance = this.modalInstance || this.instance;
    if (instance) {
      instance.alertWithType(type, title, message, payload, interval);
    }
  }
}

export default new DropDownHolder();
