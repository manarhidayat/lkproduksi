import moment from 'moment';
import duration from 'moment-duration-format';
import {Alert} from 'react-native';

const formatDateDefault = [
  'YYYY-MM-DD HH:mm:ss',
  'DD-MM-YYYY HH:mm:ss',
  'YYYY-MM-DD',
  'DD-MM-YYYY',
];

class TextUtil {
  strReplace = (source, replace, replaceWith) => {
    var value = source;
    var i = 0;
    for (i; i < value.length; i++) {
      value = value.replace(replace, replaceWith);
    }
    console.log(value);
    return value;
  };

  upperCaseString = (i) => {
    if (typeof i === 'string') {
      return i.toUpperCase();
    }
    return i;
  };

  formatTimeCountDown(value) {
    var time;
    if (value < 60) {
      if (value < 10) {
        time = '00:0' + value;
      } else {
        time = '00:' + value;
      }
    } else {
      time = moment.duration(value, 'seconds').format('mm:ss');
    }
    return time;
  }

  formattingNumber = (i) => {
    if (typeof i === 'number') {
      return i.toLocaleString(navigator.language, {minimumFractionDigits: 0});
    }
    return i;
  };

  validateEmail = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      return false;
    } else {
      return true;
    }
  };

  getDate(value, newFormat = null) {
    if (newFormat == null) {
      newFormat = 'DD MMMM YYYY';
    }
    let date = moment(value, formatDateDefault).format(newFormat);
    return date;
  }

  getCurrentDate() {
    let date = moment(new Date()(), 'DD-MM-YYYY').format();
    return date;
  }

  getDateTime(value) {
    let date = moment(value, formatDateDefault).format('DD MMMM YYYY HH:mm');
    return date;
  }

  getDateNotif(value) {
    let date = moment(value, formatDateDefault).format('DD MMMM, HH:mm A');
    return date;
  }

  getDateTime2(value) {
    let date = moment(value, formatDateDefault).format('DD MMMM YYYY HH:mm');
    return date;
  }

  getFullDay(value) {
    let date = moment(value, formatDateDefault).format('dddd, DD MMMM YYYY');
    return date;
  }

  getTime(value) {
    let date = moment(value, formatDateDefault).format('HH:mm:ss');
    return date;
  }

  getHour(value) {
    let date = moment(value, formatDateDefault).format('HH:mm A');
    return date;
  }

  formatMoney(num) {
    num = num + '';

    if (num == '' || num == '0') {
      return '';
    }

    num = num.replace(/\./g, '');
    var num_parts = num.toString().split('.');
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return num_parts.join('.');
  }

  formatNpwp(num) {
    let newFormat = num.replace(/\./g, '');
    // newFormat = num.replace(/-/g, "");

    if (newFormat.length >= 2) {
      newFormat = newFormat.slice(0, 2) + '.' + newFormat.slice(2);
    }
    if (newFormat.length >= 6) {
      newFormat = newFormat.slice(0, 6) + '.' + newFormat.slice(6);
    }
    if (newFormat.length >= 10) {
      newFormat = newFormat.slice(0, 10) + '.' + newFormat.slice(10);
    }
    if (newFormat.length >= 12) {
      newFormat = newFormat.slice(0, 12) + '-' + newFormat.slice(12);
    }
    if (newFormat.length >= 16) {
      newFormat = newFormat.slice(0, 16) + '.' + newFormat.slice(16);
    }

    return newFormat;
  }

  blurName(name) {
    if (name.length > 3) {
      name = name.slice(0, -3);
      name = name + '***';
      return name;
    } else {
      return name;
    }
  }

  timeSince(date) {
    const FORMAT = 'DD-MM-yyyy HH:mm:ss';
    const theDate = moment(date, FORMAT);

    var seconds = Math.floor((new Date() - theDate) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + ' years ago';
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + ' months ago';
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + ' days ago';
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + ' hours ago';
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + ' minutes ago';
    }
    return Math.floor(seconds) + ' seconds ago';
  }

  blurName(name) {
    name = name.slice(0, -3);
    name = name + '***';
    return name;
  }
}

export default new TextUtil();
